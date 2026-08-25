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
<p><strong>Trap — a cache in front of an application is a second source of truth, and the first thing it breaks is your ability to see what is happening.</strong> A bug report says a user saw old data; you check the application and it is correct; you check again from your machine and it is correct. The response the user got never touched the application at all. Two habits make this tractable from day one: log <code>\$upstream_cache_status</code> in the access log format so every line says <code>HIT</code> or <code>MISS</code>, and keep a way to bypass the cache on demand — <code>proxy_cache_bypass \$http_x_bo_qua_cache;</code> lets you send one header and see what the upstream would actually return.</p>
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
<p><strong>Trap — <code>Authorization</code> is not part of the cache key and does not prevent caching, so an authenticated response with no <code>Cache-Control</code> is stored and served to everyone.</strong> The three rows above are one config, one URL and three requests: user A's private profile was cached, then an anonymous visitor and a different logged-in user both received it. Nothing errored, nothing was logged as unusual, and the application was returning correct data every time it was asked — it just stopped being asked. The failure is a collaboration: the application omitted <code>Cache-Control: private</code>, and the proxy had no way to know the response was personal. Fix it on both sides. In the application, every response carrying user data gets <code>Cache-Control: private, no-store</code>. In Nginx, add a belt: <code>proxy_no_cache \$http_authorization \$cookie_phien;</code> and <code>proxy_cache_bypass \$http_authorization \$cookie_phien;</code> so a request that carries credentials is neither stored nor served from the shared cache.</p>
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
<p><strong>Trap — <code>proxy_ignore_headers Cache-Control</code> does not only ignore the lifetime. It ignores <code>private</code>, <code>no-store</code> and <code>no-cache</code> as well.</strong> The directive people reach for to force caching on a chatty backend is the same directive that removes the protection measured in Lesson 5.2 — the one that stops a personalised response being stored. If you must use it, put it on the specific location that serves public content and never at <code>server</code> or <code>http</code> level, and pair it with the <code>proxy_no_cache \$http_authorization</code> lock so a credentialed request cannot be stored regardless. Ignoring <code>Set-Cookie</code> in that list deserves the same care and for the same reason.</p>
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

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — The stampede: 20 requests, 20 upstream calls or 1|||5.4 — Cơn giẫm đạp: 20 request, gọi upstream 20 lần hay 1 lần',
      slug: 'nginx-5-4-con-giam-dap',
      type: 'LESSON',
      description: 'Một mục cache hết hạn đúng lúc đông khách và mọi request cùng lao lên upstream một lượt. Bài này đo đúng chuyện đó — 20 request đồng thời, đếm số lần upstream bị gọi — rồi bật một chỉ thị và đếm lại. Kèm cái GIÁ của nó, cũng đo, vì nó có giá thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>The stampede: 20 requests, 20 upstream calls or 1</h2>
<p class="lead">Caching removes load right up to the moment an entry expires. At that instant every request in flight finds nothing in the cache and goes to the backend at once — and the busier you are, the worse it is, which is the wrong way round for a protection mechanism.</p>

<h3>Twenty simultaneous requests, an uncached slow path</h3>
<div class="out">Duong dan mat 1 giay o upstream, chua co trong cache.
20 request DONG THOI. Dem so lan upstream THAT SU bi goi:

  KHONG co proxy_cache_lock     -> upstream bi goi 20 lan
  CO proxy_cache_lock           -> upstream bi goi  1 lan</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Without the lock, every miss is independent</span><span class="lz-d">Nginx has no notion that twenty requests want the same thing. Each one misses, each one opens an upstream connection, and your backend receives twenty copies of a query it only needed to run once.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">With it, one request is elected and the rest wait</span><span class="lz-d"><code>proxy_cache_lock on;</code> lets the first miss proceed and holds the others. When the entry lands, they are served from it. One upstream call, measured, for twenty clients.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It matters most on exactly your worst endpoint</span><span class="lz-d">The stampede scales with traffic and with how slow the endpoint is — the longer the backend takes, the more requests pile up behind it. So the endpoint you most wanted to cache is the one that suffers most without this.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">proxy_cache_lock_timeout bounds the wait</span><span class="lz-d">If the elected request takes longer than this, the waiting ones give up and go upstream themselves. It is the escape hatch that stops a hung backend turning into a queue of blocked clients — default 5 seconds.</span></div>
</div>

<h3>What it costs, also measured</h3>
<div class="out">Cung 20 request do, lan nay do THOI GIAN tung request:

  KHONG lock   tong=1,04s   nhanh nhat=1,00s   cham nhat=1,01s   trung vi=1,00s
  CO lock      tong=1,53s   nhanh nhat=1,00s   cham nhat=1,51s   trung vi=1,00s
                                                ^^^^^^^^^^^^^^^
                     nguoi cho lau nhat mat them nua giay</div>
<div class="callout warn">
<p><strong>The lock is not free, and the trade is worth stating plainly.</strong> The waiting requests poll for the entry rather than being woken the instant it arrives, so a follower can sit for up to half a second after the leader has already finished. Measured: the slowest of the twenty went from 1.01s to 1.51s. What you bought is your backend receiving one query instead of twenty. On an endpoint that is expensive for the backend, that is an obviously good trade. On a cheap endpoint with a large fan-out of waiters, it may not be — and now you can decide with numbers instead of by reputation.</p>
</div>
<pre><code>location /api/danh-sach {
  proxy_cache kho;
  proxy_cache_valid 200 60s;

  proxy_cache_lock          on;
  proxy_cache_lock_timeout  5s;    <span class="tok-comment"># chờ tối đa, rồi tự đi hỏi upstream</span>
  proxy_cache_lock_age      5s;    <span class="tok-comment"># kẻ dẫn đầu chậm quá thì bầu người khác</span>

  <span class="tok-comment"># Và cách chữa TỐT HƠN cho cùng bài toán — xem Bài 5.5:</span>
  proxy_cache_use_stale         updating;
  proxy_cache_background_update on;

  proxy_pass http://api;
}</code></pre>

