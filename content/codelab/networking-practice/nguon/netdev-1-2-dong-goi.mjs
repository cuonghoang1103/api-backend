/** Networking for Developers · 1.3 — Đóng gói: đọc một frame byte theo byte, MTU/MSS/1448, offload, tỷ lệ hữu ích; tự viết segments() và parseFrame(). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre, hexDump, inX, dungFrame, tsOpt, soNhan } from './_net.mjs';

const HX = hexDump('c12-goi');             // frame thật 149 byte (GET /api/hello), máy client
const HC = hexDump('c13-hop-client');      // frame thật phía LAN của router (bài 1.4)
const HW = hexDump('c13-hop-web');         // frame thật phía DMZ (bài 1.4)
const FIELDS = sauLenh('c12-goi', 'tshark -r /tmp/g.pcap -Y http.request -T fields');

/* ── 1. Tên gọi và ý tưởng ── */
const E1 = cs({
  ten: 'Encapsulation 1 — Segment, packet, frame', kho: 'EASY', phut: 8,
  en: `When curl sends GET /api/hello, each layer wraps what it received from the layer above. tshark counted the headers of the real request:${pre(['frame.len  eth.dst            eth.src            eth.type  ip.hdr_len  ip.len  ip.ttl  ip.proto  tcp.hdr_len  tcp.len', ...FIELDS])}`,
  vi: `Khi curl gửi GET /api/hello, mỗi tầng bọc thứ nhận từ tầng trên. tshark đếm các header của request thật:${pre(['frame.len  eth.dst            eth.src            eth.type  ip.hdr_len  ip.len  ip.ttl  ip.proto  tcp.hdr_len  tcp.len', ...FIELDS])}`,
  cau: [
    q('c1', ['The 83 bytes of HTTP text plus a TCP header are called …', '83 byte chữ HTTP cộng một header TCP được gọi là …'], ['a segment', 'a packet', 'a frame', 'a socket'], ['Data + TCP header = segment; segment + IP header = packet; packet + Ethernet header = frame.', 'Dữ liệu + header TCP = segment; segment + header IP = packet; packet + header Ethernet = frame.']),
    q('c2', ['Why is the frame 149 bytes?', 'Vì sao frame dài 149 byte?'], ['14 Ethernet + 20 IP + 32 TCP + 83 data', '14 Ethernet + 20 IP + 20 TCP + 95 data', '18 Ethernet + 20 IP + 32 TCP + 79 data', '14 Ethernet + 135 IP + 0 TCP + 0 data'], ['ip.len 135 = 20 (IP) + 32 (TCP) + 83 (data); add 14 for Ethernet = 149. The TCP header is 32, not 20, because Linux adds 12 bytes of timestamp options.', 'ip.len 135 = 20 (IP) + 32 (TCP) + 83 (dữ liệu); cộng 14 của Ethernet = 149. Header TCP là 32 chứ không phải 20, vì Linux thêm 12 byte option timestamp.']),
    q('c3', ['What does Ethernet do with the IP packet it carries?', 'Ethernet làm gì với gói IP nó chở?'], ['Treats it as an opaque payload and never looks inside', 'Reads the IP address to choose the next switch port', 'Checks the TCP port to find the right program', 'Rewrites the TTL before handing it to the chip'], ['Each layer treats what is inside as payload. A switch decides by MAC only; reading IP is the router\'s job, reading ports the kernel\'s.', 'Mỗi tầng coi phần bên trong là phần tải. Switch quyết định chỉ bằng MAC; đọc IP là việc của router, đọc cổng là việc của kernel.']),
    q('c4', ['At the receiver, how does the kernel know that an IPv4 packet is inside the frame?', 'Ở bên nhận, sao kernel biết bên trong frame là gói IPv4?'], ['The EtherType field says 0x0800', 'The destination MAC begins with 02', 'The frame is longer than 60 bytes', 'The IP header comes after 14 zeros'], ['Demultiplexing by numbers: EtherType 0x0800 ⇒ IPv4, IP protocol 6 ⇒ TCP, TCP port ⇒ the program.', 'Phân kênh bằng các con số: EtherType 0x0800 ⇒ IPv4, IP protocol 6 ⇒ TCP, cổng TCP ⇒ chương trình.']),
    q('c5', ['On a real cable, which bytes travel but never appear in a capture?', 'Trên cáp thật, những byte nào có đi nhưng không bao giờ hiện trong bản bắt gói?'], ['The preamble, the 4-byte frame checksum and the gap', 'The Ethernet destination and source MAC addresses', 'The IP header checksum and the TTL of the packet', 'The TCP timestamp options added by Linux'], ['8 bytes of preamble, a 4-byte FCS and a 12-byte inter-frame gap are handled by the network chip; captures show the frame from the destination MAC to the end of the payload.', '8 byte preamble, 4 byte FCS và khoảng nghỉ 12 byte do chip mạng xử lý; bản bắt gói hiện frame từ MAC đích tới hết phần tải.']),
  ],
  goiY: [['Segment (TCP) ⊂ packet (IP) ⊂ frame (Ethernet).', 'Segment (TCP) ⊂ packet (IP) ⊂ frame (Ethernet).'], ['ip.len counts everything from the IP header to the end of the data.', 'ip.len đếm mọi thứ từ header IP tới hết dữ liệu.']],
  loi: [['Assuming the TCP header is always 20 bytes.', 'Cho rằng header TCP luôn 20 byte.'], ['Thinking a switch reads IP addresses.', 'Nghĩ switch đọc địa chỉ IP.']],
  tns: [tn('segment / packet / frame', 'đơn vị TCP / IP / Ethernet'), tn('payload', 'phần tải'), tn('EtherType', 'trường loại giao thức trong frame')],
  kn: ['encapsulation'],
});

