/**
 * NWC204 — Midterm Progress Test (tự soạn theo dạng đề): 50 câu trắc nghiệm, 60 phút.
 *
 * Bám đúng syllabus FLM 14520: "Midterm Progress Test" ở buổi 34, 10% điểm, 50 câu, CLO1–CLO9 —
 * tức phủ các chương học TRƯỚC buổi 34: Chương 1–10 của content/academy/nwc204 (kèm chương bù 4B hệ đếm).
 * Phân bố: Ch1 ×4 · Ch2 ×5 · Ch3 ×5 · Ch4 ×4 · Ch4B ×4 · Ch5 ×4 · Ch6 ×5 · Ch7 ×5 · Ch8 ×4 · Ch9 ×4 · Ch10 ×6.
 *
 * Con số (subnet, VLSM, nhị phân, AND, khớp tiền tố dài nhất) do bộ mô phỏng Code Lab tính
 * (content/codelab/nwc204-practice/nguon/_sim.mjs — kiểm bằng _kiem-sim.mjs), không tính nhẩm.
 * Vị trí đáp án đúng do mcq() đặt theo băm nội dung (xem _lib/nwc204-exam-kit.mjs).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NWC204-TS-PT1.mjs --apply
 * Kiểm: node scripts/exam-check.mjs content/exams/NWC204-TS-PT1.mjs
 */
import { B, EX, code, c, mcq } from './_lib/nwc204-exam-kit.mjs';
import * as S from '../codelab/nwc204-practice/nguon/_sim.mjs';

const i27 = S.ipInfo('172.16.45.130', 27);
const bb = S.borrowBits(24, 6);
const v = S.vlsm('192.168.1.0', 24, [{ name: 'A', hosts: 100 }, { name: 'B', hosts: 50 }, { name: 'C', hosts: 25 }, { name: 'D', hosts: 2 }]);
const vC = v.find((x) => x.name === 'C');
const and20 = S.ipInfo('192.168.37.200', 20).network;
const lpmNh = S.lpm([{ net: '10.1.0.0/16', nh: 'R-A' }, { net: '10.1.2.0/24', nh: 'R-B' }, { net: '0.0.0.0/0', nh: 'R-C' }], '10.1.2.77').nh;
const h22 = S.ipInfo('10.20.0.0', 22).hosts;

