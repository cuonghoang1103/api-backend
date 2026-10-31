/** Networking for Developers · 0.1 — Phòng lab: công cụ ⇄ câu hỏi, bản đồ lab, công thức bắt gói an toàn, đọc ip route, NET_RAW/NET_ADMIN. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, sauLenh, pre } from './_net.mjs';

/* ── 1. Công cụ ⇒ câu hỏi ── */
const E1 = cs({
  ten: 'Setup 1 — Which tool answers this question?', kho: 'EASY', phut: 8,
  en: 'Every tool in the course exists to answer one question. Pick the tool you would reach for first.',
  vi: 'Mỗi công cụ trong khoá tồn tại để trả lời một câu hỏi. Chọn công cụ bạn sẽ dùng đầu tiên.',
  cau: [
    q('c1', ['What address does api.labflow.dev point to, and which server answered?', 'api.labflow.dev trỏ tới địa chỉ nào, và server nào đã trả lời?'], ['dig', 'ss', 'tcpdump', 'openssl'], ['dig asks DNS and shows the answer and who gave it (lesson 0.2, Chapter 3).', 'dig hỏi DNS và cho thấy câu trả lời lẫn ai đưa ra nó (bài 0.2, Chương 3).']),
    q('c2', ['Which program on this server is listening on port 3000, if any?', 'Chương trình nào trên server này đang nghe cổng 3000, nếu có?'], ['ss -tlnp', 'ping', 'dig', 'curl -v'], ['ss lists the machine\'s sockets; -t TCP, -l listening, -n numbers, -p process (lesson 1.5).', 'ss liệt kê các socket của máy; -t TCP, -l đang nghe, -n hiện số, -p tiến trình (bài 1.5).']),
    q('c3', ['How long does each stage (DNS, TCP, TLS, first byte) of one HTTPS request take?', 'Mỗi chặng (DNS, TCP, TLS, byte đầu) của một request HTTPS mất bao lâu?'], ['curl -w', 'mtr', 'ip route', 'nc -v'], ['curl -w ("write out") prints a timestamp for each stage of the transfer.', 'curl -w ("write out") in mốc thời gian của từng chặng.']),
    q('c4', ['Which packets really crossed the wire during one request?', 'Những gói nào đã thật sự đi trên dây trong một request?'], ['tcpdump / tshark', 'ss', 'ip neigh', 'dig'], ['Only a capture shows the packets themselves; tcpdump and tshark record them, Wireshark shows them in panes.', 'Chỉ bắt gói mới cho thấy chính các gói; tcpdump và tshark ghi lại, Wireshark hiện chúng thành các khung.']),
    q('c5', ['Is there a path to 10.10.2.10, how long is one round trip, and where are packets lost?', 'Có đường tới 10.10.2.10 không, một vòng đi-về bao lâu, và gói bị mất ở đâu?'], ['ping / mtr', 'curl -w', 'openssl', 'ss -tlnp'], ['ping measures the round trip; mtr repeats it hop by hop to show where loss starts.', 'ping đo vòng đi-về; mtr lặp lại theo từng chặng để chỉ ra chỗ bắt đầu mất gói.']),
    q('c6', ['Can I open a raw TCP connection to port 5432 without any HTTP on top?', 'Tôi có mở được kết nối TCP trần tới cổng 5432 mà không có HTTP phía trên không?'], ['nc -v', 'curl', 'dig', 'tshark'], ['nc (netcat) opens a plain TCP connection — perfect to test a database or any non-HTTP port.', 'nc (netcat) mở kết nối TCP thuần — hợp để thử cơ sở dữ liệu hay mọi cổng không phải HTTP.']),
  ],
  goiY: [['Read the question for its noun: a name, a socket, a timing, a packet, a path, a raw connection.', 'Đọc danh từ trong câu hỏi: một tên, một socket, một mốc giờ, một gói, một đường đi, một kết nối trần.'], ['curl speaks HTTP; nc speaks nothing on top of TCP.', 'curl nói HTTP; nc không nói gì phía trên TCP.']],
  loi: [['Using ping to check whether a web server process is running — ping only proves the machine answers ICMP.', 'Dùng ping để kiểm tiến trình web server có chạy không — ping chỉ chứng tỏ máy trả lời ICMP.'], ['Using curl to test a database port; curl will speak HTTP to it.', 'Dùng curl thử cổng cơ sở dữ liệu; curl sẽ nói HTTP với nó.']],
  tns: [tn('socket', 'đầu nối mạng', 'Đối tượng trong kernel mà chương trình dùng để gửi/nhận qua mạng.'), tn('packet capture', 'bắt gói tin'), tn('round trip', 'vòng đi-về')],
  kn: ['tools'],
});

