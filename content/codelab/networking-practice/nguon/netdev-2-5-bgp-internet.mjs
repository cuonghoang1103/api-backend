/** Networking for Developers · 2.5 — AS và BGP: transit/peering/IX, đọc bảng FRR thật (best, next hop, AS path, AS gốc), cướp tuyến bằng dải cụ thể hơn, prefix-list, RPKI thật của cuongthai.com, rút tuyến kiểu Facebook; tự viết parseBgpTable / rpkiValidate / detectHijacks. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const S = (tep, lenh) => tr(sauLenh(tep, lenh));
// Bảng FRR in 5 dòng chú giải — ẩn khi trình bày trong đề (giữ nguyên khi làm đầu vào cho hàm).
const GON = (ds) => ds.filter((d) => d.trim() && !/^(Status codes|\s+i internal|Nexthop codes|Origin codes|RPKI validation|Default local pref|BGP table version)/.test(d));
const BGP = "vtysh -c 'show ip bgp'";
const ISP = S('c25-isp', BGP);
const DC = S('c25-dc', BGP);
const CUOP = S('c25-isp-cuop', BGP);
const RUT = S('c25-isp-rut', BGP);
const ROGUE = S('c25-rogue-cuop', BGP);
const V6 = S('c25-isp', "vtysh -c 'show bgp ipv6 unicast'");
const LAB2 = S('lab2-r2-isp', BGP);
const LAB2B = S('lab2-r6-isp', BGP);
const SUM = GON(S('c25-isp', "vtysh -c 'show bgp ipv4 unicast summary'"));
const THAT = S('c25-that', 'IP=').concat(...['jq -r \'.data | "', 'rpki "$AS" "$PFX"', 'curl -s "https://stat.ripe.net/data/rpki-validation/data.json?resource=$AS&prefix=$PFX" | jq', 'rpki 64511', 'rpki "$AS" 160.187.1.0/25'].map((l) => S('c25-that', l)));
// Cùng output thật, kèm dòng chú thích nói lệnh nào (RIPEstat gọi qua curl + jq trong tệp gốc).
const THAT_IN = ['# dig +short cuongthai.com A', THAT[0], '# RIPEstat prefix-overview for that address', THAT[1], '# RIPEstat rpki-validation: AS152992, 160.187.0.0/23', THAT[2], '# … and the ROA it was checked against', THAT[3], '# RIPEstat rpki-validation: AS64511, 160.187.0.0/23', THAT[4], '# RIPEstat rpki-validation: AS152992, 160.187.1.0/25', THAT[5]];
if (!ISP.some((d) => d.includes('203.0.113.0/24   192.0.2.3')) || !CUOP.some((d) => d.includes('203.0.113.0/25')) || THAT.length !== 6) throw new Error('2.5: output BGP/RPKI thật không như mong đợi');

/* ── 1. AS, transit, peering, IX ── */
const E1 = cs({
  ten: 'BGP 1 — Autonomous systems, transit, peering and exchange points', kho: 'EASY', phut: 10,
  en: `The Internet is tens of thousands of independent networks. Real output from the lab's ISP router (FRR, legend lines hidden — lab/out/c25-isp) and from the real Internet through RIPE's public API (lab/out/c25-that):${pre(['$ vtysh -c \'show bgp ipv4 unicast summary\'', ...SUM, '', '# real Internet (RIPEstat, read-only)', ...THAT_IN.slice(0, 4)])}`,
  vi: `Internet là hàng chục nghìn mạng độc lập. Output thật từ router isp của lab (FRR, đã ẩn các dòng chú giải — lab/out/c25-isp) và từ Internet thật qua API công khai của RIPE (lab/out/c25-that):${pre(['$ vtysh -c \'show bgp ipv4 unicast summary\'', ...SUM, '', '# Internet thật (RIPEstat, chỉ đọc)', ...THAT_IN.slice(0, 4)])}`,
  cau: [
    q('c1', ['What is an Autonomous System (AS)?', 'Hệ tự trị (AS) là gì?'], ['A network under one administration and routing policy, with an AS number', 'One router of an ISP, numbered by the manufacturer', 'A group of websites that share the same IP address', 'The part of the Internet that one country controls'], ['ISPs, clouds, universities and big companies each run one or more ASes. Cloudflare is AS13335, Google AS15169; the network carrying cuongthai.com\'s server is AS152992.', 'Nhà mạng, cloud, trường đại học và công ty lớn mỗi bên vận hành một hay nhiều AS. Cloudflare là AS13335, Google AS15169; mạng chở máy chủ của cuongthai.com là AS152992.']),
    q('c2', ['A small ISP pays a big one to carry its traffic to the whole Internet. That is …', 'Một nhà mạng nhỏ trả tiền cho nhà mạng lớn để chở lưu lượng của mình ra cả Internet. Đó là …'], ['transit', 'peering', 'NAT', 'anycast'], ['Transit = paid access to everything. Peering = two networks exchange only their own customers\' traffic, usually without payment.', 'Transit = trả tiền để tới mọi nơi. Peering = hai mạng chỉ trao đổi lưu lượng của khách hàng mình, thường không trả tiền.']),
    q('c3', ['Why does Vietnam run VNIX (VNNIC, in Hanoi, Da Nang and Ho Chi Minh City)?', 'Vì sao Việt Nam vận hành VNIX (VNNIC, ở Hà Nội, Đà Nẵng và TP. Hồ Chí Minh)?'], ['So traffic between two Vietnamese ISPs does not travel abroad and back', 'So that all Vietnamese websites share one public IP address', 'To filter every BGP announcement that enters the country', 'To give every home in Vietnam an IPv6 address'], ['An exchange point is a shared switch where many networks plug in and peer. Without it, two local ISPs might only meet through a transit provider in another country.', 'Điểm trao đổi là một switch dùng chung nơi nhiều mạng cắm vào và peering. Không có nó, hai nhà mạng trong nước có thể chỉ gặp nhau qua nhà cung cấp transit ở nước khác.']),
    q('c4', ['In the summary, both neighbours show "1" under State/PfxRcd. Meaning?', 'Trong bản tóm tắt, cả hai hàng xóm hiện "1" ở cột State/PfxRcd. Nghĩa là gì?'], ['The session is up (Established) and each neighbour sent one prefix', 'Each neighbour has one router left, the others are down', 'The session failed once and was restarted one time', 'Each neighbour is one AS away from the ISP'], ['When a session is down, the column shows a state such as Active or Idle; when it is up, it shows the number of prefixes received. The DC sent 203.0.113.0/24, the other network 198.18.0.0/24.', 'Khi phiên rớt, cột này hiện trạng thái như Active hay Idle; khi phiên chạy, nó hiện số prefix nhận được. DC gửi 203.0.113.0/24, mạng kia 198.18.0.0/24.']),
    q('c5', ['BGP routers talk to each other over …', 'Các router BGP nói chuyện với nhau qua …'], ['a TCP session on port 179', 'UDP broadcasts on the exchange LAN', 'ICMP messages like traceroute', 'HTTPS requests to a central registry'], ['BGP is an application on top of TCP (port 179): open a session to each neighbour, then send announcements and withdrawals.', 'BGP là một ứng dụng chạy trên TCP (cổng 179): mở phiên tới từng hàng xóm, rồi gửi các thông báo quảng bá và rút tuyến.']),
    q('c6', ['The lab uses AS64500, AS64510 and AS64511. Why those numbers?', 'Lab dùng AS64500, AS64510 và AS64511. Vì sao là các số đó?'], ['64496–64511 are reserved for documentation, like 203.0.113.0/24', 'They are the ASNs of three real Vietnamese ISPs', 'They are private ASNs that every home router uses', 'FRR assigns them automatically to new routers'], ['Like the documentation address ranges, these ASNs belong to nobody, so the lab never imitates a real network.', 'Giống các dải địa chỉ dành cho tài liệu, các ASN này không thuộc về ai, nên lab không bao giờ giả một mạng thật.']),
  ],
  goiY: [['Transit = customer pays provider; peering = two equals swap traffic.', 'Transit = khách trả tiền cho nhà cung cấp; peering = hai bên ngang nhau trao lưu lượng.'], ['An exchange point is where peering physically happens.', 'Điểm trao đổi là nơi peering diễn ra về mặt vật lý.']],
  loi: [['Thinking one company "runs the Internet".', 'Nghĩ một công ty nào đó "vận hành Internet".'], ['Confusing an AS with a single router or a single IP range.', 'Nhầm AS với một router hay một dải IP.']],
  tns: [tn('Autonomous System (AS)', 'hệ tự trị'), tn('ASN', 'số hiệu AS'), tn('transit / peering', 'mua đường đi / trao đổi ngang hàng'), tn('IXP', 'điểm trao đổi Internet', 'Ở Việt Nam: VNIX.')],
  kn: ['autonomous systems', 'BGP'],
});

