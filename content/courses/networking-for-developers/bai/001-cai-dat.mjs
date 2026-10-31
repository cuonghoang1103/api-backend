/**
 * Mục 0 · 0.1 — Phòng lab mạng: công cụ và một máy chủ thử (slug khung netdev-0-1-cai-dat).
 * Output thật: lab/out/c00-lab.out.txt (máy client), c00-host.out.txt (máy của bạn, ngoài container).
 * Mã thật: lab/moi-truong/{compose.yml, api.js, nginx.conf, Dockerfile}.
 */
import { run, src, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-00-1.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '0.1 — Your networking lab: tools and a test server|||0.1 — Phòng lab mạng: công cụ và một máy chủ thử',
  slug: 'netdev-0-1-cai-dat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám công cụ và câu hỏi mỗi cái trả lời; dựng phòng lab Docker hai mạng ảo (client — router — nginx — API) bằng một lệnh; request và lần bắt gói đầu tiên; quyền NET_RAW/NET_ADMIN và luật bắt gói an toàn.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Your networking lab: tools and a test server</h2>
<p class="lead">You cannot learn networking by reading about it, any more than you can learn to swim from a book. You need a place where you can send packets, watch them, break things on purpose and fix them — without touching anyone else's network. This lesson builds that place in about ten minutes: a set of tools, and a small Docker lab that looks like a real deployment.</p>

<h3>Eight tools, eight questions</h3>
<p>Every tool in this course exists to answer one question. Learn the question first and the tool stops being intimidating:</p>
<table>
<thead><tr><th>Tool</th><th>The question it answers</th><th>Where we use it</th></tr></thead>
<tbody>
<tr><td><code>dig</code></td><td>What address does this <em>name</em> point to? Who answered?</td><td>0.2, Chapter 3</td></tr>
<tr><td><code>curl</code></td><td>Talk HTTP to a server — and time each stage of the request.</td><td>0.2, Chapters 7–10</td></tr>
<tr><td><code>ping</code>, <code>mtr</code></td><td>Is there a path to that machine? How long is one round trip? Where is it lost?</td><td>Chapters 2, 11</td></tr>
<tr><td><code>ip</code></td><td>What are my addresses, routes and neighbours?</td><td>0.1, Chapters 1–2</td></tr>
<tr><td><code>ss</code></td><td>Which sockets (open connections, listening ports) does this machine have?</td><td>Lesson 1.5</td></tr>
<tr><td><code>tcpdump</code>, <code>tshark</code></td><td>What packets actually crossed the wire?</td><td>0.1, every chapter</td></tr>
<tr><td>Wireshark</td><td>The same packets in a window you can click through, layer by layer.</td><td>Lesson 1.3</td></tr>
<tr><td><code>openssl</code>, <code>nc</code></td><td>Speak TLS by hand · open a raw TCP connection with no HTTP on top.</td><td>Chapter 7 · lesson 1.5</td></tr>
</tbody>
</table>

<h3>Installing them natively (optional)</h3>
<p>You will want these on your own machine later, for real networks:</p>
<ul>
<li><strong>macOS:</strong> <code>curl</code>, <code>dig</code>, <code>ping</code>, <code>nc</code> and <code>tcpdump</code> are already installed (<code>tcpdump</code> needs <code>sudo</code>). Add the rest with Homebrew: <code>brew install mtr wireshark</code>.</li>
<li><strong>Ubuntu / Debian:</strong> <code>sudo apt install -y bind9-dnsutils curl iproute2 iputils-ping mtr-tiny tcpdump tshark netcat-openbsd openssl</code>.</li>
<li><strong>Windows:</strong> install <strong>WSL2</strong> with Ubuntu and use the Linux command above inside it; install the Wireshark app for Windows from wireshark.org.</li>
</ul>
<p>But for this course, use the Docker lab below. Every output in every lesson was produced there, so your screen will match the lesson line by line — same addresses, same tool versions.</p>

<h3>The lab: a mini LabFlow on your laptop</h3>
<p>The lab is five small Linux containers on two virtual networks, shaped like a real web deployment (cuongthai.com and the LabFlow project are built the same way):</p>
<ul>
<li><strong>LAN</strong> <code>10.10.1.0/24</code>: <code>client</code> (10.10.1.10) and <code>client2</code> (10.10.1.11) — the "users".</li>
<li><strong>DMZ</strong> <code>10.10.2.0/24</code>: <code>web</code> — nginx on port 80 (10.10.2.10) — in front of <code>api</code>, a small Node server on port 3000 (10.10.2.20).</li>
<li><code>router</code> has one leg in each network (10.10.1.254 and 10.10.2.254) and passes packets between them.</li>
</ul>
<p>You need Docker (Docker Desktop on macOS/Windows, Docker Engine on Linux) and the lab folder of this course. Here is the whole Compose file — read the comments, they explain every choice:</p>
${src('../moi-truong/compose.yml', 'yaml')}
<p>Three details are worth understanding now, because the rest of the course leans on them:</p>
<ul>
<li><code>net.ipv4.ip_forward: "1"</code> on the router tells Linux "if a packet arrives on one network card for an address that is not mine, send it out of the other card". That one setting is what makes a Linux box a router.</li>
<li>Each client starts with <code>ip route add 10.10.2.0/24 via 10.10.1.254</code>: "to reach the server network, hand packets to the router". Without it the client would send them to Docker's own gateway, which is configured to isolate the two networks.</li>
<li>Every MAC address is fixed: <code>02:00:0a:0a:01:0a</code> is the "locally administered" prefix <code>02</code> followed by the IP 10.10.1.10 in hexadecimal (<code>0a 0a 01 0a</code>). Real network cards get a MAC from their manufacturer; here we chose readable ones so outputs are the same on every laptop.</li>
</ul>
<p>The API is about a dozen lines of Node. It answers with the connection details it sees, which will be very useful in lesson 1.5:</p>
${src('../moi-truong/api.js', 'javascript')}

<h3>Build it, check it, step inside</h3>
<p>From the <code>lab</code> folder: <code>docker build -t net-lab moi-truong</code> (once, a few minutes), then <code>docker compose -f moi-truong/compose.yml -p nfd up -d</code>. Check from your own machine:</p>
${run('c00-host', 'docker compose', 3)}
<p>Now step inside the client: <code>docker exec -it nfd-client bash</code>. From here on, every command runs "on" 10.10.1.10. Check the tools:</p>
${run('c00-lab', 'dig -v', 5)}
<p>And look at the machine's place in the network — its address and its routing rules:</p>
${run('c00-lab', 'ip -br addr', 2)}
<p>Read the routes from the bottom: packets for the server network go <em>via</em> the router; packets for the 10.10.1.x neighbours go directly out of <code>eth0</code>; anything else goes to the default gateway. Chapter 2 is all about this table.</p>

<h3>Your first request and your first capture</h3>
<p>Ask nginx for the home page and the API for <code>/api/hello</code>:</p>
${run('c00-lab', 'curl -s http://10.10.2.10/', 2)}
<p>The API says it saw the request coming from <code>10.10.2.10</code> (nginx, which made its own connection to the API) and that the original client was <code>10.10.1.10</code> (the <code>X-Forwarded-For</code> header nginx added). Two connections for one request — remember that for Chapter 10.</p>
<p>Now capture. We start <code>tcpdump</code> in the background writing to a file, make one request, stop the capture and read it:</p>
${run('c00-lab', 'curl -s -o /dev/null -w', 2)}
<p>One tiny page, ten packets. The first three (<code>[S]</code>, <code>[S.]</code>, <code>[.]</code>) open a TCP connection; then the request (<code>length 74: HTTP: GET /</code>), an acknowledgement, the answer (<code>length 168: HTTP/1.1 200 OK</code>) and another acknowledgement; the last three (<code>[F.]</code>…) close it. You do not need to understand the flags yet — Chapter 4 names every one. What matters today: <strong>you can see the packets</strong>.</p>
<p>To open a capture in the Wireshark app, copy the file out of the container: <code>docker cp nfd-client:/tmp/dau.pcap .</code> and double-click it. Lesson 1.3 walks through Wireshark's three panes.</p>

<h3>Where does the lab really run?</h3>
<p>On macOS and Windows, Docker Desktop runs a hidden Linux virtual machine. The containers, and the two virtual switches (Linux "bridges") that form <code>nfd-lan</code> and <code>nfd-dmz</code>, live inside that VM. So <code>sudo tcpdump</code> on your Mac sees nothing of the lab — you always capture <em>inside</em> a container. On a Linux laptop the bridges are part of your own kernel.</p>
<div class="pitfall co-tieu-de">
<p><strong>Capturing needs NET_RAW; changing the network needs NET_ADMIN — and neither needs <code>--privileged</code>.</strong> People hit "Operation not permitted" and reach for <code>--privileged</code>, which gives a container almost full control of the host. Look at what Docker actually allows:</p>
${run('c00-host', 'docker run --rm net-lab tcpdump', 3)}
<p>Capture works in a plain container (Docker grants NET_RAW by default); adding a route fails until you grant exactly NET_ADMIN. Give exactly the capability you need.</p>
</div>

<h3>Lab rules</h3>
<ul>
<li>Capture and scan only your own machine, your own containers, or cuongthai.com. Capturing on a school, office or café network can expose other people's data and is against most usage rules.</li>
<li>Every lab container carries the label <code>netlab=1</code>. Clean up with <code>docker compose -f moi-truong/compose.yml -p nfd down</code>.</li>
<li>When the lab looks broken in a way you do not understand, take it down and up again. A clean lab costs five seconds.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-3-3-lab-1-2-wireshark', so: '3.3', ten: 'Lab 1.2: install Wireshark', giong: 'installing and opening Wireshark for the first time', khac: 'NWC204 captures on your real network card with Cisco Packet Tracer alongside', them: 'a reproducible Docker lab with two networks and a router, captures inside containers, and the NET_RAW/NET_ADMIN permission model' })}

<h3>🧪 Practice (20–30 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team is about to share this lab for a project; you must prove it works on your laptop and hand them the capture.</p>
<ol>
<li>Build the image and start the lab. Show <code>docker compose … ps</code> with five containers up.</li>
<li>Inside <code>nfd-client2</code>, run <code>ip -br addr</code> and <code>ip route</code>. Write down its address and the route to 10.10.2.0/24.</li>
<li>From <code>nfd-client2</code>, run <code>curl -s http://10.10.2.10/api/hello</code>. What does <code>forwardedFor</code> say now, and why?</li>
<li>Capture one request from <code>client2</code> into <code>/tmp/my.pcap</code> (start tcpdump with <code>-w</code> in the background, sleep 2, curl, stop it), then <code>tcpdump -n -r /tmp/my.pcap</code>. Count the packets.</li>
<li>Copy the file out with <code>docker cp</code> and open it in Wireshark.</li>
</ol>
<p><strong>Done when:</strong> you have ten packets on screen, <code>forwardedFor</code> shows <code>10.10.1.11</code>, and Wireshark opens your file.</p>
<details><summary>Hints</summary>
<p>The capture recipe: <code>tcpdump -i eth0 -n -U -w /tmp/my.pcap 'tcp port 80' &amp;</code> then <code>sleep 2; curl -s -o /dev/null http://10.10.2.10/; sleep 1; kill -INT %1</code>. Without the <code>sleep 2</code>, tcpdump may not be listening yet when curl runs and you capture nothing — a real trap we hit while writing this lesson.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['container', 'An isolated process with its own network card, addresses and routes — a tiny Linux machine for the lab.'],
    ['bridge (cầu nối, switch ảo)', 'A virtual switch inside Linux; each Docker network is one bridge.'],
    ['router / ip_forward', 'A machine that passes packets between networks; on Linux, ip_forward=1 turns it on.'],
    ['route (tuyến)', 'A rule: "to reach these addresses, send via that machine / out of that card".'],
    ['default gateway (cổng mặc định)', 'Where packets go when no more specific route matches.'],
    ['packet capture / pcap', 'A recording of packets; .pcap files open in tcpdump, tshark and Wireshark.'],
    ['NET_RAW / NET_ADMIN', 'Linux capabilities: read/send raw packets / change network settings.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Learn each tool by its question: name (dig), HTTP timing (curl), path (ping/mtr), my addresses and routes (ip), sockets (ss), packets (tcpdump/Wireshark), TLS and raw TCP (openssl/nc).</li>
<li>The Docker lab is a mini LabFlow: client → router → nginx → API on two networks, with fixed, readable addresses.</li>
<li>A Linux box becomes a router with ip_forward=1; a client reaches another network through a route.</li>
<li>On macOS/Windows the lab lives in Docker's Linux VM — capture inside containers, with NET_RAW and NET_ADMIN, never --privileged.</li>
</ul>
${L('https://www.tcpdump.org/manpages/tcpdump.1.html', '📄', 'tcpdump manual', 'Every option used in this course (-n, -e, -w, -r, -U, -Q).', 'Open')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/', '🦈', 'Wireshark User’s Guide', 'Opening captures, filters, following a stream.', 'Open')}
${L('https://docs.docker.com/engine/network/', '🐳', 'Docker — Networking overview', 'Bridge networks and how containers get their addresses.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Phòng lab mạng: công cụ và một máy chủ thử</h2>
<p class="lead">Không ai học được mạng chỉ bằng đọc, cũng như không ai học bơi qua sách. Bạn cần một chỗ để gửi gói tin, nhìn chúng, cố ý làm hỏng rồi sửa — mà không đụng vào mạng của ai khác. Bài này dựng chỗ đó trong khoảng mười phút: một bộ công cụ, và một phòng lab Docker nhỏ trông giống một hệ thống triển khai thật.</p>

<h3>Tám công cụ, tám câu hỏi</h3>
<p>Mỗi công cụ trong khoá sinh ra để trả lời một câu hỏi. Biết câu hỏi trước thì công cụ thôi đáng sợ:</p>
<table>
<thead><tr><th>Công cụ</th><th>Câu hỏi nó trả lời</th><th>Dùng ở đâu</th></tr></thead>
<tbody>
<tr><td><code>dig</code></td><td>Cái <em>tên</em> này trỏ tới địa chỉ nào? Ai đã trả lời?</td><td>0.2, Chương 3</td></tr>
<tr><td><code>curl</code></td><td>Nói HTTP với máy chủ — và bấm giờ từng chặng của request.</td><td>0.2, Chương 7–10</td></tr>
<tr><td><code>ping</code>, <code>mtr</code></td><td>Có đường tới máy đó không? Một vòng đi-về mất bao lâu? Mất ở đâu?</td><td>Chương 2, 11</td></tr>
<tr><td><code>ip</code></td><td>Địa chỉ, tuyến và hàng xóm của máy tôi là gì?</td><td>0.1, Chương 1–2</td></tr>
<tr><td><code>ss</code></td><td>Máy này đang có những socket nào (kết nối đang mở, cổng đang nghe)?</td><td>Bài 1.5</td></tr>
<tr><td><code>tcpdump</code>, <code>tshark</code></td><td>Thật sự những gói nào đã đi qua dây?</td><td>0.1, mọi chương</td></tr>
<tr><td>Wireshark</td><td>Chính các gói đó trong một cửa sổ bấm được, từng tầng một.</td><td>Bài 1.3</td></tr>
<tr><td><code>openssl</code>, <code>nc</code></td><td>Tự nói TLS bằng tay · mở một kết nối TCP trần, không có HTTP ở trên.</td><td>Chương 7 · bài 1.5</td></tr>
</tbody>
</table>

<h3>Cài trực tiếp lên máy (tuỳ chọn)</h3>
<p>Về sau bạn sẽ muốn có chúng trên máy mình để dùng với mạng thật:</p>
<ul>
<li><strong>macOS:</strong> <code>curl</code>, <code>dig</code>, <code>ping</code>, <code>nc</code> và <code>tcpdump</code> có sẵn (<code>tcpdump</code> cần <code>sudo</code>). Cài thêm phần còn lại bằng Homebrew: <code>brew install mtr wireshark</code>.</li>
<li><strong>Ubuntu / Debian:</strong> <code>sudo apt install -y bind9-dnsutils curl iproute2 iputils-ping mtr-tiny tcpdump tshark netcat-openbsd openssl</code>.</li>
<li><strong>Windows:</strong> cài <strong>WSL2</strong> với Ubuntu rồi chạy lệnh Linux ở trên bên trong nó; cài ứng dụng Wireshark cho Windows từ wireshark.org.</li>
</ul>
<p>Nhưng với khoá này, hãy dùng phòng lab Docker bên dưới. Mọi output trong mọi bài đều sinh ra ở đó, nên màn hình của bạn khớp bài học từng dòng — cùng địa chỉ, cùng phiên bản công cụ.</p>

<h3>Phòng lab: một LabFlow thu nhỏ trên laptop của bạn</h3>
<p>Phòng lab là năm container Linux nhỏ trên hai mạng ảo, có hình dạng của một hệ thống web thật (cuongthai.com và dự án LabFlow được dựng đúng kiểu này):</p>
<ul>
<li><strong>LAN</strong> <code>10.10.1.0/24</code>: <code>client</code> (10.10.1.10) và <code>client2</code> (10.10.1.11) — "người dùng".</li>
<li><strong>DMZ</strong> <code>10.10.2.0/24</code>: <code>web</code> — nginx ở cổng 80 (10.10.2.10) — đứng trước <code>api</code>, một máy chủ Node nhỏ ở cổng 3000 (10.10.2.20).</li>
<li><code>router</code> đặt một chân ở mỗi mạng (10.10.1.254 và 10.10.2.254) và chuyển gói giữa hai bên.</li>
</ul>
<p>Bạn cần Docker (Docker Desktop trên macOS/Windows, Docker Engine trên Linux) và thư mục lab của khoá. Đây là toàn bộ file Compose — đọc phần chú thích, chúng giải thích từng lựa chọn:</p>
${src('../moi-truong/compose.yml', 'yaml')}
<p>Có ba chi tiết đáng hiểu ngay bây giờ, vì cả khoá dựa vào chúng:</p>
<ul>
<li><code>net.ipv4.ip_forward: "1"</code> trên router bảo Linux "gói tới từ card mạng này mà địa chỉ đích không phải của tôi thì đẩy ra card mạng kia". Chỉ một thiết lập đó là biến một máy Linux thành router.</li>
<li>Mỗi máy khách khởi động bằng <code>ip route add 10.10.2.0/24 via 10.10.1.254</code>: "muốn tới mạng máy chủ thì đưa gói cho router". Thiếu nó, máy khách sẽ gửi gói tới cổng riêng của Docker, nơi được cấu hình để cô lập hai mạng với nhau.</li>
<li>MAC nào cũng cố định: <code>02:00:0a:0a:01:0a</code> là tiền tố "tự quản" <code>02</code> theo sau là IP 10.10.1.10 viết bằng hệ mười sáu (<code>0a 0a 01 0a</code>). Card mạng thật nhận MAC từ nhà sản xuất; ở đây ta chọn MAC dễ đọc để output giống nhau trên mọi laptop.</li>
</ul>
<p>API chỉ khoảng một chục dòng Node. Nó trả lời bằng chính thông tin kết nối mà nó thấy — sẽ rất hữu ích ở bài 1.5:</p>
${src('../moi-truong/api.js', 'javascript')}

<h3>Dựng, kiểm tra, bước vào</h3>
<p>Trong thư mục <code>lab</code>: <code>docker build -t net-lab moi-truong</code> (một lần, vài phút), rồi <code>docker compose -f moi-truong/compose.yml -p nfd up -d</code>. Kiểm tra từ máy của bạn:</p>
${run('c00-host', 'docker compose', 3)}
<p>Giờ bước vào máy khách: <code>docker exec -it nfd-client bash</code>. Từ đây, mọi lệnh chạy "trên" 10.10.1.10. Kiểm tra công cụ:</p>
${run('c00-lab', 'dig -v', 5)}
<p>Và xem vị trí của máy trong mạng — địa chỉ và các luật định tuyến:</p>
${run('c00-lab', 'ip -br addr', 2)}
<p>Đọc bảng tuyến từ dưới lên: gói tới mạng máy chủ đi <em>qua</em> router; gói tới hàng xóm 10.10.1.x đi thẳng ra <code>eth0</code>; còn lại đi tới cổng mặc định. Cả Chương 2 nói về bảng này.</p>

<h3>Request đầu tiên và lần bắt gói đầu tiên</h3>
<p>Xin nginx trang chủ và xin API đường dẫn <code>/api/hello</code>:</p>
${run('c00-lab', 'curl -s http://10.10.2.10/', 2)}
<p>API nói nó thấy request tới từ <code>10.10.2.10</code> (chính nginx, vì nginx tự mở một kết nối riêng tới API) và máy khách gốc là <code>10.10.1.10</code> (header <code>X-Forwarded-For</code> do nginx gắn thêm). Một request mà hai kết nối — nhớ điều này cho Chương 10.</p>
<p>Giờ bắt gói. Ta chạy <code>tcpdump</code> ngầm, ghi ra file, gửi một request, dừng bắt rồi đọc lại:</p>
${run('c00-lab', 'curl -s -o /dev/null -w', 2)}
<p>Một trang tí xíu, mười gói. Ba gói đầu (<code>[S]</code>, <code>[S.]</code>, <code>[.]</code>) mở kết nối TCP; rồi tới request (<code>length 74: HTTP: GET /</code>), một gói xác nhận, câu trả lời (<code>length 168: HTTP/1.1 200 OK</code>) và một xác nhận nữa; ba gói cuối (<code>[F.]</code>…) đóng kết nối. Chưa cần hiểu các cờ — Chương 4 gọi tên từng cái. Điều quan trọng hôm nay: <strong>bạn nhìn thấy được gói tin</strong>.</p>
<p>Muốn mở bản bắt trong ứng dụng Wireshark, chép file ra khỏi container: <code>docker cp nfd-client:/tmp/dau.pcap .</code> rồi bấm đúp. Bài 1.3 đi qua ba khung của Wireshark.</p>

<h3>Phòng lab thật ra chạy ở đâu?</h3>
<p>Trên macOS và Windows, Docker Desktop chạy một máy ảo Linux ẩn. Các container, và hai switch ảo (các "bridge" của Linux) tạo nên <code>nfd-lan</code> và <code>nfd-dmz</code>, sống bên trong máy ảo đó. Vì vậy <code>sudo tcpdump</code> trên máy Mac không thấy gì của lab — bạn luôn bắt gói <em>bên trong</em> một container. Trên laptop Linux, các bridge là một phần của chính nhân máy bạn.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bắt gói cần NET_RAW; sửa mạng cần NET_ADMIN — và không cái nào cần <code>--privileged</code>.</strong> Gặp "Operation not permitted", nhiều người với ngay tới <code>--privileged</code>, thứ trao cho container gần như toàn quyền trên máy chủ. Hãy xem Docker thật sự cho phép gì:</p>
${run('c00-host', 'docker run --rm net-lab tcpdump', 3)}
<p>Bắt gói chạy được trong container thường (Docker cấp sẵn NET_RAW); thêm tuyến thì lỗi cho tới khi cấp đúng NET_ADMIN. Cần quyền nào cấp đúng quyền đó.</p>
</div>

<h3>Luật của phòng lab</h3>
<ul>
<li>Chỉ bắt gói và quét trên máy mình, container của mình, hoặc cuongthai.com. Bắt gói trên mạng trường, văn phòng hay quán cà phê có thể lộ dữ liệu của người khác và vi phạm quy định sử dụng của hầu hết các nơi.</li>
<li>Mọi container lab mang nhãn <code>netlab=1</code>. Dọn bằng <code>docker compose -f moi-truong/compose.yml -p nfd down</code>.</li>
<li>Khi lab hỏng theo kiểu bạn chưa hiểu, dỡ đi rồi dựng lại. Một phòng lab sạch chỉ tốn năm giây.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-3-3-lab-1-2-wireshark', so: '3.3', ten: 'Lab 1.2: cài Wireshark', giong: 'cài và mở Wireshark lần đầu', khac: 'NWC204 bắt gói trên card mạng thật của máy, kèm Cisco Packet Tracer', them: 'một phòng lab Docker dựng lại được với hai mạng và một router, bắt gói bên trong container, và mô hình quyền NET_RAW/NET_ADMIN' })}

<h3>🧪 Thực hành (20–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> nhóm bạn sắp dùng chung phòng lab này cho đồ án; bạn phải chứng minh nó chạy trên laptop mình và gửi cả nhóm bản bắt gói.</p>
<ol>
<li>Dựng ảnh và khởi động lab. Cho thấy <code>docker compose … ps</code> có năm container đang chạy.</li>
<li>Trong <code>nfd-client2</code>, chạy <code>ip -br addr</code> và <code>ip route</code>. Ghi lại địa chỉ và tuyến tới 10.10.2.0/24.</li>
<li>Từ <code>nfd-client2</code>, chạy <code>curl -s http://10.10.2.10/api/hello</code>. Giờ <code>forwardedFor</code> ghi gì, và vì sao?</li>
<li>Bắt một request từ <code>client2</code> vào <code>/tmp/my.pcap</code> (chạy tcpdump với <code>-w</code> ở chế độ ngầm, chờ 2 giây, curl, dừng nó), rồi <code>tcpdump -n -r /tmp/my.pcap</code>. Đếm số gói.</li>
<li>Chép file ra bằng <code>docker cp</code> và mở trong Wireshark.</li>
</ol>
<p><strong>Đạt khi:</strong> màn hình có mười gói, <code>forwardedFor</code> hiện <code>10.10.1.11</code>, và Wireshark mở được file của bạn.</p>
<details><summary>Gợi ý</summary>
<p>Công thức bắt gói: <code>tcpdump -i eth0 -n -U -w /tmp/my.pcap 'tcp port 80' &amp;</code> rồi <code>sleep 2; curl -s -o /dev/null http://10.10.2.10/; sleep 1; kill -INT %1</code>. Thiếu <code>sleep 2</code>, tcpdump có thể chưa kịp lắng nghe khi curl chạy và bạn chẳng bắt được gì — một cái bẫy có thật mà chính mình vấp khi soạn bài này.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['container', 'Một tiến trình được cô lập, có card mạng, địa chỉ và tuyến riêng — một máy Linux tí hon cho phòng lab.'],
    ['bridge (cầu nối, switch ảo)', 'Switch ảo bên trong Linux; mỗi mạng Docker là một bridge.'],
    ['router / ip_forward', 'Máy chuyển gói giữa các mạng; trên Linux, ip_forward=1 bật chức năng đó.'],
    ['route (tuyến)', 'Một luật: "muốn tới dải địa chỉ này thì gửi qua máy kia / ra card kia".'],
    ['default gateway (cổng mặc định)', 'Nơi gói được gửi tới khi không có tuyến nào cụ thể hơn khớp.'],
    ['packet capture / pcap (bản bắt gói)', 'Bản ghi các gói tin; file .pcap mở được bằng tcpdump, tshark và Wireshark.'],
    ['NET_RAW / NET_ADMIN', 'Quyền của Linux: đọc/gửi gói thô / thay đổi thiết lập mạng.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Học công cụ qua câu hỏi của nó: tên (dig), bấm giờ HTTP (curl), đường đi (ping/mtr), địa chỉ và tuyến (ip), socket (ss), gói tin (tcpdump/Wireshark), TLS và TCP trần (openssl/nc).</li>
<li>Phòng lab Docker là một LabFlow thu nhỏ: client → router → nginx → API trên hai mạng, địa chỉ cố định dễ đọc.</li>
<li>Máy Linux thành router nhờ ip_forward=1; máy khách tới mạng khác nhờ một tuyến.</li>
<li>Trên macOS/Windows phòng lab nằm trong máy ảo Linux của Docker — bắt gói bên trong container, bằng NET_RAW và NET_ADMIN, không bao giờ --privileged.</li>
</ul>
${L('https://www.tcpdump.org/manpages/tcpdump.1.html', '📄', 'Hướng dẫn tcpdump', 'Mọi tuỳ chọn dùng trong khoá (-n, -e, -w, -r, -U, -Q).', 'Mở')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/', '🦈', 'Hướng dẫn sử dụng Wireshark', 'Mở bản bắt, bộ lọc, theo dõi một luồng.', 'Mở')}
${L('https://docs.docker.com/engine/network/', '🐳', 'Docker — Tổng quan mạng', 'Mạng bridge và cách container nhận địa chỉ.', 'Mở')}
</div>
`,
};
