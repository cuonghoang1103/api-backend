import G04_1 from './giang/ngx-04-1.mjs';
import G04_2 from './giang/ngx-04-2.mjs';
import G04_3 from './giang/ngx-04-3.mjs';
import G04_4 from './giang/ngx-04-4.mjs';
import G04_5 from './giang/ngx-04-5.mjs';
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
${G04_1}
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

<h3>Content-Type, measured across six files and two servers</h3>
<div class="out">$ for f in …; do printf '%-13s 8080 -&gt; %-26s 8081 -&gt; %s\\n' $f "$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8080/$f)" "$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8081/$f)"; done
trang.html    8080 -&gt; text/html                  8081 -&gt; text/html
nho.txt       8080 -&gt; text/plain                 8081 -&gt; text/plain
lon.bin       8080 -&gt; application/octet-stream   8081 -&gt; application/octet-stream
khong-duoi    8080 -&gt; text/plain                 8081 -&gt; application/octet-stream
la.xyz123     8080 -&gt; text/plain                 8081 -&gt; application/octet-stream
tep/anh.svg   8080 -&gt; image/svg+xml              8081 -&gt; image/svg+xml

$ curl -sI -H 'Range: bytes=0-99' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Length|Content-Range)'
HTTP/1.1 206 Partial Content
Content-Length: 100
Content-Range: bytes 0-99/2000000
$ curl -sI -H 'Range: bytes=0-9,100-109' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Type|Content-Length)'
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000000000000000001
Content-Length: 256</div>
<div class="pitfall">
<p><strong>Trap — <code>default_type</code> defaults to <code>text/plain</code>, and that is the wrong default for a file server.</strong> If your <code>http</code> block does not set it, an unknown extension is announced as text, and a browser will happily render a downloaded file as a page. Serve user-uploaded content that way and an uploaded <code>.svg</code> or an extension you forgot becomes stored XSS: the browser renders attacker markup on your origin. Two things together fix it — <code>default_type application/octet-stream;</code> so unknown types download rather than render, and <code>add_header X-Content-Type-Options "nosniff" always;</code> so the browser does not second-guess you. Both are one line, and for a route that serves uploads they are not optional. Measured above: port 8080 (no <code>default_type</code>) announced <code>khong-duoi</code> and <code>la.xyz123</code> as <code>text/plain</code>; port 8081 sent the same files as <code>application/octet-stream</code>. Ubuntu's packaged <code>nginx.conf</code> already sets that line — a config written from scratch does not.</p>
<p><strong>And neither line saves an SVG.</strong> <code>.svg</code> is a KNOWN extension: both servers answered <code>image/svg+xml</code>, so <code>default_type</code> is never consulted and <code>nosniff</code> has nothing to correct — opened directly, the script inside runs on your origin. For user uploads, empty the table for that location (<code>types { }</code>) and force a download with <code>Content-Disposition: attachment</code>; Lesson 4.5 measures that block.</p>
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

<h3>🔬 Run it yourself</h3>
<p>Two servers over the same six files — one with no <code>default_type</code>, one with octet-stream and nosniff — plus listings, ranges and a gzip server, on nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  include      /etc/nginx/mime.types;
  access_log   off;
  server {
    listen 8080;                     <span class="tok-comment">  # KHÔNG khai default_type ⇒ mặc định của nginx</span>
    root /srv/www;
    location /liet-ke/      { autoindex on; }
    location /liet-ke-json/ { alias /srv/www/liet-ke/; autoindex on; autoindex_format json; }
  }
  server {
    listen 8081;
    root /srv/www;
    default_type application/octet-stream;
    add_header X-Content-Type-Options "nosniff" always;
  }
}</code></pre>
<pre><code class="language-bash">pid       /srv/logs/gz.pid;
error_log /srv/logs/error.log;
events {}
http {
  include /etc/nginx/mime.types;
  access_log off;
  server {
    listen 8082; root /srv/www;
    gzip on; gzip_min_length 1;    <span class="tok-comment">  # text/html luôn nằm trong gzip_types</span>
  }
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:8080/trang.html | grep -vE '^(Date|Connection)'
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: text/html
Content-Length: 27026
Last-Modified: Thu, 12 Nov 2026 13:54:46 GMT
ETag: "6af5c526-6992"
Accept-Ranges: bytes
$ for f in trang.html nho.txt lon.bin khong-duoi la.xyz123 tep/anh.svg; do printf '%-13s 8080 -&gt; %-26s 8081 -&gt; %s\\n' $f "$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8080/$f)" "$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8081/$f)"; done
trang.html    8080 -&gt; text/html                  8081 -&gt; text/html
nho.txt       8080 -&gt; text/plain                 8081 -&gt; text/plain
lon.bin       8080 -&gt; application/octet-stream   8081 -&gt; application/octet-stream
khong-duoi    8080 -&gt; text/plain                 8081 -&gt; application/octet-stream
la.xyz123     8080 -&gt; text/plain                 8081 -&gt; application/octet-stream
tep/anh.svg   8080 -&gt; image/svg+xml              8081 -&gt; image/svg+xml
$ grep -n 'default_type' /etc/nginx/nginx.conf
27:	default_type application/octet-stream;
=== autoindex on ===
$ curl -s http://127.0.0.1:8080/liet-ke/
&lt;html&gt;
&lt;head&gt;&lt;title&gt;Index of /liet-ke/&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Index of /liet-ke/&lt;/h1&gt;&lt;hr&gt;&lt;pre&gt;&lt;a href="../"&gt;../&lt;/a&gt;
&lt;a href="a.txt"&gt;a.txt&lt;/a&gt;                                              12-Nov-2026 13:54                   2
&lt;a href="b.txt"&gt;b.txt&lt;/a&gt;                                              12-Nov-2026 13:54                   2
&lt;/pre&gt;&lt;hr&gt;&lt;/body&gt;
&lt;/html&gt;
=== autoindex_format json ===
$ curl -s http://127.0.0.1:8080/liet-ke-json/
[
{ "name":"a.txt", "type":"file", "mtime":"Thu, 12 Nov 2026 13:54:46 GMT", "size":2 },
{ "name":"b.txt", "type":"file", "mtime":"Thu, 12 Nov 2026 13:54:46 GMT", "size":2 }
]
=== KHONG autoindex, thu muc KHONG co index.html ===
$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/rong/
403
$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/khong-co-thu-muc-nay/
404
$ curl -sI -H 'Range: bytes=0-99' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Length|Content-Range)'
HTTP/1.1 206 Partial Content
Content-Length: 100
Content-Range: bytes 0-99/2000000
$ curl -sI -H 'Range: bytes=0-9,100-109' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Type|Content-Length)'
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000000000000000001
Content-Length: 256
$ curl -s -o /dev/null -D - -H 'Range: bytes=0-99' http://127.0.0.1:8082/trang.html | grep -E '^(HTTP|Content-Range|Content-Encoding)'
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-99/27026
$ curl -s -o /dev/null -D - -H 'Range: bytes=0-99' -H 'Accept-Encoding: gzip' http://127.0.0.1:8082/trang.html | grep -E '^(HTTP|Content-Range|Content-Encoding)'
HTTP/1.1 200 OK
Content-Encoding: gzip</div>
<p>Unknown and missing extensions were <code>text/plain</code> until <code>default_type</code> said otherwise; the SVG stayed <code>image/svg+xml</code> on both; an empty directory answered 403 and a missing one 404; one range gave 206, two gave <code>multipart/byteranges</code>; and with <code>Accept-Encoding: gzip</code> the same range came back 200 with the whole file compressed.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Headers that change behaviour</span><span class="lc-sub">Content-Type, caching, compression and security headers</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-1-header-csp-cors" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 9.1 — Security headers, CSP and CORS</span><span class="lc-sub">nosniff and friends from the application side</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mime.types</span><span class="v">The plain extension-to-type table Nginx consults to set <code>Content-Type</code> — no sniffing, no reading the file.</span></div>
  <div class="kv"><span class="k">default_type</span><span class="v">The type used when the extension is unknown or absent; it defaults to <code>text/plain</code>.</span></div>
  <div class="kv"><span class="k">nosniff</span><span class="v"><code>X-Content-Type-Options: nosniff</code> tells the browser not to second-guess the declared type — essential on upload routes.</span></div>
  <div class="kv"><span class="k">index</span><span class="v">The ordered list of files tried for a directory request; order matters and the list should stay short.</span></div>
  <div class="kv"><span class="k">autoindex</span><span class="v">Off by default; turned on it lists every filename in a directory, including the backup someone forgot.</span></div>
  <div class="kv"><span class="k">Accept-Ranges / 206</span><span class="v">Nginx advertising it can serve a byte slice; a <code>Range</code> request then returns <code>206 Partial Content</code>.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li><code>Content-Type</code> is decided by the file extension alone, looked up in <code>mime.types</code>; an unknown extension falls to <code>default_type</code>.</li><li>On any route serving uploads, set <code>default_type application/octet-stream</code> plus <code>nosniff</code> so a stray file downloads instead of rendering as a page.</li><li>A directory with no index file and <code>autoindex</code> off answers <code>403</code>, not <code>404</code> — and that leaks its existence.</li><li>Range requests are on by default and make video seeking and resumable downloads work; they do not combine with on-the-fly compression.</li><li>Check a new static route with one <code>curl -I</code> per file type: Content-Type, ETag, Accept-Ranges, Cache-Control.</li></ul>

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

<h3>Content-Type, đo trên sáu tệp và hai máy chủ</h3>
<div class="out">$ for f in …; do printf '%-13s 8080 -&gt; %-26s 8081 -&gt; %s\\n' $f "$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8080/$f)" "$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8081/$f)"; done
trang.html    8080 -&gt; text/html                  8081 -&gt; text/html
nho.txt       8080 -&gt; text/plain                 8081 -&gt; text/plain
lon.bin       8080 -&gt; application/octet-stream   8081 -&gt; application/octet-stream
khong-duoi    8080 -&gt; text/plain                 8081 -&gt; application/octet-stream
la.xyz123     8080 -&gt; text/plain                 8081 -&gt; application/octet-stream
tep/anh.svg   8080 -&gt; image/svg+xml              8081 -&gt; image/svg+xml

$ curl -sI -H 'Range: bytes=0-99' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Length|Content-Range)'
HTTP/1.1 206 Partial Content
Content-Length: 100
Content-Range: bytes 0-99/2000000
$ curl -sI -H 'Range: bytes=0-9,100-109' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Type|Content-Length)'
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000000000000000001
Content-Length: 256</div>
<div class="pitfall">
<p><strong>Bẫy — <code>default_type</code> mặc định là <code>text/plain</code>, và đó là mặc định SAI cho một máy chủ tệp.</strong> Nếu khối <code>http</code> của bạn không đặt nó thì một phần đuôi lạ sẽ được công bố là VĂN BẢN, và trình duyệt sẽ vui vẻ dựng cái tệp vừa tải thành một trang web. Đem cách đó phục vụ nội dung do người dùng tải lên là một cái <code>.svg</code> hay một phần đuôi bạn quên trở thành XSS lưu trữ: trình duyệt dựng đánh dấu của kẻ tấn công ngay trên gốc của bạn. Hai thứ đi cùng nhau chữa được — <code>default_type application/octet-stream;</code> để kiểu lạ thì TẢI VỀ chứ không dựng ra, và <code>add_header X-Content-Type-Options "nosniff" always;</code> để trình duyệt đừng đoán lại thay bạn. Cả hai đều một dòng, và với một tuyến phục vụ tệp tải lên thì chúng KHÔNG phải tuỳ chọn. Đo ở trên: cổng 8080 (không khai <code>default_type</code>) công bố <code>khong-duoi</code> và <code>la.xyz123</code> là <code>text/plain</code>; cổng 8081 gửi chính các tệp đó dưới dạng <code>application/octet-stream</code>. Tệp <code>nginx.conf</code> đóng gói sẵn của Ubuntu đã có dòng ấy — một cấu hình tự viết từ đầu thì KHÔNG.</p>
<p><strong>Và cả hai dòng đều KHÔNG cứu được một tệp SVG.</strong> <code>.svg</code> là phần đuôi ĐÃ BIẾT: cả hai máy chủ đều trả <code>image/svg+xml</code>, nên <code>default_type</code> không bao giờ được hỏi tới và <code>nosniff</code> chẳng có gì để sửa — mở thẳng ra là script bên trong chạy trên chính gốc của bạn. Với tệp người dùng tải lên: làm rỗng bảng kiểu ở location đó (<code>types { }</code>) và ép tải về bằng <code>Content-Disposition: attachment</code>; Bài 4.5 đo đúng khối ấy.</p>
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

