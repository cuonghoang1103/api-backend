/**
 * Node.js — Chương 10: Upload file và object storage.
 * Mọi output là đo thật: Node v22.21.0, express 5.2.1, multer 2.2.0, busboy 1.6.0,
 * sharp 0.35.3, file-type 22.0.1, @aws-sdk/client-s3 3.1095.0 + s3-request-presigner + lib-storage,
 * storage tương thích S3 chạy bằng MinIO trong Docker (endpoint http://127.0.0.1:9010).
 * Header production lấy bằng curl thật trên https://media.cuongthai.com (27/07/2026).
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 10 — File upload and object storage|||Chương 10 — Upload file và object storage',
  description: 'File vào máy chủ bằng đường nào và tốn bao nhiêu RAM, object storage và URL ký sẵn hoạt động ra sao, vì sao không được tin một byte nào của người dùng, và cách phục vụ lại media cho rẻ.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — Receiving a file: multipart, base64, and the price in RAM|||10.1 — Nhận file: multipart, base64, và cái giá phải trả bằng RAM',
      slug: 'nodejs-10-1-nhan-file-multipart',
      type: 'VIDEO',
      description: 'Bốn cách nhận cùng một file 6,85MB, đo bằng RSS thật: base64 tốn 47MB, memoryStorage 19MB, stream ra đĩa 8,6MB — và bốn video 120MB cùng lúc đẩy máy chủ lên 786MB.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Receiving a file: multipart, base64, and the price in RAM</h2>
<p class="lead">Every chapter so far has moved JSON: a few hundred bytes in, a few kilobytes out. A file is a different animal. It is large, it arrives at whatever speed the user's phone can manage, and — this is the part that catches people — the way you choose to receive it decides how much memory your server holds per concurrent upload. A design that works beautifully with one tester on localhost can put a 6GB VPS on the floor with four simultaneous users. This lesson measures that, in bytes.</p>

<h3>Three ways a file gets into your server</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Base64 inside JSON</span><span class="lz-d">the client reads the file, encodes it as text, and posts <code>{"data":"data:image/jpeg;base64,…"}</code>. Simple, works with any JSON client — and 33% larger on the wire before anything else happens</span></div>
  <div class="lz-step"><span class="lz-t">multipart/form-data</span><span class="lz-d">the format HTML forms have used since 1995: the body is split by a boundary string into parts, each with its own headers. Binary-safe, streamable, and what every upload library speaks</span></div>
  <div class="lz-step"><span class="lz-t">Raw body / direct to storage</span><span class="lz-d">a bare <code>PUT</code> whose body IS the file — no envelope at all. This is what a presigned URL uses (lesson 10.2), and the only path where the file never touches your server</span></div>
</div>

<h3>What multipart actually looks like</h3>
<p>Before trusting a library, look at the bytes. This is a real request body captured from <code>curl -F "caption=Anh bien" -F "file=@tiny.txt"</code>, with a raw HTTP server dumping it verbatim (<code>\\r\\n</code> shown explicitly):</p>
<div class="out">Content-Type: multipart/form-data; boundary=------------------------ZroCscp9Ey8HkXDMW4skii
Content-Length: 316

--------------------------ZroCscp9Ey8HkXDMW4skii\\r\\n
Content-Disposition: form-data; name="caption"\\r\\n
\\r\\n
Anh bien\\r\\n
--------------------------ZroCscp9Ey8HkXDMW4skii\\r\\n
Content-Disposition: form-data; name="file"; filename="tiny.txt"\\r\\n
Content-Type: text/plain\\r\\n
\\r\\n
xin chao\\r\\n
--------------------------ZroCscp9Ey8HkXDMW4skii--\\r\\n</div>
<p>Three things worth noticing, because all three become bugs later. First, <strong>the parts are ordered</strong> — <code>caption</code> arrives before <code>file</code> here only because curl sent it first; if the client puts the text field last, your file handler runs before that field exists. Second, <strong><code>filename</code> and <code>Content-Type</code> are supplied by the client</strong>, in plain text, with no verification whatsoever — lesson 10.3 is entirely about what that means. Third, the envelope costs almost nothing: for a 7.183.099-byte photo the wire carried 7.183.298 bytes, an overhead of <strong>199 bytes</strong> regardless of file size.</p>

<h3>Measurement 1 — base64 is not free</h3>
<p>Same photo, encoded as a data URL inside a JSON body:</p>
<div class="out">gốc          : 7.183.099 byte
base64       : 9.577.468 byte (+33,33%)
thân JSON    : 9.577.521 byte (+33,33%)</div>
<p>Base64 turns every 3 bytes into 4 characters, so the increase is exactly one third — not an implementation detail, arithmetic. On a 5 Mbps mobile uplink that is 11,5 seconds instead of 8,6 for one photo. And the cost does not stop at bandwidth: the server has to hold the text, parse it as JSON, then allocate a second buffer for the decoded bytes.</p>

<h3>Measurement 2 — the same upload, four ways, measured by RSS</h3>
<p>One Express server per strategy, one 6,85MB photo, resident memory sampled every 10ms. <code>rssDelta</code> is peak minus baseline for a single request:</p>
<div class="out">chiến lược                       RSS nền   RSS đỉnh   tăng thêm
base64 trong JSON (limit 32mb)   57,0MB    104,2MB    +47,2MB
multer memoryStorage             57,1MB     76,3MB    +19,2MB
multer diskStorage (./tmp-up)    57,3MB     68,4MB    +11,2MB
busboy → stream thẳng ra đĩa     57,2MB     65,8MB     +8,6MB</div>
<p>Read the first row carefully: <strong>a 6,85MB file cost 47MB of resident memory</strong>, roughly 6,9× the file. That is the JSON string (9,6MB of UTF-16-backed text), plus <code>express.json</code>'s own concatenation buffer, plus the decoded <code>Buffer</code>, plus garbage that has not been collected yet. The bottom row — piping the file part straight to disk without ever holding it whole — costs 1,25× the file.</p>

<h3>Measurement 3 — now make the file big</h3>
<p>Same servers, one 120MB upload:</p>
<div class="out">multer memoryStorage : 151ms server-side, RSS 57,0 → 305,1MB  (+248,1MB)
busboy → stream      : 287ms server-side, RSS 57,1 →  97,4MB   (+40,3MB)</div>
<p>Buffering 120MB in memory cost 248MB — about twice the file, because V8 grows buffers by copying. Streaming cost 40MB and took 136ms longer, which is the honest trade: streaming is not free in latency, it is cheap in memory.</p>

<h3>Measurement 4 — the number that actually breaks production</h3>
<p>Four clients PUT a 120MB video at the same moment, into <code>multer.memoryStorage()</code>:</p>
<div class="out">4 file 120MB cùng lúc → RSS 56,7MB → 786,1MB  (+729,4MB)</div>
<p>Four users. 729MB. On the 6GB VPS this site runs on — which also hosts PostgreSQL, Redis, the Next.js frontend and several AI jobs — a dozen simultaneous uploaders is not a slowdown, it is an OOM kill and a container restart. Nobody plans for this, because in development you are the only uploader.</p>
<p>For comparison, eight simultaneous 6,85MB photos cost +61,7MB with <code>memoryStorage</code> and +42,8MB streaming. The gap widens with file size, which is exactly why the rule of thumb below is size-based rather than absolute.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Ảnh, avatar, tài liệu nhỏ (&lt; 10MB)</span><span class="lz-lnote"><code>memoryStorage</code> is fine and much simpler: you need the whole buffer anyway to re-encode it (lesson 10.3), and 20MB of peak RAM per request is affordable</span></div>
  <div class="lz-layer"><span class="lz-lname">Video, tệp lớn (&gt; 50MB)</span><span class="lz-lnote">never buffer. Either stream through to storage (lesson 10.2) or take your server out of the path entirely with a presigned URL</span></div>
  <div class="lz-layer"><span class="lz-lname">Đĩa tạm (<code>diskStorage</code>)</span><span class="lz-lnote">the middle ground — cheap RAM, but now you own temp-file cleanup, and on a container that means a volume that fills up silently</span></div>
</div>

<h3>Limits: what they do and what they do not</h3>
<p><code>multer</code> takes a <code>limits.fileSize</code>. Setting it to 5MB and sending the 6,85MB photo:</p>
<pre><code><span class="tok-kw">const</span> up = multer({ storage: multer.memoryStorage(), limits: { fileSize: <span class="tok-num">5</span> * <span class="tok-num">1024</span> * <span class="tok-num">1024</span> } });
app.post(<span class="tok-str">'/limited'</span>, (req, res) =&gt; {
  up.single(<span class="tok-str">'file'</span>)(req, res, (err) =&gt; {
    <span class="tok-kw">if</span> (err) <span class="tok-kw">return</span> res.status(<span class="tok-num">413</span>).json({ name: err.name, code: err.code, message: err.message, field: err.field });
    res.json({ ok: <span class="tok-kw">true</span>, size: req.file.size });
  });
});</code></pre>
<div class="out">{"name":"MulterError","code":"LIMIT_FILE_SIZE","message":"File too large","field":"file"}
HTTP 413 | client đã gửi 7.183.298 byte</div>
<p>The rejection works — and the client still uploaded all 7,18MB before hearing about it. A size limit protects your <em>memory and disk</em>, never your <em>bandwidth</em>. If you want to reject early you must check <code>Content-Length</code> before reading the body, and even that is a hint the client controls. The other half of the same lesson: <code>MulterError</code> is thrown into the middleware chain, so if you write <code>app.post('/u', upload.single('file'), handler)</code> with no error handler, an oversized upload becomes a 500 with a stack trace instead of a 413.</p>

<div class="pitfall">
<p><strong>Five ways upload handling goes wrong in real code.</strong> (1) <code>multer()</code> with no options at all uses <code>memoryStorage</code> and <strong>no size limit</strong> — one 2GB upload ends the process. (2) Reading <code>req.body.category</code> inside <code>fileFilter</code>: the text field may not have been parsed yet, so it is <code>undefined</code> — decide with fields that arrive in the URL or in headers instead. (3) Forgetting that <code>upload.array('files', 10)</code> multiplies your memory by ten. (4) <code>diskStorage</code> without cleanup: every failed request leaves a temp file, and containers do not sweep <code>/tmp</code> for you. (5) Putting the upload route behind a body-parsing middleware — <code>express.json()</code> will not touch multipart, but a global <code>express.raw()</code> or a logger that buffers bodies will quietly double your memory.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> <code>src/routes/upload.routes.ts</code> uses <code>multer({ storage: multer.memoryStorage(), limits: { fileSize: 160 * 1024 * 1024 } })</code> — memory on purpose, because every image goes straight into sharp for re-encoding and a temp file would just be an extra round trip to disk. The 160MB ceiling is a hard backstop above the 150MB video limit; the real per-category limits (<code>maxFileSizeImages</code>, <code>maxFileSizeAudio</code>, <code>maxFileSizeDocument</code>) live in <code>uploadService</code> and produce a typed <code>UploadError</code> with status 413 rather than a Multer stack trace. Videos never take this path at all: they are pushed straight to R2 with a presigned URL, because both the memory numbers above <em>and</em> Cloudflare's 100MB request-body cap make a 150MB multipart upload impossible.</p>
</div>

<h3>What to take away</h3>
<p>Choosing how to receive a file is a memory decision disguised as an API decision. Base64 is the most convenient and the most expensive; <code>memoryStorage</code> is the right default for anything you will process anyway; streaming is mandatory once files get large; and the cheapest upload of all is the one your server never sees — which is the subject of the next lesson.</p>

<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-963" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 963 — Uploading &amp; Downloading Objects</span><span class="lc-sub">10 bài tập: đưa file vào storage bằng buffer và bằng stream.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Express.js Core Concepts</span><span class="lc-sub">10 bài tập: middleware, body parser, và vòng đời một request.</span></span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Nhận file: multipart, base64, và cái giá phải trả bằng RAM</h2>
<p class="lead">Mọi chương tới giờ đều chuyển JSON: vài trăm byte vào, vài kilobyte ra. File là một giống loài khác. Nó to, nó tới với tốc độ mà chiếc điện thoại của người dùng gánh được, và — đây là chỗ hay bẫy người — cách bạn chọn để NHẬN nó quyết định máy chủ giữ bao nhiêu bộ nhớ cho mỗi lượt upload đồng thời. Một thiết kế chạy đẹp với một người test trên localhost có thể quật ngã VPS 6GB chỉ với bốn người dùng cùng lúc. Bài này đo chuyện đó, bằng byte.</p>

<h3>Ba đường để một file đi vào máy chủ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Base64 nhét trong JSON</span><span class="lz-d">client đọc file, mã hoá thành chữ, rồi POST <code>{"data":"data:image/jpeg;base64,…"}</code>. Đơn giản, client JSON nào cũng làm được — và phình 33% trên đường truyền trước khi kịp làm gì</span></div>
  <div class="lz-step"><span class="lz-t">multipart/form-data</span><span class="lz-d">định dạng mà form HTML dùng từ 1995: thân request được cắt bởi một chuỗi ranh giới thành nhiều phần, mỗi phần có header riêng. An toàn với nhị phân, stream được, và là thứ mọi thư viện upload đều nói</span></div>
  <div class="lz-step"><span class="lz-t">Thân thô / thẳng lên storage</span><span class="lz-d">một <code>PUT</code> trần mà thân request CHÍNH LÀ file — không có phong bì nào cả. Đây là cách URL ký sẵn hoạt động (bài 10.2), và là con đường duy nhất mà file không bao giờ chạm vào máy chủ của bạn</span></div>
</div>

<h3>multipart trông thật ra như thế nào</h3>
<p>Trước khi tin một thư viện, hãy nhìn vào byte. Đây là thân request THẬT bắt được từ <code>curl -F "caption=Anh bien" -F "file=@tiny.txt"</code>, với một HTTP server thô in ra nguyên văn (<code>\\r\\n</code> được hiện rõ):</p>
<div class="out">Content-Type: multipart/form-data; boundary=------------------------ZroCscp9Ey8HkXDMW4skii
Content-Length: 316

--------------------------ZroCscp9Ey8HkXDMW4skii\\r\\n
Content-Disposition: form-data; name="caption"\\r\\n
\\r\\n
Anh bien\\r\\n
--------------------------ZroCscp9Ey8HkXDMW4skii\\r\\n
Content-Disposition: form-data; name="file"; filename="tiny.txt"\\r\\n
Content-Type: text/plain\\r\\n
\\r\\n
xin chao\\r\\n
--------------------------ZroCscp9Ey8HkXDMW4skii--\\r\\n</div>
<p>Ba điều đáng để ý, vì cả ba đều biến thành lỗi về sau. Thứ nhất, <strong>các phần CÓ THỨ TỰ</strong> — ở đây <code>caption</code> đến trước <code>file</code> chỉ vì curl gửi nó trước; nếu client đặt trường chữ ở cuối thì handler file của bạn chạy trước khi trường đó tồn tại. Thứ hai, <strong><code>filename</code> và <code>Content-Type</code> là do client cung cấp</strong>, dưới dạng chữ thường, không hề được kiểm chứng — cả bài 10.3 nói về hệ quả của điều đó. Thứ ba, cái phong bì gần như không tốn gì: với tấm ảnh 7.183.099 byte, đường truyền chở 7.183.298 byte, phụ trội <strong>199 byte</strong> bất kể file to nhỏ.</p>

<h3>Phép đo 1 — base64 không miễn phí</h3>
<p>Vẫn tấm ảnh đó, mã hoá thành data URL nằm trong thân JSON:</p>
<div class="out">gốc          : 7.183.099 byte
base64       : 9.577.468 byte (+33,33%)
thân JSON    : 9.577.521 byte (+33,33%)</div>
<p>Base64 biến mỗi 3 byte thành 4 ký tự, nên mức phình đúng bằng một phần ba — không phải chi tiết cài đặt, mà là số học. Trên đường lên 5 Mbps của mạng di động, đó là 11,5 giây thay vì 8,6 giây cho một tấm ảnh. Và cái giá không dừng ở băng thông: máy chủ phải giữ đoạn chữ đó, phân tích nó thành JSON, rồi cấp phát thêm một buffer thứ hai cho phần byte đã giải mã.</p>

<h3>Phép đo 2 — cùng một lần upload, bốn cách, đo bằng RSS</h3>
<p>Mỗi chiến lược một server Express, một tấm ảnh 6,85MB, bộ nhớ thường trú lấy mẫu mỗi 10ms. <code>tăng thêm</code> là đỉnh trừ nền cho MỘT request:</p>
<div class="out">chiến lược                       RSS nền   RSS đỉnh   tăng thêm
base64 trong JSON (limit 32mb)   57,0MB    104,2MB    +47,2MB
multer memoryStorage             57,1MB     76,3MB    +19,2MB
multer diskStorage (./tmp-up)    57,3MB     68,4MB    +11,2MB
busboy → stream thẳng ra đĩa     57,2MB     65,8MB     +8,6MB</div>
<p>Đọc kỹ dòng đầu: <strong>một file 6,85MB tốn 47MB bộ nhớ thường trú</strong>, tức khoảng 6,9 lần kích thước file. Đó là chuỗi JSON (9,6MB chữ), cộng buffer nối chuỗi của chính <code>express.json</code>, cộng <code>Buffer</code> đã giải mã, cộng rác chưa kịp thu gom. Dòng cuối — đẩy thẳng phần file ra đĩa mà không bao giờ giữ trọn nó — tốn 1,25 lần kích thước file.</p>

<h3>Phép đo 3 — giờ cho file to lên</h3>
<p>Vẫn những server đó, một lần upload 120MB:</p>
<div class="out">multer memoryStorage : 151ms phía máy chủ, RSS 57,0 → 305,1MB  (+248,1MB)
busboy → stream      : 287ms phía máy chủ, RSS 57,1 →  97,4MB   (+40,3MB)</div>
<p>Đệm 120MB trong bộ nhớ tốn 248MB — khoảng gấp đôi file, vì V8 nới buffer bằng cách sao chép. Stream tốn 40MB và chậm hơn 136ms, đó là cái đổi chác thành thật: stream không miễn phí về độ trễ, nó rẻ về bộ nhớ.</p>

<h3>Phép đo 4 — con số thật sự làm sập production</h3>
<p>Bốn client cùng lúc đẩy lên một video 120MB, vào <code>multer.memoryStorage()</code>:</p>
<div class="out">4 file 120MB cùng lúc → RSS 56,7MB → 786,1MB  (+729,4MB)</div>
<p>Bốn người dùng. 729MB. Trên chiếc VPS 6GB mà site này chạy — nơi còn có PostgreSQL, Redis, frontend Next.js và mấy job AI — mười mấy người upload cùng lúc không phải là "chậm đi", mà là bị OOM giết và container khởi động lại. Không ai lường trước chuyện này, vì lúc phát triển bạn là người upload duy nhất.</p>
<p>Để so sánh: tám tấm ảnh 6,85MB cùng lúc tốn +61,7MB với <code>memoryStorage</code> và +42,8MB khi stream. Khoảng cách nới ra theo kích thước file, và đó đúng là lý do quy tắc ngón tay cái bên dưới dựa vào kích thước chứ không phải một câu tuyệt đối.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Ảnh, avatar, tài liệu nhỏ (&lt; 10MB)</span><span class="lz-lnote"><code>memoryStorage</code> vừa ổn vừa đơn giản hơn nhiều: đằng nào bạn cũng cần trọn buffer để mã hoá lại (bài 10.3), và 20MB RAM đỉnh mỗi request là chấp nhận được</span></div>
  <div class="lz-layer"><span class="lz-lname">Video, tệp lớn (&gt; 50MB)</span><span class="lz-lnote">tuyệt đối đừng đệm. Hoặc stream xuyên qua thẳng lên storage (bài 10.2), hoặc rút hẳn máy chủ ra khỏi đường đi bằng URL ký sẵn</span></div>
  <div class="lz-layer"><span class="lz-lname">Đĩa tạm (<code>diskStorage</code>)</span><span class="lz-lnote">nước đi ở giữa — RAM rẻ, nhưng giờ bạn sở hữu việc dọn file tạm, và trong container thì đó là một volume âm thầm đầy dần</span></div>
</div>

<h3>Giới hạn: nó làm được gì và không làm được gì</h3>
<p><code>multer</code> nhận tuỳ chọn <code>limits.fileSize</code>. Đặt 5MB rồi gửi tấm ảnh 6,85MB:</p>
<pre><code><span class="tok-kw">const</span> up = multer({ storage: multer.memoryStorage(), limits: { fileSize: <span class="tok-num">5</span> * <span class="tok-num">1024</span> * <span class="tok-num">1024</span> } });
app.post(<span class="tok-str">'/limited'</span>, (req, res) =&gt; {
  up.single(<span class="tok-str">'file'</span>)(req, res, (err) =&gt; {
    <span class="tok-kw">if</span> (err) <span class="tok-kw">return</span> res.status(<span class="tok-num">413</span>).json({ name: err.name, code: err.code, message: err.message, field: err.field });
    res.json({ ok: <span class="tok-kw">true</span>, size: req.file.size });
  });
});</code></pre>
<div class="out">{"name":"MulterError","code":"LIMIT_FILE_SIZE","message":"File too large","field":"file"}
HTTP 413 | client đã gửi 7.183.298 byte</div>
<p>Việc từ chối có hiệu lực — và client vẫn upload đủ 7,18MB trước khi được nghe điều đó. Giới hạn kích thước bảo vệ <em>bộ nhớ và đĩa</em> của bạn, không bao giờ bảo vệ <em>băng thông</em>. Muốn từ chối sớm thì phải xem <code>Content-Length</code> trước khi đọc thân, mà ngay cả nó cũng chỉ là lời khai do client kiểm soát. Nửa còn lại của cùng bài học: <code>MulterError</code> được ném vào chuỗi middleware, nên nếu bạn viết <code>app.post('/u', upload.single('file'), handler)</code> mà không có error handler, một file quá cỡ sẽ thành lỗi 500 kèm stack trace thay vì 413.</p>

<div class="pitfall">
<p><strong>Năm cách xử lý upload đi sai trong code thật.</strong> (1) <code>multer()</code> không truyền tuỳ chọn gì dùng <code>memoryStorage</code> và <strong>không giới hạn kích thước</strong> — một lần upload 2GB kết liễu tiến trình. (2) Đọc <code>req.body.category</code> bên trong <code>fileFilter</code>: trường chữ có thể chưa được phân tích, nên nó là <code>undefined</code> — hãy quyết định bằng thứ nằm trong URL hoặc header. (3) Quên rằng <code>upload.array('files', 10)</code> nhân bộ nhớ của bạn lên mười. (4) <code>diskStorage</code> mà không dọn: mỗi request hỏng để lại một file tạm, và container không quét <code>/tmp</code> giùm bạn. (5) Đặt route upload sau một middleware đọc thân — <code>express.json()</code> không đụng multipart, nhưng một <code>express.raw()</code> toàn cục hay một logger đệm thân request sẽ lặng lẽ nhân đôi bộ nhớ.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> <code>src/routes/upload.routes.ts</code> dùng <code>multer({ storage: multer.memoryStorage(), limits: { fileSize: 160 * 1024 * 1024 } })</code> — chọn bộ nhớ có chủ đích, vì mọi ảnh đều đi thẳng vào sharp để mã hoá lại, và một file tạm chỉ là thêm một vòng ra đĩa. Trần 160MB là chốt chặn cứng nằm trên mức 150MB của video; giới hạn thật theo từng loại (<code>maxFileSizeImages</code>, <code>maxFileSizeAudio</code>, <code>maxFileSizeDocument</code>) nằm trong <code>uploadService</code> và sinh ra <code>UploadError</code> có kiểu với status 413 thay vì một stack trace của Multer. Video thì không đi đường này chút nào: chúng được đẩy thẳng lên R2 bằng URL ký sẵn, vì cả những con số bộ nhớ ở trên <em>lẫn</em> trần 100MB cho thân request của Cloudflare đều khiến một lần upload multipart 150MB là bất khả thi.</p>
</div>

<h3>Đọng lại gì</h3>
<p>Chọn cách nhận file là một quyết định về bộ nhớ, khoác áo một quyết định về API. Base64 tiện nhất và đắt nhất; <code>memoryStorage</code> là mặc định đúng cho mọi thứ mà đằng nào bạn cũng phải xử lý; stream là bắt buộc khi file to lên; và lần upload rẻ nhất là lần mà máy chủ của bạn không hề nhìn thấy — đó là chủ đề bài kế tiếp.</p>

<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-963" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 963 — Uploading &amp; Downloading Objects</span><span class="lc-sub">10 bài tập: đưa file vào storage bằng buffer và bằng stream.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Express.js Core Concepts</span><span class="lc-sub">10 bài tập: middleware, body parser, và vòng đời một request.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Object storage and presigned URLs|||10.2 — Object storage và URL ký sẵn',
      slug: 'nodejs-10-2-object-storage-presigned',
      type: 'VIDEO',
      description: 'S3/R2 nhìn từ trong ra: bucket, key, metadata; URL ký sẵn mổ xẻ từng tham số; và ba phát hiện đo được — Content-Type KHÔNG bị ký, kích thước KHÔNG bị ràng buộc, key bị sửa thì chữ ký gãy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Object storage and presigned URLs</h2>
<p class="lead">Storing uploads on the server's disk works until the first time you run two containers, or redeploy, or fill the volume. Object storage solves that by being a different thing from a filesystem — flat, HTTP-native, and addressable from the browser. This lesson takes the S3 API apart against a real S3-compatible server (MinIO in Docker, the same protocol Cloudflare R2 speaks), and then measures what a presigned URL does and does <em>not</em> guarantee. Two of those measurements are the kind you only find out about in an incident.</p>

<h3>It is not a filesystem, and that matters</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Bucket</span><span class="lz-d">the container. One per project is normal; it has a region, a policy, and a bill</span></div>
  <div class="lz-node"><span class="lz-t">Key</span><span class="lz-d">the full name of the object: <code>images/post/u7/1753660000000-a1b2c3d4e5f6.jpg</code>. The slashes are <strong>part of the name</strong> — there are no directories, only a prefix you can list by</span></div>
  <div class="lz-node"><span class="lz-t">Object</span><span class="lz-d">bytes + metadata. Immutable in practice: you replace it, you do not edit it in place</span></div>
  <div class="lz-node"><span class="lz-t">Metadata</span><span class="lz-d"><code>Content-Type</code>, <code>Cache-Control</code>, <code>ETag</code> — stored WITH the object and served back as HTTP headers. This is why lesson 10.4 is about setting them correctly at upload time</span></div>
</div>
<p>Two consequences follow immediately. There is no <code>mv</code>: renaming means copy + delete, and copying a 120MB object costs a server-side copy. And there is no "list the folder cheaply": <code>ListObjectsV2</code> with a prefix scans keys, so a bucket layout that requires listing to find things is a design you will pay for monthly.</p>

<h3>Measurement 1 — the whole API surface you actually use</h3>
<p>Against MinIO on localhost, with a 6,85MB photo:</p>
<pre><code><span class="tok-kw">const</span> s3 = <span class="tok-kw">new</span> S3Client({
  region: <span class="tok-str">'auto'</span>,
  endpoint: <span class="tok-str">'http://127.0.0.1:9010'</span>,          <span class="tok-cmt">// R2: https://&lt;account&gt;.r2.cloudflarestorage.com</span>
  credentials: { accessKeyId: <span class="tok-str">'…'</span>, secretAccessKey: <span class="tok-str">'…'</span> },
  forcePathStyle: <span class="tok-kw">true</span>,
});
<span class="tok-kw">await</span> s3.send(<span class="tok-kw">new</span> PutObjectCommand({
  Bucket, Key: <span class="tok-str">'images/post/u7/1753660000000-a1b2c3d4e5f6.jpg'</span>,
  Body: photo, ContentType: <span class="tok-str">'image/jpeg'</span>,
  CacheControl: <span class="tok-str">'public, max-age=31536000, immutable'</span>,
}));</code></pre>
<div class="out">PutObject 6,85MB : 49,3ms   ETag="dafc208ac8bd3c10c0ab5159286ea69f"
HeadObject       :  3,9ms   {"size":7183099,"type":"image/jpeg",
                             "cache":"public, max-age=31536000, immutable"}
GetObject        : 14,1ms   7.183.099 byte, giống hệt bản gốc: true
GET Range 0-15   :  3,7ms   16 byte, hex=ffd8ffdb004300030202020202030202
HEAD key không có → NotFound | HTTP 404
List prefix "images/"          → 1 object
List prefix "images/post/u7/"  → 1 object</div>
<p>Four things to bank from that block. <strong><code>HeadObject</code> is cheap (3,9ms) and returns size + content type without transferring the body</strong> — it is how you verify an upload landed. <strong>Range requests work</strong>, and 16 bytes came back in 3,7ms: that is how a thumbnail extractor reads a video's header without downloading 120MB. The ETag is the MD5 of the content for single-part uploads — useful as a cheap integrity check. And a missing key raises <code>NotFound</code> with HTTP 404, not an empty result, so <code>try/catch</code> is mandatory around <code>HeadObject</code>.</p>

<h3>Key layout is a design decision, not a filename</h3>
<p>The key is the only index this system gives you. This project's rule, from <code>src/storage/keys.ts</code>:</p>
<pre><code><span class="tok-cmt">// images/post/u7/1753660000000-a1b2c3d4e5f6.jpg</span>
<span class="tok-cmt">//   │      │    │        │             └── 6 byte ngẫu nhiên (crypto)</span>
<span class="tok-cmt">//   │      │    │        └── Date.now()</span>
<span class="tok-cmt">//   │      │    └── u&lt;userId&gt; — chủ sở hữu, kiểm được sau này</span>
<span class="tok-cmt">//   │      └── loại nội dung</span>
<span class="tok-cmt">//   └── họ (images | audio | video | documents)</span>
<span class="tok-kw">const</span> filename = <span class="tok-str">&#96;\${Date.now()}-\${randomBytes(6).toString('hex')}\${ext}&#96;</span>;</code></pre>
<p>Every element earns its place. The family prefix makes lifecycle rules and cost reports possible. The <code>u&lt;id&gt;</code> segment turns ownership into something you can check without a database round trip — <code>keyBelongsToUser()</code> is a regex on the key. The timestamp makes keys sort chronologically. And the random suffix does two jobs: it prevents collisions when two users upload <code>IMG_0001.jpg</code> in the same millisecond, and it makes the key <strong>unguessable</strong>, which is the entire security model of a public bucket. Notice what is <em>not</em> in there: the original filename. That is deliberate — user filenames carry <code>../</code>, emoji, 300-character names, and occasionally the name of the person who sent it.</p>

<h3>Measurement 2 — anatomy of a presigned URL</h3>
<p>A presigned URL is a normal S3 request that has been signed in advance, with the signature moved into the query string. Anyone holding the URL can perform exactly that one operation, until it expires. Generated with <code>getSignedUrl(s3, new PutObjectCommand({…}), { expiresIn: 3600 })</code>:</p>
<div class="out">độ dài URL     : 438 ký tự
đường dẫn      : /ct-lab/video/u7/1753660001234-deadbeef1234.mp4
  X-Amz-Algorithm        AWS4-HMAC-SHA256
  X-Amz-Credential       labkey/20260727/auto/s3/aws4_request
  X-Amz-Date             20260727T181933Z
  X-Amz-Expires          3600
  X-Amz-SignedHeaders    host
  X-Amz-Signature        41e5936343ce772fa35d591d5e43a31fa61dfb632f634d4ccc7ea5de774d5336
  X-Amz-Content-Sha256   UNSIGNED-PAYLOAD
  x-id                   PutObject</div>
<p>Read <code>X-Amz-SignedHeaders: host</code> and remember it — it is about to be the most expensive line in this lesson. It says: <em>the only header covered by this signature is</em> <code>host</code>. And <code>X-Amz-Content-Sha256: UNSIGNED-PAYLOAD</code> says the body is not covered either, which is what makes streaming a 120MB upload possible at all.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">1. Client asks your API</span><span class="lz-d">"I want to upload video.mp4, 118MB". Your server authenticates the user, builds the key, signs a PUT and returns the URL — a few hundred bytes, no file touched</span></div>
  <div class="lz-step"><span class="lz-t">2. Browser PUTs to storage</span><span class="lz-d">straight to R2. Your server sees none of it: no RAM, no bandwidth, no Cloudflare 100MB body cap</span></div>
  <div class="lz-step"><span class="lz-t">3. Client tells your API "done"</span><span class="lz-d">your server calls <code>HeadObject</code> to verify the object exists and how big it really is, then writes the database row</span></div>
</div>

<h3>Measurement 3 — it really does bypass your server</h3>
<div class="out">PUT thẳng 120MB → HTTP 200, 125.829.120 byte gửi lên, 501ms
HEAD từ server  → size=125829120 type=video/mp4
URL đó dùng ở máy khác, không có credential nào → HTTP 206 (vẫn tải được)</div>
<p>The last line is the point of the mechanism and its risk in one sentence: <strong>the URL <em>is</em> the credential</strong>. Paste it in a chat and you have shared the object with everyone in that chat, for as long as the expiry lasts.</p>

<h3>Measurement 4 — Content-Type is NOT bound by default</h3>
<p>The server signs a PUT for a video, specifying <code>ContentType: 'video/mp4'</code>. The client then uses that URL but sends a different header:</p>
<pre><code><span class="tok-cmt">// máy chủ ký:</span>
getSignedUrl(s3, <span class="tok-kw">new</span> PutObjectCommand({ Bucket, Key, ContentType: <span class="tok-str">'video/mp4'</span> }), { expiresIn: <span class="tok-num">600</span> });
<span class="tok-cmt">// client dùng đúng URL đó nhưng gửi header khác:</span>
<span class="tok-cmt">// curl -X PUT -H 'Content-Type: text/html' --data-binary '&lt;script&gt;alert(document.cookie)&lt;/script&gt;'</span></code></pre>
<div class="out">SignedHeaders = host
  → client PUT text/html THÀNH CÔNG. Object lưu: {"type":"text/html","size":39}</div>
<p>Thirty-nine bytes of HTML, stored under a <code>.mp4</code> key, with <code>Content-Type: text/html</code>, on your media domain. Serve that domain to a browser and you have stored XSS — the exact attack chapter 9 spent a lesson on, arriving through the upload door. The <code>ContentType</code> you passed to <code>PutObjectCommand</code> was a <em>default</em>, not a constraint, because it was not in <code>SignedHeaders</code>.</p>
<p>The fix is one option:</p>
<pre><code>getSignedUrl(s3, <span class="tok-kw">new</span> PutObjectCommand({ Bucket, Key, ContentType: <span class="tok-str">'video/mp4'</span> }), {
  expiresIn: <span class="tok-num">600</span>,
  signableHeaders: <span class="tok-kw">new</span> Set([<span class="tok-str">'content-type'</span>]),   <span class="tok-cmt">// ← đưa header vào chữ ký</span>
});</code></pre>
<div class="out">SignedHeaders = content-type;host
  PUT text/html → 403 | PUT video/mp4 → 200
  Object lưu: {"type":"video/mp4"}</div>

<h3>Measurement 5 — size is not bound either</h3>
<p>Your API validated that the client declared 5MB before signing. The client then PUTs 120MB to the same URL:</p>
<div class="out">Client khai "5MB" lúc xin ký, thực tế PUT: 125.829.120 byte → storage vẫn nhận</div>
<p>A presigned PUT carries no size ceiling. The declared size was input to <em>your</em> validation, not to the signature. There are exactly two defences, and you want both: use a <strong>presigned POST policy</strong> (which supports a <code>content-length-range</code> condition) instead of a presigned PUT, or verify with <code>HeadObject</code> after the fact and delete + reject anything oversized. The second is what this project does.</p>

<h3>Measurement 6 — what the signature does protect</h3>
<p>Two attacks that fail, so you know where the boundary is. Editing the key inside a signed URL to point at someone else's path:</p>
<div class="out">&lt;Error&gt;&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
&lt;Message&gt;The request signature we calculated does not match the signature you provided.&lt;/Message&gt;
&lt;Key&gt;video/u1/anh-cua-nguoi-khac.mp4&lt;/Key&gt;&lt;/Error&gt;</div>
<p>And using a URL after its expiry — signed with <code>expiresIn: 5</code>, used immediately and then again seven seconds later:</p>
<div class="out">ngay lập tức  → HTTP 206
sau 7 giây    → HTTP 403
&lt;Error&gt;&lt;Code&gt;AccessDenied&lt;/Code&gt;&lt;Message&gt;Request has expired&lt;/Message&gt;&lt;/Error&gt;</div>
<p>So the signature covers the method, the key, the bucket and the deadline. It does not cover the body, the size, or any header you did not explicitly sign. That is the mental model to keep.</p>

<h3>Measurement 7 — streaming through the server, when you must</h3>
<p>Sometimes you cannot presign (you need to inspect the bytes, or the client cannot do a second request). Then stream: <code>busboy</code> gives you the file part as a stream, and <code>@aws-sdk/lib-storage</code>'s <code>Upload</code> consumes a stream by cutting it into multipart parts:</p>
<pre><code>bb.on(<span class="tok-str">'file'</span>, <span class="tok-kw">async</span> (_name, file) =&gt; {
  <span class="tok-kw">const</span> uploader = <span class="tok-kw">new</span> Upload({
    client: s3,
    params: { Bucket, Key, Body: file, ContentType: <span class="tok-str">'video/mp4'</span> },
    queueSize: <span class="tok-num">4</span>, partSize: <span class="tok-num">8</span> * <span class="tok-num">1024</span> * <span class="tok-num">1024</span>,
  });
  <span class="tok-kw">await</span> uploader.done();
});</code></pre>
<div class="out">120MB, đệm hết vào RAM rồi PutObject : 711ms, RSS +245,5MB
120MB, stream qua lib-storage        : 583ms, RSS  +94,8MB, 15 phần</div>
<p>Same result in storage, 2,6× less memory, and slightly faster because the first parts start uploading while the last bytes are still arriving. The 15 parts come from 120MB ÷ 8MB; <code>queueSize: 4</code> means four parts in flight at once.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Both paths exist, split by size. Images, audio and documents go through the normal multipart route and are put with <code>PutObjectCommand</code>. Videos use the presigned path in <code>src/routes/upload.routes.ts</code>: <code>POST /upload/presign-r2</code> authenticates, refuses anything whose declared <code>contentType</code> is not <code>video/*</code>, builds the key with <code>buildKey('video', filename, { userId })</code> and signs a one-hour PUT. Then <code>POST /upload/presign-r2/complete</code> does exactly what measurement 5 says you must: it validates the key against <code>/^video\\/[\\w./-]+$/</code>, refuses any key containing <code>..</code>, calls <code>headObject(key)</code> and 404s if the object is not there, then <strong>re-checks the real size against <code>maxFileSizeVideo</code></strong> — "guard against a client uploading more than it declared at presign", says the comment, which is this lesson written a year earlier. It also writes a <code>PendingUpload</code> row with a 24-hour TTL so a nightly cron can delete objects from posts that were never finished. The bucket needs a CORS rule allowing <code>PUT</code> from the site origin, which is the one piece of configuration that lives outside the code.</p>
</div>

<div class="pitfall">
<p><strong>Six ways presigned uploads fail in the wild.</strong> (1) <strong>No CORS rule on the bucket</strong> — the browser's preflight fails and you see an opaque "Network Error" with a 200 in the storage logs; curl works, the browser does not. (2) Expiry too long: a one-week URL in a chat message is a one-week public file. (3) Expiry too short for a slow mobile uplink — the signature is checked when the request <em>starts</em>, but a 15-minute URL and a 20-minute upload is still a race worth avoiding. (4) Clock skew: a server whose time is 20 minutes off signs URLs that are already expired; the error is the same <code>AccessDenied</code>. (5) Trusting the "complete" call — if you do not <code>HeadObject</code>, a client can skip the upload entirely and still get a database row pointing at nothing. (6) Signing with a key that has write access to the whole bucket when the operation needed one prefix; R2 and S3 both support scoped tokens.</p>
</div>

<h3>What to take away</h3>
<p>Object storage gives you a URL-addressable, effectively infinite disk with metadata attached to every object, and presigned URLs let you hand out one narrow permission without giving away a credential. Just be precise about how narrow: the method, the key and the deadline are signed; the body, the size, and every header you did not name are not.</p>

<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-964" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 964 — Presigned URLs</span><span class="lc-sub">10 bài tập: ký URL, đặt hạn, và giới hạn quyền cho đúng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-966" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 966 — Cloudflare R2 Specifics</span><span class="lc-sub">10 bài tập: R2 khác S3 chỗ nào, custom domain, và chi phí egress.</span></span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Object storage và URL ký sẵn</h2>
<p class="lead">Cất file lên đĩa của máy chủ chạy ngon cho tới lần đầu bạn chạy hai container, hoặc deploy lại, hoặc volume đầy. Object storage giải quyết chuyện đó bằng cách KHÔNG phải là một hệ thống file — nó phẳng, nói HTTP từ trong máu, và trình duyệt gọi thẳng được. Bài này mổ API S3 trên một máy chủ tương thích S3 thật (MinIO trong Docker, đúng giao thức mà Cloudflare R2 nói), rồi đo xem một URL ký sẵn bảo đảm gì và <em>không</em> bảo đảm gì. Hai trong số các phép đo đó là loại mà bình thường bạn chỉ biết khi đã có sự cố.</p>

<h3>Nó không phải hệ thống file, và điều đó quan trọng</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Bucket</span><span class="lz-d">cái thùng. Mỗi dự án một bucket là chuyện thường; nó có vùng, có chính sách, và có hoá đơn</span></div>
  <div class="lz-node"><span class="lz-t">Key</span><span class="lz-d">tên đầy đủ của object: <code>images/post/u7/1753660000000-a1b2c3d4e5f6.jpg</code>. Dấu gạch chéo là <strong>một phần của cái tên</strong> — không có thư mục, chỉ có tiền tố để liệt kê theo</span></div>
  <div class="lz-node"><span class="lz-t">Object</span><span class="lz-d">byte + metadata. Trên thực tế là bất biến: bạn thay thế nó, chứ không sửa tại chỗ</span></div>
  <div class="lz-node"><span class="lz-t">Metadata</span><span class="lz-d"><code>Content-Type</code>, <code>Cache-Control</code>, <code>ETag</code> — lưu KÈM object và được trả lại thành header HTTP. Đó là lý do bài 10.4 nói về việc đặt chúng cho đúng ngay lúc upload</span></div>
</div>
<p>Hai hệ quả tới ngay. Không có <code>mv</code>: đổi tên nghĩa là sao chép rồi xoá, và sao chép một object 120MB tốn một lần copy phía máy chủ. Và không có chuyện "liệt kê thư mục cho rẻ": <code>ListObjectsV2</code> với tiền tố là quét key, nên một cách bố trí bucket mà muốn tìm gì cũng phải liệt kê là một thiết kế bạn trả tiền hằng tháng.</p>

<h3>Phép đo 1 — toàn bộ bề mặt API bạn thực sự dùng</h3>
<p>Chạy trên MinIO ở localhost, với tấm ảnh 6,85MB:</p>
<pre><code><span class="tok-kw">const</span> s3 = <span class="tok-kw">new</span> S3Client({
  region: <span class="tok-str">'auto'</span>,
  endpoint: <span class="tok-str">'http://127.0.0.1:9010'</span>,          <span class="tok-cmt">// R2: https://&lt;account&gt;.r2.cloudflarestorage.com</span>
  credentials: { accessKeyId: <span class="tok-str">'…'</span>, secretAccessKey: <span class="tok-str">'…'</span> },
  forcePathStyle: <span class="tok-kw">true</span>,
});
<span class="tok-kw">await</span> s3.send(<span class="tok-kw">new</span> PutObjectCommand({
  Bucket, Key: <span class="tok-str">'images/post/u7/1753660000000-a1b2c3d4e5f6.jpg'</span>,
  Body: photo, ContentType: <span class="tok-str">'image/jpeg'</span>,
  CacheControl: <span class="tok-str">'public, max-age=31536000, immutable'</span>,
}));</code></pre>
<div class="out">PutObject 6,85MB : 49,3ms   ETag="dafc208ac8bd3c10c0ab5159286ea69f"
HeadObject       :  3,9ms   {"size":7183099,"type":"image/jpeg",
                             "cache":"public, max-age=31536000, immutable"}
GetObject        : 14,1ms   7.183.099 byte, giống hệt bản gốc: true
GET Range 0-15   :  3,7ms   16 byte, hex=ffd8ffdb004300030202020202030202
HEAD key không có → NotFound | HTTP 404
List prefix "images/"          → 1 object
List prefix "images/post/u7/"  → 1 object</div>
<p>Bốn thứ đáng bỏ túi từ khối đó. <strong><code>HeadObject</code> rẻ (3,9ms) và trả về kích thước + content type mà không chuyển thân</strong> — đó là cách bạn xác nhận một lần upload đã đáp đất. <strong>Request Range chạy được</strong>, và 16 byte về trong 3,7ms: đó là cách một bộ trích thumbnail đọc phần đầu của video mà không tải 120MB. ETag là MD5 của nội dung với các lần put một phần — một phép kiểm toàn vẹn rẻ tiền. Và một key không tồn tại ném <code>NotFound</code> kèm HTTP 404 chứ không trả kết quả rỗng, nên <code>try/catch</code> quanh <code>HeadObject</code> là bắt buộc.</p>

<h3>Bố trí key là một quyết định thiết kế, không phải một cái tên file</h3>
<p>Key là chỉ mục duy nhất mà hệ thống này cho bạn. Luật của dự án này, trong <code>src/storage/keys.ts</code>:</p>
<pre><code><span class="tok-cmt">// images/post/u7/1753660000000-a1b2c3d4e5f6.jpg</span>
<span class="tok-cmt">//   │      │    │        │             └── 6 byte ngẫu nhiên (crypto)</span>
<span class="tok-cmt">//   │      │    │        └── Date.now()</span>
<span class="tok-cmt">//   │      │    └── u&lt;userId&gt; — chủ sở hữu, kiểm được sau này</span>
<span class="tok-cmt">//   │      └── loại nội dung</span>
<span class="tok-cmt">//   └── họ (images | audio | video | documents)</span>
<span class="tok-kw">const</span> filename = <span class="tok-str">&#96;\${Date.now()}-\${randomBytes(6).toString('hex')}\${ext}&#96;</span>;</code></pre>
<p>Mỗi thành phần đều có lý do tồn tại. Tiền tố theo họ làm cho quy tắc vòng đời và báo cáo chi phí trở nên khả thi. Đoạn <code>u&lt;id&gt;</code> biến quyền sở hữu thành thứ kiểm được mà không cần hỏi cơ sở dữ liệu — <code>keyBelongsToUser()</code> chỉ là một regex trên key. Dấu thời gian làm key tự sắp theo thứ tự thời gian. Và hậu tố ngẫu nhiên làm hai việc: chống đụng độ khi hai người cùng upload <code>IMG_0001.jpg</code> trong cùng một mili giây, và làm key <strong>không đoán được</strong> — đó chính là toàn bộ mô hình bảo mật của một bucket công khai. Hãy để ý thứ KHÔNG có trong đó: tên file gốc. Cố ý đấy — tên file của người dùng mang theo <code>../</code>, emoji, tên dài 300 ký tự, và đôi khi là tên của người đã gửi nó.</p>

<h3>Phép đo 2 — giải phẫu một URL ký sẵn</h3>
<p>URL ký sẵn là một request S3 bình thường đã được ký trước, với chữ ký chuyển vào query string. Ai cầm URL cũng thực hiện được đúng một thao tác đó, cho tới khi hết hạn. Sinh bằng <code>getSignedUrl(s3, new PutObjectCommand({…}), { expiresIn: 3600 })</code>:</p>
<div class="out">độ dài URL     : 438 ký tự
đường dẫn      : /ct-lab/video/u7/1753660001234-deadbeef1234.mp4
  X-Amz-Algorithm        AWS4-HMAC-SHA256
  X-Amz-Credential       labkey/20260727/auto/s3/aws4_request
  X-Amz-Date             20260727T181933Z
  X-Amz-Expires          3600
  X-Amz-SignedHeaders    host
  X-Amz-Signature        41e5936343ce772fa35d591d5e43a31fa61dfb632f634d4ccc7ea5de774d5336
  X-Amz-Content-Sha256   UNSIGNED-PAYLOAD
  x-id                   PutObject</div>
<p>Hãy đọc dòng <code>X-Amz-SignedHeaders: host</code> và nhớ lấy — nó sắp trở thành dòng đắt nhất của bài này. Nó nói: <em>header duy nhất được chữ ký này phủ là</em> <code>host</code>. Còn <code>X-Amz-Content-Sha256: UNSIGNED-PAYLOAD</code> nói phần thân cũng không được phủ, và chính điều đó mới cho phép stream một file 120MB lên.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">1. Client hỏi API của bạn</span><span class="lz-d">"tôi muốn upload video.mp4, 118MB". Máy chủ xác thực người dùng, dựng key, ký một PUT và trả về URL — vài trăm byte, không đụng vào file</span></div>
  <div class="lz-step"><span class="lz-t">2. Trình duyệt PUT thẳng lên storage</span><span class="lz-d">thẳng lên R2. Máy chủ của bạn không thấy gì hết: không RAM, không băng thông, không dính trần 100MB thân request của Cloudflare</span></div>
  <div class="lz-step"><span class="lz-t">3. Client báo API "xong rồi"</span><span class="lz-d">máy chủ gọi <code>HeadObject</code> để xác nhận object có thật và thật sự nặng bao nhiêu, rồi mới ghi dòng vào cơ sở dữ liệu</span></div>
</div>

<h3>Phép đo 3 — nó thật sự đi vòng qua máy chủ của bạn</h3>
<div class="out">PUT thẳng 120MB → HTTP 200, 125.829.120 byte gửi lên, 501ms
HEAD từ server  → size=125829120 type=video/mp4
URL đó dùng ở máy khác, không có credential nào → HTTP 206 (vẫn tải được)</div>
<p>Dòng cuối gói cả cơ chế lẫn rủi ro của nó trong một câu: <strong>URL CHÍNH LÀ thông tin xác thực</strong>. Dán nó vào một đoạn chat là bạn đã chia sẻ object đó cho tất cả những ai trong đoạn chat, suốt thời hạn còn lại.</p>

<h3>Phép đo 4 — Content-Type KHÔNG bị ràng buộc theo mặc định</h3>
<p>Máy chủ ký một PUT cho video, có nêu <code>ContentType: 'video/mp4'</code>. Client sau đó dùng đúng URL ấy nhưng gửi header khác:</p>
<pre><code><span class="tok-cmt">// máy chủ ký:</span>
getSignedUrl(s3, <span class="tok-kw">new</span> PutObjectCommand({ Bucket, Key, ContentType: <span class="tok-str">'video/mp4'</span> }), { expiresIn: <span class="tok-num">600</span> });
<span class="tok-cmt">// client dùng đúng URL đó nhưng gửi header khác:</span>
<span class="tok-cmt">// curl -X PUT -H 'Content-Type: text/html' --data-binary '&lt;script&gt;alert(document.cookie)&lt;/script&gt;'</span></code></pre>
<div class="out">SignedHeaders = host
  → client PUT text/html THÀNH CÔNG. Object lưu: {"type":"text/html","size":39}</div>
<p>Ba mươi chín byte HTML, nằm dưới một key <code>.mp4</code>, với <code>Content-Type: text/html</code>, trên tên miền media của bạn. Phục vụ tên miền đó cho một trình duyệt là bạn có XSS lưu trữ — đúng đòn tấn công mà chương 9 dành hẳn một bài, lần này đi vào bằng cửa upload. Cái <code>ContentType</code> bạn truyền cho <code>PutObjectCommand</code> chỉ là <em>giá trị mặc định</em>, không phải ràng buộc, vì nó không nằm trong <code>SignedHeaders</code>.</p>
<p>Cách sửa gọn trong một tuỳ chọn:</p>
<pre><code>getSignedUrl(s3, <span class="tok-kw">new</span> PutObjectCommand({ Bucket, Key, ContentType: <span class="tok-str">'video/mp4'</span> }), {
  expiresIn: <span class="tok-num">600</span>,
  signableHeaders: <span class="tok-kw">new</span> Set([<span class="tok-str">'content-type'</span>]),   <span class="tok-cmt">// ← đưa header vào chữ ký</span>
});</code></pre>
<div class="out">SignedHeaders = content-type;host
  PUT text/html → 403 | PUT video/mp4 → 200
  Object lưu: {"type":"video/mp4"}</div>

<h3>Phép đo 5 — kích thước cũng không bị ràng buộc</h3>
<p>API của bạn đã kiểm rằng client khai 5MB trước khi ký. Client sau đó PUT 120MB vào đúng URL ấy:</p>
<div class="out">Client khai "5MB" lúc xin ký, thực tế PUT: 125.829.120 byte → storage vẫn nhận</div>
<p>Một PUT ký sẵn không mang theo trần kích thước nào. Con số khai báo là đầu vào cho phần kiểm của <em>bạn</em>, không phải đầu vào của chữ ký. Có đúng hai lớp phòng thủ, và bạn nên có cả hai: dùng <strong>presigned POST policy</strong> (hỗ trợ điều kiện <code>content-length-range</code>) thay cho presigned PUT, hoặc kiểm bằng <code>HeadObject</code> sau đó và xoá + từ chối mọi thứ quá cỡ. Cách thứ hai là cách dự án này đang làm.</p>

<h3>Phép đo 6 — vậy chữ ký bảo vệ cái gì</h3>
<p>Hai đòn tấn công thất bại, để bạn biết ranh giới nằm ở đâu. Sửa key bên trong URL đã ký để trỏ sang đường dẫn của người khác:</p>
<div class="out">&lt;Error&gt;&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;
&lt;Message&gt;The request signature we calculated does not match the signature you provided.&lt;/Message&gt;
&lt;Key&gt;video/u1/anh-cua-nguoi-khac.mp4&lt;/Key&gt;&lt;/Error&gt;</div>
<p>Và dùng một URL sau khi hết hạn — ký với <code>expiresIn: 5</code>, dùng ngay lập tức rồi dùng lại sau bảy giây:</p>
<div class="out">ngay lập tức  → HTTP 206
sau 7 giây    → HTTP 403
&lt;Error&gt;&lt;Code&gt;AccessDenied&lt;/Code&gt;&lt;Message&gt;Request has expired&lt;/Message&gt;&lt;/Error&gt;</div>
<p>Vậy chữ ký phủ phương thức, key, bucket và hạn chót. Nó KHÔNG phủ phần thân, kích thước, hay bất kỳ header nào bạn không ký tường minh. Đó là mô hình tư duy cần giữ.</p>

<h3>Phép đo 7 — stream xuyên qua máy chủ, khi buộc phải thế</h3>
<p>Đôi khi bạn không ký sẵn được (cần soi byte, hoặc client không gọi được request thứ hai). Khi đó hãy stream: <code>busboy</code> đưa phần file cho bạn dưới dạng stream, còn <code>Upload</code> của <code>@aws-sdk/lib-storage</code> tiêu thụ stream bằng cách cắt nó thành các phần multipart:</p>
<pre><code>bb.on(<span class="tok-str">'file'</span>, <span class="tok-kw">async</span> (_name, file) =&gt; {
  <span class="tok-kw">const</span> uploader = <span class="tok-kw">new</span> Upload({
    client: s3,
    params: { Bucket, Key, Body: file, ContentType: <span class="tok-str">'video/mp4'</span> },
    queueSize: <span class="tok-num">4</span>, partSize: <span class="tok-num">8</span> * <span class="tok-num">1024</span> * <span class="tok-num">1024</span>,
  });
  <span class="tok-kw">await</span> uploader.done();
});</code></pre>
<div class="out">120MB, đệm hết vào RAM rồi PutObject : 711ms, RSS +245,5MB
120MB, stream qua lib-storage        : 583ms, RSS  +94,8MB, 15 phần</div>
<p>Kết quả trong storage y hệt, bộ nhớ ít hơn 2,6 lần, và còn nhanh hơn chút vì các phần đầu đã bắt đầu đi lên trong khi những byte cuối còn đang tới. Con số 15 phần đến từ 120MB ÷ 8MB; <code>queueSize: 4</code> nghĩa là bốn phần bay cùng lúc.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Cả hai đường đều tồn tại, chia theo kích thước. Ảnh, âm thanh và tài liệu đi đường multipart bình thường rồi được put bằng <code>PutObjectCommand</code>. Video đi đường ký sẵn trong <code>src/routes/upload.routes.ts</code>: <code>POST /upload/presign-r2</code> xác thực, từ chối mọi thứ có <code>contentType</code> khai không phải <code>video/*</code>, dựng key bằng <code>buildKey('video', filename, { userId })</code> rồi ký một PUT hạn một giờ. Sau đó <code>POST /upload/presign-r2/complete</code> làm đúng điều mà phép đo 5 nói là bắt buộc: kiểm key theo <code>/^video\\/[\\w./-]+$/</code>, từ chối mọi key chứa <code>..</code>, gọi <code>headObject(key)</code> và trả 404 nếu object không có, rồi <strong>kiểm lại kích thước THẬT với <code>maxFileSizeVideo</code></strong> — "chặn trường hợp client upload nhiều hơn mức đã khai lúc xin ký", comment trong code viết vậy, tức là chính bài học này được viết trước đó một năm. Nó còn ghi một dòng <code>PendingUpload</code> hạn 24 giờ để một cron chạy đêm xoá được các object của những bài đăng không bao giờ hoàn tất. Bucket cần một quy tắc CORS cho phép <code>PUT</code> từ origin của site — đó là mảnh cấu hình duy nhất nằm ngoài code.</p>
</div>

<div class="pitfall">
<p><strong>Sáu cách upload ký sẵn chết ngoài đời thật.</strong> (1) <strong>Bucket không có quy tắc CORS</strong> — preflight của trình duyệt hỏng và bạn thấy một "Network Error" mù mờ trong khi log storage vẫn 200; curl chạy, trình duyệt thì không. (2) Hạn quá dài: một URL hạn một tuần nằm trong tin nhắn là một file công khai suốt một tuần. (3) Hạn quá ngắn cho đường lên di động chậm — chữ ký được kiểm lúc request <em>bắt đầu</em>, nhưng URL 15 phút với lần upload 20 phút vẫn là cuộc đua nên tránh. (4) Lệch đồng hồ: một máy chủ sai giờ 20 phút sẽ ký ra những URL đã hết hạn sẵn; lỗi báo về vẫn là <code>AccessDenied</code>. (5) Tin lời gọi "hoàn tất" — nếu bạn không <code>HeadObject</code>, client có thể bỏ qua hẳn bước upload mà vẫn có một dòng trong cơ sở dữ liệu trỏ vào hư không. (6) Ký bằng một khoá có quyền ghi cả bucket trong khi thao tác chỉ cần một tiền tố; cả R2 lẫn S3 đều hỗ trợ token giới hạn phạm vi.</p>
</div>

<h3>Đọng lại gì</h3>
<p>Object storage cho bạn một cái đĩa gần như vô hạn, địa chỉ hoá bằng URL, có metadata gắn kèm từng object; còn URL ký sẵn cho phép bạn phát ra đúng một quyền hẹp mà không phải đưa credential. Chỉ cần chính xác về mức độ "hẹp": phương thức, key và hạn chót là được ký; phần thân, kích thước, và mọi header bạn không nêu tên thì không.</p>

<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-964" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 964 — Presigned URLs</span><span class="lc-sub">10 bài tập: ký URL, đặt hạn, và giới hạn quyền cho đúng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-966" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 966 — Cloudflare R2 Specifics</span><span class="lc-sub">10 bài tập: R2 khác S3 chỗ nào, custom domain, và chi phí egress.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Never trust the file: sniffing, polyglots and bombs|||10.3 — Đừng tin file người dùng: magic bytes, file lai và bom giải nén',
      slug: 'nodejs-10-3-kiem-file-that',
      type: 'VIDEO',
      description: 'Ba lời khai của client đều giả được; magic bytes bắt được phần lớn nhưng không bắt được file lai; một PNG 758KB tiêu 445MB RAM của máy chủ; và vì sao mã hoá lại mới là phép kiểm thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Never trust the file: sniffing, polyglots and bombs</h2>
<p class="lead">An upload endpoint accepts arbitrary bytes from anyone with an account, stores them on infrastructure you pay for, and then serves them back to other people's browsers. That sentence contains three separate attack surfaces. This lesson works through them with real files: a PHP shell renamed to <code>.png</code>, an image that is also HTML, a 758KB PNG that costs the server 445MB of RAM, and a holiday photo that quietly ships the GPS coordinates of the photographer's house.</p>

<h3>The three things the client tells you, and why all three are lies</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">filename</span><span class="lz-d">a plain string in the multipart headers. Can contain <code>../</code>, a null byte, 300 characters, or <code>shell.php.png</code></span></div>
  <div class="lz-node"><span class="lz-t">extension</span><span class="lz-d">just the tail of that same string. Proves nothing about content — it is a naming convention, not a format</span></div>
  <div class="lz-node"><span class="lz-t">Content-Type</span><span class="lz-d">also supplied by the client, per part. curl will send whatever you ask it to; so will 40 lines of Python</span></div>
</div>

<h3>Measurement 1 — five files through three checks</h3>
<p>Extension allow-list, MIME allow-list, and magic-byte sniffing with <code>file-type</code>. Every file below claims to be an image:</p>
<div class="out">tên file                 đuôi   mime client      magic bytes    kết luận
shell.php → shell.png    PASS   PASS             KHÔNG NHẬN RA  CHẶN (magic bytes)
trang.html → anh.jpg     PASS   PASS             KHÔNG NHẬN RA  CHẶN (magic bytes)
GIF+HTML polyglot        PASS   PASS             image/gif      lọt qua sniff!
SVG có onload            PASS   PASS             KHÔNG NHẬN RA  CHẶN (magic bytes)
ảnh JPEG thật            PASS   PASS             image/jpeg     CHO QUA

16 byte đầu (hex):
  shell.php → shell.png   3c3f7068702073797374656d28245f47   ← "&lt;?php system($_G"
  trang.html → anh.jpg    3c68746d6c3e3c7363726970743e6665   ← "&lt;html&gt;&lt;script&gt;fe"
  GIF+HTML polyglot       4749463839612f2a2a2f3d313b3c7363   ← "GIF89a/**/=1;&lt;sc"
  SVG có onload           3c73766720786d6c6e733d2268747470   ← "&lt;svg xmlns=\\"http"
  ảnh JPEG thật           ffd8ffdb004300030202020202030202   ← JPEG SOI marker</div>
