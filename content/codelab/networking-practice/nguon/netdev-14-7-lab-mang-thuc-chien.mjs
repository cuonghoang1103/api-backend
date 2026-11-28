/**
 * Networking for Developers · Chương 14 (mạng thực chiến) — bộ luyện chương, gắn bài Lab 14 (netdev-14-7-lab-mang-thuc-chien).
 * Dữ liệu thật: lab/out/c142-dem (iptables -L CHAN -v -n của "mạng trường trong hộp" + luật TTL 63/127), c146-wan (WAN 100.64.0.2 so với
 * IP Internet thấy 198.18.0.40 ⇒ CGNAT). Gói tin ở các ca của bài viết hàm là DỰNG theo đúng các tình huống của bài 14.2–14.4.
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, ra, sauLenh, pre, cs, tinh, bang1, mt, q } from './_net.mjs';

const CHAN = sauLenh('c142-dem', 'iptables -L CHAN -v -n --line-numbers').map((d) => d.replace(/\r$/, ''));
const TTL = sauLenh('c142-dem', 'iptables -t mangle -L PREROUTING').map((d) => d.replace(/\r$/, ''));
const WAN = (/(\d+\.\d+\.\d+\.\d+)\/\d+/.exec(sauLenh('c146-wan', 'ip -4 -br addr show wan')[0]) || [])[1];
const SEEN = (/ban den tu (\d+\.\d+\.\d+\.\d+)/.exec(sauLenh('c146-wan', 'curl -s http://news.test/')[0]) || [])[1];
if (CHAN.length !== 8 || TTL.length !== 3 || WAN !== '100.64.0.2' || SEEN !== '198.18.0.40') throw new Error('Ch14: output thật đổi — xem lại đề');

function firstMatch(rulesText, p) {
  var lines = String(rulesText).split('\n');
  for (var i = 0; i < lines.length; i++) {
    var w = lines[i].trim().split(/\s+/);
    if (!/^\d+$/.test(w[0]) || w.length < 10) continue; // only numbered rule lines
    var num = Number(w[0]), target = w[3], prot = w[4], dst = w[9], extra = w.slice(10).join(' ');
    if (prot !== 'all' && prot !== p.proto) continue;
    if (dst !== '0.0.0.0/0' && dst !== p.dst) continue;
    var m = /dpt:(\d+)/.exec(extra);
    if (m && Number(m[1]) !== p.dport) continue;
    var mp = /multiport dports\s+(!?)([\d,]+)/.exec(extra);
    if (mp) {
      var inList = mp[2].split(',').map(Number).indexOf(p.dport) >= 0;
      if (mp[1] === '!' ? inList : !inList) continue; // "!list" matches every port NOT in the list
    }
    var s = /STRING match\s+"([^"]+)"/.exec(extra);
    if (s && p.sni !== s[1]) continue; // the SNI is cleartext in the ClientHello, so a string match can see it
    return { rule: num, target: target };
  }
  return { rule: 0, target: 'ACCEPT' }; // no rule matched: the packet goes on
}
const P = (proto, dst, dport, sni) => ({ proto, dst, dport, ...(sni ? { sni } : {}) });
const E1 = jsBai({
  ten: 'Real-world 1 — Write firstMatch(rules, packet): which school rule blocked you?', kho: 'HARD', phut: 30,
  en: `<p>The "school network in a box" of lesson 14.2, read with its real counters:</p>${pre(CHAN)}<p>Write <code>firstMatch(rulesText, packet)</code> for <code>packet = { proto: "tcp" | "udp", dst, dport, sni? }</code>. Walk the numbered rule lines top to bottom (columns: num pkts bytes target prot opt in out source destination, then match options) and return <code>{ rule, target }</code> for the FIRST rule that matches, or <code>{ rule: 0, target: "ACCEPT" }</code> if none does. A rule matches when ALL of its conditions hold:</p>
<ul>
<li><code>prot</code> is <code>all</code> or equals packet.proto; <code>destination</code> is <code>0.0.0.0/0</code> or equals packet.dst;</li>
<li><code>dpt:N</code> ⇒ packet.dport is N; <code>multiport dports A,B,…</code> ⇒ dport in the list, and with a leading <code>!</code> ⇒ dport NOT in the list;</li>
<li><code>STRING match "x"</code> ⇒ packet.sni is exactly x.</li>
</ul>`,
  vi: `<p>"Mạng trường trong hộp" của bài 14.2, đọc kèm bộ đếm thật:</p>${pre(CHAN)}<p>Viết <code>firstMatch(rulesText, packet)</code> với <code>packet = { proto: "tcp" | "udp", dst, dport, sni? }</code>. Đi qua các dòng luật có số từ trên xuống (cột: num pkts bytes target prot opt in out source destination, rồi các tuỳ chọn khớp) và trả <code>{ rule, target }</code> của luật ĐẦU TIÊN khớp, hoặc <code>{ rule: 0, target: "ACCEPT" }</code> nếu không luật nào khớp. Một luật khớp khi MỌI điều kiện của nó đúng:</p>
<ul>
<li><code>prot</code> là <code>all</code> hoặc bằng packet.proto; <code>destination</code> là <code>0.0.0.0/0</code> hoặc bằng packet.dst;</li>
<li><code>dpt:N</code> ⇒ packet.dport là N; <code>multiport dports A,B,…</code> ⇒ dport nằm trong danh sách, có dấu <code>!</code> phía trước ⇒ dport KHÔNG nằm trong danh sách;</li>
<li><code>STRING match "x"</code> ⇒ packet.sni đúng bằng x.</li>
</ul>`,
  dau: 'function firstMatch(rulesText, p) {\n  return { rule: 0, target: "ACCEPT" };\n}\n',
  giai: nguon(firstMatch),
  cases: [
    { goi: goi('firstMatch', CHAN.join('\n'), P('udp', '8.8.8.8', 53)), moTa: ['Case 1: DNS to an outside resolver', 'Ca 1: DNS tới resolver bên ngoài'] },
    { goi: goi('firstMatch', CHAN.join('\n'), P('tcp', '198.18.0.10', 443, 'social.test')), moTa: ['Case 2: HTTPS to social.test', 'Ca 2: HTTPS tới social.test'] },
    { goi: goi('firstMatch', CHAN.join('\n'), P('tcp', '198.18.0.30', 22)), moTa: ['Case 3: SSH on port 22', 'Ca 3: SSH ở cổng 22'] },
    { goi: goi('firstMatch', CHAN.join('\n'), P('udp', '198.18.0.30', 51820)), an: true, moTa: ['Hidden: WireGuard over UDP 51820', 'Ẩn: WireGuard qua UDP 51820'] },
    { goi: goi('firstMatch', CHAN.join('\n'), P('tcp', '198.18.0.30', 443)), an: true, moTa: ['Hidden: OpenVPN over TCP 443', 'Ẩn: OpenVPN qua TCP 443'] },
    { goi: goi('firstMatch', CHAN.join('\n'), P('tcp', '198.18.0.30', 993)), an: true, moTa: ['Hidden: SSH on the side door, port 993', 'Ẩn: SSH qua cửa phụ, cổng 993'] },
    { goi: goi('firstMatch', CHAN.join('\n'), P('tcp', '198.18.0.20', 443)), an: true, moTa: ['Hidden: HTTPS to the blocked VPN address', 'Ẩn: HTTPS tới địa chỉ VPN bị chặn'] },
    { goi: goi('firstMatch', CHAN.join('\n'), P('tcp', '198.18.0.10', 443, 'news.test')), an: true },
  ],
  goiY: [['Split each line on whitespace; the destination is column 10 (index 9) and everything after it is match options.', 'Tách mỗi dòng theo khoảng trắng; destination là cột 10 (chỉ số 9) và mọi thứ sau nó là tuỳ chọn khớp.'], ['Skip the "Chain" and header lines: only lines whose first word is a number are rules.', 'Bỏ dòng "Chain" và dòng tiêu đề: chỉ dòng có từ đầu là số mới là luật.'], ['Order matters: the first match wins, so rule 1 catches DNS before anything else sees it.', 'Thứ tự quan trọng: luật khớp đầu tiên thắng, nên luật 1 bắt DNS trước khi luật nào khác kịp thấy.']],
  loi: [['Reading "!80,443,587,993" as "block these ports" — the ! means every OTHER port.', 'Đọc "!80,443,587,993" thành "chặn các cổng này" — dấu ! nghĩa là mọi cổng KHÁC.'], ['Continuing after the first match, so a later rule overrides an earlier one.', 'Tiếp tục duyệt sau luật khớp đầu tiên, khiến luật sau đè luật trước.']],
  gt: ['This table explains a whole bad week at once: outside DNS is dropped (rule 1), social.test dies by SNI (rule 3), the VPN server\'s IP is blackholed (rule 4), every port but 80/443/587/993 is closed (rule 5) — so SSH on 22 fails and SSH on 993 works — and all other UDP is dropped (rule 6), which is why WireGuard gets "0 B received" while OpenVPN over TCP 443 connects. Reading the rules, not guessing, is what lets you work inside the policy.', 'Bảng này giải thích cả một tuần tệ hại cùng lúc: DNS bên ngoài bị bỏ (luật 1), social.test chết vì SNI (luật 3), IP của máy chủ VPN bị chặn (luật 4), mọi cổng trừ 80/443/587/993 đều đóng (luật 5) — nên SSH cổng 22 hỏng còn SSH cổng 993 chạy — và mọi UDP khác bị bỏ (luật 6), đó là lý do WireGuard báo "0 B received" trong khi OpenVPN qua TCP 443 nối được. Đọc luật, không đoán, là thứ giúp bạn làm việc bên trong chính sách.'],
  kn: ['firewall rules', 'first match'],
});

function homeReach(wanIp, seenIp) {
  function n(ip) { var p = ip.split('.').map(Number); return ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3]; }
  function inNet(ip, net, len) { var m = len === 0 ? 0 : (0xFFFFFFFF << (32 - len)) >>> 0; return ((n(ip) & m) >>> 0) === ((n(net) & m) >>> 0); }
  var cgnat = inNet(wanIp, '100.64.0.0', 10); // RFC 6598 shared address space
  var priv = inNet(wanIp, '10.0.0.0', 8) || inNet(wanIp, '172.16.0.0', 12) || inNet(wanIp, '192.168.0.0', 16);
  var behind = wanIp !== seenIp; // the Internet sees a different address than the router owns
  return { cgnat: cgnat, privateWan: priv, behindProviderNat: behind, portForwardWorks: !cgnat && !priv && !behind };
}
const E2 = jsBai({
  ten: 'Real-world 2 — Write homeReach(wanIp, seenIp): will a port forward ever work?', kho: 'MEDIUM', phut: 15,
  en: `<p>Lesson 14.6, measured: the home router's WAN interface has <code>${WAN}</code>, while a server on the Internet says the visit came from <code>${SEEN}</code>. Write <code>homeReach(wanIp, seenIp)</code> returning:</p>
<ul>
<li><code>cgnat</code> — wanIp is in <code>100.64.0.0/10</code> (the shared address space for carrier-grade NAT, RFC 6598);</li>
<li><code>privateWan</code> — wanIp is in 10/8, 172.16/12 or 192.168/16 (another router in front of yours);</li>
<li><code>behindProviderNat</code> — wanIp ≠ seenIp;</li>
<li><code>portForwardWorks</code> — true only if none of the three above is true.</li>
</ul>`,
  vi: `<p>Bài 14.6, đo thật: interface WAN của router nhà mang <code>${WAN}</code>, trong khi một máy chủ trên Internet nói lượt truy cập đến từ <code>${SEEN}</code>. Viết <code>homeReach(wanIp, seenIp)</code> trả về:</p>
<ul>
<li><code>cgnat</code> — wanIp nằm trong <code>100.64.0.0/10</code> (dải địa chỉ dùng chung cho NAT cấp nhà mạng, RFC 6598);</li>
<li><code>privateWan</code> — wanIp nằm trong 10/8, 172.16/12 hoặc 192.168/16 (có thêm một router đứng trước router của bạn);</li>
<li><code>behindProviderNat</code> — wanIp ≠ seenIp;</li>
<li><code>portForwardWorks</code> — chỉ true khi cả ba điều trên đều sai.</li>
</ul>`,
  dau: 'function homeReach(wanIp, seenIp) {\n  return { cgnat: false, privateWan: false, behindProviderNat: false, portForwardWorks: true };\n}\n',
  giai: nguon(homeReach),
  cases: [
    { goi: goi('homeReach', WAN, SEEN), moTa: ['Case 1: the real home router of Lab 14', 'Ca 1: router nhà thật của Lab 14'] },
    { goi: goi('homeReach', '203.0.113.45', '203.0.113.45') },
    { goi: goi('homeReach', '192.168.1.2', '203.0.113.45'), an: true },
    { goi: goi('homeReach', '100.127.255.254', '198.51.100.7'), an: true },
    { goi: goi('homeReach', '100.128.0.1', '100.128.0.1'), an: true },
    { goi: goi('homeReach', '172.31.0.9', '172.31.0.9'), an: true },
  ],
  goiY: [['/10 means the first 10 bits: 100.64.0.0 – 100.127.255.255.', '/10 nghĩa là 10 bit đầu: 100.64.0.0 – 100.127.255.255.'], ['Compare (ip AND mask) with (network AND mask) as 32-bit unsigned numbers.', 'So (ip AND mặt nạ) với (mạng AND mặt nạ) dưới dạng số 32 bit không dấu.']],
  loi: [['Treating 100.64.x.x as a public address because it is not RFC 1918.', 'Coi 100.64.x.x là địa chỉ công cộng vì nó không thuộc RFC 1918.'], ['Configuring a port forward for hours when the provider NAT makes it impossible.', 'Cấu hình mở cổng hàng giờ trong khi NAT của nhà mạng khiến việc đó bất khả.']],
  gt: ['Behind CGNAT nobody on the Internet can start a connection to your house, so a port forward on your own router can never work. The fix is to connect OUT — an SSH reverse tunnel or a VPN peer to a VPS — which is exactly how Lab 14 showed the demo from home without opening any port.', 'Sau CGNAT, không ai trên Internet mở được kết nối vào nhà bạn, nên mở cổng trên router của mình không bao giờ chạy được. Cách sửa là nối RA ngoài — đường hầm SSH ngược hoặc một peer VPN tới VPS — đúng như Lab 14 đã cho xem bản demo từ nhà mà không mở cổng nào.'],
  kn: ['CGNAT', 'port forwarding'],
});

const E3 = tinh({
  tieuDe: 'Real-world 3 — The TTL rule that spots a hotspot', doKho: 'MEDIUM', phut: 10,
  moTa: mt(`The school gateway also counts packets by TTL, for real:${pre(TTL)}Linux, Android, iOS and macOS start packets at TTL 64; Windows at 128. Every router — including a phone sharing its connection — subtracts one. Fill in what the gateway sees and whether these rules drop it.`, `Gateway của trường còn đếm gói theo TTL, thật:${pre(TTL)}Linux, Android, iOS và macOS bắt đầu gói ở TTL 64; Windows ở 128. Mỗi router — kể cả điện thoại đang chia sẻ mạng — trừ đi một. Điền TTL gateway thấy và các luật này có bỏ gói không.`),
  loai: 'table',
  bang: [bang1('b1', ['TTL seen at the school gateway', 'TTL mà gateway của trường thấy'], [{ ma: 'd', ten: 'Device' }, { ma: 't', ten: 'TTL seen', luaChon: ['64', '63', '128', '127'] }, { ma: 'x', ten: 'Dropped?', luaChon: ['yes', 'no'] }], [
    { o: { d: 'An Android phone browsing on the Wi-Fi itself' }, a: { t: '64', x: 'no' } },
    { o: { d: 'A Linux laptop behind that phone\'s hotspot' }, a: { t: '63', x: 'yes' } },
    { o: { d: 'A Windows laptop behind that phone\'s hotspot' }, a: { t: '127', x: 'yes' } },
    { o: { d: 'A Windows laptop on the Wi-Fi directly' }, a: { t: '128', x: 'no' } },
  ], ['One extra hop leaves a fingerprint: 63 or 127 means "something routed this before it reached me". That is all the rule needs to spot a shared connection. Where the school forbids sharing, the answer is to follow the policy, not to defeat the counter.', 'Một chặng thêm để lại dấu vân tay: 63 hay 127 nghĩa là "có thứ đã định tuyến gói này trước khi tới tôi". Luật chỉ cần thế để nhận ra mạng đang bị chia sẻ. Ở nơi trường cấm chia sẻ, cách đúng là theo chính sách, không phải lừa bộ đếm.'])],
  goiY: ['Start from 64 or 128, then subtract the number of routers in between.', 'The phone is a router for the laptop behind it.'],
  loiHayGap: ['Forgetting that the phone itself is not one hop away from itself — its own packets keep 64.', 'Assuming every device starts at 64.'],
  thuatNgu: [tn('TTL', 'số chặng còn được đi'), tn('hotspot', 'điểm phát chia sẻ mạng')], khaiNiem: ['TTL fingerprinting'],
});

const E4 = cs({
  ten: 'Real-world 4 — Wi-Fi, SSH, VPN and the attacker\'s corners', kho: 'HARD', phut: 12,
  en: 'Lab 14 R1, R3, R4 and R6 — the week in the dorm and at school.',
  vi: 'Lab 14 R1, R3, R4 và R6 — tuần đầu ở ký túc xá và ở trường.',
  cau: [
    q('c1', ['You registered your laptop on the school portal, yet the Internet SSID blocks you. Your phone shows "Private address: Fixed". Why?', 'Bạn đã đăng ký laptop trên cổng trường mà SSID có Internet vẫn chặn. Máy báo "Private address: Fixed". Vì sao?'], ['Each SSID sees its own random MAC address', 'Fixed means the IP address is set wrongly', 'The portal only accepts Windows devices', 'The registration expires after one minute'], ['Private (randomised) MAC addresses are per network, so the MAC you registered is not the one SSID 2 sees. Turn it Off for the school SSID so the MAC you register is the MAC you use — the controller\'s table proved it in the lab.', 'Địa chỉ MAC riêng (ngẫu nhiên) là theo từng mạng, nên MAC bạn đăng ký không phải MAC mà SSID 2 thấy. Tắt nó (Off) cho SSID của trường để MAC bạn đăng ký là MAC bạn dùng — bảng của controller đã chứng minh trong lab.']),
    q('c2', ['Your ~/.ssh/config must use port 993 at school and 22 at home. Where does the Match block go?', '~/.ssh/config phải dùng cổng 993 ở trường và 22 ở nhà. Khối Match đặt ở đâu?'], ['Before the Host block, because the first value obtained wins', 'After the Host block, so it can override it', 'In a separate file that ssh reads last', 'Anywhere — ssh always uses the last value'], ['ssh takes the FIRST value it reads for each option, so a conditional Match must come first. Prove it with ssh -G vps | grep ^port on both networks.', 'ssh lấy giá trị ĐẦU TIÊN đọc được cho mỗi tuỳ chọn, nên khối Match có điều kiện phải đứng trước. Chứng minh bằng ssh -G vps | grep ^port ở cả hai mạng.']),
    q('c3', ['Your VPN works, but a capture on the school gateway still shows queries for every site you visit. What leaked?', 'VPN đã chạy, nhưng bản bắt gói ở gateway trường vẫn thấy truy vấn cho mọi trang bạn vào. Cái gì bị rò?'], ['DNS queries, sent outside the tunnel', 'The TLS certificates of every site', 'The private key of the VPN', 'Nothing: DNS is always encrypted'], ['A DNS leak: traffic goes through the tunnel but name lookups do not. Point the resolver at one reached through the tunnel, then capture again to prove the leak is gone.', 'Rò DNS: lưu lượng đi qua đường hầm nhưng tra cứu tên thì không. Trỏ resolver về một máy đi qua đường hầm, rồi bắt gói lại để chứng minh đã hết rò.']),
    q('c4', ['You start a SOCKS proxy with ssh -D 0.0.0.0:1080 on the shared Wi-Fi. What is the risk?', 'Bạn mở proxy SOCKS bằng ssh -D 0.0.0.0:1080 trên Wi-Fi dùng chung. Rủi ro là gì?'], ['Anyone on the same Wi-Fi can use your VPS through it', 'The proxy only works over IPv6', 'It disables your SSH keys', 'It slows down every website'], ['Binding to 0.0.0.0 offers the proxy to the whole network. Bind it to 127.0.0.1 so only your own laptop can use it — one of the three R6 risks of the lab.', 'Bind vào 0.0.0.0 là mở proxy cho cả mạng. Bind vào 127.0.0.1 để chỉ laptop của bạn dùng được — một trong ba rủi ro R6 của lab.']),
    q('c5', ['The new dorm router still accepts admin / admin. What does a roommate gain?', 'Router mới ở ký túc xá vẫn nhận admin / admin. Bạn cùng phòng có được gì?'], ['Full control of DNS and port forwards', 'Only the Wi-Fi password, nothing else', 'Nothing without physical access to it', 'Only a view of the speed graph'], ['With the admin page a roommate can change DNS, open port forwards and see who is on the network. The lab\'s own login test returned 401 for two guesses and 200 for admin / admin. Change the default credentials on day one.', 'Vào được trang quản trị, bạn cùng phòng đổi được DNS, mở cổng và xem ai đang dùng mạng. Phép thử đăng nhập trong lab trả 401 cho hai lần đoán và 200 cho admin / admin. Đổi thông tin đăng nhập mặc định ngay ngày đầu.']),
  ],
  goiY: [['Ask what each setting exposes, and to whom.', 'Hỏi mỗi thiết lập phơi ra cái gì, cho ai.'], ['Prove every claim with a command: ssh -G, a capture, a login test.', 'Chứng minh mọi khẳng định bằng một lệnh: ssh -G, một bản bắt gói, một phép thử đăng nhập.']],
  loi: [['Putting the Match block after Host and wondering why it never applies.', 'Đặt khối Match sau Host rồi thắc mắc vì sao nó không bao giờ có tác dụng.'], ['Binding tools to 0.0.0.0 on a network you do not control.', 'Bind công cụ vào 0.0.0.0 trên một mạng bạn không kiểm soát.']],
  tns: [tn('private MAC address', 'địa chỉ MAC riêng (ngẫu nhiên)'), tn('DNS leak', 'rò DNS'), tn('reverse tunnel', 'đường hầm ngược')], kn: ['network safety'],
});

export default doiDau({ slug: 'netdev-14-7-lab-mang-thuc-chien', ten: 'Lab 14 — Practice: school firewalls, CGNAT, TTL and safe tunnels', khoa: KHOA, baiHoc: 'netdev-14-7-lab-mang-thuc-chien', de: [E1, E2, E3, E4] });
