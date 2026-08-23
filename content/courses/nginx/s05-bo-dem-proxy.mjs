const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 5 — Caching in front of your application|||Chương 5 — Bộ đệm đặt trước ứng dụng của bạn',
  description: 'Nginx giữ được phản hồi của upstream và trả lại chúng mà không hỏi lại lần nào. Chương này đo mọi thứ: cái gì cache được và cái gì âm thầm KHÔNG, ai quyết định thời hạn khi upstream và cấu hình nói khác nhau, 20 request đồng thời gọi upstream mấy lần, và chuyện gì xảy ra khi upstream CHẾT hẳn.',
  lessons: [

    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Turning caching on, and what the key is made of|||5.1 — Bật bộ đệm lên, và cái khoá được làm từ gì',
      slug: 'nginx-5-1-bat-bo-dem',
      type: 'LESSON',
      description: 'Ba chỉ thị biến một con proxy thành một bộ đệm. Bài này dựng chúng trên một upstream biết ĐẾM số lần nó bị gọi, để mỗi phép đo đều nói thẳng ra rằng request có tới được ứng dụng hay không.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Turning caching on, and what the key is made of</h2>
<p class="lead">A reverse proxy that keeps responses is a different thing from one that forwards them. Three directives make the change, and the whole chapter is measured against an upstream that counts how many times it was called — so every result says plainly whether the request reached your application.</p>

<h3>The three directives</h3>
<pre><code>http {
  <span class="tok-comment"># Kho chứa: nằm ở tầng http, KHÔNG đặt trong server được</span>
  proxy_cache_path /var/cache/nginx
                   levels=1:2            <span class="tok-comment"># cây thư mục 2 tầng, tránh 1 thư mục triệu tệp</span>
                   keys_zone=kho:10m     <span class="tok-comment"># 10MB bộ nhớ chung ~ 80.000 khoá</span>
                   max_size=10g          <span class="tok-comment"># trần ĐĨA; vượt thì đuổi bản cũ nhất</span>
                   inactive=60m;         <span class="tok-comment"># không ai hỏi trong 60 phút thì xoá</span>

  server {
    add_header X-Cache-Status \$upstream_cache_status always;   <span class="tok-comment"># để NHÌN THẤY nó</span>

    location / {
      proxy_cache       kho;             <span class="tok-comment"># dùng kho nào</span>
      proxy_cache_valid 200 10s;         <span class="tok-comment"># giữ 200 trong 10 giây</span>
      proxy_pass http://127.0.0.1:9201;
    }
  }
}</code></pre>
<div class="out">Upstream DEM so lan no bi goi va in ra trong than phan hoi:

  lan 1: binh thuong, lan goi upstream thu 1   X-Cache-Status: MISS
  lan 2: binh thuong, lan goi upstream thu 1   X-Cache-Status: HIT
  lan 3: binh thuong, lan goi upstream thu 1   X-Cache-Status: HIT
                                     ^ van la "thu 1" => upstream KHONG bi goi lai</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">keys_zone is memory, max_size is disk</span><span class="lz-d">The zone holds the key index and metadata in shared memory — about 8000 keys per megabyte. The bodies live on disk under <code>max_size</code>. Running out of zone evicts entries even when there is disk to spare, so size the zone for your number of distinct URLs.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">levels= exists because of the filesystem</span><span class="lz-d">Without it every cached body lands in one directory, and a directory with a million entries is slow to operate on for everything, including the cleanup process. <code>1:2</code> spreads them over 16 × 256 subdirectories.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">inactive is not a TTL</span><span class="lz-d">It is "delete if nobody asked for this in that long", independent of freshness. An entry can be stale and still present because it is popular, or fresh and deleted because nobody wanted it. <code>proxy_cache_valid</code> is the freshness setting.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">$upstream_cache_status is how you see any of this</span><span class="lz-d">Six values: <code>MISS</code>, <code>HIT</code>, <code>EXPIRED</code>, <code>STALE</code>, <code>UPDATING</code>, <code>BYPASS</code>. Put it in a response header while you are developing and in the access log permanently — without it caching is invisible and you will debug it by guessing.</span></div>
</div>

<h3>The key, measured</h3>
<div class="out">Khoa mac dinh: $scheme$proxy_host$request_uri

  /trang?a=1   -> MISS   (upstream thu 9)
  /trang?a=2   -> MISS   (upstream thu 10)   &lt;- query khac => muc KHAC
  /trang?a=1   -> HIT    (upstream thu 9)    &lt;- quay lai thi trung</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The query string is part of the key</span><span class="v">Because <code>\$request_uri</code> includes it. That is correct for an API and wasteful for a page where <code>?utm_source=...</code> changes nothing — every campaign link becomes a separate cache entry for identical content. Stripping tracking parameters before the key is a real optimisation on a content site.</span></div>
  <div class="kv"><span class="k">The Host is not, by default</span><span class="v"><code>\$proxy_host</code> is the upstream's address, not the client's <code>Host</code>. On a server block that serves several hostnames from one cache, two sites share entries for the same path — usually wrong. Add <code>\$host</code> to the key when one cache serves more than one site.</span></div>
  <div class="kv"><span class="k">Nothing about the user is in it</span><span class="v">No cookie, no header, no authentication state. That is what makes a shared cache fast and what makes it dangerous: if a personalised response ever gets stored, the next visitor gets it. Lesson 5.2 measures the defaults that prevent this.</span></div>
  <div class="kv"><span class="k">Add to the key only what changes the response</span><span class="v"><code>proxy_cache_key "\$scheme\$host\$request_uri\$http_accept_encoding";</code> if compression varies the body. Every element you add multiplies the number of entries, so each one needs a reason.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — a cache in front of an application is a second source of truth, and the first thing it breaks is your ability to see what is happening.</strong> A bug report says a user saw old data; you check the application and it is correct; you check again from your machine and it is correct. The response the user got never touched the application at all. Two habits make this tractable from day one: log <code>\$upstream_cache_status</code> in the access log format so every line says <code>HIT</code> or <code>MISS</code>, and keep a way to bypass the cache on demand — <code>proxy_cache_bypass \$http_x_bo_qua_cache;</code> lets you send one header and see what the upstream would actually return.</p>
</div>

<h3>Where the cache lives on disk</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One file per cached response</span><span class="lz-lnote">Named by the MD5 of the key, containing a small header followed by the response. You can find the file for a URL by hashing the key yourself, which is occasionally the fastest way to confirm what was stored.</span></div>
  <div class="lz-layer"><span class="lz-lname">A cache manager process handles eviction</span><span class="lz-lnote">It enforces <code>max_size</code> and <code>inactive</code> in the background. That is why disk usage lags behind the limit rather than tracking it exactly, and why a full disk is still possible if <code>max_size</code> was set larger than the space you actually have.</span></div>
  <div class="lz-layer"><span class="lz-lname">A cache loader reads the tree at startup</span><span class="lz-lnote">On restart Nginx rebuilds the key index by walking the directory. With millions of entries that takes a while, and until it finishes those entries are misses — a detail worth knowing before you restart a busy cache at peak time.</span></div>
  <div class="lz-layer"><span class="lz-lname">Deleting the files is a valid purge</span><span class="lz-lnote">Selective purging is a commercial feature, but <code>rm -rf</code> on the cache directory followed by a reload works and is what most people actually do. For anything finer, <code>proxy_cache_bypass</code> with a secret header covers the common need without buying anything.</span></div>
</div>
<div class="note-ct">
<p><strong>Start with a short TTL.</strong> <code>proxy_cache_valid 200 10s;</code> on a busy endpoint already removes most of the load — at 100 requests per second it turns 1000 upstream calls into one — while keeping the window where anyone can see stale data down to ten seconds. Long TTLs are for content you can purge or version; short ones are almost free and almost never wrong.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_path" target="_blank" rel="noopener"><span class="lc-ico">🗃️</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_path</span><span class="lc-sub">nginx.org · Every parameter, including levels, inactive and the loader options</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#var_upstream_cache_status" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">nginx — $upstream_cache_status</span><span class="lc-sub">nginx.org · The six values and exactly when each is set</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" target="_blank" rel="noopener"><span class="lc-ico">💾</span><span class="lc-body"><span class="lc-title">MDN — HTTP caching</span><span class="lc-sub">developer.mozilla.org · Shared versus private caches, which is the distinction this chapter turns on</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">The same problem one layer deeper, and when to cache there instead</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Run a counting upstream, watch MISS become HIT, then change the query string</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Bật bộ đệm lên, và cái khoá được làm từ gì</h2>
<p class="lead">Một con reverse proxy biết GIỮ phản hồi là một thứ khác hẳn con proxy chỉ chuyển tiếp chúng. Ba chỉ thị làm nên thay đổi đó, và cả chương này được đo trên một upstream biết ĐẾM số lần nó bị gọi — nên mọi kết quả đều nói thẳng ra rằng request có tới được ứng dụng của bạn hay không.</p>

<h3>Ba chỉ thị</h3>
<pre><code>http {
  <span class="tok-comment"># Kho chứa: nằm ở tầng http, KHÔNG đặt trong server được</span>
  proxy_cache_path /var/cache/nginx
                   levels=1:2            <span class="tok-comment"># cây thư mục 2 tầng, tránh 1 thư mục triệu tệp</span>
                   keys_zone=kho:10m     <span class="tok-comment"># 10MB bộ nhớ chung ~ 80.000 khoá</span>
                   max_size=10g          <span class="tok-comment"># trần ĐĨA; vượt thì đuổi bản cũ nhất</span>
                   inactive=60m;         <span class="tok-comment"># không ai hỏi trong 60 phút thì xoá</span>

  server {
    add_header X-Cache-Status \$upstream_cache_status always;   <span class="tok-comment"># để NHÌN THẤY nó</span>

    location / {
      proxy_cache       kho;             <span class="tok-comment"># dùng kho nào</span>
      proxy_cache_valid 200 10s;         <span class="tok-comment"># giữ 200 trong 10 giây</span>
      proxy_pass http://127.0.0.1:9201;
    }
  }
}</code></pre>
<div class="out">Upstream DEM so lan no bi goi va in ra trong than phan hoi:

  lan 1: binh thuong, lan goi upstream thu 1   X-Cache-Status: MISS
  lan 2: binh thuong, lan goi upstream thu 1   X-Cache-Status: HIT
  lan 3: binh thuong, lan goi upstream thu 1   X-Cache-Status: HIT
                                     ^ van la "thu 1" => upstream KHONG bi goi lai</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">keys_zone là BỘ NHỚ, max_size là ĐĨA</span><span class="lz-d">Cái vùng đó giữ chỉ mục khoá và siêu dữ liệu trong bộ nhớ chung — chừng 8000 khoá mỗi megabyte. Phần thân nằm trên đĩa dưới trần <code>max_size</code>. Cạn vùng nhớ là bị đuổi mục KỂ CẢ khi đĩa còn thừa, nên hãy định cỡ cái vùng theo SỐ URL khác nhau của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">levels= tồn tại là vì HỆ TỆP</span><span class="lz-d">Thiếu nó thì mọi thân đã cache rơi vào MỘT thư mục, mà một thư mục có triệu mục thì chậm với mọi thao tác, kể cả với tiến trình dọn dẹp. <code>1:2</code> trải chúng ra 16 × 256 thư mục con.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">inactive KHÔNG phải là TTL</span><span class="lz-d">Nó là "xoá nếu chừng ấy lâu không ai hỏi tới", độc lập với độ tươi. Một mục có thể ĐÃ CŨ mà vẫn còn đó vì nó đông khách, hoặc còn TƯƠI mà bị xoá vì chẳng ai cần. <code>proxy_cache_valid</code> mới là thiết lập về độ tươi.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">$upstream_cache_status là cách bạn NHÌN THẤY mọi thứ này</span><span class="lz-d">Sáu giá trị: <code>MISS</code>, <code>HIT</code>, <code>EXPIRED</code>, <code>STALE</code>, <code>UPDATING</code>, <code>BYPASS</code>. Hãy nhét nó vào một header phản hồi lúc đang làm và vào access log VĨNH VIỄN — thiếu nó thì bộ đệm là vô hình và bạn sẽ đi gỡ lỗi bằng cách ĐOÁN.</span></div>
</div>

<h3>Cái khoá, đo thật</h3>
<div class="out">Khoa mac dinh: $scheme$proxy_host$request_uri

  /trang?a=1   -> MISS   (upstream thu 9)
  /trang?a=2   -> MISS   (upstream thu 10)   &lt;- query khac => muc KHAC
  /trang?a=1   -> HIT    (upstream thu 9)    &lt;- quay lai thi trung</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Query string LÀ một phần của khoá</span><span class="v">Vì <code>\$request_uri</code> có nó bên trong. Điều đó ĐÚNG với một API và LÃNG PHÍ với một trang mà <code>?utm_source=...</code> chẳng đổi gì — mỗi đường dẫn chiến dịch thành một mục cache riêng cho cùng một nội dung. Lột bỏ tham số theo dõi trước khi tính khoá là một phép tối ưu CÓ THẬT trên site nội dung.</span></div>
  <div class="kv"><span class="k">Host thì KHÔNG, theo mặc định</span><span class="v"><code>\$proxy_host</code> là địa chỉ của upstream, không phải <code>Host</code> của client. Trên một khối server phục vụ nhiều tên miền từ chung một cache thì hai site DÙNG CHUNG mục cho cùng một đường dẫn — thường là sai. Hãy thêm <code>\$host</code> vào khoá khi một cache phục vụ hơn một site.</span></div>
  <div class="kv"><span class="k">KHÔNG có gì về người dùng nằm trong đó</span><span class="v">Không cookie, không header, không trạng thái xác thực. Đó là thứ làm một bộ đệm dùng chung nhanh và cũng là thứ làm nó NGUY: nếu một phản hồi cá nhân hoá lỡ được cất vào thì người khách tiếp theo nhận đúng nó. Bài 5.2 đo những mặc định ngăn chuyện đó.</span></div>
  <div class="kv"><span class="k">Chỉ thêm vào khoá thứ nào THỰC SỰ làm đổi phản hồi</span><span class="v"><code>proxy_cache_key "\$scheme\$host\$request_uri\$http_accept_encoding";</code> nếu phép nén làm đổi thân. Mỗi thành phần bạn thêm vào là NHÂN LÊN số mục, nên mỗi cái đều cần một lý do.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một bộ đệm đặt trước ứng dụng là một NGUỒN SỰ THẬT THỨ HAI, và thứ đầu tiên nó phá là khả năng bạn nhìn thấy chuyện gì đang xảy ra.</strong> Một báo cáo lỗi nói người dùng thấy dữ liệu cũ; bạn kiểm ứng dụng thì nó đúng; bạn kiểm lại từ máy mình thì cũng đúng. Cái phản hồi người dùng nhận được CHƯA TỪNG chạm tới ứng dụng. Hai thói quen làm chuyện này xử lý được ngay từ ngày đầu: ghi <code>\$upstream_cache_status</code> vào định dạng access log để MỖI dòng đều nói <code>HIT</code> hay <code>MISS</code>, và giữ một cách BỎ QUA cache theo yêu cầu — <code>proxy_cache_bypass \$http_x_bo_qua_cache;</code> cho phép bạn gửi một header và nhìn thấy upstream THẬT SỰ sẽ trả về gì.</p>
</div>

<h3>Bộ đệm nằm ở đâu trên đĩa</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mỗi phản hồi đã cache là MỘT tệp</span><span class="lz-lnote">Đặt tên theo MD5 của cái khoá, bên trong là một header nhỏ rồi tới phản hồi. Bạn tự băm cái khoá là tìm ra tệp của một URL, và đôi khi đó là cách nhanh nhất để xác nhận cái gì đã được cất vào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một tiến trình cache manager lo việc ĐUỔI</span><span class="lz-lnote">Nó thi hành <code>max_size</code> và <code>inactive</code> ở nền. Đó là lý do dung lượng đĩa chạy TRỄ so với cái trần chứ không bám sát nó, và là lý do đĩa vẫn có thể đầy nếu <code>max_size</code> được đặt lớn hơn chỗ trống bạn thật sự có.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một cache loader ĐỌC cả cây lúc khởi động</span><span class="lz-lnote">Lúc khởi động lại, Nginx dựng lại chỉ mục khoá bằng cách đi hết thư mục. Với hàng triệu mục thì việc đó mất một lúc, và cho tới khi nó xong thì những mục ấy đều là MISS — một chi tiết đáng biết TRƯỚC khi bạn khởi động lại một cache đông khách vào giờ cao điểm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xoá tệp đi cũng là một cách purge hợp lệ</span><span class="lz-lnote">Purge có chọn lọc là tính năng thương mại, nhưng <code>rm -rf</code> thư mục cache rồi nạp lại thì CHẠY, và đó là điều phần lớn mọi người thật sự làm. Cần tinh hơn thì <code>proxy_cache_bypass</code> với một header bí mật lo được nhu cầu thường gặp mà không phải mua gì.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy bắt đầu bằng một TTL NGẮN.</strong> <code>proxy_cache_valid 200 10s;</code> trên một điểm cuối đông khách đã gỡ được phần lớn tải — ở mức 100 request mỗi giây thì nó biến 1000 lượt gọi upstream thành MỘT — trong khi giữ cái cửa sổ mà ai đó có thể nhìn thấy dữ liệu cũ xuống còn mười giây. TTL dài dành cho nội dung bạn purge được hoặc đánh phiên bản được; TTL ngắn thì gần như miễn phí và gần như không bao giờ sai.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_path" target="_blank" rel="noopener"><span class="lc-ico">🗃️</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_path</span><span class="lc-sub">nginx.org · Mọi tham số, kèm levels, inactive và các tuỳ chọn của loader</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#var_upstream_cache_status" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">nginx — $upstream_cache_status</span><span class="lc-sub">nginx.org · Sáu giá trị và chính xác khi nào mỗi cái được đặt</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" target="_blank" rel="noopener"><span class="lc-ico">💾</span><span class="lc-body"><span class="lc-title">MDN — Bộ đệm HTTP</span><span class="lc-sub">developer.mozilla.org · Bộ đệm dùng chung và bộ đệm riêng, đúng cái ranh giới cả chương này xoay quanh</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Cùng bài toán ấy nhưng sâu hơn một tầng, và khi nào nên cache ở đó thay vì ở đây</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Chạy một upstream biết đếm, xem MISS thành HIT, rồi đổi query string</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — What gets cached, and the leak when something should not have been|||5.2 — Cái gì được cache, và vụ rò rỉ khi có thứ lẽ ra không nên',
      slug: 'nginx-5-2-cai-gi-duoc-cache',
      type: 'LESSON',
      description: 'Nginx có vài mặc định che chở bạn và vài chỗ nó KHÔNG che. Bài này đo cả hai, rồi dựng lại một vụ rò rỉ thật: hồ sơ riêng của người dùng A được cache, và hai request sau đó — một khách vãng lai và một người dùng B — đều nhận về hồ sơ của A.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>What gets cached, and the leak when something should not have been</h2>
<p class="lead">A shared cache stores one response and hands it to everybody. That is the entire value and the entire risk, and which responses end up in it is decided by a small set of defaults — some of which protect you and one of which does not.</p>

<h3>What Nginx refuses to cache, measured</h3>
<div class="out">Upstream tra ve Set-Cookie:
  lan 1  MISS      lan 2  MISS      &lt;- KHONG BAO GIO vao cache

Upstream tra ve Cache-Control: private:
  lan 1  MISS      lan 2  MISS      &lt;- cung vay

Upstream tra ve 500 (proxy_cache_valid chi khai 200):
  lan 1  MISS      lan 2  MISS      &lt;- khong khai thi khong cache

Phuong thuc:
  GET  lan 1  MISS      GET lan 2  HIT
  HEAD        HIT                        &lt;- dung chung muc voi GET
  POST lan 1  (rong)    POST lan 2 (rong)  &lt;- bien con khong duoc dat</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Set-Cookie disables caching for that response</span><span class="lz-d">Because a cookie is usually per-user, and storing the response would hand one user's session to the next visitor. This default is doing a lot of quiet work: it is why a login endpoint you forgot to exclude does not become a disaster.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cache-Control: private, no-store or no-cache from the upstream disables it too</span><span class="lz-d">These are the application saying "this is not shareable", and Nginx believes it. This is the mechanism your application should be using — one header on the responses that carry personal data.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Only the statuses you name in proxy_cache_valid are stored</span><span class="lz-d">The <code>500</code> was refetched every time because only <code>200</code> was declared. Caching errors briefly (<code>proxy_cache_valid 500 502 503 504 1s;</code>) is a real technique for shielding a struggling backend, but it must be deliberate.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Only GET and HEAD are cached</span><span class="lz-d"><code>proxy_cache_methods</code> defaults to those two. POST went straight through both times and <code>\$upstream_cache_status</code> was not even set. HEAD reused the GET entry, which is what you want.</span></div>
</div>

<h3>The default that does NOT protect you</h3>
<div class="out">Upstream tra ve noi dung RIENG cua tung nguoi, KHONG dat Cache-Control:

  1. Nguoi dung A (co token)   MISS   HO SO CUA: Bearer TOKEN-CUA-A
  2. Khach VANG LAI            HIT    HO SO CUA: Bearer TOKEN-CUA-A   &lt;-- RO RI
  3. Nguoi dung B (token khac) HIT    HO SO CUA: Bearer TOKEN-CUA-A   &lt;-- RO RI</div>
<div class="pitfall">
<p><strong>Bẫy — <code>Authorization</code> is not part of the cache key and does not prevent caching, so an authenticated response with no <code>Cache-Control</code> is stored and served to everyone.</strong> The three rows above are one config, one URL and three requests: user A's private profile was cached, then an anonymous visitor and a different logged-in user both received it. Nothing errored, nothing was logged as unusual, and the application was returning correct data every time it was asked — it just stopped being asked. The failure is a collaboration: the application omitted <code>Cache-Control: private</code>, and the proxy had no way to know the response was personal. Fix it on both sides. In the application, every response carrying user data gets <code>Cache-Control: private, no-store</code>. In Nginx, add a belt: <code>proxy_no_cache \$http_authorization \$cookie_phien;</code> and <code>proxy_cache_bypass \$http_authorization \$cookie_phien;</code> so a request that carries credentials is neither stored nor served from the shared cache.</p>
</div>
<pre><code>location /api/ {
  proxy_cache kho;
  proxy_cache_valid 200 10s;

  <span class="tok-comment"># KHÔNG cất phản hồi của một request có mang thông tin đăng nhập</span>
  proxy_no_cache      \$http_authorization \$cookie_phien;
  <span class="tok-comment"># và KHÔNG lấy từ cache ra cho một request như thế</span>
  proxy_cache_bypass  \$http_authorization \$cookie_phien;

  proxy_pass http://api;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">proxy_no_cache and proxy_cache_bypass are two different halves</span><span class="v"><code>no_cache</code> stops storing; <code>bypass</code> stops serving. You need both — with only the first, an authenticated user still gets whatever anonymous copy is sitting in the cache; with only the second, their private response still gets written for everyone else.</span></div>
  <div class="kv"><span class="k">Both fire when any argument is non-empty and not "0"</span><span class="v">So listing several variables means "if any of these is set". A missing header is an empty string, which is why <code>\$http_authorization</code> works directly with no comparison.</span></div>
  <div class="kv"><span class="k">The client cannot bust the cache, and that surprises people</span><span class="v">Measured: a request with <code>Cache-Control: no-cache</code> or <code>Pragma: no-cache</code> still returned <code>HIT</code>. Nginx ignores client cache directives by default. A user pressing hard-refresh does not reach your application, which is usually right and is worth knowing when someone insists they cleared their cache.</span></div>
  <div class="kv"><span class="k">Vary from the upstream is respected</span><span class="v">If the upstream sends <code>Vary: Accept-Encoding</code>, Nginx stores a variant per encoding. If it sends <code>Vary: *</code> the response is not cached at all — which is a heavy-handed but effective way for an application to opt one endpoint out.</span></div>
</div>

<h3>Deciding what to cache, in order</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cache by allow-list, never by deny-list</span><span class="lz-lnote">Put <code>proxy_cache</code> on the specific locations that serve public content, not at <code>server</code> level with exclusions. A route added next month inherits nothing that way, and the failure mode of forgetting is "not cached" rather than "leaked".</span></div>
  <div class="lz-layer"><span class="lz-lname">Ask "would I be happy for a stranger to see this response"</span><span class="lz-lnote">If the answer depends on who asked, it does not belong in a shared cache at any TTL. Personalised responses want a per-user cache in the application, not this one.</span></div>
  <div class="lz-layer"><span class="lz-lname">Public list endpoints are where the win is</span><span class="lz-lnote">A product listing, a public feed, a search over public data, an image resize. High traffic, identical for everyone, expensive to produce — that combination is what a proxy cache is for, and a ten-second TTL on it can remove most of your load.</span></div>
  <div class="lz-layer"><span class="lz-lname">Test the leak deliberately before you ship</span><span class="lz-lnote">Request an authenticated endpoint with a token, then request the same URL with no token, and read the body. It takes two <code>curl</code> commands and it is the only check that actually proves the boundary holds — the three rows above came from exactly that.</span></div>
</div>
<div class="note-ct">
<p><strong>The rule that covers all of it.</strong> Nginx caches a response when nothing told it not to. Every protection in this lesson is the upstream saying "do not", so the burden is on your application to say so — and on your config to add a second lock for the cases where it forgets. Silence is consent, and by default the cache takes it.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_no_cache" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">nginx — proxy_no_cache and proxy_cache_bypass</span><span class="lc-sub">nginx.org · The two halves, and how the arguments are evaluated</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_methods" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_methods and proxy_ignore_headers</span><span class="lc-sub">nginx.org · The defaults measured above, stated normatively</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/web-cache-deception" target="_blank" rel="noopener"><span class="lc-ico">🎭</span><span class="lc-body"><span class="lc-title">PortSwigger — Web cache deception</span><span class="lc-sub">portswigger.net · The attack that turns this misconfiguration into a targeted one</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">Which responses carry identity, and why they need Cache-Control: private</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Reproduce the three-row leak, then close it from the app side and from the proxy side</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Cái gì được cache, và vụ rò rỉ khi có thứ lẽ ra không nên</h2>
<p class="lead">Một bộ đệm dùng chung cất MỘT phản hồi rồi đem trao cho TẤT CẢ. Đó là toàn bộ giá trị và cũng là toàn bộ rủi ro của nó, và việc phản hồi nào lọt vào trong đó do một nhúm giá trị mặc định quyết định — vài cái che chở bạn, và một cái thì KHÔNG.</p>

<h3>Nginx từ chối cache những gì, đo thật</h3>
<div class="out">Upstream tra ve Set-Cookie:
  lan 1  MISS      lan 2  MISS      &lt;- KHONG BAO GIO vao cache

Upstream tra ve Cache-Control: private:
  lan 1  MISS      lan 2  MISS      &lt;- cung vay

Upstream tra ve 500 (proxy_cache_valid chi khai 200):
  lan 1  MISS      lan 2  MISS      &lt;- khong khai thi khong cache

Phuong thuc:
  GET  lan 1  MISS      GET lan 2  HIT
  HEAD        HIT                        &lt;- dung chung muc voi GET
  POST lan 1  (rong)    POST lan 2 (rong)  &lt;- bien con khong duoc dat</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Set-Cookie làm TẮT cache cho phản hồi đó</span><span class="lz-d">Vì một cái cookie thường là RIÊNG của từng người, và cất phản hồi đó lại là trao phiên của người này cho khách kế tiếp. Cái mặc định này đang làm rất nhiều việc trong lặng lẽ: nó là lý do một điểm cuối đăng nhập mà bạn quên loại trừ vẫn không biến thành thảm hoạ.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cache-Control: private, no-store hay no-cache từ upstream cũng tắt nó</span><span class="lz-d">Đó là ứng dụng đang nói "cái này KHÔNG chia sẻ được", và Nginx TIN. Đây mới là cơ chế mà ứng dụng của bạn NÊN dùng — một cái header trên những phản hồi mang dữ liệu cá nhân.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chỉ những mã trạng thái bạn KHAI trong proxy_cache_valid mới được cất</span><span class="lz-d">Cú <code>500</code> bị lấy lại mỗi lần vì chỉ có <code>200</code> được khai. Cache lỗi trong thời gian ngắn (<code>proxy_cache_valid 500 502 503 504 1s;</code>) là một kỹ thuật CÓ THẬT để che chắn một backend đang vật lộn, nhưng nó phải là quyết định CÓ CHỦ Ý.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chỉ GET và HEAD được cache</span><span class="lz-d"><code>proxy_cache_methods</code> mặc định là hai cái đó. POST đi thẳng qua cả hai lần và <code>\$upstream_cache_status</code> thậm chí không được đặt. HEAD dùng lại mục của GET, và đó là điều bạn muốn.</span></div>
</div>

<h3>Cái mặc định KHÔNG che chở bạn</h3>
<div class="out">Upstream tra ve noi dung RIENG cua tung nguoi, KHONG dat Cache-Control:

  1. Nguoi dung A (co token)   MISS   HO SO CUA: Bearer TOKEN-CUA-A
  2. Khach VANG LAI            HIT    HO SO CUA: Bearer TOKEN-CUA-A   &lt;-- RO RI
  3. Nguoi dung B (token khac) HIT    HO SO CUA: Bearer TOKEN-CUA-A   &lt;-- RO RI</div>
<div class="pitfall">
<p><strong>Bẫy — <code>Authorization</code> KHÔNG nằm trong khoá cache và cũng KHÔNG ngăn việc cache, nên một phản hồi đã xác thực mà thiếu <code>Cache-Control</code> sẽ bị cất và đem phát cho tất cả.</strong> Ba dòng ở trên là MỘT cấu hình, MỘT URL và BA request: hồ sơ riêng của người dùng A bị cache, rồi một khách vãng lai và một người dùng đã đăng nhập KHÁC đều nhận đúng nó. Không có lỗi nào, không có gì được ghi lại là bất thường, và ứng dụng thì trả về dữ liệu ĐÚNG mỗi lần nó được hỏi — chỉ là nó thôi được hỏi. Kiểu hỏng này là một sự hợp tác: ứng dụng quên <code>Cache-Control: private</code>, còn con proxy thì không có cách nào biết phản hồi ấy là riêng tư. Hãy vá cả HAI phía. Trong ứng dụng: mọi phản hồi mang dữ liệu người dùng đều nhận <code>Cache-Control: private, no-store</code>. Ở Nginx: thêm một cái thắt lưng — <code>proxy_no_cache \$http_authorization \$cookie_phien;</code> và <code>proxy_cache_bypass \$http_authorization \$cookie_phien;</code> để một request có mang thông tin đăng nhập thì KHÔNG được cất vào và cũng KHÔNG được lấy ra từ bộ đệm dùng chung.</p>
</div>
<pre><code>location /api/ {
  proxy_cache kho;
  proxy_cache_valid 200 10s;

  <span class="tok-comment"># KHÔNG cất phản hồi của một request có mang thông tin đăng nhập</span>
  proxy_no_cache      \$http_authorization \$cookie_phien;
  <span class="tok-comment"># và KHÔNG lấy từ cache ra cho một request như thế</span>
  proxy_cache_bypass  \$http_authorization \$cookie_phien;

  proxy_pass http://api;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">proxy_no_cache và proxy_cache_bypass là HAI nửa khác nhau</span><span class="v"><code>no_cache</code> chặn việc CẤT; <code>bypass</code> chặn việc PHÁT. Bạn cần cả hai — chỉ có cái đầu thì một người đã đăng nhập vẫn nhận được bản vô danh đang nằm trong cache; chỉ có cái sau thì phản hồi riêng tư của họ vẫn bị ghi vào cho mọi người khác.</span></div>
  <div class="kv"><span class="k">Cả hai NỔ khi có bất kỳ đối số nào khác rỗng và khác "0"</span><span class="v">Nên liệt kê vài biến nghĩa là "nếu bất cứ cái nào trong đám này được đặt". Một header vắng mặt là một chuỗi rỗng, và đó là lý do <code>\$http_authorization</code> dùng thẳng được mà không cần so sánh gì.</span></div>
  <div class="kv"><span class="k">Client KHÔNG phá được cache, và điều đó làm người ta bất ngờ</span><span class="v">Đo thật: một request kèm <code>Cache-Control: no-cache</code> hay <code>Pragma: no-cache</code> vẫn trả về <code>HIT</code>. Nginx mặc định BỎ QUA chỉ thị cache của client. Một người dùng bấm tải-lại-cứng KHÔNG chạm tới ứng dụng của bạn, và điều đó thường là đúng, và nó đáng biết khi có ai đó khăng khăng rằng họ đã xoá cache rồi.</span></div>
  <div class="kv"><span class="k">Vary từ upstream thì được TÔN TRỌNG</span><span class="v">Nếu upstream gửi <code>Vary: Accept-Encoding</code>, Nginx cất một biến thể cho mỗi phép mã hoá. Nếu nó gửi <code>Vary: *</code> thì phản hồi KHÔNG được cache chút nào — một cách nặng tay nhưng hiệu quả để ứng dụng rút một điểm cuối ra khỏi cuộc chơi.</span></div>
</div>

<h3>Quyết định cache cái gì, theo thứ tự</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cache theo DANH SÁCH CHO PHÉP, đừng bao giờ theo danh sách loại trừ</span><span class="lz-lnote">Hãy đặt <code>proxy_cache</code> vào ĐÚNG những location phục vụ nội dung công khai, đừng đặt ở tầng <code>server</code> rồi loại trừ dần. Một tuyến thêm vào tháng sau sẽ không thừa hưởng gì theo cách đó, và kiểu hỏng khi quên là "không được cache" chứ không phải "bị rò rỉ".</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy hỏi "tôi có vui không nếu một người lạ nhìn thấy phản hồi này"</span><span class="lz-lnote">Nếu câu trả lời phụ thuộc vào AI hỏi thì nó không thuộc về một bộ đệm dùng chung, ở bất kỳ TTL nào. Phản hồi cá nhân hoá muốn một bộ đệm theo từng người ở trong ứng dụng, không phải cái này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Điểm cuối danh sách CÔNG KHAI là chỗ có lời</span><span class="lz-lnote">Một trang liệt kê sản phẩm, một dòng tin công khai, một lượt tìm kiếm trên dữ liệu công khai, một lượt đổi cỡ ảnh. Lưu lượng cao, giống hệt nhau với mọi người, đắt đỏ để sản xuất — đúng cái tổ hợp mà một proxy cache sinh ra để lo, và một TTL mười giây trên nó có thể gỡ đi phần lớn tải của bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy THỬ vụ rò rỉ một cách cố ý trước khi ship</span><span class="lz-lnote">Gọi một điểm cuối đã xác thực kèm token, rồi gọi ĐÚNG URL đó mà KHÔNG có token, rồi đọc cái thân. Nó tốn hai lệnh <code>curl</code> và nó là phép kiểm DUY NHẤT thật sự chứng minh cái ranh giới còn đứng vững — ba dòng ở trên ra đúng từ cách đó.</span></div>
</div>
<div class="note-ct">
<p><strong>Cái luật phủ hết mọi thứ.</strong> Nginx cache một phản hồi khi KHÔNG có gì bảo nó đừng. Mọi tuyến phòng thủ trong bài này đều là upstream nói "đừng", nên gánh nặng nằm ở ứng dụng của bạn phải NÓI ra điều đó — và ở cấu hình của bạn phải thêm một cái khoá thứ hai cho những lần nó quên. Im lặng là ĐỒNG Ý, và mặc định thì cái bộ đệm nhận lấy sự đồng ý ấy.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_no_cache" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">nginx — proxy_no_cache và proxy_cache_bypass</span><span class="lc-sub">nginx.org · Hai nửa, và các đối số được tính thế nào</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_methods" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_methods và proxy_ignore_headers</span><span class="lc-sub">nginx.org · Những mặc định đo ở trên, nói theo chuẩn</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/web-cache-deception" target="_blank" rel="noopener"><span class="lc-ico">🎭</span><span class="lc-body"><span class="lc-title">PortSwigger — Web cache deception</span><span class="lc-sub">portswigger.net · Đòn biến cấu hình sai này thành một đòn có chủ đích</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Phản hồi nào mang danh tính, và vì sao chúng cần Cache-Control: private</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng lại vụ rò rỉ ba dòng, rồi bịt nó từ phía ứng dụng và từ phía proxy</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Who decides how long: the precedence chain, measured|||5.3 — Ai quyết định giữ bao lâu: chuỗi ưu tiên, đo thật',
      slug: 'nginx-5-3-ai-quyet-dinh-thoi-han',
      type: 'LESSON',
      description: 'Cấu hình nói 10 giây, upstream nói 2 giây. Ai thắng? Bài này đo bốn tổ hợp bằng cách bấm giờ từng giây một cho tới lúc mục cache hết hạn, và dựng ra đúng cái chuỗi ưu tiên — trong đó có một header mà client không bao giờ nhìn thấy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Who decides how long: the precedence chain, measured</h2>
<p class="lead">Three different things can set a cache lifetime, and they can disagree. The documentation states the order in one sentence; here it is measured, by requesting an entry once a second until it expires and recording when the status changed.</p>

<h3>Four combinations, timed</h3>
<div class="out">A) Upstream KHONG khai gi, proxy_cache_valid 200 10s
   t=0s MISS   t=3s HIT   t=6s HIT   t=9s HIT   t=12s EXPIRED
                                                 ^^^ 10 giay cua cau hinh

B) Upstream khai Cache-Control: max-age=2, cau hinh van 10s
   t=0s MISS   t=1s HIT   t=2s HIT   t=3s EXPIRED
                                      ^^^ 2 giay cua UPSTREAM thang

C) Nhu (B) nhung them proxy_ignore_headers Cache-Control
   t=0s MISS   t=3s HIT   t=6s HIT   t=9s HIT   t=12s EXPIRED
                                                 ^^^ cau hinh thang lai