/* ── 2. Đọc bảng show ip bgp ── */
const CO = ['yes', 'no'];
const RONG = ['empty', '(empty)', 'none', '-'];
const E2 = cs({
  ten: 'BGP 2 — Read show ip bgp: best route, next hop, AS path, origin', kho: 'MEDIUM', phut: 15, loai: 'table',
  en: `Real tables from the lab (legend hidden): the ISP (AS64500, lab/out/c25-isp) and the datacenter (AS64510, lab/out/c25-dc).${pre(['# isp', ...GON(ISP), '', '# dc', ...GON(DC)])}<code>*&gt;</code> = valid and best. Next Hop <code>0.0.0.0</code> = announced by this router itself. Path = the ASes the route crossed, the <b>last</b> one is the origin; <code>i</code> = originated inside that AS. Write the AS path with spaces ("64500 64511"), or "empty".`,
  vi: `Bảng thật trong lab (đã ẩn chú giải): isp (AS64500, lab/out/c25-isp) và trung tâm dữ liệu (AS64510, lab/out/c25-dc).${pre(['# isp', ...GON(ISP), '', '# dc', ...GON(DC)])}<code>*&gt;</code> = hợp lệ và tốt nhất. Next Hop <code>0.0.0.0</code> = do chính router này quảng bá. Path = các AS mà tuyến đã đi qua, AS <b>cuối</b> là AS gốc; <code>i</code> = khởi phát bên trong AS đó. Ghi AS path cách nhau bằng dấu cách ("64500 64511"), hoặc "empty".`,
  bang: [bang1('b1', ['Route by route', 'Từng tuyến'], [{ ma: 'x', ten: 'Router · prefix' }, { ma: 'h', ten: 'Next hop' }, { ma: 'p', ten: 'AS path' }, { ma: 'o', ten: 'Origin AS' }, { ma: 's', ten: 'Announced by this router itself?', luaChon: CO }], [
    { o: { x: 'isp · 198.18.0.0/24' }, a: { h: ['192.0.2.66'], p: ['64511'], o: ['64511', 'as64511'], s: 'no' } },
    { o: { x: 'isp · 198.51.100.0/24' }, a: { h: ['0.0.0.0'], p: RONG, o: ['64500', 'as64500'], s: 'yes' } },
    { o: { x: 'isp · 203.0.113.0/24' }, a: { h: ['192.0.2.3'], p: ['64510'], o: ['64510', 'as64510'], s: 'no' } },
    { o: { x: 'dc · 198.18.0.0/24' }, a: { h: ['192.0.2.66'], p: ['64500 64511'], o: ['64511', 'as64511'], s: 'no' } },
    { o: { x: 'dc · 198.51.100.0/24' }, a: { h: ['192.0.2.1'], p: ['64500'], o: ['64500', 'as64500'], s: 'no' } },
    { o: { x: 'dc · 203.0.113.0/24' }, a: { h: ['0.0.0.0'], p: RONG, o: ['64510', 'as64510'], s: 'yes' } },
  ], ['A route originated by the router itself has an empty path and next hop 0.0.0.0 — its origin is the router\'s own AS (the header says "local AS 64500"). The DC learned 198.18.0.0/24 through the ISP, so the ISP put its own number in front: path 64500 64511, origin still 64511. Its next hop is nevertheless 192.0.2.66: on a shared exchange LAN, the ISP passes on the original router\'s address so packets go there directly. Every row is *&gt;: one path per prefix, so each is the best.', 'Tuyến do chính router khởi phát có path rỗng và next hop 0.0.0.0 — AS gốc là AS của chính router (dòng đầu ghi "local AS 64500"). DC học 198.18.0.0/24 qua isp, nên isp đặt số của mình lên trước: path 64500 64511, AS gốc vẫn là 64511. Tuy vậy next hop của nó là 192.0.2.66: trên LAN dùng chung của điểm trao đổi, isp chuyển tiếp địa chỉ của router gốc để gói đi thẳng tới đó. Mọi dòng đều *&gt;: mỗi prefix một đường, nên đường nào cũng là tốt nhất.'])],
  goiY: [['Read the Path column right to left: the rightmost number owns the prefix.', 'Đọc cột Path từ phải sang trái: số ngoài cùng bên phải sở hữu prefix.'], ['Weight 32768 and next hop 0.0.0.0 are FRR\'s signs of a locally originated route.', 'Weight 32768 và next hop 0.0.0.0 là dấu hiệu của FRR cho tuyến khởi phát tại chỗ.']],
  loi: [['Taking the first number of the path as the owner.', 'Lấy số đầu tiên của path làm chủ sở hữu.'], ['Reading next hop 0.0.0.0 as "send to 0.0.0.0" or "unreachable".', 'Đọc next hop 0.0.0.0 thành "gửi tới 0.0.0.0" hay "không tới được".']],
  tns: [tn('best path (*>)', 'đường tốt nhất'), tn('next hop', 'chặng kế'), tn('AS path', 'danh sách AS đã đi qua'), tn('origin AS', 'AS gốc', 'AS cuối của path: mạng sở hữu prefix.')],
  kn: ['reading BGP tables'],
});