<h3>Three ways to blunt a stampede, in order of preference</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Serve stale while one request refreshes</span><span class="v"><code>proxy_cache_use_stale updating</code> with <code>proxy_cache_background_update on</code>. Nobody waits at all: the expired copy goes out instantly while one request refreshes in the background. This is better than the lock for anything where slightly-old data is acceptable, which is most things. Lesson 5.5 measures it.</span></div>
  <div class="kv"><span class="k">2. proxy_cache_lock for data that must be current</span><span class="v">When serving stale is genuinely wrong — a price, a stock level, a balance — the lock is the right answer. Everyone gets fresh data; one of them waits a little longer than they would have.</span></div>
  <div class="kv"><span class="k">3. Longer TTLs, fewer expiries</span><span class="v">A stampede happens once per expiry. Going from 10s to 60s cuts the number of stampedes by six with no other change. Reach for this first when the data allows it, because it is the only option with no downside at all.</span></div>
  <div class="kv"><span class="k">Do not stagger TTLs by hand</span><span class="v">A common suggestion is to randomise expiry times so entries do not expire together. Different URLs already expire at different times because they were first cached at different times; the case where this helps — thousands of entries populated in one burst — is rare enough that the added complexity usually is not worth it.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — the stampede is not the only reason a cache makes an outage worse.</strong> When the backend is already struggling, every expiry adds requests to a system that cannot serve them, so responses get slower, so more requests pile up behind each expiry. The lock helps, and <code>proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504</code> helps far more — it says "if the upstream is failing, keep serving what we have". Without it, the moment your backend goes down your cache stops shielding it and starts amplifying the outage, because every expired entry becomes a new failed request. A cache configured only for the happy path makes the unhappy path worse.</p>
</div>

<h3>Watching for it in production</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Look for correlated MISS bursts in the log</span><span class="lz-lnote">With <code>\$upstream_cache_status</code> logged, a stampede is several <code>MISS</code> lines for the same URI within milliseconds. One <code>awk</code> counting misses per URI per second finds them, and they cluster exactly one TTL apart.</span></div>
  <div class="lz-layer"><span class="lz-lname">Backend latency graphs show it as regular spikes</span><span class="lz-lnote">Evenly spaced spikes at your TTL interval, with the height proportional to traffic. If the spacing matches a number in your Nginx config, you have found the cause without looking at anything else.</span></div>
  <div class="lz-layer"><span class="lz-lname">$upstream_response_time separates cache from backend</span><span class="lz-lnote">Log it alongside <code>\$request_time</code>. On a <code>HIT</code> the upstream time is empty; on a <code>MISS</code> it is the real backend latency. The two together tell you what your users experience and what your backend is actually being asked to do.</span></div>
  <div class="lz-layer"><span class="lz-lname">Test it before you need it</span><span class="lz-lnote">Twenty concurrent requests to an uncached URL, and a counter in the upstream. That is the whole experiment in this lesson, it takes a minute, and it tells you which of the two rows above your config is on.</span></div>
</div>
<div class="note-ct">
<p><strong>The framing that makes this easy to remember.</strong> A cache turns many requests into one. A stampede is the moment it briefly stops doing that, and the mechanisms in this lesson are about narrowing that moment: the lock makes the followers wait for the one call, serving stale removes the wait entirely, and a longer TTL makes the moment happen less often. Pick by asking how bad slightly-old data is for that endpoint, because that single question chooses the mechanism.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_lock" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_lock</span><span class="lc-sub">nginx.org · With lock_timeout and lock_age, and how the waiters poll</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_use_stale" target="_blank" rel="noopener"><span class="lc-ico">🕰️</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_use_stale</span><span class="lc-sub">nginx.org · The updating keyword, which is the better answer to this problem</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Cache_stampede" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Cache stampede</span><span class="lc-sub">wikipedia.org · The general problem and the standard mitigations</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">The same stampede one layer in, and the lock pattern for solving it there</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Fire 20 concurrent requests at a counting upstream, then turn the lock on and count again</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Cơn giẫm đạp: 20 request, gọi upstream 20 lần hay 1 lần</h2>
<p class="lead">Bộ đệm gỡ tải cho bạn cho tới ĐÚNG cái khoảnh khắc một mục hết hạn. Ngay giây đó, mọi request đang bay đều không tìm thấy gì trong cache và cùng lao lên backend một lượt — và càng đông khách thì càng tệ, tức là ngược đời với một cơ chế bảo vệ.</p>

<h3>Hai mươi request đồng thời, một đường dẫn chậm chưa có trong cache</h3>
<div class="out">Duong dan mat 1 giay o upstream, chua co trong cache.
20 request DONG THOI. Dem so lan upstream THAT SU bi goi:

  KHONG co proxy_cache_lock     -> upstream bi goi 20 lan
  CO proxy_cache_lock           -> upstream bi goi  1 lan</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Không có khoá thì mỗi cú trượt là ĐỘC LẬP</span><span class="lz-d">Nginx không có khái niệm gì về chuyện hai mươi request cùng muốn một thứ. Cái nào cũng trượt, cái nào cũng mở một kết nối lên upstream, và backend của bạn nhận về HAI MƯƠI bản của một truy vấn mà nó chỉ cần chạy một lần.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Có nó thì MỘT request được bầu ra, số còn lại CHỜ</span><span class="lz-d"><code>proxy_cache_lock on;</code> cho cú trượt đầu tiên đi tiếp và giữ những cái khác lại. Khi cái mục ấy về tới nơi, chúng được phục vụ từ nó. Một lời gọi upstream, đo thật, cho hai mươi khách.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó có nghĩa lý nhất đúng ở điểm cuối TỆ NHẤT của bạn</span><span class="lz-d">Cơn giẫm đạp lớn lên theo lưu lượng VÀ theo độ chậm của điểm cuối — backend càng lâu thì càng nhiều request dồn đống phía sau. Nên cái điểm cuối bạn muốn cache nhất chính là cái chịu thiệt nhất khi thiếu chỉ thị này.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">proxy_cache_lock_timeout CHẶN cái chờ lại</span><span class="lz-d">Nếu cái request được bầu lâu hơn ngần ấy thì đám đang chờ bỏ cuộc và tự đi lên upstream. Đó là lối thoát hiểm ngăn một backend bị treo biến thành một hàng dài client bị chẹn — mặc định 5 giây.</span></div>