D) Upstream khai X-Accel-Expires: 2 VA Cache-Control: max-age=600
   t=0s MISS   t=1s HIT   t=2s HIT   t=3s EXPIRED
                                      ^^^ X-Accel-Expires thang ca hai
   Client co thay X-Accel-Expires khong? KHONG — Nginx lot no ra.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">X-Accel-Expires wins over everything</span><span class="lz-d">A private channel from the application to Nginx: seconds to cache, or <code>@</code> for an absolute time, or <code>0</code> to refuse caching. Row D shows it overriding a ten-minute <code>Cache-Control</code>, and Nginx strips the header so the browser never sees it.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Then Cache-Control and Expires from the upstream</span><span class="lz-d">Row B: the application's <code>max-age=2</code> beat the config's <code>10s</code>. This is the right default — the service that produced the data knows how long it is good for, and Nginx defers to it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Then proxy_cache_valid</span><span class="lz-d">Row A: with the upstream silent, the config's value applies. Think of <code>proxy_cache_valid</code> as the fallback for backends that say nothing, not as the setting.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">proxy_ignore_headers moves the config back to the top</span><span class="lz-d">Row C: listing <code>Cache-Control</code> there makes Nginx disregard what the upstream said. Useful for a backend you cannot change that sends <code>no-cache</code> on everything — and dangerous for the same reason, because it also ignores <code>private</code>.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>proxy_ignore_headers Cache-Control</code> does not only ignore the lifetime. It ignores <code>private</code>, <code>no-store</code> and <code>no-cache</code> as well.</strong> The directive people reach for to force caching on a chatty backend is the same directive that removes the protection measured in Lesson 5.2 — the one that stops a personalised response being stored. If you must use it, put it on the specific location that serves public content and never at <code>server</code> or <code>http</code> level, and pair it with the <code>proxy_no_cache \$http_authorization</code> lock so a credentialed request cannot be stored regardless. Ignoring <code>Set-Cookie</code> in that list deserves the same care and for the same reason.</p>