const Q = [
  /* ───────── Chương 1 — Mạng máy tính hôm nay ───────── */
  mcq({ p: ['Video calls freeze every evening on a 1 Gbps cable plan, while large downloads stay fast. Which measurement shows the cause?', 'Gọi video đứng hình mỗi tối trên gói cáp đồng trục 1 Gbps, trong khi tải file lớn vẫn nhanh. Phép đo nào cho thấy nguyên nhân?'],
    opts: [['A continuous ping in the evening, reading how much the delay varies', 'Ping liên tục vào buổi tối, đọc xem độ trễ dao động bao nhiêu'], ['A speed test at midday', 'Một lần speed test vào buổi trưa'], ['The bandwidth printed on the contract', 'Băng thông ghi trên hợp đồng'], ['The number of devices on the Wi-Fi', 'Số thiết bị đang nối Wi-Fi']],
    ex: ['Cable is shared with the neighbourhood, so evening congestion shows up as jitter and loss — which only a measurement at the bad hour reveals. Bandwidth is a rating and never changes with the time of day; a midday speed test measures the wrong hour and the wrong number.', 'Cáp đồng trục chia chung cả khu, nên nghẽn buổi tối hiện ra thành jitter và mất gói — chỉ phép đo đúng giờ tệ mới thấy. Băng thông là mức định danh, không đổi theo giờ; speed test buổi trưa đo sai giờ và sai con số.'] }),
  mcq({ p: ['Which of these is an intermediary device?', 'Thiết bị nào là thiết bị trung gian?'],
    opts: [['A firewall', 'Tường lửa'], ['A network printer', 'Máy in mạng'], ['An IP phone', 'Điện thoại IP'], ['A file server', 'Máy chủ tệp']],
    ex: ['Intermediary devices move traffic and decide its path: switches, routers, access points, firewalls. A printer, a phone and a server are where data starts or ends — end devices, even though they sit on the network.', 'Thiết bị trung gian chuyển lưu lượng và quyết định đường đi: switch, router, access point, tường lửa. Máy in, điện thoại và máy chủ là nơi dữ liệu bắt đầu hoặc kết thúc — thiết bị đầu cuối, dù cùng nằm trên mạng.'] }),
  mcq({ p: ['One fibre is cut and the whole branch office loses its connection. Which property of a reliable network was missing?', 'Một sợi cáp quang bị đứt và cả chi nhánh mất kết nối. Mạng thiếu tính chất tin cậy nào?'],
    opts: [['Fault tolerance', 'Khả năng chịu lỗi'], ['Scalability', 'Khả năng mở rộng'], ['Quality of service', 'Chất lượng dịch vụ'], ['Security', 'An toàn']],
    ex: ['Fault tolerance means more than one path, so a single failure does not stop traffic. Scalability is about growth, QoS about congestion, security about attack — none of them would have kept the branch online after the cut.', 'Chịu lỗi nghĩa là có nhiều hơn một đường, để một chỗ hỏng không làm ngừng lưu lượng. Mở rộng là chuyện tăng trưởng, QoS là chuyện nghẽn, an toàn là chuyện tấn công — không cái nào giữ chi nhánh trên mạng sau khi cáp đứt.'] }),
  mcq({ p: [`${c('ping 1.1.1.1')} succeeds but ${c('ping google.com')} fails with "could not find host". Where is the fault?`, `${c('ping 1.1.1.1')} thành công nhưng ${c('ping google.com')} báo "could not find host". Lỗi nằm ở đâu?`],
    opts: [['Name resolution (DNS); the network path is fine', 'Phân giải tên (DNS); đường mạng vẫn tốt'], ['The default gateway', 'Default gateway'], ['The cable or the switch port', 'Cáp hoặc cổng switch'], ['The website is down', 'Trang web đang sập']],
    ex: ['Reaching an Internet address proves the address, the gateway and routing beyond it. Failing only by name, before any packet is sent to the site, points at DNS — the most valuable distinction of Chapter 1, because it sends the problem to a completely different team.', 'Tới được một địa chỉ Internet là đã chứng minh địa chỉ, gateway và định tuyến phía sau. Chỉ hỏng khi dùng tên, trước cả khi có gói nào gửi tới trang, là chỉ thẳng vào DNS — phân biệt giá trị nhất của Chương 1, vì nó chuyển sự cố sang một đội hoàn toàn khác.'] }),

  /* ───────── Chương 2 — Cấu hình switch và thiết bị đầu cuối ───────── */
  mcq({ p: ['A switch has just come out of its box: no IP address and no password. How do you open a CLI session on it?', 'Switch vừa lấy ra khỏi hộp: chưa có IP, chưa có mật khẩu. Làm sao mở phiên CLI trên nó?'],
    opts: [['Through the console port with a console (rollover) cable', 'Qua cổng console bằng cáp console (rollover)'], ['With SSH to its default IP address', 'SSH tới địa chỉ IP mặc định của nó'], ['With Telnet on TCP port 23', 'Telnet ở cổng TCP 23'], ['From a web browser on port 80', 'Từ trình duyệt web ở cổng 80']],
    ex: ['SSH and Telnet reach the vty lines, which need an IP address that does not exist yet. The console port is physically separate from the network and works on a completely unconfigured device.', 'SSH và Telnet vào các dòng vty, mà vty cần một địa chỉ IP chưa hề tồn tại. Cổng console tách biệt vật lý khỏi mạng và chạy được trên thiết bị chưa cấu hình gì.'] }),
  mcq({ p: [`The configuration shows ${c('line console 0')} with ${c('password C0nsole!')} but no ${c('login')} command. What happens when someone plugs in a console cable?`, `Cấu hình có ${c('line console 0')} với ${c('password C0nsole!')} nhưng không có lệnh ${c('login')}. Khi ai đó cắm cáp console thì sao?`],
    opts: [['They reach the user EXEC prompt without being asked for any password', 'Họ vào thẳng dấu nhắc user EXEC mà không bị hỏi mật khẩu nào'], ['They are asked for C0nsole! and let in', 'Họ bị hỏi C0nsole! rồi mới được vào'], ['The session is refused until login is added', 'Phiên bị từ chối cho tới khi thêm login'], ['They are asked for the enable secret instead', 'Họ bị hỏi enable secret thay vào đó']],
    ex: ['Without login the configured password is never checked. It is a silent failure: no error, and the configuration looks protected to a quick reader. The only real test is to log out and back in.', 'Không có login thì mật khẩu đã cấu hình không bao giờ được kiểm. Đây là thất bại lặng lẽ: không lỗi nào, và cấu hình trông như đã được bảo vệ với người đọc lướt. Phép thử thật duy nhất là đăng xuất rồi vào lại.'] }),
  mcq({ p: ['After two hours of configuration everything works. Which command makes the work survive a power cut?', 'Sau hai giờ cấu hình mọi thứ đều chạy. Lệnh nào giúp công việc sống sót qua một lần mất điện?'],
    opts: [['copy running-config startup-config', 'copy running-config startup-config'], ['copy startup-config running-config', 'copy startup-config running-config'], ['erase startup-config', 'erase startup-config'], ['show running-config', 'show running-config']],
    ex: ['running-config lives in RAM and disappears without power; only what is copied into startup-config in NVRAM comes back. The reverse copy merges the OLD configuration on top of the new one instead of saving.', 'running-config nằm trong RAM và mất khi mất điện; chỉ thứ được chép vào startup-config trong NVRAM mới quay lại. Chép ngược chiều là trộn cấu hình CŨ đè lên cấu hình mới chứ không phải lưu.'] }),
  mcq({ p: ['On a Layer 2 switch, where do you configure the switch\'s own management IP address?', 'Trên switch tầng 2, địa chỉ IP quản trị của chính switch được cấu hình ở đâu?'],
    opts: [['interface vlan 1', 'interface vlan 1'], ['interface fastethernet0/1', 'interface fastethernet0/1'], ['line vty 0 15', 'line vty 0 15'], ['Directly in global configuration mode', 'Ngay trong mode cấu hình toàn cục']],
    ex: ['Layer 2 ports carry frames and take no address. The switch virtual interface (SVI) is the switch\'s own presence on the network — and it is administratively down until no shutdown.', 'Cổng tầng 2 chỉ chuyển frame và không nhận địa chỉ. Interface ảo của switch (SVI) là sự hiện diện của chính switch trên mạng — và nó administratively down cho tới khi gõ no shutdown.'] }),
  mcq({ p: [`${c('show ip interface brief')} on S1 shows ${c('Vlan1  192.168.1.2  YES manual administratively down down')}. What fixes it?`, `${c('show ip interface brief')} trên S1 hiện ${c('Vlan1  192.168.1.2  YES manual administratively down down')}. Sửa bằng gì?`],
    opts: [['no shutdown under interface vlan 1', 'no shutdown dưới interface vlan 1'], ['Replacing the cable on the PC port', 'Thay cáp ở cổng của PC'], ['Re-entering the IP address with a /16 mask', 'Nhập lại địa chỉ IP với mặt nạ /16'], ['copy running-config startup-config', 'copy running-config startup-config']],
    ex: ['"Administratively down" means somebody — or the default — switched the interface off by configuration. It is a decision, not a fault, so no cable will fix it.', '"Administratively down" nghĩa là ai đó — hoặc giá trị mặc định — đã tắt interface bằng cấu hình. Đó là một quyết định, không phải hỏng hóc, nên thay cáp nào cũng không sửa được.'] }),

  /* ───────── Chương 3 — Giao thức và các mô hình ───────── */
  mcq({ p: ['What is the PDU called at the transport layer when TCP is used?', 'Khi dùng TCP, PDU ở tầng giao vận gọi là gì?'],
    opts: [['Segment', 'Segment (phân đoạn)'], ['Packet', 'Packet (gói)'], ['Frame', 'Frame (khung)'], ['Bits', 'Bits']],
    ex: ['Data → segment (transport) → packet (network) → frame (data link) → bits (physical). Packet is the very next layer down, which is why it is the tempting wrong answer.', 'Data → segment (giao vận) → packet (mạng) → frame (liên kết dữ liệu) → bits (vật lý). Packet là tầng ngay bên dưới, nên đó là đáp án sai hấp dẫn nhất.'] }),
  mcq({ p: ['Which OSI layer adds the source and destination MAC addresses?', 'Tầng OSI nào thêm địa chỉ MAC nguồn và đích?'],
    opts: [['Layer 2 — data link', 'Tầng 2 — liên kết dữ liệu'], ['Layer 3 — network', 'Tầng 3 — mạng'], ['Layer 4 — transport', 'Tầng 4 — giao vận'], ['Layer 1 — physical', 'Tầng 1 — vật lý']],
    ex: ['MAC addresses live in the frame header, added at the data link layer and rewritten at every hop. IP addresses are layer 3 and stay the same end to end.', 'Địa chỉ MAC nằm trong header của frame, được thêm ở tầng liên kết dữ liệu và viết lại ở mỗi chặng. Địa chỉ IP là tầng 3 và giữ nguyên từ đầu tới cuối.'] }),
  mcq({ p: ['The network access layer of the TCP/IP model corresponds to which OSI layers?', 'Tầng truy cập mạng của mô hình TCP/IP tương ứng với các tầng OSI nào?'],
    opts: [['Physical and data link', 'Vật lý và liên kết dữ liệu'], ['Network and transport', 'Mạng và giao vận'], ['Session, presentation and application', 'Phiên, trình bày và ứng dụng'], ['Data link and network', 'Liên kết dữ liệu và mạng']],
    ex: ['TCP/IP has four layers: application (OSI 5–7), transport (4), internet (3) and network access (1–2).', 'TCP/IP có bốn tầng: ứng dụng (OSI 5–7), giao vận (4), internet (3) và truy cập mạng (1–2).'] }),
  mcq({ p: ['Which organisation publishes the 802.3 Ethernet and 802.11 wireless LAN standards?', 'Tổ chức nào ban hành chuẩn Ethernet 802.3 và chuẩn mạng không dây 802.11?'],
    opts: [['IEEE', 'IEEE'], ['IETF', 'IETF'], ['ICANN', 'ICANN'], ['ISO', 'ISO']],
    ex: ['IEEE 802 committees define LAN and WLAN standards. The IETF publishes RFCs for Internet protocols such as TCP and IP; ICANN coordinates names and number allocation; ISO is known for the OSI reference model.', 'Các ủy ban IEEE 802 định nghĩa chuẩn LAN và WLAN. IETF công bố RFC cho các giao thức Internet như TCP và IP; ICANN điều phối tên miền và cấp phát số; ISO được biết tới với mô hình tham chiếu OSI.'] }),
  mcq({ p: ['A web page is sent from a server. In what order is it encapsulated on the way down the stack?', 'Một trang web được gửi từ máy chủ. Nó được đóng gói theo thứ tự nào khi đi xuống chồng giao thức?'],
    opts: [['Data → segment → packet → frame → bits', 'Data → segment → packet → frame → bits'], ['Data → packet → segment → frame → bits', 'Data → packet → segment → frame → bits'], ['Bits → frame → packet → segment → data', 'Bits → frame → packet → segment → data'], ['Data → frame → packet → segment → bits', 'Data → frame → packet → segment → bits']],
    ex: ['Each layer adds its header to what the layer above handed down: transport makes the segment, network wraps it into a packet, data link frames it, physical sends bits. The reverse list is de-encapsulation at the receiver.', 'Mỗi tầng thêm header của mình vào thứ tầng trên giao xuống: giao vận tạo segment, tầng mạng bọc thành packet, liên kết dữ liệu đóng frame, vật lý gửi bit. Danh sách ngược lại là mở gói ở bên nhận.'] }),

  /* ───────── Chương 4 — Tầng vật lý ───────── */
  mcq({ p: ['Why are the wire pairs in UTP cable twisted?', 'Vì sao các cặp dây trong cáp UTP được xoắn?'],
    opts: [['The twists cancel interference, reducing crosstalk and EMI', 'Vòng xoắn triệt nhiễu, giảm xuyên âm và nhiễu điện từ'], ['To make the cable stronger when pulled', 'Để cáp chắc hơn khi bị kéo'], ['To identify the pairs by colour', 'Để phân biệt các cặp theo màu'], ['To increase the length a cable can reach', 'Để tăng chiều dài tối đa của cáp']],
    ex: ['UTP has no shield; it relies on cancellation. Opposite currents in a twisted pair cancel each other\'s magnetic fields, so neighbouring pairs and outside sources disturb the signal less.', 'UTP không có lớp chống nhiễu; nó dựa vào hiệu ứng triệt tiêu. Dòng điện ngược chiều trong một cặp xoắn triệt từ trường của nhau, nên cặp bên cạnh và nguồn ngoài ít làm nhiễu tín hiệu hơn.'] }),
  mcq({ p: ['Which statement describes single-mode fibre?', 'Câu nào mô tả cáp quang đơn mode?'],
    opts: [['A very small core, a laser source, and long distances', 'Lõi rất nhỏ, nguồn laser, và khoảng cách xa'], ['A large core, an LED source, and short distances', 'Lõi lớn, nguồn LED, và khoảng cách ngắn'], ['It carries electrical signals over copper', 'Nó mang tín hiệu điện trên dây đồng'], ['It is used mainly for patch leads inside one rack', 'Nó dùng chủ yếu làm dây nhảy trong một tủ rack']],
    ex: ['Single-mode fibre carries one ray of laser light down a tiny core, so it reaches tens of kilometres. Multimode uses a larger core and cheaper LED sources for shorter runs such as inside a building.', 'Cáp quang đơn mode mang một tia laser trong lõi rất nhỏ, nên đi được hàng chục km. Đa mode dùng lõi lớn hơn và nguồn LED rẻ hơn cho đoạn ngắn như trong toà nhà.'] }),
  mcq({ p: ['How long does it take to put one 1,500-byte frame onto a 100 Mbps link (transmission delay)?', 'Mất bao lâu để đẩy một frame 1.500 byte lên đường truyền 100 Mbps (trễ truyền)?'],
    opts: [['0.12 ms', '0,12 ms'], ['15 ms', '15 ms'], ['1.2 ms', '1,2 ms'], ['0.015 ms', '0,015 ms']],
    ex: ['1,500 bytes × 8 = 12,000 bits; 12,000 / 100,000,000 bit/s = 0.00012 s = 0.12 ms. Forgetting to multiply by 8 gives 0.015 ms; this delay depends on bandwidth, unlike propagation delay, which depends on distance.', '1.500 byte × 8 = 12.000 bit; 12.000 / 100.000.000 bit/s = 0,00012 s = 0,12 ms. Quên nhân 8 sẽ ra 0,015 ms; trễ này phụ thuộc băng thông, khác với trễ lan truyền vốn phụ thuộc khoảng cách.'] }),
  mcq({ p: ['Which IEEE standard family defines Bluetooth personal area networks?', 'Họ chuẩn IEEE nào định nghĩa mạng cá nhân Bluetooth?'],
    opts: [['IEEE 802.15', 'IEEE 802.15'], ['IEEE 802.11', 'IEEE 802.11'], ['IEEE 802.3', 'IEEE 802.3'], ['IEEE 802.16', 'IEEE 802.16']],
    ex: ['802.15 covers wireless personal area networks such as Bluetooth; 802.11 is Wi-Fi, 802.3 is Ethernet, 802.16 is WiMAX.', '802.15 là mạng cá nhân không dây như Bluetooth; 802.11 là Wi-Fi, 802.3 là Ethernet, 802.16 là WiMAX.'] }),

  /* ───────── Chương 4B — Hệ đếm ───────── */
  mcq({ p: ['What is the decimal value 172 in 8-bit binary?', 'Giá trị thập phân 172 viết ở dạng nhị phân 8 bit là gì?'],
    opts: [[S.toBin(172, 8), S.toBin(172, 8)], ['10101010', '10101010'], ['11001100', '11001100'], ['10110100', '10110100']],
    ex: ['172 = 128 + 32 + 8 + 4, so the bits for 128, 32, 8 and 4 are on: 1010 1100.', '172 = 128 + 32 + 8 + 4, nên các bit 128, 32, 8 và 4 bật: 1010 1100.'] }),
  mcq({ p: [`Which dotted-decimal address is ${c('11000000.10101000.00001010.00000001')}?`, `Địa chỉ thập phân có chấm nào ứng với ${c('11000000.10101000.00001010.00000001')}?`],
    opts: [['192.168.10.1', '192.168.10.1'], ['192.168.5.1', '192.168.5.1'], ['193.168.10.1', '193.168.10.1'], ['192.170.10.1', '192.170.10.1']],
    ex: ['11000000 = 192, 10101000 = 128 + 32 + 8 = 168, 00001010 = 10, 00000001 = 1.', '11000000 = 192, 10101000 = 128 + 32 + 8 = 168, 00001010 = 10, 00000001 = 1.'] }),
  mcq({ p: ['What is hexadecimal 0x2F in decimal?', 'Số thập lục phân 0x2F bằng bao nhiêu ở hệ thập phân?'],
    opts: [['47', '47'], ['32', '32'], ['215', '215'], ['42', '42']],
    ex: ['2 × 16 + F (15) = 47. Each hex digit is exactly four bits, which is why IPv6 and MAC addresses are written in hex.', '2 × 16 + F (15) = 47. Mỗi chữ số hex đúng bốn bit, đó là lý do địa chỉ IPv6 và MAC được viết bằng hex.'] }),
  mcq({ p: [`What is ${c('192.168.37.200 AND 255.255.240.0')}?`, `${c('192.168.37.200 AND 255.255.240.0')} bằng bao nhiêu?`],
    opts: [[and20, and20], ['192.168.37.0', '192.168.37.0'], ['192.168.36.0', '192.168.36.0'], ['192.168.48.0', '192.168.48.0']],
    ex: ['Only the third octet is interesting: 37 = 0010 0101 and 240 = 1111 0000, so the result is 0010 0000 = 32. Octets with mask 255 copy through; octets with mask 0 become 0.', 'Chỉ octet thứ ba là đáng tính: 37 = 0010 0101 và 240 = 1111 0000, nên kết quả là 0010 0000 = 32. Octet có mặt nạ 255 giữ nguyên; octet có mặt nạ 0 thành 0.'] }),

  /* ───────── Chương 5 — Tầng liên kết dữ liệu ───────── */
  mcq({ p: ['Which data link sublayer handles framing, MAC addressing and access to the media?', 'Tầng con nào của tầng liên kết dữ liệu lo đóng khung, địa chỉ MAC và truy cập môi trường truyền?'],
    opts: [['The MAC sublayer', 'Tầng con MAC'], ['The LLC sublayer', 'Tầng con LLC'], ['The network sublayer', 'Tầng con mạng'], ['The physical coding sublayer', 'Tầng con mã hoá vật lý']],
    ex: ['IEEE splits the data link layer into LLC (802.2), which talks upward to the network layer, and MAC, which deals with the frame, addresses and the medium itself.', 'IEEE tách tầng liên kết dữ liệu thành LLC (802.2), nói chuyện lên tầng mạng, và MAC, lo frame, địa chỉ và chính môi trường truyền.'] }),
  mcq({ p: ['Which access method do wireless LANs use?', 'Mạng LAN không dây dùng phương pháp truy cập nào?'],
    opts: [['CSMA/CA', 'CSMA/CA'], ['CSMA/CD', 'CSMA/CD'], ['Token passing', 'Chuyền thẻ bài'], ['Full-duplex switching with no contention', 'Chuyển mạch song công, không tranh chấp']],
    ex: ['A radio cannot reliably hear a collision while it transmits, so Wi-Fi avoids collisions (CA) instead of detecting them (CD). CSMA/CD belongs to legacy half-duplex Ethernet.', 'Một máy phát vô tuyến không thể nghe chắc chắn được va chạm trong lúc đang phát, nên Wi-Fi tránh va chạm (CA) thay vì phát hiện nó (CD). CSMA/CD là của Ethernet bán song công kiểu cũ.'] }),
  mcq({ p: ['Which field in the frame trailer lets the receiver detect corrupted bits?', 'Trường nào trong phần đuôi frame giúp bên nhận phát hiện bit bị hỏng?'],
    opts: [['The frame check sequence (FCS), a CRC', 'Frame check sequence (FCS), một CRC'], ['The type field', 'Trường type'], ['The preamble', 'Preamble'], ['The destination MAC address', 'Địa chỉ MAC đích']],
    ex: ['The sender computes a CRC over the frame and stores it in the FCS; the receiver recomputes it and discards the frame on a mismatch. It detects errors, it does not correct them.', 'Bên gửi tính CRC trên frame và ghi vào FCS; bên nhận tính lại và bỏ frame nếu không khớp. Nó phát hiện lỗi, không sửa lỗi.'] }),
  mcq({ p: ['Every branch office connects only to the head office, not to each other. Which WAN topology is that?', 'Mỗi chi nhánh chỉ nối với trụ sở chính, không nối với nhau. Đó là tô-pô WAN nào?'],
    opts: [['Hub and spoke', 'Hub and spoke (trục và nan hoa)'], ['Full mesh', 'Lưới đầy đủ'], ['Point-to-point between every pair', 'Điểm–điểm giữa mọi cặp'], ['Bus', 'Bus']],
    ex: ['A central hub with spokes to every site is cheap and simple, and makes the hub a single point of failure — the trade-off this topology is known for.', 'Một trục trung tâm với nan hoa tới mọi site thì rẻ và đơn giản, và biến trục đó thành điểm hỏng duy nhất — đánh đổi mà tô-pô này nổi tiếng.'] }),

  /* ───────── Chương 6 — Chuyển mạch Ethernet ───────── */
  mcq({ p: ['What are the minimum and maximum sizes of a standard (untagged) Ethernet frame?', 'Kích thước tối thiểu và tối đa của một frame Ethernet tiêu chuẩn (không gắn tag) là bao nhiêu?'],
    opts: [['64 bytes and 1518 bytes', '64 byte và 1518 byte'], ['46 bytes and 1500 bytes', '46 byte và 1500 byte'], ['64 bytes and 1500 bytes', '64 byte và 1500 byte'], ['1 byte and 9000 bytes', '1 byte và 9000 byte']],
    ex: ['A frame from destination MAC to FCS is 64–1518 bytes; anything smaller is a runt and is discarded. 46–1500 is the range of the DATA field inside it — the classic confusion.', 'Frame tính từ MAC đích tới FCS dài 64–1518 byte; nhỏ hơn là runt và bị bỏ. 46–1500 là khoảng của TRƯỜNG DỮ LIỆU bên trong — chỗ hay nhầm kinh điển.'] }),
  mcq({ p: ['What do the first 24 bits of a MAC address identify?', '24 bit đầu của địa chỉ MAC xác định điều gì?'],
    opts: [['The vendor (OUI)', 'Nhà sản xuất (OUI)'], ['The network the host belongs to', 'Mạng mà host thuộc về'], ['The VLAN of the port', 'VLAN của cổng'], ['The serial number of the card', 'Số sê-ri của card']],
    ex: ['A MAC address is 48 bits: the Organizationally Unique Identifier assigned to the vendor, then 24 bits the vendor assigns. It says nothing about the network — that is the IP address\'s job.', 'Địa chỉ MAC dài 48 bit: Organizationally Unique Identifier cấp cho nhà sản xuất, rồi 24 bit do nhà sản xuất tự gán. Nó không nói gì về mạng — đó là việc của địa chỉ IP.'] }),
  mcq({ p: ['A switch receives a frame whose destination MAC is not in its MAC address table. What does it do?', 'Switch nhận một frame có MAC đích không có trong bảng địa chỉ MAC. Nó làm gì?'],
    opts: [['Floods it out of every port in the VLAN except the one it came in on', 'Phát tràn ra mọi cổng trong VLAN trừ cổng nó đi vào'], ['Drops it and sends an error back', 'Bỏ nó và gửi lỗi về'], ['Sends it to the default gateway', 'Gửi nó tới default gateway'], ['Holds it until the table learns the address', 'Giữ lại cho tới khi bảng học được địa chỉ']],
    ex: ['Unknown unicast is flooded. When the destination replies, the switch learns that MAC from the reply\'s SOURCE field and forwards later frames out of one port only.', 'Unicast lạ thì bị phát tràn. Khi đích trả lời, switch học MAC đó từ trường NGUỒN của phản hồi và từ đó chỉ chuyển các frame sau ra đúng một cổng.'] }),
  mcq({ p: ['How does a switch build its MAC address table?', 'Switch xây dựng bảng địa chỉ MAC bằng cách nào?'],
    opts: [['It records the SOURCE MAC of each frame with the port it arrived on', 'Ghi MAC NGUỒN của mỗi frame cùng cổng nó đi vào'], ['It records the destination MAC of each frame', 'Ghi MAC đích của mỗi frame'], ['It sends ARP requests to every port', 'Gửi yêu cầu ARP ra mọi cổng'], ['It copies the router\'s ARP table', 'Chép bảng ARP của router']],
    ex: ['Learning uses the source address — the switch knows for certain where that frame came from. Forwarding then uses the destination address against that table.', 'Việc học dùng địa chỉ nguồn — switch biết chắc frame đó đến từ đâu. Việc chuyển tiếp rồi mới dùng địa chỉ đích tra trong bảng đó.'] }),
  mcq({ p: ['Which switching method checks the FCS and drops corrupted frames before forwarding?', 'Phương pháp chuyển mạch nào kiểm FCS và bỏ frame hỏng trước khi chuyển đi?'],
    opts: [['Store-and-forward', 'Store-and-forward (lưu rồi chuyển)'], ['Fast-forward cut-through', 'Cut-through fast-forward'], ['Fragment-free cut-through', 'Cut-through fragment-free'], ['Flooding', 'Phát tràn']],
    ex: ['Store-and-forward receives the whole frame, so it can verify the FCS. Cut-through starts forwarding after reading the destination (fast-forward) or the first 64 bytes (fragment-free), so it cannot check a trailer it has not received.', 'Store-and-forward nhận trọn frame nên kiểm được FCS. Cut-through bắt đầu chuyển sau khi đọc địa chỉ đích (fast-forward) hoặc 64 byte đầu (fragment-free), nên không kiểm được phần đuôi nó chưa nhận.'] }),

  /* ───────── Chương 7 — Tầng mạng ───────── */
  mcq({ p: ['Which IPv4 header field does every router decrement by one?', 'Trường nào trong header IPv4 bị mỗi router giảm đi một?'],
    opts: [['Time to Live (TTL)', 'Time to Live (TTL)'], ['Header checksum only', 'Chỉ header checksum'], ['Total length', 'Total length'], ['Identification', 'Identification']],
    ex: ['TTL stops packets from looping forever. (The checksum is recomputed too, precisely because TTL changed — but the field that is decremented is TTL.)', 'TTL ngăn gói đi vòng mãi mãi. (Checksum cũng được tính lại, chính vì TTL đã đổi — nhưng trường bị giảm là TTL.)'] }),
  mcq({ p: ['A router decrements a packet\'s TTL to 0. What does it do?', 'Router giảm TTL của một gói về 0. Nó làm gì?'],
    opts: [['Discards the packet and sends ICMP Time Exceeded to the source', 'Bỏ gói và gửi ICMP Time Exceeded về nguồn'], ['Forwards it with TTL reset to 64', 'Chuyển tiếp với TTL đặt lại về 64'], ['Sends it back to the previous router', 'Gửi nó trả về router trước'], ['Discards it silently', 'Bỏ nó trong im lặng']],
    ex: ['That ICMP message is exactly what traceroute exploits: it sends probes with TTL 1, 2, 3… and each router that drops one reveals itself.', 'Thông điệp ICMP đó chính là thứ traceroute khai thác: nó gửi gói thử với TTL 1, 2, 3… và router nào bỏ gói là tự lộ diện.'] }),
  mcq({ p: ['Which IPv6 header field plays the role of the IPv4 TTL?', 'Trường nào trong header IPv6 đóng vai trò TTL của IPv4?'],
    opts: [['Hop Limit', 'Hop Limit'], ['Flow Label', 'Flow Label'], ['Traffic Class', 'Traffic Class'], ['Next Header', 'Next Header']],
    ex: ['Hop Limit is decremented at each router exactly like TTL. Flow Label marks packets of one flow, Traffic Class carries priority, Next Header names what follows.', 'Hop Limit bị giảm ở mỗi router đúng như TTL. Flow Label đánh dấu gói của một luồng, Traffic Class mang độ ưu tiên, Next Header cho biết phần tiếp theo là gì.'] }),
  mcq({ p: ['How does a host decide whether to send a packet straight to the destination or to its default gateway?', 'Máy trạm quyết định gửi gói thẳng tới đích hay tới default gateway bằng cách nào?'],
    opts: [['It ANDs its own address and the destination with its own mask and compares the results', 'Nó AND địa chỉ của chính nó và địa chỉ đích với mặt nạ của chính nó rồi so kết quả'], ['It asks the router with an ARP request', 'Nó hỏi router bằng một yêu cầu ARP'], ['It compares the first octet of both addresses', 'Nó so octet đầu tiên của hai địa chỉ'], ['It always sends to the gateway, which decides', 'Nó luôn gửi cho gateway, gateway quyết định']],
    ex: ['Same network after the AND ⇒ local delivery (ARP for the destination). Different ⇒ remote (ARP for the gateway). The host uses its OWN mask, which is why a wrong mask breaks things in one direction.', 'Cùng mạng sau phép AND ⇒ giao cục bộ (ARP cho đích). Khác ⇒ ở xa (ARP cho gateway). Máy dùng mặt nạ CỦA CHÍNH NÓ, đó là lý do mặt nạ sai làm hỏng một chiều.'] }),
  mcq({ p: [`A router has three routes: ${c('10.1.0.0/16 via R-A')}, ${c('10.1.2.0/24 via R-B')} and ${c('0.0.0.0/0 via R-C')}. Where does it send a packet for 10.1.2.77?`, `Router có ba tuyến: ${c('10.1.0.0/16 via R-A')}, ${c('10.1.2.0/24 via R-B')} và ${c('0.0.0.0/0 via R-C')}. Gói tới 10.1.2.77 đi đâu?`],
    opts: [[lpmNh, lpmNh], ['R-A', 'R-A'], ['R-C', 'R-C'], ['It load-balances between R-A and R-B', 'Chia tải giữa R-A và R-B']],
    ex: ['All three routes match; the longest prefix wins, and /24 is longer than /16 and /0. The default route is used only when nothing more specific matches.', 'Cả ba tuyến đều khớp; tiền tố dài nhất thắng, và /24 dài hơn /16 và /0. Default route chỉ dùng khi không có gì cụ thể hơn khớp.'] }),

  /* ───────── Chương 8 — Phân giải địa chỉ ───────── */
  mcq({ p: ['To which destination MAC address is an ARP request sent?', 'Yêu cầu ARP được gửi tới địa chỉ MAC đích nào?'],
    opts: [['FF:FF:FF:FF:FF:FF, the broadcast address', 'FF:FF:FF:FF:FF:FF, địa chỉ broadcast'], ['The MAC address of the default gateway', 'MAC của default gateway'], ['00:00:00:00:00:00', '00:00:00:00:00:00'], ['The multicast address 01:00:5E:00:00:01', 'Địa chỉ multicast 01:00:5E:00:00:01']],
    ex: ['The sender does not know the MAC yet — that is the question — so the request is broadcast to everyone on the LAN. The reply comes back unicast.', 'Bên gửi chưa biết MAC — đó chính là câu hỏi — nên yêu cầu được broadcast cho mọi máy trên LAN. Phản hồi quay về dạng unicast.'] }),
  mcq({ p: ['PC1 (192.168.1.10/24, gateway 192.168.1.1) sends its first packet to 8.8.8.8 with an empty ARP cache. Which IP address does it ARP for?', 'PC1 (192.168.1.10/24, gateway 192.168.1.1) gửi gói đầu tiên tới 8.8.8.8 khi bộ đệm ARP còn rỗng. Nó ARP cho địa chỉ IP nào?'],
    opts: [['192.168.1.1', '192.168.1.1'], ['8.8.8.8', '8.8.8.8'], ['192.168.1.255', '192.168.1.255'], ['Its own address, 192.168.1.10', 'Chính địa chỉ của nó, 192.168.1.10']],
    ex: ['8.8.8.8 is remote, so the frame must go to the gateway: the destination IP stays 8.8.8.8, the destination MAC is the gateway\'s. ARP never crosses a router.', '8.8.8.8 ở xa, nên frame phải tới gateway: IP đích vẫn là 8.8.8.8, MAC đích là của gateway. ARP không bao giờ đi qua router.'] }),
  mcq({ p: ['Where does an IPv6 host send a Neighbor Solicitation when it needs another host\'s MAC address?', 'Máy IPv6 gửi Neighbor Solicitation tới đâu khi cần MAC của một máy khác?'],
    opts: [['To the solicited-node multicast address of the target', 'Tới địa chỉ multicast solicited-node của máy đích'], ['To the Ethernet broadcast address', 'Tới địa chỉ broadcast của Ethernet'], ['To the router\'s link-local address', 'Tới địa chỉ link-local của router'], ['To the DHCPv6 server', 'Tới máy chủ DHCPv6']],
    ex: ['IPv6 has no broadcast. ND uses ICMPv6 NS/NA, and the NS goes to a multicast group derived from the last 24 bits of the target address, so almost no other host is disturbed.', 'IPv6 không có broadcast. ND dùng ICMPv6 NS/NA, và NS đi tới một nhóm multicast suy ra từ 24 bit cuối của địa chỉ đích, nên gần như không làm phiền máy nào khác.'] }),
  mcq({ p: ['An attacker on the LAN sends forged ARP replies so that traffic for the gateway goes to them. Which switch feature defends against this?', 'Kẻ tấn công trong LAN gửi phản hồi ARP giả để lưu lượng tới gateway chạy về máy hắn. Tính năng switch nào chống lại việc này?'],
    opts: [['Dynamic ARP Inspection', 'Dynamic ARP Inspection'], ['Port speed auto-negotiation', 'Tự thương lượng tốc độ cổng'], ['Spanning Tree Protocol', 'Spanning Tree Protocol'], ['service password-encryption', 'service password-encryption']],
    ex: ['ARP has no authentication, so ARP spoofing puts the attacker in the middle. DAI checks ARP messages against trusted bindings and drops forged ones.', 'ARP không có xác thực, nên giả mạo ARP đặt kẻ tấn công vào giữa. DAI đối chiếu các thông điệp ARP với bảng ánh xạ tin cậy và bỏ những cái giả.'] }),

  /* ───────── Chương 9 — Cấu hình router cơ bản ───────── */
  mcq({ p: [`${c('crypto key generate rsa')} is refused on a new router. What is the most likely reason?`, `${c('crypto key generate rsa')} bị từ chối trên một router mới. Lý do nhiều khả năng nhất là gì?`],
    opts: [['The hostname is still Router or no ip domain-name is set', 'Hostname vẫn là Router hoặc chưa có ip domain-name'], ['ip ssh version 2 has not been typed yet', 'Chưa gõ ip ssh version 2'], ['No username exists yet', 'Chưa có tên người dùng nào'], ['The vty lines still allow Telnet', 'Dòng vty vẫn cho Telnet']],
    ex: ['The key is named after the fully qualified domain name (R1.lab.local). With the defaults IOS has nothing to name it after. Version 2 and the username are needed for SSH to work but do not block key generation.', 'Khoá được đặt tên theo tên miền đầy đủ (R1.lab.local). Với giá trị mặc định, IOS không có gì để đặt tên khoá. Version 2 và tên người dùng cần cho SSH chạy nhưng không chặn việc sinh khoá.'] }),
  mcq({ p: ['Which command gives a ROUTER a way out to every network it does not know?', 'Lệnh nào cho ROUTER một lối ra tới mọi mạng nó không biết?'],
    opts: [['ip route 0.0.0.0 0.0.0.0 203.0.113.1', 'ip route 0.0.0.0 0.0.0.0 203.0.113.1'], ['ip default-gateway 203.0.113.1', 'ip default-gateway 203.0.113.1'], ['ip address 0.0.0.0 0.0.0.0', 'ip address 0.0.0.0 0.0.0.0'], ['default-router 203.0.113.1', 'default-router 203.0.113.1']],
    ex: ['A router needs a default ROUTE. ip default-gateway is for devices that do not route, such as a Layer 2 switch; on a router with IP routing enabled it is accepted and silently ignored.', 'Router cần một default ROUTE. ip default-gateway dành cho thiết bị không định tuyến như switch tầng 2; trên router đang bật định tuyến IP thì lệnh đó được nhận và bị bỏ qua trong im lặng.'] }),
  mcq({ p: ['A serial interface shows up / down and the cable has already been replaced twice. What is the most likely cause?', 'Một interface serial hiện up / down và cáp đã được thay hai lần. Nguyên nhân nhiều khả năng nhất là gì?'],
    opts: [['Layer 2: DCE clock rate or encapsulation', 'Tầng 2: clock rate ở đầu DCE hoặc encapsulation'], ['The replacement cable is also faulty', 'Sợi cáp thay vào cũng hỏng nốt'], ['The interface is administratively shut down', 'Interface đang bị shutdown bằng cấu hình'], ['The IP address is in the wrong subnet', 'Địa chỉ IP nằm sai subnet']],
    ex: ['Status up already proves layer 1 — there is a signal. Protocol down is layer 2. A wrong subnet would not stop the line protocol from coming up.', 'Status up đã chứng minh tầng 1 — có tín hiệu. Protocol down là tầng 2. Sai subnet không làm line protocol không lên được.'] }),
  mcq({ p: ['In Lab 2.1, PC-A (192.168.10.3/24) is given the default gateway 192.168.11.1 by mistake. What happens when it pings 8.8.8.8?', 'Trong Lab 2.1, PC-A (192.168.10.3/24) bị đặt nhầm default gateway 192.168.11.1. Khi nó ping 8.8.8.8 thì sao?'],
    opts: [['It fails immediately: the gateway is not local, so no frame is ever built', 'Hỏng ngay: gateway không cục bộ, nên không frame nào được dựng'], ['It works, because the router corrects the gateway', 'Chạy được, vì router tự sửa gateway'], ['It works through the switch instead', 'Chạy được, đi qua switch thay vào đó'], ['It times out after the router drops the packet', 'Hết giờ sau khi router bỏ gói']],
    ex: ['8.8.8.8 is remote, so PC-A needs its gateway — and 192.168.11.1 is not in 192.168.10.0/24 by PC-A\'s own mask. To reach its gateway it would need a gateway. Local destinations (R1, S1) still work, which is why the fault hides.', '8.8.8.8 ở xa nên PC-A cần gateway — mà 192.168.11.1 không nằm trong 192.168.10.0/24 theo chính mặt nạ của PC-A. Muốn tới gateway nó lại cần một gateway. Đích cục bộ (R1, S1) vẫn chạy, nên lỗi này hay ẩn.'] }),

  /* ───────── Chương 10 — Địa chỉ IPv4 ───────── */
  mcq({ p: ['What are the network address and the broadcast address of the host 172.16.45.130/27?', 'Địa chỉ mạng và địa chỉ broadcast của host 172.16.45.130/27 là gì?'],
    opts: [[`${i27.network} and ${i27.broadcast}`, `${i27.network} và ${i27.broadcast}`], ['172.16.45.0 and 172.16.45.255', '172.16.45.0 và 172.16.45.255'], ['172.16.45.128 and 172.16.45.191', '172.16.45.128 và 172.16.45.191'], ['172.16.45.96 and 172.16.45.127', '172.16.45.96 và 172.16.45.127']],
    ex: ['A /27 has a block size of 32 in the last octet: 0, 32, 64, 96, 128, 160… 130 falls in the 128 block, so the network is .128 and the broadcast is .159 (one before the next block, .160).', '/27 có kích thước khối 32 ở octet cuối: 0, 32, 64, 96, 128, 160… 130 nằm trong khối 128, nên mạng là .128 và broadcast là .159 (ngay trước khối kế, .160).'] }),
  mcq({ p: ['192.168.10.0/24 must be split into at least 6 subnets of equal size, each as large as possible. Which prefix, and how many usable hosts per subnet?', '192.168.10.0/24 phải chia thành ít nhất 6 subnet bằng nhau, mỗi subnet lớn nhất có thể. Prefix nào, và mỗi subnet bao nhiêu host dùng được?'],
    opts: [[`/${bb.newPrefix} with ${bb.hostsPerSubnet} hosts`, `/${bb.newPrefix} với ${bb.hostsPerSubnet} host`], ['/26 with 62 hosts', '/26 với 62 host'], ['/28 with 14 hosts', '/28 với 14 host'], ['/27 with 32 hosts', '/27 với 32 host']],
    ex: ['Borrowing 2 bits gives only 4 subnets; 3 bits give 2³ = 8 ≥ 6, so the prefix is /27. That leaves 5 host bits: 2⁵ − 2 = 30 usable — the network and broadcast addresses are not usable.', 'Mượn 2 bit chỉ được 4 subnet; mượn 3 bit được 2³ = 8 ≥ 6, nên prefix là /27. Còn 5 bit host: 2⁵ − 2 = 30 địa chỉ dùng được — địa chỉ mạng và broadcast thì không dùng được.'] }),
  mcq({ p: ['How many usable host addresses does a /22 network have?', 'Một mạng /22 có bao nhiêu địa chỉ host dùng được?'],
    opts: [[String(h22), String(h22)], ['1024', '1024'], ['510', '510'], ['2046', '2046']],
    ex: ['32 − 22 = 10 host bits: 2¹⁰ = 1024 addresses, minus the network and broadcast addresses = 1022.', '32 − 22 = 10 bit host: 2¹⁰ = 1024 địa chỉ, trừ địa chỉ mạng và broadcast = 1022.'] }),
  mcq({ p: ['Which of these addresses is a private (RFC 1918) address?', 'Địa chỉ nào dưới đây là địa chỉ riêng (RFC 1918)?'],
    opts: [['172.20.4.1', '172.20.4.1'], ['172.32.0.1', '172.32.0.1'], ['192.169.1.1', '192.169.1.1'], ['11.0.0.1', '11.0.0.1']],
    ex: ['The private ranges are 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0–172.31.255.255) and 192.168.0.0/16. 172.32.x.x and 192.169.x.x sit just outside them and are public — a classic trap.', 'Các dải riêng là 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0–172.31.255.255) và 192.168.0.0/16. 172.32.x.x và 192.169.x.x nằm ngay ngoài các dải đó và là công cộng — bẫy kinh điển.'] }),
  mcq({ p: ['VLSM on 192.168.1.0/24, largest LAN first, for LANs of 100, 50, 25 and 2 hosts. Which subnet does the 25-host LAN get?', 'VLSM trên 192.168.1.0/24, LAN lớn nhất trước, cho các LAN 100, 50, 25 và 2 host. LAN 25 host nhận subnet nào?'],
    opts: [[`${vC.network}/${vC.prefix}`, `${vC.network}/${vC.prefix}`], ['192.168.1.128/27', '192.168.1.128/27'], ['192.168.1.192/26', '192.168.1.192/26'], ['192.168.1.224/27', '192.168.1.224/27']],
    ex: ['100 hosts take a /25 (.0–.127), 50 take a /26 (.128–.191), so 25 hosts take the next /27 at .192 (.192–.223), and the 2-host link gets a /30 at .224. Allocating smallest first leaves gaps that no later block fits.', '100 host lấy /25 (.0–.127), 50 host lấy /26 (.128–.191), nên 25 host lấy /27 kế tiếp ở .192 (.192–.223), và đường 2 host lấy /30 ở .224. Cấp từ nhỏ trước sẽ để lại khe hở mà khối sau không vừa.'] }),
  mcq({ p: ['A point-to-point link between two routers needs exactly two host addresses, with the network and broadcast addresses reserved as usual. Which mask wastes the fewest addresses?', 'Đường điểm–điểm giữa hai router cần đúng hai địa chỉ host, địa chỉ mạng và broadcast vẫn để dành như thường lệ. Mặt nạ nào phí ít địa chỉ nhất?'],
    opts: [['255.255.255.252 (/30)', '255.255.255.252 (/30)'], ['255.255.255.248 (/29)', '255.255.255.248 (/29)'], ['255.255.255.254 (/31)', '255.255.255.254 (/31)'], ['255.255.255.240 (/28)', '255.255.255.240 (/28)']],
    ex: ['A /30 has 4 addresses: network, two hosts, broadcast — exactly enough. A /29 gives 6 hosts and wastes 4. A /31 is used on modern point-to-point links precisely because it reserves NO network or broadcast address, which the question rules out.', '/30 có 4 địa chỉ: mạng, hai host, broadcast — vừa đủ. /29 cho 6 host và phí 4. /31 được dùng trên đường điểm–điểm hiện đại chính vì nó KHÔNG để dành địa chỉ mạng hay broadcast, điều mà đề đã loại trừ.'] }),
];

