/** Bộ luyện bài 6.3 — Mã trạng thái. Lược đồ: ./_luoc-do.mjs (loại 'js' + fetchGia). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Họ mã, res.ok, 401/403, chọn mã cho POST (415/400/422/201), thử lại hay không, chờ bao lâu (Retry-After), requestJson + HttpError. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 6.3 — Mã trạng thái.</em> Các bài là những quyết định mà máy chủ (chọn mã nào) và client (làm gì với mã đó) đưa ra mỗi ngày.</p>';
const FETCH_GIA = '<p><em>Máy chấm thay <code>fetch</code> bằng một máy chủ GIẢ trả dữ liệu cố định (không có mạng thật).</em></p>';

export default doiDau({
  slug: 'wf-6-3-status-codes',
  ten: '6.3 Mã trạng thái',
  baiHoc: 'Nền tảng Web — Bài 6.3 Status codes',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Họ mã theo chữ số đầu, res.ok, chọn 401 hay 403, chọn 415/400/422/201 cho một POST, quyết định có tự thử lại, tính thời gian chờ theo Retry-After, và hàm requestJson ném HttpError — 7 bài.',
  de: [
    {
      tieuDe: 'Họ của một mã',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['họ mã trạng thái'], tienQuyet: ['Number.isInteger', 'Math.floor'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('statusFamily(code)')} trả ${c('"informational"')} (1xx), ${c('"success"')} (2xx), ${c('"redirect"')} (3xx), ${c('"client-error"')} (4xx), ${c('"server-error"')} (5xx). Không phải số nguyên từ 100 tới 599 ⇒ ${c('"invalid"')}.</p>`,
      yeuCau: ['Dựa vào chữ số đầu.', 'Ngoài 100–599 hoặc không nguyên ⇒ invalid.'],
      dauVao: 'code: number.', dauRa: 'string.',
      rangBuoc: ['Không liệt kê từng mã — mã lạ như 418 vẫn phải đúng họ.'],
      viDu: [{ input: 'statusFamily(418)', output: '"client-error"', explanation: 'Chưa gặp 418 bao giờ vẫn biết đó là lỗi phía client.' }],
      goiY: ['if (!Number.isInteger(code) || code < 100 || code > 599) return "invalid";', 'const names = [, "informational", "success", …]; return names[Math.floor(code / 100)];'],
      khoiDau: { 'main.js': `// Bài 6.3 — họ của một mã
function statusFamily(code) {
  if (code === 200) return 'success';
  return 'client-error';
}
` },
      loiGiai: { 'main.js': `// Bài 6.3 — chữ số đầu là họ; mã chưa gặp vẫn xếp đúng họ
const FAMILIES = [null, 'informational', 'success', 'redirect', 'client-error', 'server-error'];
function statusFamily(code) {
  if (!Number.isInteger(code) || code < 100 || code > 599) return 'invalid';
  return FAMILIES[Math.floor(code / 100)];
}
` },
      giaiThich: `<p>Đặc tả yêu cầu client hiểu mọi mã lạ như mã x00 cùng họ — nên phân loại theo chữ số đầu là đúng chuẩn, không phải đường tắt.</p>`,
      loiHayGap: ['Liệt kê 200, 201, 204… và quên 206, 418.', 'Nhận 99 hay 600 như mã hợp lệ.'],
      thamKhao: 'https://www.rfc-editor.org/rfc/rfc9110#name-status-codes',
      kiem: [
        { moTa: 'One code per family|||Mỗi họ một mã', goi: '[101, 204, 304, 422, 503].map(statusFamily)', mongDoi: ['informational', 'success', 'redirect', 'client-error', 'server-error'] },
        { moTa: 'Unknown codes by first digit|||Mã lạ theo chữ số đầu', goi: '[218, 418, 451, 599].map(statusFamily)', mongDoi: ['success', 'client-error', 'client-error', 'server-error'] },
        { moTa: 'Out of range or not an integer|||Ngoài khoảng hoặc không nguyên', goi: '[99, 600, 200.5, NaN].map(statusFamily)', mongDoi: ['invalid', 'invalid', 'invalid', 'invalid'] },
      ],
    },
    {
      tieuDe: 'res.ok tự viết',
      doKho: 'EASY', phut: 5,
      khaiNiem: ['res.ok'], tienQuyet: ['so sánh'], the: ['javascript', 'fetch'],
      moTa: `${BAI}<p>Viết ${c('isOk(status)')} trả đúng như ${c('res.ok')} của fetch: ${c('true')} khi và chỉ khi ${c('status')} từ 200 tới 299.</p>`,
      yeuCau: ['200–299 ⇒ true, còn lại false.'],
      dauVao: 'status: number.', dauRa: 'boolean.',
      rangBuoc: ['304 không phải ok (dù fetch thường không bao giờ cho bạn thấy 304).'],
      viDu: [{ input: 'isOk(204)', output: 'true', explanation: 'Thành công dù không có phần thân.' }],
      goiY: ['status >= 200 && status <= 299', 'Không cần if — trả thẳng biểu thức.'],
      khoiDau: { 'main.js': `// Bài 6.3 — res.ok
function isOk(status) {
  return status === 200;
}
` },
      loiGiai: { 'main.js': `// Bài 6.3 — res.ok: mọi mã 2xx. 201 và 204 cũng là thành công;
// 3xx/4xx/5xx thì không. fetch KHÔNG ném lỗi cho 4xx/5xx — kiểm ok là việc của bạn.
function isOk(status) {
  return status >= 200 && status <= 299;
}
` },
      giaiThich: `<p>So ${c('=== 200')} là lỗi rất hay gặp: POST thành công trả 201, DELETE trả 204, và mã của bạn báo "lỗi" cho cả hai.</p>`,
      loiHayGap: ['status === 200 — 201/204 thành lỗi.', 'status < 400 — coi 3xx là thành công.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Response/ok',
      kiem: [
        { moTa: '200, 201, 204, 299 are ok|||200, 201, 204, 299 là ok', goi: '[200, 201, 204, 299].map(isOk)', mongDoi: [true, true, true, true] },
        { moTa: '199, 301, 304, 404, 500 are not|||199, 301, 304, 404, 500 thì không', goi: '[199, 301, 304, 404, 500].map(isOk)', mongDoi: [false, false, false, false, false] },
        { moTa: 'Edges: 300 and 100 are not ok|||Biên: 300 và 100 không ok', goi: '[isOk(300), isOk(100), isOk(206)]', mongDoi: [false, false, true] },
      ],
    },
    {
      tieuDe: '401 hay 403?',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['xác thực', 'phân quyền'], tienQuyet: ['object', 'includes'], the: ['javascript', 'http', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('authStatus(user, allowedRoles)')}: ${c('user')} là ${c('null')} (chưa đăng nhập) hoặc ${c('{ name, role, expired? }')}. Trả ${c('401')} nếu chưa đăng nhập HOẶC phiên đã hết hạn (${c('expired === true')}); ${c('403')} nếu đã đăng nhập mà ${c('role')} không nằm trong ${c('allowedRoles')}; còn lại ${c('200')}. ${c('allowedRoles')} rỗng nghĩa là mọi người đã đăng nhập đều được.</p>`,
      yeuCau: ['Chưa đăng nhập / hết hạn ⇒ 401.', 'Sai vai trò ⇒ 403.', 'Danh sách rỗng ⇒ ai đăng nhập cũng được.'],
      dauVao: 'user: object | null; allowedRoles: string[].', dauRa: '200 | 401 | 403.',
      rangBuoc: ['Kiểm 401 TRƯỚC 403.'],
      viDu: [{ input: 'authStatus({ name: "An", role: "user" }, ["admin"])', output: '403', explanation: 'Biết là ai, nhưng không được phép — đăng nhập lại cũng vô ích.' }],
      goiY: ['if (!user || user.expired) return 401;', 'if (allowedRoles.length && !allowedRoles.includes(user.role)) return 403;'],
      khoiDau: { 'main.js': `// Bài 6.3 — 401 hay 403
function authStatus(user, allowedRoles) {
  if (!allowedRoles.includes(user.role)) return 401;
  return 200;
}
` },
      loiGiai: { 'main.js': `// Bài 6.3 — 401 = "bạn là ai?"; 403 = "tôi biết bạn, và không"
function authStatus(user, allowedRoles) {
  if (!user || user.expired === true) return 401;                       // đăng nhập (lại) sẽ giúp
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) return 403;  // đăng nhập lại vô ích
  return 200;
}
` },
      giaiThich: `<p>Thứ tự quan trọng: với người chưa đăng nhập, ta chưa biết vai trò nên không thể nói 403. Front-end dựa vào phân biệt này: 401 ⇒ chuyển tới trang đăng nhập (hoặc làm mới token), 403 ⇒ hiện "không có quyền".</p>`,
      loiHayGap: ['Trả 403 cho người chưa đăng nhập.', 'Đọc user.role khi user là null ⇒ TypeError.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403',
      kiem: [
        { moTa: 'Not logged in or expired: 401|||Chưa đăng nhập hoặc hết hạn: 401', goi: '[authStatus(null, ["admin"]), authStatus({ name: "An", role: "admin", expired: true }, ["admin"])]', mongDoi: [401, 401] },
        { moTa: 'Wrong role: 403, right role: 200|||Sai vai trò: 403, đúng vai trò: 200', goi: '[authStatus({ name: "An", role: "user" }, ["admin"]), authStatus({ name: "Lan", role: "admin" }, ["admin", "editor"])]', mongDoi: [403, 200] },
        { moTa: 'Empty list: any logged-in user|||Danh sách rỗng: ai đăng nhập cũng được', goi: '[authStatus({ name: "An", role: "user" }, []), authStatus(null, [])]', mongDoi: [200, 401] },
      ],
    },
    {
      tieuDe: 'Chọn mã cho một POST',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['415', '400', '422', '201'], tienQuyet: ['try/catch', 'JSON.parse'], the: ['javascript', 'http', 'validation'],
      moTa: `${BAI}<p>Viết ${c('createStatus(contentType, rawBody)')} quyết định như ${c('POST /api/products')} của bài, trả ${c('{ status, errors }')}: Content-Type không bắt đầu bằng ${c('application/json')} (không phân biệt hoa thường, cho phép ${c('; charset=…')}) ⇒ 415; JSON hỏng ⇒ 400; giá trị sai ⇒ 422 với ${c('errors')} là mảng chứa ${c('"name is required"')} (name không phải chuỗi khác rỗng sau trim) và/hoặc ${c('"price must be a whole number ≥ 0"')}, đúng thứ tự đó; hợp lệ ⇒ 201. ${c('errors')} rỗng với mọi mã khác 422. Phần thân hợp lệ nhưng không phải object (vd ${c('[]')}, ${c('5')}) ⇒ 422 với cả hai lỗi.</p>`,
      yeuCau: ['415 trước 400 trước 422.', 'Content-Type không phân biệt hoa thường, có thể có charset.', 'Hai thông điệp lỗi đúng chữ, đúng thứ tự.'],
      dauVao: 'contentType: string | undefined; rawBody: string.', dauRa: '{ status, errors }.',
      rangBuoc: ['Một hàm tự đủ.'],
      viDu: [{ input: 'createStatus("application/json", \'{"name":"","price":-5}\')', output: '{ status: 422, errors: ["name is required", "price must be a whole number ≥ 0"] }', explanation: 'Đúng output curl trong bài.' }],
      goiY: ['(contentType ?? "").toLowerCase().startsWith("application/json")', 'let data; try { data = JSON.parse(rawBody); } catch { return { status: 400, errors: [] }; }'],
      khoiDau: { 'main.js': `// Bài 6.3 — chọn mã cho một POST
function createStatus(contentType, rawBody) {
  const data = JSON.parse(rawBody);
  if (!data.name) return { status: 400, errors: ['name is required'] };
  return { status: 200, errors: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 6.3 — 415 (định dạng) → 400 (không đọc nổi) → 422 (giá trị sai) → 201
function createStatus(contentType, rawBody) {
  if (!(contentType ?? '').toLowerCase().startsWith('application/json')) return { status: 415, errors: [] };
  let data;
  try { data = JSON.parse(rawBody); } catch { return { status: 400, errors: [] }; }
  const obj = data !== null && typeof data === 'object' && !Array.isArray(data) ? data : {};
  const errors = [];
  if (typeof obj.name !== 'string' || obj.name.trim() === '') errors.push('name is required');
  if (!Number.isInteger(obj.price) || obj.price < 0) errors.push('price must be a whole number ≥ 0');
  if (errors.length) return { status: 422, errors };
  return { status: 201, errors: [] };
}
` },
      giaiThich: `<p>Mỗi mã nói với client một điều khác: 415 — đổi định dạng; 400 — sửa cú pháp; 422 — sửa giá trị (và đây là danh sách); 201 — xong, kèm Location. Trả 500 khi ${c('JSON.parse')} ném (như code khởi đầu) là biến lỗi của người dùng thành "máy chủ hỏng".</p>`,
      loiHayGap: ['Để JSON.parse ném ra ngoài ⇒ 500.', 'Dừng ở lỗi đầu tiên — form chỉ tô đỏ được một ô mỗi lần.', 'So Content-Type bằng === — "application/json; charset=utf-8" bị từ chối.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/422',
      kiem: [
        { moTa: '415 for a form body|||415 cho phần thân dạng form', goi: '[createStatus("application/x-www-form-urlencoded", "name=Glue"), createStatus(undefined, "{}")]', mongDoi: [{ status: 415, errors: [] }, { status: 415, errors: [] }] },
        { moTa: '400 for broken JSON|||400 cho JSON hỏng', goi: 'createStatus("application/json", "{oops")', mongDoi: { status: 400, errors: [] } },
        { moTa: '422 lists every problem in order|||422 liệt kê mọi lỗi đúng thứ tự', goi: '[createStatus("application/json", \'{"name":"","price":-5}\'), createStatus("application/json", \'{"name":"Pen","price":2.5}\'), createStatus("application/json", "[]")]', mongDoi: [{ status: 422, errors: ['name is required', 'price must be a whole number ≥ 0'] }, { status: 422, errors: ['price must be a whole number ≥ 0'] }, { status: 422, errors: ['name is required', 'price must be a whole number ≥ 0'] }] },
        { moTa: '201 with charset and upper case|||201 với charset và chữ hoa', goi: 'createStatus("Application/JSON; charset=utf-8", \'{"name":"Tape","price":15000}\')', mongDoi: { status: 201, errors: [] } },
      ],
    },
    {
      tieuDe: 'Có nên tự thử lại?',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['thử lại', 'lỗi tạm thời', 'idempotent'], tienQuyet: ['includes', 'toán tử logic'], the: ['javascript', 'http', 'độ tin cậy'],
      moTa: `${BAI}<p>Viết ${c('shouldRetry(method, status, attempt)')}: ${c('status')} là ${c('0')} khi không có response (fetch ném lỗi mạng). Thử lại khi: ${c('attempt')} (số lần đã thử, bắt đầu từ 1) nhỏ hơn 3, VÀ method idempotent (GET, HEAD, OPTIONS, PUT, DELETE — không phân biệt hoa thường), VÀ lỗi là tạm thời: ${c('0')}, ${c('408')}, ${c('429')}, ${c('502')}, ${c('503')}, ${c('504')}. Mọi 4xx khác và 500 ⇒ không.</p>`,
      yeuCau: ['Tối đa 3 lần thử (attempt 1, 2 được thử lại; 3 thì không).', 'Chỉ method idempotent.', 'Chỉ lỗi tạm thời.'],
      dauVao: 'method: string; status: number; attempt: number.', dauRa: 'boolean.',
      rangBuoc: ['500 không thử lại: một lỗi lập trình sẽ lỗi y hệt lần sau.'],
      viDu: [{ input: 'shouldRetry("GET", 503, 1)', output: 'true', explanation: 'Máy chủ đang bận — lát nữa có thể được.' }, { input: 'shouldRetry("POST", 503, 1)', output: 'false', explanation: 'POST có thể đã được xử lý.' }],
      goiY: ['const TRANSIENT = [0, 408, 429, 502, 503, 504];', 'return attempt < 3 && IDEMPOTENT.includes(m) && TRANSIENT.includes(status);'],
      khoiDau: { 'main.js': `// Bài 6.3 — có nên tự thử lại?
function shouldRetry(method, status, attempt) {
  return status >= 400;
}
` },
      loiGiai: { 'main.js': `// Bài 6.3 — thử lại khi: còn lượt, lặp lại vô hại, và lỗi có thể tự hết
const IDEMPOTENT = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];
const TRANSIENT = [0, 408, 429, 502, 503, 504];          // 0 = không có response (lỗi mạng)
function shouldRetry(method, status, attempt) {
  return attempt < 3 && IDEMPOTENT.includes(method.toUpperCase()) && TRANSIENT.includes(status);
}
` },
      giaiThich: `<p>Ba điều kiện, mỗi cái chặn một thảm hoạ: không giới hạn lượt ⇒ vòng lặp vô tận đập vào máy chủ đang quá tải; không kiểm method ⇒ đơn hàng đôi; không kiểm mã ⇒ thử lại 404/422 vô ích mãi.</p>`,
      loiHayGap: ['Thử lại mọi status >= 400.', 'Quên lỗi mạng (status 0).', 'Không giới hạn số lần.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/503',
      kiem: [
        { moTa: 'Transient errors on GET retry|||Lỗi tạm thời với GET được thử lại', goi: '[0, 408, 429, 502, 503, 504].map((s) => shouldRetry("GET", s, 1))', mongDoi: [true, true, true, true, true, true] },
        { moTa: 'Permanent errors never retry|||Lỗi vĩnh viễn không thử lại', goi: '[400, 401, 404, 422, 500].map((s) => shouldRetry("GET", s, 1))', mongDoi: [false, false, false, false, false] },
        { moTa: 'POST/PATCH never; at most 3 attempts|||POST/PATCH không bao giờ; tối đa 3 lần', goi: '[shouldRetry("POST", 503, 1), shouldRetry("patch", 0, 1), shouldRetry("put", 503, 2), shouldRetry("GET", 503, 3)]', mongDoi: [false, false, true, false] },
      ],
    },
    {
      tieuDe: 'Chờ bao lâu trước khi thử lại?',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['Retry-After', 'exponential backoff'], tienQuyet: ['Number', 'Math.min'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('retryDelayMs(attempt, retryAfter)')}: nếu ${c('retryAfter')} (giá trị header ${c('Retry-After')}, chuỗi hoặc ${c('undefined')}) là một số nguyên giây không âm, chờ đúng số giây đó (đổi ra ms), tối đa 60 000 ms. Ngược lại dùng chờ tăng dần: ${c('200 × 2^(attempt − 1)')} ms, tối đa 5 000 ms. ${c('attempt')} bắt đầu từ 1.</p>`,
      yeuCau: ['Tôn trọng Retry-After (giây).', 'Trần 60 000 ms cho Retry-After.', 'Không có (hoặc sai) ⇒ 200, 400, 800… trần 5 000.'],
      dauVao: 'attempt: number; retryAfter?: string.', dauRa: 'number (ms).',
      rangBuoc: ['Retry-After dạng ngày giờ HTTP coi như không có (đơn giản hoá).'],
      viDu: [{ input: 'retryDelayMs(1, "60")', output: '60000', explanation: 'Máy chủ nói "thử lại sau 60 giây" — như output 429 của bài.' }],
      goiY: ['/^\\d+$/.test(retryAfter ?? "")', 'Math.min(200 * 2 ** (attempt - 1), 5000)'],
      khoiDau: { 'main.js': `// Bài 6.3 — chờ bao lâu
function retryDelayMs(attempt, retryAfter) {
  return 1000;
}
` },
      loiGiai: { 'main.js': `// Bài 6.3 — máy chủ nói thì nghe máy chủ; không thì chờ tăng gấp đôi mỗi lần
function retryDelayMs(attempt, retryAfter) {
  if (/^\\d+$/.test(String(retryAfter ?? '').trim())) {
    return Math.min(Number(retryAfter) * 1000, 60000);         // Retry-After tính bằng GIÂY
  }
  return Math.min(200 * 2 ** (attempt - 1), 5000);             // 200, 400, 800, 1600, 3200, rồi 5000
}
` },
      giaiThich: `<p>Thử lại ngay lập tức làm máy chủ đang quá tải càng quá tải hơn — hàng nghìn client cùng làm vậy là tự đánh sập nó. Chờ tăng dần (exponential backoff) giãn các lượt ra; thực tế còn thêm một chút ngẫu nhiên (jitter) để client không thử lại cùng lúc.</p>`,
      loiHayGap: ['Coi Retry-After là mili giây.', 'Không có trần — lần thử thứ 20 chờ vài ngày.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After',
      kiem: [
        { moTa: 'Retry-After in seconds, capped|||Retry-After tính giây, có trần', goi: '[retryDelayMs(1, "60"), retryDelayMs(4, "2"), retryDelayMs(1, "3600"), retryDelayMs(1, "0")]', mongDoi: [60000, 2000, 60000, 0] },
        { moTa: 'Backoff doubles up to 5 s|||Chờ tăng gấp đôi tới 5 giây', goi: '[1, 2, 3, 4, 5, 6, 10].map((a) => retryDelayMs(a))', mongDoi: [200, 400, 800, 1600, 3200, 5000, 5000] },
        { moTa: 'Invalid Retry-After falls back to backoff|||Retry-After sai thì dùng chờ tăng dần', goi: '[retryDelayMs(2, "soon"), retryDelayMs(2, "-5"), retryDelayMs(2, "Wed, 21 Oct 2026 07:28:00 GMT")]', mongDoi: [400, 400, 400] },
      ],
    },
    {
      tieuDe: 'requestJson và HttpError',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['lớp lỗi riêng', 'res.ok', 'Content-Type', '204'], tienQuyet: ['async/await', 'class', 'fetch'], the: ['javascript', 'fetch', 'http'],
      fetchGia: {
        '/api/products/1': { json: { id: 1, name: 'Notebook' }, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
        '/api/products/999': { status: 404, json: { error: 'Product 999 not found' }, headers: { 'Content-Type': 'application/json' } },
        'DELETE /api/products/1': { status: 204, text: '', headers: {} },
        '/api/crash': { status: 502, text: '<!doctype html><h1>502 Bad Gateway</h1>', headers: { 'Content-Type': 'text/html' } },
        '/api/hello': { text: 'hello', headers: { 'Content-Type': 'text/plain' } },
        '/api/offline': { loiMang: true },
      },
      moTa: `${BAI}${FETCH_GIA}<p>Viết lớp ${c('HttpError')} (kế thừa ${c('Error')}, ${c('name')} là ${c('"HttpError"')}, ${c('message')} là ${c('"HTTP <status>"')}, có thêm ${c('status')} và ${c('body')}) và hàm ${c('requestJson(url, init)')}: gọi ${c('fetch')}; đọc phần thân — JSON nếu Content-Type chứa ${c('application/json')}, chữ nếu không, ${c('null')} nếu status là 204; nếu ${c('!res.ok')} ném ${c('HttpError')} mang status và phần thân đã đọc; ngược lại trả phần thân. Lỗi mạng (fetch ném) để nguyên cho nó bay ra.</p>`,
      yeuCau: ['HttpError đúng name/message/status/body.', 'JSON hay chữ theo Content-Type — trang HTML lỗi không gây SyntaxError.', '204 ⇒ null.', 'Lỗi mạng không bị nuốt.'],
      dauVao: 'url: string; init?: object.', dauRa: 'Promise của dữ liệu.',
      rangBuoc: ['Chỉ đọc phần thân MỘT lần.'],
      viDu: [{ input: 'await requestJson("/api/products/999")', output: 'ném HttpError: HTTP 404, status 404, body { error: "Product 999 not found" }', explanation: 'Client hiển thị được body.error.' }],
      goiY: ['class HttpError extends Error { constructor(status, body) { super("HTTP " + status); this.name = "HttpError"; this.status = status; this.body = body; } }', 'const isJson = (res.headers.get("Content-Type") ?? "").includes("application/json");'],
      khoiDau: { 'main.js': `// Bài 6.3 — requestJson và HttpError
class HttpError extends Error {}

async function requestJson(url, init) {
  const res = await fetch(url, init);
  return res.json();
}
` },
      loiGiai: { 'main.js': `// Bài 6.3 — một chỗ duy nhất biến mọi response thành dữ liệu hoặc một lỗi có nghĩa
class HttpError extends Error {
  constructor(status, body) {
    super('HTTP ' + status);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

async function requestJson(url, init) {
  const res = await fetch(url, init);                       // chỉ ném khi KHÔNG có response
  const type = res.headers.get('Content-Type') ?? '';
  const body = res.status === 204 ? null
    : type.includes('application/json') ? await res.json()
    : await res.text();                                     // trang lỗi HTML ⇒ chữ, không SyntaxError
  if (!res.ok) throw new HttpError(res.status, body);
  return body;
}
` },
      giaiThich: `<p>Đây chính là hàm ở Bước 6 của bài. Component chỉ cần ${c('try/catch')} và hỏi ${c('err instanceof HttpError')} — có status thì là lỗi HTTP, không có thì là mất mạng. Đọc ${c('res.json()')} mà không nhìn Content-Type là cách nhận "Unexpected token '<'" khi proxy trả trang 502.</p>`,
      loiHayGap: ['Gọi res.json() cho mọi response — 502 HTML ném SyntaxError, mất status.', 'Đọc body hai lần (text rồi json) ⇒ TypeError.', 'Quên this.name ⇒ err.name là "Error".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Response/ok',
      kiem: [
        { moTa: '200 JSON returns data|||200 JSON trả dữ liệu', goi: 'await requestJson("/api/products/1")', mongDoi: { id: 1, name: 'Notebook' } },
        { moTa: '404 throws HttpError "HTTP 404"|||404 ném HttpError "HTTP 404"', goi: 'await requestJson("/api/products/999")', mongDoi: { loi: 'HttpError', thongDiep: '^HTTP 404$' } },
        { moTa: 'The error carries status and body|||Lỗi mang status và body', goi: 'await requestJson("/api/products/999").catch((e) => [e instanceof Error, e.status, e.body])', mongDoi: [true, 404, { error: 'Product 999 not found' }] },
        { moTa: 'HTML 502 page: HttpError with text, not SyntaxError|||Trang 502 HTML: HttpError kèm chữ, không SyntaxError', goi: 'await requestJson("/api/crash").catch((e) => [e.name, e.status, e.body])', mongDoi: ['HttpError', 502, '<!doctype html><h1>502 Bad Gateway</h1>'] },
        { moTa: '204 gives null; text/plain gives text|||204 cho null; text/plain cho chữ', goi: '[await requestJson("/api/products/1", { method: "DELETE" }), await requestJson("/api/hello")]', mongDoi: [null, 'hello'] },
        { moTa: 'Network errors are not swallowed|||Lỗi mạng không bị nuốt', goi: 'await requestJson("/api/offline")', mongDoi: { loi: 'TypeError' } },
      ],
    },
  ],
});
