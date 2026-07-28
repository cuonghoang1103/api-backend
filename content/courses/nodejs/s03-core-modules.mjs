/**
 * Node.js — Chương 3: Module lõi (path, fs, Buffer, stream, events, http).
 * MỌI số đo lấy từ chạy thật trên Node v22.21.0 với file mẫu 348 MB.
 * ⚠️ Trong code mẫu, mọi `${` phải viết thành \${ (file này là template literal).
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 3 — Core modules|||Chương 3 — Các module lõi',
  description: 'path, fs, Buffer, stream, EventEmitter và http — bộ đồ nghề có sẵn trong Node, không cần cài gì.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — path and fs|||3.1 — path và fs',
      slug: 'nodejs-3-1-path-fs',
      type: 'VIDEO',
      description: 'Làm việc với đường dẫn cho đúng trên mọi hệ điều hành, và ba phong cách API của fs.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2><code>path</code> and <code>fs</code></h2>
<p class="lead">Node ships a standard library you never install. Two modules from it appear in almost every backend: <code>path</code> for building file paths safely, and <code>fs</code> for touching the disk. Both have traps that only show up in production.</p>

<h3>Never build a path with string concatenation</h3>
<pre><code><span class="tok-keyword">const</span> path = <span class="tok-function">require</span>(<span class="tok-string">'node:path'</span>);

<span class="tok-function">console.log</span>(<span class="tok-string">'join    :'</span>, path.<span class="tok-function">join</span>(<span class="tok-string">'/var/www'</span>, <span class="tok-string">'uploads'</span>, <span class="tok-string">'..'</span>, <span class="tok-string">'images'</span>, <span class="tok-string">'a.png'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'extname :'</span>, path.<span class="tok-function">extname</span>(<span class="tok-string">'bao-cao.final.pdf'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'basename:'</span>, path.<span class="tok-function">basename</span>(<span class="tok-string">'/tmp/anh/meo.jpg'</span>, <span class="tok-string">'.jpg'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'parse   :'</span>, JSON.<span class="tok-function">stringify</span>(path.<span class="tok-function">parse</span>(<span class="tok-string">'/tmp/anh/meo.jpg'</span>)));

<span class="tok-function">console.log</span>(<span class="tok-string">'manual  :'</span>, <span class="tok-string">'/var/www'</span> + <span class="tok-string">'/'</span> + <span class="tok-string">'/uploads'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'join    :'</span>, path.<span class="tok-function">join</span>(<span class="tok-string">'/var/www'</span>, <span class="tok-string">'/uploads'</span>));</code></pre>
<div class="out">join    : /var/www/images/a.png
extname : .pdf
basename: meo
parse   : {"root":"/","dir":"/tmp/anh","base":"meo.jpg","ext":".jpg","name":"meo"}
manual  : /var/www//uploads
join    : /var/www/uploads</div>
<p>Two things <code>join</code> did for free: it resolved the <code>..</code>, and it collapsed the double slash. Manual concatenation produced <code>/var/www//uploads</code> — which usually still works, right up until it doesn't (URL comparisons, cache keys, S3 object keys where <code>//</code> creates an empty folder name).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">path.join</span><span class="v">Glue segments together with the right separator.</span></div>
  <div class="kv"><span class="k">path.resolve</span><span class="v">Produce an ABSOLUTE path, resolved from the current working directory.</span></div>
  <div class="kv"><span class="k">path.extname / basename / parse</span><span class="v">Take a path apart. Use these instead of <code>split('.')</code>.</span></div>
</div>
<div class="pitfall"><strong>The security one.</strong> Never do <code>path.join(uploadDir, req.params.filename)</code> with a user-supplied name. A filename of <code>../../etc/passwd</code> escapes your directory — this is path traversal. Always verify the result stays inside:
<br><br><code>const full = path.resolve(uploadDir, name);<br>if (!full.startsWith(path.resolve(uploadDir) + path.sep)) throw new Error('invalid path');</code></div>

<h3>fs comes in three flavours</h3>
<pre><code><span class="tok-comment">// 1. Promise API — what you should use</span>
<span class="tok-keyword">import</span> fs <span class="tok-keyword">from</span> <span class="tok-string">'node:fs/promises'</span>;
<span class="tok-keyword">const</span> text = <span class="tok-keyword">await</span> fs.<span class="tok-function">readFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>);

<span class="tok-comment">// 2. Callback API — older, still everywhere in libraries</span>
<span class="tok-keyword">import</span> { readFile } <span class="tok-keyword">from</span> <span class="tok-string">'node:fs'</span>;
<span class="tok-function">readFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>, (err, data) =&gt; { <span class="tok-comment">/* … */</span> });

<span class="tok-comment">// 3. Sync API — BLOCKS the event loop</span>
<span class="tok-keyword">import</span> { readFileSync } <span class="tok-keyword">from</span> <span class="tok-string">'node:fs'</span>;
<span class="tok-keyword">const</span> t = <span class="tok-function">readFileSync</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>);</code></pre>
<div class="callout danger">Chapter 2 explained why the third one is dangerous: while <code>readFileSync</code> runs, the entire process serves nobody. The <strong>only</strong> acceptable use is at startup — loading config before the server begins listening. Inside a request handler it is always a bug.</div>

<h3>Everyday recipes</h3>
<pre><code><span class="tok-keyword">import</span> fs <span class="tok-keyword">from</span> <span class="tok-string">'node:fs/promises'</span>;

<span class="tok-keyword">await</span> fs.<span class="tok-function">mkdir</span>(<span class="tok-string">'uploads/2026'</span>, { recursive: <span class="tok-keyword">true</span> });   <span class="tok-comment">// no error if it exists</span>
<span class="tok-keyword">await</span> fs.<span class="tok-function">writeFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'hello'</span>, <span class="tok-string">'utf8'</span>);
<span class="tok-keyword">await</span> fs.<span class="tok-function">appendFile</span>(<span class="tok-string">'app.log'</span>, <span class="tok-string">'a line\\n'</span>);
<span class="tok-keyword">const</span> files = <span class="tok-keyword">await</span> fs.<span class="tok-function">readdir</span>(<span class="tok-string">'uploads'</span>);
<span class="tok-keyword">const</span> info  = <span class="tok-keyword">await</span> fs.<span class="tok-function">stat</span>(<span class="tok-string">'note.txt'</span>);        <span class="tok-comment">// size, mtime, isDirectory()</span>
<span class="tok-keyword">await</span> fs.<span class="tok-function">rm</span>(<span class="tok-string">'tmp'</span>, { recursive: <span class="tok-keyword">true</span>, force: <span class="tok-keyword">true</span> });</code></pre>
<h3>Checking existence: don't</h3>
<pre><code><span class="tok-comment">// ❌ race condition: the file can vanish between the check and the read</span>
<span class="tok-keyword">if</span> (<span class="tok-function">existsSync</span>(p)) <span class="tok-keyword">await</span> fs.<span class="tok-function">readFile</span>(p);