/* ── 2. Đọc tay từng byte ── */
const B = HX.split('\n').flatMap((d) => d.slice(6, 53).trim().split(/\s+/)).map((x) => parseInt(x, 16));
const hh = (i, n) => B.slice(i, i + n).map((x) => x.toString(16).padStart(2, '0')).join(' ');
const E2 = cs({
  ten: 'Encapsulation 2 — Decode the real frame by hand', kho: 'MEDIUM', phut: 15, loai: 'table',
  en: `The real request frame, printed by tshark -x (the first column is the offset in hex: 0010 = byte 16):${pre(HX)}Find each field and write its value in decimal (flags as names, e.g. <code>SYN, ACK</code>).`,
  vi: `Frame request thật, in bằng tshark -x (cột đầu là offset hệ hex: 0010 = byte 16):${pre(HX)}Tìm từng trường và viết giá trị thập phân (cờ thì ghi tên, vd <code>SYN, ACK</code>).`,
  bang: [bang1('b1', ['Byte by byte', 'Từng byte'], [{ ma: 'x', ten: 'Field' }, { ma: 'b', ten: 'Bytes (offset: hex)' }, { ma: 'v', ten: 'Value' }], [
    { o: { x: 'IP header length (bytes)', b: `14: ${hh(14, 1)}` }, a: { v: ['20'] } },
    { o: { x: 'IP total length', b: `16–17: ${hh(16, 2)}` }, a: { v: ['135'] } },
    { o: { x: 'TTL', b: `22: ${hh(22, 1)}` }, a: { v: ['64'] } },
    { o: { x: 'IP protocol number', b: `23: ${hh(23, 1)}` }, a: { v: ['6'] } },
    { o: { x: 'TCP source port', b: `34–35: ${hh(34, 2)}` }, a: { v: [String(B[34] * 256 + B[35])] } },
    { o: { x: 'TCP destination port', b: `36–37: ${hh(36, 2)}` }, a: { v: ['80'] } },
    { o: { x: 'TCP header length (bytes)', b: `46: ${hh(46, 1)}` }, a: { v: ['32'] } },
    { o: { x: 'TCP flags', b: `47: ${hh(47, 1)}` }, a: { v: ['PSH, ACK', 'PSH,ACK', 'PSH ACK', 'ACK, PSH', 'ACK,PSH', 'ACK PSH'] } },
    { o: { x: 'TCP payload length (bytes)', b: 'from the values above' }, a: { v: ['83'] } },
  ], [`45: the high digit 4 is the version, the low digit 5 counts 4-byte words ⇒ 5 × 4 = 20. 00 87 = 135. 40 = 64. 06 = TCP. ${hh(34, 2)} = ${B[34]} × 256 + ${B[35]} = ${B[34] * 256 + B[35]} (the client's temporary port). 00 50 = 80. 80: the HIGH four bits (8) count 4-byte words ⇒ 32 — the trap is reading 0x80 = 128. 18 = 0001 1000 = ACK (0x10) + PSH (0x08). Payload = 135 − 20 − 32 = 83.`, `45: chữ số cao 4 là phiên bản, chữ số thấp 5 đếm từ 4 byte ⇒ 5 × 4 = 20. 00 87 = 135. 40 = 64. 06 = TCP. ${hh(34, 2)} = ${B[34]} × 256 + ${B[35]} = ${B[34] * 256 + B[35]} (cổng tạm của client). 00 50 = 80. 80: BỐN bit CAO (8) đếm từ 4 byte ⇒ 32 — cái bẫy là đọc 0x80 = 128. 18 = 0001 1000 = ACK (0x10) + PSH (0x08). Phần tải = 135 − 20 − 32 = 83.`])],
  goiY: [['Two-byte fields are big-endian: first byte × 256 + second byte.', 'Trường hai byte là big-endian: byte đầu × 256 + byte sau.'], ['Both header-length fields count 4-byte words: IP uses the low half of byte 14, TCP the high half of byte 46.', 'Cả hai trường độ dài header đều đếm theo từ 4 byte: IP dùng nửa thấp của byte 14, TCP dùng nửa cao của byte 46.']],
  loi: [['Reading the TCP header length 0x80 as 128 bytes.', 'Đọc độ dài header TCP 0x80 thành 128 byte.'], ['Computing the payload as frame length − 54 (forgetting the 12 bytes of TCP options).', 'Tính phần tải bằng độ dài frame − 54 (quên 12 byte option TCP).']],
  tns: [tn('offset', 'vị trí tính từ đầu', 'Số byte tính từ byte đầu tiên, in bằng hex.'), tn('IHL', 'độ dài header IP', 'Internet Header Length — đếm theo từ 4 byte.'), tn('data offset', 'độ dài header TCP', 'Bốn bit cao của byte 12 trong header TCP.')],
  kn: ['frame decoding'],
});

