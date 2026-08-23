const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 2 — Which location wins|||Chương 2 — Location nào thắng',
  description: 'Khối server đã chốt xong ở Chương 1. Giờ tới câu hỏi làm người ta mất nhiều giờ nhất trong Nginx: trong ngần ấy khối location, cái nào xử lý cái URI này — và vì sao nó KHÔNG phải cái bạn nghĩ. Cả chương chạy trên một cấu hình thật với bảy khối location và mười hai URI được bắn vào đo từng cái.',
  lessons: [

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Four kinds of location, and the order they are tried|||2.1 — Bốn loại location, và thứ tự chúng được thử',
      slug: 'nginx-2-1-bon-loai-location',
      type: 'LESSON',
      description: 'Nginx KHÔNG đọc các khối location từ trên xuống rồi lấy cái khớp đầu tiên — đó là mô hình sai gây ra phần lớn thời gian phí phạm với Nginx. Bài này dựng một cấu hình bảy khối, bắn mười hai URI vào, và cho bạn cái thuật toán thật đằng sau bảng kết quả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Four kinds of location, and the order they are tried</h2>
<p class="lead">Almost everyone starts with the same wrong model: Nginx reads the <code>location</code> blocks top to bottom and uses the first one that matches. It does not. Understanding what it actually does takes about ten minutes and removes an entire category of confusion permanently.</p>

<h3>Seven blocks, deliberately overlapping</h3>
<pre><code>server {
  location = /a            { ... }   <span class="tok-comment"># 1 — khớp CHÍNH XÁC</span>
  location ^~ /a/tinh      { ... }   <span class="tok-comment"># 2 — tiền tố ƯU TIÊN</span>
  location ~ \\.php         { ... }   <span class="tok-comment"># 3 — regex, phân biệt hoa thường</span>
  location ~* \\.(jpg|gif)  { ... }   <span class="tok-comment"># 4 — regex, KHÔNG phân biệt hoa thường</span>
  location /a/tinh/sau     { ... }   <span class="tok-comment"># 5 — tiền tố thường, DÀI hơn #2</span>
  location /a              { ... }   <span class="tok-comment"># 6 — tiền tố thường</span>
  location /               { ... }   <span class="tok-comment"># 7 — tiền tố bắt-tất</span>
}</code></pre>
<div class="out">=== BANG DO THAT — nginx 1.24.0 ===
/a                   -> 1. = /a            (khop CHINH XAC)
/a/                  -> 6. /a              (tien to thuong)
/ab                  -> 6. /a              (tien to thuong)
/a/tinh              -> 2. ^~ /a/tinh      (tien to UU TIEN)
/a/tinh/x            -> 2. ^~ /a/tinh      (tien to UU TIEN)
/a/tinh/sau/y        -> 5. /a/tinh/sau     (tien to thuong, DAI hon #2)
/a/tinh/anh.jpg      -> 2. ^~ /a/tinh      (tien to UU TIEN)
/a/x.php             -> 3. ~ .php          (regex, phan biet hoa thuong)
/A/X.JPG             -> 4. ~* .jpg .gif    (regex, KHONG phan biet hoa thuong)
/a/x.PHP             -> 6. /a              (tien to thuong)
/khac                -> 7. /               (tien to bat-tat)
/                    -> 7. /               (tien to bat-tat)</div>
<p>Read that table once and you will notice it is not top-to-bottom in any consistent way: <code>/a/x.php</code> skipped blocks 1 and 2 to land on 3, while <code>/a/tinh/anh.jpg</code> stopped at 2 and never reached 4 even though 4 clearly matches it. There is one algorithm producing all twelve rows.</p>

<h3>The algorithm, in the order Nginx actually runs it</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Is there an exact match?</span><span class="lz-d">Scan every <code>location = /uri</code>. If one equals the request URI character for character, use it and stop — no other block is examined. This is why <code>= /</code> is the cheapest way to handle a busy homepage.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Find the LONGEST matching prefix</span><span class="lz-d">Now consider every plain prefix location and every <code>^~</code> one. Nginx keeps the longest one that the URI starts with — length decides, not position in the file. It remembers this candidate; it has not committed to it yet.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Did that longest prefix carry ^~?</span><span class="lz-d">If yes, commit to it now and skip step 4 entirely. That is the whole meaning of <code>^~</code>: "having matched this prefix, do not bother trying the regexes".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Try the regexes, in file order</span><span class="lz-d">Only now, top to bottom, and the FIRST one that matches wins outright — beating the prefix candidate from step 2. Order matters here and nowhere else.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">No regex matched → use the remembered prefix</span><span class="lz-d">The candidate from step 2 handles the request. If even that does not exist you get <code>404</code>, which is why almost every real config keeps a <code>location /</code>.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Prefixes compete on length, regexes on position</span><span class="v">Two different tiebreakers in one algorithm, and mixing them up is the usual cause of "I moved the block and nothing changed". Moving a prefix block up the file changes nothing at all; moving a regex block up can change everything.</span></div>
  <div class="kv"><span class="k">= is a short circuit, not just a stricter prefix</span><span class="v">It ends matching immediately, so a heavily-hit path with <code>= </code> costs one comparison instead of a full prefix walk plus a regex sweep. On a health-check endpoint hit every second that is free performance.</span></div>
  <div class="kv"><span class="k">^~ is about the regexes, not about priority among prefixes</span><span class="v">It does not make a prefix "stronger" against a longer prefix — step 2 still picks by length. It only decides whether step 4 happens at all. Lesson 2.2 measures what that distinction costs when you get it wrong.</span></div>
  <div class="kv"><span class="k">location / is the floor, and it is a prefix of everything</span><span class="v">Every URI starts with <code>/</code>, so it always matches and is always the shortest — meaning it wins only when nothing else did. Deleting it does not tighten security, it just turns misses into <code>404</code> from Nginx instead of your handler.</span></div>
</div>

<h3>Reading four rows back out of the algorithm</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">/a</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Step 1 fires, and nothing else runs</span><span class="lz-nsub">Equals <code>= /a</code> exactly · blocks 2 through 7 are never consulted</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">/a/</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">One character breaks the exact match</span><span class="lz-nsub">Falls to step 2, longest prefix is <code>/a</code> · <code>=</code> means equal, not "starts with"</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">/a/tinh/anh.jpg</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Step 3 stops it before the regex</span><span class="lz-nsub">Longest prefix is <code>^~ /a/tinh</code>, so block 4 never gets a chance despite matching</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">/a/x.php</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Step 4 beats the remembered prefix</span><span class="lz-nsub">Longest prefix was plain <code>/a</code>, no <code>^~</code>, so the regex ran and won</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Bẫy — a prefix location does not stop at a path separator, and the table proves it: <code>/ab</code> matched <code>location /a</code>.</strong> <code>location /a</code> means "the URI starts with the characters <code>/a</code>", not "the first path segment is <code>a</code>". So <code>location /api</code> also catches <code>/apiary</code>, <code>/api-docs</code> and <code>/apifoo</code> — which is fine until one of those is a different service, or until <code>location /admin</code> quietly starts catching <code>/administrators-public-list</code>. The fix is to include the trailing slash when you mean a directory (<code>location /api/</code>), and to add <code>location = /api</code> beside it if the bare path must work too. This is not a rare edge: it is the single most common surprise in this whole chapter.</p>
</div>
<div class="note-ct">
<p><strong>How to use this in practice.</strong> When a request goes somewhere unexpected, do not read the file top to bottom looking for the culprit. Run the five steps in your head against the actual URI: exact match, longest prefix, was it <code>^~</code>, regexes in order, fall back. Four times out of five the answer appears at step 2 — a prefix you forgot was longer — and the fifth time it is a regex earlier in the file than the one you were looking at.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location" target="_blank" rel="noopener"><span class="lc-ico">📍</span><span class="lc-body"><span class="lc-title">nginx — the location directive</span><span class="lc-sub">nginx.org · The normative description of the five steps above</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">nginx — How nginx processes a request</span><span class="lc-sub">nginx.org · Where server selection ends and location selection begins</span></span></a>
<a class="link-card" href="https://www.nginx.com/resources/wiki/start/topics/depth/ifisevil/" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">nginx wiki — If is evil</span><span class="lc-sub">nginx.com · Why the answer to "which block" is never an if</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">URL paths, encoding, and what a request URI contains before Nginx sees it</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Reproduce all twelve rows, then predict a thirteenth before running it</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Bốn loại location, và thứ tự chúng được thử</h2>
<p class="lead">Gần như ai cũng bắt đầu bằng cùng một mô hình SAI: Nginx đọc các khối <code>location</code> từ trên xuống rồi lấy cái khớp đầu tiên. Nó KHÔNG làm vậy. Hiểu ra nó thật sự làm gì tốn chừng mười phút và xoá vĩnh viễn cả một loại rối rắm.</p>

<h3>Bảy khối, cố tình chồng lấn nhau</h3>
<pre><code>server {
  location = /a            { ... }   <span class="tok-comment"># 1 — khớp CHÍNH XÁC</span>
  location ^~ /a/tinh      { ... }   <span class="tok-comment"># 2 — tiền tố ƯU TIÊN</span>
  location ~ \\.php         { ... }   <span class="tok-comment"># 3 — regex, phân biệt hoa thường</span>
  location ~* \\.(jpg|gif)  { ... }   <span class="tok-comment"># 4 — regex, KHÔNG phân biệt hoa thường</span>
  location /a/tinh/sau     { ... }   <span class="tok-comment"># 5 — tiền tố thường, DÀI hơn #2</span>
  location /a              { ... }   <span class="tok-comment"># 6 — tiền tố thường</span>
  location /               { ... }   <span class="tok-comment"># 7 — tiền tố bắt-tất</span>
}</code></pre>
<div class="out">=== BANG DO THAT — nginx 1.24.0 ===
/a                   -> 1. = /a            (khop CHINH XAC)
/a/                  -> 6. /a              (tien to thuong)
/ab                  -> 6. /a              (tien to thuong)
/a/tinh              -> 2. ^~ /a/tinh      (tien to UU TIEN)
/a/tinh/x            -> 2. ^~ /a/tinh      (tien to UU TIEN)
/a/tinh/sau/y        -> 5. /a/tinh/sau     (tien to thuong, DAI hon #2)
/a/tinh/anh.jpg      -> 2. ^~ /a/tinh      (tien to UU TIEN)
/a/x.php             -> 3. ~ .php          (regex, phan biet hoa thuong)
/A/X.JPG             -> 4. ~* .jpg .gif    (regex, KHONG phan biet hoa thuong)
/a/x.PHP             -> 6. /a              (tien to thuong)
/khac                -> 7. /               (tien to bat-tat)
/                    -> 7. /               (tien to bat-tat)</div>
<p>Đọc cái bảng đó một lượt là thấy nó chẳng "từ trên xuống" theo kiểu nhất quán nào: <code>/a/x.php</code> nhảy qua khối 1 và 2 để rơi vào 3, còn <code>/a/tinh/anh.jpg</code> thì dừng ở 2 và không bao giờ chạm tới 4 dù 4 rõ ràng khớp nó. Chỉ có MỘT thuật toán sinh ra cả mười hai dòng.</p>

<h3>Thuật toán, theo đúng thứ tự Nginx chạy</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Có cái nào khớp CHÍNH XÁC không?</span><span class="lz-d">Quét mọi <code>location = /uri</code>. Nếu có cái nào BẰNG đúng URI của request từng ký tự thì dùng nó và DỪNG — không khối nào khác được ngó tới. Đó là lý do <code>= /</code> là cách rẻ nhất để lo cho một trang chủ đông khách.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tìm tiền tố khớp DÀI NHẤT</span><span class="lz-d">Giờ xét mọi location tiền tố thường và mọi cái <code>^~</code>. Nginx giữ lại cái DÀI NHẤT mà URI bắt đầu bằng nó — ĐỘ DÀI quyết định, không phải vị trí trong file. Nó nhớ ứng viên này lại; nó chưa cam kết gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cái tiền tố dài nhất đó có mang ^~ không?</span><span class="lz-d">Có thì cam kết luôn và BỎ QUA hẳn bước 4. Đó là toàn bộ ý nghĩa của <code>^~</code>: "đã khớp tiền tố này rồi thì đừng bận tâm thử đám regex nữa".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Thử đám regex, theo thứ tự file</span><span class="lz-d">Tới lúc này mới thử, từ trên xuống, và cái ĐẦU TIÊN khớp thắng dứt điểm — thắng luôn cái ứng viên tiền tố ở bước 2. Thứ tự chỉ có nghĩa ở đây và không ở đâu khác.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Không regex nào khớp → dùng cái tiền tố đã nhớ</span><span class="lz-d">Ứng viên ở bước 2 nhận request. Nếu đến cả nó cũng không có thì bạn nhận <code>404</code>, và đó là lý do gần như mọi cấu hình thật đều giữ một <code>location /</code>.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tiền tố đua nhau bằng ĐỘ DÀI, regex đua nhau bằng VỊ TRÍ</span><span class="v">Hai cách phân thắng bại khác nhau trong cùng một thuật toán, và lẫn lộn chúng chính là nguyên nhân thường gặp của câu "tôi kéo cái khối lên trên mà chẳng đổi gì". Kéo một khối TIỀN TỐ lên đầu file thì không đổi gì hết; kéo một khối REGEX lên trên thì có thể đổi tất cả.</span></div>
  <div class="kv"><span class="k">Dấu = là một cú ĐOẢN MẠCH, không chỉ là tiền tố chặt hơn</span><span class="v">Nó kết thúc việc khớp NGAY, nên một đường dẫn bị gọi dồn dập mà có <code>= </code> chỉ tốn một phép so sánh thay vì cả một lượt duyệt tiền tố cộng một lượt quét regex. Với một điểm cuối health-check bị gọi mỗi giây thì đó là hiệu năng cho không.</span></div>
  <div class="kv"><span class="k">^~ nói về đám REGEX, không nói về thứ bậc giữa các tiền tố</span><span class="v">Nó KHÔNG làm một tiền tố "mạnh hơn" trước một tiền tố dài hơn — bước 2 vẫn chọn theo độ dài. Nó chỉ quyết định bước 4 có xảy ra hay không. Bài 2.2 đo xem hiểu sai chỗ này phải trả giá thế nào.</span></div>
  <div class="kv"><span class="k">location / là cái sàn, và nó là tiền tố của MỌI thứ</span><span class="v">URI nào cũng bắt đầu bằng <code>/</code>, nên nó luôn khớp và luôn NGẮN NHẤT — nghĩa là nó chỉ thắng khi chẳng cái nào khác thắng. Xoá nó đi không siết chặt an ninh, chỉ biến những cú trượt thành <code>404</code> do Nginx trả thay vì do handler của bạn.</span></div>
</div>

<h3>Đọc ngược bốn dòng ra khỏi thuật toán</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">/a</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bước 1 nổ, và không gì khác chạy</span><span class="lz-nsub">Bằng đúng <code>= /a</code> · khối 2 tới 7 không hề được hỏi tới</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">/a/</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một ký tự phá vỡ khớp chính xác</span><span class="lz-nsub">Rơi xuống bước 2, tiền tố dài nhất là <code>/a</code> · <code>=</code> nghĩa là BẰNG, không phải "bắt đầu bằng"</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">/a/tinh/anh.jpg</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bước 3 chặn nó trước khi tới regex</span><span class="lz-nsub">Tiền tố dài nhất là <code>^~ /a/tinh</code>, nên khối 4 không có cơ hội nào dù nó khớp</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">/a/x.php</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bước 4 thắng cái tiền tố đã nhớ</span><span class="lz-nsub">Tiền tố dài nhất là <code>/a</code> thường, không <code>^~</code>, nên regex chạy và nó thắng</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một location tiền tố KHÔNG dừng lại ở dấu gạch chéo, và cái bảng chứng minh điều đó: <code>/ab</code> đã khớp <code>location /a</code>.</strong> <code>location /a</code> nghĩa là "URI bắt đầu bằng hai ký tự <code>/a</code>", chứ không phải "đoạn đường dẫn đầu tiên là <code>a</code>". Thế nên <code>location /api</code> cũng vớ luôn <code>/apiary</code>, <code>/api-docs</code> và <code>/apifoo</code> — không sao cả, cho tới khi một trong số đó là một dịch vụ khác, hoặc cho tới khi <code>location /admin</code> lặng lẽ bắt đầu vớ luôn <code>/administrators-public-list</code>. Cách chữa là kèm dấu gạch chéo cuối khi bạn có ý nói một thư mục (<code>location /api/</code>), và thêm <code>location = /api</code> ngay bên cạnh nếu đường dẫn trần cũng phải chạy. Đây không phải ca hiếm: nó là bất ngờ phổ biến NHẤT trong cả chương này.</p>
</div>
<div class="note-ct">
<p><strong>Dùng cái này ngoài đời thế nào.</strong> Khi một request đi lạc chỗ, đừng đọc file từ trên xuống để truy thủ phạm. Hãy chạy năm bước đó trong đầu với đúng cái URI đó: khớp chính xác, tiền tố dài nhất, nó có <code>^~</code> không, regex theo thứ tự, rơi về đâu. Bốn trên năm lần câu trả lời hiện ra ngay ở bước 2 — một cái tiền tố bạn quên mất là nó dài hơn — còn lần thứ năm thì là một cái regex nằm trước cái bạn đang nhìn trong file.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location" target="_blank" rel="noopener"><span class="lc-ico">📍</span><span class="lc-body"><span class="lc-title">nginx — chỉ thị location</span><span class="lc-sub">nginx.org · Bản mô tả chuẩn của năm bước ở trên</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">nginx — Nginx xử lý một request thế nào</span><span class="lc-sub">nginx.org · Chỗ việc chọn server kết thúc và việc chọn location bắt đầu</span></span></a>
<a class="link-card" href="https://www.nginx.com/resources/wiki/start/topics/depth/ifisevil/" target="_blank" rel="noopener"><span class="lc-ico">⚠️</span><span class="lc-body"><span class="lc-title">nginx wiki — If is evil</span><span class="lc-sub">nginx.com · Vì sao câu trả lời cho "khối nào" không bao giờ là một cái if</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Web Foundations</span><span class="lc-sub">Đường dẫn URL, mã hoá, và request URI chứa gì trước khi Nginx nhìn thấy</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng lại đủ mười hai dòng, rồi ĐOÁN dòng thứ mười ba trước khi chạy</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — The URI being matched is not the one that was sent|||2.2 — Cái URI đem ra khớp KHÔNG phải cái đã được gửi lên',
      slug: 'nginx-2-2-uri-duoc-chuan-hoa',
      type: 'LESSON',
      description: 'Trước khi chạm tới location nào, Nginx giải mã phần trăm, dẹp dấu gạch chéo lặp và giải quyết mọi dấu chấm chấm. Bài này bắn tám dạng viết khác nhau của cùng một đường dẫn vào một cấu hình thật để xem cái nào chui lọt vào khối "quản trị" — và một dạng thứ chín ăn thẳng 400.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>The URI being matched is not the one that was sent</h2>
<p class="lead">Lesson 2.1 gave you the algorithm. It runs against <code>$uri</code> — a normalised path — and not against the raw bytes in the request line. Knowing exactly what the normaliser does is what separates "my location does not match" from a security incident.</p>

<h3>Eight spellings of one path, measured</h3>
<pre><code>location /quan-tri { return 200 "TRUNG /quan-tri   uri=[\$uri]"; }
location ~ \\.php   { return 200 "TRUNG regex .php  uri=[\$uri]"; }
location /         { return 200 "cong khai         uri=[\$uri]"; }</code></pre>
<div class="out">$ curl --path-as-is ...        (--path-as-is: curl KHONG tu don duong dan)

/quan-tri                  -> TRUNG /quan-tri   uri=[/quan-tri]
/%71uan-tri                -> TRUNG /quan-tri   uri=[/quan-tri]
/QUAN-TRI                  -> cong khai         uri=[/QUAN-TRI]
//quan-tri                 -> TRUNG /quan-tri   uri=[/quan-tri]
/cong-khai/../quan-tri     -> TRUNG /quan-tri   uri=[/quan-tri]
/./quan-tri                -> TRUNG /quan-tri   uri=[/quan-tri]
/quan-tri/../cong-khai     -> cong khai         uri=[/cong-khai]
/quan%2Dtri                -> TRUNG /quan-tri   uri=[/quan-tri]</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Percent-decode</span><span class="lz-d"><code>%71</code> became <code>q</code> and <code>%2D</code> became <code>-</code>, both before matching. Encoding a character does not hide a path from a <code>location</code>, and it never has.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Collapse repeated slashes</span><span class="lz-d"><code>//quan-tri</code> arrived and <code>/quan-tri</code> was matched. A doubled slash is not a different path to Nginx, even though it is to some application frameworks behind it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Resolve . and ..</span><span class="lz-d"><code>/cong-khai/../quan-tri</code> matched the admin block, and <code>/quan-tri/../cong-khai</code> did not. The traversal is resolved textually first, so the block that matches is the block for the resolved path.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Stop — case is NOT touched</span><span class="lz-d"><code>/QUAN-TRI</code> fell through to <code>location /</code>. Prefix locations are case-sensitive and normalisation does not fold case; only <code>~*</code> ignores it.</span></div>
</div>
<div class="callout ok">
<p><strong>The reassuring half.</strong> Steps 1 to 3 mean you cannot smuggle a request past a <code>location</code> by re-spelling the path. Encoded characters, doubled slashes and <code>../</code> are all resolved before the block is chosen, so a <code>location /quan-tri</code> that denies access denies all six spellings above. Nginx is doing the right thing here, and doing it before anything else runs.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — the same normalisation means a <code>location</code> cannot confine anything to a subtree.</strong> Because <code>/cong-khai/../quan-tri</code> resolves to <code>/quan-tri</code> before matching, a block written to serve only <code>/cong-khai</code> is never even asked about that request — it went to the admin block instead. So <code>location /cong-khai</code> is a router, not a jail: it says "requests whose resolved path starts with this go here", and it makes no promise that anything under it stays under it. Confinement is the job of <code>root</code>/<code>alias</code> (Lesson 2.4) plus filesystem permissions, never of the location name. And note what Nginx protects here is <em>its own</em> matching — an application behind a proxy may receive a different path and normalise differently, which is where request smuggling lives.</p>
</div>

<h3>Two spellings that behave differently, and one that is rejected</h3>
<div class="out">/x.php                     -> TRUNG regex .php  uri=[/x.php]
/x.PHP                     -> cong khai         uri=[/x.PHP]     &lt;- thoat khoi handler
/x.pHp                     -> cong khai         uri=[/x.pHp]     &lt;- thoat khoi handler
/x.php/them-duong-dan      -> TRUNG regex .php  uri=[/x.php/them-duong-dan]
/x.php%00.jpg              -> 400 Bad Request                    &lt;- Nginx tu chan byte 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A case-sensitive regex is a bypass waiting to happen</span><span class="v"><code>~ \\.php</code> did not match <code>.PHP</code> or <code>.pHp</code>, so both requests left the handler and hit <code>location /</code>. If what is behind <code>/</code> serves files from a case-insensitive filesystem, the same file just got served without going through the handler that was supposed to guard it. Use <code>~*</code> for extensions, always.</span></div>
  <div class="kv"><span class="k">A missing anchor turns an extension match into a prefix match</span><span class="v"><code>~ \\.php</code> matched <code>/x.php/them-duong-dan</code> — anything containing <code>.php</code> anywhere. Written as <code>~ \\.php\$</code> it would not have. That missing dollar sign is the shape of the classic PHP path-info hole, where an uploaded <code>anh.jpg/x.php</code> reaches an interpreter.</span></div>
  <div class="kv"><span class="k">A null byte is refused before any block is chosen</span><span class="v"><code>%00</code> got <code>400</code> from Nginx itself. Old truncation tricks that end a filename early do not survive the parser, which is worth knowing when you read a decade-old advisory and wonder whether it still applies.</span></div>
  <div class="kv"><span class="k">$uri is normalised; $request_uri is not</span><span class="v">Match and route on <code>$uri</code>. When you need to know literally what the client sent — for a log, for a signature check — read <code>$request_uri</code>, which keeps the encoding, the query string and the doubled slashes exactly as they arrived.</span></div>
</div>

<h3>Where each form lives</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">$request_uri — raw, with query string</span><span class="lz-lnote">Exactly the bytes after the method: <code>/cong-khai/../quan-tri?x=1</code>. Nothing decoded, nothing collapsed. This is what you log and what you must treat as attacker input.</span></div>
  <div class="lz-layer"><span class="lz-lname">$uri — normalised, no query string</span><span class="lz-lnote">What <code>location</code> matches against and what <code>try_files</code> works with: <code>/quan-tri</code>. It changes during the request if an internal redirect happens, which is the subject of Lesson 2.5.</span></div>
  <div class="lz-layer"><span class="lz-lname">$args and $query_string — everything after the ?</span><span class="lz-lnote">Never part of location matching. A <code>location</code> cannot match on a query parameter at all, which surprises people coming from application routers; if you need that, it is a <code>map</code> or an upstream decision.</span></div>
  <div class="lz-layer"><span class="lz-lname">$document_root and $request_filename — after root/alias</span><span class="lz-lnote">The filesystem path Nginx will actually open, computed once the block is chosen. Lesson 2.4 shows the two directives that build it and the one-character mistake that turns it into nonsense.</span></div>
</div>
<div class="note-ct">
<p><strong>The habit worth forming.</strong> When a <code>location</code> does not fire, print the variable before you edit the config: a temporary <code>return 200 "\$uri"</code> in <code>location /</code> tells you in one request what Nginx thinks the path is, and about a third of the time the answer is that it is not what you assumed. It is faster than reading the file again, and unlike reading, it cannot be wrong.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#var_uri" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — $uri and $request_uri</span><span class="lc-sub">nginx.org · The normative difference between the normalised and the raw form</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#merge_slashes" target="_blank" rel="noopener"><span class="lc-ico">➗</span><span class="lc-body"><span class="lc-title">nginx — merge_slashes</span><span class="lc-sub">nginx.org · The switch behind step 2, and why turning it off is rarely right</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/request-smuggling" target="_blank" rel="noopener"><span class="lc-ico">💥</span><span class="lc-body"><span class="lc-title">PortSwigger — Request smuggling</span><span class="lc-sub">portswigger.net · What happens when proxy and application normalise differently</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">Percent-encoding, reserved characters, and what a URL path may contain</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Try to reach a denied location by re-spelling the path, then fix the regex anchor</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Cái URI đem ra khớp KHÔNG phải cái đã được gửi lên</h2>
<p class="lead">Bài 2.1 đưa cho bạn cái thuật toán. Nó chạy trên <code>$uri</code> — một đường dẫn ĐÃ CHUẨN HOÁ — chứ không chạy trên đám byte thô trong dòng request. Biết chính xác bộ chuẩn hoá đó làm gì là thứ phân tách giữa "location của tôi không khớp" và một sự cố an ninh.</p>

<h3>Tám cách viết của cùng một đường dẫn, đo thật</h3>
<pre><code>location /quan-tri { return 200 "TRUNG /quan-tri   uri=[\$uri]"; }
location ~ \\.php   { return 200 "TRUNG regex .php  uri=[\$uri]"; }
location /         { return 200 "cong khai         uri=[\$uri]"; }</code></pre>
<div class="out">$ curl --path-as-is ...        (--path-as-is: curl KHONG tu don duong dan)

/quan-tri                  -> TRUNG /quan-tri   uri=[/quan-tri]
/%71uan-tri                -> TRUNG /quan-tri   uri=[/quan-tri]
/QUAN-TRI                  -> cong khai         uri=[/QUAN-TRI]
//quan-tri                 -> TRUNG /quan-tri   uri=[/quan-tri]
/cong-khai/../quan-tri     -> TRUNG /quan-tri   uri=[/quan-tri]
/./quan-tri                -> TRUNG /quan-tri   uri=[/quan-tri]
/quan-tri/../cong-khai     -> cong khai         uri=[/cong-khai]
/quan%2Dtri                -> TRUNG /quan-tri   uri=[/quan-tri]</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Giải mã phần trăm</span><span class="lz-d"><code>%71</code> thành <code>q</code> và <code>%2D</code> thành <code>-</code>, cả hai đều TRƯỚC khi khớp. Mã hoá một ký tự KHÔNG giấu được đường dẫn khỏi một <code>location</code>, và chưa bao giờ giấu được.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dẹp dấu gạch chéo lặp</span><span class="lz-d"><code>//quan-tri</code> gửi lên và <code>/quan-tri</code> đã khớp. Với Nginx, hai gạch chéo không phải một đường dẫn khác — dù với vài framework ứng dụng đứng sau thì có.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Giải quyết . và ..</span><span class="lz-d"><code>/cong-khai/../quan-tri</code> đã khớp khối quản trị, còn <code>/quan-tri/../cong-khai</code> thì không. Đường đi lùi được giải quyết theo văn bản TRƯỚC, nên khối được chọn là khối của đường dẫn ĐÃ GIẢI QUYẾT.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hết — chữ HOA THƯỜNG thì KHÔNG đụng tới</span><span class="lz-d"><code>/QUAN-TRI</code> rơi tuột xuống <code>location /</code>. Location tiền tố PHÂN BIỆT hoa thường và bộ chuẩn hoá không hạ chữ; chỉ có <code>~*</code> mới bỏ qua nó.</span></div>
</div>
<div class="callout ok">
<p><strong>Nửa đáng yên tâm.</strong> Bước 1 tới 3 nghĩa là bạn KHÔNG thể tuồn một request lọt qua một <code>location</code> bằng cách viết lại đường dẫn. Ký tự mã hoá, gạch chéo lặp và <code>../</code> đều được giải quyết trước khi khối được chọn, nên một <code>location /quan-tri</code> có chặn thì nó chặn cả sáu cách viết ở trên. Nginx làm đúng ở chỗ này, và làm trước mọi thứ khác.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — cũng chính sự chuẩn hoá đó nghĩa là một <code>location</code> KHÔNG giam được thứ gì trong một nhánh cây.</strong> Vì <code>/cong-khai/../quan-tri</code> rút gọn thành <code>/quan-tri</code> trước khi khớp, một khối viết ra để chỉ phục vụ <code>/cong-khai</code> thậm chí không được HỎI tới về request đó — nó đi thẳng vào khối quản trị. Nên <code>location /cong-khai</code> là một BỘ ĐỊNH TUYẾN, không phải một cái ngục: nó nói "request nào có đường dẫn ĐÃ RÚT GỌN bắt đầu bằng cái này thì vào đây", và nó không hứa gì về chuyện những thứ nằm dưới nó sẽ ở yên dưới nó. Việc giam giữ là phần của <code>root</code>/<code>alias</code> (Bài 2.4) cộng với quyền hệ tệp, không bao giờ là phần của cái tên location. Và để ý cái Nginx bảo vệ ở đây là phép khớp CỦA CHÍNH NÓ — một ứng dụng đứng sau proxy có thể nhận một đường dẫn khác và chuẩn hoá khác đi, và đó là chỗ đòn request smuggling sống.</p>
</div>

<h3>Hai cách viết cư xử khác nhau, và một cách bị đá thẳng</h3>
<div class="out">/x.php                     -> TRUNG regex .php  uri=[/x.php]
/x.PHP                     -> cong khai         uri=[/x.PHP]     &lt;- thoat khoi handler
/x.pHp                     -> cong khai         uri=[/x.pHp]     &lt;- thoat khoi handler
/x.php/them-duong-dan      -> TRUNG regex .php  uri=[/x.php/them-duong-dan]
/x.php%00.jpg              -> 400 Bad Request                    &lt;- Nginx tu chan byte 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một regex phân biệt hoa thường là một lối thoát đang chờ xảy ra</span><span class="v"><code>~ \\.php</code> không khớp <code>.PHP</code> lẫn <code>.pHp</code>, nên cả hai request rời khỏi handler và rơi vào <code>location /</code>. Nếu thứ nằm sau <code>/</code> phục vụ tệp từ một hệ tệp KHÔNG phân biệt hoa thường thì đúng cái tệp đó vừa được phục vụ mà không đi qua cái handler lẽ ra phải canh nó. Với phần đuôi tệp, LUÔN dùng <code>~*</code>.</span></div>
  <div class="kv"><span class="k">Thiếu cái neo là biến phép khớp đuôi thành phép khớp tiền tố</span><span class="v"><code>~ \\.php</code> đã khớp <code>/x.php/them-duong-dan</code> — tức là bất cứ thứ gì CHỨA <code>.php</code> ở bất kỳ đâu. Viết thành <code>~ \\.php\$</code> thì đã không. Cái dấu đô-la thiếu đó chính là hình hài của cái lỗ path-info kinh điển của PHP, nơi một tệp tải lên tên <code>anh.jpg/x.php</code> chạm được vào bộ thông dịch.</span></div>
  <div class="kv"><span class="k">Byte 0 bị từ chối trước khi có khối nào được chọn</span><span class="v"><code>%00</code> ăn <code>400</code> từ chính Nginx. Mấy mẹo cắt cụt tên tệp thời xưa không sống nổi qua bộ phân tích cú pháp, và đó là điều đáng biết khi bạn đọc một bản cảnh báo mười năm tuổi và tự hỏi nó còn đúng không.</span></div>
  <div class="kv"><span class="k">$uri đã chuẩn hoá; $request_uri thì KHÔNG</span><span class="v">Khớp và định tuyến thì dùng <code>$uri</code>. Còn khi bạn cần biết client gửi lên ĐÚNG cái gì — để ghi log, để kiểm một chữ ký — thì đọc <code>$request_uri</code>, nó giữ nguyên phần mã hoá, phần query string và cả đám gạch chéo lặp y như lúc tới.</span></div>
</div>

<h3>Mỗi dạng nằm ở đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">$request_uri — thô, kèm query string</span><span class="lz-lnote">Đúng đám byte đứng sau phương thức: <code>/cong-khai/../quan-tri?x=1</code>. Không giải mã gì, không dẹp gì. Đây là thứ bạn ghi log và là thứ bạn PHẢI coi là đầu vào của kẻ tấn công.</span></div>
  <div class="lz-layer"><span class="lz-lname">$uri — đã chuẩn hoá, không có query string</span><span class="lz-lnote">Thứ mà <code>location</code> đem ra khớp và thứ mà <code>try_files</code> làm việc cùng: <code>/quan-tri</code>. Nó ĐỔI trong lúc request đang chạy nếu có một cú chuyển hướng nội bộ, và đó là chủ đề của Bài 2.5.</span></div>
  <div class="lz-layer"><span class="lz-lname">$args và $query_string — mọi thứ sau dấu ?</span><span class="lz-lnote">KHÔNG bao giờ tham gia vào việc khớp location. Một <code>location</code> hoàn toàn không thể khớp theo một tham số query, điều làm người quen với router của ứng dụng thấy lạ; cần thế thì đó là việc của <code>map</code> hoặc là quyết định của upstream.</span></div>
  <div class="lz-layer"><span class="lz-lname">$document_root và $request_filename — sau root/alias</span><span class="lz-lnote">Đường dẫn hệ tệp mà Nginx sẽ THỰC SỰ mở, tính ra sau khi khối đã được chọn. Bài 2.4 chỉ ra hai chỉ thị dựng nên nó và cái lỗi một ký tự biến nó thành vô nghĩa.</span></div>
</div>
<div class="note-ct">
<p><strong>Thói quen đáng tập.</strong> Khi một <code>location</code> không nổ, hãy IN cái biến ra trước khi sửa cấu hình: một dòng <code>return 200 "\$uri"</code> tạm thời trong <code>location /</code> cho bạn biết chỉ trong một request rằng Nginx đang nghĩ đường dẫn là gì, và khoảng một phần ba số lần câu trả lời là nó không phải cái bạn tưởng. Nó nhanh hơn đọc lại file, và khác với đọc, nó không thể sai.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#var_uri" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — $uri và $request_uri</span><span class="lc-sub">nginx.org · Khác biệt chuẩn giữa dạng đã chuẩn hoá và dạng thô</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#merge_slashes" target="_blank" rel="noopener"><span class="lc-ico">➗</span><span class="lc-body"><span class="lc-title">nginx — merge_slashes</span><span class="lc-sub">nginx.org · Cái công tắc đứng sau bước 2, và vì sao tắt nó hiếm khi đúng</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/request-smuggling" target="_blank" rel="noopener"><span class="lc-ico">💥</span><span class="lc-body"><span class="lc-title">PortSwigger — Request smuggling</span><span class="lc-sub">portswigger.net · Chuyện gì xảy ra khi proxy và ứng dụng chuẩn hoá khác nhau</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Web Foundations</span><span class="lc-sub">Mã hoá phần trăm, ký tự dành riêng, và một đường dẫn URL được phép chứa gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Thử chạm vào một location bị chặn bằng cách viết lại đường dẫn, rồi vá cái neo regex</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Choosing a block also chooses which directives apply|||2.3 — Chọn một khối cũng là chọn luôn những chỉ thị nào có hiệu lực',
      slug: 'nginx-2-3-chon-khoi-chon-luon-chi-thi',
      type: 'LESSON',
      description: 'Khối location không chỉ quyết định ai TRẢ LỜI request — nó quyết định luôn tập chỉ thị nào có hiệu lực. Bài này đo ba URL trên CÙNG một server và cho thấy ba bộ header khác nhau, trong đó có một cái làm bay sạch header bảo mật đặt ở tầng server, rồi đo hai cách mà chính phép chọn khối có thể trượt khỏi tay bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Choosing a block also chooses which directives apply</h2>
<p class="lead">Picking a <code>location</code> is not only picking a handler. It picks a point in the configuration tree, and everything that applies to the request is resolved from there. The rule for how that resolution works has one exception that quietly deletes security headers, so this lesson measures it on a real server.</p>

<h3>One server, three URLs, three different header sets</h3>
<pre><code>server {
  root /tmp/nxloc/site;
  add_header X-Tang-Server "co-o-tang-server" always;

  location / {
    add_header X-Trong-Location "co-o-location" always;
  }
  location ~* \\.(jpg|png)\$ {          <span class="tok-comment"># KHÔNG có add_header nào</span>
    expires 7d;
  }
  location = /anh-2.jpg {
    add_header X-Rieng "chi-cua-khoi-nay" always;
    return 200 "anh 2";
  }
}</code></pre>
<div class="out">--- / ---
HTTP/1.1 200 OK
X-Trong-Location: co-o-location                &lt;- X-Tang-Server BIEN MAT

--- /anh.jpg ---
HTTP/1.1 200 OK
Expires: Sun, 30 Aug 2026 16:29:51 GMT
Cache-Control: max-age=604800
X-Tang-Server: co-o-tang-server                &lt;- co, vi khoi nay khong tu dat cai nao

--- /anh-2.jpg ---
HTTP/1.1 200 OK
X-Rieng: chi-cua-khoi-nay                      &lt;- ca hai cai kia deu bay</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Scalar directives inherit downwards</span><span class="lz-d"><code>root</code>, <code>client_max_body_size</code>, <code>proxy_read_timeout</code> — a child that says nothing gets the parent's value, and a child that says something overrides it for itself. This is the behaviour everyone expects.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Array directives inherit ONLY while the child is silent</span><span class="lz-d"><code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code> hold a list. A child with no entry of its own inherits the whole parent list — that is row two above.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">One entry in the child replaces the whole list</span><span class="lz-d">Not appends — replaces. Row one added a single header and lost the server-level one entirely. Rows one and three both show the same deletion from two different block types.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">There is no partial merge, and no warning</span><span class="lz-d"><code>nginx -t</code> is happy, the response is <code>200</code>, and the missing header is invisible until someone looks for it. Nothing in the config file hints that adding a line removed four others.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — this is how sites lose their security headers on exactly one path.</strong> Put <code>Strict-Transport-Security</code>, <code>X-Content-Type-Options</code>, <code>X-Frame-Options</code> and a <code>Content-Security-Policy</code> at the <code>server</code> level, then add one <code>add_header Cache-Control ...</code> inside <code>location /static/</code>, and every static asset is now served with no security headers at all. It is a one-line change that passes review because the reviewer is reading the line you added, not the four you deleted. Two fixes work: repeat the full set inside every block that adds anything, or — much better — put the shared set in a small file and <code>include</code> it in each block, so "repeat them all" is one line and cannot drift.</p>
</div>
<pre><code><span class="tok-comment"># /etc/nginx/snippets/header-bao-mat.conf</span>
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options    "nosniff" always;
add_header X-Frame-Options           "SAMEORIGIN" always;

<span class="tok-comment"># Rồi trong MỌI khối nào có add_header của riêng nó:</span>
location /static/ {
  include /etc/nginx/snippets/header-bao-mat.conf;   <span class="tok-comment"># một dòng, không trôi dạt</span>
  add_header Cache-Control "public, max-age=31536000, immutable" always;
}</code></pre>

<h3>And the choice itself can move under you</h3>
<div class="out">location = /             A
location ^~ /a/tinh      B
location /a/tinh/sau     C   (tien to THUONG, DAI hon B)
location ~ /a/.*\\.jpg   D
location ~ \\.jpg        E
location /               F

=== ^~ tren mot tien to NGAN hon co chan duoc regex khong? ===
/a/tinh/anh.jpg      -> B      (tien to dai nhat la ^~ => bo qua regex)
/a/tinh/sau/anh.jpg  -> D      (tien to dai nhat gio la C, THUONG => regex chay va THANG)

=== Hai regex cung khop: cai nao thang? ===
/b/anh.jpg           -> E      (chi E khop)
/a/anh.jpg           -> D      (ca D lan E khop; D dung TRUOC trong file)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">^~ protects only while it is the longest match</span><span class="v">Adding an ordinary <code>location /a/tinh/sau</code> made the regex apply again to everything under it — the <code>^~</code> on the shorter prefix stopped mattering there. So a block you added for one sub-path silently re-opened regex handling for that whole subtree, and nothing said so.</span></div>
  <div class="kv"><span class="k">If a subtree must never hit a regex, the ^~ has to be on the longest prefix</span><span class="v">Either keep <code>^~</code> on every prefix block inside that subtree, or do not add plain prefix blocks under a <code>^~</code> one. The second is easier to keep true over time.</span></div>
  <div class="kv"><span class="k">Among regexes, file order is the whole tiebreaker</span><span class="v"><code>/a/anh.jpg</code> matched both D and E and took D because D is written first. Length, specificity and how many characters the pattern consumes are all irrelevant — only position. Put the narrow patterns above the broad ones.</span></div>
  <div class="kv"><span class="k">A regex block cannot be "more specific" out of order</span><span class="v">This is the opposite of the prefix rule from 2.1, in the same config file, which is exactly why the two get confused. Prefixes: longest wins, order irrelevant. Regexes: first wins, length irrelevant.</span></div>
</div>

<h3>What to check when a directive "does not work"</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">First: which block actually handled it</span><span class="lz-lnote">Add <code>add_header X-Debug-Block "ten-khoi" always;</code> to the block you believe is running, and request the URL. If the header is absent, the block is not the one you are editing and everything else you were about to check is a waste of time.</span></div>
  <div class="lz-layer"><span class="lz-lname">Second: is the directive an array type</span><span class="lz-lnote">If it is <code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code> or similar, look upwards for a parent list you have just replaced. The value is not missing, it was overwritten by the presence of your line.</span></div>
  <div class="lz-layer"><span class="lz-lname">Third: is the directive even allowed there</span><span class="lz-lnote">Each directive has a context list in the docs — <code>http</code>, <code>server</code>, <code>location</code>, <code>if</code>. Putting one where it is not allowed is a startup error, so if Nginx started, this is not your problem; if it did not, the error message names the line.</span></div>
  <div class="lz-layer"><span class="lz-lname">Fourth: is another module overwriting it later</span><span class="lz-lnote"><code>expires</code> writes <code>Cache-Control</code>, <code>gzip</code> writes <code>Vary</code>, and a proxied upstream can send its own copy of nearly anything. Row two above shows <code>expires 7d</code> producing two headers you never typed.</span></div>
</div>
<div class="note-ct">
<p><strong>The takeaway in one sentence.</strong> A <code>location</code> block is a scope, not just a route: it decides who answers, and it decides which configuration answers with them — and for list-valued directives, writing one line inside it throws away every inherited line rather than adding to them.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">nginx — add_header</span><span class="lc-sub">nginx.org · The inheritance sentence that this whole lesson is about</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location" target="_blank" rel="noopener"><span class="lc-ico">📍</span><span class="lc-body"><span class="lc-title">nginx — location and directive contexts</span><span class="lc-sub">nginx.org · Where each directive is legal, listed per directive</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">MDN — Strict-Transport-Security</span><span class="lc-sub">developer.mozilla.org · One of the headers the trap above silently removes</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">CuongThai course — Authentication</span><span class="lc-sub">What each security header defends against, and what it does not</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Delete a security header with one added line, then fix it with an include</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Chọn một khối cũng là chọn luôn những chỉ thị nào có hiệu lực</h2>
<p class="lead">Chọn một <code>location</code> không chỉ là chọn ai xử lý. Nó chọn một ĐIỂM trên cây cấu hình, và mọi thứ áp dụng cho request đều được giải ra từ chỗ đó. Cái luật giải ra ấy có một ngoại lệ lặng lẽ xoá sạch header bảo mật, nên bài này đem nó ra đo trên một máy chủ thật.</p>

<h3>Một server, ba URL, ba bộ header khác nhau</h3>
<pre><code>server {
  root /tmp/nxloc/site;
  add_header X-Tang-Server "co-o-tang-server" always;

  location / {
    add_header X-Trong-Location "co-o-location" always;
  }
  location ~* \\.(jpg|png)\$ {          <span class="tok-comment"># KHÔNG có add_header nào</span>
    expires 7d;
  }
  location = /anh-2.jpg {
    add_header X-Rieng "chi-cua-khoi-nay" always;
    return 200 "anh 2";
  }
}</code></pre>
<div class="out">--- / ---
HTTP/1.1 200 OK
X-Trong-Location: co-o-location                &lt;- X-Tang-Server BIEN MAT

--- /anh.jpg ---
HTTP/1.1 200 OK
Expires: Sun, 30 Aug 2026 16:29:51 GMT
Cache-Control: max-age=604800
X-Tang-Server: co-o-tang-server                &lt;- co, vi khoi nay khong tu dat cai nao

--- /anh-2.jpg ---
HTTP/1.1 200 OK
X-Rieng: chi-cua-khoi-nay                      &lt;- ca hai cai kia deu bay</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chỉ thị giá trị đơn thì thừa hưởng XUỐNG</span><span class="lz-d"><code>root</code>, <code>client_max_body_size</code>, <code>proxy_read_timeout</code> — con nào không nói gì thì lấy giá trị của cha, con nào nói thì đè lên cho riêng nó. Đây là hành vi ai cũng chờ đợi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chỉ thị dạng MẢNG chỉ thừa hưởng KHI con im lặng</span><span class="lz-d"><code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code> giữ một DANH SÁCH. Con nào không có mục nào của riêng nó thì thừa hưởng NGUYÊN danh sách của cha — đó là dòng thứ hai ở trên.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">MỘT mục ở con là THAY THẾ cả danh sách</span><span class="lz-d">Không phải nối thêm — THAY THẾ. Dòng một thêm đúng một header và mất sạch cái ở tầng server. Dòng một và dòng ba cho thấy cùng một vụ xoá từ hai kiểu khối khác nhau.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Không có trộn một nửa, và không có cảnh báo</span><span class="lz-d"><code>nginx -t</code> vui vẻ, phản hồi là <code>200</code>, và cái header biến mất thì vô hình cho tới khi có người đi tìm. Không có gì trong file cấu hình gợi ý rằng thêm một dòng đã xoá bốn dòng khác.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — đây chính là cách các site mất header bảo mật trên ĐÚNG một đường dẫn.</strong> Đặt <code>Strict-Transport-Security</code>, <code>X-Content-Type-Options</code>, <code>X-Frame-Options</code> và một <code>Content-Security-Policy</code> ở tầng <code>server</code>, rồi thêm một dòng <code>add_header Cache-Control ...</code> vào trong <code>location /static/</code>, thế là mọi tệp tĩnh giờ được phục vụ mà KHÔNG còn header bảo mật nào. Nó là một thay đổi một dòng và nó qua được rà soát, vì người rà soát đang đọc cái dòng bạn THÊM chứ không đọc bốn dòng bạn XOÁ. Hai cách chữa đều được: chép lại đủ bộ vào mọi khối nào có thêm bất cứ thứ gì, hoặc — hay hơn nhiều — bỏ bộ dùng chung vào một file nhỏ rồi <code>include</code> nó ở từng khối, để "chép lại đủ bộ" chỉ còn một dòng và không thể trôi dạt.</p>
</div>
<pre><code><span class="tok-comment"># /etc/nginx/snippets/header-bao-mat.conf</span>
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options    "nosniff" always;
add_header X-Frame-Options           "SAMEORIGIN" always;

<span class="tok-comment"># Rồi trong MỌI khối nào có add_header của riêng nó:</span>
location /static/ {
  include /etc/nginx/snippets/header-bao-mat.conf;   <span class="tok-comment"># một dòng, không trôi dạt</span>
  add_header Cache-Control "public, max-age=31536000, immutable" always;
}</code></pre>

<h3>Và chính phép chọn khối cũng có thể trượt khỏi tay bạn</h3>
<div class="out">location = /             A
location ^~ /a/tinh      B
location /a/tinh/sau     C   (tien to THUONG, DAI hon B)
location ~ /a/.*\\.jpg   D
location ~ \\.jpg        E
location /               F

=== ^~ tren mot tien to NGAN hon co chan duoc regex khong? ===
/a/tinh/anh.jpg      -> B      (tien to dai nhat la ^~ => bo qua regex)
/a/tinh/sau/anh.jpg  -> D      (tien to dai nhat gio la C, THUONG => regex chay va THANG)

=== Hai regex cung khop: cai nao thang? ===
/b/anh.jpg           -> E      (chi E khop)
/a/anh.jpg           -> D      (ca D lan E khop; D dung TRUOC trong file)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">^~ chỉ che chở CHỪNG NÀO nó còn là cái khớp DÀI NHẤT</span><span class="v">Thêm một <code>location /a/tinh/sau</code> bình thường là regex lại có hiệu lực với mọi thứ nằm dưới nó — cái <code>^~</code> trên tiền tố ngắn hơn thôi có nghĩa lý gì ở đó. Nghĩa là một khối bạn thêm cho MỘT nhánh con đã lặng lẽ mở lại cửa regex cho CẢ cây con đó, và không có gì báo cho bạn biết.</span></div>
  <div class="kv"><span class="k">Muốn một cây con không bao giờ chạm regex thì ^~ phải nằm trên cái tiền tố DÀI NHẤT</span><span class="v">Hoặc giữ <code>^~</code> trên MỌI khối tiền tố bên trong cây con đó, hoặc đừng thêm khối tiền tố thường nào bên dưới một khối <code>^~</code>. Cái thứ hai dễ giữ đúng theo thời gian hơn.</span></div>
  <div class="kv"><span class="k">Giữa các regex với nhau, thứ tự file là TOÀN BỘ cách phân thắng bại</span><span class="v"><code>/a/anh.jpg</code> khớp cả D lẫn E và lấy D vì D viết trước. Độ dài, độ cụ thể, mẫu ăn được bao nhiêu ký tự — tất cả đều không liên quan; chỉ có VỊ TRÍ. Hãy đặt mẫu hẹp lên trên mẫu rộng.</span></div>
  <div class="kv"><span class="k">Một khối regex KHÔNG thể "cụ thể hơn" khi nó nằm sai chỗ</span><span class="v">Điều này NGƯỢC với luật tiền tố ở bài 2.1, trong cùng một file cấu hình, và đó đúng là lý do hai cái hay bị lẫn. Tiền tố: dài nhất thắng, thứ tự vô nghĩa. Regex: đầu tiên thắng, độ dài vô nghĩa.</span></div>
</div>

<h3>Kiểm gì khi một chỉ thị "không ăn"</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trước hết: khối nào THỰC SỰ đã xử lý nó</span><span class="lz-lnote">Thêm <code>add_header X-Debug-Block "ten-khoi" always;</code> vào cái khối bạn TIN là đang chạy, rồi gọi URL đó. Header không có nghĩa là khối bạn đang sửa không phải khối đó, và mọi thứ khác bạn định đi kiểm đều là phí thời gian.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thứ hai: chỉ thị đó có phải dạng mảng không</span><span class="lz-lnote">Nếu là <code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code> hay tương tự, hãy ngó LÊN TRÊN tìm cái danh sách cha mà bạn vừa thay thế. Giá trị không mất, nó bị đè bởi chính sự có mặt của dòng bạn viết.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thứ ba: chỉ thị đó có được phép đứng ở đó không</span><span class="lz-lnote">Mỗi chỉ thị có một danh sách ngữ cảnh trong tài liệu — <code>http</code>, <code>server</code>, <code>location</code>, <code>if</code>. Đặt sai chỗ là lỗi lúc khởi động, nên nếu Nginx đã chạy được thì đây không phải vấn đề của bạn; còn nếu nó không chạy thì thông báo lỗi chỉ đúng dòng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thứ tư: có module nào ghi đè nó ở sau không</span><span class="lz-lnote"><code>expires</code> viết <code>Cache-Control</code>, <code>gzip</code> viết <code>Vary</code>, và một upstream sau proxy có thể gửi bản của riêng nó cho gần như mọi thứ. Dòng thứ hai ở trên cho thấy <code>expires 7d</code> sinh ra HAI header bạn không hề gõ.</span></div>
</div>
<div class="note-ct">
<p><strong>Rút gọn trong một câu.</strong> Một khối <code>location</code> là một PHẠM VI chứ không chỉ là một tuyến: nó quyết định ai trả lời, và nó quyết định luôn cấu hình nào trả lời cùng với người đó — còn với chỉ thị dạng danh sách, viết MỘT dòng vào trong nó là vứt đi MỌI dòng được thừa hưởng chứ không phải cộng thêm vào chúng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header" target="_blank" rel="noopener"><span class="lc-ico">📤</span><span class="lc-body"><span class="lc-title">nginx — add_header</span><span class="lc-sub">nginx.org · Cái câu về thừa hưởng mà cả bài này nói về nó</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location" target="_blank" rel="noopener"><span class="lc-ico">📍</span><span class="lc-body"><span class="lc-title">nginx — location và ngữ cảnh của chỉ thị</span><span class="lc-sub">nginx.org · Mỗi chỉ thị hợp lệ ở đâu, liệt kê theo từng chỉ thị</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">MDN — Strict-Transport-Security</span><span class="lc-sub">developer.mozilla.org · Một trong những header mà cái bẫy ở trên lặng lẽ xoá mất</span></span></a>
<a class="link-card" href="/courses/authentication/learn${REF}"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Authentication</span><span class="lc-sub">Mỗi header bảo mật chống lại cái gì, và KHÔNG chống được cái gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Xoá một header bảo mật bằng một dòng thêm vào, rồi vá lại bằng include</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — root and alias, and the missing slash that leaks files|||2.4 — root và alias, và cái dấu gạch chéo thiếu làm rò rỉ tệp',
      slug: 'nginx-2-4-root-va-alias',
      type: 'LESSON',
      description: 'Hai chỉ thị dựng nên đường dẫn hệ tệp mà Nginx sẽ mở, và chúng ghép đường dẫn theo hai cách KHÁC HẲN nhau. Bài này đo cả hai, rồi dựng lại một cấu hình sai đúng MỘT ký tự và đọc được một tệp nằm NGOÀI thư mục công khai — sau đó vá và đo lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>root and alias, and the missing slash that leaks files</h2>
<p class="lead">Once a block is chosen, something has to turn the URI into a path on disk. Two directives do that, they look interchangeable, and they are not: one appends, the other substitutes. The difference is the reason a well-known misconfiguration lets a request read files above the directory you meant to publish.</p>

<h3>The one-sentence difference</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">root</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Appends the WHOLE URI</span><span class="lz-nsub">path = root + $uri · the location name stays part of the path on disk</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">alias</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">REPLACES the matched part</span><span class="lz-nsub">path = alias + (whatever the location did not match) · the location name disappears</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Consequence</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">root needs the directory to exist under it</span><span class="lz-nsub">Serving <code>/tinh/</code> from <code>root /var/www</code> requires a real <code>/var/www/tinh</code> directory</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Consequence</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">alias maps a URL onto any directory</span><span class="lz-nsub">The URL prefix and the directory name are free to differ · which is the only reason to use it</span></div></div>
  </div>
</div>
<div class="out">location /r1/ { root  /tmp/nxloc/www;   }   +  /r1/anh/a.txt
location /r2/ { root  /tmp/nxloc/www/;  }   +  /r2/anh/a.txt
location /a1/ { alias /tmp/nxloc/www2/; }   +  /a1/anh/a.txt
location /a2/ { alias /tmp/nxloc/www2;  }   +  /a2/anh/a.txt

do that — duong dan Nginx dung len:

/r1/anh/a.txt   document_root=[/tmp/nxloc/www]  + uri=[/r1/anh/a.txt]
/r2/anh/a.txt   document_root=[/tmp/nxloc/www]  + uri=[/r2/anh/a.txt]
                                ^^^^ y HET nhau: root TU BO dau / cuoi

/a1/anh/a.txt   request_filename=[/tmp/nxloc/www2/anh/a.txt]      OK
/a2/anh/a.txt   request_filename=[/tmp/nxloc/www2anh/a.txt]       404
                                             ^ thieu dau /, hai manh DINH LIEN</div>
<div class="kv-grid">
  <div class="kv"><span class="k">root forgives the trailing slash, alias does not</span><span class="v">Both <code>root</code> spellings produced the identical <code>$document_root</code> — Nginx strips it. <code>alias</code> is a literal string substitution, so a missing slash produces <code>www2anh</code>, a directory that does not exist, and a <code>404</code> whose cause is invisible until you read the error log.</span></div>
  <div class="kv"><span class="k">Prefer root; reach for alias only when the names must differ</span><span class="v">If the URL prefix and the directory have the same name, <code>root</code> does the job with one fewer way to be wrong. <code>alias</code> earns its keep when <code>/tai-lieu/</code> must serve <code>/srv/docs-build/output/</code>, and nowhere else.</span></div>
  <div class="kv"><span class="k">alias inside a regex location needs captures</span><span class="v">There is no literal "matched part" to remove, so you must rebuild the path yourself: <code>location ~ ^/anh/(.+)\$ { alias /srv/media/\$1; }</code>. If you find yourself writing that, check whether a prefix location would have done.</span></div>
  <div class="kv"><span class="k">Read $request_filename when in doubt</span><span class="v">It is the final path Nginx will open, after <code>root</code> or <code>alias</code> has been applied. A temporary <code>return 200 "\$request_filename"</code> answers "where is it actually looking" in one request, which is faster than reasoning about it.</span></div>
</div>

<h3>The missing slash, and what it leaks</h3>
<pre><code><span class="tok-comment"># SAI — location thiếu dấu / ở cuối</span>
location /tep { alias /tmp/nxloc/kho/cong-khai/; }

<span class="tok-comment"># Cây thư mục:</span>
<span class="tok-comment">#   /tmp/nxloc/kho/bi-mat.txt          &lt;- KHÔNG được phép công khai</span>
<span class="tok-comment">#   /tmp/nxloc/kho/cong-khai/ok.txt    &lt;- thư mục định phục vụ</span></code></pre>
<div class="out">=== location /tep  (THIEU dau / cuoi) ===
/tep/ok.txt                -> 200  OK          (dung nhu y dinh)
/tep../bi-mat.txt          -> 200  BI-MAT      &lt;- DOC DUOC TEP NGOAI THU MUC
/tep../../etc/hostname     -> 200  khong khop  (mot doan .. that thi bi rut gon)

=== SAU KHI VA: location /tep/  (CO dau / cuoi) ===
/tep/ok.txt                -> 200  OK
/tep../bi-mat.txt          -> 200  khong khop  &lt;- khong con khop khoi alias nua</div>
<div class="pitfall">
<p><strong>Bẫy — this is the best-known Nginx misconfiguration, and it is one character wide.</strong> <code>location /tep</code> is a prefix, and prefixes do not stop at a separator (Lesson 2.1), so it matches <code>/tep../bi-mat.txt</code>. <code>alias</code> then removes the matched <code>/tep</code> and prepends the alias, giving <code>/tmp/nxloc/kho/cong-khai/../bi-mat.txt</code> — which the filesystem resolves to the parent directory. The <code>..</code> survived normalisation because <code>tep..</code> is not a path segment, so Lesson 2.2's cleanup never applied to it. Writing <code>location /tep/</code> closes it, measured above: the crafted request no longer matches the block at all. <strong>The rule: when a location is paired with <code>alias</code>, both the location and the alias must end in <code>/</code>, or neither may.</strong> The mixed spelling is the vulnerable one.</p>
</div>
<pre><code><span class="tok-comment"># ĐÚNG — cả hai cùng có dấu / ở cuối</span>
location /tep/ { alias /tmp/nxloc/kho/cong-khai/; }

<span class="tok-comment"># Cũng đúng, và thường tốt hơn: đổi tên thư mục cho khớp rồi dùng root</span>
location /tep/ { root /tmp/nxloc/kho/cong-khai-goc; }
<span class="tok-comment">#   -&gt; mở /tmp/nxloc/kho/cong-khai-goc/tep/... — không có phép thay thế nào</span></code></pre>

<h3>Checking your own config for this</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Find every alias and look at the line above it</span><span class="lz-lnote"><code>grep -rn -B1 'alias ' /etc/nginx/</code>. For each hit, confirm the <code>location</code> and the <code>alias</code> path either both end in <code>/</code> or both do not. Any mismatch is either a broken path or the hole above.</span></div>
  <div class="lz-layer"><span class="lz-lname">Then try the request that would prove it</span><span class="lz-lnote"><code>curl --path-as-is -i http://host/prefix../</code> for each prefix. A <code>200</code> or a directory listing where you expected <code>404</code> is the bug. <code>--path-as-is</code> matters: without it curl tidies the path before sending and you test nothing.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do not rely on the filesystem to save you</span><span class="lz-lnote">It happened to be readable here because the worker user could read the parent. Tight permissions reduce the blast radius but the request still escapes the intended directory — fix the config, then also make sure the worker cannot read what it should not.</span></div>
  <div class="lz-layer"><span class="lz-lname">Watch for the same shape without alias</span><span class="lz-lnote"><code>location /static</code> with a <code>root</code> is not vulnerable in this way, because <code>root</code> keeps the whole URI — but it still catches <code>/staticfoo</code> and hands it to the static handler. The trailing slash is worth adding either way.</span></div>
</div>
<div class="note-ct">
<p><strong>Remember it as a shape, not a rule.</strong> <code>alias</code> performs a textual cut-and-paste on the path, so anything that changes what "the matched part" is changes where the file comes from. That is why the trailing slash matters, why regex locations need explicit captures, and why <code>root</code> — which never cuts anything — has none of these failure modes. When you can use <code>root</code>, use <code>root</code>.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#alias" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">nginx — alias</span><span class="lc-sub">nginx.org · Including the note about regex locations and captures</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#root" target="_blank" rel="noopener"><span class="lc-ico">📁</span><span class="lc-body"><span class="lc-title">nginx — root</span><span class="lc-sub">nginx.org · The append rule, in one paragraph</span></span></a>
<a class="link-card" href="https://owasp.org/www-community/attacks/Path_Traversal" target="_blank" rel="noopener"><span class="lc-ico">🕳️</span><span class="lc-body"><span class="lc-title">OWASP — Path traversal</span><span class="lc-sub">owasp.org · The attack class the missing slash belongs to</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">How the kernel resolves .. and why permissions are the second line of defence</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Reproduce the leak on a sandbox tree, then close it and re-run the same curl</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>root và alias, và cái dấu gạch chéo thiếu làm rò rỉ tệp</h2>
<p class="lead">Khối đã chọn xong thì phải có thứ gì đó biến URI thành một đường dẫn trên đĩa. Hai chỉ thị làm việc đó, chúng trông như thay nhau được, và chúng KHÔNG thay nhau được: một cái NỐI THÊM, cái kia THAY THẾ. Chính khác biệt đó là lý do một cấu hình sai nổi tiếng cho phép một request đọc tệp nằm TRÊN thư mục bạn định công bố.</p>

<h3>Khác biệt gói trong một câu</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">root</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">NỐI THÊM nguyên cả URI</span><span class="lz-nsub">đường dẫn = root + $uri · cái tên location VẪN nằm trong đường dẫn trên đĩa</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">alias</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">THAY THẾ phần đã khớp</span><span class="lz-nsub">đường dẫn = alias + (phần location KHÔNG khớp) · cái tên location BIẾN MẤT</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Hệ quả</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">root đòi thư mục phải TỒN TẠI bên dưới nó</span><span class="lz-nsub">Phục vụ <code>/tinh/</code> từ <code>root /var/www</code> đòi phải có thư mục thật <code>/var/www/tinh</code></span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Hệ quả</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">alias ánh xạ một URL vào thư mục BẤT KỲ</span><span class="lz-nsub">Tiền tố URL và tên thư mục được tự do khác nhau · và đó là lý do DUY NHẤT để dùng nó</span></div></div>
  </div>
</div>
<div class="out">location /r1/ { root  /tmp/nxloc/www;   }   +  /r1/anh/a.txt
location /r2/ { root  /tmp/nxloc/www/;  }   +  /r2/anh/a.txt
location /a1/ { alias /tmp/nxloc/www2/; }   +  /a1/anh/a.txt
location /a2/ { alias /tmp/nxloc/www2;  }   +  /a2/anh/a.txt

do that — duong dan Nginx dung len:

/r1/anh/a.txt   document_root=[/tmp/nxloc/www]  + uri=[/r1/anh/a.txt]
/r2/anh/a.txt   document_root=[/tmp/nxloc/www]  + uri=[/r2/anh/a.txt]
                                ^^^^ y HET nhau: root TU BO dau / cuoi

/a1/anh/a.txt   request_filename=[/tmp/nxloc/www2/anh/a.txt]      OK
/a2/anh/a.txt   request_filename=[/tmp/nxloc/www2anh/a.txt]       404
                                             ^ thieu dau /, hai manh DINH LIEN</div>
<div class="kv-grid">
  <div class="kv"><span class="k">root tha thứ cho cái dấu gạch chéo cuối, alias thì KHÔNG</span><span class="v">Cả hai cách viết <code>root</code> đều cho ra <code>$document_root</code> y hệt nhau — Nginx tự cắt nó đi. Còn <code>alias</code> là một phép thay chuỗi theo nghĩa đen, nên thiếu một dấu gạch chéo là ra <code>www2anh</code>, một thư mục không tồn tại, và một cú <code>404</code> mà nguyên nhân vô hình cho tới khi bạn đọc error log.</span></div>
  <div class="kv"><span class="k">Ưu tiên root; chỉ với tới alias khi hai cái tên BẮT BUỘC phải khác nhau</span><span class="v">Nếu tiền tố URL và thư mục cùng tên thì <code>root</code> làm xong việc với ít hơn một cách để sai. <code>alias</code> chỉ đáng công khi <code>/tai-lieu/</code> phải phục vụ <code>/srv/docs-build/output/</code>, và không ở đâu khác.</span></div>
  <div class="kv"><span class="k">alias bên trong một location regex thì cần nhóm bắt</span><span class="v">Không có "phần đã khớp" theo nghĩa đen nào để bỏ đi, nên bạn phải tự dựng lại đường dẫn: <code>location ~ ^/anh/(.+)\$ { alias /srv/media/\$1; }</code>. Thấy mình đang viết như thế thì hãy kiểm xem một location tiền tố có làm được không đã.</span></div>
  <div class="kv"><span class="k">Nghi ngờ thì ĐỌC $request_filename</span><span class="v">Nó là đường dẫn CUỐI CÙNG Nginx sẽ mở, sau khi <code>root</code> hay <code>alias</code> đã áp dụng xong. Một dòng <code>return 200 "\$request_filename"</code> tạm thời trả lời câu "nó đang tìm ở đâu" chỉ trong một request, nhanh hơn ngồi suy luận.</span></div>
</div>

<h3>Cái dấu gạch chéo thiếu, và nó làm rò rỉ cái gì</h3>
<pre><code><span class="tok-comment"># SAI — location thiếu dấu / ở cuối</span>
location /tep { alias /tmp/nxloc/kho/cong-khai/; }

<span class="tok-comment"># Cây thư mục:</span>
<span class="tok-comment">#   /tmp/nxloc/kho/bi-mat.txt          &lt;- KHÔNG được phép công khai</span>
<span class="tok-comment">#   /tmp/nxloc/kho/cong-khai/ok.txt    &lt;- thư mục định phục vụ</span></code></pre>
<div class="out">=== location /tep  (THIEU dau / cuoi) ===
/tep/ok.txt                -> 200  OK          (dung nhu y dinh)
/tep../bi-mat.txt          -> 200  BI-MAT      &lt;- DOC DUOC TEP NGOAI THU MUC
/tep../../etc/hostname     -> 200  khong khop  (mot doan .. that thi bi rut gon)

=== SAU KHI VA: location /tep/  (CO dau / cuoi) ===
/tep/ok.txt                -> 200  OK
/tep../bi-mat.txt          -> 200  khong khop  &lt;- khong con khop khoi alias nua</div>
<div class="pitfall">
<p><strong>Bẫy — đây là cấu hình sai NỔI TIẾNG NHẤT của Nginx, và nó rộng đúng một ký tự.</strong> <code>location /tep</code> là một tiền tố, và tiền tố không dừng ở dấu gạch chéo (Bài 2.1), nên nó khớp luôn <code>/tep../bi-mat.txt</code>. <code>alias</code> sau đó bỏ đi phần <code>/tep</code> đã khớp rồi ghép alias vào đầu, ra <code>/tmp/nxloc/kho/cong-khai/../bi-mat.txt</code> — mà hệ tệp rút gọn thành thư mục CHA. Cái <code>..</code> sống sót qua bộ chuẩn hoá vì <code>tep..</code> không phải một ĐOẠN đường dẫn, nên phép dọn dẹp ở Bài 2.2 chưa từng đụng tới nó. Viết <code>location /tep/</code> là bịt được, đã đo ở trên: cái request bịa ra kia không còn khớp cái khối đó nữa. <strong>Luật: khi một location đi cùng <code>alias</code> thì CẢ location LẪN alias phải cùng kết thúc bằng <code>/</code>, hoặc cùng không.</strong> Cách viết lẫn lộn mới là cách có lỗ.</p>
</div>
<pre><code><span class="tok-comment"># ĐÚNG — cả hai cùng có dấu / ở cuối</span>
location /tep/ { alias /tmp/nxloc/kho/cong-khai/; }

<span class="tok-comment"># Cũng đúng, và thường tốt hơn: đổi tên thư mục cho khớp rồi dùng root</span>
location /tep/ { root /tmp/nxloc/kho/cong-khai-goc; }
<span class="tok-comment">#   -&gt; mở /tmp/nxloc/kho/cong-khai-goc/tep/... — không có phép thay thế nào</span></code></pre>

<h3>Tự soi cấu hình của mình xem có dính không</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tìm mọi alias rồi nhìn cái dòng ngay TRÊN nó</span><span class="lz-lnote"><code>grep -rn -B1 'alias ' /etc/nginx/</code>. Với mỗi kết quả, xác nhận cái <code>location</code> và cái đường dẫn <code>alias</code> hoặc CÙNG kết thúc bằng <code>/</code> hoặc CÙNG không. Lệch nhau thì hoặc là đường dẫn hỏng, hoặc là cái lỗ ở trên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rồi thử đúng cái request chứng minh được nó</span><span class="lz-lnote"><code>curl --path-as-is -i http://host/tien-to../</code> cho từng tiền tố. Nhận <code>200</code> hay một danh sách thư mục ở chỗ lẽ ra phải <code>404</code> thì đó là lỗi. <code>--path-as-is</code> rất quan trọng: thiếu nó thì curl tự dọn đường dẫn trước khi gửi và bạn chẳng kiểm được gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng trông vào hệ tệp cứu bạn</span><span class="lz-lnote">Ở đây đọc được là vì user chạy worker tình cờ đọc được thư mục cha. Quyền chặt làm hẹp bán kính vụ nổ, nhưng request VẪN thoát ra khỏi thư mục định phục vụ — hãy vá cấu hình trước, rồi hẵng lo cho worker không đọc được thứ nó không nên đọc.</span></div>
  <div class="lz-layer"><span class="lz-lname">Để ý cùng hình dạng đó nhưng KHÔNG có alias</span><span class="lz-lnote"><code>location /static</code> đi với <code>root</code> thì không dính lỗ kiểu này, vì <code>root</code> giữ nguyên cả URI — nhưng nó VẪN vớ luôn <code>/staticfoo</code> và ném cho bộ xử lý tệp tĩnh. Thêm dấu gạch chéo cuối vẫn đáng, ở cả hai trường hợp.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy nhớ nó như một HÌNH DẠNG, đừng nhớ như một luật.</strong> <code>alias</code> thực hiện một phép cắt-dán theo văn bản trên đường dẫn, nên bất cứ thứ gì làm đổi "phần đã khớp" là đổi luôn chỗ tệp được lấy ra. Đó là lý do dấu gạch chéo cuối quan trọng, là lý do location regex cần nhóm bắt tường minh, và là lý do <code>root</code> — thứ chẳng cắt gì cả — không có kiểu hỏng nào trong số này. Khi nào dùng được <code>root</code> thì hãy dùng <code>root</code>.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#alias" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">nginx — alias</span><span class="lc-sub">nginx.org · Kèm cả ghi chú về location regex và nhóm bắt</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#root" target="_blank" rel="noopener"><span class="lc-ico">📁</span><span class="lc-body"><span class="lc-title">nginx — root</span><span class="lc-sub">nginx.org · Luật nối thêm, gói trong một đoạn</span></span></a>
<a class="link-card" href="https://owasp.org/www-community/attacks/Path_Traversal" target="_blank" rel="noopener"><span class="lc-ico">🕳️</span><span class="lc-body"><span class="lc-title">OWASP — Path traversal</span><span class="lc-sub">owasp.org · Lớp tấn công mà cái dấu gạch chéo thiếu thuộc về</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">Nhân hệ điều hành rút gọn .. thế nào và vì sao quyền là tuyến phòng thủ thứ hai</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng lại vụ rò rỉ trên một cây thư mục hộp cát, rồi bịt nó và chạy lại đúng lệnh curl đó</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — try_files, and the internal redirect that restarts everything|||2.5 — try_files, và cú chuyển hướng nội bộ chạy lại tất cả từ đầu',
      slug: 'nginx-2-5-try-files-chuyen-huong-noi-bo',
      type: 'LESSON',
      description: 'Ba thứ trong Nginx âm thầm ĐỔI $uri rồi chạy LẠI toàn bộ phép khớp location từ đầu: try_files, index và error_page. Bài này chứng minh cả ba bằng đo đạc, rồi dựng một vòng lặp chuyển hướng nội bộ thật để xem nó chết ra sao và error log nói gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>try_files, and the internal redirect that restarts everything</h2>
<p class="lead">Everything so far treated location selection as a single decision. It is not always: three ordinary directives can rewrite <code>$uri</code> mid-request and send the whole matching algorithm back to step one. Once you can see that happening, a large class of "impossible" Nginx behaviour becomes obvious.</p>

<h3>try_files, in the order it tries</h3>
<pre><code>location /spa/  { try_files \$uri \$uri/ /index.html; }   <span class="tok-comment"># dự phòng là một URI</span>
location /chat/ { try_files \$uri =404; }                <span class="tok-comment"># dự phòng là một MÃ</span>
location /di-vong/ { try_files \$uri /dich-cuoi; }
location /dich-cuoi { return 200 "DA CHAY LAI KHOP LOCATION: uri=[\$uri]"; }</code></pre>
<div class="out">=== A: du phong la mot URI ===
/spa/khong-co-gi       -> 200 INDEX SPA
/spa/sau/nua/nua       -> 200 INDEX SPA

=== B: du phong la =404 ===
/chat/khong-co         -> 404          (KHONG chuyen huong, dung tai cho)

=== C: du phong tro toi mot location KHAC ===
/di-vong/khong-co      -> DA CHAY LAI KHOP LOCATION: uri=[/dich-cuoi]
                          ^^^ khoi /dich-cuoi DA chay, va $uri DA doi</div>
<p>Row C is the whole point. The fallback did not merely read a different file — it changed <code>$uri</code> to <code>/dich-cuoi</code> and ran location matching again, which landed in a completely different block. That is an <em>internal</em> redirect: no <code>3xx</code>, no second request, nothing the browser can see.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">try_files walks its arguments left to right</span><span class="lz-d">Each one is turned into a filesystem path and tested. <code>\$uri</code> means "the file itself", <code>\$uri/</code> means "a directory of that name". The first that exists is served and the walk stops.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The LAST argument is special</span><span class="lz-d">It is not tested — it is used. If it looks like <code>=404</code> the request ends with that status right here. If it looks like a URI, Nginx performs an internal redirect to it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">An internal redirect resets $uri and re-matches</span><span class="lz-d">The five steps of Lesson 2.1 run again against the new <code>\$uri</code>. A different block can win, with a different <code>root</code>, different headers and a different handler.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Ten of those and Nginx gives up</span><span class="lz-d">There is a hard cap on redirect cycles. Exceed it and the request dies with <code>500</code> and one specific line in the error log — measured below.</span></div>
</div>

<h3>The other two directives that do the same thing</h3>
<div class="out">=== index: /thu-muc/ co file index.html ben trong ===
/thu-muc/    -> DA VAO KHOI = /thu-muc/index.html
                => index DA chuyen huong noi bo, uri gio la [/thu-muc/index.html]

=== error_page 404 /loi-404 ===
/chat/khong-co  -> 404  KHOI error_page: uri=[/loi-404] status ban dau van la 404</div>
<div class="kv-grid">
  <div class="kv"><span class="k">index rewrites the URI before serving</span><span class="v">A dedicated <code>location = /thu-muc/index.html</code> block fired, proving <code>index</code> did not just open a file — it set <code>\$uri</code> to the index path and re-matched. So a <code>location ~ \\.html\$</code> elsewhere in your config <em>will</em> catch directory requests, which surprises people who never asked for that.</span></div>
  <div class="kv"><span class="k">error_page re-matches too, and keeps the original status</span><span class="v">The response was still <code>404</code> even though the handling block ended in <code>return 200</code>. Nginx preserves the status that triggered the page unless you write <code>error_page 404 =200 /loi-404;</code>. That equals sign is the difference between a proper 404 and a soft-404 that search engines index.</span></div>
  <div class="kv"><span class="k">None of the three is visible to the client</span><span class="v">No <code>Location</code> header, no extra round trip, nothing in the browser network tab. The only evidence is in <code>\$uri</code>, in which block ran, and in the access log if you log <code>\$uri</code> alongside <code>\$request_uri</code>.</span></div>
  <div class="kv"><span class="k">=404 is not the same as a URI fallback</span><span class="v">Row B stopped immediately. Use the code form whenever there is nothing sensible to fall back to — it is cheaper, it cannot loop, and it gives an honest status instead of a page pretending the resource exists.</span></div>
</div>

<h3>Building the loop on purpose</h3>
<pre><code><span class="tok-comment"># Dự phòng trỏ tới một tệp KHÔNG tồn tại, mà đường dẫn đó lại rơi</span>
<span class="tok-comment"># đúng vào CHÍNH khối này — nên nó thử lại, và lại, và lại</span>
location /vong-lap/ { try_files \$uri /vong-lap/khong-bao-gio-co.html; }</code></pre>
<div class="out">/vong-lap/x              -> 500

$ grep 'cycle' error.log
rewrite or internal redirection cycle while internally redirecting to
"/vong-lap/khong-bao-gio-co.html"</div>
<div class="pitfall">
<p><strong>Bẫy — a <code>500</code> with no application involved, and the config that causes it looks completely reasonable.</strong> The fallback URI has to be servable by a block that does <em>not</em> send it back through the same <code>try_files</code>. Here <code>/vong-lap/khong-bao-gio-co.html</code> re-matched <code>location /vong-lap/</code>, the file still did not exist, and the fallback fired again — ten times, then <code>500</code>. The classic production version is an SPA config where <code>/index.html</code> is genuinely missing after a bad deploy: every URL on the site returns <code>500</code> instead of a <code>404</code>, and the error log line above is the only thing that says why. Two habits prevent it: make the fallback a path that a <code>location =</code> block handles directly, and make sure the file exists as part of the deploy check rather than assuming it.</p>
</div>
<pre><code><span class="tok-comment"># An toàn: dự phòng đi vào một khối KHÔNG thể quay lại try_files</span>
location /spa/ { try_files \$uri \$uri/ /spa-index; }
location = /spa-index {
  root /srv/spa;
  try_files /index.html =404;   <span class="tok-comment"># thiếu tệp thì 404 THẬT, không phải 500</span>
}</code></pre>

<h3>Reading a request that redirected internally</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Log both URIs, always</span><span class="lz-lnote">A log format with <code>"\$request_uri" -&gt; "\$uri"</code> shows the original and the final path on one line. Without it an internal redirect is invisible in the logs and you will argue with someone about what was requested.</span></div>
  <div class="lz-layer"><span class="lz-lname">$request_uri never changes</span><span class="lz-lnote">It stays what the client sent, through every internal redirect. That makes it the right variable for anything that must reflect the real request — logging, rate-limit keys, signatures — and the wrong one for deciding what to serve.</span></div>
  <div class="lz-layer"><span class="lz-lname">Directives are re-resolved from the new block</span><span class="lz-lnote">After a redirect, <code>root</code>, <code>add_header</code> and everything else come from the block that matched the NEW uri. A header you set in the first block is gone unless the second block sets it too — Lesson 2.3, arriving from an unexpected direction.</span></div>
  <div class="lz-layer"><span class="lz-lname">internal; marks a block as unreachable from outside</span><span class="lz-lnote">Adding <code>internal;</code> to a location makes it answer only internal redirects and return <code>404</code> to a direct request. It is the right guard on error pages, <code>X-Accel-Redirect</code> targets and anything else meant to be reached only from inside your own config.</span></div>
</div>
<div class="note-ct">
<p><strong>The mental model.</strong> Location matching is not one decision per request — it is one decision per <em>internal redirect</em>, and a request can have several. When a block you are certain about does not seem to run, ask whether something before it changed <code>\$uri</code>: a <code>try_files</code> fallback, an <code>index</code> on a directory, an <code>error_page</code>. Print <code>\$uri</code> in the block you land in and the answer takes one request.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files" target="_blank" rel="noopener"><span class="lc-ico">🗂️</span><span class="lc-body"><span class="lc-title">nginx — try_files</span><span class="lc-sub">nginx.org · The special treatment of the last argument, stated normatively</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#error_page" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">nginx — error_page and internal</span><span class="lc-sub">nginx.org · Including the = form that changes the returned status</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_index_module.html" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — the index module</span><span class="lc-sub">nginx.org · Where it says plainly that index performs an internal redirect</span></span></a>
<a class="link-card" href="/courses/nextjs/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Next.js</span><span class="lc-sub">Why a client-routed app needs the fallback, and what it breaks if you get it wrong</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Build the redirect cycle, read the error log line, then make it a 404 instead</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>try_files, và cú chuyển hướng nội bộ chạy lại tất cả từ đầu</h2>
<p class="lead">Từ đầu tới giờ ta coi việc chọn location là MỘT quyết định. Không phải lúc nào cũng thế: ba chỉ thị rất bình thường có thể viết lại <code>$uri</code> ngay giữa request và đẩy cả thuật toán khớp quay về bước một. Nhìn thấy được chuyện đó là cả một lớp hành vi "không thể nào" của Nginx trở nên hiển nhiên.</p>

<h3>try_files, theo đúng thứ tự nó thử</h3>
<pre><code>location /spa/  { try_files \$uri \$uri/ /index.html; }   <span class="tok-comment"># dự phòng là một URI</span>
location /chat/ { try_files \$uri =404; }                <span class="tok-comment"># dự phòng là một MÃ</span>
location /di-vong/ { try_files \$uri /dich-cuoi; }
location /dich-cuoi { return 200 "DA CHAY LAI KHOP LOCATION: uri=[\$uri]"; }</code></pre>
<div class="out">=== A: du phong la mot URI ===
/spa/khong-co-gi       -> 200 INDEX SPA
/spa/sau/nua/nua       -> 200 INDEX SPA

=== B: du phong la =404 ===
/chat/khong-co         -> 404          (KHONG chuyen huong, dung tai cho)

=== C: du phong tro toi mot location KHAC ===
/di-vong/khong-co      -> DA CHAY LAI KHOP LOCATION: uri=[/dich-cuoi]
                          ^^^ khoi /dich-cuoi DA chay, va $uri DA doi</div>
<p>Dòng C mới là toàn bộ ý nghĩa. Cái dự phòng KHÔNG chỉ đọc một tệp khác — nó đổi <code>$uri</code> thành <code>/dich-cuoi</code> rồi chạy LẠI phép khớp location, và rơi vào một khối hoàn toàn khác. Đó là một cú chuyển hướng NỘI BỘ: không có <code>3xx</code> nào, không có request thứ hai nào, không có gì trình duyệt nhìn thấy được.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">try_files duyệt các đối số từ TRÁI sang PHẢI</span><span class="lz-d">Mỗi cái được biến thành một đường dẫn hệ tệp rồi đem thử. <code>\$uri</code> nghĩa là "chính cái tệp đó", <code>\$uri/</code> nghĩa là "một thư mục tên như thế". Cái đầu tiên TỒN TẠI được đem ra phục vụ và cuộc duyệt dừng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đối số CUỐI CÙNG thì đặc biệt</span><span class="lz-d">Nó KHÔNG được đem thử — nó được ĐEM DÙNG. Trông giống <code>=404</code> thì request kết thúc ngay tại chỗ với mã đó. Trông giống một URI thì Nginx thực hiện một cú chuyển hướng nội bộ tới nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chuyển hướng nội bộ ĐẶT LẠI $uri rồi KHỚP LẠI</span><span class="lz-d">Năm bước của Bài 2.1 chạy lại với cái <code>\$uri</code> mới. Một khối KHÁC có thể thắng, với một <code>root</code> khác, header khác và bộ xử lý khác.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Mười lần như thế là Nginx bỏ cuộc</span><span class="lz-d">Có một trần cứng cho số vòng chuyển hướng. Vượt qua là request chết với <code>500</code> kèm đúng MỘT dòng trong error log — đo ở dưới.</span></div>
</div>

<h3>Hai chỉ thị còn lại cũng làm y như thế</h3>
<div class="out">=== index: /thu-muc/ co file index.html ben trong ===
/thu-muc/    -> DA VAO KHOI = /thu-muc/index.html
                => index DA chuyen huong noi bo, uri gio la [/thu-muc/index.html]

=== error_page 404 /loi-404 ===
/chat/khong-co  -> 404  KHOI error_page: uri=[/loi-404] status ban dau van la 404</div>
<div class="kv-grid">
  <div class="kv"><span class="k">index viết lại URI TRƯỚC khi phục vụ</span><span class="v">Một khối riêng <code>location = /thu-muc/index.html</code> đã nổ, chứng minh <code>index</code> không chỉ mở một tệp — nó đặt <code>\$uri</code> thành đường dẫn của tệp index rồi khớp lại. Nên một <code>location ~ \\.html\$</code> nằm đâu đó trong cấu hình của bạn SẼ vớ luôn các request tới thư mục, điều làm ngạc nhiên những người chưa từng yêu cầu như thế.</span></div>
  <div class="kv"><span class="k">error_page cũng khớp lại, và GIỮ nguyên mã trạng thái ban đầu</span><span class="v">Phản hồi vẫn là <code>404</code> dù cái khối xử lý kết thúc bằng <code>return 200</code>. Nginx giữ lại mã đã kích hoạt trang lỗi trừ khi bạn viết <code>error_page 404 =200 /loi-404;</code>. Cái dấu bằng ấy là khác biệt giữa một cú 404 tử tế và một cú 404-mềm mà máy tìm kiếm đem đi lập chỉ mục.</span></div>
  <div class="kv"><span class="k">Cả ba đều VÔ HÌNH với client</span><span class="v">Không header <code>Location</code>, không thêm vòng đi về, không gì trong tab Network của trình duyệt. Bằng chứng duy nhất nằm ở <code>\$uri</code>, ở chỗ khối nào đã chạy, và ở access log nếu bạn ghi <code>\$uri</code> cạnh <code>\$request_uri</code>.</span></div>
  <div class="kv"><span class="k">=404 KHÔNG giống một URI dự phòng</span><span class="v">Dòng B dừng ngay lập tức. Hãy dùng dạng mã bất cứ khi nào không có gì hợp lý để rơi vào — nó rẻ hơn, nó không thể lặp vòng, và nó cho một mã trạng thái THẬT THÀ thay vì một trang giả vờ rằng tài nguyên có tồn tại.</span></div>
</div>

<h3>Dựng cái vòng lặp một cách cố ý</h3>
<pre><code><span class="tok-comment"># Dự phòng trỏ tới một tệp KHÔNG tồn tại, mà đường dẫn đó lại rơi</span>
<span class="tok-comment"># đúng vào CHÍNH khối này — nên nó thử lại, và lại, và lại</span>
location /vong-lap/ { try_files \$uri /vong-lap/khong-bao-gio-co.html; }</code></pre>
<div class="out">/vong-lap/x              -> 500

$ grep 'cycle' error.log
rewrite or internal redirection cycle while internally redirecting to
"/vong-lap/khong-bao-gio-co.html"</div>
<div class="pitfall">
<p><strong>Bẫy — một cú <code>500</code> mà chẳng có ứng dụng nào tham gia, và cái cấu hình gây ra nó trông hoàn toàn hợp lý.</strong> Cái URI dự phòng BẮT BUỘC phải phục vụ được bởi một khối KHÔNG đẩy nó quay lại chính cái <code>try_files</code> ấy. Ở đây <code>/vong-lap/khong-bao-gio-co.html</code> khớp lại <code>location /vong-lap/</code>, tệp vẫn không tồn tại, và cái dự phòng lại nổ — mười lần, rồi <code>500</code>. Bản kinh điển ngoài production là một cấu hình SPA mà <code>/index.html</code> thật sự biến mất sau một lần deploy hỏng: MỌI URL trên site trả <code>500</code> thay vì <code>404</code>, và cái dòng error log ở trên là thứ duy nhất nói vì sao. Hai thói quen chặn được nó: cho dự phòng trỏ tới một đường dẫn mà một khối <code>location =</code> xử lý TRỰC TIẾP, và kiểm tệp đó có tồn tại như một phần của bước kiểm deploy chứ đừng cho là nhiên.</p>
</div>
<pre><code><span class="tok-comment"># An toàn: dự phòng đi vào một khối KHÔNG thể quay lại try_files</span>
location /spa/ { try_files \$uri \$uri/ /spa-index; }
location = /spa-index {
  root /srv/spa;
  try_files /index.html =404;   <span class="tok-comment"># thiếu tệp thì 404 THẬT, không phải 500</span>
}</code></pre>

<h3>Đọc một request đã chuyển hướng nội bộ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">LUÔN ghi log cả hai cái URI</span><span class="lz-lnote">Một định dạng log có <code>"\$request_uri" -&gt; "\$uri"</code> cho thấy đường dẫn gốc và đường dẫn cuối trên cùng một dòng. Thiếu nó thì một cú chuyển hướng nội bộ vô hình trong log và bạn sẽ đi cãi nhau với ai đó về chuyện cái gì đã được gọi.</span></div>
  <div class="lz-layer"><span class="lz-lname">$request_uri KHÔNG BAO GIỜ đổi</span><span class="lz-lnote">Nó giữ nguyên cái client gửi, qua mọi cú chuyển hướng nội bộ. Điều đó làm nó thành biến ĐÚNG cho mọi thứ phải phản ánh request thật — ghi log, khoá giới hạn tần suất, chữ ký — và là biến SAI để quyết định phục vụ cái gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Các chỉ thị được giải LẠI từ khối MỚI</span><span class="lz-lnote">Sau một cú chuyển hướng, <code>root</code>, <code>add_header</code> và mọi thứ khác đều tới từ cái khối khớp với uri MỚI. Một header bạn đặt ở khối đầu là mất, trừ khi khối thứ hai cũng đặt nó — Bài 2.3, ập tới từ một hướng không ai ngờ.</span></div>
  <div class="lz-layer"><span class="lz-lname">internal; đánh dấu một khối là KHÔNG chạm được từ bên ngoài</span><span class="lz-lnote">Thêm <code>internal;</code> vào một location là nó chỉ trả lời các cú chuyển hướng nội bộ và trả <code>404</code> cho request gọi thẳng. Đó là cái chốt đúng cho các trang lỗi, các đích của <code>X-Accel-Redirect</code> và mọi thứ chỉ nên được chạm tới từ bên trong cấu hình của chính bạn.</span></div>
</div>
<div class="note-ct">
<p><strong>Mô hình trong đầu.</strong> Khớp location KHÔNG phải một quyết định cho mỗi request — nó là một quyết định cho mỗi CÚ CHUYỂN HƯỚNG NỘI BỘ, và một request có thể có vài cú. Khi một khối bạn chắc chắn về nó lại có vẻ không chạy, hãy hỏi xem có thứ gì trước đó đã đổi <code>\$uri</code> chưa: một cú dự phòng của <code>try_files</code>, một cái <code>index</code> trên thư mục, một cái <code>error_page</code>. In <code>\$uri</code> ra ở cái khối bạn rơi vào là câu trả lời tốn đúng một request.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files" target="_blank" rel="noopener"><span class="lc-ico">🗂️</span><span class="lc-body"><span class="lc-title">nginx — try_files</span><span class="lc-sub">nginx.org · Cách đối xử đặc biệt với đối số cuối, nói theo chuẩn</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#error_page" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">nginx — error_page và internal</span><span class="lc-sub">nginx.org · Kèm cả dạng = làm đổi mã trạng thái trả về</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_index_module.html" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — module index</span><span class="lc-sub">nginx.org · Chỗ nói thẳng rằng index thực hiện một cú chuyển hướng nội bộ</span></span></a>
<a class="link-card" href="/courses/nextjs/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Next.js</span><span class="lc-sub">Vì sao ứng dụng định tuyến ở client cần cái dự phòng, và làm sai thì hỏng gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng cái vòng lặp, đọc dòng error log, rồi biến nó thành một cú 404 tử tế</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Quiz: which location wins|||2.6 — Quiz: location nào thắng',
      slug: 'nginx-2-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về thuật toán năm bước, phép chuẩn hoá URI, luật thừa hưởng dạng mảng, root và alias, cùng ba chỉ thị âm thầm chạy lại mọi thứ từ đầu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>Quiz: which location wins</h2>
<p class="lead">Eight questions, all answerable from measurements in this chapter. Two of them are about failures you can reproduce in a sandbox in under a minute, which is the best reason to trust the answer.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Location selection is five steps, not a top-to-bottom scan: exact match short-circuits everything, then the longest matching prefix is remembered, then <code>^~</code> decides whether the regexes run at all, then the first matching regex wins outright, then the remembered prefix is used (2.1). Those steps run against <code>$uri</code>, which has already been percent-decoded, had repeated slashes collapsed and <code>../</code> resolved — but never case-folded, which is why a case-sensitive <code>~ \\.php</code> lets <code>.PHP</code> escape its handler (2.2). Choosing a block also chooses its configuration, and for list-valued directives like <code>add_header</code> one line in a child throws away the whole inherited list — measured as three URLs on one server returning three different header sets (2.3). <code>root</code> appends the whole URI while <code>alias</code> substitutes the matched part, which is why a location missing its trailing slash next to an <code>alias</code> served a file from outside the published directory (2.4). And <code>try_files</code>, <code>index</code> and <code>error_page</code> can all rewrite <code>$uri</code> and restart the entire algorithm, up to ten times before the request dies with <code>500</code> (2.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Quiz: location nào thắng</h2>
<p class="lead">Tám câu, tất cả đều trả lời được từ những phép đo trong chương này. Hai câu nói về những kiểu hỏng bạn dựng lại được trong hộp cát chưa tới một phút, và đó là lý do tốt nhất để tin câu trả lời.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Chọn location là NĂM bước chứ không phải một lượt quét từ trên xuống: khớp chính xác đoản mạch mọi thứ, rồi tiền tố khớp DÀI NHẤT được ghi nhớ, rồi <code>^~</code> quyết định đám regex có chạy hay không, rồi regex ĐẦU TIÊN khớp thắng dứt điểm, rồi mới dùng tới cái tiền tố đã nhớ (2.1). Những bước đó chạy trên <code>$uri</code>, thứ đã được giải mã phần trăm, đã dẹp gạch chéo lặp và đã rút gọn <code>../</code> — nhưng KHÔNG BAO GIỜ hạ chữ hoa, và đó là lý do một cái <code>~ \\.php</code> phân biệt hoa thường để cho <code>.PHP</code> thoát khỏi bộ xử lý của nó (2.2). Chọn một khối cũng là chọn luôn cấu hình của nó, và với chỉ thị dạng danh sách như <code>add_header</code> thì MỘT dòng ở con vứt đi NGUYÊN danh sách thừa hưởng — đo được bằng ba URL trên cùng một server trả về ba bộ header khác nhau (2.3). <code>root</code> NỐI nguyên cả URI còn <code>alias</code> THAY THẾ phần đã khớp, và đó là lý do một location thiếu dấu gạch chéo cuối nằm cạnh một <code>alias</code> đã phục vụ một tệp NGOÀI thư mục được công bố (2.4). Và <code>try_files</code>, <code>index</code>, <code>error_page</code> đều có thể viết lại <code>$uri</code> rồi chạy lại toàn bộ thuật toán, tối đa mười lần trước khi request chết với <code>500</code> (2.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A config has location /api and location ~ \\\\.json in that order. A request for /api/x.json arrives. Which wins?|||Một cấu hình có location /api rồi location ~ \\\\.json theo thứ tự đó. Một request tới /api/x.json. Cái nào thắng?',
            options: [
              'location /api, because it appears first in the file|||location /api, vì nó đứng trước trong file',
              'The regex — the longest matching prefix was plain (no ^~), so the regexes are tried and the first match beats it|||Cái regex — tiền tố khớp dài nhất là loại THƯỜNG (không có ^~), nên đám regex được thử và cái khớp đầu tiên thắng nó',
              'location /api, because a prefix is always more specific|||location /api, vì tiền tố thì luôn cụ thể hơn',
              'Nginx returns 500 because the two overlap|||Nginx trả 500 vì hai cái chồng lấn nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You move a prefix location block to the top of the file. What changes?|||Bạn kéo một khối location TIỀN TỐ lên đầu file. Cái gì thay đổi?',
            options: [
              'It now matches before the others|||Giờ nó khớp trước những cái khác',
              'Nothing — prefix locations compete on length, not position; only regex blocks are order-sensitive|||Không gì cả — location tiền tố đua nhau bằng ĐỘ DÀI chứ không phải vị trí; chỉ khối regex mới nhạy với thứ tự',
              'It becomes the default location|||Nó trở thành location mặc định',
              'All regex blocks below it stop working|||Mọi khối regex bên dưới nó ngừng hoạt động',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You have location ^~ /tinh/ to keep a subtree away from a PHP regex. A colleague adds location /tinh/anh/ (plain). What happens to requests for /tinh/anh/x.php?|||Bạn có location ^~ /tinh/ để giữ một cây con tránh xa cái regex PHP. Một đồng nghiệp thêm location /tinh/anh/ (loại thường). Chuyện gì xảy ra với request tới /tinh/anh/x.php?',
            options: [
              'Nothing; ^~ protects the whole subtree|||Không gì cả; ^~ che chở cả cây con',
              'The longest matching prefix is now the plain block, so ^~ no longer applies and the PHP regex runs again — measured|||Tiền tố khớp dài nhất giờ là cái khối THƯỜNG, nên ^~ hết hiệu lực và cái regex PHP chạy lại — đã đo',
              'Nginx refuses to start|||Nginx từ chối khởi động',
              'The request gets a 404|||Request nhận 404',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A request arrives for /cong-khai/../quan-tri. Which location matches?|||Một request tới /cong-khai/../quan-tri. Location nào khớp?',
            options: [
              'location /cong-khai, because that is what the client sent|||location /cong-khai, vì đó là cái client gửi lên',
              'location /quan-tri — the ../ is resolved before matching, so a location name confines nothing to a subtree|||location /quan-tri — cái ../ được rút gọn TRƯỚC khi khớp, nên một cái tên location không giam được thứ gì trong một cây con',
              'Neither; Nginx rejects the request with 400|||Không cái nào; Nginx đá request với 400',
              'Both, in sequence|||Cả hai, lần lượt',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'server has four add_header security headers. You add one add_header Cache-Control line inside location /static/. What does a static asset now return?|||Khối server có bốn dòng add_header header bảo mật. Bạn thêm MỘT dòng add_header Cache-Control vào trong location /static/. Giờ một tệp tĩnh trả về gì?',
            options: [
              'All five headers|||Cả năm header',
              'Only Cache-Control — a child list REPLACES the inherited list rather than adding to it, so the four security headers are gone|||Chỉ Cache-Control — danh sách ở con THAY THẾ danh sách thừa hưởng chứ không cộng thêm, nên bốn header bảo mật biến mất',
              'The four security headers only|||Chỉ bốn header bảo mật',
              'It depends on whether always is used|||Tuỳ vào việc có dùng always hay không',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'location /tep { alias /srv/cong-khai/; } — with no trailing slash on the location. Why is this dangerous?|||location /tep { alias /srv/cong-khai/; } — location KHÔNG có dấu gạch chéo cuối. Vì sao nó nguy hiểm?',
            options: [
              'It is only a style issue; Nginx normalises it|||Chỉ là vấn đề phong cách; Nginx tự chuẩn hoá',
              '/tep../bi-mat.txt matches the prefix, alias replaces /tep, and the resulting path resolves into the PARENT directory — measured returning a file outside the published tree|||/tep../bi-mat.txt khớp cái tiền tố, alias thay chỗ /tep, và đường dẫn ra được rút gọn vào thư mục CHA — đo thật đã trả về một tệp ngoài cây được công bố',
              'It makes Nginx slower|||Nó làm Nginx chậm đi',
              'It breaks only when the directory is empty|||Nó chỉ hỏng khi thư mục rỗng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'try_files $uri /index.html; and /index.html does not exist. What does a request for a missing path return?|||try_files $uri /index.html; và /index.html KHÔNG tồn tại. Một request tới một đường dẫn không có sẽ trả về gì?',
            options: [
              '404, because nothing was found|||404, vì chẳng tìm thấy gì',
              '500 — the fallback re-matches the same block, fires again, and hits the internal-redirect cycle limit; the error log says "rewrite or internal redirection cycle"|||500 — cái dự phòng khớp lại chính khối đó, nổ lại, và chạm trần vòng chuyển hướng nội bộ; error log ghi "rewrite or internal redirection cycle"',
              '200 with an empty body|||200 với thân rỗng',
              '301 to /index.html|||301 về /index.html',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'error_page 404 /loi-404; and the block at /loi-404 ends with return 200. What status does the client see?|||error_page 404 /loi-404; và cái khối ở /loi-404 kết thúc bằng return 200. Client nhìn thấy mã trạng thái nào?',
            options: [
              '200, because that is what the handling block returned|||200, vì đó là cái khối xử lý trả về',
              '404 — Nginx preserves the status that triggered the error page unless you write error_page 404 =200 /loi-404;|||404 — Nginx GIỮ lại mã đã kích hoạt trang lỗi, trừ khi bạn viết error_page 404 =200 /loi-404;',
              '500, because the two statuses conflict|||500, vì hai mã trạng thái xung đột',
              'It alternates between the two|||Nó luân phiên giữa hai cái',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
