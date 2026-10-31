/** Networking for Developers · 2.3 — NAT: dải riêng, SNAT/masquerade, conntrack chiều gốc/chiều trả lời, đụng cổng (41000 → 4734 thật), DNAT/mở cổng, CGNAT, docker -p; tự viết parseConntrack() và bộ dịch natOut()/natIn(). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const S = (tep, lenh) => tr(sauLenh(tep, lenh)).filter((d) => d.trim() && !d.startsWith('reading from file'));
const CT = S('c23-homegw', 'conntrack -L -p tcp --dport 80');
const CT_ISP = S('c23-isp', 'conntrack -L -s 100.64.0.10 -p tcp');
const CT_LAB2 = S('lab2-r3-homegw', 'conntrack -L -p tcp --dport 80');
const LAN = S('c23-homegw', 'tcpdump -n -t -q -r /tmp/lan.pcap');
const WAN = S('c23-homegw', 'tcpdump -n -t -q -r /tmp/wan.pcap');
const MASQ = S('c23-homegw', 'iptables -t nat -S POSTROUTING');
const SNAT_ISP = S('c23-isp', 'iptables -t nat -S POSTROUTING');
if (CT.length !== 4 || CT_ISP.length !== 2 || LAN.length !== 3 || WAN.length !== 3) throw new Error('2.3: output conntrack/tcpdump thật không đúng số dòng');

/* ── 1. Dải riêng và SNAT ── */
const E1 = cs({
  ten: 'NAT 1 — Private ranges and the home router\'s rewrite', kho: 'EASY', phut: 10,
  en: `Real output from the "Internet in a box" (lab/out/c23-vao, c23-laptop, c23-homegw):${pre(['# on LabFlow\'s server, trying to reach the laptop directly', '$ nc -vz -w 3 192.168.50.10 8080', ...S('c23-vao', 'nc -vz -w 3 192.168.50.10'), '$ traceroute -n -q 1 -m 3 192.168.50.10', ...S('c23-vao', 'traceroute -n -q 1 -m 3'), '', '# on the laptop 192.168.50.10', '$ curl -s http://203.0.113.10/', ...S('c23-laptop', 'curl -s http://203.0.113.10/'), '', '# on the home router', '$ iptables -t nat -S POSTROUTING', ...MASQ, '$ tcpdump … lan.pcap (inside)', ...LAN, '$ tcpdump … wan.pcap (outside)', ...WAN])}`,
  vi: `Output thật từ "Internet trong một hộp" (lab/out/c23-vao, c23-laptop, c23-homegw):${pre(['# trên máy chủ LabFlow, thử gọi thẳng vào laptop', '$ nc -vz -w 3 192.168.50.10 8080', ...S('c23-vao', 'nc -vz -w 3 192.168.50.10'), '$ traceroute -n -q 1 -m 3 192.168.50.10', ...S('c23-vao', 'traceroute -n -q 1 -m 3'), '', '# trên laptop 192.168.50.10', '$ curl -s http://203.0.113.10/', ...S('c23-laptop', 'curl -s http://203.0.113.10/'), '', '# trên router nhà', '$ iptables -t nat -S POSTROUTING', ...MASQ, '$ tcpdump … lan.pcap (phía trong)', ...LAN, '$ tcpdump … wan.pcap (phía ngoài)', ...WAN])}`,
  cau: [
    q('c1', ['From the server, 192.168.50.10 is "Network is unreachable" and the DC router answers !N. Why?', 'Từ máy chủ, 192.168.50.10 là "Network is unreachable" và router dc trả lời !N. Vì sao?'], ['192.168.0.0/16 is private (RFC 1918): Internet routers have no route for it', 'The laptop\'s firewall drops every packet that comes from outside', 'The laptop is switched off, so its address is not announced', 'Port 8080 is closed on the laptop, so the network refuses it'], ['Millions of homes reuse 192.168.x.x, so it cannot mean one place on the Internet. The DC router (203.0.113.1) has no line for it and says so with !N.', 'Hàng triệu nhà dùng lại 192.168.x.x, nên nó không thể chỉ một nơi trên Internet. Router dc (203.0.113.1) không có dòng nào cho nó và báo bằng !N.']),
    q('c2', ['The server says "you came from 198.51.100.2". Whose address is that?', 'Máy chủ nói "you came from 198.51.100.2". Đó là địa chỉ của ai?'], ['The home router\'s public (WAN) address, given by the ISP', 'The laptop\'s second address, used only for the Internet', 'The ISP\'s router, the next hop of the home router', 'LabFlow\'s load balancer in front of the server'], ['The home router replaced the laptop\'s source address with its own wan0 address. Every device in the house arrives from 198.51.100.2.', 'Router nhà thay địa chỉ nguồn của laptop bằng địa chỉ wan0 của chính nó. Mọi thiết bị trong nhà đều tới từ 198.51.100.2.']),
    q('c3', ['What does "-A POSTROUTING -o wan0 -j MASQUERADE" do?', '"-A POSTROUTING -o wan0 -j MASQUERADE" làm gì?'], ['Packets leaving through wan0 get wan0\'s current address as their source', 'Packets arriving on wan0 are hidden from the laptop\'s firewall', 'Every packet is encrypted before it leaves the house', 'Packets to wan0 are forwarded to the first machine of the LAN'], ['MASQUERADE is source NAT (SNAT) that follows the interface address — handy when the ISP changes it. The 127.0.0.11 line is Docker\'s internal DNS, not ours.', 'MASQUERADE là NAT nguồn (SNAT) đi theo địa chỉ của card — tiện khi nhà mạng đổi địa chỉ. Dòng 127.0.0.11 là DNS nội bộ của Docker, không phải của ta.']),
    q('c4', ['Compare the inside and outside captures line by line. What changed?', 'So bản bắt phía trong và phía ngoài từng dòng. Cái gì đổi?'], ['The source address everywhere, and on the third line also the source port', 'The destination address, which became the router\'s address', 'Nothing: the router only changes the MAC addresses of a packet', 'The destination port, which became 4734 for every connection'], ['Destination and destination port stay 203.0.113.10:80. Sources become 198.51.100.2 — and the phone\'s port 41000 became 4734 (exercise 3 explains why).', 'Đích và cổng đích giữ nguyên 203.0.113.10:80. Nguồn thành 198.51.100.2 — và cổng 41000 của điện thoại thành 4734 (bài 3 giải thích vì sao).']),
    q('c5', ['Which field does a NAT router rewrite that a plain router (lesson 1.4) never touches?', 'Trường nào router NAT viết lại mà router thường (bài 1.4) không bao giờ đụng tới?'], ['The source IP address of outgoing packets', 'The MAC addresses of every frame', 'The TTL of every packet it forwards', 'The IP header checksum of the packet'], ['Every router writes new MACs, lowers the TTL and so recomputes the checksum. Only a NAT router also rewrites IP addresses and ports — the constructed NAT pair of the Chapter 1 lab.', 'Router nào cũng ghi MAC mới, giảm TTL và vì thế tính lại checksum. Chỉ router NAT mới viết lại cả địa chỉ IP và cổng — cặp NAT dựng trong lab Chương 1.']),
  ],
  goiY: [['Private: 10/8, 172.16/12, 192.168/16 — routers on the Internet carry no route for them.', 'Riêng: 10/8, 172.16/12, 192.168/16 — router trên Internet không mang tuyến nào cho chúng.'], ['SNAT = rewrite the Source of outgoing packets; the replies are translated back.', 'SNAT = viết lại Nguồn của gói đi ra; câu trả lời được dịch ngược lại.']],
  loi: [['Logging the IP the server sees as "the user\'s IP": it is the house, café or company.', 'Ghi IP máy chủ thấy là "IP người dùng": nó là cả ngôi nhà, quán cà phê hay công ty.'], ['Thinking 192.168.x.x can be reached from the Internet if the firewall allows it.', 'Nghĩ 192.168.x.x có thể được gọi từ Internet nếu tường lửa cho phép.']],
  tns: [tn('NAT', 'dịch địa chỉ mạng'), tn('SNAT / masquerade', 'NAT nguồn', 'Thay địa chỉ nguồn của gói đi ra bằng địa chỉ công cộng.'), tn('public address', 'địa chỉ công cộng', 'Địa chỉ có tuyến trên Internet.')],
  kn: ['NAT', 'private addresses'],
});

