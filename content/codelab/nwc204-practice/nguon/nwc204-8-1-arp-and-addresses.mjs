/** NWC204 · 8.1 — MAC and IP together: ARP and the headers on every link. */
import { doiDau, KHOA, tinh, q, ord, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'ARP 1 — Why two addresses and what ARP does', kho: 'EASY', phut: 8,
  en: 'Concepts of ARP.', vi: 'Khái niệm về ARP.',
  cau: [
    q('c1', ['ARP resolves …', 'ARP phân giải …'], ['an IPv4 address to a MAC address', 'a MAC address to an IPv4 address', 'a hostname to an IP address', 'a port to a service'], ['IP says who; MAC says which NIC on this link.', 'IP nói là ai; MAC nói NIC nào trên liên kết này.']),
    q('c2', ['An ARP request is sent to …', 'Yêu cầu ARP được gửi tới …'], ['the broadcast MAC address', 'the unicast MAC of the target', 'the default gateway only', 'the DNS server'], ['“Who has 192.168.1.1? Tell 192.168.1.10” — everyone on the LAN hears it.', '“Ai có 192.168.1.1? Báo cho 192.168.1.10” — mọi máy trên LAN đều nghe.']),
    q('c3', ['An ARP reply is sent …', 'Phản hồi ARP được gửi …'], ['unicast to the requester', 'broadcast to everyone', 'to the router', 'multicast'], ['The target already knows the requester’s MAC from the request.', 'Máy đích đã biết MAC của người hỏi từ yêu cầu.']),
    q('c4', ['To reach a host on another network, a PC ARPs for …', 'Để tới host ở mạng khác, PC ARP cho …'], ['the MAC address of its default gateway', 'the MAC address of the remote host', 'the MAC of the DNS server', 'the MAC of the ISP'], ['The remote MAC is unreachable across routers; only the gateway’s MAC matters locally.', 'MAC của host xa không tới được qua router; chỉ MAC gateway có ý nghĩa cục bộ.']),
    q('c5', ['The ARP cache entries are kept …', 'Mục trong ARP cache được giữ …'], ['for a limited time (minutes) and then aged out', 'forever', 'only on routers', 'for exactly one packet'], ['Windows keeps dynamic entries for a few minutes; Cisco IOS for 4 hours by default.', 'Windows giữ vài phút; Cisco IOS mặc định 4 giờ.']),
    q('c6', ['IPv6 replaces ARP with …', 'IPv6 thay ARP bằng …'], ['Neighbor Discovery (ICMPv6 NS/NA)', 'RARP', 'DHCPv6', 'DNS'], ['NS/NA use solicited-node multicast instead of broadcast.', 'NS/NA dùng multicast solicited-node thay cho broadcast.']),
  ],
  goiY: ['ARP works only inside one broadcast domain.', 'Request = broadcast, reply = unicast.'],
  loi: ['Saying a PC ARPs for the server across the Internet.', 'Believing the ARP reply is broadcast.'],
  tn: [tn('ARP cache', 'bộ nhớ đệm ARP')], kn: ['ARP'],
});

const E2 = tinh({
  tieuDe: 'ARP 2 — Order the steps for a remote destination', doKho: 'MEDIUM', phut: 8,
  moTa: mt('PC1 (192.168.1.10/24, gateway 192.168.1.1) pings a server on another network for the first time. ARP caches are empty. Put the steps in order.', 'PC1 (192.168.1.10/24, gateway 192.168.1.1) ping server ở mạng khác lần đầu. ARP cache đều rỗng. Sắp các bước theo thứ tự.'),
  loai: 'order',
  cauHoi: [ord('q1', ['First ping to a remote host', 'Lần ping đầu tới host xa'], ['PC1 sees the server is NOT in its network (AND with the mask)', 'PC1 broadcasts an ARP request for 192.168.1.1', 'The router replies with its MAC address (unicast)', 'PC1 builds the ICMP echo: dst IP = server, dst MAC = router’s MAC', 'The router routes the packet and sends it out of the next interface in a new frame'], ['The destination IP stays the server; the destination MAC is the gateway’s.', 'IP đích vẫn là server; MAC đích là của gateway.'], 2)],
  goiY: ['The AND test comes before any ARP.', 'ARP is for the gateway, not the server.'],
  loiHayGap: ['ARPing for the server’s IP.', 'Putting the router’s IP in the destination IP field.'],
  thuatNgu: [tn('echo request', 'yêu cầu echo')], khaiNiem: ['ARP flow'],
});

