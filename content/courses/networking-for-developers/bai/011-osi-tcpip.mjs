/**
 * Chương 1 · 1.2 — OSI và TCP/IP: mô hình người ta thật sự dùng (slug khung netdev-1-1-osi-tcpip; số hiển thị 1.2 vì bài
 * 1.1 bit/byte được chèn trước). Output thật: lab/out/c11-tang.out.txt.
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-01-2.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '1.2 — OSI vs TCP/IP: the model that is actually used|||1.2 — OSI và TCP/IP: mô hình người ta thật sự dùng',
  slug: 'netdev-1-1-osi-tcpip',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao mạng chia tầng; 7 tầng OSI cạnh 4 tầng TCP/IP; L2/L3/L4/L7 nghĩa là gì; mỗi tầng chạy ở đâu trong máy và code của bạn điều khiển được gì; thấy các tầng trong curl -v, ip route get và tshark.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>OSI vs TCP/IP: the model that is actually used</h2>
<p class="lead">"Name the seven OSI layers" is a classic exam question — and almost useless at work. What engineers actually use is the <em>idea</em> of layers (each solves one problem and reads only its own header) and the <em>vocabulary</em> (L2, L3, L4, L7). This lesson gives you both, and proves every layer on a real request in the lab.</p>

<h3>Why layers? Four small problems instead of one huge one</h3>
<p>Getting <code>GET /api/hello</code> from curl to a Node process on another network involves very different questions. Layering gives each question to one protocol:</p>
<ul>
<li><strong>Application</strong> — <em>what do we say?</em> HTTP: a method, a path, headers, a body. Your code lives here.</li>
<li><strong>Transport</strong> — <em>which program, and did everything arrive?</em> TCP: port numbers to pick the program, sequence numbers and retransmission so bytes arrive complete and in order.</li>
<li><strong>Internet</strong> — <em>which machine, by which path?</em> IP: addresses that are valid across the world, routers that forward packets hop by hop.</li>
<li><strong>Link</strong> — <em>which device on this cable or Wi-Fi?</em> Ethernet or Wi-Fi: MAC addresses, frames, the next hop only.</li>
</ul>
<p>The rule that makes it work: <strong>each layer reads only its own header and talks only to the layer directly above and below</strong>. HTTP has no idea what a MAC address is; Ethernet has no idea what HTTP is. That is why you can move your laptop from Wi-Fi to a cable, or from IPv4 to IPv6, and your Node code does not change by a single line.</p>

<h3>OSI's seven layers vs TCP/IP's four</h3>
<table>
<thead><tr><th>OSI (reference model, 1984)</th><th>TCP/IP (what systems run)</th><th>Example protocols</th><th>Where it runs</th></tr></thead>
<tbody>
<tr><td>7 Application · 6 Presentation · 5 Session</td><td>Application</td><td>HTTP, DNS, SSH; TLS sits here too</td><td>your process (user space)</td></tr>
<tr><td>4 Transport</td><td>Transport</td><td>TCP, UDP (QUIC on top of UDP)</td><td>the kernel</td></tr>
<tr><td>3 Network</td><td>Internet</td><td>IPv4, IPv6, ICMP</td><td>the kernel</td></tr>
<tr><td>2 Data link · 1 Physical</td><td>Link</td><td>Ethernet, Wi-Fi, ARP</td><td>driver + network chip + cable/radio</td></tr>
</tbody>
</table>
<p>Linux, Windows, macOS and every router implement the four TCP/IP layers. OSI is kept for its <strong>vocabulary</strong>, which you will hear every week:</p>
<ul>
<li><strong>L2 switch</strong> — forwards frames by MAC address (the Docker bridge in our lab).</li>
<li><strong>L3</strong> — forwards packets by IP address (our router container; your home Wi-Fi box).</li>
<li><strong>L4 load balancer</strong> — splits TCP/UDP connections by address and port, cannot read HTTP (AWS Network Load Balancer, HAProxy in TCP mode).</li>
<li><strong>L7 proxy / firewall</strong> — reads HTTP: paths, headers, cookies (nginx, Cloudflare, AWS Application Load Balancer).</li>
</ul>
<p>Watch the four headers being added on the way down and removed on the way up:</p>
${net('encap', 'http', 'en', 'One real request, layer by layer — the bytes each layer adds, and where in the computer it happens.', { tour: 'encap-layers' })}

<h3>Seeing the layers in a real request</h3>
<p><strong>Application and transport — curl -v.</strong> In the lab client:</p>
${run('c11-tang', 'curl -sv', 1)}
<p>Classify each line. <code>Trying 10.10.2.10:80</code> and <code>Established connection … from 10.10.1.10 port …</code> are the <strong>transport</strong> layer: a TCP connection between two ports — the server's well-known port 80 and a temporary port the kernel picked for the client. Every line starting with <code>&gt;</code> or <code>&lt;</code> is the <strong>application</strong> layer: the HTTP text curl sent and received.</p>
<p><strong>Internet — the routing decision.</strong> curl never decided how to reach 10.10.2.10. Ask the kernel:</p>
${run('c11-tang', 'ip route get', 1)}
<p>The internet layer chose: go <em>via</em> the router 10.10.1.254, out of <code>eth0</code>, using 10.10.1.10 as the source address.</p>
<p><strong>All four — tshark.</strong> Capture the same request and let tshark decode it. The list of packets first, then the layers of the request packet:</p>
${run('c11-tang', 'tshark -r /tmp/t.pcap 2', 1)}
${run('c11-tang', 'tshark -r /tmp/t.pcap -Y', 1)}
<p>One packet, four nested headers: <strong>Ethernet</strong> from the client's card to the <em>router's</em> card (not to the web server — the next hop only), <strong>IPv4</strong> from 10.10.1.10 to 10.10.2.10 (the whole journey), <strong>TCP</strong> from the client's temporary port to port 80 with 83 bytes of data, and <strong>HTTP</strong>. The frame is 149 bytes in total; lesson 1.3 finds every header in those bytes.</p>

<h3>Where each layer runs, and what your code controls</h3>
<ul>
<li><strong>Application</strong> — inside your process. You decide everything: protocol, headers, body, retries, timeouts.</li>
<li><strong>Transport</strong> — in the kernel. You choose TCP or UDP, the port, and a few socket options (connect/read timeouts, keep-alive, <code>TCP_NODELAY</code>). The kernel does sequence numbers, retransmission and flow control.</li>
<li><strong>Internet</strong> — in the kernel. The routing table decides; your code almost never touches it.</li>
<li><strong>Link</strong> — the driver and the network chip. Nothing for your code to do.</li>
</ul>
<p>This is why most networking bugs a developer fixes are at the application layer (timeouts, keep-alive, the wrong address) or in configuration (ports, DNS, certificates) — not in the kernel.</p>

<h3>Each device reads only up to its own layer</h3>
<p>A switch reads the Ethernet header and forwards. A router reads up to the IP header — it never sees your URL. An L4 load balancer sees addresses and ports but not paths. Only an L7 proxy such as nginx, and your API itself, read HTTP. Practical consequence: "send <code>/api</code> to one server and <code>/</code> to another" can only be done by an L7 proxy, which is exactly what our nginx does with its <code>location /api/</code> block.</p>
<div class="pitfall co-tieu-de">
<p><strong>Treating the OSI model as a law of nature.</strong> Students memorise "Please Do Not Throw Sausage Pizza Away" and then argue whether TLS is layer 5 or 6. Real protocols do not fit neatly: TLS sits between TCP and HTTP; QUIC does transport work (retransmission, ordering) in user space over UDP; ARP lives between layers 2 and 3. Use layers to ask <em>which header does this box read?</em> and <em>which stage failed?</em> — not as trivia.</p>
</div>

<h3>Layers as a debugging checklist</h3>
<table>
<thead><tr><th>Symptom</th><th>Layer to check first</th><th>Tool</th></tr></thead>
<tbody>
<tr><td><code>Could not resolve host</code></td><td>application (DNS)</td><td><code>dig</code></td></tr>
<tr><td>timed out, "no route to host"</td><td>internet</td><td><code>ip route</code>, <code>ping</code>, <code>mtr</code></td></tr>
<tr><td><code>Connection refused</code></td><td>transport</td><td><code>ss -tlnp</code> on the server</td></tr>
<tr><td>certificate error</td><td>TLS (between transport and HTTP)</td><td><code>openssl s_client</code></td></tr>
<tr><td>404, 500, 502</td><td>application</td><td><code>curl -v</code>, application and proxy logs</td></tr>
</tbody>
</table>
${cauNoi('en', { ...NWC, bai: 'nwc204-3-2-mo-hinh-tham-chieu-va-dong-goi', so: '3.2', ten: 'Reference models, encapsulation and data access', giong: 'the OSI and TCP/IP models and how they map to each other', khac: 'NWC204 teaches the models in Cisco terms for the exam (PDU names, layer functions)', them: 'where each layer runs in a real computer, what your code controls, the L2/L4/L7 vocabulary of load balancers and proxies, and each layer seen in curl -v, ip route get and tshark' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team has nginx in front of an API, and an L4 load balancer in front of nginx. You need to explain to a teammate which box can do what.</p>
<ol>
<li>In the lab client, run <code>curl -sv http://10.10.2.10/ 2&gt;&amp;1</code> and label every line L4 or L7.</li>
<li>Run <code>ip route get 10.10.2.20</code> and <code>ip route get 10.10.1.11</code>. Which one goes via the router, and why?</li>
<li>Capture one request (recipe from lesson 0.1) and run <code>tshark -r FILE -Y http.request -V 2&gt;/dev/null | grep -E '^[A-Z]'</code>. Write next to each line its TCP/IP layer and its OSI number.</li>
<li>Answer: can the L4 load balancer send <code>/admin</code> to a different server? Can nginx? Can a router?</li>
</ol>
<p><strong>Done when:</strong> every curl line is labelled, you explain the two routes, the four tshark lines carry layer names, and your answer to step 4 is "no, yes, no" with a reason for each.</p>
<details><summary>Solution</summary>
<p>Trying/Established/Connection-left-intact lines are L4; <code>&gt;</code>/<code>&lt;</code> lines are L7. 10.10.2.20 is on another network ⇒ "via 10.10.1.254"; 10.10.1.11 is on the client's own /24 ⇒ directly "dev eth0". tshark: Ethernet II = link (L2), Internet Protocol = internet (L3), TCP = transport (L4), HTTP = application (L7). Only nginx reads paths (L7): the L4 balancer sees only addresses and ports, the router only IP.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['layer (tầng)', 'One part of the job, with its own header; reads only that header.'],
    ['protocol stack (chồng giao thức)', 'The layers stacked together: HTTP over TCP over IP over Ethernet.'],
    ['OSI model', 'A 7-layer reference model from 1984; source of the L1–L7 vocabulary.'],
    ['TCP/IP model', 'The 4 layers real systems implement: application, transport, internet, link.'],
    ['L4 / L7', 'Transport (connections, ports) / application (HTTP paths, headers).'],
    ['user space vs kernel', 'Your program’s world vs the operating system core that runs TCP and IP.'],
    ['next hop (chặng kế)', 'The next device a frame is sent to — often the router, not the final server.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Layers split networking into four small problems; each layer reads only its own header.</li>
<li>Real systems run TCP/IP's four layers; OSI's seven give the vocabulary L2, L3, L4, L7.</li>
<li>Your process owns the application layer; the kernel runs transport and internet; the driver and chip run the link.</li>
<li>curl -v shows L4 and L7, ip route get shows the L3 decision, tshark -V shows all four nested headers.</li>
<li>A box can only act on what it reads: routing by URL path needs an L7 proxy.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc1122', '📄', 'RFC 1122 — Requirements for Internet Hosts', 'The four TCP/IP layers as the Internet standards define them (section 1.1.3).', 'Open')}
${L('https://hpbn.co/', '📗', 'High Performance Browser Networking', 'Layers from the point of view of performance.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>OSI và TCP/IP: mô hình người ta thật sự dùng</h2>
<p class="lead">"Kể tên bảy tầng OSI" là câu hỏi thi kinh điển — và gần như vô dụng khi đi làm. Thứ kỹ sư thật sự dùng là <em>ý tưởng</em> chia tầng (mỗi tầng giải một bài toán và chỉ đọc header của nó) và <em>từ vựng</em> (L2, L3, L4, L7). Bài này cho bạn cả hai, và chứng minh từng tầng trên một request thật trong lab.</p>

<h3>Vì sao chia tầng? Bốn bài toán nhỏ thay vì một bài khổng lồ</h3>
<p>Đưa <code>GET /api/hello</code> từ curl tới một tiến trình Node ở mạng khác gồm những câu hỏi rất khác nhau. Chia tầng giao mỗi câu cho một giao thức:</p>
<ul>
<li><strong>Ứng dụng (application)</strong> — <em>nói gì?</em> HTTP: một phương thức, một đường dẫn, header, phần thân. Code của bạn sống ở đây.</li>
<li><strong>Giao vận (transport)</strong> — <em>chương trình nào nhận, và đã tới đủ chưa?</em> TCP: số cổng để chọn chương trình, số thứ tự và gửi lại để byte tới đủ và đúng thứ tự.</li>
<li><strong>Internet</strong> — <em>máy nào, đi đường nào?</em> IP: địa chỉ có giá trị trên toàn thế giới, router chuyển gói từng chặng.</li>
<li><strong>Liên kết (link)</strong> — <em>thiết bị nào trên dây cáp hay Wi-Fi này?</em> Ethernet hoặc Wi-Fi: địa chỉ MAC, frame, chỉ chặng kế tiếp.</li>
</ul>
<p>Luật làm cho nó chạy được: <strong>mỗi tầng chỉ đọc header của chính nó và chỉ nói chuyện với tầng ngay trên và ngay dưới</strong>. HTTP chẳng biết địa chỉ MAC là gì; Ethernet chẳng biết HTTP là gì. Nhờ thế bạn chuyển laptop từ Wi-Fi sang dây cáp, hay từ IPv4 sang IPv6, mà code Node không đổi một dòng.</p>

<h3>Bảy tầng OSI và bốn tầng TCP/IP</h3>
<table>
<thead><tr><th>OSI (mô hình tham chiếu, 1984)</th><th>TCP/IP (thứ hệ thống chạy)</th><th>Giao thức ví dụ</th><th>Chạy ở đâu</th></tr></thead>
<tbody>
<tr><td>7 Ứng dụng · 6 Trình diễn · 5 Phiên</td><td>Ứng dụng</td><td>HTTP, DNS, SSH; TLS cũng nằm ở đây</td><td>tiến trình của bạn (user space)</td></tr>
<tr><td>4 Giao vận</td><td>Giao vận</td><td>TCP, UDP (QUIC chạy trên UDP)</td><td>nhân hệ điều hành</td></tr>
<tr><td>3 Mạng</td><td>Internet</td><td>IPv4, IPv6, ICMP</td><td>nhân hệ điều hành</td></tr>
<tr><td>2 Liên kết dữ liệu · 1 Vật lý</td><td>Liên kết</td><td>Ethernet, Wi-Fi, ARP</td><td>driver + chip mạng + dây cáp/sóng</td></tr>
</tbody>
</table>
<p>Linux, Windows, macOS và mọi router cài đặt bốn tầng TCP/IP. OSI được giữ lại vì <strong>từ vựng</strong> của nó, thứ bạn sẽ nghe mỗi tuần:</p>
<ul>
<li><strong>Switch L2</strong> — chuyển frame theo địa chỉ MAC (bridge Docker trong lab).</li>
<li><strong>L3</strong> — chuyển gói theo địa chỉ IP (container router; cục Wi-Fi ở nhà bạn).</li>
<li><strong>Bộ cân bằng tải L4</strong> — chia kết nối TCP/UDP theo địa chỉ và cổng, không đọc được HTTP (AWS Network Load Balancer, HAProxy chế độ TCP).</li>
<li><strong>Proxy / tường lửa L7</strong> — đọc HTTP: đường dẫn, header, cookie (nginx, Cloudflare, AWS Application Load Balancer).</li>
</ul>
<p>Xem bốn header được thêm vào trên đường đi xuống và gỡ ra trên đường đi lên:</p>
${net('encap', 'http', 'vi', 'Một request thật, từng tầng một — mỗi tầng thêm bao nhiêu byte, và việc đó diễn ra ở đâu trong máy.', { tour: 'encap-layers' })}

<h3>Nhìn thấy các tầng trong một request thật</h3>
<p><strong>Ứng dụng và giao vận — curl -v.</strong> Trên máy client của lab:</p>
${run('c11-tang', 'curl -sv', 1)}
<p>Phân loại từng dòng. <code>Trying 10.10.2.10:80</code> và <code>Established connection … from 10.10.1.10 port …</code> thuộc tầng <strong>giao vận</strong>: một kết nối TCP giữa hai cổng — cổng 80 quen thuộc của máy chủ và một cổng tạm do nhân chọn cho máy khách. Mọi dòng bắt đầu bằng <code>&gt;</code> hoặc <code>&lt;</code> thuộc tầng <strong>ứng dụng</strong>: chữ HTTP mà curl gửi đi và nhận về.</p>
<p><strong>Internet — quyết định đường đi.</strong> curl không hề quyết định cách tới 10.10.2.10. Hỏi nhân:</p>
${run('c11-tang', 'ip route get', 1)}
<p>Tầng Internet đã chọn: đi <em>qua</em> router 10.10.1.254, ra <code>eth0</code>, dùng 10.10.1.10 làm địa chỉ nguồn.</p>
<p><strong>Cả bốn — tshark.</strong> Bắt chính request đó và để tshark giải mã. Danh sách các gói trước, rồi các tầng của gói request:</p>
${run('c11-tang', 'tshark -r /tmp/t.pcap 2', 1)}
${run('c11-tang', 'tshark -r /tmp/t.pcap -Y', 1)}
<p>Một gói, bốn header lồng nhau: <strong>Ethernet</strong> từ card của máy khách tới card của <em>router</em> (không phải tới máy chủ web — chỉ chặng kế tiếp), <strong>IPv4</strong> từ 10.10.1.10 tới 10.10.2.10 (cả hành trình), <strong>TCP</strong> từ cổng tạm của máy khách tới cổng 80 kèm 83 byte dữ liệu, và <strong>HTTP</strong>. Cả frame dài 149 byte; bài 1.3 tìm từng header trong chính các byte đó.</p>

<h3>Mỗi tầng chạy ở đâu, và code của bạn điều khiển được gì</h3>
<ul>
<li><strong>Ứng dụng</strong> — bên trong tiến trình của bạn. Bạn quyết định mọi thứ: giao thức, header, phần thân, thử lại, timeout.</li>
<li><strong>Giao vận</strong> — trong nhân. Bạn chọn TCP hay UDP, cổng, và vài tuỳ chọn socket (timeout kết nối/đọc, keep-alive, <code>TCP_NODELAY</code>). Nhân lo số thứ tự, gửi lại và điều khiển luồng.</li>
<li><strong>Internet</strong> — trong nhân. Bảng định tuyến quyết định; code của bạn gần như không bao giờ đụng tới.</li>
<li><strong>Liên kết</strong> — driver và chip mạng. Code của bạn không có việc gì ở đây.</li>
</ul>
<p>Vì thế phần lớn lỗi mạng mà lập trình viên sửa nằm ở tầng ứng dụng (timeout, keep-alive, sai địa chỉ) hoặc ở cấu hình (cổng, DNS, chứng chỉ) — không phải trong nhân.</p>

<h3>Mỗi thiết bị chỉ đọc tới tầng của nó</h3>
<p>Switch đọc header Ethernet rồi chuyển đi. Router đọc tới header IP — nó không bao giờ thấy URL của bạn. Bộ cân bằng tải L4 thấy địa chỉ và cổng nhưng không thấy đường dẫn. Chỉ proxy L7 như nginx, và chính API của bạn, mới đọc HTTP. Hệ quả thực tế: "gửi <code>/api</code> tới máy này và <code>/</code> tới máy khác" chỉ proxy L7 làm được — đúng việc nginx của lab làm với khối <code>location /api/</code>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Coi mô hình OSI như một định luật tự nhiên.</strong> Sinh viên học thuộc câu vè "Please Do Not Throw Sausage Pizza Away" rồi cãi nhau TLS thuộc tầng 5 hay 6. Giao thức thật không xếp gọn được: TLS nằm giữa TCP và HTTP; QUIC làm việc của tầng giao vận (gửi lại, sắp thứ tự) ngay trong user space trên nền UDP; ARP nằm lưng chừng giữa tầng 2 và 3. Hãy dùng các tầng để hỏi <em>hộp này đọc header nào?</em> và <em>chặng nào hỏng?</em> — đừng dùng như câu đố mẹo.</p>
</div>

<h3>Các tầng cũng là bảng kiểm gỡ lỗi</h3>
<table>
<thead><tr><th>Triệu chứng</th><th>Tầng kiểm trước</th><th>Công cụ</th></tr></thead>
<tbody>
<tr><td><code>Could not resolve host</code></td><td>ứng dụng (DNS)</td><td><code>dig</code></td></tr>
<tr><td>hết giờ chờ, "no route to host"</td><td>Internet</td><td><code>ip route</code>, <code>ping</code>, <code>mtr</code></td></tr>
<tr><td><code>Connection refused</code></td><td>giao vận</td><td><code>ss -tlnp</code> trên máy chủ</td></tr>
<tr><td>lỗi chứng chỉ</td><td>TLS (giữa giao vận và HTTP)</td><td><code>openssl s_client</code></td></tr>
<tr><td>404, 500, 502</td><td>ứng dụng</td><td><code>curl -v</code>, log của ứng dụng và proxy</td></tr>
</tbody>
</table>
${cauNoi('vi', { ...NWC, bai: 'nwc204-3-2-mo-hinh-tham-chieu-va-dong-goi', so: '3.2', ten: 'Mô hình tham chiếu, đóng gói và truy cập dữ liệu', giong: 'mô hình OSI, TCP/IP và cách ánh xạ giữa hai mô hình', khac: 'NWC204 dạy mô hình theo thuật ngữ Cisco để đi thi (tên PDU, chức năng từng tầng)', them: 'mỗi tầng chạy ở đâu trong một máy tính thật, code của bạn điều khiển được gì, từ vựng L2/L4/L7 của bộ cân bằng tải và proxy, và từng tầng nhìn thấy trong curl -v, ip route get và tshark' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> nhóm bạn có nginx đứng trước API, và một bộ cân bằng tải L4 đứng trước nginx. Bạn cần giải thích cho bạn cùng nhóm hộp nào làm được gì.</p>
<ol>
<li>Trên máy client của lab, chạy <code>curl -sv http://10.10.2.10/ 2&gt;&amp;1</code> và gắn nhãn L4 hay L7 cho từng dòng.</li>
<li>Chạy <code>ip route get 10.10.2.20</code> và <code>ip route get 10.10.1.11</code>. Cái nào đi qua router, vì sao?</li>
<li>Bắt một request (công thức ở bài 0.1) rồi chạy <code>tshark -r FILE -Y http.request -V 2&gt;/dev/null | grep -E '^[A-Z]'</code>. Ghi cạnh mỗi dòng tên tầng TCP/IP và số tầng OSI.</li>
<li>Trả lời: bộ cân bằng tải L4 có gửi được <code>/admin</code> sang máy chủ khác không? nginx có không? router có không?</li>
</ol>
<p><strong>Đạt khi:</strong> mọi dòng curl đều có nhãn, bạn giải thích được hai tuyến, bốn dòng tshark có tên tầng, và câu trả lời bước 4 là "không, có, không" kèm lý do cho từng cái.</p>
<details><summary>Lời giải</summary>
<p>Các dòng Trying/Established/Connection-left-intact là L4; dòng <code>&gt;</code>/<code>&lt;</code> là L7. 10.10.2.20 ở mạng khác ⇒ "via 10.10.1.254"; 10.10.1.11 nằm trong /24 của chính máy khách ⇒ đi thẳng "dev eth0". tshark: Ethernet II = liên kết (L2), Internet Protocol = Internet (L3), TCP = giao vận (L4), HTTP = ứng dụng (L7). Chỉ nginx đọc được đường dẫn (L7): bộ cân bằng L4 chỉ thấy địa chỉ và cổng, router chỉ thấy IP.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['layer (tầng)', 'Một phần của công việc, có header riêng; chỉ đọc header đó.'],
    ['protocol stack (chồng giao thức)', 'Các tầng xếp chồng: HTTP trên TCP trên IP trên Ethernet.'],
    ['OSI model (mô hình OSI)', 'Mô hình tham chiếu 7 tầng từ 1984; nguồn của từ vựng L1–L7.'],
    ['TCP/IP model (mô hình TCP/IP)', '4 tầng mà hệ thống thật cài đặt: ứng dụng, giao vận, Internet, liên kết.'],
    ['L4 / L7', 'Giao vận (kết nối, cổng) / ứng dụng (đường dẫn, header HTTP).'],
    ['user space và kernel (nhân)', 'Thế giới của chương trình bạn và lõi hệ điều hành nơi TCP và IP chạy.'],
    ['next hop (chặng kế)', 'Thiết bị tiếp theo mà frame được gửi tới — thường là router, không phải máy chủ cuối.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chia tầng tách mạng thành bốn bài toán nhỏ; mỗi tầng chỉ đọc header của nó.</li>
<li>Hệ thống thật chạy bốn tầng TCP/IP; bảy tầng OSI cho ta từ vựng L2, L3, L4, L7.</li>
<li>Tiến trình của bạn sở hữu tầng ứng dụng; nhân chạy giao vận và Internet; driver và chip chạy tầng liên kết.</li>
<li>curl -v cho thấy L4 và L7, ip route get cho thấy quyết định L3, tshark -V cho thấy cả bốn header lồng nhau.</li>
<li>Hộp nào chỉ hành động được trên thứ nó đọc: định tuyến theo đường dẫn URL cần proxy L7.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc1122', '📄', 'RFC 1122 — Yêu cầu với máy chủ Internet', 'Bốn tầng TCP/IP theo đúng chuẩn Internet (mục 1.1.3).', 'Mở')}
${L('https://hpbn.co/', '📗', 'High Performance Browser Networking', 'Các tầng nhìn từ góc độ hiệu năng.', 'Mở')}
</div>
`,
};