<p>The extension check and the MIME check let <strong>all five</strong> through — including a PHP shell — because both are strings the attacker wrote. Sniffing the first bytes catches four of the five. It is a real improvement and you should do it. But look at row three.</p>

<h3>Measurement 2 — the polyglot, and why sniffing is not enough</h3>
<p>A file that starts with the six bytes <code>GIF89a</code> and continues with HTML is, as far as any sniffer is concerned, a GIF:</p>
<pre><code><span class="tok-kw">const</span> polyglot = Buffer.concat([
  Buffer.from(<span class="tok-str">'GIF89a'</span>),                              <span class="tok-cmt">// magic bytes thật của GIF</span>
  Buffer.from(<span class="tok-str">'/**/=1;&lt;script&gt;alert(1)&lt;/script&gt;'</span>),  <span class="tok-cmt">// và cũng là JS/HTML hợp lệ</span>
]);
<span class="tok-kw">await</span> fileTypeFromBuffer(polyglot);  <span class="tok-cmt">// → { mime: 'image/gif' }</span></code></pre>
<p>If your allow-list contains <code>image/gif</code>, this passes. Now try to actually decode it as an image:</p>
<div class="out">file-type đọc  : image/gif
sharp NÉM     : Input buffer has corrupt header: gifload_buffer: Invalid frame data</div>
<p>There is the principle, and it is the single most useful idea in this lesson: <strong>the only reliable way to know a file is an image is to decode it as one</strong>. Sniffing reads six bytes; a decoder reads all of them and refuses what does not parse.</p>

