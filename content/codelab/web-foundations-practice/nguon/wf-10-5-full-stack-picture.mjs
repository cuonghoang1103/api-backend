/** Bộ luyện bài 10.5 — Bức tranh full-stack. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Từng tầng của app ghi chú trong bài, viết thành hàm thuần (máy chấm không có máy chủ/CSDL): đoán tầng từ triệu chứng,
 *  đọc cookie, khớp route + 404/405, kiểm phần thân ghi chú, che log, và cả máy chủ ghi chú trong một hàm handle().
 */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 10.5 — Bức tranh full-stack.</em> Mỗi bài là một tầng của app ghi chú trong bài học, viết thành hàm thuần để kiểm được — bài cuối ghép tất cả lại.</p>';

export default doiDau({
  slug: 'wf-10-5-full-stack-picture',
  ten: '10.5 Bức tranh full-stack',
  baiHoc: 'Nền tảng Web — Bài 10.5 The full-stack picture',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Đoán tầng có lỗi từ triệu chứng, đọc cookie sid, khớp route kèm tham số và 404/405 + Allow, kiểm phần thân ghi chú (422), che log theo tầng, và ghép cả máy chủ ghi chú (đăng nhập, phiên, GET/POST/DELETE theo người dùng) trong một hàm handle() — 6 bài.',
  de: [
    {
      tieuDe: 'Lỗi nằm ở tầng nào?',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['mã trạng thái', 'tầng'], tienQuyet: ['if/else'], the: ['javascript', 'full-stack'],
      moTa: `${BAI}<p>Viết ${c('whereToLook(sym)')} với ${c('sym = { request: boolean, status?: number, consoleError?: string }')} theo bảng của bài: không có request ⇒ ${c('"page"')}; ${c('consoleError')} chứa ${c('"CORS"')} ⇒ ${c('"server headers"')}; 401/403 ⇒ ${c('"session"')}; 400/422 ⇒ ${c('"request body"')}; 404/405 ⇒ ${c('"route"')}; 500–599 ⇒ ${c('"server code or database"')}; 200–299 ⇒ ${c('"rendering"')}; còn lại ⇒ ${c('"read the response"')}. Kiểm theo đúng thứ tự trên.</p>`,
      yeuCau: ['Đúng thứ tự kiểm.', 'Khoảng 5xx và 2xx.'],
      dauVao: 'sym: object.', dauRa: 'string.',
      rangBuoc: ['CORS được kiểm trước mã trạng thái (trình duyệt có thể chặn đọc cả response 200).'],
      viDu: [{ input: 'whereToLook({ request: true, status: 422 })', output: '"request body"', explanation: 'Tiêu đề trống trong bài.' }],
      goiY: ['if (!sym.request) return "page";', 'sym.status >= 500 && sym.status <= 599'],
      khoiDau: { 'main.js': `// Bài 10.5 — lỗi nằm ở tầng nào?
function whereToLook(sym) {
  return 'server code or database';
}
` },
      loiGiai: { 'main.js': `// Bài 10.5 — đọc triệu chứng trước, mở đúng tầng sau
function whereToLook(sym) {
  const s = sym.status;
  if (!sym.request) return 'page';                                   // không có request: sự kiện / JS trên trang
  if (String(sym.consoleError ?? '').includes('CORS')) return 'server headers';
  if (s === 401 || s === 403) return 'session';
  if (s === 400 || s === 422) return 'request body';
  if (s === 404 || s === 405) return 'route';
  if (s >= 500 && s <= 599) return 'server code or database';
  if (s >= 200 && s <= 299) return 'rendering';
  return 'read the response';
}
` },
      giaiThich: `<p>Một lần nhìn tab Network quyết định bạn mở tệp nào. Mã khởi đầu làm điều người mới hay làm: đoán "chắc lỗi máy chủ" bất kể triệu chứng.</p>`,
      loiHayGap: ['Kiểm status trước khi kiểm có request không.', 'Bỏ sót 405.'],
      thamKhao: 'https://developer.chrome.com/docs/devtools/network',
      kiem: [
        { moTa: 'No request and validation|||Không có request và kiểm dữ liệu', goi: '[whereToLook({ request: false }), whereToLook({ request: true, status: 422 })]', mongDoi: ['page', 'request body'] },
        { moTa: 'Session, route, server|||Phiên, route, máy chủ', goi: '[401, 403, 404, 405, 500, 503].map((status) => whereToLook({ request: true, status }))', mongDoi: ['session', 'session', 'route', 'route', 'server code or database', 'server code or database'] },
        { moTa: 'CORS beats 200; rendering; other|||CORS trước 200; hiển thị; khác', goi: '[whereToLook({ request: true, status: 200, consoleError: "blocked by CORS policy" }), whereToLook({ request: true, status: 201 }), whereToLook({ request: true, status: 302 })]', mongDoi: ['server headers', 'rendering', 'read the response'] },
      ],
    },
    {
      tieuDe: 'Đọc cookie sid',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['header Cookie'], tienQuyet: ['split', 'decodeURIComponent'], the: ['javascript', 'full-stack'],
      moTa: `${BAI}<p>Viết ${c('getCookie(header, name)')} đọc header ${c('Cookie')} dạng ${c('"theme=dark; sid=abc123; lang=vi"')}. Tách theo ${c(';')}, bỏ khoảng trắng hai đầu mỗi cặp, tên so khớp CHÍNH XÁC (${c('"sid"')} không khớp ${c('"xsid"')}), giá trị có thể chứa ${c('=')} (chỉ tách ở dấu ${c('=')} đầu), và được ${c('decodeURIComponent')} (giá trị mã hoá sai ⇒ trả nguyên). Không có header hoặc không có cookie ⇒ ${c('null')}. Trùng tên ⇒ lấy cái đầu.</p>`,
      yeuCau: ['Khớp tên chính xác.', 'Tách ở = đầu tiên.', 'Giải mã an toàn.'],
      dauVao: 'header: string | undefined; name: string.', dauRa: 'string | null.',
      rangBuoc: ['Không dùng regex dễ khớp nhầm như /sid=([^;]+)/.'],
      viDu: [{ input: 'getCookie("xsid=bad; sid=abc123", "sid")', output: '"abc123"', explanation: 'Regex /sid=/ đơn giản sẽ khớp nhầm "xsid".' }],
      goiY: ['for (const part of header.split(";")) { const i = part.indexOf("="); … }', 'try { return decodeURIComponent(v); } catch { return v; }'],
      khoiDau: { 'main.js': `// Bài 10.5 — đọc cookie
function getCookie(header, name) {
  const m = new RegExp(name + '=([^;]+)').exec(header);
  return m ? m[1] : null;
}
` },
      loiGiai: { 'main.js': `// Bài 10.5 — "tên=giá trị; tên=giá trị": tách ở ';', rồi ở '=' ĐẦU TIÊN, so tên chính xác
function getCookie(header, name) {
  if (!header) return null;
  for (const part of String(header).split(';')) {
    const p = part.trim();
    const i = p.indexOf('=');
    if (i < 0 || p.slice(0, i).trim() !== name) continue;
    const v = p.slice(i + 1).trim();
    try { return decodeURIComponent(v); } catch { return v; }
  }
  return null;
}
` },
      giaiThich: `<p>Máy chủ trong bài dùng một regex có neo ${c('(?:^|;\\s*)sid=')} để tránh khớp nhầm — mã khởi đầu thì không. Cookie đến từ trình duyệt, tức là từ người dùng: đọc nó cẩn thận như mọi dữ liệu đầu vào.</p>`,
      loiHayGap: ['"xsid" khớp "sid".', 'Cắt mất phần sau dấu = thứ hai.', 'decodeURIComponent ném lỗi làm sập request.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie',
      kiem: [
        { moTa: 'Finds sid exactly|||Tìm đúng sid', goi: '[getCookie("theme=dark; sid=abc123; lang=vi", "sid"), getCookie("xsid=bad; sid=abc123", "sid")]', mongDoi: ['abc123', 'abc123'] },
        { moTa: 'Values with = and encoding|||Giá trị có = và mã hoá', goi: '[getCookie("data=a=b=c", "data"), getCookie("name=L%C3%A2n", "name"), getCookie("bad=%E0%A4%A", "bad")]', mongDoi: ['a=b=c', 'Lân', '%E0%A4%A'] },
        { moTa: 'Missing header or cookie; duplicates|||Thiếu header hoặc cookie; trùng tên', goi: '[getCookie(undefined, "sid"), getCookie("a=1", "sid"), getCookie("sid=first; sid=second", "sid")]', mongDoi: [null, null, 'first'] },
      ],
    },
    {
      tieuDe: 'Khớp route, 404 và 405',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['định tuyến', 'tham số đường dẫn', '405 + Allow'], tienQuyet: ['split', 'object'], the: ['javascript', 'full-stack'],
      moTa: `${BAI}<p>Viết ${c('matchRoute(routes, method, path)')} với ${c('routes')} là mảng ${c('{ method, pattern, name }')} (pattern như ${c('"/api/notes/:id"')}). Bỏ query (${c('?…')}) và dấu ${c('/')} cuối (trừ ${c('"/"')}) trước khi so. So từng đoạn: đoạn ${c(':x')} khớp mọi đoạn không rỗng và được giải mã vào ${c('params.x')}. Trả: khớp cả đường dẫn lẫn phương thức ⇒ ${c('{ status: 200, name, params }')}; đường dẫn khớp nhưng sai phương thức ⇒ ${c('{ status: 405, allow: "GET, POST" }')} (các phương thức của mọi route khớp đường dẫn, theo thứ tự khai báo, không trùng); không đường dẫn nào khớp ⇒ ${c('{ status: 404 }')}.</p>`,
      yeuCau: ['Tham số đường dẫn.', 'Phân biệt 404 và 405.', 'Header Allow đúng.'],
      dauVao: 'routes; method: string; path: string.', dauRa: '{ status, name?, params?, allow? }.',
      rangBuoc: ['Route khai báo trước thắng khi nhiều route cùng khớp.'],
      viDu: [{ input: 'matchRoute(routes, "PUT", "/api/notes")', output: '{ status: 405, allow: "GET, POST" }', explanation: 'Đúng nhánh 405 trong server.mjs của bài.' }],
      goiY: ['const segs = (p) => p.split("/").filter(Boolean);', 'Hai mảng đoạn phải cùng độ dài; đoạn bắt đầu ":" thì gán params.'],
      khoiDau: { 'main.js': `// Bài 10.5 — khớp route
function matchRoute(routes, method, path) {
  const r = routes.find((x) => x.method === method && x.pattern === path);
  return r ? { status: 200, name: r.name, params: {} } : { status: 404 };
}
` },
      loiGiai: { 'main.js': `// Bài 10.5 — so theo đoạn; đường dẫn khớp mà sai phương thức là 405 (kèm Allow), không phải 404
function matchPath(pattern, path) {
  const a = pattern.split('/').filter(Boolean);
  const b = path.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

function matchRoute(routes, method, path) {
  let clean = path.split('?')[0];
  if (clean.length > 1) clean = clean.replace(/\\/+$/, '');
  const allow = [];
  for (const r of routes) {
    const params = matchPath(r.pattern, clean);
    if (!params) continue;
    if (r.method === method) return { status: 200, name: r.name, params };
    if (!allow.includes(r.method)) allow.push(r.method);
  }
  return allow.length ? { status: 405, allow: allow.join(', ') } : { status: 404 };
}
` },
      giaiThich: `<p>404 nói "không có thứ này", 405 nói "có, nhưng không làm được việc đó" — và header ${c('Allow')} cho người gọi biết làm được gì. Đây đúng là việc Express làm bên trong ${c('app.get')}/${c('app.post')}; ở khoá Node.js bạn sẽ dùng nó thay vì tự viết.</p>`,
      loiHayGap: ['Trả 404 khi chỉ sai phương thức.', '"/api/notes/" không khớp "/api/notes".', 'Đoạn rỗng khớp :id.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405',
      kiem: [
        { moTa: 'Params and trailing slash|||Tham số và dấu / cuối', goi: '(() => { const R = [{ method: "GET", pattern: "/api/notes", name: "list" }, { method: "POST", pattern: "/api/notes", name: "create" }, { method: "DELETE", pattern: "/api/notes/:id", name: "remove" }]; return [matchRoute(R, "GET", "/api/notes/?page=2"), matchRoute(R, "DELETE", "/api/notes/42")]; })()', mongDoi: [{ status: 200, name: 'list', params: {} }, { status: 200, name: 'remove', params: { id: '42' } }] },
        { moTa: '405 with Allow, then 404|||405 kèm Allow, rồi 404', goi: '(() => { const R = [{ method: "GET", pattern: "/api/notes", name: "list" }, { method: "POST", pattern: "/api/notes", name: "create" }, { method: "DELETE", pattern: "/api/notes/:id", name: "remove" }]; return [matchRoute(R, "PUT", "/api/notes"), matchRoute(R, "GET", "/api/notes/7"), matchRoute(R, "GET", "/api/users")]; })()', mongDoi: [{ status: 405, allow: 'GET, POST' }, { status: 405, allow: 'DELETE' }, { status: 404 }] },
        { moTa: 'Root, empty segment, decoding|||Gốc, đoạn rỗng, giải mã', goi: '(() => { const R = [{ method: "GET", pattern: "/", name: "home" }, { method: "GET", pattern: "/tags/:tag", name: "tag" }]; return [matchRoute(R, "GET", "/").name, matchRoute(R, "GET", "/tags/").status, matchRoute(R, "GET", "/tags/c%2B%2B").params]; })()', mongDoi: ['home', 404, { tag: 'c++' }] },
      ],
    },
    {
      tieuDe: 'Kiểm phần thân ghi chú',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['kiểm ở ranh giới', '422'], tienQuyet: ['typeof', 'trim'], the: ['javascript', 'full-stack'],
      moTa: `${BAI}<p>Viết ${c('validateNote(raw)')} — ${c('raw')} là CHUỖI phần thân request. JSON hỏng ⇒ ${c('{ status: 400, errors: ["body is not valid JSON"] }')}. Phải là object (không null/mảng) ⇒ ngược lại ${c('{ status: 400, errors: ["body must be an object"] }')}. Rồi gom MỌI lỗi (status 422): ${c('title')} là chuỗi, sau trim không rỗng (${c('"title is required"')}), dài tối đa 80 ký tự THẬT (${c('"title is longer than 80 characters"')}); ${c('tags')} nếu có phải là mảng tối đa 5 chuỗi (${c('"tags must be at most 5 strings"')}); khoá khác ${c('title, tags')} ⇒ ${c('"unknown field: <khoá>"')}. Hợp lệ ⇒ ${c('{ status: 200, data: { title, tags } }')} với title đã trim, tags mặc định ${c('[]')}.</p>`,
      yeuCau: ['400 cho JSON hỏng / không phải object.', '422 gom mọi lỗi.', 'Trả dữ liệu sạch.'],
      dauVao: 'raw: string.', dauRa: '{ status, errors } | { status, data }.',
      rangBuoc: ['Đếm độ dài bằng [...title].length.'],
      viDu: [{ input: 'validateNote(\'{"title":"   "}\')', output: '{ status: 422, errors: ["title is required"] }', explanation: 'Đúng lần 422 trong bài.' }],
      goiY: ['let body; try { body = JSON.parse(raw); } catch { return { status: 400, … }; }', 'Object.keys(body).filter((k) => !["title", "tags"].includes(k))'],
      khoiDau: { 'main.js': `// Bài 10.5 — kiểm phần thân ghi chú
function validateNote(raw) {
  const body = JSON.parse(raw);
  return { status: 200, data: body };
}
` },
      loiGiai: { 'main.js': `// Bài 10.5 — 400: không đọc được; 422: đọc được nhưng nội dung sai; 200: dữ liệu sạch đi tiếp vào SQL
function validateNote(raw) {
  let body;
  try { body = JSON.parse(raw); } catch { return { status: 400, errors: ['body is not valid JSON'] }; }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return { status: 400, errors: ['body must be an object'] };
  const errors = [];
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) errors.push('title is required');
  else if ([...title].length > 80) errors.push('title is longer than 80 characters');
  const tags = body.tags ?? [];
  if (!Array.isArray(tags) || tags.length > 5 || !tags.every((t) => typeof t === 'string')) errors.push('tags must be at most 5 strings');
  for (const k of Object.keys(body)) if (k !== 'title' && k !== 'tags') errors.push('unknown field: ' + k);
  return errors.length ? { status: 422, errors } : { status: 200, data: { title, tags } };
}
` },
      giaiThich: `<p>Đây là tầng "valid" trong log của bài: nằm sau auth, trước SQL. Dữ liệu trả về là bản SẠCH (đã trim, đúng kiểu, không trường lạ) — phần còn lại của máy chủ chỉ làm việc với nó, như ${c('safeParse')} của zod ở Bài 9.5.</p>`,
      loiHayGap: ['JSON.parse không try.', 'Dừng ở lỗi đầu.', 'Cho trường lạ lọt xuống CSDL.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422',
      kiem: [
        { moTa: 'Valid note, cleaned|||Ghi chú hợp lệ, đã làm sạch', goi: 'validateNote(\'{"title":"  Ship the capstone  "}\')', mongDoi: { status: 200, data: { title: 'Ship the capstone', tags: [] } } },
        { moTa: 'Blank title and every other error|||Tiêu đề trống và mọi lỗi khác', goi: '[validateNote(\'{"title":"   "}\'), validateNote(JSON.stringify({ title: "x".repeat(81), tags: ["a", 1], done: true }))]', mongDoi: [{ status: 422, errors: ['title is required'] }, { status: 422, errors: ['title is longer than 80 characters', 'tags must be at most 5 strings', 'unknown field: done'] }] },
        { moTa: '400 for unreadable bodies|||400 cho phần thân không đọc được', goi: '[validateNote("title=hi"), validateNote("[1]"), validateNote("null")]', mongDoi: [{ status: 400, errors: ['body is not valid JSON'] }, { status: 400, errors: ['body must be an object'] }, { status: 400, errors: ['body must be an object'] }] },
      ],
    },
    {
      tieuDe: 'Dòng log theo tầng, có che',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['log có cấu trúc', 'che dữ liệu nhạy cảm'], tienQuyet: ['đệ quy', 'JSON.stringify'], the: ['javascript', 'full-stack'],
      moTa: `${BAI}<p>Viết ${c('logLine(id, layer, data)')} trả chuỗi ${c('"[req <id>] <layer đệm phải tới 6 ký tự> <data>"')} giống log của bài (${c('"[req 5] auth   session ok"')}). ${c('data')} là chuỗi thì in nguyên; là object/mảng thì in ${c('JSON.stringify')} SAU KHI che đệ quy: mọi khoá (không phân biệt hoa thường) là ${c('password, token, sid, cookie, authorization')} hoặc kết thúc bằng ${c('secret')} ⇒ giá trị ${c('"***"')}. Không sửa object gốc.</p>`,
      yeuCau: ['Đệm tầng 6 ký tự.', 'Che đệ quy cả trong mảng.', 'Không sửa gốc.'],
      dauVao: 'id: number; layer: string; data: string | object.', dauRa: 'string.',
      rangBuoc: ['Giá trị null/số của khoá nhạy cảm cũng che.'],
      viDu: [{ input: 'logLine(3, "http", { email: "an@example.com", password: "correct horse battery" })', output: '"[req 3] http   {\\"email\\":\\"an@example.com\\",\\"password\\":\\"***\\"}"', explanation: 'Mật khẩu không bao giờ vào log.' }],
      goiY: ['const mask = (v) => Array.isArray(v) ? v.map(mask) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, SECRET(k) ? "***" : mask(x)])) : v;', 'layer.padEnd(6)'],
      khoiDau: { 'main.js': `// Bài 10.5 — dòng log theo tầng
function logLine(id, layer, data) {
  return '[req ' + id + '] ' + layer + ' ' + JSON.stringify(data);
}
` },
      loiGiai: { 'main.js': `// Bài 10.5 — log có cấu trúc: mã request + tầng + dữ liệu đã che
const isSecret = (k) => /^(password|token|sid|cookie|authorization)$/i.test(k) || /secret$/i.test(k);
const mask = (v) =>
  Array.isArray(v) ? v.map(mask)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, isSecret(k) ? '***' : mask(x)]))
  : v;

function logLine(id, layer, data) {
  const text = typeof data === 'string' ? data : JSON.stringify(mask(data));
  return '[req ' + id + '] ' + layer.padEnd(6) + ' ' + text;
}
` },
      giaiThich: `<p>Bẫy của bài: bản đầu ${c('app.js')} in nguyên mật khẩu. Che ở MỘT hàm log dùng chung an toàn hơn nhớ che ở từng chỗ gọi. Mã request gắn các dòng của cùng một request lại với nhau khi nhiều request chạy xen kẽ.</p>`,
      loiHayGap: ['Sửa object gốc khi che.', 'Không che trong mảng lồng.', 'Che theo giá trị thay vì theo khoá.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html',
      kiem: [
        { moTa: 'The login line from the lesson|||Dòng đăng nhập trong bài', goi: 'logLine(3, "http", { email: "an@example.com", password: "correct horse battery" })', mongDoi: '[req 3] http   {"email":"an@example.com","password":"***"}' },
        { moTa: 'Strings, padding, nested secrets|||Chuỗi, đệm, bí mật lồng nhau', goi: '[logLine(5, "auth", "session ok → user 1"), logLine(9, "sql", { headers: { Cookie: "sid=abc", Accept: "*/*" }, users: [{ id: 1, clientSecret: "s", Token: null }] })]', mongDoi: ['[req 5] auth   session ok → user 1', '[req 9] sql    {"headers":{"Cookie":"***","Accept":"*/*"},"users":[{"id":1,"clientSecret":"***","Token":"***"}]}'] },
        { moTa: 'The original object is untouched|||Object gốc không đổi', goi: '(() => { const body = { password: "p", nested: { sid: "x" } }; logLine(1, "http", body); return body; })()', mongDoi: { password: 'p', nested: { sid: 'x' } } },
      ],
    },
    {
      tieuDe: 'Cả máy chủ ghi chú trong một hàm',
      doKho: 'HARD', phut: 35,
      khaiNiem: ['request → response', 'phiên', 'phân quyền theo người dùng'], tienQuyet: ['Map', 'object'], the: ['javascript', 'full-stack'],
      moTa: `${BAI}<p>Viết ${c('createApp(users)')} trả ${c('{ handle }')}. ${c('users')}: ${c('[{ id, email, password }]')} (mật khẩu thô — chỉ để luyện). ${c('handle({ method, path, cookie, body })')} trả ${c('{ status, headers, body, log }')} (log = mảng chuỗi ${c('"<layer> <mô tả>"')} cho request này). Route: ${c('POST /login')} ${c('{ email, password }')} ⇒ đúng: 200 ${c('{ ok: true }')} + ${c('headers["Set-Cookie"] = "sid=s<N>; HttpOnly; SameSite=Lax; Path=/"')} (N = 1, 2, … theo lần đăng nhập), sai: 401 ${c('{ error: "wrong email or password" }')}. Dưới ${c('/api/notes')} cần cookie ${c('sid')} hợp lệ, không ⇒ 401 ${c('{ error: "log in first" }')}. ${c('GET /api/notes')} ⇒ 200 ${c('{ items: [{ id, title }] }')} CHỈ của người đó, theo id tăng dần. ${c('POST /api/notes')} ${c('{ title }')} ⇒ title trim rỗng: 422 ${c('{ errors: ["title is required"] }')}; được: 201 ${c('{ id, title }')} + ${c('Location: /api/notes/<id>')} (id tăng dần toàn hệ thống từ 1). ${c('DELETE /api/notes/:id')} ⇒ ghi chú của người đó: 204 body ${c('null')}; không có hoặc của người khác: 404 ${c('{ error: "not found" }')}. Route khác dưới /api/notes với phương thức sai ⇒ 405; còn lại 404 ${c('{ error: "not found" }')}. Log tối thiểu: ${c('"http <METHOD> <path>"')} đầu tiên và ${c('"reply <status>"')} cuối cùng.</p>`,
      yeuCau: ['Phiên bằng cookie sid.', 'Mỗi người chỉ thấy/xoá ghi chú của mình.', '401/404/405/422 đúng chỗ.', 'Log mở đầu và kết thúc.'],
      dauVao: 'users; request { method, path, cookie?, body? }.', dauRa: '{ status, headers, body, log }.',
      rangBuoc: ['Không có thư viện, không CSDL — dữ liệu trong Map/mảng của closure.', 'Xoá ghi chú của người khác trả 404 (không lộ sự tồn tại), không phải 403.'],
      viDu: [{ input: 'app.handle({ method: "POST", path: "/api/notes", body: { title: "x" } })', output: '{ status: 401, body: { error: "log in first" }, log: ["http POST /api/notes", "auth no valid session", "reply 401"], … }', explanation: 'Như lần curl không cookie trong bài.' }],
      goiY: ['const sessions = new Map(); const notes = []; let nextNote = 1, nextSid = 1;', 'Mỗi request: const log = []; const reply = (status, body, headers = {}) => { log.push("reply " + status); return { status, headers, body, log }; };'],
      khoiDau: { 'main.js': `// Bài 10.5 — cả máy chủ ghi chú trong một hàm
function createApp(users) {
  const notes = [];
  return {
    handle(req) {
      return { status: 200, headers: {}, body: { items: notes }, log: [] };
    },
  };
}
` },
      loiGiai: { 'main.js': `// Bài 10.5 — http → auth → valid → "sql" → reply, cho từng request; dữ liệu theo user_id
function createApp(users) {
  const sessions = new Map();              // sid → user id
  const notes = [];                        // { id, userId, title }
  let nextNote = 1;
  let nextSid = 1;

  function sidFrom(cookie) {
    for (const part of String(cookie ?? '').split(';')) {
      const [k, ...v] = part.trim().split('=');
      if (k === 'sid') return v.join('=');
    }
    return null;
  }

  function handle({ method, path, cookie, body }) {
    const log = ['http ' + method + ' ' + path];
    const reply = (status, payload, headers = {}) => { log.push('reply ' + status); return { status, headers, body: payload, log }; };

    if (path === '/login') {
      if (method !== 'POST') return reply(405, { error: 'method not allowed' }, { Allow: 'POST' });
      const u = users.find((x) => x.email === body?.email && x.password === body?.password);
      log.push('auth ' + (u ? 'password ok → user ' + u.id : 'wrong email or password'));
      if (!u) return reply(401, { error: 'wrong email or password' });
      const sid = 's' + nextSid++;
      sessions.set(sid, u.id);
      return reply(200, { ok: true }, { 'Set-Cookie': 'sid=' + sid + '; HttpOnly; SameSite=Lax; Path=/' });
    }

    const one = /^\\/api\\/notes\\/(\\d+)$/.exec(path);
    if (path !== '/api/notes' && !one) return reply(404, { error: 'not found' });

    const userId = sessions.get(sidFrom(cookie));
    log.push('auth ' + (userId ? 'session ok → user ' + userId : 'no valid session'));
    if (!userId) return reply(401, { error: 'log in first' });

    if (path === '/api/notes' && method === 'GET') {
      const items = notes.filter((n) => n.userId === userId).map(({ id, title }) => ({ id, title }));
      log.push('sql select ' + items.length + ' rows');
      return reply(200, { items });
    }
    if (path === '/api/notes' && method === 'POST') {
      const title = typeof body?.title === 'string' ? body.title.trim() : '';
      log.push('valid ' + (title ? 'ok' : 'rejected: title is required'));
      if (!title) return reply(422, { errors: ['title is required'] });
      const note = { id: nextNote++, userId, title };
      notes.push(note);
      log.push('sql insert id ' + note.id);
      return reply(201, { id: note.id, title }, { Location: '/api/notes/' + note.id });
    }
    if (one && method === 'DELETE') {
      const i = notes.findIndex((n) => n.id === Number(one[1]) && n.userId === userId);   // WHERE id = ? AND user_id = ?
      log.push('sql delete ' + (i < 0 ? 0 : 1) + ' rows');
      if (i < 0) return reply(404, { error: 'not found' });
      notes.splice(i, 1);
      return reply(204, null);
    }
    return reply(405, { error: 'method not allowed' }, { Allow: one ? 'DELETE' : 'GET, POST' });
  }

  return { handle };
}
` },
      giaiThich: `<p>Đây là ${c('server.mjs')} của bài học cộng bài luyện "xoá", không có mạng và CSDL để chấm được. Hai điều quan trọng nhất: mọi truy cập ghi chú đều kèm ${c('userId')} từ PHIÊN (không bao giờ từ body hay URL), và xoá ghi chú của người khác trả 404 giống hệt ghi chú không tồn tại — không cho kẻ dò biết id nào có thật (IDOR, Chương 6).</p>`,
      loiHayGap: ['Lấy userId từ body.', 'Trả 403 cho ghi chú người khác (lộ sự tồn tại).', 'GET trả ghi chú của mọi người.', 'Quên dòng "reply" trong log khi trả sớm.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html',
      kiem: [
        { moTa: 'No cookie, then login and the Set-Cookie header|||Không cookie, rồi đăng nhập và Set-Cookie', goi: '(() => { const app = createApp([{ id: 1, email: "an@example.com", password: "pw1" }]); const a = app.handle({ method: "POST", path: "/api/notes", body: { title: "x" } }); const b = app.handle({ method: "POST", path: "/login", body: { email: "an@example.com", password: "nope" } }); const c = app.handle({ method: "POST", path: "/login", body: { email: "an@example.com", password: "pw1" } }); return [a.status, a.body, a.log, b.status, c.status, c.headers["Set-Cookie"]]; })()', mongDoi: [401, { error: 'log in first' }, ['http POST /api/notes', 'auth no valid session', 'reply 401'], 401, 200, 'sid=s1; HttpOnly; SameSite=Lax; Path=/'] },
        { moTa: 'Create, validate and list|||Tạo, kiểm và liệt kê', goi: '(() => { const app = createApp([{ id: 1, email: "an@example.com", password: "pw1" }]); app.handle({ method: "POST", path: "/login", body: { email: "an@example.com", password: "pw1" } }); const ck = "theme=dark; sid=s1"; const a = app.handle({ method: "POST", path: "/api/notes", cookie: ck, body: { title: "  Ship the capstone " } }); const b = app.handle({ method: "POST", path: "/api/notes", cookie: ck, body: { title: "   " } }); const c = app.handle({ method: "GET", path: "/api/notes", cookie: ck }); return [a.status, a.body, a.headers.Location, b.status, b.body, c.body]; })()', mongDoi: [201, { id: 1, title: 'Ship the capstone' }, '/api/notes/1', 422, { errors: ['title is required'] }, { items: [{ id: 1, title: 'Ship the capstone' }] }] },
        { moTa: "Users never see or delete each other's notes|||Không ai thấy hay xoá ghi chú của người khác", goi: '(() => { const app = createApp([{ id: 1, email: "an@x.vn", password: "a" }, { id: 2, email: "binh@x.vn", password: "b" }]); app.handle({ method: "POST", path: "/login", body: { email: "an@x.vn", password: "a" } }); app.handle({ method: "POST", path: "/login", body: { email: "binh@x.vn", password: "b" } }); app.handle({ method: "POST", path: "/api/notes", cookie: "sid=s1", body: { title: "An note" } }); app.handle({ method: "POST", path: "/api/notes", cookie: "sid=s2", body: { title: "Binh note" } }); const steal = app.handle({ method: "DELETE", path: "/api/notes/1", cookie: "sid=s2" }); const binhList = app.handle({ method: "GET", path: "/api/notes", cookie: "sid=s2" }).body; const own = app.handle({ method: "DELETE", path: "/api/notes/1", cookie: "sid=s1" }); const anList = app.handle({ method: "GET", path: "/api/notes", cookie: "sid=s1" }).body; return [steal.status, binhList, own.status, own.body, anList]; })()', mongDoi: [404, { items: [{ id: 2, title: 'Binh note' }] }, 204, null, { items: [] }] },
        { moTa: '404 and 405 routes|||Route 404 và 405', goi: '(() => { const app = createApp([{ id: 1, email: "a", password: "b" }]); app.handle({ method: "POST", path: "/login", body: { email: "a", password: "b" } }); return [app.handle({ method: "GET", path: "/api/users", cookie: "sid=s1" }).status, app.handle({ method: "PUT", path: "/api/notes", cookie: "sid=s1" }).status, app.handle({ method: "GET", path: "/api/notes/1", cookie: "sid=s1" }).headers.Allow]; })()', mongDoi: [404, 405, 'DELETE'] },
      ],
    },
  ],
});
