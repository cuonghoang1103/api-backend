/** Networking for Developers · 2.2 — Bảng định tuyến và traceroute: đọc ip route thật của 4 router, tuyến dài nhất thắng, TTL + Time exceeded, đọc "* * *"/mtr, dấu hiệu vòng lặp; tự viết lookup() và traceVerdict(). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const RT = (tep, lenh) => tr(sauLenh(tep, lenh)).filter((d) => d.trim());
const LAPTOP = RT('c22-laptop', 'ip route');
const HOMEGW = RT('c22-routers', 'ip route');
const ISP = RT('c22-isp', 'ip route');
const DC_32 = RT('c22-dc-vong', 'ip route | grep 203.0.113');
const DC_26 = RT('lab2-r5-dc', 'ip route | grep 203.0.113');
const ISP_CUOP = RT('c25-isp-cuop', 'ip route | grep 203.0.113');
const DOCKER = RT('c22-docker-desktop', 'ip route');
const GET = (tep, dst) => tr(sauLenh(tep, `ip route get ${dst}`)).slice(0, 1);
if (ISP.length !== 5 || DC_32.length !== 2 || DC_26.length !== 2 || ISP_CUOP.length !== 2) throw new Error('2.2: bảng định tuyến thật không đúng số dòng');

/* ── 1. Đọc bảng định tuyến ── */
const E1 = cs({
  ten: 'Routing 1 — Read a routing table column by column', kho: 'EASY', phut: 10,
  en: `Real output from the "Internet in a box" lab (lab/out/c22-laptop, c22-routers, c22-isp):${pre(['# laptop (home)', '$ ip route', ...LAPTOP, '$ ip route get 203.0.113.10', ...GET('c22-laptop', '203.0.113.10'), '', '# homegw (home router)', '$ ip route', ...HOMEGW, '', '# isp', '$ ip route', ...ISP, '$ ip route get 8.8.8.8', ...GET('c22-isp', '8.8.8.8')])}`,
  vi: `Output thật từ lab "Internet trong một hộp" (lab/out/c22-laptop, c22-routers, c22-isp):${pre(['# laptop (ở nhà)', '$ ip route', ...LAPTOP, '$ ip route get 203.0.113.10', ...GET('c22-laptop', '203.0.113.10'), '', '# homegw (router nhà)', '$ ip route', ...HOMEGW, '', '# isp', '$ ip route', ...ISP, '$ ip route get 8.8.8.8', ...GET('c22-isp', '8.8.8.8')])}`,
  cau: [
    q('c1', ['On the laptop, "default via 192.168.50.1 dev eth0" means …', 'Trên laptop, "default via 192.168.50.1 dev eth0" nghĩa là …'], ['anything no other line matches goes to 192.168.50.1 out of eth0', 'every packet, without exception, goes to 192.168.50.1 first', 'the laptop is the default router for the network 192.168.50.0/24', '192.168.50.1 is the DNS server the laptop asks for every name'], ['default = 0.0.0.0/0, the shortest possible prefix: it matches everything, so it is used only when no more specific line matches. 192.168.50.1 is the next hop — the home router.', 'default = 0.0.0.0/0, prefix ngắn nhất có thể: khớp mọi thứ, nên chỉ được dùng khi không có dòng cụ thể hơn khớp. 192.168.50.1 là chặng kế — router nhà.']),
    q('c2', ['Who wrote "192.168.50.0/24 dev eth0 proto kernel scope link src 192.168.50.10"?', 'Ai viết dòng "192.168.50.0/24 dev eth0 proto kernel scope link src 192.168.50.10"?'], ['The kernel, from the address and mask of eth0 (a connected route)', 'The home router, which sent it to the laptop with DHCP', 'The administrator, who typed it after setting the address', 'BGP, which learned it from the ISP\'s routers'], ['proto kernel scope link = directly connected, created automatically when 192.168.50.10/24 was set. No "via": deliver directly. src = the source address used for this route.', 'proto kernel scope link = nối trực tiếp, tự tạo khi đặt 192.168.50.10/24. Không có "via": giao thẳng. src = địa chỉ nguồn dùng cho tuyến này.']),
    q('c3', ['The laptop sends both 203.0.113.10 and 8.8.8.8 "via 192.168.50.1". What does it know about the path after that?', 'Laptop gửi cả 203.0.113.10 và 8.8.8.8 "via 192.168.50.1". Nó biết gì về đường đi sau đó?'], ['Nothing — each machine only chooses the next hop', 'The full list of routers, sent back by the home router', 'Only the last router before each destination', 'The path that traceroute measured the last time'], ['IP routing is hop by hop: every router makes its own local decision with its own table. Nobody plans the whole path.', 'Định tuyến IP đi từng chặng: mỗi router tự quyết bằng bảng của chính nó. Không ai lên kế hoạch cả đường đi.']),
    q('c4', ['The ISP router answers "Network is unreachable" for 8.8.8.8 at once. Why?', 'Router isp trả lời ngay "Network is unreachable" cho 8.8.8.8. Vì sao?'], ['It has no default route, and no line in its table covers 8.8.8.8', 'Its link to the Internet is down, so every lookup fails', 'Google blocks traceroute and ping from unknown ISPs', 'The laptop\'s NAT has not created a conntrack entry yet'], ['Core routers on the Internet do not "pass it on to someone else": they must know every network. In the lab nobody announces a range containing 8.8.8.8, so there is simply no line.', 'Router lõi của Internet không "đẩy cho người khác": chúng phải biết mọi mạng. Trong lab không ai quảng bá một dải chứa 8.8.8.8, nên đơn giản là không có dòng nào.']),
    q('c5', ['Where does the ISP\'s line "203.0.113.0/24 nhid 22 via 192.0.2.3 dev ix0 proto bgp metric 20" come from?', 'Dòng "203.0.113.0/24 nhid 22 via 192.0.2.3 dev ix0 proto bgp metric 20" của isp từ đâu ra?'], ['The router software learned it from a neighbour with BGP and put it in the kernel', 'The kernel computed it from the address and mask of ix0', 'An administrator typed it as a temporary test route', 'DHCP gave it to the router when the ix0 link came up'], ['proto bgp: FRR received "203.0.113.0/24 is reachable through me" from the datacenter (192.0.2.3) and installed the best route into the kernel — lesson 2.5.', 'proto bgp: FRR nhận "203.0.113.0/24 tới được qua tôi" từ trung tâm dữ liệu (192.0.2.3) và cài tuyến tốt nhất vào nhân — bài 2.5.']),
    q('c6', ['The home router\'s table has two connected networks and "default via 198.51.100.1 dev wan0". 198.51.100.1 is …', 'Bảng của router nhà có hai mạng nối trực tiếp và "default via 198.51.100.1 dev wan0". 198.51.100.1 là …'], ['the ISP\'s router, the next hop on the way out of the house', 'the home router\'s own public address on the WAN side', 'the laptop, which the router uses as a gateway', 'LabFlow\'s server, the final destination of the request'], ['wan0 has 198.51.100.2/24; its neighbour 198.51.100.1 on that link is the ISP. The house knows nothing else: everything that is not 192.168.50.0/24 or 198.51.100.0/24 goes to the ISP.', 'wan0 có 198.51.100.2/24; hàng xóm 198.51.100.1 trên đường đó là isp. Ngôi nhà không biết gì khác: mọi thứ không thuộc 192.168.50.0/24 hay 198.51.100.0/24 đều đi tới isp.']),
  ],
  goiY: [['"via X" = hand it to router X; no "via" = the destination is on that cable.', '"via X" = trao cho router X; không có "via" = đích ở ngay trên dây đó.'], ['proto kernel = made from an interface address; proto bgp = learned from a neighbour network.', 'proto kernel = dựng từ địa chỉ của card; proto bgp = học từ một mạng hàng xóm.']],
  loi: [['Thinking the first router knows (or chooses) the whole path.', 'Nghĩ router đầu tiên biết (hoặc chọn) cả đường đi.'], ['Expecting every router to have a default route.', 'Tưởng router nào cũng có tuyến mặc định.']],
  tns: [tn('routing table', 'bảng định tuyến'), tn('next hop', 'chặng kế'), tn('connected route', 'tuyến nối trực tiếp', 'Tuyến nhân tự tạo từ địa chỉ + mặt nạ của card.'), tn('default route', 'tuyến mặc định', '0.0.0.0/0, khớp mọi thứ.')],
  kn: ['routing table'],
});

