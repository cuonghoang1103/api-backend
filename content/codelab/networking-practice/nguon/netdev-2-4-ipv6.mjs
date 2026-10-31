/** Networking for Developers · 2.4 — IPv6: luật viết gọn RFC 5952 (bẫy hai dãy 0 bằng nhau), cỡ /64, link-local EUI-64, NDP thay ARP, không NAT, Happy Eyeballs đo thật, localhost = ::1, ::ffff:; tự viết eui64LinkLocal/solicitedNode, expand/compress, normalizeClientIp. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const S = (tep, lenh) => tr(sauLenh(tep, lenh)).filter((d) => d.trim() && !d.startsWith('reading from file'));
const PY1 = S('c24-dia-chi', 'python3 -c "import ipaddress as i; a =');
const PY2 = S('c24-dia-chi', "python3 -c \"import ipaddress as i; print(i.ip_address('2001:0db8:0000:0000:0001");
const PY3 = S('c24-dia-chi', "python3 -c \"import ipaddress as i; n =");
const ADDR = S('c24-dia-chi', 'ip -br -6 addr show eth0');
const NDP = [...S('c24-ndp', 'tcpdump -n -t -r /tmp/n.pcap'), ...S('c24-ndp', 'tcpdump -n -t -r /tmp/n2.pcap')];
const NEIGH = S('c24-ndp', 'ip -6 neigh show');
if (PY2[0] !== '2001:db8::1:0:0:1' || !ADDR[0].includes('fe80::c0ff:fea8:320a/64') || NDP.length !== 3) throw new Error('2.4: output thật không như mong đợi');

/* ── 1. Viết gọn và viết đầy đủ ── */
const DAY = (s) => [s, s.toUpperCase()];
const E1 = cs({
  ten: 'IPv6 1 — Compress and expand by hand (RFC 5952)', kho: 'EASY', phut: 12, loai: 'table',
  en: `An IPv6 address is 128 bits = 8 groups of 4 hex digits. The one correct short form (RFC 5952): (1) drop the leading zeros of each group; (2) replace the <b>longest</b> run of two or more all-zero groups with <code>::</code> — if two runs are equally long, the <b>first</b> one; only once; a single zero group stays <code>0</code>; (3) lower case. Real checks with Python in the lab (lab/out/c24-dia-chi):${pre([...PY1, ...PY2])}Row 3 is the practice address of the lesson; rows 4–5 and the second table apply the same rules.`,
  vi: `Địa chỉ IPv6 là 128 bit = 8 nhóm, mỗi nhóm 4 chữ số hex. Cách viết gọn đúng duy nhất (RFC 5952): (1) bỏ số 0 đứng đầu mỗi nhóm; (2) thay dãy <b>dài nhất</b> gồm hai nhóm 0 trở lên bằng <code>::</code> — nếu hai dãy dài bằng nhau thì dãy <b>đầu</b>; chỉ một lần; một nhóm 0 đứng riêng vẫn ghi <code>0</code>; (3) chữ thường. Kiểm thật bằng Python trong lab (lab/out/c24-dia-chi):${pre([...PY1, ...PY2])}Dòng 3 là địa chỉ thực hành của bài; dòng 4–5 và bảng thứ hai áp đúng các luật đó.`,
  bang: [
    bang1('b1', ['Compress', 'Viết gọn'], [{ ma: 'x', ten: 'Full form' }, { ma: 'c', ten: 'RFC 5952 form' }], [
      { o: { x: '2001:0db8:000a:0050:0000:0000:0000:0010 (the laptop)' }, a: { c: ['2001:db8:a:50::10'] } },
      { o: { x: '2001:0db8:0000:0000:0001:0000:0000:0001' }, a: { c: ['2001:db8::1:0:0:1'] } },
      { o: { x: '2001:0db8:0000:0000:0000:ff00:0042:8329' }, a: { c: ['2001:db8::ff00:42:8329'] } },
      { o: { x: 'fe80:0000:0000:0000:0000:0000:0000:0001' }, a: { c: ['fe80::1'] } },
      { o: { x: '2001:0db8:0000:0001:0000:0000:0000:0000' }, a: { c: ['2001:db8:0:1::'] } },
    ], ['Row 2 is the trap: two runs of two zero groups (groups 3–4 and 6–7); the first gets ::, the second is written 0:0 — Python printed exactly 2001:db8::1:0:0:1. Row 3: one run of three zeros ⇒ 2001:db8::ff00:42:8329 (0042 → 42). Row 5: the single 0 after db8 is not a run; the run of four at the end becomes a trailing ::.', 'Dòng 2 là bẫy: hai dãy hai nhóm 0 (nhóm 3–4 và 6–7); dãy đầu được ::, dãy sau ghi 0:0 — Python in đúng 2001:db8::1:0:0:1. Dòng 3: một dãy ba nhóm 0 ⇒ 2001:db8::ff00:42:8329 (0042 → 42). Dòng 5: số 0 đơn sau db8 không phải một dãy; dãy bốn nhóm ở cuối thành :: ở cuối.']),
    bang1('b2', ['Expand (8 groups, 4 digits each)', 'Viết đầy đủ (8 nhóm, mỗi nhóm 4 chữ số)'], [{ ma: 'x', ten: 'Short form' }, { ma: 'e', ten: 'Full form' }], [
      { o: { x: '2001:db8:d::10 (LabFlow\'s server)' }, a: { e: DAY('2001:0db8:000d:0000:0000:0000:0000:0010') } },
      { o: { x: 'ff02::1:ff00:11 (from the NDP capture)' }, a: { e: DAY('ff02:0000:0000:0000:0000:0001:ff00:0011') } },
      { o: { x: '::1 (loopback)' }, a: { e: DAY('0000:0000:0000:0000:0000:0000:0000:0001') } },
    ], ['Count the groups you see, and :: stands for the missing ones up to 8: 2001:db8:d::10 shows 4 groups ⇒ :: = 4 zero groups; ff02::1:ff00:11 shows 4 ⇒ 4; ::1 shows 1 ⇒ 7. Then pad every group to 4 digits.', 'Đếm số nhóm nhìn thấy, :: là các nhóm còn thiếu cho đủ 8: 2001:db8:d::10 có 4 nhóm ⇒ :: = 4 nhóm 0; ff02::1:ff00:11 có 4 ⇒ 4; ::1 có 1 ⇒ 7. Rồi đệm mỗi nhóm cho đủ 4 chữ số.']),
  ],
  goiY: [['First drop leading zeros in every group, then look for runs of "0" groups and count their length.', 'Bỏ số 0 đầu ở mọi nhóm trước, rồi tìm các dãy nhóm "0" và đếm độ dài.'], ['To expand: 8 − (groups you can see) = groups hidden by ::.', 'Để viết đầy đủ: 8 − (số nhóm nhìn thấy) = số nhóm :: đang giấu.']],
  loi: [['Putting :: on the second of two equal runs (2001:db8:0:0:1::1).', 'Đặt :: vào dãy thứ hai trong hai dãy bằng nhau (2001:db8:0:0:1::1).'], ['Using :: for a single zero group, or using :: twice in one address.', 'Dùng :: cho một nhóm 0 đơn, hoặc dùng :: hai lần trong một địa chỉ.']],
  tns: [tn('hextet / group', 'nhóm 16 bit', 'Bốn chữ số hex giữa hai dấu hai chấm.'), tn('RFC 5952', 'chuẩn cách viết địa chỉ IPv6'), tn('::', 'một dãy nhóm 0 được viết gọn')],
  kn: ['IPv6 address format'],
});

