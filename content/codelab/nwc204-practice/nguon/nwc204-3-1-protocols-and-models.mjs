/** NWC204 · 3.1 — Protocols, the OSI and TCP/IP models. */
import { doiDau, KHOA, bi, tinh, q, ord, bang1, tn, cs, mcNum, mt, tab } from './_nw.mjs';

const E1 = cs({
  ten: 'Models 1 — What does each layer do?', kho: 'EASY', phut: 8,
  en: 'Concept questions on the seven OSI layers and the four TCP/IP layers.', vi: 'Câu hỏi khái niệm về bảy tầng OSI và bốn tầng TCP/IP.',
  cau: [
    q('c1', ['Which OSI layer is responsible for logical (IP) addressing and choosing a path between networks?', 'Tầng OSI nào lo địa chỉ logic (IP) và chọn đường giữa các mạng?'], ['Network (3)', 'Data link (2)', 'Transport (4)', 'Session (5)'], ['Routers work at layer 3: they read the IP address and consult the routing table.', 'Router làm việc ở tầng 3: đọc địa chỉ IP và tra bảng định tuyến.']),
    q('c2', ['Which layer adds source and destination PORT numbers?', 'Tầng nào thêm số CỔNG nguồn và đích?'], ['Transport (4)', 'Network (3)', 'Application (7)', 'Physical (1)'], ['Ports identify the process (service) on a host; TCP and UDP live in layer 4.', 'Cổng xác định tiến trình (dịch vụ) trên máy; TCP và UDP ở tầng 4.']),
    q('c3', ['The TCP/IP “Internet” layer corresponds to which OSI layer?', 'Tầng “Internet” của TCP/IP tương ứng tầng OSI nào?'], ['Network (3)', 'Data link (2)', 'Transport (4)', 'Presentation (6)'], ['Internet = Network; the TCP/IP “Network access” layer merges OSI layers 1 and 2.', 'Internet = Network; tầng “Network access” của TCP/IP gộp tầng 1 và 2 của OSI.']),
    q('c4', ['How many OSI layers does the single TCP/IP “Application” layer replace?', 'Tầng “Application” duy nhất của TCP/IP thay cho bao nhiêu tầng OSI?'], ['Three (5, 6, 7)', 'One (7)', 'Two (6, 7)', 'Four (4–7)'], ['Application + Presentation + Session are one layer in TCP/IP.', 'Application + Presentation + Session gộp thành một tầng trong TCP/IP.']),
    q('c5', ['A protocol suite is best described as …', 'Bộ giao thức mô tả đúng nhất là …'], ['a group of protocols that work together, one set of rules per layer', 'one protocol that covers every function of a network', 'the physical cables of a network', 'the operating system of a router'], ['Each layer has its own protocols; the suite is the whole stack.', 'Mỗi tầng có giao thức riêng; bộ giao thức là cả chồng.']),
    q('c6', ['A reference model like OSI is useful mainly because it …', 'Mô hình tham chiếu như OSI hữu ích chủ yếu vì …'], ['gives a common vocabulary and helps isolate problems layer by layer', 'is what every device implements exactly', 'is faster than TCP/IP', 'replaces the need for protocols'], ['OSI is a teaching/troubleshooting tool; the real Internet runs TCP/IP.', 'OSI là công cụ học/xử lý sự cố; Internet thật chạy TCP/IP.']),
  ],
  goiY: ['Think “what is the unit of address at this layer?”: frame/MAC → 2, IP → 3, port → 4.', 'TCP/IP has 4 layers (5 in many textbooks), OSI has 7.'],
  loi: ['Saying TCP is a layer 3 protocol.', 'Putting the router at layer 2 because it has Ethernet ports.'],
  tn: [tn('protocol suite', 'bộ giao thức'), tn('reference model', 'mô hình tham chiếu')], kn: ['OSI', 'TCP/IP'],
});