</div>

<h3>Nó tốn cái gì, cũng đo</h3>
<div class="out">Cung 20 request do, lan nay do THOI GIAN tung request:

  KHONG lock   tong=1,04s   nhanh nhat=1,00s   cham nhat=1,01s   trung vi=1,00s
  CO lock      tong=1,53s   nhanh nhat=1,00s   cham nhat=1,51s   trung vi=1,00s
                                                ^^^^^^^^^^^^^^^
                     nguoi cho lau nhat mat them nua giay</div>
<div class="callout warn">
<p><strong>Cái khoá KHÔNG miễn phí, và cuộc đổi chác này đáng được nói thẳng.</strong> Đám request đang chờ đi HỎI THĂM cái mục theo chu kỳ chứ không được đánh thức ngay lúc nó về, nên một kẻ đi theo có thể ngồi thêm tới nửa giây SAU KHI kẻ dẫn đầu đã xong. Đo được: kẻ chậm nhất trong hai mươi đi từ 1,01s lên 1,51s. Cái bạn MUA được là backend nhận một truy vấn thay vì hai mươi. Với một điểm cuối đắt đỏ cho backend thì đó rõ ràng là cuộc đổi chác tốt. Với một điểm cuối rẻ mà có đông kẻ chờ thì có thể không — và giờ bạn quyết định bằng CON SỐ chứ không bằng tiếng đồn.</p>
</div>
<pre><code>location /api/danh-sach {
  proxy_cache kho;
  proxy_cache_valid 200 60s;

  proxy_cache_lock          on;
  proxy_cache_lock_timeout  5s;    <span class="tok-comment"># chờ tối đa, rồi tự đi hỏi upstream</span>
  proxy_cache_lock_age      5s;    <span class="tok-comment"># kẻ dẫn đầu chậm quá thì bầu người khác</span>

  <span class="tok-comment"># Và cách chữa TỐT HƠN cho cùng bài toán — xem Bài 5.5:</span>
  proxy_cache_use_stale         updating;
  proxy_cache_background_update on;

  proxy_pass http://api;
}</code></pre>

<h3>Ba cách làm cùn một cơn giẫm đạp, xếp theo mức ưu tiên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Phục vụ bản CŨ trong khi MỘT request đi làm mới</span><span class="v"><code>proxy_cache_use_stale updating</code> cùng <code>proxy_cache_background_update on</code>. KHÔNG ai phải chờ cả: bản đã hết hạn đi ra ngay lập tức trong khi một request làm mới ở nền. Cái này hơn cái khoá với mọi thứ mà dữ liệu hơi cũ một chút vẫn chấp nhận được, tức là hầu hết mọi thứ. Bài 5.5 đem nó ra đo.</span></div>
  <div class="kv"><span class="k">2. proxy_cache_lock cho dữ liệu BẮT BUỘC phải mới</span><span class="v">Khi phục vụ bản cũ là THẬT SỰ sai — một cái giá, một mức tồn kho, một số dư — thì cái khoá là câu trả lời đúng. Mọi người đều nhận dữ liệu tươi; một trong số họ chờ lâu hơn một chút so với lẽ ra.</span></div>
  <div class="kv"><span class="k">3. TTL dài hơn, ít lần hết hạn hơn</span><span class="v">Một cơn giẫm đạp xảy ra MỖI lần hết hạn. Đi từ 10s lên 60s là cắt số cơn giẫm đạp đi sáu lần mà không đổi gì khác. Hãy với tới cái này TRƯỚC khi dữ liệu cho phép, vì nó là lựa chọn duy nhất chẳng có mặt trái nào cả.</span></div>
  <div class="kv"><span class="k">Đừng tự tay rải lệch TTL</span><span class="v">Một gợi ý hay gặp là ngẫu nhiên hoá thời điểm hết hạn để các mục đừng hết hạn cùng lúc. Các URL khác nhau vốn đã hết hạn vào những lúc khác nhau vì chúng được cache lần đầu vào những lúc khác nhau; cái ca mà mẹo này giúp ích — hàng nghìn mục được nạp vào trong một đợt — hiếm tới mức phần phức tạp thêm vào thường không bõ.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — giẫm đạp KHÔNG phải lý do duy nhất khiến một bộ đệm làm cho sự cố tệ hơn.</strong> Khi backend đã đang vật lộn thì mỗi lần hết hạn lại NÉM thêm request vào một hệ thống không phục vụ nổi, nên phản hồi chậm hơn, nên càng nhiều request dồn đống sau mỗi lần hết hạn. Cái khoá giúp được, còn <code>proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504</code> giúp được nhiều hơn HẲN — nó nói "nếu upstream đang hỏng thì cứ tiếp tục phát cái ta đang có". Thiếu nó thì đúng cái lúc backend của bạn ngã xuống, bộ đệm thôi che chắn và bắt đầu KHUẾCH ĐẠI sự cố, vì mỗi mục hết hạn thành một request thất bại mới. Một bộ đệm chỉ được cấu hình cho con đường êm đẹp sẽ làm con đường gập ghềnh tệ hơn.</p>
</div>