/* ── 2. Cỡ mạng và các loại địa chỉ ── */
const E2 = cs({
  ten: 'IPv6 2 — /64 networks, global and link-local addresses', kho: 'EASY', phut: 10,
  en: `Real output on the lab laptop (lab/out/c24-dia-chi):${pre(['$ ip -br -6 addr show eth0', ...ADDR, '$ ip -6 route', ...S('c24-dia-chi', 'ip -6 route'), ...PY3])}`,
  vi: `Output thật trên laptop của lab (lab/out/c24-dia-chi):${pre(['$ ip -br -6 addr show eth0', ...ADDR, '$ ip -6 route', ...S('c24-dia-chi', 'ip -6 route'), ...PY3])}`,
  cau: [
    q('c1', ['How many addresses does one ordinary IPv6 network (a /64) hold?', 'Một mạng IPv6 thông thường (một /64) chứa bao nhiêu địa chỉ?'], ['2^64 = 18 446 744 073 709 551 616', '2^32 = 4 294 967 296', '2^128, the whole IPv6 space', '2^16 = 65 536, one per group'], ['128 − 64 = 64 host bits. Python printed 18446744073709551616 — about 18 billion billion, in one LAN.', '128 − 64 = 64 bit host. Python in ra 18446744073709551616 — khoảng 18 tỉ tỉ, trong một LAN.']),
    q('c2', ['The ISP owns 2001:db8:a::/48. How many /64 networks fit in it?', 'Nhà mạng sở hữu 2001:db8:a::/48. Bao nhiêu mạng /64 nằm vừa trong đó?'], ['65 536', '256', '16', '4 294 967 296'], ['64 − 48 = 16 bits to choose the network ⇒ 2^16 = 65 536. A /56 would give 256. The home LAN 2001:db8:a:50::/64 is one of them (the fourth group, 50).', '64 − 48 = 16 bit để chọn mạng ⇒ 2^16 = 65 536. Một /56 cho 256. LAN của nhà 2001:db8:a:50::/64 là một trong số đó (nhóm thứ tư, 50).']),
    q('c3', ['The card has 2001:db8:a:50::10 and fe80::c0ff:fea8:320a. What is the second one for?', 'Card có 2001:db8:a:50::10 và fe80::c0ff:fea8:320a. Địa chỉ thứ hai để làm gì?'], ['Link-local: valid only on this link, every IPv6 interface has one', 'A backup global address used when the first one stops working', 'A private address, like 192.168.x.x, used behind NAT', 'The address of the home router, copied from the route'], ['fe80::/10 addresses never cross a router. NDP and router advertisements use them; the BGP session in lesson 2.5 even shows a link-local next hop.', 'Địa chỉ fe80::/10 không bao giờ vượt router. NDP và quảng cáo router dùng chúng; phiên BGP ở bài 2.5 còn hiện chặng kế là một địa chỉ link-local.']),
    q('c4', ['How did the laptop learn its default route "via 2001:db8:a:50::1"?', 'Laptop học tuyến mặc định "via 2001:db8:a:50::1" bằng cách nào?'], ['From Router Advertisements (or it was configured, as in the lab)', 'From ARP replies of the router on the home LAN', 'From the DNS server, which also hands out gateways', 'From BGP, which runs on every IPv6 laptop'], ['IPv6 routers announce the prefix and themselves with ICMPv6 Router Advertisements; devices build their own address (SLAAC) or ask DHCPv6.', 'Router IPv6 tự quảng bá prefix và chính mình bằng ICMPv6 Router Advertisement; thiết bị tự dựng địa chỉ (SLAAC) hoặc hỏi DHCPv6.']),
    q('c5', ['LabFlow stores client IPs in a VARCHAR(15) column. What breaks with IPv6?', 'LabFlow lưu IP khách trong cột VARCHAR(15). Gì sẽ hỏng với IPv6?'], ['Addresses are cut: text forms can be up to 45 characters', 'Nothing: IPv6 addresses are shorter than IPv4 ones', 'Only link-local addresses, which servers never see', 'The column works, but sorting by address is slower'], ['15 characters fit 255.255.255.255. IPv6 text is up to 39 characters (45 with an IPv4 tail like ::ffff:198.51.100.2). Use an inet type or text of 45.', '15 ký tự vừa 255.255.255.255. IPv6 dạng chữ dài tới 39 ký tự (45 nếu có đuôi IPv4 như ::ffff:198.51.100.2). Dùng kiểu inet hoặc chuỗi 45.']),
    q('c6', ['Why does the course use 2001:db8:… for every IPv6 address?', 'Vì sao khoá dùng 2001:db8:… cho mọi địa chỉ IPv6?'], ['2001:db8::/32 is reserved for documentation, like 203.0.113.0/24', 'It is the range Vietnamese ISPs give to home customers', 'It is the IPv6 loopback range, so it never leaves the lab', 'It is a private range, like 10.0.0.0/8 in IPv4'], ['RFC 3849 reserves 2001:db8::/32 for examples, so the lab never touches anyone\'s real network.', 'RFC 3849 dành 2001:db8::/32 cho ví dụ, nên lab không bao giờ đụng mạng thật của ai.']),
  ],
  goiY: [['Size of a /p in IPv6 = 2^(128 − p) addresses; number of /64s in a /p = 2^(64 − p).', 'Cỡ của một /p trong IPv6 = 2^(128 − p) địa chỉ; số /64 trong một /p = 2^(64 − p).'], ['fe80:: = link-local, 2000::/3 (2xxx, 3xxx) = global, ::1 = loopback.', 'fe80:: = link-local, 2000::/3 (2xxx, 3xxx) = toàn cầu, ::1 = loopback.']],
  loi: [['Planning LAN subnets smaller than /64 "to save addresses": SLAAC needs a /64.', 'Chia LAN nhỏ hơn /64 "cho đỡ phí địa chỉ": SLAAC cần một /64.'], ['Thinking the fe80 address is a second public address.', 'Nghĩ địa chỉ fe80 là địa chỉ công cộng thứ hai.']],
  tns: [tn('global unicast', 'địa chỉ toàn cầu'), tn('link-local', 'địa chỉ nội liên kết', 'fe80::/10, chỉ dùng trên một đường truyền.'), tn('Router Advertisement', 'quảng cáo router'), tn('SLAAC', 'tự cấu hình địa chỉ không trạng thái')],
  kn: ['IPv6 addressing'],
});

