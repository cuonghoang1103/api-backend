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
  ],
};
