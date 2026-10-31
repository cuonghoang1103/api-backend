/** Networking for Developers · 0.2 — Hành trình của một URL: bảy chặng, ai làm, curl -w cộng dồn, mô hình TTFB, keep-alive. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, sauLenh, pre, soNhan } from './_net.mjs';

const W3 = sauLenh('c00-internet', 'for i in 1 2 3');                       // 3 lượt cuongthai.com
const W2 = sauLenh('c00-internet', 'curl -s -o /dev/null -o /dev/null');    // 2 URL, kết nối dùng lại
const WEX = sauLenh('c00-internet', 'curl -s -o /dev/null -w \'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total} ip=')[0];
const WLAB = sauLenh('c00-url-lab', 'for i in 1 2 3');
if (W3.length !== 3 || W2.length !== 2 || !WEX || WLAB.length !== 3) throw new Error('c00: thiếu dòng curl -w');

/* ── 1. Bảy chặng ── */
const E1 = cs({
  ten: 'URL 1 — The seven stages of one page load', kho: 'EASY', phut: 5, loai: 'order',
  en: 'You type https://cuongthai.com/ and press Enter. Put the stages in the order they happen.',
  vi: 'Bạn gõ https://cuongthai.com/ rồi bấm Enter. Sắp các chặng theo thứ tự xảy ra.',
  cau: [ord('o1', ['One page load', 'Một lần tải trang'], [
    'Parse the URL: scheme https (port 443), host, path',
    'DNS: find the IP address of cuongthai.com',
    'TCP: SYN, SYN-ACK, ACK — open a connection',
    'TLS: agree on keys and check the certificate',
    'Send the HTTP request: GET / with Host: cuongthai.com',
    'Server work: nginx passes it to the app, maybe a database',
    'Download the HTML, then fetch the files it lists and render',
  ], ['You need the host before asking DNS, the address before TCP, a connection before TLS, encryption before sending the request over HTTPS, and the request before the server can work. The HTML then triggers more requests — often on the same connection.', 'Cần tên máy trước khi hỏi DNS, địa chỉ trước TCP, kết nối trước TLS, mã hoá trước khi gửi request qua HTTPS, và request trước khi server làm việc. HTML sau đó kéo theo nhiều request nữa — thường trên cùng kết nối.'])],
  goiY: [['Each stage needs the result of the one before it.', 'Mỗi chặng cần kết quả của chặng trước.'], ['TLS runs over a TCP connection that already exists.', 'TLS chạy trên một kết nối TCP đã có sẵn.']],
  loi: [['Putting TLS before TCP.', 'Đặt TLS trước TCP.'], ['Forgetting that DNS comes before any connection.', 'Quên rằng DNS đến trước mọi kết nối.']],
  tns: [tn('scheme', 'giao thức trong URL', 'https, http… — quyết định cổng mặc định 443/80.'), tn('handshake', 'bắt tay'), tn('render', 'hiển thị trang')],
  kn: ['what happens when you type a URL'],
});