/* ── 3. Cướp tuyến ── */
const E3 = cs({
  ten: 'BGP 3 — Hijack by a more specific prefix, and the filter', kho: 'MEDIUM', phut: 16,
  en: `The rogue network AS64511 announced <code>203.0.113.0/25</code> — half of LabFlow's /24 — and dropped everything sent there (as Pakistan Telecom did to YouTube in 2008). Real output (lab/out/c25-isp-cuop, c25-laptop-cuop, c25-dc-thay, c25-isp-loc):${pre(['# isp', ...GON(CUOP), '$ ip route get 203.0.113.10', ...S('c25-isp-cuop', 'ip route get 203.0.113.10').slice(0, 1), '', '# laptop', ...S('c25-laptop-cuop', 'curl -sS -m 3'), ...S('c25-laptop-cuop', 'traceroute'), '', '# dc (the victim)', '$ vtysh -c \'show ip bgp 203.0.113.0/25\'', ...S('c25-dc-thay', 'vtysh'), '', '# the fix on isp', "$ vtysh -c 'configure terminal' -c 'ip prefix-list FROM-ROGUE seq 10 permit 198.18.0.0/24' -c 'router bgp 64500' -c 'address-family ipv4 unicast' -c 'neighbor 192.0.2.66 prefix-list FROM-ROGUE in' -c 'end'", "$ vtysh -c 'clear bgp ipv4 unicast 192.0.2.66 soft in'", '$ ip route get 203.0.113.10', ...S('c25-isp-loc', 'ip route get 203.0.113.10').slice(0, 1)])}`,
  vi: `Mạng xấu AS64511 quảng bá <code>203.0.113.0/25</code> — một nửa /24 của LabFlow — và vứt mọi thứ gửi tới đó (như Pakistan Telecom làm với YouTube năm 2008). Output thật (lab/out/c25-isp-cuop, c25-laptop-cuop, c25-dc-thay, c25-isp-loc):${pre(['# isp', ...GON(CUOP), '$ ip route get 203.0.113.10', ...S('c25-isp-cuop', 'ip route get 203.0.113.10').slice(0, 1), '', '# laptop', ...S('c25-laptop-cuop', 'curl -sS -m 3'), ...S('c25-laptop-cuop', 'traceroute'), '', '# dc (nạn nhân)', '$ vtysh -c \'show ip bgp 203.0.113.0/25\'', ...S('c25-dc-thay', 'vtysh'), '', '# cách sửa trên isp', "$ vtysh -c 'configure terminal' -c 'ip prefix-list FROM-ROGUE seq 10 permit 198.18.0.0/24' -c 'router bgp 64500' -c 'address-family ipv4 unicast' -c 'neighbor 192.0.2.66 prefix-list FROM-ROGUE in' -c 'end'", "$ vtysh -c 'clear bgp ipv4 unicast 192.0.2.66 soft in'", '$ ip route get 203.0.113.10', ...S('c25-isp-loc', 'ip route get 203.0.113.10').slice(0, 1)])}`,
  cau: [
    q('c1', ['The ISP has both 203.0.113.0/24 (AS64510) and 203.0.113.0/25 (AS64511), both marked best. Which one carries traffic to .10?', 'isp có cả 203.0.113.0/24 (AS64510) lẫn 203.0.113.0/25 (AS64511), cả hai đều best. Đường nào chở lưu lượng tới .10?'], ['The /25: in the kernel the longest prefix wins, whoever announced it', 'The /24: BGP always prefers the older, original route', 'Both in turn: the ISP balances the load between them', 'Neither: the conflict makes the ISP drop the packets'], ['They are different prefixes, so BGP keeps both as "best" for their own prefix. Forwarding then uses longest prefix match (lesson 2.2): ip route get says via 192.0.2.66.', 'Chúng là hai prefix khác nhau, nên BGP giữ cả hai là "best" cho prefix của riêng nó. Chuyển tiếp khi đó dùng khớp tiền tố dài nhất (bài 2.2): ip route get ghi via 192.0.2.66.']),
    q('c2', ['Which addresses of LabFlow are affected by the /25?', 'Địa chỉ nào của LabFlow bị /25 ảnh hưởng?'], ['.0 to .127 — the server .10 and the name server .53', 'Only .10, the one address the hijacker chose', '.128 to .255, the half that the /24 no longer covers', 'All 256 addresses of the /24'], ['A /25 covers half: .0–.127. That includes the web server and DNS (.53), which is why users saw timeouts and names that did not resolve. .200 would still follow the /24 (by the rule — not measured).', 'Một /25 phủ một nửa: .0–.127. Gồm cả web server và DNS (.53), vì thế người dùng thấy hết giờ chờ và tên không phân giải được. .200 vẫn đi theo /24 (theo luật — không đo).']),
    q('c3', ['How could LabFlow\'s own datacenter notice the hijack?', 'Trung tâm dữ liệu của chính LabFlow nhận ra vụ cướp thế nào?'], ['It receives its own range back as a /25 with origin AS64511', 'Its web server logs show requests from AS64511', 'Its routers lose their BGP session with the ISP', 'It cannot: a hijack is invisible to the victim'], ['show ip bgp 203.0.113.0/25 on dc shows path 64500 64511 — "your prefix is announced by someone else". Monitoring services (RIPE RIS, Cloudflare Radar, BGP alerting) raise exactly this alarm.', 'show ip bgp 203.0.113.0/25 trên dc hiện path 64500 64511 — "prefix của bạn đang bị người khác quảng bá". Các dịch vụ giám sát (RIPE RIS, Cloudflare Radar, cảnh báo BGP) báo đúng điều này.']),
    q('c4', ['What does "neighbor 192.0.2.66 prefix-list FROM-ROGUE in" with "permit 198.18.0.0/24" do?', '"neighbor 192.0.2.66 prefix-list FROM-ROGUE in" với "permit 198.18.0.0/24" làm gì?'], ['Accept from AS64511 only the prefix it owns; everything else from it is rejected', 'Block every packet coming from 192.0.2.66 at the ISP', 'Send 198.18.0.0/24 to the rogue network only', 'Ask AS64511 to stop announcing 203.0.113.0/25'], ['A prefix-list ends with an implicit deny. After "clear … soft in", the /25 disappears and ip route get goes via 192.0.2.3 again.', 'Prefix-list kết thúc bằng một lệnh cấm ngầm. Sau "clear … soft in", /25 biến mất và ip route get lại đi via 192.0.2.3.']),
    q('c5', ['24 February 2008: Pakistan Telecom (AS17557) announced 208.65.153.0/24. Why did most of the Internet follow it?', '24/2/2008: Pakistan Telecom (AS17557) quảng bá 208.65.153.0/24. Vì sao phần lớn Internet đi theo nó?'], ['It was more specific than YouTube\'s 208.65.152.0/22, and PCCW (AS3491) passed it on unfiltered', 'Pakistan Telecom had a shorter AS path to every network', 'YouTube had withdrawn its own /22 for maintenance that day', 'RPKI marked the Pakistan route as valid by mistake'], ['/24 beats /22 everywhere by longest prefix match. YouTube answered about 80 minutes later with the same /24 and then two /25s; PCCW withdrew the bad route at 21:01 UTC — about two hours in total.', '/24 thắng /22 ở mọi nơi nhờ khớp tiền tố dài nhất. Khoảng 80 phút sau YouTube đáp lại bằng chính /24 đó rồi hai /25; PCCW rút tuyến sai lúc 21:01 UTC — tổng cộng khoảng hai giờ.']),
    q('c6', ['YouTube\'s counter-move was to announce two /25s. Why does that help?', 'Đòn đáp trả của YouTube là quảng bá hai /25. Vì sao cách đó giúp được?'], ['A /25 is longer than the hijacker\'s /24, so it wins back the traffic', 'Two announcements are counted as two votes against one', 'A /25 is signed, while the hijacker\'s /24 was not', 'It forced PCCW to restart all its BGP sessions'], ['Longest prefix match cuts both ways: the most specific announcement wins, whoever makes it. That is also why real networks filter announcements longer than /24.', 'Khớp tiền tố dài nhất có hai mặt: thông báo cụ thể nhất thắng, bất kể ai gửi. Đó cũng là lý do mạng thật lọc các thông báo dài hơn /24.']),
  ],
  goiY: [['Two prefixes, two "best" routes — the kernel decides between them by length.', 'Hai prefix, hai tuyến "best" — nhân chọn giữa chúng theo độ dài.'], ['The victim\'s clue is an unexpected origin AS on its own address range.', 'Manh mối của nạn nhân là một AS gốc lạ trên dải địa chỉ của chính mình.']],
  loi: [['Looking for the problem inside LabFlow\'s servers while the routes are stolen outside.', 'Tìm lỗi trong máy chủ LabFlow trong khi tuyến bị cướp ở bên ngoài.'], ['Filtering the rogue\'s packets instead of its announcements.', 'Lọc gói tin của mạng xấu thay vì lọc thông báo tuyến của nó.']],
  tns: [tn('BGP hijack', 'cướp tuyến BGP'), tn('prefix-list', 'danh sách prefix được nhận'), tn('soft reconfiguration (soft in)', 'áp lại bộ lọc mà không cắt phiên'), tn('blackhole', 'hố đen', 'Tuyến vứt mọi gói gửi tới.')],
  kn: ['BGP hijack', 'route filtering'],
});

