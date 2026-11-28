/**
 * Networking for Developers — Progress Test 2 (Chương 5–9: UDP/QUIC, TLS, HTTP, CDN, thời gian thực): 20 câu trắc nghiệm + 1 câu lập trình.
 *
 * Đề tự soạn, bám content/courses/networking-for-developers/s05…s09 và output thật trong lab/out (c51-loss, c52-altsvc, c62-hand, c64-*,
 * c71-*, c72-mux, c81-*, c83-nuot, c91-sse, c92-ws). Câu lập trình: quyết định biên CDN có lưu một phản hồi không và lưu bao lâu —
 * expectedOutput do bộ dựng CHẠY lời giải mẫu mà ra; exam-check chạy lại bằng node thật.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NETWORKING-FOR-DEVELOPERS-PT2.mjs --apply
 * Kiểm: node scripts/exam-check.mjs content/exams/NETWORKING-FOR-DEVELOPERS-PT2.mjs
 */
import { B, c, mcq, codeQ, ptInstructions } from './_lib/networking-exam-kit.mjs';

const M = (p, opts, ex) => mcq({ p, opts, ex, points: 0.4 });

const Q = [
  /* Chương 5 */
  M(['20 UDP datagrams are sent over a path with 30% loss; the receiver gets 12. What did the sender\'s send() calls return?', '20 datagram UDP gửi qua đường mất 30%; bên nhận được 12. Các lệnh send() của bên gửi trả về gì?'],
    [['Success for all 20', 'Thành công cả 20'], ['An error for the 8 lost ones', 'Lỗi cho 8 cái bị mất'], ['A timeout after 3 s', 'Hết giờ sau 3 giây'], ['ECONNRESET', 'ECONNRESET']],
    ['send() succeeds once the datagram leaves the machine. UDP carries no acknowledgement, so a loss on the path is never reported to the sender.', 'send() thành công khi datagram rời máy. UDP không có xác nhận, nên gói mất trên đường không bao giờ được báo về bên gửi.']),
  M([`A response carries ${c('alt-svc: h3=":443"; ma=86400')}. What does the browser do?`, `Một phản hồi mang ${c('alt-svc: h3=":443"; ma=86400')}. Trình duyệt làm gì?`],
    [['Remember for a day that HTTP/3 is on UDP 443', 'Nhớ trong một ngày rằng HTTP/3 có ở UDP 443'], ['Switch this response to HTTP/3 now', 'Chuyển ngay phản hồi này sang HTTP/3'], ['Block HTTP/2 for 86,400 s', 'Chặn HTTP/2 trong 86.400 giây'], ['Download a new certificate', 'Tải một chứng chỉ mới']],
    ['Alt-Svc advertises an alternative for FUTURE requests; ma is how long to remember it. The browser tries QUIC next time and keeps TCP as the fallback.', 'Alt-Svc quảng cáo một lựa chọn cho các request SAU NÀY; ma là thời gian ghi nhớ. Trình duyệt thử QUIC lần sau và giữ TCP làm đường lùi.']),
  M(['Why does a voice call prefer UDP over TCP?', 'Vì sao cuộc gọi thoại chuộng UDP hơn TCP?'],
    [['Late audio is useless audio', 'Âm thanh tới muộn là vô dụng'], ['UDP has stronger encryption', 'UDP mã hoá mạnh hơn TCP'], ['TCP cannot carry audio data', 'TCP không chở được dữ liệu âm thanh'], ['UDP avoids NAT entirely', 'UDP né hẳn được NAT']],
    ['TCP would hold every later packet behind a lost one until it is resent — by then the audio moment has passed. Real-time media tolerates loss better than delay.', 'TCP sẽ giữ mọi gói sau lại phía sau gói bị mất cho tới khi gửi lại xong — lúc đó khoảnh khắc âm thanh đã trôi qua. Media thời gian thực chịu mất gói tốt hơn chịu trễ.']),
  M(['Which QUIC feature lets a download survive switching from Wi-Fi to 4G?', 'Tính năng nào của QUIC giúp lượt tải sống sót khi chuyển từ Wi-Fi sang 4G?'],
    [['Connection IDs (connection migration)', 'Connection ID (di trú kết nối)'], ['QPACK header compression', 'Nén header QPACK'], ['0-RTT resumption', 'Nối lại 0-RTT'], ['A larger MTU', 'MTU lớn hơn']],
    ['TCP names a connection by its four-tuple, which changes with the IP. QUIC names it by IDs inside its packets, so a new address does not end it.', 'TCP định danh kết nối bằng bộ bốn địa chỉ/cổng, vốn đổi theo IP. QUIC định danh bằng ID trong gói, nên địa chỉ mới không kết thúc nó.']),
  /* Chương 6 */
  M(['On a captured TLS 1.3 connection to labflow.test, what can an on-path observer still read?', 'Trên một kết nối TLS 1.3 bắt được tới labflow.test, người nghe trên đường còn đọc được gì?'],
    [['The server name, from the SNI', 'Tên máy chủ, từ SNI'], ['The URL path', 'Đường dẫn URL'], ['The cookies', 'Cookie'], ['The response body', 'Thân phản hồi']],
    ['The ClientHello — including SNI — is cleartext; everything after ServerHello is encrypted, including the certificate in TLS 1.3.', 'ClientHello — kể cả SNI — là chữ rõ; mọi thứ sau ServerHello đều mã hoá, kể cả chứng chỉ trong TLS 1.3.']),
  M([`curl fails with ${c('unable to get local issuer certificate (20)')} while browsers open the site. Most likely cause?`, `curl hỏng với ${c('unable to get local issuer certificate (20)')} trong khi trình duyệt vẫn mở được trang. Nguyên nhân nhiều khả năng nhất?`],
    [['The server omits the intermediate certificate', 'Server không gửi chứng chỉ trung gian'], ['The certificate has expired', 'Chứng chỉ đã hết hạn'], ['curl does not support TLS 1.3', 'curl không hỗ trợ TLS 1.3'], ['The site uses a self-signed root', 'Trang dùng gốc tự ký']],
    ['Browsers can fetch a missing intermediate through AIA and hide the mistake; curl, Java and monitoring cannot. Serve leaf + intermediate.', 'Trình duyệt có thể tự lấy trung gian còn thiếu qua AIA và che lỗi đi; curl, Java và hệ giám sát thì không. Hãy phục vụ lá + trung gian.']),
  M(['How many round trips does a full TLS 1.3 handshake add before the first request?', 'Một lần bắt tay TLS 1.3 đầy đủ thêm bao nhiêu vòng khứ hồi trước request đầu tiên?'],
    [['One', 'Một'], ['Two', 'Hai'], ['Three', 'Ba'], ['None', 'Không vòng nào']],
    ['The client sends its key share in the ClientHello, so keys exist after one round trip (TLS 1.2 needed two). 0-RTT resumption can send data earlier, at the price of replay risk.', 'Client gửi key share ngay trong ClientHello, nên có khoá sau một vòng (TLS 1.2 cần hai). Nối lại 0-RTT gửi dữ liệu sớm hơn, đổi lại nguy cơ bị phát lại.']),
  M([`One machine reports ${c('certificate is not yet valid (9)')}; others are fine. First check?`, `Một máy báo ${c('certificate is not yet valid (9)')}; các máy khác vẫn ổn. Kiểm gì trước?`],
    [['That machine\'s clock', 'Đồng hồ của máy đó'], ['The server\'s certificate chain', 'Chuỗi chứng chỉ của server'], ['The DNS record', 'Bản ghi DNS'], ['The firewall rules', 'Luật tường lửa']],
    ['If only one client complains about the start date, its clock is behind. Fix NTP rather than reissuing a certificate that works for everyone else.', 'Nếu chỉ một client than về ngày bắt đầu, đồng hồ của nó đang chậm. Sửa NTP thay vì cấp lại chứng chỉ vốn chạy tốt với mọi người khác.']),
  /* Chương 7 */
  M(['An HTTP/1.1 response uses Transfer-Encoding: chunked. How does the client know the body has ended?', 'Một phản hồi HTTP/1.1 dùng Transfer-Encoding: chunked. Client biết thân đã hết bằng cách nào?'],
    [['A final chunk of size 0', 'Một khúc cuối có kích thước 0'], ['The server closes TCP', 'Server đóng TCP'], ['A Content-Length trailer', 'Một trailer Content-Length'], ['A blank line after each chunk', 'Một dòng trống sau mỗi khúc']],
    ['Each chunk is a hexadecimal size, CRLF, the data, CRLF; size 0 ends the body. That is what lets the connection stay open for the next response.', 'Mỗi khúc là kích thước hệ 16, CRLF, dữ liệu, CRLF; kích thước 0 kết thúc thân. Nhờ vậy kết nối còn mở được cho phản hồi kế tiếp.']),
  M(['Three requests on one HTTP/2 connection appear as streams 1, 3 and 5. Why odd numbers?', 'Ba request trên một kết nối HTTP/2 hiện thành luồng 1, 3 và 5. Vì sao số lẻ?'],
    [['Client-opened streams are odd', 'Luồng do client mở là số lẻ'], ['Even streams were lost', 'Các luồng chẵn bị mất'], ['Each request uses two streams', 'Mỗi request dùng hai luồng'], ['nginx skips even IDs', 'nginx bỏ qua ID chẵn']],
    ['Odd IDs are client-initiated, even IDs server-initiated, and stream 0 is the connection itself.', 'ID lẻ do client khởi tạo, ID chẵn do server khởi tạo, còn luồng 0 là chính kết nối.']),
  M(['The CORS preflight returns the right Access-Control-Allow-Origin, yet curl from a script "works without it". What enforces CORS?', 'Preflight CORS trả đúng Access-Control-Allow-Origin, vậy mà curl trong script "chạy được không cần nó". Ai thực thi CORS?'],
    [['The browser only', 'Chỉ trình duyệt'], ['The server, on every request', 'Server, ở mọi request'], ['The CDN edge', 'Biên CDN'], ['The TLS layer', 'Tầng TLS']],
    ['CORS restricts what a page from another origin may READ, inside a browser. Non-browser clients ignore it, so CORS is never an access-control mechanism for your API.', 'CORS giới hạn thứ một trang từ origin khác được ĐỌC, bên trong trình duyệt. Client không phải trình duyệt bỏ qua nó, nên CORS không bao giờ là cơ chế phân quyền cho API của bạn.']),
  M(['Behind one proxy, the app sees seenFrom 10.10.2.10 and X-Forwarded-For "6.6.6.6, 10.10.1.10". Which is the real client?', 'Sau một proxy, ứng dụng thấy seenFrom 10.10.2.10 và X-Forwarded-For "6.6.6.6, 10.10.1.10". Đâu là client thật?'],
    [['10.10.1.10', '10.10.1.10'], ['6.6.6.6', '6.6.6.6'], ['10.10.2.10', '10.10.2.10'], ['Cannot be known', 'Không thể biết']],
    ['Your proxy appends what it saw (10.10.1.10). Anything to its left came from the client and can be forged — here 6.6.6.6. Count trusted hops from the right.', 'Proxy của bạn nối thêm thứ nó thấy (10.10.1.10). Mọi thứ bên trái do client gửi và có thể giả — ở đây là 6.6.6.6. Đếm số chặng tin cậy từ bên phải.']),
  /* Chương 8 */
  M(['Requests for /img/logo.txt?v=1, ?v=1, ?v=2 show MISS, HIT, MISS at the edge. What does that show?', 'Request /img/logo.txt?v=1, ?v=1, ?v=2 cho MISS, HIT, MISS ở biên. Điều đó cho thấy gì?'],
    [['The query string is part of the cache key', 'Query là một phần của khoá cache'], ['The edge cache is broken', 'Cache ở biên bị hỏng'], ['The TTL is one second', 'TTL là một giây'], ['v=2 is a different file on disk', 'v=2 là một tệp khác trên đĩa']],
    ['Same bytes, different keys. Tracking or cache-busting queries fragment the cache; hashed filenames are the clean way to version assets.', 'Cùng nội dung, khác khoá. Query theo dõi hay phá cache làm phân mảnh cache; tên tệp băm mới là cách sạch để đánh phiên bản tài nguyên.']),
  M(['The origin sends Cache-Control: public, max-age=3600 but users receive no-store. Where do you look first?', 'Origin gửi Cache-Control: public, max-age=3600 nhưng người dùng nhận no-store. Nhìn vào đâu trước?'],
    [['The proxy or edge config in front', 'Cấu hình proxy/biên đứng trước'], ['The browser cache settings', 'Cài đặt cache của trình duyệt'], ['The origin\'s clock', 'Đồng hồ của origin'], ['The DNS TTL', 'TTL của DNS']],
    ['The last layer to touch a header wins: proxy_hide_header plus add_header no-store on the edge overrides the origin. curl the edge and the origin and compare.', 'Lớp cuối cùng đụng vào header là lớp thắng: proxy_hide_header cộng add_header no-store ở biên đè lên origin. curl cả biên lẫn origin rồi so.']),
  M(['What does Cache-Control: no-cache mean?', 'Cache-Control: no-cache nghĩa là gì?'],
    [['Store it, but revalidate before each reuse', 'Được lưu, nhưng kiểm lại trước mỗi lần dùng'], ['Never store it anywhere', 'Không bao giờ lưu ở đâu'], ['Store it only in the browser', 'Chỉ lưu ở trình duyệt'], ['Store it for one hour', 'Lưu trong một giờ']],
    ['no-cache forces a conditional request (ETag / If-None-Match) that can end in a cheap 304; no-store is the one that forbids storing.', 'no-cache bắt một request có điều kiện (ETag / If-None-Match) có thể kết thúc bằng 304 rẻ; no-store mới là cái cấm lưu.']),
  M(['A 3-minute report behind Cloudflare returns 524. Best fix?', 'Một báo cáo chạy 3 phút sau Cloudflare trả 524. Cách sửa tốt nhất?'],
    [['Return 202 and let a worker do the job', 'Trả 202 và để worker làm việc'], ['Raise nginx proxy_read_timeout', 'Nâng proxy_read_timeout của nginx'], ['Disable caching for the route', 'Tắt cache cho tuyến đó'], ['Retry from the browser', 'Thử lại từ trình duyệt']],
    ['The edge waits about 100 s at most; raising your own timeout only moves the wall. Answer quickly with a status URL and run the job in the background.', 'Biên chờ tối đa khoảng 100 giây; nâng timeout của mình chỉ dời bức tường. Trả lời nhanh kèm URL trạng thái và chạy việc ở nền.']),
  /* Chương 9 */
  M(['Live build logs must stream from server to browser. Which mechanism fits best?', 'Log build trực tiếp phải chảy từ server tới trình duyệt. Cơ chế nào hợp nhất?'],
    [['Server-Sent Events', 'Server-Sent Events'], ['A WebSocket', 'Một WebSocket'], ['WebRTC', 'WebRTC'], ['Polling every 100 ms', 'Polling mỗi 100 ms']],
    ['One-way, server to client, over plain HTTP with built-in reconnect: SSE. Turn proxy buffering off (X-Accel-Buffering: no).', 'Một chiều, server tới client, trên HTTP thường và tự nối lại: SSE. Nhớ tắt đệm proxy (X-Accel-Buffering: no).']),
  M(['The WebSocket upgrade succeeds with status…', 'Nâng cấp WebSocket thành công với mã trạng thái…'],
    [['101 Switching Protocols', '101 Switching Protocols'], ['200 OK', '200 OK'], ['204 No Content', '204 No Content'], ['426 Upgrade Required', '426 Upgrade Required']],
    ['The server answers 101 with Sec-WebSocket-Accept = base64(SHA-1(key + the RFC GUID)); from then on the TCP connection carries frames, not HTTP.', 'Server trả 101 kèm Sec-WebSocket-Accept = base64(SHA-1(khoá + GUID của RFC)); từ đó kết nối TCP chở frame, không còn là HTTP.']),
  M(['After a deploy, 10,000 clients reconnect in the same millisecond and crash the new server. What prevents it?', 'Sau một lần deploy, 10.000 client nối lại trong cùng một mili giây và đánh sập server mới. Cái gì ngăn được?'],
    [['Exponential backoff with jitter', 'Lùi theo hàm mũ có nhiễu'], ['A larger ulimit -n', 'ulimit -n lớn hơn'], ['Longer heartbeat intervals', 'Khoảng nhịp tim dài hơn'], ['Sticky sessions', 'Sticky session']],
    ['Backoff spreads retries over time; jitter spreads them across clients. Without jitter everyone retries in lockstep — a thundering herd.', 'Lùi dần trải các lần thử theo thời gian; nhiễu trải chúng ra giữa các client. Không có nhiễu thì mọi người thử lại cùng nhịp — hiện tượng bầy đàn.']),
  M(['In WebRTC, what does a TURN server do?', 'Trong WebRTC, server TURN làm gì?'],
    [['Relays media when no direct path works', 'Chuyển tiếp media khi không có đường trực tiếp'], ['Tells a peer its public address', 'Cho một bên biết địa chỉ công cộng'], ['Exchanges the SDP offer', 'Trao đổi lời mời SDP'], ['Encrypts the media keys', 'Mã hoá khoá media']],
    ['STUN discovers the public mapping, ICE tries candidates, TURN relays when nothing direct connects (e.g. symmetric NAT); signalling is the part you build.', 'STUN tìm ánh xạ công cộng, ICE thử các ứng viên, TURN chuyển tiếp khi không gì trực tiếp nối được (ví dụ NAT đối xứng); signalling là phần bạn tự dựng.']),
];

