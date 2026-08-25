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
<p><strong>Trap — the default rejection status is <code>503</code>, which tells the client the wrong thing.</strong> <code>503 Service Unavailable</code> means "the server is having trouble" — monitoring counts it as an error, well-behaved clients back off as if you are down, and a CDN may treat it as an origin failure. What you meant is <code>429 Too Many Requests</code>: the server is fine, this client asked too often. Set <code>limit_req_status 429;</code> and <code>limit_conn_status 429;</code> in every config that limits anything. It costs one line, it makes your own error dashboards honest, and it lets clients implement the retry behaviour the status is designed to trigger. Adding a <code>Retry-After</code> header alongside it is the difference between a client retrying sensibly and a client retrying immediately forever.</p>
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
<p><strong>Trap — a rate limit whose key an attacker can choose is not a rate limit, and it is worse than none, because it looks like protection in the config review.</strong> The three rows above are the whole argument: the same directive with three different keys gave correct behaviour, over-strict behaviour, and no behaviour at all. Before trusting any limit, ask one question about its key — <em>can the client change this value?</em> If the answer is yes and there is no validation behind it, the limit is decorative. Test it the way row C was tested: send eight requests that would exceed the limit, varying only the thing the key is derived from, and count how many get through.</p>
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
<pre><code>limit_conn_zone \$binary_remote_addr zone=conn:10m;

