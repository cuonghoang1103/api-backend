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
<pre><code>listen 80;                 <span class="tok-comment"># every IPv4 address, port 80 — same as 0.0.0.0:80</span>
listen 127.0.0.1:8080;     <span class="tok-comment"># loopback ONLY — nothing off-box can reach it</span>
listen 192.0.2.10:443 ssl; <span class="tok-comment"># one specific address, with TLS — Chapter 6</span>
listen [::]:80;            <span class="tok-comment"># IPv6; on Linux the default SHARES IPv4 as well</span>
listen [::]:80 ipv6only=on;<span class="tok-comment"># IPv6 ONLY — now nginx's default</span>
listen 8080 default_server;<span class="tok-comment"># the default server FOR THIS PORT — Lesson 1.3</span>

<span class="tok-comment"># One server block can listen on SEVERAL sockets:</span>
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
<p><strong>Trap — <code>default_server</code>, <code>ssl</code>, <code>http2</code> and <code>reuseport</code> are not properties of a server block; they are properties of the listening SOCKET.</strong> The concrete consequence: only ONE block per address:port pair may carry <code>default_server</code>, and declaring it twice is a startup error — <code>duplicate default server for 0.0.0.0:80</code>. The subtler consequence: those flags are taken from the FIRST block that declares the port and then apply to all of them, so enabling <code>ssl</code> on one 443 block and forgetting it on another still gives you TLS on both. Think "how is this port configured", not "how is this block configured".</p>
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
<pre><code><span class="tok-comment"># See where NGINX is actually listening — do not read the config and guess</span>
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
<pre><code>server { listen 8080; server_name mot.vidu.com;   … }  <span class="tok-comment"># 1 · exact match</span>
server { listen 8080; server_name *.vidu.com;     … }  <span class="tok-comment"># 2 · leading wildcard</span>
server { listen 8080; server_name www.vidu.*;     … }  <span class="tok-comment"># 3 · trailing wildcard</span>
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
<p><strong>Trap — a regular expression does NOT beat a wildcard, and the fourth row above is the proof.</strong> <code>may42.vidu.com</code> matches both <code>*.vidu.com</code> and <code>~^may(\\\\d+)\\\\.vidu\\\\.com$</code>, and the wildcard wins because leading wildcards are level 2 and regexes are level 4. People expect the "more specific" pattern to win; Nginx does not rank by specificity, it ranks by <em>kind</em>. So a catch-all <code>*.example.com</code> block silently swallows every regex block for that domain — and the regex block, which you can see right there in the file, never runs. If you need a regex to win, remove the wildcard that shadows it.</p>
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
<pre><code><span class="tok-comment"># Capture the subdomain and USE it — the real reason to write a regex</span>
server {
  listen 8080;
  server_name ~^(?&lt;khach&gt;[a-z0-9-]+)\\\\.vidu\\\\.com$;

  root /srv/khach/$khach;              <span class="tok-comment"># one directory per customer</span>
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

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — The default server, and the site you did not mean to publish|||1.3 — Máy chủ mặc định, và cái trang bạn không định công bố',
      slug: 'nginx-1-3-may-chu-mac-dinh',
      type: 'LESSON',
      description: 'Khi không tên nào khớp, Nginx VẪN trả lời — bằng máy chủ mặc định của cổng đó, và nếu bạn không khai thì đó là khối ĐẦU TIÊN, tức là một trang được chọn bởi thứ tự chữ cái của tên tệp. Bài này chạy thật ba cổng với ba cách xử lý khác nhau và chỉ ra cái nào nên là mặc định của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>The default server, and the site you did not mean to publish</h2>
<p class="lead">Lesson 1.2 covered what happens when a name matches. This one covers what happens when none does — which is not an error, and not a 404. Nginx picks a block anyway, and unless you have said which, it picks one for a reason that has nothing to do with your intent.</p>

<h3>Three ports, three behaviours, measured</h3>
<div class="out">cong     Host               ket qua
-----    -----------------  -----------------------------------
8080     a.vidu.com         8080 · khoi DAU TIEN (a.vidu.com)
8080     b.vidu.com         8080 · khoi thu hai (b.vidu.com)
8080     la-hoac.com        8080 · khoi DAU TIEN (a.vidu.com)   &lt;- khong khai gi

8081     c.vidu.com         8081 · c.vidu.com
8081     la-hoac.com        8081 · MAC DINH tuong minh          &lt;- co default_server

8082     d.vidu.com         8082 · d.vidu.com
8082     la-hoac.com        (curl thoat ma 52: khong co phan hoi) &lt;- return 444</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Port 8080</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nothing declared</span><span class="lz-nsub">The FIRST block on that port becomes the default · chosen by file order, not by intent</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Port 8081</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">default_server on the second block</span><span class="lz-nsub">Position stops mattering · the flag decides, wherever it sits in the file</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Port 8082</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A default that refuses</span><span class="lz-nsub">return 444 · connection closed with no response at all · nothing is published by accident</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">The rule</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Every port always has a default</span><span class="lz-nsub">You only choose whether it is deliberate · there is no configuration where one does not exist</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Trap — the accidental default is how an internal site ends up answering the public internet.</strong> On a server with several <code>sites-enabled</code> files, the first block on port 443 is whichever file sorts first alphabetically — <code>admin.conf</code> comes before <code>www.conf</code>. So a scanner hitting your IP address directly, with no <code>Host</code> or a junk one, reaches the admin panel rather than the marketing site, and nothing in your configuration says that was the plan. Worse, it is invisible in testing: every request you make carries a real <code>Host</code> and matches a real block, so the default path is the one nobody exercises. Declare <code>default_server</code> explicitly on every port you listen on, and make it the block you would choose to show a stranger.</p>
</div>

<h3>What a deliberate default should do</h3>
<pre><code><span class="tok-comment"># Option A — REFUSE OUTRIGHT. Pick this when every site has its own domain.</span>
server {
  listen 80  default_server;
  listen 443 ssl default_server;
  server_name _;                       <span class="tok-comment"># "_" is just a name that NEVER matches</span>

  ssl_certificate     /etc/nginx/tls/tam.crt;   <span class="tok-comment"># still needs a certificate — see below</span>
  ssl_certificate_key /etc/nginx/tls/tam.key;

  return 444;                          <span class="tok-comment"># closes the connection, returns NO bytes</span>
}

<span class="tok-comment"># Option B — answer politely. Pick this when real users mistype.</span>
server {
  listen 80 default_server;
  server_name _;
  return 301 https://vidu.com$request_uri;   <span class="tok-comment"># send them to the main site</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">444 is an Nginx-only code, and it is the right one here</span><span class="v">It is not a real HTTP status — it tells Nginx to close the connection without sending anything. Scanners get nothing to fingerprint, no error page reveals your server version, and the request costs you one closed socket instead of a rendered response.</span></div>
  <div class="kv"><span class="k">server_name _ is not special syntax</span><span class="v">It is simply an invalid hostname that can never match a real <code>Host</code>, so the block is only ever reached through <code>default_server</code>. Any unmatchable string would do; <code>_</code> is the convention. The flag does the work, not the underscore.</span></div>
  <div class="kv"><span class="k">The default on 443 still needs a certificate</span><span class="v">TLS is negotiated before Nginx has seen a single HTTP header, so the handshake must complete before <code>return 444</code> can run. Without a certificate on the default block, clients get a TLS error instead — which looks like a broken site rather than a deliberate refusal. A self-signed one is fine.</span></div>
  <div class="kv"><span class="k">Declare it once per address:port</span><span class="v">Per Lesson 1.1 the flag belongs to the socket, so one block per port carries it and a second is a startup error. On a dual-stack server that means both the IPv4 and IPv6 listen lines of the same block.</span></div>
</div>

<h3>Choosing between them</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Refuse when every legitimate request has a name</span><span class="lz-lnote">An API, an internal tool, anything reached only through DNS you control. Nobody types your IP address on purpose, so a request without a matching name is a scanner — and giving it nothing is both cheaper and quieter than giving it a page.</span></div>
  <div class="lz-layer"><span class="lz-lname">Redirect when humans arrive by mistake</span><span class="lz-lnote">A consumer site where <code>vidu.com</code> and <code>www.vidu.com</code> both exist and people reach the wrong one, or an old domain still in circulation. A <code>301</code> to the canonical host is friendlier than silence and costs nothing.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never make a real site the default by accident</span><span class="lz-lnote">If your marketing site happens to be first in the file, it is now also the answer for every scan, every stale DNS record and every misdirected request — and its logs fill with hostnames that have nothing to do with it. Deliberate is the whole point.</span></div>
  <div class="lz-layer"><span class="lz-lname">Log the default separately</span><span class="lz-lnote">Give the default block its own <code>access_log</code>. It becomes a clean record of who is probing your address directly, which is genuinely useful, and it keeps that noise out of your real sites' logs.</span></div>
</div>
<pre><code><span class="tok-comment"># Kiem xem cong nao dang co may chu mac dinh, ke ca trong cac tep include</span>
nginx -T | grep -n 'default_server'

<span class="tok-comment"># Va thu CHINH CAI DUONG DO — dung Host that, dung mot cai vo nghia</span>
curl -s -o /dev/null -w '%{http_code}\\\\n' -H 'Host: khong-ton-tai.invalid' http://vidu.com/</code></pre>
<div class="note-ct">
<p><strong>Test the path nobody tests.</strong> Every request you make while developing carries a <code>Host</code> that matches a block, so the default server is the one code path in your configuration that normal use never touches — and therefore the one that stays wrong for years. One <code>curl</code> with a nonsense <code>Host</code>, run once per environment, tells you exactly what a stranger connecting to your IP address sees. Do it now for whatever you have in production; the answer is quite often a site you forgot was on that machine.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html#how_to_prevent_undefined_server_names" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">nginx — preventing undefined server names</span><span class="lc-sub">nginx.org · The official pattern for the refusing default block</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#return" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">nginx — return</span><span class="lc-sub">nginx.org · Including 444, and returning a redirect without a rewrite</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/configuring_https_servers.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">nginx — configuring HTTPS servers</span><span class="lc-sub">nginx.org · Why the default block on 443 needs its own certificate</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">DNS, the Host header, and what reaching an IP address directly means</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Reach a site you did not intend to publish, then add a refusing default and try again</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Máy chủ mặc định, và cái trang bạn không định công bố</h2>
<p class="lead">Bài 1.2 nói về chuyện gì xảy ra khi MỘT tên khớp. Bài này nói về chuyện gì xảy ra khi KHÔNG tên nào khớp — mà đó không phải một lỗi, và cũng không phải một cái 404. Nginx VẪN chọn một khối, và nếu bạn chưa nói là khối nào thì nó chọn một cái vì một lý do chẳng liên quan gì tới ý định của bạn.</p>

<h3>Ba cổng, ba hành vi, đo thật</h3>
<div class="out">cong     Host               ket qua
-----    -----------------  -----------------------------------
8080     a.vidu.com         8080 · khoi DAU TIEN (a.vidu.com)
8080     b.vidu.com         8080 · khoi thu hai (b.vidu.com)
8080     la-hoac.com        8080 · khoi DAU TIEN (a.vidu.com)   &lt;- khong khai gi

8081     c.vidu.com         8081 · c.vidu.com
8081     la-hoac.com        8081 · MAC DINH tuong minh          &lt;- co default_server

8082     d.vidu.com         8082 · d.vidu.com
8082     la-hoac.com        (curl thoat ma 52: khong co phan hoi) &lt;- return 444</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Cổng 8080</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không khai gì cả</span><span class="lz-nsub">Khối ĐẦU TIÊN trên cổng đó trở thành mặc định · chọn theo thứ tự trong tệp, không theo ý định</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cổng 8081</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">default_server ở khối THỨ HAI</span><span class="lz-nsub">Vị trí thôi không còn ý nghĩa · cái CỜ quyết định, dù nó nằm ở đâu trong tệp</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cổng 8082</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một mặc định TỪ CHỐI</span><span class="lz-nsub">return 444 · đóng kết nối, không trả về gì cả · không có gì bị công bố ngoài ý muốn</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cái luật</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">MỌI cổng đều LUÔN có một mặc định</span><span class="lz-nsub">Bạn chỉ chọn được là nó CÓ CHỦ Ý hay không · không có cấu hình nào mà nó không tồn tại</span></div></div>
  </div>
</div>
<div class="pitfall">
<p><strong>Bẫy — cái mặc định VÔ TÌNH chính là cách một trang nội bộ đi trả lời cả Internet.</strong> Trên một máy chủ có nhiều tệp trong <code>sites-enabled</code>, khối đầu tiên trên cổng 443 là tệp nào xếp trước theo bảng chữ cái — <code>admin.conf</code> đứng trước <code>www.conf</code>. Nên một bộ quét đập thẳng vào địa chỉ IP của bạn, không có <code>Host</code> hoặc mang một cái Host rác, sẽ tới được BẢNG QUẢN TRỊ chứ không phải trang giới thiệu, và chẳng có dòng nào trong cấu hình nói rằng đó là kế hoạch. Tệ hơn, nó VÔ HÌNH lúc kiểm thử: mọi request bạn tự gửi đều mang một <code>Host</code> thật và khớp một khối thật, nên cái đường mặc định là cái đường chẳng ai đi qua. Hãy khai <code>default_server</code> TƯỜNG MINH trên mọi cổng bạn nghe, và hãy làm cho nó là cái khối mà bạn sẽ CHỌN để cho một người lạ xem.</p>
</div>

<h3>Một cái mặc định CÓ CHỦ Ý thì nên làm gì</h3>
<pre><code><span class="tok-comment"># Phương án A — TỪ CHỐI THẲNG. Chọn cái này khi mọi trang đều có tên miền.</span>
server {
  listen 80  default_server;
  listen 443 ssl default_server;
  server_name _;                       <span class="tok-comment"># "_" chỉ là một cái tên KHÔNG BAO GIỜ khớp</span>

  ssl_certificate     /etc/nginx/tls/tam.crt;   <span class="tok-comment"># vẫn cần chứng chỉ — xem bên dưới</span>
  ssl_certificate_key /etc/nginx/tls/tam.key;

  return 444;                          <span class="tok-comment"># đóng kết nối, KHÔNG trả byte nào</span>
}

<span class="tok-comment"># Phương án B — trả lời tử tế. Chọn cái này khi có người dùng thật gõ nhầm.</span>
server {
  listen 80 default_server;
  server_name _;
  return 301 https://vidu.com$request_uri;   <span class="tok-comment"># đưa họ về trang chính</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">444 là mã RIÊNG của Nginx, và ở đây nó là cái đúng</span><span class="v">Nó không phải một mã trạng thái HTTP thật — nó bảo Nginx ĐÓNG kết nối mà không gửi gì cả. Bộ quét chẳng có gì để nhận dạng, không trang lỗi nào lộ ra phiên bản máy chủ của bạn, và cái request đó tốn của bạn MỘT socket đóng lại thay vì một phản hồi đã dựng xong.</span></div>
  <div class="kv"><span class="k">server_name _ KHÔNG phải cú pháp đặc biệt</span><span class="v">Nó đơn giản là một hostname KHÔNG hợp lệ nên không bao giờ khớp được một cái <code>Host</code> thật, do đó khối ấy chỉ tới được qua đúng <code>default_server</code>. Chuỗi vô nghĩa nào cũng được; <code>_</code> chỉ là quy ước. CÁI CỜ mới làm việc, không phải cái gạch dưới.</span></div>
  <div class="kv"><span class="k">Cái mặc định trên 443 VẪN cần chứng chỉ</span><span class="v">TLS được thương lượng TRƯỚC khi Nginx nhìn thấy dù chỉ một header HTTP, nên cái bắt tay phải xong thì <code>return 444</code> mới chạy được. Không có chứng chỉ trên khối mặc định thì client nhận một lỗi TLS — nhìn như một trang HỎNG chứ không phải một sự từ chối có chủ ý. Một chứng chỉ tự ký là đủ.</span></div>
  <div class="kv"><span class="k">Khai đúng MỘT lần cho mỗi địa chỉ:cổng</span><span class="v">Theo Bài 1.1, cái cờ thuộc về SOCKET, nên một khối trên mỗi cổng mang nó và cái thứ hai là lỗi lúc khởi động. Trên một máy chủ hai ngăn xếp thì nghĩa là CẢ dòng listen IPv4 lẫn dòng IPv6 của cùng khối đó.</span></div>
</div>

<h3>Chọn giữa hai phương án</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">TỪ CHỐI khi mọi request chính đáng đều có TÊN</span><span class="lz-lnote">Một API, một công cụ nội bộ, bất cứ thứ gì chỉ tới được qua DNS mà bạn quản. Chẳng ai gõ địa chỉ IP của bạn một cách có chủ đích, nên một request không khớp tên nào là một bộ quét — và cho nó KHÔNG GÌ CẢ thì vừa rẻ hơn vừa yên tĩnh hơn là cho nó một trang.</span></div>
  <div class="lz-layer"><span class="lz-lname">CHUYỂN HƯỚNG khi có con người tới nhầm</span><span class="lz-lnote">Một trang cho người tiêu dùng nơi cả <code>vidu.com</code> lẫn <code>www.vidu.com</code> đều tồn tại và người ta tới nhầm cái, hoặc một tên miền cũ vẫn còn lưu hành. Một cái <code>301</code> về host chuẩn thì thân thiện hơn sự im lặng và chẳng tốn gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng bao giờ để một trang THẬT thành mặc định một cách vô tình</span><span class="lz-lnote">Nếu trang giới thiệu của bạn tình cờ đứng đầu tệp thì giờ nó cũng là câu trả lời cho MỌI lượt quét, MỌI bản ghi DNS cũ còn sót và MỌI request đi lạc — và log của nó đầy những hostname chẳng liên quan gì tới nó. CÓ CHỦ Ý mới là toàn bộ vấn đề.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghi log cho khối mặc định RIÊNG ra</span><span class="lz-lnote">Hãy cho khối mặc định một <code>access_log</code> của riêng nó. Nó trở thành một bản ghi SẠCH về việc ai đang dò thẳng vào địa chỉ của bạn, thứ thật sự có ích, và nó giữ đám nhiễu ấy khỏi log của các trang thật.</span></div>
</div>
<pre><code><span class="tok-comment"># Kiem xem cong nao dang co may chu mac dinh, ke ca trong cac tep include</span>
nginx -T | grep -n 'default_server'

<span class="tok-comment"># Va thu CHINH CAI DUONG DO — dung Host that, dung mot cai vo nghia</span>
curl -s -o /dev/null -w '%{http_code}\\\\n' -H 'Host: khong-ton-tai.invalid' http://vidu.com/</code></pre>
<div class="note-ct">
<p><strong>Hãy KIỂM THỬ cái đường mà chẳng ai kiểm thử.</strong> Mọi request bạn tự gửi trong lúc phát triển đều mang một <code>Host</code> khớp với một khối, nên máy chủ mặc định là ĐƯỜNG MÃ DUY NHẤT trong cấu hình của bạn mà việc dùng bình thường chẳng bao giờ chạm tới — và do đó là cái đường ở lại SAI suốt nhiều năm. Một câu <code>curl</code> với một cái <code>Host</code> vô nghĩa, chạy một lần cho mỗi môi trường, cho bạn biết CHÍNH XÁC một người lạ kết nối vào địa chỉ IP của bạn nhìn thấy gì. Hãy làm ngay bây giờ với thứ bạn đang có trên production; câu trả lời khá thường xuyên là một trang mà bạn đã quên là nó nằm trên cái máy đó.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html#how_to_prevent_undefined_server_names" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">nginx — chặn những tên máy chủ không khai báo</span><span class="lc-sub">nginx.org · Mẫu chính thức cho khối mặc định kiểu từ chối</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#return" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">nginx — return</span><span class="lc-sub">nginx.org · Kể cả mã 444, và cách trả về một chuyển hướng mà không cần rewrite</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/configuring_https_servers.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">nginx — cấu hình máy chủ HTTPS</span><span class="lc-sub">nginx.org · Vì sao khối mặc định trên 443 cần chứng chỉ riêng của nó</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Web</span><span class="lc-sub">DNS, header Host, và việc chạm thẳng vào một địa chỉ IP nghĩa là gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Tới được một trang bạn không định công bố, rồi thêm một mặc định kiểu từ chối và thử lại</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — The Host header is client input, and $host is too|||1.4 — Header Host là ĐẦU VÀO của client, và $host cũng vậy',
      slug: 'nginx-1-4-host-la-dau-vao',
      type: 'LESSON',
      description: 'Nginx dùng Host để CHỌN khối server, nên rất dễ tưởng rằng tới lúc mã của bạn chạy thì nó đã được kiểm chứng. Không hề. Bài này bắn một cái Host giả vào một cấu hình thật và cho thấy nó đi thẳng vào header Location của một cú chuyển hướng — kể cả cú chuyển hướng mà Nginx TỰ sinh ra khi bạn chẳng viết gì cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The Host header is client input, and $host is too</h2>
<p class="lead">Lessons 1.1 to 1.3 used <code>Host</code> to pick a server block, which makes it feel like a validated, trusted value by the time your directives run. It is not. It is a string the client typed, and every variable derived from it carries that property into whatever you build with it.</p>

<h3>The same request, two hosts, measured</h3>
<div class="out">=== Host binh thuong ===          === Host do KE TAN CONG dat ===
host=vidu.com                     host=ke-tan-cong.com
http_host=vidu.com                http_host=ke-tan-cong.com
server_name=_                     server_name=_
scheme=http                       scheme=http

# Chi mot co gia tri KHONG doi khi client noi doi: $server_name.
# No la thu BAN viet trong cau hinh. Ba cai kia deu tu request ma ra.</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">$http_host</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The raw header, untouched</span><span class="lz-nsub">Exactly what the client sent, port and all · empty when there is no Host at all</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">$host</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tidied, still client-controlled</span><span class="lz-nsub">Lowercased, port stripped · falls back to server_name only when the header is absent</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">$server_name</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Yours, from the config</span><span class="lz-nsub">The name on the block that matched · the ONE value a client cannot influence</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">$scheme</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Honest, but only about THIS hop</span><span class="lz-nsub">http behind a TLS-terminating proxy, even though the user typed https · Chapter 3</span></div></div>
  </div>
</div>

<h3>Where it escapes: the redirect</h3>
<div class="out">=== Chuyen huong viet bang $host ===
$ curl -H 'Host: ke-tan-cong.com' .../chuyen-huong-hong
HTTP/1.1 301 Moved Permanently
Location: https://ke-tan-cong.com/chuyen-huong-hong     &lt;- nan nhan bi day sang do

=== Cung request, nhung chuyen huong viet bang HANG SO ===
HTTP/1.1 301 Moved Permanently
Location: https://vidu.com/chuyen-huong-dung            &lt;- an toan

=== Va cai kho chiu nhat: Nginx TU sinh chuyen huong khi thieu dau / ===
$ curl -H 'Host: ke-tan-cong.com' .../thu-muc
HTTP/1.1 301 Moved Permanently
Location: http://ke-tan-cong.com:8080/thu-muc/          &lt;- BAN khong viet dong nao</div>
<div class="pitfall">
<p><strong>Trap — the third case is the one that catches careful people, because you did not write it.</strong> When a request names a directory without a trailing slash, Nginx issues its own <code>301</code> to add one — and it builds that <code>Location</code> from <code>$host</code>. So a configuration containing not a single <code>$host</code> anywhere still emits an attacker-controlled absolute redirect, and a security review that greps for <code>$host</code> finds nothing. The same applies to the automatic redirect from <code>rewrite</code> and to <code>try_files</code> falling through to a directory. Two directives fix it at the source: <code>absolute_redirect off;</code> makes Nginx emit a relative <code>Location</code>, and <code>server_name_in_redirect on;</code> makes it use the configured name instead of the header.</p>
</div>
<pre><code><span class="tok-comment"># The root fix — set it at the http level and every block inherits it</span>
http {
  absolute_redirect     off;   <span class="tok-comment"># Location: /folder/   (relative, no host)</span>
  server_name_in_redirect on;  <span class="tok-comment"># if you still need it absolute, use the NAME FROM THE CONFIG</span>
  port_in_redirect      off;   <span class="tok-comment"># dropping the ":8080" behind the proxy is flatly wrong</span>
}

<span class="tok-comment"># And in your code: the redirect target is a CONSTANT, not a variable</span>
return 301 https://vidu.com$request_uri;    <span class="tok-comment"># RIGHT</span>
<span class="tok-comment"># return 301 https://$host$request_uri;    // WRONG — the client picks the target</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">$host is fine for reading, dangerous for building</span><span class="v">Logging it, routing on it, choosing a <code>root</code> from a captured subdomain — all reasonable, because a wrong value only affects that request. Putting it into a <code>Location</code>, an email link or a cache key is different: there it becomes something you hand back to a browser as if you had chosen it.</span></div>
  <div class="kv"><span class="k">A refusing default server closes most of this</span><span class="v">If an unmatched <code>Host</code> gets <code>444</code> (Lesson 1.3), an attacker cannot reach a block with a forged name in the first place. That is why the two lessons belong together — the default block is the enforcement point for everything here.</span></div>
  <div class="kv"><span class="k">The application behind you inherits the problem</span><span class="v">Nginx does not forward the client’s <code>Host</code> by default — measured, the upstream sees the proxy’s own address — but nearly every real config adds <code>proxy_set_header Host \$host;</code> because the application needs it. The moment you do, the untrusted string is your application’s problem too, and an app that builds password-reset links from it has the poisoning attack from the Authentication course. Nginx is where you can stop it once, for every service behind it (Chapter 3).</span></div>
  <div class="kv"><span class="k">Do not try to validate it with a regex</span><span class="v">Matching hostnames by hand invites the tricks from that same course — a trailing dot, a userinfo <code>@</code>, mixed scripts, a very long label. Let <code>server_name</code> do the matching and let the default block refuse everything else; that is exactly the job it was designed for.</span></div>
</div>

<h3>Two more places the header leaks</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cache keys, if you put $host in one</span><span class="lz-lnote">A proxy cache keyed on <code>$host</code> lets an attacker with a forged name store a response under a key a real user will later read — cache poisoning, covered properly in Chapter 5. Use <code>$server_name</code>, or leave the host out of the key when one block serves one site.</span></div>
  <div class="lz-layer"><span class="lz-lname">Logs, where it is useful and must be read as untrusted</span><span class="lz-lnote">Logging <code>$host</code> is worth doing — it tells you which name people are using and reveals scanners immediately. Just remember the field is attacker-written, so anything that parses your logs must treat it as data, never as something to interpolate into a query or a shell command.</span></div>
  <div class="lz-layer"><span class="lz-lname">$host is normalised, $http_host is not — measured</span><span class="lz-lnote">Sending <code>ViDu.CoM.</code> or <code>vidu.com:9999</code> matches <code>server_name vidu.com;</code> and yields <code>$host = vidu.com</code>, while <code>$http_host</code> keeps every character the client typed. Nginx’s own matcher already handles case, port and the fully-qualified trailing dot — a comparison you write yourself against <code>$http_host</code> does not. (Two dots, <code>vidu.com..</code>, is a <code>400</code> before any block is chosen at all.)</span></div>
  <div class="lz-layer"><span class="lz-lname">HTTP/2 sends :authority, not Host</span><span class="lz-lnote">Nginx maps the pseudo-header onto <code>$host</code> for you, so nothing above changes — but if you are reading raw headers anywhere, do not expect a literal <code>Host</code> line on an HTTP/2 connection.</span></div>
</div>
<div class="note-ct">
<p><strong>The one-line rule.</strong> Anything you send BACK to a client — a <code>Location</code>, a link in a page, a cookie <code>Domain</code>, a cache key — must be built from your configuration, never from the request. Anything you only look at — logs, routing decisions, a captured subdomain — may come from the request, because a wrong value there affects one request and nobody else. Sort every use of <code>$host</code> into those two piles and this entire class of bug disappears.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#var_host" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — $host and $http_host</span><span class="lc-sub">nginx.org · The exact fallback order, which is easy to misremember</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#absolute_redirect" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">nginx — absolute_redirect</span><span class="lc-sub">nginx.org · With server_name_in_redirect and port_in_redirect</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/host-header" target="_blank" rel="noopener"><span class="lc-ico">💥</span><span class="lc-body"><span class="lc-title">PortSwigger — Host header attacks</span><span class="lc-sub">portswigger.net · What an attacker does with the redirect above</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">Absolute versus relative URLs, and how a browser resolves a Location</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Poison a redirect with a forged Host, then turn off absolute_redirect and retry</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Header Host là ĐẦU VÀO của client, và $host cũng vậy</h2>
<p class="lead">Bài 1.1 tới 1.3 dùng <code>Host</code> để chọn khối server, nên rất dễ có cảm giác rằng tới lúc các chỉ thị của bạn chạy thì giá trị đó đã được kiểm chứng và đáng tin. Không hề. Nó là một chuỗi do client tự gõ ra, và mọi biến sinh ra từ nó đều mang theo tính chất đó vào bất cứ thứ gì bạn dựng bằng nó.</p>

<h3>Cùng một request, hai cái Host, đo thật</h3>
<div class="out">=== Host binh thuong ===          === Host do KE TAN CONG dat ===
host=vidu.com                     host=ke-tan-cong.com
http_host=vidu.com                http_host=ke-tan-cong.com
server_name=_                     server_name=_
scheme=http                       scheme=http

# Chi mot co gia tri KHONG doi khi client noi doi: $server_name.
# No la thu BAN viet trong cau hinh. Ba cai kia deu tu request ma ra.</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">$http_host</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Header thô, y nguyên</span><span class="lz-nsub">Đúng cái client gửi, kèm cả cổng · rỗng khi request không có Host</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">$host</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đã dọn, vẫn do client quyết</span><span class="lz-nsub">Hạ chữ thường, bỏ cổng · chỉ lùi về server_name khi KHÔNG có header</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">$server_name</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Của BẠN, lấy từ cấu hình</span><span class="lz-nsub">Tên trên khối vừa khớp · giá trị DUY NHẤT client không tác động được</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">$scheme</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thật thà, nhưng chỉ về CHẶNG NÀY</span><span class="lz-nsub">Là http khi đứng sau proxy cắt TLS, dù người dùng gõ https · xem Chương 3</span></div></div>
  </div>
</div>

<h3>Chỗ nó thoát ra ngoài: cú chuyển hướng</h3>
<div class="out">=== Chuyen huong viet bang $host ===
$ curl -H 'Host: ke-tan-cong.com' .../chuyen-huong-hong
HTTP/1.1 301 Moved Permanently
Location: https://ke-tan-cong.com/chuyen-huong-hong     &lt;- nan nhan bi day sang do

=== Cung request, nhung chuyen huong viet bang HANG SO ===
HTTP/1.1 301 Moved Permanently
Location: https://vidu.com/chuyen-huong-dung            &lt;- an toan

=== Va cai kho chiu nhat: Nginx TU sinh chuyen huong khi thieu dau / ===
$ curl -H 'Host: ke-tan-cong.com' .../thu-muc
HTTP/1.1 301 Moved Permanently
Location: http://ke-tan-cong.com:8080/thu-muc/          &lt;- BAN khong viet dong nao</div>
<div class="pitfall">
<p><strong>Bẫy — trường hợp thứ ba mới là cái vồ trúng người cẩn thận, vì bạn có viết nó đâu.</strong> Khi request gọi một thư mục mà thiếu dấu <code>/</code> ở cuối, Nginx tự bắn một cú <code>301</code> để thêm vào — và nó dựng cái <code>Location</code> đó từ <code>$host</code>. Nghĩa là một cấu hình không hề có lấy một chữ <code>$host</code> nào vẫn nhả ra một cú chuyển hướng tuyệt đối do kẻ tấn công điều khiển, còn một đợt rà soát an ninh đi grep chữ <code>$host</code> thì chẳng thấy gì. Cú tự chuyển hướng của <code>rewrite</code> và của <code>try_files</code> khi rơi vào một thư mục cũng y như vậy. Hai chỉ thị vá tận gốc: <code>absolute_redirect off;</code> bắt Nginx trả <code>Location</code> tương đối, còn <code>server_name_in_redirect on;</code> bắt nó dùng tên trong cấu hình thay cho header.</p>
</div>
<pre><code><span class="tok-comment"># Vá tận gốc — đặt ở tầng http là mọi khối đều thừa hưởng</span>
http {
  absolute_redirect     off;   <span class="tok-comment"># Location: /thu-muc/   (tương đối, không có host)</span>
  server_name_in_redirect on;  <span class="tok-comment"># nếu vẫn cần tuyệt đối thì dùng TÊN TRONG CẤU HÌNH</span>
  port_in_redirect      off;   <span class="tok-comment"># bỏ luôn cái ":8080" đứng sau proxy thì sai bét</span>
}

<span class="tok-comment"># Và trong mã của bạn: đích chuyển hướng là HẰNG SỐ, không phải biến</span>
return 301 https://vidu.com$request_uri;    <span class="tok-comment"># ĐÚNG</span>
<span class="tok-comment"># return 301 https://$host$request_uri;    // SAI — client chọn đích</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">$host dùng để ĐỌC thì được, để DỰNG thì nguy</span><span class="v">Ghi log nó, định tuyến theo nó, chọn <code>root</code> từ một subdomain bắt được — đều hợp lý cả, vì giá trị sai chỉ ảnh hưởng đúng cái request đó. Nhét nó vào một <code>Location</code>, vào một đường dẫn trong email hay vào khoá cache thì khác hẳn: ở đó nó thành thứ bạn trao lại cho trình duyệt như thể chính bạn đã chọn.</span></div>
  <div class="kv"><span class="k">Một máy chủ mặc định biết từ chối bịt gần hết chuyện này</span><span class="v">Nếu <code>Host</code> không khớp thì ăn <code>444</code> (Bài 1.3), kẻ tấn công không chạm nổi vào một khối mang tên giả ngay từ đầu. Đó là lý do hai bài này đi liền nhau — khối mặc định chính là chỗ THI HÀNH cho mọi thứ nói ở đây.</span></div>
  <div class="kv"><span class="k">Ứng dụng đứng sau bạn thừa hưởng luôn cái lỗ</span><span class="v">Nginx KHÔNG tự chuyển tiếp <code>Host</code> của client — đo thật thì upstream nhìn thấy địa chỉ của chính con proxy — nhưng gần như mọi cấu hình thật đều thêm <code>proxy_set_header Host \$host;</code> vì ứng dụng cần nó. Ngay khi bạn làm thế, cái chuỗi không đáng tin ấy thành vấn đề của ứng dụng luôn, và một ứng dụng dựng đường dẫn đặt lại mật khẩu từ nó chính là đòn đầu độc trong khoá Authentication. Nginx là chỗ bạn chặn nó MỘT lần, cho mọi dịch vụ nằm sau (Chương 3).</span></div>
  <div class="kv"><span class="k">Đừng hòng kiểm nó bằng regex</span><span class="v">Tự tay khớp tên miền là mời đúng những mẹo trong khoá kia vào nhà — một dấu chấm cuối, một chữ <code>@</code> kiểu userinfo, chữ trộn nhiều hệ, một nhãn dài ngoẵng. Cứ để <code>server_name</code> lo việc khớp và để khối mặc định từ chối phần còn lại; đó đúng là việc nó sinh ra để làm.</span></div>
</div>

<h3>Hai chỗ nữa cái header này rò ra</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Khoá cache, nếu bạn đặt $host vào đó</span><span class="lz-lnote">Một proxy cache khoá theo <code>$host</code> cho phép kẻ tấn công mang tên giả cất một phản hồi dưới cái khoá mà người dùng thật sẽ đọc sau đó — đầu độc cache, nói tử tế ở Chương 5. Dùng <code>$server_name</code>, hoặc bỏ hẳn host khỏi khoá khi một khối chỉ phục vụ một site.</span></div>
  <div class="lz-layer"><span class="lz-lname">Log, nơi nó vừa hữu ích vừa phải bị coi là không đáng tin</span><span class="lz-lnote">Ghi <code>$host</code> vào log là đáng làm — nó cho biết người ta đang gọi bằng tên nào và lộ ngay đám quét dạo. Chỉ cần nhớ trường đó do kẻ tấn công viết, nên mọi thứ đi phân tích log của bạn phải coi nó là DỮ LIỆU, đừng bao giờ nội suy nó vào một câu truy vấn hay một dòng lệnh shell.</span></div>
  <div class="lz-layer"><span class="lz-lname">$host ĐÃ được chuẩn hoá, $http_host thì KHÔNG — đo thật</span><span class="lz-lnote">Gửi <code>ViDu.CoM.</code> hay <code>vidu.com:9999</code> đều khớp <code>server_name vidu.com;</code> và cho <code>$host = vidu.com</code>, trong khi <code>$http_host</code> giữ nguyên từng ký tự client gõ. Bộ khớp của Nginx đã lo hộ bạn chữ hoa, cổng và cả dấu chấm cuối của dạng đủ tiêu chuẩn — còn một phép so sánh do CHÍNH BẠN viết với <code>$http_host</code> thì không. (Hai dấu chấm, <code>vidu.com..</code>, ăn <code>400</code> trước khi có khối nào được chọn.)</span></div>
  <div class="lz-layer"><span class="lz-lname">HTTP/2 gửi :authority chứ không gửi Host</span><span class="lz-lnote">Nginx tự ánh xạ pseudo-header đó sang <code>$host</code> giùm bạn, nên mọi điều ở trên không đổi — nhưng nếu chỗ nào bạn đang đọc header thô thì đừng trông chờ có một dòng <code>Host</code> đúng nghĩa trên kết nối HTTP/2.</span></div>
</div>
<div class="note-ct">
<p><strong>Quy tắc một dòng.</strong> Bất cứ thứ gì bạn gửi TRẢ LẠI cho client — một <code>Location</code>, một đường dẫn trong trang, một <code>Domain</code> của cookie, một khoá cache — đều phải dựng từ CẤU HÌNH của bạn, không bao giờ từ request. Bất cứ thứ gì bạn chỉ NHÌN — log, quyết định định tuyến, một subdomain bắt được — thì lấy từ request cũng được, vì giá trị sai ở đó chỉ ảnh hưởng đúng một request và không đụng tới ai khác. Xếp mọi chỗ dùng <code>$host</code> vào đúng một trong hai đống ấy là cả một họ lỗi này biến mất.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#var_host" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">nginx — $host và $http_host</span><span class="lc-sub">nginx.org · Thứ tự lùi chính xác, thứ rất dễ nhớ nhầm</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_core_module.html#absolute_redirect" target="_blank" rel="noopener"><span class="lc-ico">↩️</span><span class="lc-body"><span class="lc-title">nginx — absolute_redirect</span><span class="lc-sub">nginx.org · Kèm server_name_in_redirect và port_in_redirect</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/host-header" target="_blank" rel="noopener"><span class="lc-ico">💥</span><span class="lc-body"><span class="lc-title">PortSwigger — Tấn công qua header Host</span><span class="lc-sub">portswigger.net · Kẻ tấn công làm gì với cú chuyển hướng ở trên</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Web Foundations</span><span class="lc-sub">URL tuyệt đối và tương đối, và cách trình duyệt phân giải một Location</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Đầu độc một cú chuyển hướng bằng Host giả, rồi tắt absolute_redirect và thử lại</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — A three-site layout, wired end to end|||1.5 — Bố cục ba site, đấu dây từ đầu tới cuối',
      slug: 'nginx-1-5-bo-cuc-nhieu-site',
      type: 'LESSON',
      description: 'Bốn bài trước mổ từng mảnh: listen, server_name, khối mặc định, và cái Host không đáng tin. Bài này ghép cả bốn thành một bố cục nhiều site chạy thật — rồi ĐỔI ĐÚNG MỘT TÊN FILE và cho bạn xem một host lạ đang bị chặn bỗng được chuyển hướng về trang chủ của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>A three-site layout, wired end to end</h2>
<p class="lead">Everything so far has been one piece at a time. Here is the whole thing running: three sites plus an admin panel on one machine, each in its own file, with a default block that refuses. Then one filename changes and the behaviour changes with it — which is the real lesson of this chapter.</p>

<h3>The layout on disk</h3>
<pre><code>/etc/nginx/
├── nginx.conf                    <span class="tok-comment"># contains only the http level plus one include line</span>
├── sites-available/              <span class="tok-comment"># every site, including the disabled ones</span>
│   ├── 00-default.conf           <span class="tok-comment"># the catch-all block, NO server_name</span>
│   ├── 10-vidu.conf              <span class="tok-comment"># apex + www</span>
│   ├── 20-api.conf
│   ├── 30-blog.conf
│   └── 90-admin.conf             <span class="tok-comment"># its own port</span>
└── sites-enabled/                <span class="tok-comment"># all symlinks — enabling and disabling is ln -s and rm</span>
    └── ...

<span class="tok-comment"># In nginx.conf, exactly one line pulls it all in:</span>
include /etc/nginx/sites-enabled/*.conf;</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">One file per site</span><span class="lz-d">A site is a unit you turn on and off. Splitting by file means enabling one is a symlink and disabling one is <code>rm</code> — neither touches a line another site depends on.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Number the filenames</span><span class="lz-d">The glob loads in sorted order, so a prefix makes the order visible instead of alphabetical-by-accident. It matters more than it looks — see the measurement below.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">available versus enabled</span><span class="lz-d">Keeping the real file in <code>sites-available</code> and a symlink in <code>sites-enabled</code> lets you take a site down without deleting its config, which is what you want at 2am.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Read the result back with nginx -T</span><span class="lz-d">It prints the fully assembled configuration, every include expanded, in load order. It is the only honest answer to "what is actually running".</span></div>
</div>

<h3>All eight cases, measured against nginx 1.24.0</h3>
<div class="out">$ for h in ...; do curl -H "Host: \$h" http://127.0.0.1:8080/ ; done

Host gui len            Ma    Than         Location
vidu.com             -> 200   APEX + WWW
www.vidu.com         -> 301   -            http://vidu.com:8080/
api.vidu.com         -> 200   API
blog.vidu.com        -> 200   BLOG
admin.vidu.com       -> 000   -                     &lt;- 444: admin KHONG o cong nay
khong-ai-biet.com    -> 000   -                     &lt;- 444: khoi mac dinh tu choi
vidu.com.            -> 200   APEX + WWW            &lt;- dau cham cuoi: Nginx tu bo
VIDU.COM             -> 200   APEX + WWW            &lt;- chu hoa: Nginx tu ha thuong

$ curl -H 'Host: bat-ky-cai-gi.com' http://127.0.0.1:8081/
ADMIN                                                &lt;- 200. Doc ky doan duoi.</div>
<div class="pitfall">
<p><strong>Trap — port 8081 is a different listen group, so it has its own default server, and here that default is the admin panel.</strong> The admin block was written as <code>listen 127.0.0.1:8081 default_server;</code> with <code>server_name admin.vidu.com;</code>. Because it is the only block on that address, every request to port 8081 reaches it no matter what <code>Host</code> says — the <code>server_name</code> line is decoration. Measured above: <code>Host: bat-ky-cai-gi.com</code> returns <code>ADMIN</code>. On the public port that is a rebinding vector; here it is only bound to <code>127.0.0.1</code>, which is what makes it survivable. Every new port you open starts a fresh group that needs its own refusing default — a <code>444</code> block per listen group, not one per machine.</p>
</div>

<h3>Now change one filename and nothing else</h3>
<div class="out">=== Bo co default_server. File van ten 00-default.conf ===
khong-ai-biet.com -> 000                 (00- nap dau tien => no la mac dinh ngam)

=== CUNG cau hinh. Chi doi ten file: 00-default.conf -> 99-default.conf ===
khong-ai-biet.com -> 301
                     Location: http://vidu.com:8080/gio-hang
                     ^ host la gio duoc DAY VE trang chu cua ban

=== Tra lai co default_server (ten file van la 99-) ===
khong-ai-biet.com -> 000                 (co thang thu tu file)
vidu.com          -> 200                 (cac site that khong he suy suyen)</div>
<p>Renaming a file moved it to the end of the glob, so <code>10-vidu.conf</code> became the first block on port 8080 and therefore the implicit default. Its first <code>server</code> is the <code>www</code> redirect — so an unknown host stopped being refused and started being <code>301</code>-ed to the apex, carrying its original path. No directive changed. No error appeared. <code>nginx -t</code> said the configuration was fine, because it was fine; it just did something else.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">The flag exists precisely to break this dependency</span><span class="v"><code>default_server</code> pins the fallback to the block you named, and the third measurement confirms it: with the flag back on, the filename no longer matters. Order-dependence is the failure mode; an explicit flag is the fix.</span></div>
  <div class="kv"><span class="k">A redirect is a worse default than an error page</span><span class="v">An unknown host getting <code>301</code>-ed to your apex looks harmless and is not: it makes your site answer for names you never registered, it feeds scanners a working endpoint, and it turns every mistyped or forged <code>Host</code> into traffic you now serve. Refusing is louder and safer.</span></div>
  <div class="kv"><span class="k">Numeric prefixes are documentation, not protection</span><span class="v">Keep them — reading a directory in load order is genuinely useful. Just never let correctness rest on them, because a rename is exactly the kind of tidy-up somebody does without thinking they changed anything.</span></div>
  <div class="kv"><span class="k">www to apex belongs in its own tiny block</span><span class="v">One <code>server</code> whose whole body is <code>return 301</code> with a hard-coded destination (Lesson 1.4) — not an <code>if</code> inside the apex block. It is cheaper, it is impossible to misread, and it keeps the apex block about serving the site.</span></div>
</div>

<h3>The chapter in one picture</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Step 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Address and port pick the GROUP</span><span class="lz-nsub">Lesson 1.1 · Only blocks listening on the matched socket are candidates · a specific IP beats a wildcard</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Step 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Host picks the BLOCK inside it</span><span class="lz-nsub">Lesson 1.2 · Exact, then leading wildcard, then trailing, then regex in file order</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Step 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nothing matched → the default of THAT group</span><span class="lz-nsub">Lesson 1.3 · Explicit flag, or first-loaded by accident · one per listen group</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Step 4</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Only now does location matching begin</span><span class="lz-nsub">Chapter 2 · The server block is already decided and cannot be revisited</span></div></div>
  </div>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Check: one refusing default per listen group</span><span class="lz-lnote">Count the distinct address:port pairs across your files. Each one needs its own <code>default_server</code> block returning <code>444</code>. A machine with 80, 443 and an admin port needs three, not one.</span></div>
  <div class="lz-layer"><span class="lz-lname">Check: no site is the accidental default</span><span class="lz-lnote"><code>nginx -T | grep -n 'listen\\|server_name'</code> and read it top to bottom. The first block in each group is the fallback unless a flag says otherwise — make sure that block is one you would be happy to serve every forged host from.</span></div>
  <div class="lz-layer"><span class="lz-lname">Check: every redirect destination is a literal</span><span class="lz-lnote">Grep for <code>return 30</code> and confirm no host part comes from a variable, plus <code>absolute_redirect off;</code> at the <code>http</code> level so the ones Nginx writes for you are relative too.</span></div>
  <div class="lz-layer"><span class="lz-lname">Check: reload, then re-measure</span><span class="lz-lnote"><code>nginx -t &amp;&amp; nginx -s reload</code>, then run the same <code>curl</code> table again. The config that passed the syntax test is not the same claim as the config that routes correctly, and the table takes ten seconds.</span></div>
</div>
<div class="note-ct">
<p><strong>What this chapter bought you.</strong> Given any request, you can now say which <code>server</code> block will handle it before Nginx runs, and you can say why. That is not a small thing: most confusing Nginx behaviour is not a broken directive, it is a directive working perfectly inside a block you did not expect to be chosen. Chapter 2 assumes the block is settled and asks the next question — which <code>location</code> inside it wins.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">nginx — How nginx processes a request</span><span class="lc-sub">nginx.org · The official version of the four-step picture above</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">nginx — Beginner’s guide</span><span class="lc-sub">nginx.org · Config file structure, include, and the reload cycle</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/switches.html" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">nginx — Command-line switches</span><span class="lc-sub">nginx.org · -t, -T and -s reload, the three you will use daily</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">Symlinks, glob ordering, and why ls output is not load order</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Nginx"</span><span class="lc-sub">Build the four-file layout, then rename the default and watch 444 become 301</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Bố cục ba site, đấu dây từ đầu tới cuối</h2>
<p class="lead">Từ đầu chương tới giờ toàn là mổ từng mảnh. Đây là cả bộ đang chạy: ba site cộng một trang quản trị trên cùng một máy, mỗi cái một file, kèm một khối mặc định biết từ chối. Rồi đổi đúng MỘT tên file là hành vi đổi theo — và đó mới là bài học thật của cả chương này.</p>

<h3>Bố cục trên đĩa</h3>
<pre><code>/etc/nginx/
├── nginx.conf                    <span class="tok-comment"># chỉ chứa tầng http + một dòng include</span>
├── sites-available/              <span class="tok-comment"># mọi site, kể cả site đang tắt</span>
│   ├── 00-default.conf           <span class="tok-comment"># khối bắt-tất, KHÔNG server_name</span>
│   ├── 10-vidu.conf              <span class="tok-comment"># apex + www</span>
│   ├── 20-api.conf
│   ├── 30-blog.conf
│   └── 90-admin.conf             <span class="tok-comment"># cổng riêng</span>
└── sites-enabled/                <span class="tok-comment"># toàn liên kết mềm — bật/tắt là ln -s và rm</span>
    └── ...

<span class="tok-comment"># Trong nginx.conf, đúng một dòng kéo tất cả vào:</span>
include /etc/nginx/sites-enabled/*.conf;</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một file một site</span><span class="lz-d">Một site là một đơn vị bạn bật lên tắt xuống. Tách theo file thì bật là một liên kết mềm, tắt là một lệnh <code>rm</code> — cả hai không đụng vào dòng nào mà site khác đang dựa vào.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đánh số tên file</span><span class="lz-d">Glob nạp theo thứ tự đã sắp, nên cái tiền tố làm cho thứ tự hiện ra thay vì xếp theo bảng chữ cái một cách tình cờ. Nó quan trọng hơn vẻ ngoài — xem phép đo bên dưới.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">available và enabled</span><span class="lz-d">Giữ file thật ở <code>sites-available</code> còn liên kết mềm ở <code>sites-enabled</code> cho phép bạn hạ một site xuống mà KHÔNG xoá cấu hình của nó — đúng thứ bạn cần lúc 2 giờ sáng.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đọc lại kết quả bằng nginx -T</span><span class="lz-d">Nó in ra cấu hình đã ghép xong, mọi include bung hết, theo đúng thứ tự nạp. Đó là câu trả lời thật thà duy nhất cho câu hỏi "rốt cuộc cái gì đang chạy".</span></div>
</div>

<h3>Cả tám trường hợp, đo trên nginx 1.24.0</h3>
<div class="out">$ for h in ...; do curl -H "Host: \$h" http://127.0.0.1:8080/ ; done

Host gui len            Ma    Than         Location
vidu.com             -> 200   APEX + WWW
www.vidu.com         -> 301   -            http://vidu.com:8080/
api.vidu.com         -> 200   API
blog.vidu.com        -> 200   BLOG
admin.vidu.com       -> 000   -                     &lt;- 444: admin KHONG o cong nay
khong-ai-biet.com    -> 000   -                     &lt;- 444: khoi mac dinh tu choi
vidu.com.            -> 200   APEX + WWW            &lt;- dau cham cuoi: Nginx tu bo
VIDU.COM             -> 200   APEX + WWW            &lt;- chu hoa: Nginx tu ha thuong

$ curl -H 'Host: bat-ky-cai-gi.com' http://127.0.0.1:8081/
ADMIN                                                &lt;- 200. Doc ky doan duoi.</div>
<div class="pitfall">
<p><strong>Bẫy — cổng 8081 là một NHÓM listen khác, nên nó có máy chủ mặc định riêng, và ở đây cái mặc định đó chính là trang quản trị.</strong> Khối admin viết là <code>listen 127.0.0.1:8081 default_server;</code> kèm <code>server_name admin.vidu.com;</code>. Vì nó là khối DUY NHẤT trên địa chỉ đó, mọi request tới cổng 8081 đều rơi vào nó bất kể <code>Host</code> nói gì — dòng <code>server_name</code> chỉ còn là trang trí. Đo ở trên: <code>Host: bat-ky-cai-gi.com</code> trả về <code>ADMIN</code>. Trên cổng công khai thì đó là một cửa cho đòn rebinding; ở đây nó chỉ buộc vào <code>127.0.0.1</code>, và chính điều đó cứu nó. Mỗi cổng mới bạn mở ra là một nhóm mới cần cái mặc định biết từ chối của riêng nó — một khối <code>444</code> cho MỖI nhóm listen, không phải một cái cho cả máy.</p>
</div>

<h3>Giờ đổi một cái tên file, và KHÔNG đổi gì khác</h3>
<div class="out">=== Bo co default_server. File van ten 00-default.conf ===
khong-ai-biet.com -> 000                 (00- nap dau tien => no la mac dinh ngam)

=== CUNG cau hinh. Chi doi ten file: 00-default.conf -> 99-default.conf ===
khong-ai-biet.com -> 301
                     Location: http://vidu.com:8080/gio-hang
                     ^ host la gio duoc DAY VE trang chu cua ban

=== Tra lai co default_server (ten file van la 99-) ===
khong-ai-biet.com -> 000                 (co thang thu tu file)
vidu.com          -> 200                 (cac site that khong he suy suyen)</div>
<p>Đổi tên file là đẩy nó xuống cuối glob, thế là <code>10-vidu.conf</code> thành khối đầu tiên trên cổng 8080 và do đó thành cái mặc định ngầm. Khối <code>server</code> đầu tiên trong đó là cú chuyển hướng <code>www</code> — nên một host lạ thôi không bị từ chối nữa mà bắt đầu được <code>301</code> về trang chủ, mang theo nguyên đường dẫn ban đầu. Không một chỉ thị nào đổi. Không một lỗi nào hiện ra. <code>nginx -t</code> bảo cấu hình ổn, vì nó ổn thật; nó chỉ làm một việc khác đi.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái cờ sinh ra đúng là để cắt sự phụ thuộc này</span><span class="v"><code>default_server</code> ghim chỗ rơi vào đúng khối bạn chỉ định, và phép đo thứ ba xác nhận: bật cờ lại thì tên file không còn nghĩa lý gì. Phụ thuộc thứ tự là kiểu hỏng; một cái cờ nói thẳng là cách chữa.</span></div>
  <div class="kv"><span class="k">Chuyển hướng là cái mặc định TỆ hơn một trang lỗi</span><span class="v">Một host lạ được <code>301</code> về trang chủ trông thì vô hại mà không hề: nó khiến site của bạn trả lời thay cho những cái tên bạn chưa từng đăng ký, nó tặng đám quét dạo một điểm cuối chạy được, và nó biến mọi cái <code>Host</code> gõ nhầm hay giả mạo thành lưu lượng mà bạn đang phục vụ. Từ chối thì ồn hơn nhưng an toàn hơn.</span></div>
  <div class="kv"><span class="k">Tiền tố số là TÀI LIỆU, không phải hàng rào</span><span class="v">Cứ giữ nó — đọc một thư mục theo đúng thứ tự nạp thật sự hữu ích. Chỉ là đừng bao giờ để tính đúng đắn tựa vào nó, vì đổi tên file đúng là kiểu dọn dẹp người ta làm mà không nghĩ mình vừa thay đổi cái gì.</span></div>
  <div class="kv"><span class="k">www về apex nên nằm trong khối tí hon của riêng nó</span><span class="v">Một khối <code>server</code> mà cả thân chỉ có <code>return 301</code> với đích viết cứng (Bài 1.4) — chứ không phải một cái <code>if</code> nhét trong khối apex. Nó rẻ hơn, nó không thể đọc nhầm, và nó giữ cho khối apex chỉ lo việc phục vụ site.</span></div>
</div>

<h3>Cả chương gói trong một hình</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Bước 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Địa chỉ và cổng chọn NHÓM</span><span class="lz-nsub">Bài 1.1 · Chỉ khối nào nghe trên socket vừa khớp mới được vào vòng · IP cụ thể thắng ký tự đại diện</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bước 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Host chọn KHỐI bên trong nhóm</span><span class="lz-nsub">Bài 1.2 · Khớp chính xác, rồi đại diện đầu, rồi đại diện cuối, rồi regex theo thứ tự file</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bước 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không khớp gì → mặc định của CHÍNH nhóm đó</span><span class="lz-nsub">Bài 1.3 · Cờ nói thẳng, hoặc nạp-đầu-tiên một cách tình cờ · mỗi nhóm listen một cái</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bước 4</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tới đây mới bắt đầu khớp location</span><span class="lz-nsub">Chương 2 · Khối server đã chốt xong và không thể xét lại</span></div></div>
  </div>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Kiểm: mỗi nhóm listen một khối mặc định biết từ chối</span><span class="lz-lnote">Đếm số cặp địa chỉ:cổng khác nhau trong đám file của bạn. Mỗi cặp cần một khối <code>default_server</code> trả <code>444</code> của riêng nó. Một máy có 80, 443 và một cổng quản trị thì cần BA, không phải một.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm: không site nào đang là mặc định một cách vô tình</span><span class="lz-lnote"><code>nginx -T | grep -n 'listen\\|server_name'</code> rồi đọc từ trên xuống. Khối đầu tiên của mỗi nhóm chính là chỗ rơi, trừ khi có cờ nói khác — hãy chắc rằng đó là khối mà bạn vui lòng đem ra phục vụ MỌI host giả mạo.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm: mọi đích chuyển hướng đều là hằng</span><span class="lz-lnote">Grep <code>return 30</code> và xác nhận không phần host nào tới từ một biến, kèm <code>absolute_redirect off;</code> ở tầng <code>http</code> để những cú Nginx tự viết hộ cũng thành tương đối.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm: nạp lại, rồi ĐO LẠI</span><span class="lz-lnote"><code>nginx -t &amp;&amp; nginx -s reload</code>, rồi chạy lại đúng bảng <code>curl</code> đó. "Cấu hình qua được phép kiểm cú pháp" không phải cùng một lời khẳng định với "cấu hình định tuyến đúng", mà chạy cái bảng kia chỉ tốn mười giây.</span></div>
</div>
<div class="note-ct">
<p><strong>Chương này đã mua được gì cho bạn.</strong> Đưa ra một request bất kỳ, giờ bạn nói được khối <code>server</code> nào sẽ xử lý nó TRƯỚC KHI Nginx chạy, và nói được vì sao. Đó không phải chuyện nhỏ: phần lớn hành vi khó hiểu của Nginx không phải một chỉ thị hỏng, mà là một chỉ thị chạy hoàn hảo bên trong một khối bạn không ngờ nó được chọn. Chương 2 coi như khối đã chốt và hỏi câu tiếp theo — <code>location</code> nào bên trong nó thắng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">nginx — Nginx xử lý một request thế nào</span><span class="lc-sub">nginx.org · Bản chính thức của cái hình bốn bước ở trên</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">nginx — Hướng dẫn cho người mới</span><span class="lc-sub">nginx.org · Cấu trúc file cấu hình, include, và vòng nạp lại</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/switches.html" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">nginx — Các tham số dòng lệnh</span><span class="lc-sub">nginx.org · -t, -T và -s reload, ba cái bạn dùng hằng ngày</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">Liên kết mềm, thứ tự của glob, và vì sao kết quả ls không phải thứ tự nạp</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/nginx${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — chặng "Nginx"</span><span class="lc-sub">Dựng bố cục bốn file, rồi đổi tên cái mặc định và xem 444 biến thành 301</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Quiz: how a request finds a server block|||1.6 — Quiz: một request tìm ra khối server bằng cách nào',
      slug: 'nginx-1-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về đúng những gì bạn đã chạy trong chương: nhóm listen, thứ tự khớp server_name, khối mặc định theo từng nhóm, và cái Host không đáng tin.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.6</span>
<h2>Quiz: how a request finds a server block</h2>
<p class="lead">Eight questions on things this chapter measured rather than asserted. If one is unclear, the answer is in a lesson above — none of it depends on a chapter you have not reached.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Selection happens in two steps, and the first one is not <code>Host</code>: the address and port of the accepted connection pick a group of candidate blocks, and a specific IP beats a wildcard even when the wildcard also covers it (1.1). Inside that group <code>Host</code> picks the block, in a fixed order — exact name, then a leading wildcard, then a trailing one, then regular expressions in the order they were loaded (1.2). If nothing matches, the request goes to that group’s default server: the block carrying <code>default_server</code>, or, when nobody claims it, whichever block happened to load first (1.3). And the <code>Host</code> that drove all of this is a string the client typed — <code>$host</code> inherits that, which matters most when it ends up inside a <code>Location</code> that Nginx writes for you (1.4). Put together, renaming one file changed a refused request into a redirect to the apex, with no directive edited and no error printed (1.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.6</span>
<h2>Quiz: một request tìm ra khối server bằng cách nào</h2>
<p class="lead">Tám câu về đúng những thứ chương này ĐO ra chứ không phải nói suông. Câu nào còn mờ thì câu trả lời nằm ở một bài phía trên — không câu nào dựa vào một chương bạn chưa tới.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Việc chọn diễn ra theo HAI bước, và bước đầu KHÔNG phải <code>Host</code>: địa chỉ và cổng của kết nối vừa nhận chọn ra một NHÓM khối ứng viên, và một IP cụ thể thắng ký tự đại diện ngay cả khi cái đại diện kia cũng phủ nó (1.1). Bên trong nhóm đó, <code>Host</code> mới chọn khối, theo một thứ tự cố định — tên chính xác, rồi đại diện ở đầu, rồi đại diện ở cuối, rồi biểu thức chính quy theo đúng thứ tự được nạp (1.2). Không khớp gì thì request rơi vào máy chủ mặc định CỦA NHÓM ĐÓ: khối mang cờ <code>default_server</code>, hoặc khi chẳng ai nhận thì là khối tình cờ được nạp trước nhất (1.3). Và cái <code>Host</code> điều khiển toàn bộ chuyện này lại là một chuỗi do client gõ ra — <code>$host</code> thừa hưởng tính chất đó, và nó nguy nhất khi chui vào một cái <code>Location</code> mà Nginx tự viết hộ bạn (1.4). Ghép lại: đổi tên MỘT file đã biến một request bị từ chối thành một cú chuyển hướng về trang chủ, không sửa chỉ thị nào và không in ra lỗi nào (1.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A request arrives. In what order does Nginx decide which server block handles it?|||Một request tới. Nginx quyết định khối server nào xử lý nó theo thứ tự nào?',
            options: [
              'It reads Host first, then checks whether that block is listening on the right port|||Nó đọc Host trước, rồi mới xem khối đó có đang nghe đúng cổng không',
              'The accepted socket’s address and port select a group of candidate blocks; only then does Host choose one inside that group|||Địa chỉ và cổng của socket vừa nhận chọn ra một NHÓM khối ứng viên; tới lúc đó Host mới chọn một cái BÊN TRONG nhóm ấy',
              'It matches location blocks first and works backwards to the server|||Nó khớp các khối location trước rồi lần ngược về khối server',
              'Blocks are tried top to bottom until one returns a response|||Các khối được thử từ trên xuống cho tới khi có cái trả về phản hồi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'One block says listen 8080; another says listen 127.0.0.1:8080;. A request arrives on 127.0.0.1:8080. Which group is it in?|||Một khối viết listen 8080; khối kia viết listen 127.0.0.1:8080;. Một request tới trên 127.0.0.1:8080. Nó thuộc nhóm nào?',
            options: [
              'The wildcard group, because it was written first|||Nhóm ký tự đại diện, vì nó được viết trước',
              'The 127.0.0.1:8080 group — the most specific address wins, so the wildcard block is not even a candidate|||Nhóm 127.0.0.1:8080 — địa chỉ CỤ THỂ NHẤT thắng, nên khối đại diện kia thậm chí không phải ứng viên',
              'Both groups are searched and the first Host match anywhere wins|||Cả hai nhóm đều được tìm và cái Host khớp đầu tiên ở bất cứ đâu sẽ thắng',
              'Nginx refuses to start with both lines present|||Nginx từ chối khởi động khi có cả hai dòng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Host: api.vidu.com arrives and three blocks could match: server_name *.vidu.com;, server_name api.vidu.com;, and server_name ~^api\\\\..+$;. Which wins?|||Host: api.vidu.com tới và ba khối đều có thể khớp: server_name *.vidu.com;, server_name api.vidu.com;, và server_name ~^api\\\\..+$;. Cái nào thắng?',
            options: [
              'The regex, because regular expressions are the most precise|||Cái regex, vì biểu thức chính quy là chính xác nhất',
              'The exact name api.vidu.com — exact beats leading wildcard beats trailing wildcard beats regex, regardless of file order|||Tên chính xác api.vidu.com — chính xác thắng đại diện-ở-đầu, thắng đại diện-ở-cuối, thắng regex, bất kể thứ tự file',
              'Whichever appears first in the configuration|||Cái nào xuất hiện trước trong cấu hình',
              '*.vidu.com, because a wildcard covers more names|||*.vidu.com, vì ký tự đại diện phủ nhiều tên hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your machine listens on 80, 443 and an admin port 8081. How many default_server blocks do you need?|||Máy của bạn nghe trên 80, 443 và một cổng quản trị 8081. Bạn cần bao nhiêu khối default_server?',
            options: [
              'One — it covers the whole machine|||Một — nó phủ cả máy',
              'Three — default_server applies per listen group, so each address:port pair needs its own|||Ba — default_server áp dụng cho TỪNG nhóm listen, nên mỗi cặp địa chỉ:cổng cần một cái của riêng nó',
              'None; Nginx generates a safe default automatically|||Không cần cái nào; Nginx tự sinh ra một mặc định an toàn',
              'One per server_name in the configuration|||Mỗi server_name trong cấu hình một cái',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The measurement in 1.5: with no default_server flag anywhere, renaming 00-default.conf to 99-default.conf turned a refused unknown host into a 301 to the apex. Why?|||Phép đo ở bài 1.5: khi không có cờ default_server ở đâu cả, đổi tên 00-default.conf thành 99-default.conf đã biến một host lạ bị từ chối thành một cú 301 về trang chủ. Vì sao?',
            options: [
              'Renaming a file invalidates its symlink|||Đổi tên file làm hỏng liên kết mềm của nó',
              'The include glob loads in sorted order, so a different file became the first block in that group — and the first block is the implicit default|||Glob của include nạp theo thứ tự đã sắp, nên một file KHÁC trở thành khối đầu tiên của nhóm — và khối đầu tiên chính là cái mặc định NGẦM',
              'Nginx caches the old configuration until a full restart|||Nginx giữ cấu hình cũ trong bộ đệm cho tới khi khởi động lại hẳn',
              'A 99- prefix is reserved by Nginx for redirects|||Tiền tố 99- được Nginx dành riêng cho các cú chuyển hướng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which of $host, $http_host, $server_name and $scheme cannot be influenced by the client?|||Trong bốn cái $host, $http_host, $server_name và $scheme, cái nào client KHÔNG tác động được?',
            options: [
              '$host, because Nginx normalises it|||$host, vì Nginx đã chuẩn hoá nó',
              '$server_name — it is the name written in your configuration; the other three all derive from the request|||$server_name — nó là cái tên VIẾT TRONG cấu hình của bạn; ba cái kia đều sinh ra từ request',
              '$scheme, because TLS cannot be forged|||$scheme, vì TLS không giả mạo được',
              'All four are safe once the server block has been selected|||Cả bốn đều an toàn một khi khối server đã được chọn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your config contains no $host anywhere, yet a forged Host came back inside a Location header. How?|||Cấu hình của bạn không hề có chữ $host ở đâu cả, thế mà một cái Host giả vẫn quay ra trong header Location. Bằng cách nào?',
            options: [
              'A proxied upstream added the header|||Một upstream phía sau đã thêm cái header đó vào',
              'Nginx writes its own 301 to add a missing trailing slash, and it builds that Location from $host — so absolute_redirect off; and server_name_in_redirect on; are the fix|||Nginx TỰ viết một cú 301 để thêm dấu / còn thiếu, và nó dựng cái Location đó từ $host — nên absolute_redirect off; và server_name_in_redirect on; mới là cách chữa',
              'The browser rewrote the header|||Trình duyệt đã viết lại cái header',
              'It is impossible; Location always comes from a return directive|||Không thể; Location luôn tới từ một chỉ thị return',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An admin block is the only one on 127.0.0.1:8081 and carries default_server. What does server_name admin.vidu.com; do there?|||Một khối admin là khối DUY NHẤT trên 127.0.0.1:8081 và mang cờ default_server. Dòng server_name admin.vidu.com; ở đó làm gì?',
            options: [
              'It restricts the block to requests whose Host is admin.vidu.com|||Nó giới hạn khối chỉ nhận request có Host là admin.vidu.com',
              'Nothing enforceable — as the group’s only block and its default, it answers any Host; the measurement returned ADMIN for Host: bat-ky-cai-gi.com|||Không thi hành được gì — là khối duy nhất của nhóm và cũng là mặc định của nhóm, nó trả lời MỌI Host; phép đo trả về ADMIN cho Host: bat-ky-cai-gi.com',
              'It makes Nginx return 421 for other hosts|||Nó khiến Nginx trả 421 cho các host khác',
              'It only matters when TLS is enabled|||Nó chỉ có nghĩa khi đã bật TLS',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
