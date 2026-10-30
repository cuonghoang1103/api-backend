/** NWC204 · 13.1 — Transport layer: ports, the TCP handshake, sliding window and congestion. */
import { doiDau, KHOA, S, tinh, q, ord, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'Transport 1 — Ports, TCP and UDP', kho: 'EASY', phut: 8,
  en: 'Layer 4 fundamentals.', vi: 'Kiến thức nền tầng 4.',
  cau: [
    q('c1', ['Which protocol would you choose for a live voice call where late data is useless?', 'Giao thức nào nên chọn cho cuộc gọi thoại trực tiếp, nơi dữ liệu đến muộn là vô dụng?'], ['UDP', 'TCP', 'ICMP', 'ARP'], ['UDP has no retransmission delay and no handshake.', 'UDP không trễ do gửi lại và không bắt tay.']),
    q('c2', ['The well-known port numbers are in the range …', 'Cổng well-known nằm trong khoảng …'], ['0–1023', '1024–49151', '49152–65535', '1–255'], ['Registered ports are 1024–49151; dynamic/ephemeral 49152–65535.', 'Cổng đăng ký 1024–49151; cổng động 49152–65535.']),
    q('c3', ['A socket is identified by …', 'Một socket được xác định bởi …'], ['IP address, port and protocol', 'MAC address and VLAN ID', 'IP address and subnet mask', 'Port number and VLAN ID'], ['A TCP connection = two sockets (a 4-tuple).', 'Một kết nối TCP = hai socket (bộ bốn).']),
    q('c4', ['What does TCP provide that UDP does not?', 'TCP cung cấp gì mà UDP không có?'], ['Reliable, ordered delivery with flow and congestion control', 'Port numbers that name the sending and receiving process', 'Checksums that detect damaged segments and datagrams', 'Multiplexing of many applications by port number'], ['UDP also has ports and a checksum.', 'UDP cũng có cổng và checksum.']),
    q('c5', ['HTTPS, SSH, DNS and SMTP use the default ports …', 'HTTPS, SSH, DNS và SMTP dùng cổng mặc định …'], ['443, 22, 53, 25', '80, 23, 53, 110', '443, 21, 67, 25', '8080, 22, 123, 587'], ['Memorise these four with 80 (HTTP), 23 (Telnet), 21 (FTP), 67/68 (DHCP).', 'Nhớ bốn cổng này cùng 80 (HTTP), 23 (Telnet), 21 (FTP), 67/68 (DHCP).']),
  ],
  goiY: ['TCP = reliable, UDP = fast and simple.', 'Ports multiplex many applications on one IP.'],
  loi: ['Believing UDP has no ports.', 'Using TCP for real-time voice by habit.'],
  tn: [tn('socket', 'điểm cuối kết nối'), tn('multiplexing', 'dồn kênh')], kn: ['TCP', 'UDP', 'ports'],
});

const TR = S.tcpTrace(1000, 5000, [100, 200]);
const SEL = [1, 2, 3, 4, 5, 6];
const desc = (s, i) => `#${i + 1} ${s.from === 'C' ? 'client' : 'server'} ${s.flags}${s.len ? ', ' + s.len + ' data bytes' : ''}`;
const E2 = tinh({
  tieuDe: 'Transport 2 — Sequence and acknowledgment numbers', doKho: 'MEDIUM', phut: 15,
  moTa: mt('Client ISN = 1000, server ISN = 5000. The client sends two segments of 100 and 200 bytes; the server ACKs each. SYN and FIN each consume one sequence number. Fill the <b>seq</b> and <b>ack</b> numbers of segments #2–#7 (#1 is SYN seq 1000).', 'ISN client = 1000, ISN server = 5000. Client gửi hai segment 100 và 200 byte; server ACK từng cái. SYN và FIN mỗi cái tốn một số thứ tự. Điền <b>seq</b> và <b>ack</b> của segment #2–#7 (#1 là SYN seq 1000).'),
  loai: 'table',
  bang: [bang1('b1', ['Numbers', 'Số hiệu'], [{ ma: 's', ten: 'Segment' }, { ma: 'q', ten: 'seq' }, { ma: 'a', ten: 'ack' }],
    SEL.map((i) => ({ o: { s: desc(TR[i], i) }, a: { q: [String(TR[i].seq)], a: [String(TR[i].ack)] } })),
    [TR.slice(0, 9).map((s, i) => `#${i + 1} seq ${s.seq} ack ${s.ack}`).join('; ') + '. ack = the next byte expected from the other side.', 'ack = byte tiếp theo mong nhận từ phía kia.'])],
  goiY: ['The SYN-ACK acknowledges client ISN + 1.', 'After sending N bytes, the next seq is old seq + N.'],
  loiHayGap: ['Forgetting that SYN consumes one sequence number.', 'Using the segment’s own seq as the ack.'],
  thuatNgu: [tn('ISN', 'số thứ tự khởi đầu')], khaiNiem: ['TCP numbers'],
});