<h3>🔬 Tự chạy lại</h3>
<p>Hai máy chủ trên cùng sáu tệp — một cái không khai <code>default_type</code>, một cái có octet-stream và nosniff — cộng danh sách thư mục, dải byte và một máy nén gzip, trên nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  include      /etc/nginx/mime.types;
  access_log   off;
  server {
    listen 8080;                     <span class="tok-comment">  # KHÔNG khai default_type ⇒ mặc định của nginx</span>
    root /srv/www;
    location /liet-ke/      { autoindex on; }
    location /liet-ke-json/ { alias /srv/www/liet-ke/; autoindex on; autoindex_format json; }
  }
  server {
    listen 8081;
    root /srv/www;
    default_type application/octet-stream;
    add_header X-Content-Type-Options "nosniff" always;
  }
}</code></pre>
<pre><code class="language-bash">pid       /srv/logs/gz.pid;
error_log /srv/logs/error.log;
events {}
http {
  include /etc/nginx/mime.types;
  access_log off;
  server {
    listen 8082; root /srv/www;
    gzip on; gzip_min_length 1;    <span class="tok-comment">  # text/html luôn nằm trong gzip_types</span>
  }
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:8080/trang.html | grep -vE '^(Date|Connection)'
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: text/html
Content-Length: 27026
Last-Modified: Thu, 12 Nov 2026 13:54:46 GMT
ETag: "6af5c526-6992"
Accept-Ranges: bytes
$ for f in trang.html nho.txt lon.bin khong-duoi la.xyz123 tep/anh.svg; do printf '%-13s 8080 -&gt; %-26s 8081 -&gt; %s\\n' $f "$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8080/$f)" "$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8081/$f)"; done
trang.html    8080 -&gt; text/html                  8081 -&gt; text/html
nho.txt       8080 -&gt; text/plain                 8081 -&gt; text/plain
lon.bin       8080 -&gt; application/octet-stream   8081 -&gt; application/octet-stream
khong-duoi    8080 -&gt; text/plain                 8081 -&gt; application/octet-stream
la.xyz123     8080 -&gt; text/plain                 8081 -&gt; application/octet-stream
tep/anh.svg   8080 -&gt; image/svg+xml              8081 -&gt; image/svg+xml
$ grep -n 'default_type' /etc/nginx/nginx.conf
27:	default_type application/octet-stream;
=== autoindex on ===
$ curl -s http://127.0.0.1:8080/liet-ke/
&lt;html&gt;
&lt;head&gt;&lt;title&gt;Index of /liet-ke/&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Index of /liet-ke/&lt;/h1&gt;&lt;hr&gt;&lt;pre&gt;&lt;a href="../"&gt;../&lt;/a&gt;
&lt;a href="a.txt"&gt;a.txt&lt;/a&gt;                                              12-Nov-2026 13:54                   2
&lt;a href="b.txt"&gt;b.txt&lt;/a&gt;                                              12-Nov-2026 13:54                   2
&lt;/pre&gt;&lt;hr&gt;&lt;/body&gt;
&lt;/html&gt;
=== autoindex_format json ===
$ curl -s http://127.0.0.1:8080/liet-ke-json/
[
{ "name":"a.txt", "type":"file", "mtime":"Thu, 12 Nov 2026 13:54:46 GMT", "size":2 },
{ "name":"b.txt", "type":"file", "mtime":"Thu, 12 Nov 2026 13:54:46 GMT", "size":2 }
]
=== KHONG autoindex, thu muc KHONG co index.html ===
$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/rong/
403
$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/khong-co-thu-muc-nay/
404
$ curl -sI -H 'Range: bytes=0-99' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Length|Content-Range)'
HTTP/1.1 206 Partial Content
Content-Length: 100
Content-Range: bytes 0-99/2000000
$ curl -sI -H 'Range: bytes=0-9,100-109' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Type|Content-Length)'
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000000000000000001
Content-Length: 256
$ curl -s -o /dev/null -D - -H 'Range: bytes=0-99' http://127.0.0.1:8082/trang.html | grep -E '^(HTTP|Content-Range|Content-Encoding)'
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-99/27026
$ curl -s -o /dev/null -D - -H 'Range: bytes=0-99' -H 'Accept-Encoding: gzip' http://127.0.0.1:8082/trang.html | grep -E '^(HTTP|Content-Range|Content-Encoding)'
HTTP/1.1 200 OK
Content-Encoding: gzip</div>
<p>Phần đuôi lạ và không có đuôi đều là <code>text/plain</code> cho tới khi <code>default_type</code> nói khác; tệp SVG vẫn là <code>image/svg+xml</code> ở cả hai; thư mục rỗng trả 403 còn thư mục không có trả 404; một dải cho 206, hai dải cho <code>multipart/byteranges</code>; và kèm <code>Accept-Encoding: gzip</code> thì cùng dải đó về 200 với nguyên tệp đã nén.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Các header đổi hành vi</span><span class="lc-sub">Content-Type, cache, nén và header bảo mật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-1-header-csp-cors" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 9.1 — Header bảo mật, CSP và CORS</span><span class="lc-sub">nosniff và các header khác nhìn từ phía ứng dụng</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mime.types</span><span class="v">Bảng tra phần-đuôi-sang-kiểu mà Nginx dùng để đặt <code>Content-Type</code> — không đánh hơi, không đọc tệp.</span></div>
  <div class="kv"><span class="k">default_type</span><span class="v">Kiểu dùng khi phần đuôi lạ hoặc không có; mặc định là <code>text/plain</code>.</span></div>
  <div class="kv"><span class="k">nosniff</span><span class="v"><code>X-Content-Type-Options: nosniff</code> bảo trình duyệt đừng đoán lại kiểu đã khai — thiết yếu cho tuyến tải lên.</span></div>
  <div class="kv"><span class="k">index</span><span class="v">Danh sách tệp thử theo thứ tự cho một request tới thư mục; thứ tự có nghĩa lý và nên để ngắn.</span></div>
  <div class="kv"><span class="k">autoindex</span><span class="v">Mặc định tắt; bật lên thì liệt kê mọi tên tệp trong thư mục, kể cả bản sao lưu ai đó bỏ quên.</span></div>
  <div class="kv"><span class="k">Accept-Ranges / 206</span><span class="v">Nginx quảng cáo rằng nó phục vụ được một lát byte; một request <code>Range</code> khi ấy trả <code>206 Partial Content</code>.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li><code>Content-Type</code> do một mình phần đuôi quyết định, tra trong <code>mime.types</code>; đuôi lạ thì rơi về <code>default_type</code>.</li><li>Trên mọi tuyến phục vụ tệp tải lên, đặt <code>default_type application/octet-stream</code> kèm <code>nosniff</code> để một tệp lạ tải về chứ không dựng thành trang.</li><li>Một thư mục không có tệp index và <code>autoindex</code> tắt sẽ trả <code>403</code>, không phải <code>404</code> — và điều đó lộ ra rằng nó tồn tại.</li><li>Request theo dải byte bật sẵn và làm cho việc tua video và tải tiếp chạy được; nó không đi cùng phép nén tại chỗ.</li><li>Kiểm một tuyến tĩnh mới bằng một lệnh <code>curl -I</code> cho mỗi loại tệp: Content-Type, ETag, Accept-Ranges, Cache-Control.</li></ul>

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
${G04_2}
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
<p><strong>Trap — every deploy that re-creates files resets mtime, so every cached asset revalidates as a full download.</strong> A <code>git clone</code> or an <code>rsync</code> without <code>-t</code> stamps the current time onto files whose bytes never changed. (A Dockerfile <code>COPY</code> and <code>tar -x</code> KEEP the mtime they find — measured — but in CI what they find is usually a fresh clone, so the effect is the same.) Returning visitors then re-fetch your entire asset set. Worse, behind a load balancer two servers deployed a few seconds apart produce <em>different</em> ETags for the same bytes, so a client bouncing between them re-downloads on every alternation, forever, with nothing in your metrics saying why. Two fixes: give assets content-hashed filenames (<code>app.4f9a2c.js</code>) so the URL changes when the content does and the ETag stops mattering; or preserve mtimes across deploys — <code>rsync -a</code>, or a build that writes a stable timestamp. The first is better because it also lets you cache for a year.</p>
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
<pre><code class="language-bash"><span class="tok-comment"># The standard pair: HTML always revalidates, hashed assets cache for a year</span>
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

