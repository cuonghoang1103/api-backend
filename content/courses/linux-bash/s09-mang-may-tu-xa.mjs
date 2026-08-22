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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
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
<a class="link-card codelab" href="/code-lab/linux-bash\${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: viết một phép kiểm sức khoẻ</span><span class="lc-sub">Bài chấm điểm: dùng <code>-w</code> để lấy mã trạng thái, rẽ nhánh theo mã thoát của curl, đặt thời gian chờ hợp lý, và kiểm một vhost bằng <code>--resolve</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>curl -k</code> (hay <code>--insecure</code>) để "chữa" một lỗi chứng chỉ. Nó tắt hẳn việc xác minh, nên kết nối vẫn được mã hoá nhưng bạn KHÔNG BIẾT mình đang nói chuyện với ai — mà đó mới là phần có ý nghĩa. Thông báo lỗi đang nói với bạn một điều có thật: chứng chỉ hết hạn, thiếu chứng chỉ trung gian, sai tên máy, hoặc một proxy đang chặn giữa TLS. <code>curl -v</code> gọi tên xem là cái nào trong ba dòng. Chỉ với tay lấy <code>-k</code> khi đối tượng là một chứng chỉ tự ký do chính bạn tạo ra, và đừng bao giờ để nó nằm lại trong một script có đụng tới production, vì nó sẽ vẫn nằm đó rất lâu sau khi vấn đề gốc đã bị quên.</div>
<p class="note-ct"><strong>Hãy xây phản xạ cho <code>curl -sSfL</code>.</strong> Im lặng nhưng vẫn báo lỗi; hỏng khi gặp lỗi HTTP thay vì lưu chúng lại làm dữ liệu; đi theo chuyển hướng. Thêm <code>--max-time</code> vào mọi thứ chạy tự động, và <code>-o /dev/null -w '%{http_code}'</code> mỗi khi bạn muốn CÂU TRẢ LỜI chứ không muốn cái trang. Bốn thói quen đó biến curl từ một thứ thường thì chạy được thành một thứ mà script tin được.</p>
</div>
`,
    },
  ],
};