/* ── 3. Tỷ lệ hữu ích ── */
const ROWS = [
  ['our GET /api/hello (c12-goi)', 149, 83],
  ['a full data segment of /big', 1514, 1448],
  ['the last segment of /big', 1161, 1095],
  ['a bare ACK', 66, 0],
  ['the SYN that opens the connection', 74, 0],
  ['the HTTP/JSON response to /api/hello', 370, 304],
  ['GET /big', 143, 77],
];
const E3 = cs({
  ten: 'Encapsulation 3 — How much of each frame is useful?', kho: 'MEDIUM', phut: 12, loai: 'table',
  en: 'All frame sizes and data sizes below come from real captures in lessons 1.2–1.3. Fill in the bytes of headers (everything that is not TCP data) and the useful share = data ÷ frame, as a percentage rounded to 0.1.',
  vi: 'Mọi kích thước frame và dữ liệu dưới đây lấy từ bản bắt gói thật ở bài 1.2–1.3. Điền số byte header (mọi thứ không phải dữ liệu TCP) và tỷ lệ hữu ích = dữ liệu ÷ frame, theo phần trăm làm tròn 0,1.',
  bang: [bang1('b1', ['Overhead', 'Chi phí header'], [{ ma: 'x', ten: 'Frame' }, { ma: 'f', ten: 'Frame (B)' }, { ma: 'd', ten: 'TCP data (B)' }, { ma: 'h', ten: 'Headers (B)' }, { ma: 'p', ten: 'Useful share (%)' }],
    ROWS.map(([x, f, d]) => ({ o: { x, f: String(f), d: String(d) }, a: { h: [String(f - d)], p: soNhan(d * 100 / f, 1, true) } })),
    ['Most frames carry 66 bytes of headers (14 + 20 + 32). The SYN carries 74 − 0: its TCP header is 40 bytes because the handshake announces MSS, SACK, timestamps and window scale. Headers cost the same whatever they carry, so a full segment is 95.6 % useful while our small GET is only 55.7 % — and a bare ACK 0 %. Many tiny messages on new connections spend most of the traffic on envelopes.', 'Hầu hết frame mang 66 byte header (14 + 20 + 32). SYN mang 74 − 0: header TCP của nó 40 byte vì bắt tay khai báo MSS, SACK, timestamp và window scale. Header tốn như nhau dù chở gì, nên một segment đầy hữu ích 95,6 % còn GET nhỏ của ta chỉ 55,7 % — ACK trần 0 %. Nhiều thông điệp tí hon trên kết nối mới tiêu phần lớn lưu lượng vào "phong bì".'])],
  goiY: [['Headers = frame − data.', 'Header = frame − dữ liệu.'], ['Share = data × 100 ÷ frame; 83 × 100 ÷ 149 = 55.70…', 'Tỷ lệ = dữ liệu × 100 ÷ frame; 83 × 100 ÷ 149 = 55,70…']],
  loi: [['Dividing by the data instead of the frame.', 'Chia cho dữ liệu thay vì cho frame.'], ['Assuming every frame has exactly 54 bytes of headers.', 'Cho rằng frame nào cũng đúng 54 byte header.']],
  tns: [tn('overhead', 'chi phí phụ', 'Byte header không phải dữ liệu người dùng.'), tn('goodput', 'thông lượng hữu ích'), tn('ACK', 'gói xác nhận')],
  kn: ['overhead'],
});

