/**
 * Chương 5 · 5.1 — UDP: gửi rồi quên (slug khung netdev-5-1-udp). Bài MỞ CHƯƠNG 5:
 * khối "🎯 Chương 5 trong một khung" ở đầu bài đọc. Lab cơ bản (compose.yml, project nfd).
 * Output thật: lab/out/c51-*.out.txt (dựng lại: bash lab/code/dung-output-ch5.sh).
 */
import { run, card, kv, cauNoi, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-05-1.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '5.1 — UDP: fire and forget|||5.1 — UDP: gửi rồi quên',
  slug: 'netdev-5-1-udp',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 5: UDP là lớp bọc mỏng nhất trên IP — không bắt tay, không thứ tự, không truyền lại; đọc một trao đổi UDP trên dây (chỉ datagram, không SYN); đo mất gói (20 gói qua 30% mất, 12 tới, không ai truyền lại); socket UDP luôn UNCONN (không TIME_WAIT, không cạn cổng); khi nào UDP thắng (DNS, VoIP, game, video trực tiếp) và việc ứng dụng phải tự làm — dẫn vào QUIC.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>UDP: fire and forget</h2>
<p class="lead">Chapter 4 was four lessons about everything TCP does for you — the handshake, reliable ordered delivery, flow and congestion control. This chapter is about a protocol that does almost none of it. UDP adds a few bytes to a raw IP packet and sends it; there is no connection, no acknowledgement, no retransmission. For a surprising number of things — DNS, voice and video calls, games, live streaming, and the QUIC transport under HTTP/3 — that is not a weakness but the whole point. This lesson reads a UDP exchange on the wire, measures what happens to lost packets, and shows what your application must do when TCP is no longer doing it for you.</p>

<div class="callout info">
<p><strong>🎯 Chapter 5 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Read a UDP exchange</strong> and explain, from the packets, why it has no handshake, no ordering and no retransmission.</li>
<li><strong>Say when UDP is the right choice</strong> — DNS, VoIP, games, live video — and name the work the application must do itself (ordering, loss handling, pacing).</li>
<li><strong>Explain QUIC</strong>: a reliable, multiplexed, encrypted transport rebuilt on top of UDP, with TLS 1.3 folded into the handshake, and why it removes TCP’s head-of-line blocking.</li>
<li><strong>Show HTTP/3 discovery and the server side</strong>: the <code>Alt-Svc</code> header that advertises <code>h3</code>, and a real nginx listening for QUIC on UDP 443.</li>
<li><strong>Diagnose when QUIC is blocked</strong> (a network that drops UDP 443) and watch the browser fall back to TCP/HTTP-2 without the user noticing.</li>
</ul>
<p><strong>Why a developer needs this:</strong> you already use UDP without knowing it — every DNS lookup (Chapter 3) rides it, and so does every HTTP/3 request. Choosing between TCP and UDP for a real-time feature, understanding why a video call degrades gracefully while a download stalls, and debugging “HTTP/3 works on my phone but not on the office Wi-Fi” all come down to what is in this chapter. Everything is measured on the base lab, with a small UDP server, a little packet loss, and a real HTTP/3 nginx.</p>
</div>

<h3>The deal: UDP gives you almost nothing</h3>
<p>UDP (User Datagram Protocol) is the thinnest possible layer over IP. Its header is <strong>8 bytes</strong>: source port, destination port, length, checksum — then your payload. That is all. Everything TCP spent Chapter 4 doing, UDP leaves undone:</p>
<table>
<tr><th></th><th>TCP</th><th>UDP</th></tr>
<tr><td>Handshake</td><td>3 packets before any data</td><td><strong>none</strong> — the first packet is data</td></tr>
<tr><td>Delivery</td><td>reliable (retransmits lost data)</td><td><strong>best effort</strong> — lost is lost</td></tr>
<tr><td>Ordering</td><td>an in-order byte stream</td><td><strong>none</strong> — datagrams, any order</td></tr>
<tr><td>Connection state</td><td>ESTABLISHED, TIME_WAIT, …</td><td><strong>none</strong> — just an open socket</td></tr>
<tr><td>Flow/congestion control</td><td>built in</td><td><strong>none</strong> — you can flood the link</td></tr>
</table>
<p>This is not a worse TCP; it is a different tool. When you want to do the reliability yourself (or not at all), UDP gets out of your way.</p>
${net('socket', 'demux', 'en', 'Ports demultiplex datagrams to the right program — the one thing UDP and TCP share. Follow a packet to its socket.', { tour: 'socket-demux' })}

<h3>Fire and forget: a UDP exchange on the wire</h3>
<p>Start a tiny UDP echo server in the lab and send it one datagram:</p>
${cmd('docker exec -d nfd-web node /lab/k/code/ch05/udp-srv.mjs    # a UDP echo on 10.10.2.10:9999', 'docker exec -it nfd-client bash')}
${run('c51-echo', 'printf', 1)}
<p>Now look at that exchange on the wire — we captured it with <code>tcpdump</code>:</p>
${run('c51-wire', 'tcpdump', 1)}
<p>Three datagrams, no handshake: the request (<code>length 4</code>), a zero-length datagram as <code>socat</code> closes, and the reply (<code>length 13</code>). There is no <code>[S]</code>, <code>[S.]</code>, <code>[.]</code> — nothing like the ten packets of lesson 4.1. The first packet carries your data, and the reply is simply another independent datagram. If you only need to send one small thing and maybe get one back, UDP does it in one round trip with zero setup.</p>

<h3>Loss just happens, and nobody tells you</h3>
<p>Add 30% packet loss and send 20 datagrams. The server counts how many actually arrived:</p>
${run('c51-loss', 'node udp-send', 1)}
<p>Twenty sent, <strong>twelve received</strong>. The eight lost datagrams are simply <strong>gone</strong> — there is no ACK, no retransmission, and <em>the sender never finds out</em>. This is the defining property of UDP: it will not lift a finger to recover a lost packet. If your application needs reliability, your application has to notice the gap and ask again. If it does <em>not</em> need every packet — a video frame, a position update — then UDP has saved you the cost of recovering data you would have thrown away anyway.</p>

<div class="pitfall co-tieu-de">
<p><strong>UDP is not “unreliable” in the sense of broken — it is “best effort”.</strong> On a healthy local network, UDP delivery is nearly perfect; loss shows up under congestion, over the public Internet, or on bad Wi-Fi. The mistake is assuming UDP datagrams always arrive (they do in testing, then vanish in production), or assuming they <em>never</em> do. Design for “most arrive, some do not, order is not guaranteed” — and measure.</p>
</div>

<h3>No connection means no state to leak</h3>
<p>A UDP socket has no handshake, so there is no connection for the kernel to track. Look at the server socket:</p>
${run('c51-noconn', 'ss -ulnp', 1)}
${run('c51-noconn', 'ss -tlnp', 1)}
<p>The UDP socket is <strong>UNCONN</strong> — it came into being the moment the program called <code>bind()</code>, with no negotiation. There is <strong>no TIME_WAIT</strong>, no accept queue, and no port exhaustion from churn (all of lesson 4.4 simply does not apply). One UDP socket can receive from and send to thousands of different peers, which is exactly why a single DNS server or game server can handle enormous numbers of clients from one socket. (A UDP socket <em>can</em> call <code>connect()</code> to fix a default peer, but that only sets a destination — it is still no handshake and no connection on the wire.)</p>

<h3>Where UDP wins</h3>
<p>The pattern is simple: <strong>when fresh-but-lossy beats complete-but-late, UDP wins</strong>, and TCP’s reliability turns into a liability.</p>
<ul>
<li><strong>DNS</strong> (Chapter 3): one small question, one small answer. A TCP handshake would double the cost of every lookup. The app retries on loss, and switches to TCP only if the answer is too big for one datagram.</li>
<li><strong>Voice and video calls</strong>: a voice packet that arrives late is useless — the moment it was for has passed. Better to skip it and keep the conversation going. The app adds a jitter buffer and loss concealment.</li>
<li><strong>Games</strong>: only the latest position matters; retransmitting an old one would just add lag. The app numbers packets and interpolates.</li>
<li><strong>Live video</strong>: drop a frame rather than freeze the stream. Forward error correction and adaptive bitrate live in the app.</li>
</ul>
<p>In every case the application takes back exactly the responsibilities TCP would have handled — which is a lot of work, and the reason the next lesson exists.</p>

<div class="pitfall co-tieu-de">
<p><strong>Do not reinvent TCP badly on top of UDP.</strong> Teams reach for UDP for “speed”, then slowly re-add sequence numbers, ACKs, retransmission and congestion control — and get a worse, buggier TCP. If you need reliable, ordered, congestion-controlled delivery, you want TCP, or <strong>QUIC</strong> (lesson 5.2), which is precisely “all of that, done once, correctly, on UDP.” Use raw UDP only when you genuinely want best-effort and will handle loss in a domain-specific way (a jitter buffer, FEC, last-write-wins).</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>The socket is a <strong>datagram socket</strong> (<code>SOCK_DGRAM</code>): <code>sendto()</code> and <code>recvfrom()</code> each move exactly one datagram, with message boundaries preserved — unlike TCP’s byte stream, where your <code>read()</code> may return a fragment of one message or two messages stuck together.</li>
<li>The <strong>kernel keeps no per-peer state</strong>: there is no connection table entry, so <code>ss -u</code> shows only the socket, always UNCONN.</li>
<li>The <strong>8-byte header</strong> is fixed; there are no options, no window, no sequence numbers. A dropped datagram is tracked nowhere — detecting loss is the application’s job.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', so: '13.2', ten: 'Handshake, reliability, UDP, and reading a real server', giong: 'UDP is connectionless and unreliable, used by DNS and real-time media, unlike TCP', khac: 'NWC204 contrasts TCP and UDP at a conceptual level in one session', them: 'a UDP exchange captured on the wire (no handshake), measured loss where the sender never finds out, a UNCONN socket with no TIME_WAIT, and the design pressure that leads to QUIC' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate proposes sending telemetry (one position update per 50 ms) over a fresh TCP connection each time “because TCP is reliable.” Show, in the lab, why UDP fits this better and what the app would still need to add.</p>
<ol>
<li>Start the UDP echo server and send one datagram with <code>socat - UDP:10.10.2.10:9999</code>. Capture it and confirm there is no handshake.</li>
<li>Add <code>tc qdisc add dev eth0 root netem loss 30%</code> on <code>nfd-client</code>, run <code>node udp-send.mjs</code>, and record how many of 20 datagrams the server received and whether the sender was told.</li>
<li>Run <code>ss -uanp</code> and <code>ss -tan</code> and contrast: how many connection states does the UDP side have?</li>
<li>Write three sentences: why UDP fits 50 ms telemetry, what is lost under 30% loss, and what the app should add (e.g. a sequence number so a receiver can drop stale updates).</li>
</ol>
<p><strong>Done when:</strong> your capture shows a handshake-free exchange, your loss run shows some datagrams silently dropped, and your sentences correctly argue that “only the latest position matters” makes best-effort UDP the right choice — with a sequence number to discard out-of-order stale updates.</p>
<details><summary>Solution</summary>
<p>The capture shows just UDP datagrams, no SYN. Under 30% loss the server receives ~12–14 of 20 and the sender gets no error. <code>ss -u</code> shows UNCONN only, no ESTABLISHED/TIME_WAIT. Sentences: “For 50 ms telemetry, only the newest position matters, so a dropped update is simply replaced by the next one — exactly what UDP’s best-effort delivery gives, without a per-message handshake. Under loss some updates vanish silently, which is fine here. The app should add a sequence number so the receiver can ignore an update that arrives out of order after a newer one.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['UDP — User Datagram Protocol (giao thức gói dữ liệu người dùng)', 'A thin transport over IP: ports + length + checksum, no connection or reliability.'],
  ['datagram (gói dữ liệu)', 'One self-contained UDP message; boundaries are preserved, unlike a TCP byte stream.'],
  ['best effort (nỗ lực tối đa)', 'Delivery is attempted but not guaranteed; lost datagrams are not recovered.'],
  ['connectionless (không kết nối)', 'No handshake and no per-peer state; a socket can talk to many peers.'],
  ['fire and forget (gửi rồi quên)', 'Send a datagram and move on; no ACK, no retransmission, no notification of loss.'],
  ['SOCK_DGRAM', 'The datagram socket type; sendto/recvfrom move one message each.'],
  ['jitter buffer (bộ đệm chống giật)', 'An app-side buffer that smooths out variable arrival times for media.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>UDP is the thinnest wrapper over IP — ports, length, checksum — with no handshake, ordering or retransmission.</li>
<li>On the wire it is just datagrams; 20 sent through 30% loss, 12 arrived, and the sender never knew.</li>
<li>A UDP socket is always UNCONN: no TIME_WAIT, no accept queue, no port exhaustion; one socket, many peers.</li>
<li>UDP wins when fresh-but-lossy beats complete-but-late: DNS, VoIP, games, live video.</li>
<li>Anything TCP did for you, your app must do — and doing it well on UDP is what QUIC is (lesson 5.2).</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc768', '📄', 'RFC 768 — User Datagram Protocol (1980)', 'The whole of UDP in three pages: the 8-byte header and nothing else.', 'Open')}
${L('https://developer.mozilla.org/docs/Glossary/UDP', '📘', 'MDN — UDP', 'A short developer-facing introduction and where it is used.', 'Open')}
${L('https://nodejs.org/api/dgram.html', '📄', 'Node.js — dgram (UDP) module', 'createSocket, send, and the message/bind events used in this lesson.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8085', '📄', 'RFC 8085 — UDP Usage Guidelines', 'What an application must add (congestion control, loss handling) when it uses UDP.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>UDP: gửi rồi quên</h2>
<p class="lead">Chương 4 là bốn bài về mọi thứ TCP làm cho bạn — cú bắt tay, giao hàng đáng tin có thứ tự, kiểm soát luồng và tắc nghẽn. Chương này nói về một giao thức gần như không làm gì cả. UDP thêm vài byte vào một gói IP thô rồi gửi đi; không có kết nối, không báo nhận, không truyền lại. Với một số lượng đáng ngạc nhiên các thứ — DNS, cuộc gọi thoại và video, game, phát trực tiếp, và tầng vận chuyển QUIC dưới HTTP/3 — đó không phải điểm yếu mà là toàn bộ ý nghĩa. Bài này đọc một trao đổi UDP trên dây, đo chuyện gì xảy ra với gói mất, và chỉ ra ứng dụng của bạn phải làm gì khi TCP không còn làm hộ nữa.</p>

<div class="callout info">
<p><strong>🎯 Chương 5 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Đọc một trao đổi UDP</strong> và giải thích, từ các gói, vì sao nó không có bắt tay, không thứ tự và không truyền lại.</li>
<li><strong>Nói được khi nào UDP là lựa chọn đúng</strong> — DNS, VoIP, game, video trực tiếp — và gọi tên việc ứng dụng phải tự làm (thứ tự, xử lý mất gói, nhịp gửi).</li>
<li><strong>Giải thích QUIC</strong>: một tầng vận chuyển đáng tin, ghép kênh, mã hoá, dựng lại trên UDP, với TLS 1.3 gộp vào cú bắt tay, và vì sao nó bỏ được nghẽn đầu hàng của TCP.</li>
<li><strong>Cho thấy khám phá HTTP/3 và phía máy chủ</strong>: header <code>Alt-Svc</code> quảng cáo <code>h3</code>, và một nginx thật nghe QUIC trên UDP 443.</li>
<li><strong>Chẩn đoán khi QUIC bị chặn</strong> (một mạng vứt UDP 443) và xem trình duyệt lùi về TCP/HTTP-2 mà người dùng không thấy.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> bạn đã dùng UDP mà không biết — mỗi lần tra DNS (Chương 3) đều đi trên nó, và mỗi yêu cầu HTTP/3 cũng vậy. Chọn giữa TCP và UDP cho một tính năng thời gian thực, hiểu vì sao một cuộc gọi video xuống cấp êm ái trong khi một lần tải bị kẹt, và gỡ lỗi “HTTP/3 chạy trên điện thoại mà không chạy trên Wi-Fi văn phòng” đều về những gì trong chương này. Mọi thứ đều đo trên lab cơ bản, với một máy chủ UDP nhỏ, một chút mất gói, và một nginx HTTP/3 thật.</p>
</div>

<h3>Giao kèo: UDP cho bạn gần như không gì cả</h3>
<p>UDP (User Datagram Protocol — giao thức gói dữ liệu người dùng) là lớp mỏng nhất có thể trên IP. Header của nó là <strong>8 byte</strong>: cổng nguồn, cổng đích, độ dài, checksum — rồi tải của bạn. Hết. Mọi thứ TCP dành cả Chương 4 để làm, UDP bỏ ngỏ:</p>
<table>
<tr><th></th><th>TCP</th><th>UDP</th></tr>
<tr><td>Bắt tay</td><td>3 gói trước mọi dữ liệu</td><td><strong>không</strong> — gói đầu là dữ liệu</td></tr>
<tr><td>Giao hàng</td><td>đáng tin (truyền lại gói mất)</td><td><strong>nỗ lực tối đa</strong> — mất là mất</td></tr>
<tr><td>Thứ tự</td><td>một luồng byte có thứ tự</td><td><strong>không</strong> — gói, thứ tự bất kỳ</td></tr>
<tr><td>Trạng thái kết nối</td><td>ESTABLISHED, TIME_WAIT, …</td><td><strong>không</strong> — chỉ một socket mở</td></tr>
<tr><td>Kiểm soát luồng/tắc nghẽn</td><td>có sẵn</td><td><strong>không</strong> — bạn có thể làm ngập đường</td></tr>
</table>
<p>Đây không phải một TCP tệ hơn; nó là một công cụ khác. Khi bạn muốn tự làm phần tin cậy (hoặc không làm gì cả), UDP tránh đường cho bạn.</p>
${net('socket', 'demux', 'vi', 'Cổng phân kênh gói tới đúng chương trình — điều UDP và TCP cùng chia sẻ. Đi theo một gói tới socket của nó.', { tour: 'socket-demux' })}

<h3>Gửi rồi quên: một trao đổi UDP trên dây</h3>
<p>Dựng một máy chủ UDP echo tí hon trong lab và gửi nó một gói:</p>
${cmd('docker exec -d nfd-web node /lab/k/code/ch05/udp-srv.mjs    # một UDP echo ở 10.10.2.10:9999', 'docker exec -it nfd-client bash')}
${run('c51-echo', 'printf', 1)}
<p>Giờ nhìn trao đổi đó trên dây — ta bắt bằng <code>tcpdump</code>:</p>
${run('c51-wire', 'tcpdump', 1)}
<p>Ba gói, không bắt tay: yêu cầu (<code>length 4</code>), một gói dài 0 khi <code>socat</code> đóng, và câu trả lời (<code>length 13</code>). Không có <code>[S]</code>, <code>[S.]</code>, <code>[.]</code> — không gì giống mười gói của bài 4.1. Gói đầu mang dữ liệu, và câu trả lời đơn giản là một gói độc lập khác. Nếu bạn chỉ cần gửi một thứ nhỏ và có thể nhận một thứ về, UDP làm trong một vòng khứ hồi với số thiết lập bằng không.</p>

<h3>Mất gói cứ thế xảy ra, và không ai báo bạn</h3>
<p>Thêm 30% mất gói và gửi 20 gói. Máy chủ đếm xem bao nhiêu thật sự tới:</p>
${run('c51-loss', 'node udp-send', 1)}
<p>Hai mươi gửi đi, <strong>mười hai nhận được</strong>. Tám gói mất đơn giản là <strong>biến mất</strong> — không ACK, không truyền lại, và <em>bên gửi không bao giờ biết</em>. Đây là tính chất định nghĩa của UDP: nó sẽ không nhấc một ngón tay để phục hồi một gói mất. Nếu ứng dụng của bạn cần tin cậy, ứng dụng của bạn phải nhận ra khoảng trống và hỏi lại. Nếu nó <em>không</em> cần mọi gói — một khung video, một cập nhật vị trí — thì UDP đã tiết kiệm cho bạn chi phí phục hồi dữ liệu mà bạn dù sao cũng sẽ vứt.</p>

<div class="pitfall co-tieu-de">
<p><strong>UDP không “không tin cậy” theo nghĩa hỏng — nó là “nỗ lực tối đa”.</strong> Trên một mạng cục bộ khoẻ, giao hàng UDP gần như hoàn hảo; mất gói hiện ra khi nghẽn, qua Internet công cộng, hay trên Wi-Fi tồi. Sai lầm là cho rằng gói UDP luôn tới (chúng tới khi thử nghiệm, rồi biến mất trong sản xuất), hoặc cho rằng chúng <em>không bao giờ</em> tới. Thiết kế cho “phần lớn tới, một số không, thứ tự không bảo đảm” — và đo.</p>
</div>

<h3>Không kết nối nghĩa là không có trạng thái để rò</h3>
<p>Một socket UDP không có bắt tay, nên không có kết nối nào để nhân theo dõi. Nhìn socket máy chủ:</p>
${run('c51-noconn', 'ss -ulnp', 1)}
${run('c51-noconn', 'ss -tlnp', 1)}
<p>Socket UDP là <strong>UNCONN</strong> — nó ra đời ngay khi chương trình gọi <code>bind()</code>, không thương lượng gì. Không có <strong>TIME_WAIT</strong>, không hàng đợi accept, và không cạn cổng do xoay vòng (toàn bộ bài 4.4 đơn giản không áp dụng). Một socket UDP có thể nhận từ và gửi tới hàng nghìn peer khác nhau, đó đúng là lý do một máy chủ DNS hay máy chủ game xử lý được rất nhiều client từ một socket. (Một socket UDP <em>có thể</em> gọi <code>connect()</code> để cố định một peer mặc định, nhưng điều đó chỉ đặt một đích — vẫn không bắt tay và không kết nối trên dây.)</p>

<h3>Nơi UDP thắng</h3>
<p>Khuôn mẫu đơn giản: <strong>khi tươi-mà-mất thắng đầy-đủ-mà-trễ, UDP thắng</strong>, và tính tin cậy của TCP thành gánh nặng.</p>
<ul>
<li><strong>DNS</strong> (Chương 3): một câu hỏi nhỏ, một câu trả lời nhỏ. Một cú bắt tay TCP sẽ gấp đôi chi phí mỗi lần tra. Ứng dụng thử lại khi mất, và chỉ chuyển sang TCP nếu câu trả lời quá lớn cho một gói.</li>
<li><strong>Cuộc gọi thoại và video</strong>: một gói thoại tới trễ là vô dụng — khoảnh khắc nó dành cho đã trôi qua. Tốt hơn là bỏ nó và giữ cuộc trò chuyện tiếp. Ứng dụng thêm một bộ đệm chống giật và che lấp mất gói.</li>
<li><strong>Game</strong>: chỉ vị trí mới nhất quan trọng; truyền lại một cái cũ chỉ thêm độ trễ. Ứng dụng đánh số gói và nội suy.</li>
<li><strong>Video trực tiếp</strong>: bỏ một khung còn hơn đóng băng luồng. Sửa lỗi hướng trước và bitrate thích ứng nằm trong ứng dụng.</li>
</ul>
<p>Trong mọi trường hợp ứng dụng nhận lại đúng những trách nhiệm mà TCP lẽ ra xử lý — đó là rất nhiều việc, và là lý do bài kế tồn tại.</p>

<div class="pitfall co-tieu-de">
<p><strong>Đừng tái phát minh TCP một cách tồi trên UDP.</strong> Các nhóm với lấy UDP vì “tốc độ”, rồi dần dần thêm lại số thứ tự, ACK, truyền lại và kiểm soát tắc nghẽn — và được một TCP tệ hơn, nhiều lỗi hơn. Nếu bạn cần giao hàng đáng tin, có thứ tự, có kiểm soát tắc nghẽn, bạn muốn TCP, hoặc <strong>QUIC</strong> (bài 5.2), chính xác là “tất cả những cái đó, làm một lần, đúng, trên UDP.” Chỉ dùng UDP thô khi bạn thật sự muốn nỗ lực tối đa và sẽ xử lý mất gói theo cách riêng của lĩnh vực (một bộ đệm chống giật, FEC, ghi-sau-thắng).</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>Socket là một <strong>datagram socket</strong> (<code>SOCK_DGRAM</code>): <code>sendto()</code> và <code>recvfrom()</code> mỗi cái chuyển đúng một gói, giữ nguyên ranh giới thông điệp — khác luồng byte của TCP, nơi <code>read()</code> của bạn có thể trả về một mảnh của một thông điệp hoặc hai thông điệp dính nhau.</li>
<li><strong>Nhân không giữ trạng thái theo peer</strong>: không có mục nào trong bảng kết nối, nên <code>ss -u</code> chỉ thấy socket, luôn UNCONN.</li>
<li><strong>Header 8 byte</strong> cố định; không tuỳ chọn, không cửa sổ, không số thứ tự. Một gói bị vứt không được theo dõi ở đâu — phát hiện mất gói là việc của ứng dụng.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', so: '13.2', ten: 'Bắt tay, tính tin cậy, UDP, và đọc một máy chủ thật', giong: 'UDP không kết nối và không tin cậy, dùng cho DNS và media thời gian thực, khác TCP', khac: 'NWC204 so sánh TCP và UDP ở mức khái niệm trong một buổi', them: 'một trao đổi UDP bắt trên dây (không bắt tay), mất gói đo được mà bên gửi không hề biết, một socket UNCONN không TIME_WAIT, và áp lực thiết kế dẫn tới QUIC' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một đồng nghiệp đề xuất gửi telemetry (một cập nhật vị trí mỗi 50 ms) qua một kết nối TCP mới mỗi lần “vì TCP đáng tin.” Hãy cho thấy trong lab vì sao UDP hợp hơn và ứng dụng vẫn cần thêm gì.</p>
<ol>
<li>Dựng máy chủ UDP echo và gửi một gói với <code>socat - UDP:10.10.2.10:9999</code>. Bắt gói và xác nhận không có bắt tay.</li>
<li>Thêm <code>tc qdisc add dev eth0 root netem loss 30%</code> trên <code>nfd-client</code>, chạy <code>node udp-send.mjs</code>, và ghi bao nhiêu trong 20 gói máy chủ nhận được và bên gửi có được báo không.</li>
<li>Chạy <code>ss -uanp</code> và <code>ss -tan</code> và so: phía UDP có bao nhiêu trạng thái kết nối?</li>
<li>Viết ba câu: vì sao UDP hợp cho telemetry 50 ms, mất gì dưới 30% mất, và ứng dụng nên thêm gì (ví dụ một số thứ tự để bên nhận bỏ cập nhật cũ).</li>
</ol>
<p><strong>Đạt khi:</strong> bản bắt gói cho thấy một trao đổi không bắt tay, lần chạy mất gói cho thấy một số gói bị vứt âm thầm, và ba câu lập luận đúng rằng “chỉ vị trí mới nhất quan trọng” làm UDP nỗ lực tối đa thành lựa chọn đúng — kèm một số thứ tự để bỏ cập nhật cũ tới sai thứ tự.</p>
<details><summary>Lời giải</summary>
<p>Bản bắt gói chỉ thấy các gói UDP, không SYN. Dưới 30% mất, máy chủ nhận ~12–14 trong 20 và bên gửi không có lỗi. <code>ss -u</code> chỉ thấy UNCONN, không ESTABLISHED/TIME_WAIT. Ba câu: “Với telemetry 50 ms, chỉ vị trí mới nhất quan trọng, nên một cập nhật mất đơn giản được thay bằng cái kế — đúng cái giao hàng nỗ lực tối đa của UDP cho, không cần một cú bắt tay mỗi thông điệp. Dưới mất gói một số cập nhật biến mất âm thầm, ở đây là ổn. Ứng dụng nên thêm một số thứ tự để bên nhận bỏ qua một cập nhật tới sai thứ tự sau một cái mới hơn.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['UDP — User Datagram Protocol (giao thức gói dữ liệu người dùng)', 'Một tầng vận chuyển mỏng trên IP: cổng + độ dài + checksum, không kết nối hay tin cậy.'],
  ['datagram (gói dữ liệu)', 'Một thông điệp UDP tự chứa; ranh giới được giữ, khác luồng byte của TCP.'],
  ['best effort (nỗ lực tối đa)', 'Giao hàng được cố gắng nhưng không bảo đảm; gói mất không được phục hồi.'],
  ['connectionless (không kết nối)', 'Không bắt tay và không trạng thái theo peer; một socket nói với nhiều peer.'],
  ['fire and forget (gửi rồi quên)', 'Gửi một gói rồi đi tiếp; không ACK, không truyền lại, không báo mất.'],
  ['SOCK_DGRAM', 'Loại datagram socket; sendto/recvfrom mỗi cái chuyển một thông điệp.'],
  ['jitter buffer (bộ đệm chống giật)', 'Một bộ đệm phía ứng dụng làm mượt thời điểm tới thay đổi của media.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>UDP là lớp bọc mỏng nhất trên IP — cổng, độ dài, checksum — không bắt tay, thứ tự hay truyền lại.</li>
<li>Trên dây nó chỉ là các gói; 20 gửi qua 30% mất, 12 tới, và bên gửi không biết.</li>
<li>Một socket UDP luôn UNCONN: không TIME_WAIT, không hàng đợi accept, không cạn cổng; một socket, nhiều peer.</li>
<li>UDP thắng khi tươi-mà-mất thắng đầy-đủ-mà-trễ: DNS, VoIP, game, video trực tiếp.</li>
<li>Bất cứ gì TCP làm cho bạn, ứng dụng của bạn phải làm — và làm tốt trên UDP chính là QUIC (bài 5.2).</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc768', '📄', 'RFC 768 — Giao thức gói dữ liệu người dùng (1980)', 'Toàn bộ UDP trong ba trang: header 8 byte và không gì khác.', 'Mở')}
${L('https://developer.mozilla.org/docs/Glossary/UDP', '📘', 'MDN — UDP', 'Một giới thiệu ngắn cho lập trình viên và nơi nó được dùng.', 'Mở')}
${L('https://nodejs.org/api/dgram.html', '📄', 'Node.js — module dgram (UDP)', 'createSocket, send, và các sự kiện message/bind dùng trong bài này.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8085', '📄', 'RFC 8085 — Hướng dẫn dùng UDP', 'Ứng dụng phải thêm gì (kiểm soát tắc nghẽn, xử lý mất gói) khi dùng UDP.', 'Mở')}
</div>
`,
};