/* ── 3. EUI-64 và NDP ── */
const E3 = cs({
  ten: 'IPv6 3 — EUI-64 link-local and Neighbor Discovery', kho: 'MEDIUM', phut: 14,
  en: `The laptop's MAC is <code>02:00:c0:a8:32:0a</code> and its link-local address is <code>fe80::c0ff:fea8:320a</code>. Then it pinged the phone 2001:db8:a:50::11 (lab/out/c24-ndp):${pre(['$ tcpdump -n -t -r /tmp/n.pcap   # on the laptop', ...S('c24-ndp', 'tcpdump -n -t -r /tmp/n.pcap'), '$ tcpdump -n -t -r /tmp/n2.pcap  # on the phone', ...S('c24-ndp', 'tcpdump -n -t -r /tmp/n2.pcap'), '$ ip -6 neigh show 2001:db8:a:50::11', ...NEIGH])}`,
  vi: `MAC của laptop là <code>02:00:c0:a8:32:0a</code> và địa chỉ link-local của nó là <code>fe80::c0ff:fea8:320a</code>. Rồi nó ping điện thoại 2001:db8:a:50::11 (lab/out/c24-ndp):${pre(['$ tcpdump -n -t -r /tmp/n.pcap   # trên laptop', ...S('c24-ndp', 'tcpdump -n -t -r /tmp/n.pcap'), '$ tcpdump -n -t -r /tmp/n2.pcap  # trên điện thoại', ...S('c24-ndp', 'tcpdump -n -t -r /tmp/n2.pcap'), '$ ip -6 neigh show 2001:db8:a:50::11', ...NEIGH])}`,
  cau: [
    q('c1', ['How is fe80::c0ff:fea8:320a built from 02:00:c0:a8:32:0a?', 'fe80::c0ff:fea8:320a được dựng từ 02:00:c0:a8:32:0a thế nào?'], ['Split the MAC in half, insert ff:fe, flip bit 1 of the first byte (02 → 00)', 'Copy the MAC and add fe80:: in front without any change', 'Take the last four bytes of the MAC and repeat them twice', 'Hash the MAC with SHA-256 and keep the first 64 bits'], ['02:00:c0 | ff:fe | a8:32:0a, then 02 XOR 02 = 00 ⇒ 0000:c0ff:fea8:320a. The first group is 0, so RFC 5952 absorbs it into the :: after fe80.', '02:00:c0 | ff:fe | a8:32:0a, rồi 02 XOR 02 = 00 ⇒ 0000:c0ff:fea8:320a. Nhóm đầu là 0, nên RFC 5952 gộp nó vào :: sau fe80.']),
    q('c2', ['Why are real laptops and phones usually NOT using this MAC-based address for the Internet?', 'Vì sao laptop và điện thoại thật thường KHÔNG dùng địa chỉ dựng từ MAC này ra Internet?'], ['It would reveal the hardware and follow the device everywhere — they use random addresses', 'It is too long for most websites to store in their logs', 'MAC-based addresses are only allowed inside datacenters', 'Routers drop every packet whose address contains ff:fe'], ['Privacy (temporary) addresses, RFC 8981, are random and change over time. The lab uses EUI-64 so you can check the rule.', 'Địa chỉ riêng tư (tạm thời), RFC 8981, là ngẫu nhiên và đổi theo thời gian. Lab dùng EUI-64 để bạn kiểm được luật.']),
    q('c3', ['The neighbor solicitation for 2001:db8:a:50::11 was sent to ff02::1:ff00:11. That address is …', 'Neighbor solicitation cho 2001:db8:a:50::11 được gửi tới ff02::1:ff00:11. Địa chỉ đó là …'], ['the solicited-node multicast group: ff02::1:ff + the last 24 bits of the target', 'the broadcast address of the IPv6 LAN, received by every device', 'the link-local address of the phone, built from its MAC', 'the address of the home router, which answers for the LAN'], ['IPv6 has no broadcast. The question goes to a group that only machines whose address ends in 00:0011 join — normally just the target.', 'IPv6 không có broadcast. Câu hỏi gửi tới một nhóm mà chỉ máy có địa chỉ kết thúc bằng 00:0011 tham gia — thường chỉ có đích.']),
    q('c4', ['What would the solicited-node address be for the laptop itself, 2001:db8:a:50::10?', 'Địa chỉ solicited-node của chính laptop, 2001:db8:a:50::10, là gì?'], ['ff02::1:ff00:10', 'ff02::1:ff50:10', 'ff02::1:ffa:50', 'ff02::10'], ['The last 24 bits of …:0000:0010 are 00 0010 ⇒ ff02::1:ff00:10. (Computed by the rule, not captured.)', '24 bit cuối của …:0000:0010 là 00 0010 ⇒ ff02::1:ff00:10. (Tính theo luật, không bắt gói.)']),
    q('c5', ['The phone answered with a neighbor advertisement sent straight to the laptop. What is the ARP equivalent?', 'Điện thoại trả lời bằng neighbor advertisement gửi thẳng tới laptop. Tương đương trong ARP là gì?'], ['The ARP reply "is-at", sent by unicast to whoever asked', 'The ARP request "who-has", sent to everyone', 'A gratuitous ARP announcing a new address', 'An ICMP echo reply to the ping'], ['Same question, same answer, different protocol: NDP is ICMPv6. The result lands in ip -6 neigh, with the MAC 02:00:c0:a8:32:0b and the REACHABLE state of lesson 1.4.', 'Cùng câu hỏi, cùng câu trả lời, khác giao thức: NDP là ICMPv6. Kết quả nằm trong ip -6 neigh, với MAC 02:00:c0:a8:32:0b và trạng thái REACHABLE của bài 1.4.']),
  ],
  goiY: [['EUI-64: MAC aa:bb:cc:dd:ee:ff ⇒ (aa XOR 02)bb:ccff:fedd:eeff.', 'EUI-64: MAC aa:bb:cc:dd:ee:ff ⇒ (aa XOR 02)bb:ccff:fedd:eeff.'], ['Solicited-node: ff02::1:ff + the last 6 hex digits of the target address.', 'Solicited-node: ff02::1:ff + 6 chữ số hex cuối của địa chỉ đích.']],
  loi: [['Writing fe80::0:c0ff:fea8:320a — the zero group must be absorbed into ::.', 'Viết fe80::0:c0ff:fea8:320a — nhóm 0 phải được gộp vào ::.'], ['Forgetting to flip the universal/local bit (keeping 02 instead of 00).', 'Quên lật bit universal/local (giữ 02 thay vì 00).']],
  tns: [tn('EUI-64', 'cách dựng ID giao diện từ MAC'), tn('NDP', 'giao thức khám phá hàng xóm'), tn('solicited-node multicast', 'nhóm multicast theo địa chỉ cần hỏi'), tn('neighbor solicitation / advertisement', 'câu hỏi / câu trả lời hàng xóm')],
  kn: ['NDP', 'EUI-64'],
});

