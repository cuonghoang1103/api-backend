/** NWC204 · 7.1 — The IPv4 packet: header, TTL and fragmentation. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'IPv4 1 — Header fields', kho: 'EASY', phut: 8,
  en: 'Read the IPv4 header.', vi: 'Đọc header IPv4.',
  cau: [
    q('c1', ['The minimum size of an IPv4 header is …', 'Kích thước tối thiểu của header IPv4 là …'], ['20 bytes', '8 bytes', '40 bytes', '60 bytes'], ['IHL = 5 words of 4 bytes; options can extend it to 60 bytes.', 'IHL = 5 từ 4 byte; option có thể kéo dài tới 60 byte.']),
    q('c2', ['The Protocol field value 6 means the payload is …', 'Giá trị 6 của trường Protocol nghĩa là dữ liệu là …'], ['TCP', 'UDP', 'ICMP', 'OSPF'], ['1 = ICMP, 6 = TCP, 17 = UDP, 89 = OSPF.', '1 = ICMP, 6 = TCP, 17 = UDP, 89 = OSPF.']),
    q('c3', ['Which field stops a packet from circling forever in a routing loop?', 'Trường nào ngăn gói quay vòng vô tận khi có vòng lặp định tuyến?'], ['TTL', 'Identification', 'Header checksum', 'Flags'], ['Each router decrements TTL; at 0 the packet is dropped and ICMP Time Exceeded is sent.', 'Mỗi router giảm TTL; về 0 thì gói bị huỷ và gửi ICMP Time Exceeded.']),
    q('c4', ['Which header fields must a router change when forwarding?', 'Router bắt buộc phải đổi các trường nào của header khi chuyển tiếp?'], ['TTL and header checksum', 'Source and destination IP', 'Protocol', 'Version'], ['TTL changes, so the checksum is recomputed.', 'TTL đổi nên checksum được tính lại.']),
    q('c5', ['The DF (Don’t Fragment) bit set and a packet larger than the next link’s MTU. The router …', 'Bit DF (Don’t Fragment) bật và gói lớn hơn MTU của liên kết kế. Router …'], ['drops the packet and sends ICMP “fragmentation needed”', 'fragments it anyway and sets the MF bit on each fragment', 'forwards it unchanged and sends an ICMP redirect', 'truncates the payload to the MTU and forwards the rest'], ['This is the basis of Path MTU Discovery.', 'Đây là nền tảng của Path MTU Discovery.']),
  ],
  goiY: ['1/6/17 = ICMP/TCP/UDP.', 'The header checksum covers the header only.'],
  loi: ['Believing routers rewrite the IP addresses (only NAT does).', 'Forgetting to recompute the checksum after changing TTL.'],
  tn: [tn('Path MTU Discovery', 'khám phá MTU đường đi')], kn: ['IPv4 header'],
});

const FR = [[4000, 1500], [2000, 576], [1500, 1500], [3000, 1000]];
const fmtF = (t, m) => { const f = S.fragment(t, m); const l = f[f.length - 1]; return { n: f.length, off: l.offset, len: l.dataLen }; };
const E2 = tinh({
  tieuDe: 'IPv4 2 — Fragmentation by hand', doKho: 'MEDIUM', phut: 14,
  moTa: mt('An IPv4 packet of the given <b>total length</b> (header 20 B included) must cross a link with the given MTU. Each fragment carries its own 20-byte header, and the data in a non-final fragment is a multiple of 8 bytes. Give the number of fragments, and for the LAST fragment its fragment offset (in units of 8 bytes) and its data length.', 'Gói IPv4 có <b>tổng độ dài</b> cho trước (đã gồm header 20 B) phải qua liên kết có MTU cho trước. Mỗi mảnh có header 20 byte riêng và dữ liệu của mảnh không phải cuối là bội của 8 byte. Cho số mảnh, và với mảnh CUỐI: fragment offset (đơn vị 8 byte) và độ dài dữ liệu.'),
  loai: 'table',
  bang: [bang1('b1', ['Fragmentation', 'Phân mảnh'], [{ ma: 'x', ten: 'Packet / MTU' }, { ma: 'n', ten: 'Fragments' }, { ma: 'o', ten: 'Last offset' }, { ma: 'l', ten: 'Last data length' }],
    FR.map(([t, m]) => ({ o: { x: `${t} B, MTU ${m}` }, a: { n: [String(fmtF(t, m).n)], o: [String(fmtF(t, m).off)], l: [String(fmtF(t, m).len)] } })),
    [FR.map(([t, m]) => { const f = S.fragment(t, m); return `${t}/${m}: ${f.map((x) => `[off ${x.offset}, ${x.dataLen} B, MF ${x.mf}]`).join(' ')}`; }).join('; ') + '. Max data per fragment = ⌊(MTU − 20) / 8⌋ × 8.', 'Dữ liệu tối đa mỗi mảnh = ⌊(MTU − 20) / 8⌋ × 8.'])],
  goiY: ['Data to carry = total − 20.', 'Offset of fragment k = (sum of previous data) ÷ 8.'],
  loiHayGap: ['Using MTU − 20 without rounding down to a multiple of 8.', 'Forgetting that the offset is in 8-byte units.'],
  thuatNgu: [tn('fragment offset', 'vị trí mảnh'), tn('MF flag', 'cờ còn mảnh')], khaiNiem: ['fragmentation'],
});

const E3 = cs({
  ten: 'IPv4 3 — TTL and fragments in practice', kho: 'MEDIUM', phut: 10,
  en: 'Numeric and reasoning questions.', vi: 'Câu hỏi số và suy luận.',
  cau: [
    mcNum('c1', ['A packet leaves a host with TTL 64 and crosses 9 routers. The TTL on arrival is …', 'Gói rời host với TTL 64 và qua 9 router. TTL khi tới đích là …'], 55, [54, 56, 73], null, ['64 − 9 = 55.', '64 − 9 = 55.']),
    q('c2', ['A 4000-byte datagram is fragmented. Which fragment has MF = 0?', 'Datagram 4000 byte bị phân mảnh. Mảnh nào có MF = 0?'], ['Only the last fragment', 'Only the first fragment', 'All fragments', 'None'], ['MF = “more fragments follow”; the last one has none.', 'MF = “còn mảnh theo sau”; mảnh cuối thì không.']),
    q('c3', ['Who reassembles the fragments?', 'Ai ghép lại các mảnh?'], ['The destination host', 'The next router', 'The first router', 'The switch'], ['Routers never reassemble; only the final host does, using Identification + offset.', 'Router không bao giờ ghép; chỉ host cuối ghép, dựa vào Identification + offset.']),
    q('c4', ['If one fragment is lost, then …', 'Nếu mất một mảnh thì …'], ['the whole datagram is discarded after a timeout', 'only that fragment is retransmitted by IP', 'the receiver rebuilds the missing part', 'the datagram is delivered with a hole'], ['IP has no retransmission; TCP or the app must resend all of it.', 'IP không gửi lại; TCP hoặc ứng dụng phải gửi lại toàn bộ.']),
  ],
  goiY: ['TTL falls by one per router.', 'IP is best effort: no recovery.'],
  loi: ['Thinking intermediate routers reassemble.', 'Subtracting the number of switches from the TTL.'],
  tn: [tn('reassembly', 'ghép mảnh')], kn: ['TTL', 'reassembly'],
});

function fragment(totalLen, mtu) {
  var data = totalLen - 20, per = Math.floor((mtu - 20) / 8) * 8, off = 0, out = [];
  while (data > 0) {
    var n = Math.min(per, data);
    out.push({ offset: off / 8, dataLen: n, mf: data - n > 0 ? 1 : 0 });
    off += n; data -= n;
  }
  return out;
}
const E4 = js({
  ten: 'IPv4 4 — Write fragment(totalLen, mtu)', kho: 'HARD', phut: 18,
  en: '<p>Write <code>fragment(totalLen, mtu)</code> returning the fragments as <code>[{ offset, dataLen, mf }]</code>: <code>offset</code> in 8-byte units, <code>dataLen</code> the data bytes of that fragment, <code>mf</code> 1 if more follow else 0. Header is 20 bytes in every fragment; non-final data lengths are multiples of 8. A packet that fits in the MTU gives one fragment with <code>offset 0</code> and <code>mf 0</code>.</p>',
  vi: '<p>Viết <code>fragment(totalLen, mtu)</code> trả các mảnh dạng <code>[{ offset, dataLen, mf }]</code>: <code>offset</code> theo đơn vị 8 byte, <code>dataLen</code> là số byte dữ liệu của mảnh, <code>mf</code> bằng 1 nếu còn mảnh sau, ngược lại 0. Header 20 byte trong mọi mảnh; dữ liệu mảnh không cuối là bội của 8. Gói vừa MTU cho đúng một mảnh với <code>offset 0</code> và <code>mf 0</code>.</p>',
  fn: 'fragment', params: 'totalLen, mtu', ref: fragment,
  cases: [[4000, 1500], [1500, 1500], [2000, 576], [100, 1500], [3000, 1000], [65535, 1500], [21, 28]],
  goiY: ['perFragment = Math.floor((mtu - 20) / 8) * 8.', 'Loop while data remains; offset advances by dataLen / 8.'],
  loi: ['Computing the per-fragment size as mtu - 20 (not a multiple of 8).', 'Setting mf to 1 on the final fragment.'],
  gt: ['This reproduces the textbook 4000/1500 example: 1480 + 1480 + 1020 bytes at offsets 0, 185, 370.', 'Tái hiện ví dụ sách giáo khoa 4000/1500: 1480 + 1480 + 1020 byte tại offset 0, 185, 370.'],
  kn: ['fragmentation'],
});

export default doiDau({ slug: 'nwc204-7-1-ipv4-packet', ten: '7.1 The IPv4 packet and fragmentation', khoa: KHOA, baiHoc: 'nwc204-7-1-dac-tinh-tang-mang-va-goi-ipv4', de: [E1, E2, E3, E4] });
