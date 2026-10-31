/** Networking for Developers · 1.4 — Ethernet, MAC, switch, ARP: đọc tcpdump -e thật, trạng thái hàng xóm, tự viết whoToArp / switchSim / changedFields. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre } from './_net.mjs';

const ARP = sauLenh('c13-arp', 'tcpdump -e -n -r').slice(1).map((d) => d.trim());
if (ARP.length !== 10) throw new Error('c13-arp: cần 10 dòng tcpdump');
const NO = (d) => d.replace(/^\S+ /, '');   // bỏ mốc giờ cho dòng gọn hơn

/* ── 1. MAC ── */
const E1 = cs({
  ten: 'ARP 1 — MAC addresses and the reach of a frame', kho: 'EASY', phut: 8,
  en: 'The lab\'s MAC addresses are 02:00:0a:0a:01:0a (client), 02:00:0a:0a:01:0b (client2) and 02:00:0a:0a:01:fe (router, LAN side).',
  vi: 'Địa chỉ MAC của lab là 02:00:0a:0a:01:0a (client), 02:00:0a:0a:01:0b (client2) và 02:00:0a:0a:01:fe (router, phía LAN).',
  cau: [
    q('c1', ['The first byte 02 = 0000 0010. What do its two lowest bits say?', 'Byte đầu 02 = 0000 0010. Hai bit thấp nhất của nó nói gì?'], ['Unicast, and locally administered (chosen by software)', 'Multicast, and burned in by the card manufacturer', 'Broadcast, and valid on every link of the path', 'Unicast, and burned in by the card manufacturer'], ['Bit 0 (multicast) is 0 ⇒ one card; bit 1 (locally administered) is 1 ⇒ chosen by software. Docker, VMs and phones with "random MAC" use such addresses.', 'Bit 0 (multicast) là 0 ⇒ một card; bit 1 (do quản trị đặt) là 1 ⇒ phần mềm chọn. Docker, máy ảo và điện thoại bật "MAC ngẫu nhiên" dùng loại này.']),
    q('c2', ['Who receives a frame sent to ff:ff:ff:ff:ff:ff?', 'Ai nhận một frame gửi tới ff:ff:ff:ff:ff:ff?'], ['Every card in the same broadcast domain', 'Every card on the Internet, through routers', 'Only the router, which forwards it on', 'Only the card that sent it, as a test'], ['Broadcast reaches all devices of one LAN and stops at the router — that set is the broadcast domain.', 'Broadcast tới mọi thiết bị của một LAN và dừng ở router — tập đó là miền quảng bá.']),
    q('c3', ['The client sends a packet to the web server 10.10.2.10. Which MAC is the frame\'s destination?', 'Client gửi gói tới web server 10.10.2.10. MAC đích của frame là gì?'], ['02:00:0a:0a:01:fe, the router\'s LAN card', '02:00:0a:0a:02:0a, the web server\'s card', 'ff:ff:ff:ff:ff:ff, so that the router hears it', '02:00:0a:0a:01:0a, the client\'s own card'], ['Ethernet only reaches the next device. The web server is on another network, so the frame goes to the router; the router builds a new frame for the DMZ.', 'Ethernet chỉ tới thiết bị kế tiếp. Web server ở mạng khác nên frame gửi tới router; router dựng frame mới cho DMZ.']),
    q('c4', ['A MAC address has a manufacturer code in its first three bytes. That code is called …', 'Ba byte đầu của địa chỉ MAC là mã nhà sản xuất. Mã đó gọi là …'], ['the OUI', 'the TTL', 'the MSS', 'the FCS'], ['OUI = Organizationally Unique Identifier, assigned to manufacturers; the last three bytes are unique to the card.', 'OUI = Organizationally Unique Identifier, cấp cho nhà sản xuất; ba byte cuối là riêng của từng card.']),
    q('c5', ['Which statement about IP and MAC addresses on the path client → router → web is right?', 'Câu nào đúng về IP và MAC trên đường client → router → web?'], ['IPs stay the same end to end; MACs are new on each link', 'MACs stay the same end to end; IPs are new on each link', 'Both stay the same end to end, unless NAT is used', 'Both are rewritten by the router on every packet'], ['Two kinds of address, two jobs: IP = where the packet is going; MAC = which card takes this frame right now.', 'Hai loại địa chỉ, hai việc: IP = gói đi đâu; MAC = card nào nhận frame này ngay bây giờ.']),
  ],
  goiY: [['Look at the lowest two bits of the first byte: multicast, then locally administered.', 'Nhìn hai bit thấp nhất của byte đầu: multicast, rồi do quản trị đặt.'], ['A frame never crosses a router; a packet does.', 'Frame không bao giờ vượt router; gói thì có.']],
  loi: [['Writing the web server\'s MAC into a frame that leaves the client.', 'Ghi MAC của web server vào frame rời khỏi client.'], ['Thinking a broadcast crosses routers.', 'Nghĩ broadcast đi qua router.']],
  tns: [tn('broadcast domain', 'miền quảng bá'), tn('OUI', 'mã nhà sản xuất trong MAC'), tn('unicast / multicast', 'gửi một / gửi nhóm')],
  kn: ['MAC address'],
});