<h3>Rình nó ngoài production</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tìm những chùm MISS đi cùng nhau trong log</span><span class="lz-lnote">Có <code>\$upstream_cache_status</code> trong log thì một cơn giẫm đạp là vài dòng <code>MISS</code> cho CÙNG một URI trong vòng vài mili giây. Một lệnh <code>awk</code> đếm số lần trượt theo từng URI từng giây là tìm ra, và chúng tụ lại cách nhau đúng một TTL.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đồ thị độ trễ backend cho thấy nó thành những cái gai ĐỀU ĐẶN</span><span class="lz-lnote">Gai cách nhau đều đúng bằng khoảng TTL của bạn, cao thấp tỉ lệ với lưu lượng. Nếu cái khoảng cách đó khớp với một con số trong cấu hình Nginx thì bạn đã tìm ra nguyên nhân mà chẳng cần nhìn thứ gì khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">$upstream_response_time tách bạch cache với backend</span><span class="lz-lnote">Ghi nó cạnh <code>\$request_time</code>. Ở một cú <code>HIT</code> thì thời gian upstream RỖNG; ở một cú <code>MISS</code> thì đó là độ trễ backend thật. Hai cái đi cùng nhau nói cho bạn biết người dùng trải nghiệm gì VÀ backend thật sự đang bị bắt làm gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy thử nó TRƯỚC khi cần tới nó</span><span class="lz-lnote">Hai mươi request đồng thời tới một URL chưa cache, cộng một cái biến đếm trong upstream. Đó là toàn bộ thí nghiệm của bài này, nó tốn một phút, và nó nói cho bạn biết cấu hình của bạn đang nằm ở dòng nào trong hai dòng ở trên.</span></div>
</div>
<div class="note-ct">
<p><strong>Cách đóng khung để dễ nhớ.</strong> Một bộ đệm biến NHIỀU request thành MỘT. Cơn giẫm đạp là khoảnh khắc nó tạm thời thôi làm điều đó, và mọi cơ chế trong bài này đều nhằm THU HẸP cái khoảnh khắc ấy: cái khoá bắt đám đi theo chờ đúng một lời gọi, phục vụ bản cũ thì xoá luôn cái chờ, còn TTL dài hơn thì làm cái khoảnh khắc ấy xảy ra ít lần hơn. Hãy chọn bằng cách hỏi dữ liệu hơi cũ thì TỆ tới đâu với điểm cuối đó, vì đúng một câu hỏi ấy chọn hộ bạn cái cơ chế.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_lock" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_lock</span><span class="lc-sub">nginx.org · Kèm lock_timeout, lock_age, và cách đám chờ đi hỏi thăm</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_use_stale" target="_blank" rel="noopener"><span class="lc-ico">🕰️</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_use_stale</span><span class="lc-sub">nginx.org · Từ khoá updating, câu trả lời TỐT HƠN cho bài toán này</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Cache_stampede" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Cache stampede</span><span class="lc-sub">wikipedia.org · Bài toán tổng quát và các cách giảm thiểu tiêu chuẩn</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Cùng cơn giẫm đạp ấy sâu hơn một tầng, và khuôn mẫu khoá để giải nó ở đó</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Bắn 20 request đồng thời vào một upstream biết đếm, rồi bật khoá lên và đếm lại</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Serving stale: staying up while the backend is down|||5.5 — Phục vụ bản cũ: đứng vững trong khi backend đã ngã',
      slug: 'nginx-5-5-phuc-vu-ban-cu',
      type: 'LESSON',
      description: 'Một chỉ thị biến bộ đệm từ chỗ tiết kiệm tải thành một lớp giữ cho site sống. Bài này GIẾT hẳn upstream rồi đo bốn tuyến khác nhau: hai tuyến vẫn trả 200 với nội dung cũ, hai tuyến trả 502 — và khác biệt là đúng một dòng cấu hình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Serving stale: staying up while the backend is down</h2>
<p class="lead">Everything so far treated the cache as a way to reduce load. It is also the only component that still has your content after the thing that produced it has stopped answering. Turning that into a feature takes one directive, and this lesson measures it with the upstream genuinely killed.</p>

<h3>The upstream is dead. Four routes, four outcomes</h3>
<div class="out">1. Nap cache truoc                     MISS   "binh thuong, lan goi upstream thu 41"
2. Ngay sau do                         HIT    "binh thuong, lan goi upstream thu 41"

   ... GIET tien trinh upstream ...

3. Muc con TUOI, use_stale bat         HIT    "binh thuong, ... thu 41"   200
4. Muc DA HET HAN, use_stale bat       STALE  "binh thuong, ... thu 41"   200
5. Muc DA HET HAN, use_stale TAT       EXPIRED  &lt;html&gt;502 Bad Gateway
6. Duong dan CHUA TUNG cache           MISS     &lt;html&gt;502 Bad Gateway

   ... upstream song lai ...

7. Request dau tien sau khi song lai   STALE  (van ban cu, tra NGAY)
                                              va mot request nen di lam moi</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A fresh entry does not care that the backend is gone</span><span class="lz-d">Row 3: still a plain <code>HIT</code>. Within the TTL, Nginx never asks the upstream anything, so an outage shorter than your TTL is invisible to anyone who requests a cached URL.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">An expired entry is where the directive earns its place</span><span class="lz-d">Rows 4 and 5 are the same URL at the same moment with the same dead backend. With <code>proxy_cache_use_stale</code> the user gets the old content and a <code>200</code>; without it they get <code>502</code>. That is the whole feature.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It cannot invent what was never cached</span><span class="lz-d">Row 6: a URL nobody had requested before is a <code>502</code> regardless. Stale-serving covers your popular paths, which is usually most of your traffic — but it is not a substitute for the backend being up.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">background_update means nobody waits for the recovery either</span><span class="lz-d">Row 7: the first request after the backend returned still got the stale copy instantly, while a separate request refreshed the entry. Without it, that one unlucky user pays the full backend latency.</span></div>
