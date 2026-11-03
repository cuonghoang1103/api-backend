/** Bộ luyện bài 6.5 — REST, tham số đường dẫn và query string. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Dựng/đọc query string, khớp route có :tham số, kiểm tham số danh sách, lọc-sắp-chia trang, chặn IDOR, và một bộ định tuyến 404/405. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 6.5 — REST, tham số đường dẫn và query string.</em> Các bài là những mảnh mà Express làm giúp bạn sau này — tự viết một lần để biết chúng làm gì.</p>';

const SP = '[{ id: 1, name: "Notebook", price: 25000, category: "office" }, { id: 2, name: "Desk lamp", price: 320000, category: "home" }, { id: 3, name: "Pen", price: 5000, category: "office" }, { id: 4, name: "Mug", price: 60000, category: "home" }, { id: 5, name: "Stapler", price: 45000, category: "office" }]';

export default doiDau({
  slug: 'wf-6-5-rest-params-query',
  ten: '6.5 REST, tham số và query string',
  baiHoc: 'Nền tảng Web — Bài 6.5 REST APIs, path parameters and query strings',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Dựng và đọc query string bằng URLSearchParams, khớp route có :tham số, kiểm page/limit/sort và trả lỗi rõ, lọc-sắp-chia trang danh sách, chặn IDOR bằng kiểm chủ sở hữu, và bộ định tuyến trả 200/404/405 kèm Allow — 7 bài.',
  de: [
    {
      tieuDe: 'Dựng query string',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['query string', 'mã hoá', 'URLSearchParams'], tienQuyet: ['object', 'mảng'], the: ['javascript', 'url'],
      moTa: `${BAI}<p>Viết ${c('buildQuery(params)')} trả query string bắt đầu bằng ${c('?')} — hoặc chuỗi rỗng nếu không còn tham số nào. Bỏ giá trị ${c('undefined')}, ${c('null')} và ${c('""')}; mảng ⇒ lặp tên cho từng phần tử; số ⇒ chuỗi. Mã hoá bằng ${c('URLSearchParams')} (dấu cách thành ${c('+')}, ${c('&')} thành ${c('%26')}).</p>`,
      yeuCau: ['Bỏ undefined/null/"".', 'Mảng lặp tên.', 'Rỗng ⇒ "".', 'Mã hoá đúng.'],
      dauVao: 'params: object.', dauRa: 'string.',
      rangBuoc: ['Không tự ghép bằng + hay template string.'],
      viDu: [{ input: 'buildQuery({ q: "bút & sổ", page: 2, sort: undefined })', output: '"?q=b%C3%BAt+%26+s%E1%BB%95&page=2"', explanation: '& trong giá trị phải được mã hoá, nếu không nó mở một cặp mới.' }],
      goiY: ['const sp = new URLSearchParams(); for (const [k, v] of Object.entries(params)) …', 'Array.isArray(v) ? v.forEach((x) => sp.append(k, x)) : sp.append(k, v)'],
      khoiDau: { 'main.js': `// Bài 6.5 — dựng query string
function buildQuery(params) {
  return '?' + Object.entries(params).map(([k, v]) => k + '=' + v).join('&');
}
` },
      loiGiai: { 'main.js': `// Bài 6.5 — URLSearchParams mã hoá giúp: dấu cách, &, #, chữ có dấu
function buildQuery(params) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (v === undefined || v === null || v === '') continue;   // tham số tuỳ chọn bị bỏ
      sp.append(key, String(v));
    }
  }
  const s = sp.toString();
  return s ? '?' + s : '';
}
` },
      giaiThich: `<p>Code khởi đầu là đúng bản "by hand" trong output của bài: ${c('&')} trong "bút & sổ" cắt giá trị làm đôi, và ${c('undefined')} bị gửi thành chữ "undefined". Bỏ tham số rỗng giúp URL gọn và để máy chủ dùng giá trị mặc định.</p>`,
      loiHayGap: ['Ghép chuỗi tay — & và # phá query.', 'Gửi "sort=undefined".', 'Trả "?" khi không có gì.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
      kiem: [
        { moTa: 'Encodes and skips empty values|||Mã hoá và bỏ giá trị rỗng', goi: 'buildQuery({ q: "bút & sổ", page: 2, sort: undefined, tag: null, x: "" })', mongDoi: '?q=b%C3%BAt+%26+s%E1%BB%95&page=2' },
        { moTa: 'Arrays repeat the name|||Mảng lặp tên', goi: 'buildQuery({ tag: ["a", "b"], limit: 10 })', mongDoi: '?tag=a&tag=b&limit=10' },
        { moTa: 'Nothing left gives an empty string|||Không còn gì trả chuỗi rỗng', goi: '[buildQuery({}), buildQuery({ a: undefined, b: "" })]', mongDoi: ['', ''] },
      ],
    },
    {
      tieuDe: 'Đọc query string',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['query string', 'khoá lặp'], tienQuyet: ['URLSearchParams', 'object'], the: ['javascript', 'url'],
      moTa: `${BAI}<p>Viết ${c('parseQuery(search)')} nhận phần query (có hoặc không có ${c('?')} ở đầu) và trả object: giá trị đã giải mã, LUÔN là chuỗi; tên xuất hiện nhiều lần ⇒ mảng theo thứ tự xuất hiện (như ${c('req.query')} của Express).</p>`,
      yeuCau: ['Chấp nhận có hoặc không có "?".', 'Giải mã (+ ⇒ dấu cách, %C3%BA ⇒ ú).', 'Khoá lặp ⇒ mảng.', 'Giá trị luôn là chuỗi.'],
      dauVao: 'search: string.', dauRa: 'object.',
      rangBuoc: ['Không đổi "2" thành số — đó là việc của bước kiểm tra.'],
      viDu: [{ input: 'parseQuery("?tag=a&tag=b&page=2")', output: '{ tag: ["a", "b"], page: "2" }', explanation: 'page vẫn là chuỗi "2".' }],
      goiY: ['for (const [k, v] of new URLSearchParams(search)) …', 'k in out ? (Array.isArray(out[k]) ? out[k].push(v) : out[k] = [out[k], v]) : out[k] = v'],
      khoiDau: { 'main.js': `// Bài 6.5 — đọc query string
function parseQuery(search) {
  return Object.fromEntries(new URLSearchParams(search));
}
` },
      loiGiai: { 'main.js': `// Bài 6.5 — giống req.query: chuỗi đã giải mã; khoá lặp thành mảng
function parseQuery(search) {
  const out = {};
  for (const [key, value] of new URLSearchParams(search)) {   // tự bỏ "?" đầu và giải mã
    if (!(key in out)) out[key] = value;
    else if (Array.isArray(out[key])) out[key].push(value);
    else out[key] = [out[key], value];
  }
  return out;
}
` },
      giaiThich: `<p>${c('Object.fromEntries')} của code khởi đầu âm thầm giữ giá trị CUỐI của khoá lặp. Mảng là điều Express trả cho ${c('?tag=a&tag=b')} — và cũng là lý do ${c('req.query.page')} có thể là mảng khi kẻ xấu gửi ${c('?page=1&page=2')}: luôn kiểm kiểu.</p>`,
      loiHayGap: ['Mất giá trị của khoá lặp.', 'Đổi sang số ở đây.'],
      thamKhao: 'https://expressjs.com/en/api.html#req.query',
      kiem: [
        { moTa: 'Decoded strings, with or without ?|||Chuỗi đã giải mã, có hoặc không có ?', goi: '[parseQuery("?q=desk+lamp&page=2"), parseQuery("q=b%C3%BAt")]', mongDoi: [{ q: 'desk lamp', page: '2' }, { q: 'bút' }] },
        { moTa: 'Repeated keys become arrays|||Khoá lặp thành mảng', goi: 'parseQuery("tag=a&tag=b&tag=c&x=1")', mongDoi: { tag: ['a', 'b', 'c'], x: '1' } },
        { moTa: 'Empty query|||Query rỗng', goi: '[parseQuery(""), parseQuery("?")]', mongDoi: [{}, {}] },
      ],
    },
    {
      tieuDe: 'Khớp route có tham số',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['tham số đường dẫn', ':id', 'decodeURIComponent'], tienQuyet: ['split', 'vòng lặp'], the: ['javascript', 'rest', 'routing'],
      moTa: `${BAI}<p>Viết ${c('matchRoute(pattern, path)')} như Express: ${c('pattern')} như ${c('"/api/users/:userId/posts/:postId"')}. Trả object tham số (đã ${c('decodeURIComponent')}) nếu khớp, ${c('null')} nếu không. Khớp khi số đoạn bằng nhau, đoạn thường giống hệt, đoạn ${c(':tên')} khớp mọi đoạn KHÔNG rỗng. Bỏ query string của ${c('path')}; một dấu ${c('/')} thừa ở cuối path được chấp nhận.</p>`,
      yeuCau: ['Tách theo "/".', 'Đoạn :tên bắt giá trị đã giải mã.', 'Bỏ query, chấp nhận "/" cuối.', 'Không khớp ⇒ null.'],
      dauVao: 'pattern: string; path: string.', dauRa: 'object hoặc null.',
      rangBuoc: ['Không dùng thư viện (path-to-regexp…).'],
      viDu: [{ input: 'matchRoute("/api/products/:id", "/api/products/3?x=1")', output: '{ id: "3" }', explanation: 'id vẫn là chuỗi.' }],
      goiY: ['const clean = path.split("?")[0].replace(/\\/$/, "") || "/";', 'p.startsWith(":") ? params[p.slice(1)] = decodeURIComponent(seg) : p === seg'],
      khoiDau: { 'main.js': `// Bài 6.5 — khớp route
function matchRoute(pattern, path) {
  return pattern === path ? {} : null;
}
` },
      loiGiai: { 'main.js': `// Bài 6.5 — đoạn thường phải giống hệt; đoạn ":tên" bắt giá trị
function matchRoute(pattern, path) {
  const clean = path.split('?')[0].replace(/(.)\\/$/, '$1');   // bỏ query và một "/" cuối
  const want = pattern.split('/');
  const got = clean.split('/');
  if (want.length !== got.length) return null;
  const params = {};
  for (let i = 0; i < want.length; i++) {
    if (want[i].startsWith(':')) {
      if (got[i] === '') return null;                         // tham số không được rỗng
      params[want[i].slice(1)] = decodeURIComponent(got[i]);
    } else if (want[i] !== got[i]) {
      return null;
    }
  }
  return params;
}
` },
      giaiThich: `<p>Đây là cốt lõi của ${c("app.get('/api/products/:id', …)")}: Express khớp đường dẫn rồi đặt kết quả vào ${c('req.params')}. Giải mã là cần thiết vì tên như "Đức Anh" đến dưới dạng ${c('%C4%90%E1%BB%A9c%20Anh')}.</p>`,
      loiHayGap: ['Không so số đoạn — "/api/products/3/extra" khớp nhầm.', 'Quên giải mã.', 'Cho :id khớp đoạn rỗng ("/api/products/").'],
      thamKhao: 'https://expressjs.com/en/guide/routing.html#route-parameters',
      kiem: [
        { moTa: 'One and two parameters|||Một và hai tham số', goi: '[matchRoute("/api/products/:id", "/api/products/3"), matchRoute("/api/users/:userId/posts/:postId", "/api/users/7/posts/42")]', mongDoi: [{ id: '3' }, { userId: '7', postId: '42' }] },
        { moTa: 'Query and trailing slash ignored; values decoded|||Bỏ query và "/" cuối; giá trị được giải mã', goi: '[matchRoute("/api/products/:id", "/api/products/3/?x=1"), matchRoute("/api/users/:name", "/api/users/%C4%90%E1%BB%A9c%20Anh")]', mongDoi: [{ id: '3' }, { name: 'Đức Anh' }] },
        { moTa: 'No match gives null|||Không khớp trả null', goi: '[matchRoute("/api/products/:id", "/api/products"), matchRoute("/api/products/:id", "/api/products/3/reviews"), matchRoute("/api/products/:id", "/api/users/3"), matchRoute("/api/products/:id", "/api/products//")]', mongDoi: [null, null, null, null] },
        { moTa: 'Static routes return an empty object|||Route tĩnh trả object rỗng', goi: 'matchRoute("/api/products", "/api/products?page=2")', mongDoi: {} },
      ],
    },
    {
      tieuDe: 'Kiểm tham số danh sách',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['kiểm tra dữ liệu vào', 'mặc định', 'danh sách cho phép'], tienQuyet: ['Number.isInteger', 'mảng'], the: ['javascript', 'validation'],
      moTa: `${BAI}<p>Viết ${c('readListQuery(query)')}: ${c('query')} là object như ${c('req.query')} (giá trị chuỗi, có thể vắng, có thể là mảng). Quy tắc: ${c('page')} mặc định 1, phải là số nguyên ≥ 1; ${c('limit')} mặc định 10, số nguyên 1–50; ${c('sort')} mặc định ${c('null')}, nếu có phải thuộc ${c('["price", "-price", "name"]')}. Mảng (tham số lặp) luôn là lỗi. Hợp lệ ⇒ ${c('{ ok: true, page, limit, sort }')} (page/limit là number); không ⇒ ${c('{ ok: false, errors }')} với thông điệp theo thứ tự page, limit, sort: ${c('"page must be a whole number ≥ 1"')}, ${c('"limit must be a whole number from 1 to 50"')}, ${c('"sort must be one of: price, -price, name"')}.</p>`,
      yeuCau: ['Mặc định khi vắng.', 'Chuỗi rỗng là lỗi (không phải vắng).', 'Số thập phân, chữ, mảng ⇒ lỗi.', 'Gom mọi lỗi.'],
      dauVao: 'query: object.', dauRa: '{ ok: true, page, limit, sort } | { ok: false, errors }.',
      rangBuoc: ['Không dùng parseInt ("12abc" phải là lỗi).'],
      viDu: [{ input: 'readListQuery({ limit: "abc" })', output: '{ ok: false, errors: ["limit must be a whole number from 1 to 50"] }', explanation: 'Trong bài máy chủ trả danh sách rỗng âm thầm — giờ nó báo 400 rõ ràng.' }],
      goiY: ['const int = (v) => typeof v === "string" && /^\\d+$/.test(v) ? Number(v) : NaN;', 'Kiểm "in query" để phân biệt vắng với rỗng.'],
      khoiDau: { 'main.js': `// Bài 6.5 — kiểm tham số danh sách
function readListQuery(query) {
  return { ok: true, page: query.page, limit: query.limit, sort: query.sort };
}
` },
      loiGiai: { 'main.js': `// Bài 6.5 — đổi kiểu có chủ ý, kiểm, áp mặc định, áp trần; sai thì nói rõ
const SORTS = ['price', '-price', 'name'];
function readListQuery(query) {
  const int = (v) => (typeof v === 'string' && /^\\d+$/.test(v) ? Number(v) : NaN);   // "12abc", "2.5", mảng ⇒ NaN
  const errors = [];
  const page = 'page' in query ? int(query.page) : 1;
  if (!(page >= 1)) errors.push('page must be a whole number ≥ 1');
  const limit = 'limit' in query ? int(query.limit) : 10;
  if (!(limit >= 1 && limit <= 50)) errors.push('limit must be a whole number from 1 to 50');
  const sort = 'sort' in query ? query.sort : null;
  if (sort !== null && !SORTS.includes(sort)) errors.push('sort must be one of: ' + SORTS.join(', '));
  return errors.length ? { ok: false, errors } : { ok: true, page, limit, sort };
}
` },
      giaiThich: `<p>Output ${c('limit=abc')} trong bài cho thấy hậu quả khi bỏ bước này: ${c('NaN')} lọt qua ${c('Math.min')} và máy chủ trả danh sách rỗng mà không ai biết vì sao. ${c('!(page >= 1)')} bắt được cả ${c('NaN')} (mọi phép so với NaN đều false). Thư viện như Zod làm đúng việc này ở quy mô lớn.</p>`,
      loiHayGap: ['parseInt("12abc") = 12 — chấp nhận rác.', 'Coi "" như vắng.', 'Dừng ở lỗi đầu tiên.', 'Không đặt trần cho limit.'],
      thamKhao: 'https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/',
      kiem: [
        { moTa: 'Defaults when absent; numbers converted|||Mặc định khi vắng; đổi sang số', goi: '[readListQuery({}), readListQuery({ page: "3", limit: "50", sort: "-price" })]', mongDoi: [{ ok: true, page: 1, limit: 10, sort: null }, { ok: true, page: 3, limit: 50, sort: '-price' }] },
        { moTa: 'The limit=abc case from the lesson|||Trường hợp limit=abc của bài', goi: 'readListQuery({ limit: "abc" })', mongDoi: { ok: false, errors: ['limit must be a whole number from 1 to 50'] } },
        { moTa: 'All errors, in order|||Mọi lỗi, đúng thứ tự', goi: 'readListQuery({ page: "0", limit: "1000", sort: "date" })', mongDoi: { ok: false, errors: ['page must be a whole number ≥ 1', 'limit must be a whole number from 1 to 50', 'sort must be one of: price, -price, name'] } },
        { moTa: 'Decimals, junk, empty and arrays are errors|||Số thập phân, rác, rỗng và mảng là lỗi', goi: '[readListQuery({ page: "2.5" }).ok, readListQuery({ page: "12abc" }).ok, readListQuery({ limit: "" }).ok, readListQuery({ page: ["1", "2"] }).ok]', mongDoi: [false, false, false, false] },
      ],
    },
    {
      tieuDe: 'Lọc, sắp xếp, chia trang',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['lọc', 'sắp xếp', 'phân trang', 'total'], tienQuyet: ['filter', 'toSorted', 'slice'], the: ['javascript', 'rest'],
      moTa: `${BAI}<p>Viết ${c('listProducts(products, { category, q, sort, page = 1, limit = 10 })')} như ${c('GET /api/products')} của bài: lọc theo ${c('category')} (bằng nhau) nếu có; lọc ${c('q')} — tên CHỨA q, không phân biệt hoa thường — nếu có; sắp ${c('"price"')} tăng, ${c('"-price"')} giảm, ${c('"name"')} theo tên (so ${c('<')}); rồi cắt trang. Trả ${c('{ items, page, limit, total }')} với ${c('total')} là số món SAU khi lọc, TRƯỚC khi cắt trang. Không sửa mảng vào.</p>`,
      yeuCau: ['Lọc → sắp → cắt trang, đúng thứ tự đó.', 'total đếm sau lọc.', 'Không đột biến products.'],
      dauVao: 'products: object[]; options: object (đã kiểm hợp lệ).', dauRa: '{ items, page, limit, total }.',
      rangBuoc: ['Dùng toSorted hoặc sao chép trước khi sort.'],
      viDu: [{ input: 'listProducts(SP, { category: "office", sort: "-price" })', output: 'items Stapler, Notebook, Pen; total 3', explanation: 'Đúng output curl của bài.' }],
      goiY: ['let list = products; if (category) list = list.filter((p) => p.category === category);', 'list.slice((page - 1) * limit, page * limit)'],
      khoiDau: { 'main.js': `// Bài 6.5 — lọc, sắp xếp, chia trang
function listProducts(products, { category, q, sort, page = 1, limit = 10 } = {}) {
  const items = products.slice((page - 1) * limit, page * limit).filter((p) => !category || p.category === category);
  return { items, page, limit, total: items.length };
}
` },
      loiGiai: { 'main.js': `// Bài 6.5 — lọc trước, sắp sau, cắt trang cuối cùng; total đếm trước khi cắt
function listProducts(products, { category, q, sort, page = 1, limit = 10 } = {}) {
  let list = products;
  if (category) list = list.filter((p) => p.category === category);
  if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  if (sort === 'price') list = list.toSorted((a, b) => a.price - b.price);
  if (sort === '-price') list = list.toSorted((a, b) => b.price - a.price);
  if (sort === 'name') list = list.toSorted((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const items = list.slice((page - 1) * limit, page * limit);
  return { items, page, limit, total: list.length };
}
` },
      giaiThich: `<p>Code khởi đầu cắt trang TRƯỚC khi lọc: trang 1 chỉ chứa những món office tình cờ nằm trong 10 món đầu, và total sai. Trên cơ sở dữ liệu thật, đúng thứ tự này là ${c('WHERE … ORDER BY … LIMIT … OFFSET …')} (Chương 8).</p>`,
      loiHayGap: ['Cắt trang trước khi lọc.', 'total = items.length — thanh phân trang luôn nói "1 trang".', 'list.sort() — sắp luôn mảng gốc.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted',
      kiem: [
        { moTa: 'category + sort, like the lesson|||category + sort, như bài', goi: 'listProducts(' + SP + ', { category: "office", sort: "-price" }).items.map((p) => p.name)', mongDoi: ['Stapler', 'Notebook', 'Pen'] },
        { moTa: 'Page 2 of 2 items, total before paging|||Trang 2 cỡ 2, total trước khi cắt', goi: 'listProducts(' + SP + ', { page: 2, limit: 2 })', mongDoi: { items: [{ id: 3, name: 'Pen', price: 5000, category: 'office' }, { id: 4, name: 'Mug', price: 60000, category: 'home' }], page: 2, limit: 2, total: 5 } },
        { moTa: 'q is case-insensitive; sort by name|||q không phân biệt hoa thường; sắp theo tên', goi: '[listProducts(' + SP + ', { q: "LAMP" }).items.map((p) => p.id), listProducts(' + SP + ', { sort: "name", limit: 3 }).items.map((p) => p.name)]', mongDoi: [[2], ['Desk lamp', 'Mug', 'Notebook']] },
        { moTa: 'Filter then page; input untouched|||Lọc rồi mới chia trang; mảng vào không đổi', chuanBi: 'const all = ' + SP + '; const r = listProducts(all, { category: "home", sort: "price", limit: 1, page: 2 });', goi: '[r.items.map((p) => p.name), r.total, all[0].name]', mongDoi: [['Desk lamp'], 2, 'Notebook'] },
      ],
    },
    {
      tieuDe: 'Chặn IDOR',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['IDOR / BOLA', 'phân quyền theo đối tượng'], tienQuyet: ['find', 'Number'], the: ['javascript', 'bảo mật', 'rest'],
      moTa: `${BAI}<p>Viết ${c('getNote(notes, userId, rawId)')} cho ${c('GET /api/notes/:id')}: ${c('rawId')} là chuỗi từ đường dẫn. Trả ${c('{ status, body }')}: ${c('userId')} rỗng/vắng ⇒ 401 ${c('{ error: "Log in first" }')}; ${c('rawId')} không phải số nguyên dương (chỉ chữ số) ⇒ 400 ${c('{ error: "id must be a number" }')}; ghi chú không tồn tại HOẶC không thuộc ${c('userId')} ⇒ 404 ${c('{ error: "Not found" }')} — cùng một câu trả lời cho cả hai; còn lại ⇒ 200 với ghi chú.</p>`,
      yeuCau: ['401 → 400 → 404 → 200.', 'Không tồn tại và không phải của mình: cùng 404.', 'So id kiểu số.'],
      dauVao: 'notes: { id, owner, text }[]; userId: string | null; rawId: string.', dauRa: '{ status, body }.',
      rangBuoc: ['Không bao giờ trả 403 cho ghi chú của người khác (đừng xác nhận nó tồn tại).'],
      viDu: [{ input: 'getNote(NOTES, "an", "13")', output: '{ status: 404, body: { error: "Not found" } }', explanation: 'Ghi chú 13 của Bình — y như bản "with owner check" trong bài.' }],
      goiY: ['if (!/^\\d+$/.test(rawId)) return { status: 400, … };', 'notes.find((n) => n.id === Number(rawId) && n.owner === userId)'],
      khoiDau: { 'main.js': `// Bài 6.5 — chặn IDOR
function getNote(notes, userId, rawId) {
  const note = notes.find((n) => n.id == rawId);
  if (!note) return { status: 404, body: { error: 'Not found' } };
  return { status: 200, body: note };
}
` },
      loiGiai: { 'main.js': `// Bài 6.5 — đăng nhập trả lời "bạn là ai"; câu "được xem CÁI NÀY không" phải hỏi riêng
function getNote(notes, userId, rawId) {
  if (!userId) return { status: 401, body: { error: 'Log in first' } };
  if (!/^\\d+$/.test(rawId) || Number(rawId) < 1) return { status: 400, body: { error: 'id must be a number' } };
  const id = Number(rawId);
  const note = notes.find((n) => n.id === id && n.owner === userId);   // tồn tại VÀ thuộc người gọi
  if (!note) return { status: 404, body: { error: 'Not found' } };      // không phân biệt "không có" với "của người khác"
  return { status: 200, body: note };
}
` },
      giaiThich: `<p>Code khởi đầu là bản "without owner check" của bài: đổi 12 thành 13 là đọc được ghi chú của người khác. Trong SQL, điều kiện chủ sở hữu nằm ngay trong truy vấn: ${c('WHERE id = $1 AND owner_id = $2')} — không tải về rồi mới kiểm.</p>`,
      loiHayGap: ['Chỉ kiểm "có tồn tại không".', 'Trả 403 — xác nhận cho kẻ dò rằng id đó có thật.', 'So == với chuỗi — "013" khớp 13.'],
      thamKhao: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/',
      kiem: [
        { moTa: 'Own note 200, someone else\'s 404|||Ghi chú của mình 200, của người khác 404', chuanBi: 'const N = [{ id: 12, owner: "an", text: "Buy milk" }, { id: 13, owner: "binh", text: "PIN hint" }];', goi: '[getNote(N, "an", "12"), getNote(N, "an", "13")]', mongDoi: [{ status: 200, body: { id: 12, owner: 'an', text: 'Buy milk' } }, { status: 404, body: { error: 'Not found' } }] },
        { moTa: 'Missing and foreign look identical|||Không có và của người khác trông y hệt', chuanBi: 'const N = [{ id: 13, owner: "binh", text: "x" }];', goi: 'JSON.stringify(getNote(N, "an", "13")) === JSON.stringify(getNote(N, "an", "99"))', mongDoi: true },
        { moTa: '401 before 400 before 404|||401 trước 400 trước 404', chuanBi: 'const N = [{ id: 12, owner: "an", text: "x" }];', goi: '[getNote(N, null, "abc").status, getNote(N, "an", "abc").status, getNote(N, "an", "-1").status, getNote(N, "an", "1.5").status, getNote(N, "", "12").status]', mongDoi: [401, 400, 400, 400, 401] },
      ],
    },
    {
      tieuDe: 'Bộ định tuyến 404/405',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['bộ định tuyến', '405 + Allow', 'tham số đường dẫn'], tienQuyet: ['split', 'mảng', 'object'], the: ['javascript', 'rest', 'routing'],
      moTa: `${BAI}<p>Viết ${c('route(routes, method, url)')}: ${c('routes')} là mảng ${c('{ method, pattern, name }')} (pattern có thể có ${c(':tên')}). Bỏ query của ${c('url')} nhưng trả nó dạng object. Trả: route đầu tiên khớp cả đường dẫn lẫn method (HEAD dùng được route GET) ⇒ ${c('{ status: 200, name, params, query }')}; đường dẫn khớp ít nhất một route nhưng không method nào hợp ⇒ ${c('{ status: 405, allow }')} với ${c('allow')} là chuỗi method KHÔNG trùng theo thứ tự ${c('GET, HEAD, POST, PUT, PATCH, DELETE')} (có GET ⇒ thêm HEAD), nối ${c('", "')}; không khớp gì ⇒ ${c('{ status: 404 }')}. Tham số và query được giải mã; query lặp ⇒ giữ giá trị cuối.</p>`,
      yeuCau: ['Khớp :tham số như bài "Khớp route" (viết lại trong hàm).', 'Route đầu tiên thắng.', '405 kèm allow đúng thứ tự.', 'HEAD ⇒ route GET.'],
      dauVao: 'routes: object[]; method: string; url: string.', dauRa: 'object.',
      rangBuoc: ['Một hàm tự đủ (có thể có hàm phụ bên trong tệp).', 'Method không phân biệt hoa thường.'],
      viDu: [{ input: 'route(R, "GET", "/api/products/3?fields=name")', output: '{ status: 200, name: "readProduct", params: { id: "3" }, query: { fields: "name" } }', explanation: 'Express gọi đúng handler với req.params và req.query.' }],
      goiY: ['const [path, qs = ""] = url.split("?");', 'Gom method của mọi route khớp đường dẫn để dựng Allow.'],
      khoiDau: { 'main.js': `// Bài 6.5 — bộ định tuyến
function route(routes, method, url) {
  const r = routes.find((x) => x.method === method && x.pattern === url);
  return r ? { status: 200, name: r.name, params: {}, query: {} } : { status: 404 };
}
` },
      loiGiai: { 'main.js': `// Bài 6.5 — khớp đường dẫn trước, rồi method: 200, 405 (+ Allow) hay 404
const ORDER = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'];

function matchPath(pattern, path) {
  const want = pattern.split('/');
  const got = path.replace(/(.)\\/$/, '$1').split('/');
  if (want.length !== got.length) return null;
  const params = {};
  for (let i = 0; i < want.length; i++) {
    if (want[i].startsWith(':')) {
      if (!got[i]) return null;
      params[want[i].slice(1)] = decodeURIComponent(got[i]);
    } else if (want[i] !== got[i]) return null;
  }
  return params;
}

function route(routes, method, url) {
  const [path, qs = ''] = url.split('?');
  const m = method.toUpperCase();
  const query = Object.fromEntries(new URLSearchParams(qs));
  const allowed = new Set();
  for (const r of routes) {
    const params = matchPath(r.pattern, path);
    if (!params) continue;
    const rm = r.method.toUpperCase();
    if (rm === m || (m === 'HEAD' && rm === 'GET')) return { status: 200, name: r.name, params, query };
    allowed.add(rm);
    if (rm === 'GET') allowed.add('HEAD');
  }
  if (allowed.size === 0) return { status: 404 };
  return { status: 405, allow: ORDER.filter((x) => allowed.has(x)).join(', ') };
}
` },
      giaiThich: `<p>Đây là bộ não của Express Router gói trong 40 dòng: thử từng route theo thứ tự khai báo, đoạn ${c(':tên')} thành ${c('req.params')}, query thành ${c('req.query')}. Thứ tự quan trọng: khai ${c('/api/products/new')} SAU ${c('/api/products/:id')} thì "new" bị coi là một id — lỗi kinh điển khi dựng API Express.</p>`,
      loiHayGap: ['So pattern === url — không bao giờ khớp :id.', 'Trả 404 khi đường dẫn có mà method sai.', 'Allow lặp method hoặc sai thứ tự.'],
      thamKhao: 'https://expressjs.com/en/guide/routing.html',
      kiem: [
        { moTa: 'Collection and item with params and query|||Tập hợp và phần tử, có tham số và query', chuanBi: 'const R = [{ method: "GET", pattern: "/api/products", name: "list" }, { method: "POST", pattern: "/api/products", name: "create" }, { method: "GET", pattern: "/api/products/:id", name: "read" }, { method: "DELETE", pattern: "/api/products/:id", name: "remove" }];', goi: '[route(R, "GET", "/api/products?page=2&q=desk+lamp"), route(R, "delete", "/api/products/7")]', mongDoi: [{ status: 200, name: 'list', params: {}, query: { page: '2', q: 'desk lamp' } }, { status: 200, name: 'remove', params: { id: '7' }, query: {} }] },
        { moTa: '405 with Allow, 404 for unknown paths|||405 kèm Allow, 404 cho đường dẫn lạ', chuanBi: 'const R = [{ method: "DELETE", pattern: "/api/products/:id", name: "remove" }, { method: "GET", pattern: "/api/products/:id", name: "read" }, { method: "PATCH", pattern: "/api/products/:id", name: "update" }, { method: "GET", pattern: "/api/products", name: "list" }];', goi: '[route(R, "POST", "/api/products/1"), route(R, "GET", "/api/users"), route(R, "GET", "/api/products/1/reviews")]', mongDoi: [{ status: 405, allow: 'GET, HEAD, PATCH, DELETE' }, { status: 404 }, { status: 404 }] },
        { moTa: 'HEAD uses GET; first match wins|||HEAD dùng GET; route đầu tiên thắng', chuanBi: 'const R = [{ method: "GET", pattern: "/api/products/:id", name: "read" }, { method: "GET", pattern: "/api/products/new", name: "newForm" }];', goi: '[route(R, "HEAD", "/api/products/5").name, route(R, "GET", "/api/products/new").params]', mongDoi: ['read', { id: 'new' }] },
      ],
    },
  ],
});