<h3>🔬 Run it yourself</h3>
<p>One file, three servers — validators on, <code>etag off</code>, and every form of <code>expires</code> — on nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  include /etc/nginx/mime.types;
  access_log off;
  server { listen 8080; root /srv/www; }
  server { listen 8081; root /srv/www; etag off; }
  server {
    listen 8082; root /srv/www;
    location /mac-dinh/ { alias /srv/www/; }
    location /off/      { alias /srv/www/; expires off; }
    location /am1/      { alias /srv/www/; expires -1; }
    location /khong/    { alias /srv/www/; expires 0; }
    location /30d/      { alias /srv/www/; expires 30d; }
    location /max/      { alias /srv/www/; expires max; }
    location /ca-hai/   { alias /srv/www/; expires 1y; add_header Cache-Control "public, max-age=31536000, immutable" always; }
  }
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:8080/trang.html | grep -E '^(ETag|Last-Modified)'
Last-Modified: Sun, 23 Aug 2026 17:02:43 GMT
ETag: "6a8b27b3-6992"
$ printf 'hex(mtime)-hex(size) = %x-%x\\n' $(stat -c '%Y %s' /srv/www/trang.html)
hex(mtime)-hex(size) = 6a8b27b3-6992
$ md5sum /srv/www/trang.html; curl -sI http://127.0.0.1:8080/trang.html | grep ETag
d0d64a23c28d66fdec7065b70db03d85  /srv/www/trang.html
ETag: "6a8b27b3-6992"
$ touch /srv/www/trang.html
$ md5sum /srv/www/trang.html; curl -sI http://127.0.0.1:8080/trang.html | grep ETag
d0d64a23c28d66fdec7065b70db03d85  /srv/www/trang.html
ETag: "6af5c561-6992"
=== client cu gui lai ETag CU ===
$ curl -s -o /dev/null -w 'ma=%{http_code}  tai=%{size_download} byte\\n' -H 'If-None-Match: "6a8b27b3-6992"' http://127.0.0.1:8080/trang.html
ma=200  tai=27026 byte
$ curl -s -o /dev/null -w 'khong dieu kien          -&gt; %{http_code}, %{size_download} byte\\n' http://127.0.0.1:8080/trang.html
khong dieu kien          -&gt; 200, 27026 byte
$ curl -s -o /dev/null -w 'If-None-Match dung       -&gt; %{http_code}, %{size_download} byte\\n' -H 'If-None-Match: "6a8b27b3-6992"' http://127.0.0.1:8080/trang.html
If-None-Match dung       -&gt; 304, 0 byte
$ curl -s -o /dev/null -w 'If-Modified-Since dung   -&gt; %{http_code}, %{size_download} byte\\n' -H 'If-Modified-Since: Sun, 23 Aug 2026 17:02:43 GMT' http://127.0.0.1:8080/trang.html
If-Modified-Since dung   -&gt; 304, 0 byte
$ curl -s -o /dev/null -w 'ETag SAI + ngay DUNG     -&gt; %{http_code}, %{size_download} byte\\n' -H 'If-None-Match: "khac"' -H 'If-Modified-Since: Sun, 23 Aug 2026 17:02:43 GMT' http://127.0.0.1:8080/trang.html
ETag SAI + ngay DUNG     -&gt; 200, 27026 byte
$ curl -sI http://127.0.0.1:8081/trang.html | grep -cE '^ETag'
0
$ for p in mac-dinh off am1 khong 30d max ca-hai; do echo "--- expires $p"; curl -sI http://127.0.0.1:8082/$p/trang.html | grep -E '^(Expires|Cache-Control)' ; done
--- expires mac-dinh
--- expires off
--- expires am1
Expires: Thu, 12 Nov 2026 13:55:45 GMT
Cache-Control: no-cache
--- expires khong
Expires: Thu, 12 Nov 2026 13:55:46 GMT
Cache-Control: max-age=0
--- expires 30d
Expires: Sat, 12 Dec 2026 13:55:46 GMT
Cache-Control: max-age=2592000
--- expires max
Expires: Thu, 31 Dec 2037 23:55:55 GMT
Cache-Control: max-age=315360000
--- expires ca-hai
Expires: Fri, 12 Nov 2027 13:55:47 GMT
Cache-Control: max-age=31536000
Cache-Control: public, max-age=31536000, immutable</div>
<p>The ETag matched <code>hex(mtime)-hex(size)</code> character for character; <code>touch</code> left the md5 unchanged and the ETag changed, so the old ETag earned a full 27,026-byte download; a wrong ETag with a correct date gave 200; and <code>expires 1y</code> plus <code>add_header Cache-Control</code> sent two Cache-Control lines.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 12.4 — CDN and static files</span><span class="lc-sub">Hashed assets and long caching on a real server</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Headers that change behaviour</span><span class="lc-sub">Cache-Control, ETag and revalidation on the wire</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ETag</span><span class="v">Built as <code>hex(mtime)-hex(size)</code> — it identifies the inode, not the content, so <code>touch</code> alone changes it.</span></div>
  <div class="kv"><span class="k">Last-Modified</span><span class="v">The file mtime, one-second resolution; the weaker of the two validators.</span></div>
  <div class="kv"><span class="k">Conditional request</span><span class="v"><code>If-None-Match</code> carries the ETag, <code>If-Modified-Since</code> the date; a match yields an empty <code>304</code>.</span></div>
  <div class="kv"><span class="k">expires</span><span class="v">Sets <code>Expires</code> and <code>Cache-Control: max-age</code>; combining it with a manual <code>add_header Cache-Control</code> emits two colliding headers.</span></div>
  <div class="kv"><span class="k">immutable</span><span class="v">Tells the browser never to revalidate — safe only with a content-hashed filename, and the thing <code>expires</code> cannot express.</span></div>
  <div class="kv"><span class="k">Content-hashed filename</span><span class="v"><code>app.4f9a2c.js</code> — the URL changes when the content does, so the ETag stops mattering and a year-long cache is safe.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>The ETag is exactly <code>hex(mtime)-hex(size)</code>, proven character by character; it tracks the inode, not the bytes.</li><li>Every deploy that re-creates files resets mtime, so cached assets re-download as full <code>200</code>s; behind a load balancer two servers even produce different ETags for the same bytes.</li><li>Fix it with content-hashed filenames (then cache a year <code>immutable</code>) or by preserving mtimes across deploys (<code>rsync -a</code>).</li><li>Conditional requests return a <code>304</code> with an empty body — that saves bandwidth, not the round trip.</li><li>Use <code>expires</code> alone or the manual header alone, never both; HTML gets <code>no-cache</code>, hashed assets get a year.</li></ul>

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
<p><strong>Bẫy — MỌI lần deploy tạo lại tệp đều đặt lại mtime, nên MỌI tài nguyên đang nằm trong bộ đệm đều phải tải lại nguyên vẹn.</strong> Một lệnh <code>git clone</code> hay một lệnh <code>rsync</code> thiếu <code>-t</code> đóng dấu thời điểm hiện tại lên những tệp mà byte của chúng chưa từng đổi. (Dòng <code>COPY</code> trong Dockerfile và <code>tar -x</code> thì GIỮ nguyên mtime chúng nhận được — đã đo — nhưng trên máy CI thứ chúng nhận thường là một bản clone vừa tạo, nên kết quả vẫn y như vậy.) Khách quay lại thế là tải lại TOÀN BỘ bộ tài nguyên của bạn. Tệ hơn nữa, đứng sau một bộ cân bằng tải thì hai máy chủ deploy cách nhau vài giây sinh ra ETag KHÁC NHAU cho cùng đám byte, nên một client nhảy qua lại giữa chúng sẽ tải lại ở mỗi lần đổi máy, MÃI MÃI, mà chẳng có số đo nào của bạn nói vì sao. Hai cách chữa: đặt tên tệp theo BĂM NỘI DUNG (<code>app.4f9a2c.js</code>) để URL đổi khi nội dung đổi và cái ETag thôi có nghĩa lý; hoặc GIỮ NGUYÊN mtime qua các lần deploy — <code>rsync -a</code>, hoặc một quy trình dựng ghi ra một dấu thời gian cố định. Cách đầu tốt hơn, vì nó còn cho phép bạn cache nguyên MỘT NĂM.</p>
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
<pre><code class="language-bash"><span class="tok-comment"># Cặp chuẩn: HTML luôn hỏi lại, tài nguyên có băm thì cache một năm</span>
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

<h3>🔬 Tự chạy lại</h3>
<p>Một tệp, ba máy chủ — có validator, <code>etag off</code>, và mọi cách viết <code>expires</code> — trên nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  include /etc/nginx/mime.types;
  access_log off;
  server { listen 8080; root /srv/www; }
  server { listen 8081; root /srv/www; etag off; }
  server {
    listen 8082; root /srv/www;
    location /mac-dinh/ { alias /srv/www/; }
    location /off/      { alias /srv/www/; expires off; }
    location /am1/      { alias /srv/www/; expires -1; }
    location /khong/    { alias /srv/www/; expires 0; }
    location /30d/      { alias /srv/www/; expires 30d; }
    location /max/      { alias /srv/www/; expires max; }
    location /ca-hai/   { alias /srv/www/; expires 1y; add_header Cache-Control "public, max-age=31536000, immutable" always; }
  }
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:8080/trang.html | grep -E '^(ETag|Last-Modified)'
Last-Modified: Sun, 23 Aug 2026 17:02:43 GMT
ETag: "6a8b27b3-6992"
$ printf 'hex(mtime)-hex(size) = %x-%x\\n' $(stat -c '%Y %s' /srv/www/trang.html)
hex(mtime)-hex(size) = 6a8b27b3-6992
$ md5sum /srv/www/trang.html; curl -sI http://127.0.0.1:8080/trang.html | grep ETag
d0d64a23c28d66fdec7065b70db03d85  /srv/www/trang.html
ETag: "6a8b27b3-6992"
$ touch /srv/www/trang.html
$ md5sum /srv/www/trang.html; curl -sI http://127.0.0.1:8080/trang.html | grep ETag
d0d64a23c28d66fdec7065b70db03d85  /srv/www/trang.html
ETag: "6af5c561-6992"
=== client cu gui lai ETag CU ===
$ curl -s -o /dev/null -w 'ma=%{http_code}  tai=%{size_download} byte\\n' -H 'If-None-Match: "6a8b27b3-6992"' http://127.0.0.1:8080/trang.html
ma=200  tai=27026 byte
$ curl -s -o /dev/null -w 'khong dieu kien          -&gt; %{http_code}, %{size_download} byte\\n' http://127.0.0.1:8080/trang.html
khong dieu kien          -&gt; 200, 27026 byte
$ curl -s -o /dev/null -w 'If-None-Match dung       -&gt; %{http_code}, %{size_download} byte\\n' -H 'If-None-Match: "6a8b27b3-6992"' http://127.0.0.1:8080/trang.html
If-None-Match dung       -&gt; 304, 0 byte
$ curl -s -o /dev/null -w 'If-Modified-Since dung   -&gt; %{http_code}, %{size_download} byte\\n' -H 'If-Modified-Since: Sun, 23 Aug 2026 17:02:43 GMT' http://127.0.0.1:8080/trang.html
If-Modified-Since dung   -&gt; 304, 0 byte
$ curl -s -o /dev/null -w 'ETag SAI + ngay DUNG     -&gt; %{http_code}, %{size_download} byte\\n' -H 'If-None-Match: "khac"' -H 'If-Modified-Since: Sun, 23 Aug 2026 17:02:43 GMT' http://127.0.0.1:8080/trang.html
ETag SAI + ngay DUNG     -&gt; 200, 27026 byte
$ curl -sI http://127.0.0.1:8081/trang.html | grep -cE '^ETag'
0
$ for p in mac-dinh off am1 khong 30d max ca-hai; do echo "--- expires $p"; curl -sI http://127.0.0.1:8082/$p/trang.html | grep -E '^(Expires|Cache-Control)' ; done
--- expires mac-dinh
--- expires off
--- expires am1
Expires: Thu, 12 Nov 2026 13:55:45 GMT
Cache-Control: no-cache
--- expires khong
Expires: Thu, 12 Nov 2026 13:55:46 GMT
Cache-Control: max-age=0
--- expires 30d
Expires: Sat, 12 Dec 2026 13:55:46 GMT
Cache-Control: max-age=2592000
--- expires max
Expires: Thu, 31 Dec 2037 23:55:55 GMT
Cache-Control: max-age=315360000
--- expires ca-hai
Expires: Fri, 12 Nov 2027 13:55:47 GMT
Cache-Control: max-age=31536000
Cache-Control: public, max-age=31536000, immutable</div>
<p>ETag trùng <code>hex(mtime)-hex(size)</code> từng ký tự; <code>touch</code> giữ nguyên md5 mà ETag đổi, nên ETag cũ nhận về nguyên 27.026 byte; ETag sai kèm ngày đúng ra 200; và <code>expires 1y</code> cộng <code>add_header Cache-Control</code> gửi đi hai dòng Cache-Control.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 12.4 — CDN và tệp tĩnh</span><span class="lc-sub">Tệp có mã băm và cache dài trên máy chủ thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Các header đổi hành vi</span><span class="lc-sub">Cache-Control, ETag và hỏi lại trên dây</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ETag</span><span class="v">Dựng dạng <code>hex(mtime)-hex(size)</code> — nó định danh cái inode, không phải nội dung, nên chỉ cần <code>touch</code> là nó đổi.</span></div>
  <div class="kv"><span class="k">Last-Modified</span><span class="v">Chính là mtime của tệp, phân giải tới giây; là bộ xác thực yếu hơn trong hai cái.</span></div>
  <div class="kv"><span class="k">Request có điều kiện</span><span class="v"><code>If-None-Match</code> mang ETag, <code>If-Modified-Since</code> mang ngày; khớp thì cho ra một cú <code>304</code> rỗng.</span></div>
  <div class="kv"><span class="k">expires</span><span class="v">Đặt <code>Expires</code> và <code>Cache-Control: max-age</code>; ghép nó với một <code>add_header Cache-Control</code> tay sẽ phát ra hai header đâm nhau.</span></div>
  <div class="kv"><span class="k">immutable</span><span class="v">Bảo trình duyệt đừng bao giờ xác thực lại — chỉ an toàn với tên tệp băm nội dung, và là thứ <code>expires</code> không diễn đạt được.</span></div>
  <div class="kv"><span class="k">Tên tệp băm nội dung</span><span class="v"><code>app.4f9a2c.js</code> — URL đổi khi nội dung đổi, nên ETag thôi có nghĩa lý và cache một năm là an toàn.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>ETag đúng là <code>hex(mtime)-hex(size)</code>, khớp từng ký tự; nó theo cái inode chứ không theo đám byte.</li><li>Mọi lần deploy tạo lại tệp đều đặt lại mtime, nên tài nguyên trong cache tải lại nguyên dạng <code>200</code>; đứng sau bộ cân bằng tải thì hai máy chủ còn sinh ETag khác nhau cho cùng đám byte.</li><li>Chữa bằng tên tệp băm nội dung (rồi cache một năm <code>immutable</code>) hoặc giữ nguyên mtime qua các lần deploy (<code>rsync -a</code>).</li><li>Request có điều kiện trả một cú <code>304</code> thân rỗng — tiết kiệm băng thông, không tiết kiệm vòng đi về.</li><li>Dùng một mình <code>expires</code> hoặc một mình header tay, đừng cả hai; HTML nhận <code>no-cache</code>, tài nguyên có băm nhận một năm.</li></ul>

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
${G04_3}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Compression: pay once at build time, not once per request</h2>
<p class="lead">Turning on <code>gzip</code> is the first performance change everyone makes, and it is the right one. What follows it is less well known: the same bytes can be compressed once when you build the site instead of every single time somebody asks for them, and the result is both cheaper and smaller.</p>