<h3>Measurement 3 — a real photo carrying a payload</h3>
<p>Harder case. Take the genuine 6,85MB JPEG and append a script tag to the end. It still decodes perfectly — JPEG readers stop at the end-of-image marker and ignore trailing bytes:</p>
<div class="out">ảnh JPEG thật + đuôi HTML (7.183.139 byte)
  file-type đọc  : image/jpeg  → qua được mọi bộ lọc "magic bytes"
  chuỗi &lt;script&gt; còn trong file? true
  sau khi sharp re-encode: 570,4KB trong 218,4ms; còn chuỗi &lt;script&gt;? false</div>
<p>Storing that file unchanged puts an attacker-controlled HTML string on your media domain. Whether it ever executes depends on how it is served (<code>Content-Type</code>, <code>nosniff</code>, which domain) — but the whole point of defence in depth is not to depend on that. Re-encoding removes the question: sharp decodes the pixels and writes a new file, and nothing that was not a pixel survives the trip.</p>
<pre><code><span class="tok-cmt">// Đây là toàn bộ phép kiểm ảnh cần thiết — và nó cũng là bước tối ưu:</span>
<span class="tok-kw">const</span> out = <span class="tok-kw">await</span> sharp(buffer)
  .resize({ width: <span class="tok-num">1200</span>, withoutEnlargement: <span class="tok-kw">true</span> })
  .webp({ quality: <span class="tok-num">80</span> })
  .toBuffer();   <span class="tok-cmt">// ném nếu không giải mã được → 400, không phải 500</span></code></pre>