const GIVEN = `// Phản hồi mà origin trả cho biên CDN — header viết thường như khi đã chuẩn hoá
const RESPONSES = [
  { url: '/img/logo.txt', status: 200, headers: { 'cache-control': 'public, max-age=3600' } },
  { url: '/app.3f9c2b.js', status: 200, headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  { url: '/account', status: 200, headers: { 'cache-control': 'private, max-age=600' } },
  { url: '/api/report', status: 200, headers: { 'cache-control': 'no-store' } },
  { url: '/news', status: 200, headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } },
  { url: '/feed', status: 200, headers: { 'cache-control': 'no-cache' } },
  { url: '/broken', status: 502, headers: { 'cache-control': 'public, max-age=3600' } },
  { url: '/about', status: 200, headers: {} },
];`;
const STUB = `function edgeDecision(res) {
  // return { store: true|false, ttl: seconds, revalidate: true|false, reason: '...' }
}`;
const SOLUTION = `function directives(h) {
  const out = {};
  for (const part of String(h['cache-control'] || '').split(',')) {
    const [k, v] = part.trim().toLowerCase().split('=');
    if (k) out[k] = v === undefined ? true : Number(v);
  }
  return out;
}

function edgeDecision(res) {
  const d = directives(res.headers);
  if (res.status !== 200) return { store: false, ttl: 0, revalidate: false, reason: 'status ' + res.status };
  if (d['no-store']) return { store: false, ttl: 0, revalidate: false, reason: 'no-store' };
  if (d.private) return { store: false, ttl: 0, revalidate: false, reason: 'private' };
  if (d['no-cache']) return { store: true, ttl: 0, revalidate: true, reason: 'no-cache' };
  if (d['s-maxage'] !== undefined) return { store: true, ttl: d['s-maxage'], revalidate: false, reason: 's-maxage' };
  if (d['max-age'] !== undefined) return { store: true, ttl: d['max-age'], revalidate: false, reason: 'max-age' };
  return { store: false, ttl: 0, revalidate: false, reason: 'no cache headers' };
}`;
const PRINT = `for (const r of RESPONSES) {
  const d = edgeDecision(r);
  console.log(\`\${r.url.padEnd(15)} store=\${d.store} ttl=\${d.ttl} revalidate=\${d.revalidate} (\${d.reason})\`);
}`;