<span class="tok-comment">// ✅ just try it, and handle the failure</span>
<span class="tok-keyword">try</span> { <span class="tok-keyword">await</span> fs.<span class="tok-function">readFile</span>(p); }
<span class="tok-keyword">catch</span> (err) {
  <span class="tok-keyword">if</span> (err.code === <span class="tok-string">'ENOENT'</span>) { <span class="tok-comment">/* not found */</span> } <span class="tok-keyword">else</span> <span class="tok-keyword">throw</span> err;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">ENOENT</span><span class="v">No such file or directory — the one you handle most.</span></div>
  <div class="kv"><span class="k">EACCES</span><span class="v">Permission denied — very common inside Docker, where the process runs as a non-root user.</span></div>
  <div class="kv"><span class="k">EISDIR / ENOTDIR</span><span class="v">You treated a directory as a file, or vice versa.</span></div>
  <div class="kv"><span class="k">EMFILE</span><span class="v">Too many open files — you are leaking file handles somewhere.</span></div>
</div>
<div class="note-ct">On this site the disk is used far less than you might expect: uploads go straight to Cloudflare R2, not to local storage. That is deliberate — containers are replaceable, so anything written inside one disappears on the next deploy. Treat the container filesystem as scratch space only.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2><code>path</code> và <code>fs</code></h2>
<p class="lead">Node đi kèm một thư viện chuẩn mà bạn không phải cài. Hai module trong đó xuất hiện ở hầu hết mọi backend: <code>path</code> để dựng đường dẫn cho an toàn, và <code>fs</code> để đụng vào ổ đĩa. Cả hai đều có bẫy chỉ lộ ra khi lên production.</p>

<h3>Đừng bao giờ dựng đường dẫn bằng cách nối chuỗi</h3>
<pre><code><span class="tok-keyword">const</span> path = <span class="tok-function">require</span>(<span class="tok-string">'node:path'</span>);

<span class="tok-function">console.log</span>(<span class="tok-string">'join    :'</span>, path.<span class="tok-function">join</span>(<span class="tok-string">'/var/www'</span>, <span class="tok-string">'uploads'</span>, <span class="tok-string">'..'</span>, <span class="tok-string">'images'</span>, <span class="tok-string">'a.png'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'extname :'</span>, path.<span class="tok-function">extname</span>(<span class="tok-string">'bao-cao.final.pdf'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'basename:'</span>, path.<span class="tok-function">basename</span>(<span class="tok-string">'/tmp/anh/meo.jpg'</span>, <span class="tok-string">'.jpg'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'parse   :'</span>, JSON.<span class="tok-function">stringify</span>(path.<span class="tok-function">parse</span>(<span class="tok-string">'/tmp/anh/meo.jpg'</span>)));

<span class="tok-function">console.log</span>(<span class="tok-string">'nối tay :'</span>, <span class="tok-string">'/var/www'</span> + <span class="tok-string">'/'</span> + <span class="tok-string">'/uploads'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'join    :'</span>, path.<span class="tok-function">join</span>(<span class="tok-string">'/var/www'</span>, <span class="tok-string">'/uploads'</span>));</code></pre>
<div class="out">join    : /var/www/images/a.png
extname : .pdf
basename: meo
parse   : {"root":"/","dir":"/tmp/anh","base":"meo.jpg","ext":".jpg","name":"meo"}
nối tay : /var/www//uploads
join    : /var/www/uploads</div>
<p>Hai việc <code>join</code> làm miễn phí cho bạn: nó xử lý luôn dấu <code>..</code>, và gộp dấu gạch chéo bị lặp. Nối tay thì cho ra <code>/var/www//uploads</code> — thường vẫn chạy được, cho tới lúc không chạy nữa (khi so sánh URL, làm khoá cache, hay làm khoá đối tượng S3 — nơi <code>//</code> tạo ra một thư mục rỗng vô hình).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">path.join</span><span class="v">Dán các đoạn lại với đúng dấu phân cách của hệ điều hành.</span></div>
  <div class="kv"><span class="k">path.resolve</span><span class="v">Cho ra đường dẫn TUYỆT ĐỐI, tính từ thư mục làm việc hiện tại.</span></div>
  <div class="kv"><span class="k">path.extname / basename / parse</span><span class="v">Tháo rời một đường dẫn. Dùng mấy cái này thay cho <code>split('.')</code>.</span></div>
</div>
<div class="pitfall"><strong>Cái bẫy bảo mật.</strong> Đừng bao giờ viết <code>path.join(thuMucUpload, req.params.filename)</code> với tên file do người dùng gửi lên. Một cái tên kiểu <code>../../etc/passwd</code> sẽ thoát khỏi thư mục của bạn — đây là lỗ hổng path traversal. Luôn kiểm tra kết quả có còn nằm bên trong hay không:
<br><br><code>const full = path.resolve(thuMucUpload, ten);<br>if (!full.startsWith(path.resolve(thuMucUpload) + path.sep)) throw new Error('đường dẫn không hợp lệ');</code></div>

<h3>fs có ba phong cách</h3>
<pre><code><span class="tok-comment">// 1. API Promise — cái bạn nên dùng</span>
<span class="tok-keyword">import</span> fs <span class="tok-keyword">from</span> <span class="tok-string">'node:fs/promises'</span>;
<span class="tok-keyword">const</span> text = <span class="tok-keyword">await</span> fs.<span class="tok-function">readFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>);

<span class="tok-comment">// 2. API callback — cũ hơn, vẫn đầy rẫy trong các thư viện</span>
<span class="tok-keyword">import</span> { readFile } <span class="tok-keyword">from</span> <span class="tok-string">'node:fs'</span>;
<span class="tok-function">readFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>, (err, data) =&gt; { <span class="tok-comment">/* … */</span> });

<span class="tok-comment">// 3. API đồng bộ — CHẶN event loop</span>
<span class="tok-keyword">import</span> { readFileSync } <span class="tok-keyword">from</span> <span class="tok-string">'node:fs'</span>;
<span class="tok-keyword">const</span> t = <span class="tok-function">readFileSync</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'utf8'</span>);</code></pre>
<div class="callout danger">Chương 2 đã giải thích vì sao cái thứ ba nguy hiểm: trong lúc <code>readFileSync</code> chạy, cả tiến trình không phục vụ ai hết. Trường hợp chấp nhận được <strong>duy nhất</strong> là lúc khởi động — nạp cấu hình trước khi server bắt đầu lắng nghe. Nằm trong một request handler thì luôn luôn là bug.</div>

<h3>Vài công thức dùng hằng ngày</h3>
<pre><code><span class="tok-keyword">import</span> fs <span class="tok-keyword">from</span> <span class="tok-string">'node:fs/promises'</span>;

<span class="tok-keyword">await</span> fs.<span class="tok-function">mkdir</span>(<span class="tok-string">'uploads/2026'</span>, { recursive: <span class="tok-keyword">true</span> });   <span class="tok-comment">// đã có sẵn cũng không báo lỗi</span>
<span class="tok-keyword">await</span> fs.<span class="tok-function">writeFile</span>(<span class="tok-string">'note.txt'</span>, <span class="tok-string">'hello'</span>, <span class="tok-string">'utf8'</span>);
<span class="tok-keyword">await</span> fs.<span class="tok-function">appendFile</span>(<span class="tok-string">'app.log'</span>, <span class="tok-string">'một dòng\\n'</span>);
<span class="tok-keyword">const</span> files = <span class="tok-keyword">await</span> fs.<span class="tok-function">readdir</span>(<span class="tok-string">'uploads'</span>);
<span class="tok-keyword">const</span> info  = <span class="tok-keyword">await</span> fs.<span class="tok-function">stat</span>(<span class="tok-string">'note.txt'</span>);        <span class="tok-comment">// kích thước, thời gian sửa, isDirectory()</span>
<span class="tok-keyword">await</span> fs.<span class="tok-function">rm</span>(<span class="tok-string">'tmp'</span>, { recursive: <span class="tok-keyword">true</span>, force: <span class="tok-keyword">true</span> });</code></pre>
<h3>Kiểm tra file có tồn tại không: đừng làm</h3>
<pre><code><span class="tok-comment">// ❌ tranh chấp: file có thể biến mất giữa lúc kiểm và lúc đọc</span>
<span class="tok-keyword">if</span> (<span class="tok-function">existsSync</span>(p)) <span class="tok-keyword">await</span> fs.<span class="tok-function">readFile</span>(p);

<span class="tok-comment">// ✅ cứ thử làm, rồi xử lý khi thất bại</span>
<span class="tok-keyword">try</span> { <span class="tok-keyword">await</span> fs.<span class="tok-function">readFile</span>(p); }
<span class="tok-keyword">catch</span> (err) {
  <span class="tok-keyword">if</span> (err.code === <span class="tok-string">'ENOENT'</span>) { <span class="tok-comment">/* không tìm thấy */</span> } <span class="tok-keyword">else</span> <span class="tok-keyword">throw</span> err;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">ENOENT</span><span class="v">Không có file hoặc thư mục đó — mã lỗi bạn xử lý nhiều nhất.</span></div>
  <div class="kv"><span class="k">EACCES</span><span class="v">Không đủ quyền — rất hay gặp trong Docker, nơi tiến trình chạy bằng người dùng không phải root.</span></div>
  <div class="kv"><span class="k">EISDIR / ENOTDIR</span><span class="v">Bạn coi thư mục là file, hoặc ngược lại.</span></div>
  <div class="kv"><span class="k">EMFILE</span><span class="v">Mở quá nhiều file — bạn đang rò rỉ file handle ở đâu đó.</span></div>
</div>
<div class="note-ct">Ở website này ổ đĩa được dùng ít hơn bạn tưởng nhiều: file upload đi thẳng lên Cloudflare R2 chứ không lưu tại máy. Đó là chủ ý — container là thứ thay thế được, nên mọi thứ ghi bên trong nó sẽ biến mất ở lần deploy kế tiếp. Hãy coi hệ thống file của container chỉ là chỗ nháp.</div>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Buffers: binary data|||3.2 — Buffer: dữ liệu nhị phân',
      slug: 'nodejs-3-2-buffer',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-3-2-buffer.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-3-2-buffer.jpg',
        scenario: 'nodejs-buffer',
        durationSeconds: 18,
        caption: { en: "Buffers — characters are not bytes", vi: "Buffer — ký tự không phải là byte" },
      },
      type: 'VIDEO',
      description: 'Vì sao "8 ký tự" lại là 9 byte, và điều gì xảy ra khi bạn cắt buffer sai chỗ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Buffers: binary data</h2>
<p class="lead">A <code>Buffer</code> is a fixed-length chunk of raw bytes outside V8's normal heap. Whenever Node touches the outside world — files, sockets, images, encryption — the data arrives as bytes, and Buffer is how you hold them.</p>

<h3>Characters are not bytes</h3>
<pre><code><span class="tok-keyword">const</span> s = <span class="tok-string">'Xin chào'</span>;
<span class="tok-keyword">const</span> b = Buffer.<span class="tok-function">from</span>(s, <span class="tok-string">'utf8'</span>);

<span class="tok-function">console.log</span>(<span class="tok-string">'string length :'</span>, s.length, <span class="tok-string">'characters'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'buffer length :'</span>, b.length, <span class="tok-string">'bytes'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'hex           :'</span>, b.<span class="tok-function">toString</span>(<span class="tok-string">'hex'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'base64        :'</span>, b.<span class="tok-function">toString</span>(<span class="tok-string">'base64'</span>));</code></pre>
<div class="out">string length : 8 characters
buffer length : 9 bytes
hex           : 58696e206368c3a06f
base64        : WGluIGNow6Bv</div>
<p>Eight characters, nine bytes. The culprit is <code>à</code>: in UTF-8 an ASCII character costs 1 byte, but Vietnamese accented letters cost 2 (and emoji cost 4). <code>'à'</code> is the two bytes <code>c3 a0</code>.</p>

<h3>Cut in the wrong place and the text breaks</h3>
<pre><code><span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> n <span class="tok-keyword">of</span> [<span class="tok-number">6</span>, <span class="tok-number">7</span>, <span class="tok-number">8</span>, <span class="tok-number">9</span>])
  <span class="tok-function">console.log</span>(<span class="tok-string">'subarray(0,'</span> + n + <span class="tok-string">') ='</span>, JSON.<span class="tok-function">stringify</span>(b.<span class="tok-function">subarray</span>(<span class="tok-number">0</span>, n).<span class="tok-function">toString</span>(<span class="tok-string">'utf8'</span>)));</code></pre>
<div class="out">subarray(0,6) = "Xin ch"
subarray(0,7) = "Xin ch�"
subarray(0,8) = "Xin chà"
subarray(0,9) = "Xin chào"</div>
<p>At 7 bytes we sliced <em>through the middle</em> of <code>à</code> and got <code>�</code> — the replacement character. This is the real cause of the mangled text you occasionally see on websites.</p>
<div class="pitfall">This bites when you truncate: "keep the first 100 characters of the description" done as <code>buffer.subarray(0, 100)</code> can cut a multi-byte character in half. Truncate the <strong>string</strong>, not the buffer — and remember a database column defined as <code>VARCHAR(100)</code> counts characters while some encodings count bytes.</div>

<h3>Where you meet Buffers in practice</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">File uploads</span><span class="v">The uploaded file arrives as a Buffer before you send it to storage.</span></div>
  <div class="kv"><span class="k">Stream chunks</span><span class="v">Every <code>data</code> event of a stream hands you a Buffer.</span></div>
  <div class="kv"><span class="k">Crypto &amp; hashing</span><span class="v">Hashes, HMAC signatures and encryption all work on bytes.</span></div>
  <div class="kv"><span class="k">Webhook signatures</span><span class="v">Payment webhooks must be verified against the RAW body bytes — parsing to JSON first changes the bytes and the signature no longer matches.</span></div>
</div>
<pre><code><span class="tok-comment">// creating buffers</span>
Buffer.<span class="tok-function">from</span>(<span class="tok-string">'hello'</span>, <span class="tok-string">'utf8'</span>);        <span class="tok-comment">// from a string</span>
Buffer.<span class="tok-function">from</span>([<span class="tok-number">0x48</span>, <span class="tok-number">0x69</span>]);            <span class="tok-comment">// from bytes</span>
Buffer.<span class="tok-function">alloc</span>(<span class="tok-number">1024</span>);                  <span class="tok-comment">// 1 KB of zeros — SAFE</span>
Buffer.<span class="tok-function">concat</span>([a, b]);                <span class="tok-comment">// join several chunks</span></code></pre>
<div class="callout warn">Never use <code>Buffer.allocUnsafe(n)</code> unless you immediately overwrite every byte. It hands you memory that was not cleared — meaning it may still contain fragments of other data that passed through your process. Use <code>Buffer.alloc</code>.</div>
<div class="note-ct">The payment integration on this site verifies webhook signatures against the raw request body for exactly the reason above: Express would otherwise parse the JSON and re-serialise it, changing whitespace and key order, and the HMAC would never match. Chapter 6 shows how to keep the raw body available for just that one route.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Buffer: dữ liệu nhị phân</h2>
<p class="lead">Một <code>Buffer</code> là khối byte thô có độ dài cố định, nằm ngoài vùng heap thường của V8. Mỗi khi Node chạm vào thế giới bên ngoài — file, socket, ảnh, mã hoá — dữ liệu về dưới dạng byte, và Buffer là thứ để giữ chúng.</p>

<h3>Ký tự không phải là byte</h3>
<pre><code><span class="tok-keyword">const</span> s = <span class="tok-string">'Xin chào'</span>;
<span class="tok-keyword">const</span> b = Buffer.<span class="tok-function">from</span>(s, <span class="tok-string">'utf8'</span>);

<span class="tok-function">console.log</span>(<span class="tok-string">'độ dài chuỗi  :'</span>, s.length, <span class="tok-string">'ký tự'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'độ dài buffer :'</span>, b.length, <span class="tok-string">'byte'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'dạng hex      :'</span>, b.<span class="tok-function">toString</span>(<span class="tok-string">'hex'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'dạng base64   :'</span>, b.<span class="tok-function">toString</span>(<span class="tok-string">'base64'</span>));</code></pre>
<div class="out">độ dài chuỗi  : 8 ký tự
độ dài buffer : 9 byte
dạng hex      : 58696e206368c3a06f
dạng base64   : WGluIGNow6Bv</div>
<p>Tám ký tự, chín byte. Thủ phạm là chữ <code>à</code>: trong UTF-8 một ký tự ASCII tốn 1 byte, nhưng chữ cái tiếng Việt có dấu tốn 2 byte (còn emoji tốn 4). Chữ <code>'à'</code> chính là hai byte <code>c3 a0</code>.</p>

<h3>Cắt sai chỗ là hỏng chữ</h3>
<pre><code><span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> n <span class="tok-keyword">of</span> [<span class="tok-number">6</span>, <span class="tok-number">7</span>, <span class="tok-number">8</span>, <span class="tok-number">9</span>])
  <span class="tok-function">console.log</span>(<span class="tok-string">'subarray(0,'</span> + n + <span class="tok-string">') ='</span>, JSON.<span class="tok-function">stringify</span>(b.<span class="tok-function">subarray</span>(<span class="tok-number">0</span>, n).<span class="tok-function">toString</span>(<span class="tok-string">'utf8'</span>)));</code></pre>
<div class="out">subarray(0,6) = "Xin ch"
subarray(0,7) = "Xin ch�"
subarray(0,8) = "Xin chà"
subarray(0,9) = "Xin chào"</div>
<p>Tới 7 byte thì ta đã cắt <em>ngay giữa</em> chữ <code>à</code> và nhận về <code>�</code> — ký tự thay thế. Đây chính là nguyên nhân thật sự của những đoạn chữ bị vỡ mà thỉnh thoảng bạn thấy trên các website.</p>
<div class="pitfall">Lỗi này cắn bạn khi cắt ngắn chuỗi: yêu cầu "lấy 100 ký tự đầu của mô tả" mà làm bằng <code>buffer.subarray(0, 100)</code> có thể chặt đôi một ký tự nhiều byte. Hãy cắt <strong>chuỗi</strong>, đừng cắt buffer — và nhớ rằng một cột database khai báo <code>VARCHAR(100)</code> đếm theo ký tự, trong khi vài bảng mã lại đếm theo byte.</div>

<h3>Bạn gặp Buffer ở đâu trong thực tế</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Upload file</span><span class="v">File tải lên về dưới dạng Buffer trước khi bạn đẩy nó sang kho lưu trữ.</span></div>
  <div class="kv"><span class="k">Khúc dữ liệu của stream</span><span class="v">Mỗi sự kiện <code>data</code> của stream đưa cho bạn một Buffer.</span></div>
  <div class="kv"><span class="k">Mã hoá &amp; băm</span><span class="v">Hàm băm, chữ ký HMAC và mã hoá đều làm việc trên byte.</span></div>
  <div class="kv"><span class="k">Chữ ký webhook</span><span class="v">Webhook thanh toán phải được xác minh trên ĐÚNG byte thô của body — phân tích thành JSON trước sẽ làm đổi byte và chữ ký không còn khớp.</span></div>
</div>
<pre><code><span class="tok-comment">// các cách tạo buffer</span>
Buffer.<span class="tok-function">from</span>(<span class="tok-string">'hello'</span>, <span class="tok-string">'utf8'</span>);        <span class="tok-comment">// từ chuỗi</span>
Buffer.<span class="tok-function">from</span>([<span class="tok-number">0x48</span>, <span class="tok-number">0x69</span>]);            <span class="tok-comment">// từ các byte</span>
Buffer.<span class="tok-function">alloc</span>(<span class="tok-number">1024</span>);                  <span class="tok-comment">// 1 KB toàn số 0 — AN TOÀN</span>
Buffer.<span class="tok-function">concat</span>([a, b]);                <span class="tok-comment">// nối nhiều khúc lại</span></code></pre>
<div class="callout warn">Đừng bao giờ dùng <code>Buffer.allocUnsafe(n)</code> trừ khi bạn ghi đè ngay lập tức lên từng byte. Nó đưa cho bạn vùng nhớ chưa được xoá — nghĩa là có thể còn sót mảnh dữ liệu khác từng đi qua tiến trình của bạn. Hãy dùng <code>Buffer.alloc</code>.</div>
<div class="note-ct">Phần tích hợp thanh toán của website này xác minh chữ ký webhook trên body thô đúng vì lý do vừa nói: nếu không, Express sẽ phân tích JSON rồi tạo lại chuỗi, làm đổi khoảng trắng và thứ tự khoá, khiến HMAC không bao giờ khớp. Chương 6 sẽ chỉ cách giữ lại body thô cho riêng một route đó.</div>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Streams: the 348 MB experiment|||3.3 — Stream: thí nghiệm với file 348 MB',
      slug: 'nodejs-3-3-stream',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-3-3-stream.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-3-3-stream.jpg',
        scenario: 'nodejs-stream',
        durationSeconds: 18,
        caption: { en: "Streams — the 348 MB experiment", vi: "Stream — thí nghiệm file 348 MB" },
      },
      type: 'VIDEO',
      description: 'Đo RAM khi đọc nguyên file so với đọc theo dòng chảy, backpressure, và pipeline.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Streams: the 348 MB experiment</h2>