<h3>Measurement 4 — the decompression bomb</h3>
<p>Re-encoding solves the content problem and opens a resource problem. A PNG storing one flat colour compresses absurdly well, so a tiny file can describe an enormous image:</p>
<div class="out">Bom 1: PNG 758,0KB = 16000×16000 = 256 triệu điểm ảnh
  sharp MẶC ĐỊNH: xử lý XONG trong 208,1ms | RSS 88MB → 187MB (+99MB)

Bom 2: PNG 1183,1KB = 20000×20000 = 400 triệu điểm ảnh
  sharp MẶC ĐỊNH ném: Input image exceeds pixel limit</div>
<p>sharp does ship a guard — <code>limitInputPixels</code>, default <strong>268.402.689</strong> pixels (0x3FFF × 0x3FFF). Bomb 2 is over it and is refused. Bomb 1 sits just under it and is processed: 758KB on the wire, 99MB of RAM and 208ms of CPU on the server. Now send eight of them at once, which is one person with a script:</p>
<div class="out">8 file "bom" 758KB cùng lúc: xong trong 520,3ms | RSS 92MB → 537MB (+445MB)
  → 8 × 758KB = 5,9MB trên đường truyền, nhưng 445MB RAM + CPU trên máy chủ
so sánh: 8 ảnh THẬT 6,85MB cùng lúc: 452,5ms | RSS +17MB</div>
<p>Read those two lines together. Eight real photos — 54,8MB of upload — cost 17MB of memory, because sharp streams and downscales them. Eight bombs — 5,9MB of upload, one tenth the bandwidth — cost <strong>445MB, twenty-six times more</strong>. Nothing in your size limit, your MIME check or your magic-byte sniffing sees this coming. The defence is a pixel budget, chosen for your product rather than for the format:</p>
<pre><code>sharp(buffer, { limitInputPixels: <span class="tok-num">50e6</span> })   <span class="tok-cmt">// 50 triệu điểm ảnh ≈ 8000×6000, rộng hơn mọi máy ảnh phổ thông</span>
  .resize({ width: <span class="tok-num">1200</span> }).webp().toBuffer();</code></pre>