/* ── 2. Đọc tcpdump -e thật ── */
const LOAI = ['ARP request (broadcast)', 'ARP reply (unicast)', 'ICMP echo in a unicast frame', 'our own broadcast reflected back'];
const AI = ['client', 'client2', 'router'];
const DEN = ['everyone on the LAN', 'client', 'client2', 'router'];
const ha = (i, l, s, d) => ({ o: { x: `${i + 1}. ${NO(ARP[i])}` }, a: { l, s, d } });
const E2 = cs({
  ten: 'ARP 2 — Read the real tcpdump -e capture', kho: 'MEDIUM', phut: 15, loai: 'table',
  en: `The client's ARP cache was emptied, then it pinged 10.10.1.11 (client2, same LAN) and 10.10.2.10 (web, another network). Real capture (lab/out/c13-arp), timestamps removed:${pre(ARP.map((d, i) => `${i + 1}. ${NO(d)}`))}MACs: …:01:0a = client, …:01:0b = client2, …:01:fe = router.`,
  vi: `Bộ đệm ARP của client được xoá, rồi nó ping 10.10.1.11 (client2, cùng LAN) và 10.10.2.10 (web, mạng khác). Bản bắt thật (lab/out/c13-arp), đã bỏ mốc giờ:${pre(ARP.map((d, i) => `${i + 1}. ${NO(d)}`))}MAC: …:01:0a = client, …:01:0b = client2, …:01:fe = router.`,
  bang: [bang1('b1', ['Frame by frame', 'Từng frame'], [{ ma: 'x', ten: 'Line' }, { ma: 'l', ten: 'What it is', luaChon: LOAI }, { ma: 's', ten: 'Sent by', luaChon: AI }, { ma: 'd', ten: 'Sent to', luaChon: DEN }], [
    ha(0, LOAI[0], 'client', DEN[0]), ha(1, LOAI[3], 'client', DEN[0]), ha(2, LOAI[1], 'client2', 'client'),
    ha(3, LOAI[2], 'client', 'client2'), ha(5, LOAI[0], 'client', DEN[0]), ha(7, LOAI[1], 'router', 'client'), ha(8, LOAI[2], 'client', 'router'),
  ], ['Read in pairs. To reach client2 the client broadcasts who-has 10.10.1.11, client2 answers by unicast, then the echo goes in a normal unicast frame. To reach 10.10.2.10 the client never asks for 10.10.2.10: it asks who-has 10.10.1.254, the router, and line 9 carries IP destination 10.10.2.10 inside a frame for the router\'s MAC. Line 2 is identical to line 1: capturing only incoming frames (tcpdump -Q in, lab/out/c13-q-in) proved it is Docker Desktop\'s bridge reflecting our own broadcast, not a second request.', 'Đọc theo cặp. Để tới client2, client broadcast who-has 10.10.1.11, client2 trả lời unicast, rồi echo đi trong frame unicast bình thường. Để tới 10.10.2.10, client không bao giờ hỏi 10.10.2.10: nó hỏi who-has 10.10.1.254, tức router, và dòng 9 chở IP đích 10.10.2.10 trong một frame gửi tới MAC của router. Dòng 2 giống hệt dòng 1: chỉ bắt chiều vào (tcpdump -Q in, lab/out/c13-q-in) đã chứng minh đó là bridge của Docker Desktop phản xạ lại broadcast của chính ta, không phải yêu cầu thứ hai.'])],
  goiY: [['"A > B" in tcpdump -e is source MAC > destination MAC.', '"A > B" trong tcpdump -e là MAC nguồn > MAC đích.'], ['ARP requests go to ff:ff:ff:ff:ff:ff; replies go straight back to whoever asked.', 'Yêu cầu ARP gửi tới ff:ff:ff:ff:ff:ff; trả lời gửi thẳng về người hỏi.']],
  loi: [['Believing the client ARPs for 10.10.2.10.', 'Tin rằng client ARP cho 10.10.2.10.'], ['Inventing a "retry" for the duplicated request instead of checking the capture direction.', 'Bịa ra "thử lại" cho yêu cầu bị lặp thay vì kiểm hướng bắt gói.']],
  tns: [tn('who-has / is-at', 'ai có IP này / IP này ở MAC kia'), tn('tcpdump -e', 'in cả header Ethernet'), tn('-Q in', 'chỉ bắt chiều vào')],
  kn: ['ARP', 'reading captures'],
});

