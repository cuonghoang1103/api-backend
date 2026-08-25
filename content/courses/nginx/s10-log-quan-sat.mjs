const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 10 — Logs, and seeing what is happening|||Chương 10 — Log, và nhìn thấy chuyện đang xảy ra',
  description: 'Định dạng log mặc định của Nginx bỏ sót gần hết những thứ bạn cần khi đứng trước một con proxy. Chương này đo xem nó bỏ sót cái gì, dựng lại cái thay thế, và đo luôn cả CHI PHÍ của việc ghi log — thu về một con số làm hỏng một lời khuyên rất phổ biến.',
  lessons: [

    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — What the default log leaves out|||10.1 — Định dạng log mặc định bỏ sót cái gì',
      slug: 'nginx-10-1-log-mac-dinh-bo-sot',
      type: 'LESSON',
      description: 'Cùng ba request, ghi ra bằng định dạng combined và bằng một định dạng viết cho một con proxy. Cái đầu nói được request nào chậm; cái sau nói được chậm ở ĐÂU, máy nào trả lời, và có phải nó tới từ bộ đệm không.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>What the default log leaves out</h2>
<p class="lead">The <code>combined</code> format was designed for a web server that serves files. Every chapter of this course has been about Nginx doing something else, and none of what it does is visible in that format.</p>

<h3>The same three requests, two formats</h3>
<div class="out">=== combined (mac dinh) ===
127.0.0.1 - - [23/Aug/2026:18:46:31 +0000] "GET /binh-thuong HTTP/1.1" 200 13 "-" "curl/8.5.0"
127.0.0.1 - - [23/Aug/2026:18:46:32 +0000] "GET /cham HTTP/1.1" 200 15 "-" "curl/8.5.0"
127.0.0.1 - - [23/Aug/2026:18:46:32 +0000] "GET /loi HTTP/1.1" 500 14 "-" "curl/8.5.0"

=== dinh dang viet cho mot con PROXY ===
127.0.0.1 200 0.010 0.009 127.0.0.1:9600 200 "/binh-thuong" -> "/binh-thuong" 13 -
127.0.0.1 200 0.603 0.603 127.0.0.1:9600 200 "/cham"        -> "/cham"        15 -
127.0.0.1 500 0.002 0.001 127.0.0.1:9600 500 "/loi"         -> "/loi"         14 -
          ^^^ ^^^^^ ^^^^^ ^^^^^^^^^^^^^^ ^^^  ^^^^^^^^^^^^^    ^^^^^^^^^^^^
          ma  tong  up    may nao         ma   gui len         sau rewrite
                                          up</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">$request_time and $upstream_response_time answer different questions</span><span class="lz-d">The first is how long the client waited; the second is how long your backend took. On the slow route both were 0.603 — the backend is the whole delay. On the fast one, 0.010 against 0.009, so a millisecond was Nginx's own work. The gap between them is the part you own.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">$upstream_addr names the machine</span><span class="lz-d">With a pool (Chapter 9), this is how you find out that the slow requests are all going to one backend. Without it, "the API is sometimes slow" is unanswerable from logs alone.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">$upstream_status can differ from $status</span><span class="lz-d">A <code>502</code> to the client with an empty upstream status means the connection failed; a <code>200</code> to the client with a <code>500</code> upstream status means an <code>error_page</code> intervened. That pair distinguishes cases the status code alone cannot.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">$request_uri and $uri show rewrites</span><span class="lz-d">Chapters 2 and 8 measured how often <code>\$uri</code> changes mid-request. Logging both means an internal redirect is visible in the log rather than being something you deduce.</span></div>
</div>

<h3>A format worth using</h3>
<pre><code>log_format huu_dung
  '\$remote_addr \$status \$request_time \$upstream_response_time '
  '\$upstream_addr \$upstream_status '
  '"\$request_method \$request_uri" -> "\$uri" '
  '\$body_bytes_sent \$upstream_cache_status '
  '"\$http_referer" "\$http_user_agent" \$host';

access_log /var/log/nginx/access.log huu_dung;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">$upstream_cache_status makes the cache visible</span><span class="v">Chapter 5's whole diagnostic problem — "the user saw old data and the application is correct" — is one field. With it in every line, your hit rate is an <code>awk</code> away and a cache bug is obvious rather than invisible.</span></div>
  <div class="kv"><span class="k">$host tells you which site was asked for</span><span class="v">Chapter 1: one server can answer for many names. Without <code>\$host</code>, a log line from a multi-site server does not say which site it belongs to — and it also shows you the forged hostnames scanners send.</span></div>
  <div class="kv"><span class="k">$upstream_response_time can be a list</span><span class="v">When <code>proxy_next_upstream</code> retried (Lesson 9.3), the field contains several values separated by commas — one per attempt. A comma in that field is the signature of a retry, which is otherwise invisible.</span></div>
  <div class="kv"><span class="k">Do not log $request unless you also log the method separately</span><span class="v"><code>\$request</code> is method, URI and protocol in one quoted string, which is awkward to parse. Splitting it into <code>\$request_method</code> and <code>\$request_uri</code> costs nothing and makes every later query simpler.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — the access log contains user-controlled strings, and something downstream will parse them.</strong> <code>\$http_user_agent</code>, <code>\$http_referer</code>, <code>\$request_uri</code> and <code>\$host</code> are all written by the client. In the <code>combined</code> format they are quoted and escaped as <code>\\x22</code>, which is safe for reading and is <em>not</em> valid JSON, valid CSV, or safe to interpolate into a shell command or a query. Every log-processing pipeline that has ever been exploited was exploited through this door. Two rules: use <code>escape=json</code> when anything machine-reads the log (Lesson 10.2), and never build a command or query by concatenating a log field — the same rule as <code>\$host</code> in Lesson 1.4, one layer further out.</p>
</div>

<h3>What to reach for when</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">"The site is slow" → sort by $request_time</span><span class="lz-lnote"><code>awk '\$3 &gt; 1' access.log</code> gives you every request over a second. Then compare <code>\$request_time</code> with <code>\$upstream_response_time</code> on those lines: if they match, it is the backend; if they diverge, it is Nginx or the client.</span></div>
  <div class="lz-layer"><span class="lz-lname">"Some users get errors" → group by $upstream_addr</span><span class="lz-lnote">Count non-2xx per backend. One machine with a much higher rate is a bad node; an even spread is an application problem. This is the question Chapter 9 makes possible to ask.</span></div>
  <div class="lz-layer"><span class="lz-lname">"Is the cache working" → count $upstream_cache_status</span><span class="lz-lnote">One <code>awk</code> over the last hour. A hit rate below what you expected usually means the key includes something it should not — a tracking parameter, a cookie.</span></div>
  <div class="lz-layer"><span class="lz-lname">"What changed after the deploy" → compare two windows</span><span class="lz-lnote">Same query before and after. With timings and statuses in every line this is a two-minute check, and it is the fastest way to answer whether a deploy made things worse.</span></div>
</div>
<div class="note-ct">
<p><strong>Change this before you need it.</strong> A log format is only useful retroactively — the incident you want to investigate happened before you improved the format. It costs one line in <code>nginx.conf</code> and a reload, it has no measurable performance cost (Lesson 10.3 measures exactly that), and the difference between the two blocks above is the difference between "the API was slow at 3am" and "the API was slow at 3am on backend 2, which was also serving cache misses".</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_log_module.html" target="_blank" rel="noopener"><span class="lc-ico">📝</span><span class="lc-body"><span class="lc-title">nginx — the log module</span><span class="lc-sub">nginx.org · log_format, access_log, buffering and the escape parameter</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#variables" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — upstream variables</span><span class="lc-sub">nginx.org · Every $upstream_* field, including when they contain lists</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#variables" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">nginx — core variables</span><span class="lc-sub">nginx.org · The full list, which is where most good log formats come from</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">awk, sort and uniq on log files — the whole analysis toolkit</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Log the same requests in both formats and answer a question only one can</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Định dạng log mặc định bỏ sót cái gì</h2>
<p class="lead">Định dạng <code>combined</code> được thiết kế cho một máy chủ web phục vụ TỆP. Mọi chương của khoá này đều nói về việc Nginx làm một thứ KHÁC, và không thứ nào trong số đó nhìn thấy được qua cái định dạng ấy.</p>

<h3>Cùng ba request, hai định dạng</h3>
<div class="out">=== combined (mac dinh) ===
127.0.0.1 - - [23/Aug/2026:18:46:31 +0000] "GET /binh-thuong HTTP/1.1" 200 13 "-" "curl/8.5.0"
127.0.0.1 - - [23/Aug/2026:18:46:32 +0000] "GET /cham HTTP/1.1" 200 15 "-" "curl/8.5.0"
127.0.0.1 - - [23/Aug/2026:18:46:32 +0000] "GET /loi HTTP/1.1" 500 14 "-" "curl/8.5.0"

=== dinh dang viet cho mot con PROXY ===
127.0.0.1 200 0.010 0.009 127.0.0.1:9600 200 "/binh-thuong" -> "/binh-thuong" 13 -
127.0.0.1 200 0.603 0.603 127.0.0.1:9600 200 "/cham"        -> "/cham"        15 -
127.0.0.1 500 0.002 0.001 127.0.0.1:9600 500 "/loi"         -> "/loi"         14 -
          ^^^ ^^^^^ ^^^^^ ^^^^^^^^^^^^^^ ^^^  ^^^^^^^^^^^^^    ^^^^^^^^^^^^
          ma  tong  up    may nao         ma   gui len         sau rewrite
                                          up</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">$request_time và $upstream_response_time trả lời HAI câu hỏi khác nhau</span><span class="lz-d">Cái đầu là client đã CHỜ bao lâu; cái sau là backend của bạn TỐN bao lâu. Ở tuyến chậm thì cả hai đều 0,603 — backend là toàn bộ độ trễ. Ở tuyến nhanh thì 0,010 so với 0,009, tức một mili giây là công việc của CHÍNH Nginx. Khoảng cách giữa hai cái chính là phần thuộc về bạn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">$upstream_addr gọi tên CÁI MÁY</span><span class="lz-d">Với một cái bể (Chương 9) thì đây là cách bạn phát hiện ra rằng những request chậm đều đang đi vào MỘT backend. Thiếu nó thì câu "API thỉnh thoảng chậm" không trả lời được chỉ bằng log.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">$upstream_status có thể KHÁC $status</span><span class="lz-d">Một cú <code>502</code> tới client với trạng thái upstream RỖNG nghĩa là kết nối hỏng; một cú <code>200</code> tới client với trạng thái upstream là <code>500</code> nghĩa là một cái <code>error_page</code> đã xen vào. Cặp đó phân biệt được những ca mà chỉ mỗi mã trạng thái thì không.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">$request_uri và $uri cho thấy các phép VIẾT LẠI</span><span class="lz-d">Chương 2 và 8 đã đo xem <code>\$uri</code> đổi giữa chừng thường xuyên tới mức nào. Ghi cả hai nghĩa là một cú chuyển hướng nội bộ HIỆN ra trong log chứ không phải là thứ bạn phải suy ra.</span></div>
</div>

<h3>Một định dạng đáng dùng</h3>
<pre><code>log_format huu_dung
  '\$remote_addr \$status \$request_time \$upstream_response_time '
  '\$upstream_addr \$upstream_status '
  '"\$request_method \$request_uri" -> "\$uri" '
  '\$body_bytes_sent \$upstream_cache_status '
  '"\$http_referer" "\$http_user_agent" \$host';

access_log /var/log/nginx/access.log huu_dung;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">$upstream_cache_status làm cho BỘ ĐỆM hiện ra</span><span class="v">Toàn bộ bài toán chẩn đoán của Chương 5 — "người dùng thấy dữ liệu cũ mà ứng dụng thì đúng" — gói trong MỘT trường. Có nó ở mọi dòng thì tỷ lệ trúng của bạn chỉ cách một lệnh <code>awk</code>, và một con lỗi về cache trở nên HIỂN NHIÊN thay vì vô hình.</span></div>
  <div class="kv"><span class="k">$host nói cho bạn biết SITE nào được hỏi</span><span class="v">Chương 1: một máy chủ trả lời cho nhiều cái tên. Thiếu <code>\$host</code> thì một dòng log từ một máy chủ nhiều site KHÔNG nói nó thuộc site nào — và nó cũng cho bạn thấy những tên miền giả mà đám quét dạo gửi tới.</span></div>
  <div class="kv"><span class="k">$upstream_response_time có thể là một DANH SÁCH</span><span class="v">Khi <code>proxy_next_upstream</code> đã thử lại (Bài 9.3), cái trường đó chứa nhiều giá trị ngăn bằng dấu phẩy — mỗi lần thử một giá trị. Một dấu phẩy trong trường đó là CHỮ KÝ của một lần thử lại, thứ mà nếu không thì vô hình.</span></div>
  <div class="kv"><span class="k">Đừng ghi $request trừ khi bạn cũng ghi riêng phương thức</span><span class="v"><code>\$request</code> gộp phương thức, URI và giao thức vào MỘT chuỗi trong ngoặc, thứ rất khó phân tích. Tách nó thành <code>\$request_method</code> và <code>\$request_uri</code> chẳng tốn gì và làm mọi câu truy vấn sau này đơn giản hơn.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — access log CHỨA những chuỗi do người dùng điều khiển, và sẽ có thứ gì đó ở phía sau đem chúng ra PHÂN TÍCH.</strong> <code>\$http_user_agent</code>, <code>\$http_referer</code>, <code>\$request_uri</code> và <code>\$host</code> đều do CLIENT viết. Trong định dạng <code>combined</code> chúng được bọc ngoặc và thoát thành <code>\\x22</code>, thứ an toàn để ĐỌC và KHÔNG phải JSON hợp lệ, không phải CSV hợp lệ, và không an toàn để nội suy vào một dòng lệnh shell hay một câu truy vấn. Mọi đường ống xử lý log từng bị khai thác đều bị khai thác qua đúng cái cửa này. Hai luật: dùng <code>escape=json</code> khi có bất cứ thứ gì đọc log bằng máy (Bài 10.2), và ĐỪNG BAO GIỜ dựng một câu lệnh hay một truy vấn bằng cách nối chuỗi một trường log — vẫn cái luật về <code>\$host</code> ở Bài 1.4, chỉ là ở xa hơn một tầng.</p>
</div>

<h3>Khi nào thì với tới cái gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">"Site chậm" → sắp xếp theo $request_time</span><span class="lz-lnote"><code>awk '\$3 &gt; 1' access.log</code> cho bạn mọi request quá một giây. Rồi so <code>\$request_time</code> với <code>\$upstream_response_time</code> trên những dòng đó: khớp nhau thì đó là backend; lệch nhau thì đó là Nginx hoặc client.</span></div>
  <div class="lz-layer"><span class="lz-lname">"Một số người dùng gặp lỗi" → gom nhóm theo $upstream_addr</span><span class="lz-lnote">Đếm số phản hồi khác 2xx theo từng backend. Một cái máy có tỷ lệ cao hơn hẳn là một node hỏng; trải đều thì đó là vấn đề của ứng dụng. Đây là câu hỏi mà Chương 9 làm cho hỏi được.</span></div>
  <div class="lz-layer"><span class="lz-lname">"Cache có chạy không" → đếm $upstream_cache_status</span><span class="lz-lnote">Một lệnh <code>awk</code> trên một giờ vừa qua. Tỷ lệ trúng thấp hơn bạn tưởng thì thường là cái khoá có chứa thứ lẽ ra không nên có — một tham số theo dõi, một cái cookie.</span></div>
  <div class="lz-layer"><span class="lz-lname">"Sau lần deploy thì đổi gì" → so hai cửa sổ thời gian</span><span class="lz-lnote">Cùng một truy vấn, trước và sau. Có thời gian và mã trạng thái ở mọi dòng thì đây là một phép kiểm hai phút, và nó là cách nhanh nhất để trả lời liệu một lần deploy có làm mọi thứ tệ đi không.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy đổi cái này TRƯỚC khi cần tới nó.</strong> Một định dạng log chỉ hữu ích theo kiểu HỒI TỐ — cái sự cố bạn muốn điều tra đã xảy ra TRƯỚC khi bạn cải thiện định dạng. Nó tốn một dòng trong <code>nginx.conf</code> và một cú nạp lại, nó không có chi phí hiệu năng đo được nào (Bài 10.3 đo đúng chuyện đó), và khác biệt giữa hai khối ở trên là khác biệt giữa "API chậm lúc 3 giờ sáng" và "API chậm lúc 3 giờ sáng ở backend 2, mà máy đó cũng đang phục vụ toàn cache trượt".</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_log_module.html" target="_blank" rel="noopener"><span class="lc-ico">📝</span><span class="lc-body"><span class="lc-title">nginx — module log</span><span class="lc-sub">nginx.org · log_format, access_log, việc đệm và tham số escape</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#variables" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — các biến upstream</span><span class="lc-sub">nginx.org · Mọi trường $upstream_*, kèm cả lúc nào chúng chứa danh sách</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#variables" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">nginx — các biến lõi</span><span class="lc-sub">nginx.org · Danh sách đầy đủ, và đó là chỗ phần lớn định dạng log tốt ra đời</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">awk, sort và uniq trên tệp log — trọn bộ đồ nghề phân tích</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Ghi cùng những request đó bằng cả hai định dạng rồi trả lời một câu mà chỉ một cái làm được</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — JSON logs, and the escape that decides if a machine can read them|||10.2 — Log JSON, và cái escape quyết định máy có đọc nổi không',
      slug: 'nginx-10-2-log-json-escape',
      type: 'LESSON',
      description: 'Một dòng log JSON chỉ đáng giá khi TẤT CẢ các dòng đều phân tích được. Bài này đo ba chế độ escape, tìm ra một cấu hình qua được nginx -t nhưng sinh ra JSON hỏng cú pháp, và đo luôn cái giá phải trả bằng byte.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>JSON logs, and the escape that decides if a machine can read them</h2>
<p class="lead">The reason to log JSON is that a machine reads it. That only pays off if <em>every</em> line parses — one broken line and a log shipper either drops it or stops. Two settings decide whether that happens, and the default is wrong for both.</p>

<h3>Three escape modes, same three requests</h3>
<p>Nginx has an <code>escape=</code> parameter on <code>log_format</code> with three possible values. Here are all three, fed identical user-agent strings: one with quotes, one with a backslash, one with Vietnamese text.</p>
<div class="out">=== escape mac dinh (khong khai bao gi) ===
"Trinh duyet \\x22co ngoac\\x22"
"co\\x5Cbackslash va \\x22ngoac\\x22"
"tieng Viet: Ch\\xC3\\xA0o b\\xE1\\xBA\\xA1n"

=== escape=json ===
"ua":"Trinh duyet \\"co ngoac\\""
"ua":"co\\\\backslash va \\"ngoac\\""
"ua":"tieng Viet: Chào bạn"

=== escape=none ===
curl/8.5.0
ngoac "kep" va \\ backslash</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">escape=default</span><span class="lz-lnote">Anything outside printable ASCII becomes <code>\\xNN</code> — one hex pair per BYTE. Safe to read by eye, not valid JSON: a JSON parser rejects <code>\\x22</code> because JSON has no <code>\\x</code> escape.</span></div>
  <div class="lz-layer"><span class="lz-lname">escape=json</span><span class="lz-lnote">Escapes exactly what the JSON spec requires: <code>"</code> becomes <code>\\"</code>, a backslash becomes <code>\\\\</code>, control characters become <code>\\u00NN</code>. UTF-8 passes through untouched.</span></div>
  <div class="lz-layer"><span class="lz-lname">escape=none</span><span class="lz-lnote">Writes the bytes as they arrived. Inside a JSON format this is a loaded gun: any client can put a quote in a header and end your string early.</span></div>
</div>

<h3>The default format destroys Vietnamese</h3>
<p>Look again at the third line. <code>Chào bạn</code> came out of the default format as <code>Ch\\xC3\\xA0o b\\xE1\\xBA\\xA1n</code>. That is not corruption — it is correct, reversible, and unreadable. Nginx escaped each non-ASCII byte, and <code>à</code> is two bytes in UTF-8, <code>ạ</code> is three.</p>
<p>For a site whose URLs, search terms and user-supplied headers are in Vietnamese, that is your own log turned into a puzzle. Every search query in a <code>/tim?q=...</code> line, every product name in a Referer, becomes hex. <code>escape=json</code> is the only one of the three that leaves it legible, and it does so while still producing valid JSON — the JSON spec permits raw UTF-8 inside a string.</p>
<div class="callout ok"><strong>This is the argument that matters here.</strong> The usual case for JSON logging is "so my log tool can parse it". For a Vietnamese-language site there is a second, larger one: it is the only escape mode that lets you read your own logs.</div>

<h3>The pitfall: a number without quotes</h3>
<p>The natural way to write a JSON log format is to quote the strings and leave the numbers bare, so that a parser gives you numbers rather than text you must convert:</p>
<pre><code><span class="tok-comment"># dinh dang JSON — trong nhin RAT hop ly</span>
log_format json_sai escape=json '{"ma":\$status,"tgian_up":\$upstream_response_time,'
    '"ref":"\$http_referer","rong":"\$http_x_khong_co"}';</code></pre>
<p>That passes <code>nginx -t</code>. It produces valid JSON for every request that goes through a proxy. Here it is against two requests — one proxied, one answered by Nginx itself with a <code>return</code>:</p>
<div class="out">$ curl -s -o /dev/null http://127.0.0.1:9100/noi-bo        # KHONG qua upstream
$ curl -s -o /dev/null http://127.0.0.1:9100/binh-thuong   # co upstream

{"ma":200,"tgian_up":,"ref":"","rong":""}
{"ma":200,"tgian_up":0.002,"ref":"","rong":""}

--- thu doc bang trinh phan tich JSON that ---
json.decoder.JSONDecodeError: Expecting value: line 1 column 22 (char 21)
  OK   {"ma":200,"tgian_up":0.002,"ref":"","rong":""}</div>
<p>The first line is <code>"tgian_up":,</code> — a key with no value at all. When there is no upstream, <code>\$upstream_response_time</code> is empty, and an empty variable between a colon and a comma is not a JSON value. The line is syntactically broken.</p>
<div class="pitfall"><strong>Trap — the broken lines are exactly the ones you do not test.</strong> Every request you send through the proxy while building this produces valid JSON. The lines that break are the health checks, the redirects, the static files, the <code>return 404</code>s — everything Nginx answers by itself. Those arrive in production, at a low rate, forever, and depending on the shipper they are dropped silently or they stop the pipeline.</div>
<p>The fix is one character on each side, and it costs nothing: quote it, and convert to a number at query time.</p>
<pre><code><span class="tok-comment"># \$status luon la so — de tran. \$upstream_response_time CO THE rong — phai boc.</span>
log_format json escape=json '{"tg":"\$time_iso8601","ip":"\$remote_addr","ma":\$status,'
    '"tgian":\$request_time,"tgian_up":"\$upstream_response_time","uri":"\$request_uri",'
    '"ua":"\$http_user_agent","byte":\$body_bytes_sent}';</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Safe bare</span><span class="v"><code>\$status</code>, <code>\$body_bytes_sent</code>, <code>\$request_length</code>, <code>\$request_time</code> — Nginx always sets these to a number.</span></div>
  <div class="kv"><span class="k">Must be quoted</span><span class="v"><code>\$upstream_response_time</code>, <code>\$upstream_connect_time</code>, <code>\$upstream_header_time</code>, <code>\$upstream_status</code>, <code>\$upstream_bytes_received</code> — all empty when no upstream was contacted.</span></div>
  <div class="kv"><span class="k">Always quoted anyway</span><span class="v">Anything from the client: <code>\$request_uri</code>, <code>\$http_*</code>, <code>\$remote_addr</code>, <code>\$uri</code>.</span></div>
</div>
<p>There is a second reason those upstream timers must be quoted even when they are not empty. With <code>proxy_next_upstream</code> (Chapter 9), a request that tried two backends logs <code>0.002, 0.501</code> — a comma-separated list, in one field. Bare, that is broken JSON <em>and</em> a lost measurement; quoted, it is a string you can split later.</p>

<h3>Empty is <code>""</code>, not <code>-</code></h3>
<p>Notice <code>"ref":""</code> in the measured output above. The request had no Referer. In the <code>combined</code> format a missing value is written as <code>-</code>, which is why every Apache-style log is full of dashes. Under <code>escape=json</code> it is an empty string instead.</p>
<p>That is a better default — <code>-</code> is indistinguishable from a client that genuinely sent a Referer of <code>-</code> — but it changes what your queries must say. A filter written against a combined log looks for <code>!= "-"</code>; against JSON it must look for <code>!= ""</code>. Both silently match everything if you get it the wrong way round.</p>

<h3>What it costs, measured</h3>
<p>JSON repeats every field name on every line, so it is bigger. Two hundred requests with varied paths, user agents and status codes, written simultaneously in all three formats:</p>
<div class="out">=== 200 dong luu luong DA DANG ===
ket-hop   113.3 byte/dong tho  →  nen con  7.1%  (  8.1 byte/dong)
huu-dung   80.2 byte/dong tho  →  nen con  5.9%  (  4.7 byte/dong)
json      161.3 byte/dong tho  →  nen con  6.1%  (  9.8 byte/dong)</div>
<p>Raw, JSON is 42% larger than <code>combined</code>. After gzip — and rotated logs are always compressed — the gap narrows to about 21%, because the repeated key names are exactly what a compressor is best at. On a million requests a day that is roughly 154 MB against 108 MB uncompressed, or 9.3 MB against 7.7 MB once rotated.</p>
<div class="callout warn"><strong>Read that measurement with its limits.</strong> The 200 requests were generated by a loop, so their paths and user agents are far more repetitive than real traffic. Real logs compress worse than this, and the raw-size ratio is the more trustworthy of the two numbers. What the measurement does establish is the direction and the rough scale: JSON costs tens of percent, not multiples.</div>
<p>The first attempt at this measurement sent the same request 200 times. Gzip crushed all three formats to about 1% of their size and reported JSON as <em>cheaper per line after compression</em> than it deserved. A benchmark whose input has no entropy measures the compressor, not the format.</p>

<h3>Does it actually parse?</h3>
<p>The only test that counts. Two hundred lines of the corrected format, through a real JSON parser, plus a query that would be painful against a text log:</p>
<div class="out">=== 200 dong json co doc duoc bang trinh phan tich that khong? ===
  hop le: 200   hong: 0

=== chi lay request cham ===
   0.603s  200  /cham
   0.603s  200  /cham
   0.602s  200  /cham
  --- tong 200 dong, tat ca deu phan tich duoc</div>
<div class="note-ct">Run this against your own log before you trust the pipeline that consumes it, and run it again after any change to <code>log_format</code>. It is one line: <code>while read l; do echo "\$l" | jq -e . &gt;/dev/null || echo "HONG: \$l"; done &lt; access.log</code>. A format that has been valid for a year can start emitting broken lines the day you add a <code>return</code> block.</div>

<h3>Timestamps: <code>$time_iso8601</code>, not <code>$time_local</code></h3>
<p>The <code>combined</code> format writes <code>[23/Aug/2026:18:46:31 +0000]</code>. Nothing sorts that, and every log tool needs a custom pattern to read it. <code>\$time_iso8601</code> writes <code>2026-08-23T18:46:31+00:00</code>, which sorts correctly as plain text, is what every ingester expects by default, and carries the offset so a server that is not on UTC is still unambiguous.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Checklist</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">escape=json</span><span class="lz-nsub">Not optional. Without it the line is not valid JSON, and Vietnamese text comes out as hex.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Quote anything that CAN be empty</span><span class="lz-nsub">The whole <code>upstream_*</code> family. Leave bare only what Nginx always sets to a number.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">$time_iso8601</span><span class="lz-nsub">Sorts as text, and every ingester reads it without being taught a pattern.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Verify with a real parser</span><span class="lz-nsub">Not by eye. <code>nginx -t</code> knows nothing about JSON.</span></div></div>
  </div>
</div>

<h3>Should you log JSON at all?</h3>
<p>If something downstream ingests the logs — Loki, Elasticsearch, Vector, CloudWatch — then yes, and the 21% is not worth arguing about. If you read your logs with <code>grep</code>, <code>awk</code> and your eyes on a single server, the aligned text format from Lesson 10.1 is easier to scan and a third smaller, and JSON buys nothing.</p>
<p>The one thing not worth doing is a text format that a tool then re-parses with a regular expression. That regex is a second copy of your log format, kept in a different file, and it breaks silently the day someone adds a field.</p>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_log_module — log_format, escape, access_log</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — the reference for all three escape modes and the buffering parameters used in Lesson 10.3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 8259 — The JSON Data Interchange Format, §7 Strings</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc8259#section-7 — the two-page section that says why <code>\\x22</code> is rejected and raw UTF-8 accepted.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Alphabetical index of Nginx variables</span><span class="lc-sub">nginx.org/en/docs/varindex.html — the fastest way to check whether a variable can be empty before you leave it unquoted.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Load balancing — where the comma-separated timings come from</span><span class="lc-sub">Chapter 9 measured a retry across two backends. That is the request that turns a bare <code>\$upstream_response_time</code> into broken JSON.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Log JSON, và cái escape quyết định máy có đọc nổi không</h2>
<p class="lead">Lý do người ta ghi log dạng JSON là để MÁY đọc. Điều đó chỉ có giá trị khi <em>mọi</em> dòng đều phân tích được — chỉ một dòng hỏng là công cụ thu gom log hoặc vứt nó đi, hoặc dừng hẳn. Có hai thiết lập quyết định chuyện đó, và mặc định thì cả hai đều sai.</p>

<h3>Ba chế độ escape, cùng ba request</h3>
<p>Nginx có tham số <code>escape=</code> trên <code>log_format</code> với ba giá trị. Dưới đây là cả ba, nhận cùng một bộ chuỗi user-agent: một cái có dấu ngoặc kép, một cái có dấu chéo ngược, một cái là tiếng Việt.</p>
<div class="out">=== escape mac dinh (khong khai bao gi) ===
"Trinh duyet \\x22co ngoac\\x22"
"co\\x5Cbackslash va \\x22ngoac\\x22"
"tieng Viet: Ch\\xC3\\xA0o b\\xE1\\xBA\\xA1n"

=== escape=json ===
"ua":"Trinh duyet \\"co ngoac\\""
"ua":"co\\\\backslash va \\"ngoac\\""
"ua":"tieng Viet: Chào bạn"

=== escape=none ===
curl/8.5.0
ngoac "kep" va \\ backslash</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">escape=default</span><span class="lz-lnote">Mọi thứ nằm ngoài ASCII in được đều thành <code>\\xNN</code> — mỗi cặp hex cho một BYTE. Nhìn mắt thì an toàn, nhưng không phải JSON hợp lệ: trình phân tích JSON từ chối <code>\\x22</code> vì JSON không có escape kiểu <code>\\x</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">escape=json</span><span class="lz-lnote">Bọc đúng những gì đặc tả JSON đòi: <code>"</code> thành <code>\\"</code>, dấu chéo ngược thành <code>\\\\</code>, ký tự điều khiển thành <code>\\u00NN</code>. UTF-8 đi qua nguyên vẹn.</span></div>
  <div class="lz-layer"><span class="lz-lname">escape=none</span><span class="lz-lnote">Ghi thẳng byte như lúc nó tới. Đặt trong một định dạng JSON thì đây là khẩu súng đã lên đạn: bất kỳ client nào cũng có thể nhét một dấu ngoặc kép vào header và kết thúc chuỗi của bạn sớm.</span></div>
</div>

<h3>Định dạng mặc định phá nát tiếng Việt</h3>
<p>Nhìn lại dòng thứ ba. <code>Chào bạn</code> đi ra khỏi định dạng mặc định thành <code>Ch\\xC3\\xA0o b\\xE1\\xBA\\xA1n</code>. Đó không phải hỏng dữ liệu — nó đúng, nó đảo ngược được, và nó không đọc nổi. Nginx đã bọc từng byte ngoài ASCII, mà <code>à</code> là hai byte trong UTF-8, <code>ạ</code> là ba byte.</p>
<p>Với một website mà URL, từ khoá tìm kiếm và header do người dùng gửi lên đều là tiếng Việt, đó là chính cái log của bạn bị biến thành câu đố. Mỗi truy vấn tìm kiếm trong một dòng <code>/tim?q=...</code>, mỗi tên sản phẩm nằm trong Referer, đều thành mã hex. <code>escape=json</code> là cái duy nhất trong ba cái giữ cho nó đọc được, và nó làm được thế mà vẫn sinh ra JSON hợp lệ — đặc tả JSON cho phép UTF-8 thô nằm trong chuỗi.</p>
<div class="callout ok"><strong>Đây mới là lý lẽ đáng kể ở đây.</strong> Lý do thường được nêu cho log JSON là "để công cụ của tôi phân tích được". Với một website tiếng Việt còn một lý do thứ hai, lớn hơn: đó là chế độ escape DUY NHẤT cho phép bạn đọc chính log của mình.</div>

<h3>Cái bẫy: một con số không đặt trong ngoặc kép</h3>
<p>Cách tự nhiên để viết một định dạng log JSON là bọc ngoặc cho chuỗi và để số trần, sao cho trình phân tích trả về SỐ chứ không phải chữ mà bạn phải tự chuyển đổi:</p>
<pre><code><span class="tok-comment"># dinh dang JSON — trong nhin RAT hop ly</span>
log_format json_sai escape=json '{"ma":\$status,"tgian_up":\$upstream_response_time,'
    '"ref":"\$http_referer","rong":"\$http_x_khong_co"}';</code></pre>
<p>Nó qua được <code>nginx -t</code>. Nó sinh ra JSON hợp lệ cho MỌI request đi qua proxy. Đây là nó chạy với hai request — một cái đi qua proxy, một cái do chính Nginx trả lời bằng <code>return</code>:</p>
<div class="out">$ curl -s -o /dev/null http://127.0.0.1:9100/noi-bo        # KHONG qua upstream
$ curl -s -o /dev/null http://127.0.0.1:9100/binh-thuong   # co upstream

{"ma":200,"tgian_up":,"ref":"","rong":""}
{"ma":200,"tgian_up":0.002,"ref":"","rong":""}

--- thu doc bang trinh phan tich JSON that ---
json.decoder.JSONDecodeError: Expecting value: line 1 column 22 (char 21)
  OK   {"ma":200,"tgian_up":0.002,"ref":"","rong":""}</div>
<p>Dòng đầu là <code>"tgian_up":,</code> — một cái khoá chẳng có giá trị nào theo sau. Khi không có upstream, <code>\$upstream_response_time</code> rỗng, và một biến rỗng nằm giữa dấu hai chấm với dấu phẩy thì không phải một giá trị JSON. Dòng đó hỏng cú pháp.</p>
<div class="pitfall"><strong>Bẫy — những dòng hỏng chính là những dòng bạn KHÔNG thử.</strong> Mọi request bạn bắn qua proxy trong lúc dựng cái này đều sinh JSON hợp lệ. Những dòng hỏng là health check, là redirect, là tệp tĩnh, là mấy cái <code>return 404</code> — tất cả những gì Nginx tự trả lời. Chúng tới trên production, với tần suất thấp, mãi mãi, và tuỳ công cụ thu gom mà chúng bị vứt lặng lẽ hoặc làm dừng cả đường ống.</div>
<p>Cách sửa là một ký tự mỗi bên, và nó chẳng tốn gì: bọc ngoặc lại, rồi chuyển sang số lúc truy vấn.</p>
<pre><code><span class="tok-comment"># \$status luon la so — de tran. \$upstream_response_time CO THE rong — phai boc.</span>
log_format json escape=json '{"tg":"\$time_iso8601","ip":"\$remote_addr","ma":\$status,'
    '"tgian":\$request_time,"tgian_up":"\$upstream_response_time","uri":"\$request_uri",'
    '"ua":"\$http_user_agent","byte":\$body_bytes_sent}';</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Để trần được</span><span class="v"><code>\$status</code>, <code>\$body_bytes_sent</code>, <code>\$request_length</code>, <code>\$request_time</code> — Nginx luôn đặt chúng thành một con số.</span></div>
  <div class="kv"><span class="k">Bắt buộc bọc ngoặc</span><span class="v"><code>\$upstream_response_time</code>, <code>\$upstream_connect_time</code>, <code>\$upstream_header_time</code>, <code>\$upstream_status</code>, <code>\$upstream_bytes_received</code> — tất cả đều rỗng khi không có upstream nào được liên hệ.</span></div>
  <div class="kv"><span class="k">Vốn dĩ luôn bọc</span><span class="v">Mọi thứ tới từ client: <code>\$request_uri</code>, <code>\$http_*</code>, <code>\$remote_addr</code>, <code>\$uri</code>.</span></div>
</div>
<p>Còn một lý do thứ hai để bọc ngoặc mấy cái đồng hồ upstream ngay cả khi chúng không rỗng. Với <code>proxy_next_upstream</code> (Chương 9), một request đã thử hai backend sẽ ghi ra <code>0.002, 0.501</code> — một danh sách ngăn bằng dấu phẩy, nằm trong MỘT trường. Để trần thì đó là JSON hỏng <em>và</em> là một phép đo bị mất; bọc ngoặc thì nó là một chuỗi mà bạn tách ra được về sau.</p>

<h3>Rỗng là <code>""</code>, không phải <code>-</code></h3>
<p>Để ý <code>"ref":""</code> trong kết quả đo ở trên. Request đó không có Referer. Trong định dạng <code>combined</code>, một giá trị thiếu được ghi thành <code>-</code>, đó là lý do mọi log kiểu Apache đầy dấu gạch ngang. Dưới <code>escape=json</code> thì nó thành chuỗi rỗng.</p>
<p>Đó là mặc định tốt hơn — <code>-</code> không phân biệt được với một client thật sự gửi Referer là <code>-</code> — nhưng nó đổi cách bạn phải viết truy vấn. Một bộ lọc viết cho log combined thì tìm <code>!= "-"</code>; với JSON thì phải tìm <code>!= ""</code>. Cả hai đều lặng lẽ khớp với TẤT CẢ nếu bạn dùng nhầm cái kia.</p>

<h3>Nó tốn bao nhiêu, đo thật</h3>
<p>JSON lặp lại tên mọi trường trên mọi dòng, nên nó to hơn. Hai trăm request với đường dẫn, user-agent và mã trạng thái khác nhau, ghi đồng thời ra cả ba định dạng:</p>
<div class="out">=== 200 dong luu luong DA DANG ===
ket-hop   113.3 byte/dong tho  →  nen con  7.1%  (  8.1 byte/dong)
huu-dung   80.2 byte/dong tho  →  nen con  5.9%  (  4.7 byte/dong)
json      161.3 byte/dong tho  →  nen con  6.1%  (  9.8 byte/dong)</div>
<p>Ở dạng thô, JSON lớn hơn <code>combined</code> 42%. Sau khi nén gzip — mà log xoay vòng thì luôn được nén — khoảng cách rút xuống còn khoảng 21%, vì mấy cái tên khoá lặp đi lặp lại chính là thứ mà bộ nén giỏi nhất. Với một triệu request mỗi ngày, đó là khoảng 154 MB so với 108 MB chưa nén, hoặc 9,3 MB so với 7,7 MB sau khi xoay vòng.</p>
<div class="callout warn"><strong>Đọc phép đo đó kèm giới hạn của nó.</strong> 200 request được sinh ra bằng một vòng lặp, nên đường dẫn và user-agent của chúng lặp lại nhiều hơn hẳn lưu lượng thật. Log thật nén kém hơn thế này, và con số tỉ lệ ở dạng THÔ mới là con số đáng tin hơn trong hai cái. Cái mà phép đo này khẳng định được là hướng và thang độ lớn: JSON tốn thêm vài chục phần trăm, chứ không phải gấp mấy lần.</div>
<p>Lần đo đầu tiên bắn cùng một request 200 lần. Gzip nghiền cả ba định dạng xuống còn khoảng 1% kích thước và báo rằng JSON <em>rẻ hơn tính trên mỗi dòng sau khi nén</em> so với thực tế nó đáng được. Một phép đo mà đầu vào không có entropy thì nó đang đo bộ nén, không đo định dạng.</p>

<h3>Nó có phân tích được thật không?</h3>
<p>Đây mới là phép thử duy nhất có giá trị. Hai trăm dòng của định dạng đã sửa, chạy qua một trình phân tích JSON thật, cộng thêm một truy vấn mà làm trên log dạng chữ thì rất cực:</p>
<div class="out">=== 200 dong json co doc duoc bang trinh phan tich that khong? ===
  hop le: 200   hong: 0

=== chi lay request cham ===
   0.603s  200  /cham
   0.603s  200  /cham
   0.602s  200  /cham
  --- tong 200 dong, tat ca deu phan tich duoc</div>
<div class="note-ct">Chạy phép này trên log của chính bạn TRƯỚC khi tin vào cái đường ống tiêu thụ nó, và chạy lại sau mỗi lần đổi <code>log_format</code>. Nó chỉ một dòng: <code>while read l; do echo "\$l" | jq -e . &gt;/dev/null || echo "HONG: \$l"; done &lt; access.log</code>. Một định dạng đã hợp lệ suốt một năm vẫn có thể bắt đầu sinh dòng hỏng đúng cái ngày bạn thêm một khối <code>return</code>.</div>

<h3>Dấu thời gian: <code>$time_iso8601</code>, không phải <code>$time_local</code></h3>
<p>Định dạng <code>combined</code> ghi <code>[23/Aug/2026:18:46:31 +0000]</code>. Chẳng thứ gì sắp xếp được cái đó, và mọi công cụ log đều cần một mẫu riêng để đọc nó. <code>\$time_iso8601</code> ghi <code>2026-08-23T18:46:31+00:00</code>, sắp xếp đúng ngay ở dạng chữ thuần, là thứ mọi bộ thu nạp mặc định trông đợi, và mang theo cả độ lệch múi giờ nên một máy chủ không chạy UTC vẫn không gây nhập nhằng.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Danh mục kiểm</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">escape=json</span><span class="lz-nsub">Bắt buộc. Không có nó thì dòng log không phải JSON hợp lệ, và tiếng Việt thành mã hex.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bọc mọi thứ CÓ THỂ rỗng</span><span class="lz-nsub">Toàn bộ họ <code>upstream_*</code>. Chỉ để trần thứ Nginx luôn đặt thành số.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">$time_iso8601</span><span class="lz-nsub">Sắp xếp được, và mọi công cụ đọc được mà không cần khai báo mẫu.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Kiểm bằng trình phân tích thật</span><span class="lz-nsub">Không phải bằng mắt. <code>nginx -t</code> không biết gì về JSON.</span></div></div>
  </div>
</div>

<h3>Có nên ghi log JSON không?</h3>
<p>Nếu có thứ gì đó ở phía sau thu nạp log — Loki, Elasticsearch, Vector, CloudWatch — thì có, và 21% kia không đáng đem ra cãi. Nếu bạn đọc log bằng <code>grep</code>, <code>awk</code> và bằng mắt trên đúng một máy chủ, thì định dạng chữ căn cột ở Bài 10.1 dễ nhìn hơn và nhỏ hơn một phần ba, còn JSON chẳng mua được gì.</p>
<p>Thứ duy nhất không đáng làm là một định dạng chữ mà rồi một công cụ lại phân tích nó bằng biểu thức chính quy. Cái regex đó là một bản sao thứ hai của định dạng log, nằm ở một tệp khác, và nó vỡ lặng lẽ đúng cái ngày có người thêm một trường.</p>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_log_module — log_format, escape, access_log</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — tài liệu gốc cho cả ba chế độ escape và các tham số đệm dùng ở Bài 10.3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 8259 — Đặc tả JSON, §7 Strings</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc8259#section-7 — mục hai trang nói vì sao <code>\\x22</code> bị từ chối còn UTF-8 thô thì được chấp nhận.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Danh mục biến của Nginx xếp theo bảng chữ cái</span><span class="lc-sub">nginx.org/en/docs/varindex.html — cách nhanh nhất để kiểm xem một biến có thể rỗng hay không TRƯỚC khi bạn để nó trần.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Cân bằng tải — mấy con số ngăn bằng dấu phẩy tới từ đâu</span><span class="lc-sub">Chương 9 đã đo một lần thử lại qua hai backend. Đó chính là cái request biến một <code>\$upstream_response_time</code> để trần thành JSON hỏng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Not logging: off, if=, buffer=, and what logging really costs|||10.3 — Không ghi log: off, if=, buffer=, và ghi log thật sự tốn bao nhiêu',
      slug: 'nginx-10-3-khong-ghi-log-va-gia-cua-no',
      type: 'LESSON',
      description: 'Ba cách ghi ít log đi, đo bằng số lần gọi syscall thật. Rồi đo xem tắt log có nhanh lên không — kết quả bác bỏ một lời khuyên bạn sẽ gặp ở mọi hướng dẫn tối ưu Nginx.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Not logging: <code>off</code>, <code>if=</code>, <code>buffer=</code>, and what logging really costs</h2>
<p class="lead">Every Nginx tuning guide tells you to turn off the access log for speed. This lesson measures that claim two ways — by counting the syscalls it removes, and by timing the requests. The two measurements disagree, and the disagreement is the point.</p>

<h3>Three ways to write less</h3>
<pre><code><span class="tok-comment"># 1. Tat han cho mot location</span>
location /health { access_log off; return 200 "ok"; }

<span class="tok-comment"># 2. Chi ghi khi mot bien khac rong va khac "0"</span>
map \$status \$dang_chu_y { ~^[23] 0; default 1; }
access_log /var/log/nginx/loi.log huu_dung if=\$dang_chu_y;

<span class="tok-comment"># 3. Gom vao bo dem, thinh thoang moi ghi xuong dia</span>
access_log /var/log/nginx/access.log huu_dung buffer=64k flush=5s;</code></pre>
<p>They do different things and are not interchangeable. The first destroys the data, the second filters it, the third keeps all of it and only changes when it reaches the disk.</p>

<h3><code>access_log off</code> — measured</h3>
<p>Three requests to a location with <code>access_log off</code>, against a server that has <em>four</em> <code>access_log</code> directives declared at server level:</p>
<div class="out">=== 3 request toi /health (access_log off) ===
  so dong moi them vao huu-dung.log: 0</div>
<div class="pitfall"><strong>Trap — <code>off</code> is all-or-nothing, not a subtraction.</strong> The server block above declares four different log files. A single <code>access_log off;</code> in a location silences every one of them, not just the one you had in mind. There is no way to say "keep the JSON log, drop the text one" — <code>off</code> is a full stop for that context. If you want to keep one, re-declare it inside the location instead of using <code>off</code>.</div>
<p>The usual target is the health check, and that is a reasonable target: a load balancer polling <code>/health</code> every second writes 86,400 lines a day that describe nothing. But be careful what else lives under that prefix — Chapter 2 measured how a prefix <code>location /health</code> also captures <code>/health-report</code> and anything else that starts with those characters. Use <code>location = /health</code> when you mean exactly one URI.</p>

<h3><code>if=</code> — keep the interesting lines only</h3>
<p>The <code>if=</code> parameter takes a variable. Nginx writes the line unless the variable is empty or the literal string <code>0</code>. Combined with <code>map</code> from Chapter 8, that gives you a filter with no <code>if</code> block and no runtime cost worth measuring. Four requests — three successful, one that returned 500 — against a full log and a filtered one:</p>
<div class="out">=== log DAY DU (huu-dung.log) ===
127.0.0.1 200 0.001 0.001 127.0.0.1:9600 200 "/binh-thuong" -> "/binh-thuong" 13 -
127.0.0.1 200 0.602 0.602 127.0.0.1:9600 200 "/cham" -> "/cham" 15 -
127.0.0.1 500 0.001 0.001 127.0.0.1:9600 500 "/loi" -> "/loi" 14 -
127.0.0.1 200 0.000 0.001 127.0.0.1:9600 200 "/khong-co-dau" -> "/khong-co-dau" 13 -

=== log CHI LOI  (loi.log, if=$dang_chu_y) ===
127.0.0.1 500 0.001 0.001 127.0.0.1:9600 500 "/loi" -> "/loi" 14 -</div>
<p>Four lines in one file, one in the other, from the same four requests — because both <code>access_log</code> directives are active at once. That is the pattern worth stealing: keep the full log for the last few days, and a small errors-only file you can keep for a year and <code>grep</code> instantly.</p>
<div class="note-ct">The <code>map</code> is <code>~^[23]</code> → <code>0</code>, <code>default</code> → <code>1</code>: anything in the 2xx and 3xx families is uninteresting, everything else is kept. Add <code>~^499</code> to the uninteresting side if your clients abort often, or map on <code>\$request_time</code> instead to build a slow-request log.</div>

<h3><code>buffer=</code> — the syscalls, counted</h3>
<p>This is where the wall-clock stops being useful and <code>strace</code> starts. Nine hundred requests over a single keepalive connection, against three locations that are identical except for their logging, with the worker process traced:</p>
<div class="out">worker pid=10780
/log-tat/    writev=900 calls
/log-thuong/ writev=900 calls  write=900 calls
/log-dem/    writev=900 calls</div>
<p>The <code>writev</code> calls are the HTTP responses — 900 requests, 900 responses, in all three. The <code>write</code> calls are the log. Unbuffered logging is exactly one extra <code>write()</code> syscall per request. Buffered logging made none at all inside the trace window. Extending that window past the <code>flush=5s</code> deadline shows where they went:</p>
<div class="out">=== /log-dem/ : 900 request, ke ca sau khi flush=5s da chay ===
  so lan goi write(): 1
  so dong thuc su trong log: 900
  kich thuoc log: 51300 byte</div>
<p>Nine hundred lines, 51,300 bytes, delivered in a <em>single</em> <code>write()</code> call. The buffer is 64 KB and the data fit inside it, so the worker accumulated everything in memory and wrote once. Against 900 syscalls unbuffered, that is a 900-fold reduction, and no lines were lost.</p>

<h3>So how much faster is it?</h3>
<p>It is not. Five rounds of 900 requests against each of the three locations, same connection, same response body:</p>
<div class="out">=== 5 luot x 900 request cho moi cau hinh ===
  /log-tat/      37.1  39.1  36.7  36.8  36.7   → TB  37.3 us  (do lech chuan 1.0)
  /log-thuong/   37.3  37.1  37.1  36.7  37.4   → TB  37.1 us  (do lech chuan 0.3)
  /log-dem/      36.8  37.5  39.3  37.9  40.0   → TB  38.3 us  (do lech chuan 1.3)</div>
<div class="callout warn"><strong>Logging off was not faster than logging on.</strong> It came out 0.2 µs <em>slower</em> than the unbuffered log, and the buffered version — the one doing 900× fewer syscalls — came out slowest of the three. All three differences are smaller than the run-to-run spread of a single configuration. The 900 syscalls are real, and they cost less than the noise floor of the measurement.</div>
<p>That is not a claim that a <code>write()</code> is free. It is a claim about proportion. Serving a request through a proxy costs about 37 µs here, and a buffered append to a page-cached file costs on the order of a microsecond. One part in thirty, on a benchmark with a 1 µs standard deviation, is not visible.</p>

<h3>Read the null result honestly</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">What was measured</span><span class="v">One worker, one keepalive connection, ext4 on a virtual disk with the page cache warm, a 13-byte response, no TLS, loopback.</span></div>
  <div class="kv"><span class="k">Where it would show</span><span class="v">A log on a network filesystem, a disk already saturated by something else, a synchronous-write mount, or a machine where the log partition is full — there the <code>write()</code> stops being a memcpy into page cache and starts being I/O.</span></div>
  <div class="kv"><span class="k">What it does establish</span><span class="v">On an ordinary server with an ordinary local disk, "turn off the access log for performance" is advice with no measurable benefit, and it costs you the ability to answer questions about production.</span></div>
</div>
<p>The reason to use <code>buffer=</code> is not speed. It is that a busy server writing a million lines a day is doing a million syscalls, and on a shared or I/O-constrained box that eventually shows up somewhere — in <code>iowait</code>, in a noisy-neighbour disk, in a container with a write throttle. Measure your own box before assuming either way.</p>

<h3>What buffering costs instead</h3>
<p>Two things, and both surprise people. First, the delay. A single request through a location with <code>flush=5s</code>, watched second by second:</p>
<div class="out">=== mot request qua location co buffer=64k flush=5s ===
  t=0s  so dong trong log: 0
  t=1s  so dong trong log: 0
  t=2s  so dong trong log: 0
  t=3s  so dong trong log: 0
  t=4s  so dong trong log: 0
  t=5s  so dong trong log: 1
  t=6s  so dong trong log: 1
  t=7s  so dong trong log: 1</div>
<div class="pitfall"><strong>Trap — "my logging is broken" is usually a buffer.</strong> You make a request, you <code>tail -f</code> the log, nothing appears, and you go looking for a misconfigured <code>log_format</code>. The line is sitting in the worker's memory waiting for <code>flush=</code> to expire or the buffer to fill. On a quiet server — a staging box, a site at 3 a.m. — that can be the entire <code>flush=</code> interval, every time. Debug with <code>buffer=</code> removed, then put it back.</div>
<p>Second, the loss. Lines in the buffer have not been written anywhere. If the worker is killed with <code>SIGKILL</code>, or the machine loses power, they are gone — and the requests that produced them are exactly the ones you would want to read afterwards. A graceful reload or stop flushes the buffer first, so the risk is narrower than it sounds, but it is real, and it is the wrong trade for a security or audit log.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Default: log everything, unbuffered</span><span class="lz-d">Correct for almost every site. The measurement above is the justification — it costs nothing you can detect, and it is the only record you will have.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Add <code>access_log off</code> for health checks only</span><span class="lz-d">Use <code>location =</code> so it applies to exactly one URI. Not for speed, but so the signal is not buried under 86,400 identical lines a day.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Add a second, filtered log with <code>if=</code></span><span class="lz-d">Errors only, or slow requests only. Small enough to keep for a year and to grep in an instant.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Reach for <code>buffer=</code> when you have measured a reason</span><span class="lz-d">High request rates on constrained I/O. Accept the flush delay and the loss window knowingly, and never for an audit trail.</span></div>
</div>

<h3>The one that is genuinely worth turning off</h3>
<p>Not the access log — <code>gzip</code> of the log at rotation time, if you are rotating hourly on a small machine, and <code>error_log</code> at <code>debug</code> level, which is a different order of magnitude from everything measured here. Lesson 10.4 gets to the error log and measures what <code>debug</code> actually produces, which is the one logging setting in this chapter that can genuinely hurt a server.</p>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_log_module — access_log parameters</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — <code>buffer=</code>, <code>flush=</code>, <code>gzip=</code>, <code>if=</code> and the exact rule for what counts as "empty or 0".</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">strace(1) — counting syscalls with -c</span><span class="lc-sub">man7.org/linux/man-pages/man1/strace.1.html — the tool that made the buffering visible when the stopwatch could not see it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — syscalls, page cache and what a write() really does</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why an append to a local file is a memcpy and not a disk seek, which is the whole reason this benchmark found nothing.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Rewriting and mapping — where this <code>map</code> comes from</span><span class="lc-sub">Chapter 8 built the <code>map</code> directive used here for <code>if=</code>. It is evaluated lazily, so an unused map costs nothing.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Không ghi log: <code>off</code>, <code>if=</code>, <code>buffer=</code>, và ghi log thật sự tốn bao nhiêu</h2>
<p class="lead">Mọi hướng dẫn tối ưu Nginx đều bảo bạn tắt access log đi cho nhanh. Bài này đo lời khuyên đó theo hai cách — đếm số syscall mà nó bỏ đi, và bấm giờ các request. Hai phép đo cho kết quả ngược nhau, và chính chỗ ngược nhau đó mới là bài học.</p>

<h3>Ba cách ghi ít đi</h3>
<pre><code><span class="tok-comment"># 1. Tat han cho mot location</span>
location /health { access_log off; return 200 "ok"; }

<span class="tok-comment"># 2. Chi ghi khi mot bien khac rong va khac "0"</span>
map \$status \$dang_chu_y { ~^[23] 0; default 1; }
access_log /var/log/nginx/loi.log huu_dung if=\$dang_chu_y;

<span class="tok-comment"># 3. Gom vao bo dem, thinh thoang moi ghi xuong dia</span>
access_log /var/log/nginx/access.log huu_dung buffer=64k flush=5s;</code></pre>
<p>Ba cái làm ba việc khác nhau và không thay thế cho nhau được. Cái thứ nhất PHÁ HUỶ dữ liệu, cái thứ hai LỌC nó, cái thứ ba giữ nguyên tất cả và chỉ đổi thời điểm nó xuống tới đĩa.</p>

<h3><code>access_log off</code> — đo thật</h3>
<p>Ba request tới một location có <code>access_log off</code>, trên một server đã khai báo <em>bốn</em> chỉ thị <code>access_log</code> ở mức server:</p>
<div class="out">=== 3 request toi /health (access_log off) ===
  so dong moi them vao huu-dung.log: 0</div>
<div class="pitfall"><strong>Bẫy — <code>off</code> là tắt SẠCH, không phải trừ bớt.</strong> Khối server ở trên khai báo bốn tệp log khác nhau. Một dòng <code>access_log off;</code> duy nhất trong một location làm câm hết cả bốn, chứ không riêng cái bạn đang nghĩ tới. Không có cách nào nói "giữ log JSON, bỏ log chữ" — <code>off</code> là dấu chấm hết cho ngữ cảnh đó. Muốn giữ lại một cái thì khai báo lại nó BÊN TRONG location, đừng dùng <code>off</code>.</div>
<p>Đích ngắm thường thấy là health check, và đó là đích hợp lý: một bộ cân bằng tải hỏi <code>/health</code> mỗi giây sẽ ghi 86.400 dòng mỗi ngày mà chẳng mô tả điều gì. Nhưng phải để ý xem còn thứ gì nằm dưới cái tiền tố đó — Chương 2 đã đo chuyện một <code>location /health</code> dạng tiền tố cũng tóm luôn <code>/health-report</code> và mọi thứ khác bắt đầu bằng chừng ấy ký tự. Dùng <code>location = /health</code> khi bạn muốn nói ĐÚNG một URI.</p>

<h3><code>if=</code> — chỉ giữ lại những dòng đáng chú ý</h3>
<p>Tham số <code>if=</code> nhận một biến. Nginx ghi dòng đó ra trừ khi biến rỗng hoặc bằng đúng chuỗi <code>0</code>. Kết hợp với <code>map</code> ở Chương 8, bạn có một bộ lọc không cần khối <code>if</code> và không tốn chi phí lúc chạy đáng để đo. Bốn request — ba cái thành công, một cái trả 500 — chạy song song vào một log đầy đủ và một log đã lọc:</p>
<div class="out">=== log DAY DU (huu-dung.log) ===
127.0.0.1 200 0.001 0.001 127.0.0.1:9600 200 "/binh-thuong" -> "/binh-thuong" 13 -
127.0.0.1 200 0.602 0.602 127.0.0.1:9600 200 "/cham" -> "/cham" 15 -
127.0.0.1 500 0.001 0.001 127.0.0.1:9600 500 "/loi" -> "/loi" 14 -
127.0.0.1 200 0.000 0.001 127.0.0.1:9600 200 "/khong-co-dau" -> "/khong-co-dau" 13 -

=== log CHI LOI  (loi.log, if=$dang_chu_y) ===
127.0.0.1 500 0.001 0.001 127.0.0.1:9600 500 "/loi" -> "/loi" 14 -</div>
<p>Bốn dòng trong tệp này, một dòng trong tệp kia, từ cùng bốn request — vì cả hai chỉ thị <code>access_log</code> đều đang hoạt động cùng lúc. Đó mới là cái khuôn đáng lấy về dùng: giữ log đầy đủ cho vài ngày gần nhất, cộng thêm một tệp chỉ-có-lỗi đủ nhỏ để giữ cả năm và <code>grep</code> ra trong tích tắc.</p>
<div class="note-ct">Cái <code>map</code> ở đây là <code>~^[23]</code> → <code>0</code>, <code>default</code> → <code>1</code>: mọi thứ thuộc họ 2xx và 3xx là không đáng chú ý, còn lại thì giữ. Thêm <code>~^499</code> vào phía không-đáng-chú-ý nếu client của bạn hay ngắt giữa chừng, hoặc map trên <code>\$request_time</code> thay vì mã trạng thái để dựng một log request-chậm.</div>

<h3><code>buffer=</code> — đếm syscall</h3>
<p>Đây là chỗ mà đồng hồ bấm giờ hết tác dụng và <code>strace</code> bắt đầu có ích. Chín trăm request trên một kết nối keepalive duy nhất, vào ba location giống hệt nhau trừ phần ghi log, với tiến trình worker bị theo dõi:</p>
<div class="out">worker pid=10780
/log-tat/    writev=900 calls
/log-thuong/ writev=900 calls  write=900 calls
/log-dem/    writev=900 calls</div>
<p>Mấy lời gọi <code>writev</code> là phần trả lời HTTP — 900 request, 900 phản hồi, ở cả ba. Mấy lời gọi <code>write</code> mới là log. Ghi log không đệm tốn ĐÚNG một syscall <code>write()</code> phụ cho mỗi request. Ghi log có đệm không tốn cái nào trong khoảng thời gian theo dõi. Kéo dài khoảng đó qua khỏi mốc <code>flush=5s</code> thì thấy chúng đi đâu:</p>
<div class="out">=== /log-dem/ : 900 request, ke ca sau khi flush=5s da chay ===
  so lan goi write(): 1
  so dong thuc su trong log: 900
  kich thuoc log: 51300 byte</div>
<p>Chín trăm dòng, 51.300 byte, giao trong MỘT lời gọi <code>write()</code> duy nhất. Bộ đệm là 64 KB và dữ liệu vừa lọt vào đó, nên worker gom hết trong bộ nhớ rồi ghi một lần. So với 900 syscall khi không đệm, đó là giảm 900 lần, và không mất dòng nào.</p>

<h3>Vậy nó nhanh hơn bao nhiêu?</h3>
<p>Không nhanh hơn. Năm lượt, mỗi lượt 900 request, vào từng location trong ba cái, cùng một kết nối, cùng một thân phản hồi:</p>
<div class="out">=== 5 luot x 900 request cho moi cau hinh ===
  /log-tat/      37.1  39.1  36.7  36.8  36.7   → TB  37.3 us  (do lech chuan 1.0)
  /log-thuong/   37.3  37.1  37.1  36.7  37.4   → TB  37.1 us  (do lech chuan 0.3)
  /log-dem/      36.8  37.5  39.3  37.9  40.0   → TB  38.3 us  (do lech chuan 1.3)</div>
<div class="callout warn"><strong>Tắt log KHÔNG nhanh hơn bật log.</strong> Nó ra chậm hơn cái log không đệm 0,2 µs, còn bản có đệm — cái đang làm ít hơn 900 lần syscall — lại ra chậm nhất trong ba cái. Cả ba khoảng chênh đều nhỏ hơn độ dao động giữa các lượt của CÙNG một cấu hình. 900 syscall kia là có thật, và chúng tốn ít hơn cả ngưỡng nhiễu của phép đo.</div>
<p>Đây không phải là khẳng định rằng một lời gọi <code>write()</code> là miễn phí. Đây là khẳng định về TỈ LỆ. Phục vụ một request qua proxy tốn khoảng 37 µs trên máy này, còn một lần ghi nối vào tệp đang nằm trong page cache tốn cỡ một micro giây. Một phần ba mươi, trên một phép đo có độ lệch chuẩn 1 µs, thì không nhìn thấy được.</p>

<h3>Đọc kết quả rỗng này cho trung thực</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái đã đo</span><span class="v">Một worker, một kết nối keepalive, ext4 trên đĩa ảo với page cache đang nóng, thân phản hồi 13 byte, không TLS, chạy trên loopback.</span></div>
  <div class="kv"><span class="k">Chỗ nó SẼ lộ ra</span><span class="v">Log nằm trên hệ tệp mạng, đĩa đã bị thứ khác làm bão hoà, phân vùng gắn ở chế độ ghi đồng bộ, hoặc máy có phân vùng log đã đầy — ở đó <code>write()</code> thôi là một phép memcpy và trở thành I/O thật.</span></div>
  <div class="kv"><span class="k">Cái nó KHẲNG ĐỊNH được</span><span class="v">Trên một máy chủ bình thường với một cái đĩa cục bộ bình thường, "tắt access log cho nhanh" là lời khuyên không đem lại lợi ích đo được, và nó lấy đi của bạn khả năng trả lời câu hỏi về production.</span></div>
</div>
<p>Lý do để dùng <code>buffer=</code> không phải là tốc độ. Lý do là một máy chủ bận ghi một triệu dòng mỗi ngày đang thực hiện một triệu syscall, và trên một cái máy dùng chung hay bị bó I/O thì rốt cuộc điều đó có lộ ra ở đâu đó — trong <code>iowait</code>, ở một cái đĩa bị hàng xóm ồn ào, trong một container có hạn mức ghi. Hãy đo chính cái máy của bạn trước khi kết luận theo hướng nào.</p>

<h3>Đổi lại, đệm tốn cái gì</h3>
<p>Hai thứ, và cả hai đều làm người ta bất ngờ. Thứ nhất là ĐỘ TRỄ. Một request duy nhất qua một location có <code>flush=5s</code>, theo dõi từng giây một:</p>
<div class="out">=== mot request qua location co buffer=64k flush=5s ===
  t=0s  so dong trong log: 0
  t=1s  so dong trong log: 0
  t=2s  so dong trong log: 0
  t=3s  so dong trong log: 0
  t=4s  so dong trong log: 0
  t=5s  so dong trong log: 1
  t=6s  so dong trong log: 1
  t=7s  so dong trong log: 1</div>
<div class="pitfall"><strong>Bẫy — "log của tôi hỏng rồi" thường chỉ là cái bộ đệm.</strong> Bạn bắn một request, bạn <code>tail -f</code> cái log, chẳng thấy gì hiện ra, thế là bạn đi lục xem <code>log_format</code> sai ở đâu. Dòng đó đang nằm trong bộ nhớ của worker chờ <code>flush=</code> hết hạn hoặc chờ bộ đệm đầy. Trên một máy chủ vắng — máy staging, hay website lúc 3 giờ sáng — cái đó có thể là nguyên khoảng <code>flush=</code>, lần nào cũng vậy. Gỡ lỗi thì bỏ <code>buffer=</code> ra, xong việc thì gắn lại.</div>
<p>Thứ hai là MẤT DỮ LIỆU. Những dòng nằm trong bộ đệm là những dòng chưa được ghi ra bất cứ đâu. Nếu worker bị giết bằng <code>SIGKILL</code>, hoặc máy mất điện, chúng biến mất — mà mấy cái request sinh ra chúng lại đúng là những thứ bạn muốn đọc lại sau đó. Một lần nạp lại hay dừng êm thì có xả bộ đệm trước, nên rủi ro hẹp hơn nghe qua, nhưng nó có thật, và nó là sự đánh đổi SAI cho một log bảo mật hay log kiểm toán.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mặc định: ghi tất, không đệm</span><span class="lz-d">Đúng cho gần như mọi website. Phép đo ở trên chính là lý lẽ — nó không tốn gì bạn phát hiện nổi, và nó là bản ghi DUY NHẤT bạn sẽ có.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Thêm <code>access_log off</code> chỉ cho health check</span><span class="lz-d">Dùng <code>location =</code> để nó áp đúng một URI. Không phải vì tốc độ, mà để tín hiệu không bị chôn dưới 86.400 dòng giống hệt nhau mỗi ngày.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thêm một log thứ hai đã lọc bằng <code>if=</code></span><span class="lz-d">Chỉ lỗi, hoặc chỉ request chậm. Đủ nhỏ để giữ cả năm và grep ra trong nháy mắt.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chỉ với tới <code>buffer=</code> khi đã ĐO ra lý do</span><span class="lz-d">Tần suất request cao trên I/O bị bó. Chấp nhận độ trễ xả đệm và cửa sổ mất dữ liệu một cách có ý thức, và tuyệt đối không dùng cho log kiểm toán.</span></div>
</div>

<h3>Thứ thật sự đáng tắt</h3>
<p>Không phải access log — mà là <code>gzip</code> lúc xoay vòng log nếu bạn xoay theo giờ trên một máy nhỏ, và <code>error_log</code> ở mức <code>debug</code>, thứ nằm ở một bậc độ lớn hoàn toàn khác so với mọi thứ đo trong bài này. Bài 10.4 đi vào error log và đo xem mức <code>debug</code> thật sự sinh ra bao nhiêu — đó là thiết lập ghi log duy nhất trong chương này có thể làm đau một máy chủ thật.</p>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_log_module — các tham số của access_log</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — <code>buffer=</code>, <code>flush=</code>, <code>gzip=</code>, <code>if=</code> và quy tắc chính xác cho thế nào là "rỗng hoặc bằng 0".</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">strace(1) — đếm syscall bằng -c</span><span class="lc-sub">man7.org/linux/man-pages/man1/strace.1.html — công cụ đã làm lộ ra chuyện đệm log khi cái đồng hồ bấm giờ không nhìn thấy gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — syscall, page cache và một write() thật sự làm gì</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao ghi nối vào một tệp cục bộ là một phép memcpy chứ không phải một lần quay đầu đọc đĩa, và đó chính là lý do phép đo này không tìm thấy gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Viết lại và ánh xạ — cái <code>map</code> này tới từ đâu</span><span class="lc-sub">Chương 8 đã dựng chỉ thị <code>map</code> dùng ở đây cho <code>if=</code>. Nó được tính toán lười, nên một cái map không dùng tới thì không tốn gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — The error log: levels, anatomy, and the one setting that fills a disk|||10.4 — Error log: các mức, cấu trúc một dòng, và thiết lập duy nhất làm đầy đĩa',
      slug: 'nginx-10-4-error-log-va-cac-muc',
      type: 'LESSON',
      description: 'Access log nói chuyện gì đã xảy ra; error log nói vì sao nó hỏng. Bài này mổ một dòng error log ra từng trường, đo lượng chữ mà từng mức sinh ra, và đo mức debug — thứ tốn gấp 52 lần một dòng access log cho MỘT request tầm thường.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>The error log: levels, anatomy, and the one setting that fills a disk</h2>
<p class="lead">The access log records what happened. The error log records why it went wrong, and it is a different file with different rules — a different inheritance model, eight severity levels, and one level that produces fifty times more data per request than everything measured in this chapter so far.</p>

<h3>One line, taken apart</h3>
<p>Here is a real line, produced by pointing <code>proxy_pass</code> at a port with nothing listening on it:</p>
<div class="out">2026/08/23 19:04:49 [error] 20965#20965: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 127.0.0.1, server: _, request: "GET /chet HTTP/1.1", upstream: "http://127.0.0.1:9999/chet", host: "127.0.0.1:9300"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">2026/08/23 19:04:49</span><span class="v">Local time, always this format. Unlike the access log there is no <code>log_format</code> for the error log — you cannot change any of this.</span></div>
  <div class="kv"><span class="k">[error]</span><span class="v">The severity. This line was written because the configured level was <code>error</code> or lower.</span></div>
  <div class="kv"><span class="k">20965#20965</span><span class="v">Process ID and thread ID. With several workers this tells you which one; it is also how you match a line to a worker that later crashed.</span></div>
  <div class="kv"><span class="k">*1</span><span class="v"><strong>The connection number.</strong> The single most useful field on the line, and the one nobody uses — see below.</span></div>
  <div class="kv"><span class="k">connect() failed (111: …)</span><span class="v">The syscall that failed and its errno. <code>111</code> is <code>ECONNREFUSED</code>: something answered the TCP handshake with a refusal, so the port is closed and reachable.</span></div>
  <div class="kv"><span class="k">upstream: "http://…"</span><span class="v">The exact URL Nginx tried, after all rewriting. Comparing this against what you expected settles most <code>proxy_pass</code> arguments in one glance.</span></div>
</div>
<div class="note-ct"><strong>The <code>*1</code> is a handle, not decoration.</strong> Every line Nginx writes about one client connection carries the same connection number, across every module and every phase. <code>grep '\\*1 ' error.log</code> gives you that one request's whole story in order — the rewrite, the upstream choice, the failure, the retry. At <code>debug</code> level it is the only way to read the file at all.</div>

<h3>The three messages you will actually meet</h3>
<div class="out">=== 1. upstream khong co ai nghe ===
[error] *1 connect() failed (111: Connection refused) while connecting to upstream,
        upstream: "http://127.0.0.1:9999/chet"

=== 2. upstream qua cham (proxy_read_timeout 300ms vs backend ngu 600ms) ===
[error] *1 upstream timed out (110: Connection timed out) while reading response header
        from upstream, upstream: "http://127.0.0.1:9600/cham"
        → client nhan: 504

=== 3. tep khong ton tai ===
[error] *3 open() "/tmp/nxerr/khong-ton-tai/thieu/khong-co.txt" failed
        (2: No such file or directory)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">111</span><span class="lz-t">Connection refused → the client gets 502</span><span class="lz-d">The backend is not running, or is bound to a different address than the one you wrote. Reachable but closed. Check that the process is up and that it listens on the interface Nginx is dialling — a backend bound to <code>127.0.0.1</code> is invisible to an Nginx in another container.</span></div>
  <div class="lz-step"><span class="lz-k">110</span><span class="lz-t">Connection timed out → the client gets 504</span><span class="lz-d">The backend accepted the connection and then did not answer in time. <em>Which</em> timeout matters: "while connecting" is <code>proxy_connect_timeout</code> (a network or firewall problem), "while reading response header" is <code>proxy_read_timeout</code> (a slow application). The message names which one.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">No such file or directory → the client gets 404</span><span class="lz-d">The path in the message is the fully resolved one, after <code>root</code> or <code>alias</code> and after every rewrite. Chapter 4 measured how often that path is not what the author expected; this line is the answer, printed for free.</span></div>
  <div class="lz-step"><span class="lz-k">13</span><span class="lz-t">Permission denied → the client gets 403</span><span class="lz-d">Not in the measurements above but the fourth one you will meet. Nginx's worker runs as a different user than the one that deployed the files, and needs execute permission on <em>every</em> directory in the path, not just read on the file.</span></div>
</div>

<h3>The levels, measured</h3>
<p>Eight levels, from least to most verbose: <code>emerg</code>, <code>alert</code>, <code>crit</code>, <code>error</code>, <code>warn</code>, <code>notice</code>, <code>info</code>, <code>debug</code>. Setting one means "this and everything more severe". Here is the same set of four requests — one success, one dead upstream, one missing file, one timeout — replayed at five levels:</p>
<div class="out">crit     0 dong,     0 byte
error    2 dong,   449 byte
warn     2 dong,   449 byte
notice  14 dong,  1266 byte
info    18 dong,  1618 byte</div>
<p>Two things worth noticing. <code>error</code> and <code>warn</code> produced identical output, because none of these failures is a warning — the gap between the levels is real but nothing in this test lands in it. And <code>crit</code> produced <em>nothing at all</em>: a backend that is completely down, a missing file and a timeout are all invisible at that level. A server configured with <code>error_log … crit</code> looks perfectly healthy while returning 502s.</p>
<div class="callout"><strong><code>warn</code> is the right default</strong> for a production server, and it is what the distribution packages ship. <code>notice</code> and <code>info</code> add lifecycle chatter — reloads, worker starts, signals — which is useful while you are changing things and noise afterwards.</div>

<h3><code>debug</code>: measured, because the number is the argument</h3>
<p>Debug output requires a build with <code>--with-debug</code> (<code>nginx -V</code> will tell you; the Ubuntu package has it). The measurement is one request to <code>location /ok { return 200 "ok"; }</code> — no proxying, no TLS, no file access, the cheapest request this server can serve:</p>
<div class="out">=== muc debug: chi phi cua DUNG MOT request 'ok' ===
  luc khoi dong xong : 25 dong / 1777 byte
  sau 1 request /ok  : 111 dong / 7690 byte
  → MOT request ton  : 86 dong / 5913 byte
  → so voi 1 dong access log combined (113 byte): gap 52 lan
  → 1 trieu request/ngay: 5.5 GB/ngay</div>
<div class="pitfall"><strong>Trap — <code>debug</code> left on is how a disk fills.</strong> Eighty-six lines for a request that does nothing. A real request — TLS handshake, proxy, upstream headers, buffering — produces several times that. At a million requests a day this one setting writes gigabytes onto the partition that, on a small VPS, is usually the same one holding your database. Chapter 10 opened by measuring that the <em>access</em> log costs nothing; the error log at <code>debug</code> is the exception, by three orders of magnitude.</div>
<p>It is still the right tool when you need it. Nothing else shows you the location match, the rewrite phase, the buffer allocations and the upstream selection in sequence. The rule is simply that it goes on to answer one question and comes off immediately afterwards.</p>

<h3><code>debug_connection</code> grants debug — it does not restrict it</h3>
<p>The obvious way to avoid the flood is to debug only your own IP. The directive exists, it lives in the <code>events</code> block, and it does not work the way the name suggests. Both of these were measured:</p>
<div class="out">error_log debug + debug_connection 10.99.99.99
  → 5 request tu 127.0.0.1 sinh ra: 430 dong / 29553 byte   (KHONG loc gi ca)

error_log info  + debug_connection 10.99.99.99  → 1 request sinh   1 dong /    88 byte
error_log info  + debug_connection 127.0.0.1    → 1 request sinh  72 dong /  5005 byte</div>
<p>With the base level already at <code>debug</code>, adding <code>debug_connection</code> changed nothing — 86 lines per request, exactly as before. The directive does not subtract. It <em>raises</em> matching connections to debug from whatever the base level is, so it only does anything when the base is <em>not</em> debug.</p>
<pre><code><span class="tok-comment"># DUNG: nen la warn, chi IP cua ban duoc nang len debug</span>
error_log /var/log/nginx/error.log warn;
events {
    worker_connections 1024;
    debug_connection 203.0.113.42;      <span class="tok-comment"># IP cua may ban</span>
    debug_connection 10.0.0.0/8;        <span class="tok-comment"># hoac ca mot dai</span>
}</code></pre>
<div class="callout ok">That is the configuration to reach for on a production box: everyone else keeps <code>warn</code>, your own address gets full debug, and the disk is safe. It is also the only way to debug a problem that only one client can reproduce.</div>

<h3>Inheritance: a lower <code>error_log</code> replaces, it does not add</h3>
<p>Two server blocks on one port. Server A declares no <code>error_log</code>; server B declares its own. Both were made to fail identically:</p>
<div class="out">=== goc.log (khai o muc chinh — server A ke thua) ===
server: a.vidu, request: "GET /x HTTP/1.1"
=== rieng-b.log (khai rieng trong server B) ===
server: b.vidu, request: "GET /y HTTP/1.1"</div>
<p>Server A's failure went to the inherited main-level log. Server B's went to its own file <em>and nowhere else</em> — it is absent from <code>goc.log</code>. Declaring <code>error_log</code> in a context discards the inherited one for everything in that context.</p>
<p>Since 1.5.2 you can list several <code>error_log</code> directives in the same context and every one of them receives the messages, each at its own level. That is how you keep a full <code>warn</code> file alongside a small <code>crit</code>-only file, or ship to syslog while keeping a local copy:</p>
<pre><code>error_log /var/log/nginx/error.log warn;
error_log /var/log/nginx/nghiem-trong.log crit;
error_log syslog:server=10.0.0.9,tag=nginx warn;
error_log stderr warn;   <span class="tok-comment"># quan trong trong container — xem duoi</span></code></pre>
<div class="note-ct"><strong>In a container, <code>stderr</code> is usually what you want</strong>, so that <code>docker logs</code> sees the errors and the platform's log collector picks them up. The official Nginx image achieves the same thing by symlinking the log files to <code>/dev/stdout</code> and <code>/dev/stderr</code>. Either works; what does not work is writing to a file inside a container nobody will ever open.</div>

<h3>A note on how this lesson was measured</h3>
<p>The inheritance test above returned two empty files on its first run, which looked like a clean and interesting result — "the server-level log captured nothing". It was nothing of the sort. Reading the raw file instead of the filtered output showed six lines of <code>bind() to 127.0.0.1:9301 failed (98: Address already in use)</code>: the port belonged to a rig from an earlier chapter, Nginx never started, and both files were empty because nothing had run.</p>
<div class="callout warn"><strong>An empty log is not a measurement.</strong> It is equally consistent with "the thing did not happen" and "the thing never ran". Before concluding anything from an absence, confirm the process started — and read the unfiltered file, because the <code>grep</code> that produced the tidy empty output was hiding the six lines that explained everything.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_core_module — error_log, debug_connection</span><span class="lc-sub">nginx.org/en/docs/ngx_core_module.html — the eight levels, the syslog and memory destinations, and the multiple-error_log rule from 1.5.2.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">A debugging log — the official guide</span><span class="lc-sub">nginx.org/en/docs/debugging_log.html — how to check for <code>--with-debug</code> and how to read the output once you have it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — the numbers in the parentheses</span><span class="lc-sub">man7.org/linux/man-pages/man3/errno.3.html — 111 ECONNREFUSED, 110 ETIMEDOUT, 2 ENOENT, 13 EACCES. Nginx prints the number and the text; this is where both come from.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — logs, stdout and why files inside a container disappear</span><span class="lc-sub">/courses/docker/learn${REF} — the reason <code>error_log stderr</code> is the right choice in a container, and what happens to a log file when the container is replaced.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Error log: các mức, cấu trúc một dòng, và thiết lập duy nhất làm đầy đĩa</h2>
<p class="lead">Access log ghi lại chuyện GÌ đã xảy ra. Error log ghi lại VÌ SAO nó hỏng, và nó là một tệp khác với luật khác — mô hình kế thừa khác, tám mức nghiêm trọng, và một mức sinh ra lượng dữ liệu gấp năm mươi lần mọi thứ đã đo trong chương này cho mỗi request.</p>

<h3>Một dòng, mổ ra từng mảnh</h3>
<p>Đây là một dòng thật, sinh ra bằng cách trỏ <code>proxy_pass</code> vào một cổng chẳng có ai lắng nghe:</p>
<div class="out">2026/08/23 19:04:49 [error] 20965#20965: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 127.0.0.1, server: _, request: "GET /chet HTTP/1.1", upstream: "http://127.0.0.1:9999/chet", host: "127.0.0.1:9300"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">2026/08/23 19:04:49</span><span class="v">Giờ địa phương, luôn đúng định dạng này. Khác access log, error log KHÔNG có <code>log_format</code> — bạn không đổi được thứ gì trong đây.</span></div>
  <div class="kv"><span class="k">[error]</span><span class="v">Mức nghiêm trọng. Dòng này được ghi vì mức đang cấu hình là <code>error</code> hoặc thấp hơn.</span></div>
  <div class="kv"><span class="k">20965#20965</span><span class="v">Mã tiến trình và mã luồng. Khi có nhiều worker thì đây là cách biết worker nào; nó cũng là cách khớp một dòng với một worker về sau bị chết.</span></div>
  <div class="kv"><span class="k">*1</span><span class="v"><strong>Số hiệu kết nối.</strong> Trường hữu ích nhất trên cả dòng, và cũng là trường không ai dùng — xem ngay dưới.</span></div>
  <div class="kv"><span class="k">connect() failed (111: …)</span><span class="v">Lời gọi hệ thống đã hỏng cùng mã errno của nó. <code>111</code> là <code>ECONNREFUSED</code>: có thứ gì đó đã đáp lại bắt tay TCP bằng một lời từ chối, tức là cổng đóng nhưng vẫn tới được.</span></div>
  <div class="kv"><span class="k">upstream: "http://…"</span><span class="v">Chính xác cái URL mà Nginx đã thử, sau toàn bộ viết lại. Đối chiếu cái này với thứ bạn TƯỞNG là gì thì giải quyết được gần hết mọi tranh cãi về <code>proxy_pass</code> chỉ trong một cái liếc mắt.</span></div>
</div>
<div class="note-ct"><strong>Cái <code>*1</code> là một cái tay nắm, không phải đồ trang trí.</strong> Mọi dòng Nginx ghi về CÙNG một kết nối client đều mang cùng số hiệu đó, xuyên qua mọi module và mọi giai đoạn. <code>grep '\\*1 ' error.log</code> cho bạn toàn bộ câu chuyện của đúng request ấy theo đúng thứ tự — viết lại đường dẫn, chọn upstream, hỏng, thử lại. Ở mức <code>debug</code> thì đó là cách DUY NHẤT đọc nổi cái tệp.</div>

<h3>Ba thông báo bạn sẽ thật sự gặp</h3>
<div class="out">=== 1. upstream khong co ai nghe ===
[error] *1 connect() failed (111: Connection refused) while connecting to upstream,
        upstream: "http://127.0.0.1:9999/chet"

=== 2. upstream qua cham (proxy_read_timeout 300ms vs backend ngu 600ms) ===
[error] *1 upstream timed out (110: Connection timed out) while reading response header
        from upstream, upstream: "http://127.0.0.1:9600/cham"
        → client nhan: 504

=== 3. tep khong ton tai ===
[error] *3 open() "/tmp/nxerr/khong-ton-tai/thieu/khong-co.txt" failed
        (2: No such file or directory)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">111</span><span class="lz-t">Connection refused → client nhận 502</span><span class="lz-d">Backend không chạy, hoặc nó gắn vào một địa chỉ khác cái bạn viết. Tới được nhưng cổng đóng. Kiểm xem tiến trình có sống không, và nó lắng nghe trên đúng giao diện mà Nginx đang gọi — một backend gắn vào <code>127.0.0.1</code> thì vô hình với một con Nginx nằm ở container khác.</span></div>
  <div class="lz-step"><span class="lz-k">110</span><span class="lz-t">Connection timed out → client nhận 504</span><span class="lz-d">Backend đã nhận kết nối rồi im, không trả lời kịp. Quan trọng là timeout NÀO: "while connecting" là <code>proxy_connect_timeout</code> (vấn đề mạng hoặc tường lửa), "while reading response header" là <code>proxy_read_timeout</code> (ứng dụng chậm). Chính thông báo đó nói rõ là cái nào.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">No such file or directory → client nhận 404</span><span class="lz-d">Đường dẫn trong thông báo là đường dẫn đã giải quyết đầy đủ, sau <code>root</code> hoặc <code>alias</code> và sau mọi lần viết lại. Chương 4 đã đo xem cái đường dẫn đó thường KHÁC ý tác giả tới mức nào; dòng này là câu trả lời, in ra miễn phí.</span></div>
  <div class="lz-step"><span class="lz-k">13</span><span class="lz-t">Permission denied → client nhận 403</span><span class="lz-d">Không có trong mấy phép đo trên nhưng là cái thứ tư bạn sẽ gặp. Worker của Nginx chạy dưới một người dùng khác với người đã triển khai tệp, và nó cần quyền thực thi trên <em>MỌI</em> thư mục trong đường dẫn, chứ không chỉ quyền đọc trên cái tệp.</span></div>
</div>

<h3>Các mức, đo thật</h3>
<p>Tám mức, từ ít nói nhất tới nhiều lời nhất: <code>emerg</code>, <code>alert</code>, <code>crit</code>, <code>error</code>, <code>warn</code>, <code>notice</code>, <code>info</code>, <code>debug</code>. Đặt một mức nghĩa là "mức này và mọi thứ nghiêm trọng hơn". Đây là CÙNG bốn request — một cái thành công, một upstream chết, một tệp thiếu, một cái quá hạn — phát lại ở năm mức:</p>
<div class="out">crit     0 dong,     0 byte
error    2 dong,   449 byte
warn     2 dong,   449 byte
notice  14 dong,  1266 byte
info    18 dong,  1618 byte</div>
<p>Có hai chỗ đáng để ý. <code>error</code> và <code>warn</code> cho ra y hệt nhau, vì không sự cố nào trong đám này là một cảnh báo — khoảng cách giữa hai mức là có thật nhưng phép thử này không có gì rơi vào đó. Và <code>crit</code> cho ra <em>KHÔNG GÌ CẢ</em>: một backend chết hẳn, một tệp thiếu và một cái quá hạn đều vô hình ở mức đó. Một máy chủ cấu hình <code>error_log … crit</code> trông khoẻ mạnh hoàn hảo trong lúc nó đang trả 502.</p>
<div class="callout"><strong><code>warn</code> mới là mặc định đúng</strong> cho một máy chủ production, và đó cũng là mức mà các gói của bản phân phối đặt sẵn. <code>notice</code> và <code>info</code> thêm vào mấy lời tán gẫu về vòng đời — nạp lại, worker khởi động, tín hiệu — hữu ích trong lúc bạn đang sửa đổi và là tiếng ồn sau đó.</div>

<h3><code>debug</code>: đo thật, vì chính con số mới là lý lẽ</h3>
<p>Ghi log debug đòi bản dựng có <code>--with-debug</code> (<code>nginx -V</code> sẽ cho biết; gói của Ubuntu thì có). Phép đo là MỘT request tới <code>location /ok { return 200 "ok"; }</code> — không proxy, không TLS, không đụng tệp, cái request rẻ nhất mà máy chủ này phục vụ được:</p>
<div class="out">=== muc debug: chi phi cua DUNG MOT request 'ok' ===
  luc khoi dong xong : 25 dong / 1777 byte
  sau 1 request /ok  : 111 dong / 7690 byte
  → MOT request ton  : 86 dong / 5913 byte
  → so voi 1 dong access log combined (113 byte): gap 52 lan
  → 1 trieu request/ngay: 5.5 GB/ngay</div>
<div class="pitfall"><strong>Bẫy — quên tắt <code>debug</code> chính là cách một cái đĩa bị làm đầy.</strong> Tám mươi sáu dòng cho một request chẳng làm gì. Một request thật — bắt tay TLS, proxy, header upstream, đệm — sinh ra gấp mấy lần chừng ấy. Với một triệu request mỗi ngày, riêng thiết lập này ghi hàng gigabyte lên cái phân vùng mà trên một con VPS nhỏ thường cũng chính là phân vùng chứa cơ sở dữ liệu của bạn. Chương 10 mở đầu bằng phép đo cho thấy log TRUY CẬP chẳng tốn gì; error log ở mức <code>debug</code> là ngoại lệ, lệch tới ba bậc độ lớn.</div>
<p>Nó vẫn là công cụ đúng khi bạn cần tới. Chẳng có thứ gì khác cho bạn thấy chuyện khớp location, giai đoạn viết lại, việc cấp phát bộ đệm và việc chọn upstream nối tiếp nhau theo thứ tự. Luật chỉ đơn giản là: bật lên để trả lời MỘT câu hỏi, rồi tắt ngay sau đó.</p>

<h3><code>debug_connection</code> CẤP quyền debug — nó không HẠN CHẾ</h3>
<p>Cách hiển nhiên để tránh cơn lụt là chỉ debug đúng IP của mình. Chỉ thị đó có tồn tại, nó nằm trong khối <code>events</code>, và nó KHÔNG hoạt động như cái tên gợi ý. Cả hai trường hợp dưới đây đều đo thật:</p>
<div class="out">error_log debug + debug_connection 10.99.99.99
  → 5 request tu 127.0.0.1 sinh ra: 430 dong / 29553 byte   (KHONG loc gi ca)

error_log info  + debug_connection 10.99.99.99  → 1 request sinh   1 dong /    88 byte
error_log info  + debug_connection 127.0.0.1    → 1 request sinh  72 dong /  5005 byte</div>
<p>Với mức nền đã là <code>debug</code>, thêm <code>debug_connection</code> vào chẳng đổi gì — vẫn 86 dòng mỗi request, y như trước. Chỉ thị này không TRỪ đi. Nó NÂNG những kết nối khớp lên mức debug từ bất kỳ mức nền nào đang có, nên nó chỉ làm được việc gì khi mức nền KHÔNG phải debug.</p>
<pre><code><span class="tok-comment"># DUNG: nen la warn, chi IP cua ban duoc nang len debug</span>
error_log /var/log/nginx/error.log warn;
events {
    worker_connections 1024;
    debug_connection 203.0.113.42;      <span class="tok-comment"># IP cua may ban</span>
    debug_connection 10.0.0.0/8;        <span class="tok-comment"># hoac ca mot dai</span>
}</code></pre>
<div class="callout ok">Đó là cấu hình đáng dùng trên một máy production: mọi người khác vẫn ở <code>warn</code>, riêng địa chỉ của bạn được debug đầy đủ, và cái đĩa vẫn an toàn. Nó cũng là cách DUY NHẤT để gỡ một lỗi mà chỉ đúng một client tái hiện được.</div>

<h3>Kế thừa: một <code>error_log</code> ở mức thấp hơn THAY THẾ, chứ không cộng thêm</h3>
<p>Hai khối server trên cùng một cổng. Server A không khai <code>error_log</code>; server B khai riêng một cái. Cả hai đều bị làm cho hỏng y hệt nhau:</p>
<div class="out">=== goc.log (khai o muc chinh — server A ke thua) ===
server: a.vidu, request: "GET /x HTTP/1.1"
=== rieng-b.log (khai rieng trong server B) ===
server: b.vidu, request: "GET /y HTTP/1.1"</div>
<p>Sự cố của server A đi vào cái log mức chính mà nó kế thừa. Sự cố của server B đi vào tệp riêng của nó <em>và không đi đâu khác nữa</em> — nó vắng mặt trong <code>goc.log</code>. Khai <code>error_log</code> trong một ngữ cảnh là vứt bỏ cái đã kế thừa, cho mọi thứ thuộc ngữ cảnh đó.</p>
<p>Từ bản 1.5.2 bạn được liệt kê nhiều chỉ thị <code>error_log</code> trong CÙNG một ngữ cảnh và tất cả đều nhận thông báo, mỗi cái ở mức riêng của nó. Đó là cách giữ một tệp <code>warn</code> đầy đủ song song với một tệp nhỏ chỉ chứa <code>crit</code>, hoặc gửi sang syslog mà vẫn giữ một bản cục bộ:</p>
<pre><code>error_log /var/log/nginx/error.log warn;
error_log /var/log/nginx/nghiem-trong.log crit;
error_log syslog:server=10.0.0.9,tag=nginx warn;
error_log stderr warn;   <span class="tok-comment"># quan trong trong container — xem duoi</span></code></pre>
<div class="note-ct"><strong>Trong container thì <code>stderr</code> thường mới là thứ bạn muốn</strong>, để <code>docker logs</code> nhìn thấy lỗi và bộ thu gom log của nền tảng nhặt được chúng. Ảnh Nginx chính thức đạt được điều tương tự bằng cách tạo liên kết mềm từ các tệp log sang <code>/dev/stdout</code> và <code>/dev/stderr</code>. Cách nào cũng được; thứ KHÔNG được là ghi vào một tệp nằm trong container mà chẳng bao giờ có ai mở ra.</div>

<h3>Một ghi chú về cách bài này được đo</h3>
<p>Phép thử kế thừa ở trên, ở lần chạy đầu tiên, trả về hai tệp rỗng — trông như một kết quả sạch sẽ và thú vị: "cái log mức server chẳng bắt được gì". Nó chẳng phải thế chút nào. Đọc tệp THÔ thay vì đọc kết quả đã lọc thì thấy sáu dòng <code>bind() to 127.0.0.1:9301 failed (98: Address already in use)</code>: cái cổng đó thuộc về một dàn thử nghiệm từ chương trước, Nginx chưa từng khởi động nổi, và hai tệp rỗng chỉ vì chẳng có gì chạy cả.</p>
<div class="callout warn"><strong>Một cái log rỗng không phải là một phép đo.</strong> Nó khớp ngang nhau với cả "chuyện đó đã không xảy ra" lẫn "cái đó chưa từng chạy". Trước khi kết luận bất cứ điều gì từ một sự VẮNG MẶT, hãy xác nhận tiến trình đã khởi động — và hãy đọc tệp chưa lọc, vì chính cái <code>grep</code> đã cho ra kết quả rỗng gọn gàng kia là thứ che mất sáu dòng giải thích tất cả.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_core_module — error_log, debug_connection</span><span class="lc-sub">nginx.org/en/docs/ngx_core_module.html — tám mức, các đích syslog và bộ nhớ, cùng luật nhiều-error_log từ bản 1.5.2.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">A debugging log — hướng dẫn chính thức</span><span class="lc-sub">nginx.org/en/docs/debugging_log.html — cách kiểm xem có <code>--with-debug</code> không và cách đọc kết quả khi đã có nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">errno(3) — mấy con số trong ngoặc đơn</span><span class="lc-sub">man7.org/linux/man-pages/man3/errno.3.html — 111 ECONNREFUSED, 110 ETIMEDOUT, 2 ENOENT, 13 EACCES. Nginx in ra cả số lẫn chữ; đây là chỗ cả hai tới từ đó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — log, stdout và vì sao tệp trong container biến mất</span><span class="lc-sub">/courses/docker/learn${REF} — lý do <code>error_log stderr</code> là lựa chọn đúng trong container, và chuyện gì xảy ra với một tệp log khi container bị thay.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — stub_status: seven numbers, and the one that says you are dropping traffic|||10.5 — stub_status: bảy con số, và con số nói rằng bạn đang rơi mất lưu lượng',
      slug: 'nginx-10-5-stub-status',
      type: 'LESSON',
      description: 'stub_status chỉ cho bảy con số và không có gì hơn. Bài này đo từng con số dưới tải thật, ép cho accepts tách khỏi handled để thấy chính xác cái khoảnh khắc Nginx bắt đầu vứt kết nối, và tính ra một tỉ số nói ngay keepalive có đang chạy không.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2><code>stub_status</code>: seven numbers, and the one that says you are dropping traffic</h2>
<p class="lead">Logs tell you about requests that finished. They cannot tell you how many connections are open right now, or that Nginx just refused one. <code>stub_status</code> is the built-in answer: seven integers, no dependencies, and one of them is the difference between a server that is busy and a server that is failing.</p>

<h3>Turning it on</h3>
<pre><code>location = /trang-thai {
    stub_status;
    access_log off;              <span class="tok-comment"># bo giam sat hoi moi vai giay — dung ghi log</span>
    allow 10.0.0.0/8;            <span class="tok-comment"># chi mang noi bo</span>
    deny all;
}</code></pre>
<p>Use <code>location =</code>, not a prefix — Chapter 2 measured how a prefix location quietly captures everything beneath it. The <code>allow</code>/<code>deny</code> pair is not optional; the endpoint tells an attacker your live connection count and your traffic rate. Measured from an address outside the allowed range:</p>
<div class="out">ma tra ve khi 127.0.0.1 hoi /trang-thai (chi cho phep 10.0.0.0/8): 403
sau khi go allow/deny: 200</div>

<h3>The whole output</h3>
<div class="out">Active connections: 1
server accepts handled requests
 463 463 31629
Reading: 0 Writing: 1 Waiting: 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Active connections</span><span class="v">Open client connections right now, including idle keepalive ones and including the request asking for this page.</span></div>
  <div class="kv"><span class="k">accepts</span><span class="v">Total connections Nginx has accepted since it started. Monotonic — you read it as a rate by differencing two samples.</span></div>
  <div class="kv"><span class="k">handled</span><span class="v">Total connections Nginx actually served. Normally identical to <code>accepts</code>. When it is not, you are losing traffic.</span></div>
  <div class="kv"><span class="k">requests</span><span class="v">Total HTTP requests. Larger than <code>accepts</code> whenever keepalive is working, because one connection carries many.</span></div>
  <div class="kv"><span class="k">Reading</span><span class="v">Connections where Nginx is reading the request header from the client.</span></div>
  <div class="kv"><span class="k">Writing</span><span class="v">Connections where Nginx is sending a response — this includes time spent waiting for an upstream.</span></div>
  <div class="kv"><span class="k">Waiting</span><span class="v">Idle keepalive connections: open, costing a file descriptor, sending nothing.</span></div>
</div>

<h3>Reading / Writing / Waiting, measured</h3>
<p>Twenty concurrent requests to a route where the backend sleeps 600 ms, sampled while they were in flight:</p>
<div class="out">=== nhan roi ===
Active connections: 1
Reading: 0 Writing: 1 Waiting: 0

=== 20 request song song toi /cham (600ms) ===
Active connections: 21
Reading: 0 Writing: 21 Waiting: 0

=== sau khi tai het ===
Active connections: 1
Reading: 0 Writing: 1 Waiting: 0</div>
<p>Twenty in-flight requests plus the one asking for the status page: <code>Active</code> 21, <code>Writing</code> 21. Note that all twenty were counted as <em>Writing</em> while they were in fact waiting for a slow upstream to answer. <code>Writing</code> does not mean "sending bytes" — it means "past the request-reading stage and not yet finished", which for a proxy is mostly time spent blocked on the backend.</p>
<p>Now eight keepalive connections, opened, used once, then held open and left silent:</p>
<div class="out">=== 8 ket noi keepalive DANG MO nhung KHONG gui gi ===
Active connections: 9
Reading: 0 Writing: 1 Waiting: 8

=== sau khi dong het 8 ket noi ===
Active connections: 1
Reading: 0 Writing: 1 Waiting: 0</div>
<div class="note-ct">A large <code>Waiting</code> is normal and healthy — it is what keepalive looks like. It becomes a problem only when it approaches <code>worker_connections × worker_processes</code>, because an idle connection still occupies a slot. That is what <code>keepalive_timeout</code> is for, and the number to watch it against is the one measured below.</div>

<h3><code>accepts</code> ≠ <code>handled</code>: the number nobody looks at</h3>
<p>On a healthy server these two are always equal, which is exactly why the gap is easy to miss — it reads as a duplicate. To show what it means, here is a server deliberately configured with <code>worker_connections 4</code>, hit with forty concurrent slow requests:</p>
<div class="out">=== truoc khi ep tai (worker_connections 4) ===
Active connections: 1
server accepts handled requests
 1 1 1

--- ban 40 ket noi song song vao /cham (600ms) ---
[6]   Exit 52   curl -s -o /dev/null --max-time 4 http://127.0.0.1:9350/cham

=== sau khi ep tai ===
server accepts handled requests
 42 3 3

--- error log ---
[alert] 24333#24333: 4 worker_connections are not enough
[alert] 24333#24333: 4 worker_connections are not enough
[alert] 24333#24333: 4 worker_connections are not enough</div>
<div class="callout warn"><strong>Forty-two accepted, three handled.</strong> Thirty-nine connections were taken off the kernel's queue and then dropped, because there was no connection slot to put them in. The clients saw <code>curl: (52) Empty reply from server</code> — no status code, no error page, nothing to log an HTTP response for. In the access log those requests <em>do not exist</em>. The only two places this is visible are the <code>accepts</code>/<code>handled</code> gap and the <code>[alert]</code> in the error log.</div>
<p>That is why this pair matters more than anything else on the page. Every other number describes work that succeeded. This one is the only built-in counter for work that silently did not.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Alert on the difference, not the values</span><span class="lz-d">Sample both, subtract, and alert if <code>accepts - handled</code> increases at all between two samples. The absolute values are meaningless; any growth in the gap is an outage in progress.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The usual cause is <code>worker_connections</code></span><span class="lz-d">The default is 512 or 1024 depending on the build. Each proxied request uses <em>two</em> slots — one to the client, one to the upstream — so a proxy runs out at half the number you would guess.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The second cause is file descriptors</span><span class="lz-d">Raising <code>worker_connections</code> above the process <code>RLIMIT_NOFILE</code> achieves nothing. Raise <code>worker_rlimit_nofile</code> with it, and check the error log for <code>Too many open files</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The ceiling is the product</span><span class="lz-d">Maximum concurrent connections is <code>worker_processes × worker_connections</code>. With <code>worker_processes auto</code> on four cores and the default 1024, that is 4096 — halved to about 2048 for a pure reverse proxy.</span></div>
</div>

<h3>A derived number worth more than any raw one</h3>
<p>Dividing <code>requests</code> by <code>accepts</code> gives requests per connection, which is a direct readout of whether keepalive is working. Thirty requests sent two ways, measured as deltas across the counters:</p>
<div class="out">=== 30 request, KHONG keepalive (curl rieng le) ===
  accepts +31   handled +31   requests +31
  → 1.0 request moi ket noi

=== 30 request, CO keepalive (mot ket noi) ===
  accepts +2   handled +2   requests +31
  → 15.5 request moi ket noi</div>
<p>A ratio near 1.0 means every request is paying for a fresh TCP handshake — and with TLS, a fresh handshake too, which Chapter 6 measured as by far the most expensive thing in the connection. Seeing 1.0 on a site that should have keepalive points at a stripped <code>Connection</code> header, a <code>keepalive_timeout 0</code>, or a load balancer in front that is not reusing connections.</p>
<div class="pitfall"><strong>Trap — the status endpoint counts itself.</strong> Both samples above show one extra connection and one extra request that the test did not send: the <code>curl</code> that fetched the status page. In the keepalive case, that single poll drags the computed ratio from 30.0 down to 15.5 — a 48% error, from one request. A monitoring agent polling every 5 seconds adds 17,280 connections a day to <code>accepts</code>, all of them with a requests-per-connection of exactly 1. On a low-traffic site that is enough to make the ratio meaningless. Poll over a keepalive connection, or subtract the poller's own share before trusting the number.</div>

<h3>What <code>stub_status</code> cannot tell you</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">No status codes</span><span class="v">A server returning 100% 502s looks identical to a healthy one. Every request that produced a response counted as <code>handled</code>.</span></div>
  <div class="kv"><span class="k">No latency</span><span class="v">Nothing about how long anything took. <code>Writing</code> being high hints at slow upstreams but does not measure them.</span></div>
  <div class="kv"><span class="k">No per-location or per-upstream breakdown</span><span class="v">Seven numbers for the whole server. You cannot tell which virtual host, route or backend is responsible for any of them.</span></div>
  <div class="kv"><span class="k">Resets on restart</span><span class="v">The counters are per-process-lifetime. A reload keeps them; a restart zeroes them, and a monitoring system that does not handle counter resets will draw a large negative spike.</span></div>
</div>
<p>The gap is deliberate — <code>stub_status</code> is a few hundred lines of C with no state to maintain. For status codes and latency the answer is the access log from Lessons 10.1 and 10.2: ship it, and derive rate, error ratio and percentiles from the fields you chose to log. That combination — <code>stub_status</code> for connection health, the access log for request health — covers what a commercial monitoring module would give you, with the advantage that you already have both.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">stub_status</span><span class="lz-lnote">Free, built in, always available. Connection-level health: how many are open, and are any being dropped.</span></div>
  <div class="lz-layer"><span class="lz-lname">Access log + a shipper</span><span class="lz-lnote">Request-level health: status codes, latency percentiles, per-route and per-upstream breakdowns. Everything <code>stub_status</code> lacks, from data you are already writing.</span></div>
  <div class="lz-layer"><span class="lz-lname">nginx-module-vts / njs / Nginx Plus API</span><span class="lz-lnote">Per-server-zone and per-upstream counters exposed directly, in Prometheus format. A third-party module or a paid product — worth it only once the two layers above are actually being read.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_stub_status_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_stub_status_module.html — the full definition of all seven counters, in about one page.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_core_module — worker_connections, worker_rlimit_nofile</span><span class="lc-sub">nginx.org/en/docs/ngx_core_module.html — the two directives behind the <code>accepts</code>/<code>handled</code> gap measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_access_module — allow / deny</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_access_module.html — evaluation order for the rules that returned 403 in the first measurement.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TLS and HTTP/2 — why a 1.0 requests-per-connection ratio is expensive</span><span class="lc-sub">Chapter 6 measured the cost of a handshake. That measurement is what makes this ratio worth watching.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2><code>stub_status</code>: bảy con số, và con số nói rằng bạn đang rơi mất lưu lượng</h2>
<p class="lead">Log kể cho bạn về những request ĐÃ xong. Nó không nói được ngay lúc này có bao nhiêu kết nối đang mở, hay chuyện Nginx vừa từ chối một cái. <code>stub_status</code> là câu trả lời có sẵn: bảy số nguyên, không phụ thuộc gì, và một trong số đó chính là ranh giới giữa một máy chủ đang BẬN và một máy chủ đang HỎNG.</p>

<h3>Bật nó lên</h3>
<pre><code>location = /trang-thai {
    stub_status;
    access_log off;              <span class="tok-comment"># bo giam sat hoi moi vai giay — dung ghi log</span>
    allow 10.0.0.0/8;            <span class="tok-comment"># chi mang noi bo</span>
    deny all;
}</code></pre>
<p>Dùng <code>location =</code>, đừng dùng tiền tố — Chương 2 đã đo chuyện một location tiền tố lặng lẽ tóm hết mọi thứ nằm dưới nó. Cặp <code>allow</code>/<code>deny</code> không phải tuỳ chọn; cái endpoint này khai với kẻ tấn công số kết nối đang sống và tốc độ lưu lượng của bạn. Đo từ một địa chỉ nằm ngoài dải được phép:</p>
<div class="out">ma tra ve khi 127.0.0.1 hoi /trang-thai (chi cho phep 10.0.0.0/8): 403
sau khi go allow/deny: 200</div>

<h3>Toàn bộ kết quả</h3>
<div class="out">Active connections: 1
server accepts handled requests
 463 463 31629
Reading: 0 Writing: 1 Waiting: 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Active connections</span><span class="v">Số kết nối client đang mở NGAY LÚC NÀY, tính cả kết nối keepalive đang nhàn rỗi và tính cả chính cái request đang hỏi trang này.</span></div>
  <div class="kv"><span class="k">accepts</span><span class="v">Tổng số kết nối Nginx đã nhận từ lúc khởi động. Chỉ tăng — bạn đọc nó thành tốc độ bằng cách lấy hiệu của hai lần lấy mẫu.</span></div>
  <div class="kv"><span class="k">handled</span><span class="v">Tổng số kết nối Nginx thật sự đã phục vụ. Bình thường thì y hệt <code>accepts</code>. Khi nó KHÔNG bằng, tức là bạn đang mất lưu lượng.</span></div>
  <div class="kv"><span class="k">requests</span><span class="v">Tổng số request HTTP. Lớn hơn <code>accepts</code> mỗi khi keepalive đang chạy, vì một kết nối chở nhiều request.</span></div>
  <div class="kv"><span class="k">Reading</span><span class="v">Số kết nối mà Nginx đang đọc header request từ client.</span></div>
  <div class="kv"><span class="k">Writing</span><span class="v">Số kết nối mà Nginx đang gửi phản hồi — bao gồm cả thời gian ngồi chờ upstream.</span></div>
  <div class="kv"><span class="k">Waiting</span><span class="v">Kết nối keepalive nhàn rỗi: đang mở, đang chiếm một file descriptor, và chẳng gửi gì.</span></div>
</div>

<h3>Reading / Writing / Waiting, đo thật</h3>
<p>Hai mươi request song song vào một tuyến mà backend ngủ 600 ms, lấy mẫu trong lúc chúng còn đang bay:</p>
<div class="out">=== nhan roi ===
Active connections: 1
Reading: 0 Writing: 1 Waiting: 0

=== 20 request song song toi /cham (600ms) ===
Active connections: 21
Reading: 0 Writing: 21 Waiting: 0

=== sau khi tai het ===
Active connections: 1
Reading: 0 Writing: 1 Waiting: 0</div>
<p>Hai mươi request đang bay cộng một cái đang hỏi trang trạng thái: <code>Active</code> 21, <code>Writing</code> 21. Để ý là cả hai mươi cái đều bị tính là <em>Writing</em> trong khi thực tế chúng đang NGỒI CHỜ một upstream chậm trả lời. <code>Writing</code> không có nghĩa là "đang gửi byte" — nó có nghĩa là "đã qua giai đoạn đọc request và chưa xong", mà với một con proxy thì đó chủ yếu là thời gian bị chặn ở backend.</p>
<p>Giờ tới tám kết nối keepalive, mở ra, dùng một lần, rồi giữ nguyên và để im:</p>
<div class="out">=== 8 ket noi keepalive DANG MO nhung KHONG gui gi ===
Active connections: 9
Reading: 0 Writing: 1 Waiting: 8

=== sau khi dong het 8 ket noi ===
Active connections: 1
Reading: 0 Writing: 1 Waiting: 0</div>
<div class="note-ct">Một con số <code>Waiting</code> lớn là bình thường và lành mạnh — đó chính là hình dạng của keepalive. Nó chỉ thành vấn đề khi nó tiến gần tới <code>worker_connections × worker_processes</code>, vì một kết nối nhàn rỗi vẫn chiếm một chỗ. Đó là việc của <code>keepalive_timeout</code>, và con số để đối chiếu chính là con số đo ngay dưới đây.</div>

<h3><code>accepts</code> ≠ <code>handled</code>: con số chẳng ai nhìn</h3>
<p>Trên một máy chủ khoẻ mạnh thì hai con số này LUÔN bằng nhau, và chính vì thế mà khoảng cách giữa chúng rất dễ bị bỏ sót — nhìn cứ tưởng là một cái lặp lại. Để cho thấy nó có nghĩa gì, đây là một máy chủ cố tình cấu hình <code>worker_connections 4</code>, rồi ăn bốn mươi request chậm song song:</p>
<div class="out">=== truoc khi ep tai (worker_connections 4) ===
Active connections: 1
server accepts handled requests
 1 1 1

--- ban 40 ket noi song song vao /cham (600ms) ---
[6]   Exit 52   curl -s -o /dev/null --max-time 4 http://127.0.0.1:9350/cham

=== sau khi ep tai ===
server accepts handled requests
 42 3 3

--- error log ---
[alert] 24333#24333: 4 worker_connections are not enough
[alert] 24333#24333: 4 worker_connections are not enough
[alert] 24333#24333: 4 worker_connections are not enough</div>
<div class="callout warn"><strong>Bốn mươi hai cái được nhận, ba cái được phục vụ.</strong> Ba mươi chín kết nối đã bị nhấc khỏi hàng đợi của nhân rồi bị VỨT, vì không còn chỗ kết nối nào để đặt chúng vào. Phía client thấy <code>curl: (52) Empty reply from server</code> — không mã trạng thái, không trang lỗi, không có gì để ghi một phản hồi HTTP nào cả. Trong access log, mấy request đó <em>KHÔNG TỒN TẠI</em>. Chỉ có đúng hai chỗ nhìn thấy được chuyện này: khoảng cách <code>accepts</code>/<code>handled</code>, và dòng <code>[alert]</code> trong error log.</div>
<p>Đó là lý do cặp số này quan trọng hơn mọi thứ khác trên trang. Mọi con số còn lại đều mô tả công việc ĐÃ thành công. Cặp này là bộ đếm có sẵn DUY NHẤT cho phần công việc đã lặng lẽ không thành.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cảnh báo trên HIỆU SỐ, đừng cảnh báo trên giá trị</span><span class="lz-d">Lấy mẫu cả hai, trừ đi, và báo động nếu <code>accepts - handled</code> tăng lên dù chỉ một chút giữa hai lần lấy mẫu. Giá trị tuyệt đối vô nghĩa; bất kỳ mức tăng nào của khoảng cách đó đều là một sự cố đang diễn ra.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Thủ phạm thường gặp là <code>worker_connections</code></span><span class="lz-d">Mặc định là 512 hoặc 1024 tuỳ bản dựng. Mỗi request đi qua proxy dùng HAI chỗ — một tới client, một tới upstream — nên một con proxy hết chỗ ở đúng một nửa con số bạn tưởng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thủ phạm thứ hai là file descriptor</span><span class="lz-d">Nâng <code>worker_connections</code> lên cao hơn <code>RLIMIT_NOFILE</code> của tiến trình thì chẳng được gì. Nâng <code>worker_rlimit_nofile</code> lên cùng, và soi error log tìm dòng <code>Too many open files</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Trần là TÍCH của hai số</span><span class="lz-d">Số kết nối đồng thời tối đa là <code>worker_processes × worker_connections</code>. Với <code>worker_processes auto</code> trên bốn nhân và mặc định 1024, đó là 4096 — chia đôi còn khoảng 2048 cho một con reverse proxy thuần.</span></div>
</div>

<h3>Một con số suy ra được, đáng giá hơn mọi con số thô</h3>
<p>Lấy <code>requests</code> chia cho <code>accepts</code> ra số request trên mỗi kết nối, và đó là một phép đọc trực tiếp xem keepalive có đang chạy hay không. Ba mươi request gửi theo hai kiểu, đo bằng hiệu số trên các bộ đếm:</p>
<div class="out">=== 30 request, KHONG keepalive (curl rieng le) ===
  accepts +31   handled +31   requests +31
  → 1.0 request moi ket noi

=== 30 request, CO keepalive (mot ket noi) ===
  accepts +2   handled +2   requests +31
  → 15.5 request moi ket noi</div>
<p>Một tỉ số quanh 1,0 nghĩa là MỌI request đều đang trả giá cho một lần bắt tay TCP mới — và nếu có TLS thì thêm một lần bắt tay TLS mới nữa, thứ mà Chương 6 đã đo là đắt nhất trong cả cuộc kết nối. Thấy 1,0 trên một website lẽ ra phải có keepalive thì hãy nghi một header <code>Connection</code> bị lược mất, một <code>keepalive_timeout 0</code>, hoặc một bộ cân bằng tải đứng phía trước mà không tái dùng kết nối.</p>
<div class="pitfall"><strong>Bẫy — cái endpoint trạng thái tự đếm CHÍNH NÓ.</strong> Cả hai lần đo ở trên đều có thêm một kết nối và một request mà phép thử không hề gửi: chính cái <code>curl</code> đi lấy trang trạng thái. Trong trường hợp keepalive, riêng một lần hỏi đó kéo tỉ số tính ra từ 30,0 xuống 15,5 — sai 48%, chỉ vì MỘT request. Một tác nhân giám sát hỏi mỗi 5 giây sẽ cộng thêm 17.280 kết nối mỗi ngày vào <code>accepts</code>, và tất cả đều có số request/kết nối đúng bằng 1. Trên một website ít lưu lượng thì chừng đó đủ làm cái tỉ số thành vô nghĩa. Hãy hỏi qua một kết nối keepalive, hoặc trừ phần của chính bộ giám sát ra trước khi tin con số đó.</div>

<h3>Những gì <code>stub_status</code> KHÔNG nói được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có mã trạng thái</span><span class="v">Một máy chủ trả 100% mã 502 trông y hệt một máy khoẻ mạnh. Mọi request đã sinh ra một phản hồi đều được tính là <code>handled</code>.</span></div>
  <div class="kv"><span class="k">Không có độ trễ</span><span class="v">Chẳng có gì về chuyện cái gì mất bao lâu. <code>Writing</code> cao thì gợi ý upstream chậm, nhưng nó không ĐO cái đó.</span></div>
  <div class="kv"><span class="k">Không tách theo location hay upstream</span><span class="v">Bảy con số cho cả máy chủ. Bạn không biết được virtual host nào, tuyến nào hay backend nào chịu trách nhiệm cho bất kỳ con số nào.</span></div>
  <div class="kv"><span class="k">Về 0 khi khởi động lại</span><span class="v">Các bộ đếm tính theo vòng đời tiến trình. Nạp lại thì giữ nguyên; khởi động lại thì về 0, và một hệ giám sát không xử lý chuyện bộ đếm bị đặt lại sẽ vẽ ra một cái gai âm rất lớn.</span></div>
</div>
<p>Khoảng trống đó là cố ý — <code>stub_status</code> chỉ là vài trăm dòng C không phải giữ trạng thái gì. Cho mã trạng thái và độ trễ thì câu trả lời chính là access log ở Bài 10.1 và 10.2: đẩy nó đi, rồi suy ra tốc độ, tỉ lệ lỗi và các phân vị từ chính những trường bạn đã chọn ghi. Cặp đó — <code>stub_status</code> cho sức khoẻ kết nối, access log cho sức khoẻ request — phủ được đúng thứ mà một module giám sát thương mại đem lại, với lợi thế là bạn đã sẵn có cả hai.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">stub_status</span><span class="lz-lnote">Miễn phí, có sẵn, luôn dùng được. Sức khoẻ ở mức KẾT NỐI: đang mở bao nhiêu, và có cái nào đang bị vứt không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Access log + một bộ đẩy log</span><span class="lz-lnote">Sức khoẻ ở mức REQUEST: mã trạng thái, phân vị độ trễ, tách theo tuyến và theo upstream. Mọi thứ <code>stub_status</code> thiếu, lấy từ dữ liệu bạn vốn đã ghi ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">nginx-module-vts / njs / Nginx Plus API</span><span class="lz-lnote">Bộ đếm theo từng vùng server và từng upstream, phơi thẳng ra ở định dạng Prometheus. Là module bên thứ ba hoặc sản phẩm trả tiền — chỉ đáng khi hai lớp trên đã thật sự có người đọc.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_stub_status_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_stub_status_module.html — định nghĩa đầy đủ cả bảy bộ đếm, gọn trong khoảng một trang.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_core_module — worker_connections, worker_rlimit_nofile</span><span class="lc-sub">nginx.org/en/docs/ngx_core_module.html — hai chỉ thị nằm sau khoảng cách <code>accepts</code>/<code>handled</code> đo ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_access_module — allow / deny</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_access_module.html — thứ tự đánh giá của mấy luật đã trả về 403 ở phép đo đầu bài.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TLS và HTTP/2 — vì sao tỉ số 1,0 request mỗi kết nối là đắt</span><span class="lc-sub">Chương 6 đã đo cái giá của một lần bắt tay. Chính phép đo đó làm cho tỉ số này đáng theo dõi.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Quiz: logs and observability|||10.6 — Quiz: log và quan sát',
      slug: 'nginx-10-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một định dạng log bỏ sót gần hết, một dòng JSON hỏng cú pháp mà nginx -t vẫn cho qua, 900 syscall không đo được bằng đồng hồ, và ba mươi chín kết nối biến mất không để lại dấu vết nào trong access log.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Quiz: logs and observability</h2>
<p class="lead">Eight questions from a chapter where two measurements disagreed with each other and a third disagreed with the advice in every tuning guide.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> The <code>combined</code> format records none of what a proxy does — no upstream address, no upstream timing, no cache status — and the same three requests through a proxy-aware format showed that 0.603 s of a 0.603 s request belonged entirely to the backend (10.1). <code>escape=json</code> is not cosmetic: the default escape turns <code>Chào bạn</code> into <code>Ch\\xC3\\xA0o b\\xE1\\xBA\\xA1n</code>, one hex pair per byte, and a bare <code>\$upstream_response_time</code> produces <code>"tgian_up":,</code> — broken JSON — on every request Nginx answers without an upstream, while passing <code>nginx -t</code> and working perfectly for everything proxied (10.2). Unbuffered logging costs exactly one <code>write()</code> syscall per request, <code>buffer=64k</code> collapsed 900 of them into 1 with no lines lost, and five rounds of 900 requests found <em>no measurable time difference</em> between logging off, logging on, and logging buffered (10.3). At <code>debug</code>, one trivial request wrote 86 lines and 5,913 bytes — 52× a combined access-log line, 5.5 GB per million requests — and <code>debug_connection</code> filters nothing unless the base level is something other than <code>debug</code>, because it grants debug rather than restricting it (10.4). And <code>stub_status</code> under a deliberate <code>worker_connections 4</code> reported <code>accepts 42, handled 3</code>: thirty-nine dropped connections that appear nowhere in the access log at all (10.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>Quiz: log và quan sát</h2>
<p class="lead">Tám câu ra từ một chương mà hai phép đo mâu thuẫn với nhau, còn phép đo thứ ba mâu thuẫn với lời khuyên trong mọi cuốn hướng dẫn tối ưu.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Định dạng <code>combined</code> không ghi lại gì trong những việc một con proxy làm — không địa chỉ upstream, không thời gian upstream, không trạng thái bộ đệm — và cùng ba request ấy qua một định dạng viết cho proxy cho thấy 0,603 giây trong một request 0,603 giây thuộc trọn về backend (10.1). <code>escape=json</code> không phải chuyện hình thức: escape mặc định biến <code>Chào bạn</code> thành <code>Ch\\xC3\\xA0o b\\xE1\\xBA\\xA1n</code>, mỗi byte một cặp hex, còn một <code>\$upstream_response_time</code> để trần sinh ra <code>"tgian_up":,</code> — JSON hỏng cú pháp — trên MỌI request mà Nginx tự trả lời không qua upstream, trong khi vẫn qua được <code>nginx -t</code> và chạy hoàn hảo với mọi thứ đi qua proxy (10.2). Ghi log không đệm tốn đúng một syscall <code>write()</code> mỗi request, <code>buffer=64k</code> gom 900 cái đó thành 1 mà không mất dòng nào, và năm lượt 900 request KHÔNG tìm ra <em>khác biệt thời gian đo được nào</em> giữa tắt log, bật log, và log có đệm (10.3). Ở mức <code>debug</code>, một request tầm thường ghi ra 86 dòng và 5.913 byte — gấp 52 lần một dòng access log combined, 5,5 GB cho mỗi triệu request — còn <code>debug_connection</code> chẳng lọc gì cả trừ khi mức nền là thứ khác <code>debug</code>, vì nó CẤP quyền debug chứ không hạn chế (10.4). Và <code>stub_status</code> dưới một <code>worker_connections 4</code> cố tình đặt chật báo <code>accepts 42, handled 3</code>: ba mươi chín kết nối bị vứt mà chẳng xuất hiện ở đâu trong access log (10.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A request logged $request_time 0.603 and $upstream_response_time 0.603. Where is the time going?|||Một request ghi $request_time 0,603 và $upstream_response_time 0,603. Thời gian đi đâu?',
            options: [
              'Nginx is slow and needs more workers|||Nginx chậm, cần thêm worker',
              'Entirely in the backend — Nginx added nothing measurable, so tuning Nginx will not help|||Toàn bộ nằm ở backend — Nginx không thêm gì đo được, nên chỉnh Nginx sẽ không giúp gì',
              'The client had a slow network|||Client có mạng chậm',
              'The two fields always match, so it tells you nothing|||Hai trường đó luôn bằng nhau nên chẳng nói lên điều gì',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'Why does escape=json matter more for a Vietnamese-language site than for an English one?|||Vì sao escape=json quan trọng với một website tiếng Việt hơn là với một website tiếng Anh?',
            options: [
              'It compresses Vietnamese text better|||Nó nén chữ tiếng Việt tốt hơn',
              'The default escape writes every non-ASCII byte as \\xNN, so Vietnamese becomes unreadable hex — escape=json is the only mode that leaves it legible|||Escape mặc định ghi mọi byte ngoài ASCII thành \\xNN, nên tiếng Việt thành mã hex không đọc nổi — escape=json là chế độ duy nhất giữ nó đọc được',
              'Vietnamese URLs are longer|||URL tiếng Việt dài hơn',
              'It does not — escape is only about quotes|||Không hơn gì — escape chỉ liên quan tới dấu ngoặc kép',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'A JSON log format with a bare "tgian_up":$upstream_response_time passes nginx -t and works in testing. When does it break?|||Một định dạng log JSON có "tgian_up":$upstream_response_time để trần thì qua được nginx -t và chạy tốt lúc thử. Khi nào nó vỡ?',
            options: [
              'When the upstream is slow|||Khi upstream chậm',
              'On every request Nginx answers itself — health checks, redirects, static files — because the empty variable yields "tgian_up":, which is not valid JSON|||Trên MỌI request Nginx tự trả lời — health check, redirect, tệp tĩnh — vì biến rỗng cho ra "tgian_up":, và đó không phải JSON hợp lệ',
              'Only under high load|||Chỉ khi tải cao',
              'Never — nginx -t would have caught it|||Không bao giờ — nginx -t đã bắt được rồi',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'strace showed unbuffered logging costs one extra write() per request, yet five rounds of 900 requests found no time difference between logging on and off. What is the right conclusion?|||strace cho thấy ghi log không đệm tốn thêm một write() mỗi request, nhưng năm lượt 900 request không tìm ra khác biệt thời gian nào giữa bật và tắt log. Kết luận đúng là gì?',
            options: [
              'The strace measurement was wrong|||Phép đo bằng strace sai',
              'Both are right — the syscall is real but costs far less than the ~37 µs of serving a request, so "turn off the access log for speed" has no measurable benefit here|||Cả hai đều đúng — cái syscall là có thật nhưng tốn ít hơn hẳn so với ~37 µs để phục vụ một request, nên "tắt access log cho nhanh" không đem lại lợi ích đo được ở đây',
              'The benchmark should have used more requests|||Phép đo lẽ ra phải dùng nhiều request hơn',
              'Logging is free on every system|||Ghi log là miễn phí trên mọi hệ thống',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A server block declares four access_log directives. A location inside it says access_log off. What happens?|||Một khối server khai bốn chỉ thị access_log. Một location bên trong nó ghi access_log off. Chuyện gì xảy ra?',
            options: [
              'Only the first log is disabled|||Chỉ cái log đầu tiên bị tắt',
              'All four are silenced for that location — off is all-or-nothing, so to keep one you must re-declare it inside the location|||Cả bốn đều câm trong location đó — off là tắt sạch, muốn giữ lại một cái thì phải khai lại nó bên trong location',
              'Nginx refuses to start|||Nginx từ chối khởi động',
              'The logs continue but are buffered|||Các log vẫn chạy nhưng bị đệm lại',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'You set error_log debug and add debug_connection for your own IP, expecting only your traffic to be debugged. The measurement showed no filtering at all. Why?|||Bạn đặt error_log debug rồi thêm debug_connection cho IP của mình, tưởng chỉ lưu lượng của mình bị debug. Phép đo cho thấy không lọc gì cả. Vì sao?',
            options: [
              'debug_connection only accepts single IPs, not ranges|||debug_connection chỉ nhận IP đơn lẻ, không nhận dải',
              'debug_connection raises matching connections to debug from the base level — it never restricts, so with the base already at debug everything is debugged|||debug_connection NÂNG những kết nối khớp lên mức debug từ mức nền — nó không bao giờ hạn chế, nên khi mức nền đã là debug thì mọi thứ đều bị debug',
              'It must go in the http block, not events|||Nó phải nằm trong khối http, không phải events',
              'The build lacked --with-debug|||Bản dựng thiếu --with-debug',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Server A inherits the main-level error_log; server B declares its own. Where do the errors from server B appear?|||Server A kế thừa error_log mức chính; server B khai riêng một cái. Lỗi của server B xuất hiện ở đâu?',
            options: [
              'In both files|||Ở cả hai tệp',
              'Only in the file B declared — declaring error_log in a context discards the inherited one entirely|||Chỉ trong tệp riêng của B — khai error_log trong một ngữ cảnh là vứt bỏ hoàn toàn cái đã kế thừa',
              'Only in the main-level file|||Chỉ trong tệp mức chính',
              'Nowhere, because the two conflict|||Không ở đâu cả, vì hai cái xung đột',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'stub_status reports accepts 42, handled 3. What happened, and where else can you see it?|||stub_status báo accepts 42, handled 3. Chuyện gì đã xảy ra, và còn nhìn thấy nó ở đâu nữa?',
            options: [
              'Thirty-nine requests returned 502 — visible in the access log|||Ba mươi chín request trả về 502 — thấy được trong access log',
              'Thirty-nine connections were accepted then dropped for lack of a connection slot; they produce no HTTP response at all, so the only other trace is the [alert] worker_connections are not enough in the error log|||Ba mươi chín kết nối được nhận rồi bị vứt vì hết chỗ kết nối; chúng không sinh ra phản hồi HTTP nào, nên dấu vết duy nhất còn lại là dòng [alert] worker_connections are not enough trong error log',
              'The counters simply reset|||Các bộ đếm chỉ bị đặt lại thôi',
              'Thirty-nine were served from cache|||Ba mươi chín cái được phục vụ từ bộ đệm',
            ],
            correctIndex: 1,
            points: 15,
          },
        ],
      },
    },
  ],
};
