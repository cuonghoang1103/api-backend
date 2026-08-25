/**
 * Linux & Bash — Chương 9: Mạng & máy từ xa.
 * Ngăn xếp mạng nhìn từ shell · curl · SSH · chuyển file · tường lửa và chẩn đoán · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 9 — Networking & remote machines|||Chương 9 — Mạng & máy từ xa',
  description: 'ss, ip, curl, dig, ssh, scp, rsync — và cách đọc một cái tường lửa. Chương này dạy bạn trả lời câu "vì sao không kết nối được" theo từng tầng, thay vì thử ngẫu nhiên cho tới khi có gì đó chạy.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — The network from the shell: interfaces, ports and DNS|||9.1 — Mạng nhìn từ shell: giao diện, cổng và DNS',
      slug: 'lnx-9-1-giao-dien-cong-dns',
      type: 'LESSON',
      isFreePreview: true,
      description: 'ip addr và ip route thay cho ifconfig, ss để xem cái gì đang lắng nghe, khác biệt sống còn giữa 127.0.0.1 và 0.0.0.0, dig để đọc DNS thật, và một quy trình chẩn đoán theo tầng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The network from the shell</h2>
<p class="lead">"It cannot connect" is four different problems wearing the same sentence: no route, no name resolution, nothing listening, or a firewall. Each has a one-line test, and running them in order takes about twenty seconds — far less than the usual approach of restarting things until something changes.</p>

<h3>Interfaces and addresses</h3>
<pre><code>ip addr                      <span class="tok-comment"># or: ip a</span>
ip -brief addr               <span class="tok-comment"># the readable summary</span>
ip route                     <span class="tok-comment"># where traffic goes</span>
ip -brief link               <span class="tok-comment"># which interfaces are up</span></code></pre>
<div class="out">lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0             UP             203.0.113.42/24 fe80::5054:ff:fe12:3456/64
docker0          DOWN           172.17.0.1/16

default via 203.0.113.1 dev eth0 proto static
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>lo</code></span><span class="v">Loopback, always <code>127.0.0.1</code>. Traffic to it never leaves the machine — not even to the kernel's network card.</span></div>
  <div class="kv"><span class="k"><code>eth0</code> / <code>ens3</code> / <code>enp0s3</code></span><span class="v">The real interface. Modern names are predictable rather than sequential, which is why a VPS may call it <code>ens3</code>.</span></div>
  <div class="kv"><span class="k"><code>docker0</code></span><span class="v">Docker's bridge. <code>172.17.x.x</code> addresses belong to containers, which is why a container reaches the host at <code>172.17.0.1</code> and not at <code>127.0.0.1</code>.</span></div>
  <div class="kv"><span class="k"><code>default via …</code></span><span class="v">The gateway: anything not matching a more specific route goes here. No default route means no internet, regardless of everything else.</span></div>
</div>
<div class="callout"><code>ifconfig</code> and <code>netstat</code> come from <code>net-tools</code>, which has been deprecated for over a decade and is not installed by default on modern Ubuntu or on most container images. <code>ip</code> and <code>ss</code> replace them, are always present, and show things the old tools cannot — network namespaces, multiple addresses per interface, and the process holding a socket. Learn the new pair; you will meet machines where the old ones simply do not exist.</div>

<h3>ss: what is listening, and who owns it</h3>
<pre><code>sudo ss -tulpn               <span class="tok-comment"># the one command to memorise</span></code></pre>
<div class="out">Netid State  Local Address:Port  Peer Address:Port Process
tcp   LISTEN 127.0.0.1:5432      0.0.0.0:*         users:(("postgres",pid=901,fd=5))
tcp   LISTEN 0.0.0.0:80          0.0.0.0:*         users:(("nginx",pid=812,fd=6))
tcp   LISTEN 0.0.0.0:22          0.0.0.0:*         users:(("sshd",pid=743,fd=3))
tcp   LISTEN 127.0.0.1:3000      0.0.0.0:*         users:(("node",pid=5012,fd=21))</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-t</code> <code>-u</code></span><span class="v">TCP · UDP. Almost always you want both.</span></div>
  <div class="kv"><span class="k"><code>-l</code></span><span class="v">Only listening sockets. Drop it to see established connections too.</span></div>
  <div class="kv"><span class="k"><code>-p</code></span><span class="v">Which process — needs <code>sudo</code> to see other users' sockets. This is the column that answers "what is on port 3000".</span></div>
  <div class="kv"><span class="k"><code>-n</code></span><span class="v">Numeric: do not resolve port names or hostnames. Faster, and it shows you <code>:80</code> rather than <code>:http</code>.</span></div>
</div>
<pre><code>sudo ss -tulpn | grep :3000          <span class="tok-comment"># what holds this port</span>
ss -tan state established            <span class="tok-comment"># current connections</span>
ss -tan state established '( dport = :443 )' | wc -l   <span class="tok-comment"># how many to HTTPS</span>
sudo ss -tp | grep nginx             <span class="tok-comment"># everything one process has open</span></code></pre>
<div class="callout ok"><code>sudo ss -tulpn</code> is the answer to "address already in use", and it beats rebooting by a wide margin: it names the PID, so you can decide whether that process should be stopped (Lesson 5.3) or whether you picked the wrong port. It is the single most useful networking command on a server.</div>

<h3>127.0.0.1 versus 0.0.0.0 — the distinction that costs hours</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">127.0.0.1:3000</span><span class="lz-t">reachable ONLY from this machine</span><span class="lz-d">Loopback only. Perfect for a database or an app sitting behind a reverse proxy. Unreachable from another host no matter what the firewall says.</span></div>
  <div class="lz-step"><span class="lz-k">0.0.0.0:3000</span><span class="lz-t">reachable on EVERY interface</span><span class="lz-d">Including the public one. Correct for nginx on 80/443; a mistake for an app with no authentication.</span></div>
  <div class="lz-step"><span class="lz-k">203.0.113.42:3000</span><span class="lz-t">only on that one address</span><span class="lz-d">Used when a machine has several interfaces and the service should answer on just one.</span></div>
  <div class="lz-step"><span class="lz-k">In a container</span><span class="lz-t">127.0.0.1 means the CONTAINER's loopback</span><span class="lz-d">An app binding 127.0.0.1 inside a container is unreachable even from the host, because the container has its own network namespace. Bind 0.0.0.0 inside, and publish narrowly with -p 127.0.0.1:3000:3000.</span></div>
</div>
<pre><code><span class="tok-comment"># Look at the address, not just the port</span>
sudo ss -tulpn | awk '\$5 ~ /:3000\$/'</code></pre>
<div class="out">tcp LISTEN 127.0.0.1:3000 0.0.0.0:* users:(("node",pid=5012,fd=21))</div>
<p>The service is up, the firewall is open, and the connection from outside still fails — because it is bound to loopback. <code>curl localhost:3000</code> on the machine succeeds and proves nothing. The container version of this is the same mistake one layer down, and it is the most common reason a Dockerised app "starts fine but is not reachable".</p>
<div class="callout warn">The inverse is a security problem. A development database started with <code>--bind 0.0.0.0</code> or an app listening on <code>0.0.0.0:5432</code> on a cloud VPS is exposed to the entire internet the moment the provider's firewall is permissive. <code>sudo ss -tulpn | grep '0.0.0.0'</code> on a server you inherit is a thirty-second audit worth doing.</div>

<h3>DNS: dig, and where the answer came from</h3>
<pre><code>dig cuongthai.com                    <span class="tok-comment"># full answer</span>
dig +short cuongthai.com             <span class="tok-comment"># just the address</span>
dig +short cuongthai.com MX          <span class="tok-comment"># mail servers</span>
dig +short cuongthai.com NS          <span class="tok-comment"># nameservers</span>
dig @1.1.1.1 +short cuongthai.com    <span class="tok-comment"># ask a SPECIFIC resolver</span>
dig +trace cuongthai.com             <span class="tok-comment"># follow the delegation from the root</span></code></pre>
<div class="out">;; ANSWER SECTION:
cuongthai.com.    300  IN  A  203.0.113.42

;; Query time: 12 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)</div>
<div class="callout"><code>@1.1.1.1</code> is the flag that resolves DNS arguments. If <code>dig +short example.com</code> gives an old address but <code>dig @1.1.1.1 +short example.com</code> gives the new one, the record has propagated and <em>your</em> resolver is serving a cached copy — so the fix is waiting or flushing, not editing DNS again. The <code>SERVER:</code> line at the bottom tells you which resolver actually answered.</div>
<pre><code>resolvectl status | head -20         <span class="tok-comment"># systemd-resolved: the real config</span>
cat /etc/resolv.conf                 <span class="tok-comment"># often just points at 127.0.0.53</span>
resolvectl flush-caches              <span class="tok-comment"># clear the local cache</span>
getent hosts cuongthai.com           <span class="tok-comment"># resolve the way APPLICATIONS do</span></code></pre>
<div class="callout warn"><code>dig</code> talks to a DNS server directly; applications go through the C library, which also reads <code>/etc/hosts</code> and follows <code>/etc/nsswitch.conf</code>. So <code>dig</code> and your app can legitimately disagree — most often because someone left an entry in <code>/etc/hosts</code>. <code>getent hosts &lt;name&gt;</code> follows the same path an application does, and comparing the two answers tells you immediately which layer is lying.</div>

<h3>Testing connectivity, layer by layer</h3>
<pre><code>ping -c3 1.1.1.1                     <span class="tok-comment"># 1. is the network up at all?</span>
ping -c3 cuongthai.com               <span class="tok-comment"># 2. does DNS work?</span>
nc -zv cuongthai.com 443             <span class="tok-comment"># 3. is the PORT open?</span>
curl -sS -o /dev/null -w '%{http_code}\\n' https://cuongthai.com   <span class="tok-comment"># 4. does the app answer?</span></code></pre>
<div class="out">3 packets transmitted, 3 received, 0% packet loss
ping: cuongthai.com: Temporary failure in name resolution
</div>
<p>Those two lines together are a complete diagnosis: the network is fine, DNS is broken. Without the split you would be guessing. Run them in that order and the first failure names the layer.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">ping IP fails</span><span class="lz-lnote">No route, interface down, or ICMP blocked. Check <code>ip route</code> and <code>ip -brief link</code>. Note that many clouds drop ICMP, so a failing ping to a public host is not conclusive — <code>nc -z</code> is the better test.</span></div>
  <div class="lz-layer"><span class="lz-lname">ping IP works, ping name fails</span><span class="lz-lnote">DNS. Check <code>resolvectl status</code>, then <code>dig @1.1.1.1</code> to see whether it is your resolver or the record.</span></div>
  <div class="lz-layer"><span class="lz-lname">Name resolves, port closed</span><span class="lz-lnote">Nothing listening, or a firewall. <code>sudo ss -tulpn</code> on the server distinguishes the two: if it IS listening, the block is between you.</span></div>
  <div class="lz-layer"><span class="lz-lname">Port open, HTTP fails</span><span class="lz-lnote">Application-level: wrong vhost, TLS mismatch, a 502 from the proxy. Now it is <code>curl -v</code> (Lesson 9.2) and the service's own logs.</span></div>
</div>

<h3>A few more tools worth having</h3>
<pre><code>nc -zv host 22                       <span class="tok-comment"># port check, no data sent</span>
nc -zv host 20-25                    <span class="tok-comment"># a small range</span>
timeout 3 bash -c 'echo &gt; /dev/tcp/host/443' &amp;&amp; echo open   <span class="tok-comment"># no nc needed</span>

traceroute -n 1.1.1.1                <span class="tok-comment"># where the path stops</span>
mtr -rwc 20 1.1.1.1                  <span class="tok-comment"># traceroute + ping, far more useful</span>

curl -s ifconfig.me                  <span class="tok-comment"># my public IP</span>
ip route get 1.1.1.1                 <span class="tok-comment"># which interface and source IP would be used</span></code></pre>
<div class="out">1.1.1.1 via 203.0.113.1 dev eth0 src 203.0.113.42 uid 1001</div>
<div class="callout ok">Bash's <code>/dev/tcp/host/port</code> is a built-in TCP client — no <code>nc</code>, no <code>telnet</code>, nothing to install. On a minimal container that has neither, <code>timeout 3 bash -c 'echo &gt; /dev/tcp/db/5432'</code> answers "can this container reach the database" immediately. It is a bash feature, not a real device file, so it does not work in <code>sh</code>.</div>

<h3>Watching traffic</h3>
<pre><code>sudo tcpdump -i any -n port 3000            <span class="tok-comment"># is anything arriving at all?</span>
sudo tcpdump -i any -n host 203.0.113.9     <span class="tok-comment"># traffic to or from one host</span>
sudo tcpdump -i any -n -c 20 'tcp[tcpflags] &amp; tcp-syn != 0'   <span class="tok-comment"># connection attempts</span></code></pre>
<p><code>tcpdump</code> settles the question the other tools cannot: <em>is the packet arriving</em>. If the client says "connection refused" and <code>tcpdump</code> on the server sees nothing, the traffic is being dropped before it reaches you — a cloud security group, an upstream firewall, or the wrong IP entirely. If <code>tcpdump</code> sees the SYN and nothing replies, the packet arrived and the local machine rejected it, which points at the host firewall or at nothing listening.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man8/ss.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">ss(8) — socket statistics</span><span class="lc-sub">Every flag and the filter expression language. The EXAMPLES section alone replaces most of what people use <code>netstat</code> for.</span></span>
</a>
<a class="link-card" href="https://www.redhat.com/sysadmin/net-tools-vs-iproute2" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">net-tools vs iproute2 — the translation table</span><span class="lc-sub">Old command on the left, modern equivalent on the right. Useful when following an older tutorial that assumes <code>ifconfig</code>.</span></span>
</a>
<a class="link-card" href="https://www.cloudflare.com/learning/dns/what-is-dns/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Cloudflare Learning — How DNS works</span><span class="lc-sub">Recursive resolvers, authoritative servers, TTLs and caching, explained clearly. The background that makes <code>dig +trace</code> readable.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: diagnose four outages</span><span class="lc-sub">Four scenarios with the same symptom — no route, broken DNS, bound to loopback, blocked port. Identify each using the layered checklist.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> testing a service with <code>curl localhost:3000</code> on the server and concluding it is reachable. Loopback bypasses the interface, the firewall and the bind address, so that test passes for a service bound to <code>127.0.0.1</code> that nothing outside can reach — which is exactly the failure you are trying to find. Test from <em>another machine</em>, or at minimum use the server's real address: <code>curl 203.0.113.42:3000</code>. And check the bind address with <code>ss -tulpn</code> before blaming the firewall, because no firewall rule can make a loopback-bound service reachable.</div>
<p class="note-ct"><strong>Two commands cover most of this chapter:</strong> <code>sudo ss -tulpn</code> for "what is listening, on which address, held by which process", and the four-step ladder <code>ping IP → ping name → nc -z port → curl</code> for "where exactly does it break". The ladder matters more than any single tool, because it turns one vague symptom into a named layer — and every layer has a different fix.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Mạng nhìn từ shell</h2>
<p class="lead">"Không kết nối được" là bốn vấn đề khác nhau khoác chung một câu nói: không có đường đi, không phân giải được tên, không có gì lắng nghe, hoặc có tường lửa. Mỗi cái có một phép thử một dòng, và chạy chúng theo đúng thứ tự mất chừng hai mươi giây — ít hơn nhiều so với cách làm quen thuộc là khởi động lại đủ thứ cho tới khi có gì đó đổi khác.</p>

<h3>Giao diện và địa chỉ</h3>
<pre><code>ip addr                      <span class="tok-comment"># hoặc: ip a</span>
ip -brief addr               <span class="tok-comment"># bản tóm tắt dễ đọc</span>
ip route                     <span class="tok-comment"># lưu lượng đi đâu</span>
ip -brief link               <span class="tok-comment"># giao diện nào đang bật</span></code></pre>
<div class="out">lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0             UP             203.0.113.42/24 fe80::5054:ff:fe12:3456/64
docker0          DOWN           172.17.0.1/16

default via 203.0.113.1 dev eth0 proto static
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>lo</code></span><span class="v">Loopback, luôn là <code>127.0.0.1</code>. Lưu lượng đi tới nó KHÔNG BAO GIỜ rời khỏi máy — thậm chí không tới cả card mạng.</span></div>
  <div class="kv"><span class="k"><code>eth0</code> / <code>ens3</code> / <code>enp0s3</code></span><span class="v">Giao diện thật. Tên đời mới là tên đoán trước được chứ không đánh số tuần tự, và đó là lý do một VPS có thể gọi nó là <code>ens3</code>.</span></div>
  <div class="kv"><span class="k"><code>docker0</code></span><span class="v">Cầu nối của Docker. Các địa chỉ <code>172.17.x.x</code> thuộc về container, và đó là lý do một container với tới máy chủ qua <code>172.17.0.1</code> chứ không qua <code>127.0.0.1</code>.</span></div>
  <div class="kv"><span class="k"><code>default via …</code></span><span class="v">Cổng ra: mọi thứ không khớp một tuyến cụ thể hơn đều đi qua đây. Không có tuyến mặc định nghĩa là không có internet, bất kể mọi thứ khác ra sao.</span></div>
</div>
<div class="callout"><code>ifconfig</code> và <code>netstat</code> đến từ <code>net-tools</code>, thứ đã bị khai tử hơn một thập kỷ và không được cài sẵn trên Ubuntu đời mới hay trên phần lớn ảnh container. <code>ip</code> và <code>ss</code> thay thế chúng, luôn có sẵn, và cho thấy những thứ mà công cụ cũ không thể — không gian tên mạng, nhiều địa chỉ trên một giao diện, và tiến trình đang giữ một socket. Hãy học cặp mới; bạn sẽ gặp những cái máy mà cặp cũ đơn giản là không tồn tại.</div>

<h3>ss: cái gì đang lắng nghe, và ai sở hữu nó</h3>
<pre><code>sudo ss -tulpn               <span class="tok-comment"># lệnh duy nhất cần học thuộc</span></code></pre>
<div class="out">Netid State  Local Address:Port  Peer Address:Port Process
tcp   LISTEN 127.0.0.1:5432      0.0.0.0:*         users:(("postgres",pid=901,fd=5))
tcp   LISTEN 0.0.0.0:80          0.0.0.0:*         users:(("nginx",pid=812,fd=6))
tcp   LISTEN 0.0.0.0:22          0.0.0.0:*         users:(("sshd",pid=743,fd=3))
tcp   LISTEN 127.0.0.1:3000      0.0.0.0:*         users:(("node",pid=5012,fd=21))</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-t</code> <code>-u</code></span><span class="v">TCP · UDP. Gần như lúc nào bạn cũng muốn cả hai.</span></div>
  <div class="kv"><span class="k"><code>-l</code></span><span class="v">Chỉ những socket đang lắng nghe. Bỏ nó đi để thấy cả các kết nối đã thiết lập.</span></div>
  <div class="kv"><span class="k"><code>-p</code></span><span class="v">Tiến trình nào — cần <code>sudo</code> mới thấy socket của người dùng khác. Đây là cột trả lời câu "cái gì đang nằm trên cổng 3000".</span></div>
  <div class="kv"><span class="k"><code>-n</code></span><span class="v">Theo số: đừng phân giải tên cổng hay tên máy. Nhanh hơn, và nó cho bạn thấy <code>:80</code> thay vì <code>:http</code>.</span></div>
</div>
<pre><code>sudo ss -tulpn | grep :3000          <span class="tok-comment"># cái gì đang giữ cổng này</span>
ss -tan state established            <span class="tok-comment"># các kết nối hiện tại</span>
ss -tan state established '( dport = :443 )' | wc -l   <span class="tok-comment"># bao nhiêu kết nối tới HTTPS</span>
sudo ss -tp | grep nginx             <span class="tok-comment"># mọi thứ một tiến trình đang mở</span></code></pre>
<div class="callout ok"><code>sudo ss -tulpn</code> chính là câu trả lời cho lỗi "address already in use", và nó hơn hẳn việc khởi động lại máy: nó gọi tên PID, nên bạn quyết định được là có nên dừng tiến trình đó không (Bài 5.3) hay là mình chọn nhầm cổng. Đây là lệnh mạng hữu ích nhất trên một máy chủ.</div>

<h3>127.0.0.1 so với 0.0.0.0 — chỗ phân biệt tốn hàng giờ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">127.0.0.1:3000</span><span class="lz-t">CHỈ với tới được từ chính máy này</span><span class="lz-d">Chỉ loopback. Hoàn hảo cho một cơ sở dữ liệu hay một ứng dụng nằm sau một proxy ngược. Không với tới được từ máy khác, bất kể tường lửa nói gì.</span></div>
  <div class="lz-step"><span class="lz-k">0.0.0.0:3000</span><span class="lz-t">với tới được trên MỌI giao diện</span><span class="lz-d">Kể cả giao diện công khai. Đúng cho nginx trên 80/443; là sai lầm với một ứng dụng không có xác thực.</span></div>
  <div class="lz-step"><span class="lz-k">203.0.113.42:3000</span><span class="lz-t">chỉ trên đúng một địa chỉ đó</span><span class="lz-d">Dùng khi một máy có nhiều giao diện và dịch vụ chỉ nên trả lời trên một cái.</span></div>
  <div class="lz-step"><span class="lz-k">Bên trong container</span><span class="lz-t">127.0.0.1 nghĩa là loopback CỦA CONTAINER</span><span class="lz-d">Một ứng dụng gắn vào 127.0.0.1 bên trong container thì ngay cả máy chủ cũng không với tới, vì container có không gian tên mạng riêng. Hãy gắn 0.0.0.0 bên trong, rồi công bố một cách hẹp bằng -p 127.0.0.1:3000:3000.</span></div>
</div>
<pre><code><span class="tok-comment"># Hãy nhìn ĐỊA CHỈ, không chỉ nhìn cổng</span>
sudo ss -tulpn | awk '\$5 ~ /:3000\$/'</code></pre>
<div class="out">tcp LISTEN 127.0.0.1:3000 0.0.0.0:* users:(("node",pid=5012,fd=21))</div>
<p>Dịch vụ đang chạy, tường lửa đang mở, mà kết nối từ bên ngoài vẫn hỏng — vì nó gắn vào loopback. Lệnh <code>curl localhost:3000</code> chạy trên chính máy đó thì thành công và chẳng chứng minh được gì. Phiên bản container của chuyện này là đúng sai lầm ấy lùi thêm một tầng, và nó là lý do phổ biến nhất khiến một ứng dụng đóng gói Docker "khởi động ngon lành mà không với tới được".</p>
<div class="callout warn">Chiều ngược lại là một vấn đề an ninh. Một cơ sở dữ liệu dùng để phát triển khởi động với <code>--bind 0.0.0.0</code>, hay một ứng dụng lắng nghe trên <code>0.0.0.0:5432</code> ở một VPS đám mây, là bị phơi ra cả internet ngay khoảnh khắc tường lửa của nhà cung cấp dễ dãi. Chạy <code>sudo ss -tulpn | grep '0.0.0.0'</code> trên một máy chủ bạn tiếp quản là một phép rà soát ba mươi giây rất đáng làm.</div>

<h3>DNS: dig, và câu trả lời đến từ đâu</h3>
<pre><code>dig cuongthai.com                    <span class="tok-comment"># câu trả lời đầy đủ</span>
dig +short cuongthai.com             <span class="tok-comment"># chỉ lấy địa chỉ</span>
dig +short cuongthai.com MX          <span class="tok-comment"># máy chủ thư</span>
dig +short cuongthai.com NS          <span class="tok-comment"># máy chủ tên</span>
dig @1.1.1.1 +short cuongthai.com    <span class="tok-comment"># hỏi một bộ phân giải CỤ THỂ</span>
dig +trace cuongthai.com             <span class="tok-comment"># đi theo chuỗi uỷ quyền từ gốc</span></code></pre>
<div class="out">;; ANSWER SECTION:
cuongthai.com.    300  IN  A  203.0.113.42

;; Query time: 12 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)</div>
<div class="callout"><code>@1.1.1.1</code> là cái cờ kết thúc mọi tranh cãi về DNS. Nếu <code>dig +short example.com</code> cho ra địa chỉ cũ mà <code>dig @1.1.1.1 +short example.com</code> lại cho ra địa chỉ mới, thì bản ghi ĐÃ lan truyền và chính bộ phân giải <em>CỦA BẠN</em> đang phục vụ một bản đã lưu tạm — nên cách chữa là chờ hoặc xả bộ đệm, chứ không phải đi sửa DNS lần nữa. Dòng <code>SERVER:</code> ở cuối cho bạn biết bộ phân giải nào thật sự đã trả lời.</div>
<pre><code>resolvectl status | head -20         <span class="tok-comment"># systemd-resolved: cấu hình thật</span>
cat /etc/resolv.conf                 <span class="tok-comment"># thường chỉ trỏ vào 127.0.0.53</span>
resolvectl flush-caches              <span class="tok-comment"># xoá bộ đệm cục bộ</span>
getent hosts cuongthai.com           <span class="tok-comment"># phân giải theo đúng cách ỨNG DỤNG làm</span></code></pre>
<div class="callout warn"><code>dig</code> nói chuyện trực tiếp với một máy chủ DNS; còn ứng dụng thì đi qua thư viện C, thứ còn đọc cả <code>/etc/hosts</code> và tuân theo <code>/etc/nsswitch.conf</code>. Nên <code>dig</code> và ứng dụng của bạn hoàn toàn có thể bất đồng một cách chính đáng — thường gặp nhất là vì ai đó để sót một dòng trong <code>/etc/hosts</code>. Lệnh <code>getent hosts &lt;tên&gt;</code> đi theo đúng con đường mà một ứng dụng đi, và so hai câu trả lời là biết ngay tầng nào đang nói dối.</div>

<h3>Kiểm kết nối, theo từng tầng</h3>
<pre><code>ping -c3 1.1.1.1                     <span class="tok-comment"># 1. mạng có lên không đã?</span>
ping -c3 cuongthai.com               <span class="tok-comment"># 2. DNS có chạy không?</span>
nc -zv cuongthai.com 443             <span class="tok-comment"># 3. CỔNG có mở không?</span>
curl -sS -o /dev/null -w '%{http_code}\\n' https://cuongthai.com   <span class="tok-comment"># 4. ứng dụng có trả lời không?</span></code></pre>
<div class="out">3 packets transmitted, 3 received, 0% packet loss
ping: cuongthai.com: Temporary failure in name resolution
</div>
<p>Hai dòng đó đứng cạnh nhau là một chẩn đoán hoàn chỉnh: mạng thì ổn, DNS thì hỏng. Không tách ra như vậy thì bạn chỉ đang đoán. Hãy chạy chúng theo đúng thứ tự đó và chỗ hỏng đầu tiên sẽ gọi tên cái tầng.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">ping tới IP hỏng</span><span class="lz-lnote">Không có đường đi, giao diện đang tắt, hoặc ICMP bị chặn. Hãy xem <code>ip route</code> và <code>ip -brief link</code>. Lưu ý nhiều nhà cung cấp đám mây chặn ICMP, nên ping hỏng tới một máy công khai KHÔNG phải bằng chứng dứt khoát — <code>nc -z</code> mới là phép thử tốt hơn.</span></div>
  <div class="lz-layer"><span class="lz-lname">ping IP được, ping tên hỏng</span><span class="lz-lnote">DNS. Hãy xem <code>resolvectl status</code>, rồi <code>dig @1.1.1.1</code> để biết là do bộ phân giải của bạn hay do bản ghi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tên phân giải được, cổng đóng</span><span class="lz-lnote">Không có gì lắng nghe, hoặc có tường lửa. <code>sudo ss -tulpn</code> trên máy chủ phân biệt được hai cái: nếu nó ĐANG lắng nghe thì chỗ chặn nằm giữa hai bên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cổng mở, HTTP hỏng</span><span class="lz-lnote">Ở tầng ứng dụng: sai vhost, lệch TLS, một mã 502 từ proxy. Tới đây thì việc của <code>curl -v</code> (Bài 9.2) và của log chính dịch vụ đó.</span></div>
</div>

<h3>Vài công cụ nữa đáng có</h3>
<pre><code>nc -zv host 22                       <span class="tok-comment"># kiểm cổng, không gửi dữ liệu nào</span>
nc -zv host 20-25                    <span class="tok-comment"># một khoảng nhỏ</span>
timeout 3 bash -c 'echo &gt; /dev/tcp/host/443' &amp;&amp; echo mở   <span class="tok-comment"># không cần nc</span>

traceroute -n 1.1.1.1                <span class="tok-comment"># đường đi dừng ở đâu</span>
mtr -rwc 20 1.1.1.1                  <span class="tok-comment"># traceroute + ping, hữu ích hơn nhiều</span>

curl -s ifconfig.me                  <span class="tok-comment"># IP công khai của tôi</span>
ip route get 1.1.1.1                 <span class="tok-comment"># sẽ đi qua giao diện nào và IP nguồn nào</span></code></pre>
<div class="out">1.1.1.1 via 203.0.113.1 dev eth0 src 203.0.113.42 uid 1001</div>
<div class="callout ok"><code>/dev/tcp/host/port</code> của bash là một trình khách TCP dựng sẵn — không cần <code>nc</code>, không cần <code>telnet</code>, không phải cài gì. Trên một container tối giản không có cả hai thứ đó, lệnh <code>timeout 3 bash -c 'echo &gt; /dev/tcp/db/5432'</code> trả lời ngay câu "container này có với tới cơ sở dữ liệu được không". Đó là một tính năng của bash chứ không phải một file thiết bị thật, nên nó không chạy trong <code>sh</code>.</div>

<h3>Xem lưu lượng</h3>
<pre><code>sudo tcpdump -i any -n port 3000            <span class="tok-comment"># có gì tới không đã?</span>
sudo tcpdump -i any -n host 203.0.113.9     <span class="tok-comment"># lưu lượng tới hoặc từ một máy</span>
sudo tcpdump -i any -n -c 20 'tcp[tcpflags] &amp; tcp-syn != 0'   <span class="tok-comment"># các lần thử kết nối</span></code></pre>
<p><code>tcpdump</code> giải quyết câu hỏi mà các công cụ kia không giải quyết được: <em>gói tin CÓ tới nơi không</em>. Nếu trình khách nói "connection refused" mà <code>tcpdump</code> trên máy chủ chẳng thấy gì, thì lưu lượng đang bị vứt đi TRƯỚC khi tới được bạn — một nhóm bảo mật của đám mây, một tường lửa ở phía trên, hoặc hoàn toàn sai địa chỉ IP. Nếu <code>tcpdump</code> thấy gói SYN mà không có gì trả lời, thì gói tin ĐÃ tới nơi và chính máy này từ chối nó, và điều đó chĩa vào tường lửa của máy hoặc vào việc không có gì lắng nghe.</p>

<a class="link-card" href="https://man7.org/linux/man-pages/man8/ss.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">ss(8) — thống kê socket</span><span class="lc-sub">Mọi cờ và ngôn ngữ biểu thức lọc. Riêng mục EXAMPLES đã thay được phần lớn những việc người ta dùng <code>netstat</code> để làm.</span></span>
</a>
<a class="link-card" href="https://www.redhat.com/sysadmin/net-tools-vs-iproute2" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">net-tools với iproute2 — bảng quy đổi</span><span class="lc-sub">Lệnh cũ bên trái, lệnh tương đương đời mới bên phải. Hữu ích khi bạn đi theo một bài hướng dẫn cũ vốn giả định là có <code>ifconfig</code>.</span></span>
</a>
<a class="link-card" href="https://www.cloudflare.com/learning/dns/what-is-dns/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Cloudflare Learning — DNS hoạt động thế nào</span><span class="lc-sub">Bộ phân giải đệ quy, máy chủ có thẩm quyền, TTL và bộ đệm, giải thích rõ ràng. Đây là phần nền làm cho <code>dig +trace</code> đọc được.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chẩn đoán bốn sự cố</span><span class="lc-sub">Bốn tình huống cùng một triệu chứng — không có đường đi, DNS hỏng, gắn vào loopback, cổng bị chặn. Hãy nhận diện từng cái bằng bảng kiểm theo tầng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> kiểm một dịch vụ bằng <code>curl localhost:3000</code> ngay trên máy chủ rồi kết luận là nó với tới được. Loopback đi tắt qua cả giao diện, cả tường lửa và cả địa chỉ gắn, nên phép thử đó VẪN QUA với một dịch vụ gắn vào <code>127.0.0.1</code> mà bên ngoài không ai với tới — và đó chính xác là chỗ hỏng bạn đang đi tìm. Hãy kiểm từ <em>MỘT MÁY KHÁC</em>, hoặc ít nhất là dùng địa chỉ thật của máy chủ: <code>curl 203.0.113.42:3000</code>. Và hãy kiểm địa chỉ gắn bằng <code>ss -tulpn</code> TRƯỚC KHI đổ lỗi cho tường lửa, vì không luật tường lửa nào làm cho một dịch vụ gắn vào loopback trở nên với tới được.</div>
<p class="note-ct"><strong>Hai lệnh phủ gần hết chương này:</strong> <code>sudo ss -tulpn</code> cho câu "cái gì đang lắng nghe, trên địa chỉ nào, do tiến trình nào giữ", và cái thang bốn bước <code>ping IP → ping tên → nc -z cổng → curl</code> cho câu "chính xác thì nó vỡ ở đâu". Cái thang quan trọng hơn bất kỳ công cụ đơn lẻ nào, vì nó biến một triệu chứng mơ hồ thành một cái tầng có tên — và mỗi tầng có một cách chữa khác nhau.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — curl: the flags that matter|||9.2 — curl: những cờ thật sự quan trọng',
      slug: 'lnx-9-2-curl',
      type: 'LESSON',
      description: 'Vì sao -sSf là bộ mặc định cho script, -w để lấy đúng con số bạn cần, gửi JSON và header xác thực an toàn, -v để đọc trọn một cuộc trao đổi, và cách phân biệt lỗi mạng với lỗi ứng dụng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>curl</h2>
<p class="lead"><code>curl</code> has over two hundred flags and you need about ten. The important thing is not the list — it is that <strong>curl's default behaviour is wrong for scripts</strong>: it prints a progress bar to stderr, follows no redirects, and exits 0 on an HTTP 500. Three flags fix all of that, and everything else in this lesson builds on them.</p>

<h3>The defaults you should almost always change</h3>
<pre><code>curl https://api.example.com/data              <span class="tok-comment"># progress bar, no redirects, exit 0 on 500</span>
curl -sSf https://api.example.com/data         <span class="tok-comment"># the script default</span>
curl -sSfL https://api.example.com/data        <span class="tok-comment"># …and follow redirects</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-s</code> silent</span><span class="v">No progress meter. Essential in a script, where the meter would otherwise contaminate the log.</span></div>
  <div class="kv"><span class="k"><code>-S</code> show-error</span><span class="v">Undoes the part of <code>-s</code> that also hides real error messages. <code>-sS</code> means "quiet, but tell me if it breaks", which is what you actually wanted.</span></div>
  <div class="kv"><span class="k"><code>-f</code> fail</span><span class="v"><strong>Exit non-zero on HTTP 4xx/5xx.</strong> Without it curl considers a 404 a successful transfer of an error page, and your script continues with the error page as its data.</span></div>
  <div class="kv"><span class="k"><code>-L</code> location</span><span class="v">Follow redirects. Many APIs and every <code>http://</code> URL on a modern site returns a 301 first, and without <code>-L</code> you get the redirect page instead of the content.</span></div>
</div>
<pre><code>curl -s https://example.com/missing &gt; data.json
echo \$?                                    <span class="tok-comment"># 0 — "success"</span>
cat data.json                              <span class="tok-comment"># an HTML 404 page</span>

curl -sSf https://example.com/missing &gt; data.json
echo \$?</code></pre>
<div class="out">0
&lt;!DOCTYPE html&gt;&lt;title&gt;404 Not Found&lt;/title&gt;…
curl: (22) The requested URL returned error: 404
22</div>
<div class="callout ok"><strong><code>-sSf</code> is the muscle memory to build.</strong> Without <code>-f</code>, a pipeline like <code>curl … | jq '.items'</code> receives an HTML error page, <code>jq</code> fails with a confusing parse error, and — because of the pipeline exit-status rule from Lesson 3.2 — the script may not even notice. <code>-f</code> plus <code>set -o pipefail</code> turns that into a clean, early failure that names the URL.</div>

<h3>Saving output</h3>
<pre><code>curl -sSfL -o page.html https://example.com       <span class="tok-comment"># -o: a name you choose</span>
curl -sSfLO https://example.com/file.tar.gz       <span class="tok-comment"># -O: keep the remote name</span>
curl -sSfL https://example.com &gt; page.html        <span class="tok-comment"># redirection works too</span>
curl -sSfL --create-dirs -o out/a/b.json "\$url"   <span class="tok-comment"># make the directories</span>
curl -sSfL -C - -O https://example.com/big.iso    <span class="tok-comment"># -C -: resume a partial download</span></code></pre>
<div class="callout warn">With <code>-O</code>, the filename comes from the <em>URL</em>, and a hostile or careless URL can end in <code>../../.bashrc</code>. Use <code>-o</code> with a name you control whenever the URL is not a constant in your own script — the same class of problem as the path validation in Lesson 7.2.</div>

<h3>-w: extracting exactly one number</h3>
<pre><code>curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com
curl -s -o /dev/null -w '%{time_total}\\n' https://cuongthai.com
curl -s -o /dev/null -w 'code=%{http_code} time=%{time_total}s size=%{size_download}\\n' "\$url"</code></pre>
<div class="out">200
0.184
code=200 time=0.184s size=48213</div>
<p>That first line is the smoke test from Chapter 7: discard the body, print only the status code, and branch on it. It is the difference between "the deploy script finished" and "the route actually answers".</p>
<pre><code><span class="tok-comment"># Where the time actually goes — each number is cumulative</span>
curl -s -o /dev/null -w '
  dns:      %{time_namelookup}s
  connect:  %{time_connect}s
  tls:      %{time_appconnect}s
  ttfb:     %{time_starttransfer}s
  total:    %{time_total}s
' https://cuongthai.com</code></pre>
<div class="out">  dns:      0.004s
  connect:  0.021s
  tls:      0.078s
  ttfb:     0.176s
  total:    0.184s</div>
<div class="callout ok">Because the values are cumulative, the <em>gaps</em> are what matter: DNS took 4 ms, the TCP handshake 17 ms, the TLS handshake 57 ms, the server 98 ms to first byte, and the body 8 ms. A slow site is one of those five, and this one command tells you which — before you go looking at application code that may be entirely innocent.</div>

<h3>Methods, headers and JSON</h3>
<pre><code>curl -sSf -X POST https://api.example.com/items \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"test","qty":3}'

curl -sSf --json '{"name":"test"}' https://api.example.com/items   <span class="tok-comment"># curl 7.82+: sets both headers</span>

curl -sSf -X PUT  -d @payload.json -H 'Content-Type: application/json' "\$url"
curl -sSf -X DELETE "\$url/items/42"
curl -sSf -H "Authorization: Bearer \$TOKEN" "\$url/me"
curl -sSfI "\$url"                     <span class="tok-comment"># -I: HEAD — headers only, no body</span></code></pre>
<div class="callout warn">Using <code>-d</code> implies <code>-X POST</code>, so writing both is harmless but redundant — and mixing <code>-X GET</code> with <code>-d</code> produces a GET with a body, which many servers silently ignore. If a request "does nothing", check that the method and the data flag agree.</div>
<pre><code><span class="tok-comment"># Read a token from a file, so it never appears in ps or in history (Lesson 8.3)</span>
curl -sSf -H @auth-header.txt "\$url/me"
curl -sSf --config curlrc.txt "\$url"

<span class="tok-comment"># auth-header.txt</span>
Authorization: Bearer sk-live-...</code></pre>
<div class="callout">A token passed as <code>-H "Authorization: Bearer \$TOKEN"</code> is visible in <code>ps aux</code> to every user on the machine for the lifetime of the request, and lands in your shell history. <code>-H @file</code> and <code>--config file</code> read it from a file instead — the same reasoning as <code>~/.pgpass</code> and <code>~/.netrc</code> in Lesson 8.3. On a shared or production host, use them.</div>

<h3>-v: reading the whole exchange</h3>
<pre><code>curl -v https://cuongthai.com 2&gt;&amp;1 | head -30</code></pre>
<div class="out">*   Trying 203.0.113.42:443...
* Connected to cuongthai.com (203.0.113.42) port 443
* ALPN: server accepted h2
*  subject: CN=cuongthai.com
*  start date: Jul 14 00:00:00 2026 GMT
*  expire date: Oct 12 23:59:59 2026 GMT
*  issuer: C=US; O=Let's Encrypt; CN=R11
&gt; GET / HTTP/2
&gt; Host: cuongthai.com
&gt; user-agent: curl/8.5.0
&lt; HTTP/2 200
&lt; content-type: text/html; charset=utf-8
&lt; server: nginx</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>*</code></span><span class="v">curl's own notes: the resolved IP, the TLS handshake, the certificate's subject, issuer and expiry.</span></div>
  <div class="kv"><span class="k"><code>&gt;</code></span><span class="v">What curl sent. Useful for confirming which <code>Host</code> header a vhost actually received.</span></div>
  <div class="kv"><span class="k"><code>&lt;</code></span><span class="v">What the server replied. The status line and every response header.</span></div>
</div>
<p>Note the <code>expire date</code> line — <code>curl -v</code> is the fastest certificate check there is, and "the certificate expired at midnight" explains a large share of sites that broke overnight with no deploy. <code>-v</code> writes to stderr, which is why the <code>2&gt;&amp;1</code> is needed to pipe it.</p>
<pre><code>curl -sSf --resolve cuongthai.com:443:203.0.113.99 https://cuongthai.com/   <span class="tok-comment"># test a server before DNS points at it</span>
curl -sSfI -H 'Host: cuongthai.com' http://203.0.113.42/                    <span class="tok-comment"># test a vhost by IP</span>
curl -sSf --http1.1 "\$url"                                                  <span class="tok-comment"># force HTTP/1.1</span>
curl -sSf --max-time 10 --connect-timeout 3 "\$url"                          <span class="tok-comment"># always in a script</span></code></pre>
<div class="callout ok"><code>--resolve</code> is the flag for testing a migration. It sends the request to an IP you name while still using the real hostname for TLS and the <code>Host</code> header — so you can verify the new server serves the site correctly <em>before</em> switching DNS, rather than switching and finding out. It beats editing <code>/etc/hosts</code>, because it affects one command instead of your whole machine.</div>

<h3>Timeouts belong in every script</h3>
<pre><code>curl -sSfL --connect-timeout 5 --max-time 30 --retry 3 --retry-delay 2 "\$url"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--connect-timeout</code></span><span class="v">Give up if the TCP connection is not established in N seconds. Without it, a dead host can hang for over two minutes.</span></div>
  <div class="kv"><span class="k"><code>--max-time</code></span><span class="v">A ceiling for the whole request. This is the one that stops a cron job from running until the next one starts.</span></div>
  <div class="kv"><span class="k"><code>--retry N</code></span><span class="v">Retry on transient errors and 5xx. Combine with <code>--retry-delay</code> or <code>--retry-all-errors</code>.</span></div>
</div>
<div class="callout warn">A <code>curl</code> without a timeout inside a cron job is the classic cause of a machine that slowly fills with processes: the endpoint stops responding, each invocation hangs indefinitely, and every five minutes another one starts. Combine <code>--max-time</code> with the <code>flock</code> guard from Lesson 7.3 and neither failure mode can occur.</div>

<h3>Telling a network failure from an application failure</h3>
<pre><code>curl -sSf "\$url"; echo "exit=\$?"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">6</span><span class="v">Could not resolve host — DNS, not the application (Lesson 9.1).</span></div>
  <div class="kv"><span class="k">7</span><span class="v">Failed to connect — nothing listening, or a firewall.</span></div>
  <div class="kv"><span class="k">22</span><span class="v">HTTP 4xx/5xx with <code>-f</code>. The connection worked; the application said no.</span></div>
  <div class="kv"><span class="k">28</span><span class="v">Timeout. It connected and then stalled — usually the server, sometimes the network.</span></div>
  <div class="kv"><span class="k">35 · 60</span><span class="v">TLS handshake failed · certificate could not be verified. Check <code>curl -v</code> for the expiry and the issuer.</span></div>
</div>
<pre><code><span class="tok-comment"># In a script: branch on the class of failure, not just on "it failed"</span>
if ! body=\$(curl -sSf --max-time 10 "\$url"); then
  case \$? in
    6)  die "DNS failure for \$url" ;;
    7)  die "connection refused — is the service running?" ;;
    22) die "server returned an HTTP error" ;;
    28) die "timed out after 10s" ;;
    *)  die "curl failed with \$?" ;;
  esac
fi</code></pre>
<div class="callout ok">Those five exit codes map exactly onto the four layers from Lesson 9.1, which means a health-check script can report <em>which layer</em> broke rather than "the check failed". That distinction is what makes an alert actionable at 3am.</div>

<h3>A real health check</h3>
<pre><code>check() {
  local url=\$1 expect=\${2:-200} code
  code=\$(curl -s -o /dev/null -w '%{http_code}' \\
         --connect-timeout 3 --max-time 10 "\$url" || echo 000)
  if [[ \$code == "\$expect" ]]; then
    printf '  OK   %-45s %s\\n' "\$url" "\$code"
  else
    printf '  FAIL %-45s %s (expected %s)\\n' "\$url" "\$code" "\$expect" &gt;&amp;2
    return 1
  fi
}

rc=0
check https://cuongthai.com                       || rc=1
check https://cuongthai.com/api/v1/posts     401  || rc=1
check https://cuongthai.com/api/v1/gifs      401  || rc=1
exit \$rc</code></pre>
<div class="out">  OK   https://cuongthai.com                         200
  OK   https://cuongthai.com/api/v1/posts            401
  FAIL https://cuongthai.com/api/v1/gifs             404 (expected 401)</div>
<p>A 401 is a <em>pass</em> here: it proves the route is mounted and demanding authentication. A 404 means the route is not mounted at all — a stale or partial build, which is exactly the failure this project hit on 2026-07-02 when a <code>--no-build</code> deploy shipped an old image. Checking for "not 404" rather than "200" is what makes the test meaningful for authenticated endpoints.</p>

<h3>The curl flags worth memorising</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">-i and -v</span><span class="lz-t">See the response, then the whole exchange</span><span class="lz-d"><code>-i</code> prints status and headers with the body; <code>-v</code> shows the request too. The answer to &quot;why did this fail&quot; is nearly always in one of them.</span></div>
  <div class="lz-node"><span class="lz-k">-f</span><span class="lz-t">Fail on an HTTP error</span><span class="lz-d">Without it, curl exits 0 on a 500 — so <code>curl … &amp;&amp; deploy</code> proceeds after the check failed. Essential in any script.</span></div>
  <div class="lz-node"><span class="lz-k">-L and --max-time</span><span class="lz-t">Follow redirects, and give up</span><span class="lz-d"><code>-L</code> because an endpoint that moved returns 301 with an empty body; <code>--max-time</code> because a hung request in a script blocks forever.</span></div>
  <div class="lz-node"><span class="lz-k">-w '%{http_code}'</span><span class="lz-t">Extract exactly one number</span><span class="lz-d"><code>-s -o /dev/null -w "%{http_code}"</code> prints just the status — the shape used for every route health check in this repository.</span></div>
</div>
<a class="link-card" href="https://everything.curl.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Everything curl</span><span class="lc-sub">A whole free book by curl's author. The "Using curl" chapters cover HTTP, TLS and debugging far better than the man page.</span></span>
</a>
<a class="link-card" href="https://curl.se/docs/manpage.html#-w" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">curl --write-out — every variable</span><span class="lc-sub">The full list: timings, sizes, redirect counts, TLS details, and <code>%{json}</code> to emit the whole lot as one object.</span></span>
</a>
<a class="link-card" href="https://curl.se/libcurl/c/libcurl-errors.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">curl exit codes</span><span class="lc-sub">All of them, with meanings. Worth a bookmark: an exit code turns "the request failed" into a specific, searchable cause.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write a health check</span><span class="lc-sub">Graded tasks: use <code>-w</code> for a status code, branch on curl exit codes, set sensible timeouts, and test a vhost with <code>--resolve</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>curl -k</code> (or <code>--insecure</code>) to "fix" a certificate error. It disables verification entirely, so the connection is encrypted but you have no idea to whom — which is the part that mattered. The error is telling you something real: an expired certificate, a missing intermediate, a hostname mismatch, or a proxy intercepting TLS. <code>curl -v</code> names which of those it is in three lines. Reach for <code>-k</code> only against a self-signed certificate you created yourself, and never leave it in a script that touches production, because it will still be there long after the underlying problem is forgotten.</div>
<p class="note-ct"><strong>Build the muscle memory for <code>curl -sSfL</code>.</strong> Silent, but still reports errors; fails on HTTP errors instead of saving them as data; follows redirects. Add <code>--max-time</code> in anything automated, and <code>-o /dev/null -w '%{http_code}'</code> whenever you want the answer rather than the page. Those four habits turn curl from something that usually works into something a script can trust.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>curl</h2>
<p class="lead"><code>curl</code> có hơn hai trăm cờ và bạn cần chừng mười cái. Điều quan trọng không nằm ở cái danh sách — nó nằm ở chỗ <strong>hành vi MẶC ĐỊNH của curl là sai với script</strong>: nó in một thanh tiến độ ra stderr, không đi theo chuyển hướng nào, và thoát ra với mã 0 khi gặp HTTP 500. Ba cái cờ chữa hết chỗ đó, và mọi thứ còn lại trong bài này đều dựng trên chúng.</p>

<h3>Những mặc định bạn gần như luôn phải đổi</h3>
<pre><code>curl https://api.example.com/data              <span class="tok-comment"># thanh tiến độ, không theo chuyển hướng, thoát 0 khi gặp 500</span>
curl -sSf https://api.example.com/data         <span class="tok-comment"># bộ mặc định cho script</span>
curl -sSfL https://api.example.com/data        <span class="tok-comment"># …và đi theo chuyển hướng</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-s</code> silent</span><span class="v">Không có đồng hồ tiến độ. Bắt buộc trong script, nơi mà cái đồng hồ đó sẽ làm bẩn file log.</span></div>
  <div class="kv"><span class="k"><code>-S</code> show-error</span><span class="v">Gỡ bỏ cái phần của <code>-s</code> vốn cũng giấu luôn thông báo lỗi thật. <code>-sS</code> nghĩa là "im lặng, nhưng hỏng thì phải báo", và đó mới là thứ bạn thật sự muốn.</span></div>
  <div class="kv"><span class="k"><code>-f</code> fail</span><span class="v"><strong>Thoát khác 0 khi gặp HTTP 4xx/5xx.</strong> Không có nó, curl coi một mã 404 là một lần truyền THÀNH CÔNG một trang lỗi, và script của bạn chạy tiếp với cái trang lỗi đó làm dữ liệu.</span></div>
  <div class="kv"><span class="k"><code>-L</code> location</span><span class="v">Đi theo chuyển hướng. Nhiều API và mọi URL <code>http://</code> trên một trang đời mới đều trả về 301 trước, và không có <code>-L</code> thì bạn nhận được trang chuyển hướng thay vì nội dung.</span></div>
</div>
<pre><code>curl -s https://example.com/missing &gt; data.json
echo \$?                                    <span class="tok-comment"># 0 — "thành công"</span>
cat data.json                              <span class="tok-comment"># một trang 404 dạng HTML</span>

curl -sSf https://example.com/missing &gt; data.json
echo \$?</code></pre>
<div class="out">0
&lt;!DOCTYPE html&gt;&lt;title&gt;404 Not Found&lt;/title&gt;…
curl: (22) The requested URL returned error: 404
22</div>
<div class="callout ok"><strong><code>-sSf</code> là phản xạ cần xây.</strong> Không có <code>-f</code>, một chuỗi ống như <code>curl … | jq '.items'</code> sẽ nhận về một trang lỗi HTML, <code>jq</code> hỏng với một thông báo phân tích khó hiểu, và — vì luật mã thoát của chuỗi ống ở Bài 3.2 — script thậm chí có thể không nhận ra. <code>-f</code> cộng với <code>set -o pipefail</code> biến chuyện đó thành một thất bại sạch sẽ, sớm, và gọi tên đúng cái URL.</div>

<h3>Lưu output</h3>
<pre><code>curl -sSfL -o page.html https://example.com       <span class="tok-comment"># -o: cái tên do BẠN chọn</span>
curl -sSfLO https://example.com/file.tar.gz       <span class="tok-comment"># -O: giữ tên ở đầu xa</span>
curl -sSfL https://example.com &gt; page.html        <span class="tok-comment"># chuyển hướng cũng được</span>
curl -sSfL --create-dirs -o out/a/b.json "\$url"   <span class="tok-comment"># tự tạo các thư mục</span>
curl -sSfL -C - -O https://example.com/big.iso    <span class="tok-comment"># -C -: nối tiếp một lần tải dở</span></code></pre>
<div class="callout warn">Với <code>-O</code>, tên file lấy từ <em>URL</em>, và một URL hiểm ác hoặc bất cẩn có thể kết thúc bằng <code>../../.bashrc</code>. Hãy dùng <code>-o</code> với một cái tên bạn kiểm soát mỗi khi URL không phải một hằng số nằm trong chính script của bạn — cùng loại vấn đề với phần kiểm đường dẫn ở Bài 7.2.</div>

<h3>-w: rút ra đúng một con số</h3>
<pre><code>curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com
curl -s -o /dev/null -w '%{time_total}\\n' https://cuongthai.com
curl -s -o /dev/null -w 'code=%{http_code} time=%{time_total}s size=%{size_download}\\n' "\$url"</code></pre>
<div class="out">200
0.184
code=200 time=0.184s size=48213</div>
<p>Dòng đầu tiên đó chính là chốt kiểm ở Chương 7: vứt phần thân đi, chỉ in mã trạng thái, rồi rẽ nhánh theo nó. Đó là khác biệt giữa "script deploy đã chạy xong" và "cái tuyến đó THẬT SỰ có trả lời".</p>
<pre><code><span class="tok-comment"># Thời gian thật ra đổ đi đâu — mỗi con số là mốc cộng dồn</span>
curl -s -o /dev/null -w '
  dns:      %{time_namelookup}s
  connect:  %{time_connect}s
  tls:      %{time_appconnect}s
  ttfb:     %{time_starttransfer}s
  total:    %{time_total}s
' https://cuongthai.com</code></pre>
<div class="out">  dns:      0.004s
  connect:  0.021s
  tls:      0.078s
  ttfb:     0.176s
  total:    0.184s</div>
<div class="callout ok">Vì các giá trị là cộng dồn, thứ có ý nghĩa là các <em>KHOẢNG CHÊNH</em>: DNS mất 4 ms, bắt tay TCP 17 ms, bắt tay TLS 57 ms, máy chủ 98 ms để ra byte đầu tiên, và phần thân 8 ms. Một trang chậm là chậm ở một trong năm chỗ đó, và đúng một lệnh này nói cho bạn biết chỗ nào — trước khi bạn đi soi mã ứng dụng, thứ có thể hoàn toàn vô tội.</div>

<h3>Phương thức, header và JSON</h3>
<pre><code>curl -sSf -X POST https://api.example.com/items \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"test","qty":3}'

curl -sSf --json '{"name":"test"}' https://api.example.com/items   <span class="tok-comment"># curl 7.82+: đặt sẵn cả hai header</span>

curl -sSf -X PUT  -d @payload.json -H 'Content-Type: application/json' "\$url"
curl -sSf -X DELETE "\$url/items/42"
curl -sSf -H "Authorization: Bearer \$TOKEN" "\$url/me"
curl -sSfI "\$url"                     <span class="tok-comment"># -I: HEAD — chỉ header, không lấy thân</span></code></pre>
<div class="callout warn">Dùng <code>-d</code> đã ngầm bao hàm <code>-X POST</code>, nên viết cả hai thì vô hại nhưng thừa — còn trộn <code>-X GET</code> với <code>-d</code> thì sinh ra một yêu cầu GET có phần thân, thứ mà nhiều máy chủ âm thầm bỏ qua. Nếu một yêu cầu "chẳng làm gì cả", hãy kiểm xem phương thức và cờ dữ liệu có ăn khớp với nhau không.</div>
<pre><code><span class="tok-comment"># Đọc token từ một file, để nó không bao giờ hiện trong ps hay trong lịch sử (Bài 8.3)</span>
curl -sSf -H @auth-header.txt "\$url/me"
curl -sSf --config curlrc.txt "\$url"

<span class="tok-comment"># auth-header.txt</span>
Authorization: Bearer sk-live-...</code></pre>
<div class="callout">Một token truyền qua <code>-H "Authorization: Bearer \$TOKEN"</code> thì mọi người dùng trên máy đều nhìn thấy trong <code>ps aux</code> suốt thời gian yêu cầu chạy, và nó rơi vào lịch sử shell của bạn. <code>-H @file</code> và <code>--config file</code> đọc nó từ một file thay vào — cùng một lý lẽ với <code>~/.pgpass</code> và <code>~/.netrc</code> ở Bài 8.3. Trên một máy dùng chung hay máy production, hãy dùng chúng.</div>

<h3>-v: đọc trọn một cuộc trao đổi</h3>
<pre><code>curl -v https://cuongthai.com 2&gt;&amp;1 | head -30</code></pre>
<div class="out">*   Trying 203.0.113.42:443...
* Connected to cuongthai.com (203.0.113.42) port 443
* ALPN: server accepted h2
*  subject: CN=cuongthai.com
*  start date: Jul 14 00:00:00 2026 GMT
*  expire date: Oct 12 23:59:59 2026 GMT
*  issuer: C=US; O=Let's Encrypt; CN=R11
&gt; GET / HTTP/2
&gt; Host: cuongthai.com
&gt; user-agent: curl/8.5.0
&lt; HTTP/2 200
&lt; content-type: text/html; charset=utf-8
&lt; server: nginx</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>*</code></span><span class="v">Ghi chú của chính curl: IP đã phân giải ra, cái bắt tay TLS, chủ thể/nơi cấp/hạn dùng của chứng chỉ.</span></div>
  <div class="kv"><span class="k"><code>&gt;</code></span><span class="v">Thứ curl đã GỬI. Hữu ích để xác nhận một vhost thật sự nhận được header <code>Host</code> nào.</span></div>
  <div class="kv"><span class="k"><code>&lt;</code></span><span class="v">Thứ máy chủ đã TRẢ LỜI. Dòng trạng thái và mọi header hồi đáp.</span></div>
</div>
<p>Hãy để ý dòng <code>expire date</code> — <code>curl -v</code> là phép kiểm chứng chỉ nhanh nhất từng có, và câu "chứng chỉ hết hạn lúc nửa đêm" giải thích một phần lớn những trang vỡ qua đêm mà chẳng có lần deploy nào. <code>-v</code> ghi ra stderr, và đó là lý do cần <code>2&gt;&amp;1</code> mới đưa qua ống được.</p>
<pre><code>curl -sSf --resolve cuongthai.com:443:203.0.113.99 https://cuongthai.com/   <span class="tok-comment"># kiểm một máy chủ TRƯỚC khi DNS trỏ vào nó</span>
curl -sSfI -H 'Host: cuongthai.com' http://203.0.113.42/                    <span class="tok-comment"># kiểm một vhost bằng IP</span>
curl -sSf --http1.1 "\$url"                                                  <span class="tok-comment"># ép dùng HTTP/1.1</span>
curl -sSf --max-time 10 --connect-timeout 3 "\$url"                          <span class="tok-comment"># luôn có trong script</span></code></pre>
<div class="callout ok"><code>--resolve</code> là cái cờ dành cho việc kiểm một lần chuyển máy. Nó gửi yêu cầu tới một IP do bạn nêu tên trong khi vẫn dùng tên máy thật cho TLS và cho header <code>Host</code> — nên bạn xác minh được rằng máy chủ mới phục vụ trang đúng đắn <em>TRƯỚC KHI</em> đổi DNS, thay vì đổi xong rồi mới biết. Nó hơn việc sửa <code>/etc/hosts</code>, vì nó chỉ ảnh hưởng một lệnh chứ không ảnh hưởng cả cái máy của bạn.</div>

<h3>Thời gian chờ thuộc về mọi script</h3>
<pre><code>curl -sSfL --connect-timeout 5 --max-time 30 --retry 3 --retry-delay 2 "\$url"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--connect-timeout</code></span><span class="v">Bỏ cuộc nếu kết nối TCP không thiết lập được trong N giây. Không có nó, một máy đã chết có thể treo bạn hơn hai phút.</span></div>
  <div class="kv"><span class="k"><code>--max-time</code></span><span class="v">Trần cho cả yêu cầu. Đây là cái ngăn một công việc cron chạy dài tới tận lúc bản kế tiếp khởi động.</span></div>
  <div class="kv"><span class="k"><code>--retry N</code></span><span class="v">Thử lại với lỗi thoáng qua và với 5xx. Ghép cùng <code>--retry-delay</code> hoặc <code>--retry-all-errors</code>.</span></div>
</div>
<div class="callout warn">Một lệnh <code>curl</code> không có thời gian chờ nằm bên trong một công việc cron là nguyên nhân kinh điển của một cái máy đầy dần lên bằng tiến trình: điểm cuối thôi trả lời, mỗi lần gọi treo vô hạn, và cứ năm phút lại có thêm một cái nữa khởi động. Ghép <code>--max-time</code> với cái chốt <code>flock</code> ở Bài 7.3 thì không kiểu hỏng nào trong hai kiểu đó xảy ra được.</div>

<h3>Phân biệt lỗi mạng với lỗi ứng dụng</h3>
<pre><code>curl -sSf "\$url"; echo "exit=\$?"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">6</span><span class="v">Không phân giải được tên máy — DNS, không phải ứng dụng (Bài 9.1).</span></div>
  <div class="kv"><span class="k">7</span><span class="v">Không kết nối được — không có gì lắng nghe, hoặc có tường lửa.</span></div>
  <div class="kv"><span class="k">22</span><span class="v">HTTP 4xx/5xx khi có <code>-f</code>. Kết nối thì chạy được; ứng dụng nói không.</span></div>
  <div class="kv"><span class="k">28</span><span class="v">Hết giờ chờ. Nó kết nối được rồi đứng im — thường là do máy chủ, đôi khi do mạng.</span></div>
  <div class="kv"><span class="k">35 · 60</span><span class="v">Bắt tay TLS hỏng · không xác minh được chứng chỉ. Hãy xem <code>curl -v</code> để biết hạn dùng và nơi cấp.</span></div>
</div>
<pre><code><span class="tok-comment"># Trong script: rẽ nhánh theo LOẠI thất bại, không chỉ theo "nó hỏng"</span>
if ! body=\$(curl -sSf --max-time 10 "\$url"); then
  case \$? in
    6)  die "DNS hỏng với \$url" ;;
    7)  die "kết nối bị từ chối — dịch vụ có đang chạy không?" ;;
    22) die "máy chủ trả về một lỗi HTTP" ;;
    28) die "hết giờ chờ sau 10 giây" ;;
    *)  die "curl hỏng với mã \$?" ;;
  esac
fi</code></pre>
<div class="callout ok">Năm mã thoát đó ánh xạ chính xác vào bốn tầng ở Bài 9.1, nghĩa là một script kiểm sức khoẻ báo cáo được <em>TẦNG NÀO</em> vỡ thay vì chỉ nói "phép kiểm thất bại". Chính chỗ phân biệt đó làm một cảnh báo lúc 3 giờ sáng trở nên hành động được.</div>

<h3>Một phép kiểm sức khoẻ thật</h3>
<pre><code>check() {
  local url=\$1 expect=\${2:-200} code
  code=\$(curl -s -o /dev/null -w '%{http_code}' \\
         --connect-timeout 3 --max-time 10 "\$url" || echo 000)
  if [[ \$code == "\$expect" ]]; then
    printf '  OK   %-45s %s\\n' "\$url" "\$code"
  else
    printf '  HỎNG %-45s %s (chờ đợi %s)\\n' "\$url" "\$code" "\$expect" &gt;&amp;2
    return 1
  fi
}

rc=0
check https://cuongthai.com                       || rc=1
check https://cuongthai.com/api/v1/posts     401  || rc=1
check https://cuongthai.com/api/v1/gifs      401  || rc=1
exit \$rc</code></pre>
<div class="out">  OK   https://cuongthai.com                         200
  OK   https://cuongthai.com/api/v1/posts            401
  HỎNG https://cuongthai.com/api/v1/gifs             404 (chờ đợi 401)</div>
<p>Ở đây một mã 401 là ĐẠT: nó chứng minh tuyến đã được gắn vào và đang đòi xác thực. Một mã 404 nghĩa là tuyến hoàn toàn chưa được gắn — một bản dựng cũ hoặc dựng dở, đúng cái kiểu hỏng mà chính dự án này gặp ngày 02/07/2026 khi một lần deploy <code>--no-build</code> đem lên một ảnh cũ. Kiểm theo tiêu chí "không phải 404" thay vì "phải là 200" chính là thứ làm phép thử có ý nghĩa với những điểm cuối cần xác thực.</p>

<h3>Những cờ curl đáng học thuộc</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">-i và -v</span><span class="lz-t">Xem phản hồi, rồi xem cả cuộc trao đổi</span><span class="lz-d"><code>-i</code> in ra trạng thái và header cùng với thân; <code>-v</code> hiện cả phần request. Câu trả lời cho &quot;vì sao cái này hỏng&quot; gần như luôn nằm ở một trong hai.</span></div>
  <div class="lz-node"><span class="lz-k">-f</span><span class="lz-t">Hỏng khi gặp lỗi HTTP</span><span class="lz-d">Không có nó, curl thoát với mã 0 kể cả khi gặp 500 — nên <code>curl … &amp;&amp; deploy</code> vẫn chạy tiếp sau khi phép kiểm đã hỏng. Thiết yếu trong mọi script.</span></div>
  <div class="lz-node"><span class="lz-k">-L và --max-time</span><span class="lz-t">Đi theo chuyển hướng, và biết bỏ cuộc</span><span class="lz-d"><code>-L</code> vì một endpoint đã dời chỗ sẽ trả 301 với thân rỗng; <code>--max-time</code> vì một request treo trong script sẽ chặn mãi mãi.</span></div>
  <div class="lz-node"><span class="lz-k">-w '%{http_code}'</span><span class="lz-t">Rút ra đúng một con số</span><span class="lz-d"><code>-s -o /dev/null -w "%{http_code}"</code> chỉ in ra mã trạng thái — đúng hình dạng dùng cho mọi phép kiểm sức khoẻ route trong kho này.</span></div>
</div>
<a class="link-card" href="https://everything.curl.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Everything curl</span><span class="lc-sub">Cả một cuốn sách miễn phí do chính tác giả curl viết. Các chương "Using curl" nói về HTTP, TLS và gỡ lỗi hay hơn hẳn trang man.</span></span>
</a>
<a class="link-card" href="https://curl.se/docs/manpage.html#-w" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">curl --write-out — mọi biến</span><span class="lc-sub">Danh sách đầy đủ: các mốc thời gian, kích thước, số lần chuyển hướng, chi tiết TLS, và <code>%{json}</code> để xuất tất cả thành một đối tượng.</span></span>
</a>
<a class="link-card" href="https://curl.se/libcurl/c/libcurl-errors.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Mã thoát của curl</span><span class="lc-sub">Tất cả, kèm ý nghĩa. Đáng đánh dấu lại: một mã thoát biến "yêu cầu thất bại" thành một nguyên nhân cụ thể và tra được.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: viết một phép kiểm sức khoẻ</span><span class="lc-sub">Bài chấm điểm: dùng <code>-w</code> để lấy mã trạng thái, rẽ nhánh theo mã thoát của curl, đặt thời gian chờ hợp lý, và kiểm một vhost bằng <code>--resolve</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>curl -k</code> (hay <code>--insecure</code>) để "chữa" một lỗi chứng chỉ. Nó tắt hẳn việc xác minh, nên kết nối vẫn được mã hoá nhưng bạn KHÔNG BIẾT mình đang nói chuyện với ai — mà đó mới là phần có ý nghĩa. Thông báo lỗi đang nói với bạn một điều có thật: chứng chỉ hết hạn, thiếu chứng chỉ trung gian, sai tên máy, hoặc một proxy đang chặn giữa TLS. <code>curl -v</code> gọi tên xem là cái nào trong ba dòng. Chỉ với tay lấy <code>-k</code> khi đối tượng là một chứng chỉ tự ký do chính bạn tạo ra, và đừng bao giờ để nó nằm lại trong một script có đụng tới production, vì nó sẽ vẫn nằm đó rất lâu sau khi vấn đề gốc đã bị quên.</div>
<p class="note-ct"><strong>Hãy xây phản xạ cho <code>curl -sSfL</code>.</strong> Im lặng nhưng vẫn báo lỗi; hỏng khi gặp lỗi HTTP thay vì lưu chúng lại làm dữ liệu; đi theo chuyển hướng. Thêm <code>--max-time</code> vào mọi thứ chạy tự động, và <code>-o /dev/null -w '%{http_code}'</code> mỗi khi bạn muốn CÂU TRẢ LỜI chứ không muốn cái trang. Bốn thói quen đó biến curl từ một thứ thường thì chạy được thành một thứ mà script tin được.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — SSH: keys, config and tunnels|||9.3 — SSH: khoá, file cấu hình và đường hầm',
      slug: 'lnx-9-3-ssh',
      type: 'LESSON',
      description: 'Khoá ed25519 và authorized_keys, ~/.ssh/config biến mọi lệnh sau đó thành ngắn gọn, ssh-agent và chuyển tiếp agent (cùng rủi ro của nó), chuyển tiếp cổng cả hai chiều, và gia cố sshd.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>SSH</h2>
<p class="lead">SSH is how you reach every server you will ever run, and most people use perhaps a fifth of it. The parts worth learning are the ones that remove repetition: a config file that turns a long command into one word, an agent so you type a passphrase once a day, and port forwarding — which quietly solves problems people otherwise open firewall ports for.</p>

<h3>Keys, not passwords</h3>
<pre><code>ssh-keygen -t ed25519 -C "deploy@laptop"          <span class="tok-comment"># the modern default</span>
ssh-keygen -t ed25519 -f ~/.ssh/id_vps -C "vps"   <span class="tok-comment"># a key per purpose</span>

ls -l ~/.ssh/</code></pre>
<div class="out">-rw------- 1 you you  411 Aug 22 16:02 id_ed25519       ← private: 600, never leaves this machine
-rw-r--r-- 1 you you   98 Aug 22 16:02 id_ed25519.pub   ← public: safe to share
-rw------- 1 you you  512 Aug 22 16:05 config
-rw-r--r-- 1 you you 1204 Aug 22 16:05 known_hosts</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ed25519</code></span><span class="v">Fast, short, and secure. Use it unless you must talk to something ancient — then <code>-t rsa -b 4096</code>.</span></div>
  <div class="kv"><span class="k">Passphrase</span><span class="v">Say yes. A stolen laptop otherwise means stolen servers. The agent below means you type it once per session, not once per connection.</span></div>
  <div class="kv"><span class="k">One key per purpose</span><span class="v">A key for your VPS, another for GitHub, another for work. Revoking one then does not lock you out of everything else.</span></div>
</div>
<pre><code>ssh-copy-id -i ~/.ssh/id_vps.pub deploy@vps       <span class="tok-comment"># installs it correctly</span>

<span class="tok-comment"># What it does, by hand — note the permissions (Chapter 4)</span>
cat ~/.ssh/id_vps.pub | ssh deploy@vps \\
  'mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh &amp;&amp; cat &gt;&gt; ~/.ssh/authorized_keys &amp;&amp; chmod 600 ~/.ssh/authorized_keys'</code></pre>
<div class="callout warn">SSH refuses a private key that others can read, and refuses <em>loudly</em> rather than falling back to a password — <code>UNPROTECTED PRIVATE KEY FILE</code>, and it ignores the key entirely. The required modes from Lesson 4.2: <code>700</code> on <code>~/.ssh</code>, <code>600</code> on private keys and on <code>authorized_keys</code>, <code>644</code> on <code>.pub</code> files. Note it also checks your <em>home directory</em>: if <code>~</code> is group-writable, sshd on the server may reject the key with nothing but "Permission denied (publickey)" in your terminal. The server's <code>/var/log/auth.log</code> says which check failed.</div>

<h3>~/.ssh/config — the highest-value file in this lesson</h3>
<pre><code><span class="tok-comment"># ~/.ssh/config</span>
Host vps
    HostName 203.0.113.42
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_vps
    IdentitiesOnly yes

Host github.com
    User git
    IdentityFile ~/.ssh/id_github
    IdentitiesOnly yes

Host db
    HostName 10.0.1.15
    User admin
    ProxyJump vps                <span class="tok-comment"># reach a private host THROUGH the VPS</span>

Host *
    ServerAliveInterval 60       <span class="tok-comment"># keep idle sessions from dropping</span>
    ServerAliveCountMax 3
    AddKeysToAgent yes
    ControlMaster auto           <span class="tok-comment"># reuse one connection for all sessions</span>
    ControlPath ~/.ssh/cm-%r@%h:%p
    ControlPersist 10m</code></pre>
<pre><code>ssh -p 2222 -i ~/.ssh/id_vps deploy@203.0.113.42     <span class="tok-comment"># before</span>
ssh vps                                              <span class="tok-comment"># after</span>
scp file.txt vps:/srv/app/                           <span class="tok-comment"># scp, rsync and git use it too</span></code></pre>
<div class="callout ok">Three settings earn their place immediately. <strong><code>ProxyJump</code></strong> reaches a machine with no public address through one that has one — a single hop, no manual tunnel, and <code>scp</code> and <code>rsync</code> understand it as well. <strong><code>ControlMaster</code></strong> reuses one TCP connection for every subsequent session to the same host, so the second <code>ssh vps</code> is instant and a script making twenty calls pays the handshake once. <strong><code>IdentitiesOnly yes</code></strong> stops SSH offering every key in your agent to every server; without it a host with several keys can hit <code>Too many authentication failures</code> before reaching the right one.</div>
<pre><code>ssh -O check vps        <span class="tok-comment"># is a shared connection alive?</span>
ssh -O exit vps         <span class="tok-comment"># close it (needed after changing config)</span>
ssh -G vps | head -20   <span class="tok-comment"># the FULLY resolved settings for this host</span></code></pre>
<p><code>ssh -G</code> is the debugging command: it prints exactly which options apply after all the <code>Host</code> blocks have been merged, which settles any question about why a connection used the wrong key or the wrong port.</p>

<h3>The agent</h3>
<pre><code>eval "\$(ssh-agent -s)"          <span class="tok-comment"># usually already running on a desktop</span>
ssh-add ~/.ssh/id_vps           <span class="tok-comment"># type the passphrase once</span>
ssh-add -l                      <span class="tok-comment"># what is loaded</span>
ssh-add -t 8h ~/.ssh/id_vps     <span class="tok-comment"># forget it after 8 hours</span>
ssh-add -D                      <span class="tok-comment"># forget everything now</span></code></pre>
<p>The agent holds the decrypted key in memory and answers challenges on your behalf. With <code>AddKeysToAgent yes</code> in your config, the first connection of the day prompts and every later one is silent.</p>
<div class="callout warn"><strong>Agent forwarding (<code>-A</code>) is convenient and genuinely risky.</strong> It lets a process on the remote host use your local keys — which means <em>root on that host, or anyone who compromises it</em>, can authenticate as you to every server your agent holds a key for, for as long as you are connected. It leaves no trace on your machine. Prefer <code>ProxyJump</code>, which tunnels through the intermediate host without exposing your agent to it. If you must forward, forward to hosts you administer, and never with <code>ForwardAgent yes</code> under <code>Host *</code>.</div>

<h3>Port forwarding</h3>
<pre><code><span class="tok-comment"># LOCAL: bring a remote port to your machine</span>
ssh -L 5432:localhost:5432 vps</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">You connect to</span><span class="lz-t">localhost:5432 on your laptop</span><span class="lz-d">A normal client — psql, TablePlus, your app — connects to your own machine.</span></div>
  <div class="lz-step"><span class="lz-k">SSH carries it</span><span class="lz-t">encrypted, over the existing session</span><span class="lz-d">No extra port opened on the internet, no VPN, nothing to configure on the server.</span></div>
  <div class="lz-step"><span class="lz-k">The VPS connects to</span><span class="lz-t">localhost:5432 — from ITS point of view</span><span class="lz-d">Which is the database bound to 127.0.0.1 and deliberately unreachable from outside (Lesson 9.1).</span></div>
  <div class="lz-step"><span class="lz-k">Result</span><span class="lz-t">a private database, reachable only by people with SSH access</span><span class="lz-d">Strictly better than exposing 5432 to the internet with a password on it.</span></div>
</div>
<pre><code>ssh -L 5432:localhost:5432 vps           <span class="tok-comment"># database</span>
ssh -L 8080:localhost:3000 vps           <span class="tok-comment"># an app not exposed publicly</span>
ssh -L 9000:10.0.1.15:5432 vps           <span class="tok-comment"># a THIRD host, reached via the VPS</span>
ssh -fNL 5432:localhost:5432 vps         <span class="tok-comment"># -f background, -N no shell: just the tunnel</span>

<span class="tok-comment"># REMOTE: expose YOUR local port on the server</span>
ssh -R 8000:localhost:3000 vps           <span class="tok-comment"># let the server reach your dev machine</span>

<span class="tok-comment"># DYNAMIC: a SOCKS proxy through the server</span>
ssh -D 1080 vps                          <span class="tok-comment"># point a browser at localhost:1080</span></code></pre>
<div class="callout ok"><code>ssh -L</code> is the correct answer to "how do I connect to production Postgres from my laptop". Keep the database bound to <code>127.0.0.1</code>, open no firewall port, and let SSH — already authenticated, already encrypted, already audited — carry the connection. Anyone who loses SSH access loses database access at the same moment, which is exactly the property you want.</div>

<h3>Running commands and scripts remotely</h3>
<pre><code>ssh vps 'uptime'
ssh vps 'df -h /'
ssh vps 'systemctl status myapp' &lt; /dev/null      <span class="tok-comment"># do not let it eat stdin</span>

<span class="tok-comment"># A whole script, without copying it first</span>
ssh vps 'bash -s' &lt;&lt;'EOF'
set -euo pipefail
cd /srv/app
docker compose pull
docker compose up -d
EOF

<span class="tok-comment"># Run it detached so a dropped connection cannot kill it (Lesson 5.4)</span>
ssh vps 'tmux new -d -s deploy /srv/app/deploy.sh'</code></pre>
<div class="callout warn">Two traps in one place. <code>ssh vps 'cmd'</code> is a <strong>non-interactive, non-login</strong> shell, so it reads no startup files and your <code>PATH</code> may be missing everything a version manager added (Lesson 8.2) — use absolute paths or <code>bash -lc</code>. And <code>ssh vps 'long-job &amp;'</code> does <em>not</em> survive: the SSH session ends, SIGHUP goes out, and the job dies partway through while the command reports success. <code>tmux new -d</code> or <code>nohup</code> is required, and <code>tmux</code> lets you attach later to see what happened.</div>
<pre><code><span class="tok-comment"># The quoting question: which machine expands the variable?</span>
ssh vps "echo \$HOSTNAME"      <span class="tok-comment"># double quotes → YOUR hostname, expanded locally</span>
ssh vps 'echo \$HOSTNAME'      <span class="tok-comment"># single quotes → the SERVER's hostname</span></code></pre>
<div class="out">laptop
vps</div>
<p>This is Lesson 6.2 with a second machine attached, and it is worth pausing on: with double quotes the local shell substitutes before SSH sends anything. Both forms are useful — you often <em>want</em> to interpolate a local variable into a remote command — but confusing them produces commands that run against the wrong values with no error.</p>

<h3>Hardening sshd</h3>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/99-hardening.conf</span>
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
<pre><code>sudo sshd -t                          <span class="tok-comment"># TEST the config — always, first</span>
sudo systemctl reload ssh             <span class="tok-comment"># reload, do not restart</span></code></pre>
<div class="callout warn"><strong>Keep your current session open while you do this, and test with a second terminal.</strong> A config error plus a restart is how people lock themselves out of a machine with no console access. <code>sshd -t</code> validates the file, <code>reload</code> leaves existing connections alive, and the new terminal proves you can still get in. Only then close the first one. This is the same discipline as <code>visudo</code> in Lesson 4.4, for the same reason.</div>
<pre><code><span class="tok-comment"># Modern Ubuntu: drop-in files, do not edit the main config</span>
ls /etc/ssh/sshd_config.d/

<span class="tok-comment"># What is actually in effect after all includes</span>
sudo sshd -T | grep -Ei 'permitrootlogin|passwordauth|allowusers|port'</code></pre>
<div class="out">port 2222
permitrootlogin no
passwordauthentication no
allowusers deploy</div>
<p><code>sshd -T</code> is the server-side counterpart of <code>ssh -G</code>: it prints the fully resolved configuration, so you never have to reason about which of several files won. Use it to confirm a change took effect, rather than assuming the file you edited is the one being read.</p>

<h3>When it will not connect</h3>
<pre><code>ssh -v vps                     <span class="tok-comment"># -v, -vv, -vvv: increasing detail</span>
ssh -v vps 2&gt;&amp;1 | grep -E 'Offering|Authentications|Permission'
sudo tail -f /var/log/auth.log <span class="tok-comment"># on the SERVER — says WHY it refused</span></code></pre>
<div class="out">debug1: Offering public key: /home/you/.ssh/id_vps ED25519
debug1: Authentications that can continue: publickey
Permission denied (publickey).</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Connection refused</span><span class="v">Nothing listening on that port. <code>sudo ss -tulpn | grep :22</code> on the server, or the wrong port in your config.</span></div>
  <div class="kv"><span class="k">Connection timed out</span><span class="v">A firewall or security group is dropping the packet. <code>tcpdump</code> on the server shows whether it arrives at all (Lesson 9.1).</span></div>
  <div class="kv"><span class="k">Permission denied (publickey)</span><span class="v">The key was offered and rejected: wrong key, missing from <code>authorized_keys</code>, or bad permissions on <code>~</code>, <code>~/.ssh</code> or the file. The server's <code>auth.log</code> names which.</span></div>
  <div class="kv"><span class="k">REMOTE HOST IDENTIFICATION HAS CHANGED</span><span class="v">The server's host key differs from <code>known_hosts</code>. Usually a rebuilt machine or a reused IP — but it is also exactly what an interception looks like, so verify the fingerprint before running <code>ssh-keygen -R host</code>.</span></div>
</div>

<a class="link-card" href="https://man.openbsd.org/ssh_config" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">ssh_config(5) — every client option</span><span class="lc-sub">The authoritative list, including <code>Match</code> blocks, <code>ProxyJump</code> and the ControlMaster options. Worth skimming once to see what is available.</span></span>
</a>
<a class="link-card" href="https://www.ssh.com/academy/ssh/tunneling-example" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">SSH tunnelling, with diagrams</span><span class="lc-sub">Local, remote and dynamic forwarding drawn out. The pictures make <code>-L</code> versus <code>-R</code> stick better than any description.</span></span>
</a>
<a class="link-card" href="https://www.sshaudit.com/hardening_guides.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">SSH hardening guides</span><span class="lc-sub">Per-distribution configuration with the reasoning for each setting, and an auditing tool to check what you ended up with.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: set up SSH properly</span><span class="lc-sub">Graded tasks: generate a key, write a config with <code>ProxyJump</code>, forward a database port, and diagnose a "Permission denied (publickey)" caused by permissions.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> disabling <code>PasswordAuthentication</code> before confirming your key works. The sequence that locks people out is: edit the config, restart sshd, close the terminal, discover the key was never installed correctly — and now there is no password fallback and no console. Always in this order: install the key, open a <em>second</em> terminal and log in with it, and only then disable passwords in the first one. Keep the first session open until the second has proven itself. Cloud providers offer a web console for exactly this failure, but a self-hosted machine may not.</div>
<p class="note-ct"><strong>The one file to write today is <code>~/.ssh/config</code>.</strong> Ten lines per host turns every subsequent <code>ssh</code>, <code>scp</code>, <code>rsync</code> and <code>git</code> command into one short word, and the <code>Host *</code> block gives you connection reuse and keepalives everywhere at once. After that, <code>ssh -L</code> is the single technique most worth knowing: it removes the reason people open database ports to the internet.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>SSH</h2>
<p class="lead">SSH là cách bạn với tới mọi máy chủ bạn sẽ từng vận hành, và phần lớn mọi người dùng chừng một phần năm của nó. Những phần đáng học là những phần gỡ bỏ sự lặp lại: một file cấu hình biến một lệnh dài thành một chữ, một cái agent để bạn gõ mật khẩu khoá mỗi ngày một lần, và chuyển tiếp cổng — thứ lặng lẽ giải quyết những vấn đề mà nếu không người ta sẽ đi mở cổng tường lửa.</p>

<h3>Khoá, không phải mật khẩu</h3>
<pre><code>ssh-keygen -t ed25519 -C "deploy@laptop"          <span class="tok-comment"># mặc định đời mới</span>
ssh-keygen -t ed25519 -f ~/.ssh/id_vps -C "vps"   <span class="tok-comment"># mỗi mục đích một khoá</span>

ls -l ~/.ssh/</code></pre>
<div class="out">-rw------- 1 you you  411 Aug 22 16:02 id_ed25519       ← riêng: 600, không bao giờ rời máy này
-rw-r--r-- 1 you you   98 Aug 22 16:02 id_ed25519.pub   ← công khai: chia sẻ thoải mái
-rw------- 1 you you  512 Aug 22 16:05 config
-rw-r--r-- 1 you you 1204 Aug 22 16:05 known_hosts</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ed25519</code></span><span class="v">Nhanh, ngắn, và an toàn. Hãy dùng nó trừ khi bạn buộc phải nói chuyện với một thứ cổ lỗ — khi đó thì <code>-t rsa -b 4096</code>.</span></div>
  <div class="kv"><span class="k">Mật khẩu khoá</span><span class="v">Hãy đặt. Nếu không thì một cái laptop bị lấy mất đồng nghĩa với những máy chủ bị lấy mất. Cái agent bên dưới nghĩa là bạn gõ nó mỗi phiên một lần, không phải mỗi kết nối một lần.</span></div>
  <div class="kv"><span class="k">Mỗi mục đích một khoá</span><span class="v">Một khoá cho VPS, một cho GitHub, một cho công việc. Thu hồi một cái thì không khoá bạn ra khỏi mọi thứ còn lại.</span></div>
</div>
<pre><code>ssh-copy-id -i ~/.ssh/id_vps.pub deploy@vps       <span class="tok-comment"># cài đặt cho đúng cách</span>

<span class="tok-comment"># Nó làm gì, nếu làm tay — để ý các quyền (Chương 4)</span>
cat ~/.ssh/id_vps.pub | ssh deploy@vps \\
  'mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh &amp;&amp; cat &gt;&gt; ~/.ssh/authorized_keys &amp;&amp; chmod 600 ~/.ssh/authorized_keys'</code></pre>
<div class="callout warn">SSH từ chối một khoá riêng mà người khác đọc được, và nó từ chối một cách <em>ỒN ÀO</em> chứ không lặng lẽ lùi về dùng mật khẩu — <code>UNPROTECTED PRIVATE KEY FILE</code>, và nó bỏ qua cái khoá hoàn toàn. Các chế độ bắt buộc theo Bài 4.2: <code>700</code> cho <code>~/.ssh</code>, <code>600</code> cho khoá riêng và cho <code>authorized_keys</code>, <code>644</code> cho các file <code>.pub</code>. Lưu ý nó còn kiểm cả <em>THƯ MỤC NHÀ</em> của bạn: nếu <code>~</code> cho nhóm ghi được, sshd trên máy chủ có thể từ chối cái khoá mà terminal của bạn chỉ hiện lên mỗi dòng "Permission denied (publickey)". File <code>/var/log/auth.log</code> trên máy chủ mới nói cho bạn biết phép kiểm nào đã trượt.</div>

<h3>~/.ssh/config — file giá trị nhất trong bài này</h3>
<pre><code><span class="tok-comment"># ~/.ssh/config</span>
Host vps
    HostName 203.0.113.42
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_vps
    IdentitiesOnly yes

Host github.com
    User git
    IdentityFile ~/.ssh/id_github
    IdentitiesOnly yes

Host db
    HostName 10.0.1.15
    User admin
    ProxyJump vps                <span class="tok-comment"># với tới một máy riêng THÔNG QUA cái VPS</span>

Host *
    ServerAliveInterval 60       <span class="tok-comment"># giữ cho phiên nhàn rỗi khỏi bị rớt</span>
    ServerAliveCountMax 3
    AddKeysToAgent yes
    ControlMaster auto           <span class="tok-comment"># dùng lại một kết nối cho mọi phiên</span>
    ControlPath ~/.ssh/cm-%r@%h:%p
    ControlPersist 10m</code></pre>
<pre><code>ssh -p 2222 -i ~/.ssh/id_vps deploy@203.0.113.42     <span class="tok-comment"># trước</span>
ssh vps                                              <span class="tok-comment"># sau</span>
scp file.txt vps:/srv/app/                           <span class="tok-comment"># scp, rsync và git cũng dùng nó</span></code></pre>
<div class="callout ok">Ba thiết lập xứng đáng có mặt ngay lập tức. <strong><code>ProxyJump</code></strong> với tới một máy không có địa chỉ công khai thông qua một máy có — một chặng duy nhất, không phải dựng đường hầm bằng tay, và <code>scp</code> cùng <code>rsync</code> cũng hiểu nó. <strong><code>ControlMaster</code></strong> dùng lại một kết nối TCP cho mọi phiên tiếp theo tới cùng một máy, nên lệnh <code>ssh vps</code> thứ hai là tức thì và một script gọi hai mươi lần chỉ trả giá bắt tay đúng một lần. <strong><code>IdentitiesOnly yes</code></strong> ngăn SSH chào mọi khoá trong agent của bạn với mọi máy chủ; không có nó, một máy có nhiều khoá có thể dính <code>Too many authentication failures</code> trước khi tới được cái khoá đúng.</div>
<pre><code>ssh -O check vps        <span class="tok-comment"># kết nối dùng chung còn sống không?</span>
ssh -O exit vps         <span class="tok-comment"># đóng nó (cần làm sau khi đổi cấu hình)</span>
ssh -G vps | head -20   <span class="tok-comment"># các thiết lập ĐÃ GIẢI HẾT cho máy này</span></code></pre>
<p><code>ssh -G</code> là lệnh dùng để gỡ lỗi: nó in ra chính xác những tuỳ chọn nào có hiệu lực sau khi mọi khối <code>Host</code> đã được trộn lại, và điều đó kết thúc mọi tranh cãi về việc vì sao một kết nối lại dùng nhầm khoá hay nhầm cổng.</p>

<h3>Cái agent</h3>
<pre><code>eval "\$(ssh-agent -s)"          <span class="tok-comment"># trên máy để bàn thường đã chạy sẵn</span>
ssh-add ~/.ssh/id_vps           <span class="tok-comment"># gõ mật khẩu khoá một lần</span>
ssh-add -l                      <span class="tok-comment"># đang nạp những gì</span>
ssh-add -t 8h ~/.ssh/id_vps     <span class="tok-comment"># quên nó sau 8 tiếng</span>
ssh-add -D                      <span class="tok-comment"># quên mọi thứ ngay bây giờ</span></code></pre>
<p>Agent giữ cái khoá đã giải mã trong bộ nhớ và trả lời các thách đố thay mặt bạn. Với <code>AddKeysToAgent yes</code> trong file cấu hình, kết nối đầu tiên trong ngày hỏi mật khẩu và mọi kết nối sau đó đều im lặng.</p>
<div class="callout warn"><strong>Chuyển tiếp agent (<code>-A</code>) vừa tiện vừa thật sự nguy hiểm.</strong> Nó cho một tiến trình trên máy ở đầu xa dùng được khoá cục bộ của bạn — nghĩa là <em>root trên máy đó, hoặc bất kỳ ai chiếm được nó</em>, đều xác thực được với danh nghĩa bạn tới MỌI máy chủ mà agent của bạn đang giữ khoá, suốt thời gian bạn còn kết nối. Nó không để lại dấu vết nào trên máy bạn. Hãy ưu tiên <code>ProxyJump</code>, thứ đi xuyên qua máy trung gian mà không phơi agent của bạn ra cho nó. Nếu buộc phải chuyển tiếp, hãy chỉ chuyển tiếp tới những máy do chính bạn quản trị, và đừng bao giờ đặt <code>ForwardAgent yes</code> dưới <code>Host *</code>.</div>

<h3>Chuyển tiếp cổng</h3>
<pre><code><span class="tok-comment"># CỤC BỘ: kéo một cổng ở đầu xa về máy bạn</span>
ssh -L 5432:localhost:5432 vps</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bạn kết nối tới</span><span class="lz-t">localhost:5432 trên laptop của bạn</span><span class="lz-d">Một trình khách bình thường — psql, TablePlus, ứng dụng của bạn — kết nối tới chính máy của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">SSH chở nó đi</span><span class="lz-t">đã mã hoá, qua chính phiên đang có</span><span class="lz-d">Không mở thêm cổng nào ra internet, không cần VPN, không phải cấu hình gì trên máy chủ.</span></div>
  <div class="lz-step"><span class="lz-k">VPS kết nối tới</span><span class="lz-t">localhost:5432 — theo góc nhìn CỦA NÓ</span><span class="lz-d">Chính là cơ sở dữ liệu đang gắn vào 127.0.0.1 và cố ý không với tới được từ bên ngoài (Bài 9.1).</span></div>
  <div class="lz-step"><span class="lz-k">Kết quả</span><span class="lz-t">một cơ sở dữ liệu riêng tư, chỉ người có quyền SSH mới với tới</span><span class="lz-d">Tốt hơn hẳn việc phơi cổng 5432 ra internet rồi đặt một cái mật khẩu lên nó.</span></div>
</div>
<pre><code>ssh -L 5432:localhost:5432 vps           <span class="tok-comment"># cơ sở dữ liệu</span>
ssh -L 8080:localhost:3000 vps           <span class="tok-comment"># một ứng dụng không công khai</span>
ssh -L 9000:10.0.1.15:5432 vps           <span class="tok-comment"># một máy THỨ BA, với tới qua VPS</span>
ssh -fNL 5432:localhost:5432 vps         <span class="tok-comment"># -f chạy nền, -N không mở shell: chỉ đường hầm</span>

<span class="tok-comment"># NGƯỢC: phơi một cổng CỦA BẠN ra trên máy chủ</span>
ssh -R 8000:localhost:3000 vps           <span class="tok-comment"># cho máy chủ với tới máy dev của bạn</span>

<span class="tok-comment"># ĐỘNG: một proxy SOCKS đi xuyên máy chủ</span>
ssh -D 1080 vps                          <span class="tok-comment"># chĩa trình duyệt vào localhost:1080</span></code></pre>
<div class="callout ok"><code>ssh -L</code> là câu trả lời đúng cho "làm sao kết nối tới Postgres production từ laptop của tôi". Hãy giữ cơ sở dữ liệu gắn vào <code>127.0.0.1</code>, không mở cổng tường lửa nào, và để SSH — vốn đã xác thực, đã mã hoá, đã ghi nhật ký — chở cái kết nối đó. Ai mất quyền SSH thì mất quyền vào cơ sở dữ liệu ngay cùng khoảnh khắc, và đó chính xác là tính chất bạn muốn.</div>

<h3>Chạy lệnh và script ở đầu xa</h3>
<pre><code>ssh vps 'uptime'
ssh vps 'df -h /'
ssh vps 'systemctl status myapp' &lt; /dev/null      <span class="tok-comment"># đừng để nó nuốt mất stdin</span>

<span class="tok-comment"># Cả một script, mà không cần chép nó lên trước</span>
ssh vps 'bash -s' &lt;&lt;'EOF'
set -euo pipefail
cd /srv/app
docker compose pull
docker compose up -d
EOF

<span class="tok-comment"># Chạy tách rời để một lần rớt kết nối không giết được nó (Bài 5.4)</span>
ssh vps 'tmux new -d -s deploy /srv/app/deploy.sh'</code></pre>
<div class="callout warn">Hai cái bẫy cùng một chỗ. <code>ssh vps 'lệnh'</code> là một shell <strong>KHÔNG tương tác, không đăng nhập</strong>, nên nó không đọc file khởi động nào và <code>PATH</code> của bạn có thể thiếu mọi thứ mà một trình quản lý phiên bản đã thêm vào (Bài 8.2) — hãy dùng đường dẫn tuyệt đối hoặc <code>bash -lc</code>. Và <code>ssh vps 'việc-dài &amp;'</code> thì <em>KHÔNG</em> sống sót: phiên SSH kết thúc, SIGHUP bay ra, và công việc chết giữa chừng trong khi cái lệnh thì báo cáo thành công. Bắt buộc phải có <code>tmux new -d</code> hoặc <code>nohup</code>, và <code>tmux</code> còn cho bạn gắn vào sau đó để xem chuyện gì đã xảy ra.</div>
<pre><code><span class="tok-comment"># Câu hỏi về dấu nháy: MÁY NÀO khai triển cái biến?</span>
ssh vps "echo \$HOSTNAME"      <span class="tok-comment"># nháy kép → tên máy CỦA BẠN, khai triển tại chỗ</span>
ssh vps 'echo \$HOSTNAME'      <span class="tok-comment"># nháy đơn → tên máy CỦA MÁY CHỦ</span></code></pre>
<div class="out">laptop
vps</div>
<p>Đây là Bài 6.2 với một cái máy thứ hai gắn vào, và đáng dừng lại một nhịp: với nháy kép thì shell cục bộ thay thế TRƯỚC KHI SSH gửi bất cứ thứ gì đi. Cả hai dạng đều có ích — bạn thường <em>MUỐN</em> chèn một biến cục bộ vào một lệnh chạy ở đầu xa — nhưng lẫn lộn chúng thì sinh ra những lệnh chạy với những giá trị sai mà chẳng có lỗi nào.</p>

<h3>Gia cố sshd</h3>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/99-hardening.conf</span>
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
<pre><code>sudo sshd -t                          <span class="tok-comment"># KIỂM cấu hình — luôn luôn, và làm đầu tiên</span>
sudo systemctl reload ssh             <span class="tok-comment"># nạp lại, đừng khởi động lại</span></code></pre>
<div class="callout warn"><strong>Hãy giữ phiên hiện tại của bạn MỞ trong lúc làm việc này, và kiểm bằng một terminal thứ hai.</strong> Một lỗi cấu hình cộng với một lần khởi động lại chính là cách người ta tự khoá mình ra khỏi một cái máy không có console. <code>sshd -t</code> xác thực file, <code>reload</code> để những kết nối đang có sống tiếp, và cái terminal mới chứng minh rằng bạn vẫn vào được. Chỉ tới lúc đó mới đóng cái đầu tiên. Đây là cùng một kỷ luật với <code>visudo</code> ở Bài 4.4, và vì cùng một lý do.</div>
<pre><code><span class="tok-comment"># Ubuntu đời mới: dùng file thả vào, đừng sửa file cấu hình chính</span>
ls /etc/ssh/sshd_config.d/

<span class="tok-comment"># Cái gì THẬT SỰ đang có hiệu lực sau mọi lệnh include</span>
sudo sshd -T | grep -Ei 'permitrootlogin|passwordauth|allowusers|port'</code></pre>
<div class="out">port 2222
permitrootlogin no
passwordauthentication no
allowusers deploy</div>
<p><code>sshd -T</code> là bản đối ứng phía máy chủ của <code>ssh -G</code>: nó in ra cấu hình đã giải hết, nên bạn không bao giờ phải ngồi suy luận xem trong mấy file thì file nào thắng. Hãy dùng nó để xác nhận một thay đổi ĐÃ có hiệu lực, thay vì cho rằng cái file bạn vừa sửa chính là cái đang được đọc.</p>

<h3>Khi không kết nối được</h3>
<pre><code>ssh -v vps                     <span class="tok-comment"># -v, -vv, -vvv: chi tiết tăng dần</span>
ssh -v vps 2&gt;&amp;1 | grep -E 'Offering|Authentications|Permission'
sudo tail -f /var/log/auth.log <span class="tok-comment"># trên MÁY CHỦ — nó nói VÌ SAO nó từ chối</span></code></pre>
<div class="out">debug1: Offering public key: /home/you/.ssh/id_vps ED25519
debug1: Authentications that can continue: publickey
Permission denied (publickey).</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Connection refused</span><span class="v">Không có gì lắng nghe trên cổng đó. Chạy <code>sudo ss -tulpn | grep :22</code> trên máy chủ, hoặc bạn ghi sai cổng trong file cấu hình.</span></div>
  <div class="kv"><span class="k">Connection timed out</span><span class="v">Một tường lửa hoặc nhóm bảo mật đang vứt gói tin đi. <code>tcpdump</code> trên máy chủ cho thấy nó có tới nơi hay không (Bài 9.1).</span></div>
  <div class="kv"><span class="k">Permission denied (publickey)</span><span class="v">Khoá đã được chào và bị từ chối: sai khoá, thiếu trong <code>authorized_keys</code>, hoặc sai quyền trên <code>~</code>, <code>~/.ssh</code> hay chính cái file. File <code>auth.log</code> của máy chủ gọi tên cái nào.</span></div>
  <div class="kv"><span class="k">REMOTE HOST IDENTIFICATION HAS CHANGED</span><span class="v">Khoá máy chủ khác với thứ ghi trong <code>known_hosts</code>. Thường là một máy dựng lại hoặc một IP được tái sử dụng — nhưng đó cũng CHÍNH XÁC là dáng vẻ của một vụ chặn giữa, nên hãy xác minh vân tay trước khi chạy <code>ssh-keygen -R host</code>.</span></div>
</div>

<a class="link-card" href="https://man.openbsd.org/ssh_config" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">ssh_config(5) — mọi tuỳ chọn phía trình khách</span><span class="lc-sub">Danh sách chính thống, gồm cả khối <code>Match</code>, <code>ProxyJump</code> và các tuỳ chọn ControlMaster. Đáng lướt qua một lần để biết mình có sẵn những gì.</span></span>
</a>
<a class="link-card" href="https://www.ssh.com/academy/ssh/tunneling-example" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">Đường hầm SSH, kèm sơ đồ</span><span class="lc-sub">Chuyển tiếp cục bộ, ngược và động được vẽ ra. Mấy cái hình làm cho <code>-L</code> với <code>-R</code> dính vào đầu tốt hơn mọi lời mô tả.</span></span>
</a>
<a class="link-card" href="https://www.sshaudit.com/hardening_guides.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn gia cố SSH</span><span class="lc-sub">Cấu hình theo từng bản phân phối kèm lý lẽ cho từng thiết lập, và một công cụ rà soát để kiểm lại thứ bạn vừa dựng ra.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: dựng SSH cho tử tế</span><span class="lc-sub">Bài chấm điểm: sinh một khoá, viết một file cấu hình có <code>ProxyJump</code>, chuyển tiếp một cổng cơ sở dữ liệu, và chẩn đoán một lỗi "Permission denied (publickey)" gây ra bởi quyền file.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tắt <code>PasswordAuthentication</code> TRƯỚC KHI xác nhận là khoá của bạn chạy được. Trình tự khoá người ta ra ngoài là: sửa cấu hình, khởi động lại sshd, đóng terminal, rồi phát hiện ra cái khoá chưa bao giờ được cài đúng — và giờ thì không còn phương án lùi bằng mật khẩu và cũng không có console. Hãy luôn theo thứ tự này: cài khoá, mở một terminal <em>THỨ HAI</em> rồi đăng nhập bằng nó, và chỉ tới lúc đó mới tắt mật khẩu ở cái đầu tiên. Hãy giữ phiên đầu tiên mở cho tới khi phiên thứ hai đã tự chứng minh được. Các nhà cung cấp đám mây có sẵn console trên web đúng cho kiểu hỏng này, nhưng một cái máy tự dựng thì có thể không.</div>
<p class="note-ct"><strong>File duy nhất cần viết ngay hôm nay là <code>~/.ssh/config</code>.</strong> Mười dòng cho mỗi máy biến mọi lệnh <code>ssh</code>, <code>scp</code>, <code>rsync</code> và <code>git</code> sau đó thành đúng một chữ ngắn, còn khối <code>Host *</code> cho bạn việc dùng lại kết nối và giữ nhịp ở khắp nơi cùng một lúc. Sau đó, <code>ssh -L</code> là kỹ thuật đáng biết nhất: nó gỡ bỏ chính cái lý do khiến người ta đi mở cổng cơ sở dữ liệu ra internet.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Moving files: scp, rsync and the trailing slash|||9.4 — Chuyển file: scp, rsync và dấu gạch chéo cuối',
      slug: 'lnx-9-4-scp-rsync',
      type: 'LESSON',
      description: 'scp cho việc một lần, rsync cho mọi việc còn lại; luật dấu gạch chéo cuối quyết định file rơi vào đâu; --delete và vì sao --dry-run là bắt buộc; loại trừ, băng thông, và một hàm deploy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Moving files</h2>
<p class="lead">Two tools, one rule, and one flag that deletes things. <code>scp</code> copies a file; <code>rsync</code> copies the <em>difference</em> between two trees, which makes a second run almost free. The rule is about a single trailing slash, and it is the most common mistake in this entire chapter.</p>

<h3>scp: fine for one file</h3>
<pre><code>scp file.txt vps:/srv/app/                  <span class="tok-comment"># up</span>
scp vps:/var/log/app.log ./                 <span class="tok-comment"># down</span>
scp -r ./dist vps:/srv/app/                 <span class="tok-comment"># -r for a directory</span>
scp -P 2222 file.txt vps:/srv/             <span class="tok-comment"># capital -P for the port, unlike ssh</span>
scp file.txt vps:'/srv/my app/'             <span class="tok-comment"># remote path with a space: quote it</span>
scp vps1:/tmp/a.txt vps2:/tmp/              <span class="tok-comment"># between two remotes</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-P</code>, not <code>-p</code></span><span class="v"><code>scp</code> uses capital <code>-P</code> for the port; lowercase <code>-p</code> preserves timestamps. <code>ssh</code> uses lowercase <code>-p</code> for the port. Putting the host in <code>~/.ssh/config</code> (Lesson 9.3) removes the problem entirely.</span></div>
  <div class="kv"><span class="k">No resume, no diff</span><span class="v">A failed transfer starts from zero, and a second run re-sends everything. For anything larger than a few megabytes, that is what <code>rsync</code> is for.</span></div>
</div>
<div class="callout warn"><code>scp</code> is <strong>deprecated as a protocol</strong>. OpenSSH 9 switched it to use SFTP underneath, and the OpenSSH developers describe the original protocol as outdated and hard to secure. It still works and is fine for a quick one-off, but for anything scripted or repeated, <code>rsync</code> is both faster and better maintained. If <code>scp</code> behaves oddly with wildcards or unusual filenames on a modern system, that protocol switch is why.</div>

<h3>rsync: the shape of the command</h3>
<pre><code>rsync -avz --progress ./dist/ vps:/srv/app/dist/</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-a</code> archive</span><span class="v">Recursive, and preserves permissions, timestamps, symlinks and ownership. Almost always what you want — it is <code>-rlptgoD</code> in one letter.</span></div>
  <div class="kv"><span class="k"><code>-v</code> verbose</span><span class="v">List what is transferred. Add a second <code>-v</code> to also see what is skipped and why.</span></div>
  <div class="kv"><span class="k"><code>-z</code> compress</span><span class="v">Compress in transit. Worth it over the internet, pointless over a fast LAN or on already-compressed files.</span></div>
  <div class="kv"><span class="k"><code>--progress</code></span><span class="v">Per-file progress. <code>--info=progress2</code> gives one overall bar instead, which is nicer for many small files.</span></div>
</div>
<pre><code>rsync -av --dry-run ./dist/ vps:/srv/app/dist/   <span class="tok-comment"># show, change nothing</span>
rsync -avz --partial --append-verify big.iso vps:/srv/   <span class="tok-comment"># resume a broken transfer</span>
rsync -avz -e 'ssh -p 2222' ./dist/ vps:/srv/    <span class="tok-comment"># a non-default port</span>
rsync -avz --rsync-path='sudo rsync' ./ vps:/opt/app/    <span class="tok-comment"># write as root remotely</span></code></pre>

<h3>The trailing slash — read this twice</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Source WITH a slash</span><span class="lz-t">rsync -a src/ dst/</span><span class="lz-d">"Copy the CONTENTS of src into dst." Result: dst/file1, dst/file2. This is what you almost always mean.</span></div>
  <div class="lz-step"><span class="lz-k">Source WITHOUT a slash</span><span class="lz-t">rsync -a src dst/</span><span class="lz-d">"Copy the DIRECTORY src into dst." Result: dst/src/file1. One character, an extra level of nesting.</span></div>
  <div class="lz-step"><span class="lz-k">Run it twice, both ways</span><span class="lz-t">dst/src/src/file1 never happens</span><span class="lz-d">rsync is idempotent, so the wrong form is stable rather than compounding — which is exactly why the mistake goes unnoticed for a while.</span></div>
  <div class="lz-step"><span class="lz-k">The destination slash</span><span class="lz-t">irrelevant</span><span class="lz-d">Only the SOURCE slash changes behaviour. Adding one to the destination for symmetry is harmless and makes the intent read clearly.</span></div>
</div>
<pre><code>rsync -av ./dist/ vps:/srv/app/     <span class="tok-comment"># → /srv/app/index.html  ✓</span>
rsync -av ./dist  vps:/srv/app/     <span class="tok-comment"># → /srv/app/dist/index.html</span></code></pre>
<div class="out">sending incremental file list
index.html
assets/main.css
assets/main.js

sent 48,213 bytes  received 88 bytes  32,200.67 bytes/sec</div>
<div class="callout ok">The habit that removes this class of bug: <strong>always run it once with <code>--dry-run</code> and read the paths</strong>. rsync prints exactly what it would create, so a stray <code>dist/dist/</code> is visible before it exists rather than after. It costs one second and it is the same discipline as <code>find … -print</code> before <code>find … -delete</code> (Lesson 2.3).</div>

<h3>--delete: the flag that makes a mirror</h3>
<pre><code>rsync -avz --delete ./dist/ vps:/srv/app/dist/</code></pre>
<p>Without <code>--delete</code>, rsync only ever adds and updates — a file you removed locally stays on the server forever. With it, the destination becomes an exact mirror of the source, which is what a deploy usually wants: stale assets from three releases ago actually go away.</p>
<div class="callout warn"><strong><code>--delete</code> plus a wrong source path is how people erase a server directory.</strong> If the source is empty — a build that failed, a variable that expanded to nothing, a path that does not exist — rsync faithfully makes the destination empty too. Three defences, all cheap: run <code>--dry-run</code> first and read the <code>deleting</code> lines; add <code>--delete-after</code> so deletions happen only once the transfer succeeded; and use <code>--max-delete=50</code> so an unexpected mass deletion aborts instead of proceeding.</div>
<pre><code>rsync -avz --delete --dry-run ./dist/ vps:/srv/app/dist/ | grep '^deleting'
rsync -avz --delete --delete-after --max-delete=50 ./dist/ vps:/srv/app/dist/</code></pre>
<div class="out">deleting assets/old-hero.jpg
deleting assets/legacy.css
deleting vendor/jquery.min.js</div>

<h3>Excluding things</h3>
<pre><code>rsync -avz --delete \\
  --exclude='.git/' \\
  --exclude='node_modules/' \\
  --exclude='.env*' \\
  --exclude='*.log' \\
  ./ vps:/srv/app/

rsync -avz --exclude-from=.rsyncignore ./ vps:/srv/app/
rsync -avz --filter=':- .gitignore' ./ vps:/srv/app/   <span class="tok-comment"># honour .gitignore</span></code></pre>
<div class="callout warn"><code>--exclude='.env*'</code> deserves its own line in every deploy command. Production environment lives in a file on the server (Lesson 8.3), and an rsync without that exclusion overwrites it with your local development values — or, with <code>--delete</code>, removes it entirely and the application will not start after the next restart. Exclude <code>.env</code> explicitly, and keep the real one outside the deployment directory so no rsync can reach it.</div>

<h3>Useful flags for real deploys</h3>
<pre><code>rsync -avz --bwlimit=2000 ./big/ vps:/srv/      <span class="tok-comment"># cap at ~2 MB/s</span>
rsync -avz --checksum ./dist/ vps:/srv/app/     <span class="tok-comment"># compare content, not mtime+size</span>
rsync -avz --backup --backup-dir=/srv/backups/\$(date +%F) ./dist/ vps:/srv/app/
rsync -avzn --itemize-changes ./dist/ vps:/srv/app/   <span class="tok-comment"># -n dry run, itemised</span></code></pre>
<div class="out">&gt;f.st...... index.html
&gt;f+++++++++ assets/new.css
.d..t...... assets/</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&gt;f+++++++++</code></span><span class="v">A new file being sent. The pluses mean every attribute is new.</span></div>
  <div class="kv"><span class="k"><code>&gt;f.st......</code></span><span class="v">An existing file whose size (<code>s</code>) and time (<code>t</code>) differ.</span></div>
  <div class="kv"><span class="k"><code>.d..t......</code></span><span class="v">A directory whose timestamp is being updated — no content change.</span></div>
  <div class="kv"><span class="k"><code>*deleting</code></span><span class="v">What <code>--delete</code> would remove. The line to read most carefully.</span></div>
</div>
<div class="callout"><code>--checksum</code> matters more than it looks in CI. rsync's default heuristic is "same size and same modification time means unchanged" — but a fresh <code>git clone</code> or a container build gives every file today's timestamp, so nothing looks unchanged and the whole tree transfers. <code>--checksum</code> compares content instead: slower to compute, far less to send. And in the opposite case — a file edited to exactly the same size within the same second — the default would skip a real change, which <code>--checksum</code> catches.</div>

<h3>A deploy function</h3>
<pre><code>deploy_assets() {
  local host=\$1 src=\$2 dst=\$3

  [[ -d \$src ]] || die "source does not exist: \$src"
  [[ -n \$(ls -A "\$src") ]] || die "source is empty — refusing to sync"

  log "dry run to \$host:\$dst"
  rsync -az --delete --dry-run --itemize-changes \\
    --exclude='.env*' --exclude='.git/' \\
    "\$src/" "\$host:\$dst/" | tee /tmp/rsync-plan.txt

  local removals
  removals=\$(grep -c '^\\*deleting' /tmp/rsync-plan.txt || true)
  (( removals &lt; 50 )) || die "\$removals deletions planned — aborting"

  log "syncing"
  rsync -az --delete --delete-after --max-delete=50 \\
    --exclude='.env*' --exclude='.git/' \\
    "\$src/" "\$host:\$dst/"
}</code></pre>
<div class="out">16:41:02 [INFO] dry run to vps:/srv/app/dist
&gt;f+++++++++ assets/main.a1b2c3.js
*deleting   assets/main.9f8e7d.js
16:41:03 [INFO] syncing</div>
<p>The empty-source check on line four is the one that matters: it turns "the build failed and rsync then emptied production" into a refusal with a clear message. Everything else here is Chapter 7 — guard clauses, a dry run, a message on failure — applied to a command that can destroy a directory.</p>

<h3>Choosing between them</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">scp</span><span class="lz-lnote">One file, once, interactively. Simple and universally available.</span></div>
  <div class="lz-layer"><span class="lz-lname">rsync</span><span class="lz-lnote">Anything repeated, anything large, anything that needs to mirror or resume. The default for deploys and backups.</span></div>
  <div class="lz-layer"><span class="lz-lname">tar over ssh</span><span class="lz-lnote"><code>tar -cz ./dir | ssh vps 'tar -xz -C /srv'</code> (Lesson 2.4) — when rsync is not installed on the far side, which happens in minimal containers.</span></div>
  <div class="lz-layer"><span class="lz-lname">sftp</span><span class="lz-lnote">Interactive browsing of a remote filesystem, and the protocol GUI clients speak. <code>sftp vps</code> then <code>get</code>, <code>put</code>, <code>ls</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Not a file transfer at all</span><span class="lz-lnote">Deploying a container image via a registry, or a release artefact via HTTP, avoids the question entirely — and is what the <code>deploy-nha.sh</code> approach in this project does.</span></div>
</div>

<a class="link-card" href="https://download.samba.org/pub/rsync/rsync.1" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">rsync(1) — the manual</span><span class="lc-sub">Long, but the "USAGE" section explains the trailing-slash rule in the author's own words, and the <code>--itemize-changes</code> legend is documented nowhere else.</span></span>
</a>
<a class="link-card" href="https://www.openssh.com/releasenotes.html#9.0" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">OpenSSH 9.0 release notes — scp now uses SFTP</span><span class="lc-sub">The official statement on why the old scp protocol was retired, and which behaviours changed as a result.</span></span>
</a>
<a class="link-card" href="https://rsync.samba.org/examples.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">rsync examples — backups and mirrors</span><span class="lc-sub">Including the <code>--link-dest</code> pattern for snapshot backups that share unchanged files via hard links (Lesson 2.4).</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: sync without losing anything</span><span class="lc-sub">Graded tasks on the trailing slash, <code>--delete</code> with a guard, excluding <code>.env</code>, and reading <code>--itemize-changes</code> output.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>rsync -avz --delete ./build/ vps:/srv/app/</code> when <code>./build/</code> is empty because the build failed. rsync does exactly what it was told — it makes the destination match the source — and the application directory is emptied, on a command that reported success. Two lines prevent it: check the source is non-empty before syncing, and pass <code>--max-delete=50</code> so a mass deletion aborts. And never point <code>--delete</code> at a directory that contains anything rsync is not the source of truth for — uploads, logs, the production <code>.env</code>.</div>
<p class="note-ct"><strong>Three habits and this lesson is finished:</strong> put a trailing slash on the source when you mean "the contents of"; run every new rsync command with <code>--dry-run</code> once and actually read the paths; and treat <code>--delete</code> as a destructive command that needs a guard, exactly like <code>rm -rf</code>. Everything else is flags you can look up.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Chuyển file</h2>
<p class="lead">Hai công cụ, một cái luật, và một cái cờ biết xoá đồ. <code>scp</code> chép một file; <code>rsync</code> chép <em>PHẦN KHÁC BIỆT</em> giữa hai cây thư mục, và điều đó làm lần chạy thứ hai gần như miễn phí. Cái luật kia nói về đúng một dấu gạch chéo ở cuối, và nó là lỗi phổ biến nhất trong cả chương này.</p>

<h3>scp: ổn với một file</h3>
<pre><code>scp file.txt vps:/srv/app/                  <span class="tok-comment"># đẩy lên</span>
scp vps:/var/log/app.log ./                 <span class="tok-comment"># tải về</span>
scp -r ./dist vps:/srv/app/                 <span class="tok-comment"># -r cho thư mục</span>
scp -P 2222 file.txt vps:/srv/             <span class="tok-comment"># chữ -P HOA cho cổng, khác với ssh</span>
scp file.txt vps:'/srv/my app/'             <span class="tok-comment"># đường dẫn ở xa có dấu cách: phải đặt nháy</span>
scp vps1:/tmp/a.txt vps2:/tmp/              <span class="tok-comment"># giữa hai máy ở xa</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-P</code>, không phải <code>-p</code></span><span class="v"><code>scp</code> dùng chữ <code>-P</code> hoa cho cổng; chữ <code>-p</code> thường thì giữ dấu thời gian. Còn <code>ssh</code> lại dùng <code>-p</code> thường cho cổng. Đưa máy đó vào <code>~/.ssh/config</code> (Bài 9.3) là gỡ bỏ vấn đề này hoàn toàn.</span></div>
  <div class="kv"><span class="k">Không nối tiếp, không so khác biệt</span><span class="v">Một lần truyền hỏng thì bắt đầu lại từ số không, và lần chạy thứ hai gửi lại tất cả. Với bất cứ thứ gì lớn hơn vài megabyte thì đó là việc của <code>rsync</code>.</span></div>
</div>
<div class="callout warn"><code>scp</code> đã <strong>bị khai tử ở mức giao thức</strong>. OpenSSH 9 chuyển nó sang dùng SFTP ở bên dưới, và những người phát triển OpenSSH mô tả giao thức gốc là lỗi thời và khó làm cho an toàn. Nó vẫn chạy và vẫn ổn cho một lần dùng nhanh, nhưng với mọi thứ nằm trong script hoặc lặp đi lặp lại thì <code>rsync</code> vừa nhanh hơn vừa được bảo trì tốt hơn. Nếu <code>scp</code> cư xử kỳ quặc với ký tự đại diện hay với những tên file khác thường trên một hệ đời mới, lý do là chính lần đổi giao thức đó.</div>

<h3>rsync: hình dạng của cái lệnh</h3>
<pre><code>rsync -avz --progress ./dist/ vps:/srv/app/dist/</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-a</code> archive</span><span class="v">Đệ quy, và giữ nguyên quyền, dấu thời gian, liên kết tượng trưng cùng quyền sở hữu. Gần như luôn là thứ bạn muốn — nó là <code>-rlptgoD</code> gói trong một chữ.</span></div>
  <div class="kv"><span class="k"><code>-v</code> verbose</span><span class="v">Liệt kê những gì được truyền. Thêm một chữ <code>-v</code> nữa để thấy cả những gì bị bỏ qua và vì sao.</span></div>
  <div class="kv"><span class="k"><code>-z</code> compress</span><span class="v">Nén trên đường truyền. Đáng dùng khi đi qua internet, vô nghĩa trên một mạng LAN nhanh hoặc với file vốn đã nén.</span></div>
  <div class="kv"><span class="k"><code>--progress</code></span><span class="v">Tiến độ theo từng file. <code>--info=progress2</code> cho một thanh tổng thể duy nhất, dễ chịu hơn với nhiều file nhỏ.</span></div>
</div>
<pre><code>rsync -av --dry-run ./dist/ vps:/srv/app/dist/   <span class="tok-comment"># hiện ra, không đổi gì</span>
rsync -avz --partial --append-verify big.iso vps:/srv/   <span class="tok-comment"># nối tiếp một lần truyền đứt</span>
rsync -avz -e 'ssh -p 2222' ./dist/ vps:/srv/    <span class="tok-comment"># cổng không mặc định</span>
rsync -avz --rsync-path='sudo rsync' ./ vps:/opt/app/    <span class="tok-comment"># ghi với quyền root ở đầu xa</span></code></pre>

<h3>Dấu gạch chéo cuối — hãy đọc chỗ này hai lần</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nguồn CÓ gạch chéo</span><span class="lz-t">rsync -a src/ dst/</span><span class="lz-d">"Chép NỘI DUNG của src vào dst." Kết quả: dst/file1, dst/file2. Đây gần như luôn là thứ bạn định làm.</span></div>
  <div class="lz-step"><span class="lz-k">Nguồn KHÔNG có gạch chéo</span><span class="lz-t">rsync -a src dst/</span><span class="lz-d">"Chép THƯ MỤC src vào dst." Kết quả: dst/src/file1. Một ký tự, thêm một tầng lồng nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Chạy hai lần, cả hai kiểu</span><span class="lz-t">dst/src/src/file1 không bao giờ xảy ra</span><span class="lz-d">rsync bền vững khi chạy lại, nên dạng sai thì ỔN ĐỊNH chứ không chồng chất — và đó chính là lý do sai lầm này không bị phát hiện trong một thời gian.</span></div>
  <div class="lz-step"><span class="lz-k">Gạch chéo ở ĐÍCH</span><span class="lz-t">không liên quan</span><span class="lz-d">Chỉ gạch chéo ở NGUỒN mới làm đổi hành vi. Thêm một cái vào đích cho cân đối thì vô hại và làm ý định đọc ra rõ hơn.</span></div>
</div>
<pre><code>rsync -av ./dist/ vps:/srv/app/     <span class="tok-comment"># → /srv/app/index.html  ✓</span>
rsync -av ./dist  vps:/srv/app/     <span class="tok-comment"># → /srv/app/dist/index.html</span></code></pre>
<div class="out">sending incremental file list
index.html
assets/main.css
assets/main.js

sent 48,213 bytes  received 88 bytes  32,200.67 bytes/sec</div>
<div class="callout ok">Thói quen gỡ bỏ được cả lớp lỗi này: <strong>luôn chạy một lần với <code>--dry-run</code> rồi ĐỌC các đường dẫn</strong>. rsync in ra chính xác thứ nó SẼ tạo ra, nên một cái <code>dist/dist/</code> lạc chỗ hiện ra TRƯỚC khi nó tồn tại chứ không phải sau. Nó tốn một giây và cùng một kỷ luật với việc <code>find … -print</code> trước <code>find … -delete</code> (Bài 2.3).</div>

<h3>--delete: cái cờ tạo ra một bản sao gương</h3>
<pre><code>rsync -avz --delete ./dist/ vps:/srv/app/dist/</code></pre>
<p>Không có <code>--delete</code>, rsync chỉ thêm vào và cập nhật — một file bạn đã xoá ở máy mình thì nằm lại trên máy chủ mãi mãi. Có nó, đích trở thành bản gương chính xác của nguồn, và đó thường là thứ một lần deploy muốn: những tệp tài nguyên cũ từ ba bản phát hành trước thật sự biến mất.</p>
<div class="callout warn"><strong><code>--delete</code> cộng với một đường dẫn nguồn sai chính là cách người ta xoá sạch một thư mục trên máy chủ.</strong> Nếu nguồn rỗng — một bản dựng thất bại, một biến khai triển thành rỗng, một đường dẫn không tồn tại — rsync trung thành làm cho đích cũng rỗng theo. Ba lớp phòng thủ, đều rẻ: chạy <code>--dry-run</code> trước rồi đọc các dòng <code>deleting</code>; thêm <code>--delete-after</code> để việc xoá chỉ xảy ra sau khi truyền thành công; và dùng <code>--max-delete=50</code> để một lần xoá hàng loạt ngoài dự kiến sẽ DỪNG LẠI thay vì cứ thế làm.</div>
<pre><code>rsync -avz --delete --dry-run ./dist/ vps:/srv/app/dist/ | grep '^deleting'
rsync -avz --delete --delete-after --max-delete=50 ./dist/ vps:/srv/app/dist/</code></pre>
<div class="out">deleting assets/old-hero.jpg
deleting assets/legacy.css
deleting vendor/jquery.min.js</div>

<h3>Loại trừ những thứ không nên đi theo</h3>
<pre><code>rsync -avz --delete \\
  --exclude='.git/' \\
  --exclude='node_modules/' \\
  --exclude='.env*' \\
  --exclude='*.log' \\
  ./ vps:/srv/app/

rsync -avz --exclude-from=.rsyncignore ./ vps:/srv/app/
rsync -avz --filter=':- .gitignore' ./ vps:/srv/app/   <span class="tok-comment"># tôn trọng .gitignore</span></code></pre>
<div class="callout warn"><code>--exclude='.env*'</code> xứng đáng có một dòng riêng trong MỌI lệnh deploy. Môi trường production nằm trong một file trên máy chủ (Bài 8.3), và một lệnh rsync thiếu phần loại trừ đó sẽ ghi đè lên nó bằng các giá trị phát triển ở máy bạn — hoặc, với <code>--delete</code>, xoá nó đi hoàn toàn và ứng dụng sẽ không khởi động được sau lần restart kế tiếp. Hãy loại trừ <code>.env</code> một cách tường minh, và giữ cái file thật NGOÀI thư mục triển khai để không lệnh rsync nào với tới được nó.</div>

<h3>Những cờ hữu ích cho việc deploy thật</h3>
<pre><code>rsync -avz --bwlimit=2000 ./big/ vps:/srv/      <span class="tok-comment"># chặn trần ở khoảng 2 MB/s</span>
rsync -avz --checksum ./dist/ vps:/srv/app/     <span class="tok-comment"># so NỘI DUNG, không so mtime+kích thước</span>
rsync -avz --backup --backup-dir=/srv/backups/\$(date +%F) ./dist/ vps:/srv/app/
rsync -avzn --itemize-changes ./dist/ vps:/srv/app/   <span class="tok-comment"># -n chạy thử, liệt kê từng mục</span></code></pre>
<div class="out">&gt;f.st...... index.html
&gt;f+++++++++ assets/new.css
.d..t...... assets/</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&gt;f+++++++++</code></span><span class="v">Một file MỚI đang được gửi đi. Các dấu cộng nghĩa là mọi thuộc tính đều mới.</span></div>
  <div class="kv"><span class="k"><code>&gt;f.st......</code></span><span class="v">Một file đã có mà kích thước (<code>s</code>) và thời gian (<code>t</code>) khác nhau.</span></div>
  <div class="kv"><span class="k"><code>.d..t......</code></span><span class="v">Một thư mục đang được cập nhật dấu thời gian — nội dung không đổi.</span></div>
  <div class="kv"><span class="k"><code>*deleting</code></span><span class="v">Thứ mà <code>--delete</code> sẽ gỡ bỏ. Đây là dòng cần đọc kỹ nhất.</span></div>
</div>
<div class="callout"><code>--checksum</code> quan trọng hơn vẻ ngoài của nó trong CI. Phép suy đoán mặc định của rsync là "cùng kích thước và cùng thời gian sửa nghĩa là không đổi" — nhưng một lần <code>git clone</code> mới hay một lần dựng container gán cho MỌI file dấu thời gian của hôm nay, nên chẳng cái nào trông như không đổi và cả cây thư mục được truyền lại. <code>--checksum</code> so nội dung thay vào: tính lâu hơn, gửi ít hơn rất nhiều. Và ở chiều ngược lại — một file được sửa thành đúng cùng kích thước trong cùng một giây — thì mặc định sẽ bỏ qua một thay đổi CÓ THẬT, còn <code>--checksum</code> thì bắt được.</div>

<h3>Một hàm deploy</h3>
<pre><code>deploy_assets() {
  local host=\$1 src=\$2 dst=\$3

  [[ -d \$src ]] || die "nguồn không tồn tại: \$src"
  [[ -n \$(ls -A "\$src") ]] || die "nguồn rỗng — từ chối đồng bộ"

  log "chạy thử tới \$host:\$dst"
  rsync -az --delete --dry-run --itemize-changes \\
    --exclude='.env*' --exclude='.git/' \\
    "\$src/" "\$host:\$dst/" | tee /tmp/rsync-plan.txt

  local removals
  removals=\$(grep -c '^\\*deleting' /tmp/rsync-plan.txt || true)
  (( removals &lt; 50 )) || die "dự kiến xoá \$removals mục — dừng lại"

  log "đang đồng bộ"
  rsync -az --delete --delete-after --max-delete=50 \\
    --exclude='.env*' --exclude='.git/' \\
    "\$src/" "\$host:\$dst/"
}</code></pre>
<div class="out">16:41:02 [INFO] chạy thử tới vps:/srv/app/dist
&gt;f+++++++++ assets/main.a1b2c3.js
*deleting   assets/main.9f8e7d.js
16:41:03 [INFO] đang đồng bộ</div>
<p>Phép kiểm nguồn-rỗng ở dòng thứ tư mới là cái có ý nghĩa: nó biến chuyện "bản dựng hỏng rồi rsync xoá sạch production" thành một lời từ chối kèm thông điệp rõ ràng. Mọi thứ còn lại ở đây là Chương 7 — chốt chặn, chạy thử, thông điệp khi hỏng — áp lên một cái lệnh có khả năng huỷ hoại cả một thư mục.</p>

<h3>Chọn giữa chúng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">scp</span><span class="lz-lnote">Một file, một lần, khi đang gõ tay. Đơn giản và có ở khắp nơi.</span></div>
  <div class="lz-layer"><span class="lz-lname">rsync</span><span class="lz-lnote">Mọi thứ lặp lại, mọi thứ lớn, mọi thứ cần soi gương hoặc cần nối tiếp. Mặc định cho việc deploy và sao lưu.</span></div>
  <div class="lz-layer"><span class="lz-lname">tar qua ssh</span><span class="lz-lnote"><code>tar -cz ./dir | ssh vps 'tar -xz -C /srv'</code> (Bài 2.4) — khi đầu bên kia không cài rsync, chuyện hay xảy ra trong container tối giản.</span></div>
  <div class="lz-layer"><span class="lz-lname">sftp</span><span class="lz-lnote">Duyệt tương tác một hệ thống file ở xa, và là giao thức mà các trình khách đồ hoạ nói. Gõ <code>sftp vps</code> rồi <code>get</code>, <code>put</code>, <code>ls</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không phải chuyển file gì cả</span><span class="lz-lnote">Triển khai một ảnh container qua một registry, hoặc một tệp phẩm phát hành qua HTTP, là tránh hẳn câu hỏi này — và đó chính là điều mà lối <code>deploy-nha.sh</code> trong dự án này làm.</span></div>
</div>

<a class="link-card" href="https://download.samba.org/pub/rsync/rsync.1" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">rsync(1) — sách hướng dẫn</span><span class="lc-sub">Dài, nhưng mục "USAGE" giải thích luật dấu gạch chéo cuối bằng chính lời tác giả, và bảng ký hiệu của <code>--itemize-changes</code> thì không có ở đâu khác.</span></span>
</a>
<a class="link-card" href="https://www.openssh.com/releasenotes.html#9.0" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">Ghi chú phát hành OpenSSH 9.0 — scp nay dùng SFTP</span><span class="lc-sub">Tuyên bố chính thức về lý do giao thức scp cũ bị cho nghỉ, và những hành vi nào đã đổi theo.</span></span>
</a>
<a class="link-card" href="https://rsync.samba.org/examples.html" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Ví dụ rsync — sao lưu và soi gương</span><span class="lc-sub">Gồm cả khuôn mẫu <code>--link-dest</code> cho những bản sao lưu ảnh chụp dùng chung file không đổi thông qua liên kết cứng (Bài 2.4).</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đồng bộ mà không mất gì</span><span class="lc-sub">Bài chấm điểm về dấu gạch chéo cuối, <code>--delete</code> có chốt chặn, loại trừ <code>.env</code>, và đọc output của <code>--itemize-changes</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy <code>rsync -avz --delete ./build/ vps:/srv/app/</code> khi <code>./build/</code> đang rỗng vì bản dựng vừa hỏng. rsync làm đúng y những gì được bảo — nó làm cho đích khớp với nguồn — và thư mục ứng dụng bị dọn sạch, bởi một cái lệnh đã báo cáo thành công. Hai dòng ngăn được chuyện đó: kiểm rằng nguồn khác rỗng trước khi đồng bộ, và truyền vào <code>--max-delete=50</code> để một lần xoá hàng loạt sẽ dừng lại. Và đừng bao giờ chĩa <code>--delete</code> vào một thư mục có chứa bất cứ thứ gì mà rsync không phải nguồn sự thật — file tải lên, log, hay file <code>.env</code> của production.</div>
<p class="note-ct"><strong>Ba thói quen và bài này coi như xong:</strong> đặt dấu gạch chéo cuối ở NGUỒN khi bạn muốn nói "nội dung của"; chạy mọi lệnh rsync mới một lần với <code>--dry-run</code> rồi THẬT SỰ đọc các đường dẫn; và coi <code>--delete</code> là một lệnh phá huỷ cần có chốt chặn, y hệt như <code>rm -rf</code>. Mọi thứ còn lại chỉ là những cái cờ mà bạn tra ra được.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Firewalls, and where the packet actually stops|||9.5 — Tường lửa, và gói tin thật ra dừng ở đâu',
      slug: 'lnx-9-5-tuong-lua',
      type: 'LESSON',
      description: 'ufw cho việc thường ngày và nftables ở bên dưới, ba tầng tường lửa mà một gói tin phải đi qua, vì sao Docker chọc thủng ufw, fail2ban, và một bảng kiểm kết nối hoàn chỉnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Firewalls</h2>
<p class="lead">A packet from your laptop to a service on a VPS passes through at least three places that can drop it, and only one of them is the firewall you configured. Knowing which three — and having a test for each — turns "the port is blocked somewhere" into a specific line you can change.</p>

<h3>The three layers</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Cloud security group</span><span class="lz-lnote">Outside the machine entirely: AWS security groups, DigitalOcean cloud firewalls, Hetzner firewalls. Nothing you run <em>on</em> the server can see it, and <code>tcpdump</code> shows no packet arriving at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Host firewall</span><span class="lz-lnote">On the machine: <code>ufw</code>, <code>firewalld</code>, or raw <code>nftables</code>. The packet arrives, the kernel drops it. <code>tcpdump</code> sees the SYN; nothing replies.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Bind address</span><span class="lz-lnote">Not a firewall at all: the service is listening on <code>127.0.0.1</code> only (Lesson 9.1). No firewall rule can fix this, and it is the most common cause.</span></div>
</div>
<pre><code><span class="tok-comment"># One test each, in this order</span>
sudo tcpdump -i any -n port 3000        <span class="tok-comment"># layer 1: does the packet arrive?</span>
sudo ufw status verbose                 <span class="tok-comment"># layer 2: would the host drop it?</span>
sudo ss -tulpn | grep :3000             <span class="tok-comment"># layer 3: what is it bound to?</span></code></pre>
<div class="callout ok">Run <code>tcpdump</code> first. If the SYN never appears while a client is actively trying, the block is upstream — a cloud security group or a network ACL — and no amount of <code>ufw</code> configuration will change it. That single observation saves the most common wasted hour in this whole chapter.</div>

<h3>ufw: the everyday interface</h3>
<pre><code>sudo ufw status verbose
sudo ufw allow 22/tcp                   <span class="tok-comment"># ALWAYS this one first</span>
sudo ufw allow 80,443/tcp
sudo ufw allow from 203.0.113.9 to any port 5432   <span class="tok-comment"># one source only</span>
sudo ufw allow from 10.0.0.0/8 to any port 5432    <span class="tok-comment"># a private range</span>
sudo ufw limit 22/tcp                   <span class="tok-comment"># rate-limit repeated attempts</span>
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable</code></pre>
<div class="out">Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)

To                Action      From
--                ------      ----
22/tcp            LIMIT IN    Anywhere
80,443/tcp        ALLOW IN    Anywhere
5432/tcp          ALLOW IN    203.0.113.9</div>
<div class="callout warn"><strong>Allow SSH before enabling the firewall.</strong> <code>ufw enable</code> with a default-deny policy and no rule for port 22 disconnects you immediately and permanently — the session dies mid-command and you cannot reconnect. Cloud providers offer a web console for exactly this; a self-hosted machine may offer nothing. The order is always: <code>allow 22</code>, verify with <code>ufw status</code>, <em>then</em> <code>enable</code>. Same discipline as Lesson 9.3's password-authentication trap.</div>
<pre><code>sudo ufw status numbered                <span class="tok-comment"># rules with index numbers</span>
sudo ufw delete 3                       <span class="tok-comment"># remove by number</span>
sudo ufw --dry-run allow 8080/tcp       <span class="tok-comment"># show what it would do</span>
sudo ufw reset                          <span class="tok-comment"># start over (disables it too)</span>
sudo tail -f /var/log/ufw.log           <span class="tok-comment"># what is being blocked, live</span></code></pre>
<div class="out">[UFW BLOCK] IN=eth0 SRC=198.51.100.23 DST=203.0.113.42 PROTO=TCP SPT=51234 DPT=3306</div>
<p>That log line is a complete answer: someone at <code>198.51.100.23</code> tried to reach MySQL on port 3306 and ufw dropped it. When a legitimate connection fails, watching this file while you retry tells you in one second whether the host firewall is responsible.</p>

<h3>What is underneath</h3>
<pre><code>sudo nft list ruleset | head -40         <span class="tok-comment"># the real rules, modern kernels</span>
sudo iptables -L -n -v                   <span class="tok-comment"># legacy view; often a shim over nftables</span>
sudo iptables -t nat -L -n               <span class="tok-comment"># NAT — where Docker's rules live</span></code></pre>
<p><code>ufw</code> and <code>firewalld</code> are front-ends. Underneath is <code>nftables</code> on any current distribution, with <code>iptables</code> commands translated to it for compatibility. You rarely need to write <code>nft</code> rules by hand, but you do need to <em>read</em> them — because other software writes rules there too, and that is the subject of the next section.</p>

<h3>Docker and ufw do not agree</h3>
<pre><code>sudo ufw default deny incoming
sudo ufw enable
docker run -d -p 3306:3306 mysql        <span class="tok-comment"># now reachable from the internet</span>
curl -sv telnet://203.0.113.42:3306     <span class="tok-comment"># from another machine: it connects</span></code></pre>
<div class="callout warn"><strong>Docker inserts its own rules ahead of ufw's.</strong> Publishing a port with <code>-p 3306:3306</code> writes a <code>DOCKER</code> chain rule in the <code>nat</code> table that is evaluated <em>before</em> the <code>filter</code> chain ufw manages — so <code>ufw status</code> shows the port as blocked while the world can reach it. This surprises people badly, and it has exposed a great many development databases.</div>
<pre><code><span class="tok-comment"># The fix: publish to loopback only, and let a reverse proxy handle the internet</span>
docker run -d -p 127.0.0.1:3306:3306 mysql
docker run -d -p 127.0.0.1:5432:5432 postgres

<span class="tok-comment"># In compose</span>
services:
  db:
    ports:
      - "127.0.0.1:5432:5432"     <span class="tok-comment"># reachable from the host, not from outside</span>
  backend:
    expose:
      - "3000"                    <span class="tok-comment"># reachable only by other containers</span></code></pre>
<div class="callout ok">The rule to adopt: <strong>publish nothing to <code>0.0.0.0</code> except the reverse proxy's 80 and 443.</strong> Everything else gets <code>127.0.0.1:</code> in front of the port, or uses <code>expose</code> so only other containers on the network can reach it. Then <code>ufw</code>'s view and reality agree again, and the audit from Lesson 9.1 — <code>sudo ss -tulpn | grep '0.0.0.0'</code> — shows only what you intended.</div>

<h3>fail2ban: for what a firewall cannot express</h3>
<pre><code>sudo apt install fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
sudo fail2ban-client set sshd unbanip 203.0.113.9</code></pre>
<div class="out">Status for the jail: sshd
|- Currently failed: 2
|- Currently banned: 14
&#96;- Banned IP list: 198.51.100.23 198.51.100.44 …</div>
<p>A firewall rule is static: this port, from these addresses. fail2ban watches logs and adds temporary rules in response to behaviour — twenty failed SSH logins in ten minutes, and that address is dropped for an hour. With key-only authentication (Lesson 9.3) the security benefit is modest, but it substantially reduces log noise, which makes real events visible.</p>
<pre><code><span class="tok-comment"># /etc/fail2ban/jail.local — do not edit jail.conf</span>
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true</code></pre>

<h3>The complete connectivity checklist</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · On the server</span><span class="lz-t">sudo ss -tulpn | grep :PORT</span><span class="lz-d">Is anything listening, and on which ADDRESS? 127.0.0.1 means stop here — no firewall change will help.</span></div>
  <div class="lz-step"><span class="lz-k">2 · On the server</span><span class="lz-t">curl localhost:PORT</span><span class="lz-d">Does the service itself answer? If not, this is an application problem, not a network one.</span></div>
  <div class="lz-step"><span class="lz-k">3 · From outside</span><span class="lz-t">nc -zv host PORT</span><span class="lz-d">Refused = nothing listening on that address. Timed out = something is silently dropping it.</span></div>
  <div class="lz-step"><span class="lz-k">4 · On the server, while retrying</span><span class="lz-t">sudo tcpdump -i any -n port PORT</span><span class="lz-d">No packet at all = blocked upstream (cloud firewall). SYN with no reply = blocked here.</span></div>
  <div class="lz-step"><span class="lz-k">5 · On the server</span><span class="lz-t">sudo ufw status · sudo tail -f /var/log/ufw.log</span><span class="lz-d">Now, and only now, is the host firewall a suspect. The log names the source and port it dropped.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Provider console</span><span class="lz-t">security groups, cloud firewall, network ACLs</span><span class="lz-d">If step 4 saw nothing arrive, this is where the packet died — and it is invisible from inside the machine.</span></div>
</div>
<pre><code><span class="tok-comment"># Compressed into one script you can paste onto a server</span>
port=\${1:?usage: check-port PORT}
echo "== listening =="   ; sudo ss -tulpn | grep ":\$port" || echo "  nothing on :\$port"
echo "== local =="       ; curl -s -o /dev/null -w '  %{http_code}\\n' "localhost:\$port" || echo "  no answer"
echo "== ufw =="         ; sudo ufw status | grep -E "\$port|Status" || echo "  ufw inactive"
echo "== docker =="      ; sudo iptables -t nat -L DOCKER -n 2&gt;/dev/null | grep ":\$port" || true</code></pre>
<div class="out">== listening ==
tcp LISTEN 127.0.0.1:3000 0.0.0.0:* users:(("node",pid=5012,fd=21))
== local ==
  200
== ufw ==
Status: active
3000/tcp                   ALLOW IN    Anywhere</div>
<p>Read that output as a diagnosis: the service answers locally, ufw allows the port — and it is bound to <code>127.0.0.1</code>, so nothing outside can reach it regardless. The firewall rule is not wrong; it is irrelevant. Without step 1 you would spend the afternoon on ufw.</p>

<h3>Outbound matters too</h3>
<pre><code>sudo ufw default deny outgoing          <span class="tok-comment"># strict; now allow what you need</span>
sudo ufw allow out 53                   <span class="tok-comment"># DNS</span>
sudo ufw allow out 80,443/tcp           <span class="tok-comment"># package updates, APIs</span>
sudo ufw allow out 25,587/tcp           <span class="tok-comment"># mail, if this host sends it</span></code></pre>
<div class="callout">Default-deny outbound is unusual on a general-purpose server and genuinely valuable on one that runs untrusted code: it limits what a compromised application can reach and what it can send data to. It is also a reliable way to break package installs, webhooks and certificate renewal in confusing ways, so add it deliberately and test each thing the machine legitimately does. If downloads work for you but not for a service, remember the proxy variables from Lesson 8.3 before blaming the firewall.</div>

<a class="link-card" href="https://help.ubuntu.com/community/UFW" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Ubuntu — UFW</span><span class="lc-sub">Rule syntax, application profiles, logging levels and the IPv6 notes. Enough to run a server firewall without touching nftables.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — packet filtering and firewalls</span><span class="lc-sub">Docker's own explanation of why published ports bypass ufw, and the supported ways to restrict them. Read before publishing anything on a public host.</span></span>
</a>
<a class="link-card" href="https://wiki.nftables.org/wiki-nftables/index.php/Main_Page" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">nftables wiki</span><span class="lc-sub">The layer underneath ufw and firewalld. Useful when you need to read rules another program wrote — which is exactly the Docker case.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find the block</span><span class="lc-sub">Four unreachable services: one bound to loopback, one blocked by ufw, one blocked upstream, one published past ufw by Docker. Identify each with the six-step checklist.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> trusting <code>ufw status</code> as the whole truth on a machine running Docker. It reports the <code>filter</code> table it manages, while Docker's published ports are handled earlier in the <code>nat</code> table — so a database you believe is firewalled has been reachable from the internet since the day you started the container. The check that tells the truth is <code>sudo ss -tulpn | grep '0.0.0.0'</code>, which shows what is actually listening on a public address regardless of which tool wrote which rule. Run it on every server you inherit, before anything else.</div>
<p class="note-ct"><strong>The order matters more than any individual command.</strong> Listening address, then the service locally, then from outside, then <code>tcpdump</code>, then the host firewall, then the provider. Most people start at the firewall — the fifth step — and the answer is usually at the first. Ten seconds of <code>ss -tulpn</code> before touching a firewall rule is the highest-value habit in this chapter.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Tường lửa</h2>
<p class="lead">Một gói tin đi từ laptop của bạn tới một dịch vụ trên VPS phải qua ít nhất ba chỗ có thể vứt nó đi, và chỉ một trong ba là cái tường lửa mà bạn đã cấu hình. Biết được ba chỗ đó — và có một phép thử cho từng chỗ — biến câu "cổng bị chặn ở đâu đó" thành một dòng cụ thể mà bạn sửa được.</p>

<h3>Ba tầng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Nhóm bảo mật của đám mây</span><span class="lz-lnote">Hoàn toàn nằm NGOÀI cái máy: security group của AWS, cloud firewall của DigitalOcean, firewall của Hetzner. Không thứ gì bạn chạy <em>TRÊN</em> máy chủ nhìn thấy nó, và <code>tcpdump</code> chẳng thấy gói tin nào tới cả.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Tường lửa của máy</span><span class="lz-lnote">Trên chính cái máy: <code>ufw</code>, <code>firewalld</code>, hoặc <code>nftables</code> thô. Gói tin TỚI NƠI, rồi nhân vứt nó đi. <code>tcpdump</code> thấy gói SYN; không có gì trả lời.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Địa chỉ gắn</span><span class="lz-lnote">Hoàn toàn không phải tường lửa: dịch vụ chỉ đang lắng nghe trên <code>127.0.0.1</code> (Bài 9.1). Không luật tường lửa nào chữa được, và đây là nguyên nhân phổ biến nhất.</span></div>
</div>
<pre><code><span class="tok-comment"># Mỗi tầng một phép thử, theo đúng thứ tự này</span>
sudo tcpdump -i any -n port 3000        <span class="tok-comment"># tầng 1: gói tin có tới không?</span>
sudo ufw status verbose                 <span class="tok-comment"># tầng 2: máy này có vứt nó không?</span>
sudo ss -tulpn | grep :3000             <span class="tok-comment"># tầng 3: nó đang gắn vào đâu?</span></code></pre>
<div class="callout ok">Hãy chạy <code>tcpdump</code> trước. Nếu gói SYN không bao giờ xuất hiện trong khi một trình khách đang tích cực thử kết nối, thì chỗ chặn nằm ở PHÍA TRÊN — một nhóm bảo mật của đám mây hoặc một ACL mạng — và cấu hình <code>ufw</code> bao nhiêu cũng chẳng thay đổi được gì. Riêng quan sát đó tiết kiệm được cái giờ bị lãng phí thường xuyên nhất trong cả chương này.</div>

<h3>ufw: giao diện dùng hằng ngày</h3>
<pre><code>sudo ufw status verbose
sudo ufw allow 22/tcp                   <span class="tok-comment"># LUÔN là cái này trước tiên</span>
sudo ufw allow 80,443/tcp
sudo ufw allow from 203.0.113.9 to any port 5432   <span class="tok-comment"># chỉ một nguồn</span>
sudo ufw allow from 10.0.0.0/8 to any port 5432    <span class="tok-comment"># một dải riêng tư</span>
sudo ufw limit 22/tcp                   <span class="tok-comment"># hạn chế tần suất thử lặp lại</span>
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable</code></pre>
<div class="out">Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)

To                Action      From
--                ------      ----
22/tcp            LIMIT IN    Anywhere
80,443/tcp        ALLOW IN    Anywhere
5432/tcp          ALLOW IN    203.0.113.9</div>
<div class="callout warn"><strong>Hãy cho phép SSH TRƯỚC KHI bật tường lửa.</strong> Chạy <code>ufw enable</code> với chính sách mặc định là từ chối mà không có luật nào cho cổng 22 sẽ ngắt kết nối của bạn ngay lập tức và vĩnh viễn — phiên đang chạy chết giữa lệnh và bạn không kết nối lại được. Các nhà cung cấp đám mây có sẵn console trên web đúng cho tình huống này; một cái máy tự dựng thì có thể chẳng có gì. Thứ tự luôn là: <code>allow 22</code>, xác nhận bằng <code>ufw status</code>, <em>RỒI MỚI</em> <code>enable</code>. Cùng một kỷ luật với cái bẫy tắt xác thực mật khẩu ở Bài 9.3.</div>
<pre><code>sudo ufw status numbered                <span class="tok-comment"># các luật kèm số thứ tự</span>
sudo ufw delete 3                       <span class="tok-comment"># gỡ theo số</span>
sudo ufw --dry-run allow 8080/tcp       <span class="tok-comment"># hiện ra thứ nó sẽ làm</span>
sudo ufw reset                          <span class="tok-comment"># làm lại từ đầu (tắt luôn nó)</span>
sudo tail -f /var/log/ufw.log           <span class="tok-comment"># cái gì đang bị chặn, ngay lúc đó</span></code></pre>
<div class="out">[UFW BLOCK] IN=eth0 SRC=198.51.100.23 DST=203.0.113.42 PROTO=TCP SPT=51234 DPT=3306</div>
<p>Dòng log đó là một câu trả lời hoàn chỉnh: ai đó ở <code>198.51.100.23</code> thử với tới MySQL trên cổng 3306 và ufw đã vứt nó đi. Khi một kết nối HỢP LỆ bị hỏng, việc theo dõi file này trong lúc bạn thử lại sẽ cho biết trong một giây rằng tường lửa của máy có phải thủ phạm hay không.</p>

<h3>Bên dưới nó là gì</h3>
<pre><code>sudo nft list ruleset | head -40         <span class="tok-comment"># các luật thật, trên nhân đời mới</span>
sudo iptables -L -n -v                   <span class="tok-comment"># khung nhìn cũ; thường là lớp đệm trên nftables</span>
sudo iptables -t nat -L -n               <span class="tok-comment"># NAT — chỗ các luật của Docker nằm</span></code></pre>
<p><code>ufw</code> và <code>firewalld</code> chỉ là giao diện phía trước. Bên dưới là <code>nftables</code> trên mọi bản phân phối hiện hành, với các lệnh <code>iptables</code> được dịch sang nó để tương thích. Bạn hiếm khi cần TỰ VIẾT luật <code>nft</code>, nhưng bạn thì cần <em>ĐỌC</em> được chúng — vì phần mềm khác cũng viết luật vào đó, và đó chính là chủ đề của phần kế tiếp.</p>

<h3>Docker và ufw không đồng thuận với nhau</h3>
<pre><code>sudo ufw default deny incoming
sudo ufw enable
docker run -d -p 3306:3306 mysql        <span class="tok-comment"># giờ với tới được từ internet</span>
curl -sv telnet://203.0.113.42:3306     <span class="tok-comment"># từ một máy khác: nó kết nối được</span></code></pre>
<div class="callout warn"><strong>Docker chèn luật của riêng nó vào TRƯỚC luật của ufw.</strong> Công bố một cổng bằng <code>-p 3306:3306</code> sẽ ghi một luật vào chuỗi <code>DOCKER</code> trong bảng <code>nat</code>, và bảng đó được xét <em>TRƯỚC</em> cái chuỗi <code>filter</code> mà ufw quản lý — nên <code>ufw status</code> hiện ra rằng cổng đang bị chặn trong khi cả thế giới với tới được. Chuyện này làm người ta bất ngờ rất mạnh, và nó đã phơi ra vô số cơ sở dữ liệu dùng để phát triển.</div>
<pre><code><span class="tok-comment"># Cách chữa: chỉ công bố ra loopback, rồi để một proxy ngược lo phần internet</span>
docker run -d -p 127.0.0.1:3306:3306 mysql
docker run -d -p 127.0.0.1:5432:5432 postgres

<span class="tok-comment"># Trong compose</span>
services:
  db:
    ports:
      - "127.0.0.1:5432:5432"     <span class="tok-comment"># máy chủ với tới được, bên ngoài thì không</span>
  backend:
    expose:
      - "3000"                    <span class="tok-comment"># chỉ các container khác với tới được</span></code></pre>
<div class="callout ok">Quy tắc nên nhận: <strong>đừng công bố thứ gì ra <code>0.0.0.0</code> ngoài cổng 80 và 443 của proxy ngược.</strong> Mọi thứ khác đều được thêm <code>127.0.0.1:</code> trước số cổng, hoặc dùng <code>expose</code> để chỉ các container khác trên cùng mạng với tới được. Khi đó khung nhìn của <code>ufw</code> và thực tế lại khớp nhau, và phép rà soát ở Bài 9.1 — <code>sudo ss -tulpn | grep '0.0.0.0'</code> — chỉ còn hiện ra đúng những gì bạn định.</div>

<h3>fail2ban: cho thứ mà một tường lửa không diễn đạt được</h3>
<pre><code>sudo apt install fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
sudo fail2ban-client set sshd unbanip 203.0.113.9</code></pre>
<div class="out">Status for the jail: sshd
|- Currently failed: 2
|- Currently banned: 14
&#96;- Banned IP list: 198.51.100.23 198.51.100.44 …</div>
<p>Một luật tường lửa là tĩnh: cổng này, từ những địa chỉ này. fail2ban thì theo dõi log và thêm những luật TẠM THỜI để phản ứng với HÀNH VI — hai mươi lần đăng nhập SSH hỏng trong mười phút, và địa chỉ đó bị chặn một tiếng. Với xác thực chỉ-bằng-khoá (Bài 9.3) thì lợi ích an ninh là khiêm tốn, nhưng nó giảm đáng kể nhiễu trong log, và điều đó làm những sự kiện THẬT trở nên nhìn thấy được.</p>
<pre><code><span class="tok-comment"># /etc/fail2ban/jail.local — đừng sửa jail.conf</span>
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true</code></pre>

<h3>Bảng kiểm kết nối đầy đủ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Trên máy chủ</span><span class="lz-t">sudo ss -tulpn | grep :CỔNG</span><span class="lz-d">Có gì lắng nghe không, và trên ĐỊA CHỈ nào? Nếu là 127.0.0.1 thì dừng ngay ở đây — đổi tường lửa cũng vô ích.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Trên máy chủ</span><span class="lz-t">curl localhost:CỔNG</span><span class="lz-d">Chính dịch vụ đó có trả lời không? Nếu không thì đây là vấn đề của ứng dụng, không phải của mạng.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Từ bên ngoài</span><span class="lz-t">nc -zv host CỔNG</span><span class="lz-d">Refused = không có gì lắng nghe trên địa chỉ đó. Timed out = có thứ gì đó đang âm thầm vứt nó đi.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Trên máy chủ, trong lúc thử lại</span><span class="lz-t">sudo tcpdump -i any -n port CỔNG</span><span class="lz-d">Không thấy gói nào = bị chặn ở phía trên (tường lửa của đám mây). Thấy SYN mà không có hồi đáp = bị chặn ngay tại đây.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Trên máy chủ</span><span class="lz-t">sudo ufw status · sudo tail -f /var/log/ufw.log</span><span class="lz-d">Bây giờ, và chỉ bây giờ, tường lửa của máy mới là nghi phạm. File log gọi tên nguồn và cổng mà nó đã vứt.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Console của nhà cung cấp</span><span class="lz-t">security group, cloud firewall, network ACL</span><span class="lz-d">Nếu bước 4 chẳng thấy gì tới nơi thì đây là chỗ gói tin chết — và nó vô hình từ bên trong cái máy.</span></div>
</div>
<pre><code><span class="tok-comment"># Nén lại thành một script dán được lên máy chủ</span>
port=\${1:?cách dùng: check-port CỔNG}
echo "== đang lắng nghe ==" ; sudo ss -tulpn | grep ":\$port" || echo "  không có gì trên :\$port"
echo "== cục bộ =="         ; curl -s -o /dev/null -w '  %{http_code}\\n' "localhost:\$port" || echo "  không trả lời"
echo "== ufw =="            ; sudo ufw status | grep -E "\$port|Status" || echo "  ufw không bật"
echo "== docker =="         ; sudo iptables -t nat -L DOCKER -n 2&gt;/dev/null | grep ":\$port" || true</code></pre>
<div class="out">== đang lắng nghe ==
tcp LISTEN 127.0.0.1:3000 0.0.0.0:* users:(("node",pid=5012,fd=21))
== cục bộ ==
  200
== ufw ==
Status: active
3000/tcp                   ALLOW IN    Anywhere</div>
<p>Hãy đọc output đó như một chẩn đoán: dịch vụ trả lời được ở cục bộ, ufw cho phép cổng — và nó đang gắn vào <code>127.0.0.1</code>, nên bên ngoài chẳng ai với tới được, bất kể mọi thứ khác. Luật tường lửa không SAI; nó KHÔNG LIÊN QUAN. Thiếu bước 1 thì bạn đã tiêu cả buổi chiều vào ufw.</p>

<h3>Chiều đi ra cũng quan trọng</h3>
<pre><code>sudo ufw default deny outgoing          <span class="tok-comment"># chặt chẽ; giờ mở đúng thứ bạn cần</span>
sudo ufw allow out 53                   <span class="tok-comment"># DNS</span>
sudo ufw allow out 80,443/tcp           <span class="tok-comment"># cập nhật gói, gọi API</span>
sudo ufw allow out 25,587/tcp           <span class="tok-comment"># thư, nếu máy này có gửi</span></code></pre>
<div class="callout">Mặc định chặn chiều đi ra là chuyện không thường gặp trên một máy chủ đa dụng và thật sự có giá trị trên một máy chạy mã không tin được: nó giới hạn những gì một ứng dụng bị chiếm có thể với tới và có thể gửi dữ liệu đi đâu. Nó cũng là một cách đáng tin để làm hỏng việc cài gói, webhook và gia hạn chứng chỉ theo những kiểu khó hiểu, nên hãy thêm nó một cách có chủ ý rồi kiểm từng việc mà cái máy thật sự làm. Nếu việc tải về chạy được với bạn mà không chạy với một dịch vụ, hãy nhớ tới các biến proxy ở Bài 8.3 trước khi đổ lỗi cho tường lửa.</div>

<a class="link-card" href="https://help.ubuntu.com/community/UFW" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Ubuntu — UFW</span><span class="lc-sub">Cú pháp luật, hồ sơ ứng dụng, mức ghi log và các ghi chú về IPv6. Đủ để vận hành một tường lửa máy chủ mà không phải đụng tới nftables.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — lọc gói tin và tường lửa</span><span class="lc-sub">Chính Docker giải thích vì sao cổng đã công bố đi vòng qua ufw, và những cách được hỗ trợ để siết chúng lại. Hãy đọc TRƯỚC khi công bố bất cứ thứ gì trên một máy công khai.</span></span>
</a>
<a class="link-card" href="https://wiki.nftables.org/wiki-nftables/index.php/Main_Page" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Wiki nftables</span><span class="lc-sub">Cái tầng nằm dưới ufw và firewalld. Hữu ích khi bạn cần ĐỌC những luật do một chương trình khác viết ra — đúng là trường hợp của Docker.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm ra chỗ bị chặn</span><span class="lc-sub">Bốn dịch vụ không với tới được: một cái gắn vào loopback, một bị ufw chặn, một bị chặn ở phía trên, một bị Docker công bố vượt mặt ufw. Hãy nhận diện từng cái bằng bảng kiểm sáu bước.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tin <code>ufw status</code> là toàn bộ sự thật trên một cái máy có chạy Docker. Nó báo cáo bảng <code>filter</code> mà nó quản lý, trong khi các cổng do Docker công bố lại được xử lý sớm hơn ở bảng <code>nat</code> — nên một cơ sở dữ liệu mà bạn tin là đã có tường lửa che thì thật ra đã với tới được từ internet kể từ ngày bạn khởi động cái container. Phép kiểm nói đúng sự thật là <code>sudo ss -tulpn | grep '0.0.0.0'</code>, thứ cho thấy cái gì THẬT SỰ đang lắng nghe trên một địa chỉ công khai, bất kể công cụ nào đã viết luật nào. Hãy chạy nó trên mọi máy chủ bạn tiếp quản, trước mọi thứ khác.</div>
<p class="note-ct"><strong>Thứ tự quan trọng hơn bất kỳ lệnh đơn lẻ nào.</strong> Địa chỉ gắn, rồi dịch vụ ở cục bộ, rồi từ bên ngoài, rồi <code>tcpdump</code>, rồi tường lửa của máy, rồi nhà cung cấp. Phần lớn mọi người bắt đầu từ TƯỜNG LỬA — bước thứ năm — trong khi câu trả lời thường nằm ở bước đầu tiên. Mười giây <code>ss -tulpn</code> trước khi đụng vào một luật tường lửa là thói quen giá trị nhất của chương này.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.6 Quiz ─────────────────────────── */
    {
      title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra Chương 9',
      slug: 'lnx-9-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về 127.0.0.1 với 0.0.0.0, dig @resolver, curl -sSf, ssh -L, ProxyJump với chuyển tiếp agent, dấu gạch chéo cuối của rsync, --delete, và Docker vượt mặt ufw.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on interfaces, DNS, curl, SSH, file transfer and firewalls. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: what <code>127.0.0.1</code> versus <code>0.0.0.0</code> means for reachability (9.1), why <code>curl</code> without <code>-f</code> hides a 404 (9.2), and what a trailing slash does to an rsync source (9.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về giao diện, DNS, curl, SSH, chuyển file và tường lửa. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: <code>127.0.0.1</code> so với <code>0.0.0.0</code> nghĩa là gì với khả năng với tới (bài 9.1), vì sao <code>curl</code> thiếu <code>-f</code> lại giấu mất một mã 404 (bài 9.2), và dấu gạch chéo cuối làm gì với nguồn của rsync (bài 9.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'ss shows "LISTEN 127.0.0.1:3000". The firewall allows 3000. Why can nobody connect from another machine?|||ss hiện ra "LISTEN 127.0.0.1:3000". Tường lửa đã cho phép cổng 3000. Vì sao từ máy khác vẫn không ai kết nối được?',
            options: [
              'The firewall rule needs to be reloaded|||Luật tường lửa cần được nạp lại',
              'It is bound to loopback only, which is reachable exclusively from that machine — no firewall rule can change that|||Nó chỉ gắn vào loopback, thứ chỉ với tới được từ chính cái máy đó — không luật tường lửa nào đổi được điều đó',
              'Port 3000 is reserved and cannot be exposed|||Cổng 3000 bị dành riêng và không phơi ra được',
              'The service needs to be restarted after the firewall changed|||Dịch vụ cần được khởi động lại sau khi tường lửa thay đổi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'dig +short example.com returns an old IP, but dig @1.1.1.1 +short example.com returns the new one. What does that mean?|||dig +short example.com trả về IP cũ, còn dig @1.1.1.1 +short example.com trả về IP mới. Điều đó nghĩa là gì?',
            options: [
              'The DNS record was configured incorrectly and must be edited again|||Bản ghi DNS bị cấu hình sai và phải sửa lại',
              'The record HAS propagated; your own resolver is serving a cached copy — wait for the TTL or flush the cache|||Bản ghi ĐÃ lan truyền; chính bộ phân giải của bạn đang phục vụ một bản lưu tạm — hãy chờ hết TTL hoặc xả bộ đệm',
              '1.1.1.1 is authoritative for the domain|||1.1.1.1 là máy chủ có thẩm quyền cho tên miền đó',
              'The domain has two conflicting A records|||Tên miền có hai bản ghi A mâu thuẫn nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does "curl -s https://site/missing > data.json" exit 0 and write an HTML error page?|||Vì sao "curl -s https://site/missing > data.json" lại thoát ra 0 và ghi vào đó một trang lỗi HTML?',
            options: [
              'The server returned 200 with an error page body|||Máy chủ trả về mã 200 kèm phần thân là trang lỗi',
              'Without -f, curl treats a 404 as a SUCCESSFUL transfer of an error page — add -f to exit non-zero on 4xx/5xx|||Thiếu -f, curl coi mã 404 là một lần truyền THÀNH CÔNG một trang lỗi — hãy thêm -f để thoát khác 0 khi gặp 4xx/5xx',
              '-s suppresses the exit code|||-s dập luôn mã thoát',
              'Redirection to a file always resets the exit code to 0|||Chuyển hướng vào file luôn đặt lại mã thoát về 0',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does "ssh -L 5432:localhost:5432 vps" achieve?|||Lệnh "ssh -L 5432:localhost:5432 vps" đạt được điều gì?',
            options: [
              'It opens port 5432 on the VPS firewall|||Nó mở cổng 5432 trên tường lửa của VPS',
              'Your local port 5432 is carried over the SSH session to the VPS, which connects to ITS own localhost:5432 — so a loopback-bound database becomes usable from your laptop with no port exposed|||Cổng 5432 cục bộ của bạn được chở qua phiên SSH tới VPS, và VPS kết nối tới localhost:5432 CỦA NÓ — nên một cơ sở dữ liệu gắn vào loopback trở nên dùng được từ laptop mà không phơi cổng nào',
              'It copies the database to your machine|||Nó chép cơ sở dữ liệu về máy bạn',
              'It makes your laptop\'s port 5432 reachable from the VPS|||Nó làm cổng 5432 của laptop với tới được từ VPS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why prefer ProxyJump over agent forwarding (-A) to reach a private host?|||Vì sao nên chọn ProxyJump thay vì chuyển tiếp agent (-A) để với tới một máy riêng?',
            options: [
              'ProxyJump is faster because it uses fewer TCP connections|||ProxyJump nhanh hơn vì nó dùng ít kết nối TCP hơn',
              'Agent forwarding lets root on the intermediate host authenticate as YOU to every server your agent holds a key for, leaving no trace on your machine|||Chuyển tiếp agent cho phép root trên máy trung gian xác thực với danh nghĩa BẠN tới mọi máy chủ mà agent của bạn giữ khoá, và không để lại dấu vết nào trên máy bạn',
              'Agent forwarding does not work with ed25519 keys|||Chuyển tiếp agent không chạy với khoá ed25519',
              'ProxyJump encrypts the connection while -A does not|||ProxyJump mã hoá kết nối còn -A thì không',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between "rsync -a src/ dst/" and "rsync -a src dst/"?|||Khác biệt giữa "rsync -a src/ dst/" và "rsync -a src dst/" là gì?',
            options: [
              'None — rsync normalises trailing slashes|||Không có gì — rsync tự chuẩn hoá dấu gạch chéo cuối',
              'The first copies the CONTENTS of src into dst; the second copies the DIRECTORY src into dst, giving dst/src/…|||Cái đầu chép NỘI DUNG của src vào dst; cái sau chép THƯ MỤC src vào dst, cho ra dst/src/…',
              'The first is recursive, the second is not|||Cái đầu đệ quy, cái sau thì không',
              'The trailing slash on the destination is what matters, not the source|||Dấu gạch chéo ở ĐÍCH mới là cái có ý nghĩa, không phải ở nguồn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A deploy runs "rsync -a --delete ./build/ vps:/srv/app/" but the build failed and ./build/ is empty. What happens?|||Một lần deploy chạy "rsync -a --delete ./build/ vps:/srv/app/" nhưng bản dựng đã hỏng và ./build/ đang rỗng. Chuyện gì xảy ra?',
            options: [
              'rsync refuses to sync an empty source|||rsync từ chối đồng bộ một nguồn rỗng',
              'Nothing is transferred and the server is left unchanged|||Không có gì được truyền và máy chủ giữ nguyên',
              'rsync makes the destination match the source — it empties /srv/app/ — and reports success. Guard with a non-empty check and --max-delete|||rsync làm cho đích khớp với nguồn — nó dọn sạch /srv/app/ — và báo cáo thành công. Hãy chốt bằng một phép kiểm khác-rỗng và --max-delete',
              '--delete only removes files older than the source|||--delete chỉ gỡ những file cũ hơn ở nguồn',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'ufw says port 3306 is blocked, but a container started with -p 3306:3306 is reachable from the internet. Why?|||ufw nói cổng 3306 bị chặn, nhưng một container khởi động bằng -p 3306:3306 lại với tới được từ internet. Vì sao?',
            options: [
              'ufw needs to be restarted after Docker starts|||ufw cần được khởi động lại sau khi Docker chạy',
              'Docker writes rules in the nat table that are evaluated BEFORE the filter chain ufw manages — publish to 127.0.0.1 instead|||Docker ghi luật vào bảng nat, và bảng đó được xét TRƯỚC chuỗi filter mà ufw quản lý — hãy công bố ra 127.0.0.1 thay vào',
              'ufw does not manage ports above 1024|||ufw không quản những cổng trên 1024',
              'The container has its own firewall that overrides the host|||Container có tường lửa riêng đè lên tường lửa của máy chủ',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