/* ── 2. Đọc bảng conntrack ── */
const AI = ['laptop 192.168.50.10', 'phone 192.168.50.11', '4G phone 100.64.0.10'];
const BOI = ['home router (MASQUERADE)', 'ISP (CGNAT, SNAT)', 'no NAT'];
const E2 = cs({
  ten: 'NAT 2 — Read the real conntrack table', kho: 'MEDIUM', phut: 15, loai: 'table',
  en: `Each conntrack line has two halves: the connection as the device sent it (<b>original</b>), then what the router expects to come back (<b>reply</b>). The difference between them is the translation. Real tables (lab/out/c23-homegw, c23-isp):${pre(['# home router', '$ conntrack -L -p tcp --dport 80', ...CT, '', '# ISP router', '$ conntrack -L -s 100.64.0.10 -p tcp', ...CT_ISP])}Fill one row per connection, in the order of the lines.`,
  vi: `Mỗi dòng conntrack có hai nửa: kết nối như thiết bị đã gửi (<b>chiều gốc — original</b>), rồi thứ router chờ quay về (<b>chiều trả lời — reply</b>). Chênh lệch giữa chúng chính là phép dịch. Bảng thật (lab/out/c23-homegw, c23-isp):${pre(['# router nhà', '$ conntrack -L -p tcp --dport 80', ...CT, '', '# router isp', '$ conntrack -L -s 100.64.0.10 -p tcp', ...CT_ISP])}Điền mỗi kết nối một hàng, theo thứ tự các dòng.`,
  bang: [bang1('b1', ['Original vs reply', 'Chiều gốc với chiều trả lời'], [{ ma: 'x', ten: 'Line' }, { ma: 'd', ten: 'Device', luaChon: AI }, { ma: 'p', ten: 'Port the device used' }, { ma: 'i', ten: 'Address the server sees' }, { ma: 'q', ten: 'Port the server sees' }, { ma: 'b', ten: 'Translated by', luaChon: BOI }], [
    { o: { x: 'home 1 (sport=41122)' }, a: { d: AI[0], p: ['41122'], i: ['198.51.100.2'], q: ['41122'], b: BOI[0] } },
    { o: { x: 'home 2 (src=192.168.50.11)' }, a: { d: AI[1], p: ['41000'], i: ['198.51.100.2'], q: ['4734'], b: BOI[0] } },
    { o: { x: 'home 3 (src=192.168.50.10 sport=41000)' }, a: { d: AI[0], p: ['41000'], i: ['198.51.100.2'], q: ['41000'], b: BOI[0] } },
    { o: { x: 'isp 1' }, a: { d: AI[2], p: ['47852'], i: ['198.51.100.200'], q: ['47852'], b: BOI[1] } },
  ], ['Read the reply half backwards: "src=203.0.113.10 dst=198.51.100.2 sport=80 dport=4734" means the server will answer TO 198.51.100.2:4734 — so that is what it saw. The curl outputs confirm it: the laptop saw "port 41122" and "port 41000", the phone "port 4734", the 4G phone "198.51.100.200 port 47852". The fourth line is the ISP\'s rule "-s 100.64.0.0/24 -o ix0 -j SNAT --to-source 198.51.100.200": a second NAT, in the ISP, that you cannot configure. (conntrack lists lines in its own hash order, not in the order they were made.)', 'Đọc nửa trả lời theo chiều ngược: "src=203.0.113.10 dst=198.51.100.2 sport=80 dport=4734" nghĩa là máy chủ sẽ trả lời TỚI 198.51.100.2:4734 — vậy đó là thứ nó đã thấy. Output curl xác nhận: laptop thấy "port 41122" và "port 41000", điện thoại "port 4734", điện thoại 4G "198.51.100.200 port 47852". Dòng thứ tư là luật của isp "-s 100.64.0.0/24 -o ix0 -j SNAT --to-source 198.51.100.200": một NAT thứ hai, ở nhà mạng, mà bạn không cấu hình được. (conntrack liệt kê theo thứ tự băm của nó, không theo thứ tự tạo.)'])],
  goiY: [['The first src/sport pair is the device; the second dst/dport pair is what the outside world sees.', 'Cặp src/sport đầu là thiết bị; cặp dst/dport thứ hai là thứ thế giới bên ngoài thấy.'], ['If the two ports differ, the router rewrote the port too.', 'Nếu hai cổng khác nhau, router đã viết lại cả cổng.']],
  loi: [['Reading the reply half\'s src (the server) as the address the server sees.', 'Đọc src của nửa trả lời (chính máy chủ) thành địa chỉ máy chủ thấy.'], ['Assuming the public port is always the device\'s port.', 'Mặc định cổng công cộng luôn là cổng của thiết bị.']],
  tns: [tn('conntrack', 'bảng theo dõi kết nối'), tn('original / reply direction', 'chiều gốc / chiều trả lời'), tn('TIME_WAIT', 'trạng thái chờ sau khi đóng', 'Kết nối TCP đã đóng, còn được nhớ một lúc.')],
  kn: ['conntrack'],
});

