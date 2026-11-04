/**
 * Chương 5 · Lab 5 — UDP, QUIC và HTTP/3 của LabFlow (phần 5 dự án xuyên khoá). Lab cơ bản + nginx HTTP/3.
 * Lời giải dùng output thật: lab/out/c51-*, c52-*, c53-*.out.txt.
 */
import { run, card, kv, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-5.mjs';

const L = card;
const PHIEU = `# Lab 5 report — <your name>, <date>

## R1 UDP exchange       — a labelled capture: only datagrams, no handshake
## R2 Best effort        — sent / received under 30% loss; was the sender notified? (y/n)
## R3 HTTP/3 server      — ss -uln + ss -tln on 8443 (the UDP listener = HTTP/3 fingerprint)
## R4 Discovery          — Alt-Svc: h3 from the lab server AND a real site
## R5 Blocked QUIC       — the iptables rule, the curl result (still 200 over h2?)
## R6 Recommendation     — telemetry: TCP or UDP + why; HTTP/3: on or off + why`;

export default {
  title: 'Lab 5 — UDP, QUIC and HTTP/3 at LabFlow: measure, identify, and recommend a transport|||Lab 5 — UDP, QUIC và HTTP/3 của LabFlow: đo, nhận diện và khuyến nghị một tầng vận chuyển',
  slug: 'netdev-5-4-lab-udp-quic',
  type: 'LESSON',
  isFreePreview: true,
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab 5 · Course project part 5</span>
<h2>Lab 5 — UDP, QUIC and HTTP/3 at LabFlow</h2>
<p class="lead">Two decisions have landed on your desk. LabFlow wants a live sensor-telemetry channel and needs to know whether it should be TCP or UDP. And the team wants to enable HTTP/3 but is unsure whether it is safe and how they would even tell it is working. On top of that, support reports the dashboard is “slower from the new office” — which smells like blocked QUIC. This lab answers all three with measurements, not opinions. Everything is in Chapter 5.</p>

<h3>What you get</h3>
<ul>
<li>The base lab, plus a UDP echo server on <code>10.10.2.10:9999</code> and a real HTTP/3 nginx on <code>8443</code>.</li>
<li>Packet loss you can dial in, and the <code>internet</code> container for real-world Alt-Svc.</li>
<li>The tools: <code>socat</code>, <code>tcpdump</code>, <code>node dgram</code>, nginx HTTP/3, <code>iptables</code>, <code>curl</code>.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Read a UDP exchange.</strong> Capture one echo (<code>socat - UDP:10.10.2.10:9999</code>) and show, from the packets, that there is no handshake — just datagrams.</li>
<li><strong>R2 Best effort.</strong> Add 30% loss on the client and send 20 datagrams with <code>node udp-send.mjs</code>. Report how many the server received and whether the sender was told.</li>
<li><strong>R3 The HTTP/3 server side.</strong> Start the vhost and show nginx listening on <strong>both</strong> UDP and TCP 8443. Name which one is the HTTP/3 fingerprint.</li>
<li><strong>R4 Discovery.</strong> Find the <code>Alt-Svc: h3</code> header on the lab server (over HTTP/2) and on a real site via the <code>internet</code> container. Explain what a browser does with it.</li>
<li><strong>R5 Blocked QUIC.</strong> Drop UDP 8443 (<code>iptables -A INPUT -p udp --dport 8443 -j DROP</code>) and prove the site still returns 200 over HTTP/2. Explain the silent fallback.</li>
<li><strong>R6 Recommendation.</strong> Write a short UDP-vs-TCP decision for the telemetry channel, and an HTTP/3 go/no-go — each justified by what you measured.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>1.5</td><td>capture shows only UDP datagrams; the absence of SYN/SYN-ACK/ACK is named</td></tr>
<tr><td>R2</td><td>2</td><td>loss measured (e.g. 12/20 received); the sender got no error — best-effort explained</td></tr>
<tr><td>R3</td><td>2</td><td>UDP and TCP listeners on 8443 both shown; the UDP listener named as the HTTP/3 fingerprint</td></tr>
<tr><td>R4</td><td>1.5</td><td>Alt-Svc h3 found on the lab server and a real site; what a browser does with it</td></tr>
<tr><td>R5</td><td>2</td><td>UDP dropped, site still 200 over h2; the silent fallback explained</td></tr>
<tr><td>R6</td><td>1</td><td>a defensible telemetry decision and HTTP/3 go/no-go, each with a reason from the lab</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Hints</summary>
<ul>
<li>R1: <code>tcpdump -i eth0 -n -w /tmp/u.pcap 'udp port 9999'</code> while <code>socat</code> sends, then <code>tcpdump -ntr /tmp/u.pcap</code>.</li>
<li>R2: <code>tc qdisc add dev eth0 root netem loss 30%</code> on <code>nfd-client</code>, then <code>node udp-send.mjs</code> (the server reports the count).</li>
<li>R3: <code>ss -ulnp</code> and <code>ss -tlnp</code> for 8443 on <code>nfd-web</code>.</li>
<li>R4: <code>curl -sk --http2 -D - https://localhost:8443/ -o /dev/null | grep -i alt-svc</code>; from <code>internet</code>: <code>curl -sI https://www.cloudflare.com/ | grep -i alt-svc</code>.</li>
<li>R5: <code>iptables -A INPUT -p udp --dport 8443 -j DROP</code>, then <code>curl -sk --http2 -w '%{http_code}\\n' -o /dev/null https://localhost:8443/</code>; remove the rule after.</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — a UDP exchange is just datagrams; there is no <code>[S]</code>/<code>[S.]</code>/<code>[.]</code>:</p>
${run('c51-wire', 'tcpdump', 1)}
<p><strong>R2</strong> — best effort under 30% loss: 20 sent, some lost, and the sender is never told:</p>
${run('c51-loss', 'node udp-send', 1)}
<p>Eight (or so) datagrams vanished with no ACK and no retransmission. For telemetry where only the newest value matters, that is acceptable — and cheaper than TCP recovering data you would discard.</p>
<p><strong>R3</strong> — the HTTP/3 server side is real: nginx listens on UDP (QUIC) <em>and</em> TCP (TLS/HTTP-2) 8443. The UDP listener is the unmistakable HTTP/3 fingerprint:</p>
${run('c52-server', 'ss -ulnp', 1, { cut: 110 })}
${run('c52-server', 'ss -tlnp', 1, { cut: 110 })}
<p><strong>R4</strong> — discovery: the HTTP/2 response advertises <code>h3</code>, and so do the real sites. A browser remembers it and tries QUIC next time:</p>
${run('c52-server', 'curl -sk --http2', 1)}
${run('c52-altsvc', 'curl -sI --max-time 10 https://www.cloudflare.com/', 1)}
<p><strong>R5</strong> — blocked QUIC: drop all UDP to the port and the site is unharmed, still 200 over HTTP/2. The fallback is silent:</p>
${run('c53-block', 'curl -sk --http2', 1)}
<p><strong>R6</strong> — a defensible recommendation:</p>
<ul>
<li><strong>Telemetry channel → UDP</strong> (with an app-level sequence number). Only the newest sensor value matters, so best-effort delivery is the right trade-off; a dropped update is simply replaced by the next. Add a sequence number so the receiver can discard a stale update that arrives out of order — the first step of what QUIC would do for you.</li>
<li><strong>HTTP/3 → turn it on.</strong> It is a free speed-up on lossy/mobile networks (removed head-of-line blocking, saved handshake round trip, connection migration), and the Alt-Svc fallback means a network that blocks UDP 443 just quietly uses HTTP/2 — slower, never broken. Verify server-side with the UDP listener + Alt-Svc, and client-side with the browser’s Protocol column; watch for an office reporting <code>h2</code> where you expect <code>h3</code>.</li>
</ul>

<h3>Going further</h3>
<ul>
<li>Add a sequence number to <code>udp-send.mjs</code> and have the server reject out-of-order stale updates — you have just started reinventing QUIC (lesson 5.2).</li>
<li>From a browser, open a real HTTP/3 site, read the <code>Protocol</code> column, then block UDP 443 on your own machine and watch it drop to <code>h2</code>.</li>
<li><strong>Course project:</strong> HTTP/3 and the UDP decision both return in the Chapter 13 whole-path capstone — keep your R3 server fingerprint and R6 recommendation.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab 5 · Dự án xuyên khoá phần 5</span>
<h2>Lab 5 — UDP, QUIC và HTTP/3 của LabFlow</h2>
<p class="lead">Hai quyết định vừa đặt lên bàn bạn. LabFlow muốn một kênh telemetry cảm biến trực tiếp và cần biết nó nên là TCP hay UDP. Và nhóm muốn bật HTTP/3 nhưng không chắc nó có an toàn không và làm sao biết nó chạy. Trên hết, support báo bảng điều khiển “chậm hơn từ văn phòng mới” — có mùi QUIC bị chặn. Lab này trả lời cả ba bằng phép đo, không phải ý kiến. Mọi thứ đều có trong Chương 5.</p>

<h3>Bạn được gì</h3>
<ul>
<li>Lab cơ bản, cộng một máy chủ UDP echo ở <code>10.10.2.10:9999</code> và một nginx HTTP/3 thật ở <code>8443</code>.</li>
<li>Mất gói bạn chỉnh được, và container <code>internet</code> cho Alt-Svc thế giới thực.</li>
<li>Bộ công cụ: <code>socat</code>, <code>tcpdump</code>, <code>node dgram</code>, nginx HTTP/3, <code>iptables</code>, <code>curl</code>.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Đọc một trao đổi UDP.</strong> Bắt một echo (<code>socat - UDP:10.10.2.10:9999</code>) và cho thấy, từ các gói, rằng không có bắt tay — chỉ các gói dữ liệu.</li>
<li><strong>R2 Nỗ lực tối đa.</strong> Thêm 30% mất trên client và gửi 20 gói với <code>node udp-send.mjs</code>. Báo bao nhiêu máy chủ nhận và bên gửi có được báo không.</li>
<li><strong>R3 Phía máy chủ HTTP/3.</strong> Dựng vhost và cho thấy nginx nghe trên <strong>cả</strong> UDP và TCP 8443. Gọi tên cái nào là dấu vân tay HTTP/3.</li>
<li><strong>R4 Khám phá.</strong> Tìm header <code>Alt-Svc: h3</code> trên máy chủ lab (qua HTTP/2) và trên một site thật qua container <code>internet</code>. Giải thích trình duyệt làm gì với nó.</li>
<li><strong>R5 QUIC bị chặn.</strong> Vứt UDP 8443 (<code>iptables -A INPUT -p udp --dport 8443 -j DROP</code>) và chứng minh site vẫn trả 200 qua HTTP/2. Giải thích đường lùi âm thầm.</li>
<li><strong>R6 Khuyến nghị.</strong> Viết một quyết định UDP-so-với-TCP ngắn cho kênh telemetry, và một go/no-go HTTP/3 — mỗi cái biện minh bằng cái bạn đo được.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>R1</td><td>1.5</td><td>bản bắt gói chỉ thấy các gói UDP; sự vắng mặt SYN/SYN-ACK/ACK được gọi tên</td></tr>
<tr><td>R2</td><td>2</td><td>mất gói đo được (ví dụ 12/20 nhận); bên gửi không có lỗi — nỗ lực tối đa giải thích</td></tr>
<tr><td>R3</td><td>2</td><td>socket nghe UDP và TCP trên 8443 đều hiện; cái UDP gọi là dấu vân tay HTTP/3</td></tr>
<tr><td>R4</td><td>1.5</td><td>Alt-Svc h3 tìm thấy trên máy chủ lab và một site thật; trình duyệt làm gì với nó</td></tr>
<tr><td>R5</td><td>2</td><td>UDP bị vứt, site vẫn 200 qua h2; đường lùi âm thầm giải thích</td></tr>
<tr><td>R6</td><td>1</td><td>một quyết định telemetry bảo vệ được và go/no-go HTTP/3, mỗi cái có lý do từ lab</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Gợi ý</summary>
<ul>
<li>R1: <code>tcpdump -i eth0 -n -w /tmp/u.pcap 'udp port 9999'</code> trong lúc <code>socat</code> gửi, rồi <code>tcpdump -ntr /tmp/u.pcap</code>.</li>
<li>R2: <code>tc qdisc add dev eth0 root netem loss 30%</code> trên <code>nfd-client</code>, rồi <code>node udp-send.mjs</code> (máy chủ báo số đếm).</li>
<li>R3: <code>ss -ulnp</code> và <code>ss -tlnp</code> cho 8443 trên <code>nfd-web</code>.</li>
<li>R4: <code>curl -sk --http2 -D - https://localhost:8443/ -o /dev/null | grep -i alt-svc</code>; từ <code>internet</code>: <code>curl -sI https://www.cloudflare.com/ | grep -i alt-svc</code>.</li>
<li>R5: <code>iptables -A INPUT -p udp --dport 8443 -j DROP</code>, rồi <code>curl -sk --http2 -w '%{http_code}\\n' -o /dev/null https://localhost:8443/</code>; gỡ luật sau đó.</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — một trao đổi UDP chỉ là các gói; không có <code>[S]</code>/<code>[S.]</code>/<code>[.]</code>:</p>
${run('c51-wire', 'tcpdump', 1)}
<p><strong>R2</strong> — nỗ lực tối đa dưới 30% mất: 20 gửi, một số mất, và bên gửi không bao giờ được báo:</p>
${run('c51-loss', 'node udp-send', 1)}
<p>Chừng tám gói biến mất không ACK và không truyền lại. Với telemetry nơi chỉ giá trị mới nhất quan trọng, đó là chấp nhận được — và rẻ hơn TCP phục hồi dữ liệu bạn sẽ vứt.</p>
<p><strong>R3</strong> — phía máy chủ HTTP/3 là thật: nginx nghe trên UDP (QUIC) <em>và</em> TCP (TLS/HTTP-2) 8443. Socket UDP là dấu vân tay HTTP/3 không thể nhầm:</p>
${run('c52-server', 'ss -ulnp', 1, { cut: 110 })}
${run('c52-server', 'ss -tlnp', 1, { cut: 110 })}
<p><strong>R4</strong> — khám phá: câu trả lời HTTP/2 quảng cáo <code>h3</code>, và các site thật cũng vậy. Trình duyệt nhớ nó và thử QUIC lần sau:</p>
${run('c52-server', 'curl -sk --http2', 1)}
${run('c52-altsvc', 'curl -sI --max-time 10 https://www.cloudflare.com/', 1)}
<p><strong>R5</strong> — QUIC bị chặn: vứt mọi UDP tới cổng và site không hề hấn, vẫn 200 qua HTTP/2. Đường lùi âm thầm:</p>
${run('c53-block', 'curl -sk --http2', 1)}
<p><strong>R6</strong> — một khuyến nghị bảo vệ được:</p>
<ul>
<li><strong>Kênh telemetry → UDP</strong> (kèm một số thứ tự ở mức ứng dụng). Chỉ giá trị cảm biến mới nhất quan trọng, nên giao hàng nỗ lực tối đa là đánh đổi đúng; một cập nhật mất đơn giản được thay bằng cái kế. Thêm một số thứ tự để bên nhận bỏ một cập nhật cũ tới sai thứ tự — bước đầu của cái QUIC sẽ làm hộ bạn.</li>
<li><strong>HTTP/3 → bật.</strong> Nó là một cú tăng tốc miễn phí trên mạng hay mất gói/di động (bỏ nghẽn đầu hàng, tiết kiệm vòng bắt tay, chuyển kết nối), và đường lùi Alt-Svc nghĩa là một mạng chặn UDP 443 chỉ lặng lẽ dùng HTTP/2 — chậm hơn, không bao giờ hỏng. Xác minh phía máy chủ bằng socket UDP + Alt-Svc, và phía client bằng cột Protocol của trình duyệt; để ý một văn phòng báo <code>h2</code> nơi bạn mong <code>h3</code>.</li>
</ul>

<h3>Đi xa hơn</h3>
<ul>
<li>Thêm một số thứ tự vào <code>udp-send.mjs</code> và cho máy chủ từ chối cập nhật cũ tới sai thứ tự — bạn vừa bắt đầu tái phát minh QUIC (bài 5.2).</li>
<li>Từ một trình duyệt, mở một site HTTP/3 thật, đọc cột <code>Protocol</code>, rồi chặn UDP 443 trên máy của chính bạn và xem nó tụt về <code>h2</code>.</li>
<li><strong>Dự án xuyên khoá:</strong> HTTP/3 và quyết định UDP đều quay lại trong dự án cuối khoá cả-đường Chương 13 — giữ dấu vân tay máy chủ R3 và khuyến nghị R6 của bạn.</li>
</ul>
</div>
`,
};
