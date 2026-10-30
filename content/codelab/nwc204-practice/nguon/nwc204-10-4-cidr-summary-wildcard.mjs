/** NWC204 · 10.4 — CIDR, route summarisation and wildcard masks. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const SUM = [
  ['192.168.0.0/24', '192.168.1.0/24', '192.168.2.0/24', '192.168.3.0/24'],
  ['10.1.0.0/16', '10.2.0.0/16', '10.3.0.0/16', '10.0.0.0/16'],
  ['172.16.32.0/24', '172.16.33.0/24'],
  ['192.168.10.64/26', '192.168.10.128/26'],
];
const E1 = tinh({
  tieuDe: 'CIDR 1 — Summarise the routes', doKho: 'MEDIUM', phut: 12,
  moTa: mt('Give the shortest single CIDR block that covers all listed networks (the summary route).', 'Cho khối CIDR đơn ngắn nhất bao trùm mọi mạng được liệt kê (tuyến tóm tắt).'),
  loai: 'table',
  bang: [bang1('b1', ['Summaries', 'Tóm tắt tuyến'], [{ ma: 'n', ten: 'Networks' }, { ma: 's', ten: 'Summary' }],
    SUM.map((l) => ({ o: { n: l.join(', ') }, a: { s: [S.summarize(l)] } })),
    [SUM.map((l) => `${S.summarize(l)}`).join('; ') + '. Count the leading bits the network addresses share.', 'Đếm số bit đầu mà các địa chỉ mạng chung.'])],
  goiY: ['Write the differing octet in binary and find where the common bits stop.', 'Four consecutive /24s starting on a multiple of 4 summarise to a /22.'],
  loiHayGap: ['Using a summary that also swallows networks you do not own.', 'Starting a /22 on a number that is not a multiple of 4.'],
  thuatNgu: [tn('summary route', 'tuyến tóm tắt'), tn('supernet', 'siêu mạng')], khaiNiem: ['route summarisation'],
});

const EX = [
  [['172.16.4.0/24', '172.16.5.0/24', '172.16.6.0/24', '172.16.7.0/24'], 'exact'],
  [['172.16.4.0/24', '172.16.5.0/24', '172.16.7.0/24'], 'extra'],
  [['10.0.0.0/24', '10.0.2.0/24'], 'extra'],
  [['192.168.8.0/23', '192.168.10.0/23'], 'exact'],
];
const count = (l) => l.reduce((a, c) => a + Math.pow(2, 32 - Number(c.split('/')[1])), 0);
const E2 = cs({
  ten: 'CIDR 2 — Exact summary or over-broad?', kho: 'HARD', phut: 12,
  en: 'A good summary covers exactly the listed networks. Count the addresses in the summary and in the list.', vi: 'Tóm tắt tốt chỉ bao đúng các mạng được liệt kê. Đếm địa chỉ trong tóm tắt và trong danh sách.',
  cau: EX.map(([l, r], i) => {
    const s = S.summarize(l), size = Math.pow(2, 32 - Number(s.split('/')[1])), have = count(l);
    if ((size === have) !== (r === 'exact')) throw new Error('EX sai ' + i);
    return q('c' + (i + 1), [`Networks ${l.join(', ')} summarised as ${s}. This is …`, `Các mạng ${l.join(', ')} tóm tắt thành ${s}. Đây là …`],
      r === 'exact' ? [`exact: ${s} has ${size} addresses, the list ${have}`, `over-broad: ${s} has ${size * 2} addresses, the list only ${have}`, 'too narrow: it leaves out one of the listed networks', `invalid CIDR: ${s} is not aligned on its block size`] : [`over-broad: ${s} has ${size} addresses, the list only ${have}`, `exact: ${s} has ${have} addresses, the list ${have}`, 'too narrow: it leaves out one of the listed networks', `invalid CIDR: ${s} is not aligned on its block size`],
      ['Compare the address counts: equal means exact.', 'So sánh số địa chỉ: bằng nhau là chính xác.']);
  }),
  goiY: ['Size of /p is 2^(32−p).', 'Extra addresses mean the router would advertise networks it cannot reach.'],
  loi: ['Assuming a summary is always fine.', 'Believing the first and last network decide the summary.'],
  tn: [tn('over-summarisation', 'tóm tắt quá rộng')], kn: ['summary quality'],
});

const W = [['192.168.10.0', 24], ['10.1.0.0', 16], ['172.16.32.0', 20], ['192.168.1.64', 26], ['10.0.0.5', 32]];
const E3 = tinh({
  tieuDe: 'CIDR 3 — Wildcard masks for ACLs and OSPF', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Give the wildcard mask that matches exactly all addresses of each network (wildcard = inverse of the subnet mask).', 'Cho wildcard mask khớp đúng mọi địa chỉ của mỗi mạng (wildcard = đảo của subnet mask).'),
  loai: 'table',
  bang: [bang1('b1', ['Wildcards', 'Wildcard'], [{ ma: 'n', ten: 'Network' }, { ma: 'w', ten: 'Wildcard mask' }],
    W.map(([n, p]) => ({ o: { n: `${n}/${p}` }, a: { w: [S.ipInfo(n, p).wildcard] } })),
    [W.map(([n, p]) => `${n}/${p} → ${S.ipInfo(n, p).wildcard}`).join('; ') + '. A 0 bit must match, a 1 bit is ignored; a /32 host is 0.0.0.0 (“host x”).', 'Bit 0 phải khớp, bit 1 bỏ qua; host /32 là 0.0.0.0 (“host x”).'])],
  goiY: ['Wildcard octet = 255 − mask octet.', 'Sum of mask and wildcard in each octet is 255.'],
  loiHayGap: ['Using the subnet mask in an ACL.', 'Getting the wildcard of a /26 wrong (0.0.0.63, not 0.0.0.64).'],
  thuatNgu: [tn('wildcard mask', 'mặt nạ wildcard')], khaiNiem: ['wildcard'],
});

const E4 = cs({
  ten: 'CIDR 4 — Aggregation reasoning', kho: 'MEDIUM', phut: 8,
  en: 'Small calculations about CIDR blocks.', vi: 'Các phép tính nhỏ về khối CIDR.',
  cau: [
    mcNum('c1', ['How many /24 networks are inside a /16?', 'Có bao nhiêu mạng /24 trong một /16?'], 256, [16, 65536, 254], null, ['2^(24−16) = 256.', '2^(24−16) = 256.']),
    mcNum('c2', ['How many addresses in 10.8.0.0/13?', '10.8.0.0/13 có bao nhiêu địa chỉ?'], 524288, [262144, 1048576, 8192], (x) => x.toLocaleString('en-US'), ['2^(32−13) = 524,288.', '2^(32−13) = 524.288.']),
    q('c3', ['The last address of 10.8.0.0/13 is …', 'Địa chỉ cuối của 10.8.0.0/13 là …'], ['10.15.255.255', '10.8.255.255', '10.16.0.0', '10.11.255.255'], ['A /13 spans 8 values of the second octet: 8–15.', 'Một /13 trải 8 giá trị của octet thứ hai: 8–15.']),
    q('c4', ['CIDR (RFC 4632) replaced classful addressing mainly to …', 'CIDR (RFC 4632) thay địa chỉ theo lớp chủ yếu để …'], ['use address space efficiently and shrink routing tables via aggregation', 'add more classes (F, G, …) to the existing A, B and C', 'remove the need for masks, because the first bits show the class', 'make DHCP faster by sending shorter options in each lease'], ['Prefix length is independent of the first octet.', 'Độ dài prefix không còn phụ thuộc octet đầu.']),
  ],
  goiY: ['Prefix difference = number of doublings.', '/13 means the second octet is partly host bits.'],
  loi: ['Using the class instead of the prefix.', 'Forgetting that /13 ends at 15, not 8.'],
  tn: [tn('CIDR', 'định tuyến liên miền không lớp')], kn: ['CIDR'],
});

const E5 = js({
  ten: 'CIDR 5 — Write summarize(nets)', kho: 'HARD', phut: 20,
  en: '<p>Write <code>summarize(nets)</code> where <code>nets</code> is an array of <code>"a.b.c.d/p"</code>. Return the shortest CIDR (<code>"a.b.c.d/p"</code>, network address of the block) that contains all of them.</p>',
  vi: '<p>Viết <code>summarize(nets)</code> với <code>nets</code> là mảng <code>"a.b.c.d/p"</code>. Trả CIDR ngắn nhất (<code>"a.b.c.d/p"</code>, địa chỉ mạng của khối) chứa tất cả.</p>',
  fn: 'summarize', params: 'nets', ref: S.summarize,
  cases: [[SUM[0]], [SUM[1]], [SUM[2]], [['10.0.0.0/8']], [['10.1.0.0/16', '192.168.1.0/24']], [['192.168.1.128/25', '192.168.1.0/25']], [['172.16.0.0/16', '172.17.0.0/16', '172.18.0.0/16']]],
  goiY: ['Start with the shortest prefix present and shorten it until all addresses agree after masking.', 'Always return the network address, not the first input.'],
  loi: ['Returning the first address unmasked.', 'Stopping at the first prefix length instead of the longest that works.'],
  gt: ['Summaries are found by shrinking the prefix until all networks fall into one block.', 'Tóm tắt tìm bằng cách rút ngắn prefix tới khi mọi mạng nằm trong một khối.'],
  kn: ['route summarisation'],
});

void tinh;
export default doiDau({ slug: 'nwc204-10-4-cidr-summary-wildcard', ten: '10.4 CIDR, summarisation and wildcard masks', khoa: KHOA, baiHoc: 'nwc204-ch10-quiz', de: [E1, E2, E3, E4, E5] });
