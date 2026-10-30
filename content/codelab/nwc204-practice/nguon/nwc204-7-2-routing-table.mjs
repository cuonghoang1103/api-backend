/** NWC204 · 7.2 — Host routing decisions and router tables (longest prefix match). */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'Routing 1 — Reading a routing table', kho: 'EASY', phut: 8,
  en: 'Codes and concepts of a Cisco routing table.', vi: 'Mã và khái niệm trong bảng định tuyến Cisco.',
  cau: [
    q('c1', ['In “show ip route”, the code C means …', 'Trong “show ip route”, mã C nghĩa là …'], ['directly connected network', 'static route set by hand', 'route learned through OSPF', 'default route to the ISP'], ['C = connected, L = local interface address, S = static, O = OSPF, S* = default.', 'C = nối trực tiếp, L = địa chỉ cục bộ, S = tĩnh, O = OSPF, S* = mặc định.']),
    q('c2', ['The route 0.0.0.0/0 is …', 'Tuyến 0.0.0.0/0 là …'], ['the default route that matches every destination', 'a loopback route that points at the router itself', 'a multicast route that matches every group address', 'an invalid route that the router will never install'], ['Prefix length 0 matches everything but loses to any longer match.', 'Prefix dài 0 khớp tất cả nhưng thua mọi tuyến dài hơn.']),
    q('c3', ['The router has 10.0.0.0/8 and 10.1.0.0/16. A packet to 10.1.5.5 uses …', 'Router có 10.0.0.0/8 và 10.1.0.0/16. Gói tới 10.1.5.5 dùng …'], ['10.1.0.0/16', '10.0.0.0/8', 'both, load balanced', 'neither'], ['Longest prefix match: the most specific matching route wins.', 'Khớp tiền tố dài nhất: tuyến khớp cụ thể nhất thắng.']),
    q('c4', ['No route matches and there is no default route. The router …', 'Không tuyến nào khớp và không có default route. Router …'], ['drops the packet and sends ICMP Destination Unreachable', 'floods it out of all interfaces except the incoming one', 'sends it back to the previous hop for another try', 'queues it until a matching route is learned'], ['No match = no forwarding.', 'Không khớp = không chuyển.']),
    q('c5', ['A lower administrative distance means the route source is …', 'Administrative distance thấp hơn nghĩa là nguồn tuyến …'], ['more trusted', 'less trusted', 'slower', 'longer'], ['Connected 0, static 1, EIGRP 90, OSPF 110, RIP 120.', 'Nối trực tiếp 0, tĩnh 1, EIGRP 90, OSPF 110, RIP 120.']),
  ],
  goiY: ['Match first by longest prefix, then by AD, then by metric.', 'The default route is the least specific.'],
  loi: ['Choosing the first matching line.', 'Thinking a higher AD is better.'],
  tn: [tn('longest prefix match', 'khớp tiền tố dài nhất'), tn('administrative distance', 'độ tin cậy nguồn tuyến')], kn: ['routing table'],
});

const RT = [{ net: '0.0.0.0/0', nh: 'ISP' }, { net: '10.0.0.0/8', nh: 'R-A' }, { net: '10.1.0.0/16', nh: 'R-B' }, { net: '10.1.2.0/24', nh: 'R-C' }, { net: '192.168.0.0/16', nh: 'R-D' }, { net: '192.168.5.0/25', nh: 'R-E' }];
const DS = ['10.1.2.77', '10.1.200.1', '10.200.1.1', '192.168.5.100', '192.168.5.200', '8.8.8.8'];
const E2 = tinh({
  tieuDe: 'Routing 2 — Longest prefix match', doKho: 'MEDIUM', phut: 12,
  moTa: mt('Routing table: ' + RT.map((r) => `${r.net} via ${r.nh}`).join('; ') + '. Which next hop does the router use for each destination?', 'Bảng định tuyến: ' + RT.map((r) => `${r.net} qua ${r.nh}`).join('; ') + '. Router dùng next hop nào cho mỗi đích?'),
  loai: 'table',
  bang: [bang1('b1', ['Next hop', 'Next hop'], [{ ma: 'd', ten: 'Destination' }, { ma: 'n', ten: 'Next hop', luaChon: ['ISP', 'R-A', 'R-B', 'R-C', 'R-D', 'R-E'] }],
    DS.map((d) => ({ o: { d }, a: { n: [S.lpm(RT, d).nh] } })),
    [DS.map((d) => `${d} → ${S.lpm(RT, d).net} via ${S.lpm(RT, d).nh}`).join('; ') + '.', 'Chọn tuyến khớp với prefix dài nhất.'])],
  goiY: ['List every matching route, then take the longest prefix.', '/25 covers 192.168.5.0–127 only.'],
  loiHayGap: ['Stopping at the first match.', 'Assuming 192.168.5.200 is covered by the /25.'],
  thuatNgu: [tn('next hop', 'chặng kế tiếp')], khaiNiem: ['longest prefix match'],
});