/* ── 4. RPKI và rút tuyến ── */
const RUT_L = S('c25-laptop-rut', 'dig +tries=1 labflow.test').filter((d) => /status|EDE|SERVER/.test(d));
const E4 = cs({
  ten: 'BGP 4 — RPKI for cuongthai.com, and the Facebook-style withdrawal', kho: 'MEDIUM', phut: 16,
  en: `Real RPKI data for cuongthai.com, from RIPEstat (lab/out/c25-that), then the lab's datacenter stops announcing its range (lab/out/c25-isp-rut, c25-laptop-rut):${pre([...THAT_IN, '', '# after "no network 203.0.113.0/24" on dc — isp:', ...GON(RUT).filter((d) => !d.startsWith('Displayed')), '$ ip route get 203.0.113.53', ...S('c25-isp-rut', 'ip route get 203.0.113.53'), '', '# laptop', '$ dig +tries=1 labflow.test   (selected lines)', ...RUT_L, ...S('c25-laptop-rut', 'curl -sS -m 3 http://labflow.test/'), ...S('c25-laptop-rut', 'traceroute')])}`,
  vi: `Dữ liệu RPKI thật của cuongthai.com, từ RIPEstat (lab/out/c25-that), rồi trung tâm dữ liệu của lab thôi quảng bá dải của mình (lab/out/c25-isp-rut, c25-laptop-rut):${pre([...THAT_IN, '', '# sau "no network 203.0.113.0/24" trên dc — isp:', ...GON(RUT).filter((d) => !d.startsWith('Displayed')), '$ ip route get 203.0.113.53', ...S('c25-isp-rut', 'ip route get 203.0.113.53'), '', '# laptop', '$ dig +tries=1 labflow.test   (các dòng chọn lọc)', ...RUT_L, ...S('c25-laptop-rut', 'curl -sS -m 3 http://labflow.test/'), ...S('c25-laptop-rut', 'traceroute')])}`,
  cau: [
    q('c1', ['The ROA says: origin AS152992, prefix 160.187.0.0/23, max length /24. AS152992 announces the /23. Status?', 'ROA ghi: AS gốc 152992, prefix 160.187.0.0/23, độ dài tối đa /24. AS152992 quảng bá /23. Trạng thái?'], ['valid', 'invalid_length', 'invalid_asn', 'not_found'], ['A ROA covers the route, the origin matches, and /23 ≤ /24. RIPEstat answered valid.', 'Một ROA phủ tuyến, AS gốc khớp, và /23 ≤ /24. RIPEstat trả lời valid.']),
    q('c2', ['The same /23 announced by AS64511 is "invalid_asn". What would a validating router do with it?', 'Cùng /23 đó do AS64511 quảng bá là "invalid_asn". Một router có kiểm RPKI làm gì với nó?'], ['Drop it: a ROA exists for the prefix and the origin does not match', 'Accept it, because AS64511 is a documentation number', 'Prefer it, because it is more recent than the valid one', 'Forward it to RIPE for a manual decision'], ['Route origin validation (RFC 6811) rejects announcements that contradict a ROA. The 2008 hijack would be caught this way today — on networks that validate.', 'Kiểm nguồn gốc tuyến (RFC 6811) từ chối các thông báo mâu thuẫn với ROA. Vụ cướp năm 2008 hôm nay sẽ bị bắt theo cách này — ở các mạng có kiểm.']),
    q('c3', ['Why is 160.187.1.0/25 announced by the rightful AS152992 "invalid_length"?', 'Vì sao 160.187.1.0/25 do chính AS152992 quảng bá lại là "invalid_length"?'], ['The ROA allows prefixes only up to /24; a /25 is longer than allowed', 'A /25 is not inside 160.187.0.0/23', 'AS152992 has no ROA for the 160.187.1.0 half', 'RPKI does not support prefixes longer than /24 at all'], ['max length protects against more-specific hijacks: even a forged origin could not make a /25 valid. Set max length as tight as you really announce.', 'max length chống cướp bằng dải cụ thể hơn: kể cả giả AS gốc cũng không làm /25 thành valid. Đặt max length sát với thứ bạn thật sự quảng bá.']),
    q('c4', ['27 June 2024: 1.1.1.1/32 was hijacked by AS267613 and, separately, leaked as a /24 by AS262504. What did RPKI catch?', '27/6/2024: 1.1.1.1/32 bị AS267613 cướp và, riêng rẽ, bị AS262504 làm rò thành /24. RPKI bắt được gì?'], ['The /32 (marked invalid), but not the leak, which kept Cloudflare\'s correct origin', 'Both, because both were announced by wrong networks', 'Neither, because 1.1.1.1 has no ROA', 'Only the leak, because /32 routes are never validated'], ['Origin validation only checks the last AS of the path. A leak with the right origin passes; protecting the path needs newer work such as ASPA.', 'Kiểm nguồn gốc chỉ xét AS cuối của path. Một vụ rò giữ đúng AS gốc thì lọt; bảo vệ cả đường đi cần cơ chế mới hơn như ASPA.']),
    q('c5', ['After the withdrawal, dig answers REFUSED (EDE 23 "Network Error") at once and curl says "Could not resolve host". Why a name error, not a timeout?', 'Sau khi rút tuyến, dig trả lời REFUSED (EDE 23 "Network Error") ngay và curl báo "Could not resolve host". Vì sao lỗi tên, không phải hết giờ?'], ['The ISP\'s resolver has no route to LabFlow\'s name server .53 either', 'LabFlow deleted its DNS records during the withdrawal', 'The laptop\'s DNS cache expired at the same moment', 'curl cannot resolve names that end in .test'], ['The name server lives in the withdrawn range: ip route get 203.0.113.53 on isp says "Network is unreachable". Big public resolvers would say SERVFAIL — same meaning for your app.', 'Máy chủ tên nằm trong dải bị rút: ip route get 203.0.113.53 trên isp báo "Network is unreachable". Các resolver công cộng lớn sẽ nói SERVFAIL — cùng nghĩa với ứng dụng của bạn.']),
    q('c6', ['4 October 2021: Facebook\'s DNS servers withdrew their own prefixes. Which sequence is right?', '4/10/2021: máy chủ DNS của Facebook tự rút prefix của mình. Trình tự nào đúng?'], ['A maintenance command cut the backbone, the DNS servers withdrew their routes, resolvers failed ~5.5 h', 'A hacker hijacked the DNS prefixes with more specific /25 routes, so resolvers failed for ~5 h', 'The facebook.com records expired, nobody renewed the domain, so names failed for ~5 h', 'A cable cut in the Atlantic isolated the datacenters, so every server was offline for ~5 h'], ['Around 15:40 UTC Cloudflare saw a burst of routing changes; by 15:58 the DNS prefixes were gone; names resolved again around 21:20. The DNS servers were running — they were unreachable.', 'Khoảng 15:40 UTC Cloudflare thấy một loạt thay đổi định tuyến; tới 15:58 các prefix DNS biến mất; khoảng 21:20 tên mới phân giải lại được. Máy chủ DNS vẫn chạy — chỉ là không tới được.']),
  ],
  goiY: [['RFC 6811: no covering ROA ⇒ not_found; a covering ROA with the same AS and an allowed length ⇒ valid; otherwise invalid.', 'RFC 6811: không ROA nào phủ ⇒ not_found; có ROA phủ cùng AS và độ dài cho phép ⇒ valid; còn lại invalid.'], ['"DNS is down" for a whole service: check whether the name server\'s prefix is still announced.', '"DNS sập" cho cả một dịch vụ: kiểm xem prefix của máy chủ tên còn được quảng bá không.']],
  loi: [['Believing RPKI stops every BGP incident (route leaks keep the right origin).', 'Tin RPKI chặn được mọi sự cố BGP (rò tuyến giữ đúng AS gốc).'], ['Restarting the DNS servers when their routes are what disappeared.', 'Khởi động lại máy chủ DNS trong khi thứ biến mất là tuyến tới chúng.']],
  tns: [tn('RPKI', 'hạ tầng khoá công khai cho tài nguyên Internet'), tn('ROA', 'bản ghi cho phép AS khởi phát prefix'), tn('max length', 'độ dài prefix tối đa được phép'), tn('route withdrawal', 'rút tuyến'), tn('SERVFAIL / REFUSED', 'mã lỗi DNS')],
  kn: ['RPKI', 'route withdrawal'],
});