export default {
  course: { courseCode: 'NWC204' },
  exams: [
    {
      kind: 'FE',
      code: 'TS-PT1',
      title: B('NWC204 — Midterm Progress Test (self-composed, chapters 1–10)', 'NWC204 — Bài kiểm tra giữa kỳ (tự soạn, chương 1–10)'),
      description: B('Practice midterm written from the course content in the format of the school\'s Midterm Progress Test: 50 multiple-choice questions, 60 minutes, chapters 1–10.', 'Đề luyện giữa kỳ viết mới từ nội dung môn, theo đúng dạng Midterm Progress Test của trường: 50 câu trắc nghiệm, 60 phút, chương 1–10.'),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 4,
      source: 'SAMPLE',
      shuffleQuestions: false,
      shuffleOptions: false,
      instructions: EX(
        '<p>This is a <b>practice Midterm Progress Test</b> for <b>Computer Networking</b>, self-composed from the course content. The syllabus places the real one at session 34 (10% of the grade, 50 questions, 60 minutes, CLO1–CLO9), so it covers <b>chapters 1–10</b>: networking today, switch and end-device configuration, protocols and models, the physical layer, number systems, the data link layer, Ethernet switching, the network layer, address resolution, basic router configuration and IPv4 addressing. It is not an official exam paper.</p><ul><li>Every question is multiple choice with one correct answer, and auto-graded.</li><li>Work subnetting and binary questions on paper first, exactly as you would in the exam hall.</li></ul><p>You can flag a question and come back. The timer auto-submits at the end. After you submit, every question shows a bilingual explanation.</p>',
        '<p>Đây là <b>đề luyện kiểm tra giữa kỳ</b> môn <b>Mạng máy tính</b>, tự soạn từ nội dung môn học. Syllabus đặt bài thật ở buổi 34 (10% điểm, 50 câu, 60 phút, CLO1–CLO9), nên đề phủ <b>chương 1–10</b>: mạng hôm nay, cấu hình switch và thiết bị đầu cuối, giao thức và mô hình, tầng vật lý, hệ đếm, tầng liên kết dữ liệu, chuyển mạch Ethernet, tầng mạng, phân giải địa chỉ, cấu hình router cơ bản và địa chỉ IPv4. Đây không phải đề thi chính thức.</p><ul><li>Mọi câu là trắc nghiệm một đáp án đúng, chấm tự động.</li><li>Câu chia subnet và nhị phân hãy giải ra giấy trước, như khi ngồi phòng thi.</li></ul><p>Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp. Nộp xong, mỗi câu đều có lời giải thích song ngữ.</p>',
      ),
      isPublished: true,
      questions: Q,
    },
  ],
};