<p class="lead">A stream processes data <strong>in pieces as it arrives</strong>, instead of loading everything into memory first. This is the difference between a service that handles a 2 GB upload on a small server and one that crashes. Let's measure it.</p>

<h3>The experiment: count lines in a 348 MB file</h3>
<p>Same task, two approaches. First, read the whole file into memory:</p>
<pre><code><span class="tok-keyword">const</span> mb = () =&gt; Math.<span class="tok-function">round</span>(process.<span class="tok-function">memoryUsage</span>().rss / <span class="tok-number">1024</span> / <span class="tok-number">1024</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'RAM before :'</span>, <span class="tok-function">mb</span>(), <span class="tok-string">'MB'</span>);

<span class="tok-keyword">const</span> data = fs.<span class="tok-function">readFileSync</span>(file);        <span class="tok-comment">// ENTIRE file into RAM</span>
<span class="tok-keyword">let</span> lines = <span class="tok-number">0</span>;
<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> ch <span class="tok-keyword">of</span> data) <span class="tok-keyword">if</span> (ch === <span class="tok-number">10</span>) lines++;
<span class="tok-function">console.log</span>(<span class="tok-string">'RAM after  :'</span>, <span class="tok-function">mb</span>(), <span class="tok-string">'MB'</span>);</code></pre>
<div class="out">RAM before : 37 MB
RAM after  : 395 MB
lines: 6000000 | time: 3662 ms</div>
<p>Now the same count with a stream, reading chunk by chunk:</p>
<pre><code>fs.<span class="tok-function">createReadStream</span>(file)
  .<span class="tok-function">on</span>(<span class="tok-string">'data'</span>, (chunk) =&gt; { <span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> ch <span class="tok-keyword">of</span> chunk) <span class="tok-keyword">if</span> (ch === <span class="tok-number">10</span>) lines++; })
  .<span class="tok-function">on</span>(<span class="tok-string">'end'</span>, () =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'peak RAM:'</span>, peak, <span class="tok-string">'MB'</span>));</code></pre>