<h3>The cost, measured on a real 125KB file</h3>
<div class="out">Tep: mot file .mjs that cua chinh kho nay, 113.771 byte (phuc vu duoi ten .js — xem bay .mjs ben duoi)

  khong nen                          113.771 byte
  gzip tai cho, comp_level 5          31.557 byte   (27,7% cua goc)
  gzip tai cho, comp_level 9          30.794 byte
  gzip_static, gzip -9 dung san       30.626 byte   (26,9% — nho hon muc 5 khoang 3%)

wrk, 1 ket noi, 5 giay moi may (HTTP/1.1, Accept-Encoding: gzip):

  khong nen                          ~14.354 request/giay   do tre TB ~80 us
  gzip tai cho, comp_level 5            ~449 request/giay   do tre TB ~2,3 ms
  gzip tai cho, comp_level 9            ~308 request/giay   do tre TB ~3,3 ms
  gzip_static (doc tep .gz co san)   ~18.597 request/giay   do tre TB ~86 us

  ^^^ nen TAI CHO cham ~30 lan. Nen SAN con nhanh hon ca khong nen (it byte hon).
  (Dung do bang ab: ab noi HTTP/1.0, gzip_http_version mac dinh 1.1 =&gt; Nginx KHONG nen cho ab.)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">On-the-fly compression costs CPU per request</span><span class="lz-d">Nearly four milliseconds of worker time for this file at level 5, and nearly six at level 9. Multiply by requests per second: at 200 rps that is most of a core doing nothing but re-compressing the same unchanged bytes.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Higher levels cost more and save little</span><span class="lz-d">Level 9 took 49% longer than level 5 here. For on-the-fly work the sweet spot is 4 to 6; anything higher is paying real CPU for a percent or two of bandwidth.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">gzip_static reads a file instead of compressing</span><span class="lz-d">If <code>trang.html.gz</code> sits next to <code>trang.html</code>, Nginx serves it directly to any client that accepts gzip. The overhead measured at 0.2ms — that is one more <code>open()</code>, not a compressor.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">And the pre-made file is smaller</span><span class="lz-d">Because it was built at level 9 by a tool that had time to spare. You get better compression AND lower cost, which is unusual enough to be worth acting on.</span></div>
</div>

<h3>The ETag difference nobody mentions</h3>
<div class="out">khong nen           Content-Length: 113771   ETag: "6a8b2710-1bc6b"
gzip TAI CHO        (khong co Content-Length) ETag: W/"6a8b2710-1bc6b"
                                                   ^^ YEU, va cung gia tri
gzip_static (tep)   Content-Length: 30626    ETag: "6a8b2710-77a2"
                                                   ^^ MANH, va tinh tu chinh tep .gz</div>
<div class="kv-grid">
  <div class="kv"><span class="k">On-the-fly compression weakens the ETag</span><span class="v">Nginx marks it <code>W/</code> because the bytes it is sending are no longer the bytes it hashed the metadata from. A weak validator still works for <code>304</code> but cannot be used for range requests, which is one reason ranges and on-the-fly gzip do not combine.</span></div>
  <div class="kv"><span class="k">On-the-fly compression removes Content-Length</span><span class="v">The size is not known until compression finishes, so the response goes out chunked. Clients cannot show a progress bar, and any intermediary that wanted the length does not get it.</span></div>
  <div class="kv"><span class="k">gzip_static keeps both</span><span class="v">A strong ETag computed from the <code>.gz</code> file's own inode, and a real <code>Content-Length</code>. It behaves like an ordinary static file because it is one.</span></div>
  <div class="kv"><span class="k">Vary: Accept-Encoding is not optional</span><span class="v"><code>gzip_vary on;</code> tells every cache between you and the user that the response differs by encoding. Without it a shared cache can hand a gzipped body to a client that did not ask for one — a real breakage that shows up only behind a CDN or a corporate proxy.</span></div>
</div>
<pre><code class="language-bash">http {
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
<p><strong>Trap — do not compress what is already compressed, and be careful what you compress at all.</strong> JPEG, PNG, MP4, WebP, WOFF2 and every archive format are already compressed; running gzip over them burns CPU to make the file very slightly larger. They are absent from the default <code>gzip_types</code> for that reason, and adding them "for completeness" is a pure loss. Separately, compressing a response that mixes a secret with attacker-influenced content is what BREACH exploits — the compressed length leaks whether a guess appeared in the body. That is a real concern for HTML pages containing CSRF tokens, and the practical mitigations are per-request token randomisation rather than turning compression off site-wide. Measured: a 300,000-byte JPEG pushed through gzip came out at 300,113 bytes.</p>
<p><strong>And the <code>.mjs</code> file that is never compressed.</strong> nginx 1.24's <code>mime.types</code> has no <code>mjs</code> entry. The same file served as <code>bai.js</code> was <code>application/javascript</code> and compressed to 31,557 bytes; served as <code>bai.mjs</code> it was <code>text/plain</code>, 113,771 bytes uncompressed — and a browser refuses to run a module script with that type. One extra <code>types { application/javascript mjs; }</code> after the <code>include</code> ADDS the entry (measured: <code>.jpg</code> was still <code>image/jpeg</code>).</p>
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

<h3>🔬 Run it yourself</h3>
<p>One real 114 KB file served four ways, timed with <code>wrk</code> (one connection, five seconds), plus the <code>.mjs</code> and JPEG traps, on nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  include /etc/nginx/mime.types;
  access_log off;
  server { listen 8080; root /srv/www; }                                                      <span class="tok-comment">  # không nén</span>
  server { listen 8081; root /srv/www; gzip on; gzip_types application/javascript; gzip_comp_level 5; } # nén tại chỗ, mức 5
  server { listen 8082; root /srv/www; gzip on; gzip_types application/javascript; gzip_comp_level 9; } # nén tại chỗ, mức 9
  server { listen 8083; root /srv/www-gz; gzip_static on; }                                   <span class="tok-comment">  # đọc tệp .gz dựng sẵn</span>
}</code></pre>
<pre><code class="language-bash">pid       /srv/logs/ty.pid;
error_log /srv/logs/error.log;
events {}
http {
  include /etc/nginx/mime.types;
  types { application/javascript mjs; }   <span class="tok-comment">  # khối types thứ HAI cùng tầng: THÊM vào bảng</span>
  access_log off;
  server { listen 8085; root /srv/www; gzip on; gzip_types application/javascript; }
}</code></pre>
<div class="out">$ gzip -9 -k /srv/www-gz/bai.js &amp;&amp; ls -l /srv/www-gz/ | awk 'NR&gt;1{print $5, $9}'
113771 bai.js
30626 bai.js.gz
$ for p in 8080 8081 8082 8083; do printf '%s -&gt; ' $p; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{size_download} byte\\n' http://127.0.0.1:$p/bai.js; done
8080 -&gt; 113771 byte
8081 -&gt; 31557 byte
8082 -&gt; 30794 byte
8083 -&gt; 30626 byte
$ for p in 8080 8081 8082 8083; do printf '%s -&gt; ' $p; wrk -t1 -c1 -d5s -H 'Accept-Encoding: gzip' http://127.0.0.1:$p/bai.js | awk '/Latency/{l=$2} /Requests\\/sec/{r=$2} END{print "do tre TB " l ", " r " request/giay"}'; done
8080 -&gt; do tre TB 232.90us, 11169.74 request/giay
8081 -&gt; do tre TB 2.97ms, 359.21 request/giay
8082 -&gt; do tre TB 3.71ms, 275.76 request/giay
8083 -&gt; do tre TB 177.37us, 15501.83 request/giay
$ for p in 8080 8081 8083; do printf '%s -&gt; ' $p; curl -s -o /dev/null -D - -H 'Accept-Encoding: gzip' http://127.0.0.1:$p/bai.js | grep -E '^(Content-Length|ETag|Content-Encoding)' | tr -d '\\r' | tr '\\n' ' '; echo; done
8080 -&gt; Content-Length: 113771 ETag: "6a8b2710-1bc6b" 
8081 -&gt; ETag: W/"6a8b2710-1bc6b" Content-Encoding: gzip 
8083 -&gt; Content-Length: 30626 ETag: "6a8b2710-77a2" Content-Encoding: gzip 
$ for f in bai.js bai.mjs; do printf '%-8s -&gt; ' $f; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{content_type}  %{size_download} byte\\n' http://127.0.0.1:8081/$f; done
bai.js   -&gt; application/javascript  31557 byte
bai.mjs  -&gt; text/plain  113771 byte
$ grep -c 'mjs' /etc/nginx/mime.types
0
$ for f in bai.js bai.mjs anh.jpg; do printf '%-8s -&gt; ' $f; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{content_type}  %{size_download} byte\\n' http://127.0.0.1:8085/$f; done
bai.js   -&gt; application/javascript  37976 byte
bai.mjs  -&gt; application/javascript  37976 byte
anh.jpg  -&gt; image/jpeg  5000 byte
$ curl -s -o /dev/null -w 'khong xin gzip: %{size_download} byte\\n' http://127.0.0.1:8084/anh.jpg
khong xin gzip: 300000 byte
$ curl -s -o /dev/null -w 'xin gzip      : %{size_download} byte\\n' -H 'Accept-Encoding: gzip' http://127.0.0.1:8084/anh.jpg
xin gzip      : 300113 byte</div>
<p>All three compressed forms landed near 31 KB; on-the-fly gzip ran at roughly 450 and 300 requests a second against 14,000 uncompressed and 18,600 for <code>gzip_static</code>; the ETag went weak on the fly and stayed strong for the pre-built file; <code>.mjs</code> was <code>text/plain</code> until one <code>types</code> line added it; and the JPEG got bigger.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-16-3-nen-va-duong-truyen" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 16.3 — Compression and the wire</span><span class="lc-sub">The same trade-off from the application side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Headers that change behaviour</span><span class="lc-sub">Content-Encoding, Vary and caches</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">gzip</span><span class="v">On-the-fly compression — it costs CPU on every request (about 3.9ms here at level 5 on a 125KB file).</span></div>
  <div class="kv"><span class="k">gzip_static</span><span class="v">Serves a pre-built <code>.gz</code> file sitting next to the asset; about 0.2ms, one extra <code>open()</code>, no compressor.</span></div>
  <div class="kv"><span class="k">gzip_comp_level</span><span class="v">The effort dial; the sweet spot for on-the-fly work is 4–6, higher pays real CPU for a percent or two.</span></div>
  <div class="kv"><span class="k">gzip_vary</span><span class="v">Emits <code>Vary: Accept-Encoding</code>, mandatory whenever a shared cache sits between you and the user.</span></div>
  <div class="kv"><span class="k">Weak ETag (W/)</span><span class="v">On-the-fly gzip marks the ETag weak and drops <code>Content-Length</code>; <code>gzip_static</code> keeps both strong.</span></div>
  <div class="kv"><span class="k">Brotli</span><span class="v">A separate module (<code>ngx_brotli</code>); <code>brotli_static</code> serves <code>.br</code> files, typically 15–20% smaller than gzip on text.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>On-the-fly gzip is a real win over not compressing, but it burns CPU on every request and has a sweet spot of level 4–6.</li><li><code>gzip_static</code> serves a file built once at <code>gzip -9</code>: cheaper (about 0.2ms) and smaller than on-the-fly at the same time.</li><li>On-the-fly compression weakens the ETag (<code>W/</code>) and removes <code>Content-Length</code>; <code>gzip_static</code> keeps a strong ETag and a real length.</li><li><code>gzip_vary on</code> is not optional whenever any cache sits in between.</li><li>Never gzip already-compressed formats (JPEG, PNG, MP4, WOFF2), and keep each <code>.gz</code> in sync with its source in the same build step.</li></ul>

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
<div class="out">Tep: mot file .mjs that cua chinh kho nay, 113.771 byte (phuc vu duoi ten .js — xem bay .mjs ben duoi)

  khong nen                          113.771 byte
  gzip tai cho, comp_level 5          31.557 byte   (27,7% cua goc)
  gzip tai cho, comp_level 9          30.794 byte
  gzip_static, gzip -9 dung san       30.626 byte   (26,9% — nho hon muc 5 khoang 3%)