const E3 = tinh({
  tieuDe: 'Transport 3 — Order the three-way handshake and the close', doKho: 'MEDIUM', phut: 8,
  moTa: mt('Put the segments of a normal TCP connection life in order.', 'Sắp các segment của một vòng đời kết nối TCP bình thường theo thứ tự.'),
  loai: 'order',
  cauHoi: [ord('q1', ['Open and close', 'Mở và đóng'], ['Client → server: SYN', 'Server → client: SYN, ACK', 'Client → server: ACK (connection established)', 'Client → server: data (PSH, ACK)', 'Server → client: ACK for the data', 'Client → server: FIN, ACK', 'Server → client: ACK, then FIN, ACK', 'Client → server: final ACK'], ['Three steps open the connection; four steps close it (each direction closes separately).', 'Ba bước mở kết nối; bốn bước đóng (mỗi chiều đóng riêng).'], 3)],
  goiY: ['SYN, SYN-ACK, ACK.', 'FIN and ACK are exchanged in both directions.'],
  loiHayGap: ['Sending data before the third ACK in theory (data can ride on the ACK).', 'Putting the server FIN before the client FIN.'],
  thuatNgu: [tn('three-way handshake', 'bắt tay ba bước')], khaiNiem: ['TCP lifecycle'],
});

const E4 = js({
  ten: 'Transport 4 — Write tcpTrace(isnC, isnS, sizes)', kho: 'HARD', phut: 25,
  en: '<p>Write <code>tcpTrace(isnC, isnS, sizes)</code> returning every segment as <code>{ from, flags, seq, ack, len }</code> (<code>from</code> is <code>"C"</code> or <code>"S"</code>): SYN (ack 0), SYN,ACK, ACK; then for each size the client sends <code>PSH,ACK</code> with <code>len</code> bytes and the server answers <code>ACK</code>; then close with <code>FIN,ACK</code> (C), <code>ACK</code> (S), <code>FIN,ACK</code> (S), <code>ACK</code> (C). SYN and FIN consume one sequence number each.</p>',
  vi: '<p>Viết <code>tcpTrace(isnC, isnS, sizes)</code> trả mọi segment dạng <code>{ from, flags, seq, ack, len }</code> (<code>from</code> là <code>"C"</code> hoặc <code>"S"</code>): SYN (ack 0), SYN,ACK, ACK; rồi với mỗi kích thước client gửi <code>PSH,ACK</code> <code>len</code> byte và server đáp <code>ACK</code>; cuối cùng đóng bằng <code>FIN,ACK</code> (C), <code>ACK</code> (S), <code>FIN,ACK</code> (S), <code>ACK</code> (C). SYN và FIN mỗi cái tốn một số thứ tự.</p>',
  fn: 'tcpTrace', params: 'isnC, isnS, sizes', ref: S.tcpTrace,
  cases: [[1000, 5000, [100, 200]], [0, 0, []], [4294967000, 1, [300]], [42, 99, [1, 1, 1]], [100, 200, [1460]], [7, 8, [10, 20, 30, 40]]],
  goiY: ['Keep two running counters c and s; update them after SYN, after data and after FIN.', 'The final ACKs carry the incremented numbers.'],
  loi: ['Not incrementing the counter for SYN/FIN.', 'Making the server ACK the segment’s own seq.'],
  gt: ['Wireshark’s “relative sequence numbers” are exactly this bookkeeping minus the ISN.', '“Relative sequence number” của Wireshark chính là sổ sách này trừ đi ISN.'],
  kn: ['TCP sequence numbers'],
});