<div class="out">RAM before  : 37 MB
peak RAM    : 120 MB
lines: 6000000 | time: 2544 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">readFileSync</span><span class="v">395 MB peak · 3662 ms</span></div>
  <div class="kv"><span class="k">createReadStream</span><span class="v">120 MB peak · 2544 ms</span></div>
  <div class="kv"><span class="k">Verdict</span><span class="v">The stream used a third of the memory AND finished faster — it starts working on the first chunk while the disk is still delivering the rest.</span></div>
</div>
<div class="callout danger">Now scale it up. Ten users uploading a 348 MB file at once: the buffered version needs ~3.5 GB of RAM and the container dies with an out-of-memory kill. The streaming version stays flat. And there is a hard ceiling anyway — a single Buffer cannot exceed roughly 2 GB, so <code>readFile</code> on a larger file throws no matter how much RAM you have.</div>

<h3>The four kinds of stream</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">R</div><div class="lz-t">Readable</div><div class="lz-d">source of data — file read, HTTP request</div></div>
  <div class="lz-step"><div class="lz-k">W</div><div class="lz-t">Writable</div><div class="lz-d">destination — file write, HTTP response</div></div>
  <div class="lz-step"><div class="lz-k">T</div><div class="lz-t">Transform</div><div class="lz-d">changes data passing through — gzip, encrypt</div></div>
  <div class="lz-step"><div class="lz-k">D</div><div class="lz-t">Duplex</div><div class="lz-d">readable AND writable — a TCP socket</div></div>
</div>

<h3>pipeline: connect them safely</h3>
<p>Compress the same 348 MB file — read, gzip and write, all streaming:</p>
<pre><code><span class="tok-keyword">import</span> { pipeline } <span class="tok-keyword">from</span> <span class="tok-string">'node:stream/promises'</span>;
<span class="tok-keyword">import</span> { createGzip } <span class="tok-keyword">from</span> <span class="tok-string">'node:zlib'</span>;

<span class="tok-keyword">await</span> <span class="tok-function">pipeline</span>(
  <span class="tok-function">createReadStream</span>(src),
  <span class="tok-function">createGzip</span>(),
  <span class="tok-function">createWriteStream</span>(src + <span class="tok-string">'.gz'</span>),
);</code></pre>
<div class="out">compressed in 1169 ms | peak RAM: 75 MB
original  : 348.0 MB
compressed:  15.0 MB</div>
<p>348 MB down to 15 MB, using 75 MB of memory. At no point did the whole file exist in RAM.</p>
<div class="callout ok">Always use <code>pipeline</code>, never <code>a.pipe(b).pipe(c)</code>. The old <code>.pipe()</code> does not forward errors and does not clean up: if the write fails halfway, the read stream stays open and you leak a file descriptor on every failure. <code>pipeline</code> destroys the whole chain properly and gives you one place to catch errors.</div>

<h3>Backpressure — the idea that makes streams work</h3>
<p>What if you read from a fast disk and write to a slow network? Without coordination, data piles up in memory until the process dies. Streams solve this automatically: when the destination's internal buffer is full, <code>write()</code> returns <code>false</code>, and the source <strong>pauses</strong> until the destination emits <code>drain</code>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Source reads fast</div><div class="lz-d">chunks flow into the destination</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Buffer fills up</div><div class="lz-d">write() returns false</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Source pauses</div><div class="lz-d">memory stops growing</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">'drain' fires</div><div class="lz-d">source resumes</div></div>
</div>
<div class="pitfall">You get backpressure for free with <code>pipeline</code>. You <strong>lose</strong> it the moment you write your own loop that ignores the return value of <code>write()</code> — a classic way to reintroduce the memory blow-up you used streams to avoid.</div>

<h3>Reading a huge file line by line</h3>
<pre><code><span class="tok-keyword">import</span> readline <span class="tok-keyword">from</span> <span class="tok-string">'node:readline'</span>;

<span class="tok-keyword">const</span> rl = readline.<span class="tok-function">createInterface</span>({
  input: <span class="tok-function">createReadStream</span>(<span class="tok-string">'big.log'</span>),
  crlfDelay: Infinity,
});
<span class="tok-keyword">for</span> <span class="tok-keyword">await</span> (<span class="tok-keyword">const</span> line <span class="tok-keyword">of</span> rl) {
  <span class="tok-keyword">if</span> (line.<span class="tok-function">includes</span>(<span class="tok-string">'ERROR'</span>)) <span class="tok-function">console.log</span>(line);
}</code></pre>
<div class="note-ct">This is why file downloads on this site stream from storage straight to the response instead of being read into a variable first. A 500 MB video served the buffered way would need 500 MB of RAM per concurrent viewer; streamed, it costs a small constant buffer regardless of file size — and the viewer starts watching immediately instead of waiting for a full download into server memory.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-319" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 319 — Core Modules and the npm Ecosystem</span><span class="lc-sub">10 exercises on fs, streams, buffers and events.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Stream: thí nghiệm với file 348 MB</h2>
<p class="lead">Stream xử lý dữ liệu <strong>theo từng khúc ngay khi nó tới</strong>, thay vì nạp hết vào bộ nhớ trước. Đây chính là khác biệt giữa một dịch vụ nhận nổi file 2 GB trên server nhỏ và một dịch vụ sập ngay. Ta đo thử.</p>

<h3>Thí nghiệm: đếm số dòng trong file 348 MB</h3>
<p>Cùng một việc, hai cách làm. Đầu tiên, đọc nguyên file vào bộ nhớ:</p>
<pre><code><span class="tok-keyword">const</span> mb = () =&gt; Math.<span class="tok-function">round</span>(process.<span class="tok-function">memoryUsage</span>().rss / <span class="tok-number">1024</span> / <span class="tok-number">1024</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'RAM trước :'</span>, <span class="tok-function">mb</span>(), <span class="tok-string">'MB'</span>);

