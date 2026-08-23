const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 7 — Limits: rate, connections, and size|||Chương 7 — Giới hạn: tần suất, kết nối và kích thước',
  description: 'Nginx là chỗ duy nhất trong hệ thống nhìn thấy MỌI request trước khi có gì đắt đỏ xảy ra, nên nó là chỗ đúng để đặt giới hạn. Chương này đo từng cái: ba chế độ burst cho ra ba hành vi khác hẳn nhau, và một chỉ thị mà ai cũng tưởng là chống được đòn nhỏ giọt thì đo ra là KHÔNG.',
  lessons: [

    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — limit_req: three burst modes, three different sites|||7.1 — limit_req: ba chế độ burst, ba cái site khác hẳn nhau',
      slug: 'nginx-7-1-limit-req',
      type: 'LESSON',
      description: 'Cùng một mức 2r/s, ba cách viết, và ba kết quả không giống nhau chút nào: một cách đá chín trên mười request, một cách cho qua cả mười nhưng bắt chờ 4,93 giây, một cách cho năm cái đầu đi ngay rồi đá phần còn lại. Bài này đo cả ba rồi chỉ ra cái nào hợp với cái gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>limit_req: three burst modes, three different sites</h2>
<p class="lead">Rate limiting looks like one setting with a number in it. It is three settings, and the difference between them is the difference between a site that rejects a normal user and one that absorbs a burst without anyone noticing.</p>

<h3>Same rate, three spellings, ten rapid requests</h3>
<pre><code>limit_req_zone \$binary_remote_addr zone=cham:10m rate=2r/s;

location /a/ { limit_req zone=cham; }                    <span class="tok-comment"># không burst</span>
location /b/ { limit_req zone=cham burst=5; }            <span class="tok-comment"># burst, có xếp hàng</span>
location /c/ { limit_req zone=cham burst=5 nodelay; }    <span class="tok-comment"># burst, không chờ</span></code></pre>
<div class="out">Ban 10 request lien tiep that nhanh:

A) khong burst    200 503 503 503 503 503 503 503 503 503
B) burst=5        200 200 200 200 200 200 200 200 200 200   (mat 4,93s)
C) burst=5 nodelay 200 200 200 200 200 503 503 503 503 503  (mat 0,08s)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">No burst is a leaky bucket with no bucket</span><span class="lz-d">The rate is 2 per second, so requests must arrive at least 500ms apart. Ten in a row means one is served and nine are refused. Almost no real client behaves this politely, which is why this form rejects legitimate users.</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">burst= holds them and releases at the rate</span><span class="lz-d">All ten succeeded, spread over 4.93 seconds — which is what 2 per second looks like. Nobody was refused; some people waited. That is a very different user experience from A, from one word of config.</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">nodelay serves the burst immediately, then refuses</span><span class="lz-d">Five instant successes in 0.08 seconds, then <code>503</code>. The bucket still refills at 2 per second, so this absorbs a spike without delay and still holds the long-run average.</span></div>
  <div class="lz-step"><span class="lz-k">·</span><span class="lz-t">The average is identical in all three</span><span class="lz-d">Two requests per second, always. What changes is what happens to the eleventh request in a second — refused, delayed, or served from a bucket that has to refill.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">nodelay is right for interactive traffic</span><span class="v">A page that fires six API calls on load should not have five of them queued behind a rate limiter. <code>burst=20 nodelay</code> lets a normal page load through untouched while still stopping a script running flat out.</span></div>
  <div class="kv"><span class="k">Queueing is right for expensive backends</span><span class="v">If each request costs the backend real work — a report, an image resize, an LLM call — delaying is better than refusing, because the client gets its answer and your backend is never asked to do more than it can. The cost is held connections, which is why it pairs with a sane <code>limit_conn</code>.</span></div>
  <div class="kv"><span class="k">No burst at all is almost always wrong</span><span class="v">Row A refused nine of ten requests from one ordinary client. The only place it fits is an endpoint where a second request within 500ms is definitionally abuse — a password reset email, an SMS send.</span></div>
  <div class="kv"><span class="k">delay=N is the middle setting nobody uses</span><span class="v"><code>burst=20 delay=5</code> serves the first five instantly and queues the next fifteen. It is the best of both for a page-load burst followed by a script, and it is worth reaching for once the simple forms are not fitting.</span></div>
</div>

<h3>The status code, and what the log says</h3>
<div class="out">mac dinh                     : 200 503 503 503
limit_req_status 429         : 200 200 429 429 429

error.log: limiting requests, excess: 0.660 by zone "cham", client: 127.0.0.1</div>
<div class="pitfall">
<p><strong>Bẫy — the default rejection status is <code>503</code>, which tells the client the wrong thing.</strong> <code>503 Service Unavailable</code> means "the server is having trouble" — monitoring counts it as an error, well-behaved clients back off as if you are down, and a CDN may treat it as an origin failure. What you meant is <code>429 Too Many Requests</code>: the server is fine, this client asked too often. Set <code>limit_req_status 429;</code> and <code>limit_conn_status 429;</code> in every config that limits anything. It costs one line, it makes your own error dashboards honest, and it lets clients implement the retry behaviour the status is designed to trigger. Adding a <code>Retry-After</code> header alongside it is the difference between a client retrying sensibly and a client retrying immediately forever.</p>
</div>
<pre><code>http {
  limit_req_zone \$binary_remote_addr zone=chung:10m rate=10r/s;
  limit_req_status  429;          <span class="tok-comment"># KHÔNG phải 503</span>
  limit_conn_status 429;

  server {
    <span class="tok-comment"># Tuyến người dùng bấm: cho cả trang nạp qua, chặn script</span>
    location /api/ {
      limit_req zone=chung burst=20 nodelay;
      add_header Retry-After 1 always;
      proxy_pass http://api;
    }

    <span class="tok-comment"># Tuyến ĐẮT: xếp hàng chứ đừng từ chối</span>
    location /api/bao-cao {
      limit_req zone=chung burst=5;      <span class="tok-comment"># có chờ</span>
      proxy_pass http://api;
    }
  }
}</code></pre>

<h3>Reading the rate you set</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">rate=Nr/s is a refill rate, not a quota</span><span class="lz-lnote">Nginx implements a leaky bucket: the bucket drains at the rate and <code>burst</code> is its size. "10 requests per second" does not mean a counter reset each second — it means one token every 100ms.</span></div>
  <div class="lz-layer"><span class="lz-lname">rate=30r/m exists and is often what you want</span><span class="lz-lnote">For anything measured in requests per minute — sending an email, an expensive export — the minute form is clearer than converting to a fraction. Both are the same mechanism.</span></div>
  <div class="lz-layer"><span class="lz-lname">Two zones can apply to one location</span><span class="lz-lnote">A generous per-second limit plus a strict per-hour one, both listed in the same block, both enforced. That is how you allow a normal burst while still stopping a slow-and-steady scraper.</span></div>
  <div class="lz-layer"><span class="lz-lname">limit_req_log_level warn makes it visible</span><span class="lz-lnote">Rejections log at <code>error</code> by default, which buries them among real errors. Setting it to <code>warn</code>, or logging <code>\$limit_req_status</code> in the access log, lets you see how often the limit fires before a user tells you.</span></div>
