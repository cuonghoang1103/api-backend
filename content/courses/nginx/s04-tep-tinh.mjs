const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 4 — Static files: from URI to bytes|||Chương 4 — Tệp tĩnh: từ URI tới byte',
  description: 'Phục vụ một tệp là việc Nginx làm giỏi nhất, và nó cũng là chỗ có nhiều thứ ngầm nhất: kiểu nội dung tới từ đâu, ai sinh ra ETag và nó được dựng từ cái gì, vì sao một lần deploy làm mọi trình duyệt tải lại toàn bộ tài nguyên đã nằm sẵn trong bộ đệm của họ.',
  lessons: [

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — From URI to bytes, and where the content type comes from|||4.1 — Từ URI tới byte, và kiểu nội dung tới từ đâu',
      slug: 'nginx-4-1-tu-uri-toi-byte',
      type: 'LESSON',
      description: 'Năm tệp, năm phần đuôi khác nhau, và một bảng cho thấy Content-Type được quyết định thế nào — cùng ba hành vi của một thư mục mà kết quả là 403 chứ không phải 404 như phần lớn mọi người đoán.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>From URI to bytes, and where the content type comes from</h2>
<p class="lead">Serving a file is the thing Nginx is best at, and it is also where the most happens without being written down. Chapter 2 got you as far as a filesystem path. This lesson covers everything between that path and the response, all of it measured on a running server.</p>

<h3>What comes back by default</h3>
<div class="out">$ curl -I http://127.0.0.1:8093/trang.html

HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: text/html
Content-Length: 27026
Last-Modified: Sun, 23 Aug 2026 17:02:43 GMT
ETag: "6a8b27b3-6992"
Accept-Ranges: bytes</div>
<p>Four of those you did not ask for. <code>Content-Type</code> came from a lookup table, <code>Last-Modified</code> and <code>ETag</code> from the file's metadata, and <code>Accept-Ranges</code> is Nginx advertising that it can serve part of the file. Each is a decision you can change, and each has a failure mode attached.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The path is resolved (Chapter 2)</span><span class="lz-d"><code>root</code> or <code>alias</code> turns <code>\$uri</code> into a path. If it names a directory, <code>index</code> runs and performs an internal redirect — Lesson 2.5, arriving here for real.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The extension is looked up in mime.types</span><span class="lz-d">A plain table shipped with Nginx, included from <code>nginx.conf</code>. No sniffing, no reading the file: the extension alone decides. An unknown or absent extension falls to <code>default_type</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Validators are computed from the inode</span><span class="lz-d"><code>Last-Modified</code> is the mtime; <code>ETag</code> is built from the mtime and the size. Neither one reads the contents, which is fast and has a consequence measured in Lesson 4.2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The bytes are sent, possibly partially</span><span class="lz-d">With <code>Accept-Ranges: bytes</code> advertised, a client may ask for a slice and get <code>206 Partial Content</code>. That is what makes video seeking and resumable downloads work at all.</span></div>
</div>

<h3>Content-Type, measured across five files</h3>
<div class="out">trang.html     -> text/html
nho.txt        -> text/plain
lon.bin        -> application/octet-stream
khong-duoi     -> application/octet-stream    &lt;- KHONG co phan duoi
la.xyz123      -> application/octet-stream    &lt;- duoi la, khong co trong bang

$ curl -I -H 'Range: bytes=0-99' .../lon.bin
HTTP/1.1 206 Partial Content
Content-Length: 100
Content-Range: bytes 0-99/2000000</div>
<div class="pitfall">
<p><strong>Bẫy — <code>default_type</code> defaults to <code>text/plain</code>, and that is the wrong default for a file server.</strong> If your <code>http</code> block does not set it, an unknown extension is announced as text, and a browser will happily render a downloaded file as a page. Serve user-uploaded content that way and an uploaded <code>.svg</code> or an extension you forgot becomes stored XSS: the browser renders attacker markup on your origin. Two things together fix it — <code>default_type application/octet-stream;</code> so unknown types download rather than render, and <code>add_header X-Content-Type-Options "nosniff" always;</code> so the browser does not second-guess you. Both are one line, and for a route that serves uploads they are not optional.</p>
</div>

<h3>A directory, three ways</h3>
<div class="out">=== autoindex on ===
&lt;h1&gt;Index of /liet-ke/&lt;/h1&gt;&lt;hr&gt;&lt;pre&gt;&lt;a href="../"&gt;../&lt;/a&gt;
&lt;a href="a.txt"&gt;a.txt&lt;/a&gt;    23-Aug-2026 17:03    2
&lt;a href="b.txt"&gt;b.txt&lt;/a&gt;    23-Aug-2026 17:03    2

=== autoindex_format json ===
[
{ "name":"a.txt", "type":"file", "mtime":"Sun, 23 Aug 2026 17:03:36 GMT", "size":2 },
{ "name":"b.txt", "type":"file", "mtime":"Sun, 23 Aug 2026 17:03:36 GMT", "size":2 }
]

=== KHONG autoindex, thu muc KHONG co index.html ===
403                                       &lt;- 403, khong phai 404</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A directory with no index is 403, not 404</span><span class="v">The path exists and Nginx refuses to describe it, which is a different statement from "not found" — and it leaks that the directory exists. If you would rather not say even that, <code>error_page 403 =404 /404.html;</code> makes the two indistinguishable from outside.</span></div>
  <div class="kv"><span class="k">autoindex is off for good reason</span><span class="v">It lists every filename in the directory, including the backup someone left, the <code>.env.bak</code>, the export from last year. Turn it on deliberately for a directory you curate, never at the top of a config "so we can browse".</span></div>
  <div class="kv"><span class="k">autoindex_format json makes it an API</span><span class="v">Genuinely useful for an internal file drop or a release directory a script consumes — a listing endpoint with no code behind it. The same caution applies: it lists exactly what is there.</span></div>
  <div class="kv"><span class="k">index takes a list, and order matters</span><span class="v"><code>index index.html index.htm;</code> tries each in turn. Adding a dynamic entry — <code>index index.html index.php;</code> — is how a directory request ends up in an interpreter, so the list should be as short as the site actually needs.</span></div>
</div>

<h3>Range requests, and what they buy</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Seeking in audio and video</span><span class="lz-lnote">A browser scrubbing a video sends <code>Range</code> for the segment it needs. Without <code>Accept-Ranges</code> the player must download from the start every time, which for a 200MB file is the difference between instant and unusable.</span></div>
  <div class="lz-layer"><span class="lz-lname">Resumable downloads</span><span class="lz-lnote">A client that lost its connection asks for <code>bytes=</code> from where it stopped. This is free with static files and something you would have to implement by hand behind a proxy.</span></div>
  <div class="lz-layer"><span class="lz-lname">It is on by default, and rarely worth turning off</span><span class="lz-lnote"><code>max_ranges 0;</code> disables it. The one real reason is a pathological client sending hundreds of tiny ranges in one request to amplify work — <code>max_ranges 1;</code> keeps seeking while removing that.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ranges and compression do not mix</span><span class="lz-lnote">A gzipped response has no stable mapping from byte offsets to original content, so Nginx does not serve ranges from on-the-fly compression. It is one more reason large media is served uncompressed — it is already compressed anyway.</span></div>
</div>
<div class="note-ct">
<p><strong>What to check on a new static route.</strong> Request one file of each kind you serve and read the four headers: is <code>Content-Type</code> right, is there an <code>ETag</code>, is <code>Accept-Ranges</code> present, and is <code>Cache-Control</code> what you intended? It takes one <code>curl -I</code> per file type, and it catches the misconfigurations in this lesson before a browser does something surprising with them.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#types" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">nginx — types and default_type</span><span class="lc-sub">nginx.org · How the extension table is consulted, and the fallback</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_autoindex_module.html" target="_blank" rel="noopener"><span class="lc-ico">📂</span><span class="lc-body"><span class="lc-title">nginx — the autoindex module</span><span class="lc-sub">nginx.org · Including autoindex_format and the exact JSON shape</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests" target="_blank" rel="noopener"><span class="lc-ico">🎬</span><span class="lc-body"><span class="lc-title">MDN — HTTP range requests</span><span class="lc-sub">developer.mozilla.org · 206, Content-Range, and what a video player sends</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">MIME types, content sniffing, and why nosniff exists</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Serve a file with no extension, watch a browser render it, then fix it with two lines</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Từ URI tới byte, và kiểu nội dung tới từ đâu</h2>
<p class="lead">Phục vụ một tệp là việc Nginx giỏi nhất, và nó cũng là chỗ nhiều thứ xảy ra nhất mà chẳng được viết ra ở đâu. Chương 2 đưa bạn tới được một đường dẫn hệ tệp. Bài này lo mọi thứ nằm giữa cái đường dẫn đó và cái phản hồi, tất cả đều đo trên một máy chủ đang chạy.</p>

<h3>Mặc định thì có gì quay ra</h3>
<div class="out">$ curl -I http://127.0.0.1:8093/trang.html

HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: text/html
Content-Length: 27026
Last-Modified: Sun, 23 Aug 2026 17:02:43 GMT
ETag: "6a8b27b3-6992"
Accept-Ranges: bytes</div>
<p>Bốn cái trong số đó bạn không hề xin. <code>Content-Type</code> tới từ một bảng tra, <code>Last-Modified</code> và <code>ETag</code> tới từ siêu dữ liệu của tệp, còn <code>Accept-Ranges</code> là Nginx đang quảng cáo rằng nó phục vụ được MỘT PHẦN tệp. Mỗi cái là một quyết định bạn đổi được, và mỗi cái đều kèm theo một kiểu hỏng.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đường dẫn được giải ra (Chương 2)</span><span class="lz-d"><code>root</code> hoặc <code>alias</code> biến <code>\$uri</code> thành một đường dẫn. Nếu nó trỏ vào một THƯ MỤC thì <code>index</code> chạy và thực hiện một cú chuyển hướng nội bộ — Bài 2.5, giờ ập tới đây một cách thật sự.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Phần đuôi được TRA trong mime.types</span><span class="lz-d">Một cái bảng trơn đi kèm Nginx, được include từ <code>nginx.conf</code>. Không đánh hơi gì, không đọc tệp: chỉ mỗi PHẦN ĐUÔI quyết định. Đuôi lạ hoặc không có đuôi thì rơi về <code>default_type</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bộ xác thực được tính từ INODE</span><span class="lz-d"><code>Last-Modified</code> là mtime; <code>ETag</code> được dựng từ mtime và kích thước. Không cái nào ĐỌC nội dung cả, việc đó nhanh và nó kéo theo một hệ quả được đo ở Bài 4.2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Byte được gửi đi, và có thể chỉ MỘT PHẦN</span><span class="lz-d">Đã quảng cáo <code>Accept-Ranges: bytes</code> thì client được phép xin một lát và nhận <code>206 Partial Content</code>. Đó là thứ làm cho việc tua video và việc tải tiếp chạy được.</span></div>
</div>

<h3>Content-Type, đo trên năm tệp</h3>
<div class="out">trang.html     -> text/html
nho.txt        -> text/plain
lon.bin        -> application/octet-stream
khong-duoi     -> application/octet-stream    &lt;- KHONG co phan duoi
la.xyz123      -> application/octet-stream    &lt;- duoi la, khong co trong bang

$ curl -I -H 'Range: bytes=0-99' .../lon.bin
HTTP/1.1 206 Partial Content
Content-Length: 100
Content-Range: bytes 0-99/2000000</div>
<div class="pitfall">
<p><strong>Bẫy — <code>default_type</code> mặc định là <code>text/plain</code>, và đó là mặc định SAI cho một máy chủ tệp.</strong> Nếu khối <code>http</code> của bạn không đặt nó thì một phần đuôi lạ sẽ được công bố là VĂN BẢN, và trình duyệt sẽ vui vẻ dựng cái tệp vừa tải thành một trang web. Đem cách đó phục vụ nội dung do người dùng tải lên là một cái <code>.svg</code> hay một phần đuôi bạn quên trở thành XSS lưu trữ: trình duyệt dựng đánh dấu của kẻ tấn công ngay trên gốc của bạn. Hai thứ đi cùng nhau chữa được — <code>default_type application/octet-stream;</code> để kiểu lạ thì TẢI VỀ chứ không dựng ra, và <code>add_header X-Content-Type-Options "nosniff" always;</code> để trình duyệt đừng đoán lại thay bạn. Cả hai đều một dòng, và với một tuyến phục vụ tệp tải lên thì chúng KHÔNG phải tuỳ chọn.</p>
</div>

<h3>Một thư mục, ba kiểu</h3>
<div class="out">=== autoindex on ===
&lt;h1&gt;Index of /liet-ke/&lt;/h1&gt;&lt;hr&gt;&lt;pre&gt;&lt;a href="../"&gt;../&lt;/a&gt;
&lt;a href="a.txt"&gt;a.txt&lt;/a&gt;    23-Aug-2026 17:03    2
&lt;a href="b.txt"&gt;b.txt&lt;/a&gt;    23-Aug-2026 17:03    2

=== autoindex_format json ===
[
{ "name":"a.txt", "type":"file", "mtime":"Sun, 23 Aug 2026 17:03:36 GMT", "size":2 },
{ "name":"b.txt", "type":"file", "mtime":"Sun, 23 Aug 2026 17:03:36 GMT", "size":2 }
]

=== KHONG autoindex, thu muc KHONG co index.html ===
403                                       &lt;- 403, khong phai 404</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Thư mục không có index thì là 403, KHÔNG phải 404</span><span class="v">Đường dẫn TỒN TẠI và Nginx từ chối mô tả nó, đó là một lời khẳng định khác hẳn "không tìm thấy" — và nó LỘ ra rằng thư mục đó có thật. Nếu bạn không muốn nói cả điều đó thì <code>error_page 403 =404 /404.html;</code> làm hai ca ấy không phân biệt được từ bên ngoài.</span></div>
  <div class="kv"><span class="k">autoindex mặc định TẮT là có lý do</span><span class="v">Nó liệt kê MỌI tên tệp trong thư mục, kể cả bản sao lưu ai đó bỏ quên, cái <code>.env.bak</code>, cái bản xuất từ năm ngoái. Hãy bật nó một cách CÓ CHỦ Ý cho một thư mục bạn tự tay chăm, đừng bao giờ bật ở đầu cấu hình "để bọn mình duyệt cho tiện".</span></div>
  <div class="kv"><span class="k">autoindex_format json biến nó thành một API</span><span class="v">Thật sự hữu ích cho một chỗ thả tệp nội bộ hay một thư mục bản phát hành để script đọc — một điểm cuối liệt kê mà chẳng có mã nào đằng sau. Vẫn nguyên cái cảnh báo kia: nó liệt kê ĐÚNG những gì đang có ở đó.</span></div>
  <div class="kv"><span class="k">index nhận một DANH SÁCH, và thứ tự có nghĩa lý</span><span class="v"><code>index index.html index.htm;</code> thử từng cái một. Thêm một mục ĐỘNG vào — <code>index index.html index.php;</code> — chính là cách một request tới thư mục kết thúc trong một bộ thông dịch, nên cái danh sách ấy nên ngắn đúng bằng mức site thật sự cần.</span></div>
</div>

<h3>Request theo dải byte, và nó mua được gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tua trong âm thanh và video</span><span class="lz-lnote">Một trình duyệt đang kéo thanh tua sẽ gửi <code>Range</code> cho đúng đoạn nó cần. Không có <code>Accept-Ranges</code> thì trình phát buộc phải tải từ đầu mỗi lần, mà với một tệp 200MB thì đó là khác biệt giữa "tức thì" và "không dùng nổi".</span></div>
  <div class="lz-layer"><span class="lz-lname">Tải tiếp sau khi đứt</span><span class="lz-lnote">Một client vừa mất kết nối sẽ xin <code>bytes=</code> tính từ chỗ nó dừng. Với tệp tĩnh thì cái này CHO KHÔNG, còn đứng sau một con proxy thì bạn phải tự tay dựng lấy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó bật sẵn, và hiếm khi đáng tắt</span><span class="lz-lnote"><code>max_ranges 0;</code> tắt hẳn. Lý do thật sự duy nhất là một client bệnh hoạn gửi hàng trăm dải tí hon trong một request để khuếch đại công việc — <code>max_ranges 1;</code> giữ được việc tua mà gỡ bỏ chuyện đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dải byte và phép nén KHÔNG đi với nhau</span><span class="lz-lnote">Một phản hồi đã nén không có ánh xạ ổn định nào từ vị trí byte về nội dung gốc, nên Nginx không phục vụ dải byte từ phép nén tại chỗ. Đó là thêm một lý do nữa để media lớn được phục vụ KHÔNG nén — dù sao nó cũng đã nén sẵn rồi.</span></div>
</div>
<div class="note-ct">
<p><strong>Kiểm gì trên một tuyến tĩnh mới.</strong> Hãy gọi MỘT tệp của mỗi loại bạn phục vụ rồi đọc bốn cái header: <code>Content-Type</code> có đúng không, có <code>ETag</code> không, có <code>Accept-Ranges</code> không, và <code>Cache-Control</code> có đúng ý bạn không? Nó tốn một lệnh <code>curl -I</code> cho mỗi loại tệp, và nó bắt được đúng những cấu hình sai trong bài này TRƯỚC khi một trình duyệt làm gì đó bất ngờ với chúng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#types" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">nginx — types và default_type</span><span class="lc-sub">nginx.org · Bảng phần đuôi được tra thế nào, và cái rơi về</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_autoindex_module.html" target="_blank" rel="noopener"><span class="lc-ico">📂</span><span class="lc-body"><span class="lc-title">nginx — module autoindex</span><span class="lc-sub">nginx.org · Kèm autoindex_format và hình dạng JSON chính xác</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests" target="_blank" rel="noopener"><span class="lc-ico">🎬</span><span class="lc-body"><span class="lc-title">MDN — Request theo dải byte</span><span class="lc-sub">developer.mozilla.org · 206, Content-Range, và trình phát video gửi gì</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Web Foundations</span><span class="lc-sub">Kiểu MIME, việc đánh hơi nội dung, và vì sao nosniff tồn tại</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Phục vụ một tệp không có đuôi, xem trình duyệt dựng nó ra, rồi vá bằng hai dòng</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — ETag is built from mtime, and that is why deploys break caching|||4.2 — ETag được dựng từ mtime, và đó là lý do mỗi lần deploy làm hỏng bộ đệm',
      slug: 'nginx-4-2-etag-va-bo-dem',
      type: 'LESSON',
      description: 'ETag của Nginx là hex(mtime)-hex(size) — bài này chứng minh bằng số. Rồi chạm vào tệp bằng touch: nội dung y hệt từng byte, md5 y hệt, mà ETag ĐỔI, và client cầm ETag cũ phải tải lại nguyên tệp. Đó là chuyện xảy ra ở MỌI lần deploy, và ở MỌI máy chủ thứ hai sau bộ cân bằng tải.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>ETag is built from mtime, and that is why deploys break caching</h2>
<p class="lead">Browser caching rests on two validators Nginx generates for you. Knowing exactly what they are made of explains a symptom nearly every site has and almost nobody investigates: after a deploy, returning visitors re-download assets that did not change.</p>

<h3>What the ETag actually contains</h3>
<div class="out">$ curl -I .../trang.html   ->   ETag: "6a8b27b3-6992"

  ETag thuc te        : 6a8b27b3-6992
  hex(mtime)-hex(size): 6a8b27b3-6992    (mtime=1787504563, size=27026)
                        ^^^^^^^^^^^^^ KHOP tung ky tu</div>
<p>It is the modification time and the size, in hexadecimal, joined by a hyphen. Nothing about the file's contents is read. That makes it extremely cheap to produce — and it means the ETag answers "is this the same inode as before", not "is this the same content as before".</p>
<div class="out">=== touch tep. NOI DUNG khong doi mot byte nao ===
  md5 truoc: f847f804f0dc5adccfa858dd6e003f4e
  md5 sau  : f847f804f0dc5adccfa858dd6e003f4e   Y HET
  ETag truoc: 6a8b27b3-6992
  ETag sau  : 6a8b27d1-6992   DA DOI

=== Client cu gui lai ETag CU ===
  ma=200  tai=27026 byte      &lt;- tai LAI ca tep, du noi dung y het</div>
<div class="pitfall">
<p><strong>Bẫy — every deploy that re-creates files resets mtime, so every cached asset revalidates as a full download.</strong> A <code>git clone</code>, a <code>COPY</code> in a Dockerfile, an <code>rsync</code> without <code>-t</code>, an artifact unpacked from a tarball — all of them stamp the current time onto files whose bytes never changed. Returning visitors then re-fetch your entire asset set. Worse, behind a load balancer two servers deployed a few seconds apart produce <em>different</em> ETags for the same bytes, so a client bouncing between them re-downloads on every alternation, forever, with nothing in your metrics saying why. Two fixes: give assets content-hashed filenames (<code>app.4f9a2c.js</code>) so the URL changes when the content does and the ETag stops mattering; or preserve mtimes across deploys — <code>rsync -a</code>, or a build that writes a stable timestamp. The first is better because it also lets you cache for a year.</p>
</div>

<h3>Conditional requests, both forms measured</h3>
<div class="out">Khong dieu kien                      -> 200, 27026 byte
If-None-Match: "6a8b27b3-6992"       -> 304, 0 byte
If-Modified-Since: Sun, 23 Aug ...   -> 304, 0 byte

etag off  =>  chi con Last-Modified, khong con ETag</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The browser stores both validators with the cached copy</span><span class="lz-d">Whatever the response carried — <code>ETag</code>, <code>Last-Modified</code>, or both. It does not need to understand them; it only has to send them back.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">On revalidation it sends them back as conditions</span><span class="lz-d"><code>If-None-Match</code> carries the ETag; <code>If-Modified-Since</code> carries the date. When both are present, the ETag wins — it is the stronger validator.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">A match produces 304 with an empty body</span><span class="lz-d">Measured: zero bytes downloaded. The round trip still happens, so this saves bandwidth, not latency — which is the whole reason <code>Cache-Control</code> matters more than validators.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Last-Modified has one-second resolution</span><span class="lz-d">Two edits within the same second are indistinguishable to it. The ETag includes the size, so it catches more — but not a same-second edit that keeps the size, which is why neither is a content hash.</span></div>
</div>

<h3>expires, measured across every form</h3>
<div class="out">(mac dinh, khong co expires)  -> KHONG co Cache-Control nao ca

expires off   -> (khong them gi, cung khong go gi)
expires -1    -> Expires: <bay gio>       Cache-Control: no-cache
expires 0     -> Expires: <bay gio>       Cache-Control: max-age=0
expires 30d   -> Expires: 22-Sep-2026     Cache-Control: max-age=2592000
expires max   -> Expires: 31-Dec-2037     Cache-Control: max-age=315360000

expires 1y + add_header Cache-Control "public, max-age=31536000, immutable"
  -> Cache-Control: max-age=31536000
     Cache-Control: public, max-age=31536000, immutable
     ^^^ HAI dong Cache-Control cung di ra. Chung KHONG hop nhat.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">No expires means no Cache-Control at all</span><span class="v">Measured: zero such headers by default. The browser then applies heuristic caching — typically a fraction of the age since <code>Last-Modified</code> — which is unpredictable and differs between browsers. Every static route deserves an explicit decision.</span></div>
  <div class="kv"><span class="k">expires and add_header Cache-Control collide</span><span class="v">The last row sent two <code>Cache-Control</code> headers because they come from different modules and neither knows about the other. Clients pick one, and which one is not something you want to depend on. Use <code>expires</code> alone, or drop <code>expires</code> and write the header yourself — never both.</span></div>
  <div class="kv"><span class="k">immutable is what makes a year-long cache safe</span><span class="v">With a content-hashed filename, the content behind a URL can never change, so <code>immutable</code> tells the browser not to revalidate even on a reload. That turns a <code>304</code> round trip into no request at all, which on a page with forty assets is the difference you can feel.</span></div>
  <div class="kv"><span class="k">HTML gets the opposite treatment</span><span class="v">The document that references the hashed assets must never be cached long, or visitors keep loading the old page pointing at old assets. <code>no-cache</code> on HTML plus a year on hashed assets is the standard pairing, and it is why <code>expires</code> belongs per-location rather than at the top of the file.</span></div>
</div>
<pre><code><span class="tok-comment"># Cặp chuẩn: HTML luôn hỏi lại, tài nguyên có băm thì cache một năm</span>
location = /index.html {
  add_header Cache-Control "no-cache" always;   <span class="tok-comment"># hỏi lại MỖI lần, nhưng vẫn dùng 304</span>
}
location /tinh/ {
  expires 1y;                                   <span class="tok-comment"># CHỈ dùng expires, không thêm add_header</span>
  add_header Cache-Control "public, max-age=31536000, immutable" always;
}</code></pre>
<div class="callout warn">
<p><strong>The block above is deliberately wrong in one place.</strong> It is the exact combination the last measured row produced two headers from. Written correctly, the second block keeps only the <code>add_header</code> line — because <code>immutable</code> is the part that matters and <code>expires</code> cannot express it. Leaving <code>expires 1y;</code> in there is the mistake, and it is worth seeing it written out because it looks completely reasonable.</p>
</div>

<h3>Deciding per asset type</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hashed assets — one year, immutable</span><span class="lz-lnote"><code>app.4f9a2c.js</code>, <code>style.8b12de.css</code>. The URL changes when the content does, so there is no reason ever to revalidate. This is the only case where a long cache is unambiguously safe.</span></div>
  <div class="lz-layer"><span class="lz-lname">Unhashed assets — short, with validators</span><span class="lz-lnote">A logo at a fixed path, a favicon. Minutes to an hour, and rely on the <code>304</code> for the rest. Long caching here means a change takes as long to appear as the cache lifetime you chose.</span></div>
  <div class="lz-layer"><span class="lz-lname">HTML — no-cache, never no-store</span><span class="lz-lnote"><code>no-cache</code> means "revalidate before use", which still gets you an empty <code>304</code> most of the time. <code>no-store</code> means "do not keep it at all" and is for pages with personal data in them, not for pages that merely change.</span></div>
  <div class="lz-layer"><span class="lz-lname">User uploads — depends on whether the URL is stable</span><span class="lz-lnote">If an upload gets a unique key that is never reused, it is a hashed asset: cache it for a year. If the URL can be overwritten with new content, it needs a short lifetime or a version parameter, or people will see the previous file.</span></div>
</div>
<div class="note-ct">
<p><strong>How to tell whether this is costing you anything.</strong> Load your site twice in a browser with the network panel open and look at the second load: assets served from cache with no request are ideal, <code>304</code>s are acceptable, and <code>200</code>s on unchanged files are the symptom this lesson is about. If they are <code>200</code>s, check whether the ETag changed between the two deploys — one <code>curl -I</code> before and after tells you in seconds.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#etag" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">nginx — etag</span><span class="lc-sub">nginx.org · The directive, and what turning it off leaves behind</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#expires" target="_blank" rel="noopener"><span class="lc-ico">📅</span><span class="lc-body"><span class="lc-title">nginx — expires</span><span class="lc-sub">nginx.org · Every form including max, off and negative values</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" target="_blank" rel="noopener"><span class="lc-ico">💾</span><span class="lc-body"><span class="lc-title">MDN — HTTP caching</span><span class="lc-sub">developer.mozilla.org · Freshness, revalidation, and what immutable changes</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Why COPY resets mtimes, and what that does to a layer and to an ETag</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Touch a file, watch the ETag move, then switch to hashed filenames and watch it stop mattering</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>ETag được dựng từ mtime, và đó là lý do mỗi lần deploy làm hỏng bộ đệm</h2>
<p class="lead">Bộ đệm của trình duyệt tựa vào hai bộ xác thực mà Nginx sinh ra giùm bạn. Biết chính xác chúng được làm từ cái gì sẽ giải thích một triệu chứng mà gần như site nào cũng có và gần như chẳng ai đi điều tra: sau một lần deploy, khách quay lại tải lại những tài nguyên KHÔNG hề đổi.</p>

<h3>ETag thật ra chứa cái gì</h3>
<div class="out">$ curl -I .../trang.html   ->   ETag: "6a8b27b3-6992"

  ETag thuc te        : 6a8b27b3-6992
  hex(mtime)-hex(size): 6a8b27b3-6992    (mtime=1787504563, size=27026)
                        ^^^^^^^^^^^^^ KHOP tung ky tu</div>
<p>Nó là thời điểm sửa đổi và KÍCH THƯỚC, viết dạng thập lục phân, nối bằng một dấu gạch ngang. Không một chút NỘI DUNG nào của tệp được đọc tới. Điều đó làm nó cực kỳ rẻ để sinh ra — và nó nghĩa là ETag trả lời câu "đây có còn là cùng cái inode như trước không", chứ KHÔNG trả lời "đây có còn là cùng nội dung như trước không".</p>
<div class="out">=== touch tep. NOI DUNG khong doi mot byte nao ===
  md5 truoc: f847f804f0dc5adccfa858dd6e003f4e
  md5 sau  : f847f804f0dc5adccfa858dd6e003f4e   Y HET
  ETag truoc: 6a8b27b3-6992
  ETag sau  : 6a8b27d1-6992   DA DOI

=== Client cu gui lai ETag CU ===
  ma=200  tai=27026 byte      &lt;- tai LAI ca tep, du noi dung y het</div>
<div class="pitfall">
<p><strong>Bẫy — MỌI lần deploy tạo lại tệp đều đặt lại mtime, nên MỌI tài nguyên đang nằm trong bộ đệm đều phải tải lại nguyên vẹn.</strong> Một lệnh <code>git clone</code>, một dòng <code>COPY</code> trong Dockerfile, một lệnh <code>rsync</code> thiếu <code>-t</code>, một gói artifact vừa bung ra từ tarball — tất cả đều đóng dấu thời điểm hiện tại lên những tệp mà byte của chúng chưa từng đổi. Khách quay lại thế là tải lại TOÀN BỘ bộ tài nguyên của bạn. Tệ hơn nữa, đứng sau một bộ cân bằng tải thì hai máy chủ deploy cách nhau vài giây sinh ra ETag KHÁC NHAU cho cùng đám byte, nên một client nhảy qua lại giữa chúng sẽ tải lại ở mỗi lần đổi máy, MÃI MÃI, mà chẳng có số đo nào của bạn nói vì sao. Hai cách chữa: đặt tên tệp theo BĂM NỘI DUNG (<code>app.4f9a2c.js</code>) để URL đổi khi nội dung đổi và cái ETag thôi có nghĩa lý; hoặc GIỮ NGUYÊN mtime qua các lần deploy — <code>rsync -a</code>, hoặc một quy trình dựng ghi ra một dấu thời gian cố định. Cách đầu tốt hơn, vì nó còn cho phép bạn cache nguyên MỘT NĂM.</p>
</div>

<h3>Request có điều kiện, đo cả hai dạng</h3>
<div class="out">Khong dieu kien                      -> 200, 27026 byte
If-None-Match: "6a8b27b3-6992"       -> 304, 0 byte
If-Modified-Since: Sun, 23 Aug ...   -> 304, 0 byte

etag off  =>  chi con Last-Modified, khong con ETag</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trình duyệt CẤT cả hai bộ xác thực cùng với bản sao</span><span class="lz-d">Bất cứ cái gì phản hồi mang theo — <code>ETag</code>, <code>Last-Modified</code>, hay cả hai. Nó không cần HIỂU chúng; nó chỉ cần gửi chúng trả lại.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lúc xác thực lại, nó gửi chúng về dạng ĐIỀU KIỆN</span><span class="lz-d"><code>If-None-Match</code> mang cái ETag; <code>If-Modified-Since</code> mang cái ngày. Có cả hai thì ETag THẮNG — nó là bộ xác thực mạnh hơn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Khớp thì cho ra 304 với thân RỖNG</span><span class="lz-d">Đo được: tải về KHÔNG byte nào. Vòng đi về vẫn diễn ra, nên nó tiết kiệm BĂNG THÔNG chứ không tiết kiệm ĐỘ TRỄ — và đó là toàn bộ lý do <code>Cache-Control</code> quan trọng hơn đám xác thực.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Last-Modified chỉ phân giải tới GIÂY</span><span class="lz-d">Hai lần sửa trong cùng một giây thì với nó là không phân biệt nổi. ETag có kèm KÍCH THƯỚC nên nó bắt được nhiều hơn — nhưng không bắt được một lần sửa cùng giây mà giữ nguyên kích thước, và đó là lý do không cái nào là một băm nội dung cả.</span></div>
</div>

<h3>expires, đo qua mọi dạng viết</h3>
<div class="out">(mac dinh, khong co expires)  -> KHONG co Cache-Control nao ca

expires off   -> (khong them gi, cung khong go gi)
expires -1    -> Expires: <bay gio>       Cache-Control: no-cache
expires 0     -> Expires: <bay gio>       Cache-Control: max-age=0
expires 30d   -> Expires: 22-Sep-2026     Cache-Control: max-age=2592000
expires max   -> Expires: 31-Dec-2037     Cache-Control: max-age=315360000

expires 1y + add_header Cache-Control "public, max-age=31536000, immutable"
  -> Cache-Control: max-age=31536000
     Cache-Control: public, max-age=31536000, immutable
     ^^^ HAI dong Cache-Control cung di ra. Chung KHONG hop nhat.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có expires nghĩa là KHÔNG có Cache-Control nào cả</span><span class="v">Đo được: mặc định không có lấy một dòng nào như thế. Trình duyệt khi ấy áp dụng bộ đệm PHỎNG ĐOÁN — thường là một phần của khoảng tuổi tính từ <code>Last-Modified</code> — thứ vừa khó lường vừa khác nhau giữa các trình duyệt. Mọi tuyến tĩnh đều xứng đáng có một quyết định TƯỜNG MINH.</span></div>
  <div class="kv"><span class="k">expires và add_header Cache-Control ĐÂM nhau</span><span class="v">Dòng cuối gửi ra HAI header <code>Cache-Control</code> vì chúng tới từ hai module khác nhau và không cái nào biết về cái kia. Client tự chọn một, và cái nào được chọn thì không phải thứ bạn nên phụ thuộc vào. Hãy dùng MỘT MÌNH <code>expires</code>, hoặc bỏ <code>expires</code> và tự viết header — đừng bao giờ cả hai.</span></div>
  <div class="kv"><span class="k">immutable mới là thứ làm một năm cache trở nên AN TOÀN</span><span class="v">Với tên tệp có băm nội dung thì nội dung nằm sau một URL không bao giờ đổi được, nên <code>immutable</code> bảo trình duyệt đừng xác thực lại KỂ CẢ khi người dùng bấm tải lại. Nó biến một vòng <code>304</code> thành KHÔNG request nào cả, mà trên một trang có bốn mươi tài nguyên thì đó là khác biệt bạn CẢM THẤY được.</span></div>
  <div class="kv"><span class="k">HTML thì nhận đối xử NGƯỢC LẠI</span><span class="v">Cái tài liệu tham chiếu tới đám tài nguyên có băm thì KHÔNG BAO GIỜ được cache lâu, không thì khách cứ nạp mãi trang cũ trỏ vào tài nguyên cũ. <code>no-cache</code> cho HTML cộng một năm cho tài nguyên có băm là cặp tiêu chuẩn, và đó là lý do <code>expires</code> thuộc về TỪNG location chứ không thuộc về đầu file.</span></div>
</div>
<pre><code><span class="tok-comment"># Cặp chuẩn: HTML luôn hỏi lại, tài nguyên có băm thì cache một năm</span>
location = /index.html {
  add_header Cache-Control "no-cache" always;   <span class="tok-comment"># hỏi lại MỖI lần, nhưng vẫn dùng 304</span>
}
location /tinh/ {
  expires 1y;                                   <span class="tok-comment"># CHỈ dùng expires, không thêm add_header</span>
  add_header Cache-Control "public, max-age=31536000, immutable" always;
}</code></pre>
<div class="callout warn">
<p><strong>Cái khối ở trên CỐ TÌNH sai một chỗ.</strong> Nó đúng là cái tổ hợp đã sinh ra hai header ở dòng đo cuối cùng. Viết cho đúng thì khối thứ hai chỉ giữ lại dòng <code>add_header</code> — vì <code>immutable</code> mới là phần có nghĩa lý và <code>expires</code> thì không diễn đạt được nó. Để nguyên dòng <code>expires 1y;</code> ở đó chính là cái lỗi, và nó đáng được viết ra để bạn NHÌN THẤY, vì nó trông hoàn toàn hợp lý.</p>
</div>

<h3>Quyết định theo từng loại tài nguyên</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tài nguyên có băm — một năm, immutable</span><span class="lz-lnote"><code>app.4f9a2c.js</code>, <code>style.8b12de.css</code>. URL đổi khi nội dung đổi, nên không có lý do gì phải xác thực lại. Đây là trường hợp DUY NHẤT mà cache dài là an toàn không cần bàn cãi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tài nguyên KHÔNG băm — ngắn thôi, dựa vào bộ xác thực</span><span class="lz-lnote">Một cái logo ở đường dẫn cố định, một cái favicon. Vài phút tới một tiếng, phần còn lại tựa vào <code>304</code>. Cache dài ở đây nghĩa là một thay đổi mất đúng bằng thời gian cache bạn chọn mới hiện ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">HTML — no-cache, KHÔNG BAO GIỜ no-store</span><span class="lz-lnote"><code>no-cache</code> nghĩa là "xác thực lại trước khi dùng", và phần lớn thời gian bạn vẫn nhận một cú <code>304</code> rỗng. <code>no-store</code> nghĩa là "đừng giữ lại gì cả" và nó dành cho trang có dữ liệu cá nhân bên trong, không dành cho trang chỉ đơn giản là hay đổi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tệp người dùng tải lên — tuỳ vào URL có ổn định không</span><span class="lz-lnote">Nếu mỗi lượt tải lên nhận một khoá duy nhất không bao giờ tái sử dụng thì nó chính là tài nguyên có băm: cache một năm. Còn nếu URL có thể bị GHI ĐÈ bằng nội dung mới thì nó cần một vòng đời ngắn hoặc một tham số phiên bản, không thì người ta sẽ nhìn thấy cái tệp cũ.</span></div>
</div>
<div class="note-ct">
<p><strong>Làm sao biết chuyện này có đang tốn tiền của bạn không.</strong> Nạp site hai lần trên trình duyệt với bảng Network đang mở rồi nhìn lượt nạp THỨ HAI: tài nguyên lấy từ cache mà không có request nào là lý tưởng, <code>304</code> là chấp nhận được, còn <code>200</code> trên những tệp không hề đổi chính là cái triệu chứng mà bài này nói về nó. Nếu là <code>200</code> thì hãy kiểm xem ETag có đổi giữa hai lần deploy không — một lệnh <code>curl -I</code> trước và sau là biết ngay trong vài giây.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#etag" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">nginx — etag</span><span class="lc-sub">nginx.org · Chỉ thị này, và tắt nó đi thì còn lại gì</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#expires" target="_blank" rel="noopener"><span class="lc-ico">📅</span><span class="lc-body"><span class="lc-title">nginx — expires</span><span class="lc-sub">nginx.org · Mọi dạng viết, kèm max, off và giá trị âm</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" target="_blank" rel="noopener"><span class="lc-ico">💾</span><span class="lc-body"><span class="lc-title">MDN — Bộ đệm HTTP</span><span class="lc-sub">developer.mozilla.org · Độ tươi, xác thực lại, và immutable đổi cái gì</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Vì sao COPY đặt lại mtime, và điều đó làm gì với một layer và với một ETag</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">touch một tệp, xem ETag nhảy, rồi chuyển sang tên tệp có băm và xem nó thôi có nghĩa lý</span></span></a>
</div>
`,
    },
  ],
};