/* ── 2. Ai làm, ở đâu ── */
const MAY = ['your laptop', 'laptop → resolver', 'laptop ⇄ server', 'the server and its database'];
const CHO = ['an ordinary program (browser or curl) on a CPU core', 'an OS cache first, then a question over the network', 'the kernels of both machines, via the network chip', 'a crypto library inside the application, plus one round trip', 'nginx and app processes; RAM and disk of the database', 'the browser\'s layout and JavaScript engines'];
const E2 = cs({
  ten: 'URL 2 — Which machine does each stage, and where inside it?', kho: 'EASY', phut: 8, loai: 'table',
  en: 'When a request is slow or broken, the first question is always: which stage, on which machine? Fill in the table from the lesson.',
  vi: 'Khi request chậm hay hỏng, câu hỏi đầu tiên luôn là: chặng nào, trên máy nào? Điền bảng theo bài học.',
  bang: [bang1('b1', ['Who does what', 'Ai làm gì'], [{ ma: 'x', ten: 'Stage' }, { ma: 'm', ten: 'Which machine', luaChon: MAY }, { ma: 'w', ten: 'Where inside it', luaChon: CHO }], [
    { o: { x: 'Parse the URL, build the HTTP request' }, a: { m: MAY[0], w: CHO[0] } },
    { o: { x: 'DNS' }, a: { m: MAY[1], w: CHO[1] } },
    { o: { x: 'TCP handshake' }, a: { m: MAY[2], w: CHO[2] } },
    { o: { x: 'TLS handshake' }, a: { m: MAY[2], w: CHO[3] } },
    { o: { x: 'Server work' }, a: { m: MAY[3], w: CHO[4] } },
    { o: { x: 'Render the page' }, a: { m: MAY[0], w: CHO[5] } },
  ], ['TCP lives in the kernel of both machines — your program only asks for a connection. TLS, by contrast, is a library inside the application (OpenSSL in curl, BoringSSL in Chrome): pure CPU work plus one round trip. That is why "TLS in the kernel" is the tempting wrong answer.', 'TCP nằm trong kernel của cả hai máy — chương trình chỉ xin một kết nối. TLS thì ngược lại, là thư viện bên trong ứng dụng (OpenSSL trong curl, BoringSSL trong Chrome): thuần CPU cộng một vòng đi-về. Vì thế "TLS trong kernel" là đáp án sai dễ chọn.'])],
  goiY: [['Two stages happen only on your laptop; one only on the server side.', 'Hai chặng chỉ xảy ra trên laptop; một chặng chỉ ở phía server.'], ['Kernel = TCP/IP; library inside the app = TLS.', 'Kernel = TCP/IP; thư viện trong ứng dụng = TLS.']],
  loi: [['Saying the router does DNS — it only forwards the question.', 'Nói router làm DNS — nó chỉ chuyển câu hỏi đi.'], ['Putting TLS in the kernel together with TCP.', 'Đặt TLS trong kernel cùng với TCP.']],
  tns: [tn('kernel', 'nhân hệ điều hành'), tn('resolver', 'máy phân giải DNS'), tn('user space', 'không gian người dùng', 'Nơi chương trình bình thường chạy, ngoài kernel.')],
  kn: ['request stages'],
});