</div>

<h3>Which lever to reach for</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">You own the application → set Cache-Control there</span><span class="v">It travels with the response, it works for every cache between you and the user including the browser and any CDN, and it lives next to the code that knows how volatile the data is. Nginx will follow it without any config at all.</span></div>
  <div class="kv"><span class="k">You need a proxy-only lifetime → X-Accel-Expires</span><span class="v">When Nginx should cache for ten minutes but the browser should revalidate every time: send <code>X-Accel-Expires: 600</code> alongside <code>Cache-Control: no-cache</code>. Nginx obeys the first and strips it; the browser only sees the second. This is the cleanest way to express "shared cache yes, private cache no".</span></div>
  <div class="kv"><span class="k">The backend is not yours → proxy_cache_valid, plus ignore if needed</span><span class="v">A third-party API or a legacy service that sends nothing useful. Set the lifetime in the config, scoped to that one location, and accept that you are now the one asserting how fresh the data is.</span></div>
  <div class="kv"><span class="k">Different statuses want different lifetimes</span><span class="v"><code>proxy_cache_valid 200 10m;</code> <code>proxy_cache_valid 404 1m;</code> <code>proxy_cache_valid 500 502 503 504 1s;</code> — caching a <code>404</code> briefly stops a scanner from reaching your application at all, and one second on <code>5xx</code> collapses a thundering retry storm into a trickle without hiding a real outage.</span></div>