const HT = [['192.168.1.20', 24, '192.168.1.1', '192.168.1.99'], ['192.168.1.20', 24, '192.168.1.1', '192.168.2.5'], ['10.0.0.130', 25, '10.0.0.129', '10.0.0.5'], ['172.16.5.9', 20, '172.16.0.1', '172.16.15.200'], ['172.16.5.9', 20, '172.16.0.1', '172.16.16.1']];
const E3 = tinh({
  tieuDe: 'Routing 3 — The host’s own decision', doKho: 'MEDIUM', phut: 10,
  moTa: mt('A host with the given IP/prefix and default gateway wants to send to a destination. Does it ARP for the <b>destination</b> (same network, deliver directly) or for the <b>gateway</b>?', 'Host với IP/prefix và default gateway cho trước muốn gửi tới một đích. Nó ARP cho <b>đích</b> (cùng mạng, gửi trực tiếp) hay cho <b>gateway</b>?'),
  loai: 'table',
  bang: [bang1('b1', ['Host decision', 'Quyết định của host'], [{ ma: 'x', ten: 'Host / gateway / destination' }, { ma: 'a', ten: 'ARP for', luaChon: ['destination', 'gateway'] }],
    HT.map(([ip, p, gw, d]) => ({ o: { x: `${ip}/${p}, gw ${gw}, dst ${d}` }, a: { a: [S.sameNetwork(ip, d, p) ? 'destination' : 'gateway'] } })),
    [HT.map(([ip, p, , d]) => `${d}: ${S.sameNetwork(ip, d, p) ? 'same network → destination' : 'other network → gateway'}`).join('; ') + '.', 'Cùng mạng → đích; khác mạng → gateway.'])],
  goiY: ['AND both addresses with the mask and compare.', 'The destination IP in the packet stays the remote host either way.'],
  loiHayGap: ['Sending to the gateway for a local host.', 'Replacing the destination IP with the gateway’s IP.'],
  thuatNgu: [tn('default gateway', 'cổng mặc định')], khaiNiem: ['host forwarding'],
});

function bestRoute(routes, dst) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  var d = toInt(dst), best = null, bl = -1;
  for (var i = 0; i < routes.length; i++) {
    var r = routes[i], c = r.net.split('/'), len = +c[1], m = len === 0 ? 0 : (0xFFFFFFFF << (32 - len)) >>> 0;
    if (((d & m) >>> 0) !== ((toInt(c[0]) & m) >>> 0)) continue;
    if (best === null || len > bl || (len === bl && (r.ad < best.ad || (r.ad === best.ad && r.metric < best.metric)))) { best = r; bl = len; }
  }
  return best === null ? null : best.nh;
}
const E4 = js({
  ten: 'Routing 4 — Write nextHop(routes, dst)', kho: 'MEDIUM', phut: 18,
  en: '<p>Write <code>nextHop(routes, dst)</code>. <code>routes</code> is <code>[{ net: "10.0.0.0/8", nh: "A" }]</code>; return the <code>nh</code> of the matching route with the longest prefix (ties: the earlier route), or <code>null</code> when nothing matches.</p>',
  vi: '<p>Viết <code>nextHop(routes, dst)</code>. <code>routes</code> là <code>[{ net: "10.0.0.0/8", nh: "A" }]</code>; trả <code>nh</code> của tuyến khớp có prefix dài nhất (hoà: tuyến đứng trước), hoặc <code>null</code> nếu không khớp.</p>',
  fn: 'nextHop', params: 'routes, dst',
  ref: function nextHop(routes, dst) {
    function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
    var d = toInt(dst), best = null, bl = -1;
    for (var i = 0; i < routes.length; i++) {
      var c = routes[i].net.split('/'), len = +c[1], m = len === 0 ? 0 : (0xFFFFFFFF << (32 - len)) >>> 0;
      if (((d & m) >>> 0) === ((toInt(c[0]) & m) >>> 0) && len > bl) { best = routes[i]; bl = len; }
    }
    return best === null ? null : best.nh;
  },
  cases: [[RT, '10.1.2.77'], [RT, '10.200.1.1'], [RT, '8.8.8.8'], [RT, '192.168.5.200'], [RT.slice(1), '8.8.8.8'], [[{ net: '10.0.0.0/8', nh: 'X' }, { net: '10.0.0.0/8', nh: 'Y' }], '10.9.9.9'], [[{ net: '1.2.3.4/32', nh: 'H' }, { net: '1.2.3.0/24', nh: 'N' }], '1.2.3.4'], [[], '1.1.1.1']],
  goiY: ['Convert the address and the network to 32-bit integers (use >>> 0 to keep them unsigned).', 'Build the mask as (0xFFFFFFFF << (32 - len)) >>> 0, careful with len = 0.'],
  loi: ['Shifting by 32 for /0 (JavaScript wraps the shift count).', 'Choosing the last match instead of the longest.'],
  gt: ['This is the lookup every router performs for every packet, done in hardware with TCAMs.', 'Đây là phép tra mọi router làm cho mọi gói, thực hiện bằng phần cứng TCAM.'],
  kn: ['longest prefix match'],
});