/* ── 3. curl -v, cộng dồn, RTT, keep-alive ── */
const E3 = cs({
  ten: 'URL 3 — Reading curl, round trips and reuse', kho: 'MEDIUM', phut: 10,
  en: `Real output from the lab (lab/out/c00-internet):${pre(['$ curl -s -o /dev/null -o /dev/null -w \'url=… dns=… connect=… tls=… ttfb=… total=…\\n\' https://cuongthai.com/ https://cuongthai.com/about', ...W2])}`,
  vi: `Output thật trong lab (lab/out/c00-internet):${pre(['$ curl -s -o /dev/null -o /dev/null -w \'url=… dns=… connect=… tls=… ttfb=… total=…\\n\' https://cuongthai.com/ https://cuongthai.com/about', ...W2])}`,
  cau: [
    q('c1', ['For the second URL, dns, connect and tls are all 0. Why?', 'Với URL thứ hai, dns, connect và tls đều bằng 0. Vì sao?'], ['curl reused the connection it already had (keep-alive)', 'the second page was served from the browser\'s cache', 'curl skipped DNS because /about is on another server', 'the measurement failed and curl printed zeros instead'], ['Same host ⇒ curl keeps the connection open after the first response and sends the second request on it: no DNS, no TCP, no TLS. In code this is connection pooling.', 'Cùng máy chủ ⇒ curl giữ kết nối sau phản hồi đầu và gửi request thứ hai trên đó: không DNS, không TCP, không TLS. Trong code, đây là connection pooling.']),
    q('c2', ['A service creates a new HTTP client for every call to another HTTPS API. What does it pay each time?', 'Một dịch vụ tạo HTTP client mới cho mỗi lần gọi một API HTTPS khác. Mỗi lần nó trả giá gì?'], ['A TCP handshake and a TLS handshake on every request', 'Nothing — the operating system pools connections itself', 'Only one extra DNS lookup, because names are not cached', 'A slower download, because bandwidth is shared per client'], ['A new client has no open connection to reuse, so every call pays the setup again — at least 2 round trips before the request. Reusing one client (one pool) removes them.', 'Client mới không có kết nối mở để dùng lại, nên mỗi lần gọi lại trả chi phí dựng kết nối — ít nhất 2 vòng đi-về trước khi gửi request. Dùng lại một client (một pool) bỏ được chúng.']),
    q('c3', ['ping to cuongthai.com shows about 7–10 ms. The TCP stage of the first run took 8.7 ms. That is …', 'ping tới cuongthai.com khoảng 7–10 ms. Chặng TCP của lượt đầu mất 8,7 ms. Đó là …'], ['about one round trip: SYN out, SYN-ACK back', 'about three round trips: SYN, SYN-ACK and ACK', 'about half a round trip: only the SYN is timed', 'unrelated: TCP time depends on the page size'], ['curl counts the connection as open when the SYN-ACK arrives; the third packet (ACK) travels together with the request. So the TCP handshake costs one RTT.', 'curl coi kết nối đã mở khi SYN-ACK về; gói thứ ba (ACK) đi cùng request. Nên bắt tay TCP tốn một RTT.']),
    q('c4', ['ALPN: server accepted h2 appears inside the TLS lines of curl -v. It means …', 'ALPN: server accepted h2 xuất hiện trong các dòng TLS của curl -v. Nghĩa là …'], ['client and server agreed to speak HTTP/2 on this connection', 'the server accepted a second TCP connection from curl', 'the certificate is valid for two different host names', 'the server will compress the page with the h2 method'], ['ALPN is the part of the TLS handshake where both sides choose the HTTP version — so no extra round trip is needed to pick it.', 'ALPN là phần của bắt tay TLS nơi hai bên chọn phiên bản HTTP — nên không tốn thêm vòng đi-về để chọn.']),
    q('c5', ['Distance from Asia to the US raises the round trip to about 180 ms. Which change helps a small API call the most?', 'Khoảng cách châu Á – Mỹ đẩy vòng đi-về lên khoảng 180 ms. Thay đổi nào giúp một lệnh gọi API nhỏ nhiều nhất?'], ['Reuse connections, or serve it from a nearby CDN', 'Buy a server with a faster CPU and more RAM', 'Upgrade the user\'s plan from 100 to 300 Mbps', 'Compress the request headers with gzip first'], ['A small call is limited by round trips, not bandwidth or CPU. Fewer round trips (reuse, TLS resumption, HTTP/3) or shorter ones (a nearby CDN) are the only real fixes. Light in fibre covers about 200 km per ms.', 'Lệnh gọi nhỏ bị giới hạn bởi số vòng đi-về, không phải băng thông hay CPU. Ít vòng hơn (dùng lại kết nối, TLS resumption, HTTP/3) hoặc vòng ngắn hơn (CDN gần) mới là cách sửa thật. Ánh sáng trong cáp quang đi khoảng 200 km mỗi ms.']),
  ],
  goiY: [['A zero in curl -w for a stage means that stage did not happen for this request.', 'Số 0 trong curl -w ở một chặng nghĩa là chặng đó không xảy ra với request này.'], ['Compare stage durations with the ping RTT: about 1 RTT each for TCP and TLS 1.3.', 'So độ dài các chặng với RTT của ping: TCP và TLS 1.3 mỗi cái khoảng 1 RTT.']],
  loi: [['Fixing latency with bandwidth or CPU.', 'Chữa độ trễ bằng băng thông hay CPU.'], ['Creating a new HTTP client or database connection for every call.', 'Tạo HTTP client hay kết nối cơ sở dữ liệu mới cho mỗi lần gọi.']],
  tns: [tn('keep-alive', 'giữ kết nối', 'Kết nối không đóng sau phản hồi, request sau dùng lại.'), tn('connection pooling', 'bể kết nối', 'Giữ sẵn vài kết nối mở và dùng lại.'), tn('ALPN', 'chọn giao thức trong bắt tay TLS')],
  kn: ['keep-alive', 'RTT'],
});

