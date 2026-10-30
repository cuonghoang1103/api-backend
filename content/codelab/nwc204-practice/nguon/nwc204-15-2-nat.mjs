/** NWC204 · 15.2 — NAT and PAT. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'NAT 1 — Terms and types', kho: 'EASY', phut: 8,
  en: 'Network address translation basics.', vi: 'Kiến thức nền dịch địa chỉ mạng.',
  cau: [
    q('c1', ['Why is NAT used with IPv4?', 'Vì sao dùng NAT với IPv4?'], ['To let many private hosts share few public addresses', 'To encrypt traffic', 'To speed up routing', 'To replace DNS'], ['IPv4 exhaustion made private addressing + NAT the norm.', 'Cạn kiệt IPv4 khiến địa chỉ riêng + NAT trở thành chuẩn.']),
    q('c2', ['In Cisco terms, “inside local” is …', 'Theo thuật ngữ Cisco, “inside local” là …'], ['the private address of an inside host as seen inside', 'the public address of an inside host', 'the address of an outside host', 'the router’s loopback'], ['Inside global is the public address that represents the host outside.', 'Inside global là địa chỉ công cộng đại diện cho host ra bên ngoài.']),
    q('c3', ['PAT (NAT overload) distinguishes many inside hosts sharing one public IP by …', 'PAT (NAT overload) phân biệt nhiều host trong dùng chung một IP công cộng bằng …'], ['the translated source port number', 'the MAC address', 'the TTL', 'the VLAN'], ['One public address supports ~64,000 simultaneous flows.', 'Một địa chỉ công cộng hỗ trợ khoảng 64.000 luồng cùng lúc.']),
    q('c4', ['Static NAT is used for …', 'NAT tĩnh dùng cho …'], ['an internal server that must be reachable from outside with a fixed public address', 'all user PCs', 'IPv6 only', 'DHCP clients'], ['One-to-one permanent mapping.', 'Ánh xạ một-một cố định.']),
    q('c5', ['A drawback of NAT is …', 'Nhược điểm của NAT là …'], ['it breaks end-to-end addressing and complicates some protocols', 'it uses more IPv4 addresses', 'it makes routing tables larger', 'it removes the need for firewalls'], ['Inbound connections need port forwarding or static NAT.', 'Kết nối đến cần port forwarding hoặc NAT tĩnh.']),
  ],
  goiY: ['Inside/outside describes where the host is; local/global where the address is seen from.', 'Port numbers make PAT work.'],
  loi: ['Believing NAT is a security feature by itself.', 'Mixing up inside global and inside local.'],
  tn: [tn('PAT', 'dịch địa chỉ cổng'), tn('inside global', 'địa chỉ công cộng của host trong')], kn: ['NAT', 'PAT'],
});

const C = [
  { ip: '192.168.1.10', port: 49152, proto: 'tcp' }, { ip: '192.168.1.11', port: 49152, proto: 'tcp' }, { ip: '192.168.1.10', port: 49152, proto: 'tcp' },
  { ip: '192.168.1.10', port: 49153, proto: 'tcp' }, { ip: '192.168.1.10', port: 49152, proto: 'udp' }, { ip: '192.168.1.12', port: 5000, proto: 'udp' },
];
const PT = S.patSim('203.0.113.1', 50000, C);
const E2 = tinh({
  tieuDe: 'NAT 2 — Build the PAT table', doKho: 'MEDIUM', phut: 12,
  moTa: mt('A router translates outbound connections to 203.0.113.1 (PAT). New flows (protocol + inside IP + port) get the next free public port starting at 50000; packets of an existing flow reuse their translation. Give the inside global address:port of each packet.', 'Router dịch kết nối ra ngoài sang 203.0.113.1 (PAT). Luồng mới (giao thức + IP trong + cổng) nhận cổng công cộng rảnh kế tiếp bắt đầu từ 50000; gói của luồng đã có dùng lại phép dịch. Cho địa chỉ:cổng inside global của từng gói.'),
  loai: 'table',
  bang: [bang1('b1', ['PAT translations', 'Bảng dịch PAT'], [{ ma: 'p', ten: 'Packet (inside local)' }, { ma: 'g', ten: 'Inside global' }],
    C.map((c, i) => ({ o: { p: `#${i + 1} ${c.proto.toUpperCase()} ${c.ip}:${c.port}` }, a: { g: [PT[i]] } })),
    [PT.map((g, i) => `#${i + 1} → ${g}`).join('; ') + '. TCP and UDP flows are different entries even with the same IP and port.', 'Luồng TCP và UDP là mục khác nhau dù cùng IP và cổng.'])],
  goiY: ['Make a list of flows already seen.', 'A new flow takes the next number; a repeated one reuses it.'],
  loiHayGap: ['Giving the repeated packet a new port.', 'Treating TCP and UDP with the same port as one flow.'],
  thuatNgu: [tn('translation table', 'bảng dịch')], khaiNiem: ['PAT'],
});

const E3 = js({
  ten: 'NAT 3 — Write patSim(pubIp, startPort, conns)', kho: 'MEDIUM', phut: 15,
  en: '<p>Write <code>patSim(pubIp, startPort, conns)</code> where <code>conns</code> is <code>[{ ip, port, proto }]</code>. A flow is the triple (proto, ip, port). The first time a flow appears it gets the next public port (<code>startPort</code>, then +1 …); repeats reuse it. Return an array of <code>"pubIp:port"</code>, one per connection.</p>',
  vi: '<p>Viết <code>patSim(pubIp, startPort, conns)</code> với <code>conns</code> là <code>[{ ip, port, proto }]</code>. Một luồng là bộ ba (proto, ip, port). Lần đầu xuất hiện luồng nhận cổng công cộng kế tiếp (<code>startPort</code>, rồi +1 …); lặp lại dùng lại. Trả mảng <code>"pubIp:port"</code>, mỗi kết nối một phần tử.</p>',
  fn: 'patSim', params: 'pubIp, startPort, conns', ref: S.patSim,
  cases: [['203.0.113.1', 50000, C], ['198.51.100.7', 1024, [{ ip: '10.0.0.1', port: 1, proto: 'tcp' }]], ['203.0.113.1', 50000, []], ['1.2.3.4', 60000, [{ ip: 'a', port: 1, proto: 'tcp' }, { ip: 'a', port: 1, proto: 'udp' }, { ip: 'a', port: 1, proto: 'tcp' }]], ['5.5.5.5', 65534, [{ ip: 'x', port: 1, proto: 'tcp' }, { ip: 'y', port: 1, proto: 'tcp' }, { ip: 'z', port: 1, proto: 'tcp' }]]],
  goiY: ['Use an object keyed by proto|ip:port.', 'Increment the next-port counter only for new flows.'],
  loi: ['Incrementing the port for every packet.', 'Leaving the protocol out of the key.'],
  gt: ['The translation table is the entire state of PAT; losing it breaks all active connections (why NAT boxes are state-sensitive).', 'Bảng dịch là toàn bộ trạng thái của PAT; mất nó là đứt mọi kết nối đang chạy.'],
  kn: ['PAT'],
});

const EV = [['open', 'h1'], ['open', 'h2'], ['open', 'h3'], ['close', 'h1'], ['open', 'h3'], ['open', 'h4'], ['close', 'h2'], ['open', 'h5']];
const POOL = ['203.0.113.10', '203.0.113.11'];
const E4 = js({
  ten: 'NAT 4 — Dynamic NAT with a limited pool', kho: 'HARD', phut: 18,
  en: '<p>Write <code>poolNat(pool, events)</code>. Events are <code>["open", host]</code> and <code>["close", host]</code>. An <code>open</code> gives the host the first free address of <code>pool</code> (hosts that already hold an address keep it); when the pool is exhausted the host gets <code>null</code>. A <code>close</code> returns the host’s address to the pool. Return the results of the <code>open</code> events only, in order.</p>',
  vi: '<p>Viết <code>poolNat(pool, events)</code>. Sự kiện là <code>["open", host]</code> và <code>["close", host]</code>. <code>open</code> cấp cho host địa chỉ rảnh đầu tiên của <code>pool</code> (host đã có địa chỉ thì giữ nguyên); hết địa chỉ thì host nhận <code>null</code>. <code>close</code> trả địa chỉ của host về pool. Chỉ trả kết quả của các sự kiện <code>open</code>, theo thứ tự.</p>',
  fn: 'poolNat', params: 'pool, events', ref: S.poolNat,
  cases: [[POOL, EV], [POOL, [['open', 'a'], ['open', 'a']]], [[], [['open', 'a']]], [['X'], [['close', 'z'], ['open', 'a'], ['open', 'b'], ['close', 'a'], ['open', 'b']]], [POOL, []]],
  goiY: ['Track which pool addresses are used and which address each host holds.', 'Free the address on close, and ignore closing unknown hosts.'],
  loi: ['Giving a host a second address on a repeated open.', 'Pushing results for close events as well.'],
  gt: ['Dynamic NAT runs out of addresses when there are more simultaneous users than pool entries; that is why overload (PAT) was invented.', 'NAT động hết địa chỉ khi số người dùng đồng thời vượt pool; đó là lý do ra đời overload (PAT).'],
  kn: ['dynamic NAT'],
});

void tinh; void q;
export default doiDau({ slug: 'nwc204-15-2-nat', ten: '15.2 NAT and PAT', khoa: KHOA, baiHoc: 'nwc204-15-1-moi-de-doa-va-cac-kieu-tan-cong', de: [E1, E2, E3, E4] });
