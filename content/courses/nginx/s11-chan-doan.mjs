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
  ],
};