</div>
<div class="note-ct">
<p><strong>How to pick the numbers.</strong> Do not start from a guess — look at your access log and count requests per IP per second at the 99th percentile of normal traffic. Set the rate somewhat above that and the burst to cover one page load. Then watch the rejection count for a week. A limit that never fires is not protecting anything, and a limit that fires on real users is worse than none, and the log tells you which one you have.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_limit_req_module.html" target="_blank" rel="noopener"><span class="lc-ico">🚦</span><span class="lc-body"><span class="lc-title">nginx — the limit_req module</span><span class="lc-sub">nginx.org · burst, nodelay, delay and the leaky-bucket description</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429" target="_blank" rel="noopener"><span class="lc-ico">🛑</span><span class="lc-body"><span class="lc-title">MDN — 429 Too Many Requests</span><span class="lc-sub">developer.mozilla.org · Including Retry-After and what clients do with it</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Leaky_bucket" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Leaky bucket</span><span class="lc-sub">wikipedia.org · The algorithm behind all three rows above</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">Rate limiting in the application, and when the proxy is the wrong layer for it</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Fire ten rapid requests at each of the three modes and reproduce all three rows</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>limit_req: ba chế độ burst, ba cái site khác hẳn nhau</h2>
<p class="lead">Giới hạn tần suất trông như MỘT thiết lập có một con số bên trong. Nó là BA thiết lập, và khác biệt giữa chúng là khác biệt giữa một site đá một người dùng bình thường ra và một site nuốt trọn một đợt dồn mà chẳng ai để ý.</p>

<h3>Cùng một mức, ba cách viết, mười request liên tiếp</h3>
<pre><code>limit_req_zone \$binary_remote_addr zone=cham:10m rate=2r/s;

location /a/ { limit_req zone=cham; }                    <span class="tok-comment"># không burst</span>
location /b/ { limit_req zone=cham burst=5; }            <span class="tok-comment"># burst, có xếp hàng</span>
location /c/ { limit_req zone=cham burst=5 nodelay; }    <span class="tok-comment"># burst, không chờ</span></code></pre>
<div class="out">Ban 10 request lien tiep that nhanh:

A) khong burst    200 503 503 503 503 503 503 503 503 503
B) burst=5        200 200 200 200 200 200 200 200 200 200   (mat 4,93s)
C) burst=5 nodelay 200 200 200 200 200 503 503 503 503 503  (mat 0,08s)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">Không burst là một cái xô rỉ mà KHÔNG có xô</span><span class="lz-d">Mức là 2 mỗi giây, nên request phải tới cách nhau ít nhất 500ms. Mười cái liên tiếp nghĩa là MỘT được phục vụ và CHÍN bị từ chối. Gần như không client thật nào lịch sự tới thế, và đó là lý do dạng này đá cả người dùng hợp lệ.</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">burst= GIỮ chúng lại rồi thả ra theo đúng mức</span><span class="lz-d">Cả mười đều thành công, trải trên 4,93 giây — đó chính là hình dáng của "2 mỗi giây". KHÔNG ai bị từ chối; một số người phải chờ. Đó là một trải nghiệm rất khác so với A, chỉ từ MỘT chữ trong cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">nodelay phục vụ cả đợt dồn NGAY, rồi mới từ chối</span><span class="lz-d">Năm cú thành công tức thì trong 0,08 giây, rồi tới <code>503</code>. Cái xô vẫn được rót lại ở mức 2 mỗi giây, nên cách này nuốt được một cú dồn mà không bắt ai chờ và vẫn giữ được mức trung bình dài hạn.</span></div>
  <div class="lz-step"><span class="lz-k">·</span><span class="lz-t">Mức TRUNG BÌNH thì giống hệt nhau ở cả ba</span><span class="lz-d">Hai request mỗi giây, luôn luôn. Cái ĐỔI là chuyện gì xảy ra với request thứ mười một trong một giây — bị từ chối, bị bắt chờ, hay được phục vụ từ một cái xô rồi phải rót lại.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">nodelay đúng cho lưu lượng TƯƠNG TÁC</span><span class="v">Một trang bắn sáu lời gọi API lúc nạp thì không nên có năm cái bị xếp hàng sau một bộ giới hạn. <code>burst=20 nodelay</code> cho một lượt nạp trang bình thường đi qua nguyên vẹn mà vẫn chặn được một script chạy hết ga.</span></div>
  <div class="kv"><span class="k">Xếp hàng đúng cho backend ĐẮT ĐỎ</span><span class="v">Nếu mỗi request tốn của backend công việc thật — một báo cáo, một lượt đổi cỡ ảnh, một lời gọi LLM — thì BẮT CHỜ tốt hơn TỪ CHỐI, vì client vẫn nhận được câu trả lời và backend không bao giờ bị bắt làm nhiều hơn sức nó. Cái giá là những kết nối bị giữ, và đó là lý do nó đi cặp với một <code>limit_conn</code> tỉnh táo.</span></div>
  <div class="kv"><span class="k">Không burst gì cả thì gần như luôn SAI</span><span class="v">Dòng A từ chối chín trên mười request của MỘT client bình thường. Chỗ duy nhất nó hợp là một điểm cuối mà request thứ hai trong vòng 500ms tự nó đã là lạm dụng — một cú gửi email đặt lại mật khẩu, một cú gửi SMS.</span></div>
  <div class="kv"><span class="k">delay=N là thiết lập ở GIỮA mà chẳng ai dùng</span><span class="v"><code>burst=20 delay=5</code> phục vụ năm cái đầu tức thì rồi xếp hàng mười lăm cái sau. Nó là cái tốt nhất của cả hai cho một đợt dồn lúc nạp trang rồi tới một con script, và nó đáng với tới khi hai dạng đơn giản kia không vừa.</span></div>
</div>

<h3>Mã trạng thái, và log nói gì</h3>
<div class="out">mac dinh                     : 200 503 503 503
limit_req_status 429         : 200 200 429 429 429

