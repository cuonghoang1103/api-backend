/**
 * Networking for Developers · Chương 4 (TCP) — bộ luyện chương, gắn bài Lab 4 (netdev-4-6-lab-tcp-labflow).
 * Dữ liệu thật: lab/out/c41-tay (một kết nối, tcpdump -tt), c44-exhaust (cạn cổng, exit 45), lab4-r4 (treo 133 s vs 2 s),
 * c45-nodelay (Nagle × delayed ACK), lab4-r6 (ip_local_port_range). Ca ẩn của bài viết hàm là dòng DỰNG theo đúng khuôn tcpdump.
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, sauLenh, pre, c, cs, tinh, q, bang1, mt } from './_net.mjs';

const CAP = sauLenh('c41-tay', "tcpdump -nr /tmp/c41.pcap -tt 'tcp'").filter((d) => /Flags/.test(d));
const EXH = sauLenh('c44-exhaust', 'for i in 1 2 3 4; do').filter((d) => /^lần/.test(d));
const NAGLE = sauLenh('c45-nodelay', 'node nagle-cli.mjs');
const RANGE = sauLenh('lab4-r6', 'echo "[3]')[0].split(/[:\s]+/).filter((x) => /^\d+$/.test(x)).map(Number).slice(-2);
if (CAP.length !== 10 || EXH.length < 4 || NAGLE.length !== 2 || RANGE.join('-') !== '32768-60999') throw new Error('Ch4: output thật đổi — xem lại đề');
const ngan = (d) => d.replace(/, options \[[^\]]*\]/, '').replace(/^\d+\.(\d{6})/, (m) => m);

const E1 = tinh({
  tieuDe: 'TCP 1 — Label every packet of one real connection', doKho: 'MEDIUM', phut: 12,
  moTa: mt(`One <code>curl http://10.10.2.10/</code> from the Lab 4 client, captured for real (the router adds 25 ms on the way back, so one round trip is visible; TCP options trimmed for width):${pre(CAP.map(ngan))}Name the role of every packet.`, `Một lần <code>curl http://10.10.2.10/</code> từ máy client của Lab 4, bắt gói thật (router thêm 25 ms chiều về nên thấy được một vòng khứ hồi; đã cắt phần option TCP cho gọn):${pre(CAP.map(ngan))}Gọi tên vai trò của từng gói.`),
  loai: 'table',
  bang: [bang1('b1', ['Ten packets, ten roles', 'Mười gói, mười vai trò'], [{ ma: 'n', ten: '#' }, { ma: 'f', ten: 'Flags' }, { ma: 'r', ten: 'Role', luaChon: ['SYN', 'SYN-ACK', 'handshake ACK', 'HTTP request', 'ACK of the request', 'HTTP response', 'ACK of the response', 'client FIN', 'server FIN', 'final ACK'] }],
    ['[S]', '[S.]', '[.]', '[P.]', '[.]', '[P.]', '[.]', '[F.]', '[F.]', '[.]'].map((f, i) => ({ o: { n: String(i + 1), f }, a: { r: ['SYN', 'SYN-ACK', 'handshake ACK', 'HTTP request', 'ACK of the request', 'HTTP response', 'ACK of the response', 'client FIN', 'server FIN', 'final ACK'][i] } })),
    ['Packets 1–3 are the three-way handshake (SYN, SYN-ACK 25 ms later — that gap is one round trip — then ACK). 4 carries the 74-byte GET, 5 acknowledges it, 6 carries the 168-byte response, 7 acknowledges that. 8–10 close: the client sends FIN first (it is the active closer, so TIME_WAIT will sit on the client), the server answers FIN, and the client sends the final ACK. Here the server\'s ACK of the client FIN is folded into its own FIN, so only three packets close instead of four.', 'Gói 1–3 là bắt tay ba bước (SYN, SYN-ACK 25 ms sau — khoảng đó là một vòng khứ hồi — rồi ACK). Gói 4 mang lệnh GET 74 byte, 5 xác nhận nó, 6 mang phản hồi 168 byte, 7 xác nhận phản hồi. 8–10 là đóng: client gửi FIN trước (nó là bên chủ động đóng, nên TIME_WAIT sẽ nằm ở client), server đáp FIN, client gửi ACK cuối. Ở đây ACK của server cho FIN của client được gộp luôn vào FIN của server, nên chỉ có ba gói đóng thay vì bốn.'])],
  goiY: ['[S] = SYN, [S.] = SYN + ACK, [P.] = data pushed with an ACK, [F.] = FIN with an ACK, [.] = a bare ACK.', 'Look at "length": a bare ACK has length 0; the request is 74 bytes and the response 168.'],
  loiHayGap: ['Calling packet 5 the response — it has length 0; it only acknowledges the GET.', 'Assuming the server always closes first; in this capture the client sends the first FIN.'],
  thuatNgu: [tn('three-way handshake', 'bắt tay ba bước'), tn('active closer', 'bên chủ động đóng')], khaiNiem: ['TCP handshake', 'teardown'],
});

function tcpSummary(text, client) {
  var lines = String(text).split('\n').filter(function (l) { return / Flags \[/.test(l); });
  var tSyn = null, tSynAck = null, req = 0, resp = 0, closedBy = null;
  lines.forEach(function (l) {
    var m = /^(\d+\.\d+) IP (\S+) > (\S+): Flags \[([^\]]*)\].*length (\d+)/.exec(l);
    if (!m) return;
    var t = Number(m[1]), src = m[2], flags = m[4], len = Number(m[5]);
    var fromClient = src.lastIndexOf('.') > 0 && src.slice(0, src.lastIndexOf('.')) === client;
    if (flags === 'S' && fromClient && tSyn === null) tSyn = t;
    if (flags === 'S.' && !fromClient && tSynAck === null) tSynAck = t;
    if (fromClient) req += len; else resp += len;
    if (flags.indexOf('F') >= 0 && closedBy === null) closedBy = fromClient ? 'client' : 'server';
  });
  return {
    packets: lines.length,
    rttMs: tSyn !== null && tSynAck !== null ? Math.round((tSynAck - tSyn) * 10000) / 10 : null, // SYN → SYN-ACK, 0.1 ms
    requestBytes: req,
    responseBytes: resp,
    closedBy: closedBy,
  };
}
const L = (t, a, b, f, len) => `${t} IP ${a} > ${b}: Flags [${f}], seq 1, ack 1, win 64, length ${len}`;
const HIDDEN1 = [L('100.000000', '192.168.5.20.51000', '93.184.216.34.443', 'S', 0), L('100.081250', '93.184.216.34.443', '192.168.5.20.51000', 'S.', 0), L('100.081300', '192.168.5.20.51000', '93.184.216.34.443', '.', 0), L('100.081400', '192.168.5.20.51000', '93.184.216.34.443', 'P.', 517), L('100.170000', '93.184.216.34.443', '192.168.5.20.51000', 'P.', 4096), L('105.170000', '93.184.216.34.443', '192.168.5.20.51000', 'F.', 0), L('105.170100', '192.168.5.20.51000', '93.184.216.34.443', 'F.', 0), L('105.250000', '93.184.216.34.443', '192.168.5.20.51000', '.', 0)].join('\n');
const HIDDEN2 = [L('7.500000', '10.0.0.5.40000', '10.0.0.9.5432', 'S', 0), L('8.500000', '10.0.0.5.40000', '10.0.0.9.5432', 'S', 0), L('8.502000', '10.0.0.9.5432', '10.0.0.5.40000', 'S.', 0), L('8.502100', '10.0.0.5.40000', '10.0.0.9.5432', '.', 0)].join('\n');

const E2 = jsBai({
  ten: 'TCP 2 — Write tcpSummary(text, client): read a capture like an engineer', kho: 'HARD', phut: 30,
  en: `<p>Write <code>tcpSummary(text, client)</code> for the output of <code>tcpdump -tt -nr file.pcap</code> (one line per packet, timestamp in seconds first). <code>client</code> is the client's IP. Return:</p>
<ul>
<li><code>packets</code> — the number of lines containing <code>Flags [</code>.</li>
<li><code>rttMs</code> — time from the client's FIRST <code>[S]</code> to the server's first <code>[S.]</code>, in milliseconds rounded to 0.1 (<code>null</code> if either is missing). That gap is one round trip.</li>
<li><code>requestBytes</code> / <code>responseBytes</code> — the sum of <code>length N</code> over packets sent by the client / by the other side.</li>
<li><code>closedBy</code> — <code>"client"</code> or <code>"server"</code>: who sent the first packet whose flags contain <code>F</code>; <code>null</code> if nobody closed.</li>
</ul>
<p>An address in tcpdump is <code>ip.port</code> — the IP is everything before the LAST dot. The first sample is the real capture of Exercise 1.</p>`,
  vi: `<p>Viết <code>tcpSummary(text, client)</code> cho kết xuất của <code>tcpdump -tt -nr file.pcap</code> (mỗi gói một dòng, đầu dòng là mốc thời gian tính bằng giây). <code>client</code> là IP của client. Trả về:</p>
<ul>
<li><code>packets</code> — số dòng có chữ <code>Flags [</code>.</li>
<li><code>rttMs</code> — thời gian từ <code>[S]</code> ĐẦU TIÊN của client tới <code>[S.]</code> đầu tiên của server, tính bằng mili giây, làm tròn 0,1 (<code>null</code> nếu thiếu một trong hai). Khoảng đó là một vòng khứ hồi.</li>
<li><code>requestBytes</code> / <code>responseBytes</code> — tổng <code>length N</code> của các gói do client gửi / do bên kia gửi.</li>
<li><code>closedBy</code> — <code>"client"</code> hoặc <code>"server"</code>: ai gửi gói ĐẦU TIÊN có cờ chứa <code>F</code>; <code>null</code> nếu không ai đóng.</li>
</ul>
<p>Địa chỉ trong tcpdump có dạng <code>ip.port</code> — IP là mọi thứ đứng trước dấu chấm CUỐI CÙNG. Ca mẫu đầu là bản bắt gói thật của Bài 1.</p>`,
  dau: 'function tcpSummary(text, client) {\n  // parse each "... IP a.b.c.d.port > e.f.g.h.port: Flags [..], ... length N" line\n  return { packets: 0, rttMs: null, requestBytes: 0, responseBytes: 0, closedBy: null };\n}\n',
  giai: nguon(tcpSummary),
  cases: [
    { goi: goi('tcpSummary', CAP.join('\n'), '10.10.1.10') },
    { goi: goi('tcpSummary', CAP.slice(0, 3).join('\n'), '10.10.1.10') },
    { goi: goi('tcpSummary', HIDDEN1, '192.168.5.20'), an: true },
    { goi: goi('tcpSummary', HIDDEN2, '10.0.0.5'), an: true },
    { goi: goi('tcpSummary', CAP.join('\n'), '10.10.2.10'), an: true },
    { goi: goi('tcpSummary', '', '10.10.1.10'), an: true },
  ],
  goiY: [['One regular expression per line: timestamp, source, destination, flags, length.', 'Một biểu thức chính quy cho mỗi dòng: mốc thời gian, nguồn, đích, cờ, độ dài.'], ['src.slice(0, src.lastIndexOf(".")) is the IP; compare it with client.', 'src.slice(0, src.lastIndexOf(".")) là IP; so nó với client.'], ['Round to 0.1 ms with Math.round(seconds * 10000) / 10.', 'Làm tròn 0,1 ms bằng Math.round(giây * 10000) / 10.']],
  loi: [['Taking the second SYN in a retransmitted handshake: the RTT runs from the FIRST SYN, so a lost SYN shows up as one extra second.', 'Lấy SYN thứ hai khi bắt tay bị gửi lại: RTT tính từ SYN ĐẦU TIÊN, nên SYN bị mất lộ ra thành thêm đúng một giây.'], ['Splitting the address on the first dot and comparing only "10".', 'Tách địa chỉ ở dấu chấm đầu tiên và chỉ so được "10".']],
  gt: ['The SYN → SYN-ACK gap is the cleanest RTT measurement you will ever get, because the server answers it in the kernel without touching your application. Byte counts per direction and who closed first are the next two questions of every capture review: the first shows whether the payload is what you expect, the second tells you where TIME_WAIT will pile up.', 'Khoảng SYN → SYN-ACK là phép đo RTT sạch nhất bạn có, vì server trả lời nó ngay trong nhân mà không đụng tới ứng dụng. Số byte mỗi chiều và ai đóng trước là hai câu hỏi tiếp theo của mọi lần đọc bản bắt gói: câu đầu cho biết nội dung có đúng như mong đợi, câu sau cho biết TIME_WAIT sẽ dồn về đâu.'],
  kn: ['tcpdump', 'RTT', 'active close'],
});

function portBudget(range, timeWaitSec, rate) {
  var ports = range[1] - range[0] + 1;
  var maxRate = Math.floor(ports / timeWaitSec * 10) / 10; // new connections per second to ONE destination ip:port
  return { ports: ports, maxRate: maxRate, exhausted: rate > maxRate, secondsUntilExhausted: rate > maxRate ? Math.floor(ports / rate) : null };
}
const E3 = jsBai({
  ten: 'TCP 3 — Write portBudget(range, timeWaitSec, rate): when does the batch job die?', kho: 'MEDIUM', phut: 15,
  en: `<p>Lesson 4.4's batch job opens a NEW connection per request to the same <code>ip:port</code>. Each closed connection keeps its source port in TIME_WAIT on the active closer (the client) — about 60 s on Linux — so only so many new connections per second can exist before <code>cannot assign requested address</code>. The Lab 4 checker printed the real range: ${c(RANGE.join(' '))}.</p>
<p>Write <code>portBudget(range, timeWaitSec, rate)</code>: <code>ports</code> = size of the inclusive range; <code>maxRate</code> = ports / timeWaitSec, rounded DOWN to 0.1; <code>exhausted</code> = rate &gt; maxRate; <code>secondsUntilExhausted</code> = floor(ports / rate) when exhausted, else <code>null</code> (a simplified model: every port taken once before the first one frees).</p>`,
  vi: `<p>Job chạy lô ở bài 4.4 mở một kết nối MỚI cho mỗi request tới cùng một <code>ip:port</code>. Mỗi kết nối đã đóng giữ cổng nguồn của nó ở TIME_WAIT phía bên chủ động đóng (client) — khoảng 60 giây trên Linux — nên mỗi giây chỉ có được chừng ấy kết nối mới trước khi gặp <code>cannot assign requested address</code>. Bộ kiểm của Lab 4 in ra dải thật: ${c(RANGE.join(' '))}.</p>
<p>Viết <code>portBudget(range, timeWaitSec, rate)</code>: <code>ports</code> = kích thước dải (tính cả hai đầu); <code>maxRate</code> = ports / timeWaitSec, làm tròn XUỐNG 0,1; <code>exhausted</code> = rate &gt; maxRate; <code>secondsUntilExhausted</code> = floor(ports / rate) khi cạn, ngược lại <code>null</code> (mô hình giản lược: mọi cổng bị dùng một lần trước khi cổng đầu tiên được nhả).</p>`,
  dau: 'function portBudget(range, timeWaitSec, rate) {\n  return { ports: 0, maxRate: 0, exhausted: false, secondsUntilExhausted: null };\n}\n',
  giai: nguon(portBudget),
  cases: [
    { goi: goi('portBudget', RANGE, 60, 300) },
    { goi: goi('portBudget', RANGE, 60, 1000) },
    { goi: goi('portBudget', [50010, 50012], 60, 1), an: true },
    { goi: goi('portBudget', [1024, 65535], 60, 1000), an: true },
    { goi: goi('portBudget', RANGE, 30, 900), an: true },
  ],
  goiY: [['Inclusive range: last − first + 1.', 'Dải tính cả hai đầu: cuối − đầu + 1.'], ['Round down to one decimal with Math.floor(x * 10) / 10.', 'Làm tròn xuống một chữ số thập phân bằng Math.floor(x * 10) / 10.']],
  loi: [['Forgetting the +1, so the Lab 4 forced range of three ports looks like two.', 'Quên +1, nên dải ép ba cổng của Lab 4 trông như chỉ có hai.'], ['Concluding "raise the range" is the fix — the real fix is a keep-alive pool so no new connection is needed.', 'Kết luận cách sửa là "nới dải cổng" — cách sửa thật là pool keep-alive để khỏi cần kết nối mới.']],
  gt: ['28,232 ports over 60 s is about 470 new connections per second to one destination — a number a busy batch job crosses easily. The arithmetic explains both symptoms of the lab: the failure (exit 45 on the fourth request with three ports) and the "recovers by itself minutes later" (ports leave TIME_WAIT). A pool removes the churn instead of moving the wall.', '28.232 cổng chia 60 giây là khoảng 470 kết nối mới mỗi giây tới một đích — con số mà một job chạy lô bận rộn vượt dễ dàng. Phép tính giải thích cả hai triệu chứng của lab: lỗi (exit 45 ở request thứ tư khi chỉ có ba cổng) và "vài phút sau tự hết" (cổng ra khỏi TIME_WAIT). Pool xoá sự xoay vòng đó thay vì dời bức tường đi chỗ khác.'],
  kn: ['TIME_WAIT', 'ephemeral ports'],
});

const E4 = cs({
  ten: 'TCP 4 — The Lab 4 incidents, read from real numbers', kho: 'HARD', phut: 12,
  en: `Real outputs from Lab 4: ${pre(EXH)} the hang test printed 133 s without a timeout and 2 s with <code>--connect-timeout 2</code>; and ${pre(NAGLE)}`,
  vi: `Kết xuất thật của Lab 4: ${pre(EXH)} bài thử treo in 133 giây khi không đặt timeout và 2 giây khi có <code>--connect-timeout 2</code>; và ${pre(NAGLE)}`,
  cau: [
    q('c1', ['Why did the fourth request fail with exit 45 when the job forced source ports 50010–50012?', 'Vì sao request thứ tư hỏng với exit 45 khi job ép cổng nguồn 50010–50012?'], ['All three ports were still in TIME_WAIT on the client, which closed first', 'The server refused a fourth connection from the same IP', 'nginx limits each client to three connections', 'The router dropped the fourth SYN'], ['curl exit 45 is a local bind failure: no source port was free. The client was the active closer, so TIME_WAIT — and the locked ports — sit on the client for about a minute.', 'curl exit 45 là lỗi bind phía máy mình: không còn cổng nguồn nào trống. Client là bên chủ động đóng, nên TIME_WAIT — và các cổng bị khoá — nằm ở client khoảng một phút.']),
    q('c2', ['A dependency drops SYNs. Why did the request hang for 133 s with no timeout?', 'Một dịch vụ phụ thuộc bỏ mọi SYN. Vì sao request treo 133 giây khi không có timeout?'], ['The kernel kept resending the SYN, backing off each time', 'curl was waiting for the HTTP response body', 'DNS resolution kept retrying in the background', 'The server sent a RST after two minutes'], ['No SYN-ACK ever arrives, so the kernel retries the SYN with doubling gaps (tcp_syn_retries) — about two minutes in total. A connect timeout of 2–3 s turns that into a fast, clear failure.', 'Không SYN-ACK nào về, nên nhân gửi lại SYN với khoảng cách gấp đôi dần (tcp_syn_retries) — tổng cộng khoảng hai phút. Một connect timeout 2–3 giây biến nó thành lỗi nhanh và rõ ràng.']),
    q('c3', ['Why is the fix for that hang a CONNECT timeout rather than a read timeout?', 'Vì sao cách sửa cho lần treo đó là CONNECT timeout chứ không phải read timeout?'], ['The failure is in the handshake: no connection ever exists, so there is nothing to read from', 'Read timeouts are not supported by curl', 'A read timeout would retry the request twice', 'Connect timeouts also cover DNS failures, which caused the hang'], ['A read timeout starts counting once the connection is up and a response is awaited. Here the SYN is never answered, so only a connect timeout bounds the wait.', 'Read timeout chỉ bắt đầu đếm khi kết nối đã lên và đang chờ phản hồi. Ở đây SYN không bao giờ được trả lời, nên chỉ connect timeout mới chặn được thời gian chờ.']),
    q('c4', ['The RPC costs about 57 ms per transaction with Nagle on and about 30 ms with TCP_NODELAY on a 25 ms path. What caused the difference?', 'RPC tốn khoảng 57 ms mỗi giao dịch khi bật Nagle và khoảng 30 ms khi có TCP_NODELAY trên đường trễ 25 ms. Điều gì gây ra chênh lệch?'], ['Nagle waits for an ACK the receiver deliberately delays', 'TCP_NODELAY doubles the bandwidth of the link', 'Nagle compresses the payload, which costs CPU time', 'With TCP_NODELAY the handshake is skipped'], ['Write-write-read: the second write waits for an ACK, and the receiver\'s delayed-ACK timer holds that ACK hoping to piggyback it. Fix: TCP_NODELAY on the socket, or send header and body in one write.', 'Ghi-ghi-đọc: lần ghi thứ hai chờ một ACK, còn bộ hẹn giờ delayed-ACK bên nhận giữ ACK đó lại để gửi kèm. Sửa: TCP_NODELAY trên socket, hoặc gửi header và body trong một lần ghi.']),
    q('c5', ['A rare ECONNRESET (1 in 1,000) appears after the API moves behind a load balancer. Which mismatch is the classic cause?', 'Sau khi API chuyển ra sau load balancer, thỉnh thoảng (1/1.000) có ECONNRESET. Sự lệch nào là nguyên nhân kinh điển?'], ['Idle timeouts: the server closes before the balancer does', 'The balancer uses round robin, not least connections', 'TCP keepalive probes are sent only every two hours', 'The client pool has maxSockets set much too high'], ['An idle keep-alive race: one side closes an idle connection at the moment the other reuses it. Make the server-side idle timeout longer than whatever sits in front of it, and retry idempotent requests once.', 'Một cuộc đua keep-alive nhàn rỗi: một bên đóng kết nối nhàn rỗi đúng lúc bên kia dùng lại nó. Đặt idle timeout phía server dài hơn thứ đứng trước nó, và thử lại một lần với request idempotent.']),
  ],
  goiY: [['Every incident names a TCP state or timer: TIME_WAIT, SYN retries, delayed ACK, idle timeout.', 'Mỗi sự cố gọi tên một trạng thái hay bộ hẹn giờ của TCP: TIME_WAIT, gửi lại SYN, delayed ACK, idle timeout.'], ['Ask which side closed first and which packet was never answered.', 'Hỏi bên nào đóng trước và gói nào không bao giờ được trả lời.']],
  loi: [['Blaming the server for exit 45 — the failure is a local bind on the client.', 'Đổ lỗi cho server về exit 45 — lỗi là bind cục bộ ở client.'], ['Adding a read timeout to fix a dead dependency.', 'Thêm read timeout để sửa một phụ thuộc đã chết.']],
  tns: [tn('connect timeout', 'thời gian chờ kết nối'), tn('delayed ACK', 'ACK trì hoãn'), tn('Nagle\'s algorithm', 'thuật toán Nagle')], kn: ['TCP incidents'],
});

export default doiDau({ slug: 'netdev-4-6-lab-tcp-labflow', ten: 'Lab 4 — Practice: reading and fixing TCP', khoa: KHOA, baiHoc: 'netdev-4-6-lab-tcp-labflow', de: [E1, E2, E3, E4] });