/* ── 3. Đụng cổng, thời gian sống ── */
const TO = S('c23-timeout', 'sysctl net.netfilter.nf_conntrack_tcp_timeout_established');
const TO2 = S('c23-timeout', 'sysctl net.netfilter.nf_conntrack_udp_timeout');
const E3 = cs({
  ten: 'NAT 3 — One public address, many devices: ports and timeouts', kho: 'MEDIUM', phut: 14,
  en: `The laptop and the phone both connected from source port 41000 on purpose (lab/out/c23-laptop, c23-phone), then we read the router's timers (c23-timeout):${pre(['# laptop', '$ curl -s --local-port 41000 http://203.0.113.10/', ...S('c23-laptop', 'curl -s --local-port 41000'), '# phone', '$ curl -s --local-port 41000 http://203.0.113.10/', ...S('c23-phone', 'curl -s --local-port 41000'), '', '# home router', ...TO, ...TO2])}`,
  vi: `Laptop và điện thoại cố ý cùng kết nối từ cổng nguồn 41000 (lab/out/c23-laptop, c23-phone), rồi ta đọc các bộ đếm giờ của router (c23-timeout):${pre(['# laptop', '$ curl -s --local-port 41000 http://203.0.113.10/', ...S('c23-laptop', 'curl -s --local-port 41000'), '# điện thoại', '$ curl -s --local-port 41000 http://203.0.113.10/', ...S('c23-phone', 'curl -s --local-port 41000'), '', '# router nhà', ...TO, ...TO2])}`,
  cau: [
    q('c1', ['Why did the phone\'s port become 4734?', 'Vì sao cổng của điện thoại thành 4734?'], ['198.51.100.2:41000 → 203.0.113.10:80 was already taken by the laptop', 'The phone\'s operating system chose a new port before sending', 'The server asked the phone to reconnect from another port', '41000 is a reserved port that home routers never use outside'], ['Outside, both connections would have the same four values; the replies could not be told apart. The router picks another free port — this is PAT/NAPT (port address translation).', 'Ở bên ngoài, hai kết nối sẽ có cùng bốn giá trị; câu trả lời không phân biệt được. Router chọn một cổng trống khác — đó là PAT/NAPT (dịch cả cổng).']),
    q('c2', ['LabFlow bans an IP after 100 failed logins in a minute. A university complains that all its students are blocked. What happened?', 'LabFlow chặn một IP sau 100 lần đăng nhập sai trong một phút. Một trường đại học phản ánh mọi sinh viên bị chặn. Chuyện gì xảy ra?'], ['The whole university reaches LabFlow from one NAT address', 'The university\'s firewall resends every request a hundred times', 'Students share one account, so LabFlow sees one user', 'The ban list was copied to every server of the university'], ['Behind NAT, hundreds of people are one IP. Rate-limit per account or session, and treat an IP limit only as a coarse guard.', 'Sau NAT, hàng trăm người là một IP. Giới hạn theo tài khoản hay phiên, và chỉ coi giới hạn theo IP là lớp chắn thô.']),
    q('c3', ['An idle established TCP entry lives 432 000 s on this router. How long is that?', 'Một mục TCP đã thiết lập mà không có lưu lượng sống 432 000 s trên router này. Là bao lâu?'], ['5 days', '12 hours', '432 minutes', '50 days'], ['432 000 ÷ 86 400 s per day = 5. Linux is generous; many home routers and cloud NATs are much stricter.', '432 000 ÷ 86 400 s mỗi ngày = 5. Linux khá rộng rãi; nhiều router nhà và NAT trên cloud khắt khe hơn nhiều.']),
    q('c4', ['A UDP "connection" without traffic keeps its entry 30 s here. What does that mean for an app?', 'Một "kết nối" UDP không có lưu lượng giữ mục 30 s ở đây. Điều đó nghĩa gì với một ứng dụng?'], ['A UDP flow silent for more than 30 s loses its mapping: replies get dropped', 'UDP packets are delayed by 30 s when they cross the router', 'An app may send only one UDP packet every 30 s', 'The router closes the app\'s socket after 30 s of silence'], ['After the entry expires, an answer from outside finds no line and is dropped. VoIP, games and QUIC send keep-alives for this reason.', 'Sau khi mục hết hạn, câu trả lời từ ngoài không tìm thấy dòng nào và bị vứt. VoIP, game và QUIC gửi keep-alive vì lý do này.']),
    q('c5', ['A database connection through AWS NAT Gateway dies after 6 idle minutes, "with a reset". Lesson 2.3 explains …', 'Một kết nối cơ sở dữ liệu đi qua AWS NAT Gateway chết sau 6 phút im lặng, "bị reset". Bài 2.3 giải thích …'], ['The NAT drops connections idle for 350 s; keep-alives keep them alive', 'The database closes every connection that is older than 6 minutes', 'AWS limits each NAT address to one connection per 6 minutes', 'TCP itself closes connections after 6 minutes without data'], ['AWS documents that its NAT Gateway drops a flow after 350 seconds idle and resets the next packet. TCP keep-alive (or the driver\'s option) every minute or two fixes it — Chapter 4.', 'AWS ghi rõ NAT Gateway của họ bỏ một luồng sau 350 giây im lặng và reset gói kế tiếp. TCP keep-alive (hoặc tuỳ chọn của driver) mỗi một hai phút sửa được — Chương 4.']),
    q('c6', ['How many connections can one public IPv4 address of an AWS NAT Gateway carry at the same time, according to AWS?', 'Theo AWS, một địa chỉ IPv4 công cộng của AWS NAT Gateway chở được bao nhiêu kết nối cùng lúc?'], ['Up to 55 000 to one destination', 'Unlimited, because ports are reused', 'Exactly 65 536, one per port', 'About 1 000, like a home router'], ['A port number is 16 bits, so about 64 000 per destination at most; AWS documents 55 000 simultaneous connections per IP. Busy services that call one API heavily can run out.', 'Số cổng là 16 bit, nên tối đa khoảng 64 000 cho mỗi đích; AWS ghi 55 000 kết nối đồng thời cho mỗi IP. Dịch vụ bận gọi dồn một API có thể cạn cổng.']),
  ],
  goiY: [['A connection outside is identified by (public IP, public port, server IP, server port) — two connections may not share all four.', 'Kết nối ở bên ngoài được nhận diện bằng (IP công cộng, cổng công cộng, IP máy chủ, cổng máy chủ) — hai kết nối không được trùng cả bốn.'], ['A NAT entry lives as long as traffic keeps it alive, plus its timeout.', 'Một mục NAT sống chừng nào còn lưu lượng giữ nó, cộng thời gian chờ.']],
  loi: [['Banning by IP alone and blocking a whole school.', 'Chặn chỉ theo IP và chặn cả một trường học.'], ['Blaming the database for connections that the NAT dropped while idle.', 'Đổ lỗi cho cơ sở dữ liệu vì kết nối bị NAT bỏ khi im lặng.']],
  tns: [tn('PAT / NAPT', 'NAT có dịch cổng'), tn('timeout', 'thời gian chờ'), tn('keep-alive', 'gói giữ kết nối', 'Gói nhỏ gửi định kỳ để mục NAT không hết hạn.'), tn('rate limiting', 'giới hạn tần suất')],
  kn: ['port collision', 'NAT timeouts'],
});

