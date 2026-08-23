const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 11 — Diagnosis: making Nginx tell you what it did|||Chương 11 — Chẩn đoán: bắt Nginx khai ra nó đã làm gì',
  description: 'Mọi chương trước đều đo một cơ chế. Chương này gộp chúng lại thành một quy trình: bắt Nginx tự khai khối nào đã xử lý request, biết chính xác nginx -t chứng minh được gì và KHÔNG chứng minh được gì, đọc một cấu hình do người khác viết, và đi từ một mã lỗi tới đúng nguyên nhân.',
  lessons: [

    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — Making Nginx tell you which block handled the request|||11.1 — Bắt Nginx khai ra khối nào đã xử lý request',
      slug: 'nginx-11-1-bat-nginx-khai-ra',
      type: 'LESSON',
      description: 'Kỹ thuật gỡ lỗi hữu ích nhất trong cả khoá, và cái bẫy làm hỏng phiên bản ngây thơ của nó — bẫy đó đã bắt chính tôi trong lúc dựng bài này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Making Nginx tell you which block handled the request</h2>
<p class="lead">Almost every Nginx problem is one of two questions: which <code>server</code> block took this request, and which <code>location</code> inside it. Chapters 1 and 2 measured the rules. In production you do not want to re-derive them from a config someone else wrote — you want the server to say so out loud.</p>

<h3>The technique</h3>
<p><code>add_header</code> can emit any variable, so it can emit the answer. The naive version puts one header at server level and one in each location:</p>
<pre><code>server {
    server_name shop.vidu;
    add_header X-Kh-Server "shop.vidu" always;
    location = /gio-hang { add_header X-Kh-Loc "= /gio-hang" always; ... }
    location ~ ^/api     { add_header X-Kh-Loc "~ ^/api" always; ... }
    location /api/v1     { add_header X-Kh-Loc "/api/v1 (tien to)" always; ... }
    location /           { add_header X-Kh-Loc "/ (tien to)" always; ... }
}</code></pre>
<p>Measured against four requests, that gives:</p>
<div class="out">shop.vidu        /gio-hang              → X-Kh-Loc: = /gio-hang
shop.vidu        /api/v1/nguoi-dung     → X-Kh-Loc: ~ ^/api
shop.vidu        /gioi-thieu            → X-Kh-Loc: / (tien to)
khong-biet.vidu  /api/v1                → X-Kh-Loc: /</div>
<p>The location header is there. <code>X-Kh-Server</code> is not — on any of the four. It was declared, the config passed <code>nginx -t</code>, and it silently did not appear.</p>

<h3>The trap: <code>add_header</code> replaces, it does not accumulate</h3>
<p>This is the single most surprising inheritance rule in Nginx, and it broke the debugging tool I was building for this lesson before it broke anything else. Isolating it — one request to a location that declares its own <code>add_header</code>, one to a location that does not:</p>
<div class="out">=== location KHONG co add_header rieng (ke thua duoc muc server) ===
X-Kh-Server: shop.vidu

=== location CO add_header rieng (che mat muc server) ===
X-Kh-Loc: = /gio-hang</div>
<div class="pitfall"><strong>Bẫy — one <code>add_header</code> in a location discards every <code>add_header</code> from above it.</strong> Not the one with the same name — <em>all</em> of them. The rule is the same one Chapter 10 measured for <code>error_log</code>: directives of this kind inherit only while the child context declares none of them. Declare one and the whole inherited set is gone. This is how a <code>Strict-Transport-Security</code> or <code>X-Frame-Options</code> header set once at server level quietly stops being sent on exactly the routes that later grew a <code>Cache-Control</code> header of their own — and nothing warns you.</div>
<p>It is worth pausing on how that failure looks from outside. The config is valid. The headers you can see are correct. The header that vanished is one you were not looking at, on a subset of routes you did not test. Chapter 6 built a TLS configuration whose security headers live at server level; every location added later is a chance to lose them.</p>

<h3>The version that works</h3>
<p>Keep exactly one <code>add_header</code>, at server level, and have each location write into a variable that the header reads:</p>
<pre><code>server {
    listen 127.0.0.1:9370;
    server_name shop.vidu;
    set \$khop "(khong dat)";
    <span class="tok-comment"># MOT add_header duy nhat — khong location nao che duoc no</span>
    add_header X-Kh "server=\$server_name loc=\$khop" always;

    location = /gio-hang { set \$khop "= /gio-hang";        return 200 "chinh xac\\n"; }
    location ~ ^/api     { set \$khop "~ ^/api";            return 200 "regex\\n"; }
    location /api/v1     { set \$khop "/api/v1 (tien to)";  return 200 "tien to\\n"; }
    location /           { set \$khop "/ (tien to)";        return 200 "goc\\n"; }
}</code></pre>
<p>Headers are rendered when the response is sent, after the location has run, so the server-level header sees whatever the matched location assigned. Five requests, including one to a hostname no <code>server_name</code> claims:</p>
<div class="out">shop.vidu        /gio-hang              → X-Kh: server=shop.vidu loc== /gio-hang
shop.vidu        /api/v1/nguoi-dung     → X-Kh: server=shop.vidu loc=~ ^/api
shop.vidu        /api/v1                → X-Kh: server=shop.vidu loc=~ ^/api
shop.vidu        /gioi-thieu            → X-Kh: server=shop.vidu loc=/ (tien to)
khong-biet.vidu  /bat-ky                → X-Kh: server=_ loc=/</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The last line proves the default-server rule</span><span class="lz-d"><code>server=_</code> means an unmatched hostname fell through to the <code>default_server</code>, exactly as Chapter 1 measured. In production this is the fastest way to find out that a new domain was pointed at your IP without a <code>server</code> block being written for it.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lines 2 and 3 prove a block is dead code</span><span class="lz-d">Both <code>/api/v1/nguoi-dung</code> and <code>/api/v1</code> report <code>~ ^/api</code>. The regex is tried after the longest prefix and wins, so <code>location /api/v1</code> can never be reached by anything. Chapter 2 explained the rule; this header found the instance.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>always</code> is what makes it useful</span><span class="lz-d">Without <code>always</code>, <code>add_header</code> only fires on 2xx and a few 3xx. The requests you most need to explain are the 404s, 502s and 403s — precisely the ones a header without <code>always</code> will not appear on.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Add <code>\$upstream_addr</code> when proxying</span><span class="lz-d">One more field on the same header answers "which backend served this", which is the Chapter 9 question. It costs nothing and turns an unreproducible complaint into a specific machine.</span></div>
</div>

<h3>Reading it from the client side</h3>
<pre><code><span class="tok-comment"># toan bo header, khong tai than phan hoi</span>
curl -s -D- -o /dev/null https://cuongthai.com/api/v1/bai-viet

<span class="tok-comment"># chi lay dong chan doan</span>
curl -s -D- -o /dev/null https://cuongthai.com/duong-dan | grep -i '^x-kh'

<span class="tok-comment"># gia lam mot ten mien khac ma khong dung toi DNS</span>
curl -s -D- -o /dev/null -H 'Host: shop.vidu' http://127.0.0.1/duong-dan</code></pre>
<div class="note-ct">That last form is the one to remember. It asks a specific server, on a specific port, to answer as a specific hostname — which lets you test a <code>server_name</code> before the DNS record exists, and lets you check on the machine itself whether a problem is in Nginx or somewhere between the client and Nginx.</div>

<h3>Take it back out</h3>
<div class="callout warn"><strong>These headers are for diagnosis, not for production.</strong> They tell anyone who asks how your configuration is structured — which hostnames exist on the machine, how routes are split, which backend answered. That is reconnaissance handed over for free. Gate them, or remove them once the question is answered.</div>
<p>The gate that costs nothing is the <code>map</code> from Chapter 8, so the header is emitted only for your own address:</p>
<pre><code>map \$remote_addr \$kh_debug {
    default            "";                       <span class="tok-comment"># rong ⇒ add_header khong gui gi</span>
    "203.0.113.42"     "server=\$server_name loc=\$khop";
}
server {
    add_header X-Kh \$kh_debug always;
}</code></pre>
<p>An <code>add_header</code> whose value is an empty string sends nothing at all, so the header simply does not exist for everyone else. That is the same shape as <code>debug_connection</code> in Chapter 10: full detail for one address, silence for the rest.</p>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_headers_module — add_header</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_headers_module.html — the inheritance sentence that explains the vanished header, and what <code>always</code> changes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_rewrite_module — set</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_rewrite_module.html — when <code>set</code> runs relative to the location match, which is why the trick above works.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 1 — how a request finds a server block</span><span class="lc-sub">The rule behind <code>server=_</code> on the last measured line.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 2 — which location wins</span><span class="lc-sub">The rule that makes <code>location /api/v1</code> unreachable when a regex matches first.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Bắt Nginx khai ra khối nào đã xử lý request</h2>
<p class="lead">Gần như mọi sự cố Nginx đều quy về hai câu hỏi: khối <code>server</code> nào đã nhận request này, và khối <code>location</code> nào bên trong nó. Chương 1 và Chương 2 đã đo các luật đó. Nhưng trên production bạn KHÔNG muốn ngồi suy lại các luật ấy từ một tệp cấu hình do người khác viết — bạn muốn chính máy chủ nói ra thành tiếng.</p>

<h3>Kỹ thuật</h3>
<p><code>add_header</code> phát ra được bất kỳ biến nào, nên nó phát ra được câu trả lời. Phiên bản ngây thơ đặt một header ở mức server và một header trong mỗi location:</p>
<pre><code>server {
    server_name shop.vidu;
    add_header X-Kh-Server "shop.vidu" always;
    location = /gio-hang { add_header X-Kh-Loc "= /gio-hang" always; ... }
    location ~ ^/api     { add_header X-Kh-Loc "~ ^/api" always; ... }
    location /api/v1     { add_header X-Kh-Loc "/api/v1 (tien to)" always; ... }
    location /           { add_header X-Kh-Loc "/ (tien to)" always; ... }
}</code></pre>
<p>Đo với bốn request thì ra thế này:</p>
<div class="out">shop.vidu        /gio-hang              → X-Kh-Loc: = /gio-hang
shop.vidu        /api/v1/nguoi-dung     → X-Kh-Loc: ~ ^/api
shop.vidu        /gioi-thieu            → X-Kh-Loc: / (tien to)
khong-biet.vidu  /api/v1                → X-Kh-Loc: /</div>
<p>Header của location thì có. <code>X-Kh-Server</code> thì KHÔNG — không có ở cái nào trong bốn cái. Nó đã được khai, cấu hình qua được <code>nginx -t</code>, và nó lặng lẽ không xuất hiện.</p>

<h3>Cái bẫy: <code>add_header</code> THAY THẾ, chứ không cộng dồn</h3>
<p>Đây là luật kế thừa gây bất ngờ nhất trong Nginx, và nó đã làm hỏng chính cái công cụ gỡ lỗi tôi đang dựng cho bài này trước khi nó kịp làm hỏng thứ gì khác. Tách riêng nó ra — một request tới location CÓ khai <code>add_header</code> riêng, một request tới location KHÔNG khai:</p>
<div class="out">=== location KHONG co add_header rieng (ke thua duoc muc server) ===
X-Kh-Server: shop.vidu

=== location CO add_header rieng (che mat muc server) ===
X-Kh-Loc: = /gio-hang</div>
<div class="pitfall"><strong>Bẫy — một <code>add_header</code> trong location vứt bỏ MỌI <code>add_header</code> ở cấp trên nó.</strong> Không phải chỉ cái trùng tên — mà <em>tất cả</em>. Luật này y hệt luật mà Chương 10 đã đo với <code>error_log</code>: những chỉ thị loại này chỉ được kế thừa chừng nào ngữ cảnh con KHÔNG khai cái nào. Khai một cái là cả bộ kế thừa biến mất. Đây chính là cách mà một header <code>Strict-Transport-Security</code> hay <code>X-Frame-Options</code> đặt một lần ở mức server lặng lẽ ngừng được gửi trên đúng những tuyến về sau mọc thêm một header <code>Cache-Control</code> riêng — và chẳng có gì cảnh báo bạn.</div>
<p>Đáng dừng lại một chút ở chỗ kiểu hỏng đó trông như thế nào từ bên ngoài. Cấu hình hợp lệ. Những header bạn NHÌN THẤY đều đúng. Cái header biến mất lại là cái bạn không để ý, trên một nhóm tuyến bạn không thử. Chương 6 đã dựng một cấu hình TLS mà các header bảo mật nằm ở mức server; mỗi location thêm vào sau đó là một cơ hội đánh mất chúng.</p>

<h3>Phiên bản chạy được</h3>
<p>Giữ ĐÚNG một <code>add_header</code>, ở mức server, và để mỗi location ghi vào một biến mà cái header đó đọc:</p>
<pre><code>server {
    listen 127.0.0.1:9370;
    server_name shop.vidu;
    set \$khop "(khong dat)";
    <span class="tok-comment"># MOT add_header duy nhat — khong location nao che duoc no</span>
    add_header X-Kh "server=\$server_name loc=\$khop" always;

    location = /gio-hang { set \$khop "= /gio-hang";        return 200 "chinh xac\\n"; }
    location ~ ^/api     { set \$khop "~ ^/api";            return 200 "regex\\n"; }
    location /api/v1     { set \$khop "/api/v1 (tien to)";  return 200 "tien to\\n"; }
    location /           { set \$khop "/ (tien to)";        return 200 "goc\\n"; }
}</code></pre>
<p>Header được dựng lúc phản hồi được gửi đi, tức là SAU khi location đã chạy, nên cái header ở mức server nhìn thấy bất cứ giá trị nào mà location khớp đã gán. Năm request, trong đó có một cái tới tên miền chẳng <code>server_name</code> nào nhận:</p>
<div class="out">shop.vidu        /gio-hang              → X-Kh: server=shop.vidu loc== /gio-hang
shop.vidu        /api/v1/nguoi-dung     → X-Kh: server=shop.vidu loc=~ ^/api
shop.vidu        /api/v1                → X-Kh: server=shop.vidu loc=~ ^/api
shop.vidu        /gioi-thieu            → X-Kh: server=shop.vidu loc=/ (tien to)
khong-biet.vidu  /bat-ky                → X-Kh: server=_ loc=/</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dòng cuối chứng minh luật default_server</span><span class="lz-d"><code>server=_</code> nghĩa là một tên miền không khớp đã rơi xuống <code>default_server</code>, đúng như Chương 1 đã đo. Trên production đây là cách nhanh nhất để phát hiện có người trỏ một tên miền mới vào IP của bạn mà chưa ai viết khối <code>server</code> cho nó.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dòng 2 và 3 chứng minh một khối là mã chết</span><span class="lz-d">Cả <code>/api/v1/nguoi-dung</code> lẫn <code>/api/v1</code> đều báo <code>~ ^/api</code>. Regex được thử sau tiền tố dài nhất và nó THẮNG, nên <code>location /api/v1</code> không bao giờ có thứ gì với tới được. Chương 2 giải thích luật; cái header này tìm ra ca cụ thể.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>always</code> mới là thứ làm nó hữu dụng</span><span class="lz-d">Không có <code>always</code> thì <code>add_header</code> chỉ bắn ở 2xx và vài mã 3xx. Mà những request bạn cần giải thích nhất lại là 404, 502 và 403 — đúng những cái mà một header thiếu <code>always</code> sẽ không xuất hiện.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Thêm <code>\$upstream_addr</code> khi có proxy</span><span class="lz-d">Một trường nữa trên cùng cái header đó trả lời câu "backend nào đã phục vụ cái này" — câu hỏi của Chương 9. Nó chẳng tốn gì và biến một lời than phiền không tái hiện nổi thành một cái máy cụ thể.</span></div>
</div>

<h3>Đọc nó từ phía client</h3>
<pre><code><span class="tok-comment"># toan bo header, khong tai than phan hoi</span>
curl -s -D- -o /dev/null https://cuongthai.com/api/v1/bai-viet

<span class="tok-comment"># chi lay dong chan doan</span>
curl -s -D- -o /dev/null https://cuongthai.com/duong-dan | grep -i '^x-kh'

<span class="tok-comment"># gia lam mot ten mien khac ma khong dung toi DNS</span>
curl -s -D- -o /dev/null -H 'Host: shop.vidu' http://127.0.0.1/duong-dan</code></pre>
<div class="note-ct">Dạng cuối cùng mới là dạng đáng nhớ. Nó bảo một máy chủ cụ thể, trên một cổng cụ thể, hãy trả lời như thể nó là một tên miền cụ thể — nhờ đó bạn thử được một <code>server_name</code> TRƯỚC KHI bản ghi DNS tồn tại, và kiểm được ngay trên máy xem vấn đề nằm ở Nginx hay nằm đâu đó giữa client và Nginx.</div>

<h3>Rồi gỡ nó ra</h3>
<div class="callout warn"><strong>Mấy header này để chẩn đoán, không phải để chạy production.</strong> Chúng kể cho bất cứ ai hỏi biết cấu hình của bạn được dựng ra sao — trên máy có những tên miền nào, các tuyến chia thế nào, backend nào đã trả lời. Đó là trinh sát được dâng miễn phí. Hãy khoá chúng lại, hoặc gỡ hẳn khi đã trả lời xong câu hỏi.</div>
<p>Cái khoá chẳng tốn gì chính là <code>map</code> ở Chương 8, để header chỉ phát ra cho riêng địa chỉ của bạn:</p>
<pre><code>map \$remote_addr \$kh_debug {
    default            "";                       <span class="tok-comment"># rong ⇒ add_header khong gui gi</span>
    "203.0.113.42"     "server=\$server_name loc=\$khop";
}
server {
    add_header X-Kh \$kh_debug always;
}</code></pre>
<p>Một <code>add_header</code> có giá trị là chuỗi rỗng thì không gửi gì cả, nên với mọi người khác cái header đó đơn giản là không tồn tại. Đó đúng là hình dạng của <code>debug_connection</code> ở Chương 10: chi tiết đầy đủ cho một địa chỉ, im lặng với phần còn lại.</p>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_headers_module — add_header</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_headers_module.html — đúng cái câu về kế thừa giải thích chuyện header biến mất, và <code>always</code> thay đổi điều gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_rewrite_module — set</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_rewrite_module.html — <code>set</code> chạy vào lúc nào so với việc khớp location, và đó là lý do mẹo ở trên chạy được.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 1 — một request tìm ra khối server thế nào</span><span class="lc-sub">Cái luật nằm sau <code>server=_</code> ở dòng đo cuối cùng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 2 — location nào thắng</span><span class="lc-sub">Cái luật làm cho <code>location /api/v1</code> không thể với tới được khi có một regex khớp trước.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — What nginx -t proves, and what it does not|||11.2 — nginx -t chứng minh được gì, và KHÔNG chứng minh được gì',
      slug: 'nginx-11-2-nginx-t-chung-minh-gi',
      type: 'LESSON',
      description: 'Tám kiểu lỗi đưa qua nginx -t, đo xem cái nào bị chặn và cái nào lọt. Rồi hai phép đo về chuyện reload — trong đó một cái là lý do bạn không bao giờ nên restart Nginx trên production.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>What <code>nginx -t</code> proves, and what it does not</h2>
<p class="lead"><code>nginx -t</code> is the last thing everyone runs before a reload, and it is worth knowing exactly what its "test is successful" means. It parses the configuration, resolves hostnames it can resolve, and opens files it must open. It does not run a single request.</p>

<h3>Eight faults, put through it</h3>
<div class="out">thieu dau cham phay                                  -t CHAN
proxy_pass toi mot host KHONG PHAN GIAI DUOC         -t CHAN
hai location TRUNG HET nhau                          -t CHAN
ssl_certificate tro vao tep KHONG TON TAI            -t CHAN

root tro vao thu muc KHONG TON TAI                   -t QUA (khong bat duoc)
proxy_pass toi IP:cong CHET (khong ai nghe)          -t QUA (khong bat duoc)
proxy_pass qua BIEN (ten khong phan giai duoc)       -t QUA (khong bat duoc)
location tien to bi regex dung truoc che mat         -t QUA (khong bat duoc)</div>
<p>The split is not arbitrary. Everything in the first group is knowable by reading the config and touching the filesystem. Everything in the second depends on the state of the world at the moment a request arrives — and <code>-t</code> deliberately does not go looking.</p>

<h3>The four it catches</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Syntax</span><span class="v"><code>[emerg] unexpected "}" in /tmp/nxdiag/a.conf:11</code> — with the file and line. This is the case everyone knows, and it is the least interesting.</span></div>
  <div class="kv"><span class="k">Unresolvable upstream name</span><span class="v"><code>[emerg] host not found in upstream "khong-he-co-ten-may-nay.invalid"</code>. Nginx resolves literal hostnames in <code>proxy_pass</code> and <code>upstream</code> at <em>parse</em> time, once, and keeps the address forever.</span></div>
  <div class="kv"><span class="k">Duplicate location</span><span class="v"><code>[emerg] duplicate location "/a"</code> — two locations with identical matchers in one server block.</span></div>
  <div class="kv"><span class="k">Missing certificate file</span><span class="v">Blocked, because Nginx opens and parses the certificate during configuration load. A file that exists but has expired is a different matter — see below.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — resolving at parse time means DNS can stop your reload.</strong> Because <code>proxy_pass http://api.noi-bo.vidu</code> is resolved once, at load, a DNS outage does not degrade your proxy — it prevents Nginx from reloading at all, and the error is <code>host not found in upstream</code>, which reads like a config typo rather than a network problem. It also means a backend whose IP changes (a container that was recreated, a service behind a rotating DNS record) is <em>never</em> re-resolved. Nginx keeps dialling the old address until someone reloads.</div>
<p>The escape hatch is to put the hostname in a variable, which forces resolution at request time and requires a <code>resolver</code>:</p>
<pre><code>resolver 127.0.0.53 valid=30s;
set \$backend "http://api.noi-bo.vidu:3000";
location /api/ { proxy_pass \$backend; }</code></pre>
<p>That is why the variable form appears in the "not caught" list above — the whole point of it is to move the lookup past the moment <code>-t</code> runs. You trade a start-up failure for a runtime 502, and you gain the ability to follow an address that moves.</p>

<h3>The four it misses, in order of how much damage they do</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A shadowed location is dead code</span><span class="lz-d">Measured in Lesson 11.1: with <code>location ~ ^/api</code> declared before <code>location /api/v1</code>, every request to <code>/api/v1</code> reported <code>~ ^/api</code>. The second block is unreachable, <code>-t</code> is happy, and the rules it contains — an auth check, a rate limit, a different upstream — simply never run.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>proxy_pass</code> to a dead IP and port</span><span class="lz-d">No DNS involved, so nothing to resolve and nothing to fail. The config loads perfectly and every request returns 502. This is the state a deploy leaves you in when the backend container did not come up.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>root</code> pointing at a directory that does not exist</span><span class="lz-d">Test successful. Every request returns 404 with <code>open() … failed (2: No such file or directory)</code> in the error log. A typo in a deploy path is invisible until traffic hits it.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A certificate that exists but is expired</span><span class="lz-d">Nginx opens and parses it, so a missing file is caught — but validity is a property of the moment a client connects, not of loading. Chapter 6 covered checking expiry; <code>-t</code> will never do it for you.</span></div>
</div>
<div class="callout"><strong>The pattern is worth naming.</strong> <code>nginx -t</code> answers "can this configuration be loaded". It does not answer "will this configuration serve traffic correctly". Those are different questions, and the second one is only answered by sending requests — which is exactly why <code>deploy.sh</code> in this project smoke-tests real routes after every deploy and fails on a 404.</div>

<h3>The larger trap: <code>-t</code> reads the disk, the server runs memory</h3>
<p>This one catches experienced people, because the output is reassuring and wrong. A running server, a file edited on disk, and no reload:</p>
<div class="out">1) dang chay:                    PHIEN BAN 1
2) da sua tep tren dia, CHUA reload
   nginx -t noi:                 successful
   nhung may chu van tra ve:     PHIEN BAN 1