/* ── 4. Tính tay độ dài các chặng ── */
const tach = (line) => Object.fromEntries(line.trim().split(/\s+/).map((p) => { const i = p.indexOf('='); return [p.slice(0, i), p.slice(i + 1)]; }));
const us = (s) => Math.round(Number(s) * 1e6);
function dai(line) {
  const t = tach(line); const d = us(t.dns), c = us(t.connect), l = us(t.tls), f = us(t.ttfb), o = us(t.total);
  const te = l > 0 ? l : c;
  return [d, c - d, te - c, f - te, o - f];
}
const COT = [['d', 'DNS (ms)'], ['c', 'TCP (ms)'], ['t', 'TLS (ms)'], ['s', 'Request + server (ms)'], ['b', 'Download (ms)']];
const hangDai = (nhan, line) => {
  const v = dai(line);
  return { o: { x: nhan }, a: Object.fromEntries(COT.map(([ma], i) => [ma, soNhan(v[i] / 1000, 1)])) };
};
const E4 = cs({
  ten: 'URL 4 — Subtract! Stage durations from curl -w', kho: 'MEDIUM', phut: 12, loai: 'table',
  en: `curl -w prints <b>moments measured from the start</b>, not durations. Turn these real lines into the duration of each stage, in milliseconds rounded to 0.1. The lesson did the first cuongthai.com run for you; here are the third run, a site far away, and a run inside the lab (plain HTTP: tls=0 means there was no TLS stage).${pre([W3[2], WEX, WLAB[1]])}`,
  vi: `curl -w in các <b>thời điểm tính từ lúc bắt đầu</b>, không phải độ dài. Đổi các dòng thật này thành độ dài từng chặng, đơn vị mili giây làm tròn 0,1. Bài học đã làm lượt cuongthai.com đầu tiên; đây là lượt thứ ba, một trang ở xa, và một lượt trong lab (HTTP thường: tls=0 nghĩa là không có chặng TLS).${pre([W3[2], WEX, WLAB[1]])}`,
  bang: [bang1('b1', ['Durations in ms', 'Độ dài (ms)'], [{ ma: 'x', ten: 'Line' }, ...COT.map(([ma, ten]) => ({ ma, ten }))], [
    hangDai('cuongthai.com, run 3', W3[2]),
    hangDai('example.com', WEX),
    hangDai('lab, http://10.10.2.10/api/hello, run 2', WLAB[1]),
  ], [`DNS = dns; TCP = connect − dns; TLS = tls − connect; request + server = ttfb − tls; download = total − ttfb. For the lab line there is no TLS, so the server stage starts at connect: ttfb − connect, not ttfb − 0. Run 3 of cuongthai.com is interesting: TLS took ${(dai(W3[2])[2] / 1000).toFixed(1)} ms, much more than in run 1 (14.1 ms) — networks are noisy, so always measure more than once.`, `DNS = dns; TCP = connect − dns; TLS = tls − connect; request + server = ttfb − tls; tải về = total − ttfb. Dòng trong lab không có TLS nên chặng server bắt đầu từ connect: ttfb − connect, không phải ttfb − 0. Lượt 3 của cuongthai.com đáng chú ý: TLS mất ${(dai(W3[2])[2] / 1000).toFixed(1).replace('.', ',')} ms, nhiều hơn hẳn lượt 1 (14,1 ms) — mạng luôn nhiễu, nên luôn đo nhiều lần.`])],
  goiY: [['Multiply seconds by 1000 to get milliseconds: 0.008675 s = 8.675 ms.', 'Nhân giây với 1000 để ra mili giây: 0,008675 s = 8,675 ms.'], ['Each stage = this moment − the previous moment. When tls is 0, the previous moment for the server stage is connect.', 'Mỗi chặng = thời điểm này − thời điểm trước. Khi tls bằng 0, thời điểm trước của chặng server là connect.']],
  loi: [['Reading tls=0.047172 as "TLS took 47 ms".', 'Đọc tls=0.047172 thành "TLS mất 47 ms".'], ['For plain HTTP, computing ttfb − tls = ttfb − 0 and giving the TCP time to the server.', 'Với HTTP thường, tính ttfb − tls = ttfb − 0 rồi đổ thời gian TCP cho server.']],
  tns: [tn('cumulative', 'cộng dồn'), tn('TTFB', 'thời gian tới byte đầu tiên'), tn('time_appconnect', 'mốc TLS xong', 'Thời điểm (tính từ đầu) bắt tay TLS hoàn tất; 0 khi không có TLS.')],
  kn: ['curl -w', 'stage durations'],
});

