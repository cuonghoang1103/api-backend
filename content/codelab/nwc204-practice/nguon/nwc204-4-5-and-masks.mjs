/** NWC204 · 4.5 — Bitwise AND and subnet masks (web-added chapter 4B). */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt } from './_nw.mjs';

const A = [['192.168.10.77', 26], ['172.16.200.9', 20], ['10.45.99.200', 13], ['203.0.113.130', 28]];
const E1 = tinh({
  tieuDe: 'AND 1 — Find the network address', doKho: 'EASY', phut: 10,
  moTa: mt('Perform the bitwise AND of the host address with its mask to get the network address. Write the mask in dotted decimal too.', 'Thực hiện phép AND theo bit giữa địa chỉ host và mặt nạ để ra địa chỉ mạng. Viết cả mặt nạ dạng thập phân có chấm.'),
  loai: 'table',
  bang: [bang1('b1', ['AND with the mask', 'AND với mặt nạ'], [{ ma: 'h', ten: 'Host / prefix' }, { ma: 'm', ten: 'Mask' }, { ma: 'n', ten: 'Network address' }],
    A.map(([ip, p]) => ({ o: { h: `${ip}/${p}` }, a: { m: [S.ipInfo(ip, p).mask], n: [S.ipInfo(ip, p).network] } })),
    [A.map(([ip, p]) => { const r = S.ipInfo(ip, p); return `${ip}/${p}: mask ${r.mask}, network ${r.network}`; }).join('; ') + '. 1 AND x = x, 0 AND x = 0: host bits become 0.', 'Bit host đều thành 0.'])],
  goiY: ['Work only on the octet where the mask is neither 255 nor 0.', 'Block size = 256 − mask octet; the network is the largest multiple of the block size not above the host octet.'],
  loiHayGap: ['ANDing with the wildcard mask instead of the subnet mask.', 'Forgetting that octets under 255 in the mask can change the other octets too (non-/8 /16 /24 prefixes).'],
  thuatNgu: [tn('network address', 'địa chỉ mạng'), tn('AND', 'phép AND theo bit')], khaiNiem: ['bitwise AND'],
});

const P = [8, 16, 22, 25, 27, 30];
const E2 = tinh({
  tieuDe: 'AND 2 — Prefix, mask and wildcard', doKho: 'EASY', phut: 10,
  moTa: mt('Fill the dotted-decimal subnet mask and the wildcard mask (the bitwise inverse) for each prefix length.', 'Điền mặt nạ mạng con dạng thập phân có chấm và mặt nạ wildcard (đảo bit) cho mỗi độ dài prefix.'),
  loai: 'table',
  bang: [bang1('b1', ['Prefix table', 'Bảng prefix'], [{ ma: 'p', ten: 'Prefix' }, { ma: 'm', ten: 'Subnet mask' }, { ma: 'w', ten: 'Wildcard' }],
    P.map((p) => ({ o: { p: '/' + p }, a: { m: [S.ipInfo('0.0.0.0', p).mask], w: [S.ipInfo('0.0.0.0', p).wildcard] } })),
    [P.map((p) => `/${p} = ${S.ipInfo('0.0.0.0', p).mask} / ${S.ipInfo('0.0.0.0', p).wildcard}`).join('; ') + '.', 'Mask + wildcard = 255.255.255.255.'])],
  goiY: ['Mask octet values: 128, 192, 224, 240, 248, 252, 254, 255.', 'Wildcard octet = 255 − mask octet.'],
  loiHayGap: ['Writing 255.255.255.0 for /22 (counting 24 bits).', 'Giving the mask as the wildcard.'],
  thuatNgu: [tn('wildcard mask', 'mặt nạ wildcard')], khaiNiem: ['subnet mask'],
});

const PAIRS = [['192.168.1.130', '192.168.1.190', 26], ['192.168.1.130', '192.168.1.200', 26], ['10.1.5.9', '10.1.200.9', 16], ['172.16.31.5', '172.16.32.5', 20], ['10.0.0.1', '10.0.0.2', 30]];
const E3 = cs({
  ten: 'AND 3 — Same network or not?', kho: 'MEDIUM', phut: 10,
  en: 'A host sends directly (ARP) when the destination is on its own network, otherwise it uses the default gateway. For each pair decide with the AND test.', vi: 'Host gửi trực tiếp (ARP) khi đích ở cùng mạng, ngược lại gửi tới default gateway. Với mỗi cặp, dùng phép AND để quyết định.',
  cau: PAIRS.map(([a, b, p], i) => q('c' + (i + 1), [`${a} and ${b} with /${p}: same network?`, `${a} và ${b} với /${p}: cùng mạng?`],
    S.sameNetwork(a, b, p) ? ['Yes — both are in ' + S.ipInfo(a, p).network + '/' + p, 'No — different networks', 'Only if they share the gateway', 'Cannot tell without the MAC'] : ['No — ' + S.ipInfo(a, p).network + ' vs ' + S.ipInfo(b, p).network, 'Yes — same network', 'Only if they share the gateway', 'Cannot tell without the MAC'],
    [`Network of the first: ${S.ipInfo(a, p).network}; of the second: ${S.ipInfo(b, p).network}.`, `Mạng của máy thứ nhất: ${S.ipInfo(a, p).network}; của máy thứ hai: ${S.ipInfo(b, p).network}.`])),
  goiY: ['Compute both network addresses and compare.', 'Only the octet where the mask is partial needs work.'],
  loi: ['Comparing the first three octets regardless of the prefix.', 'Believing /30 hosts .1 and .2 are in different networks.'],
  tn: [tn('default gateway', 'cổng mặc định')], kn: ['same network test'],
});

