/** NWC204 · 10.1 — IPv4 address structure, classes and types. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'Addressing 1 — Structure and special addresses', kho: 'EASY', phut: 8,
  en: 'Network portion, host portion and special blocks.', vi: 'Phần mạng, phần host và các dải đặc biệt.',
  cau: [
    q('c1', ['The host portion of 192.168.10.5/24 is …', 'Phần host của 192.168.10.5/24 là …'], ['the last 8 bits (5)', 'the first 24 bits', 'the middle 16 bits', 'the last 16 bits'], ['/24 = 24 network bits, 8 host bits.', '/24 = 24 bit mạng, 8 bit host.']),
    q('c2', ['Which block is reserved for loopback?', 'Dải nào dành cho loopback?'], ['127.0.0.0/8', '10.0.0.0/8', '169.254.0.0/16', '224.0.0.0/4'], ['127.0.0.1 is the local host.', '127.0.0.1 là chính máy này.']),
    q('c3', ['An address starting with 169.254 on a PC means …', 'Địa chỉ bắt đầu bằng 169.254 trên PC nghĩa là …'], ['DHCP failed and Windows self-assigned a link-local address (APIPA)', 'the PC has a public address leased by the ISP', 'the PC has become the DHCP server of its own subnet', 'the network has moved to IPv6 and maps old addresses here'], ['A symptom to look for when users say “no network”.', 'Dấu hiệu cần tìm khi người dùng báo “mất mạng”.']),
    q('c4', ['The private IPv4 ranges (RFC 1918) are …', 'Các dải IPv4 riêng (RFC 1918) là …'], ['10/8, 172.16/12, 192.168/16', '10/8, 172.0/8, 192.0/16', '127/8, 169.254/16, 224/4', '10/8 only'], ['Not routed on the public Internet; NAT is needed to reach it.', 'Không định tuyến trên Internet công cộng; cần NAT để ra ngoài.']),
    q('c5', ['Class D addresses (224.0.0.0–239.255.255.255) are used for …', 'Địa chỉ lớp D (224.0.0.0–239.255.255.255) dùng cho …'], ['multicast', 'unicast hosts', 'private networks', 'loopback'], ['E.g. 224.0.0.5 for OSPF routers.', 'Vd 224.0.0.5 cho các router OSPF.']),
  ],
  goiY: ['Prefix length tells network vs host bits.', 'Memorise the four special blocks: 127, 169.254, private, 224+.'],
  loi: ['Calling 172.32.0.1 private (the private block ends at 172.31.255.255).', 'Assuming 169.254 addresses can reach the Internet.'],
  tn: [tn('APIPA', 'địa chỉ tự gán link-local'), tn('RFC 1918', 'dải địa chỉ riêng')], kn: ['special addresses'],
});

const T = ['10.20.30.40', '172.31.255.1', '172.32.0.1', '192.168.100.7', '169.254.12.34', '127.0.0.5', '224.0.0.251', '8.8.8.8'];
const E2 = tinh({
  tieuDe: 'Addressing 2 — Classify the address', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Give the classful class (A–E) and the type (private, public, loopback, link-local, multicast).', 'Cho lớp địa chỉ (A–E) và loại (private, public, loopback, link-local, multicast).'),
  loai: 'table',
  bang: [bang1('b1', ['Class and type', 'Lớp và loại'], [{ ma: 'a', ten: 'Address' }, { ma: 'c', ten: 'Class', luaChon: ['A', 'B', 'C', 'D', 'E'] }, { ma: 't', ten: 'Type', luaChon: ['private', 'public', 'loopback', 'link-local', 'multicast'] }],
    T.map((a) => ({ o: { a }, a: { c: [S.ipClass(a)], t: [S.ipKind(a)] } })),
    [T.map((a) => `${a}: class ${S.ipClass(a)}, ${S.ipKind(a)}`).join('; ') + '.', 'Lớp theo octet đầu: <128 A, <192 B, <224 C, <240 D, còn lại E.'])],
  goiY: ['First octet: 1–126 A, 128–191 B, 192–223 C, 224–239 D.', '127 is class A by number but reserved for loopback.'],
  loiHayGap: ['Treating 172.32/12 as private.', 'Calling 127.x “public”.'],
  thuatNgu: [tn('classful', 'theo lớp')], khaiNiem: ['address classes'],
});

const U = [['192.168.10.77', 24], ['10.1.1.1', 8], ['172.16.5.9', 20], ['203.0.113.130', 28], ['198.51.100.9', 30], ['100.64.1.1', 10]];
const E3 = tinh({
  tieuDe: 'Addressing 3 — Network, broadcast and host range', doKho: 'MEDIUM', phut: 14,
  moTa: mt('For each host address give the network address, the broadcast address and the number of usable hosts.', 'Với mỗi địa chỉ host, cho địa chỉ mạng, địa chỉ broadcast và số host dùng được.'),
  loai: 'table',
  bang: [bang1('b1', ['Network details', 'Chi tiết mạng'], [{ ma: 'h', ten: 'Host / prefix' }, { ma: 'n', ten: 'Network' }, { ma: 'b', ten: 'Broadcast' }, { ma: 'u', ten: 'Usable hosts' }],
    U.map(([ip, p]) => ({ o: { h: `${ip}/${p}` }, a: { n: [S.ipInfo(ip, p).network], b: [S.ipInfo(ip, p).broadcast], u: [String(S.ipInfo(ip, p).hosts)] } })),
    [U.map(([ip, p]) => { const r = S.ipInfo(ip, p); return `${ip}/${p}: ${r.network} – ${r.broadcast}, ${r.hosts} hosts`; }).join('; ') + '. Usable hosts = 2^(32−p) − 2.', 'Host dùng được = 2^(32−p) − 2.'])],
  goiY: ['Block size = 2^(32−p) (in the interesting octet 256 − mask octet).', 'Broadcast = next network − 1.'],
  loiHayGap: ['Forgetting to subtract 2 for network and broadcast.', 'Using the host’s own address as the network address.'],
  thuatNgu: [tn('usable host', 'host dùng được')], khaiNiem: ['network/broadcast'],
});

const E4 = cs({
  ten: 'Addressing 4 — How big a prefix do I need?', kho: 'MEDIUM', phut: 8,
  en: 'Choose the smallest prefix that fits.', vi: 'Chọn prefix nhỏ nhất đủ chỗ.',
  cau: [30, 60, 120, 250, 500].map((h, i) => {
    let p = 30; while (Math.pow(2, 32 - p) - 2 < h) p--;
    const opts = ['/' + p, '/' + (p + 1), '/' + (p - 1), '/' + (p + 2)];
    return q('c' + (i + 1), [`A subnet must hold ${h} hosts. The longest (smallest) prefix that fits is …`, `Mạng con phải chứa ${h} host. Prefix dài nhất (nhỏ nhất) đủ chỗ là …`], opts, [`/${p} gives ${Math.pow(2, 32 - p) - 2} usable hosts; /${p + 1} gives only ${Math.pow(2, 31 - p) - 2}.`, `/${p} cho ${Math.pow(2, 32 - p) - 2} host; /${p + 1} chỉ cho ${Math.pow(2, 31 - p) - 2}.`]);
  }),
  goiY: ['Find the smallest h with 2^h − 2 ≥ needed hosts; prefix = 32 − h.', 'Power-of-two table: 2^5 = 32 … 2^9 = 512.'],
  loi: ['Forgetting the −2.', 'Picking a larger prefix number (smaller network) than needed.'],
  tn: [tn('host bits', 'bit host')], kn: ['prefix sizing'],
});

function ipInfo(ip, prefix) {
  function toInt(s) { var p = s.split('.'); return ((+p[0]) * 16777216 + (+p[1]) * 65536 + (+p[2]) * 256 + (+p[3])) >>> 0; }
  function toStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  var mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  var net = (toInt(ip) & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, size = Math.pow(2, 32 - prefix);
  return { network: toStr(net), broadcast: toStr(bc), mask: toStr(mask), hosts: prefix <= 30 ? size - 2 : (prefix === 31 ? 2 : 1) };
}
const E5 = js({
  ten: 'Addressing 5 — Write ipInfo(ip, prefix)', kho: 'MEDIUM', phut: 18,
  en: '<p>Write <code>ipInfo(ip, prefix)</code> returning <code>{ network, broadcast, mask, hosts }</code> (all addresses dotted decimal). <code>hosts</code> = 2^(32−prefix) − 2 for prefixes up to /30; /31 → 2 (point-to-point, RFC 3021); /32 → 1. Beware that JavaScript bit operators work on <i>signed</i> 32-bit integers: use <code>&gt;&gt;&gt; 0</code>.</p>',
  vi: '<p>Viết <code>ipInfo(ip, prefix)</code> trả <code>{ network, broadcast, mask, hosts }</code> (địa chỉ dạng thập phân có chấm). <code>hosts</code> = 2^(32−prefix) − 2 cho prefix tới /30; /31 → 2 (điểm-điểm, RFC 3021); /32 → 1. Lưu ý toán tử bit của JavaScript làm việc trên số nguyên 32 bit <i>có dấu</i>: dùng <code>&gt;&gt;&gt; 0</code>.</p>',
  fn: 'ipInfo', params: 'ip, prefix', ref: ipInfo,
  cases: [['192.168.10.77', 26], ['10.1.2.3', 8], ['172.16.5.9', 20], ['10.0.0.0', 31], ['1.2.3.4', 32], ['203.0.113.130', 28], ['255.255.255.255', 0], ['128.0.0.1', 1]],
  goiY: ['Mask = (0xFFFFFFFF << (32 − prefix)) >>> 0, but /0 needs a special case (shifting by 32 is a no-op).', 'Broadcast = network | ~mask (again with >>> 0).'],
  loi: ['Getting negative numbers because >>> 0 was forgotten.', 'Computing hosts without the −2 or treating /31 as 0.'],
  gt: ['All subnet maths is 32-bit integer arithmetic; once you have the mask, everything else is AND, OR and NOT.', 'Mọi phép tính subnet là số học số nguyên 32 bit; có mặt nạ rồi thì còn lại chỉ là AND, OR, NOT.'],
  kn: ['subnet calculation'],
});

void mcNum;
export default doiDau({ slug: 'nwc204-10-1-ipv4-addressing', ten: '10.1 IPv4 address structure and types', khoa: KHOA, baiHoc: 'nwc204-10-1-cau-truc-dia-chi-ipv4', de: [E1, E2, E3, E4, E5] });