/* ── 4. Không NAT, Happy Eyeballs, localhost, ::ffff: ── */
const HAPPY = S('c24-happy', 'curl -s -o /dev/null -w');
const H6 = S('c24-happy', 'curl -6');
const NODE = S('c24-happy', 'node -e');
const NODE0 = S('c24-happy', 'node --no-network-family-autoselection');
const MD = S('c24-mac-dinh', 'node -p');
const SYN = S('c24-mac-dinh', 'sysctl net.ipv4.tcp_syn_retries');
const LH = [...S('c24-localhost', 'getent ahosts localhost').slice(0, 1), ...S('c24-localhost', 'getent ahosts localhost').slice(3, 4)];
const LH_SS = S('c24-localhost', "ss -tln 'sport = :5000'");
const LH_NO = S('c24-localhost', "node --no-network-family-autoselection -e \"fetch('http://localhost:5000/')");
const NGHE = S('c24-goi-nghe', 'curl -s http://203.0.113.10:3000/');
const DS4 = S('c24-goi-nghe', 'curl -s http://203.0.113.10:3001/');
const DS6 = S('c24-goi-nghe', 'curl -s "http://[2001:db8:d::10]:3001/"');
const V6REF = S('c24-goi-nghe', 'curl -sS -m 3 "http://[2001:db8:d::10]:3000/"');
const E4 = cs({
  ten: 'IPv6 4 — Happy Eyeballs, localhost and ::ffff: (measured)', kho: 'MEDIUM', phut: 16,
  en: `IPv6 to the datacenter was broken "silently" at the ISP (packets dropped, no error). Real measurements on the laptop and the server (lab/out/c24-happy, c24-mac-dinh, c24-localhost, c24-goi-nghe):${pre(['$ curl -s -o /dev/null -w \'connected to %{remote_ip} after %{time_connect} s\\n\' http://labflow.test/', ...HAPPY, '$ curl -6 … -m 5 http://labflow.test/', ...H6, '$ node -e "… fetch(\'http://labflow.test/\') …"', ...NODE, '$ node --no-network-family-autoselection -e "… AbortSignal.timeout(8000) …"', ...NODE0, '$ node -p "… getDefaultAutoSelectFamilyAttemptTimeout() …"', ...MD, ...SYN, '', '# localhost (dev server on 127.0.0.1:5000)', '$ getent ahosts localhost', ...LH, ...LH_SS, '$ node --no-network-family-autoselection -e "fetch(\'http://localhost:5000/\') …"', ...LH_NO, '', '# server: app on 0.0.0.0:3000 and app on :::3001', ...NGHE, ...V6REF, ...DS4, ...DS6])}`,
  vi: `IPv6 tới trung tâm dữ liệu bị hỏng "lặng lẽ" ở nhà mạng (gói bị vứt, không báo lỗi). Số đo thật trên laptop và máy chủ (lab/out/c24-happy, c24-mac-dinh, c24-localhost, c24-goi-nghe):${pre(['$ curl -s -o /dev/null -w \'connected to %{remote_ip} after %{time_connect} s\\n\' http://labflow.test/', ...HAPPY, '$ curl -6 … -m 5 http://labflow.test/', ...H6, '$ node -e "… fetch(\'http://labflow.test/\') …"', ...NODE, '$ node --no-network-family-autoselection -e "… AbortSignal.timeout(8000) …"', ...NODE0, '$ node -p "… getDefaultAutoSelectFamilyAttemptTimeout() …"', ...MD, ...SYN, '', '# localhost (server phát triển trên 127.0.0.1:5000)', '$ getent ahosts localhost', ...LH, ...LH_SS, '$ node --no-network-family-autoselection -e "fetch(\'http://localhost:5000/\') …"', ...LH_NO, '', '# máy chủ: app trên 0.0.0.0:3000 và app trên :::3001', ...NGHE, ...V6REF, ...DS4, ...DS6])}`,
  cau: [
    q('c1', ['curl connected over IPv4 after 0.210868 s. Where do those ~0.2 s come from?', 'curl kết nối qua IPv4 sau 0.210868 s. Khoảng ~0,2 s đó từ đâu ra?'], ['curl\'s Happy Eyeballs delay: it tries IPv6, waits 200 ms, then races IPv4', 'The IPv4 path is 200 ms longer than the IPv6 path in this lab', 'DNS took 200 ms to answer the A record after the AAAA record', 'The TCP handshake over IPv4 needs two extra round trips'], ['RFC 8305: start the preferred family, start the other after a short delay, keep the first that connects. Broken IPv6 costs a fifth of a second, not a failure.', 'RFC 8305: bắt đầu họ địa chỉ ưu tiên, sau một khoảng ngắn bắt đầu họ kia, giữ cái kết nối trước. IPv6 hỏng chỉ tốn một phần năm giây, không thành lỗi.']),
    q('c2', ['Node 22 fetch fell back after 324 ms. Which setting explains it?', 'fetch của Node 22 chuyển sang IPv4 sau 324 ms. Thiết lập nào giải thích?'], ['autoSelectFamilyAttemptTimeout = 250 ms (Happy Eyeballs, on by default since Node 20)', 'tcp_syn_retries = 6, which retries the SYN after 324 ms', 'The AbortSignal timeout of 8000 ms divided by the number of addresses', 'The 5-second limit of curl, which Node also respects'], ['The measured 324 ms is roughly the 250 ms attempt timeout plus the rest of the work (DNS lookup, the IPv4 connection, the HTTP request and response).', '324 ms đo được xấp xỉ 250 ms chờ mỗi lần thử cộng phần việc còn lại (tra DNS, kết nối IPv4, request và response HTTP).']),
    q('c3', ['With Happy Eyeballs disabled, Node was still waiting at 8 s. How long would the kernel keep trying the SYN?', 'Khi tắt Happy Eyeballs, Node vẫn còn chờ ở giây thứ 8. Nhân sẽ thử lại SYN bao lâu?'], ['About 127 s (computed: 1 + 2 + 4 + 8 + 16 + 32 + 64)', 'About 8 s, which is why the request was aborted there', 'About 6 s: one second for each of the 6 retries', 'Forever, until the user closes the program'], ['tcp_syn_retries = 6 with doubling waits gives 127 s — computed from the setting, not measured (we aborted at 8 s). Old libraries that connect to the first address only "hang for two minutes".', 'tcp_syn_retries = 6 với thời gian chờ nhân đôi cho 127 s — tính từ thiết lập, không đo (ta huỷ ở 8 s). Thư viện cũ chỉ nối tới địa chỉ đầu sẽ "treo hai phút".']),
    q('c4', ['The dev server listens on 127.0.0.1:5000 only. Why does a client without auto-selection get ECONNREFUSED ::1:5000?', 'Server phát triển chỉ nghe 127.0.0.1:5000. Vì sao một client không có tự chọn họ địa chỉ nhận ECONNREFUSED ::1:5000?'], ['localhost resolves to ::1 first, and nothing listens on ::1', 'Node 22 removed support for 127.0.0.1 in fetch', 'The server refuses clients that come from IPv6 addresses', 'Port 5000 is reserved on IPv6, so the kernel refuses it'], ['getent lists ::1 before 127.0.0.1; since Node 17 that order is kept. Fixes: listen on :: (both families) or write 127.0.0.1 in the client.', 'getent liệt kê ::1 trước 127.0.0.1; từ Node 17 thứ tự đó được giữ nguyên. Cách sửa: nghe trên :: (cả hai họ) hoặc ghi 127.0.0.1 trong client.']),
    q('c5', ['The app on 0.0.0.0:3000 answers IPv4 but curl over IPv6 gets "Could not connect". Why?', 'App trên 0.0.0.0:3000 trả lời IPv4 nhưng curl qua IPv6 nhận "Could not connect". Vì sao?'], ['0.0.0.0 means "every IPv4 address" — no socket listens on IPv6', 'The ISP still drops IPv6 to the datacenter after the fix', 'Port 3000 is blocked by the server\'s IPv6 firewall', 'IPv6 clients must use port 3001, the IPv6 version of 3000'], ['ss shows 0.0.0.0:3000 (IPv4 only) and *:3001 (dual-stack). Invisible in testing if your own network is IPv4-only.', 'ss hiện 0.0.0.0:3000 (chỉ IPv4) và *:3001 (cả hai họ). Không thấy khi thử nếu mạng của bạn chỉ có IPv4.']),
    q('c6', ['The dual-stack app logs the IPv4 client as ::ffff:198.51.100.2. An allow-list contains "198.51.100.2". What happens?', 'App hai họ ghi khách IPv4 là ::ffff:198.51.100.2. Danh sách cho phép chứa "198.51.100.2". Chuyện gì xảy ra?'], ['A plain string comparison fails: normalise by stripping ::ffff: first', 'It matches, because ::ffff: is ignored by every comparison', 'The client is blocked, because mapped addresses are spoofed', 'It matches only if the allow-list is written in IPv6 form'], ['::ffff:a.b.c.d is an IPv4-mapped IPv6 address — how a dual-stack socket shows an IPv4 peer. Normalise before comparing, logging or rate limiting (exercise 7).', '::ffff:a.b.c.d là địa chỉ IPv6 ánh xạ IPv4 — cách socket hai họ hiển thị một khách IPv4. Chuẩn hoá trước khi so, ghi log hay giới hạn tần suất (bài 7).']),
  ],
  goiY: [['Happy Eyeballs lives in the program\'s library (libcurl, Node\'s net), not in the kernel — that is why tools differ.', 'Happy Eyeballs nằm trong thư viện của chương trình (libcurl, net của Node), không nằm trong nhân — vì thế các công cụ khác nhau.'], ['Which address does each socket listen on: 127.0.0.1, 0.0.0.0, ::1 or :: (shown as * by ss)?', 'Mỗi socket nghe trên địa chỉ nào: 127.0.0.1, 0.0.0.0, ::1 hay :: (ss hiện là *)?']],
  loi: [['Reporting "IPv6 is fine" because the page loads — it loads 0.2 s later through IPv4.', 'Báo "IPv6 ổn" vì trang vẫn mở — nó mở chậm 0,2 s qua IPv4.'], ['Fixing ECONNREFUSED ::1 by disabling IPv6 on the machine instead of listening on ::.', 'Sửa ECONNREFUSED ::1 bằng cách tắt IPv6 trên máy thay vì nghe trên ::.']],
  tns: [tn('dual-stack', 'chạy song song IPv4 và IPv6'), tn('Happy Eyeballs', 'chạy đua IPv6/IPv4', 'RFC 8305.'), tn('IPv4-mapped address', 'địa chỉ IPv6 ánh xạ IPv4', '::ffff:a.b.c.d.'), tn('ECONNREFUSED', 'kết nối bị từ chối')],
  kn: ['dual-stack', 'Happy Eyeballs'],
});

