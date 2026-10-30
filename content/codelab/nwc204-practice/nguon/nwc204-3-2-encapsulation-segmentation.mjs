/** NWC204 · 3.2 — Encapsulation, segmentation and what changes hop by hop. */
import { doiDau, KHOA, bi, tinh, q, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'Encapsulation 1 — What changes hop by hop?', kho: 'EASY', phut: 8,
  en: 'A packet travels PC → R1 → R2 → server. Decide what stays the same end to end and what is rewritten at each router.', vi: 'Gói đi PC → R1 → R2 → server. Xác định cái gì giữ nguyên từ đầu tới cuối và cái gì bị viết lại ở mỗi router.',
  cau: [
    q('c1', ['Which address stays the same from PC to server (no NAT)?', 'Địa chỉ nào giữ nguyên từ PC tới server (không NAT)?'], ['Source and destination IP', 'Source and destination MAC', 'The Ethernet FCS', 'The frame header'], ['IP addresses are end-to-end; MAC addresses are valid on one link only.', 'IP là đầu-cuối; MAC chỉ có giá trị trên một liên kết.']),
    q('c2', ['At every router the Ethernet header is …', 'Ở mỗi router, header Ethernet được …'], ['removed and rebuilt with new MAC addresses for the next link', 'copied unchanged, with the same MAC addresses from end to end', 'encrypted with a key shared by the routers of the same path', 'converted into a TCP header so that the next router can read the ports'], ['A router de-encapsulates to the packet, then re-encapsulates in a new frame.', 'Router mở gói tới packet rồi đóng vào frame mới.']),
    q('c3', ['The IPv4 TTL field is …', 'Trường TTL của IPv4 được …'], ['decreased by 1 at each router', 'increased by 1 at each router', 'copied from the MAC header', 'reset at each switch'], ['A packet whose TTL reaches 0 is discarded (stops routing loops).', 'Gói có TTL về 0 bị huỷ (chống vòng lặp).']),
    q('c4', ['A switch forwards a frame without changing …', 'Switch chuyển frame mà không thay đổi …'], ['the source and destination MAC and the IP packet', 'the IP TTL and the header checksum', 'the destination IP and the source MAC', 'the TCP ports and the destination MAC'], ['A layer 2 switch does not touch the packet, only decides the output port.', 'Switch tầng 2 không đụng tới packet, chỉ chọn cổng ra.']),
    q('c5', ['The TCP segment is read and rebuilt only by …', 'Segment TCP chỉ được đọc và dựng lại bởi …'], ['the two end hosts', 'every router on the path', 'every switch on the path', 'only the default gateway'], ['TCP is end-to-end; routers stop reading at layer 3.', 'TCP là đầu-cuối; router chỉ đọc tới tầng 3.']),
  ],
  goiY: ['Ask “is this address valid on one link or across the whole path?”', 'Routers work at layer 3, switches at layer 2.'],
  loi: ['Believing the destination MAC is the server’s MAC all the way.', 'Thinking a switch decrements TTL.'],
  tn: [tn('TTL', 'thời gian sống của gói')], kn: ['hop-by-hop'],
});

const MS = [[1460, 1460], [4380, 1460], [10000, 1460], [65535, 536]];
const seg = (m, mss) => { const n = Math.ceil(m / mss); return { n, total: m + n * (20 + 20 + 18) }; };
const E2 = tinh({
  tieuDe: 'Encapsulation 2 — Segmentation and bytes on the wire', doKho: 'MEDIUM', phut: 12,
  moTa: mt('An application sends a message over TCP. It is cut into segments of at most <b>MSS</b> bytes. Every segment gets a 20-byte TCP header, a 20-byte IP header and an 18-byte Ethernet header+FCS. Give the number of segments and the total bytes on the wire (ignore handshake and ACKs).', 'Ứng dụng gửi một thông điệp qua TCP. Nó bị cắt thành các segment tối đa <b>MSS</b> byte. Mỗi segment thêm header TCP 20 byte, IP 20 byte và Ethernet 18 byte (gồm FCS). Tính số segment và tổng số byte trên đường dây (bỏ qua bắt tay và ACK).'),
  loai: 'table',
  bang: [bang1('b1', ['Segmentation', 'Phân đoạn'], [{ ma: 'x', ten: 'Message' }, { ma: 'n', ten: 'Segments' }, { ma: 't', ten: 'Bytes on the wire' }],
    MS.map(([m, mss]) => ({ o: { x: `${m} B, MSS ${mss}` }, a: { n: [String(seg(m, mss).n)], t: [String(seg(m, mss).total)] } })),
    ['segments = ⌈message ÷ MSS⌉; total = message + segments × 58. ' + MS.map(([m, mss]) => `${m}/${mss}: ${seg(m, mss).n} seg, ${seg(m, mss).total} B`).join('; ') + '.', 'số segment = ⌈thông điệp ÷ MSS⌉; tổng = thông điệp + số segment × 58.'])],
  goiY: ['Use the ceiling for the segment count.', 'Each segment carries its own 58 bytes of headers.'],
  loiHayGap: ['Rounding the number of segments down.', 'Counting the headers only once for the whole message.'],
  thuatNgu: [tn('MSS', 'kích thước segment tối đa')], khaiNiem: ['segmentation'],
});