/* ── 2. Bản đồ lab: địa chỉ MAC từ IP ── */
const E2 = cs({
  ten: 'Setup 2 — Read the lab map: networks and MAC addresses', kho: 'EASY', phut: 10, loai: 'table',
  en: 'The lab has two networks: LAN 10.10.1.0/24 and DMZ 10.10.2.0/24. Every MAC address is fixed and readable: <code>02</code> (locally administered) followed by the four bytes of the IP address in hexadecimal — 10.10.1.10 → <code>02:00:0a:0a:01:0a</code>. Fill in the network and the MAC address of each card (lower-case hex, colons).',
  vi: 'Phòng lab có hai mạng: LAN 10.10.1.0/24 và DMZ 10.10.2.0/24. Mọi địa chỉ MAC được đặt cố định và dễ đọc: <code>02</code> (do quản trị đặt) rồi bốn byte của địa chỉ IP viết hệ mười sáu — 10.10.1.10 → <code>02:00:0a:0a:01:0a</code>. Điền mạng và địa chỉ MAC của mỗi card (hex chữ thường, có dấu hai chấm).',
  bang: [bang1('b1', ['Lab cards', 'Các card mạng của lab'], [{ ma: 'x', ten: 'Machine and address' }, { ma: 'n', ten: 'Network', luaChon: ['LAN', 'DMZ'] }, { ma: 'm', ten: 'MAC address' }], [
    { o: { x: 'client 10.10.1.10' }, a: { n: 'LAN', m: '02:00:0a:0a:01:0a' } },
    { o: { x: 'client2 10.10.1.11' }, a: { n: 'LAN', m: '02:00:0a:0a:01:0b' } },
    { o: { x: 'router, LAN leg 10.10.1.254' }, a: { n: 'LAN', m: '02:00:0a:0a:01:fe' } },
    { o: { x: 'router, DMZ leg 10.10.2.254' }, a: { n: 'DMZ', m: '02:00:0a:0a:02:fe' } },
    { o: { x: 'web (nginx) 10.10.2.10' }, a: { n: 'DMZ', m: '02:00:0a:0a:02:0a' } },
    { o: { x: 'api (Node) 10.10.2.20' }, a: { n: 'DMZ', m: '02:00:0a:0a:02:14' } },
  ], ['Convert each byte: 10 = 0a, 1 = 01, 2 = 02, 11 = 0b, 20 = 14, 254 = fe. The router has two cards, one in each network — that is what makes it a router. The values for client, client2, router and web appear in the real captures of lessons 1.3–1.4 (e.g. 02:00:0a:0a:01:fe and 02:00:0a:0a:02:fe). The tempting mistake is api = …:02:20: 20 in decimal is 14 in hex.', 'Đổi từng byte: 10 = 0a, 1 = 01, 2 = 02, 11 = 0b, 20 = 14, 254 = fe. Router có hai card, mỗi mạng một — chính điều đó làm nó thành router. Giá trị của client, client2, router và web xuất hiện trong các bản bắt gói thật ở bài 1.3–1.4 (vd 02:00:0a:0a:01:fe và 02:00:0a:0a:02:fe). Lỗi dễ mắc là api = …:02:20: 20 thập phân là 14 hệ mười sáu.'])],
  goiY: [['Third octet 1 = LAN, 2 = DMZ.', 'Octet thứ ba 1 = LAN, 2 = DMZ.'], ['Hex digits go 0–9 then a–f: 16 = 10, 20 = 14, 254 = fe.', 'Chữ số hex đi 0–9 rồi a–f: 16 = 10, 20 = 14, 254 = fe.']],
  loi: [['Writing the decimal number into the MAC (…:02:20 instead of …:02:14).', 'Viết số thập phân vào MAC (…:02:20 thay vì …:02:14).'], ['Giving the router only one network.', 'Cho router chỉ một mạng.']],
  tns: [tn('locally administered', 'do quản trị đặt', 'Bit thứ hai của byte đầu MAC = 1: địa chỉ do phần mềm chọn, không phải nhà sản xuất.'), tn('DMZ', 'vùng phi quân sự', 'Mạng đặt các máy phục vụ ra ngoài (nginx, API).'), tn('LAN', 'mạng cục bộ')],
  kn: ['lab topology', 'hexadecimal'],
});