3) sau khi reload:                PHIEN BAN 2</div>
<p>"Test is successful" described a file the running Nginx had never read. The same applies to <code>nginx -T</code>: it dumps the configuration <em>on disk</em>, not the one in memory. If you are debugging a live server and the dump does not explain the behaviour you are seeing, the most likely reason is that nobody reloaded after the last edit — and that can be weeks ago.</p>
<div class="note-ct">There is no built-in way to dump what the running workers actually hold. The nearest practical check is the master process start time against the file mtime: <code>ps -o lstart= -p \$(cat /run/nginx.pid)</code> next to <code>stat -c %y /etc/nginx/nginx.conf</code>. If the file is newer than the process, the running config is not the one you are reading.</div>

<h3><code>reload</code> versus <code>restart</code>: the measurement that decides an outage</h3>
<p>A running server, a deliberately broken config, and a reload:</p>
<div class="out">=== reload voi cau hinh hong: may chu SONG ===
   PHIEN BAN 2
   error log: [emerg] 914#914: unexpected "}" in /tmp/nxd2/v1.conf:11</div>
<p>Nginx read the new file, rejected it, logged <code>[emerg]</code>, and <em>kept the old configuration running</em>. Not one request was lost. The master process only starts new workers once the new configuration parses; if it does not, the existing workers carry on untouched.</p>
<p>Now the same broken config, but with a stop and start instead:</p>
<div class="out">=== nhung RESTART voi cau hinh hong thi sao? ===
   khoi dong lai: [emerg] 1670#1670: unexpected "}" in /tmp/nxd2/hong.conf:11
   may chu bay gio:  CHET — khong ai tra loi</div>
<div class="callout warn"><strong>This is why you reload and never restart.</strong> A reload with a broken config is a no-op with a log line. A restart with the same broken config is an outage that lasts until a human notices and fixes the file. The failure is identical; only the recovery differs, and one of them has no automatic recovery at all.</div>
<p>Chapter 9 measured the other half of this: three reloads during four hundred live requests produced four hundred <code>200</code>s, because old workers finish their in-flight requests before exiting. A reload is safe both when the config is broken and when it is fine.</p>

<h3>The sequence worth memorising</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. nginx -t</span><span class="lz-lnote">Catches syntax, unresolvable upstream names, duplicate locations, missing certificate files. Cheap, always run it.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. nginx -T | grep</span><span class="lz-lnote">Confirm the change is actually in the effective config, including whatever the <code>include</code> globs pulled in. Lesson 11.3 is entirely about this step.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. nginx -s reload</span><span class="lz-lnote">Never <code>restart</code>. Never <code>systemctl restart nginx</code> on a production box unless you have already proved the config loads.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. curl the real routes</span><span class="lz-lnote">The only step that can catch the four faults <code>-t</code> misses. Unauth GET, check for 404 — 401 and 200 both mean mounted, 404 means it is not there.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Controlling nginx — signals and the reload sequence</span><span class="lc-sub">nginx.org/en/docs/control.html — what the master does on <code>HUP</code>, and why old workers outlive the reload.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_core_module — resolver</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_core_module.html#resolver — required for the variable form of <code>proxy_pass</code>, including the <code>valid=</code> TTL override.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 9 — reloading under live traffic</span><span class="lc-sub">The four-hundred-request measurement that shows a reload costs nothing when the config is good.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — why a container restart is not a reload</span><span class="lc-sub">/courses/docker/learn${REF} — in a container the process is the container, so the reload-versus-restart distinction changes shape.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2><code>nginx -t</code> chứng minh được gì, và KHÔNG chứng minh được gì</h2>
<p class="lead"><code>nginx -t</code> là thứ ai cũng chạy cuối cùng trước khi reload, và rất đáng biết chính xác cái câu "test is successful" của nó có nghĩa gì. Nó phân tích cấu hình, phân giải những tên nó phân giải được, và mở những tệp nó buộc phải mở. Nó KHÔNG chạy lấy một request nào.</p>

<h3>Tám kiểu lỗi, đưa qua nó</h3>
<div class="out">thieu dau cham phay                                  -t CHAN
proxy_pass toi mot host KHONG PHAN GIAI DUOC         -t CHAN
hai location TRUNG HET nhau                          -t CHAN
ssl_certificate tro vao tep KHONG TON TAI            -t CHAN

root tro vao thu muc KHONG TON TAI                   -t QUA (khong bat duoc)
proxy_pass toi IP:cong CHET (khong ai nghe)          -t QUA (khong bat duoc)
proxy_pass qua BIEN (ten khong phan giai duoc)       -t QUA (khong bat duoc)
location tien to bi regex dung truoc che mat         -t QUA (khong bat duoc)</div>
<p>Cách chia đó không tuỳ tiện. Mọi thứ ở nhóm đầu đều biết được bằng cách ĐỌC cấu hình và sờ vào hệ tệp. Mọi thứ ở nhóm sau đều phụ thuộc vào trạng thái của thế giới tại thời điểm một request tới — và <code>-t</code> CỐ Ý không đi tìm hiểu chuyện đó.</p>

<h3>Bốn cái nó bắt được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cú pháp</span><span class="v"><code>[emerg] unexpected "}" in /tmp/nxdiag/a.conf:11</code> — kèm tên tệp và số dòng. Đây là ca ai cũng biết, và cũng là ca ít thú vị nhất.</span></div>
  <div class="kv"><span class="k">Tên upstream không phân giải được</span><span class="v"><code>[emerg] host not found in upstream "khong-he-co-ten-may-nay.invalid"</code>. Nginx phân giải tên máy dạng chữ trong <code>proxy_pass</code> và <code>upstream</code> ngay lúc PHÂN TÍCH cấu hình, đúng một lần, rồi giữ cái địa chỉ đó mãi mãi.</span></div>
  <div class="kv"><span class="k">Location trùng nhau</span><span class="v"><code>[emerg] duplicate location "/a"</code> — hai location có bộ khớp y hệt nhau trong cùng một khối server.</span></div>
  <div class="kv"><span class="k">Thiếu tệp chứng chỉ</span><span class="v">Bị chặn, vì Nginx mở và phân tích chứng chỉ ngay trong lúc nạp cấu hình. Còn một tệp CÓ tồn tại nhưng đã hết hạn thì lại là chuyện khác — xem bên dưới.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — phân giải lúc nạp cấu hình nghĩa là DNS có thể chặn đứng lần reload của bạn.</strong> Vì <code>proxy_pass http://api.noi-bo.vidu</code> được phân giải một lần lúc nạp, một sự cố DNS KHÔNG làm proxy của bạn yếu đi — nó làm Nginx không reload được chút nào, và thông báo lại là <code>host not found in upstream</code>, nghe như một lỗi gõ nhầm trong cấu hình chứ không phải chuyện mạng. Nó còn nghĩa là một backend đổi IP (một container vừa được dựng lại, một dịch vụ nấp sau bản ghi DNS xoay vòng) sẽ KHÔNG BAO GIỜ được phân giải lại. Nginx cứ gọi mãi vào địa chỉ cũ cho tới khi có người reload.</div>
<p>Cửa thoát là đặt tên máy vào một BIẾN, việc đó ép phân giải xảy ra lúc có request và đòi phải khai một <code>resolver</code>:</p>
<pre><code>resolver 127.0.0.53 valid=30s;
set \$backend "http://api.noi-bo.vidu:3000";
location /api/ { proxy_pass \$backend; }</code></pre>
<p>Đó chính là lý do dạng dùng biến nằm trong danh sách "không bắt được" ở trên — mục đích của nó chính là dời việc tra cứu ra khỏi cái thời điểm mà <code>-t</code> chạy. Bạn đổi một lỗi không khởi động được lấy một cú 502 lúc chạy, và đổi lại bạn có được khả năng đi theo một địa chỉ hay di chuyển.</p>

