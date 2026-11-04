/**
 * Chương 4 · 4.1 — Bắt tay ba bước và đóng kết nối (slug khung netdev-4-1-bat-tay). Bài MỞ CHƯƠNG 4:
 * khối "🎯 Chương 4 trong một khung" ở đầu bài đọc. Lab cơ bản (compose.yml, project nfd: client — router — web — api).
 * Output thật: lab/out/c41-*.out.txt (dựng lại: bash lab/code/dung-output-ch4.sh).
 */
import { run, card, kv, cauNoi, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-04-1.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '4.1 — The three-way handshake and connection teardown|||4.1 — Bắt tay ba bước và đóng kết nối',
  slug: 'netdev-4-1-bat-tay',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 4: đọc trọn một kết nối TCP trong bản bắt gói — SYN/SYN-ACK/ACK, đẩy dữ liệu, FIN bốn bước; đo bằng curl -w rằng mỗi kết nối mới tốn một vòng khứ hồi còn keep-alive thì không; phân biệt ba kiểu kết thúc: FIN lịch sự, RST (cổng đóng, hỏng trong mili giây) và SYN không ai trả lời (truyền lại theo hàm mũ rồi hết giờ sau vài phút); vì sao RTT là cái sàn dưới mọi con số độ trễ.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The three-way handshake and connection teardown</h2>
<p class="lead">Your code writes <code>fetch("http://api.labflow.test/")</code> or opens a database connection, and almost always the bytes travel over TCP. But before any byte of your request leaves the machine, two computers that have never spoken must agree to talk — in exactly three packets. This lesson opens one connection in the lab, reads those three packets on the wire, sends a request, and closes it, then shows the two ways a connection can fail instead. By the end, TCP is not a diagram in a textbook; it is something you can point at in a capture.</p>

<div class="callout info">
<p><strong>🎯 Chapter 4 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Read a whole TCP connection in a capture</strong> and tell the handshake, the data, and the teardown apart — SYN, SYN-ACK, ACK, FIN, RST.</li>
<li><strong>Explain why every new connection costs a round trip</strong>, and measure it with <code>curl -w</code>; then show how keep-alive and connection pools remove that cost.</li>
<li><strong>Follow reliability on the wire</strong>: sequence numbers, acknowledgements, retransmission, selective ACK (SACK), and head-of-line blocking at the TCP layer.</li>
<li><strong>Watch congestion control work</strong>: the congestion window growing in slow start, and what Reno, CUBIC and BBR change.</li>
<li><strong>Diagnose connection states</strong>: TIME_WAIT, running out of ephemeral ports, the accept queue (backlog), and the keep-alive / timeout settings in your own code.</li>
</ul>
<p><strong>Why a developer needs this:</strong> TCP sits under HTTP, your PostgreSQL and Redis drivers, gRPC and most message queues. “The API is slow”, “connections drop every night around 2 a.m.”, “we run out of sockets under load”, “the health check passes but real requests hang” are all things you <em>read</em> from a capture and <code>ss</code> once you can see TCP — instead of guessing and restarting. Everything in this chapter is measured on the Chapter 1 lab (client → router → web → api), with a 25 ms delay or a little packet loss added on the router so the effects are visible on a machine where everything is otherwise a millisecond away.</p>
</div>

<h3>Three packets to agree to talk</h3>
<p>TCP gives you an ordered, reliable, two-way stream of bytes. To do that, both ends must track how much the other has received, counted in <strong>sequence numbers</strong>. Before data flows they exchange their starting numbers in a <strong>three-way handshake</strong>:</p>
<ul>
<li>The client sends a <strong>SYN</strong> (synchronise) carrying its initial sequence number <code>x</code>.</li>
<li>The server replies <strong>SYN-ACK</strong>: its own initial number <code>y</code>, plus <code>ack = x+1</code> — “I got yours”.</li>
<li>The client sends <strong>ACK</strong> with <code>ack = y+1</code>. Now both sides know both numbers, and only now may data flow.</li>
</ul>
<p>Start the lab and watch one connection. We add 25 ms of delay to the router’s replies so the round trips are visible:</p>
${cmd('cd lab/moi-truong', 'docker compose -f compose.yml -p nfd up -d          # client, router, web (nginx), api', "docker exec nfd-router tc qdisc add dev eth0 root netem delay 25ms   # 25 ms on replies", 'docker exec -it nfd-client bash')}
${run('c41-tay', 'tcpdump', 1, { max: 11 })}
<ul>
<li><code>Flags [S]</code> is the SYN; <code>[S.]</code> is SYN-ACK (the dot is the ACK flag); <code>[.]</code> alone is a pure ACK. Look at the timestamps: the SYN-ACK comes <strong>25 ms</strong> after the SYN — that gap is the round trip we added.</li>
<li><code>[P.]</code> pushes data: first the client’s <code>GET / HTTP/1.1</code> (length 74), then the server’s <code>HTTP/1.1 200 OK</code>.</li>
<li>Every <code>ack</code> number means “I have everything up to here, send the next byte.” After the SYN, tcpdump prints sequence numbers <em>relative</em> to the start, so the ACK of the SYN shows <code>ack 1</code>.</li>
<li>The last four packets — <code>[F.]</code>, <code>[.]</code>, <code>[F.]</code>, <code>[.]</code> — are the teardown; we come back to them below.</li>
</ul>

<h3>Every new connection costs a round trip</h3>
<p>Because data cannot flow until the third packet, the first byte of your request always waits one full round trip. Measure it: three requests, each on its own connection, with <code>curl -w</code> printing the timing:</p>
${run('c41-rtt', 'for i', 1)}
<p>Each request pays <code>connect ≈ 26 ms</code> — the handshake’s delayed reply — before a single byte of HTTP. <code>ttfb</code> (time to first byte) is about 55 ms: the handshake, then one more round trip for the request and response. On this lab link that is cheap; on a real link to another continent, 150 ms per round trip, it is not.</p>
${net('waterfall', 'cold', 'en', 'A cold request pays DNS, then the TCP handshake, then TLS, before the first byte — walk each phase.', { tour: 'waterfall-phases' })}

<h3>Keep-alive makes the second request almost free</h3>
<p>The fix is to not throw the connection away. HTTP/1.1 keeps a connection open by default; a single <code>curl</code> given several URLs reuses it:</p>
${run('c41-rtt', 'curl -so /dev/null -w "keepalive', 1)}
<p>The first request pays the handshake (<strong>51 ms</strong>); the next two reuse the open connection and drop to <strong>~27 ms</strong> — one round trip, no handshake. This is the whole reason for HTTP keep-alive, browser connection reuse, and the connection pools in your database driver and HTTP client (lesson 4.5). The cheapest handshake is the one you do not do.</p>

<h3>Closing politely: the four-way teardown</h3>
<p>A TCP connection is <strong>full-duplex</strong> — two independent streams — so each direction is closed on its own. Look again at the last packets of the capture above: the client sends <code>[F.]</code> (FIN), the server ACKs it, the server sends its own <code>[F.]</code>, and the client ACKs that. Four packets, two half-closes. The side that sends the first FIN — here the client — then sits in a state called <strong>TIME_WAIT</strong> for about a minute (lesson 4.4). A server can keep streaming a response after the client has stopped sending, precisely because the two directions close separately.</p>

<h3>RST: the port is closed</h3>
<p>If you connect to a port where nothing is listening, the other machine’s kernel does not stay silent — it answers the SYN with a <strong>RST</strong> (reset), and your call fails at once:</p>
${run('c41-reset', 'curl', 1)}
${run('c41-reset', 'ss -tan', 1)}
<p><code>exit=7</code> is “Connection refused”. On the wire it is a single round trip — SYN out, RST back:</p>
${run('c41-resetpcap', 'tcpdump', 1)}
<p>No handshake ever completed, so there is <strong>no TIME_WAIT</strong> and <code>ss</code> shows nothing. A RST is a clear, immediate “no” — the app crashed, the port is wrong, or a firewall is actively rejecting. It is the <em>good</em> kind of failure, because it is fast and unambiguous.</p>

<h3>No answer at all: SYN retransmit, then timeout</h3>
<p>The slow kind of failure is when the SYN is silently dropped — a firewall that blackholes instead of rejecting, or a host that is simply gone. The kernel does not know; it just retransmits the SYN, and backs off. We make the router drop everything to an unused address and watch:</p>
${run('c41-synpcap', 'tcpdump', 1)}
<p>The SYNs go out at ~1 s, then the gaps <strong>double</strong>: 1, 1, 1, 2, 4, 8 seconds. After about two minutes <code>curl</code> gives up with <strong>exit 28</strong> (timeout). This is why a misconfigured security group or a dead backend makes requests “hang” for a long time instead of failing fast — and why your code must set a <strong>connect timeout</strong> (lesson 4.5) rather than trust the kernel’s two-minute default.</p>

<div class="pitfall co-tieu-de">
<p><strong>“Connection refused” vs “connection timed out” are different diagnoses.</strong> Refused (RST, exit 7, milliseconds) means the packet <em>reached</em> a machine and nothing was listening — check the service is up and the port is right. Timed out (exit 28, seconds to minutes) means the SYN never got an answer — check routing, security groups, and firewalls that DROP instead of REJECT. If a health check on the same host passes but requests from outside time out, the difference between these two words is the whole investigation.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>A load balancer’s health check can hide a RST storm.</strong> If your app process dies but the port is reused by something that still accepts and immediately RSTs (or a stale <code>systemd</code> socket), a shallow TCP health check — “can I open a connection?” — may pass while every real request is refused mid-stream. Health-check the application, not just the port; and when you see fast failures, capture one connection (as above) before blaming the network.</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>The handshake is done by the <strong>kernel</strong> when your code calls <code>connect()</code>. Your thread is blocked (or your event loop is waiting) until the ACK arrives — which is why a slow handshake shows up as a blocked request, not CPU work.</li>
<li>The <strong>sequence and ack numbers</strong> are counters in the kernel’s per-socket struct, one per byte of the stream. You never set them; TCP does.</li>
<li><strong>TIME_WAIT</strong> is the kernel holding the 4-tuple for ~60 s after the active close, so a late, duplicated packet from the old connection cannot be mistaken for data on a new one that reuses the same ports.</li>
<li><code>ss -tan</code> reads those socket structs straight from the kernel — the tool you will live in for the rest of this chapter.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', so: '13.2', ten: 'Handshake, reliability, UDP, and reading a real server', giong: 'the three-way handshake (SYN, SYN-ACK, ACK) and that TCP is a reliable ordered stream', khac: 'NWC204 explains it from the Cisco curriculum at a conceptual level in one session', them: 'a real capture read line by line, curl -w measuring the round-trip cost, keep-alive measured, RST vs SYN-timeout as two different diagnoses, and the four-way teardown that leads into TIME_WAIT' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate reports two bugs in one message: “calling <code>https://pay.example/</code> hangs for two minutes then errors, and calling our own <code>:4010</code> service errors instantly.” Your lead wants one sentence of diagnosis for each, with evidence.</p>
<ol>
<li>Start the lab and add <code>tc qdisc add dev eth0 root netem delay 25ms</code> on the router. From <code>nfd-client</code>, capture one <code>curl http://10.10.2.10/</code> with <code>tcpdump -w /tmp/h.pcap</code>, then read it. Mark the SYN, SYN-ACK, ACK, the GET, the response, and the four teardown packets.</li>
<li>Measure the cost: <code>curl -w</code> three separate requests, then three URLs in one <code>curl</code>. Write down <code>time_connect</code> and <code>time_starttransfer</code> for both and explain the difference.</li>
<li>Reproduce both of the teammate’s bugs: <code>curl http://10.10.2.20:4999/</code> (nothing listening → RST) and, after <code>docker exec nfd-router iptables -A FORWARD -d 10.10.2.99 -j DROP</code>, <code>curl --max-time 30 http://10.10.2.99/</code> (black hole → SYN retransmit). Capture each and compare the exit code and the time.</li>
<li>Write the two sentences.</li>
</ol>
<p><strong>Done when:</strong> your capture clearly labels the handshake and teardown, your two measurements show keep-alive removing one round trip, and your two sentences correctly map “instant error” to a closed port (RST) and “two-minute hang” to a dropped SYN (timeout).</p>
<details><summary>Solution</summary>
<p>1) The capture shows <code>[S]</code>, <code>[S.]</code> 25 ms later, <code>[.]</code>, then <code>[P.]</code> GET, the server’s <code>[.]</code>+<code>[P.]</code> 200 OK, and <code>[F.] [.] [F.] [.]</code>. 2) Three separate requests each show <code>connect ≈ 0.026</code>; three URLs in one curl show <code>num_connects=1</code> then <code>0</code> and <code>ttfb</code> falling from ~0.051 to ~0.027 — keep-alive saved the handshake round trip. 3) <code>:4999</code> gives exit 7 in milliseconds and a RST on the wire; <code>:99</code> retransmits SYNs at 1, 2, 4, 8 s and exits 28 after ~2 minutes. 4) “<code>:4010</code> errors instantly because the port is closed — the service is down or on a different port (RST, exit 7). <code>pay.example</code> hangs then times out because the SYN is being dropped, not refused — a firewall or security group is blackholing it (exit 28); set a connect timeout so we fail in seconds, not minutes.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['three-way handshake (bắt tay ba bước)', 'SYN → SYN-ACK → ACK: the exchange that opens a TCP connection before any data.'],
  ['sequence number (số thứ tự)', 'A per-byte counter each side starts at a random value and tells the other in the handshake.'],
  ['ACK (báo nhận)', '“I have received everything up to byte N” — carried on almost every packet.'],
  ['RTT — round-trip time (thời gian khứ hồi)', 'Time for a packet to reach the other end and its reply to come back; the floor under latency.'],
  ['FIN (kết thúc)', 'A flag that half-closes one direction of the stream; both directions close independently.'],
  ['RST (đặt lại)', 'An abrupt reset — “no connection here” — sent when a port is closed or a connection is torn down.'],
  ['TIME_WAIT (chờ tàn)', 'The ~60 s wait on the side that closed first, so stale packets cannot leak into a new connection.'],
  ['keep-alive (giữ kết nối)', 'Reusing one open connection for several requests, skipping the handshake each time.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Three packets — SYN, SYN-ACK, ACK — open a connection; data cannot flow until the third, so the first byte waits one round trip (~26 ms of <code>connect</code> in the lab).</li>
<li>Keep-alive reuses the connection: the second and third requests fell from 51 ms to ~27 ms by skipping the handshake.</li>
<li>Connections close with a four-way FIN exchange; the active closer waits in TIME_WAIT.</li>
<li>A closed port answers with RST — “refused”, exit 7, milliseconds. A dropped SYN retransmits (1, 2, 4, 8 s) and times out — exit 28, minutes. The symptom names the cause.</li>
<li>RTT is the floor under every latency number; fewer connections and pooling beat any micro-optimisation.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9293', '📄', 'RFC 9293 — Transmission Control Protocol (2022)', 'The current TCP specification: the state machine, the handshake, sequence numbers and teardown.', 'Open')}
${L('https://www.ietf.org/archive/id/draft-ietf-tcpm-rfc793bis-28.html', '📄', 'TCP state diagram', 'LISTEN → SYN-SENT → ESTABLISHED → FIN-WAIT → TIME_WAIT, drawn out.', 'Open')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', '📘', 'Wireshark — Follow TCP Stream', 'Read a whole connection the way this lesson reads the tcpdump capture.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Connection_management_in_HTTP_1.x', '📘', 'MDN — Connection management in HTTP/1.x', 'Keep-alive and why reusing connections matters, from the browser’s side.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Bắt tay ba bước và đóng kết nối</h2>
<p class="lead">Code của bạn ghi <code>fetch("http://api.labflow.test/")</code> hay mở một kết nối cơ sở dữ liệu, và gần như luôn luôn các byte đó đi trên TCP. Nhưng trước khi một byte nào của yêu cầu rời khỏi máy, hai máy tính chưa từng nói chuyện phải đồng ý nói — bằng đúng ba gói tin. Bài này mở một kết nối trong lab, đọc ba gói đó trên dây, gửi một yêu cầu, rồi đóng lại, sau đó chỉ ra hai cách một kết nối có thể hỏng. Hết bài, TCP không còn là một sơ đồ trong sách; nó là thứ bạn chỉ tay được trong bản bắt gói.</p>

<div class="callout info">
<p><strong>🎯 Chương 4 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Đọc trọn một kết nối TCP trong bản bắt gói</strong> và phân biệt được cú bắt tay, phần dữ liệu và phần đóng — SYN, SYN-ACK, ACK, FIN, RST.</li>
<li><strong>Giải thích vì sao mỗi kết nối mới tốn một vòng khứ hồi</strong>, và đo bằng <code>curl -w</code>; rồi chỉ ra keep-alive và pool kết nối bỏ được chi phí đó thế nào.</li>
<li><strong>Theo độ tin cậy trên dây</strong>: số thứ tự, báo nhận, truyền lại, báo nhận chọn lọc (SACK) và nghẽn đầu hàng (head-of-line) ở tầng TCP.</li>
<li><strong>Xem kiểm soát tắc nghẽn làm việc</strong>: cửa sổ tắc nghẽn lớn dần trong slow start, và Reno, CUBIC, BBR đổi điều gì.</li>
<li><strong>Chẩn đoán trạng thái kết nối</strong>: TIME_WAIT, cạn cổng tạm, hàng đợi accept (backlog), và các thiết lập keep-alive / timeout trong chính code của bạn.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> TCP nằm dưới HTTP, dưới driver PostgreSQL và Redis của bạn, dưới gRPC và phần lớn hàng đợi tin nhắn. “API chậm”, “kết nối rớt mỗi đêm khoảng 2 giờ sáng”, “hết socket khi tải cao”, “health check xanh mà yêu cầu thật thì treo” đều là thứ bạn <em>đọc</em> ra từ bản bắt gói và <code>ss</code> một khi thấy được TCP — thay vì đoán rồi khởi động lại. Mọi thứ trong chương này đều đo trên lab Chương 1 (client → router → web → api), có thêm 25 ms trễ hoặc một chút mất gói đặt ở router để các hiệu ứng hiện ra trên một máy mà mọi thứ vốn chỉ cách nhau một mili giây.</p>
</div>

<h3>Ba gói để đồng ý nói chuyện</h3>
<p>TCP cho bạn một luồng byte hai chiều, có thứ tự, đáng tin cậy. Để làm được vậy, cả hai đầu phải theo dõi bên kia đã nhận tới đâu, đếm bằng <strong>số thứ tự (sequence number)</strong>. Trước khi dữ liệu chảy, chúng trao số khởi đầu của nhau trong một <strong>cú bắt tay ba bước</strong>:</p>
<ul>
<li>Client gửi <strong>SYN</strong> (synchronise — đồng bộ) mang số thứ tự khởi đầu <code>x</code> của nó.</li>
<li>Máy chủ trả <strong>SYN-ACK</strong>: số khởi đầu <code>y</code> của chính nó, cộng <code>ack = x+1</code> — “tôi nhận được số của anh”.</li>
<li>Client gửi <strong>ACK</strong> với <code>ack = y+1</code>. Giờ cả hai bên biết cả hai số, và chỉ bây giờ dữ liệu mới được chảy.</li>
</ul>
<p>Dựng lab và xem một kết nối. Ta thêm 25 ms trễ vào chiều hồi đáp của router để thấy được các vòng khứ hồi:</p>
${cmd('cd lab/moi-truong', 'docker compose -f compose.yml -p nfd up -d          # client, router, web (nginx), api', "docker exec nfd-router tc qdisc add dev eth0 root netem delay 25ms   # 25 ms cho chiều hồi đáp", 'docker exec -it nfd-client bash')}
${run('c41-tay', 'tcpdump', 1, { max: 11 })}
<ul>
<li><code>Flags [S]</code> là SYN; <code>[S.]</code> là SYN-ACK (dấu chấm là cờ ACK); <code>[.]</code> đứng một mình là ACK thuần. Nhìn mốc thời gian: SYN-ACK về <strong>25 ms</strong> sau SYN — khoảng cách đó chính là vòng khứ hồi ta vừa thêm.</li>
<li><code>[P.]</code> đẩy dữ liệu: trước là <code>GET / HTTP/1.1</code> của client (dài 74), rồi <code>HTTP/1.1 200 OK</code> của máy chủ.</li>
<li>Mỗi số <code>ack</code> nghĩa là “tôi đã nhận đủ tới đây, gửi byte kế tiếp đi”. Sau SYN, tcpdump in số thứ tự <em>tương đối</em> so với lúc bắt đầu, nên ACK của SYN hiện <code>ack 1</code>.</li>
<li>Bốn gói cuối — <code>[F.]</code>, <code>[.]</code>, <code>[F.]</code>, <code>[.]</code> — là phần đóng; ta quay lại ngay dưới.</li>
</ul>

<h3>Mỗi kết nối mới tốn một vòng khứ hồi</h3>
<p>Vì dữ liệu không được chảy tới khi có gói thứ ba, byte đầu tiên của yêu cầu luôn chờ trọn một vòng khứ hồi. Đo nó: ba yêu cầu, mỗi cái một kết nối riêng, với <code>curl -w</code> in thời gian:</p>
${run('c41-rtt', 'for i', 1)}
<p>Mỗi yêu cầu trả <code>connect ≈ 26 ms</code> — chiều hồi đáp bị trễ của cú bắt tay — trước một byte HTTP nào. <code>ttfb</code> (thời gian tới byte đầu) khoảng 55 ms: cú bắt tay, rồi thêm một vòng khứ hồi cho yêu cầu và câu trả lời. Trên đường lab này thì rẻ; trên một đường thật tới châu lục khác, 150 ms mỗi vòng, thì không.</p>
${net('waterfall', 'cold', 'vi', 'Một yêu cầu lạnh trả DNS, rồi cú bắt tay TCP, rồi TLS, trước byte đầu — đi qua từng pha.', { tour: 'waterfall-phases' })}

<h3>Keep-alive làm yêu cầu thứ hai gần như miễn phí</h3>
<p>Cách sửa là đừng vứt kết nối đi. HTTP/1.1 mặc định giữ kết nối mở; một lần <code>curl</code> đưa nhiều URL sẽ dùng lại nó:</p>
${run('c41-rtt', 'curl -so /dev/null -w "keepalive', 1)}
<p>Yêu cầu đầu trả cú bắt tay (<strong>51 ms</strong>); hai cái sau dùng lại kết nối đang mở và tụt xuống <strong>~27 ms</strong> — một vòng khứ hồi, không bắt tay. Đây là toàn bộ lý do có keep-alive của HTTP, có việc trình duyệt dùng lại kết nối, và có pool kết nối trong driver cơ sở dữ liệu và HTTP client của bạn (bài 4.5). Cú bắt tay rẻ nhất là cú bạn không phải làm.</p>

<h3>Đóng lịch sự: bốn bước FIN</h3>
<p>Một kết nối TCP là <strong>song công (full-duplex)</strong> — hai luồng độc lập — nên mỗi chiều tự đóng riêng. Nhìn lại các gói cuối của bản bắt gói trên: client gửi <code>[F.]</code> (FIN), máy chủ báo nhận, máy chủ gửi <code>[F.]</code> của nó, và client báo nhận. Bốn gói, hai nửa-đóng. Bên gửi FIN đầu tiên — ở đây là client — rồi ngồi trong một trạng thái tên là <strong>TIME_WAIT</strong> khoảng một phút (bài 4.4). Máy chủ có thể tiếp tục chảy câu trả lời sau khi client đã ngừng gửi, chính vì hai chiều đóng tách nhau.</p>

<h3>RST: cổng đã đóng</h3>
<p>Nếu bạn kết nối tới một cổng không ai nghe, nhân của máy kia không im lặng — nó trả lời SYN bằng một <strong>RST</strong> (reset — đặt lại), và lời gọi của bạn hỏng ngay:</p>
${run('c41-reset', 'curl', 1)}
${run('c41-reset', 'ss -tan', 1)}
<p><code>exit=7</code> là “Connection refused”. Trên dây nó chỉ là một vòng — SYN đi ra, RST quay về:</p>
${run('c41-resetpcap', 'tcpdump', 1)}
<p>Không cú bắt tay nào hoàn tất, nên <strong>không có TIME_WAIT</strong> và <code>ss</code> không thấy gì. RST là một lời “không” rõ ràng, tức thì — ứng dụng đã sập, sai cổng, hoặc một tường lửa đang chủ động từ chối. Đó là kiểu hỏng <em>tốt</em>, vì nó nhanh và không mập mờ.</p>

<h3>Không ai trả lời: SYN truyền lại, rồi hết giờ</h3>
<p>Kiểu hỏng chậm là khi SYN bị vứt âm thầm — một tường lửa chặn mà không từ chối, hoặc một máy đã biến mất. Nhân không biết; nó cứ truyền lại SYN, và giãn ra. Ta cho router vứt mọi gói tới một địa chỉ không dùng và xem:</p>
${run('c41-synpcap', 'tcpdump', 1)}
<p>Các SYN đi ra cách ~1 s, rồi các khoảng cách <strong>gấp đôi</strong>: 1, 1, 1, 2, 4, 8 giây. Sau chừng hai phút <code>curl</code> bỏ cuộc với <strong>exit 28</strong> (hết giờ). Đây là lý do một security group cấu hình sai hay một backend chết làm yêu cầu “treo” lâu thay vì hỏng nhanh — và là lý do code của bạn phải đặt <strong>connect timeout</strong> (bài 4.5) chứ đừng tin mức mặc định hai phút của nhân.</p>

<div class="pitfall co-tieu-de">
<p><strong>“Connection refused” và “connection timed out” là hai chẩn đoán khác nhau.</strong> Refused (RST, exit 7, vài mili giây) nghĩa là gói <em>đã tới</em> một máy và không ai nghe — kiểm dịch vụ có chạy không và cổng có đúng không. Timed out (exit 28, vài giây tới vài phút) nghĩa là SYN không hề có câu trả lời — kiểm định tuyến, security group, và tường lửa DROP thay vì REJECT. Nếu một health check trên cùng máy chủ xanh mà yêu cầu từ ngoài thì hết giờ, sự khác nhau giữa hai từ này chính là toàn bộ cuộc điều tra.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Health check của bộ cân bằng tải có thể che một cơn RST.</strong> Nếu tiến trình ứng dụng chết nhưng cổng bị thứ khác giữ mà vẫn accept rồi RST ngay (hoặc một socket <code>systemd</code> cũ còn sót), một health check TCP nông — “mở được kết nối không?” — có thể xanh trong khi mọi yêu cầu thật bị từ chối giữa chừng. Hãy health-check cả ứng dụng, không chỉ cổng; và khi thấy hỏng nhanh, bắt một kết nối (như trên) trước khi đổ cho mạng.</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Cú bắt tay do <strong>nhân</strong> làm khi code của bạn gọi <code>connect()</code>. Luồng của bạn bị chặn (hoặc vòng lặp sự kiện đang chờ) tới khi ACK về — vì thế một cú bắt tay chậm hiện ra như một yêu cầu bị chặn, không phải việc CPU.</li>
<li><strong>Số thứ tự và ack</strong> là bộ đếm trong cấu trúc socket của nhân, mỗi byte của luồng một số. Bạn không bao giờ đặt chúng; TCP làm.</li>
<li><strong>TIME_WAIT</strong> là việc nhân giữ bộ-4 (4-tuple) khoảng 60 s sau lần đóng chủ động, để một gói cũ bị trùng lặp của kết nối cũ không bị nhầm thành dữ liệu của một kết nối mới dùng lại cùng các cổng.</li>
<li><code>ss -tan</code> đọc các cấu trúc socket đó thẳng từ nhân — công cụ bạn sẽ sống trong đó suốt phần còn lại của chương.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', so: '13.2', ten: 'Bắt tay, tính tin cậy, UDP, và đọc một máy chủ thật', giong: 'cú bắt tay ba bước (SYN, SYN-ACK, ACK) và việc TCP là luồng byte có thứ tự, đáng tin', khac: 'NWC204 giải thích theo giáo trình Cisco ở mức khái niệm trong một buổi', them: 'một bản bắt gói đọc từng dòng, curl -w đo chi phí khứ hồi, keep-alive đo được, RST khác SYN-timeout là hai chẩn đoán, và bốn bước FIN dẫn vào TIME_WAIT' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một đồng nghiệp báo hai lỗi trong một tin nhắn: “gọi <code>https://pay.example/</code> treo hai phút rồi báo lỗi, còn gọi dịch vụ <code>:4010</code> của mình thì lỗi ngay lập tức.” Trưởng nhóm muốn một câu chẩn đoán cho mỗi lỗi, kèm bằng chứng.</p>
<ol>
<li>Dựng lab và thêm <code>tc qdisc add dev eth0 root netem delay 25ms</code> trên router. Từ <code>nfd-client</code>, bắt một <code>curl http://10.10.2.10/</code> bằng <code>tcpdump -w /tmp/h.pcap</code>, rồi đọc lại. Đánh dấu SYN, SYN-ACK, ACK, GET, câu trả lời, và bốn gói đóng.</li>
<li>Đo chi phí: <code>curl -w</code> ba yêu cầu riêng, rồi ba URL trong một lần <code>curl</code>. Ghi <code>time_connect</code> và <code>time_starttransfer</code> cho cả hai và giải thích khác biệt.</li>
<li>Dựng lại cả hai lỗi của đồng nghiệp: <code>curl http://10.10.2.20:4999/</code> (không ai nghe → RST) và, sau <code>docker exec nfd-router iptables -A FORWARD -d 10.10.2.99 -j DROP</code>, chạy <code>curl --max-time 30 http://10.10.2.99/</code> (hố đen → SYN truyền lại). Bắt gói từng cái và so mã thoát với thời gian.</li>
<li>Viết hai câu.</li>
</ol>
<p><strong>Đạt khi:</strong> bản bắt gói của bạn gọi tên rõ cú bắt tay và phần đóng, hai phép đo cho thấy keep-alive bỏ được một vòng khứ hồi, và hai câu của bạn ánh xạ đúng “lỗi ngay” sang cổng đóng (RST) và “treo hai phút” sang SYN bị vứt (timeout).</p>
<details><summary>Lời giải</summary>
<p>1) Bản bắt gói cho thấy <code>[S]</code>, <code>[S.]</code> 25 ms sau, <code>[.]</code>, rồi <code>[P.]</code> GET, <code>[.]</code>+<code>[P.]</code> 200 OK của máy chủ, và <code>[F.] [.] [F.] [.]</code>. 2) Ba yêu cầu riêng mỗi cái <code>connect ≈ 0,026</code>; ba URL trong một curl hiện <code>num_connects=1</code> rồi <code>0</code> và <code>ttfb</code> tụt từ ~0,051 xuống ~0,027 — keep-alive tiết kiệm vòng khứ hồi của cú bắt tay. 3) <code>:4999</code> cho exit 7 trong mili giây và một RST trên dây; <code>:99</code> truyền lại SYN ở 1, 2, 4, 8 s và exit 28 sau ~2 phút. 4) “<code>:4010</code> lỗi ngay vì cổng đóng — dịch vụ đã tắt hoặc ở cổng khác (RST, exit 7). <code>pay.example</code> treo rồi hết giờ vì SYN bị vứt, không phải bị từ chối — một tường lửa hay security group đang chặn im (exit 28); hãy đặt connect timeout để hỏng trong vài giây, không phải vài phút.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['three-way handshake (bắt tay ba bước)', 'SYN → SYN-ACK → ACK: cuộc trao đổi mở một kết nối TCP trước mọi dữ liệu.'],
  ['sequence number (số thứ tự)', 'Bộ đếm theo từng byte, mỗi bên khởi đầu bằng một giá trị ngẫu nhiên và báo cho bên kia trong cú bắt tay.'],
  ['ACK (báo nhận)', '“Tôi đã nhận đủ tới byte N” — gắn trên gần như mọi gói.'],
  ['RTT — round-trip time (thời gian khứ hồi)', 'Thời gian một gói tới đầu kia và câu trả lời quay về; cái sàn dưới độ trễ.'],
  ['FIN (kết thúc)', 'Cờ nửa-đóng một chiều của luồng; hai chiều đóng độc lập.'],
  ['RST (đặt lại)', 'Một lần reset đột ngột — “không có kết nối ở đây” — gửi khi cổng đóng hoặc kết nối bị cắt.'],
  ['TIME_WAIT (chờ tàn)', 'Khoảng chờ ~60 s ở bên đóng trước, để gói cũ không lọt vào một kết nối mới.'],
  ['keep-alive (giữ kết nối)', 'Dùng lại một kết nối đang mở cho nhiều yêu cầu, bỏ cú bắt tay mỗi lần.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba gói — SYN, SYN-ACK, ACK — mở một kết nối; dữ liệu không chảy tới gói thứ ba, nên byte đầu chờ một vòng khứ hồi (~26 ms <code>connect</code> trong lab).</li>
<li>Keep-alive dùng lại kết nối: yêu cầu thứ hai và thứ ba tụt từ 51 ms xuống ~27 ms nhờ bỏ cú bắt tay.</li>
<li>Kết nối đóng bằng bốn bước FIN; bên đóng chủ động ngồi trong TIME_WAIT.</li>
<li>Cổng đóng trả RST — “refused”, exit 7, vài mili giây. SYN bị vứt thì truyền lại (1, 2, 4, 8 s) rồi hết giờ — exit 28, vài phút. Triệu chứng gọi tên nguyên nhân.</li>
<li>RTT là cái sàn dưới mọi con số độ trễ; ít kết nối và pool thắng mọi tối ưu vặt.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9293', '📄', 'RFC 9293 — Giao thức điều khiển truyền (2022)', 'Đặc tả TCP hiện hành: máy trạng thái, cú bắt tay, số thứ tự và phần đóng.', 'Mở')}
${L('https://www.ietf.org/archive/id/draft-ietf-tcpm-rfc793bis-28.html', '📄', 'Sơ đồ trạng thái TCP', 'LISTEN → SYN-SENT → ESTABLISHED → FIN-WAIT → TIME_WAIT, vẽ ra đầy đủ.', 'Mở')}
${L('https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', '📘', 'Wireshark — Follow TCP Stream', 'Đọc trọn một kết nối đúng cách bài này đọc bản bắt gói tcpdump.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Connection_management_in_HTTP_1.x', '📘', 'MDN — Quản lý kết nối trong HTTP/1.x', 'Keep-alive và vì sao dùng lại kết nối quan trọng, nhìn từ phía trình duyệt.', 'Mở')}
</div>
`,
};