<span class="tok-keyword">const</span> data = fs.<span class="tok-function">readFileSync</span>(file);        <span class="tok-comment">// nạp TOÀN BỘ file vào RAM</span>
<span class="tok-keyword">let</span> dong = <span class="tok-number">0</span>;
<span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> ch <span class="tok-keyword">of</span> data) <span class="tok-keyword">if</span> (ch === <span class="tok-number">10</span>) dong++;
<span class="tok-function">console.log</span>(<span class="tok-string">'RAM sau   :'</span>, <span class="tok-function">mb</span>(), <span class="tok-string">'MB'</span>);</code></pre>
<div class="out">RAM trước : 37 MB
RAM sau   : 395 MB
số dòng: 6000000 | thời gian: 3662 ms</div>
<p>Giờ vẫn phép đếm đó nhưng bằng stream, đọc theo từng khúc:</p>
<pre><code>fs.<span class="tok-function">createReadStream</span>(file)
  .<span class="tok-function">on</span>(<span class="tok-string">'data'</span>, (chunk) =&gt; { <span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> ch <span class="tok-keyword">of</span> chunk) <span class="tok-keyword">if</span> (ch === <span class="tok-number">10</span>) dong++; })
  .<span class="tok-function">on</span>(<span class="tok-string">'end'</span>, () =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'RAM đỉnh:'</span>, dinh, <span class="tok-string">'MB'</span>));</code></pre>
<div class="out">RAM trước   : 37 MB
RAM đỉnh    : 120 MB
số dòng: 6000000 | thời gian: 2544 ms</div>
<div class="kv-grid">
  <div class="kv"><span class="k">readFileSync</span><span class="v">đỉnh 395 MB · 3662 ms</span></div>
  <div class="kv"><span class="k">createReadStream</span><span class="v">đỉnh 120 MB · 2544 ms</span></div>
  <div class="kv"><span class="k">Kết luận</span><span class="v">Stream dùng một phần ba bộ nhớ VÀ còn xong sớm hơn — nó bắt tay xử lý khúc đầu tiên trong lúc ổ đĩa vẫn đang giao phần còn lại.</span></div>
</div>
<div class="callout danger">Giờ nhân quy mô lên. Mười người cùng upload file 348 MB một lúc: cách nạp-hết-vào-RAM cần khoảng 3,5 GB bộ nhớ và container bị hệ điều hành giết vì hết RAM. Cách stream thì vẫn phẳng lì. Mà dù sao cũng có một trần cứng — một Buffer đơn lẻ không vượt quá được khoảng 2 GB, nên <code>readFile</code> trên file lớn hơn sẽ ném lỗi bất kể máy bạn nhiều RAM cỡ nào.</div>

<h3>Bốn loại stream</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">R</div><div class="lz-t">Readable</div><div class="lz-d">nguồn dữ liệu — đọc file, request HTTP</div></div>
  <div class="lz-step"><div class="lz-k">W</div><div class="lz-t">Writable</div><div class="lz-d">đích đến — ghi file, response HTTP</div></div>
  <div class="lz-step"><div class="lz-k">T</div><div class="lz-t">Transform</div><div class="lz-d">biến đổi dữ liệu đi qua — nén, mã hoá</div></div>
  <div class="lz-step"><div class="lz-k">D</div><div class="lz-t">Duplex</div><div class="lz-d">vừa đọc VỪA ghi — một socket TCP</div></div>
</div>

<h3>pipeline: nối chúng lại một cách an toàn</h3>
<p>Nén chính file 348 MB đó — đọc, gzip và ghi, tất cả đều theo dòng chảy:</p>
<pre><code><span class="tok-keyword">import</span> { pipeline } <span class="tok-keyword">from</span> <span class="tok-string">'node:stream/promises'</span>;
<span class="tok-keyword">import</span> { createGzip } <span class="tok-keyword">from</span> <span class="tok-string">'node:zlib'</span>;

<span class="tok-keyword">await</span> <span class="tok-function">pipeline</span>(
  <span class="tok-function">createReadStream</span>(src),
  <span class="tok-function">createGzip</span>(),
  <span class="tok-function">createWriteStream</span>(src + <span class="tok-string">'.gz'</span>),
);</code></pre>
<div class="out">nén xong sau 1169 ms | RAM đỉnh: 75 MB
gốc : 348.0 MB
nén :  15.0 MB</div>
<p>Từ 348 MB xuống 15 MB, chỉ tốn 75 MB bộ nhớ. Không một khoảnh khắc nào cả file cùng nằm trong RAM.</p>
<div class="callout ok">Hãy luôn dùng <code>pipeline</code>, đừng dùng <code>a.pipe(b).pipe(c)</code>. Cái <code>.pipe()</code> cũ không truyền lỗi đi và không dọn dẹp: nếu việc ghi hỏng giữa chừng, stream đọc vẫn mở và bạn rò rỉ một file descriptor sau mỗi lần lỗi. <code>pipeline</code> huỷ đúng cách cả chuỗi và cho bạn một chỗ duy nhất để bắt lỗi.</div>

<h3>Backpressure — ý tưởng làm nên sức mạnh của stream</h3>
<p>Sẽ ra sao nếu bạn đọc từ ổ đĩa nhanh rồi ghi ra mạng chậm? Không có sự phối hợp thì dữ liệu chất đống trong bộ nhớ cho tới khi tiến trình chết. Stream giải quyết tự động: khi vùng đệm bên nhận đã đầy, <code>write()</code> trả về <code>false</code>, và bên nguồn <strong>tạm dừng</strong> cho tới khi bên nhận phát sự kiện <code>drain</code>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Nguồn đọc nhanh</div><div class="lz-d">các khúc chảy sang bên nhận</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Vùng đệm đầy</div><div class="lz-d">write() trả về false</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Nguồn tạm dừng</div><div class="lz-d">bộ nhớ ngừng phình ra</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">'drain' phát ra</div><div class="lz-d">nguồn chảy tiếp</div></div>
</div>
<div class="pitfall">Bạn được backpressure miễn phí khi dùng <code>pipeline</code>. Bạn <strong>mất</strong> nó ngay khi tự viết vòng lặp mà bỏ qua giá trị trả về của <code>write()</code> — một cách kinh điển để rước lại đúng cái hoạ nổ bộ nhớ mà bạn dùng stream để tránh.</div>

<h3>Đọc file khổng lồ theo từng dòng</h3>
<pre><code><span class="tok-keyword">import</span> readline <span class="tok-keyword">from</span> <span class="tok-string">'node:readline'</span>;

<span class="tok-keyword">const</span> rl = readline.<span class="tok-function">createInterface</span>({
  input: <span class="tok-function">createReadStream</span>(<span class="tok-string">'big.log'</span>),
  crlfDelay: Infinity,
});
<span class="tok-keyword">for</span> <span class="tok-keyword">await</span> (<span class="tok-keyword">const</span> line <span class="tok-keyword">of</span> rl) {
  <span class="tok-keyword">if</span> (line.<span class="tok-function">includes</span>(<span class="tok-string">'ERROR'</span>)) <span class="tok-function">console.log</span>(line);
}</code></pre>
<div class="note-ct">Đây là lý do việc tải file trên website này chảy thẳng từ kho lưu trữ ra response thay vì đọc vào một biến trước. Một video 500 MB phục vụ theo kiểu nạp-hết sẽ cần 500 MB RAM cho MỖI người xem cùng lúc; còn theo kiểu stream thì chỉ tốn một vùng đệm nhỏ cố định bất kể file lớn cỡ nào — và người xem bắt đầu xem được ngay thay vì đợi tải trọn vào bộ nhớ server.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-319" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 319 — Module lõi &amp; hệ sinh thái npm</span><span class="lc-sub">10 bài tập về fs, stream, buffer và event.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — EventEmitter|||3.4 — EventEmitter',
      slug: 'nodejs-3-4-eventemitter',
      type: 'VIDEO',
      description: 'Mẫu phát–nghe sự kiện nằm dưới toàn bộ Node, và cái bẫy rò rỉ bộ nhớ đi kèm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>EventEmitter</h2>
<p class="lead">Almost everything asynchronous in Node is an EventEmitter underneath: streams, HTTP servers, sockets, the process itself. It is the publish–subscribe pattern in its simplest possible form — one object emits named events, any number of listeners react.</p>

<h3>Emit and listen</h3>
<pre><code><span class="tok-keyword">const</span> { EventEmitter } = <span class="tok-function">require</span>(<span class="tok-string">'node:events'</span>);

<span class="tok-keyword">class</span> <span class="tok-type">NoteStore</span> <span class="tok-keyword">extends</span> <span class="tok-type">EventEmitter</span> {
  <span class="tok-function">save</span>(name) { <span class="tok-keyword">this</span>.<span class="tok-function">emit</span>(<span class="tok-string">'saved'</span>, { name }); }
}