const CODE = codeQ({
  points: 2,
  prompt: B(
    `<p><b>Q21 — What does the CDN edge keep, and for how long? (chapter 8)</b> The given block lists responses an origin sent to a shared CDN edge. Implement <code>edgeDecision(res)</code> returning <code>{ store, ttl, revalidate, reason }</code>, applying these rules in order:</p><ol><li>status other than 200 ⇒ not stored, reason <code>"status N"</code>;</li><li><code>no-store</code> ⇒ not stored; <code>private</code> ⇒ not stored (browser only);</li><li><code>no-cache</code> ⇒ stored with ttl 0 and <code>revalidate: true</code>;</li><li><code>s-maxage=N</code> (shared caches) wins over <code>max-age</code> ⇒ stored for N; else <code>max-age=N</code> ⇒ stored for N;</li><li>no caching directive at all ⇒ not stored, reason <code>"no cache headers"</code> (this edge does not guess).</li></ol><p>Parse the comma-separated directives yourself; names are case-insensitive. Keep the data and the printing block unchanged; do not <code>require</code> anything.</p>`,
    `<p><b>Câu 21 — Biên CDN giữ gì, và giữ bao lâu? (chương 8)</b> Khối cho sẵn liệt kê các phản hồi origin gửi cho một biên CDN dùng chung. Cài <code>edgeDecision(res)</code> trả <code>{ store, ttl, revalidate, reason }</code>, áp các quy tắc theo thứ tự:</p><ol><li>mã khác 200 ⇒ không lưu, reason <code>"status N"</code>;</li><li><code>no-store</code> ⇒ không lưu; <code>private</code> ⇒ không lưu (chỉ trình duyệt);</li><li><code>no-cache</code> ⇒ lưu với ttl 0 và <code>revalidate: true</code>;</li><li><code>s-maxage=N</code> (dành cho cache dùng chung) thắng <code>max-age</code> ⇒ lưu N giây; không có thì <code>max-age=N</code> ⇒ lưu N giây;</li><li>không có chỉ thị cache nào ⇒ không lưu, reason <code>"no cache headers"</code> (biên này không đoán).</li></ol><p>Tự tách các chỉ thị ngăn bởi dấu phẩy; tên không phân biệt hoa thường. Giữ nguyên dữ liệu và khối in kết quả; không <code>require</code> gì cả.</p>`,
  ),
  given: GIVEN, stub: STUB, solution: SOLUTION, print: PRINT,
});

export default {
  course: { slug: 'networking-for-developers' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B('Progress Test 2 — Chapters 5–9 (UDP/QUIC, TLS, HTTP, CDN, real-time)', 'Bài kiểm tra tiến độ 2 — Chương 5–9 (UDP/QUIC, TLS, HTTP, CDN, thời gian thực)'),
      description: B('20 multiple-choice questions built on real lab output, plus one coding task: the cache decisions of a CDN edge.', '20 câu trắc nghiệm dựng trên output thật của lab, cộng một câu lập trình: các quyết định cache của biên CDN.'),
      durationMinutes: 50,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: false,
      shuffleOptions: false,
      instructions: ptInstructions(2, '5–9'),
      isPublished: true,
      questions: [...Q, CODE],
    },
  ],
};
