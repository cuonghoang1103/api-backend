const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 9 — Load balancing across several backends|||Chương 9 — Cân bằng tải qua nhiều backend',
  description: 'Ba máy chủ thật, ba tiến trình thật, và mỗi phép đo là một bảng đếm xem request nào đi tới máy nào. Trong đó có chuyện giết một máy giữa chừng mà KHÔNG client nào nhận 502, và một phép đo cho thấy 101 request đi qua đúng MỘT kết nối TCP.',
  lessons: [

    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — The upstream block and four ways to choose|||9.1 — Khối upstream và bốn cách chọn máy',
      slug: 'nginx-9-1-khoi-upstream',
      type: 'LESSON',
      description: 'Ba máy chủ thật, ba mươi request, và một bảng đếm cho mỗi thuật toán. Bốn dòng đo, và một trong số đó gửi cả ba mươi request vào ĐÚNG MỘT máy — điều đó ĐÚNG, và biết vì sao nó đúng là cả bài học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The upstream block and four ways to choose</h2>
<p class="lead">One backend is a <code>proxy_pass</code> to an address. Several backends is an <code>upstream</code> block, and the only real decision inside it is how Nginx picks which one gets the next request.</p>

<h3>Four algorithms, thirty requests each, counted</h3>
<pre><code>upstream deu      {              server ...9501; server ...9502; server ...9503; }
upstream trongso  {              server ...9501 weight=3; server ...9502 weight=1; }
upstream itketnoi { least_conn;  server ...9501; server ...9502; server ...9503; }
upstream theoip   { ip_hash;     server ...9501; server ...9502; server ...9503; }</code></pre>
<div class="out">30 request, dem xem may nao tra loi:

  round-robin (mac dinh) : may-1=10  may-2=10  may-3=10
  weight 3:1             : may-1=23  may-2=7
  least_conn             : may-1=10  may-2=10  may-3=10
  ip_hash (tu MOT IP)    : may-3=30
                            ^^^^^^^ ca 30 vao MOT may. Dung nhu thiet ke.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Round robin is the default and it is even</span><span class="lz-d">Ten each, exactly. No configuration, no state, no surprises — and it is the right choice whenever any backend can serve any request, which is most of the time.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">weight= changes the ratio, not the mechanism</span><span class="lz-d">23 to 7 against a configured 3 to 1, which is 22.5 to 7.5 rounded by where the cycle happened to stop. Use it when machines differ in size, not as a way to drain traffic — <code>down</code> does that properly.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">least_conn looked identical here, and that is expected</span><span class="lz-d">With responses in single-digit milliseconds no backend ever has a queue, so "fewest connections" and "next in line" agree. It differs when request durations vary a lot — a mix of fast reads and slow reports is exactly where it earns its place.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">ip_hash sent everything to one machine, correctly</span><span class="lz-d">All thirty requests came from one address, and <code>ip_hash</code> maps an address to a backend. From one client it is supposed to look like this. From thousands of clients it spreads — and Lesson 9.2 measures what it does when the pool changes.</span></div>
</div>

<h3>The upstream block itself</h3>
<pre><code>upstream api {
  server 10.0.1.11:3000  weight=2;          <span class="tok-comment"># máy khoẻ hơn, nhận nhiều hơn</span>
  server 10.0.1.12:3000;
  server 10.0.1.13:3000  backup;            <span class="tok-comment"># CHỈ dùng khi máy chính chết hết</span>
  server 10.0.1.14:3000  down;              <span class="tok-comment"># rút ra khỏi vòng, không xoá dòng</span>

  keepalive 32;                             <span class="tok-comment"># tái dùng kết nối — Bài 9.4</span>
}

server {
  location /api/ {
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_pass http://api/;                 <span class="tok-comment"># tên khối, không phải địa chỉ</span>
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">down keeps the line and takes the machine out</span><span class="v">Better than deleting the <code>server</code> line: the config still documents that the machine exists, and putting it back is a one-word diff. This is how you drain a node before maintenance.</span></div>
  <div class="kv"><span class="k">A named upstream re-resolves DNS on reload, not per request</span><span class="v">Same rule as Lesson 3.1. If your backends are containers with changing addresses, a bare hostname is resolved once at startup and then stale forever. The fix is a <code>resolver</code> plus a variable in <code>proxy_pass</code>, which forces re-resolution.</span></div>
  <div class="kv"><span class="k">One upstream can be used by many locations</span><span class="v">And each location can have its own timeouts, buffering and caching against it. The upstream is the pool; the location is the policy.</span></div>
  <div class="kv"><span class="k">The block belongs at http level</span><span class="v">Not inside <code>server</code>. That is what lets several server blocks share one pool — and one pool means one shared view of which backends are currently failing, which matters in Lesson 9.3.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — round robin balances <em>requests</em>, not work, and those are not the same thing.</strong> Three backends each getting ten requests looks balanced, and it is — until one of those requests is a report that takes thirty seconds and the other twenty-nine are 5ms reads. The machine that drew the slow one is now saturated while its peers are idle, and round robin will keep handing it its share regardless. <code>least_conn</code> is the direct fix: it counts what is in flight rather than what has been sent. The measurement above could not show the difference because every response was equally fast, which is exactly the condition under which the two algorithms agree — so do not conclude from a flat benchmark that the choice does not matter.</p>
</div>

<h3>Choosing between them</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Round robin — stateless backends, uniform requests</span><span class="lz-lnote">The default, and correct for most APIs. If any backend can serve any request in roughly the same time, there is nothing to improve on.</span></div>
  <div class="lz-layer"><span class="lz-lname">least_conn — mixed request durations</span><span class="lz-lnote">Anything where some endpoints are much slower than others. It costs nothing and it degrades to round robin when durations are uniform, so it is a safe default if you are unsure.</span></div>
  <div class="lz-layer"><span class="lz-lname">ip_hash or hash — when a client must keep hitting one backend</span><span class="lz-lnote">In-memory sessions, a per-connection cache, a WebSocket that must reconnect to the same node. Lesson 9.2 covers the two forms and the difference between them, which is larger than it looks.</span></div>
  <div class="lz-layer"><span class="lz-lname">random two — very large pools</span><span class="lz-lnote"><code>random two least_conn;</code> picks two at random and takes the less loaded of the pair. With dozens of backends it approximates <code>least_conn</code> without the bookkeeping, and it avoids the herding that pure <code>least_conn</code> can cause when a new node joins.</span></div>
</div>
<div class="note-ct">
<p><strong>How to check the distribution on your own system.</strong> Have each backend put its name in a response header — <code>add_header X-May-Chu "may-1";</code> or the equivalent in your app — then send a few hundred requests and count. That one header turns every question in this chapter into an experiment, and it is worth having permanently: when something behaves oddly for some users and not others, the first useful fact is which backend they reached.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html" target="_blank" rel="noopener"><span class="lc-ico">🏭</span><span class="lc-body"><span class="lc-title">nginx — the upstream module</span><span class="lc-sub">nginx.org · Every parameter of server, and all the balancing methods</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/load_balancing.html" target="_blank" rel="noopener"><span class="lc-ico">⚖️</span><span class="lc-body"><span class="lc-title">nginx — HTTP load balancing</span><span class="lc-sub">nginx.org · The introductory guide, with the same four methods</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Load_balancing_(computing)" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">Load balancing</span><span class="lc-sub">wikipedia.org · Why "fewest connections" beats "next in line" under uneven load</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Running several identical backends, and why their addresses change</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Run three backends that name themselves and count the distribution yourself</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Khối upstream và bốn cách chọn máy</h2>
<p class="lead">Một backend là một lệnh <code>proxy_pass</code> tới một địa chỉ. NHIỀU backend là một khối <code>upstream</code>, và quyết định thật sự duy nhất bên trong nó là: Nginx CHỌN máy nào cho request tiếp theo.</p>

<h3>Bốn thuật toán, mỗi cái ba mươi request, đem đếm</h3>
<pre><code>upstream deu      {              server ...9501; server ...9502; server ...9503; }
upstream trongso  {              server ...9501 weight=3; server ...9502 weight=1; }
upstream itketnoi { least_conn;  server ...9501; server ...9502; server ...9503; }
upstream theoip   { ip_hash;     server ...9501; server ...9502; server ...9503; }</code></pre>
<div class="out">30 request, dem xem may nao tra loi:

  round-robin (mac dinh) : may-1=10  may-2=10  may-3=10
  weight 3:1             : may-1=23  may-2=7
  least_conn             : may-1=10  may-2=10  may-3=10
  ip_hash (tu MOT IP)    : may-3=30
                            ^^^^^^^ ca 30 vao MOT may. Dung nhu thiet ke.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Round robin là mặc định và nó ĐỀU</span><span class="lz-d">Mười cái mỗi máy, chính xác. Không cấu hình, không trạng thái, không bất ngờ — và nó là lựa chọn ĐÚNG bất cứ khi nào máy nào cũng phục vụ được request nào, tức là phần lớn thời gian.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">weight= đổi TỶ LỆ, không đổi cơ chế</span><span class="lz-d">23 trên 7 so với cấu hình 3 trên 1, tức 22,5 trên 7,5 làm tròn theo chỗ cái vòng tình cờ dừng lại. Hãy dùng nó khi máy móc khác cỡ nhau, đừng dùng nó để RÚT lưu lượng — <code>down</code> mới làm việc đó tử tế.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">least_conn trông y hệt ở đây, và điều đó là ĐÚNG ĐẮN</span><span class="lz-d">Với phản hồi chỉ vài mili giây thì chẳng máy nào có hàng đợi cả, nên "ít kết nối nhất" và "tới lượt ai" đồng ý với nhau. Nó KHÁC đi khi thời lượng request chênh nhau nhiều — một hỗn hợp giữa đọc nhanh và báo cáo chậm đúng là chỗ nó xứng đáng có mặt.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">ip_hash gửi mọi thứ vào MỘT máy, và đó là ĐÚNG</span><span class="lz-d">Cả ba mươi request đều tới từ MỘT địa chỉ, mà <code>ip_hash</code> thì ánh xạ một địa chỉ tới một backend. Từ MỘT client thì nó phải trông như thế. Từ hàng nghìn client thì nó trải ra — và Bài 9.2 đo xem nó làm gì khi cái bể máy chủ THAY ĐỔI.</span></div>
</div>

<h3>Chính cái khối upstream</h3>
<pre><code>upstream api {
  server 10.0.1.11:3000  weight=2;          <span class="tok-comment"># máy khoẻ hơn, nhận nhiều hơn</span>
  server 10.0.1.12:3000;
  server 10.0.1.13:3000  backup;            <span class="tok-comment"># CHỈ dùng khi máy chính chết hết</span>
  server 10.0.1.14:3000  down;              <span class="tok-comment"># rút ra khỏi vòng, không xoá dòng</span>

  keepalive 32;                             <span class="tok-comment"># tái dùng kết nối — Bài 9.4</span>
}

server {
  location /api/ {
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_pass http://api/;                 <span class="tok-comment"># tên khối, không phải địa chỉ</span>
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">down giữ lại cái dòng và rút cái máy ra</span><span class="v">Tốt hơn là xoá hẳn dòng <code>server</code>: cấu hình vẫn ghi lại rằng cái máy đó TỒN TẠI, và đưa nó trở lại là một diff MỘT chữ. Đây là cách bạn rút một node ra trước khi bảo trì.</span></div>
  <div class="kv"><span class="k">Một upstream có tên thì phân giải lại DNS lúc NẠP LẠI, không phải mỗi request</span><span class="v">Vẫn cái luật ở Bài 3.1. Nếu backend của bạn là container mà địa chỉ hay đổi thì một tên miền trần được phân giải MỘT lần lúc khởi động rồi cũ mãi mãi. Cách chữa là một <code>resolver</code> cộng một BIẾN trong <code>proxy_pass</code>, thứ ép nó phân giải lại.</span></div>
  <div class="kv"><span class="k">Một upstream dùng được cho NHIỀU location</span><span class="v">Và mỗi location có timeout, cách đệm và cách cache riêng khi làm việc với nó. Cái upstream là BỂ; cái location là CHÍNH SÁCH.</span></div>
  <div class="kv"><span class="k">Khối này thuộc về tầng http</span><span class="v">Không nằm trong <code>server</code>. Chính điều đó cho phép nhiều khối server dùng chung MỘT bể — và một bể nghĩa là MỘT cái nhìn chung về việc backend nào đang hỏng, điều rất có nghĩa lý ở Bài 9.3.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — round robin cân bằng số REQUEST, không cân bằng KHỐI LƯỢNG CÔNG VIỆC, và hai thứ đó không giống nhau.</strong> Ba backend mỗi cái nhận mười request thì TRÔNG cân bằng, và đúng là cân bằng — cho tới khi một trong những request đó là một cái báo cáo mất ba mươi giây còn hai mươi chín cái kia là những lượt đọc 5ms. Cái máy bốc trúng cái chậm giờ đang nghẹt trong khi đồng đội của nó ngồi chơi, và round robin vẫn cứ đều đặn dúi cho nó phần của nó. <code>least_conn</code> là cách chữa trực tiếp: nó đếm cái ĐANG BAY chứ không đếm cái ĐÃ GỬI. Phép đo ở trên KHÔNG cho thấy khác biệt được vì mọi phản hồi đều nhanh như nhau, mà đó ĐÚNG là điều kiện để hai thuật toán đồng ý với nhau — nên đừng từ một phép đo bằng phẳng mà kết luận rằng lựa chọn này không quan trọng.</p>
</div>

<h3>Chọn giữa chúng thế nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Round robin — backend không trạng thái, request đồng đều</span><span class="lz-lnote">Là mặc định, và đúng với phần lớn API. Nếu máy nào cũng phục vụ được request nào trong khoảng thời gian xấp xỉ nhau thì chẳng có gì để cải thiện.</span></div>
  <div class="lz-layer"><span class="lz-lname">least_conn — thời lượng request pha trộn</span><span class="lz-lnote">Bất cứ chỗ nào có vài điểm cuối chậm hơn hẳn những cái khác. Nó chẳng tốn gì và nó thoái hoá thành round robin khi thời lượng đồng đều, nên nó là một mặc định AN TOÀN nếu bạn không chắc.</span></div>
  <div class="lz-layer"><span class="lz-lname">ip_hash hay hash — khi một client PHẢI luôn vào một máy</span><span class="lz-lnote">Phiên lưu trong bộ nhớ, một bộ đệm theo từng kết nối, một WebSocket phải nối lại đúng node cũ. Bài 9.2 lo hai dạng ấy và khác biệt giữa chúng, thứ lớn hơn vẻ ngoài rất nhiều.</span></div>
  <div class="lz-layer"><span class="lz-lname">random two — bể RẤT lớn</span><span class="lz-lnote"><code>random two least_conn;</code> bốc ngẫu nhiên HAI máy rồi lấy cái ít tải hơn trong cặp đó. Với hàng chục backend thì nó xấp xỉ <code>least_conn</code> mà không phải giữ sổ sách, và nó tránh được hiện tượng dồn cục mà <code>least_conn</code> thuần có thể gây ra khi một node mới gia nhập.</span></div>
</div>
<div class="note-ct">
<p><strong>Kiểm phân bố trên hệ thống của chính bạn thế nào.</strong> Hãy cho mỗi backend đặt TÊN của nó vào một header phản hồi — <code>add_header X-May-Chu "may-1";</code> hoặc thứ tương đương trong ứng dụng của bạn — rồi gửi vài trăm request và ĐẾM. Đúng một cái header đó biến MỌI câu hỏi trong chương này thành một thí nghiệm, và nó đáng giữ VĨNH VIỄN: khi có thứ gì cư xử lạ với một số người mà không lạ với người khác thì sự thật hữu ích đầu tiên là họ đã tới máy nào.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html" target="_blank" rel="noopener"><span class="lc-ico">🏭</span><span class="lc-body"><span class="lc-title">nginx — module upstream</span><span class="lc-sub">nginx.org · Mọi tham số của server, và tất cả các phương pháp cân bằng</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/load_balancing.html" target="_blank" rel="noopener"><span class="lc-ico">⚖️</span><span class="lc-body"><span class="lc-title">nginx — Cân bằng tải HTTP</span><span class="lc-sub">nginx.org · Bài hướng dẫn nhập môn, với đúng bốn phương pháp ấy</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Load_balancing_(computing)" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">Cân bằng tải</span><span class="lc-sub">wikipedia.org · Vì sao "ít kết nối nhất" thắng "tới lượt ai" khi tải không đồng đều</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Chạy nhiều backend giống hệt nhau, và vì sao địa chỉ của chúng cứ đổi</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Chạy ba backend biết tự xưng tên rồi tự tay đếm phân bố</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — Sticky routing, and the word that saves 47% of your users|||9.2 — Định tuyến dính, và cái chữ cứu được 47% người dùng của bạn',
      slug: 'nginx-9-2-dinh-tuyen-dinh',
      type: 'LESSON',
      description: 'Thêm MỘT máy vào một bể ba máy. Với hash thường, 73% người dùng bị đổi máy. Với thêm chữ consistent, chỉ 26% — sát con số lý thuyết tối thiểu. Bài này đo cả hai, và cũng đo một chuyện mà cả hai làm GIỐNG nhau, điều đó cũng đáng ngạc nhiên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Sticky routing, and the word that saves 47% of your users</h2>
<p class="lead">Sometimes a client has to keep reaching the same backend — an in-memory session, a per-node cache, a WebSocket that reconnects. Nginx offers two ways to arrange that, they differ by one word, and the difference is measurable in exactly the moment it matters.</p>

<h3>Both forms pin a client, measured</h3>
<pre><code>upstream bam_thuong { hash \$arg_nguoi;            server 9501; server 9502; server 9503; }
upstream bam_bien   { hash \$arg_nguoi consistent; server 9501; server 9502; server 9503; }</code></pre>
<div class="out">Moi "nguoi dung" goi ba lan lien tiep:

  nguoi=an     -> may-3  may-3  may-3
  nguoi=binh   -> may-1  may-1  may-1
  nguoi=cuong  -> may-2  may-2  may-2
  nguoi=dung   -> may-2  may-2  may-2

Ca hai dang deu GHIM on dinh. Khac biet chi lo ra khi be MAY CHU doi.</div>

<h3>Add one machine to a pool of three</h3>
<div class="out">60 "nguoi dung", ghi lai anh xa TRUOC va SAU khi them may-4 roi nap lai:

  ly thuyet toi thieu: ~25% phai doi (1 trong 4 cho)

  hash thuong     : 44/60 doi may   = 73%
  hash consistent : 16/60 doi may   = 26%
                    ^^^^^^^^^^^^^ sat con so ly thuyet</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Plain hash is key modulo pool size</span><span class="lz-d">Change the pool size and almost every key lands somewhere new — 73% here. With sessions in memory, that is 73% of logged-in users logged out at once, on a deploy that added capacity.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">consistent places servers on a ring instead</span><span class="lz-d">Each key belongs to the next server clockwise. Adding a server only steals the arc in front of it, so only the keys in that arc move — 26%, against a theoretical minimum of 25%.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The word costs nothing and is not the default</span><span class="lz-d">Every argument favours it and it is one word, and yet <code>hash \$x;</code> without it is what most configs contain — usually because the difference is invisible until the day you scale the pool.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It is the same algorithm as memcached's ketama</span><span class="lz-d">Which is why Nginx uses that name in the docs. If you have ever configured a distributed cache, this is the setting you already know under a different name.</span></div>
</div>

<h3>And the thing both forms do identically</h3>
<div class="out">GIET may-3, roi do lai anh xa cua 60 nguoi dung:

  trong 39 nguoi VON KHONG o may-3 (hash thuong)     : 0 nguoi bi doi may (0%)
  trong 41 nguoi VON KHONG o may-3 (hash consistent) : 0 nguoi bi doi may (0%)</div>
<div class="callout ok">
<p><strong>A failed server does not reshuffle anybody else, in either mode.</strong> That is worth knowing because it is the opposite of what the consistent-hashing story leads you to expect. Nginx marks a failed server unavailable but keeps its position in the ring, so only the clients pinned to that server are redistributed and everyone else is untouched. The <code>consistent</code> flag matters when the server <em>list</em> changes — a config edit and a reload — not when a machine simply goes down. Both events feel like "we lost a backend"; only one of them reshuffles your users.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>ip_hash</code> keys on the client address, which is the wrong key more often than it looks.</strong> Everyone behind one corporate NAT or one mobile carrier gateway shares an address and therefore a backend, so a "balanced" pool can be badly skewed by a few large networks. Worse, a client whose address changes — moving from wifi to mobile data — is silently reassigned and loses its session mid-use. And behind a CDN or a load balancer, <code>\$remote_addr</code> is the proxy's address (Lesson 3.2), so <code>ip_hash</code> maps <em>everyone</em> to one backend unless <code>real_ip</code> is configured first. Prefer <code>hash \$cookie_phien consistent;</code> or <code>hash \$http_x_api_key consistent;</code> — key on something that identifies the client rather than its current network position.</p>
</div>
<pre><code><span class="tok-comment"># Ghim theo PHIÊN, không ghim theo địa chỉ mạng</span>
upstream api {
  hash \$cookie_phien consistent;
  server 10.0.1.11:3000;
  server 10.0.1.12:3000;
  server 10.0.1.13:3000;
}

<span class="tok-comment"># Và cách TỐT HƠN CẢ: đừng cần ghim gì cả</span>
<span class="tok-comment">#   phiên nằm trong Redis hoặc trong một JWT đã ký</span>
<span class="tok-comment">#   -> mọi máy phục vụ được mọi request -> round robin, không trạng thái</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Sticky routing is a workaround, not an architecture</span><span class="v">Every one of its problems — uneven distribution, sessions lost on scale-out, a node that cannot be drained without logging people out — disappears if the state lives somewhere shared. Reach for it when you cannot change the application, and treat it as debt.</span></div>
  <div class="kv"><span class="k">An empty key sends the request to round robin</span><span class="v">A user with no session cookie yet has an empty <code>\$cookie_phien</code>, and Nginx falls back to normal balancing for them. That is the correct behaviour and it means the first request of a session is not pinned — which is fine, because the backend that handles it is the one that sets the cookie.</span></div>
  <div class="kv"><span class="k">Draining a node still moves its users</span><span class="v">Marking a server <code>down</code> and reloading is a list change, so its keys are redistributed. With <code>consistent</code> only those keys move; without it, most of the pool moves. This is the maintenance window where the one word pays for itself.</span></div>
  <div class="kv"><span class="k">The commercial version has real sticky cookies</span><span class="v">NGINX Plus can set and read its own cookie, which survives address changes and pool edits properly. In open-source Nginx, <code>hash ... consistent</code> on a session cookie is the closest equivalent and it is good enough for most cases.</span></div>
</div>
<div class="note-ct">
<p><strong>How to measure this on your own pool.</strong> Have the backend return its name in a header, then request the same URL a few hundred times with a fixed session cookie and confirm you always land on one machine. Then change the pool — add a server, reload — and repeat with the same cookies. The proportion that moved is the number this lesson is about, and it takes about a minute to produce against a real config.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#hash" target="_blank" rel="noopener"><span class="lc-ico">#️⃣</span><span class="lc-body"><span class="lc-title">nginx — hash and ip_hash</span><span class="lc-sub">nginx.org · The consistent parameter and the ketama reference</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Consistent_hashing" target="_blank" rel="noopener"><span class="lc-ico">⭕</span><span class="lc-body"><span class="lc-title">Consistent hashing</span><span class="lc-sub">wikipedia.org · Why the ring gives you K/n remapping instead of nearly all of it</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — HTTP cookies</span><span class="lc-sub">developer.mozilla.org · What a session cookie is and when it is absent</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">Shared session storage, which removes the need for any of this</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Map sixty users, add a fourth backend, and count how many moved in each mode</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Định tuyến dính, và cái chữ cứu được 47% người dùng của bạn</h2>
<p class="lead">Đôi khi một client BẮT BUỘC phải luôn chạm tới cùng một backend — một phiên nằm trong bộ nhớ, một bộ đệm theo từng node, một WebSocket phải nối lại. Nginx cho bạn hai cách để sắp xếp chuyện đó, chúng khác nhau đúng MỘT chữ, và khác biệt ấy đo được đúng vào cái lúc nó có nghĩa lý.</p>

<h3>Cả hai dạng đều GHIM được client, đo thật</h3>
<pre><code>upstream bam_thuong { hash \$arg_nguoi;            server 9501; server 9502; server 9503; }
upstream bam_bien   { hash \$arg_nguoi consistent; server 9501; server 9502; server 9503; }</code></pre>
<div class="out">Moi "nguoi dung" goi ba lan lien tiep:

  nguoi=an     -> may-3  may-3  may-3
  nguoi=binh   -> may-1  may-1  may-1
  nguoi=cuong  -> may-2  may-2  may-2
  nguoi=dung   -> may-2  may-2  may-2

Ca hai dang deu GHIM on dinh. Khac biet chi lo ra khi be MAY CHU doi.</div>

<h3>Thêm MỘT máy vào một bể ba máy</h3>
<div class="out">60 "nguoi dung", ghi lai anh xa TRUOC va SAU khi them may-4 roi nap lai:

  ly thuyet toi thieu: ~25% phai doi (1 trong 4 cho)

  hash thuong     : 44/60 doi may   = 73%
  hash consistent : 16/60 doi may   = 26%
                    ^^^^^^^^^^^^^ sat con so ly thuyet</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">hash thường là khoá CHIA DƯ cho số máy</span><span class="lz-d">Đổi số máy là gần như MỌI khoá rơi vào chỗ mới — 73% ở đây. Với phiên nằm trong bộ nhớ thì đó là 73% người đang đăng nhập bị đá ra CÙNG một lúc, trong một lần deploy vốn chỉ định THÊM năng lực.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">consistent đặt các máy chủ lên một VÒNG TRÒN</span><span class="lz-d">Mỗi khoá thuộc về máy chủ kế tiếp theo chiều kim đồng hồ. Thêm một máy chỉ CƯỚP mất cái cung nằm ngay trước nó, nên chỉ những khoá trong cung đó phải dời — 26%, so với mức lý thuyết tối thiểu là 25%.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cái chữ ấy chẳng tốn gì và nó KHÔNG phải mặc định</span><span class="lz-d">Mọi lý lẽ đều nghiêng về nó và nó chỉ là MỘT chữ, thế mà <code>hash \$x;</code> không kèm nó lại là thứ nằm trong phần lớn các cấu hình — thường là vì khác biệt VÔ HÌNH cho tới đúng cái ngày bạn mở rộng cái bể.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó là cùng thuật toán với ketama của memcached</span><span class="lz-d">Và đó là lý do Nginx dùng chính cái tên ấy trong tài liệu. Nếu bạn từng cấu hình một bộ đệm phân tán thì đây chính là thiết lập bạn đã biết dưới một cái tên khác.</span></div>
</div>

<h3>Và cái việc mà CẢ HAI dạng làm GIỐNG HỆT nhau</h3>
<div class="out">GIET may-3, roi do lai anh xa cua 60 nguoi dung:

  trong 39 nguoi VON KHONG o may-3 (hash thuong)     : 0 nguoi bi doi may (0%)
  trong 41 nguoi VON KHONG o may-3 (hash consistent) : 0 nguoi bi doi may (0%)</div>
<div class="callout ok">
<p><strong>Một máy chủ CHẾT thì KHÔNG xáo trộn ai khác cả, ở cả hai dạng.</strong> Điều đó đáng biết vì nó NGƯỢC với thứ mà câu chuyện về consistent hashing khiến bạn chờ đợi. Nginx đánh dấu một máy chủ hỏng là không dùng được nhưng GIỮ NGUYÊN vị trí của nó trên vòng, nên chỉ những client bị ghim vào máy đó mới được phân phối lại còn mọi người khác không hề bị đụng tới. Cái cờ <code>consistent</code> có nghĩa lý khi DANH SÁCH máy chủ thay đổi — một lần sửa cấu hình và nạp lại — chứ không phải khi một cái máy chỉ đơn giản là ngã xuống. Cả hai sự kiện đều cảm thấy như "mình vừa mất một backend"; chỉ MỘT trong hai xáo trộn người dùng của bạn.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>ip_hash</code> khoá theo ĐỊA CHỈ của client, mà đó là cái khoá SAI nhiều hơn vẻ ngoài.</strong> Mọi người nằm sau một cái NAT công ty hay một cổng của nhà mạng di động đều dùng chung một địa chỉ và do đó dùng chung một backend, nên một cái bể "cân bằng" có thể lệch nặng chỉ vì vài mạng lớn. Tệ hơn, một client có địa chỉ THAY ĐỔI — chuyển từ wifi sang 4G — sẽ bị gán lại trong im lặng và mất phiên giữa chừng. Và khi đứng sau một CDN hay một bộ cân bằng tải thì <code>\$remote_addr</code> là địa chỉ của con proxy (Bài 3.2), nên <code>ip_hash</code> ánh xạ TẤT CẢ vào một backend trừ khi <code>real_ip</code> đã được cấu hình trước. Hãy ưu tiên <code>hash \$cookie_phien consistent;</code> hoặc <code>hash \$http_x_api_key consistent;</code> — khoá theo thứ ĐỊNH DANH client chứ đừng khoá theo vị trí mạng hiện tại của họ.</p>
</div>
<pre><code><span class="tok-comment"># Ghim theo PHIÊN, không ghim theo địa chỉ mạng</span>
upstream api {
  hash \$cookie_phien consistent;
  server 10.0.1.11:3000;
  server 10.0.1.12:3000;
  server 10.0.1.13:3000;
}

<span class="tok-comment"># Và cách TỐT HƠN CẢ: đừng cần ghim gì cả</span>
<span class="tok-comment">#   phiên nằm trong Redis hoặc trong một JWT đã ký</span>
<span class="tok-comment">#   -> mọi máy phục vụ được mọi request -> round robin, không trạng thái</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Định tuyến dính là một cách LÁCH, không phải một kiến trúc</span><span class="v">Mọi vấn đề của nó — phân bố lệch, phiên mất khi mở rộng, một node không rút ra được mà không đá người ta đăng xuất — đều BIẾN MẤT nếu trạng thái sống ở một chỗ dùng chung. Hãy với tới nó khi bạn KHÔNG sửa được ứng dụng, và hãy coi nó là NỢ.</span></div>
  <div class="kv"><span class="k">Khoá RỖNG thì request rơi về round robin</span><span class="v">Một người dùng chưa có cookie phiên thì <code>\$cookie_phien</code> rỗng, và Nginx lùi về cân bằng bình thường cho họ. Đó là hành vi ĐÚNG và nó nghĩa là request ĐẦU TIÊN của một phiên thì không bị ghim — mà thế cũng ổn, vì chính cái backend xử lý nó là cái đặt ra cookie.</span></div>
  <div class="kv"><span class="k">Rút một node ra thì VẪN dời người dùng của nó</span><span class="v">Đánh dấu một máy chủ là <code>down</code> rồi nạp lại là một thay đổi DANH SÁCH, nên các khoá của nó được phân phối lại. Có <code>consistent</code> thì CHỈ những khoá đó dời; không có thì phần lớn cái bể dời theo. Đây chính là cái cửa sổ bảo trì mà một chữ ấy tự trả tiền cho mình.</span></div>
  <div class="kv"><span class="k">Bản thương mại có cookie dính THẬT</span><span class="v">NGINX Plus tự đặt và tự đọc cookie của riêng nó, thứ sống sót qua cả việc đổi địa chỉ lẫn việc sửa bể một cách tử tế. Trong Nginx mã nguồn mở thì <code>hash ... consistent</code> trên một cookie phiên là thứ gần nhất và nó đủ tốt cho phần lớn trường hợp.</span></div>
</div>
<div class="note-ct">
<p><strong>Đo chuyện này trên bể của chính bạn thế nào.</strong> Cho backend trả TÊN của nó trong một header, rồi gọi cùng một URL vài trăm lần với một cookie phiên CỐ ĐỊNH và xác nhận bạn luôn rơi vào MỘT máy. Rồi ĐỔI cái bể — thêm một máy chủ, nạp lại — và lặp lại với đúng đám cookie đó. Tỷ lệ đã dời chính là con số mà bài này nói về nó, và nó tốn chừng một phút để tạo ra trên một cấu hình thật.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#hash" target="_blank" rel="noopener"><span class="lc-ico">#️⃣</span><span class="lc-body"><span class="lc-title">nginx — hash và ip_hash</span><span class="lc-sub">nginx.org · Tham số consistent và phần dẫn chiếu tới ketama</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Consistent_hashing" target="_blank" rel="noopener"><span class="lc-ico">⭕</span><span class="lc-body"><span class="lc-title">Consistent hashing</span><span class="lc-sub">wikipedia.org · Vì sao cái vòng cho bạn K/n phải dời thay vì gần như tất cả</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — Cookie HTTP</span><span class="lc-sub">developer.mozilla.org · Cookie phiên là gì và khi nào nó VẮNG mặt</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Lưu phiên ở chỗ dùng chung, thứ xoá bỏ nhu cầu về tất cả những chuyện này</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Ánh xạ sáu mươi người dùng, thêm backend thứ tư, rồi đếm xem mỗi dạng dời mất bao nhiêu</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — When a backend dies: thirty requests, zero errors|||9.3 — Khi một backend chết: ba mươi request, không lỗi nào',
      slug: 'nginx-9-3-khi-backend-chet',
      type: 'LESSON',
      description: 'Giết một máy trong ba giữa lúc đang chạy rồi bắn ba mươi request. Không client nào nhận 502. Bài này đo chuyện đó, đo luôn cả việc máy ấy được đưa trở lại sau đúng bao lâu, và chỉ ra cái phép kiểm sức khoẻ mà Nginx bản mã nguồn mở KHÔNG có.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>When a backend dies: thirty requests, zero errors</h2>
<p class="lead">A pool of backends is only worth having if losing one is invisible. Nginx does that without any health-check configuration at all, using a mechanism that is easy to misread — so this lesson kills a process mid-flight and counts what the clients received.</p>

<h3>Kill one of three, keep sending</h3>
<div class="out">Truoc khi giet, 30 request:  may-1=10  may-2=10  may-3=10

... kill may-2 ...

Sau khi giet, 30 request:   may-1=15  may-3=15
                            ^^^^^^^^^^^^^^^^^^ khong co 502 nao

error.log:  1 x connect() failed
            1 x upstream server temporarily disabled</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The first request to the dead server fails and is retried</span><span class="lz-d">Nginx opens a connection, gets refused, and reissues the same request to the next server in the pool. The client sees one response and never learns any of this happened — which is why the count is 15 and 15 rather than 15, 15 and one error.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Then the server is marked unavailable</span><span class="lz-d">One error log line: <code>upstream server temporarily disabled</code>. After that no further requests are even attempted against it, so the retry cost is paid once, not once per request.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">This is passive health checking, and it is the default</span><span class="lz-d"><code>max_fails=1 fail_timeout=10s</code> without writing anything. One failure within the window takes a server out for ten seconds. No probes, no extra traffic, no configuration.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Retries are bounded by proxy_next_upstream_tries</span><span class="lz-d">Otherwise a request could walk the entire pool. The default is unlimited within <code>proxy_next_upstream_timeout</code>, which is fine for a small pool and worth capping for a large one.</span></div>
</div>

<h3>How it comes back</h3>
<div class="out">... khoi dong lai may-2 ...

  NGAY sau khi song lai, 30 request : may-1=15  may-3=15
                                      ^ van chua duoc dung
  sau 11 giay (fail_timeout 10s)    : may-1=10  may-2=9  may-3=11
                                      ^ da tro lai vong quay</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Recovery is a timer, not a probe</span><span class="v">Nginx does not check whether the server came back — it simply tries again after <code>fail_timeout</code>. That is why the machine sat idle for eleven seconds after it was already healthy, and why a very long <code>fail_timeout</code> keeps capacity out of rotation longer than necessary.</span></div>
  <div class="kv"><span class="k">The first request after the window is the probe</span><span class="v">If it fails, the server is marked down again for another <code>fail_timeout</code>. So one unlucky client pays the retry cost every ten seconds while a backend stays broken — bounded, but not free.</span></div>
  <div class="kv"><span class="k">max_fails=1 is aggressive and usually right</span><span class="v">One failure removes the server. Raising it to 3 tolerates transient errors at the cost of three failed attempts before acting. For a backend that either works or does not, 1 is correct; for a flaky network path, higher.</span></div>
  <div class="kv"><span class="k">Active health checks are a commercial feature</span><span class="v">The <code>health_check</code> directive — probing <code>/health</code> on a schedule, independent of traffic — is NGINX Plus only. In open-source Nginx the passive mechanism above is what you have, and for most deployments it is sufficient.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>proxy_next_upstream</code> retries by default on <code>error</code> and <code>timeout</code>, and a timeout can mean the request already succeeded.</strong> If a backend received a <code>POST</code>, processed it, and was killed before answering, Nginx sees a timeout and reissues the identical request to another server — which processes it again. The order is placed twice, the email is sent twice, the charge happens twice. The defence is to not retry non-idempotent requests: <code>proxy_next_upstream error timeout non_idempotent;</code> is the <em>dangerous</em> form that opts in, and leaving <code>non_idempotent</code> out — the default — means <code>POST</code>, <code>PATCH</code> and <code>LOCK</code> are not retried after a request has been sent. Check that nobody added it to your config "to improve reliability", because it does the opposite for anything that writes.</p>
</div>
<pre><code>upstream api {
  server 10.0.1.11:3000  max_fails=2 fail_timeout=5s;
  server 10.0.1.12:3000  max_fails=2 fail_timeout=5s;
  server 10.0.1.13:3000  backup;          <span class="tok-comment"># chỉ dùng khi hai máy trên chết hết</span>
  keepalive 32;
}

location /api/ {
  proxy_next_upstream         error timeout http_502 http_503 http_504;
  <span class="tok-comment"># KHÔNG có non_idempotent -> POST không bị gửi lại</span>
  proxy_next_upstream_tries   2;
  proxy_next_upstream_timeout 5s;
  proxy_connect_timeout       2s;          <span class="tok-comment"># hỏng nhanh thì chuyển máy nhanh</span>
  proxy_pass http://api/;
}</code></pre>
<div class="out">=== backup: do that ===
ca hai may chinh song, 20 request : may-2=20        (may-3 backup KHONG duoc dung)
giet may-2 (chinh),   20 request : may-3=20        (backup vao cuoc)</div>

<h3>What the pool cannot save you from</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A backend that answers wrongly</span><span class="lz-lnote">Passive checks only see connection failures and the status codes you list. A server returning <code>200</code> with empty data, or serving a stale build, stays in rotation forever. Only an active health check that inspects the body catches that, and open-source Nginx does not have one.</span></div>
  <div class="lz-layer"><span class="lz-lname">All backends failing at once</span><span class="lz-lnote">A bad deploy, a shared database outage. The error log says <code>no live upstreams</code> and every client gets <code>502</code>. This is where <code>proxy_cache_use_stale</code> from Lesson 5.5 is worth more than the pool itself.</span></div>
  <div class="lz-layer"><span class="lz-lname">A slow backend, as opposed to a dead one</span><span class="lz-lnote">It passes every check and drags every request that lands on it. <code>least_conn</code> reduces its share automatically because its connections stay open — one of the strongest arguments for that algorithm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Each Nginx instance has its own view</span><span class="lz-lnote">Two proxies in front of the same pool track failures independently, so one may still be sending traffic to a backend the other has taken out. That is usually harmless and occasionally confusing when you are reading two sets of logs.</span></div>
</div>
<div class="note-ct">
<p><strong>Test it before you need it.</strong> Kill a backend while a request loop is running and count what the clients got. Thirty requests and zero errors is what a healthy pool looks like; anything else means the retry path is misconfigured, and finding that out during an incident is much more expensive than finding it out on a Tuesday.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server" target="_blank" rel="noopener"><span class="lc-ico">💔</span><span class="lc-body"><span class="lc-title">nginx — max_fails, fail_timeout, backup, down</span><span class="lc-sub">nginx.org · The passive health-check parameters, on the server directive</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream" target="_blank" rel="noopener"><span class="lc-ico">➡️</span><span class="lc-body"><span class="lc-title">nginx — proxy_next_upstream</span><span class="lc-sub">nginx.org · Every condition, and the non_idempotent warning</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Glossary/Idempotent" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">MDN — Idempotent</span><span class="lc-sub">developer.mozilla.org · Which methods are safe to retry and why POST is not</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Idempotency keys, so a retried write is safe even when it happens</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Kill a backend mid-loop, count the errors, then time how long recovery takes</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Khi một backend chết: ba mươi request, không lỗi nào</h2>
<p class="lead">Một bể backend chỉ đáng có nếu MẤT một cái là chuyện VÔ HÌNH. Nginx làm được điều đó mà không cần cấu hình một phép kiểm sức khoẻ nào, bằng một cơ chế rất dễ đọc nhầm — nên bài này GIẾT một tiến trình giữa lúc đang chạy rồi đếm xem client nhận được gì.</p>

<h3>Giết một trong ba, cứ tiếp tục gửi</h3>
<div class="out">Truoc khi giet, 30 request:  may-1=10  may-2=10  may-3=10

... kill may-2 ...

Sau khi giet, 30 request:   may-1=15  may-3=15
                            ^^^^^^^^^^^^^^^^^^ khong co 502 nao

error.log:  1 x connect() failed
            1 x upstream server temporarily disabled</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Request ĐẦU TIÊN tới máy đã chết thì hỏng và được THỬ LẠI</span><span class="lz-d">Nginx mở một kết nối, bị từ chối, rồi phát lại ĐÚNG request đó tới máy kế tiếp trong bể. Client nhìn thấy MỘT phản hồi và không bao giờ biết chuyện này đã xảy ra — đó là lý do bảng đếm là 15 và 15 chứ không phải 15, 15 và một cái lỗi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Rồi cái máy đó bị đánh dấu là KHÔNG DÙNG ĐƯỢC</span><span class="lz-d">Một dòng error log: <code>upstream server temporarily disabled</code>. Sau đó thì KHÔNG request nào còn được thử với nó nữa, nên cái giá của việc thử lại chỉ trả MỘT lần, không phải mỗi request một lần.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đây là kiểm sức khoẻ THỤ ĐỘNG, và nó là mặc định</span><span class="lz-d"><code>max_fails=1 fail_timeout=10s</code> mà không phải viết gì cả. MỘT lần hỏng trong cửa sổ đó là rút cái máy ra mười giây. Không thăm dò, không lưu lượng thừa, không cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Số lần thử lại bị chặn bởi proxy_next_upstream_tries</span><span class="lz-d">Không thì một request có thể đi hết cả cái bể. Mặc định là KHÔNG giới hạn trong phạm vi <code>proxy_next_upstream_timeout</code>, và thế thì ổn với một bể nhỏ nhưng đáng đặt trần với một bể lớn.</span></div>
</div>

<h3>Nó quay lại thế nào</h3>
<div class="out">... khoi dong lai may-2 ...

  NGAY sau khi song lai, 30 request : may-1=15  may-3=15
                                      ^ van chua duoc dung
  sau 11 giay (fail_timeout 10s)    : may-1=10  may-2=9  may-3=11
                                      ^ da tro lai vong quay</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Việc hồi phục là một CÁI HẸN GIỜ, không phải một phép thăm dò</span><span class="v">Nginx KHÔNG kiểm xem máy chủ đã quay lại chưa — nó chỉ đơn giản là THỬ LẠI sau <code>fail_timeout</code>. Đó là lý do cái máy ngồi chơi mười một giây dù nó đã khoẻ từ trước, và là lý do một <code>fail_timeout</code> rất dài giữ năng lực nằm ngoài vòng quay lâu hơn mức cần thiết.</span></div>
  <div class="kv"><span class="k">Request ĐẦU TIÊN sau cửa sổ ấy chính là phép thăm dò</span><span class="v">Nếu nó hỏng thì máy chủ lại bị đánh dấu chết thêm một <code>fail_timeout</code> nữa. Nên cứ mười giây lại có MỘT client xui xẻo trả cái giá thử lại trong khi backend còn hỏng — có chặn, nhưng không miễn phí.</span></div>
  <div class="kv"><span class="k">max_fails=1 là quyết liệt và thường là ĐÚNG</span><span class="v">Một lần hỏng là rút máy ra. Nâng lên 3 thì chịu đựng được lỗi thoáng qua, đổi lại là ba lần thử hỏng trước khi hành động. Với một backend kiểu chạy-hoặc-không thì 1 là đúng; với một đường mạng phập phù thì nên cao hơn.</span></div>
  <div class="kv"><span class="k">Kiểm sức khoẻ CHỦ ĐỘNG là tính năng thương mại</span><span class="v">Chỉ thị <code>health_check</code> — thăm dò <code>/health</code> theo lịch, độc lập với lưu lượng — chỉ có ở NGINX Plus. Trong Nginx mã nguồn mở thì cơ chế thụ động ở trên là thứ bạn có, và với phần lớn hệ thống thì nó đủ.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — <code>proxy_next_upstream</code> mặc định thử lại khi gặp <code>error</code> và <code>timeout</code>, mà một cú timeout có thể nghĩa là request ĐÃ THÀNH CÔNG rồi.</strong> Nếu một backend nhận một cú <code>POST</code>, xử lý xong, rồi bị giết TRƯỚC khi kịp trả lời, thì Nginx nhìn thấy một cú timeout và phát lại ĐÚNG cái request đó tới một máy khác — và máy đó xử lý nó LẦN NỮA. Đơn hàng được đặt hai lần, email được gửi hai lần, tiền bị trừ hai lần. Cách phòng là ĐỪNG thử lại những request không idempotent: <code>proxy_next_upstream error timeout non_idempotent;</code> là dạng NGUY HIỂM tự nguyện bật lên, còn để <code>non_idempotent</code> ra ngoài — tức mặc định — nghĩa là <code>POST</code>, <code>PATCH</code> và <code>LOCK</code> KHÔNG bị gửi lại sau khi request đã được gửi đi. Hãy kiểm xem có ai đó đã thêm nó vào cấu hình của bạn "để tăng độ tin cậy" không, vì nó làm điều NGƯỢC LẠI với mọi thứ có ghi dữ liệu.</p>
</div>
<pre><code>upstream api {
  server 10.0.1.11:3000  max_fails=2 fail_timeout=5s;
  server 10.0.1.12:3000  max_fails=2 fail_timeout=5s;
  server 10.0.1.13:3000  backup;          <span class="tok-comment"># chỉ dùng khi hai máy trên chết hết</span>
  keepalive 32;
}

location /api/ {
  proxy_next_upstream         error timeout http_502 http_503 http_504;
  <span class="tok-comment"># KHÔNG có non_idempotent -> POST không bị gửi lại</span>
  proxy_next_upstream_tries   2;
  proxy_next_upstream_timeout 5s;
  proxy_connect_timeout       2s;          <span class="tok-comment"># hỏng nhanh thì chuyển máy nhanh</span>
  proxy_pass http://api/;
}</code></pre>
<div class="out">=== backup: do that ===
ca hai may chinh song, 20 request : may-2=20        (may-3 backup KHONG duoc dung)
giet may-2 (chinh),   20 request : may-3=20        (backup vao cuoc)</div>

<h3>Cái bể KHÔNG cứu bạn khỏi những gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một backend trả lời SAI</span><span class="lz-lnote">Kiểm thụ động chỉ nhìn thấy lỗi KẾT NỐI và những mã trạng thái bạn liệt kê. Một máy chủ trả <code>200</code> với dữ liệu rỗng, hay đang phục vụ một bản dựng cũ, sẽ nằm trong vòng quay MÃI MÃI. Chỉ một phép kiểm CHỦ ĐỘNG có soi cả phần thân mới bắt được, mà Nginx mã nguồn mở thì không có.</span></div>
  <div class="lz-layer"><span class="lz-lname">TẤT CẢ backend cùng hỏng một lúc</span><span class="lz-lnote">Một lần deploy hỏng, một sự cố cơ sở dữ liệu dùng chung. Error log nói <code>no live upstreams</code> và mọi client nhận <code>502</code>. Đây là chỗ <code>proxy_cache_use_stale</code> ở Bài 5.5 đáng giá hơn cả chính cái bể.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một backend CHẬM, khác với một backend CHẾT</span><span class="lz-lnote">Nó qua mọi phép kiểm và kéo lê mọi request rơi vào nó. <code>least_conn</code> TỰ ĐỘNG giảm phần của nó xuống vì các kết nối của nó cứ nằm mở — một trong những lý lẽ mạnh nhất cho thuật toán đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mỗi con Nginx có CÁI NHÌN RIÊNG của nó</span><span class="lz-lnote">Hai con proxy đứng trước cùng một bể theo dõi lỗi ĐỘC LẬP nhau, nên một con có thể vẫn đang gửi lưu lượng tới cái backend mà con kia đã rút ra. Thường thì vô hại và thỉnh thoảng gây rối khi bạn đang đọc hai bộ log.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy thử nó TRƯỚC khi cần tới nó.</strong> Giết một backend trong lúc một vòng lặp request đang chạy rồi đếm xem client nhận được gì. Ba mươi request và KHÔNG lỗi nào là bộ mặt của một cái bể khoẻ mạnh; bất cứ thứ gì khác nghĩa là đường thử-lại đang bị cấu hình sai, mà phát hiện ra điều đó GIỮA một sự cố thì đắt hơn nhiều so với phát hiện ra nó vào một ngày thứ Ba.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server" target="_blank" rel="noopener"><span class="lc-ico">💔</span><span class="lc-body"><span class="lc-title">nginx — max_fails, fail_timeout, backup, down</span><span class="lc-sub">nginx.org · Các tham số kiểm sức khoẻ thụ động, nằm trên chỉ thị server</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream" target="_blank" rel="noopener"><span class="lc-ico">➡️</span><span class="lc-body"><span class="lc-title">nginx — proxy_next_upstream</span><span class="lc-sub">nginx.org · Mọi điều kiện, và lời cảnh báo về non_idempotent</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Glossary/Idempotent" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">MDN — Idempotent</span><span class="lc-sub">developer.mozilla.org · Phương thức nào thử lại được và vì sao POST thì không</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Khoá idempotency, để một lượt ghi bị thử lại vẫn an toàn kể cả khi nó xảy ra</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Giết một backend giữa vòng lặp, đếm số lỗi, rồi bấm giờ xem hồi phục mất bao lâu</span></span></a>
</div>
`,
    },
  ],
};