/* ── 5. Tự viết: mô hình TTFB ── */
function ttfbModel(o) {
  var https = o.https !== false;            // HTTPS unless told otherwise
  var t;
  if (o.reused) {
    t = o.rttMs + o.serverMs;               // the connection is already open: just the request round trip
  } else {
    t = o.dnsMs + o.rttMs                   // DNS, then the TCP handshake (1 RTT)
      + (https ? o.rttMs : 0)               // TLS 1.3 handshake (1 RTT), only for HTTPS
      + o.rttMs + o.serverMs;               // the request itself (1 RTT) and the server's work
  }
  return Math.round(t * 10) / 10;           // 0.1 ms, avoids 70.80000000000001
}
const E5 = jsBai({
  ten: 'URL 5 — Write ttfbModel(o): time to first byte in your head', kho: 'MEDIUM', phut: 12,
  en: `<p>The lesson gives a rough model you can use in your head:</p><p><b>time to first byte ≈ DNS + 1 RTT (TCP) + 1 RTT (TLS 1.3) + 1 RTT + server time</b></p>
<p>Write <code>ttfbModel(o)</code> with <code>o = { rttMs, dnsMs, serverMs, reused, https }</code>:</p>
<ul>
<li>A new connection: <code>dnsMs + rttMs + rttMs + rttMs + serverMs</code> — but for plain HTTP (<code>https: false</code>) there is no TLS round trip.</li>
<li>A reused connection (<code>reused: true</code>): DNS, TCP and TLS are skipped; only <code>rttMs + serverMs</code> remains.</li>
<li><code>https</code> may be missing: then it is <code>true</code>.</li>
<li>Return milliseconds rounded to 0.1 (<code>Math.round(x * 10) / 10</code>).</li>
</ul>
<p>Check it against reality: with the cuongthai.com numbers (RTT ≈ 8 ms, DNS 3.3 ms, server 43.5 ms) the model gives about 70.8 ms; curl measured ttfb = 69.5 ms in the first run.</p>`,
  vi: `<p>Bài học cho một mô hình thô để nhẩm trong đầu:</p><p><b>thời gian tới byte đầu ≈ DNS + 1 RTT (TCP) + 1 RTT (TLS 1.3) + 1 RTT + thời gian server</b></p>
<p>Viết <code>ttfbModel(o)</code> với <code>o = { rttMs, dnsMs, serverMs, reused, https }</code>:</p>
<ul>
<li>Kết nối mới: <code>dnsMs + rttMs + rttMs + rttMs + serverMs</code> — nhưng với HTTP thường (<code>https: false</code>) không có vòng TLS.</li>
<li>Kết nối dùng lại (<code>reused: true</code>): bỏ DNS, TCP và TLS; chỉ còn <code>rttMs + serverMs</code>.</li>
<li><code>https</code> có thể vắng: khi đó coi là <code>true</code>.</li>
<li>Trả mili giây làm tròn 0,1 (<code>Math.round(x * 10) / 10</code>).</li>
</ul>
<p>Đối chiếu với thực tế: với số của cuongthai.com (RTT ≈ 8 ms, DNS 3,3 ms, server 43,5 ms) mô hình cho khoảng 70,8 ms; curl đo được ttfb = 69,5 ms ở lượt đầu.</p>`,
  dauVao: ['o — { rttMs, dnsMs, serverMs, reused, https? } (numbers in ms, booleans).', 'o — { rttMs, dnsMs, serverMs, reused, https? } (số tính bằng ms, boolean).'],
  dauRa: ['A number of milliseconds, rounded to 0.1.', 'Một số mili giây, làm tròn 0,1.'],
  goiY: [['Handle reused first: it is the shortest branch.', 'Xử lý reused trước: đó là nhánh ngắn nhất.'], ['o.https !== false is true both when https is true and when it is missing.', 'o.https !== false là true cả khi https là true lẫn khi nó vắng.']],
  loi: [['Writing if (!o.https) — a missing https then counts as plain HTTP.', 'Viết if (!o.https) — https vắng khi đó bị coi là HTTP thường.'], ['Keeping DNS for a reused connection: the address is already known.', 'Vẫn tính DNS cho kết nối dùng lại: địa chỉ đã biết rồi.'], ['Not rounding: 3.3 + 24 + 43.5 is 70.80000000000001 in JavaScript.', 'Không làm tròn: 3.3 + 24 + 43.5 trong JavaScript là 70.80000000000001.']],
  gt: ['Each handshake is a question and an answer, so each costs one round trip; the request is one more. Distance multiplies every one of them, which is why with an 8 ms RTT the setup is about 24 ms but with 180 ms it is more than half a second before the server even starts. Reuse removes three of the four terms — the cheapest speed-up you have.', 'Mỗi lần bắt tay là một câu hỏi và một câu trả lời nên tốn một vòng đi-về; request là thêm một vòng. Khoảng cách nhân lên từng vòng, vì thế với RTT 8 ms phần dựng kết nối chỉ khoảng 24 ms nhưng với 180 ms thì đã hơn nửa giây trước khi server bắt đầu làm. Dùng lại kết nối bỏ được ba trong bốn số hạng — cách tăng tốc rẻ nhất bạn có.'],
  kn: ['latency model', 'keep-alive'],
  tns: [tn('RTT', 'thời gian đi-về'), tn('TTFB', 'thời gian tới byte đầu tiên'), tn('model', 'mô hình ước lượng', 'Công thức gần đúng để nhẩm, không phải số đo.')],
  dau: `/**
 * o = { rttMs, dnsMs, serverMs, reused, https }  (https missing ⇒ true)
 * Return the estimated time to first byte in ms, rounded to 0.1.
 */
function ttfbModel(o) {
  // Write your solution here
  return o.dnsMs + o.rttMs + o.serverMs;
}
`,
  giai: '// Reference solution\n' + nguon(ttfbModel),
  cases: [
    { goi: goi('ttfbModel', { rttMs: 8, dnsMs: 3.3, serverMs: 43.5, reused: false }) },
    { goi: goi('ttfbModel', { rttMs: 8, dnsMs: 3.3, serverMs: 43.5, reused: true }) },
    { goi: goi('ttfbModel', { rttMs: 180, dnsMs: 45.9, serverMs: 43.5, reused: false, https: true }) },
    { goi: goi('ttfbModel', { rttMs: 0.3, dnsMs: 0, serverMs: 1.1, reused: false, https: false }) },
    { goi: goi('ttfbModel', { rttMs: 27.1, dnsMs: 45.9, serverMs: 54, reused: false }), an: true },
    { goi: goi('ttfbModel', { rttMs: 250, dnsMs: 0, serverMs: 20, reused: true, https: false }), an: true },
    { goi: goi('ttfbModel', { rttMs: 0.1, dnsMs: 0.2, serverMs: 0.3, reused: false }), an: true },
    { goi: goi('ttfbModel', { rttMs: 150, dnsMs: 12.5, serverMs: 300, reused: false, https: false }), an: true },
  ],
  vdGt: ['3.3 + 8 + 8 + 8 + 43.5 = 70.8 ms — close to the 69.5 ms curl measured.', '3,3 + 8 + 8 + 8 + 43,5 = 70,8 ms — gần 69,5 ms curl đo được.'],
});