const PC = { ip: '192.168.1.10', mac: 'PC-A' }, SV = { ip: '10.0.9.9', mac: 'SRV' };
const RS = [{ inMac: 'R1-g0', outMac: 'R1-g1' }, { inMac: 'R2-g0', outMac: 'R2-g1' }];
function hopHeaders(src, routers, dst) {
  var out = [];
  for (var i = 0; i <= routers.length; i++) {
    out.push({ srcMac: i === 0 ? src.mac : routers[i - 1].outMac, dstMac: i === routers.length ? dst.mac : routers[i].inMac, srcIp: src.ip, dstIp: dst.ip });
  }
  return out;
}
const H = hopHeaders(PC, RS, SV);
const E3 = tinh({
  tieuDe: 'ARP 3 — Headers on every link', doKho: 'MEDIUM', phut: 12,
  moTa: mt('A packet goes PC-A → R1 → R2 → SRV (no NAT). The interface MACs are: PC-A, R1-g0 (towards the PC), R1-g1, R2-g0, R2-g1 (towards the server) and SRV. IPs: PC-A 192.168.1.10, SRV 10.0.9.9. Fill the addresses in the frame on each of the three links.', 'Gói đi PC-A → R1 → R2 → SRV (không NAT). MAC các giao diện: PC-A, R1-g0 (phía PC), R1-g1, R2-g0, R2-g1 (phía server) và SRV. IP: PC-A 192.168.1.10, SRV 10.0.9.9. Điền địa chỉ trong frame trên từng liên kết trong ba liên kết.'),
  loai: 'table',
  bang: [bang1('b1', ['Frames on the three links', 'Frame trên ba liên kết'], [{ ma: 'l', ten: 'Link' }, { ma: 's', ten: 'Src MAC', luaChon: ['PC-A', 'R1-g0', 'R1-g1', 'R2-g0', 'R2-g1', 'SRV'] }, { ma: 'd', ten: 'Dst MAC', luaChon: ['PC-A', 'R1-g0', 'R1-g1', 'R2-g0', 'R2-g1', 'SRV'] }, { ma: 'si', ten: 'Src IP', luaChon: ['192.168.1.10', '10.0.9.9'] }, { ma: 'di', ten: 'Dst IP', luaChon: ['192.168.1.10', '10.0.9.9'] }],
    ['PC-A → R1', 'R1 → R2', 'R2 → SRV'].map((l, i) => ({ o: { l }, a: { s: [H[i].srcMac], d: [H[i].dstMac], si: [H[i].srcIp], di: [H[i].dstIp] } })),
    ['MACs change at every link (src = sender’s outgoing interface, dst = next hop’s incoming interface); IPs stay PC-A → SRV end to end.', 'MAC đổi ở mỗi liên kết (nguồn = giao diện ra của bên gửi, đích = giao diện vào của chặng kế); IP giữ nguyên PC-A → SRV.'])],
  goiY: ['The destination MAC is the next device’s MAC on that link.', 'IPs never change without NAT.'],
  loiHayGap: ['Writing SRV’s MAC on the first link.', 'Changing the IP addresses at the routers.'],
  thuatNgu: [tn('next hop', 'chặng kế')], khaiNiem: ['hop-by-hop addressing'],
});

