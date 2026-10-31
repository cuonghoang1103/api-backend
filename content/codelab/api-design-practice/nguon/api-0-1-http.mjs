/** API Design · 0.1 — HTTP cần biết: đọc curl -v thật, năm phần của URL; tự viết parseStatusLine / parseHeaders / parseTarget. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi, pre } from './_api.mjs';

/* Output THẬT (Node 22.23.3 + Express 5.3.0 + curl 8.7.1, LabFlow sau Chương 1). */
const V_LABS = `* Host localhost:4000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:4000...
* Connected to localhost (::1) port 4000
> GET /labs?building=Alpha HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/8.7.1
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200 OK
< Content-Type: application/json; charset=utf-8
< Content-Length: 308
< ETag: W/"134-Yp3inAv3GH9X3NU/ZH2dIcGxQbI"
< Date: Sat, 31 Oct 2026 17:22:30 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{ [308 bytes data]
* Connection #0 to host localhost left intact`;
const R404 = `HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-lXLsqA33DrufMdXbcY1kiV4Dmbs"
Date: Sat, 31 Oct 2026 17:22:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}`;
const R405 = `HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: application/json; charset=utf-8
Content-Length: 91
ETag: W/"5b-aa9kTS6ZkiCz5Zgdn/iyIMBEVks"
Date: Sat, 31 Oct 2026 17:22:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "METHOD_NOT_ALLOWED",
  "message": "DELETE không dùng được ở /labs/"
}`;

/* ── 1. Đọc curl -v ── */
const H1 = cs({
  ten: 'HTTP 1 — Read a real curl -v line by line', kho: 'EASY', phut: 10,
  en: `Real output of <code>curl -sv 'http://localhost:4000/labs?building=Alpha'</code> against LabFlow:${pre(V_LABS)}`,
  vi: `Output thật của <code>curl -sv 'http://localhost:4000/labs?building=Alpha'</code> gọi vào LabFlow:${pre(V_LABS)}`,
  cau: [
    q('c1', ['Which lines are exactly what curl SENT to the server?', 'Những dòng nào chính xác là thứ curl đã GỬI tới server?'], ['The lines starting with >', 'The lines starting with <', 'The lines starting with *', 'Only the line GET /labs?building=Alpha HTTP/1.1'], ['> = sent, < = received, * = curl narrating what it does (DNS, connect, done).', '> = đã gửi, < = đã nhận, * = curl kể việc nó đang làm (tra tên, kết nối, xong).']),
    q('c2', ['What does the line “>” with nothing after it mean?', 'Dòng ">" không có gì phía sau nghĩa là gì?'], ['The empty line that ends the request headers', 'curl lost part of the request', 'An empty header that the server will reject', 'The start of the request body'], ['Every HTTP/1.1 message has headers, then one empty line, then the optional body. GET has no body, so the request ends there.', 'Mọi thông điệp HTTP/1.1 có header, rồi một dòng trống, rồi body tuỳ chọn. GET không có body nên request kết thúc ở đó.']),
    q('c3', ['Which part of the URL never appears on the request line?', 'Phần nào của URL không bao giờ xuất hiện trên dòng request?'], ['The scheme, host and port (the host is repeated in the Host header)', 'The query string ?building=Alpha, which is sent separately in the body', 'The path /labs, because curl only sends the query', 'The HTTP version, which only appears in the response'], ['The request line carries only the target (/labs?building=Alpha). Host and port picked the machine and program; the Host header repeats the name for servers that host several sites.', 'Dòng request chỉ chở đích (/labs?building=Alpha). Host và cổng dùng để chọn máy và chương trình; header Host nhắc lại tên cho server chạy nhiều site.']),
    q('c4', ['Content-Length: 308 counts …', 'Content-Length: 308 đếm …'], ['bytes of the body only — Vietnamese letters take more than one byte', 'characters of the whole response including headers', 'the number of labs in the list', 'milliseconds the server took'], ['It is the body size in bytes (curl confirms “308 bytes data”). In UTF-8 “ò” is 2 bytes, so bytes ≠ characters.', 'Đó là kích thước body tính bằng byte (curl xác nhận "308 bytes data"). Trong UTF-8 "ò" chiếm 2 byte, nên byte ≠ ký tự.']),
    q('c5', ['curl connected to ::1 first, not 127.0.0.1. Is something wrong?', 'curl kết nối tới ::1 trước chứ không phải 127.0.0.1. Có gì sai không?'], ['No — localhost resolves to both; ::1 is the IPv6 loopback, same machine', 'Yes — the server is listening on the wrong network card', 'Yes — IPv6 is not allowed for HTTP/1.1', 'No — ::1 is the router of the local network'], ['Both addresses mean “this machine”. curl tries IPv6 first when it is available.', 'Cả hai địa chỉ đều nghĩa là "chính máy này". curl thử IPv6 trước khi có thể.']),
  ],
  goiY: [['Read top to bottom: connect, request, empty line, response, empty line, body.', 'Đọc từ trên xuống: kết nối, request, dòng trống, response, dòng trống, body.'], ['Look at the first character of every line.', 'Nhìn ký tự đầu tiên của mỗi dòng.']],
  loi: [['Thinking the full URL is sent on the first line.', 'Nghĩ cả URL được gửi trên dòng đầu.'], ['Reading Content-Length as a number of characters.', 'Đọc Content-Length thành số ký tự.']],
  tns: [tn('request line', 'dòng yêu cầu', 'METHOD target HTTP/version.'), tn('status line', 'dòng trạng thái'), tn('loopback', 'địa chỉ vòng lặp', '127.0.0.1 / ::1 — chính máy mình.')],
  kn: ['curl -v', 'HTTP message'],
});