error.log: limiting requests, excess: 0.660 by zone "cham", client: 127.0.0.1</div>
<div class="pitfall">
<p><strong>Bẫy — mã từ chối MẶC ĐỊNH là <code>503</code>, và nó nói với client một điều SAI.</strong> <code>503 Service Unavailable</code> nghĩa là "máy chủ đang gặp trục trặc" — hệ giám sát đếm nó là LỖI, những client cư xử tử tế thì lùi lại như thể bạn đang chết, và một CDN có thể coi đó là máy gốc hỏng. Thứ bạn MUỐN nói là <code>429 Too Many Requests</code>: máy chủ vẫn ổn, chỉ là client này hỏi quá nhiều. Hãy đặt <code>limit_req_status 429;</code> và <code>limit_conn_status 429;</code> vào MỌI cấu hình có giới hạn bất cứ thứ gì. Nó tốn một dòng, nó làm bảng lỗi của chính bạn thật thà, và nó cho client cài đặt đúng cái hành vi thử-lại mà mã trạng thái ấy sinh ra để kích hoạt. Thêm một header <code>Retry-After</code> đi kèm là khác biệt giữa một client thử lại có ý thức và một client thử lại ngay lập tức mãi mãi.</p>
</div>
<pre><code>http {
  limit_req_zone \$binary_remote_addr zone=chung:10m rate=10r/s;
  limit_req_status  429;          <span class="tok-comment"># KHÔNG phải 503</span>
  limit_conn_status 429;

  server {
    <span class="tok-comment"># Tuyến người dùng bấm: cho cả trang nạp qua, chặn script</span>
    location /api/ {
      limit_req zone=chung burst=20 nodelay;
      add_header Retry-After 1 always;
      proxy_pass http://api;
    }

    <span class="tok-comment"># Tuyến ĐẮT: xếp hàng chứ đừng từ chối</span>
    location /api/bao-cao {
      limit_req zone=chung burst=5;      <span class="tok-comment"># có chờ</span>
      proxy_pass http://api;
    }
  }
}</code></pre>

<h3>Đọc cái mức mà bạn vừa đặt</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">rate=Nr/s là tốc độ RÓT LẠI, không phải một hạn ngạch</span><span class="lz-lnote">Nginx cài đặt một cái xô rỉ: cái xô rỉ ra theo tốc độ đó và <code>burst</code> là DUNG TÍCH của nó. "10 request mỗi giây" KHÔNG nghĩa là một cái đếm được đặt lại mỗi giây — nó nghĩa là một cái thẻ mỗi 100ms.</span></div>
  <div class="lz-layer"><span class="lz-lname">rate=30r/m có tồn tại và nó thường là thứ bạn muốn</span><span class="lz-lnote">Với bất cứ thứ gì đo theo request mỗi PHÚT — gửi một email, một lượt xuất dữ liệu đắt đỏ — thì dạng phút rõ ràng hơn là đi quy về một phân số. Cả hai đều là cùng một cơ chế.</span></div>
  <div class="lz-layer"><span class="lz-lname">HAI vùng có thể cùng áp cho MỘT location</span><span class="lz-lnote">Một giới hạn theo giây rộng rãi cộng một giới hạn theo giờ chặt chẽ, cùng liệt kê trong một khối, cùng được thi hành. Đó là cách bạn cho phép một đợt dồn bình thường mà vẫn chặn được một con bọ cào chậm-mà-đều.</span></div>
  <div class="lz-layer"><span class="lz-lname">limit_req_log_level warn làm nó HIỆN ra</span><span class="lz-lnote">Mặc định các lần từ chối ghi ở mức <code>error</code>, và như thế thì chúng chìm nghỉm giữa những lỗi thật. Đặt nó thành <code>warn</code>, hoặc ghi <code>\$limit_req_status</code> vào access log, cho bạn thấy cái giới hạn nổ bao nhiêu lần TRƯỚC khi có người dùng đi báo.</span></div>
</div>
<div class="note-ct">
<p><strong>Chọn con số thế nào.</strong> Đừng bắt đầu từ một phỏng đoán — hãy soi access log và đếm số request theo từng IP theo từng giây ở phân vị 99 của lưu lượng BÌNH THƯỜNG. Đặt mức cao hơn con số đó một chút và đặt burst đủ phủ MỘT lượt nạp trang. Rồi theo dõi số lần từ chối trong một tuần. Một giới hạn KHÔNG BAO GIỜ nổ thì chẳng bảo vệ cái gì, còn một giới hạn nổ vào người dùng thật thì tệ hơn là không có, và cái log nói cho bạn biết mình đang có cái nào.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_limit_req_module.html" target="_blank" rel="noopener"><span class="lc-ico">🚦</span><span class="lc-body"><span class="lc-title">nginx — module limit_req</span><span class="lc-sub">nginx.org · burst, nodelay, delay và phần mô tả cái xô rỉ</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429" target="_blank" rel="noopener"><span class="lc-ico">🛑</span><span class="lc-body"><span class="lc-title">MDN — 429 Too Many Requests</span><span class="lc-sub">developer.mozilla.org · Kèm Retry-After và client làm gì với nó</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Leaky_bucket" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Leaky bucket</span><span class="lc-sub">wikipedia.org · Thuật toán đứng sau cả ba dòng ở trên</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Giới hạn tần suất trong ứng dụng, và khi nào proxy là SAI tầng cho việc đó</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Bắn mười request nhanh vào từng chế độ trong ba chế độ và dựng lại đủ ba dòng</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — What to key the limit on, and the key that can be forged|||7.2 — Khoá giới hạn theo cái gì, và cái khoá giả mạo được',
      slug: 'nginx-7-2-khoa-gioi-han',
      type: 'LESSON',
      description: 'Ba phép đo cho thấy hai cách khoá phổ biến nhất đều SAI theo hai hướng ngược nhau: khoá theo địa chỉ TCP thì năm người dùng sau một proxy dùng chung một hạn mức, còn khoá theo X-Forwarded-For thì kẻ tấn công đổi header mỗi request và đi qua tám trên tám lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>What to key the limit on, and the key that can be forged</h2>
<p class="lead">A rate limit is a counter and a key. Lesson 7.1 was about the counter. The key is where limits actually fail, and both of the obvious choices fail — in opposite directions, measurably.</p>

<h3>Three measurements, one config each</h3>
<div class="out">A) limit_req_zone $binary_remote_addr ...
   Nam "nguoi dung" khac nhau, tat ca den qua CUNG mot proxy:
     A:200  B:200  C:200  D:429  E:429
     ^ ba nguoi cuoi bi chan vi ho DUNG CHUNG mot khoa

B) limit_req_zone $ip_that ...   (lay tu X-Forwarded-For qua map)
   Cung nam nguoi do:
     1:200  2:200  3:200  4:200  5:200
     ^ ai cung qua — moi nguoi mot khoa rieng. Dung nhu y muon.

C) Cung cau hinh B, nhung mot ke tan cong TU DOI X-Forwarded-For:
     200 200 200 200 200 200 200 200
     ^ TAM tren TAM. Gioi han bi vo hieu HOAN TOAN.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">$binary_remote_addr is the TCP peer, and it cannot be forged</span><span class="lz-d">That makes it the correct key at the edge. It is also four bytes instead of a variable-length string, which is why it exists — <code>\$remote_addr</code> would work identically and use more zone memory for nothing.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Behind a proxy it becomes the proxy's address</span><span class="lz-d">Row A. Every user of a corporate network, a mobile carrier NAT, or your own CDN arrives with the same value, so they share one bucket and the busiest of them exhausts it for everyone else. This is the failure that looks like "our rate limit is too strict" and is actually the wrong key.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Reading X-Forwarded-For directly is worse</span><span class="lz-d">Row C. The header is client input (Lesson 3.2), so an attacker changes it per request and every request gets a fresh bucket. The limit is not weakened — it is gone, and the config still looks like it has one.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The answer is to fix $remote_addr itself</span><span class="lz-d"><code>set_real_ip_from</code> with the addresses of proxies you actually operate, plus <code>real_ip_header X-Forwarded-For</code>. Nginx then rewrites <code>\$remote_addr</code> to the real client, so <code>\$binary_remote_addr</code> is both correct and unforgeable — and every limit keyed on it is too.</span></div>