<div class="out">Bom 1 (256MP) với limitInputPixels: 50e6 → Input image exceeds pixel limit</div>
<p>And because sharp's work happens in libvips' own threads rather than on the event loop, a queue is the other half of the answer: bound how many images you process concurrently instead of letting request volume decide.</p>

<h3>Measurement 5 — what the photo tells about its owner</h3>
<p>A JPEG straight from a phone carries EXIF: camera model, timestamp, and often GPS coordinates accurate to a few metres. Uploading it unchanged republishes all of it:</p>
<div class="out">ảnh "từ điện thoại": 45.168 byte | có EXIF: true (256 byte)
  chuỗi "iPhone 15 Pro" còn trong file? true
sau khi sharp re-encode : 11.366 byte | có EXIF: false
  chuỗi "iPhone 15 Pro" còn không? false
nếu gọi withMetadata()  : 12.136 byte | có EXIF: true</div>
<p>sharp drops metadata by default, which is the safe default — the only way to keep EXIF is to ask for it with <code>withMetadata()</code>. Worth knowing in both directions: if your product needs orientation or copyright preserved, you must opt in, and then you are opting into the GPS as well, so strip selectively.</p>

<h3>Active content: the category that must never be stored as-is</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">HTML / XHTML</span><span class="lz-lnote">served from your media domain it is a page on your domain — phishing with your padlock, or session theft if that domain shares cookies</span></div>
  <div class="lz-layer"><span class="lz-lname">SVG</span><span class="lz-lnote">an image format that is XML and executes <code>&lt;script&gt;</code> and <code>onload</code>. Either sanitize it like HTML or refuse it</span></div>
  <div class="lz-layer"><span class="lz-lname">JS, XML, PHP, .htaccess</span><span class="lz-lnote">only dangerous if something executes them — but "nothing will ever execute this directory" is an assumption that outlives the person who made it</span></div>
</div>
<p>Notice the SVG in measurement 1 was blocked by sniffing only because <code>file-type</code> does not recognise SVG at all (it is text, not a binary format with magic bytes). Do not rely on that accident: refuse SVG explicitly, or run it through DOMPurify with an SVG profile.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Three layers, in order. First <code>assertSafeUploadType(mimetype, originalName, bucket)</code> in <code>src/storage/uploadService.ts</code> rejects active content by MIME <em>and</em> by extension — <code>DANGEROUS_MIME</code> covers <code>text/html</code>, <code>image/svg+xml</code>, <code>application/javascript</code> and friends, while <code>DANGEROUS_EXT</code> is <code>/\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i</code>, on purpose a second gate because the client controls the MIME. It then checks the declared family matches the bucket family, with a deliberate exception: an empty or <code>application/octet-stream</code> MIME (common from drag-drop and some mobile browsers) skips the family check rather than rejecting a real photo — the dangerous-extension gate already stopped the bad cases. Second, every image goes through <code>optimizeImage()</code>: sharp, max width 1200, re-encoded to WebP q80, which is simultaneously the format conversion, the payload strip and the "is this really an image" test — and a failure there is mapped to HTTP 400, not 500, because it is the user's file that is wrong. Third, the stored key is rebuilt with a <code>.webp</code> extension so the served <code>Content-Type</code> can never disagree with the bytes. The one honest gap: <code>limitInputPixels</code> is left at sharp's default, so bomb 1 above would still cost this server 99MB — a fix worth making.</p>
</div>

<div class="pitfall">
<p><strong>Six upload-validation mistakes that keep recurring.</strong> (1) Using the original filename in the storage path: <code>../../etc/cron.d/x</code> is a valid filename, and any path join that trusts it is a directory traversal. (2) Deny-lists instead of allow-lists — you will forget <code>.phtml</code>, <code>.mjs</code>, <code>.htaccess</code>. (3) Checking the extension <em>before</em> the last dot: <code>evil.php.png</code> ends in <code>.png</code> and starts with <code>evil.php</code>; only the last extension matters, and only for naming, never for trust. (4) Validating on upload but serving with a <code>Content-Type</code> derived from the client's original string — sniffing on the way in is pointless if you echo their MIME on the way out. (5) Accepting archives (zip, docx) and expanding them server-side: a zip bomb is the same lesson as measurement 4 with a different decompressor. (6) Treating <code>image/*</code> as safe because it is an image — the bomb, the polyglot and the EXIF are all images.</p>
</div>

<h3>What to take away</h3>
<p>Validation of uploads is not a string comparison; it is a decode. Sniff the magic bytes to fail fast and cheaply, then re-encode the file and store the output, never the input. Bound the work by pixels as well as by bytes. And refuse active content outright — an image endpoint has no reason to accept anything a browser would run.</p>

<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-968" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 968 — Access Control &amp; Security</span><span class="lc-sub">10 bài tập: quyền trên bucket, key không đoán được, và kiểm file.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/media-processing${REF}#module-973" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 973 — Image Processing with Sharp</span><span class="lc-sub">10 bài tập: giải mã, đổi kích thước, đổi định dạng, và giới hạn tài nguyên.</span></span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Đừng tin file người dùng: magic bytes, file lai và bom giải nén</h2>
<p class="lead">Một endpoint upload nhận byte tuỳ ý từ bất kỳ ai có tài khoản, cất chúng lên hạ tầng bạn trả tiền, rồi phục vụ lại cho trình duyệt của người khác. Câu vừa rồi chứa ba bề mặt tấn công riêng biệt. Bài này đi qua cả ba bằng file thật: một shell PHP đổi tên thành <code>.png</code>, một tấm ảnh đồng thời là HTML, một PNG 758KB tiêu 445MB RAM của máy chủ, và một tấm ảnh du lịch lặng lẽ mang theo toạ độ GPS nhà người chụp.</p>

<h3>Ba thứ client khai với bạn, và vì sao cả ba đều là lời khai</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">filename</span><span class="lz-d">một chuỗi chữ trong header multipart. Có thể chứa <code>../</code>, byte null, dài 300 ký tự, hoặc <code>shell.php.png</code></span></div>
  <div class="lz-node"><span class="lz-t">phần đuôi</span><span class="lz-d">chỉ là cái đuôi của đúng chuỗi đó. Không chứng minh gì về nội dung — nó là quy ước đặt tên, không phải định dạng</span></div>
  <div class="lz-node"><span class="lz-t">Content-Type</span><span class="lz-d">cũng do client cung cấp, cho từng phần. curl gửi gì cũng được; 40 dòng Python cũng vậy</span></div>
</div>

<h3>Phép đo 1 — năm file qua ba lớp kiểm</h3>
<p>Danh sách trắng theo đuôi, danh sách trắng theo MIME, và đọc magic bytes bằng <code>file-type</code>. Mọi file dưới đây đều tự nhận là ảnh:</p>
<div class="out">tên file                 đuôi   mime client      magic bytes    kết luận
shell.php → shell.png    PASS   PASS             KHÔNG NHẬN RA  CHẶN (magic bytes)
trang.html → anh.jpg     PASS   PASS             KHÔNG NHẬN RA  CHẶN (magic bytes)
GIF+HTML polyglot        PASS   PASS             image/gif      lọt qua sniff!
SVG có onload            PASS   PASS             KHÔNG NHẬN RA  CHẶN (magic bytes)
ảnh JPEG thật            PASS   PASS             image/jpeg     CHO QUA

16 byte đầu (hex):
  shell.php → shell.png   3c3f7068702073797374656d28245f47   ← "&lt;?php system($_G"
  trang.html → anh.jpg    3c68746d6c3e3c7363726970743e6665   ← "&lt;html&gt;&lt;script&gt;fe"
  GIF+HTML polyglot       4749463839612f2a2a2f3d313b3c7363   ← "GIF89a/**/=1;&lt;sc"
  SVG có onload           3c73766720786d6c6e733d2268747470   ← "&lt;svg xmlns=\\"http"
  ảnh JPEG thật           ffd8ffdb004300030202020202030202   ← dấu SOI của JPEG</div>
<p>Lớp kiểm đuôi và lớp kiểm MIME cho <strong>cả năm</strong> đi qua — kể cả một shell PHP — vì cả hai đều là chuỗi do kẻ tấn công tự viết. Đọc mấy byte đầu bắt được bốn trên năm. Đó là cải thiện thật và bạn nên làm. Nhưng hãy nhìn dòng thứ ba.</p>

<h3>Phép đo 2 — file lai, và vì sao đọc magic bytes vẫn chưa đủ</h3>
<p>Một file bắt đầu bằng sáu byte <code>GIF89a</code> rồi tiếp tục bằng HTML thì, dưới mắt mọi bộ dò, là một file GIF:</p>
<pre><code><span class="tok-kw">const</span> polyglot = Buffer.concat([
  Buffer.from(<span class="tok-str">'GIF89a'</span>),                              <span class="tok-cmt">// magic bytes thật của GIF</span>
  Buffer.from(<span class="tok-str">'/**/=1;&lt;script&gt;alert(1)&lt;/script&gt;'</span>),  <span class="tok-cmt">// và cũng là JS/HTML hợp lệ</span>
]);
<span class="tok-kw">await</span> fileTypeFromBuffer(polyglot);  <span class="tok-cmt">// → { mime: 'image/gif' }</span></code></pre>
<p>Nếu danh sách trắng của bạn có <code>image/gif</code> thì nó lọt. Giờ thử thật sự giải mã nó thành ảnh:</p>
<div class="out">file-type đọc  : image/gif
sharp NÉM     : Input buffer has corrupt header: gifload_buffer: Invalid frame data</div>
<p>Nguyên lý nằm ở đó, và đây là ý hữu ích nhất của cả bài: <strong>cách duy nhất đáng tin để biết một file là ảnh là giải mã nó thành ảnh</strong>. Bộ dò đọc sáu byte; bộ giải mã đọc toàn bộ và từ chối thứ không phân tích được.</p>

<h3>Phép đo 3 — một tấm ảnh thật mang theo payload</h3>
<p>Ca khó hơn. Lấy tấm JPEG 6,85MB thật rồi nối thêm một thẻ script vào cuối. Nó vẫn giải mã hoàn hảo — trình đọc JPEG dừng ở dấu kết thúc ảnh và bỏ qua phần byte thừa phía sau:</p>
<div class="out">ảnh JPEG thật + đuôi HTML (7.183.139 byte)
  file-type đọc  : image/jpeg  → qua được mọi bộ lọc "magic bytes"
  chuỗi &lt;script&gt; còn trong file? true
  sau khi sharp re-encode: 570,4KB trong 218,4ms; còn chuỗi &lt;script&gt;? false</div>