location /d/ { limit_conn conn 2; proxy_pass http://api; }</code></pre>
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
<p><strong>Trap — <code>limit_conn</code> counts connections that have finished reading their request headers, and a slowloris connection never finishes.</strong> The middle row is the measurement: twenty dribbling connections, a limit of two per IP, and all twenty survived. They are not counted because from Nginx's point of view no request has started yet — they are still in the header-reading phase. So the directive people reach for to stop connection exhaustion is precisely the wrong one for the best-known connection-exhaustion attack. What stops it is <code>client_header_timeout</code>: with it at 2 seconds all twenty were closed. The two directives protect against different things and neither substitutes for the other.</p>
</div>
<pre><code>http {
  <span class="tok-comment"># Chống nhỏ giọt: cắt kết nối chưa gửi xong header/thân</span>
  client_header_timeout 10s;      <span class="tok-comment"># mặc định 60s — quá rộng rãi</span>
  client_body_timeout   10s;
  send_timeout          10s;      <span class="tok-comment"># client đọc phản hồi quá chậm</span>
  keepalive_timeout     30s;

  <span class="tok-comment"># Chống chiếm slot: giới hạn số kết nối ĐANG XỬ LÝ mỗi IP</span>
  limit_conn_zone \$binary_remote_addr zone=conn:10m;
  limit_conn_status 429;

  server {
    limit_conn conn 20;                <span class="tok-comment"># trang thường: rộng rãi</span>
    location /tai-xuong/ {
      limit_conn conn 2;               <span class="tok-comment"># tải file: chặt</span>
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
<pre><code>limit_conn_zone \$binary_remote_addr zone=conn:10m;

location /d/ { limit_conn conn 2; proxy_pass http://api; }</code></pre>
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
  limit_conn_zone \$binary_remote_addr zone=conn:10m;
  limit_conn_status 429;

  server {
    limit_conn conn 20;                <span class="tok-comment"># trang thường: rộng rãi</span>
    location /tai-xuong/ {
      limit_conn conn 2;               <span class="tok-comment"># tải file: chặt</span>
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

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Request size, and the rejection that arrives before the upload|||7.4 — Kích thước request, và cú từ chối tới TRƯỚC lượt tải lên',
      slug: 'nginx-7-4-kich-thuoc-request',
      type: 'LESSON',
      description: 'client_max_body_size trả về 413 sau khi client mới gửi lên ĐÚNG 0 byte — nếu client khai Content-Length. Bỏ cái header đó đi và cùng một request ấy đẩy được 23,7MB lên dây trước khi bị đá. Bài này đo cả hai, và đó là khác biệt giữa một giới hạn bảo vệ băng thông và một giới hạn chỉ bảo vệ đĩa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Request size, and the rejection that arrives before the upload</h2>
<p class="lead">A size limit sounds like the simplest of the four. It has one property worth knowing exactly, because it decides whether the limit is protecting your bandwidth or only your disk — and the answer depends on something the client chooses.</p>

<h3>Three uploads against a 20MB limit</h3>
<div class="out">client_max_body_size 20m;

  25MB, co Content-Length  -> 413, da GUI LEN 0 byte,           mat 0,0006s
  19MB, co Content-Length  -> 200, da gui len 19.000.000 byte,  mat 0,12s
  25MB, chunked (KHONG khai do dai)
                           -> 413, da GUI LEN 23.788.116 byte,  mat 0,17s
                                   ^^^^^^^^^^^^^^^^^^^^^^^^</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">With Content-Length, the rejection is instant</span><span class="lz-d">Nginx reads the request headers, compares the declared length to the limit, and answers <code>413</code> before a single byte of body is accepted. Zero bytes uploaded, under a millisecond. The client's own upload is cancelled by the response.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">With chunked encoding it cannot know in advance</span><span class="lz-d">There is no declared length, so Nginx reads until the running total crosses the limit and only then rejects. Nearly 24MB had already crossed the network. The limit still holds — nothing oversized reaches your application — but the bandwidth was spent.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">So the limit protects the backend always, and bandwidth usually</span><span class="lz-d">Which is the right way to think about it. An attacker who wants to waste your transfer costs simply omits <code>Content-Length</code>. If that matters, the defence is upstream of Nginx — a CDN or firewall rule — not this directive.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The default is 1MB, and it is the wrong default for uploads</span><span class="lz-d"><code>client_max_body_size 1m;</code> is what you get if you say nothing, and it produces a <code>413</code> on the first photo somebody uploads. It is also the right default for an API that only receives JSON, so this is a per-location decision rather than a global one.</span></div>
</div>
<pre><code>http {
  client_max_body_size 1m;              <span class="tok-comment"># mặc định chặt cho toàn site</span>

  server {
    location /api/ { }                  <span class="tok-comment"># JSON: 1MB là quá đủ</span>

    location /tai-len/ {
      client_max_body_size 50m;         <span class="tok-comment"># CHỈ ở đây mới nới</span>
      client_body_buffer_size 128k;     <span class="tok-comment"># lớn hơn thì tràn ra đĩa</span>
      proxy_request_buffering on;       <span class="tok-comment"># đọc XONG rồi mới gọi backend</span>
      proxy_pass http://api;
    }
  }
}</code></pre>
<div class="pitfall">
<p><strong>Trap — a <code>413</code> from Nginx never reaches your application, so it never appears in your application's logs and your error tracking will not know it happened.</strong> The user sees an upload fail; your dashboard shows nothing; the backend was never called. It looks like a client-side bug and it is a one-line config difference. Two habits fix it: log <code>\$status</code> at the Nginx level into whatever aggregates your errors, so a spike of <code>413</code> is visible; and return a body the frontend can recognise — <code>error_page 413 = @qua-lon;</code> with a named location returning JSON means your upload UI can say "file too large" instead of "something went wrong". The default <code>413</code> is an HTML page, which a JSON client cannot parse and will report as a parsing error.</p>
</div>

<h3>The buffers behind it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">client_body_buffer_size decides memory versus disk</span><span class="v">Bodies up to this size stay in memory; larger ones are written to <code>client_body_temp_path</code>. The default is two pages — 8 or 16KB — so most file uploads go through the disk. Raising it trades memory per concurrent upload for fewer writes, and the multiplication matters: 100 concurrent uploads at 1MB of buffer is 100MB.</span></div>
  <div class="kv"><span class="k">proxy_request_buffering on protects the backend</span><span class="v">The default. Nginx reads the whole body before opening the upstream connection, so a slow uploader never holds a backend worker — the mirror image of <code>proxy_buffering</code> for responses (Lesson 3.3). Turning it off is for streaming uploads, and it hands the slow-client problem straight to your application.</span></div>
  <div class="kv"><span class="k">large_client_header_buffers is a separate limit</span><span class="v">Headers, not body. The default is four buffers of 8KB, and a request exceeding it gets <code>414</code> or <code>400</code>. The usual cause is an enormous cookie or a very long URL, and the error log says <code>too big header</code> or <code>too long URI</code> in those words.</span></div>
  <div class="kv"><span class="k">The upload limit lives in two places</span><span class="v">Nginx and your application framework both have one, and the smaller wins. A <code>413</code> that persists after raising <code>client_max_body_size</code> is usually the framework's limit — Express, Nest and Multer all have their own default, and it is usually 100KB or 1MB.</span></div>
</div>

<h3>Sizing it for a real site</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Start from what you actually accept</span><span class="lz-lnote">A photo from a modern phone is 3 to 12MB; a video is anything. Pick the number from the largest file you intend to support, add a margin, and enforce the real rule in the application where you can give a good error message.</span></div>
  <div class="lz-layer"><span class="lz-lname">Put the generous limit on one location only</span><span class="lz-lnote">If <code>50m</code> is at <code>http</code> level, every endpoint accepts 50MB — including the login form, which now lets one request occupy 50MB of disk before authentication has happened. Scope it to the upload route.</span></div>
  <div class="lz-layer"><span class="lz-lname">Combine it with limit_conn on the same location</span><span class="lz-lnote">A large limit plus no connection limit means one client can start twenty 50MB uploads at once. The two directives together bound the total — this is the pairing Lesson 7.3 was pointing at.</span></div>
  <div class="lz-layer"><span class="lz-lname">Check the disk the temp path is on</span><span class="lz-lnote"><code>client_body_temp_path</code> defaults to a directory under the Nginx prefix, which on many systems is the same disk as everything else. Concurrent large uploads can fill it, and a full disk takes down more than uploads.</span></div>
</div>
<div class="note-ct">
<p><strong>The measurement worth repeating on your own server.</strong> Send one request that exceeds your limit with <code>Content-Length</code>, and one without it, and compare <code>%{size_upload}</code>. The first should be zero. If both transfer the whole body, something between you and Nginx is buffering the request — a CDN, a load balancer — and your size limit is not saving the bandwidth you think it is.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">nginx — client_max_body_size and the body buffers</span><span class="lc-sub">nginx.org · Including the note about when 413 is returned</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering" target="_blank" rel="noopener"><span class="lc-ico">📥</span><span class="lc-body"><span class="lc-title">nginx — proxy_request_buffering</span><span class="lc-sub">nginx.org · The upload-side mirror of response buffering</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">MDN — Transfer-Encoding: chunked</span><span class="lc-sub">developer.mozilla.org · Why there is no Content-Length to check against</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">The framework's own body limit, and why raising Nginx's alone does not help</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Send an oversized upload with and without Content-Length and compare the bytes sent</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Kích thước request, và cú từ chối tới TRƯỚC lượt tải lên</h2>
<p class="lead">Một giới hạn kích thước nghe như cái đơn giản nhất trong bốn cái. Nó có MỘT tính chất đáng biết cho chính xác, vì tính chất đó quyết định giới hạn ấy đang bảo vệ BĂNG THÔNG của bạn hay chỉ bảo vệ cái ĐĨA — và câu trả lời tuỳ vào một thứ do CLIENT chọn.</p>

<h3>Ba lượt tải lên với trần 20MB</h3>
<div class="out">client_max_body_size 20m;

  25MB, co Content-Length  -> 413, da GUI LEN 0 byte,           mat 0,0006s
  19MB, co Content-Length  -> 200, da gui len 19.000.000 byte,  mat 0,12s
  25MB, chunked (KHONG khai do dai)
                           -> 413, da GUI LEN 23.788.116 byte,  mat 0,17s
                                   ^^^^^^^^^^^^^^^^^^^^^^^^</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Có Content-Length thì cú từ chối là TỨC THÌ</span><span class="lz-d">Nginx đọc header của request, so cái độ dài đã khai với cái trần, rồi đáp <code>413</code> TRƯỚC khi nhận lấy một byte thân nào. Không byte nào được tải lên, chưa tới một mili giây. Lượt tải lên của chính client bị chính cái phản hồi ấy huỷ.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Với mã hoá chunked thì nó KHÔNG biết trước được</span><span class="lz-d">Không có độ dài nào được khai, nên Nginx đọc cho tới khi tổng đang chạy vượt trần rồi mới từ chối. Gần 24MB đã kịp băng qua mạng. Cái giới hạn vẫn ĐỨNG — không có gì quá cỡ tới được ứng dụng của bạn — nhưng băng thông thì đã tiêu.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nên giới hạn này LUÔN bảo vệ backend, còn băng thông thì THƯỜNG THƯỜNG</span><span class="lz-d">Đó là cách nghĩ đúng về nó. Một kẻ tấn công muốn đốt phí truyền dữ liệu của bạn chỉ việc BỎ <code>Content-Length</code> đi. Nếu điều đó có nghĩa lý thì tuyến phòng thủ nằm ở TRƯỚC Nginx — một CDN hay một luật tường lửa — chứ không phải ở chỉ thị này.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Mặc định là 1MB, và đó là mặc định SAI cho việc tải file</span><span class="lz-d"><code>client_max_body_size 1m;</code> là thứ bạn nhận nếu không nói gì, và nó sinh ra một cú <code>413</code> ngay tấm ảnh đầu tiên ai đó tải lên. Nó cũng là mặc định ĐÚNG cho một API chỉ nhận JSON, nên đây là quyết định theo TỪNG location chứ không phải toàn cục.</span></div>
</div>
<pre><code>http {
  client_max_body_size 1m;              <span class="tok-comment"># mặc định chặt cho toàn site</span>

  server {
    location /api/ { }                  <span class="tok-comment"># JSON: 1MB là quá đủ</span>

    location /tai-len/ {
      client_max_body_size 50m;         <span class="tok-comment"># CHỈ ở đây mới nới</span>
      client_body_buffer_size 128k;     <span class="tok-comment"># lớn hơn thì tràn ra đĩa</span>
      proxy_request_buffering on;       <span class="tok-comment"># đọc XONG rồi mới gọi backend</span>
      proxy_pass http://api;
    }
  }
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — một cú <code>413</code> do Nginx trả thì KHÔNG BAO GIỜ tới được ứng dụng của bạn, nên nó không xuất hiện trong log của ứng dụng và hệ theo dõi lỗi của bạn cũng chẳng biết là nó đã xảy ra.</strong> Người dùng thấy lượt tải lên thất bại; bảng điều khiển của bạn chẳng hiện gì; backend chưa từng bị gọi. Nó trông như một con lỗi ở phía client và nó là một khác biệt cấu hình MỘT dòng. Hai thói quen chữa được: hãy ghi <code>\$status</code> ở tầng Nginx vào bất cứ thứ gì đang gom lỗi của bạn, để một chùm <code>413</code> hiện ra được; và trả về một cái THÂN mà frontend nhận ra được — <code>error_page 413 = @qua-lon;</code> với một named location trả về JSON nghĩa là giao diện tải file của bạn nói được "tệp quá lớn" thay vì "có gì đó sai sai". Cú <code>413</code> mặc định là một trang HTML, thứ mà một client JSON không phân tích nổi và sẽ báo là lỗi phân tích cú pháp.</p>
</div>

<h3>Đám đệm đứng sau nó</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">client_body_buffer_size quyết định BỘ NHỚ hay ĐĨA</span><span class="v">Thân nhỏ hơn cỡ này thì nằm trong bộ nhớ; lớn hơn thì được ghi ra <code>client_body_temp_path</code>. Mặc định là hai trang bộ nhớ — 8 hoặc 16KB — nên phần lớn lượt tải file đều đi qua đĩa. Nâng nó lên là đổi bộ nhớ theo TỪNG lượt tải đồng thời lấy ít lượt ghi hơn, và phép nhân rất quan trọng: 100 lượt tải đồng thời với đệm 1MB là 100MB.</span></div>
  <div class="kv"><span class="k">proxy_request_buffering on bảo vệ backend</span><span class="v">Đây là mặc định. Nginx đọc TRỌN cái thân rồi mới mở kết nối lên upstream, nên một người tải lên chậm KHÔNG BAO GIỜ giữ một worker của backend — đúng hình ảnh soi gương của <code>proxy_buffering</code> ở phía phản hồi (Bài 3.3). Tắt nó đi là dành cho tải lên dạng chảy dần, và nó ném thẳng bài toán client-chậm sang cho ứng dụng của bạn.</span></div>
  <div class="kv"><span class="k">large_client_header_buffers là một giới hạn RIÊNG</span><span class="v">Cho HEADER, không phải cho thân. Mặc định là bốn cái đệm 8KB, và một request vượt qua đó nhận <code>414</code> hoặc <code>400</code>. Nguyên nhân thường gặp là một cái cookie khổng lồ hay một cái URL rất dài, và error log nói đúng chữ <code>too big header</code> hoặc <code>too long URI</code>.</span></div>
  <div class="kv"><span class="k">Giới hạn tải lên nằm ở HAI chỗ</span><span class="v">Nginx và framework của ứng dụng đều có một cái, và cái NHỎ hơn thắng. Một cú <code>413</code> vẫn còn sau khi bạn đã nâng <code>client_max_body_size</code> thì thường là giới hạn của framework — Express, Nest và Multer đều có mặc định riêng, và nó thường là 100KB hoặc 1MB.</span></div>
</div>

<h3>Định cỡ nó cho một site thật</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hãy xuất phát từ thứ bạn THẬT SỰ nhận</span><span class="lz-lnote">Một tấm ảnh từ điện thoại hiện đại là 3 tới 12MB; một cái video thì bao nhiêu cũng có. Hãy chọn con số theo tệp LỚN NHẤT bạn định hỗ trợ, cộng một khoảng dư, rồi thi hành cái luật THẬT ở trong ứng dụng nơi bạn báo lỗi tử tế được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đặt cái trần rộng rãi vào ĐÚNG MỘT location</span><span class="lz-lnote">Nếu <code>50m</code> nằm ở tầng <code>http</code> thì MỌI điểm cuối đều nhận 50MB — kể cả cái biểu mẫu đăng nhập, thứ mà giờ cho phép một request chiếm 50MB đĩa TRƯỚC KHI có bất kỳ phép xác thực nào. Hãy khoanh nó vào đúng tuyến tải file.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghép nó với limit_conn trên cùng location đó</span><span class="lz-lnote">Một cái trần lớn cộng không có giới hạn kết nối nghĩa là MỘT client mở được hai mươi lượt tải 50MB cùng lúc. Hai chỉ thị đi cùng nhau mới chặn được tổng — đó chính là cặp mà Bài 7.3 đang chỉ tới.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy kiểm cái ĐĨA mà đường tạm nằm trên đó</span><span class="lz-lnote"><code>client_body_temp_path</code> mặc định là một thư mục nằm dưới tiền tố cài Nginx, mà trên nhiều hệ thống thì đó cũng là cái đĩa chứa mọi thứ khác. Nhiều lượt tải lớn đồng thời có thể làm đầy nó, và một cái đĩa đầy thì hạ gục nhiều thứ hơn là chỉ mỗi việc tải file.</span></div>
</div>
<div class="note-ct">
<p><strong>Phép đo đáng lặp lại trên máy chủ của bạn.</strong> Gửi một request vượt trần CÓ <code>Content-Length</code>, và một cái KHÔNG có, rồi so <code>%{size_upload}</code>. Cái đầu tiên PHẢI bằng không. Nếu cả hai đều đẩy trọn cái thân đi thì có thứ gì đó nằm giữa bạn và Nginx đang đệm cái request — một CDN, một bộ cân bằng tải — và cái giới hạn kích thước của bạn không tiết kiệm được lượng băng thông mà bạn tưởng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">nginx — client_max_body_size và các đệm thân</span><span class="lc-sub">nginx.org · Kèm ghi chú về việc khi nào 413 được trả về</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering" target="_blank" rel="noopener"><span class="lc-ico">📥</span><span class="lc-body"><span class="lc-title">nginx — proxy_request_buffering</span><span class="lc-sub">nginx.org · Ảnh soi gương phía tải-lên của việc đệm phản hồi</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">MDN — Transfer-Encoding: chunked</span><span class="lc-sub">developer.mozilla.org · Vì sao không có Content-Length nào để đem ra so</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Giới hạn thân của chính framework, và vì sao chỉ nâng của Nginx thì không đủ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Gửi một lượt tải quá cỡ có và không có Content-Length rồi so số byte đã gửi</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — A protection layer, assembled and measured|||7.5 — Một lớp phòng thủ, ráp lại và đem đo',
      slug: 'nginx-7-5-lop-phong-thu',
      type: 'LESSON',
      description: 'Ghép cả bốn trục thành một cấu hình cho một API thật rồi đo từng tuyến. Kết quả đúng như thiết kế ở bốn dòng, và ở dòng thứ năm thì một lượt tải file hợp lệ ăn 429 — vì nó dùng CHUNG vùng với API, một chi tiết chỉ lộ ra khi đem đo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>A protection layer, assembled and measured</h2>
<p class="lead">Four axes, four lessons, and the only way to know they work together is to build the thing and probe it. This is that config, and one of the probes found a real interaction that reading the file would not have shown.</p>

<h3>The config</h3>
<pre><code>http {
  <span class="tok-comment"># 1) DANH TÍNH — sửa $remote_addr TRƯỚC, rồi mọi giới hạn mới đúng (7.2)</span>
  set_real_ip_from 10.0.0.0/8;      <span class="tok-comment"># CHỈ proxy của bạn</span>
  real_ip_header    X-Forwarded-For;
  real_ip_recursive on;

  <span class="tok-comment"># 2) VÙNG — mỗi mục đích một vùng riêng</span>
  limit_req_zone  \$binary_remote_addr zone=chung:10m     rate=20r/s;
  limit_req_zone  \$binary_remote_addr zone=login:10m  rate=10r/m;
  limit_req_zone  \$binary_remote_addr zone=upload:10m    rate=2r/s;
  limit_conn_zone \$binary_remote_addr zone=ket:10m;

  <span class="tok-comment"># 3) MÃ TRẢ VỀ đúng nghĩa (7.1)</span>
  limit_req_status  429;
  limit_conn_status 429;

  <span class="tok-comment"># 4) THỜI GIAN — chống nhỏ giọt (7.3)</span>
  client_header_timeout 10s;
  client_body_timeout   10s;
  send_timeout          10s;
  keepalive_timeout     30s;

  <span class="tok-comment"># 5) KÍCH THƯỚC — chặt ở mặc định, nới đúng chỗ cần (7.4)</span>
  client_max_body_size 1m;

  server {
    limit_conn ket 20;                        <span class="tok-comment"># trần chung cho mỗi IP</span>

    location /api/dang-nhap {
      limit_req zone=login burst=3 nodelay;
      add_header Retry-After 6 always;
      proxy_pass http://api;
    }
    location /api/ {
      limit_req zone=chung burst=40 nodelay;  <span class="tok-comment"># cho cả trang nạp qua</span>
      proxy_pass http://api;
    }
    location /tai-len/ {
      limit_req zone=upload burst=5;          <span class="tok-comment"># VÙNG RIÊNG — xem bên dưới</span>
      limit_conn ket 2;
      client_max_body_size 50m;
      proxy_pass http://api;
    }
  }
}</code></pre>

<h3>Every route, probed</h3>
<div class="out">/api/ (20r/s, burst 40 nodelay), ban 50 request nhanh
   -> 200: 48   429: 2

/api/dang-nhap (10r/phut, burst 3 nodelay), ban 8 request
   -> 200 200 200 200 429 429 429 429
      Retry-After: 6

/tai-len/ voi than 2MB (tran 50m)   -> 200
/tai-len/ voi than 60MB             -> 413, da GUI LEN 0 byte
/api/ voi than 2MB (tran 1m)        -> 413</div>
<div class="callout ok">
<p><strong>Four of the five are exactly what the config says.</strong> The general API absorbs a fifty-request page load and only trims the tail. The login route allows four attempts and then refuses with a <code>Retry-After</code> the client can act on. The upload route accepts a real file and rejects an absurd one before a byte of it leaves the client. And the same absurd file sent to the API route is rejected by the tighter default, because the generous limit is scoped to one location rather than sitting at <code>http</code> level.</p>
</div>

<h3>And the row that was not</h3>
<div class="out">Ban 45 request vao /api/, roi NGAY LAP TUC mot lan tai len 2MB:

   /tai-len/  ->  429        &lt;-- mot luot tai len HOP LE bi tu choi
   error.log: limiting requests, excess: 39.420 by zone "chung",
              request: "POST /tai-len/x"

Nghi 3 giay cho xo rot lai, roi gui LAI dung request do:
   /tai-len/  ->  200</div>
<div class="pitfall">
<p><strong>Trap — two locations that name the same <code>limit_req</code> zone share one bucket, so traffic to one can exhaust the other.</strong> The first version of the config above used <code>zone=chung</code> in both <code>/api/</code> and <code>/tai-len/</code>, and the error log names it: a <code>POST</code> to the upload route rejected "by zone chung" with an excess accumulated entirely by API calls. In production that is a user whose upload fails because the page they were on made a lot of API requests — a bug report that will be filed as "uploads are flaky" and will not reproduce when tested alone. The fix is one word: a separate zone per purpose, as the config now shows. The general rule is that a zone is a shared budget, so two things should only share one when you actively want them to compete.</p>
</div>

<h3>Two other things the probes showed</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The body spill is visible in the error log</span><span class="v"><code>a client request body is buffered to a temporary file /tmp/.../0000000002</code> at <code>warn</code> level. That message names the file <code>client_body_buffer_size</code> was too small for, and a lot of them means the buffer is undersized for what you actually receive — Lesson 7.4's setting, with a signal to tune it by.</span></div>
  <div class="kv"><span class="k">An upstream that answers without reading the body breaks the upload</span><span class="v">One probe returned <code>502</code> with <code>writev() failed (32: Broken pipe) while sending request to upstream</code>. That was the test upstream replying and closing before Nginx finished sending 2MB — an artefact of a three-line handler, and also a real pattern: a backend that rejects a request early must still drain the body or the proxy sees a broken pipe.</span></div>
  <div class="kv"><span class="k">limit_conn at server level and location level both apply</span><span class="v">The upload route has <code>limit_conn ket 2</code> and inherits nothing — it replaces, per the array rule from Lesson 2.3. The <code>server</code>-level <code>limit_conn ket 20</code> does not stack with it; the location's own directive is the one in force.</span></div>
  <div class="kv"><span class="k">Every limit here is per Nginx instance</span><span class="v">Three servers behind a load balancer enforce three copies of each number. If the limit exists to protect a shared backend, divide the configured value by the number of instances, or move the limit to something both instances can see.</span></div>
</div>

<h3>What this layer does not do</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It does not stop a distributed attack</span><span class="lz-lnote">Every limit here is per client key. Ten thousand addresses each making one request per second are, individually, all within every limit. That is what a CDN or a scrubbing service is for, and no amount of Nginx configuration substitutes for it.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not know what a request means</span><span class="lz-lnote">Nginx cannot tell a login attempt that succeeded from one that failed, so "five failed logins then lock the account" belongs in the application. The proxy limit is a blunt ceiling underneath that, not a replacement for it.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not protect what it does not see</span><span class="lz-lnote">A backend reachable on its own port bypasses all of this. Bind application servers to localhost or a private network, and check with <code>ss -ltn</code> that nothing is listening on a public interface — the strongest limit is irrelevant if there is a way around it.</span></div>
  <div class="lz-layer"><span class="lz-lname">It is not finished until you have tested it</span><span class="lz-lnote">Five probes found four correct behaviours and one wrong one. That ratio is normal, and it is the argument for probing rather than reviewing — the shared-zone bug was fully visible in the config and nobody reading it would have noticed.</span></div>
</div>
<div class="note-ct">
<p><strong>The order to build this in.</strong> Identity first (<code>real_ip</code>), because every limit keyed on the wrong address is wrong in a way that looks like it is working. Then sizes and timeouts, which have no downside and no tuning. Then rate limits, one zone per purpose, with numbers taken from your own access log. Then probe every route — including the failures — and read the error log while you do it, because it names the zone, the excess and the file in words you can act on.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_limit_req_module.html" target="_blank" rel="noopener"><span class="lc-ico">🚦</span><span class="lc-body"><span class="lc-title">nginx — limit_req and limit_conn</span><span class="lc-sub">nginx.org · The two modules the whole layer is built from</span></span></a>
<a class="link-card" href="https://blog.nginx.org/blog/rate-limiting-nginx" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">nginx blog — Rate limiting with NGINX</span><span class="lc-sub">blog.nginx.org · The reference article, with the burst diagrams</span></span></a>
<a class="link-card" href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP Top Ten</span><span class="lc-sub">owasp.org · Where a proxy limit helps and where it is the wrong layer entirely</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">Account lockout and credential stuffing, which belong above this layer</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Build the layer, then make an upload fail by hammering an unrelated endpoint</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Một lớp phòng thủ, ráp lại và đem đo</h2>
<p class="lead">Bốn trục, bốn bài, và cách DUY NHẤT để biết chúng hợp tác được với nhau là dựng cái đó lên rồi đem dò. Đây là cấu hình ấy, và một trong những phép dò đã tìm ra một tương tác CÓ THẬT mà đọc file thì không thấy.</p>

<h3>Cấu hình</h3>
<pre><code>http {
  <span class="tok-comment"># 1) DANH TÍNH — sửa $remote_addr TRƯỚC, rồi mọi giới hạn mới đúng (7.2)</span>
  set_real_ip_from 10.0.0.0/8;      <span class="tok-comment"># CHỈ proxy của bạn</span>
  real_ip_header    X-Forwarded-For;
  real_ip_recursive on;

  <span class="tok-comment"># 2) VÙNG — mỗi mục đích một vùng riêng</span>
  limit_req_zone  \$binary_remote_addr zone=chung:10m     rate=20r/s;
  limit_req_zone  \$binary_remote_addr zone=login:10m  rate=10r/m;
  limit_req_zone  \$binary_remote_addr zone=upload:10m    rate=2r/s;
  limit_conn_zone \$binary_remote_addr zone=ket:10m;

  <span class="tok-comment"># 3) MÃ TRẢ VỀ đúng nghĩa (7.1)</span>
  limit_req_status  429;
  limit_conn_status 429;

  <span class="tok-comment"># 4) THỜI GIAN — chống nhỏ giọt (7.3)</span>
  client_header_timeout 10s;
  client_body_timeout   10s;
  send_timeout          10s;
  keepalive_timeout     30s;

  <span class="tok-comment"># 5) KÍCH THƯỚC — chặt ở mặc định, nới đúng chỗ cần (7.4)</span>
  client_max_body_size 1m;

  server {
    limit_conn ket 20;                        <span class="tok-comment"># trần chung cho mỗi IP</span>

    location /api/dang-nhap {
      limit_req zone=login burst=3 nodelay;
      add_header Retry-After 6 always;
      proxy_pass http://api;
    }
    location /api/ {
      limit_req zone=chung burst=40 nodelay;  <span class="tok-comment"># cho cả trang nạp qua</span>
      proxy_pass http://api;
    }
    location /tai-len/ {
      limit_req zone=upload burst=5;          <span class="tok-comment"># VÙNG RIÊNG — xem bên dưới</span>
      limit_conn ket 2;
      client_max_body_size 50m;
      proxy_pass http://api;
    }
  }
}</code></pre>

<h3>Từng tuyến, đem dò</h3>
<div class="out">/api/ (20r/s, burst 40 nodelay), ban 50 request nhanh
   -> 200: 48   429: 2

/api/dang-nhap (10r/phut, burst 3 nodelay), ban 8 request
   -> 200 200 200 200 429 429 429 429
      Retry-After: 6

/tai-len/ voi than 2MB (tran 50m)   -> 200
/tai-len/ voi than 60MB             -> 413, da GUI LEN 0 byte
/api/ voi than 2MB (tran 1m)        -> 413</div>
<div class="callout ok">
<p><strong>Bốn trên năm dòng đúng CHÍNH XÁC như cấu hình nói.</strong> Cái API chung nuốt trọn một lượt nạp trang năm mươi request và chỉ tỉa mất cái đuôi. Tuyến đăng nhập cho phép bốn lần thử rồi từ chối kèm một cái <code>Retry-After</code> mà client hành động theo được. Tuyến tải file nhận một tệp thật và đá một tệp phi lý TRƯỚC KHI có byte nào của nó rời khỏi client. Và đúng cái tệp phi lý ấy gửi vào tuyến API thì bị đá bởi cái mặc định chặt hơn, vì cái trần rộng rãi được KHOANH vào một location chứ không nằm ở tầng <code>http</code>.</p>
</div>

<h3>Và cái dòng KHÔNG đúng</h3>
<div class="out">Ban 45 request vao /api/, roi NGAY LAP TUC mot lan tai len 2MB:

   /tai-len/  ->  429        &lt;-- mot luot tai len HOP LE bi tu choi
   error.log: limiting requests, excess: 39.420 by zone "chung",
              request: "POST /tai-len/x"

Nghi 3 giay cho xo rot lai, roi gui LAI dung request do:
   /tai-len/  ->  200</div>
<div class="pitfall">
<p><strong>Bẫy — hai location cùng gọi tên MỘT vùng <code>limit_req</code> thì dùng CHUNG một cái xô, nên lưu lượng vào cái này có thể vét cạn cái kia.</strong> Bản đầu của cấu hình trên dùng <code>zone=chung</code> ở CẢ <code>/api/</code> lẫn <code>/tai-len/</code>, và error log gọi tên nó ra: một cú <code>POST</code> lên tuyến tải file bị từ chối "by zone chung" với phần vượt do TOÀN BỘ các lượt gọi API tích lại. Ngoài production thì đó là một người dùng có lượt tải file thất bại vì cái trang họ đang mở vừa gọi nhiều API — một báo cáo lỗi sẽ được ghi là "tải file phập phù" và sẽ KHÔNG tái hiện được khi đem thử riêng. Cách chữa là MỘT chữ: mỗi mục đích một vùng riêng, đúng như cấu hình giờ đang viết. Luật tổng quát là một VÙNG là một NGÂN SÁCH DÙNG CHUNG, nên hai thứ chỉ nên chia nhau một vùng khi bạn CHỦ ĐỘNG muốn chúng cạnh tranh nhau.</p>
</div>

<h3>Hai thứ nữa mà các phép dò cho thấy</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Việc thân tràn ra đĩa HIỆN RA trong error log</span><span class="v"><code>a client request body is buffered to a temporary file /tmp/.../0000000002</code> ở mức <code>warn</code>. Thông báo đó gọi tên đúng cái tệp mà <code>client_body_buffer_size</code> quá nhỏ để chứa, và thấy nhiều dòng như thế nghĩa là cái đệm đang bị đặt nhỏ hơn thứ bạn thật sự nhận — thiết lập ở Bài 7.4, kèm một tín hiệu để chỉnh theo.</span></div>
  <div class="kv"><span class="k">Một upstream trả lời mà KHÔNG đọc thân sẽ phá lượt tải lên</span><span class="v">Một phép dò trả về <code>502</code> kèm <code>writev() failed (32: Broken pipe) while sending request to upstream</code>. Đó là cái upstream thử nghiệm trả lời rồi đóng TRƯỚC khi Nginx gửi xong 2MB — một hệ quả của cái handler ba dòng, và cũng là một khuôn mẫu CÓ THẬT: một backend từ chối request sớm thì vẫn PHẢI hút cạn cái thân, không thì con proxy nhìn thấy một ống nước bị vỡ.</span></div>
  <div class="kv"><span class="k">limit_conn ở tầng server và ở tầng location KHÔNG cộng dồn</span><span class="v">Tuyến tải file có <code>limit_conn ket 2</code> và nó KHÔNG thừa hưởng gì — nó THAY THẾ, theo đúng luật mảng ở Bài 2.3. Cái <code>limit_conn ket 20</code> ở tầng <code>server</code> không chồng lên nó; chỉ thị của chính location mới là cái đang có hiệu lực.</span></div>
  <div class="kv"><span class="k">MỌI giới hạn ở đây đều tính theo TỪNG con Nginx</span><span class="v">Ba máy chủ sau một bộ cân bằng tải thi hành BA bản của mỗi con số. Nếu cái giới hạn ấy tồn tại để bảo vệ một backend DÙNG CHUNG thì hãy chia giá trị cấu hình cho số máy, hoặc chuyển giới hạn sang một thứ mà cả hai máy cùng nhìn thấy.</span></div>
</div>

<h3>Lớp này KHÔNG làm được gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG chặn được một đòn phân tán</span><span class="lz-lnote">Mọi giới hạn ở đây đều theo từng KHOÁ client. Mười nghìn địa chỉ mỗi cái gửi một request mỗi giây thì XÉT RIÊNG đều nằm trong mọi giới hạn. Đó là việc của một CDN hay một dịch vụ lọc rửa, và không lượng cấu hình Nginx nào thay thế được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG biết một request CÓ NGHĨA gì</span><span class="lz-lnote">Nginx không phân biệt nổi một lần đăng nhập THÀNH CÔNG với một lần THẤT BẠI, nên "năm lần sai thì khoá tài khoản" thuộc về ứng dụng. Giới hạn ở proxy là một cái trần THÔ nằm dưới đó, không phải một thứ thay thế nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG bảo vệ thứ nó KHÔNG nhìn thấy</span><span class="lz-lnote">Một backend chạm tới được qua chính cổng của nó thì đi vòng qua hết mọi thứ ở đây. Hãy buộc các máy chủ ứng dụng vào localhost hay một mạng riêng, và dùng <code>ss -ltn</code> kiểm xem không có gì đang nghe trên một giao diện công khai — cái giới hạn mạnh nhất cũng vô nghĩa nếu có một lối đi vòng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó CHƯA XONG cho tới khi bạn đem THỬ</span><span class="lz-lnote">Năm phép dò tìm ra bốn hành vi đúng và một hành vi sai. Tỷ lệ đó là BÌNH THƯỜNG, và nó là lý lẽ cho việc ĐEM DÒ thay vì đi RÀ SOÁT — con lỗi dùng chung vùng hiện rõ mồn một trong cấu hình và chẳng ai đọc nó mà nhận ra.</span></div>
</div>
<div class="note-ct">
<p><strong>Thứ tự để dựng cái này.</strong> DANH TÍNH trước (<code>real_ip</code>), vì mọi giới hạn khoá theo sai địa chỉ đều sai theo kiểu TRÔNG như đang chạy tốt. Rồi tới kích thước và timeout, những thứ không có mặt trái và không cần chỉnh tinh. Rồi tới giới hạn tần suất, MỘT vùng cho MỘT mục đích, với con số lấy từ access log của chính bạn. Rồi ĐEM DÒ mọi tuyến — kể cả các đường hỏng — và vừa dò vừa ĐỌC error log, vì nó gọi tên cái vùng, phần vượt và cái tệp bằng những chữ mà bạn hành động theo được.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_limit_req_module.html" target="_blank" rel="noopener"><span class="lc-ico">🚦</span><span class="lc-body"><span class="lc-title">nginx — limit_req và limit_conn</span><span class="lc-sub">nginx.org · Hai module dựng nên cả cái lớp này</span></span></a>
<a class="link-card" href="https://blog.nginx.org/blog/rate-limiting-nginx" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">nginx blog — Giới hạn tần suất với NGINX</span><span class="lc-sub">blog.nginx.org · Bài tham chiếu, kèm các sơ đồ về burst</span></span></a>
<a class="link-card" href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP Top Ten</span><span class="lc-sub">owasp.org · Chỗ nào giới hạn ở proxy giúp được và chỗ nào nó là SAI tầng hoàn toàn</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Khoá tài khoản và nhồi thông tin đăng nhập, những thứ thuộc về tầng TRÊN cái này</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng cái lớp này, rồi làm một lượt tải file thất bại bằng cách nện vào một điểm cuối chẳng liên quan</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: '7.6 — Quiz: limits|||7.6 — Quiz: giới hạn',
      slug: 'nginx-7-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về ba chế độ burst, cái khoá giả mạo được, đòn mà limit_conn không chặn, và cú 413 tới trước lượt tải lên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.6</span>
<h2>Quiz: limits</h2>
<p class="lead">Eight questions. Three of them are about limits that were configured correctly and still failed to do the thing they were deployed for, which is the most useful pattern in the chapter.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> The same 2r/s written three ways gave three different sites: no burst refused nine of ten requests, <code>burst=5</code> served all ten over 4.93 seconds, and <code>burst=5 nodelay</code> served five instantly then refused — and the default rejection status is <code>503</code>, which lies to the client (7.1). The key decides everything: <code>$binary_remote_addr</code> behind a proxy made five users share one bucket, and reading <code>X-Forwarded-For</code> directly let an attacker rotate it and pass eight times out of eight — <code>real_ip</code> is the fix that avoids both (7.2). <code>limit_conn</code> held exactly at two of six concurrent slow requests, and then failed to close a single one of twenty slowloris connections, because it only counts connections that finished reading their headers; <code>client_header_timeout</code> closed all twenty (7.3). <code>client_max_body_size</code> returned <code>413</code> after zero bytes when the client declared <code>Content-Length</code>, and after 23.7MB when it did not (7.4). And assembling all of it produced one real bug: two locations sharing a <code>limit_req</code> zone, so API traffic made a legitimate upload fail (7.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.6</span>
<h2>Quiz: giới hạn</h2>
<p class="lead">Tám câu. Ba câu nói về những giới hạn được cấu hình ĐÚNG mà vẫn KHÔNG làm được cái việc chúng được triển khai để làm, và đó là khuôn mẫu hữu ích nhất trong cả chương.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Cùng một mức 2r/s viết theo ba cách cho ra ba cái site khác nhau: không burst thì từ chối chín trên mười request, <code>burst=5</code> phục vụ cả mười trải trên 4,93 giây, còn <code>burst=5 nodelay</code> phục vụ năm cái tức thì rồi từ chối — và mã từ chối MẶC ĐỊNH là <code>503</code>, thứ NÓI DỐI với client (7.1). Cái KHOÁ quyết định tất cả: <code>$binary_remote_addr</code> đứng sau một proxy làm năm người dùng dùng chung một cái xô, còn đọc thẳng <code>X-Forwarded-For</code> thì để kẻ tấn công xoay nó và đi qua TÁM trên TÁM — <code>real_ip</code> là cách chữa tránh được CẢ HAI (7.2). <code>limit_conn</code> giữ đúng ở mức hai trên sáu request chậm đồng thời, rồi KHÔNG đóng nổi một cái nào trong hai mươi kết nối slowloris, vì nó chỉ đếm những kết nối đã ĐỌC XONG header; <code>client_header_timeout</code> đóng cả hai mươi (7.3). <code>client_max_body_size</code> trả <code>413</code> sau KHÔNG byte nào khi client khai <code>Content-Length</code>, và sau 23,7MB khi client không khai (7.4). Và ráp tất cả lại thì lòi ra một con lỗi thật: hai location dùng CHUNG một vùng <code>limit_req</code>, nên lưu lượng API làm một lượt tải file hợp lệ thất bại (7.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'limit_req zone=z rate=2r/s; with no burst. A browser fires ten requests on page load. What happens?|||limit_req zone=z rate=2r/s; không có burst. Một trình duyệt bắn mười request lúc nạp trang. Chuyện gì xảy ra?',
            options: [
              'All ten succeed, spread over five seconds|||Cả mười thành công, trải trên năm giây',
              'One succeeds and nine are refused — requests must arrive 500ms apart, which no real client does|||MỘT thành công và CHÍN bị từ chối — request phải tới cách nhau 500ms, mà không client thật nào làm thế',
              'The first two succeed|||Hai cái đầu thành công',
              'Nginx queues them automatically|||Nginx tự xếp hàng chúng lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between burst=5 and burst=5 nodelay, measured?|||Khác biệt giữa burst=5 và burst=5 nodelay, theo phép đo, là gì?',
            options: [
              'nodelay allows more requests through in total|||nodelay cho tổng cộng nhiều request đi qua hơn',
              'burst=5 served all ten over 4.93s by delaying them; nodelay served five in 0.08s and refused the rest|||burst=5 phục vụ cả mười trong 4,93s bằng cách BẮT CHỜ; nodelay phục vụ năm cái trong 0,08s rồi từ chối phần còn lại',
              'nodelay disables the rate limit|||nodelay tắt luôn giới hạn tần suất',
              'They are identical|||Chúng giống hệt nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is the default rejection status 503 a problem?|||Vì sao mã từ chối mặc định 503 lại là một vấn đề?',
            options: [
              'It is not standard HTTP|||Nó không phải HTTP chuẩn',
              'It means "the server is having trouble", so monitoring counts it as an error and clients back off as if you are down — 429 is what you meant|||Nó nghĩa là "máy chủ đang trục trặc", nên hệ giám sát đếm nó là LỖI và client lùi lại như thể bạn đang chết — 429 mới là thứ bạn muốn nói',
              'Browsers ignore it|||Trình duyệt bỏ qua nó',
              'It cannot carry a Retry-After header|||Nó không mang được header Retry-After',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your rate limit keys on a value taken from X-Forwarded-For. An attacker changes that header every request. What did the measurement show?|||Giới hạn của bạn khoá theo một giá trị lấy từ X-Forwarded-For. Kẻ tấn công đổi header đó ở mỗi request. Phép đo cho thấy gì?',
            options: [
              'The limit still applies; Nginx validates the header|||Giới hạn vẫn áp dụng; Nginx có kiểm cái header đó',
              'Eight out of eight requests passed — every request gets a fresh bucket, so the limit is gone entirely|||TÁM trên TÁM request đều qua — mỗi request nhận một cái xô mới toanh, nên giới hạn BIẾN MẤT hoàn toàn',
              'Only the first request passes|||Chỉ request đầu tiên đi qua',
              'Nginx returns 400 for a changing header|||Nginx trả 400 khi header cứ đổi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You have limit_conn 2 per IP. Twenty slowloris connections arrive from one IP. How many get closed?|||Bạn có limit_conn 2 cho mỗi IP. Hai mươi kết nối slowloris tới từ một IP. Bao nhiêu cái bị đóng?',
            options: [
              'Eighteen — the limit refuses everything past two|||Mười tám — giới hạn từ chối mọi thứ vượt quá hai',
              'None — limit_conn only counts connections that finished reading their headers, and a slowloris connection never does; client_header_timeout is what closes them|||KHÔNG cái nào — limit_conn chỉ đếm những kết nối đã ĐỌC XONG header, mà một kết nối slowloris thì không bao giờ xong; client_header_timeout mới là thứ đóng chúng',
              'All twenty|||Cả hai mươi',
              'Two|||Hai',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'client_max_body_size 20m. A client sends 25MB with Content-Length. How many body bytes cross the network?|||client_max_body_size 20m. Một client gửi 25MB kèm Content-Length. Bao nhiêu byte thân băng qua mạng?',
            options: [
              'All 25MB, then Nginx returns 413|||Cả 25MB, rồi Nginx mới trả 413',
              'Zero — Nginx compares the declared length to the limit and returns 413 before accepting any body|||KHÔNG byte nào — Nginx so độ dài đã khai với cái trần rồi trả 413 TRƯỚC khi nhận bất kỳ phần thân nào',
              '20MB, then it stops|||20MB, rồi nó dừng',
              'It depends on client_body_buffer_size|||Tuỳ vào client_body_buffer_size',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The same 25MB is sent with Transfer-Encoding: chunked instead. What changes?|||Cũng 25MB đó nhưng gửi bằng Transfer-Encoding: chunked. Cái gì thay đổi?',
            options: [
              'Nothing; the limit works the same way|||Không gì cả; giới hạn chạy y hệt',
              'There is no declared length, so Nginx reads until the limit is crossed — 23.7MB had already been sent before the 413|||Không có độ dài nào được khai, nên Nginx đọc cho tới khi vượt trần — 23,7MB đã kịp gửi đi trước cú 413',
              'Nginx rejects chunked uploads outright|||Nginx từ chối thẳng các lượt tải chunked',
              'The limit no longer applies|||Giới hạn thôi có hiệu lực',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two locations both say limit_req zone=chung. A user makes 45 API calls, then uploads a file. What happens to the upload?|||Hai location cùng viết limit_req zone=chung. Một người dùng gọi 45 lượt API, rồi tải lên một tệp. Lượt tải lên ra sao?',
            options: [
              'It succeeds; the two locations have separate budgets|||Nó thành công; hai location có ngân sách riêng',
              'It gets 429 — a zone is one shared bucket, so the API traffic exhausted the upload route’s budget too|||Nó ăn 429 — một VÙNG là MỘT cái xô dùng chung, nên lưu lượng API vét cạn luôn ngân sách của tuyến tải file',
              'It is queued until the bucket refills|||Nó được xếp hàng cho tới khi cái xô rót lại',
              'Nginx refuses to start with a duplicate zone name|||Nginx từ chối khởi động khi trùng tên vùng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