const R5 = [{ net: '10.0.0.0/8', nh: 'OSPF', ad: 110, metric: 20 }, { net: '10.0.0.0/8', nh: 'STATIC-BACKUP', ad: 200, metric: 0 }, { net: '10.0.0.0/8', nh: 'RIP', ad: 120, metric: 2 }, { net: '10.0.0.0/8', nh: 'EIGRP', ad: 90, metric: 3000 }, { net: '10.0.0.0/8', nh: 'EIGRP2', ad: 90, metric: 2000 }, { net: '10.2.0.0/16', nh: 'STATIC', ad: 1, metric: 0 }];
const E5 = js({
  ten: 'Routing 5 — Choosing between routes: prefix, then AD, then metric', kho: 'HARD', phut: 20,
  en: '<p>Write <code>bestRoute(routes, dst)</code> where routes are <code>{ net, nh, ad, metric }</code>. Among the matching routes pick the longest prefix; for equal prefixes the lowest administrative distance <code>ad</code>; for equal AD the lowest <code>metric</code>; if still tied the earlier route. Return its <code>nh</code> or <code>null</code>.</p>',
  vi: '<p>Viết <code>bestRoute(routes, dst)</code> với route là <code>{ net, nh, ad, metric }</code>. Trong các tuyến khớp chọn prefix dài nhất; cùng prefix thì chọn administrative distance <code>ad</code> thấp nhất; cùng AD thì chọn <code>metric</code> thấp nhất; vẫn hoà thì lấy tuyến đứng trước. Trả <code>nh</code> của nó hoặc <code>null</code>.</p>',
  fn: 'bestRoute', params: 'routes, dst', ref: bestRoute,
  cases: [[R5, '10.9.9.9'], [R5, '10.2.3.4'], [R5.slice(0, 3), '10.1.1.1'], [R5.slice(0, 2), '10.1.1.1'], [R5.slice(0, 2), '11.1.1.1'], [R5.slice(3, 5), '10.1.1.1'], [[], '1.1.1.1']],
  goiY: ['Compare prefix length first; only then look at ad, then metric.', 'Use strict comparisons so earlier routes win ties.'],
  loi: ['Comparing AD before the prefix length.', 'Treating a larger metric as better.'],
  gt: ['A floating static route (AD 200) stays invisible until the dynamic route disappears.', 'Tuyến tĩnh “nổi” (AD 200) bị che cho tới khi tuyến động biến mất.'],
  kn: ['administrative distance'],
});

const E6 = cs({
  ten: 'Routing 6 — Router decisions in numbers', kho: 'HARD', phut: 10,
  en: 'Work out the result.', vi: 'Tính kết quả.',
  cau: [
    mcNum('c1', ['A route to 172.16.0.0/16 exists via OSPF (AD 110) and via a static route with AD 150. Which AD is installed?', 'Tuyến tới 172.16.0.0/16 có qua OSPF (AD 110) và qua tuyến tĩnh AD 150. AD nào được cài?'], 110, [150, 1, 0], null, ['The lowest AD wins, so OSPF is installed and the static route floats as backup.', 'AD thấp nhất thắng nên OSPF được cài, tuyến tĩnh làm dự phòng.']),
    q('c2', ['Why does “ip route 0.0.0.0 0.0.0.0 203.0.113.1” make a router reach the whole Internet?', 'Vì sao “ip route 0.0.0.0 0.0.0.0 203.0.113.1” giúp router tới được toàn Internet?'], ['It matches every destination with no more specific route', 'It copies the full routing table of the ISP', 'It replaces all other routes with this one entry', 'It enables NAT towards that next hop'], ['A /0 prefix is the catch-all.', 'Prefix /0 là tuyến bắt tất cả.']),
    q('c3', ['A router forwards a packet. The source MAC at the output link is …', 'Router chuyển một gói. MAC nguồn ở liên kết ra là …'], ['the MAC of the router’s outgoing interface', 'the MAC of the original sending host', 'the MAC of the final destination host', 'ff:ff:ff:ff:ff:ff'], ['A new frame is built on every link.', 'Mỗi liên kết có một frame mới.']),
    mcNum('c4', ['How many addresses does a /27 route summarise?', 'Một tuyến /27 tóm tắt bao nhiêu địa chỉ?'], 32, [30, 27, 64], null, ['2^(32−27) = 32 addresses.', '2^(32−27) = 32 địa chỉ.']),
  ],
  goiY: ['Prefix first, AD second, metric third.', 'The destination IP never changes; MACs change at every hop.'],
  loi: ['Letting a lower AD override a longer prefix.', 'Mixing up a route’s prefix length and its AD.'],
  tn: [tn('floating static route', 'tuyến tĩnh nổi')], kn: ['router decisions'],
});

export default doiDau({ slug: 'nwc204-7-2-routing-table', ten: '7.2 Routing tables and longest prefix match', khoa: KHOA, baiHoc: 'nwc204-7-2-goi-ipv6-va-bang-dinh-tuyen', de: [E1, E2, E3, E4, E5, E6] });