</div>
<pre><code><span class="tok-comment"># "Nginx giữ 10 phút, trình duyệt hỏi lại mỗi lần"</span>
<span class="tok-comment"># — viết ở phía ỨNG DỤNG, không phải ở cấu hình:</span>
res.setHeader('X-Accel-Expires', '600');        <span class="tok-comment"># chỉ Nginx đọc, rồi bị lột đi</span>
res.setHeader('Cache-Control', 'no-cache');     <span class="tok-comment"># trình duyệt thấy cái này</span>

<span class="tok-comment"># Và ở Nginx, thời hạn theo TỪNG mã trạng thái:</span>
proxy_cache_valid 200      10m;
proxy_cache_valid 404      1m;    <span class="tok-comment"># chan quét dạo khỏi ứng dụng</span>
proxy_cache_valid 500 502 503 504 1s;   <span class="tok-comment"># dập bão thử lại</span></code></pre>

<h3>Reading a cache entry's remaining life</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">$upstream_cache_status is the only reliable signal</span><span class="lz-lnote">There is no header saying "expires in 4 seconds". You learn the lifetime by watching <code>HIT</code> become <code>EXPIRED</code>, which is exactly how every row above was produced — a request per second and a note of when it changed.</span></div>
  <div class="lz-layer"><span class="lz-lname">EXPIRED means it went upstream and refreshed</span><span class="lz-lnote">The entry existed but was stale, so Nginx revalidated. The response is fresh; the status is telling you the cache did not save you this time. A high proportion of <code>EXPIRED</code> means your TTL is shorter than your traffic pattern needs.</span></div>
  <div class="lz-layer"><span class="lz-lname">UPDATING means someone else is refreshing it right now</span><span class="lz-lnote">You get the stale copy while another request does the work. It only appears with <code>proxy_cache_use_stale updating</code>, which is Lesson 5.5 — and seeing it in your logs is the sign that feature is doing its job.</span></div>
  <div class="lz-layer"><span class="lz-lname">Put it in the log format on day one</span><span class="lz-lnote"><code>log_format cache '\$remote_addr \$status \$upstream_cache_status \$request_uri';</code>. Then "what is our hit rate" is one <code>awk</code> over yesterday's log rather than a project.</span></div>