/* ── 3. Công thức bắt gói an toàn ── */
const E3 = cs({
  ten: 'Setup 3 — The safe capture recipe, in order', kho: 'MEDIUM', phut: 6, loai: 'order',
  en: 'You want to capture exactly one HTTP request from the lab client into a file and read it back. Put the steps of the recipe from the lesson in order.',
  vi: 'Bạn muốn bắt đúng một request HTTP từ máy client vào tệp rồi đọc lại. Sắp các bước của công thức trong bài theo thứ tự.',
  cau: [ord('o1', ['Capture one request', 'Bắt một request'], [
    'tcpdump -i eth0 -n -U -w /tmp/my.pcap \'tcp port 80\' &',
    'sleep 2',
    'curl -s -o /dev/null http://10.10.2.10/',
    'sleep 1',
    'kill -INT %1',
    'tcpdump -n -r /tmp/my.pcap',
  ], ['Start tcpdump in the background writing to a file (-w, -U flushes each packet), wait 2 s so it is really listening, make the request, wait 1 s for the last packets, stop it with SIGINT so it closes the file cleanly, then read the file (-r). Without the first sleep, tcpdump may not be listening yet and you capture nothing — the trap hit while writing the lesson.', 'Chạy tcpdump nền ghi ra tệp (-w, -U đẩy từng gói ngay), chờ 2 s cho nó thật sự nghe, gửi request, chờ 1 s cho các gói cuối, dừng bằng SIGINT để nó đóng tệp gọn, rồi đọc tệp (-r). Thiếu lần sleep đầu, tcpdump có thể chưa nghe kịp và bạn không bắt được gì — cái bẫy gặp khi soạn bài.'])],
  goiY: [['The capture must be running BEFORE the request starts and must be stopped AFTER it ends.', 'Bắt gói phải chạy TRƯỚC khi request bắt đầu và dừng SAU khi nó kết thúc.'], ['-w writes, -r reads; kill -INT is the Ctrl-C of a background job.', '-w ghi, -r đọc; kill -INT là Ctrl-C của một tác vụ nền.']],
  loi: [['Running curl right after starting tcpdump, before it listens.', 'Chạy curl ngay sau khi bật tcpdump, trước khi nó kịp nghe.'], ['Stopping tcpdump with kill -9: the file may be cut off.', 'Dừng tcpdump bằng kill -9: tệp có thể bị cụt.']],
  tns: [tn('SIGINT', 'tín hiệu ngắt', 'Tín hiệu Ctrl-C gửi tới tiến trình; tcpdump nhận nó thì đóng tệp gọn gàng.'), tn('background job', 'tác vụ chạy nền', 'Lệnh kết thúc bằng &; %1 là tác vụ nền thứ nhất.'), tn('pcap', 'tệp bắt gói')],
  kn: ['packet capture'],
});