const W = [[8, 4, [], 'gbn'], [8, 4, [1], 'gbn'], [8, 4, [1], 'sr'], [8, 4, [1, 2], 'gbn'], [10, 5, [2, 7], 'gbn'], [10, 5, [2, 7], 'sr']];
const E5 = tinh({
  tieuDe: 'Transport 5 — Go-Back-N versus Selective Repeat', doKho: 'HARD', phut: 15,
  moTa: mt('Segments are numbered from 0. Each round trip the sender transmits the window. A segment listed as lost is lost the FIRST time only. Go-Back-N resends from the first lost segment; Selective Repeat resends only the lost ones. Give the number of rounds and the total transmissions.', 'Segment đánh số từ 0. Mỗi vòng khứ hồi, bên gửi phát cả cửa sổ. Segment trong danh sách mất chỉ ở LẦN ĐẦU. Go-Back-N gửi lại từ segment mất đầu tiên; Selective Repeat chỉ gửi lại các segment mất. Cho số vòng và tổng số lần truyền.'),
  loai: 'table',
  bang: [bang1('b1', ['Window simulation', 'Mô phỏng cửa sổ'], [{ ma: 'x', ten: 'Case' }, { ma: 'r', ten: 'Rounds' }, { ma: 't', ten: 'Transmissions' }],
    W.map(([n, w, l, m]) => { const r = S.windowSim(n, w, l, m); return { o: { x: `${n} segments, window ${w}, lost ${l.length ? l.join(',') : 'none'}, ${m === 'gbn' ? 'Go-Back-N' : 'Selective Repeat'}` }, a: { r: [String(r.rounds)], t: [String(r.transmissions)] } }; }),
    ['Go-Back-N repeats everything after the loss; Selective Repeat repeats only what was lost. ' + W.map(([n, w, l, m]) => { const r = S.windowSim(n, w, l, m); return `${m}: ${r.rounds} rounds, ${r.transmissions} tx`; }).join('; ') + '.', 'Go-Back-N lặp lại mọi thứ sau chỗ mất; Selective Repeat chỉ lặp lại cái bị mất.'])],
  goiY: ['Draw the rounds: which segments are in the window each round?', 'In Go-Back-N the window restarts at the first lost segment.'],
  loiHayGap: ['Counting retransmissions only for the lost segment in Go-Back-N.', 'Letting Selective Repeat slide past an unacknowledged segment.'],
  thuatNgu: [tn('sliding window', 'cửa sổ trượt')], khaiNiem: ['sliding window'],
});