</div>
<div class="note-ct">
<p><strong>The short version.</strong> <code>X-Accel-Expires</code>, then <code>Cache-Control</code> and <code>Expires</code>, then <code>proxy_cache_valid</code> — and <code>proxy_ignore_headers</code> deletes whichever of those you name from the chain. If you can change the application, decide there; the config is where you compensate for backends you cannot change, and every use of it is a claim about freshness that nothing will check for you.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid" target="_blank" rel="noopener"><span class="lc-ico">⏳</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_valid</span><span class="lc-sub">nginx.org · The sentence stating the precedence, which rows B and D confirm</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ignore_headers" target="_blank" rel="noopener"><span class="lc-ico">🙈</span><span class="lc-body"><span class="lc-title">nginx — proxy_ignore_headers</span><span class="lc-sub">nginx.org · The full list of headers it can disregard, and what each one controls</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">MDN — Cache-Control</span><span class="lc-sub">developer.mozilla.org · Every directive, and which ones a shared cache must obey</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Setting response headers per route, and where that belongs in a handler</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Time all four rows yourself, then make the browser and the proxy disagree on purpose</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Ai quyết định giữ bao lâu: chuỗi ưu tiên, đo thật</h2>
<p class="lead">Ba thứ khác nhau đều đặt được thời hạn cache, và chúng có thể MÂU THUẪN nhau. Tài liệu nói cái thứ tự đó trong một câu; ở đây nó được ĐO, bằng cách gọi một mục cache mỗi giây một lần cho tới khi nó hết hạn rồi ghi lại lúc trạng thái đổi.</p>

