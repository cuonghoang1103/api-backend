/**
 * Networking for Developers · Chương 11 (công cụ và phương pháp chẩn đoán) — bộ luyện chương, gắn bài Lab 11 (netdev-11-5-lab-chan-doan).
 * Dữ liệu thật: lab/out/c113-path (mtr --report thật, ping, iperf3), bài 11.4b (thông điệp lỗi Node.js đo thật: ENOTFOUND, ECONNREFUSED,
 * ETIMEDOUT, ECONNRESET, socket hang up, EADDRINUSE). Ca ẩn của mtrVerdict là báo cáo mtr DỰNG theo đúng cột của mtr.
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, sauLenh, pre, cs, tinh, ord, bang1, mt, q } from './_net.mjs';

const MTR = sauLenh('c113-path', 'mtr --report --report-cycles 3 --no-dns 10.10.2.20');
if (MTR.length !== 4 || !/Loss%/.test(MTR[1])) throw new Error('Ch11: output thật đổi — xem lại đề');
const dong = (n, host, loss, avg) => `  ${n}.|-- ${host.padEnd(26)} ${loss.toFixed(1).padStart(5)}%    10   ${avg.toFixed(1).padStart(5)}  ${avg.toFixed(1).padStart(5)}  ${avg.toFixed(1).padStart(5)}  ${avg.toFixed(1).padStart(5)}   0.4`;
const HEAD = 'HOST: laptop                      Loss%   Snt   Last   Avg  Best  Wrst StDev';
const RATE = [HEAD, dong(1, '192.168.1.1', 0, 1.2), dong(2, '100.64.0.1', 0, 8.5), dong(3, '203.0.113.9', 60, 12.0), dong(4, '198.51.100.1', 0, 14.1), dong(5, '93.184.216.34', 0, 15.3)].join('\n');
const REAL = [HEAD, dong(1, '192.168.1.1', 0, 1.1), dong(2, '100.64.0.1', 0, 9.0), dong(3, '203.0.113.9', 20, 48.0), dong(4, '198.51.100.1', 20, 52.2), dong(5, '93.184.216.34', 30, 55.8)].join('\n');
const BOTH = [HEAD, dong(1, '192.168.1.1', 0, 1.0), dong(2, '100.64.0.1', 40, 7.9), dong(3, '203.0.113.9', 0, 11.0), dong(4, '198.51.100.1', 10, 30.4), dong(5, '93.184.216.34', 10, 31.0)].join('\n');

function mtrVerdict(report) {
  var hops = [];
  String(report).split('\n').forEach(function (l) {
    var m = /^\s*(\d+)\.\|--\s+(\S+)\s+([\d.]+)%\s+\d+\s+[\d.]+\s+([\d.]+)/.exec(l);
    if (m) hops.push({ n: Number(m[1]), host: m[2], loss: Number(m[3]), avg: Number(m[4]) });
  });
  if (!hops.length) return { destLoss: null, lossStartsAt: null, ignored: [] };
  var last = hops[hops.length - 1], start = null;
  if (last.loss > 0) {
    start = last.n;
    for (var i = hops.length - 1; i >= 0 && hops[i].loss > 0; i--) start = hops[i].n; // loss that continues all the way to the end
  }
  var ignored = hops.filter(function (h) { return h.loss > 0 && (start === null || h.n < start); }).map(function (h) { return h.n; });
  return { destLoss: last.loss, lossStartsAt: start, ignored: ignored };
}
const E1 = jsBai({
  ten: 'Diag 1 — Write mtrVerdict(report): real loss or a busy router?', kho: 'HARD', phut: 25,
  en: `<p>A real <code>mtr --report</code> from the Lab 11 client:</p>${pre(MTR)}<p>Lesson 11.3's rule: <b>loss that starts at a hop and continues downstream is a real problem there; loss at one hop that does not propagate is that router de-prioritising ICMP replies</b> — not a user-facing issue. Write <code>mtrVerdict(report)</code>: parse each hop line (<code>N.|-- host  Loss%  Snt  Last  Avg …</code>) and return:</p>
<ul>
<li><code>destLoss</code> — the loss % of the LAST hop (the destination), or <code>null</code> if there are no hop lines;</li>
<li><code>lossStartsAt</code> — when destLoss &gt; 0: the number of the first hop of the unbroken run of lossy hops that reaches the end; otherwise <code>null</code>;</li>
<li><code>ignored</code> — hop numbers that show loss but are NOT part of that run (ICMP de-prioritisation), ascending.</li>
</ul>`,
  vi: `<p>Một bản <code>mtr --report</code> thật từ máy client của Lab 11:</p>${pre(MTR)}<p>Quy tắc của bài 11.3: <b>mất gói bắt đầu ở một hop và kéo dài xuống các hop sau là vấn đề thật ở đó; mất gói ở một hop mà không lan xuống là router đó hạ ưu tiên việc trả lời ICMP</b> — không ảnh hưởng người dùng. Viết <code>mtrVerdict(report)</code>: đọc từng dòng hop (<code>N.|-- host  Loss%  Snt  Last  Avg …</code>) và trả về:</p>
<ul>
<li><code>destLoss</code> — % mất của hop CUỐI (đích), hoặc <code>null</code> nếu không có dòng hop nào;</li>
<li><code>lossStartsAt</code> — khi destLoss &gt; 0: số của hop đầu tiên trong dãy hop mất gói liền mạch chạy tới cuối; ngược lại <code>null</code>;</li>
<li><code>ignored</code> — số các hop có mất gói nhưng KHÔNG thuộc dãy đó (hạ ưu tiên ICMP), tăng dần.</li>
</ul>`,
  dau: 'function mtrVerdict(report) {\n  return { destLoss: null, lossStartsAt: null, ignored: [] };\n}\n',
  giai: nguon(mtrVerdict),
  cases: [
    { goi: goi('mtrVerdict', MTR.join('\n')), moTa: ['Case 1: the real Lab 11 path', 'Ca 1: đường đi thật của Lab 11'] },
    { goi: goi('mtrVerdict', RATE), moTa: ['Case 2: 60% at hop 3 only', 'Ca 2: 60% chỉ ở hop 3'] },
    { goi: goi('mtrVerdict', REAL), an: true },
    { goi: goi('mtrVerdict', BOTH), an: true },
    { goi: goi('mtrVerdict', 'Start: 2026-11-04T16:10:39+0700\n'), an: true },
  ],
  goiY: [['One regex per hop line: number, host, loss, sent, last, avg.', 'Một regex cho mỗi dòng hop: số, host, mất, đã gửi, last, avg.'], ['Walk backwards from the last hop while loss > 0 to find where the run starts.', 'Đi ngược từ hop cuối khi loss > 0 để tìm chỗ dãy bắt đầu.']],
  loi: [['Opening a ticket with the ISP because one middle hop shows 60% loss while the destination shows 0%.', 'Mở ticket với ISP vì một hop giữa báo mất 60% trong khi đích báo 0%.'], ['Blaming the first lossy hop even when the loss stops after it.', 'Đổ cho hop mất gói đầu tiên dù sau đó không còn mất nữa.']],
  gt: ['Routers forward your packets in hardware but answer mtr\'s probes in software, at low priority. Only loss that the destination also sees affects users; where an unbroken lossy run begins is the hop to report — with the mtr report attached as evidence.', 'Router chuyển gói của bạn bằng phần cứng nhưng trả lời gói thăm dò của mtr bằng phần mềm, với ưu tiên thấp. Chỉ mất gói mà chính đích cũng thấy mới ảnh hưởng người dùng; nơi dãy mất gói liền mạch bắt đầu là hop cần báo — đính kèm bản mtr làm bằng chứng.'],
  kn: ['mtr', 'packet loss'],
});

function errorLayer(line) {
  var l = String(line);
  if (/EAI_AGAIN/.test(l)) return { layer: 'dns', meaning: 'the resolver could not be asked' };
  if (/ENOTFOUND|UnknownHostException/.test(l)) return { layer: 'dns', meaning: 'no such name' };
  if (/ECONNREFUSED|Connection refused/.test(l)) return { layer: 'port', meaning: 'nothing listening' };
  if (/ETIMEDOUT|Connect timed out|UND_ERR_CONNECT_TIMEOUT/.test(l)) return { layer: 'path', meaning: 'no answer to the SYN' };
  if (/ECONNRESET|socket hang up|Connection reset/.test(l)) return { layer: 'connection', meaning: 'the peer reset or closed' };
  if (/EADDRINUSE/.test(l)) return { layer: 'local', meaning: 'the port is already taken' };
  if (/Read timed out/.test(l)) return { layer: 'application', meaning: 'connected, the answer was too slow' };
  return { layer: 'unknown', meaning: 'read the whole error' };
}
const NODE_LOI = ['Error: getaddrinfo ENOTFOUND khong-co-that.invalid (code ENOTFOUND) sau 0.14 s', 'Error: connect ECONNREFUSED 127.0.0.1:41999 (code ECONNREFUSED) sau 0.01 s', 'Error: connect ETIMEDOUT 10.99.0.2:41000 (code ETIMEDOUT) sau 7.20 s', 'Error: read ECONNRESET (code ECONNRESET) sau 0.01 s', 'Error: socket hang up (code ECONNRESET) sau 0.01 s', 'Error: listen EADDRINUSE: address already in use :::41080'];
const E2 = jsBai({
  ten: 'Diag 2 — Write errorLayer(line): a log line names a layer', kho: 'MEDIUM', phut: 15,
  en: `<p>Lesson 11.4b caused every common error on purpose; these are lines Node.js 22 really printed there:</p>${pre(NODE_LOI)}<p>Write <code>errorLayer(line)</code> returning <code>{ layer, meaning }</code>, testing in this order:</p>
<ol>
<li><code>EAI_AGAIN</code> ⇒ dns / "the resolver could not be asked"; <code>ENOTFOUND</code> or <code>UnknownHostException</code> ⇒ dns / "no such name"</li>
<li><code>ECONNREFUSED</code> or <code>Connection refused</code> ⇒ port / "nothing listening"</li>
<li><code>ETIMEDOUT</code>, <code>Connect timed out</code> or <code>UND_ERR_CONNECT_TIMEOUT</code> ⇒ path / "no answer to the SYN"</li>
<li><code>ECONNRESET</code>, <code>socket hang up</code> or <code>Connection reset</code> ⇒ connection / "the peer reset or closed"</li>
<li><code>EADDRINUSE</code> ⇒ local / "the port is already taken"</li>
<li><code>Read timed out</code> ⇒ application / "connected, the answer was too slow"</li>
<li>otherwise unknown / "read the whole error"</li>
</ol>`,
  vi: `<p>Bài 11.4b cố tình gây ra mọi lỗi thường gặp; đây là các dòng Node.js 22 thật sự in ra ở đó:</p>${pre(NODE_LOI)}<p>Viết <code>errorLayer(line)</code> trả về <code>{ layer, meaning }</code>, kiểm theo đúng thứ tự:</p>
<ol>
<li><code>EAI_AGAIN</code> ⇒ dns / "the resolver could not be asked"; <code>ENOTFOUND</code> hoặc <code>UnknownHostException</code> ⇒ dns / "no such name"</li>
<li><code>ECONNREFUSED</code> hoặc <code>Connection refused</code> ⇒ port / "nothing listening"</li>
<li><code>ETIMEDOUT</code>, <code>Connect timed out</code> hoặc <code>UND_ERR_CONNECT_TIMEOUT</code> ⇒ path / "no answer to the SYN"</li>
<li><code>ECONNRESET</code>, <code>socket hang up</code> hoặc <code>Connection reset</code> ⇒ connection / "the peer reset or closed"</li>
<li><code>EADDRINUSE</code> ⇒ local / "the port is already taken"</li>
<li><code>Read timed out</code> ⇒ application / "connected, the answer was too slow"</li>
<li>còn lại unknown / "read the whole error"</li>
</ol>
<p>Chuỗi <code>meaning</code> giữ nguyên tiếng Anh như trên.</p>`,
  dau: 'function errorLayer(line) {\n  return { layer: "unknown", meaning: "read the whole error" };\n}\n',
  giai: nguon(errorLayer),
  cases: [
    { goi: goi('errorLayer', 'Error: getaddrinfo ENOTFOUND khong-co-that.invalid (code ENOTFOUND) sau 0.14 s') },
    { goi: goi('errorLayer', 'Error: connect ECONNREFUSED 127.0.0.1:41999 (code ECONNREFUSED) sau 0.01 s') },
    { goi: goi('errorLayer', 'Error: connect ETIMEDOUT 10.99.0.2:41000 (code ETIMEDOUT) sau 7.20 s') },
    { goi: goi('errorLayer', 'Error: socket hang up (code ECONNRESET) sau 0.01 s'), an: true },
    { goi: goi('errorLayer', 'Error: listen EADDRINUSE: address already in use :::41080'), an: true },
    { goi: goi('errorLayer', 'java.net.SocketTimeoutException: Read timed out'), an: true },
    { goi: goi('errorLayer', 'Error: getaddrinfo EAI_AGAIN api.internal'), an: true },
    { goi: goi('errorLayer', 'java.net.ConnectException: Connection refused'), an: true },
    { goi: goi('errorLayer', 'TypeError: fetch failed'), an: true },
  ],
  goiY: [['Test the specific codes in the given order; EAI_AGAIN before ENOTFOUND.', 'Kiểm các mã cụ thể theo đúng thứ tự; EAI_AGAIN trước ENOTFOUND.'], ['"socket hang up" carries code ECONNRESET but its text is different — match both.', '"socket hang up" mang mã ECONNRESET nhưng chữ khác — khớp cả hai.']],
  loi: [['Treating ETIMEDOUT and ECONNREFUSED as the same "cannot connect" — one is silence (firewall DROP, wrong route), the other an instant answer (nothing listening).', 'Coi ETIMEDOUT và ECONNREFUSED như nhau là "không kết nối được" — một cái là im lặng (tường lửa DROP, sai tuyến), cái kia là câu trả lời tức thì (không có gì nghe).'], ['Stopping at "fetch failed": the useful code is in the error\'s cause.', 'Dừng ở "fetch failed": mã hữu ích nằm trong cause của lỗi.']],
  gt: ['Every network error in a log is the operating system naming a layer: DNS, port, path, connection, or the application. Mapping the line to the layer tells you the one command to run next — getent hosts, ss -tlnp, nc -zv -w 3, a tcpdump for RST — instead of reading logs for an hour.', 'Mọi lỗi mạng trong log là hệ điều hành đang gọi tên một tầng: DNS, cổng, đường đi, kết nối hay ứng dụng. Ghép dòng lỗi với tầng cho bạn biết đúng một lệnh cần chạy tiếp — getent hosts, ss -tlnp, nc -zv -w 3, một lần tcpdump bắt RST — thay vì đọc log cả giờ.'],
  kn: ['error codes', 'layered diagnosis'],
});

const E3 = tinh({
  tieuDe: 'Diag 3 — The layered checklist, in order', doKho: 'EASY', phut: 6,
  moTa: mt('Lab 11 R4 walked the layers with one command each and stopped at the first failure. Put the commands in that order.', 'Lab 11 R4 đi qua từng tầng, mỗi tầng một lệnh, và dừng ở chỗ hỏng đầu tiên. Xếp các lệnh theo đúng thứ tự đó.'),
  loai: 'order',
  cauHoi: [ord('q1', ['Walk the layers, stop at the first failure', 'Đi qua các tầng, dừng ở chỗ hỏng đầu tiên'], ['getent hosts NAME — does the name resolve?', 'ip route get IP — which route and interface?', 'nc -zv IP PORT — is the port open?', 'openssl s_client -connect IP:443 — is TLS valid?', 'curl -sI URL — which HTTP status?', 'curl the app\'s health endpoint — does the application answer?'], ['Each command assumes the layers below it are proven: name, route, port, TLS, HTTP, application. The first failing step is the fix; everything below it is already known good.', 'Mỗi lệnh giả định các tầng dưới đã được chứng minh: tên, tuyến, cổng, TLS, HTTP, ứng dụng. Bước hỏng đầu tiên là chỗ cần sửa; mọi thứ dưới nó đã chắc chắn tốt.'])],
  goiY: ['Bottom up: names and routes before ports, ports before TLS.', 'The application health check comes last.'],
  loiHayGap: ['Reading application logs before checking that the port is even open.', 'Re-testing layers that were already proven.'],
  thuatNgu: [tn('layered checklist', 'bảng kiểm theo tầng')], khaiNiem: ['diagnosis method'],
});

const E4 = cs({
  ten: 'Diag 4 — Pick the tool, read the number', kho: 'MEDIUM', phut: 10,
  en: 'Lessons 11.1–11.3: capture, follow, measure.',
  vi: 'Bài 11.1–11.3: bắt gói, theo luồng, đo đạc.',
  cau: [
    q('c1', ['A server has no GUI and you need to see what arrives on port 80. Safest first step?', 'Máy chủ không có giao diện và bạn cần xem thứ gì tới cổng 80. Bước đầu an toàn nhất?'], ['tcpdump -i eth0 -n -c 200 -w /tmp/c.pcap port 80, then read the file', 'Run Wireshark on the production server', 'tcpdump with no filter until the disk fills', 'Enable debug logging in nginx for a day'], ['Filter, limit the count and write to a file, then read it offline (or in Wireshark on your laptop). Capture only on machines and networks you are responsible for.', 'Lọc, giới hạn số gói và ghi ra tệp, rồi đọc sau (hoặc mở bằng Wireshark trên laptop). Chỉ bắt gói trên máy và mạng bạn chịu trách nhiệm.']),
    q('c2', ['curl -w shows connect=0.020 s and ttfb=0.900 s. Where is the time going?', 'curl -w cho connect=0.020 s và ttfb=0.900 s. Thời gian đi đâu?'], ['The server, before its first byte', 'The DNS lookup of the name', 'The TCP handshake itself', 'Downloading the response body'], ['connect is roughly one round trip; ttfb minus connect is the server thinking (plus TLS if any). A large gap there is an application or database question, not a network one.', 'connect xấp xỉ một vòng khứ hồi; ttfb trừ connect là thời gian server suy nghĩ (cộng TLS nếu có). Khoảng lớn ở đó là câu hỏi của ứng dụng hay cơ sở dữ liệu, không phải của mạng.']),
    q('c3', ['iperf3 reports about 289 Mbit/s and ping about 22 ms. Which number does a page with 30 sequential requests suffer from?', 'iperf3 báo khoảng 289 Mbit/s và ping khoảng 22 ms. Một trang có 30 request tuần tự chịu ảnh hưởng của con số nào?'], ['The 22 ms round trip, thirty times over', 'The 289 Mbit/s of bandwidth', 'Neither: only packet loss matters', 'Both of them, equally'], ['Latency and bandwidth are different numbers. Sequential round trips multiply the RTT; the fix is fewer or closer round trips (keep-alive, HTTP/2, CDN), not a bigger pipe.', 'Độ trễ và băng thông là hai con số khác nhau. Các vòng khứ hồi tuần tự nhân RTT lên; cách sửa là ít vòng hơn hoặc gần hơn (keep-alive, HTTP/2, CDN), không phải ống to hơn.']),
    q('c4', ['In Wireshark, how do you read one request and its response as plain text?', 'Trong Wireshark, làm sao đọc một request và phản hồi của nó dạng chữ?'], ['Follow → TCP Stream (tshark -z follow,tcp,ascii,N)', 'Statistics → Protocol Hierarchy', 'Edit → Find Packet by MAC', 'Capture → Options → Promiscuous mode'], ['Following the stream reassembles every segment of one connection in order. For HTTPS you also need the session keys (SSLKEYLOGFILE), as in Chapter 6.', 'Theo luồng sẽ ráp mọi segment của một kết nối theo thứ tự. Với HTTPS bạn cần thêm khoá phiên (SSLKEYLOGFILE), như Chương 6.']),
    q('c5', ['nc -zv to port 81 returns "Connection refused" immediately. What does that prove?', 'nc -zv tới cổng 81 trả "Connection refused" ngay lập tức. Điều đó chứng minh gì?'], ['The host is reachable; nothing listens on 81', 'A firewall dropped the packet', 'DNS failed for that host', 'The route to the host is missing'], ['A refusal is an answer (a RST). A firewall that drops gives silence and a timeout instead — opposite conclusions, opposite fixes.', 'Bị từ chối là một câu trả lời (gói RST). Tường lửa bỏ gói thì cho im lặng và hết giờ — kết luận ngược nhau, cách sửa ngược nhau.']),
  ],
  goiY: [['Latency tools: ping, mtr, curl -w. Bandwidth tool: iperf3.', 'Công cụ đo trễ: ping, mtr, curl -w. Công cụ đo băng thông: iperf3.'], ['Refused = answer; timeout = silence.', 'Refused = có trả lời; timeout = im lặng.']],
  loi: [['Buying bandwidth to fix a latency problem.', 'Mua thêm băng thông để chữa vấn đề độ trễ.'], ['Running an unfiltered capture on a busy production box.', 'Bắt gói không lọc trên máy production đang bận.']],
  tns: [tn('TTFB', 'thời gian tới byte đầu'), tn('follow stream', 'theo luồng')], kn: ['diagnostic tools'],
});

export default doiDau({ slug: 'netdev-11-5-lab-chan-doan', ten: 'Lab 11 — Practice: reading mtr, error codes and the layered checklist', khoa: KHOA, baiHoc: 'netdev-11-5-lab-chan-doan', de: [E1, E2, E3, E4] });
