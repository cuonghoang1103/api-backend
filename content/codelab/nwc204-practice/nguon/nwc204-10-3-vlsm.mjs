/** NWC204 · 10.3 — VLSM: variable length subnet masks. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'VLSM 1 — Why and how', kho: 'EASY', phut: 8,
  en: 'Concepts of variable length subnet masks.', vi: 'Khái niệm mặt nạ mạng con độ dài thay đổi.',
  cau: [
    q('c1', ['VLSM lets you …', 'VLSM cho phép …'], ['use different prefix lengths for different subnets of one block', 'use the same mask everywhere', 'avoid subnetting', 'route without masks'], ['Each subnet gets the smallest block that fits its hosts.', 'Mỗi mạng con nhận khối nhỏ nhất đủ host.']),
    q('c2', ['In a VLSM plan you allocate the subnets in the order …', 'Trong kế hoạch VLSM, bạn cấp mạng con theo thứ tự …'], ['largest requirement first', 'smallest requirement first', 'alphabetical', 'random'], ['Largest first keeps every block aligned and avoids gaps and overlaps.', 'Lớn trước giữ mọi khối thẳng hàng, tránh khe hở và chồng lấn.']),
    q('c3', ['A point-to-point WAN link between two routers needs a …', 'Liên kết WAN điểm-điểm giữa hai router cần …'], ['/30 (2 usable hosts)', '/24', '/28', '/16'], ['Anything bigger wastes addresses; /31 is possible with RFC 3021.', 'Lớn hơn thì phí; /31 cũng được theo RFC 3021.']),
    q('c4', ['Two subnets overlap when …', 'Hai mạng con chồng lấn khi …'], ['one address belongs to both of them', 'they have the same prefix length', 'they are in different VLANs', 'they use private addresses'], ['Routing becomes ambiguous; the allocation is wrong.', 'Định tuyến mơ hồ; cấp phát sai.']),
  ],
  goiY: ['Round each requirement up to the next 2^n − 2.', 'Allocate from the lowest address, largest block first.'],
  loi: ['Allocating the small subnets first and leaving no aligned space for large ones.', 'Forgetting the WAN links in the plan.'],
  tn: [tn('VLSM', 'mặt nạ mạng con độ dài thay đổi')], kn: ['VLSM'],
});

const NEED1 = [{ name: 'LAN-A', hosts: 100 }, { name: 'LAN-B', hosts: 50 }, { name: 'LAN-C', hosts: 25 }, { name: 'WAN-1', hosts: 2 }, { name: 'WAN-2', hosts: 2 }];
const V1 = S.vlsm('192.168.10.0', 24, NEED1);
const E2 = tinh({
  tieuDe: 'VLSM 2 — Plan 192.168.10.0/24', doKho: 'MEDIUM', phut: 15,
  moTa: mt('Allocate subnets from <b>192.168.10.0/24</b>, largest first: LAN-A 100 hosts, LAN-B 50, LAN-C 25, WAN-1 2 and WAN-2 2. Fill the prefix and network address of each subnet.', 'Cấp mạng con từ <b>192.168.10.0/24</b>, lớn trước: LAN-A 100 host, LAN-B 50, LAN-C 25, WAN-1 2 và WAN-2 2. Điền prefix và địa chỉ mạng của từng mạng con.'),
  loai: 'table',
  bang: [bang1('b1', ['VLSM plan', 'Kế hoạch VLSM'], [{ ma: 'n', ten: 'Subnet' }, { ma: 'p', ten: 'Prefix' }, { ma: 'a', ten: 'Network address' }, { ma: 'b', ten: 'Broadcast' }],
    NEED1.map((x) => { const v = V1.find((y) => y.name === x.name); return { o: { n: `${x.name} (${x.hosts} hosts)` }, a: { p: ['/' + v.prefix, String(v.prefix)], a: [v.network], b: [v.broadcast] } }; }),
    [V1.map((v) => `${v.name}: ${v.network}/${v.prefix}`).join('; ') + '. Each block starts where the previous one ended.', 'Mỗi khối bắt đầu nơi khối trước kết thúc.'])],
  goiY: ['100 hosts need 7 host bits (/25), 50 → /26, 25 → /27, 2 → /30.', 'Next network = previous broadcast + 1.'],
  loiHayGap: ['Giving LAN-A a /26 (62 hosts is not enough).', 'Starting the WAN blocks inside an already used range.'],
  thuatNgu: [tn('WAN link', 'liên kết mạng diện rộng')], khaiNiem: ['VLSM plan'],
});

const NEED2 = [{ name: 'HQ', hosts: 450 }, { name: 'Branch-1', hosts: 120 }, { name: 'Branch-2', hosts: 60 }, { name: 'Servers', hosts: 28 }, { name: 'Mgmt', hosts: 12 }, { name: 'Link-1', hosts: 2 }];
const V2 = S.vlsm('172.16.8.0', 22, NEED2);
const E3 = tinh({
  tieuDe: 'VLSM 3 — Plan 172.16.8.0/22 and check the leftover', doKho: 'HARD', phut: 18,
  moTa: mt('Allocate from <b>172.16.8.0/22</b>: HQ 450 hosts, Branch-1 120, Branch-2 60, Servers 28, Mgmt 12, Link-1 2 (largest first). Give each network address and the first FREE address after the last allocation.', 'Cấp từ <b>172.16.8.0/22</b>: HQ 450 host, Branch-1 120, Branch-2 60, Servers 28, Mgmt 12, Link-1 2 (lớn trước). Cho địa chỉ mạng và địa chỉ TỰ DO đầu tiên sau lần cấp cuối.'),
  loai: 'table',
  bang: [bang1('b1', ['VLSM plan 2', 'Kế hoạch VLSM 2'], [{ ma: 'n', ten: 'Subnet' }, { ma: 'p', ten: 'Prefix' }, { ma: 'a', ten: 'Network' }],
    [...NEED2.map((x) => { const v = V2.find((y) => y.name === x.name); return { o: { n: x.name }, a: { p: ['/' + v.prefix, String(v.prefix)], a: [v.network] } }; }),
      { o: { n: 'First free address' }, a: { p: ['-'], a: [(() => { const l = V2[V2.length - 1]; const v = l.broadcast.split('.').reduce((a, b) => a * 256 + Number(b), 0) + 1; return [Math.floor(v / 16777216) % 256, Math.floor(v / 65536) % 256, Math.floor(v / 256) % 256, v % 256].join('.'); })()] } }],
    [V2.map((v) => `${v.name}: ${v.network}/${v.prefix}`).join('; ') + '. Type "-" in the prefix cell for the last row.', 'Gõ "-" ở ô prefix của hàng cuối.'])],
  goiY: ['450 hosts need 9 host bits (/23).', 'The leftover space is what you can still sell to a new site.'],
  loiHayGap: ['Allocating HQ a /24 (254 hosts).', 'Using sizes that are not aligned on their own block size.'],
  thuatNgu: [tn('aligned', 'thẳng hàng theo kích thước khối')], khaiNiem: ['VLSM capacity'],
});

const FIT = [
  [[{ name: 'a', hosts: 100 }, { name: 'b', hosts: 100 }, { name: 'c', hosts: 20 }], 'does not fit'],
  [[{ name: 'a', hosts: 100 }, { name: 'b', hosts: 50 }, { name: 'c', hosts: 50 }], 'fits'],
  [[{ name: 'a', hosts: 120 }, { name: 'b', hosts: 60 }, { name: 'c', hosts: 30 }, { name: 'd', hosts: 14 }, { name: 'e', hosts: 6 }], 'fits'],
  [[{ name: 'a', hosts: 126 }, { name: 'b', hosts: 62 }, { name: 'c', hosts: 30 }, { name: 'd', hosts: 14 }, { name: 'e', hosts: 6 }, { name: 'f', hosts: 2 }, { name: 'g', hosts: 2 }, { name: 'h', hosts: 2 }], 'does not fit'],
];
const E4 = cs({
  ten: 'VLSM 4 — Does the plan fit in a /24?', kho: 'HARD', phut: 12,
  en: 'Decide with the real block sizes (not the raw host counts).', vi: 'Quyết định bằng kích thước khối thật (không phải số host thô).',
  cau: FIT.map(([n, r], i) => {
    const v = S.vlsm('10.0.0.0', 24, n);
    const real = (v !== null) === (r === 'fits') ? 1 : null;
    if (real === null) throw new Error('FIT sai ' + i);
    return q('c' + (i + 1), ['Needs: ' + n.map((x) => x.hosts).join(', ') + ' hosts. Do they fit in one /24?', 'Nhu cầu: ' + n.map((x) => x.hosts).join(', ') + ' host. Có vừa trong một /24 không?'],
      r === 'fits' ? ['Yes — the blocks add up to ' + (v ? v.reduce((a, x) => a + Math.pow(2, 32 - x.prefix), 0) : 0) + ' addresses ≤ 256', 'No — it needs more than 256 addresses', 'Only if the /24 is a class C', 'Cannot be decided'] : ['No — the rounded-up blocks need more than 256 addresses', 'Yes — the host counts add up to less than 254', 'Only with /31 links', 'Only with NAT'],
      ['Round each need up to a block (126→128, 62→64, 30→32, 14→16, 6→8, 2→4) and add the sizes.', 'Làm tròn mỗi nhu cầu lên khối (126→128, 62→64, 30→32, 14→16, 6→8, 2→4) rồi cộng.']);
  }),
  goiY: ['Convert every requirement to its block size, then add.', 'Total must be ≤ 256 and the blocks must also align.'],
  loi: ['Adding the raw host counts and ignoring network/broadcast and rounding.', 'Ignoring the 4-address cost of every /30 link.'],
  tn: [tn('block size', 'kích thước khối')], kn: ['VLSM capacity'],
});

const E5 = js({
  ten: 'VLSM 5 — Write vlsm(base, prefix, needs)', kho: 'HARD', phut: 25,
  en: '<p>Write <code>vlsm(base, prefix, needs)</code>. <code>needs</code> is <code>[{ name, hosts }]</code>. Sort by <code>hosts</code> descending (ties: original order) and allocate consecutively from the start of <code>base/prefix</code>. Each subnet gets the longest prefix (max /30) with at least <code>hosts</code> usable addresses. Return <code>[{ name, hosts, prefix, network, firstHost, lastHost, broadcast }]</code> in allocation order, or <code>null</code> if the block is too small.</p>',
  vi: '<p>Viết <code>vlsm(base, prefix, needs)</code>. <code>needs</code> là <code>[{ name, hosts }]</code>. Sắp theo <code>hosts</code> giảm dần (hoà: giữ thứ tự gốc) và cấp liên tiếp từ đầu <code>base/prefix</code>. Mỗi mạng con nhận prefix dài nhất (tối đa /30) có ít nhất <code>hosts</code> địa chỉ dùng được. Trả <code>[{ name, hosts, prefix, network, firstHost, lastHost, broadcast }]</code> theo thứ tự cấp, hoặc <code>null</code> nếu khối quá nhỏ.</p>',
  fn: 'vlsm', params: 'base, prefix, needs', ref: S.vlsm,
  cases: [['192.168.10.0', 24, NEED1], ['172.16.8.0', 22, NEED2], ['10.0.0.0', 24, [{ name: 'only', hosts: 10 }]], ['10.0.0.0', 24, [{ name: 'a', hosts: 200 }, { name: 'b', hosts: 100 }]], ['192.168.1.0', 24, [{ name: 'x', hosts: 2 }, { name: 'y', hosts: 2 }, { name: 'z', hosts: 2 }]], ['192.168.1.99', 24, [{ name: 'p', hosts: 50 }, { name: 'q', hosts: 60 }]], ['10.0.0.0', 24, []]],
  goiY: ['p starts at 30 and decreases until 2^(32−p) − 2 ≥ hosts.', 'The cursor always advances by the block size, so alignment is automatic with largest-first.'],
  loi: ['Sorting ascending.', 'Forgetting to mask the base address to its network.'],
  gt: ['Largest-first guarantees alignment because every block size divides the previous ones.', 'Lớn trước đảm bảo thẳng hàng vì mọi kích thước khối chia hết kích thước các khối trước.'],
  kn: ['VLSM'],
});

function findOverlaps(cidrs) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  var r = [], out = [], i, j;
  for (i = 0; i < cidrs.length; i++) {
    var c = cidrs[i].split('/'), len = +c[1], m = len === 0 ? 0 : (0xFFFFFFFF << (32 - len)) >>> 0, s = (toInt(c[0]) & m) >>> 0;
    r.push([s, s + Math.pow(2, 32 - len) - 1]);
  }
  for (i = 0; i < r.length; i++) for (j = i + 1; j < r.length; j++) if (r[i][0] <= r[j][1] && r[j][0] <= r[i][1]) out.push([i, j]);
  return out;
}
const E6 = js({
  ten: 'VLSM 6 — Detect overlapping subnets', kho: 'HARD', phut: 18,
  en: '<p>Audit an address plan. Write <code>findOverlaps(cidrs)</code> where <code>cidrs</code> is an array of <code>"a.b.c.d/p"</code>. Return the index pairs <code>[i, j]</code> (i &lt; j, sorted by i then j) of subnets whose address ranges overlap. Host bits in the written address must be ignored (<code>"10.0.0.5/24"</code> is the block 10.0.0.0–10.0.0.255).</p>',
  vi: '<p>Kiểm kế hoạch địa chỉ. Viết <code>findOverlaps(cidrs)</code> với <code>cidrs</code> là mảng <code>"a.b.c.d/p"</code>. Trả các cặp chỉ số <code>[i, j]</code> (i &lt; j, sắp theo i rồi j) của các mạng con có dải địa chỉ chồng lấn. Phải bỏ qua bit host trong địa chỉ ghi (<code>"10.0.0.5/24"</code> là khối 10.0.0.0–10.0.0.255).</p>',
  fn: 'findOverlaps', params: 'cidrs', ref: findOverlaps,
  cases: [[['10.0.0.0/24', '10.0.1.0/24', '10.0.0.128/25']], [['192.168.1.0/26', '192.168.1.64/26', '192.168.1.128/25']], [['10.0.0.0/8', '10.1.0.0/16', '10.1.2.0/24']], [['10.0.0.5/24', '10.0.0.200/24']], [['1.1.1.0/30']], [[]], [['172.16.0.0/20', '172.16.8.0/22', '172.16.16.0/20', '172.16.20.0/24']]],
  goiY: ['Turn each CIDR into [start, end] integers first.', 'Two ranges overlap when each starts before the other ends.'],
  loi: ['Comparing only prefixes as strings.', 'Not masking the host bits of the written address.'],
  gt: ['Interval overlap is the whole test; any two CIDR blocks either nest or are disjoint.', 'Chồng lấn khoảng là toàn bộ phép thử; hai khối CIDR hoặc lồng nhau hoặc rời nhau.'],
  kn: ['address plan audit'],
});

void tinh;
export default doiDau({ slug: 'nwc204-10-3-vlsm', ten: '10.3 VLSM', khoa: KHOA, baiHoc: 'nwc204-10-3-lab-2-2-va-thi-giua-ky', de: [E1, E2, E3, E4, E5, E6] });