/* ── 4. Đọc ip route thật của máy client ── */
const ROUTE = sauLenh('c00-lab', 'ip route');
const DONG = ROUTE.map((d) => d.trim());
const NEXT = ['the destination itself (on-link)', '10.10.1.254 (the lab router)', '10.10.1.1 (Docker\'s gateway)'];
const E4 = cs({
  ten: 'Setup 4 — Which route does the client use?', kho: 'MEDIUM', phut: 10, loai: 'table',
  en: `This is the real routing table of the lab client 10.10.1.10:${pre(['$ ip route', ...ROUTE])}For each destination choose the line the kernel uses and the next hop the frame is sent to. The kernel picks the <b>most specific</b> matching line; "default" matches everything but is the least specific.`,
  vi: `Đây là bảng định tuyến thật của máy client 10.10.1.10:${pre(['$ ip route', ...ROUTE])}Với mỗi đích, chọn dòng kernel dùng và chặng kế mà frame được gửi tới. Kernel chọn dòng khớp <b>cụ thể nhất</b>; "default" khớp mọi thứ nhưng kém cụ thể nhất.`,
  bang: [bang1('b1', ['Route lookup', 'Tra tuyến'], [{ ma: 'x', ten: 'Destination' }, { ma: 'r', ten: 'Line used', luaChon: DONG }, { ma: 'h', ten: 'Next hop', luaChon: NEXT }], [
    { o: { x: '10.10.1.11 (client2)' }, a: { r: DONG[1], h: NEXT[0] } },
    { o: { x: '10.10.2.10 (web)' }, a: { r: DONG[2], h: NEXT[1] } },
    { o: { x: '10.10.2.20 (api)' }, a: { r: DONG[2], h: NEXT[1] } },
    { o: { x: '8.8.8.8 (a public DNS server)' }, a: { r: DONG[0], h: NEXT[2] } },
    { o: { x: '10.10.1.254 (the router itself)' }, a: { r: DONG[1], h: NEXT[0] } },
    { o: { x: '160.187.1.208 (cuongthai.com)' }, a: { r: DONG[0], h: NEXT[2] } },
  ], ['10.10.1.x is on the client\'s own /24, so it goes straight out of eth0 — even the router\'s LAN address 10.10.1.254 is reached directly. 10.10.2.x matches the /24 added at start-up (ip route add 10.10.2.0/24 via 10.10.1.254). Everything else falls to the default route through Docker\'s gateway 10.10.1.1 — that is how the lab reached cuongthai.com through Docker\'s NAT. The tempting mistake: sending 10.10.2.10 to the default route because "default" is listed first; order in the listing does not matter, specificity does.', '10.10.1.x nằm trong /24 của chính client nên đi thẳng ra eth0 — kể cả địa chỉ LAN 10.10.1.254 của router cũng tới trực tiếp. 10.10.2.x khớp dòng /24 thêm lúc khởi động (ip route add 10.10.2.0/24 via 10.10.1.254). Mọi thứ khác rơi vào tuyến default qua cổng 10.10.1.1 của Docker — đó là cách lab ra cuongthai.com qua NAT của Docker. Lỗi dễ mắc: gửi 10.10.2.10 theo default vì "default" in đầu tiên; thứ tự in không quan trọng, độ cụ thể mới quan trọng.'])],
  goiY: [['Test the /24 lines first: does the destination start with 10.10.1. or 10.10.2.?', 'Thử các dòng /24 trước: đích có bắt đầu bằng 10.10.1. hay 10.10.2. không?'], ['"via X" means the next hop is X; a line without "via" means the destination is on the link.', '"via X" nghĩa là chặng kế là X; dòng không có "via" nghĩa là đích nằm trên cùng đường truyền.']],
  loi: [['Choosing the first line of the listing because it comes first.', 'Chọn dòng đầu của danh sách vì nó đứng đầu.'], ['Thinking the router\'s own LAN address needs the router as next hop.', 'Nghĩ rằng chính địa chỉ LAN của router cần router làm chặng kế.']],
  tns: [tn('routing table', 'bảng định tuyến'), tn('default route', 'tuyến mặc định', 'Dòng khớp mọi đích, chỉ dùng khi không dòng nào cụ thể hơn khớp.'), tn('on-link', 'cùng đường truyền', 'Đích nằm trong mạng gắn trực tiếp — gửi thẳng, không qua router.')],
  kn: ['routing table', 'most specific route'],
});

