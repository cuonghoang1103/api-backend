/** NWC204 · Luyện FE — hai đề thi thử 20 câu theo dạng FE của trường (Computer Networking). KHÔNG chép đề thật; số liệu tính bằng mã. */
import { doiDau, KHOA, S, bi, tinh, q, mcNum, tn } from './_nw.mjs';

const T = (a, b) => [a, b];
const f1 = (x) => Number(x).toFixed(1);

/* ───────── Đề A ───────── */
const net1 = S.ipInfo('172.16.77.9', 20), net2 = S.ipInfo('203.0.113.130', 28);
const fr1 = S.fragment(3000, 1000), cr1 = S.crcBits('110101', '1011');
const rt = [{ net: '0.0.0.0/0', nh: 'R9' }, { net: '10.0.0.0/8', nh: 'R1' }, { net: '10.10.0.0/16', nh: 'R2' }, { net: '10.10.10.0/24', nh: 'R3' }];
const CA = [
  q('a1', T('Which OSI layer is responsible for end-to-end delivery and port numbers?', 'Tầng OSI nào lo chuyển giao đầu-cuối và số cổng?'), ['Transport', 'Network', 'Data link', 'Session'], T('Layer 4.', 'Tầng 4.')),
  q('a2', T('A switch builds its MAC address table from the __________ address of incoming frames.', 'Switch xây bảng MAC từ địa chỉ __________ của frame đến.'), ['source MAC', 'destination MAC', 'source IP', 'destination IP'], T('Learn from the source.', 'Học từ nguồn.')),
  q('a3', T('The default gateway is used when the destination is …', 'Default gateway được dùng khi đích …'), ['on a different network', 'on the same network', 'a broadcast address', 'the host itself'], T('Same network ⇒ ARP for the destination.', 'Cùng mạng ⇒ ARP cho đích.')),
  q('a4', T('DHCP messages are exchanged in the order …', 'Thông điệp DHCP trao đổi theo thứ tự …'), ['Discover, Offer, Request, Acknowledge', 'Request, Offer, Discover, Acknowledge', 'Offer, Discover, Acknowledge, Request', 'Discover, Request, Offer, Acknowledge'], T('DORA.', 'DORA.')),
  q('a5', T('Which device creates a separate broadcast domain on each interface?', 'Thiết bị nào tạo miền broadcast riêng trên mỗi giao diện?'), ['Router', 'Switch', 'Hub', 'Repeater'], T('Routers do not forward broadcasts.', 'Router không chuyển broadcast.')),
  q('a6', T('The three-way handshake of TCP is …', 'Bắt tay ba bước của TCP là …'), ['SYN, SYN-ACK, ACK', 'SYN, ACK, FIN', 'ACK, SYN, SYN', 'SYN, RST, ACK'], T('It synchronises both initial sequence numbers.', 'Nó đồng bộ hai số thứ tự khởi đầu.')),
  q('a7', T('A link-local IPv6 address begins with …', 'Địa chỉ IPv6 link-local bắt đầu bằng …'), ['fe80', '2001', 'fc00', 'ff02'], T('fe80::/10.', 'fe80::/10.')),
  q('a8', T('An ACL ends with an implicit …', 'Cuối ACL có một … ngầm.'), ['deny any', 'permit any', 'log', 'reject'], T('Unmatched packets are dropped.', 'Gói không khớp bị loại.')),
  q('a9', T('PAT lets many inside hosts share one public IP by changing the …', 'PAT cho nhiều host trong dùng chung một IP công cộng bằng cách đổi …'), ['source port', 'destination MAC', 'TTL', 'VLAN ID'], T('Each flow gets its own public port.', 'Mỗi luồng có cổng công cộng riêng.')),
  q('a10', T('A trunk port carries traffic using the __________ standard.', 'Cổng trunk mang lưu lượng theo chuẩn __________.'), ['IEEE 802.1Q', 'IEEE 802.3', 'IEEE 802.11', 'IEEE 802.1X'], T('802.1Q inserts a 4-byte VLAN tag.', '802.1Q chèn thẻ VLAN 4 byte.')),
];
CA.push(
  mcNum('a11', T('The network address of 172.16.77.9/20 is …', 'Địa chỉ mạng của 172.16.77.9/20 là …'), net1.network, ['172.16.77.0', '172.16.64.1', '172.16.80.0'], null, T(`Block size 16 in the third octet: 64 ≤ 77 < 80 → ${net1.network}.`, `Khối 16 ở octet thứ ba: 64 ≤ 77 < 80 → ${net1.network}.`)),
  mcNum('a12', T('The number of usable hosts in 203.0.113.130/28 is …', 'Số host dùng được trong 203.0.113.130/28 là …'), net2.hosts, [16, 30, 15], null, T('2⁴ − 2 = 14.', '2⁴ − 2 = 14.')),
  mcNum('a13', T('Which prefix gives the smallest subnet that holds 60 hosts?', 'Prefix nào cho mạng con nhỏ nhất đủ chứa 60 host?'), '/26', ['/27', '/25', '/28'], null, T('2⁶ − 2 = 62 ≥ 60.', '2⁶ − 2 = 62 ≥ 60.')),
  mcNum('a14', T('A 1500-byte packet crosses a 100 Mbps link. The transmission time is …', 'Gói 1500 byte đi qua đường 100 Mbps. Thời gian truyền là …'), '120 µs', ['12 µs', '1.2 ms', '15 µs'], null, T('12000 bits ÷ 10⁸ = 120 µs.', '12000 bit ÷ 10⁸ = 120 µs.')),
  mcNum('a15', T('The shortest form of 2001:0db8:0000:0000:0000:0000:0000:0001 is …', 'Dạng ngắn nhất của 2001:0db8:0000:0000:0000:0000:0000:0001 là …'), S.ipv6Compress('2001:0db8:0000:0000:0000:0000:0000:0001'), ['2001:db8:0:0:0:0:0:1', '2001:db8::0:1', '2001:db8:::1'], null, T('Remove leading zeros and compress the long zero run once.', 'Bỏ số 0 đầu và nén dãy 0 dài một lần.')),
  mcNum('a16', T('A 3000-byte IP packet (20-byte header) crosses a link with MTU 1000. The number of fragments is …', 'Gói IP 3000 byte (header 20 byte) qua liên kết MTU 1000. Số mảnh là …'), fr1.length, [3, 5, 2], null, T('Data 2980 ÷ 976 per fragment → 4 fragments.', 'Dữ liệu 2980 ÷ 976 mỗi mảnh → 4 mảnh.')),
  mcNum('a17', T('The CRC remainder of data 110101 with generator 1011 is …', 'Số dư CRC của dữ liệu 110101 với đa thức sinh 1011 là …'), cr1, ['101', '011', '110'].filter((x) => x !== cr1).concat(['000']).slice(0, 3), null, T('Append 3 zeros and divide with XOR.', 'Thêm 3 bit 0 và chia bằng XOR.')),
  mcNum('a18', T('Routing table: 0.0.0.0/0→R9, 10.0.0.0/8→R1, 10.10.0.0/16→R2, 10.10.10.0/24→R3. A packet to 10.10.20.5 goes to …', 'Bảng định tuyến: 0.0.0.0/0→R9, 10.0.0.0/8→R1, 10.10.0.0/16→R2, 10.10.10.0/24→R3. Gói tới 10.10.20.5 đi tới …'), S.lpm(rt, '10.10.20.5').nh, ['R1', 'R3', 'R9'].filter((x) => x !== S.lpm(rt, '10.10.20.5').nh).slice(0, 3), null, T('Longest matching prefix is 10.10.0.0/16.', 'Prefix khớp dài nhất là 10.10.0.0/16.')),
  mcNum('a19', T('Client ISN 7000: the server’s SYN-ACK acknowledgment number is …', 'ISN của client là 7000: số ack trong SYN-ACK của server là …'), 7001, [7000, 7002, 0], null, T('SYN consumes one sequence number.', 'SYN tốn một số thứ tự.')),
  mcNum('a20', T('The wildcard mask that matches the whole 192.168.8.0/22 is …', 'Wildcard mask khớp toàn bộ 192.168.8.0/22 là …'), S.ipInfo('192.168.8.0', 22).wildcard, ['0.0.7.255', '0.0.0.255', '0.0.15.255'], null, T('255.255.252.0 inverted = 0.0.3.255.', '255.255.252.0 đảo = 0.0.3.255.')),
);
const DA = tinh({
  tieuDe: 'FE mock A — 20 questions (concepts and calculations)', doKho: 'HARD', phut: 40, diem: 40,
  moTa: bi('<p>Mock final exam in the style of the university paper: 20 multiple-choice questions, half concepts and half calculations. Work the calculations on paper first. 40 minutes. Nothing here is copied from a real paper.</p>', '<p>Đề thi thử theo phong cách đề của trường: 20 câu trắc nghiệm, một nửa khái niệm và một nửa tính toán. Tính trên giấy trước. 40 phút. Không chép từ đề thật.</p>'),
  loai: 'choice', cauHoi: CA,
  goiY: ['Do the concept questions first, then the calculations.', 'Write the formula before the numbers; check units.'],
  loiHayGap: ['Forgetting the −2 for network and broadcast addresses.', 'Choosing a distractor that matches a half-finished result.'],
  thuatNgu: [tn('FE', 'thi cuối kỳ')], khaiNiem: ['final exam practice'],
});

