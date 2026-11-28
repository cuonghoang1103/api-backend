/**
 * Networking for Developers · Chương 7 (HTTP từ 1.1 tới 3) — bộ luyện chương, gắn bài Lab 7 (netdev-7-6-lab-http-labflow).
 * Dữ liệu thật: lab/out/c71-raw (phản hồi HTTP/1.1 nguyên văn, có \r\n), c71-chunked (đầu một phản hồi chunked), c72-mux (luồng 1/3/5),
 * c74-* (ETag/304, gzip, CORS, HSTS), c75-xff / c75-chain (X-Forwarded-For qua một và hai proxy). Khúc thứ hai của bản chunked và các
 * chuỗi XFF ở ca ẩn là DỰNG theo đúng khuôn (đề ghi rõ).
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, sauLenh, ra, pre, c, cs, tinh, q, bang1, mt } from './_net.mjs';

const RAW = sauLenh('c71-raw', "printf 'GET / HTTP/1.1").join('\n');
const CHUNK_HEAD = sauLenh('c71-chunked', "printf 'GET / HTTP/1.1").join('\n');
const MUX = sauLenh('c72-mux', 'tshark');
const XFF1 = JSON.parse(sauLenh('c75-xff', 'curl -s http://10.10.2.10/api/who').join('\n'));
const XFF2 = JSON.parse(sauLenh('c75-chain', 'curl -s http://10.10.2.10:8090/api/who').join('\n'));
if (!/Content-Length: 21\r/.test(RAW) || !/Transfer-Encoding: chunked\r/.test(CHUNK_HEAD) || MUX.length !== 6 || XFF1.forwardedFor !== '10.10.1.10' || XFF2.forwardedFor !== '10.10.1.10, 10.10.2.10') throw new Error('Ch7: output thật đổi — xem lại đề');
// sauLenh() bỏ dòng cuối chỉ có \r ⇒ trả lại đúng "\n\r\n" sau dữ liệu khúc 1 (18 byte = 0x12) rồi mới nối khúc dựng.
const CHUNKED = `${CHUNK_HEAD}\n\r\n14\r\nkhuc-2 (sau 1 giay)\n\r\n0\r\n\r\n`;
const hien = (s) => s.replace(/\r/g, '\\r');

function parseHttp(raw) {
  var s = String(raw), cut = s.indexOf('\r\n\r\n');
  var head = cut >= 0 ? s.slice(0, cut) : s, rest = cut >= 0 ? s.slice(cut + 4) : '';
  var lines = head.split('\r\n'), first = /^(HTTP\/[\d.]+) (\d{3}) ?(.*)$/.exec(lines[0]);
  var headers = {};
  lines.slice(1).forEach(function (l) {
    var i = l.indexOf(':'); if (i < 0) return;
    var k = l.slice(0, i).trim().toLowerCase(), v = l.slice(i + 1).trim();
    headers[k] = headers[k] !== undefined ? headers[k] + ', ' + v : v; // repeated header ⇒ comma-joined
  });
  var body = rest;
  if (/chunked/i.test(headers['transfer-encoding'] || '')) {
    body = '';
    for (;;) {
      var e = rest.indexOf('\r\n'); if (e < 0) break;
      var size = parseInt(rest.slice(0, e), 16); if (!(size > 0)) break; // the last chunk has size 0
      body += rest.slice(e + 2, e + 2 + size);
      rest = rest.slice(e + 2 + size + 2); // skip the data and its trailing CRLF
    }
  } else if (headers['content-length'] !== undefined) body = rest.slice(0, Number(headers['content-length']));
  return { version: first ? first[1] : null, status: first ? Number(first[2]) : null, reason: first ? first[3] : null, headers: headers, body: body };
}
const E1 = jsBai({
  ten: 'HTTP 1 — Write parseHttp(raw): read HTTP/1.1 off the wire', kho: 'HARD', phut: 30,
  en: `<p>HTTP/1.1 is text. This is the real response Lab 7 typed by hand with <code>nc</code> (line endings shown as <code>\\r</code>):</p>${pre(hien(RAW))}<p>Write <code>parseHttp(raw)</code> returning <code>{ version, status, reason, headers, body }</code>:</p>
<ul>
<li>The head ends at the first empty line (<code>\\r\\n\\r\\n</code>); the first line is <code>HTTP/1.1 200 OK</code> — <code>status</code> is a number.</li>
<li>Header names are case-insensitive: store them lowercase. A repeated header is joined with <code>", "</code> (real clients keep <code>Set-Cookie</code> as a list instead — it is the one header that cannot be comma-joined; it does not appear here).</li>
<li>Body: with <code>Transfer-Encoding: chunked</code>, decode it — each chunk is a hexadecimal size line, CRLF, that many bytes, CRLF; a size of <code>0</code> ends the body. Otherwise with <code>Content-Length</code>, take exactly that many characters. Otherwise take everything after the head.</li>
</ul>
<p>The second sample starts with the real chunked response of lesson 7.1; its second chunk and the terminating <code>0</code> chunk were reconstructed in the same format because the capture stopped after the first chunk.</p>`,
  vi: `<p>HTTP/1.1 là văn bản. Đây là phản hồi thật mà Lab 7 gõ tay bằng <code>nc</code> (ký tự xuống dòng hiện thành <code>\\r</code>):</p>${pre(hien(RAW))}<p>Viết <code>parseHttp(raw)</code> trả về <code>{ version, status, reason, headers, body }</code>:</p>
<ul>
<li>Phần đầu kết thúc ở dòng trống đầu tiên (<code>\\r\\n\\r\\n</code>); dòng đầu là <code>HTTP/1.1 200 OK</code> — <code>status</code> là số.</li>
<li>Tên header không phân biệt hoa thường: lưu dạng chữ thường. Header lặp lại thì nối bằng <code>", "</code> (client thật giữ <code>Set-Cookie</code> thành danh sách — đó là header duy nhất không được nối bằng dấu phẩy; ở đây không có nó).</li>
<li>Thân: có <code>Transfer-Encoding: chunked</code> thì giải mã — mỗi khúc là một dòng kích thước hệ 16, CRLF, đúng ngần ấy byte, CRLF; kích thước <code>0</code> kết thúc thân. Nếu không mà có <code>Content-Length</code> thì lấy đúng ngần ấy ký tự. Còn lại lấy mọi thứ sau phần đầu.</li>
</ul>
<p>Ca mẫu thứ hai bắt đầu bằng phản hồi chunked thật của bài 7.1; khúc thứ hai và khúc kết thúc <code>0</code> được dựng lại đúng khuôn vì bản ghi dừng sau khúc đầu.</p>`,
  dau: 'function parseHttp(raw) {\n  return { version: null, status: null, reason: null, headers: {}, body: "" };\n}\n',
  giai: nguon(parseHttp),
  cases: [
    { goi: goi('parseHttp', RAW) },
    { goi: goi('parseHttp', CHUNKED) },
    { goi: goi('parseHttp', 'HTTP/1.1 304 Not Modified\r\nETag: "6aeaddd3-25"\r\nCache-Control: max-age=60\r\n\r\n'), an: true },
    { goi: goi('parseHttp', 'HTTP/1.1 200 OK\r\nVary: Accept-Encoding\r\nvary: Origin\r\nContent-Length: 5\r\n\r\nhelloEXTRA'), an: true },
    { goi: goi('parseHttp', 'HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\na\r\n0123456789\r\n1A\r\nabcdefghijklmnopqrstuvwxyz\r\n0\r\n\r\n'), an: true },
    { goi: goi('parseHttp', 'HTTP/1.0 502 Bad Gateway\r\nServer: nginx\r\n\r\n<html>bad gateway</html>'), an: true },
  ],
  goiY: [['indexOf("\\r\\n\\r\\n") splits the head from the body; the head splits on "\\r\\n".', 'indexOf("\\r\\n\\r\\n") tách phần đầu khỏi thân; phần đầu tách theo "\\r\\n".'], ['parseInt(sizeLine, 16) reads a chunk size; uppercase hex such as 1A is valid.', 'parseInt(dòngKíchThước, 16) đọc kích thước khúc; hex chữ hoa như 1A vẫn hợp lệ.'], ['After each chunk\'s data skip exactly two characters, the CRLF.', 'Sau dữ liệu của mỗi khúc bỏ đúng hai ký tự, tức CRLF.']],
  loi: [['Reading the chunk size as decimal — "12" means eighteen bytes.', 'Đọc kích thước khúc theo hệ 10 — "12" nghĩa là mười tám byte.'], ['Keeping the case of header names, so "Vary" and "vary" become two different keys.', 'Giữ nguyên hoa thường của tên header, khiến "Vary" và "vary" thành hai khoá khác nhau.'], ['Ignoring Content-Length and returning the extra bytes of the next response on the same connection.', 'Bỏ qua Content-Length và trả cả các byte thừa thuộc phản hồi kế tiếp trên cùng kết nối.']],
  gt: ['Content-Length or chunked framing is what lets one TCP connection carry many responses: without them a client would not know where one body ends and the next response begins. That is also why keep-alive (Chapter 4) works for HTTP/1.1 at all.', 'Đóng khung bằng Content-Length hoặc chunked là thứ cho phép một kết nối TCP chở nhiều phản hồi: thiếu chúng client không biết thân này kết thúc ở đâu và phản hồi sau bắt đầu ở đâu. Đó cũng là lý do keep-alive (Chương 4) chạy được với HTTP/1.1.'],
  kn: ['HTTP/1.1 framing', 'chunked encoding'],
});

const E2 = tinh({
  tieuDe: 'HTTP 2 — Which header changes which behaviour?', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Lesson 7.4 measured every one of these in the lab (an ETag gave a 304, gzip shrank the body, HSTS forced HTTPS, a preflight returned the CORS headers). Match each header to what it controls and who acts on it.', 'Bài 7.4 đã đo từng header này trong lab (ETag cho ra 304, gzip làm thân nhỏ lại, HSTS ép HTTPS, preflight trả các header CORS). Ghép mỗi header với thứ nó điều khiển và bên hành động theo nó.'),
  loai: 'table',
  bang: [bang1('b1', ['Header → effect → enforced by', 'Header → tác dụng → ai thực thi'], [{ ma: 'h', ten: 'Header' }, { ma: 'e', ten: 'Effect', luaChon: ['how long a response may be reused', 'lets the client revalidate and get 304', 'the body is compressed', 'which other origins may read the response', 'always use HTTPS for this host', 'the real client IP behind proxies'] }, { ma: 'b', ten: 'Acted on by', luaChon: ['caches and browsers', 'the browser only', 'the server application'] }], [
    { o: { h: 'Cache-Control: public, max-age=3600' }, a: { e: 'how long a response may be reused', b: 'caches and browsers' } },
    { o: { h: 'ETag / If-None-Match' }, a: { e: 'lets the client revalidate and get 304', b: 'caches and browsers' } },
    { o: { h: 'Content-Encoding: gzip' }, a: { e: 'the body is compressed', b: 'caches and browsers' } },
    { o: { h: 'Access-Control-Allow-Origin' }, a: { e: 'which other origins may read the response', b: 'the browser only' } },
    { o: { h: 'Strict-Transport-Security' }, a: { e: 'always use HTTPS for this host', b: 'the browser only' } },
    { o: { h: 'X-Forwarded-For' }, a: { e: 'the real client IP behind proxies', b: 'the server application' } },
  ], ['CORS and HSTS are instructions to the browser: curl ignores both, which is why "it works with curl" proves nothing about CORS. Caching headers are read by every cache on the path, including the CDN of Chapter 8. X-Forwarded-For is read by your own code — and only safely if you know how many proxies to trust (Exercise 4).', 'CORS và HSTS là chỉ dẫn cho trình duyệt: curl bỏ qua cả hai, nên "chạy được bằng curl" chẳng chứng minh gì về CORS. Header cache được mọi cache trên đường đọc, kể cả CDN ở Chương 8. X-Forwarded-For do chính code của bạn đọc — và chỉ an toàn khi bạn biết phải tin bao nhiêu proxy (Bài 4).'])],
  goiY: ['Ask who reads the header: a cache, the browser, or your server.', 'A 304 has no body: the client reuses its cached copy.'],
  loiHayGap: ['Thinking the server enforces CORS.', 'Treating X-Forwarded-For as trustworthy input from the client.'],
  thuatNgu: [tn('preflight', 'yêu cầu dò trước (OPTIONS)'), tn('revalidation', 'kiểm lại bản cache')], khaiNiem: ['HTTP headers'],
});

const E3 = cs({
  ten: 'HTTP 3 — HTTP/2 and HTTP/3 on the wire', kho: 'MEDIUM', phut: 10,
  en: `Three requests on one HTTP/2 connection, decrypted with the session keys in Lab 7 (stream id, method, path, status):${pre(MUX)}`,
  vi: `Ba yêu cầu trên một kết nối HTTP/2, giải mã bằng khoá phiên ở Lab 7 (stream id, method, path, status):${pre(MUX)}`,
  cau: [
    q('c1', ['Why are the streams numbered 1, 3, 5?', 'Vì sao các luồng được đánh số 1, 3, 5?'], ['Client-initiated streams use odd numbers', 'Streams 2 and 4 were lost and retransmitted', 'Each request needs two streams', 'nginx skips even numbers for push'], ['In HTTP/2, streams opened by the client are odd, those opened by the server even; stream 0 is the connection itself. Three requests, three concurrent streams, one TCP connection.', 'Trong HTTP/2, luồng do client mở là số lẻ, do server mở là số chẵn; luồng 0 là chính kết nối. Ba yêu cầu, ba luồng song song, một kết nối TCP.']),
    q('c2', ['How did client and server agree on HTTP/2 before sending any HTTP?', 'Client và server thống nhất dùng HTTP/2 thế nào trước khi gửi câu HTTP nào?'], ['ALPN inside the TLS handshake', 'An HTTP/1.1 Upgrade header', 'A DNS TXT record', 'The client retried after a 426 status'], ['curl offered h2,http/1.1 in the ClientHello and the server accepted h2 — no extra round trip. That is why HTTP/2 in browsers effectively requires TLS.', 'curl đưa ra h2,http/1.1 trong ClientHello và server nhận h2 — không tốn thêm vòng khứ hồi nào. Đó là lý do HTTP/2 trên trình duyệt thực tế đòi TLS.']),
    q('c3', ['HTTP/2 multiplexes, yet one lost TCP packet still stalls every stream. Why?', 'HTTP/2 ghép kênh, vậy mà một gói TCP bị mất vẫn làm mọi luồng đứng lại. Vì sao?'], ['TCP must deliver bytes in order, so all streams wait', 'HPACK must decode every header again', 'Stream priorities are reset after a loss', 'The server closes the connection on loss'], ['Head-of-line blocking moved from HTTP to TCP. HTTP/3 fixes it by running streams over QUIC, where a loss only stalls the stream it belongs to.', 'Nghẽn đầu hàng chuyển từ HTTP xuống TCP. HTTP/3 sửa bằng cách chạy luồng trên QUIC, nơi một gói mất chỉ làm đứng đúng luồng chứa nó.']),
    q('c4', ['What does HPACK do?', 'HPACK làm gì?'], ['Compresses headers with static and dynamic tables of earlier values', 'Encrypts the body of each stream', 'Packs several images into one response', 'Pushes resources the client has not asked for'], ['Repeated headers (cookies, user-agent) shrink to small table indexes. HTTP/3 uses QPACK, adapted for out-of-order delivery.', 'Header lặp lại (cookie, user-agent) co lại thành các chỉ số bảng nhỏ. HTTP/3 dùng QPACK, được chỉnh cho việc tới không theo thứ tự.']),
    q('c5', ['Why did browsers drop HTTP/2 server push?', 'Vì sao trình duyệt bỏ server push của HTTP/2?'], ['It often sent resources the browser already had cached, wasting bandwidth', 'It was a security hole that leaked cookies', 'It only worked over HTTP/3', 'It required WebSocket support'], ['The server could not know what was in the browser cache. Preload hints and 103 Early Hints replaced it.', 'Server không biết trong cache trình duyệt có gì. Gợi ý preload và 103 Early Hints đã thay thế nó.']),
  ],
  goiY: [['Odd = client, even = server.', 'Lẻ = client, chẵn = server.'], ['HTTP/2 fixed HOL blocking at the HTTP layer only.', 'HTTP/2 chỉ sửa nghẽn đầu hàng ở tầng HTTP.']],
  loi: [['Believing HTTP/2 removed all head-of-line blocking.', 'Tin rằng HTTP/2 đã xoá hết nghẽn đầu hàng.'], ['Expecting HTTP/2 to be negotiated by an Upgrade header in browsers.', 'Chờ HTTP/2 được thương lượng bằng header Upgrade trên trình duyệt.']],
  tns: [tn('stream', 'luồng'), tn('multiplexing', 'ghép kênh'), tn('HPACK', 'nén header của HTTP/2')], kn: ['HTTP/2', 'HTTP/3'],
});

function clientIp(xff, remoteAddr, trustedHops) {
  var hops = String(xff || '').split(',').map(function (x) { return x.trim(); }).filter(function (x) { return x; });
  hops.push(String(remoteAddr).replace(/:\d+$/, '')); // the TCP peer, without its port
  var i = hops.length - 1 - trustedHops; // skip the proxies we run ourselves, counting from the right
  return hops[i < 0 ? 0 : i];
}
const E4 = jsBai({
  ten: 'HTTP 4 — Write clientIp(xff, remoteAddr, trustedHops): fix the 429 bug', kho: 'HARD', phut: 25,
  en: `<p>Lab 7's incident: a rate limiter banned every user at once because it keyed on the proxy's IP. The app's real view through one and two proxies:</p>${pre([`seenFrom ${XFF1.seenFrom}   forwardedFor "${XFF1.forwardedFor}"`, `seenFrom ${XFF2.seenFrom}   forwardedFor "${XFF2.forwardedFor}"`])}<p>Write <code>clientIp(xff, remoteAddr, trustedHops)</code>. Build the hop list = the comma-separated <code>X-Forwarded-For</code> entries (trimmed, empty ones dropped) followed by <code>remoteAddr</code> without its <code>:port</code>. Each proxy you run APPENDS the address it saw, so count <code>trustedHops</code> entries from the right and return the one just before them (index <code>length − 1 − trustedHops</code>, never below 0). <code>trustedHops = 0</code> means "no proxy in front": the TCP peer itself.</p>
<p>Why from the right: a client can send its own fake <code>X-Forwarded-For</code>; only the entries added by your own proxies are trustworthy.</p>`,
  vi: `<p>Sự cố của Lab 7: bộ giới hạn tần suất cấm mọi người dùng cùng lúc vì nó lấy IP của proxy làm khoá. Góc nhìn thật của ứng dụng qua một và hai proxy:</p>${pre([`seenFrom ${XFF1.seenFrom}   forwardedFor "${XFF1.forwardedFor}"`, `seenFrom ${XFF2.seenFrom}   forwardedFor "${XFF2.forwardedFor}"`])}<p>Viết <code>clientIp(xff, remoteAddr, trustedHops)</code>. Dựng danh sách chặng = các mục của <code>X-Forwarded-For</code> tách theo dấu phẩy (cắt khoảng trắng, bỏ mục rỗng) rồi tới <code>remoteAddr</code> đã bỏ <code>:port</code>. Mỗi proxy của bạn NỐI THÊM địa chỉ nó thấy, nên đếm <code>trustedHops</code> mục từ bên phải và trả mục đứng ngay trước chúng (chỉ số <code>length − 1 − trustedHops</code>, không nhỏ hơn 0). <code>trustedHops = 0</code> nghĩa là "không có proxy nào phía trước": chính bên kết nối TCP.</p>
<p>Vì sao đếm từ phải: client có thể tự gửi một <code>X-Forwarded-For</code> giả; chỉ các mục do chính proxy của bạn thêm vào mới đáng tin.</p>`,
  dau: 'function clientIp(xff, remoteAddr, trustedHops) {\n  return remoteAddr;\n}\n',
  giai: nguon(clientIp),
  cases: [
    { goi: goi('clientIp', XFF1.forwardedFor, XFF1.seenFrom, 1) },
    { goi: goi('clientIp', XFF2.forwardedFor, XFF2.seenFrom, 2) },
    { goi: goi('clientIp', XFF1.forwardedFor, XFF1.seenFrom, 0), moTa: ['Case 3: the bug — trusting nothing keys every user on the proxy', 'Ca 3: lỗi — không tin gì thì mọi người dùng chung khoá IP của proxy'] },
    { goi: goi('clientIp', '6.6.6.6, 10.10.1.10', '10.10.2.10:46256', 1), an: true, moTa: ['Hidden: a spoofed X-Forwarded-For from the client', 'Ẩn: X-Forwarded-For giả do client tự gửi'] },
    { goi: goi('clientIp', '', '203.0.113.7:51000', 1), an: true },
    { goi: goi('clientIp', ' 198.51.100.4 ,, 172.16.0.2 ', '10.0.0.1:443', 2), an: true },
    { goi: goi('clientIp', '198.51.100.4', '10.0.0.1:443', 5), an: true },
  ],
  goiY: [['Split, trim, drop empty strings, then push the remote address without the port.', 'Tách, cắt khoảng trắng, bỏ chuỗi rỗng, rồi thêm địa chỉ remote đã bỏ cổng.'], ['The answer is hops[hops.length - 1 - trustedHops], clamped at 0.', 'Đáp án là hops[hops.length - 1 - trustedHops], chặn dưới ở 0.']],
  loi: [['Taking the FIRST X-Forwarded-For entry: that is the one a client can forge.', 'Lấy mục ĐẦU TIÊN của X-Forwarded-For: đó chính là mục client có thể giả.'], ['Keying the limiter on remoteAddr behind a proxy, so one busy user bans everybody.', 'Lấy remoteAddr làm khoá giới hạn khi đứng sau proxy, khiến một người dùng bận rộn làm cả hệ thống bị cấm.']],
  gt: ['This is exactly what Express\'s "trust proxy = N" does. Trust too few hops and every user shares the proxy\'s IP (the 429 incident); trust too many — or read the leftmost entry — and an attacker picks any IP they like, defeating rate limits and audit logs. Configure N to the real number of proxies, or read a header your edge sets and strips (CF-Connecting-IP).', 'Đây đúng là việc "trust proxy = N" của Express làm. Tin quá ít chặng thì mọi người dùng chung IP của proxy (sự cố 429); tin quá nhiều — hoặc đọc mục ngoài cùng bên trái — thì kẻ tấn công tự chọn IP tuỳ thích, vô hiệu giới hạn tần suất lẫn nhật ký kiểm toán. Đặt N đúng bằng số proxy thật, hoặc đọc một header do edge của bạn đặt và xoá bản của client (CF-Connecting-IP).'],
  kn: ['X-Forwarded-For', 'trust proxy'],
});

export default doiDau({ slug: 'netdev-7-6-lab-http-labflow', ten: 'Lab 7 — Practice: HTTP framing, headers and the real client IP', khoa: KHOA, baiHoc: 'netdev-7-6-lab-http-labflow', de: [E1, E2, E3, E4] });