</div>
<pre><code><span class="tok-comment"># ĐÚNG: sửa chính $remote_addr, rồi khoá theo nó</span>
set_real_ip_from 10.0.0.0/8;          <span class="tok-comment"># CHỈ các proxy do BẠN vận hành</span>
set_real_ip_from 172.16.0.0/12;
real_ip_header   X-Forwarded-For;
real_ip_recursive on;

limit_req_zone \$binary_remote_addr zone=theo-ip:10m rate=10r/s;

<span class="tok-comment"># SAI: đọc thẳng header (dòng C ở trên — giả mạo được)</span>
<span class="tok-comment"># map $http_x_forwarded_for $ip_that { ... }</span>
<span class="tok-comment"># limit_req_zone $ip_that zone=... </span></code></pre>
<div class="callout warn">
<p><strong>And <code>set_real_ip_from</code> must list only proxies you control.</strong> Lesson 3.2 measured what happens when it is too wide: a forged <code>X-Forwarded-For</code> from an address inside the trusted range rewrote <code>\$remote_addr</code> to whatever the client claimed. That puts you back in row C with extra steps. The list should contain the specific addresses or ranges of your CDN and your own load balancers, and nothing else — never <code>0.0.0.0/0</code>, and never a whole private range because "it is internal anyway".</p>
</div>

<h3>Other keys, and when they are the right one</h3>
<div class="out">D) limit_req_zone $uri ...   — moi DUONG DAN mot han muc rieng
     /uri/a x4: 200 200 200 429
     /uri/b x4: 200 200 200 429
     ^ hai duong dan KHONG dung chung han muc</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Key on the API key or user ID for authenticated APIs</span><span class="v"><code>limit_req_zone \$http_x_api_key zone=...</code> gives each customer their own quota regardless of where they connect from. It is only sound if the key is validated somewhere — an unvalidated header is row C again, with a different header name.</span></div>
  <div class="kv"><span class="k">Key on $uri to protect one expensive endpoint from itself</span><span class="v">Row D. Useful when the thing you are protecting is a backend resource rather than a user — a search index, a report generator — and you want a global ceiling on it no matter who asks.</span></div>
  <div class="kv"><span class="k">Key on a subnet to blunt a distributed source</span><span class="v"><code>map \$remote_addr \$mang { "~^(?&lt;a&gt;\\\\d+\\\\.\\\\d+\\\\.\\\\d+)\\\\." \$a; }</code> keys a /24 together. It catches a cloud range hammering you from many addresses, at the cost of grouping genuinely unrelated users on the same subnet.</span></div>
  <div class="kv"><span class="k">An empty key disables the limit for that request</span><span class="v">If the variable evaluates to empty, the limit does not apply. That is the idiom for exempting traffic — <code>map \$http_x_api_key \$gioi_han { default \$binary_remote_addr; "khoa-noi-bo" ""; }</code> — and it is also a way to accidentally exempt everyone if the variable is usually empty.</span></div>
</div>

<h3>Sizing the zone</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">10m holds roughly 160,000 IPv4 keys</span><span class="lz-lnote">Each entry is about 64 bytes on 64-bit. That is plenty for most sites, and cheap enough that guessing high costs nothing — the zone is allocated once at startup, not per request.</span></div>
  <div class="lz-layer"><span class="lz-lname">A full zone evicts old entries and logs it</span><span class="lz-lnote">When there is no room, Nginx removes the least recently used entries; if it cannot, the request is rejected and the error log says so. Seeing that message means the zone is undersized, not that you are under attack.</span></div>
  <div class="lz-layer"><span class="lz-lname">The zone is shared across workers</span><span class="lz-lnote">Which is what makes the limit a real limit — a per-worker counter with four workers would be a limit four times looser than the number you wrote. This is the same shared-memory mechanism as <code>ssl_session_cache</code> and <code>proxy_cache</code>'s keys zone.</span></div>
  <div class="lz-layer"><span class="lz-lname">It is per server, not per cluster</span><span class="lz-lnote">Three Nginx instances behind a load balancer enforce three independent limits, so the effective rate is three times what you configured. If that matters, the limit belongs in a shared store — which is the Redis pattern, not this one.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — a rate limit whose key an attacker can choose is not a rate limit, and it is worse than none, because it looks like protection in the config review.</strong> The three rows above are the whole argument: the same directive with three different keys gave correct behaviour, over-strict behaviour, and no behaviour at all. Before trusting any limit, ask one question about its key — <em>can the client change this value?</em> If the answer is yes and there is no validation behind it, the limit is decorative. Test it the way row C was tested: send eight requests that would exceed the limit, varying only the thing the key is derived from, and count how many get through.</p>
</div>
<div class="note-ct">
<p><strong>The order to set this up in.</strong> First get <code>\$remote_addr</code> right — <code>real_ip</code> configured with your actual proxy addresses, verified by logging it and checking a request from a known client shows the right value. Only then add limits keyed on it. Doing it the other way round produces a config that enforces something, just not what you intended, and the measurements in this lesson are how you find out which.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_zone" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">nginx — limit_req_zone</span><span class="lc-sub">nginx.org · The key expression, zone sizing, and the empty-key rule</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_realip_module.html" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">nginx — the real_ip module</span><span class="lc-sub">nginx.org · The fix for row A that does not create row C</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">MDN — X-Forwarded-For</span><span class="lc-sub">developer.mozilla.org · Why the leftmost entry is attacker-controlled</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">Rate limiting login attempts, and what happens when the key is wrong</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Defeat your own rate limit by rotating a header, then fix it with real_ip</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Khoá giới hạn theo cái gì, và cái khoá giả mạo được</h2>
<p class="lead">Một bộ giới hạn tần suất là MỘT bộ đếm và MỘT cái khoá. Bài 7.1 nói về bộ đếm. Cái KHOÁ mới là chỗ giới hạn thật sự hỏng, và cả hai lựa chọn hiển nhiên đều hỏng — theo hai hướng NGƯỢC nhau, và đo được.</p>

<h3>Ba phép đo, mỗi phép một cấu hình</h3>
<div class="out">A) limit_req_zone $binary_remote_addr ...
   Nam "nguoi dung" khac nhau, tat ca den qua CUNG mot proxy:
     A:200  B:200  C:200  D:429  E:429
     ^ ba nguoi cuoi bi chan vi ho DUNG CHUNG mot khoa

B) limit_req_zone $ip_that ...   (lay tu X-Forwarded-For qua map)
   Cung nam nguoi do:
     1:200  2:200  3:200  4:200  5:200
     ^ ai cung qua — moi nguoi mot khoa rieng. Dung nhu y muon.