const E4 = js({
  ten: 'ARP 4 — Write hopHeaders(src, routers, dst)', kho: 'MEDIUM', phut: 15,
  en: '<p>Write <code>hopHeaders(src, routers, dst)</code> where <code>src</code>/<code>dst</code> are <code>{ ip, mac }</code> and <code>routers</code> is an array of <code>{ inMac, outMac }</code> in path order. Return one header per link: <code>{ srcMac, dstMac, srcIp, dstIp }</code>. With no routers there is one link (both hosts on the same LAN).</p>',
  vi: '<p>Viết <code>hopHeaders(src, routers, dst)</code> với <code>src</code>/<code>dst</code> là <code>{ ip, mac }</code> và <code>routers</code> là mảng <code>{ inMac, outMac }</code> theo thứ tự đường đi. Trả một header cho mỗi liên kết: <code>{ srcMac, dstMac, srcIp, dstIp }</code>. Không có router thì chỉ một liên kết (hai host cùng LAN).</p>',
  fn: 'hopHeaders', params: 'src, routers, dst', ref: hopHeaders,
  cases: [[PC, RS, SV], [PC, [], { ip: '192.168.1.20', mac: 'PC-B' }], [PC, [{ inMac: 'G0', outMac: 'G1' }], SV], [{ ip: '1.1.1.1', mac: 'a' }, [{ inMac: 'b', outMac: 'c' }, { inMac: 'd', outMac: 'e' }, { inMac: 'f', outMac: 'g' }], { ip: '2.2.2.2', mac: 'h' }]],
  goiY: ['There are routers.length + 1 links.', 'Link i leaves router i − 1 (outMac) and enters router i (inMac).'],
  loi: ['Using the destination host’s MAC on every link.', 'Off-by-one on the first and last link.'],
  gt: ['This is what Wireshark shows at each hop: same IPs, different MACs.', 'Đây là điều Wireshark hiển thị ở mỗi chặng: IP giống, MAC khác.'],
  kn: ['hop-by-hop addressing'],
});

const E5 = cs({
  ten: 'ARP 5 — Read the ARP table and symptoms', kho: 'HARD', phut: 10,
  en: 'Diagnose with arp -a / show ip arp.', vi: 'Chẩn đoán với arp -a / show ip arp.',
  cau: [
    q('c1', ['The ARP table shows two different IPs with the SAME MAC address, 00:50:56:aa:bb:cc, and one is the gateway. Possible meaning?', 'Bảng ARP có hai IP khác nhau cùng một MAC 00:50:56:aa:bb:cc, và một là gateway. Có thể là?'], ['Proxy ARP or ARP spoofing; investigate', 'Normal behaviour of every LAN', 'The two hosts are one switch port', 'The DHCP lease expired'], ['The gateway’s MAC being shared with a second IP is suspicious.', 'MAC của gateway dùng chung với một IP khác là đáng ngờ.']),
    q('c2', ['“Incomplete” appears for 192.168.1.50 in show ip arp. It means …', '“Incomplete” xuất hiện cho 192.168.1.50 trong show ip arp. Nghĩa là …'], ['the ARP request was sent but no reply came', 'the entry is permanent', 'the host is the router itself', 'the MAC is multicast'], ['The host is down, unplugged or on a different VLAN.', 'Host tắt, chưa cắm hoặc ở VLAN khác.']),
    q('c3', ['A gratuitous ARP is …', 'Gratuitous ARP là …'], ['a host announcing its own IP-to-MAC mapping (also used to detect duplicate IPs)', 'a reply to the router', 'a DNS cache flush', 'an ARP request for the gateway'], ['It updates other hosts’ caches after a change.', 'Nó cập nhật cache của các máy khác sau thay đổi.']),
    q('c4', ['Which attack poisons ARP caches so that the attacker sits in the middle?', 'Tấn công nào làm nhiễm ARP cache để kẻ tấn công nằm giữa?'], ['ARP spoofing / poisoning', 'DNS amplification', 'SYN flood', 'Smurf'], ['Dynamic ARP Inspection on the switch defends against it.', 'Dynamic ARP Inspection trên switch chống lại nó.']),
  ],
  goiY: ['Incomplete = no answer. Duplicate MACs for different IPs need explanation.', 'ARP has no authentication.'],
  loi: ['Treating an incomplete entry as a router fault.', 'Trusting an ARP table without cross-checking the switch.'],
  tn: [tn('ARP spoofing', 'giả mạo ARP')], kn: ['ARP troubleshooting'],
});

export default doiDau({ slug: 'nwc204-8-1-arp-and-addresses', ten: '8.1 MAC, IP and ARP', khoa: KHOA, baiHoc: 'nwc204-8-2-arp-va-neighbor-discovery', de: [E1, E2, E3, E4, E5] });