/* ── 4. Gọi ngược vào: DNAT, CGNAT, docker -p ── */
const DK = S('c23-docker', 'docker run --rm --label netlab=1 --net host --cap-add NET_ADMIN net-lab iptables -t nat -S DOCKER');
const DK2 = S('c23-docker', 'docker run --rm --label netlab=1 --net host --cap-add NET_ADMIN net-lab iptables -t nat -S POSTROUTING');
const DKLOG = S('c23-docker', 'docker exec nfd-pdemo tail -n 1');
const E4 = cs({
  ten: 'NAT 4 — Calling in: port forwarding, CGNAT and docker -p', kho: 'MEDIUM', phut: 15,
  en: `Real output (lab/out/c23-vao, c23-dnat, c23-vao2, c23-vao3, c23-docker):${pre(['# from the server: the router\'s public address, port 8080', '$ nc -vz -w 3 198.51.100.2 8080', ...S('c23-vao', 'nc -vz -w 3 198.51.100.2'), '# on the home router', ...S('c23-dnat', 'iptables -t nat -S PREROUTING'), '# from the server again', '$ curl -s -m 3 http://198.51.100.2:8080/', ...S('c23-vao2', 'curl -s -m 3'), '# the 4G phone\'s public address', '$ nc -vz -w 3 198.51.100.200 8080', ...S('c23-vao3', 'nc -vz'), '', '# on your own machine: docker run -p 18080:80 nginx …', ...DK, ...DK2, '# nginx access log after curl http://127.0.0.1:18080/', ...DKLOG])}`,
  vi: `Output thật (lab/out/c23-vao, c23-dnat, c23-vao2, c23-vao3, c23-docker):${pre(['# từ máy chủ: địa chỉ công cộng của router, cổng 8080', '$ nc -vz -w 3 198.51.100.2 8080', ...S('c23-vao', 'nc -vz -w 3 198.51.100.2'), '# trên router nhà', ...S('c23-dnat', 'iptables -t nat -S PREROUTING'), '# lại từ máy chủ', '$ curl -s -m 3 http://198.51.100.2:8080/', ...S('c23-vao2', 'curl -s -m 3'), '# địa chỉ công cộng của điện thoại 4G', '$ nc -vz -w 3 198.51.100.200 8080', ...S('c23-vao3', 'nc -vz'), '', '# trên chính máy bạn: docker run -p 18080:80 nginx …', ...DK, ...DK2, '# log truy cập của nginx sau curl http://127.0.0.1:18080/', ...DKLOG])}`,
  cau: [
    q('c1', ['Before the DNAT rule, 198.51.100.2:8080 gave "Connection refused". Who refused?', 'Trước luật DNAT, 198.51.100.2:8080 báo "Connection refused". Ai từ chối?'], ['The home router itself: nothing listens on its 8080 and no rule says "this is the laptop\'s"', 'The laptop\'s dev server, which only accepts local connections', 'The ISP, which blocks incoming connections to home customers', 'The DC router, which has no route back to the server'], ['The SYN reached the router\'s own address. With no conntrack line and no forwarding rule it is a packet for the router, which has no service on 8080 ⇒ reset.', 'Gói SYN tới chính địa chỉ của router. Không có dòng conntrack và không có luật chuyển tiếp thì đó là gói cho router, mà router không có dịch vụ ở 8080 ⇒ reset.']),
    q('c2', ['"-A PREROUTING -i wan0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.50.10:8080" is …', '"-A PREROUTING -i wan0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.50.10:8080" là …'], ['port forwarding: incoming packets to 8080 get the laptop as their destination', 'source NAT: outgoing packets from the laptop get the router\'s address', 'a firewall rule that blocks port 8080 for everyone on the Internet', 'a route that sends 192.168.50.10 to the ISP through wan0'], ['DNAT rewrites the Destination before routing (PREROUTING). Home router menus call it "port forwarding" or "virtual server".', 'DNAT viết lại Đích trước khi định tuyến (PREROUTING). Menu router nhà gọi là "port forwarding" hay "virtual server".']),
    q('c3', ['After the demo, a teammate says: "it\'s fine to leave it, NAT is our firewall". You answer …', 'Sau buổi demo, một bạn nói: "cứ để vậy, NAT là tường lửa của mình mà". Bạn trả lời …'], ['NAT only blocked inbound by accident; with the rule, the dev server is open to anyone scanning', 'NAT encrypts the traffic, so leaving the rule is safe enough', 'The ISP will block scanners, so the rule does not matter', 'The rule expires by itself when the conntrack entry times out'], ['NAT blocks incoming connections only because it does not know where to send them. A forwarded port is reachable by the whole Internet — remove it, or use an outbound tunnel.', 'NAT chỉ chặn kết nối vào vì nó không biết gửi chúng đi đâu. Một cổng đã mở thì cả Internet tới được — gỡ nó, hoặc dùng đường hầm đi ra.']),
    q('c4', ['The 4G phone\'s public address 198.51.100.200 refuses too. Can its owner fix it with port forwarding?', 'Địa chỉ công cộng 198.51.100.200 của điện thoại 4G cũng từ chối. Chủ máy có sửa được bằng mở cổng không?'], ['No: that address belongs to the ISP\'s CGNAT, shared with other customers', 'Yes: in the phone\'s settings, like on a home router', 'Yes: by asking the server to connect from port 80 instead', 'No: 4G networks cannot carry TCP connections at all'], ['The phone has 100.64.0.10; the translation happens on the ISP\'s box, which you cannot configure. Outbound tunnels (Cloudflare Tunnel, ngrok, ssh -R) or IPv6 are the way out.', 'Điện thoại có 100.64.0.10; phép dịch xảy ra trên thiết bị của nhà mạng, bạn không cấu hình được. Đường hầm đi ra (Cloudflare Tunnel, ngrok, ssh -R) hoặc IPv6 là lối thoát.']),
    q('c5', ['Which statement about the Docker rules is right?', 'Câu nào đúng về các luật của Docker?'], ['-p 18080:80 is a DNAT rule to 172.17.0.5:80; containers go out through MASQUERADE', '-p 18080:80 opens port 80 on the host and closes 18080', 'The container gets a public address, so no NAT is needed', 'Docker uses its own kernel, so iptables does not see the rules'], ['Exactly the two home-router rules, inside your own machine: DNAT in, masquerade out of 172.17.0.0/16.', 'Đúng hai luật của router nhà, ngay trong máy bạn: DNAT chiều vào, masquerade chiều ra cho 172.17.0.0/16.']),
    q('c6', ['nginx logged the client as 192.168.65.1, not 127.0.0.1. Why, and why does it matter?', 'nginx ghi khách là 192.168.65.1, không phải 127.0.0.1. Vì sao, và vì sao quan trọng?'], ['Docker Desktop\'s own address after NAT: the app often does not see the real client IP', 'nginx resolved localhost to the first address of the Docker VM', 'curl sent the request through a proxy that was configured on the Mac', 'The container rewrote its own logs to hide the user\'s address'], ['Behind NAT and proxies the source address is the last translator. Chapter 7 shows how proxies pass the real one (X-Forwarded-For) and how to trust it safely.', 'Sau NAT và proxy, địa chỉ nguồn là bộ dịch cuối cùng. Chương 7 cho thấy proxy chuyển địa chỉ thật thế nào (X-Forwarded-For) và tin nó sao cho an toàn.']),
    q('c7', ['On a Linux server with ufw blocking everything, you run docker run -p 5432:5432 postgres. Result?', 'Trên máy chủ Linux có ufw chặn mọi thứ, bạn chạy docker run -p 5432:5432 postgres. Kết quả?'], ['Port 5432 is reachable from the Internet: published ports are NATed before ufw', 'ufw blocks 5432, so only the host itself can reach the database', 'Docker refuses to start because ufw already owns port 5432', 'The port is open only to other containers on the same bridge'], ['Docker\'s documentation: published ports skip the host firewall and bind all addresses by default. Use -p 127.0.0.1:5432:5432 for anything not meant to be public.', 'Tài liệu Docker: cổng công bố bỏ qua tường lửa của máy và mặc định nghe mọi địa chỉ. Dùng -p 127.0.0.1:5432:5432 cho thứ không cần công khai.']),
  ],
  goiY: [['Inbound needs either a conntrack line (a reply) or a DNAT rule; otherwise the packet is for the router itself.', 'Gói đi vào cần hoặc một dòng conntrack (là câu trả lời) hoặc một luật DNAT; không thì gói đó là cho chính router.'], ['Check where the translation happens: your router (you can forward) or the ISP\'s (you cannot).', 'Xem phép dịch xảy ra ở đâu: router của bạn (mở cổng được) hay của nhà mạng (không được).']],
  loi: [['Calling NAT a firewall and leaving a forwarded dev server online.', 'Gọi NAT là tường lửa và để server phát triển đã mở cổng trên mạng.'], ['Publishing a database with -p 5432:5432 on a server and trusting ufw.', 'Công bố cơ sở dữ liệu bằng -p 5432:5432 trên máy chủ rồi tin vào ufw.']],
  tns: [tn('DNAT / port forwarding', 'NAT đích / mở cổng'), tn('CGNAT', 'NAT của nhà mạng', 'Khách hàng nhận 100.64.0.0/10.'), tn('published port', 'cổng công bố', 'docker run -p: một luật DNAT trên máy chủ.'), tn('ufw', 'tường lửa đơn giản của Ubuntu')],
  kn: ['DNAT', 'CGNAT', 'Docker networking'],
});

