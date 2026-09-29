/**
 * Linux & Bash — Chương 9: Mạng & máy từ xa.
 * Ngăn xếp mạng nhìn từ shell · curl · SSH · chuyển file · tường lửa và chẩn đoán · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 * Nâng cấp 28/09/2026: bài 9.0 slide (deck lx-09, 32 slide) + slide/🧪/🗂/📌 trong 9.1–9.5; đào sâu: đọc ss từng cột,
 * dig/host/nslookup/getent (dig thoát 0 khi NXDOMAIN), mạng trường chặn 1.1.1.1, curl -w đo DNS→TCP→TLS→HTTP,
 * bẫy $? trong nhánh then của if ! (đã sửa), -w in 000 (đã sửa), Match exec + "giá trị đầu tiên thắng" của ssh_config,
 * ba đường hầm đo giữa container, sshd 01- vs 99- (đã sửa tên file mẫu), ssh vps 'job &' đo thật, --max-delete,
 * itemize < với > (đã sửa), ufw/firewalld/nftables, DROP vs REJECT, ssh.socket; quiz 10 câu. Output MỚI chạy thật
 * trong container ubuntu:24.04 (arm64), trên Fedora 44 và Mac M1 (macOS 27).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 9 — Networking & remote machines|||Chương 9 — Mạng & máy từ xa',
  description: 'ss, ip, curl, dig, ssh, scp, rsync — và cách đọc một cái tường lửa. Chương này dạy bạn trả lời câu "vì sao không kết nối được" theo từng tầng, thay vì thử ngẫu nhiên cho tới khi có gì đó chạy.',
  lessons: [
    /* ─────────────────────────── 9.0 ─────────────────────────── */
    {
      title: '9.0 — Chapter 9 slides: networks, SSH and firewalls in pictures|||9.0 — Slide Chương 9: mạng, SSH và tường lửa bằng hình',
      slug: 'lnx-9-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 9: thang 4 bậc chẩn đoán, ip/ss đọc từng cột, 127.0.0.1 với 0.0.0.0, đường đi DNS và dig/host/nslookup/getent, curl -w đo DNS→TCP→TLS→HTTP, khoá SSH, Match exec, đường hầm -L/-R/-D, sshd "giá trị đầu tiên thắng", rsync, tcpdump, ufw/firewalld/nftables và ssh.socket.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the four-rung diagnostic ladder, <code>ss</code> read column by column, the path of a DNS question measured with <code>dig +trace</code>, one HTTPS request split into DNS, TCP, TLS and server time with <code>curl -w</code>, SSH keys and tunnels drawn between three real machines, and what <code>tcpdump</code> shows when a firewall drops or rejects a packet.</p>
<p>Slides 3–8 belong to Lesson 9.1, 9–12 to 9.2, 13–19 to 9.3 (SSH, including the school-network <code>Match exec</code> story and the <code>sshd</code> first-value-wins rule), 20–23 to 9.4 and 24–27 to 9.5 (including Ubuntu 24.04's <code>ssh.socket</code>). The last five are the chapter's common mistakes, an Ubuntu/Fedora/macOS/WSL comparison, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 28/09/2026 — in Ubuntu 24.04 containers wired into a small private network (laptop, VPS and a database host that only the VPS can reach), on a Fedora 44 machine, and on a Mac on a university network. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: cái thang chẩn đoán bốn bậc, <code>ss</code> đọc từng cột, đường đi của một câu hỏi DNS đo bằng <code>dig +trace</code>, một request HTTPS tách thành DNS, TCP, TLS và thời gian máy chủ bằng <code>curl -w</code>, khoá và đường hầm SSH vẽ giữa ba cái máy thật, và thứ <code>tcpdump</code> cho thấy khi tường lửa vứt hay từ chối một gói tin.</p>
<p>Slide 3–8 thuộc Bài 9.1, 9–12 thuộc 9.2, 13–19 thuộc 9.3 (SSH, gồm câu chuyện <code>Match exec</code> ở mạng trường và luật "giá trị đầu tiên thắng" của <code>sshd</code>), 20–23 thuộc 9.4 và 24–27 thuộc 9.5 (gồm <code>ssh.socket</code> của Ubuntu 24.04). Năm slide cuối là những sai lầm hay gặp, bảng so sánh Ubuntu/Fedora/macOS/WSL, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 28/09/2026 — trong các container Ubuntu 24.04 nối thành một mạng riêng nhỏ (laptop, VPS và một máy cơ sở dữ liệu chỉ VPS mới với tới được), trên máy Fedora 44, và trên một chiếc Mac đang ở mạng trường đại học — con số trên máy bạn sẽ khác, quy luật thì không.</p>
</div>
${gallery('lx-09', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Thang 4 bậc chẩn đoán'], [4, 'ip thay ifconfig'], [5, 'ss -tlnp: đọc từng cột'],
  [6, '127.0.0.1 so với 0.0.0.0'], [7, 'Đường đi của một câu hỏi DNS'], [8, 'dig · host · nslookup · getent'],
  [9, 'DNS → TCP → TLS → chờ máy chủ'], [10, 'curl -v: * > <'], [11, 'Mã thoát 6 · 7 · 22 · 28'], [12, 'Bẫy $? trong if !'],
  [13, 'Khoá công khai / bí mật'], [14, 'ssh-keygen, ssh-copy-id, quyền'], [15, '~/.ssh/config và ControlMaster'],
  [16, 'Match exec: mạng trường chặn cổng 22'], [17, 'Đường hầm -L -R -D và ProxyJump'], [18, 'sshd: giá trị đầu tiên thắng'],
  [19, 'Câu lỗi SSH và việc chết theo phiên'],
  [20, 'rsync: dấu / cuối nguồn'], [21, 'Bảng cờ rsync và --itemize-changes'], [22, '--delete + nguồn rỗng, --max-delete'], [23, 'scp · rsync · tar · sftp'],
  [24, 'tcpdump ở từng tầng'], [25, 'ufw · firewalld · nftables'], [26, 'DROP và REJECT; Docker vượt mặt ufw'], [27, 'Ubuntu 24.04: ssh.socket'],
  [28, 'Sai lầm hay gặp'], [29, 'Ubuntu · Fedora · macOS · WSL'], [30, 'Bảng tra nhanh (1/2)'], [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 9'],
])}
`,
    },
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
${slide('lx-09', 4, 'ip thay ifconfig: địa chỉ, giao diện, tuyến mặc định')}
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
${slide('lx-09', 5, 'ss -tlnp: đọc từng cột')}
<pre><code>sudo ss -tulpn               <span class="tok-comment"># the one command to memorise</span></code></pre>
<div class="out">Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
tcp   LISTEN 0      200        127.0.0.1:5432       0.0.0.0:*    users:(("postgres",pid=901,fd=5))
tcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=812,fd=6))
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=743,fd=3))
tcp   LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=5012,fd=21))</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-t</code> <code>-u</code></span><span class="v">TCP · UDP. Almost always you want both.</span></div>
  <div class="kv"><span class="k"><code>-l</code></span><span class="v">Only listening sockets. Drop it to see established connections too.</span></div>
  <div class="kv"><span class="k"><code>-p</code></span><span class="v">Which process — needs <code>sudo</code> to see other users' sockets. This is the column that answers "what is on port 3000".</span></div>
  <div class="kv"><span class="k"><code>-n</code></span><span class="v">Numeric: do not resolve port names or hostnames. Faster, and it shows you <code>:80</code> rather than <code>:http</code>.</span></div>
</div>
<h3>Reading ss column by column</h3>
<p>The output above is easy to skim past, so here is a real one from an Ubuntu 24.04 container, with two small web servers started on purpose — one on loopback, one on every interface:</p>
<pre><code>python3 -m http.server 19090 --bind 127.0.0.1 &amp;
python3 -m http.server 19091 --bind 0.0.0.0 &amp;
ss -tlnp</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      4096      127.0.0.11:33037      0.0.0.0:*
LISTEN 0      5            0.0.0.0:19091      0.0.0.0:*    users:(("python3",pid=2634,fd=3))
LISTEN 0      5          127.0.0.1:19090      0.0.0.0:*    users:(("python3",pid=2628,fd=3))</div>
<table>
<tr><th>Column</th><th>What it means for a LISTEN line</th><th>What to look for</th></tr>
<tr><td><code>State</code></td><td><code>LISTEN</code> = waiting for connections; <code>ESTAB</code> = a live connection</td><td><code>-l</code> shows only LISTEN</td></tr>
<tr><td><code>Recv-Q</code></td><td>connections that finished the handshake but the program has not <code>accept()</code>ed yet</td><td>a number that keeps growing = the app is stuck or overloaded</td></tr>
<tr><td><code>Send-Q</code></td><td>the backlog — the maximum length of that queue (python: 5, nginx/node: 511)</td><td>Recv-Q close to Send-Q = new connections will be dropped</td></tr>
<tr><td><code>Local Address:Port</code></td><td>the address the socket is <strong>bound</strong> to, then the port</td><td>the most important column: <code>127.0.0.1</code> vs <code>0.0.0.0</code></td></tr>
<tr><td><code>Peer Address:Port</code></td><td><code>0.0.0.0:*</code> = any client from anywhere</td><td>on an ESTAB line it is the other end</td></tr>
<tr><td><code>Process</code></td><td>name, PID and file descriptor of the owner (needs <code>-p</code>, and <code>sudo</code> for other users)</td><td>empty = you lack permission, or the socket belongs to something outside your view</td></tr>
</table>
<p>The first line has no process at all: <code>127.0.0.11</code> is Docker's built-in DNS server, which serves the container but does not run as a process inside it. On an <code>ESTAB</code> listing, one TCP connection between two programs on the same machine shows up as <strong>two</strong> lines — one per end — which surprises everyone the first time (<code>ss</code> itself appears too: it inherited the shell's descriptor 3):</p>
<pre><code>exec 3&lt;&gt;/dev/tcp/127.0.0.1/19091     <span class="tok-comment"># open a connection from this shell</span>
ss -tanp state established</code></pre>
<div class="out">Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
0      0          127.0.0.1:57222    127.0.0.1:19091 users:(("ss",pid=50,fd=3),("bash",pid=38,fd=3))
0      0          127.0.0.1:19091    127.0.0.1:57222 users:(("python3",pid=45,fd=4))</div>
<p>Filters are written in <code>ss</code>'s own little language and saved typing <code>grep</code>: <code>ss -tlnp "sport = :19090"</code> (source port), <code>ss -tn "dport = :443"</code> (destination), <code>ss -tn state established "( sport = :22 )"</code> (who is SSHed in right now). <code>ss -s</code> prints totals, which is the quick way to notice thousands of <code>timewait</code> sockets after a load test.</p>
<pre><code>sudo ss -tulpn | grep :3000          <span class="tok-comment"># what holds this port</span>
ss -tan state established            <span class="tok-comment"># current connections</span>
ss -tan state established '( dport = :443 )' | wc -l   <span class="tok-comment"># how many to HTTPS</span>
sudo ss -tp | grep nginx             <span class="tok-comment"># everything one process has open</span></code></pre>
<div class="callout ok"><code>sudo ss -tulpn</code> is the answer to "address already in use", and it beats rebooting by a wide margin: it names the PID, so you can decide whether that process should be stopped (Lesson 5.3) or whether you picked the wrong port. It is the single most useful networking command on a server.</div>

<h3>127.0.0.1 versus 0.0.0.0 — the distinction that costs hours</h3>
${slide('lx-09', 6, '127.0.0.1 chỉ nghe trong máy')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">127.0.0.1:3000</span><span class="lz-t">reachable ONLY from this machine</span><span class="lz-d">Loopback only. Perfect for a database or an app sitting behind a reverse proxy. Unreachable from another host no matter what the firewall says.</span></div>
  <div class="lz-step"><span class="lz-k">0.0.0.0:3000</span><span class="lz-t">reachable on EVERY interface</span><span class="lz-d">Including the public one. Correct for nginx on 80/443; a mistake for an app with no authentication.</span></div>
  <div class="lz-step"><span class="lz-k">203.0.113.42:3000</span><span class="lz-t">only on that one address</span><span class="lz-d">Used when a machine has several interfaces and the service should answer on just one.</span></div>
  <div class="lz-step"><span class="lz-k">In a container</span><span class="lz-t">127.0.0.1 means the CONTAINER's loopback</span><span class="lz-d">An app binding 127.0.0.1 inside a container is unreachable even from the host, because the container has its own network namespace. Bind 0.0.0.0 inside, and publish narrowly with -p 127.0.0.1:3000:3000.</span></div>
</div>
<pre><code><span class="tok-comment"># Look at the address, not just the port</span>
sudo ss -tulpn | awk '\$5 ~ /:3000\$/'</code></pre>
<div class="out">tcp   LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=5012,fd=21))</div>
<p>The service is up, the firewall is open, and the connection from outside still fails — because it is bound to loopback. <code>curl localhost:3000</code> on the machine succeeds and proves nothing. The container version of this is the same mistake one layer down, and it is the most common reason a Dockerised app "starts fine but is not reachable".</p>
<div class="callout warn">The inverse is a security problem. A development database started with <code>--bind 0.0.0.0</code> or an app listening on <code>0.0.0.0:5432</code> on a cloud VPS is exposed to the entire internet the moment the provider's firewall is permissive. <code>sudo ss -tulpn | grep '0.0.0.0'</code> on a server you inherit is a thirty-second audit worth doing.</div>

<h3>DNS: dig, and where the answer came from</h3>
${slide('lx-09', 7, 'Đường đi của một câu hỏi DNS')}
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
<pre><code class="language-bash">resolvectl status | head -20         <span class="tok-comment"># systemd-resolved: the real config</span>
cat /etc/resolv.conf                 <span class="tok-comment"># often just points at 127.0.0.53</span>
resolvectl flush-caches              <span class="tok-comment"># clear the local cache</span>
getent hosts cuongthai.com           <span class="tok-comment"># resolve the way APPLICATIONS do</span></code></pre>
<div class="callout warn"><code>dig</code> talks to a DNS server directly; applications go through the C library, which also reads <code>/etc/hosts</code> and follows <code>/etc/nsswitch.conf</code>. So <code>dig</code> and your app can legitimately disagree — most often because someone left an entry in <code>/etc/hosts</code>. <code>getent hosts &lt;name&gt;</code> follows the same path an application does, and comparing the two answers tells you immediately which layer is lying.</div>

<h3>dig, host, nslookup and getent side by side</h3>

${slide('lx-09', 8, 'dig · host · nslookup · getent')}
<p>Four commands answer "what IP does this name have", and they do not ask the same question. <code>dig</code>, <code>host</code> and <code>nslookup</code> all talk straight to a DNS server; <code>getent</code> asks the C library exactly the way <code>curl</code>, Node or Python do, which means it reads <code>/etc/hosts</code> first (the <code>hosts: files dns</code> line in <code>/etc/nsswitch.conf</code>). On Ubuntu, <code>dig</code>, <code>host</code> and <code>nslookup</code> come from the <code>dnsutils</code> package (<code>bind-utils</code> on Fedora); macOS ships all three; Windows has only <code>nslookup</code>.</p>
<table>
<tr><th>Command</th><th>Asks</th><th>Reads /etc/hosts?</th><th>Exit status when the name does not exist</th><th>Use it for</th></tr>
<tr><td><code>dig +short name</code></td><td>a DNS server directly</td><td>no</td><td><strong>0</strong> — the NXDOMAIN is only in the text</td><td>detail: TTL, record types, <code>@server</code>, <code>+trace</code></td></tr>
<tr><td><code>host name</code></td><td>a DNS server directly</td><td>no</td><td>1</td><td>a short readable answer (A, AAAA and MX at once)</td></tr>
<tr><td><code>nslookup name</code></td><td>a DNS server directly</td><td>no</td><td>1</td><td>the one command that also exists on Windows</td></tr>
<tr><td><code>getent hosts name</code></td><td>the C library (nsswitch)</td><td><strong>yes, first</strong></td><td>2</td><td>"what will my app actually connect to?"</td></tr>
</table>
<pre><code>host example.com
nslookup example.com
dig +short khong-ton-tai-lx09.example; echo "dig: \$?"
host khong-ton-tai-lx09.example;      echo "host: \$?"
getent hosts khong-ton-tai-lx09.example; echo "getent: \$?"</code></pre>
<div class="out">example.com has address 104.20.23.154
example.com has address 172.66.147.243
example.com mail is handled by 0 .
Server:		127.0.0.11
Address:	127.0.0.11#53

Non-authoritative answer:
Name:	example.com
Address: 104.20.23.154
Name:	example.com
Address: 172.66.147.243

dig: 0
Host khong-ton-tai-lx09.example not found: 3(NXDOMAIN)
host: 1
getent: 2</div>
<div class="callout warn"><strong><code>dig</code> exits 0 even when the name does not exist</strong> (measured on Ubuntu 24.04, BIND 9.18.39): for <code>dig</code>, getting <em>an answer</em> is success, and "no such name" is an answer. A script that checks DNS with <code>dig +short "\$host" &gt;/dev/null &amp;&amp; echo ok</code> prints ok for every typo. Test that the output is non-empty, or use <code>getent</code>/<code>host</code>, whose exit status means what you expect.</div>
<p>And the case that sends people in circles — a leftover line in <code>/etc/hosts</code>, reproduced in a container:</p>
<pre><code class="language-bash">echo "10.9.9.9 example.com" &gt;&gt; /etc/hosts
getent hosts example.com
dig +short example.com
curl -sS -m 3 -o /dev/null http://example.com</code></pre>
<div class="out">10.9.9.9        example.com
104.20.23.154
172.66.147.243
curl: (28) Connection timed out after 3002 milliseconds</div>
<p><code>dig</code> says everything is fine; <code>curl</code> goes to 10.9.9.9 and times out, because it reads <code>/etc/hosts</code> first. Removing the line in a container has one more trap: <code>sed -i '/10.9.9.9/d' /etc/hosts</code> fails with <code>sed: cannot rename /etc/sedXXXXXX: Device or resource busy</code>, because Docker bind-mounts <code>/etc/hosts</code> as a single file and <code>sed -i</code> works by writing a new file and renaming it over the old one. Write in place instead: <code>grep -v 10.9.9.9 /etc/hosts &gt; /tmp/h &amp;&amp; cat /tmp/h &gt; /etc/hosts</code>. It is the same inode lesson as a bind-mounted <code>nginx.conf</code>.</p>


<h3>Testing connectivity, layer by layer</h3>
${slide('lx-09', 3, 'Thang 4 bậc: bậc đầu tiên hỏng gọi tên tầng')}
<pre><code class="language-bash">ping -c3 1.1.1.1                     <span class="tok-comment"># 1. is the network up at all?</span>
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

<div class="callout">A measured caveat for rung 1, from a university network on 28/09/2026: every packet to <code>1.1.1.1</code> was blocked — <code>ping -c2 1.1.1.1</code> lost 100%, <code>dig @1.1.1.1 example.com</code> ended with <code>connection timed out; no servers could be reached</code> (exit 9) — while <code>ping -c2 example.com</code> got replies in ~58 ms and every website opened. A failing first rung on a managed network (school, company, café) often means "this destination is filtered", not "the network is down". Try a second target — the default gateway from <code>ip route</code>, or the site itself — before concluding anything.</div>

<h3>A few more tools worth having</h3>
<pre><code class="language-bash">nc -zv host 22                       <span class="tok-comment"># port check, no data sent</span>
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

<h3>Try it step by step</h3>
<p>Two throw-away Ubuntu containers on a private Docker network are enough to reproduce the most common "it is running but I cannot reach it" in five minutes. Run these on your own machine (Docker Desktop on Mac/Windows, or Docker on Linux):</p>
<pre><code class="language-bash">docker network create lx09-net
docker run -d --name lx09-srv --network lx09-net ubuntu:24.04 sleep infinity
docker run -d --name lx09-cli --network lx09-net ubuntu:24.04 sleep infinity
docker exec lx09-srv bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq python3 iproute2 &gt;/dev/null 2&gt;&amp;1'
docker exec lx09-cli bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq curl netcat-openbsd dnsutils &gt;/dev/null 2&gt;&amp;1'
docker exec -d lx09-srv python3 -m http.server 19090 --bind 127.0.0.1
docker exec -d lx09-srv python3 -m http.server 19091
docker exec lx09-srv ss -tlnp
docker exec lx09-cli getent hosts lx09-srv
docker exec lx09-cli nc -zv lx09-srv 19090
docker exec lx09-cli nc -zv lx09-srv 19091
docker exec lx09-cli curl -sS -o /dev/null -w '%{http_code}\\n' http://lx09-srv:19091/</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      4096      127.0.0.11:33037      0.0.0.0:*
LISTEN 0      5            0.0.0.0:19091      0.0.0.0:*    users:(("python3",pid=2634,fd=3))
LISTEN 0      5          127.0.0.1:19090      0.0.0.0:*    users:(("python3",pid=2628,fd=3))
172.21.0.6      lx09-srv
nc: connect to lx09-srv (172.21.0.6) port 19090 (tcp) failed: Connection refused
Connection to lx09-srv (172.21.0.6) 19091 port [tcp/*] succeeded!
200</div>
<p>Read it as the ladder: the name resolves (Docker's DNS gives <code>172.21.0.6</code>), port 19090 is <em>refused</em> — the machine answered "nobody here", because the server is bound to its own loopback — and 19091, bound to <code>0.0.0.0</code>, answers 200. Clean up with <code>docker rm -f lx09-srv lx09-cli &amp;&amp; docker network rm lx09-net</code>.</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Task</th><th>Ubuntu / WSL2</th><th>macOS (measured on macOS 27)</th></tr>
<tr><td>Addresses, routes</td><td><code>ip -br a</code>, <code>ip route</code></td><td>no <code>ip</code>: <code>ifconfig en0</code>, <code>route -n get default</code>, <code>ipconfig getifaddr en0</code></td></tr>
<tr><td>What is listening</td><td><code>ss -tlnp</code></td><td>no <code>ss</code>: <code>lsof -nP -iTCP -sTCP:LISTEN</code> or <code>netstat -an -p tcp | grep LISTEN</code></td></tr>
<tr><td>DNS configuration</td><td><code>resolvectl status</code></td><td><code>scutil --dns</code>; resolve like an app: <code>dscacheutil -q host -a name example.com</code> (there is no <code>getent</code>)</td></tr>
<tr><td><code>dig</code> / <code>host</code> / <code>nslookup</code></td><td><code>apt install dnsutils</code></td><td>preinstalled</td></tr>
<tr><td>ping timeout</td><td><code>ping -W 2</code> (<code>-t</code> is the TTL)</td><td><code>ping -t 3</code> (<code>-t</code> is the timeout)</td></tr>
<tr><td><code>timeout 3 bash -c 'echo &gt; /dev/tcp/…'</code></td><td>works</td><td>no <code>timeout</code> command; use <code>nc -z -G 3 host port</code></td></tr>
</table>
<p>Two Mac surprises measured while writing this lesson: <code>lsof</code> shows <code>ControlCe</code> (Control Center, the AirPlay Receiver) listening on <code>*:5000</code> and <code>*:7000</code> — so a Flask or Express app on port 5000 fails with "address already in use" until you turn AirPlay Receiver off or pick another port. And <code>scutil --dns</code> is the place to see that a school network hands you its own resolver, which is why <code>dig @1.1.1.1</code> can time out there. On WSL2 the Linux side has its own interface and its own <code>/etc/resolv.conf</code> (generated by WSL unless you set <code>generateResolvConf = false</code> in <code>/etc/wsl.conf</code>); <code>ip</code>, <code>ss</code> and <code>dig</code> behave exactly as on Ubuntu, but they describe the WSL virtual machine, not Windows.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate on your SWP391 project says "the API is running, but the phone app cannot reach it". Reproduce it and name the layer, using the two containers from "Try it step by step".</p><ol>
<li>On <code>lx09-srv</code>, start <code>python3 -m http.server 19090 --bind 127.0.0.1</code>. From <code>lx09-cli</code>, climb the ladder: <code>getent hosts lx09-srv</code>, <code>nc -zv lx09-srv 19090</code>, then <code>curl -sS -o /dev/null -w '%{http_code}\\n' http://lx09-srv:19090/; echo "exit=\$?"</code>. Write down which rung fails first and curl's exit code.</li>
<li>On the server, find the cause with <code>ss -tlnp</code> and point at the exact column that proves it.</li>
<li>Restart the server bound to <code>0.0.0.0</code> and repeat step 1 until you get <code>200</code>.</li>
<li>On the client, add a wrong line with <code>echo "10.9.9.9 lx09-srv" &gt;&gt; /etc/hosts</code>, compare <code>getent hosts lx09-srv</code> with <code>dig +short lx09-srv</code>, then remove the line <em>in place</em> with <code>grep -v 10.9.9.9 /etc/hosts &gt; /tmp/h &amp;&amp; cat /tmp/h &gt; /etc/hosts</code>.</li></ol>
<p><strong>Done when:</strong> you can say "rung 3 failed, curl exit 7, because the Local Address column showed <code>127.0.0.1:19090</code>", step 3 prints <code>200</code>, and in step 4 <code>getent</code> showed 10.9.9.9 while <code>dig</code> did not.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Interface</span><span class="v">A network card, real or virtual (<code>eth0</code>, <code>lo</code>, <code>docker0</code>), each with its own addresses.</span></div>
  <div class="kv"><span class="k">Loopback</span><span class="v">The interface <code>lo</code> / <code>127.0.0.1</code>: traffic that never leaves the machine.</span></div>
  <div class="kv"><span class="k">Default route / gateway</span><span class="v">Where packets go when no more specific route matches — the way out to the internet.</span></div>
  <div class="kv"><span class="k">Socket, bind, listen</span><span class="v">A program's network endpoint; binding picks the address and port; listening waits for connections.</span></div>
  <div class="kv"><span class="k">Backlog (Send-Q on LISTEN)</span><span class="v">How many finished handshakes may wait for the program to accept them.</span></div>
  <div class="kv"><span class="k">Resolver</span><span class="v">The DNS server your machine asks; it answers from cache or by walking root → TLD → authoritative server.</span></div>
  <div class="kv"><span class="k">NXDOMAIN</span><span class="v">The DNS answer "this name does not exist".</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">How many seconds a DNS answer may be cached — why a change "has not taken effect yet".</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Cannot connect" is four different problems; climb ping IP → ping name → <code>nc -z</code> → <code>curl</code> and the first failing rung names the layer.</li>
<li><code>ip</code> and <code>ss</code> replace <code>ifconfig</code> and <code>netstat</code>; the default route line is your way out.</li>
<li>In <code>ss -tlnp</code>, the Local Address column matters more than the port: <code>127.0.0.1</code> can never be reached from another machine.</li>
<li><code>dig</code>, <code>host</code> and <code>nslookup</code> ask DNS directly; only <code>getent</code> follows <code>/etc/hosts</code> like your app — and <code>dig</code> exits 0 even for a missing name.</li>
<li>A failing ping on a filtered network is not proof the network is down; try a second destination.</li>
<li>On a Mac use <code>lsof -nP -iTCP -sTCP:LISTEN</code> and <code>scutil --dns</code>; port 5000 may already belong to AirPlay.</li>
</ul>

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
${slide('lx-09', 4, 'ip thay ifconfig: địa chỉ, giao diện, tuyến mặc định')}
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
${slide('lx-09', 5, 'ss -tlnp: đọc từng cột')}
<pre><code>sudo ss -tulpn               <span class="tok-comment"># lệnh duy nhất cần học thuộc</span></code></pre>
<div class="out">Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
tcp   LISTEN 0      200        127.0.0.1:5432       0.0.0.0:*    users:(("postgres",pid=901,fd=5))
tcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=812,fd=6))
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=743,fd=3))
tcp   LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=5012,fd=21))</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-t</code> <code>-u</code></span><span class="v">TCP · UDP. Gần như lúc nào bạn cũng muốn cả hai.</span></div>
  <div class="kv"><span class="k"><code>-l</code></span><span class="v">Chỉ những socket đang lắng nghe. Bỏ nó đi để thấy cả các kết nối đã thiết lập.</span></div>
  <div class="kv"><span class="k"><code>-p</code></span><span class="v">Tiến trình nào — cần <code>sudo</code> mới thấy socket của người dùng khác. Đây là cột trả lời câu "cái gì đang nằm trên cổng 3000".</span></div>
  <div class="kv"><span class="k"><code>-n</code></span><span class="v">Theo số: đừng phân giải tên cổng hay tên máy. Nhanh hơn, và nó cho bạn thấy <code>:80</code> thay vì <code>:http</code>.</span></div>
</div>
<h3>Đọc ss từng cột một</h3>
<p>Output ở trên rất dễ lướt qua, nên đây là một output thật từ container Ubuntu 24.04, với hai web server nhỏ khởi động có chủ ý — một cái trên loopback, một cái trên mọi giao diện:</p>
<pre><code>python3 -m http.server 19090 --bind 127.0.0.1 &amp;
python3 -m http.server 19091 --bind 0.0.0.0 &amp;
ss -tlnp</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      4096      127.0.0.11:33037      0.0.0.0:*
LISTEN 0      5            0.0.0.0:19091      0.0.0.0:*    users:(("python3",pid=2634,fd=3))
LISTEN 0      5          127.0.0.1:19090      0.0.0.0:*    users:(("python3",pid=2628,fd=3))</div>
<table>
<tr><th>Cột</th><th>Nghĩa với một dòng LISTEN</th><th>Cần nhìn gì</th></tr>
<tr><td><code>State</code></td><td><code>LISTEN</code> = đang chờ kết nối; <code>ESTAB</code> = một kết nối đang sống</td><td><code>-l</code> chỉ hiện LISTEN</td></tr>
<tr><td><code>Recv-Q</code></td><td>số kết nối đã bắt tay xong nhưng chương trình chưa <code>accept()</code> (nhận vào)</td><td>một con số cứ tăng mãi = ứng dụng đang kẹt hoặc quá tải</td></tr>
<tr><td><code>Send-Q</code></td><td>backlog (hàng chờ) — độ dài tối đa của hàng đợi đó (python: 5, nginx/node: 511)</td><td>Recv-Q sát Send-Q = kết nối mới sẽ bị rớt</td></tr>
<tr><td><code>Local Address:Port</code></td><td>địa chỉ mà socket được <strong>gắn</strong> (bind) vào, rồi tới cổng</td><td>cột quan trọng nhất: <code>127.0.0.1</code> hay <code>0.0.0.0</code></td></tr>
<tr><td><code>Peer Address:Port</code></td><td><code>0.0.0.0:*</code> = bất kỳ trình khách nào, từ bất cứ đâu</td><td>ở dòng ESTAB thì đây là đầu bên kia</td></tr>
<tr><td><code>Process</code></td><td>tên, PID và số file descriptor của chủ sở hữu (cần <code>-p</code>, và <code>sudo</code> nếu là của người khác)</td><td>trống = bạn thiếu quyền, hoặc socket thuộc về thứ nằm ngoài tầm nhìn của bạn</td></tr>
</table>
<p>Dòng đầu tiên không có tiến trình nào: <code>127.0.0.11</code> là máy chủ DNS dựng sẵn của Docker, nó phục vụ container nhưng không chạy như một tiến trình bên trong container. Còn khi liệt kê <code>ESTAB</code>, một kết nối TCP giữa hai chương trình trên cùng một máy hiện thành <strong>HAI</strong> dòng — mỗi đầu một dòng — điều làm ai cũng bất ngờ lần đầu (chính <code>ss</code> cũng hiện ra: nó thừa kế descriptor 3 của shell):</p>
<pre><code>exec 3&lt;&gt;/dev/tcp/127.0.0.1/19091     <span class="tok-comment"># mở một kết nối từ chính shell này</span>
ss -tanp state established</code></pre>
<div class="out">Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
0      0          127.0.0.1:57222    127.0.0.1:19091 users:(("ss",pid=50,fd=3),("bash",pid=38,fd=3))
0      0          127.0.0.1:19091    127.0.0.1:57222 users:(("python3",pid=45,fd=4))</div>
<p>Bộ lọc được viết bằng ngôn ngữ nhỏ của riêng <code>ss</code>, đỡ phải gõ <code>grep</code>: <code>ss -tlnp "sport = :19090"</code> (cổng nguồn), <code>ss -tn "dport = :443"</code> (cổng đích), <code>ss -tn state established "( sport = :22 )"</code> (ai đang SSH vào ngay lúc này). <code>ss -s</code> in ra các con số tổng, cách nhanh để nhận ra hàng nghìn socket <code>timewait</code> sau một lần thử tải.</p>
<pre><code>sudo ss -tulpn | grep :3000          <span class="tok-comment"># cái gì đang giữ cổng này</span>
ss -tan state established            <span class="tok-comment"># các kết nối hiện tại</span>
ss -tan state established '( dport = :443 )' | wc -l   <span class="tok-comment"># bao nhiêu kết nối tới HTTPS</span>
sudo ss -tp | grep nginx             <span class="tok-comment"># mọi thứ một tiến trình đang mở</span></code></pre>
<div class="callout ok"><code>sudo ss -tulpn</code> chính là câu trả lời cho lỗi "address already in use", và nó hơn hẳn việc khởi động lại máy: nó gọi tên PID, nên bạn quyết định được là có nên dừng tiến trình đó không (Bài 5.3) hay là mình chọn nhầm cổng. Đây là lệnh mạng hữu ích nhất trên một máy chủ.</div>

<h3>127.0.0.1 so với 0.0.0.0 — chỗ phân biệt tốn hàng giờ</h3>
${slide('lx-09', 6, '127.0.0.1 chỉ nghe trong máy')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">127.0.0.1:3000</span><span class="lz-t">CHỈ với tới được từ chính máy này</span><span class="lz-d">Chỉ loopback. Hoàn hảo cho một cơ sở dữ liệu hay một ứng dụng nằm sau một proxy ngược. Không với tới được từ máy khác, bất kể tường lửa nói gì.</span></div>
  <div class="lz-step"><span class="lz-k">0.0.0.0:3000</span><span class="lz-t">với tới được trên MỌI giao diện</span><span class="lz-d">Kể cả giao diện công khai. Đúng cho nginx trên 80/443; là sai lầm với một ứng dụng không có xác thực.</span></div>
  <div class="lz-step"><span class="lz-k">203.0.113.42:3000</span><span class="lz-t">chỉ trên đúng một địa chỉ đó</span><span class="lz-d">Dùng khi một máy có nhiều giao diện và dịch vụ chỉ nên trả lời trên một cái.</span></div>
  <div class="lz-step"><span class="lz-k">Bên trong container</span><span class="lz-t">127.0.0.1 nghĩa là loopback CỦA CONTAINER</span><span class="lz-d">Một ứng dụng gắn vào 127.0.0.1 bên trong container thì ngay cả máy chủ cũng không với tới, vì container có không gian tên mạng riêng. Hãy gắn 0.0.0.0 bên trong, rồi công bố một cách hẹp bằng -p 127.0.0.1:3000:3000.</span></div>
</div>
<pre><code><span class="tok-comment"># Hãy nhìn ĐỊA CHỈ, không chỉ nhìn cổng</span>
sudo ss -tulpn | awk '\$5 ~ /:3000\$/'</code></pre>
<div class="out">tcp   LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=5012,fd=21))</div>
<p>Dịch vụ đang chạy, tường lửa đang mở, mà kết nối từ bên ngoài vẫn hỏng — vì nó gắn vào loopback. Lệnh <code>curl localhost:3000</code> chạy trên chính máy đó thì thành công và chẳng chứng minh được gì. Phiên bản container của chuyện này là đúng sai lầm ấy lùi thêm một tầng, và nó là lý do phổ biến nhất khiến một ứng dụng đóng gói Docker "khởi động ngon lành mà không với tới được".</p>
<div class="callout warn">Chiều ngược lại là một vấn đề an ninh. Một cơ sở dữ liệu dùng để phát triển khởi động với <code>--bind 0.0.0.0</code>, hay một ứng dụng lắng nghe trên <code>0.0.0.0:5432</code> ở một VPS đám mây, là bị phơi ra cả internet ngay khoảnh khắc tường lửa của nhà cung cấp dễ dãi. Chạy <code>sudo ss -tulpn | grep '0.0.0.0'</code> trên một máy chủ bạn tiếp quản là một phép rà soát ba mươi giây rất đáng làm.</div>

<h3>DNS: dig, và câu trả lời đến từ đâu</h3>
${slide('lx-09', 7, 'Đường đi của một câu hỏi DNS')}
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
<pre><code class="language-bash">resolvectl status | head -20         <span class="tok-comment"># systemd-resolved: cấu hình thật</span>
cat /etc/resolv.conf                 <span class="tok-comment"># thường chỉ trỏ vào 127.0.0.53</span>
resolvectl flush-caches              <span class="tok-comment"># xoá bộ đệm cục bộ</span>
getent hosts cuongthai.com           <span class="tok-comment"># phân giải theo đúng cách ỨNG DỤNG làm</span></code></pre>
<div class="callout warn"><code>dig</code> nói chuyện trực tiếp với một máy chủ DNS; còn ứng dụng thì đi qua thư viện C, thứ còn đọc cả <code>/etc/hosts</code> và tuân theo <code>/etc/nsswitch.conf</code>. Nên <code>dig</code> và ứng dụng của bạn hoàn toàn có thể bất đồng một cách chính đáng — thường gặp nhất là vì ai đó để sót một dòng trong <code>/etc/hosts</code>. Lệnh <code>getent hosts &lt;tên&gt;</code> đi theo đúng con đường mà một ứng dụng đi, và so hai câu trả lời là biết ngay tầng nào đang nói dối.</div>

<h3>dig, host, nslookup và getent đặt cạnh nhau</h3>

${slide('lx-09', 8, 'dig · host · nslookup · getent')}
<p>Bốn lệnh cùng trả lời câu "tên này có IP gì", nhưng chúng không hỏi cùng một câu. <code>dig</code>, <code>host</code> và <code>nslookup</code> đều nói chuyện thẳng với một máy chủ DNS; còn <code>getent</code> hỏi thư viện C đúng y cách <code>curl</code>, Node hay Python làm, nghĩa là nó đọc <code>/etc/hosts</code> TRƯỚC (dòng <code>hosts: files dns</code> trong <code>/etc/nsswitch.conf</code>). Trên Ubuntu, <code>dig</code>, <code>host</code> và <code>nslookup</code> đến từ gói <code>dnsutils</code> (Fedora: <code>bind-utils</code>); macOS có sẵn cả ba; Windows chỉ có <code>nslookup</code>.</p>
<table>
<tr><th>Lệnh</th><th>Hỏi ai</th><th>Đọc /etc/hosts?</th><th>Mã thoát khi tên không tồn tại</th><th>Dùng khi</th></tr>
<tr><td><code>dig +short tên</code></td><td>thẳng một máy chủ DNS</td><td>không</td><td><strong>0</strong> — chữ NXDOMAIN chỉ nằm trong output</td><td>cần chi tiết: TTL, loại bản ghi, <code>@máy-chủ</code>, <code>+trace</code></td></tr>
<tr><td><code>host tên</code></td><td>thẳng một máy chủ DNS</td><td>không</td><td>1</td><td>câu trả lời ngắn, dễ đọc (A, AAAA và MX cùng lúc)</td></tr>
<tr><td><code>nslookup tên</code></td><td>thẳng một máy chủ DNS</td><td>không</td><td>1</td><td>lệnh duy nhất có mặt cả trên Windows</td></tr>
<tr><td><code>getent hosts tên</code></td><td>thư viện C (nsswitch)</td><td><strong>có, đọc trước</strong></td><td>2</td><td>"ứng dụng của tôi RỐT CUỘC sẽ kết nối tới đâu?"</td></tr>
</table>
<pre><code>host example.com
nslookup example.com
dig +short khong-ton-tai-lx09.example; echo "dig: \$?"
host khong-ton-tai-lx09.example;      echo "host: \$?"
getent hosts khong-ton-tai-lx09.example; echo "getent: \$?"</code></pre>
<div class="out">example.com has address 104.20.23.154
example.com has address 172.66.147.243
example.com mail is handled by 0 .
Server:		127.0.0.11
Address:	127.0.0.11#53

Non-authoritative answer:
Name:	example.com
Address: 104.20.23.154
Name:	example.com
Address: 172.66.147.243

dig: 0
Host khong-ton-tai-lx09.example not found: 3(NXDOMAIN)
host: 1
getent: 2</div>
<div class="callout warn"><strong><code>dig</code> thoát 0 cả khi tên KHÔNG tồn tại</strong> (đo trên Ubuntu 24.04, BIND 9.18.39): với <code>dig</code>, nhận được <em>một câu trả lời</em> là thành công, mà "không có tên đó" cũng là một câu trả lời. Một script kiểm DNS kiểu <code>dig +short "\$host" &gt;/dev/null &amp;&amp; echo ok</code> sẽ in ok với mọi lỗi gõ nhầm. Hãy kiểm output có rỗng không, hoặc dùng <code>getent</code>/<code>host</code> — mã thoát của chúng mang đúng nghĩa bạn nghĩ.</div>
<p>Và trường hợp làm người ta chạy vòng vòng — một dòng sót trong <code>/etc/hosts</code>, dựng lại trong container:</p>
<pre><code class="language-bash">echo "10.9.9.9 example.com" &gt;&gt; /etc/hosts
getent hosts example.com
dig +short example.com
curl -sS -m 3 -o /dev/null http://example.com</code></pre>
<div class="out">10.9.9.9        example.com
104.20.23.154
172.66.147.243
curl: (28) Connection timed out after 3002 milliseconds</div>
<p><code>dig</code> nói mọi thứ đều ổn; <code>curl</code> thì đi tới 10.9.9.9 và hết giờ chờ, vì nó đọc <code>/etc/hosts</code> trước. Xoá dòng đó trong container còn một cái bẫy nữa: <code>sed -i '/10.9.9.9/d' /etc/hosts</code> hỏng với <code>sed: cannot rename /etc/sedXXXXXX: Device or resource busy</code>, vì Docker bind-mount (gắn) <code>/etc/hosts</code> như một file đơn, còn <code>sed -i</code> làm việc bằng cách ghi một file mới rồi đổi tên đè lên file cũ. Hãy ghi đè TẠI CHỖ: <code>grep -v 10.9.9.9 /etc/hosts &gt; /tmp/h &amp;&amp; cat /tmp/h &gt; /etc/hosts</code>. Đây đúng là bài học inode của một file <code>nginx.conf</code> bị bind-mount.</p>


<h3>Kiểm kết nối, theo từng tầng</h3>
${slide('lx-09', 3, 'Thang 4 bậc: bậc đầu tiên hỏng gọi tên tầng')}
<pre><code class="language-bash">ping -c3 1.1.1.1                     <span class="tok-comment"># 1. mạng có lên không đã?</span>
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

<div class="callout">Một lưu ý ĐO THẬT cho bậc 1, ở mạng trường đại học ngày 28/09/2026: mọi gói tin tới <code>1.1.1.1</code> đều bị chặn — <code>ping -c2 1.1.1.1</code> mất 100%, <code>dig @1.1.1.1 example.com</code> kết thúc bằng <code>connection timed out; no servers could be reached</code> (mã 9) — trong khi <code>ping -c2 example.com</code> vẫn có hồi đáp ~58 ms và web nào cũng mở được. Bậc 1 hỏng trên một mạng có quản lý (trường, công ty, quán cà phê) thường nghĩa là "đích này bị lọc", chứ không phải "mạng chết". Hãy thử một đích thứ hai — cổng mặc định lấy từ <code>ip route</code>, hoặc chính trang web đó — trước khi kết luận.</div>

<h3>Vài công cụ nữa đáng có</h3>
<pre><code class="language-bash">nc -zv host 22                       <span class="tok-comment"># kiểm cổng, không gửi dữ liệu nào</span>
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

<h3>Chạy thử từng bước</h3>
<p>Hai container Ubuntu vứt đi trên một mạng Docker riêng là đủ để dựng lại ca "chạy rồi mà không với tới được" phổ biến nhất trong năm phút. Chạy trên máy bạn (Docker Desktop trên Mac/Windows, hoặc Docker trên Linux):</p>
<pre><code class="language-bash">docker network create lx09-net
docker run -d --name lx09-srv --network lx09-net ubuntu:24.04 sleep infinity
docker run -d --name lx09-cli --network lx09-net ubuntu:24.04 sleep infinity
docker exec lx09-srv bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq python3 iproute2 &gt;/dev/null 2&gt;&amp;1'
docker exec lx09-cli bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq curl netcat-openbsd dnsutils &gt;/dev/null 2&gt;&amp;1'
docker exec -d lx09-srv python3 -m http.server 19090 --bind 127.0.0.1
docker exec -d lx09-srv python3 -m http.server 19091
docker exec lx09-srv ss -tlnp
docker exec lx09-cli getent hosts lx09-srv
docker exec lx09-cli nc -zv lx09-srv 19090
docker exec lx09-cli nc -zv lx09-srv 19091
docker exec lx09-cli curl -sS -o /dev/null -w '%{http_code}\\n' http://lx09-srv:19091/</code></pre>
<div class="out">State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      4096      127.0.0.11:33037      0.0.0.0:*
LISTEN 0      5            0.0.0.0:19091      0.0.0.0:*    users:(("python3",pid=2634,fd=3))
LISTEN 0      5          127.0.0.1:19090      0.0.0.0:*    users:(("python3",pid=2628,fd=3))
172.21.0.6      lx09-srv
nc: connect to lx09-srv (172.21.0.6) port 19090 (tcp) failed: Connection refused
Connection to lx09-srv (172.21.0.6) 19091 port [tcp/*] succeeded!
200</div>
<p>Đọc nó như cái thang: tên phân giải được (DNS của Docker trả <code>172.21.0.6</code>), cổng 19090 bị <em>từ chối</em> — máy trả lời "không có ai ở đây", vì server gắn vào loopback của chính nó — còn 19091, gắn vào <code>0.0.0.0</code>, trả về 200. Dọn dẹp bằng <code>docker rm -f lx09-srv lx09-cli &amp;&amp; docker network rm lx09-net</code>.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Việc</th><th>Ubuntu / WSL2</th><th>macOS (đo trên macOS 27)</th></tr>
<tr><td>Địa chỉ, tuyến</td><td><code>ip -br a</code>, <code>ip route</code></td><td>không có <code>ip</code>: <code>ifconfig en0</code>, <code>route -n get default</code>, <code>ipconfig getifaddr en0</code></td></tr>
<tr><td>Cái gì đang lắng nghe</td><td><code>ss -tlnp</code></td><td>không có <code>ss</code>: <code>lsof -nP -iTCP -sTCP:LISTEN</code> hoặc <code>netstat -an -p tcp | grep LISTEN</code></td></tr>
<tr><td>Cấu hình DNS</td><td><code>resolvectl status</code></td><td><code>scutil --dns</code>; phân giải như ứng dụng: <code>dscacheutil -q host -a name example.com</code> (không có <code>getent</code>)</td></tr>
<tr><td><code>dig</code> / <code>host</code> / <code>nslookup</code></td><td><code>apt install dnsutils</code></td><td>có sẵn</td></tr>
<tr><td>Hết giờ của ping</td><td><code>ping -W 2</code> (<code>-t</code> là TTL)</td><td><code>ping -t 3</code> (<code>-t</code> là hết giờ)</td></tr>
<tr><td><code>timeout 3 bash -c 'echo &gt; /dev/tcp/…'</code></td><td>chạy được</td><td>không có lệnh <code>timeout</code>; dùng <code>nc -z -G 3 máy cổng</code></td></tr>
</table>
<p>Hai bất ngờ trên Mac đo được lúc viết bài này: <code>lsof</code> cho thấy <code>ControlCe</code> (Control Center — tính năng AirPlay Receiver) đang nghe trên <code>*:5000</code> và <code>*:7000</code> — nên một app Flask hay Express chạy cổng 5000 sẽ hỏng với "address already in use" cho tới khi bạn tắt AirPlay Receiver hoặc chọn cổng khác. Và <code>scutil --dns</code> là chỗ để thấy mạng trường đưa cho bạn bộ phân giải của riêng nó, lý do <code>dig @1.1.1.1</code> có thể hết giờ ở đó. Trên WSL2, phía Linux có giao diện riêng và <code>/etc/resolv.conf</code> riêng (do WSL sinh ra, trừ khi bạn đặt <code>generateResolvConf = false</code> trong <code>/etc/wsl.conf</code>); <code>ip</code>, <code>ss</code>, <code>dig</code> chạy y hệt Ubuntu, nhưng chúng mô tả máy ảo WSL, không phải Windows.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm SWP391 báo "API chạy rồi, mà app điện thoại không gọi được". Dựng lại ca đó và gọi tên tầng hỏng, dùng hai container ở phần "Chạy thử từng bước".</p><ol>
<li>Trên <code>lx09-srv</code>, chạy <code>python3 -m http.server 19090 --bind 127.0.0.1</code>. Từ <code>lx09-cli</code>, leo thang: <code>getent hosts lx09-srv</code>, <code>nc -zv lx09-srv 19090</code>, rồi <code>curl -sS -o /dev/null -w '%{http_code}\\n' http://lx09-srv:19090/; echo "exit=\$?"</code>. Ghi lại bậc nào hỏng đầu tiên và mã thoát của curl.</li>
<li>Trên máy chủ, tìm nguyên nhân bằng <code>ss -tlnp</code> và chỉ ra đúng cột chứng minh điều đó.</li>
<li>Khởi động lại server gắn vào <code>0.0.0.0</code> rồi lặp lại bước 1 tới khi ra <code>200</code>.</li>
<li>Trên trình khách, thêm một dòng sai bằng <code>echo "10.9.9.9 lx09-srv" &gt;&gt; /etc/hosts</code>, so <code>getent hosts lx09-srv</code> với <code>dig +short lx09-srv</code>, rồi xoá dòng đó <em>tại chỗ</em> bằng <code>grep -v 10.9.9.9 /etc/hosts &gt; /tmp/h &amp;&amp; cat /tmp/h &gt; /etc/hosts</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được "bậc 3 hỏng, curl thoát 7, vì cột Local Address là <code>127.0.0.1:19090</code>", bước 3 in ra <code>200</code>, và ở bước 4 <code>getent</code> ra 10.9.9.9 còn <code>dig</code> thì không.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Interface (giao diện mạng)</span><span class="v">Một card mạng, thật hoặc ảo (<code>eth0</code>, <code>lo</code>, <code>docker0</code>), mỗi cái có địa chỉ riêng.</span></div>
  <div class="kv"><span class="k">Loopback (vòng lặp nội bộ)</span><span class="v">Giao diện <code>lo</code> / <code>127.0.0.1</code>: lưu lượng không bao giờ rời khỏi máy.</span></div>
  <div class="kv"><span class="k">Default route / gateway (tuyến mặc định / cổng ra)</span><span class="v">Nơi gói tin đi khi không khớp tuyến nào cụ thể hơn — lối ra internet.</span></div>
  <div class="kv"><span class="k">Socket, bind, listen (ổ cắm, gắn, lắng nghe)</span><span class="v">Điểm cuối mạng của một chương trình; gắn là chọn địa chỉ + cổng; lắng nghe là chờ kết nối tới.</span></div>
  <div class="kv"><span class="k">Backlog (hàng chờ — Send-Q ở dòng LISTEN)</span><span class="v">Số kết nối đã bắt tay xong được phép chờ chương trình nhận vào.</span></div>
  <div class="kv"><span class="k">Resolver (bộ phân giải DNS)</span><span class="v">Máy chủ DNS mà máy bạn hỏi; nó trả lời từ bộ đệm hoặc tự đi gốc → TLD → máy chủ có thẩm quyền.</span></div>
  <div class="kv"><span class="k">NXDOMAIN (tên không tồn tại)</span><span class="v">Câu trả lời DNS "không có tên này".</span></div>
  <div class="kv"><span class="k">TTL (thời gian sống)</span><span class="v">Số giây một câu trả lời DNS được lưu tạm — lý do "đổi rồi mà chưa ăn".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Không kết nối được" là bốn vấn đề khác nhau; leo ping IP → ping tên → <code>nc -z</code> → <code>curl</code>, bậc hỏng đầu tiên gọi tên tầng.</li>
<li><code>ip</code> và <code>ss</code> thay <code>ifconfig</code> và <code>netstat</code>; dòng tuyến mặc định là lối ra của bạn.</li>
<li>Trong <code>ss -tlnp</code>, cột Local Address quan trọng hơn cổng: <code>127.0.0.1</code> thì máy khác không bao giờ với tới.</li>
<li><code>dig</code>, <code>host</code>, <code>nslookup</code> hỏi thẳng DNS; chỉ <code>getent</code> đi qua <code>/etc/hosts</code> như ứng dụng — và <code>dig</code> thoát 0 cả khi tên không có.</li>
<li>Ping hỏng trên một mạng có lọc chưa chứng minh mạng chết; hãy thử một đích thứ hai.</li>
<li>Trên Mac dùng <code>lsof -nP -iTCP -sTCP:LISTEN</code> và <code>scutil --dns</code>; cổng 5000 có thể đã thuộc về AirPlay.</li>
</ul>

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
<pre><code class="language-bash">curl https://api.example.com/data              <span class="tok-comment"># progress bar, no redirects, exit 0 on 500</span>
curl -sSf https://api.example.com/data         <span class="tok-comment"># the script default</span>
curl -sSfL https://api.example.com/data        <span class="tok-comment"># …and follow redirects</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-s</code> silent</span><span class="v">No progress meter. Essential in a script, where the meter would otherwise contaminate the log.</span></div>
  <div class="kv"><span class="k"><code>-S</code> show-error</span><span class="v">Undoes the part of <code>-s</code> that also hides real error messages. <code>-sS</code> means "quiet, but tell me if it breaks", which is what you actually wanted.</span></div>
  <div class="kv"><span class="k"><code>-f</code> fail</span><span class="v"><strong>Exit non-zero on HTTP 4xx/5xx.</strong> Without it curl considers a 404 a successful transfer of an error page, and your script continues with the error page as its data.</span></div>
  <div class="kv"><span class="k"><code>-L</code> location</span><span class="v">Follow redirects. Many APIs and every <code>http://</code> URL on a modern site returns a 301 first, and without <code>-L</code> you get the redirect page instead of the content.</span></div>
</div>
<pre><code class="language-bash">curl -s https://example.com/missing &gt; data.json
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
<pre><code class="language-bash">curl -sSfL -o page.html https://example.com       <span class="tok-comment"># -o: a name you choose</span>
curl -sSfLO https://example.com/file.tar.gz       <span class="tok-comment"># -O: keep the remote name</span>
curl -sSfL https://example.com &gt; page.html        <span class="tok-comment"># redirection works too</span>
curl -sSfL --create-dirs -o out/a/b.json "\$url"   <span class="tok-comment"># make the directories</span>
curl -sSfL -C - -O https://example.com/big.iso    <span class="tok-comment"># -C -: resume a partial download</span></code></pre>
<div class="callout warn">With <code>-O</code>, the filename comes from the <em>URL</em>, and a hostile or careless URL can end in <code>../../.bashrc</code>. Use <code>-o</code> with a name you control whenever the URL is not a constant in your own script — the same class of problem as the path validation in Lesson 7.2.</div>

<h3>-w: extracting exactly one number</h3>
${slide('lx-09', 9, 'Một request HTTPS: DNS → TCP → TLS → chờ máy chủ')}
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com
curl -s -o /dev/null -w '%{time_total}\\n' https://cuongthai.com
curl -s -o /dev/null -w 'code=%{http_code} time=%{time_total}s size=%{size_download}\\n' "\$url"</code></pre>
<div class="out">200
0.184
code=200 time=0.184s size=48213</div>
<p>That first line is the smoke test from Chapter 7: discard the body, print only the status code, and branch on it. It is the difference between "the deploy script finished" and "the route actually answers".</p>
<pre><code class="language-bash"><span class="tok-comment"># Where the time actually goes — each number is cumulative</span>
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

<h3>Measured: one request, four stages</h3>
<p>The same variables, measured for real against <code>https://example.com/</code> on 28/09/2026 from a Fedora 44 machine on a home connection:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w "dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} pre=%{time_pretransfer} ttfb=%{time_starttransfer} total=%{time_total} code=%{http_code} ip=%{remote_ip}\\n" https://example.com/</code></pre>
<div class="out">dns=0.007746 tcp=0.034237 tls=0.072264 pre=0.072377 ttfb=0.101615 total=0.101866 code=200 ip=172.66.147.243</div>
<p>…and with the five-line format above from an Ubuntu 24.04 container on a Mac on a university Wi-Fi:</p>
<div class="out">  dns:      0.004923s
  connect:  0.066624s
  tls:      0.196605s
  ttfb:     0.275640s
  total:    0.275719s</div>
<table>
<tr><th>Stage</th><th>How to compute it</th><th>Fedora, home</th><th>Container, school</th><th>If this one is large, suspect…</th></tr>
<tr><td>DNS</td><td><code>time_namelookup</code></td><td>7.7 ms</td><td>4.9 ms</td><td>a slow or dead resolver — try another</td></tr>
<tr><td>TCP handshake</td><td><code>time_connect − time_namelookup</code></td><td>26.5 ms</td><td>61.7 ms</td><td>distance, congestion, lost SYNs</td></tr>
<tr><td>TLS handshake</td><td><code>time_appconnect − time_connect</code></td><td>38.0 ms</td><td>130.0 ms</td><td>round trips again; a long certificate chain; a busy server CPU</td></tr>
<tr><td>Server think time</td><td><code>time_starttransfer − time_appconnect</code></td><td>29.4 ms</td><td>79.0 ms</td><td><strong>your code or your database</strong> — the network is innocent here</td></tr>
</table>
<p>The same page costs 102 ms at home and 276 ms on the school network, and almost all of the difference is in the stages that are pure round trips (TCP, TLS). Nothing about the server changed. For a plain <code>http://</code> URL, <code>time_appconnect</code> is <code>0.000000</code> — there is no TLS stage at all — so subtract from <code>time_connect</code> instead.</p>


<h3>Methods, headers and JSON</h3>
<pre><code class="language-bash">curl -sSf -X POST https://api.example.com/items \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"test","qty":3}'

curl -sSf --json '{"name":"test"}' https://api.example.com/items   <span class="tok-comment"># curl 7.82+: sets both headers</span>

curl -sSf -X PUT  -d @payload.json -H 'Content-Type: application/json' "\$url"
curl -sSf -X DELETE "\$url/items/42"
curl -sSf -H "Authorization: Bearer \$TOKEN" "\$url/me"
curl -sSfI "\$url"                     <span class="tok-comment"># -I: HEAD — headers only, no body</span></code></pre>
<div class="callout warn">Using <code>-d</code> implies <code>-X POST</code>, so writing both is harmless but redundant — and mixing <code>-X GET</code> with <code>-d</code> produces a GET with a body, which many servers silently ignore. If a request "does nothing", check that the method and the data flag agree.</div>
<pre><code class="language-bash"><span class="tok-comment"># Read a token from a file, so it never appears in ps or in history (Lesson 8.3)</span>
curl -sSf -H @auth-header.txt "\$url/me"
curl -sSf --config curlrc.txt "\$url"

<span class="tok-comment"># auth-header.txt</span>
Authorization: Bearer sk-live-...</code></pre>
<div class="callout">A token passed as <code>-H "Authorization: Bearer \$TOKEN"</code> is visible in <code>ps aux</code> to every user on the machine for the lifetime of the request, and lands in your shell history. <code>-H @file</code> and <code>--config file</code> read it from a file instead — the same reasoning as <code>~/.pgpass</code> and <code>~/.netrc</code> in Lesson 8.3. On a shared or production host, use them.</div>

<h3>-v: reading the whole exchange</h3>
${slide('lx-09', 10, 'curl -v: * ghi chú · > gửi · < nhận')}
<pre><code class="language-bash">curl -v https://cuongthai.com 2&gt;&amp;1 | head -30</code></pre>
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
<pre><code class="language-bash">curl -sSf --resolve cuongthai.com:443:203.0.113.99 https://cuongthai.com/   <span class="tok-comment"># test a server before DNS points at it</span>
curl -sSfI -H 'Host: cuongthai.com' http://203.0.113.42/                    <span class="tok-comment"># test a vhost by IP</span>
curl -sSf --http1.1 "\$url"                                                  <span class="tok-comment"># force HTTP/1.1</span>
curl -sSf --max-time 10 --connect-timeout 3 "\$url"                          <span class="tok-comment"># always in a script</span></code></pre>
<div class="callout ok"><code>--resolve</code> is the flag for testing a migration. It sends the request to an IP you name while still using the real hostname for TLS and the <code>Host</code> header — so you can verify the new server serves the site correctly <em>before</em> switching DNS, rather than switching and finding out. It beats editing <code>/etc/hosts</code>, because it affects one command instead of your whole machine.</div>

<h3>Timeouts belong in every script</h3>
<pre><code class="language-bash">curl -sSfL --connect-timeout 5 --max-time 30 --retry 3 --retry-delay 2 "\$url"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--connect-timeout</code></span><span class="v">Give up if the TCP connection is not established in N seconds. Without it, a dead host can hang for over two minutes.</span></div>
  <div class="kv"><span class="k"><code>--max-time</code></span><span class="v">A ceiling for the whole request. This is the one that stops a cron job from running until the next one starts.</span></div>
  <div class="kv"><span class="k"><code>--retry N</code></span><span class="v">Retry on transient errors and 5xx. Combine with <code>--retry-delay</code> or <code>--retry-all-errors</code>.</span></div>
</div>
<div class="callout warn">A <code>curl</code> without a timeout inside a cron job is the classic cause of a machine that slowly fills with processes: the endpoint stops responding, each invocation hangs indefinitely, and every five minutes another one starts. Combine <code>--max-time</code> with the <code>flock</code> guard from Lesson 7.3 and neither failure mode can occur.</div>

<h3>Telling a network failure from an application failure</h3>
${slide('lx-09', 11, 'Mã thoát của curl nói tầng nào hỏng')}
<pre><code class="language-bash">curl -sSf "\$url"; echo "exit=\$?"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">6</span><span class="v">Could not resolve host — DNS, not the application (Lesson 9.1).</span></div>
  <div class="kv"><span class="k">7</span><span class="v">Failed to connect — nothing listening, or a firewall.</span></div>
  <div class="kv"><span class="k">22</span><span class="v">HTTP 4xx/5xx with <code>-f</code>. The connection worked; the application said no.</span></div>
  <div class="kv"><span class="k">28</span><span class="v">Timeout. It connected and then stalled — usually the server, sometimes the network.</span></div>
  <div class="kv"><span class="k">35 · 60</span><span class="v">TLS handshake failed · certificate could not be verified. Check <code>curl -v</code> for the expiry and the issuer.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># In a script: branch on the class of failure, not just on "it failed"</span>
body=\$(curl -sSf --max-time 10 "\$url") || {
  rc=\$?                          <span class="tok-comment"># capture it NOW — see "The if ! trap" below</span>
  case \$rc in
    6)  die "DNS failure for \$url" ;;
    7)  die "connection refused — is the service running?" ;;
    22) die "server returned an HTTP error" ;;
    28) die "timed out after 10s" ;;
    *)  die "curl failed with \$rc" ;;
  esac
}</code></pre>
<div class="callout ok">Those five exit codes map exactly onto the four layers from Lesson 9.1, which means a health-check script can report <em>which layer</em> broke rather than "the check failed". That distinction is what makes an alert actionable at 3am.</div>

<h3>Measured: four failures, four exit codes</h3>
<pre><code class="language-bash">curl -sSf --max-time 5 -o /dev/null https://khong-ton-tai-lx09.example; echo \$?
curl -sSf --max-time 5 -o /dev/null http://172.21.0.4:19090; echo \$?     <span class="tok-comment"># server bound to 127.0.0.1</span>
curl -sSf --max-time 5 -o /dev/null https://example.com/khong-co; echo \$?
curl -sSf --max-time 2 -o /dev/null http://10.255.255.1; echo \$?          <span class="tok-comment"># nobody answers at all</span></code></pre>
<div class="out">curl: (6) Could not resolve host: khong-ton-tai-lx09.example
6
curl: (7) Failed to connect to 172.21.0.4 port 19090 after 0 ms: Couldn't connect to server
7
curl: (22) The requested URL returned error: 404
22
curl: (28) Connection timed out after 2005 milliseconds
28</div>
<p>Notice the time in each message: a refusal (7) arrives "after 0 ms", because the other machine replied immediately with a reset; a timeout (28) takes exactly as long as you allowed. That difference is itself a diagnosis, and Lesson 9.5 shows the firewall rules that produce each one.</p>

<h3>The if ! trap: $? is already 0 inside then</h3>

${slide('lx-09', 12, 'Bẫy: $? trong nhánh then của if ! đã là 0')}
<p>An earlier version of this lesson wrote the branch as <code>if ! body=\$(curl …); then case \$? in …</code>. It looks right and never works: <code>!</code> inverts the exit status, so inside <code>then</code> the value of <code>\$?</code> is the status of the <em>whole</em> <code>! …</code> test, which is 0. Every failure lands in <code>*)</code> and reports "code 0". Measured with an unknown host (curl exits 6):</p>
<div class="out">DIE: curl failed with 0                                            <span class="tok-comment"># if ! … then case \$?</span>
DIE: DNS failure for https://khong-ton-tai-lx09.example           <span class="tok-comment"># … || { rc=\$?; case \$rc … }</span></div>
<p>The rule: <strong>save <code>\$?</code> into a variable on the very next line</strong>, before any other command — including <code>[[ … ]]</code>, <code>echo</code> or <code>local</code> — overwrites it. The same health-check function below had a quieter bug of the same family: <code>code=\$(curl -s -o /dev/null -w '%{http_code}' … || echo 000)</code>. When the connection fails, <code>-w</code> <em>already</em> prints <code>000</code>, the <code>|| echo 000</code> then appends another, and the variable holds <code>000000</code>. It is fixed below with <code>|| true</code>, which keeps <code>set -e</code> happy without adding text.</p>


<h3>A real health check</h3>
<pre><code class="language-bash">check() {
  local url=\$1 expect=\${2:-200} code
  code=\$(curl -s -o /dev/null -w '%{http_code}' \\
         --connect-timeout 3 --max-time 10 "\$url") || true
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

<h3>Flag table: every curl option in this lesson</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>-s</code> / <code>-S</code></td><td>silent (no progress meter) / but still print errors</td><td><code>curl -sS URL</code></td></tr>
<tr><td><code>-f</code></td><td>exit 22 on HTTP ≥ 400 instead of 0</td><td><code>curl -sSf URL || die</code></td></tr>
<tr><td><code>-L</code></td><td>follow 301/302 redirects</td><td><code>curl -sSfL http://…</code></td></tr>
<tr><td><code>-o FILE</code> / <code>-O</code></td><td>save to a name you choose / to the name in the URL</td><td><code>-o page.html</code></td></tr>
<tr><td><code>-C -</code></td><td>resume a partial download</td><td><code>curl -C - -O URL</code></td></tr>
<tr><td><code>-w FORMAT</code></td><td>print variables after the transfer</td><td><code>-w '%{http_code}'</code></td></tr>
<tr><td><code>-I</code> / <code>-i</code></td><td>HEAD request (headers only) / show headers with the body</td><td><code>curl -sI URL</code></td></tr>
<tr><td><code>-v</code></td><td>the whole exchange on stderr (<code>*</code> <code>&gt;</code> <code>&lt;</code>)</td><td><code>curl -v URL 2&gt;&amp;1 | less</code></td></tr>
<tr><td><code>-X</code> · <code>-H</code> · <code>-d</code></td><td>method · header · body (<code>-d</code> implies POST)</td><td><code>-X PUT -H 'Content-Type: application/json' -d @x.json</code></td></tr>
<tr><td><code>--json</code></td><td>body + JSON headers in one flag (curl 7.82+)</td><td><code>--json '{"a":1}'</code></td></tr>
<tr><td><code>-H @file</code> · <code>--config</code></td><td>read headers/options from a file — secrets stay out of <code>ps</code></td><td><code>-H @auth.txt</code></td></tr>
<tr><td><code>--resolve H:P:IP</code></td><td>send to this IP but keep the real hostname for TLS and Host</td><td><code>--resolve example.com:443:1.2.3.4</code></td></tr>
<tr><td><code>--connect-timeout</code> · <code>--max-time</code></td><td>give up on connecting · on the whole request</td><td><code>--connect-timeout 3 --max-time 10</code></td></tr>
<tr><td><code>--retry N</code></td><td>retry transient errors and 5xx</td><td><code>--retry 3 --retry-delay 2</code></td></tr>
<tr><td><code>-k</code></td><td>skip certificate checks — for your own self-signed certificate only</td><td>never in a production script</td></tr>
</table>

<h3>Try it step by step</h3>
<p>The health check from this lesson, with the <code>\$?</code> fix and the <code>|| true</code> fix, run against a local server so nothing depends on the internet. Inside an Ubuntu container (<code>apt-get install -y curl python3</code>):</p>
<pre><code class="language-bash">python3 -m http.server 19090 --bind 127.0.0.1 &gt;/dev/null 2&gt;&amp;1 &amp;
cat &gt; check.sh &lt;&lt;'EOF'
#!/bin/bash
set -uo pipefail
check() {
  local url=\$1 expect=\${2:-200} code rc
  code=\$(curl -s -o /dev/null -w '%{http_code}' \\
         --connect-timeout 3 --max-time 10 "\$url") &amp;&amp; rc=0 || rc=\$?
  if [[ \$code == "\$expect" ]]; then
    printf '  OK   %-40s %s\\n' "\$url" "\$code"
  else
    printf '  FAIL %-40s %s (expected %s, curl exit %s)\\n' "\$url" "\$code" "\$expect" "\$rc" &gt;&amp;2
    return 1
  fi
}
rc=0
check http://127.0.0.1:19090/               || rc=1
check http://127.0.0.1:19090/khong-co 404   || rc=1
check http://127.0.0.1:19099/               || rc=1
check http://khong-ton-tai-lx09.example/    || rc=1
exit \$rc
EOF
bash check.sh; echo "exit=\$?"</code></pre>
<div class="out">  OK   http://127.0.0.1:19090/                  200
  OK   http://127.0.0.1:19090/khong-co          404
  FAIL http://127.0.0.1:19099/                  000 (expected 200, curl exit 7)
  FAIL http://khong-ton-tai-lx09.example/       000 (expected 200, curl exit 6)
exit=1</div>
<p>Four lines, four different facts: a working route, a 404 that was expected (so it passes), a port nobody listens on (000 and exit 7 — the connection layer), and a name that does not resolve (000 and exit 6 — DNS). The script's own exit status is 1, so cron or CI will notice. (Output recorded in Ubuntu 24.04, curl 8.5.0.)</p>

<h3>On macOS and WSL: what is different</h3>
<ul>
<li><strong>macOS</strong> ships its own curl (<code>curl 8.7.1</code> on the Mac used for this chapter, built on SecureTransport/LibreSSL). Every flag in this lesson works, including <code>--json</code> and <code>-w</code>; the TLS lines in <code>-v</code> are worded differently because the TLS library is different.</li>
<li><strong>Windows</strong> has a real <code>curl.exe</code> since Windows 10 (1803). But in <em>Windows PowerShell 5.1</em> the word <code>curl</code> is an alias for <code>Invoke-WebRequest</code>, which does not understand <code>-sSf</code> — type <code>curl.exe</code> there. PowerShell 7 removed that alias.</li>
<li><strong>WSL</strong> uses Ubuntu's curl, identical to this lesson. Inside WSL2, <code>localhost</code> is the WSL machine; reaching a server running on Windows itself may need the Windows host's IP depending on the networking mode.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group's demo is tomorrow and the lecturer's projector machine will hit three URLs. You want one script that says, in plain words, which layer is broken — not just "failed".</p><ol>
<li>In a container, start two local servers: one on <code>127.0.0.1:19090</code>, one on <code>127.0.0.1:19091</code>. Copy <code>check.sh</code> from "Try it step by step" and add a check for <code>http://127.0.0.1:19091/</code>.</li>
<li>Add a <code>case "\$rc"</code> after the FAIL line that prints <code>DNS</code> for 6, <code>nobody listening</code> for 7, <code>timeout</code> for 28 — capturing <code>rc</code> on the same line as curl, never inside <code>then</code> of an <code>if !</code>.</li>
<li>Kill the second server (<code>kill %2</code>) and run the script again; then add <code>--max-time 2</code> and point one check at <code>http://10.255.255.1/</code>.</li>
<li>Measure the four timing stages of <code>https://example.com/</code> three times with <code>-w</code> and write down which stage varies most.</li></ol>
<p><strong>Done when:</strong> the script prints one line per URL with the right layer name (DNS / nobody listening / timeout / HTTP code), exits 1 when anything fails, and you can quote your own measured TCP and TLS times.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit status</span><span class="v">The number curl returns: 0 success, 6 DNS, 7 connect, 22 HTTP error with <code>-f</code>, 28 timeout.</span></div>
  <div class="kv"><span class="k">Status code</span><span class="v">The server's HTTP answer (200, 301, 401, 404, 500) — different from curl's exit status.</span></div>
  <div class="kv"><span class="k">Redirect</span><span class="v">A 301/302 telling the client to go elsewhere; <code>-L</code> follows it.</span></div>
  <div class="kv"><span class="k">Handshake</span><span class="v">The round trips before data flows: TCP (SYN, SYN-ACK, ACK), then TLS.</span></div>
  <div class="kv"><span class="k">TTFB</span><span class="v">Time to first byte: when the server's first byte of the answer arrives.</span></div>
  <div class="kv"><span class="k">Write-out (<code>-w</code>)</span><span class="v">curl's template for printing numbers about the transfer after it ends.</span></div>
  <div class="kv"><span class="k">Certificate</span><span class="v">What proves the server's name in TLS; <code>-v</code> shows subject, issuer and expiry.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>curl's defaults are wrong for scripts: use <code>-sSfL</code> and always a <code>--max-time</code>.</li>
<li><code>-w</code> prints exactly the number you need; the timing variables are cumulative, so subtract neighbours to get each stage.</li>
<li>Exit codes name the layer: 6 DNS, 7 nobody listening or rejected, 28 dropped or stalled, 22 the application said no.</li>
<li>Save <code>\$?</code> on the next line; inside <code>then</code> of <code>if !</code> it is always 0.</li>
<li><code>-w '%{http_code}'</code> already prints <code>000</code> on failure — do not add <code>|| echo 000</code>.</li>
<li><code>curl -v</code> is the quickest certificate and header check; <code>-k</code> hides the problem instead of fixing it.</li>
</ul>

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
<pre><code class="language-bash">curl https://api.example.com/data              <span class="tok-comment"># thanh tiến độ, không theo chuyển hướng, thoát 0 khi gặp 500</span>
curl -sSf https://api.example.com/data         <span class="tok-comment"># bộ mặc định cho script</span>
curl -sSfL https://api.example.com/data        <span class="tok-comment"># …và đi theo chuyển hướng</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-s</code> silent</span><span class="v">Không có đồng hồ tiến độ. Bắt buộc trong script, nơi mà cái đồng hồ đó sẽ làm bẩn file log.</span></div>
  <div class="kv"><span class="k"><code>-S</code> show-error</span><span class="v">Gỡ bỏ cái phần của <code>-s</code> vốn cũng giấu luôn thông báo lỗi thật. <code>-sS</code> nghĩa là "im lặng, nhưng hỏng thì phải báo", và đó mới là thứ bạn thật sự muốn.</span></div>
  <div class="kv"><span class="k"><code>-f</code> fail</span><span class="v"><strong>Thoát khác 0 khi gặp HTTP 4xx/5xx.</strong> Không có nó, curl coi một mã 404 là một lần truyền THÀNH CÔNG một trang lỗi, và script của bạn chạy tiếp với cái trang lỗi đó làm dữ liệu.</span></div>
  <div class="kv"><span class="k"><code>-L</code> location</span><span class="v">Đi theo chuyển hướng. Nhiều API và mọi URL <code>http://</code> trên một trang đời mới đều trả về 301 trước, và không có <code>-L</code> thì bạn nhận được trang chuyển hướng thay vì nội dung.</span></div>
</div>
<pre><code class="language-bash">curl -s https://example.com/missing &gt; data.json
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
<pre><code class="language-bash">curl -sSfL -o page.html https://example.com       <span class="tok-comment"># -o: cái tên do BẠN chọn</span>
curl -sSfLO https://example.com/file.tar.gz       <span class="tok-comment"># -O: giữ tên ở đầu xa</span>
curl -sSfL https://example.com &gt; page.html        <span class="tok-comment"># chuyển hướng cũng được</span>
curl -sSfL --create-dirs -o out/a/b.json "\$url"   <span class="tok-comment"># tự tạo các thư mục</span>
curl -sSfL -C - -O https://example.com/big.iso    <span class="tok-comment"># -C -: nối tiếp một lần tải dở</span></code></pre>
<div class="callout warn">Với <code>-O</code>, tên file lấy từ <em>URL</em>, và một URL hiểm ác hoặc bất cẩn có thể kết thúc bằng <code>../../.bashrc</code>. Hãy dùng <code>-o</code> với một cái tên bạn kiểm soát mỗi khi URL không phải một hằng số nằm trong chính script của bạn — cùng loại vấn đề với phần kiểm đường dẫn ở Bài 7.2.</div>

<h3>-w: rút ra đúng một con số</h3>
${slide('lx-09', 9, 'Một request HTTPS: DNS → TCP → TLS → chờ máy chủ')}
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com
curl -s -o /dev/null -w '%{time_total}\\n' https://cuongthai.com
curl -s -o /dev/null -w 'code=%{http_code} time=%{time_total}s size=%{size_download}\\n' "\$url"</code></pre>
<div class="out">200
0.184
code=200 time=0.184s size=48213</div>
<p>Dòng đầu tiên đó chính là chốt kiểm ở Chương 7: vứt phần thân đi, chỉ in mã trạng thái, rồi rẽ nhánh theo nó. Đó là khác biệt giữa "script deploy đã chạy xong" và "cái tuyến đó THẬT SỰ có trả lời".</p>
<pre><code class="language-bash"><span class="tok-comment"># Thời gian thật ra đổ đi đâu — mỗi con số là mốc cộng dồn</span>
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

<h3>Đo thật: một request, bốn chặng</h3>
<p>Cùng những biến đó, đo thật tới <code>https://example.com/</code> ngày 28/09/2026 từ một máy Fedora 44 dùng mạng nhà:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w "dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} pre=%{time_pretransfer} ttfb=%{time_starttransfer} total=%{time_total} code=%{http_code} ip=%{remote_ip}\\n" https://example.com/</code></pre>
<div class="out">dns=0.007746 tcp=0.034237 tls=0.072264 pre=0.072377 ttfb=0.101615 total=0.101866 code=200 ip=172.66.147.243</div>
<p>…và với khuôn năm dòng ở trên, từ một container Ubuntu 24.04 trên Mac dùng Wi-Fi trường:</p>
<div class="out">  dns:      0.004923s
  connect:  0.066624s
  tls:      0.196605s
  ttfb:     0.275640s
  total:    0.275719s</div>
<table>
<tr><th>Chặng</th><th>Tính thế nào</th><th>Fedora, nhà</th><th>Container, trường</th><th>Nếu chặng này lớn, nghi…</th></tr>
<tr><td>DNS</td><td><code>time_namelookup</code></td><td>7,7 ms</td><td>4,9 ms</td><td>bộ phân giải chậm hoặc chết — thử cái khác</td></tr>
<tr><td>Bắt tay TCP</td><td><code>time_connect − time_namelookup</code></td><td>26,5 ms</td><td>61,7 ms</td><td>khoảng cách, mạng nghẽn, gói SYN bị rớt</td></tr>
<tr><td>Bắt tay TLS</td><td><code>time_appconnect − time_connect</code></td><td>38,0 ms</td><td>130,0 ms</td><td>lại là số vòng đi-về; chuỗi chứng chỉ dài; CPU máy chủ bận</td></tr>
<tr><td>Máy chủ "nghĩ"</td><td><code>time_starttransfer − time_appconnect</code></td><td>29,4 ms</td><td>79,0 ms</td><td><strong>mã của bạn hoặc CSDL</strong> — ở đây mạng vô tội</td></tr>
</table>
<p>Cùng một trang tốn 102 ms ở nhà và 276 ms ở mạng trường, và gần như toàn bộ chênh lệch nằm ở những chặng chỉ toàn là đi-về (TCP, TLS). Máy chủ chẳng đổi gì cả. Với một URL <code>http://</code> thường, <code>time_appconnect</code> là <code>0.000000</code> — không hề có chặng TLS — nên hãy trừ từ <code>time_connect</code>.</p>


<h3>Phương thức, header và JSON</h3>
<pre><code class="language-bash">curl -sSf -X POST https://api.example.com/items \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"test","qty":3}'

curl -sSf --json '{"name":"test"}' https://api.example.com/items   <span class="tok-comment"># curl 7.82+: đặt sẵn cả hai header</span>

curl -sSf -X PUT  -d @payload.json -H 'Content-Type: application/json' "\$url"
curl -sSf -X DELETE "\$url/items/42"
curl -sSf -H "Authorization: Bearer \$TOKEN" "\$url/me"
curl -sSfI "\$url"                     <span class="tok-comment"># -I: HEAD — chỉ header, không lấy thân</span></code></pre>
<div class="callout warn">Dùng <code>-d</code> đã ngầm bao hàm <code>-X POST</code>, nên viết cả hai thì vô hại nhưng thừa — còn trộn <code>-X GET</code> với <code>-d</code> thì sinh ra một yêu cầu GET có phần thân, thứ mà nhiều máy chủ âm thầm bỏ qua. Nếu một yêu cầu "chẳng làm gì cả", hãy kiểm xem phương thức và cờ dữ liệu có ăn khớp với nhau không.</div>
<pre><code class="language-bash"><span class="tok-comment"># Đọc token từ một file, để nó không bao giờ hiện trong ps hay trong lịch sử (Bài 8.3)</span>
curl -sSf -H @auth-header.txt "\$url/me"
curl -sSf --config curlrc.txt "\$url"

<span class="tok-comment"># auth-header.txt</span>
Authorization: Bearer sk-live-...</code></pre>
<div class="callout">Một token truyền qua <code>-H "Authorization: Bearer \$TOKEN"</code> thì mọi người dùng trên máy đều nhìn thấy trong <code>ps aux</code> suốt thời gian yêu cầu chạy, và nó rơi vào lịch sử shell của bạn. <code>-H @file</code> và <code>--config file</code> đọc nó từ một file thay vào — cùng một lý lẽ với <code>~/.pgpass</code> và <code>~/.netrc</code> ở Bài 8.3. Trên một máy dùng chung hay máy production, hãy dùng chúng.</div>

<h3>-v: đọc trọn một cuộc trao đổi</h3>
${slide('lx-09', 10, 'curl -v: * ghi chú · > gửi · < nhận')}
<pre><code class="language-bash">curl -v https://cuongthai.com 2&gt;&amp;1 | head -30</code></pre>
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
<pre><code class="language-bash">curl -sSf --resolve cuongthai.com:443:203.0.113.99 https://cuongthai.com/   <span class="tok-comment"># kiểm một máy chủ TRƯỚC khi DNS trỏ vào nó</span>
curl -sSfI -H 'Host: cuongthai.com' http://203.0.113.42/                    <span class="tok-comment"># kiểm một vhost bằng IP</span>
curl -sSf --http1.1 "\$url"                                                  <span class="tok-comment"># ép dùng HTTP/1.1</span>
curl -sSf --max-time 10 --connect-timeout 3 "\$url"                          <span class="tok-comment"># luôn có trong script</span></code></pre>
<div class="callout ok"><code>--resolve</code> là cái cờ dành cho việc kiểm một lần chuyển máy. Nó gửi yêu cầu tới một IP do bạn nêu tên trong khi vẫn dùng tên máy thật cho TLS và cho header <code>Host</code> — nên bạn xác minh được rằng máy chủ mới phục vụ trang đúng đắn <em>TRƯỚC KHI</em> đổi DNS, thay vì đổi xong rồi mới biết. Nó hơn việc sửa <code>/etc/hosts</code>, vì nó chỉ ảnh hưởng một lệnh chứ không ảnh hưởng cả cái máy của bạn.</div>

<h3>Thời gian chờ thuộc về mọi script</h3>
<pre><code class="language-bash">curl -sSfL --connect-timeout 5 --max-time 30 --retry 3 --retry-delay 2 "\$url"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--connect-timeout</code></span><span class="v">Bỏ cuộc nếu kết nối TCP không thiết lập được trong N giây. Không có nó, một máy đã chết có thể treo bạn hơn hai phút.</span></div>
  <div class="kv"><span class="k"><code>--max-time</code></span><span class="v">Trần cho cả yêu cầu. Đây là cái ngăn một công việc cron chạy dài tới tận lúc bản kế tiếp khởi động.</span></div>
  <div class="kv"><span class="k"><code>--retry N</code></span><span class="v">Thử lại với lỗi thoáng qua và với 5xx. Ghép cùng <code>--retry-delay</code> hoặc <code>--retry-all-errors</code>.</span></div>
</div>
<div class="callout warn">Một lệnh <code>curl</code> không có thời gian chờ nằm bên trong một công việc cron là nguyên nhân kinh điển của một cái máy đầy dần lên bằng tiến trình: điểm cuối thôi trả lời, mỗi lần gọi treo vô hạn, và cứ năm phút lại có thêm một cái nữa khởi động. Ghép <code>--max-time</code> với cái chốt <code>flock</code> ở Bài 7.3 thì không kiểu hỏng nào trong hai kiểu đó xảy ra được.</div>

<h3>Phân biệt lỗi mạng với lỗi ứng dụng</h3>
${slide('lx-09', 11, 'Mã thoát của curl nói tầng nào hỏng')}
<pre><code class="language-bash">curl -sSf "\$url"; echo "exit=\$?"</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">6</span><span class="v">Không phân giải được tên máy — DNS, không phải ứng dụng (Bài 9.1).</span></div>
  <div class="kv"><span class="k">7</span><span class="v">Không kết nối được — không có gì lắng nghe, hoặc có tường lửa.</span></div>
  <div class="kv"><span class="k">22</span><span class="v">HTTP 4xx/5xx khi có <code>-f</code>. Kết nối thì chạy được; ứng dụng nói không.</span></div>
  <div class="kv"><span class="k">28</span><span class="v">Hết giờ chờ. Nó kết nối được rồi đứng im — thường là do máy chủ, đôi khi do mạng.</span></div>
  <div class="kv"><span class="k">35 · 60</span><span class="v">Bắt tay TLS hỏng · không xác minh được chứng chỉ. Hãy xem <code>curl -v</code> để biết hạn dùng và nơi cấp.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Trong script: rẽ nhánh theo LOẠI thất bại, không chỉ theo "nó hỏng"</span>
body=\$(curl -sSf --max-time 10 "\$url") || {
  rc=\$?                          <span class="tok-comment"># chụp NGAY — xem "Cái bẫy của if !" bên dưới</span>
  case \$rc in
    6)  die "DNS hỏng với \$url" ;;
    7)  die "kết nối bị từ chối — dịch vụ có đang chạy không?" ;;
    22) die "máy chủ trả về một lỗi HTTP" ;;
    28) die "hết giờ chờ sau 10 giây" ;;
    *)  die "curl hỏng với mã \$rc" ;;
  esac
}</code></pre>
<div class="callout ok">Năm mã thoát đó ánh xạ chính xác vào bốn tầng ở Bài 9.1, nghĩa là một script kiểm sức khoẻ báo cáo được <em>TẦNG NÀO</em> vỡ thay vì chỉ nói "phép kiểm thất bại". Chính chỗ phân biệt đó làm một cảnh báo lúc 3 giờ sáng trở nên hành động được.</div>

<h3>Đo thật: bốn kiểu hỏng, bốn mã thoát</h3>
<pre><code class="language-bash">curl -sSf --max-time 5 -o /dev/null https://khong-ton-tai-lx09.example; echo \$?
curl -sSf --max-time 5 -o /dev/null http://172.21.0.4:19090; echo \$?     <span class="tok-comment"># server gắn vào 127.0.0.1</span>
curl -sSf --max-time 5 -o /dev/null https://example.com/khong-co; echo \$?
curl -sSf --max-time 2 -o /dev/null http://10.255.255.1; echo \$?          <span class="tok-comment"># chẳng ai trả lời cả</span></code></pre>
<div class="out">curl: (6) Could not resolve host: khong-ton-tai-lx09.example
6
curl: (7) Failed to connect to 172.21.0.4 port 19090 after 0 ms: Couldn't connect to server
7
curl: (22) The requested URL returned error: 404
22
curl: (28) Connection timed out after 2005 milliseconds
28</div>
<p>Để ý thời gian trong từng thông báo: một lời từ chối (7) tới "after 0 ms", vì máy bên kia trả lời ngay bằng một gói reset; còn hết giờ (28) thì tốn đúng bằng thời gian bạn cho phép. Chính khác biệt đó đã là một chẩn đoán, và Bài 9.5 cho thấy luật tường lửa nào sinh ra từng kiểu.</p>

<h3>Cái bẫy của if !: trong then, $? đã thành 0</h3>

${slide('lx-09', 12, 'Bẫy: $? trong nhánh then của if ! đã là 0')}
<p>Một phiên bản trước của bài này viết nhánh rẽ là <code>if ! body=\$(curl …); then case \$? in …</code>. Trông thì đúng mà không bao giờ chạy đúng: <code>!</code> đảo ngược mã thoát, nên trong <code>then</code> giá trị <code>\$?</code> là mã của <em>CẢ</em> phép thử <code>! …</code>, tức là 0. Mọi lỗi đều rơi vào <code>*)</code> và báo "mã 0". Đo với một tên máy không tồn tại (curl thoát 6):</p>
<div class="out">DIE: curl hỏng với mã 0                                              <span class="tok-comment"># if ! … then case \$?</span>
DIE: DNS hỏng với https://khong-ton-tai-lx09.example                 <span class="tok-comment"># … || { rc=\$?; case \$rc … }</span></div>
<p>Luật: <strong>lưu <code>\$?</code> vào một biến ngay dòng kế tiếp</strong>, trước khi bất kỳ lệnh nào khác — kể cả <code>[[ … ]]</code>, <code>echo</code> hay <code>local</code> — ghi đè nó. Hàm kiểm sức khoẻ bên dưới cũng từng có một lỗi âm thầm cùng họ: <code>code=\$(curl -s -o /dev/null -w '%{http_code}' … || echo 000)</code>. Khi kết nối hỏng, <code>-w</code> <em>ĐÃ</em> in <code>000</code> rồi, <code>|| echo 000</code> lại nối thêm một lần nữa, và biến chứa <code>000000</code>. Bên dưới đã sửa bằng <code>|| true</code>, thứ giữ cho <code>set -e</code> yên mà không thêm chữ nào.</p>


<h3>Một phép kiểm sức khoẻ thật</h3>
<pre><code class="language-bash">check() {
  local url=\$1 expect=\${2:-200} code
  code=\$(curl -s -o /dev/null -w '%{http_code}' \\
         --connect-timeout 3 --max-time 10 "\$url") || true
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

<h3>Bảng cờ: mọi tuỳ chọn curl trong bài này</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>-s</code> / <code>-S</code></td><td>im lặng (không thanh tiến độ) / nhưng vẫn in lỗi</td><td><code>curl -sS URL</code></td></tr>
<tr><td><code>-f</code></td><td>thoát 22 khi HTTP ≥ 400 thay vì 0</td><td><code>curl -sSf URL || die</code></td></tr>
<tr><td><code>-L</code></td><td>đi theo chuyển hướng 301/302</td><td><code>curl -sSfL http://…</code></td></tr>
<tr><td><code>-o FILE</code> / <code>-O</code></td><td>lưu với tên bạn chọn / với tên trong URL</td><td><code>-o page.html</code></td></tr>
<tr><td><code>-C -</code></td><td>nối tiếp một lần tải dở</td><td><code>curl -C - -O URL</code></td></tr>
<tr><td><code>-w FORMAT</code></td><td>in các biến sau khi truyền xong</td><td><code>-w '%{http_code}'</code></td></tr>
<tr><td><code>-I</code> / <code>-i</code></td><td>yêu cầu HEAD (chỉ header) / in header kèm thân</td><td><code>curl -sI URL</code></td></tr>
<tr><td><code>-v</code></td><td>cả cuộc trao đổi ra stderr (<code>*</code> <code>&gt;</code> <code>&lt;</code>)</td><td><code>curl -v URL 2&gt;&amp;1 | less</code></td></tr>
<tr><td><code>-X</code> · <code>-H</code> · <code>-d</code></td><td>phương thức · header · thân (<code>-d</code> ngầm là POST)</td><td><code>-X PUT -H 'Content-Type: application/json' -d @x.json</code></td></tr>
<tr><td><code>--json</code></td><td>thân + header JSON trong một cờ (curl 7.82+)</td><td><code>--json '{"a":1}'</code></td></tr>
<tr><td><code>-H @file</code> · <code>--config</code></td><td>đọc header/tuỳ chọn từ file — bí mật không lộ ra <code>ps</code></td><td><code>-H @auth.txt</code></td></tr>
<tr><td><code>--resolve H:P:IP</code></td><td>gửi tới IP này nhưng giữ tên máy thật cho TLS và Host</td><td><code>--resolve example.com:443:1.2.3.4</code></td></tr>
<tr><td><code>--connect-timeout</code> · <code>--max-time</code></td><td>bỏ cuộc khi kết nối · khi cả request quá lâu</td><td><code>--connect-timeout 3 --max-time 10</code></td></tr>
<tr><td><code>--retry N</code></td><td>thử lại với lỗi thoáng qua và 5xx</td><td><code>--retry 3 --retry-delay 2</code></td></tr>
<tr><td><code>-k</code></td><td>bỏ kiểm chứng chỉ — chỉ cho chứng chỉ tự ký của chính bạn</td><td>không bao giờ trong script production</td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<p>Hàm kiểm sức khoẻ của bài này, đã có bản sửa <code>\$?</code> và bản sửa <code>|| true</code>, chạy với một server cục bộ để không phụ thuộc internet. Trong một container Ubuntu (<code>apt-get install -y curl python3</code>):</p>
<pre><code class="language-bash">python3 -m http.server 19090 --bind 127.0.0.1 &gt;/dev/null 2&gt;&amp;1 &amp;
cat &gt; check.sh &lt;&lt;'EOF'
#!/bin/bash
set -uo pipefail
check() {
  local url=\$1 expect=\${2:-200} code rc
  code=\$(curl -s -o /dev/null -w '%{http_code}' \\
         --connect-timeout 3 --max-time 10 "\$url") &amp;&amp; rc=0 || rc=\$?
  if [[ \$code == "\$expect" ]]; then
    printf '  OK   %-40s %s\\n' "\$url" "\$code"
  else
    printf '  HỎNG %-40s %s (chờ %s, curl thoát %s)\\n' "\$url" "\$code" "\$expect" "\$rc" &gt;&amp;2
    return 1
  fi
}
rc=0
check http://127.0.0.1:19090/               || rc=1
check http://127.0.0.1:19090/khong-co 404   || rc=1
check http://127.0.0.1:19099/               || rc=1
check http://khong-ton-tai-lx09.example/    || rc=1
exit \$rc
EOF
bash check.sh; echo "exit=\$?"</code></pre>
<div class="out">  OK   http://127.0.0.1:19090/                  200
  OK   http://127.0.0.1:19090/khong-co          404
  HỎNG http://127.0.0.1:19099/                  000 (chờ 200, curl thoát 7)
  HỎNG http://khong-ton-tai-lx09.example/       000 (chờ 200, curl thoát 6)
exit=1</div>
<p>Bốn dòng, bốn sự thật khác nhau: một route chạy tốt, một mã 404 đúng như chờ đợi (nên ĐẠT), một cổng không ai nghe (000 và thoát 7 — tầng kết nối), và một cái tên không phân giải được (000 và thoát 6 — DNS). Mã thoát của chính script là 1, nên cron hay CI sẽ nhận ra. (Output ghi trong Ubuntu 24.04, curl 8.5.0.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<ul>
<li><strong>macOS</strong> có curl riêng (<code>curl 8.7.1</code> trên chiếc Mac dùng cho chương này, dựng trên SecureTransport/LibreSSL). Mọi cờ trong bài đều chạy, kể cả <code>--json</code> và <code>-w</code>; các dòng TLS trong <code>-v</code> được diễn đạt khác vì thư viện TLS khác.</li>
<li><strong>Windows</strong> có <code>curl.exe</code> thật từ Windows 10 (1803). Nhưng trong <em>Windows PowerShell 5.1</em>, chữ <code>curl</code> là bí danh của <code>Invoke-WebRequest</code>, thứ không hiểu <code>-sSf</code> — ở đó hãy gõ <code>curl.exe</code>. PowerShell 7 đã bỏ bí danh này.</li>
<li><strong>WSL</strong> dùng curl của Ubuntu, y hệt bài này. Bên trong WSL2, <code>localhost</code> là máy WSL; muốn gọi một server chạy trên chính Windows có thể phải dùng IP của máy Windows, tuỳ chế độ mạng.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> mai nhóm bạn demo, máy chiếu của giảng viên sẽ gọi ba URL. Bạn muốn một script nói bằng chữ thường xem tầng nào hỏng — chứ không chỉ "failed".</p><ol>
<li>Trong container, chạy hai server cục bộ: một ở <code>127.0.0.1:19090</code>, một ở <code>127.0.0.1:19091</code>. Chép <code>check.sh</code> ở "Chạy thử từng bước" và thêm một phép kiểm cho <code>http://127.0.0.1:19091/</code>.</li>
<li>Thêm một <code>case "\$rc"</code> sau dòng HỎNG in <code>DNS</code> với 6, <code>không ai nghe</code> với 7, <code>hết giờ</code> với 28 — chụp <code>rc</code> ngay trên dòng của curl, không bao giờ trong <code>then</code> của một <code>if !</code>.</li>
<li>Giết server thứ hai (<code>kill %2</code>) rồi chạy lại script; sau đó thêm <code>--max-time 2</code> và cho một phép kiểm chĩa vào <code>http://10.255.255.1/</code>.</li>
<li>Đo bốn chặng thời gian của <code>https://example.com/</code> ba lần bằng <code>-w</code> và ghi lại chặng nào dao động nhiều nhất.</li></ol>
<p><strong>Đạt khi:</strong> script in một dòng cho mỗi URL với đúng tên tầng (DNS / không ai nghe / hết giờ / mã HTTP), thoát 1 khi có gì hỏng, và bạn đọc được con số TCP và TLS do chính mình đo.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Exit status (mã thoát)</span><span class="v">Con số curl trả về: 0 thành công, 6 DNS, 7 kết nối, 22 lỗi HTTP khi có <code>-f</code>, 28 hết giờ.</span></div>
  <div class="kv"><span class="k">Status code (mã trạng thái HTTP)</span><span class="v">Câu trả lời HTTP của máy chủ (200, 301, 401, 404, 500) — khác với mã thoát của curl.</span></div>
  <div class="kv"><span class="k">Redirect (chuyển hướng)</span><span class="v">Mã 301/302 bảo trình khách đi chỗ khác; <code>-L</code> đi theo nó.</span></div>
  <div class="kv"><span class="k">Handshake (bắt tay)</span><span class="v">Các vòng đi-về trước khi dữ liệu chảy: TCP (SYN, SYN-ACK, ACK), rồi TLS.</span></div>
  <div class="kv"><span class="k">TTFB (thời gian tới byte đầu)</span><span class="v">Lúc byte đầu tiên của câu trả lời từ máy chủ về tới nơi.</span></div>
  <div class="kv"><span class="k">Write-out — <code>-w</code> (mẫu in)</span><span class="v">Khuôn của curl để in các con số về lần truyền sau khi xong.</span></div>
  <div class="kv"><span class="k">Certificate (chứng chỉ)</span><span class="v">Thứ chứng minh tên máy chủ trong TLS; <code>-v</code> cho thấy chủ thể, nơi cấp, hạn dùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mặc định của curl sai cho script: dùng <code>-sSfL</code> và luôn có <code>--max-time</code>.</li>
<li><code>-w</code> in đúng con số bạn cần; các biến thời gian là cộng dồn, trừ hai mốc liền nhau để ra từng chặng.</li>
<li>Mã thoát gọi tên tầng: 6 DNS, 7 không ai nghe hoặc bị từ chối, 28 bị vứt hoặc treo, 22 ứng dụng nói không.</li>
<li>Lưu <code>\$?</code> ngay dòng sau; trong <code>then</code> của <code>if !</code> nó luôn là 0.</li>
<li><code>-w '%{http_code}'</code> đã tự in <code>000</code> khi hỏng — đừng thêm <code>|| echo 000</code>.</li>
<li><code>curl -v</code> là phép kiểm chứng chỉ và header nhanh nhất; <code>-k</code> giấu vấn đề chứ không chữa nó.</li>
</ul>

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
${slide('lx-09', 13, 'Khoá công khai / khoá bí mật và khoá máy chủ')}
${slide('lx-09', 14, 'ssh-keygen, ssh-copy-id và quyền 700/600')}
<pre><code class="language-bash">ssh-keygen -t ed25519 -C "deploy@laptop"          <span class="tok-comment"># the modern default</span>
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
<pre><code class="language-bash">ssh-copy-id -i ~/.ssh/id_vps.pub deploy@vps       <span class="tok-comment"># installs it correctly</span>

<span class="tok-comment"># What it does, by hand — note the permissions (Chapter 4)</span>
cat ~/.ssh/id_vps.pub | ssh deploy@vps \\
  'mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh &amp;&amp; cat &gt;&gt; ~/.ssh/authorized_keys &amp;&amp; chmod 600 ~/.ssh/authorized_keys'</code></pre>
<div class="callout warn">SSH refuses a private key that others can read, and refuses <em>loudly</em> rather than falling back to a password — <code>UNPROTECTED PRIVATE KEY FILE</code>, and it ignores the key entirely. The required modes from Lesson 4.2: <code>700</code> on <code>~/.ssh</code>, <code>600</code> on private keys and on <code>authorized_keys</code>, <code>644</code> on <code>.pub</code> files. Note it also checks your <em>home directory</em>: if <code>~</code> is group-writable, sshd on the server may reject the key with nothing but "Permission denied (publickey)" in your terminal. The server's <code>/var/log/auth.log</code> says which check failed.</div>

<h3>~/.ssh/config — the highest-value file in this lesson</h3>
${slide('lx-09', 15, '~/.ssh/config, ProxyJump và ControlMaster')}
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
<pre><code class="language-bash">ssh -p 2222 -i ~/.ssh/id_vps deploy@203.0.113.42     <span class="tok-comment"># before</span>
ssh vps                                              <span class="tok-comment"># after</span>
scp file.txt vps:/srv/app/                           <span class="tok-comment"># scp, rsync and git use it too</span></code></pre>
<div class="callout ok">Three settings earn their place immediately. <strong><code>ProxyJump</code></strong> reaches a machine with no public address through one that has one — a single hop, no manual tunnel, and <code>scp</code> and <code>rsync</code> understand it as well. <strong><code>ControlMaster</code></strong> reuses one TCP connection for every subsequent session to the same host, so the second <code>ssh vps</code> is instant and a script making twenty calls pays the handshake once. <strong><code>IdentitiesOnly yes</code></strong> stops SSH offering every key in your agent to every server; without it a host with several keys can hit <code>Too many authentication failures</code> before reaching the right one.</div>
<pre><code class="language-bash">ssh -O check vps        <span class="tok-comment"># is a shared connection alive?</span>
ssh -O exit vps         <span class="tok-comment"># close it (needed after changing config)</span>
ssh -G vps | head -20   <span class="tok-comment"># the FULLY resolved settings for this host</span></code></pre>
<p><code>ssh -G</code> is the debugging command: it prints exactly which options apply after all the <code>Host</code> blocks have been merged, which settles any question about why a connection used the wrong key or the wrong port.</p>

<h3>Measured: what the config file buys you</h3>
<p>The lab behind every SSH output in this chapter: three Ubuntu 24.04 containers on two private Docker networks — <code>laptop</code> (user <code>an</code>, 172.21.0.3), <code>vps</code> (user <code>deploy</code>, 172.21.0.2, also on the internal network as 172.22.0.3) and <code>db</code> (user <code>admin</code>, 172.22.0.2, reachable <em>only</em> from vps). The key was made with <code>ssh-keygen -t ed25519</code> and installed with <code>ssh-copy-id</code>; the laptop's config has <code>Host vps</code>, <code>Host db</code> with <code>ProxyJump vps</code>, and a <code>Host *</code> block like the one above, with the lab's addresses and port 22.</p>
<pre><code class="language-bash">ssh -G vps | grep -E "^(hostname|user|port) "
ssh db "hostname; hostname -I"                          <span class="tok-comment"># through vps, thanks to ProxyJump</span>
ssh -o ProxyJump=none -o ControlPath=none admin@172.22.0.2 true   <span class="tok-comment"># straight there: impossible</span></code></pre>
<div class="out">user deploy
hostname 172.21.0.2
port 22
db
172.22.0.2
ssh: connect to host 172.22.0.2 port 22: Connection timed out</div>
<p>And ControlMaster, timed with <code>date +%s%N</code> around <code>ssh vps true</code>: the first connection took <strong>171 ms</strong> (TCP, key exchange, authentication), the second <strong>6 ms</strong>, because it reused the master connection that <code>ssh -O check vps</code> reports as <code>Master running (pid=256)</code>. A deploy script that calls <code>ssh</code> twenty times pays the handshake once. One trap found while measuring: with <code>ControlPersist</code>, a command like <code>ssh -o ProxyJump=none host</code> can silently <em>reuse</em> an existing master and ignore your new option — that is why the test above adds <code>-o ControlPath=none</code>, and why the lesson says to run <code>ssh -O exit</code> after changing the config.</p>

<h3>Match exec: when the school network blocks port 22</h3>

${slide('lx-09', 16, 'Match exec: mạng trường chặn cổng 22')}
<p>A real story from the project behind this course: the university network only lets ports 80, 443, 587 and 993 out, so <code>ssh vps</code> simply times out on campus while it works at home. The server was given a second SSH listener on port 993, and the Mac's <code>~/.ssh/config</code> chooses the port by itself, depending on which network the laptop is on:</p>
<pre><code><span class="tok-comment"># ~/.ssh/config on the Mac — the Match block must come FIRST</span>
Match originalhost vps exec "ipconfig getifaddr en0 | grep -q '^10\\.'"
    Port 993

Host vps
    HostName 203.0.113.42
    User deploy
    Port 22</code></pre>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>Match … exec "command"</code></td><td>the block applies only when the command exits 0 — any shell test you like</td></tr>
<tr><td><code>originalhost vps</code></td><td>the name exactly as you typed it; <code>host</code> would match after <code>HostName</code> is substituted</td></tr>
<tr><td><code>ipconfig getifaddr en0</code></td><td>the Mac's Wi-Fi IPv4 address (the school hands out 10.x addresses); on Linux use <code>ip -4 -br addr show wlan0</code></td></tr>
</table>
<p>Why must <code>Match</code> come first? Because <strong><code>ssh_config</code> uses the first value it obtains for each keyword</strong> (ssh_config(5): "the first obtained value will be used"). Measured in the lab, with the condition faked by <code>test -f /tmp/o-truong</code>:</p>
<pre><code class="language-bash">touch /tmp/o-truong                      <span class="tok-comment"># pretend we are at school</span>
ssh -G vps | grep ^port                  <span class="tok-comment"># Match placed BEFORE Host vps</span>
ssh -v vps true 2&gt;&amp;1 | grep Connecting
ssh -F cfg-sai -G vps | grep ^port       <span class="tok-comment"># same Match block placed AFTER Host vps</span></code></pre>
<div class="out">port 993
debug1: Connecting to 172.21.0.2 [172.21.0.2] port 993.
port 22</div>
<p>With the block after <code>Host vps</code>, the <code>Port 22</code> line was read first and the 993 never takes effect — no error, no warning. It is the same rule that makes <code>Host *</code> belong at the end of the file, and the same rule <code>sshd</code> applies on the server side (below). Always check with <code>ssh -G</code>, never by reading the file.</p>


<h3>The agent</h3>
<pre><code>eval "\$(ssh-agent -s)"          <span class="tok-comment"># usually already running on a desktop</span>
ssh-add ~/.ssh/id_vps           <span class="tok-comment"># type the passphrase once</span>
ssh-add -l                      <span class="tok-comment"># what is loaded</span>
ssh-add -t 8h ~/.ssh/id_vps     <span class="tok-comment"># forget it after 8 hours</span>
ssh-add -D                      <span class="tok-comment"># forget everything now</span></code></pre>
<p>The agent holds the decrypted key in memory and answers challenges on your behalf. With <code>AddKeysToAgent yes</code> in your config, the first connection of the day prompts and every later one is silent.</p>
<div class="callout warn"><strong>Agent forwarding (<code>-A</code>) is convenient and genuinely risky.</strong> It lets a process on the remote host use your local keys — which means <em>root on that host, or anyone who compromises it</em>, can authenticate as you to every server your agent holds a key for, for as long as you are connected. It leaves no trace on your machine. Prefer <code>ProxyJump</code>, which tunnels through the intermediate host without exposing your agent to it. If you must forward, forward to hosts you administer, and never with <code>ForwardAgent yes</code> under <code>Host *</code>.</div>

<h3>Port forwarding</h3>
${slide('lx-09', 17, 'Đường hầm -L, -R, -D và ProxyJump')}
<pre><code class="language-bash"><span class="tok-comment"># LOCAL: bring a remote port to your machine</span>
ssh -L 5432:localhost:5432 vps</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">You connect to</span><span class="lz-t">localhost:5432 on your laptop</span><span class="lz-d">A normal client — psql, TablePlus, your app — connects to your own machine.</span></div>
  <div class="lz-step"><span class="lz-k">SSH carries it</span><span class="lz-t">encrypted, over the existing session</span><span class="lz-d">No extra port opened on the internet, no VPN, nothing to configure on the server.</span></div>
  <div class="lz-step"><span class="lz-k">The VPS connects to</span><span class="lz-t">localhost:5432 — from ITS point of view</span><span class="lz-d">Which is the database bound to 127.0.0.1 and deliberately unreachable from outside (Lesson 9.1).</span></div>
  <div class="lz-step"><span class="lz-k">Result</span><span class="lz-t">a private database, reachable only by people with SSH access</span><span class="lz-d">Strictly better than exposing 5432 to the internet with a password on it.</span></div>
</div>
<pre><code class="language-bash">ssh -L 5432:localhost:5432 vps           <span class="tok-comment"># database</span>
ssh -L 8080:localhost:3000 vps           <span class="tok-comment"># an app not exposed publicly</span>
ssh -L 9000:10.0.1.15:5432 vps           <span class="tok-comment"># a THIRD host, reached via the VPS</span>
ssh -fNL 5432:localhost:5432 vps         <span class="tok-comment"># -f background, -N no shell: just the tunnel</span>

<span class="tok-comment"># REMOTE: expose YOUR local port on the server</span>
ssh -R 8000:localhost:3000 vps           <span class="tok-comment"># let the server reach your dev machine</span>

<span class="tok-comment"># DYNAMIC: a SOCKS proxy through the server</span>
ssh -D 1080 vps                          <span class="tok-comment"># point a browser at localhost:1080</span></code></pre>
<div class="callout ok"><code>ssh -L</code> is the correct answer to "how do I connect to production Postgres from my laptop". Keep the database bound to <code>127.0.0.1</code>, open no firewall port, and let SSH — already authenticated, already encrypted, already audited — carry the connection. Anyone who loses SSH access loses database access at the same moment, which is exactly the property you want.</div>

<h3>Measured: three tunnels between containers</h3>
<p>In the lab, <code>vps</code> runs a small web server bound to <code>127.0.0.1:19092</code> (standing in for Postgres), <code>db</code> runs one on port 19093, and the laptop runs a dev server on <code>127.0.0.1:19096</code>:</p>
<pre><code class="language-bash">curl -sS http://172.21.0.2:19092/                   <span class="tok-comment"># before: loopback-only, unreachable</span>
ssh -fN -L 19094:localhost:19092 vps
ssh -fN -L 19095:172.22.0.2:19093 vps              <span class="tok-comment"># a THIRD machine, via vps</span>
ssh -fN -R 19097:localhost:19096 vps
ssh -fN -D 19098 vps
ss -tlnp | grep ssh                                 <span class="tok-comment"># who listens now, on the laptop</span>
curl -sS http://localhost:19094/
curl -sS http://localhost:19095/
ssh vps 'ss -tln | grep 19097; curl -sS http://localhost:19097/'
curl -sS --socks5-hostname localhost:19098 http://172.22.0.2:19093/</code></pre>
<div class="out">curl: (7) Failed to connect to 172.21.0.2 port 19092 after 0 ms: Couldn't connect to server
LISTEN 0      128        127.0.0.1:19098      0.0.0.0:*    users:(("ssh",pid=295,fd=5))
LISTEN 0      128        127.0.0.1:19094      0.0.0.0:*    users:(("ssh",pid=286,fd=5))
LISTEN 0      128        127.0.0.1:19095      0.0.0.0:*    users:(("ssh",pid=289,fd=5))
…
tu VPS: Postgres gia (127.0.0.1)
tu DB: may rieng 172.22.0.2
LISTEN 0      128        127.0.0.1:19097      0.0.0.0:*
…
tu LAPTOP: may dev cua an
tu DB: may rieng 172.22.0.2</div>
<p>Three details the diagrams usually leave out. First, every forwarded port is bound to <code>127.0.0.1</code> — on the laptop for <code>-L</code>/<code>-D</code>, and on the <em>server</em> for <code>-R</code> — so a tunnel does not expose anything to the network unless you ask (<code>GatewayPorts</code> on the server, or <code>-L 0.0.0.0:…</code>). Second, in <code>-L 19095:172.22.0.2:19093</code> the address is resolved and connected <em>by vps</em>, which is why the laptop can reach a machine it has no route to. Third, <code>-f -N</code> leaves background <code>ssh</code> processes behind; stop them with <code>kill</code> — their PIDs are in the <code>ss</code> output. (The lab added <code>-o ControlPath=none</code> to each so every tunnel is its own process; through a ControlMaster they would ride the shared connection and end with <code>ssh -O exit vps</code>.)</p>
<table>
<tr><th>Flag</th><th>Opens a listener on</th><th>Traffic goes to</th><th>Typical use</th></tr>
<tr><td><code>-L lport:host:rport</code></td><td>your machine</td><td><code>host:rport</code> as seen from the server</td><td>a database or admin panel that only listens on the server's loopback</td></tr>
<tr><td><code>-R rport:host:lport</code></td><td>the server</td><td><code>host:lport</code> as seen from your machine</td><td>let the server (or a webhook on it) reach your dev machine</td></tr>
<tr><td><code>-D port</code></td><td>your machine, as a SOCKS5 proxy</td><td>wherever each request asks</td><td>browse a whole private network through the server</td></tr>
<tr><td><code>-J host</code> / <code>ProxyJump</code></td><td>—</td><td>the next SSH hop</td><td>reach a private host without agent forwarding</td></tr>
</table>


<h3>Running commands and scripts remotely</h3>
<pre><code class="language-bash">ssh vps 'uptime'
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
<div class="callout">Measured in the lab, because "dies from SIGHUP" is only half the story. Without a terminal (plain <code>ssh vps 'job &amp;'</code>), nothing sends SIGHUP; instead the command <em>does not return</em> while the job keeps the channel's output open. When the connection then drops — a laptop lid, a Wi-Fi hiccup, simulated here with <code>timeout 3 ssh …</code> — a job that prints progress dies at its next write, into a channel that no longer exists: a 20-step loop stopped after writing step 3. With a terminal (<code>ssh -t</code>, or an interactive session) the job dies from SIGHUP instead. With output redirected (<code>ssh vps 'job &gt; job.log 2&gt;&amp;1 &amp;'</code>) it returned at once and survived. Different mechanisms, same lesson: <code>tmux new -d</code> is the only form that survives <em>and</em> lets you look at the job later with <code>ssh -t vps tmux attach -t deploy</code>.</div>

<h3>When the connection drops: three tmux commands</h3>
<p>Lesson 5.4 covers tmux in depth; for SSH work three commands are enough. Make the first one a habit every time you log in to a server:</p>
<pre><code class="language-bash">ssh -t vps tmux new -A -s main     <span class="tok-comment"># attach to "main", or create it if it does not exist</span>
<span class="tok-comment"># … work … the Wi-Fi drops … reconnect:</span>
ssh -t vps tmux new -A -s main     <span class="tok-comment"># same command: you are back where you were</span>
tmux ls                            <span class="tok-comment"># on the server: which sessions exist</span></code></pre>
<p><code>-t</code> gives tmux the terminal it needs; <code>-A</code> means "attach if it exists". Inside tmux, <code>Ctrl-B</code> then <code>d</code> detaches on purpose. <code>ServerAliveInterval 60</code> in <code>~/.ssh/config</code> makes a dead connection fail within a few minutes instead of hanging forever — tmux makes sure that failure costs you nothing.</p>

<pre><code class="language-bash"><span class="tok-comment"># The quoting question: which machine expands the variable?</span>
ssh vps "echo \$HOSTNAME"      <span class="tok-comment"># double quotes → YOUR hostname, expanded locally</span>
ssh vps 'echo \$HOSTNAME'      <span class="tok-comment"># single quotes → the SERVER's hostname</span></code></pre>
<div class="out">laptop
vps</div>
<p>This is Lesson 6.2 with a second machine attached, and it is worth pausing on: with double quotes the local shell substitutes before SSH sends anything. Both forms are useful — you often <em>want</em> to interpolate a local variable into a remote command — but confusing them produces commands that run against the wrong values with no error.</p>

<h3>Hardening sshd</h3>
${slide('lx-09', 18, 'sshd: giá trị ĐẦU TIÊN thắng — 01- thắng 50-, 99- thua')}
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/01-hardening.conf   (01-, not 99- — see below)</span>
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
<pre><code class="language-bash">sudo sshd -t                          <span class="tok-comment"># TEST the config — always, first</span>
sudo systemctl reload ssh             <span class="tok-comment"># reload, do not restart</span></code></pre>
<div class="callout warn"><strong>Keep your current session open while you do this, and test with a second terminal.</strong> A config error plus a restart is how people lock themselves out of a machine with no console access. <code>sshd -t</code> validates the file, <code>reload</code> leaves existing connections alive, and the new terminal proves you can still get in. Only then close the first one. This is the same discipline as <code>visudo</code> in Lesson 4.4, for the same reason.</div>
<pre><code class="language-bash"><span class="tok-comment"># Modern Ubuntu: drop-in files, do not edit the main config</span>
ls /etc/ssh/sshd_config.d/

<span class="tok-comment"># What is actually in effect after all includes</span>
sudo sshd -T | grep -Ei 'permitrootlogin|passwordauth|allowusers|port'</code></pre>
<div class="out">port 2222
permitrootlogin no
passwordauthentication no
allowusers deploy</div>
<p><code>sshd -T</code> is the server-side counterpart of <code>ssh -G</code>: it prints the fully resolved configuration, so you never have to reason about which of several files won. Use it to confirm a change took effect, rather than assuming the file you edited is the one being read.</p>

<h3>First value wins: why 99-hardening.conf changes nothing</h3>
<p>This lesson used to name the example file <code>99-hardening.conf</code>, and on a cloud image that name silently does nothing. Many Ubuntu cloud images contain <code>/etc/ssh/sshd_config.d/50-cloud-init.conf</code> with the single line <code>PasswordAuthentication yes</code>. The main config pulls the directory in with <code>Include /etc/ssh/sshd_config.d/*.conf</code> near its top, the glob is read in alphabetical order, and — exactly like <code>ssh_config</code> — <strong>sshd keeps the first value it reads for each keyword</strong> (sshd_config(5)). So <code>50-</code> beats <code>99-</code>. Reproduced on Ubuntu 24.04 with OpenSSH 9.6:</p>
<pre><code class="language-bash">ls /etc/ssh/sshd_config.d/
sshd -t &amp;&amp; echo OK
sshd -T | grep -E "^(passwordauthentication|permitrootlogin) "
<span class="tok-comment"># from the laptop, password only:</span>
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password vps 'echo "logged in with a PASSWORD"'</code></pre>
<div class="out">50-cloud-init.conf
99-hardening.conf
OK
permitrootlogin no
passwordauthentication yes
logged in with a PASSWORD</div>
<p><code>PermitRootLogin no</code> from the same file <em>did</em> apply — nobody else set it — which is the tell-tale sign of an ordering collision rather than a syntax error. Rename and reload:</p>
<pre><code class="language-bash">mv /etc/ssh/sshd_config.d/99-hardening.conf /etc/ssh/sshd_config.d/01-hardening.conf
kill -HUP \$(ss -tlnpH "sport = :22" | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)   <span class="tok-comment"># = systemctl reload ssh</span>
sshd -T | grep ^passwordauthentication
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password vps true</code></pre>
<div class="out">passwordauthentication no
deploy@172.21.0.2: Permission denied (publickey).</div>
<p>Two things to take away. <code>sshd -t</code> only checks <em>syntax</em> — it printed OK for the broken setup. The acceptance test is <code>sshd -T</code> (the values in effect) plus a real login attempt from a second terminal. And <code>01-</code> is more robust than editing <code>50-cloud-init.conf</code>: if cloud-init rewrites its file when the machine is rebuilt, your <code>01-</code> file still wins. (The container has no systemd, so the lab sends SIGHUP to the listener directly; note that <code>pkill -xf /usr/sbin/sshd</code> matches nothing on OpenSSH 9.6, because the listener renames itself <code>sshd: /usr/sbin/sshd [listener] 0 of 10-100 startups</code> — Lesson 5.3's lesson about process names again.)</p>


<h3>When it will not connect</h3>
${slide('lx-09', 19, 'Đọc đúng câu lỗi SSH, và đừng để việc chết theo phiên')}
<pre><code class="language-bash">ssh -v vps                     <span class="tok-comment"># -v, -vv, -vvv: increasing detail</span>
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
<p>What "verify the fingerprint" means in practice — the server administrator runs <code>ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub</code> on the server, you run this and compare the two strings:</p>
<pre><code>ssh-keyscan -t ed25519 172.21.0.2 2&gt;/dev/null | ssh-keygen -lf -</code></pre>
<div class="out">256 SHA256:jggiJjPdbvroyLR+7Aki1B75zHu2PvT1dywocd0aSqs 172.21.0.2 (ED25519)</div>
<p>Only when they match is <code>ssh-keygen -R 172.21.0.2</code> safe. Two more messages reproduced in the lab: <code>chmod 644</code> on the private key produced <code>WARNING: UNPROTECTED PRIVATE KEY FILE! … This private key will be ignored.</code>; and a home directory set to <code>777</code> on the server made sshd log <code>Authentication refused: bad ownership or modes for directory /home/deploy</code> while the client only saw <code>Permission denied (publickey,password)</code>. (Ubuntu's OpenSSH still accepted a <code>775</code> home when the group contained only that user.)</p>

<h3>Flag table: ssh options worth knowing</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>-p PORT</code></td><td>port (note: <code>scp</code> uses <code>-P</code>)</td><td><code>ssh -p 993 deploy@host</code></td></tr>
<tr><td><code>-i FILE</code></td><td>which private key to offer</td><td><code>-i ~/.ssh/id_vps</code></td></tr>
<tr><td><code>-v</code> / <code>-vv</code> / <code>-vvv</code></td><td>debug output, increasing detail</td><td><code>ssh -v vps 2&gt;&amp;1 | grep -E 'Offering|Connecting'</code></td></tr>
<tr><td><code>-G</code></td><td>print the resolved config and exit — connects nowhere</td><td><code>ssh -G vps | grep ^port</code></td></tr>
<tr><td><code>-F FILE</code></td><td>use another config file</td><td><code>ssh -F ./test.conf vps</code></td></tr>
<tr><td><code>-o KEY=VALUE</code></td><td>any config option on the command line</td><td><code>-o ConnectTimeout=5</code></td></tr>
<tr><td><code>-J HOST</code></td><td>ProxyJump for this one command</td><td><code>ssh -J vps admin@10.0.1.15</code></td></tr>
<tr><td><code>-L</code> · <code>-R</code> · <code>-D</code></td><td>local · remote · dynamic forwarding</td><td><code>-L 5432:localhost:5432</code></td></tr>
<tr><td><code>-N</code> · <code>-f</code></td><td>no remote command · go to background</td><td><code>ssh -fN -L …</code></td></tr>
<tr><td><code>-t</code></td><td>force a terminal (needed for tmux, sudo prompts)</td><td><code>ssh -t vps tmux attach</code></td></tr>
<tr><td><code>-O check|exit</code></td><td>talk to the ControlMaster</td><td><code>ssh -O exit vps</code></td></tr>
<tr><td><code>-A</code></td><td>forward your agent — risky, prefer <code>-J</code></td><td>only to machines you administer</td></tr>
</table>


<h3>Try it step by step</h3>
<p>The whole lab fits on one laptop with Docker, and never touches your real <code>~/.ssh</code>: the keys live inside the "laptop" container.</p>
<pre><code class="language-bash">docker network create lx09-lab
docker run -d --name lx09-vps --hostname vps --network lx09-lab ubuntu:24.04 sleep infinity
docker run -d --name lx09-laptop --hostname laptop --network lx09-lab ubuntu:24.04 sleep infinity
docker exec lx09-vps bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq openssh-server &gt;/dev/null
  useradd -m -s /bin/bash deploy &amp;&amp; echo deploy:matkhau123 | chpasswd
  mkdir -p /run/sshd &amp;&amp; /usr/sbin/sshd'
docker exec lx09-laptop bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq openssh-client &gt;/dev/null'
docker exec -it lx09-laptop bash
<span class="tok-comment"># now inside the laptop container:</span>
ssh-keygen -t ed25519 -C "an@laptop"                 <span class="tok-comment"># set a passphrase this time</span>
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@lx09-vps  <span class="tok-comment"># asks for matkhau123 once</span>
printf 'Host vps\\n  HostName lx09-vps\\n  User deploy\\n' &gt; ~/.ssh/config
ssh vps hostname
ssh -G vps | grep -E '^(hostname|user|port) '</code></pre>
<div class="out">vps
user deploy
hostname lx09-vps
port 22</div>
<p>From there every experiment in this lesson works: add <code>Host *</code> with ControlMaster and time two connections, start <code>python3 -m http.server 19092 --bind 127.0.0.1</code> on vps and reach it with <code>-L</code>, or add the two drop-in files and watch <code>sshd -T</code> change. Remove everything with <code>docker rm -f lx09-vps lx09-laptop &amp;&amp; docker network rm lx09-lab</code>.</p>

<h3>On macOS and WSL: what is different</h3>
<ul>
<li><strong>macOS</strong> ships OpenSSH (10.3 on the Mac used here) including <code>ssh-copy-id</code>. Two Apple additions: <code>UseKeychain yes</code> in <code>~/.ssh/config</code> and <code>ssh-add --apple-use-keychain ~/.ssh/id_ed25519</code> store the key's passphrase in the macOS Keychain, so you type it once per machine, not once per boot. <code>ipconfig getifaddr en0</code> (used in the <code>Match exec</code> above) exists only on macOS.</li>
<li><strong>Windows 10/11</strong> includes an OpenSSH client (<code>ssh</code>, <code>scp</code>, <code>ssh-keygen</code> in PowerShell); its files live in <code>C:\\Users\\you\\.ssh\\</code>. There is no <code>ssh-copy-id</code> — append the <code>.pub</code> to the server's <code>authorized_keys</code> by hand.</li>
<li><strong>WSL</strong> has its own, separate <code>~/.ssh</code>. Copying a key from Windows into <code>/mnt/c/…</code> and using it from there usually fails with <code>UNPROTECTED PRIVATE KEY FILE</code>, because files on the Windows drive show up as <code>0777</code> unless metadata is enabled; copy it into the Linux home and <code>chmod 600</code> it.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team's VPS must allow key logins only, and the teammate who writes the backend wants to open the production Postgres in TablePlus without anyone opening port 5432. Use the two containers from "Try it step by step".</p><ol>
<li>Generate an ed25519 key <em>with a passphrase</em> on the laptop, install it with <code>ssh-copy-id</code>, and write <code>~/.ssh/config</code> with <code>Host vps</code> plus a <code>Host *</code> block that has <code>ServerAliveInterval 60</code> and ControlMaster.</li>
<li>On vps, start <code>python3 -m http.server 19092 --bind 127.0.0.1</code> (install python3 first). From the laptop, prove <code>curl lx09-vps:19092</code> fails, then open <code>ssh -fN -L 15432:localhost:19092 vps</code> and <code>curl localhost:15432</code>.</li>
<li>On vps, create <code>/etc/ssh/sshd_config.d/50-cloud-init.conf</code> containing <code>PasswordAuthentication yes</code> and <code>99-hardening.conf</code> containing <code>PasswordAuthentication no</code>; read <code>sshd -T</code>; rename to <code>01-hardening.conf</code>; reload by sending SIGHUP to the listener; read <code>sshd -T</code> again.</li>
<li>Prove it from a second shell on the laptop: <code>ssh -o PubkeyAuthentication=no vps true</code> must now fail, and <code>ssh vps true</code> must still work.</li></ol>
<p><strong>Done when:</strong> <code>curl localhost:15432</code> returns the directory listing, <code>sshd -T</code> changes from <code>passwordauthentication yes</code> to <code>no</code> only after the rename, and the password-only login ends with <code>Permission denied (publickey)</code> while the key login still works.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Key pair</span><span class="v">A private key that never leaves your machine and a public key you hand out freely.</span></div>
  <div class="kv"><span class="k">authorized_keys</span><span class="v">The list of public keys allowed to log in as that user on the server.</span></div>
  <div class="kv"><span class="k">Host key / known_hosts</span><span class="v">The server's own key, and your list of servers you have already trusted.</span></div>
  <div class="kv"><span class="k">Fingerprint</span><span class="v">A short hash of a key (<code>SHA256:…</code>) that people compare by eye.</span></div>
  <div class="kv"><span class="k">Jump host (ProxyJump)</span><span class="v">A machine you pass through to reach one with no public address.</span></div>
  <div class="kv"><span class="k">Port forwarding / tunnel</span><span class="v">Carrying a TCP port through an SSH connection: <code>-L</code>, <code>-R</code>, <code>-D</code>.</span></div>
  <div class="kv"><span class="k">Drop-in file</span><span class="v">A small config file in a <code>.d/</code> directory that is read along with the main file.</span></div>
  <div class="kv"><span class="k">First obtained value wins</span><span class="v">The rule of both ssh_config and sshd_config: the earliest setting of a keyword is the one used.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Keys, not passwords: the private key signs a fresh challenge each time and never crosses the network; permissions must be 700/600.</li>
<li><code>~/.ssh/config</code> turns every command into <code>ssh vps</code>; <code>ssh -G</code> shows what really applies.</li>
<li>Both client and server keep the <em>first</em> value of each keyword: put <code>Match</code> blocks before <code>Host</code> blocks and name hardening files <code>01-…</code>.</li>
<li><code>-L</code> brings a remote port to you, <code>-R</code> exposes yours on the server, <code>-D</code> is a SOCKS proxy; all bind to 127.0.0.1 by default.</li>
<li><code>sshd -t</code> checks syntax only; accept a change with <code>sshd -T</code> and a real login from a second terminal.</li>
<li>A plain <code>&amp;</code> over SSH is not detached; run long jobs in <code>tmux new -d</code> and reattach with <code>ssh -t vps tmux attach</code>.</li>
</ul>

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
${slide('lx-09', 13, 'Khoá công khai / khoá bí mật và khoá máy chủ')}
${slide('lx-09', 14, 'ssh-keygen, ssh-copy-id và quyền 700/600')}
<pre><code class="language-bash">ssh-keygen -t ed25519 -C "deploy@laptop"          <span class="tok-comment"># mặc định đời mới</span>
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
<pre><code class="language-bash">ssh-copy-id -i ~/.ssh/id_vps.pub deploy@vps       <span class="tok-comment"># cài đặt cho đúng cách</span>

<span class="tok-comment"># Nó làm gì, nếu làm tay — để ý các quyền (Chương 4)</span>
cat ~/.ssh/id_vps.pub | ssh deploy@vps \\
  'mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh &amp;&amp; cat &gt;&gt; ~/.ssh/authorized_keys &amp;&amp; chmod 600 ~/.ssh/authorized_keys'</code></pre>
<div class="callout warn">SSH từ chối một khoá riêng mà người khác đọc được, và nó từ chối một cách <em>ỒN ÀO</em> chứ không lặng lẽ lùi về dùng mật khẩu — <code>UNPROTECTED PRIVATE KEY FILE</code>, và nó bỏ qua cái khoá hoàn toàn. Các chế độ bắt buộc theo Bài 4.2: <code>700</code> cho <code>~/.ssh</code>, <code>600</code> cho khoá riêng và cho <code>authorized_keys</code>, <code>644</code> cho các file <code>.pub</code>. Lưu ý nó còn kiểm cả <em>THƯ MỤC NHÀ</em> của bạn: nếu <code>~</code> cho nhóm ghi được, sshd trên máy chủ có thể từ chối cái khoá mà terminal của bạn chỉ hiện lên mỗi dòng "Permission denied (publickey)". File <code>/var/log/auth.log</code> trên máy chủ mới nói cho bạn biết phép kiểm nào đã trượt.</div>

<h3>~/.ssh/config — file giá trị nhất trong bài này</h3>
${slide('lx-09', 15, '~/.ssh/config, ProxyJump và ControlMaster')}
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
<pre><code class="language-bash">ssh -p 2222 -i ~/.ssh/id_vps deploy@203.0.113.42     <span class="tok-comment"># trước</span>
ssh vps                                              <span class="tok-comment"># sau</span>
scp file.txt vps:/srv/app/                           <span class="tok-comment"># scp, rsync và git cũng dùng nó</span></code></pre>
<div class="callout ok">Ba thiết lập xứng đáng có mặt ngay lập tức. <strong><code>ProxyJump</code></strong> với tới một máy không có địa chỉ công khai thông qua một máy có — một chặng duy nhất, không phải dựng đường hầm bằng tay, và <code>scp</code> cùng <code>rsync</code> cũng hiểu nó. <strong><code>ControlMaster</code></strong> dùng lại một kết nối TCP cho mọi phiên tiếp theo tới cùng một máy, nên lệnh <code>ssh vps</code> thứ hai là tức thì và một script gọi hai mươi lần chỉ trả giá bắt tay đúng một lần. <strong><code>IdentitiesOnly yes</code></strong> ngăn SSH chào mọi khoá trong agent của bạn với mọi máy chủ; không có nó, một máy có nhiều khoá có thể dính <code>Too many authentication failures</code> trước khi tới được cái khoá đúng.</div>
<pre><code class="language-bash">ssh -O check vps        <span class="tok-comment"># kết nối dùng chung còn sống không?</span>
ssh -O exit vps         <span class="tok-comment"># đóng nó (cần làm sau khi đổi cấu hình)</span>
ssh -G vps | head -20   <span class="tok-comment"># các thiết lập ĐÃ GIẢI HẾT cho máy này</span></code></pre>
<p><code>ssh -G</code> là lệnh dùng để gỡ lỗi: nó in ra chính xác những tuỳ chọn nào có hiệu lực sau khi mọi khối <code>Host</code> đã được trộn lại, và điều đó kết thúc mọi tranh cãi về việc vì sao một kết nối lại dùng nhầm khoá hay nhầm cổng.</p>

<h3>Đo thật: file cấu hình mua được cho bạn những gì</h3>
<p>Phòng thí nghiệm đứng sau mọi output SSH trong chương này: ba container Ubuntu 24.04 trên hai mạng Docker riêng — <code>laptop</code> (người dùng <code>an</code>, 172.21.0.3), <code>vps</code> (người dùng <code>deploy</code>, 172.21.0.2, đồng thời nằm trong mạng nội bộ với địa chỉ 172.22.0.3) và <code>db</code> (người dùng <code>admin</code>, 172.22.0.2, CHỈ với tới được từ vps). Khoá tạo bằng <code>ssh-keygen -t ed25519</code> và cài bằng <code>ssh-copy-id</code>; file cấu hình của laptop có <code>Host vps</code>, <code>Host db</code> với <code>ProxyJump vps</code>, và một khối <code>Host *</code> như ở trên, dùng địa chỉ của phòng thí nghiệm và cổng 22.</p>
<pre><code class="language-bash">ssh -G vps | grep -E "^(hostname|user|port) "
ssh db "hostname; hostname -I"                          <span class="tok-comment"># đi qua vps, nhờ ProxyJump</span>
ssh -o ProxyJump=none -o ControlPath=none admin@172.22.0.2 true   <span class="tok-comment"># đi thẳng: không thể</span></code></pre>
<div class="out">user deploy
hostname 172.21.0.2
port 22
db
172.22.0.2
ssh: connect to host 172.22.0.2 port 22: Connection timed out</div>
<p>Còn ControlMaster, bấm giờ bằng <code>date +%s%N</code> quanh lệnh <code>ssh vps true</code>: kết nối đầu mất <strong>171 ms</strong> (TCP, trao đổi khoá, xác thực), lần hai <strong>6 ms</strong>, vì nó dùng lại kết nối chủ mà <code>ssh -O check vps</code> báo là <code>Master running (pid=256)</code>. Một script deploy gọi <code>ssh</code> hai mươi lần chỉ trả giá bắt tay một lần. Một cái bẫy gặp lúc đo: với <code>ControlPersist</code>, một lệnh kiểu <code>ssh -o ProxyJump=none máy</code> có thể âm thầm <em>DÙNG LẠI</em> kết nối chủ đang có và lờ luôn tuỳ chọn mới của bạn — đó là lý do phép thử ở trên thêm <code>-o ControlPath=none</code>, và là lý do bài nói phải chạy <code>ssh -O exit</code> sau khi đổi cấu hình.</p>

<h3>Match exec: khi mạng trường chặn cổng 22</h3>

${slide('lx-09', 16, 'Match exec: mạng trường chặn cổng 22')}
<p>Một câu chuyện thật từ dự án đứng sau khoá học này: mạng trường chỉ cho ra ngoài các cổng 80, 443, 587 và 993, nên ở trường <code>ssh vps</code> cứ thế hết giờ chờ trong khi ở nhà vẫn chạy. Máy chủ được cho thêm một cổng nghe SSH thứ hai là 993, và <code>~/.ssh/config</code> trên Mac tự chọn cổng tuỳ theo laptop đang ở mạng nào:</p>
<pre><code><span class="tok-comment"># ~/.ssh/config trên Mac — khối Match phải đứng TRƯỚC</span>
Match originalhost vps exec "ipconfig getifaddr en0 | grep -q '^10\\.'"
    Port 993

Host vps
    HostName 203.0.113.42
    User deploy
    Port 22</code></pre>
<table>
<tr><th>Mảnh</th><th>Nghĩa</th></tr>
<tr><td><code>Match … exec "lệnh"</code></td><td>khối chỉ áp dụng khi lệnh thoát 0 — phép thử shell nào cũng được</td></tr>
<tr><td><code>originalhost vps</code></td><td>tên đúng như bạn gõ; còn <code>host</code> sẽ khớp SAU khi <code>HostName</code> đã được thay vào</td></tr>
<tr><td><code>ipconfig getifaddr en0</code></td><td>địa chỉ IPv4 Wi-Fi của Mac (trường cấp địa chỉ 10.x); trên Linux dùng <code>ip -4 -br addr show wlan0</code></td></tr>
</table>
<p>Vì sao <code>Match</code> phải đứng trước? Vì <strong><code>ssh_config</code> dùng giá trị ĐẦU TIÊN nó lấy được cho mỗi từ khoá</strong> (ssh_config(5): "the first obtained value will be used"). Đo trong phòng thí nghiệm, với điều kiện giả lập bằng <code>test -f /tmp/o-truong</code>:</p>
<pre><code class="language-bash">touch /tmp/o-truong                      <span class="tok-comment"># giả vờ đang ở trường</span>
ssh -G vps | grep ^port                  <span class="tok-comment"># Match đặt TRƯỚC Host vps</span>
ssh -v vps true 2&gt;&amp;1 | grep Connecting
ssh -F cfg-sai -G vps | grep ^port       <span class="tok-comment"># cùng khối Match nhưng đặt SAU Host vps</span></code></pre>
<div class="out">port 993
debug1: Connecting to 172.21.0.2 [172.21.0.2] port 993.
port 22</div>
<p>Khi khối nằm sau <code>Host vps</code>, dòng <code>Port 22</code> được đọc trước và 993 không bao giờ có hiệu lực — không lỗi, không cảnh báo. Đây cũng là luật khiến <code>Host *</code> phải nằm cuối file, và là đúng luật mà <code>sshd</code> áp dụng ở phía máy chủ (bên dưới). Luôn kiểm bằng <code>ssh -G</code>, đừng bao giờ kiểm bằng cách đọc file.</p>


<h3>Cái agent</h3>
<pre><code>eval "\$(ssh-agent -s)"          <span class="tok-comment"># trên máy để bàn thường đã chạy sẵn</span>
ssh-add ~/.ssh/id_vps           <span class="tok-comment"># gõ mật khẩu khoá một lần</span>
ssh-add -l                      <span class="tok-comment"># đang nạp những gì</span>
ssh-add -t 8h ~/.ssh/id_vps     <span class="tok-comment"># quên nó sau 8 tiếng</span>
ssh-add -D                      <span class="tok-comment"># quên mọi thứ ngay bây giờ</span></code></pre>
<p>Agent giữ cái khoá đã giải mã trong bộ nhớ và trả lời các thách đố thay mặt bạn. Với <code>AddKeysToAgent yes</code> trong file cấu hình, kết nối đầu tiên trong ngày hỏi mật khẩu và mọi kết nối sau đó đều im lặng.</p>
<div class="callout warn"><strong>Chuyển tiếp agent (<code>-A</code>) vừa tiện vừa thật sự nguy hiểm.</strong> Nó cho một tiến trình trên máy ở đầu xa dùng được khoá cục bộ của bạn — nghĩa là <em>root trên máy đó, hoặc bất kỳ ai chiếm được nó</em>, đều xác thực được với danh nghĩa bạn tới MỌI máy chủ mà agent của bạn đang giữ khoá, suốt thời gian bạn còn kết nối. Nó không để lại dấu vết nào trên máy bạn. Hãy ưu tiên <code>ProxyJump</code>, thứ đi xuyên qua máy trung gian mà không phơi agent của bạn ra cho nó. Nếu buộc phải chuyển tiếp, hãy chỉ chuyển tiếp tới những máy do chính bạn quản trị, và đừng bao giờ đặt <code>ForwardAgent yes</code> dưới <code>Host *</code>.</div>

<h3>Chuyển tiếp cổng</h3>
${slide('lx-09', 17, 'Đường hầm -L, -R, -D và ProxyJump')}
<pre><code class="language-bash"><span class="tok-comment"># CỤC BỘ: kéo một cổng ở đầu xa về máy bạn</span>
ssh -L 5432:localhost:5432 vps</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bạn kết nối tới</span><span class="lz-t">localhost:5432 trên laptop của bạn</span><span class="lz-d">Một trình khách bình thường — psql, TablePlus, ứng dụng của bạn — kết nối tới chính máy của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">SSH chở nó đi</span><span class="lz-t">đã mã hoá, qua chính phiên đang có</span><span class="lz-d">Không mở thêm cổng nào ra internet, không cần VPN, không phải cấu hình gì trên máy chủ.</span></div>
  <div class="lz-step"><span class="lz-k">VPS kết nối tới</span><span class="lz-t">localhost:5432 — theo góc nhìn CỦA NÓ</span><span class="lz-d">Chính là cơ sở dữ liệu đang gắn vào 127.0.0.1 và cố ý không với tới được từ bên ngoài (Bài 9.1).</span></div>
  <div class="lz-step"><span class="lz-k">Kết quả</span><span class="lz-t">một cơ sở dữ liệu riêng tư, chỉ người có quyền SSH mới với tới</span><span class="lz-d">Tốt hơn hẳn việc phơi cổng 5432 ra internet rồi đặt một cái mật khẩu lên nó.</span></div>
</div>
<pre><code class="language-bash">ssh -L 5432:localhost:5432 vps           <span class="tok-comment"># cơ sở dữ liệu</span>
ssh -L 8080:localhost:3000 vps           <span class="tok-comment"># một ứng dụng không công khai</span>
ssh -L 9000:10.0.1.15:5432 vps           <span class="tok-comment"># một máy THỨ BA, với tới qua VPS</span>
ssh -fNL 5432:localhost:5432 vps         <span class="tok-comment"># -f chạy nền, -N không mở shell: chỉ đường hầm</span>

<span class="tok-comment"># NGƯỢC: phơi một cổng CỦA BẠN ra trên máy chủ</span>
ssh -R 8000:localhost:3000 vps           <span class="tok-comment"># cho máy chủ với tới máy dev của bạn</span>

<span class="tok-comment"># ĐỘNG: một proxy SOCKS đi xuyên máy chủ</span>
ssh -D 1080 vps                          <span class="tok-comment"># chĩa trình duyệt vào localhost:1080</span></code></pre>
<div class="callout ok"><code>ssh -L</code> là câu trả lời đúng cho "làm sao kết nối tới Postgres production từ laptop của tôi". Hãy giữ cơ sở dữ liệu gắn vào <code>127.0.0.1</code>, không mở cổng tường lửa nào, và để SSH — vốn đã xác thực, đã mã hoá, đã ghi nhật ký — chở cái kết nối đó. Ai mất quyền SSH thì mất quyền vào cơ sở dữ liệu ngay cùng khoảnh khắc, và đó chính xác là tính chất bạn muốn.</div>

<h3>Đo thật: ba đường hầm giữa các container</h3>
<p>Trong phòng thí nghiệm, <code>vps</code> chạy một web server nhỏ gắn vào <code>127.0.0.1:19092</code> (đóng vai Postgres), <code>db</code> chạy một cái ở cổng 19093, còn laptop chạy một server dev ở <code>127.0.0.1:19096</code>:</p>
<pre><code class="language-bash">curl -sS http://172.21.0.2:19092/                   <span class="tok-comment"># trước: chỉ loopback, không với tới</span>
ssh -fN -L 19094:localhost:19092 vps
ssh -fN -L 19095:172.22.0.2:19093 vps              <span class="tok-comment"># một máy THỨ BA, qua vps</span>
ssh -fN -R 19097:localhost:19096 vps
ssh -fN -D 19098 vps
ss -tlnp | grep ssh                                 <span class="tok-comment"># giờ ai đang nghe, trên laptop</span>
curl -sS http://localhost:19094/
curl -sS http://localhost:19095/
ssh vps 'ss -tln | grep 19097; curl -sS http://localhost:19097/'
curl -sS --socks5-hostname localhost:19098 http://172.22.0.2:19093/</code></pre>
<div class="out">curl: (7) Failed to connect to 172.21.0.2 port 19092 after 0 ms: Couldn't connect to server
LISTEN 0      128        127.0.0.1:19098      0.0.0.0:*    users:(("ssh",pid=295,fd=5))
LISTEN 0      128        127.0.0.1:19094      0.0.0.0:*    users:(("ssh",pid=286,fd=5))
LISTEN 0      128        127.0.0.1:19095      0.0.0.0:*    users:(("ssh",pid=289,fd=5))
…
tu VPS: Postgres gia (127.0.0.1)
tu DB: may rieng 172.22.0.2
LISTEN 0      128        127.0.0.1:19097      0.0.0.0:*
…
tu LAPTOP: may dev cua an
tu DB: may rieng 172.22.0.2</div>
<p>Ba chi tiết mà các sơ đồ thường bỏ qua. Một, mọi cổng được chuyển tiếp đều gắn vào <code>127.0.0.1</code> — trên laptop với <code>-L</code>/<code>-D</code>, và trên <em>MÁY CHỦ</em> với <code>-R</code> — nên một đường hầm không phơi gì ra mạng trừ khi bạn yêu cầu (<code>GatewayPorts</code> ở máy chủ, hoặc <code>-L 0.0.0.0:…</code>). Hai, trong <code>-L 19095:172.22.0.2:19093</code>, địa chỉ đó được <em>VPS</em> phân giải và kết nối, nên laptop với tới được một máy mà nó không hề có đường đi. Ba, <code>-f -N</code> để lại các tiến trình <code>ssh</code> chạy nền; dừng chúng bằng <code>kill</code> — PID nằm ngay trong output của <code>ss</code>. (Phòng thí nghiệm thêm <code>-o ControlPath=none</code> cho từng lệnh để mỗi đường hầm là một tiến trình riêng; nếu đi qua ControlMaster thì chúng đi nhờ kết nối chung và kết thúc cùng <code>ssh -O exit vps</code>.)</p>
<table>
<tr><th>Cờ</th><th>Mở cổng nghe trên</th><th>Lưu lượng đi tới</th><th>Dùng khi</th></tr>
<tr><td><code>-L cổng-mình:máy:cổng-xa</code></td><td>máy của bạn</td><td><code>máy:cổng-xa</code> theo góc nhìn của máy chủ</td><td>một CSDL hay trang quản trị chỉ nghe trên loopback của máy chủ</td></tr>
<tr><td><code>-R cổng-xa:máy:cổng-mình</code></td><td>máy chủ</td><td><code>máy:cổng-mình</code> theo góc nhìn của máy bạn</td><td>cho máy chủ (hay một webhook trên đó) gọi vào máy dev của bạn</td></tr>
<tr><td><code>-D cổng</code></td><td>máy của bạn, dạng proxy SOCKS5</td><td>đích mà từng request yêu cầu</td><td>duyệt cả một mạng riêng thông qua máy chủ</td></tr>
<tr><td><code>-J máy</code> / <code>ProxyJump</code></td><td>—</td><td>chặng SSH kế tiếp</td><td>với tới máy riêng mà không cần chuyển tiếp agent</td></tr>
</table>


<h3>Chạy lệnh và script ở đầu xa</h3>
<pre><code class="language-bash">ssh vps 'uptime'
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
<div class="callout">Đo thật trong phòng thí nghiệm, vì "chết vì SIGHUP" mới chỉ là nửa câu chuyện. Không có terminal (lệnh <code>ssh vps 'job &amp;'</code> trơn), chẳng ai gửi SIGHUP cả; thay vào đó lệnh <em>KHÔNG TRẢ VỀ</em> vì job vẫn giữ đầu ra của kênh SSH. Khi kết nối rớt — gập laptop, Wi-Fi chập chờn, giả lập ở đây bằng <code>timeout 3 ssh …</code> — một job có in tiến độ sẽ chết ở lần ghi kế tiếp, ghi vào một cái kênh không còn nữa: một vòng lặp 20 bước dừng sau khi ghi xong bước 3. Có terminal (<code>ssh -t</code>, hoặc phiên tương tác) thì job chết vì SIGHUP. Có chuyển hướng output (<code>ssh vps 'job &gt; job.log 2&gt;&amp;1 &amp;'</code>) thì lệnh trả về ngay và job sống sót. Cơ chế khác nhau, bài học như nhau: <code>tmux new -d</code> là dạng duy nhất vừa sống sót <em>VỪA</em> cho bạn xem lại job sau đó bằng <code>ssh -t vps tmux attach -t deploy</code>.</div>

<h3>Khi kết nối rớt: ba lệnh tmux</h3>
<p>Bài 5.4 dạy tmux kỹ; với việc làm qua SSH thì ba lệnh là đủ. Hãy biến lệnh đầu tiên thành thói quen mỗi lần đăng nhập vào máy chủ:</p>
<pre><code class="language-bash">ssh -t vps tmux new -A -s main     <span class="tok-comment"># gắn vào phiên "main", chưa có thì tạo</span>
<span class="tok-comment"># … làm việc … Wi-Fi rớt … kết nối lại:</span>
ssh -t vps tmux new -A -s main     <span class="tok-comment"># đúng lệnh cũ: bạn quay về đúng chỗ đang dở</span>
tmux ls                            <span class="tok-comment"># trên máy chủ: đang có những phiên nào</span></code></pre>
<p><code>-t</code> cấp cho tmux cái terminal nó cần; <code>-A</code> nghĩa là "có rồi thì gắn vào". Trong tmux, <code>Ctrl-B</code> rồi <code>d</code> là tách ra có chủ ý. <code>ServerAliveInterval 60</code> trong <code>~/.ssh/config</code> làm một kết nối đã chết báo hỏng sau vài phút thay vì treo mãi — còn tmux bảo đảm cú hỏng đó không làm bạn mất gì.</p>

<pre><code class="language-bash"><span class="tok-comment"># Câu hỏi về dấu nháy: MÁY NÀO khai triển cái biến?</span>
ssh vps "echo \$HOSTNAME"      <span class="tok-comment"># nháy kép → tên máy CỦA BẠN, khai triển tại chỗ</span>
ssh vps 'echo \$HOSTNAME'      <span class="tok-comment"># nháy đơn → tên máy CỦA MÁY CHỦ</span></code></pre>
<div class="out">laptop
vps</div>
<p>Đây là Bài 6.2 với một cái máy thứ hai gắn vào, và đáng dừng lại một nhịp: với nháy kép thì shell cục bộ thay thế TRƯỚC KHI SSH gửi bất cứ thứ gì đi. Cả hai dạng đều có ích — bạn thường <em>MUỐN</em> chèn một biến cục bộ vào một lệnh chạy ở đầu xa — nhưng lẫn lộn chúng thì sinh ra những lệnh chạy với những giá trị sai mà chẳng có lỗi nào.</p>

<h3>Gia cố sshd</h3>
${slide('lx-09', 18, 'sshd: giá trị ĐẦU TIÊN thắng — 01- thắng 50-, 99- thua')}
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/01-hardening.conf   (01-, không phải 99- — xem bên dưới)</span>
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
<pre><code class="language-bash">sudo sshd -t                          <span class="tok-comment"># KIỂM cấu hình — luôn luôn, và làm đầu tiên</span>
sudo systemctl reload ssh             <span class="tok-comment"># nạp lại, đừng khởi động lại</span></code></pre>
<div class="callout warn"><strong>Hãy giữ phiên hiện tại của bạn MỞ trong lúc làm việc này, và kiểm bằng một terminal thứ hai.</strong> Một lỗi cấu hình cộng với một lần khởi động lại chính là cách người ta tự khoá mình ra khỏi một cái máy không có console. <code>sshd -t</code> xác thực file, <code>reload</code> để những kết nối đang có sống tiếp, và cái terminal mới chứng minh rằng bạn vẫn vào được. Chỉ tới lúc đó mới đóng cái đầu tiên. Đây là cùng một kỷ luật với <code>visudo</code> ở Bài 4.4, và vì cùng một lý do.</div>
<pre><code class="language-bash"><span class="tok-comment"># Ubuntu đời mới: dùng file thả vào, đừng sửa file cấu hình chính</span>
ls /etc/ssh/sshd_config.d/

<span class="tok-comment"># Cái gì THẬT SỰ đang có hiệu lực sau mọi lệnh include</span>
sudo sshd -T | grep -Ei 'permitrootlogin|passwordauth|allowusers|port'</code></pre>
<div class="out">port 2222
permitrootlogin no
passwordauthentication no
allowusers deploy</div>
<p><code>sshd -T</code> là bản đối ứng phía máy chủ của <code>ssh -G</code>: nó in ra cấu hình đã giải hết, nên bạn không bao giờ phải ngồi suy luận xem trong mấy file thì file nào thắng. Hãy dùng nó để xác nhận một thay đổi ĐÃ có hiệu lực, thay vì cho rằng cái file bạn vừa sửa chính là cái đang được đọc.</p>

<h3>Giá trị đầu tiên thắng: vì sao 99-hardening.conf chẳng đổi được gì</h3>
<p>Bài này trước đây đặt tên file mẫu là <code>99-hardening.conf</code>, và trên một ảnh máy đám mây thì cái tên đó âm thầm vô tác dụng. Nhiều ảnh Ubuntu cho đám mây có sẵn <code>/etc/ssh/sshd_config.d/50-cloud-init.conf</code> với đúng một dòng <code>PasswordAuthentication yes</code>. File cấu hình chính kéo cả thư mục vào bằng <code>Include /etc/ssh/sshd_config.d/*.conf</code> gần đầu file, mẫu <code>*.conf</code> được đọc theo thứ tự chữ cái, và — y hệt <code>ssh_config</code> — <strong>sshd giữ giá trị ĐẦU TIÊN nó đọc được cho mỗi từ khoá</strong> (sshd_config(5)). Nên <code>50-</code> thắng <code>99-</code>. Dựng lại trên Ubuntu 24.04 với OpenSSH 9.6:</p>
<pre><code class="language-bash">ls /etc/ssh/sshd_config.d/
sshd -t &amp;&amp; echo OK
sshd -T | grep -E "^(passwordauthentication|permitrootlogin) "
<span class="tok-comment"># từ laptop, chỉ dùng mật khẩu:</span>
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password vps 'echo "vào được bằng MẬT KHẨU"'</code></pre>
<div class="out">50-cloud-init.conf
99-hardening.conf
OK
permitrootlogin no
passwordauthentication yes
vào được bằng MẬT KHẨU</div>
<p><code>PermitRootLogin no</code> trong cùng file đó thì <em>CÓ</em> ăn — vì không ai khác đặt nó — và đó chính là dấu hiệu của một vụ va chạm thứ tự chứ không phải lỗi cú pháp. Đổi tên rồi nạp lại:</p>
<pre><code class="language-bash">mv /etc/ssh/sshd_config.d/99-hardening.conf /etc/ssh/sshd_config.d/01-hardening.conf
kill -HUP \$(ss -tlnpH "sport = :22" | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)   <span class="tok-comment"># = systemctl reload ssh</span>
sshd -T | grep ^passwordauthentication
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password vps true</code></pre>
<div class="out">passwordauthentication no
deploy@172.21.0.2: Permission denied (publickey).</div>
<p>Hai điều cần mang theo. <code>sshd -t</code> chỉ kiểm <em>CÚ PHÁP</em> — nó in OK với chính cấu hình đang hỏng. Phép nghiệm thu là <code>sshd -T</code> (giá trị đang có hiệu lực) cộng một lần đăng nhập thật từ terminal thứ hai. Và <code>01-</code> bền hơn việc sửa <code>50-cloud-init.conf</code>: nếu cloud-init ghi lại file của nó khi máy được dựng lại, file <code>01-</code> của bạn vẫn thắng. (Container không có systemd, nên phòng thí nghiệm gửi SIGHUP thẳng cho tiến trình đang nghe; để ý rằng <code>pkill -xf /usr/sbin/sshd</code> chẳng khớp gì trên OpenSSH 9.6, vì tiến trình đó tự đổi tên thành <code>sshd: /usr/sbin/sshd [listener] 0 of 10-100 startups</code> — lại là bài học về tên tiến trình của Bài 5.3.)</p>


<h3>Khi không kết nối được</h3>
${slide('lx-09', 19, 'Đọc đúng câu lỗi SSH, và đừng để việc chết theo phiên')}
<pre><code class="language-bash">ssh -v vps                     <span class="tok-comment"># -v, -vv, -vvv: chi tiết tăng dần</span>
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
<p>"Xác minh vân tay" nghĩa là làm gì trong thực tế — người quản trị chạy <code>ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub</code> trên máy chủ, bạn chạy lệnh này rồi so hai chuỗi:</p>
<pre><code>ssh-keyscan -t ed25519 172.21.0.2 2&gt;/dev/null | ssh-keygen -lf -</code></pre>
<div class="out">256 SHA256:jggiJjPdbvroyLR+7Aki1B75zHu2PvT1dywocd0aSqs 172.21.0.2 (ED25519)</div>
<p>Chỉ khi hai chuỗi khớp nhau thì <code>ssh-keygen -R 172.21.0.2</code> mới an toàn. Thêm hai thông báo dựng lại trong phòng thí nghiệm: <code>chmod 644</code> khoá bí mật sinh ra <code>WARNING: UNPROTECTED PRIVATE KEY FILE! … This private key will be ignored.</code>; còn thư mục nhà đặt <code>777</code> trên máy chủ khiến sshd ghi <code>Authentication refused: bad ownership or modes for directory /home/deploy</code> trong khi trình khách chỉ thấy <code>Permission denied (publickey,password)</code>. (OpenSSH của Ubuntu vẫn chấp nhận nhà <code>775</code> khi nhóm chỉ có đúng người đó.)</p>

<h3>Bảng cờ: những tuỳ chọn ssh đáng biết</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>-p CỔNG</code></td><td>cổng (lưu ý: <code>scp</code> dùng <code>-P</code>)</td><td><code>ssh -p 993 deploy@máy</code></td></tr>
<tr><td><code>-i FILE</code></td><td>chào bằng khoá bí mật nào</td><td><code>-i ~/.ssh/id_vps</code></td></tr>
<tr><td><code>-v</code> / <code>-vv</code> / <code>-vvv</code></td><td>output gỡ lỗi, chi tiết tăng dần</td><td><code>ssh -v vps 2&gt;&amp;1 | grep -E 'Offering|Connecting'</code></td></tr>
<tr><td><code>-G</code></td><td>in cấu hình đã giải hết rồi thoát — không kết nối đi đâu</td><td><code>ssh -G vps | grep ^port</code></td></tr>
<tr><td><code>-F FILE</code></td><td>dùng một file cấu hình khác</td><td><code>ssh -F ./thu.conf vps</code></td></tr>
<tr><td><code>-o KHOÁ=GIÁ-TRỊ</code></td><td>bất kỳ tuỳ chọn cấu hình nào ngay trên dòng lệnh</td><td><code>-o ConnectTimeout=5</code></td></tr>
<tr><td><code>-J MÁY</code></td><td>ProxyJump cho riêng lệnh này</td><td><code>ssh -J vps admin@10.0.1.15</code></td></tr>
<tr><td><code>-L</code> · <code>-R</code> · <code>-D</code></td><td>chuyển tiếp cục bộ · ngược · động</td><td><code>-L 5432:localhost:5432</code></td></tr>
<tr><td><code>-N</code> · <code>-f</code></td><td>không chạy lệnh ở xa · chạy nền</td><td><code>ssh -fN -L …</code></td></tr>
<tr><td><code>-t</code></td><td>ép cấp terminal (cần cho tmux, cho lời hỏi mật khẩu sudo)</td><td><code>ssh -t vps tmux attach</code></td></tr>
<tr><td><code>-O check|exit</code></td><td>nói chuyện với ControlMaster</td><td><code>ssh -O exit vps</code></td></tr>
<tr><td><code>-A</code></td><td>chuyển tiếp agent — rủi ro, nên dùng <code>-J</code></td><td>chỉ tới máy do chính bạn quản trị</td></tr>
</table>


<h3>Chạy thử từng bước</h3>
<p>Cả phòng thí nghiệm nằm gọn trên một laptop có Docker, và không bao giờ đụng tới <code>~/.ssh</code> thật của bạn: khoá sống bên trong container "laptop".</p>
<pre><code class="language-bash">docker network create lx09-lab
docker run -d --name lx09-vps --hostname vps --network lx09-lab ubuntu:24.04 sleep infinity
docker run -d --name lx09-laptop --hostname laptop --network lx09-lab ubuntu:24.04 sleep infinity
docker exec lx09-vps bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq openssh-server &gt;/dev/null
  useradd -m -s /bin/bash deploy &amp;&amp; echo deploy:matkhau123 | chpasswd
  mkdir -p /run/sshd &amp;&amp; /usr/sbin/sshd'
docker exec lx09-laptop bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq openssh-client &gt;/dev/null'
docker exec -it lx09-laptop bash
<span class="tok-comment"># giờ đang ở trong container laptop:</span>
ssh-keygen -t ed25519 -C "an@laptop"                 <span class="tok-comment"># lần này hãy đặt mật khẩu khoá</span>
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@lx09-vps  <span class="tok-comment"># hỏi matkhau123 một lần</span>
printf 'Host vps\\n  HostName lx09-vps\\n  User deploy\\n' &gt; ~/.ssh/config
ssh vps hostname
ssh -G vps | grep -E '^(hostname|user|port) '</code></pre>
<div class="out">vps
user deploy
hostname lx09-vps
port 22</div>
<p>Từ đây mọi thí nghiệm của bài đều làm được: thêm <code>Host *</code> có ControlMaster rồi bấm giờ hai lần kết nối, chạy <code>python3 -m http.server 19092 --bind 127.0.0.1</code> trên vps rồi với tới nó bằng <code>-L</code>, hoặc thêm hai file thả vào rồi xem <code>sshd -T</code> đổi. Dọn sạch bằng <code>docker rm -f lx09-vps lx09-laptop &amp;&amp; docker network rm lx09-lab</code>.</p>

<h3>Trên macOS và WSL khác gì</h3>
<ul>
<li><strong>macOS</strong> có sẵn OpenSSH (bản 10.3 trên chiếc Mac dùng ở đây), kể cả <code>ssh-copy-id</code>. Hai thứ Apple thêm vào: <code>UseKeychain yes</code> trong <code>~/.ssh/config</code> và <code>ssh-add --apple-use-keychain ~/.ssh/id_ed25519</code> cất mật khẩu khoá vào Keychain của macOS, nên bạn gõ nó một lần cho mỗi máy, không phải một lần mỗi lần khởi động. <code>ipconfig getifaddr en0</code> (dùng trong <code>Match exec</code> ở trên) chỉ có trên macOS.</li>
<li><strong>Windows 10/11</strong> có sẵn trình khách OpenSSH (<code>ssh</code>, <code>scp</code>, <code>ssh-keygen</code> trong PowerShell); file của nó nằm ở <code>C:\\Users\\bạn\\.ssh\\</code>. Không có <code>ssh-copy-id</code> — hãy tự nối file <code>.pub</code> vào <code>authorized_keys</code> trên máy chủ.</li>
<li><strong>WSL</strong> có <code>~/.ssh</code> riêng, tách khỏi Windows. Chép khoá từ Windows sang rồi dùng thẳng ở <code>/mnt/c/…</code> thường hỏng với <code>UNPROTECTED PRIVATE KEY FILE</code>, vì file trên ổ Windows hiện ra với quyền <code>0777</code> trừ khi bật metadata; hãy chép nó vào thư mục nhà phía Linux rồi <code>chmod 600</code>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS của nhóm phải chỉ cho đăng nhập bằng khoá, còn bạn làm backend muốn mở Postgres production trong TablePlus mà không ai phải mở cổng 5432. Dùng hai container ở phần "Chạy thử từng bước".</p><ol>
<li>Sinh một khoá ed25519 <em>CÓ mật khẩu khoá</em> trên laptop, cài bằng <code>ssh-copy-id</code>, và viết <code>~/.ssh/config</code> có <code>Host vps</code> cùng một khối <code>Host *</code> gồm <code>ServerAliveInterval 60</code> và ControlMaster.</li>
<li>Trên vps, chạy <code>python3 -m http.server 19092 --bind 127.0.0.1</code> (cài python3 trước). Từ laptop, chứng minh <code>curl lx09-vps:19092</code> hỏng, rồi mở <code>ssh -fN -L 15432:localhost:19092 vps</code> và <code>curl localhost:15432</code>.</li>
<li>Trên vps, tạo <code>/etc/ssh/sshd_config.d/50-cloud-init.conf</code> chứa <code>PasswordAuthentication yes</code> và <code>99-hardening.conf</code> chứa <code>PasswordAuthentication no</code>; đọc <code>sshd -T</code>; đổi tên thành <code>01-hardening.conf</code>; nạp lại bằng cách gửi SIGHUP cho tiến trình đang nghe; đọc <code>sshd -T</code> lần nữa.</li>
<li>Chứng minh từ một shell thứ hai trên laptop: <code>ssh -o PubkeyAuthentication=no vps true</code> giờ phải hỏng, còn <code>ssh vps true</code> vẫn phải chạy.</li></ol>
<p><strong>Đạt khi:</strong> <code>curl localhost:15432</code> trả về danh sách thư mục, <code>sshd -T</code> chỉ đổi từ <code>passwordauthentication yes</code> sang <code>no</code> SAU khi đổi tên, và lần đăng nhập chỉ-mật-khẩu kết thúc bằng <code>Permission denied (publickey)</code> trong khi đăng nhập bằng khoá vẫn chạy.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Key pair (cặp khoá)</span><span class="v">Một khoá bí mật không bao giờ rời máy bạn và một khoá công khai phát thoải mái.</span></div>
  <div class="kv"><span class="k">authorized_keys (danh sách khoá được vào)</span><span class="v">Danh sách khoá công khai được phép đăng nhập vào tài khoản đó trên máy chủ.</span></div>
  <div class="kv"><span class="k">Host key / known_hosts (khoá máy chủ / máy đã tin)</span><span class="v">Khoá riêng của máy chủ, và danh sách những máy chủ bạn đã chấp nhận tin.</span></div>
  <div class="kv"><span class="k">Fingerprint (vân tay khoá)</span><span class="v">Một chuỗi băm ngắn của khoá (<code>SHA256:…</code>) để người so bằng mắt.</span></div>
  <div class="kv"><span class="k">Jump host — ProxyJump (máy nhảy)</span><span class="v">Máy bạn đi xuyên qua để tới một máy không có địa chỉ công khai.</span></div>
  <div class="kv"><span class="k">Port forwarding / tunnel (chuyển tiếp cổng / đường hầm)</span><span class="v">Chở một cổng TCP xuyên qua kết nối SSH: <code>-L</code>, <code>-R</code>, <code>-D</code>.</span></div>
  <div class="kv"><span class="k">Drop-in file (file thả vào)</span><span class="v">Một file cấu hình nhỏ trong thư mục <code>.d/</code>, được đọc cùng file chính.</span></div>
  <div class="kv"><span class="k">First obtained value wins (giá trị đầu tiên thắng)</span><span class="v">Luật của cả ssh_config lẫn sshd_config: lần đặt SỚM NHẤT của một từ khoá là lần được dùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoá, không phải mật khẩu: khoá bí mật ký một thách đố mới mỗi lần và không bao giờ đi trên mạng; quyền phải là 700/600.</li>
<li><code>~/.ssh/config</code> biến mọi lệnh thành <code>ssh vps</code>; <code>ssh -G</code> cho thấy thứ gì thật sự áp dụng.</li>
<li>Cả trình khách lẫn máy chủ đều giữ giá trị <em>ĐẦU TIÊN</em> của mỗi từ khoá: đặt khối <code>Match</code> trước khối <code>Host</code>, đặt tên file gia cố là <code>01-…</code>.</li>
<li><code>-L</code> kéo cổng xa về, <code>-R</code> đẩy cổng của bạn lên máy chủ, <code>-D</code> là proxy SOCKS; tất cả mặc định gắn vào 127.0.0.1.</li>
<li><code>sshd -t</code> chỉ kiểm cú pháp; nghiệm thu một thay đổi bằng <code>sshd -T</code> và một lần đăng nhập thật từ terminal thứ hai.</li>
<li>Một dấu <code>&amp;</code> trơn qua SSH không phải là tách rời; chạy việc dài trong <code>tmux new -d</code> và gắn lại bằng <code>ssh -t vps tmux attach</code>.</li>
</ul>

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
<pre><code class="language-bash">scp file.txt vps:/srv/app/                  <span class="tok-comment"># up</span>
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
<pre><code class="language-bash">rsync -avz --progress ./dist/ vps:/srv/app/dist/</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-a</code> archive</span><span class="v">Recursive, and preserves permissions, timestamps, symlinks and ownership. Almost always what you want — it is <code>-rlptgoD</code> in one letter.</span></div>
  <div class="kv"><span class="k"><code>-v</code> verbose</span><span class="v">List what is transferred. Add a second <code>-v</code> to also see what is skipped and why.</span></div>
  <div class="kv"><span class="k"><code>-z</code> compress</span><span class="v">Compress in transit. Worth it over the internet, pointless over a fast LAN or on already-compressed files.</span></div>
  <div class="kv"><span class="k"><code>--progress</code></span><span class="v">Per-file progress. <code>--info=progress2</code> gives one overall bar instead, which is nicer for many small files.</span></div>
</div>
<pre><code class="language-bash">rsync -av --dry-run ./dist/ vps:/srv/app/dist/   <span class="tok-comment"># show, change nothing</span>
rsync -avz --partial --append-verify big.iso vps:/srv/   <span class="tok-comment"># resume a broken transfer</span>
rsync -avz -e 'ssh -p 2222' ./dist/ vps:/srv/    <span class="tok-comment"># a non-default port</span>
rsync -avz --rsync-path='sudo rsync' ./ vps:/opt/app/    <span class="tok-comment"># write as root remotely</span></code></pre>

<h3>The trailing slash — read this twice</h3>
${slide('lx-09', 20, 'rsync: dấu / cuối nguồn')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Source WITH a slash</span><span class="lz-t">rsync -a src/ dst/</span><span class="lz-d">"Copy the CONTENTS of src into dst." Result: dst/file1, dst/file2. This is what you almost always mean.</span></div>
  <div class="lz-step"><span class="lz-k">Source WITHOUT a slash</span><span class="lz-t">rsync -a src dst/</span><span class="lz-d">"Copy the DIRECTORY src into dst." Result: dst/src/file1. One character, an extra level of nesting.</span></div>
  <div class="lz-step"><span class="lz-k">Run it twice, both ways</span><span class="lz-t">dst/src/src/file1 never happens</span><span class="lz-d">rsync is idempotent, so the wrong form is stable rather than compounding — which is exactly why the mistake goes unnoticed for a while.</span></div>
  <div class="lz-step"><span class="lz-k">The destination slash</span><span class="lz-t">irrelevant</span><span class="lz-d">Only the SOURCE slash changes behaviour. Adding one to the destination for symmetry is harmless and makes the intent read clearly.</span></div>
</div>
<pre><code class="language-bash">rsync -av ./dist/ vps:/srv/app/     <span class="tok-comment"># → /srv/app/index.html  ✓</span>
rsync -av ./dist  vps:/srv/app/     <span class="tok-comment"># → /srv/app/dist/index.html</span></code></pre>
<div class="out">sending incremental file list
index.html
assets/main.css
assets/main.js

sent 48,213 bytes  received 88 bytes  32,200.67 bytes/sec</div>
<div class="callout ok">The habit that removes this class of bug: <strong>always run it once with <code>--dry-run</code> and read the paths</strong>. rsync prints exactly what it would create, so a stray <code>dist/dist/</code> is visible before it exists rather than after. It costs one second and it is the same discipline as <code>find … -print</code> before <code>find … -delete</code> (Lesson 2.3).</div>

<h3>--delete: the flag that makes a mirror</h3>
${slide('lx-09', 22, '--delete + nguồn rỗng; --max-delete')}
<pre><code class="language-bash">rsync -avz --delete ./dist/ vps:/srv/app/dist/</code></pre>
<p>Without <code>--delete</code>, rsync only ever adds and updates — a file you removed locally stays on the server forever. With it, the destination becomes an exact mirror of the source, which is what a deploy usually wants: stale assets from three releases ago actually go away.</p>
<div class="callout warn"><strong><code>--delete</code> plus a wrong source path is how people erase a server directory.</strong> If the source is empty — a build that failed, a variable that expanded to nothing, a path that does not exist — rsync faithfully makes the destination empty too. Three defences, all cheap: run <code>--dry-run</code> first and read the <code>deleting</code> lines; add <code>--delete-after</code> so deletions happen only once the transfer succeeded; and use <code>--max-delete=50</code> so an unexpected mass deletion aborts instead of proceeding.</div>
<pre><code class="language-bash">rsync -avz --delete --dry-run ./dist/ vps:/srv/app/dist/ | grep '^deleting'
rsync -avz --delete --delete-after --max-delete=50 ./dist/ vps:/srv/app/dist/</code></pre>
<div class="out">deleting assets/old-hero.jpg
deleting assets/legacy.css
deleting vendor/jquery.min.js</div>

<h3>Measured: what --delete, --max-delete and a missing source really do</h3>
<p>Three runs from the lab laptop to the lab vps (rsync 3.2.7 on both ends), against an <code>app/</code> directory holding four entries:</p>
<pre><code class="language-bash">mkdir build                                                 <span class="tok-comment"># a failed build: empty</span>
rsync -av --delete --max-delete=2 --dry-run build/ vps:app/; echo "exit=\$?"
rsync -av --delete build/ vps:app/; echo "exit=\$?"
rsync -av --delete ./biuld/ vps:app/; echo "exit=\$?"        <span class="tok-comment"># a typo in the source</span></code></pre>
<div class="out">sending incremental file list
deleting assets/new.css
deleting assets/main.css
./
Deletions stopped due to --max-delete limit (2 skipped)
…
rsync error: the --max-delete limit stopped deletions (code 25) at main.c(1356) [sender=3.2.7]
exit=25
sending incremental file list
deleting assets/new.css
deleting assets/main.css
deleting assets/
deleting index.html
./
…
exit=0
sending incremental file list
rsync: [sender] change_dir "/home/an/./biuld" failed: No such file or directory (2)
…
rsync error: some files/attrs were not transferred (see previous errors) (code 23) at main.c(1356) [sender=3.2.7]
exit=23</div>
<ul>
<li><strong>An empty source is the dangerous case</strong>: rsync deletes everything and exits 0. Nothing in its output says anything went wrong.</li>
<li><strong><code>--max-delete=N</code> stops late, not early</strong>: it still performs the first N deletions, then refuses the rest and exits 25. It limits the damage; it does not prevent it. That is why the deploy function below checks for an empty source <em>before</em> calling rsync.</li>
<li><strong>A source that does not exist is, surprisingly, the safe case</strong>: rsync cannot enter it, deletes nothing, and exits 23. Check <code>\$?</code> anyway — 23 and 24 mean "partially transferred" in general.</li>
</ul>


<h3>Excluding things</h3>
<pre><code class="language-bash">rsync -avz --delete \\
  --exclude='.git/' \\
  --exclude='node_modules/' \\
  --exclude='.env*' \\
  --exclude='*.log' \\
  ./ vps:/srv/app/

rsync -avz --exclude-from=.rsyncignore ./ vps:/srv/app/
rsync -avz --filter=':- .gitignore' ./ vps:/srv/app/   <span class="tok-comment"># honour .gitignore</span></code></pre>
<div class="callout warn"><code>--exclude='.env*'</code> deserves its own line in every deploy command. Production environment lives in a file on the server (Lesson 8.3), and an rsync without that exclusion overwrites it with your local development values — or, with <code>--delete</code>, removes it entirely and the application will not start after the next restart. Exclude <code>.env</code> explicitly, and keep the real one outside the deployment directory so no rsync can reach it.</div>

<h3>Useful flags for real deploys</h3>
${slide('lx-09', 21, 'Bảng cờ rsync và cách đọc --itemize-changes')}
<pre><code class="language-bash">rsync -avz --bwlimit=2000 ./big/ vps:/srv/      <span class="tok-comment"># cap at ~2 MB/s</span>
rsync -avz --checksum ./dist/ vps:/srv/app/     <span class="tok-comment"># compare content, not mtime+size</span>
rsync -avz --backup --backup-dir=/srv/backups/\$(date +%F) ./dist/ vps:/srv/app/
rsync -avzn --itemize-changes ./dist/ vps:/srv/app/   <span class="tok-comment"># -n dry run, itemised</span></code></pre>
<div class="out">&lt;f.st...... index.html
&lt;f+++++++++ assets/new.css
.d..t...... assets/</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&lt;f+++++++++</code></span><span class="v">A new file being sent. The pluses mean every attribute is new.</span></div>
  <div class="kv"><span class="k"><code>&lt;f.st......</code></span><span class="v">An existing file whose size (<code>s</code>) and time (<code>t</code>) differ.</span></div>
  <div class="kv"><span class="k"><code>.d..t......</code></span><span class="v">A directory whose timestamp is being updated — no content change.</span></div>
  <div class="kv"><span class="k"><code>*deleting</code></span><span class="v">What <code>--delete</code> would remove. The line to read most carefully.</span></div>
</div>
<div class="callout">The first character is the direction, and an earlier version of this lesson printed it wrong for a push. rsync(1): <code>&lt;</code> means "a file is being transferred to the remote host (sent)", <code>&gt;</code> means "to the local host (received)" — which is also what a local copy shows — <code>c</code> a local creation (a new directory: <code>cd+++++++++</code>), <code>.</code> nothing to transfer, <code>*</code> a message such as <code>*deleting</code>. Measured: <code>rsync -an -i dist/ vps:app/</code> printed <code>&lt;f+++++++++ assets/new.css</code>; the same between two local folders printed <code>&gt;f+++++++++</code>. The remaining nine positions are <code>c s t p o g u a x</code>: checksum, size, time, permissions, owner, group, access time, ACL, extended attributes.</div>
<p>The <code>--checksum</code> case below is not theoretical. In the lab, <code>index.html</code> was edited from <code>&lt;h1&gt;v1&lt;/h1&gt;</code> to <code>&lt;h1&gt;v2&lt;/h1&gt;</code> — same size — within the same second as the previous sync. A plain dry run listed only the new and deleted files and <strong>skipped the real change</strong>; adding <code>--checksum</code> produced <code>&lt;fc........ index.html</code>, the <code>c</code> meaning "content differs".</p>

<div class="callout"><code>--checksum</code> matters more than it looks in CI. rsync's default heuristic is "same size and same modification time means unchanged" — but a fresh <code>git clone</code> or a container build gives every file today's timestamp, so nothing looks unchanged and the whole tree transfers. <code>--checksum</code> compares content instead: slower to compute, far less to send. And in the opposite case — a file edited to exactly the same size within the same second — the default would skip a real change, which <code>--checksum</code> catches.</div>

<h3>A deploy function</h3>
<pre><code class="language-bash">deploy_assets() {
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
&lt;f+++++++++ assets/main.a1b2c3.js
*deleting   assets/main.9f8e7d.js
16:41:03 [INFO] syncing</div>
<p>The empty-source check on line four is the one that matters: it turns "the build failed and rsync then emptied production" into a refusal with a clear message. Everything else here is Chapter 7 — guard clauses, a dry run, a message on failure — applied to a command that can destroy a directory.</p>

<h3>Choosing between them</h3>
${slide('lx-09', 23, 'scp · rsync · tar qua ssh · sftp; rsync trên Mac')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">scp</span><span class="lz-lnote">One file, once, interactively. Simple and universally available.</span></div>
  <div class="lz-layer"><span class="lz-lname">rsync</span><span class="lz-lnote">Anything repeated, anything large, anything that needs to mirror or resume. The default for deploys and backups.</span></div>
  <div class="lz-layer"><span class="lz-lname">tar over ssh</span><span class="lz-lnote"><code>tar -cz ./dir | ssh vps 'tar -xz -C /srv'</code> (Lesson 2.4) — when rsync is not installed on the far side, which happens in minimal containers.</span></div>
  <div class="lz-layer"><span class="lz-lname">sftp</span><span class="lz-lnote">Interactive browsing of a remote filesystem, and the protocol GUI clients speak. <code>sftp vps</code> then <code>get</code>, <code>put</code>, <code>ls</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Not a file transfer at all</span><span class="lz-lnote">Deploying a container image via a registry, or a release artefact via HTTP, avoids the question entirely — and is what the <code>deploy-nha.sh</code> approach in this project does.</span></div>
</div>

<h3>Flag table: rsync options in this lesson</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example / note</th></tr>
<tr><td><code>-a</code></td><td>archive = <code>-rlptgoD</code>: recurse, keep links, permissions, times, group, owner, devices</td><td>almost always</td></tr>
<tr><td><code>-v</code> / <code>-i</code></td><td>list names / list an 11-character change code per item</td><td><code>-ai</code> to read exactly what changes</td></tr>
<tr><td><code>-z</code></td><td>compress in transit</td><td>useless on a LAN or for .jpg/.gz</td></tr>
<tr><td><code>-n</code>, <code>--dry-run</code></td><td>show, change nothing</td><td>run it before every new command</td></tr>
<tr><td><code>--delete</code></td><td>remove from the destination what the source lacks</td><td>makes a mirror — and can empty a directory</td></tr>
<tr><td><code>--delete-after</code></td><td>delete only after the transfer</td><td>with <code>--delete</code></td></tr>
<tr><td><code>--max-delete=N</code></td><td>stop after N deletions (exit 25)</td><td>limits damage, does not prevent it</td></tr>
<tr><td><code>--exclude=PAT</code> · <code>--exclude-from=F</code></td><td>skip matching paths</td><td><code>--exclude='.env*' --exclude='uploads/'</code></td></tr>
<tr><td><code>-c</code>, <code>--checksum</code></td><td>compare content, not size + time</td><td>after <code>git clone</code>, in CI</td></tr>
<tr><td><code>-P</code></td><td>= <code>--partial --progress</code>: keep half-sent files, show progress</td><td>large files over bad Wi-Fi</td></tr>
<tr><td><code>-e 'ssh -p 2222'</code></td><td>the remote shell to use</td><td>non-standard port (or use <code>~/.ssh/config</code>)</td></tr>
<tr><td><code>--bwlimit=KBPS</code> · <code>--backup --backup-dir=D</code></td><td>cap bandwidth · keep replaced files</td><td><code>--backup-dir=/srv/backups/\$(date +%F)</code></td></tr>
</table>


<h3>Try it step by step</h3>
<p>Everything here runs locally — two folders, no server — so you can repeat it until the trailing-slash rule and the itemize codes feel obvious. In <code>~/thu-linux</code> (or any container with rsync):</p>
<pre><code class="language-bash">mkdir -p thu &amp;&amp; cd thu
mkdir -p build/assets deploy/uploads
echo "&lt;h1&gt;v2&lt;/h1&gt;" &gt; build/index.html; echo "body{}" &gt; build/assets/app.css
echo "SECRET=that" &gt; deploy/.env; echo anh &gt; deploy/uploads/a.jpg; echo cu &gt; deploy/old.html
rsync -a build deploy/; find deploy -type f | sort; rm -rf deploy/build      <span class="tok-comment"># 1. no slash</span>
rsync -ain --delete build/ deploy/                                            <span class="tok-comment"># 2. plan, unguarded</span>
rsync -ain --delete --exclude=".env*" --exclude="uploads/" build/ deploy/     <span class="tok-comment"># 3. plan, guarded</span>
rsync -ai  --delete --exclude=".env*" --exclude="uploads/" build/ deploy/; find deploy -type f | sort</code></pre>
<div class="out">deploy/.env
deploy/build/assets/app.css
deploy/build/index.html
deploy/old.html
deploy/uploads/a.jpg
*deleting   uploads/a.jpg
*deleting   uploads/
*deleting   old.html
*deleting   .env
&gt;f+++++++++ index.html
cd+++++++++ assets/
&gt;f+++++++++ assets/app.css
*deleting   old.html
&gt;f+++++++++ index.html
cd+++++++++ assets/
&gt;f+++++++++ assets/app.css
*deleting   old.html
&gt;f+++++++++ index.html
cd+++++++++ assets/
&gt;f+++++++++ assets/app.css
deploy/.env
deploy/assets/app.css
deploy/index.html
deploy/uploads/a.jpg</div>
<p>Step 1 nests <code>build/</code> inside <code>deploy/</code>. Step 2's plan would have deleted the production <code>.env</code> and every uploaded image — read in the dry run, it costs nothing. Step 3 keeps them out of reach of <code>--delete</code> (excluded paths are neither copied nor deleted), and step 4 does it for real. The codes are <code>&gt;</code> because both folders are local; to a server they would be <code>&lt;</code>.</p>

<h3>On macOS and WSL: what is different</h3>
<ul>
<li><strong>macOS</strong>: <code>/usr/bin/rsync</code> on the Mac used for this chapter is <strong>openrsync</strong> (<code>rsync --version</code> prints <code>openrsync: protocol version 29</code> and <code>rsync version 2.6.9 compatible</code>), not GNU rsync. Measured: <code>-a</code>, <code>-i</code>, <code>--delete</code>, <code>--delete-after</code>, <code>--max-delete</code>, <code>--checksum</code>, <code>--partial</code> and <code>--exclude</code> work; <code>--info=progress2</code> and <code>--append-verify</code> fail with <code>unrecognized option</code>, and its itemize codes are two characters shorter (<code>&gt;f+++++++ y</code>). For deploy scripts, install GNU rsync with <code>brew install rsync</code>, or run them in Linux.</li>
<li><strong>scp</strong> on macOS (OpenSSH 10.3) and on Ubuntu 24.04 (OpenSSH 9.6) both use the SFTP protocol underneath since OpenSSH 9.0; <code>scp -O</code> forces the old protocol for ancient servers.</li>
<li><strong>Windows</strong> has <code>scp</code> in its built-in OpenSSH client but no rsync; run rsync from WSL, where <code>/mnt/c/…</code> paths work as sources — just expect permission bits from the Windows drive to look like <code>777</code>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team deploys the frontend by syncing <code>build/</code> into <code>/srv/app/</code>, a folder that also holds the production <code>.env</code> and the users' <code>uploads/</code>. Last week a failed build almost wiped it. Make the deploy safe, locally in <code>~/thu-linux</code>.</p><ol>
<li>Create <code>deploy/</code> with <code>.env</code>, <code>uploads/a.jpg</code> and <code>old.html</code>, and <code>build/</code> with <code>index.html</code> and <code>assets/app.css</code>.</li>
<li>Run <code>rsync -ain --delete build/ deploy/</code> and count the <code>*deleting</code> lines you would not want.</li>
<li>Write a function <code>safe_sync SRC DST</code> that refuses a missing or empty source, prints the dry-run plan, aborts if the plan deletes more than 5 items, and otherwise syncs with <code>--exclude='.env*' --exclude='uploads/'</code>.</li>
<li>Test it three ways: normal build, an empty <code>build/</code>, and a misspelled source.</li></ol>
<p><strong>Done when:</strong> the normal run deletes only <code>old.html</code>; the empty and misspelled runs stop with your own message before rsync touches anything; and <code>deploy/.env</code> and <code>deploy/uploads/a.jpg</code> survive every run.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trailing slash</span><span class="v">A <code>/</code> at the end of the SOURCE means "the contents of", not the folder itself.</span></div>
  <div class="kv"><span class="k">Mirror</span><span class="v">A destination made identical to the source, including deletions (<code>--delete</code>).</span></div>
  <div class="kv"><span class="k">Dry run</span><span class="v">A rehearsal that prints what would happen and changes nothing (<code>-n</code>).</span></div>
  <div class="kv"><span class="k">Itemize changes</span><span class="v">The 11-character code per item: direction, type, and which attributes changed.</span></div>
  <div class="kv"><span class="k">Quick check</span><span class="v">rsync's default test "same size and same mtime = unchanged".</span></div>
  <div class="kv"><span class="k">Checksum</span><span class="v">Comparing file contents by hash; catches changes the quick check misses.</span></div>
  <div class="kv"><span class="k">Exclude pattern</span><span class="v">A path pattern rsync neither copies nor deletes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A slash at the end of the source copies its contents; without it you get one more directory level.</li>
<li>Run every new rsync with <code>-n</code> (and <code>-i</code>) first and actually read the <code>*deleting</code> lines.</li>
<li><code>--delete</code> with an empty source empties the destination and exits 0; guard the source before calling rsync.</li>
<li><code>--max-delete</code> still deletes the first N files — it is a brake, not a wall.</li>
<li>In itemize output, <code>&lt;</code> is sent to the remote, <code>&gt;</code> received or copied locally; a <code>c</code> in position 3 needs <code>--checksum</code>.</li>
<li>The Mac's built-in rsync is openrsync with fewer options; use GNU rsync for deploy scripts.</li>
</ul>

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
<pre><code class="language-bash">scp file.txt vps:/srv/app/                  <span class="tok-comment"># đẩy lên</span>
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
<pre><code class="language-bash">rsync -avz --progress ./dist/ vps:/srv/app/dist/</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-a</code> archive</span><span class="v">Đệ quy, và giữ nguyên quyền, dấu thời gian, liên kết tượng trưng cùng quyền sở hữu. Gần như luôn là thứ bạn muốn — nó là <code>-rlptgoD</code> gói trong một chữ.</span></div>
  <div class="kv"><span class="k"><code>-v</code> verbose</span><span class="v">Liệt kê những gì được truyền. Thêm một chữ <code>-v</code> nữa để thấy cả những gì bị bỏ qua và vì sao.</span></div>
  <div class="kv"><span class="k"><code>-z</code> compress</span><span class="v">Nén trên đường truyền. Đáng dùng khi đi qua internet, vô nghĩa trên một mạng LAN nhanh hoặc với file vốn đã nén.</span></div>
  <div class="kv"><span class="k"><code>--progress</code></span><span class="v">Tiến độ theo từng file. <code>--info=progress2</code> cho một thanh tổng thể duy nhất, dễ chịu hơn với nhiều file nhỏ.</span></div>
</div>
<pre><code class="language-bash">rsync -av --dry-run ./dist/ vps:/srv/app/dist/   <span class="tok-comment"># hiện ra, không đổi gì</span>
rsync -avz --partial --append-verify big.iso vps:/srv/   <span class="tok-comment"># nối tiếp một lần truyền đứt</span>
rsync -avz -e 'ssh -p 2222' ./dist/ vps:/srv/    <span class="tok-comment"># cổng không mặc định</span>
rsync -avz --rsync-path='sudo rsync' ./ vps:/opt/app/    <span class="tok-comment"># ghi với quyền root ở đầu xa</span></code></pre>

<h3>Dấu gạch chéo cuối — hãy đọc chỗ này hai lần</h3>
${slide('lx-09', 20, 'rsync: dấu / cuối nguồn')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nguồn CÓ gạch chéo</span><span class="lz-t">rsync -a src/ dst/</span><span class="lz-d">"Chép NỘI DUNG của src vào dst." Kết quả: dst/file1, dst/file2. Đây gần như luôn là thứ bạn định làm.</span></div>
  <div class="lz-step"><span class="lz-k">Nguồn KHÔNG có gạch chéo</span><span class="lz-t">rsync -a src dst/</span><span class="lz-d">"Chép THƯ MỤC src vào dst." Kết quả: dst/src/file1. Một ký tự, thêm một tầng lồng nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Chạy hai lần, cả hai kiểu</span><span class="lz-t">dst/src/src/file1 không bao giờ xảy ra</span><span class="lz-d">rsync bền vững khi chạy lại, nên dạng sai thì ỔN ĐỊNH chứ không chồng chất — và đó chính là lý do sai lầm này không bị phát hiện trong một thời gian.</span></div>
  <div class="lz-step"><span class="lz-k">Gạch chéo ở ĐÍCH</span><span class="lz-t">không liên quan</span><span class="lz-d">Chỉ gạch chéo ở NGUỒN mới làm đổi hành vi. Thêm một cái vào đích cho cân đối thì vô hại và làm ý định đọc ra rõ hơn.</span></div>
</div>
<pre><code class="language-bash">rsync -av ./dist/ vps:/srv/app/     <span class="tok-comment"># → /srv/app/index.html  ✓</span>
rsync -av ./dist  vps:/srv/app/     <span class="tok-comment"># → /srv/app/dist/index.html</span></code></pre>
<div class="out">sending incremental file list
index.html
assets/main.css
assets/main.js

sent 48,213 bytes  received 88 bytes  32,200.67 bytes/sec</div>
<div class="callout ok">Thói quen gỡ bỏ được cả lớp lỗi này: <strong>luôn chạy một lần với <code>--dry-run</code> rồi ĐỌC các đường dẫn</strong>. rsync in ra chính xác thứ nó SẼ tạo ra, nên một cái <code>dist/dist/</code> lạc chỗ hiện ra TRƯỚC khi nó tồn tại chứ không phải sau. Nó tốn một giây và cùng một kỷ luật với việc <code>find … -print</code> trước <code>find … -delete</code> (Bài 2.3).</div>

<h3>--delete: cái cờ tạo ra một bản sao gương</h3>
${slide('lx-09', 22, '--delete + nguồn rỗng; --max-delete')}
<pre><code class="language-bash">rsync -avz --delete ./dist/ vps:/srv/app/dist/</code></pre>
<p>Không có <code>--delete</code>, rsync chỉ thêm vào và cập nhật — một file bạn đã xoá ở máy mình thì nằm lại trên máy chủ mãi mãi. Có nó, đích trở thành bản gương chính xác của nguồn, và đó thường là thứ một lần deploy muốn: những tệp tài nguyên cũ từ ba bản phát hành trước thật sự biến mất.</p>
<div class="callout warn"><strong><code>--delete</code> cộng với một đường dẫn nguồn sai chính là cách người ta xoá sạch một thư mục trên máy chủ.</strong> Nếu nguồn rỗng — một bản dựng thất bại, một biến khai triển thành rỗng, một đường dẫn không tồn tại — rsync trung thành làm cho đích cũng rỗng theo. Ba lớp phòng thủ, đều rẻ: chạy <code>--dry-run</code> trước rồi đọc các dòng <code>deleting</code>; thêm <code>--delete-after</code> để việc xoá chỉ xảy ra sau khi truyền thành công; và dùng <code>--max-delete=50</code> để một lần xoá hàng loạt ngoài dự kiến sẽ DỪNG LẠI thay vì cứ thế làm.</div>
<pre><code class="language-bash">rsync -avz --delete --dry-run ./dist/ vps:/srv/app/dist/ | grep '^deleting'
rsync -avz --delete --delete-after --max-delete=50 ./dist/ vps:/srv/app/dist/</code></pre>
<div class="out">deleting assets/old-hero.jpg
deleting assets/legacy.css
deleting vendor/jquery.min.js</div>

<h3>Đo thật: --delete, --max-delete và một nguồn không tồn tại thật ra làm gì</h3>
<p>Ba lần chạy từ laptop tới vps của phòng thí nghiệm (rsync 3.2.7 ở cả hai đầu), vào một thư mục <code>app/</code> đang có bốn mục:</p>
<pre><code class="language-bash">mkdir build                                                 <span class="tok-comment"># bản dựng hỏng: rỗng</span>
rsync -av --delete --max-delete=2 --dry-run build/ vps:app/; echo "exit=\$?"
rsync -av --delete build/ vps:app/; echo "exit=\$?"
rsync -av --delete ./biuld/ vps:app/; echo "exit=\$?"        <span class="tok-comment"># gõ nhầm tên nguồn</span></code></pre>
<div class="out">sending incremental file list
deleting assets/new.css
deleting assets/main.css
./
Deletions stopped due to --max-delete limit (2 skipped)
…
rsync error: the --max-delete limit stopped deletions (code 25) at main.c(1356) [sender=3.2.7]
exit=25
sending incremental file list
deleting assets/new.css
deleting assets/main.css
deleting assets/
deleting index.html
./
…
exit=0
sending incremental file list
rsync: [sender] change_dir "/home/an/./biuld" failed: No such file or directory (2)
…
rsync error: some files/attrs were not transferred (see previous errors) (code 23) at main.c(1356) [sender=3.2.7]
exit=23</div>
<ul>
<li><strong>Nguồn RỖNG mới là ca nguy hiểm</strong>: rsync xoá sạch và thoát 0. Chẳng dòng nào trong output nói có gì sai.</li>
<li><strong><code>--max-delete=N</code> dừng MUỘN, không dừng sớm</strong>: nó vẫn thực hiện N lần xoá đầu, rồi mới từ chối phần còn lại và thoát 25. Nó giới hạn thiệt hại, chứ không ngăn được. Đó là lý do hàm deploy bên dưới kiểm nguồn rỗng <em>TRƯỚC</em> khi gọi rsync.</li>
<li><strong>Nguồn không tồn tại, bất ngờ thay, lại là ca an toàn</strong>: rsync không vào được, không xoá gì, và thoát 23. Vẫn phải kiểm <code>\$?</code> — 23 và 24 nói chung nghĩa là "chỉ truyền được một phần".</li>
</ul>


<h3>Loại trừ những thứ không nên đi theo</h3>
<pre><code class="language-bash">rsync -avz --delete \\
  --exclude='.git/' \\
  --exclude='node_modules/' \\
  --exclude='.env*' \\
  --exclude='*.log' \\
  ./ vps:/srv/app/

rsync -avz --exclude-from=.rsyncignore ./ vps:/srv/app/
rsync -avz --filter=':- .gitignore' ./ vps:/srv/app/   <span class="tok-comment"># tôn trọng .gitignore</span></code></pre>
<div class="callout warn"><code>--exclude='.env*'</code> xứng đáng có một dòng riêng trong MỌI lệnh deploy. Môi trường production nằm trong một file trên máy chủ (Bài 8.3), và một lệnh rsync thiếu phần loại trừ đó sẽ ghi đè lên nó bằng các giá trị phát triển ở máy bạn — hoặc, với <code>--delete</code>, xoá nó đi hoàn toàn và ứng dụng sẽ không khởi động được sau lần restart kế tiếp. Hãy loại trừ <code>.env</code> một cách tường minh, và giữ cái file thật NGOÀI thư mục triển khai để không lệnh rsync nào với tới được nó.</div>

<h3>Những cờ hữu ích cho việc deploy thật</h3>
${slide('lx-09', 21, 'Bảng cờ rsync và cách đọc --itemize-changes')}
<pre><code class="language-bash">rsync -avz --bwlimit=2000 ./big/ vps:/srv/      <span class="tok-comment"># chặn trần ở khoảng 2 MB/s</span>
rsync -avz --checksum ./dist/ vps:/srv/app/     <span class="tok-comment"># so NỘI DUNG, không so mtime+kích thước</span>
rsync -avz --backup --backup-dir=/srv/backups/\$(date +%F) ./dist/ vps:/srv/app/
rsync -avzn --itemize-changes ./dist/ vps:/srv/app/   <span class="tok-comment"># -n chạy thử, liệt kê từng mục</span></code></pre>
<div class="out">&lt;f.st...... index.html
&lt;f+++++++++ assets/new.css
.d..t...... assets/</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>&lt;f+++++++++</code></span><span class="v">Một file MỚI đang được gửi đi. Các dấu cộng nghĩa là mọi thuộc tính đều mới.</span></div>
  <div class="kv"><span class="k"><code>&lt;f.st......</code></span><span class="v">Một file đã có mà kích thước (<code>s</code>) và thời gian (<code>t</code>) khác nhau.</span></div>
  <div class="kv"><span class="k"><code>.d..t......</code></span><span class="v">Một thư mục đang được cập nhật dấu thời gian — nội dung không đổi.</span></div>
  <div class="kv"><span class="k"><code>*deleting</code></span><span class="v">Thứ mà <code>--delete</code> sẽ gỡ bỏ. Đây là dòng cần đọc kỹ nhất.</span></div>
</div>
<div class="callout">Ký tự đầu tiên là CHIỀU đi, và một phiên bản trước của bài này in sai nó cho trường hợp đẩy lên máy chủ. Theo rsync(1): <code>&lt;</code> nghĩa là "file đang được truyền TỚI máy ở xa (gửi đi)", <code>&gt;</code> nghĩa là "tới máy cục bộ (nhận về)" — cũng là thứ một lần chép cục bộ hiện ra — <code>c</code> là tạo mới tại chỗ (thư mục mới: <code>cd+++++++++</code>), <code>.</code> là không có gì phải truyền, <code>*</code> là một thông điệp như <code>*deleting</code>. Đo thật: <code>rsync -an -i dist/ vps:app/</code> in <code>&lt;f+++++++++ assets/new.css</code>; cùng việc đó giữa hai thư mục cục bộ in <code>&gt;f+++++++++</code>. Chín vị trí còn lại là <code>c s t p o g u a x</code>: checksum, kích thước, thời gian sửa, quyền, chủ, nhóm, thời gian truy cập, ACL, thuộc tính mở rộng.</div>
<p>Ca <code>--checksum</code> ở dưới không phải lý thuyết. Trong phòng thí nghiệm, <code>index.html</code> được sửa từ <code>&lt;h1&gt;v1&lt;/h1&gt;</code> thành <code>&lt;h1&gt;v2&lt;/h1&gt;</code> — cùng kích thước — trong cùng một giây với lần đồng bộ trước. Một lần chạy thử thường chỉ liệt kê file mới và file bị xoá, <strong>BỎ QUA thay đổi có thật</strong>; thêm <code>--checksum</code> thì ra <code>&lt;fc........ index.html</code>, chữ <code>c</code> nghĩa là "nội dung khác".</p>

<div class="callout"><code>--checksum</code> quan trọng hơn vẻ ngoài của nó trong CI. Phép suy đoán mặc định của rsync là "cùng kích thước và cùng thời gian sửa nghĩa là không đổi" — nhưng một lần <code>git clone</code> mới hay một lần dựng container gán cho MỌI file dấu thời gian của hôm nay, nên chẳng cái nào trông như không đổi và cả cây thư mục được truyền lại. <code>--checksum</code> so nội dung thay vào: tính lâu hơn, gửi ít hơn rất nhiều. Và ở chiều ngược lại — một file được sửa thành đúng cùng kích thước trong cùng một giây — thì mặc định sẽ bỏ qua một thay đổi CÓ THẬT, còn <code>--checksum</code> thì bắt được.</div>

<h3>Một hàm deploy</h3>
<pre><code class="language-bash">deploy_assets() {
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
&lt;f+++++++++ assets/main.a1b2c3.js
*deleting   assets/main.9f8e7d.js
16:41:03 [INFO] đang đồng bộ</div>
<p>Phép kiểm nguồn-rỗng ở dòng thứ tư mới là cái có ý nghĩa: nó biến chuyện "bản dựng hỏng rồi rsync xoá sạch production" thành một lời từ chối kèm thông điệp rõ ràng. Mọi thứ còn lại ở đây là Chương 7 — chốt chặn, chạy thử, thông điệp khi hỏng — áp lên một cái lệnh có khả năng huỷ hoại cả một thư mục.</p>

<h3>Chọn giữa chúng</h3>
${slide('lx-09', 23, 'scp · rsync · tar qua ssh · sftp; rsync trên Mac')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">scp</span><span class="lz-lnote">Một file, một lần, khi đang gõ tay. Đơn giản và có ở khắp nơi.</span></div>
  <div class="lz-layer"><span class="lz-lname">rsync</span><span class="lz-lnote">Mọi thứ lặp lại, mọi thứ lớn, mọi thứ cần soi gương hoặc cần nối tiếp. Mặc định cho việc deploy và sao lưu.</span></div>
  <div class="lz-layer"><span class="lz-lname">tar qua ssh</span><span class="lz-lnote"><code>tar -cz ./dir | ssh vps 'tar -xz -C /srv'</code> (Bài 2.4) — khi đầu bên kia không cài rsync, chuyện hay xảy ra trong container tối giản.</span></div>
  <div class="lz-layer"><span class="lz-lname">sftp</span><span class="lz-lnote">Duyệt tương tác một hệ thống file ở xa, và là giao thức mà các trình khách đồ hoạ nói. Gõ <code>sftp vps</code> rồi <code>get</code>, <code>put</code>, <code>ls</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không phải chuyển file gì cả</span><span class="lz-lnote">Triển khai một ảnh container qua một registry, hoặc một tệp phẩm phát hành qua HTTP, là tránh hẳn câu hỏi này — và đó chính là điều mà lối <code>deploy-nha.sh</code> trong dự án này làm.</span></div>
</div>

<h3>Bảng cờ: các tuỳ chọn rsync trong bài</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ / ghi chú</th></tr>
<tr><td><code>-a</code></td><td>archive = <code>-rlptgoD</code>: đệ quy, giữ liên kết, quyền, thời gian, nhóm, chủ, thiết bị</td><td>gần như luôn dùng</td></tr>
<tr><td><code>-v</code> / <code>-i</code></td><td>liệt kê tên / in mã 11 ký tự cho từng mục</td><td><code>-ai</code> để đọc chính xác cái gì đổi</td></tr>
<tr><td><code>-z</code></td><td>nén trên đường truyền</td><td>vô ích trong mạng LAN hay với .jpg/.gz</td></tr>
<tr><td><code>-n</code>, <code>--dry-run</code></td><td>chỉ in ra, không đổi gì</td><td>chạy trước mọi lệnh mới</td></tr>
<tr><td><code>--delete</code></td><td>xoá ở đích những gì nguồn không có</td><td>tạo bản gương — và có thể dọn sạch một thư mục</td></tr>
<tr><td><code>--delete-after</code></td><td>chỉ xoá sau khi truyền xong</td><td>đi cùng <code>--delete</code></td></tr>
<tr><td><code>--max-delete=N</code></td><td>dừng sau N lần xoá (thoát 25)</td><td>giới hạn thiệt hại, không ngăn được</td></tr>
<tr><td><code>--exclude=MẪU</code> · <code>--exclude-from=F</code></td><td>bỏ qua đường dẫn khớp mẫu</td><td><code>--exclude='.env*' --exclude='uploads/'</code></td></tr>
<tr><td><code>-c</code>, <code>--checksum</code></td><td>so NỘI DUNG, không so kích thước + thời gian</td><td>sau <code>git clone</code>, trong CI</td></tr>
<tr><td><code>-P</code></td><td>= <code>--partial --progress</code>: giữ file gửi dở, hiện tiến độ</td><td>file lớn qua Wi-Fi chập chờn</td></tr>
<tr><td><code>-e 'ssh -p 2222'</code></td><td>shell ở xa dùng để kết nối</td><td>cổng lạ (hoặc dùng <code>~/.ssh/config</code>)</td></tr>
<tr><td><code>--bwlimit=KBPS</code> · <code>--backup --backup-dir=D</code></td><td>chặn băng thông · giữ lại file bị thay</td><td><code>--backup-dir=/srv/backups/\$(date +%F)</code></td></tr>
</table>


<h3>Chạy thử từng bước</h3>
<p>Mọi thứ ở đây chạy cục bộ — hai thư mục, không cần máy chủ — nên bạn lặp lại được tới khi luật dấu gạch chéo và mã itemize trở nên hiển nhiên. Trong <code>~/thu-linux</code> (hoặc một container có rsync):</p>
<pre><code class="language-bash">mkdir -p thu &amp;&amp; cd thu
mkdir -p build/assets deploy/uploads
echo "&lt;h1&gt;v2&lt;/h1&gt;" &gt; build/index.html; echo "body{}" &gt; build/assets/app.css
echo "SECRET=that" &gt; deploy/.env; echo anh &gt; deploy/uploads/a.jpg; echo cu &gt; deploy/old.html
rsync -a build deploy/; find deploy -type f | sort; rm -rf deploy/build      <span class="tok-comment"># 1. không gạch chéo</span>
rsync -ain --delete build/ deploy/                                            <span class="tok-comment"># 2. kế hoạch, chưa chốt</span>
rsync -ain --delete --exclude=".env*" --exclude="uploads/" build/ deploy/     <span class="tok-comment"># 3. kế hoạch, đã chốt</span>
rsync -ai  --delete --exclude=".env*" --exclude="uploads/" build/ deploy/; find deploy -type f | sort</code></pre>
<div class="out">deploy/.env
deploy/build/assets/app.css
deploy/build/index.html
deploy/old.html
deploy/uploads/a.jpg
*deleting   uploads/a.jpg
*deleting   uploads/
*deleting   old.html
*deleting   .env
&gt;f+++++++++ index.html
cd+++++++++ assets/
&gt;f+++++++++ assets/app.css
*deleting   old.html
&gt;f+++++++++ index.html
cd+++++++++ assets/
&gt;f+++++++++ assets/app.css
*deleting   old.html
&gt;f+++++++++ index.html
cd+++++++++ assets/
&gt;f+++++++++ assets/app.css
deploy/.env
deploy/assets/app.css
deploy/index.html
deploy/uploads/a.jpg</div>
<p>Bước 1 lồng <code>build/</code> vào trong <code>deploy/</code>. Kế hoạch ở bước 2 lẽ ra đã xoá <code>.env</code> của production và mọi ảnh người dùng tải lên — đọc trong lần chạy thử thì chẳng mất gì. Bước 3 đặt chúng ra ngoài tầm với của <code>--delete</code> (đường dẫn bị loại trừ thì không bị chép mà cũng không bị xoá), và bước 4 làm thật. Mã là <code>&gt;</code> vì cả hai thư mục đều cục bộ; đẩy lên máy chủ thì sẽ là <code>&lt;</code>.</p>

<h3>Trên macOS và WSL khác gì</h3>
<ul>
<li><strong>macOS</strong>: <code>/usr/bin/rsync</code> trên chiếc Mac dùng cho chương này là <strong>openrsync</strong> (<code>rsync --version</code> in <code>openrsync: protocol version 29</code> và <code>rsync version 2.6.9 compatible</code>), không phải GNU rsync. Đo thật: <code>-a</code>, <code>-i</code>, <code>--delete</code>, <code>--delete-after</code>, <code>--max-delete</code>, <code>--checksum</code>, <code>--partial</code> và <code>--exclude</code> chạy được; <code>--info=progress2</code> và <code>--append-verify</code> hỏng với <code>unrecognized option</code>, và mã itemize của nó ngắn hơn hai ký tự (<code>&gt;f+++++++ y</code>). Với script deploy, hãy cài GNU rsync bằng <code>brew install rsync</code>, hoặc chạy chúng trong Linux.</li>
<li><strong>scp</strong> trên macOS (OpenSSH 10.3) và trên Ubuntu 24.04 (OpenSSH 9.6) đều dùng giao thức SFTP ở bên dưới kể từ OpenSSH 9.0; <code>scp -O</code> ép dùng giao thức cũ cho những máy chủ rất cũ.</li>
<li><strong>Windows</strong> có <code>scp</code> trong trình khách OpenSSH dựng sẵn nhưng không có rsync; hãy chạy rsync từ WSL, nơi đường dẫn <code>/mnt/c/…</code> dùng làm nguồn được — chỉ cần biết trước rằng bit quyền từ ổ Windows trông như <code>777</code>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn deploy frontend bằng cách đồng bộ <code>build/</code> vào <code>/srv/app/</code>, thư mục cũng đang chứa <code>.env</code> của production và <code>uploads/</code> của người dùng. Tuần trước một bản dựng hỏng suýt dọn sạch nó. Hãy làm cho lần deploy an toàn, tập cục bộ trong <code>~/thu-linux</code>.</p><ol>
<li>Tạo <code>deploy/</code> có <code>.env</code>, <code>uploads/a.jpg</code> và <code>old.html</code>, và <code>build/</code> có <code>index.html</code> với <code>assets/app.css</code>.</li>
<li>Chạy <code>rsync -ain --delete build/ deploy/</code> và đếm những dòng <code>*deleting</code> mà bạn không hề muốn.</li>
<li>Viết một hàm <code>safe_sync NGUỒN ĐÍCH</code> từ chối nguồn không tồn tại hoặc rỗng, in kế hoạch chạy thử, dừng nếu kế hoạch xoá hơn 5 mục, còn không thì đồng bộ với <code>--exclude='.env*' --exclude='uploads/'</code>.</li>
<li>Thử nó theo ba cách: bản dựng bình thường, một <code>build/</code> rỗng, và một tên nguồn gõ nhầm.</li></ol>
<p><strong>Đạt khi:</strong> lần chạy bình thường chỉ xoá <code>old.html</code>; lần rỗng và lần gõ nhầm dừng với thông báo của chính bạn trước khi rsync đụng vào bất cứ thứ gì; và <code>deploy/.env</code> cùng <code>deploy/uploads/a.jpg</code> sống sót qua mọi lần chạy.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trailing slash (dấu gạch chéo cuối)</span><span class="v">Dấu <code>/</code> ở cuối NGUỒN nghĩa là "nội dung của", không phải chính thư mục đó.</span></div>
  <div class="kv"><span class="k">Mirror (bản gương)</span><span class="v">Đích được làm y hệt nguồn, kể cả việc xoá (<code>--delete</code>).</span></div>
  <div class="kv"><span class="k">Dry run (chạy thử)</span><span class="v">Một lần diễn tập in ra điều sẽ xảy ra mà không đổi gì (<code>-n</code>).</span></div>
  <div class="kv"><span class="k">Itemize changes (liệt kê từng thay đổi)</span><span class="v">Mã 11 ký tự cho từng mục: chiều đi, loại, và thuộc tính nào đổi.</span></div>
  <div class="kv"><span class="k">Quick check (so sánh nhanh)</span><span class="v">Phép thử mặc định của rsync: "cùng kích thước và cùng mtime = không đổi".</span></div>
  <div class="kv"><span class="k">Checksum (tổng kiểm)</span><span class="v">So nội dung file bằng hàm băm; bắt được thay đổi mà so sánh nhanh bỏ sót.</span></div>
  <div class="kv"><span class="k">Exclude pattern (mẫu loại trừ)</span><span class="v">Mẫu đường dẫn mà rsync không chép cũng không xoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gạch chéo ở cuối nguồn chép nội dung của nó; thiếu nó thì bạn có thêm một tầng thư mục.</li>
<li>Chạy mọi lệnh rsync mới với <code>-n</code> (và <code>-i</code>) trước, rồi THẬT SỰ đọc các dòng <code>*deleting</code>.</li>
<li><code>--delete</code> với nguồn rỗng dọn sạch đích và thoát 0; hãy chốt nguồn trước khi gọi rsync.</li>
<li><code>--max-delete</code> vẫn xoá N file đầu — nó là cái phanh, không phải bức tường.</li>
<li>Trong output itemize, <code>&lt;</code> là gửi lên máy xa, <code>&gt;</code> là nhận về hoặc chép cục bộ; chữ <code>c</code> ở vị trí 3 cần <code>--checksum</code>.</li>
<li>rsync dựng sẵn của Mac là openrsync, ít tuỳ chọn hơn; dùng GNU rsync cho script deploy.</li>
</ul>

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
${slide('lx-09', 24, 'tcpdump: gói tin CÓ tới máy không?')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Cloud security group</span><span class="lz-lnote">Outside the machine entirely: AWS security groups, DigitalOcean cloud firewalls, Hetzner firewalls. Nothing you run <em>on</em> the server can see it, and <code>tcpdump</code> shows no packet arriving at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Host firewall</span><span class="lz-lnote">On the machine: <code>ufw</code>, <code>firewalld</code>, or raw <code>nftables</code>. The packet arrives, the kernel drops it. <code>tcpdump</code> sees the SYN; nothing replies.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Bind address</span><span class="lz-lnote">Not a firewall at all: the service is listening on <code>127.0.0.1</code> only (Lesson 9.1). No firewall rule can fix this, and it is the most common cause.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># One test each, in this order</span>
sudo tcpdump -i any -n port 3000        <span class="tok-comment"># layer 1: does the packet arrive?</span>
sudo ufw status verbose                 <span class="tok-comment"># layer 2: would the host drop it?</span>
sudo ss -tulpn | grep :3000             <span class="tok-comment"># layer 3: what is it bound to?</span></code></pre>
<div class="callout ok">Run <code>tcpdump</code> first. If the SYN never appears while a client is actively trying, the block is upstream — a cloud security group or a network ACL — and no amount of <code>ufw</code> configuration will change it. That single observation saves the most common wasted hour in this whole chapter.</div>

<h3>What tcpdump shows at each layer, measured</h3>
<p>A lab server (Ubuntu 24.04 container, <code>172.21.0.5</code>) with three rules in place: port 19091 is <strong>dropped</strong>, port 19090 is <strong>rejected</strong> for one client and allowed for another, and nothing at all listens on 19095. Two captures on the server while clients tried each port — first with ufw active (default deny, 19090 allowed only for 172.21.0.3), then with the nftables rules shown further down:</p>
<pre><code>sudo tcpdump -i eth0 -n "tcp port 19091 or tcp port 19090"          <span class="tok-comment"># 1: ufw on, 19090 allowed for .3</span></code></pre>
<div class="out">10:57:53.927167 IP 172.21.0.3.46006 &gt; 172.21.0.5.19091: Flags [S], seq 122370713, …
10:57:54.942512 IP 172.21.0.3.46006 &gt; 172.21.0.5.19091: Flags [S], seq 122370713, …
10:57:55.937311 IP 172.21.0.3.55052 &gt; 172.21.0.5.19090: Flags [S], seq 870537449, …
10:57:55.937356 IP 172.21.0.5.19090 &gt; 172.21.0.3.55052: Flags [S.], seq 4284871842, ack 870537450, …</div>
<pre><code>sudo tcpdump -i eth0 -n "(tcp port 19090 or tcp port 19095) or icmp"  <span class="tok-comment"># 2: nft reject for .4; 19095 unused</span></code></pre>
<div class="out">11:13:38.211069 IP 172.21.0.4.46964 &gt; 172.21.0.5.19090: Flags [S], seq 2648483172, …
11:13:38.211118 IP 172.21.0.5 &gt; 172.21.0.4: ICMP 172.21.0.5 tcp port 19090 unreachable, length 68
11:13:38.279724 IP 172.21.0.3.46502 &gt; 172.21.0.5.19095: Flags [S], seq 115509802, …
11:13:38.279768 IP 172.21.0.5.19095 &gt; 172.21.0.3.46502: Flags [R.], seq 0, ack 115509803, win 0, length 0</div>
<table>
<tr><th>What tcpdump shows</th><th>Meaning</th><th>What the client sees</th></tr>
<tr><td>nothing at all</td><td>blocked before the machine: security group, provider firewall, wrong IP</td><td>timeout (curl 28)</td></tr>
<tr><td><code>[S]</code>, then the same <code>[S]</code> again a second later</td><td>arrived; the host firewall <strong>dropped</strong> it — the client is retransmitting</td><td>timeout (curl 28)</td></tr>
<tr><td><code>[S]</code> then <code>ICMP … port … unreachable</code></td><td>arrived; the host firewall <strong>rejected</strong> it (nftables' <code>reject</code> default for IPv4)</td><td>refused at once (curl 7)</td></tr>
<tr><td><code>[S]</code> then <code>[R.]</code></td><td>arrived; no firewall rule, but <strong>nobody listens</strong> on that port — the kernel sends a reset</td><td>refused at once (curl 7)</td></tr>
<tr><td><code>[S]</code> then <code>[S.]</code></td><td>the handshake is completing — the network is fine, look at the application</td><td>whatever the app answers</td></tr>
</table>


<h3>ufw: the everyday interface</h3>
<pre><code class="language-bash">sudo ufw status verbose
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
<pre><code class="language-bash">sudo ufw status numbered                <span class="tok-comment"># rules with index numbers</span>
sudo ufw delete 3                       <span class="tok-comment"># remove by number</span>
sudo ufw --dry-run allow 8080/tcp       <span class="tok-comment"># show what it would do</span>
sudo ufw reset                          <span class="tok-comment"># start over (disables it too)</span>
sudo tail -f /var/log/ufw.log           <span class="tok-comment"># what is being blocked, live</span></code></pre>
<div class="out">[UFW BLOCK] IN=eth0 SRC=198.51.100.23 DST=203.0.113.42 PROTO=TCP SPT=51234 DPT=3306</div>
<p>That log line is a complete answer: someone at <code>198.51.100.23</code> tried to reach MySQL on port 3306 and ufw dropped it. When a legitimate connection fails, watching this file while you retry tells you in one second whether the host firewall is responsible.</p>

<h3>What is underneath</h3>
${slide('lx-09', 25, 'ufw · firewalld · nftables')}
<pre><code>sudo nft list ruleset | head -40         <span class="tok-comment"># the real rules, modern kernels</span>
sudo iptables -L -n -v                   <span class="tok-comment"># legacy view; often a shim over nftables</span>
sudo iptables -t nat -L -n               <span class="tok-comment"># NAT — where Docker's rules live</span></code></pre>
<p><code>ufw</code> and <code>firewalld</code> are front-ends. Underneath is <code>nftables</code> on any current distribution, with <code>iptables</code> commands translated to it for compatibility. You rarely need to write <code>nft</code> rules by hand, but you do need to <em>read</em> them — because other software writes rules there too, and that is the subject of the next section.</p>

<h3>ufw, firewalld and nftables compared</h3>
<p>Three names, one engine. On every current distribution the kernel's packet filter is <strong>nftables</strong>; <code>ufw</code> (Ubuntu) and <code>firewalld</code> (Fedora, RHEL) are front-ends that write nftables rules for you, and the <code>iptables</code> command on Ubuntu 24.04 reports itself as <code>iptables v1.8.10 (nf_tables)</code> — a translation layer onto the same engine.</p>
<table>
<tr><th></th><th>ufw</th><th>firewalld</th><th>nftables (<code>nft</code>)</th></tr>
<tr><td>Default on</td><td>Ubuntu (installed on servers, <strong>inactive</strong> until <code>ufw enable</code>)</td><td>Fedora, RHEL, Rocky (<strong>active</strong>)</td><td>underneath both</td></tr>
<tr><td>Model</td><td>a list of allow/deny rules by port and source</td><td><strong>zones</strong>: each interface belongs to a zone with its own services and ports</td><td>tables → chains (hooked into input/forward/output) → rules</td></tr>
<tr><td>Open 443</td><td><code>sudo ufw allow 443/tcp</code></td><td><code>sudo firewall-cmd --add-service=https --permanent</code> then <code>--reload</code></td><td><code>sudo nft add rule inet filter input tcp dport 443 accept</code></td></tr>
<tr><td>See the rules</td><td><code>sudo ufw status verbose</code> / <code>numbered</code></td><td><code>firewall-cmd --list-all</code></td><td><code>sudo nft list ruleset</code></td></tr>
<tr><td>Survives reboot</td><td>yes</td><td>only with <code>--permanent</code></td><td>only if saved to <code>/etc/nftables.conf</code></td></tr>
</table>
<p>What ufw actually writes, measured in an Ubuntu 24.04 container:</p>
<pre><code class="language-bash">sudo ufw allow 22/tcp
sudo ufw allow from 172.21.0.3 to any port 19090 proto tcp
sudo ufw default deny incoming &amp;&amp; sudo ufw --force enable
sudo nft list chain ip filter ufw-user-input</code></pre>
<div class="out">table ip filter {
	chain ufw-user-input {
		tcp dport 22 counter packets 0 bytes 0 accept
		ip saddr 172.21.0.3 tcp dport 19090 counter packets 1 bytes 60 accept
		…
	}
}</div>
<p>The <code>counter packets 1</code> on the 19090 rule is a free diagnostic: it went up the moment the allowed client connected. And the Fedora default is worth seeing once, read without root on a Fedora 44 Workstation:</p>
<pre><code>firewall-cmd --list-all</code></pre>
<div class="out">FedoraWorkstation (default, active)
  target: default
  interfaces: enp3s0
  services: dhcpv6-client mdns samba-client ssh
  ports: 1025-65535/udp 1025-65535/tcp
  …</div>
<p>Fedora <em>Workstation</em>'s default zone opens every port from 1025 upward, so a dev server started on <code>0.0.0.0:3000</code> is reachable from the whole LAN. Fedora Server and RHEL default to a much stricter zone. Same command family, very different defaults — look before you assume.</p>

<h3>DROP versus REJECT, measured</h3>

${slide('lx-09', 26, 'DROP (28) và REJECT (7); Docker vượt mặt ufw')}
<pre><code class="language-bash">sudo nft add table inet lx09
sudo nft add chain inet lx09 input '{ type filter hook input priority 0; policy accept; }'
sudo nft add rule inet lx09 input tcp dport 19091 counter drop
sudo nft add rule inet lx09 input ip saddr 172.21.0.4 tcp dport 19090 counter reject
<span class="tok-comment"># from the clients:</span>
curl -sS -m 3 http://172.21.0.5:19091/; echo "exit=\$?"
curl -sS -m 3 http://172.21.0.5:19090/; echo "exit=\$?"     <span class="tok-comment"># from 172.21.0.4</span>
sudo nft list table inet lx09 | grep counter</code></pre>
<div class="out">curl: (28) Connection timed out after 3003 milliseconds
exit=28
curl: (7) Failed to connect to 172.21.0.5 port 19090 after 0 ms: Couldn't connect to server
exit=7
		tcp dport 19091 counter packets 3 bytes 180 drop
		ip saddr 172.21.0.4 tcp dport 19090 counter packets 1 bytes 60 reject with icmp port-unreachable</div>
<p>Three packets were dropped for one curl — the client's SYN plus its retries — and the client waited the full three seconds. The rejected client got its answer in 0 ms. <strong>DROP</strong> hides that anything is there and makes clients wait; <strong>REJECT</strong> answers "no" at once. ufw uses DROP for its default policy; a <code>ufw reject</code> rule sends a refusal. When you are the one debugging, a timeout means something is silently discarding packets (a firewall or the path to the machine), while an instant "refused" means the machine itself answered — either nobody listens on the port, or a firewall is set to REJECT.</p>

<h3>Docker and ufw do not agree</h3>
<pre><code class="language-bash">sudo ufw default deny incoming
sudo ufw enable
docker run -d -p 3306:3306 mysql        <span class="tok-comment"># now reachable from the internet</span>
curl -sv telnet://203.0.113.42:3306     <span class="tok-comment"># from another machine: it connects</span></code></pre>
<div class="callout warn"><strong>Docker inserts its own rules ahead of ufw's.</strong> Publishing a port with <code>-p 3306:3306</code> writes a <code>DOCKER</code> chain rule in the <code>nat</code> table that is evaluated <em>before</em> the <code>filter</code> chain ufw manages — so <code>ufw status</code> shows the port as blocked while the world can reach it. This surprises people badly, and it has exposed a great many development databases.</div>
<pre><code class="language-bash"><span class="tok-comment"># The fix: publish to loopback only, and let a reverse proxy handle the internet</span>
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
<pre><code class="language-bash">sudo apt install fail2ban
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
<pre><code class="language-bash"><span class="tok-comment"># Compressed into one script you can paste onto a server</span>
port=\${1:?usage: check-port PORT}
echo "== listening =="   ; sudo ss -tulpn | grep ":\$port" || echo "  nothing on :\$port"
echo "== local =="       ; curl -s -o /dev/null -w '  %{http_code}\\n' "localhost:\$port" || echo "  no answer"
echo "== ufw =="         ; sudo ufw status | grep -E "\$port|Status" || echo "  ufw inactive"
echo "== docker =="      ; sudo iptables -t nat -L DOCKER -n 2&gt;/dev/null | grep ":\$port" || true</code></pre>
<div class="out">== listening ==
tcp   LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=5012,fd=21))
== local ==
  200
== ufw ==
Status: active
3000/tcp                   ALLOW IN    Anywhere</div>
<p>Read that output as a diagnosis: the service answers locally, ufw allows the port — and it is bound to <code>127.0.0.1</code>, so nothing outside can reach it regardless. The firewall rule is not wrong; it is irrelevant. Without step 1 you would spend the afternoon on ufw.</p>

<h3>Ubuntu 24.04: the SSH port belongs to systemd</h3>

${slide('lx-09', 27, 'Ubuntu 24.04: ssh.socket giữ cổng SSH')}
<p>The checklist's first step — "what is listening, on which port?" — has one more twist on current Ubuntu. Since 22.10, <code>sshd</code> is <strong>socket-activated</strong>: systemd itself listens on port 22 (<code>ssh.socket</code>) and starts <code>sshd</code> when a connection arrives. The real story from this course's project: <code>Port 993</code> was added to <code>sshd_config</code>, sshd was restarted, and port 993 stayed closed. Reproduced in an Ubuntu 24.04 container running real systemd:</p>
<pre><code class="language-bash">systemctl is-enabled ssh.socket ssh.service
ss -tlnp | grep :22
echo "Port 993" &gt;&gt; /etc/ssh/sshd_config
systemctl restart ssh
sshd -T | grep ^port
ss -tlnp | grep -E ":22 |:993 "</code></pre>
<div class="out">enabled
disabled
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("systemd",pid=1,fd=50))
port 993
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=665,fd=3),("systemd",pid=1,fd=50))</div>
<p>The configuration says 993; reality says 22, and the socket belongs to <code>systemd</code> (PID 1). sshd did read the new port — it simply never opens sockets itself. Ubuntu 24.04 ships a <em>generator</em> that turns <code>Port</code>/<code>ListenAddress</code> into the socket's settings, but only when systemd reloads its units:</p>
<pre><code class="language-bash">systemctl daemon-reload
systemctl restart ssh.socket
ss -tlnp | grep -E ":22 |:993 "
cat /run/systemd/generator/ssh.socket.d/*.conf</code></pre>
<div class="out">LISTEN 0      4096         0.0.0.0:993        0.0.0.0:*    users:(("sshd",pid=709,fd=3),("systemd",pid=1,fd=47))
# Automatically generated by sshd-socket-generator

[Socket]
ListenStream=
ListenStream=0.0.0.0:993
ListenStream=[::]:993</div>
<p>Read the last output carefully: the empty <code>ListenStream=</code> clears the default, so a lone <code>Port 993</code> <strong>replaces</strong> port 22 instead of adding to it. On a remote server that is a lock-out waiting to happen — you want <code>Port 22</code> <em>and</em> <code>Port 993</code>. On the project's production VPS the operators chose a third option: a separate, independent listener service on 993, so the socket that guards every login never had to be restarted. Three layers, three different checks: <code>sshd -T</code> for configuration, <code>ss -tlnp</code> for what really listens, and a login from another machine for "can I get in".</p>

<h3>Outbound matters too</h3>
<pre><code class="language-bash">sudo ufw default deny outgoing          <span class="tok-comment"># strict; now allow what you need</span>
sudo ufw allow out 53                   <span class="tok-comment"># DNS</span>
sudo ufw allow out 80,443/tcp           <span class="tok-comment"># package updates, APIs</span>
sudo ufw allow out 25,587/tcp           <span class="tok-comment"># mail, if this host sends it</span></code></pre>
<div class="callout">Default-deny outbound is unusual on a general-purpose server and genuinely valuable on one that runs untrusted code: it limits what a compromised application can reach and what it can send data to. It is also a reliable way to break package installs, webhooks and certificate renewal in confusing ways, so add it deliberately and test each thing the machine legitimately does. If downloads work for you but not for a service, remember the proxy variables from Lesson 8.3 before blaming the firewall.</div>

<h3>Try it step by step</h3>
<p>ufw and nftables need the <code>NET_ADMIN</code> capability, which a normal container does not have. Give it one — the rules then apply to the container's own network namespace, never to your laptop:</p>
<pre><code class="language-bash">docker network create lx09-net      <span class="tok-comment"># if it does not exist yet</span>
docker run --rm -it --cap-add NET_ADMIN --network lx09-net --name lx09-fw ubuntu:24.04 bash
<span class="tok-comment"># inside:</span>
apt-get update -qq &amp;&amp; apt-get install -y -qq ufw nftables python3 &gt;/dev/null
ufw allow 22/tcp; ufw default deny incoming; ufw --force enable
ufw status numbered
nft list tables
python3 -m http.server 19090 &amp;
nft list chain ip filter ufw-user-input</code></pre>
<p>Then, from a second container on the same Docker network, (<code>docker run --rm -it --network lx09-net ubuntu:24.04 bash</code>, then <code>apt-get install -y curl</code>) try <code>curl -m 3 http://lx09-fw:19090/</code> (timeout, because ufw drops it), <code>ufw allow 19090/tcp</code>, and try again (200). Watch it happen with <code>tcpdump -n -i eth0 port 19090</code> in the first container. Everything disappears with the container.</p>

<h3>On macOS and WSL: what is different</h3>
<ul>
<li><strong>macOS</strong> has no ufw, firewalld or nftables. Its user-facing firewall is the <em>Application Firewall</em>, which allows or blocks <em>programs</em>, not ports; check it read-only with <code>/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate</code> (on the Mac used here: <code>Firewall is enabled. (State = 1)</code>). Underneath there is BSD <code>pf</code> (<code>pfctl</code>, root only). Use <code>lsof -nP -iTCP -sTCP:LISTEN</code> for the "what is listening" step.</li>
<li><strong>WSL2</strong>: the Linux side can run ufw, but traffic from other machines reaches WSL through Windows first — Windows Defender Firewall (and, on recent Windows 11, a Hyper-V firewall for WSL) decides before any Linux rule sees the packet. When a port "open in WSL" is unreachable from your phone, look on the Windows side.</li>
<li><strong>Fedora</strong>: <code>firewall-cmd --list-all</code> works without root; changing anything needs <code>sudo</code> and <code>--permanent</code> to survive a reboot.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after your group "secured" the demo server with ufw, the lecturer can no longer open the admin page on port 19090, and one teammate insists the firewall is fine. Find the layer with evidence, in a container started with <code>--cap-add NET_ADMIN</code>.</p><ol>
<li>Start <code>python3 -m http.server 19090</code> and <code>python3 -m http.server 19091 --bind 127.0.0.1</code>. Enable ufw with only <code>allow 22/tcp</code> and <code>default deny incoming</code>.</li>
<li>From a second container, run curl against both ports with <code>-m 3</code> and write down the two exit codes. Explain why they differ, using <code>ss -tlnp</code> on the server.</li>
<li>Capture with <code>tcpdump -n -i eth0 'port 19090 or port 19091'</code> during a retry and classify each port by the table above.</li>
<li>Fix 19090 with one ufw rule limited to the teammate's container IP, and show the counter in <code>nft list chain ip filter ufw-user-input</code> going up.</li></ol>
<p><strong>Done when:</strong> 19090 goes from exit 28 (dropped) to 200 after exactly one rule; 19091 stays refused/unreachable and you can say why no firewall rule can change that; and you have one captured line for each case.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Host firewall</span><span class="v">Filtering on the machine itself (ufw, firewalld, nftables), after the packet has arrived.</span></div>
  <div class="kv"><span class="k">Security group / cloud firewall</span><span class="v">Filtering done by the provider before the packet reaches your machine — invisible from inside it.</span></div>
  <div class="kv"><span class="k">DROP / REJECT</span><span class="v">Silently discard (the client waits, then times out) / answer "refused" at once.</span></div>
  <div class="kv"><span class="k">nftables table, chain, rule</span><span class="v">The kernel filter's structure: a table holds chains hooked into traffic paths; chains hold rules.</span></div>
  <div class="kv"><span class="k">Zone (firewalld)</span><span class="v">A named trust level assigned to interfaces, each with its own open services and ports.</span></div>
  <div class="kv"><span class="k">SYN / SYN-ACK / RST</span><span class="v">TCP's "may I connect", "yes", and "no one here" — what tcpdump shows as <code>[S]</code>, <code>[S.]</code>, <code>[R.]</code>.</span></div>
  <div class="kv"><span class="k">Socket activation</span><span class="v">systemd holds the listening port and starts the service on the first connection (<code>ssh.socket</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A packet can die in three places — outside the machine, in the host firewall, or at a service bound to the wrong address — and each has its own test.</li>
<li><code>tcpdump</code> tells them apart: nothing, repeated SYNs, ICMP unreachable, or a RST each point at a different layer.</li>
<li>ufw and firewalld are front-ends for nftables; read the real rules with <code>nft list ruleset</code>, and remember Fedora Workstation opens ports ≥ 1025.</li>
<li>DROP makes clients time out (curl 28); REJECT and "nobody listening" refuse instantly (curl 7).</li>
<li>Docker's published ports bypass ufw; publish to <code>127.0.0.1</code> and audit with <code>ss -tlnp | grep 0.0.0.0</code>.</li>
<li>On Ubuntu 24.04 systemd owns port 22: after changing <code>Port</code>, run <code>daemon-reload</code> and restart <code>ssh.socket</code> — and keep port 22 in the list.</li>
</ul>

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
${slide('lx-09', 24, 'tcpdump: gói tin CÓ tới máy không?')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Nhóm bảo mật của đám mây</span><span class="lz-lnote">Hoàn toàn nằm NGOÀI cái máy: security group của AWS, cloud firewall của DigitalOcean, firewall của Hetzner. Không thứ gì bạn chạy <em>TRÊN</em> máy chủ nhìn thấy nó, và <code>tcpdump</code> chẳng thấy gói tin nào tới cả.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Tường lửa của máy</span><span class="lz-lnote">Trên chính cái máy: <code>ufw</code>, <code>firewalld</code>, hoặc <code>nftables</code> thô. Gói tin TỚI NƠI, rồi nhân vứt nó đi. <code>tcpdump</code> thấy gói SYN; không có gì trả lời.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Địa chỉ gắn</span><span class="lz-lnote">Hoàn toàn không phải tường lửa: dịch vụ chỉ đang lắng nghe trên <code>127.0.0.1</code> (Bài 9.1). Không luật tường lửa nào chữa được, và đây là nguyên nhân phổ biến nhất.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Mỗi tầng một phép thử, theo đúng thứ tự này</span>
sudo tcpdump -i any -n port 3000        <span class="tok-comment"># tầng 1: gói tin có tới không?</span>
sudo ufw status verbose                 <span class="tok-comment"># tầng 2: máy này có vứt nó không?</span>
sudo ss -tulpn | grep :3000             <span class="tok-comment"># tầng 3: nó đang gắn vào đâu?</span></code></pre>
<div class="callout ok">Hãy chạy <code>tcpdump</code> trước. Nếu gói SYN không bao giờ xuất hiện trong khi một trình khách đang tích cực thử kết nối, thì chỗ chặn nằm ở PHÍA TRÊN — một nhóm bảo mật của đám mây hoặc một ACL mạng — và cấu hình <code>ufw</code> bao nhiêu cũng chẳng thay đổi được gì. Riêng quan sát đó tiết kiệm được cái giờ bị lãng phí thường xuyên nhất trong cả chương này.</div>

<h3>tcpdump cho thấy gì ở từng tầng, đo thật</h3>
<p>Một máy chủ thí nghiệm (container Ubuntu 24.04, <code>172.21.0.5</code>) với ba tình huống dựng sẵn: cổng 19091 bị <strong>DROP</strong> (vứt), cổng 19090 bị <strong>REJECT</strong> (từ chối) với một trình khách và cho phép với trình khách kia, còn cổng 19095 thì chẳng có gì lắng nghe. Hai lần bắt gói trên máy chủ trong lúc các trình khách thử từng cổng — lần đầu khi ufw đang bật (mặc định chặn, 19090 chỉ cho 172.21.0.3), lần sau với các luật nftables ở phần dưới:</p>
<pre><code>sudo tcpdump -i eth0 -n "tcp port 19091 or tcp port 19090"          <span class="tok-comment"># 1: ufw on, 19090 allowed for .3</span></code></pre>
<div class="out">10:57:53.927167 IP 172.21.0.3.46006 &gt; 172.21.0.5.19091: Flags [S], seq 122370713, …
10:57:54.942512 IP 172.21.0.3.46006 &gt; 172.21.0.5.19091: Flags [S], seq 122370713, …
10:57:55.937311 IP 172.21.0.3.55052 &gt; 172.21.0.5.19090: Flags [S], seq 870537449, …
10:57:55.937356 IP 172.21.0.5.19090 &gt; 172.21.0.3.55052: Flags [S.], seq 4284871842, ack 870537450, …</div>
<pre><code>sudo tcpdump -i eth0 -n "(tcp port 19090 or tcp port 19095) or icmp"  <span class="tok-comment"># 2: nft reject for .4; 19095 unused</span></code></pre>
<div class="out">11:13:38.211069 IP 172.21.0.4.46964 &gt; 172.21.0.5.19090: Flags [S], seq 2648483172, …
11:13:38.211118 IP 172.21.0.5 &gt; 172.21.0.4: ICMP 172.21.0.5 tcp port 19090 unreachable, length 68
11:13:38.279724 IP 172.21.0.3.46502 &gt; 172.21.0.5.19095: Flags [S], seq 115509802, …
11:13:38.279768 IP 172.21.0.5.19095 &gt; 172.21.0.3.46502: Flags [R.], seq 0, ack 115509803, win 0, length 0</div>
<table>
<tr><th>tcpdump thấy</th><th>Nghĩa là</th><th>Trình khách thấy</th></tr>
<tr><td>không có gì cả</td><td>bị chặn TRƯỚC khi tới máy: security group, tường lửa nhà cung cấp, sai IP</td><td>hết giờ (curl 28)</td></tr>
<tr><td><code>[S]</code>, một giây sau lại đúng <code>[S]</code> đó</td><td>đã tới; tường lửa của máy đã <strong>VỨT</strong> nó — trình khách đang gửi lại</td><td>hết giờ (curl 28)</td></tr>
<tr><td><code>[S]</code> rồi <code>ICMP … port … unreachable</code></td><td>đã tới; tường lửa của máy <strong>TỪ CHỐI</strong> nó (mặc định của luật <code>reject</code> trong nftables với IPv4)</td><td>bị từ chối ngay (curl 7)</td></tr>
<tr><td><code>[S]</code> rồi <code>[R.]</code></td><td>đã tới; không luật tường lửa nào, nhưng <strong>KHÔNG AI NGHE</strong> cổng đó — nhân gửi gói reset</td><td>bị từ chối ngay (curl 7)</td></tr>
<tr><td><code>[S]</code> rồi <code>[S.]</code></td><td>bắt tay đang hoàn tất — mạng ổn, hãy nhìn ứng dụng</td><td>ứng dụng trả lời gì thì thấy nấy</td></tr>
</table>


<h3>ufw: giao diện dùng hằng ngày</h3>
<pre><code class="language-bash">sudo ufw status verbose
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
<pre><code class="language-bash">sudo ufw status numbered                <span class="tok-comment"># các luật kèm số thứ tự</span>
sudo ufw delete 3                       <span class="tok-comment"># gỡ theo số</span>
sudo ufw --dry-run allow 8080/tcp       <span class="tok-comment"># hiện ra thứ nó sẽ làm</span>
sudo ufw reset                          <span class="tok-comment"># làm lại từ đầu (tắt luôn nó)</span>
sudo tail -f /var/log/ufw.log           <span class="tok-comment"># cái gì đang bị chặn, ngay lúc đó</span></code></pre>
<div class="out">[UFW BLOCK] IN=eth0 SRC=198.51.100.23 DST=203.0.113.42 PROTO=TCP SPT=51234 DPT=3306</div>
<p>Dòng log đó là một câu trả lời hoàn chỉnh: ai đó ở <code>198.51.100.23</code> thử với tới MySQL trên cổng 3306 và ufw đã vứt nó đi. Khi một kết nối HỢP LỆ bị hỏng, việc theo dõi file này trong lúc bạn thử lại sẽ cho biết trong một giây rằng tường lửa của máy có phải thủ phạm hay không.</p>

<h3>Bên dưới nó là gì</h3>
${slide('lx-09', 25, 'ufw · firewalld · nftables')}
<pre><code>sudo nft list ruleset | head -40         <span class="tok-comment"># các luật thật, trên nhân đời mới</span>
sudo iptables -L -n -v                   <span class="tok-comment"># khung nhìn cũ; thường là lớp đệm trên nftables</span>
sudo iptables -t nat -L -n               <span class="tok-comment"># NAT — chỗ các luật của Docker nằm</span></code></pre>
<p><code>ufw</code> và <code>firewalld</code> chỉ là giao diện phía trước. Bên dưới là <code>nftables</code> trên mọi bản phân phối hiện hành, với các lệnh <code>iptables</code> được dịch sang nó để tương thích. Bạn hiếm khi cần TỰ VIẾT luật <code>nft</code>, nhưng bạn thì cần <em>ĐỌC</em> được chúng — vì phần mềm khác cũng viết luật vào đó, và đó chính là chủ đề của phần kế tiếp.</p>

<h3>So sánh ufw, firewalld và nftables</h3>
<p>Ba cái tên, một bộ máy. Trên mọi bản phân phối hiện hành, bộ lọc gói tin của nhân là <strong>nftables</strong>; <code>ufw</code> (Ubuntu) và <code>firewalld</code> (Fedora, RHEL) là giao diện phía trước, viết luật nftables thay cho bạn, còn lệnh <code>iptables</code> trên Ubuntu 24.04 tự xưng là <code>iptables v1.8.10 (nf_tables)</code> — một lớp dịch đổ vào đúng bộ máy đó.</p>
<table>
<tr><th></th><th>ufw</th><th>firewalld</th><th>nftables (<code>nft</code>)</th></tr>
<tr><td>Mặc định trên</td><td>Ubuntu (có sẵn trên bản server, <strong>TẮT</strong> tới khi <code>ufw enable</code>)</td><td>Fedora, RHEL, Rocky (<strong>BẬT</strong>)</td><td>bên dưới cả hai</td></tr>
<tr><td>Mô hình</td><td>một danh sách luật cho phép/chặn theo cổng và nguồn</td><td><strong>vùng</strong> (zone): mỗi giao diện thuộc một vùng có dịch vụ và cổng riêng</td><td>bảng → chuỗi (móc vào đường đi input/forward/output) → luật</td></tr>
<tr><td>Mở cổng 443</td><td><code>sudo ufw allow 443/tcp</code></td><td><code>sudo firewall-cmd --add-service=https --permanent</code> rồi <code>--reload</code></td><td><code>sudo nft add rule inet filter input tcp dport 443 accept</code></td></tr>
<tr><td>Xem luật</td><td><code>sudo ufw status verbose</code> / <code>numbered</code></td><td><code>firewall-cmd --list-all</code></td><td><code>sudo nft list ruleset</code></td></tr>
<tr><td>Sống qua khởi động lại</td><td>có</td><td>chỉ khi có <code>--permanent</code></td><td>chỉ khi lưu vào <code>/etc/nftables.conf</code></td></tr>
</table>
<p>Thứ mà ufw thật sự viết ra, đo trong container Ubuntu 24.04:</p>
<pre><code class="language-bash">sudo ufw allow 22/tcp
sudo ufw allow from 172.21.0.3 to any port 19090 proto tcp
sudo ufw default deny incoming &amp;&amp; sudo ufw --force enable
sudo nft list chain ip filter ufw-user-input</code></pre>
<div class="out">table ip filter {
	chain ufw-user-input {
		tcp dport 22 counter packets 0 bytes 0 accept
		ip saddr 172.21.0.3 tcp dport 19090 counter packets 1 bytes 60 accept
		…
	}
}</div>
<p>Dòng <code>counter packets 1</code> ở luật cổng 19090 là một phép chẩn đoán miễn phí: nó tăng lên đúng lúc trình khách được phép kết nối. Và mặc định của Fedora rất đáng nhìn một lần, đọc không cần root trên Fedora 44 Workstation:</p>
<pre><code>firewall-cmd --list-all</code></pre>
<div class="out">FedoraWorkstation (default, active)
  target: default
  interfaces: enp3s0
  services: dhcpv6-client mdns samba-client ssh
  ports: 1025-65535/udp 1025-65535/tcp
  …</div>
<p>Vùng mặc định của Fedora <em>Workstation</em> mở mọi cổng từ 1025 trở lên, nên một server dev chạy trên <code>0.0.0.0:3000</code> là cả mạng LAN với tới được. Fedora Server và RHEL mặc định dùng một vùng chặt hơn nhiều. Cùng họ lệnh, mặc định rất khác nhau — hãy nhìn trước khi giả định.</p>

<h3>DROP so với REJECT, đo thật</h3>

${slide('lx-09', 26, 'DROP (28) và REJECT (7); Docker vượt mặt ufw')}
<pre><code class="language-bash">sudo nft add table inet lx09
sudo nft add chain inet lx09 input '{ type filter hook input priority 0; policy accept; }'
sudo nft add rule inet lx09 input tcp dport 19091 counter drop
sudo nft add rule inet lx09 input ip saddr 172.21.0.4 tcp dport 19090 counter reject
<span class="tok-comment"># từ các trình khách:</span>
curl -sS -m 3 http://172.21.0.5:19091/; echo "exit=\$?"
curl -sS -m 3 http://172.21.0.5:19090/; echo "exit=\$?"     <span class="tok-comment"># từ 172.21.0.4</span>
sudo nft list table inet lx09 | grep counter</code></pre>
<div class="out">curl: (28) Connection timed out after 3003 milliseconds
exit=28
curl: (7) Failed to connect to 172.21.0.5 port 19090 after 0 ms: Couldn't connect to server
exit=7
		tcp dport 19091 counter packets 3 bytes 180 drop
		ip saddr 172.21.0.4 tcp dport 19090 counter packets 1 bytes 60 reject with icmp port-unreachable</div>
<p>Ba gói bị vứt cho một lệnh curl — gói SYN của trình khách cộng các lần gửi lại — và trình khách chờ đủ ba giây. Trình khách bị từ chối thì nhận câu trả lời sau 0 ms. <strong>DROP</strong> giấu việc có thứ gì ở đó và bắt trình khách chờ; <strong>REJECT</strong> trả lời "không" ngay lập tức. ufw dùng DROP cho chính sách mặc định; một luật <code>ufw reject</code> thì gửi lời từ chối. Khi chính bạn là người gỡ lỗi: hết giờ nghĩa là có thứ gì đó đang âm thầm vứt gói tin (một tường lửa hoặc đường tới máy), còn "refused" tức thì nghĩa là chính cái máy đã trả lời — hoặc không ai nghe cổng đó, hoặc tường lửa đặt REJECT.</p>

<h3>Docker và ufw không đồng thuận với nhau</h3>
<pre><code class="language-bash">sudo ufw default deny incoming
sudo ufw enable
docker run -d -p 3306:3306 mysql        <span class="tok-comment"># giờ với tới được từ internet</span>
curl -sv telnet://203.0.113.42:3306     <span class="tok-comment"># từ một máy khác: nó kết nối được</span></code></pre>
<div class="callout warn"><strong>Docker chèn luật của riêng nó vào TRƯỚC luật của ufw.</strong> Công bố một cổng bằng <code>-p 3306:3306</code> sẽ ghi một luật vào chuỗi <code>DOCKER</code> trong bảng <code>nat</code>, và bảng đó được xét <em>TRƯỚC</em> cái chuỗi <code>filter</code> mà ufw quản lý — nên <code>ufw status</code> hiện ra rằng cổng đang bị chặn trong khi cả thế giới với tới được. Chuyện này làm người ta bất ngờ rất mạnh, và nó đã phơi ra vô số cơ sở dữ liệu dùng để phát triển.</div>
<pre><code class="language-bash"><span class="tok-comment"># Cách chữa: chỉ công bố ra loopback, rồi để một proxy ngược lo phần internet</span>
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
<pre><code class="language-bash">sudo apt install fail2ban
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
<pre><code class="language-bash"><span class="tok-comment"># Nén lại thành một script dán được lên máy chủ</span>
port=\${1:?cách dùng: check-port CỔNG}
echo "== đang lắng nghe ==" ; sudo ss -tulpn | grep ":\$port" || echo "  không có gì trên :\$port"
echo "== cục bộ =="         ; curl -s -o /dev/null -w '  %{http_code}\\n' "localhost:\$port" || echo "  không trả lời"
echo "== ufw =="            ; sudo ufw status | grep -E "\$port|Status" || echo "  ufw không bật"
echo "== docker =="         ; sudo iptables -t nat -L DOCKER -n 2&gt;/dev/null | grep ":\$port" || true</code></pre>
<div class="out">== đang lắng nghe ==
tcp   LISTEN 0      511        127.0.0.1:3000       0.0.0.0:*    users:(("node",pid=5012,fd=21))
== cục bộ ==
  200
== ufw ==
Status: active
3000/tcp                   ALLOW IN    Anywhere</div>
<p>Hãy đọc output đó như một chẩn đoán: dịch vụ trả lời được ở cục bộ, ufw cho phép cổng — và nó đang gắn vào <code>127.0.0.1</code>, nên bên ngoài chẳng ai với tới được, bất kể mọi thứ khác. Luật tường lửa không SAI; nó KHÔNG LIÊN QUAN. Thiếu bước 1 thì bạn đã tiêu cả buổi chiều vào ufw.</p>

<h3>Ubuntu 24.04: cổng SSH thuộc về systemd</h3>

${slide('lx-09', 27, 'Ubuntu 24.04: ssh.socket giữ cổng SSH')}
<p>Bước đầu tiên của bảng kiểm — "cái gì đang nghe, trên cổng nào?" — còn một khúc quanh nữa trên Ubuntu đời mới. Từ 22.10, <code>sshd</code> được <strong>kích hoạt theo socket</strong> (socket activation): chính systemd nghe cổng 22 (<code>ssh.socket</code>) và khởi động <code>sshd</code> khi có kết nối tới. Câu chuyện thật từ dự án của khoá học này: thêm <code>Port 993</code> vào <code>sshd_config</code>, khởi động lại sshd, và cổng 993 vẫn đóng. Dựng lại trong container Ubuntu 24.04 chạy systemd thật:</p>
<pre><code class="language-bash">systemctl is-enabled ssh.socket ssh.service
ss -tlnp | grep :22
echo "Port 993" &gt;&gt; /etc/ssh/sshd_config
systemctl restart ssh
sshd -T | grep ^port
ss -tlnp | grep -E ":22 |:993 "</code></pre>
<div class="out">enabled
disabled
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("systemd",pid=1,fd=50))
port 993
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=665,fd=3),("systemd",pid=1,fd=50))</div>
<p>Cấu hình nói 993; thực tế nói 22, và socket thuộc về <code>systemd</code> (PID 1). sshd có đọc cổng mới — chỉ là nó không bao giờ tự mở socket. Ubuntu 24.04 có kèm một <em>generator</em> (bộ sinh cấu hình) biến <code>Port</code>/<code>ListenAddress</code> thành thiết lập của socket, nhưng chỉ khi systemd nạp lại các unit:</p>
<pre><code class="language-bash">systemctl daemon-reload
systemctl restart ssh.socket
ss -tlnp | grep -E ":22 |:993 "
cat /run/systemd/generator/ssh.socket.d/*.conf</code></pre>
<div class="out">LISTEN 0      4096         0.0.0.0:993        0.0.0.0:*    users:(("sshd",pid=709,fd=3),("systemd",pid=1,fd=47))
# Automatically generated by sshd-socket-generator

[Socket]
ListenStream=
ListenStream=0.0.0.0:993
ListenStream=[::]:993</div>
<p>Đọc kỹ output cuối: dòng <code>ListenStream=</code> rỗng xoá giá trị mặc định, nên một dòng <code>Port 993</code> đứng một mình sẽ <strong>THAY THẾ</strong> cổng 22 chứ không thêm vào. Trên một máy chủ ở xa, đó là một vụ tự khoá mình ngoài cửa đang chờ xảy ra — thứ bạn muốn là <code>Port 22</code> <em>VÀ</em> <code>Port 993</code>. Trên VPS production của dự án, người vận hành chọn cách thứ ba: một dịch vụ nghe riêng, độc lập ở cổng 993, để cái socket đang canh mọi lần đăng nhập không bao giờ phải khởi động lại. Ba tầng, ba phép kiểm khác nhau: <code>sshd -T</code> cho cấu hình, <code>ss -tlnp</code> cho thứ thật sự đang nghe, và một lần đăng nhập từ máy khác cho câu "tôi có vào được không".</p>

<h3>Chiều đi ra cũng quan trọng</h3>
<pre><code class="language-bash">sudo ufw default deny outgoing          <span class="tok-comment"># chặt chẽ; giờ mở đúng thứ bạn cần</span>
sudo ufw allow out 53                   <span class="tok-comment"># DNS</span>
sudo ufw allow out 80,443/tcp           <span class="tok-comment"># cập nhật gói, gọi API</span>
sudo ufw allow out 25,587/tcp           <span class="tok-comment"># thư, nếu máy này có gửi</span></code></pre>
<div class="callout">Mặc định chặn chiều đi ra là chuyện không thường gặp trên một máy chủ đa dụng và thật sự có giá trị trên một máy chạy mã không tin được: nó giới hạn những gì một ứng dụng bị chiếm có thể với tới và có thể gửi dữ liệu đi đâu. Nó cũng là một cách đáng tin để làm hỏng việc cài gói, webhook và gia hạn chứng chỉ theo những kiểu khó hiểu, nên hãy thêm nó một cách có chủ ý rồi kiểm từng việc mà cái máy thật sự làm. Nếu việc tải về chạy được với bạn mà không chạy với một dịch vụ, hãy nhớ tới các biến proxy ở Bài 8.3 trước khi đổ lỗi cho tường lửa.</div>

<h3>Chạy thử từng bước</h3>
<p>ufw và nftables cần quyền <code>NET_ADMIN</code>, thứ mà một container thường không có. Hãy cấp cho nó — luật khi đó áp lên không gian mạng riêng của container, không bao giờ lên laptop của bạn:</p>
<pre><code class="language-bash">docker network create lx09-net      <span class="tok-comment"># nếu chưa có</span>
docker run --rm -it --cap-add NET_ADMIN --network lx09-net --name lx09-fw ubuntu:24.04 bash
<span class="tok-comment"># bên trong:</span>
apt-get update -qq &amp;&amp; apt-get install -y -qq ufw nftables python3 &gt;/dev/null
ufw allow 22/tcp; ufw default deny incoming; ufw --force enable
ufw status numbered
nft list tables
python3 -m http.server 19090 &amp;
nft list chain ip filter ufw-user-input</code></pre>
<p>Rồi từ một container thứ hai trên cùng mạng Docker, (<code>docker run --rm -it --network lx09-net ubuntu:24.04 bash</code>, rồi <code>apt-get install -y curl</code>) thử <code>curl -m 3 http://lx09-fw:19090/</code> (hết giờ, vì ufw vứt nó), <code>ufw allow 19090/tcp</code>, và thử lại (200). Xem nó diễn ra bằng <code>tcpdump -n -i eth0 port 19090</code> trong container thứ nhất. Mọi thứ biến mất cùng container.</p>

<h3>Trên macOS và WSL khác gì</h3>
<ul>
<li><strong>macOS</strong> không có ufw, firewalld hay nftables. Tường lửa hướng tới người dùng của nó là <em>Application Firewall</em>, cho phép hay chặn theo <em>CHƯƠNG TRÌNH</em>, không theo cổng; kiểm tra chỉ-đọc bằng <code>/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate</code> (trên chiếc Mac dùng ở đây: <code>Firewall is enabled. (State = 1)</code>). Bên dưới là <code>pf</code> của BSD (<code>pfctl</code>, chỉ root). Với bước "cái gì đang nghe", dùng <code>lsof -nP -iTCP -sTCP:LISTEN</code>.</li>
<li><strong>WSL2</strong>: phía Linux chạy được ufw, nhưng lưu lượng từ máy khác tới WSL phải đi qua Windows trước — Windows Defender Firewall (và trên Windows 11 đời mới, một tường lửa Hyper-V riêng cho WSL) quyết định trước khi bất kỳ luật Linux nào thấy gói tin. Khi một cổng "đã mở trong WSL" mà điện thoại không với tới, hãy nhìn phía Windows.</li>
<li><strong>Fedora</strong>: <code>firewall-cmd --list-all</code> chạy được không cần root; đổi bất cứ thứ gì thì cần <code>sudo</code> và <code>--permanent</code> để sống qua khởi động lại.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau khi nhóm bạn "bảo mật" máy demo bằng ufw, giảng viên không mở được trang quản trị ở cổng 19090 nữa, còn một bạn trong nhóm khăng khăng tường lửa ổn. Hãy tìm ra tầng hỏng kèm bằng chứng, trong một container chạy với <code>--cap-add NET_ADMIN</code>.</p><ol>
<li>Chạy <code>python3 -m http.server 19090</code> và <code>python3 -m http.server 19091 --bind 127.0.0.1</code>. Bật ufw chỉ với <code>allow 22/tcp</code> và <code>default deny incoming</code>.</li>
<li>Từ container thứ hai, curl cả hai cổng với <code>-m 3</code> và ghi lại hai mã thoát. Giải thích vì sao chúng khác nhau, dùng <code>ss -tlnp</code> trên máy chủ.</li>
<li>Bắt gói bằng <code>tcpdump -n -i eth0 'port 19090 or port 19091'</code> trong lúc thử lại và xếp loại từng cổng theo bảng ở trên.</li>
<li>Sửa 19090 bằng đúng một luật ufw giới hạn theo IP container của bạn cùng nhóm, rồi cho thấy bộ đếm trong <code>nft list chain ip filter ufw-user-input</code> tăng lên.</li></ol>
<p><strong>Đạt khi:</strong> 19090 đổi từ thoát 28 (bị vứt) sang 200 sau đúng một luật; 19091 vẫn không với tới và bạn nói được vì sao không luật tường lửa nào đổi được điều đó; và bạn có một dòng bắt gói cho mỗi trường hợp.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Host firewall (tường lửa của máy)</span><span class="v">Lọc ngay trên chính cái máy (ufw, firewalld, nftables), sau khi gói tin đã tới.</span></div>
  <div class="kv"><span class="k">Security group / cloud firewall (tường lửa của nhà cung cấp)</span><span class="v">Lọc do nhà cung cấp làm trước khi gói tin tới máy bạn — từ bên trong máy không nhìn thấy.</span></div>
  <div class="kv"><span class="k">DROP / REJECT (vứt / từ chối)</span><span class="v">Âm thầm bỏ đi (trình khách chờ rồi hết giờ) / trả lời "refused" ngay.</span></div>
  <div class="kv"><span class="k">Table, chain, rule của nftables (bảng, chuỗi, luật)</span><span class="v">Cấu trúc bộ lọc của nhân: bảng chứa các chuỗi móc vào đường đi của lưu lượng; chuỗi chứa luật.</span></div>
  <div class="kv"><span class="k">Zone của firewalld (vùng)</span><span class="v">Một mức tin cậy có tên gán cho các giao diện, mỗi vùng có dịch vụ và cổng mở riêng.</span></div>
  <div class="kv"><span class="k">SYN / SYN-ACK / RST</span><span class="v">"Cho tôi kết nối nhé", "được", và "không có ai ở đây" của TCP — tcpdump hiện là <code>[S]</code>, <code>[S.]</code>, <code>[R.]</code>.</span></div>
  <div class="kv"><span class="k">Socket activation (kích hoạt theo socket)</span><span class="v">systemd giữ cổng nghe và khởi động dịch vụ ở kết nối đầu tiên (<code>ssh.socket</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một gói tin có thể chết ở ba chỗ — ngoài máy, ở tường lửa của máy, hoặc ở một dịch vụ gắn sai địa chỉ — và mỗi chỗ có phép thử riêng.</li>
<li><code>tcpdump</code> phân biệt được chúng: không thấy gì, SYN lặp lại, ICMP unreachable, hay RST — mỗi cái chĩa vào một tầng khác.</li>
<li>ufw và firewalld là giao diện của nftables; đọc luật thật bằng <code>nft list ruleset</code>, và nhớ Fedora Workstation mở mọi cổng ≥ 1025.</li>
<li>DROP làm trình khách hết giờ (curl 28); REJECT và "không ai nghe" từ chối ngay (curl 7).</li>
<li>Cổng Docker công bố đi vòng qua ufw; hãy công bố ra <code>127.0.0.1</code> và rà bằng <code>ss -tlnp | grep 0.0.0.0</code>.</li>
<li>Trên Ubuntu 24.04 systemd giữ cổng 22: đổi <code>Port</code> xong phải <code>daemon-reload</code> và restart <code>ssh.socket</code> — và giữ cổng 22 trong danh sách.</li>
</ul>

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
      description: 'Mười câu tình huống: 127.0.0.1 và mã curl 7, /etc/hosts với dig, dig thoát 0 khi NXDOMAIN, đọc mốc curl -w, bẫy $? trong if !, thứ tự Match trong ssh_config, sshd 50- thắng 99-, ssh -R nghe ở đâu, --max-delete, và ssh.socket trên Ubuntu 24.04.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from real terminals — every output quoted in these questions was recorded while writing the chapter, in Ubuntu 24.04 containers, on Fedora 44 and on a Mac. Most ask what a command prints or which fix is right; reading commands and their output is the skill this chapter builds.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can climb the four-rung ladder and name the broken layer from the first failing rung.</li>
<li>I can read the Local Address column of <code>ss -tlnp</code> and explain why <code>127.0.0.1</code> is unreachable from outside.</li>
<li>I know which of <code>dig</code>, <code>host</code>, <code>nslookup</code> and <code>getent</code> reads <code>/etc/hosts</code>, and what <code>dig</code> returns for a missing name.</li>
<li>I can turn <code>curl -w</code> timings into DNS, TCP, TLS and server time, and map curl exit codes 6, 7, 22 and 28 to layers.</li>
<li>I can write <code>~/.ssh/config</code> with <code>Match</code>, <code>ProxyJump</code> and ControlMaster, open <code>-L</code>/<code>-R</code>/<code>-D</code> tunnels, and verify sshd changes with <code>sshd -T</code>.</li>
<li>I can run rsync with a dry run and guards, and tell DROP from REJECT with curl and tcpdump.</li>
</ul>
${slide('lx-09', 30, 'Bảng tra nhanh Chương 9 (1/2)')}
${slide('lx-09', 31, 'Bảng tra nhanh Chương 9 (2/2)')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ terminal thật — mọi output trích trong câu hỏi đều được ghi lại lúc viết chương này, trong container Ubuntu 24.04, trên Fedora 44 và trên Mac. Phần lớn hỏi một lệnh in ra gì hoặc cách sửa nào đúng; đọc lệnh và đọc output là kỹ năng chương này xây cho bạn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi leo được cái thang bốn bậc và gọi tên tầng hỏng từ bậc đầu tiên thất bại.</li>
<li>Tôi đọc được cột Local Address của <code>ss -tlnp</code> và giải thích vì sao <code>127.0.0.1</code> không với tới được từ bên ngoài.</li>
<li>Tôi biết trong <code>dig</code>, <code>host</code>, <code>nslookup</code> và <code>getent</code> cái nào đọc <code>/etc/hosts</code>, và <code>dig</code> trả về gì khi tên không tồn tại.</li>
<li>Tôi đổi được các mốc <code>curl -w</code> thành thời gian DNS, TCP, TLS và máy chủ, và ghép được mã thoát 6, 7, 22, 28 của curl với từng tầng.</li>
<li>Tôi viết được <code>~/.ssh/config</code> có <code>Match</code>, <code>ProxyJump</code> và ControlMaster, mở được đường hầm <code>-L</code>/<code>-R</code>/<code>-D</code>, và nghiệm thu thay đổi của sshd bằng <code>sshd -T</code>.</li>
<li>Tôi chạy được rsync có chạy thử và chốt chặn, và phân biệt được DROP với REJECT bằng curl và tcpdump.</li>
</ul>
${slide('lx-09', 30, 'Bảng tra nhanh Chương 9 (1/2)')}
${slide('lx-09', 31, 'Bảng tra nhanh Chương 9 (2/2)')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'On the server, ss -tlnp shows "LISTEN 0 511 127.0.0.1:3000 … users:((\"node\",…))" and ufw status shows "3000/tcp ALLOW IN Anywhere". From your laptop you run curl -sS http://SERVER_IP:3000/. What happens?|||Trên máy chủ, ss -tlnp hiện "LISTEN 0 511 127.0.0.1:3000 … users:((\"node\",…))" và ufw status hiện "3000/tcp ALLOW IN Anywhere". Từ laptop bạn chạy curl -sS http://IP_MÁY_CHỦ:3000/. Chuyện gì xảy ra?',
            options: [
              'curl: (28) Connection timed out — ufw must be reloaded before the rule applies|||curl: (28) Connection timed out — phải nạp lại ufw thì luật mới có hiệu lực',
              'curl: (7) Failed to connect — nothing listens on the public address; bind the app to 0.0.0.0 or reach it through nginx or ssh -L|||curl: (7) Failed to connect — không có gì nghe trên địa chỉ công khai; gắn app vào 0.0.0.0 hoặc đi qua nginx hay ssh -L',
              'curl: (6) Could not resolve host — the server IP must be added to /etc/hosts|||curl: (6) Could not resolve host — phải thêm IP máy chủ vào /etc/hosts',
              'curl: (22) 404 — the route is not mounted in the Node app|||curl: (22) 404 — route chưa được gắn trong app Node',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The firewall lets the SYN in, but no socket is bound to the public address, so the kernel answers with a reset at once: exit 7, "after 0 ms" — exactly what the lab measured for a loopback-bound server. A timeout (28) would mean something was DROPPING the packet, which an ALLOW rule rules out; and 22 needs -f and a server that actually answered.|||VI: Tường lửa cho gói SYN vào, nhưng không socket nào gắn vào địa chỉ công khai, nên nhân trả lời ngay bằng một gói reset: thoát 7, "after 0 ms" — đúng như phòng thí nghiệm đo với server gắn loopback. Hết giờ (28) nghĩa là có thứ đang VỨT gói tin, điều mà một luật ALLOW đã loại trừ; còn 22 thì cần -f và một máy chủ đã thật sự trả lời.',
          },
          {
            question: 'getent hosts api.nhom5.local prints "10.9.9.9 api.nhom5.local", dig +short api.nhom5.local prints "203.0.113.7", and the backend keeps connecting to 10.9.9.9. Why?|||getent hosts api.nhom5.local in "10.9.9.9 api.nhom5.local", dig +short api.nhom5.local in "203.0.113.7", và backend cứ kết nối tới 10.9.9.9. Vì sao?',
            options: [
              'The DNS change has not propagated yet; wait for the TTL|||Thay đổi DNS chưa lan truyền; hãy chờ hết TTL',
              'dig asked a different resolver that still has a cached answer|||dig hỏi một bộ phân giải khác vẫn còn câu trả lời cũ trong bộ đệm',
              'A line in /etc/hosts: applications resolve through nsswitch ("hosts: files dns"), which reads the file first, while dig ignores it|||Một dòng trong /etc/hosts: ứng dụng phân giải qua nsswitch ("hosts: files dns"), thứ đọc file đó trước, còn dig thì bỏ qua nó',
              'Node caches DNS answers forever, so the app must be restarted|||Node lưu tạm câu trả lời DNS vĩnh viễn, nên phải khởi động lại app',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: getent follows the same path as the application and shows 10.9.9.9 — that can only come from /etc/hosts, because dig (which asks DNS directly) gets the real record. The lab reproduced it: getent 10.9.9.9, dig the real IPs, curl timed out. "Not propagated" is tempting, but then dig would be the one showing the old value.|||VI: getent đi đúng con đường của ứng dụng và ra 10.9.9.9 — thứ chỉ có thể đến từ /etc/hosts, vì dig (hỏi thẳng DNS) nhận đúng bản ghi thật. Phòng thí nghiệm đã dựng lại: getent ra 10.9.9.9, dig ra IP thật, curl hết giờ. "Chưa lan truyền" nghe hấp dẫn, nhưng khi đó chính dig mới là cái hiện giá trị cũ.',
          },
          {
            question: 'A deploy script checks DNS with: dig +short "$host" >/dev/null && echo "DNS ok". A teammate mistypes $host as a name that does not exist. What does the line do?|||Một script deploy kiểm DNS bằng: dig +short "$host" >/dev/null && echo "DNS ok". Một bạn gõ nhầm $host thành một tên không tồn tại. Dòng đó làm gì?',
            options: [
              'Prints "DNS ok" — dig exits 0 even for NXDOMAIN; test that the output is non-empty, or use getent/host|||In "DNS ok" — dig thoát 0 cả khi NXDOMAIN; hãy kiểm output có rỗng không, hoặc dùng getent/host',
              'Prints nothing, because dig exits 1 for a missing name|||Không in gì, vì dig thoát 1 khi tên không tồn tại',
              'Prints an error to stderr and exits 9|||In lỗi ra stderr và thoát 9',
              'Hangs until the resolver times out, then prints nothing|||Treo tới khi bộ phân giải hết giờ, rồi không in gì',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured on Ubuntu 24.04 (BIND 9.18): dig +short on a missing name prints nothing and exits 0 — an NXDOMAIN answer is still an answer. host exits 1 and getent exits 2 for the same name. Exit 9 is real but means "no servers could be reached" (seen on the school network with @1.1.1.1), not "name does not exist".|||VI: Đo trên Ubuntu 24.04 (BIND 9.18): dig +short với tên không tồn tại không in gì và thoát 0 — câu trả lời NXDOMAIN vẫn là một câu trả lời. Với cùng tên đó host thoát 1, getent thoát 2. Mã 9 có thật nhưng nghĩa là "không với tới máy chủ nào" (gặp ở mạng trường với @1.1.1.1), không phải "tên không tồn tại".',
          },
          {
            question: 'curl -w prints: dns=0.0077 tcp=0.0342 tls=0.0723 ttfb=0.1016 total=0.1019. How long did the server spend between the end of the TLS handshake and the first byte of its answer?|||curl -w in ra: dns=0.0077 tcp=0.0342 tls=0.0723 ttfb=0.1016 total=0.1019. Máy chủ mất bao lâu từ lúc bắt tay TLS xong tới byte đầu tiên của câu trả lời?',
            options: [
              '101.6 ms|||101,6 ms',
              '72.3 ms|||72,3 ms',
              '38.0 ms|||38,0 ms',
              '29.4 ms|||29,4 ms',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Every curl timing is cumulative from the start, so a stage is the difference of two neighbours: ttfb − tls = 0.1016 − 0.0723 = 29.3–29.4 ms (29.35 ms from the unrounded values of this Fedora measurement). 101.6 ms is the whole time to first byte; 38.0 ms is the TLS handshake itself (0.0723 − 0.0342).|||VI: Mọi mốc thời gian của curl đều cộng dồn từ lúc bắt đầu, nên một chặng là hiệu của hai mốc liền nhau: ttfb − tls = 0,1016 − 0,0723 = 29,3–29,4 ms (29,35 ms theo số chưa làm tròn của phép đo Fedora này). 101,6 ms là cả quãng tới byte đầu; 38,0 ms là chính cú bắt tay TLS (0,0723 − 0,0342).',
          },
          {
            question: 'With $url pointing at a host that does not resolve (curl exits 6), what does this line print? if ! body=$(curl -sSf "$url"); then case $? in 6) echo "DNS hỏng" ;; *) echo "mã $?" ;; esac; fi|||Với $url trỏ tới một tên máy không phân giải được (curl thoát 6), dòng này in ra gì? if ! body=$(curl -sSf "$url"); then case $? in 6) echo "DNS hỏng" ;; *) echo "mã $?" ;; esac; fi',
            options: [
              'It prints: DNS hỏng|||In ra: DNS hỏng',
              'It prints: mã 6|||In ra: mã 6',
              'It prints: mã 0|||In ra: mã 0',
              'Nothing — the script stops because curl failed|||Không gì cả — script dừng vì curl hỏng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: "!" inverts the status, so inside then, $? is the status of the whole negated test: 0. The case falls to *) and prints "mã 0" — measured in bash 5.2. Save the code first: body=$(curl …) || { rc=$?; case $rc in … esac; }. "DNS hỏng" is what the author intended, which is why the bug survives code review.|||VI: "!" đảo mã thoát, nên trong then, $? là mã của cả phép thử đã bị đảo: 0. case rơi vào *) và in "mã 0" — đo trên bash 5.2. Hãy lưu mã trước: body=$(curl …) || { rc=$?; case $rc in … esac; }. "DNS hỏng" là điều người viết định làm, và đó là lý do lỗi này lọt qua mọi lần đọc lại mã.',
          },
          {
            question: 'Your ~/.ssh/config has, in this order: the block [Host vps · HostName 203.0.113.42 · Port 22], then the block [Match originalhost vps exec "test -f /tmp/o-truong" · Port 993]. With /tmp/o-truong present, what does ssh -G vps | grep ^port print?|||~/.ssh/config của bạn có, theo đúng thứ tự: khối [Host vps · HostName 203.0.113.42 · Port 22], rồi khối [Match originalhost vps exec "test -f /tmp/o-truong" · Port 993]. Khi có file /tmp/o-truong, ssh -G vps | grep ^port in ra gì?',
            options: [
              'port 22 — ssh_config keeps the first value obtained; move the Match block above Host vps|||port 22 — ssh_config giữ giá trị lấy được ĐẦU TIÊN; hãy chuyển khối Match lên trên Host vps',
              'port 993 — a Match block always overrides a Host block|||port 993 — khối Match luôn đè lên khối Host',
              'port 22 and port 993 — ssh tries both|||port 22 và port 993 — ssh thử cả hai',
              'An error: Port is specified twice|||Một lỗi: Port bị khai hai lần',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: For each keyword ssh uses the first value it obtains (ssh_config(5)). Port 22 is read first, so the matching block is silently ignored — the lab printed "port 22" for this order and "port 993" with Match placed first. That is also why Host * belongs at the end of the file.|||VI: Với mỗi từ khoá, ssh dùng giá trị ĐẦU TIÊN nó lấy được (ssh_config(5)). Port 22 được đọc trước, nên khối khớp điều kiện bị lờ đi trong im lặng — phòng thí nghiệm in "port 22" với thứ tự này và "port 993" khi đặt Match lên trước. Đó cũng là lý do Host * phải nằm cuối file.',
          },
          {
            question: '/etc/ssh/sshd_config.d/ holds 50-cloud-init.conf ("PasswordAuthentication yes") and 99-hardening.conf ("PasswordAuthentication no"). sshd -t reports no error. What does sshd -T | grep ^passwordauthentication print?|||/etc/ssh/sshd_config.d/ chứa 50-cloud-init.conf ("PasswordAuthentication yes") và 99-hardening.conf ("PasswordAuthentication no"). sshd -t không báo lỗi gì. sshd -T | grep ^passwordauthentication in ra gì?',
            options: [
              'passwordauthentication no — the highest-numbered file is read last and wins|||passwordauthentication no — file số lớn nhất được đọc sau cùng và thắng',
              'An error about a duplicate keyword|||Một lỗi về từ khoá bị trùng',
              'passwordauthentication no — sshd -t already validated the hardening|||passwordauthentication no — sshd -t đã xác nhận phần gia cố',
              'passwordauthentication yes — sshd keeps the first value read; rename the file 01-hardening.conf and re-check with sshd -T|||passwordauthentication yes — sshd giữ giá trị đọc được đầu tiên; đổi tên file thành 01-hardening.conf rồi kiểm lại bằng sshd -T',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The drop-ins are included in alphabetical order and sshd keeps the first value, so 50- beats 99-. Reproduced on Ubuntu 24.04: "passwordauthentication yes" and a password login succeeded; after renaming to 01- and reloading, "no" and "Permission denied (publickey)". "Last file wins" is how many other programs behave, which is exactly why this bites; sshd -t checks syntax only.|||VI: Các file thả vào được nạp theo thứ tự chữ cái và sshd giữ giá trị đầu tiên, nên 50- thắng 99-. Dựng lại trên Ubuntu 24.04: "passwordauthentication yes" và đăng nhập bằng mật khẩu vẫn vào được; đổi tên thành 01- rồi nạp lại thì ra "no" và "Permission denied (publickey)". "File sau cùng thắng" là cách nhiều chương trình khác cư xử, và đó chính là lý do cái bẫy này cắn người; sshd -t chỉ kiểm cú pháp.',
          },
          {
            question: 'On your laptop you run ssh -fN -R 19097:localhost:19096 vps. Which statement is true?|||Trên laptop bạn chạy ssh -fN -R 19097:localhost:19096 vps. Câu nào đúng?',
            options: [
              'Port 19097 opens on the laptop and forwards to port 19096 on the vps|||Cổng 19097 mở trên laptop và chuyển tới cổng 19096 của vps',
              'Port 19097 opens on the vps, bound to 127.0.0.1 by default; connections to it reach localhost:19096 on your laptop|||Cổng 19097 mở trên vps, mặc định gắn vào 127.0.0.1; kết nối vào đó sẽ tới localhost:19096 trên laptop của bạn',
              'Port 19097 opens on the vps on 0.0.0.0, so the whole internet can reach your laptop|||Cổng 19097 mở trên vps ở 0.0.0.0, nên cả internet với tới được laptop của bạn',
              'Nothing listens until the first connection arrives through the tunnel|||Chẳng có gì nghe cho tới khi kết nối đầu tiên đi qua đường hầm',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: -R ("remote") opens the listener on the server. In the lab, ss on the vps showed "LISTEN … 127.0.0.1:19097" and curl localhost:19097 there returned the laptop’s dev page. Binding to 0.0.0.0 would need GatewayPorts on the server — the default keeps the tunnel private. Option A describes -L.|||VI: -R ("remote") mở cổng nghe trên máy chủ. Trong phòng thí nghiệm, ss trên vps hiện "LISTEN … 127.0.0.1:19097" và curl localhost:19097 ở đó trả về trang dev của laptop. Muốn gắn vào 0.0.0.0 thì phải bật GatewayPorts ở máy chủ — mặc định giữ đường hầm ở chế độ riêng tư. Phương án A là mô tả của -L.',
          },
          {
            question: 'build/ is empty because the build failed. app/ on the server has 4 entries. You run rsync -a --delete --max-delete=2 build/ vps:app/. What is the result?|||build/ đang rỗng vì bản dựng hỏng. app/ trên máy chủ có 4 mục. Bạn chạy rsync -a --delete --max-delete=2 build/ vps:app/. Kết quả là gì?',
            options: [
              'Nothing is deleted: rsync refuses an empty source|||Không gì bị xoá: rsync từ chối một nguồn rỗng',
              'All 4 entries are deleted and rsync exits 0|||Cả 4 mục bị xoá và rsync thoát 0',
              '2 entries are deleted, the rest are kept, and rsync exits 25|||2 mục bị xoá, phần còn lại được giữ, và rsync thoát 25',
              'Nothing is deleted and rsync exits 23|||Không gì bị xoá và rsync thoát 23',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: --max-delete is a brake, not a wall: rsync performed two deletions, printed "Deletions stopped due to --max-delete limit (2 skipped)" and exited 25 — measured in the lab. Without the flag it would have deleted everything and exited 0. Exit 23 with nothing deleted is what a MISSING source (a typo) produced; rsync has no rule against an empty one.|||VI: --max-delete là cái phanh, không phải bức tường: rsync đã xoá hai mục, in "Deletions stopped due to --max-delete limit (2 skipped)" và thoát 25 — đo trong phòng thí nghiệm. Không có cờ đó nó sẽ xoá sạch và thoát 0. Thoát 23 mà không xoá gì là thứ một nguồn KHÔNG TỒN TẠI (gõ nhầm) sinh ra; rsync không có luật nào cấm nguồn rỗng.',
          },
          {
            question: 'Ubuntu 24.04 VPS: you add "Port 993" to /etc/ssh/sshd_config and run systemctl restart ssh. sshd -T | grep ^port prints "port 993", but ss -tlnp shows only :22, owned by systemd (pid 1). What is the correct fix?|||VPS Ubuntu 24.04: bạn thêm "Port 993" vào /etc/ssh/sshd_config và chạy systemctl restart ssh. sshd -T | grep ^port in "port 993", nhưng ss -tlnp chỉ thấy :22, do systemd (pid 1) giữ. Cách sửa đúng là gì?',
            options: [
              'systemctl daemon-reload, then systemctl restart ssh.socket — and write Port 22 as well, because a lone Port 993 replaces 22|||systemctl daemon-reload, rồi systemctl restart ssh.socket — và viết cả Port 22, vì một dòng Port 993 đứng một mình sẽ thay thế 22',
              'Run systemctl restart ssh again; the first restart only reloads the config|||Chạy systemctl restart ssh lần nữa; lần restart đầu chỉ nạp lại cấu hình',
              'Edit ssh.service and add -p 993 to ExecStart|||Sửa ssh.service và thêm -p 993 vào ExecStart',
              'Open 993 in ufw — the firewall hides the port from ss|||Mở 993 trong ufw — tường lửa giấu cổng khỏi ss',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The socket is owned by ssh.socket, and Ubuntu 24.04 generates its ListenStream from Port only on daemon-reload. Measured: after daemon-reload + restart ssh.socket, ss showed 0.0.0.0:993 — and 22 was gone, because the generated file starts with an empty ListenStream=. Restarting ssh again changes nothing; a firewall never hides a listening socket from ss.|||VI: Socket thuộc về ssh.socket, và Ubuntu 24.04 chỉ sinh ListenStream từ Port khi daemon-reload. Đo thật: sau daemon-reload + restart ssh.socket, ss hiện 0.0.0.0:993 — và 22 biến mất, vì file được sinh ra bắt đầu bằng một dòng ListenStream= rỗng. Restart ssh lần nữa chẳng đổi gì; tường lửa không bao giờ giấu một socket đang nghe khỏi ss.',
          },
        ],
      },
    },
  ],
};
