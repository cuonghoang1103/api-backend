/** Bộ luyện bài 6.1 — Request và response. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Đọc dòng request / dòng trạng thái, gom header, tách URL, dựng request thô, đọc cả một thông điệp HTTP (kể cả chunked). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 6.1 — Request và response.</em> Mỗi bài là một mảnh của việc trình duyệt, curl và máy chủ Node làm với chữ HTTP thô — bạn tự viết lại để không còn thấy nó bí ẩn.</p>';

export default doiDau({
  slug: 'wf-6-1-request-response',
  ten: '6.1 Request và response',
  baiHoc: 'Nền tảng Web — Bài 6.1 Request and response',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Đọc dòng request và dòng trạng thái, gom header không phân biệt hoa thường, tách các phần của URL, dựng một request thô có Content-Length, đọc trọn một thông điệp HTTP kể cả phần thân chunked — 6 bài.',
  de: [
    {
      tieuDe: 'Đọc dòng request',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['dòng request', 'method', 'phiên bản HTTP'], tienQuyet: ['chuỗi', 'split'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('parseRequestLine(line)')} nhận dòng đầu tiên của một request, ví dụ ${c('GET /api/products/3 HTTP/1.1')}, và trả ${c('{ method, path, version }')}. Dòng hợp lệ có ĐÚNG ba phần cách nhau bởi một dấu cách, và phần thứ ba bắt đầu bằng ${c('HTTP/')}. Không hợp lệ ⇒ trả ${c('null')}.</p>`,
      yeuCau: ['Tách thành đúng 3 phần.', 'Phần thứ ba bắt đầu bằng "HTTP/".', 'Không hợp lệ ⇒ null.'],
      dauVao: 'line: string.', dauRa: '{ method, path, version } hoặc null.',
      rangBuoc: ['Giữ nguyên chữ hoa thường của method và path.'],
      viDu: [{ input: 'parseRequestLine("GET /api/products/3 HTTP/1.1")', output: '{ method: "GET", path: "/api/products/3", version: "HTTP/1.1" }', explanation: 'Ba phần: method, đường dẫn, phiên bản.' }],
      goiY: ['const parts = line.split(" ");', 'if (parts.length !== 3 || !parts[2].startsWith("HTTP/")) return null;'],
      khoiDau: { 'main.js': `// Bài 6.1 — đọc dòng request
function parseRequestLine(line) {
  return null;
}
` },
      loiGiai: { 'main.js': `// Bài 6.1 — dòng request = method, đường dẫn, phiên bản
function parseRequestLine(line) {
  const parts = line.split(' ');
  if (parts.length !== 3 || !parts[2].startsWith('HTTP/')) return null;   // sai hình dạng
  const [method, path, version] = parts;
  return { method, path, version };
}
` },
      giaiThich: `<p>Máy chủ Node làm đúng việc này trước khi trao cho bạn ${c('req.method')} và ${c('req.url')}. Dấu cách là ký tự phân cách nên đường dẫn không bao giờ chứa dấu cách trần — đó là lý do URL phải được mã hoá (Bài 6.5).</p>`,
      loiHayGap: ['Không kiểm số phần — "GET /a b HTTP/1.1" lọt qua với path sai.', 'Quên kiểm "HTTP/" — một dòng rác ba từ cũng thành request.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages#http_requests',
      kiem: [
        { moTa: 'A normal GET|||Một GET bình thường', goi: 'parseRequestLine("GET /api/products/3 HTTP/1.1")', mongDoi: { method: 'GET', path: '/api/products/3', version: 'HTTP/1.1' } },
        { moTa: 'POST with a query string|||POST có query string', goi: 'parseRequestLine("POST /api/products?notify=false HTTP/2")', mongDoi: { method: 'POST', path: '/api/products?notify=false', version: 'HTTP/2' } },
        { moTa: 'A space inside the path is invalid|||Dấu cách trong đường dẫn là sai', goi: 'parseRequestLine("GET /desk lamp HTTP/1.1")', mongDoi: null },
        { moTa: 'Third part must start with HTTP/|||Phần thứ ba phải bắt đầu bằng HTTP/', goi: '[parseRequestLine("GET / FTP/1.0"), parseRequestLine("hello world")]', mongDoi: [null, null] },
      ],
    },
    {
      tieuDe: 'Đọc dòng trạng thái',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['dòng trạng thái', 'mã trạng thái', 'cụm lý do'], tienQuyet: ['indexOf', 'Number'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('parseStatusLine(line)')} cho dòng đầu của response, ví dụ ${c('HTTP/1.1 404 Not Found')}. Trả ${c('{ version, status, reason }')}: ${c('status')} là SỐ, ${c('reason')} là phần còn lại (có thể có dấu cách, có thể rỗng — HTTP/2 không gửi nó). Mã phải là đúng 3 chữ số; sai ⇒ ${c('null')}.</p>`,
      yeuCau: ['status là number.', 'reason giữ nguyên dấu cách bên trong, rỗng nếu không có.', 'Mã không phải 3 chữ số ⇒ null.'],
      dauVao: 'line: string.', dauRa: '{ version, status, reason } hoặc null.',
      rangBuoc: ['Chỉ tách ở hai dấu cách đầu tiên.'],
      viDu: [{ input: 'parseStatusLine("HTTP/1.1 422 Unprocessable Entity")', output: '{ version: "HTTP/1.1", status: 422, reason: "Unprocessable Entity" }', explanation: 'reason có dấu cách — không được cắt.' }],
      goiY: ['const [version, code, ...rest] = line.split(" ");', '/^\\d{3}$/.test(code) kiểm đúng ba chữ số.'],
      khoiDau: { 'main.js': `// Bài 6.1 — đọc dòng trạng thái
function parseStatusLine(line) {
  const parts = line.split(' ');
  return { version: parts[0], status: parts[1], reason: parts[2] };
}
` },
      loiGiai: { 'main.js': `// Bài 6.1 — dòng trạng thái = phiên bản, mã ba chữ số, lý do (có thể rỗng)
function parseStatusLine(line) {
  const [version, code, ...rest] = line.split(' ');
  if (!version || !version.startsWith('HTTP/') || !/^\\d{3}$/.test(code ?? '')) return null;
  return { version, status: Number(code), reason: rest.join(' ') };
}
` },
      giaiThich: `<p>Chương trình chỉ nhìn con số; cụm lý do dành cho người đọc nên có thể khác nhau giữa các máy chủ ("Unprocessable Entity" hay "Unprocessable Content") hoặc vắng hẳn. Gom phần còn lại bằng ${c('...rest')} rồi ${c('join(" ")')} giữ nguyên các dấu cách.</p>`,
      loiHayGap: ['Lấy parts[2] — "Not Found" chỉ còn "Not".', 'Để status là chuỗi "404" — so sánh status === 404 sai.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages#http_responses',
      kiem: [
        { moTa: 'Reason with spaces|||Lý do có dấu cách', goi: 'parseStatusLine("HTTP/1.1 404 Not Found")', mongDoi: { version: 'HTTP/1.1', status: 404, reason: 'Not Found' } },
        { moTa: 'No reason phrase (HTTP/2 style)|||Không có cụm lý do (kiểu HTTP/2)', goi: 'parseStatusLine("HTTP/2 204")', mongDoi: { version: 'HTTP/2', status: 204, reason: '' } },
        { moTa: 'status is a number|||status là số', goi: 'typeof parseStatusLine("HTTP/1.1 200 OK").status', mongDoi: 'number' },
        { moTa: 'Invalid codes give null|||Mã sai trả null', goi: '[parseStatusLine("HTTP/1.1 20 OK"), parseStatusLine("HTTP/1.1 abc OK"), parseStatusLine("200 OK")]', mongDoi: [null, null, null] },
      ],
    },
    {
      tieuDe: 'Gom header',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['header', 'không phân biệt hoa thường', 'header lặp'], tienQuyet: ['object', 'indexOf'], the: ['javascript', 'http', 'header'],
      moTa: `${BAI}<p>Viết ${c('parseHeaders(lines)')} nhận mảng các dòng header và trả một object: tên header viết THƯỜNG (như ${c('req.headers')} của Node), giá trị đã trim. Tách ở dấu ${c(':')} ĐẦU TIÊN (giá trị như ${c('localhost:3456')} có dấu hai chấm). Dòng không có ${c(':')} bị bỏ qua. Cùng một tên xuất hiện nhiều lần ⇒ nối các giá trị bằng ${c(', ')}.</p>`,
      yeuCau: ['Tên viết thường, giá trị trim.', 'Tách ở dấu hai chấm đầu tiên.', 'Tên lặp ⇒ nối bằng ", ".', 'Bỏ dòng không có dấu hai chấm.'],
      dauVao: 'lines: string[].', dauRa: 'object { tên: giá trị }.',
      rangBuoc: ['Không cần xử lý Set-Cookie riêng.'],
      viDu: [{ input: 'parseHeaders(["Host: localhost:3456", "Accept: */*"])', output: '{ host: "localhost:3456", accept: "*/*" }', explanation: 'Dấu hai chấm thứ hai thuộc về giá trị.' }],
      goiY: ['const i = line.indexOf(":"); if (i < 0) continue;', 'out[name] = name in out ? out[name] + ", " + value : value;'],
      khoiDau: { 'main.js': `// Bài 6.1 — gom header
function parseHeaders(lines) {
  const out = {};
  for (const line of lines) {
    const [name, value] = line.split(':');
    out[name] = value;
  }
  return out;
}
` },
      loiGiai: { 'main.js': `// Bài 6.1 — header: tên thường, tách ở dấu ":" đầu, tên lặp thì nối
function parseHeaders(lines) {
  const out = {};
  for (const line of lines) {
    const i = line.indexOf(':');
    if (i < 0) continue;                                   // không phải dòng header
    const name = line.slice(0, i).trim().toLowerCase();    // Content-Type = content-type
    const value = line.slice(i + 1).trim();
    out[name] = name in out ? out[name] + ', ' + value : value;
  }
  return out;
}
` },
      giaiThich: `<p>Tên header không phân biệt hoa thường, nên chuẩn hoá về chữ thường là cách duy nhất để tra cứu chắc chắn — HTTP/2 vốn đã gửi chữ thường. Nối bằng ${c(', ')} là quy tắc của đặc tả cho header lặp (trừ Set-Cookie, thứ Node giữ thành mảng).</p>`,
      loiHayGap: ['split(":") — "localhost:3456" mất phần cổng.', 'Giữ nguyên hoa thường — headers["content-type"] trả undefined.'],
      thamKhao: 'https://nodejs.org/api/http.html#messageheaders',
      kiem: [
        { moTa: 'Lower-case names, colon inside the value|||Tên chữ thường, dấu hai chấm trong giá trị', goi: 'parseHeaders(["Host: localhost:3456", "Content-Type: application/json; charset=utf-8"])', mongDoi: { host: 'localhost:3456', 'content-type': 'application/json; charset=utf-8' } },
        { moTa: 'Repeated header is joined|||Header lặp được nối', goi: 'parseHeaders(["Accept: text/html", "accept: application/json"])', mongDoi: { accept: 'text/html, application/json' } },
        { moTa: 'Lines without a colon are skipped; values trimmed|||Bỏ dòng không có dấu hai chấm; giá trị được trim', goi: 'parseHeaders(["garbage", "  X-Request-Id :   abc-1  ", ""])', mongDoi: { 'x-request-id': 'abc-1' } },
      ],
    },
    {
      tieuDe: 'Tách các phần của URL',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['URL', 'origin', 'query', 'fragment'], tienQuyet: ['new URL', 'object'], the: ['javascript', 'url'],
      moTa: `${BAI}<p>Viết ${c('urlParts(href)')} trả ${c('{ origin, path, query, hash, sentToServer }')}: ${c('query')} là object tên → giá trị (đã giải mã; tên lặp ⇒ giữ giá trị CUỐI), ${c('hash')} là phần sau ${c('#')} KHÔNG kèm dấu ${c('#')} (rỗng nếu không có), ${c('sentToServer')} là đúng chuỗi trình duyệt đặt trên dòng request: đường dẫn + query, không có fragment. URL không hợp lệ ⇒ ${c('null')}.</p>`,
      yeuCau: ['Dùng new URL; bắt lỗi URL sai.', 'query giải mã (+ thành dấu cách).', 'hash không kèm #.', 'sentToServer không bao giờ chứa #.'],
      dauVao: 'href: string (URL tuyệt đối).', dauRa: 'object hoặc null.',
      rangBuoc: ['Không tự tách chuỗi bằng tay.'],
      viDu: [{ input: 'urlParts("https://shop.example:8443/api/products/3?sort=price#reviews")', output: '{ origin: "https://shop.example:8443", path: "/api/products/3", query: { sort: "price" }, hash: "reviews", sentToServer: "/api/products/3?sort=price" }', explanation: 'Fragment ở lại trình duyệt.' }],
      goiY: ['try { const u = new URL(href); … } catch { return null; }', 'Object.fromEntries(u.searchParams) giữ giá trị cuối với tên lặp.'],
      khoiDau: { 'main.js': `// Bài 6.1 — các phần của URL
function urlParts(href) {
  const u = new URL(href);
  return { origin: u.origin, path: u.pathname, query: u.search, hash: u.hash, sentToServer: href };
}
` },
      loiGiai: { 'main.js': `// Bài 6.1 — URL: origin, đường dẫn, query (object), fragment, thứ thật sự gửi đi
function urlParts(href) {
  let u;
  try { u = new URL(href); } catch { return null; }      // URL sai ⇒ new URL ném TypeError
  return {
    origin: u.origin,
    path: u.pathname,
    query: Object.fromEntries(u.searchParams),            // đã giải mã; tên lặp ⇒ giá trị cuối
    hash: u.hash.slice(1),
    sentToServer: u.pathname + u.search,                  // fragment không bao giờ rời trình duyệt
  };
}
` },
      giaiThich: `<p>${c('new URL')} làm hết việc khó: cổng mặc định bị ẩn khỏi origin, query được giải mã, URL sai thì ném lỗi. Điều cần nhớ: ${c('#…')} không bao giờ lên máy chủ — muốn máy chủ biết thì phải đặt nó vào đường dẫn hoặc query.</p>`,
      loiHayGap: ['Trả u.search (chuỗi) thay vì object.', 'Gửi cả href lên dòng request — lộ fragment và có cả origin.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/URL',
      kiem: [
        { moTa: 'All parts of the lesson URL|||Mọi phần của URL trong bài', goi: 'urlParts("https://shop.example:8443/api/products/3?sort=price&page=2#reviews")', mongDoi: { origin: 'https://shop.example:8443', path: '/api/products/3', query: { sort: 'price', page: '2' }, hash: 'reviews', sentToServer: '/api/products/3?sort=price&page=2' } },
        { moTa: 'Default port hidden, query decoded|||Cổng mặc định bị ẩn, query được giải mã', goi: 'urlParts("https://shop.example:443/search?q=desk+lamp&q=b%C3%BAt")', mongDoi: { origin: 'https://shop.example', path: '/search', query: { q: 'bút' }, hash: '', sentToServer: '/search?q=desk+lamp&q=b%C3%BAt' } },
        { moTa: 'Invalid URL gives null|||URL sai trả null', goi: '[urlParts("not a url"), urlParts("/relative/only")]', mongDoi: [null, null] },
      ],
    },
    {
      tieuDe: 'Dựng một request thô',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['CRLF', 'Content-Length', 'dòng trống'], tienQuyet: ['chuỗi', 'Object.entries'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('buildRequest({ method, path, host, headers, body })')} trả chuỗi request HTTP/1.1 đúng như ${c('raw.mjs')} gửi: dòng request; ${c('Host')} là header ĐẦU TIÊN; rồi các header trong ${c('headers')} theo thứ tự; nếu có ${c('body')} thì thêm ${c('Content-Length')} (số ký tự — đề chỉ dùng ASCII) làm header CUỐI; rồi một dòng trống; rồi body. Mọi xuống dòng là ${c('\\r\\n')}. ${c('method')} mặc định ${c('GET')}, ${c('headers')} mặc định rỗng.</p>`,
      yeuCau: ['Xuống dòng bằng \\r\\n.', 'Host đứng đầu, Content-Length đứng cuối (chỉ khi có body).', 'Luôn có dòng trống sau header.'],
      dauVao: 'object { method?, path, host, headers?, body? }.', dauRa: 'string.',
      rangBuoc: ['Không thêm header nào khác.'],
      viDu: [{ input: 'buildRequest({ path: "/api/products/3", host: "localhost:3456" })', output: '"GET /api/products/3 HTTP/1.1\\r\\nHost: localhost:3456\\r\\n\\r\\n"', explanation: 'Không body ⇒ kết thúc bằng dòng trống.' }],
      goiY: ['const lines = [´@{method} @{path} HTTP/1.1´, ´Host: @{host}´];', 'return lines.join("\\r\\n") + "\\r\\n\\r\\n" + (body ?? "");'],
      khoiDau: { 'main.js': `// Bài 6.1 — dựng request thô
function buildRequest({ method = 'GET', path, host, headers = {}, body }) {
  return method + ' ' + path + '\\n' + 'Host: ' + host + '\\n' + (body ?? '');
}
` },
      loiGiai: { 'main.js': `// Bài 6.1 — request = dòng request, header (Host đầu), dòng trống, phần thân
function buildRequest({ method = 'GET', path, host, headers = {}, body }) {
  const lines = [´@{method} @{path} HTTP/1.1´, ´Host: @{host}´];
  for (const [name, value] of Object.entries(headers)) lines.push(´@{name}: @{value}´);
  if (body !== undefined) lines.push(´Content-Length: @{body.length}´);   // máy chủ cần biết phần thân dài bao nhiêu
  return lines.join('\\r\\n') + '\\r\\n\\r\\n' + (body ?? '');               // dòng trống kết thúc phần header
}
` },
      giaiThich: `<p>Thiếu dòng trống thì máy chủ cứ chờ thêm header; thiếu ${c('Content-Length')} thì nó không biết phần thân kết thúc ở đâu. Với chữ ngoài ASCII, độ dài phải tính bằng BYTE (${c('Buffer.byteLength')} trong Node) — "bút" là 3 ký tự nhưng 4 byte.</p>`,
      loiHayGap: ['Dùng "\\n" thay "\\r\\n" — nhiều máy chủ vẫn nhận, nhưng sai chuẩn.', 'Quên dòng trống khi không có body.'],
      thamKhao: 'https://www.rfc-editor.org/rfc/rfc9112#name-message-format',
      kiem: [
        { moTa: 'GET without a body|||GET không có phần thân', goi: 'buildRequest({ path: "/api/products/3", host: "localhost:3456" })', mongDoi: 'GET /api/products/3 HTTP/1.1\r\nHost: localhost:3456\r\n\r\n' },
        { moTa: 'POST: headers in order, Content-Length last|||POST: header đúng thứ tự, Content-Length cuối', goi: 'buildRequest({ method: "POST", path: "/api/products", host: "localhost:3456", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: "{\\"name\\":\\"Tape\\"}" })', mongDoi: 'POST /api/products HTTP/1.1\r\nHost: localhost:3456\r\nContent-Type: application/json\r\nAccept: application/json\r\nContent-Length: 15\r\n\r\n{"name":"Tape"}' },
        { moTa: 'An empty body still gets Content-Length: 0|||Phần thân rỗng vẫn có Content-Length: 0', goi: 'buildRequest({ method: "DELETE", path: "/api/products/7", host: "h", body: "" }).endsWith("Content-Length: 0\\r\\n\\r\\n")', mongDoi: true },
      ],
    },
    {
      tieuDe: 'Đọc trọn một thông điệp HTTP',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['thông điệp HTTP', 'chunked encoding', 'hệ mười sáu'], tienQuyet: ['indexOf', 'parseInt'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('parseMessage(raw)')} cho một request HOẶC response HTTP/1.1 thô (xuống dòng ${c('\\r\\n')}). Trả ${c('{ startLine, headers, body }')}: ${c('headers')} như bài "Gom header" (tên thường, nối tên lặp — viết lại trong hàm này); ${c('body')} là mọi thứ sau dòng trống đầu tiên. Không có dòng trống ⇒ ${c('null')} (thông điệp chưa đủ). Nếu header ${c('transfer-encoding')} là ${c('chunked')}, giải mã phần thân: lặp "kích thước hệ 16 + \\r\\n + dữ liệu + \\r\\n" cho tới khúc kích thước 0 — giống output của raw.mjs trong bài.</p>`,
      yeuCau: ['Tách ở "\\r\\n\\r\\n" đầu tiên.', 'Header tên thường, giá trị trim, tên lặp nối ", ".', 'Giải mã chunked.', 'Thiếu dòng trống ⇒ null.'],
      dauVao: 'raw: string.', dauRa: '{ startLine, headers, body } hoặc null.',
      rangBuoc: ['Một hàm tự đủ.', 'Phần thân chỉ có ASCII (độ dài khúc = số ký tự).'],
      viDu: [{ input: 'response chunked "36\\r\\n{…54 ký tự…}\\r\\n0\\r\\n\\r\\n"', output: 'body = "{…54 ký tự…}"', explanation: '0x36 = 54.' }],
      goiY: ['const end = raw.indexOf("\\r\\n\\r\\n"); if (end < 0) return null;', 'Chunked: const size = parseInt(rest.slice(0, i), 16); body += rest.slice(i + 2, i + 2 + size); rest = rest.slice(i + 2 + size + 2);'],
      khoiDau: { 'main.js': `// Bài 6.1 — đọc trọn một thông điệp HTTP
function parseMessage(raw) {
  const [head, body] = raw.split('\\r\\n\\r\\n');
  const [startLine, ...headerLines] = head.split('\\r\\n');
  return { startLine, headers: {}, body };
}
` },
      loiGiai: { 'main.js': `// Bài 6.1 — dòng đầu, header, dòng trống, phần thân (giải mã chunked nếu có)
function parseMessage(raw) {
  const end = raw.indexOf('\\r\\n\\r\\n');
  if (end < 0) return null;                                   // chưa thấy dòng trống ⇒ chưa đủ
  const [startLine, ...lines] = raw.slice(0, end).split('\\r\\n');
  const headers = {};
  for (const line of lines) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const name = line.slice(0, i).trim().toLowerCase();
    const value = line.slice(i + 1).trim();
    headers[name] = name in headers ? headers[name] + ', ' + value : value;
  }
  let body = raw.slice(end + 4);                              // phần thân có thể chứa "\\r\\n\\r\\n" — chỉ tách ở chỗ đầu
  if ((headers['transfer-encoding'] ?? '').toLowerCase() === 'chunked') {
    let rest = body;
    body = '';
    while (true) {
      const i = rest.indexOf('\\r\\n');
      const size = parseInt(rest.slice(0, i), 16);           // kích thước ở hệ mười sáu
      if (!size) break;                                       // khúc 0 = hết
      body += rest.slice(i + 2, i + 2 + size);
      rest = rest.slice(i + 2 + size + 2);                    // bỏ dữ liệu và \\r\\n theo sau
    }
  }
  return { startLine, headers, body };
}
` },
      giaiThich: `<p>Đây là việc của bộ phân tích HTTP bên trong Node, trình duyệt và curl. Chunked tồn tại vì máy chủ thường bắt đầu gửi trước khi biết tổng độ dài (dữ liệu sinh dần); mỗi khúc tự báo kích thước của mình. Tách bằng ${c('split')} là sai vì phần thân (JSON, HTML) có thể chứa chính chuỗi ${c('\\r\\n\\r\\n')}.</p>`,
      loiHayGap: ['raw.split("\\r\\n\\r\\n") — phần thân bị cắt nếu nó chứa dòng trống.', 'parseInt(size) không có cơ số 16 — "36" thành 36 thay vì 54.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding',
      kiem: [
        { moTa: 'The raw.mjs response (chunked)|||Response của raw.mjs (chunked)', goi: 'parseMessage("HTTP/1.1 200 OK\\r\\nContent-Type: application/json; charset=utf-8\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n36\\r\\n{\\"id\\":3,\\"name\\":\\"Pen\\",\\"price\\":5000,\\"category\\":\\"office\\"}\\r\\n0\\r\\n\\r\\n")', mongDoi: { startLine: 'HTTP/1.1 200 OK', headers: { 'content-type': 'application/json; charset=utf-8', 'transfer-encoding': 'chunked' }, body: '{"id":3,"name":"Pen","price":5000,"category":"office"}' } },
        { moTa: 'A request with a plain body|||Một request có phần thân thường', goi: 'parseMessage("POST /api/products HTTP/1.1\\r\\nHost: h\\r\\nContent-Length: 15\\r\\n\\r\\n{\\"name\\":\\"Tape\\"}")', mongDoi: { startLine: 'POST /api/products HTTP/1.1', headers: { host: 'h', 'content-length': '15' }, body: '{"name":"Tape"}' } },
        { moTa: 'Two chunks; body may contain a blank line|||Hai khúc; phần thân có thể chứa dòng trống', goi: 'parseMessage("HTTP/1.1 200 OK\\r\\ntransfer-encoding: chunked\\r\\n\\r\\n5\\r\\nhello\\r\\n9\\r\\n\\r\\n\\r\\nworld\\r\\n0\\r\\n\\r\\n").body', mongDoi: 'hello\r\n\r\nworld' },
        { moTa: 'No blank line yet gives null|||Chưa có dòng trống trả null', goi: 'parseMessage("GET / HTTP/1.1\\r\\nHost: h\\r\\n")', mongDoi: null },
      ],
    },
  ],
});