/* ── 2. Tự viết: parseStatusLine ── */
function parseStatusLine(line) {
  var m = /^HTTP\/(\d(?:\.\d)?) (\d{3})(?: (.*))?$/.exec(String(line).trim());
  if (!m) return null;
  return { version: m[1], status: Number(m[2]), reason: m[3] || '' };
}
const H2 = jsBai({
  ten: 'HTTP 2 — Write parseStatusLine(line)', kho: 'EASY', phut: 10,
  en: `<p>The first line of every response is the status line, e.g. <code>HTTP/1.1 404 Not Found</code>. Write <code>parseStatusLine(line)</code> ⇒ <code>{ version, status, reason }</code>:</p><ul>
<li><code>version</code> — the text after <code>HTTP/</code> (<code>'1.1'</code>, <code>'1.0'</code>, <code>'2'</code>); <code>status</code> — a number with exactly 3 digits.</li>
<li><code>reason</code> — everything after the code (it may contain spaces), or <code>''</code> when missing: HTTP/2 has no reason phrase, curl prints <code>HTTP/2 200</code>.</li>
<li>Ignore spaces/newline around the line. Anything else (not starting with <code>HTTP/</code>, code not 3 digits) ⇒ <code>null</code>.</li></ul>`,
  vi: `<p>Dòng đầu của mọi response là dòng trạng thái, ví dụ <code>HTTP/1.1 404 Not Found</code>. Viết <code>parseStatusLine(line)</code> ⇒ <code>{ version, status, reason }</code>:</p><ul>
<li><code>version</code> — phần sau <code>HTTP/</code> (<code>'1.1'</code>, <code>'1.0'</code>, <code>'2'</code>); <code>status</code> — một số đúng 3 chữ số.</li>
<li><code>reason</code> — mọi thứ sau mã (có thể chứa dấu cách), hoặc <code>''</code> khi không có: HTTP/2 không có reason phrase, curl in <code>HTTP/2 200</code>.</li>
<li>Bỏ qua dấu cách/xuống dòng quanh dòng. Còn lại (không bắt đầu bằng <code>HTTP/</code>, mã không đủ 3 chữ số) ⇒ <code>null</code>.</li></ul>`,
  dauVao: ['line — one string.', 'line — một chuỗi.'],
  dauRa: ['{ version: string, status: number, reason: string } or null', '{ version: chuỗi, status: số, reason: chuỗi } hoặc null'],
  goiY: [['A regular expression with three groups is the shortest way.', 'Một biểu thức chính quy ba nhóm là cách ngắn nhất.'], ['Make the reason group optional: (?: (.*))?', 'Cho nhóm reason là tuỳ chọn: (?: (.*))?']],
  loi: [['line.split(" ") — “Method Not Allowed” becomes three pieces.', 'line.split(" ") — "Method Not Allowed" thành ba mảnh.'], ['Returning status as the string "404".', 'Trả status dạng chuỗi "404".']],
  gt: ['RFC 9112 §4: status-line = HTTP-version SP status-code SP [reason-phrase]. Clients must not depend on the reason phrase — it is for humans, and HTTP/2 dropped it — so the number is what you branch on.', 'RFC 9112 §4: status-line = HTTP-version SP status-code SP [reason-phrase]. Client không được phụ thuộc vào reason phrase — nó dành cho người đọc, và HTTP/2 đã bỏ nó — nên thứ để rẽ nhánh là con số.'],
  kn: ['status line'],
  tns: [tn('reason phrase', 'cụm lý do', 'Chữ sau mã, chỉ để người đọc.')],
  dau: `/** "HTTP/1.1 404 Not Found" ⇒ { version: '1.1', status: 404, reason: 'Not Found' } | null */
function parseStatusLine(line) {
  // Write your solution here
  var parts = line.split(' ');
  return { version: parts[0].slice(5), status: Number(parts[1]), reason: parts[2] };
}
`,
  giai: '// Reference solution\n' + nguon(parseStatusLine),
  cases: [
    { goi: goi('parseStatusLine', 'HTTP/1.1 200 OK') },
    { goi: goi('parseStatusLine', 'HTTP/1.1 405 Method Not Allowed') },
    { goi: goi('parseStatusLine', 'HTTP/2 200') },
    { goi: goi('parseStatusLine', 'HTTP/1.1 422 Unprocessable Entity\r\n'), an: true },
    { goi: goi('parseStatusLine', 'HTTP/1.0 404 Not Found'), an: true },
    { goi: goi('parseStatusLine', 'HTTP/1.1 20 OK'), an: true },
    { goi: goi('parseStatusLine', 'Content-Type: application/json'), an: true },
    { goi: goi('parseStatusLine', 'HTTP/1.1 201 Created'), an: true },
  ],
});