/* ── 4. MTU, MSS, offload ── */
const P1 = sauLenh('c12-goi', 'ping -c 1 -M do -s 1472').slice(0, 2);
const P2 = sauLenh('c12-goi', 'ping -c 1 -M do -s 1473').slice(0, 2);
const ON = sauLenh('c12-big-on', 'tshark');
const E4 = cs({
  ten: 'Encapsulation 4 — MTU, MSS, and the packet that is too big', kho: 'MEDIUM', phut: 12,
  en: `Real output from the lab client:${pre(['$ ping -c 1 -M do -s 1472 10.10.2.10', ...P1, '$ ping -c 1 -M do -s 1473 10.10.2.10', ...P2, '', '# /big with segmentation offload on (the default):', '$ tshark … -T fields -e frame.number -e frame.len -e tcp.len', ...ON])}`,
  vi: `Output thật trên máy client của lab:${pre(['$ ping -c 1 -M do -s 1472 10.10.2.10', ...P1, '$ ping -c 1 -M do -s 1473 10.10.2.10', ...P2, '', '# /big khi segmentation offload đang bật (mặc định):', '$ tshark … -T fields -e frame.number -e frame.len -e tcp.len', ...ON])}`,
  cau: [
    q('c1', ['Why does 1472 bytes of ping data make exactly a 1500-byte packet?', 'Vì sao 1472 byte dữ liệu ping tạo đúng một gói 1500 byte?'], ['1472 + 8 (ICMP) + 20 (IP) = 1500', '1472 + 14 (Ethernet) + 14 = 1500', '1472 + 20 (TCP) + 8 (UDP) = 1500', '1472 + 28 (Ethernet trailer) = 1500'], ['MTU counts the IP packet: IP header 20 + ICMP header 8 + data. 1473 would make 1501 > 1500, and with "don\'t fragment" (-M do) the kernel refuses: Message too long.', 'MTU tính gói IP: header IP 20 + header ICMP 8 + dữ liệu. 1473 cho ra 1501 > 1500, và khi có "không phân mảnh" (-M do) kernel từ chối: Message too long.']),
    q('c2', ['Every SYN in the lab announced MSS=1460, yet full segments carried 1448 bytes. Why?', 'Mọi SYN trong lab khai báo MSS=1460, vậy mà segment đầy chỉ chở 1448 byte. Vì sao?'], ['Linux adds 12 bytes of TCP timestamps to every segment', 'The router removes 12 bytes from every packet it forwards', 'Ethernet needs 12 bytes of padding in every full frame', 'nginx reserves 12 bytes for the HTTP status line'], ['MSS = 1500 − 20 (IP) − 20 (basic TCP). The timestamp option (12 bytes) lives in the TCP header of every segment, so 1460 − 12 = 1448 bytes are left for data.', 'MSS = 1500 − 20 (IP) − 20 (TCP cơ bản). Option timestamp (12 byte) nằm trong header TCP của mọi segment, nên còn 1460 − 12 = 1448 byte cho dữ liệu.']),
    q('c3', ['With offload on, one captured "packet" was 4057 bytes, far above the MTU. What is going on?', 'Khi bật offload, một "gói" bắt được dài 4057 byte, vượt xa MTU. Chuyện gì xảy ra?'], ['The capture saw the big chunk before the card cut it into segments', 'The link really carries 4057-byte frames because the MTU is broken', 'The router glued three segments together before the web server', 'tshark merged three frames because they arrived at the same time'], ['TSO/GSO: the kernel hands one large chunk to the card (or driver) which cuts it into MTU-sized segments just before sending. tcpdump captures before the cut. With offload off the same response shows 1514, 1514, 1161.', 'TSO/GSO: kernel đưa một khối lớn cho card (hoặc driver) và nó cắt thành các segment vừa MTU ngay trước khi gửi. tcpdump bắt trước lúc cắt. Tắt offload thì cùng phản hồi đó hiện 1514, 1514, 1161.']),
    q('c4', ['A WireGuard VPN uses MTU 1420. With timestamps, how many data bytes fit in a full TCP segment?', 'VPN WireGuard dùng MTU 1420. Có timestamp thì một segment TCP đầy chở được bao nhiêu byte dữ liệu?'], ['1368', '1380', '1448', '1408'], ['1420 − 20 (IP) − 20 (TCP) − 12 (timestamps) = 1368. 1380 is the MSS it announces, before the options.', '1420 − 20 (IP) − 20 (TCP) − 12 (timestamp) = 1368. 1380 là MSS nó khai báo, trước khi trừ option.']),
    q('c5', ['A teammate sees a 23 000-byte "packet" in a capture on the production server and wants to change the MTU. You say …', 'Một bạn thấy "gói" 23 000 byte khi bắt trên server production và muốn đổi MTU. Bạn nói …'], ['it is segmentation offload; the frames on the wire still respect 1500', 'it proves jumbo frames are on, so set the MTU to 23 000 everywhere', 'it is IP fragmentation; the receiver will drop the whole packet', 'it means the capture is corrupt and must be taken again'], ['Capture on the wire, or turn offload off on a test machine (ethtool -K eth0 tso off gso off), and you will see segments that fit the MTU. Changing the MTU would break things that work.', 'Bắt trên dây, hoặc tắt offload trên máy thử (ethtool -K eth0 tso off gso off), bạn sẽ thấy các segment vừa MTU. Đổi MTU sẽ làm hỏng thứ đang chạy tốt.']),
  ],
  goiY: [['MTU limits the IP packet (IP header + everything inside), not the Ethernet frame.', 'MTU giới hạn gói IP (header IP + mọi thứ bên trong), không phải frame Ethernet.'], ['Data per segment = MTU − 20 − 20 − options.', 'Dữ liệu mỗi segment = MTU − 20 − 20 − option.']],
  loi: [['Subtracting the 14 Ethernet bytes from the MTU.', 'Trừ 14 byte Ethernet khỏi MTU.'], ['Trusting a capture taken before segmentation offload.', 'Tin bản bắt gói chụp trước khi segmentation offload cắt gói.']],
  tns: [tn('MTU', 'đơn vị truyền tối đa', 'Gói IP lớn nhất đi được trong một frame — 1500 với Ethernet.'), tn('MSS', 'kích thước segment tối đa'), tn('TSO / GSO', 'cắt segment ở card/driver')],
  kn: ['MTU', 'MSS', 'segmentation offload'],
});