<h3>Bốn cái nó bỏ sót, xếp theo mức thiệt hại</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một location bị che là mã chết</span><span class="lz-d">Đã đo ở Bài 11.1: với <code>location ~ ^/api</code> khai trước <code>location /api/v1</code>, mọi request tới <code>/api/v1</code> đều báo <code>~ ^/api</code>. Khối thứ hai không với tới được, <code>-t</code> vẫn vui vẻ, và những luật nằm trong đó — một phép kiểm đăng nhập, một giới hạn tốc độ, một upstream khác — đơn giản là KHÔNG BAO GIỜ chạy.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>proxy_pass</code> tới một IP và cổng đã chết</span><span class="lz-d">Không dính DNS, nên chẳng có gì để phân giải và chẳng có gì để hỏng. Cấu hình nạp hoàn hảo và mọi request trả về 502. Đây đúng là trạng thái mà một lần deploy để lại khi container backend không lên nổi.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>root</code> trỏ vào một thư mục không tồn tại</span><span class="lz-d">Test successful. Mọi request trả 404 kèm <code>open() … failed (2: No such file or directory)</code> trong error log. Một lỗi gõ nhầm đường dẫn deploy thì vô hình cho tới lúc có lưu lượng đập vào.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Một chứng chỉ CÓ tồn tại nhưng đã hết hạn</span><span class="lz-d">Nginx mở và phân tích nó, nên thiếu TỆP thì bị bắt — nhưng còn hạn hay không là tính chất của thời điểm client kết nối, không phải của lúc nạp cấu hình. Chương 6 đã nói về việc kiểm hạn; <code>-t</code> sẽ không bao giờ làm hộ bạn.</span></div>
</div>
<div class="callout"><strong>Cái khuôn này đáng được gọi tên.</strong> <code>nginx -t</code> trả lời câu "cấu hình này có nạp được không". Nó KHÔNG trả lời câu "cấu hình này có phục vụ lưu lượng đúng không". Đó là hai câu hỏi khác nhau, và câu thứ hai chỉ được trả lời bằng cách GỬI REQUEST — đó chính là lý do <code>deploy.sh</code> trong dự án này chạy smoke-test các tuyến thật sau mỗi lần deploy và fail khi gặp 404.</div>

<h3>Cái bẫy lớn hơn: <code>-t</code> đọc ĐĨA, còn máy chủ chạy BỘ NHỚ</h3>
<p>Cái này bẫy cả người có kinh nghiệm, vì kết quả in ra vừa yên lòng vừa sai. Một máy chủ đang chạy, một tệp vừa sửa trên đĩa, và chưa reload:</p>
<div class="out">1) dang chay:                    PHIEN BAN 1
2) da sua tep tren dia, CHUA reload
   nginx -t noi:                 successful
   nhung may chu van tra ve:     PHIEN BAN 1
3) sau khi reload:                PHIEN BAN 2</div>
<p>Câu "test is successful" đang mô tả một tệp mà con Nginx đang chạy CHƯA TỪNG đọc. Điều tương tự đúng với <code>nginx -T</code>: nó đổ ra cấu hình <em>trên đĩa</em>, không phải cái đang nằm trong bộ nhớ. Nếu bạn đang gỡ lỗi một máy chủ sống mà bản đổ ra không giải thích được hành vi bạn đang thấy, lý do khả dĩ nhất là chẳng ai reload sau lần sửa gần nhất — và lần đó có thể là mấy tuần trước.</p>
<div class="note-ct">Không có cách có sẵn nào để đổ ra thứ mà các worker đang chạy thật sự đang giữ. Phép kiểm thực dụng gần nhất là so giờ khởi động của tiến trình master với giờ sửa tệp: <code>ps -o lstart= -p \$(cat /run/nginx.pid)</code> đặt cạnh <code>stat -c %y /etc/nginx/nginx.conf</code>. Nếu tệp mới hơn tiến trình, thì cấu hình đang chạy không phải cái bạn đang đọc.</div>

<h3><code>reload</code> so với <code>restart</code>: phép đo quyết định một sự cố</h3>
<p>Một máy chủ đang chạy, một cấu hình cố tình làm hỏng, và một lệnh reload:</p>
<div class="out">=== reload voi cau hinh hong: may chu SONG ===
   PHIEN BAN 2
   error log: [emerg] 914#914: unexpected "}" in /tmp/nxd2/v1.conf:11</div>
<p>Nginx đã đọc tệp mới, TỪ CHỐI nó, ghi một dòng <code>[emerg]</code>, và <em>giữ nguyên cấu hình cũ đang chạy</em>. Không mất lấy một request. Tiến trình master chỉ dựng worker mới KHI cấu hình mới phân tích được; nếu không thì đám worker đang có cứ thế chạy tiếp, không hề bị đụng tới.</p>
<p>Giờ vẫn cấu hình hỏng đó, nhưng thay bằng dừng rồi khởi động lại:</p>
<div class="out">=== nhung RESTART voi cau hinh hong thi sao? ===
   khoi dong lai: [emerg] 1670#1670: unexpected "}" in /tmp/nxd2/hong.conf:11
   may chu bay gio:  CHET — khong ai tra loi</div>
<div class="callout warn"><strong>Đây chính là lý do bạn reload và không bao giờ restart.</strong> Reload với cấu hình hỏng là một hành động không làm gì kèm một dòng log. Restart với đúng cấu hình hỏng đó là một sự cố kéo dài cho tới khi có người phát hiện và sửa tệp. Chỗ hỏng y hệt nhau; chỉ khác cách hồi phục, và một trong hai cái thì KHÔNG có hồi phục tự động nào cả.</div>
<p>Chương 9 đã đo nửa còn lại của chuyện này: ba lần reload giữa bốn trăm request đang chạy cho ra bốn trăm cú <code>200</code>, vì worker cũ làm nốt request đang dở trước khi thoát. Reload an toàn cả khi cấu hình hỏng lẫn khi cấu hình tốt.</p>

<h3>Trình tự đáng thuộc lòng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. nginx -t</span><span class="lz-lnote">Bắt được cú pháp, tên upstream không phân giải nổi, location trùng, thiếu tệp chứng chỉ. Rẻ, luôn luôn chạy.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. nginx -T | grep</span><span class="lz-lnote">Xác nhận thay đổi thật sự nằm trong cấu hình hiệu lực, kể cả những gì mà mấy cái <code>include</code> kéo vào. Bài 11.3 dành trọn cho bước này.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. nginx -s reload</span><span class="lz-lnote">Không bao giờ <code>restart</code>. Không bao giờ <code>systemctl restart nginx</code> trên máy production trừ khi bạn đã chứng minh được cấu hình nạp được.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. curl vào các tuyến thật</span><span class="lz-lnote">Bước DUY NHẤT bắt được bốn kiểu lỗi mà <code>-t</code> bỏ sót. GET không đăng nhập, xem có 404 không — 401 và 200 đều nghĩa là đã gắn, còn 404 nghĩa là nó không có ở đó.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Controlling nginx — tín hiệu và trình tự reload</span><span class="lc-sub">nginx.org/en/docs/control.html — master làm gì khi nhận <code>HUP</code>, và vì sao worker cũ sống lâu hơn lần reload.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_core_module — resolver</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_core_module.html#resolver — bắt buộc phải có cho dạng <code>proxy_pass</code> dùng biến, kể cả tham số <code>valid=</code> để ghi đè TTL.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 9 — nạp lại cấu hình giữa lúc có lưu lượng</span><span class="lc-sub">Phép đo bốn trăm request cho thấy một lần reload chẳng tốn gì khi cấu hình tốt.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — vì sao khởi động lại container không phải là reload</span><span class="lc-sub">/courses/docker/learn${REF} — trong container thì tiến trình CHÍNH LÀ container, nên phân biệt reload/restart mang hình dạng khác.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Reading a configuration you did not write|||11.3 — Đọc một cấu hình do người khác viết',
      slug: 'nginx-11-3-doc-cau-hinh-nguoi-khac-viet',
      type: 'LESSON',
      description: 'nginx -T bung hết include ra thành một tệp. Bài này dùng nó để tìm mã chết, tìm tệp sao lưu đang chạy thật, và đo cái luật kế thừa làm backend mất sạch IP thật của người dùng trên đúng một tuyến.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Reading a configuration you did not write</h2>