C) Cung cau hinh B, nhung mot ke tan cong TU DOI X-Forwarded-For:
     200 200 200 200 200 200 200 200
     ^ TAM tren TAM. Gioi han bi vo hieu HOAN TOAN.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">$binary_remote_addr là địa chỉ TCP đối tác, và nó KHÔNG giả mạo được</span><span class="lz-d">Điều đó làm nó thành cái khoá ĐÚNG ở rìa mạng. Nó cũng là bốn byte thay vì một chuỗi độ dài thay đổi, và đó là lý do nó tồn tại — <code>\$remote_addr</code> chạy y hệt nhưng tốn thêm bộ nhớ vùng mà chẳng được gì.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đứng sau một proxy thì nó thành địa chỉ CỦA PROXY</span><span class="lz-d">Dòng A. Mọi người dùng của một mạng công ty, một NAT của nhà mạng di động, hay của chính CDN nhà bạn đều tới với CÙNG một giá trị, nên họ dùng chung một cái xô và người bận rộn nhất trong số họ vét cạn nó cho mọi người còn lại. Đây là kiểu hỏng trông như "giới hạn của mình chặt quá" mà thật ra là SAI KHOÁ.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đọc thẳng X-Forwarded-For còn tệ hơn</span><span class="lz-d">Dòng C. Cái header đó là ĐẦU VÀO của client (Bài 3.2), nên kẻ tấn công đổi nó ở mỗi request và mỗi request nhận một cái xô mới toanh. Giới hạn không phải bị YẾU đi — nó BIẾN MẤT, mà cấu hình thì vẫn trông như đang có một cái.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Câu trả lời là SỬA chính $remote_addr</span><span class="lz-d"><code>set_real_ip_from</code> với địa chỉ của những proxy bạn THẬT SỰ vận hành, cộng <code>real_ip_header X-Forwarded-For</code>. Nginx khi ấy viết lại <code>\$remote_addr</code> thành client thật, nên <code>\$binary_remote_addr</code> vừa ĐÚNG vừa KHÔNG giả mạo được — và mọi giới hạn khoá theo nó cũng vậy.</span></div>
</div>
<pre><code><span class="tok-comment"># ĐÚNG: sửa chính $remote_addr, rồi khoá theo nó</span>
set_real_ip_from 10.0.0.0/8;          <span class="tok-comment"># CHỈ các proxy do BẠN vận hành</span>
set_real_ip_from 172.16.0.0/12;
real_ip_header   X-Forwarded-For;
real_ip_recursive on;

limit_req_zone \$binary_remote_addr zone=theo-ip:10m rate=10r/s;

<span class="tok-comment"># SAI: đọc thẳng header (dòng C ở trên — giả mạo được)</span>
<span class="tok-comment"># map $http_x_forwarded_for $ip_that { ... }</span>
<span class="tok-comment"># limit_req_zone $ip_that zone=... </span></code></pre>
<div class="callout warn">
<p><strong>Và <code>set_real_ip_from</code> BẮT BUỘC chỉ liệt kê những proxy bạn kiểm soát.</strong> Bài 3.2 đã đo chuyện gì xảy ra khi nó quá rộng: một cái <code>X-Forwarded-For</code> giả mạo tới từ một địa chỉ nằm trong dải được tin đã viết lại <code>\$remote_addr</code> thành bất cứ thứ gì client khai. Thế là bạn quay lại dòng C với vài bước thừa. Cái danh sách ấy nên chứa những địa chỉ hay dải CỤ THỂ của CDN và của các bộ cân bằng tải của chính bạn, và không gì khác — đừng bao giờ <code>0.0.0.0/0</code>, và đừng bao giờ cả một dải nội bộ vì "dù sao cũng là mạng trong nhà".</p>
</div>

<h3>Những cái khoá khác, và khi nào chúng là cái đúng</h3>
<div class="out">D) limit_req_zone $uri ...   — moi DUONG DAN mot han muc rieng
     /uri/a x4: 200 200 200 429
     /uri/b x4: 200 200 200 429
     ^ hai duong dan KHONG dung chung han muc</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoá theo API key hay ID người dùng với API đã xác thực</span><span class="v"><code>limit_req_zone \$http_x_api_key zone=...</code> cho mỗi khách hàng một hạn mức riêng bất kể họ kết nối từ đâu. Nó chỉ ĐÚNG ĐẮN nếu cái khoá ấy được KIỂM ở đâu đó — một header không được kiểm chính là dòng C lần nữa, chỉ đổi tên header.</span></div>
  <div class="kv"><span class="k">Khoá theo $uri để bảo vệ một điểm cuối đắt đỏ khỏi CHÍNH NÓ</span><span class="v">Dòng D. Hữu ích khi thứ bạn đang bảo vệ là một TÀI NGUYÊN backend chứ không phải một người dùng — một chỉ mục tìm kiếm, một bộ sinh báo cáo — và bạn muốn một cái trần TOÀN CỤC cho nó bất kể ai hỏi.</span></div>
  <div class="kv"><span class="k">Khoá theo dải mạng để làm cùn một nguồn phân tán</span><span class="v"><code>map \$remote_addr \$mang { "~^(?&lt;a&gt;\\\\d+\\\\.\\\\d+\\\\.\\\\d+)\\\\." \$a; }</code> gom cả một /24 vào chung một khoá. Nó bắt được một dải máy chủ đám mây đang nện bạn từ nhiều địa chỉ, đổi lại là gom cả những người dùng thật sự không liên quan nằm chung dải.</span></div>
  <div class="kv"><span class="k">Khoá RỖNG là TẮT giới hạn cho request đó</span><span class="v">Nếu biến tính ra rỗng thì giới hạn không áp dụng. Đó là cách viết để MIỄN TRỪ lưu lượng — <code>map \$http_x_api_key \$gioi_han { default \$binary_remote_addr; "khoa-noi-bo" ""; }</code> — và nó cũng là cách để vô tình miễn trừ TẤT CẢ nếu cái biến ấy thường xuyên rỗng.</span></div>
</div>