/* ── 5. Tự viết: cắt segment ── */
function segments(totalBytes, mtu, timestamps) {
  if (timestamps === undefined) timestamps = true;   // Linux sends TCP timestamps by default
  var room = mtu - 20 - 20 - (timestamps ? 12 : 0);  // IP header, basic TCP header, timestamp option
  var out = [];
  for (var left = totalBytes; left > 0; left -= room) out.push(Math.min(left, room));
  return out;                                        // 0 bytes ⇒ no data segment at all
}
function frameSizes(totalBytes, mtu, timestamps) {
  if (timestamps === undefined) timestamps = true;
  var headers = 14 + 20 + 20 + (timestamps ? 12 : 0); // Ethernet + IP + TCP (+ options)
  return segments(totalBytes, mtu, timestamps).map(function (d) { return d + headers; });
}
const OFF = sauLenh('c12-big-off', "tshark -r /tmp/b2.pcap -Y 'tcp.srcport == 80 and tcp.len > 0'");
const E5 = jsBai({
  ten: 'Encapsulation 5 — Write segments() and frameSizes()', kho: 'MEDIUM', phut: 20,
  en: `<p>The lab's /big response is 3991 bytes (headers + body). With offload off, the web server sent it like this:</p>${pre(['$ tshark … -e frame.number -e frame.len -e tcp.len', ...OFF])}<p>Write two functions:</p>
<ol>
<li><code>segments(totalBytes, mtu, timestamps)</code> ⇒ the TCP data size of each segment, in order. Room per segment = <code>mtu − 20 (IP) − 20 (TCP) − 12</code> when <code>timestamps</code> is true (Linux default), without the 12 when false. Every segment is full except possibly the last. <code>timestamps</code> may be missing ⇒ true. 0 bytes ⇒ <code>[]</code>.</li>
<li><code>frameSizes(totalBytes, mtu, timestamps)</code> ⇒ the size of each captured frame = data + 14 (Ethernet) + 20 (IP) + 20 (TCP) + 12 if timestamps.</li>
</ol>
<p><code>segments(3991, 1500)</code> must give <code>[1448, 1448, 1095]</code> and <code>frameSizes(3991, 1500)</code> must give <code>[1514, 1514, 1161]</code> — the real capture above. The other cases try a WireGuard MTU (1420), jumbo frames (9000), no timestamps and exact multiples.</p>`,
  vi: `<p>Phản hồi /big của lab dài 3991 byte (header + thân). Khi tắt offload, web server gửi nó như sau:</p>${pre(['$ tshark … -e frame.number -e frame.len -e tcp.len', ...OFF])}<p>Viết hai hàm:</p>
<ol>
<li><code>segments(totalBytes, mtu, timestamps)</code> ⇒ kích thước dữ liệu TCP của từng segment, theo thứ tự. Chỗ trống mỗi segment = <code>mtu − 20 (IP) − 20 (TCP) − 12</code> khi <code>timestamps</code> là true (mặc định của Linux), bỏ 12 khi false. Mọi segment đều đầy trừ có thể segment cuối. <code>timestamps</code> có thể vắng ⇒ true. 0 byte ⇒ <code>[]</code>.</li>
<li><code>frameSizes(totalBytes, mtu, timestamps)</code> ⇒ kích thước mỗi frame bắt được = dữ liệu + 14 (Ethernet) + 20 (IP) + 20 (TCP) + 12 nếu có timestamp.</li>
</ol>
<p><code>segments(3991, 1500)</code> phải cho <code>[1448, 1448, 1095]</code> và <code>frameSizes(3991, 1500)</code> phải cho <code>[1514, 1514, 1161]</code> — đúng bản bắt gói thật ở trên. Các ca khác thử MTU của WireGuard (1420), jumbo frame (9000), không timestamp và bội số chẵn.</p>`,
  dauVao: ['totalBytes ≥ 0, mtu ≥ 100 (integers); timestamps — boolean or missing.', 'totalBytes ≥ 0, mtu ≥ 100 (số nguyên); timestamps — boolean hoặc vắng.'],
  dauRa: ['Arrays of integers.', 'Mảng số nguyên.'],
  goiY: [['room = mtu − 40 − (timestamps ? 12 : 0). Then cut totalBytes into pieces of room.', 'room = mtu − 40 − (timestamps ? 12 : 0). Rồi cắt totalBytes thành các mẩu dài room.'], ['A loop "while left > 0: push min(left, room)" never produces a 0-byte segment, even for exact multiples like 2896.', 'Vòng lặp "khi left > 0: push min(left, room)" không bao giờ sinh segment 0 byte, kể cả với bội số chẵn như 2896.'], ['frameSizes = segments(…).map(d ⇒ d + headers) — reuse the first function.', 'frameSizes = segments(…).map(d ⇒ d + headers) — dùng lại hàm thứ nhất.']],
  loi: [['Using MSS 1460 (forgetting the 12 bytes of timestamps) — the result no longer matches the capture.', 'Dùng MSS 1460 (quên 12 byte timestamp) — kết quả không còn khớp bản bắt gói.'], ['Math.ceil(total / room) segments with the last one = total % room: for 2896 the remainder is 0 and you emit an empty segment.', 'Math.ceil(total / room) segment với segment cuối = total % room: với 2896 phần dư là 0 và bạn sinh một segment rỗng.'], ['Writing if (!timestamps) — a missing argument then means "no timestamps".', 'Viết if (!timestamps) — đối số vắng khi đó thành "không timestamp".']],
  gt: ['TCP never sends more data per segment than the path allows: MTU minus the IP and TCP headers, minus the options present in every segment. Cutting greedily (full segments, remainder last) is exactly what the capture shows, and adding the fixed 66 (or 54) bytes of headers gives the frame sizes on the wire. This is also why a 3991-byte response costs three frames, not one.', 'TCP không bao giờ gửi nhiều dữ liệu hơn mức đường đi cho phép mỗi segment: MTU trừ header IP và TCP, trừ các option có trong mọi segment. Cắt tham lam (segment đầy, phần dư cuối) đúng là điều bản bắt gói cho thấy, và cộng 66 (hoặc 54) byte header cố định ra kích thước frame trên dây. Đó cũng là lý do một phản hồi 3991 byte tốn ba frame chứ không phải một.'],
  kn: ['segmentation', 'MSS'],
  tns: [tn('segmentation', 'phân đoạn'), tn('jumbo frame', 'frame cỡ lớn', 'MTU 9000, dùng trong trung tâm dữ liệu.'), tn('greedy', 'tham lam', 'Lấy nhiều nhất có thể ở mỗi bước.')],
  dau: `function segments(totalBytes, mtu, timestamps) {
  // Write your solution here
  return [totalBytes];
}

function frameSizes(totalBytes, mtu, timestamps) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution\n' + nguon(segments, frameSizes),
  cases: [
    { goi: 'segments(3991, 1500)' }, { goi: 'frameSizes(3991, 1500)' }, { goi: 'segments(3991, 1420)' }, { goi: 'segments(83, 1500)' },
    { goi: 'segments(3991, 9000)', an: true }, { goi: 'segments(3991, 1500, false)', an: true }, { goi: 'frameSizes(3991, 1500, false)', an: true },
    { goi: 'segments(2896, 1500)', an: true }, { goi: 'segments(0, 1500)', an: true }, { goi: 'segments(1, 1500, true)', an: true },
    { goi: 'segments(65535, 1500)', an: true }, { goi: 'frameSizes(10000, 1420)', an: true },
  ],
});

/* ── 6. Tự viết: parseFrame ── */
function parseFrame(text) {
  // 1. Keep only the hex columns: in every "0000  02 00 0a …   ascii" line they are characters 6–52.
  //    The ASCII column on the right must never be parsed (it can contain anything).
  var b = [];
  text.split('\n').forEach(function (line) {
    if (!/^[0-9a-f]{4}  /.test(line)) return;
    line.slice(6, 53).trim().split(/\s+/).forEach(function (x) { if (x) b.push(parseInt(x, 16)); });
  });
  function hex2(n) { return (n < 16 ? '0' : '') + n.toString(16); }
  function macAt(i) { return b.slice(i, i + 6).map(hex2).join(':'); }
  function u16(i) { return b[i] * 256 + b[i + 1]; }
  function ipAt(i) { return b.slice(i, i + 4).join('.'); }
  // 2. Ethernet: 14 bytes. 3. IPv4 starts at 14; its length is in the LOW four bits of the first byte (× 4).
  var ip = 14;
  var ipHeaderLen = (b[ip] & 0x0f) * 4;
  var ipTotalLen = u16(ip + 2);
  // 4. TCP starts right after the IP header; its length is in the HIGH four bits of byte 12 (× 4).
  var tcp = ip + ipHeaderLen;
  var tcpHeaderLen = (b[tcp + 12] >> 4) * 4;
  var names = ['FIN', 'SYN', 'RST', 'PSH', 'ACK', 'URG', 'ECE', 'CWR'];   // bit 0 … bit 7 of byte 13
  var flags = names.filter(function (_, i) { return (b[tcp + 13] >> i) & 1; });
  // 5. The payload length comes from the IP total length, NOT from the frame size (short frames carry padding).
  return {
    dstMac: macAt(0), srcMac: macAt(6), etherType: '0x' + hex2(b[12]) + hex2(b[13]),
    ipHeaderLen: ipHeaderLen, ipTotalLen: ipTotalLen, ttl: b[ip + 8], protocol: b[ip + 9],
    srcIp: ipAt(ip + 12), dstIp: ipAt(ip + 16),
    srcPort: u16(tcp), dstPort: u16(tcp + 2), tcpHeaderLen: tcpHeaderLen, flags: flags,
    payloadLen: ipTotalLen - ipHeaderLen - tcpHeaderLen, payloadStart: tcp + tcpHeaderLen,
  };
}
// Các frame DỰNG cho ca ẩn (không phải bản bắt thật) — địa chỉ lấy từ phòng lab, giá trị khác đi để lời giải chép cứng phải trượt.
const F_ACK = inX(dungFrame({ dstMac: '02:00:0a:0a:02:0a', srcMac: '02:00:0a:0a:02:fe', id: 0x1c2d, ttl: 63, srcIp: '10.10.1.11', dstIp: '10.10.2.10', srcPort: 38458, dstPort: 80, seq: 912345678, ack: 3141592653, flags: 0x10, window: 502, padTo: 60 }));
const F_OPT = inX(dungFrame({ dstMac: '02:00:0a:0a:01:fe', srcMac: '02:00:0a:0a:01:0b', id: 0x7a01, ttl: 64, srcIp: '10.10.1.11', dstIp: '10.10.2.20', srcPort: 51000, dstPort: 3000, seq: 77, ack: 99, flags: 0x18, window: 63, ipOptions: [0x94, 0x04, 0x00, 0x00], tcpOptions: tsOpt(1000, 2000), payload: 'GET /api/hello HTTP/1.1\r\nHost: 10.10.2.20:3000\r\nX-Trace: ab cd ef 01\r\n\r\n' }));
const F_SYN = inX(dungFrame({ dstMac: '02:00:0a:0a:01:0a', srcMac: '02:00:0a:0a:01:fe', id: 0, ttl: 63, srcIp: '10.10.2.10', dstIp: '10.10.1.10', srcPort: 80, dstPort: 53122, seq: 645412402, ack: 4169172724, flags: 0x12, window: 65160, tcpOptions: [2, 4, 0x05, 0xb4, 4, 2, ...tsOpt(1728986107, 2099662575).slice(2), 1, 3, 3, 10] }));
const E6 = jsBai({
  ten: 'Encapsulation 6 — Write parseFrame(text): read a frame byte by byte', kho: 'HARD', phut: 40,
  en: `<p>Stop trusting the tool and read the bytes yourself. Write <code>parseFrame(text)</code>: <code>text</code> is exactly what <code>tshark -x</code> prints for one Ethernet II / IPv4 / TCP frame — lines of an offset, up to 16 hex bytes, and an ASCII column:</p>${pre(HX)}<p>Return:</p>${pre(JSON.stringify({ dstMac: '02:00:0a:0a:01:fe', srcMac: '02:00:0a:0a:01:0a', etherType: '0x0800', ipHeaderLen: 20, ipTotalLen: 135, ttl: 64, protocol: 6, srcIp: '10.10.1.10', dstIp: '10.10.2.10', srcPort: 40454, dstPort: 80, tcpHeaderLen: 32, flags: ['PSH', 'ACK'], payloadLen: 83, payloadStart: 66 }, null, 1))}
<ul>
<li>MACs: six bytes, lower-case hex, colons. <code>etherType</code>: <code>'0x'</code> + four hex digits.</li>
<li>IP header length = low 4 bits of byte 14 × 4; it can be more than 20 (IP options). TCP starts right after it; TCP header length = high 4 bits of TCP byte 12 × 4.</li>
<li><code>flags</code>: names of the bits set in TCP byte 13, from bit 0 upward: FIN, SYN, RST, PSH, ACK, URG, ECE, CWR — so 0x18 ⇒ <code>['PSH', 'ACK']</code>, 0x12 ⇒ <code>['SYN', 'ACK']</code>.</li>
<li><code>payloadLen</code> = IP total length − IP header − TCP header; <code>payloadStart</code> = the offset of the first data byte.</li>
</ul>
<p>Visible cases: the frame above and the client-side frame of lesson 1.4. Hidden cases: the <b>real</b> web-side frame of lesson 1.4 (after the router), and three frames <b>constructed for this exercise</b> from the lab's addresses with other values — a SYN-ACK with 20 bytes of options, an ACK padded to 60 bytes as a receiver sees it, and a request with IP options. A solution with fixed offsets or copied values fails them.</p>`,
  vi: `<p>Thôi tin công cụ, tự đọc các byte. Viết <code>parseFrame(text)</code>: <code>text</code> đúng là thứ <code>tshark -x</code> in ra cho một frame Ethernet II / IPv4 / TCP — các dòng gồm offset, tối đa 16 byte hex, và một cột ASCII:</p>${pre(HX)}<p>Trả về:</p>${pre(JSON.stringify({ dstMac: '02:00:0a:0a:01:fe', srcMac: '02:00:0a:0a:01:0a', etherType: '0x0800', ipHeaderLen: 20, ipTotalLen: 135, ttl: 64, protocol: 6, srcIp: '10.10.1.10', dstIp: '10.10.2.10', srcPort: 40454, dstPort: 80, tcpHeaderLen: 32, flags: ['PSH', 'ACK'], payloadLen: 83, payloadStart: 66 }, null, 1))}
<ul>
<li>MAC: sáu byte, hex chữ thường, dấu hai chấm. <code>etherType</code>: <code>'0x'</code> + bốn chữ số hex.</li>
<li>Độ dài header IP = 4 bit thấp của byte 14 × 4; có thể lớn hơn 20 (option IP). TCP bắt đầu ngay sau đó; độ dài header TCP = 4 bit cao của byte 12 trong TCP × 4.</li>
<li><code>flags</code>: tên các bit bật trong byte 13 của TCP, từ bit 0 trở lên: FIN, SYN, RST, PSH, ACK, URG, ECE, CWR — nên 0x18 ⇒ <code>['PSH', 'ACK']</code>, 0x12 ⇒ <code>['SYN', 'ACK']</code>.</li>
<li><code>payloadLen</code> = tổng độ dài IP − header IP − header TCP; <code>payloadStart</code> = offset của byte dữ liệu đầu tiên.</li>
</ul>
<p>Ca hiện: frame ở trên và frame phía client của bài 1.4. Ca ẩn: frame <b>thật</b> phía web của bài 1.4 (sau router), và ba frame <b>dựng riêng cho bài này</b> từ địa chỉ của lab với giá trị khác — một SYN-ACK có 20 byte option, một ACK được đệm tới 60 byte như máy nhận thấy, và một request có option IP. Lời giải dùng offset cố định hay chép giá trị sẽ trượt.</p>`,
  dauVao: ['text — the tshark -x output of one frame (lines separated by \\n).', 'text — output tshark -x của một frame (các dòng cách nhau bởi \\n).'],
  dauRa: ['An object with the 15 fields shown above.', 'Một object với 15 trường như trên.'],
  rangBuoc: [['Ethernet II, IPv4 and TCP only. The IP header is 20–60 bytes, the TCP header 20–60 bytes.', 'Chỉ Ethernet II, IPv4 và TCP. Header IP 20–60 byte, header TCP 20–60 byte.'], ['Short frames may end with padding bytes that belong to no layer.', 'Frame ngắn có thể kết thúc bằng byte đệm không thuộc tầng nào.']],
  goiY: [
    ['Step 1 only: turn the text into an array of numbers. Take characters 6 to 52 of every line that starts with four hex digits and two spaces, split on spaces, parseInt(x, 16).', 'Chỉ bước 1: đổi chữ thành mảng số. Lấy ký tự 6 tới 52 của mỗi dòng bắt đầu bằng bốn chữ số hex và hai dấu cách, tách theo dấu cách, parseInt(x, 16).'],
    ['Write small helpers: u16(i) = b[i] × 256 + b[i + 1], macAt(i), ipAt(i). Then IPv4 starts at 14 and TCP at 14 + ipHeaderLen — never at a fixed 34.', 'Viết các hàm nhỏ: u16(i) = b[i] × 256 + b[i + 1], macAt(i), ipAt(i). Rồi IPv4 bắt đầu ở 14 còn TCP ở 14 + ipHeaderLen — không bao giờ cố định 34.'],
    ['Flags: test (byte >> i) & 1 for i = 0…7 against the name list. Payload length: use the IP total length, because the padded ACK is 60 bytes but carries 0 bytes of data.', 'Cờ: thử (byte >> i) & 1 với i = 0…7 theo danh sách tên. Độ dài phần tải: dùng tổng độ dài IP, vì ACK được đệm dài 60 byte nhưng chở 0 byte dữ liệu.'],
  ],
  loi: [
    ['Splitting the whole line on spaces: the ASCII column (e.g. "..E." or a header like "X-Trace: ab cd ef 01") then adds fake bytes.', 'Tách cả dòng theo dấu cách: cột ASCII (vd "..E." hay một header như "X-Trace: ab cd ef 01") khi đó thêm byte giả.'],
    ['Hard-coding the TCP start at 34 and the payload at 66: a frame with IP options or without TCP timestamps breaks.', 'Cố định TCP bắt đầu ở 34 và phần tải ở 66: frame có option IP hoặc không có timestamp TCP sẽ hỏng.'],
    ['payloadLen = frame length − headers: the padded 60-byte ACK then "carries" 6 bytes of data.', 'payloadLen = độ dài frame − header: ACK đệm 60 byte khi đó "chở" 6 byte dữ liệu.'],
  ],
  gt: ['Every length in these headers is written in the packet itself, so a parser never guesses: the IP header says how long it is (IHL × 4), which tells you where TCP starts; TCP says how long its header is (data offset × 4), which tells you where the data starts; and the IP total length says where the packet ends — anything after it is Ethernet padding. That chain of "this header tells me where the next begins" is exactly how the kernel demultiplexes a frame, and it is why the same code reads the real frames on both sides of the router and the constructed ones.', 'Mọi độ dài trong các header này đều được ghi ngay trong gói, nên trình phân tích không bao giờ phải đoán: header IP nói nó dài bao nhiêu (IHL × 4), từ đó biết TCP bắt đầu ở đâu; TCP nói header của nó dài bao nhiêu (data offset × 4), từ đó biết dữ liệu bắt đầu ở đâu; và tổng độ dài IP nói gói kết thúc ở đâu — phần sau đó là byte đệm của Ethernet. Chuỗi "header này cho biết header sau bắt đầu ở đâu" chính là cách kernel phân kênh một frame, và là lý do cùng một đoạn code đọc được frame thật ở hai phía router lẫn các frame dựng.'],
  kn: ['frame parsing', 'IPv4 header', 'TCP header'],
  tns: [tn('IHL', 'độ dài header IP (đơn vị 4 byte)'), tn('data offset', 'độ dài header TCP (đơn vị 4 byte)'), tn('padding', 'byte đệm', 'Ethernet đệm frame ngắn cho đủ 60 byte (chưa tính FCS).'), tn('flags', 'các cờ TCP', 'SYN, ACK, PSH, FIN, RST…')],
  dau: `/**
 * text: the output of "tshark -x" for one Ethernet II / IPv4 / TCP frame.
 * Return { dstMac, srcMac, etherType, ipHeaderLen, ipTotalLen, ttl, protocol, srcIp, dstIp,
 *          srcPort, dstPort, tcpHeaderLen, flags, payloadLen, payloadStart }.
 */
function parseFrame(text) {
  // Step 1: text ⇒ array of byte values (hex columns only)
  var b = [];

  // Step 2: read the fields from b
  return {};
}
`,
  giai: '// Reference solution\n' + nguon(parseFrame),
  cases: [
    { goi: goi('parseFrame', HX), moTa: ['The real request frame of lesson 1.3', 'Frame request thật của bài 1.3'] },
    { goi: goi('parseFrame', HC), moTa: ['The real client-side frame of lesson 1.4', 'Frame thật phía client của bài 1.4'] },
    { goi: goi('parseFrame', HW), an: true, moTa: ['Hidden: the real web-side frame (after the router)', 'Ẩn: frame thật phía web (sau router)'] },
    { goi: goi('parseFrame', F_SYN), an: true, moTa: ['Hidden: constructed SYN-ACK with 20 bytes of TCP options', 'Ẩn: SYN-ACK dựng, 20 byte option TCP'] },
    { goi: goi('parseFrame', F_ACK), an: true, moTa: ['Hidden: constructed bare ACK padded to 60 bytes', 'Ẩn: ACK trần dựng, đệm tới 60 byte'] },
    { goi: goi('parseFrame', F_OPT), an: true, moTa: ['Hidden: constructed request with 4 bytes of IP options', 'Ẩn: request dựng, có 4 byte option IP'] },
  ],
  vdGt: ['14 + 20 + 32 = 66: the HTTP data starts at byte 66 and is 135 − 20 − 32 = 83 bytes long.', '14 + 20 + 32 = 66: dữ liệu HTTP bắt đầu ở byte 66 và dài 135 − 20 − 32 = 83 byte.'],
});

export default doiDau({ slug: 'netdev-1-2-dong-goi', ten: '1.3 Encapsulation: reading one frame byte by byte', khoa: KHOA, baiHoc: 'netdev-1-2-dong-goi', de: [E1, E2, E3, E4, E5, E6] });