<p>Cất nguyên file đó là đặt một chuỗi HTML do kẻ tấn công điều khiển lên tên miền media của bạn. Nó có chạy hay không còn tuỳ cách phục vụ (<code>Content-Type</code>, <code>nosniff</code>, tên miền nào) — nhưng cả ý nghĩa của phòng thủ nhiều lớp là không phụ thuộc vào chuyện đó. Mã hoá lại xoá luôn câu hỏi: sharp giải mã điểm ảnh rồi ghi ra một file mới, và thứ gì không phải điểm ảnh thì không sống sót qua chuyến đi.</p>
<pre><code><span class="tok-cmt">// Đây là toàn bộ phép kiểm ảnh cần thiết — và nó cũng là bước tối ưu:</span>
<span class="tok-kw">const</span> out = <span class="tok-kw">await</span> sharp(buffer)
  .resize({ width: <span class="tok-num">1200</span>, withoutEnlargement: <span class="tok-kw">true</span> })
  .webp({ quality: <span class="tok-num">80</span> })
  .toBuffer();   <span class="tok-cmt">// ném nếu không giải mã được → 400, không phải 500</span></code></pre>

<h3>Phép đo 4 — bom giải nén</h3>
<p>Mã hoá lại giải quyết bài toán nội dung và mở ra bài toán tài nguyên. Một file PNG chứa một màu phẳng thì nén tốt đến mức vô lý, nên một file bé xíu mô tả được một tấm ảnh khổng lồ:</p>
<div class="out">Bom 1: PNG 758,0KB = 16000×16000 = 256 triệu điểm ảnh
  sharp MẶC ĐỊNH: xử lý XONG trong 208,1ms | RSS 88MB → 187MB (+99MB)

Bom 2: PNG 1183,1KB = 20000×20000 = 400 triệu điểm ảnh
  sharp MẶC ĐỊNH ném: Input image exceeds pixel limit</div>
<p>sharp có sẵn một chốt chặn — <code>limitInputPixels</code>, mặc định <strong>268.402.689</strong> điểm ảnh (0x3FFF × 0x3FFF). Bom 2 vượt ngưỡng nên bị từ chối. Bom 1 nằm ngay dưới ngưỡng nên được xử lý: 758KB trên đường truyền, đổi lấy 99MB RAM và 208ms CPU của máy chủ. Giờ gửi tám cái cùng lúc, tức là một người với một đoạn script:</p>
<div class="out">8 file "bom" 758KB cùng lúc: xong trong 520,3ms | RSS 92MB → 537MB (+445MB)
  → 8 × 758KB = 5,9MB trên đường truyền, nhưng 445MB RAM + CPU trên máy chủ
so sánh: 8 ảnh THẬT 6,85MB cùng lúc: 452,5ms | RSS +17MB</div>
<p>Hãy đọc hai dòng đó cạnh nhau. Tám tấm ảnh thật — 54,8MB upload — tốn 17MB bộ nhớ, vì sharp vừa stream vừa thu nhỏ. Tám quả bom — 5,9MB upload, tức một phần mười băng thông — tốn <strong>445MB, gấp hai mươi sáu lần</strong>. Không có gì trong giới hạn kích thước, lớp kiểm MIME hay việc đọc magic bytes nhìn thấy chuyện này tới. Lớp phòng thủ là một hạn mức điểm ảnh, chọn theo sản phẩm của bạn chứ không theo định dạng:</p>
<pre><code>sharp(buffer, { limitInputPixels: <span class="tok-num">50e6</span> })   <span class="tok-cmt">// 50 triệu điểm ảnh ≈ 8000×6000, rộng hơn mọi máy ảnh phổ thông</span>
  .resize({ width: <span class="tok-num">1200</span> }).webp().toBuffer();</code></pre>
<div class="out">Bom 1 (256MP) với limitInputPixels: 50e6 → Input image exceeds pixel limit</div>
<p>Và vì phần việc của sharp chạy trong luồng riêng của libvips chứ không trên event loop, nửa còn lại của câu trả lời là một hàng đợi: hãy chặn số ảnh xử lý đồng thời, thay vì để lưu lượng request quyết định hộ.</p>

<h3>Phép đo 5 — tấm ảnh kể gì về chủ nhân của nó</h3>
<p>Một file JPEG lấy thẳng từ điện thoại mang theo EXIF: đời máy, thời điểm chụp, và thường là toạ độ GPS chính xác tới vài mét. Upload nguyên xi là đăng lại toàn bộ chỗ đó:</p>
<div class="out">ảnh "từ điện thoại": 45.168 byte | có EXIF: true (256 byte)
  chuỗi "iPhone 15 Pro" còn trong file? true
sau khi sharp re-encode : 11.366 byte | có EXIF: false
  chuỗi "iPhone 15 Pro" còn không? false
nếu gọi withMetadata()  : 12.136 byte | có EXIF: true</div>
<p>sharp bỏ metadata theo mặc định, và đó là mặc định an toàn — cách duy nhất để giữ EXIF là chủ động yêu cầu bằng <code>withMetadata()</code>. Đáng biết theo cả hai chiều: nếu sản phẩm của bạn cần giữ hướng ảnh hay dòng bản quyền, bạn phải bật lên, và khi bật thì bạn cũng đang bật luôn phần GPS — nên hãy lọc có chọn lọc.</p>

<h3>Nội dung "sống": nhóm tuyệt đối không được lưu nguyên trạng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">HTML / XHTML</span><span class="lz-lnote">phục vụ từ tên miền media của bạn thì nó là một trang trên tên miền của bạn — lừa đảo dưới ổ khoá của bạn, hoặc trộm phiên nếu tên miền đó dùng chung cookie</span></div>
  <div class="lz-layer"><span class="lz-lname">SVG</span><span class="lz-lnote">một định dạng ảnh nhưng là XML, chạy được <code>&lt;script&gt;</code> và <code>onload</code>. Hoặc lọc nó như lọc HTML, hoặc từ chối thẳng</span></div>
  <div class="lz-layer"><span class="lz-lname">JS, XML, PHP, .htaccess</span><span class="lz-lnote">chỉ nguy hiểm nếu có thứ gì đó thực thi chúng — nhưng "sẽ chẳng bao giờ có gì chạy trong thư mục này" là một giả định sống lâu hơn người đặt ra nó</span></div>
</div>
<p>Để ý rằng file SVG ở phép đo 1 bị chặn chỉ vì <code>file-type</code> không nhận ra SVG (nó là chữ, không phải định dạng nhị phân có magic bytes). Đừng dựa vào sự tình cờ đó: hãy từ chối SVG một cách tường minh, hoặc cho nó qua DOMPurify với hồ sơ dành cho SVG.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Ba lớp, theo thứ tự. Đầu tiên <code>assertSafeUploadType(mimetype, originalName, bucket)</code> trong <code>src/storage/uploadService.ts</code> từ chối nội dung sống theo MIME <em>và</em> theo đuôi — <code>DANGEROUS_MIME</code> phủ <code>text/html</code>, <code>image/svg+xml</code>, <code>application/javascript</code> và họ hàng, còn <code>DANGEROUS_EXT</code> là <code>/\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i</code>, cố ý làm cổng thứ hai vì MIME do client kiểm soát. Sau đó nó kiểm họ khai báo có khớp họ của bucket không, với một ngoại lệ có chủ đích: MIME rỗng hoặc <code>application/octet-stream</code> (rất hay gặp khi kéo-thả và ở vài trình duyệt di động) thì bỏ qua phép kiểm họ thay vì từ chối một tấm ảnh thật — cổng chặn đuôi nguy hiểm ở trên đã chặn các ca xấu rồi. Thứ hai, mọi ảnh đều đi qua <code>optimizeImage()</code>: sharp, rộng tối đa 1200, mã hoá lại thành WebP q80 — đồng thời là bước đổi định dạng, bước bóc payload, và bài kiểm "đây có thật là ảnh không"; lỗi ở đó được ánh xạ thành HTTP 400 chứ không phải 500, vì thứ sai là file của người dùng. Thứ ba, key lưu trữ được dựng lại với đuôi <code>.webp</code> để <code>Content-Type</code> phục vụ ra không bao giờ mâu thuẫn với byte bên trong. Một lỗ hổng thành thật: <code>limitInputPixels</code> vẫn đang để mặc định của sharp, nên quả bom 1 ở trên vẫn sẽ tiêu của máy chủ này 99MB — một chỗ đáng sửa.</p>
</div>

