/** Bộ luyện bài 7.5 — HTTPS và CORS. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Origin, cùng origin, request "đơn giản", header CORS theo danh sách cho phép, trả lời preflight, kiểm chứng chỉ (hạn + tên
 *  có ký tự đại diện), và mô phỏng trình duyệt quyết định trang có được đọc response không. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 7.5 — HTTPS và CORS.</em> Các bài tái hiện những quyết định mà curl, trình duyệt và API của bạn đưa ra trong bài — bằng mã thuần.</p>';

export default doiDau({
  slug: 'wf-7-5-https-cors',
  ten: '7.5 HTTPS và CORS',
  baiHoc: 'Nền tảng Web — Bài 7.5 HTTPS and CORS',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Lấy origin của một URL, so cùng origin, nhận ra request cần preflight, dựng header CORS theo danh sách cho phép (kèm credentials), trả lời preflight, kiểm một chứng chỉ (hạn dùng, tên miền có *), và mô phỏng trình duyệt quyết định trang có đọc được response — 7 bài.',
  de: [
    {
      tieuDe: 'Origin của một URL',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['origin', 'cổng mặc định'], tienQuyet: ['new URL'], the: ['javascript', 'cors'],
      moTa: `${BAI}<p>Viết ${c('originOf(url)')} trả origin (giao thức + host + cổng) của một URL tuyệt đối, đúng như trình duyệt: cổng mặc định bị ẩn (${c('https://a.com:443')} ⇒ ${c('https://a.com')}), host viết thường. URL sai hoặc không phải http/https ⇒ ${c('null')}.</p>`,
      yeuCau: ['Dùng new URL.', 'Chỉ http và https.', 'URL sai ⇒ null.'],
      dauVao: 'url: string.', dauRa: 'string hoặc null.',
      rangBuoc: ['Không tự cắt chuỗi.'],
      viDu: [{ input: 'originOf("http://localhost:3456/api/products?x=1")', output: '"http://localhost:3456"', explanation: 'Đường dẫn và query không thuộc origin.' }],
      goiY: ['try { const u = new URL(url); … } catch { return null; }', 'if (u.protocol !== "http:" && u.protocol !== "https:") return null; return u.origin;'],
      khoiDau: { 'main.js': `// Bài 7.5 — origin của một URL
function originOf(url) {
  return url.split('/').slice(0, 3).join('/');
}
` },
      loiGiai: { 'main.js': `// Bài 7.5 — origin = giao thức + host + cổng (cổng mặc định bị ẩn)
function originOf(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  return u.origin;
}
` },
      giaiThich: `<p>Cắt chuỗi theo ${c('/')} trông đúng cho tới khi gặp ${c('HTTPS://Shop.Example:443')} — trình duyệt coi nó đúng là ${c('https://shop.example')}. Luôn để ${c('URL')} chuẩn hoá trước khi so origin.</p>`,
      loiHayGap: ['Giữ :443 / :80 — so với Origin của trình duyệt thì lệch.', 'Không chuẩn hoá chữ hoa trong host.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Origin',
      kiem: [
        { moTa: 'Path and query are not part of the origin|||Đường dẫn và query không thuộc origin', goi: '[originOf("http://localhost:3456/api/products?x=1"), originOf("https://shop.example/a/b#c")]', mongDoi: ['http://localhost:3456', 'https://shop.example'] },
        { moTa: 'Default ports hidden, host lower-cased|||Cổng mặc định bị ẩn, host chữ thường', goi: '[originOf("HTTPS://Shop.Example:443/x"), originOf("http://a.com:80"), originOf("https://a.com:8443")]', mongDoi: ['https://shop.example', 'http://a.com', 'https://a.com:8443'] },
        { moTa: 'Invalid or not http(s)|||Sai hoặc không phải http(s)', goi: '[originOf("/relative"), originOf("not a url"), originOf("file:///tmp/a.html"), originOf("ftp://a.com")]', mongDoi: [null, null, null, null] },
      ],
    },
    {
      tieuDe: 'Cùng origin không?',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['chính sách cùng origin'], tienQuyet: ['hàm'], the: ['javascript', 'cors'],
      moTa: `${BAI}<p>Viết ${c('sameOrigin(a, b)')}: ${c('true')} khi hai URL tuyệt đối có cùng giao thức, host VÀ cổng (sau khi chuẩn hoá như trình duyệt); một trong hai sai ⇒ ${c('false')}. Viết lại phần chuẩn hoá trong hàm.</p>`,
      yeuCau: ['So đủ ba phần.', 'Chuẩn hoá cổng mặc định và chữ hoa.', 'URL sai ⇒ false.'],
      dauVao: 'a, b: string.', dauRa: 'boolean.',
      rangBuoc: ['Tên miền con là KHÁC origin.'],
      viDu: [{ input: 'sameOrigin("http://localhost:5173/", "http://localhost:3000/api")', output: 'false', explanation: 'Vite và Node khác cổng — trường hợp kinh điển của bài.' }],
      goiY: ['const o = (x) => { try { return new URL(x).origin; } catch { return null; } };', 'const oa = o(a); return oa !== null && oa === o(b);'],
      khoiDau: { 'main.js': `// Bài 7.5 — cùng origin không?
function sameOrigin(a, b) {
  return new URL(a).hostname === new URL(b).hostname;
}
` },
      loiGiai: { 'main.js': `// Bài 7.5 — cùng giao thức, cùng host, cùng cổng
function sameOrigin(a, b) {
  const o = (x) => { try { return new URL(x).origin; } catch { return null; } };
  const oa = o(a);
  return oa !== null && oa !== 'null' && oa === o(b);
}
` },
      giaiThich: `<p>Code khởi đầu chỉ so hostname — đúng là lỗi khiến người ta ngạc nhiên vì sao ${c('localhost:5173')} gọi ${c('localhost:3000')} bị CORS chặn. Cổng và giao thức cũng là một phần danh tính.</p>`,
      loiHayGap: ['Chỉ so hostname.', 'Coi tên miền con cùng origin.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy',
      kiem: [
        { moTa: 'Same origin|||Cùng origin', goi: '[sameOrigin("https://shop.example", "https://shop.example/api/products"), sameOrigin("https://shop.example:443/a", "HTTPS://SHOP.example/b")]', mongDoi: [true, true] },
        { moTa: 'Port, host, scheme differ|||Khác cổng, host, giao thức', goi: '[sameOrigin("http://localhost:5173/", "http://localhost:3000/api"), sameOrigin("https://shop.example", "https://api.shop.example"), sameOrigin("https://shop.example", "http://shop.example")]', mongDoi: [false, false, false] },
        { moTa: 'Invalid URLs are never the same|||URL sai không bao giờ cùng origin', goi: '[sameOrigin("nope", "nope"), sameOrigin("https://a.com", "")]', mongDoi: [false, false] },
      ],
    },
    {
      tieuDe: 'Request này có cần preflight?',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['simple request', 'preflight', 'header an toàn'], tienQuyet: ['Object.entries', 'includes'], the: ['javascript', 'cors'],
      moTa: `${BAI}<p>Viết ${c('needsPreflight({ method, headers })')} theo luật CORS: KHÔNG cần preflight (request "đơn giản") khi method là ${c('GET')}, ${c('HEAD')} hoặc ${c('POST')} VÀ mọi header (tên không phân biệt hoa thường) thuộc ${c('accept')}, ${c('accept-language')}, ${c('content-language')}, ${c('content-type')}, VÀ nếu có ${c('content-type')} thì media type của nó (phần trước ${c(';')}, chữ thường, trim) thuộc ${c('application/x-www-form-urlencoded')}, ${c('multipart/form-data')}, ${c('text/plain')}. Ngược lại cần preflight (${c('true')}).</p>`,
      yeuCau: ['Method đơn giản.', 'Header nằm trong danh sách an toàn.', 'Content-Type chỉ ba loại form/chữ.'],
      dauVao: '{ method: string, headers?: object }.', dauRa: 'boolean.',
      rangBuoc: ['method không phân biệt hoa thường.'],
      viDu: [{ input: 'needsPreflight({ method: "PUT", headers: { "Content-Type": "application/json" } })', output: 'true', explanation: 'Đúng request "PUT, JSON body" trong bài — server thấy OPTIONS trước.' }],
      goiY: ['const SAFE = ["accept", "accept-language", "content-language", "content-type"];', 'const type = String(v).split(";")[0].trim().toLowerCase();'],
      khoiDau: { 'main.js': `// Bài 7.5 — cần preflight không?
function needsPreflight({ method, headers = {} }) {
  return method !== 'GET';
}
` },
      loiGiai: { 'main.js': `// Bài 7.5 — request "đơn giản" là thứ một form HTML cũng gửi được; còn lại phải xin phép trước
const SIMPLE_METHODS = ['GET', 'HEAD', 'POST'];
const SAFE_HEADERS = ['accept', 'accept-language', 'content-language', 'content-type'];
const SIMPLE_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'];

function needsPreflight({ method, headers = {} }) {
  if (!SIMPLE_METHODS.includes(method.toUpperCase())) return true;
  for (const [name, value] of Object.entries(headers)) {
    const n = name.toLowerCase();
    if (!SAFE_HEADERS.includes(n)) return true;               // Authorization, X-Request-Id ⇒ preflight
    if (n === 'content-type' && !SIMPLE_TYPES.includes(String(value).split(';')[0].trim().toLowerCase())) return true;
  }
  return false;
}
` },
      giaiThich: `<p>Luật này có lý do lịch sử: một form HTML từ xưa đã gửi được GET/POST với ba kiểu nội dung đó tới bất kỳ đâu, nên máy chủ vốn phải chịu được chúng (và chặn CSRF — Bài 7.2). Mọi thứ mới hơn — JSON, PUT, header Authorization — phải được máy chủ đồng ý trước qua OPTIONS.</p>`,
      loiHayGap: ['Coi POST JSON là đơn giản.', 'Quên Authorization làm request cần preflight.', 'So content-type có cả "; charset=…".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests',
      kiem: [
        { moTa: 'Simple requests|||Request đơn giản', goi: '[needsPreflight({ method: "GET" }), needsPreflight({ method: "post", headers: { "Content-Type": "application/x-www-form-urlencoded" } }), needsPreflight({ method: "POST", headers: { "content-type": "text/plain;charset=UTF-8", Accept: "*/*" } })]', mongDoi: [false, false, false] },
        { moTa: 'The lesson PUT with JSON|||PUT có JSON của bài', goi: '[needsPreflight({ method: "PUT", headers: { "Content-Type": "application/json" } }), needsPreflight({ method: "POST", headers: { "Content-Type": "application/json" } })]', mongDoi: [true, true] },
        { moTa: 'Custom headers and other methods|||Header tự đặt và method khác', goi: '[needsPreflight({ method: "GET", headers: { Authorization: "Bearer x" } }), needsPreflight({ method: "GET", headers: { "X-Request-Id": "1" } }), needsPreflight({ method: "DELETE" })]', mongDoi: [true, true, true] },
      ],
    },
    {
      tieuDe: 'Header CORS theo danh sách cho phép',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['Access-Control-Allow-Origin', 'Vary: Origin', 'credentials'], tienQuyet: ['object', 'includes'], the: ['javascript', 'cors', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('corsHeaders(origin, allowList, credentials = false)')} trả object header cho response. Nếu ${c('origin')} (header Origin của request, có thể vắng) nằm CHÍNH XÁC trong ${c('allowList')} ⇒ ${c('{ "Access-Control-Allow-Origin": origin, "Vary": "Origin" }')}, cộng ${c('"Access-Control-Allow-Credentials": "true"')} nếu ${c('credentials')}. Nếu không, mà ${c('allowList')} chứa ${c('"*"')} và KHÔNG ${c('credentials')} ⇒ ${c('{ "Access-Control-Allow-Origin": "*" }')}. Còn lại ⇒ ${c('{}')} (không cho đọc). Không bao giờ dội lại một origin không có trong danh sách.</p>`,
      yeuCau: ['So chính xác (không startsWith/includes chuỗi).', 'Vary: Origin khi trả origin cụ thể.', '"*" không bao giờ đi với credentials.'],
      dauVao: 'origin: string | undefined; allowList: string[]; credentials?: boolean.', dauRa: 'object.',
      rangBuoc: ['Không dùng regex hay so một phần chuỗi cho origin.'],
      viDu: [{ input: 'corsHeaders("https://evil.example", ["https://shop.example"], true)', output: '{}', explanation: 'Trang lạ không đọc được dữ liệu đăng nhập.' }],
      goiY: ['if (origin && allowList.includes(origin)) { … }', 'if (allowList.includes("*") && !credentials) return { "Access-Control-Allow-Origin": "*" };'],
      khoiDau: { 'main.js': `// Bài 7.5 — header CORS
function corsHeaders(origin, allowList, credentials = false) {
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true' };
}
` },
      loiGiai: { 'main.js': `// Bài 7.5 — chỉ origin có tên trong danh sách mới được đọc; "*" không đi cùng credentials
function corsHeaders(origin, allowList, credentials = false) {
  if (origin && allowList.includes(origin)) {
    const h = { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' };   // Vary: bộ đệm không trộn câu trả lời
    if (credentials) h['Access-Control-Allow-Credentials'] = 'true';
    return h;
  }
  if (allowList.includes('*') && !credentials) return { 'Access-Control-Allow-Origin': '*' };
  return {};
}
` },
      giaiThich: `<p>Code khởi đầu là đúng cái bẫy cuối bài: dội lại mọi Origin kèm ${c('Allow-Credentials: true')} = mọi website đọc được dữ liệu đăng nhập của người dùng. So bằng ${c('includes')} của MẢNG là so chính xác; so ${c('origin.endsWith("shop.example")')} thì ${c('evilshop.example')} lọt qua.</p>`,
      loiHayGap: ['Dội lại Origin không kiểm.', 'Dùng endsWith/includes trên chuỗi.', 'Quên Vary: Origin.'],
      thamKhao: 'https://portswigger.net/web-security/cors',
      kiem: [
        { moTa: 'Allowed origin, with and without credentials|||Origin được phép, có và không credentials', goi: '[corsHeaders("https://shop.example", ["https://shop.example"]), corsHeaders("https://shop.example", ["https://shop.example"], true)]', mongDoi: [{ 'Access-Control-Allow-Origin': 'https://shop.example', Vary: 'Origin' }, { 'Access-Control-Allow-Origin': 'https://shop.example', Vary: 'Origin', 'Access-Control-Allow-Credentials': 'true' }] },
        { moTa: 'Strangers get nothing; near-misses too|||Người lạ không nhận gì; gần giống cũng vậy', goi: '[corsHeaders("https://evil.example", ["https://shop.example"], true), corsHeaders("https://evilshop.example", ["https://shop.example"]), corsHeaders(undefined, ["https://shop.example"])]', mongDoi: [{}, {}, {}] },
        { moTa: 'Wildcard only without credentials|||Dấu * chỉ khi không credentials', goi: '[corsHeaders("https://any.example", ["*"]), corsHeaders("https://any.example", ["*"], true)]', mongDoi: [{ 'Access-Control-Allow-Origin': '*' }, {}] },
      ],
    },
    {
      tieuDe: 'Trả lời preflight',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['OPTIONS', 'Allow-Methods', 'Allow-Headers', 'Max-Age'], tienQuyet: ['split', 'every'], the: ['javascript', 'cors'],
      moTa: `${BAI}<p>Viết ${c('preflight(req, config)')}: ${c('req.headers')} có ${c('origin')}, ${c('access-control-request-method')}, có thể có ${c('access-control-request-headers')} (danh sách cách bởi dấu phẩy); ${c('config')} là ${c('{ origins, methods, headers, maxAge }')}. Origin không có trong ${c('origins')}, method xin không có trong ${c('methods')}, hoặc một header xin (so không phân biệt hoa thường, đã trim) không có trong ${c('headers')} ⇒ ${c('{ status: 403, headers: {} }')}. Đạt ⇒ ${c('{ status: 204, headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": methods.join(", "), "Access-Control-Allow-Headers": headers.join(", "), "Access-Control-Max-Age": String(maxAge), "Vary": "Origin" } }')}.</p>`,
      yeuCau: ['Kiểm origin, method, từng header.', 'Header so không phân biệt hoa thường.', 'Đúng tên và giá trị header trả về.'],
      dauVao: 'req: { headers }; config: object.', dauRa: '{ status, headers }.',
      rangBuoc: ['Tên header của req luôn viết thường (như Node).'],
      viDu: [{ input: 'preflight cho PUT /products/2 với Content-Type', output: '{ status: 204, headers: { …Allow-Methods: "GET, PUT, DELETE"… } }', explanation: 'Đúng câu trả lời làm trình duyệt gửi PUT thật trong bài.' }],
      goiY: ['const asked = (h["access-control-request-headers"] ?? "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);', 'const ok = asked.every((x) => config.headers.map((y) => y.toLowerCase()).includes(x));'],
      khoiDau: { 'main.js': `// Bài 7.5 — trả lời preflight
function preflight(req, config) {
  return { status: 204, headers: {} };
}
` },
      loiGiai: { 'main.js': `// Bài 7.5 — OPTIONS hỏi: origin này, method này, các header này — được không?
function preflight(req, config) {
  const h = req.headers ?? {};
  const origin = h.origin;
  const method = String(h['access-control-request-method'] ?? '').toUpperCase();
  const asked = String(h['access-control-request-headers'] ?? '')
    .split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  const allowedHeaders = config.headers.map((x) => x.toLowerCase());
  const ok = config.origins.includes(origin)
    && config.methods.includes(method)
    && asked.every((x) => allowedHeaders.includes(x));
  if (!ok) return { status: 403, headers: {} };
  return {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': config.methods.join(', '),
      'Access-Control-Allow-Headers': config.headers.join(', '),
      'Access-Control-Max-Age': String(config.maxAge),
      Vary: 'Origin',
    },
  };
}
` },
      giaiThich: `<p>Đây là việc của gói ${c('cors')} trong Express. Trả 403 rõ ràng cho preflight không đạt giúp gỡ lỗi dễ hơn (trình duyệt vẫn chỉ báo "blocked by CORS policy", nhưng log máy chủ cho biết vì sao). ${c('Max-Age')} giảm số lần OPTIONS cho mỗi trang.</p>`,
      loiHayGap: ['So header phân biệt hoa thường — "Content-Type" vs "content-type".', 'Cho mọi method/header qua.', 'Quên trim sau khi tách theo dấu phẩy.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request',
      kiem: [
        { moTa: 'The lesson preflight is allowed|||Preflight của bài được phép', chuanBi: 'const C = { origins: ["http://127.0.0.1:5500"], methods: ["GET", "PUT", "DELETE"], headers: ["Content-Type"], maxAge: 600 };', goi: 'preflight({ headers: { origin: "http://127.0.0.1:5500", "access-control-request-method": "PUT", "access-control-request-headers": "content-type" } }, C)', mongDoi: { status: 204, headers: { 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500', 'Access-Control-Allow-Methods': 'GET, PUT, DELETE', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600', Vary: 'Origin' } } },
        { moTa: 'Wrong origin, method or header: 403|||Sai origin, method hoặc header: 403', chuanBi: 'const C = { origins: ["https://shop.example"], methods: ["GET", "PUT"], headers: ["Content-Type"], maxAge: 600 }; const base = { origin: "https://shop.example", "access-control-request-method": "PUT" };', goi: '[preflight({ headers: { ...base, origin: "https://evil.example" } }, C).status, preflight({ headers: { ...base, "access-control-request-method": "DELETE" } }, C).status, preflight({ headers: { ...base, "access-control-request-headers": "content-type, authorization" } }, C).status]', mongDoi: [403, 403, 403] },
        { moTa: 'Header list: spaces, case, empty|||Danh sách header: dấu cách, hoa thường, rỗng', chuanBi: 'const C = { origins: ["https://shop.example"], methods: ["PATCH"], headers: ["Content-Type", "Authorization"], maxAge: 60 };', goi: '[preflight({ headers: { origin: "https://shop.example", "access-control-request-method": "patch", "access-control-request-headers": " Authorization ,CONTENT-TYPE" } }, C).status, preflight({ headers: { origin: "https://shop.example", "access-control-request-method": "PATCH" } }, C).status]', mongDoi: [204, 204] },
      ],
    },
    {
      tieuDe: 'Kiểm một chứng chỉ',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['chứng chỉ TLS', 'hạn dùng', 'tên miền có *'], tienQuyet: ['Date', 'split'], the: ['javascript', 'https', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('checkCertificate(cert, hostname, now)')} như curl ở Bước 2–3 của bài (bỏ qua chuỗi tổ chức cấp): ${c('cert')} là ${c('{ notBefore, notAfter, names }')} (hai mốc là chuỗi ngày ISO, ${c('names')} là mảng tên trong subjectAltName), ${c('now')} là chuỗi ISO. Trả theo thứ tự: ${c('"not-yet-valid"')} (now trước notBefore), ${c('"expired"')} (now SAU notAfter), ${c('"name-mismatch"')}, hoặc ${c('"ok"')}. So tên không phân biệt hoa thường; tên dạng ${c('*.example.com')} khớp ĐÚNG MỘT nhãn bên trái (${c('a.example.com')} có, ${c('example.com')} và ${c('a.b.example.com')} không).</p>`,
      yeuCau: ['So thời gian bằng Date.', 'Ký tự đại diện chỉ thay một nhãn.', 'Không phân biệt hoa thường.'],
      dauVao: 'cert: object; hostname: string; now: string (ISO).', dauRa: 'string.',
      rangBuoc: ['Không có Date.now() — dùng now.'],
      viDu: [{ input: 'chứng chỉ example.com hiệu lực 26/9–25/12/2026, now = 2026-11-02', output: '"ok"', explanation: 'Dòng "SSL certificate verify ok" trong bài.' }],
      goiY: ['const t = new Date(now).getTime(); if (t < new Date(cert.notBefore).getTime()) return "not-yet-valid";', 'name.startsWith("*.") ? host.split(".").length === name.split(".").length && host.endsWith(name.slice(1)) : host === name'],
      khoiDau: { 'main.js': `// Bài 7.5 — kiểm một chứng chỉ
function checkCertificate(cert, hostname, now) {
  if (now > cert.notAfter) return 'expired';
  return cert.names.includes(hostname) ? 'ok' : 'name-mismatch';
}
` },
      loiGiai: { 'main.js': `// Bài 7.5 — còn hạn không, và có đúng là cho tên miền này không
function nameMatches(pattern, host) {
  const p = pattern.toLowerCase();
  const h = host.toLowerCase();
  if (!p.startsWith('*.')) return p === h;
  const rest = p.slice(1);                                   // ".example.com"
  return h.endsWith(rest) && h.split('.').length === p.split('.').length;   // đúng một nhãn thay cho *
}

function checkCertificate(cert, hostname, now) {
  const t = new Date(now).getTime();
  if (t < new Date(cert.notBefore).getTime()) return 'not-yet-valid';
  if (t > new Date(cert.notAfter).getTime()) return 'expired';
  if (!cert.names.some((n) => nameMatches(n, hostname))) return 'name-mismatch';
  return 'ok';
}
` },
      giaiThich: `<p>So chuỗi ngày như code khởi đầu tình cờ đúng với ISO cùng định dạng, nhưng sai khi định dạng khác (múi giờ, mili giây). Luật một nhãn của ${c('*')} quan trọng: chứng chỉ ${c('*.example.com')} không được phép bảo đảm cho ${c('evil.attacker.example.com')} hay chính ${c('example.com')}. Trình duyệt còn kiểm chuỗi tổ chức cấp và danh sách thu hồi — phần bài này bỏ qua.</p>`,
      loiHayGap: ['Cho * khớp nhiều nhãn.', 'So ngày bằng chuỗi.', 'Bỏ qua notBefore.'],
      thamKhao: 'https://www.rfc-editor.org/rfc/rfc6125#section-6.4.3',
      kiem: [
        { moTa: 'example.com from the lesson|||example.com trong bài', goi: 'checkCertificate({ notBefore: "2026-09-26T22:49:11Z", notAfter: "2026-12-25T22:56:35Z", names: ["example.com", "*.example.com"] }, "example.com", "2026-11-02T09:00:00Z")', mongDoi: 'ok' },
        { moTa: 'Expired and not yet valid|||Hết hạn và chưa hiệu lực', goi: '[checkCertificate({ notBefore: "2015-04-09T00:00:00Z", notAfter: "2015-04-12T23:59:59Z", names: ["expired.badssl.com"] }, "expired.badssl.com", "2026-11-02T00:00:00Z"), checkCertificate({ notBefore: "2027-01-01T00:00:00Z", notAfter: "2027-04-01T00:00:00Z", names: ["a.com"] }, "a.com", "2026-11-02T00:00:00Z")]', mongDoi: ['expired', 'not-yet-valid'] },
        { moTa: 'Wildcards cover exactly one label|||Ký tự đại diện chỉ thay đúng một nhãn', chuanBi: 'const C = { notBefore: "2026-01-01T00:00:00Z", notAfter: "2027-01-01T00:00:00Z", names: ["*.Shop.Example"] };', goi: '[checkCertificate(C, "api.shop.example", "2026-06-01T00:00:00Z"), checkCertificate(C, "shop.example", "2026-06-01T00:00:00Z"), checkCertificate(C, "a.b.shop.example", "2026-06-01T00:00:00Z"), checkCertificate(C, "evilshop.example", "2026-06-01T00:00:00Z")]', mongDoi: ['ok', 'name-mismatch', 'name-mismatch', 'name-mismatch'] },
      ],
    },
    {
      tieuDe: 'Trình duyệt có cho trang đọc response?',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['quyết định CORS của trình duyệt', 'credentials'], tienQuyet: ['object', 'toLowerCase'], the: ['javascript', 'cors'],
      moTa: `${BAI}<p>Viết ${c('canRead(pageOrigin, request, responseHeaders)')} mô phỏng bước cuối của trình duyệt sau khi ĐÃ nhận response: ${c('request')} là ${c('{ url, credentials }')} (${c('credentials')}: ${c('"omit" | "same-origin" | "include"')}); tên header của response không phân biệt hoa thường. Trả ${c('"readable"')} nếu cùng origin với ${c('url')}. Khác origin: thiếu ${c('Access-Control-Allow-Origin')} ⇒ ${c('"blocked: no allow-origin"')}; credentials là ${c('"include"')} mà giá trị là ${c('*')} ⇒ ${c('"blocked: wildcard with credentials"')}; giá trị khác ${c('*')} và khác ${c('pageOrigin')} ⇒ ${c('"blocked: origin mismatch"')}; credentials ${c('"include"')} mà ${c('Access-Control-Allow-Credentials')} không phải ${c('"true"')} ⇒ ${c('"blocked: credentials not allowed"')}; còn lại ${c('"readable"')}.</p>`,
      yeuCau: ['Cùng origin luôn đọc được.', 'Đúng thứ tự các lý do chặn.', 'Header response không phân biệt hoa thường.'],
      dauVao: 'pageOrigin: string; request: { url, credentials }; responseHeaders: object.', dauRa: 'string.',
      rangBuoc: ['Một hàm tự đủ.'],
      viDu: [{ input: 'trang 127.0.0.1 gọi /star với credentials "include", response "Access-Control-Allow-Origin: *"', output: '"blocked: wildcard with credentials"', explanation: 'Đúng thông báo console trong bài.' }],
      goiY: ['const h = Object.fromEntries(Object.entries(responseHeaders).map(([k, v]) => [k.toLowerCase(), v]));', 'const same = new URL(request.url, pageOrigin).origin === pageOrigin;'],
      khoiDau: { 'main.js': `// Bài 7.5 — trình duyệt có cho đọc?
function canRead(pageOrigin, request, responseHeaders) {
  return responseHeaders['Access-Control-Allow-Origin'] ? 'readable' : 'blocked: no allow-origin';
}
` },
      loiGiai: { 'main.js': `// Bài 7.5 — response đã về tới trình duyệt; câu hỏi chỉ là: có trao cho JavaScript của trang không?
function canRead(pageOrigin, request, responseHeaders) {
  if (new URL(request.url, pageOrigin).origin === pageOrigin) return 'readable';   // cùng origin: không cần CORS
  const h = Object.fromEntries(Object.entries(responseHeaders).map(([k, v]) => [k.toLowerCase(), String(v)]));
  const allow = h['access-control-allow-origin'];
  const withCreds = request.credentials === 'include';
  if (allow === undefined) return 'blocked: no allow-origin';
  if (allow === '*' && withCreds) return 'blocked: wildcard with credentials';
  if (allow !== '*' && allow !== pageOrigin) return 'blocked: origin mismatch';
  if (withCreds && h['access-control-allow-credentials'] !== 'true') return 'blocked: credentials not allowed';
  return 'readable';
}
` },
      giaiThich: `<p>Mọi nhánh "blocked" ở đây xảy ra SAU khi máy chủ đã nhận và xử lý request — đúng điều output của bài cho thấy ("server saw: GET /nocors"). Vì vậy CORS là luật bảo vệ người dùng của trình duyệt, không phải tường lửa cho API.</p>`,
      loiHayGap: ['Tra header phân biệt hoa thường.', 'Cho "*" đi với credentials.', 'Chặn cả request cùng origin.'],
      thamKhao: 'https://fetch.spec.whatwg.org/#cors-check',
      kiem: [
        { moTa: 'The six lesson cases|||Sáu trường hợp của bài', chuanBi: 'const P = "http://127.0.0.1:5500"; const A = "http://localhost:4000";', goi: '[canRead(P, { url: A + "/nocors", credentials: "same-origin" }, { "Content-Type": "application/json" }), canRead(P, { url: A + "/cors", credentials: "same-origin" }, { "access-control-allow-origin": P }), canRead(P, { url: A + "/star", credentials: "include" }, { "Access-Control-Allow-Origin": "*" }), canRead(P, { url: A + "/creds", credentials: "include" }, { "Access-Control-Allow-Origin": P, "Access-Control-Allow-Credentials": "true" })]', mongDoi: ['blocked: no allow-origin', 'readable', 'blocked: wildcard with credentials', 'readable'] },
        { moTa: 'Mismatch and missing Allow-Credentials|||Lệch origin và thiếu Allow-Credentials', chuanBi: 'const P = "https://shop.example";', goi: '[canRead(P, { url: "https://api.other.example/x", credentials: "omit" }, { "Access-Control-Allow-Origin": "https://admin.example" }), canRead(P, { url: "https://api.other.example/x", credentials: "include" }, { "Access-Control-Allow-Origin": P })]', mongDoi: ['blocked: origin mismatch', 'blocked: credentials not allowed'] },
        { moTa: 'Same origin and relative URLs need no CORS|||Cùng origin và URL tương đối không cần CORS', goi: '[canRead("https://shop.example", { url: "/api/products", credentials: "include" }, {}), canRead("https://shop.example", { url: "https://shop.example:443/a", credentials: "omit" }, {}), canRead("https://shop.example", { url: "https://x.example/a", credentials: "omit" }, { "Access-Control-Allow-Origin": "*" })]', mongDoi: ['readable', 'readable', 'readable'] },
      ],
    },
  ],
});