/* ── 5–7. Tự viết ── */
function expand(addr) {
  var s = String(addr).toLowerCase();
  var halves = s.split('::');
  if (halves.length > 2) throw new RangeError('more than one :: in ' + addr);
  function groups(x) { return x === '' ? [] : x.split(':'); }
  var head = groups(halves[0]), tail = halves.length === 2 ? groups(halves[1]) : [];
  var missing = 8 - head.length - tail.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) throw new RangeError('an IPv6 address has 8 groups: ' + addr);
  var all = head.concat(new Array(halves.length === 2 ? missing : 0).fill('0'), tail);
  return all.map(function (g) {
    if (!/^[0-9a-f]{1,4}$/.test(g)) throw new RangeError('bad group "' + g + '" in ' + addr);
    return ('0000' + g).slice(-4);
  }).join(':');
}

function compress(addr) {
  var g = expand(addr).split(':').map(function (x) { return parseInt(x, 16).toString(16); });   // 1. no leading zeros
  var bestStart = -1, bestLen = 0;
  for (var i = 0; i < 8;) {                                   // 2. the longest run of "0" groups; the first one wins a tie
    if (g[i] !== '0') { i++; continue; }
    var j = i;
    while (j < 8 && g[j] === '0') j++;
    if (j - i > bestLen) { bestStart = i; bestLen = j - i; }
    i = j;
  }
  if (bestLen < 2) return g.join(':');                       // a single 0 group is never replaced by ::
  return g.slice(0, bestStart).join(':') + '::' + g.slice(bestStart + bestLen).join(':');
}

function eui64LinkLocal(mac) {
  var b = String(mac).toLowerCase().split(/[:-]/);
  if (b.length !== 6 || b.some(function (x) { return !/^[0-9a-f]{2}$/.test(x); })) throw new RangeError('a MAC has 6 bytes: ' + mac);
  b = b.map(function (x) { return parseInt(x, 16); });
  var id = [b[0] ^ 2, b[1], b[2], 0xff, 0xfe, b[3], b[4], b[5]];   // flip the universal/local bit, insert ff:fe in the middle
  var groups = ['fe80', '0', '0', '0'];
  for (var i = 0; i < 8; i += 2) groups.push((id[i] * 256 + id[i + 1]).toString(16));
  return compress(groups.join(':'));                         // fe80:0:0:0:0:c0ff:… ⇒ the zero group joins the ::
}

function solicitedNode(addr) {
  var hex = expand(addr).replace(/:/g, '');                  // 32 hex digits
  var last6 = hex.slice(26);                                 // the last 24 bits
  return compress('ff02:0:0:0:0:1:ff' + last6.slice(0, 2) + ':' + last6.slice(2));
}

function normalizeClientIp(s) {
  var x = String(s == null ? '' : s).trim();
  var m = /^\[([^\]]+)\](?::\d+)?$/.exec(x);                 // [2001:db8::1]:443 ⇒ 2001:db8::1
  if (m) x = m[1];
  var v4 = /^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/.exec(x);   // 198.51.100.2 or 198.51.100.2:41122
  function okV4(a) { return a.split('.').every(function (o) { return Number(o) <= 255; }); }
  if (v4) return okV4(v4[1]) ? v4[1] : null;
  x = x.replace(/%.*$/, '');                                 // zone index: fe80::1%eth0
  var tailV4 = /^(.*:)(\d{1,3}(?:\.\d{1,3}){3})$/.exec(x);   // ::ffff:198.51.100.2 ⇒ ::ffff:c633:6402
  if (tailV4) {
    if (!okV4(tailV4[2])) return null;
    var o = tailV4[2].split('.').map(Number);
    x = tailV4[1] + (o[0] * 256 + o[1]).toString(16) + ':' + (o[2] * 256 + o[3]).toString(16);
  }
  var full;
  try { full = expand(x); } catch (e) { return null; }       // not an address at all
  var g = full.split(':');
  if (g.slice(0, 5).join('') === '00000000000000000000' && g[5] === 'ffff') {   // ::ffff:a.b.c.d = an IPv4 client
    var hi = parseInt(g[6], 16), lo = parseInt(g[7], 16);
    return [hi >> 8, hi & 255, lo >> 8, lo & 255].join('.');
  }
  return compress(full);
}