<p class="lead">A production Nginx configuration is rarely one file. It is <code>nginx.conf</code> including <code>conf.d/*.conf</code> including <code>snippets/*</code>, written by several people over several years. Before changing anything in it you need to know what it actually says — which is not the same as what any one file says.</p>

<h3><code>nginx -T</code>: the whole thing, expanded</h3>
<p><code>-t</code> tests. <code>-T</code> tests <em>and prints the complete effective configuration</em> with every <code>include</code> resolved in place. A 16-line main file that includes one snippet comes out as 25 lines, and each included file is announced:</p>
<div class="out">$ nginx -T -c main.conf

# configuration file /tmp/nxdiag/conf.d/api.conf:
# tep nay do "ai do" them vao 8 thang truoc
location /api/ {
    proxy_pass http://127.0.0.1:9600/;
    proxy_set_header Host $host;
}</div>
<p>Those <code># configuration file</code> lines are the most useful part of the output, because they answer a question nobody thinks to ask: <em>which files are actually being read?</em></p>
<div class="out">=== liet ke MOI tep dang thuc su duoc nap ===
  # configuration file /tmp/nxinc/main.conf:
  # configuration file /tmp/nxinc/conf.d/10-shop.conf:
  # configuration file /tmp/nxinc/conf.d/20-cu.conf:</div>
<p>The directory in that measurement also contained <code>conf.d/nginx.conf.bak</code>. It is absent from the list, because the glob is <code>*.conf</code> and <code>.bak</code> does not match. That is the good case.</p>
<div class="pitfall"><strong>Bẫy — the backup that <em>does</em> match the glob.</strong> <code>cp site.conf site.conf.old</code> is harmless. <code>cp site.conf site-old.conf</code> loads a complete second copy of every <code>server</code> block in it. So does <code>site.conf.save</code> from an editor that appends rather than prepends, and so does anything a colleague left behind called <code>test.conf</code>. The list of loaded files above is the only reliable way to see it — the directory listing tells you what exists, not what Nginx read.</div>

<h3>What happens when two files claim the same name</h3>
<p>The measurement had two <code>server</code> blocks in different files, both with <code>server_name shop.vidu</code> on the same address:</p>
<div class="out">=== nginx -t voi hai server_name TRUNG nhau ===
  [warn] 3204#3204: conflicting server name "shop.vidu" on 127.0.0.1:9380, ignored
  nginx: configuration file /tmp/nxinc/main.conf syntax is ok
  nginx: configuration file /tmp/nxinc/main.conf test is successful

=== ai thang? ===
  SHOP (10-shop.conf)</div>
<div class="callout warn"><strong>A <code>[warn]</code>, and "test is successful".</strong> Nginx does not refuse a duplicate <code>server_name</code> the way it refuses a duplicate <code>location</code> — it keeps the first one it parsed and discards the rest. Includes are expanded in glob order, which is alphabetical, so <code>10-shop.conf</code> beat <code>20-cu.conf</code>. Rename a file and the winner changes. Everything in the losing block — its routes, its TLS settings, its rate limits — is dead, and the only sign is one warning line that scrolls past during a reload nobody watched.</div>
<p>Two greps find this in any configuration, and they are worth running on a machine you have just inherited:</p>
<pre><code><span class="tok-comment"># moi canh bao lan nay — trong do co "conflicting server name"</span>
nginx -t 2&gt;&amp;1 | grep -i warn

<span class="tok-comment"># moi ten mien khai o dau, kem tep khai no</span>
nginx -T 2&gt;/dev/null | grep -E '^# configuration file|server_name' </code></pre>

<h3>The inheritance question: which directives actually apply here?</h3>
<p>This is where reading a config goes wrong even when you have the whole text in front of you. Lesson 11.1 measured <code>add_header</code> being discarded wholesale by a child context. <code>proxy_set_header</code> follows the same rule, and it does more damage. Three headers declared at server level, and two locations — one that adds nothing of its own, one that adds a single unrelated header:</p>
<pre><code>server {
    proxy_set_header Host              \$host;
    proxy_set_header X-Real-IP         \$remote_addr;
    proxy_set_header X-Forwarded-Proto \$scheme;

    location /ke-thua/ { proxy_pass http://127.0.0.1:9601/; }
    location /rieng/ {
        proxy_set_header X-Yeu-Cau-Rieng "co";   <span class="tok-comment"># MOT header rieng</span>
        proxy_pass http://127.0.0.1:9601/;
    }
}</code></pre>
<p>Measured at the backend, printing what it actually received:</p>
<div class="out">=== location KE THUA (khong khai proxy_set_header nao) ===
  host                = shop.vidu
  x-real-ip           = 127.0.0.1
  x-forwarded-proto   = http
  x-yeu-cau-rieng     = (KHONG CO)

=== location CO khai MOT proxy_set_header rieng ===
  host                = 127.0.0.1:9601
  x-real-ip           = (KHONG CO)
  x-forwarded-proto   = (KHONG CO)
  x-yeu-cau-rieng     = co</div>
<div class="pitfall"><strong>Bẫy — one <code>proxy_set_header</code> costs you all three of the ones above it.</strong> The second location added a single unrelated header and lost <code>X-Real-IP</code>, lost <code>X-Forwarded-Proto</code>, and had <code>Host</code> revert to Nginx's default of the upstream's own address. The backend on that route now believes every visitor comes from nowhere in particular over plain HTTP, and any absolute URL it builds from <code>Host</code> points at <code>127.0.0.1:9601</code>.</div>
<p>Everything else keeps working, which is what makes it dangerous. Rate limits keyed on <code>X-Real-IP</code> stop distinguishing users. Audit logs record no client address. A redirect after login sends the browser to an internal address. And it happens on exactly one route — the one someone edited last — so it presents as "the login page is broken but the rest of the site is fine".</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Which directives behave this way</span><span class="lz-d">The array-valued ones: <code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code>, <code>error_log</code>, <code>access_log</code>, <code>limit_req</code>, <code>limit_conn</code>. A child context inherits the whole list, or declares its own and inherits none of it.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The fix is a snippet, not discipline</span><span class="lz-d">Put the common headers in <code>snippets/proxy-headers.conf</code> and <code>include</code> it in every location that declares any of its own. Repetition that a file guarantees beats repetition a reviewer has to notice.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Verify from the backend, not the config</span><span class="lz-d">A temporary endpoint that echoes its request headers settles the question in one request. The measurement above is that endpoint, and it took four lines of Node.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Or read it off the response</span><span class="lz-d">The <code>X-Kh</code> debug header from Lesson 11.1 can carry <code>\$proxy_host</code> and the values being sent, so a single <code>curl -D-</code> shows what the upstream will see without touching the backend at all.</span></div>
</div>

<h3>A reading order for an unfamiliar configuration</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. nginx -T &gt; hien-tai.conf</span><span class="lz-lnote">Work from the expanded dump, never from the individual files. Keep it — diffing this before and after a change is the clearest review you will get.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. grep '# configuration file'</span><span class="lz-lnote">Which files are real. Anything on disk but absent from this list is decoration; anything on the list you did not expect is a live surprise.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. grep -E 'listen|server_name'</span><span class="lz-lnote">The entry points, and which block is <code>default_server</code>. Chapter 1 is the rulebook for reading this.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. For your route: list every location, in order</span><span class="lz-lnote">Then apply Chapter 2's rules — exact, longest prefix, <code>^~</code>, then regex in file order. The <code>X-Kh</code> header from 11.1 checks your answer in one request.</span></div>
  <div class="lz-layer"><span class="lz-lname">5. Trace the array directives up the tree</span><span class="lz-lnote">For each of <code>proxy_set_header</code>, <code>add_header</code>, <code>access_log</code>: does the winning location declare any? If yes, everything above it is gone.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — command-line parameters (-t, -T, -s)</span><span class="lc-sub">nginx.org/en/docs/switches.html — the full list, including <code>-T</code> which arrived in 1.9.2 and is missing from a surprising number of tutorials.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_proxy_module — proxy_set_header</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header — the inheritance sentence, and the two headers Nginx sets by default when you declare none.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Server names — how conflicts are resolved</span><span class="lc-sub">nginx.org/en/docs/http/server_names.html — why a duplicate is a warning rather than an error, and which copy survives.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — what actually reaches your application</span><span class="lc-sub">The chapter that first measured <code>Host</code> being replaced by the upstream address. This lesson shows the second way to lose it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Đọc một cấu hình do người khác viết</h2>
<p class="lead">Một cấu hình Nginx chạy production hiếm khi là một tệp. Nó là <code>nginx.conf</code> include <code>conf.d/*.conf</code> include tiếp <code>snippets/*</code>, do vài người viết trong vài năm. Trước khi đổi bất cứ thứ gì trong đó, bạn cần biết nó THẬT SỰ nói gì — mà cái đó không giống với những gì bất kỳ một tệp riêng lẻ nào nói.</p>

<h3><code>nginx -T</code>: toàn bộ, đã bung ra</h3>
<p><code>-t</code> thì kiểm. <code>-T</code> thì kiểm <em>và in ra toàn bộ cấu hình hiệu lực</em> với mọi <code>include</code> đã được thay thế tại chỗ. Một tệp chính 16 dòng có include một mẩu thì ra 25 dòng, và mỗi tệp được kéo vào đều được xướng tên:</p>
<div class="out">$ nginx -T -c main.conf

# configuration file /tmp/nxdiag/conf.d/api.conf:
# tep nay do "ai do" them vao 8 thang truoc
location /api/ {
    proxy_pass http://127.0.0.1:9600/;
    proxy_set_header Host $host;
}</div>
<p>Mấy dòng <code># configuration file</code> đó mới là phần hữu ích nhất của kết quả, vì chúng trả lời một câu hỏi chẳng ai nghĩ tới việc hỏi: <em>rốt cuộc những tệp nào đang được đọc?</em></p>
<div class="out">=== liet ke MOI tep dang thuc su duoc nap ===
  # configuration file /tmp/nxinc/main.conf:
  # configuration file /tmp/nxinc/conf.d/10-shop.conf:
  # configuration file /tmp/nxinc/conf.d/20-cu.conf:</div>
<p>Thư mục trong phép đo đó còn chứa cả <code>conf.d/nginx.conf.bak</code>. Nó VẮNG MẶT trong danh sách, vì mẫu glob là <code>*.conf</code> mà <code>.bak</code> thì không khớp. Đó là trường hợp may.</p>
<div class="pitfall"><strong>Bẫy — cái bản sao lưu MÀ LẠI khớp mẫu glob.</strong> <code>cp site.conf site.conf.old</code> thì vô hại. <code>cp site.conf site-old.conf</code> thì nạp nguyên một bản sao thứ hai của MỌI khối <code>server</code> nằm trong đó. <code>site.conf.save</code> từ một trình soạn thảo chèn hậu tố kiểu khác cũng vậy, và bất cứ thứ gì đồng nghiệp bỏ lại tên là <code>test.conf</code> cũng vậy. Danh sách tệp được nạp ở trên là cách ĐÁNG TIN DUY NHẤT để thấy chuyện đó — lệnh liệt kê thư mục cho bạn biết cái gì TỒN TẠI, chứ không cho biết Nginx đã ĐỌC cái gì.</div>

<h3>Chuyện gì xảy ra khi hai tệp cùng nhận một cái tên</h3>
<p>Phép đo có hai khối <code>server</code> ở hai tệp khác nhau, cả hai đều <code>server_name shop.vidu</code> trên cùng một địa chỉ:</p>
<div class="out">=== nginx -t voi hai server_name TRUNG nhau ===
  [warn] 3204#3204: conflicting server name "shop.vidu" on 127.0.0.1:9380, ignored
  nginx: configuration file /tmp/nxinc/main.conf syntax is ok
  nginx: configuration file /tmp/nxinc/main.conf test is successful

=== ai thang? ===
  SHOP (10-shop.conf)</div>
<div class="callout warn"><strong>Một dòng <code>[warn]</code>, và "test is successful".</strong> Nginx KHÔNG từ chối một <code>server_name</code> trùng theo cách nó từ chối một <code>location</code> trùng — nó giữ cái đầu tiên nó phân tích được rồi vứt phần còn lại. Include được bung ra theo thứ tự glob, tức là theo bảng chữ cái, nên <code>10-shop.conf</code> thắng <code>20-cu.conf</code>. Đổi tên một tệp thì kẻ thắng đổi theo. Mọi thứ trong cái khối thua — các tuyến của nó, thiết lập TLS của nó, giới hạn tốc độ của nó — đều CHẾT, và dấu hiệu duy nhất là một dòng cảnh báo trôi qua trong một lần reload chẳng ai ngồi xem.</div>
<p>Hai lệnh grep tìm ra chuyện này trong bất kỳ cấu hình nào, và chúng đáng được chạy trên một cái máy bạn vừa tiếp quản:</p>
<pre><code><span class="tok-comment"># moi canh bao lan nay — trong do co "conflicting server name"</span>
nginx -t 2&gt;&amp;1 | grep -i warn

<span class="tok-comment"># moi ten mien khai o dau, kem tep khai no</span>
nginx -T 2&gt;/dev/null | grep -E '^# configuration file|server_name' </code></pre>

<h3>Câu hỏi về kế thừa: rốt cuộc chỉ thị nào đang có hiệu lực ở đây?</h3>
<p>Đây là chỗ mà việc đọc cấu hình đi chệch NGAY CẢ KHI bạn đã có toàn bộ văn bản trước mặt. Bài 11.1 đã đo chuyện <code>add_header</code> bị một ngữ cảnh con vứt sạch. <code>proxy_set_header</code> theo đúng luật đó, và nó gây thiệt hại lớn hơn. Ba header khai ở mức server, và hai location — một cái không thêm gì của riêng nó, một cái thêm đúng một header chẳng liên quan:</p>
<pre><code>server {
    proxy_set_header Host              \$host;
    proxy_set_header X-Real-IP         \$remote_addr;
    proxy_set_header X-Forwarded-Proto \$scheme;

    location /ke-thua/ { proxy_pass http://127.0.0.1:9601/; }
    location /rieng/ {
        proxy_set_header X-Yeu-Cau-Rieng "co";   <span class="tok-comment"># MOT header rieng</span>
        proxy_pass http://127.0.0.1:9601/;
    }
}</code></pre>
<p>Đo ngay tại backend, in ra đúng những gì nó thật sự nhận được:</p>
<div class="out">=== location KE THUA (khong khai proxy_set_header nao) ===
  host                = shop.vidu
  x-real-ip           = 127.0.0.1
  x-forwarded-proto   = http
  x-yeu-cau-rieng     = (KHONG CO)

=== location CO khai MOT proxy_set_header rieng ===
  host                = 127.0.0.1:9601
  x-real-ip           = (KHONG CO)
  x-forwarded-proto   = (KHONG CO)
  x-yeu-cau-rieng     = co</div>
<div class="pitfall"><strong>Bẫy — một dòng <code>proxy_set_header</code> làm bạn mất cả ba dòng ở trên nó.</strong> Location thứ hai thêm đúng một header chẳng liên quan và mất <code>X-Real-IP</code>, mất <code>X-Forwarded-Proto</code>, còn <code>Host</code> thì quay về giá trị mặc định của Nginx là chính địa chỉ của upstream. Backend trên tuyến đó bây giờ tin rằng mọi khách tới từ hư không qua HTTP trần, và mọi URL tuyệt đối nó dựng từ <code>Host</code> đều trỏ về <code>127.0.0.1:9601</code>.</div>
<p>Mọi thứ khác vẫn chạy, và đó chính là điều làm nó nguy hiểm. Giới hạn tốc độ khoá theo <code>X-Real-IP</code> thôi phân biệt được người dùng. Log kiểm toán không ghi được địa chỉ khách nào. Một cú chuyển hướng sau khi đăng nhập đẩy trình duyệt tới một địa chỉ nội bộ. Và nó xảy ra trên ĐÚNG MỘT tuyến — cái tuyến vừa có người sửa gần nhất — nên nó hiện ra dưới dạng "trang đăng nhập hỏng còn phần còn lại của web thì bình thường".</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Những chỉ thị nào cư xử kiểu này</span><span class="lz-d">Nhóm nhận giá trị dạng MẢNG: <code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code>, <code>error_log</code>, <code>access_log</code>, <code>limit_req</code>, <code>limit_conn</code>. Ngữ cảnh con hoặc kế thừa nguyên cả danh sách, hoặc khai của riêng nó và không kế thừa gì hết.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cách sửa là một tệp snippet, không phải sự kỷ luật</span><span class="lz-d">Đặt đám header chung vào <code>snippets/proxy-headers.conf</code> rồi <code>include</code> nó trong MỌI location có khai bất cứ header riêng nào. Sự lặp lại do một tệp bảo đảm thì hơn hẳn sự lặp lại phải nhờ người review để ý.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểm từ phía BACKEND, đừng kiểm từ cấu hình</span><span class="lz-d">Một endpoint tạm dội lại header của chính request đó giải quyết câu hỏi trong đúng một lần gọi. Phép đo ở trên chính là cái endpoint đó, và nó tốn bốn dòng Node.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hoặc đọc nó ra từ phản hồi</span><span class="lz-d">Cái header chẩn đoán <code>X-Kh</code> ở Bài 11.1 chở được cả <code>\$proxy_host</code> lẫn các giá trị đang được gửi đi, nên một lệnh <code>curl -D-</code> cho thấy upstream sẽ nhận được gì mà không cần đụng vào backend.</span></div>
</div>

<h3>Một thứ tự đọc cho cấu hình lạ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. nginx -T &gt; hien-tai.conf</span><span class="lz-lnote">Làm việc trên bản đã bung, đừng bao giờ làm trên từng tệp rời. Giữ nó lại — so sánh bản này trước và sau một thay đổi là bản review rõ ràng nhất bạn có được.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. grep '# configuration file'</span><span class="lz-lnote">Tệp nào là thật. Thứ nằm trên đĩa mà vắng trong danh sách này chỉ là đồ trang trí; thứ có trong danh sách mà bạn không ngờ tới là một bất ngờ đang sống.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. grep -E 'listen|server_name'</span><span class="lz-lnote">Các cửa vào, và khối nào là <code>default_server</code>. Chương 1 là cuốn luật để đọc phần này.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Với tuyến của bạn: liệt kê mọi location, theo thứ tự</span><span class="lz-lnote">Rồi áp luật của Chương 2 — chính xác, tiền tố dài nhất, <code>^~</code>, rồi regex theo thứ tự trong tệp. Cái header <code>X-Kh</code> ở 11.1 kiểm lại đáp án của bạn trong một request.</span></div>
  <div class="lz-layer"><span class="lz-lname">5. Truy ngược các chỉ thị dạng mảng lên trên cây</span><span class="lz-lnote">Với từng cái trong <code>proxy_set_header</code>, <code>add_header</code>, <code>access_log</code>: cái location thắng cuộc có khai cái nào không? Nếu CÓ thì mọi thứ ở trên nó đã biến mất.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — tham số dòng lệnh (-t, -T, -s)</span><span class="lc-sub">nginx.org/en/docs/switches.html — danh sách đầy đủ, trong đó có <code>-T</code> xuất hiện từ bản 1.9.2 và vắng mặt trong nhiều bài hướng dẫn tới mức đáng ngạc nhiên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_proxy_module — proxy_set_header</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header — câu về kế thừa, và hai header mà Nginx tự đặt khi bạn không khai cái nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Server names — xung đột được giải quyết thế nào</span><span class="lc-sub">nginx.org/en/docs/http/server_names.html — vì sao trùng tên là cảnh báo chứ không phải lỗi, và bản nào sống sót.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — thứ gì thật sự tới được ứng dụng của bạn</span><span class="lc-sub">Chương đầu tiên đo chuyện <code>Host</code> bị thay bằng địa chỉ upstream. Bài này cho thấy cách thứ HAI để đánh mất nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — From a status code to the cause|||11.4 — Đi từ một mã trạng thái tới đúng nguyên nhân',
      slug: 'nginx-11-4-tu-ma-trang-thai-toi-nguyen-nhan',
      type: 'LESSON',
      description: 'Bảy request, bảy kết cục, mỗi cái kèm đúng dòng error log của nó. Trong đó có một cú 502 mà backend hoàn toàn khoẻ mạnh và đã trả về 200 — nó phá vỡ giả định phổ biến nhất về mã 502.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>From a status code to the cause</h2>
<p class="lead">A status code narrows the problem to a family. It never identifies the fault, because several unrelated faults share a code. The error log line is what separates them — and one of the cases below is a <code>502</code> produced by a backend that was working perfectly.</p>

<h3>Seven requests against one server</h3>
<div class="out">  /tep/cong-khai.txt         → 200
  /tep/khong-co.txt          → 404
  /tep/kin/kho.txt           → 403
  /up/binh-thuong            → 200
  /up/header-to              → 502
  /chet/x                    → 502
  /khong-co-location-nao     → 404

--- error log ---
    open() "/tmp/nxfail/web/khong-co.txt" failed (2: No such file or directory)
    open() "/tmp/nxfail/web/kin/kho.txt" failed (13: Permission denied)
    upstream sent too big header while reading response header from upstream
    connect() failed (111: Connection refused) while connecting to upstream
    open() "/tmp/nxfail/web/khong-co-location-nao" failed (2: No such file or directory)</div>
<p>Two <code>404</code>s from different causes with the same message, two <code>502</code>s from completely different causes, and a <code>403</code> whose message does not say which of two things went wrong. Taking them in turn.</p>

<h3>The <code>502</code> that is not the backend's fault</h3>
<p><code>/up/header-to</code> reached a backend that was running, accepted the connection, and answered <code>200</code>. The client got <code>502</code>. The route sends one deliberately oversized response header:</p>
<div class="out">=== truoc: proxy_buffer_size mac dinh ===
  /up/header-to → 502
=== sau: proxy_buffer_size 32k ===
  /up/header-to → 200  (header 12KB)
=== kich thuoc header that ma backend gui ===
  tong header phan hoi: 12148 byte</div>
<div class="pitfall"><strong>Bẫy — <code>502</code> does not mean "the backend is down".</strong> Here the backend was healthy and its response was valid HTTP. Nginx reads the response header into a single fixed buffer — <code>proxy_buffer_size</code>, 4 KB or 8 KB depending on platform — and if the header does not fit, it gives up and returns <code>502</code>. Twelve kilobytes of headers is not exotic: a large <code>Set-Cookie</code>, a JWT in a header, a long <code>Link</code> or CSP header, or an error page from a framework that echoes the request back. The symptom is a route that works in development, where the session cookie is small, and fails in production once it is not.</div>
<p>The tell is the error text: <code>upstream sent too big header</code>. If you only look at the status you will restart a backend that was never broken. The fix is to size the buffer for the largest header you actually emit, on that location:</p>
<pre><code>location /up/ {
    proxy_buffer_size   32k;    <span class="tok-comment"># chi cho HEADER phan hoi</span>
    proxy_buffers     8 32k;    <span class="tok-comment"># cho phan THAN</span>
    proxy_busy_buffers_size 64k;
    proxy_pass http://127.0.0.1:9610/;
}</code></pre>

<h3>Two <code>404</code>s that look identical</h3>
<p><code>/tep/khong-co.txt</code> matched <code>location /tep/</code> and the file was missing. <code>/khong-co-location-nao</code> matched <em>no location at all</em>, fell through to the server-level <code>root</code>, and looked for a file of that name. Same status, same message shape — and the resolved path in the message is the only thing that distinguishes them:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Path under your document root</span><span class="v">A location matched and the file is genuinely missing. Check the deploy: is the file there, is <code>root</code> or <code>alias</code> pointing where you think, did a trailing slash change the join. Chapter 4 measured how often it is the <code>alias</code>.</span></div>
  <div class="kv"><span class="k">Path that looks like a route, not a file</span><span class="v"><code>/tmp/nxfail/web/khong-co-location-nao</code> is Nginx trying to serve an API path as a file. That means no <code>location</code> claimed it — the router is the problem, not the filesystem. This is the signature of a route that was never mounted, or of the stale-build 404 this project has hit before.</span></div>
</div>
<div class="note-ct">This is exactly the distinction behind the deploy smoke-test in <code>deploy.sh</code>: an unauthenticated <code>GET</code> returning <code>401</code> or <code>200</code> proves a route is mounted, while <code>404</code> means it is not — either the build is stale or the router never registered it. The error log's resolved path is what tells you which of the two 404s you have.</div>

<h3>The <code>403</code> that does not say which permission</h3>
<p><code>13: Permission denied</code> has two quite different causes, and Nginx prints the same line for both. Measured by breaking each one separately:</p>
<div class="out">=== thu muc DOC/THUC THI duoc, TEP thi khong ===
  /tep/kin/kho.txt → 403
=== TEP doc duoc, nhung THU MUC mat quyen x ===
  /tep/kin/kho.txt → 403
--- hai dong error log cuoi ---
    open() "/tmp/nxfail/web/kin/kho.txt" failed (13: Permission denied)
    open() "/tmp/nxfail/web/kin/kho.txt" failed (13: Permission denied)</div>
<p>Byte for byte the same message. The worker needs read permission on the file <em>and</em> execute permission on every directory along the path — and a missing <code>x</code> on a directory three levels up produces a message naming only the file. <code>namei -l</code> resolves it in one line:</p>
<div class="out">$ namei -l /tmp/nxfail/web/kin/kho.txt
  f: /tmp/nxfail/web/kin/kho.txt
  drwxr-xr-x root root /
  drwxrwxrwt root root tmp
  drwxr-xr-x root root nxfail
  drwxr-xr-x root root web
  drw-r--r-- root root kin        ← thieu quyen x
  -rw-r--r-- root root kho.txt</div>
<p>Every component listed with its mode, so the offending one is visible at a glance. Pair it with the worker's identity — <code>ps -o user= -p &lt;worker-pid&gt;</code> returned <code>nobody</code> on this machine — because the permissions that matter are the ones that apply to <em>that</em> user, not to the one running the shell.</p>

<h3><code>502</code> versus <code>504</code></h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">502</span><span class="lz-t">Nginx could not get a usable response</span><span class="lz-d">Connection refused, connection reset, DNS failure at request time, or a response Nginx could not parse or fit — including the oversized header above. Something ended; the question is what and why.</span></div>
  <div class="lz-step"><span class="lz-k">504</span><span class="lz-t">Nginx waited and gave up</span><span class="lz-d">A timeout expired. The message names which: <code>while connecting</code> is <code>proxy_connect_timeout</code> — a network or firewall problem; <code>while reading response header</code> is <code>proxy_read_timeout</code> — a slow application. Chapter 10 measured both.</span></div>
  <div class="lz-step"><span class="lz-k">499</span><span class="lz-t">The client gave up first</span><span class="lz-d">Nginx's own non-standard code, in the access log only, never sent to anyone. A rise in 499s means users are closing tabs because you are too slow — it is a latency alarm wearing an error's clothing, and it is invisible if you only alert on 5xx.</span></div>
  <div class="lz-step"><span class="lz-k">413 / 400</span><span class="lz-t">The request was rejected before any of this</span><span class="lz-d"><code>413</code> is <code>client_max_body_size</code> from Chapter 7. A bare <code>400</code> with nothing in the error log is usually a malformed request line or an oversized request header — <code>large_client_header_buffers</code>, the mirror image of the <code>502</code> above.</span></div>
</div>

<h3>The ladder</h3>
<p>In order, because each step rules out everything below it:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Is Nginx answering at all?</span><span class="lz-lnote"><code>curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/</code> on the machine itself. No answer means the process, the port, or the firewall — not the configuration.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Which block took it?</span><span class="lz-lnote">The <code>X-Kh</code> header from Lesson 11.1, or <code>curl -H 'Host: …'</code> against the loopback. Answers the two questions from Chapters 1 and 2 without reading a config.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. What does the error log say for THAT request?</span><span class="lz-lnote">The connection number <code>*N</code> from Lesson 10.4 pulls the whole story for one request out of the file.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Reproduce against the backend directly</span><span class="lz-lnote">Bypass Nginx: <code>curl http://127.0.0.1:3000/duong-dan</code>. If the backend is also broken, Nginx was only the messenger — and if it is fine, the fault is in the proxying, which is where the oversized header lives.</span></div>
  <div class="lz-layer"><span class="lz-lname">5. Only then change the configuration</span><span class="lz-lnote">And <code>nginx -t</code>, then <code>reload</code>, never <code>restart</code> — Lesson 11.2 measured what the difference costs.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_proxy_module — proxy_buffer_size and proxy_buffers</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size — the buffer behind the 502 measured above, and why it is separate from the body buffers.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">namei(1)</span><span class="lc-sub">man7.org/linux/man-pages/man1/namei.1.html — resolves a whole path with the mode of every component, which is what the 403 message will not tell you.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9110 §15.6 — Server Error 5xx</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc9110#section-15.6 — what 502 and 504 are defined to mean, which is narrower than how they are usually read.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — static files: from URI to bytes</span><span class="lc-sub">The chapter that measured how <code>root</code> and <code>alias</code> build the path that appears in a 404 message.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Đi từ một mã trạng thái tới đúng nguyên nhân</h2>
<p class="lead">Một mã trạng thái thu hẹp vấn đề về một HỌ. Nó không bao giờ chỉ đích danh sự cố, vì nhiều sự cố chẳng liên quan gì tới nhau lại dùng chung một mã. Dòng error log mới là thứ tách chúng ra — và một trong những ca dưới đây là cú <code>502</code> sinh ra bởi một backend hoạt động hoàn hảo.</p>

<h3>Bảy request vào cùng một máy chủ</h3>
<div class="out">  /tep/cong-khai.txt         → 200
  /tep/khong-co.txt          → 404
  /tep/kin/kho.txt           → 403
  /up/binh-thuong            → 200
  /up/header-to              → 502
  /chet/x                    → 502
  /khong-co-location-nao     → 404

--- error log ---
    open() "/tmp/nxfail/web/khong-co.txt" failed (2: No such file or directory)
    open() "/tmp/nxfail/web/kin/kho.txt" failed (13: Permission denied)
    upstream sent too big header while reading response header from upstream
    connect() failed (111: Connection refused) while connecting to upstream
    open() "/tmp/nxfail/web/khong-co-location-nao" failed (2: No such file or directory)</div>
<p>Hai cú <code>404</code> từ hai nguyên nhân khác nhau mà cùng một thông báo, hai cú <code>502</code> từ hai nguyên nhân hoàn toàn khác nhau, và một cú <code>403</code> mà thông báo của nó không nói rõ trong hai chuyện thì chuyện nào đã hỏng. Lần lượt từng cái.</p>

<h3>Cú <code>502</code> không phải lỗi của backend</h3>
<p><code>/up/header-to</code> đã tới được một backend đang chạy, backend đó nhận kết nối, và trả lời <code>200</code>. Client nhận <code>502</code>. Cái tuyến đó gửi ra một header phản hồi cố tình làm cho quá cỡ:</p>
<div class="out">=== truoc: proxy_buffer_size mac dinh ===
  /up/header-to → 502
=== sau: proxy_buffer_size 32k ===
  /up/header-to → 200  (header 12KB)
=== kich thuoc header that ma backend gui ===
  tong header phan hoi: 12148 byte</div>
<div class="pitfall"><strong>Bẫy — <code>502</code> KHÔNG có nghĩa là "backend chết".</strong> Ở đây backend khoẻ mạnh và phản hồi của nó là HTTP hợp lệ. Nginx đọc header phản hồi vào một bộ đệm cố định duy nhất — <code>proxy_buffer_size</code>, 4 KB hoặc 8 KB tuỳ nền tảng — và nếu header không lọt vào đó, nó bỏ cuộc và trả <code>502</code>. Mười hai kilobyte header không phải chuyện kỳ dị: một <code>Set-Cookie</code> lớn, một JWT nằm trong header, một header <code>Link</code> hay CSP dài, hoặc một trang lỗi của framework dội lại nguyên cái request. Triệu chứng là một tuyến chạy ngon trên máy phát triển, nơi cookie phiên còn nhỏ, rồi hỏng trên production khi nó không còn nhỏ nữa.</div>
<p>Dấu hiệu nhận biết nằm ở chữ trong thông báo: <code>upstream sent too big header</code>. Nếu bạn chỉ nhìn mã trạng thái thì bạn sẽ đi khởi động lại một backend chưa từng hỏng. Cách sửa là chỉnh bộ đệm cho vừa cái header lớn nhất bạn thật sự phát ra, ngay tại location đó:</p>
<pre><code>location /up/ {
    proxy_buffer_size   32k;    <span class="tok-comment"># chi cho HEADER phan hoi</span>
    proxy_buffers     8 32k;    <span class="tok-comment"># cho phan THAN</span>
    proxy_busy_buffers_size 64k;
    proxy_pass http://127.0.0.1:9610/;
}</code></pre>

<h3>Hai cú <code>404</code> nhìn y hệt nhau</h3>
<p><code>/tep/khong-co.txt</code> đã khớp <code>location /tep/</code> và cái tệp thì thiếu thật. <code>/khong-co-location-nao</code> thì <em>không khớp location nào cả</em>, rơi xuống <code>root</code> ở mức server, rồi đi tìm một tệp mang cái tên đó. Cùng mã, cùng dạng thông báo — và cái ĐƯỜNG DẪN đã giải quyết trong thông báo là thứ duy nhất phân biệt chúng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đường dẫn nằm dưới thư mục tài liệu của bạn</span><span class="v">Có một location đã khớp và cái tệp thiếu thật. Hãy kiểm lần deploy: tệp có ở đó không, <code>root</code> hay <code>alias</code> có trỏ đúng chỗ bạn nghĩ không, có dấu gạch chéo cuối nào làm đổi cách ghép đường dẫn không. Chương 4 đã đo chuyện thủ phạm thường là <code>alias</code>.</span></div>
  <div class="kv"><span class="k">Đường dẫn trông như một TUYẾN, không phải một tệp</span><span class="v"><code>/tmp/nxfail/web/khong-co-location-nao</code> là Nginx đang cố phục vụ một đường dẫn API như thể nó là tệp. Nghĩa là KHÔNG <code>location</code> nào nhận nó — vấn đề nằm ở bộ định tuyến chứ không ở hệ tệp. Đây là chữ ký của một tuyến chưa từng được gắn, hoặc của cái lỗi 404-do-bản-dựng-cũ mà dự án này từng dính.</span></div>
</div>
<div class="note-ct">Đây đúng là cái phân biệt nằm sau phép smoke-test trong <code>deploy.sh</code>: một lệnh <code>GET</code> không đăng nhập mà trả <code>401</code> hoặc <code>200</code> thì chứng minh tuyến đã được gắn, còn <code>404</code> nghĩa là chưa — hoặc bản dựng cũ, hoặc bộ định tuyến chưa bao giờ đăng ký nó. Đường dẫn đã giải quyết trong error log là thứ cho bạn biết mình đang gặp cú 404 nào trong hai cái.</div>

<h3>Cú <code>403</code> không nói rõ là thiếu quyền nào</h3>
<p><code>13: Permission denied</code> có hai nguyên nhân khá khác nhau, và Nginx in ra CÙNG một dòng cho cả hai. Đo bằng cách phá riêng từng cái:</p>
<div class="out">=== thu muc DOC/THUC THI duoc, TEP thi khong ===
  /tep/kin/kho.txt → 403
=== TEP doc duoc, nhung THU MUC mat quyen x ===
  /tep/kin/kho.txt → 403
--- hai dong error log cuoi ---
    open() "/tmp/nxfail/web/kin/kho.txt" failed (13: Permission denied)
    open() "/tmp/nxfail/web/kin/kho.txt" failed (13: Permission denied)</div>
<p>Giống nhau tới từng byte. Worker cần quyền ĐỌC trên cái tệp <em>và</em> quyền THỰC THI trên mọi thư mục dọc đường — mà một thư mục thiếu chữ <code>x</code> ở tận ba tầng phía trên vẫn sinh ra thông báo chỉ nêu tên cái tệp. <code>namei -l</code> giải quyết chuyện đó trong một dòng lệnh:</p>
<div class="out">$ namei -l /tmp/nxfail/web/kin/kho.txt
  f: /tmp/nxfail/web/kin/kho.txt
  drwxr-xr-x root root /
  drwxrwxrwt root root tmp
  drwxr-xr-x root root nxfail
  drwxr-xr-x root root web
  drw-r--r-- root root kin        ← thieu quyen x
  -rw-r--r-- root root kho.txt</div>
<p>Mỗi thành phần được liệt kê kèm quyền của nó, nên cái thành phần có tội hiện ra ngay trong một cái liếc. Hãy ghép nó với danh tính của worker — <code>ps -o user= -p &lt;worker-pid&gt;</code> trả về <code>nobody</code> trên máy này — vì quyền có ý nghĩa là quyền áp cho <em>người dùng đó</em>, không phải cho người đang gõ lệnh trong shell.</p>

<h3><code>502</code> so với <code>504</code></h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">502</span><span class="lz-t">Nginx không lấy được một phản hồi dùng được</span><span class="lz-d">Kết nối bị từ chối, kết nối bị reset, DNS hỏng lúc có request, hoặc một phản hồi mà Nginx không phân tích nổi hay không nhét vừa — kể cả cái header quá cỡ ở trên. Có thứ gì đó đã kết thúc; câu hỏi là thứ gì và vì sao.</span></div>
  <div class="lz-step"><span class="lz-k">504</span><span class="lz-t">Nginx đã chờ rồi bỏ cuộc</span><span class="lz-d">Một cái hạn giờ đã hết. Thông báo nói rõ là cái nào: <code>while connecting</code> là <code>proxy_connect_timeout</code> — chuyện mạng hoặc tường lửa; <code>while reading response header</code> là <code>proxy_read_timeout</code> — ứng dụng chậm. Chương 10 đã đo cả hai.</span></div>
  <div class="lz-step"><span class="lz-k">499</span><span class="lz-t">Client bỏ cuộc trước</span><span class="lz-d">Mã phi chuẩn của riêng Nginx, chỉ có trong access log, không bao giờ được gửi cho ai. Số 499 tăng lên nghĩa là người dùng đang đóng tab vì bạn quá chậm — đó là một cái chuông báo ĐỘ TRỄ khoác áo lỗi, và nó vô hình nếu bạn chỉ cảnh báo trên 5xx.</span></div>
  <div class="lz-step"><span class="lz-k">413 / 400</span><span class="lz-t">Request bị từ chối trước tất cả những thứ trên</span><span class="lz-d"><code>413</code> là <code>client_max_body_size</code> ở Chương 7. Một cú <code>400</code> trơ trọi mà error log không nói gì thì thường là dòng request dị dạng hoặc header request quá cỡ — <code>large_client_header_buffers</code>, tấm gương soi của cú <code>502</code> ở trên.</span></div>
</div>

<h3>Cái thang</h3>
<p>Theo đúng thứ tự, vì mỗi bậc loại trừ được mọi thứ nằm dưới nó:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Nginx có trả lời gì không?</span><span class="lz-lnote"><code>curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/</code> chạy ngay trên máy đó. Không có trả lời thì vấn đề nằm ở tiến trình, ở cổng, hoặc ở tường lửa — không phải ở cấu hình.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Khối nào đã nhận nó?</span><span class="lz-lnote">Cái header <code>X-Kh</code> ở Bài 11.1, hoặc <code>curl -H 'Host: …'</code> vào loopback. Trả lời hai câu hỏi của Chương 1 và Chương 2 mà không phải đọc cấu hình.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Error log nói gì về CHÍNH request đó?</span><span class="lz-lnote">Số hiệu kết nối <code>*N</code> ở Bài 10.4 lôi nguyên câu chuyện của đúng một request ra khỏi cái tệp.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Tái hiện thẳng vào backend</span><span class="lz-lnote">Đi vòng qua Nginx: <code>curl http://127.0.0.1:3000/duong-dan</code>. Nếu backend cũng hỏng thì Nginx chỉ là người đưa tin — còn nếu nó ổn thì lỗi nằm ở khâu proxy, và đó chính là nơi cái header quá cỡ trú ngụ.</span></div>
  <div class="lz-layer"><span class="lz-lname">5. Chỉ tới lúc đó mới sửa cấu hình</span><span class="lz-lnote">Và <code>nginx -t</code>, rồi <code>reload</code>, không bao giờ <code>restart</code> — Bài 11.2 đã đo cái khác biệt đó tốn bao nhiêu.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_proxy_module — proxy_buffer_size và proxy_buffers</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size — cái bộ đệm nằm sau cú 502 đo ở trên, và vì sao nó tách riêng khỏi bộ đệm cho phần thân.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">namei(1)</span><span class="lc-sub">man7.org/linux/man-pages/man1/namei.1.html — giải quyết cả một đường dẫn kèm quyền của từng thành phần, đúng thứ mà thông báo 403 sẽ không nói cho bạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9110 §15.6 — Lỗi máy chủ 5xx</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc9110#section-15.6 — 502 và 504 được ĐỊNH NGHĨA là gì, hẹp hơn hẳn cách người ta thường hiểu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — tệp tĩnh: từ URI tới byte</span><span class="lc-sub">Chương đã đo chuyện <code>root</code> và <code>alias</code> dựng ra cái đường dẫn xuất hiện trong thông báo 404.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — A production configuration, and the test that proves it|||11.5 — Một cấu hình production, và phép thử chứng minh nó',
      slug: 'nginx-11-5-cau-hinh-production',
      type: 'LESSON',
      description: 'Toàn bộ khoá học gộp thành một tệp cấu hình, chạy thật với TLS thật và một backend thật. Rồi mười phép nghiệm thu chạy trên chính nó — và phép thứ sáu tìm ra một lỗ bảo mật trong chính cấu hình tôi vừa viết ngay sau bài học cảnh báo về nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>A production configuration, and the test that proves it</h2>
<p class="lead">Every chapter measured one mechanism. This is all of them in one file — running, with a real certificate and a real backend, checked by ten acceptance tests. One of those tests found a security hole in the configuration below, written by someone who had just finished writing Lesson 11.3 about that exact trap.</p>

<h3>The <code>http</code> block</h3>
<pre><code>worker_processes  auto;
worker_rlimit_nofile 65535;          <span class="tok-comment"># phai nang cung worker_connections (10.5)</span>
error_log  /var/log/nginx/error.log warn;   <span class="tok-comment"># warn, khong bao gio debug (10.4)</span>
events { worker_connections 4096; }

http {
    <span class="tok-comment"># ── Log (Chuong 10) ──</span>
    log_format json escape=json '{"tg":"\$time_iso8601","ip":"\$remote_addr","ma":\$status,'
        '"tgian":\$request_time,"tgian_up":"\$upstream_response_time","up":"\$upstream_addr",'
        '"uri":"\$request_uri","dem":"\$upstream_cache_status","byte":\$body_bytes_sent}';
    map \$status \$dang_chu_y { ~^[23] 0; default 1; }
    access_log /var/log/nginx/access.log json;
    access_log /var/log/nginx/loi.log    json if=\$dang_chu_y;

    sendfile on; tcp_nopush on; server_tokens off;
    keepalive_timeout 65;
    client_max_body_size 20m;                    <span class="tok-comment"># Chuong 7</span>

    gzip on; gzip_vary on; gzip_comp_level 5; gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    limit_req_zone  \$binary_remote_addr zone=chung:10m    rate=30r/s;
    limit_req_zone  \$binary_remote_addr zone=dangnhap:10m rate=5r/m;
    limit_conn_zone \$binary_remote_addr zone=ketnoi:10m;
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=web:10m max_size=500m inactive=60m;

    upstream ung_dung {
        server 127.0.0.1:3000 max_fails=3 fail_timeout=10s;
        keepalive 32;                            <span class="tok-comment"># Chuong 9</span>
    }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Two access logs</span><span class="v">The full one for a few days, and an errors-only one kept for a year. Lesson 10.3 measured that this costs nothing.</span></div>
  <div class="kv"><span class="k">Quoted upstream timers</span><span class="v"><code>"\$upstream_response_time"</code> and <code>"\$upstream_addr"</code> in quotes, <code>\$status</code> bare. Lesson 10.2 measured what happens when you get this backwards.</span></div>
  <div class="kv"><span class="k">Two rate zones</span><span class="v">A generous one for the API and a strict one for login. One zone shared between routes was a bug Chapter 7 found by probing.</span></div>
  <div class="kv"><span class="k"><code>server_tokens off</code></span><span class="v">The <code>Server</code> header becomes <code>nginx</code> instead of <code>nginx/1.24.0</code>. Small, free, and there is no reason to publish your patch level.</span></div>
</div>

<h3>The three <code>server</code> blocks</h3>
<pre><code>    <span class="tok-comment"># 1. Cong 80: CHI de chuyen huong (Chuong 6)</span>
    server {
        listen 80 default_server;
        server_name _;
        location / { return 301 https://\$host\$request_uri; }
    }
    <span class="tok-comment"># 2. Cong 443 mac dinh: tu choi ten mien la (Chuong 1)</span>
    server {
        listen 443 ssl default_server;
        ssl_certificate     /etc/letsencrypt/live/cuongthai.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/cuongthai.com/privkey.pem;
        return 444;
    }
    <span class="tok-comment"># 3. Site that</span>
    server {
        listen 443 ssl http2;                    <span class="tok-comment"># nginx &lt; 1.25.1 — xem 6.1</span>
        server_name cuongthai.com;
        root /var/www/cuongthai;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1d;
        include /etc/nginx/snippets/headers-baomat.conf;
        limit_conn ketnoi 20;

        location = /health     { access_log off; return 200 "ok\\n"; }
        location = /trang-thai { stub_status; access_log off; allow 10.0.0.0/8; deny all; }

        location /tinh/ {
            expires 1y;
            include /etc/nginx/snippets/headers-baomat.conf;   <span class="tok-comment"># BAT BUOC — xem duoi</span>
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        location = /api/dang-nhap {
            limit_req zone=dangnhap burst=3 nodelay;
            include /etc/nginx/snippets/proxy.conf;
            proxy_pass http://ung_dung;
        }
        location /api/ {
            limit_req zone=chung burst=20 nodelay;
            include /etc/nginx/snippets/proxy.conf;
            proxy_pass http://ung_dung;
        }
        location / { try_files \$uri \$uri/ /index.html; }
    }</code></pre>
<p>The <code>return 444</code> block is worth a sentence. Anything arriving on 443 with a hostname no <code>server</code> block claims — a scanner walking IP ranges, a domain someone pointed at you — hits the default and gets its connection closed with no response at all. Without it, those requests would be served your real site under the wrong name.</p>
<p>And the two snippets, which exist because of a rule rather than for tidiness:</p>
<pre><code><span class="tok-comment"># snippets/proxy.conf</span>
proxy_http_version 1.1;
proxy_set_header Connection          "";        <span class="tok-comment"># bat buoc cho keepalive (9.4)</span>
proxy_set_header Host                \$host;
proxy_set_header X-Real-IP           \$remote_addr;
proxy_set_header X-Forwarded-For     \$proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto   \$scheme;
proxy_connect_timeout 3s;
proxy_read_timeout   30s;
proxy_buffer_size    32k;                       <span class="tok-comment"># cai 502 o bai 11.4</span>
proxy_buffers      8 32k;

<span class="tok-comment"># snippets/headers-baomat.conf</span>
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options SAMEORIGIN always;</code></pre>

<h3>The acceptance test</h3>
<p>The configuration above was run against a self-signed certificate for <code>cuongthai.test</code> and a small Node backend that echoes the headers it receives. Every claim, checked:</p>
<div class="out">1) HTTP → chuyen huong HTTPS
     HTTP/1.1 301 Moved Permanently
     Location: https://cuongthai.test/bat-ky
2) ten mien LA tren 443 → return 444
     ket noi bi dong giua chung — dung nhu thiet ke
3) trang chu + header bao mat
     HTTP/2 200
     server: nginx
     strict-transport-security: max-age=31536000
     x-content-type-options: nosniff
     x-frame-options: SAMEORIGIN
4) health                          ma=200
5) API — backend nhan duoc gi
     {"duong_dan":"/api/nguoi-dung","host":"cuongthai.test",
      "ip_that":"127.0.0.1","giao_thuc":"https","lan":1}
6) tep tinh
     expires: Mon, 23 Aug 2027 19:32:16 GMT
     cache-control: max-age=31536000
     cache-control: public, immutable</div>
<p>Line 5 is the one that matters most: the backend received the real hostname, the real client address and the real scheme. Chapter 3 measured how easily all three are lost.</p>

<h3>Test 6 found a hole — in this configuration</h3>
<p>Look at what line 6 does <em>not</em> print. Counting the security headers per route:</p>
<div class="out">=== so header bao mat: / so voi /tinh/ ===
  /                        : 3 / 3 header bao mat
  /tinh/app.a1b2c3.css     : 1 / 3 header bao mat

=== cu the /tinh/ CO nhung gi ===
    x-content-type-options: nosniff
  → thieu: Strict-Transport-Security, X-Frame-Options</div>
<div class="pitfall"><strong>Bẫy — the trap from Lesson 11.3, in the config written immediately after it.</strong> The original <code>/tinh/</code> block declared <code>add_header Cache-Control</code> and <code>add_header X-Content-Type-Options</code>. That single act discarded all three server-level security headers, and the one that was re-declared by hand came back while the other two did not. Every stylesheet, script and image on the site was served without HSTS and without clickjacking protection — and the config loaded cleanly, <code>nginx -t</code> approved it, and the pages rendered perfectly.</div>
<p>The fix is the snippet, and the reason it is a snippet rather than three repeated lines is precisely this: hand-repeating a list means eventually repeating it incompletely. After replacing both copies with <code>include snippets/headers-baomat.conf</code>:</p>
<div class="out">=== sau khi sua ===
  /                        : 3 / 3 header bao mat
  /tinh/app.a1b2c3.css     : 3 / 3 header bao mat
  /api/nguoi-dung          : 3 / 3 header bao mat</div>
<div class="callout warn"><strong>This is the argument for the acceptance test, made better than any assertion could.</strong> The trap had been measured, written up, and published four screens earlier. It still made it into the next configuration, because knowing a rule is not the same as applying it under the load of forty other decisions. What caught it was not knowledge — it was a loop that counted headers on every route.</div>

<h3>The rest of the test</h3>
<div class="out">7) limit_req zone=dangnhap rate=5r/m burst=3 — ban 8 phat lien
     200 200 200 200 503 503 503 503
8) /api/ thuong (rate=30r/s burst=20) — ban 8 phat
     200 200 200 200 200 200 200 200
10) stub_status
     Active connections: 1
     server accepts handled requests
      32 32 32
     Reading: 0 Writing: 1 Waiting: 0

=== loi.log chi giu request DANG CHU Y ===
  access.log: 26 dong   loi.log: 6 dong
  ma trong loi.log: [444, 503]
  tat ca 26 dong deu phan tich duoc: OK

=== /health va /tinh/ co bi ghi log khong? ===
  so dong /health : 0
  so dong /tinh/  : 0
  so dong /api/   : 19</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">7</span><span class="lz-t">Login limiting: four through, then refusals</span><span class="lz-d">One at the rate plus a burst of three, exactly as Chapter 7 measured. Note the code is <code>503</code>; if you want <code>429</code> — which is what a client library will understand as "retry later" — set <code>limit_req_status 429</code>.</span></div>
  <div class="lz-step"><span class="lz-k">8</span><span class="lz-t">The general API limit did not fire</span><span class="lz-d">Eight requests against 30r/s with a burst of 20. A limit that never fires in testing is the correct outcome — it is there for the abnormal case, and a rate limit you can trip by hand is set too low.</span></div>
  <div class="lz-step"><span class="lz-k">10</span><span class="lz-t"><code>accepts</code> equals <code>handled</code></span><span class="lz-d">Thirty-two and thirty-two: nothing was dropped. Lesson 10.5 measured what the other case looks like.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">The logs behave as designed</span><span class="lz-d">Twenty-six lines, all valid JSON; six in the errors-only file, carrying exactly the <code>444</code>s and <code>503</code>s the test generated; zero lines for <code>/health</code> and <code>/tinh/</code>, which is <code>access_log off</code> doing its job.</span></div>
</div>

<h3>What is deliberately not here</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A cache for the API</span><span class="v"><code>proxy_cache_path</code> is declared but no <code>proxy_cache</code> uses it. Chapter 5 measured how easily caching serves the wrong user's page; turn it on per route, deliberately, with a key you have thought about.</span></div>
  <div class="kv"><span class="k">Debug headers</span><span class="v">The <code>X-Kh</code> header from 11.1 is a diagnostic tool, added when there is a question and removed when it is answered.</span></div>
  <div class="kv"><span class="k">OCSP stapling, TLS tuning beyond the basics</span><span class="v">Worth having, but measure the current recommendation rather than copying a config from a blog — cipher advice ages faster than anything else in this file.</span></div>
  <div class="kv"><span class="k">Anything untested</span><span class="v">Every directive above appears in a test result on this page. A directive nobody has watched work is a guess with good syntax.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">ssl-config.mozilla.org — generates the TLS half of this file for your exact Nginx and OpenSSL versions, and is kept current in a way a course page cannot be.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx documentation — full directive index</span><span class="lc-sub">nginx.org/en/docs/dirindex.html — every directive in the configuration above, with its default and its valid contexts.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">Mozilla Observatory / SSL Labs</span><span class="lc-sub">developer.mozilla.org/en-US/observatory and ssllabs.com/ssltest — an external acceptance test for the headers and the TLS configuration, run against the real domain.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — running this configuration in a container</span><span class="lc-sub">/courses/docker/learn${REF} — where the log paths, the certificate mounts and the reload story all change shape.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Một cấu hình production, và phép thử chứng minh nó</h2>
<p class="lead">Mỗi chương đã đo một cơ chế. Đây là tất cả chúng gộp vào một tệp — đang CHẠY, với chứng chỉ thật và backend thật, được kiểm bằng mười phép nghiệm thu. Một trong mấy phép đó đã tìm ra một lỗ bảo mật trong chính cấu hình dưới đây, viết bởi một người vừa mới viết xong Bài 11.3 về đúng cái bẫy ấy.</p>

<h3>Khối <code>http</code></h3>
<pre><code>worker_processes  auto;
worker_rlimit_nofile 65535;          <span class="tok-comment"># phai nang cung worker_connections (10.5)</span>
error_log  /var/log/nginx/error.log warn;   <span class="tok-comment"># warn, khong bao gio debug (10.4)</span>
events { worker_connections 4096; }

http {
    <span class="tok-comment"># ── Log (Chuong 10) ──</span>
    log_format json escape=json '{"tg":"\$time_iso8601","ip":"\$remote_addr","ma":\$status,'
        '"tgian":\$request_time,"tgian_up":"\$upstream_response_time","up":"\$upstream_addr",'
        '"uri":"\$request_uri","dem":"\$upstream_cache_status","byte":\$body_bytes_sent}';
    map \$status \$dang_chu_y { ~^[23] 0; default 1; }
    access_log /var/log/nginx/access.log json;
    access_log /var/log/nginx/loi.log    json if=\$dang_chu_y;

    sendfile on; tcp_nopush on; server_tokens off;
    keepalive_timeout 65;
    client_max_body_size 20m;                    <span class="tok-comment"># Chuong 7</span>

    gzip on; gzip_vary on; gzip_comp_level 5; gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    limit_req_zone  \$binary_remote_addr zone=chung:10m    rate=30r/s;
    limit_req_zone  \$binary_remote_addr zone=dangnhap:10m rate=5r/m;
    limit_conn_zone \$binary_remote_addr zone=ketnoi:10m;
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=web:10m max_size=500m inactive=60m;

    upstream ung_dung {
        server 127.0.0.1:3000 max_fails=3 fail_timeout=10s;
        keepalive 32;                            <span class="tok-comment"># Chuong 9</span>
    }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai access log</span><span class="v">Một cái đầy đủ giữ vài ngày, và một cái chỉ-có-lỗi giữ cả năm. Bài 10.3 đã đo rằng chuyện này chẳng tốn gì.</span></div>
  <div class="kv"><span class="k">Đồng hồ upstream đặt trong ngoặc</span><span class="v"><code>"\$upstream_response_time"</code> và <code>"\$upstream_addr"</code> có ngoặc, còn <code>\$status</code> để trần. Bài 10.2 đã đo chuyện gì xảy ra khi bạn làm ngược lại.</span></div>
  <div class="kv"><span class="k">Hai vùng giới hạn tốc độ</span><span class="v">Một cái rộng rãi cho API và một cái chặt cho đăng nhập. Một vùng dùng chung cho nhiều tuyến từng là một lỗi mà Chương 7 tìm ra bằng cách dò.</span></div>
  <div class="kv"><span class="k"><code>server_tokens off</code></span><span class="v">Header <code>Server</code> thành <code>nginx</code> thay vì <code>nginx/1.24.0</code>. Nhỏ, miễn phí, và chẳng có lý do gì để công bố số hiệu bản vá của bạn.</span></div>
</div>

<h3>Ba khối <code>server</code></h3>
<pre><code>    <span class="tok-comment"># 1. Cong 80: CHI de chuyen huong (Chuong 6)</span>
    server {
        listen 80 default_server;
        server_name _;
        location / { return 301 https://\$host\$request_uri; }
    }
    <span class="tok-comment"># 2. Cong 443 mac dinh: tu choi ten mien la (Chuong 1)</span>
    server {
        listen 443 ssl default_server;
        ssl_certificate     /etc/letsencrypt/live/cuongthai.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/cuongthai.com/privkey.pem;
        return 444;
    }
    <span class="tok-comment"># 3. Site that</span>
    server {
        listen 443 ssl http2;                    <span class="tok-comment"># nginx &lt; 1.25.1 — xem 6.1</span>
        server_name cuongthai.com;
        root /var/www/cuongthai;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1d;
        include /etc/nginx/snippets/headers-baomat.conf;
        limit_conn ketnoi 20;

        location = /health     { access_log off; return 200 "ok\\n"; }
        location = /trang-thai { stub_status; access_log off; allow 10.0.0.0/8; deny all; }

        location /tinh/ {
            expires 1y;
            include /etc/nginx/snippets/headers-baomat.conf;   <span class="tok-comment"># BAT BUOC — xem duoi</span>
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        location = /api/dang-nhap {
            limit_req zone=dangnhap burst=3 nodelay;
            include /etc/nginx/snippets/proxy.conf;
            proxy_pass http://ung_dung;
        }
        location /api/ {
            limit_req zone=chung burst=20 nodelay;
            include /etc/nginx/snippets/proxy.conf;
            proxy_pass http://ung_dung;
        }
        location / { try_files \$uri \$uri/ /index.html; }
    }</code></pre>
<p>Khối <code>return 444</code> đáng được nói một câu. Bất cứ thứ gì tới cổng 443 với một tên miền chẳng khối <code>server</code> nào nhận — một con dò quét dải IP, một tên miền ai đó trỏ vào bạn — đều rơi vào khối mặc định và bị đóng kết nối, không nhận được phản hồi nào cả. Thiếu nó thì mấy request đó sẽ được phục vụ bằng chính website thật của bạn dưới một cái tên sai.</p>
<p>Và hai tệp snippet, tồn tại vì một CÁI LUẬT chứ không phải vì gọn gàng:</p>
<pre><code><span class="tok-comment"># snippets/proxy.conf</span>
proxy_http_version 1.1;
proxy_set_header Connection          "";        <span class="tok-comment"># bat buoc cho keepalive (9.4)</span>
proxy_set_header Host                \$host;
proxy_set_header X-Real-IP           \$remote_addr;
proxy_set_header X-Forwarded-For     \$proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto   \$scheme;
proxy_connect_timeout 3s;
proxy_read_timeout   30s;
proxy_buffer_size    32k;                       <span class="tok-comment"># cai 502 o bai 11.4</span>
proxy_buffers      8 32k;

<span class="tok-comment"># snippets/headers-baomat.conf</span>
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options SAMEORIGIN always;</code></pre>

<h3>Phép nghiệm thu</h3>
<p>Cấu hình trên được chạy thật với một chứng chỉ tự ký cho <code>cuongthai.test</code> và một backend Node nhỏ dội lại những header nó nhận được. Mọi lời khẳng định, đều kiểm:</p>
<div class="out">1) HTTP → chuyen huong HTTPS
     HTTP/1.1 301 Moved Permanently
     Location: https://cuongthai.test/bat-ky
2) ten mien LA tren 443 → return 444
     ket noi bi dong giua chung — dung nhu thiet ke
3) trang chu + header bao mat
     HTTP/2 200
     server: nginx
     strict-transport-security: max-age=31536000
     x-content-type-options: nosniff
     x-frame-options: SAMEORIGIN
4) health                          ma=200
5) API — backend nhan duoc gi
     {"duong_dan":"/api/nguoi-dung","host":"cuongthai.test",
      "ip_that":"127.0.0.1","giao_thuc":"https","lan":1}
6) tep tinh
     expires: Mon, 23 Aug 2027 19:32:16 GMT
     cache-control: max-age=31536000
     cache-control: public, immutable</div>
<p>Dòng 5 mới là dòng quan trọng nhất: backend đã nhận được đúng tên miền thật, đúng địa chỉ khách thật và đúng giao thức thật. Chương 3 đã đo chuyện cả ba thứ đó dễ mất tới mức nào.</p>

<h3>Phép thử số 6 tìm ra một lỗ hổng — ngay trong cấu hình này</h3>
<p>Hãy nhìn vào thứ mà dòng 6 <em>KHÔNG</em> in ra. Đếm số header bảo mật trên từng tuyến:</p>
<div class="out">=== so header bao mat: / so voi /tinh/ ===
  /                        : 3 / 3 header bao mat
  /tinh/app.a1b2c3.css     : 1 / 3 header bao mat

=== cu the /tinh/ CO nhung gi ===
    x-content-type-options: nosniff
  → thieu: Strict-Transport-Security, X-Frame-Options</div>
<div class="pitfall"><strong>Bẫy — đúng cái bẫy ở Bài 11.3, trong cấu hình viết NGAY SAU bài đó.</strong> Khối <code>/tinh/</code> bản đầu có khai <code>add_header Cache-Control</code> và <code>add_header X-Content-Type-Options</code>. Chỉ riêng hành động đó đã vứt sạch cả ba header bảo mật ở mức server, và cái được khai lại bằng tay thì quay về còn hai cái kia thì không. Mọi tệp CSS, script và ảnh trên website đều được phục vụ mà không có HSTS và không có bảo vệ chống clickjacking — trong khi cấu hình nạp sạch sẽ, <code>nginx -t</code> phê duyệt, và các trang hiển thị hoàn hảo.</div>
<p>Cách sửa là cái tệp snippet, và lý do nó là snippet chứ không phải ba dòng chép lại chính là chỗ này: chép tay một danh sách nghĩa là sớm muộn cũng có lần chép thiếu. Sau khi thay cả hai bản bằng <code>include snippets/headers-baomat.conf</code>:</p>
<div class="out">=== sau khi sua ===
  /                        : 3 / 3 header bao mat
  /tinh/app.a1b2c3.css     : 3 / 3 header bao mat
  /api/nguoi-dung          : 3 / 3 header bao mat</div>
<div class="callout warn"><strong>Đây là lý lẽ cho phép nghiệm thu, và nó được nêu ra hay hơn bất cứ lời khẳng định nào.</strong> Cái bẫy đó đã được đo, được viết ra và được đăng cách đây bốn màn hình. Nó VẪN lọt vào cấu hình kế tiếp, vì BIẾT một cái luật không giống với ÁP DỤNG nó dưới sức nặng của bốn mươi quyết định khác. Thứ bắt được nó không phải là kiến thức — mà là một vòng lặp đi đếm header trên từng tuyến.</div>

<h3>Phần còn lại của phép thử</h3>
<div class="out">7) limit_req zone=dangnhap rate=5r/m burst=3 — ban 8 phat lien
     200 200 200 200 503 503 503 503
8) /api/ thuong (rate=30r/s burst=20) — ban 8 phat
     200 200 200 200 200 200 200 200
10) stub_status
     Active connections: 1
     server accepts handled requests
      32 32 32
     Reading: 0 Writing: 1 Waiting: 0

=== loi.log chi giu request DANG CHU Y ===
  access.log: 26 dong   loi.log: 6 dong
  ma trong loi.log: [444, 503]
  tat ca 26 dong deu phan tich duoc: OK

=== /health va /tinh/ co bi ghi log khong? ===
  so dong /health : 0
  so dong /tinh/  : 0
  so dong /api/   : 19</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">7</span><span class="lz-t">Giới hạn đăng nhập: bốn cái lọt, rồi từ chối</span><span class="lz-d">Một cái theo tốc độ cộng một burst bằng ba, đúng như Chương 7 đã đo. Để ý mã là <code>503</code>; nếu bạn muốn <code>429</code> — thứ mà thư viện client hiểu là "thử lại sau" — thì đặt <code>limit_req_status 429</code>.</span></div>
  <div class="lz-step"><span class="lz-k">8</span><span class="lz-t">Giới hạn API chung KHÔNG kích hoạt</span><span class="lz-d">Tám request đấu với 30r/s và burst 20. Một giới hạn không bao giờ kích hoạt trong lúc thử mới là kết quả ĐÚNG — nó ở đó cho tình huống bất thường, và một giới hạn tốc độ mà bạn gõ tay cũng chạm được là đặt quá thấp.</span></div>
  <div class="lz-step"><span class="lz-k">10</span><span class="lz-t"><code>accepts</code> bằng <code>handled</code></span><span class="lz-d">Ba mươi hai và ba mươi hai: không cái nào bị vứt. Bài 10.5 đã đo trường hợp ngược lại trông ra sao.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Log cư xử đúng thiết kế</span><span class="lz-d">Hai mươi sáu dòng, tất cả đều là JSON hợp lệ; sáu dòng trong tệp chỉ-có-lỗi, chở đúng mấy cú <code>444</code> và <code>503</code> mà phép thử sinh ra; không dòng nào cho <code>/health</code> và <code>/tinh/</code>, tức là <code>access_log off</code> đang làm việc của nó.</span></div>
</div>

<h3>Thứ CỐ Ý không có ở đây</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bộ đệm cho API</span><span class="v"><code>proxy_cache_path</code> có khai nhưng không <code>proxy_cache</code> nào dùng tới. Chương 5 đã đo chuyện bộ đệm dễ dàng phục vụ trang của người dùng KHÁC tới mức nào; hãy bật nó cho từng tuyến, một cách có chủ ý, với một cái khoá bạn đã nghĩ kỹ.</span></div>
  <div class="kv"><span class="k">Header chẩn đoán</span><span class="v">Cái header <code>X-Kh</code> ở 11.1 là công cụ chẩn đoán, thêm vào khi có câu hỏi và gỡ ra khi đã trả lời xong.</span></div>
  <div class="kv"><span class="k">OCSP stapling, tinh chỉnh TLS sâu hơn mức căn bản</span><span class="v">Đáng có, nhưng hãy tra khuyến nghị HIỆN HÀNH chứ đừng chép một cấu hình từ một bài blog — lời khuyên về bộ mã hoá cũ đi nhanh hơn mọi thứ khác trong tệp này.</span></div>
  <div class="kv"><span class="k">Bất cứ thứ gì chưa được thử</span><span class="v">Mọi chỉ thị ở trên đều xuất hiện trong một kết quả đo trên chính trang này. Một chỉ thị chẳng ai từng nhìn thấy nó chạy chỉ là một phỏng đoán có cú pháp đẹp.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">ssl-config.mozilla.org — sinh ra phần TLS của tệp này cho đúng phiên bản Nginx và OpenSSL của bạn, và nó được cập nhật theo cách mà một trang khoá học không làm được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tài liệu nginx — danh mục chỉ thị đầy đủ</span><span class="lc-sub">nginx.org/en/docs/dirindex.html — mọi chỉ thị trong cấu hình trên, kèm giá trị mặc định và các ngữ cảnh hợp lệ của nó.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">Mozilla Observatory / SSL Labs</span><span class="lc-sub">developer.mozilla.org/en-US/observatory và ssllabs.com/ssltest — một phép nghiệm thu TỪ BÊN NGOÀI cho phần header và phần TLS, chạy thẳng vào tên miền thật.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — chạy cấu hình này trong container</span><span class="lc-sub">/courses/docker/learn${REF} — nơi đường dẫn log, cách gắn chứng chỉ và câu chuyện reload đều mang hình dạng khác.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: '11.6 — Final exam|||11.6 — Bài kiểm tra cuối khoá',
      slug: 'nginx-11-6-kiem-tra-cuoi-khoa',
      type: 'QUIZ',
      description: 'Mười hai câu rút từ mười một chương, mỗi câu dựa trên một phép đo thật chứ không dựa vào tài liệu. Vài câu trong đó có đáp án ngược với thứ mà đọc lý thuyết sẽ đoán ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6</span>
<h2>Final exam</h2>
<p class="lead">Twelve questions, one from each chapter and one that crosses all of them. Every answer comes from something that was run, not from something that was read — and several of them contradict what the documentation alone would lead you to expect.</p>
<div class="callout">
<p><strong>What this course measured.</strong> Server selection starts with the address and port, not <code>Host</code>, and a request that matches nothing lands on <code>default_server</code> — renaming one file turned a refusal into a redirect with no directive edited (Ch 1). Location matching is five steps against a <code>\$uri</code> that has already been decoded and normalised, and a <code>~ \\.php</code> lets <code>.PHP</code> escape its handler (Ch 2). <code>proxy_pass</code> with any path at all substitutes rather than appends, Nginx speaks HTTP/1.0 upstream by default and replaces <code>Host</code> with the upstream address, and only <code>\$remote_addr</code> is trustworthy at the edge (Ch 3). An <code>ETag</code> is exactly <code>hex(mtime)-hex(size)</code>, so a deploy that re-creates files re-downloads every cached asset; <code>sendfile</code> turned 186 syscalls into 3 (Ch 4). A cache refuses <code>Set-Cookie</code> and <code>Cache-Control: private</code> automatically but <em>not</em> <code>Authorization</code> — measured as one user's private profile served to an anonymous visitor (Ch 5). A handshake cost 4.2 ms of CPU, yet 100 requests over one connection cost 0.30 ms each against 10.66 ms over separate ones (Ch 6). The same <code>2r/s</code> written three ways produced three different sites, and reading <code>X-Forwarded-For</code> directly let an attacker pass eight times out of eight (Ch 7). <code>break</code> stops the entire rewrite module, so a <code>return</code> written after it never runs (Ch 8). Consistent hashing moved 26% of users instead of 73% when a backend was <em>added</em>, but neither mode moved anyone when one merely failed (Ch 9). A bare <code>\$upstream_response_time</code> in a JSON log emits broken JSON on every unproxied request while passing <code>nginx -t</code>, and logging cost nothing measurable despite one extra syscall per request (Ch 10). And one <code>add_header</code> or <code>proxy_set_header</code> in a location discards every one inherited from above — which put a real security hole in the configuration in Lesson 11.5, written directly after the lesson warning about it (Ch 11).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6</span>
<h2>Bài kiểm tra cuối khoá</h2>
<p class="lead">Mười hai câu, mỗi chương một câu cộng một câu xuyên suốt tất cả. Mọi đáp án đều tới từ thứ đã được CHẠY, không phải từ thứ được ĐỌC — và vài câu trong đó mâu thuẫn với điều mà chỉ đọc tài liệu sẽ khiến bạn trông đợi.</p>
<div class="callout">
<p><strong>Khoá học này đã đo những gì.</strong> Việc chọn server bắt đầu từ địa chỉ và cổng, không phải từ <code>Host</code>, và một request không khớp gì cả sẽ rơi vào <code>default_server</code> — đổi tên một tệp đã biến một cú từ chối thành một cú chuyển hướng mà không sửa chỉ thị nào (Ch 1). Khớp location là năm bước chạy trên một <code>\$uri</code> đã được giải mã và chuẩn hoá sẵn, và một <code>~ \\.php</code> để cho <code>.PHP</code> thoát khỏi bộ xử lý của nó (Ch 2). <code>proxy_pass</code> có kèm bất kỳ đường dẫn nào thì THAY THẾ chứ không nối thêm, Nginx mặc định nói HTTP/1.0 với upstream và thay <code>Host</code> bằng địa chỉ upstream, và ở rìa mạng chỉ <code>\$remote_addr</code> là đáng tin (Ch 3). Một <code>ETag</code> đúng bằng <code>hex(mtime)-hex(size)</code>, nên một lần deploy tạo lại tệp làm mọi tài nguyên đã nằm trong bộ đệm phải tải lại; <code>sendfile</code> biến 186 syscall thành 3 (Ch 4). Bộ đệm tự động từ chối <code>Set-Cookie</code> và <code>Cache-Control: private</code> nhưng <em>KHÔNG</em> từ chối <code>Authorization</code> — đo được bằng chuyện trang hồ sơ riêng tư của một người dùng bị phục vụ cho một khách vãng lai (Ch 5). Một lần bắt tay tốn 4,2 ms CPU, nhưng 100 request trên một kết nối tốn 0,30 ms mỗi cái so với 10,66 ms khi mỗi cái một kết nối (Ch 6). Cùng một <code>2r/s</code> viết theo ba kiểu cho ra ba website khác nhau, và đọc thẳng <code>X-Forwarded-For</code> để kẻ tấn công lọt tám trên tám lần (Ch 7). <code>break</code> dừng toàn bộ module rewrite, nên một <code>return</code> viết sau nó không bao giờ chạy (Ch 8). Hash nhất quán làm 26% người dùng đổi máy thay vì 73% khi THÊM một backend, nhưng cả hai kiểu đều không làm ai đổi khi một máy chỉ đơn giản là chết (Ch 9). Một <code>\$upstream_response_time</code> để trần trong log JSON sinh ra JSON hỏng trên mọi request không qua proxy trong khi vẫn qua <code>nginx -t</code>, và ghi log chẳng tốn gì đo được dù mỗi request thêm một syscall (Ch 10). Và một dòng <code>add_header</code> hay <code>proxy_set_header</code> trong location vứt sạch mọi dòng kế thừa từ trên — chuyện đó đã đặt một lỗ hổng bảo mật thật vào cấu hình ở Bài 11.5, viết ngay sau chính bài học cảnh báo về nó (Ch 11).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'Two server blocks listen on the same port; one says listen 10.0.0.5:80 and the other listen 80. A request arrives on 10.0.0.5:80 with a Host that matches only the second block. Which handles it?|||Hai khối server cùng nghe một cổng; một cái ghi listen 10.0.0.5:80 và cái kia ghi listen 80. Một request tới trên 10.0.0.5:80 với Host chỉ khớp khối thứ hai. Khối nào xử lý nó?',
            options: [
              'The second block, because Host is what selects a server|||Khối thứ hai, vì Host là thứ chọn ra server',
              'The first — address and port pick the candidate group before Host is read, and a specific IP beats a wildcard, so Host is only compared inside that group|||Khối thứ nhất — địa chỉ và cổng chọn ra nhóm ứng viên TRƯỚC khi Host được đọc, và IP cụ thể thắng ký tự đại diện, nên Host chỉ được so bên trong nhóm đó',
              'Nginx returns 400 because the selection is ambiguous|||Nginx trả 400 vì việc chọn bị nhập nhằng',
              'Whichever block was loaded first|||Khối nào được nạp trước',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'A server has location ~ \\.php$ for PHP. A request arrives for /anh.PHP in uppercase. What happens?|||Một máy chủ có location ~ \\.php$ cho PHP. Một request tới cho /anh.PHP viết hoa. Chuyện gì xảy ra?',
            options: [
              'It matches, because Nginx lowercases the URI|||Nó khớp, vì Nginx hạ chữ thường cái URI',
              'It does not match — $uri is decoded and normalised but never case-folded, so the file escapes its handler and may be served as a download|||Nó KHÔNG khớp — $uri được giải mã và chuẩn hoá nhưng không bao giờ bị hạ chữ thường, nên cái tệp thoát khỏi bộ xử lý của nó và có thể bị phục vụ như một tệp tải về',
              'Nginx returns 404|||Nginx trả về 404',
              'It matches only if the file exists|||Nó chỉ khớp nếu tệp có tồn tại',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'location /api/ { proxy_pass http://be/; } — note the trailing slash. A request for /api/nguoi-dung reaches the backend as what?|||location /api/ { proxy_pass http://be/; } — chú ý dấu gạch chéo cuối. Một request tới /api/nguoi-dung sẽ tới backend dưới dạng gì?',
            options: [
              '/api/nguoi-dung, unchanged|||/api/nguoi-dung, giữ nguyên',
              '/nguoi-dung — any path on proxy_pass, even a bare slash, substitutes for the matched prefix instead of appending to it|||/nguoi-dung — bất kỳ đường dẫn nào trên proxy_pass, kể cả một dấu gạch chéo trơ trọi, đều THAY THẾ cho tiền tố đã khớp chứ không nối thêm vào',
              '/api/api/nguoi-dung|||/api/api/nguoi-dung',
              'It fails with 502|||Nó hỏng với mã 502',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'Your deploy copies fresh files into place, and every browser re-downloads every asset even though the file contents did not change. Why?|||Lần deploy của bạn chép tệp mới vào chỗ cũ, và mọi trình duyệt tải lại toàn bộ tài nguyên dù nội dung tệp không đổi. Vì sao?',
            options: [
              'Nginx disables caching after a reload|||Nginx tắt bộ đệm sau khi nạp lại cấu hình',
              'The ETag is hex(mtime)-hex(size), so re-creating a file changes its mtime and therefore its ETag, even with identical bytes|||ETag đúng bằng hex(mtime)-hex(size), nên tạo lại một tệp là đổi mtime của nó và do đó đổi luôn ETag, dù byte y hệt',
              'The browsers were updated|||Trình duyệt vừa được cập nhật',
              'gzip changes the content on every request|||gzip làm đổi nội dung ở mỗi request',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'You put proxy_cache in front of an API where users fetch their own profile with an Authorization header. What did the measurement show?|||Bạn đặt proxy_cache trước một API mà người dùng lấy hồ sơ của chính mình bằng header Authorization. Phép đo cho thấy gì?',
            options: [
              'Nothing is cached, because Authorization disables caching|||Không gì bị đệm, vì Authorization tắt bộ đệm',
              'User A private profile was served to an anonymous visitor and to a different logged-in user — Nginx refuses Set-Cookie and Cache-Control: private automatically, but not Authorization|||Hồ sơ riêng tư của người dùng A bị phục vụ cho một khách vãng lai và cho một người dùng khác đã đăng nhập — Nginx tự động từ chối Set-Cookie và Cache-Control: private, nhưng KHÔNG từ chối Authorization',
              'Each user gets their own cache entry automatically|||Mỗi người dùng tự động có mục đệm riêng',
              'The cache returns 401 for everyone|||Bộ đệm trả 401 cho tất cả mọi người',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A TLS handshake was measured at about 4.2 ms of CPU. What did the 100-request comparison establish about where to spend tuning effort?|||Một lần bắt tay TLS đo được khoảng 4,2 ms CPU. Phép so sánh 100 request xác lập điều gì về chỗ nên bỏ công tinh chỉnh?',
            options: [
              'Cipher choice is the dominant cost|||Việc chọn bộ mã hoá là chi phí chủ đạo',
              'Connection reuse dominates: 0.30 ms per request over one connection against 10.66 ms over separate ones, so keepalive matters far more than any cipher decision|||Tái dùng kết nối mới là chủ đạo: 0,30 ms mỗi request trên một kết nối so với 10,66 ms khi mỗi cái một kết nối, nên keepalive quan trọng hơn hẳn mọi quyết định về bộ mã hoá',
              'TLS should be terminated elsewhere|||Nên kết thúc TLS ở chỗ khác',
              'HTTP/2 removes the handshake cost|||HTTP/2 loại bỏ chi phí bắt tay',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'limit_req rate=2r/s was written three ways. Which description matches burst=5 nodelay?|||limit_req rate=2r/s được viết theo ba kiểu. Mô tả nào ứng với burst=5 nodelay?',
            options: [
              'All ten requests served, spread over about 4.93 seconds|||Cả mười request đều được phục vụ, trải ra khoảng 4,93 giây',
              'Five served instantly, then the rest refused — the burst is granted immediately rather than queued|||Năm cái được phục vụ tức thì, rồi phần còn lại bị từ chối — cái burst được cấp ngay lập tức thay vì bị xếp hàng',
              'Nine of ten refused|||Chín trên mười bị từ chối',
              'It behaves identically to burst=5 without nodelay|||Nó cư xử y hệt burst=5 không có nodelay',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'A location contains rewrite ... break; and then return 200 "ok"; on the next line. What does the client receive?|||Một location chứa rewrite ... break; rồi dòng kế tiếp là return 200 "ok";. Client nhận được gì?',
            options: [
              'The string ok, with status 200|||Chuỗi ok, với mã 200',
              'Not the return at all — break stops the whole rewrite module, so every directive from it that follows is dead code|||Hoàn toàn không phải cái return — break dừng cả module rewrite, nên mọi chỉ thị của module đó viết phía sau đều là mã chết',
              'A 301 redirect|||Một cú chuyển hướng 301',
              'A 500, because the two conflict|||Mã 500, vì hai cái xung đột',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'You switch from hash to hash ... consistent so that a failing backend stops reshuffling your cache keys. What did the measurement show?|||Bạn đổi từ hash sang hash ... consistent để một backend chết thôi xáo trộn khoá bộ đệm. Phép đo cho thấy gì?',
            options: [
              'Consistent hashing fixed it — a failed backend now moves nobody, unlike before|||Hash nhất quán đã sửa được — một backend chết giờ không làm ai đổi máy, khác trước',
              'It changed nothing for that case: a failed server keeps its ring position, so neither mode moved anyone. Consistency only helps when a backend is added or removed — 26% versus 73%|||Nó không đổi gì cho trường hợp đó: một máy chết vẫn giữ vị trí trên vòng, nên cả hai kiểu đều không làm ai đổi. Tính nhất quán chỉ giúp khi THÊM hoặc BỚT một backend — 26% so với 73%',
              'Consistent hashing made it worse|||Hash nhất quán làm nó tệ hơn',
              'ip_hash would have been required|||Bắt buộc phải dùng ip_hash',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Your JSON access log has fed a log pipeline for a year. You add location = /health { return 200 "ok"; }. What can break, and why did nothing warn you?|||Log JSON của bạn đã nuôi một đường ống thu gom suốt một năm. Bạn thêm location = /health { return 200 "ok"; }. Cái gì có thể vỡ, và vì sao chẳng có gì cảnh báo bạn?',
            options: [
              'Nothing — a return cannot affect logging|||Không gì cả — một cái return không ảnh hưởng tới việc ghi log',
              'If any upstream_* variable is unquoted in the format, those lines emit a key with no value and are invalid JSON — the fault only appears on requests Nginx answers itself, and nginx -t knows nothing about JSON|||Nếu có biến upstream_* nào để trần trong định dạng, những dòng đó sinh ra một khoá không có giá trị và không phải JSON hợp lệ — lỗi chỉ hiện ra trên những request Nginx tự trả lời, và nginx -t thì chẳng biết gì về JSON',
              'The log file grows too fast|||Tệp log phình quá nhanh',
              'access_log off is required on every return block|||Mọi khối return đều bắt buộc phải có access_log off',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A site sets three security headers at server level. One location later adds add_header Cache-Control "..." for static files. What is the state of that location?|||Một website đặt ba header bảo mật ở mức server. Về sau một location thêm add_header Cache-Control "..." cho tệp tĩnh. Location đó ở trạng thái nào?',
            options: [
              'It has four headers|||Nó có bốn header',
              'It has one — declaring any add_header discards the entire inherited list, so all three security headers silently stop being sent on that route|||Nó có MỘT — khai bất kỳ add_header nào là vứt sạch cả danh sách kế thừa, nên cả ba header bảo mật lặng lẽ ngừng được gửi trên tuyến đó',
              'It has three, since Cache-Control has a different name|||Nó có ba, vì Cache-Control tên khác',
              'Nginx refuses to load the configuration|||Nginx từ chối nạp cấu hình',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'You edited nginx.conf on a production box and made a syntax error you have not noticed. Which command leaves the site up?|||Bạn vừa sửa nginx.conf trên một máy production và mắc một lỗi cú pháp mà bạn chưa nhận ra. Lệnh nào giữ cho website còn sống?',
            options: [
              'systemctl restart nginx, because it reloads cleanly|||systemctl restart nginx, vì nó nạp lại sạch sẽ',
              'nginx -s reload — the master rejects the broken config, logs emerg and keeps the old workers serving; a restart in the same situation leaves nothing listening|||nginx -s reload — master từ chối cấu hình hỏng, ghi một dòng emerg và giữ nguyên đám worker cũ đang phục vụ; còn restart trong đúng tình huống đó thì không còn ai lắng nghe nữa',
              'Both behave the same way|||Cả hai cư xử như nhau',
              'Neither — a syntax error always causes downtime|||Không lệnh nào — lỗi cú pháp thì luôn gây gián đoạn',
            ],
            correctIndex: 1,
            points: 15,
          },
        ],
      },
    },
  ],
};