wrk, 1 ket noi, 5 giay moi may (HTTP/1.1, Accept-Encoding: gzip):

  khong nen                          ~14.354 request/giay   do tre TB ~80 us
  gzip tai cho, comp_level 5            ~449 request/giay   do tre TB ~2,3 ms
  gzip tai cho, comp_level 9            ~308 request/giay   do tre TB ~3,3 ms
  gzip_static (doc tep .gz co san)   ~18.597 request/giay   do tre TB ~86 us

  ^^^ nen TAI CHO cham ~30 lan. Nen SAN con nhanh hon ca khong nen (it byte hon).
  (Dung do bang ab: ab noi HTTP/1.0, gzip_http_version mac dinh 1.1 =&gt; Nginx KHONG nen cho ab.)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nén tại chỗ tốn CPU ở MỖI request</span><span class="lz-d">Gần bốn mili giây thời gian worker cho tệp này ở mức 5, và gần sáu ở mức 9. Đem nhân với số request mỗi giây: ở 200 rps thì đó là gần trọn một nhân chỉ để nén đi nén lại đúng đám byte không hề đổi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mức cao hơn tốn hơn mà tiết kiệm chẳng bao nhiêu</span><span class="lz-d">Mức 9 ở đây lâu hơn mức 5 tới 49%. Với việc nén tại chỗ thì điểm ngọt là 4 tới 6; cao hơn nữa là trả CPU thật để đổi lấy một hai phần trăm băng thông.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">gzip_static ĐỌC một tệp thay vì đi nén</span><span class="lz-d">Nếu <code>trang.html.gz</code> nằm ngay cạnh <code>trang.html</code>, Nginx phục vụ thẳng nó cho mọi client chấp nhận gzip. Phí tổn đo được là 0,2ms — đó là thêm một lệnh <code>open()</code>, không phải một bộ nén.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Và cái tệp dựng sẵn còn NHỎ HƠN</span><span class="lz-d">Vì nó được dựng ở mức 9 bởi một công cụ có dư thời gian. Bạn được nén tốt hơn VÀ tốn ít hơn, chuyện đủ hiếm để đáng đi làm.</span></div>
</div>

<h3>Khác biệt về ETag mà chẳng ai nhắc</h3>
<div class="out">khong nen           Content-Length: 113771   ETag: "6a8b2710-1bc6b"
gzip TAI CHO        (khong co Content-Length) ETag: W/"6a8b2710-1bc6b"
                                                   ^^ YEU, va cung gia tri
gzip_static (tep)   Content-Length: 30626    ETag: "6a8b2710-77a2"
                                                   ^^ MANH, va tinh tu chinh tep .gz</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nén tại chỗ làm ETag YẾU đi</span><span class="v">Nginx đánh dấu <code>W/</code> vì đám byte nó đang gửi không còn là đám byte nó đã băm siêu dữ liệu ra. Một bộ xác thực yếu vẫn dùng được cho <code>304</code> nhưng KHÔNG dùng được cho request theo dải byte, và đó là một lý do nữa để dải byte và gzip tại chỗ không đi với nhau.</span></div>
  <div class="kv"><span class="k">Nén tại chỗ làm mất Content-Length</span><span class="v">Kích thước chưa biết được cho tới khi nén xong, nên phản hồi đi ra dạng chunked. Client không hiện được thanh tiến trình, và bất cứ trung gian nào cần biết độ dài đều không có.</span></div>
  <div class="kv"><span class="k">gzip_static giữ được CẢ HAI</span><span class="v">Một ETag MẠNH tính từ chính inode của tệp <code>.gz</code>, và một <code>Content-Length</code> thật. Nó cư xử như một tệp tĩnh bình thường vì nó ĐÚNG LÀ một tệp tĩnh bình thường.</span></div>
  <div class="kv"><span class="k">Vary: Accept-Encoding KHÔNG phải tuỳ chọn</span><span class="v"><code>gzip_vary on;</code> báo cho mọi bộ đệm nằm giữa bạn và người dùng rằng phản hồi KHÁC NHAU theo phép mã hoá. Thiếu nó thì một bộ đệm dùng chung có thể trao một thân đã nén cho một client chưa từng xin — một kiểu hỏng có thật và chỉ lộ ra khi đứng sau một CDN hay một proxy công ty.</span></div>
