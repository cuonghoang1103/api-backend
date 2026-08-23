/**
 * Nginx — Chương 1: Một request tìm ra một khối server bằng cách nào.
 * listen và cặp địa chỉ:cổng · thứ tự khớp server_name · máy chủ mặc định ·
 * Host giả mạo · quiz.
 * Output CHẠY THẬT nginx/1.24.0 (Ubuntu) trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fnginx%2Flearn&reflabel=Nginx';

export default {
  title: 'Chapter 1 — How a request finds a server block|||Chương 1 — Một request tìm ra một khối server bằng cách nào',
  description: 'Trước khi Nginx nhìn tới một dòng location nào, nó phải chọn xong MỘT khối server — và nó chọn theo một thứ tự cố định mà tài liệu nêu trong ba câu còn thực tế thì gây ra nửa số lần "sao nó lại trả về trang kia". Chương này chạy thật cái thứ tự đó, rồi lo phần máy chủ mặc định và cái header Host mà client tự đặt.',
  lessons: [

    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — listen, and the address:port pair|||1.1 — listen, và cặp địa chỉ:cổng',
      slug: 'nginx-1-1-listen',
      type: 'LESSON',
      description: 'Bước đầu tiên của mọi request không phải khớp tên miền, mà là khớp cái SOCKET. Bài này chỉ ra listen thật sự khai báo cái gì, vì sao 80 với 0.0.0.0:80 với [::]:80 là ba thứ khác nhau, và cái cờ nào chỉ được đặt MỘT lần cho mỗi cổng chứ không phải mỗi khối server.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>listen, and the address:port pair</h2>
<p class="lead">Selecting a server block happens in two stages, and almost every explanation skips the first one. Before Nginx compares a single hostname it has already narrowed the candidates down to the blocks listening on the socket that received the connection — so if a request reaches the wrong site, the reason is often that it never reached the right <code>listen</code> at all.</p>

<h3>What listen actually declares</h3>
<pre><code>listen 80;                 <span class="tok-comment"># mọi địa chỉ IPv4, cổng 80  — bằng 0.0.0.0:80</span>
listen 127.0.0.1:8080;     <span class="tok-comment"># CHỈ loopback — không ai ngoài máy tới được</span>
listen 192.0.2.10:443 ssl; <span class="tok-comment"># một địa chỉ cụ thể, kèm TLS — Chương 6</span>
listen [::]:80;            <span class="tok-comment"># IPv6; mặc định trên Linux là DÙNG CHUNG cả IPv4</span>
listen [::]:80 ipv6only=on;<span class="tok-comment"># CHỈ IPv6 — nay là mặc định của nginx</span>
listen 8080 default_server;<span class="tok-comment"># máy chủ mặc định CHO CỔNG NÀY — Bài 1.3</span>

<span class="tok-comment"># Một khối server nghe được NHIỀU socket:</span>
server {
  listen 80;
  listen 443 ssl;
  server_name vidu.com;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The pair is the first filter</span><span class="v">A connection arriving on <code>192.0.2.10:443</code> can only ever be served by a block that listens on that address and port — or on the wildcard address for that port. Blocks listening elsewhere are not candidates and their <code>server_name</code> is never consulted.</span></div>
  <div class="kv"><span class="k">A specific address beats the wildcard</span><span class="v">If one block has <code>listen 192.0.2.10:80</code> and another has <code>listen 80</code>, a connection to that specific address is matched against the specific block's group first. This is how a machine with several public addresses keeps its sites apart.</span></div>
  <div class="kv"><span class="k">127.0.0.1 is a real security control</span><span class="v">Binding an admin endpoint or a metrics page to loopback means it cannot be reached from the network at all — no firewall rule, no authentication bug and no misconfigured <code>location</code> can expose it, because the socket is not listening where anyone can connect.</span></div>
  <div class="kv"><span class="k">Ports below 1024 need the master's privilege</span><span class="v">This is the reason the master runs as root (Lesson 0.2). In a container without that capability, bind a high port and map it — which is why so many container images listen on 8080.</span></div>
</div>

<h3>Flags that belong to the port, not to the block</h3>
<div class="pitfall">
<p><strong>Bẫy — <code>default_server</code>, <code>ssl</code>, <code>http2</code> and <code>reuseport</code> are not properties of a server block; they are properties of the listening SOCKET.</strong> The concrete consequence: only ONE block per address:port pair may carry <code>default_server</code>, and declaring it twice is a startup error — <code>duplicate default server for 0.0.0.0:80</code>. The subtler consequence: those flags are taken from the FIRST block that declares the port and then apply to all of them, so enabling <code>ssl</code> on one 443 block and forgetting it on another still gives you TLS on both. Think "how is this port configured", not "how is this block configured".</p>
</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Step 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Match the SOCKET</span><span class="lz-nsub">Which address:port did the connection arrive on · a specific address beats the wildcard · this lesson</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Step 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Match server_name</span><span class="lz-nsub">Within that candidate group, compare the Host header across four precedence levels · Lesson 1.2</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Step 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">No match → the DEFAULT server</span><span class="lz-nsub">For that port specifically · and if none is declared, the FIRST block wins · Lesson 1.3</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Step 4</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Choose a location</span><span class="lz-nsub">Only now does this begin, and only INSIDE the block already chosen · Chapter 2</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Xem NGINX thật sự đang nghe ở đâu — đừng đọc cấu hình rồi đoán</span>
ss -tlnp | grep nginx
<span class="tok-comment"># LISTEN 0 511  0.0.0.0:8080  0.0.0.0:*  users:(("nginx",pid=3218,fd=6))</span>

<span class="tok-comment"># Va gom moi listen dang hieu luc, ke ca trong cac tep include:</span>
nginx -T | grep -nE '^\\\\s*(listen|server_name)'</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Address exhaustion is the first thing to check</span><span class="lz-lnote"><code>bind() to 0.0.0.0:80 failed (98: Address already in use)</code> means something else holds the port — often an old Nginx that did not exit, or Apache. <code>ss -tlnp</code> names the process, and that is faster than any amount of config reading.</span></div>
  <div class="lz-layer"><span class="lz-lname">IPv6 needs its own listen line, usually</span><span class="lz-lnote">Modern Nginx sets <code>ipv6only=on</code> by default, so <code>listen [::]:80;</code> serves IPv6 only and you need <code>listen 80;</code> as well. A site that works from one machine and times out from another is very often exactly this.</span></div>
  <div class="lz-layer"><span class="lz-lname">Behind a proxy, listen is not what the client used</span><span class="lz-lnote">A load balancer terminating TLS connects to your Nginx on plain HTTP, so <code>$scheme</code> says <code>http</code> even though the user typed <code>https</code>. Chapter 3 and Chapter 11 fix that with forwarded headers and <code>real_ip</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">reuseport is a performance switch with a footgun</span><span class="lz-lnote">It gives each worker its own listening socket, which helps under very high connection rates — and it can only appear once per address:port. Measure before enabling it; on most sites it changes nothing you can detect.</span></div>
</div>
<div class="note-ct">
<p><strong>Read a configuration by PORT, not by file.</strong> On a real server with ten files under <code>sites-enabled</code>, the useful question is not "what does this file say" but "which server blocks exist on port 443, and which one is the default". A single <code>nginx -T | grep -E 'listen|server_name'</code> answers exactly that in one screen, and it is the fastest way to spot two sites standing on each other — something reading file by file will never reveal.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#listen" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">nginx — listen</span><span class="lc-sub">nginx.org · Every parameter, including which ones are per-port</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">nginx — how nginx processes a request</span><span class="lc-sub">nginx.org · The four steps above, from the source of truth</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#server" target="_blank" rel="noopener"><span class="lc-ico">🏠</span><span class="lc-body"><span class="lc-title">nginx — the server block</span><span class="lc-sub">nginx.org · What a virtual server is, and what it may contain</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">ss and lsof for finding which process holds a port</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Bind one site to loopback and one to the wildcard, then prove which one answers</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>listen, và cặp địa chỉ:cổng</h2>
<p class="lead">Việc chọn một khối server diễn ra qua HAI chặng, và gần như mọi lời giải thích đều bỏ qua chặng thứ nhất. Trước khi Nginx so lấy một cái tên miền nào, nó đã thu hẹp danh sách ứng viên xuống còn những khối đang nghe trên đúng cái SOCKET nhận được kết nối — nên nếu một request tới nhầm trang thì lý do thường là nó chưa bao giờ tới được đúng cái <code>listen</code> cần tới.</p>

<h3>listen thật ra khai báo cái gì</h3>
<pre><code>listen 80;                 <span class="tok-comment"># mọi địa chỉ IPv4, cổng 80  — bằng 0.0.0.0:80</span>
listen 127.0.0.1:8080;     <span class="tok-comment"># CHỈ loopback — không ai ngoài máy tới được</span>
listen 192.0.2.10:443 ssl; <span class="tok-comment"># một địa chỉ cụ thể, kèm TLS — Chương 6</span>
listen [::]:80;            <span class="tok-comment"># IPv6; mặc định trên Linux là DÙNG CHUNG cả IPv4</span>
listen [::]:80 ipv6only=on;<span class="tok-comment"># CHỈ IPv6 — nay là mặc định của nginx</span>
listen 8080 default_server;<span class="tok-comment"># máy chủ mặc định CHO CỔNG NÀY — Bài 1.3</span>

<span class="tok-comment"># Một khối server nghe được NHIỀU socket:</span>
server {
  listen 80;
  listen 443 ssl;
  server_name vidu.com;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái CẶP đó là bộ lọc ĐẦU TIÊN</span><span class="v">Một kết nối tới trên <code>192.0.2.10:443</code> thì chỉ có thể được phục vụ bởi một khối đang nghe trên đúng địa chỉ và cổng ấy — hoặc trên địa chỉ đại diện của cổng ấy. Những khối nghe ở chỗ khác thì KHÔNG phải ứng viên, và <code>server_name</code> của chúng chẳng bao giờ được đem ra tra.</span></div>
  <div class="kv"><span class="k">Địa chỉ CỤ THỂ thắng địa chỉ đại diện</span><span class="v">Nếu một khối có <code>listen 192.0.2.10:80</code> còn khối khác có <code>listen 80</code> thì một kết nối tới đúng địa chỉ cụ thể đó sẽ được đem so với nhóm của khối cụ thể TRƯỚC. Đó là cách một máy có nhiều địa chỉ công khai giữ các trang của nó tách bạch.</span></div>
  <div class="kv"><span class="k">127.0.0.1 là một biện pháp BẢO MẬT thật</span><span class="v">Buộc một endpoint quản trị hay một trang chỉ số vào loopback nghĩa là từ mạng KHÔNG thể chạm tới nó — không cần luật tường lửa, không con lỗi xác thực nào và không một <code>location</code> cấu hình sai nào phơi nó ra được, vì cái socket ấy không hề nghe ở chỗ mà ai đó kết nối tới được.</span></div>
  <div class="kv"><span class="k">Cổng dưới 1024 cần đặc quyền của MASTER</span><span class="v">Đó chính là lý do master chạy bằng root (Bài 0.2). Trong một container không có năng lực đó, hãy buộc vào một cổng cao rồi ánh xạ ra — và đó là lý do rất nhiều ảnh container nghe ở 8080.</span></div>
</div>

<h3>Những cờ THUỘC VỀ CỔNG, không thuộc về khối</h3>
<div class="pitfall">
<p><strong>Bẫy — <code>default_server</code>, <code>ssl</code>, <code>http2</code> và <code>reuseport</code> KHÔNG phải thuộc tính của một khối server; chúng là thuộc tính của cái SOCKET đang nghe.</strong> Hệ quả cụ thể: chỉ MỘT khối trên mỗi cặp địa chỉ:cổng được mang cờ <code>default_server</code>, và khai nó ở hai chỗ là một lỗi lúc khởi động — <code>duplicate default server for 0.0.0.0:80</code>. Hệ quả tinh vi hơn: những cờ ấy được lấy từ khối ĐẦU TIÊN khai cái cổng đó rồi áp cho TẤT CẢ, nên bật <code>ssl</code> ở một khối 443 mà quên ở khối 443 khác thì cả hai vẫn dùng TLS. Hãy nghĩ theo hướng "cổng NÀY được cấu hình thế nào", đừng nghĩ theo hướng "khối này được cấu hình thế nào".</p>
</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Bước 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Khớp cái SOCKET</span><span class="lz-nsub">Kết nối tới trên địa chỉ:cổng nào · địa chỉ cụ thể thắng ký tự đại diện · chính bài này</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bước 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Khớp server_name</span><span class="lz-nsub">Trong nhóm ứng viên đó, so header Host theo bốn mức ưu tiên · Bài 1.2</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bước 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không khớp gì → máy chủ MẶC ĐỊNH</span><span class="lz-nsub">Của riêng cổng đó · và nếu không khai thì là khối ĐẦU TIÊN · Bài 1.3</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bước 4</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chọn location</span><span class="lz-nsub">CHỈ tới đây mới bắt đầu, và chỉ BÊN TRONG khối đã chọn xong · Chương 2</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Xem NGINX thật sự đang nghe ở đâu — đừng đọc cấu hình rồi đoán</span>
ss -tlnp | grep nginx
<span class="tok-comment"># LISTEN 0 511  0.0.0.0:8080  0.0.0.0:*  users:(("nginx",pid=3218,fd=6))</span>

<span class="tok-comment"># Va gom moi listen dang hieu luc, ke ca trong cac tep include:</span>
nginx -T | grep -nE '^\\\\s*(listen|server_name)'</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cổng bị chiếm là thứ đầu tiên nên kiểm</span><span class="lz-lnote"><code>bind() to 0.0.0.0:80 failed (98: Address already in use)</code> nghĩa là có thứ khác đang giữ cái cổng đó — thường là một Nginx cũ chưa thoát, hoặc Apache. <code>ss -tlnp</code> gọi tên được cái tiến trình ấy, và điều đó nhanh hơn mọi mức độ đọc cấu hình.</span></div>
  <div class="lz-layer"><span class="lz-lname">IPv6 thường cần một dòng listen RIÊNG</span><span class="lz-lnote">Nginx hiện đại đặt <code>ipv6only=on</code> theo mặc định, nên <code>listen [::]:80;</code> chỉ phục vụ IPv6 và bạn cần thêm cả <code>listen 80;</code>. Một trang chạy được từ máy này mà hết giờ từ máy kia thì rất thường xuyên chính là chuyện đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đứng sau một proxy thì listen KHÔNG phải cái client đã dùng</span><span class="lz-lnote">Một bộ cân bằng tải kết thúc TLS rồi kết nối tới Nginx của bạn bằng HTTP trần, nên <code>$scheme</code> nói là <code>http</code> dù người dùng gõ <code>https</code>. Chương 3 và Chương 11 vá chuyện đó bằng các header chuyển tiếp và <code>real_ip</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">reuseport là một công tắc hiệu năng có gài mìn</span><span class="lz-lnote">Nó cho mỗi worker một socket nghe riêng, hữu ích khi tốc độ kết nối rất cao — và nó chỉ được xuất hiện MỘT lần cho mỗi địa chỉ:cổng. Hãy ĐO trước khi bật; trên phần lớn trang thì nó chẳng đổi gì mà bạn phát hiện được.</span></div>
</div>
<div class="note-ct">
<p><strong>Đọc một cấu hình thì hãy đọc theo CỔNG, đừng đọc theo TỆP.</strong> Trên một máy chủ thật với mười tệp dưới <code>sites-enabled</code>, câu hỏi hữu ích không phải "tệp này nói gì" mà là "cổng 443 có những khối server nào, và cái nào là mặc định". Một câu <code>nginx -T | grep -E 'listen|server_name'</code> trả lời đúng câu đó trong một màn hình, và nó là cách nhanh nhất để thấy hai trang đang giẫm lên nhau — thứ mà đọc từng tệp một sẽ không bao giờ lộ ra.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#listen" target="_blank" rel="noopener"><span class="lc-ico">🔌</span><span class="lc-body"><span class="lc-title">nginx — listen</span><span class="lc-sub">nginx.org · Mọi tham số, kể cả những cái thuộc về CỔNG chứ không thuộc về khối</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">nginx — nginx xử lý một request thế nào</span><span class="lc-sub">nginx.org · Bốn bước ở trên, lấy từ nguồn sự thật</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#server" target="_blank" rel="noopener"><span class="lc-ico">🏠</span><span class="lc-body"><span class="lc-title">nginx — khối server</span><span class="lc-sub">nginx.org · Một máy chủ ảo là cái gì, và nó được chứa những gì</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">ss và lsof để tìm ra tiến trình nào đang giữ một cái cổng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Buộc một trang vào loopback và một trang vào địa chỉ đại diện, rồi chứng minh cái nào trả lời</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — server_name, and the four levels of precedence|||1.2 — server_name, và bốn mức ưu tiên',
      slug: 'nginx-1-2-server-name',
      type: 'LESSON',
      description: 'Bốn mức, một thứ tự cố định, và cái mức mà ai cũng đoán sai: một biểu thức chính quy KHÔNG thắng một ký tự đại diện. Bài này chạy sáu cái Host thật vào sáu khối server thật rồi in ra khối nào trả lời — trong đó có một dòng làm phần lớn người đọc phải nhìn lại lần hai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>server_name, and the four levels of precedence</h2>
<p class="lead">Once Nginx has the candidate blocks for a socket, it compares the <code>Host</code> header against their names — and it does so in a fixed order that has nothing to do with the order the blocks appear in your file. Four levels, checked in sequence, first match wins.</p>

<h3>Six hosts, six blocks, measured</h3>
<pre><code>server { listen 8080; server_name mot.vidu.com;   … }  <span class="tok-comment"># 1 · khớp chính xác</span>
server { listen 8080; server_name *.vidu.com;     … }  <span class="tok-comment"># 2 · đại diện ở ĐẦU</span>
server { listen 8080; server_name www.vidu.*;     … }  <span class="tok-comment"># 3 · đại diện ở CUỐI</span>
server { listen 8080; server_name ~^may(?&lt;so&gt;\\\\d+)\\\\.vidu\\\\.com$; … } <span class="tok-comment"># 4 · regex</span></code></pre>
<div class="out">Host gui len             cong   khoi server nao tra loi
------------------------ -----  ------------------------------------
mot.vidu.com             8080   1 · ten CHINH XAC: mot.vidu.com
bat-ky.vidu.com          8080   2 · dai dien DAU: *.vidu.com
www.vidu.net             8080   3 · dai dien CUOI: www.vidu.*
may42.vidu.com           8080   2 · dai dien DAU: *.vidu.com     &lt;- KHONG phai regex!
khong-khop.com           8080   1 · ten CHINH XAC: mot.vidu.com  &lt;- may chu MAC DINH</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Level 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Exact name</span><span class="lz-nsub">vidu.com · www.vidu.com · stored in a hash table, so it costs nothing however many you have</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Level 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Leading wildcard</span><span class="lz-nsub">*.vidu.com · the longest matching one wins · covers any single label in front</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Level 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Trailing wildcard</span><span class="lz-nsub">www.vidu.* · again longest first · for one site across several top-level domains</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Level 4</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Regular expression</span><span class="lz-nsub">~^may\\\\d+\\\\.vidu\\\\.com$ · LAST, and here in FILE ORDER, first match wins</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Bẫy — a regular expression does NOT beat a wildcard, and the fourth row above is the proof.</strong> <code>may42.vidu.com</code> matches both <code>*.vidu.com</code> and <code>~^may(\\\\d+)\\\\.vidu\\\\.com$</code>, and the wildcard wins because leading wildcards are level 2 and regexes are level 4. People expect the "more specific" pattern to win; Nginx does not rank by specificity, it ranks by <em>kind</em>. So a catch-all <code>*.example.com</code> block silently swallows every regex block for that domain — and the regex block, which you can see right there in the file, never runs. If you need a regex to win, remove the wildcard that shadows it.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Exact names are free</span><span class="v">Nginx puts them in hash tables, so a thousand exact names cost the same as one. If you find yourself reaching for a regex to avoid listing names, list the names — one <code>server_name</code> directive takes as many as you like, space-separated.</span></div>
  <div class="kv"><span class="k">Wildcards cover exactly one label</span><span class="v"><code>*.vidu.com</code> matches <code>a.vidu.com</code> and it does <em>not</em> match <code>vidu.com</code> itself, nor does the star span dots the way a shell glob would. Sites that need both list both: <code>server_name vidu.com *.vidu.com;</code>.</span></div>
  <div class="kv"><span class="k">The star must be at one end</span><span class="v"><code>*.vidu.com</code> and <code>www.vidu.*</code> are valid; <code>www.*.com</code> is not, and Nginx rejects it at startup. Anything in the middle is a job for a regular expression.</span></div>
  <div class="kv"><span class="k">Regexes are the only level with capture groups</span><span class="v"><code>~^(?&lt;khach&gt;.+)\\\\.vidu\\\\.com$</code> makes <code>$khach</code> usable inside that block — for a <code>root</code> path, a <code>proxy_pass</code> target or a log field. That is the real reason to use one, not specificity.</span></div>
</div>

<h3>Details worth knowing before they bite</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Matching is case-insensitive, and the port is ignored</span><span class="lz-lnote">A <code>Host</code> of <code>VIDU.com:8080</code> matches <code>server_name vidu.com;</code> — Nginx lowercases and strips the port before comparing. So you never need to list case variants or port suffixes.</span></div>
  <div class="lz-layer"><span class="lz-lname">Regexes are checked in file order, unlike everything else</span><span class="lz-lnote">Levels 1 to 3 use lookup structures where order is irrelevant. Level 4 is a list walked top to bottom, so two overlapping regexes are resolved by which one you wrote first — the only place in server selection where file order matters.</span></div>
  <div class="lz-layer"><span class="lz-lname">An empty server_name matches a missing Host</span><span class="lz-lnote"><code>server_name "";</code> catches requests that arrive with no <code>Host</code> header at all, which HTTP/1.0 clients and some scanners still do. Useful for returning 444 to junk traffic rather than letting it reach the default server.</span></div>
  <div class="lz-layer"><span class="lz-lname">Long names need a bigger bucket</span><span class="lz-lnote"><code>could not build server_names_hash, you should increase server_names_hash_bucket_size</code> is a startup error, not a warning, and it means exactly what it says. Raise it to the next power of two; it is not a sign that anything else is wrong.</span></div>
</div>
<pre><code><span class="tok-comment"># Bắt được tên miền con và DÙNG nó — lý do thật để viết regex</span>
server {
  listen 8080;
  server_name ~^(?&lt;khach&gt;[a-z0-9-]+)\\\\.vidu\\\\.com$;

  root /srv/khach/$khach;              <span class="tok-comment"># mỗi khách một thư mục</span>
  access_log /var/log/nginx/$khach.log;
}</code></pre>
<div class="note-ct">
<p><strong>The rule to carry away.</strong> Nginx ranks by KIND, not by how specific a pattern looks: exact, then leading wildcard, then trailing wildcard, then regex — and the first hit ends the search. When a request lands on a block you did not expect, the question is never "which pattern is more precise" but "which level does each pattern belong to", and the answer is usually that something two levels higher matched first. Reach for a regular expression when you need a capture group, and reach for a plain list of names the rest of the time.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/server_names.html" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">nginx — server names</span><span class="lc-sub">nginx.org · The precedence list, wildcards, regexes and the hash sizing</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">nginx — how nginx processes a request</span><span class="lc-sub">nginx.org · Where name matching sits in the four-step sequence</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#server_names_hash_bucket_size" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">nginx — server_names_hash_bucket_size</span><span class="lc-sub">nginx.org · The startup error, and what to set it to</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">The Host header, virtual hosting, and reading a hostname right to left</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Write a regex block, watch a wildcard shadow it, then remove the wildcard</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>server_name, và bốn mức ưu tiên</h2>
<p class="lead">Khi Nginx đã có danh sách khối ứng viên cho một socket, nó đem header <code>Host</code> ra so với tên của chúng — và nó so theo một thứ tự CỐ ĐỊNH chẳng liên quan gì tới thứ tự các khối xuất hiện trong tệp của bạn. Bốn mức, kiểm tuần tự, khớp đầu tiên là thắng.</p>

<h3>Sáu cái Host, sáu khối, đo thật</h3>
<pre><code>server { listen 8080; server_name mot.vidu.com;   … }  <span class="tok-comment"># 1 · khớp chính xác</span>
server { listen 8080; server_name *.vidu.com;     … }  <span class="tok-comment"># 2 · đại diện ở ĐẦU</span>
server { listen 8080; server_name www.vidu.*;     … }  <span class="tok-comment"># 3 · đại diện ở CUỐI</span>
server { listen 8080; server_name ~^may(?&lt;so&gt;\\\\d+)\\\\.vidu\\\\.com$; … } <span class="tok-comment"># 4 · regex</span></code></pre>
<div class="out">Host gui len             cong   khoi server nao tra loi
------------------------ -----  ------------------------------------
mot.vidu.com             8080   1 · ten CHINH XAC: mot.vidu.com
bat-ky.vidu.com          8080   2 · dai dien DAU: *.vidu.com
www.vidu.net             8080   3 · dai dien CUOI: www.vidu.*
may42.vidu.com           8080   2 · dai dien DAU: *.vidu.com     &lt;- KHONG phai regex!
khong-khop.com           8080   1 · ten CHINH XAC: mot.vidu.com  &lt;- may chu MAC DINH</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Mức 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tên CHÍNH XÁC</span><span class="lz-nsub">vidu.com · www.vidu.com · lưu trong bảng băm, nên có bao nhiêu cái cũng không tốn gì</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Mức 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đại diện ở ĐẦU</span><span class="lz-nsub">*.vidu.com · cái khớp DÀI NHẤT thắng · phủ được đúng một nhãn ở phía trước</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Mức 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đại diện ở CUỐI</span><span class="lz-nsub">www.vidu.* · cũng dài nhất trước · dành cho một trang trải trên nhiều tên miền cấp cao</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Mức 4</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Biểu thức chính quy</span><span class="lz-nsub">~^may\\\\d+\\\\.vidu\\\\.com$ · CUỐI CÙNG, và ở đây thì theo THỨ TỰ TRONG TỆP, cái khớp đầu tiên thắng</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một biểu thức chính quy KHÔNG thắng một ký tự đại diện, và hàng thứ tư ở trên là bằng chứng.</strong> <code>may42.vidu.com</code> khớp CẢ <code>*.vidu.com</code> lẫn <code>~^may(\\\\d+)\\\\.vidu\\\\.com$</code>, và cái đại diện THẮNG, vì đại diện ở đầu là mức 2 còn regex là mức 4. Người ta trông đợi cái mẫu "cụ thể hơn" sẽ thắng; Nginx thì KHÔNG xếp hạng theo độ cụ thể, nó xếp hạng theo <em>LOẠI</em>. Nên một khối bắt-tất <code>*.example.com</code> sẽ lặng lẽ nuốt mọi khối regex của tên miền đó — còn cái khối regex, thứ bạn nhìn thấy ngay đó trong tệp, thì chẳng bao giờ chạy. Nếu bạn cần regex thắng thì phải GỠ cái đại diện đang che nó đi.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tên chính xác thì MIỄN PHÍ</span><span class="v">Nginx đặt chúng vào bảng băm, nên một nghìn tên chính xác tốn đúng bằng một cái. Nếu bạn thấy mình với tay lấy regex chỉ để khỏi phải liệt kê tên thì hãy cứ LIỆT KÊ — một directive <code>server_name</code> nhận bao nhiêu tên cũng được, cách nhau bằng dấu cách.</span></div>
  <div class="kv"><span class="k">Ký tự đại diện phủ ĐÚNG MỘT nhãn</span><span class="v"><code>*.vidu.com</code> khớp <code>a.vidu.com</code> và nó <em>KHÔNG</em> khớp chính <code>vidu.com</code>, mà dấu sao cũng không nhảy qua được dấu chấm theo kiểu glob của shell. Trang nào cần cả hai thì liệt kê cả hai: <code>server_name vidu.com *.vidu.com;</code>.</span></div>
  <div class="kv"><span class="k">Dấu sao phải nằm ở MỘT ĐẦU</span><span class="v"><code>*.vidu.com</code> và <code>www.vidu.*</code> thì hợp lệ; <code>www.*.com</code> thì không, và Nginx từ chối nó ngay lúc khởi động. Bất cứ thứ gì nằm ở GIỮA đều là việc của một biểu thức chính quy.</span></div>
  <div class="kv"><span class="k">Regex là mức DUY NHẤT có nhóm bắt</span><span class="v"><code>~^(?&lt;khach&gt;.+)\\\\.vidu\\\\.com$</code> làm cho <code>$khach</code> dùng được bên trong khối đó — cho một đường dẫn <code>root</code>, một đích <code>proxy_pass</code> hay một trường trong log. ĐÓ mới là lý do THẬT để dùng regex, không phải chuyện độ cụ thể.</span></div>
</div>

<h3>Vài chi tiết đáng biết trước khi bị chúng cắn</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Việc khớp KHÔNG phân biệt hoa thường, và cổng thì bị bỏ qua</span><span class="lz-lnote">Một cái <code>Host</code> là <code>VIDU.com:8080</code> vẫn khớp <code>server_name vidu.com;</code> — Nginx hạ chữ và cắt phần cổng đi TRƯỚC khi so. Nên bạn chẳng bao giờ phải liệt kê các biến thể hoa thường hay các đuôi cổng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Regex được kiểm theo THỨ TỰ TRONG TỆP, khác với mọi mức còn lại</span><span class="lz-lnote">Mức 1 tới 3 dùng cấu trúc tra cứu nên thứ tự chẳng liên quan gì. Mức 4 là một DANH SÁCH duyệt từ trên xuống, nên hai regex chồng lấn nhau được phân xử bằng việc bạn viết cái nào TRƯỚC — chỗ DUY NHẤT trong việc chọn server mà thứ tự trong tệp có ý nghĩa.</span></div>
  <div class="lz-layer"><span class="lz-lname">server_name rỗng khớp với request KHÔNG có Host</span><span class="lz-lnote"><code>server_name "";</code> bắt những request tới mà hoàn toàn không có header <code>Host</code> nào, thứ mà client HTTP/1.0 và vài bộ quét vẫn còn gửi. Hữu ích để trả 444 cho lưu lượng rác thay vì để nó chạm tới máy chủ mặc định.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tên dài thì cần cái xô to hơn</span><span class="lz-lnote"><code>could not build server_names_hash, you should increase server_names_hash_bucket_size</code> là một LỖI lúc khởi động chứ không phải cảnh báo, và nó nghĩa đúng như nó viết. Hãy nâng lên luỹ thừa hai kế tiếp; nó KHÔNG phải dấu hiệu rằng có gì khác đang hỏng.</span></div>
</div>
<pre><code><span class="tok-comment"># Bắt được tên miền con và DÙNG nó — lý do thật để viết regex</span>
server {
  listen 8080;
  server_name ~^(?&lt;khach&gt;[a-z0-9-]+)\\\\.vidu\\\\.com$;

  root /srv/khach/$khach;              <span class="tok-comment"># mỗi khách một thư mục</span>
  access_log /var/log/nginx/$khach.log;
}</code></pre>
<div class="note-ct">
<p><strong>Cái luật đáng mang theo.</strong> Nginx xếp hạng theo LOẠI, không theo việc một cái mẫu trông cụ thể tới đâu: chính xác, rồi đại diện đầu, rồi đại diện cuối, rồi regex — và cái khớp đầu tiên kết thúc cuộc tìm kiếm. Khi một request rơi vào cái khối mà bạn không ngờ tới, câu hỏi KHÔNG BAO GIỜ là "mẫu nào chính xác hơn" mà là "mỗi mẫu thuộc về MỨC nào", và câu trả lời thường là có thứ gì đó ở mức cao hơn hai bậc đã khớp trước. Hãy với tay lấy biểu thức chính quy khi bạn cần một NHÓM BẮT, và với tay lấy một danh sách tên thường trong mọi trường hợp còn lại.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/server_names.html" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">nginx — tên máy chủ</span><span class="lc-sub">nginx.org · Danh sách ưu tiên, ký tự đại diện, regex và cách chỉnh kích thước bảng băm</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">nginx — nginx xử lý một request thế nào</span><span class="lc-sub">nginx.org · Việc khớp tên nằm ở đâu trong chuỗi bốn bước</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#server_names_hash_bucket_size" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">nginx — server_names_hash_bucket_size</span><span class="lc-sub">nginx.org · Cái lỗi lúc khởi động, và nên đặt nó bằng bao nhiêu</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Web</span><span class="lc-sub">Header Host, máy chủ ảo, và cách đọc một hostname từ phải sang trái</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Viết một khối regex, nhìn một ký tự đại diện che mất nó, rồi gỡ cái đại diện đi</span></span></a>
</div>
`,
    },
  ],
};
