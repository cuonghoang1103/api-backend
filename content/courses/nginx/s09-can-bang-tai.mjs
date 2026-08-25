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
  server 10.0.1.11:3000  weight=2;          <span class="tok-comment"># a stronger box takes more</span>
  server 10.0.1.12:3000;
  server 10.0.1.13:3000  backup;            <span class="tok-comment"># used ONLY when every primary is dead</span>
  server 10.0.1.14:3000  down;              <span class="tok-comment"># pulled out of rotation without deleting the line</span>

  keepalive 32;                             <span class="tok-comment"># connection reuse — Lesson 9.4</span>
}

server {
  location /api/ {
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_pass http://api/;                 <span class="tok-comment"># the block name, not an address</span>
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">down keeps the line and takes the machine out</span><span class="v">Better than deleting the <code>server</code> line: the config still documents that the machine exists, and putting it back is a one-word diff. This is how you drain a node before maintenance.</span></div>
  <div class="kv"><span class="k">A named upstream re-resolves DNS on reload, not per request</span><span class="v">Same rule as Lesson 3.1. If your backends are containers with changing addresses, a bare hostname is resolved once at startup and then stale forever. The fix is a <code>resolver</code> plus a variable in <code>proxy_pass</code>, which forces re-resolution.</span></div>
  <div class="kv"><span class="k">One upstream can be used by many locations</span><span class="v">And each location can have its own timeouts, buffering and caching against it. The upstream is the pool; the location is the policy.</span></div>
  <div class="kv"><span class="k">The block belongs at http level</span><span class="v">Not inside <code>server</code>. That is what lets several server blocks share one pool — and one pool means one shared view of which backends are currently failing, which matters in Lesson 9.3.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — round robin balances <em>requests</em>, not work, and those are not the same thing.</strong> Three backends each getting ten requests looks balanced, and it is — until one of those requests is a report that takes thirty seconds and the other twenty-nine are 5ms reads. The machine that drew the slow one is now saturated while its peers are idle, and round robin will keep handing it its share regardless. <code>least_conn</code> is the direct fix: it counts what is in flight rather than what has been sent. The measurement above could not show the difference because every response was equally fast, which is exactly the condition under which the two algorithms agree — so do not conclude from a flat benchmark that the choice does not matter.</p>
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
<p><strong>Trap — <code>ip_hash</code> keys on the client address, which is the wrong key more often than it looks.</strong> Everyone behind one corporate NAT or one mobile carrier gateway shares an address and therefore a backend, so a "balanced" pool can be badly skewed by a few large networks. Worse, a client whose address changes — moving from wifi to mobile data — is silently reassigned and loses its session mid-use. And behind a CDN or a load balancer, <code>\$remote_addr</code> is the proxy's address (Lesson 3.2), so <code>ip_hash</code> maps <em>everyone</em> to one backend unless <code>real_ip</code> is configured first. Prefer <code>hash \$cookie_phien consistent;</code> or <code>hash \$http_x_api_key consistent;</code> — key on something that identifies the client rather than its current network position.</p>
</div>
<pre><code><span class="tok-comment"># Pin by SESSION, not by network address</span>
upstream api {
  hash \$cookie_phien consistent;
  server 10.0.1.11:3000;
  server 10.0.1.12:3000;
  server 10.0.1.13:3000;
}

<span class="tok-comment"># And the BEST way of all: do not need pinning at all</span>
<span class="tok-comment">#   the session lives in Redis or inside a signed JWT</span>
<span class="tok-comment">#   -> every box can serve every request -> round robin, stateless</span></code></pre>
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
<p><strong>Trap — <code>proxy_next_upstream</code> retries by default on <code>error</code> and <code>timeout</code>, and a timeout can mean the request already succeeded.</strong> If a backend received a <code>POST</code>, processed it, and was killed before answering, Nginx sees a timeout and reissues the identical request to another server — which processes it again. The order is placed twice, the email is sent twice, the charge happens twice. The defence is to not retry non-idempotent requests: <code>proxy_next_upstream error timeout non_idempotent;</code> is the <em>dangerous</em> form that opts in, and leaving <code>non_idempotent</code> out — the default — means <code>POST</code>, <code>PATCH</code> and <code>LOCK</code> are not retried after a request has been sent. Check that nobody added it to your config "to improve reliability", because it does the opposite for anything that writes.</p>
</div>
<pre><code>upstream api {
  server 10.0.1.11:3000  max_fails=2 fail_timeout=5s;
  server 10.0.1.12:3000  max_fails=2 fail_timeout=5s;
  server 10.0.1.13:3000  backup;          <span class="tok-comment"># used only when both boxes above are dead</span>
  keepalive 32;
}

location /api/ {
  proxy_next_upstream         error timeout http_502 http_503 http_504;
  <span class="tok-comment"># NO non_idempotent -> a POST is never resent</span>
  proxy_next_upstream_tries   2;
  proxy_next_upstream_timeout 5s;
  proxy_connect_timeout       2s;          <span class="tok-comment"># fail fast, move to another box fast</span>
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

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — 101 requests, one TCP connection|||9.4 — 101 request, một kết nối TCP',
      slug: 'nginx-9-4-tai-dung-ket-noi',
      type: 'LESSON',
      description: 'Một upstream biết ĐẾM số kết nối TCP nó nhận được. Không có keepalive: 101 request, 101 kết nối. Có keepalive cộng hai dòng nữa: 101 request tiếp theo chỉ tốn ĐÚNG MỘT kết nối mới. Bài này đo cái đó, và giải thích vì sao ba dòng ấy phải đi cùng nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>101 requests, one TCP connection</h2>
<p class="lead">Lesson 6.3 measured what a connection costs on the client side. The same waste happens between Nginx and your backends, on every request, by default — and the fix is three lines that must all be present together.</p>

<h3>An upstream that counts its own connections</h3>
<div class="out">Upstream dem ca REQUEST lan KET NOI TCP no nhan duoc.

  sau 100 request qua /dem-khong/ (KHONG keepalive):
     req=101  conn=101          &lt;- moi request MOT ket noi moi

  sau 100 request nua qua /dem-giu/ (CO keepalive):
     req=202  conn=102          &lt;- 101 request, DUNG MOT ket noi moi</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Without keepalive, Nginx opens and closes per request</span><span class="lz-d">A TCP handshake, a request, a response, a close — for every single call to your own backend on your own network. 101 connections for 101 requests, measured by the backend itself.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The cost is not just the handshake</span><span class="lz-d">Every closed connection leaves a socket in <code>TIME_WAIT</code> for around a minute. At a few thousand requests per second that is tens of thousands of sockets held on both machines, and eventually ephemeral port exhaustion — which fails as a connection error, not as a message saying you ran out of ports.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Three directives, and all three are required</span><span class="lz-d"><code>keepalive N</code> in the upstream block, <code>proxy_http_version 1.1</code> and <code>proxy_set_header Connection ""</code> in the location. Missing any one of them and the pool is silently unused — this is the most common way keepalive is configured and does nothing.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Why the empty Connection header</span><span class="lz-d">Lesson 3.2: by default Nginx sends <code>Connection: close</code> upstream, which tells the backend to hang up after answering. Setting it to the empty string removes the header entirely, so HTTP/1.1's default of keeping the connection alive applies.</span></div>
</div>
<pre><code>upstream api {
  server 10.0.1.11:3000;
  server 10.0.1.12:3000;

  keepalive          32;      <span class="tok-comment"># how many IDLE connections each worker keeps</span>
  keepalive_requests 1000;    <span class="tok-comment"># close and reopen after this many requests</span>
  keepalive_timeout  60s;     <span class="tok-comment"># close connections idle for too long</span>
}

location /api/ {
  proxy_http_version 1.1;          <span class="tok-comment"># BẮT BUỘC</span>
  proxy_set_header Connection "";  <span class="tok-comment"># BẮT BUỘC</span>
  proxy_pass http://api/;
}</code></pre>
<div class="pitfall">
<p><strong>Trap — <code>keepalive 32</code> is not "32 connections", it is 32 <em>idle</em> connections per worker, and getting that wrong sizes the pool badly in both directions.</strong> It is not a limit on concurrency: Nginx opens as many connections as it needs to serve requests, and <code>keepalive</code> only says how many to keep around when they go idle. It is also per worker process, so <code>keepalive 32</code> with <code>worker_processes 8</code> is up to 256 idle connections to that upstream from one machine. Set it too low and busy periods keep closing and reopening; set it too high and each backend holds hundreds of idle sockets it will never use. A reasonable starting point is your steady-state concurrency divided by the worker count, then check the backend's connection count against its request count — the ratio in the measurement above is what "working" looks like.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">keepalive_requests exists to avoid unbounded reuse</span><span class="v">Default 1000. A connection that is reused forever accumulates whatever state the two ends have, and it prevents a rebalanced pool from taking effect. Recycling on a counter is cheap insurance.</span></div>
  <div class="kv"><span class="k">The backend must also want to keep it alive</span><span class="v">Node's HTTP server closes idle connections after 5 seconds by default, which is shorter than Nginx's 60. The connection goes away, Nginx tries to reuse it, and you get an occasional <code>502</code>. Set the backend's keepalive timeout <em>higher</em> than Nginx's, not lower.</span></div>
  <div class="kv"><span class="k">The keepalive line must come last in the upstream block</span><span class="v">Documented, easy to miss, and Nginx does not warn: <code>keepalive</code> after the <code>server</code> lines. It works either way in current versions but the documentation specifies the order, and following it costs nothing.</span></div>
  <div class="kv"><span class="k">It does not conflict with load balancing</span><span class="v">Each backend gets its own idle pool, so round robin still distributes and keepalive still saves handshakes. The two features are independent, which is why the fix is safe to apply to any existing upstream.</span></div>
</div>

<h3>Checking whether yours is working</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Count connections against requests at the backend</span><span class="lz-lnote">The measurement in this lesson. Any server can count its own <code>connection</code> events; the ratio to request count tells you immediately. A ratio near 1:1 means keepalive is not in effect regardless of what the config says.</span></div>
  <div class="lz-layer"><span class="lz-lname">Watch TIME_WAIT on the Nginx host</span><span class="lz-lnote"><code>ss -tan state time-wait | wc -l</code>. Tens of thousands with modest traffic is the signature of per-request connections. It should drop sharply once keepalive is working.</span></div>
  <div class="lz-layer"><span class="lz-lname">Look for 502s that correlate with idleness</span><span class="lz-lnote">The backend-closes-first problem shows up as sporadic <code>502</code> after quiet periods, with <code>upstream prematurely closed connection</code> in the error log. That message plus keepalive enabled means the timeout mismatch above.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do the same check for upstreams you did not write</span><span class="lz-lnote">A <code>proxy_pass</code> added by someone else, a FastCGI or gRPC block, a health-check target. Each one needs its own three lines, and <code>fastcgi_keep_conn on;</code> is the FastCGI equivalent of the empty <code>Connection</code> header.</span></div>
</div>
<div class="note-ct">
<p><strong>Why this is worth doing before any other tuning.</strong> It is three lines, it needs no new infrastructure, and the measurement above is a hundredfold reduction in connection setup between two machines that talk constantly. Compared with anything else in this course it has the best ratio of effect to effort — and because the default is silently wasteful rather than broken, nothing will ever tell you it is missing.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive" target="_blank" rel="noopener"><span class="lc-ico">♻️</span><span class="lc-body"><span class="lc-title">nginx — upstream keepalive</span><span class="lc-sub">nginx.org · Including the note that all three directives are required</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_http_version" target="_blank" rel="noopener"><span class="lc-ico">1️⃣</span><span class="lc-body"><span class="lc-title">nginx — proxy_http_version</span><span class="lc-sub">nginx.org · Why the default is 1.0 and what that costs</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Ephemeral_port" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Ephemeral ports and TIME_WAIT</span><span class="lc-sub">wikipedia.org · The limit you hit when every request opens a connection</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">server.keepAliveTimeout, and why it must exceed the proxy's</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Count connections at the backend, then add the three lines and count again</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>101 request, một kết nối TCP</h2>
<p class="lead">Bài 6.3 đo cái giá của một kết nối ở phía client. Đúng sự lãng phí đó cũng diễn ra giữa Nginx và các backend của bạn, ở MỌI request, theo mặc định — và cách chữa là BA dòng mà cả ba phải có mặt CÙNG NHAU.</p>

<h3>Một upstream biết tự đếm kết nối của nó</h3>
<div class="out">Upstream dem ca REQUEST lan KET NOI TCP no nhan duoc.

  sau 100 request qua /dem-khong/ (KHONG keepalive):
     req=101  conn=101          &lt;- moi request MOT ket noi moi

  sau 100 request nua qua /dem-giu/ (CO keepalive):
     req=202  conn=102          &lt;- 101 request, DUNG MOT ket noi moi</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Không có keepalive thì Nginx MỞ rồi ĐÓNG cho từng request</span><span class="lz-d">Một cái bắt tay TCP, một request, một phản hồi, một cú đóng — cho TỪNG lượt gọi tới backend CỦA CHÍNH BẠN trên mạng CỦA CHÍNH BẠN. 101 kết nối cho 101 request, do chính backend đếm ra.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cái giá KHÔNG chỉ là cái bắt tay</span><span class="lz-d">Mỗi kết nối đã đóng để lại một socket ở trạng thái <code>TIME_WAIT</code> chừng một phút. Ở mức vài nghìn request mỗi giây thì đó là hàng chục nghìn socket bị giữ ở CẢ HAI máy, và cuối cùng là cạn cổng tạm — thứ hỏng dưới dạng một lỗi kết nối, chứ không phải một thông báo nói rằng bạn hết cổng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ba chỉ thị, và cả ba đều BẮT BUỘC</span><span class="lz-d"><code>keepalive N</code> trong khối upstream, <code>proxy_http_version 1.1</code> và <code>proxy_set_header Connection ""</code> trong location. Thiếu bất kỳ cái nào là cái bể KHÔNG được dùng, một cách âm thầm — và đây là cách phổ biến nhất mà keepalive được cấu hình rồi chẳng làm gì.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Vì sao phải có cái header Connection RỖNG</span><span class="lz-d">Bài 3.2: mặc định Nginx gửi <code>Connection: close</code> lên upstream, thứ bảo backend cúp máy sau khi trả lời. Đặt nó thành chuỗi rỗng là GỠ hẳn cái header đó đi, nên hành vi mặc định của HTTP/1.1 — giữ kết nối sống — được áp dụng.</span></div>
</div>
<pre><code>upstream api {
  server 10.0.1.11:3000;
  server 10.0.1.12:3000;

  keepalive          32;      <span class="tok-comment"># số kết nối RẢNH giữ lại cho MỖI worker</span>
  keepalive_requests 1000;    <span class="tok-comment"># đóng và mở lại sau ngần này request</span>
  keepalive_timeout  60s;     <span class="tok-comment"># đóng kết nối rảnh quá lâu</span>
}

location /api/ {
  proxy_http_version 1.1;          <span class="tok-comment"># BẮT BUỘC</span>
  proxy_set_header Connection "";  <span class="tok-comment"># BẮT BUỘC</span>
  proxy_pass http://api/;
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>keepalive 32</code> KHÔNG phải "32 kết nối", nó là 32 kết nối ĐANG RẢNH cho MỖI worker, và hiểu sai chỗ đó là định cỡ cái bể sai theo cả hai hướng.</strong> Nó KHÔNG phải một giới hạn về số việc đồng thời: Nginx mở bao nhiêu kết nối cần thiết để phục vụ request, còn <code>keepalive</code> chỉ nói giữ lại bao nhiêu cái khi chúng RẢNH. Nó cũng tính theo TỪNG tiến trình worker, nên <code>keepalive 32</code> với <code>worker_processes 8</code> là tới 256 kết nối rảnh tới upstream đó từ MỘT máy. Đặt quá thấp thì lúc đông khách cứ đóng rồi mở lại; đặt quá cao thì mỗi backend ôm hàng trăm socket rảnh mà không bao giờ dùng tới. Điểm khởi đầu hợp lý là mức đồng thời ở trạng thái ổn định chia cho số worker, rồi đi kiểm số kết nối của backend đặt cạnh số request của nó — cái tỷ lệ trong phép đo ở trên chính là bộ mặt của chữ "đang chạy".</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">keepalive_requests tồn tại để tránh tái dùng VÔ HẠN</span><span class="v">Mặc định 1000. Một kết nối được tái dùng mãi mãi sẽ tích luỹ mọi trạng thái mà hai đầu đang giữ, và nó ngăn một cái bể vừa được cân bằng lại có hiệu lực. Tái chế theo một bộ đếm là một khoản bảo hiểm rẻ.</span></div>
  <div class="kv"><span class="k">Backend cũng phải MUỐN giữ nó sống</span><span class="v">Máy chủ HTTP của Node mặc định đóng kết nối rảnh sau 5 giây, ngắn hơn con số 60 của Nginx. Cái kết nối biến mất, Nginx thử tái dùng nó, và bạn nhận một cú <code>502</code> thỉnh thoảng. Hãy đặt keepalive timeout của backend CAO HƠN của Nginx, đừng thấp hơn.</span></div>
  <div class="kv"><span class="k">Dòng keepalive phải đứng CUỐI trong khối upstream</span><span class="v">Có ghi trong tài liệu, dễ bỏ sót, và Nginx không cảnh báo: <code>keepalive</code> đặt SAU các dòng <code>server</code>. Các bản hiện tại thì viết kiểu nào cũng chạy, nhưng tài liệu quy định thứ tự đó, và làm theo thì chẳng tốn gì.</span></div>
  <div class="kv"><span class="k">Nó KHÔNG xung đột với cân bằng tải</span><span class="v">Mỗi backend có bể kết nối rảnh của riêng nó, nên round robin vẫn phân phối và keepalive vẫn tiết kiệm bắt tay. Hai tính năng ĐỘC LẬP nhau, và đó là lý do cách chữa này an toàn để áp lên bất kỳ upstream nào đang có.</span></div>
</div>

<h3>Kiểm xem cái của bạn có đang chạy không</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đếm KẾT NỐI đặt cạnh REQUEST ở phía backend</span><span class="lz-lnote">Đúng phép đo trong bài này. Máy chủ nào cũng đếm được sự kiện <code>connection</code> của chính nó; cái tỷ lệ so với số request nói cho bạn biết ngay lập tức. Tỷ lệ xấp xỉ 1:1 nghĩa là keepalive KHÔNG có hiệu lực, bất kể cấu hình nói gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Theo dõi TIME_WAIT trên máy chạy Nginx</span><span class="lz-lnote"><code>ss -tan state time-wait | wc -l</code>. Hàng chục nghìn với lưu lượng vừa phải chính là chữ ký của kiểu mỗi-request-một-kết-nối. Nó phải TỤT MẠNH một khi keepalive chạy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Để ý những cú 502 tương quan với lúc RẢNH</span><span class="lz-lnote">Cái vấn đề backend-đóng-trước hiện ra thành những cú <code>502</code> rải rác sau các khoảng lặng, kèm <code>upstream prematurely closed connection</code> trong error log. Thông báo đó cộng với keepalive đang bật nghĩa là cái lệch timeout ở trên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Làm đúng phép kiểm đó với những upstream KHÔNG do bạn viết</span><span class="lz-lnote">Một dòng <code>proxy_pass</code> ai đó thêm vào, một khối FastCGI hay gRPC, một đích health-check. Cái nào cũng cần ba dòng của riêng nó, và <code>fastcgi_keep_conn on;</code> là thứ tương đương với header <code>Connection</code> rỗng ở phía FastCGI.</span></div>
</div>
<div class="note-ct">
<p><strong>Vì sao việc này đáng làm TRƯỚC mọi phép chỉnh tinh khác.</strong> Nó là BA dòng, nó không cần hạ tầng mới nào, và phép đo ở trên là mức giảm GẤP TRĂM LẦN chi phí thiết lập kết nối giữa hai cái máy nói chuyện với nhau liên tục. So với mọi thứ khác trong khoá này thì nó có tỷ lệ hiệu quả trên công sức tốt nhất — và vì cái mặc định là LÃNG PHÍ trong im lặng chứ không phải HỎNG, nên sẽ chẳng có gì báo cho bạn biết là nó đang thiếu.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive" target="_blank" rel="noopener"><span class="lc-ico">♻️</span><span class="lc-body"><span class="lc-title">nginx — keepalive của upstream</span><span class="lc-sub">nginx.org · Kèm ghi chú rằng cả ba chỉ thị đều bắt buộc</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_http_version" target="_blank" rel="noopener"><span class="lc-ico">1️⃣</span><span class="lc-body"><span class="lc-title">nginx — proxy_http_version</span><span class="lc-sub">nginx.org · Vì sao mặc định là 1.0 và điều đó tốn gì</span></span></a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Ephemeral_port" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">Cổng tạm và TIME_WAIT</span><span class="lc-sub">wikipedia.org · Cái trần bạn đụng phải khi mỗi request mở một kết nối</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">server.keepAliveTimeout, và vì sao nó phải LỚN HƠN của con proxy</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Đếm kết nối ở backend, rồi thêm ba dòng và đếm lại</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Deploying without dropping a request|||9.5 — Deploy mà không rớt một request nào',
      slug: 'nginx-9-5-deploy-khong-rot-request',
      type: 'LESSON',
      description: 'Nạp lại cấu hình BA lần trong khi bốn trăm request đang chạy: bốn trăm cú 200, không lỗi nào. Rồi đổi cả cái bể sang một bộ máy mới ngay giữa lúc có lưu lượng, và đếm lại. Bài này cũng kể về một cú "lỗi" trong phép đo hoá ra là số đếm của chính upstream.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Deploying without dropping a request</h2>
<p class="lead">Section 0 said <code>nginx -s reload</code> replaces the workers without dropping a connection. This is where that property becomes a deployment strategy: the upstream block is a list you can change under live traffic, and the reload is what publishes the change.</p>

<h3>Reloading three times under load</h3>
<div class="out">400 request dang chay, nap lai cau hinh BA lan giua chung:

  400 x 200
  ^^^^^^^^^ khong mot loi nao</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The master starts new workers with the new config</span><span class="lz-d">Section 0 measured the process model; this is what it buys. The listening sockets are inherited, so no connection is ever refused and no port is ever unbound.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Old workers finish what they were doing</span><span class="lz-d">They stop accepting new connections and keep serving the ones in flight until those complete, then exit. A request that started before the reload finishes under the old config, which is exactly right.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">So a reload is safe to run whenever you want</span><span class="lz-d">In a deploy script, from a certificate renewal hook, from a config-management tool. Three reloads inside a second produced no errors at all in the measurement above.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Always nginx -t first</span><span class="lz-d">A reload with a broken config fails and the old workers keep running — so you do not take the site down, but you also do not get the change, and the only sign is a line in the error log. <code>nginx -t &amp;&amp; nginx -s reload</code> as one command is the habit.</span></div>
</div>

<h3>Swapping the whole pool mid-traffic</h3>
<div class="out">upstream deu { server 9501; server 9502; server 9503; }
        -> upstream deu { server 9504; }          va nap lai

200 request bac ngang qua lan doi:
  may-1=22  may-2=23  may-3=22        (truoc khi nap lai)
  may-4=133                           (sau khi nap lai)
  loi: 0</div>
<div class="callout warn">
<p><strong>One line in that output looked like an error and was not.</strong> A first pass counted responses containing "502" and found one — which turned out to be <code>may-1 (lan 502)</code>, the backend's own request counter reaching 502. Checking every line against the expected shape found 200 well-formed responses and zero failures. It is a small thing, and it is exactly how a measurement produces a wrong conclusion: the grep was reasonable, the number was real, and the interpretation was nonsense. Verify what a pattern actually matched before reporting what it means.</p>
</div>

<h3>The deployment patterns this enables</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Rolling: take one node out, deploy it, put it back</span><span class="lz-lnote">Mark a server <code>down</code>, reload, deploy to it, remove <code>down</code>, reload. Capacity drops by one node at a time and no client sees an error. With <code>hash ... consistent</code> the users on that node move and come back (Lesson 9.2), which is the cost of doing it this way.</span></div>
  <div class="lz-layer"><span class="lz-lname">Blue-green: two full pools, switch the list</span><span class="lz-lnote">The measurement above. Deploy the new version to an idle set of machines, verify it directly, then change the <code>upstream</code> block to point at them and reload. Rollback is the same edit in reverse, and it takes as long as a reload.</span></div>
  <div class="lz-layer"><span class="lz-lname">Canary: weight the new version low</span><span class="lz-lnote"><code>server moi:3000 weight=1;</code> alongside <code>server cu:3000 weight=9;</code> sends a tenth of traffic to the new build. Watch the error rate, then shift the weights. It is crude compared with a real traffic-splitting system and it needs nothing you do not already have.</span></div>
  <div class="lz-layer"><span class="lz-lname">Draining: down plus a wait</span><span class="lz-lnote">Marking a server <code>down</code> stops new requests immediately, but requests already in flight continue. Wait for your longest expected request before shutting the process down, or you will cut off the exact users you were being careful about.</span></div>
</div>
<pre><code><span class="tok-comment"># Blue-green in one include file, switched with a symlink</span>
<span class="tok-comment"># /etc/nginx/be-current.conf  ->  be-blue.conf or be-green.conf</span>
upstream api { include /etc/nginx/be-hien-tai.conf; keepalive 32; }

<span class="tok-comment"># Switching pools = repoint the symlink and reload. Rolling back is exactly the same.</span>
<span class="tok-comment">#   ln -sfn be-luc.conf /etc/nginx/be-hien-tai.conf</span>
<span class="tok-comment">#   nginx -t &amp;&amp; nginx -s reload</span></code></pre>
<div class="pitfall">
<p><strong>Trap — a reload publishes the config, but it does not verify that the new backends actually work.</strong> The measurement above swapped to a pool that happened to be healthy. Point the same edit at a machine that is up but broken — wrong build, missing environment variable, database it cannot reach — and Nginx will happily send it every request, because passive health checks only notice connection failures and the status codes you listed (Lesson 9.3). The step that is missing from most deploy scripts is a direct request to the new backend, bypassing Nginx, checking something that only a correct build would return. That is one <code>curl</code> against the backend's own port, run before the reload rather than after it.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Reload does not re-resolve DNS names in proxy_pass</span><span class="v">It does re-resolve names inside an <code>upstream</code> block. If your deploy replaces containers and you use a bare hostname in <code>proxy_pass</code>, a reload will not pick up the new address — Lesson 3.1's caveat, arriving at the worst possible moment.</span></div>
  <div class="kv"><span class="k">Old workers can linger a long time</span><span class="v">A WebSocket or a long download keeps its worker alive until it finishes. After a reload you will see old worker processes still running, which is correct — <code>worker_shutdown_timeout</code> bounds it if you need them gone.</span></div>
  <div class="kv"><span class="k">Reloading is not restarting</span><span class="v"><code>reload</code> keeps the master, the listening sockets and every open connection. <code>restart</code> drops all of them. Anything in a deploy script that says <code>systemctl restart nginx</code> is causing a brief outage that a reload would not.</span></div>
  <div class="kv"><span class="k">Test the reload path itself</span><span class="v">Run a request loop, reload three times, and count the failures. Four hundred requests and zero errors is what it should look like — and if it does not, that is a finding worth having before a deploy rather than during one.</span></div>
</div>
<div class="note-ct">
<p><strong>What makes all of this work.</strong> The upstream block is data, the reload is atomic and non-disruptive, and the two together mean changing which machines serve your traffic is a text edit and a signal. No load balancer to reconfigure, no DNS to wait for, no connection dropped — measured at four hundred requests across three reloads and again across a full pool swap.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/control.html" target="_blank" rel="noopener"><span class="lc-ico">🎛️</span><span class="lc-body"><span class="lc-title">nginx — Controlling nginx</span><span class="lc-sub">nginx.org · reload, reopen, quit, and what each signal does to the workers</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server" target="_blank" rel="noopener"><span class="lc-ico">🔻</span><span class="lc-body"><span class="lc-title">nginx — the down parameter</span><span class="lc-sub">nginx.org · Draining a node without deleting its configuration</span></span></a>
<a class="link-card" href="https://martinfowler.com/bliki/BlueGreenDeployment.html" target="_blank" rel="noopener"><span class="lc-ico">🔵</span><span class="lc-body"><span class="lc-title">Blue-green deployment</span><span class="lc-sub">martinfowler.com · The pattern the pool swap above implements</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Starting the new containers before switching, and verifying them directly</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Reload three times under a request loop and count the failures yourself</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Deploy mà không rớt một request nào</h2>
<p class="lead">Mục 0 nói rằng <code>nginx -s reload</code> thay đám worker mà không rớt một kết nối nào. Đây là chỗ tính chất ấy trở thành một CHIẾN LƯỢC TRIỂN KHAI: khối upstream là một DANH SÁCH mà bạn đổi được ngay giữa lúc có lưu lượng, và cú nạp lại là thứ CÔNG BỐ thay đổi đó.</p>

<h3>Nạp lại BA lần trong lúc đang tải</h3>
<div class="out">400 request dang chay, nap lai cau hinh BA lan giua chung:

  400 x 200
  ^^^^^^^^^ khong mot loi nao</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Master khởi động worker MỚI với cấu hình MỚI</span><span class="lz-d">Mục 0 đo cái mô hình tiến trình; đây là thứ nó mua được. Các socket đang nghe được KẾ THỪA, nên không kết nối nào bị từ chối và không cổng nào bị nhả ra.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Worker CŨ làm nốt việc chúng đang làm</span><span class="lz-d">Chúng thôi nhận kết nối mới và tiếp tục phục vụ những cái đang bay cho tới khi xong, rồi mới thoát. Một request bắt đầu TRƯỚC lúc nạp lại thì kết thúc dưới cấu hình CŨ, và thế là đúng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nên nạp lại là việc chạy lúc nào cũng AN TOÀN</span><span class="lz-d">Trong một script deploy, từ một hook gia hạn chứng chỉ, từ một công cụ quản lý cấu hình. Ba lần nạp lại trong vòng một giây mà KHÔNG sinh ra lỗi nào trong phép đo ở trên.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">LUÔN chạy nginx -t trước</span><span class="lz-d">Một cú nạp lại với cấu hình hỏng thì THẤT BẠI và đám worker cũ vẫn chạy — nên bạn không làm site chết, nhưng bạn cũng KHÔNG có thay đổi, và dấu hiệu duy nhất là một dòng trong error log. <code>nginx -t &amp;&amp; nginx -s reload</code> viết thành một lệnh là thói quen nên có.</span></div>
</div>

<h3>Đổi cả cái bể ngay giữa lúc có lưu lượng</h3>
<div class="out">upstream deu { server 9501; server 9502; server 9503; }
        -> upstream deu { server 9504; }          va nap lai

200 request bac ngang qua lan doi:
  may-1=22  may-2=23  may-3=22        (truoc khi nap lai)
  may-4=133                           (sau khi nap lai)
  loi: 0</div>
<div class="callout warn">
<p><strong>Một dòng trong kết quả đó TRÔNG như một lỗi mà thật ra KHÔNG.</strong> Một lượt đếm ban đầu tìm những phản hồi có chứa "502" và thấy MỘT — hoá ra đó là <code>may-1 (lan 502)</code>, tức là bộ đếm request của chính backend vừa chạm 502. Kiểm lại TỪNG dòng theo đúng hình dạng mong đợi thì thấy 200 phản hồi hoàn chỉnh và KHÔNG thất bại nào. Đó là chuyện nhỏ, và nó ĐÚNG là cách một phép đo sinh ra một kết luận sai: cái lệnh grep hợp lý, con số có thật, và phần diễn giải thì vô nghĩa. Hãy KIỂM xem một cái mẫu thật sự khớp phải cái gì trước khi đi báo cáo nó có nghĩa gì.</p>
</div>

<h3>Những khuôn mẫu triển khai mà điều này mở ra</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cuốn chiếu: rút một node ra, deploy nó, đưa nó về</span><span class="lz-lnote">Đánh dấu một máy chủ <code>down</code>, nạp lại, deploy lên nó, bỏ chữ <code>down</code>, nạp lại. Năng lực giảm MỘT node mỗi lần và không client nào thấy lỗi. Với <code>hash ... consistent</code> thì người dùng trên node đó dời đi rồi quay lại (Bài 9.2), và đó là cái giá của cách làm này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xanh-lục: hai cái bể đầy đủ, đổi cái danh sách</span><span class="lz-lnote">Đúng phép đo ở trên. Deploy phiên bản mới lên một bộ máy đang rảnh, kiểm nó TRỰC TIẾP, rồi đổi khối <code>upstream</code> trỏ sang chúng và nạp lại. Lùi lại là đúng cái sửa đó theo chiều ngược, và nó mất đúng bằng một cú nạp lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Canary: cho phiên bản mới trọng số thấp</span><span class="lz-lnote"><code>server moi:3000 weight=1;</code> đặt cạnh <code>server cu:3000 weight=9;</code> đẩy một phần mười lưu lượng sang bản dựng mới. Theo dõi tỷ lệ lỗi rồi dịch dần trọng số. Nó thô so với một hệ chia lưu lượng thật, và nó không cần thứ gì bạn chưa có.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rút cạn: down cộng một khoảng CHỜ</span><span class="lz-lnote">Đánh dấu <code>down</code> là chặn request mới NGAY, nhưng những request ĐANG BAY vẫn tiếp tục. Hãy chờ đủ cái request dài nhất bạn dự kiến rồi mới tắt tiến trình, không thì bạn cắt đứt đúng những người dùng mà bạn đang cẩn thận vì họ.</span></div>
</div>
<pre><code><span class="tok-comment"># Blue-green trong một tệp include, đổi bằng một liên kết mềm</span>
<span class="tok-comment"># /etc/nginx/be-hien-tai.conf  ->  be-xanh.conf hoặc be-luc.conf</span>
upstream api { include /etc/nginx/be-hien-tai.conf; keepalive 32; }

<span class="tok-comment"># Đổi bể = đổi liên kết mềm rồi nạp lại. Lùi lại cũng y hệt thế.</span>
<span class="tok-comment">#   ln -sfn be-luc.conf /etc/nginx/be-hien-tai.conf</span>
<span class="tok-comment">#   nginx -t &amp;&amp; nginx -s reload</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — một cú nạp lại CÔNG BỐ cấu hình, nhưng nó KHÔNG kiểm xem đám backend mới có thật sự chạy được không.</strong> Phép đo ở trên đổi sang một cái bể tình cờ khoẻ mạnh. Chĩa đúng cái sửa đó vào một máy đang SỐNG nhưng HỎNG — sai bản dựng, thiếu một biến môi trường, không chạm nổi cơ sở dữ liệu — thì Nginx sẽ vui vẻ gửi cho nó MỌI request, vì kiểm sức khoẻ thụ động chỉ nhận ra lỗi kết nối và những mã trạng thái bạn liệt kê (Bài 9.3). Cái bước thiếu trong phần lớn script deploy là một request TRỰC TIẾP tới backend mới, đi VÒNG QUA Nginx, kiểm một thứ mà chỉ bản dựng ĐÚNG mới trả về được. Đó là MỘT lệnh <code>curl</code> nhắm vào chính cổng của backend, chạy TRƯỚC cú nạp lại chứ không phải sau.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nạp lại KHÔNG phân giải lại tên miền trong proxy_pass</span><span class="v">Nó CÓ phân giải lại những tên nằm TRONG một khối <code>upstream</code>. Nếu lần deploy của bạn thay container mà bạn dùng một tên miền trần trong <code>proxy_pass</code> thì nạp lại sẽ KHÔNG lấy được địa chỉ mới — đúng cái cảnh báo ở Bài 3.1, ập tới vào thời điểm tệ nhất có thể.</span></div>
  <div class="kv"><span class="k">Worker cũ có thể nán lại RẤT lâu</span><span class="v">Một WebSocket hay một lượt tải lớn giữ cho worker của nó sống tới khi xong. Sau một cú nạp lại bạn sẽ thấy các tiến trình worker cũ vẫn chạy, và thế là ĐÚNG — <code>worker_shutdown_timeout</code> chặn nó lại nếu bạn cần chúng biến mất.</span></div>
  <div class="kv"><span class="k">Nạp lại KHÔNG phải khởi động lại</span><span class="v"><code>reload</code> giữ nguyên master, các socket đang nghe và mọi kết nối đang mở. <code>restart</code> vứt hết. Bất cứ dòng nào trong script deploy viết <code>systemctl restart nginx</code> đều đang gây ra một khoảng chết ngắn mà một cú nạp lại thì không.</span></div>
  <div class="kv"><span class="k">Hãy THỬ chính cái đường nạp lại</span><span class="v">Chạy một vòng lặp request, nạp lại ba lần, rồi đếm số thất bại. Bốn trăm request và không lỗi nào là thứ nó PHẢI trông như thế — và nếu không phải thế thì đó là một phát hiện đáng có TRƯỚC một lần deploy chứ không phải GIỮA một lần deploy.</span></div>
</div>
<div class="note-ct">
<p><strong>Cái gì làm cho tất cả chuyện này chạy được.</strong> Khối upstream là DỮ LIỆU, cú nạp lại là NGUYÊN TỬ và không gây gián đoạn, và hai thứ đó cộng lại nghĩa là việc đổi xem máy nào phục vụ lưu lượng của bạn chỉ là một lần sửa văn bản và một tín hiệu. Không có bộ cân bằng tải nào phải cấu hình lại, không có DNS nào phải chờ, không kết nối nào bị rớt — đo được ở bốn trăm request bắc qua ba lần nạp lại và một lần nữa bắc qua một cú đổi trọn cái bể.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/control.html" target="_blank" rel="noopener"><span class="lc-ico">🎛️</span><span class="lc-body"><span class="lc-title">nginx — Điều khiển nginx</span><span class="lc-sub">nginx.org · reload, reopen, quit, và mỗi tín hiệu làm gì với đám worker</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server" target="_blank" rel="noopener"><span class="lc-ico">🔻</span><span class="lc-body"><span class="lc-title">nginx — tham số down</span><span class="lc-sub">nginx.org · Rút cạn một node mà không xoá cấu hình của nó</span></span></a>
<a class="link-card" href="https://martinfowler.com/bliki/BlueGreenDeployment.html" target="_blank" rel="noopener"><span class="lc-ico">🔵</span><span class="lc-body"><span class="lc-title">Blue-green deployment</span><span class="lc-sub">martinfowler.com · Khuôn mẫu mà cú đổi bể ở trên đang cài đặt</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Khởi động container mới TRƯỚC khi đổi, và kiểm chúng một cách trực tiếp</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Nạp lại ba lần dưới một vòng lặp request rồi tự đếm số thất bại</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Quiz: load balancing|||9.6 — Quiz: cân bằng tải',
      slug: 'nginx-9-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về bốn thuật toán, chuyện 73% so với 26%, cú giết máy giữa chừng không sinh lỗi nào, và 101 request đi qua một kết nối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.6</span>
<h2>Quiz: load balancing</h2>
<p class="lead">Eight questions from three real backends and a lot of counting. Two of them describe results that contradict what the theory alone would suggest.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Round robin split thirty requests 10/10/10, <code>weight=3</code> against <code>weight=1</code> gave 23/7, <code>least_conn</code> looked identical because every response was equally fast, and <code>ip_hash</code> from one address sent all thirty to one machine (9.1). Adding a fourth backend to a pool of three moved 73% of users with plain <code>hash</code> and only 26% with <code>hash ... consistent</code> — but a backend simply <em>failing</em> moved nobody in either mode, because the failed server keeps its ring position (9.2). Killing one of three mid-traffic produced thirty responses and zero errors, because Nginx retries the failed request elsewhere and then marks the server down for <code>fail_timeout</code> — and recovery is a timer, not a probe, so the machine sat idle for eleven seconds after it was healthy (9.3). Without upstream keepalive, 101 requests opened 101 TCP connections; with it plus HTTP/1.1 and an empty <code>Connection</code> header, the next 101 needed one (9.4). And three reloads during four hundred live requests produced four hundred <code>200</code>s (9.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.6</span>
<h2>Quiz: cân bằng tải</h2>
<p class="lead">Tám câu ra từ ba backend thật và rất nhiều phép đếm. Hai câu mô tả những kết quả MÂU THUẪN với thứ mà chỉ đọc lý thuyết thì sẽ đoán ra.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Round robin chia ba mươi request thành 10/10/10, <code>weight=3</code> so với <code>weight=1</code> cho ra 23/7, <code>least_conn</code> trông y hệt vì mọi phản hồi đều nhanh như nhau, còn <code>ip_hash</code> từ MỘT địa chỉ dồn cả ba mươi vào một máy (9.1). Thêm backend thứ tư vào bể ba máy làm 73% người dùng đổi máy với <code>hash</code> thường và chỉ 26% với <code>hash ... consistent</code> — nhưng một backend chỉ đơn giản là CHẾT thì KHÔNG làm ai đổi cả, ở cả hai dạng, vì máy hỏng vẫn giữ vị trí trên vòng (9.2). Giết một trong ba giữa lúc có lưu lượng cho ra ba mươi phản hồi và KHÔNG lỗi nào, vì Nginx thử lại ở chỗ khác rồi đánh dấu máy đó chết trong <code>fail_timeout</code> — và việc hồi phục là một CÁI HẸN GIỜ chứ không phải thăm dò, nên cái máy ngồi chơi mười một giây sau khi đã khoẻ (9.3). Không có keepalive lên upstream thì 101 request mở 101 kết nối TCP; có nó cộng HTTP/1.1 và một header <code>Connection</code> rỗng thì 101 request tiếp theo chỉ cần MỘT (9.4). Và ba lần nạp lại giữa bốn trăm request đang chạy cho ra bốn trăm cú <code>200</code> (9.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'least_conn and round robin gave identical distributions in the measurement. What does that prove?|||least_conn và round robin cho phân bố y hệt nhau trong phép đo. Điều đó chứng minh gì?',
            options: [
              'least_conn is useless|||least_conn vô dụng',
              'Nothing about their difference — every response was equally fast, so no backend ever had a queue; they diverge when request durations vary|||Không chứng minh gì về khác biệt giữa chúng — mọi phản hồi đều nhanh như nhau nên chẳng máy nào có hàng đợi; chúng khác nhau khi thời lượng request chênh lệch',
              'Round robin is faster|||Round robin nhanh hơn',
              'The pool was misconfigured|||Cái bể bị cấu hình sai',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Adding a fourth server to a pool of three: how many users are remapped with hash versus hash ... consistent?|||Thêm máy chủ thứ tư vào bể ba máy: bao nhiêu người dùng bị ánh xạ lại với hash so với hash ... consistent?',
            options: [
              'About the same in both|||Xấp xỉ nhau ở cả hai',
              '73% with plain hash, 26% with consistent — close to the theoretical minimum of 25%|||73% với hash thường, 26% với consistent — sát mức lý thuyết tối thiểu 25%',
              '25% with plain hash, 73% with consistent|||25% với hash thường, 73% với consistent',
              'None in either case|||Không ai cả, ở cả hai trường hợp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A backend in a hash pool fails. What happens to users pinned to the OTHER backends?|||Một backend trong một bể hash bị hỏng. Chuyện gì xảy ra với những người dùng đang ghim vào các backend KHÁC?',
            options: [
              'They are all remapped, which is why consistent matters|||Họ bị ánh xạ lại hết, và đó là lý do consistent quan trọng',
              'Nothing — the failed server keeps its position, so only its own users move; consistent matters when the server LIST changes, not when one fails|||Không gì cả — máy hỏng GIỮ NGUYÊN vị trí, nên chỉ người dùng của chính nó phải dời; consistent có nghĩa lý khi DANH SÁCH máy chủ đổi, không phải khi một máy hỏng',
              'They get 502 until it recovers|||Họ nhận 502 cho tới khi nó hồi phục',
              'It depends on max_fails|||Tuỳ vào max_fails',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'One of three backends is killed mid-traffic. What did thirty subsequent requests receive?|||Một trong ba backend bị giết giữa lúc có lưu lượng. Ba mươi request tiếp theo nhận được gì?',
            options: [
              'Ten 502s and twenty 200s|||Mười cú 502 và hai mươi cú 200',
              'Thirty 200s — the first failure was retried on another server, then the dead one was marked unavailable|||Ba mươi cú 200 — cú hỏng đầu tiên được thử lại ở máy khác, rồi cái máy chết bị đánh dấu là không dùng được',
              'Thirty 502s until fail_timeout expires|||Ba mươi cú 502 cho tới khi fail_timeout hết',
              'It depends on the balancing algorithm|||Tuỳ vào thuật toán cân bằng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You restart the killed backend. When does Nginx start using it again?|||Bạn khởi động lại cái backend vừa bị giết. Khi nào Nginx dùng lại nó?',
            options: [
              'Immediately; Nginx probes it|||Ngay lập tức; Nginx có thăm dò nó',
              'After fail_timeout expires — recovery is a timer, not a probe, so it sat idle for eleven seconds while already healthy|||Sau khi fail_timeout hết — hồi phục là một CÁI HẸN GIỜ chứ không phải thăm dò, nên nó ngồi chơi mười một giây dù đã khoẻ',
              'Only after a reload|||Chỉ sau khi nạp lại cấu hình',
              'Never, until max_fails resets|||Không bao giờ, cho tới khi max_fails được đặt lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why must proxy_next_upstream normally NOT include non_idempotent?|||Vì sao proxy_next_upstream bình thường KHÔNG được có non_idempotent?',
            options: [
              'It slows down retries|||Nó làm việc thử lại chậm đi',
              'A timeout can mean the request already succeeded, so retrying a POST processes it twice — double order, double charge|||Một cú timeout có thể nghĩa là request ĐÃ thành công, nên thử lại một cú POST là xử lý nó HAI lần — đơn đôi, tiền đôi',
              'It is only valid in NGINX Plus|||Nó chỉ hợp lệ ở NGINX Plus',
              'It conflicts with keepalive|||Nó xung đột với keepalive',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which three directives are ALL required for upstream connection reuse?|||Ba chỉ thị nào ĐỀU bắt buộc phải có để tái dùng kết nối lên upstream?',
            options: [
              'keepalive alone is enough|||Chỉ mỗi keepalive là đủ',
              'keepalive N in the upstream block, proxy_http_version 1.1 and proxy_set_header Connection "" — missing any one and the pool is silently unused|||keepalive N trong khối upstream, proxy_http_version 1.1 và proxy_set_header Connection "" — thiếu bất kỳ cái nào là cái bể KHÔNG được dùng, một cách âm thầm',
              'keepalive plus proxy_buffering|||keepalive cộng proxy_buffering',
              'keepalive plus least_conn|||keepalive cộng least_conn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between nginx -s reload and systemctl restart nginx during a deploy?|||Khác biệt giữa nginx -s reload và systemctl restart nginx trong một lần deploy là gì?',
            options: [
              'None; they do the same thing|||Không có; chúng làm cùng một việc',
              'reload keeps the master, the listening sockets and every open connection — measured at 400 requests across 3 reloads with zero errors; restart drops all of them|||reload GIỮ master, các socket đang nghe và mọi kết nối đang mở — đo được 400 request bắc qua 3 lần nạp lại với KHÔNG lỗi nào; còn restart thì vứt hết',
              'restart is faster and equally safe|||restart nhanh hơn và an toàn ngang nhau',
              'reload requires downtime|||reload đòi phải có khoảng chết',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