</div>
<pre><code class="language-bash">http {
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
<p><strong>Bẫy — đừng nén thứ đã nén, và hãy cẩn thận với chuyện nén cái gì.</strong> JPEG, PNG, MP4, WebP, WOFF2 và mọi định dạng nén sẵn đều đã nén rồi; chạy gzip lên chúng là đốt CPU để làm tệp TO RA một tí. Chúng vắng mặt trong <code>gzip_types</code> mặc định đúng vì lý do đó, và thêm chúng vào "cho đủ bộ" là lỗ thuần tuý. Chuyện riêng: nén một phản hồi có trộn một BÍ MẬT với nội dung do kẻ tấn công chi phối chính là thứ BREACH khai thác — độ dài sau nén tiết lộ rằng một lần đoán có xuất hiện trong thân hay không. Đó là mối lo có thật với những trang HTML mang token CSRF, và cách giảm thiểu thực tế là NGẪU NHIÊN HOÁ token theo từng request, chứ không phải tắt nén cả site. Đo thật: một ảnh JPEG 300.000 byte qua gzip ra 300.113 byte.</p>
<p><strong>Và tệp <code>.mjs</code> không bao giờ được nén.</strong> <code>mime.types</code> của nginx 1.24 KHÔNG có dòng <code>mjs</code>. Cùng một tệp, phục vụ dưới tên <code>bai.js</code> là <code>application/javascript</code> và được nén còn 31.557 byte; dưới tên <code>bai.mjs</code> thì thành <code>text/plain</code>, 113.771 byte không nén — và trình duyệt TỪ CHỐI chạy một module script mang kiểu đó. Thêm một khối <code>types { application/javascript mjs; }</code> sau dòng <code>include</code> là nó được THÊM vào bảng (đo thật: <code>.jpg</code> vẫn là <code>image/jpeg</code>).</p>
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

<h3>🔬 Tự chạy lại</h3>
<p>Một tệp thật 114 KB phục vụ bốn cách, bấm giờ bằng <code>wrk</code> (một kết nối, năm giây), cộng cái bẫy <code>.mjs</code> và JPEG, trên nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  include /etc/nginx/mime.types;
  access_log off;
  server { listen 8080; root /srv/www; }                                                      <span class="tok-comment">  # không nén</span>
  server { listen 8081; root /srv/www; gzip on; gzip_types application/javascript; gzip_comp_level 5; } # nén tại chỗ, mức 5
  server { listen 8082; root /srv/www; gzip on; gzip_types application/javascript; gzip_comp_level 9; } # nén tại chỗ, mức 9
  server { listen 8083; root /srv/www-gz; gzip_static on; }                                   <span class="tok-comment">  # đọc tệp .gz dựng sẵn</span>
}</code></pre>
<pre><code class="language-bash">pid       /srv/logs/ty.pid;
error_log /srv/logs/error.log;
events {}
http {
  include /etc/nginx/mime.types;
  types { application/javascript mjs; }   <span class="tok-comment">  # khối types thứ HAI cùng tầng: THÊM vào bảng</span>
  access_log off;
  server { listen 8085; root /srv/www; gzip on; gzip_types application/javascript; }
}</code></pre>
<div class="out">$ gzip -9 -k /srv/www-gz/bai.js &amp;&amp; ls -l /srv/www-gz/ | awk 'NR&gt;1{print $5, $9}'
113771 bai.js
30626 bai.js.gz
$ for p in 8080 8081 8082 8083; do printf '%s -&gt; ' $p; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{size_download} byte\\n' http://127.0.0.1:$p/bai.js; done
8080 -&gt; 113771 byte
8081 -&gt; 31557 byte
8082 -&gt; 30794 byte
8083 -&gt; 30626 byte
$ for p in 8080 8081 8082 8083; do printf '%s -&gt; ' $p; wrk -t1 -c1 -d5s -H 'Accept-Encoding: gzip' http://127.0.0.1:$p/bai.js | awk '/Latency/{l=$2} /Requests\\/sec/{r=$2} END{print "do tre TB " l ", " r " request/giay"}'; done
8080 -&gt; do tre TB 232.90us, 11169.74 request/giay
8081 -&gt; do tre TB 2.97ms, 359.21 request/giay
8082 -&gt; do tre TB 3.71ms, 275.76 request/giay
8083 -&gt; do tre TB 177.37us, 15501.83 request/giay
$ for p in 8080 8081 8083; do printf '%s -&gt; ' $p; curl -s -o /dev/null -D - -H 'Accept-Encoding: gzip' http://127.0.0.1:$p/bai.js | grep -E '^(Content-Length|ETag|Content-Encoding)' | tr -d '\\r' | tr '\\n' ' '; echo; done
8080 -&gt; Content-Length: 113771 ETag: "6a8b2710-1bc6b" 
8081 -&gt; ETag: W/"6a8b2710-1bc6b" Content-Encoding: gzip 
8083 -&gt; Content-Length: 30626 ETag: "6a8b2710-77a2" Content-Encoding: gzip 
$ for f in bai.js bai.mjs; do printf '%-8s -&gt; ' $f; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{content_type}  %{size_download} byte\\n' http://127.0.0.1:8081/$f; done
bai.js   -&gt; application/javascript  31557 byte
bai.mjs  -&gt; text/plain  113771 byte
$ grep -c 'mjs' /etc/nginx/mime.types
0
$ for f in bai.js bai.mjs anh.jpg; do printf '%-8s -&gt; ' $f; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{content_type}  %{size_download} byte\\n' http://127.0.0.1:8085/$f; done
bai.js   -&gt; application/javascript  37976 byte
bai.mjs  -&gt; application/javascript  37976 byte
anh.jpg  -&gt; image/jpeg  5000 byte
$ curl -s -o /dev/null -w 'khong xin gzip: %{size_download} byte\\n' http://127.0.0.1:8084/anh.jpg
khong xin gzip: 300000 byte
$ curl -s -o /dev/null -w 'xin gzip      : %{size_download} byte\\n' -H 'Accept-Encoding: gzip' http://127.0.0.1:8084/anh.jpg
xin gzip      : 300113 byte</div>
<p>Cả ba dạng nén đều về quanh 31 KB; gzip tại chỗ chạy khoảng 450 và 300 request mỗi giây, so với 14.000 khi không nén và 18.600 với <code>gzip_static</code>; ETag thành ETag yếu khi nén tại chỗ và vẫn mạnh với tệp dựng sẵn; <code>.mjs</code> là <code>text/plain</code> cho tới khi một dòng <code>types</code> thêm nó vào; và ảnh JPEG to ra.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-16-3-nen-va-duong-truyen" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 16.3 — Nén và đường truyền</span><span class="lc-sub">Cùng phép đổi chác đó nhìn từ phía ứng dụng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Các header đổi hành vi</span><span class="lc-sub">Content-Encoding, Vary và bộ đệm</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">gzip</span><span class="v">Nén tại chỗ — tốn CPU ở mỗi request (ở đây chừng 3,9ms ở mức 5 trên tệp 125KB).</span></div>
  <div class="kv"><span class="k">gzip_static</span><span class="v">Phục vụ một tệp <code>.gz</code> dựng sẵn nằm cạnh tài nguyên; chừng 0,2ms, thêm một lệnh <code>open()</code>, không có bộ nén.</span></div>
  <div class="kv"><span class="k">gzip_comp_level</span><span class="v">Núm chỉnh mức nén; với nén tại chỗ điểm ngọt là 4–6, cao hơn là trả CPU thật cho một hai phần trăm.</span></div>
  <div class="kv"><span class="k">gzip_vary</span><span class="v">Phát ra <code>Vary: Accept-Encoding</code>, bắt buộc khi có một bộ đệm dùng chung nằm giữa bạn và người dùng.</span></div>
  <div class="kv"><span class="k">ETag yếu (W/)</span><span class="v">Nén tại chỗ đánh dấu ETag yếu và bỏ <code>Content-Length</code>; <code>gzip_static</code> giữ cả hai ở dạng mạnh.</span></div>
  <div class="kv"><span class="k">Brotli</span><span class="v">Một module riêng (<code>ngx_brotli</code>); <code>brotli_static</code> phục vụ tệp <code>.br</code>, với văn bản thường nhỏ hơn gzip 15–20%.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nén tại chỗ là một cú thắng lớn so với không nén, nhưng nó đốt CPU ở mỗi request và có điểm ngọt là mức 4–6.</li><li><code>gzip_static</code> phục vụ một tệp dựng sẵn ở <code>gzip -9</code>: vừa rẻ hơn (chừng 0,2ms) vừa nhỏ hơn cùng lúc.</li><li>Nén tại chỗ làm ETag yếu đi (<code>W/</code>) và mất <code>Content-Length</code>; <code>gzip_static</code> giữ ETag mạnh và độ dài thật.</li><li><code>gzip_vary on</code> không phải tuỳ chọn khi có bất cứ bộ đệm nào ở giữa.</li><li>Đừng bao giờ nén thứ đã nén sẵn (JPEG, PNG, MP4, WOFF2), và giữ mỗi tệp <code>.gz</code> đồng bộ với tệp gốc trong cùng một bước dựng.</li></ul>

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
${G04_4}
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
  open_file_cache BAT      0       0        5         5     &lt;- chi dong 5 ket noi
  open_file_cache TAT      5       5        5        10     &lt;- dong ca tep lan ket noi
                          ^^      ^^
                   1 lan mo + 1 lan stat MOI REQUEST, bien mat sach

Deploy bang mv (tep moi, inode MOI) trong luc cache dang giu tep cu:
  co open_file_cache  -&gt; ban CU      (61 giay sau -&gt; ban MOI)
  khong cache         -&gt; ban MOI</div>
<div class="callout warn">
<p><strong>And a measurement that found nothing, which is also information.</strong> Timing 500 sequential <code>curl</code> requests to the same small file gave 7.16ms with the cache on and 7.10ms with it off — no difference at all. That is not evidence the directive is useless; it is evidence the benchmark was wrong. Each <code>curl</code> spends about 7ms starting a process, so the microseconds of a saved <code>openat</code> were invisible under it. The syscall count is the honest measurement here, and the wall-clock number would have been the misleading one to publish.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">It caches descriptors and metadata, not contents</span><span class="v">The file's data still comes from the kernel page cache, which was already handling that. What is cached is the open descriptor, the <code>stat</code> result, and the fact that a path does or does not exist — the per-request bookkeeping, not the bytes.</span></div>
  <div class="kv"><span class="k">Where it pays: many requests, many small files</span><span class="v">A page pulling forty small assets does forty opens and forty stats per visitor without it. On a busy static site that is a large share of the syscalls the process makes at all, and syscalls are where a static server's time actually goes.</span></div>
  <div class="kv"><span class="k">open_file_cache_errors caches the misses too</span><span class="v">With it on, a repeated request for a missing file does not re-stat the filesystem every time. That matters under a scanner hammering non-existent paths, which is a load pattern you get whether you want it or not.</span></div>
  <div class="kv"><span class="k">The cost is staleness for up to open_file_cache_valid</span><span class="v">A file replaced on disk may keep being served from the old descriptor until the entry is revalidated. With <code>30s</code> that is a half-minute window after a deploy — usually fine, and worth knowing before you spend an hour wondering why the new file is not appearing.</span></div>