const E5 = jsBai({
  ten: 'IPv6 5 — Write eui64LinkLocal(mac) and solicitedNode(addr)', kho: 'MEDIUM', phut: 25,
  en: `<p>Two small address builders. Real lab data: the laptop's MAC <code>02:00:c0:a8:32:0a</code> and its card (lab/out/c24-dia-chi):</p>${pre(ADDR)}<p>and the neighbor solicitation for the phone (lab/out/c24-ndp):</p>${pre(NDP.slice(0, 1))}<ul>
<li><code>eui64LinkLocal(mac)</code> — MAC with ":" or "-" in any case ⇒ the EUI-64 link-local address: flip bit 1 (value 2) of the first byte, insert <code>ff:fe</code> between the third and fourth byte, put <code>fe80::</code> in front, and write the result in <b>RFC 5952</b> form (a zero group right after fe80 joins the ::). Throw <code>RangeError</code> if it is not 6 bytes.</li>
<li><code>solicitedNode(addr)</code> — any IPv6 address (short or full) ⇒ <code>ff02::1:ff</code> followed by its last 24 bits, RFC 5952 form.</li>
</ul><p>Hidden cases: the phone's MAC <code>02:00:c0:a8:32:0b</code> (seen in ip -6 neigh), the DC router's MAC <code>02:00:c0:00:02:03</code> — its result must equal the BGP next hop <code>fe80::c0ff:fe00:203</code> printed in lesson 2.5 —, a manufacturer MAC written with dashes in upper case, and broken input.</p>`,
  vi: `<p>Hai hàm dựng địa chỉ nhỏ. Dữ liệu thật của lab: MAC của laptop <code>02:00:c0:a8:32:0a</code> và card của nó (lab/out/c24-dia-chi):</p>${pre(ADDR)}<p>và neighbor solicitation hỏi điện thoại (lab/out/c24-ndp):</p>${pre(NDP.slice(0, 1))}<ul>
<li><code>eui64LinkLocal(mac)</code> — MAC có ":" hoặc "-", hoa hay thường ⇒ địa chỉ link-local EUI-64: lật bit 1 (giá trị 2) của byte đầu, chèn <code>ff:fe</code> giữa byte thứ ba và thứ tư, đặt <code>fe80::</code> phía trước, và viết kết quả theo dạng <b>RFC 5952</b> (nhóm 0 ngay sau fe80 nhập vào ::). Ném <code>RangeError</code> nếu không đủ 6 byte.</li>
<li><code>solicitedNode(addr)</code> — địa chỉ IPv6 bất kỳ (gọn hay đầy đủ) ⇒ <code>ff02::1:ff</code> theo sau là 24 bit cuối của nó, dạng RFC 5952.</li>
</ul><p>Ca ẩn: MAC của điện thoại <code>02:00:c0:a8:32:0b</code> (thấy trong ip -6 neigh), MAC router dc <code>02:00:c0:00:02:03</code> — kết quả phải bằng chặng kế BGP <code>fe80::c0ff:fe00:203</code> in ở bài 2.5 —, một MAC của nhà sản xuất viết bằng gạch ngang chữ hoa, và đầu vào hỏng.</p>`,
  yc: [['Return strings; do not print them.', 'Trả về chuỗi, đừng in ra.'], ['Throw RangeError for a MAC that is not 6 bytes.', 'Ném RangeError cho MAC không đủ 6 byte.']],
  dauVao: ['mac — "02:00:c0:a8:32:0a" or "00-1A-2B-3C-4D-5E"; addr — an IPv6 address.', 'mac — "02:00:c0:a8:32:0a" hoặc "00-1A-2B-3C-4D-5E"; addr — một địa chỉ IPv6.'],
  dauRa: ['An IPv6 address string in RFC 5952 form.', 'Chuỗi địa chỉ IPv6 dạng RFC 5952.'],
  goiY: [
    ['Bytes b0…b5 ⇒ groups (b0 ^ 2)·256 + b1, b2·256 + 0xff, 0xfe·256 + b3, b4·256 + b5 — written in hex without leading zeros.', 'Byte b0…b5 ⇒ các nhóm (b0 ^ 2)·256 + b1, b2·256 + 0xff, 0xfe·256 + b3, b4·256 + b5 — viết hex không có số 0 đầu.'],
    ['For the laptop the first group is 0x0000: fe80:0:0:0:0:c0ff:fea8:320a ⇒ fe80::c0ff:fea8:320a. A tiny "longest zero run" helper solves both functions.', 'Với laptop nhóm đầu là 0x0000: fe80:0:0:0:0:c0ff:fea8:320a ⇒ fe80::c0ff:fea8:320a. Một hàm nhỏ "dãy 0 dài nhất" giải được cả hai hàm.'],
    ['solicitedNode: expand the address to 32 hex digits, take the last 6.', 'solicitedNode: viết đầy đủ địa chỉ thành 32 chữ số hex, lấy 6 chữ số cuối.'],
  ],
  loi: [
    ['Returning fe80::0:c0ff:fea8:320a (the zero group left outside the ::).', 'Trả fe80::0:c0ff:fea8:320a (nhóm 0 bị để ngoài ::).'],
    ['Setting the bit instead of flipping it: 00:1a:… must become 02:1a:…, and 02:00:… must become 00:00:….', 'Bật bit thay vì lật bit: 00:1a:… phải thành 02:1a:…, và 02:00:… phải thành 00:00:….'],
    ['Taking the last 24 bits from the short form ("::11" has fewer digits than a full address).', 'Lấy 24 bit cuối từ dạng gọn ("::11" có ít chữ số hơn địa chỉ đầy đủ).'],
  ],
  gt: ['Both are pure bit layouts. EUI-64 stretches the 48-bit MAC to a 64-bit interface identifier with ff:fe in the middle and inverts the universal/local bit (RFC 4291 appendix A), which is why the lab\'s locally administered 02:… becomes 00:…. The solicited-node group keeps only the last 24 bits, so one multicast group usually contains a single machine — NDP\'s replacement for broadcast. Writing the results in RFC 5952 form is what makes them equal to what ip, tcpdump and FRR print: the DC router\'s MAC gives exactly the link-local next hop of the BGP table.', 'Cả hai đều là cách xếp bit. EUI-64 kéo MAC 48 bit thành ID giao diện 64 bit với ff:fe ở giữa và đảo bit universal/local (RFC 4291 phụ lục A), vì thế 02:… do quản trị đặt của lab thành 00:…. Nhóm solicited-node chỉ giữ 24 bit cuối, nên một nhóm multicast thường chỉ có một máy — thứ NDP dùng thay broadcast. Viết kết quả theo RFC 5952 là điều làm chúng bằng đúng thứ ip, tcpdump và FRR in ra: MAC của router dc cho đúng chặng kế link-local trong bảng BGP.'],
  kn: ['EUI-64', 'solicited-node multicast'],
  tns: [tn('interface identifier', 'ID giao diện', '64 bit cuối của một địa chỉ IPv6.'), tn('XOR', 'phép lật bit'), tn('universal/local bit', 'bit toàn cầu/cục bộ của MAC')],
  dau: `/** "02:00:c0:a8:32:0a" ⇒ "fe80::c0ff:fea8:320a" */
function eui64LinkLocal(mac) {
  // Write your solution here
  return 'fe80::' + mac;
}

/** "2001:db8:a:50::11" ⇒ "ff02::1:ff00:11" */
function solicitedNode(addr) {
  // Write your solution here
  return 'ff02::1';
}
`,
  giai: '// Reference solution (expand and compress are helpers — exercise 6 asks for them)\n' + nguon(expand, compress, eui64LinkLocal, solicitedNode),
  cases: [
    { goi: goi('eui64LinkLocal', '02:00:c0:a8:32:0a'), moTa: ['The laptop: 02:00:c0:a8:32:0a ⇒ the real fe80 address', 'Laptop: 02:00:c0:a8:32:0a ⇒ địa chỉ fe80 thật'] },
    { goi: goi('solicitedNode', '2001:db8:a:50::11'), moTa: ['The phone ⇒ the group in the real capture', 'Điện thoại ⇒ nhóm trong bản bắt thật'] },
    { goi: goi('eui64LinkLocal', '02:00:c0:a8:32:0b'), an: true },
    { goi: goi('eui64LinkLocal', '02:00:c0:00:02:03'), an: true, moTa: ['Hidden: the DC router ⇒ the BGP next hop of lesson 2.5', 'Ẩn: router dc ⇒ chặng kế BGP của bài 2.5'] },
    { goi: goi('eui64LinkLocal', '00-1A-2B-3C-4D-5E'), an: true },
    { goi: goi('eui64LinkLocal', 'a4:83:e7:12:34:56'), an: true },
    { goi: goi('solicitedNode', '2001:0db8:000a:0050:0000:0000:0000:0010'), an: true },
    { goi: goi('solicitedNode', 'fe80::c0ff:fea8:320a'), an: true },
    { goi: goi('solicitedNode', '2001:db8::ff00:42:8329'), an: true },
    { goi: goi('eui64LinkLocal', '02:00:c0:a8:32'), nem: 'RangeError', an: true },
  ],
});

