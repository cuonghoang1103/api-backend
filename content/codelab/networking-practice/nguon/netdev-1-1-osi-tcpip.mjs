/** Networking for Developers · 1.2 — OSI vs TCP/IP: phân tầng giao thức/thiết bị, hộp nào đọc tới đâu, tshark -V, nhãn L4/L7 cho curl -v. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, sauLenh, pre } from './_net.mjs';

const TT = ['Application', 'Transport', 'Internet', 'Link'];
const OSI = ['7', '6', '5', '4', '3', '2', '1'];

/* ── 1. Giao thức ⇒ tầng ── */
const hp = (x, t, osi) => ({ o: { x }, a: { t, s: osi } });
const E1 = cs({
  ten: 'Layers 1 — Put each protocol on its layer', kho: 'EASY', phut: 10, loai: 'table',
  en: 'For each protocol choose its TCP/IP layer (the four layers real systems run) and its OSI number (the vocabulary L2, L3, L4, L7). Where real protocols do not fit neatly, more than one OSI number is accepted — the explanation says why.',
  vi: 'Với mỗi giao thức, chọn tầng TCP/IP (bốn tầng hệ thống thật chạy) và số OSI (từ vựng L2, L3, L4, L7). Chỗ giao thức thật không khớp gọn, chấp nhận hơn một số OSI — phần giải thích nói lý do.',
  bang: [bang1('b1', ['Protocol → layer', 'Giao thức → tầng'], [{ ma: 'x', ten: 'Protocol' }, { ma: 't', ten: 'TCP/IP layer', luaChon: TT }, { ma: 's', ten: 'OSI number', luaChon: OSI }], [
    hp('HTTP', 'Application', '7'), hp('DNS', 'Application', '7'), hp('SSH', 'Application', '7'),
    hp('TLS', 'Application', ['5', '6', '7']),
    hp('TCP', 'Transport', '4'), hp('UDP', 'Transport', '4'), hp('QUIC', 'Transport', '4'),
    hp('IPv4 / IPv6', 'Internet', '3'), hp('ICMP (ping)', 'Internet', '3'),
    hp('ARP', 'Link', ['2', '3']), hp('Ethernet', 'Link', '2'), hp('Wi-Fi', 'Link', ['2', '1']),
  ], ['The TCP/IP model puts TLS with the application (it is a library inside your process, between TCP and HTTP) — so OSI 5, 6 or 7 are all accepted; arguing which one is trivia. QUIC does transport work (retransmission, ordering) on top of UDP, so it is transport. ARP lives between layers 2 and 3: it maps an IP address to a MAC but never leaves the link — the lesson\'s table lists it under Link. Wi-Fi covers both the radio (1) and the frames (2). ICMP rides inside IP packets but is part of the internet layer.', 'Mô hình TCP/IP xếp TLS cùng ứng dụng (nó là thư viện trong tiến trình của bạn, nằm giữa TCP và HTTP) — nên OSI 5, 6 hay 7 đều chấp nhận; tranh cãi số nào chỉ là đố mẹo. QUIC làm việc của tầng giao vận (gửi lại, sắp thứ tự) trên UDP, nên nó là giao vận. ARP nằm giữa tầng 2 và 3: ánh xạ IP sang MAC nhưng không bao giờ rời đường truyền — bảng trong bài xếp nó vào Link. Wi-Fi gồm cả sóng radio (1) lẫn frame (2). ICMP đi trong gói IP nhưng thuộc tầng internet.'])],
  goiY: [['Ask what the protocol needs: a program (port) ⇒ transport; a machine anywhere (IP) ⇒ internet; the next device on this cable ⇒ link.', 'Hỏi giao thức cần gì: một chương trình (cổng) ⇒ giao vận; một máy ở bất cứ đâu (IP) ⇒ internet; thiết bị kế tiếp trên dây này ⇒ link.'], ['Application, Transport, Internet, Link ⇔ OSI 7 (+6, 5), 4, 3, 2 (+1).', 'Application, Transport, Internet, Link ⇔ OSI 7 (+6, 5), 4, 3, 2 (+1).']],
  loi: [['Putting DNS in the transport layer because it usually runs over UDP.', 'Xếp DNS vào tầng giao vận vì nó thường chạy trên UDP.'], ['Putting ICMP in the transport layer because ping "talks to" another machine.', 'Xếp ICMP vào tầng giao vận vì ping "nói chuyện" với máy khác.']],
  tns: [tn('OSI model', 'mô hình OSI', 'Mô hình tham chiếu 7 tầng (1984), nguồn của từ L1–L7.'), tn('TCP/IP model', 'mô hình TCP/IP', 'Bốn tầng hệ thống thật cài đặt.'), tn('protocol stack', 'chồng giao thức')],
  kn: ['OSI', 'TCP/IP'],
});