<h3>Bốn tổ hợp, bấm giờ</h3>
<div class="out">A) Upstream KHONG khai gi, proxy_cache_valid 200 10s
   t=0s MISS   t=3s HIT   t=6s HIT   t=9s HIT   t=12s EXPIRED
                                                 ^^^ 10 giay cua cau hinh

B) Upstream khai Cache-Control: max-age=2, cau hinh van 10s
   t=0s MISS   t=1s HIT   t=2s HIT   t=3s EXPIRED
                                      ^^^ 2 giay cua UPSTREAM thang

C) Nhu (B) nhung them proxy_ignore_headers Cache-Control
   t=0s MISS   t=3s HIT   t=6s HIT   t=9s HIT   t=12s EXPIRED
                                                 ^^^ cau hinh thang lai

D) Upstream khai X-Accel-Expires: 2 VA Cache-Control: max-age=600
   t=0s MISS   t=1s HIT   t=2s HIT   t=3s EXPIRED
                                      ^^^ X-Accel-Expires thang ca hai
   Client co thay X-Accel-Expires khong? KHONG — Nginx lot no ra.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">X-Accel-Expires thắng TẤT CẢ</span><span class="lz-d">Một kênh RIÊNG từ ứng dụng tới Nginx: số giây cần cache, hoặc <code>@</code> cho một mốc tuyệt đối, hoặc <code>0</code> để từ chối cache. Dòng D cho thấy nó đè lên một cái <code>Cache-Control</code> mười phút, và Nginx LỘT cái header đó ra nên trình duyệt không bao giờ thấy.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Rồi tới Cache-Control và Expires từ upstream</span><span class="lz-d">Dòng B: cái <code>max-age=2</code> của ứng dụng thắng cái <code>10s</code> của cấu hình. Đây là mặc định ĐÚNG — dịch vụ sản xuất ra dữ liệu biết nó còn tốt trong bao lâu, và Nginx nhường nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Rồi mới tới proxy_cache_valid</span><span class="lz-d">Dòng A: upstream im lặng thì giá trị của cấu hình được dùng. Hãy nghĩ về <code>proxy_cache_valid</code> như cái RƠI VỀ cho những backend chẳng nói gì, chứ đừng nghĩ nó là "cái thiết lập".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">proxy_ignore_headers đưa cấu hình trở lại đứng đầu</span><span class="lz-d">Dòng C: liệt kê <code>Cache-Control</code> vào đó là Nginx bỏ ngoài tai thứ upstream vừa nói. Hữu ích với một backend bạn không sửa được mà nó gửi <code>no-cache</code> lên mọi thứ — và NGUY vì cùng lý do đó, bởi nó bỏ qua luôn cả <code>private</code>.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>proxy_ignore_headers Cache-Control</code> KHÔNG chỉ bỏ qua cái thời hạn. Nó bỏ qua luôn <code>private</code>, <code>no-store</code> và <code>no-cache</code>.</strong> Cái chỉ thị người ta với tới để ÉP cache trên một backend lắm lời chính là cái chỉ thị gỡ bỏ tuyến phòng thủ đã đo ở Bài 5.2 — thứ ngăn một phản hồi cá nhân hoá bị cất vào. Nếu buộc phải dùng thì hãy đặt nó vào ĐÚNG cái location phục vụ nội dung công khai, đừng bao giờ đặt ở tầng <code>server</code> hay <code>http</code>, và ghép nó với cái khoá <code>proxy_no_cache \$http_authorization</code> để một request có mang thông tin đăng nhập thì dù thế nào cũng không được cất vào. Bỏ qua <code>Set-Cookie</code> trong danh sách ấy cũng đáng cẩn thận y như vậy và vì đúng lý do đó.</p>