const E6 = jsBai({
  ten: 'IPv6 6 — Write expand(addr) and compress(addr) exactly per RFC 5952', kho: 'HARD', phut: 35,
  en: `<p>Python's <code>ipaddress</code> did it for us in the lab (lab/out/c24-dia-chi):</p>${pre([...PY1, ...PY2])}<p>Now write both directions:</p>
<ul>
<li><code>expand(addr)</code> ⇒ 8 groups of exactly 4 lower-case hex digits, e.g. <code>2001:0db8:000a:0050:0000:0000:0000:0010</code>.</li>
<li><code>compress(addr)</code> ⇒ the RFC 5952 form: no leading zeros; the longest run of <b>two or more</b> zero groups becomes <code>::</code> (equal runs ⇒ the first one); a lone zero group stays <code>0</code>; lower case. <code>::</code> may be at the start (<code>::1</code>), the end (<code>2001:db8:0:1::</code>) or be the whole address (<code>::</code>).</li>
<li>Both accept any valid form (short, full, upper case) and throw <code>RangeError</code> for an invalid one: two <code>::</code>, a group longer than 4 hex digits or with a non-hex character, too many or too few groups.</li>
</ul><p>(This exercise ignores the optional mixed form with a dotted IPv4 tail — exercise 7 handles <code>::ffff:</code>.) Hidden cases include two runs of equal length, a longer second run, a lone zero, all zeros, upper case, and four kinds of broken input.</p>`,
  vi: `<p>Trong lab, <code>ipaddress</code> của Python đã làm hộ ta (lab/out/c24-dia-chi):</p>${pre([...PY1, ...PY2])}<p>Giờ hãy tự viết cả hai chiều:</p>
<ul>
<li><code>expand(addr)</code> ⇒ 8 nhóm, mỗi nhóm đúng 4 chữ số hex chữ thường, vd <code>2001:0db8:000a:0050:0000:0000:0000:0010</code>.</li>
<li><code>compress(addr)</code> ⇒ dạng RFC 5952: không có số 0 đầu; dãy dài nhất gồm <b>hai nhóm 0 trở lên</b> thành <code>::</code> (bằng nhau ⇒ dãy đầu); một nhóm 0 đứng riêng vẫn là <code>0</code>; chữ thường. <code>::</code> có thể ở đầu (<code>::1</code>), ở cuối (<code>2001:db8:0:1::</code>) hoặc là cả địa chỉ (<code>::</code>).</li>
<li>Cả hai nhận mọi dạng hợp lệ (gọn, đầy đủ, chữ hoa) và ném <code>RangeError</code> cho dạng sai: hai <code>::</code>, nhóm dài hơn 4 chữ số hex hoặc có ký tự không phải hex, quá nhiều hay quá ít nhóm.</li>
</ul><p>(Bài này bỏ qua dạng trộn có đuôi IPv4 dạng chấm — bài 7 xử lý <code>::ffff:</code>.) Ca ẩn có hai dãy dài bằng nhau, dãy thứ hai dài hơn, một số 0 đơn, toàn số 0, chữ hoa, và bốn kiểu đầu vào hỏng.</p>`,
  yc: [['Return strings; do not print them.', 'Trả về chuỗi, đừng in ra.'], ['Throw RangeError (not return null) for invalid input.', 'Ném RangeError (không trả null) khi đầu vào sai.']],
  dauVao: ['addr — an IPv6 address as text.', 'addr — địa chỉ IPv6 dạng chữ.'],
  dauRa: ['expand ⇒ "xxxx:xxxx:…" (39 characters); compress ⇒ the RFC 5952 string.', 'expand ⇒ "xxxx:xxxx:…" (39 ký tự); compress ⇒ chuỗi RFC 5952.'],
  goiY: [
    ['expand: split once at "::" — the left part, the right part, and 8 − (their group count) zero groups in between. No "::" ⇒ there must be exactly 8 groups.', 'expand: tách một lần ở "::" — phần trái, phần phải, và 8 − (số nhóm của chúng) nhóm 0 ở giữa. Không có "::" ⇒ phải có đúng 8 nhóm.'],
    ['compress: expand first (it validates for you), drop leading zeros with parseInt(g, 16).toString(16), then scan for runs of "0".', 'compress: expand trước (nó kiểm hộ bạn), bỏ số 0 đầu bằng parseInt(g, 16).toString(16), rồi quét tìm các dãy "0".'],
    ['Replace only if the best run is at least 2 long, and use "greater than" (not "greater or equal") so the first of two equal runs wins.', 'Chỉ thay khi dãy tốt nhất dài ít nhất 2, và dùng "lớn hơn" (không phải "lớn hơn hoặc bằng") để dãy đầu trong hai dãy bằng nhau thắng.'],
  ],
  loi: [
    ['Using a regex replace of the first "0:0" — it compresses the first run, not the longest (2001:db8:0:0:1:0:0:0).', 'Dùng regex thay "0:0" đầu tiên — nó gọn dãy đầu, không phải dãy dài nhất (2001:db8:0:0:1:0:0:0).'],
    ['Using ">=" in the run comparison: the last of two equal runs wins and you print 2001:db8:0:0:1::1.', 'Dùng ">=" khi so dãy: dãy cuối trong hai dãy bằng nhau thắng và bạn in ra 2001:db8:0:0:1::1.'],
    ['Joining around :: with an extra colon at the start or end ("::1:" or ":::").', 'Nối quanh :: thừa dấu hai chấm ở đầu hoặc cuối ("::1:" hay ":::").'],
  ],
  gt: ['Expansion is unambiguous because at most one :: may appear, so the number of hidden groups is always 8 minus the visible ones. Compression must be canonical so that the same address always prints as the same string — logs, allow-lists, caches and database keys compare text. RFC 5952 fixes the three choices that tools used to make differently: no leading zeros, :: on the longest run of at least two groups, and the first run on a tie. That is why Python printed 2001:db8::1:0:0:1 and not 2001:db8:0:0:1::1.', 'Viết đầy đủ không bao giờ mơ hồ vì chỉ được có tối đa một ::, nên số nhóm bị giấu luôn là 8 trừ số nhóm nhìn thấy. Viết gọn phải chuẩn tắc để cùng một địa chỉ luôn in ra cùng một chuỗi — log, danh sách cho phép, cache và khoá cơ sở dữ liệu so sánh chữ. RFC 5952 chốt ba lựa chọn mà các công cụ từng làm khác nhau: không số 0 đầu, :: ở dãy dài nhất từ hai nhóm trở lên, và dãy đầu khi bằng nhau. Vì thế Python in 2001:db8::1:0:0:1 chứ không phải 2001:db8:0:0:1::1.'],
  kn: ['RFC 5952', 'canonical form'],
  tns: [tn('canonical form', 'dạng chuẩn tắc', 'Một cách viết duy nhất cho mỗi giá trị.'), tn('zero run', 'dãy nhóm 0'), tn('tie', 'trường hợp bằng nhau')],
  dau: `/** "2001:db8:a:50::10" ⇒ "2001:0db8:000a:0050:0000:0000:0000:0010" */
function expand(addr) {
  // Write your solution here
  return addr;
}

/** "2001:0db8:0000:0000:0001:0000:0000:0001" ⇒ "2001:db8::1:0:0:1" */
function compress(addr) {
  // Write your solution here
  return addr;
}
`,
  giai: '// Reference solution\n' + nguon(expand, compress),
  cases: [
    { goi: goi('compress', '2001:0db8:000a:0050:0000:0000:0000:0010'), moTa: ['The laptop (real Python output)', 'Laptop (output Python thật)'] },
    { goi: goi('compress', '2001:0db8:0000:0000:0001:0000:0000:0001'), moTa: ['Two equal runs (real Python output)', 'Hai dãy bằng nhau (output Python thật)'] },
    { goi: goi('expand', '2001:db8:a:50::10'), moTa: ['expand the laptop\'s address', 'expand địa chỉ của laptop'] },
    { goi: goi('compress', '2001:db8:0:0:1:0:0:0'), an: true },
    { goi: goi('compress', '2001:db8:0:1:1:1:1:1'), an: true },
    { goi: goi('compress', '0:0:0:0:0:0:0:0'), an: true },
    { goi: goi('compress', '0:0:0:0:0:0:0:1'), an: true },
    { goi: goi('compress', 'FE80:0000:0000:0000:C0FF:FEA8:320A:0000'), an: true },
    { goi: goi('compress', '2001:db8::0:1'), an: true },
    { goi: goi('compress', '2001:0db8:0000:0000:0000:ff00:0042:8329'), an: true },
    { goi: goi('expand', 'ff02::1:ff00:11'), an: true },
    { goi: goi('expand', '::'), an: true },
    { goi: goi('expand', '2001:DB8:D::10'), an: true },
    { goi: goi('expand', '2001::db8::1'), nem: 'RangeError', an: true },
    { goi: goi('compress', '12345::1'), nem: 'RangeError', an: true },
    { goi: goi('expand', '2001:db8:0:0:0:0:0:0:1'), nem: 'RangeError', an: true },
    { goi: goi('expand', '2001:db8:g::1'), nem: 'RangeError', an: true },
  ],
});