/* ───────── Đề B ───────── */
const net3 = S.ipInfo('10.45.99.200', 13), v3 = S.vlsm('192.168.50.0', 24, [{ name: 'A', hosts: 100 }, { name: 'B', hosts: 50 }, { name: 'C', hosts: 12 }]);
const sw = S.macSwitch([{ src: 'A', dst: 'B', in: 1 }, { src: 'B', dst: 'A', in: 2 }, { src: 'C', dst: 'A', in: 3 }]);
const pa = S.patSim('203.0.113.1', 50000, [{ ip: 'h1', port: 1, proto: 'tcp' }, { ip: 'h2', port: 1, proto: 'tcp' }, { ip: 'h1', port: 1, proto: 'tcp' }]);
const ac = S.aclRun(['access-list 101 deny tcp 10.0.0.0 0.0.0.255 any eq 23', 'access-list 101 permit ip any any'], [{ proto: 'tcp', src: '10.0.0.7', dst: '8.8.8.8', dport: 23 }]);
const ws = S.windowSim(8, 4, [1], 'gbn');
const CB = [
  q('b1', T('Which layer adds the Ethernet FCS?', 'Tầng nào thêm FCS Ethernet?'), ['Data link', 'Network', 'Physical', 'Transport'], T('The FCS is the frame trailer.', 'FCS là trailer của frame.')),
  q('b2', T('UDP is preferred for …', 'UDP được ưu tiên cho …'), ['live voice and video', 'file download needing integrity', 'bank transfers', 'email'], T('Late data is useless in real time.', 'Dữ liệu muộn vô dụng trong thời gian thực.')),
  q('b3', T('Which address is used by a switch to forward a frame?', 'Switch dùng địa chỉ nào để chuyển frame?'), ['destination MAC', 'destination IP', 'destination port', 'source IP'], T('Layer 2 forwarding.', 'Chuyển tiếp tầng 2.')),
  q('b4', T('DNS resolves …', 'DNS phân giải …'), ['names to IP addresses', 'IP addresses to MAC addresses', 'MAC to ports', 'ports to services'], T('ARP does IP to MAC.', 'ARP làm IP sang MAC.')),
  q('b5', T('Which prefix of IPv4 is private?', 'Dải IPv4 nào là địa chỉ riêng?'), ['172.20.0.0/16', '172.32.0.0/16', '192.169.0.0/16', '11.0.0.0/8'], T('172.16.0.0–172.31.255.255.', '172.16.0.0–172.31.255.255.')),
  q('b6', T('The native VLAN is the VLAN whose frames cross a trunk …', 'Native VLAN là VLAN có frame đi qua trunk …'), ['untagged', 'encrypted', 'compressed', 'duplicated'], T('Both ends must agree on it.', 'Hai đầu phải thống nhất.')),
  q('b7', T('ICMP Time Exceeded is sent when …', 'ICMP Time Exceeded được gửi khi …'), ['the TTL of a packet reaches 0', 'the port is closed', 'the MAC is unknown', 'the DNS is slow'], T('Traceroute relies on it.', 'Traceroute dựa vào nó.')),
  q('b8', T('Compared with a standard ACL, an extended ACL can match …', 'So với ACL chuẩn, ACL mở rộng còn khớp được …'), ['protocol, destination and ports', 'only the source address', 'only the source MAC address', 'only the VLAN of the frame'], T('Extended ACLs go near the source.', 'ACL mở rộng đặt gần nguồn.')),
  q('b9', T('An ARP request is sent as a …', 'Yêu cầu ARP được gửi dạng …'), ['broadcast', 'unicast', 'multicast to routers', 'anycast'], T('ff:ff:ff:ff:ff:ff.', 'ff:ff:ff:ff:ff:ff.')),
  q('b10', T('Full-duplex Ethernet links between switch and host have no …', 'Liên kết Ethernet song công giữa switch và host không có …'), ['collisions', 'frames', 'MAC addresses', 'FCS'], T('CSMA/CD is disabled.', 'CSMA/CD bị tắt.')),
];
CB.push(
  mcNum('b11', T('The network address of 10.45.99.200/13 is …', 'Địa chỉ mạng của 10.45.99.200/13 là …'), net3.network, ['10.45.0.0', '10.32.0.0', '10.48.0.0'], null, T('Block size 8 in the second octet: 40 ≤ 45 < 48.', 'Khối 8 ở octet thứ hai: 40 ≤ 45 < 48.')),
  mcNum('b12', T('VLSM from 192.168.50.0/24: 100, 50 and 12 hosts. The third subnet (12 hosts) is …', 'VLSM từ 192.168.50.0/24: 100, 50 và 12 host. Mạng con thứ ba (12 host) là …'), v3[2].network + '/' + v3[2].prefix, ['192.168.50.192/26', '192.168.50.176/28', '192.168.50.128/28'].filter((x) => x !== v3[2].network + '/' + v3[2].prefix).slice(0, 3), null, T('Largest first: /25, /26, then /28.', 'Lớn trước: /25, /26, rồi /28.')),
  mcNum('b13', T('A switch has an empty table. Frames: A→B on port 1, B→A on port 2, C→A on port 3. The third frame is …', 'Switch bảng rỗng. Frame: A→B cổng 1, B→A cổng 2, C→A cổng 3. Frame thứ ba được …'), sw.actions[2], ['flood', 'filter', 'port 2', 'port 3'].filter((x) => x !== sw.actions[2]).slice(0, 3), null, T('A was learned on port 1.', 'A đã được học ở cổng 1.')),
  mcNum('b14', T('A file of 5 MB (5×10⁶ B) over a 40 Mbps link takes …', 'Tệp 5 MB (5×10⁶ B) qua đường 40 Mbps mất …'), '1 s', ['0.125 s', '8 s', '0.2 s'], null, T('5×10⁶ × 8 = 40×10⁶ bits.', '5×10⁶ × 8 = 40×10⁶ bit.')),
  mcNum('b15', T('The EUI-64 interface ID of MAC 00:1A:2B:3C:4D:5E is …', 'Interface ID EUI-64 của MAC 00:1A:2B:3C:4D:5E là …'), S.eui64('00:1A:2B:3C:4D:5E'), ['1a:2bff:fe3c:4d5e', '21a:2b3c:4d5e:fffe', '21a:2bff:fe3c:4d5f'], null, T('Insert fffe and flip the U/L bit: 00 → 02.', 'Chèn fffe và đảo bit U/L: 00 → 02.')),
  mcNum('b16', T('Go-Back-N: 8 segments numbered from 0, window 4, segment 1 lost once. Total transmissions =', 'Go-Back-N: 8 segment đánh số từ 0, cửa sổ 4, segment 1 mất một lần. Tổng số lần truyền ='), ws.transmissions, [8, 9, 12], null, T('4 + 4 (from segment 1) + 3 = 11.', '4 + 4 (từ segment 1) + 3 = 11.')),
  mcNum('b17', T('PAT with first public port 50000: h1:1, h2:1, h1:1 (all TCP). The third packet leaves with …', 'PAT với cổng công cộng đầu 50000: h1:1, h2:1, h1:1 (đều TCP). Gói thứ ba ra ngoài với …'), pa[2], ['203.0.113.1:50002', '203.0.113.1:50001', '203.0.113.1:1'], null, T('A repeated flow reuses its translation.', 'Luồng lặp dùng lại phép dịch.')),
  mcNum('b18', T('ACL 101: “deny tcp 10.0.0.0 0.0.0.255 any eq 23” then “permit ip any any”. Telnet from 10.0.0.7 is …', 'ACL 101: “deny tcp 10.0.0.0 0.0.0.255 any eq 23” rồi “permit ip any any”. Telnet từ 10.0.0.7 bị …'), ac[0].action, ['permit', 'deny'].filter((x) => x !== ac[0].action).concat(['logged', 'redirected']), null, T('Line 1 matches first.', 'Dòng 1 khớp trước.')),
  mcNum('b19', T('How many addresses are in 172.16.0.0/21?', '172.16.0.0/21 có bao nhiêu địa chỉ?'), 2048, [1024, 4096, 2046], null, T('2^(32−21) = 2048.', '2^(32−21) = 2048.')),
  mcNum('b20', T('Efficiency of a 100-byte TCP payload carried in one Ethernet frame (20 B TCP + 20 B IP + 18 B Ethernet):', 'Hiệu suất của dữ liệu TCP 100 byte trong một frame Ethernet (dùng 20+20+18 byte header):'), f1(100 / 158 * 100) + '%', [f1(100 / 138 * 100) + '%', f1(100 / 100 * 100) + '%', f1(100 / 178 * 100) + '%'], null, T('100 ÷ (100 + 58) = 63.3%.', '100 ÷ (100 + 58) = 63,3%.')),
);
const DB = tinh({
  tieuDe: 'FE mock B — 20 questions (concepts and calculations)', doKho: 'HARD', phut: 40, diem: 40,
  moTa: bi('<p>Second mock final exam: 20 multiple-choice questions mixing addressing, switching, transport and security. 40 minutes. Calculations first on paper.</p>', '<p>Đề thi thử thứ hai: 20 câu trắc nghiệm trộn địa chỉ, chuyển mạch, giao vận và an ninh. 40 phút. Tính toán trên giấy trước.</p>'),
  loai: 'choice', cauHoi: CB,
  goiY: ['Eliminate options that do not even match the unit.', 'Re-derive every calculation once more before submitting.'],
  loiHayGap: ['Mixing bits and bytes.', 'Reading “third frame” as the second.'],
  thuatNgu: [tn('FE', 'thi cuối kỳ')], khaiNiem: ['final exam practice'],
});

export default doiDau({ slug: 'nwc204-20-fe-mock', ten: 'FE mock — two 20-question mock exams', khoa: KHOA, baiHoc: 'nwc204-ch16-quiz', de: [DA, DB] });