function sameSubnet(a, b, mask) {
  var x = a.split('.'), y = b.split('.'), m = mask.split('.');
  for (var i = 0; i < 4; i++) if ((Number(x[i]) & Number(m[i])) !== (Number(y[i]) & Number(m[i]))) return false;
  return true;
}
const E4 = js({
  ten: 'AND 4 — Write sameSubnet(a, b, mask)', kho: 'MEDIUM', phut: 12,
  en: '<p>Write <code>sameSubnet(a, b, mask)</code> returning <code>true</code> when the two dotted-decimal IPv4 addresses are in the same network under the dotted-decimal <code>mask</code> (use bitwise AND per octet).</p>',
  vi: '<p>Viết <code>sameSubnet(a, b, mask)</code> trả <code>true</code> khi hai địa chỉ IPv4 thập phân có chấm cùng mạng theo <code>mask</code> thập phân có chấm (dùng AND theo bit từng octet).</p>',
  fn: 'sameSubnet', params: 'a, b, mask', ref: sameSubnet,
  cases: [['192.168.1.130', '192.168.1.190', '255.255.255.192'], ['192.168.1.130', '192.168.1.200', '255.255.255.192'], ['10.1.5.9', '10.1.200.9', '255.255.0.0'], ['172.16.31.5', '172.16.32.5', '255.255.240.0'], ['10.0.0.1', '10.0.0.2', '255.255.255.252'], ['10.0.0.2', '10.0.0.5', '255.255.255.252'], ['1.2.3.4', '200.2.3.4', '0.0.0.0']],
  goiY: ['Split the three strings on ".".', 'Compare (x & m) with (y & m) for each of the 4 octets.'],
  loi: ['Comparing only the first three octets.', 'Converting strings without Number(), so & works on strings by accident only sometimes.'],
  gt: ['This is exactly what a host does before deciding between ARP for the destination and ARP for the gateway.', 'Đây chính là phép host làm trước khi chọn ARP cho đích hay cho gateway.'],
  kn: ['bitwise AND'],
});

function maskToPrefix(mask) {
  var p = mask.split('.'), bits = '';
  if (p.length !== 4) return -1;
  for (var i = 0; i < 4; i++) {
    var n = Number(p[i]);
    if (!(n >= 0 && n <= 255) || p[i] === '') return -1;
    var s = n.toString(2); while (s.length < 8) s = '0' + s;
    bits += s;
  }
  var ones = bits.indexOf('0') < 0 ? 32 : bits.indexOf('0');
  return bits.slice(ones).indexOf('1') < 0 ? ones : -1;
}
const E5 = js({
  ten: 'AND 5 — Write maskToPrefix(mask), reject invalid masks', kho: 'HARD', phut: 18,
  en: '<p>Write <code>maskToPrefix(mask)</code> returning the prefix length of a dotted-decimal subnet mask (<code>"255.255.255.192"</code> → <code>26</code>). A valid mask is a run of 1-bits followed only by 0-bits; return <code>-1</code> for anything else (<code>"255.0.255.0"</code>, <code>"255.255.255.193"</code>, octet &gt; 255, not four octets).</p>',
  vi: '<p>Viết <code>maskToPrefix(mask)</code> trả độ dài prefix của mặt nạ mạng con dạng thập phân có chấm (<code>"255.255.255.192"</code> → <code>26</code>). Mặt nạ hợp lệ là một dãy bit 1 rồi chỉ toàn bit 0; mọi trường hợp khác trả <code>-1</code> (<code>"255.0.255.0"</code>, <code>"255.255.255.193"</code>, octet &gt; 255, không đủ bốn octet).</p>',
  fn: 'maskToPrefix', params: 'mask', ref: maskToPrefix,
  cases: [['255.255.255.192'], ['255.255.255.0'], ['255.255.240.0'], ['0.0.0.0'], ['255.255.255.255'], ['255.0.255.0'], ['255.255.255.193'], ['255.255.256.0'], ['255.255.255']],
  goiY: ['Build the 32-character bit string first.', 'Valid if, after the first "0", no "1" appears.'],
  loi: ['Counting the number of 1-bits only, so 255.0.255.0 looks like /16.', 'Not rejecting the all-ones and all-zeros edge cases correctly (they ARE valid).'],
  gt: ['Contiguity is the whole point of a subnet mask; counting ones is not enough.', 'Mặt nạ phải liền khối; chỉ đếm số bit 1 là chưa đủ.'],
  kn: ['subnet mask validity'],
});

void tinh;
export default doiDau({ slug: 'nwc204-4-5-and-masks', ten: '4.5 Bitwise AND and subnet masks', khoa: KHOA, baiHoc: 'nwc204-4b-3-phep-and-theo-bit-va-mat-na-mang', de: [E1, E2, E3, E4, E5] });
