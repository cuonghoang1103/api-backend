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
<p><strong>Trap — <code>default_type</code> defaults to <code>text/plain</code>, and that is the wrong default for a file server.</strong> If your <code>http</code> block does not set it, an unknown extension is announced as text, and a browser will happily render a downloaded file as a page. Serve user-uploaded content that way and an uploaded <code>.svg</code> or an extension you forgot becomes stored XSS: the browser renders attacker markup on your origin. Two things together fix it — <code>default_type application/octet-stream;</code> so unknown types download rather than render, and <code>add_header X-Content-Type-Options "nosniff" always;</code> so the browser does not second-guess you. Both are one line, and for a route that serves uploads they are not optional.</p>
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
<p><strong>Trap — every deploy that re-creates files resets mtime, so every cached asset revalidates as a full download.</strong> A <code>git clone</code>, a <code>COPY</code> in a Dockerfile, an <code>rsync</code> without <code>-t</code>, an artifact unpacked from a tarball — all of them stamp the current time onto files whose bytes never changed. Returning visitors then re-fetch your entire asset set. Worse, behind a load balancer two servers deployed a few seconds apart produce <em>different</em> ETags for the same bytes, so a client bouncing between them re-downloads on every alternation, forever, with nothing in your metrics saying why. Two fixes: give assets content-hashed filenames (<code>app.4f9a2c.js</code>) so the URL changes when the content does and the ETag stops mattering; or preserve mtimes across deploys — <code>rsync -a</code>, or a build that writes a stable timestamp. The first is better because it also lets you cache for a year.</p>
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
<pre><code><span class="tok-comment"># The standard pair: HTML always revalidates, hashed assets cache for a year</span>
location = /index.html {
  add_header Cache-Control "no-cache" always;   <span class="tok-comment"># revalidate EVERY time, but still use 304</span>
}
location /tinh/ {
  expires 1y;                                   <span class="tok-comment"># use expires ONLY, do not add an add_header</span>
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

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Compression: pay once at build time, not once per request|||4.3 — Nén: trả tiền MỘT lần lúc dựng, không phải mỗi request một lần',
      slug: 'nginx-4-3-nen',
      type: 'LESSON',
      description: 'Nén tại chỗ tốn CPU ở MỖI request. Bài này đo cái giá đó trên một tệp 125KB thật, rồi cho thấy gzip_static cho ra tệp NHỎ HƠN với chi phí gần bằng không — kèm một khác biệt về ETag mà ít người biết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Compression: pay once at build time, not once per request</h2>
<p class="lead">Turning on <code>gzip</code> is the first performance change everyone makes, and it is the right one. What follows it is less well known: the same bytes can be compressed once when you build the site instead of every single time somebody asks for them, and the result is both cheaper and smaller.</p>

<h3>The cost, measured on a real 125KB file</h3>
<div class="out">Tep: mot file .mjs that trong kho nay, 125.596 byte

  khong nen                          125.596 byte
  gzip tai cho, comp_level 5          32.317 byte   (25,7% cua goc)
  gzip_static, gzip -9 dung san       31.327 byte   (24,9% — NHO HON 3,1%)

Thoi gian moi request (200 luot, gom ca chi phi khoi dong curl ~6ms
nen hay doc phan CHENH LECH chu dung doc so tuyet doi):

  khong nen                            6,3 ms
  gzip tai cho, comp_level 5          10,2 ms      (+3,9 ms)
  gzip tai cho, comp_level 9          12,1 ms      (+5,8 ms)
  gzip_static (doc tep .gz co san)     6,5 ms      (+0,2 ms)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">On-the-fly compression costs CPU per request</span><span class="lz-d">Nearly four milliseconds of worker time for this file at level 5, and nearly six at level 9. Multiply by requests per second: at 200 rps that is most of a core doing nothing but re-compressing the same unchanged bytes.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Higher levels cost more and save little</span><span class="lz-d">Level 9 took 49% longer than level 5 here. For on-the-fly work the sweet spot is 4 to 6; anything higher is paying real CPU for a percent or two of bandwidth.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">gzip_static reads a file instead of compressing</span><span class="lz-d">If <code>trang.html.gz</code> sits next to <code>trang.html</code>, Nginx serves it directly to any client that accepts gzip. The overhead measured at 0.2ms — that is one more <code>open()</code>, not a compressor.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">And the pre-made file is smaller</span><span class="lz-d">Because it was built at level 9 by a tool that had time to spare. You get better compression AND lower cost, which is unusual enough to be worth acting on.</span></div>
</div>

<h3>The ETag difference nobody mentions</h3>
<div class="out">khong nen           Content-Length: 125596   ETag: "6a8b295e-1ea9c"
gzip TAI CHO        (khong co Content-Length) ETag: W/"6a8b295e-1ea9c"
                                                   ^^ YEU, va cung gia tri
gzip_static (tep)   Content-Length: 31327    ETag: "6a8b295e-7a5f"
                                                   ^^ MANH, va tinh tu chinh tep .gz</div>
<div class="kv-grid">
  <div class="kv"><span class="k">On-the-fly compression weakens the ETag</span><span class="v">Nginx marks it <code>W/</code> because the bytes it is sending are no longer the bytes it hashed the metadata from. A weak validator still works for <code>304</code> but cannot be used for range requests, which is one reason ranges and on-the-fly gzip do not combine.</span></div>
  <div class="kv"><span class="k">On-the-fly compression removes Content-Length</span><span class="v">The size is not known until compression finishes, so the response goes out chunked. Clients cannot show a progress bar, and any intermediary that wanted the length does not get it.</span></div>
  <div class="kv"><span class="k">gzip_static keeps both</span><span class="v">A strong ETag computed from the <code>.gz</code> file's own inode, and a real <code>Content-Length</code>. It behaves like an ordinary static file because it is one.</span></div>
  <div class="kv"><span class="k">Vary: Accept-Encoding is not optional</span><span class="v"><code>gzip_vary on;</code> tells every cache between you and the user that the response differs by encoding. Without it a shared cache can hand a gzipped body to a client that did not ask for one — a real breakage that shows up only behind a CDN or a corporate proxy.</span></div>
</div>
<pre><code>http {
  gzip              on;
  gzip_vary         on;          <span class="tok-comment"># MANDATORY whenever any cache sits in between</span>
  gzip_comp_level   5;           <span class="tok-comment"># 4–6; higher means paying real CPU for a few percent</span>
  gzip_min_length   256;         <span class="tok-comment"># below this threshold, compressing makes it larger</span>
  gzip_proxied      any;         <span class="tok-comment"># compress upstream responses too</span>
  gzip_types        text/css application/javascript application/json
                    image/svg+xml application/xml;
  <span class="tok-comment"># text/html is ALWAYS compressed, no need to declare it — declaring it logs a WARN</span>

  gzip_static       on;          <span class="tok-comment"># if a .gz file sits alongside, use it</span>
}</code></pre>
<div class="pitfall">
<p><strong>Trap — do not compress what is already compressed, and be careful what you compress at all.</strong> JPEG, PNG, MP4, WebP, WOFF2 and every archive format are already compressed; running gzip over them burns CPU to make the file very slightly larger. They are absent from the default <code>gzip_types</code> for that reason, and adding them "for completeness" is a pure loss. Separately, compressing a response that mixes a secret with attacker-influenced content is what BREACH exploits — the compressed length leaks whether a guess appeared in the body. That is a real concern for HTML pages containing CSRF tokens, and the practical mitigations are per-request token randomisation rather than turning compression off site-wide.</p>
</div>

<h3>Producing the .gz files</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">At build time, next to each asset</span><span class="lz-lnote"><code>find dist -type f \\( -name '*.js' -o -name '*.css' -o -name '*.html' \\) -exec gzip -9 -k {} \\;</code> as the last step of the build. Keep both files; Nginx picks per request based on <code>Accept-Encoding</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">gzip_static always vs on</span><span class="lz-lnote"><code>on</code> serves the <code>.gz</code> only to clients that accept gzip and falls back otherwise. <code>always</code> serves it to everyone, which is only safe when nothing in your audience lacks gzip support — true in practice, but <code>on</code> costs nothing and cannot surprise you.</span></div>
  <div class="lz-layer"><span class="lz-lname">Brotli is smaller again, and is a module</span><span class="lz-lnote">Not built into stock Nginx; it needs <code>ngx_brotli</code> compiled in. Where you have it, <code>brotli_static</code> works the same way with <code>.br</code> files and typically lands 15 to 20 percent below gzip on text.</span></div>
  <div class="lz-layer"><span class="lz-lname">Keep the two files in sync or you will serve stale content</span><span class="lz-lnote">If a deploy updates <code>app.js</code> but not <code>app.js.gz</code>, every gzip-accepting client gets the old file and everyone else gets the new one — a bug that reproduces for some users and not others. Generating them in the same build step is what prevents it.</span></div>
</div>
<div class="note-ct">
<p><strong>What to do with this today.</strong> If your site compresses on the fly, keep doing it — it is a large win over not compressing. The upgrade is one line in the build and one line in the config, and the measurement above says it gives you a smaller payload for essentially no per-request cost. It matters most exactly where you feel it least: under load, when the CPU you are spending on re-compression is the CPU you needed for everything else.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">nginx — the gzip_static module</span><span class="lc-sub">nginx.org · on versus always, and how the file is located</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_gzip_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗜️</span><span class="lc-body"><span class="lc-title">nginx — the gzip module</span><span class="lc-sub">nginx.org · Every directive in the block above, with defaults</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">MDN — Vary</span><span class="lc-sub">developer.mozilla.org · What a shared cache does with and without it</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">Content negotiation, and how Accept-Encoding is chosen</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Time 200 requests at each compression level, then switch to gzip_static and time it again</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Nén: trả tiền MỘT lần lúc dựng, không phải mỗi request một lần</h2>
<p class="lead">Bật <code>gzip</code> là thay đổi hiệu năng đầu tiên ai cũng làm, và nó đúng. Thứ đi sau nó thì ít người biết hơn: cũng đám byte đó có thể được nén MỘT lần lúc bạn dựng site thay vì nén lại mỗi lần có người hỏi tới, và kết quả vừa rẻ hơn vừa NHỎ hơn.</p>

<h3>Cái giá, đo trên một tệp 125KB thật</h3>
<div class="out">Tep: mot file .mjs that trong kho nay, 125.596 byte

  khong nen                          125.596 byte
  gzip tai cho, comp_level 5          32.317 byte   (25,7% cua goc)
  gzip_static, gzip -9 dung san       31.327 byte   (24,9% — NHO HON 3,1%)

Thoi gian moi request (200 luot, gom ca chi phi khoi dong curl ~6ms
nen hay doc phan CHENH LECH chu dung doc so tuyet doi):

  khong nen                            6,3 ms
  gzip tai cho, comp_level 5          10,2 ms      (+3,9 ms)
  gzip tai cho, comp_level 9          12,1 ms      (+5,8 ms)
  gzip_static (doc tep .gz co san)     6,5 ms      (+0,2 ms)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nén tại chỗ tốn CPU ở MỖI request</span><span class="lz-d">Gần bốn mili giây thời gian worker cho tệp này ở mức 5, và gần sáu ở mức 9. Đem nhân với số request mỗi giây: ở 200 rps thì đó là gần trọn một nhân chỉ để nén đi nén lại đúng đám byte không hề đổi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mức cao hơn tốn hơn mà tiết kiệm chẳng bao nhiêu</span><span class="lz-d">Mức 9 ở đây lâu hơn mức 5 tới 49%. Với việc nén tại chỗ thì điểm ngọt là 4 tới 6; cao hơn nữa là trả CPU thật để đổi lấy một hai phần trăm băng thông.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">gzip_static ĐỌC một tệp thay vì đi nén</span><span class="lz-d">Nếu <code>trang.html.gz</code> nằm ngay cạnh <code>trang.html</code>, Nginx phục vụ thẳng nó cho mọi client chấp nhận gzip. Phí tổn đo được là 0,2ms — đó là thêm một lệnh <code>open()</code>, không phải một bộ nén.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Và cái tệp dựng sẵn còn NHỎ HƠN</span><span class="lz-d">Vì nó được dựng ở mức 9 bởi một công cụ có dư thời gian. Bạn được nén tốt hơn VÀ tốn ít hơn, chuyện đủ hiếm để đáng đi làm.</span></div>
</div>

<h3>Khác biệt về ETag mà chẳng ai nhắc</h3>
<div class="out">khong nen           Content-Length: 125596   ETag: "6a8b295e-1ea9c"
gzip TAI CHO        (khong co Content-Length) ETag: W/"6a8b295e-1ea9c"
                                                   ^^ YEU, va cung gia tri
gzip_static (tep)   Content-Length: 31327    ETag: "6a8b295e-7a5f"
                                                   ^^ MANH, va tinh tu chinh tep .gz</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nén tại chỗ làm ETag YẾU đi</span><span class="v">Nginx đánh dấu <code>W/</code> vì đám byte nó đang gửi không còn là đám byte nó đã băm siêu dữ liệu ra. Một bộ xác thực yếu vẫn dùng được cho <code>304</code> nhưng KHÔNG dùng được cho request theo dải byte, và đó là một lý do nữa để dải byte và gzip tại chỗ không đi với nhau.</span></div>
  <div class="kv"><span class="k">Nén tại chỗ làm mất Content-Length</span><span class="v">Kích thước chưa biết được cho tới khi nén xong, nên phản hồi đi ra dạng chunked. Client không hiện được thanh tiến trình, và bất cứ trung gian nào cần biết độ dài đều không có.</span></div>
  <div class="kv"><span class="k">gzip_static giữ được CẢ HAI</span><span class="v">Một ETag MẠNH tính từ chính inode của tệp <code>.gz</code>, và một <code>Content-Length</code> thật. Nó cư xử như một tệp tĩnh bình thường vì nó ĐÚNG LÀ một tệp tĩnh bình thường.</span></div>
  <div class="kv"><span class="k">Vary: Accept-Encoding KHÔNG phải tuỳ chọn</span><span class="v"><code>gzip_vary on;</code> báo cho mọi bộ đệm nằm giữa bạn và người dùng rằng phản hồi KHÁC NHAU theo phép mã hoá. Thiếu nó thì một bộ đệm dùng chung có thể trao một thân đã nén cho một client chưa từng xin — một kiểu hỏng có thật và chỉ lộ ra khi đứng sau một CDN hay một proxy công ty.</span></div>
</div>
<pre><code>http {
  gzip              on;
  gzip_vary         on;          <span class="tok-comment"># BẮT BUỘC khi có bất cứ bộ đệm nào ở giữa</span>
  gzip_comp_level   5;           <span class="tok-comment"># 4–6; cao hơn là trả CPU thật cho vài phần trăm</span>
  gzip_min_length   256;         <span class="tok-comment"># dưới ngưỡng này nén xong còn to hơn</span>
  gzip_proxied      any;         <span class="tok-comment"># nén cả phản hồi đến từ upstream</span>
  gzip_types        text/css application/javascript application/json
                    image/svg+xml application/xml;
  <span class="tok-comment"># text/html LUÔN được nén, không cần khai — khai lại là một dòng WARN</span>

  gzip_static       on;          <span class="tok-comment"># có tệp .gz kề bên thì dùng nó</span>
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — đừng nén thứ đã nén, và hãy cẩn thận với chuyện nén cái gì.</strong> JPEG, PNG, MP4, WebP, WOFF2 và mọi định dạng nén sẵn đều đã nén rồi; chạy gzip lên chúng là đốt CPU để làm tệp TO RA một tí. Chúng vắng mặt trong <code>gzip_types</code> mặc định đúng vì lý do đó, và thêm chúng vào "cho đủ bộ" là lỗ thuần tuý. Chuyện riêng: nén một phản hồi có trộn một BÍ MẬT với nội dung do kẻ tấn công chi phối chính là thứ BREACH khai thác — độ dài sau nén tiết lộ rằng một lần đoán có xuất hiện trong thân hay không. Đó là mối lo có thật với những trang HTML mang token CSRF, và cách giảm thiểu thực tế là NGẪU NHIÊN HOÁ token theo từng request, chứ không phải tắt nén cả site.</p>
</div>

<h3>Sinh ra đám tệp .gz thế nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Lúc dựng, đặt ngay cạnh từng tài nguyên</span><span class="lz-lnote"><code>find dist -type f \\( -name '*.js' -o -name '*.css' -o -name '*.html' \\) -exec gzip -9 -k {} \\;</code> làm bước CUỐI của quy trình dựng. Giữ CẢ HAI tệp; Nginx tự chọn theo từng request dựa vào <code>Accept-Encoding</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">gzip_static always và on</span><span class="lz-lnote"><code>on</code> chỉ phục vụ tệp <code>.gz</code> cho client nào chấp nhận gzip, còn lại thì lùi về tệp gốc. <code>always</code> phục vụ nó cho TẤT CẢ, và điều đó chỉ an toàn khi không ai trong tệp khách của bạn thiếu hỗ trợ gzip — thực tế thì đúng thế, nhưng <code>on</code> chẳng tốn gì và nó không thể làm bạn bất ngờ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Brotli còn nhỏ hơn nữa, và nó là một module</span><span class="lz-lnote">Không có sẵn trong Nginx bản gốc; nó cần biên dịch kèm <code>ngx_brotli</code>. Chỗ nào có thì <code>brotli_static</code> chạy theo đúng cách đó với tệp <code>.br</code>, và với văn bản thì nó thường thấp hơn gzip chừng 15 tới 20 phần trăm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giữ hai tệp ĐỒNG BỘ, không thì bạn phục vụ nội dung cũ</span><span class="lz-lnote">Nếu một lần deploy cập nhật <code>app.js</code> mà không cập nhật <code>app.js.gz</code> thì mọi client chấp nhận gzip nhận tệp CŨ còn những người khác nhận tệp MỚI — một con lỗi tái hiện được với một số người và không tái hiện với người khác. Sinh cả hai trong CÙNG một bước dựng là thứ chặn được nó.</span></div>
</div>
<div class="note-ct">
<p><strong>Hôm nay làm gì với chuyện này.</strong> Nếu site của bạn đang nén tại chỗ thì cứ tiếp tục — nó là một cú thắng lớn so với không nén. Bước nâng cấp là một dòng trong quy trình dựng và một dòng trong cấu hình, và phép đo ở trên nói rằng nó cho bạn một gói tin nhỏ hơn với chi phí mỗi request gần như bằng không. Nó có nghĩa lý nhất đúng ở chỗ bạn cảm thấy nó ít nhất: lúc tải nặng, khi cái CPU bạn đang tiêu để nén đi nén lại chính là cái CPU bạn cần cho mọi thứ còn lại.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">nginx — module gzip_static</span><span class="lc-sub">nginx.org · on và always, và cách nó tìm ra cái tệp</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_gzip_module.html" target="_blank" rel="noopener"><span class="lc-ico">🗜️</span><span class="lc-body"><span class="lc-title">nginx — module gzip</span><span class="lc-sub">nginx.org · Mọi chỉ thị trong khối ở trên, kèm giá trị mặc định</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">MDN — Vary</span><span class="lc-sub">developer.mozilla.org · Một bộ đệm dùng chung làm gì khi có và khi không có nó</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Web Foundations</span><span class="lc-sub">Thương lượng nội dung, và Accept-Encoding được chọn thế nào</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Bấm giờ 200 request ở từng mức nén, rồi chuyển sang gzip_static và bấm lại</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — How the bytes leave the machine: sendfile and open_file_cache|||4.4 — Byte rời khỏi máy bằng đường nào: sendfile và open_file_cache',
      slug: 'nginx-4-4-sendfile-va-open-file-cache',
      type: 'LESSON',
      description: 'Hai chỉ thị mà mọi cấu hình mẫu đều có và gần như không ai biết chúng làm gì. Bài này đếm SYSCALL bằng strace trên chính worker của Nginx: một cái biến 186 lời gọi thành 3, cái kia xoá sạch mọi lời gọi mở tệp — và một phép đo bằng đồng hồ KHÔNG thấy gì cả, điều đó cũng đáng nói.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>How the bytes leave the machine: sendfile and open_file_cache</h2>
<p class="lead">Both of these appear in every example config, both are described as "makes it faster", and almost nobody has seen what they change. They are visible in one place — the system calls the worker makes — so that is where this lesson looks.</p>

<h3>sendfile: 186 syscalls become 3</h3>
<div class="out">strace tren dung worker cua Nginx, 3 request toi mot tep 2MB:

  sendfile on     sendfile=3    writev=3      &lt;- 1 syscall / tep
  sendfile off    sendfile=0    writev=186    &lt;- 62 syscall / request</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Without it: read into user space, write back out</span><span class="lz-d">The worker reads a buffer's worth of the file into its own memory, then writes that buffer to the socket, and repeats. 2MB in 32KB buffers is 62 round trips through user space per request — every byte crossing the kernel boundary twice.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">With it: one syscall, no copy through your process</span><span class="lz-d"><code>sendfile()</code> tells the kernel to move data from the page cache to the socket directly. The worker never touches the bytes. Three requests produced exactly three calls.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">tcp_nopush goes with it</span><span class="lz-d">It holds the response headers back until there is a full packet to send, so the headers and the first chunk of the file leave together instead of as two packets. It only does anything when <code>sendfile</code> is on, which is why the pair always appears together.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It cannot be used when the body is transformed</span><span class="lz-d">On-the-fly <code>gzip</code>, <code>sub_filter</code> or SSI all need the bytes in user space to modify them, so those responses fall back to read-and-write. It is another quiet advantage of <code>gzip_static</code>: a pre-compressed file is still just a file.</span></div>
</div>

<h3>open_file_cache: the opens disappear entirely</h3>
<div class="out">5 request toi cung mot tep nho:

                        openat   fstat   sendfile   close
  open_file_cache BAT      0       0        5         5
  open_file_cache TAT     10       5        5        10
                          ^^      ^^
                   2 lan mo + 1 lan stat MOI REQUEST, bien mat sach</div>
<div class="callout warn">
<p><strong>And a measurement that found nothing, which is also information.</strong> Timing 500 sequential <code>curl</code> requests to the same small file gave 7.16ms with the cache on and 7.10ms with it off — no difference at all. That is not evidence the directive is useless; it is evidence the benchmark was wrong. Each <code>curl</code> spends about 7ms starting a process, so the microseconds of a saved <code>openat</code> were invisible under it. The syscall count is the honest measurement here, and the wall-clock number would have been the misleading one to publish.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">It caches descriptors and metadata, not contents</span><span class="v">The file's data still comes from the kernel page cache, which was already handling that. What is cached is the open descriptor, the <code>stat</code> result, and the fact that a path does or does not exist — the per-request bookkeeping, not the bytes.</span></div>
  <div class="kv"><span class="k">Where it pays: many requests, many small files</span><span class="v">A page pulling forty small assets does forty opens and forty stats per visitor without it. On a busy static site that is a large share of the syscalls the process makes at all, and syscalls are where a static server's time actually goes.</span></div>
  <div class="kv"><span class="k">open_file_cache_errors caches the misses too</span><span class="v">With it on, a repeated request for a missing file does not re-stat the filesystem every time. That matters under a scanner hammering non-existent paths, which is a load pattern you get whether you want it or not.</span></div>
  <div class="kv"><span class="k">The cost is staleness for up to open_file_cache_valid</span><span class="v">A file replaced on disk may keep being served from the old descriptor until the entry is revalidated. With <code>30s</code> that is a half-minute window after a deploy — usually fine, and worth knowing before you spend an hour wondering why the new file is not appearing.</span></div>
</div>
<pre><code>http {
  sendfile        on;
  tcp_nopush      on;          <span class="tok-comment"># only has an effect when sendfile is on</span>
  tcp_nodelay     on;          <span class="tok-comment"># for keep-alive connections, send the final packet at once</span>

  open_file_cache          max=10000 inactive=60s;
  open_file_cache_valid    30s;      <span class="tok-comment"># the maximum staleness window after a deploy</span>
  open_file_cache_min_uses 2;        <span class="tok-comment"># only cache what is asked for at least twice</span>
  open_file_cache_errors   on;       <span class="tok-comment"># cache 404s too — against wandering scanners</span>
}</code></pre>
<div class="pitfall">
<p><strong>Trap — <code>open_file_cache</code> holds descriptors, so a deploy that replaces files can serve the old ones briefly, and a deploy that <em>deletes</em> them can serve deleted files for the whole validity window.</strong> The descriptor stays valid after an unlink on Unix — the data is still there until the last holder closes it. So a file you removed for a good reason can keep being served for up to <code>open_file_cache_valid</code>. If a removal is urgent — a leaked document, a bad build — reload Nginx after the deletion rather than assuming the file is gone. A reload replaces the workers and their caches with it, which is why the standard deploy script does one.</p>
</div>

<h3>The rest of the static tuning, in order of how much it matters</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Compress well and cache correctly (4.2, 4.3)</span><span class="lz-lnote">Bytes not sent beat bytes sent efficiently, by a wide margin. A year-long cache on hashed assets removes the request entirely; that is worth more than every syscall optimisation in this lesson combined.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. sendfile and open_file_cache</span><span class="lz-lnote">Real and free, but they change how efficiently the machine does work it is already doing. Turn them on and stop thinking about them.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. worker_processes and worker_connections</span><span class="lz-lnote"><code>auto</code> for the first is correct on almost every machine. The second only matters when you are actually running out — the error log says <code>worker_connections are not enough</code> in plain words when you are.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Everything else you read about</span><span class="lz-lnote"><code>aio</code>, <code>directio</code>, <code>thread_pool</code> — these solve real problems for large-media servers where files exceed RAM, and they can make an ordinary site slower. Do not copy them from a tuning article without the workload that motivated it.</span></div>
</div>
<div class="note-ct">
<p><strong>The habit this lesson is really about.</strong> When a directive claims to make something faster, ask what it changes rather than whether it helps — <code>strace</code> on the worker answers in thirty seconds and the answer is a count, not an opinion. It also protects you from the opposite error: the 500-request timing above would have let me report "no difference, do not bother", and that would have been wrong.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#sendfile" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">nginx — sendfile, tcp_nopush, tcp_nodelay</span><span class="lc-sub">nginx.org · The three that belong together, with their interactions</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#open_file_cache" target="_blank" rel="noopener"><span class="lc-ico">🗄️</span><span class="lc-body"><span class="lc-title">nginx — open_file_cache</span><span class="lc-sub">nginx.org · Exactly what is cached, and the validity semantics</span></span></a>
<a class="link-card" href="https://man7.org/linux/man-pages/man2/sendfile.2.html" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">man 2 sendfile</span><span class="lc-sub">man7.org · The syscall itself, and why it avoids the user-space copy</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">strace, file descriptors, and why an unlinked file stays readable</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Count the worker's syscalls yourself, with each directive on and off</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Byte rời khỏi máy bằng đường nào: sendfile và open_file_cache</h2>
<p class="lead">Cả hai đều xuất hiện trong mọi cấu hình mẫu, cả hai đều được mô tả là "cho nó nhanh hơn", và gần như chẳng ai từng NHÌN THẤY chúng đổi cái gì. Chúng chỉ hiện ra ở một chỗ — đám lời gọi hệ thống mà worker thực hiện — nên đó là chỗ bài này đi soi.</p>

<h3>sendfile: 186 lời gọi thành 3</h3>
<div class="out">strace tren dung worker cua Nginx, 3 request toi mot tep 2MB:

  sendfile on     sendfile=3    writev=3      &lt;- 1 syscall / tep
  sendfile off    sendfile=0    writev=186    &lt;- 62 syscall / request</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Không có nó: ĐỌC vào không gian người dùng rồi GHI ngược ra</span><span class="lz-d">Worker đọc một đệm đầy nội dung tệp vào bộ nhớ của chính nó, rồi ghi cái đệm đó ra socket, rồi lặp lại. 2MB chia theo đệm 32KB là 62 vòng đi qua không gian người dùng cho MỖI request — mỗi byte vượt ranh giới nhân HAI lần.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Có nó: một lời gọi, không chép qua tiến trình của bạn</span><span class="lz-d"><code>sendfile()</code> bảo nhân hệ điều hành chuyển dữ liệu thẳng từ bộ đệm trang ra socket. Worker KHÔNG hề chạm vào đám byte. Ba request sinh ra đúng ba lời gọi.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">tcp_nopush đi kèm với nó</span><span class="lz-d">Nó GIỮ header phản hồi lại cho tới khi có đủ một gói đầy để gửi, nên header và mẩu đầu của tệp rời đi CÙNG NHAU thay vì thành hai gói. Nó chỉ có tác dụng khi <code>sendfile</code> đang bật, và đó là lý do cặp này luôn xuất hiện cùng nhau.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó KHÔNG dùng được khi thân bị biến đổi</span><span class="lz-d"><code>gzip</code> tại chỗ, <code>sub_filter</code> hay SSI đều cần đám byte nằm trong không gian người dùng mới sửa được, nên những phản hồi đó lùi về kiểu đọc-rồi-ghi. Đó là thêm một lợi thế lặng lẽ của <code>gzip_static</code>: một tệp đã nén sẵn thì vẫn chỉ là một cái TỆP.</span></div>
</div>

<h3>open_file_cache: đám lời gọi mở BIẾN MẤT hẳn</h3>
<div class="out">5 request toi cung mot tep nho:

                        openat   fstat   sendfile   close
  open_file_cache BAT      0       0        5         5
  open_file_cache TAT     10       5        5        10
                          ^^      ^^
                   2 lan mo + 1 lan stat MOI REQUEST, bien mat sach</div>
<div class="callout warn">
<p><strong>Và một phép đo KHÔNG tìm thấy gì, mà điều đó cũng là thông tin.</strong> Bấm giờ 500 lượt <code>curl</code> tuần tự tới cùng một tệp nhỏ cho ra 7,16ms khi bật cache và 7,10ms khi tắt — không khác gì cả. Đó KHÔNG phải bằng chứng rằng chỉ thị này vô dụng; đó là bằng chứng rằng PHÉP ĐO đã sai. Mỗi lượt <code>curl</code> tốn chừng 7ms chỉ để khởi động một tiến trình, nên vài micro giây tiết kiệm được từ một lời gọi <code>openat</code> chìm nghỉm dưới đó. Đếm syscall mới là phép đo thật thà ở đây, còn con số đồng hồ mới là thứ mà đem đăng lên thì gây hiểu lầm.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó cache MÔ TẢ TỆP và siêu dữ liệu, KHÔNG cache nội dung</span><span class="v">Dữ liệu của tệp vẫn tới từ bộ đệm trang của nhân, thứ vốn đã lo việc đó rồi. Cái được cache là mô tả tệp đang mở, kết quả <code>stat</code>, và cái sự thật rằng một đường dẫn có hay không tồn tại — tức là phần sổ sách theo từng request, không phải đám byte.</span></div>
  <div class="kv"><span class="k">Chỗ nó sinh lời: NHIỀU request, NHIỀU tệp nhỏ</span><span class="v">Một trang kéo về bốn mươi tài nguyên nhỏ thì tốn bốn mươi lần mở và bốn mươi lần stat cho MỖI khách nếu không có nó. Trên một site tĩnh đông khách thì đó là một phần lớn trong toàn bộ số syscall mà tiến trình thực hiện, mà syscall mới là chỗ thời gian của một máy chủ tĩnh thật sự đi vào.</span></div>
  <div class="kv"><span class="k">open_file_cache_errors cache cả những lần TRƯỢT</span><span class="v">Bật nó lên thì một request lặp đi lặp lại tới một tệp không tồn tại sẽ không phải stat lại hệ tệp mỗi lần. Điều đó có nghĩa lý khi có một con quét dạo nện liên tục vào những đường dẫn không có, mà đó là kiểu tải bạn nhận được dù có muốn hay không.</span></div>
  <div class="kv"><span class="k">Cái giá là dữ liệu CŨ trong tối đa open_file_cache_valid</span><span class="v">Một tệp vừa bị thay trên đĩa vẫn có thể được phục vụ từ mô tả tệp cũ cho tới khi mục đó được xác thực lại. Với <code>30s</code> thì đó là một cửa sổ nửa phút sau khi deploy — thường thì không sao, và đáng biết TRƯỚC khi bạn tốn một tiếng tự hỏi vì sao tệp mới chưa hiện ra.</span></div>
</div>
<pre><code>http {
  sendfile        on;
  tcp_nopush      on;          <span class="tok-comment"># chỉ có tác dụng khi sendfile on</span>
  tcp_nodelay     on;          <span class="tok-comment"># cho kết nối giữ-sống, gửi ngay gói cuối</span>

  open_file_cache          max=10000 inactive=60s;
  open_file_cache_valid    30s;      <span class="tok-comment"># cửa sổ cũ tối đa sau khi deploy</span>
  open_file_cache_min_uses 2;        <span class="tok-comment"># chỉ cache thứ được hỏi tới ít nhất 2 lần</span>
  open_file_cache_errors   on;       <span class="tok-comment"># cache cả 404 — chống đám quét dạo</span>
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>open_file_cache</code> GIỮ mô tả tệp, nên một lần deploy thay tệp có thể phục vụ tệp cũ trong chốc lát, còn một lần deploy XOÁ tệp có thể phục vụ tệp ĐÃ XOÁ suốt cả cửa sổ hiệu lực.</strong> Trên Unix, mô tả tệp vẫn hợp lệ sau khi unlink — dữ liệu còn nguyên đó cho tới khi người giữ cuối cùng đóng nó lại. Nên một tệp bạn gỡ đi vì một lý do chính đáng vẫn có thể tiếp tục được phục vụ trong tối đa <code>open_file_cache_valid</code>. Nếu việc gỡ là KHẨN — một tài liệu bị lộ, một bản dựng hỏng — thì hãy NẠP LẠI Nginx sau khi xoá chứ đừng cho rằng cái tệp đã biến mất. Một lần nạp lại thay luôn đám worker cùng với bộ đệm của chúng, và đó là lý do các script deploy tiêu chuẩn đều làm một lần.</p>
</div>

<h3>Phần chỉnh tinh còn lại, xếp theo mức độ có nghĩa lý</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Nén cho tốt và cache cho đúng (4.2, 4.3)</span><span class="lz-lnote">Byte KHÔNG gửi thắng byte gửi một cách hiệu quả, thắng rất xa. Một năm cache trên tài nguyên có băm xoá luôn cái request; điều đó đáng giá hơn TẤT CẢ phần tối ưu syscall trong bài này cộng lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. sendfile và open_file_cache</span><span class="lz-lnote">Thật và miễn phí, nhưng chúng đổi cái CÁCH máy làm công việc mà nó vốn đã làm. Hãy bật lên rồi thôi nghĩ về chúng.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. worker_processes và worker_connections</span><span class="lz-lnote"><code>auto</code> cho cái đầu là đúng trên gần như mọi máy. Cái thứ hai chỉ có nghĩa lý khi bạn THẬT SỰ cạn — và error log nói thẳng bằng chữ <code>worker_connections are not enough</code> khi điều đó xảy ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Mọi thứ khác mà bạn đọc được</span><span class="lz-lnote"><code>aio</code>, <code>directio</code>, <code>thread_pool</code> — chúng giải những bài toán CÓ THẬT cho máy chủ media lớn nơi tệp vượt quá RAM, và chúng có thể làm một site bình thường CHẬM ĐI. Đừng chép chúng từ một bài viết chỉnh tinh mà không có cái tải đã sinh ra bài viết đó.</span></div>
</div>
<div class="note-ct">
<p><strong>Thói quen mà bài này thật sự nói về nó.</strong> Khi một chỉ thị tuyên bố làm cái gì đó nhanh hơn, hãy hỏi nó ĐỔI cái gì thay vì hỏi nó có giúp không — <code>strace</code> trên worker trả lời trong ba mươi giây và câu trả lời là một CON SỐ ĐẾM, không phải một ý kiến. Nó cũng bảo vệ bạn khỏi cái lỗi ngược lại: cái phép bấm giờ 500 request ở trên lẽ ra đã cho tôi kết luận "không khác gì, khỏi bận tâm", và kết luận đó SAI.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#sendfile" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">nginx — sendfile, tcp_nopush, tcp_nodelay</span><span class="lc-sub">nginx.org · Bộ ba đi liền nhau, kèm cách chúng tương tác</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#open_file_cache" target="_blank" rel="noopener"><span class="lc-ico">🗄️</span><span class="lc-body"><span class="lc-title">nginx — open_file_cache</span><span class="lc-sub">nginx.org · Chính xác cái gì được cache, và ngữ nghĩa của hiệu lực</span></span></a>
<a class="link-card" href="https://man7.org/linux/man-pages/man2/sendfile.2.html" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">man 2 sendfile</span><span class="lc-sub">man7.org · Chính cái lời gọi hệ thống, và vì sao nó tránh được phép chép qua không gian người dùng</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">strace, mô tả tệp, và vì sao một tệp đã unlink vẫn đọc được</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Tự tay đếm syscall của worker, với mỗi chỉ thị bật rồi tắt</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — A production static block, assembled and measured|||4.5 — Một khối tĩnh cho production, ráp lại và đem đo',
      slug: 'nginx-4-5-khoi-tinh-production',
      type: 'LESSON',
      description: 'Ghép mọi thứ trong chương thành một cấu hình chạy được cho một SPA có tài nguyên băm và một thư mục tệp người dùng tải lên, rồi đo TỪNG tuyến. Sáu dòng đo, và dòng cuối phơi ra một con lỗi thật trong cấu hình do chính bài này viết: một cú 404 bị cache MỘT NĂM.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>A production static block, assembled and measured</h2>
<p class="lead">Four lessons of pieces. Here they are as one config for a realistic site — a single-page app with content-hashed assets, an HTML entry point, and a directory of user uploads — with every route measured afterwards. The last measurement found a bug in the config written above it, which is left in because it is the most useful thing in the lesson.</p>

<h3>The config</h3>
<pre><code>http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;   <span class="tok-comment"># NOT text/plain (4.1)</span>

  sendfile on; tcp_nopush on; tcp_nodelay on;          <span class="tok-comment"># 4.4</span>
  open_file_cache max=10000 inactive=60s;
  open_file_cache_valid 30s;
  open_file_cache_min_uses 2;
  open_file_cache_errors on;

  gzip on; gzip_vary on; gzip_comp_level 5;            <span class="tok-comment"># 4.3</span>
  gzip_min_length 256;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_static on;

  server {
    listen 443 ssl default_server;
    server_name vidu.com;
    root /srv/site;

    <span class="tok-comment"># HASHED assets: one year, immutable (4.2)</span>
    location /tinh/ {
      add_header Cache-Control "public, max-age=31536000, immutable";
      add_header X-Content-Type-Options "nosniff" always;
      try_files \$uri =404;
    }

    <span class="tok-comment"># USER-uploaded files: must never be rendered in the browser</span>
    location /tai-len/ {
      types { }                             <span class="tok-comment"># drop the mime table entirely</span>
      default_type application/octet-stream;
      add_header Content-Disposition "attachment" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header Cache-Control "public, max-age=604800";
      try_files \$uri =404;
    }

    <span class="tok-comment"># HTML: always revalidate</span>
    location = /index.html {
      add_header Cache-Control "no-cache";
      add_header X-Content-Type-Options "nosniff" always;
    }

    <span class="tok-comment"># SPA: every other path falls back to index.html (2.5)</span>
    location / { try_files \$uri \$uri/ /index.html; }
  }
}</code></pre>

<h3>Every route, measured</h3>
<div class="out">tai nguyen co bam   200  application/javascript  Content-Encoding: gzip
                         Cache-Control: public, max-age=31536000, immutable
                         X-Content-Type-Options: nosniff

index.html          200  text/html    Cache-Control: no-cache

duong dan SPA       200  text/html    Cache-Control: no-cache
                         ETag y HET index.html  &lt;- try_files DA chuyen huong noi bo
                         va khop LAI vao khoi = /index.html

anh tai len         200  application/octet-stream
                         Content-Disposition: attachment
                         X-Content-Type-Options: nosniff

tep tai len "la"    200  application/octet-stream   &lt;- noi dung la &lt;script&gt;
                         Content-Disposition: attachment
                         (trinh duyet TAI VE, khong dung ra)

tep khong ton tai   404  Cache-Control: public, max-age=31536000, immutable
                              ^^^^^^^^ DAY LA MOT CON LOI</div>
<div class="callout ok">
<p><strong>The SPA row is Lesson 2.5 paying off in a way worth pointing at.</strong> A request for <code>/bat-ky/duong-dan</code> matched <code>location /</code>, found no file, and fell through to <code>/index.html</code>. That fallback is an internal redirect, so location matching ran again and the request landed in <code>location = /index.html</code> — which is why it came back with <code>no-cache</code> rather than whatever <code>location /</code> would have given it. The <code>ETag</code> is identical to the real <code>/index.html</code>, confirming it is the same file through the same block. Structuring it this way means the caching rule for your HTML is written once and applies to every SPA route automatically.</p>
</div>
<div class="pitfall">
<p><strong>Trap — the 404 came back with a one-year immutable cache, and the cause was the word <code>always</code>.</strong> The first version of the block above wrote <code>add_header Cache-Control "..." always;</code>, and <code>always</code> means "on every response including errors". So a browser that requested a hashed asset during a partial deploy — the HTML already updated, the asset not yet uploaded — cached the <code>404</code> for a year. That user's site is broken until they clear their cache, and no deploy can fix it because the browser will not ask again. Measured after removing <code>always</code> from that one line: the <code>404</code> carries no <code>Cache-Control</code> at all, and the <code>200</code> still carries the full year. <strong>The rule: <code>always</code> belongs on security headers, which must apply to error pages too, and must not be on <code>Cache-Control</code>, where it caches your failures.</strong></p>
</div>
<div class="out">SAU KHI bo chu "always" khoi dong Cache-Control:

  404: HTTP/1.1 404 Not Found        (khong con Cache-Control)
  200: HTTP/1.1 200 OK               Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options tren 404: VAN CO (vi no van giu "always")</div>

<h3>Why the uploads block looks like that</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">types { } empties the MIME table for that location</span><span class="lz-lnote">Combined with <code>default_type application/octet-stream</code>, every uploaded file is announced as binary regardless of its extension. An uploaded <code>.html</code> or <code>.svg</code> then cannot be rendered as a document on your origin, which is what turns an upload feature into stored XSS.</span></div>
  <div class="lz-layer"><span class="lz-lname">Content-Disposition: attachment is the second lock</span><span class="lz-lnote">It tells the browser to download rather than display, even for types it would normally render. Belt and braces, because the two mechanisms fail differently and uploads are the one place you want both.</span></div>
  <div class="lz-layer"><span class="lz-lname">A separate origin is the real fix</span><span class="lz-lnote">Serving uploads from <code>files.vidu.com</code> rather than <code>vidu.com/tai-len/</code> means even a rendered document cannot touch your cookies or your DOM. The two headers above are what you do while that is not possible.</span></div>
  <div class="lz-layer"><span class="lz-lname">try_files $uri =404 rather than a fallback</span><span class="lz-lnote">A missing upload should be a <code>404</code>, not your SPA shell. Without the explicit <code>=404</code> the request would fall to <code>location /</code> and return <code>index.html</code> with status <code>200</code> — an HTML page where an image was expected.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Check the error responses, not just the successes</span><span class="v">This is the general form of the bug above. When you review a static config, request one path that does not exist in each location and read the headers. Anything cached, anything leaking, anything with the wrong status is easier to see there than on the happy path.</span></div>
  <div class="kv"><span class="k">Each location repeats the headers it needs</span><span class="v">Because of the array-replacement rule from Lesson 2.3. In a real config the shared set goes in a snippet and every block includes it — written out longhand here so you can see exactly what each block sends.</span></div>
  <div class="kv"><span class="k">The order of the location blocks does not matter</span><span class="v">Three prefixes and one exact match. By Lesson 2.1, prefixes compete on length and <code>=</code> short-circuits, so this config behaves identically however you sort it. That is a property worth having in a file other people will edit.</span></div>
  <div class="kv"><span class="k">One measurement per route is the whole review</span><span class="v">Six <code>curl -I</code> calls covered every path through this config, including the failure. It is faster than reading the file and it is the only way to catch a header that comes from a module rather than from a line you wrote.</span></div>
</div>
<div class="note-ct">
<p><strong>Why the bug stays in the lesson.</strong> It was not planted. The config was written from the four preceding lessons, it looked right, it passed <code>nginx -t</code>, and five of six routes were perfect. It took one request to a path that does not exist to find a failure that would have been invisible in production until a user complained about a permanently broken page. That is the argument for measuring error paths, made better by an example than by an assertion.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">nginx — add_header and the always flag</span><span class="lc-sub">nginx.org · Exactly which status codes each form applies to</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition" target="_blank" rel="noopener"><span class="lc-ico">📎</span><span class="lc-body"><span class="lc-title">MDN — Content-Disposition</span><span class="lc-sub">developer.mozilla.org · attachment versus inline, and filename handling</span></span></a>
<a class="link-card" href="https://owasp.org/www-community/attacks/xss/" target="_blank" rel="noopener"><span class="lc-ico">💉</span><span class="lc-body"><span class="lc-title">OWASP — Cross-site scripting</span><span class="lc-sub">owasp.org · Why an uploaded file rendered on your origin is the same bug</span></span></a>
<a class="link-card" href="/courses/nextjs/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Next.js</span><span class="lc-sub">Content-hashed filenames, and what the framework emits for you</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Run the six probes, find the cached 404 yourself, then fix it with one word</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Một khối tĩnh cho production, ráp lại và đem đo</h2>
<p class="lead">Bốn bài toàn là các mảnh rời. Đây là chúng gộp thành MỘT cấu hình cho một site thực tế — một ứng dụng một-trang có tài nguyên băm nội dung, một điểm vào HTML, và một thư mục tệp người dùng tải lên — kèm phép đo TỪNG tuyến sau đó. Phép đo cuối cùng đã tìm ra một con lỗi trong chính cái cấu hình viết ngay phía trên nó, và nó được GIỮ NGUYÊN vì đó là thứ hữu ích nhất trong cả bài.</p>

<h3>Cấu hình</h3>
<pre><code>http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;   <span class="tok-comment"># KHÔNG phải text/plain (4.1)</span>

  sendfile on; tcp_nopush on; tcp_nodelay on;          <span class="tok-comment"># 4.4</span>
  open_file_cache max=10000 inactive=60s;
  open_file_cache_valid 30s;
  open_file_cache_min_uses 2;
  open_file_cache_errors on;

  gzip on; gzip_vary on; gzip_comp_level 5;            <span class="tok-comment"># 4.3</span>
  gzip_min_length 256;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_static on;

  server {
    listen 443 ssl default_server;
    server_name vidu.com;
    root /srv/site;

    <span class="tok-comment"># Tài nguyên CÓ BĂM: một năm, immutable (4.2)</span>
    location /tinh/ {
      add_header Cache-Control "public, max-age=31536000, immutable";
      add_header X-Content-Type-Options "nosniff" always;
      try_files \$uri =404;
    }

    <span class="tok-comment"># Tệp NGƯỜI DÙNG tải lên: không bao giờ được dựng ra trong trình duyệt</span>
    location /tai-len/ {
      types { }                             <span class="tok-comment"># bỏ hẳn bảng mime</span>
      default_type application/octet-stream;
      add_header Content-Disposition "attachment" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header Cache-Control "public, max-age=604800";
      try_files \$uri =404;
    }

    <span class="tok-comment"># HTML: luôn hỏi lại</span>
    location = /index.html {
      add_header Cache-Control "no-cache";
      add_header X-Content-Type-Options "nosniff" always;
    }

    <span class="tok-comment"># SPA: mọi đường dẫn khác về index.html (2.5)</span>
    location / { try_files \$uri \$uri/ /index.html; }
  }
}</code></pre>

<h3>Từng tuyến, đo thật</h3>
<div class="out">tai nguyen co bam   200  application/javascript  Content-Encoding: gzip
                         Cache-Control: public, max-age=31536000, immutable
                         X-Content-Type-Options: nosniff

index.html          200  text/html    Cache-Control: no-cache

duong dan SPA       200  text/html    Cache-Control: no-cache
                         ETag y HET index.html  &lt;- try_files DA chuyen huong noi bo
                         va khop LAI vao khoi = /index.html

anh tai len         200  application/octet-stream
                         Content-Disposition: attachment
                         X-Content-Type-Options: nosniff

tep tai len "la"    200  application/octet-stream   &lt;- noi dung la &lt;script&gt;
                         Content-Disposition: attachment
                         (trinh duyet TAI VE, khong dung ra)

tep khong ton tai   404  Cache-Control: public, max-age=31536000, immutable
                              ^^^^^^^^ DAY LA MOT CON LOI</div>
<div class="callout ok">
<p><strong>Dòng SPA chính là Bài 2.5 đang sinh lời, và nó đáng được chỉ tận tay.</strong> Một request tới <code>/bat-ky/duong-dan</code> khớp <code>location /</code>, không tìm thấy tệp nào, rồi rơi xuống <code>/index.html</code>. Cái dự phòng đó là một cú chuyển hướng NỘI BỘ, nên phép khớp location chạy LẠI và request rơi vào <code>location = /index.html</code> — và đó là lý do nó quay ra với <code>no-cache</code> chứ không phải với thứ mà <code>location /</code> sẽ cho nó. Cái <code>ETag</code> giống HỆT <code>/index.html</code> thật, xác nhận đó đúng là cùng một tệp đi qua cùng một khối. Sắp xếp theo kiểu này nghĩa là cái luật cache cho HTML của bạn chỉ viết MỘT lần và tự động áp cho MỌI tuyến của SPA.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — cú 404 quay ra kèm một cái cache MỘT NĂM immutable, và thủ phạm là chữ <code>always</code>.</strong> Bản đầu của cái khối ở trên viết <code>add_header Cache-Control "..." always;</code>, mà <code>always</code> nghĩa là "trên MỌI phản hồi, kể cả lỗi". Nên một trình duyệt xin một tài nguyên có băm trong lúc deploy đang dở dang — HTML đã cập nhật, tài nguyên chưa kịp lên — sẽ CACHE cái <code>404</code> đó suốt một năm. Site của người dùng ấy hỏng cho tới khi họ tự xoá bộ đệm, và KHÔNG lần deploy nào chữa được, vì trình duyệt sẽ không hỏi lại nữa. Đo lại sau khi bỏ chữ <code>always</code> khỏi đúng một dòng đó: cú <code>404</code> không mang <code>Cache-Control</code> nào cả, còn cú <code>200</code> vẫn mang trọn một năm. <strong>Luật: <code>always</code> thuộc về header BẢO MẬT, thứ bắt buộc phải áp cả cho trang lỗi, và KHÔNG được nằm trên <code>Cache-Control</code>, nơi nó đem cache luôn những lần bạn thất bại.</strong></p>
</div>
<div class="out">SAU KHI bo chu "always" khoi dong Cache-Control:

  404: HTTP/1.1 404 Not Found        (khong con Cache-Control)
  200: HTTP/1.1 200 OK               Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options tren 404: VAN CO (vi no van giu "always")</div>

<h3>Vì sao khối tệp tải lên trông như thế</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">types { } làm RỖNG bảng MIME cho riêng location đó</span><span class="lz-lnote">Đi cùng <code>default_type application/octet-stream</code> thì MỌI tệp tải lên đều được công bố là nhị phân, bất kể phần đuôi của nó là gì. Một tệp <code>.html</code> hay <code>.svg</code> tải lên khi ấy KHÔNG dựng được thành tài liệu trên gốc của bạn, mà đó chính là thứ biến một tính năng tải lên thành XSS lưu trữ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Content-Disposition: attachment là cái khoá thứ hai</span><span class="lz-lnote">Nó bảo trình duyệt TẢI VỀ chứ đừng hiển thị, kể cả với những kiểu mà bình thường nó sẽ dựng ra. Thắt lưng kèm dây đeo quần, vì hai cơ chế này hỏng theo hai kiểu khác nhau và tệp tải lên là chỗ DUY NHẤT bạn muốn có cả hai.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một GỐC riêng mới là cách chữa thật</span><span class="lz-lnote">Phục vụ tệp tải lên từ <code>files.vidu.com</code> thay vì <code>vidu.com/tai-len/</code> nghĩa là kể cả một tài liệu có được dựng ra thì nó cũng không chạm nổi vào cookie hay DOM của bạn. Hai cái header ở trên là thứ bạn làm TRONG LÚC chưa làm được điều đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">try_files $uri =404 chứ không phải một cái dự phòng</span><span class="lz-lnote">Một tệp tải lên bị thiếu thì phải là <code>404</code>, không phải cái vỏ SPA của bạn. Thiếu dòng <code>=404</code> tường minh thì request sẽ rơi xuống <code>location /</code> và trả về <code>index.html</code> với mã <code>200</code> — một trang HTML ở chỗ lẽ ra phải là một tấm ảnh.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hãy kiểm phản hồi LỖI, đừng chỉ kiểm phản hồi thành công</span><span class="v">Đây là dạng tổng quát của con lỗi ở trên. Khi rà một cấu hình tĩnh, hãy gọi MỘT đường dẫn không tồn tại trong TỪNG location rồi đọc header. Thứ gì bị cache, thứ gì rò rỉ, thứ gì sai mã trạng thái đều dễ thấy ở đó hơn là trên con đường êm đẹp.</span></div>
  <div class="kv"><span class="k">Mỗi location CHÉP LẠI những header nó cần</span><span class="v">Vì cái luật thay-thế-mảng ở Bài 2.3. Trong một cấu hình thật thì bộ dùng chung nằm trong một file snippet và mọi khối đều include nó — ở đây viết dài ra để bạn nhìn thấy CHÍNH XÁC mỗi khối gửi cái gì.</span></div>
  <div class="kv"><span class="k">Thứ tự các khối location KHÔNG có nghĩa lý</span><span class="v">Ba tiền tố và một khớp chính xác. Theo Bài 2.1, tiền tố đua nhau bằng độ dài còn <code>=</code> thì đoản mạch, nên cấu hình này cư xử y hệt dù bạn sắp xếp thế nào. Đó là một tính chất đáng có với một file mà người khác sẽ vào sửa.</span></div>
  <div class="kv"><span class="k">Mỗi tuyến một phép đo là XONG cả buổi rà soát</span><span class="v">Sáu lệnh <code>curl -I</code> phủ hết mọi đường đi qua cấu hình này, kể cả đường hỏng. Nó nhanh hơn ngồi đọc file, và nó là cách DUY NHẤT bắt được một cái header tới từ một module chứ không tới từ một dòng bạn viết.</span></div>
</div>
<div class="note-ct">
<p><strong>Vì sao con lỗi được giữ nguyên trong bài.</strong> Nó KHÔNG phải cài cắm. Cấu hình được viết ra từ bốn bài trước, nó trông đúng, nó qua được <code>nginx -t</code>, và năm trên sáu tuyến hoàn hảo. Chỉ cần MỘT request tới một đường dẫn không tồn tại là lòi ra một kiểu hỏng mà ngoài production sẽ vô hình cho tới khi có người dùng kêu rằng trang của họ hỏng vĩnh viễn. Đó là lý lẽ cho việc đo cả đường LỖI, và một ví dụ nói điều đó hay hơn một lời khẳng định.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">nginx — add_header và cờ always</span><span class="lc-sub">nginx.org · Chính xác mỗi dạng áp cho những mã trạng thái nào</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition" target="_blank" rel="noopener"><span class="lc-ico">📎</span><span class="lc-body"><span class="lc-title">MDN — Content-Disposition</span><span class="lc-sub">developer.mozilla.org · attachment và inline, và chuyện xử lý filename</span></span></a>
<a class="link-card" href="https://owasp.org/www-community/attacks/xss/" target="_blank" rel="noopener"><span class="lc-ico">💉</span><span class="lc-body"><span class="lc-title">OWASP — Cross-site scripting</span><span class="lc-sub">owasp.org · Vì sao một tệp tải lên được dựng ra trên gốc của bạn cũng là con lỗi ấy</span></span></a>
<a class="link-card" href="/courses/nextjs/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Next.js</span><span class="lc-sub">Tên tệp băm theo nội dung, và framework tự sinh ra gì cho bạn</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Chạy sáu phép dò, tự tìm ra cú 404 bị cache, rồi vá nó bằng một chữ</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Quiz: static files|||4.6 — Quiz: tệp tĩnh',
      slug: 'nginx-4-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về kiểu nội dung, ETag dựng từ mtime, nén trả trước, syscall của sendfile và open_file_cache, và cái chữ always làm cache luôn một cú 404.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.6</span>
<h2>Quiz: static files</h2>
<p class="lead">Eight questions, all from measurements. Two of them describe bugs that produce a correct-looking site and a broken experience for some users only, which is the kind worth being able to recognise.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> <code>Content-Type</code> comes from an extension lookup and nothing else, so an unknown extension falls to <code>default_type</code> — which defaults to <code>text/plain</code> and is the wrong default anywhere users can upload; and a directory with no index and no <code>autoindex</code> answers <code>403</code>, not <code>404</code> (4.1). The <code>ETag</code> is exactly <code>hex(mtime)-hex(size)</code>, proven character by character, so <code>touch</code> alone changes it and a client holding the old one re-downloads the whole file — which is what every deploy that re-creates files does to every cached asset (4.2). On-the-fly gzip cost about 3.9ms per request on a 125KB file at level 5 and produced a <em>larger</em> result than a pre-built <code>gzip -9</code> file that <code>gzip_static</code> serves for about 0.2ms, and it also weakens the ETag and removes <code>Content-Length</code> (4.3). <code>sendfile</code> turned 186 syscalls into 3 for three 2MB requests, and <code>open_file_cache</code> removed every <code>openat</code> and <code>fstat</code> — while a wall-clock benchmark of the same thing showed nothing, because process startup dominated it (4.4). And assembling all of it produced one real bug: <code>always</code> on <code>Cache-Control</code> cached a <code>404</code> for a year (4.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.6</span>
<h2>Quiz: tệp tĩnh</h2>
<p class="lead">Tám câu, tất cả đều ra từ phép đo. Hai câu mô tả những con lỗi tạo ra một site TRÔNG có vẻ đúng nhưng hỏng với MỘT SỐ người dùng thôi, và đó là loại đáng học để nhận ra được.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> <code>Content-Type</code> tới từ việc tra PHẦN ĐUÔI và không tới từ gì khác, nên một đuôi lạ rơi về <code>default_type</code> — thứ mặc định là <code>text/plain</code> và là mặc định SAI ở bất cứ đâu người dùng tải tệp lên được; và một thư mục không có index lẫn <code>autoindex</code> trả lời <code>403</code> chứ không phải <code>404</code> (4.1). <code>ETag</code> đúng bằng <code>hex(mtime)-hex(size)</code>, chứng minh khớp từng ký tự, nên chỉ một lệnh <code>touch</code> cũng làm nó đổi và client cầm cái cũ phải tải lại NGUYÊN tệp — mà đó chính là điều mọi lần deploy tạo lại tệp làm với mọi tài nguyên đang nằm trong bộ đệm (4.2). Nén tại chỗ tốn chừng 3,9ms mỗi request trên một tệp 125KB ở mức 5 và cho ra kết quả TO HƠN một tệp <code>gzip -9</code> dựng sẵn mà <code>gzip_static</code> phục vụ chỉ tốn chừng 0,2ms, đồng thời nó còn làm YẾU ETag và làm mất <code>Content-Length</code> (4.3). <code>sendfile</code> biến 186 syscall thành 3 cho ba request tệp 2MB, còn <code>open_file_cache</code> xoá sạch mọi <code>openat</code> và <code>fstat</code> — trong khi một phép bấm giờ cho đúng chuyện đó thì KHÔNG thấy gì, vì chi phí khởi động tiến trình đè lên tất cả (4.4). Và ráp tất cả lại thì lòi ra một con lỗi thật: chữ <code>always</code> trên <code>Cache-Control</code> đã cache một cú <code>404</code> suốt một năm (4.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You serve user uploads and http { } does not set default_type. A user uploads a file with no extension containing HTML. What happens?|||Bạn phục vụ tệp người dùng tải lên và khối http { } không đặt default_type. Một người dùng tải lên một tệp KHÔNG có phần đuôi, bên trong là HTML. Chuyện gì xảy ra?',
            options: [
              'Nginx sniffs the content and serves it as text/html|||Nginx đánh hơi nội dung và phục vụ nó dạng text/html',
              'It is served as text/plain — the built-in default — and a browser may render the markup on your origin, which is stored XSS|||Nó được phục vụ dạng text/plain — mặc định có sẵn — và trình duyệt có thể dựng cái đánh dấu đó ngay trên gốc của bạn, tức là XSS lưu trữ',
              'Nginx returns 415 Unsupported Media Type|||Nginx trả về 415 Unsupported Media Type',
              'It is refused because the extension is missing|||Nó bị từ chối vì thiếu phần đuôi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A request hits a directory that exists, has no index file, and autoindex is off. What status comes back?|||Một request tới một thư mục CÓ THẬT, không có tệp index, và autoindex đang tắt. Mã trạng thái nào quay ra?',
            options: [
              '404 Not Found|||404 Not Found',
              '403 Forbidden — the path exists and Nginx refuses to describe it, which also reveals that the directory is there|||403 Forbidden — đường dẫn có thật và Nginx từ chối mô tả nó, và điều đó cũng để lộ rằng thư mục đó tồn tại',
              '200 with an empty body|||200 với thân rỗng',
              '301 to the parent directory|||301 về thư mục cha',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your deploy runs git clone into a fresh directory. File contents are byte-identical to last week. What do returning visitors experience?|||Lần deploy của bạn chạy git clone vào một thư mục mới. Nội dung tệp giống hệt tuần trước từng byte. Khách quay lại trải nghiệm điều gì?',
            options: [
              '304 responses; nothing is re-downloaded|||Toàn 304; không có gì phải tải lại',
              'Full re-downloads — mtime changed, so the ETag changed, and the ETag is hex(mtime)-hex(size) rather than a content hash|||Tải lại TOÀN BỘ — mtime đã đổi nên ETag đổi, mà ETag là hex(mtime)-hex(size) chứ không phải một băm nội dung',
              'Nothing changes because Last-Modified is unchanged|||Không có gì đổi vì Last-Modified không đổi',
              'Only HTML is re-fetched|||Chỉ HTML là được lấy lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You write expires 1y; and add_header Cache-Control "public, max-age=31536000, immutable"; in the same block. What does the client receive?|||Bạn viết expires 1y; và add_header Cache-Control "public, max-age=31536000, immutable"; trong CÙNG một khối. Client nhận được gì?',
            options: [
              'One merged Cache-Control header|||Một dòng Cache-Control đã hợp nhất',
              'Two separate Cache-Control headers — they come from different modules and do not merge; the client picks one|||HAI dòng Cache-Control riêng biệt — chúng tới từ hai module khác nhau và KHÔNG hợp nhất; client tự chọn một',
              'Only the add_header one; expires is overridden|||Chỉ cái của add_header; expires bị ghi đè',
              'Nginx refuses to start|||Nginx từ chối khởi động',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Compared with compressing on the fly, what does gzip_static give you?|||So với nén tại chỗ, gzip_static cho bạn cái gì?',
            options: [
              'The same file, slightly faster|||Cùng cái tệp đó, nhanh hơn một chút',
              'A smaller file (built at level 9) for near-zero per-request cost, plus a strong ETag and a real Content-Length|||Một tệp NHỎ HƠN (dựng ở mức 9) với chi phí mỗi request gần bằng không, kèm một ETag MẠNH và một Content-Length thật',
              'Better compression but higher CPU cost|||Nén tốt hơn nhưng tốn CPU hơn',
              'Nothing measurable|||Không có gì đo được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Three requests for a 2MB file produced 3 sendfile() calls with sendfile on and 186 writev() calls with it off. Why?|||Ba request tới một tệp 2MB sinh ra 3 lời gọi sendfile() khi sendfile bật và 186 lời gọi writev() khi tắt. Vì sao?',
            options: [
              'sendfile compresses the file first|||sendfile nén tệp lại trước',
              'Without it the worker reads the file into user space in ~32KB buffers and writes each one out; with it the kernel moves data straight from the page cache to the socket|||Không có nó thì worker ĐỌC tệp vào không gian người dùng theo từng đệm ~32KB rồi GHI từng cái ra; có nó thì nhân chuyển dữ liệu thẳng từ bộ đệm trang ra socket',
              'writev is a slower version of the same call|||writev là phiên bản chậm hơn của cùng lời gọi ấy',
              'The file was cached differently|||Cái tệp được cache theo cách khác',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You delete a leaked file from disk. open_file_cache_valid is 30s. Is it gone from the site immediately?|||Bạn xoá một tệp bị lộ khỏi đĩa. open_file_cache_valid là 30s. Nó biến khỏi site ngay lập tức chứ?',
            options: [
              'Yes; deleting the file is enough|||Có; xoá tệp là đủ',
              'No — the cached descriptor stays valid after an unlink on Unix, so it can keep being served for up to the validity window; reload Nginx to be sure|||Không — trên Unix, mô tả tệp đã cache vẫn hợp lệ sau khi unlink, nên nó có thể tiếp tục được phục vụ tới hết cửa sổ hiệu lực; hãy nạp lại Nginx cho chắc',
              'Only if open_file_cache_errors is on|||Chỉ khi open_file_cache_errors đang bật',
              'It returns 500 until the cache expires|||Nó trả 500 cho tới khi cache hết hạn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'add_header Cache-Control "public, max-age=31536000, immutable" always; on a hashed-asset location. What did the measurement reveal?|||add_header Cache-Control "public, max-age=31536000, immutable" always; trên một location tài nguyên có băm. Phép đo phơi ra điều gì?',
            options: [
              'Nothing; always is required for the header to appear|||Không gì cả; always là bắt buộc để header hiện ra',
              'The 404 for a missing asset also got the one-year immutable cache, so a browser that asked during a partial deploy caches the failure for a year|||Cú 404 của một tài nguyên bị thiếu CŨNG nhận cái cache một năm immutable, nên một trình duyệt hỏi trúng lúc deploy dở dang sẽ cache luôn cái thất bại đó suốt một năm',
              'The header was dropped on 200 responses|||Header bị bỏ trên các phản hồi 200',
              'always only affects redirects|||always chỉ ảnh hưởng tới các cú chuyển hướng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