/* ── 2. Tuyến dài nhất thắng — làm tay ── */
const TUYEN = ['default (0.0.0.0/0)', '192.168.50.0/24', '100.64.0.0/24', '198.18.0.0/24', '203.0.113.0/24', '203.0.113.0/25', '203.0.113.0/26', '203.0.113.10/32', 'no line matches'];
const CHANG = ['directly (no via)', '192.168.50.1', '198.51.100.1', '192.0.2.1', '192.0.2.3', '192.0.2.66', 'nowhere: Network is unreachable'];
const h2 = (x, t, c) => ({ o: { x }, a: { t, c } });
const E2 = cs({
  ten: 'Routing 2 — Longest prefix match by hand', kho: 'MEDIUM', phut: 18, loai: 'table',
  en: `Among all lines that match a destination, the one with the <b>longest prefix</b> wins (equal length ⇒ lower metric). Note that <code>ip route</code> prints a /32 without "/32". Real tables:${pre(['# laptop', ...LAPTOP, '# isp (normal)', ...ISP, '# dc, after someone added a test route and forgot it (c22-dc-vong)', ...DC_32, '# dc, Lab 2 incident A (lab2-r5-dc)', ...DC_26, '# isp, while AS64511 announces a /25 (c25-isp-cuop)', ...ISP_CUOP])}For each row choose the winning line and the next hop. Row 9 was not measured in the lab: apply the rule.`,
  vi: `Trong mọi dòng khớp một đích, dòng có <b>prefix dài nhất</b> thắng (dài bằng nhau ⇒ metric nhỏ hơn). Chú ý <code>ip route</code> in một /32 mà không ghi "/32". Các bảng thật:${pre(['# laptop', ...LAPTOP, '# isp (bình thường)', ...ISP, '# dc, sau khi ai đó thêm tuyến thử rồi quên (c22-dc-vong)', ...DC_32, '# dc, sự cố A của Lab 2 (lab2-r5-dc)', ...DC_26, '# isp, lúc AS64511 quảng bá một /25 (c25-isp-cuop)', ...ISP_CUOP])}Với mỗi dòng, chọn tuyến thắng và chặng kế. Dòng 9 không đo trong lab: hãy áp luật.`,
  bang: [bang1('b1', ['Which line wins?', 'Dòng nào thắng?'], [{ ma: 'x', ten: 'Router → destination' }, { ma: 't', ten: 'Winning line', luaChon: TUYEN }, { ma: 'c', ten: 'Next hop', luaChon: CHANG }], [
    h2('1. laptop → 192.168.50.11 (the phone)', TUYEN[1], CHANG[0]),
    h2('2. laptop → 8.8.8.8', TUYEN[0], CHANG[1]),
    h2('3. isp → 203.0.113.200', TUYEN[4], CHANG[4]),
    h2('4. isp → 100.64.0.10 (the 4G phone)', TUYEN[2], CHANG[0]),
    h2('5. isp → 8.8.8.8', TUYEN[8], CHANG[6]),
    h2('6. dc (forgotten /32) → 203.0.113.10', TUYEN[7], CHANG[3]),
    h2('7. dc (incident A) → 203.0.113.100', TUYEN[4], CHANG[0]),
    h2('8. isp (hijack) → 203.0.113.10', TUYEN[5], CHANG[5]),
    h2('9. isp (hijack) → 203.0.113.200 — rule, not measured', TUYEN[4], CHANG[4]),
  ], [`Rows 1–8 are confirmed by ip route get in the lab: laptop → ${GET('c22-laptop', '192.168.50.11')[0]}; isp → ${GET('c22-isp', '203.0.113.200')[0]}; dc (forgotten /32) → ${GET('c22-dc-vong', '203.0.113.10')[0]}; dc (incident A) → ${GET('lab2-r5-dc', '203.0.113.100')[0]}; isp (hijack) → ${GET('c25-isp-cuop', '203.0.113.10')[0]}. The /32 and the /25 win because they are longer than the /24, whatever they say. The /26 covers only .0–.63, so .100 still uses the connected /24; the hijacker's /25 covers .0–.127, so .200 still goes to the datacenter.`, `Dòng 1–8 đã được ip route get xác nhận trong lab: laptop → ${GET('c22-laptop', '192.168.50.11')[0]}; isp → ${GET('c22-isp', '203.0.113.200')[0]}; dc (quên /32) → ${GET('c22-dc-vong', '203.0.113.10')[0]}; dc (sự cố A) → ${GET('lab2-r5-dc', '203.0.113.100')[0]}; isp (bị cướp) → ${GET('c25-isp-cuop', '203.0.113.10')[0]}. /32 và /25 thắng vì dài hơn /24, bất kể chúng nói gì. /26 chỉ phủ .0–.63, nên .100 vẫn dùng /24 nối trực tiếp; /25 của kẻ cướp phủ .0–.127, nên .200 vẫn đi về trung tâm dữ liệu.`])],
  goiY: [['List every line that matches, then keep the longest. default always matches with length 0.', 'Liệt kê mọi dòng khớp, rồi giữ dòng dài nhất. default luôn khớp với độ dài 0.'], ['/25 = .0–.127, /26 = .0–.63 of the 203.0.113 network.', '/25 = .0–.127, /26 = .0–.63 của mạng 203.0.113.']],
  loi: [['Taking the first matching line of the table instead of the longest.', 'Lấy dòng khớp đầu tiên của bảng thay vì dòng dài nhất.'], ['Reading "203.0.113.10 via 192.0.2.1" as a /24 because no prefix is printed — it is a /32.', 'Đọc "203.0.113.10 via 192.0.2.1" thành /24 vì không in prefix — nó là /32.']],
  tns: [tn('longest prefix match', 'khớp tiền tố dài nhất'), tn('more specific', 'cụ thể hơn', 'Prefix dài hơn, phủ ít địa chỉ hơn.'), tn('metric', 'chỉ số ưu tiên', 'Nhỏ hơn thì được ưu tiên khi prefix dài bằng nhau.')],
  kn: ['longest prefix match'],
});

