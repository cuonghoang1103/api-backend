/**
 * NWC204 — Computer Networking (CCNA-based). Giáo trình FLM (syl): kiến trúc/mô
 * hình/giao thức mạng, Ethernet, IP addressing & subnetting, cấu hình router/
 * switch, bảo mật cơ bản, kiểm tra & xử lý sự cố. Song ngữ + ví dụ CLI + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('nwc204-0-1-overview', 'Course overview: Computer Networking|||Tổng quan: Mạng máy tính',
  'Mạng để làm gì, mô hình OSI & TCP/IP, lộ trình: mô hình & giao thức → Ethernet & LAN → IP addressing/subnetting → router/switch, bảo mật & xử lý sự cố. Nền CCNA.',
  [[
    `<span class="eyebrow">NWC204 · Lesson 0.1 · Overview</span>
<h2>Computer Networking (CCNA foundation)</h2>
<p class="lead">Based on the first CCNA course, this introduces the <strong>architectures, models, protocols and components</strong> that let users, devices and applications communicate across networks and the Internet. By the end you can build and configure simple <strong>LANs</strong>, design IP addressing schemes, secure devices, configure routers/switches, and troubleshoot common problems.</p>
<h3>Two models to think in layers</h3>
<ul>
<li><strong>OSI model</strong> (7 layers) — a reference: Physical, Data Link, Network, Transport, Session, Presentation, Application.</li>
<li><strong>TCP/IP model</strong> (4 layers) — the practical Internet stack: Network Access, Internet, Transport, Application.</li>
</ul>
<p>Layering means each layer does one job and talks only to the layers above/below — so you can reason about (and fix) a network one layer at a time.</p>
<h3>Roadmap</h3>
<p>Models &amp; protocols → Ethernet &amp; LANs → IP addressing &amp; subnetting → routers, switches, security &amp; troubleshooting. Bilingual, with CLI examples and exercises. Prepares you for the hands-on CCNA-style Practical Exam.</p>`,
    `<span class="eyebrow">NWC204 · Bài 0.1 · Tổng quan</span>
<h2>Mạng máy tính (nền CCNA)</h2>
<p class="lead">Dựa trên môn CCNA đầu tiên, môn này giới thiệu <strong>kiến trúc, mô hình, giao thức và thành phần</strong> giúp người dùng, thiết bị và ứng dụng liên lạc qua mạng và Internet. Kết thúc, bạn dựng và cấu hình được <strong>LAN</strong> đơn giản, thiết kế sơ đồ địa chỉ IP, bảo mật thiết bị, cấu hình router/switch, và xử lý sự cố thường gặp.</p>
<h3>Hai mô hình để tư duy theo tầng</h3>
<ul>
<li><strong>Mô hình OSI</strong> (7 tầng) — tham chiếu: Physical, Data Link, Network, Transport, Session, Presentation, Application.</li>
<li><strong>Mô hình TCP/IP</strong> (4 tầng) — ngăn xếp Internet thực tế: Network Access, Internet, Transport, Application.</li>
</ul>
<p>Phân tầng nghĩa là mỗi tầng làm một việc và chỉ nói chuyện với tầng trên/dưới — nên bạn suy luận (và sửa) mạng theo từng tầng.</p>
<h3>Lộ trình</h3>
<p>Mô hình &amp; giao thức → Ethernet &amp; LAN → địa chỉ IP &amp; subnetting → router, switch, bảo mật &amp; xử lý sự cố. Song ngữ, có ví dụ CLI và bài tập. Chuẩn bị cho bài thi thực hành kiểu CCNA.</p>`,
  ]]);

const c1 = doc('nwc204-1-1-models-protocols', '1.1 — Models & protocols|||1.1 — Mô hình & giao thức',
  'OSI vs TCP/IP, đóng gói (encapsulation) & PDU, các giao thức chính (TCP vs UDP, IP, HTTP/DNS/DHCP), số cổng.',
  [[
    `<span class="eyebrow">NWC204 · Chapter 1 · Lesson 1.1</span>
<h2>Models &amp; protocols</h2>
<h3>Encapsulation</h3>
<p>As data goes down the stack, each layer wraps it with its own header — this is <strong>encapsulation</strong>. The unit at each layer (a PDU): Application <em>data</em> → Transport <strong>segment</strong> → Network <strong>packet</strong> → Data Link <strong>frame</strong> → Physical <strong>bits</strong>. The receiver reverses it (de-encapsulation).</p>
<h3>Transport: TCP vs UDP</h3>
<table><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td>Reliability</td><td>reliable (acks, retransmit, ordered)</td><td>best-effort (no guarantee)</td></tr>
<tr><td>Speed/overhead</td><td>higher overhead</td><td>fast, lightweight</td></tr>
<tr><td>Use</td><td>web, email, file transfer</td><td>video/voice, DNS, gaming</td></tr>
</tbody></table>
<h3>Key protocols &amp; ports</h3>
<ul>
<li><strong>IP</strong> — addressing &amp; routing packets between networks.</li>
<li><strong>HTTP/HTTPS</strong> (port 80/443) — the web; <strong>DNS</strong> (53) — names → IPs; <strong>DHCP</strong> (67/68) — auto-assign IPs.</li>
</ul>
<div class="callout"><span class="badge">Why layers help</span> A browser problem could be DNS (name lookup), IP (routing), or the app itself. Knowing which layer a protocol lives in tells you where to look.</div>`,
    `<span class="eyebrow">NWC204 · Chương 1 · Bài 1.1</span>
<h2>Mô hình &amp; giao thức</h2>
<h3>Đóng gói (encapsulation)</h3>
<p>Khi dữ liệu đi xuống ngăn xếp, mỗi tầng bọc thêm header của mình — đó là <strong>đóng gói</strong>. Đơn vị ở mỗi tầng (PDU): Application <em>data</em> → Transport <strong>segment</strong> → Network <strong>packet</strong> → Data Link <strong>frame</strong> → Physical <strong>bit</strong>. Bên nhận làm ngược lại (gỡ gói).</p>
<h3>Transport: TCP vs UDP</h3>
<table><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td>Độ tin cậy</td><td>tin cậy (ack, gửi lại, đúng thứ tự)</td><td>nỗ lực tối đa (không đảm bảo)</td></tr>
<tr><td>Tốc độ/chi phí</td><td>chi phí cao hơn</td><td>nhanh, nhẹ</td></tr>
<tr><td>Dùng</td><td>web, email, truyền file</td><td>video/thoại, DNS, game</td></tr>
</tbody></table>
<h3>Giao thức &amp; cổng chính</h3>
<ul>
<li><strong>IP</strong> — đánh địa chỉ &amp; định tuyến gói giữa các mạng.</li>
<li><strong>HTTP/HTTPS</strong> (cổng 80/443) — web; <strong>DNS</strong> (53) — tên → IP; <strong>DHCP</strong> (67/68) — cấp IP tự động.</li>
</ul>
<div class="callout"><span class="badge">Vì sao phân tầng hữu ích</span> Một lỗi trình duyệt có thể do DNS (tra tên), IP (định tuyến), hoặc chính ứng dụng. Biết giao thức nằm ở tầng nào cho bạn biết tìm ở đâu.</div>`,
  ]]);

const c1q = quiz('nwc204-quiz-1', 'Quiz 1 — Models & protocols|||Quiz 1 — Mô hình & giao thức', [
  { id: 'q1', question: 'Giao thức nào TIN CẬY (ack, gửi lại, đúng thứ tự)?', options: ['UDP', 'TCP', 'IP', 'DNS'], correctIndex: 1, explanation: 'TCP tin cậy; UDP best-effort, nhanh nhẹ.' },
  { id: 'q2', question: 'DNS dùng để?', options: ['Cấp IP tự động', 'Chuyển tên miền → địa chỉ IP', 'Mã hoá web', 'Định tuyến gói'], correctIndex: 1, explanation: 'DNS (cổng 53) phân giải tên → IP.' },
  { id: 'q3', question: 'Đơn vị dữ liệu (PDU) ở tầng Network là?', options: ['Frame', 'Segment', 'Packet', 'Bit'], correctIndex: 2, explanation: 'Network = packet; Transport = segment; Data Link = frame.' },
]);

const c2 = doc('nwc204-2-1-ethernet-ip', '2.1 — Ethernet, LAN & IP addressing|||2.1 — Ethernet, LAN & địa chỉ IP',
  'Ethernet & switch (MAC address, frame), LAN/VLAN; địa chỉ IPv4 (lớp, private/public), mặt nạ mạng, giới thiệu IPv6.',
  [[
    `<span class="eyebrow">NWC204 · Chapter 2 · Lesson 2.1</span>
<h2>Ethernet, LAN &amp; IP addressing</h2>
<h3>Ethernet &amp; switches</h3>
<p><strong>Ethernet</strong> is how devices on a LAN talk. Each network card has a unique <strong>MAC address</strong> (physical, 48-bit). A <strong>switch</strong> learns which MAC is on which port and forwards frames only where needed (unlike an old hub that floods everywhere). A <strong>VLAN</strong> splits one physical switch into separate logical LANs.</p>
<h3>IPv4 addressing</h3>
<p>An <strong>IPv4</strong> address is 32 bits, written as four octets: <code>192.168.1.10</code>. A <strong>subnet mask</strong> (e.g. <code>255.255.255.0</code> = /24) splits it into a <strong>network part</strong> and a <strong>host part</strong>.</p>
<ul>
<li><strong>Private ranges</strong> (not routed on the Internet): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.</li>
<li><strong>Public</strong> addresses are globally unique; <strong>NAT</strong> maps many private hosts to one public IP.</li>
</ul>
<pre><code>192.168.1.10 /24
  network: 192.168.1.0
  hosts:   192.168.1.1 .. 192.168.1.254
  broadcast: 192.168.1.255
</code></pre>
<p><strong>IPv6</strong> (128-bit) exists because IPv4 addresses ran out — far more addresses, written in hex (2001:db8::1).</p>`,
    `<span class="eyebrow">NWC204 · Chương 2 · Bài 2.1</span>
<h2>Ethernet, LAN &amp; địa chỉ IP</h2>
<h3>Ethernet &amp; switch</h3>
<p><strong>Ethernet</strong> là cách các thiết bị trong LAN nói chuyện. Mỗi card mạng có một <strong>địa chỉ MAC</strong> duy nhất (vật lý, 48-bit). Một <strong>switch</strong> học MAC nào ở cổng nào và chỉ chuyển frame tới nơi cần (khác hub cũ phát tràn khắp nơi). Một <strong>VLAN</strong> chia một switch vật lý thành nhiều LAN logic riêng.</p>
<h3>Địa chỉ IPv4</h3>
<p>Một địa chỉ <strong>IPv4</strong> dài 32 bit, viết thành bốn octet: <code>192.168.1.10</code>. Một <strong>subnet mask</strong> (vd <code>255.255.255.0</code> = /24) chia nó thành <strong>phần mạng</strong> và <strong>phần host</strong>.</p>
<ul>
<li><strong>Dải riêng (private)</strong> (không định tuyến trên Internet): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.</li>
<li><strong>Công khai (public)</strong> là duy nhất toàn cầu; <strong>NAT</strong> ánh xạ nhiều host riêng sang một IP công khai.</li>
</ul>
<pre><code>192.168.1.10 /24
  mạng:      192.168.1.0
  host:      192.168.1.1 .. 192.168.1.254
  broadcast: 192.168.1.255
</code></pre>
<p><strong>IPv6</strong> (128-bit) ra đời vì IPv4 hết địa chỉ — nhiều địa chỉ hơn hẳn, viết dạng hex (2001:db8::1).</p>`,
  ]]);

const c2e = doc('nwc204-2-2-exercise', 'Exercise 1 — subnetting|||Bài tập 1 — chia subnet',
  'Bài tập: chia một mạng thành các subnet, tính network/host/broadcast; kèm lời giải từng bước.',
  [[
    `<span class="eyebrow">NWC204 · Chapter 2 · Exercise</span>
<h2>Exercise 1 — subnetting</h2>
<div class="callout"><span class="badge">Đề</span> You have 192.168.1.0/24 and need 4 equal subnets. Find the new mask, and list each subnet's network, first/last host, and broadcast.</div>
<h3>Worked solution</h3>
<pre><code>Need 4 subnets -> borrow 2 host bits (2^2 = 4).
New prefix: /24 + 2 = /26  (mask 255.255.255.192)
Block size = 256 - 192 = 64 addresses per subnet.

Subnet 1: 192.168.1.0/26   hosts .1-.62    broadcast .63
Subnet 2: 192.168.1.64/26  hosts .65-.126  broadcast .127
Subnet 3: 192.168.1.128/26 hosts .129-.190 broadcast .191
Subnet 4: 192.168.1.192/26 hosts .193-.254 broadcast .255
</code></pre>
<p><strong>Why:</strong> to make N subnets you <em>borrow</em> host bits (2^borrowed ≥ N). Each borrowed bit halves the block. Here /26 gives 64 addresses per block; the network address is the first, the broadcast is the last, and the usable hosts are everything in between. Subnetting is the single most-tested CCNA skill — practice until the block-size math is instant.</p>`,
    `<span class="eyebrow">NWC204 · Chương 2 · Bài tập</span>
<h2>Bài tập 1 — chia subnet</h2>
<div class="callout"><span class="badge">Đề</span> Bạn có 192.168.1.0/24 và cần 4 subnet bằng nhau. Tìm mask mới, và liệt kê network, host đầu/cuối, broadcast của mỗi subnet.</div>
<h3>Lời giải</h3>
<pre><code>Cần 4 subnet -> mượn 2 bit host (2^2 = 4).
Prefix mới: /24 + 2 = /26  (mask 255.255.255.192)
Kích thước khối = 256 - 192 = 64 địa chỉ mỗi subnet.

Subnet 1: 192.168.1.0/26   host .1-.62    broadcast .63
Subnet 2: 192.168.1.64/26  host .65-.126  broadcast .127
Subnet 3: 192.168.1.128/26 host .129-.190 broadcast .191
Subnet 4: 192.168.1.192/26 host .193-.254 broadcast .255
</code></pre>
<p><strong>Vì sao:</strong> để tạo N subnet bạn <em>mượn</em> bit host (2^(bit mượn) ≥ N). Mỗi bit mượn chia đôi khối. Ở đây /26 cho 64 địa chỉ mỗi khối; địa chỉ mạng là cái đầu, broadcast là cái cuối, host dùng được là ở giữa. Subnetting là kỹ năng CCNA hay thi nhất — luyện tới khi tính kích thước khối tức thì.</p>`,
  ]]);

const c2q = quiz('nwc204-quiz-2', 'Quiz 2 — Ethernet & IP|||Quiz 2 — Ethernet & IP', [
  { id: 'q1', question: 'Switch chuyển frame dựa trên?', options: ['Địa chỉ IP', 'Địa chỉ MAC (học cổng nào có MAC nào)', 'Tên miền', 'Số cổng TCP'], correctIndex: 1, explanation: 'Switch hoạt động tầng 2, chuyển theo MAC.' },
  { id: 'q2', question: 'Dải nào là IP RIÊNG (private)?', options: ['8.8.8.8', '192.168.0.0/16', '1.1.1.1', '203.0.113.5'], correctIndex: 1, explanation: 'Private: 10/8, 172.16/12, 192.168/16.' },
  { id: 'q3', question: '192.168.1.0/24 chia thành 4 subnet cần prefix?', options: ['/25', '/26', '/28', '/24'], correctIndex: 1, explanation: 'Mượn 2 bit (2^2=4) → /26, 64 địa chỉ/khối.' },
]);

const c3 = doc('nwc204-3-1-devices-security-troubleshoot', '3.1 — Routers/switches, security & troubleshooting|||3.1 — Router/switch, bảo mật & xử lý sự cố',
  'Cấu hình cơ bản router/switch (IOS CLI), định tuyến, bảo mật thiết bị (mật khẩu, SSH), lệnh kiểm tra (ping/traceroute/show) & xử lý sự cố theo tầng.',
  [[
    `<span class="eyebrow">NWC204 · Chapter 3 · Lesson 3.1</span>
<h2>Routers, switches, security &amp; troubleshooting</h2>
<h3>Routers vs switches</h3>
<p>A <strong>switch</strong> connects devices <em>within</em> a LAN (layer 2, MAC). A <strong>router</strong> connects <em>different</em> networks and forwards packets between them by IP (layer 3) — it's what gets you to the Internet.</p>
<h3>Basic device configuration (Cisco IOS)</h3>
<pre><code>Router&gt; enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# interface g0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config)# enable secret StrongPass      # protect privileged mode
R1(config)# line vty 0 4
R1(config-line)# transport input ssh      # SSH only, not Telnet
</code></pre>
<h3>Basic security</h3>
<ul>
<li>Set strong passwords (<code>enable secret</code>), use <strong>SSH not Telnet</strong> (Telnet is plaintext).</li>
<li>Shut down unused ports; apply port security on switches.</li>
</ul>
<h3>Troubleshoot layer by layer</h3>
<pre><code>ping 192.168.1.1        # is the host reachable? (layer 3)
traceroute 8.8.8.8      # where does the path break?
show ip interface brief # are interfaces up/up?
</code></pre>
<div class="callout"><span class="badge">Method</span> Work the OSI layers bottom-up: cable/link (L1/L2) → IP &amp; reachability (L3, ping) → the application. Most "internet is down" issues are a downed interface, a wrong IP/mask, or a missing route.</div>`,
    `<span class="eyebrow">NWC204 · Chương 3 · Bài 3.1</span>
<h2>Router/switch, bảo mật &amp; xử lý sự cố</h2>
<h3>Router vs switch</h3>
<p>Một <strong>switch</strong> nối các thiết bị <em>trong</em> một LAN (tầng 2, MAC). Một <strong>router</strong> nối các <em>mạng khác nhau</em> và chuyển gói giữa chúng theo IP (tầng 3) — nó là thứ đưa bạn ra Internet.</p>
<h3>Cấu hình thiết bị cơ bản (Cisco IOS)</h3>
<pre><code>Router&gt; enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# interface g0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config)# enable secret StrongPass      # bảo vệ chế độ đặc quyền
R1(config)# line vty 0 4
R1(config-line)# transport input ssh      # chỉ SSH, không Telnet
</code></pre>
<h3>Bảo mật cơ bản</h3>
<ul>
<li>Đặt mật khẩu mạnh (<code>enable secret</code>), dùng <strong>SSH không Telnet</strong> (Telnet gửi rõ).</li>
<li>Tắt cổng không dùng; áp port security trên switch.</li>
</ul>
<h3>Xử lý sự cố theo từng tầng</h3>
<pre><code>ping 192.168.1.1        # host có tới được không? (tầng 3)
traceroute 8.8.8.8      # đường đứt ở đâu?
show ip interface brief # các interface có up/up?
</code></pre>
<div class="callout"><span class="badge">Phương pháp</span> Đi theo tầng OSI từ dưới lên: cáp/link (L1/L2) → IP &amp; khả năng tới (L3, ping) → ứng dụng. Đa số sự cố "mất mạng" là interface tắt, sai IP/mask, hoặc thiếu route.</div>`,
  ]]);

const c3q = quiz('nwc204-quiz-3', 'Quiz 3 — Devices & troubleshooting|||Quiz 3 — Thiết bị & xử lý sự cố', [
  { id: 'q1', question: 'Thiết bị nối các MẠNG KHÁC NHAU và định tuyến theo IP?', options: ['Switch', 'Router', 'Hub', 'Repeater'], correctIndex: 1, explanation: 'Router hoạt động tầng 3, định tuyến giữa các mạng.' },
  { id: 'q2', question: 'Quản trị thiết bị từ xa NÊN dùng?', options: ['Telnet (gửi rõ)', 'SSH (mã hoá)', 'HTTP', 'Không đặt mật khẩu'], correctIndex: 1, explanation: 'SSH mã hoá; Telnet gửi mật khẩu dạng rõ.' },
  { id: 'q3', question: 'Kiểm host có tới được không dùng lệnh?', options: ['ping', 'hostname', 'no shutdown', 'enable secret'], correctIndex: 0, explanation: 'ping kiểm khả năng tới (tầng 3); traceroute xem đường đi.' },
]);

const taiLieu = doc('nwc204-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">NWC204 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning computer networking on a CCNA foundation: the official syllabus &amp; slides, books, free official courses, video channels, tools, and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official NWC204 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.ciscopress.com/store/ccna-200-301-official-cert-guide-library-9780135792735" target="_blank" rel="noopener">CCNA 200-301 Official Cert Guide</a> — Wendell Odom, Cisco Press: the standard exam companion.</li>
<li><a href="https://gaia.cs.umass.edu/kurose_ross/index.php" target="_blank" rel="noopener">Computer Networking: A Top-Down Approach</a> — Kurose &amp; Ross: the classic university text (free companion site).</li>
</ul>
<h3>🌐 Free official courses</h3>
<ul>
<li><a href="https://www.netacad.com/courses/networking" target="_blank" rel="noopener">Cisco Networking Academy</a> — free CCNA/Networking Basics courses.</li>
<li><a href="https://www.netacad.com/courses/packet-tracer" target="_blank" rel="noopener">Packet Tracer course</a> — free network simulator + guided labs.</li>
<li><a href="https://www.cisco.com/c/en/us/support/index.html" target="_blank" rel="noopener">Cisco docs &amp; support</a> — IOS configuration references.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@JeremysITLab" target="_blank" rel="noopener">Jeremy's IT Lab</a> — a full, free CCNA course.</li>
<li><a href="https://www.youtube.com/@PracticalNetworking" target="_blank" rel="noopener">Practical Networking</a> — clear fundamentals (how packets flow).</li>
<li><a href="https://www.youtube.com/@NetworkChuck" target="_blank" rel="noopener">NetworkChuck</a> — approachable networking &amp; CCNA topics.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.netacad.com/courses/packet-tracer" target="_blank" rel="noopener">Cisco Packet Tracer</a> — build &amp; configure virtual routers/switches.</li>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark</a> — capture &amp; inspect real packets.</li>
<li><a href="https://www.gns3.com/" target="_blank" rel="noopener">GNS3</a> — network emulation with real device images.</li>
<li><a href="https://www.putty.org/" target="_blank" rel="noopener">PuTTY</a> — SSH/console into devices.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — OSI/TCP-IP, protocols, IPv4 &amp; subnetting, following the lessons here.</li>
<li><strong>Practice in a lab</strong> — build topologies in Packet Tracer; configure IPs, a switch, and SSH.</li>
<li><strong>Go deeper</strong> — VLANs, routing, NAT, troubleshooting; capture traffic in Wireshark to see it live.</li>
<li><strong>Job-ready</strong> — drill subnetting to speed, and target the CCNA 200-301 exam.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">NWC204 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học mạng máy tính trên nền CCNA: giáo trình &amp; slide chính thức, sách, khoá học miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của NWC204.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.ciscopress.com/store/ccna-200-301-official-cert-guide-library-9780135792735" target="_blank" rel="noopener">CCNA 200-301 Official Cert Guide</a> — Wendell Odom, Cisco Press: sách luyện thi chuẩn.</li>
<li><a href="https://gaia.cs.umass.edu/kurose_ross/index.php" target="_blank" rel="noopener">Computer Networking: A Top-Down Approach</a> — Kurose &amp; Ross: giáo trình đại học kinh điển (trang phụ trợ miễn phí).</li>
</ul>
<h3>🌐 Khoá học chính thức miễn phí</h3>
<ul>
<li><a href="https://www.netacad.com/courses/networking" target="_blank" rel="noopener">Cisco Networking Academy</a> — khoá CCNA/Networking Basics miễn phí.</li>
<li><a href="https://www.netacad.com/courses/packet-tracer" target="_blank" rel="noopener">Khoá Packet Tracer</a> — trình mô phỏng mạng miễn phí + lab có hướng dẫn.</li>
<li><a href="https://www.cisco.com/c/en/us/support/index.html" target="_blank" rel="noopener">Tài liệu &amp; hỗ trợ Cisco</a> — tham chiếu cấu hình IOS.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@JeremysITLab" target="_blank" rel="noopener">Jeremy's IT Lab</a> — một khoá CCNA đầy đủ, miễn phí.</li>
<li><a href="https://www.youtube.com/@PracticalNetworking" target="_blank" rel="noopener">Practical Networking</a> — nền tảng rõ ràng (gói tin đi thế nào).</li>
<li><a href="https://www.youtube.com/@NetworkChuck" target="_blank" rel="noopener">NetworkChuck</a> — chủ đề mạng &amp; CCNA dễ tiếp cận.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.netacad.com/courses/packet-tracer" target="_blank" rel="noopener">Cisco Packet Tracer</a> — dựng &amp; cấu hình router/switch ảo.</li>
<li><a href="https://www.wireshark.org/" target="_blank" rel="noopener">Wireshark</a> — bắt &amp; soi gói tin thật.</li>
<li><a href="https://www.gns3.com/" target="_blank" rel="noopener">GNS3</a> — mô phỏng mạng với image thiết bị thật.</li>
<li><a href="https://www.putty.org/" target="_blank" rel="noopener">PuTTY</a> — SSH/console vào thiết bị.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — OSI/TCP-IP, giao thức, IPv4 &amp; subnetting, theo đúng các bài ở đây.</li>
<li><strong>Luyện trong lab</strong> — dựng topology trong Packet Tracer; cấu hình IP, một switch, và SSH.</li>
<li><strong>Đào sâu</strong> — VLAN, định tuyến, NAT, xử lý sự cố; bắt traffic bằng Wireshark để thấy tận mắt.</li>
<li><strong>Sẵn sàng đi làm</strong> — luyện subnetting cho nhanh, và hướng tới kỳ thi CCNA 200-301.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'NWC204',
    slug: 'nwc204-computer-networking',
    title: 'Computer Networking',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/NWC204.webp',
    shortDescription: 'Networking on a CCNA foundation — OSI/TCP-IP models, TCP/UDP & protocols, Ethernet/LAN/switching, IPv4 addressing & subnetting, router/switch config, security & troubleshooting. Bilingual, with CLI & exercises.|||Mạng nền CCNA — mô hình OSI/TCP-IP, TCP/UDP & giao thức, Ethernet/LAN/switch, địa chỉ IPv4 & subnetting, cấu hình router/switch, bảo mật & xử lý sự cố. Song ngữ, có CLI & bài tập.',
    description: 'Môn <strong>NWC204 — Computer Networking</strong> (kỳ 2), dựa trên môn CCNA đầu tiên. Từ <strong>mô hình &amp; giao thức</strong> (OSI/TCP-IP, đóng gói, TCP vs UDP, DNS/DHCP/HTTP, cổng) → <strong>Ethernet, LAN &amp; địa chỉ IP</strong> (MAC/switch/VLAN, IPv4, subnet mask, private/public/NAT, IPv6) → <strong>router/switch, bảo mật &amp; xử lý sự cố</strong> (cấu hình IOS, SSH, ping/traceroute/show, gỡ lỗi theo tầng). Bám giáo trình FLM, song ngữ, có ví dụ CLI, bài tập subnetting và quiz. Chuẩn bị cho bài thi thực hành kiểu CCNA.',
    whatYouLearn: 'Mô hình OSI/TCP-IP & phân tầng; đóng gói & PDU; TCP vs UDP, IP, DNS/DHCP/HTTP & số cổng; Ethernet, MAC, switch, VLAN; địa chỉ IPv4, subnet mask, private/public, NAT, IPv6 cơ bản; subnetting (mượn bit, kích thước khối, network/host/broadcast); cấu hình router/switch Cisco IOS; bảo mật thiết bị (enable secret, SSH); kiểm tra & xử lý sự cố theo tầng (ping/traceroute/show).',
    requirements: 'Kiến thức máy tính cơ bản. Nên thực hành trên Cisco Packet Tracer (miễn phí) để cấu hình router/switch.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mạng, OSI & TCP/IP.', lessons: [intro] },
    { title: 'Chương 1 — Mô hình & giao thức|||Chapter 1 — Models & protocols', description: 'OSI/TCP-IP, TCP/UDP, DNS/DHCP.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ethernet, LAN & IP|||Chapter 2 — Ethernet, LAN & IP', description: 'MAC/switch/VLAN, IPv4, subnetting.', lessons: [c2, c2e, c2q] },
    { title: 'Chương 3 — Thiết bị, bảo mật & xử lý sự cố|||Chapter 3 — Devices, security & troubleshooting', description: 'IOS config, SSH, ping/traceroute.', lessons: [c3, c3q] },
  ],
};
