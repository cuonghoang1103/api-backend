/**
 * Nginx — Mục 0: Bài toán, và một bản dựng chạy được.
 * Nginx giải bài toán gì · cài và chạy trong hai phút · tệp cấu hình đầu tiên · quiz.
 * Output CHẠY THẬT nginx/1.24.0 (Ubuntu) trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Section 0 — The problem, and a build that runs|||Mục 0 — Bài toán, và một bản dựng chạy được',
  description: 'Trước khi có một directive nào: Nginx giải bài toán gì mà một ứng dụng Node hay Python không tự giải nổi, mô hình tiến trình của nó khác gì, và một tệp cấu hình nhỏ nhất chạy được trông ra sao. Cuối mục này bạn đã có một máy chủ đang chạy và đọc được cây tiến trình của chính nó.',
  lessons: [

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — What Nginx solves that your application cannot|||0.1 — Nginx giải cái gì mà ứng dụng của bạn không tự giải nổi',
      slug: 'nginx-0-1-bai-toan',
      type: 'LESSON',
      description: 'Ứng dụng của bạn đã phục vụ được HTTP rồi, nên câu hỏi đúng không phải "Nginx làm gì" mà là "nó làm gì mà một tiến trình ứng dụng làm thì tệ". Bài này đo THẬT cả hai với cùng một tệp, tuần tự rồi song song, và con số chỉ tách hẳn ra ở cột thứ hai.',
      content: `
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
  <div class="kv"><span class="k">Sequentially the difference is unremarkable</span><span class="v">Three hundred and sixty-four against four hundred and seventy-four milliseconds. If your product serves one file at a time, this measurement is not an argument for anything — and being honest about that is why the second row matters.</span></div>
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
<pre><code><span class="tok-comment"># Không có Nginx: mỗi ứng dụng tự lo mọi thứ.</span>
Internet → :3000 Node   (TLS? gzip? tệp tĩnh? trần tần suất? tất cả tự viết)
         → :4000 Python (…và viết lại lần nữa, bằng ngôn ngữ khác)

<span class="tok-comment"># Có Nginx: một chỗ duy nhất, và ứng dụng chỉ còn lo phần việc của nó.</span>
Internet → :443 nginx ─┬→ 127.0.0.1:3000  /api
                       ├→ 127.0.0.1:4000  /ai
                       └→ /var/www        /static  (nginx tự phục vụ)</code></pre>
<div class="pitfall">
<p><strong>Bẫy — "Nginx nhanh hơn" là một câu nói bị dùng sai nhiều hơn cả.</strong> Nginx không làm ứng dụng của bạn nhanh lên: một request đi qua proxy thì luôn CHẬM HƠN một request đi thẳng, vì có thêm một chặng. Cái nó làm là bóc phần việc mà ứng dụng làm dở — giữ hàng nghìn kết nối chậm, đọc tệp từ đĩa, kết thúc TLS, nuốt các request rác — để cái event loop hay cái pool luồng của bạn chỉ còn làm phần việc RIÊNG của nó. Đo một endpoint API duy nhất trước và sau khi thêm proxy thì bạn sẽ thấy nó chậm đi vài mili giây, và đó là một cuộc trao đổi có lời, không phải một phép màu.</p>
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
  <div class="kv"><span class="k">Chạy TUẦN TỰ thì khác biệt chẳng có gì đáng nói</span><span class="v">Ba trăm sáu mươi tư so với bốn trăm bảy mươi tư mili giây. Nếu sản phẩm của bạn phục vụ MỘT tệp tại một thời điểm thì phép đo này không phải lý lẽ cho bất cứ điều gì — và việc nói thẳng chuyện đó chính là lý do hàng THỨ HAI mới đáng kể.</span></div>
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
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Install, run, and read the process tree</h2>
<p class="lead">Nginx installs in one command and starts in one more, which makes it tempting to skip straight to configuration. Five minutes spent on what actually started pays for itself immediately, because the process model explains the privilege split, the reload behaviour and half the error messages you will ever see from it.</p>

<h3>Two minutes to running</h3>
<pre><code><span class="tok-comment"># Ubuntu / Debian</span>
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
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Four cores, four workers</span><span class="lz-nsub">More than one per core buys nothing — they would compete for the same CPUs</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Bẫy — "Permission denied" ở Nginx gần như luôn là chuyện WORKER, không phải chuyện master.</strong> Master chạy bằng root nên nó mở được cổng 80 và đọc được mọi thứ; còn worker thì chạy bằng <code>www-data</code> hoặc <code>nobody</code> và mới là cái đi đọc tệp của bạn. Nên một thư mục mà chỉ chủ sở hữu đọc được sẽ cho ra <code>13: Permission denied</code> trong error log dù bạn <code>cat</code> tệp đó bằng root vẫn thấy. Và nó không chỉ là quyền của bản thân tệp: worker cần quyền THỰC THI trên MỌI thư mục cha trên đường dẫn — một chỗ hay hỏng khi <code>root</code> trỏ vào một thư mục nằm dưới <code>/home/ai-do</code>.</p>
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
<pre><code><span class="tok-comment"># Ubuntu / Debian</span>
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
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bốn nhân, bốn worker</span><span class="lz-nsub">Nhiều hơn một cái mỗi nhân thì chẳng mua được gì — chúng sẽ giành nhau cùng những CPU đó</span></div></div>
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
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The smallest config that works, and how Nginx reads it</h2>
<p class="lead">Nginx configuration is not a program — it is a tree of nested contexts with an inheritance rule, and once that rule is clear most of the language stops being surprising. This lesson is ten lines that run, then the one rule that explains why a setting you definitely wrote is definitely not applying.</p>

<h3>Ten lines, each with a reason</h3>
<pre><code>worker_processes  1;                       <span class="tok-comment"># bao nhiêu tiến trình thợ — Bài 0.2</span>
error_log         /tmp/ng/logs/error.log warn;  <span class="tok-comment"># log LỖI: chỗ đầu tiên phải nhìn</span>
pid               /tmp/ng/logs/nginx.pid;  <span class="tok-comment"># nơi tín hiệu tìm ra master</span>

events {                                   <span class="tok-comment"># ← ngữ cảnh events, bắt buộc phải có</span>
  worker_connections 1024;                 <span class="tok-comment"># trần kết nối cho MỖI worker</span>
}

http {                                     <span class="tok-comment"># ← mọi thứ về HTTP nằm trong đây</span>
  access_log /tmp/ng/logs/access.log;      <span class="tok-comment"># log TRUY CẬP: khác hẳn error_log</span>

  server {                                 <span class="tok-comment"># ← một "trang", một cổng, một tên miền</span>
    listen      8080;
    server_name _;                         <span class="tok-comment"># "_" = khớp mọi Host — Chương 2</span>

    location / {                           <span class="tok-comment"># ← một nhóm URL</span>
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
  <div class="kv"><span class="k">error_log and access_log are different things</span><span class="v"><code>error_log</code> records the server's own problems — permission denied, upstream unreachable, config warnings. <code>access_log</code> records one line per request. Diagnosing with the wrong one is Chapter 12's most common wasted hour.</span></div>
  <div class="kv"><span class="k">The distribution config is bigger, not different</span><span class="v"><code>/etc/nginx/nginx.conf</code> ends with <code>include /etc/nginx/conf.d/*.conf;</code> and <code>include /etc/nginx/sites-enabled/*;</code> — the same tree, split across files. <code>nginx -T</code> prints it back as one document.</span></div>
</div>

<h3>The inheritance rule, measured</h3>
<pre><code>http {
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
<p><strong>Bẫy — array-type directives are inherited by REPLACEMENT, not by addition.</strong> This is how a security header disappears. You set four <code>add_header</code> directives at <code>http</code>, everything works, and six months later somebody adds ONE <code>add_header</code> to one <code>location</code> — and in that location, the other four vanish completely. No warning, no error, and <code>nginx -t</code> is perfectly happy. The same rule applies to <code>proxy_set_header</code>: declaring one at a lower level discards every one from above, which is exactly why Chapter 3 has you put the six proxy headers in one file and <code>include</code> it everywhere they are needed.</p>
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
<pre><code>worker_processes  1;                       <span class="tok-comment"># bao nhiêu tiến trình thợ — Bài 0.2</span>
error_log         /tmp/ng/logs/error.log warn;  <span class="tok-comment"># log LỖI: chỗ đầu tiên phải nhìn</span>
pid               /tmp/ng/logs/nginx.pid;  <span class="tok-comment"># nơi tín hiệu tìm ra master</span>

events {                                   <span class="tok-comment"># ← ngữ cảnh events, bắt buộc phải có</span>
  worker_connections 1024;                 <span class="tok-comment"># trần kết nối cho MỖI worker</span>
}

http {                                     <span class="tok-comment"># ← mọi thứ về HTTP nằm trong đây</span>
  access_log /tmp/ng/logs/access.log;      <span class="tok-comment"># log TRUY CẬP: khác hẳn error_log</span>

  server {                                 <span class="tok-comment"># ← một "trang", một cổng, một tên miền</span>
    listen      8080;
    server_name _;                         <span class="tok-comment"># "_" = khớp mọi Host — Chương 2</span>

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
  <div class="kv"><span class="k">error_log và access_log là hai thứ KHÁC NHAU</span><span class="v"><code>error_log</code> ghi lại các vấn đề của chính máy chủ — không đủ quyền, không với tới được upstream, cảnh báo cấu hình. <code>access_log</code> ghi mỗi request một dòng. Chẩn đoán bằng NHẦM cái là giờ đồng hồ bị phí phổ biến nhất ở Chương 12.</span></div>
  <div class="kv"><span class="k">Cấu hình của bản phân phối thì TO hơn, không phải KHÁC</span><span class="v"><code>/etc/nginx/nginx.conf</code> kết thúc bằng <code>include /etc/nginx/conf.d/*.conf;</code> và <code>include /etc/nginx/sites-enabled/*;</code> — vẫn cái cây đó, chỉ là chia ra nhiều tệp. <code>nginx -T</code> in nó lại thành MỘT tài liệu.</span></div>
</div>

<h3>Luật thừa hưởng, đo thật</h3>
<pre><code>http {
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