function wireBytes(msgBytes, mss) {
  var segments = Math.ceil(msgBytes / mss);
  return { segments: segments, totalBytes: msgBytes + segments * (20 + 20 + 18), lastSegment: msgBytes - (segments - 1) * mss };
}
const E3 = js({
  ten: 'Encapsulation 3 — Write wireBytes(msgBytes, mss)', kho: 'MEDIUM', phut: 15,
  en: '<p>Write <code>wireBytes(msgBytes, mss)</code> returning <code>{ segments, totalBytes, lastSegment }</code>. Each segment carries 20 B TCP + 20 B IP + 18 B Ethernet headers; <code>lastSegment</code> is the payload size of the final segment.</p>',
  vi: '<p>Viết <code>wireBytes(msgBytes, mss)</code> trả <code>{ segments, totalBytes, lastSegment }</code>. Mỗi segment có header 20 B TCP + 20 B IP + 18 B Ethernet; <code>lastSegment</code> là kích thước dữ liệu của segment cuối.</p>',
  fn: 'wireBytes', params: 'msgBytes, mss', ref: wireBytes,
  cases: [[1460, 1460], [4380, 1460], [4381, 1460], [100, 1460], [10000, 536], [65535, 1460], [1, 1460]],
  goiY: ['segments = Math.ceil(msgBytes / mss).', 'The last segment holds what is left: msgBytes − (segments − 1) × mss.'],
  loi: ['Using Math.floor, losing the partial last segment.', 'Counting the headers once instead of per segment.'],
  gt: ['Segmentation is a ceiling division; the overhead grows with the number of segments, which is why a larger MSS is more efficient.', 'Phân đoạn là phép chia làm tròn lên; chi phí header tăng theo số segment nên MSS lớn hiệu quả hơn.'],
  kn: ['segmentation', 'overhead'],
});

const E4 = cs({
  ten: 'Encapsulation 4 — Read the capture', kho: 'HARD', phut: 10,
  en: 'A capture shows the stack: Ethernet II (dst 00:11:22:33:44:55) / IPv4 (src 10.0.0.5, dst 172.16.1.9, TTL 62) / TCP (src port 51514, dst port 443, SYN).', vi: 'Một bản bắt gói cho thấy chồng: Ethernet II (dst 00:11:22:33:44:55) / IPv4 (src 10.0.0.5, dst 172.16.1.9, TTL 62) / TCP (cổng nguồn 51514, cổng đích 443, SYN).',
  cau: [
    q('c1', ['Which service is the client trying to reach?', 'Client đang cố tới dịch vụ nào?'], ['HTTPS (port 443)', 'HTTP (port 80)', 'SSH (port 22)', 'DNS (port 53)'], ['Destination port 443 is the well-known HTTPS port.', 'Cổng đích 443 là cổng HTTPS quen thuộc.']),
    q('c2', ['Whose MAC address is 00:11:22:33:44:55 most likely?', 'Địa chỉ MAC 00:11:22:33:44:55 nhiều khả năng của ai?'], ['The next hop (the default gateway)', 'The server 172.16.1.9', 'The client itself', 'The DNS server'], ['The server is on another network, so the frame is addressed to the gateway.', 'Server ở mạng khác nên frame gửi tới gateway.']),
    q('c3', ['Source port 51514 is …', 'Cổng nguồn 51514 là …'], ['an ephemeral (dynamic) port chosen by the client OS', 'a well-known port', 'a reserved port of the server', 'a MAC-derived value'], ['Clients use ports from the dynamic range (49152–65535 per IANA).', 'Client dùng cổng động (49152–65535 theo IANA).']),
    q('c4', ['The SYN flag shows this is …', 'Cờ SYN cho thấy đây là …'], ['the first step of the TCP three-way handshake', 'the last step of the connection', 'a UDP datagram', 'a DNS query'], ['SYN opens the connection; SYN-ACK and ACK follow.', 'SYN mở kết nối; SYN-ACK và ACK theo sau.']),
    q('c5', ['TTL 62 suggests the packet started at 64 and passed …', 'TTL 62 gợi ý gói xuất phát 64 và đã qua …'], ['2 routers', '62 routers', '1 router', '64 routers'], ['64 − 62 = 2 decrements, one per router.', '64 − 62 = 2 lần giảm, mỗi router một lần.']),
  ],
  goiY: ['Go layer by layer: MAC → IP → port → flag.', 'Common start TTLs are 64, 128 and 255.'],
  loi: ['Reading the destination MAC as the server’s MAC.', 'Confusing the source port with a service.'],
  tn: [tn('ephemeral port', 'cổng tạm thời')], kn: ['packet capture'],
});

void bi;
export default doiDau({ slug: 'nwc204-3-2-encapsulation-segmentation', ten: '3.2 Encapsulation and segmentation', khoa: KHOA, baiHoc: 'nwc204-3-2-mo-hinh-tham-chieu-va-dong-goi', de: [E1, E2, E3, E4] });