/* ── 2. Thiết bị ⇒ tầng cao nhất nó đọc ── */
const LV = ['L2 — MAC addresses', 'L3 — IP addresses', 'L4 — addresses and ports', 'L7 — HTTP paths and headers'];
const hd = (x, l, url) => ({ o: { x }, a: { l, u: url } });
const E2 = cs({
  ten: 'Layers 2 — How deep does each box read?', kho: 'EASY', phut: 10, loai: 'table',
  en: 'A box can only act on what it reads. For each box choose the highest layer it reads, and whether it can send /admin to a different server than /.',
  vi: 'Một thiết bị chỉ hành động được trên thứ nó đọc. Với mỗi thiết bị, chọn tầng cao nhất nó đọc, và liệu nó có gửi /admin tới server khác với / được không.',
  bang: [bang1('b1', ['Box → layer', 'Thiết bị → tầng'], [{ ma: 'x', ten: 'Box' }, { ma: 'l', ten: 'Highest layer it reads', luaChon: LV }, { ma: 'u', ten: 'Can route /admin elsewhere?', luaChon: ['yes', 'no'] }], [
    hd('The Docker bridge nfd-lan (a virtual switch)', LV[0], 'no'),
    hd('The lab router container (ip_forward = 1)', LV[1], 'no'),
    hd('Your home Wi-Fi box, forwarding to the Internet', LV[1], 'no'),
    hd('AWS Network Load Balancer', LV[2], 'no'),
    hd('HAProxy in TCP mode', LV[2], 'no'),
    hd('nginx with location /api/ blocks', LV[3], 'yes'),
    hd('Cloudflare in front of a website', LV[3], 'yes'),
    hd('AWS Application Load Balancer', LV[3], 'yes'),
  ], ['A switch reads only the Ethernet header; a router reads up to the IP header and never sees your URL; an L4 balancer sees addresses and ports — the path is inside the HTTP bytes it does not parse (and with HTTPS they are encrypted anyway). Only an L7 proxy (nginx, Cloudflare, ALB) reads the request line, so only it can split /admin from /. That is exactly what the lab\'s nginx does with location /api/.', 'Switch chỉ đọc header Ethernet; router đọc tới header IP và không bao giờ thấy URL; bộ cân bằng L4 thấy địa chỉ và cổng — đường dẫn nằm trong các byte HTTP mà nó không phân tích (với HTTPS thì còn bị mã hoá). Chỉ proxy L7 (nginx, Cloudflare, ALB) đọc dòng request, nên chỉ nó tách được /admin khỏi /. Đó đúng là việc nginx trong lab làm với location /api/.'])],
  goiY: [['A path like /admin lives in the HTTP request line — layer 7.', 'Đường dẫn như /admin nằm trong dòng request HTTP — tầng 7.'], ['"Network" in the product name (NLB) is a hint: it balances connections, not requests.', 'Chữ "Network" trong tên sản phẩm (NLB) là gợi ý: nó cân bằng kết nối, không phải request.']],
  loi: [['Believing a router can route by URL because it "routes".', 'Tin rằng router định tuyến được theo URL vì nó "định tuyến".'], ['Expecting an L4 load balancer to read cookies or paths.', 'Mong bộ cân bằng tải L4 đọc được cookie hay đường dẫn.']],
  tns: [tn('load balancer', 'bộ cân bằng tải'), tn('reverse proxy', 'proxy ngược', 'Đứng trước server, nhận request thay nó — như nginx.'), tn('L4 / L7', 'tầng giao vận / tầng ứng dụng')],
  kn: ['L2/L3/L4/L7 devices'],
});