/* ── 3. TTL và traceroute ── */
const TS = tr(sauLenh('c22-trace', 'tshark')).filter((d) => !d.startsWith('Running as'));
const E3 = cs({
  ten: 'Routing 3 — TTL, Time exceeded and how traceroute works', kho: 'MEDIUM', phut: 12,
  en: `traceroute from the laptop to LabFlow, captured with tshark (columns: source, destination, IP TTL, info — lab/out/c22-trace):${pre(['$ traceroute -n 203.0.113.10', ...tr(sauLenh('c22-trace', 'traceroute -n 203.0.113.10')), '', '$ tshark … (one probe per TTL: traceroute -n -q 1 -N 1)', ...TS])}`,
  vi: `traceroute từ laptop tới LabFlow, bắt gói bằng tshark (cột: nguồn, đích, TTL của IP, thông tin — lab/out/c22-trace):${pre(['$ traceroute -n 203.0.113.10', ...tr(sauLenh('c22-trace', 'traceroute -n 203.0.113.10')), '', '$ tshark … (mỗi TTL một gói thử: traceroute -n -q 1 -N 1)', ...TS])}`,
  cau: [
    q('c1', ['The probe with TTL 1 is answered by 192.168.50.1 with "Time-to-live exceeded". Why that router?', 'Gói thử TTL 1 được 192.168.50.1 trả lời "Time-to-live exceeded". Vì sao là router đó?'], ['It is the first router: it subtracts 1, reaches 0, drops the probe and reports it', 'It is the router closest to LabFlow, so it answers for the server', 'It is the DNS server that the laptop uses for every name', 'It is the only router that is allowed to answer ICMP'], ['Every router subtracts 1 before forwarding; at 0 it drops the packet and sends ICMP Time exceeded to the source. TTL 1 dies at the first router, TTL 2 at the second…', 'Router nào cũng trừ 1 trước khi chuyển tiếp; về 0 thì vứt gói và gửi ICMP Time exceeded về nguồn. TTL 1 chết ở router đầu, TTL 2 ở router thứ hai…']),
    q('c2', ['The TTL 4 probe gets "Port unreachable" from 203.0.113.10. What does traceroute conclude?', 'Gói thử TTL 4 nhận "Port unreachable" từ 203.0.113.10. traceroute kết luận gì?'], ['It has arrived: it sent UDP to an unused port on purpose, and the destination rejected it', 'The web server is broken: port 80 refused the connection', 'A firewall on the path blocked the probe before the destination', 'The route is a loop and the packet came back to the sender'], ['Linux traceroute sends UDP to ports 33434 and up (see 33434 … 33437 in the capture). Nobody listens there, so the destination itself answers "port unreachable" — the signal that the last hop is the target.', 'traceroute của Linux gửi UDP tới cổng 33434 trở lên (xem 33434 … 33437 trong bản bắt). Không ai nghe ở đó, nên chính đích trả lời "port unreachable" — tín hiệu rằng chặng cuối là đích.']),
    q('c3', ['The answers arrive with TTL 64, 63, 62, 61. What does that column tell you?', 'Các câu trả lời về với TTL 64, 63, 62, 61. Cột đó cho biết gì?'], ['Each reply started at 64 and crossed one more router on its way back', 'The routers count down how many hops are left to the destination', 'The routers became slower one by one along the path', 'Each reply was sent four times and only the last one arrived'], ['The replies are new packets with TTL 64. The one from 192.168.50.1 crossed no router (64); the server\'s crossed three (61).', 'Câu trả lời là gói mới với TTL 64. Câu của 192.168.50.1 không qua router nào (64); câu của server qua ba router (61).']),
    q('c4', ['Why does IP have a TTL at all?', 'Vì sao IP lại có TTL?'], ['So a packet caught in a routing loop dies instead of circling forever', 'So that traceroute can measure the path of a packet', 'So that the receiver knows how old the data in the packet is', 'So that routers can choose the shortest path to the destination'], ['traceroute only re-uses the rule. The rule exists for loops — you will see one in exercise 4.', 'traceroute chỉ tận dụng luật đó. Luật tồn tại vì vòng lặp — bạn sẽ thấy một vòng ở bài 4.']),
    q('c5', ['A firewall on the path drops UDP, so traceroute shows only stars. What do you try?', 'Một tường lửa trên đường vứt UDP, nên traceroute chỉ hiện dấu sao. Bạn thử gì?'], ['traceroute -I (ICMP echo) or -T (TCP SYN), like Windows tracert', 'traceroute -n, so that names are not looked up', 'traceroute -q 1, so that only one probe is sent per hop', 'Nothing — no tool can see past a firewall'], ['Only the probe type changes; the TTL trick is the same. Windows tracert uses ICMP echo by default; -T to port 443 often passes where UDP does not.', 'Chỉ đổi loại gói thử; mẹo TTL vẫn thế. tracert của Windows dùng ICMP echo mặc định; -T tới cổng 443 thường qua được chỗ UDP bị chặn.']),
    q('c6', ['Each line of the first traceroute shows three times. What are they?', 'Mỗi dòng của traceroute đầu tiên hiện ba thời gian. Chúng là gì?'], ['The round-trip times of three probes sent with the same TTL', 'The time to the router, through it, and back to the laptop', 'The minimum, average and maximum of ten probes', 'The time in three units: milliseconds, microseconds, seconds'], ['Three probes per TTL by default (-q 3). Three different answers per line are possible too: then the path has several equal routers (load balancing).', 'Mặc định ba gói thử mỗi TTL (-q 3). Ba câu trả lời khác nhau trên một dòng cũng có thể xảy ra: khi đó đường có nhiều router ngang nhau (cân bằng tải).']),
  ],
  goiY: [['Read the capture in pairs: probe with TTL n → who answered.', 'Đọc bản bắt theo cặp: gói thử TTL n → ai trả lời.'], ['"Time exceeded" comes from a router on the way; "Port unreachable" comes from the destination itself.', '"Time exceeded" đến từ một router trên đường; "Port unreachable" đến từ chính đích.']],
  loi: [['Thinking traceroute asks each router for its name or position.', 'Nghĩ traceroute hỏi từng router tên hay vị trí của nó.'], ['Reading "Port unreachable" at the last hop as a failure of the web server.', 'Đọc "Port unreachable" ở chặng cuối thành lỗi của web server.']],
  tns: [tn('TTL (time to live)', 'thời gian sống', 'Bộ đếm trong header IP, mỗi router trừ 1.'), tn('ICMP Time exceeded', 'thông báo hết TTL'), tn('probe', 'gói thử')],
  kn: ['TTL', 'traceroute'],
});