<span class="tok-keyword">const</span> store = <span class="tok-keyword">new</span> <span class="tok-function">NoteStore</span>();
store.<span class="tok-function">on</span>(<span class="tok-string">'saved'</span>, (n) =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'  [log]    saved:'</span>, n.name));
store.<span class="tok-function">on</span>(<span class="tok-string">'saved'</span>, (n) =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'  [email]  notify about:'</span>, n.name));
store.<span class="tok-function">once</span>(<span class="tok-string">'saved'</span>, () =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'  [once]   only the first time'</span>));

store.<span class="tok-function">save</span>(<span class="tok-string">'note-1'</span>);
store.<span class="tok-function">save</span>(<span class="tok-string">'note-2'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'listeners on saved:'</span>, store.<span class="tok-function">listenerCount</span>(<span class="tok-string">'saved'</span>));</code></pre>
<div class="out">  [log]    saved: note-1
  [email]  notify about: note-1
  [once]   only the first time
  [log]    saved: note-2
  [email]  notify about: note-2
listeners on saved: 2</div>
<p>Three things worth noticing. Listeners run <strong>in registration order</strong>. <code>once</code> removed itself after firing — the count dropped from 3 to 2. And emitting is <strong>synchronous</strong>: <code>emit()</code> does not return until every listener has finished.</p>
<div class="pitfall"><code>emit</code> being synchronous surprises people. If one listener does slow work, the emitter waits — and so does the event loop. Also, if a listener throws, the exception propagates back to whoever called <code>emit()</code>, potentially crashing an unrelated part of your code.</div>

<h3>The 'error' event is special</h3>
<pre><code><span class="tok-comment">// An EventEmitter with NO 'error' listener THROWS when it emits one</span>
<span class="tok-keyword">const</span> e = <span class="tok-keyword">new</span> <span class="tok-function">EventEmitter</span>();
e.<span class="tok-function">emit</span>(<span class="tok-string">'error'</span>, <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'boom'</span>));   <span class="tok-comment">// → uncaught, process dies</span>

<span class="tok-comment">// Always attach one</span>
e.<span class="tok-function">on</span>(<span class="tok-string">'error'</span>, (err) =&gt; logger.<span class="tok-function">error</span>(err));</code></pre>
<p>This is why an unhandled stream or socket error can kill your server: streams are emitters, and an emitted <code>'error'</code> with no listener becomes an uncaught exception.</p>

<h3>The memory leak warning you will meet</h3>
<pre><code>(node:1234) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 11 saved listeners added to [NoteStore]. Use emitter.setMaxListeners()
to increase limit</code></pre>
<div class="callout warn">Node warns at 11 listeners on one event. This is almost never solved by raising the limit — it means you are <strong>adding listeners without removing them</strong>, typically inside a request handler or a React-style effect. Every request adds one more, memory grows, and eventually the process dies. The fix is <code>off()</code> / <code>once()</code>, not <code>setMaxListeners(100)</code>.</div>
<pre><code><span class="tok-comment">// register and clean up</span>
<span class="tok-keyword">const</span> onSaved = (n) =&gt; <span class="tok-function">handle</span>(n);
store.<span class="tok-function">on</span>(<span class="tok-string">'saved'</span>, onSaved);
<span class="tok-comment">// later, when the consumer goes away:</span>
store.<span class="tok-function">off</span>(<span class="tok-string">'saved'</span>, onSaved);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">on / off</span><span class="v">Add and remove a listener. Removal needs the SAME function reference — an inline arrow cannot be removed.</span></div>
  <div class="kv"><span class="k">once</span><span class="v">Auto-removes after the first emit. Use it for one-shot things like 'ready' or 'close'.</span></div>
  <div class="kv"><span class="k">emit</span><span class="v">Synchronous. Returns true if at least one listener was called.</span></div>
</div>
<div class="note-ct">The realtime layer of this site is built on emitters end to end: a Socket.IO connection is an emitter, and the chat service emits domain events like "message created" that both the socket layer and the notification layer subscribe to. That is the payoff of this pattern — the code that saves a message does not need to know who cares.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>EventEmitter</h2>
<p class="lead">Gần như mọi thứ bất đồng bộ trong Node đều là EventEmitter ở bên dưới: stream, server HTTP, socket, và cả bản thân tiến trình. Đây là mẫu phát–đăng ký ở dạng đơn giản nhất có thể — một đối tượng phát ra sự kiện có tên, bao nhiêu người nghe cũng được.</p>

<h3>Phát và nghe</h3>
<pre><code><span class="tok-keyword">const</span> { EventEmitter } = <span class="tok-function">require</span>(<span class="tok-string">'node:events'</span>);

<span class="tok-keyword">class</span> <span class="tok-type">KhoLuu</span> <span class="tok-keyword">extends</span> <span class="tok-type">EventEmitter</span> {
  <span class="tok-function">luu</span>(ten) { <span class="tok-keyword">this</span>.<span class="tok-function">emit</span>(<span class="tok-string">'daLuu'</span>, { ten }); }
}

<span class="tok-keyword">const</span> kho = <span class="tok-keyword">new</span> <span class="tok-function">KhoLuu</span>();
kho.<span class="tok-function">on</span>(<span class="tok-string">'daLuu'</span>, (n) =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'  [log]    đã lưu:'</span>, n.ten));
kho.<span class="tok-function">on</span>(<span class="tok-string">'daLuu'</span>, (n) =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'  [email]  gửi thông báo về:'</span>, n.ten));
kho.<span class="tok-function">once</span>(<span class="tok-string">'daLuu'</span>, () =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'  [once]   chỉ chạy lần đầu'</span>));

kho.<span class="tok-function">luu</span>(<span class="tok-string">'ghi-chu-1'</span>);
kho.<span class="tok-function">luu</span>(<span class="tok-string">'ghi-chu-2'</span>);
<span class="tok-function">console.log</span>(<span class="tok-string">'số listener của daLuu:'</span>, kho.<span class="tok-function">listenerCount</span>(<span class="tok-string">'daLuu'</span>));</code></pre>
<div class="out">  [log]    đã lưu: ghi-chu-1
  [email]  gửi thông báo về: ghi-chu-1
  [once]   chỉ chạy lần đầu
  [log]    đã lưu: ghi-chu-2
  [email]  gửi thông báo về: ghi-chu-2
số listener của daLuu: 2</div>
<p>Ba điều đáng để ý. Các listener chạy <strong>theo đúng thứ tự đăng ký</strong>. Cái <code>once</code> tự gỡ mình ra sau khi chạy — số đếm tụt từ 3 xuống 2. Và việc phát sự kiện là <strong>đồng bộ</strong>: <code>emit()</code> chưa trả về chừng nào mọi listener chưa chạy xong.</p>
<div class="pitfall">Chuyện <code>emit</code> chạy đồng bộ làm nhiều người bất ngờ. Nếu một listener làm việc chậm, bên phát phải chờ — và event loop cũng chờ theo. Ngoài ra, nếu một listener ném lỗi, ngoại lệ đó dội ngược về nơi đã gọi <code>emit()</code>, có thể làm sập một phần code chẳng liên quan gì.</div>

<h3>Sự kiện 'error' là trường hợp đặc biệt</h3>
<pre><code><span class="tok-comment">// Một EventEmitter KHÔNG có listener 'error' sẽ NÉM khi phát sự kiện đó</span>
<span class="tok-keyword">const</span> e = <span class="tok-keyword">new</span> <span class="tok-function">EventEmitter</span>();
e.<span class="tok-function">emit</span>(<span class="tok-string">'error'</span>, <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'nổ'</span>));   <span class="tok-comment">// → không ai bắt, tiến trình chết</span>

<span class="tok-comment">// Luôn gắn một cái</span>
e.<span class="tok-function">on</span>(<span class="tok-string">'error'</span>, (err) =&gt; logger.<span class="tok-function">error</span>(err));</code></pre>
<p>Đây là lý do một lỗi stream hay lỗi socket không được xử lý có thể giết server của bạn: stream chính là emitter, và một sự kiện <code>'error'</code> phát ra mà không có ai nghe sẽ trở thành ngoại lệ không được bắt.</p>

<h3>Cảnh báo rò rỉ bộ nhớ mà bạn sẽ gặp</h3>
<pre><code>(node:1234) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 11 daLuu listeners added to [KhoLuu]. Use emitter.setMaxListeners()
to increase limit</code></pre>
<div class="callout warn">Node cảnh báo khi một sự kiện có 11 listener. Chuyện này gần như không bao giờ được giải quyết bằng cách nâng giới hạn lên — nó có nghĩa bạn đang <strong>thêm listener mà không gỡ ra</strong>, thường là bên trong một request handler. Mỗi request lại thêm một cái, bộ nhớ phình dần, và cuối cùng tiến trình chết. Cách sửa là <code>off()</code> / <code>once()</code>, chứ không phải <code>setMaxListeners(100)</code>.</div>
<pre><code><span class="tok-comment">// đăng ký rồi dọn dẹp</span>
<span class="tok-keyword">const</span> khiLuu = (n) =&gt; <span class="tok-function">xuLy</span>(n);
kho.<span class="tok-function">on</span>(<span class="tok-string">'daLuu'</span>, khiLuu);
<span class="tok-comment">// về sau, khi bên tiêu thụ không cần nữa:</span>
kho.<span class="tok-function">off</span>(<span class="tok-string">'daLuu'</span>, khiLuu);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">on / off</span><span class="v">Thêm và gỡ listener. Muốn gỡ phải có ĐÚNG tham chiếu hàm đó — một arrow viết thẳng tại chỗ thì không gỡ được.</span></div>
  <div class="kv"><span class="k">once</span><span class="v">Tự gỡ sau lần phát đầu tiên. Dùng cho những việc một-lần như 'ready' hay 'close'.</span></div>
  <div class="kv"><span class="k">emit</span><span class="v">Chạy đồng bộ. Trả về true nếu có ít nhất một listener được gọi.</span></div>