/* ── 5. Tự viết: parseConntrack(text) ── */
function parseConntrack(text) {
  var out = [];
  String(text).split('\n').forEach(function (line) {
    var w = line.trim().split(/\s+/);
    if (w[0] !== 'tcp' && w[0] !== 'udp') return;               // the "conntrack v1.4.9 …" banner and other protocols
    var e = { proto: w[0], timeout: Number(w[2]), state: null, orig: {}, reply: {}, flags: [] };
    var half = e.orig;
    w.slice(3).forEach(function (x) {
      if (/^\[[A-Z_]+\]$/.test(x)) { e.flags.push(x.slice(1, -1)); return; }     // [ASSURED] [UNREPLIED]
      var kv = /^(src|dst|sport|dport)=(.*)$/.exec(x);
      if (kv) {
        if (kv[1] === 'src' && half.src !== undefined) half = e.reply;            // the second src= starts the reply half
        half[kv[1]] = kv[1].indexOf('port') >= 0 ? Number(kv[2]) : kv[2];
        return;
      }
      if (/^[A-Z_]+$/.test(x) && e.state === null && half === e.orig && e.orig.src === undefined) e.state = x;   // TIME_WAIT, ESTABLISHED… (tcp only)
    });
    var o = e.orig, r = e.reply;
    e.snat = (r.dst !== o.src || r.dport !== o.sport) ? { ip: r.dst, port: r.dport } : null;   // the source the outside world sees
    e.dnat = (r.src !== o.dst || r.sport !== o.dport) ? { ip: r.src, port: r.sport } : null;   // the real destination inside
    out.push(e);
  });
  return out;
}
const CT_TXT = CT.join('\n');
// DỰNG (ghi rõ trong đề): một dòng DNAT (khách gọi 8443 vào laptop:8080) và một dòng UDP chưa có trả lời.
const CT_DNAT = 'tcp      6 431997 ESTABLISHED src=203.0.113.10 dst=198.51.100.2 sport=51234 dport=8443 src=192.168.50.10 dst=203.0.113.10 sport=8080 dport=51234 [ASSURED] mark=0 use=1';
const CT_UDP = 'udp      17 28 src=192.168.50.10 dst=198.51.100.1 sport=53011 dport=53 [UNREPLIED] src=198.51.100.1 dst=198.51.100.2 sport=53 dport=53011 mark=0 use=1';
const E5 = jsBai({
  ten: 'NAT 5 — Write parseConntrack(text)', kho: 'MEDIUM', phut: 25,
  en: `<p>Write <code>parseConntrack(text)</code> for the output of <code>conntrack -L</code>. Real example (lab/out/c23-homegw):</p>${pre(CT)}<p>Return one object per <code>tcp</code> or <code>udp</code> line (skip every other line):</p>
<pre>{ proto, timeout, state, orig: { src, dst, sport, dport }, reply: { src, dst, sport, dport }, flags, snat, dnat }</pre>
<ul>
<li><code>timeout</code> — the third word, a number. <code>state</code> — the TCP state word (<code>TIME_WAIT</code>, <code>ESTABLISHED</code>…) or <code>null</code> (UDP has none).</li>
<li>The <b>first</b> <code>src= dst= sport= dport=</code> group is <code>orig</code>, the <b>second</b> is <code>reply</code>; ports are numbers. <code>flags</code> — the words in brackets without the brackets (<code>["ASSURED"]</code>). Ignore <code>mark=</code>, <code>use=</code>.</li>
<li><code>snat</code> — if reply.dst or reply.dport differs from orig.src / orig.sport: <code>{ ip: reply.dst, port: reply.dport }</code> (what the outside world saw), else <code>null</code>.</li>
<li><code>dnat</code> — if reply.src or reply.sport differs from orig.dst / orig.dport: <code>{ ip: reply.src, port: reply.sport }</code> (where the packet really went), else <code>null</code>.</li>
</ul><p>Hidden cases: the real CGNAT line of the ISP, the real Lab 2 table, and two <b>constructed</b> lines — a port-forwarded connection (DNAT) and a UDP DNS query with <code>[UNREPLIED]</code> between the two halves.</p>`,
  vi: `<p>Viết <code>parseConntrack(text)</code> cho output của <code>conntrack -L</code>. Ví dụ thật (lab/out/c23-homegw):</p>${pre(CT)}<p>Trả về một object cho mỗi dòng <code>tcp</code> hoặc <code>udp</code> (bỏ qua mọi dòng khác):</p>
<pre>{ proto, timeout, state, orig: { src, dst, sport, dport }, reply: { src, dst, sport, dport }, flags, snat, dnat }</pre>
<ul>
<li><code>timeout</code> — chữ thứ ba, là số. <code>state</code> — chữ trạng thái TCP (<code>TIME_WAIT</code>, <code>ESTABLISHED</code>…) hoặc <code>null</code> (UDP không có).</li>
<li>Nhóm <code>src= dst= sport= dport=</code> <b>đầu tiên</b> là <code>orig</code>, nhóm <b>thứ hai</b> là <code>reply</code>; cổng là số. <code>flags</code> — các chữ trong ngoặc vuông, bỏ ngoặc (<code>["ASSURED"]</code>). Bỏ qua <code>mark=</code>, <code>use=</code>.</li>
<li><code>snat</code> — nếu reply.dst hoặc reply.dport khác orig.src / orig.sport: <code>{ ip: reply.dst, port: reply.dport }</code> (thứ thế giới bên ngoài thấy), ngược lại <code>null</code>.</li>
<li><code>dnat</code> — nếu reply.src hoặc reply.sport khác orig.dst / orig.dport: <code>{ ip: reply.src, port: reply.sport }</code> (nơi gói thật sự tới), ngược lại <code>null</code>.</li>
</ul><p>Ca ẩn: dòng CGNAT thật của isp, bảng thật của Lab 2, và hai dòng <b>dựng</b> — một kết nối qua cổng đã mở (DNAT) và một truy vấn DNS UDP có <code>[UNREPLIED]</code> nằm giữa hai nửa.</p>`,
  dauVao: ['text — the output of conntrack -L (any number of lines).', 'text — output của conntrack -L (bao nhiêu dòng cũng được).'],
  dauRa: ['An array of { proto, timeout, state, orig, reply, flags, snat, dnat }.', 'Mảng { proto, timeout, state, orig, reply, flags, snat, dnat }.'],
  goiY: [
    ['Split a line into words; key=value words split again at "=". The second "src=" you meet starts the reply half.', 'Tách dòng thành từ; từ dạng khoá=giá trị tách tiếp ở "=". Chữ "src=" thứ hai bạn gặp là bắt đầu nửa trả lời.'],
    ['Compare after parsing: snat looks at the source side (orig.src vs reply.dst), dnat at the destination side (orig.dst vs reply.src).', 'So sau khi phân tích: snat nhìn phía nguồn (orig.src với reply.dst), dnat nhìn phía đích (orig.dst với reply.src).'],
  ],
  loi: [
    ['Splitting by position (word 4 = src…): the UDP line has no state word and has [UNREPLIED] in the middle.', 'Tách theo vị trí (chữ thứ 4 = src…): dòng UDP không có chữ trạng thái và có [UNREPLIED] ở giữa.'],
    ['Leaving ports as strings: "4734" !== 4734 when you compare later.', 'Để cổng là chuỗi: "4734" !== 4734 khi so về sau.'],
    ['Reading reply.src (the server) as the device\'s public address.', 'Đọc reply.src (máy chủ) thành địa chỉ công cộng của thiết bị.'],
  ],
  gt: ['conntrack stores each connection as two tuples: the one the first packet had, and the one replies will have. NAT is nothing more than the difference between them, which is why the translation can be read from the table: the reply goes to the public address and port (SNAT), and comes from the real inside server (DNAT). Parsing by key instead of by position survives the variations of real output — no state for UDP, flags between the halves.', 'conntrack lưu mỗi kết nối thành hai bộ giá trị: bộ của gói đầu tiên, và bộ mà câu trả lời sẽ có. NAT không gì hơn là chênh lệch giữa hai bộ đó, nên phép dịch đọc được từ bảng: câu trả lời đi tới địa chỉ và cổng công cộng (SNAT), và đến từ máy chủ thật ở bên trong (DNAT). Phân tích theo khoá thay vì theo vị trí chịu được các biến thể của output thật — UDP không có trạng thái, cờ nằm giữa hai nửa.'],
  kn: ['conntrack', 'parsing tool output'],
  tns: [tn('tuple', 'bộ giá trị', 'Ở đây: src, dst, sport, dport.'), tn('[ASSURED]', 'đã thấy lưu lượng cả hai chiều'), tn('[UNREPLIED]', 'chưa có câu trả lời')],
  dau: `/** conntrack -L text ⇒ [{ proto, timeout, state, orig, reply, flags, snat, dnat }] */
function parseConntrack(text) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution\n' + nguon(parseConntrack),
  cases: [
    { goi: goi('parseConntrack', CT_TXT), moTa: ['The real home-router table (c23-homegw)', 'Bảng thật của router nhà (c23-homegw)'] },
    { goi: goi('parseConntrack', CT[2]), moTa: ['One real line: the phone, 41000 → 4734', 'Một dòng thật: điện thoại, 41000 → 4734'] },
    { goi: goi('parseConntrack', CT_ISP.join('\n')), an: true },
    { goi: goi('parseConntrack', CT_LAB2.join('\n')), an: true },
    { goi: goi('parseConntrack', CT_DNAT), an: true, moTa: ['Hidden: a port-forwarded connection (constructed)', 'Ẩn: kết nối qua cổng đã mở (dựng)'] },
    { goi: goi('parseConntrack', CT_UDP), an: true, moTa: ['Hidden: UDP with [UNREPLIED] (constructed)', 'Ẩn: UDP có [UNREPLIED] (dựng)'] },
    { goi: goi('parseConntrack', 'conntrack v1.4.9 (conntrack-tools): 0 flow entries have been shown.'), an: true },
  ],
});

/* ── 6. Tự viết: natOut / natIn ── */
function natOut(table, p) {
  function same(a, b) { return a.src === b.src && a.dst === b.dst && a.sport === b.sport && a.dport === b.dport; }
  var conns = table.conns;
  for (var i = 0; i < conns.length; i++) {
    var c = conns[i];
    if (same(c.orig, p)) return { src: c.reply.dst, sport: c.reply.dport, dst: p.dst, dport: p.dport };   // a known connection: same mapping
    if (same(c.reply, p)) return { src: c.orig.dst, sport: c.orig.dport, dst: c.orig.src, dport: c.orig.sport };   // the inside server answers a forwarded connection
  }
  // a new connection: keep the source port unless that outside tuple is already used by another connection
  function taken(port) {
    var t = { src: p.dst, dst: table.publicIp, sport: p.dport, dport: port };
    return conns.some(function (c) { return same(c.reply, t) || same(c.orig, t); });
  }
  var port = p.sport;
  if (taken(port)) {
    port = null;
    var pool = table.portPool || [];
    for (var k = 0; k < pool.length; k++) if (!taken(pool[k])) { port = pool[k]; break; }
    if (port === null) return null;                     // no free port: the packet is dropped
  }
  conns.push({ orig: { src: p.src, dst: p.dst, sport: p.sport, dport: p.dport }, reply: { src: p.dst, dst: table.publicIp, sport: p.dport, dport: port } });
  return { src: table.publicIp, sport: port, dst: p.dst, dport: p.dport };
}
function natIn(table, p) {
  function same(a, b) { return a.src === b.src && a.dst === b.dst && a.sport === b.sport && a.dport === b.dport; }
  var conns = table.conns;
  for (var i = 0; i < conns.length; i++) {
    var c = conns[i];
    if (same(c.reply, p)) return { src: p.src, sport: p.sport, dst: c.orig.src, dport: c.orig.sport };     // a reply: back to the inside device
    if (same(c.orig, p)) return { src: p.src, sport: p.sport, dst: c.reply.src, dport: c.reply.sport };   // more packets of a forwarded connection
  }
  if (p.dst !== table.publicIp) return null;
  var rule = (table.dnat || []).filter(function (r) { return r.port === p.dport; })[0];
  if (!rule) return null;                               // unsolicited and no forwarding rule: dropped
  conns.push({ orig: { src: p.src, dst: p.dst, sport: p.sport, dport: p.dport }, reply: { src: rule.to, dst: p.src, sport: rule.toPort, dport: p.sport } });
  return { src: p.src, sport: p.sport, dst: rule.to, dport: rule.toPort };
}
const pk = (src, sport, dst, dport) => ({ src, sport, dst, dport });
const L = '192.168.50.10', PH = '192.168.50.11', SV = '203.0.113.10', PUB = '198.51.100.2';
const kich = (cfg, steps) => `(function () { var t = ${JSON.stringify({ ...cfg, conns: [] })}; var out = [${steps.map(([f, p]) => `${f}(t, ${JSON.stringify(p)})`).join(', ')}]; return { out: out, conns: t.conns }; })()`;
const HOME = { publicIp: PUB, portPool: [4734], dnat: [] };
const E6 = jsBai({
  ten: 'NAT 6 — Write a NAT router: natOut() and natIn()', kho: 'HARD', phut: 45,
  en: `<p>Build the home router's translator. A <code>table</code> is <code>{ publicIp, portPool, dnat, conns }</code>: <code>portPool</code> = the ports to try, in order, when a source port is already taken; <code>dnat</code> = forwarding rules <code>[{ port, to, toPort }]</code>; <code>conns</code> = the conntrack table, an array you fill with <code>{ orig, reply }</code> (each <code>{ src, dst, sport, dport }</code>, like exercise 5). Packets are <code>{ src, sport, dst, dport }</code> (TCP only).</p>
<p><b>natOut(table, p)</b> — a packet leaving the house:</p>
<ol>
<li>If a conn has <code>orig</code> equal to <code>p</code> ⇒ translate with that conn: source = its reply.dst : reply.dport.</li>
<li>If a conn has <code>reply</code> equal to <code>p</code> (the inside server answering a forwarded connection) ⇒ return <code>{ src: orig.dst, sport: orig.dport, dst: orig.src, dport: orig.sport }</code>.</li>
<li>Otherwise it is new. The outside tuple would be <code>{ src: p.dst, dst: publicIp, sport: p.dport, dport: port }</code> with <code>port = p.sport</code>. If any conn already has that tuple (as orig or reply), try the ports of <code>portPool</code> in order; none free ⇒ return <code>null</code> (dropped).</li>
<li>Add <code>{ orig: p, reply: that outside tuple }</code> to <code>conns</code> and return <code>{ src: publicIp, sport: port, dst: p.dst, dport: p.dport }</code>.</li>
</ol>
<p><b>natIn(table, p)</b> — a packet arriving from the Internet:</p>
<ol>
<li>If a conn has <code>reply</code> equal to <code>p</code> ⇒ it is an answer: return it with <code>dst: orig.src, dport: orig.sport</code>.</li>
<li>If a conn has <code>orig</code> equal to <code>p</code> ⇒ a later packet of a forwarded connection: <code>dst: reply.src, dport: reply.sport</code>.</li>
<li>Otherwise, if <code>p.dst</code> is <code>publicIp</code> and a <code>dnat</code> rule has <code>port === p.dport</code> ⇒ add <code>{ orig: p, reply: { src: to, dst: p.src, sport: toPort, dport: p.sport } }</code> and return <code>p</code> with <code>dst: to, dport: toPort</code>.</li>
<li>Otherwise ⇒ <code>null</code>: unsolicited traffic is dropped.</li>
</ol>
<p>The first visible case replays the real lab: the laptop from 41122, the laptop from 41000, then the phone from 41000 — with <code>portPool: [4734]</code> your router must hand out <b>4734</b> and end with the same three conntrack entries as the real router (lab/out/c23-homegw; conntrack lists them in another order):</p>${pre(CT)}<p>Hidden cases: replies, the 8443 → laptop:8080 forwarding of Lab 2 with the laptop's answer, the ISP's CGNAT, a pool that runs out, a taken pool port, the same port towards another destination, and packets nobody asked for.</p>`,
  vi: `<p>Dựng bộ dịch của router nhà. Một <code>table</code> là <code>{ publicIp, portPool, dnat, conns }</code>: <code>portPool</code> = các cổng thử lần lượt khi cổng nguồn đã bị dùng; <code>dnat</code> = các luật mở cổng <code>[{ port, to, toPort }]</code>; <code>conns</code> = bảng conntrack, một mảng bạn điền <code>{ orig, reply }</code> (mỗi cái <code>{ src, dst, sport, dport }</code>, như bài 5). Gói là <code>{ src, sport, dst, dport }</code> (chỉ TCP).</p>
<p><b>natOut(table, p)</b> — một gói rời khỏi nhà:</p>
<ol>
<li>Nếu có conn với <code>orig</code> bằng <code>p</code> ⇒ dịch theo conn đó: nguồn = reply.dst : reply.dport của nó.</li>
<li>Nếu có conn với <code>reply</code> bằng <code>p</code> (máy chủ bên trong trả lời một kết nối đã mở cổng) ⇒ trả <code>{ src: orig.dst, sport: orig.dport, dst: orig.src, dport: orig.sport }</code>.</li>
<li>Ngược lại là kết nối mới. Bộ giá trị bên ngoài sẽ là <code>{ src: p.dst, dst: publicIp, sport: p.dport, dport: port }</code> với <code>port = p.sport</code>. Nếu có conn đã mang bộ đó (ở orig hay reply), thử lần lượt các cổng trong <code>portPool</code>; không còn cổng trống ⇒ trả <code>null</code> (bị vứt).</li>
<li>Thêm <code>{ orig: p, reply: bộ bên ngoài đó }</code> vào <code>conns</code> và trả <code>{ src: publicIp, sport: port, dst: p.dst, dport: p.dport }</code>.</li>
</ol>
<p><b>natIn(table, p)</b> — một gói tới từ Internet:</p>
<ol>
<li>Nếu có conn với <code>reply</code> bằng <code>p</code> ⇒ đó là câu trả lời: trả về với <code>dst: orig.src, dport: orig.sport</code>.</li>
<li>Nếu có conn với <code>orig</code> bằng <code>p</code> ⇒ gói sau của một kết nối đã mở cổng: <code>dst: reply.src, dport: reply.sport</code>.</li>
<li>Ngược lại, nếu <code>p.dst</code> là <code>publicIp</code> và có luật <code>dnat</code> với <code>port === p.dport</code> ⇒ thêm <code>{ orig: p, reply: { src: to, dst: p.src, sport: toPort, dport: p.sport } }</code> và trả <code>p</code> với <code>dst: to, dport: toPort</code>.</li>
<li>Còn lại ⇒ <code>null</code>: lưu lượng không ai mời bị vứt.</li>
</ol>
<p>Ca hiện đầu tiên phát lại lab thật: laptop từ 41122, laptop từ 41000, rồi điện thoại từ 41000 — với <code>portPool: [4734]</code> router của bạn phải cấp <b>4734</b> và kết thúc với đúng ba mục conntrack như router thật (lab/out/c23-homegw; conntrack liệt kê theo thứ tự khác):</p>${pre(CT)}<p>Ca ẩn: câu trả lời, mở cổng 8443 → laptop:8080 của Lab 2 kèm câu trả lời của laptop, CGNAT của isp, kho cổng cạn, cổng trong kho đã bị dùng, cùng cổng tới một đích khác, và gói không ai mời.</p>`,
  dauVao: ['table — { publicIp, portPool?, dnat?, conns }; p — { src, sport, dst, dport }.', 'table — { publicIp, portPool?, dnat?, conns }; p — { src, sport, dst, dport }.'],
  dauRa: ['The translated packet { src, sport, dst, dport }, or null. Both functions update table.conns.', 'Gói đã dịch { src, sport, dst, dport }, hoặc null. Cả hai hàm cập nhật table.conns.'],
  rangBuoc: [['Mutate table.conns (push); do not replace the array. Treat missing portPool / dnat as empty.', 'Sửa table.conns (push); không thay mảng khác. portPool / dnat thiếu thì coi như rỗng.']],
  goiY: [
    ['Write same(a, b) that compares src, dst, sport, dport — every rule is "find a conn whose orig or reply is the same as …".', 'Viết same(a, b) so src, dst, sport, dport — luật nào cũng là "tìm conn có orig hoặc reply giống …".'],
    ['A collision depends on the destination: the laptop\'s 41000 to another server is not taken. Build the outside tuple first, then search for it.', 'Đụng cổng phụ thuộc đích: 41000 của laptop tới máy chủ khác không bị chiếm. Dựng bộ bên ngoài trước, rồi tìm nó.'],
    ['Check existing conns before the DNAT rules in natIn, and before allocating in natOut.', 'Kiểm các conn sẵn có trước luật DNAT trong natIn, và trước khi cấp cổng trong natOut.'],
  ],
  loi: [
    ['Treating a port as taken whenever any connection uses it — the router only needs the full outside tuple to be unique.', 'Coi một cổng là bị chiếm hễ có kết nối nào dùng nó — router chỉ cần bộ giá trị bên ngoài đầy đủ là duy nhất.'],
    ['Creating a second conn for every packet of the same connection.', 'Tạo conn thứ hai cho mỗi gói của cùng một kết nối.'],
    ['Letting unsolicited packets through to the first machine of the LAN — or forgetting the laptop\'s answers on a forwarded port.', 'Cho gói không ai mời đi tới máy đầu tiên của LAN — hoặc quên câu trả lời của laptop trên cổng đã mở.'],
  ],
  gt: ['A NAT router is a lookup table with two keys per entry. Outgoing, the first packet of a connection creates an entry whose reply tuple is the one the outside world will use; the source port is kept unless that exact outside tuple is already taken, which is how the real router kept 41000 for the laptop and gave the phone 4734 — while 41000 towards another server stays free. Incoming, a packet is only accepted if it matches an entry (a reply, or a forwarded connection) or creates one through an explicit DNAT rule; everything else has nowhere to go, which is the "NAT blocks inbound" effect — a side effect, not a firewall. The same two tables explain CGNAT: the ISP\'s router runs exactly this code with publicIp 198.51.100.200, and only the ISP can add DNAT rules there.', 'Router NAT là một bảng tra với hai khoá cho mỗi mục. Chiều ra, gói đầu tiên của kết nối tạo một mục có bộ reply là bộ mà thế giới bên ngoài sẽ dùng; cổng nguồn giữ nguyên trừ khi đúng bộ bên ngoài đó đã bị dùng — đó là cách router thật giữ 41000 cho laptop và cấp 4734 cho điện thoại, trong khi 41000 tới máy chủ khác vẫn trống. Chiều vào, gói chỉ được nhận nếu khớp một mục (câu trả lời, hoặc kết nối đã mở cổng) hoặc tạo được mục qua luật DNAT rõ ràng; mọi thứ khác không có chỗ để đi — đó là hiệu ứng "NAT chặn chiều vào", một tác dụng phụ chứ không phải tường lửa. Hai bảng ấy giải thích luôn CGNAT: router của nhà mạng chạy đúng đoạn code này với publicIp 198.51.100.200, và chỉ nhà mạng mới thêm được luật DNAT ở đó.'],
  kn: ['NAT', 'conntrack', 'port forwarding'],
  tns: [tn('port pool', 'kho cổng', 'Các cổng router được phép cấp khi đụng cổng.'), tn('unsolicited', 'không ai mời', 'Gói đi vào không thuộc kết nối nào.'), tn('mutate', 'sửa tại chỗ')],
  dau: `/**
 * table = { publicIp, portPool: [..], dnat: [{ port, to, toPort }], conns: [] }
 * p     = { src, sport, dst, dport }
 * Both return the translated packet, or null. Both may push { orig, reply } into table.conns.
 */
function natOut(table, p) {
  // Write your solution here
  return null;
}

function natIn(table, p) {
  // Write your solution here
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(natOut, natIn),
  cases: [
    { goi: kich(HOME, [['natOut', pk(L, 41122, SV, 80)], ['natOut', pk(L, 41000, SV, 80)], ['natOut', pk(PH, 41000, SV, 80)]]), moTa: ['The real lab: laptop 41122, laptop 41000, phone 41000 ⇒ 4734', 'Lab thật: laptop 41122, laptop 41000, điện thoại 41000 ⇒ 4734'] },
    { goi: kich(HOME, [['natOut', pk(L, 41000, SV, 80)], ['natOut', pk(PH, 41000, SV, 80)], ['natIn', pk(SV, 80, PUB, 4734)], ['natIn', pk(SV, 80, PUB, 41000)]]), moTa: ['The server answers both: 4734 goes to the phone, 41000 to the laptop', 'Máy chủ trả lời cả hai: 4734 về điện thoại, 41000 về laptop'] },
    { goi: kich(HOME, [['natIn', pk(SV, 51234, PUB, 8080)]]), moTa: ['Unsolicited: the server calls 198.51.100.2:8080 with no rule', 'Không ai mời: máy chủ gọi 198.51.100.2:8080 khi chưa có luật'] },
    { goi: kich({ publicIp: PUB, dnat: [{ port: 8443, to: L, toPort: 8080 }] }, [['natIn', pk(SV, 51234, PUB, 8443)], ['natOut', pk(L, 8080, SV, 51234)], ['natIn', pk(SV, 51234, PUB, 8443)], ['natIn', pk(SV, 51235, PUB, 8080)]]), an: true, moTa: ['Hidden: Lab 2 forwarding 8443 → laptop:8080, the laptop answers', 'Ẩn: mở cổng 8443 → laptop:8080 của Lab 2, laptop trả lời'] },
    { goi: kich({ publicIp: '198.51.100.200', portPool: [] }, [['natOut', pk('100.64.0.10', 47852, SV, 80)], ['natIn', pk(SV, 80, '198.51.100.200', 47852)], ['natIn', pk(SV, 51234, '198.51.100.200', 8443)]]), an: true, moTa: ['Hidden: the ISP\'s CGNAT (real addresses and port of c23-isp)', 'Ẩn: CGNAT của isp (địa chỉ và cổng thật của c23-isp)'] },
    { goi: kich({ publicIp: PUB, portPool: [] }, [['natOut', pk(L, 41000, SV, 80)], ['natOut', pk(PH, 41000, SV, 80)]]), an: true },
    { goi: kich({ publicIp: PUB, portPool: [41000, 4734, 5000] }, [['natOut', pk(L, 41000, SV, 80)], ['natOut', pk(PH, 4734, SV, 80)], ['natOut', pk('192.168.50.12', 41000, SV, 80)]]), an: true },
    { goi: kich(HOME, [['natOut', pk(L, 41000, SV, 80)], ['natOut', pk(PH, 41000, '203.0.113.53', 53)], ['natOut', pk(PH, 41000, SV, 443)]]), an: true },
    { goi: kich(HOME, [['natOut', pk(L, 41122, SV, 80)], ['natOut', pk(L, 41122, SV, 80)], ['natIn', pk(SV, 80, PUB, 41122)], ['natIn', pk(SV, 80, PUB, 41123)], ['natIn', pk(SV, 80, '198.51.100.9', 41122)]]), an: true },
  ],
});

export default doiDau({ slug: 'netdev-2-3-nat', ten: '2.3 NAT, private ranges and Docker networks', khoa: KHOA, baiHoc: 'netdev-2-3-nat', de: [E1, E2, E3, E4, E5, E6] });