</div>

<h3>Với tới cái cần gạt nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn sở hữu ứng dụng → hãy đặt Cache-Control ở đó</span><span class="v">Nó ĐI THEO phản hồi, nó có tác dụng với MỌI bộ đệm nằm giữa bạn và người dùng kể cả trình duyệt và mọi CDN, và nó nằm ngay cạnh cái mã biết dữ liệu này biến động tới đâu. Nginx sẽ theo nó mà không cần một dòng cấu hình nào.</span></div>
  <div class="kv"><span class="k">Bạn cần một thời hạn CHỈ dành cho proxy → X-Accel-Expires</span><span class="v">Khi Nginx nên giữ mười phút còn trình duyệt thì phải hỏi lại mỗi lần: gửi <code>X-Accel-Expires: 600</code> kèm <code>Cache-Control: no-cache</code>. Nginx nghe cái đầu rồi lột nó đi; trình duyệt chỉ nhìn thấy cái sau. Đây là cách sạch sẽ nhất để diễn đạt "bộ đệm dùng chung thì có, bộ đệm riêng thì không".</span></div>
  <div class="kv"><span class="k">Backend không phải của bạn → proxy_cache_valid, kèm ignore nếu cần</span><span class="v">Một API bên thứ ba hay một dịch vụ cũ chẳng gửi gì hữu ích. Hãy đặt thời hạn trong cấu hình, KHOANH vào đúng một location đó, và chấp nhận rằng giờ CHÍNH BẠN là người khẳng định dữ liệu tươi tới đâu.</span></div>
  <div class="kv"><span class="k">Mã trạng thái khác nhau muốn thời hạn khác nhau</span><span class="v"><code>proxy_cache_valid 200 10m;</code> <code>proxy_cache_valid 404 1m;</code> <code>proxy_cache_valid 500 502 503 504 1s;</code> — cache một cú <code>404</code> trong chốc lát là chặn được đám quét dạo chạm tới ứng dụng của bạn, còn một giây trên <code>5xx</code> bóp một cơn bão thử-lại thành một dòng nhỏ giọt mà KHÔNG che giấu một sự cố thật.</span></div>
