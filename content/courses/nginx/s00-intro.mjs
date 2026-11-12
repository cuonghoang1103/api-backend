/**
 * Nginx — Mục 0: Bài toán, và một bản dựng chạy được.
 * Nginx giải bài toán gì · cài và chạy trong hai phút · tệp cấu hình đầu tiên · quiz.
 * Output CHẠY THẬT nginx/1.24.0 (Ubuntu) trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import G00_8 from './giang/ngx-00-8.mjs';
import G00_9 from './giang/ngx-00-9.mjs';
import G00_1 from './giang/ngx-00-1.mjs';
import G00_2 from './giang/ngx-00-2.mjs';
import G00_3 from './giang/ngx-00-3.mjs';
const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Section 0 — The problem, and a build that runs|||Mục 0 — Bài toán, và một bản dựng chạy được',
  description: 'Trước khi có một directive nào: Nginx giải bài toán gì mà một ứng dụng Node hay Python không tự giải nổi, mô hình tiến trình của nó khác gì, và một tệp cấu hình nhỏ nhất chạy được trông ra sao. Cuối mục này bạn đã có một máy chủ đang chạy và đọc được cây tiến trình của chính nó.',
  lessons: [

    /* ───────────────────── Bắt đầu tại đây 1/2 ───────────────────── */
    {
      title: 'Start here (1/2) — What this course is, and why Nginx is worth learning|||Bắt đầu tại đây (1/2) — Khoá này là gì, và vì sao Nginx đáng học',
      slug: 'nginx-0-0-bat-dau-1',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng chạm Nginx: reverse proxy là gì, khoá này dạy gì qua Mục 0 và mười một chương, và vì sao một kỹ sư backend nên học nó — một công cụ đứng trước gần như mọi web production.',
      content: `
${G00_8}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What this course is, and why Nginx is worth learning</h2>
<p class="lead">Nginx sits in front of a very large share of the web, and in most production stacks it is the first thing a request touches and the last thing it leaves. This course teaches it the way you will actually use it — one machine, one command at a time, every claim measured rather than asserted — so that by the end you can read, write and debug a real configuration instead of pasting one from a blog.</p>
<h3>What a reverse proxy is, in one sentence</h3>
<p>A reverse proxy is a server that stands in front of your application: the client talks to it, and it quietly talks to your app on a private port. That single position is what lets it terminate TLS, serve static files, cache responses, spread load across several backends and turn away abusive traffic — all in one place, so your application code never has to.</p>
<h3>What the course covers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Section 0 · Setup</span><span class="v">What Nginx is for, installing it, the master/worker process model, and the smallest config that runs.</span></div>
  <div class="kv"><span class="k">Chapters 1–2 · Routing</span><span class="v">How a request finds a <code>server</code> block, and which <code>location</code> inside it wins.</span></div>
  <div class="kv"><span class="k">Chapter 3 · Reverse proxy</span><span class="v"><code>proxy_pass</code>, the headers that reach your app, buffering, timeouts and WebSockets.</span></div>
  <div class="kv"><span class="k">Chapters 4–5 · Static files and caching</span><span class="v">Serving bytes efficiently, and caching responses in front of your application.</span></div>
  <div class="kv"><span class="k">Chapter 6 · TLS and HTTP/2</span><span class="v">Certificates, ciphers, the handshake cost, and the HTTPS redirect done right.</span></div>
  <div class="kv"><span class="k">Chapters 7–9 · Limits, rewriting, load balancing</span><span class="v">Rate and size limits, URL rewriting with <code>map</code>, and spreading traffic across backends.</span></div>
  <div class="kv"><span class="k">Chapters 10–11 · Logs and diagnosis</span><span class="v">Seeing what is happening, and making Nginx tell you what it did when something breaks.</span></div>
</div>
<h3>Why it is worth your time</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It is almost everywhere</span><span class="lz-lnote">Even when a managed platform or a CDN hides it, that thing IS a reverse proxy with a different configuration language. Every concept here — upstream, header rewriting, cache keys, TLS termination — reappears in all of them, and Nginx is the one you can run locally and read the source of.</span></div>
  <div class="lz-layer"><span class="lz-lname">It moves the boring half off your app</span><span class="lz-lnote">Holding slow connections, reading files from disk, terminating TLS and absorbing junk requests are exactly the jobs a single application process does badly. Learning Nginx is learning where that work belongs.</span></div>
  <div class="lz-layer"><span class="lz-lname">The failures are specific and learnable</span><span class="lz-lnote">Most Nginx outages come from a short list of rules — inheritance, location precedence, header replacement — that this course measures directly so you recognise them on sight.</span></div>
</div>
<h3>🔬 Run it yourself: a reverse proxy in thirty seconds</h3>
<p>Everything in this lesson fits in ten lines of configuration and one small app. This is the exact setup behind the video, run on nginx/1.24.0 (Ubuntu 24.04); copy it, run it, and compare your output.</p>
<pre><code class="language-bash">events {}
http {
  access_log /tmp/ng/logs/access.log;
  server {
    listen 8080;
    location /static/ { return 200 "tep tinh: nginx tu tra loi\\n"; }
    location /        { proxy_pass http://127.0.0.1:3000; }
  }
}</code></pre>
<pre><code class="language-javascript">// ứng dụng nhỏ của bạn: nghe 127.0.0.1:3000, trả lại vài thông tin của request nó nhận được
require('http').createServer((req, res) =&gt; {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ app: 'node:3000', url: req.url, host: req.headers.host, ip: req.socket.remoteAddress }) + '\\n');
}).listen(3000, '127.0.0.1');</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># 1) a tiny app on a private port (any language works — this one is Node)</span>
node app.js &amp;
<span class="tok-comment"># 2) check the config, then start nginx with YOUR file (no root, no systemd)</span>
nginx -c /tmp/ng/conf/nginx.conf -t
nginx -c /tmp/ng/conf/nginx.conf
<span class="tok-comment"># 3) ask the app directly, then through nginx</span>
curl -s http://127.0.0.1:3000/api/hello
curl -s http://127.0.0.1:8080/api/hello
curl -s http://127.0.0.1:8080/static/logo.png</code></pre>
<div class="out">$ nginx -v
nginx version: nginx/1.24.0 (Ubuntu)
$ nginx -c /tmp/ng/conf/nginx.conf -t
nginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok
nginx: configuration file /tmp/ng/conf/nginx.conf test is successful
$ curl -s http://127.0.0.1:3000/api/hello
{"app":"node:3000","url":"/api/hello","host":"127.0.0.1:3000","ip":"127.0.0.1"}
$ curl -s http://127.0.0.1:8080/api/hello
{"app":"node:3000","url":"/api/hello","host":"127.0.0.1:3000","ip":"127.0.0.1"}
$ curl -s http://127.0.0.1:8080/static/logo.png
tep tinh: nginx tu tra loi
$ curl -sI http://127.0.0.1:8080/api/hello | grep -iE '^(HTTP|server|content-type)'
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: application/json
$ tail -n 2 /tmp/ng/logs/access.log
127.0.0.1 - - [12/Nov/2026:10:57:01 +0000] "GET /static/logo.png HTTP/1.1" 200 27 "-" "curl/8.5.0"
127.0.0.1 - - [12/Nov/2026:10:57:01 +0000] "HEAD /api/hello HTTP/1.1" 200 0 "-" "curl/8.5.0"</div>
<p>Three things to notice in that output. The app answered the same body whether you asked it directly or through Nginx. The <code>/static/</code> request never reached Node — Nginx answered it itself. And the app reported <code>host: "127.0.0.1:3000"</code>: through a default proxy it does not see the real host or the real client address, which is exactly what Chapter 3 fixes.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-1-4-cong-socket" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 1.5 — Ports and sockets</span><span class="lc-sub">How one machine serves many apps and many clients — the reason Nginx can sit on :8080 and your app on :3000</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-10-3-reverse-forward" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">Networking for Developers · 10.3 — Reverse proxy, forward proxy and tunnels</span><span class="lc-sub">The same idea from the network side: which side the proxy works for</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-2-reverse-proxy-tls" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 12.2 — Reverse proxy and HTTPS</span><span class="lc-sub">Where this course ends up in practice: Nginx in front of a real app with a real certificate</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">A server in front of your application that the client talks to instead of the app.</span></div>
  <div class="kv"><span class="k">Upstream</span><span class="v">The backend service Nginx forwards a request to.</span></div>
  <div class="kv"><span class="k">TLS termination</span><span class="v">Handling HTTPS certificates at the proxy, so the app speaks plain HTTP behind it.</span></div>
  <div class="kv"><span class="k">Edge</span><span class="v">The layer in front of your code where limits, caching and redirects belong.</span></div>
  <div class="kv"><span class="k">Directive</span><span class="v">One configuration instruction, such as <code>listen</code> or <code>proxy_pass</code>.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>Nginx is a reverse proxy: it stands in front of your app and handles TLS, static files, caching, load balancing and limits in one place.</li><li>The course runs over Section 0 plus eleven chapters, from routing to diagnosis.</li><li>Every managed platform and CDN is a proxy too — the concepts transfer everywhere.</li><li>It exists to take the work an application process does badly off your event loop.</li><li>Everything here is measured on a real Nginx, one machine and one command at a time.</li></ul>
<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">nginx — beginner's guide</span><span class="lc-sub">nginx.org · The project's own short introduction</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">nginx — documentation index</span><span class="lc-sub">nginx.org · The map of every module you will meet in this course</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">A running Nginx you can experiment in from the first lesson</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Khoá này là gì, và vì sao Nginx đáng học</h2>
<p class="lead">Nginx đứng trước một phần rất lớn của web, và trong hầu hết hệ thống production nó là thứ đầu tiên một request chạm vào và là thứ cuối cùng request rời khỏi. Khoá này dạy nó đúng theo cách bạn sẽ thật sự dùng — một máy, mỗi lần một câu lệnh, mọi khẳng định đều ĐO chứ không nói suông — để tới cuối khoá bạn ĐỌC, VIẾT và GỠ LỖI được một cấu hình thật, thay vì chép một cái từ blog về.</p>
<h3>Reverse proxy là gì, trong một câu</h3>
<p>Reverse proxy là một máy chủ đứng trước ứng dụng của bạn: client nói chuyện với nó, còn nó lặng lẽ nói chuyện với ứng dụng của bạn trên một cổng nội bộ. Chính vị trí duy nhất đó cho phép nó kết thúc TLS, phục vụ tệp tĩnh, cache phản hồi, rải tải qua nhiều backend và chặn lưu lượng rác — tất cả ở một chỗ, để mã ứng dụng của bạn không bao giờ phải làm.</p>
<h3>Khoá này gồm những gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mục 0 · Bản dựng</span><span class="v">Nginx dùng để làm gì, cài nó, mô hình tiến trình master/worker, và tệp cấu hình nhỏ nhất chạy được.</span></div>
  <div class="kv"><span class="k">Chương 1–2 · Định tuyến</span><span class="v">Một request tìm ra khối <code>server</code> thế nào, và <code>location</code> nào bên trong thắng.</span></div>
  <div class="kv"><span class="k">Chương 3 · Reverse proxy</span><span class="v"><code>proxy_pass</code>, những header tới được ứng dụng, đệm, timeout và WebSocket.</span></div>
  <div class="kv"><span class="k">Chương 4–5 · Tệp tĩnh và bộ đệm</span><span class="v">Phục vụ byte hiệu quả, và cache phản hồi đặt trước ứng dụng của bạn.</span></div>
  <div class="kv"><span class="k">Chương 6 · TLS và HTTP/2</span><span class="v">Chứng chỉ, bộ mã, cái giá của bắt tay, và cú chuyển hướng HTTPS làm cho đúng.</span></div>
  <div class="kv"><span class="k">Chương 7–9 · Giới hạn, viết lại, cân bằng tải</span><span class="v">Trần tần suất và kích thước, viết lại URL bằng <code>map</code>, và rải lưu lượng qua các backend.</span></div>
  <div class="kv"><span class="k">Chương 10–11 · Log và chẩn đoán</span><span class="v">Nhìn thấy chuyện đang xảy ra, và bắt Nginx khai ra nó đã làm gì khi có thứ hỏng.</span></div>
</div>
<h3>Vì sao đáng để bạn bỏ thời gian</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó gần như ở khắp nơi</span><span class="lz-lnote">Kể cả khi một nền tảng được quản lý hay một CDN che nó đi, cái đó VẪN LÀ một reverse proxy với một ngôn ngữ cấu hình khác. Mọi khái niệm ở đây — upstream, viết lại header, khoá bộ đệm, kết thúc TLS — đều xuất hiện lại ở tất cả chúng, và Nginx là cái bạn chạy được tại máy và đọc được mã nguồn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó bóc cái nửa nhàm chán ra khỏi ứng dụng</span><span class="lz-lnote">Giữ kết nối chậm, đọc tệp từ đĩa, kết thúc TLS và nuốt request rác đúng là những việc mà một tiến trình ứng dụng đơn lẻ làm dở. Học Nginx là học xem phần việc đó THUỘC VỀ ĐÂU.</span></div>
  <div class="lz-layer"><span class="lz-lname">Các kiểu hỏng thì cụ thể và học được</span><span class="lz-lnote">Phần lớn sự cố Nginx đến từ một danh sách ngắn các luật — thừa hưởng, ưu tiên location, thay thế header — mà khoá này đo thẳng để bạn nhận ra chúng ngay khi thấy.</span></div>
</div>
<h3>🔬 Tự chạy lại: một reverse proxy trong ba mươi giây</h3>
<p>Mọi thứ trong bài này gói trong mười dòng cấu hình và một ứng dụng nhỏ. Đây đúng là bản dựng phía sau video, chạy trên nginx/1.24.0 (Ubuntu 24.04); bạn chép về, chạy, rồi so output của mình.</p>
<pre><code class="language-bash">events {}
http {
  access_log /tmp/ng/logs/access.log;
  server {
    listen 8080;
    location /static/ { return 200 "tep tinh: nginx tu tra loi\\n"; }
    location /        { proxy_pass http://127.0.0.1:3000; }
  }
}</code></pre>
<pre><code class="language-javascript">// ứng dụng nhỏ của bạn: nghe 127.0.0.1:3000, trả lại vài thông tin của request nó nhận được
require('http').createServer((req, res) =&gt; {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ app: 'node:3000', url: req.url, host: req.headers.host, ip: req.socket.remoteAddress }) + '\\n');
}).listen(3000, '127.0.0.1');</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># 1) một ứng dụng nhỏ ở cổng nội bộ (ngôn ngữ nào cũng được — ở đây là Node)</span>
node app.js &amp;
<span class="tok-comment"># 2) kiểm cấu hình, rồi chạy nginx bằng tệp CỦA BẠN (không cần root, không cần systemd)</span>
nginx -c /tmp/ng/conf/nginx.conf -t
nginx -c /tmp/ng/conf/nginx.conf
<span class="tok-comment"># 3) hỏi thẳng ứng dụng, rồi hỏi qua nginx</span>
curl -s http://127.0.0.1:3000/api/hello
curl -s http://127.0.0.1:8080/api/hello
curl -s http://127.0.0.1:8080/static/logo.png</code></pre>
<div class="out">$ nginx -v
nginx version: nginx/1.24.0 (Ubuntu)
$ nginx -c /tmp/ng/conf/nginx.conf -t
nginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok
nginx: configuration file /tmp/ng/conf/nginx.conf test is successful
$ curl -s http://127.0.0.1:3000/api/hello
{"app":"node:3000","url":"/api/hello","host":"127.0.0.1:3000","ip":"127.0.0.1"}
$ curl -s http://127.0.0.1:8080/api/hello
{"app":"node:3000","url":"/api/hello","host":"127.0.0.1:3000","ip":"127.0.0.1"}
$ curl -s http://127.0.0.1:8080/static/logo.png
tep tinh: nginx tu tra loi
$ curl -sI http://127.0.0.1:8080/api/hello | grep -iE '^(HTTP|server|content-type)'
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: application/json
$ tail -n 2 /tmp/ng/logs/access.log
127.0.0.1 - - [12/Nov/2026:10:57:01 +0000] "GET /static/logo.png HTTP/1.1" 200 27 "-" "curl/8.5.0"
127.0.0.1 - - [12/Nov/2026:10:57:01 +0000] "HEAD /api/hello HTTP/1.1" 200 0 "-" "curl/8.5.0"</div>
<p>Ba điều đáng để ý trong output. Ứng dụng trả về cùng một nội dung dù bạn hỏi thẳng hay hỏi qua Nginx. Request <code>/static/</code> không hề tới Node — chính Nginx trả lời. Và ứng dụng báo <code>host: "127.0.0.1:3000"</code>: qua một proxy mặc định, nó không thấy tên miền thật cũng không thấy địa chỉ thật của client — đúng thứ Chương 3 sửa.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-1-4-cong-socket" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking cho lập trình viên · 1.5 — Cổng và socket</span><span class="lc-sub">Một máy phục vụ nhiều ứng dụng và nhiều khách thế nào — lý do Nginx ở :8080 còn ứng dụng ở :3000</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-10-3-reverse-forward" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">Networking cho lập trình viên · 10.3 — Reverse proxy, forward proxy và đường hầm</span><span class="lc-sub">Cùng ý tưởng nhìn từ phía mạng: proxy làm việc cho phía nào</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-12-2-reverse-proxy-tls" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 12.2 — Reverse proxy và HTTPS</span><span class="lc-sub">Nơi khoá này dẫn tới trong thực tế: Nginx đứng trước một ứng dụng thật với chứng chỉ thật</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">Một máy chủ đứng trước ứng dụng mà client nói chuyện với nó thay vì với ứng dụng.</span></div>
  <div class="kv"><span class="k">Upstream</span><span class="v">Dịch vụ backend mà Nginx chuyển tiếp request tới.</span></div>
  <div class="kv"><span class="k">TLS termination</span><span class="v">Xử lý chứng chỉ HTTPS ở proxy, để ứng dụng phía sau chỉ nói HTTP thường.</span></div>
  <div class="kv"><span class="k">Edge (biên)</span><span class="v">Tầng đứng trước mã của bạn, nơi đặt giới hạn, bộ đệm và chuyển hướng.</span></div>
  <div class="kv"><span class="k">Directive</span><span class="v">Một chỉ thị cấu hình, ví dụ <code>listen</code> hay <code>proxy_pass</code>.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nginx là một reverse proxy: nó đứng trước ứng dụng và lo TLS, tệp tĩnh, bộ đệm, cân bằng tải và giới hạn ở một chỗ.</li><li>Khoá chạy qua Mục 0 cộng mười một chương, từ định tuyến tới chẩn đoán.</li><li>Mọi nền tảng được quản lý và CDN cũng là proxy — khái niệm chuyển được sang mọi nơi.</li><li>Nó tồn tại để bóc phần việc một tiến trình ứng dụng làm dở ra khỏi event loop của bạn.</li><li>Mọi thứ ở đây đều đo trên một Nginx thật, mỗi lần một máy và một câu lệnh.</li></ul>
<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">nginx — hướng dẫn cho người mới</span><span class="lc-sub">nginx.org · Bài nhập môn ngắn của chính dự án</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">nginx — mục lục tài liệu</span><span class="lc-sub">nginx.org · Bản đồ mọi module bạn sẽ gặp trong khoá này</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Một Nginx đang chạy để bạn thí nghiệm ngay từ bài đầu</span></span></a>
</div>
`,
    },

    /* ───────────────────── Bắt đầu tại đây 2/2 ───────────────────── */
    {
      title: 'Start here (2/2) — What you need to know first, and how to study this course|||Bắt đầu tại đây (2/2) — Nền tảng cần biết trước, và cách học khoá này',
      slug: 'nginx-0-0-bat-dau-2',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài thứ hai của cặp mở đầu: nền tảng bạn nên có sẵn (terminal, request/response HTTP, header, một máy Linux hoặc Docker), khoá học được dựng thế nào (mọi cấu hình chạy trên một máy, mọi số liệu đều đo), và cách học hiệu quả — chạy từng cấu hình chứ không chỉ đọc.',
      content: `
${G00_9}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What you need to know first, and how to study this course</h2>
<p class="lead">Lesson 1 said what the course is. This one is the honest checklist before you start: the handful of things you should already be comfortable with, the things you explicitly do not need, and a way to study a course whose whole point is measured numbers — by running every configuration yourself, because reading one is not the same as running it.</p>
<h3>What you should already know</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A terminal</span><span class="v">You can open a shell, run a command, and read its output. That is the whole prerequisite for the tooling.</span></div>
  <div class="kv"><span class="k">Request and response</span><span class="v">You know a client sends an HTTP request and a server sends a response with a status code.</span></div>
  <div class="kv"><span class="k">Headers</span><span class="v">You know a request and a response carry headers (<code>Host</code>, <code>Content-Type</code>, and so on) — we build on that, not from scratch.</span></div>
  <div class="kv"><span class="k">A Linux box or Docker</span><span class="v">Any Linux machine, a VM, WSL, or Docker Desktop is enough; every example runs on one.</span></div>
</div>
<h3>What you do NOT need</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A server, a domain or root</span><span class="lz-lnote">Every configuration in every chapter runs on one machine with one command, listening on port 8080, with no root and no systemd. You can do the whole course on a laptop.</span></div>
  <div class="lz-layer"><span class="lz-lname">Any prior nginx.conf experience</span><span class="lz-lnote">The course assumes you have never edited one. Section 0 builds the smallest config that runs before any chapter adds a directive.</span></div>
  <div class="lz-layer"><span class="lz-lname">A particular backend language</span><span class="lz-lnote">The app behind the proxy is just something that answers on a port. Examples use small Node servers, but nothing depends on knowing Node.</span></div>
</div>
<h3>How this course is built, and how to study it</h3>
<p>Every table and every output block in this course was produced by running the configuration on nginx/1.24.0, and where a measurement is unflattering it is printed that way. So the single most useful habit is to run each configuration yourself: start it with <code>nginx -c</code> on a file in <code>/tmp</code>, check it with <code>nginx -t</code> before every change, and reload with <code>nginx -t &amp;&amp; nginx -s reload</code>. Reading a config teaches you what it says; running it teaches you what it does, and the two are not the same.</p>
<h3>🔬 The study loop, run for real — including a mistake</h3>
<p>This is the loop the whole course uses, run as an ordinary user (<code>hoc</code>, not root) on nginx/1.24.0. The file below answers "phien ban MOT"; the second edit deliberately drops one semicolon.</p>
<pre><code class="language-bash">pid       /tmp/ng/logs/nginx.pid;
error_log /tmp/ng/logs/error.log;
events {}
http {
  access_log /tmp/ng/logs/access.log;
  server {
    listen 8080;
    location / { return 200 "phien ban MOT\\n"; }
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># the study loop — run it for every change in this course</span>
nginx -c /tmp/ng/conf/nginx.conf -t                                     <span class="tok-comment">  # 1) test the whole file</span>
nginx -c /tmp/ng/conf/nginx.conf                                        <span class="tok-comment">  # 2) start (first time only)</span>
nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload <span class="tok-comment">  # 3) after every edit</span>
curl -s http://127.0.0.1:8080/                                          <span class="tok-comment">  # 4) see what it DOES</span></code></pre>
<div class="out">$ id -un
hoc
$ nginx -c /tmp/ng/conf/nginx.conf -t
nginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok
nginx: configuration file /tmp/ng/conf/nginx.conf test is successful
$ nginx -c /tmp/ng/conf/nginx.conf
$ curl -s http://127.0.0.1:8080/
phien ban MOT
$ grep -n 'return' /tmp/ng/conf/nginx.conf
8:    location / { return 200 "phien ban HAI\\n" }
$ nginx -c /tmp/ng/conf/nginx.conf -t
2026/11/12 11:17:26 [emerg] 1331#1331: unexpected "}" in /tmp/ng/conf/nginx.conf:8
nginx: configuration file /tmp/ng/conf/nginx.conf test failed
$ nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload
2026/11/12 11:17:27 [emerg] 1345#1345: unexpected "}" in /tmp/ng/conf/nginx.conf:8
nginx: configuration file /tmp/ng/conf/nginx.conf test failed
$ curl -s http://127.0.0.1:8080/
phien ban MOT
$ grep -n 'return' /tmp/ng/conf/nginx.conf
8:    location / { return 200 "phien ban HAI\\n"; }
$ nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload
nginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok
nginx: configuration file /tmp/ng/conf/nginx.conf test is successful
2026/11/12 11:17:27 [notice] 1367#1367: signal process started
$ curl -s http://127.0.0.1:8080/
phien ban HAI
$ ss -ltnp | grep 8080
LISTEN 0      511          0.0.0.0:8080      0.0.0.0:*    users:(("nginx",pid=1375,fd=5),("nginx",pid=1309,fd=5))</div>
<p>Read the middle part slowly. <code>nginx -t</code> reported <code>unexpected "}"</code> on line 8 — the line where Nginx <em>noticed</em> the problem, which is the line with the missing semicolon here but is often the line <em>after</em> it. Because the reload was chained with <code>&amp;&amp;</code>, it never ran, and <code>curl</code> still got version ONE: the broken file never reached the running server. One more real detail from the first run: a request sent in the very same instant as a reload can still be answered by an old worker, so give it a moment before you check.</p>
<h3>🔗 If a prerequisite feels shaky</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-9-2-curl" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 9.2 — curl: the flags that matter</span><span class="lc-sub">The tool you will run after every change in this course</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-6-1-request-response" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 6.1 — Request and response</span><span class="lc-sub">The shape of HTTP, from zero</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-6-4-headers-json" target="_blank" rel="noopener"><span class="lc-ico">📨</span><span class="lc-body"><span class="lc-title">Web Foundations · 6.4 — Headers, JSON and the message body</span><span class="lc-sub">What Host and Content-Type are before Nginx starts reading them</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-10-5-nginx-lap-rap" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 10.5 — nginx in front, and the file too</span><span class="lc-sub">Running nginx as a container with your own config mounted</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Request / response</span><span class="v">The client's HTTP message and the server's reply with a status code.</span></div>
  <div class="kv"><span class="k">Header</span><span class="v">A name:value line carried by a request or a response, such as <code>Host</code>.</span></div>
  <div class="kv"><span class="k"><code>nginx -c</code></span><span class="v">Run Nginx from a config file of your choice — the whole course needs nothing more.</span></div>
  <div class="kv"><span class="k">Port 8080</span><span class="v">A high port anyone can bind without root — where every example listens.</span></div>
  <div class="kv"><span class="k">Measured, not asserted</span><span class="v">Every number here was produced by running the config, not inferred from the docs.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>You need a terminal, the idea of request/response and headers, and a Linux box or Docker — nothing more.</li><li>You do not need a server, a domain, root, prior nginx.conf experience, or a specific backend language.</li><li>Every configuration runs on one machine with one command on port 8080.</li><li>Every number in the course was measured on nginx/1.24.0, printed even when unflattering.</li><li>Study by running each config yourself: <code>nginx -c</code> to start, <code>nginx -t</code> before every change.</li></ul>
<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">MDN — HTTP messages</span><span class="lc-sub">developer.mozilla.org · Requests, responses, status codes and headers if you want a refresher</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">nginx — beginner's guide</span><span class="lc-sub">nginx.org · Installing and starting Nginx, which Lesson 0.2 does step by step</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">The sandbox where you run every configuration in this course</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Nền tảng cần biết trước, và cách học khoá này</h2>
<p class="lead">Bài 1 nói khoá này là gì. Bài này là bảng kiểm trung thực trước khi bạn bắt đầu: một nhúm thứ bạn nên đã quen, những thứ bạn KHÔNG cần, và một cách học cho một khoá mà cốt lõi là những con số đo được — bằng cách tự chạy từng cấu hình, vì đọc một cấu hình không giống chạy nó.</p>
<h3>Thứ bạn nên đã biết sẵn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Một terminal</span><span class="v">Bạn mở được shell, chạy một lệnh, và đọc được output của nó. Đó là toàn bộ điều kiện cho công cụ.</span></div>
  <div class="kv"><span class="k">Request và response</span><span class="v">Bạn biết client gửi một request HTTP và server trả một response kèm mã trạng thái.</span></div>
  <div class="kv"><span class="k">Header</span><span class="v">Bạn biết một request và một response mang các header (<code>Host</code>, <code>Content-Type</code>…) — ta xây tiếp trên đó, không bắt đầu từ số không.</span></div>
  <div class="kv"><span class="k">Một máy Linux hoặc Docker</span><span class="v">Một máy Linux bất kỳ, một VM, WSL, hay Docker Desktop là đủ; mọi ví dụ đều chạy trên một cái.</span></div>
</div>
<h3>Thứ bạn KHÔNG cần</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một máy chủ, một tên miền hay quyền root</span><span class="lz-lnote">Mọi cấu hình trong mọi chương chạy trên MỘT máy bằng MỘT câu lệnh, nghe ở cổng 8080, không cần root và không cần systemd. Bạn làm được cả khoá trên một chiếc laptop.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kinh nghiệm nginx.conf từ trước</span><span class="lz-lnote">Khoá giả định bạn chưa từng sửa một cái. Mục 0 dựng tệp cấu hình nhỏ nhất chạy được trước khi bất kỳ chương nào thêm một directive.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một ngôn ngữ backend cụ thể</span><span class="lz-lnote">Ứng dụng phía sau proxy chỉ là thứ trả lời trên một cổng. Ví dụ dùng vài máy chủ Node nhỏ, nhưng không gì phụ thuộc vào việc biết Node.</span></div>
</div>
<h3>Khoá này được dựng thế nào, và cách học nó</h3>
<p>Mọi bảng và mọi khối output trong khoá này được sinh ra bằng cách chạy cấu hình trên nginx/1.24.0, và chỗ nào phép đo không có lợi thì nó được in ra y như vậy. Nên thói quen hữu ích nhất là tự chạy từng cấu hình: khởi động bằng <code>nginx -c</code> với một tệp trong <code>/tmp</code>, kiểm bằng <code>nginx -t</code> trước mọi thay đổi, và nạp lại bằng <code>nginx -t &amp;&amp; nginx -s reload</code>. Đọc một cấu hình dạy bạn nó NÓI gì; chạy nó dạy bạn nó LÀM gì, và hai điều đó không giống nhau.</p>
<h3>🔬 Vòng học, chạy thật — kể cả một lỗi</h3>
<p>Đây là vòng học dùng suốt khoá, chạy bằng một người dùng THƯỜNG (<code>hoc</code>, không phải root) trên nginx/1.24.0. Tệp bên dưới trả về "phien ban MOT"; lần sửa thứ hai cố tình bỏ quên một dấu chấm phẩy.</p>
<pre><code class="language-bash">pid       /tmp/ng/logs/nginx.pid;
error_log /tmp/ng/logs/error.log;
events {}
http {
  access_log /tmp/ng/logs/access.log;
  server {
    listen 8080;
    location / { return 200 "phien ban MOT\\n"; }
  }
}</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># vòng học — chạy cho mọi thay đổi trong khoá này</span>
nginx -c /tmp/ng/conf/nginx.conf -t                                     <span class="tok-comment">  # 1) kiểm cả tệp</span>
nginx -c /tmp/ng/conf/nginx.conf                                        <span class="tok-comment">  # 2) khởi động (chỉ lần đầu)</span>
nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload <span class="tok-comment">  # 3) sau mỗi lần sửa</span>
curl -s http://127.0.0.1:8080/                                          <span class="tok-comment">  # 4) xem nó LÀM gì</span></code></pre>
<div class="out">$ id -un
hoc
$ nginx -c /tmp/ng/conf/nginx.conf -t
nginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok
nginx: configuration file /tmp/ng/conf/nginx.conf test is successful
$ nginx -c /tmp/ng/conf/nginx.conf
$ curl -s http://127.0.0.1:8080/
phien ban MOT
$ grep -n 'return' /tmp/ng/conf/nginx.conf
8:    location / { return 200 "phien ban HAI\\n" }
$ nginx -c /tmp/ng/conf/nginx.conf -t
2026/11/12 11:17:26 [emerg] 1331#1331: unexpected "}" in /tmp/ng/conf/nginx.conf:8
nginx: configuration file /tmp/ng/conf/nginx.conf test failed
$ nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload
2026/11/12 11:17:27 [emerg] 1345#1345: unexpected "}" in /tmp/ng/conf/nginx.conf:8
nginx: configuration file /tmp/ng/conf/nginx.conf test failed
$ curl -s http://127.0.0.1:8080/
phien ban MOT
$ grep -n 'return' /tmp/ng/conf/nginx.conf
8:    location / { return 200 "phien ban HAI\\n"; }
$ nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload
nginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok
nginx: configuration file /tmp/ng/conf/nginx.conf test is successful
2026/11/12 11:17:27 [notice] 1367#1367: signal process started
$ curl -s http://127.0.0.1:8080/
phien ban HAI
$ ss -ltnp | grep 8080
LISTEN 0      511          0.0.0.0:8080      0.0.0.0:*    users:(("nginx",pid=1375,fd=5),("nginx",pid=1309,fd=5))</div>
<p>Đọc chậm đoạn giữa. <code>nginx -t</code> báo <code>unexpected "}"</code> ở dòng 8 — dòng mà Nginx <em>phát hiện</em> ra lỗi; ở đây trùng dòng thiếu dấu chấm phẩy, nhưng rất hay là dòng <em>ngay sau</em> nó. Vì reload được nối bằng <code>&amp;&amp;</code> nên nó không chạy, và <code>curl</code> vẫn nhận phiên bản MỘT: tệp hỏng không bao giờ chạm tới máy chủ đang chạy. Thêm một chi tiết thật từ lần chạy đầu: request gửi đúng khoảnh khắc reload vẫn có thể do worker cũ trả lời, nên đợi một chút rồi hãy kiểm.</p>
<h3>🔗 Nếu phần nền còn lung lay</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-9-2-curl" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 9.2 — curl: những cờ thật sự quan trọng</span><span class="lc-sub">Công cụ bạn chạy sau mọi thay đổi trong khoá này</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-6-1-request-response" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 6.1 — Request và response</span><span class="lc-sub">Hình dạng của HTTP, từ số không</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-6-4-headers-json" target="_blank" rel="noopener"><span class="lc-ico">📨</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 6.4 — Header, JSON và phần thân</span><span class="lc-sub">Host và Content-Type là gì trước khi Nginx đọc chúng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-10-5-nginx-lap-rap" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 10.5 — nginx đứng trước, và cả cái tệp</span><span class="lc-sub">Chạy nginx bằng container, gắn cấu hình của riêng bạn</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Request / response</span><span class="v">Thông điệp HTTP của client và câu trả lời của server kèm mã trạng thái.</span></div>
  <div class="kv"><span class="k">Header</span><span class="v">Một dòng tên:giá-trị mà request hoặc response mang theo, ví dụ <code>Host</code>.</span></div>
  <div class="kv"><span class="k"><code>nginx -c</code></span><span class="v">Chạy Nginx từ một tệp cấu hình bạn chọn — cả khoá không cần gì hơn.</span></div>
  <div class="kv"><span class="k">Cổng 8080</span><span class="v">Một cổng cao ai cũng chiếm được mà không cần root — nơi mọi ví dụ lắng nghe.</span></div>
  <div class="kv"><span class="k">Đo, không nói suông</span><span class="v">Mọi con số ở đây được sinh ra bằng cách chạy cấu hình, không phải suy ra từ tài liệu.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bạn cần một terminal, khái niệm request/response và header, và một máy Linux hoặc Docker — không gì hơn.</li><li>Bạn KHÔNG cần máy chủ, tên miền, quyền root, kinh nghiệm nginx.conf, hay một ngôn ngữ backend cụ thể.</li><li>Mọi cấu hình chạy trên một máy bằng một câu lệnh ở cổng 8080.</li><li>Mọi con số trong khoá được đo trên nginx/1.24.0, in ra kể cả khi không có lợi.</li><li>Học bằng cách tự chạy từng cấu hình: <code>nginx -c</code> để khởi động, <code>nginx -t</code> trước mọi thay đổi.</li></ul>
<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">MDN — HTTP messages</span><span class="lc-sub">developer.mozilla.org · Request, response, mã trạng thái và header nếu bạn muốn ôn lại</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">nginx — hướng dẫn cho người mới</span><span class="lc-sub">nginx.org · Cài và khởi động Nginx, đúng thứ Bài 0.2 làm từng bước</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Chỗ hộp cát nơi bạn chạy mọi cấu hình trong khoá này</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — What Nginx solves that your application cannot|||0.1 — Nginx giải cái gì mà ứng dụng của bạn không tự giải nổi',
      slug: 'nginx-0-1-bai-toan',
      type: 'LESSON',
      description: 'Ứng dụng của bạn đã phục vụ được HTTP rồi, nên câu hỏi đúng không phải "Nginx làm gì" mà là "nó làm gì mà một tiến trình ứng dụng làm thì tệ". Bài này đo THẬT cả hai với cùng một tệp, tuần tự rồi song song, và con số chỉ tách hẳn ra ở cột thứ hai.',
      content: `
${G00_1}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What Nginx solves that your application cannot</h2>
<p class="lead">Your Node or Python application already speaks HTTP, already serves files and already listens on a port. So the honest question is not what Nginx does — it is what it does <em>better than a process you have already written</em>, and the answer is narrower and more specific than most introductions admit.</p>

<h3>The same file, two servers, measured</h3>
<div class="out">=== Tuan tu (1 luong) ===
  cong 8080 (nginx) · 1 luong · 40 request : 364 ms
  cong 8081 (node)  · 1 luong · 40 request : 474 ms

=== 50 luong song song ===
  cong 8080 (nginx) · 50 luong · 200 request : 481 ms
  cong 8081 (node)  · 50 luong · 200 request : 913 ms

=== Bo nho thuong tru trong luc chay ===
     1.7 MB  nginx: master
     3.5 MB  nginx: worker
     3.5 MB  nginx: worker
   169.4 MB  node ng/node-static.mjs

# Cung mot tep 2MB, cung mot may, nginx/1.24.0 va Node 22.
# Tuan tu: chenh 30%. Song song 50 luong: chenh GAN GAP DOI.
# Bo nho: 8,7 MB cho ca nginx, so voi 169 MB cho mot tien trinh Node.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Sequentially the difference is unremarkable</span><span class="v">Three hundred and sixty-four against four hundred and seventy-four milliseconds. If your product serves one file at a time, this measurement is not an argument for anything — and being honest about that is why the second row matters. <em>Measured again for the video (ApacheBench, Node 18, a 4-CPU container) the sequential gap was about 10×: the number depends heavily on HOW you measure — see "Run it yourself" below.</em></span></div>
  <div class="kv"><span class="k">Under concurrency it separates</span><span class="v">At fifty simultaneous clients the gap roughly doubles. That is the shape of the whole subject: Nginx is not faster at doing one thing, it is better at doing many things at once, because that is the only problem it was built for.</span></div>
  <div class="kv"><span class="k">Memory is the number that decides architecture</span><span class="v">Eight and a half megabytes against a hundred and sixty-nine. You can run Nginx alongside anything, on the smallest machine you have, and forget it exists — which is what makes putting it in front of everything reasonable.</span></div>
  <div class="kv"><span class="k">And the application was doing nothing else</span><span class="v">That Node process only read a file. A real one also renders templates, queries a database and runs your business logic — on the same event loop that was serving the file. Nginx takes the boring half away entirely.</span></div>
</div>

<h3>What it is actually for</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Reverse proxy</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">One public port, many private services</span><span class="lz-nsub">The main reason it exists in most stacks · Chapter 3 · your app never faces the internet directly</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · TLS termination</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Certificates in one place</span><span class="lz-nsub">Chapter 6 · one config and one renewal, instead of TLS in every application you deploy</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Static files</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The measurement above</span><span class="lz-nsub">Chapter 4 · sendfile, ranges, conditional requests and correct caching headers, for free</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">4 · The edge policies</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Limits, compression, cache, redirects</span><span class="lz-nsub">Chapters 5 and 7–9 · rules that belong in front of your code, not inside it</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Without Nginx: every app looks after everything itself.</span>
Internet → :3000 Node   (TLS? gzip? tệp tĩnh? trần tần suất? tất cả tự viết)
         → :4000 Python (…và viết lại lần nữa, bằng ngôn ngữ khác)

<span class="tok-comment"># With Nginx: one single place, and the app only handles its own job.</span>
Internet → :443 nginx ─┬→ 127.0.0.1:3000  /api
                       ├→ 127.0.0.1:4000  /ai
                       └→ /var/www        /static  (nginx tự phục vụ)</code></pre>
<div class="pitfall">
<p><strong>Trap — "Nginx is faster" is the most misused sentence about it.</strong> Nginx does not make your application faster: a proxied request is always SLOWER than a direct one, because there is an extra hop. What it does is take away the work your application does badly — holding thousands of slow connections, reading files off disk, terminating TLS, absorbing junk requests — so your event loop or thread pool only does its OWN job. Measure one API endpoint before and after adding a proxy and you will see it get a few milliseconds slower, and that is a trade worth making, not a magic trick.</p>
</div>

<h3>When you do not need it</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A managed platform already has one</span><span class="lz-lnote">Vercel, Railway, Fly, App Runner and every Kubernetes ingress put a proxy in front of you and terminate TLS there. Adding your own inside the container gives you a second hop and a second place to be wrong.</span></div>
  <div class="lz-layer"><span class="lz-lname">A CDN is doing the caching</span><span class="lz-lnote">If static assets are served from a CDN and the origin only answers API calls, most of Chapter 4 and Chapter 5 do not apply to you. Read them to understand what the CDN is doing, not to reimplement it.</span></div>
  <div class="lz-layer"><span class="lz-lname">One service, one machine, low traffic</span><span class="lz-lnote">An internal tool with twenty users does not need an edge tier. It probably does still want TLS, and a certificate tool plus the application's own HTTPS support may be simpler than a second daemon.</span></div>
  <div class="lz-layer"><span class="lz-lname">But learn it anyway</span><span class="lz-lnote">Every one of those platforms is a proxy with a different configuration language, and every concept in this course — upstream, header rewriting, cache keys, TLS termination — appears in all of them. Nginx is the version you can run locally and read the source of.</span></div>
</div>
<div class="note-ct">
<p><strong>What this course assumes, and what it does not.</strong> It assumes you can open a terminal and that you know what a request and a header are. It does not assume you have ever edited an <code>nginx.conf</code>, and it does not assume a server — every configuration in every chapter runs on one machine with one command, and the outputs you will read were produced exactly that way, on nginx/1.24.0. Where a measurement is unflattering to Nginx, as the first row above is, it is printed unflattering.</p>
</div>

<h3>🔬 Run it yourself: the measurement, repeated</h3>
<p>The video repeats this lesson's measurement on the course's lab machine (a Docker container pinned to 4 CPUs, nginx/1.24.0 with <code>worker_processes 2</code>, Node 18.19) using ApacheBench instead of a shell loop of curl. The Node server is deliberately minimal:</p>
<pre><code class="language-javascript">// Máy chủ tệp tĩnh tối giản bằng Node: đọc tệp từ đĩa và stream ra — đúng việc nginx làm ở cổng 8080.
import http from 'node:http';
import fs from 'node:fs';
http.createServer((req, res) =&gt; {
  const p = '/tmp/ng/www' + req.url;
  fs.stat(p, (err, st) =&gt; {
    if (err) { res.statusCode = 404; return res.end('not found\\n'); }
    res.writeHead(200, { 'Content-Length': st.size, 'Content-Type': 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
}).listen(8081, '127.0.0.1');</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># same 2 MB file: nginx on :8080, the Node server above on :8081</span>
ab -q -n 40  -c 1  http://127.0.0.1:8080/big.bin <span class="tok-comment">  # 40 requests, one at a time</span>
ab -q -n 40  -c 1  http://127.0.0.1:8081/big.bin
ab -q -n 200 -c 50 http://127.0.0.1:8080/big.bin <span class="tok-comment">  # 200 requests, 50 at once</span>
ab -q -n 200 -c 50 http://127.0.0.1:8081/big.bin
ps -eo rss,args | grep -E '[n]ginx|[n]ode-static'<span class="tok-comment">  # resident memory</span></code></pre>
<div class="out">$ ab -q -n 40 -c 1 http://127.0.0.1:8080/big.bin | grep -E 'Time taken|Requests per|Failed'
Time taken for tests:   0.018 seconds
Failed requests:        0
Requests per second:    2205.56 [#/sec] (mean)
$ ab -q -n 40 -c 1 http://127.0.0.1:8081/big.bin | grep -E 'Time taken|Requests per|Failed'
Time taken for tests:   0.179 seconds
Failed requests:        0
Requests per second:    223.64 [#/sec] (mean)
$ ab -q -n 200 -c 50 http://127.0.0.1:8080/big.bin | grep -E 'Time taken|Requests per|Failed'
Time taken for tests:   0.062 seconds
Failed requests:        0
Requests per second:    3243.28 [#/sec] (mean)
$ ab -q -n 200 -c 50 http://127.0.0.1:8081/big.bin | grep -E 'Time taken|Requests per|Failed'
Time taken for tests:   0.332 seconds
Failed requests:        0
Requests per second:    602.87 [#/sec] (mean)
$ ps -eo rss,args | grep -E '[n]ginx|[n]ode-static' | awk '{printf "%7.1f MB  ", $1/1024; $1=""; print}'
    1.5 MB   nginx: master process nginx -c /tmp/ng/conf/nginx.conf
    3.4 MB   nginx: worker process
    3.4 MB   nginx: worker process
   92.0 MB   node /tmp/ng/node-static.mjs</div>
<p>Here Nginx was about 10× faster one request at a time and about 5× faster at fifty concurrent requests, at 8.3 MB against 92 MB. The original numbers above (364 vs 474 ms) were measured with a loop of <code>curl</code> on another machine with Node 22 — and a curl loop also measures starting <code>curl</code> forty times (here 274 vs 812 ms). Repeating the 200-request test gave Node 940 ms once and 1,682 ms another time: compare ratios, and repeat a measurement before you believe it.</p>
<pre><code class="language-bash"><span class="tok-comment"># the cost of the extra hop: a tiny API directly, then through nginx</span>
ab -q -n 2000 -c 1 http://127.0.0.1:3000/api <span class="tok-comment">  # the app</span>
ab -q -n 2000 -c 1 http://127.0.0.1:8082/api <span class="tok-comment">  # nginx → the app</span></code></pre>
<div class="out">$ ab -q -n 2000 -c 1 http://127.0.0.1:3000/api | grep -E 'Time per request.*\\(mean\\)$'
Time per request:       0.184 [ms] (mean)
$ ab -q -n 2000 -c 1 http://127.0.0.1:8082/api | grep -E 'Time per request.*\\(mean\\)$'
Time per request:       0.287 [ms] (mean)</div>
<p>And this is the trap from above, measured: through Nginx each request took about a tenth of a millisecond longer. The hop is never free — what you buy is the boring half of the work taken off your app.</p>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-2-4-chan-event-loop" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 2.4 — Blocking the event loop, measured</span><span class="lc-sub">The other half of this measurement: what one process pays when it does everything on one loop</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-16-1-do-truoc-khi-doan" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">Node.js · 16.1 — Measure before you guess</span><span class="lc-sub">How to measure a server so the numbers mean something</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-10-3-reverse-forward" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">Networking for Developers · 10.3 — Reverse proxy, forward proxy and tunnels</span><span class="lc-sub">Where a reverse proxy sits on the network path</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">One public port standing in front of many private services — the main reason Nginx is in a stack.</span></div>
  <div class="kv"><span class="k">TLS termination</span><span class="v">Handling HTTPS certificates in one place instead of in every application.</span></div>
  <div class="kv"><span class="k">Static file serving</span><span class="v">Sending files from disk with sendfile, range requests and correct cache headers, for free.</span></div>
  <div class="kv"><span class="k">Edge policies</span><span class="v">Limits, compression, caching and redirects that belong in front of your code, not inside it.</span></div>
  <div class="kv"><span class="k">Concurrency</span><span class="v">Serving many simultaneous connections — the workload where Nginx pulls away from an app process.</span></div>
  <div class="kv"><span class="k">Resident memory</span><span class="v">About 8.7 MB for all of Nginx versus 169 MB for one Node process in the measurement.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>Nginx is not faster at one request — a proxy adds a hop — but it wins under concurrency and costs a fraction of the memory.</li><li>Its four jobs are reverse proxy, TLS termination, static files, and edge policies.</li><li>It takes the work an app does badly — slow connections, TLS, file reads — off your event loop.</li><li>Behind a managed platform or CDN you may not run your own, but those ARE proxies; learn the concepts anyway.</li><li>Every measurement here is real (nginx/1.24.0) and printed even when it does not flatter Nginx.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">nginx — beginner's guide</span><span class="lc-sub">nginx.org · The project's own short introduction, worth reading once end to end</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html" target="_blank" rel="noopener"><span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">nginx — the http core module</span><span class="lc-sub">nginx.org · The reference page you will return to more than any other</span></span></a>
<a class="link-card" href="https://www.aosabook.org/en/nginx.html" target="_blank" rel="noopener"><span class="lc-ico">🏛️</span><span class="lc-body"><span class="lc-title">The Architecture of Open Source Applications — nginx</span><span class="lc-sub">aosabook.org · Why the process model looks the way it does</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">The event loop, and what blocking it costs — the other half of the measurement above</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Run both servers, measure them yourself, and find the concurrency where they diverge</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Nginx giải cái gì mà ứng dụng của bạn không tự giải nổi</h2>
<p class="lead">Ứng dụng Node hay Python của bạn vốn đã nói được HTTP, đã phục vụ được tệp và đã lắng nghe trên một cổng. Nên câu hỏi trung thực không phải Nginx LÀM GÌ — mà là nó làm gì <em>TỐT HƠN một tiến trình mà bạn đã tự viết</em>, và câu trả lời hẹp hơn và cụ thể hơn nhiều so với những gì phần lớn bài giới thiệu chịu thừa nhận.</p>

<h3>Cùng một tệp, hai máy chủ, đo thật</h3>
<div class="out">=== Tuan tu (1 luong) ===
  cong 8080 (nginx) · 1 luong · 40 request : 364 ms
  cong 8081 (node)  · 1 luong · 40 request : 474 ms

=== 50 luong song song ===
  cong 8080 (nginx) · 50 luong · 200 request : 481 ms
  cong 8081 (node)  · 50 luong · 200 request : 913 ms

=== Bo nho thuong tru trong luc chay ===
     1.7 MB  nginx: master
     3.5 MB  nginx: worker
     3.5 MB  nginx: worker
   169.4 MB  node ng/node-static.mjs

# Cung mot tep 2MB, cung mot may, nginx/1.24.0 va Node 22.
# Tuan tu: chenh 30%. Song song 50 luong: chenh GAN GAP DOI.
# Bo nho: 8,7 MB cho ca nginx, so voi 169 MB cho mot tien trinh Node.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chạy TUẦN TỰ thì khác biệt chẳng có gì đáng nói</span><span class="v">Ba trăm sáu mươi tư so với bốn trăm bảy mươi tư mili giây. Nếu sản phẩm của bạn phục vụ MỘT tệp tại một thời điểm thì phép đo này không phải lý lẽ cho bất cứ điều gì — và việc nói thẳng chuyện đó chính là lý do hàng THỨ HAI mới đáng kể. <em>Đo lại cho video (ApacheBench, Node 18, container 4 CPU) thì khoảng cách tuần tự lên tới khoảng 10 lần: con số phụ thuộc rất nhiều vào CÁCH đo — xem mục "Tự chạy lại" bên dưới.</em></span></div>
  <div class="kv"><span class="k">Chạy SONG SONG thì nó tách hẳn ra</span><span class="v">Ở năm mươi client đồng thời, khoảng cách rộng ra gần gấp đôi. Đó chính là hình dạng của cả môn học này: Nginx không nhanh hơn khi làm MỘT việc, nó GIỎI HƠN khi làm nhiều việc cùng lúc, vì đó là bài toán DUY NHẤT nó được dựng ra để giải.</span></div>
  <div class="kv"><span class="k">Bộ nhớ mới là con số quyết định KIẾN TRÚC</span><span class="v">Tám phẩy năm megabyte so với một trăm sáu mươi chín. Bạn chạy Nginx cạnh bất cứ thứ gì, trên cái máy nhỏ nhất bạn có, rồi quên là nó tồn tại — và chính điều đó làm cho việc đặt nó trước MỌI THỨ trở nên hợp lý.</span></div>
  <div class="kv"><span class="k">Mà cái ứng dụng kia còn chẳng làm gì khác</span><span class="v">Tiến trình Node đó chỉ ĐỌC MỘT TỆP. Một tiến trình thật còn dựng template, truy vấn cơ sở dữ liệu và chạy logic nghiệp vụ của bạn — trên CHÍNH cái event loop vừa phục vụ tệp. Nginx bóc hẳn cái nửa nhàm chán ấy đi.</span></div>
</div>

<h3>Nó thật ra dùng để làm gì</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Proxy ngược</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một cổng công khai, nhiều dịch vụ nội bộ</span><span class="lz-nsub">Lý do chính khiến nó có mặt trong phần lớn hệ thống · Chương 3 · ứng dụng của bạn không bao giờ đối mặt trực tiếp với Internet</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Kết thúc TLS</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chứng chỉ nằm ở MỘT chỗ</span><span class="lz-nsub">Chương 6 · một cấu hình và một lần gia hạn, thay vì cắm TLS vào MỌI ứng dụng bạn triển khai</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Tệp tĩnh</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chính là phép đo ở trên</span><span class="lz-nsub">Chương 4 · sendfile, tải theo dải, request có điều kiện và header cache đúng chuẩn — miễn phí</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">4 · Các chính sách ở BIÊN</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Trần, nén, bộ đệm, chuyển hướng</span><span class="lz-nsub">Chương 5 và 7–9 · những luật thuộc về phía TRƯỚC mã của bạn, không thuộc về bên trong nó</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Không có Nginx: mỗi ứng dụng tự lo mọi thứ.</span>
Internet → :3000 Node   (TLS? gzip? tệp tĩnh? trần tần suất? tất cả tự viết)
         → :4000 Python (…và viết lại lần nữa, bằng ngôn ngữ khác)

<span class="tok-comment"># Có Nginx: một chỗ duy nhất, và ứng dụng chỉ còn lo phần việc của nó.</span>
Internet → :443 nginx ─┬→ 127.0.0.1:3000  /api
                       ├→ 127.0.0.1:4000  /ai
                       └→ /var/www        /static  (nginx tự phục vụ)</code></pre>
<div class="pitfall">
<p><strong>Bẫy — "Nginx nhanh hơn" là câu bị dùng sai nhiều hơn cả.</strong> Nginx KHÔNG làm ứng dụng của bạn nhanh lên: một request đi qua proxy thì luôn CHẬM HƠN một request đi thẳng, vì có thêm một chặng. Cái nó làm là BÓC ĐI phần việc mà ứng dụng làm dở — giữ hàng nghìn kết nối chậm, đọc tệp từ đĩa, kết thúc TLS, nuốt các request rác — để cái event loop hay cái pool luồng của bạn chỉ còn làm phần việc RIÊNG của nó. Đo một endpoint API duy nhất trước và sau khi thêm proxy thì bạn sẽ thấy nó chậm đi vài mili giây, và đó là một cuộc TRAO ĐỔI CÓ LỜI, không phải một phép màu.</p>
</div>

<h3>Khi nào bạn KHÔNG cần tới nó</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một nền tảng được quản lý thì đã có sẵn một cái</span><span class="lz-lnote">Vercel, Railway, Fly, App Runner và mọi ingress của Kubernetes đều đặt sẵn một proxy trước mặt bạn và kết thúc TLS ở đó. Thêm một cái của riêng bạn BÊN TRONG container là thêm một chặng nữa và thêm một chỗ nữa để sai.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một CDN đang lo phần bộ đệm</span><span class="lz-lnote">Nếu tài nguyên tĩnh phục vụ từ CDN còn máy chủ gốc chỉ trả lời các lời gọi API thì phần lớn Chương 4 và Chương 5 KHÔNG áp cho bạn. Hãy đọc chúng để HIỂU cái CDN đang làm gì, đừng đọc để cài lại nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một dịch vụ, một máy, lưu lượng thấp</span><span class="lz-lnote">Một công cụ nội bộ hai mươi người dùng thì không cần một tầng biên. Nó có lẽ vẫn muốn có TLS, và một công cụ cấp chứng chỉ cộng với phần HTTPS sẵn có của chính ứng dụng có thể đơn giản hơn một tiến trình nền thứ hai.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhưng vẫn cứ học nó</span><span class="lz-lnote">Mỗi nền tảng kia đều là MỘT CÁI PROXY với một ngôn ngữ cấu hình khác, và mọi khái niệm trong khoá học này — upstream, viết lại header, khoá bộ đệm, kết thúc TLS — đều xuất hiện ở tất cả chúng. Nginx là cái phiên bản mà bạn CHẠY ĐƯỢC ngay tại máy và ĐỌC ĐƯỢC mã nguồn.</span></div>
</div>
<div class="note-ct">
<p><strong>Khoá học này giả định gì, và KHÔNG giả định gì.</strong> Nó giả định bạn mở được terminal và biết một request với một header là cái gì. Nó KHÔNG giả định bạn từng sửa một tệp <code>nginx.conf</code>, và cũng không giả định bạn có một máy chủ — mọi cấu hình trong mọi chương đều chạy được trên MỘT máy bằng MỘT câu lệnh, và những output bạn sắp đọc được sinh ra đúng theo cách đó, trên nginx/1.24.0. Chỗ nào phép đo KHÔNG có lợi cho Nginx, như đúng cái hàng đầu tiên ở trên, thì nó được in ra y nguyên như vậy.</p>
</div>

<h3>🔬 Tự chạy lại: lặp lại phép đo</h3>
<p>Video lặp lại phép đo của bài này trên máy thí nghiệm của khoá (container Docker giới hạn 4 CPU, nginx/1.24.0 với <code>worker_processes 2</code>, Node 18.19), đo bằng ApacheBench thay cho vòng lặp curl. Máy chủ Node được viết tối giản có chủ đích:</p>
<pre><code class="language-javascript">// Máy chủ tệp tĩnh tối giản bằng Node: đọc tệp từ đĩa và stream ra — đúng việc nginx làm ở cổng 8080.
import http from 'node:http';
import fs from 'node:fs';
http.createServer((req, res) =&gt; {
  const p = '/tmp/ng/www' + req.url;
  fs.stat(p, (err, st) =&gt; {
    if (err) { res.statusCode = 404; return res.end('not found\\n'); }
    res.writeHead(200, { 'Content-Length': st.size, 'Content-Type': 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
}).listen(8081, '127.0.0.1');</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># cùng tệp 2 MB: nginx ở :8080, máy chủ Node ở trên ở :8081</span>
ab -q -n 40  -c 1  http://127.0.0.1:8080/big.bin <span class="tok-comment">  # 40 request, mỗi lần một</span>
ab -q -n 40  -c 1  http://127.0.0.1:8081/big.bin
ab -q -n 200 -c 50 http://127.0.0.1:8080/big.bin <span class="tok-comment">  # 200 request, 50 cùng lúc</span>
ab -q -n 200 -c 50 http://127.0.0.1:8081/big.bin
ps -eo rss,args | grep -E '[n]ginx|[n]ode-static'<span class="tok-comment">  # bộ nhớ thường trú</span></code></pre>
<div class="out">$ ab -q -n 40 -c 1 http://127.0.0.1:8080/big.bin | grep -E 'Time taken|Requests per|Failed'
Time taken for tests:   0.018 seconds
Failed requests:        0
Requests per second:    2205.56 [#/sec] (mean)
$ ab -q -n 40 -c 1 http://127.0.0.1:8081/big.bin | grep -E 'Time taken|Requests per|Failed'
Time taken for tests:   0.179 seconds
Failed requests:        0
Requests per second:    223.64 [#/sec] (mean)
$ ab -q -n 200 -c 50 http://127.0.0.1:8080/big.bin | grep -E 'Time taken|Requests per|Failed'
Time taken for tests:   0.062 seconds
Failed requests:        0
Requests per second:    3243.28 [#/sec] (mean)
$ ab -q -n 200 -c 50 http://127.0.0.1:8081/big.bin | grep -E 'Time taken|Requests per|Failed'
Time taken for tests:   0.332 seconds
Failed requests:        0
Requests per second:    602.87 [#/sec] (mean)
$ ps -eo rss,args | grep -E '[n]ginx|[n]ode-static' | awk '{printf "%7.1f MB  ", $1/1024; $1=""; print}'
    1.5 MB   nginx: master process nginx -c /tmp/ng/conf/nginx.conf
    3.4 MB   nginx: worker process
    3.4 MB   nginx: worker process
   92.0 MB   node /tmp/ng/node-static.mjs</div>
<p>Ở đây Nginx nhanh hơn khoảng 10 lần khi mỗi lần một request, và khoảng 5 lần khi năm mươi request cùng lúc, với 8,3 MB so với 92 MB. Số gốc ở trên (364 so với 474 ms) đo bằng vòng lặp <code>curl</code> trên một máy khác với Node 22 — mà vòng lặp curl thì đo luôn cả việc khởi động <code>curl</code> bốn mươi lần (ở đây 274 so với 812 ms). Lặp lại phép đo 200 request, Node có lần 940 ms, có lần 1.682 ms: hãy so tỉ lệ, và đo lại trước khi tin một con số.</p>
<pre><code class="language-bash"><span class="tok-comment"># cái giá của một chặng: gọi thẳng một API nhỏ, rồi gọi qua nginx</span>
ab -q -n 2000 -c 1 http://127.0.0.1:3000/api <span class="tok-comment">  # ứng dụng</span>
ab -q -n 2000 -c 1 http://127.0.0.1:8082/api <span class="tok-comment">  # nginx → ứng dụng</span></code></pre>
<div class="out">$ ab -q -n 2000 -c 1 http://127.0.0.1:3000/api | grep -E 'Time per request.*\\(mean\\)$'
Time per request:       0.184 [ms] (mean)
$ ab -q -n 2000 -c 1 http://127.0.0.1:8082/api | grep -E 'Time per request.*\\(mean\\)$'
Time per request:       0.287 [ms] (mean)</div>
<p>Và đây là cái bẫy ở trên, đo thật: qua Nginx mỗi request lâu hơn khoảng một phần mười mili giây. Một chặng không bao giờ miễn phí — thứ bạn mua được là phần việc nhàm chán được bóc ra khỏi ứng dụng.</p>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-2-4-chan-event-loop" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 2.4 — Chặn event loop: đo bằng số thật</span><span class="lc-sub">Nửa còn lại của phép đo: một tiến trình phải trả gì khi làm mọi việc trên một vòng lặp</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-16-1-do-truoc-khi-doan" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">Node.js · 16.1 — Đo trước đã</span><span class="lc-sub">Đo một máy chủ thế nào để con số có nghĩa</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-10-3-reverse-forward" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">Networking cho lập trình viên · 10.3 — Reverse proxy, forward proxy và đường hầm</span><span class="lc-sub">Reverse proxy đứng ở đâu trên đường đi của gói tin</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">Một cổng công khai đứng trước nhiều dịch vụ nội bộ — lý do chính Nginx có mặt trong một hệ thống.</span></div>
  <div class="kv"><span class="k">TLS termination</span><span class="v">Xử lý chứng chỉ HTTPS ở MỘT chỗ thay vì trong mọi ứng dụng.</span></div>
  <div class="kv"><span class="k">Static file serving</span><span class="v">Gửi tệp từ đĩa bằng sendfile, request theo dải và header cache đúng — miễn phí.</span></div>
  <div class="kv"><span class="k">Edge policies</span><span class="v">Giới hạn, nén, bộ đệm và chuyển hướng thuộc về phía TRƯỚC mã của bạn, không phải bên trong.</span></div>
  <div class="kv"><span class="k">Concurrency</span><span class="v">Phục vụ nhiều kết nối đồng thời — đúng khối việc mà Nginx bỏ xa một tiến trình ứng dụng.</span></div>
  <div class="kv"><span class="k">Resident memory</span><span class="v">Khoảng 8,7 MB cho cả Nginx so với 169 MB cho một tiến trình Node trong phép đo.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nginx KHÔNG nhanh hơn ở một request — proxy thêm một chặng — nhưng nó thắng khi song song và tốn một phần nhỏ bộ nhớ.</li><li>Bốn việc của nó: reverse proxy, kết thúc TLS, tệp tĩnh, và các chính sách ở biên.</li><li>Nó bóc phần việc ứng dụng làm dở — kết nối chậm, TLS, đọc tệp — ra khỏi event loop của bạn.</li><li>Sau một nền tảng được quản lý hay CDN bạn có thể không tự chạy một cái, nhưng chúng ĐỀU là proxy; vẫn nên học khái niệm.</li><li>Mọi phép đo ở đây là thật (nginx/1.24.0) và được in ra kể cả khi không có lợi cho Nginx.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">nginx — hướng dẫn cho người mới</span><span class="lc-sub">nginx.org · Bài nhập môn ngắn của chính dự án, đáng đọc trọn một lượt</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html" target="_blank" rel="noopener"><span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">nginx — module http core</span><span class="lc-sub">nginx.org · Trang tra cứu bạn sẽ quay lại nhiều hơn bất kỳ trang nào khác</span></span></a>
<a class="link-card" href="https://www.aosabook.org/en/nginx.html" target="_blank" rel="noopener"><span class="lc-ico">🏛️</span><span class="lc-body"><span class="lc-title">Kiến trúc của các ứng dụng mã nguồn mở — nginx</span><span class="lc-sub">aosabook.org · Vì sao mô hình tiến trình lại có hình dạng như vậy</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Event loop, và cái giá của việc chặn nó — chính là nửa còn lại của phép đo ở trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Chạy cả hai máy chủ, tự đo lấy, và tìm ra mức song song mà chúng tách nhau ra</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Install, run, and read the process tree|||0.2 — Cài, chạy, và đọc cây tiến trình',
      slug: 'nginx-0-2-cai-va-chay',
      type: 'LESSON',
      description: 'Hai phút để có một Nginx đang chạy, rồi năm phút để hiểu cái bạn vừa khởi động: một tiến trình chủ chạy bằng root, mấy tiến trình thợ chạy bằng người dùng thường, và một cú nạp lại cấu hình KHÔNG làm rớt một kết nối nào — đo thật bằng chính số hiệu tiến trình.',
      content: `
${G00_2}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Install, run, and read the process tree</h2>
<p class="lead">Nginx installs in one command and starts in one more, which makes it tempting to skip straight to configuration. Five minutes spent on what actually started pays for itself immediately, because the process model explains the privilege split, the reload behaviour and half the error messages you will ever see from it.</p>

<h3>Two minutes to running</h3>
<pre><code class="language-bash"><span class="tok-comment"># Ubuntu / Debian</span>
sudo apt-get update &amp;&amp; sudo apt-get install -y nginx
nginx -v                       <span class="tok-comment"># nginx version: nginx/1.24.0 (Ubuntu)</span>
nginx -V 2&gt;&amp;1 | tr ' ' '\\\\n' | grep '^--with'   <span class="tok-comment"># the modules compiled in</span>

<span class="tok-comment"># Docker — touches nothing on the host</span>
docker run --rm -p 8080:80 -v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:1.27-alpine

<span class="tok-comment"># Run with ONE config file of your own — no root, no systemd</span>
nginx -c /tmp/ng/conf/nginx.conf         <span class="tok-comment"># start</span>
nginx -c /tmp/ng/conf/nginx.conf -t      <span class="tok-comment"># syntax check ONLY, does not start</span>
nginx -c /tmp/ng/conf/nginx.conf -s stop <span class="tok-comment"># stop</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Always run -t before anything else</span><span class="v"><code>nginx -t</code> parses the whole configuration and reports the file and line of the first problem. It costs nothing, it runs without touching the running server, and it is the single habit that prevents most Nginx outages.</span></div>
  <div class="kv"><span class="k">-c lets you experiment without a server</span><span class="v">Point it at a file in <code>/tmp</code>, listen on port 8080, and you have a complete Nginx to learn on with no root, no systemd and nothing to break. Every measurement in this course was produced that way.</span></div>
  <div class="kv"><span class="k">nginx -V tells you what you actually have</span><span class="v">Modules are compiled in, not loaded at runtime, so the build decides what directives exist. If a directive from the documentation is rejected as unknown, this is the first place to look — the Ubuntu build above has thirty-two <code>--with</code> flags, and other builds have different ones.</span></div>
  <div class="kv"><span class="k">Version matters more than for most software</span><span class="v">Directives are added and defaults change between releases, and distributions ship old versions for years. When a config from a blog post does not work, check which version it was written for before assuming you typed it wrong.</span></div>
</div>

<h3>What you started</h3>
<div class="out">$ ps -eo pid,ppid,user,args | grep '[n]ginx'
32209     1 root     nginx: master process nginx -c /tmp/ng/conf/nginx.conf
32210 32209 nobody   nginx: worker process
32211 32209 nobody   nginx: worker process
32213 32209 nobody   nginx: worker process
32214 32209 nobody   nginx: worker process

$ nproc
4</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Master</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Runs as root, serves nothing</span><span class="lz-nsub">Reads the config, binds ports below 1024, opens log files, spawns and supervises workers</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Workers</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Run unprivileged, handle every request</span><span class="lz-nsub">One per CPU core by default · each one juggles thousands of connections in a single thread</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">The split is the security</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A bug in request handling is not root</span><span class="lz-nsub">The process facing the internet cannot read files the worker user cannot read</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">worker_processes auto</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Four cores, four workers</span><span class="lz-nsub">More than one per core buys nothing — they would compete for the same CPUs. In a container, set a NUMBER: nginx 1.24 counts the host's CPUs (measured below: 10 workers where nproc says 4)</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Trap — "Permission denied" from Nginx is almost always about the WORKER, not the master.</strong> The master runs as root, so it can bind port 80 and read anything; the workers run as <code>www-data</code> or <code>nobody</code> and they are the ones reading your files. So a directory readable only by its owner produces <code>13: Permission denied</code> in the error log even though <code>cat</code> as root works fine. And it is not only the file's own permissions: the worker needs EXECUTE permission on EVERY parent directory along the path — a frequent failure when <code>root</code> points somewhere under <code>/home/someone</code>.</p>
</div>

<h3>Reload: the property that makes it operable</h3>
<div class="out"># Truoc khi nap lai
$ curl -s http://127.0.0.1:8080/
phien ban MOT
master pid = 32209 ; mot worker cu = 32210

# Doi cau hinh, roi:  nginx -s reload
$ curl -s http://127.0.0.1:8080/
phien ban HAI
master pid van la = 32209        &lt;- KHONG doi
worker moi: 32227 32228 32229 32230   &lt;- da thay HET

# Cau hinh moi da hieu luc, master khong khoi dong lai, va nhung ket noi
# dang do van duoc worker CU phuc vu cho xong roi worker do moi thoat.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">What reload actually does</span><span class="lz-t">Four steps, in order</span><span class="lz-d">The master re-reads the config, validates it, starts new workers with it, and tells the old workers to stop accepting new connections and exit once their current ones finish. A bad config fails at step two and nothing changes.</span></div>
  <div class="lz-step"><span class="lz-k">No dropped connections</span><span class="lz-t">Not "very few" — none</span><span class="lz-d">Requests in flight are completed by the worker that started them. This is why Nginx configuration changes are safe during traffic, and it is a genuinely unusual property among servers.</span></div>
  <div class="lz-step"><span class="lz-k">reload is not restart</span><span class="lz-t">And you almost never want restart</span><span class="lz-d"><code>systemctl restart</code> kills the master, closes the listening sockets and drops everything. Use <code>reload</code> for configuration; keep <code>restart</code> for a binary upgrade or a change to <code>worker_processes</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Test first, always</span><span class="lz-t">nginx -t &amp;&amp; nginx -s reload</span><span class="lz-d">One line, joined by <code>&amp;&amp;</code>, so a syntax error never reaches the reload. Put it in your deploy script and in your muscle memory.</span></div>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Log files are held open by the master</span><span class="lz-lnote">Rotating logs by renaming the file leaves Nginx writing to the renamed inode until you send it <code>-s reopen</code>. That is why every distribution's logrotate config for Nginx ends with exactly that signal — and why hand-rolled rotation silently stops producing logs.</span></div>
  <div class="lz-layer"><span class="lz-lname">The pid file is how signals find the master</span><span class="lz-lnote"><code>nginx -s reload</code> reads <code>pid</code> from the config, opens that file and signals what it names. A stale pid file after an unclean shutdown produces "invalid PID number" — delete it and start normally.</span></div>
  <div class="lz-layer"><span class="lz-lname">One thread per worker, and that matters</span><span class="lz-lnote">Each worker handles thousands of connections in one thread using an event loop, which is why nothing in Nginx configuration may block. Reading a file from a slow disk can stall a whole worker — the reason <code>aio</code> and thread pools exist.</span></div>
  <div class="lz-layer"><span class="lz-lname">Workers are cheap and disposable</span><span class="lz-lnote">Three megabytes each in the measurement from Lesson 0.1, and the master restarts one instantly if it crashes. A worker segfaulting drops the connections it was serving and nothing else, which is the other half of the privilege split above.</span></div>
</div>
<div class="note-ct">
<p><strong>Three commands worth memorising now.</strong> <code>nginx -t</code> before every change, <code>nginx -t &amp;&amp; nginx -s reload</code> to apply one, and <code>nginx -T</code> — capital T — to print the entire effective configuration with every <code>include</code> expanded. That last one is the answer to "which file is this setting actually coming from", which on a real server with a dozen files under <code>sites-enabled</code> is a question you will ask constantly, and the only reliable way to answer it.</p>
</div>

<h3>🔬 Run it yourself: the process tree, reload, and three failures</h3>
<p>Every output below is a real run on nginx/1.24.0 (Ubuntu 24.04) in a container pinned to 4 CPUs, with this configuration:</p>
<pre><code class="language-bash">worker_processes 4;
pid       /tmp/ng/logs/nginx.pid;
error_log /tmp/ng/logs/error.log;
events { worker_connections 1024; }
http {
  access_log /tmp/ng/logs/access.log;
  server {
    listen 8080;
    location / { return 200 "phien ban MOT\\n"; }
    location /rieng/ { alias /srv/riengtu/; }
  }
}</code></pre>
<pre><code class="language-bash">nginx -c /tmp/ng/conf/nginx.conf
ps -eo pid,ppid,user,args | grep '[n]ginx' <span class="tok-comment">  # master (root) + workers (nobody)</span>
<span class="tok-comment"># change the reply, then: test, reload, and compare the pids</span>
nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload
cat /tmp/ng/logs/nginx.pid; ps -eo pid,args | grep '[n]ginx: worker' | awk '{print $1}' | xargs</code></pre>
<div class="out">$ ps -eo pid,ppid,user,args | grep '[n]ginx'
    493       1 root     nginx: master process nginx -c /tmp/ng/conf/nginx.conf
    494     493 nobody   nginx: worker process
    495     493 nobody   nginx: worker process
    496     493 nobody   nginx: worker process
    497     493 nobody   nginx: worker process
$ nproc
4
$ curl -s http://127.0.0.1:8080/
phien ban MOT
$ cat /tmp/ng/logs/nginx.pid; ps -eo pid,args | grep '[n]ginx: worker' | awk '{print $1}' | xargs
493
594 595 596 597
$ nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload
nginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok
nginx: configuration file /tmp/ng/conf/nginx.conf test is successful
2026/11/12 10:58:59 [notice] 628#628: signal process started
$ curl -s http://127.0.0.1:8080/
phien ban HAI
$ cat /tmp/ng/logs/nginx.pid; ps -eo pid,args | grep '[n]ginx: worker' | awk '{print $1}' | xargs
493
637 638 639 640</div>
<p>The master kept pid 493 across the reload; all four workers were replaced (594–597 became 637–640). Next, two traps — <code>worker_processes auto</code> inside a CPU-limited container, and a directory only root can enter:</p>
<div class="out">$ grep worker_processes /tmp/ng/conf/nginx.conf
worker_processes auto;
$ nginx -c /tmp/ng/conf/nginx.conf -s reload
2026/11/12 10:58:57 [notice] 532#532: signal process started
$ nproc; ps -eo args | grep -c '[n]ginx: worker'
4
10
$ grep -c ^processor /proc/cpuinfo
10
$ ls -ld /srv/riengtu; cat /srv/riengtu/a.txt
drwx------ 2 root root 4096 Nov 12 10:59 /srv/riengtu
bi mat
$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/rieng/a.txt
403
$ tail -n 1 /tmp/ng/logs/error.log
2026/11/12 10:59:01 [error] 639#639: *3 open() "/srv/riengtu/a.txt" failed (13: Permission denied), client: 127.0.0.1, server: , request: "GET /rieng/a.txt HTTP/1.1", host: "127.0.0.1:8080"
$ chmod 755 /srv/riengtu
$ curl -s http://127.0.0.1:8080/rieng/a.txt
bi mat</div>
<p><code>nproc</code> said 4, yet nginx 1.24 started 10 workers: <code>auto</code> counted every CPU of the host. In containers and on CPU-limited VMs, write the number. And the 403 came with <code>13: Permission denied</code> in error.log although root could read the file — the worker runs as <code>nobody</code>. Finally, log rotation and the pid file:</p>
<div class="out">$ mv /tmp/ng/logs/access.log /tmp/ng/logs/access.log.1
$ curl -s -o /dev/null http://127.0.0.1:8080/sau-khi-doi-ten
$ ls /tmp/ng/logs/; tail -n 1 /tmp/ng/logs/access.log.1
access.log.1
error.log
nginx.pid
127.0.0.1 - - [12/Nov/2026:10:59:01 +0000] "GET /sau-khi-doi-ten HTTP/1.1" 200 14 "-" "curl/8.5.0"
$ nginx -c /tmp/ng/conf/nginx.conf -s reopen
2026/11/12 10:59:01 [notice] 747#747: signal process started
$ curl -s -o /dev/null http://127.0.0.1:8080/sau-reopen
$ ls /tmp/ng/logs/; cat /tmp/ng/logs/access.log
access.log
access.log.1
error.log
nginx.pid
127.0.0.1 - - [12/Nov/2026:10:59:02 +0000] "GET /sau-reopen HTTP/1.1" 200 14 "-" "curl/8.5.0"
$ nginx -c /tmp/ng/conf/nginx.conf -s stop
2026/11/12 10:59:02 [notice] 780#780: signal process started
$ echo 99999 &gt; /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf -s reload
2026/11/12 10:59:02 [notice] 796#796: signal process started
2026/11/12 10:59:02 [alert] 796#796: kill(99999, 1) failed (3: No such process)
$ echo "" &gt; /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf -s reload
2026/11/12 10:59:03 [notice] 804#804: signal process started
2026/11/12 10:59:03 [error] 804#804: invalid PID number "" in "/tmp/ng/logs/nginx.pid"
$ rm /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf &amp;&amp; cat /tmp/ng/logs/nginx.pid
822</div>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-5-1-tien-trinh-la-gi" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 5.1 — What a process is</span><span class="lc-sub">Reading ps, pid and ppid — the tree you just saw</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-5-3-tin-hieu" target="_blank" rel="noopener"><span class="lc-ico">📶</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 5.3 — Signals</span><span class="lc-sub">What -s reload and -s reopen actually send to the master</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-4-1-mo-hinh-quyen" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 4.1 — The permission model, and rwx on a directory</span><span class="lc-sub">Why the worker needs x on every parent directory</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-10-3-log-journalctl" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 10.3 — Logs, journalctl and rotation</span><span class="lc-sub">logrotate, and why it ends with a signal</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>nginx -t</code></span><span class="v">Syntax check only — reports the file and line of the first problem, never touches the running server.</span></div>
  <div class="kv"><span class="k"><code>nginx -c</code></span><span class="v">Run with one config file of your own; no root and no systemd needed.</span></div>
  <div class="kv"><span class="k"><code>nginx -V</code></span><span class="v">Shows the compiled-in modules, which decide what directives exist in your build.</span></div>
  <div class="kv"><span class="k">Master process</span><span class="v">Runs as root — binds ports, opens logs, supervises workers; serves nothing itself.</span></div>
  <div class="kv"><span class="k">Worker process</span><span class="v">Unprivileged, one per CPU core; handles thousands of connections in a single thread.</span></div>
  <div class="kv"><span class="k"><code>nginx -s reload</code></span><span class="v">Replaces the workers with the new config without dropping a connection — not a restart.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>Install in one command; run your own config with <code>nginx -c</code> on port 8080 without root.</li><li>The master runs as root (binds ports, supervises); workers run unprivileged and handle every request — the split is the security.</li><li>Always <code>nginx -t</code> first; <code>nginx -t &amp;&amp; nginx -s reload</code> applies a change with zero dropped connections.</li><li>reload is not restart — restart kills the master and drops everything; keep it for binary upgrades.</li><li><code>nginx -V</code> lists compiled modules; <code>nginx -T</code> prints the whole effective config with includes expanded.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/control.html" target="_blank" rel="noopener"><span class="lc-ico">🎛️</span><span class="lc-body"><span class="lc-title">nginx — controlling nginx</span><span class="lc-sub">nginx.org · Every signal, and exactly what each one does to master and workers</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/ngx_core_module.html" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">nginx — core module</span><span class="lc-sub">nginx.org · worker_processes, worker_connections, user and pid</span></span></a>
<a class="link-card" href="https://nginx.org/en/linux_packages.html" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">nginx — official Linux packages</span><span class="lc-sub">nginx.org · How to get a current version instead of your distribution's old one</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">Processes, signals, file permissions and the execute bit on directories</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Start nginx from a file in /tmp, reload it under load, and watch the worker pids change</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cài, chạy, và đọc cây tiến trình</h2>
<p class="lead">Nginx cài bằng một câu lệnh và khởi động bằng một câu nữa, nên rất dễ bị cám dỗ nhảy thẳng vào phần cấu hình. Năm phút bỏ ra để hiểu CÁI VỪA KHỞI ĐỘNG thì tự nó trả lại ngay lập tức, vì mô hình tiến trình giải thích luôn cả việc tách đặc quyền, hành vi nạp lại, và một nửa số thông báo lỗi mà bạn sẽ từng thấy từ nó.</p>

<h3>Hai phút để có một cái đang chạy</h3>
<pre><code class="language-bash"><span class="tok-comment"># Ubuntu / Debian</span>
sudo apt-get update &amp;&amp; sudo apt-get install -y nginx
nginx -v                       <span class="tok-comment"># nginx version: nginx/1.24.0 (Ubuntu)</span>
nginx -V 2&gt;&amp;1 | tr ' ' '\\\\n' | grep '^--with'   <span class="tok-comment"># các module đã biên dịch vào</span>

<span class="tok-comment"># Docker — không đụng gì tới máy chủ</span>
docker run --rm -p 8080:80 -v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:1.27-alpine

<span class="tok-comment"># Chạy với MỘT tệp cấu hình của riêng bạn, không cần quyền root, không cần systemd</span>
nginx -c /tmp/ng/conf/nginx.conf         <span class="tok-comment"># khởi động</span>
nginx -c /tmp/ng/conf/nginx.conf -t      <span class="tok-comment"># CHỈ kiểm cú pháp, không khởi động</span>
nginx -c /tmp/ng/conf/nginx.conf -s stop <span class="tok-comment"># dừng</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">LUÔN chạy -t trước mọi thứ khác</span><span class="v"><code>nginx -t</code> phân tích toàn bộ cấu hình rồi báo TỆP và DÒNG của vấn đề đầu tiên. Nó chẳng tốn gì, nó chạy mà không đụng tới máy chủ đang chạy, và nó là THÓI QUEN DUY NHẤT ngăn được phần lớn các cú gián đoạn do Nginx.</span></div>
  <div class="kv"><span class="k">-c cho bạn thí nghiệm mà không cần máy chủ nào</span><span class="v">Trỏ nó vào một tệp trong <code>/tmp</code>, nghe ở cổng 8080, thế là bạn có một Nginx ĐẦY ĐỦ để học, không cần root, không cần systemd và chẳng có gì để làm hỏng. Mọi phép đo trong khoá học này được sinh ra đúng theo cách đó.</span></div>
  <div class="kv"><span class="k">nginx -V cho biết bạn THẬT SỰ đang có cái gì</span><span class="v">Module được BIÊN DỊCH VÀO chứ không nạp lúc chạy, nên bản dựng quyết định directive nào tồn tại. Nếu một directive trong tài liệu bị từ chối vì "không biết" thì đây là chỗ đầu tiên nên nhìn — bản Ubuntu ở trên có ba mươi hai cờ <code>--with</code>, còn các bản dựng khác thì có bộ khác.</span></div>
  <div class="kv"><span class="k">Phiên bản quan trọng hơn so với phần lớn phần mềm khác</span><span class="v">Directive được thêm vào và giá trị mặc định đổi đi giữa các bản phát hành, còn các bản phân phối thì ship phiên bản cũ suốt nhiều năm. Khi một cấu hình chép từ blog không chạy, hãy kiểm xem nó viết cho phiên bản nào TRƯỚC khi cho rằng bạn gõ sai.</span></div>
</div>

<h3>Bạn vừa khởi động cái gì</h3>
<div class="out">$ ps -eo pid,ppid,user,args | grep '[n]ginx'
32209     1 root     nginx: master process nginx -c /tmp/ng/conf/nginx.conf
32210 32209 nobody   nginx: worker process
32211 32209 nobody   nginx: worker process
32213 32209 nobody   nginx: worker process
32214 32209 nobody   nginx: worker process

$ nproc
4</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Master</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy bằng root, KHÔNG phục vụ gì cả</span><span class="lz-nsub">Đọc cấu hình, chiếm các cổng dưới 1024, mở tệp log, sinh ra và trông coi đám worker</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Worker</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy KHÔNG đặc quyền, xử lý MỌI request</span><span class="lz-nsub">Mặc định một cái cho mỗi nhân CPU · mỗi cái tung hứng hàng nghìn kết nối trong MỘT luồng</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cái tách đó CHÍNH LÀ phần bảo mật</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một con lỗi khi xử lý request thì KHÔNG phải root</span><span class="lz-nsub">Tiến trình đối mặt Internet không đọc nổi những tệp mà người dùng worker không đọc được</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">worker_processes auto</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bốn nhân, bốn worker</span><span class="lz-nsub">Nhiều hơn một cái mỗi nhân thì chẳng mua được gì — chúng sẽ giành nhau cùng những CPU đó. Trong container hãy ghi SỐ cụ thể: nginx 1.24 đếm CPU của máy chủ (đo bên dưới: 10 worker trong khi nproc nói 4)</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Bẫy — "Permission denied" ở Nginx gần như luôn là chuyện WORKER, không phải chuyện master.</strong> Master chạy bằng root nên nó mở được cổng 80 và đọc được mọi thứ; còn worker thì chạy bằng <code>www-data</code> hoặc <code>nobody</code> và mới là cái đi đọc tệp của bạn. Nên một thư mục mà chỉ chủ sở hữu đọc được sẽ cho ra <code>13: Permission denied</code> trong error log dù bạn <code>cat</code> tệp đó bằng root vẫn thấy. Và nó không chỉ là quyền của bản thân tệp: worker cần quyền THỰC THI trên MỌI thư mục cha trên đường dẫn — một chỗ hay hỏng khi <code>root</code> trỏ vào một thư mục nằm dưới <code>/home/ai-do</code>.</p>
</div>

<h3>Nạp lại: cái tính chất làm cho nó VẬN HÀNH ĐƯỢC</h3>
<div class="out"># Truoc khi nap lai
$ curl -s http://127.0.0.1:8080/
phien ban MOT
master pid = 32209 ; mot worker cu = 32210

# Doi cau hinh, roi:  nginx -s reload
$ curl -s http://127.0.0.1:8080/
phien ban HAI
master pid van la = 32209        &lt;- KHONG doi
worker moi: 32227 32228 32229 32230   &lt;- da thay HET

# Cau hinh moi da hieu luc, master khong khoi dong lai, va nhung ket noi
# dang do van duoc worker CU phuc vu cho xong roi worker do moi thoat.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">reload THẬT RA làm gì</span><span class="lz-t">Bốn bước, theo thứ tự</span><span class="lz-d">Master đọc lại cấu hình, kiểm chứng nó, khởi động các worker MỚI với nó, rồi bảo các worker CŨ ngừng nhận kết nối mới và thoát khi phục vụ xong những cái đang có. Một cấu hình hỏng sẽ dừng ở bước hai và chẳng có gì thay đổi cả.</span></div>
  <div class="lz-step"><span class="lz-k">KHÔNG rớt một kết nối nào</span><span class="lz-t">Không phải "rất ít" — mà là KHÔNG</span><span class="lz-d">Các request đang bay được chính cái worker khởi đầu chúng phục vụ cho xong. Đó là lý do việc đổi cấu hình Nginx an toàn ngay giữa lúc có lưu lượng, và đó là một tính chất thật sự bất thường trong đám máy chủ.</span></div>
  <div class="lz-step"><span class="lz-k">reload KHÔNG phải restart</span><span class="lz-t">Và bạn gần như không bao giờ muốn restart</span><span class="lz-d"><code>systemctl restart</code> giết master, đóng các socket đang nghe và làm rớt hết. Hãy dùng <code>reload</code> cho việc đổi cấu hình; để dành <code>restart</code> cho việc nâng cấp phần nhị phân hoặc đổi <code>worker_processes</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểm trước, luôn luôn</span><span class="lz-t">nginx -t &amp;&amp; nginx -s reload</span><span class="lz-d">Một dòng, nối bằng <code>&amp;&amp;</code>, để một lỗi cú pháp không bao giờ chạm tới lệnh nạp lại. Hãy đặt nó vào script deploy và vào phản xạ cơ bắp của bạn.</span></div>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tệp log do MASTER giữ mở</span><span class="lz-lnote">Xoay log bằng cách ĐỔI TÊN tệp sẽ để Nginx tiếp tục ghi vào cái inode đã đổi tên, cho tới khi bạn gửi cho nó <code>-s reopen</code>. Đó là lý do cấu hình logrotate cho Nginx của MỌI bản phân phối đều kết thúc bằng đúng cái tín hiệu ấy — và là lý do một kiểu xoay log tự chế sẽ âm thầm ngừng sinh ra log.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tệp pid là cách các tín hiệu TÌM RA master</span><span class="lz-lnote"><code>nginx -s reload</code> đọc <code>pid</code> từ cấu hình, mở tệp đó rồi gửi tín hiệu tới cái nó khai. Một tệp pid cũ còn sót sau một lần tắt bẩn sẽ cho ra "invalid PID number" — hãy xoá nó rồi khởi động bình thường.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mỗi worker MỘT luồng, và điều đó rất quan trọng</span><span class="lz-lnote">Mỗi worker xử lý hàng nghìn kết nối trong MỘT luồng bằng một event loop, và đó là lý do không thứ gì trong cấu hình Nginx được phép CHẶN. Đọc một tệp từ một cái đĩa chậm có thể làm đứng cả một worker — chính là lý do <code>aio</code> và các pool luồng tồn tại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Worker thì RẺ và có thể vứt đi</span><span class="lz-lnote">Ba megabyte mỗi cái trong phép đo ở Bài 0.1, và master khởi động lại một cái ngay tức khắc nếu nó sập. Một worker gặp lỗi segfault chỉ làm rớt những kết nối nó đang phục vụ chứ không rớt gì khác, và đó là nửa còn lại của việc tách đặc quyền ở trên.</span></div>
</div>
<div class="note-ct">
<p><strong>Ba câu lệnh đáng thuộc lòng ngay bây giờ.</strong> <code>nginx -t</code> trước MỌI thay đổi, <code>nginx -t &amp;&amp; nginx -s reload</code> để áp dụng một thay đổi, và <code>nginx -T</code> — chữ T HOA — để in ra TOÀN BỘ cấu hình hiệu lực với mọi lệnh <code>include</code> đã được bung ra. Cái cuối cùng chính là câu trả lời cho "cái thiết lập này thật ra tới từ tệp nào", mà trên một máy chủ thật với cả chục tệp dưới <code>sites-enabled</code> thì đó là câu bạn sẽ hỏi liên tục, và đây là cách duy nhất trả lời được đáng tin.</p>
</div>

<h3>🔬 Tự chạy lại: cây tiến trình, reload, và ba kiểu hỏng</h3>
<p>Mọi output dưới đây là lần chạy thật trên nginx/1.24.0 (Ubuntu 24.04) trong một container giới hạn 4 CPU, với cấu hình này:</p>
<pre><code class="language-bash">worker_processes 4;
pid       /tmp/ng/logs/nginx.pid;
error_log /tmp/ng/logs/error.log;
events { worker_connections 1024; }
http {
  access_log /tmp/ng/logs/access.log;
  server {
    listen 8080;
    location / { return 200 "phien ban MOT\\n"; }
    location /rieng/ { alias /srv/riengtu/; }
  }
}</code></pre>
<pre><code class="language-bash">nginx -c /tmp/ng/conf/nginx.conf
ps -eo pid,ppid,user,args | grep '[n]ginx' <span class="tok-comment">  # master (root) + các worker (nobody)</span>
<span class="tok-comment"># đổi câu trả lời, rồi: kiểm, reload, và so số tiến trình</span>
nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload
cat /tmp/ng/logs/nginx.pid; ps -eo pid,args | grep '[n]ginx: worker' | awk '{print $1}' | xargs</code></pre>
<div class="out">$ ps -eo pid,ppid,user,args | grep '[n]ginx'
    493       1 root     nginx: master process nginx -c /tmp/ng/conf/nginx.conf
    494     493 nobody   nginx: worker process
    495     493 nobody   nginx: worker process
    496     493 nobody   nginx: worker process
    497     493 nobody   nginx: worker process
$ nproc
4
$ curl -s http://127.0.0.1:8080/
phien ban MOT
$ cat /tmp/ng/logs/nginx.pid; ps -eo pid,args | grep '[n]ginx: worker' | awk '{print $1}' | xargs
493
594 595 596 597
$ nginx -c /tmp/ng/conf/nginx.conf -t &amp;&amp; nginx -c /tmp/ng/conf/nginx.conf -s reload
nginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok
nginx: configuration file /tmp/ng/conf/nginx.conf test is successful
2026/11/12 10:58:59 [notice] 628#628: signal process started
$ curl -s http://127.0.0.1:8080/
phien ban HAI
$ cat /tmp/ng/logs/nginx.pid; ps -eo pid,args | grep '[n]ginx: worker' | awk '{print $1}' | xargs
493
637 638 639 640</div>
<p>Master giữ nguyên pid 493 qua lần reload; cả bốn worker được thay (594–597 thành 637–640). Tiếp theo là hai cái bẫy — <code>worker_processes auto</code> trong container bị giới hạn CPU, và một thư mục chỉ root vào được:</p>
<div class="out">$ grep worker_processes /tmp/ng/conf/nginx.conf
worker_processes auto;
$ nginx -c /tmp/ng/conf/nginx.conf -s reload
2026/11/12 10:58:57 [notice] 532#532: signal process started
$ nproc; ps -eo args | grep -c '[n]ginx: worker'
4
10
$ grep -c ^processor /proc/cpuinfo
10
$ ls -ld /srv/riengtu; cat /srv/riengtu/a.txt
drwx------ 2 root root 4096 Nov 12 10:59 /srv/riengtu
bi mat
$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/rieng/a.txt
403
$ tail -n 1 /tmp/ng/logs/error.log
2026/11/12 10:59:01 [error] 639#639: *3 open() "/srv/riengtu/a.txt" failed (13: Permission denied), client: 127.0.0.1, server: , request: "GET /rieng/a.txt HTTP/1.1", host: "127.0.0.1:8080"
$ chmod 755 /srv/riengtu
$ curl -s http://127.0.0.1:8080/rieng/a.txt
bi mat</div>
<p><code>nproc</code> nói 4, vậy mà nginx 1.24 khởi động 10 worker: <code>auto</code> đếm mọi CPU của máy chủ chứa container. Trong container và máy ảo bị giới hạn CPU, hãy ghi con số. Còn lỗi 403 đi kèm <code>13: Permission denied</code> trong error.log dù root đọc được tệp — vì worker chạy bằng <code>nobody</code>. Cuối cùng là xoay log và tệp pid:</p>
<div class="out">$ mv /tmp/ng/logs/access.log /tmp/ng/logs/access.log.1
$ curl -s -o /dev/null http://127.0.0.1:8080/sau-khi-doi-ten
$ ls /tmp/ng/logs/; tail -n 1 /tmp/ng/logs/access.log.1
access.log.1
error.log
nginx.pid
127.0.0.1 - - [12/Nov/2026:10:59:01 +0000] "GET /sau-khi-doi-ten HTTP/1.1" 200 14 "-" "curl/8.5.0"
$ nginx -c /tmp/ng/conf/nginx.conf -s reopen
2026/11/12 10:59:01 [notice] 747#747: signal process started
$ curl -s -o /dev/null http://127.0.0.1:8080/sau-reopen
$ ls /tmp/ng/logs/; cat /tmp/ng/logs/access.log
access.log
access.log.1
error.log
nginx.pid
127.0.0.1 - - [12/Nov/2026:10:59:02 +0000] "GET /sau-reopen HTTP/1.1" 200 14 "-" "curl/8.5.0"
$ nginx -c /tmp/ng/conf/nginx.conf -s stop
2026/11/12 10:59:02 [notice] 780#780: signal process started
$ echo 99999 &gt; /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf -s reload
2026/11/12 10:59:02 [notice] 796#796: signal process started
2026/11/12 10:59:02 [alert] 796#796: kill(99999, 1) failed (3: No such process)
$ echo "" &gt; /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf -s reload
2026/11/12 10:59:03 [notice] 804#804: signal process started
2026/11/12 10:59:03 [error] 804#804: invalid PID number "" in "/tmp/ng/logs/nginx.pid"
$ rm /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf &amp;&amp; cat /tmp/ng/logs/nginx.pid
822</div>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-5-1-tien-trinh-la-gi" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 5.1 — Tiến trình là gì</span><span class="lc-sub">Đọc ps, pid và ppid — đúng cái cây bạn vừa thấy</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-5-3-tin-hieu" target="_blank" rel="noopener"><span class="lc-ico">📶</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 5.3 — Tín hiệu</span><span class="lc-sub">-s reload và -s reopen thật ra gửi gì cho master</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-4-1-mo-hinh-quyen" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 4.1 — Mô hình quyền, và rwx trên thư mục</span><span class="lc-sub">Vì sao worker cần quyền x trên mọi thư mục cha</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-10-3-log-journalctl" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash · 10.3 — Log, journalctl và xoay vòng</span><span class="lc-sub">logrotate, và vì sao nó kết thúc bằng một tín hiệu</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>nginx -t</code></span><span class="v">Chỉ kiểm cú pháp — báo tệp và dòng của vấn đề đầu tiên, không đụng máy chủ đang chạy.</span></div>
  <div class="kv"><span class="k"><code>nginx -c</code></span><span class="v">Chạy với một tệp cấu hình của riêng bạn; không cần root, không cần systemd.</span></div>
  <div class="kv"><span class="k"><code>nginx -V</code></span><span class="v">Hiện các module đã biên dịch vào, thứ quyết định directive nào tồn tại trong bản dựng.</span></div>
  <div class="kv"><span class="k">Master process</span><span class="v">Chạy bằng root — chiếm cổng, mở log, trông coi worker; tự nó không phục vụ gì.</span></div>
  <div class="kv"><span class="k">Worker process</span><span class="v">Không đặc quyền, mỗi nhân CPU một cái; xử lý hàng nghìn kết nối trong MỘT luồng.</span></div>
  <div class="kv"><span class="k"><code>nginx -s reload</code></span><span class="v">Thay worker bằng cấu hình mới mà không rớt một kết nối nào — không phải restart.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cài bằng một câu lệnh; chạy cấu hình của riêng bạn bằng <code>nginx -c</code> ở cổng 8080, không cần root.</li><li>Master chạy bằng root (chiếm cổng, trông coi); worker chạy không đặc quyền và xử lý mọi request — cái tách đó chính là phần bảo mật.</li><li>Luôn <code>nginx -t</code> trước; <code>nginx -t &amp;&amp; nginx -s reload</code> áp một thay đổi mà không rớt kết nối nào.</li><li>reload không phải restart — restart giết master và rớt sạch; để dành nó cho nâng cấp phần nhị phân.</li><li><code>nginx -V</code> liệt kê module đã biên dịch; <code>nginx -T</code> in toàn bộ cấu hình hiệu lực với include đã bung.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/control.html" target="_blank" rel="noopener"><span class="lc-ico">🎛️</span><span class="lc-body"><span class="lc-title">nginx — điều khiển nginx</span><span class="lc-sub">nginx.org · Từng tín hiệu, và chính xác nó làm gì với master và worker</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/ngx_core_module.html" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">nginx — module core</span><span class="lc-sub">nginx.org · worker_processes, worker_connections, user và pid</span></span></a>
<a class="link-card" href="https://nginx.org/en/linux_packages.html" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">nginx — gói Linux chính thức</span><span class="lc-sub">nginx.org · Cách lấy phiên bản hiện hành thay vì bản cũ của bản phân phối</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">Tiến trình, tín hiệu, quyền tệp và cái bit thực thi trên thư mục</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Khởi động nginx từ một tệp trong /tmp, nạp lại giữa lúc có tải, và nhìn số hiệu worker đổi đi</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — The smallest config that works, and how Nginx reads it|||0.3 — Tệp cấu hình nhỏ nhất chạy được, và cách Nginx đọc nó',
      slug: 'nginx-0-3-cau-hinh-dau-tien',
      type: 'LESSON',
      description: 'Mười dòng cấu hình, mỗi dòng một lý do. Rồi tới cái luật giải thích ba phần tư số lần "tôi đặt rồi mà nó không có tác dụng": directive được THỪA HƯỞNG xuống dưới, và đặt lại ở tầng dưới thì GHI ĐÈ chứ không cộng dồn — đo thật bằng ba lời gọi curl.',
      content: `
${G00_3}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The smallest config that works, and how Nginx reads it</h2>
<p class="lead">Nginx configuration is not a program — it is a tree of nested contexts with an inheritance rule, and once that rule is clear most of the language stops being surprising. This lesson is ten lines that run, then the one rule that explains why a setting you definitely wrote is definitely not applying.</p>

<h3>Ten lines, each with a reason</h3>
<pre><code class="language-bash">worker_processes  1;                       <span class="tok-comment"># how many worker processes — Lesson 0.2</span>
error_log         /tmp/ng/logs/error.log warn;  <span class="tok-comment"># the ERROR log: the first place to look</span>
pid               /tmp/ng/logs/nginx.pid;  <span class="tok-comment"># where signals find the master</span>

events {                                   <span class="tok-comment"># ← the events context, mandatory</span>
  worker_connections 1024;                 <span class="tok-comment"># connection cap PER worker</span>
}

http {                                     <span class="tok-comment"># ← everything HTTP lives in here</span>
  access_log /tmp/ng/logs/access.log;      <span class="tok-comment"># the ACCESS log: an entirely different thing from error_log</span>

  server {                                 <span class="tok-comment"># ← one "site", one port, one domain</span>
    listen      8080;
    server_name _;                         <span class="tok-comment"># "_" = matches any Host — Lesson 1.2</span>

    location / {                           <span class="tok-comment"># ← a group of URLs</span>
      return 200 "xin chao\\\\n";
    }
  }
}</code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">main</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Outermost, no braces</span><span class="lz-nsub">worker_processes · user · pid · error_log · everything about the process as a whole</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">events</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">How connections are accepted</span><span class="lz-nsub">Required, even when empty · worker_connections and the polling mechanism</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">http → server → location</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Three nested levels</span><span class="lz-nsub">All of HTTP · one site · one group of URLs · almost all the work happens here</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">stream</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The sibling of http, for TCP/UDP</span><span class="lz-nsub">Layer-four proxying — same ideas, different directives · outside this course</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Every directive belongs to specific contexts</span><span class="v">The documentation for each one lists them: <em>Context: http, server, location</em>. Putting a directive somewhere it is not allowed is a startup error naming the line, which is why <code>nginx -t</code> catches almost all of this before it matters.</span></div>
  <div class="kv"><span class="k">Semicolons end simple directives, braces open blocks</span><span class="v">A missing semicolon usually reports the <em>next</em> line as the error, which is the single most confusing message Nginx produces. When a line looks fine, check the one above it.</span></div>
  <div class="kv"><span class="k">error_log and access_log are different things</span><span class="v"><code>error_log</code> records the server's own problems — permission denied, upstream unreachable, config warnings. <code>access_log</code> records one line per request. Diagnosing with the wrong one is Chapter 11's most common wasted hour.</span></div>
  <div class="kv"><span class="k">The distribution config is bigger, not different</span><span class="v"><code>/etc/nginx/nginx.conf</code> ends with <code>include /etc/nginx/conf.d/*.conf;</code> and <code>include /etc/nginx/sites-enabled/*;</code> — the same tree, split across files. <code>nginx -T</code> prints it back as one document.</span></div>
</div>

<h3>The inheritance rule, measured</h3>
<pre><code class="language-bash">http {
  add_header X-Tang "http" always;          <span class="tok-comment"># set at the HTTP level</span>

  server {
    listen 8080;
    location /thua-huong { return 200 "…"; }       <span class="tok-comment"># sets nothing</span>
    location /ghi-de {
      add_header X-Tang "location" always;         <span class="tok-comment"># set AGAIN here</span>
      return 200 "…";
    }
  }
  server {
    listen 8081;
    add_header X-Tang "server" always;             <span class="tok-comment"># reset at the SERVER level</span>
    location / { return 200 "…"; }
  }
}</code></pre>
<div class="out">8080/thua-huong        -&gt; X-Tang: http
8080/ghi-de            -&gt; X-Tang: location
8081/                  -&gt; X-Tang: server

# Dong 1: khong dat gi o location NEN thua huong tu http.
# Dong 2: dat lai o location NEN cai o http BIEN MAT — khong phai hai header,
#         ma la MOT. Do la luat quan trong nhat trong ca bai nay.</div>
<div class="pitfall">
<p><strong>Trap — array-type directives are inherited by REPLACEMENT, not by addition.</strong> This is how a security header disappears. You set four <code>add_header</code> directives at <code>http</code>, everything works, and six months later somebody adds ONE <code>add_header</code> to one <code>location</code> — and in that location, the other four vanish completely. No warning, no error, and <code>nginx -t</code> is perfectly happy. The same rule applies to <code>proxy_set_header</code>: declaring one at a lower level discards every one from above, which is exactly why Chapter 3 has you put the six proxy headers in one file and <code>include</code> it everywhere they are needed.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Inheritance goes DOWN, never sideways</span><span class="lz-lnote">A directive at <code>http</code> applies to every <code>server</code> and every <code>location</code> below it. A directive in one <code>server</code> does not apply to another <code>server</code>. That is why shared settings belong at the <code>http</code> level, or in a file you <code>include</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Scalar directives are simple</span><span class="lz-lnote"><code>root</code>, <code>client_max_body_size</code>, <code>proxy_read_timeout</code> — the nearest one wins, exactly as you would expect. Only the array-valued ones surprise people, and those are mostly <code>add_header</code> and <code>proxy_set_header</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">include is textual, not a scope</span><span class="lz-lnote">An included file is pasted in verbatim at that point and inherits the context where it lands. So the same file can be included into <code>http</code> or into a <code>location</code>, and it will mean different things.</span></div>
  <div class="lz-layer"><span class="lz-lname">When in doubt, use nginx -T</span><span class="lz-lnote">It prints the effective configuration with every include expanded. Reading that and walking the tree from the outside in is the definitive answer to "does this apply here", and it is faster than any amount of reasoning.</span></div>
</div>
<div class="note-ct">
<p><strong>How to read a configuration you have never seen.</strong> Three questions, in order. How many <code>server</code> blocks are there, and what port and <code>server_name</code> does each one have? Inside the block you care about, which <code>location</code> blocks exist and what type is each (Chapter 2 explains that part)? And finally: which directives are declared at the <code>http</code> level that some <code>location</code> is quietly overriding? Those three, answered against the output of <code>nginx -T</code>, reconstruct the intent of a configuration you have never seen — far faster than reading it sequentially from line one.</p>
</div>

<h3>🔬 Run it yourself: four security headers, and the one line that removes them</h3>
<p>The inheritance trap above, as a file you can run (nginx/1.24.0):</p>
<pre><code class="language-bash">pid       /tmp/ng/logs/bon.pid;
error_log /tmp/ng/logs/error.log warn;
events {}
http {
  access_log off;
  add_header X-Frame-Options        "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy        "no-referrer" always;
  add_header Strict-Transport-Security "max-age=31536000" always;
  server {
    listen 8083;
    location /trang  { return 200 "ok\\n"; }
    location /tai-ve {
      add_header Content-Disposition "attachment" always;
      return 200 "ok\\n";
    }
  }
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:8083/trang  | grep -iE '^(x-|referrer|strict|content-disp)'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000
$ curl -sI http://127.0.0.1:8083/tai-ve | grep -iE '^(x-|referrer|strict|content-disp)'
Content-Disposition: attachment</div>
<p><code>/trang</code> gets all four headers; <code>/tai-ve</code> added ONE <code>add_header</code> and lost the other four — with no warning, and <code>nginx -t</code> reporting success. Next, three real syntax mistakes and exactly what <code>nginx -t</code> says:</p>
<pre><code class="language-bash"><span class="tok-comment"># three files, three mistakes — nginx -t names the file and the line</span>
nginx -t -c /tmp/ng/conf/sai1.conf <span class="tok-comment">  # "listen 8084" without ;</span>
nginx -t -c /tmp/ng/conf/sai2.conf <span class="tok-comment">  # worker_connections inside server</span>
nginx -t -c /tmp/ng/conf/sai3.conf <span class="tok-comment">  # no events block at all</span></code></pre>
<div class="out">$ nginx -t -c /tmp/ng/conf/sai1.conf
2026/11/12 10:59:40 [emerg] 1200#1200: directive "listen" is not terminated by ";" in /tmp/ng/conf/sai1.conf:5
nginx: configuration file /tmp/ng/conf/sai1.conf test failed
$ nginx -t -c /tmp/ng/conf/sai2.conf
2026/11/12 10:59:40 [emerg] 1208#1208: "worker_connections" directive is not allowed here in /tmp/ng/conf/sai2.conf:5
nginx: configuration file /tmp/ng/conf/sai2.conf test failed
$ nginx -t -c /tmp/ng/conf/sai3.conf
nginx: the configuration file /tmp/ng/conf/sai3.conf syntax is ok
2026/11/12 10:59:40 [emerg] 1216#1216: no "events" section in configuration
nginx: configuration file /tmp/ng/conf/sai3.conf test failed</div>
<p>The missing semicolon after <code>listen</code> (line 4) is reported on line 5 — the line where Nginx noticed. And <code>nginx -T</code> prints included files inline, each labelled with its path:</p>
<div class="out">$ nginx -T -c /tmp/ng/conf/goc.conf 2&gt;/dev/null
# configuration file /tmp/ng/conf/goc.conf:
events {}
http {
  include /tmp/ng/conf/conf.d/*.conf;
}

# configuration file /tmp/ng/conf/conf.d/api.conf:
server {
  listen 8085;
  location / { return 200 "api\\n"; }
}</div>
<h3>🔗 Related lessons in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 7.4 — Headers that change behaviour</span><span class="lc-sub">What X-Frame-Options, nosniff and HSTS actually protect</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-1-header-csp-cors" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">Node.js · 9.1 — The boundary: security headers, CSP and CORS</span><span class="lc-sub">The same headers set from the app side — and why setting them once at the edge is simpler</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Context</span><span class="v">A nested scope: main, <code>events</code>, <code>http</code>, <code>server</code>, <code>location</code>.</span></div>
  <div class="kv"><span class="k"><code>events</code> block</span><span class="v">Mandatory; holds <code>worker_connections</code> and the connection-polling mechanism.</span></div>
  <div class="kv"><span class="k">http → server → location</span><span class="v">The three nested levels where almost all the work happens.</span></div>
  <div class="kv"><span class="k">Inheritance</span><span class="v">A directive applies downward to nested blocks, never sideways to siblings.</span></div>
  <div class="kv"><span class="k">Array-valued directive</span><span class="v"><code>add_header</code> / <code>proxy_set_header</code> — inherited by REPLACEMENT, not addition.</span></div>
  <div class="kv"><span class="k"><code>error_log</code> vs <code>access_log</code></span><span class="v">The server's own problems versus one line per request — different files.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>A config is a tree of contexts (main, events, http, server, location), not a program.</li><li>Directives inherit downward; for scalar ones the nearest declaration wins.</li><li>Array directives like <code>add_header</code> and <code>proxy_set_header</code> are REPLACED at a lower level, not merged — the cause of most "I set it and it does nothing".</li><li><code>error_log</code> and <code>access_log</code> are different files; diagnose with the right one.</li><li><code>include</code> is a textual paste that inherits its landing context; <code>nginx -T</code> prints the expanded tree.</li></ul>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html#conf_structure" target="_blank" rel="noopener"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">nginx — configuration file structure</span><span class="lc-sub">nginx.org · Contexts, directives and the syntax rules in one short page</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">nginx — add_header</span><span class="lc-sub">nginx.org · The inheritance paragraph that explains the measurement above</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/dirindex.html" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — alphabetical directive index</span><span class="lc-sub">nginx.org · Every directive with the contexts it is allowed in</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">Reading a large config with grep and less, and where log files live</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Set four headers at http, add one at a location, and watch three of them vanish</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Tệp cấu hình nhỏ nhất chạy được, và cách Nginx đọc nó</h2>
<p class="lead">Cấu hình Nginx KHÔNG phải một chương trình — nó là một CÂY các ngữ cảnh lồng nhau kèm một luật thừa hưởng, và một khi cái luật ấy rõ ràng thì phần lớn ngôn ngữ này thôi gây bất ngờ. Bài này là mười dòng chạy được, rồi tới đúng MỘT cái luật giải thích vì sao một thiết lập mà bạn CHẮC CHẮN đã viết lại CHẮC CHẮN không có tác dụng.</p>

<h3>Mười dòng, mỗi dòng một lý do</h3>
<pre><code class="language-bash">worker_processes  1;                       <span class="tok-comment"># bao nhiêu tiến trình thợ — Bài 0.2</span>
error_log         /tmp/ng/logs/error.log warn;  <span class="tok-comment"># log LỖI: chỗ đầu tiên phải nhìn</span>
pid               /tmp/ng/logs/nginx.pid;  <span class="tok-comment"># nơi tín hiệu tìm ra master</span>

events {                                   <span class="tok-comment"># ← ngữ cảnh events, bắt buộc phải có</span>
  worker_connections 1024;                 <span class="tok-comment"># trần kết nối cho MỖI worker</span>
}

http {                                     <span class="tok-comment"># ← mọi thứ về HTTP nằm trong đây</span>
  access_log /tmp/ng/logs/access.log;      <span class="tok-comment"># log TRUY CẬP: khác hẳn error_log</span>

  server {                                 <span class="tok-comment"># ← một "trang", một cổng, một tên miền</span>
    listen      8080;
    server_name _;                         <span class="tok-comment"># "_" = khớp mọi Host — Bài 1.2</span>

    location / {                           <span class="tok-comment"># ← một nhóm URL</span>
      return 200 "xin chao\\\\n";
    }
  }
}</code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">main</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ngoài cùng, không có dấu ngoặc</span><span class="lz-nsub">worker_processes · user · pid · error_log · các thứ về toàn tiến trình</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">events</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cách nhận kết nối</span><span class="lz-nsub">Bắt buộc phải có, kể cả khi rỗng · worker_connections và cơ chế poll</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">http → server → location</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ba tầng lồng nhau</span><span class="lz-nsub">Toàn bộ web · một trang · một nhóm URL · phần lớn công việc nằm ở đây</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">stream</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Anh em của http, cho TCP/UDP</span><span class="lz-nsub">Proxy tầng bốn — cùng ý tưởng, khác bộ directive · nằm ngoài phạm vi khoá này</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mỗi directive thuộc về những NGỮ CẢNH cụ thể</span><span class="v">Tài liệu của từng cái đều liệt kê ra: <em>Context: http, server, location</em>. Đặt một directive vào chỗ nó không được phép là một lỗi lúc khởi động có nêu rõ SỐ DÒNG, và đó là lý do <code>nginx -t</code> bắt được gần hết chuyện này trước khi nó kịp gây hại.</span></div>
  <div class="kv"><span class="k">Dấu chấm phẩy kết thúc directive đơn, dấu ngoặc nhọn mở một khối</span><span class="v">Thiếu một dấu chấm phẩy thì thường bị báo lỗi ở dòng <em>KẾ TIẾP</em>, và đó là thông báo gây bối rối nhất mà Nginx sinh ra. Khi một dòng nhìn có vẻ ổn, hãy kiểm cái dòng NGAY TRÊN nó.</span></div>
  <div class="kv"><span class="k">error_log và access_log là hai thứ KHÁC NHAU</span><span class="v"><code>error_log</code> ghi lại các vấn đề của chính máy chủ — không đủ quyền, không với tới được upstream, cảnh báo cấu hình. <code>access_log</code> ghi mỗi request một dòng. Chẩn đoán bằng NHẦM cái là giờ đồng hồ bị phí phổ biến nhất ở Chương 11.</span></div>
  <div class="kv"><span class="k">Cấu hình của bản phân phối thì TO hơn, không phải KHÁC</span><span class="v"><code>/etc/nginx/nginx.conf</code> kết thúc bằng <code>include /etc/nginx/conf.d/*.conf;</code> và <code>include /etc/nginx/sites-enabled/*;</code> — vẫn cái cây đó, chỉ là chia ra nhiều tệp. <code>nginx -T</code> in nó lại thành MỘT tài liệu.</span></div>
</div>

<h3>Luật thừa hưởng, đo thật</h3>
<pre><code class="language-bash">http {
  add_header X-Tang "http" always;          <span class="tok-comment"># đặt ở TẦNG HTTP</span>

  server {
    listen 8080;
    location /thua-huong { return 200 "…"; }       <span class="tok-comment"># không đặt gì</span>
    location /ghi-de {
      add_header X-Tang "location" always;         <span class="tok-comment"># đặt LẠI ở đây</span>
      return 200 "…";
    }
  }
  server {
    listen 8081;
    add_header X-Tang "server" always;             <span class="tok-comment"># đặt lại ở tầng SERVER</span>
    location / { return 200 "…"; }
  }
}</code></pre>
<div class="out">8080/thua-huong        -&gt; X-Tang: http
8080/ghi-de            -&gt; X-Tang: location
8081/                  -&gt; X-Tang: server

# Dong 1: khong dat gi o location NEN thua huong tu http.
# Dong 2: dat lai o location NEN cai o http BIEN MAT — khong phai hai header,
#         ma la MOT. Do la luat quan trong nhat trong ca bai nay.</div>
<div class="pitfall">
<p><strong>Bẫy — directive dạng MẢNG được thừa hưởng theo kiểu THAY THẾ, không phải cộng thêm.</strong> Đây là cách một cái header bảo mật biến mất. Bạn đặt bốn <code>add_header</code> ở tầng <code>http</code>, mọi thứ chạy tốt, rồi sáu tháng sau có người thêm MỘT <code>add_header</code> vào một cái <code>location</code> — và ở riêng cái location đó, BỐN cái kia biến mất hoàn toàn. Không cảnh báo nào, không lỗi nào, và <code>nginx -t</code> vui vẻ. Cùng luật đó áp cho <code>proxy_set_header</code>: khai một cái ở tầng thấp hơn là VỨT hết những cái ở tầng trên, và đó chính là lý do Chương 3 dạy bạn gom sáu header proxy vào một tệp rồi <code>include</code> nó ở MỌI chỗ cần.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Thừa hưởng chỉ đi XUỐNG, không đi ngang</span><span class="lz-lnote">Một directive ở <code>http</code> thì áp cho mọi <code>server</code> và mọi <code>location</code> bên dưới. Một directive ở một <code>server</code> thì KHÔNG áp cho <code>server</code> khác. Đó là lý do những thứ dùng chung phải nằm ở tầng <code>http</code>, hoặc nằm trong một tệp được <code>include</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Directive VÔ HƯỚNG thì đơn giản</span><span class="lz-lnote"><code>root</code>, <code>client_max_body_size</code>, <code>proxy_read_timeout</code> — cái ở tầng gần nhất thắng, đúng như bạn mong đợi. Chỉ đám mảng mới gây bất ngờ, và đám đó chủ yếu là <code>add_header</code> với <code>proxy_set_header</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">include là phép dán VĂN BẢN, không phải một phạm vi</span><span class="lz-lnote">Một tệp được <code>include</code> thì được chèn NGUYÊN VĂN vào đúng chỗ, và nó thừa hưởng ngữ cảnh tại điểm chèn. Nên cùng một tệp có thể chèn vào <code>http</code> hay vào một <code>location</code>, và ý nghĩa sẽ khác nhau.</span></div>
  <div class="lz-layer"><span class="lz-lname">Khi nghi ngờ, hãy dùng nginx -T</span><span class="lz-lnote">Nó in ra cấu hình HIỆU LỰC với mọi include đã bung. Đọc cái đó rồi lần theo cây từ ngoài vào trong là cách trả lời DỨT KHOÁT cho câu "cái này có áp ở đây không", và nó nhanh hơn mọi phép suy đoán.</span></div>
</div>
<div class="note-ct">
<p><strong>Cách đọc một tệp cấu hình bạn CHƯA TỪNG nhìn thấy.</strong> Ba câu hỏi, theo thứ tự. Có bao nhiêu khối <code>server</code>, và mỗi cái nghe cổng nào với <code>server_name</code> nào? Trong khối bạn quan tâm, có những <code>location</code> nào và mỗi cái thuộc loại nào (Chương 2 giải thích chỗ này)? Và cuối cùng: những directive nào được khai ở tầng <code>http</code> mà một <code>location</code> nào đó đang lặng lẽ GHI ĐÈ? Ba câu ấy, trả lời trên bản in của <code>nginx -T</code>, dựng lại được ý định của một cấu hình mà bạn chưa từng thấy — nhanh hơn NHIỀU so với đọc tuần tự từ dòng một.</p>
</div>

<h3>🔬 Tự chạy lại: bốn header bảo mật, và một dòng làm chúng biến mất</h3>
<p>Cái bẫy thừa hưởng ở trên, viết thành tệp chạy được (nginx/1.24.0):</p>
<pre><code class="language-bash">pid       /tmp/ng/logs/bon.pid;
error_log /tmp/ng/logs/error.log warn;
events {}
http {
  access_log off;
  add_header X-Frame-Options        "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy        "no-referrer" always;
  add_header Strict-Transport-Security "max-age=31536000" always;
  server {
    listen 8083;
    location /trang  { return 200 "ok\\n"; }
    location /tai-ve {
      add_header Content-Disposition "attachment" always;
      return 200 "ok\\n";
    }
  }
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:8083/trang  | grep -iE '^(x-|referrer|strict|content-disp)'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000
$ curl -sI http://127.0.0.1:8083/tai-ve | grep -iE '^(x-|referrer|strict|content-disp)'
Content-Disposition: attachment</div>
<p><code>/trang</code> nhận đủ bốn header; <code>/tai-ve</code> thêm MỘT <code>add_header</code> và mất cả bốn cái kia — không cảnh báo, và <code>nginx -t</code> vẫn báo thành công. Tiếp theo là ba lỗi cú pháp thật và đúng những gì <code>nginx -t</code> nói:</p>
<pre><code class="language-bash"><span class="tok-comment"># ba tệp, ba lỗi — nginx -t chỉ ra tệp và dòng</span>
nginx -t -c /tmp/ng/conf/sai1.conf <span class="tok-comment">  # "listen 8084" thiếu ;</span>
nginx -t -c /tmp/ng/conf/sai2.conf <span class="tok-comment">  # worker_connections đặt trong server</span>
nginx -t -c /tmp/ng/conf/sai3.conf <span class="tok-comment">  # không có khối events</span></code></pre>
<div class="out">$ nginx -t -c /tmp/ng/conf/sai1.conf
2026/11/12 10:59:40 [emerg] 1200#1200: directive "listen" is not terminated by ";" in /tmp/ng/conf/sai1.conf:5
nginx: configuration file /tmp/ng/conf/sai1.conf test failed
$ nginx -t -c /tmp/ng/conf/sai2.conf
2026/11/12 10:59:40 [emerg] 1208#1208: "worker_connections" directive is not allowed here in /tmp/ng/conf/sai2.conf:5
nginx: configuration file /tmp/ng/conf/sai2.conf test failed
$ nginx -t -c /tmp/ng/conf/sai3.conf
nginx: the configuration file /tmp/ng/conf/sai3.conf syntax is ok
2026/11/12 10:59:40 [emerg] 1216#1216: no "events" section in configuration
nginx: configuration file /tmp/ng/conf/sai3.conf test failed</div>
<p>Dấu chấm phẩy thiếu sau <code>listen</code> (dòng 4) được báo ở dòng 5 — dòng nơi Nginx phát hiện ra. Và <code>nginx -T</code> in các tệp include ngay tại chỗ, mỗi tệp có nhãn đường dẫn:</p>
<div class="out">$ nginx -T -c /tmp/ng/conf/goc.conf 2&gt;/dev/null
# configuration file /tmp/ng/conf/goc.conf:
events {}
http {
  include /tmp/ng/conf/conf.d/*.conf;
}

# configuration file /tmp/ng/conf/conf.d/api.conf:
server {
  listen 8085;
  location / { return 200 "api\\n"; }
}</div>
<h3>🔗 Bài liên quan ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-7-4-header-quan-trong" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking cho lập trình viên · 7.4 — Các header đổi hành vi</span><span class="lc-sub">X-Frame-Options, nosniff và HSTS thật ra bảo vệ cái gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-1-header-csp-cors" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">Node.js · 9.1 — Đường biên: header bảo mật, CSP và CORS</span><span class="lc-sub">Cũng những header đó đặt từ phía ứng dụng — và vì sao đặt một lần ở biên thì đơn giản hơn</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Context</span><span class="v">Một phạm vi lồng nhau: main, <code>events</code>, <code>http</code>, <code>server</code>, <code>location</code>.</span></div>
  <div class="kv"><span class="k">Khối <code>events</code></span><span class="v">Bắt buộc; chứa <code>worker_connections</code> và cơ chế poll kết nối.</span></div>
  <div class="kv"><span class="k">http → server → location</span><span class="v">Ba tầng lồng nhau nơi gần như toàn bộ công việc diễn ra.</span></div>
  <div class="kv"><span class="k">Inheritance (thừa hưởng)</span><span class="v">Directive áp XUỐNG các khối con, không bao giờ áp ngang sang khối anh em.</span></div>
  <div class="kv"><span class="k">Array-valued directive</span><span class="v"><code>add_header</code> / <code>proxy_set_header</code> — thừa hưởng theo kiểu THAY THẾ, không cộng thêm.</span></div>
  <div class="kv"><span class="k"><code>error_log</code> vs <code>access_log</code></span><span class="v">Vấn đề của chính máy chủ so với mỗi request một dòng — hai tệp khác nhau.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cấu hình là một cây các ngữ cảnh (main, events, http, server, location), không phải một chương trình.</li><li>Directive thừa hưởng xuống dưới; với loại vô hướng thì khai báo gần nhất thắng.</li><li>Directive dạng mảng như <code>add_header</code> và <code>proxy_set_header</code> bị THAY THẾ ở tầng thấp hơn, không gộp — nguyên nhân của phần lớn "tôi đặt rồi mà nó chẳng làm gì".</li><li><code>error_log</code> và <code>access_log</code> là hai tệp khác nhau; chẩn đoán bằng đúng cái.</li><li><code>include</code> là phép dán văn bản thừa hưởng ngữ cảnh nơi nó rơi vào; <code>nginx -T</code> in ra cây đã bung.</li></ul>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html#conf_structure" target="_blank" rel="noopener"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">nginx — cấu trúc tệp cấu hình</span><span class="lc-sub">nginx.org · Ngữ cảnh, directive và luật cú pháp, gói trong một trang ngắn</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">nginx — add_header</span><span class="lc-sub">nginx.org · Đúng cái đoạn về thừa hưởng giải thích phép đo ở trên</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/dirindex.html" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — bảng tra directive theo bảng chữ cái</span><span class="lc-sub">nginx.org · Mọi directive kèm những ngữ cảnh nó được phép nằm</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">Đọc một tệp cấu hình lớn bằng grep và less, và tệp log nằm ở đâu</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Đặt bốn header ở http, thêm một cái ở một location, rồi nhìn ba cái kia biến mất</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: 'Quiz: the problem and the setup|||Quiz: bài toán và bản dựng',
      slug: 'nginx-0-4-quiz',
      type: 'QUIZ',
      description: 'Tám câu về việc Nginx giải bài toán gì, mô hình master/worker, nạp lại không gián đoạn, và luật thừa hưởng directive.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Quiz: the problem and the setup</h2>
<p class="lead">Eight questions on what you have already run. If any of them is unclear, the answer is in one of the three lessons above rather than in a chapter you have not reached.</p>
<div class="callout">
<p><strong>What this section established.</strong> Nginx is not faster at serving one file — it is better at serving many at once, and it costs eight megabytes instead of a hundred and sixty-nine (0.1). A master running as root binds ports and supervises unprivileged workers, one per core, each handling thousands of connections in a single thread (0.2). <code>nginx -s reload</code> replaces the workers without changing the master and without dropping a connection, and <code>nginx -t</code> catches the config error before it can (0.2). Configuration is a tree of contexts where directives inherit downwards — and array-valued ones like <code>add_header</code> are replaced rather than added to, which is the rule behind most "I set it and it does nothing" (0.3).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Quiz: bài toán và bản dựng</h2>
<p class="lead">Tám câu về đúng những thứ bạn đã chạy rồi. Nếu câu nào còn mờ thì câu trả lời nằm trong một trong ba bài ở trên, chứ không nằm ở một chương bạn chưa tới.</p>
<div class="callout">
<p><strong>Mục này đã xác lập điều gì.</strong> Nginx KHÔNG nhanh hơn khi phục vụ MỘT tệp — nó giỏi hơn khi phục vụ NHIỀU tệp cùng lúc, và nó tốn tám megabyte thay vì một trăm sáu mươi chín (0.1). Một tiến trình master chạy bằng root chiếm cổng và trông coi các worker không đặc quyền, mỗi nhân một cái, và mỗi cái xử lý hàng nghìn kết nối trong MỘT luồng (0.2). <code>nginx -s reload</code> thay đám worker mà KHÔNG đổi master và KHÔNG rớt một kết nối nào, còn <code>nginx -t</code> thì bắt lỗi cấu hình trước khi nó kịp (0.2). Cấu hình là một CÂY các ngữ cảnh nơi directive thừa hưởng XUỐNG DƯỚI — và những cái dạng mảng như <code>add_header</code> thì bị THAY THẾ chứ không cộng thêm, và đó là cái luật đứng sau phần lớn những lần "tôi đặt rồi mà nó chẳng làm gì" (0.3).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'The measurement showed nginx 364ms and Node 474ms sequentially, but 481ms and 913ms at 50 concurrent clients. What does that mean?|||Phép đo cho thấy nginx 364ms và Node 474ms khi chạy tuần tự, nhưng 481ms và 913ms ở 50 client song song. Điều đó nghĩa là gì?',
            options: [
              'Nginx is roughly 30% faster at everything|||Nginx nhanh hơn khoảng 30% ở mọi thứ',
              'Nginx is not much faster at one request — its advantage is handling many at once, which is the only problem it was built for|||Nginx KHÔNG nhanh hơn bao nhiêu ở MỘT request — lợi thế của nó là xử lý NHIỀU cái cùng lúc, và đó là bài toán DUY NHẤT nó được dựng ra để giải',
              'The Node server had a bug|||Máy chủ Node có lỗi',
              'Concurrency does not affect either server|||Mức song song không ảnh hưởng tới máy chủ nào cả',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Does putting Nginx in front of your API make an individual API request faster?|||Đặt Nginx trước API của bạn có làm cho MỘT lời gọi API riêng lẻ nhanh hơn không?',
            options: [
              'Yes; that is the main reason to use it|||Có; đó là lý do chính để dùng nó',
              'No — a proxied request is always slightly slower because of the extra hop; what you gain is that slow connections, TLS and static files stop competing with your application|||Không — một request đi qua proxy thì LUÔN chậm hơn một chút vì có thêm một chặng; cái bạn được là những kết nối chậm, TLS và tệp tĩnh thôi giành giật với ứng dụng của bạn',
              'Only if caching is enabled|||Chỉ khi đã bật bộ đệm',
              'Yes, because Nginx is written in C|||Có, vì Nginx viết bằng C',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does the master process run as root while the workers do not?|||Vì sao tiến trình master chạy bằng root còn các worker thì không?',
            options: [
              'So the master can serve requests faster|||Để master phục vụ request nhanh hơn',
              'The master needs root only to bind ports below 1024 and open log files; the workers face the internet, so a bug in request handling is not a bug running as root|||Master chỉ cần root để chiếm các cổng dưới 1024 và mở tệp log; còn worker mới là bên đối mặt Internet, nên một con lỗi khi xử lý request KHÔNG phải một con lỗi chạy bằng quyền root',
              'Because log files must be owned by root|||Vì tệp log bắt buộc phải thuộc về root',
              'It is a legacy behaviour with no purpose today|||Đó là hành vi cũ để lại, ngày nay không còn mục đích gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your site serves files from /home/cuong/www and Nginx logs "13: Permission denied", but you can cat the file as root. Why?|||Trang của bạn phục vụ tệp từ /home/cuong/www và Nginx ghi log "13: Permission denied", nhưng bạn cat tệp đó bằng root thì vẫn được. Vì sao?',
            options: [
              'The file is corrupted|||Cái tệp đó bị hỏng',
              'The worker runs as an unprivileged user and needs read access to the file plus execute permission on every parent directory on the path|||Worker chạy bằng một người dùng KHÔNG đặc quyền và nó cần quyền đọc tệp CỘNG quyền THỰC THI trên MỌI thư mục cha trên đường dẫn',
              'Nginx cannot serve files from /home at all|||Nginx hoàn toàn không phục vụ được tệp từ /home',
              'The root directive must be absolute|||Directive root bắt buộc phải là đường dẫn tuyệt đối',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between nginx -s reload and systemctl restart nginx?|||Khác biệt giữa nginx -s reload và systemctl restart nginx là gì?',
            options: [
              'None; they do the same thing|||Không có; hai cái làm cùng một việc',
              'Reload validates the config, starts new workers and lets old ones finish their connections — the master never restarts and nothing is dropped; restart kills everything including in-flight requests|||Reload kiểm chứng cấu hình, khởi động worker MỚI và để worker cũ phục vụ nốt các kết nối của nó — master KHÔNG khởi động lại và chẳng có gì bị rớt; còn restart thì giết sạch, kể cả các request đang bay',
              'Reload is slower but safer|||Reload chậm hơn nhưng an toàn hơn',
              'Restart re-reads the config while reload does not|||Restart đọc lại cấu hình còn reload thì không',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You set four add_header directives in the http block. One location adds a fifth. What does a response from that location contain?|||Bạn đặt bốn directive add_header trong khối http. Một location thêm cái thứ năm. Phản hồi từ location đó chứa cái gì?',
            options: [
              'All five headers|||Cả năm header',
              'Only the one declared in the location — array-valued directives are inherited by replacement, so the four from http are discarded there|||CHỈ cái khai trong location — directive dạng mảng được thừa hưởng theo kiểu THAY THẾ, nên bốn cái từ http bị VỨT đi ở đó',
              'The four from http; the location one is ignored|||Bốn cái từ http; cái ở location bị lờ đi',
              'It depends on the order they are declared|||Còn tuỳ vào thứ tự khai báo',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which command answers "which file is this setting actually coming from"?|||Câu lệnh nào trả lời được "cái thiết lập này thật ra tới từ tệp nào"?',
            options: [
              'nginx -t, which validates the configuration|||nginx -t, câu kiểm chứng cấu hình',
              'nginx -T, which prints the entire effective configuration with every include expanded|||nginx -T, câu in ra TOÀN BỘ cấu hình hiệu lực với mọi include đã được bung ra',
              'nginx -V, which lists the compiled modules|||nginx -V, câu liệt kê các module đã biên dịch',
              'nginx -s reopen|||nginx -s reopen',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A directive from the documentation is rejected as unknown. What should you check first?|||Một directive có trong tài liệu lại bị từ chối vì "không biết". Bạn nên kiểm cái gì trước?',
            options: [
              'The semicolon at the end of the line|||Dấu chấm phẩy ở cuối dòng',
              'nginx -V — modules are compiled in rather than loaded at runtime, so the build decides which directives exist, and versions differ|||nginx -V — module được BIÊN DỊCH VÀO chứ không nạp lúc chạy, nên bản dựng quyết định directive nào tồn tại, và các phiên bản thì khác nhau',
              'Whether the file is readable by the worker user|||Xem tệp đó người dùng worker có đọc được không',
              'The order of the server blocks|||Thứ tự các khối server',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
