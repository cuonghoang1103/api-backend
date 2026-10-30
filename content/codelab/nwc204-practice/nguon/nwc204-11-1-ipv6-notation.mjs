/** NWC204 · 11.1 — IPv6 notation and address types. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'IPv6 1 — Address types and prefixes', kho: 'EASY', phut: 8,
  en: 'Recognise IPv6 address types by prefix.', vi: 'Nhận biết loại địa chỉ IPv6 theo prefix.',
  cau: [
    q('c1', ['A global unicast address (GUA) starts with …', 'Địa chỉ global unicast (GUA) bắt đầu bằng …'], ['2000::/3 (in practice 2xxx or 3xxx)', 'fe80::/10', 'fc00::/7', 'ff00::/8'], ['GUAs are routable on the Internet.', 'GUA định tuyến được trên Internet.']),
    q('c2', ['A link-local address starts with …', 'Địa chỉ link-local bắt đầu bằng …'], ['fe80::/10', '2001::/16', 'fc00::/7', '::1'], ['Every IPv6 interface has one; it is never routed.', 'Mọi giao diện IPv6 có một địa chỉ này; không bao giờ được định tuyến.']),
    q('c3', ['Unique local addresses (private IPv6) are in …', 'Địa chỉ unique local (IPv6 riêng) nằm trong …'], ['fc00::/7 (usually fd00::/8)', 'fe80::/10', '2000::/3', 'ff02::/16'], ['The IPv6 counterpart of RFC 1918.', 'Tương đương RFC 1918 của IPv6.']),
    q('c4', ['IPv6 has no broadcast. Instead it uses …', 'IPv6 không có broadcast. Thay vào đó dùng …'], ['multicast, e.g. ff02::1 for all nodes', 'unicast only', 'anycast only', 'ARP'], ['ff02::1 = all nodes, ff02::2 = all routers.', 'ff02::1 = mọi node, ff02::2 = mọi router.']),
    q('c5', ['The IPv6 loopback address is …', 'Địa chỉ loopback IPv6 là …'], ['::1', '::', 'fe80::1', '127.0.0.1'], [':: (all zeros) means “unspecified”.', ':: (toàn 0) nghĩa là “chưa xác định”.']),
    mcNum('c6', ['How many bits is an IPv6 address?', 'Địa chỉ IPv6 dài bao nhiêu bit?'], 128, [64, 48, 256], null, ['Eight 16-bit groups = 128 bits.', 'Tám nhóm 16 bit = 128 bit.']),
  ],
  goiY: ['2/3 = global, fe80 = link-local, fc/fd = private, ff = multicast.', '128 bits = 32 hex digits.'],
  loi: ['Looking for a broadcast address in IPv6.', 'Thinking fe80 addresses can cross a router.'],
  tn: [tn('GUA', 'địa chỉ unicast toàn cục'), tn('link-local', 'địa chỉ liên kết cục bộ')], kn: ['IPv6 types'],
});

const A = ['2001:0db8:0000:0000:0000:ff00:0042:8329', '2001:0db8:0000:0001:0000:0000:0000:0001', 'fe80:0000:0000:0000:0202:b3ff:fe1e:8329', '0000:0000:0000:0000:0000:0000:0000:0001', '2001:0db8:0000:0000:0001:0000:0000:0001', 'ff02:0000:0000:0000:0000:0000:0000:0001'];
const E2 = tinh({
  tieuDe: 'IPv6 2 — Compress the address', doKho: 'MEDIUM', phut: 12,
  moTa: mt('Write each address in its shortest standard form: drop leading zeros in every group and replace the <b>longest</b> run of all-zero groups (two or more) with <code>::</code> once; if two runs tie, compress the first. Use lowercase.', 'Viết mỗi địa chỉ ở dạng chuẩn ngắn nhất: bỏ số 0 đầu mỗi nhóm và thay dãy nhóm toàn 0 <b>dài nhất</b> (từ hai nhóm) bằng <code>::</code> một lần; hai dãy bằng nhau thì nén dãy đầu. Dùng chữ thường.'),
  loai: 'table',
  bang: [bang1('b1', ['Compressed', 'Nén'], [{ ma: 'a', ten: 'Full address' }, { ma: 'c', ten: 'Shortest form' }],
    A.map((a) => ({ o: { a }, a: { c: [S.ipv6Compress(a)] } })),
    [A.map((a) => S.ipv6Compress(a)).join(' ; ') + '. “::” may appear only once; a single zero group stays “0”.', '“::” chỉ xuất hiện một lần; một nhóm 0 đơn lẻ viết “0”.'])],
  goiY: ['Strip leading zeros first, then look for the longest zero run.', 'A single 0 group is never replaced by ::.'],
  loiHayGap: ['Using :: twice.', 'Compressing the shorter of two zero runs.'],
  thuatNgu: [tn('hextet', 'nhóm 16 bit')], khaiNiem: ['IPv6 notation'],
});

const B = ['2001:db8::ff00:42:8329', '::1', 'fe80::1', '2001:db8:0:1::1', '::'];
const E3 = tinh({
  tieuDe: 'IPv6 3 — Expand the address', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Write each address in full: eight groups of four hex digits (lowercase).', 'Viết đầy đủ mỗi địa chỉ: tám nhóm bốn chữ số hex (chữ thường).'),
  loai: 'table',
  bang: [bang1('b1', ['Expanded', 'Mở rộng'], [{ ma: 'a', ten: 'Short form' }, { ma: 'e', ten: 'Full address' }],
    B.map((a) => ({ o: { a }, a: { e: [S.ipv6Expand(a)] } })),
    [B.map((a) => `${a} = ${S.ipv6Expand(a)}`).join('; ') + '. Count the groups present; “::” hides the missing ones.', 'Đếm số nhóm đang có; “::” che các nhóm còn thiếu.'])],
  goiY: ['Count the written groups; 8 minus that count is how many zero groups “::” hides.', 'Pad each group to 4 digits.'],
  loiHayGap: ['Replacing :: with only one zero group.', 'Forgetting to pad short groups.'],
  thuatNgu: [tn('unspecified address', 'địa chỉ chưa xác định')], khaiNiem: ['IPv6 notation'],
});

const T = ['2001:db8:acad:1::10', 'fe80::a8bb:ccff:fedd:eeff', 'fd12:3456:789a::1', 'ff02::5', '::1', '2607:f8b0:4005:80a::200e'];
const KIND = (a) => (a === '::1' ? 'loopback' : /^fe[89ab]/i.test(a) ? 'link-local' : /^f[cd]/i.test(a) ? 'unique local' : /^ff/i.test(a) ? 'multicast' : 'global unicast');
const E4 = tinh({
  tieuDe: 'IPv6 4 — Name the address type', doKho: 'MEDIUM', phut: 8,
  moTa: mt('Classify each address.', 'Phân loại từng địa chỉ.'),
  loai: 'table',
  bang: [bang1('b1', ['Address type', 'Loại địa chỉ'], [{ ma: 'a', ten: 'Address' }, { ma: 't', ten: 'Type', luaChon: ['global unicast', 'link-local', 'unique local', 'multicast', 'loopback'] }],
    T.map((a) => ({ o: { a }, a: { t: [KIND(a)] } })),
    [T.map((a) => `${a}: ${KIND(a)}`).join('; ') + '. Look at the first hextet.', 'Nhìn nhóm đầu tiên.'])],
  goiY: ['2xxx/3xxx global, fe8x–febx link-local, fcxx/fdxx unique local, ffxx multicast.', '::1 is the only loopback.'],
  loiHayGap: ['Calling fd… a global address.', 'Treating ff02::5 as unicast.'],
  thuatNgu: [tn('unique local', 'địa chỉ riêng duy nhất')], khaiNiem: ['IPv6 types'],
});

const E5 = js({
  ten: 'IPv6 5 — Write ipv6Compress(addr)', kho: 'HARD', phut: 25,
  en: '<p>Write <code>ipv6Compress(addr)</code> returning the RFC 5952 shortest form of a valid IPv6 string (the input may already be partly compressed, e.g. <code>"2001:db8::1:0:0:1"</code>): lowercase, no leading zeros in groups, the longest run of at least two zero groups replaced by <code>::</code> (the first on ties).</p>',
  vi: '<p>Viết <code>ipv6Compress(addr)</code> trả dạng ngắn nhất theo RFC 5952 của chuỗi IPv6 hợp lệ (đầu vào có thể đã nén một phần, vd <code>"2001:db8::1:0:0:1"</code>): chữ thường, bỏ số 0 đầu nhóm, dãy dài nhất từ hai nhóm 0 trở lên thay bằng <code>::</code> (hoà thì lấy dãy đầu).</p>',
  fn: 'ipv6Compress', params: 'addr', ref: S.ipv6Compress,
  cases: [['2001:0db8:0000:0000:0000:ff00:0042:8329'], ['2001:0db8:0000:0001:0000:0000:0000:0001'], ['0000:0000:0000:0000:0000:0000:0000:0001'], ['2001:db8:0:0:1:0:0:1'], ['2001:db8:0:1:1:1:1:1'], ['FE80::0202:B3FF:FE1E:8329'], ['0:0:0:0:0:0:0:0'], ['2001:db8::1:0:0:1']],
  goiY: ['First expand to 8 groups, strip the leading zeros, then scan for the longest zero run.', 'A run of length 1 is not compressed.'],
  loi: ['Replacing a single zero group with ::.', 'Compressing the last of two equal runs.'],
  gt: ['RFC 5952 fixes one canonical text form so logs and configs compare equal.', 'RFC 5952 quy định một dạng chuẩn để log và cấu hình so sánh được.'],
  kn: ['IPv6 notation'],
});
const E6 = js({
  ten: 'IPv6 6 — Write ipv6Expand(addr)', kho: 'MEDIUM', phut: 18,
  en: '<p>Write <code>ipv6Expand(addr)</code> returning the full 8-group, 4-digit lowercase form of an IPv6 address that may contain one <code>::</code>. Examples: <code>"::1"</code> → <code>"0000:0000:0000:0000:0000:0000:0000:0001"</code>; <code>"2001:db8::ff00:42:8329"</code> → <code>"2001:0db8:0000:0000:0000:ff00:0042:8329"</code>. The input may use upper case and groups shorter than four digits; the double colon stands for as many all-zero groups as are needed to reach eight groups.</p>',
  vi: '<p>Viết <code>ipv6Expand(addr)</code> trả dạng đầy đủ 8 nhóm, mỗi nhóm 4 chữ số thường của địa chỉ IPv6 có thể chứa một <code>::</code>. Ví dụ: <code>"::1"</code> → <code>"0000:0000:0000:0000:0000:0000:0000:0001"</code>; <code>"2001:db8::ff00:42:8329"</code> → <code>"2001:0db8:0000:0000:0000:ff00:0042:8329"</code>. Đầu vào có thể viết hoa và nhóm ngắn hơn bốn chữ số; dấu hai chấm kép đại diện cho đủ số nhóm toàn 0 để thành tám nhóm.</p>',
  fn: 'ipv6Expand', params: 'addr', ref: S.ipv6Expand,
  cases: [['2001:db8::ff00:42:8329'], ['::1'], ['::'], ['fe80::1'], ['2001:DB8:0:1::1'], ['1:2:3:4:5:6:7:8'], ['ff02::1:ff00:1']],
  goiY: ['Split on "::" first; the missing group count is 8 − (groups on the left + groups on the right).', 'Pad every group with leading zeros to 4 digits.'],
  loi: ['Forgetting that "::" alone is eight zero groups.', 'Not lowercasing.'],
  gt: ['Expansion is the inverse of compression and a good test that you understood where :: hides zeros.', 'Mở rộng là phép ngược của nén, kiểm tra bạn hiểu :: che các nhóm 0 ở đâu.'],
  kn: ['IPv6 notation'],
});

void mcNum;
export default doiDau({ slug: 'nwc204-11-1-ipv6-notation', ten: '11.1 IPv6 notation and address types', khoa: KHOA, baiHoc: 'nwc204-11-1-cau-truc-dia-chi-ipv6', de: [E1, E2, E3, E4, E5, E6] });