</div>
<pre><code><span class="tok-comment"># "Nginx giữ 10 phút, trình duyệt hỏi lại mỗi lần"</span>
<span class="tok-comment"># — viết ở phía ỨNG DỤNG, không phải ở cấu hình:</span>
res.setHeader('X-Accel-Expires', '600');        <span class="tok-comment"># chỉ Nginx đọc, rồi bị lột đi</span>
res.setHeader('Cache-Control', 'no-cache');     <span class="tok-comment"># trình duyệt thấy cái này</span>

<span class="tok-comment"># Và ở Nginx, thời hạn theo TỪNG mã trạng thái:</span>
proxy_cache_valid 200      10m;
proxy_cache_valid 404      1m;    <span class="tok-comment"># chan quét dạo khỏi ứng dụng</span>
proxy_cache_valid 500 502 503 504 1s;   <span class="tok-comment"># dập bão thử lại</span></code></pre>

<h3>Đọc xem một mục cache còn sống bao lâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">$upstream_cache_status là tín hiệu đáng tin DUY NHẤT</span><span class="lz-lnote">Không có header nào nói "còn 4 giây nữa hết hạn". Bạn biết được thời hạn bằng cách NHÌN <code>HIT</code> chuyển thành <code>EXPIRED</code>, và đó đúng là cách mọi dòng ở trên được tạo ra — một request mỗi giây và ghi lại lúc nó đổi.</span></div>
  <div class="lz-layer"><span class="lz-lname">EXPIRED nghĩa là nó ĐÃ đi lên upstream và làm mới</span><span class="lz-lnote">Cái mục có tồn tại nhưng đã cũ, nên Nginx xác thực lại. Phản hồi thì TƯƠI; cái trạng thái đang nói với bạn rằng lần này bộ đệm không cứu được bạn. Tỷ lệ <code>EXPIRED</code> cao nghĩa là TTL của bạn ngắn hơn mức mà nhịp lưu lượng cần.</span></div>
  <div class="lz-layer"><span class="lz-lname">UPDATING nghĩa là có người khác đang làm mới nó NGAY LÚC NÀY</span><span class="lz-lnote">Bạn nhận bản cũ trong khi một request khác đi làm việc. Nó chỉ xuất hiện khi có <code>proxy_cache_use_stale updating</code>, tức Bài 5.5 — và nhìn thấy nó trong log là dấu hiệu tính năng ấy đang làm đúng việc của nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhét nó vào định dạng log ngay ngày đầu tiên</span><span class="lz-lnote"><code>log_format cache '\$remote_addr \$status \$upstream_cache_status \$request_uri';</code>. Thế là câu hỏi "tỷ lệ trúng của mình là bao nhiêu" chỉ còn là một lệnh <code>awk</code> trên log hôm qua, chứ không phải một dự án.</span></div>
</div>
<div class="note-ct">
<p><strong>Bản ngắn.</strong> <code>X-Accel-Expires</code>, rồi <code>Cache-Control</code> và <code>Expires</code>, rồi <code>proxy_cache_valid</code> — còn <code>proxy_ignore_headers</code> thì XOÁ khỏi chuỗi bất cứ cái nào bạn gọi tên. Nếu bạn sửa được ứng dụng thì hãy quyết định ở đó; cấu hình là chỗ bạn bù đắp cho những backend không sửa được, và mỗi lần dùng nó là một LỜI KHẲNG ĐỊNH về độ tươi mà chẳng có gì kiểm hộ bạn cả.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid" target="_blank" rel="noopener"><span class="lc-ico">⏳</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_valid</span><span class="lc-sub">nginx.org · Cái câu nói về thứ tự ưu tiên, mà dòng B và D xác nhận</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ignore_headers" target="_blank" rel="noopener"><span class="lc-ico">🙈</span><span class="lc-body"><span class="lc-title">nginx — proxy_ignore_headers</span><span class="lc-sub">nginx.org · Danh sách đầy đủ những header nó bỏ qua được, và mỗi cái điều khiển gì</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">MDN — Cache-Control</span><span class="lc-sub">developer.mozilla.org · Mọi chỉ thị, và cái nào thì một bộ đệm dùng chung BẮT BUỘC phải nghe</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Đặt header phản hồi theo từng tuyến, và chỗ đó nằm ở đâu trong một handler</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Tự bấm giờ cả bốn dòng, rồi cố tình cho trình duyệt và proxy nói khác nhau</span></span></a>
</div>
`,
    },
  ],
};