/* ── 4. Đọc "* * *", mtr và vòng lặp ── */
const SAO = tr(sauLenh('c22-sao', 'traceroute -n -w 1'));
const MTR = tr(sauLenh('c22-sao', 'mtr -n -r -c 10'));
const CURL = tr(sauLenh('c22-sao', 'curl -s -m 3'));
const VONG_P = tr(sauLenh('c22-vong', 'ping -c 2')).filter((d) => d.trim()).slice(0, 3);
const VONG_T = tr(sauLenh('c22-vong', 'traceroute -n -q 1 -N 1 -m 9'));
const A100 = tr(sauLenh('lab2-r5-laptop', 'traceroute -n -q 1 -N 1 -m 5 203.0.113.100'));
const DD = tr(sauLenh('c22-docker-desktop', 'traceroute -n -q 1 -w 1 -m 6 1.1.1.1'));
const E4 = cs({
  ten: 'Routing 4 — Stars, mtr and the signature of a loop', kho: 'MEDIUM', phut: 18,
  en: `Four real situations from the lab.${pre(['# A — the DC router is configured not to send Time exceeded (c22-sao)', '$ traceroute -n -w 1 203.0.113.10', ...SAO, '$ mtr -n -r -c 10 203.0.113.10', ...MTR, '$ curl -s -m 3 http://203.0.113.10/', ...CURL, '', '# B — after a forgotten route on dc (c22-vong)', '$ ping -c 2 203.0.113.10', ...VONG_P, '$ traceroute -n -q 1 -N 1 -m 9 203.0.113.10', ...VONG_T, '', '# C — Lab 2 incident A: dc has 203.0.113.0/26 via 192.0.2.1 (lab2-r5-laptop)', '$ traceroute -n -q 1 -N 1 -m 5 203.0.113.100', ...A100, '', '# D — inside a container on Docker Desktop, to the real Internet (c22-docker-desktop)', '$ traceroute -n -q 1 -w 1 -m 6 1.1.1.1', ...DD])}`,
  vi: `Bốn tình huống thật trong lab.${pre(['# A — router dc được cấu hình không gửi Time exceeded (c22-sao)', '$ traceroute -n -w 1 203.0.113.10', ...SAO, '$ mtr -n -r -c 10 203.0.113.10', ...MTR, '$ curl -s -m 3 http://203.0.113.10/', ...CURL, '', '# B — sau một tuyến bị quên trên dc (c22-vong)', '$ ping -c 2 203.0.113.10', ...VONG_P, '$ traceroute -n -q 1 -N 1 -m 9 203.0.113.10', ...VONG_T, '', '# C — sự cố A của Lab 2: dc có 203.0.113.0/26 via 192.0.2.1 (lab2-r5-laptop)', '$ traceroute -n -q 1 -N 1 -m 5 203.0.113.100', ...A100, '', '# D — trong một container trên Docker Desktop, ra Internet thật (c22-docker-desktop)', '$ traceroute -n -q 1 -w 1 -m 6 1.1.1.1', ...DD])}`,
  cau: [
    q('c1', ['A: mtr shows 100 % loss at hop 3. A customer says "your network is broken at hop 3". You answer …', 'A: mtr báo mất 100 % ở hop 3. Khách nói "mạng của bạn hỏng ở hop 3". Bạn trả lời …'], ['Hop 3 only stays silent; hop 4 has 0 % loss and the site answers', 'Hop 3 drops every packet; we are replacing that router now', 'Hop 3 is outside our network, so we cannot do anything', 'Hop 3 is slow, which is why the page takes 100 % longer'], ['Packets go through hop 3 perfectly (hop 4 and curl prove it); the router just does not send Time exceeded. Loss matters only if it continues to every later hop, up to the destination.', 'Gói đi qua hop 3 hoàn hảo (hop 4 và curl chứng minh); router chỉ không gửi Time exceeded. Mất gói chỉ đáng lo khi nó kéo dài tới mọi hop sau, tới tận đích.']),
    q('c2', ['A: the last line ends with one "*" (0.030 ms 0.020 ms *). Most likely?', 'A: dòng cuối kết thúc bằng một "*" (0.030 ms 0.020 ms *). Khả dĩ nhất?'], ['Linux rate-limits ICMP errors (about one per second per destination)', 'The server lost one third of all packets during the test', 'The third probe took another path that does not exist', 'The firewall on dc dropped the third probe on purpose'], ['Three probes leave almost at once; the destination answers the first ones and the limiter swallows the next. One star with answers around it is noise, not loss.', 'Ba gói thử đi gần như cùng lúc; đích trả lời mấy gói đầu và bộ giới hạn nuốt gói sau. Một dấu sao giữa các câu trả lời là nhiễu, không phải mất gói.']),
    q('c3', ['B: hops alternate 192.0.2.3, 198.51.100.1, 192.0.2.3 … and ping says "Time to live exceeded". This is …', 'B: các hop luân phiên 192.0.2.3, 198.51.100.1, 192.0.2.3 … và ping báo "Time to live exceeded". Đây là …'], ['a routing loop: dc and isp send the packet back and forth until TTL is 0', 'load balancing: two equal paths are used one after the other', 'a slow server: the packet waits at each router in turn', 'NAT: the ISP rewrites the address and sends it back'], ['dc has 203.0.113.10/32 via 192.0.2.1 (longer than its connected /24, so it wins) and sends the packet back to the ISP; the ISP\'s BGP route sends it to dc again. Alternating addresses = loop.', 'dc có 203.0.113.10/32 via 192.0.2.1 (dài hơn /24 nối trực tiếp, nên thắng) và gửi gói về isp; tuyến BGP của isp lại gửi nó tới dc. Địa chỉ luân phiên = vòng lặp.']),
    q('c4', ['B: the ISP answers from 198.51.100.1, not from its IX address 192.0.2.1. Why?', 'B: isp trả lời từ 198.51.100.1, không phải địa chỉ IX 192.0.2.1 của nó. Vì sao?'], ['A router replies from its address on the way back to the sender', 'The ISP\'s IX address is private, so it may not be shown', 'traceroute picks the address with the lowest number', 'The packet was NATed by the ISP before it looped'], ['The Time exceeded message is a new packet from the ISP to the laptop; its source is the interface it leaves by, cust0 = 198.51.100.1.', 'Thông báo Time exceeded là gói mới từ isp tới laptop; nguồn của nó là card nó đi ra, cust0 = 198.51.100.1.']),
    q('c5', ['C: hop 4 shows 192.0.2.3 again with "3064.414 ms !H". Is this the loop of incident A?', 'C: hop 4 lại hiện 192.0.2.3 với "3064.414 ms !H". Đây có phải vòng lặp của sự cố A?'], ['No: .100 is outside the /26, dc delivers it directly, nobody has .100, so "host unreachable"', 'Yes: the same router twice in a row is the signature of every loop', 'No: !H means the web server is down and must be restarted', 'Yes: 3 seconds is the time the packet spent circling the loop'], ['!H = ICMP host unreachable from dc, after ~3 s of ARP requests for 203.0.113.100 that nobody answered. Only .0–.63 loop in incident A (they match the /26) — including the name server .53.', '!H = ICMP host unreachable từ dc, sau ~3 s hỏi ARP cho 203.0.113.100 mà không ai trả lời. Trong sự cố A chỉ .0–.63 bị lặp (khớp /26) — gồm cả máy chủ tên .53.']),
    q('c6', ['D: inside a Docker Desktop container, traceroute to 1.1.1.1 shows 172.17.0.1 and then only stars. Conclusion?', 'D: trong container trên Docker Desktop, traceroute tới 1.1.1.1 hiện 172.17.0.1 rồi toàn dấu sao. Kết luận?'], ['Docker Desktop\'s user-space proxy does not pass the TTL trick; trace from the host instead', 'The Internet drops every packet after the first router', '1.1.1.1 is unreachable from Vietnam because of a cable cut', 'The container has no default route, so packets stop at 172.17.0.1'], ['The container has a default route (172.17.0.1) and real traffic works; only the probes with small TTL are not forwarded as such. Run traceroute -n (or tracert -d) on your own computer.', 'Container có tuyến mặc định (172.17.0.1) và lưu lượng thật vẫn chạy; chỉ các gói thử TTL nhỏ không được chuyển như vậy. Chạy traceroute -n (hoặc tracert -d) trên chính máy bạn.']),
  ],
  goiY: [['Always look at the last hop and at the real request (curl) before blaming a middle hop.', 'Luôn nhìn chặng cuối và request thật (curl) trước khi đổ lỗi cho chặng giữa.'], ['Two addresses taking turns = loop; one address with !H or !N = an explicit "cannot deliver".', 'Hai địa chỉ thay phiên = vòng lặp; một địa chỉ với !H hay !N = lời báo rõ "không giao được".']],
  loi: [['Opening a ticket against the router at the first "* * *".', 'Mở ticket cho router ở dòng "* * *" đầu tiên.'], ['Calling any repeated address a loop, even when it ends with !H.', 'Gọi mọi địa chỉ lặp lại là vòng lặp, kể cả khi nó kết thúc bằng !H.']],
  tns: [tn('mtr', 'traceroute chạy liên tục và đếm mất gói'), tn('routing loop', 'vòng lặp định tuyến'), tn('ICMP rate limit', 'giới hạn tốc độ ICMP'), tn('!H / !N', 'host / mạng không tới được', 'Ký hiệu traceroute in khi nhận ICMP unreachable.')],
  kn: ['reading traceroute', 'routing loop'],
});