/* ── 3. tshark -V và đường lên ở máy nhận ── */
const V = sauLenh('c11-tang', "tshark -r /tmp/t.pcap -Y http.request -V");
const E3 = cs({
  ten: 'Layers 3 — Order the headers, then the unwrapping', kho: 'MEDIUM', phut: 8, loai: 'order',
  en: 'tshark -V printed the top-level headings of the request packet (lab/out/c11-tang). Put them back in the order tshark prints them, outermost first. Then order what the receiving machine does with the frame.',
  vi: 'tshark -V đã in các dòng tiêu đề cấp cao nhất của gói request (lab/out/c11-tang). Sắp lại theo thứ tự tshark in, lớp ngoài cùng trước. Rồi sắp những việc máy nhận làm với frame.',
  cau: [
    ord('o1', ['tshark -V headings of one packet', 'Các tiêu đề tshark -V của một gói'], V, ['Frame (what was captured) → Ethernet II (link) → Internet Protocol Version 4 (internet) → Transmission Control Protocol (transport) → Hypertext Transfer Protocol (application). Each header wraps the next one, so the outermost is printed first. Note the Ethernet destination: the router\'s card 02:00:0a:0a:01:fe, not the web server — the next hop only.', 'Frame (thứ được bắt) → Ethernet II (link) → Internet Protocol Version 4 (internet) → Transmission Control Protocol (giao vận) → Hypertext Transfer Protocol (ứng dụng). Mỗi header bọc header kế tiếp, nên lớp ngoài cùng in trước. Để ý đích Ethernet: card của router 02:00:0a:0a:01:fe, không phải web server — chỉ là chặng kế.']),
    ord('o2', ['On the web server, from the wire to nginx', 'Trên web server, từ dây tới nginx'], [
      'The network chip receives the frame and copies it into RAM',
      'EtherType 0x0800 says an IPv4 packet is inside',
      'IP protocol 6 says a TCP segment is inside',
      'TCP destination port 80 picks nginx\'s socket',
      'nginx reads the HTTP text GET /api/hello',
    ], ['Each layer uses a number in its own header to decide who gets the payload next: EtherType → IP protocol → TCP port → the program. The kernel does the middle three; the program reads only the last.', 'Mỗi tầng dùng một con số trong header của chính nó để quyết định ai nhận phần tải kế tiếp: EtherType → IP protocol → cổng TCP → chương trình. Kernel làm ba bước giữa; chương trình chỉ đọc bước cuối.']),
  ],
  goiY: [['Outermost = the header that was added LAST at the sender and is read FIRST at the receiver.', 'Ngoài cùng = header được thêm SAU CÙNG ở bên gửi và được đọc ĐẦU TIÊN ở bên nhận.'], ['Frame → link → internet → transport → application.', 'Frame → link → internet → giao vận → ứng dụng.']],
  loi: [['Starting with HTTP because "it is the most important".', 'Bắt đầu bằng HTTP vì "nó quan trọng nhất".'], ['Letting the port decide before the IP protocol number.', 'Để cổng quyết định trước số protocol của IP.']],
  tns: [tn('header', 'phần đầu', 'Thông tin điều khiển một tầng ghi phía trước dữ liệu.'), tn('EtherType', 'loại gói bên trong frame'), tn('decapsulation', 'mở gói')],
  kn: ['encapsulation', 'tshark'],
});