/* ── 3. Trạng thái hàng xóm và gratuitous ARP ── */
const CHO = sauLenh('c13-stale-cho', 'for i in $(seq 1 90)');
const E3 = cs({
  ten: 'ARP 3 — Stale caches, neighbour states and gratuitous ARP', kho: 'MEDIUM', phut: 12,
  en: `client2 was replaced by a machine with the same IP 10.10.1.11 but a new MAC. Real output on the client:${pre(['$ ip neigh show 10.10.1.11', ...sauLenh('c13-stale-2', 'ip neigh show 10.10.1.11').slice(0, 1), '$ ping -c 3 -W 1 10.10.1.11   →  3 packets transmitted, 0 received', '', '# later, client2 changes its MAC again WITHOUT announcing it; one ping per second:', ...CHO])}`,
  vi: `client2 bị thay bằng một máy cùng IP 10.10.1.11 nhưng MAC mới. Output thật trên client:${pre(['$ ip neigh show 10.10.1.11', ...sauLenh('c13-stale-2', 'ip neigh show 10.10.1.11').slice(0, 1), '$ ping -c 3 -W 1 10.10.1.11   →  3 packets transmitted, 0 received', '', '# sau đó client2 đổi MAC lần nữa mà KHÔNG thông báo; mỗi giây ping một lần:', ...CHO])}`,
  cau: [
    q('c1', ['Why did all three pings fail while the cache said REACHABLE?', 'Vì sao cả ba ping đều hỏng trong khi bộ đệm ghi REACHABLE?'], ['The client kept sending frames to the old MAC that no longer exists', 'The new machine refused ICMP because its firewall was still closed', 'The switch had no entry for the IP address 10.10.1.11 any more', 'The router dropped the pings because the TTL was too small'], ['The kernel builds every frame from its neighbour table. It still says …:01:0b, so the frames go to a card that is gone — nobody answers, and nothing tells the client.', 'Kernel dựng mọi frame từ bảng hàng xóm. Bảng vẫn ghi …:01:0b nên frame đi tới một card đã không còn — không ai trả lời, và không gì báo cho client.']),
    q('c2', ['After arping -U on the new machine, the client\'s entry changed at once. arping -U sends …', 'Sau arping -U trên máy mới, mục của client đổi ngay. arping -U gửi …'], ['a gratuitous ARP: an unsolicited "10.10.1.11 is at …" to everyone', 'an ARP request asking every machine to forget the old address', 'an ICMP redirect telling the client to use another router', 'a DHCP release that gives the address back to the network'], ['A gratuitous ARP is an announcement nobody asked for, sent to broadcast; neighbours update their caches. "Received 0 response(s)" is expected — nobody answers an announcement.', 'Gratuitous ARP là thông báo không ai hỏi, gửi broadcast; hàng xóm cập nhật bộ đệm. "Received 0 response(s)" là bình thường — không ai trả lời một thông báo.']),
    q('c3', ['Without the announcement, in which order did the entry move?', 'Không có thông báo, mục đó chuyển trạng thái theo thứ tự nào?'], ['DELAY → PROBE → FAILED → a fresh lookup, REACHABLE', 'PROBE → DELAY → STALE → a fresh lookup, REACHABLE', 'FAILED → PROBE → DELAY → a fresh lookup, REACHABLE', 'STALE → FAILED → DELAY → a fresh lookup, REACHABLE'], ['Ping 1: DELAY (traffic flows, wait for a confirmation); ping 5: PROBE (unicast probes to the old MAC); ping 8: FAILED; ping 9 triggers a new broadcast, learns …:01:cc and gets a reply.', 'Ping 1: DELAY (có lưu lượng, chờ xác nhận); ping 5: PROBE (dò unicast tới MAC cũ); ping 8: FAILED; ping 9 gây broadcast mới, học …:01:cc và có trả lời.']),
    q('c4', ['How much traffic was lost purely because of the cache, in this run?', 'Trong lượt đo này, bao nhiêu lưu lượng bị mất chỉ vì bộ đệm?'], ['About 9 seconds (8 pings lost, a reply at ping 9)', 'About 90 seconds (the loop allowed 90 pings)', 'About 1 second (only the first ping was lost)', 'None (the switch delivered to the new card)'], ['Replies resumed at ping 9. The exact time depends on where the entry was in its timers — that is why failover tools (keepalived, cloud floating IPs) send a gratuitous ARP the moment an IP moves.', 'Có trả lời lại ở ping 9. Thời gian chính xác tuỳ mục đang ở đâu trong các bộ đếm giờ — vì thế công cụ failover (keepalived, floating IP trên cloud) gửi gratuitous ARP ngay khi IP chuyển máy.']),
    q('c5', ['Your lead asks whether the 10 seconds of failed health checks after the 2 a.m. replacement were "the network" or "the app". You answer …', 'Trưởng nhóm hỏi 10 giây health check hỏng sau lần thay máy lúc 2 giờ sáng là "do mạng" hay "do ứng dụng". Bạn trả lời …'], ['the layer below the app: neighbours kept the old MAC until their ARP entries expired', 'the app: it needs ten seconds to start, so the health checks failed at first', 'DNS: the load balancer cached the old address of the replaced server', 'TLS: the new machine had a different certificate for the same IP'], ['Same IP, new MAC, no announcement ⇒ stale neighbour entries. The fix: make the failover send a gratuitous ARP.', 'Cùng IP, MAC mới, không thông báo ⇒ mục hàng xóm cũ. Cách sửa: cho quy trình failover gửi gratuitous ARP.']),
  ],
  goiY: [['REACHABLE = confirmed recently; STALE = still used, re-checked on next use; DELAY = wait 5 s; PROBE = ask by unicast; FAILED = give up.', 'REACHABLE = vừa xác nhận; STALE = vẫn dùng, kiểm lại ở lần dùng sau; DELAY = chờ 5 s; PROBE = hỏi bằng unicast; FAILED = bỏ cuộc.'], ['An entry is corrected at once only if someone tells the neighbours.', 'Một mục chỉ được sửa ngay nếu có ai đó báo cho hàng xóm.']],
  loi: [['Restarting the app when the problem is a stale ARP cache.', 'Khởi động lại ứng dụng khi vấn đề là bộ đệm ARP cũ.'], ['Expecting a reply to a gratuitous ARP.', 'Chờ câu trả lời cho gratuitous ARP.']],
  tns: [tn('neighbour table', 'bảng hàng xóm', 'Bảng IP → MAC trong kernel (ip neigh).'), tn('gratuitous ARP', 'ARP tự thông báo'), tn('failover', 'chuyển dự phòng')],
  kn: ['ARP cache', 'failover'],
});

