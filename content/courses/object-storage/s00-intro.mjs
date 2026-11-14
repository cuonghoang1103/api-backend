import G00_8 from './giang/obj-00-8.mjs';
import G00_9 from './giang/obj-00-9.mjs';
import G00_1 from './giang/obj-00-1.mjs';
import G00_2 from './giang/obj-00-2.mjs';
const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';

export default {
  title: 'Section 0 — What object storage actually is|||Mục 0 — Object storage THẬT SỰ LÀ gì',
  slug: 'os-s0-intro',
  description: 'Ba bài về concept cơ bản: object storage ≠ file system, bucket/key/object model, S3 API là chuẩn de facto, R2 vs S3 vs GCS vs Azure Blob.',
  sortOrder: 1,
  lessons: [

    {
      title: 'Start here (1/2) — What object storage is, and why every app you use needs it|||Bắt đầu tại đây (1/2) — Object storage là gì, và vì sao mọi app bạn dùng đều cần nó',
      slug: 'os-0-0-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng nghe &quot;object storage&quot;: nó là gì (bằng hình ảnh đời thường trước), vì sao app không nhét ảnh của người dùng vào database hay ổ đĩa máy chủ, chuẩn S3 và Cloudflare R2, bạn gặp nó ở đâu (ngay trên site này — media.cuongthai.com), và khoá này sẽ cho bạn làm được gì.',
      content: `
${G00_8}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Hello. Before any API call, know what object storage is — and why</h2>
<p class="lead">Welcome. If you have never heard the words &quot;object storage&quot;, or you have uploaded an avatar in an app without ever wondering where that file actually went, this lesson is for you. No commands to memorise yet. In fifteen minutes you will know what object storage is, why apps do not keep user files in their database or on the web server, what the &quot;S3 API&quot; and &quot;Cloudflare R2&quot; are, and where you have been using object storage all along — including on this very website.</p>
<p>This lesson and the next are the front door of the course. Lesson 2 of the pair shows why it matters in money and in safety, and gives you a study plan. After that, lesson 0.1 compares object storage with the filesystem you already know, and 0.2 teaches the three concepts every API call rests on.</p>

<h3>What object storage is — an everyday picture first</h3>
<p>Forget the textbook definition for a moment. Picture a <strong>left-luggage counter</strong> at a train station. You hand over a bag, they give you a numbered ticket, and they put the bag on a shelf. You cannot reach into the bag later and swap one shirt — you take the whole bag out and hand in a new one. You cannot browse the shelves; you just present your ticket and get your bag back. And the counter does not care what is in the bag.</p>
<p>Object storage is exactly that, for files: you hand it a file, you choose the <strong>ticket</strong> (called a <em>key</em>, such as <code>users/42/avatars/me.jpg</code>), and it stores the <strong>whole file</strong> (called an <em>object</em>) on a huge distributed shelf (called a <em>bucket</em>). You get the file back by its key. You replace a file by uploading a whole new one — you never edit part of it.</p>
<div class="callout ok"><strong>One sentence to keep:</strong> object storage is an internet service that stores whole files as immutable &quot;objects&quot;, each addressed by a text &quot;key&quot;, inside a container called a &quot;bucket&quot; — reachable over HTTP from anywhere.</div>

<h3>Why not just use the database, or the server's disk?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Not the database</span><span class="v">Databases are built for small, structured, queryable rows. A 50 MB video turns a database slow and huge, and backups become painful. Keep the <em>metadata</em> in the DB, the <em>bytes</em> in object storage.</span></div>
  <div class="kv"><span class="k">Not the web server's disk</span><span class="v">If files live on one server's disk, a second server cannot see them, the disk fills up, and a redeploy or crash can wipe them. Object storage is shared, effectively unlimited, and durable (11 nines).</span></div>
  <div class="kv"><span class="k">Served fast, globally</span><span class="v">A bucket plus a CDN serves the same image from an edge near each user, so your app server never spends bandwidth on it.</span></div>
</div>

<h3>The S3 API and Cloudflare R2</h3>
<p>In 2006 Amazon launched <strong>S3</strong> (Simple Storage Service). Its HTTP API became so common that almost every other provider copied it: today &quot;S3-compatible&quot; is a standard, like USB. <strong>Cloudflare R2</strong> is one such S3-compatible service — the one this course and this repo use. The big reason to pick R2: it charges <strong>nothing for egress</strong> (bytes served out), where AWS S3 charges about $0.09 per GB. Lesson 2.1 does that math; for now just know R2 speaks the S3 API, so everything you learn transfers.</p>

<h3>Where you have already met it — on this site</h3>
<p>Open any avatar or post image on this website and look at its address: the host is <code>media.cuongthai.com</code>, not the app domain. That is a Cloudflare R2 bucket (<code>cuongthai-media-storage</code>) served through Cloudflare's CDN. Every avatar, every post photo and video, every course attachment and music track you see here is an object with a key like <code>posts/1234/media/clip.mp4</code>. This course teaches the exact system running under your feet.</p>

<h3>What you will be able to do by the end</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Upload and serve files correctly</span><span class="lz-lnote">PUT with the right Content-Type and Cache-Control; serve through a CDN; never list the bucket</span></div>
<div class="lz-layer"><span class="lz-lname">Let the browser upload directly</span><span class="lz-lnote">Presigned URLs + CORS, so big files never pass through your server</span></div>
<div class="lz-layer"><span class="lz-lname">Keep it cheap and safe</span><span class="lz-lnote">Egress math, private buckets, signed URLs, key rotation, lifecycle rules</span></div>
<div class="lz-layer"><span class="lz-lname">Diagnose the classic failures</span><span class="lz-lnote">403 SignatureDoesNotMatch, CORS preflight errors, stale CDN cache</span></div>
</div>

<div class="pitfall co-tieu-de"><strong>How beginners start in the wrong place.</strong> A new developer saves uploaded files with <code>fs.writeFile</code> into a folder next to the code, and it works on their laptop. Then they deploy to two servers behind a load balancer: half the image requests 404, because each server only has the files it personally received. Or the disk fills and the container restarts empty. Object storage exists precisely so that &quot;where did my upload go?&quot; has one answer for every server, forever.</div>

<h3>🧪 Practice (10–15 min — guaranteed to work)</h3>
<div class="callout ok"><ol>
<li>Open any app you use (a social network, a shop). Right-click a photo and choose &quot;Open image in new tab&quot;. Look at the <strong>host</strong> in the address bar — it is usually a storage or CDN domain, not the app's main domain.</li>
<li>On this website, open an avatar or a post image the same way and confirm the host is <code>media.cuongthai.com</code> — an R2 bucket served through a CDN.</li>
<li>Get ready for the hands-on lessons: install Docker <strong>and</strong> the AWS CLI (<code>aws --version</code> should print a version). Docker runs a local MinIO — the S3 <em>server</em>; the CLI is the <em>client</em> that talks to it. You need both: the CLI alone has nothing to talk to except a real bucket, and this course never touches a real bucket. (Since 2025 the image <code>minio/minio</code> can no longer be pulled from Docker Hub; the course uses <code>cgr.dev/chainguard/minio</code> — see "Run it yourself" below.)</li>
<li>Write one sentence in your own words: why would an app serve its images from <code>media.cuongthai.com</code> instead of from its own application server?</li>
</ol>
<p><strong>Done when:</strong> you have found at least one real image served from a storage/CDN host, you have a working <code>aws</code> CLI or Docker, and your one sentence does not say &quot;to save the database&quot; alone — it mentions shared access, bandwidth, or durability.</p></div>

<h3>🔬 Measured: one avatar, one key, on a real S3 server</h3>
<p>On the course Mac, MinIO (RELEASE.2026-11-12, in Docker) with the AWS CLI 2.31.22 — <strong>not</strong> the production bucket. Create a bucket, upload a 608-byte avatar under a key, ask for its metadata, read it back, then "change" it:</p>
<div class="out">$ export AWS_ENDPOINT_URL=http://localhost:20200    # MinIO của khoá, chạy trong Docker — KHÔNG phải bucket thật
$ aws s3 mb s3://anh-dai-dien
make_bucket: anh-dai-dien
$ aws s3 cp me.jpg s3://anh-dai-dien/users/42/avatars/me.jpg
upload: me.jpg -&gt; s3://anh-dai-dien/users/42/avatars/me.jpg
$ aws s3api head-object --bucket anh-dai-dien --key users/42/avatars/me.jpg --query '{Size:ContentLength,Type:ContentType,ETag:ETag}' --output text
"50c3808ca883b0fe6b0fa47c2dbd24c5"	608	image/jpeg
$ aws s3 cp s3://anh-dai-dien/users/42/avatars/me.jpg lay-lai.jpg &amp;&amp; cmp me.jpg lay-lai.jpg &amp;&amp; echo "giống hệt từng byte"
giống hệt từng byte
$ aws s3 cp me-moi.jpg s3://anh-dai-dien/users/42/avatars/me.jpg    # "đổi ảnh" = gửi CẢ tệp mới cùng key
upload: me-moi.jpg -&gt; s3://anh-dai-dien/users/42/avatars/me.jpg
$ aws s3api head-object --bucket anh-dai-dien --key users/42/avatars/me.jpg --query '{Size:ContentLength,Type:ContentType,ETag:ETag}' --output text
"1e4bb2b2b7efa6328064d362e4009e2f"	608	image/jpeg
$ aws s3 ls s3://anh-dai-dien --recursive
2026-11-14 10:22:59        608 users/42/avatars/me.jpg</div>
<p>Three things to notice. The "folders" <code>users/42/avatars/</code> are just characters in the key. <code>head-object</code> returns size, type and the <strong>ETag</strong> (a fingerprint of the content) without downloading anything. And "changing" the avatar was a whole new upload under the same key — the ETag changed, because there is no API to edit part of an object.</p>
<h3>🔬 Measured: two servers behind one load balancer</h3>
<p>Two tiny Node servers, A and B, behind a round-robin balancer (A, B, A, B…). One upload, then ten GETs. First each server saves to its own disk with <code>fs.writeFile</code>; then both save to one bucket:</p>
<div class="out">$ # Kiểu A — mỗi server lưu ảnh vào ổ đĩa của CHÍNH NÓ (fs.writeFile)
$ node hai-may.mjs dia
PUT ảnh (608 B) → 201 A đã lưu
10 lần GET: 404(B) 200(A) 404(B) 200(A) 404(B) 200(A) 404(B) 200(A) 404(B) 200(A)
⇒ 5 thấy ảnh · 5 lỗi 404
$ # Kiểu B — cả hai server lưu vào cùng một bucket (object storage)
$ node hai-may.mjs kho
PUT ảnh (608 B) → 201 A đã lưu
10 lần GET: 200(B) 200(A) 200(B) 200(A) 200(B) 200(A) 200(B) 200(A) 200(B) 200(A)
⇒ 10 thấy ảnh · 0 lỗi 404</div>
<p>With local disks, every GET that landed on B asked a disk that never saw the file: <strong>5 of 10 failed with 404</strong>. With one bucket, <strong>10 of 10</strong> found it. Add a third server and the local-disk number only gets worse.</p>
<h3>🔁 Run it yourself</h3>
<p>Install Docker and the AWS CLI, then (pick your own <code>&lt;access-key&gt;</code>/<code>&lt;secret-key&gt;</code>, at least 8 characters):</p>
<pre><code class="language-bash"><span class="tok-comment"># 1) A local S3 server (MinIO) — listening on your machine only</span>
docker run -d --name minio -p 127.0.0.1:9000:9000 -v minio-data:/data \\
  -e MINIO_ROOT_USER=&lt;access-key&gt; -e MINIO_ROOT_PASSWORD=&lt;secret-key&gt; \\
  cgr.dev/chainguard/minio:latest server /data
<span class="tok-comment"># 2) Point the AWS CLI at MinIO instead of AWS</span>
export AWS_ACCESS_KEY_ID=&lt;access-key&gt; AWS_SECRET_ACCESS_KEY=&lt;secret-key&gt;
export AWS_DEFAULT_REGION=us-east-1 AWS_ENDPOINT_URL=http://localhost:9000
aws s3 mb s3://anh-dai-dien
aws s3 cp me.jpg s3://anh-dai-dien/users/42/avatars/me.jpg
aws s3api head-object --bucket anh-dai-dien --key users/42/avatars/me.jpg</code></pre>
<p>For the two-server test: in a scratch folder <code>npm init -y && npm pkg set type=module && npm i @aws-sdk/client-s3@3.1071.0</code>, save this as <code>hai-may.mjs</code>, set <code>OBJ_ENDPOINT=http://localhost:9000</code> plus the AWS variables above, and run <code>node hai-may.mjs dia</code> then <code>node hai-may.mjs kho</code>.</p>
<pre><code class="language-javascript"><span class="tok-comment">// Hai server app sau một bộ cân tải luân phiên. Kiểu A: lưu ảnh vào Ổ ĐĨA của chính server. Kiểu B: lưu vào object storage (MinIO).</span>
import http from 'node:http';
import fs from 'node:fs';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });
const KIEU = process.argv[2];                                 <span class="tok-comment">  // 'dia' | 'kho'</span>
const BUCKET = 'anh-dai-dien';
function mayChu(ten, cong) {
  const thuMuc = &#96;./o-dia-\${ten}&#96;; fs.rmSync(thuMuc, { recursive: true, force: true }); fs.mkdirSync(thuMuc);
  return new Promise((ok) =&gt; http.createServer(async (req, res) =&gt; {
    const key = req.url.slice(1);                             <span class="tok-comment">  // /users/42/avatars/me.jpg ⇒ users/42/avatars/me.jpg</span>
    try {
      if (req.method === 'PUT') {
        const than = Buffer.concat(await Array.fromAsync(req));
        if (KIEU === 'dia') fs.writeFileSync(&#96;\${thuMuc}/\${key.replaceAll('/', '_')}&#96;, than);
        else await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: than, ContentType: 'image/jpeg' }));
        res.writeHead(201).end(&#96;\${ten} đã lưu&#96;);
      } else {
        const than = KIEU === 'dia' ? fs.readFileSync(&#96;\${thuMuc}/\${key.replaceAll('/', '_')}&#96;)
          : Buffer.from(await (await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))).Body.transformToByteArray());
        res.writeHead(200, { 'x-may': ten }).end(than);
      }
    } catch { res.writeHead(404, { 'x-may': ten }).end(); }
  }).listen(cong, ok));
}
await mayChu('A', 20211); await mayChu('B', 20212);
let luot = 0;                                                  <span class="tok-comment">  // bộ cân tải: A, B, A, B…</span>
await new Promise((ok) =&gt; http.createServer((req, res) =&gt; {
  const cong = luot++ % 2 === 0 ? 20211 : 20212;
  req.pipe(http.request({ port: cong, path: req.url, method: req.method, headers: req.headers }, (r) =&gt; { res.writeHead(r.statusCode, r.headers); r.pipe(res); }));
}).listen(20210, ok));
const anh = fs.readFileSync('me.jpg');
const up = await fetch('http://localhost:20210/users/7/avatars/me.jpg', { method: 'PUT', body: anh });
console.log(&#96;PUT ảnh (\${anh.length} B) → \${up.status} \${await up.text()}&#96;);
const dem = { 200: 0, 404: 0 }, dong = [];
for (let i = 1; i &lt;= 10; i++) {
  const r = await fetch('http://localhost:20210/users/7/avatars/me.jpg'); await r.arrayBuffer();
  dem[r.status]++; dong.push(&#96;\${r.status}(\${r.headers.get('x-may')})&#96;);
}
console.log(&#96;10 lần GET: \${dong.join(' ')}&#96;);
console.log(&#96;⇒ \${dem[200]} thấy ảnh · \${dem[404]} lỗi 404&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-1-nhan-file-multipart" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.1 — Receiving files: multipart, base64, and what it costs in RAM</span><span class="lc-sub">What happens on the server before a file ever reaches storage</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.2 — Object storage and presigned URLs</span><span class="lc-sub">The same idea from a Node.js backend, measured</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-7-2-volume" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 7.2 — Volumes, in depth</span><span class="lc-sub">Keeping data on ONE machine — and why that is not enough for two</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 12.4 — CDN and static files, and the object store</span><span class="lc-sub">Cache headers, renaming on change, and where the bytes live in production</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Object storage</span><span class="v">An internet service that stores whole files as immutable objects, each addressed by a key.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">One stored file plus its metadata — the &quot;bag&quot; in the left-luggage picture.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">The text name that addresses an object, e.g. <code>users/42/avatars/me.jpg</code> — the &quot;ticket&quot;.</span></div>
  <div class="kv"><span class="k">Bucket</span><span class="v">The container that holds objects — the &quot;shelf&quot;.</span></div>
  <div class="kv"><span class="k">S3 API</span><span class="v">Amazon's storage API, now a de-facto standard many providers implement.</span></div>
  <div class="kv"><span class="k">Cloudflare R2</span><span class="v">An S3-compatible service with zero egress fees; what this course and repo use.</span></div>
  <div class="kv"><span class="k">CDN</span><span class="v">A network of edge caches that serves a bucket's files from near each user.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Bytes served out of storage — the line AWS charges for and R2 does not.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Object storage keeps whole files as immutable objects, each named by a key, inside a bucket — like a left-luggage counter for files, reachable over HTTP.</li><li>Apps use it instead of the database (too big/slow for blobs) or the server disk (not shared, not durable); metadata goes in the DB, bytes go in storage.</li><li>The S3 API is the de-facto standard; Cloudflare R2 is an S3-compatible service with zero egress cost, which is why this repo uses it.</li><li>You have already used it here — every image on this site is an R2 object served as <code>media.cuongthai.com/...</code> through a CDN.</li><li>By the end you will upload/serve correctly, let browsers upload directly, keep it cheap and safe, and debug the classic failures.</li></ul>

<a class="link-card" href="https://aws.amazon.com/what-is/object-storage/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">AWS — What is object storage?</span><span class="lc-sub">Amazon's own plain introduction; matches the everyday picture above.</span></span>
</a>
<a class="link-card" href="https://developers.cloudflare.com/r2/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Cloudflare R2 documentation</span><span class="lc-sub">The S3-compatible, zero-egress service this course uses.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> &quot;Start here&quot; part 2 — why object storage matters in money and in safety (a surprise egress bill, a leaked public bucket, the SigV4 bug this repo caught in production), and a study plan.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Chào bạn. Trước khi gọi API nào, hãy biết object storage là gì — và vì sao</h2>
<p class="lead">Chào mừng bạn. Nếu bạn chưa từng nghe cụm &quot;object storage&quot;, hoặc đã từng upload ảnh đại diện trong một app mà chưa bao giờ tự hỏi file đó đi đâu, thì bài này viết cho bạn. Chưa có lệnh nào phải học thuộc. Trong mười lăm phút, bạn sẽ biết object storage là gì, vì sao app không giữ file người dùng trong database hay trên ổ đĩa máy chủ, &quot;S3 API&quot; và &quot;Cloudflare R2&quot; là gì, và bạn đã dùng object storage từ bao giờ — kể cả ngay trên trang web này.</p>
<p>Bài này và bài kế tiếp là cửa vào của cả khoá. Bài thứ hai cho thấy vì sao nó quan trọng về tiền và về an toàn, kèm một kế hoạch học. Sau đó bài 0.1 so object storage với filesystem bạn đã quen, và 0.2 dạy ba concept mà mọi API call dựa trên.</p>

<h3>Object storage là gì — nói bằng hình ảnh đời thường trước</h3>
<p>Tạm quên định nghĩa trong sách. Hãy hình dung một <strong>quầy giữ hành lý</strong> ở nhà ga. Bạn đưa một cái túi, họ đưa lại cho bạn một cái vé có số, rồi đặt túi lên kệ. Sau đó bạn không thò tay vào túi để thay mỗi một cái áo — bạn lấy cả túi ra rồi gửi vào một túi mới. Bạn cũng không lục kệ được; bạn chỉ chìa vé ra và nhận lại túi. Và quầy không quan tâm trong túi có gì.</p>
<p>Object storage đúng là như vậy, nhưng cho file: bạn đưa cho nó một file, bạn chọn cái <strong>vé</strong> (gọi là <em>key</em>, ví dụ <code>users/42/avatars/me.jpg</code>), và nó lưu <strong>cả file</strong> (gọi là <em>object</em>) lên một cái kệ phân tán khổng lồ (gọi là <em>bucket</em>). Bạn lấy lại file bằng key của nó. Bạn thay file bằng cách upload hẳn một file mới — không bao giờ sửa một phần.</p>
<div class="callout ok"><strong>Một câu để nhớ:</strong> object storage là một dịch vụ internet lưu nguyên các file dưới dạng &quot;object&quot; bất biến, mỗi object định danh bằng một &quot;key&quot; dạng chữ, nằm trong một container gọi là &quot;bucket&quot; — truy cập qua HTTP từ bất cứ đâu.</div>

<h3>Vì sao không dùng luôn database, hay ổ đĩa máy chủ?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không dùng database</span><span class="v">Database sinh ra cho dòng nhỏ, có cấu trúc, query được. Một video 50 MB làm database chậm và phình to, sao lưu thành cực hình. Hãy giữ <em>metadata</em> trong DB, <em>byte</em> trong object storage.</span></div>
  <div class="kv"><span class="k">Không dùng ổ đĩa máy chủ</span><span class="v">File nằm trên ổ của một server thì server thứ hai không thấy, ổ đầy, và một lần redeploy hay crash có thể xoá sạch. Object storage dùng chung, gần như vô hạn, và bền (11 số chín).</span></div>
  <div class="kv"><span class="k">Phục vụ nhanh, toàn cầu</span><span class="v">Bucket cộng CDN phục vụ cùng một ảnh từ một edge gần mỗi người dùng, nên server app không tốn băng thông cho nó.</span></div>
</div>

<h3>S3 API và Cloudflare R2</h3>
<p>Năm 2006 Amazon ra mắt <strong>S3</strong> (Simple Storage Service). API HTTP của nó phổ biến tới mức gần như mọi nhà cung cấp khác đều chép lại: ngày nay &quot;S3-compatible&quot; là một chuẩn, như cổng USB. <strong>Cloudflare R2</strong> là một dịch vụ S3-compatible như vậy — chính là cái khoá này và kho này dùng. Lý do lớn nhất chọn R2: nó <strong>không tính phí egress</strong> (byte phục vụ ra ngoài), trong khi AWS S3 tính khoảng $0,09 mỗi GB. Bài 2.1 sẽ tính con số đó; giờ chỉ cần biết R2 nói tiếng S3 API, nên mọi thứ bạn học đều chuyển được.</p>

<h3>Bạn đã gặp nó rồi — ngay trên site này</h3>
<p>Mở một ảnh đại diện hay ảnh bài viết bất kỳ trên trang web này và nhìn địa chỉ của nó: host là <code>media.cuongthai.com</code>, không phải tên miền của app. Đó là một bucket Cloudflare R2 (<code>cuongthai-media-storage</code>) phục vụ qua CDN của Cloudflare. Mọi ảnh đại diện, mọi ảnh/video bài viết, mọi tệp đính kèm khoá học và bản nhạc bạn thấy ở đây đều là một object với key kiểu <code>posts/1234/media/clip.mp4</code>. Khoá này dạy đúng cái hệ thống đang chạy dưới chân bạn.</p>

<h3>Cuối khoá bạn sẽ làm được gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Upload và phục vụ file đúng cách</span><span class="lz-lnote">PUT với đúng Content-Type và Cache-Control; phục vụ qua CDN; không list bucket</span></div>
<div class="lz-layer"><span class="lz-lname">Cho trình duyệt upload thẳng</span><span class="lz-lnote">Presigned URL + CORS, để file lớn không đi qua server của bạn</span></div>
<div class="lz-layer"><span class="lz-lname">Giữ rẻ và an toàn</span><span class="lz-lnote">Tính egress, bucket private, signed URL, xoay key, lifecycle rule</span></div>
<div class="lz-layer"><span class="lz-lname">Chẩn đoán các lỗi kinh điển</span><span class="lz-lnote">403 SignatureDoesNotMatch, lỗi CORS preflight, cache CDN cũ</span></div>
</div>

<div class="pitfall co-tieu-de"><strong>Người mới hay bắt đầu sai chỗ thế này.</strong> Một bạn lập trình lưu file upload bằng <code>fs.writeFile</code> vào một thư mục cạnh mã nguồn, và trên laptop thì chạy ngon. Rồi deploy lên hai server sau một load balancer: một nửa số request ảnh trả 404, vì mỗi server chỉ có những file nó tự nhận. Hoặc ổ đầy và container khởi động lại thì rỗng trơn. Object storage sinh ra chính là để câu hỏi &quot;file mình upload đâu rồi?&quot; chỉ có một câu trả lời cho mọi server, mãi mãi.</div>

<h3>🧪 Thực hành (10–15 phút — chắc chắn làm được)</h3>
<div class="callout ok"><ol>
<li>Mở một app bạn hay dùng (mạng xã hội, trang bán hàng). Chuột phải vào một ảnh rồi chọn &quot;Mở ảnh trong tab mới&quot;. Nhìn <strong>host</strong> trên thanh địa chỉ — thường là một tên miền storage hoặc CDN, không phải tên miền chính của app.</li>
<li>Trên trang web này, mở một ảnh đại diện hoặc ảnh bài viết theo cách đó và xác nhận host là <code>media.cuongthai.com</code> — một bucket R2 phục vụ qua CDN.</li>
<li>Chuẩn bị cho các bài thực hành: cài Docker <strong>và</strong> AWS CLI (<code>aws --version</code> phải in ra số phiên bản). Docker chạy MinIO cục bộ — tức <em>máy chủ</em> S3; CLI là <em>client</em> nói chuyện với nó. Cần cả hai: chỉ có CLI thì không có gì để nói chuyện ngoài bucket thật, mà khoá này không bao giờ chạm bucket thật. (Ảnh <code>minio/minio</code> không còn kéo được từ Docker Hub; khoá dùng <code>cgr.dev/chainguard/minio</code> — xem mục "Tự chạy lại" bên dưới.)</li>
<li>Tự viết một câu bằng lời của bạn: vì sao một app lại phục vụ ảnh từ <code>media.cuongthai.com</code> thay vì từ chính server ứng dụng của nó?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tìm được ít nhất một ảnh thật phục vụ từ host storage/CDN, có <code>aws</code> CLI hoặc Docker chạy được, và câu của bạn KHÔNG chỉ nói &quot;để nhẹ database&quot; — mà có nhắc tới dùng chung, băng thông, hoặc độ bền.</p></div>

<h3>🔬 Đo thật: một ảnh, một key, trên máy chủ S3 thật</h3>
<p>Trên máy Mac của khoá: MinIO (RELEASE.2026-11-12, chạy trong Docker) với AWS CLI 2.31.22 — <strong>không</strong> phải bucket production. Tạo bucket, tải ảnh đại diện 608 byte lên theo một key, hỏi metadata, tải ngược về, rồi "đổi ảnh":</p>
<div class="out">$ export AWS_ENDPOINT_URL=http://localhost:20200    # MinIO của khoá, chạy trong Docker — KHÔNG phải bucket thật
$ aws s3 mb s3://anh-dai-dien
make_bucket: anh-dai-dien
$ aws s3 cp me.jpg s3://anh-dai-dien/users/42/avatars/me.jpg
upload: me.jpg -&gt; s3://anh-dai-dien/users/42/avatars/me.jpg
$ aws s3api head-object --bucket anh-dai-dien --key users/42/avatars/me.jpg --query '{Size:ContentLength,Type:ContentType,ETag:ETag}' --output text
"50c3808ca883b0fe6b0fa47c2dbd24c5"	608	image/jpeg
$ aws s3 cp s3://anh-dai-dien/users/42/avatars/me.jpg lay-lai.jpg &amp;&amp; cmp me.jpg lay-lai.jpg &amp;&amp; echo "giống hệt từng byte"
giống hệt từng byte
$ aws s3 cp me-moi.jpg s3://anh-dai-dien/users/42/avatars/me.jpg    # "đổi ảnh" = gửi CẢ tệp mới cùng key
upload: me-moi.jpg -&gt; s3://anh-dai-dien/users/42/avatars/me.jpg
$ aws s3api head-object --bucket anh-dai-dien --key users/42/avatars/me.jpg --query '{Size:ContentLength,Type:ContentType,ETag:ETag}' --output text
"1e4bb2b2b7efa6328064d362e4009e2f"	608	image/jpeg
$ aws s3 ls s3://anh-dai-dien --recursive
2026-11-14 10:22:59        608 users/42/avatars/me.jpg</div>
<p>Ba điều cần thấy. "Thư mục" <code>users/42/avatars/</code> chỉ là ký tự trong key. <code>head-object</code> trả kích thước, loại và <strong>ETag</strong> (dấu vân tay nội dung) mà không tải gì về. Và "đổi ảnh" là một lần tải lên cả tệp mới cùng key — ETag đổi, vì không có API nào sửa một phần object.</p>
<h3>🔬 Đo thật: hai server sau một bộ cân tải</h3>
<p>Hai server Node nhỏ A và B đứng sau bộ cân tải luân phiên (A, B, A, B…). Một lần tải lên, rồi mười lần GET. Lượt đầu mỗi server lưu vào ổ đĩa riêng bằng <code>fs.writeFile</code>; lượt sau cả hai lưu vào một bucket:</p>
<div class="out">$ # Kiểu A — mỗi server lưu ảnh vào ổ đĩa của CHÍNH NÓ (fs.writeFile)
$ node hai-may.mjs dia
PUT ảnh (608 B) → 201 A đã lưu
10 lần GET: 404(B) 200(A) 404(B) 200(A) 404(B) 200(A) 404(B) 200(A) 404(B) 200(A)
⇒ 5 thấy ảnh · 5 lỗi 404
$ # Kiểu B — cả hai server lưu vào cùng một bucket (object storage)
$ node hai-may.mjs kho
PUT ảnh (608 B) → 201 A đã lưu
10 lần GET: 200(B) 200(A) 200(B) 200(A) 200(B) 200(A) 200(B) 200(A) 200(B) 200(A)
⇒ 10 thấy ảnh · 0 lỗi 404</div>
<p>Với ổ đĩa riêng, mọi lượt GET rơi vào B đều hỏi một ổ đĩa chưa từng thấy tệp: <strong>5 trên 10 lỗi 404</strong>. Với một bucket chung, <strong>10 trên 10</strong> thấy ảnh. Thêm server thứ ba thì con số của ổ đĩa riêng chỉ tệ hơn.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Cài Docker và AWS CLI, rồi chạy (tự chọn <code>&lt;access-key&gt;</code>/<code>&lt;secret-key&gt;</code>, ít nhất 8 ký tự):</p>
<pre><code class="language-bash"><span class="tok-comment"># 1) Máy chủ S3 cục bộ (MinIO) — chỉ nghe trên máy bạn</span>
docker run -d --name minio -p 127.0.0.1:9000:9000 -v minio-data:/data \\
  -e MINIO_ROOT_USER=&lt;access-key&gt; -e MINIO_ROOT_PASSWORD=&lt;secret-key&gt; \\
  cgr.dev/chainguard/minio:latest server /data
<span class="tok-comment"># 2) AWS CLI nói chuyện với MinIO thay vì AWS</span>
export AWS_ACCESS_KEY_ID=&lt;access-key&gt; AWS_SECRET_ACCESS_KEY=&lt;secret-key&gt;
export AWS_DEFAULT_REGION=us-east-1 AWS_ENDPOINT_URL=http://localhost:9000
aws s3 mb s3://anh-dai-dien
aws s3 cp me.jpg s3://anh-dai-dien/users/42/avatars/me.jpg
aws s3api head-object --bucket anh-dai-dien --key users/42/avatars/me.jpg</code></pre>
<p>Phép đo hai server: trong một thư mục nháp chạy <code>npm init -y && npm pkg set type=module && npm i @aws-sdk/client-s3@3.1071.0</code>, lưu đoạn dưới thành <code>hai-may.mjs</code>, đặt <code>OBJ_ENDPOINT=http://localhost:9000</code> cùng các biến AWS ở trên, rồi chạy <code>node hai-may.mjs dia</code> và <code>node hai-may.mjs kho</code>.</p>
<pre><code class="language-javascript"><span class="tok-comment">// Hai server app sau một bộ cân tải luân phiên. Kiểu A: lưu ảnh vào Ổ ĐĨA của chính server. Kiểu B: lưu vào object storage (MinIO).</span>
import http from 'node:http';
import fs from 'node:fs';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });
const KIEU = process.argv[2];                                 <span class="tok-comment">  // 'dia' | 'kho'</span>
const BUCKET = 'anh-dai-dien';
function mayChu(ten, cong) {
  const thuMuc = &#96;./o-dia-\${ten}&#96;; fs.rmSync(thuMuc, { recursive: true, force: true }); fs.mkdirSync(thuMuc);
  return new Promise((ok) =&gt; http.createServer(async (req, res) =&gt; {
    const key = req.url.slice(1);                             <span class="tok-comment">  // /users/42/avatars/me.jpg ⇒ users/42/avatars/me.jpg</span>
    try {
      if (req.method === 'PUT') {
        const than = Buffer.concat(await Array.fromAsync(req));
        if (KIEU === 'dia') fs.writeFileSync(&#96;\${thuMuc}/\${key.replaceAll('/', '_')}&#96;, than);
        else await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: than, ContentType: 'image/jpeg' }));
        res.writeHead(201).end(&#96;\${ten} đã lưu&#96;);
      } else {
        const than = KIEU === 'dia' ? fs.readFileSync(&#96;\${thuMuc}/\${key.replaceAll('/', '_')}&#96;)
          : Buffer.from(await (await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))).Body.transformToByteArray());
        res.writeHead(200, { 'x-may': ten }).end(than);
      }
    } catch { res.writeHead(404, { 'x-may': ten }).end(); }
  }).listen(cong, ok));
}
await mayChu('A', 20211); await mayChu('B', 20212);
let luot = 0;                                                  <span class="tok-comment">  // bộ cân tải: A, B, A, B…</span>
await new Promise((ok) =&gt; http.createServer((req, res) =&gt; {
  const cong = luot++ % 2 === 0 ? 20211 : 20212;
  req.pipe(http.request({ port: cong, path: req.url, method: req.method, headers: req.headers }, (r) =&gt; { res.writeHead(r.statusCode, r.headers); r.pipe(res); }));
}).listen(20210, ok));
const anh = fs.readFileSync('me.jpg');
const up = await fetch('http://localhost:20210/users/7/avatars/me.jpg', { method: 'PUT', body: anh });
console.log(&#96;PUT ảnh (\${anh.length} B) → \${up.status} \${await up.text()}&#96;);
const dem = { 200: 0, 404: 0 }, dong = [];
for (let i = 1; i &lt;= 10; i++) {
  const r = await fetch('http://localhost:20210/users/7/avatars/me.jpg'); await r.arrayBuffer();
  dem[r.status]++; dong.push(&#96;\${r.status}(\${r.headers.get('x-may')})&#96;);
}
console.log(&#96;10 lần GET: \${dong.join(' ')}&#96;);
console.log(&#96;⇒ \${dem[200]} thấy ảnh · \${dem[404]} lỗi 404&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-1-nhan-file-multipart" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.1 — Nhận file: multipart, base64, và cái giá phải trả bằng RAM</span><span class="lc-sub">Chuyện gì xảy ra ở server trước khi tệp tới được kho lưu trữ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.2 — Object storage và URL ký sẵn</span><span class="lc-sub">Cùng ý tưởng nhìn từ backend Node.js, có số đo</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-7-2-volume" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 7.2 — Volume, đào sâu</span><span class="lc-sub">Giữ dữ liệu trên MỘT máy — và vì sao hai máy thì không đủ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 12.4 — CDN và tệp tĩnh, và kho object</span><span class="lc-sub">Header cache, đổi tên khi đổi nội dung, và byte nằm ở đâu trên production</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Object storage</span><span class="v">Dịch vụ internet lưu nguyên các file dưới dạng object bất biến, mỗi object định danh bằng key.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">Một file đã lưu cộng metadata — cái &quot;túi&quot; trong hình ảnh quầy giữ đồ.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">Tên dạng chữ định danh object, ví dụ <code>users/42/avatars/me.jpg</code> — cái &quot;vé&quot;.</span></div>
  <div class="kv"><span class="k">Bucket</span><span class="v">Container chứa object — cái &quot;kệ&quot;.</span></div>
  <div class="kv"><span class="k">S3 API</span><span class="v">API lưu trữ của Amazon, nay là chuẩn de-facto nhiều nhà cung cấp làm theo.</span></div>
  <div class="kv"><span class="k">Cloudflare R2</span><span class="v">Dịch vụ S3-compatible, không tính phí egress; thứ khoá này và kho này dùng.</span></div>
  <div class="kv"><span class="k">CDN</span><span class="v">Mạng các edge cache phục vụ file của bucket từ nơi gần mỗi người dùng.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Byte phục vụ ra khỏi storage — khoản AWS tính tiền còn R2 thì không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Object storage giữ nguyên các file dưới dạng object bất biến, mỗi cái đặt tên bằng key, trong một bucket — như quầy giữ hành lý dành cho file, truy cập qua HTTP.</li><li>App dùng nó thay cho database (quá to/chậm cho blob) hay ổ đĩa server (không dùng chung, không bền); metadata vào DB, byte vào storage.</li><li>S3 API là chuẩn de-facto; Cloudflare R2 là dịch vụ S3-compatible không tốn phí egress, đó là lý do kho này dùng nó.</li><li>Bạn đã dùng nó ngay ở đây — mọi ảnh trên site này là một object R2 phục vụ dưới dạng <code>media.cuongthai.com/...</code> qua CDN.</li><li>Cuối khoá bạn sẽ upload/phục vụ đúng cách, cho trình duyệt upload thẳng, giữ rẻ và an toàn, và gỡ được các lỗi kinh điển.</li></ul>

<a class="link-card" href="https://aws.amazon.com/what-is/object-storage/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">AWS — What is object storage?</span><span class="lc-sub">Phần giới thiệu mộc mạc của chính Amazon; khớp với hình ảnh đời thường ở trên.</span></span>
</a>
<a class="link-card" href="https://developers.cloudflare.com/r2/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Tài liệu Cloudflare R2</span><span class="lc-sub">Dịch vụ S3-compatible, không phí egress mà khoá này dùng.</span></span>
</a>
<p class="note-ct"><strong>Bài kế tiếp:</strong> &quot;Bắt đầu tại đây&quot; phần 2 — vì sao object storage quan trọng về tiền và an toàn (một hoá đơn egress bất ngờ, một bucket public bị lộ, cái bug SigV4 kho này bắt được ở production), và kế hoạch học.</p>
</div>
`,
    },

    {
      title: 'Start here (2/2) — Why it matters: cost, safety, and how to study this course|||Bắt đầu tại đây (2/2) — Vì sao nó quan trọng: tiền, an toàn, và cách học khoá này',
      slug: 'os-0-0b-vi-sao-quan-trong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao object storage đáng học cho nghiêm túc: một hoá đơn egress bất ngờ (R2 zero egress vs S3 $0,09/GB), những vụ lộ bucket public, cái bug SigV4 kho này bắt được ở production, cộng bản đồ 11 mục của khoá và một lộ trình tối thiểu để bạn ship được tính năng upload.',
      content: `
${G00_9}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Why object storage is worth learning well</h2>
<p class="lead">In the previous lesson you met object storage. This one answers &quot;does getting it wrong actually hurt?&quot; — yes, in two currencies: <strong>money</strong> and <strong>safety</strong>. Then a map of the course and a minimum route so you can ship an upload feature without reading all eleven chapters first.</p>

<h3>It hurts your wallet: egress</h3>
<p>Storing files is cheap everywhere (cents per GB per month). The surprise is <strong>egress</strong> — every byte served out. AWS S3 charges about $0.09/GB of egress; Cloudflare R2 charges $0. For an app that serves 5 TB of images a month (5,120 GB), that is roughly <strong>$460 a month on S3 just to serve them</strong> (quick estimate: 5,120 GB × $0.09; AWS's own price list of 11/11/2026, with its 100 GB/month free tier and tiers, gives <strong>$451.80</strong> — measured below), versus $0 on R2 — before you have stored a single new byte. This one line is the main reason this repo runs on R2, and Chapter 2 and Chapter 7 turn it into exact formulas.</p>
<div class="callout warn"><strong>The classic surprise bill</strong> is not storage — it is a popular file (or a hotlinked one) served millions of times. If you only watch the storage number, the egress line is the one that arrives at the end of the month.</div>

<h3>It hurts your users: safety</h3>
<p>Object storage is reachable over the public internet, so a wrong setting leaks data to the whole world. Two failure modes you will learn to prevent:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A public bucket that should be private</span><span class="v">Leaked S3 buckets have exposed millions of records — backups, IDs, private media — simply because &quot;public&quot; was left on. Chapters 3 and 5 teach private buckets + signed URLs.</span></div>
  <div class="kv"><span class="k">A broken signature</span><span class="v">Presigned URLs are signed with SigV4. Get the signed headers wrong and you either lock out real users or, worse, sign something you did not mean to. This repo caught a real SigV4 <code>signableHeaders</code> bug in production — Chapter 4 walks through it.</span></div>
</div>

<h3>What this course does differently</h3>
<p>Every number here is measured — on a local MinIO (an S3-compatible server in Docker) with the AWS CLI and the same AWS SDK v3 version as this repo, or by reading this repo's own <code>src/config/r2.ts</code> and upload service. The labs <strong>never touch the production bucket</strong> (the repo even refuses to in tests — its storage sandbox). List prices are quoted with their source page and date, never as measurements. You will see the actual key conventions, the actual Cache-Control values, the actual migration, and the actual bug that got fixed. When a claim is a measurement, the lesson says so and links its source.</p>

<h3>The map — eleven sections</h3>
<table>
  <tr><th>Section</th><th>What you get</th></tr>
  <tr><td>0 · Concepts</td><td>Object storage vs filesystem; bucket/key/object</td></tr>
  <tr><td>1 · S3 API</td><td>SDK v3 client; Put/Get/Head/Delete; multipart upload</td></tr>
  <tr><td>2 · R2 specifics</td><td>Zero egress; R2 quirks; access keys &amp; rotation</td></tr>
  <tr><td>3 · URLs &amp; access</td><td>Three URL types; Cache-Control; signed URLs</td></tr>
  <tr><td>4 · Presigned uploads</td><td>Browser-direct PUT; the SigV4 signature bug</td></tr>
  <tr><td>5 · CORS</td><td>Letting the browser talk to the bucket safely</td></tr>
  <tr><td>6 · Lifecycle</td><td>Expiry rules; aborting dead multipart uploads</td></tr>
  <tr><td>7 · Cost</td><td>Turning storage + operations + egress into a bill</td></tr>
  <tr><td>8 · Migration</td><td>Moving from S3 to R2 without losing objects</td></tr>
  <tr><td>9 · Diagnostics</td><td>403, CORS, stale cache — reading the real cause</td></tr>
  <tr><td>10 · Exam review</td><td>A self-test over the whole course</td></tr>
</table>

<h3>A one-week minimum route</h3>
<p>If all you need right now is &quot;let users upload an avatar and show it back&quot;, you do not need all eleven sections. Do this: Section 0 (concepts) → 1.1 and 1.2 (client + Put/Get/Head/Delete) → 3.1 and 3.2 (URL types + Cache-Control) → 4 (presigned upload) → 5 (CORS). That is enough to ship safely. Come back for multipart, lifecycle, cost and migration when you hit them.</p>

<div class="pitfall co-tieu-de"><strong>Do not learn the wrong lesson from the cost story.</strong> &quot;R2 is free so I can ignore cost&quot; is the trap. R2 has zero <em>egress</em>, but it still bills storage and operations (Class A writes, Class B reads), and a runaway script that does millions of HEAD requests still costs money. Zero egress removes the scariest line, not your responsibility to measure — which is exactly why Chapter 7 exists.</div>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok"><ol>
<li><strong>Do the egress math.</strong> An app serves 5 TB/month of images. Compute S3 egress at $0.09/GB (remember 1 TB = 1,024 GB) and R2 egress at $0. Write both numbers down — the gap is the whole pitch of this course.</li>
<li><strong>Find a real leak.</strong> Search the web for &quot;S3 bucket leak&quot; or &quot;exposed S3 bucket&quot; and read one incident: note what was exposed and the root cause (almost always &quot;public access left on&quot;).</li>
<li><strong>Plan your route.</strong> Decide what you need to build first (e.g. avatar upload) and write your own minimum chapter list from the map above.</li>
<li><strong>Set a guardrail habit.</strong> Write one sentence you will check before every bucket goes live: &quot;Is this bucket public on purpose, and is every secret key out of Git?&quot;</li>
</ol>
<p><strong>Done when:</strong> you have a dollar figure for the 5 TB egress gap, one real leak example with its cause, a personal minimum route, and your one-sentence guardrail.</p></div>

<h3>🔬 Measured: egress from today's price lists</h3>
<p>A script that reads AWS's public price file (<code>AWSDataTransfer</code>, us-east-1) and Cloudflare's R2 pricing page, then prices 1, 5 and 20 TB a month:</p>
<div class="out">$ node gia-egress.mjs
AWS bảng giá công bố 2026-11-11 — egress S3 ra Internet (us-east-1):
       0 – 10240    GB/tháng: $0.090/GB
   10240 – 51200    GB/tháng: $0.085/GB
   51200 – 153600   GB/tháng: $0.070/GB
  153600 – Infinity GB/tháng: $0.050/GB
R2 (developers.cloudflare.com/r2/pricing):
  | Storage | $0.015 / GB-month | $0.01 / GB-month
  | Class A Operations | $4.50 / million requests | $9.00 / million requests
  | Class B Operations | $0.36 / million requests | $0.90 / million requests
  | Egress (data transfer to Internet) | Free | Free
Phục vụ ra Internet mỗi tháng   S3 (trừ 100 GB miễn phí)   R2
   1 TB =   1024 GB      $   83.16                  $0
   5 TB =   5120 GB      $  451.80                  $0
  20 TB =  20480 GB      $ 1783.50                  $0
Tính tay như bài web (5.120 GB × $0,09, không trừ miễn phí): $460.80</div>
<p>S3 egress is tiered ($0.09 → $0.05 per GB) after 100 GB/month free; R2 egress is free, but storage ($0.015/GB-month) and operations (Class A $4.50, Class B $0.36 per million) still bill. Prices change — rerun the script rather than trusting this page.</p>
<h3>🔬 Measured: a private bucket made public by one policy</h3>
<p>On MinIO: a bucket with two files, then a stranger with <strong>no keys</strong> tries to read and list it — before and after one "convenient" bucket policy:</p>
<div class="out">$ aws s3 cp bang-diem.txt s3://ho-so-lop/ &amp;&amp; aws s3 cp cccd-an.txt s3://ho-so-lop/sinh-vien/an/
đã tải 2 tệp
$ # Người lạ, KHÔNG có khoá, thử đọc và liệt kê:
$ curl -s -o /dev/null -w "GET tệp: %{http_code}\\n" http://localhost:20200/ho-so-lop/bang-diem.txt
GET tệp: 403
$ curl -s http://localhost:20200/ho-so-lop/bang-diem.txt | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;"
&lt;Code&gt;AccessDenied&lt;/Code&gt;
$ curl -s -o /dev/null -w "LIST bucket: %{http_code}\\n" "http://localhost:20200/ho-so-lop?list-type=2"
LIST bucket: 403
$ # Một dòng cấu hình "cho tiện": mở public cả đọc lẫn liệt kê
$ aws s3api put-bucket-policy --bucket ho-so-lop --policy file://cong-khai.json &amp;&amp; echo "policy: public"
policy: public
$ curl -s -o /dev/null -w "GET tệp: %{http_code}\\n" http://localhost:20200/ho-so-lop/bang-diem.txt
GET tệp: 200
$ curl -s "http://localhost:20200/ho-so-lop?list-type=2" | grep -oE "&lt;Key&gt;[^&lt;]+&lt;/Key&gt;"
&lt;Key&gt;bang-diem.txt&lt;/Key&gt;
&lt;Key&gt;sinh-vien/an/cccd-an.txt&lt;/Key&gt;
$ curl -s http://localhost:20200/ho-so-lop/sinh-vien/an/cccd-an.txt
CCCD 0790xxxxxxx
$ # Sửa: gỡ policy ⇒ private trở lại
$ aws s3api delete-bucket-policy --bucket ho-so-lop &amp;&amp; curl -s -o /dev/null -w "GET tệp: %{http_code}\\n" http://localhost:20200/ho-so-lop/bang-diem.txt
GET tệp: 403</div>
<p>The policy that did it — anyone (<code>"Principal": "*"</code>) may get objects AND list the bucket:</p>
<pre><code class="language-json">{ "Version": "2012-10-17",
  "Statement": [{ "Effect": "Allow", "Principal": "*",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": ["arn:aws:s3:::ho-so-lop", "arn:aws:s3:::ho-so-lop/*"] }] }</code></pre>
<p>Listing is the dangerous half: it hands out the names of files nobody ever linked to. Chapter 3 builds the safe shape — private bucket, short-lived signed URLs.</p>
<h3>🔬 Measured: what a signature protects</h3>
<div class="out">$ URL=$(aws s3 presign s3://ho-so-lop/bang-diem.txt --expires-in 5)
http://localhost:20200/ho-so-lop/bang-diem.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential
…
$ curl -s -o /dev/null -w "URL ký đúng: %{http_code}\\n" "$(cat url.txt)"
URL ký đúng: 200
$ # Sửa MỘT ký tự trong đường dẫn (bang-diem ⇒ bang-diex), giữ nguyên chữ ký
$ curl -s "$(sed 's/bang-diem/bang-diex/' url.txt)" | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;"
&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ # Sửa thời hạn (X-Amz-Expires=5 ⇒ 99999) để "gia hạn" chùa
$ curl -s "$(sed 's/X-Amz-Expires=5/X-Amz-Expires=99999/' url.txt)" | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;"
&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ # 6 giây sau — URL đã hết hạn
$ curl -s "$(cat url.txt)" | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;|&lt;Message&gt;[^&lt;]+&lt;/Message&gt;"
&lt;Code&gt;AccessDenied&lt;/Code&gt;
&lt;Message&gt;Request has expired&lt;/Message&gt;</div>
<p>Change one character of the path, or stretch <code>X-Amz-Expires</code>: <code>SignatureDoesNotMatch</code>. Wait it out: <code>Request has expired</code>. A signature pins exactly what was signed — so the real risk is signing too little, which is the bug this repo fixed on 28/07/2026 (commit <code>60e28eafd</code>, <code>signableHeaders</code> in <code>src/config/r2.ts</code>; Chapter 4).</p>
<h3>🔁 Run it yourself</h3>
<p>The price script needs only Node 22 (save as <code>gia-egress.mjs</code>, run <code>node gia-egress.mjs</code>). The bucket and signature tests need the local MinIO + AWS CLI from Start here (1/2); use <code>--expires-in 30</code> so you have time to edit the URL.</p>
<pre><code class="language-javascript"><span class="tok-comment">// Giá egress THẬT hôm nay: bảng giá công khai của AWS (AWSDataTransfer, us-east-1, ra Internet) + trang giá R2 của Cloudflare.</span>
const aws = await (await fetch('https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSDataTransfer/current/us-east-1/index.json')).json();
const bac = [];
for (const [sku, p] of Object.entries(aws.products)) {
  const a = p.attributes;
  if (a.fromLocation !== 'US East (N. Virginia)' || a.toLocation !== 'External' || a.transferType !== 'AWS Outbound') continue;
  for (const t of Object.values(aws.terms.OnDemand[sku])) for (const r of Object.values(t.priceDimensions))
    bac.push({ tu: +r.beginRange, den: r.endRange === 'Inf' ? Infinity : +r.endRange, gia: +r.pricePerUnit.USD });
}
bac.sort((x, y) =&gt; x.tu - y.tu);
console.log(&#96;AWS bảng giá công bố \${aws.publicationDate.slice(0, 10)} — egress S3 ra Internet (us-east-1):&#96;);
for (const b of bac) console.log(&#96;  \${String(b.tu).padStart(6)} – \${String(b.den).padEnd(8)} GB/tháng: $\${b.gia.toFixed(3)}/GB&#96;);
const r2 = await (await fetch('https://developers.cloudflare.com/r2/pricing/index.md')).text();
console.log('R2 (developers.cloudflare.com/r2/pricing):');
for (const l of r2.split('\\n').filter((l) =&gt; /^\\| (Storage|Class A Operations|Class B Operations|Egress) +\\| \\$|^\\| Egress/.test(l)).slice(0, 4)) console.log('  ' + l.replace(/&lt;sup&gt;.*?&lt;\\/sup&gt;/g, '').replace(/\\s+\\|\\s*$/, '').replace(/\\s+/g, ' '));
const tien = (gb) =&gt; { let c = 0, con = Math.max(0, gb - 100); for (const b of bac) { const lop = Math.min(con, b.den - b.tu); if (lop &lt;= 0) break; c += lop * b.gia; con -= lop; } return c; };
console.log('Phục vụ ra Internet mỗi tháng   S3 (trừ 100 GB miễn phí)   R2');
for (const tb of [1, 5, 20]) console.log(&#96;  \${String(tb).padStart(2)} TB = \${String(tb * 1024).padStart(6)} GB      $\${tien(tb * 1024).toFixed(2).padStart(8)}                  $0&#96;);
console.log(&#96;Tính tay như bài web (5.120 GB × $0,09, không trừ miễn phí): $\${(5120 * 0.09).toFixed(2)}&#96;);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.2 — Object storage and presigned URLs</span><span class="lc-sub">Signing an upload URL from a Node.js backend</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-10-1-tao-sao-luu" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 10.1 — What one backup costs</span><span class="lc-sub">Storage cost measured on a real backup</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Egress</span><span class="v">Bytes served out of storage; the line AWS charges ~$0.09/GB and R2 charges $0.</span></div>
  <div class="kv"><span class="k">Public vs private bucket</span><span class="v">Whether anyone with the URL can read objects, or only signed/authenticated requests can.</span></div>
  <div class="kv"><span class="k">Signed URL</span><span class="v">A time-limited URL carrying a signature, giving temporary access to a private object.</span></div>
  <div class="kv"><span class="k">SigV4</span><span class="v">AWS Signature Version 4 — the signing scheme behind presigned URLs and every API call.</span></div>
  <div class="kv"><span class="k">Class A / Class B operations</span><span class="v">Billed write-type vs read-type requests (R2 still charges for these even with free egress).</span></div>
  <div class="kv"><span class="k">Minimum route</span><span class="v">The shortest set of chapters needed to ship one upload feature safely.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Getting object storage wrong costs money (egress) and safety (leaks) — both are avoidable, and this course targets both.</li><li>Egress is the surprise bill: ~$0.09/GB on S3 vs $0 on R2, so serving 5 TB/month is ~$460 vs $0 — the main reason this repo uses R2.</li><li>Public-by-accident buckets and broken SigV4 signatures are the classic safety failures; private buckets, signed URLs and correct signing prevent them.</li><li>Every number in this course is measured against this repo's real R2 code, including a genuine SigV4 bug that reached production and was fixed.</li><li>You need not read all eleven sections to ship: Section 0 → 1.1/1.2 → 3.1/3.2 → 4 → 5 is a safe one-week route; but zero egress is not zero cost, so Chapter 7 still matters.</li></ul>

<a class="link-card" href="https://developers.cloudflare.com/r2/pricing/" target="_blank" rel="noopener">
  <span class="lc-ico">💲</span>
  <span class="lc-body"><span class="lc-title">Cloudflare R2 pricing</span><span class="lc-sub">Zero egress, plus Class A/B operation and storage rates — the numbers behind the math.</span></span>
</a>
<a class="link-card" href="https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔏</span>
  <span class="lc-body"><span class="lc-title">AWS Signature Version 4</span><span class="lc-sub">The signing protocol behind presigned URLs; the subject of the Chapter 4 bug.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> lesson 0.1 — object storage vs the filesystem you already know, the three differences that flip most of your intuitions.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Vì sao object storage đáng học cho tới nơi tới chốn</h2>
<p class="lead">Bài trước bạn đã làm quen object storage. Bài này trả lời &quot;làm sai thì có đau thật không?&quot; — có, bằng hai loại tiền tệ: <strong>tiền</strong> và <strong>an toàn</strong>. Rồi một bản đồ của cả khoá và một lộ trình tối thiểu để bạn ship được tính năng upload mà không phải đọc hết mười một mục trước.</p>

<h3>Đau ví tiền: egress</h3>
<p>Lưu file thì ở đâu cũng rẻ (vài cent mỗi GB mỗi tháng). Bất ngờ nằm ở <strong>egress</strong> — mỗi byte phục vụ ra ngoài. AWS S3 tính khoảng $0,09/GB egress; Cloudflare R2 tính $0. Với một app phục vụ 5 TB ảnh mỗi tháng (5.120 GB), con số đó là khoảng <strong>$460 một tháng trên S3 chỉ để phục vụ chúng</strong> (ước nhanh: 5.120 GB × $0,09; bảng giá chính thức của AWS ngày 11/11/2026, có 100 GB/tháng miễn phí và giá bậc thang, ra <strong>$451,80</strong> — đo ở bên dưới), so với $0 trên R2 — trước khi bạn lưu thêm một byte mới nào. Đúng một dòng này là lý do chính kho này chạy trên R2, và Chương 2 với Chương 7 biến nó thành công thức chính xác.</p>
<div class="callout warn"><strong>Hoá đơn gây sốc kinh điển</strong> không phải tiền lưu trữ — mà là một file nổi tiếng (hoặc bị hotlink) phục vụ hàng triệu lần. Nếu bạn chỉ canh con số lưu trữ, dòng egress mới là dòng ập tới cuối tháng.</div>

<h3>Đau người dùng: an toàn</h3>
<p>Object storage truy cập được qua internet công cộng, nên một cài đặt sai là lộ dữ liệu ra cả thế giới. Hai kiểu hỏng bạn sẽ học cách phòng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket public mà lẽ ra phải private</span><span class="v">Các bucket S3 bị lộ từng phơi ra hàng triệu bản ghi — bản sao lưu, giấy tờ, media riêng tư — chỉ vì để nguyên &quot;public&quot;. Chương 3 và 5 dạy bucket private + signed URL.</span></div>
  <div class="kv"><span class="k">Chữ ký hỏng</span><span class="v">Presigned URL ký bằng SigV4. Sai phần header được ký thì hoặc bạn chặn nhầm người dùng thật, hoặc tệ hơn, ký một thứ bạn không định ký. Kho này đã bắt được một bug SigV4 <code>signableHeaders</code> thật ở production — Chương 4 mổ xẻ nó.</span></div>
</div>

<h3>Khoá này khác ở chỗ nào</h3>
<p>Mọi con số ở đây đều đo — trên MinIO cục bộ (máy chủ tương thích S3 chạy trong Docker) với AWS CLI và đúng bản AWS SDK v3 của kho, hoặc bằng cách đọc chính <code>src/config/r2.ts</code> và upload service của kho. Bài lab <strong>không bao giờ chạm bucket production</strong> (chính kho còn tự chặn việc đó khi chạy test — storage sandbox). Giá niêm yết thì ghi rõ trang nguồn và ngày, không bao giờ trình bày như số đo. Bạn sẽ thấy convention key thật, giá trị Cache-Control thật, cuộc migration thật, và cái bug thật đã được vá. Khi một khẳng định là số đo, bài nói rõ và dẫn nguồn.</p>

<h3>Bản đồ — mười một mục</h3>
<table>
  <tr><th>Mục</th><th>Bạn nhận được gì</th></tr>
  <tr><td>0 · Concept</td><td>Object storage vs filesystem; bucket/key/object</td></tr>
  <tr><td>1 · S3 API</td><td>Client SDK v3; Put/Get/Head/Delete; multipart upload</td></tr>
  <tr><td>2 · R2 specifics</td><td>Zero egress; R2 quirks; access key &amp; rotation</td></tr>
  <tr><td>3 · URL &amp; access</td><td>Ba loại URL; Cache-Control; signed URL</td></tr>
  <tr><td>4 · Presigned upload</td><td>PUT thẳng từ browser; cái bug chữ ký SigV4</td></tr>
  <tr><td>5 · CORS</td><td>Cho trình duyệt nói chuyện với bucket một cách an toàn</td></tr>
  <tr><td>6 · Lifecycle</td><td>Quy tắc hết hạn; huỷ multipart upload chết</td></tr>
  <tr><td>7 · Cost</td><td>Biến lưu trữ + operation + egress thành hoá đơn</td></tr>
  <tr><td>8 · Migration</td><td>Chuyển từ S3 sang R2 mà không mất object</td></tr>
  <tr><td>9 · Chẩn đoán</td><td>403, CORS, cache cũ — đọc đúng nguyên nhân</td></tr>
  <tr><td>10 · Ôn thi</td><td>Tự kiểm tra trên cả khoá</td></tr>
</table>

<h3>Lộ trình tối thiểu một tuần</h3>
<p>Nếu việc bạn cần ngay lúc này chỉ là &quot;cho người dùng upload ảnh đại diện rồi hiện lại&quot;, bạn không cần cả mười một mục. Hãy làm thế này: Mục 0 (concept) → 1.1 và 1.2 (client + Put/Get/Head/Delete) → 3.1 và 3.2 (loại URL + Cache-Control) → 4 (presigned upload) → 5 (CORS). Thế là đủ ship an toàn. Quay lại học multipart, lifecycle, cost và migration khi bạn gặp chúng.</p>

<div class="pitfall co-tieu-de"><strong>Đừng rút ra bài học sai từ chuyện chi phí.</strong> &quot;R2 miễn phí nên khỏi quan tâm cost&quot; là cái bẫy. R2 không tốn <em>egress</em>, nhưng vẫn tính tiền lưu trữ và operation (Class A ghi, Class B đọc), và một script chạy loạn làm hàng triệu request HEAD vẫn tốn tiền. Zero egress bỏ đi dòng đáng sợ nhất, không bỏ đi trách nhiệm đo đạc của bạn — đó đúng là lý do Chương 7 tồn tại.</div>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li><strong>Tính egress.</strong> Một app phục vụ 5 TB/tháng ảnh. Tính egress S3 ở $0,09/GB (nhớ 1 TB = 1.024 GB) và egress R2 ở $0. Ghi cả hai con số — khoảng cách đó chính là toàn bộ lý lẽ của khoá này.</li>
<li><strong>Tìm một vụ lộ thật.</strong> Tìm trên web &quot;S3 bucket leak&quot; hoặc &quot;exposed S3 bucket&quot; và đọc một vụ: ghi lại cái gì bị lộ và nguyên nhân gốc (gần như luôn là &quot;để nguyên public&quot;).</li>
<li><strong>Vẽ lộ trình của bạn.</strong> Quyết định bạn cần dựng gì trước (ví dụ upload ảnh đại diện) và tự viết danh sách chương tối thiểu từ bản đồ ở trên.</li>
<li><strong>Tạo một thói quen chắn.</strong> Viết một câu bạn sẽ kiểm trước khi mỗi bucket lên sóng: &quot;Bucket này public có chủ đích không, và mọi khoá bí mật đã nằm ngoài Git chưa?&quot;</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một con số đô la cho khoảng cách egress 5 TB, một ví dụ lộ dữ liệu thật kèm nguyên nhân, một lộ trình tối thiểu của riêng bạn, và câu chắn một dòng.</p></div>

<h3>🔬 Đo thật: egress từ bảng giá hôm nay</h3>
<p>Một đoạn mã đọc tệp giá công khai của AWS (<code>AWSDataTransfer</code>, us-east-1) và trang giá R2 của Cloudflare, rồi tính giá cho 1, 5 và 20 TB mỗi tháng:</p>
<div class="out">$ node gia-egress.mjs
AWS bảng giá công bố 2026-11-11 — egress S3 ra Internet (us-east-1):
       0 – 10240    GB/tháng: $0.090/GB
   10240 – 51200    GB/tháng: $0.085/GB
   51200 – 153600   GB/tháng: $0.070/GB
  153600 – Infinity GB/tháng: $0.050/GB
R2 (developers.cloudflare.com/r2/pricing):
  | Storage | $0.015 / GB-month | $0.01 / GB-month
  | Class A Operations | $4.50 / million requests | $9.00 / million requests
  | Class B Operations | $0.36 / million requests | $0.90 / million requests
  | Egress (data transfer to Internet) | Free | Free
Phục vụ ra Internet mỗi tháng   S3 (trừ 100 GB miễn phí)   R2
   1 TB =   1024 GB      $   83.16                  $0
   5 TB =   5120 GB      $  451.80                  $0
  20 TB =  20480 GB      $ 1783.50                  $0
Tính tay như bài web (5.120 GB × $0,09, không trừ miễn phí): $460.80</div>
<p>Egress của S3 tính theo bậc ($0,09 → $0,05 mỗi GB) sau 100 GB/tháng miễn phí; egress R2 miễn phí, nhưng lưu trữ ($0,015/GB-tháng) và thao tác (Class A $4,50, Class B $0,36 mỗi triệu) vẫn tính tiền. Giá thay đổi — hãy chạy lại đoạn mã thay vì tin trang này.</p>
<h3>🔬 Đo thật: bucket private bị mở public bằng một policy</h3>
<p>Trên MinIO: một bucket có hai tệp, rồi một người lạ <strong>không có khoá</strong> thử đọc và liệt kê — trước và sau một bucket policy "cho tiện":</p>
<div class="out">$ aws s3 cp bang-diem.txt s3://ho-so-lop/ &amp;&amp; aws s3 cp cccd-an.txt s3://ho-so-lop/sinh-vien/an/
đã tải 2 tệp
$ # Người lạ, KHÔNG có khoá, thử đọc và liệt kê:
$ curl -s -o /dev/null -w "GET tệp: %{http_code}\\n" http://localhost:20200/ho-so-lop/bang-diem.txt
GET tệp: 403
$ curl -s http://localhost:20200/ho-so-lop/bang-diem.txt | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;"
&lt;Code&gt;AccessDenied&lt;/Code&gt;
$ curl -s -o /dev/null -w "LIST bucket: %{http_code}\\n" "http://localhost:20200/ho-so-lop?list-type=2"
LIST bucket: 403
$ # Một dòng cấu hình "cho tiện": mở public cả đọc lẫn liệt kê
$ aws s3api put-bucket-policy --bucket ho-so-lop --policy file://cong-khai.json &amp;&amp; echo "policy: public"
policy: public
$ curl -s -o /dev/null -w "GET tệp: %{http_code}\\n" http://localhost:20200/ho-so-lop/bang-diem.txt
GET tệp: 200
$ curl -s "http://localhost:20200/ho-so-lop?list-type=2" | grep -oE "&lt;Key&gt;[^&lt;]+&lt;/Key&gt;"
&lt;Key&gt;bang-diem.txt&lt;/Key&gt;
&lt;Key&gt;sinh-vien/an/cccd-an.txt&lt;/Key&gt;
$ curl -s http://localhost:20200/ho-so-lop/sinh-vien/an/cccd-an.txt
CCCD 0790xxxxxxx
$ # Sửa: gỡ policy ⇒ private trở lại
$ aws s3api delete-bucket-policy --bucket ho-so-lop &amp;&amp; curl -s -o /dev/null -w "GET tệp: %{http_code}\\n" http://localhost:20200/ho-so-lop/bang-diem.txt
GET tệp: 403</div>
<p>Policy gây ra chuyện đó — ai cũng được (<code>"Principal": "*"</code>) đọc object VÀ liệt kê bucket:</p>
<pre><code class="language-json">{ "Version": "2012-10-17",
  "Statement": [{ "Effect": "Allow", "Principal": "*",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": ["arn:aws:s3:::ho-so-lop", "arn:aws:s3:::ho-so-lop/*"] }] }</code></pre>
<p>Liệt kê là nửa nguy hiểm: nó đưa ra tên của những tệp chưa từng được chia sẻ ở đâu. Chương 3 dựng dạng an toàn — bucket private, signed URL sống ngắn.</p>
<h3>🔬 Đo thật: chữ ký bảo vệ cái gì</h3>
<div class="out">$ URL=$(aws s3 presign s3://ho-so-lop/bang-diem.txt --expires-in 5)
http://localhost:20200/ho-so-lop/bang-diem.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential
…
$ curl -s -o /dev/null -w "URL ký đúng: %{http_code}\\n" "$(cat url.txt)"
URL ký đúng: 200
$ # Sửa MỘT ký tự trong đường dẫn (bang-diem ⇒ bang-diex), giữ nguyên chữ ký
$ curl -s "$(sed 's/bang-diem/bang-diex/' url.txt)" | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;"
&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ # Sửa thời hạn (X-Amz-Expires=5 ⇒ 99999) để "gia hạn" chùa
$ curl -s "$(sed 's/X-Amz-Expires=5/X-Amz-Expires=99999/' url.txt)" | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;"
&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
$ # 6 giây sau — URL đã hết hạn
$ curl -s "$(cat url.txt)" | grep -oE "&lt;Code&gt;[^&lt;]+&lt;/Code&gt;|&lt;Message&gt;[^&lt;]+&lt;/Message&gt;"
&lt;Code&gt;AccessDenied&lt;/Code&gt;
&lt;Message&gt;Request has expired&lt;/Message&gt;</div>
<p>Sửa một ký tự trong đường dẫn, hoặc kéo dài <code>X-Amz-Expires</code>: <code>SignatureDoesNotMatch</code>. Chờ hết hạn: <code>Request has expired</code>. Chữ ký khoá đúng những gì đã ký — nên rủi ro thật là ký THIẾU, đúng lỗi kho này đã vá ngày 28/07/2026 (commit <code>60e28eafd</code>, <code>signableHeaders</code> trong <code>src/config/r2.ts</code>; Chương 4).</p>
<h3>🔁 Tự chạy lại</h3>
<p>Đoạn mã giá chỉ cần Node 22 (lưu thành <code>gia-egress.mjs</code>, chạy <code>node gia-egress.mjs</code>). Phép thử bucket và chữ ký cần MinIO cục bộ + AWS CLI ở bài Bắt đầu tại đây (1/2); dùng <code>--expires-in 30</code> để có thời gian sửa URL.</p>
<pre><code class="language-javascript"><span class="tok-comment">// Giá egress THẬT hôm nay: bảng giá công khai của AWS (AWSDataTransfer, us-east-1, ra Internet) + trang giá R2 của Cloudflare.</span>
const aws = await (await fetch('https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSDataTransfer/current/us-east-1/index.json')).json();
const bac = [];
for (const [sku, p] of Object.entries(aws.products)) {
  const a = p.attributes;
  if (a.fromLocation !== 'US East (N. Virginia)' || a.toLocation !== 'External' || a.transferType !== 'AWS Outbound') continue;
  for (const t of Object.values(aws.terms.OnDemand[sku])) for (const r of Object.values(t.priceDimensions))
    bac.push({ tu: +r.beginRange, den: r.endRange === 'Inf' ? Infinity : +r.endRange, gia: +r.pricePerUnit.USD });
}
bac.sort((x, y) =&gt; x.tu - y.tu);
console.log(&#96;AWS bảng giá công bố \${aws.publicationDate.slice(0, 10)} — egress S3 ra Internet (us-east-1):&#96;);
for (const b of bac) console.log(&#96;  \${String(b.tu).padStart(6)} – \${String(b.den).padEnd(8)} GB/tháng: $\${b.gia.toFixed(3)}/GB&#96;);
const r2 = await (await fetch('https://developers.cloudflare.com/r2/pricing/index.md')).text();
console.log('R2 (developers.cloudflare.com/r2/pricing):');
for (const l of r2.split('\\n').filter((l) =&gt; /^\\| (Storage|Class A Operations|Class B Operations|Egress) +\\| \\$|^\\| Egress/.test(l)).slice(0, 4)) console.log('  ' + l.replace(/&lt;sup&gt;.*?&lt;\\/sup&gt;/g, '').replace(/\\s+\\|\\s*$/, '').replace(/\\s+/g, ' '));
const tien = (gb) =&gt; { let c = 0, con = Math.max(0, gb - 100); for (const b of bac) { const lop = Math.min(con, b.den - b.tu); if (lop &lt;= 0) break; c += lop * b.gia; con -= lop; } return c; };
console.log('Phục vụ ra Internet mỗi tháng   S3 (trừ 100 GB miễn phí)   R2');
for (const tb of [1, 5, 20]) console.log(&#96;  \${String(tb).padStart(2)} TB = \${String(tb * 1024).padStart(6)} GB      $\${tien(tb * 1024).toFixed(2).padStart(8)}                  $0&#96;);
console.log(&#96;Tính tay như bài web (5.120 GB × $0,09, không trừ miễn phí): $\${(5120 * 0.09).toFixed(2)}&#96;);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-2-object-storage-presigned" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.2 — Object storage và URL ký sẵn</span><span class="lc-sub">Ký URL tải lên từ một backend Node.js</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-10-1-tao-sao-luu" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 10.1 — Làm một bản sao lưu tốn bao nhiêu</span><span class="lc-sub">Chi phí lưu trữ đo trên một bản sao lưu thật</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Egress</span><span class="v">Byte phục vụ ra khỏi storage; dòng AWS tính ~$0,09/GB còn R2 tính $0.</span></div>
  <div class="kv"><span class="k">Bucket public vs private</span><span class="v">Ai có URL cũng đọc được object, hay chỉ request đã ký/xác thực mới đọc được.</span></div>
  <div class="kv"><span class="k">Signed URL</span><span class="v">URL có hạn giờ, mang một chữ ký, cho quyền truy cập tạm thời vào object private.</span></div>
  <div class="kv"><span class="k">SigV4</span><span class="v">AWS Signature Version 4 — scheme ký đứng sau presigned URL và mọi API call.</span></div>
  <div class="kv"><span class="k">Operation Class A / Class B</span><span class="v">Request kiểu ghi vs kiểu đọc bị tính tiền (R2 vẫn tính dù egress miễn phí).</span></div>
  <div class="kv"><span class="k">Lộ trình tối thiểu</span><span class="v">Bộ chương ngắn nhất cần để ship an toàn một tính năng upload.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Làm sai object storage tốn tiền (egress) và an toàn (lộ dữ liệu) — cả hai đều tránh được, và khoá này nhắm vào cả hai.</li><li>Egress là hoá đơn gây sốc: ~$0,09/GB trên S3 vs $0 trên R2, nên phục vụ 5 TB/tháng là ~$460 vs $0 — lý do chính kho này dùng R2.</li><li>Bucket vô tình public và chữ ký SigV4 hỏng là các lỗi an toàn kinh điển; bucket private, signed URL và ký đúng giúp phòng chúng.</li><li>Mọi con số trong khoá đo từ mã R2 thật của kho này, kể cả một bug SigV4 có thật đã lên tới production và đã được vá.</li><li>Không cần đọc hết mười một mục mới ship được: Mục 0 → 1.1/1.2 → 3.1/3.2 → 4 → 5 là lộ trình một tuần an toàn; nhưng zero egress không phải zero cost, nên Chương 7 vẫn quan trọng.</li></ul>

<a class="link-card" href="https://developers.cloudflare.com/r2/pricing/" target="_blank" rel="noopener">
  <span class="lc-ico">💲</span>
  <span class="lc-body"><span class="lc-title">Giá Cloudflare R2</span><span class="lc-sub">Zero egress, cộng giá operation Class A/B và lưu trữ — các con số đứng sau phép tính.</span></span>
</a>
<a class="link-card" href="https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔏</span>
  <span class="lc-body"><span class="lc-title">AWS Signature Version 4</span><span class="lc-sub">Giao thức ký đứng sau presigned URL; chủ đề của cái bug ở Chương 4.</span></span>
</a>
<p class="note-ct"><strong>Bài kế tiếp:</strong> bài 0.1 — object storage so với filesystem bạn đã quen, ba khác biệt lật hầu hết trực giác của bạn.</p>
</div>
`,
    },

    {
      title: '0.1 — Object storage vs file system: three differences|||0.1 — Object storage vs file system: ba khác biệt',
      slug: 'os-0-1-vs-fs',
      type: 'VIDEO',
      description: 'Không có directory tree. Không có partial updates. Không có POSIX permissions. Ba khác biệt này giải thích 90% quyết định thiết kế của S3/R2.',
      content: `
${G00_1}
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

Exception: multipart upload for LARGE files (parts of 5 MB-5 GB, up to 10,000 parts, object up to 5 TB)
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

<h3>🔬 Measured: there is no "photos/" — only keys</h3>
<p>On a local MinIO (RELEASE.2026-11-12) with the AWS CLI: three objects, then ask for the "folder", list by prefix, list with a delimiter:</p>
<div class="out">$ aws s3 cp … (3 tệp: photos/2026/a.jpg · photos/2026/b.jpg · docs/readme.txt)
đã tải 3 object
$ # "Thư mục" photos/ có tồn tại không?
$ aws s3api head-object --bucket kho-anh --key photos/ 2&gt;&amp;1 | tail -1
An error occurred (404) when calling the HeadObject operation: Not Found
$ # Liệt kê theo PREFIX: chỉ là so khớp đầu chuỗi
$ aws s3api list-objects-v2 --bucket kho-anh --prefix photos/ --query 'Contents[].Key' --output text
photos/2026/a.jpg	photos/2026/b.jpg
$ aws s3api list-objects-v2 --bucket kho-anh --prefix pho --query 'Contents[].Key' --output text
photos/2026/a.jpg	photos/2026/b.jpg
$ # Thêm Delimiter "/" — ảo giác thư mục do API dựng ra lúc trả lời
$ aws s3api list-objects-v2 --bucket kho-anh --delimiter / --query '{Keys:Contents[].Key,ThuMucAo:CommonPrefixes[].Prefix}' --output json
{
    "Keys": null,
    "ThuMucAo": [
        "docs/",
        "photos/"
    ]
}</div>
<p><code>photos/</code> answers <strong>404</strong> — nobody ever created it. The prefix <code>pho</code> returns exactly what <code>photos/</code> returns, because a prefix is string matching. The "folders" a console shows are <code>CommonPrefixes</code>, built at answer time when you pass <code>--delimiter /</code>.</p>
<h3>🔬 Measured: what a prefix scan costs</h3>
<div class="out">$ node quet.mjs
PUT 10000 object: 15.2 s
LIST prefix logs/: 10000 key · 11 request (1.000 key/trang) · 337 ms
Biết sẵn key (lưu trong DB) ⇒ HEAD thẳng 1 object: 1 request · 2 ms
⇒ 1 triệu key dưới một prefix = 1000 request LIST chỉ để tìm một tệp</div>
<p>Even on a local server with no network latency, finding one file by listing 10,000 keys took 11 requests; heading a key you already know took 1 request and ~2 ms. Over a real network every one of those pages is a round trip. That is the reason for rule 1: store keys in your database.</p>
<h3>🔬 Measured: "renaming a folder"</h3>
<div class="out">$ node doi-ten.mjs
  copy photos/2026/a.jpg → photos/2025/a.jpg · delete photos/2026/a.jpg
  copy photos/2026/b.jpg → photos/2025/b.jpg · delete photos/2026/b.jpg
đổi tên 2 object = 5 request (1 LIST + 2 COPY + 2 DELETE)
sau đó: photos/2025/a.jpg · photos/2025/b.jpg
RenameObject a.jpg → c.jpg trên MinIO: OK ⇒ photos/2025/a.jpg · photos/2025/b.jpg · photos/2025/c.jpg (MinIO có; AWS chỉ có ở directory bucket S3 Express One Zone)</div>
<div class="out">$ # Bảng S3 API mà Cloudflare R2 hỗ trợ (tài liệu chính thức) — có RenameObject không?
$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -oE "\\[(RenameObject|CopyObject|ListObjectsV2|PutObject|DeleteObject) " | sort -u
[CopyObject 
[DeleteObject 
[ListObjectsV2 
[PutObject 
$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -c "RenameObject"
0</div>
<p>No rename for ordinary buckets: one LIST plus a COPY and a DELETE per object (2N + 1 requests, not atomic). The SDK does ship <code>RenameObjectCommand</code> and this MinIO accepted it, but AWS supports it only for S3 Express One Zone directory buckets and Cloudflare's S3 compatibility table for R2 has no line for it — do not build on it.</p>
<h3>🔬 Measured: changing 100 bytes in the middle of 20 MB</h3>
<div class="out">$ node sua-giua.mjs
file system: ghi 100 byte tại vị trí 10.000.000 · 0.20 ms · 100 byte được ghi
object storage: GET 20.971.520 byte + PUT 20.971.520 byte · 564 ms · ETag 536cb0e6… ⇒ 6756911d…
PUT với WriteOffsetBytes (ghi nối) trên MinIO: BadRequest (400)
object sau đó: 20.971.520 byte · ETag 6756911d…</div>
<p>The file system wrote exactly 100 bytes in a fifth of a millisecond. Object storage had to move the whole object twice — 2 × 20,971,520 bytes — and the ETag changed. Append (<code>WriteOffsetBytes</code>) is rejected by MinIO; on AWS it exists only for Express directory buckets.</p>
<h3>🔬 Measured: time to first byte</h3>
<div class="out">$ node tre.mjs
trung vị đọc một tệp nhỏ (máy của khoá, Wi-Fi nhà):
  ổ đĩa cục bộ (fs.readFileSync)      0.025 ms
  MinIO cục bộ qua HTTP (GetObject)    2.3 ms
  CDN media.cuongthai.com (1 byte)     215.6 ms</div>
<p>Local disk ≈ 0.03 ms, MinIO over HTTP on the same machine ≈ 2 ms, the site's CDN over home Wi-Fi ≈ 200 ms (a public cover image, read exactly as any visitor reads it). That gap is why mounting a bucket as a disk (s3fs) is fine for archives and painful for applications.</p>
<h3>🔁 Run it yourself</h3>
<p>With the local MinIO and AWS CLI from Start here (1/2): reproduce the first block with <code>aws s3 cp</code> / <code>aws s3api head-object</code> / <code>list-objects-v2 --prefix … --delimiter /</code>. For the scripts, <code>npm i @aws-sdk/client-s3@3.1071.0</code> and build each client like this (path-style, your local endpoint):</p>
<pre><code class="language-javascript">import { S3Client } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: 'http://localhost:9000', region: 'us-east-1', forcePathStyle: true });
<span class="tok-comment">// credentials come from AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-3-stream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.3 — Streams: an experiment with a 348 MB file</span><span class="lc-sub">The file-system side: reading and writing in place, measured</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-7-2-volume" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 7.2 — Volumes, in depth</span><span class="lc-sub">Where a container keeps real files on one machine</span></span></a>

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

Ngoai le: multipart upload cho file LON (part 5 MB-5 GB, toi da 10.000 part, object toi da 5 TB)
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

<h3>🔬 Đo thật: không có "photos/" — chỉ có key</h3>
<p>Trên MinIO cục bộ (RELEASE.2026-11-12) với AWS CLI: ba object, rồi hỏi "thư mục", liệt kê theo prefix, liệt kê có delimiter:</p>
<div class="out">$ aws s3 cp … (3 tệp: photos/2026/a.jpg · photos/2026/b.jpg · docs/readme.txt)
đã tải 3 object
$ # "Thư mục" photos/ có tồn tại không?
$ aws s3api head-object --bucket kho-anh --key photos/ 2&gt;&amp;1 | tail -1
An error occurred (404) when calling the HeadObject operation: Not Found
$ # Liệt kê theo PREFIX: chỉ là so khớp đầu chuỗi
$ aws s3api list-objects-v2 --bucket kho-anh --prefix photos/ --query 'Contents[].Key' --output text
photos/2026/a.jpg	photos/2026/b.jpg
$ aws s3api list-objects-v2 --bucket kho-anh --prefix pho --query 'Contents[].Key' --output text
photos/2026/a.jpg	photos/2026/b.jpg
$ # Thêm Delimiter "/" — ảo giác thư mục do API dựng ra lúc trả lời
$ aws s3api list-objects-v2 --bucket kho-anh --delimiter / --query '{Keys:Contents[].Key,ThuMucAo:CommonPrefixes[].Prefix}' --output json
{
    "Keys": null,
    "ThuMucAo": [
        "docs/",
        "photos/"
    ]
}</div>
<p><code>photos/</code> trả <strong>404</strong> — chưa ai từng tạo nó. Prefix <code>pho</code> trả đúng như <code>photos/</code>, vì prefix là so khớp chuỗi. "Thư mục" mà giao diện quản lý hiện ra là <code>CommonPrefixes</code>, được dựng lúc trả lời khi bạn truyền <code>--delimiter /</code>.</p>
<h3>🔬 Đo thật: giá của prefix scan</h3>
<div class="out">$ node quet.mjs
PUT 10000 object: 15.2 s
LIST prefix logs/: 10000 key · 11 request (1.000 key/trang) · 337 ms
Biết sẵn key (lưu trong DB) ⇒ HEAD thẳng 1 object: 1 request · 2 ms
⇒ 1 triệu key dưới một prefix = 1000 request LIST chỉ để tìm một tệp</div>
<p>Ngay trên máy chủ cục bộ không có độ trễ mạng, tìm một tệp bằng cách liệt kê 10.000 key tốn 11 request; HEAD một key đã biết tốn 1 request và ~2 ms. Qua mạng thật, mỗi trang là một vòng đi-về. Đó là lý do của luật 1: lưu key trong database.</p>
<h3>🔬 Đo thật: "đổi tên thư mục"</h3>
<div class="out">$ node doi-ten.mjs
  copy photos/2026/a.jpg → photos/2025/a.jpg · delete photos/2026/a.jpg
  copy photos/2026/b.jpg → photos/2025/b.jpg · delete photos/2026/b.jpg
đổi tên 2 object = 5 request (1 LIST + 2 COPY + 2 DELETE)
sau đó: photos/2025/a.jpg · photos/2025/b.jpg
RenameObject a.jpg → c.jpg trên MinIO: OK ⇒ photos/2025/a.jpg · photos/2025/b.jpg · photos/2025/c.jpg (MinIO có; AWS chỉ có ở directory bucket S3 Express One Zone)</div>
<div class="out">$ # Bảng S3 API mà Cloudflare R2 hỗ trợ (tài liệu chính thức) — có RenameObject không?
$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -oE "\\[(RenameObject|CopyObject|ListObjectsV2|PutObject|DeleteObject) " | sort -u
[CopyObject 
[DeleteObject 
[ListObjectsV2 
[PutObject 
$ curl -s https://developers.cloudflare.com/r2/api/s3/api/index.md | grep -c "RenameObject"
0</div>
<p>Bucket thường không có lệnh đổi tên: một LIST cộng một COPY và một DELETE cho mỗi object (2N + 1 request, không nguyên tử). SDK có <code>RenameObjectCommand</code> và MinIO này nhận nó, nhưng AWS chỉ hỗ trợ cho directory bucket S3 Express One Zone, còn bảng tương thích S3 của Cloudflare R2 không có dòng nào cho nó — đừng xây trên nó.</p>
<h3>🔬 Đo thật: sửa 100 byte giữa tệp 20 MB</h3>
<div class="out">$ node sua-giua.mjs
file system: ghi 100 byte tại vị trí 10.000.000 · 0.20 ms · 100 byte được ghi
object storage: GET 20.971.520 byte + PUT 20.971.520 byte · 564 ms · ETag 536cb0e6… ⇒ 6756911d…
PUT với WriteOffsetBytes (ghi nối) trên MinIO: BadRequest (400)
object sau đó: 20.971.520 byte · ETag 6756911d…</div>
<p>Hệ thống tệp ghi đúng 100 byte trong một phần năm mili giây. Object storage phải chuyển cả object hai lần — 2 × 20.971.520 byte — và ETag đổi. Ghi nối (<code>WriteOffsetBytes</code>) bị MinIO từ chối; trên AWS nó chỉ có ở directory bucket Express.</p>
<h3>🔬 Đo thật: thời gian tới byte đầu</h3>
<div class="out">$ node tre.mjs
trung vị đọc một tệp nhỏ (máy của khoá, Wi-Fi nhà):
  ổ đĩa cục bộ (fs.readFileSync)      0.025 ms
  MinIO cục bộ qua HTTP (GetObject)    2.3 ms
  CDN media.cuongthai.com (1 byte)     215.6 ms</div>
<p>Ổ đĩa cục bộ ≈ 0,03 ms, MinIO qua HTTP trên cùng máy ≈ 2 ms, CDN của web qua Wi-Fi nhà ≈ 200 ms (một ảnh bìa công khai, đọc đúng như mọi khách xem). Khoảng cách đó là lý do gắn bucket thành ổ đĩa (s3fs) chỉ ổn cho lưu trữ lâu dài, còn với ứng dụng thì khổ.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Với MinIO cục bộ và AWS CLI ở bài Bắt đầu tại đây (1/2): chạy lại khối đầu bằng <code>aws s3 cp</code> / <code>aws s3api head-object</code> / <code>list-objects-v2 --prefix … --delimiter /</code>. Các đoạn mã cần <code>npm i @aws-sdk/client-s3@3.1071.0</code> và dựng client như sau (path-style, endpoint cục bộ của bạn):</p>
<pre><code class="language-javascript">import { S3Client } from '@aws-sdk/client-s3';
const s3 = new S3Client({ endpoint: 'http://localhost:9000', region: 'us-east-1', forcePathStyle: true });
<span class="tok-comment">// khoá lấy từ AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-3-stream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.3 — Stream: thí nghiệm với file 348 MB</span><span class="lc-sub">Phía hệ thống tệp: đọc và ghi tại chỗ, có số đo</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-7-2-volume" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 7.2 — Volume, đào sâu</span><span class="lc-sub">Container giữ tệp thật trên một máy ở đâu</span></span></a>

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
${G00_2}
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
<pre><code class="language-ts">// src/storage/keys.ts — buildKey(category, originalName, { userId })  (output of the real function, 14/11/2026)
images/avatar/u42/1794628549709-3a5edb866277.jpg      // 'Ảnh Tết của tôi.JPG'
images/post/u42/1794628549709-813586f6726e.png        // 'beach.png'
documents/lesson/1794628549709-8c870e70cf2b.pdf       // 'De cuong.pdf' (no user)
audio/songs/u7/1794628549709-6ea6810ccb2a.mp3         // buildAudioKey('bai hat.mp3')
</code></pre>

<div class="callout ok">
<p><strong>Convention (the repo's real one): <code>&lt;category&gt;/u&lt;userId&gt;/&lt;timestamp&gt;-&lt;12 hex&gt;&lt;ext&gt;</code>.</strong> 15 categories (<code>images/avatar</code>, <code>images/post</code>, <code>audio/songs</code>, <code>documents/lesson</code>…), lowercase ASCII, no leading or trailing slash. The original file name is <strong>dropped</strong> — only the extension survives — so a user's Vietnamese file name never reaches a URL, two uploads never collide, and keys cannot be guessed by counting. (Earlier versions of this lesson showed <code>users/\${userId}/avatars/…</code> in <code>upload.service.ts</code>; the repo never used that layout.)</p>
</div>

<h3>Bucket configuration</h3>
<pre><code class="language-text">Kho nay 1 bucket:
  cuongthai-media-storage
  (versioning / lifecycle tren R2: khong kiem o day — khoa khong bao gio cham bucket that)
  
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
// (14/11/2026: there is NO model MediaFile — grep finds 0. What the repo really stores:)
model User {
  avatarUrl  String?  @map("avatar_url") @db.VarChar(500)   // the PUBLIC URL: https://media.cuongthai.com/&lt;key&gt;
}
model PendingUpload {
  r2Key      String   @map("r2_key") @db.VarChar(700)       // key of a presigned upload not yet confirmed (Chapter 4)
  fileSize   BigInt   @map("file_size")
  mimeType   String   @map("mime_type") @db.VarChar(100)
}
// delete: keyFromUrl(user.avatarUrl) =&gt; "images/avatar/u42/…jpg" =&gt; DeleteObject   (keyFromUrl is used in 11 files)
</code></pre>

<p>When you need to &quot;delete a user&#39;s files&quot;, read the URLs and keys the app already stored in its own rows (<code>keyFromUrl()</code> in <code>src/config/r2.ts</code> cuts the key out of a public URL), then DELETE the objects by key. Do NOT list the bucket.</p>

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

<h3>🔬 Measured: the repo's real key builder, and what it keeps in Postgres</h3>
<div class="out">$ # Quy ước key THẬT của kho: src/storage/keys.ts (chạy hàm buildKey của kho, không gọi mạng)
$ cd ~/Downloads/api-backend &amp;&amp; grep -c "^  | '" src/storage/keys.ts &amp;&amp; grep -A3 "^export type StorageCategory" src/storage/keys.ts | tail -3
15
  | 'images/avatar'
  | 'images/cover'
  | 'images/post'
$ npx tsx -e "import { buildKey, buildAudioKey } from './src/storage/keys.ts'; …"
images/avatar/u42/1794628549709-3a5edb866277.jpg
images/post/u42/1794628549709-813586f6726e.png
documents/lesson/1794628549709-8c870e70cf2b.pdf
audio/songs/u7/1794628549709-6ea6810ccb2a.mp3
$ # Kho lưu GÌ trong Postgres để khỏi liệt kê bucket?
$ cd ~/Downloads/api-backend &amp;&amp; grep -nE "^model (User|PendingUpload) |^  avatarUrl |^  r2Key " prisma/schema.prisma | head -4
29:model User {
36:  avatarUrl        String?   @map("avatar_url") @db.VarChar(500)
2114:model PendingUpload {
2117:  r2Key     String   @map("r2_key") @db.VarChar(700)
$ cd ~/Downloads/api-backend &amp;&amp; grep -c "model MediaFile" prisma/schema.prisma; grep -rln "keyFromUrl" src | wc -l | tr -d ' '
0
11</div>
<h3>🔬 Measured: the limits</h3>
<p>On a local MinIO (RELEASE.2026-11-12) with SDK v3 3.1071.0:</p>
<div class="out">$ node gioi-han.mjs
key 1.024 byte (đoạn ≤ 200 byte): OK
key 1.025 byte: KeyTooLongError (400)
key 300 byte KHÔNG có "/" (một đoạn dài): XMinioInvalidObjectName (400)
key "tết/" × 170: 680 ký tự nhưng 1020 byte UTF-8
  ⇒ PUT: OK
metadata người dùng ~1,9 KB: OK
metadata người dùng ~2,1 KB: MetadataTooLarge (400)
object 0 byte: OK
  ⇒ ContentLength 0 · ETag "d41d8cd98f00b204e9800998ecf8427e"</div>
<p>Keys are limited in <strong>bytes</strong> (1,024, UTF-8), not characters — Vietnamese letters take 2–3 bytes each. User metadata above ~2 KB is rejected. An empty object is valid (its ETag is the MD5 of nothing). MinIO adds its own rule: one path segment longer than 255 bytes is refused — S3 and R2 do not have that limit, so do not mistake it for the standard.</p>
<h3>🔬 Measured: system vs user metadata</h3>
<div class="out">$ aws s3api put-object --bucket mo-hinh --key brand/logo.svg --body logo.svg --content-type image/svg+xml --cache-control "public, max-age=31536000, immutable" --metadata nguon=figma,nguoi-tai=42 --query ETag --output text
"46661d6d65debc63884004fed6e37e5c"
$ aws s3api head-object --bucket mo-hinh --key brand/logo.svg --query '{ContentType:ContentType,CacheControl:CacheControl,ContentLength:ContentLength,ETag:ETag,LastModified:LastModified,Metadata:Metadata}'
{
    "ContentType": "image/svg+xml",
    "CacheControl": "public, max-age=31536000, immutable",
    "ContentLength": 41,
    "ETag": "\\"46661d6d65debc63884004fed6e37e5c\\"",
    "LastModified": "2026-11-14T03:56:17+00:00",
    "Metadata": {
        "nguoi-tai": "42",
        "nguon": "figma"
    }
}
$ # Trên dây HTTP, metadata người dùng đi dưới dạng header x-amz-meta-*
$ curl -s -D - -o /dev/null "$(aws s3 presign s3://mo-hinh/brand/logo.svg)" | grep -iE "^(content-type|cache-control|etag|x-amz-meta)"
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/svg+xml
ETag: "46661d6d65debc63884004fed6e37e5c"
x-amz-meta-nguoi-tai: 42
x-amz-meta-nguon: figma
$ # Không gửi --content-type thì sao?
$ printf 'abc' &gt; khong-ro &amp;&amp; aws s3api put-object --bucket mo-hinh --key khong-ro --body khong-ro --query ETag --output text &gt;/dev/null &amp;&amp; aws s3api head-object --bucket mo-hinh --key khong-ro --query ContentType --output text
binary/octet-stream</div>
<p>User metadata travel as <code>x-amz-meta-*</code> headers. Forget <code>--content-type</code> and the object is served as <code>binary/octet-stream</code> — the browser will not show it as an image.</p>
<h3>🔬 Measured: when the ETag is an MD5</h3>
<div class="out">$ aws s3api put-object --bucket mo-hinh --key nho.txt --body nho.txt --query ETag --output text; md5 -q nho.txt
"2201c07c37755e663c07335cfd2f44c6"
2201c07c37755e663c07335cfd2f44c6
$ aws s3 cp to.bin s3://mo-hinh/to.bin     # 20 MB ⇒ CLI tự chia multipart (ngưỡng 8 MB)
"ac3827f7556624c52349a9e6b88ce0cf-3"
d129b1c1416d6288aaf9636648112905
$ aws s3api put-object --bucket mo-hinh --key to-mot-luot.bin --body to.bin --query ETag --output text
"d129b1c1416d6288aaf9636648112905"</div>
<p>One PUT: ETag = MD5 (8 bytes and 20 MB both matched <code>md5</code>). The CLI's automatic multipart (8 MB parts) gave <code>…-3</code>, which is not the MD5 of the file.</p>
<h3>🔬 Measured: a key name that breaks hand-built URLs</h3>
<div class="out">$ aws s3api put-object --bucket mo-hinh --key "logo tết+1#a.png" --body p.png --query ETag --output text
"bff139fa05ac583f685a523ab3d110a0"
$ aws s3api list-objects-v2 --bucket mo-hinh --prefix logo --query 'Contents[].Key' --output text
logo tết+1#a.png
$ # Ghép URL bằng cộng chuỗi, chỉ thay dấu cách — "#" bị hiểu là ĐẦU fragment, không gửi lên server:
$ curl -s -o /dev/null -w "%{http_code}  %{url_effective}\\n" "http://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt+1#a.png"
404  http://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt+1#a.png
$ # Mã hoá từng đoạn bằng encodeURIComponent:
$ node -e "console.log('http://localhost:20200/mo-hinh/' + encodeURIComponent('logo tết+1#a.png'))" &gt; url.txt &amp;&amp; cat url.txt &amp;&amp; curl -s -o /dev/null -w "%{http_code}\\n" "$(cat url.txt)"
http://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt%2B1%23a.png
200
$ # Mã hoá dấu cách thành "+" (kiểu form) — lệch:
$ curl -s -o /dev/null -w "%{http_code}  %{url_effective}\\n" "http://localhost:20200/mo-hinh/logo+t%E1%BA%BFt%2B1%23a.png"
404  http://localhost:20200/mo-hinh/logo+t%E1%BA%BFt%2B1%23a.png</div>
<p>The object is stored fine. A hand-built URL loses everything after <code>#</code> (it is a fragment, never sent) and a space written as <code>+</code> names a different key; <code>encodeURIComponent</code> per segment works. Simplest of all: keep keys ASCII like the repo does.</p>
<h3>🔁 Run it yourself</h3>
<p>With the local MinIO and AWS CLI from Start here (1/2): the commands above run as shown (replace port 20200 with yours). To see the repo's convention, from the repo root run <code>npx tsx -e "import { buildKey } from './src/storage/keys.ts'; console.log(buildKey('images/avatar', 'Ảnh Tết.JPG', { userId: 42 }))"</code> — it touches no network and no bucket.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-3-kiem-file-that" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.3 — Do not trust user files: magic bytes, polyglots and decompression bombs</span><span class="lc-sub">Check the real file before you choose its key and Content-Type</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Headers that change behaviour: cache, compression, CORS, security</span><span class="lc-sub">Content-Type, Cache-Control and URL encoding at the HTTP layer</span></span></a>

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
<pre><code class="language-ts">// src/storage/keys.ts — buildKey(category, originalName, { userId })  (output of the real function, 14/11/2026)
images/avatar/u42/1794628549709-3a5edb866277.jpg      // 'Ảnh Tết của tôi.JPG'
images/post/u42/1794628549709-813586f6726e.png        // 'beach.png'
documents/lesson/1794628549709-8c870e70cf2b.pdf       // 'De cuong.pdf' (no user)
audio/songs/u7/1794628549709-6ea6810ccb2a.mp3         // buildAudioKey('bai hat.mp3')
</code></pre>

<div class="callout ok">
<p><strong>Quy ước (của kho, thật): <code>&lt;loại&gt;/u&lt;userId&gt;/&lt;mốc ms&gt;-&lt;12 hex&gt;&lt;đuôi&gt;</code>.</strong> 15 loại (<code>images/avatar</code>, <code>images/post</code>, <code>audio/songs</code>, <code>documents/lesson</code>…), chữ thường ASCII, không gạch chéo đầu hay cuối. Tên gốc của tệp <strong>bị bỏ</strong> — chỉ giữ đuôi — nên tên tiếng Việt của người dùng không bao giờ lọt vào URL, hai lần tải không đè nhau, và không ai đoán key bằng cách đếm. (Bản cũ của bài ghi <code>users/\${userId}/avatars/…</code> trong <code>upload.service.ts</code>; kho chưa từng dùng cách đặt đó.)</p>
</div>

<h3>Bucket configuration</h3>
<pre><code class="language-text">Kho nay 1 bucket:
  cuongthai-media-storage
  (versioning / lifecycle tren R2: khong kiem o day — khoa khong bao gio cham bucket that)
  
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
// (14/11/2026: there is NO model MediaFile — grep finds 0. What the repo really stores:)
model User {
  avatarUrl  String?  @map("avatar_url") @db.VarChar(500)   // the PUBLIC URL: https://media.cuongthai.com/&lt;key&gt;
}
model PendingUpload {
  r2Key      String   @map("r2_key") @db.VarChar(700)       // key of a presigned upload not yet confirmed (Chapter 4)
  fileSize   BigInt   @map("file_size")
  mimeType   String   @map("mime_type") @db.VarChar(100)
}
// delete: keyFromUrl(user.avatarUrl) =&gt; "images/avatar/u42/…jpg" =&gt; DeleteObject   (keyFromUrl is used in 11 files)
</code></pre>

<p>Khi cần &quot;xoá tệp của một người dùng&quot;, đọc các URL và key mà ứng dụng đã lưu trong chính các dòng của nó (<code>keyFromUrl()</code> trong <code>src/config/r2.ts</code> cắt key ra khỏi URL công khai), rồi DELETE object theo key. KHÔNG list bucket.</p>

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

<h3>🔬 Đo thật: hàm đặt key thật của kho, và kho lưu gì trong Postgres</h3>
<div class="out">$ # Quy ước key THẬT của kho: src/storage/keys.ts (chạy hàm buildKey của kho, không gọi mạng)
$ cd ~/Downloads/api-backend &amp;&amp; grep -c "^  | '" src/storage/keys.ts &amp;&amp; grep -A3 "^export type StorageCategory" src/storage/keys.ts | tail -3
15
  | 'images/avatar'
  | 'images/cover'
  | 'images/post'
$ npx tsx -e "import { buildKey, buildAudioKey } from './src/storage/keys.ts'; …"
images/avatar/u42/1794628549709-3a5edb866277.jpg
images/post/u42/1794628549709-813586f6726e.png
documents/lesson/1794628549709-8c870e70cf2b.pdf
audio/songs/u7/1794628549709-6ea6810ccb2a.mp3
$ # Kho lưu GÌ trong Postgres để khỏi liệt kê bucket?
$ cd ~/Downloads/api-backend &amp;&amp; grep -nE "^model (User|PendingUpload) |^  avatarUrl |^  r2Key " prisma/schema.prisma | head -4
29:model User {
36:  avatarUrl        String?   @map("avatar_url") @db.VarChar(500)
2114:model PendingUpload {
2117:  r2Key     String   @map("r2_key") @db.VarChar(700)
$ cd ~/Downloads/api-backend &amp;&amp; grep -c "model MediaFile" prisma/schema.prisma; grep -rln "keyFromUrl" src | wc -l | tr -d ' '
0
11</div>
<h3>🔬 Đo thật: các giới hạn</h3>
<p>Trên MinIO cục bộ (RELEASE.2026-11-12) với SDK v3 3.1071.0:</p>
<div class="out">$ node gioi-han.mjs
key 1.024 byte (đoạn ≤ 200 byte): OK
key 1.025 byte: KeyTooLongError (400)
key 300 byte KHÔNG có "/" (một đoạn dài): XMinioInvalidObjectName (400)
key "tết/" × 170: 680 ký tự nhưng 1020 byte UTF-8
  ⇒ PUT: OK
metadata người dùng ~1,9 KB: OK
metadata người dùng ~2,1 KB: MetadataTooLarge (400)
object 0 byte: OK
  ⇒ ContentLength 0 · ETag "d41d8cd98f00b204e9800998ecf8427e"</div>
<p>Key giới hạn theo <strong>byte</strong> (1.024, UTF-8), không theo ký tự — chữ Việt có dấu chiếm 2–3 byte mỗi chữ. Metadata người dùng quá ~2 KB bị từ chối. Object rỗng vẫn hợp lệ (ETag là MD5 của chuỗi rỗng). MinIO có thêm luật riêng: một đoạn đường dẫn dài quá 255 byte bị từ chối — S3 và R2 không có giới hạn này, đừng nhầm là chuẩn.</p>
<h3>🔬 Đo thật: metadata hệ thống và metadata người dùng</h3>
<div class="out">$ aws s3api put-object --bucket mo-hinh --key brand/logo.svg --body logo.svg --content-type image/svg+xml --cache-control "public, max-age=31536000, immutable" --metadata nguon=figma,nguoi-tai=42 --query ETag --output text
"46661d6d65debc63884004fed6e37e5c"
$ aws s3api head-object --bucket mo-hinh --key brand/logo.svg --query '{ContentType:ContentType,CacheControl:CacheControl,ContentLength:ContentLength,ETag:ETag,LastModified:LastModified,Metadata:Metadata}'
{
    "ContentType": "image/svg+xml",
    "CacheControl": "public, max-age=31536000, immutable",
    "ContentLength": 41,
    "ETag": "\\"46661d6d65debc63884004fed6e37e5c\\"",
    "LastModified": "2026-11-14T03:56:17+00:00",
    "Metadata": {
        "nguoi-tai": "42",
        "nguon": "figma"
    }
}
$ # Trên dây HTTP, metadata người dùng đi dưới dạng header x-amz-meta-*
$ curl -s -D - -o /dev/null "$(aws s3 presign s3://mo-hinh/brand/logo.svg)" | grep -iE "^(content-type|cache-control|etag|x-amz-meta)"
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/svg+xml
ETag: "46661d6d65debc63884004fed6e37e5c"
x-amz-meta-nguoi-tai: 42
x-amz-meta-nguon: figma
$ # Không gửi --content-type thì sao?
$ printf 'abc' &gt; khong-ro &amp;&amp; aws s3api put-object --bucket mo-hinh --key khong-ro --body khong-ro --query ETag --output text &gt;/dev/null &amp;&amp; aws s3api head-object --bucket mo-hinh --key khong-ro --query ContentType --output text
binary/octet-stream</div>
<p>Metadata người dùng đi dưới dạng header <code>x-amz-meta-*</code>. Quên <code>--content-type</code> thì object được phục vụ là <code>binary/octet-stream</code> — trình duyệt sẽ không hiện nó như ảnh.</p>
<h3>🔬 Đo thật: khi nào ETag là MD5</h3>
<div class="out">$ aws s3api put-object --bucket mo-hinh --key nho.txt --body nho.txt --query ETag --output text; md5 -q nho.txt
"2201c07c37755e663c07335cfd2f44c6"
2201c07c37755e663c07335cfd2f44c6
$ aws s3 cp to.bin s3://mo-hinh/to.bin     # 20 MB ⇒ CLI tự chia multipart (ngưỡng 8 MB)
"ac3827f7556624c52349a9e6b88ce0cf-3"
d129b1c1416d6288aaf9636648112905
$ aws s3api put-object --bucket mo-hinh --key to-mot-luot.bin --body to.bin --query ETag --output text
"d129b1c1416d6288aaf9636648112905"</div>
<p>Một lần PUT: ETag = MD5 (8 byte và 20 MB đều khớp <code>md5</code>). Multipart tự động của CLI (phần 8 MB) cho <code>…-3</code>, không phải MD5 của tệp.</p>
<h3>🔬 Đo thật: tên key làm hỏng URL ghép tay</h3>
<div class="out">$ aws s3api put-object --bucket mo-hinh --key "logo tết+1#a.png" --body p.png --query ETag --output text
"bff139fa05ac583f685a523ab3d110a0"
$ aws s3api list-objects-v2 --bucket mo-hinh --prefix logo --query 'Contents[].Key' --output text
logo tết+1#a.png
$ # Ghép URL bằng cộng chuỗi, chỉ thay dấu cách — "#" bị hiểu là ĐẦU fragment, không gửi lên server:
$ curl -s -o /dev/null -w "%{http_code}  %{url_effective}\\n" "http://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt+1#a.png"
404  http://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt+1#a.png
$ # Mã hoá từng đoạn bằng encodeURIComponent:
$ node -e "console.log('http://localhost:20200/mo-hinh/' + encodeURIComponent('logo tết+1#a.png'))" &gt; url.txt &amp;&amp; cat url.txt &amp;&amp; curl -s -o /dev/null -w "%{http_code}\\n" "$(cat url.txt)"
http://localhost:20200/mo-hinh/logo%20t%E1%BA%BFt%2B1%23a.png
200
$ # Mã hoá dấu cách thành "+" (kiểu form) — lệch:
$ curl -s -o /dev/null -w "%{http_code}  %{url_effective}\\n" "http://localhost:20200/mo-hinh/logo+t%E1%BA%BFt%2B1%23a.png"
404  http://localhost:20200/mo-hinh/logo+t%E1%BA%BFt%2B1%23a.png</div>
<p>Object vẫn lưu bình thường. URL ghép tay mất mọi thứ sau <code>#</code> (đó là fragment, không bao giờ gửi đi) và dấu cách viết thành <code>+</code> trỏ sang key khác; <code>encodeURIComponent</code> từng đoạn thì chạy. Đơn giản nhất: giữ key ASCII như kho.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Với MinIO cục bộ và AWS CLI ở bài Bắt đầu tại đây (1/2): các lệnh trên chạy y như vậy (đổi cổng 20200 thành cổng của bạn). Muốn xem quy ước của kho, từ thư mục gốc của kho chạy <code>npx tsx -e "import { buildKey } from './src/storage/keys.ts'; console.log(buildKey('images/avatar', 'Ảnh Tết.JPG', { userId: 42 }))"</code> — không chạm mạng, không chạm bucket.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-3-kiem-file-that" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.3 — Đừng tin file người dùng: magic bytes, file lai và bom giải nén</span><span class="lc-sub">Kiểm tệp thật trước khi chọn key và Content-Type</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Các header đổi hành vi: cache, nén, CORS, bảo mật</span><span class="lc-sub">Content-Type, Cache-Control và mã hoá URL ở tầng HTTP</span></span></a>

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