/* ── 4. Kiến thức về tầng ── */
const E4 = cs({
  ten: 'Layers 4 — Where each layer runs, and what your code controls', kho: 'MEDIUM', phut: 10,
  en: 'Questions about where the layers live in a real computer and how that shapes debugging.',
  vi: 'Câu hỏi về nơi các tầng nằm trong một máy tính thật và điều đó ảnh hưởng tới việc gỡ lỗi thế nào.',
  cau: [
    q('c1', ['Your Node API moves from Wi-Fi to a cable and from IPv4 to IPv6. How much of your code changes?', 'API Node của bạn chuyển từ Wi-Fi sang cáp và từ IPv4 sang IPv6. Code của bạn phải đổi bao nhiêu?'], ['None — each layer reads only its own header', 'All the code that builds the HTTP headers', 'Only the code that opens the TCP sockets', 'Only the code that computes the MAC address'], ['That is the point of layering: HTTP has no idea what a MAC address is, so the lower layers can change underneath it.', 'Đó chính là ý nghĩa của phân tầng: HTTP không biết MAC là gì, nên các tầng dưới đổi bên dưới nó mà không ảnh hưởng.']),
    q('c2', ['Which of these does your program normally control directly?', 'Điều nào sau đây chương trình của bạn thường điều khiển trực tiếp?'], ['Timeouts, keep-alive and the port it connects to', 'Sequence numbers and retransmission of segments', 'The routing table and the choice of next hop', 'The MAC address written into each frame'], ['Your process owns the application layer and chooses a few socket options; the kernel runs TCP (sequence numbers, retransmission) and IP (routing); the driver and chip run the link.', 'Tiến trình của bạn sở hữu tầng ứng dụng và chọn vài tuỳ chọn socket; kernel chạy TCP (số thứ tự, gửi lại) và IP (định tuyến); driver và chip lo tầng link.']),
    q('c3', ['ip route get 10.10.2.10 printed "via 10.10.1.254 dev eth0 src 10.10.1.10". Which layer made that decision?', 'ip route get 10.10.2.10 in "via 10.10.1.254 dev eth0 src 10.10.1.10". Tầng nào ra quyết định đó?'], ['The internet layer, in the kernel', 'The application layer, inside curl', 'The transport layer, inside TCP', 'The link layer, inside the switch'], ['curl never decided how to reach 10.10.2.10. The kernel\'s IP layer looked up the routing table and chose the router as next hop.', 'curl không bao giờ quyết định cách tới 10.10.2.10. Tầng IP trong kernel tra bảng định tuyến và chọn router làm chặng kế.']),
    q('c4', ['curl reports "Connection refused". Which layer do you check first, with which tool?', 'curl báo "Connection refused". Bạn kiểm tầng nào trước, bằng công cụ nào?'], ['Transport — ss -tlnp on the server', 'Application — the nginx access log', 'Internet — ip route on the client', 'Link — ip neigh on the client'], ['Refused = a TCP RST: the machine was reached (so routing and link worked) but nothing listens on that port. ss -tlnp on the server shows who listens where.', 'Refused = TCP RST: đã tới được máy (nên định tuyến và link đều ổn) nhưng không ai nghe cổng đó. ss -tlnp trên server cho biết ai nghe ở đâu.']),
    q('c5', ['A classmate says "TLS is definitely layer 6". The useful answer is …', 'Một bạn nói "TLS chắc chắn là tầng 6". Câu trả lời hữu ích là …'], ['it sits between TCP and HTTP; the number matters less than that', 'it is layer 4, because it encrypts the TCP segments', 'it is layer 2, because it protects every frame', 'it is not a layer, because it is only a library'], ['Real protocols do not fit OSI neatly. Use layers to ask "which header does this box read?" and "which stage failed?" — TLS failing means TCP worked and HTTP never started.', 'Giao thức thật không khớp gọn với OSI. Dùng tầng để hỏi "thiết bị này đọc header nào?" và "chặng nào hỏng?" — TLS hỏng nghĩa là TCP đã thông và HTTP chưa bắt đầu.']),
  ],
  goiY: [['User space = your process (application); kernel = transport and internet; driver + chip = link.', 'User space = tiến trình của bạn (ứng dụng); kernel = giao vận và internet; driver + chip = link.'], ['An error message tells you which layers already worked.', 'Một thông báo lỗi cho biết những tầng nào đã chạy được.']],
  loi: [['Debugging a refused connection by looking at DNS or routes.', 'Gỡ lỗi kết nối bị từ chối bằng cách xem DNS hay bảng định tuyến.'], ['Treating the OSI numbers as a law of nature.', 'Coi các số OSI như định luật tự nhiên.']],
  tns: [tn('user space', 'không gian người dùng'), tn('kernel', 'nhân hệ điều hành'), tn('socket option', 'tuỳ chọn socket', 'Vd timeout, keep-alive, TCP_NODELAY.')],
  kn: ['layers in a computer'],
});