/* ── 5. Tự viết: parseBgpTable ── */
function parseBgpTable(text) {
  var lines = String(text).split('\n');
  var localAs = null, pathCol = -1, routes = [], last = null, lastNet = null;
  function fill(r, line) {
    if (line.length <= pathCol) return false;
    var w = line.slice(pathCol).trim().split(/\s+/);           // "64500 64511 i"
    r.origin = w[w.length - 1];
    r.path = w.slice(0, -1).map(Number);
    r.originAs = r.path.length ? r.path[r.path.length - 1] : localAs;
    return true;
  }
  lines.forEach(function (line) {
    var m = /local AS (\d+)/.exec(line);
    if (m) localAs = Number(m[1]);
    if (/^\s*Network\s+Next Hop/.test(line)) { pathCol = line.indexOf('Path'); return; }
    if (pathCol < 0 || !line.trim()) return;
    var st = /^ ?([sdhuirSR*=>]+)\s+(.*)$/.exec(line);
    if (st && line.indexOf('*') >= 0 && line.indexOf('*') < 4) {
      var w = line.slice(0, pathCol).trim().split(/\s+/);    // [status, network?, next hop, …]
      var hasNet = w[1] && w[1].indexOf('/') >= 0;
      var r = { status: w[0], best: w[0].indexOf('>') >= 0, network: hasNet ? w[1] : lastNet, nextHop: hasNet ? w[2] : w[1], path: [], originAs: null, origin: null };
      lastNet = r.network;
      routes.push(r);
      last = fill(r, line) ? null : r;                         // a long next hop pushes the rest onto the next line
      return;
    }
    if (last && /^\s/.test(line)) { fill(last, line); last = null; }
  });
  return routes;
}
// DỰNG (ghi rõ trong đề): hai đường cho cùng 203.0.113.0/24 — dòng thứ hai FRR không in lại Network. Cột giống hệt bảng thật.
function hang(st, net, nh, metric, weight, path) {
  let s = ` ${st}`.padEnd(5) + net.padEnd(17) + nh;
  s = s.padEnd(48 - metric.length) + metric;
  s = s.padEnd(62 - weight.length) + weight;
  return `${s} ${path}`;
}
const HDR = ISP.filter((d) => /BGP table version|Default local pref|Network\s+Next Hop/.test(d));
if (hang('*>', '198.18.0.0/24', '192.0.2.66', '0', '0', '64511 i') !== ISP.find((d) => d.includes('198.18.0.0/24'))) throw new Error('hang(): cột lệch bảng thật');
const MULTI = [...HDR, hang('*', '203.0.113.0/24', '192.0.2.66', '', '0', '64511 i'), hang('*>', '', '192.0.2.3', '0', '0', '64510 i'), hang('*>', '198.18.0.0/24', '192.0.2.66', '0', '0', '64511 i'), '', 'Displayed 2 routes and 3 total paths'].join('\n');
const J = (ds) => ds.join('\n');
const E5 = jsBai({
  ten: 'BGP 5 — Write parseBgpTable(text) for FRR\'s show ip bgp', kho: 'HARD', phut: 35,
  en: `<p>Write <code>parseBgpTable(text)</code>. <code>text</code> is the full output of FRR's <code>show ip bgp</code> (or <code>show bgp ipv6 unicast</code>), legend included. Real example (lab/out/c25-isp):</p>${pre(ISP)}<p>Return one object per route line, in order: <code>{ status, best, network, nextHop, path, originAs, origin }</code>.</p>
<ul>
<li>Route lines start after the header line <code>Network  Next Hop … Path</code>; a route line has <code>*</code> in its first four characters. <code>status</code> = the first word (<code>"*&gt;"</code>, <code>"*u"</code>…); <code>best</code> = it contains <code>&gt;</code>.</li>
<li>The Path column starts <b>exactly under the word "Path"</b> of the header: everything from that position is the AS numbers and, last, the origin code (<code>i</code>, <code>e</code> or <code>?</code>). Do not guess from the numbers in the middle: Metric and Weight may be blank, and ASNs are numbers too.</li>
<li><code>path</code> = array of numbers (may be empty); <code>originAs</code> = its last number, or — when it is empty — the router's own AS from the line <code>"… local AS 64500"</code> (<code>null</code> if the text has no such line).</li>
<li>A long next hop (IPv6) pushes the rest of the line onto the next line, which starts with spaces. A second path for the same prefix has no Network: use the previous one.</li>
<li>Ignore everything else (legend, <code>Displayed …</code>, <code>Total number …</code>, blank lines).</li>
</ul><p>Hidden cases: the DC table, the rogue router (<code>*u</code>), the hijack and the withdrawal on the ISP, the real IPv6 table with its wrapped line, Lab 2's <code>grep</code>-filtered table (no "local AS" line), and a <b>constructed</b> table with two paths for one prefix.</p>`,
  vi: `<p>Viết <code>parseBgpTable(text)</code>. <code>text</code> là toàn bộ output <code>show ip bgp</code> của FRR (hoặc <code>show bgp ipv6 unicast</code>), có cả chú giải. Ví dụ thật (lab/out/c25-isp):</p>${pre(ISP)}<p>Trả về một object cho mỗi dòng tuyến, theo thứ tự: <code>{ status, best, network, nextHop, path, originAs, origin }</code>.</p>
<ul>
<li>Dòng tuyến bắt đầu sau dòng tiêu đề <code>Network  Next Hop … Path</code>; dòng tuyến có <code>*</code> trong bốn ký tự đầu. <code>status</code> = chữ đầu (<code>"*&gt;"</code>, <code>"*u"</code>…); <code>best</code> = nó chứa <code>&gt;</code>.</li>
<li>Cột Path bắt đầu <b>đúng dưới chữ "Path"</b> của dòng tiêu đề: mọi thứ từ vị trí đó là các số AS và, cuối cùng, mã nguồn gốc (<code>i</code>, <code>e</code> hoặc <code>?</code>). Đừng đoán từ các số ở giữa: Metric và Weight có thể trống, mà ASN cũng là số.</li>
<li><code>path</code> = mảng số (có thể rỗng); <code>originAs</code> = số cuối của nó, hoặc — khi rỗng — AS của chính router lấy từ dòng <code>"… local AS 64500"</code> (<code>null</code> nếu văn bản không có dòng đó).</li>
<li>Next hop dài (IPv6) đẩy phần còn lại của dòng xuống dòng sau, dòng đó bắt đầu bằng dấu cách. Đường thứ hai cho cùng một prefix không có Network: dùng prefix của dòng trước.</li>
<li>Bỏ qua mọi thứ khác (chú giải, <code>Displayed …</code>, <code>Total number …</code>, dòng trống).</li>
</ul><p>Ca ẩn: bảng của dc, router xấu (<code>*u</code>), lúc bị cướp và lúc rút tuyến trên isp, bảng IPv6 thật với dòng bị ngắt, bảng của Lab 2 đã lọc bằng <code>grep</code> (không có dòng "local AS"), và một bảng <b>dựng</b> có hai đường cho một prefix.</p>`,
  dauVao: ['text — FRR show ip bgp output.', 'text — output show ip bgp của FRR.'],
  dauRa: ['[{ status, best, network, nextHop, path: [numbers], originAs, origin }]', '[{ status, best, network, nextHop, path: [số], originAs, origin }]'],
  goiY: [
    ['Find the header first and remember pathCol = header.indexOf("Path"). Remember "local AS N" from any line.', 'Tìm dòng tiêu đề trước và nhớ pathCol = header.indexOf("Path"). Nhớ "local AS N" từ bất kỳ dòng nào.'],
    ['For a route line, line.slice(0, pathCol) split into words gives status, network (contains "/") and next hop; line.slice(pathCol) gives the path and the origin code.', 'Với dòng tuyến, line.slice(0, pathCol) tách từ cho status, network (chứa "/") và next hop; line.slice(pathCol) cho path và mã nguồn gốc.'],
    ['If a route line is shorter than pathCol, keep it "open" and take the path from the next line that starts with spaces.', 'Nếu dòng tuyến ngắn hơn pathCol, giữ nó "mở" và lấy path từ dòng kế tiếp bắt đầu bằng dấu cách.'],
  ],
  loi: [
    ['Splitting the whole line on spaces and taking "the numbers after the next hop" as the path: "0 64500 64511" on the DC table is weight 0 + path, while "0 0 64511" on the ISP is metric, weight, path.', 'Tách cả dòng theo dấu cách rồi lấy "các số sau next hop" làm path: "0 64500 64511" ở bảng dc là weight 0 + path, còn "0 0 64511" ở isp là metric, weight, path.'],
    ['Taking the first AS of the path as the origin.', 'Lấy AS đầu tiên của path làm AS gốc.'],
    ['Losing the IPv6 route whose path is on the next line, or the second path that has no Network.', 'Đánh mất tuyến IPv6 có path ở dòng sau, hoặc đường thứ hai không có Network.'],
  ],
  gt: ['Router tables are fixed-width text meant for humans, so the reliable anchor is the header, not the values: the Path column always starts under "Path", which turns the ambiguous run of numbers (metric, weight, ASNs) into an unambiguous split. The origin AS is the last element of the path — the network that owns the prefix — except for routes the router originates itself, whose path is empty and whose owner is the local AS printed above the table. Handling the two FRR line shapes that real output contains (a wrapped line after a long IPv6 next hop, and continuation paths without a Network) is what lets the same parser read every table in this lesson.', 'Bảng của router là chữ độ rộng cố định viết cho người đọc, nên mốc đáng tin là dòng tiêu đề chứ không phải giá trị: cột Path luôn bắt đầu dưới chữ "Path", biến dãy số mơ hồ (metric, weight, ASN) thành một phép tách rõ ràng. AS gốc là phần tử cuối của path — mạng sở hữu prefix — trừ các tuyến router tự khởi phát, có path rỗng và chủ sở hữu là local AS in phía trên bảng. Xử lý hai dạng dòng của FRR có trong output thật (dòng bị ngắt sau next hop IPv6 dài, và đường tiếp theo không có Network) là thứ giúp cùng một bộ đọc đọc được mọi bảng trong bài.'],
  kn: ['parsing fixed-width output', 'BGP tables'],
  tns: [tn('fixed-width column', 'cột độ rộng cố định'), tn('origin code (i / e / ?)', 'mã nguồn gốc', 'i = IGP: khởi phát bên trong AS.'), tn('local AS', 'AS của chính router')],
  dau: `/** FRR "show ip bgp" text ⇒ [{ status, best, network, nextHop, path, originAs, origin }] */
function parseBgpTable(text) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution\n' + nguon(parseBgpTable),
  cases: [
    { goi: goi('parseBgpTable', J(ISP)), moTa: ['The ISP table (real, c25-isp)', 'Bảng của isp (thật, c25-isp)'] },
    { goi: goi('parseBgpTable', J(DC)), moTa: ['The DC table (real, c25-dc): blank metrics', 'Bảng của dc (thật, c25-dc): metric trống'] },
    { goi: goi('parseBgpTable', J(ROGUE)), an: true },
    { goi: goi('parseBgpTable', J(CUOP)), an: true },
    { goi: goi('parseBgpTable', J(RUT)), an: true },
    { goi: goi('parseBgpTable', J(V6)), an: true, moTa: ['Hidden: the real IPv6 table with a wrapped line', 'Ẩn: bảng IPv6 thật có dòng bị ngắt'] },
    { goi: goi('parseBgpTable', J(LAB2)), an: true, moTa: ['Hidden: Lab 2 table filtered by grep (no local AS)', 'Ẩn: bảng Lab 2 đã lọc bằng grep (không có local AS)'] },
    { goi: goi('parseBgpTable', MULTI), an: true, moTa: ['Hidden: two paths for one prefix (constructed)', 'Ẩn: hai đường cho một prefix (dựng)'] },
  ],
});

/* ── 6. Tự viết: rpkiValidate ── */
function rpkiValidate(prefix, originAs, roas) {
  function parse(p) {
    var a = p.split('/');
    return { n: a[0].split('.').reduce(function (x, b) { return x * 256 + Number(b); }, 0), len: Number(a[1]) };
  }
  var r = parse(prefix);
  // RFC 6811: a ROA "covers" the route when the route is the ROA prefix or a more specific part of it
  var covering = roas.filter(function (roa) {
    var p = parse(roa.prefix);
    var size = Math.pow(2, 32 - p.len);
    return r.len >= p.len && Math.floor(r.n / size) === Math.floor(p.n / size);
  });
  if (!covering.length) return 'not_found';
  function maxLen(roa) { return roa.maxLength == null ? parse(roa.prefix).len : roa.maxLength; }
  // AS 0 in a ROA means "nobody may originate this": it never matches
  if (covering.some(function (roa) { return roa.asn !== 0 && roa.asn === originAs && r.len <= maxLen(roa); })) return 'valid';
  if (covering.some(function (roa) { return roa.asn !== 0 && roa.asn === originAs; })) return 'invalid_length';
  return 'invalid_asn';
}
const ROA_CT = [{ prefix: '160.187.0.0/23', asn: 152992, maxLength: 24 }];
const ROA_LAB = [{ prefix: '203.0.113.0/24', asn: 64510, maxLength: 24 }];
const ROA_CF = [{ prefix: '1.1.1.0/24', asn: 13335, maxLength: 24 }];
const E6 = jsBai({
  ten: 'BGP 6 — Write rpkiValidate(prefix, originAs, roas) per RFC 6811', kho: 'HARD', phut: 30,
  en: `<p>Real answers from RIPE's validator for cuongthai.com (lab/out/c25-that):</p>${pre(THAT_IN.slice(4))}<p>Write <code>rpkiValidate(prefix, originAs, roas)</code> for IPv4. <code>roas</code> is <code>[{ prefix, asn, maxLength }]</code> (<code>maxLength</code> missing ⇒ the ROA prefix length). Return:</p>
<ol>
<li><code>"not_found"</code> — no ROA <b>covers</b> the route (the route is the ROA prefix or a more specific part of it);</li>
<li><code>"valid"</code> — some covering ROA has <code>asn === originAs</code> and route length ≤ its maxLength;</li>
<li><code>"invalid_length"</code> — not valid, but some covering ROA has the right ASN (the route is too specific);</li>
<li><code>"invalid_asn"</code> — otherwise (no covering ROA allows this origin).</li>
</ol>
<p>A ROA with <code>asn: 0</code> means "no AS may originate this prefix" and never matches. Visible cases: the three real RIPEstat answers. Hidden cases use the real cuongthai.com ROA, a ROA for the lab (<b>constructed</b>: LabFlow would publish 203.0.113.0/24, AS64510, max /24), a ROA modelled on the 1.1.1.1 story of the lesson (<b>constructed</b>), several ROAs, AS 0, a less specific route, and a missing maxLength.</p>`,
  vi: `<p>Câu trả lời thật từ bộ kiểm của RIPE cho cuongthai.com (lab/out/c25-that):</p>${pre(THAT_IN.slice(4))}<p>Viết <code>rpkiValidate(prefix, originAs, roas)</code> cho IPv4. <code>roas</code> là <code>[{ prefix, asn, maxLength }]</code> (thiếu <code>maxLength</code> ⇒ bằng độ dài prefix của ROA). Trả:</p>
<ol>
<li><code>"not_found"</code> — không ROA nào <b>phủ</b> tuyến (tuyến là chính prefix của ROA hoặc một phần cụ thể hơn của nó);</li>
<li><code>"valid"</code> — có ROA phủ với <code>asn === originAs</code> và độ dài tuyến ≤ maxLength của nó;</li>
<li><code>"invalid_length"</code> — không valid, nhưng có ROA phủ đúng ASN (tuyến quá cụ thể);</li>
<li><code>"invalid_asn"</code> — còn lại (không ROA phủ nào cho phép AS gốc này).</li>
</ol>
<p>ROA có <code>asn: 0</code> nghĩa là "không AS nào được khởi phát prefix này" và không bao giờ khớp. Ca hiện: ba câu trả lời thật của RIPEstat. Ca ẩn dùng ROA thật của cuongthai.com, một ROA cho lab (<b>dựng</b>: LabFlow sẽ công bố 203.0.113.0/24, AS64510, tối đa /24), một ROA mô phỏng câu chuyện 1.1.1.1 trong bài (<b>dựng</b>), nhiều ROA, AS 0, một tuyến kém cụ thể hơn, và thiếu maxLength.</p>`,
  dauVao: ['prefix — "a.b.c.d/len"; originAs — a number; roas — [{ prefix, asn, maxLength? }].', 'prefix — "a.b.c.d/len"; originAs — số; roas — [{ prefix, asn, maxLength? }].'],
  dauRa: ['"valid" | "invalid_asn" | "invalid_length" | "not_found"', '"valid" | "invalid_asn" | "invalid_length" | "not_found"'],
  goiY: [
    ['Covers = route length ≥ ROA length and the first ROA-length bits are equal (the same test as lookup in lesson 2.2).', 'Phủ = độ dài tuyến ≥ độ dài ROA và các bit đầu (bằng độ dài ROA) bằng nhau (cùng phép thử với lookup ở bài 2.2).'],
    ['Collect the covering ROAs first; then the order of the checks gives the four answers.', 'Gom các ROA phủ trước; rồi thứ tự các phép kiểm cho ra bốn câu trả lời.'],
  ],
  loi: [
    ['Calling a route "not_found" because no ROA has exactly the same prefix — a /25 inside a ROA\'s /23 is covered.', 'Gọi tuyến là "not_found" vì không ROA nào có đúng cùng prefix — một /25 nằm trong /23 của ROA là được phủ.'],
    ['Treating a route less specific than the ROA (a /22 around a /23 ROA) as covered.', 'Coi tuyến kém cụ thể hơn ROA (một /22 bao một ROA /23) là được phủ.'],
    ['Returning "invalid_asn" for the rightful owner\'s /25 — the right ASN with a wrong length is invalid_length.', 'Trả "invalid_asn" cho /25 của chính chủ — đúng ASN mà sai độ dài là invalid_length.'],
  ],
  gt: ['Origin validation answers one narrow question: may this AS originate this prefix at this length? A ROA only speaks about the space it covers, so routes outside every ROA are not_found (most of the Internet\'s routes were in that state for years), while a route inside a ROA must match both its ASN and its maxLength. That is why the 2008-style more specific hijack fails twice — wrong origin and too long — and why the 1.1.1.1 leak of 2024 passed: its origin was correct, and RPKI does not look at the rest of the path.', 'Kiểm nguồn gốc trả lời đúng một câu hỏi hẹp: AS này có được khởi phát prefix này với độ dài này không? ROA chỉ nói về vùng địa chỉ nó phủ, nên tuyến nằm ngoài mọi ROA là not_found (nhiều năm phần lớn tuyến trên Internet ở trạng thái đó), còn tuyến nằm trong một ROA phải khớp cả ASN lẫn maxLength. Vì thế vụ cướp kiểu 2008 bằng dải cụ thể hơn trượt hai lần — sai AS gốc và quá dài — và vì thế vụ rò 1.1.1.1 năm 2024 lọt: AS gốc của nó đúng, mà RPKI không nhìn phần còn lại của path.'],
  kn: ['RPKI', 'route origin validation'],
  tns: [tn('covering ROA', 'ROA phủ tuyến'), tn('maxLength', 'độ dài tối đa'), tn('AS 0 ROA', 'ROA cấm mọi AS')],
  dau: `/** RFC 6811 origin validation (IPv4) ⇒ 'valid' | 'invalid_asn' | 'invalid_length' | 'not_found' */
function rpkiValidate(prefix, originAs, roas) {
  // Write your solution here
  return 'valid';
}
`,
  giai: '// Reference solution\n' + nguon(rpkiValidate),
  cases: [
    { goi: goi('rpkiValidate', '160.187.0.0/23', 152992, ROA_CT), moTa: ['AS152992 announcing 160.187.0.0/23 (real: valid)', 'AS152992 quảng bá 160.187.0.0/23 (thật: valid)'] },
    { goi: goi('rpkiValidate', '160.187.0.0/23', 64511, ROA_CT), moTa: ['AS64511 announcing 160.187.0.0/23 (real: invalid_asn)', 'AS64511 quảng bá 160.187.0.0/23 (thật: invalid_asn)'] },
    { goi: goi('rpkiValidate', '160.187.1.0/25', 152992, ROA_CT), moTa: ['AS152992 announcing 160.187.1.0/25 (real: invalid_length)', 'AS152992 quảng bá 160.187.1.0/25 (thật: invalid_length)'] },
    { goi: goi('rpkiValidate', '160.187.1.0/24', 152992, ROA_CT), an: true },
    { goi: goi('rpkiValidate', '160.187.0.0/22', 152992, ROA_CT), an: true },
    { goi: goi('rpkiValidate', '203.0.113.0/25', 64511, ROA_LAB), an: true },
    { goi: goi('rpkiValidate', '203.0.113.0/24', 64510, ROA_LAB), an: true },
    { goi: goi('rpkiValidate', '203.0.113.0/25', 64510, ROA_LAB), an: true },
    { goi: goi('rpkiValidate', '198.18.0.0/24', 64511, ROA_LAB), an: true },
    { goi: goi('rpkiValidate', '1.1.1.1/32', 267613, ROA_CF), an: true },
    { goi: goi('rpkiValidate', '1.1.1.0/24', 13335, ROA_CF), an: true },
    { goi: goi('rpkiValidate', '203.0.113.128/25', 64511, [...ROA_LAB, { prefix: '203.0.113.128/25', asn: 64511, maxLength: 25 }]), an: true },
    { goi: goi('rpkiValidate', '192.0.2.0/24', 64500, [{ prefix: '192.0.2.0/24', asn: 0, maxLength: 24 }]), an: true },
    { goi: goi('rpkiValidate', '198.51.100.0/25', 64500, [{ prefix: '198.51.100.0/24', asn: 64500 }]), an: true },
  ],
});

/* ── 7. Tự viết: detectHijacks ── */
function detectHijacks(mine, routes) {
  function parse(p) {
    var a = p.split('/');
    return { n: a[0].split('.').reduce(function (x, b) { return x * 256 + Number(b); }, 0), len: Number(a[1]) };
  }
  function inside(inner, outer) {               // inner is outer or a more specific part of it
    var i = parse(inner), o = parse(outer), size = Math.pow(2, 32 - o.len);
    return i.len >= o.len && Math.floor(i.n / size) === Math.floor(o.n / size);
  }
  var v4 = routes.filter(function (r) { return r.network && r.network.indexOf(':') < 0; });
  var my = mine.filter(function (m) { return m.prefix.indexOf(':') < 0; });   // IPv4 only in this exercise
  var alerts = [];
  v4.forEach(function (r) {
    my.forEach(function (m) {
      if (!inside(r.network, m.prefix) || r.originAs === m.asn) return;
      alerts.push({ network: r.network, originAs: r.originAs, victim: m.prefix, kind: r.network === m.prefix ? 'same-prefix' : 'more-specific' });
    });
  });
  var missing = my.filter(function (m) {
    return !v4.some(function (r) { return r.network === m.prefix && r.originAs === m.asn; });
  }).map(function (m) { return m.prefix; });
  return { alerts: alerts, missing: missing };
}
const RT = (txt) => parseBgpTable(txt).map((r) => ({ network: r.network, originAs: r.originAs }));
const MINE = [{ prefix: '203.0.113.0/24', asn: 64510 }];
const MINE2 = [{ prefix: '203.0.113.0/24', asn: 64510 }, { prefix: '2001:db8:d::/48', asn: 64510 }, { prefix: '198.18.0.0/24', asn: 64511 }];
// Bảng dc trong lúc bị cướp: các tuyến thật của c25-dc + tuyến /25 thật của c25-dc-thay (path 64500 64511).
const DC_CUOP = [...RT(J(DC)), { network: '203.0.113.0/25', originAs: 64511 }];
const E7 = jsBai({
  ten: 'BGP 7 — Write detectHijacks(mine, routes): a BGP alarm', kho: 'HARD', phut: 25,
  en: `<p>Monitoring services watch BGP tables and alert owners. Build the core of one. <code>mine</code> is <code>[{ prefix, asn }]</code> — your IPv4 ranges and the AS that should originate them; <code>routes</code> is <code>[{ network, originAs }]</code> as your <code>parseBgpTable</code> returns (other fields may be present and are ignored). Return <code>{ alerts, missing }</code>:</p>
<ul>
<li><code>alerts</code> — for every route (in order) that is one of your prefixes or <b>inside</b> it, with <code>originAs</code> different from yours: <code>{ network, originAs, victim, kind }</code>, <code>kind</code> = <code>"same-prefix"</code> or <code>"more-specific"</code>. A route that only <b>contains</b> your prefix (less specific) is not an alert — longest prefix match still sends your traffic to you.</li>
<li><code>missing</code> — your prefixes that no route announces with your AS (withdrawn, or replaced), in the order of <code>mine</code>.</li>
<li>Skip IPv6 routes and IPv6 entries of <code>mine</code> (they contain ":").</li>
</ul><p>Visible cases are built by parsing the real ISP tables: normal (c25-isp), during the hijack (c25-isp-cuop) and after the withdrawal (c25-isp-rut). Hidden: Lab 2 incident B, the DC's own view during the hijack, a constructed same-prefix announcement and a constructed less specific one, several prefixes of your own.</p>`,
  vi: `<p>Các dịch vụ giám sát theo dõi bảng BGP và báo cho chủ sở hữu. Hãy dựng phần lõi của một dịch vụ như vậy. <code>mine</code> là <code>[{ prefix, asn }]</code> — các dải IPv4 của bạn và AS phải khởi phát chúng; <code>routes</code> là <code>[{ network, originAs }]</code> như <code>parseBgpTable</code> của bạn trả về (có thể có trường khác, bỏ qua). Trả <code>{ alerts, missing }</code>:</p>
<ul>
<li><code>alerts</code> — với mỗi tuyến (theo thứ tự) là một prefix của bạn hoặc nằm <b>bên trong</b> nó, mà <code>originAs</code> khác của bạn: <code>{ network, originAs, victim, kind }</code>, <code>kind</code> = <code>"same-prefix"</code> hoặc <code>"more-specific"</code>. Tuyến chỉ <b>bao</b> prefix của bạn (kém cụ thể hơn) thì không báo — khớp tiền tố dài nhất vẫn đưa lưu lượng về bạn.</li>
<li><code>missing</code> — các prefix của bạn không có tuyến nào quảng bá với AS của bạn (đã rút, hoặc bị thay), theo thứ tự của <code>mine</code>.</li>
<li>Bỏ qua tuyến IPv6 và mục IPv6 trong <code>mine</code> (chúng có ":").</li>
</ul><p>Ca hiện dựng bằng cách đọc các bảng isp thật: bình thường (c25-isp), lúc bị cướp (c25-isp-cuop) và sau khi rút tuyến (c25-isp-rut). Ca ẩn: sự cố B của Lab 2, góc nhìn của chính dc lúc bị cướp, một thông báo cùng prefix dựng và một thông báo kém cụ thể hơn dựng, nhiều prefix của bạn.</p>`,
  dauVao: ['mine — [{ prefix, asn }]; routes — [{ network, originAs }].', 'mine — [{ prefix, asn }]; routes — [{ network, originAs }].'],
  dauRa: ['{ alerts: [{ network, originAs, victim, kind }], missing: [prefix] }', '{ alerts: [{ network, originAs, victim, kind }], missing: [prefix] }'],
  goiY: [
    ['"Inside" is the covering test of exercise 6, with your prefix as the outer one.', '"Bên trong" là phép thử phủ của bài 6, với prefix của bạn là cái bao ngoài.'],
    ['missing is a separate pass: for each of your prefixes, look for an exact network with your AS.', 'missing là một vòng riêng: với mỗi prefix của bạn, tìm đúng network đó với AS của bạn.'],
  ],
  loi: [
    ['Alerting on 203.0.0.0/16 announced by someone else: it is less specific, your /24 still wins.', 'Báo động cho 203.0.0.0/16 do người khác quảng bá: nó kém cụ thể hơn, /24 của bạn vẫn thắng.'],
    ['Reporting nothing after a withdrawal, because no foreign route appeared — the silence is the alarm.', 'Không báo gì sau khi rút tuyến, vì không có tuyến lạ nào xuất hiện — chính sự im lặng là báo động.'],
  ],
  gt: ['What hurts you in BGP is any announcement that can win your traffic: the same prefix from another origin (a tie that some networks will break the wrong way) or a more specific one (which wins everywhere by longest prefix match). Less specific announcements cannot steal traffic while your own route exists, so alerting on them is noise. The second failure mode is silence: after a withdrawal there is nothing foreign to see, only your own route missing — exactly the Facebook 2021 picture — so a monitor must check presence as well as origin.', 'Thứ làm hại bạn trong BGP là mọi thông báo có thể giành được lưu lượng của bạn: cùng prefix từ AS gốc khác (thế hoà mà vài mạng sẽ phân xử sai) hoặc prefix cụ thể hơn (thắng ở mọi nơi nhờ khớp tiền tố dài nhất). Thông báo kém cụ thể hơn không cướp được lưu lượng khi tuyến của bạn còn đó, nên báo động cho chúng là nhiễu. Kiểu hỏng thứ hai là im lặng: sau khi rút tuyến không có gì lạ để thấy, chỉ có tuyến của bạn biến mất — đúng bức tranh Facebook 2021 — nên bộ giám sát phải kiểm cả sự có mặt lẫn AS gốc.'],
  kn: ['BGP monitoring', 'hijack detection'],
  tns: [tn('monitoring', 'giám sát'), tn('less specific', 'kém cụ thể hơn', 'Prefix ngắn hơn, bao prefix kia.'), tn('alert', 'cảnh báo')],
  dau: `/** mine: [{ prefix, asn }]   routes: [{ network, originAs }]  ⇒ { alerts: [...], missing: [...] } */
function detectHijacks(mine, routes) {
  // Write your solution here
  return { alerts: [], missing: [] };
}
`,
  giai: '// Reference solution\n' + nguon(detectHijacks),
  cases: [
    { goi: goi('detectHijacks', MINE, RT(J(ISP))), moTa: ['The ISP table, normal (real c25-isp, parsed)', 'Bảng isp, bình thường (c25-isp thật, đã đọc)'] },
    { goi: goi('detectHijacks', MINE, RT(J(CUOP))), moTa: ['The ISP table during the hijack (real c25-isp-cuop)', 'Bảng isp lúc bị cướp (c25-isp-cuop thật)'] },
    { goi: goi('detectHijacks', MINE, RT(J(RUT))), moTa: ['The ISP table after the withdrawal (real c25-isp-rut)', 'Bảng isp sau khi rút tuyến (c25-isp-rut thật)'] },
    { goi: goi('detectHijacks', MINE, RT(J(LAB2B))), an: true },
    { goi: goi('detectHijacks', MINE, DC_CUOP), an: true },
    { goi: goi('detectHijacks', MINE, RT(MULTI)), an: true, moTa: ['Hidden: same prefix from AS64511 (constructed table)', 'Ẩn: cùng prefix từ AS64511 (bảng dựng)'] },
    { goi: goi('detectHijacks', MINE, [...RT(J(ISP)), { network: '203.0.0.0/16', originAs: 64511 }]), an: true },
    { goi: goi('detectHijacks', MINE2, [...RT(J(CUOP)), ...RT(J(V6))]), an: true },
    { goi: goi('detectHijacks', MINE2, RT(J(RUT))), an: true },
  ],
});

export default doiDau({ slug: 'netdev-2-5-bgp-internet', ten: '2.5 How the Internet is stitched together: AS and BGP', khoa: KHOA, baiHoc: 'netdev-2-5-bgp-internet', de: [E1, E2, E3, E4, E5, E6, E7] });