</div>
<div class="note-ct">Tầng realtime của website này được dựng trên emitter từ đầu tới cuối: một kết nối Socket.IO chính là emitter, và dịch vụ chat phát ra các sự kiện nghiệp vụ kiểu "vừa tạo tin nhắn" để cả tầng socket lẫn tầng thông báo cùng đăng ký nghe. Đó chính là phần thưởng của mẫu này — đoạn code lưu tin nhắn không cần biết ai đang quan tâm tới nó.</div>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — An HTTP server with no framework|||3.5 — Server HTTP không dùng framework',
      slug: 'nodejs-3-5-http-server',
      type: 'VIDEO',
      description: 'Tự tay dựng API bằng module http để hiểu Express thật ra đã làm giúp bạn những gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>An HTTP server with no framework</h2>
<p class="lead">Before we reach for Express in chapter 5, build one API by hand. Twenty minutes here will teach you more about what Express does than a week of using it — because you will feel every problem it solves.</p>

<h3>The whole server</h3>
<pre><code><span class="tok-keyword">import</span> { createServer } <span class="tok-keyword">from</span> <span class="tok-string">'node:http'</span>;

<span class="tok-keyword">const</span> notes = [{ id: <span class="tok-number">1</span>, title: <span class="tok-string">'First note'</span> }];

<span class="tok-keyword">const</span> server = <span class="tok-function">createServer</span>((req, res) =&gt; {
  <span class="tok-keyword">const</span> url = <span class="tok-keyword">new</span> <span class="tok-function">URL</span>(req.url, <span class="tok-string">'http://'</span> + req.headers.host);

  <span class="tok-keyword">if</span> (req.method === <span class="tok-string">'GET'</span> &amp;&amp; url.pathname === <span class="tok-string">'/notes'</span>) {
    res.<span class="tok-function">writeHead</span>(<span class="tok-number">200</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json; charset=utf-8'</span> });
    <span class="tok-keyword">return</span> res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>(notes));
  }

  <span class="tok-keyword">if</span> (req.method === <span class="tok-string">'POST'</span> &amp;&amp; url.pathname === <span class="tok-string">'/notes'</span>) {
    <span class="tok-keyword">let</span> body = <span class="tok-string">''</span>;                          <span class="tok-comment">// the body arrives in CHUNKS</span>
    req.<span class="tok-function">on</span>(<span class="tok-string">'data'</span>, (c) =&gt; { body += c; });
    req.<span class="tok-function">on</span>(<span class="tok-string">'end'</span>, () =&gt; {
      <span class="tok-keyword">const</span> note = { id: notes.length + <span class="tok-number">1</span>, ...JSON.<span class="tok-function">parse</span>(body) };
      notes.<span class="tok-function">push</span>(note);
      res.<span class="tok-function">writeHead</span>(<span class="tok-number">201</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json; charset=utf-8'</span> });
      res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>(note));
    });
    <span class="tok-keyword">return</span>;
  }

  res.<span class="tok-function">writeHead</span>(<span class="tok-number">404</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span> });
  res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>({ error: <span class="tok-string">'Not Found'</span> }));
});

server.<span class="tok-function">listen</span>(<span class="tok-number">3123</span>, () =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'http://localhost:3123'</span>));</code></pre>
<p>Run it, then call it:</p>
<pre><code>curl -i http://localhost:3123/notes
curl -i -X POST http://localhost:3123/notes -d <span class="tok-string">'{"title":"Second note"}'</span>
curl http://localhost:3123/notes</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Connection: keep-alive

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

[{"id":1,"title":"First note"},{"id":2,"title":"Second note"}]</div>
<p>That is a working REST API in about 25 lines, with no dependencies at all.</p>

<h3>Notice what was painful</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The body arrives in chunks</span><span class="v">You had to collect <code>data</code> events yourself. <code>req</code> is a readable stream — exactly what lesson 3.3 described.</span></div>
  <div class="kv"><span class="k">Routing is manual</span><span class="v">Every route is an if. Add ten endpoints with URL parameters like <code>/notes/:id</code> and this becomes unreadable.</span></div>
  <div class="kv"><span class="k">No error safety</span><span class="v">A malformed JSON body makes <code>JSON.parse</code> throw inside a callback — and chapter 1 showed that kills the process.</span></div>
  <div class="kv"><span class="k">Repetition everywhere</span><span class="v">You write the same headers and <code>JSON.stringify</code> in every branch.</span></div>
</div>
<div class="callout ok">Those four annoyances are, almost exactly, the four things Express gives you: body parsing, a router with parameters, an error-handling layer, and helpers like <code>res.json()</code>. Knowing this, Express will feel like an obvious convenience rather than magic.</div>

<h3>Streaming a response</h3>
<pre><code><span class="tok-comment">// serve a large file WITHOUT loading it into memory</span>
<span class="tok-keyword">import</span> { pipeline } <span class="tok-keyword">from</span> <span class="tok-string">'node:stream/promises'</span>;

<span class="tok-keyword">if</span> (url.pathname === <span class="tok-string">'/download'</span>) {
  res.<span class="tok-function">writeHead</span>(<span class="tok-number">200</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/octet-stream'</span> });
  <span class="tok-keyword">await</span> <span class="tok-function">pipeline</span>(<span class="tok-function">createReadStream</span>(<span class="tok-string">'big.zip'</span>), res);   <span class="tok-comment">// res IS a writable stream</span>
}</code></pre>
<p><code>res</code> is a writable stream and <code>req</code> is a readable one. Once that clicks, uploads, downloads and proxies all become the same idea.</p>
<div class="pitfall">Every response must end <strong>exactly once</strong>. Forget <code>res.end()</code> and the client hangs until it times out; call it twice and you get <code>ERR_STREAM_WRITE_AFTER_END</code>. The classic cause is forgetting <code>return</code> after sending a response — execution continues and sends a second one.</div>
<div class="note-ct">Express is a thin layer over exactly this API. That is why you can always drop down to <code>req</code>/<code>res</code> inside an Express handler when you need something the framework does not wrap — as this site does for streaming media with HTTP Range support.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Express.js Core Concepts</span><span class="lc-sub">Ready for chapter 5 — 10 exercises on routing and middleware.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Server HTTP không dùng framework</h2>
<p class="lead">Trước khi với tay lấy Express ở chương 5, hãy tự tay dựng một API. Hai mươi phút ở đây dạy bạn về Express nhiều hơn cả một tuần dùng nó — vì bạn sẽ tự cảm nhận từng vấn đề mà nó giải quyết.</p>

<h3>Toàn bộ server</h3>
<pre><code><span class="tok-keyword">import</span> { createServer } <span class="tok-keyword">from</span> <span class="tok-string">'node:http'</span>;

<span class="tok-keyword">const</span> notes = [{ id: <span class="tok-number">1</span>, title: <span class="tok-string">'Ghi chú đầu tiên'</span> }];

<span class="tok-keyword">const</span> server = <span class="tok-function">createServer</span>((req, res) =&gt; {
  <span class="tok-keyword">const</span> url = <span class="tok-keyword">new</span> <span class="tok-function">URL</span>(req.url, <span class="tok-string">'http://'</span> + req.headers.host);

  <span class="tok-keyword">if</span> (req.method === <span class="tok-string">'GET'</span> &amp;&amp; url.pathname === <span class="tok-string">'/notes'</span>) {
    res.<span class="tok-function">writeHead</span>(<span class="tok-number">200</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json; charset=utf-8'</span> });
    <span class="tok-keyword">return</span> res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>(notes));
  }

  <span class="tok-keyword">if</span> (req.method === <span class="tok-string">'POST'</span> &amp;&amp; url.pathname === <span class="tok-string">'/notes'</span>) {
    <span class="tok-keyword">let</span> body = <span class="tok-string">''</span>;                          <span class="tok-comment">// body về theo TỪNG KHÚC</span>
    req.<span class="tok-function">on</span>(<span class="tok-string">'data'</span>, (c) =&gt; { body += c; });
    req.<span class="tok-function">on</span>(<span class="tok-string">'end'</span>, () =&gt; {
      <span class="tok-keyword">const</span> note = { id: notes.length + <span class="tok-number">1</span>, ...JSON.<span class="tok-function">parse</span>(body) };
      notes.<span class="tok-function">push</span>(note);
      res.<span class="tok-function">writeHead</span>(<span class="tok-number">201</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json; charset=utf-8'</span> });
      res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>(note));
    });
    <span class="tok-keyword">return</span>;
  }

  res.<span class="tok-function">writeHead</span>(<span class="tok-number">404</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span> });
  res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>({ error: <span class="tok-string">'Not Found'</span> }));
});