<h3>Định cỡ cái vùng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">10m chứa được chừng 160.000 khoá IPv4</span><span class="lz-lnote">Mỗi mục tốn khoảng 64 byte trên hệ 64-bit. Thế là dư dả với phần lớn site, và rẻ tới mức đoán cao lên chẳng tốn gì — cái vùng được cấp phát MỘT lần lúc khởi động, không phải theo từng request.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vùng đầy thì nó ĐUỔI mục cũ và ghi log</span><span class="lz-lnote">Khi hết chỗ, Nginx gỡ bỏ những mục ít được dùng gần đây nhất; không gỡ được thì request bị từ chối và error log nói ra. Thấy thông báo đó nghĩa là vùng bị đặt QUÁ NHỎ, chứ không phải bạn đang bị tấn công.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vùng được DÙNG CHUNG giữa các worker</span><span class="lz-lnote">Chính điều đó làm cho giới hạn thành một giới hạn THẬT — một bộ đếm riêng cho từng worker với bốn worker sẽ là một giới hạn LỎNG GẤP BỐN con số bạn viết. Đây vẫn là cơ chế bộ nhớ chung như <code>ssl_session_cache</code> và vùng khoá của <code>proxy_cache</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó theo TỪNG máy chủ, không theo cả cụm</span><span class="lz-lnote">Ba con Nginx đứng sau một bộ cân bằng tải thi hành BA giới hạn độc lập, nên mức thực tế là GẤP BA con số bạn cấu hình. Nếu điều đó có nghĩa lý thì cái giới hạn ấy thuộc về một kho dùng chung — tức là khuôn mẫu Redis, không phải cái này.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một giới hạn mà kẻ tấn công CHỌN được cái khoá thì không phải một giới hạn, và nó TỆ HƠN là không có, vì nó trông như một tuyến phòng thủ trong buổi rà soát cấu hình.</strong> Ba dòng ở trên là toàn bộ lập luận: cùng một chỉ thị với ba cái khoá khác nhau cho ra hành vi ĐÚNG, hành vi QUÁ CHẶT, và KHÔNG hành vi gì cả. Trước khi tin bất kỳ giới hạn nào, hãy hỏi một câu về cái khoá của nó — <em>client có đổi được giá trị này không?</em> Nếu câu trả lời là CÓ mà đằng sau chẳng có phép kiểm nào thì cái giới hạn ấy chỉ để trang trí. Hãy thử nó đúng cách dòng C được thử: gửi tám request đủ để vượt giới hạn, chỉ thay đổi ĐÚNG cái thứ mà khoá sinh ra từ đó, rồi đếm xem bao nhiêu cái lọt qua.</p>
</div>
<div class="note-ct">
<p><strong>Thứ tự để dựng chuyện này.</strong> TRƯỚC HẾT hãy làm cho <code>\$remote_addr</code> đúng — cấu hình <code>real_ip</code> với đúng địa chỉ proxy của bạn, xác minh bằng cách ghi nó vào log rồi kiểm một request từ một client đã biết xem có ra đúng giá trị không. RỒI mới thêm các giới hạn khoá theo nó. Làm ngược lại thì bạn có một cấu hình đang thi hành một thứ gì đó, chỉ là không phải thứ bạn định, và những phép đo trong bài này là cách bạn phát hiện ra mình đang ở ca nào.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_zone" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">nginx — limit_req_zone</span><span class="lc-sub">nginx.org · Biểu thức khoá, cách định cỡ vùng, và luật về khoá rỗng</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_realip_module.html" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">nginx — module real_ip</span><span class="lc-sub">nginx.org · Cách chữa dòng A mà KHÔNG tạo ra dòng C</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">MDN — X-Forwarded-For</span><span class="lc-sub">developer.mozilla.org · Vì sao mục ngoài cùng bên trái do kẻ tấn công điều khiển</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Giới hạn số lần thử đăng nhập, và chuyện gì xảy ra khi cái khoá sai</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Tự vô hiệu hoá giới hạn của chính bạn bằng cách xoay một header, rồi vá bằng real_ip</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — limit_conn, and the attack it does not stop|||7.3 — limit_conn, và cái đòn mà nó KHÔNG chặn được',
      slug: 'nginx-7-3-limit-conn',
      type: 'LESSON',
      description: 'Giới hạn số kết nối đồng thời chạy đúng như quảng cáo: sáu request chậm từ một IP thành hai cái 200 và bốn cái 503. Rồi bài này bắn hai mươi kết nối nhỏ giọt vào đúng cái khối đó — và cả hai mươi đều SỐNG, vì limit_conn không đếm chúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>limit_conn, and the attack it does not stop</h2>
<p class="lead">Rate limiting counts requests over time. A different resource runs out first: the connection slots themselves. <code>limit_conn</code> bounds those per client, works exactly as advertised, and does nothing at all about the one attack people usually deploy it against.</p>

<h3>It works: six slow requests, one IP</h3>
<pre><code>limit_conn_zone \$binary_remote_addr zone=ketnoi:10m;