const E7 = jsBai({
  ten: 'IPv6 7 — Write normalizeClientIp(s) for logs and rate limits', kho: 'HARD', phut: 35,
  en: `<p>LabFlow's dual-stack server logged the same IPv4 laptop two ways, depending on which app it talked to (lab/out/c24-goi-nghe):</p>${pre([...NGHE, ...DS4, ...DS6])}<p>An allow-list, a rate limiter or a "same user?" check that compares these strings is wrong. Write <code>normalizeClientIp(s)</code> that returns one canonical string per address, or <code>null</code> if <code>s</code> is not an IP address:</p>
<ul>
<li>Trim spaces. Remove square brackets and a port after them: <code>[2001:db8::1]:443</code>. An IPv4 address may also carry a port: <code>198.51.100.2:41122</code>. Remove an IPv6 zone index: <code>fe80::1%eth0</code>.</li>
<li>IPv4 ⇒ dotted decimal as given (each byte ≤ 255, else <code>null</code>).</li>
<li>An <b>IPv4-mapped</b> IPv6 address (<code>::ffff:a.b.c.d</code> in any spelling: upper case, fully written, or with the IPv4 part in hex like <code>::ffff:c633:6402</code>) ⇒ the IPv4 address.</li>
<li>Any other IPv6 ⇒ the RFC 5952 form (reuse your <code>compress</code> from exercise 6).</li>
</ul><p>Hidden cases include upper-case and fully written forms, a hex-written mapped address, the IPv6 loopback ::1 (not mapped!), a NAT64 address <code>64:ff9b::…</code> (not mapped either), a zone index, ports, and strings such as <code>"unknown"</code> or <code>"300.1.2.3"</code>.</p>`,
  vi: `<p>Máy chủ hai họ của LabFlow ghi cùng một laptop IPv4 theo hai cách, tuỳ nó nói chuyện với app nào (lab/out/c24-goi-nghe):</p>${pre([...NGHE, ...DS4, ...DS6])}<p>Danh sách cho phép, bộ giới hạn tần suất hay phép kiểm "cùng người dùng?" mà so các chuỗi này là sai. Viết <code>normalizeClientIp(s)</code> trả về một chuỗi chuẩn tắc cho mỗi địa chỉ, hoặc <code>null</code> nếu <code>s</code> không phải địa chỉ IP:</p>
<ul>
<li>Cắt khoảng trắng. Bỏ ngoặc vuông và cổng phía sau: <code>[2001:db8::1]:443</code>. Địa chỉ IPv4 cũng có thể kèm cổng: <code>198.51.100.2:41122</code>. Bỏ chỉ số vùng IPv6: <code>fe80::1%eth0</code>.</li>
<li>IPv4 ⇒ dạng thập phân có chấm như đã cho (mỗi byte ≤ 255, không thì <code>null</code>).</li>
<li>Địa chỉ IPv6 <b>ánh xạ IPv4</b> (<code>::ffff:a.b.c.d</code> viết kiểu nào cũng được: chữ hoa, viết đầy đủ, hay phần IPv4 viết hex như <code>::ffff:c633:6402</code>) ⇒ địa chỉ IPv4.</li>
<li>IPv6 khác ⇒ dạng RFC 5952 (dùng lại <code>compress</code> của bài 6).</li>
</ul><p>Ca ẩn có dạng chữ hoa và viết đầy đủ, địa chỉ ánh xạ viết hex, loopback IPv6 ::1 (không phải ánh xạ!), một địa chỉ NAT64 <code>64:ff9b::…</code> (cũng không phải ánh xạ), chỉ số vùng, cổng, và các chuỗi như <code>"unknown"</code> hay <code>"300.1.2.3"</code>.</p>`,
  dauVao: ['s — a string from a log, req.ip, a header…', 's — một chuỗi lấy từ log, req.ip, một header…'],
  dauRa: ['A canonical IPv4 or IPv6 string, or null.', 'Chuỗi IPv4 hoặc IPv6 chuẩn tắc, hoặc null.'],
  yc: [['Return the string or null; never throw.', 'Trả chuỗi hoặc null; không bao giờ ném lỗi.'], ['Do not use a library (no net.isIP, no URL tricks).', 'Không dùng thư viện (không net.isIP, không mẹo URL).']],
  goiY: [
    ['Peel the outside first: brackets and port, then a dotted IPv4 (with or without port), then the zone.', 'Bóc lớp ngoài trước: ngoặc và cổng, rồi IPv4 dạng chấm (có hay không có cổng), rồi chỉ số vùng.'],
    ['Turn a dotted tail into two hex groups: a.b.c.d ⇒ (a·256 + b).toString(16) + ":" + (c·256 + d).toString(16). Then expand and look at the groups: five zero groups and then ffff = mapped.', 'Đổi đuôi dạng chấm thành hai nhóm hex: a.b.c.d ⇒ (a·256 + b).toString(16) + ":" + (c·256 + d).toString(16). Rồi expand và xem các nhóm: năm nhóm 0 rồi ffff = ánh xạ.'],
    ['Wrap expand in try/catch: an exception means "not an address" ⇒ null.', 'Bọc expand trong try/catch: có ngoại lệ nghĩa là "không phải địa chỉ" ⇒ null.'],
  ],
  loi: [
    ['s.replace("::ffff:", "") only: misses "::FFFF:", the full form and the hex form — and turns "::ffff:c633:6402" into "c633:6402".', 'Chỉ dùng s.replace("::ffff:", ""): bỏ sót "::FFFF:", dạng đầy đủ và dạng hex — và biến "::ffff:c633:6402" thành "c633:6402".'],
    ['Treating ::1 or 64:ff9b::c633:6402 as mapped IPv4 addresses.', 'Coi ::1 hay 64:ff9b::c633:6402 là địa chỉ IPv4 ánh xạ.'],
    ['Splitting "[2001:db8::1]:443" at the last colon without removing the brackets first.', 'Tách "[2001:db8::1]:443" ở dấu hai chấm cuối mà không bỏ ngoặc trước.'],
  ],
  gt: ['A dual-stack socket receives IPv4 clients as ::ffff:a.b.c.d, so the same person reaches your code as two different strings depending on how the app listens. Normalising once, at the edge, makes every later comparison correct: mapped addresses become plain IPv4, every other IPv6 address gets its single RFC 5952 spelling, and anything that is not an address is rejected instead of polluting a rate-limit table. Only the exact prefix ::ffff:0:0/96 means "IPv4-mapped"; ::1 and NAT64 addresses must stay IPv6.', 'Socket hai họ nhận khách IPv4 dưới dạng ::ffff:a.b.c.d, nên cùng một người tới code của bạn bằng hai chuỗi khác nhau tuỳ app nghe kiểu nào. Chuẩn hoá một lần, ngay ở cửa vào, làm mọi phép so sau đó đúng: địa chỉ ánh xạ thành IPv4 thường, mọi địa chỉ IPv6 khác có đúng một cách viết RFC 5952, và thứ không phải địa chỉ bị loại thay vì làm bẩn bảng giới hạn tần suất. Chỉ đúng prefix ::ffff:0:0/96 mới nghĩa là "ánh xạ IPv4"; ::1 và địa chỉ NAT64 phải giữ là IPv6.'],
  kn: ['IPv4-mapped addresses', 'input normalisation'],
  tns: [tn('normalise', 'chuẩn hoá'), tn('zone index', 'chỉ số vùng', 'Phần %eth0 cho biết địa chỉ link-local thuộc card nào.'), tn('NAT64', 'dịch IPv6 sang IPv4', 'Prefix 64:ff9b::/96.')],
  dau: `/** Any IP string from a log ⇒ canonical IPv4 / RFC 5952 IPv6, or null */
function normalizeClientIp(s) {
  // Write your solution here
  return s;
}
`,
  giai: '// Reference solution\n' + nguon(expand, compress, normalizeClientIp),
  cases: [
    { goi: goi('normalizeClientIp', '::ffff:198.51.100.2'), moTa: ['What the dual-stack app saw (real)', 'Thứ app hai họ đã thấy (thật)'] },
    { goi: goi('normalizeClientIp', '198.51.100.2'), moTa: ['What the IPv4-only app saw (real)', 'Thứ app chỉ IPv4 đã thấy (thật)'] },
    { goi: goi('normalizeClientIp', '2001:db8:a:50::10'), moTa: ['The laptop over IPv6 (real)', 'Laptop qua IPv6 (thật)'] },
    { goi: goi('normalizeClientIp', '::FFFF:198.51.100.2'), an: true },
    { goi: goi('normalizeClientIp', '0:0:0:0:0:ffff:c633:6402'), an: true },
    { goi: goi('normalizeClientIp', ' [2001:DB8:A:50:0:0:0:10]:58834 '), an: true },
    { goi: goi('normalizeClientIp', 'fe80::c0ff:fea8:320a%eth0'), an: true },
    { goi: goi('normalizeClientIp', '::1'), an: true },
    { goi: goi('normalizeClientIp', '64:ff9b::c633:6402'), an: true },
    { goi: goi('normalizeClientIp', '198.51.100.200:47852'), an: true },
    { goi: goi('normalizeClientIp', '::ffff:0:1'), an: true },
    { goi: goi('normalizeClientIp', 'unknown'), an: true },
    { goi: goi('normalizeClientIp', '300.1.2.3'), an: true },
    { goi: goi('normalizeClientIp', '::ffff:300.1.2.3'), an: true },
  ],
});

export default doiDau({ slug: 'netdev-2-4-ipv6', ten: '2.4 IPv6 for developers', khoa: KHOA, baiHoc: 'netdev-2-4-ipv6', de: [E1, E2, E3, E4, E5, E6, E7] });