/* ── 6. Tự viết: đổi dòng curl -w thành độ dài từng chặng ── */
function stageDurations(line) {
  // 1. "dns=0.003260 connect=0.011939 …" ⇒ { dns: '0.003260', connect: '0.011939', … }.
  //    Split each pair at the FIRST "=" only (url=https://… contains more text), and ignore keys we do not need.
  var t = {};
  line.trim().split(/\s+/).forEach(function (pair) {
    var i = pair.indexOf('=');
    if (i > 0) t[pair.slice(0, i)] = pair.slice(i + 1);
  });
  // 2. Seconds with 6 decimals ⇒ whole microseconds, so every subtraction is exact.
  function us(name) { return Math.round(Number(t[name]) * 1e6); }
  var dns = us('dns'), connect = us('connect'), tls = us('tls'), ttfb = us('ttfb'), total = us('total');
  // 3. tls = 0 means "no TLS stage" (plain HTTP or a reused connection): TLS then ends when TCP ended.
  var tlsEnd = tls > 0 ? tls : connect;
  // 4. Microseconds ⇒ milliseconds rounded to 0.1.
  function ms(x) { return Math.round(x / 100) / 10; }
  return { dns: ms(dns), tcp: ms(connect - dns), tls: ms(tlsEnd - connect), server: ms(ttfb - tlsEnd), download: ms(total - ttfb) };
}
const E6 = jsBai({
  ten: 'URL 6 — Write stageDurations(line) from a real curl -w line', kho: 'HARD', phut: 25,
  en: `<p>Dashboards often show <code>time_appconnect</code> as "TLS time" — and optimise the wrong stage. Write <code>stageDurations(line)</code> that takes one line printed by</p>${pre("curl -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n'")}<p>and returns the <b>duration</b> of each stage in milliseconds, rounded to 0.1: <code>{ dns, tcp, tls, server, download }</code>.</p>
<ul>
<li>Every value in the line is a moment in seconds measured from the start: <code>dns</code> = DNS done, <code>connect</code> = TCP connected, <code>tls</code> = TLS done, <code>ttfb</code> = first byte arrived, <code>total</code> = everything arrived.</li>
<li><code>tls=0.000000</code> means there was no TLS stage (plain HTTP, or a reused connection): then <code>tls</code> duration is 0 and the server stage starts at <code>connect</code>.</li>
<li>A reused connection prints <code>dns</code>, <code>connect</code> and <code>tls</code> as 0: the server stage then starts at 0.</li>
<li>The line may contain other <code>key=value</code> words (<code>url=https://…</code> at the start, <code>ip=…</code> at the end): ignore them.</li>
</ul>
<p>Every case — visible and hidden — is a real line from the lab (lab/out/c00-internet and c00-url-lab): cuongthai.com, example.com, a reused connection, and plain HTTP inside the lab. (The first lab run, total − ttfb = exactly 50 µs, is left out: it sits right on a rounding boundary.)</p>`,
  vi: `<p>Dashboard hay hiện <code>time_appconnect</code> là "thời gian TLS" — rồi tối ưu nhầm chặng. Viết <code>stageDurations(line)</code> nhận một dòng do lệnh sau in ra</p>${pre("curl -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\\n'")}<p>và trả <b>độ dài</b> của từng chặng tính bằng mili giây, làm tròn 0,1: <code>{ dns, tcp, tls, server, download }</code>.</p>
<ul>
<li>Mỗi giá trị trong dòng là một thời điểm (giây) tính từ lúc bắt đầu: <code>dns</code> = xong DNS, <code>connect</code> = đã kết nối TCP, <code>tls</code> = xong TLS, <code>ttfb</code> = byte đầu tới, <code>total</code> = tới hết.</li>
<li><code>tls=0.000000</code> nghĩa là không có chặng TLS (HTTP thường, hoặc kết nối dùng lại): khi đó độ dài <code>tls</code> là 0 và chặng server bắt đầu từ <code>connect</code>.</li>
<li>Kết nối dùng lại in <code>dns</code>, <code>connect</code> và <code>tls</code> bằng 0: chặng server khi đó bắt đầu từ 0.</li>
<li>Dòng có thể chứa các từ <code>key=value</code> khác (<code>url=https://…</code> ở đầu, <code>ip=…</code> ở cuối): bỏ qua chúng.</li>
</ul>
<p>Mọi ca — hiện và ẩn — đều là dòng thật trong lab (lab/out/c00-internet và c00-url-lab): cuongthai.com, example.com, một kết nối dùng lại, và HTTP thường trong lab. (Lượt lab đầu tiên, total − ttfb = đúng 50 µs, được bỏ ra vì nằm ngay ranh giới làm tròn.)</p>`,
  dauVao: ['line — one curl -w line (string).', 'line — một dòng curl -w (chuỗi).'],
  dauRa: ['{ dns, tcp, tls, server, download } — numbers of milliseconds rounded to 0.1.', '{ dns, tcp, tls, server, download } — số mili giây làm tròn 0,1.'],
  rangBuoc: [['Values have 6 decimals (microseconds). No value is negative.', 'Giá trị có 6 chữ số thập phân (micro giây). Không có giá trị âm.']],
  goiY: [
    ['Parse first: split on spaces, then split each word at the first "=" (indexOf, slice). Store the strings in an object.', 'Tách trước: tách theo khoảng trắng, rồi tách mỗi từ ở dấu "=" đầu tiên (indexOf, slice). Lưu chuỗi vào một object.'],
    ['Work in whole microseconds: Math.round(Number(s) * 1e6). 11939 − 3260 = 8679 µs is exact; 0.011939 − 0.003260 in floating point is not.', 'Làm việc bằng micro giây nguyên: Math.round(Number(s) * 1e6). 11939 − 3260 = 8679 µs là chính xác; 0.011939 − 0.003260 với số thực thì không.'],
    ['Decide where TLS ends: tls > 0 ? tls : connect. Then every stage is "this moment − the moment before".', 'Xác định TLS kết thúc ở đâu: tls > 0 ? tls : connect. Rồi mỗi chặng là "thời điểm này − thời điểm trước".'],
  ],
  loi: [
    ['Returning the moments themselves (tls: 26.0) instead of durations (tls: 14.1).', 'Trả chính các thời điểm (tls: 26.0) thay vì độ dài (tls: 14.1).'],
    ['For plain HTTP computing tls − connect = 0 − 0.797 (a negative TLS stage) and ttfb − 0 for the server.', 'Với HTTP thường tính tls − connect = 0 − 0,797 (chặng TLS âm) và ttfb − 0 cho server.'],
    ['Splitting "url=https://cuongthai.com/about" with split("=") and a fixed index, or reading values by position: the url= and ip= words shift everything.', 'Tách "url=https://cuongthai.com/about" bằng split("=") với chỉ số cố định, hoặc đọc giá trị theo vị trí: từ url= và ip= làm lệch hết.'],
  ],
  gt: ['curl documents each variable as "the time from the start until…", so a stage is always the difference of two consecutive moments. The only subtle part is the missing stage: when there is no TLS, curl prints 0, not the connect time, so the "previous moment" of the server stage must fall back to connect. Converting to integer microseconds first keeps every subtraction exact, so rounding to 0.1 ms gives the same answer as doing it by hand.', 'curl mô tả mỗi biến là "thời gian từ lúc bắt đầu tới khi…", nên một chặng luôn là hiệu của hai thời điểm liên tiếp. Chỗ tinh tế duy nhất là chặng vắng mặt: khi không có TLS, curl in 0 chứ không in thời điểm connect, nên "thời điểm trước" của chặng server phải lùi về connect. Đổi sang micro giây nguyên trước giữ mọi phép trừ chính xác, nên làm tròn 0,1 ms cho cùng kết quả như tính tay.'],
  kn: ['curl -w', 'parsing', 'floating point'],
  tns: [tn('time_namelookup / time_connect', 'mốc xong DNS / mốc kết nối TCP'), tn('time_starttransfer', 'mốc byte đầu tiên', 'Chính là TTFB.'), tn('floating point', 'số thực dấu phẩy động', 'Số thực trong máy tính, phép trừ có thể lệch rất nhỏ.')],
  dau: `/**
 * line: "dns=0.003260 connect=0.011939 tls=0.026036 ttfb=0.069547 total=0.102738"
 * Return { dns, tcp, tls, server, download } — DURATIONS in ms, rounded to 0.1.
 */
function stageDurations(line) {
  // Write your solution here
  return { dns: 0, tcp: 0, tls: 0, server: 0, download: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(stageDurations),
  cases: [
    { goi: goi('stageDurations', W3[0]) },
    { goi: goi('stageDurations', WLAB[1]) },
    { goi: goi('stageDurations', W2[1]) },
    { goi: goi('stageDurations', W3[1]), an: true },
    { goi: goi('stageDurations', W3[2]), an: true },
    { goi: goi('stageDurations', W2[0]), an: true },
    { goi: goi('stageDurations', WEX), an: true },
    { goi: goi('stageDurations', WLAB[2]), an: true },
  ],
  vdGt: ['The first real run: DNS 3.3, TCP 8.7, TLS 14.1, server 43.5, download 33.2 ms — the table of lesson 0.2.', 'Lượt thật đầu tiên: DNS 3,3, TCP 8,7, TLS 14,1, server 43,5, tải về 33,2 ms — đúng bảng của bài 0.2.'],
});
// Chốt: không ca nào rơi đúng ranh giới làm tròn .x5 (người học làm bằng số thực vẫn ra cùng kết quả).
for (const l of [...W3, ...W2, WEX, WLAB[1], WLAB[2]]) for (const v of dai(l)) if (Math.abs(v % 100) === 50) throw new Error(`ranh giới làm tròn: ${l}`);

export default doiDau({ slug: 'netdev-0-2-go-dia-chi', ten: '0.2 What happens when you type a URL', khoa: KHOA, baiHoc: 'netdev-0-2-go-dia-chi', de: [E1, E2, E3, E4, E5, E6] });