/* ── 4. Tự viết: ARP cho IP nào? ── */
function whoToArp(dstIp, myIp, prefixLen, gateway) {
  function toNum(ip) { return ip.split('.').reduce(function (n, p) { return n * 256 + Number(p); }, 0); }
  // Same network = the first prefixLen bits are equal. Dividing by 2^(32 - prefixLen) keeps the
  // first bits and works for /0 and /32 (a 32-bit shift in JavaScript would wrap around).
  var size = Math.pow(2, 32 - prefixLen);
  var onLink = Math.floor(toNum(dstIp) / size) === Math.floor(toNum(myIp) / size);
  if (onLink) return dstIp;          // the next hop is the destination itself
  return gateway || null;            // otherwise the router — or nobody, if there is no gateway
}
const E4 = jsBai({
  ten: 'ARP 4 — Write whoToArp(dstIp, myIp, prefixLen, gateway)', kho: 'MEDIUM', phut: 15,
  en: `<p>Before the kernel builds a frame it decides the next hop, and ARPs for <b>that</b> IP — not for the final destination. Real capture: the client 10.10.1.10/24 pinging 10.10.2.10 asked only for the router:</p>${pre([NO(ARP[5]), NO(ARP[7])])}<p>Write <code>whoToArp(dstIp, myIp, prefixLen, gateway)</code> that returns the IP address the host must ARP for:</p>
<ul>
<li>If <code>dstIp</code> is in the same network as <code>myIp</code> (the first <code>prefixLen</code> bits are equal) ⇒ <code>dstIp</code> itself.</li>
<li>Otherwise ⇒ <code>gateway</code>; if <code>gateway</code> is <code>null</code> ⇒ <code>null</code> (no way to reach it).</li>
</ul>
<p>Visible cases use the lab (10.10.1.10/24, router 10.10.1.254). Hidden cases use other prefix lengths — /20, /25, /30, /32 and /0 — where reading only the third number of the address is not enough.</p>`,
  vi: `<p>Trước khi dựng frame, kernel chọn chặng kế, và ARP cho IP <b>đó</b> — không phải cho đích cuối. Bản bắt thật: client 10.10.1.10/24 ping 10.10.2.10 chỉ hỏi router:</p>${pre([NO(ARP[5]), NO(ARP[7])])}<p>Viết <code>whoToArp(dstIp, myIp, prefixLen, gateway)</code> trả về địa chỉ IP mà máy phải ARP:</p>
<ul>
<li>Nếu <code>dstIp</code> cùng mạng với <code>myIp</code> (<code>prefixLen</code> bit đầu bằng nhau) ⇒ chính <code>dstIp</code>.</li>
<li>Ngược lại ⇒ <code>gateway</code>; nếu <code>gateway</code> là <code>null</code> ⇒ <code>null</code> (không có cách tới).</li>
</ul>
<p>Ca hiện dùng phòng lab (10.10.1.10/24, router 10.10.1.254). Ca ẩn dùng độ dài tiền tố khác — /20, /25, /30, /32 và /0 — khi chỉ đọc số thứ ba của địa chỉ là không đủ.</p>`,
  dauVao: ['dstIp, myIp — dotted IPv4 strings; prefixLen — 0…32; gateway — a dotted string or null.', 'dstIp, myIp — chuỗi IPv4 dạng chấm; prefixLen — 0…32; gateway — chuỗi dạng chấm hoặc null.'],
  dauRa: ['A dotted IPv4 string, or null.', 'Một chuỗi IPv4 dạng chấm, hoặc null.'],
  goiY: [['Convert both addresses to numbers: a·256³ + b·256² + c·256 + d.', 'Đổi cả hai địa chỉ ra số: a·256³ + b·256² + c·256 + d.'], ['Same first k bits ⇔ Math.floor(x / 2^(32−k)) is equal for both. Check /0 (everything is on-link) and /32 (only the address itself).', 'Cùng k bit đầu ⇔ Math.floor(x / 2^(32−k)) bằng nhau ở cả hai. Thử /0 (mọi thứ cùng mạng) và /32 (chỉ chính địa chỉ đó).']],
  loi: [['Returning dstIp always — the ARP request for 10.10.2.10 would get no answer on this LAN.', 'Luôn trả dstIp — yêu cầu ARP cho 10.10.2.10 sẽ không ai trả lời trên LAN này.'], ['Comparing the first three numbers as strings: right for /24 only.', 'So ba số đầu như chuỗi: chỉ đúng với /24.'], ['Building the mask with (0xffffffff << (32 - k)): for k = 0 JavaScript shifts by 0, so nothing matches.', 'Dựng mặt nạ bằng (0xffffffff << (32 - k)): với k = 0 JavaScript dịch 0 bit, nên không gì khớp.']],
  gt: ['ARP only works inside one broadcast domain, so a host can only resolve the MAC of a machine on its own link: the destination when it is on-link, otherwise the gateway. Whether it is on-link is decided by the prefix — the first k bits — which is why /20 or /25 networks need real bit arithmetic rather than comparing the third number of the address.', 'ARP chỉ chạy trong một miền quảng bá, nên một máy chỉ phân giải được MAC của máy cùng đường truyền: đích khi nó cùng mạng, ngược lại là gateway. Cùng mạng hay không do tiền tố quyết định — k bit đầu — vì thế mạng /20 hay /25 cần tính bit thật chứ không so số thứ ba của địa chỉ.'],
  kn: ['next hop', 'ARP', 'prefix'],
  tns: [tn('next hop', 'chặng kế'), tn('on-link', 'cùng đường truyền'), tn('prefix length', 'độ dài tiền tố')],
  dau: `/** Return the IP to ARP for: dstIp if on-link, else the gateway (or null). */
function whoToArp(dstIp, myIp, prefixLen, gateway) {
  // Write your solution here
  return dstIp;
}
`,
  giai: '// Reference solution\n' + nguon(whoToArp),
  cases: [
    { goi: goi('whoToArp', '10.10.1.11', '10.10.1.10', 24, '10.10.1.254') },
    { goi: goi('whoToArp', '10.10.2.10', '10.10.1.10', 24, '10.10.1.254') },
    { goi: goi('whoToArp', '10.10.1.254', '10.10.1.10', 24, '10.10.1.254') },
    { goi: goi('whoToArp', '172.16.9.4', '172.16.1.9', 20, '172.16.0.1'), an: true },
    { goi: goi('whoToArp', '172.16.17.4', '172.16.1.9', 20, '172.16.0.1'), an: true },
    { goi: goi('whoToArp', '192.168.1.130', '192.168.1.10', 25, '192.168.1.1'), an: true },
    { goi: goi('whoToArp', '192.168.1.100', '192.168.1.10', 25, '192.168.1.1'), an: true },
    { goi: goi('whoToArp', '203.0.113.6', '203.0.113.5', 30, null), an: true },
    { goi: goi('whoToArp', '203.0.113.9', '203.0.113.5', 30, null), an: true },
    { goi: goi('whoToArp', '10.0.0.2', '10.0.0.1', 32, '10.0.0.254'), an: true },
    { goi: goi('whoToArp', '8.8.8.8', '10.0.0.1', 0, null), an: true },
  ],
});

