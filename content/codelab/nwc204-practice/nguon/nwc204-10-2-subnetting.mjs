/** NWC204 · 10.2 — Subnetting a network. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const N = [[24, 2], [24, 5], [24, 10], [16, 100], [20, 3]];
const E1 = tinh({
  tieuDe: 'Subnetting 1 — Borrow bits', doKho: 'EASY', phut: 10,
  moTa: mt('You split a network with the given prefix into AT LEAST the given number of equal subnets. Give the number of borrowed bits, the new prefix and the usable hosts per subnet.', 'Chia mạng có prefix cho trước thành ÍT NHẤT số mạng con bằng nhau cho trước. Cho số bit mượn, prefix mới và số host dùng được mỗi mạng con.'),
  loai: 'table',
  bang: [bang1('b1', ['Borrowed bits', 'Bit mượn'], [{ ma: 'x', ten: 'Split' }, { ma: 'b', ten: 'Borrowed bits' }, { ma: 'p', ten: 'New prefix' }, { ma: 'h', ten: 'Hosts / subnet' }],
    N.map(([p, n]) => { const r = S.borrowBits(p, n); return { o: { x: `/${p} into ≥ ${n} subnets` }, a: { b: [String(r.borrowed)], p: ['/' + r.newPrefix, String(r.newPrefix)], h: [String(r.hostsPerSubnet)] } }; }),
    [N.map(([p, n]) => { const r = S.borrowBits(p, n); return `/${p}, ${n}: borrow ${r.borrowed} → /${r.newPrefix}, ${r.hostsPerSubnet} hosts`; }).join('; ') + '. Subnets = 2^borrowed.', 'Số mạng con = 2^bit mượn.'])],
  goiY: ['Smallest b with 2^b ≥ number of subnets.', 'Hosts per subnet = 2^(32 − newPrefix) − 2.'],
  loiHayGap: ['Borrowing b bits for exactly n subnets when n is not a power of two.', 'Forgetting that every borrowed bit halves the host space.'],
  thuatNgu: [tn('borrow bits', 'mượn bit host')], khaiNiem: ['subnetting'],
});

const L = S.splitSubnets('192.168.1.0', 24, 27);
const E2 = tinh({
  tieuDe: 'Subnetting 2 — List the subnets of 192.168.1.0/24 split into /27', doKho: 'MEDIUM', phut: 12,
  moTa: mt('Split <b>192.168.1.0/24</b> into /27 subnets. Fill network, first host, last host and broadcast for subnets #1, #2, #3 and #8 (numbering from 1).', 'Chia <b>192.168.1.0/24</b> thành các mạng con /27. Điền network, host đầu, host cuối và broadcast cho mạng con #1, #2, #3 và #8 (đánh số từ 1).'),
  loai: 'table',
  bang: [bang1('b1', ['Subnet list', 'Danh sách mạng con'], [{ ma: 's', ten: 'Subnet #' }, { ma: 'n', ten: 'Network' }, { ma: 'f', ten: 'First host' }, { ma: 'l', ten: 'Last host' }, { ma: 'b', ten: 'Broadcast' }],
    [1, 2, 3, 8].map((k) => ({ o: { s: '#' + k }, a: { n: [L[k - 1].network], f: [L[k - 1].firstHost], l: [L[k - 1].lastHost], b: [L[k - 1].broadcast] } })),
    ['Block size 32: ' + L.map((s) => s.network).join(', ') + '.', 'Kích thước khối 32: ' + L.map((s) => s.network).join(', ') + '.'])],
  goiY: ['Increment of 256 − 224 = 32 in the fourth octet.', 'Broadcast = next network − 1.'],
  loiHayGap: ['Starting the second subnet at .31.', 'Giving the network address as the first host.'],
  thuatNgu: [tn('block size', 'kích thước khối')], khaiNiem: ['subnet list'],
});

const nextNet = (bc) => { const v = bc.split('.').reduce((a, b) => a * 256 + Number(b), 0) + 1; return [Math.floor(v / 16777216) % 256, Math.floor(v / 65536) % 256, Math.floor(v / 256) % 256, v % 256].join('.'); };
const H = [['172.16.77.9', 20], ['10.200.33.250', 21], ['192.168.5.130', 27], ['192.168.5.130', 26], ['100.64.200.5', 22]];
const E3 = tinh({
  tieuDe: 'Subnetting 3 — The subnet a host belongs to', doKho: 'MEDIUM', phut: 12,
  moTa: mt('For each host give its subnet’s network address, the first and last usable host, and the NEXT subnet’s network address.', 'Với mỗi host, cho địa chỉ mạng của nó, host dùng được đầu và cuối, và địa chỉ mạng của mạng con KẾ TIẾP.'),
  loai: 'table',
  bang: [bang1('b1', ['Host in subnet', 'Host trong mạng con'], [{ ma: 'h', ten: 'Host / prefix' }, { ma: 'n', ten: 'Network' }, { ma: 'f', ten: 'First' }, { ma: 'l', ten: 'Last' }, { ma: 'x', ten: 'Next network' }],
    H.map(([ip, p]) => { const r = S.ipInfo(ip, p); return { o: { h: `${ip}/${p}` }, a: { n: [r.network], f: [r.firstHost], l: [r.lastHost], x: [nextNet(r.broadcast)] } }; }),
    ['Next network = broadcast + 1.', 'Mạng con kế = broadcast + 1.'])],
  goiY: ['Find the interesting octet (where the mask is not 0 or 255).', 'Network = largest multiple of the block size ≤ host octet.'],
  loiHayGap: ['Using the wrong octet as the interesting octet.', 'Giving the broadcast address as the last host.'],
  thuatNgu: [tn('interesting octet', 'octet quyết định')], khaiNiem: ['subnet membership'],
});

const E4 = cs({
  ten: 'Subnetting 4 — Quick checks', kho: 'MEDIUM', phut: 10,
  en: 'Counting subnets and hosts.', vi: 'Đếm mạng con và host.',
  cau: [
    mcNum('c1', ['How many /28 subnets fit in a /24?', 'Có bao nhiêu mạng con /28 trong một /24?'], 16, [8, 14, 4], null, ['2^(28−24) = 16.', '2^(28−24) = 16.']),
    mcNum('c2', ['How many usable hosts in each /28?', 'Mỗi mạng con /28 có bao nhiêu host dùng được?'], 14, [16, 15, 12], null, ['2^4 − 2 = 14.', '2^4 − 2 = 14.']),
    q('c3', ['Which mask gives at least 60 hosts per subnet but the most subnets?', 'Mặt nạ nào cho ít nhất 60 host mỗi mạng con mà nhiều mạng con nhất?'], ['255.255.255.192 (/26)', '255.255.255.224 (/27)', '255.255.255.128 (/25)', '255.255.255.240 (/28)'], ['/26 gives 62 hosts; /27 only 30.', '/26 cho 62 host; /27 chỉ 30.']),
    q('c4', ['The router interface 192.168.1.97/27 is in the subnet …', 'Giao diện router 192.168.1.97/27 nằm trong mạng con …'], ['192.168.1.96/27', '192.168.1.64/27', '192.168.1.0/27', '192.168.1.128/27'], ['Block size 32: 96 ≤ 97 < 128.', 'Khối 32: 96 ≤ 97 < 128.']),
    q('c5', ['Which address is a valid host in 192.168.1.64/26?', 'Địa chỉ nào là host hợp lệ trong 192.168.1.64/26?'], ['192.168.1.126', '192.168.1.64', '192.168.1.127', '192.168.1.128'], ['Range .65–.126; .64 is the network and .127 the broadcast.', 'Dải .65–.126; .64 là mạng và .127 là broadcast.']),
  ],
  goiY: ['n subnets ⇒ 2^b; hosts ⇒ 2^h − 2.', 'Always check network and broadcast.'],
  loi: ['Counting .64 or .127 as hosts.', 'Using the number of host bits instead of the prefix.'],
  tn: [tn('valid host', 'host hợp lệ')], kn: ['subnet counting'],
});

function subnetList(net, prefix, newPrefix) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function toStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  var mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0, base = (toInt(net) & mask) >>> 0;
  var step = Math.pow(2, 32 - newPrefix), count = Math.pow(2, newPrefix - prefix), out = [];
  for (var i = 0; i < count; i++) out.push({ network: toStr(base + i * step), broadcast: toStr(base + i * step + step - 1) });
  return out;
}
const E5 = js({
  ten: 'Subnetting 5 — Write subnetList(net, prefix, newPrefix)', kho: 'MEDIUM', phut: 18,
  en: '<p>Write <code>subnetList(net, prefix, newPrefix)</code> returning every <code>/newPrefix</code> subnet of <code>net/prefix</code> in ascending order as <code>[{ network, broadcast }]</code> (dotted decimal). <code>net</code> may be any address inside the block.</p>',
  vi: '<p>Viết <code>subnetList(net, prefix, newPrefix)</code> trả mọi mạng con <code>/newPrefix</code> của <code>net/prefix</code> theo thứ tự tăng dần dạng <code>[{ network, broadcast }]</code> (thập phân có chấm). <code>net</code> có thể là địa chỉ bất kỳ trong khối.</p>',
  fn: 'subnetList', params: 'net, prefix, newPrefix', ref: subnetList,
  cases: [['192.168.1.0', 24, 26], ['10.0.0.0', 24, 24], ['192.168.1.77', 24, 27], ['172.16.0.0', 22, 24], ['10.0.0.0', 8, 10], ['192.0.2.0', 24, 30]],
  goiY: ['step = 2^(32 − newPrefix), count = 2^(newPrefix − prefix).', 'Mask the starting address first so any address inside the block works.'],
  loi: ['Not masking the base address.', 'Producing negative addresses (forget >>> 0).'],
  gt: ['Listing subnets is a loop over a base address with a fixed step.', 'Liệt kê mạng con là vòng lặp trên địa chỉ gốc với bước cố định.'],
  kn: ['subnetting'],
});

function findSubnet(base, prefix, newPrefix, ip) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function toStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  var m0 = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0, b = (toInt(base) & m0) >>> 0, a = toInt(ip);
  var size = Math.pow(2, 32 - prefix);
  if (a < b || a >= b + size) return null;
  var step = Math.pow(2, 32 - newPrefix), idx = Math.floor((a - b) / step);
  return { index: idx + 1, network: toStr(b + idx * step) + '/' + newPrefix };
}
const E6 = js({
  ten: 'Subnetting 6 — Which subnet number is this host in?', kho: 'HARD', phut: 18,
  en: '<p>Write <code>findSubnet(base, prefix, newPrefix, ip)</code>. The block <code>base/prefix</code> is split into <code>/newPrefix</code> subnets numbered from 1. Return <code>{ index, network }</code> (network as <code>"a.b.c.d/p"</code>) of the subnet that contains <code>ip</code>, or <code>null</code> if <code>ip</code> is outside the block.</p>',
  vi: '<p>Viết <code>findSubnet(base, prefix, newPrefix, ip)</code>. Khối <code>base/prefix</code> được chia thành các mạng con <code>/newPrefix</code> đánh số từ 1. Trả <code>{ index, network }</code> (network dạng <code>"a.b.c.d/p"</code>) của mạng con chứa <code>ip</code>, hoặc <code>null</code> nếu <code>ip</code> nằm ngoài khối.</p>',
  fn: 'findSubnet', params: 'base, prefix, newPrefix, ip', ref: findSubnet,
  cases: [['192.168.1.0', 24, 27, '192.168.1.97'], ['192.168.1.0', 24, 27, '192.168.1.255'], ['192.168.1.0', 24, 27, '192.168.2.1'], ['10.0.0.0', 16, 24, '10.0.200.7'], ['172.16.0.0', 20, 22, '172.16.15.1'], ['192.168.1.0', 24, 24, '192.168.1.1'], ['10.0.0.0', 8, 9, '10.200.0.1']],
  goiY: ['index = floor((ip − base) / step) + 1.', 'Check the range of the whole block first.'],
  loi: ['Numbering subnets from 0.', 'Not rejecting addresses below the base.'],
  gt: ['The subnet number is just integer division; the network address is base + index × step.', 'Số hiệu mạng con chỉ là phép chia nguyên; địa chỉ mạng là base + chỉ số × bước.'],
  kn: ['subnet membership'],
});

export default doiDau({ slug: 'nwc204-10-2-subnetting', ten: '10.2 Subnetting', khoa: KHOA, baiHoc: 'nwc204-10-2-chia-subnet-va-vlsm', de: [E1, E2, E3, E4, E5, E6] });