location /d/ { limit_conn ketnoi 2; proxy_pass http://api; }</code></pre>
<div class="out">6 request DONG THOI toi mot duong dan cham 1,5 giay:

  co limit_conn 2   ->  2 x 200,  4 x 503
  khong gioi han    ->  6 x 200

error.log: limiting connections by zone "ketnoi"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It counts connections currently being processed</span><span class="lz-d">Not requests per second — how many are open and in flight right now for that key. Two is a strict number and it held exactly: the third through sixth were refused while the first two were still working.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It is the right tool for slow endpoints and downloads</span><span class="lz-d">A rate limit does nothing about one client holding twenty simultaneous large downloads, because that is a low request rate. <code>limit_conn</code> is the limit that applies to duration rather than frequency.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Pair it with limit_rate for bandwidth</span><span class="lz-d"><code>limit_rate 500k;</code> caps each connection's throughput, and <code>limit_rate_after 5m;</code> lets small files go at full speed and only throttles the long tail. Together they bound what one client can consume without refusing anyone.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Set it generously — browsers open several</span><span class="lz-d">HTTP/1.1 browsers use up to six connections per origin, so <code>limit_conn 2</code> on a page-serving location would break normal browsing. Ten to twenty is a sane starting point for a site; two is for a download or streaming endpoint.</span></div>
</div>

<h3>And now the attack it does not stop</h3>
<div class="out">20 ket noi mo ra, moi cai gui MOT header moi 0,5 giay, KHONG BAO GIO
gui dong trong ket thuc header (dung khuon mau slowloris):

  client_header_timeout 60s (mac dinh), KHONG co limit_conn
     sau 8s: con song 20, bi dong 0

  client_header_timeout 60s (mac dinh), CO limit_conn 2
     sau 8s: con song 20, bi dong 0        &lt;-- limit_conn KHONG chan

  client_header_timeout 2s
     sau 8s: con song 0, bi dong 20        &lt;-- day moi la thu chan duoc</div>
<div class="pitfall">
<p><strong>Bẫy — <code>limit_conn</code> counts connections that have finished reading their request headers, and a slowloris connection never finishes.</strong> The middle row is the measurement: twenty dribbling connections, a limit of two per IP, and all twenty survived. They are not counted because from Nginx's point of view no request has started yet — they are still in the header-reading phase. So the directive people reach for to stop connection exhaustion is precisely the wrong one for the best-known connection-exhaustion attack. What stops it is <code>client_header_timeout</code>: with it at 2 seconds all twenty were closed. The two directives protect against different things and neither substitutes for the other.</p>
</div>
<pre><code>http {
  <span class="tok-comment"># Chống nhỏ giọt: cắt kết nối chưa gửi xong header/thân</span>
  client_header_timeout 10s;      <span class="tok-comment"># mặc định 60s — quá rộng rãi</span>
  client_body_timeout   10s;
  send_timeout          10s;      <span class="tok-comment"># client đọc phản hồi quá chậm</span>
  keepalive_timeout     30s;

  <span class="tok-comment"># Chống chiếm slot: giới hạn số kết nối ĐANG XỬ LÝ mỗi IP</span>
  limit_conn_zone \$binary_remote_addr zone=ketnoi:10m;
  limit_conn_status 429;

  server {
    limit_conn ketnoi 20;                <span class="tok-comment"># trang thường: rộng rãi</span>
    location /tai-xuong/ {
      limit_conn ketnoi 2;               <span class="tok-comment"># tải file: chặt</span>
      limit_rate_after 5m;
      limit_rate 1m;
    }
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nginx survives slowloris better than most servers anyway</span><span class="v">Its event loop means an idle connection costs a file descriptor and a small buffer, not a thread — which is why the classic attack that killed thread-per-connection servers mostly just wastes descriptors here. The timeouts turn "mostly" into "reliably".</span></div>
  <div class="kv"><span class="k">worker_connections is the real ceiling</span><span class="v">Each idle connection consumes one slot, and when they run out the error log says <code>worker_connections are not enough</code> in those words. That message plus a lot of connections in one state is the signature of this attack.</span></div>
  <div class="kv"><span class="k">Shortening timeouts has a real cost</span><span class="v">A user on a slow mobile connection sending a large form body can legitimately take more than ten seconds. <code>client_body_timeout</code> measures the gap between reads rather than the total (same rule as Lesson 3.4), so it is safer than it looks — but test an upload from a throttled connection before going below ten seconds.</span></div>
  <div class="kv"><span class="k">limit_conn is per Nginx instance, like limit_req</span><span class="v">Three servers behind a load balancer means three times the configured connections. The zone is shared between workers, not between machines.</span></div>
</div>

<h3>What each limit actually defends</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">limit_req — frequency</span><span class="lz-lnote">Stops a script making a thousand fast requests. Does nothing about one slow one. This is the limit that protects your backend's throughput.</span></div>
  <div class="lz-layer"><span class="lz-lname">limit_conn — concurrency</span><span class="lz-lnote">Stops one client holding twenty slots at once with legitimate, fully-formed requests. Does nothing about connections that never complete a request. This protects your connection slots from ordinary hogging.</span></div>
  <div class="lz-layer"><span class="lz-lname">client_*_timeout — duration of incompleteness</span><span class="lz-lnote">Stops connections that are open but not progressing. This is the slowloris defence, and it is the only one of the three that addresses it — measured above, in both directions.</span></div>
  <div class="lz-layer"><span class="lz-lname">client_max_body_size and buffers — size</span><span class="lz-lnote">Stops one request consuming disk or memory out of proportion to its value. Lesson 7.4 measures it; it is the fourth axis and it is independent of all three above.</span></div>
</div>
<div class="note-ct">
<p><strong>The lesson underneath the measurement.</strong> Four directives, four different resources, and no overlap between them — but they all get described as "protecting Nginx", so people set one and assume they are covered. The middle row above is what that assumption looks like when tested: a limit correctly configured, correctly enforcing what it enforces, and completely irrelevant to the attack it was deployed against. Before trusting any limit, write down what resource it counts, then ask whether the thing you are worried about consumes that resource.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">nginx — the limit_conn module</span><span class="lc-sub">nginx.org · Including the sentence about which connections are counted</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#client_header_timeout" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">nginx — client timeouts</span><span class="lc-sub">nginx.org · client_header_timeout, client_body_timeout, send_timeout</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Slowloris_(computer_security)" target="_blank" rel="noopener"><span class="lc-ico">🐌</span><span class="lc-body"><span class="lc-title">Slowloris</span><span class="lc-sub">wikipedia.org · The attack shape reproduced in the measurement above</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">File descriptors, ulimit, and counting sockets by state with ss</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Open twenty dribbling sockets and watch limit_conn ignore every one of them</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>limit_conn, và cái đòn mà nó KHÔNG chặn được</h2>
<p class="lead">Giới hạn tần suất đếm số REQUEST theo thời gian. Có một tài nguyên khác cạn TRƯỚC: chính những cái slot kết nối. <code>limit_conn</code> chặn chúng theo từng client, chạy đúng như quảng cáo, và chẳng làm gì được với đúng cái đòn mà người ta thường triển khai nó để chống.</p>

<h3>Nó CHẠY: sáu request chậm, một IP</h3>
<pre><code>limit_conn_zone \$binary_remote_addr zone=ketnoi:10m;

location /d/ { limit_conn ketnoi 2; proxy_pass http://api; }</code></pre>
<div class="out">6 request DONG THOI toi mot duong dan cham 1,5 giay:

  co limit_conn 2   ->  2 x 200,  4 x 503
  khong gioi han    ->  6 x 200

error.log: limiting connections by zone "ketnoi"</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó đếm những kết nối ĐANG được xử lý</span><span class="lz-d">Không phải request mỗi giây — mà là bao nhiêu cái đang MỞ và đang bay ngay lúc này cho cái khoá đó. Hai là một con số chặt và nó giữ đúng: cái thứ ba tới thứ sáu bị từ chối trong khi hai cái đầu vẫn đang làm việc.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó là công cụ ĐÚNG cho điểm cuối chậm và cho tải file</span><span class="lz-d">Một giới hạn tần suất chẳng làm gì được với MỘT client giữ hai mươi lượt tải file lớn cùng lúc, vì đó là tần suất THẤP. <code>limit_conn</code> là giới hạn áp lên THỜI LƯỢNG chứ không phải lên TẦN SUẤT.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghép nó với limit_rate cho phần băng thông</span><span class="lz-d"><code>limit_rate 500k;</code> chặn thông lượng của TỪNG kết nối, còn <code>limit_rate_after 5m;</code> cho tệp nhỏ đi hết tốc lực và chỉ bóp cái đuôi dài. Đi cùng nhau, chúng chặn được thứ mà MỘT client tiêu thụ mà không từ chối ai cả.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hãy đặt nó RỘNG RÃI — trình duyệt mở nhiều cái</span><span class="lz-d">Trình duyệt HTTP/1.1 dùng tới sáu kết nối cho mỗi gốc, nên <code>limit_conn 2</code> trên một location phục vụ trang sẽ phá việc duyệt web bình thường. Mười tới hai mươi là điểm khởi đầu tỉnh táo cho một site; còn HAI là dành cho điểm cuối tải file hay chảy dần.</span></div>
</div>

<h3>Và giờ tới cái đòn nó KHÔNG chặn</h3>
<div class="out">20 ket noi mo ra, moi cai gui MOT header moi 0,5 giay, KHONG BAO GIO
gui dong trong ket thuc header (dung khuon mau slowloris):

  client_header_timeout 60s (mac dinh), KHONG co limit_conn
     sau 8s: con song 20, bi dong 0

  client_header_timeout 60s (mac dinh), CO limit_conn 2
     sau 8s: con song 20, bi dong 0        &lt;-- limit_conn KHONG chan

  client_header_timeout 2s
     sau 8s: con song 0, bi dong 20        &lt;-- day moi la thu chan duoc</div>
<div class="pitfall">
<p><strong>Bẫy — <code>limit_conn</code> đếm những kết nối ĐÃ ĐỌC XONG header của request, mà một kết nối slowloris thì KHÔNG BAO GIỜ đọc xong.</strong> Dòng giữa chính là phép đo: hai mươi kết nối nhỏ giọt, một giới hạn hai cái mỗi IP, và cả hai mươi đều SỐNG. Chúng không bị đếm vì dưới góc nhìn của Nginx thì CHƯA có request nào bắt đầu cả — chúng vẫn đang ở giai đoạn đọc header. Nên cái chỉ thị người ta với tới để chặn việc vét cạn kết nối lại là cái SAI hoàn toàn cho đòn vét-cạn-kết-nối nổi tiếng nhất. Thứ chặn được nó là <code>client_header_timeout</code>: đặt nó ở 2 giây thì cả hai mươi bị đóng. Hai chỉ thị này bảo vệ hai thứ KHÁC NHAU và không cái nào thay thế được cái nào.</p>
</div>
<pre><code>http {
  <span class="tok-comment"># Chống nhỏ giọt: cắt kết nối chưa gửi xong header/thân</span>
  client_header_timeout 10s;      <span class="tok-comment"># mặc định 60s — quá rộng rãi</span>
  client_body_timeout   10s;
  send_timeout          10s;      <span class="tok-comment"># client đọc phản hồi quá chậm</span>
  keepalive_timeout     30s;

  <span class="tok-comment"># Chống chiếm slot: giới hạn số kết nối ĐANG XỬ LÝ mỗi IP</span>
  limit_conn_zone \$binary_remote_addr zone=ketnoi:10m;
  limit_conn_status 429;

  server {
    limit_conn ketnoi 20;                <span class="tok-comment"># trang thường: rộng rãi</span>
    location /tai-xuong/ {
      limit_conn ketnoi 2;               <span class="tok-comment"># tải file: chặt</span>
      limit_rate_after 5m;
      limit_rate 1m;
    }
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Dù sao Nginx cũng sống sót qua slowloris tốt hơn phần lớn máy chủ khác</span><span class="v">Vòng lặp sự kiện của nó nghĩa là một kết nối đang rảnh tốn MỘT file descriptor và một cái đệm nhỏ, chứ không tốn một luồng — và đó là lý do cái đòn kinh điển từng giết các máy chủ một-luồng-một-kết-nối thì ở đây chủ yếu chỉ phí descriptor. Đám timeout biến chữ "chủ yếu" thành chữ "chắc chắn".</span></div>
  <div class="kv"><span class="k">worker_connections mới là cái trần THẬT</span><span class="v">Mỗi kết nối rảnh ngốn một slot, và khi chúng cạn thì error log nói đúng chữ <code>worker_connections are not enough</code>. Thông báo đó cộng với một đống kết nối cùng nằm ở một trạng thái chính là chữ ký của đòn này.</span></div>
  <div class="kv"><span class="k">Rút ngắn timeout có cái GIÁ thật</span><span class="v">Một người dùng trên mạng di động chậm đang gửi một thân biểu mẫu lớn có thể HỢP LỆ mà mất hơn mười giây. <code>client_body_timeout</code> đo KHOẢNG CÁCH giữa hai lần đọc chứ không đo tổng (vẫn cái luật ở Bài 3.4), nên nó an toàn hơn vẻ ngoài — nhưng hãy thử một lượt tải lên từ một kết nối bị bóp băng thông trước khi hạ xuống dưới mười giây.</span></div>
  <div class="kv"><span class="k">limit_conn tính theo TỪNG con Nginx, y như limit_req</span><span class="v">Ba máy chủ sau một bộ cân bằng tải nghĩa là GẤP BA số kết nối bạn cấu hình. Cái vùng được dùng chung giữa các WORKER, không dùng chung giữa các MÁY.</span></div>
</div>

<h3>Mỗi giới hạn THẬT SỰ bảo vệ cái gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">limit_req — TẦN SUẤT</span><span class="lz-lnote">Chặn một script bắn một nghìn request nhanh. Chẳng làm gì được với MỘT cái chậm. Đây là giới hạn bảo vệ THÔNG LƯỢNG của backend.</span></div>
  <div class="lz-layer"><span class="lz-lname">limit_conn — SỐ CÙNG LÚC</span><span class="lz-lnote">Chặn một client giữ hai mươi slot cùng lúc bằng những request hợp lệ, hoàn chỉnh. Chẳng làm gì được với những kết nối KHÔNG BAO GIỜ hoàn thành một request. Nó bảo vệ đám slot kết nối khỏi việc bị chiếm dụng thông thường.</span></div>
  <div class="lz-layer"><span class="lz-lname">client_*_timeout — THỜI LƯỢNG của sự dang dở</span><span class="lz-lnote">Chặn những kết nối đang mở mà không tiến triển. Đây là tuyến phòng thủ slowloris, và nó là cái DUY NHẤT trong ba cái lo được chuyện đó — đo ở trên, theo cả hai chiều.</span></div>
  <div class="lz-layer"><span class="lz-lname">client_max_body_size và các đệm — KÍCH THƯỚC</span><span class="lz-lnote">Chặn một request ngốn đĩa hay bộ nhớ không tương xứng với giá trị của nó. Bài 7.4 đem nó ra đo; nó là trục thứ TƯ và nó độc lập với cả ba cái trên.</span></div>
</div>
<div class="note-ct">
<p><strong>Bài học nằm dưới phép đo.</strong> Bốn chỉ thị, bốn tài nguyên khác nhau, và KHÔNG cái nào chồng lấn cái nào — nhưng tất cả đều được mô tả là "bảo vệ Nginx", nên người ta đặt MỘT cái rồi cho rằng mình đã được che chắn. Dòng giữa ở trên chính là bộ mặt của giả định đó khi đem ra thử: một giới hạn cấu hình ĐÚNG, thi hành ĐÚNG cái nó thi hành, và HOÀN TOÀN không liên quan tới cái đòn mà nó được triển khai để chống. Trước khi tin bất kỳ giới hạn nào, hãy viết ra nó ĐẾM tài nguyên gì, rồi hỏi xem cái thứ bạn đang lo có tiêu thụ tài nguyên đó không.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">nginx — module limit_conn</span><span class="lc-sub">nginx.org · Kèm cái câu nói rõ những kết nối NÀO được đếm</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#client_header_timeout" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">nginx — các timeout phía client</span><span class="lc-sub">nginx.org · client_header_timeout, client_body_timeout, send_timeout</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Slowloris_(computer_security)" target="_blank" rel="noopener"><span class="lc-ico">🐌</span><span class="lc-body"><span class="lc-title">Slowloris</span><span class="lc-sub">wikipedia.org · Hình dạng cái đòn được dựng lại trong phép đo ở trên</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">File descriptor, ulimit, và đếm socket theo trạng thái bằng ss</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Mở hai mươi socket nhỏ giọt và xem limit_conn phớt lờ từng cái một</span></span></a>
</div>
`,
    },
  ],
};