/* ── 5. Tự viết: switch học MAC ── */
function switchSim(frames) {
  var table = {};
  var decisions = frames.map(function (f) {
    var src = f.src.toLowerCase();
    var dst = f.dst.toLowerCase();
    table[src] = f.inPort;                                   // 1. learn (or move) the source first
    var group = parseInt(dst.slice(0, 2), 16) & 1;           // multicast bit; ff:ff:ff:ff:ff:ff has it too
    if (group) return { flood: true };                       // 2. broadcast / multicast ⇒ every other port
    if (!Object.prototype.hasOwnProperty.call(table, dst)) return { flood: true }; // 3. unknown unicast
    if (table[dst] === f.inPort) return { drop: true };     // 4. never send a frame back out of its in-port
    return { port: table[dst] };                             // 5. known ⇒ that one port
  });
  return { decisions: decisions, table: table };
}
const P = { client: 'veth38bd416', client2: 'veth440528e', router: 'veth789efee' };
const M = { client: '02:00:0a:0a:01:0a', client2: '02:00:0a:0a:01:0b', router: '02:00:0a:0a:01:fe' };
const BC = 'ff:ff:ff:ff:ff:ff';
const fr = (a, d) => ({ inPort: P[a], src: M[a], dst: d === 'bc' ? BC : M[d] });
const LAB = [fr('client', 'bc'), fr('client2', 'client'), fr('client', 'client2'), fr('client2', 'client'), fr('client', 'bc'), fr('router', 'client'), fr('client', 'router'), fr('router', 'client')];
const FDB = sauLenh('c13-switch', 'bridge fdb show');
const E5 = jsBai({
  ten: 'ARP 5 — Write switchSim(frames): a learning switch', kho: 'HARD', phut: 30,
  en: `<p>A switch learns where every MAC lives by watching source addresses. This is the real table of the lab's nfd-lan bridge after the ARP capture of exercise 2 (lab/out/c13-switch):</p>${pre(FDB)}<p>Write <code>switchSim(frames)</code>. Each frame is <code>{ inPort, src, dst }</code> (port names may be strings such as <code>'veth38bd416'</code> or numbers). Process the frames in order, starting with an empty table; for each one:</p>
<ol>
<li><b>Learn</b>: <code>table[src] = inPort</code> (a MAC seen on a new port moves there).</li>
<li>Destination is broadcast <code>ff:ff:ff:ff:ff:ff</code> or any multicast address (the lowest bit of the first byte is 1, e.g. <code>01:00:5e:…</code>) ⇒ <code>{ flood: true }</code>.</li>
<li>Destination not in the table ⇒ <code>{ flood: true }</code>.</li>
<li>Destination known on the same port the frame came in ⇒ <code>{ drop: true }</code> (a frame is never sent back out of its in-port).</li>
<li>Otherwise ⇒ <code>{ port: table[dst] }</code>.</li>
</ol>
<p>Return <code>{ decisions, table }</code>. MAC addresses may be written in upper or lower case; table keys must be lower case. The first visible case replays the eight frames of the real ARP capture on the real veth ports — your final table must match <code>bridge fdb show</code>. Hidden cases test moves, unknown destinations, multicast and same-port traffic.</p>`,
  vi: `<p>Switch học mỗi MAC ở đâu bằng cách nhìn địa chỉ nguồn. Đây là bảng thật của bridge nfd-lan trong lab sau bản bắt ARP ở bài 2 (lab/out/c13-switch):</p>${pre(FDB)}<p>Viết <code>switchSim(frames)</code>. Mỗi frame là <code>{ inPort, src, dst }</code> (tên cổng có thể là chuỗi như <code>'veth38bd416'</code> hoặc số). Xử lý các frame theo thứ tự, bắt đầu với bảng rỗng; với mỗi frame:</p>
<ol>
<li><b>Học</b>: <code>table[src] = inPort</code> (MAC thấy ở cổng mới thì chuyển sang đó).</li>
<li>Đích là broadcast <code>ff:ff:ff:ff:ff:ff</code> hoặc bất kỳ địa chỉ multicast nào (bit thấp nhất của byte đầu là 1, vd <code>01:00:5e:…</code>) ⇒ <code>{ flood: true }</code>.</li>
<li>Đích chưa có trong bảng ⇒ <code>{ flood: true }</code>.</li>
<li>Đích đã biết ở đúng cổng frame đi vào ⇒ <code>{ drop: true }</code> (frame không bao giờ bị gửi ngược ra cổng vào).</li>
<li>Còn lại ⇒ <code>{ port: table[dst] }</code>.</li>
</ol>
<p>Trả <code>{ decisions, table }</code>. MAC có thể viết hoa hoặc thường; khoá của bảng phải là chữ thường. Ca hiện đầu tiên phát lại tám frame của bản bắt ARP thật trên các cổng veth thật — bảng cuối của bạn phải khớp <code>bridge fdb show</code>. Ca ẩn thử việc chuyển cổng, đích lạ, multicast và lưu lượng cùng cổng.</p>`,
  dauVao: ['frames — an array of { inPort, src, dst }.', 'frames — mảng { inPort, src, dst }.'],
  dauRa: ['{ decisions: [{ flood: true } | { port } | { drop: true }, …], table: { mac: port } }', '{ decisions: [{ flood: true } | { port } | { drop: true }, …], table: { mac: cổng } }'],
  rangBuoc: [['Learn BEFORE deciding. No aging: entries never expire in this exercise.', 'Học TRƯỚC khi quyết định. Không có hết hạn: mục không bao giờ hết hạn trong bài này.']],
  goiY: [
    ['Start with learning plus "known ⇒ port, unknown ⇒ flood"; that already replays the real ARP capture.', 'Bắt đầu bằng việc học cộng "biết ⇒ cổng, chưa biết ⇒ flood"; thế đã phát lại được bản bắt ARP thật.'],
    ['Multicast test: parseInt(dst.slice(0, 2), 16) & 1. Broadcast ff passes the same test.', 'Kiểm multicast: parseInt(dst.slice(0, 2), 16) & 1. Broadcast ff cũng qua đúng phép thử đó.'],
    ['Lower-case src and dst once at the top, and compare ports with ===.', 'Chuyển src và dst thành chữ thường một lần ở đầu, và so cổng bằng ===.'],
  ],
  loi: [
    ['Deciding before learning: a frame whose destination is its own source then floods instead of being dropped.', 'Quyết định trước khi học: frame có đích chính là nguồn của nó khi đó bị flood thay vì bị bỏ.'],
    ['Learning the destination MAC too — a switch only learns from source addresses.', 'Học cả MAC đích — switch chỉ học từ địa chỉ nguồn.'],
    ['Treating only ff:ff:ff:ff:ff:ff as "flood": 01:00:5e:00:00:fb (mDNS multicast) has no table entry by design.', 'Chỉ coi ff:ff:ff:ff:ff:ff là "flood": 01:00:5e:00:00:fb (multicast mDNS) vốn không bao giờ có mục trong bảng.'],
  ],
  gt: ['A learning switch needs no configuration: the source address of every frame tells it where that card lives, and a destination it has not seen yet is simply flooded — the reply then teaches it the other side. Group addresses (broadcast and multicast) are never sources, so they never enter the table and are always flooded. Filtering same-port frames is what keeps a switch from echoing traffic back onto the segment it came from.', 'Switch học không cần cấu hình: địa chỉ nguồn của mỗi frame cho nó biết card đó ở đâu, và đích chưa từng thấy thì cứ flood — câu trả lời sau đó dạy nó phía bên kia. Địa chỉ nhóm (broadcast và multicast) không bao giờ là nguồn, nên không bao giờ vào bảng và luôn bị flood. Lọc frame cùng cổng giúp switch không dội lưu lượng ngược về đoạn mạng nó vừa đến.'],
  kn: ['MAC learning', 'flooding', 'switch'],
  tns: [tn('MAC table / FDB', 'bảng MAC của switch', 'Forwarding database: MAC → cổng.'), tn('flood', 'gửi ra mọi cổng khác'), tn('filter / drop', 'lọc bỏ'), tn('veth', 'cặp card ảo', 'Dây ảo nối container với bridge.')],
  dau: `/**
 * frames: [{ inPort, src, dst }, …]
 * Return { decisions: [...], table: { "<mac>": port } }.
 */
function switchSim(frames) {
  var table = {};
  var decisions = [];
  // Write your solution here
  return { decisions: decisions, table: table };
}
`,
  giai: '// Reference solution\n' + nguon(switchSim),
  cases: [
    { goi: goi('switchSim', LAB), moTa: ['The real ARP capture replayed on the real veth ports', 'Bản bắt ARP thật phát lại trên các cổng veth thật'] },
    { goi: goi('switchSim', [{ inPort: 1, src: 'aa:aa:aa:aa:aa:01', dst: 'aa:aa:aa:aa:aa:02' }, { inPort: 2, src: 'aa:aa:aa:aa:aa:02', dst: 'aa:aa:aa:aa:aa:01' }]) },
    { goi: goi('switchSim', [{ inPort: 3, src: 'aa:aa:aa:aa:aa:03', dst: BC }]) },
    { goi: goi('switchSim', [{ inPort: 1, src: 'aa:aa:aa:aa:aa:01', dst: BC }, { inPort: 1, src: 'aa:aa:aa:aa:aa:02', dst: 'aa:aa:aa:aa:aa:01' }]), an: true },
    { goi: goi('switchSim', [{ inPort: 1, src: 'aa:aa:aa:aa:aa:01', dst: BC }, { inPort: 2, src: 'aa:aa:aa:aa:aa:02', dst: 'aa:aa:aa:aa:aa:01' }, { inPort: 3, src: 'aa:aa:aa:aa:aa:01', dst: 'aa:aa:aa:aa:aa:02' }, { inPort: 2, src: 'aa:aa:aa:aa:aa:02', dst: 'aa:aa:aa:aa:aa:01' }]), an: true },
    { goi: goi('switchSim', [{ inPort: 'eth1', src: '02:00:0A:0A:01:0A', dst: '01:00:5e:00:00:fb' }, { inPort: 'eth2', src: '02:00:0a:0a:01:0b', dst: '02:00:0A:0A:01:0A' }, { inPort: 'eth1', src: '02:00:0a:0a:01:0a', dst: '33:33:00:00:00:16' }]), an: true },
    { goi: goi('switchSim', [{ inPort: 4, src: 'aa:aa:aa:aa:aa:04', dst: 'aa:aa:aa:aa:aa:04' }]), an: true },
    { goi: goi('switchSim', []), an: true },
  ],
});