const PROTOS = [
  ['Ethernet', '2', 'Frame', 'MAC address'], ['IPv4', '3', 'Packet', 'IP address'], ['TCP', '4', 'Segment', 'Port number'],
  ['UDP', '4', 'Datagram', 'Port number'], ['HTTP', '7', 'Data', 'URL / hostname'], ['ARP', '2', 'Frame', 'MAC address'],
];
const E2 = tinh({
  tieuDe: 'Models 2 — Protocol, layer, PDU and address', doKho: 'MEDIUM', phut: 10,
  moTa: mt('For each protocol give its OSI layer number (ARP is classified at layer 2 by Cisco), the name of its PDU (protocol data unit) and the kind of address it relies on.', 'Với mỗi giao thức, nêu số tầng OSI (Cisco xếp ARP ở tầng 2), tên PDU (đơn vị dữ liệu giao thức) và loại địa chỉ nó dựa vào.'),
  loai: 'table',
  bang: [bang1('b1', ['Protocol table', 'Bảng giao thức'], [{ ma: 'p', ten: 'Protocol' }, { ma: 'l', ten: 'OSI layer', luaChon: ['1', '2', '3', '4', '7'] }, { ma: 'u', ten: 'PDU', luaChon: ['Bits', 'Frame', 'Packet', 'Segment', 'Datagram', 'Data'] }, { ma: 'a', ten: 'Address', luaChon: ['MAC address', 'IP address', 'Port number', 'URL / hostname'] }],
    PROTOS.map(([p, l, u, a]) => ({ o: { p }, a: { l, u, a } })),
    ['Layer 2: frame + MAC (Ethernet, ARP). Layer 3: packet + IP. Layer 4: segment (TCP) or datagram (UDP) + port. Layer 7: data + name/URL.', 'Tầng 2: frame + MAC (Ethernet, ARP). Tầng 3: packet + IP. Tầng 4: segment (TCP) hay datagram (UDP) + cổng. Tầng 7: dữ liệu + tên/URL.'])],
  goiY: ['PDU names: data → segment/datagram → packet → frame → bits.', 'UDP’s PDU is called a datagram.'],
  loiHayGap: ['Calling a layer 4 PDU a “packet”.', 'Putting ARP at layer 3 in a Cisco exam (it is layer 2 there).'],
  thuatNgu: [tn('PDU', 'đơn vị dữ liệu giao thức')], khaiNiem: ['PDU', 'layers'],
});

const E3 = tinh({
  tieuDe: 'Models 3 — Order the encapsulation at the sender', doKho: 'MEDIUM', phut: 8,
  moTa: mt('A web browser sends an HTTP request. Put the steps at the <b>sending host</b> in the correct order.', 'Trình duyệt gửi một yêu cầu HTTP. Sắp các bước ở <b>máy gửi</b> theo đúng thứ tự.'),
  loai: 'order',
  cauHoi: [ord('q1', ['Encapsulation at the sender', 'Đóng gói ở máy gửi'], ['The application produces the HTTP request (data)', 'TCP adds source/destination ports → segment', 'IP adds source/destination IP addresses → packet', 'Ethernet adds MAC addresses and an FCS trailer → frame', 'The NIC converts the frame to signals on the medium → bits'], ['Each layer wraps the PDU of the layer above with its own header (data link also adds a trailer).', 'Mỗi tầng bọc PDU của tầng trên bằng header của mình (tầng liên kết còn thêm trailer).'], 2),
    ord('q2', ['De-encapsulation at the receiver', 'Mở gói ở máy nhận'], ['The NIC receives the signals and rebuilds the frame', 'Ethernet checks the FCS and the destination MAC, removes header and trailer', 'IP checks the destination IP address and removes the IP header', 'TCP uses the port number to find the right socket and removes the TCP header', 'The data reaches the application'], ['Decapsulation goes bottom-up; each layer reads only its own header.', 'Mở gói đi từ dưới lên; mỗi tầng chỉ đọc header của mình.'], 3)],
  goiY: ['Encapsulation goes top-down, de-encapsulation bottom-up.', 'Ethernet is the only layer here that adds a trailer.'],
  loiHayGap: ['Adding the IP header before the TCP header.', 'Forgetting that the FCS is a trailer, not a header.'],
  thuatNgu: [tn('encapsulation', 'đóng gói'), tn('FCS', 'chuỗi kiểm tra khung')], khaiNiem: ['encapsulation'],
});