/* ── 5. Tự viết: lookup(table, dst) ── */
function lookup(table, dst) {
  function toNum(ip) { return ip.split('.').reduce(function (n, b) { return n * 256 + Number(b); }, 0); }
  var d = toNum(dst);
  var best = null;
  table.forEach(function (line, i) {
    var t = line.trim().split(/\s+/);
    if (!t[0]) return;
    // first word: "default" (= 0.0.0.0/0) or a prefix; ip route prints a /32 without "/32"
    var pfx = t[0] === 'default' ? '0.0.0.0/0' : (t[0].indexOf('/') < 0 ? t[0] + '/32' : t[0]);
    var len = Number(pfx.split('/')[1]);
    var size = Math.pow(2, 32 - len);
    if (Math.floor(toNum(pfx.split('/')[0]) / size) !== Math.floor(d / size)) return;   // the first len bits differ
    function val(key) { var k = t.indexOf(key); return k > 0 && k + 1 < t.length ? t[k + 1] : null; }
    var metric = val('metric') === null ? 0 : Number(val('metric'));
    var cand = { len: len, metric: metric, i: i, route: pfx, via: val('via'), dev: val('dev') };
    // longest prefix first; for the same length the lower metric; then the line that comes first
    if (!best || len > best.len || (len === best.len && metric < best.metric)) best = cand;
  });
  if (!best) return { error: 'Network is unreachable' };
  return { dst: dst, route: best.route, via: best.via, dev: best.dev };
}
const TWO_DEF = ['default via 192.168.1.1 dev wlan0 proto dhcp src 192.168.1.23 metric 600', 'default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.42 metric 100', '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.42 metric 100', '192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.23 metric 600'];
const E5 = jsBai({
  ten: 'Routing 5 — Write lookup(table, dst): longest prefix match', kho: 'HARD', phut: 30,
  en: `<p>Write <code>lookup(table, dst)</code> — what the kernel does for every packet. <code>table</code> is an array of lines exactly as <code>ip route</code> prints them; <code>dst</code> is a dotted IPv4 address. Real example (lab/out/c22-isp):</p>${pre(['$ ip route', ...ISP, '$ ip route get 203.0.113.10', ...GET('c22-isp', '203.0.113.10'), '$ ip route get 8.8.8.8', ...tr(sauLenh('c22-isp', 'ip route get 8.8.8.8'))])}<ul>
<li>The first word of a line is <code>default</code> (= <code>0.0.0.0/0</code>) or a prefix. A prefix without "/" is a <b>/32</b> (that is how <code>ip route</code> prints a host route).</li>
<li>Other words come in pairs: <code>via X</code>, <code>dev Y</code>, <code>metric N</code> (no metric = 0); ignore the rest (<code>proto</code>, <code>scope</code>, <code>src</code>, <code>nhid</code>…).</li>
<li>Among the lines that match, pick the longest prefix; same length ⇒ the lower metric; still equal ⇒ the earlier line.</li>
<li>Return <code>{ dst, route: "a.b.c.d/len", via, dev }</code> (<code>via: null</code> for a connected route; default ⇒ <code>route: "0.0.0.0/0"</code>), or <code>{ error: "Network is unreachable" }</code> when nothing matches.</li>
</ul><p>Visible cases: the laptop and the ISP. Hidden cases: the home router, the DC with the forgotten /32, the DC of Lab 2 incident A (/26), the ISP during the BGP hijack (/25), Docker Desktop, and a constructed laptop with Wi-Fi and Ethernet both up (two default routes, metrics 600 and 100).</p>`,
  vi: `<p>Viết <code>lookup(table, dst)</code> — việc nhân làm cho mỗi gói tin. <code>table</code> là mảng các dòng đúng như <code>ip route</code> in ra; <code>dst</code> là địa chỉ IPv4 dạng chấm. Ví dụ thật (lab/out/c22-isp):</p>${pre(['$ ip route', ...ISP, '$ ip route get 203.0.113.10', ...GET('c22-isp', '203.0.113.10'), '$ ip route get 8.8.8.8', ...tr(sauLenh('c22-isp', 'ip route get 8.8.8.8'))])}<ul>
<li>Chữ đầu của một dòng là <code>default</code> (= <code>0.0.0.0/0</code>) hoặc một prefix. Prefix không có "/" là <b>/32</b> (cách <code>ip route</code> in tuyến tới một máy).</li>
<li>Các chữ khác đi theo cặp: <code>via X</code>, <code>dev Y</code>, <code>metric N</code> (không có metric = 0); bỏ qua phần còn lại (<code>proto</code>, <code>scope</code>, <code>src</code>, <code>nhid</code>…).</li>
<li>Trong các dòng khớp, chọn prefix dài nhất; dài bằng nhau ⇒ metric nhỏ hơn; vẫn bằng ⇒ dòng đứng trước.</li>
<li>Trả <code>{ dst, route: "a.b.c.d/len", via, dev }</code> (<code>via: null</code> với tuyến nối trực tiếp; default ⇒ <code>route: "0.0.0.0/0"</code>), hoặc <code>{ error: "Network is unreachable" }</code> khi không dòng nào khớp.</li>
</ul><p>Ca hiện: laptop và isp. Ca ẩn: router nhà, dc với /32 bị quên, dc của sự cố A trong Lab 2 (/26), isp lúc bị cướp tuyến BGP (/25), Docker Desktop, và một laptop dựng sẵn bật cả Wi-Fi lẫn Ethernet (hai tuyến mặc định, metric 600 và 100).</p>`,
  dauVao: ['table — array of ip route lines; dst — dotted IPv4.', 'table — mảng dòng ip route; dst — IPv4 dạng chấm.'],
  dauRa: ['{ dst, route, via, dev } or { error: "Network is unreachable" }', '{ dst, route, via, dev } hoặc { error: "Network is unreachable" }'],
  goiY: [
    ['Split each line into words. The value after "via" is t[t.indexOf("via") + 1].', 'Tách mỗi dòng thành từ. Giá trị sau "via" là t[t.indexOf("via") + 1].'],
    ['Match test, as in lesson 1.4: Math.floor(prefixNumber / 2^(32 − len)) === Math.floor(dstNumber / 2^(32 − len)). It works for /0 and /32.', 'Phép thử khớp, như bài 1.4: Math.floor(sốPrefix / 2^(32 − len)) === Math.floor(sốĐích / 2^(32 − len)). Đúng cả với /0 và /32.'],
    ['Keep the best candidate while you walk the table; replace it only if the new one is strictly better.', 'Giữ ứng viên tốt nhất khi duyệt bảng; chỉ thay khi ứng viên mới tốt hơn hẳn.'],
  ],
  loi: [
    ['Returning the first matching line: on the ISP table the hijacker\'s /25 comes first by accident, on the DC table the /24 comes first — order is not priority.', 'Trả dòng khớp đầu tiên: ở bảng isp /25 của kẻ cướp tình cờ đứng trước, ở bảng dc /24 đứng trước — thứ tự không phải độ ưu tiên.'],
    ['Treating "203.0.113.10 via 192.0.2.1" as a line without a prefix and skipping it — that /32 is the line that wins.', 'Coi "203.0.113.10 via 192.0.2.1" là dòng không có prefix rồi bỏ qua — chính /32 đó là dòng thắng.'],
    ['Reading the word after "nhid" or "metric" as the next hop.', 'Đọc chữ sau "nhid" hay "metric" thành chặng kế.'],
  ],
  gt: ['The routing decision is a pure function of the table and the destination: every matching line is a candidate and the most specific one wins, because a longer prefix is a more precise statement about where those addresses are. That is why a forgotten /32 or a hijacker\'s /25 overrides a correct /24, and why a /26 hurts only .0–.63. The metric only breaks ties between lines of the same length — the usual case of a laptop with Ethernet (metric 100) preferred over Wi-Fi (600). With no default route and no match, the answer is final: "Network is unreachable", as the ISP said for 8.8.8.8.', 'Quyết định định tuyến là một hàm thuần của bảng và đích: mọi dòng khớp là ứng viên và dòng cụ thể nhất thắng, vì prefix dài hơn là một khẳng định chính xác hơn về nơi các địa chỉ đó ở. Vì thế một /32 bị quên hay /25 của kẻ cướp đè lên /24 đúng, và một /26 chỉ làm hỏng .0–.63. Metric chỉ phân xử giữa các dòng dài bằng nhau — trường hợp quen thuộc của laptop có Ethernet (metric 100) được ưu tiên hơn Wi-Fi (600). Không có tuyến mặc định và không dòng nào khớp thì câu trả lời là dứt khoát: "Network is unreachable", như isp đã nói với 8.8.8.8.'],
  kn: ['longest prefix match', 'routing table'],
  tns: [tn('host route', 'tuyến tới một máy', 'Prefix /32.'), tn('metric', 'chỉ số ưu tiên'), tn('tie-break', 'luật phân xử khi bằng nhau')],
  dau: `/** table: lines of "ip route"; dst: "a.b.c.d" ⇒ { dst, route, via, dev } | { error: 'Network is unreachable' } */
function lookup(table, dst) {
  // Write your solution here
  return { error: 'Network is unreachable' };
}
`,
  giai: '// Reference solution\n' + nguon(lookup),
  cases: [
    { goi: goi('lookup', LAPTOP, '192.168.50.11'), moTa: ['laptop → 192.168.50.11 (real table)', 'laptop → 192.168.50.11 (bảng thật)'] },
    { goi: goi('lookup', LAPTOP, '8.8.8.8'), moTa: ['laptop → 8.8.8.8', 'laptop → 8.8.8.8'] },
    { goi: goi('lookup', ISP, '203.0.113.10'), moTa: ['isp → 203.0.113.10', 'isp → 203.0.113.10'] },
    { goi: goi('lookup', ISP, '8.8.8.8'), moTa: ['isp → 8.8.8.8 (no default route)', 'isp → 8.8.8.8 (không có tuyến mặc định)'] },
    { goi: goi('lookup', HOMEGW, '203.0.113.10'), an: true },
    { goi: goi('lookup', ISP, '100.64.0.10'), an: true },
    { goi: goi('lookup', ISP, '198.18.0.77'), an: true },
    { goi: goi('lookup', DC_32, '203.0.113.10'), an: true },
    { goi: goi('lookup', DC_32, '203.0.113.11'), an: true },
    { goi: goi('lookup', DC_26, '203.0.113.53'), an: true },
    { goi: goi('lookup', DC_26, '203.0.113.100'), an: true },
    { goi: goi('lookup', ISP_CUOP, '203.0.113.10'), an: true },
    { goi: goi('lookup', ISP_CUOP, '203.0.113.200'), an: true },
    { goi: goi('lookup', DOCKER, '1.1.1.1'), an: true },
    { goi: goi('lookup', TWO_DEF, '1.1.1.1'), an: true, moTa: ['Hidden: two default routes (constructed) — the lower metric wins', 'Ẩn: hai tuyến mặc định (dựng) — metric nhỏ hơn thắng'] },
    { goi: goi('lookup', [], '10.0.0.1'), an: true },
  ],
});