const E6 = js({
  ten: 'Transport 6 — Write windowSim(total, w, lost, mode)', kho: 'HARD', phut: 30,
  en: '<p>Write <code>windowSim(total, w, lost, mode)</code> returning <code>{ rounds, transmissions }</code> under the rules of the previous exercise. Each round the sender transmits the segments of the window <code>[base, base + w)</code> that are not yet acknowledged (Go-Back-N: <i>all</i> of them from <code>base</code>). A segment in <code>lost</code> is lost on its first transmission only, so two lost segments in the same Go-Back-N window cost one go-back, not two. <code>mode</code> is <code>"gbn"</code> (base moves to the first lost segment, or past the window if none) or <code>"sr"</code> (received segments are acknowledged individually; base moves to the first unacknowledged segment).</p>',
  vi: '<p>Viết <code>windowSim(total, w, lost, mode)</code> trả <code>{ rounds, transmissions }</code> theo luật của bài trước. Mỗi vòng bên gửi phát các segment trong cửa sổ <code>[base, base + w)</code> chưa được ACK (Go-Back-N: <i>tất cả</i> từ <code>base</code>). Segment trong <code>lost</code> chỉ mất ở lần phát đầu, nên hai segment mất trong cùng một cửa sổ Go-Back-N chỉ tốn một lần lùi, không phải hai. <code>mode</code> là <code>"gbn"</code> (base nhảy tới segment mất đầu tiên, hoặc qua hết cửa sổ nếu không mất) hoặc <code>"sr"</code> (segment nhận được ACK riêng; base nhảy tới segment chưa ACK đầu tiên).</p>',
  fn: 'windowSim', params: 'total, w, lost, mode', ref: S.windowSim,
  cases: [[8, 4, [], 'gbn'], [8, 4, [1], 'gbn'], [8, 4, [1], 'sr'], [10, 5, [2, 7], 'gbn'], [10, 5, [2, 7], 'sr'], [6, 1, [3], 'gbn'], [12, 4, [0, 5, 6], 'sr'], [0, 4, [], 'gbn'], [8, 4, [1, 2], 'gbn']],
  goiY: ['In Go-Back-N the lost segment is delivered on the next round after the sender goes back.', 'A listed segment is lost only the first time it is sent: remove every segment of the round from the lost set, even those after the first loss.'],
  loi: ['Making Selective Repeat resend already acknowledged segments.', 'Forgetting that loss happens only once.'],
  gt: ['The difference is the cost of one loss: Go-Back-N wastes the whole window, Selective Repeat just one segment.', 'Khác biệt là giá của một lần mất: Go-Back-N lãng phí cả cửa sổ, Selective Repeat chỉ một segment.'],
  kn: ['sliding window', 'ARQ'],
});

const E7 = js({
  ten: 'Transport 7 — Slow start and congestion avoidance', kho: 'HARD', phut: 20,
  en: '<p>Write <code>cwndTrace(ssthresh, rounds, timeouts)</code> returning the congestion window (in MSS) at the <i>start</i> of each round 1…<code>rounds</code>, beginning at 1. After a normal round: while <code>cwnd &lt; ssthresh</code> it doubles (never above <code>ssthresh</code>) — slow start; afterwards it grows by 1 — congestion avoidance. If the round number is in <code>timeouts</code>: <code>ssthresh = max(2, floor(cwnd / 2))</code> and <code>cwnd = 1</code>.</p>',
  vi: '<p>Viết <code>cwndTrace(ssthresh, rounds, timeouts)</code> trả cửa sổ tắc nghẽn (đơn vị MSS) ở <i>đầu</i> mỗi vòng 1…<code>rounds</code>, bắt đầu từ 1. Sau vòng bình thường: khi <code>cwnd &lt; ssthresh</code> thì nhân đôi (không vượt <code>ssthresh</code>) — slow start; sau đó tăng 1 — tránh tắc nghẽn. Nếu số vòng nằm trong <code>timeouts</code>: <code>ssthresh = max(2, floor(cwnd / 2))</code> và <code>cwnd = 1</code>.</p>',
  fn: 'cwndTrace', params: 'ssthresh, rounds, timeouts', ref: S.cwndTrace,
  cases: [[8, 8, [5]], [16, 10, []], [4, 8, []], [64, 12, [4, 8]], [2, 5, []], [8, 0, []], [32, 9, [6]]],
  goiY: ['Decide the next cwnd after recording the current one.', 'The timeout round itself already ran at the old cwnd.'],
  loi: ['Doubling beyond ssthresh.', 'Setting ssthresh from the new cwnd instead of the old one.'],
  gt: ['This is the saw-tooth of TCP Tahoe: exponential growth, then linear, then collapse on loss.', 'Đây là răng cưa của TCP Tahoe: tăng theo cấp số nhân, rồi tuyến tính, rồi sụp khi mất gói.'],
  kn: ['congestion control'],
});

void mcNum;
export default doiDau({ slug: 'nwc204-13-1-tcp-transport', ten: '13.1 Transport: ports, TCP handshake, windows', khoa: KHOA, baiHoc: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', de: [E1, E2, E3, E4, E5, E6, E7] });