</div>
<pre><code>location /api/ {
  proxy_cache kho;
  proxy_cache_valid 200 60s;

  <span class="tok-comment"># Dùng bản cũ khi upstream lỗi, hết giờ, hoặc đang được làm mới</span>
  proxy_cache_use_stale error timeout updating
                        http_500 http_502 http_503 http_504;

  <span class="tok-comment"># Làm mới ở NỀN — người dùng nhận bản cũ NGAY, không chờ</span>
  proxy_cache_background_update on;

  <span class="tok-comment"># Và cho phép Nginx tự chuyển sang máy khác khi một máy hỏng</span>
  proxy_next_upstream error timeout http_502 http_503 http_504;

  proxy_pass http://api;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">updating is the everyday one; the rest are for outages</span><span class="v"><code>updating</code> fires on every normal expiry and is what removes the stampede from Lesson 5.4 without making anyone wait. The <code>error timeout http_5xx</code> keywords only matter when something is actually broken — which is exactly when you want them already configured.</span></div>
  <div class="kv"><span class="k">Stale has no time limit unless you set one</span><span class="v">An entry stays servable until <code>inactive</code> removes it or the disk limit evicts it. A backend down for a day can be serving day-old content, which for a status page is wrong and for a product catalogue may be fine. <code>proxy_cache_valid</code> does not bound it; the <code>inactive</code> parameter of <code>proxy_cache_path</code> does.</span></div>
  <div class="kv"><span class="k">Tell the user when it is stale, if it matters</span><span class="v"><code>add_header X-Cache-Status \$upstream_cache_status always;</code> at minimum, and for a page where freshness matters, have the frontend read it and show a quiet "last updated" note. Silently serving old data is right for a catalogue and wrong for a dashboard.</span></div>
  <div class="kv"><span class="k">It changes what your monitoring sees</span><span class="v">With stale-serving on, a total backend outage can show as <code>200</code>s at the edge. That is the point — and it means edge status codes are no longer a health check. Monitor the upstream directly, or alert on the rate of <code>STALE</code>, which goes from near zero to everything the instant the backend dies.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — stale-serving turns a loud failure into a silent one, and that is only good if somebody is still watching.</strong> Before: the backend dies, users see <code>502</code>, someone is paged within a minute. After: the backend dies, users see slightly old pages, nothing alerts, and you find out hours later when the data is visibly wrong. The feature is right — a degraded site beats a broken one — but it must be paired with an alert that does not depend on user-visible errors. Alert on the <code>STALE</code> rate in your access log, or on the upstream's own health endpoint, and make sure that alert exists <em>before</em> you turn this on rather than after the first incident you did not notice.</p>
</div>

<h3>What a resilient cache config looks like end to end</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A TTL long enough to cover a short outage</span><span class="lz-lnote">If your deploys take two minutes and occasionally restart the backend, a 60-second TTL means a fresh <code>HIT</code> covers most of it without stale-serving being involved at all. The cheapest resilience is the TTL you already have.</span></div>
  <div class="lz-layer"><span class="lz-lname">use_stale for the failure modes you actually see</span><span class="lz-lnote"><code>error timeout http_502 http_503 http_504</code> covers a dead process, a hung one and a deploy in progress. Adding <code>http_403</code> or <code>http_404</code> is almost always wrong — those are answers, not failures.</span></div>
  <div class="lz-layer"><span class="lz-lname">background_update so the first user after recovery is not punished</span><span class="lz-lnote">Without it, every expiry has exactly one victim who waits for the backend. With it there are none, and the refresh happens on a request nobody is waiting on.</span></div>
  <div class="lz-layer"><span class="lz-lname">An alert on STALE, not on 5xx</span><span class="lz-lnote">Because the 5xx is what you just removed. One line counting <code>STALE</code> per minute in the access log, alerting above a small threshold, restores the signal you traded away.</span></div>
</div>
<div class="note-ct">
<p><strong>Why this is the most valuable directive in the chapter.</strong> Everything else here makes a working site faster. This one keeps a site answering when the thing behind it has stopped — measured above as the difference between a <code>200</code> with real content and a <code>502</code>, for the same URL at the same instant. Sites go down; a cache that keeps serving during the ten minutes it takes you to notice and fix it is worth more than any hit-rate improvement.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_use_stale" target="_blank" rel="noopener"><span class="lc-ico">🕰️</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_use_stale</span><span class="lc-sub">nginx.org · Every keyword, and how it interacts with background_update</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream" target="_blank" rel="noopener"><span class="lc-ico">➡️</span><span class="lc-body"><span class="lc-title">nginx — proxy_next_upstream</span><span class="lc-sub">nginx.org · Failing over to another backend, which pairs with this</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#stale-while-revalidate" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">MDN — stale-while-revalidate</span><span class="lc-sub">developer.mozilla.org · The standard header expressing the same idea to browsers and CDNs</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">The restart window during a deploy, which is exactly what stale-serving covers</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Kill the upstream and watch two routes answer 200 while two answer 502</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Phục vụ bản cũ: đứng vững trong khi backend đã ngã</h2>
<p class="lead">Từ đầu tới giờ ta coi bộ đệm là một cách GIẢM TẢI. Nó còn là thành phần DUY NHẤT vẫn còn giữ nội dung của bạn sau khi cái thứ sản xuất ra nội dung ấy đã thôi trả lời. Biến điều đó thành một tính năng tốn đúng một chỉ thị, và bài này đem nó ra đo với upstream bị GIẾT thật.</p>

<h3>Upstream đã chết. Bốn tuyến, bốn kết cục</h3>
<div class="out">1. Nap cache truoc                     MISS   "binh thuong, lan goi upstream thu 41"
2. Ngay sau do                         HIT    "binh thuong, lan goi upstream thu 41"

   ... GIET tien trinh upstream ...

3. Muc con TUOI, use_stale bat         HIT    "binh thuong, ... thu 41"   200
4. Muc DA HET HAN, use_stale bat       STALE  "binh thuong, ... thu 41"   200
5. Muc DA HET HAN, use_stale TAT       EXPIRED  &lt;html&gt;502 Bad Gateway
6. Duong dan CHUA TUNG cache           MISS     &lt;html&gt;502 Bad Gateway

   ... upstream song lai ...

7. Request dau tien sau khi song lai   STALE  (van ban cu, tra NGAY)
                                              va mot request nen di lam moi</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một mục còn TƯƠI thì chẳng quan tâm backend đã biến mất</span><span class="lz-d">Dòng 3: vẫn là một cú <code>HIT</code> bình thường. Trong khoảng TTL, Nginx KHÔNG hỏi upstream cái gì cả, nên một sự cố ngắn hơn TTL của bạn là VÔ HÌNH với bất cứ ai gọi một URL đã có trong cache.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mục ĐÃ HẾT HẠN mới là chỗ chỉ thị này xứng đáng có mặt</span><span class="lz-d">Dòng 4 và 5 là CÙNG một URL, CÙNG một thời điểm, CÙNG một backend đã chết. Có <code>proxy_cache_use_stale</code> thì người dùng nhận nội dung cũ kèm mã <code>200</code>; không có thì họ nhận <code>502</code>. Đó là toàn bộ tính năng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó không BỊA ra được thứ chưa từng được cache</span><span class="lz-d">Dòng 6: một URL chưa ai từng gọi thì vẫn là <code>502</code>. Phục vụ bản cũ che chở những đường dẫn ĐÔNG KHÁCH của bạn, mà đó thường là phần lớn lưu lượng — nhưng nó KHÔNG thay thế được việc backend phải sống.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">background_update nghĩa là cả lúc HỒI PHỤC cũng không ai phải chờ</span><span class="lz-d">Dòng 7: request đầu tiên sau khi backend quay lại VẪN nhận bản cũ ngay lập tức, trong khi một request riêng đi làm mới cái mục. Thiếu nó thì đúng một người xui xẻo ấy trả trọn cái độ trễ của backend.</span></div>
</div>
<pre><code>location /api/ {
  proxy_cache kho;
  proxy_cache_valid 200 60s;

  <span class="tok-comment"># Dùng bản cũ khi upstream lỗi, hết giờ, hoặc đang được làm mới</span>
  proxy_cache_use_stale error timeout updating
                        http_500 http_502 http_503 http_504;

  <span class="tok-comment"># Làm mới ở NỀN — người dùng nhận bản cũ NGAY, không chờ</span>
  proxy_cache_background_update on;

  <span class="tok-comment"># Và cho phép Nginx tự chuyển sang máy khác khi một máy hỏng</span>
  proxy_next_upstream error timeout http_502 http_503 http_504;

  proxy_pass http://api;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">updating là cái dùng HÀNG NGÀY; số còn lại dành cho sự cố</span><span class="v"><code>updating</code> nổ ở MỌI lần hết hạn bình thường và nó chính là thứ gỡ bỏ cơn giẫm đạp ở Bài 5.4 mà không bắt ai phải chờ. Mấy từ khoá <code>error timeout http_5xx</code> chỉ có nghĩa lý khi thật sự có thứ gì đó hỏng — mà đó đúng là lúc bạn muốn chúng ĐÃ được cấu hình sẵn.</span></div>
  <div class="kv"><span class="k">Bản cũ KHÔNG có giới hạn thời gian trừ khi bạn đặt một cái</span><span class="v">Một mục còn phục vụ được cho tới khi <code>inactive</code> gỡ nó đi hoặc trần đĩa đuổi nó ra. Một backend chết cả ngày có thể đang phục vụ nội dung một ngày tuổi, mà với một trang trạng thái thì đó là SAI còn với một danh mục sản phẩm thì có thể chấp nhận. <code>proxy_cache_valid</code> KHÔNG chặn được nó; tham số <code>inactive</code> của <code>proxy_cache_path</code> mới chặn.</span></div>
  <div class="kv"><span class="k">Hãy NÓI cho người dùng biết đó là bản cũ, nếu điều đó có nghĩa lý</span><span class="v">Tối thiểu là <code>add_header X-Cache-Status \$upstream_cache_status always;</code>, và với một trang mà độ tươi quan trọng thì cho frontend đọc nó rồi hiện một dòng "cập nhật lần cuối" nhỏ nhẹ. Âm thầm phát dữ liệu cũ là ĐÚNG với một danh mục và SAI với một bảng điều khiển.</span></div>
  <div class="kv"><span class="k">Nó làm ĐỔI thứ mà hệ giám sát của bạn nhìn thấy</span><span class="v">Bật phục vụ bản cũ lên thì một sự cố chết hẳn backend có thể hiện ra thành toàn <code>200</code> ở rìa mạng. Đó chính là MỤC ĐÍCH — và nó nghĩa là mã trạng thái ở rìa thôi còn là một phép kiểm sức khoẻ. Hãy giám sát upstream TRỰC TIẾP, hoặc cảnh báo theo tỷ lệ <code>STALE</code>, thứ nhảy từ gần bằng không lên thành tất cả ngay giây backend chết.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — phục vụ bản cũ biến một kiểu hỏng ỒN ÀO thành một kiểu hỏng CÂM LẶNG, và điều đó chỉ tốt nếu vẫn còn ai đó đang canh.</strong> Trước: backend chết, người dùng thấy <code>502</code>, có người bị gọi dậy trong vòng một phút. Sau: backend chết, người dùng thấy những trang hơi cũ, chẳng cảnh báo nào kêu, và bạn phát hiện ra sau mấy tiếng khi dữ liệu đã sai một cách nhìn thấy được. Tính năng này ĐÚNG — một site suy giảm vẫn hơn một site hỏng — nhưng nó BẮT BUỘC phải đi kèm một cảnh báo không dựa vào lỗi mà người dùng nhìn thấy. Hãy cảnh báo theo tỷ lệ <code>STALE</code> trong access log, hoặc theo điểm cuối sức khoẻ của chính upstream, và hãy chắc rằng cảnh báo đó TỒN TẠI <em>trước khi</em> bạn bật cái này chứ đừng sau sự cố đầu tiên mà bạn không nhận ra.</p>
</div>

<h3>Một cấu hình cache có sức chịu đựng trông thế nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một TTL đủ dài để phủ một sự cố ngắn</span><span class="lz-lnote">Nếu mỗi lần deploy của bạn mất hai phút và thỉnh thoảng khởi động lại backend thì một TTL 60 giây nghĩa là một cú <code>HIT</code> còn tươi đã che phần lớn khoảng đó mà chẳng cần tới chuyện phục vụ bản cũ. Sức chịu đựng RẺ NHẤT là cái TTL bạn vốn đã có.</span></div>
  <div class="lz-layer"><span class="lz-lname">use_stale cho đúng những kiểu hỏng bạn THẬT SỰ gặp</span><span class="lz-lnote"><code>error timeout http_502 http_503 http_504</code> phủ một tiến trình đã chết, một tiến trình bị treo, và một lần deploy đang chạy. Thêm <code>http_403</code> hay <code>http_404</code> vào thì gần như luôn SAI — đó là những CÂU TRẢ LỜI, không phải kiểu hỏng.</span></div>
  <div class="lz-layer"><span class="lz-lname">background_update để người dùng đầu tiên sau khi hồi phục không bị phạt</span><span class="lz-lnote">Thiếu nó thì mỗi lần hết hạn có đúng MỘT nạn nhân ngồi chờ backend. Có nó thì không có ai, và việc làm mới diễn ra trên một request mà chẳng ai đang chờ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một cảnh báo theo STALE, không theo 5xx</span><span class="lz-lnote">Vì cái 5xx chính là thứ bạn vừa gỡ bỏ. Một dòng đếm số <code>STALE</code> mỗi phút trong access log, cảnh báo khi vượt một ngưỡng nhỏ, là khôi phục lại đúng cái tín hiệu bạn vừa đánh đổi đi.</span></div>
</div>
<div class="note-ct">
<p><strong>Vì sao đây là chỉ thị giá trị nhất cả chương.</strong> Mọi thứ khác ở đây làm cho một site ĐANG CHẠY nhanh hơn. Cái này giữ cho một site còn TRẢ LỜI khi thứ đứng sau nó đã ngừng — đo được ở trên bằng khác biệt giữa một cú <code>200</code> có nội dung thật và một cú <code>502</code>, cho cùng một URL vào cùng một khoảnh khắc. Site nào rồi cũng có lúc ngã; một bộ đệm vẫn phục vụ suốt mười phút bạn cần để phát hiện và sửa thì đáng giá hơn mọi cải thiện tỷ lệ trúng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_use_stale" target="_blank" rel="noopener"><span class="lc-ico">🕰️</span><span class="lc-body"><span class="lc-title">nginx — proxy_cache_use_stale</span><span class="lc-sub">nginx.org · Mọi từ khoá, và nó tương tác với background_update thế nào</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream" target="_blank" rel="noopener"><span class="lc-ico">➡️</span><span class="lc-body"><span class="lc-title">nginx — proxy_next_upstream</span><span class="lc-sub">nginx.org · Chuyển sang một backend khác khi hỏng, thứ đi cặp với cái này</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#stale-while-revalidate" target="_blank" rel="noopener"><span class="lc-ico">🔄</span><span class="lc-body"><span class="lc-title">MDN — stale-while-revalidate</span><span class="lc-sub">developer.mozilla.org · Cái header chuẩn diễn đạt cùng ý tưởng với trình duyệt và CDN</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Cái cửa sổ khởi động lại trong một lần deploy, đúng thứ mà phục vụ bản cũ che cho</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Giết upstream rồi xem hai tuyến trả 200 trong khi hai tuyến trả 502</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Quiz: caching in front of your application|||5.6 — Quiz: bộ đệm đặt trước ứng dụng của bạn',
      slug: 'nginx-5-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về khoá cache, cái gì âm thầm không được cache, vụ rò rỉ giữa hai người dùng, chuỗi ưu tiên thời hạn, cơn giẫm đạp và chuyện phục vụ bản cũ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.6</span>
<h2>Quiz: caching in front of your application</h2>
<p class="lead">Eight questions from an upstream that counted its own calls, so every answer is about what actually reached the application rather than what should have.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Three directives turn a proxy into a cache, and the default key is <code>$scheme$proxy_host$request_uri</code> — which includes the query string and does <em>not</em> include the client's <code>Host</code> (5.1). <code>Set-Cookie</code>, <code>Cache-Control: private</code>, undeclared status codes and non-GET methods are all refused automatically, but <code>Authorization</code> is not — measured as user A's private profile being served to an anonymous visitor and to a different logged-in user (5.2). Lifetimes are decided by <code>X-Accel-Expires</code>, then the upstream's <code>Cache-Control</code>, then <code>proxy_cache_valid</code>, and <code>proxy_ignore_headers</code> deletes whichever you name — including the <code>private</code> that was protecting you (5.3). Twenty concurrent requests to an uncached slow path hit the upstream twenty times, or once with <code>proxy_cache_lock</code>, at a cost of half a second on the slowest waiter (5.4). And with the upstream killed outright, <code>proxy_cache_use_stale</code> was the difference between a <code>200</code> carrying real content and a <code>502</code>, for the same URL at the same moment (5.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.6</span>
<h2>Quiz: bộ đệm đặt trước ứng dụng của bạn</h2>
<p class="lead">Tám câu ra từ một upstream biết tự đếm số lần nó bị gọi, nên mọi đáp án đều nói về cái THỰC SỰ tới được ứng dụng chứ không nói về cái lẽ ra.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Ba chỉ thị biến một con proxy thành một bộ đệm, và khoá mặc định là <code>$scheme$proxy_host$request_uri</code> — thứ CÓ query string bên trong và KHÔNG có <code>Host</code> của client (5.1). <code>Set-Cookie</code>, <code>Cache-Control: private</code>, những mã trạng thái không được khai và các phương thức khác GET đều bị từ chối tự động, nhưng <code>Authorization</code> thì KHÔNG — đo được bằng việc hồ sơ riêng của người dùng A bị đem phát cho một khách vãng lai và cho một người dùng đã đăng nhập khác (5.2). Thời hạn do <code>X-Accel-Expires</code> quyết trước, rồi tới <code>Cache-Control</code> của upstream, rồi mới tới <code>proxy_cache_valid</code>, còn <code>proxy_ignore_headers</code> thì XOÁ bất cứ cái nào bạn gọi tên — kể cả cái <code>private</code> đang che chở bạn (5.3). Hai mươi request đồng thời tới một đường dẫn chậm chưa cache thì gọi upstream hai mươi lần, hoặc MỘT lần với <code>proxy_cache_lock</code>, đổi lại nửa giây trên kẻ chờ lâu nhất (5.4). Và với upstream bị giết hẳn, <code>proxy_cache_use_stale</code> là khác biệt giữa một cú <code>200</code> mang nội dung thật và một cú <code>502</code>, cho cùng một URL vào cùng một khoảnh khắc (5.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'One server block serves vidu.com and blog.vidu.com from the same proxy_cache. What goes wrong with the default cache key?|||Một khối server phục vụ cả vidu.com lẫn blog.vidu.com từ cùng một proxy_cache. Khoá cache mặc định gây ra chuyện gì?',
            options: [
              'Nothing; the Host is always part of the key|||Không gì cả; Host luôn nằm trong khoá',
              'The default key uses $proxy_host (the upstream address), not the client Host, so both sites share entries for the same path|||Khoá mặc định dùng $proxy_host (địa chỉ upstream) chứ không dùng Host của client, nên hai site DÙNG CHUNG mục cho cùng một đường dẫn',
              'Nginx refuses to start with two hostnames and one cache|||Nginx từ chối khởi động khi có hai tên miền và một cache',
              'Only the first hostname is ever cached|||Chỉ tên miền đầu tiên được cache',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your API returns a personalised response with no Cache-Control header, and proxy_cache is on with proxy_cache_valid 200 10s. What did the measurement show?|||API của bạn trả về một phản hồi cá nhân hoá mà KHÔNG có header Cache-Control, còn proxy_cache đang bật với proxy_cache_valid 200 10s. Phép đo cho thấy gì?',
            options: [
              'Nginx skips caching because the request had an Authorization header|||Nginx bỏ qua việc cache vì request có header Authorization',
              'It is cached and then served to an anonymous visitor and to a different logged-in user — Authorization is neither in the key nor a reason to skip|||Nó bị cache rồi đem phát cho một khách vãng lai và cho một người dùng đã đăng nhập KHÁC — Authorization vừa không nằm trong khoá vừa không phải lý do để bỏ qua',
              'Nginx returns 403 for the second request|||Nginx trả 403 cho request thứ hai',
              'Only the first user ever gets a response|||Chỉ người dùng đầu tiên nhận được phản hồi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which pair of directives is needed to keep credentialed requests out of a shared cache?|||Cặp chỉ thị nào cần có để giữ các request có mang thông tin đăng nhập ra khỏi bộ đệm dùng chung?',
            options: [
              'proxy_no_cache alone is enough|||Chỉ mỗi proxy_no_cache là đủ',
              'proxy_no_cache stops storing and proxy_cache_bypass stops serving — you need both, because each covers a different half|||proxy_no_cache chặn việc CẤT còn proxy_cache_bypass chặn việc PHÁT — cần CẢ HAI, vì mỗi cái lo một nửa khác nhau',
              'proxy_cache_bypass alone is enough|||Chỉ mỗi proxy_cache_bypass là đủ',
              'proxy_ignore_headers Authorization|||proxy_ignore_headers Authorization',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The upstream sends Cache-Control: max-age=2 and the config says proxy_cache_valid 200 10s. When does the entry expire?|||Upstream gửi Cache-Control: max-age=2 còn cấu hình nói proxy_cache_valid 200 10s. Mục cache hết hạn khi nào?',
            options: [
              'After 10 seconds; the config always wins|||Sau 10 giây; cấu hình luôn thắng',
              'After 2 seconds — the upstream header takes precedence over proxy_cache_valid, measured as EXPIRED at t=3s|||Sau 2 giây — header của upstream ĐƯỢC ƯU TIÊN hơn proxy_cache_valid, đo được là EXPIRED ở t=3s',
              'After 12 seconds; the two are added|||Sau 12 giây; hai cái được cộng lại',
              'Never; conflicting values disable caching|||Không bao giờ; giá trị mâu thuẫn thì tắt cache',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the hidden cost of proxy_ignore_headers Cache-Control?|||Cái giá ẩn của proxy_ignore_headers Cache-Control là gì?',
            options: [
              'It only affects max-age|||Nó chỉ ảnh hưởng tới max-age',
              'It also ignores private, no-store and no-cache — removing the protection that stops personalised responses being cached|||Nó bỏ qua LUÔN private, no-store và no-cache — gỡ bỏ đúng tuyến phòng thủ ngăn phản hồi cá nhân hoá bị cache',
              'It doubles memory usage|||Nó làm tốn gấp đôi bộ nhớ',
              'It disables ETags|||Nó tắt ETag',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Twenty simultaneous requests arrive for an uncached path that takes 1s upstream. Without proxy_cache_lock, how many upstream calls?|||Hai mươi request đồng thời tới một đường dẫn chưa cache mà upstream mất 1 giây. KHÔNG có proxy_cache_lock thì upstream bị gọi mấy lần?',
            options: [
              'One; Nginx coalesces identical requests by default|||Một; Nginx mặc định gộp các request giống nhau lại',
              'Twenty — each miss is independent, and the lock is what reduces it to one|||Hai mươi — mỗi cú trượt là độc lập, và cái khoá mới là thứ giảm nó xuống còn một',
              'Two: one for the body and one for the headers|||Hai: một cho thân và một cho header',
              'It depends on worker_processes|||Tuỳ vào worker_processes',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does proxy_cache_lock cost, measured?|||proxy_cache_lock tốn cái gì, theo phép đo?',
            options: [
              'Nothing; it is free|||Không gì cả; nó miễn phí',
              'Latency on the waiters — they poll for the entry, so the slowest of twenty went from 1.01s to 1.51s|||Độ trễ ở đám đang chờ — chúng đi hỏi thăm cái mục theo chu kỳ, nên kẻ chậm nhất trong hai mươi đi từ 1,01s lên 1,51s',
              'Memory proportional to the number of waiters|||Bộ nhớ tỉ lệ với số kẻ đang chờ',
              'It disables background updates|||Nó tắt việc làm mới ở nền',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The backend is dead. A cached entry has expired. What separates a 200 from a 502?|||Backend đã chết. Một mục cache đã hết hạn. Cái gì phân tách một cú 200 với một cú 502?',
            options: [
              'The TTL length|||Độ dài của TTL',
              'proxy_cache_use_stale — with it the stale copy is served with status 200; without it the same URL at the same moment returns 502|||proxy_cache_use_stale — có nó thì bản cũ được phát ra kèm mã 200; không có nó thì CÙNG URL ấy vào CÙNG khoảnh khắc ấy trả về 502',
              'proxy_cache_lock|||proxy_cache_lock',
              'Whether the entry was a HIT before|||Việc mục đó trước đây có từng là HIT hay không',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
