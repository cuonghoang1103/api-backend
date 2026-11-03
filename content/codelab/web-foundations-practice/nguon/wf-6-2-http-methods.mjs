/** Bộ luyện bài 6.2 — HTTP method. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  An toàn / idempotent, thử lại được không, method + đường dẫn → hành động, PUT vs PATCH, header Allow, một kho sản phẩm trong bộ nhớ. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 6.2 — HTTP method.</em> Các bài dựng lại từng quyết định mà API sản phẩm của Chương 6 đưa ra cho mỗi method.</p>';

export default doiDau({
  slug: 'wf-6-2-http-methods',
  ten: '6.2 HTTP method',
  baiHoc: 'Nền tảng Web — Bài 6.2 HTTP methods',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Method an toàn và idempotent, khi nào được tự thử lại, method + đường dẫn → hành động (kèm 404/405), PUT thay thế và PATCH sửa một phần, dựng header Allow, rồi cả một kho sản phẩm trong bộ nhớ trả đúng 201/204/404/405 — 7 bài.',
  de: [
    {
      tieuDe: 'Method an toàn',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['safe method'], tienQuyet: ['mảng', 'includes'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('isSafe(method)')} trả ${c('true')} cho method an toàn — không đổi trạng thái máy chủ: ${c('GET')}, ${c('HEAD')}, ${c('OPTIONS')}, ${c('TRACE')}. Không phân biệt hoa thường (${c('"get"')} cũng là GET).</p>`,
      yeuCau: ['Bốn method an toàn.', 'Không phân biệt hoa thường.'],
      dauVao: 'method: string.', dauRa: 'boolean.',
      rangBuoc: ['Không dùng chuỗi if/else cho từng method — một danh sách là đủ.'],
      viDu: [{ input: 'isSafe("get")', output: 'true', explanation: 'Method được chuẩn hoá về chữ hoa.' }],
      goiY: ['method.toUpperCase()', '["GET", "HEAD", "OPTIONS", "TRACE"].includes(…)'],
      khoiDau: { 'main.js': `// Bài 6.2 — method an toàn
function isSafe(method) {
  return method === 'GET';
}
` },
      loiGiai: { 'main.js': `// Bài 6.2 — an toàn = không đổi trạng thái máy chủ.
// Trình duyệt, bot và bản xem trước link tự gửi các method này mà không hỏi ai,
// nên máy chủ KHÔNG BAO GIỜ được để chúng xoá hay sửa dữ liệu.
const SAFE = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
function isSafe(method) {
  return SAFE.includes(method.toUpperCase());
}
` },
      giaiThich: `<p>Trình duyệt, bot, bản xem trước link đều dựa vào danh sách này: chúng tự gửi GET/HEAD mà không hỏi ai. Đó là lý do bài học cấm mọi GET làm đổi dữ liệu.</p>`,
      loiHayGap: ['So khớp chữ thường — "Get" lọt.', 'Coi PUT là an toàn vì "lặp lại vẫn thế" — đó là idempotent, không phải an toàn.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP',
      kiem: [
        { moTa: 'GET, HEAD, OPTIONS are safe|||GET, HEAD, OPTIONS an toàn', goi: '["GET", "HEAD", "OPTIONS", "TRACE"].map(isSafe)', mongDoi: [true, true, true, true] },
        { moTa: 'Writing methods are not|||Method ghi thì không', goi: '["POST", "PUT", "PATCH", "DELETE"].map(isSafe)', mongDoi: [false, false, false, false] },
        { moTa: 'Case-insensitive|||Không phân biệt hoa thường', goi: '[isSafe("get"), isSafe("Head"), isSafe("delete")]', mongDoi: [true, true, false] },
      ],
    },
    {
      tieuDe: 'Method idempotent',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['idempotent'], tienQuyet: ['hàm', 'includes'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('isIdempotent(method)')}: các method an toàn (GET, HEAD, OPTIONS, TRACE) cộng ${c('PUT')} và ${c('DELETE')}. POST và PATCH không. Không phân biệt hoa thường.</p>`,
      yeuCau: ['An toàn ⇒ idempotent.', 'Thêm PUT, DELETE.', 'POST, PATCH ⇒ false.'],
      dauVao: 'method: string.', dauRa: 'boolean.',
      rangBuoc: ['Một danh sách hằng, không lặp lại logic của isSafe bằng tay.'],
      viDu: [{ input: 'isIdempotent("DELETE")', output: 'true', explanation: 'Xoá hai lần: trạng thái như xoá một lần (dù lần hai trả 404).' }],
      goiY: ['const m = method.toUpperCase();', '["GET", "HEAD", "OPTIONS", "TRACE", "PUT", "DELETE"].includes(m)'],
      khoiDau: { 'main.js': `// Bài 6.2 — method idempotent
function isIdempotent(method) {
  return method !== 'POST';
}
` },
      loiGiai: { 'main.js': `// Bài 6.2 — idempotent = lặp lại vẫn để lại cùng TRẠNG THÁI
const IDEMPOTENT = ['GET', 'HEAD', 'OPTIONS', 'TRACE', 'PUT', 'DELETE'];
function isIdempotent(method) {
  return IDEMPOTENT.includes(method.toUpperCase());
}
` },
      giaiThich: `<p>Idempotent nói về tác dụng, không về response: DELETE lần hai trả 404 nhưng sản phẩm đằng nào cũng đã mất. PATCH bị loại vì một bản vá có thể tương đối ("cộng 1 vào tồn kho").</p>`,
      loiHayGap: ['Cho PATCH là idempotent vì ví dụ của bạn tình cờ đặt giá trị tuyệt đối.', 'Quên các method an toàn.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent',
      kiem: [
        { moTa: 'PUT and DELETE are idempotent|||PUT và DELETE idempotent', goi: '[isIdempotent("PUT"), isIdempotent("DELETE"), isIdempotent("GET")]', mongDoi: [true, true, true] },
        { moTa: 'POST and PATCH are not|||POST và PATCH thì không', goi: '[isIdempotent("POST"), isIdempotent("PATCH")]', mongDoi: [false, false] },
        { moTa: 'Case-insensitive|||Không phân biệt hoa thường', goi: '[isIdempotent("put"), isIdempotent("patch")]', mongDoi: [true, false] },
      ],
    },
    {
      tieuDe: 'Được tự thử lại không?',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['thử lại', 'idempotency key'], tienQuyet: ['object', 'toLowerCase'], the: ['javascript', 'http', 'độ tin cậy'],
      moTa: `${BAI}<p>Viết ${c('canAutoRetry(method, headers)')}: ${c('true')} nếu method idempotent (GET, HEAD, OPTIONS, TRACE, PUT, DELETE), HOẶC nếu là POST/PATCH mà ${c('headers')} có ${c('Idempotency-Key')} khác rỗng (tên header không phân biệt hoa thường). ${c('headers')} có thể vắng.</p>`,
      yeuCau: ['Idempotent ⇒ true.', 'POST/PATCH có Idempotency-Key không rỗng ⇒ true.', 'Tên header không phân biệt hoa thường.'],
      dauVao: 'method: string; headers?: object.', dauRa: 'boolean.',
      rangBuoc: ['Một hàm tự đủ.'],
      viDu: [{ input: 'canAutoRetry("POST", { "idempotency-key": "order-7f3" })', output: 'true', explanation: 'Máy chủ sẽ không xử lý cùng khoá hai lần.' }],
      goiY: ['Object.entries(headers ?? {}).some(([k, v]) => k.toLowerCase() === "idempotency-key" && v !== "")', 'Kết hợp với danh sách idempotent.'],
      khoiDau: { 'main.js': `// Bài 6.2 — được tự thử lại không?
function canAutoRetry(method, headers) {
  return true;
}
` },
      loiGiai: { 'main.js': `// Bài 6.2 — chỉ tự thử lại khi lặp lại không gây hại
function canAutoRetry(method, headers = {}) {
  const m = method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS', 'TRACE', 'PUT', 'DELETE'].includes(m)) return true;
  const hasKey = Object.entries(headers).some(([k, v]) => k.toLowerCase() === 'idempotency-key' && String(v).trim() !== '');
  return (m === 'POST' || m === 'PATCH') && hasKey;
}
` },
      giaiThich: `<p>Một lớp bọc fetch "thử lại cho chắc" mà không có luật này sẽ tạo đơn hàng thứ hai trên mạng chậm. Idempotency key (Stripe, PayPal dùng) biến POST thành thứ lặp lại được an toàn: máy chủ nhớ khoá và trả lại kết quả cũ.</p>`,
      loiHayGap: ['Thử lại mọi request lỗi.', 'Chỉ tìm "Idempotency-Key" đúng hoa thường.'],
      thamKhao: 'https://docs.stripe.com/api/idempotent_requests',
      kiem: [
        { moTa: 'Idempotent methods retry|||Method idempotent được thử lại', goi: '[canAutoRetry("GET"), canAutoRetry("DELETE", {}), canAutoRetry("put")]', mongDoi: [true, true, true] },
        { moTa: 'POST without a key does not|||POST không có khoá thì không', goi: '[canAutoRetry("POST"), canAutoRetry("POST", { "Content-Type": "application/json" }), canAutoRetry("PATCH", { "Idempotency-Key": "" })]', mongDoi: [false, false, false] },
        { moTa: 'POST with a key (any case) does|||POST có khoá (hoa thường gì cũng được) thì có', goi: '[canAutoRetry("POST", { "Idempotency-Key": "order-7f3" }), canAutoRetry("post", { "idempotency-key": "a1" })]', mongDoi: [true, true] },
      ],
    },
    {
      tieuDe: 'Method + đường dẫn → hành động',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['tập hợp', 'phần tử', '404 vs 405'], tienQuyet: ['split', 'regex'], the: ['javascript', 'rest'],
      moTa: `${BAI}<p>Viết ${c('routeAction(method, path)')} cho API sản phẩm: ${c('/api/products')} (tập hợp) và ${c('/api/products/<số>')} (phần tử, id chỉ gồm chữ số). Trả một trong: ${c('"list"')} (GET tập hợp), ${c('"create"')} (POST tập hợp), ${c('"read"')} (GET phần tử), ${c('"replace"')} (PUT), ${c('"update"')} (PATCH), ${c('"delete"')} (DELETE phần tử); đường dẫn đúng mà method không hợp ⇒ ${c('"not-allowed"')}; đường dẫn không khớp ⇒ ${c('"not-found"')}. Bỏ query string (phần sau ${c('?')}) trước khi so; method không phân biệt hoa thường.</p>`,
      yeuCau: ['Phân biệt tập hợp và phần tử.', 'not-allowed khác not-found.', 'Bỏ query string.'],
      dauVao: 'method: string; path: string.', dauRa: 'string.',
      rangBuoc: ['HEAD xử lý như GET.'],
      viDu: [{ input: 'routeAction("PATCH", "/api/products/2")', output: '"update"', explanation: 'Phần tử + PATCH.' }, { input: 'routeAction("POST", "/api/products/1")', output: '"not-allowed"', explanation: 'Địa chỉ có, method không — máy chủ trả 405.' }],
      goiY: ['const p = path.split("?")[0];', 'const isItem = /^\\/api\\/products\\/\\d+$/.test(p);'],
      khoiDau: { 'main.js': `// Bài 6.2 — method + đường dẫn → hành động
function routeAction(method, path) {
  if (method === 'GET') return 'list';
  return 'not-found';
}
` },
      loiGiai: { 'main.js': `// Bài 6.2 — đường dẫn gọi tên đồ vật, method gọi tên hành động
function routeAction(method, path) {
  const m = method.toUpperCase() === 'HEAD' ? 'GET' : method.toUpperCase();
  const p = path.split('?')[0];
  const table = /^\\/api\\/products$/.test(p)
    ? { GET: 'list', POST: 'create' }                                       // tập hợp
    : /^\\/api\\/products\\/\\d+$/.test(p)
      ? { GET: 'read', PUT: 'replace', PATCH: 'update', DELETE: 'delete' } // một phần tử
      : null;
  if (!table) return 'not-found';                                          // 404
  return table[m] ?? 'not-allowed';                                        // 405
}
` },
      giaiThich: `<p>Hai địa chỉ, sáu hành động — đúng bảng ở Bước 1 của bài. Phân biệt 404 và 405 giúp client biết sửa gì: sai địa chỉ hay sai method. Express làm việc tra bảng này cho bạn với ${c("app.get('/api/products/:id', …)")}.</p>`,
      loiHayGap: ['Không bỏ query — "/api/products?page=2" thành not-found.', 'Trả not-found cho POST /api/products/1 (phải là not-allowed).'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/405',
      kiem: [
        { moTa: 'The six actions|||Sáu hành động', goi: '[["GET","/api/products"],["POST","/api/products"],["GET","/api/products/3"],["PUT","/api/products/3"],["PATCH","/api/products/3"],["DELETE","/api/products/3"]].map(([m, p]) => routeAction(m, p))', mongDoi: ['list', 'create', 'read', 'replace', 'update', 'delete'] },
        { moTa: '405 vs 404|||405 và 404', goi: '[routeAction("POST", "/api/products/1"), routeAction("DELETE", "/api/products"), routeAction("GET", "/api/product"), routeAction("GET", "/api/products/abc")]', mongDoi: ['not-allowed', 'not-allowed', 'not-found', 'not-found'] },
        { moTa: 'Query ignored, HEAD = GET, lower-case method|||Bỏ query, HEAD = GET, method chữ thường', goi: '[routeAction("GET", "/api/products?page=2&limit=5"), routeAction("HEAD", "/api/products/1"), routeAction("patch", "/api/products/9")]', mongDoi: ['list', 'read', 'update'] },
      ],
    },
    {
      tieuDe: 'PUT thay thế, PATCH sửa một phần',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['PUT', 'PATCH', 'không đột biến'], tienQuyet: ['spread', 'object'], the: ['javascript', 'rest'],
      moTa: `${BAI}<p>Viết ${c('applyUpdate(method, stored, body)')} trả sản phẩm MỚI (không sửa ${c('stored')}). ${c('PUT')}: phần thân thành sản phẩm — ${c('{ id: stored.id, name: body.name, price: body.price, category: body.category ?? "other" }')}. ${c('PATCH')}: giữ mọi trường cũ, đè các trường có trong ${c('body')}. Cả hai: ${c('id')} luôn lấy từ ${c('stored')}, kể cả khi body cố đổi nó. Method khác ⇒ ném ${c('TypeError')}.</p>`,
      yeuCau: ['PUT bỏ trường vắng (category về "other").', 'PATCH giữ trường cũ.', 'id không đổi.', 'Không sửa stored.'],
      dauVao: 'method: string; stored: object; body: object.', dauRa: 'object mới.',
      rangBuoc: ['Đúng như máy chủ trong bài (server.mjs).'],
      viDu: [{ input: 'applyUpdate("PUT", { id: 2, name: "Desk lamp", price: 320000, category: "home" }, { name: "Desk lamp", price: 299000 })', output: '{ id: 2, name: "Desk lamp", price: 299000, category: "other" }', explanation: 'Output curl thật trong bài: category bị mất.' }],
      goiY: ['PATCH: { ...stored, ...body, id: stored.id }', 'Đặt id SAU spread để body không đè được.'],
      khoiDau: { 'main.js': `// Bài 6.2 — PUT và PATCH
function applyUpdate(method, stored, body) {
  return Object.assign(stored, body);
}
` },
      loiGiai: { 'main.js': `// Bài 6.2 — PUT = phiên bản mới đầy đủ; PATCH = chỉ các trường gửi lên
function applyUpdate(method, stored, body) {
  const m = method.toUpperCase();
  if (m === 'PUT') return { id: stored.id, name: body.name, price: body.price, category: body.category ?? 'other' };
  if (m === 'PATCH') return { ...stored, ...body, id: stored.id };   // id gán sau cùng
  throw new TypeError('applyUpdate: expected PUT or PATCH, got ' + method);
}
` },
      giaiThich: `<p>Đây chính là hai dòng của server.mjs mà bài trích. ${c('Object.assign(stored, body)')} ở code khởi đầu sai hai lần: nó sửa luôn bản đang lưu (đột biến) và để body đổi được id.</p>`,
      loiHayGap: ['Đột biến stored.', 'Để body.id đè id thật.', 'Dùng PATCH cho PUT — form chỉ có tên làm mất trường khác ở chiều ngược lại.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH',
      kiem: [
        { moTa: 'PUT drops missing fields (the lesson output)|||PUT bỏ trường vắng (output của bài)', goi: 'applyUpdate("PUT", { id: 2, name: "Desk lamp", price: 320000, category: "home" }, { name: "Desk lamp", price: 299000 })', mongDoi: { id: 2, name: 'Desk lamp', price: 299000, category: 'other' } },
        { moTa: 'PATCH keeps the rest|||PATCH giữ phần còn lại', goi: 'applyUpdate("PATCH", { id: 2, name: "Desk lamp", price: 320000, category: "home" }, { price: 299000 })', mongDoi: { id: 2, name: 'Desk lamp', price: 299000, category: 'home' } },
        { moTa: 'id cannot change; stored not mutated|||id không đổi được; stored không bị sửa', chuanBi: 'const s = { id: 5, name: "Pen", price: 5000, category: "office" }; const r = applyUpdate("patch", s, { id: 99, name: "Pen 2" });', goi: '[r.id, r.name, s.name]', mongDoi: [5, 'Pen 2', 'Pen'] },
        { moTa: 'Other methods throw TypeError|||Method khác ném TypeError', goi: 'applyUpdate("POST", { id: 1 }, {})', mongDoi: { loi: 'TypeError' } },
      ],
    },
    {
      tieuDe: 'Dựng header Allow',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['405', 'header Allow'], tienQuyet: ['filter', 'Set'], the: ['javascript', 'http'],
      moTa: `${BAI}<p>Viết ${c('allowHeader(routes, path)')}: ${c('routes')} là mảng chuỗi dạng ${c('"GET /api/products"')}. Trả giá trị header ${c('Allow')} cho ${c('path')} (so khớp nguyên văn): các method của path đó, KHÔNG trùng, sắp theo thứ tự ${c('GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS')}, nối bằng ${c('", "')}. Có GET thì tự thêm HEAD. Không route nào ⇒ ${c('null')}.</p>`,
      yeuCau: ['Lọc đúng path.', 'GET ⇒ thêm HEAD.', 'Sắp theo thứ tự cố định, không trùng.', 'Không có ⇒ null.'],
      dauVao: 'routes: string[]; path: string.', dauRa: 'string hoặc null.',
      rangBuoc: ['Method trong routes luôn viết hoa.'],
      viDu: [{ input: 'allowHeader(["POST /api/products", "GET /api/products"], "/api/products")', output: '"GET, HEAD, POST"', explanation: 'Đúng header máy chủ của bài gửi kèm 405.' }],
      goiY: ['const methods = new Set(routes.filter((r) => r.split(" ")[1] === path).map((r) => r.split(" ")[0]));', 'ORDER.filter((m) => methods.has(m)).join(", ")'],
      khoiDau: { 'main.js': `// Bài 6.2 — header Allow
function allowHeader(routes, path) {
  return routes.map((r) => r.split(' ')[0]).join(', ');
}
` },
      loiGiai: { 'main.js': `// Bài 6.2 — Allow liệt kê method mà một địa chỉ nhận
const ORDER = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
function allowHeader(routes, path) {
  const methods = new Set();
  for (const r of routes) {
    const [m, p] = r.split(' ');
    if (p === path) methods.add(m);
  }
  if (methods.size === 0) return null;
  if (methods.has('GET')) methods.add('HEAD');          // máy chủ HTTP trả HEAD cho mọi GET
  return ORDER.filter((m) => methods.has(m)).join(', ');
}
` },
      giaiThich: `<p>Response 405 nên kèm ${c('Allow')} để client biết đổi sang method nào. Express tự trả nó khi bạn gọi ${c('app.route(…).all(…)')} đúng cách; dựng tay một lần giúp bạn đọc được nó khi gỡ lỗi.</p>`,
      loiHayGap: ['Không lọc theo path — Allow liệt kê method của địa chỉ khác.', 'Trùng lặp khi một method khai hai lần.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Allow',
      kiem: [
        { moTa: 'Collection: GET, HEAD, POST|||Tập hợp: GET, HEAD, POST', goi: 'allowHeader(["POST /api/products", "GET /api/products", "GET /api/products/:id", "DELETE /api/products/:id"], "/api/products")', mongDoi: 'GET, HEAD, POST' },
        { moTa: 'Item: fixed order, no duplicates|||Phần tử: đúng thứ tự, không trùng', goi: 'allowHeader(["DELETE /p/:id", "PATCH /p/:id", "GET /p/:id", "PUT /p/:id", "PATCH /p/:id"], "/p/:id")', mongDoi: 'GET, HEAD, PUT, PATCH, DELETE' },
        { moTa: 'No GET means no HEAD; unknown path is null|||Không GET thì không HEAD; path lạ trả null', goi: '[allowHeader(["POST /login"], "/login"), allowHeader(["GET /a"], "/b")]', mongDoi: ['POST', null] },
      ],
    },
    {
      tieuDe: 'Một kho sản phẩm trong bộ nhớ',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['CRUD', '201/204/404/405', 'trạng thái trong closure'], tienQuyet: ['closure', 'mảng'], the: ['javascript', 'rest', 'http'],
      moTa: `${BAI}<p>Viết ${c('createStore()')} trả hàm ${c('handle(method, path, body)')} mô phỏng API của bài (không có mạng — chỉ logic), trả ${c('{ status, body }')}. Kho bắt đầu RỖNG, id tăng từ 1. Luật: ${c('GET /api/products')} → 200, mảng sản phẩm; ${c('POST /api/products')} → 201, sản phẩm mới ${c('{ id, name, price, category: body.category ?? "other" }')}; ${c('GET /api/products/:id')} → 200; ${c('PUT')}/${c('PATCH')} → 200 như bài trước; ${c('DELETE')} → 204, ${c('body: null')}; id không có → 404 ${c('{ error: "Product <id> not found" }')}; method không hợp → 405 ${c('{ error: "Method not allowed" }')}; đường dẫn khác → 404 ${c('{ error: "Not found" }')}.</p>`,
      yeuCau: ['Mỗi createStore() là một kho riêng.', 'POST hai lần ⇒ hai id khác nhau.', 'DELETE lần hai ⇒ 404.', 'Không trả tham chiếu tới dữ liệu bên trong (trả bản sao).'],
      dauVao: 'method, path: string; body?: object.', dauRa: '{ status: number, body }.',
      rangBuoc: ['Không cần kiểm dữ liệu (validation để Bài 6.3).'],
      viDu: [{ input: 'h("POST", "/api/products", { name: "Ruler", price: 8000 }) hai lần', output: '201 id 1, rồi 201 id 2', explanation: 'POST không idempotent.' }],
      goiY: ['let items = []; let nextId = 1; return function handle(method, path, body) { … }', 'const m = path.match(/^\\/api\\/products(?:\\/(\\d+))?$/);'],
      khoiDau: { 'main.js': `// Bài 6.2 — kho sản phẩm trong bộ nhớ
function createStore() {
  const items = [];
  return function handle(method, path, body) {
    items.push(body);
    return { status: 200, body: items };
  };
}
` },
      loiGiai: { 'main.js': `// Bài 6.2 — API sản phẩm không có mạng: method + đường dẫn → mã + phần thân
function createStore() {
  let items = [];
  let nextId = 1;
  const copy = (p) => ({ ...p });
  return function handle(method, path, body = {}) {
    const m = method.toUpperCase();
    const match = path.match(/^\\/api\\/products(?:\\/(\\d+))?$/);
    if (!match) return { status: 404, body: { error: 'Not found' } };
    if (match[1] === undefined) {                                   // tập hợp
      if (m === 'GET') return { status: 200, body: items.map(copy) };
      if (m === 'POST') {
        const p = { id: nextId++, name: body.name, price: body.price, category: body.category ?? 'other' };
        items.push(p);
        return { status: 201, body: copy(p) };
      }
      return { status: 405, body: { error: 'Method not allowed' } };
    }
    const id = Number(match[1]);                                    // một phần tử
    const i = items.findIndex((p) => p.id === id);
    if (!['GET', 'PUT', 'PATCH', 'DELETE'].includes(m)) return { status: 405, body: { error: 'Method not allowed' } };
    if (i < 0) return { status: 404, body: { error: ´Product @{id} not found´ } };
    if (m === 'GET') return { status: 200, body: copy(items[i]) };
    if (m === 'DELETE') { items = items.filter((p) => p.id !== id); return { status: 204, body: null }; }
    items[i] = m === 'PUT'
      ? { id, name: body.name, price: body.price, category: body.category ?? 'other' }
      : { ...items[i], ...body, id };
    return { status: 200, body: copy(items[i]) };
  };
}
` },
      giaiThich: `<p>Đây là toàn bộ "bộ não" của server.mjs khi bỏ phần mạng: tra địa chỉ, tra method, đổi trạng thái, chọn mã. Bài 5 của Node.js dựng lại đúng thứ này bằng Express và một cơ sở dữ liệu thật. Kiểm 405 TRƯỚC 404 (với phần tử) hay sau là lựa chọn thiết kế; ở đây method sai được báo trước.</p>`,
      loiHayGap: ['Dùng biến toàn cục — hai kho dùng chung dữ liệu.', 'Trả chính object bên trong — người gọi sửa được kho mà không qua API.', 'DELETE lần hai trả 204.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/CRUD',
      kiem: [
        { moTa: 'POST twice creates ids 1 and 2|||POST hai lần tạo id 1 và 2', chuanBi: 'const h = createStore(); const a = h("POST", "/api/products", { name: "Ruler", price: 8000 }); const b = h("POST", "/api/products", { name: "Ruler", price: 8000 });', goi: '[a, b]', mongDoi: [{ status: 201, body: { id: 1, name: 'Ruler', price: 8000, category: 'other' } }, { status: 201, body: { id: 2, name: 'Ruler', price: 8000, category: 'other' } }] },
        { moTa: 'PATCH keeps, PUT replaces|||PATCH giữ, PUT thay', chuanBi: 'const h = createStore(); h("POST", "/api/products", { name: "Desk lamp", price: 320000, category: "home" });', goi: '[h("PATCH", "/api/products/1", { price: 299000 }).body.category, h("PUT", "/api/products/1", { name: "Desk lamp", price: 299000 }).body.category]', mongDoi: ['home', 'other'] },
        { moTa: 'DELETE twice: 204 then 404|||DELETE hai lần: 204 rồi 404', chuanBi: 'const h = createStore(); h("POST", "/api/products", { name: "A", price: 1 });', goi: '[h("DELETE", "/api/products/1"), h("DELETE", "/api/products/1"), h("GET", "/api/products")]', mongDoi: [{ status: 204, body: null }, { status: 404, body: { error: 'Product 1 not found' } }, { status: 200, body: [] }] },
        { moTa: '405 and 404 for wrong method / path|||405 và 404 cho sai method / đường dẫn', chuanBi: 'const h = createStore();', goi: '[h("POST", "/api/products/1").status, h("DELETE", "/api/products").status, h("GET", "/api/users").status, h("GET", "/api/products/9").status]', mongDoi: [405, 405, 404, 404] },
        { moTa: 'Stores are separate; data is copied|||Các kho tách biệt; dữ liệu được sao chép', chuanBi: 'const h1 = createStore(); const h2 = createStore(); h1("POST", "/api/products", { name: "A", price: 1 }); const list = h1("GET", "/api/products").body; list[0].name = "HACKED";', goi: '[h2("GET", "/api/products").body.length, h1("GET", "/api/products/1").body.name]', mongDoi: [0, 'A'] },
      ],
    },
  ],
});