const HDR = [[1000, 20, 20, 18], [100, 20, 20, 18], [1460, 20, 20, 18], [512, 8, 20, 18]];
const E4 = tinh({
  tieuDe: 'Models 4 — Header overhead and efficiency', doKho: 'MEDIUM', phut: 10,
  moTa: mt('A payload is carried with a transport header, a 20-byte IPv4 header and an 18-byte Ethernet header+FCS. Give the total frame size in bytes and the efficiency = payload ÷ frame in % (1 decimal).', 'Một dữ liệu được mang với header giao vận, header IPv4 20 byte và header+FCS Ethernet 18 byte. Tính kích thước frame (byte) và hiệu suất = dữ liệu ÷ frame theo % (1 chữ số thập phân).'),
  loai: 'table',
  bang: [bang1('b1', ['Overhead', 'Chi phí header'], [{ ma: 'x', ten: 'Case' }, { ma: 'f', ten: 'Frame (B)' }, { ma: 'e', ten: 'Efficiency %' }],
    HDR.map(([d, t], i) => ({ o: { x: `${d} B payload, ${t === 20 ? 'TCP (20 B)' : 'UDP (8 B)'}` }, a: { f: [String(d + t + 20 + 18)], e: [(d / (d + t + 20 + 18) * 100).toFixed(1), String(+(d / (d + t + 20 + 18) * 100).toFixed(1))] } })),
    ['Frame = payload + transport + 20 + 18; efficiency = payload / frame. ' + HDR.map(([d, t]) => `${d}/${d + t + 38} = ${(d / (d + t + 38) * 100).toFixed(1)}%`).join('; ') + '. Small payloads waste most of the frame.', 'Frame = dữ liệu + giao vận + 20 + 18; hiệu suất = dữ liệu / frame. Dữ liệu nhỏ thì phần lớn frame là header.'])],
  goiY: ['Add the four sizes first, then divide.', 'TCP header 20 B, UDP header 8 B.'],
  loiHayGap: ['Dividing by the payload instead of the frame size.', 'Using 8 B for TCP.'],
  thuatNgu: [tn('overhead', 'chi phí header'), tn('efficiency', 'hiệu suất')], khaiNiem: ['header overhead'],
});

const E5 = cs({
  ten: 'Models 5 — Which layer is the fault?', kho: 'HARD', phut: 12,
  en: 'Map each symptom to the OSI layer where you would look first (layered troubleshooting).', vi: 'Gán mỗi triệu chứng vào tầng OSI nên kiểm tra trước (xử lý sự cố theo tầng).',
  cau: [
    q('c1', ['A PC shows “cable unplugged” and the link light is off.', 'PC báo “cable unplugged” và đèn link tắt.'], ['Layer 1 — physical', 'Layer 2 — data link', 'Layer 3 — network', 'Layer 7 — application'], ['No signal means the medium or NIC: layer 1.', 'Không có tín hiệu là vấn đề đường truyền/NIC: tầng 1.']),
    q('c2', ['The link is up, ping to the gateway works, but ping to 8.8.8.8 fails and the PC has a wrong default gateway.', 'Link lên, ping gateway được, nhưng ping 8.8.8.8 lỗi và PC có default gateway sai.'], ['Layer 3 — network', 'Layer 1 — physical', 'Layer 2 — data link', 'Layer 4 — transport'], ['Routing/addressing configuration: layer 3.', 'Cấu hình định tuyến/địa chỉ: tầng 3.']),
    q('c3', ['ping 93.184.216.34 works, but the browser cannot open “example.com”.', 'ping 93.184.216.34 được nhưng trình duyệt không mở được “example.com”.'], ['Layer 7 — DNS (application)', 'Layer 3 — network', 'Layer 1 — physical', 'Layer 2 — data link'], ['IP connectivity is fine; name resolution (DNS, an application protocol) is the suspect.', 'Kết nối IP ổn; nghi phân giải tên (DNS, giao thức ứng dụng).']),
    q('c4', ['The ping works and the web server is up, but “Connection refused” appears when connecting to port 8443.', 'Ping được, web server chạy, nhưng gặp “Connection refused” khi nối cổng 8443.'], ['Layer 4 — no process listening on that port / firewall', 'Layer 1 — physical', 'Layer 2 — MAC address table', 'Layer 3 — wrong subnet mask'], ['Reaching the host (L3) but not the port is a transport-layer problem.', 'Tới được máy (L3) nhưng không tới được cổng là vấn đề tầng giao vận.']),
    q('c5', ['Two hosts on one switch have the same MAC address and traffic gets mixed up.', 'Hai máy trên một switch trùng địa chỉ MAC khiến lưu lượng lẫn lộn.'], ['Layer 2 — data link', 'Layer 3 — network', 'Layer 4 — transport', 'Layer 7 — application'], ['MAC addresses belong to layer 2.', 'Địa chỉ MAC thuộc tầng 2.']),
  ],
  goiY: ['Start at layer 1 and go up, or divide: ping the gateway, ping a public IP, then ping a name.', 'Each layer’s symptom looks different: no link, no gateway, no route, no port, no name.'],
  loi: ['Jumping to layer 7 before checking that the cable is plugged in.', 'Treating “can ping” as proof the application works.'],
  tn: [tn('troubleshooting', 'xử lý sự cố')], kn: ['layered troubleshooting'],
});

void mcNum; void tab;
export default doiDau({ slug: 'nwc204-3-1-protocols-and-models', ten: '3.1 Protocols and the OSI / TCP-IP models', khoa: KHOA, baiHoc: 'nwc204-3-1-luat-giao-thuc-va-bo-giao-thuc', de: [E1, E2, E3, E4, E5] });