</div>
<pre><code class="language-bash">http {
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

<h3>🔬 Run it yourself</h3>
<p>One worker, <code>strace</code> attached, four servers that differ only in <code>sendfile</code> and <code>open_file_cache</code> — then a deploy under the cache — on nginx/1.24.0 (the container needs <code>--cap-add SYS_PTRACE</code>):</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
worker_processes 1;
events {}
http {
  include /etc/nginx/mime.types;
  access_log off;
  server { listen 8080; root /srv/www; sendfile on; }
  server { listen 8081; root /srv/www; sendfile off; }
  server { listen 8082; root /srv/www; sendfile on; open_file_cache max=1000 inactive=60s; }
  server { listen 8083; root /srv/www; sendfile on; }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># dem-syscall.sh</span>
<span class="tok-comment"># dem-syscall.sh &lt;cổng&gt; &lt;tệp&gt; &lt;số request&gt; — strace worker DUY NHẤT của nginx trong lúc gửi N request, đếm từng lời gọi hệ thống</span>
W=$(pgrep -f 'nginx: worker'); curl -s -o /dev/null http://127.0.0.1:$1/$2 <span class="tok-comment">  # hâm nóng (open_file_cache cần lượt đầu)</span>
strace -f -p $W -e trace=openat,newfstatat,fstat,sendfile,writev,write,read,pread64,close -o /tmp/st.txt 2&gt;/dev/null &amp; S=$!; sleep 0.5
for i in $(seq $3); do curl -s -o /dev/null http://127.0.0.1:$1/$2; done; sleep 0.3; kill $S; sleep 0.3
for c in openat fstat sendfile writev pread64 close; do printf '%s=%s  ' $c $(grep -c "^[0-9]* *$c(\\|^$c(" /tmp/st.txt); done; echo</code></pre>
<div class="out">$ bash dem-syscall.sh 8080 lon.bin 3
openat=3  fstat=3  sendfile=3  writev=3  pread64=0  close=6  
$ bash dem-syscall.sh 8081 lon.bin 3
openat=3  fstat=3  sendfile=0  writev=186  pread64=186  close=6  
$ bash dem-syscall.sh 8082 nho.txt 5
openat=0  fstat=0  sendfile=5  writev=5  pread64=0  close=5  
$ bash dem-syscall.sh 8083 nho.txt 5
openat=5  fstat=5  sendfile=5  writev=5  pread64=0  close=10  
$ curl -s http://127.0.0.1:8082/phien-ban.txt; curl -s http://127.0.0.1:8083/phien-ban.txt
ban CU
ban CU
=== deploy: ghi tep moi roi mv de len (inode MOI) ===
$ echo 'ban MOI' &gt; /srv/www/.tam &amp;&amp; mv /srv/www/.tam /srv/www/phien-ban.txt
$ printf 'co open_file_cache  -&gt; '; curl -s http://127.0.0.1:8082/phien-ban.txt; printf 'khong cache         -&gt; '; curl -s http://127.0.0.1:8083/phien-ban.txt
co open_file_cache  -&gt; ban CU
khong cache         -&gt; ban MOI
=== 61 giay sau (open_file_cache_valid mac dinh 60s) ===
$ sleep 61; printf 'co open_file_cache  -&gt; '; curl -s http://127.0.0.1:8082/phien-ban.txt
co open_file_cache  -&gt; ban MOI</div>
<p>sendfile on: one <code>sendfile</code> per request; off: 62 reads and 62 writes per request for a 2 MB file. The file cache removed the open and the stat entirely. And a file replaced with <code>mv</code> kept coming out OLD from the cached server until the 60-second validity ran out.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-5-1-tien-trinh-la-gi" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 5.1 — What a process is</span><span class="lc-sub">Processes, system calls and the tools that watch them</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-16-1-do-truoc-khi-doan" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 16.1 — Measure first</span><span class="lc-sub">Profiling before tuning</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">sendfile</span><span class="v">Moves bytes from the page cache straight to the socket in one syscall (186 writev became 3 here); the worker never touches them.</span></div>
  <div class="kv"><span class="k">tcp_nopush</span><span class="v">Holds headers back until there is a full packet; only has an effect when <code>sendfile</code> is on, so the pair appears together.</span></div>
  <div class="kv"><span class="k">open_file_cache</span><span class="v">Caches open descriptors, <code>stat</code> results and path existence — not file contents; removes every <code>openat</code> and <code>fstat</code>.</span></div>
  <div class="kv"><span class="k">open_file_cache_valid</span><span class="v">The staleness window: a replaced or deleted file can be served from the cached descriptor for up to this long.</span></div>
  <div class="kv"><span class="k">open_file_cache_errors</span><span class="v">Caches the misses too, so a scanner hammering non-existent paths does not re-stat the filesystem every time.</span></div>
  <div class="kv"><span class="k">strace</span><span class="v">Counts the worker's syscalls — the honest measurement here, where a wall-clock timer showed nothing.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li><code>sendfile</code> moves file bytes to the socket in one syscall instead of a read-then-write loop (186 to 3 for three 2MB requests); <code>tcp_nopush</code> pairs with it.</li><li>It cannot be used when the body is transformed (on-the-fly gzip, <code>sub_filter</code>, SSI) — one more reason to prefer <code>gzip_static</code>.</li><li><code>open_file_cache</code> caches descriptors, stat results and existence, not contents, and removes every per-request <code>openat</code>/<code>fstat</code>.</li><li>It can serve stale or even deleted files for up to <code>open_file_cache_valid</code> — reload Nginx after an urgent deletion.</li><li>Measure with <code>strace</code> (a count), not wall-clock: the 500-request timer found nothing because <code>curl</code> startup dominated it.</li></ul>

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
  open_file_cache BAT      0       0        5         5     &lt;- chi dong 5 ket noi
  open_file_cache TAT      5       5        5        10     &lt;- dong ca tep lan ket noi
                          ^^      ^^
                   1 lan mo + 1 lan stat MOI REQUEST, bien mat sach

Deploy bang mv (tep moi, inode MOI) trong luc cache dang giu tep cu:
  co open_file_cache  -&gt; ban CU      (61 giay sau -&gt; ban MOI)
  khong cache         -&gt; ban MOI</div>
<div class="callout warn">
<p><strong>Và một phép đo KHÔNG tìm thấy gì, mà điều đó cũng là thông tin.</strong> Bấm giờ 500 lượt <code>curl</code> tuần tự tới cùng một tệp nhỏ cho ra 7,16ms khi bật cache và 7,10ms khi tắt — không khác gì cả. Đó KHÔNG phải bằng chứng rằng chỉ thị này vô dụng; đó là bằng chứng rằng PHÉP ĐO đã sai. Mỗi lượt <code>curl</code> tốn chừng 7ms chỉ để khởi động một tiến trình, nên vài micro giây tiết kiệm được từ một lời gọi <code>openat</code> chìm nghỉm dưới đó. Đếm syscall mới là phép đo thật thà ở đây, còn con số đồng hồ mới là thứ mà đem đăng lên thì gây hiểu lầm.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó cache MÔ TẢ TỆP và siêu dữ liệu, KHÔNG cache nội dung</span><span class="v">Dữ liệu của tệp vẫn tới từ bộ đệm trang của nhân, thứ vốn đã lo việc đó rồi. Cái được cache là mô tả tệp đang mở, kết quả <code>stat</code>, và cái sự thật rằng một đường dẫn có hay không tồn tại — tức là phần sổ sách theo từng request, không phải đám byte.</span></div>
  <div class="kv"><span class="k">Chỗ nó sinh lời: NHIỀU request, NHIỀU tệp nhỏ</span><span class="v">Một trang kéo về bốn mươi tài nguyên nhỏ thì tốn bốn mươi lần mở và bốn mươi lần stat cho MỖI khách nếu không có nó. Trên một site tĩnh đông khách thì đó là một phần lớn trong toàn bộ số syscall mà tiến trình thực hiện, mà syscall mới là chỗ thời gian của một máy chủ tĩnh thật sự đi vào.</span></div>
  <div class="kv"><span class="k">open_file_cache_errors cache cả những lần TRƯỢT</span><span class="v">Bật nó lên thì một request lặp đi lặp lại tới một tệp không tồn tại sẽ không phải stat lại hệ tệp mỗi lần. Điều đó có nghĩa lý khi có một con quét dạo nện liên tục vào những đường dẫn không có, mà đó là kiểu tải bạn nhận được dù có muốn hay không.</span></div>
  <div class="kv"><span class="k">Cái giá là dữ liệu CŨ trong tối đa open_file_cache_valid</span><span class="v">Một tệp vừa bị thay trên đĩa vẫn có thể được phục vụ từ mô tả tệp cũ cho tới khi mục đó được xác thực lại. Với <code>30s</code> thì đó là một cửa sổ nửa phút sau khi deploy — thường thì không sao, và đáng biết TRƯỚC khi bạn tốn một tiếng tự hỏi vì sao tệp mới chưa hiện ra.</span></div>
</div>
<pre><code class="language-bash">http {
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

<h3>🔬 Tự chạy lại</h3>
<p>Một worker, gắn <code>strace</code>, bốn máy chủ chỉ khác nhau ở <code>sendfile</code> và <code>open_file_cache</code> — rồi một lần deploy dưới cache — trên nginx/1.24.0 (container cần <code>--cap-add SYS_PTRACE</code>):</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
worker_processes 1;
events {}
http {
  include /etc/nginx/mime.types;
  access_log off;
  server { listen 8080; root /srv/www; sendfile on; }
  server { listen 8081; root /srv/www; sendfile off; }
  server { listen 8082; root /srv/www; sendfile on; open_file_cache max=1000 inactive=60s; }
  server { listen 8083; root /srv/www; sendfile on; }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># dem-syscall.sh</span>
<span class="tok-comment"># dem-syscall.sh &lt;cổng&gt; &lt;tệp&gt; &lt;số request&gt; — strace worker DUY NHẤT của nginx trong lúc gửi N request, đếm từng lời gọi hệ thống</span>
W=$(pgrep -f 'nginx: worker'); curl -s -o /dev/null http://127.0.0.1:$1/$2 <span class="tok-comment">  # hâm nóng (open_file_cache cần lượt đầu)</span>
strace -f -p $W -e trace=openat,newfstatat,fstat,sendfile,writev,write,read,pread64,close -o /tmp/st.txt 2&gt;/dev/null &amp; S=$!; sleep 0.5
for i in $(seq $3); do curl -s -o /dev/null http://127.0.0.1:$1/$2; done; sleep 0.3; kill $S; sleep 0.3
for c in openat fstat sendfile writev pread64 close; do printf '%s=%s  ' $c $(grep -c "^[0-9]* *$c(\\|^$c(" /tmp/st.txt); done; echo</code></pre>
<div class="out">$ bash dem-syscall.sh 8080 lon.bin 3
openat=3  fstat=3  sendfile=3  writev=3  pread64=0  close=6  
$ bash dem-syscall.sh 8081 lon.bin 3
openat=3  fstat=3  sendfile=0  writev=186  pread64=186  close=6  
$ bash dem-syscall.sh 8082 nho.txt 5
openat=0  fstat=0  sendfile=5  writev=5  pread64=0  close=5  
$ bash dem-syscall.sh 8083 nho.txt 5
openat=5  fstat=5  sendfile=5  writev=5  pread64=0  close=10  
$ curl -s http://127.0.0.1:8082/phien-ban.txt; curl -s http://127.0.0.1:8083/phien-ban.txt
ban CU
ban CU
=== deploy: ghi tep moi roi mv de len (inode MOI) ===
$ echo 'ban MOI' &gt; /srv/www/.tam &amp;&amp; mv /srv/www/.tam /srv/www/phien-ban.txt
$ printf 'co open_file_cache  -&gt; '; curl -s http://127.0.0.1:8082/phien-ban.txt; printf 'khong cache         -&gt; '; curl -s http://127.0.0.1:8083/phien-ban.txt
co open_file_cache  -&gt; ban CU
khong cache         -&gt; ban MOI
=== 61 giay sau (open_file_cache_valid mac dinh 60s) ===
$ sleep 61; printf 'co open_file_cache  -&gt; '; curl -s http://127.0.0.1:8082/phien-ban.txt
co open_file_cache  -&gt; ban MOI</div>
<p>sendfile bật: mỗi request một lời gọi <code>sendfile</code>; tắt: 62 lần đọc và 62 lần ghi mỗi request với tệp 2 MB. Bộ đệm tệp xoá sạch lần mở và lần stat. Và một tệp được thay bằng <code>mv</code> vẫn cứ ra bản CŨ ở máy có cache cho tới khi hết 60 giây hiệu lực.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-5-1-tien-trinh-la-gi" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 5.1 — Tiến trình là gì</span><span class="lc-sub">Tiến trình, lời gọi hệ thống và công cụ theo dõi chúng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-16-1-do-truoc-khi-doan" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 16.1 — Đo trước đã</span><span class="lc-sub">Đo trước khi tối ưu</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">sendfile</span><span class="v">Chuyển byte từ bộ đệm trang thẳng ra socket trong một syscall (186 writev thành 3 ở đây); worker không hề chạm vào byte.</span></div>
  <div class="kv"><span class="k">tcp_nopush</span><span class="v">Giữ header lại cho tới khi có đủ một gói đầy; chỉ có tác dụng khi <code>sendfile</code> bật, nên cặp này luôn đi cùng nhau.</span></div>
  <div class="kv"><span class="k">open_file_cache</span><span class="v">Cache mô tả tệp đang mở, kết quả <code>stat</code> và sự tồn tại của đường dẫn — không cache nội dung; xoá sạch mọi <code>openat</code> và <code>fstat</code>.</span></div>
  <div class="kv"><span class="k">open_file_cache_valid</span><span class="v">Cửa sổ dữ liệu cũ: một tệp bị thay hoặc bị xoá vẫn có thể được phục vụ từ mô tả tệp đã cache trong tối đa bằng này.</span></div>
  <div class="kv"><span class="k">open_file_cache_errors</span><span class="v">Cache cả những lần trượt, nên một con quét nện vào đường dẫn không có sẽ không phải stat lại hệ tệp mỗi lần.</span></div>
  <div class="kv"><span class="k">strace</span><span class="v">Đếm syscall của worker — phép đo thật thà ở đây, nơi một phép bấm giờ đồng hồ không thấy gì cả.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li><code>sendfile</code> chuyển byte tệp ra socket trong một syscall thay cho vòng đọc-rồi-ghi (186 thành 3 cho ba request 2MB); <code>tcp_nopush</code> đi kèm với nó.</li><li>Nó không dùng được khi thân bị biến đổi (gzip tại chỗ, <code>sub_filter</code>, SSI) — thêm một lý do để chuộng <code>gzip_static</code>.</li><li><code>open_file_cache</code> cache mô tả tệp, kết quả stat và sự tồn tại, không cache nội dung, và xoá mọi <code>openat</code>/<code>fstat</code> theo từng request.</li><li>Nó có thể phục vụ tệp cũ hoặc thậm chí tệp đã xoá trong tối đa <code>open_file_cache_valid</code> — hãy nạp lại Nginx sau một lần xoá khẩn.</li><li>Đo bằng <code>strace</code> (một con số đếm), không bằng đồng hồ: phép bấm giờ 500 request không thấy gì vì chi phí khởi động <code>curl</code> áp đảo.</li></ul>

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
${G04_5}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>A production static block, assembled and measured</h2>
<p class="lead">Four lessons of pieces. Here they are as one config for a realistic site — a single-page app with content-hashed assets, an HTML entry point, and a directory of user uploads — with every route measured afterwards. The last measurement found a bug in the config written above it, which is left in because it is the most useful thing in the lesson.</p>

<h3>The config</h3>
<pre><code class="language-bash">http {
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
      add_header Cache-Control "public, max-age=31536000, immutable" always;   <span class="tok-comment"># "always" — the bug measured below</span>
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

<h3>🔬 Run it yourself</h3>
<p>The whole block above on port 8080 (listen 443 replaced by a plain port for the lab), every route requested, then <code>always</code> removed from Cache-Control, on nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  access_log    off;
  sendfile on; tcp_nopush on; tcp_nodelay on;
  open_file_cache max=10000 inactive=60s;
  open_file_cache_valid 30s;
  open_file_cache_min_uses 2;
  open_file_cache_errors on;
  gzip on; gzip_vary on; gzip_comp_level 5; gzip_min_length 256;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_static on;

  server {
    listen 8080;
    root /srv/site;
    location /tinh/ {
      add_header Cache-Control "public, max-age=31536000, immutable" always; <span class="tok-comment">  # "always" — xem 404 bên dưới</span>
      add_header X-Content-Type-Options "nosniff" always;
      try_files $uri =404;
    }
    location /tai-len/ {
      types { }
      default_type application/octet-stream;
      add_header Content-Disposition "attachment" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header Cache-Control "public, max-age=604800";
      try_files $uri =404;
    }
    location = /index.html {
      add_header Cache-Control "no-cache";
      add_header X-Content-Type-Options "nosniff" always;
    }
    location / { try_files $uri $uri/ /index.html; }
  }
}</code></pre>
<div class="out">$ for u in /tinh/app.4f9a2c.js /index.html /trang/bat-ky /tai-len/anh.jpg /tai-len/la.html /tinh/khong-co.js; do echo "== $u"; bash xem.sh $u; done
== /tinh/app.4f9a2c.js
  HTTP/1.1 200 OK
  Content-Type: application/javascript
  ETag: W/"6af5c6b4-1bc6b"
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
  Content-Encoding: gzip
== /index.html
  HTTP/1.1 200 OK
  Content-Type: text/html
  ETag: "6af5c6b4-4d"
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
== /trang/bat-ky
  HTTP/1.1 200 OK
  Content-Type: text/html
  ETag: "6af5c6b4-4d"
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
== /tai-len/anh.jpg
  HTTP/1.1 200 OK
  Content-Type: application/octet-stream
  ETag: "6af5c6b4-1388"
  Content-Disposition: attachment
  X-Content-Type-Options: nosniff
  Cache-Control: public, max-age=604800
== /tai-len/la.html
  HTTP/1.1 200 OK
  Content-Type: application/octet-stream
  ETag: "6af5c6b4-28"
  Content-Disposition: attachment
  X-Content-Type-Options: nosniff
  Cache-Control: public, max-age=604800
== /tinh/khong-co.js
  HTTP/1.1 404 Not Found
  Content-Type: text/html
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
$ grep -n 'immutable' site.conf
21:      add_header Cache-Control "public, max-age=31536000, immutable";
$ for u in /tinh/khong-co.js /tinh/app.4f9a2c.js; do echo "== $u"; bash xem.sh $u; done
== /tinh/khong-co.js
  HTTP/1.1 404 Not Found
  Content-Type: text/html
  X-Content-Type-Options: nosniff
== /tinh/app.4f9a2c.js
  HTTP/1.1 200 OK
  Content-Type: application/javascript
  ETag: W/"6af5c6b4-1bc6b"
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
  Content-Encoding: gzip</div>
<p>Hashed asset: gzip, a weak ETag, a year immutable. Index and the SPA path: the same ETag and <code>no-cache</code>. Both uploads: octet-stream, attachment, nosniff. The missing hashed file: a 404 carrying a year of <code>immutable</code> — gone once <code>always</code> was removed, while the real file kept its year.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 12.4 — CDN and static files</span><span class="lc-sub">This block in front of a real app</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-1-nhan-file-multipart" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.1 — Receiving multipart uploads</span><span class="lc-sub">Accepting the files this block later serves</span></span></a>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">default_type application/octet-stream</span><span class="v">The safe fallback type for a file server, so an unknown extension downloads rather than renders.</span></div>
  <div class="kv"><span class="k">types { }</span><span class="v">An empty type table inside a location; with octet-stream it forces every upload to be announced as binary.</span></div>
  <div class="kv"><span class="k">Content-Disposition: attachment</span><span class="v">The second lock on uploads — tells the browser to download, not display, even types it would normally render.</span></div>
  <div class="kv"><span class="k">try_files ... =404</span><span class="v">An explicit miss so a missing upload is a <code>404</code>, not the SPA shell returned with status <code>200</code>.</span></div>
  <div class="kv"><span class="k">always flag</span><span class="v">Applies an <code>add_header</code> to error responses too — right for security headers, wrong on <code>Cache-Control</code>.</span></div>
  <div class="kv"><span class="k">SPA fallback</span><span class="v">The internal redirect to <code>/index.html</code> re-runs location matching, landing back in <code>location = /index.html</code>.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>One config combines hashed assets (a year, <code>immutable</code>), HTML (<code>no-cache</code>), an SPA fallback, and a locked-down uploads directory.</li><li>Uploads use empty <code>types { }</code> + <code>default_type application/octet-stream</code> + <code>Content-Disposition: attachment</code> + <code>nosniff</code>, so an uploaded file can never render as a document (stored XSS).</li><li>The SPA fallback re-runs location matching, so the HTML caching rule written once in <code>location = /index.html</code> applies to every SPA route.</li><li><code>always</code> on <code>Cache-Control</code> cached a <code>404</code> for a year — <code>always</code> belongs on security headers, never on caching.</li><li>Measure the error paths too: one <code>curl -I</code> per route, including a path that does not exist, is the whole review.</li></ul>

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
<pre><code class="language-bash">http {
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
      add_header Cache-Control "public, max-age=31536000, immutable" always;   <span class="tok-comment"># "always" — the bug measured below</span>
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

<h3>🔬 Tự chạy lại</h3>
<p>Nguyên khối ở trên trên cổng 8080 (thay listen 443 bằng một cổng thường cho phòng thí nghiệm), xin từng tuyến, rồi bỏ <code>always</code> khỏi Cache-Control, trên nginx/1.24.0:</p>
<pre><code class="language-bash">pid       /srv/logs/nginx.pid;
error_log /srv/logs/error.log;
events {}
http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  access_log    off;
  sendfile on; tcp_nopush on; tcp_nodelay on;
  open_file_cache max=10000 inactive=60s;
  open_file_cache_valid 30s;
  open_file_cache_min_uses 2;
  open_file_cache_errors on;
  gzip on; gzip_vary on; gzip_comp_level 5; gzip_min_length 256;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_static on;

  server {
    listen 8080;
    root /srv/site;
    location /tinh/ {
      add_header Cache-Control "public, max-age=31536000, immutable" always; <span class="tok-comment">  # "always" — xem 404 bên dưới</span>
      add_header X-Content-Type-Options "nosniff" always;
      try_files $uri =404;
    }
    location /tai-len/ {
      types { }
      default_type application/octet-stream;
      add_header Content-Disposition "attachment" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header Cache-Control "public, max-age=604800";
      try_files $uri =404;
    }
    location = /index.html {
      add_header Cache-Control "no-cache";
      add_header X-Content-Type-Options "nosniff" always;
    }
    location / { try_files $uri $uri/ /index.html; }
  }
}</code></pre>
<div class="out">$ for u in /tinh/app.4f9a2c.js /index.html /trang/bat-ky /tai-len/anh.jpg /tai-len/la.html /tinh/khong-co.js; do echo "== $u"; bash xem.sh $u; done
== /tinh/app.4f9a2c.js
  HTTP/1.1 200 OK
  Content-Type: application/javascript
  ETag: W/"6af5c6b4-1bc6b"
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
  Content-Encoding: gzip
== /index.html
  HTTP/1.1 200 OK
  Content-Type: text/html
  ETag: "6af5c6b4-4d"
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
== /trang/bat-ky
  HTTP/1.1 200 OK
  Content-Type: text/html
  ETag: "6af5c6b4-4d"
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
== /tai-len/anh.jpg
  HTTP/1.1 200 OK
  Content-Type: application/octet-stream
  ETag: "6af5c6b4-1388"
  Content-Disposition: attachment
  X-Content-Type-Options: nosniff
  Cache-Control: public, max-age=604800
== /tai-len/la.html
  HTTP/1.1 200 OK
  Content-Type: application/octet-stream
  ETag: "6af5c6b4-28"
  Content-Disposition: attachment
  X-Content-Type-Options: nosniff
  Cache-Control: public, max-age=604800
== /tinh/khong-co.js
  HTTP/1.1 404 Not Found
  Content-Type: text/html
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
$ grep -n 'immutable' site.conf
21:      add_header Cache-Control "public, max-age=31536000, immutable";
$ for u in /tinh/khong-co.js /tinh/app.4f9a2c.js; do echo "== $u"; bash xem.sh $u; done
== /tinh/khong-co.js
  HTTP/1.1 404 Not Found
  Content-Type: text/html
  X-Content-Type-Options: nosniff
== /tinh/app.4f9a2c.js
  HTTP/1.1 200 OK
  Content-Type: application/javascript
  ETag: W/"6af5c6b4-1bc6b"
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
  Content-Encoding: gzip</div>
<p>Tệp có mã băm: gzip, ETag yếu, một năm immutable. Trang index và đường dẫn SPA: cùng ETag và <code>no-cache</code>. Cả hai tệp tải lên: octet-stream, attachment, nosniff. Tệp băm không tồn tại: một cú 404 mang theo một năm <code>immutable</code> — biến mất khi bỏ <code>always</code>, còn tệp có thật vẫn giữ một năm.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-4-cdn-tep-tinh" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 12.4 — CDN và tệp tĩnh</span><span class="lc-sub">Khối này đứng trước một ứng dụng thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-1-nhan-file-multipart" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 10.1 — Nhận tệp multipart</span><span class="lc-sub">Nhận đúng những tệp mà khối này sau đó phục vụ</span></span></a>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">default_type application/octet-stream</span><span class="v">Kiểu rơi về an toàn cho một máy chủ tệp, để một phần đuôi lạ tải về chứ không dựng ra.</span></div>
  <div class="kv"><span class="k">types { }</span><span class="v">Một bảng kiểu rỗng đặt trong location; đi với octet-stream nó ép mọi tệp tải lên được công bố là nhị phân.</span></div>
  <div class="kv"><span class="k">Content-Disposition: attachment</span><span class="v">Cái khoá thứ hai cho tệp tải lên — bảo trình duyệt tải về, không hiển thị, kể cả kiểu bình thường nó dựng ra.</span></div>
  <div class="kv"><span class="k">try_files ... =404</span><span class="v">Một cú trượt tường minh để tệp tải lên thiếu là một <code>404</code>, không phải vỏ SPA trả về với mã <code>200</code>.</span></div>
  <div class="kv"><span class="k">cờ always</span><span class="v">Áp một <code>add_header</code> cho cả phản hồi lỗi — đúng cho header bảo mật, sai trên <code>Cache-Control</code>.</span></div>
  <div class="kv"><span class="k">Dự phòng SPA</span><span class="v">Cú chuyển hướng nội bộ về <code>/index.html</code> chạy lại phép khớp location, rơi lại vào <code>location = /index.html</code>.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một cấu hình gộp tài nguyên có băm (một năm, <code>immutable</code>), HTML (<code>no-cache</code>), một dự phòng SPA, và một thư mục tệp tải lên bị khoá chặt.</li><li>Tệp tải lên dùng <code>types { }</code> rỗng + <code>default_type application/octet-stream</code> + <code>Content-Disposition: attachment</code> + <code>nosniff</code>, nên một tệp tải lên không bao giờ dựng được thành tài liệu (XSS lưu trữ).</li><li>Dự phòng SPA chạy lại phép khớp location, nên luật cache HTML viết một lần trong <code>location = /index.html</code> áp cho mọi tuyến của SPA.</li><li><code>always</code> trên <code>Cache-Control</code> đã cache một cú <code>404</code> suốt một năm — <code>always</code> thuộc về header bảo mật, không bao giờ thuộc về chuyện cache.</li><li>Đo cả đường lỗi: một lệnh <code>curl -I</code> cho mỗi tuyến, kể cả một đường dẫn không tồn tại, là xong cả buổi rà.</li></ul>

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