/* ── 5. Quyền trong container + chuyện hai kết nối ── */
const PERM = [...sauLenh('c00-host', 'docker run --rm net-lab ip route add').map((d) => d), ''];
const E5 = cs({
  ten: 'Setup 5 — Permissions, the hidden VM, and two connections', kho: 'MEDIUM', phut: 10,
  en: `Real output from your own machine (outside the containers):${pre(['$ docker run --rm net-lab ip route add 10.9.9.0/24 dev eth0', ...PERM.filter(Boolean), '$ docker run --rm --cap-add NET_ADMIN net-lab ip route add 10.9.9.0/24 dev eth0', '(no output: it worked)'])}And from the client: <code>curl -s http://10.10.2.10/api/hello</code> returned <code>{"seenFrom":"10.10.2.10:48492", "forwardedFor":"10.10.1.10", …}</code>.`,
  vi: `Output thật trên chính máy của bạn (ngoài container):${pre(['$ docker run --rm net-lab ip route add 10.9.9.0/24 dev eth0', ...PERM.filter(Boolean), '$ docker run --rm --cap-add NET_ADMIN net-lab ip route add 10.9.9.0/24 dev eth0', '(không in gì: đã chạy được)'])}Và từ client: <code>curl -s http://10.10.2.10/api/hello</code> trả <code>{"seenFrom":"10.10.2.10:48492", "forwardedFor":"10.10.1.10", …}</code>.`,
  cau: [
    q('c1', ['tcpdump works in a plain container, but adding a route fails until --cap-add NET_ADMIN. Why?', 'tcpdump chạy được trong container thường, nhưng thêm tuyến thì lỗi cho tới khi có --cap-add NET_ADMIN. Vì sao?'], ['Capturing needs NET_RAW, which Docker grants by default; routes need NET_ADMIN', 'Capturing needs NET_ADMIN, which Docker grants by default; routes need NET_RAW', 'Both need --privileged, but tcpdump ignores the missing permission', 'Routes can only be changed from the host, never inside a container'], ['Linux capabilities split root\'s powers. Docker gives containers NET_RAW (read/send raw packets) but not NET_ADMIN (change interfaces, routes, firewall). Grant exactly the one you need.', 'Capability của Linux chia nhỏ quyền root. Docker cho container NET_RAW (đọc/gửi gói thô) nhưng không cho NET_ADMIN (đổi card mạng, tuyến, tường lửa). Cấp đúng thứ bạn cần.']),
    q('c2', ['A classmate fixes "Operation not permitted" with --privileged. What is the problem?', 'Một bạn sửa "Operation not permitted" bằng --privileged. Vấn đề là gì?'], ['It gives the container almost full control of the host', 'It makes the container lose its network card entirely', 'It only works on Linux laptops, never on Docker Desktop', 'It disables tcpdump inside the container afterwards'], ['--privileged turns off nearly all isolation. The real fix is the single capability: --cap-add NET_ADMIN.', '--privileged tắt gần hết sự cô lập. Cách sửa đúng là đúng một capability: --cap-add NET_ADMIN.']),
    q('c3', ['On a Mac, sudo tcpdump on the laptop sees none of the lab traffic. Why?', 'Trên Mac, sudo tcpdump trên laptop không thấy gì của lưu lượng lab. Vì sao?'], ['The lab runs inside Docker Desktop\'s hidden Linux VM', 'macOS encrypts all traffic between containers by default', 'tcpdump on macOS cannot read any Ethernet frames at all', 'The containers talk over Wi-Fi, not over a network card'], ['The containers and the two bridges (nfd-lan, nfd-dmz) live inside the VM; the Mac\'s own cards never see those frames. Always capture inside a container.', 'Các container và hai bridge (nfd-lan, nfd-dmz) sống trong máy ảo; card của chính máy Mac không bao giờ thấy các frame đó. Luôn bắt gói bên trong container.']),
    q('c4', ['The API says seenFrom 10.10.2.10 although curl ran on 10.10.1.10. Why?', 'API báo seenFrom 10.10.2.10 dù curl chạy trên 10.10.1.10. Vì sao?'], ['nginx opened its own second connection to the API', 'The router rewrote the source IP address of the packet', 'The API reads the address of its own default gateway', 'DNS translated the client address into the nginx one'], ['One request, two TCP connections: client → nginx and nginx → API. The API\'s TCP peer is nginx; the original client travels in the X-Forwarded-For header that nginx adds. The router never changes IP addresses (lesson 1.4).', 'Một request, hai kết nối TCP: client → nginx và nginx → API. Đầu bên kia của API là nginx; client gốc đi trong header X-Forwarded-For do nginx thêm vào. Router không bao giờ đổi địa chỉ IP (bài 1.4).']),
    q('c5', ['What single setting turns the router container into a router?', 'Một thiết lập duy nhất nào biến container router thành router?'], ['net.ipv4.ip_forward = 1', 'net.ipv4.tcp_syncookies = 1', 'ip link set eth0 promisc on', 'ip route add default dev eth1'], ['ip_forward=1 tells Linux to pass a packet that arrives on one card for an address that is not its own out of the other card.', 'ip_forward=1 bảo Linux chuyển gói đến trên một card mà đích không phải của nó sang card kia.']),
  ],
  goiY: [['Capture = read packets (raw); configure = change the network (admin).', 'Bắt gói = đọc gói (raw); cấu hình = đổi mạng (admin).'], ['Count the TCP connections in client → nginx → API.', 'Đếm số kết nối TCP trong client → nginx → API.']],
  loi: [['Reaching for --privileged at the first permission error.', 'Dùng --privileged ngay ở lỗi quyền đầu tiên.'], ['Believing the router changed the source IP.', 'Tin rằng router đã đổi IP nguồn.']],
  tns: [tn('capability', 'năng lực (quyền nhỏ của root)'), tn('NET_RAW / NET_ADMIN', 'quyền gói thô / quyền quản trị mạng'), tn('X-Forwarded-For', 'header IP client gốc', 'Header proxy thêm vào để báo địa chỉ client ban đầu.')],
  kn: ['Linux capabilities', 'reverse proxy'],
});