server.<span class="tok-function">listen</span>(<span class="tok-number">3123</span>, () =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'http://localhost:3123'</span>));</code></pre>
<p>Chạy nó lên, rồi gọi vào:</p>
<pre><code>curl -i http://localhost:3123/notes
curl -i -X POST http://localhost:3123/notes -d <span class="tok-string">'{"title":"Ghi chú thứ hai"}'</span>
curl http://localhost:3123/notes</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Connection: keep-alive

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

[{"id":1,"title":"Ghi chú đầu tiên"},{"id":2,"title":"Ghi chú thứ hai"}]</div>
<p>Đó là một REST API chạy được trong khoảng 25 dòng, hoàn toàn không phụ thuộc gói nào.</p>

<h3>Hãy để ý những chỗ vừa nãy làm bạn khổ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Body về theo từng khúc</span><span class="v">Bạn phải tự gom các sự kiện <code>data</code>. <code>req</code> chính là một stream đọc — đúng thứ bài 3.3 mô tả.</span></div>
  <div class="kv"><span class="k">Định tuyến làm bằng tay</span><span class="v">Mỗi route là một câu if. Thêm mười endpoint có tham số kiểu <code>/notes/:id</code> là đoạn này không đọc nổi nữa.</span></div>
  <div class="kv"><span class="k">Không có lưới an toàn cho lỗi</span><span class="v">Một body JSON méo mó làm <code>JSON.parse</code> ném lỗi ngay trong callback — và chương 1 đã cho thấy điều đó giết tiến trình.</span></div>
  <div class="kv"><span class="k">Lặp lại khắp nơi</span><span class="v">Bạn viết đi viết lại đúng mấy dòng header và <code>JSON.stringify</code> ở mọi nhánh.</span></div>
</div>
<div class="callout ok">Bốn nỗi khổ đó, gần như chính xác, là bốn thứ Express đưa cho bạn: phân tích body, một bộ định tuyến có tham số, một tầng xử lý lỗi, và các hàm tiện ích như <code>res.json()</code>. Biết điều này rồi, Express sẽ giống một tiện nghi hiển nhiên chứ không còn là phép thuật.</div>

<h3>Trả phản hồi theo dòng chảy</h3>
<pre><code><span class="tok-comment">// phục vụ file lớn mà KHÔNG nạp vào bộ nhớ</span>
<span class="tok-keyword">import</span> { pipeline } <span class="tok-keyword">from</span> <span class="tok-string">'node:stream/promises'</span>;

<span class="tok-keyword">if</span> (url.pathname === <span class="tok-string">'/download'</span>) {
  res.<span class="tok-function">writeHead</span>(<span class="tok-number">200</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/octet-stream'</span> });
  <span class="tok-keyword">await</span> <span class="tok-function">pipeline</span>(<span class="tok-function">createReadStream</span>(<span class="tok-string">'big.zip'</span>), res);   <span class="tok-comment">// res CHÍNH LÀ stream ghi</span>
}</code></pre>
<p><code>res</code> là một stream ghi còn <code>req</code> là một stream đọc. Khi điều đó vỡ ra trong đầu, thì upload, download và proxy đều trở thành cùng một ý tưởng.</p>
<div class="pitfall">Mỗi phản hồi phải kết thúc <strong>đúng một lần</strong>. Quên <code>res.end()</code> thì client treo cho tới lúc hết giờ chờ; gọi hai lần thì nhận <code>ERR_STREAM_WRITE_AFTER_END</code>. Nguyên nhân kinh điển là quên <code>return</code> sau khi đã gửi phản hồi — code chạy tiếp và gửi thêm cái thứ hai.</div>
<div class="note-ct">Express là một lớp mỏng phủ lên đúng cái API này. Đó là lý do bạn luôn có thể tụt xuống dùng thẳng <code>req</code>/<code>res</code> bên trong một handler Express khi cần thứ mà framework không bọc sẵn — như website này vẫn làm khi truyền media có hỗ trợ HTTP Range.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Các khái niệm lõi của Express</span><span class="lc-sub">Chuẩn bị cho chương 5 — 10 bài tập về định tuyến và middleware.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.6 QUIZ ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra chương 3',
      slug: 'nodejs-3-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về path, fs, Buffer, stream, EventEmitter và http.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">These modules are the raw material of every Node backend. If you can answer all eight without looking, you can read most library source code — because libraries are built from exactly these pieces.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mấy module này là vật liệu thô của mọi backend Node. Nếu trả lời được cả tám câu mà không cần nhìn lại, bạn đã đọc được phần lớn mã nguồn thư viện — vì thư viện cũng được ghép từ đúng những mảnh này.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why use path.join() instead of concatenating strings with "/"?|||Vì sao nên dùng path.join() thay vì nối chuỗi bằng dấu "/"?',
            options: [
              'It is faster|||Vì nó chạy nhanh hơn',
              'It handles separators, collapses "//" and resolves ".." correctly|||Vì nó xử lý dấu phân cách, gộp "//" và giải quyết ".." cho đúng',
              'It encrypts the path|||Vì nó mã hoá đường dẫn',
              'It creates the directory automatically|||Vì nó tự tạo thư mục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When is fs.readFileSync acceptable in a server?|||Khi nào dùng fs.readFileSync trong server là chấp nhận được?',
            options: [
              'Anywhere — it is simpler to read|||Ở đâu cũng được — code dễ đọc hơn',
              'Inside route handlers, for small files|||Trong route handler, với file nhỏ',
              'Only at startup, before the server starts listening|||Chỉ lúc khởi động, trước khi server bắt đầu lắng nghe',
              'Never, under any circumstances|||Không bao giờ, trong mọi hoàn cảnh',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'The string "Xin chào" is 8 characters. How many bytes in UTF-8?|||Chuỗi "Xin chào" có 8 ký tự. Trong UTF-8 nó chiếm bao nhiêu byte?',
            options: ['8', '9', '16', 'Tuỳ hệ điều hành|||Depends on the operating system'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Reading a 348 MB file: readFileSync peaked at 395 MB RAM. What did createReadStream peak at?|||Đọc file 348 MB: readFileSync đạt đỉnh 395 MB RAM. Còn createReadStream đạt đỉnh bao nhiêu?',
            options: [
              '120 MB — and it also finished faster|||120 MB — và còn xong sớm hơn',
              'Also 395 MB — same data, same memory|||Cũng 395 MB — cùng dữ liệu thì cùng bộ nhớ',
              '700 MB — streams use more memory|||700 MB — stream tốn bộ nhớ hơn',
              '0 MB — streams use no memory at all|||0 MB — stream không tốn bộ nhớ nào',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why prefer pipeline() over a.pipe(b).pipe(c)?|||Vì sao nên dùng pipeline() thay cho a.pipe(b).pipe(c)?',
            options: [
              'pipeline is shorter to type|||pipeline gõ ngắn hơn',
              'pipe() does not forward errors or clean up, leaking file descriptors|||pipe() không truyền lỗi và không dọn dẹp, gây rò rỉ file descriptor',
              'pipe() only works with files|||pipe() chỉ chạy được với file',
              'There is no difference|||Không có khác biệt gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is backpressure?|||Backpressure là gì?',
            options: [
              'An error when a stream closes early|||Một lỗi khi stream đóng sớm',
              'The source pausing when the destination buffer is full|||Việc bên nguồn tạm dừng khi vùng đệm bên nhận đã đầy',
              'Compressing data before writing it|||Việc nén dữ liệu trước khi ghi',
              'Retrying a failed write|||Việc thử ghi lại khi ghi hỏng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An EventEmitter emits "error" with no listener attached. What happens?|||Một EventEmitter phát sự kiện "error" mà không có listener nào. Chuyện gì xảy ra?',
            options: [
              'Nothing — the event is ignored|||Không gì cả — sự kiện bị bỏ qua',
              'It logs a warning and continues|||Nó ghi một cảnh báo rồi chạy tiếp',
              'It throws as an uncaught exception and can kill the process|||Nó ném ra ngoại lệ không được bắt và có thể giết tiến trình',
              'It retries the emit later|||Nó thử phát lại sau',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'In a raw http server, why must you collect req "data" events?|||Trong server http thuần, vì sao phải gom các sự kiện "data" của req?',
            options: [
              'Because req is a readable stream — the body arrives in chunks|||Vì req là một stream đọc — body về theo từng khúc',
              'Because Node encrypts the body|||Vì Node mã hoá body',
              'Because the body is always empty otherwise|||Vì nếu không thì body luôn rỗng',
              'You do not — req.body exists by default|||Không cần — req.body có sẵn mặc định',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
