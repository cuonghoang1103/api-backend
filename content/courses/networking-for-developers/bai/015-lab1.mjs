/**
 * Chương 1 · Lab 1 — Giải phẫu một request của LabFlow (bài MỚI 31/10/2026). Phần 1 của dự án xuyên khoá.
 * Lời giải dùng output thật: lab/out/lab1-*, c12-goi, c13-hop-*, c13-arp (.out.txt).
 */
import { run, card, kv, details, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-1.mjs';

const L = card;
const PHIEU = `# Lab 1 report — <your name>, <date>

## Verdict
- Claim 1 "the router rewrites the client's IP": TRUE / FALSE because …
- Claim 2 "nginx keeps one connection to the API open": TRUE / FALSE because …

## R1 Map
| machine | IP(s) | MAC(s) | network(s) | listening sockets | ip_forward |
|---|---|---|---|---|---|
| client | | | | | |
| client2 | | | | | |
| router | | | | | |
| web | | | | | |
| api | | | | | |

## R2 Layers (client side)   — paste: tshark -T fields … and -x
## R3 Hop (web side)           — paste both captures; list changed / unchanged fields
## R4 ARP                      — paste tcpdump -e; explain each request
## R5 Second connection        — paste the capture on api; explain X-Forwarded-For and the HTTP version
## R6 Break & fix              — paste ss + curl before and after`;

export default {
  title: 'Lab 1 — Dissect one request of LabFlow: map, layers, hop, ARP, second connection, break & fix|||Lab 1 — Giải phẫu một request của LabFlow: bản đồ, các tầng, chặng router, ARP, kết nối thứ hai, làm hỏng và sửa',
  slug: 'netdev-1-6-lab-giai-phau-request',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chương 1 (phần 1 dự án xuyên khoá): chứng minh hay bác bỏ hai khẳng định của đồng đội bằng bản bắt gói — bản đồ 5 máy, 4 tầng của request, MAC/TTL đổi qua router, ARP, kết nối nginx → API, và sửa lỗi 502 do gắn 127.0.0.1. Có rubric 10 điểm, gợi ý theo bậc, lời giải.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab 1 · Course project part 1</span>
<h2>Lab 1 — Dissect one request of LabFlow</h2>
<p class="lead">At Monday's stand-up two teammates say: <em>"Our router rewrites the client's IP address — that's why the API sees 10.10.2.10"</em> and <em>"nginx keeps one connection to the API open, so it's fast."</em> Your lead asks you to <strong>prove or disprove both claims with captures</strong> and hand in a one-page report. Everything you need is in Chapter 1; nothing is new except putting it together.</p>

<h3>What you get</h3>
<ul>
<li>The lab from lesson 0.1, started with <code>docker compose -f moi-truong/compose.yml -p nfd up -d</code>. The request to dissect: <code>curl -s http://10.10.2.10/api/lab1</code> from <code>nfd-client</code>.</li>
<li>nginx on <code>web</code> has a route <code>/hong/</code> proxied to <code>10.10.2.20:4999</code>, where nothing listens yet (you will use it in R6).</li>
<li>Time: 90–120 minutes. Tools: <code>ip</code>, <code>ss</code>, <code>tcpdump</code>, <code>tshark</code>, <code>curl</code>, <code>nc</code>, <code>node</code>.</li>
<li>This lab is <strong>part 1 of the course project</strong>: the request-path map of mini LabFlow. Keep your report — later chapters add DNS, TCP timing, TLS, caching and a database to the same map.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 — Map.</strong> For all five machines: IP address(es), MAC address(es), which network(s), listening sockets, and whether IP forwarding is on. Fill the table in the report template below.</li>
<li><strong>R2 — Layers.</strong> Capture the request on the client. Show the frame size and the size of each header (Ethernet, IP, TCP, HTTP data) from tshark, and give the byte offsets where each header starts in the hex.</li>
<li><strong>R3 — Hop.</strong> Capture the <em>same</em> request on the web server at the same time. List every field that changed across the router and every field that did not, with both captures as evidence.</li>
<li><strong>R4 — ARP.</strong> Empty the client's ARP cache, make the request again while capturing <code>arp</code>. Which IP does the client ask for, who answers, broadcast or unicast?</li>
<li><strong>R5 — Second connection.</strong> Capture on the API machine while the client makes the request. Which IP and port does the API see? What does nginx add to the request, and which HTTP version and Connection header does it use?</li>
<li><strong>R6 — Break &amp; fix.</strong> Make <code>http://10.10.2.10/hong/</code> answer 200 by starting a tiny Node service on the API machine, port 4999. Do it wrong first — bind to 127.0.0.1 — reproduce the error, then fix it and prove the fix with <code>ss</code> and <code>curl</code>.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<thead><tr><th>Req.</th><th>Points</th><th>Full marks when…</th><th>Typical lost points</th></tr></thead>
<tbody>
<tr><td>R1</td><td>1.5</td><td>table complete and correct for 5 machines, router shows 2 interfaces and ip_forward = 1, commands shown</td><td>router listed with one IP; MACs guessed instead of read</td></tr>
<tr><td>R2</td><td>2</td><td>14/20/32/83 from tshark, offsets 0/14/34/66, each header named</td><td>"TCP header 20 bytes" — forgetting the 12 bytes of options</td></tr>
<tr><td>R3</td><td>2</td><td>both MACs, TTL and IP checksum changed; IPs, ports, payload unchanged; both captures pasted</td><td>saying the source IP changed; not explaining why the checksum changed</td></tr>
<tr><td>R4</td><td>1.5</td><td>client asks only for its next hop (the router), broadcast request, unicast reply</td><td>claiming the client ARPs for 10.10.2.10</td></tr>
<tr><td>R5</td><td>1.5</td><td>API sees 10.10.2.10 + a new ephemeral port; X-Forwarded-For carries 10.10.1.10; HTTP/1.0 + Connection: close</td><td>missing the HTTP version, so claim 2 is not addressed</td></tr>
<tr><td>R6</td><td>1.5</td><td>502 with 127.0.0.1:4999 (ss shows it), 200 with 0.0.0.0:4999 (ss + curl)</td><td>fixing it without first reproducing and explaining the 502</td></tr>
</tbody>
</table>
<p>Minus 1 point for any claim in the report without evidence (a command and its output).</p>

<h3>Hints by level</h3>
${details('Hint 1 — getting started (open after 10 minutes)', `<ul>
<li>R1: <code>ip -br addr</code>, <code>ip -br link</code>, <code>ss -tlnp</code>, <code>sysctl net.ipv4.ip_forward</code> on each machine with <code>docker exec nfd-&lt;name&gt; …</code>.</li>
<li>R2–R3: start a background capture on the web server first (<code>docker exec -d nfd-web sh -c "tcpdump -i eth0 -n -U -w /tmp/h.pcap 'tcp port 80'"</code>), then capture on the client and make the request, then stop both with <code>pkill -INT tcpdump</code>.</li>
<li>R5: the same pattern on <code>nfd-api</code> with <code>'tcp port 3000'</code>.</li>
</ul>`)}
${details('Hint 2 — the right questions (open after 20 minutes)', `<ul>
<li>R2: <code>tshark -r FILE -Y http.request -T fields -e frame.len -e ip.hdr_len -e ip.len -e tcp.hdr_len -e tcp.len</code>.</li>
<li>R3: print the same fields on both captures: <code>-e eth.src -e eth.dst -e ip.src -e ip.dst -e ip.ttl -e ip.checksum -e tcp.srcport -e tcp.dstport</code>. Which of them must a router change, and why?</li>
<li>R5: <code>-e http.x_forwarded_for</code>, and <code>tshark … -O http</code> to see the request line and the Connection header. Is the request line HTTP/1.1?</li>
<li>R6: <code>node -e "require('http').createServer((q,s)=&gt;s.end('ok\\n')).listen(4999,'127.0.0.1')" &amp;</code> — then change the address.</li>
</ul>`)}

<h3>Going further</h3>
<ul>
<li>Make nginx reuse connections to the API (<code>proxy_http_version 1.1;</code>, <code>proxy_set_header Connection "";</code> and an <code>upstream</code> block with <code>keepalive</code>) and prove with <code>seenFrom</code> and <code>ss</code> that the port stops changing. Chapter 10 does this properly.</li>
<li>Code Lab, lab module: write <code>dissect(hex)</code> in JavaScript that produces your R2/R3 report from the raw bytes of both captures.</li>
<li>Capture on <code>nfd-router</code> on <code>eth0</code> and <code>eth1</code> separately: which MAC pair does each interface see?</li>
</ul>

${details('✅ Solution (open only after you have written your report)', `
<p><strong>Verdict.</strong> Claim 1 is <strong>false</strong>: the router changes MAC addresses, TTL and the IP checksum, never the IP addresses. The API sees 10.10.2.10 because nginx opens a <em>second</em> connection to it; the client's address travels in the <code>X-Forwarded-For</code> header. Claim 2 is <strong>false</strong> in this lab: nginx 1.28 talks to the API with HTTP/1.0 and <code>Connection: close</code> — a new connection, with a new ephemeral port, for every request.</p>
<p><strong>R1</strong> (router shown; repeat on every machine):</p>
${run('lab1-r1-router', 'hostname', 5)}
<p><strong>R2</strong> — frame 149 = 14 + 20 + 32 + 83; Ethernet at offset 0, IP at 14, TCP at 34, HTTP at 66:</p>
${run('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -T fields', 1)}
<p><strong>R3</strong> — same request, both sides:</p>
${run('c13-hop-client', 'tshark -r /tmp/h.pcap -Y http.request -T fields', 1)}
${run('c13-hop-web', 'tshark -r /tmp/h.pcap -Y', 1)}
<p>Changed: <code>eth.src</code>, <code>eth.dst</code> (new frame for the new link), <code>ip.ttl</code> 64 → 63, <code>ip.checksum</code> (recomputed because TTL changed). Unchanged: <code>ip.src</code>, <code>ip.dst</code>, both ports, and the HTTP bytes.</p>
<p><strong>R4</strong> — the client asks only for the router (10.10.1.254), by broadcast; the router answers by unicast:</p>
${run('c13-arp', 'tcpdump -e -n -r', 1)}
<p>(The request appearing twice is the virtual bridge reflecting our own broadcast — lesson 1.4.)</p>
<p><strong>R5</strong> — on the API machine:</p>
${run('lab1-r5-client', 'curl', 1)}
${run('lab1-r5-api', 'tshark', 2)}
<p>The API's TCP peer is nginx (10.10.2.10) from an ephemeral port; nginx adds <code>X-Forwarded-For: 10.10.1.10</code>. The request line is <code>HTTP/1.0</code> with <code>Connection: close</code>: the default for proxied requests in nginx before 1.29.7 (our lab runs 1.28.3, cuongthai.com 1.27.5), so every request opens and closes a connection. Since 1.29.7 the default version is 1.1 — but connections are only reused when an <code>upstream</code> block with <code>keepalive</code> is configured, so always check the version and the config instead of assuming.</p>
<p><strong>R6</strong> — wrong, then right:</p>
${run('lab1-r6-api', 'ss', 1)}
${run('lab1-r6-client', 'curl', 1)}
${run('lab1-r6-api-fix', 'ss', 1)}
${run('lab1-r6-client-fix', 'curl', 1)}
<p>Bound to 127.0.0.1, the service is unreachable from nginx's machine, so nginx's connection is refused and it returns 502. Bound to 0.0.0.0, nginx reaches it and the route answers 200.</p>
`)}

<h3>🗂 Key terms</h3>
${kv([
    ['evidence (bằng chứng)', 'A command and its real output that supports a claim.'],
    ['request path (đường đi của request)', 'Every machine, connection and layer a request crosses.'],
    ['upstream', 'The server behind a proxy — here the Node API behind nginx.'],
    ['X-Forwarded-For', 'Header a proxy adds with the original client IP.'],
    ['Connection: close', 'HTTP header asking to close the connection after this response.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>A request through a proxy is two TCP connections: client → nginx and nginx → API.</li>
<li>Routers change MACs, TTL and checksum — never the IP addresses (until NAT, Chapter 2).</li>
<li>The client ARPs only for its next hop; the API learns the real client from X-Forwarded-For.</li>
<li>nginx before 1.29.7 talks to upstreams with HTTP/1.0 + Connection: close; whatever the version, connections are reused only with an upstream keepalive block.</li>
<li>A 502 behind a proxy is often a bind address or port problem — ss on the upstream shows it at once.</li>
</ul>
${L('https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_http_version', '📄', 'nginx — proxy_http_version', 'Default HTTP version for proxying: 1.0 before nginx 1.29.7, 1.1 since — and when keep-alive needs more.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab 1 · Dự án xuyên khoá phần 1</span>
<h2>Lab 1 — Giải phẫu một request của LabFlow</h2>
<p class="lead">Trong buổi họp đầu tuần, hai bạn cùng nhóm nói: <em>"Router của mình viết lại địa chỉ IP của máy khách — nên API mới thấy 10.10.2.10"</em> và <em>"nginx giữ sẵn một kết nối tới API nên nhanh."</em> Trưởng nhóm yêu cầu bạn <strong>chứng minh hoặc bác bỏ cả hai bằng bản bắt gói</strong> và nộp một báo cáo một trang. Mọi thứ bạn cần đều có trong Chương 1; chỉ có việc ghép chúng lại là mới.</p>

<h3>Bạn có gì</h3>
<ul>
<li>Phòng lab của bài 0.1, khởi động bằng <code>docker compose -f moi-truong/compose.yml -p nfd up -d</code>. Request cần giải phẫu: <code>curl -s http://10.10.2.10/api/lab1</code> từ <code>nfd-client</code>.</li>
<li>nginx trên <code>web</code> có đường <code>/hong/</code> chuyển tới <code>10.10.2.20:4999</code>, nơi hiện chưa có ai nghe (bạn dùng nó ở R6).</li>
<li>Thời gian: 90–120 phút. Công cụ: <code>ip</code>, <code>ss</code>, <code>tcpdump</code>, <code>tshark</code>, <code>curl</code>, <code>nc</code>, <code>node</code>.</li>
<li>Lab này là <strong>phần 1 của dự án xuyên khoá</strong>: bản đồ đường đi request của LabFlow thu nhỏ. Giữ báo cáo lại — các chương sau gắn thêm DNS, đo thời gian TCP, TLS, cache và cơ sở dữ liệu vào chính bản đồ này.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 — Bản đồ.</strong> Với cả năm máy: địa chỉ IP, địa chỉ MAC, thuộc mạng nào, các socket đang nghe, và có bật chuyển tiếp IP không. Điền bảng trong mẫu báo cáo bên dưới.</li>
<li><strong>R2 — Các tầng.</strong> Bắt request trên máy khách. Cho thấy kích thước frame và kích thước từng header (Ethernet, IP, TCP, dữ liệu HTTP) từ tshark, và chỉ ra offset mà mỗi header bắt đầu trong hex.</li>
<li><strong>R3 — Chặng router.</strong> Bắt <em>cùng</em> request đó trên máy web cùng lúc. Liệt kê mọi trường đã đổi khi qua router và mọi trường không đổi, kèm cả hai bản bắt làm bằng chứng.</li>
<li><strong>R4 — ARP.</strong> Xoá cache ARP của máy khách, gửi lại request trong lúc bắt <code>arp</code>. Máy khách hỏi IP nào, ai trả lời, broadcast hay unicast?</li>
<li><strong>R5 — Kết nối thứ hai.</strong> Bắt gói trên máy API trong lúc máy khách gửi request. API thấy IP và cổng nào? nginx thêm gì vào request, dùng phiên bản HTTP và header Connection nào?</li>
<li><strong>R6 — Làm hỏng và sửa.</strong> Làm cho <code>http://10.10.2.10/hong/</code> trả 200 bằng cách dựng một dịch vụ Node tí hon trên máy API, cổng 4999. Làm sai trước — gắn vào 127.0.0.1 — tái hiện lỗi, rồi sửa và chứng minh bằng <code>ss</code> và <code>curl</code>.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<thead><tr><th>Yêu cầu</th><th>Điểm</th><th>Đạt tối đa khi…</th><th>Hay mất điểm vì</th></tr></thead>
<tbody>
<tr><td>R1</td><td>1,5</td><td>bảng đủ và đúng cho 5 máy, router có 2 card và ip_forward = 1, có ghi lệnh</td><td>ghi router chỉ có một IP; đoán MAC thay vì đọc</td></tr>
<tr><td>R2</td><td>2</td><td>14/20/32/83 lấy từ tshark, offset 0/14/34/66, gọi tên từng header</td><td>"header TCP 20 byte" — quên 12 byte tuỳ chọn</td></tr>
<tr><td>R3</td><td>2</td><td>cả hai MAC, TTL và checksum IP đổi; IP, cổng, phần tải giữ nguyên; dán cả hai bản bắt</td><td>nói IP nguồn bị đổi; không giải thích vì sao checksum đổi</td></tr>
<tr><td>R4</td><td>1,5</td><td>máy khách chỉ hỏi chặng kế (router), request là broadcast, reply là unicast</td><td>khẳng định máy khách hỏi ARP cho 10.10.2.10</td></tr>
<tr><td>R5</td><td>1,5</td><td>API thấy 10.10.2.10 + một cổng tạm mới; X-Forwarded-For mang 10.10.1.10; HTTP/1.0 + Connection: close</td><td>bỏ sót phiên bản HTTP, nên chưa trả lời khẳng định 2</td></tr>
<tr><td>R6</td><td>1,5</td><td>502 khi gắn 127.0.0.1:4999 (ss cho thấy), 200 khi gắn 0.0.0.0:4999 (ss + curl)</td><td>sửa luôn mà không tái hiện và giải thích lỗi 502</td></tr>
</tbody>
</table>
<p>Trừ 1 điểm cho mỗi khẳng định trong báo cáo không có bằng chứng (một lệnh và output của nó).</p>

<h3>Gợi ý theo bậc</h3>
${details('Gợi ý 1 — bắt đầu (mở sau 10 phút)', `<ul>
<li>R1: <code>ip -br addr</code>, <code>ip -br link</code>, <code>ss -tlnp</code>, <code>sysctl net.ipv4.ip_forward</code> trên từng máy bằng <code>docker exec nfd-&lt;tên&gt; …</code>.</li>
<li>R2–R3: chạy bắt gói ngầm trên máy web trước (<code>docker exec -d nfd-web sh -c "tcpdump -i eth0 -n -U -w /tmp/h.pcap 'tcp port 80'"</code>), rồi bắt trên máy khách và gửi request, rồi dừng cả hai bằng <code>pkill -INT tcpdump</code>.</li>
<li>R5: cùng cách đó trên <code>nfd-api</code> với <code>'tcp port 3000'</code>.</li>
</ul>`)}
${details('Gợi ý 2 — đặt đúng câu hỏi (mở sau 20 phút)', `<ul>
<li>R2: <code>tshark -r FILE -Y http.request -T fields -e frame.len -e ip.hdr_len -e ip.len -e tcp.hdr_len -e tcp.len</code>.</li>
<li>R3: in cùng các trường trên cả hai bản bắt: <code>-e eth.src -e eth.dst -e ip.src -e ip.dst -e ip.ttl -e ip.checksum -e tcp.srcport -e tcp.dstport</code>. Router buộc phải đổi trường nào, vì sao?</li>
<li>R5: <code>-e http.x_forwarded_for</code>, và <code>tshark … -O http</code> để xem dòng request và header Connection. Dòng request có phải HTTP/1.1 không?</li>
<li>R6: <code>node -e "require('http').createServer((q,s)=&gt;s.end('ok\\n')).listen(4999,'127.0.0.1')" &amp;</code> — rồi đổi địa chỉ.</li>
</ul>`)}

<h3>Thử thách thêm</h3>
<ul>
<li>Cho nginx dùng lại kết nối tới API (<code>proxy_http_version 1.1;</code>, <code>proxy_set_header Connection "";</code> và một khối <code>upstream</code> có <code>keepalive</code>) và chứng minh bằng <code>seenFrom</code> và <code>ss</code> rằng cổng thôi thay đổi. Chương 10 làm việc này đầy đủ.</li>
<li>Code Lab, module lab: viết <code>dissect(hex)</code> bằng JavaScript tạo ra báo cáo R2/R3 từ byte thô của cả hai bản bắt.</li>
<li>Bắt gói trên <code>nfd-router</code> ở <code>eth0</code> và <code>eth1</code> riêng: mỗi card thấy cặp MAC nào?</li>
</ul>

${details('✅ Lời giải (chỉ mở sau khi đã viết xong báo cáo)', `
<p><strong>Kết luận.</strong> Khẳng định 1 <strong>sai</strong>: router đổi địa chỉ MAC, TTL và checksum IP, không bao giờ đổi địa chỉ IP. API thấy 10.10.2.10 vì nginx mở một kết nối <em>thứ hai</em> tới nó; địa chỉ của máy khách đi trong header <code>X-Forwarded-For</code>. Khẳng định 2 <strong>sai</strong> trong lab này: nginx 1.28 nói chuyện với API bằng HTTP/1.0 và <code>Connection: close</code> — mỗi request một kết nối mới, một cổng tạm mới.</p>
<p><strong>R1</strong> (ví dụ router; làm lại trên mọi máy):</p>
${run('lab1-r1-router', 'hostname', 5)}
<p><strong>R2</strong> — frame 149 = 14 + 20 + 32 + 83; Ethernet ở offset 0, IP ở 14, TCP ở 34, HTTP ở 66:</p>
${run('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -T fields', 1)}
<p><strong>R3</strong> — cùng request, hai phía:</p>
${run('c13-hop-client', 'tshark -r /tmp/h.pcap -Y http.request -T fields', 1)}
${run('c13-hop-web', 'tshark -r /tmp/h.pcap -Y', 1)}
<p>Đổi: <code>eth.src</code>, <code>eth.dst</code> (frame mới cho đường truyền mới), <code>ip.ttl</code> 64 → 63, <code>ip.checksum</code> (tính lại vì TTL đổi). Không đổi: <code>ip.src</code>, <code>ip.dst</code>, cả hai cổng, và các byte HTTP.</p>
<p><strong>R4</strong> — máy khách chỉ hỏi router (10.10.1.254), bằng broadcast; router trả lời bằng unicast:</p>
${run('c13-arp', 'tcpdump -e -n -r', 1)}
<p>(Request hiện hai lần là bridge ảo phản hồi lại broadcast của chính ta — bài 1.4.)</p>
<p><strong>R5</strong> — trên máy API:</p>
${run('lab1-r5-client', 'curl', 1)}
${run('lab1-r5-api', 'tshark', 2)}
<p>Đầu kia TCP mà API thấy là nginx (10.10.2.10) từ một cổng tạm; nginx thêm <code>X-Forwarded-For: 10.10.1.10</code>. Dòng request là <code>HTTP/1.0</code> kèm <code>Connection: close</code>: mặc định khi làm proxy của nginx trước bản 1.29.7 (lab chạy 1.28.3, cuongthai.com chạy 1.27.5), nên mỗi request mở rồi đóng một kết nối. Từ 1.29.7 phiên bản mặc định là 1.1 — nhưng kết nối chỉ được dùng lại khi có khối <code>upstream</code> kèm <code>keepalive</code>, nên luôn kiểm phiên bản và cấu hình thay vì đoán.</p>
<p><strong>R6</strong> — sai, rồi đúng:</p>
${run('lab1-r6-api', 'ss', 1)}
${run('lab1-r6-client', 'curl', 1)}
${run('lab1-r6-api-fix', 'ss', 1)}
${run('lab1-r6-client-fix', 'curl', 1)}
<p>Gắn vào 127.0.0.1 thì từ máy của nginx không tới được dịch vụ, kết nối của nginx bị từ chối và nó trả 502. Gắn vào 0.0.0.0 thì nginx tới được và đường đó trả 200.</p>
`)}

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['evidence (bằng chứng)', 'Một lệnh và output thật của nó, chống lưng cho một khẳng định.'],
    ['request path (đường đi của request)', 'Mọi máy, kết nối và tầng mà một request đi qua.'],
    ['upstream (máy chủ phía sau)', 'Máy chủ đứng sau proxy — ở đây là API Node sau nginx.'],
    ['X-Forwarded-For', 'Header proxy gắn thêm, mang IP của máy khách gốc.'],
    ['Connection: close', 'Header HTTP yêu cầu đóng kết nối sau câu trả lời này.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một request đi qua proxy là hai kết nối TCP: máy khách → nginx và nginx → API.</li>
<li>Router đổi MAC, TTL và checksum — không bao giờ đổi địa chỉ IP (cho tới NAT, Chương 2).</li>
<li>Máy khách chỉ hỏi ARP cho chặng kế; API biết máy khách thật qua X-Forwarded-For.</li>
<li>nginx trước 1.29.7 nói với upstream bằng HTTP/1.0 + Connection: close; bản nào cũng vậy, kết nối chỉ được dùng lại khi có khối upstream keepalive.</li>
<li>502 phía sau proxy thường là lỗi địa chỉ gắn hoặc cổng — ss trên máy upstream cho thấy ngay.</li>
</ul>
${L('https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_http_version', '📄', 'nginx — proxy_http_version', 'Phiên bản HTTP mặc định khi làm proxy: 1.0 trước nginx 1.29.7, 1.1 từ bản đó — và keep-alive cần gì thêm.', 'Mở')}
</div>
`,
};
