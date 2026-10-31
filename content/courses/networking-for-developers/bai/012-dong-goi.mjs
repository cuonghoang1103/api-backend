/**
 * Chương 1 · 1.3 — Đóng gói: frame, packet, segment (slug khung netdev-1-2-dong-goi).
 * Output thật: lab/out/c12-goi, c12-big-on, c12-tso-web, c12-big-off (.out.txt).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-01-3.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '1.3 — Encapsulation: frames, packets, segments — reading one frame byte by byte|||1.3 — Đóng gói: frame, packet, segment — đọc một frame từng byte',
  slug: 'netdev-1-2-dong-goi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mỗi tầng gói tầng trên ra sao; tìm MAC, IP, cổng và chữ HTTP trong hex của một frame thật 149 byte; MTU 1500, MSS 1460 và vì sao segment đầy chở 1448 byte; bẫy segmentation offload; chi phí header; Wireshark ba khung.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Encapsulation: frames, packets, segments — reading one frame byte by byte</h2>
<p class="lead">In lesson 1.2 tshark told us one packet had four layers. Here we stop trusting the tool and read the bytes ourselves: where exactly is the MAC address, the IP address, the port, the HTTP text? Then we look at the size limit every link has (MTU), how TCP adapts to it (MSS), and a capture artefact that makes packets look bigger than the limit.</p>

<h3>Encapsulation: each layer wraps the one above</h3>
<p>When curl sends <code>GET /api/hello</code>, the data goes down the stack and each layer puts what it received inside its own envelope:</p>
<ol>
<li>curl writes 83 bytes of HTTP text into a socket.</li>
<li>The kernel's TCP adds a header (ports, sequence numbers, flags): data + TCP header = a <strong>segment</strong>.</li>
<li>The kernel's IP adds a header (addresses, TTL, protocol): segment + IP header = a <strong>packet</strong>.</li>
<li>The driver adds an Ethernet header (MAC addresses, type): packet + Ethernet header = a <strong>frame</strong>. The network chip sends it.</li>
</ol>
<p>Each layer treats what is inside as an opaque <strong>payload</strong> — Ethernet does not look into the IP packet, TCP does not look into the HTTP text. At the receiver it runs backwards (<strong>decapsulation</strong>), and each layer uses a number in its header to decide who gets the payload next: EtherType → IP, IP protocol → TCP, TCP port → the program.</p>
${net('encap', 'http', 'en', 'Step through the wrapping on the sender and the unwrapping on the receiver, with the real bytes of this frame.')}

<h3>Count the bytes</h3>
<p>Capture the request in the lab client and ask tshark for the length of each header:</p>
${run('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -T fields', 1)}
<p>Frame 149 bytes; Ethernet destination and source MAC; EtherType <code>0x0800</code> (IPv4); IP header 20 bytes, IP total length 135; TTL 64; protocol 6 (TCP); TCP header 32 bytes; 83 bytes of TCP payload. So <strong>14 + 20 + 32 + 83 = 149</strong>. (On a real cable, 8 bytes of preamble, a 4-byte frame checksum and a 12-byte gap also travel, but captures never show them.)</p>

<h3>The frame in hex, byte by byte</h3>
${run('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -x', 1)}
<p>Read it with the offsets (the first column counts bytes in hex: <code>0010</code> = byte 16):</p>
<table>
<thead><tr><th>Bytes</th><th>Layer</th><th>Field</th><th>What you see</th></tr></thead>
<tbody>
<tr><td>0–5</td><td>Ethernet</td><td>destination MAC</td><td><code>02 00 0a 0a 01 fe</code> — the <strong>router's</strong> card</td></tr>
<tr><td>6–11</td><td>Ethernet</td><td>source MAC</td><td><code>02 00 0a 0a 01 0a</code> — the client's card</td></tr>
<tr><td>12–13</td><td>Ethernet</td><td>EtherType</td><td><code>08 00</code> — IPv4 follows</td></tr>
<tr><td>14</td><td>IP</td><td>version + header length</td><td><code>45</code> — version 4, 5 × 4 = 20 bytes</td></tr>
<tr><td>16–17</td><td>IP</td><td>total length</td><td><code>00 87</code> = 135</td></tr>
<tr><td>22</td><td>IP</td><td>TTL</td><td><code>40</code> = 64</td></tr>
<tr><td>23</td><td>IP</td><td>protocol</td><td><code>06</code> = TCP</td></tr>
<tr><td>26–29 / 30–33</td><td>IP</td><td>source / destination</td><td><code>0a 0a 01 0a</code> / <code>0a 0a 02 0a</code></td></tr>
<tr><td>34–35 / 36–37</td><td>TCP</td><td>source / destination port</td><td>a temporary port / <code>00 50</code> = 80</td></tr>
<tr><td>46–47</td><td>TCP</td><td>header length + flags</td><td><code>80 18</code> — 8 × 4 = 32 bytes · PSH, ACK</td></tr>
<tr><td>54–65</td><td>TCP</td><td>options</td><td><code>01 01 08 0a …</code> — two NOPs and timestamps</td></tr>
<tr><td>66–148</td><td>HTTP</td><td>data</td><td><code>47 45 54 20</code> = "GET ", then the path and headers</td></tr>
</tbody>
</table>
<p>The bytes of lesson 1.1 are all here: <code>00 50</code> for port 80, <code>0a 0a 02 0a</code> for 10.10.2.10, <code>47 45 54</code> for GET. tshark's own decoding of the IP and TCP headers confirms each field:</p>
${run('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -O ip,tcp', 1)}

<h3>The same in Wireshark: three panes</h3>
<p>Copy the capture out (<code>docker cp nfd-client:/tmp/g.pcap .</code>) and open it in Wireshark. The window has three panes that are exactly this lesson: the <strong>packet list</strong> on top (one line per frame), the <strong>packet details</strong> in the middle (the layers as a tree you can expand — Frame, Ethernet II, Internet Protocol, Transmission Control Protocol, Hypertext Transfer Protocol) and the <strong>bytes</strong> at the bottom. Click a field in the middle pane and Wireshark highlights its bytes in the bottom pane — the fastest way to learn any header.</p>

<h3>MTU: the largest packet a link carries</h3>
<p>Every link has a <strong>maximum transmission unit (MTU)</strong>: the largest IP packet it can carry in one frame. For Ethernet it is 1500 bytes:</p>
${run('c12-goi', 'ip link show eth0', 1)}
<p><code>ping</code> with "don't fragment" (<code>-M do</code>) proves the limit. 1472 bytes of data + 8 bytes of ICMP header + 20 bytes of IP header = 1500:</p>
${run('c12-goi', 'ping -c 1 -M do -s 1472', 2)}
<p>1472 goes through; 1473 makes a 1501-byte packet, and the kernel refuses to send it: <code>Message too long</code>. Without <code>-M do</code>, IPv4 could cut a big packet into <em>fragments</em> — slow and fragile, so modern TCP avoids it by never sending segments bigger than the path allows.</p>

<h3>From MTU to MSS to 1448</h3>
<p>TCP turns the MTU into a <strong>maximum segment size (MSS)</strong>: 1500 − 20 (IP) − 20 (basic TCP header) = <strong>1460</strong>. Each side announces its MSS in its SYN — the <code>MSS=1460</code> you saw in every capture. But Linux adds 12 bytes of TCP timestamp options to every segment, so a full segment carries <strong>1448</strong> bytes of data.</p>
<p>The lab's <code>/big</code> page returns a 3841-byte body. Its full HTTP response (headers + body) is 3991 bytes, which should travel as 1448 + 1448 + 1095:</p>
${run('c12-big-off', 'curl -s -o /dev/null', 2)}
<p>Exactly: three data frames of 1514, 1514 and 1161 bytes (1514 = 14 + 20 + 32 + 1448). Watch the same thing happen with other MTUs — a VPN such as WireGuard typically uses 1420, jumbo frames in a data centre use 9000:</p>
${net('encap', 'mtu', 'en', 'Cut a 3991-byte response into segments for MTU 1500, 1420 and 9000 — and switch segmentation offload on and off.', { tour: 'encap-mtu' })}

<div class="pitfall co-tieu-de">
<p><strong>"I captured a 4 057-byte packet, so the MTU must be broken."</strong> The first time we captured this download, before turning anything off, we saw this:</p>
${run('c12-big-on', 'curl -s -o /dev/null', 2)}
<p>One "packet" of 4057 bytes carrying all 3991 bytes — far above the MTU. Nothing is broken: this is <strong>segmentation offload</strong> (TSO/GSO). To save CPU, the kernel hands the network card (or the driver) one large chunk and lets it cut the segments just before transmission. tcpdump captures <em>before</em> the cut, so it shows the large chunk. Turning offload off on the sender shows the real segments:</p>
${run('c12-tso-web', 'ethtool -k', 3)}
<p>Remember this when you capture on a busy server and see 64 KB "packets": they never travel like that. Capture on the wire (or turn offload off on a test machine) to see the real segments.</p>
</div>

<h3>Overhead: why many small messages are expensive</h3>
<table>
<thead><tr><th>Frame</th><th>Data</th><th>Headers (14 + 20 + 32)</th><th>Useful share</th></tr></thead>
<tbody>
<tr><td>our GET /api/hello, 149 B</td><td>83 B</td><td>66 B</td><td>56 %</td></tr>
<tr><td>a full segment, 1514 B</td><td>1448 B</td><td>66 B</td><td>95.6 %</td></tr>
<tr><td>a bare ACK, 66 B</td><td>0 B</td><td>66 B</td><td>0 %</td></tr>
</tbody>
</table>
<p>Headers cost the same whatever they carry. An API that sends thousands of tiny messages, each on a new connection with its own handshake, spends most of its traffic on envelopes. Batching and connection reuse (Chapters 4 and 8) fix that.</p>
${cauNoi('en', { ...NWC, bai: 'nwc204-3-2-mo-hinh-tham-chieu-va-dong-goi', so: '3.2', ten: 'Reference models, encapsulation and data access', giong: 'encapsulation, PDU names (segment, packet, frame)', khac: 'NWC204 describes encapsulation with diagrams and the Cisco PDU names', them: 'a real frame decoded byte by byte, MTU/MSS/1448 measured, the segmentation offload trap, and header overhead' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate shows a capture from the production server with a single 23 000-byte "packet" and says "our MTU is misconfigured". You want to check before anyone changes the network settings.</p>
<ol>
<li>In the lab client, capture <code>curl -s -o /dev/null http://10.10.2.10/api/hello</code> and print it with <code>tshark -r FILE -Y http.request -x</code>. Mark the first and last byte of each layer.</li>
<li>From the hex alone, write down: destination MAC, EtherType, TTL, protocol, destination IP, destination port. Then check with <code>-T fields</code>.</li>
<li>Run the two <code>ping -M do</code> commands with 1472 and 1473. Explain both results with arithmetic.</li>
<li>Capture <code>/big</code> twice: once as is, once after <code>docker exec nfd-web ethtool -K eth0 tso off gso off</code>. Compare the frame sizes and explain the difference to your teammate.</li>
</ol>
<p><strong>Done when:</strong> your six values match tshark, your ping arithmetic is 1472 + 8 + 20 = 1500, and you can say why a 23 000-byte capture does not mean a broken MTU.</p>
<details><summary>Solution</summary>
<p>Destination MAC <code>02:00:0a:0a:01:fe</code> (router), EtherType <code>0x0800</code>, TTL <code>40</code> = 64, protocol <code>06</code> = TCP, destination IP <code>0a 0a 02 0a</code> = 10.10.2.10, destination port <code>00 50</code> = 80. 1473 + 8 + 20 = 1501 &gt; 1500, so it cannot be sent with DF set. With offload on, the sender hands one large chunk to the card and the capture point sees it before segmentation; with offload off you see 1514/1514/1161. The production capture is the same effect — the segments on the wire respect the MTU.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['encapsulation / decapsulation (đóng gói / mở gói)', 'Each layer wraps the unit from the layer above in its own header; the receiver unwraps in reverse.'],
    ['payload (phần tải)', 'What a header carries — opaque to that layer.'],
    ['segment / packet / frame', 'TCP unit / IP unit / Ethernet unit.'],
    ['EtherType', 'Two bytes in the Ethernet header naming the next protocol (0x0800 = IPv4).'],
    ['MTU', 'Largest IP packet a link carries in one frame — 1500 on Ethernet.'],
    ['MSS', 'Largest TCP payload per segment, announced in SYN — 1460 for MTU 1500.'],
    ['TSO / GSO (segmentation offload)', 'The card or driver cuts big chunks into segments; captures may show the big chunk.'],
    ['fragmentation (phân mảnh)', 'Splitting an IP packet that is too big; avoided by modern TCP.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Data → segment (TCP) → packet (IP) → frame (Ethernet); each layer treats the inner part as payload.</li>
<li>Our request is 14 + 20 + 32 + 83 = 149 bytes; every field — MACs, IPs, ports, GET — can be found in the hex.</li>
<li>The receiver demultiplexes with numbers: EtherType → IP protocol → TCP port.</li>
<li>MTU 1500 → MSS 1460 → 1448 data bytes per segment with timestamps; a 3991-byte response is 3 segments.</li>
<li>Captures can show packets larger than the MTU because of segmentation offload — not a misconfiguration.</li>
</ul>
${L('https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html', '🐧', 'Linux kernel — Segmentation Offloads', 'TSO, GSO, GRO and what each does.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc894', '📄', 'RFC 894 — IP datagrams over Ethernet', 'EtherType 0x0800 and the 1500-byte maximum.', 'Open')}
${L('https://blog.cloudflare.com/path-mtu-discovery-in-practice/', '☁️', 'Cloudflare — Path MTU discovery in practice', 'What happens when MTUs along a path differ.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Đóng gói: frame, packet, segment — đọc một frame từng byte</h2>
<p class="lead">Ở bài 1.2, tshark cho biết một gói có bốn tầng. Ở đây ta thôi tin công cụ mà tự đọc byte: chính xác thì địa chỉ MAC, địa chỉ IP, cổng, chữ HTTP nằm ở đâu? Rồi ta xem giới hạn kích thước mà đường truyền nào cũng có (MTU), TCP thích nghi với nó ra sao (MSS), và một hiện tượng khi bắt gói làm gói tin trông lớn hơn giới hạn.</p>

<h3>Đóng gói: mỗi tầng bọc lấy tầng phía trên</h3>
<p>Khi curl gửi <code>GET /api/hello</code>, dữ liệu đi xuống các tầng và mỗi tầng bỏ thứ nó nhận được vào phong bì của mình:</p>
<ol>
<li>curl ghi 83 byte chữ HTTP vào một socket.</li>
<li>TCP trong nhân thêm một header (cổng, số thứ tự, cờ): dữ liệu + header TCP = một <strong>segment</strong>.</li>
<li>IP trong nhân thêm một header (địa chỉ, TTL, protocol): segment + header IP = một <strong>packet</strong>.</li>
<li>Driver thêm header Ethernet (địa chỉ MAC, loại): packet + header Ethernet = một <strong>frame</strong>. Chip mạng gửi nó đi.</li>
</ol>
<p>Mỗi tầng coi thứ bên trong là một <strong>phần tải (payload)</strong> không cần hiểu — Ethernet không nhìn vào gói IP, TCP không nhìn vào chữ HTTP. Ở máy nhận thì chạy ngược lại (<strong>mở gói — decapsulation</strong>), và mỗi tầng dùng một con số trong header của nó để quyết định giao phần tải cho ai tiếp theo: EtherType → IP, protocol của IP → TCP, cổng TCP → chương trình.</p>
${net('encap', 'http', 'vi', 'Đi từng bước qua việc bọc ở máy gửi và mở ở máy nhận, với chính các byte thật của frame này.')}

<h3>Đếm byte</h3>
<p>Bắt request trên máy client của lab và hỏi tshark độ dài từng header:</p>
${run('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -T fields', 1)}
<p>Frame 149 byte; MAC đích và MAC nguồn của Ethernet; EtherType <code>0x0800</code> (IPv4); header IP 20 byte, tổng độ dài gói IP 135; TTL 64; protocol 6 (TCP); header TCP 32 byte; 83 byte phần tải TCP. Vậy <strong>14 + 20 + 32 + 83 = 149</strong>. (Trên dây cáp thật còn 8 byte preamble, 4 byte mã kiểm tra frame và 12 byte khoảng nghỉ cũng đi qua, nhưng bản bắt không bao giờ hiện chúng.)</p>

<h3>Frame ở dạng hex, từng byte</h3>
${run('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -x', 1)}
<p>Đọc kèm offset (cột đầu đếm byte ở hệ hex: <code>0010</code> = byte thứ 16):</p>
<table>
<thead><tr><th>Byte</th><th>Tầng</th><th>Trường</th><th>Bạn thấy gì</th></tr></thead>
<tbody>
<tr><td>0–5</td><td>Ethernet</td><td>MAC đích</td><td><code>02 00 0a 0a 01 fe</code> — card của <strong>router</strong></td></tr>
<tr><td>6–11</td><td>Ethernet</td><td>MAC nguồn</td><td><code>02 00 0a 0a 01 0a</code> — card của máy khách</td></tr>
<tr><td>12–13</td><td>Ethernet</td><td>EtherType</td><td><code>08 00</code> — phía sau là IPv4</td></tr>
<tr><td>14</td><td>IP</td><td>phiên bản + độ dài header</td><td><code>45</code> — phiên bản 4, 5 × 4 = 20 byte</td></tr>
<tr><td>16–17</td><td>IP</td><td>tổng độ dài</td><td><code>00 87</code> = 135</td></tr>
<tr><td>22</td><td>IP</td><td>TTL</td><td><code>40</code> = 64</td></tr>
<tr><td>23</td><td>IP</td><td>protocol</td><td><code>06</code> = TCP</td></tr>
<tr><td>26–29 / 30–33</td><td>IP</td><td>nguồn / đích</td><td><code>0a 0a 01 0a</code> / <code>0a 0a 02 0a</code></td></tr>
<tr><td>34–35 / 36–37</td><td>TCP</td><td>cổng nguồn / đích</td><td>một cổng tạm / <code>00 50</code> = 80</td></tr>
<tr><td>46–47</td><td>TCP</td><td>độ dài header + cờ</td><td><code>80 18</code> — 8 × 4 = 32 byte · PSH, ACK</td></tr>
<tr><td>54–65</td><td>TCP</td><td>tuỳ chọn</td><td><code>01 01 08 0a …</code> — hai NOP và timestamp</td></tr>
<tr><td>66–148</td><td>HTTP</td><td>dữ liệu</td><td><code>47 45 54 20</code> = "GET ", rồi đường dẫn và header</td></tr>
</tbody>
</table>
<p>Các byte của bài 1.1 đều có mặt: <code>00 50</code> cho cổng 80, <code>0a 0a 02 0a</code> cho 10.10.2.10, <code>47 45 54</code> cho GET. Phần giải mã header IP và TCP của chính tshark xác nhận từng trường:</p>
${run('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -O ip,tcp', 1)}

<h3>Cũng như vậy trong Wireshark: ba khung</h3>
<p>Chép bản bắt ra (<code>docker cp nfd-client:/tmp/g.pcap .</code>) và mở bằng Wireshark. Cửa sổ có ba khung đúng bằng nội dung bài này: <strong>danh sách gói</strong> ở trên (mỗi frame một dòng), <strong>chi tiết gói</strong> ở giữa (các tầng thành cây mở rộng được — Frame, Ethernet II, Internet Protocol, Transmission Control Protocol, Hypertext Transfer Protocol) và <strong>các byte</strong> ở dưới. Bấm một trường ở khung giữa là Wireshark tô sáng các byte của nó ở khung dưới — cách nhanh nhất để học bất kỳ header nào.</p>

<h3>MTU: gói lớn nhất một đường truyền chở được</h3>
<p>Đường truyền nào cũng có một <strong>MTU (maximum transmission unit)</strong>: gói IP lớn nhất chở được trong một frame. Với Ethernet là 1500 byte:</p>
${run('c12-goi', 'ip link show eth0', 1)}
<p><code>ping</code> kèm cờ "không được phân mảnh" (<code>-M do</code>) chứng minh giới hạn. 1472 byte dữ liệu + 8 byte header ICMP + 20 byte header IP = 1500:</p>
${run('c12-goi', 'ping -c 1 -M do -s 1472', 2)}
<p>1472 đi được; 1473 tạo gói 1501 byte, và nhân từ chối gửi: <code>Message too long</code>. Không có <code>-M do</code>, IPv4 có thể cắt gói lớn thành nhiều <em>mảnh (fragment)</em> — chậm và dễ hỏng, nên TCP hiện đại tránh bằng cách không bao giờ gửi segment lớn hơn mức đường đi cho phép.</p>

<h3>Từ MTU tới MSS tới 1448</h3>
<p>TCP đổi MTU thành <strong>kích thước segment tối đa (MSS — maximum segment size)</strong>: 1500 − 20 (IP) − 20 (header TCP cơ bản) = <strong>1460</strong>. Mỗi bên công bố MSS của mình trong gói SYN — chính chữ <code>MSS=1460</code> bạn thấy trong mọi bản bắt. Nhưng Linux thêm 12 byte tuỳ chọn timestamp vào mọi segment, nên một segment đầy chở <strong>1448</strong> byte dữ liệu.</p>
<p>Trang <code>/big</code> của lab trả về phần thân 3841 byte. Toàn bộ câu trả lời HTTP (header + thân) là 3991 byte, lẽ ra sẽ đi thành 1448 + 1448 + 1095:</p>
${run('c12-big-off', 'curl -s -o /dev/null', 2)}
<p>Chính xác: ba frame dữ liệu 1514, 1514 và 1161 byte (1514 = 14 + 20 + 32 + 1448). Xem cùng việc đó với MTU khác — VPN như WireGuard thường dùng 1420, jumbo frame trong trung tâm dữ liệu dùng 9000:</p>
${net('encap', 'mtu', 'vi', 'Cắt câu trả lời 3991 byte thành segment với MTU 1500, 1420 và 9000 — và bật tắt segmentation offload.', { tour: 'encap-mtu' })}

<div class="pitfall co-tieu-de">
<p><strong>"Em bắt được gói 4 057 byte, chắc MTU bị hỏng rồi."</strong> Lần đầu bắt lượt tải này, trước khi tắt gì cả, ta thấy thế này:</p>
${run('c12-big-on', 'curl -s -o /dev/null', 2)}
<p>Một "gói" 4057 byte chở cả 3991 byte — vượt xa MTU. Không có gì hỏng: đó là <strong>segmentation offload</strong> (TSO/GSO). Để tiết kiệm CPU, nhân giao cho card mạng (hoặc driver) một khối lớn và để nó cắt thành segment ngay trước khi phát. tcpdump bắt gói <em>trước</em> lúc cắt, nên thấy khối lớn. Tắt offload ở máy gửi thì thấy các segment thật:</p>
${run('c12-tso-web', 'ethtool -k', 3)}
<p>Nhớ điều này khi bắt gói trên một máy chủ đang chạy và thấy "gói" 64 KB: chúng không bao giờ đi trên dây như thế. Hãy bắt gói trên đường truyền (hoặc tắt offload trên máy thử) để thấy segment thật.</p>
</div>

<h3>Chi phí header: vì sao nhiều tin nhắn nhỏ lại đắt</h3>
<table>
<thead><tr><th>Frame</th><th>Dữ liệu</th><th>Header (14 + 20 + 32)</th><th>Phần hữu ích</th></tr></thead>
<tbody>
<tr><td>GET /api/hello của ta, 149 B</td><td>83 B</td><td>66 B</td><td>56 %</td></tr>
<tr><td>một segment đầy, 1514 B</td><td>1448 B</td><td>66 B</td><td>95,6 %</td></tr>
<tr><td>một ACK trần, 66 B</td><td>0 B</td><td>66 B</td><td>0 %</td></tr>
</tbody>
</table>
<p>Header tốn như nhau dù chở gì. Một API gửi hàng nghìn tin nhắn tí hon, mỗi tin trên một kết nối mới kèm bắt tay riêng, tiêu phần lớn lưu lượng vào phong bì. Gom lại và dùng lại kết nối (Chương 4 và 8) giải quyết chuyện đó.</p>
${cauNoi('vi', { ...NWC, bai: 'nwc204-3-2-mo-hinh-tham-chieu-va-dong-goi', so: '3.2', ten: 'Mô hình tham chiếu, đóng gói và truy cập dữ liệu', giong: 'đóng gói, tên PDU (segment, packet, frame)', khac: 'NWC204 mô tả đóng gói bằng sơ đồ và tên PDU theo Cisco', them: 'một frame thật giải mã từng byte, MTU/MSS/1448 đo thật, bẫy segmentation offload, và chi phí header' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn cùng nhóm đưa ra một bản bắt gói trên máy chủ production có một "gói" 23 000 byte và bảo "MTU của mình cấu hình sai rồi". Bạn muốn kiểm trước khi có ai sửa thiết lập mạng.</p>
<ol>
<li>Trên máy client của lab, bắt <code>curl -s -o /dev/null http://10.10.2.10/api/hello</code> và in bằng <code>tshark -r FILE -Y http.request -x</code>. Đánh dấu byte đầu và byte cuối của từng tầng.</li>
<li>Chỉ từ hex, ghi ra: MAC đích, EtherType, TTL, protocol, IP đích, cổng đích. Rồi đối chiếu bằng <code>-T fields</code>.</li>
<li>Chạy hai lệnh <code>ping -M do</code> với 1472 và 1473. Giải thích cả hai kết quả bằng phép tính.</li>
<li>Bắt <code>/big</code> hai lần: một lần để nguyên, một lần sau <code>docker exec nfd-web ethtool -K eth0 tso off gso off</code>. So kích thước frame và giải thích khác biệt cho bạn cùng nhóm.</li>
</ol>
<p><strong>Đạt khi:</strong> sáu giá trị của bạn khớp tshark, phép tính ping là 1472 + 8 + 20 = 1500, và bạn nói được vì sao bản bắt 23 000 byte không có nghĩa là MTU hỏng.</p>
<details><summary>Lời giải</summary>
<p>MAC đích <code>02:00:0a:0a:01:fe</code> (router), EtherType <code>0x0800</code>, TTL <code>40</code> = 64, protocol <code>06</code> = TCP, IP đích <code>0a 0a 02 0a</code> = 10.10.2.10, cổng đích <code>00 50</code> = 80. 1473 + 8 + 20 = 1501 &gt; 1500, nên không gửi được khi bật DF. Khi bật offload, máy gửi giao một khối lớn cho card và điểm bắt gói thấy nó trước khi bị cắt; tắt offload thì thấy 1514/1514/1161. Bản bắt ở production cũng là hiện tượng đó — các segment trên dây vẫn tuân thủ MTU.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['encapsulation / decapsulation (đóng gói / mở gói)', 'Mỗi tầng bọc khối của tầng trên bằng header của mình; bên nhận mở theo chiều ngược lại.'],
    ['payload (phần tải)', 'Thứ một header chở theo — tầng đó không cần hiểu.'],
    ['segment / packet / frame', 'Đơn vị của TCP / của IP / của Ethernet.'],
    ['EtherType', 'Hai byte trong header Ethernet cho biết giao thức kế tiếp (0x0800 = IPv4).'],
    ['MTU', 'Gói IP lớn nhất một đường truyền chở trong một frame — 1500 với Ethernet.'],
    ['MSS', 'Phần tải TCP lớn nhất mỗi segment, công bố trong SYN — 1460 với MTU 1500.'],
    ['TSO / GSO (segmentation offload)', 'Card hoặc driver cắt khối lớn thành segment; bản bắt có thể hiện khối lớn đó.'],
    ['fragmentation (phân mảnh)', 'Chia nhỏ một gói IP quá lớn; TCP hiện đại tránh làm việc này.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dữ liệu → segment (TCP) → packet (IP) → frame (Ethernet); mỗi tầng coi phần bên trong là phần tải.</li>
<li>Request của ta là 14 + 20 + 32 + 83 = 149 byte; trường nào — MAC, IP, cổng, GET — cũng tìm được trong hex.</li>
<li>Máy nhận phân phối bằng các con số: EtherType → protocol của IP → cổng TCP.</li>
<li>MTU 1500 → MSS 1460 → 1448 byte dữ liệu mỗi segment khi có timestamp; câu trả lời 3991 byte là 3 segment.</li>
<li>Bản bắt có thể hiện gói lớn hơn MTU vì segmentation offload — không phải cấu hình sai.</li>
</ul>
${L('https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html', '🐧', 'Nhân Linux — Segmentation Offloads', 'TSO, GSO, GRO và mỗi cái làm gì.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc894', '📄', 'RFC 894 — Gói IP trên Ethernet', 'EtherType 0x0800 và giới hạn 1500 byte.', 'Mở')}
${L('https://blog.cloudflare.com/path-mtu-discovery-in-practice/', '☁️', 'Cloudflare — Path MTU discovery trong thực tế', 'Chuyện gì xảy ra khi MTU dọc đường đi khác nhau.', 'Mở')}
</div>
`,
};