/* ── 5. Gắn nhãn L4/L7 cho curl -v thật ── */
const CV = sauLenh('c11-tang', 'curl -sv http://10.10.2.10/api/hello');
const tim = (bat) => { const d = CV.find((x) => x.startsWith(bat)); if (!d) throw new Error(`c11-tang: không có "${bat}"`); return d.trimEnd(); };
const AI = ['curl\'s own status line (*)', 'sent by curl (>)', 'received from the server (<)', 'body data'];
const LL = ['L4 — the TCP connection', 'L7 — HTTP'];
const hc = (bat, l, ai) => ({ o: { x: tim(bat) }, a: { l, a: ai } });
const E5 = cs({
  ten: 'Layers 5 — Label every line of a real curl -v', kho: 'HARD', phut: 12, loai: 'table',
  en: `This is the real verbose output of one request in the lab (lab/out/c11-tang):${pre(CV.slice(0, 18))}For each line choose its layer (L4 = the TCP connection, L7 = the HTTP conversation) and who produced it.`,
  vi: `Đây là output chi tiết thật của một request trong lab (lab/out/c11-tang):${pre(CV.slice(0, 18))}Với mỗi dòng, chọn tầng (L4 = kết nối TCP, L7 = cuộc hội thoại HTTP) và ai tạo ra nó.`,
  bang: [bang1('b1', ['curl -v, line by line', 'curl -v, từng dòng'], [{ ma: 'x', ten: 'Line' }, { ma: 'l', ten: 'Layer', luaChon: LL }, { ma: 'a', ten: 'Produced by', luaChon: AI }], [
    hc('*   Trying', LL[0], AI[0]),
    hc('* Established connection', LL[0], AI[0]),
    hc('> GET /api/hello', LL[1], AI[1]),
    hc('> Host:', LL[1], AI[1]),
    hc('< HTTP/1.1 200 OK', LL[1], AI[2]),
    hc('< Connection: keep-alive', LL[1], AI[2]),
    hc('{ [142 bytes data]', LL[1], AI[3]),
    hc('* Connection #0 to host', LL[0], AI[0]),
  ], ['"Trying 10.10.2.10:80", "Established connection … from 10.10.1.10 port 53110" and "Connection #0 … left intact" are curl telling you about the TCP connection: a well-known port 80 on the server and a temporary port the kernel picked for the client. Every > line was sent and every < line was received as HTTP text. The trap is "< Connection: keep-alive": it talks about the connection, but it is an HTTP header the server wrote — layer 7 asking layer 4 to stay open.', '"Trying 10.10.2.10:80", "Established connection … from 10.10.1.10 port 53110" và "Connection #0 … left intact" là curl kể về kết nối TCP: cổng quen thuộc 80 ở server và một cổng tạm kernel chọn cho client. Mọi dòng > được gửi đi và mọi dòng < được nhận về dưới dạng chữ HTTP. Cái bẫy là "< Connection: keep-alive": nó nói về kết nối, nhưng là một header HTTP do server viết — tầng 7 nhờ tầng 4 giữ kết nối mở.'])],
  goiY: [['The first character tells who produced the line: * curl, > sent, < received.', 'Ký tự đầu cho biết ai tạo dòng: * curl, > gửi đi, < nhận về.'], ['Anything with an IP:port and "connection" in curl\'s own words is L4; HTTP text is L7 even when it mentions the connection.', 'Dòng có IP:cổng và chữ "connection" do chính curl nói là L4; chữ HTTP là L7 kể cả khi nó nhắc tới kết nối.']],
  loi: [['Labelling "Connection: keep-alive" as L4 because of the word "Connection".', 'Gắn "Connection: keep-alive" là L4 vì có chữ "Connection".'], ['Thinking curl\'s * lines travel on the network — they are only printed locally.', 'Nghĩ các dòng * của curl đi trên mạng — chúng chỉ được in ra tại máy.']],
  tns: [tn('verbose', 'chế độ chi tiết'), tn('well-known port', 'cổng quen thuộc', 'Cổng 0–1023 như 80, 443.'), tn('ephemeral port', 'cổng tạm', 'Cổng nguồn kernel cấp cho client, vd 53110.')],
  kn: ['curl -v', 'L4 vs L7'],
});

export default doiDau({ slug: 'netdev-1-1-osi-tcpip', ten: '1.2 OSI vs TCP/IP: the model that is actually used', khoa: KHOA, baiHoc: 'netdev-1-1-osi-tcpip', de: [E1, E2, E3, E4, E5] });