/* ── 6. Tự viết: trường nào đổi qua router ── */
function changedFields(textA, textB) {
  // "-T fields -E header=y" prints a header line of field names and one line of values, separated by TABs.
  function read(text) {
    var lines = text.split('\n').filter(function (l) { return l.trim() !== ''; });
    var names = lines[0].split('\t');
    var values = lines[1].split('\t');
    var obj = {};
    names.forEach(function (n, i) { obj[n.trim()] = (values[i] || '').trim(); });
    return { names: names.map(function (n) { return n.trim(); }), obj: obj };
  }
  var a = read(textA), b = read(textB);
  var changed = [], same = [];
  a.names.forEach(function (n) {
    if (!Object.prototype.hasOwnProperty.call(b.obj, n)) return;   // compare only fields present in both
    if (a.obj[n] === b.obj[n]) same.push(n);
    else changed.push({ field: n, a: a.obj[n], b: b.obj[n] });
  });
  return { changed: changed, same: same };                      // in the order of the first capture
}
const T_C = sauLenh('c13-hop-client', 'tshark -r /tmp/h.pcap -Y http.request -T fields').join('\n');
const T_W = sauLenh('c13-hop-web', 'tshark -r /tmp/h.pcap -Y').join('\n');
const tsv = (names, vals) => `${names.join('\t')}\n${vals.join('\t')}`;
const N8 = ['eth.src', 'eth.dst', 'ip.src', 'ip.dst', 'ip.ttl', 'ip.checksum', 'tcp.srcport', 'tcp.dstport'];
// DỰNG cho ca ẩn: (1) cùng gói sau hai router, cột in theo thứ tự khác; (2) "nếu có NAT" — IP nguồn và cổng nguồn bị đổi.
const T_2R = tsv(['ip.ttl', 'eth.dst', 'ip.src', 'eth.src', 'tcp.dstport', 'ip.dst', 'tcp.srcport', 'ip.checksum'], ['62', '02:00:0a:0a:03:0a', '10.10.1.10', '02:00:0a:0a:03:fe', '80', '10.10.2.10', '37070', '0xda64']);
const T_N0 = tsv(N8, ['02:00:0a:0a:01:0a', '02:00:0a:0a:01:fe', '10.10.1.10', '160.187.1.208', '64', '0x1b2c', '41000', '443']);
const T_N1 = tsv(N8, ['02:00:0a:0a:09:fe', '02:00:0a:0a:09:01', '203.0.113.7', '160.187.1.208', '63', '0x7e10', '61001', '443']);
const E6 = jsBai({
  ten: 'ARP 6 — Write changedFields(textA, textB) for the two router-side captures', kho: 'HARD', phut: 25,
  en: `<p>The same request was captured at the same time on both sides of the router (lab/out/c13-hop-client and c13-hop-web):</p>${pre(['# LAN side (client)', T_C, '', '# DMZ side (web server)', T_W])}<p>Write <code>changedFields(textA, textB)</code>. Each text is the output of <code>tshark -T fields -E header=y</code>: a header line of field names and one line of values, separated by <b>tab</b> characters. Return <code>{ changed, same }</code>:</p>
<ul>
<li><code>changed</code> — <code>[{ field, a, b }]</code> for every field present in both texts whose value differs;</li>
<li><code>same</code> — the names of the fields present in both whose value is equal;</li>
<li>both in the column order of <b>textA</b>; fields present in only one text are ignored. The two texts may list their columns in different orders.</li>
</ul>
<p>Visible case: the two real captures. Hidden cases are <b>constructed</b>: the same packet after two routers with the columns in another order, a pair of identical captures, and what a capture before and after a NAT router would look like (Chapter 2) — the only case where the IP address really changes.</p>`,
  vi: `<p>Cùng một request được bắt cùng lúc ở hai phía router (lab/out/c13-hop-client và c13-hop-web):</p>${pre(['# phía LAN (client)', T_C, '', '# phía DMZ (web server)', T_W])}<p>Viết <code>changedFields(textA, textB)</code>. Mỗi đoạn chữ là output của <code>tshark -T fields -E header=y</code>: một dòng tên trường và một dòng giá trị, cách nhau bằng ký tự <b>tab</b>. Trả <code>{ changed, same }</code>:</p>
<ul>
<li><code>changed</code> — <code>[{ field, a, b }]</code> cho mỗi trường có ở cả hai mà giá trị khác nhau;</li>
<li><code>same</code> — tên các trường có ở cả hai mà giá trị bằng nhau;</li>
<li>cả hai theo thứ tự cột của <b>textA</b>; trường chỉ có ở một bên thì bỏ qua. Hai đoạn chữ có thể liệt kê cột theo thứ tự khác nhau.</li>
</ul>
<p>Ca hiện: hai bản bắt thật. Ca ẩn là <b>dựng</b>: cùng gói sau hai router với cột theo thứ tự khác, một cặp bản bắt giống hệt, và bản bắt trước/sau một router NAT sẽ trông thế nào (Chương 2) — trường hợp duy nhất địa chỉ IP thật sự đổi.</p>`,
  dauVao: ['textA, textB — tshark -T fields -E header=y output (two lines, tab-separated).', 'textA, textB — output tshark -T fields -E header=y (hai dòng, cách bằng tab).'],
  dauRa: ['{ changed: [{ field, a, b }], same: [field] }', '{ changed: [{ field, a, b }], same: [field] }'],
  goiY: [
    ['Turn each text into an object { fieldName: value } with split("\\n") and split("\\t"). Keep the list of names of textA for the order.', 'Đổi mỗi đoạn chữ thành object { tênTrường: giáTrị } bằng split("\\n") và split("\\t"). Giữ danh sách tên của textA để giữ thứ tự.'],
    ['Then walk the names of textA: skip names missing in B, otherwise push to same or changed.', 'Rồi duyệt tên của textA: bỏ qua tên B không có, còn lại đẩy vào same hoặc changed.'],
  ],
  loi: [
    ['Comparing the two value lines column by column: with columns in another order every field looks "changed".', 'So hai dòng giá trị theo từng cột: khi cột theo thứ tự khác, trường nào cũng thành "đổi".'],
    ['Concluding "the router changed the IP" from the changed checksum: the checksum changed because the TTL did.', 'Kết luận "router đổi IP" từ checksum đã đổi: checksum đổi vì TTL đổi.'],
  ],
  gt: ['Comparing by field name, not by position, is what makes the comparison robust. On the real pair exactly four fields change — both MACs (a new frame for a new link), the TTL (64 → 63, one router) and the IP checksum (recomputed because a header field changed) — while the IPs and ports stay the same. That is the evidence that answers "did the router rewrite the IP?": no. Only the constructed NAT pair shows ip.src and tcp.srcport changing.', 'So theo tên trường, không theo vị trí, là điều làm phép so bền vững. Ở cặp thật đúng bốn trường đổi — hai MAC (frame mới cho đường truyền mới), TTL (64 → 63, một router) và checksum IP (tính lại vì một trường header đổi) — còn IP và cổng giữ nguyên. Đó là bằng chứng trả lời "router có đổi IP không?": không. Chỉ cặp NAT dựng mới có ip.src và tcp.srcport đổi.'],
  kn: ['hop-by-hop rewriting', 'evidence from captures'],
  tns: [tn('TSV', 'giá trị cách nhau bằng tab'), tn('IP checksum', 'tổng kiểm header IP', 'Phải tính lại khi bất kỳ trường header nào đổi, vd TTL.'), tn('NAT', 'dịch địa chỉ mạng', 'Router đổi địa chỉ IP/cổng — Chương 2.')],
  dau: `/**
 * textA, textB: "tshark -T fields -E header=y" output (header line + values line, TAB-separated).
 * Return { changed: [{ field, a, b }], same: [field] } in the column order of textA.
 */
function changedFields(textA, textB) {
  // Write your solution here
  return { changed: [], same: [] };
}
`,
  giai: '// Reference solution\n' + nguon(changedFields),
  cases: [
    { goi: goi('changedFields', T_C, T_W), moTa: ['The two real captures of lesson 1.4', 'Hai bản bắt thật của bài 1.4'] },
    { goi: goi('changedFields', T_W, T_C), moTa: ['The same pair, the other way round', 'Cùng cặp đó, đảo chiều'] },
    { goi: goi('changedFields', T_C, T_2R), an: true },
    { goi: goi('changedFields', T_C, T_C), an: true },
    { goi: goi('changedFields', T_N0, T_N1), an: true },
    { goi: goi('changedFields', tsv(['ip.src', 'ip.ttl', 'frame.len'], ['10.10.1.10', '64', '149']), tsv(['ip.ttl', 'ip.src'], ['63', '10.10.1.10'])), an: true },
  ],
});

export default doiDau({ slug: 'netdev-1-3-ethernet-arp', ten: '1.4 Ethernet, MAC addresses and ARP', khoa: KHOA, baiHoc: 'netdev-1-3-ethernet-arp', de: [E1, E2, E3, E4, E5, E6] });