/* ── 6. Tự viết: traceVerdict(text) ── */
function traceVerdict(text) {
  var lines = String(text).split('\n');
  var target = null, hops = [];
  function isIp(w) { return /^\d+\.\d+\.\d+\.\d+$/.test(w) || (w.indexOf(':') >= 0 && /^[0-9a-fA-F:.]+$/.test(w)); }
  lines.forEach(function (line) {
    var head = /^traceroute to \S+ \(([^)]+)\)/.exec(line.trim());
    if (head) { target = head[1]; return; }
    var m = /^\s*(\d+)\s+(.*)$/.exec(line);
    if (!m) return;
    var words = m[2].trim().split(/\s+/);
    hops.push({
      n: Number(m[1]),
      addrs: words.filter(isIp),
      flag: words.filter(function (w) { return /^![A-Z0-9]*$/.test(w); })[0] || null,   // !H !N !X !P …
    });
  });
  var answered = hops.filter(function (h) { return h.addrs.length > 0; });
  var lastResponder = answered.length ? answered[answered.length - 1].addrs[answered[answered.length - 1].addrs.length - 1] : null;
  // 1. an explicit "cannot deliver" from a router beats everything else
  var bad = hops.filter(function (h) { return h.flag; })[0];
  if (bad) return { verdict: 'unreachable', lastResponder: bad.addrs[bad.addrs.length - 1] || lastResponder };
  // 2. loop: an address answers again later, with a different address in between
  for (var i = 0; i < hops.length; i++) {
    for (var j = i + 2; j < hops.length; j++) {
      var again = hops[j].addrs.some(function (a) { return hops[i].addrs.indexOf(a) >= 0; });
      if (!again) continue;
      for (var k = i + 1; k < j; k++) {
        if (hops[k].addrs.some(function (a) { return hops[i].addrs.indexOf(a) < 0; })) return { verdict: 'loop', lastResponder: lastResponder };
      }
    }
  }
  // 3. reached the target? then silent hops in the middle are harmless
  var reached = answered.length > 0 && answered[answered.length - 1].addrs.indexOf(target) >= 0;
  if (reached) {
    var silent = hops.some(function (h) { return h.addrs.length === 0; });
    return { verdict: silent ? 'silent-hop' : 'ok', lastResponder: lastResponder };
  }
  return { verdict: 'loss-to-end', lastResponder: lastResponder };
}
const T = (tep, lenh) => tr(sauLenh(tep, lenh)).join('\n');
const T_OK = T('c22-trace', 'traceroute -n 203.0.113.10');
const T_SAO = T('c22-sao', 'traceroute -n -w 1 203.0.113.10');
const T_VONG = T('c22-vong', 'traceroute -n -q 1 -N 1 -m 9 203.0.113.10');
const T_A10 = T('lab2-r5-laptop', 'traceroute -n -q 1 -N 1 -m 7 203.0.113.10');
const T_A100 = T('lab2-r5-laptop', 'traceroute -n -q 1 -N 1 -m 5 203.0.113.100');
const T_CUOP = T('c25-laptop-cuop', 'traceroute -n -q 1 -N 1 -w 1 -m 5 203.0.113.10');
const T_RUT = T('c25-laptop-rut', 'traceroute -n -q 1 -N 1 -m 4 203.0.113.10');
const T_DD = T('c22-docker-desktop', 'traceroute -n -q 1 -w 1 -m 6 1.1.1.1');
const T_MOB = T('lab2-r2-mobile', 'traceroute -n -q 1 -N 1 203.0.113.10');
const T_V6 = T('lab2-r2-laptop', 'traceroute -6 -n -q 1 -N 1 2001:db8:d::10');
const T_B = T('lab2-r6-laptop', 'traceroute -n -q 1 -N 1 -w 1 -m 4 203.0.113.10');
const T_VAO = T('c23-vao', 'traceroute -n -q 1 -m 3 192.168.50.10');
// DỰNG (ghi rõ trong đề): một hop cân bằng tải có hai router trả lời trên cùng dòng, rồi tới đích.
const T_ECMP = 'traceroute to 203.0.113.10 (203.0.113.10), 30 hops max, 60 byte packets\n 1  192.168.50.1  0.412 ms  0.388 ms  0.371 ms\n 2  198.51.100.1  1.204 ms 198.51.100.9  1.311 ms 198.51.100.1  1.198 ms\n 3  192.0.2.3  2.010 ms  1.987 ms  2.003 ms\n 4  203.0.113.10  2.411 ms  2.398 ms  2.420 ms';
const E6 = jsBai({
  ten: 'Routing 6 — Write traceVerdict(text): read traceroute like an engineer', kho: 'HARD', phut: 35,
  en: `<p>Write <code>traceVerdict(text)</code>. <code>text</code> is the full output of <code>traceroute -n</code> (header line "traceroute to NAME (ADDRESS), …" then one line per hop). Return <code>{ verdict, lastResponder }</code>, checking in this order:</p>
<ol>
<li><code>"unreachable"</code> — some hop carries a flag that starts with "!" (<code>!H</code>, <code>!N</code>, <code>!X</code>…): a router said explicitly it cannot deliver. <code>lastResponder</code> = the address on that hop.</li>
<li><code>"loop"</code> — an address that answered at one hop answers again at a later hop, with a <b>different</b> address in between.</li>
<li>The last hop that answered contains the target address: <code>"silent-hop"</code> if some hop was all stars, otherwise <code>"ok"</code>.</li>
<li>Otherwise <code>"loss-to-end"</code> — the probes stop getting answers and never reach the target.</li>
</ol>
<p><code>lastResponder</code> (rules 2–4) = the last address printed in the output, or <code>null</code> if nobody answered. Times like <code>0.059</code> and the word <code>ms</code> are not addresses; one hop line may show several addresses (load balancing). Example (lab/out/c22-sao):</p>${pre(T_SAO)}<p>⇒ <code>{ verdict: "silent-hop", lastResponder: "203.0.113.10" }</code>. Visible cases: four real traces. Hidden: ten more real traces (the loop of Lab 2 incident A, its <code>!H</code> for .100, the BGP hijack and the withdrawal, the 4G phone, IPv6, Docker Desktop, an inbound attempt with <code>!N</code>) and one <b>constructed</b> load-balanced path.</p>`,
  vi: `<p>Viết <code>traceVerdict(text)</code>. <code>text</code> là toàn bộ output của <code>traceroute -n</code> (dòng đầu "traceroute to TÊN (ĐỊA_CHỈ), …" rồi mỗi hop một dòng). Trả <code>{ verdict, lastResponder }</code>, xét theo thứ tự:</p>
<ol>
<li><code>"unreachable"</code> — một hop mang cờ bắt đầu bằng "!" (<code>!H</code>, <code>!N</code>, <code>!X</code>…): một router nói rõ nó không giao được. <code>lastResponder</code> = địa chỉ ở hop đó.</li>
<li><code>"loop"</code> — một địa chỉ đã trả lời ở một hop lại trả lời ở hop sau, với một địa chỉ <b>khác</b> ở giữa.</li>
<li>Hop cuối cùng có trả lời chứa địa chỉ đích: <code>"silent-hop"</code> nếu có hop toàn dấu sao, ngược lại <code>"ok"</code>.</li>
<li>Còn lại <code>"loss-to-end"</code> — gói thử thôi được trả lời và không bao giờ tới đích.</li>
</ol>
<p><code>lastResponder</code> (luật 2–4) = địa chỉ cuối cùng được in trong output, hoặc <code>null</code> nếu không ai trả lời. Thời gian như <code>0.059</code> và chữ <code>ms</code> không phải địa chỉ; một dòng hop có thể hiện nhiều địa chỉ (cân bằng tải). Ví dụ (lab/out/c22-sao):</p>${pre(T_SAO)}<p>⇒ <code>{ verdict: "silent-hop", lastResponder: "203.0.113.10" }</code>. Ca hiện: bốn lượt traceroute thật. Ca ẩn: thêm mười lượt thật (vòng lặp của sự cố A trong Lab 2, <code>!H</code> của nó cho .100, cướp tuyến BGP và rút tuyến, điện thoại 4G, IPv6, Docker Desktop, một lần gọi ngược vào với <code>!N</code>) và một đường cân bằng tải <b>dựng</b>.</p>`,
  dauVao: ['text — the output of traceroute -n (IPv4 or IPv6).', 'text — output của traceroute -n (IPv4 hoặc IPv6).'],
  dauRa: ['{ verdict: "ok" | "silent-hop" | "loop" | "loss-to-end" | "unreachable", lastResponder: string | null }', '{ verdict: "ok" | "silent-hop" | "loop" | "loss-to-end" | "unreachable", lastResponder: chuỗi | null }'],
  goiY: [
    ['Parse first: the target from the header with /\\(([^)]+)\\)/, then for each hop line its number, its addresses (words with three dots, or with ":") and a word starting with "!".', 'Phân tích trước: đích từ dòng đầu bằng /\\(([^)]+)\\)/, rồi với mỗi dòng hop: số thứ tự, các địa chỉ (từ có ba dấu chấm, hoặc có ":") và từ bắt đầu bằng "!".'],
    ['Apply the rules in the given order: the !H case of Lab 2 has the same address on two consecutive hops and must not become a loop.', 'Áp luật đúng thứ tự: ca !H của Lab 2 có cùng địa chỉ ở hai hop liền nhau và không được thành vòng lặp.'],
    ['"Reached" = the target is among the addresses of the last hop that answered — a final "*" after an answer does not matter.', '"Tới đích" = đích nằm trong các địa chỉ của hop cuối có trả lời — một "*" cuối sau câu trả lời không quan trọng.'],
  ],
  loi: [
    ['Calling the trace "broken" at the first line of stars, without looking at the hops after it.', 'Gọi traceroute là "hỏng" ở dòng sao đầu tiên mà không nhìn các hop sau.'],
    ['Taking "0.059" for an address because it contains a dot.', 'Coi "0.059" là địa chỉ vì nó có dấu chấm.'],
    ['Calling any repeated address a loop — consecutive answers from one router followed by !H are not.', 'Gọi mọi địa chỉ lặp là vòng lặp — câu trả lời liền nhau từ một router kèm !H thì không phải.'],
  ],
  gt: ['traceroute gives evidence, not a verdict, and the evidence has a few typical shapes. A flag such as !H or !N is a router stating it cannot deliver — the strongest signal, so it is checked first. Addresses taking turns are the signature of a loop: TTL drains while two routers hand the packet back and forth. If the target answers at the end, every silent hop before it is a router that does not talk about itself, not a fault. Only answers that stop and never come back up to the target describe real loss — and lastResponder then names the place to look, as in the BGP hijack where the trace ends at the ISP.', 'traceroute cho bằng chứng, không cho phán quyết, và bằng chứng có vài hình dạng điển hình. Cờ như !H hay !N là một router tuyên bố nó không giao được — tín hiệu mạnh nhất, nên xét trước. Địa chỉ thay phiên là dấu hiệu của vòng lặp: TTL cạn dần trong khi hai router chuyền gói qua lại. Nếu đích trả lời ở cuối, mọi hop im lặng trước đó là router không nói về mình, không phải lỗi. Chỉ khi câu trả lời dừng hẳn và không bao giờ tới đích mới là mất gói thật — và lastResponder khi đó chỉ ra chỗ cần nhìn, như vụ cướp tuyến BGP khi traceroute dừng ở isp.'],
  kn: ['reading traceroute', 'troubleshooting'],
  tns: [tn('verdict', 'kết luận'), tn('load balancing (ECMP)', 'cân bằng tải trên nhiều đường ngang nhau'), tn('last responder', 'chặng cuối còn trả lời')],
  dau: `/** text: traceroute -n output ⇒ { verdict: 'ok'|'silent-hop'|'loop'|'loss-to-end'|'unreachable', lastResponder } */
function traceVerdict(text) {
  // Write your solution here
  return { verdict: 'ok', lastResponder: null };
}
`,
  giai: '// Reference solution\n' + nguon(traceVerdict),
  cases: [
    { goi: goi('traceVerdict', T_OK), moTa: ['Real: laptop → LabFlow, all four hops answer (c22-trace)', 'Thật: laptop → LabFlow, cả bốn hop trả lời (c22-trace)'] },
    { goi: goi('traceVerdict', T_SAO), moTa: ['Real: silent DC router (c22-sao)', 'Thật: router dc im lặng (c22-sao)'] },
    { goi: goi('traceVerdict', T_VONG), moTa: ['Real: the forgotten /32 (c22-vong)', 'Thật: /32 bị quên (c22-vong)'] },
    { goi: goi('traceVerdict', T_CUOP), moTa: ['Real: during the BGP hijack (c25-laptop-cuop)', 'Thật: lúc bị cướp tuyến BGP (c25-laptop-cuop)'] },
    { goi: goi('traceVerdict', T_A10), an: true },
    { goi: goi('traceVerdict', T_A100), an: true },
    { goi: goi('traceVerdict', T_RUT), an: true },
    { goi: goi('traceVerdict', T_DD), an: true },
    { goi: goi('traceVerdict', T_MOB), an: true },
    { goi: goi('traceVerdict', T_V6), an: true },
    { goi: goi('traceVerdict', T_B), an: true },
    { goi: goi('traceVerdict', T_VAO), an: true },
    { goi: goi('traceVerdict', T_ECMP), an: true, moTa: ['Hidden: a load-balanced hop (constructed)', 'Ẩn: một hop cân bằng tải (dựng)'] },
    { goi: goi('traceVerdict', 'traceroute to 203.0.113.10 (203.0.113.10), 3 hops max, 60 byte packets\n 1  *\n 2  *\n 3  *'), an: true, moTa: ['Hidden: nobody answers (constructed)', 'Ẩn: không ai trả lời (dựng)'] },
  ],
});

export default doiDau({ slug: 'netdev-2-2-dinh-tuyen', ten: '2.2 Routing tables, gateways and traceroute', khoa: KHOA, baiHoc: 'netdev-2-2-dinh-tuyen', de: [E1, E2, E3, E4, E5, E6] });