/* ── 3. Tự viết: parseHeaders ── */
function parseHeaders(text) {
  var out = {};
  var lines = String(text).split(/\r?\n/);
  for (var i = 1; i < lines.length; i++) {        // line 0 is the status line
    var line = lines[i];
    if (line.trim() === '') break;                // empty line = end of headers
    var k = line.indexOf(':');
    if (k < 1) continue;
    var name = line.slice(0, k).trim().toLowerCase(); // header names are case-insensitive
    var value = line.slice(k + 1).trim();
    out[name] = name in out ? out[name] + ', ' + value : value;
  }
  return out;
}
const H3 = jsBai({
  ten: 'HTTP 3 — Write parseHeaders(text) from a real curl -i', kho: 'MEDIUM', phut: 15,
  en: `<p>Write <code>parseHeaders(text)</code> that takes the output of <code>curl -i</code> (status line, headers, empty line, body) and returns the headers as an object:</p><ul>
<li>Skip the first line (the status line). Stop at the first empty line — the body is not headers, even if it contains a colon.</li>
<li>Names are <b>case-insensitive</b> (RFC 9110 §5.1) ⇒ store them lower-case. Values: trimmed; only the FIRST colon separates name and value (<code>Date: Sat, 31 Oct 2026 17:22:36 GMT</code>).</li>
<li>A header repeated on several lines ⇒ join the values with <code>', '</code>. Lines may end with <code>\\r\\n</code>.</li></ul>Real response from LabFlow:${pre(R405)}`,
  vi: `<p>Viết <code>parseHeaders(text)</code> nhận output của <code>curl -i</code> (dòng trạng thái, header, dòng trống, body) và trả các header thành object:</p><ul>
<li>Bỏ dòng đầu (dòng trạng thái). Dừng ở dòng trống đầu tiên — body không phải header, dù có chứa dấu hai chấm.</li>
<li>Tên header <b>không phân biệt hoa thường</b> (RFC 9110 §5.1) ⇒ lưu chữ thường. Giá trị: cắt khoảng trắng; chỉ dấu hai chấm ĐẦU TIÊN tách tên và giá trị (<code>Date: Sat, 31 Oct 2026 17:22:36 GMT</code>).</li>
<li>Header lặp trên nhiều dòng ⇒ nối giá trị bằng <code>', '</code>. Dòng có thể kết thúc bằng <code>\\r\\n</code>.</li></ul>Response thật từ LabFlow:${pre(R405)}`,
  dauVao: ['text — a full curl -i output.', 'text — nguyên output của curl -i.'],
  dauRa: ['{ [lower-case name]: value }', '{ [tên chữ thường]: giá trị }'],
  goiY: [['split(/\\r?\\n/) handles both line endings.', 'split(/\\r?\\n/) xử lý cả hai kiểu xuống dòng.'], ['indexOf(":") finds the first colon; slice around it.', 'indexOf(":") tìm dấu hai chấm đầu; cắt hai bên nó.']],
  loi: [['line.split(":") — the Date and ETag values lose their pieces.', 'line.split(":") — giá trị Date và ETag mất mảnh.'], ['Reading the JSON body lines ("error": …) as headers.', 'Đọc các dòng JSON của body ("error": …) thành header.']],
  gt: ['An HTTP/1.1 message is start-line, header lines, CRLF, body (RFC 9112 §2.1). Lower-casing names is what Node does too (req.headers keys are lower-case), and combining repeated fields with “, ” is allowed by RFC 9110 §5.3 for list-valued headers.', 'Một thông điệp HTTP/1.1 là dòng đầu, các dòng header, CRLF, body (RFC 9112 §2.1). Node cũng hạ chữ thường tên header (khoá của req.headers là chữ thường), và gộp header lặp bằng ", " được RFC 9110 §5.3 cho phép với header dạng danh sách.'],
  kn: ['headers'],
  tns: [tn('header field', 'trường header'), tn('case-insensitive', 'không phân biệt hoa thường')],
  dau: `/** curl -i output ⇒ { name: value } (names lower-case) */
function parseHeaders(text) {
  // Write your solution here
  var out = {};
  text.split('\\n').forEach(function (line) {
    var p = line.split(':');
    if (p.length > 1) out[p[0]] = p[1].trim();
  });
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(parseHeaders),
  cases: [
    { goi: goi('parseHeaders', R405), moTa: ['Real 405 from LabFlow', '405 thật từ LabFlow'] },
    { goi: goi('parseHeaders', 'HTTP/1.1 204 No Content\nAllow: GET, HEAD, POST\n\n') },
    { goi: goi('parseHeaders', R404), an: true },
    { goi: goi('parseHeaders', R404.replace(/\n/g, '\r\n')), an: true },
    { goi: goi('parseHeaders', 'HTTP/1.1 200 OK\nVary: Accept\nCACHE-CONTROL: no-store\nvary: Accept-Language\n\n{"a": "b: c"}'), an: true },
    { goi: goi('parseHeaders', 'HTTP/1.1 201 Created\nLocation: /bookings/bk_1\nContent-Type: application/json; charset=utf-8\n\n{\n  "id": "bk_1"\n}'), an: true },
  ],
});

/* ── 4. Tự viết: parseTarget ── */
function parseTarget(target) {
  var q = target.indexOf('?');
  var path = q < 0 ? target : target.slice(0, q);
  var query = {};
  if (q >= 0) {
    target.slice(q + 1).split('&').forEach(function (pair) {
      if (!pair) return;
      var e = pair.indexOf('=');
      var dec = function (s) { return decodeURIComponent(s.replace(/\+/g, ' ')); };
      var k = dec(e < 0 ? pair : pair.slice(0, e));
      var v = e < 0 ? '' : dec(pair.slice(e + 1));
      if (!(k in query)) query[k] = v;
      else if (Array.isArray(query[k])) query[k].push(v);
      else query[k] = [query[k], v];
    });
  }
  return { path: path, query: query };
}
const H4 = jsBai({
  ten: 'HTTP 4 — Write parseTarget(target): path and query', kho: 'MEDIUM', phut: 15,
  en: `<p>The request line carries a <b>target</b> such as <code>/labs?building=Alpha&amp;minCapacity=25</code>. The path names the resource; the query carries options. Write <code>parseTarget(target)</code> ⇒ <code>{ path, query }</code>:</p><ul>
<li>Split at the first <code>?</code>. Pairs are joined by <code>&amp;</code>; key and value split at the first <code>=</code>; a key without <code>=</code> gets <code>''</code>; skip empty pairs.</li>
<li>Decode both key and value: <code>+</code> means space, then <code>decodeURIComponent</code> (<code>%C3%B2</code> ⇒ <code>ò</code>).</li>
<li>Every value stays a <b>string</b> — HTTP has no numbers in a query. A key that appears again ⇒ an array of its values in order.</li></ul>`,
  vi: `<p>Dòng request chở một <b>đích</b> như <code>/labs?building=Alpha&amp;minCapacity=25</code>. Path gọi tên tài nguyên; query chở tuỳ chọn. Viết <code>parseTarget(target)</code> ⇒ <code>{ path, query }</code>:</p><ul>
<li>Tách ở dấu <code>?</code> đầu tiên. Các cặp nối bằng <code>&amp;</code>; khoá và giá trị tách ở dấu <code>=</code> đầu; khoá không có <code>=</code> nhận <code>''</code>; bỏ cặp rỗng.</li>
<li>Giải mã cả khoá lẫn giá trị: <code>+</code> nghĩa là dấu cách, rồi <code>decodeURIComponent</code> (<code>%C3%B2</code> ⇒ <code>ò</code>).</li>
<li>Mọi giá trị giữ là <b>chuỗi</b> — query của HTTP không có kiểu số. Khoá xuất hiện lại ⇒ mảng các giá trị theo thứ tự.</li></ul>`,
  dauVao: ['target — the path and optional query, as on the request line.', 'target — path và query tuỳ chọn, như trên dòng request.'],
  dauRa: ['{ path: string, query: { key: string | string[] } }', '{ path: chuỗi, query: { khoá: chuỗi | mảng chuỗi } }'],
  goiY: [['indexOf("?") then split("&"), then indexOf("=") per pair.', 'indexOf("?") rồi split("&"), rồi indexOf("=") cho từng cặp.'], ['Replace + before decoding, not after: %2B must stay a real plus.', 'Đổi + trước khi giải mã, không phải sau: %2B phải còn là dấu cộng thật.']],
  loi: [['Converting "25" to a number — the API decides types when it validates (Chapter 2).', 'Đổi "25" sang số — API mới quyết định kiểu khi kiểm dữ liệu (Chương 2).'], ['Keeping only the last value of a repeated key.', 'Chỉ giữ giá trị cuối của khoá lặp.']],
  gt: ['This is exactly what Express’ query parser hands you in req.query: strings, and arrays for repeated keys. Knowing that is why LabFlow validates minCapacity itself instead of trusting it to be a number.', 'Đây chính là thứ bộ phân tích query của Express trao cho bạn trong req.query: chuỗi, và mảng cho khoá lặp. Biết vậy nên LabFlow tự kiểm minCapacity thay vì tin nó là số.'],
  kn: ['URL', 'query string'],
  tns: [tn('query string', 'chuỗi truy vấn'), tn('percent-encoding', 'mã hoá phần trăm', '%C3%B2 = byte UTF-8 của "ò".')],
  dau: `/** "/labs?building=Alpha" ⇒ { path: '/labs', query: { building: 'Alpha' } } */
function parseTarget(target) {
  // Write your solution here
  var parts = target.split('?');
  var query = {};
  (parts[1] || '').split('&').forEach(function (p) { var kv = p.split('='); query[kv[0]] = kv[1]; });
  return { path: parts[0], query: query };
}
`,
  giai: '// Reference solution\n' + nguon(parseTarget),
  cases: [
    { goi: goi('parseTarget', '/labs?building=Alpha') },
    { goi: goi('parseTarget', '/labs/lab_1') },
    { goi: goi('parseTarget', '/labs?building=Alpha&minCapacity=25&sort=-capacity') },
    { goi: goi('parseTarget', '/search?q=Ph%C3%B2ng+Lab+IoT'), an: true },
    { goi: goi('parseTarget', '/devices?status=AVAILABLE&status=IN_USE&status=BROKEN'), an: true },
    { goi: goi('parseTarget', '/labs?debug&&page=2'), an: true },
    { goi: goi('parseTarget', '/calc?expr=1%2B1%3D2'), an: true },
  ],
});

export default doiDau({ slug: 'api-0-1-http', ten: '0.1 HTTP you actually need', khoa: KHOA, baiHoc: 'api-0-1-http', de: [H1, H2, H3, H4] });