<div class="pitfall">
<p><strong>Sáu lỗi kiểm file cứ lặp đi lặp lại.</strong> (1) Dùng tên file gốc trong đường dẫn lưu trữ: <code>../../etc/cron.d/x</code> là một tên file hợp lệ, và mọi phép nối đường dẫn tin nó đều là một lần vượt thư mục. (2) Danh sách đen thay cho danh sách trắng — kiểu gì bạn cũng quên <code>.phtml</code>, <code>.mjs</code>, <code>.htaccess</code>. (3) Kiểm phần đuôi <em>trước</em> dấu chấm cuối: <code>evil.php.png</code> kết thúc bằng <code>.png</code> và bắt đầu bằng <code>evil.php</code>; chỉ đuôi cuối cùng có nghĩa, và cũng chỉ có nghĩa để đặt tên, không bao giờ để tin. (4) Kiểm lúc nhận nhưng lúc phục vụ lại dùng <code>Content-Type</code> lấy từ chuỗi gốc của client — dò magic bytes ở cửa vào là vô nghĩa nếu ở cửa ra bạn phát lại MIME của họ. (5) Nhận file nén (zip, docx) rồi bung ở máy chủ: bom zip là đúng bài học của phép đo 4 với một bộ giải nén khác. (6) Coi <code>image/*</code> là an toàn vì nó là ảnh — quả bom, file lai và EXIF đều là ảnh cả.</p>
</div>

<h3>Đọng lại gì</h3>
<p>Kiểm file upload không phải là so chuỗi, mà là giải mã. Dò magic bytes để trượt sớm và rẻ, rồi mã hoá lại file và lưu bản ra chứ không lưu bản vào. Chặn khối lượng công việc bằng số điểm ảnh chứ không chỉ bằng số byte. Và từ chối thẳng nội dung sống — một endpoint nhận ảnh không có lý do gì để nhận thứ mà trình duyệt sẽ chạy.</p>

<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-968" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 968 — Access Control &amp; Security</span><span class="lc-sub">10 bài tập: quyền trên bucket, key không đoán được, và kiểm file.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/media-processing${REF}#module-973" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 973 — Image Processing with Sharp</span><span class="lc-sub">10 bài tập: giải mã, đổi kích thước, đổi định dạng, và giới hạn tài nguyên.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — Serving media back: formats, caching and the CDN|||10.4 — Phục vụ media trở lại: định dạng, cache và CDN',
      slug: 'nodejs-10-4-phuc-vu-media-cache',
      type: 'VIDEO',
      description: 'Một tấm ảnh được xem hàng nghìn lần và upload đúng một lần: chọn định dạng và cỡ, đặt Cache-Control ngay lúc ghi, đọc header thật của media.cuongthai.com, và dọn rác object mồ côi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Serving media back: formats, caching and the CDN</h2>
<p class="lead">A file is uploaded once and read thousands of times. Every decision so far — the key you chose, the format you re-encoded to, the metadata you attached — was really a decision about the read path, and this is where the bill arrives. This lesson measures what re-encoding buys, reads the actual cache headers this site serves in production, and ends with the part everybody forgets: deleting things.</p>

<h3>Measurement 1 — what format and size are worth</h3>
<p>The same 4032×3024 source through sharp, three runs each, median. Two sources on purpose: a smooth photographic image and a high-noise one, because the answer is not the same:</p>
<div class="out">### ảnh mượt như ảnh chụp — 298,6KB gốc
  jpeg q80 @1200    24,1 KB     23 ms      còn lại 8,1%
  webp q80 @1200    10,7 KB     65 ms      còn lại 3,6%
  avif q50 @1200     6,0 KB    108 ms      còn lại 2,0%
  webp q80 @400      2,2 KB     16 ms      còn lại 0,7%

### ảnh nhiều hạt nhiễu — 7014,7KB gốc
  jpeg q80 @1200   561,5 KB     71 ms      còn lại 8,0%
  webp q80 @1200   570,4 KB    210 ms      còn lại 8,1%
  avif q50 @1200   225,8 KB    881 ms      còn lại 3,2%
  webp q80 @400     59,7 KB     68 ms      còn lại 0,9%</div>
<p>Three honest readings. First, <strong>resizing dominates everything</strong>: 4032px down to 1200px removes 92% of the bytes before the format even matters, and down to 400px removes 99%. Second, <strong>WebP beats JPEG by 2,25× on smooth photographic content and loses slightly on noisy content</strong> — the "WebP is 30% smaller" rule is an average, not a law. Third, AVIF is dramatically smaller and 4–12× slower to encode; that trade is fine in a background job and painful in a request handler.</p>
<p>The practical shape that follows: store one canonical size for display, one small size for lists and avatars, and — if you want the polished feel — a 32px version at 0,1KB to blur up while the real image loads.</p>

<h3>Measurement 2 — the headers this site really serves</h3>
<p><code>curl -sI https://media.cuongthai.com/images/course-covers/nodejs.png</code>, run today:</p>
<div class="out">HTTP/2 200
content-type: image/png
content-length: 181485
etag: "6a5e9970fab4f24ecec396e4a64ac9d0"
last-modified: Mon, 27 Jul 2026 14:26:49 GMT
accept-ranges: bytes
cache-control: public, max-age=31536000, immutable
server: cloudflare
cf-cache-status: DYNAMIC</div>
<p>Read <code>cache-control</code> first, because it is the whole strategy in one line. <code>public</code>: any cache may store it. <code>max-age=31536000</code>: one year. <code>immutable</code>: do not even revalidate — the browser will not send a conditional request at all, so a repeat view costs zero network. That is only safe because of the key layout from lesson 10.2: keys contain a timestamp and random bytes, so a changed image is a <em>different key</em>, never a changed object. Content-addressed keys and <code>immutable</code> are the same decision made twice.</p>
<p>Now the last line, and the honest part of this lesson — because the first reading of it was <em>wrong</em>. <code>cf-cache-status: DYNAMIC</code> on three consecutive requests looks like proof that Cloudflare is not caching this object at the edge. It is not proof of anything. Repeat the request as a real GET instead of a HEAD:</p>
<div class="out">$ curl -s -o /dev/null -D - https://media.cuongthai.com/images/course-covers/nodejs.png
HTTP/2 200
age: 27107
cf-cache-status: HIT
cf-ray: a21ee83ce982219a-HKG</div>
<p><code>HIT</code>, and an <code>age</code> of 27107 seconds — this object has been sitting at the edge for seven and a half hours. The edge cache was working the entire time. The measurement was not.</p>
<div class="pitfall">
<p><strong>Pitfall — <code>curl -I</code> sends HEAD, and Cloudflare answers HEAD with DYNAMIC.</strong> A HEAD request is not served from the edge cache the way a GET is, so <code>cf-cache-status</code> reports <code>DYNAMIC</code> even while the object is cached and being served to real users from the nearest city. The two requests above were sent seconds apart, to the same URL, from the same machine, and disagree completely. Verify a CDN with <code>curl -s -o /dev/null -D -</code> (a GET whose body you throw away), never with <code>curl -I</code> — and read <code>age</code>, which a cold cache cannot fake. The same trap sits under every "is my CDN working?" answer on the internet.</p>
</div>

<h3>Measurement 3 — what those headers buy, in bytes</h3>
<div class="out">GET với If-None-Match: "6a5e9970…"  → HTTP 304, tải về 0 byte
GET với Range: bytes=0-99          → HTTP 206, 100 byte
GET một key không tồn tại          → HTTP 404</div>
<p>A conditional request that hits costs a round trip and zero body. <code>Accept-Ranges: bytes</code> plus 206 is what makes a <code>&lt;video&gt;</code> tag seekable — the browser asks for the byte range around the timestamp you scrubbed to instead of downloading the file. If you ever proxy media yourself, you must implement Range or seeking silently breaks.</p>

<h3>Measurement 4 — the cost of proxying media through your API</h3>
<p>Twenty sequential requests for the same 6,85MB object through an Express route that fetches it from storage:</p>
<div class="out">proxy đệm hết vào buffer rồi trả : 672ms cho 20 lần | RSS 69,8 → 125,9MB
proxy stream thẳng (Body.pipe)   : 481ms cho 20 lần</div>
<p>Same bytes, 28% faster and far less memory, purely from not holding the object. But the real conclusion is one level up: <strong>every one of those requests spent your server's CPU and your VPS's bandwidth on something a CDN would have served from an edge node</strong>. Public media should be a direct URL. Keep a proxy route only for genuinely private files, and even then prefer redirecting to a short-lived signed URL (302) over piping the bytes yourself — you get the access check and still keep the transfer off your server.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Công khai</span><span class="lz-d">URL trực tiếp tới media domain + <code>immutable</code>. Máy chủ của bạn không tham gia lần đọc nào</span></div>
  <div class="lz-step"><span class="lz-t">Riêng tư, ngắn hạn</span><span class="lz-d">API kiểm quyền rồi trả 302 tới URL ký sẵn hạn vài phút. Không cache được ở CDN, nhưng byte không đi qua bạn</span></div>
  <div class="lz-step"><span class="lz-t">Riêng tư, cần kiểm mỗi lần</span><span class="lz-d">proxy stream có kiểm quyền — đắt nhất, dành cho tài liệu nhạy cảm và hoá đơn, không dành cho ảnh feed</span></div>
</div>

<h3>The part everybody forgets: deleting</h3>
<p>Storage has no foreign keys. Delete a post row and the objects stay, paid for, forever. Three leaks and their fixes:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Xoá bản ghi, quên object</span><span class="v">delete the row and the file in the same operation. Delete the object first: a failed row delete leaves a file that cleanup can find, while the reverse leaves a row pointing at nothing</span></div>
  <div class="kv"><span class="k">Upload rồi bỏ dở</span><span class="v">the user picked a video, it uploaded, they closed the tab. The object exists and no row references it — this is what a pending-uploads table with a TTL is for</span></div>
  <div class="kv"><span class="k">Thay ảnh cũ</span><span class="v">new avatar = new key. The old key is now orphaned unless the update path deletes it</span></div>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Media is served from <code>media.cuongthai.com</code>, an R2 custom domain, entirely outside the API — the backend never streams an image. Two constraints follow and both have caused real bugs. The CSP <code>img-src</code> is an explicit allow-list, so an image on any other CDN silently fails to render (this is why course covers are generated into R2 rather than linked from an icon CDN); and <code>CourseCard</code> uses <code>course.thumbnailUrl</code> directly, so it must be an absolute URL. On the client, <code>getMediaUrl()</code> in <code>frontend/src/lib/utils.ts</code> turns a bare key into a full URL — and its first branch is a scar: <code>if (lp.startsWith('blob:') || lp.startsWith('data:')) return lp;</code>. Without it, an optimistic preview created by <code>URL.createObjectURL()</code> during an upload got the CDN base prepended, producing <code>https://&lt;r2&gt;/blob:https://…</code> and a 400 on every in-flight upload preview. Cleanup is <code>deleteByUrl()</code> / <code>deleteByUrls()</code> in <code>uploadService</code>, which resolve a public URL back to a key, ignore foreign URLs (a YouTube thumbnail is not ours to delete), and log rather than throw — a failed delete is a leak, not a user-facing error. Interrupted video uploads are caught by the <code>PendingUpload</code> table: a 24-hour TTL row written at presign-complete, marked <code>CONFIRMED</code> when the post is created, swept by a nightly cron otherwise.</p>
</div>

<div class="pitfall">
<p><strong>Six ways the read path goes wrong.</strong> (1) No <code>Cache-Control</code> on the object: caches fall back to heuristics, and you get the worst of both — sometimes stale, mostly re-downloaded. Set it at <code>PutObject</code> time; it is stored with the object. (2) <code>immutable</code> on a mutable key (<code>avatars/u7.jpg</code> overwritten in place): users see the old avatar for a year and no amount of refreshing helps. (3) Putting a presigned URL in an <code>&lt;img&gt;</code> and caching the HTML — the page outlives the signature and images 403 later. (4) Serving user uploads from your <em>main</em> domain: a stored HTML file then runs on the origin that holds your cookies. A separate media domain turns that from a session compromise into a nuisance. (5) Forgetting <code>Content-Disposition: attachment</code> for documents — a PDF you meant to be downloaded opens inline, and an HTML file you missed in validation renders. (6) Proxying media without implementing Range: video seeking stops working and the symptom looks like a broken player, not a broken server.</p>
</div>

<h3>What to take away</h3>
<p>Serving is where uploads become a cost. Resize first — it is worth more than any format choice — then pick the format for the content. Write <code>Cache-Control: public, max-age=31536000, immutable</code> at upload time and make it true by never reusing a key. Serve from a media domain, not from your API. And treat deletion as part of the feature, because storage bills are the only bug that grows while you sleep.</p>

<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-967" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 967 — Serving Files via CDN</span><span class="lc-sub">10 bài tập: cache header, tên miền media, và chi phí đường truyền.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/media-processing${REF}#module-978" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 978 — Thumbnails &amp; Poster Frames</span><span class="lc-sub">10 bài tập: sinh nhiều cỡ ảnh và ảnh bìa cho video.</span></span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Phục vụ media trở lại: định dạng, cache và CDN</h2>
<p class="lead">Một file được upload một lần và được đọc hàng nghìn lần. Mọi quyết định tới giờ — key bạn chọn, định dạng bạn mã hoá lại, metadata bạn gắn kèm — thực ra đều là quyết định về đường ĐỌC, và đây là chỗ hoá đơn được gửi tới. Bài này đo xem việc mã hoá lại mua được gì, đọc header cache thật mà site này đang phục vụ trên production, và kết bằng phần ai cũng quên: xoá.</p>

<h3>Phép đo 1 — định dạng và kích cỡ đáng giá bao nhiêu</h3>
<p>Cùng một ảnh nguồn 4032×3024 qua sharp, mỗi dòng chạy ba lần lấy trung vị. Cố ý dùng hai ảnh nguồn: một ảnh mượt như ảnh chụp và một ảnh nhiều hạt nhiễu, vì câu trả lời không giống nhau:</p>
<div class="out">### ảnh mượt như ảnh chụp — 298,6KB gốc
  jpeg q80 @1200    24,1 KB     23 ms      còn lại 8,1%
  webp q80 @1200    10,7 KB     65 ms      còn lại 3,6%
  avif q50 @1200     6,0 KB    108 ms      còn lại 2,0%
  webp q80 @400      2,2 KB     16 ms      còn lại 0,7%

### ảnh nhiều hạt nhiễu — 7014,7KB gốc
  jpeg q80 @1200   561,5 KB     71 ms      còn lại 8,0%
  webp q80 @1200   570,4 KB    210 ms      còn lại 8,1%
  avif q50 @1200   225,8 KB    881 ms      còn lại 3,2%
  webp q80 @400     59,7 KB     68 ms      còn lại 0,9%</div>
<p>Ba cách đọc thành thật. Thứ nhất, <strong>việc thu nhỏ áp đảo mọi thứ khác</strong>: từ 4032px xuống 1200px đã bỏ đi 92% số byte trước khi định dạng kịp có ý nghĩa, và xuống 400px thì bỏ 99%. Thứ hai, <strong>WebP thắng JPEG 2,25 lần trên ảnh chụp mượt và thua nhẹ trên ảnh nhiều nhiễu</strong> — câu "WebP nhỏ hơn 30%" là con số trung bình, không phải định luật. Thứ ba, AVIF nhỏ hơn hẳn và mã hoá chậm hơn 4–12 lần; cái đổi chác đó ổn trong một job nền và đau đớn trong một handler xử lý request.</p>
<p>Hình hài thực tế đi ra từ đó: lưu một cỡ chuẩn để hiển thị, một cỡ nhỏ cho danh sách và avatar, và — nếu muốn cảm giác mượt mà — thêm một bản 32px nặng 0,1KB để làm nền mờ trong lúc ảnh thật đang tải.</p>

<h3>Phép đo 2 — header mà site này thật sự đang phục vụ</h3>
<p><code>curl -sI https://media.cuongthai.com/images/course-covers/nodejs.png</code>, chạy hôm nay:</p>
<div class="out">HTTP/2 200
content-type: image/png
content-length: 181485
etag: "6a5e9970fab4f24ecec396e4a64ac9d0"
last-modified: Mon, 27 Jul 2026 14:26:49 GMT
accept-ranges: bytes
cache-control: public, max-age=31536000, immutable
server: cloudflare
cf-cache-status: DYNAMIC</div>
<p>Hãy đọc <code>cache-control</code> trước, vì cả chiến lược nằm gọn trong một dòng. <code>public</code>: mọi tầng cache đều được phép lưu. <code>max-age=31536000</code>: một năm. <code>immutable</code>: đừng cả kiểm lại — trình duyệt sẽ không gửi request có điều kiện nào cả, nên lần xem lại tốn 0 byte mạng. Điều đó chỉ an toàn nhờ cách bố trí key ở bài 10.2: key chứa dấu thời gian và byte ngẫu nhiên, nên một ảnh thay đổi là một <em>key khác</em>, không bao giờ là một object bị sửa. Key gắn với nội dung và cờ <code>immutable</code> là cùng một quyết định nói hai lần.</p>
<p>Giờ tới dòng cuối, và tới phần trung thực của bài này — bởi vì cách đọc đầu tiên của nó đã <em>sai</em>. Dòng <code>cf-cache-status: DYNAMIC</code> ở cả ba request liên tiếp trông như bằng chứng rằng Cloudflare không cache object này ở biên. Nó không chứng minh được gì cả. Hãy gửi lại đúng request đó bằng một GET thật thay vì một HEAD:</p>
<div class="out">$ curl -s -o /dev/null -D - https://media.cuongthai.com/images/course-covers/nodejs.png
HTTP/2 200
age: 27107
cf-cache-status: HIT
cf-ray: a21ee83ce982219a-HKG</div>
<p><code>HIT</code>, kèm <code>age</code> bằng 27107 giây — object này đã nằm sẵn ở biên suốt bảy tiếng rưỡi. Cache ở biên vẫn chạy suốt từ đầu tới giờ. Thứ không chạy là phép đo.</p>
<div class="pitfall">
<p><strong>Bẫy — <code>curl -I</code> gửi HEAD, và Cloudflare trả lời HEAD bằng DYNAMIC.</strong> Một request HEAD không được phục vụ từ cache biên theo cách của GET, nên <code>cf-cache-status</code> báo <code>DYNAMIC</code> ngay cả khi object đang nằm trong cache và đang được phục vụ cho người dùng thật từ thành phố gần nhất. Hai request ở trên cách nhau vài giây, cùng một URL, cùng một máy, mà mâu thuẫn hoàn toàn với nhau. Hãy kiểm CDN bằng <code>curl -s -o /dev/null -D -</code> (một lệnh GET mà bạn vứt phần thân đi), tuyệt đối đừng dùng <code>curl -I</code> — và hãy đọc <code>age</code>, con số mà một cache nguội không giả được. Đúng cái bẫy này nằm dưới mọi câu trả lời "CDN của tôi có chạy không?" trên internet.</p>
</div>

<h3>Phép đo 3 — mấy header đó mua được gì, tính bằng byte</h3>
<div class="out">GET với If-None-Match: "6a5e9970…"  → HTTP 304, tải về 0 byte
GET với Range: bytes=0-99          → HTTP 206, 100 byte
GET một key không tồn tại          → HTTP 404</div>
<p>Một request có điều kiện mà trúng thì tốn một vòng đi-về và 0 byte thân. <code>Accept-Ranges: bytes</code> cộng với 206 chính là thứ làm cho thẻ <code>&lt;video&gt;</code> tua được — trình duyệt xin đúng khoảng byte quanh mốc thời gian bạn kéo tới thay vì tải cả file. Nếu có lúc nào bạn tự proxy media, bạn buộc phải cài Range, nếu không việc tua sẽ hỏng lặng lẽ.</p>

<h3>Phép đo 4 — cái giá của việc proxy media qua API của bạn</h3>
<p>Hai mươi request tuần tự cho cùng một object 6,85MB, qua một route Express lấy nó từ storage:</p>
<div class="out">proxy đệm hết vào buffer rồi trả : 672ms cho 20 lần | RSS 69,8 → 125,9MB
proxy stream thẳng (Body.pipe)   : 481ms cho 20 lần</div>
<p>Cùng số byte, nhanh hơn 28% và tốn ít bộ nhớ hơn hẳn, chỉ nhờ không giữ object lại. Nhưng kết luận thật nằm cao hơn một tầng: <strong>mỗi request trong số đó đều tiêu CPU của máy chủ bạn và băng thông của VPS cho một việc mà CDN đã phục vụ được từ một nút biên</strong>. Media công khai nên là một URL trực tiếp. Chỉ giữ route proxy cho những file thật sự riêng tư, và ngay cả khi đó cũng nên chuyển hướng 302 tới một URL ký sẵn hạn vài phút thay vì tự bơm byte — bạn vẫn kiểm được quyền mà phần chuyển dữ liệu không đi qua bạn.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Công khai</span><span class="lz-d">URL trực tiếp tới media domain + <code>immutable</code>. Máy chủ của bạn không tham gia lần đọc nào</span></div>
  <div class="lz-step"><span class="lz-t">Riêng tư, ngắn hạn</span><span class="lz-d">API kiểm quyền rồi trả 302 tới URL ký sẵn hạn vài phút. Không cache được ở CDN, nhưng byte không đi qua bạn</span></div>
  <div class="lz-step"><span class="lz-t">Riêng tư, cần kiểm mỗi lần</span><span class="lz-d">proxy stream có kiểm quyền — đắt nhất, dành cho tài liệu nhạy cảm và hoá đơn, không dành cho ảnh feed</span></div>
</div>

<h3>Phần ai cũng quên: xoá</h3>
<p>Storage không có khoá ngoại. Xoá một dòng bài đăng thì object vẫn nằm đó, vẫn tính tiền, mãi mãi. Ba chỗ rò và cách bịt:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Xoá bản ghi, quên object</span><span class="v">hãy xoá dòng và file trong cùng một thao tác. Xoá object TRƯỚC: nếu xoá dòng hỏng thì còn lại một file mà dọn dẹp tìm được, còn làm ngược lại thì còn lại một dòng trỏ vào hư không</span></div>
  <div class="kv"><span class="k">Upload rồi bỏ dở</span><span class="v">người dùng chọn video, nó lên xong, họ đóng tab. Object tồn tại và không dòng nào tham chiếu tới — đó là lý do có bảng "upload đang chờ" kèm thời hạn</span></div>
  <div class="kv"><span class="k">Thay ảnh cũ</span><span class="v">avatar mới = key mới. Key cũ thành mồ côi trừ khi đường cập nhật xoá nó đi</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Media được phục vụ từ <code>media.cuongthai.com</code>, một custom domain của R2, hoàn toàn nằm ngoài API — backend không bao giờ stream một tấm ảnh. Hai ràng buộc đi theo và cả hai đều đã gây lỗi thật. <code>img-src</code> trong CSP là danh sách trắng tường minh, nên một tấm ảnh nằm ở CDN khác sẽ lặng lẽ không hiện (đó là lý do ảnh bìa khoá học được sinh thẳng vào R2 chứ không dẫn link từ một CDN icon); và <code>CourseCard</code> dùng thẳng <code>course.thumbnailUrl</code>, nên nó bắt buộc phải là URL tuyệt đối. Phía client, <code>getMediaUrl()</code> trong <code>frontend/src/lib/utils.ts</code> biến một key trần thành URL đầy đủ — và nhánh đầu tiên của nó là một vết sẹo: <code>if (lp.startsWith('blob:') || lp.startsWith('data:')) return lp;</code>. Không có dòng đó, bản xem trước lạc quan do <code>URL.createObjectURL()</code> tạo ra trong lúc upload bị ghép thêm tiền tố CDN, thành <code>https://&lt;r2&gt;/blob:https://…</code> và trả 400 với mọi bản xem trước đang upload dở. Phần dọn dẹp là <code>deleteByUrl()</code> / <code>deleteByUrls()</code> trong <code>uploadService</code>: chúng dò ngược từ URL công khai ra key, bỏ qua URL ngoại lai (một thumbnail YouTube không phải của mình để mà xoá), và ghi log chứ không ném — một lần xoá hỏng là một chỗ rò, không phải lỗi hiện ra cho người dùng. Video upload dở được bắt bằng bảng <code>PendingUpload</code>: một dòng hạn 24 giờ ghi lúc hoàn tất presign, đánh dấu <code>CONFIRMED</code> khi bài đăng được tạo, còn không thì một cron chạy đêm quét đi.</p>
</div>

<div class="pitfall">
<p><strong>Sáu cách đường đọc đi sai.</strong> (1) Object không có <code>Cache-Control</code>: các tầng cache quay về suy đoán, và bạn nhận phần tệ của cả hai — lúc thì cũ, phần lớn thì tải lại. Hãy đặt nó ngay lúc <code>PutObject</code>; nó được lưu kèm object. (2) Gắn <code>immutable</code> cho một key khả biến (<code>avatars/u7.jpg</code> bị ghi đè tại chỗ): người dùng nhìn avatar cũ suốt một năm và bấm tải lại bao nhiêu cũng vô ích. (3) Nhét URL ký sẵn vào <code>&lt;img&gt;</code> rồi cache trang HTML đó — trang sống lâu hơn chữ ký, và ảnh 403 về sau. (4) Phục vụ file người dùng upload từ tên miền <em>chính</em>: một file HTML được lưu sẽ chạy trên đúng origin đang giữ cookie của bạn. Một tên miền media riêng biến chuyện đó từ mất phiên thành phiền toái. (5) Quên <code>Content-Disposition: attachment</code> cho tài liệu — một file PDF bạn định cho tải về lại mở ngay trong trang, và một file HTML lọt qua khâu kiểm sẽ render. (6) Proxy media mà không cài Range: việc tua video ngừng hoạt động và triệu chứng trông như trình phát hỏng chứ không như máy chủ hỏng.</p>
</div>

<h3>Đọng lại gì</h3>
<p>Phục vụ là chỗ upload biến thành chi phí. Thu nhỏ trước — nó đáng giá hơn mọi lựa chọn định dạng — rồi mới chọn định dạng theo loại nội dung. Ghi <code>Cache-Control: public, max-age=31536000, immutable</code> ngay lúc upload và làm cho nó ĐÚNG bằng cách không bao giờ dùng lại một key. Phục vụ từ tên miền media, không phải từ API. Và coi việc xoá là một phần của tính năng, vì hoá đơn lưu trữ là loại lỗi duy nhất lớn dần trong lúc bạn ngủ.</p>

<a class="link-card codelab" href="/code-lab/object-storage-s3${REF}#module-967" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 967 — Serving Files via CDN</span><span class="lc-sub">10 bài tập: cache header, tên miền media, và chi phí đường truyền.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/media-processing${REF}#module-978" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 978 — Thumbnails &amp; Poster Frames</span><span class="lc-sub">10 bài tập: sinh nhiều cỡ ảnh và ảnh bìa cho video.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — Quiz: uploads and object storage|||10.5 — Kiểm tra: upload và object storage',
      slug: 'nodejs-10-5-quiz',
      type: 'QUIZ',
      description: 'Chín câu về bộ nhớ khi nhận file, URL ký sẵn và những gì chữ ký KHÔNG phủ, kiểm file bằng cách giải mã, bom giải nén, và cache bất biến.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is decided by a measured number or a real HTTP response from lessons 10.1 to 10.4 — the RSS of a server under four concurrent uploads, the <code>SignedHeaders</code> line of a presigned URL, what sharp does with a 758KB file describing 256 million pixels. Uploads are an area where the reasonable-sounding answer is often the one that costs you 445MB, so when a question feels close, go back to the output block rather than to the prose.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một con số đo được hoặc một phản hồi HTTP thật trong bài 10.1 tới 10.4 — RSS của một máy chủ dưới bốn lượt upload đồng thời, dòng <code>SignedHeaders</code> của một URL ký sẵn, sharp làm gì với một file 758KB mô tả 256 triệu điểm ảnh. Upload là mảng mà câu trả lời "nghe hợp lý" thường lại là câu tốn của bạn 445MB, nên câu nào thấy sát nhau thì hãy quay lại đúng khối kết quả, đừng quay lại phần văn xuôi.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A 6,85MB photo sent as base64 inside a JSON body made the server RSS jump by 47,2MB, while the same photo through multer memoryStorage cost 19,2MB. Why the difference?|||Một tấm ảnh 6,85MB gửi dưới dạng base64 trong thân JSON làm RSS máy chủ tăng 47,2MB, trong khi cũng tấm ảnh đó qua multer memoryStorage chỉ tốn 19,2MB. Vì sao khác nhau?',
            options: [
              'JSON parsing is inherently slower than multipart parsing|||Phân tích JSON vốn dĩ chậm hơn phân tích multipart',
              'Base64 is 33% larger on the wire and the server then holds the text body, the parser buffer and the decoded Buffer at the same time — several copies of the same file|||Base64 phình 33% trên đường truyền, rồi máy chủ giữ đồng thời phần thân dạng chữ, buffer của bộ phân tích và Buffer đã giải mã — vài bản sao của cùng một file',
              'express.json() disables garbage collection while parsing|||express.json() tắt bộ thu gom rác trong lúc phân tích',
              'multer compresses the file before storing it in memory|||multer nén file lại trước khi cất vào bộ nhớ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Four clients uploaded a 120MB video at the same time into multer.memoryStorage() and the server RSS went from 56,7MB to 786,1MB. What is the correct fix on a 6GB VPS?|||Bốn client cùng lúc upload video 120MB vào multer.memoryStorage() và RSS máy chủ đi từ 56,7MB lên 786,1MB. Cách sửa đúng trên một VPS 6GB là gì?',
            options: [
              'Raise the Node heap with --max-old-space-size so the buffers fit|||Nâng heap của Node bằng --max-old-space-size cho vừa các buffer',
              'Keep memoryStorage but lower limits.fileSize to 50MB|||Vẫn dùng memoryStorage nhưng hạ limits.fileSize xuống 50MB',
              'Take the file out of the server: presign a direct upload to storage, or stream the part through with busboy + lib-storage instead of buffering it|||Đưa file ra khỏi máy chủ: ký sẵn cho client upload thẳng lên storage, hoặc stream xuyên qua bằng busboy + lib-storage thay vì đệm lại',
              'Process uploads in a worker thread so the main thread stays free|||Xử lý upload trong worker thread để luồng chính rảnh',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'With limits.fileSize set to 5MB, a 6,85MB upload returned 413 with LIMIT_FILE_SIZE — and curl reported it had still sent 7.183.298 bytes. What does a size limit actually protect?|||Với limits.fileSize đặt 5MB, một lần upload 6,85MB trả về 413 kèm LIMIT_FILE_SIZE — và curl báo nó vẫn đã gửi đủ 7.183.298 byte. Vậy giới hạn kích thước thật ra bảo vệ cái gì?',
            options: [
              'Bandwidth: the connection is cut as soon as the limit is reached|||Băng thông: kết nối bị cắt ngay khi chạm giới hạn',
              'Your memory and disk — the bytes still arrive over the network; only the buffering stops. Rejecting before transfer needs a Content-Length check, which is itself a client claim|||Bộ nhớ và đĩa của bạn — byte vẫn tới qua mạng, chỉ có việc đệm là dừng. Muốn từ chối trước khi truyền thì phải xem Content-Length, mà chính nó cũng là lời khai của client',
              'Nothing: multer applies the limit only after the whole request is parsed|||Không gì cả: multer chỉ áp giới hạn sau khi đã phân tích xong toàn bộ request',
              'The database, by keeping oversized rows out|||Cơ sở dữ liệu, bằng cách chặn các dòng quá cỡ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A presigned PUT was created with ContentType: video/mp4 and the URL showed X-Amz-SignedHeaders: host. The client PUT 39 bytes with Content-Type: text/html and got HTTP 200. What happened and how is it fixed?|||Một PUT ký sẵn được tạo với ContentType: video/mp4 và URL hiện X-Amz-SignedHeaders: host. Client PUT 39 byte với Content-Type: text/html và nhận HTTP 200. Chuyện gì đã xảy ra và sửa thế nào?',
            options: [
              'Storage silently rewrote the content type to video/mp4, so nothing is wrong|||Storage âm thầm ghi lại content type thành video/mp4 nên không có gì sai',
              'ContentType was only a default because it was not in SignedHeaders — the object is now stored as text/html on your media domain. Sign it: signableHeaders: new Set(["content-type"])|||ContentType chỉ là giá trị mặc định vì nó không nằm trong SignedHeaders — giờ object được lưu là text/html trên tên miền media của bạn. Hãy ký nó: signableHeaders: new Set(["content-type"])',
              'The signature expired and storage fell back to accepting any content type|||Chữ ký hết hạn nên storage chuyển sang chấp nhận mọi content type',
              'It only happens with MinIO; Cloudflare R2 enforces the signed ContentType|||Chỉ xảy ra với MinIO; Cloudflare R2 có ép ContentType đã ký',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your API validated that the client declared a 5MB video before signing a PUT. The client then PUT 125.829.120 bytes to that URL and storage accepted it. What must the server do?|||API của bạn đã kiểm rằng client khai video 5MB trước khi ký một PUT. Client sau đó PUT 125.829.120 byte vào URL ấy và storage vẫn nhận. Máy chủ phải làm gì?',
            options: [
              'Nothing — the signature covers the declared size, so this cannot happen|||Không cần gì — chữ ký đã phủ kích thước khai báo nên chuyện này không xảy ra được',
              'Shorten expiresIn so there is not enough time to upload a large file|||Rút ngắn expiresIn để không đủ thời gian upload một file lớn',
              'Verify after the fact: HeadObject the key, compare the real size against the limit, and delete + reject if it is over — or use a presigned POST policy with content-length-range|||Kiểm sau khi xong: HeadObject cái key, đối chiếu kích thước THẬT với giới hạn, quá thì xoá và từ chối — hoặc dùng presigned POST policy có content-length-range',
              'Set a bucket-wide maximum object size in the storage console|||Đặt kích thước object tối đa cho cả bucket trong bảng điều khiển storage',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Editing the key inside a signed URL returned SignatureDoesNotMatch, and reusing a 5-second URL after 7 seconds returned 403 "Request has expired". What exactly does the signature cover?|||Sửa key bên trong một URL đã ký thì nhận SignatureDoesNotMatch, còn dùng lại URL hạn 5 giây sau 7 giây thì nhận 403 "Request has expired". Vậy chữ ký phủ chính xác những gì?',
            options: [
              'The method, the bucket, the key and the deadline — but not the body, not the size, and not any header that was not explicitly signed|||Phương thức, bucket, key và hạn chót — nhưng không phủ phần thân, không phủ kích thước, và không phủ header nào không được ký tường minh',
              'The whole request including the body hash, which is why tampering fails|||Cả request kể cả băm của phần thân, và đó là lý do sửa đổi bị phát hiện',
              'Only the expiry timestamp; the key is checked separately by bucket policy|||Chỉ mốc hết hạn; key được kiểm riêng bằng chính sách của bucket',
              'The IP address of the client that requested the URL|||Địa chỉ IP của client đã xin URL',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A file starting with the bytes GIF89a followed by &lt;script&gt;alert(1)&lt;/script&gt; was reported as image/gif by file-type, but sharp threw "Invalid frame data". What is the reliable way to validate an uploaded image?|||Một file bắt đầu bằng byte GIF89a rồi tới &lt;script&gt;alert(1)&lt;/script&gt; được file-type báo là image/gif, nhưng sharp ném "Invalid frame data". Cách đáng tin để kiểm một ảnh upload là gì?',
            options: [
              'Check the extension and the client Content-Type together — two checks are enough|||Kiểm đuôi file và Content-Type của client cùng lúc — hai lớp là đủ',
              'Scan the whole file for the string &lt;script&gt; and reject if found|||Quét cả file tìm chuỗi &lt;script&gt; và từ chối nếu có',
              'Decode it: sniff the magic bytes to fail fast, then re-encode with sharp and store the OUTPUT, never the input — anything that is not a pixel does not survive|||Giải mã nó: dò magic bytes để trượt sớm, rồi mã hoá lại bằng sharp và lưu bản RA chứ không lưu bản vào — thứ gì không phải điểm ảnh thì không sống sót',
              'Only accept files whose magic bytes match the declared extension|||Chỉ nhận file có magic bytes khớp với đuôi đã khai',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Eight 758KB PNG files (16000×16000, 256 million pixels each) processed concurrently pushed the server RSS up by 445MB, while eight real 6,85MB photos cost 17MB. Which defence addresses this?|||Tám file PNG 758KB (16000×16000, mỗi file 256 triệu điểm ảnh) xử lý đồng thời đẩy RSS máy chủ lên thêm 445MB, trong khi tám tấm ảnh thật 6,85MB chỉ tốn 17MB. Lớp phòng thủ nào xử lý được chuyện đó?',
            options: [
              'A stricter limits.fileSize — 758KB files would be rejected|||Một limits.fileSize chặt hơn — file 758KB sẽ bị từ chối',
              'A pixel budget (sharp&#39;s limitInputPixels, e.g. 50e6) plus a bounded processing queue — the danger is decoded pixels, not uploaded bytes|||Một hạn mức điểm ảnh (limitInputPixels của sharp, ví dụ 50e6) cộng một hàng đợi xử lý có giới hạn — thứ nguy hiểm là điểm ảnh sau giải mã, không phải byte upload lên',
              'Rejecting PNG and accepting only JPEG|||Từ chối PNG và chỉ nhận JPEG',
              'Running sharp in a worker thread so the event loop stays responsive|||Chạy sharp trong worker thread để event loop còn phản hồi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'media.cuongthai.com serves cache-control: public, max-age=31536000, immutable. What makes that safe, and when does it become a bug?|||media.cuongthai.com phục vụ cache-control: public, max-age=31536000, immutable. Điều gì làm nó an toàn, và khi nào nó thành lỗi?',
            options: [
              'It is safe because Cloudflare revalidates hourly regardless of max-age|||An toàn vì Cloudflare vẫn kiểm lại mỗi giờ bất kể max-age',
              'It is safe because keys carry a timestamp + random suffix, so a changed image is a NEW key — it becomes a bug the moment a key is overwritten in place, e.g. avatars/u7.jpg|||An toàn vì key mang dấu thời gian + hậu tố ngẫu nhiên, nên ảnh đổi là một key MỚI — nó thành lỗi ngay khi một key bị ghi đè tại chỗ, ví dụ avatars/u7.jpg',
              'It is safe because ETag lets the browser revalidate cheaply even with immutable|||An toàn vì ETag cho phép trình duyệt kiểm lại rẻ tiền dù có immutable',
              'It is never safe for user-generated content and should be max-age=300|||Không bao giờ an toàn với nội dung người dùng, nên để max-age=300',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
