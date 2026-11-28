/**
 * Networking for Developers · Chương 12 (mạng trong phỏng vấn) — bộ luyện chương, gắn bài 12.2 "Vòng tình huống" (netdev-12-2-tinh-huong).
 * Dữ liệu thật: lab/out/c113-path (curl -w thật: dns/connect/ttfb/total). Số liệu nhiều vùng ở bài viết hàm là DỰNG (đề ghi rõ), theo
 * đúng quy tắc kết luận của bài 12.2: time_connect lớn chỉ ở một vùng ⇒ đường đi; TTFB cao ở mọi nơi ⇒ origin.
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, sauLenh, pre, c, cs, tinh, ord, bang1, mt, q } from './_net.mjs';

const CW = sauLenh('c113-path', 'curl -s -o /dev/null -w')[0];
if (!/^dns=.*connect=.*ttfb=.*total=/.test(CW)) throw new Error('Ch12: output thật đổi — xem lại đề');

const E1 = tinh({
  tieuDe: 'Interview 1 — "Type a URL and press Enter", in the right order', doKho: 'EASY', phut: 6,
  moTa: mt(`Lesson 12.1: walk the layers in order, then prove it with a measurement such as this real one:${pre(CW)}`, `Bài 12.1: đi qua các tầng theo thứ tự, rồi chứng minh bằng một phép đo như dòng thật này:${pre(CW)}`),
  loai: 'order',
  cauHoi: [ord('q1', ['From the address bar to pixels', 'Từ thanh địa chỉ tới điểm ảnh'], ['DNS resolves the name (browser cache → OS → resolver → root/TLD/authoritative)', 'TCP three-way handshake to the IP that came back', 'TLS handshake (for https): certificate verified, keys agreed', 'HTTP request travels, possibly through a CDN edge or load balancer, and the response comes back', 'The browser parses and renders, fetching sub-resources over the same reused connection'], ['dns= is the first stage, connect= the TCP handshake, ttfb= the server\'s time to first byte, total= everything. Saying which stages can be skipped — a warm DNS cache, keep-alive, a CDN hit — is what turns a recital into an answer.', 'dns= là chặng đầu, connect= là bắt tay TCP, ttfb= là thời gian tới byte đầu của server, total= là tất cả. Nói được chặng nào có thể bỏ qua — cache DNS còn ấm, keep-alive, CDN trúng cache — là thứ biến bài thuộc lòng thành một câu trả lời.'])],
  goiY: ['A name before an address, an address before a connection.', 'TLS needs the TCP connection first.'],
  loiHayGap: ['Starting with "the browser sends an HTTP request" and skipping DNS and TCP.', 'Putting TLS before the TCP handshake.'],
  thuatNgu: [tn('TTFB', 'thời gian tới byte đầu')], khaiNiem: ['URL to page'],
});

const E2 = tinh({
  tieuDe: 'Interview 2 — Scenario rounds: symptom → first measurement → layer', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Lesson 12.2: the interviewer grades method, not luck. For each symptom pick the measurement you would run FIRST and the layer it usually lands in.', 'Bài 12.2: người phỏng vấn chấm phương pháp, không chấm may mắn. Với mỗi triệu chứng chọn phép đo bạn chạy ĐẦU TIÊN và tầng nó thường rơi vào.'),
  loai: 'table',
  bang: [bang1('b1', ['Three classic scenarios and two more', 'Ba tình huống kinh điển và hai tình huống nữa'], [{ ma: 's', ten: 'Symptom' }, { ma: 'm', ten: 'First measurement', luaChon: ['curl -w from both regions and compare', 'read the status code (502/503/504)', 'openssl s_client: the chain the server sends', 'dig the name from the failing network', 'nc -zv to the port'] }, { ma: 'l', ten: 'Usual layer', luaChon: ['path / routing', 'HTTP / application under load', 'TLS', 'DNS', 'transport / port'] }], [
    { o: { s: 'The page is slow only from Hanoi' }, a: { m: 'curl -w from both regions and compare', l: 'path / routing' } },
    { o: { s: 'The API times out every evening' }, a: { m: 'read the status code (502/503/504)', l: 'HTTP / application under load' } },
    { o: { s: 'Only old Android phones get certificate errors' }, a: { m: 'openssl s_client: the chain the server sends', l: 'TLS' } },
    { o: { s: 'The site works at home but "does not exist" on the school Wi-Fi' }, a: { m: 'dig the name from the failing network', l: 'DNS' } },
    { o: { s: 'A new service answers locally but not from the other server' }, a: { m: 'nc -zv to the port', l: 'transport / port' } },
  ], ['A large time_connect only in one region is distance or path; a high TTFB everywhere is the origin. Evening timeouts correlate with load — 504 (slow) vs 503 (no capacity) vs 502 (broken) point at different fixes. "Some clients, not all" is trust: a missing intermediate or an expired root on old devices. A name that resolves at home and not at school is the school\'s DNS. Local-only is a bind address or a firewall.', 'time_connect lớn chỉ ở một vùng là khoảng cách hay đường đi; TTFB cao ở mọi nơi là origin. Timeout buổi tối đi cùng tải — 504 (chậm), 503 (hết năng lực), 502 (hỏng) chỉ tới các cách sửa khác nhau. "Vài client, không phải tất cả" là chuyện niềm tin: thiếu trung gian hoặc gốc hết hạn trên máy cũ. Tên phân giải được ở nhà mà không ở trường là DNS của trường. Chỉ chạy cục bộ là địa chỉ bind hoặc tường lửa.'])],
  goiY: ['The symptom tells you where to measure, not what the answer is.', 'Read the status code before opening any log.'],
  loiHayGap: ['"It\'s probably the CDN" before measuring anything.', 'Blaming the database for evening timeouts without reading the code first.'],
  thuatNgu: [tn('localise', 'khoanh vùng'), tn('scenario round', 'vòng tình huống')], khaiNiem: ['scenario rounds'],
});

function localise(samples, slowServerMs) {
  if (!samples.length) return { verdict: 'no-data', region: null };
  var server = samples.map(function (s) { return Math.round((s.ttfb - s.connect) * 1000); }); // ms the origin spent before the first byte
  var sorted = server.slice().sort(function (a, b) { return a - b; });
  var med = sorted[Math.floor(sorted.length / 2)];
  if (med >= slowServerMs) return { verdict: 'origin', region: null };
  var worst = null;
  samples.forEach(function (s, i) {
    var others = samples.filter(function (_, j) { return j !== i; }).map(function (o) { return o.connect; }).sort(function (a, b) { return a - b; });
    var m = others.length ? others[Math.floor(others.length / 2)] : s.connect;
    if (others.length && s.connect >= 3 * m && (!worst || s.connect > worst.connect)) worst = s;
  });
  return worst ? { verdict: 'path', region: worst.region } : { verdict: 'healthy', region: null };
}
const R = (region, connect, ttfb) => ({ region, connect, ttfb });
const E3 = jsBai({
  ten: 'Interview 3 — Write localise(samples, slowServerMs): path or origin?', kho: 'HARD', phut: 25,
  en: `<p>Scenario 1 of lesson 12.2 — "slow only in one region" — comes with a conclusion rule. You collected <code>curl -w</code> timings (in seconds) from several regions, like the real line above but per region (the multi-region numbers here are constructed for practice). Write <code>localise(samples, slowServerMs)</code> where <code>samples</code> is a list of <code>{ region, connect, ttfb }</code>:</p>
<ol>
<li>no samples ⇒ <code>{ verdict: "no-data", region: null }</code>;</li>
<li>server time per sample = round((ttfb − connect) × 1000) ms. If the MEDIAN server time (sorted ascending, element at index floor(n/2)) is ≥ <code>slowServerMs</code> ⇒ <code>{ verdict: "origin", region: null }</code> — slow everywhere, the region is a red herring;</li>
<li>otherwise, a region whose <code>connect</code> is ≥ 3 × the median connect of the OTHER regions is a path problem ⇒ <code>{ verdict: "path", region }</code> (if several, the one with the largest connect);</li>
<li>otherwise <code>{ verdict: "healthy", region: null }</code>.</li>
</ol>`,
  vi: `<p>Tình huống 1 của bài 12.2 — "chỉ chậm ở một vùng" — đi kèm một quy tắc kết luận. Bạn thu số đo <code>curl -w</code> (tính bằng giây) từ nhiều vùng, giống dòng thật ở trên nhưng cho từng vùng (số liệu nhiều vùng ở đây được dựng để luyện tập). Viết <code>localise(samples, slowServerMs)</code> với <code>samples</code> là danh sách <code>{ region, connect, ttfb }</code>:</p>
<ol>
<li>không có mẫu ⇒ <code>{ verdict: "no-data", region: null }</code>;</li>
<li>thời gian server của mỗi mẫu = round((ttfb − connect) × 1000) ms. Nếu TRUNG VỊ thời gian server (sắp tăng dần, phần tử ở chỉ số floor(n/2)) ≥ <code>slowServerMs</code> ⇒ <code>{ verdict: "origin", region: null }</code> — chậm ở mọi nơi, chuyện vùng chỉ là đánh lạc hướng;</li>
<li>ngược lại, vùng nào có <code>connect</code> ≥ 3 × trung vị connect của CÁC VÙNG KHÁC là vấn đề đường đi ⇒ <code>{ verdict: "path", region }</code> (nhiều vùng thì chọn vùng connect lớn nhất);</li>
<li>còn lại <code>{ verdict: "healthy", region: null }</code>.</li>
</ol>`,
  dau: 'function localise(samples, slowServerMs) {\n  return { verdict: "healthy", region: null };\n}\n',
  giai: nguon(localise),
  cases: [
    { goi: goi('localise', [R('Singapore', 0.012, 0.050), R('Tokyo', 0.030, 0.071), R('Hanoi', 0.210, 0.252)], 500) },
    { goi: goi('localise', [R('Singapore', 0.012, 1.310), R('Tokyo', 0.031, 1.352), R('Hanoi', 0.040, 1.420)], 500) },
    { goi: goi('localise', [R('Singapore', 0.012, 0.050), R('Tokyo', 0.030, 0.071), R('Hanoi', 0.045, 0.090)], 500), an: true },
    { goi: goi('localise', [], 500), an: true },
    { goi: goi('localise', [R('A', 0.010, 0.040), R('B', 0.090, 0.130), R('C', 0.120, 0.160), R('D', 0.011, 0.045)], 500), an: true },
    { goi: goi('localise', [R('only', 0.300, 0.350)], 500), an: true },
  ],
  goiY: [['Compute server time first: a slow origin hides everything else.', 'Tính thời gian server trước: origin chậm che hết mọi thứ khác.'], ['For each region, the median connect of the OTHER regions is the baseline.', 'Với mỗi vùng, trung vị connect của CÁC VÙNG KHÁC là mốc so sánh.']],
  loi: [['Blaming the CDN for one slow region without comparing connect times.', 'Đổ cho CDN về một vùng chậm mà không so thời gian connect.'], ['Comparing total times, which mixes the server with the path.', 'So thời gian total, tức là trộn lẫn server với đường đi.']],
  gt: ['connect is about one round trip, so it measures distance and path; ttfb − connect is the server. Separating the two is exactly the "localise before you blame" move interviewers look for, written as code.', 'connect xấp xỉ một vòng khứ hồi, nên nó đo khoảng cách và đường đi; ttfb − connect là server. Tách hai thứ đó ra chính là động tác "khoanh vùng trước khi đổ lỗi" mà người phỏng vấn tìm, viết thành code.'],
  kn: ['localisation', 'curl -w'],
});

const E4 = cs({
  ten: 'Interview 4 — Trade-offs, not definitions', kho: 'MEDIUM', phut: 10,
  en: 'Lesson 12.1: the answer that gets remembered names what each design fixed and what it costs.',
  vi: 'Bài 12.1: câu trả lời được nhớ là câu gọi tên mỗi thiết kế đã sửa gì và tốn gì.',
  cau: [
    q('c1', ['Which answer to "TCP vs UDP?" sounds like experience?', 'Câu trả lời nào cho "TCP hay UDP?" nghe như người có kinh nghiệm?'], ['TCP pays a handshake for order; QUIC rebuilds that on UDP', 'TCP is reliable and UDP is not', 'UDP is always faster than TCP', 'TCP is for web pages, UDP is for games'], ['A trade-off plus a consequence beats a dictionary entry: TCP pays a round trip and can head-of-line-block; UDP skips both and guarantees nothing, which is why QUIC rebuilds per-stream ordering on top of it.', 'Một đánh đổi kèm hệ quả thắng một mục từ điển: TCP trả một vòng khứ hồi và có thể nghẽn đầu hàng; UDP bỏ cả hai và không bảo đảm gì, nên QUIC dựng lại thứ tự theo từng luồng ở trên nó.']),
    q('c2', ['What did HTTP/2 fix compared with HTTP/1.1?', 'HTTP/2 đã sửa gì so với HTTP/1.1?'], ['Many concurrent requests on one connection', 'TCP head-of-line blocking', 'The TLS handshake round trip', 'DNS lookup time'], ['HTTP/1.1 handles one request at a time per connection, so browsers opened about six. HTTP/2 multiplexes streams on one TCP connection — but a lost TCP packet still stalls all of them; HTTP/3 fixed that.', 'HTTP/1.1 xử lý mỗi lúc một request trên một kết nối, nên trình duyệt mở khoảng sáu kết nối. HTTP/2 ghép nhiều luồng trên một kết nối TCP — nhưng một gói TCP mất vẫn làm đứng tất cả; HTTP/3 mới sửa điều đó.']),
    q('c3', ['Why does the handshake matter to a backend developer?', 'Vì sao bắt tay lại quan trọng với lập trình viên backend?'], ['A full round trip before any request', 'It encrypts the request body', 'It chooses the HTTP version', 'It is where the DNS name is resolved'], ['One RTT before the first byte, on every new connection — that is why pools and keep-alive exist, and why an RPC opening a fresh connection per call is slow from far away.', 'Một RTT trước byte đầu tiên, ở mỗi kết nối mới — đó là lý do có pool và keep-alive, và vì sao một RPC mở kết nối mới cho mỗi lần gọi lại chậm khi ở xa.']),
    q('c4', ['The interviewer says "the site is down". What is the strongest first move?', 'Người phỏng vấn nói "trang sập rồi". Động tác đầu tiên mạnh nhất là gì?'], ['Ask who, where, since when — then measure', 'Say "it is probably DNS" straight away', 'Suggest restarting all the servers', 'List the seven layers of the OSI model'], ['Restating the symptom precisely removes half the hypotheses; then each hypothesis gets the one command that confirms or kills it. Jumping to a cause looks lucky even when it is right.', 'Nói lại triệu chứng cho thật chính xác đã loại được nửa số giả thuyết; sau đó mỗi giả thuyết có một lệnh xác nhận hoặc bác bỏ nó. Nhảy ngay tới nguyên nhân trông như ăn may, kể cả khi đúng.']),
    q('c5', ['For a developer applying to backend roles, how does the course rate CCNA?', 'Với một lập trình viên ứng tuyển backend, khoá học đánh giá CCNA thế nào?'], ['Useful knowledge, rarely required; measured projects say more', 'Mandatory for every backend job', 'Worthless for developers', 'Only valid together with a cloud certificate'], ['Lesson 12.3: certifications help for network/infra roles; for developers a project you can measure and explain (the Chapter 13 capstone) carries more weight in an interview.', 'Bài 12.3: chứng chỉ có ích cho vai trò mạng/hạ tầng; với lập trình viên, một dự án đo được và giải thích được (capstone Chương 13) có trọng lượng hơn trong phỏng vấn.']),
  ],
  goiY: [['Name what each design fixed and what it still costs.', 'Gọi tên mỗi thiết kế đã sửa gì và vẫn tốn gì.'], ['Back every claim with a measurement you have actually made.', 'Mọi khẳng định nên có một phép đo bạn đã thật sự làm.']],
  loi: [['Answering with a definition when the question asks for a decision.', 'Trả lời bằng định nghĩa trong khi câu hỏi đòi một quyết định.'], ['Saying "newer HTTP is faster" without saying why.', 'Nói "HTTP mới hơn thì nhanh hơn" mà không nói vì sao.']],
  tns: [tn('trade-off', 'đánh đổi'), tn('multiplexing', 'ghép kênh')], kn: ['interview answers'],
});

export default doiDau({ slug: 'netdev-12-2-tinh-huong', ten: '12.2 Practice: classic questions and scenario rounds', khoa: KHOA, baiHoc: 'netdev-12-2-tinh-huong', de: [E1, E2, E3, E4] });