/* ── 6. Tự viết: tra tuyến từ chữ "ip route" ── */
function lookupRoute(text, dst) {
  // Turn a dotted IPv4 address into a 32-bit unsigned number.
  function toNum(ip) {
    return ip.split('.').reduce(function (n, part) { return n * 256 + Number(part); }, 0);
  }
  var d = toNum(dst);
  var best = null;
  text.split('\n').forEach(function (line) {
    var w = line.trim().split(/\s+/);
    if (!w[0]) return;
    var net, len;
    if (w[0] === 'default') { net = 0; len = 0; }
    else {
      var p = w[0].split('/');
      net = toNum(p[0]);
      len = p.length > 1 ? Number(p[1]) : 32; // a bare address is a /32 host route
    }
    // Compare the first len bits. Division by 2^(32-len) avoids the 32-bit trap of (x << 32) in JavaScript.
    var size = Math.pow(2, 32 - len);
    if (Math.floor(d / size) !== Math.floor(net / size)) return;
    if (best && best.len >= len) return; // keep the most specific match (the first one on a tie)
    var via = w.indexOf('via');
    var dev = w.indexOf('dev');
    best = { len: len, route: w[0], via: via >= 0 ? w[via + 1] : null, dev: dev >= 0 ? w[dev + 1] : null };
  });
  if (!best) return null;
  return { route: best.route, via: best.via, dev: best.dev };
}
const RT = ROUTE.join('\n');
// Bảng DỰNG cho ca ẩn (không phải output thật): một máy có hai card, một tuyến /16, một /25 và một tuyến host /32.
const RT2 = 'default via 192.168.1.1 dev wlan0 proto dhcp metric 600\n172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1\n192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.23\n192.168.1.128/25 via 192.168.1.250 dev wlan0\n10.8.0.0/16 via 10.8.0.1 dev wg0\n10.8.5.7 dev wg0 scope link';
const E6 = jsBai({
  ten: 'Setup 6 — Write lookupRoute(text, dst) from the ip route output', kho: 'HARD', phut: 25,
  en: `<p>Write <code>lookupRoute(text, dst)</code> that does what the kernel does with <code>ip route get</code>: <code>text</code> is the output of <code>ip route</code> (one route per line), <code>dst</code> is an IPv4 address. Return the route used as <code>{ route, via, dev }</code>, or <code>null</code> if no line matches.</p>
<ul>
<li>The first word of a line is the destination: <code>default</code> (matches everything, prefix length 0), <code>a.b.c.d/len</code>, or a bare address <code>a.b.c.d</code> (a host route, length 32).</li>
<li>A line matches when the first <code>len</code> bits of <code>dst</code> equal those of the route. Among matching lines choose the <b>longest prefix</b>; on a tie, the first line in the text.</li>
<li><code>route</code> = that first word exactly as written; <code>via</code> = the word after <code>via</code>, or <code>null</code> when the destination is on-link; <code>dev</code> = the word after <code>dev</code>.</li>
<li>Ignore every other word (<code>proto</code>, <code>scope</code>, <code>src</code>, <code>metric</code>…) and blank lines.</li>
</ul>
<p>The visible cases use the real table of the lab client:</p>${pre(['$ ip route', ...ROUTE])}<p>The hidden cases use a second table constructed for this exercise (a laptop with Wi-Fi, Docker and a WireGuard VPN), including a /25 inside a /24 and a /32 host route.</p>`,
  vi: `<p>Viết <code>lookupRoute(text, dst)</code> làm đúng việc kernel làm với <code>ip route get</code>: <code>text</code> là output của <code>ip route</code> (mỗi dòng một tuyến), <code>dst</code> là địa chỉ IPv4. Trả về tuyến được dùng dạng <code>{ route, via, dev }</code>, hoặc <code>null</code> nếu không dòng nào khớp.</p>
<ul>
<li>Từ đầu tiên của dòng là đích: <code>default</code> (khớp mọi thứ, độ dài tiền tố 0), <code>a.b.c.d/len</code>, hoặc địa chỉ trần <code>a.b.c.d</code> (tuyến tới một máy, độ dài 32).</li>
<li>Một dòng khớp khi <code>len</code> bit đầu của <code>dst</code> bằng của tuyến. Trong các dòng khớp chọn <b>tiền tố dài nhất</b>; bằng nhau thì lấy dòng đứng trước.</li>
<li><code>route</code> = đúng từ đầu tiên như được viết; <code>via</code> = từ sau <code>via</code>, hoặc <code>null</code> khi đích nằm trên cùng đường truyền; <code>dev</code> = từ sau <code>dev</code>.</li>
<li>Bỏ qua mọi từ khác (<code>proto</code>, <code>scope</code>, <code>src</code>, <code>metric</code>…) và dòng trống.</li>
</ul>
<p>Các ca hiện dùng bảng thật của máy client trong lab:</p>${pre(['$ ip route', ...ROUTE])}<p>Các ca ẩn dùng một bảng thứ hai dựng cho bài này (laptop có Wi-Fi, Docker và VPN WireGuard), có /25 nằm trong /24 và một tuyến /32 tới một máy.</p>`,
  dauVao: ['text — the ip route output (string with \\n between lines); dst — dotted IPv4 string.', 'text — output ip route (chuỗi, các dòng cách nhau bởi \\n); dst — chuỗi IPv4 dạng chấm.'],
  dauRa: ['{ route, via, dev } or null.', '{ route, via, dev } hoặc null.'],
  rangBuoc: [['0 ≤ len ≤ 32. Lines may have trailing spaces.', '0 ≤ len ≤ 32. Dòng có thể có khoảng trắng cuối.']],
  goiY: [
    ['Write toNum(ip) first: "10.10.2.10" ⇒ 10·256³ + 10·256² + 2·256 + 10. Then a route matches if both numbers have the same first len bits.', 'Viết toNum(ip) trước: "10.10.2.10" ⇒ 10·256³ + 10·256² + 2·256 + 10. Rồi một tuyến khớp nếu hai số có cùng len bit đầu.'],
    ['"Same first len bits" = same result of Math.floor(x / 2^(32 − len)). This also works for len 0 (everything matches) and len 32.', '"Cùng len bit đầu" = cùng kết quả Math.floor(x / 2^(32 − len)). Cách này cũng đúng với len 0 (mọi thứ khớp) và len 32.'],
    ['Keep the best match while scanning lines; replace it only when the new prefix is strictly longer.', 'Giữ tuyến khớp tốt nhất khi duyệt các dòng; chỉ thay khi tiền tố mới dài hơn hẳn.'],
  ],
  loi: [
    ['Using the bitwise mask (0xffffffff << (32 - len)): in JavaScript a shift by 32 is a shift by 0, so the default route stops matching, and results are signed numbers.', 'Dùng mặt nạ bit (0xffffffff << (32 - len)): trong JavaScript dịch 32 bit là dịch 0 bit, nên tuyến default hết khớp, và kết quả là số có dấu.'],
    ['Returning the first matching line instead of the longest prefix: 192.168.1.200 then goes to the /24 instead of the /25.', 'Trả dòng khớp đầu tiên thay vì tiền tố dài nhất: 192.168.1.200 khi đó đi theo /24 thay vì /25.'],
    ['Comparing strings ("10.10.2." startsWith) — works for /24 by luck, fails for /16, /25 and /32.', 'So chuỗi (startsWith "10.10.2.") — tình cờ đúng với /24, sai với /16, /25 và /32.'],
  ],
  gt: ['Routing is "longest prefix match": every line that covers the destination is a candidate and the most specific wins, whatever the order of the listing. Comparing Math.floor(x / 2^(32−len)) keeps all arithmetic in exact non-negative numbers (JavaScript numbers are exact up to 2^53), so /0 and /32 need no special case — unlike 32-bit shifts, which wrap. The same rule explains the YouTube incident of 2008: a /25 beats a /24.', 'Định tuyến là "khớp tiền tố dài nhất": mọi dòng phủ được đích đều là ứng viên và dòng cụ thể nhất thắng, bất kể thứ tự in. So sánh Math.floor(x / 2^(32−len)) giữ mọi phép tính là số không âm chính xác (số JavaScript chính xác tới 2^53), nên /0 và /32 không cần xử lý riêng — khác với phép dịch 32 bit vốn bị quay vòng. Cùng quy tắc giải thích sự cố YouTube năm 2008: /25 thắng /24.'],
  kn: ['longest prefix match', 'parsing command output'],
  tns: [tn('prefix length', 'độ dài tiền tố', 'Số bit đầu của địa chỉ dùng để so — /24 nghĩa là 24 bit.'), tn('host route', 'tuyến tới một máy', 'Tuyến /32, chỉ khớp đúng một địa chỉ.'), tn('longest prefix match', 'khớp tiền tố dài nhất')],
  dau: `/**
 * text: the output of "ip route"; dst: "10.10.2.10".
 * Return { route, via, dev } of the most specific matching line, or null.
 */
function lookupRoute(text, dst) {
  // Write your solution here
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(lookupRoute),
  cases: [
    { goi: goi('lookupRoute', RT, '10.10.2.10') },
    { goi: goi('lookupRoute', RT, '10.10.1.11') },
    { goi: goi('lookupRoute', RT, '8.8.8.8') },
    { goi: goi('lookupRoute', RT, '10.10.1.254') },
    { goi: goi('lookupRoute', RT2, '192.168.1.200'), an: true },
    { goi: goi('lookupRoute', RT2, '192.168.1.100'), an: true },
    { goi: goi('lookupRoute', RT2, '10.8.5.7'), an: true },
    { goi: goi('lookupRoute', RT2, '10.8.5.8'), an: true },
    { goi: goi('lookupRoute', RT2, '172.17.0.5'), an: true },
    { goi: goi('lookupRoute', RT2, '1.1.1.1'), an: true },
    { goi: goi('lookupRoute', '10.0.0.0/8 dev eth0', '11.0.0.1'), an: true },
  ],
  vdGt: ['10.10.2.10 matches both the default route and 10.10.2.0/24; the /24 is longer, so the packet goes via the lab router.', '10.10.2.10 khớp cả tuyến default lẫn 10.10.2.0/24; /24 dài hơn nên gói đi qua router của lab.'],
});

export default doiDau({ slug: 'netdev-0-1-cai-dat', ten: '0.1 Your networking lab: tools and a test server', khoa: KHOA, baiHoc: 'netdev-0-1-cai-dat', de: [E1, E2, E3, E4, E5, E6] });
