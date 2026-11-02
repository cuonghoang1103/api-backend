/** Bộ luyện bài 8.5 — ORM với Prisma. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm không có Prisma ⇒ các bài tự cài đặt những mảnh của nó trên mảng: đổi lỗi P-code thành HTTP, select lồng,
 *  bộ lọc where (equals/gt/contains/in/not/AND/OR), findMany đầy đủ, dịch where thành SQL có tham số, và kế hoạch db push. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 8.5 — ORM với Prisma.</em> Mỗi bài tự viết lại một mảnh nhỏ của Prisma bằng JavaScript thuần — để hiểu một lời gọi <code>findMany</code> thật sự làm gì.</p>';
const POSTS = '[{ id: 1, authorId: 1, title: "Hello World", views: 120, published: true }, { id: 2, authorId: 1, title: "Learning SQL", views: 45, published: true }, { id: 3, authorId: 2, title: "Draft Post", views: 3, published: false }, { id: 4, authorId: 2, title: "Node.js Basics", views: 300, published: true }, { id: 5, authorId: 1, title: "Old Announcement", views: 80, published: true }, { id: 6, authorId: null, title: "Orphan Draft", views: 0, published: false }]';

export default doiDau({
  slug: 'wf-8-5-orm-prisma',
  ten: '8.5 ORM với Prisma',
  baiHoc: 'Nền tảng Web — Bài 8.5 ORMs with Prisma',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Đổi lỗi Prisma (P2002, P2025, P2003) thành response HTTP, áp select lồng nhau, dựng bộ lọc where như Prisma (equals, gt/gte/lt/lte, contains, in, not, AND/OR/NOT), findMany có orderBy/skip/take, dịch where sang SQL có tham số, và lập kế hoạch db push (phát hiện bước phá huỷ) — 6 bài.',
  de: [
    {
      tieuDe: 'Lỗi Prisma thành response HTTP',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['mã lỗi Prisma', 'ánh xạ lỗi'], tienQuyet: ['switch', 'object'], the: ['javascript', 'prisma', 'http'],
      moTa: `${BAI}<p>Viết ${c('toHttp(err)')} trả ${c('{ status, body }')} cho một lỗi Prisma: ${c('err.code')} ${c('"P2002"')} (trùng unique) ⇒ ${c('409')} ${c('{ error: "Already exists", fields: err.meta.target }')} (${c('target')} có thể vắng ⇒ ${c('[]')}); ${c('"P2025"')} (không tìm thấy) ⇒ ${c('404')} ${c('{ error: "Not found" }')}; ${c('"P2003"')} (vi phạm khoá ngoại) ⇒ ${c('409')} ${c('{ error: "Related record missing or still in use" }')}; mọi lỗi khác ⇒ ${c('500')} ${c('{ error: "Internal error" }')} — KHÔNG bao giờ để lộ ${c('err.message')}.</p>`,
      yeuCau: ['Ba mã P đã biết.', 'Còn lại 500 với câu chung chung.', 'Không lộ message.'],
      dauVao: 'err: { code?, meta?, message? }.', dauRa: '{ status, body }.',
      rangBuoc: ['err có thể không có code.'],
      viDu: [{ input: 'toHttp({ code: "P2002", meta: { target: ["email"] } })', output: '{ status: 409, body: { error: "Already exists", fields: ["email"] } }', explanation: 'Email trùng ở Bước 4 của bài.' }],
      goiY: ['switch (err?.code) { case "P2002": … }', 'fields: err.meta?.target ?? []'],
      khoiDau: { 'main.js': `// Bài 8.5 — lỗi Prisma thành HTTP
function toHttp(err) {
  return { status: 500, body: { error: err.message } };
}
` },
      loiGiai: { 'main.js': `// Bài 8.5 — lỗi chờ sẵn có mã riêng; lỗi lạ là bug ⇒ 500 và không lộ chi tiết
function toHttp(err) {
  switch (err?.code) {
    case 'P2002': return { status: 409, body: { error: 'Already exists', fields: err.meta?.target ?? [] } };
    case 'P2025': return { status: 404, body: { error: 'Not found' } };
    case 'P2003': return { status: 409, body: { error: 'Related record missing or still in use' } };
    default: return { status: 500, body: { error: 'Internal error' } };   // chi tiết chỉ vào log máy chủ
  }
}
` },
      giaiThich: `<p>Đây là khối ${c('catch')} ở Bước 4 của bài gói thành một hàm dùng chung (thường đặt trong middleware xử lý lỗi của Express). ${c('err.message')} của Prisma chứa tên bảng, câu truy vấn và đôi khi dữ liệu — đưa nó ra response là lộ thông tin (Bài 6.3).</p>`,
      loiHayGap: ['Trả err.message cho client.', 'Coi P2025 là 500.', 'meta.target vắng ⇒ undefined.'],
      thamKhao: 'https://www.prisma.io/docs/orm/reference/error-reference#prisma-client-query-engine',
      kiem: [
        { moTa: 'Duplicate and not found|||Trùng và không tìm thấy', goi: '[toHttp({ code: "P2002", meta: { target: ["email"] } }), toHttp({ code: "P2025", message: "Record to update not found." })]', mongDoi: [{ status: 409, body: { error: 'Already exists', fields: ['email'] } }, { status: 404, body: { error: 'Not found' } }] },
        { moTa: 'Foreign key and missing target|||Khoá ngoại và thiếu target', goi: '[toHttp({ code: "P2003" }).status, toHttp({ code: "P2002" }).body.fields]', mongDoi: [409, []] },
        { moTa: 'Anything else: 500 without details|||Mọi thứ khác: 500 không lộ chi tiết', goi: '[toHttp({ code: "P1001", message: "Can\'t reach database server at db:5432" }), toHttp(new TypeError("x is undefined")), toHttp(null)]', mongDoi: [{ status: 500, body: { error: 'Internal error' } }, { status: 500, body: { error: 'Internal error' } }, { status: 500, body: { error: 'Internal error' } }] },
      ],
    },
    {
      tieuDe: 'select lồng nhau',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['select', 'chống lấy thừa'], tienQuyet: ['Object.entries', 'đệ quy'], the: ['javascript', 'prisma'],
      moTa: `${BAI}<p>Viết ${c('applySelect(obj, select)')} như ${c('select')} của Prisma: chỉ giữ các khoá có giá trị ${c('true')}; khoá có giá trị ${c('{ select: {…} }')} là quan hệ — áp đệ quy cho object con, hoặc cho TỪNG phần tử nếu là mảng (${c('null')} giữ nguyên ${c('null')}); khoá ${c('false')} hoặc vắng thì bỏ. Khoá trong ${c('select')} mà ${c('obj')} không có ⇒ bỏ qua. Không sửa ${c('obj')}.</p>`,
      yeuCau: ['true ⇒ giữ.', '{ select } ⇒ đệ quy, cả mảng.', 'Không đột biến.'],
      dauVao: 'obj: object; select: object.', dauRa: 'object.',
      rangBuoc: ['Không dùng thư viện lodash.pick.'],
      viDu: [{ input: 'applySelect(user, { name: true, posts: { select: { title: true } } })', output: '{ name: "Minh", posts: [{ title: "Draft Post" }, { title: "Node.js Basics" }] }', explanation: 'passwordHash không bao giờ lọt ra.' }],
      goiY: ['for (const [k, v] of Object.entries(select)) { if (!(k in obj)) continue; if (v === true) out[k] = obj[k]; else if (v && v.select) … }', 'Array.isArray(x) ? x.map((e) => applySelect(e, v.select)) : x === null ? null : applySelect(x, v.select)'],
      khoiDau: { 'main.js': `// Bài 8.5 — select lồng nhau
function applySelect(obj, select) {
  for (const k of Object.keys(obj)) if (!select[k]) delete obj[k];
  return obj;
}
` },
      loiGiai: { 'main.js': `// Bài 8.5 — chỉ trả đúng các trường được chọn, kể cả trong quan hệ lồng
function applySelect(obj, select) {
  const out = {};
  for (const [k, v] of Object.entries(select)) {
    if (!(k in obj)) continue;
    if (v === true) out[k] = obj[k];
    else if (v && typeof v === 'object' && v.select) {
      const x = obj[k];
      out[k] = x === null ? null : Array.isArray(x) ? x.map((e) => applySelect(e, v.select)) : applySelect(x, v.select);
    }
  }
  return out;
}
` },
      giaiThich: `<p>Không có ${c('select')}, Prisma trả mọi trường thường của model — kể cả ${c('passwordHash')} nếu có. Chọn trường ở truy vấn (không phải xoá sau) vừa an toàn hơn vừa nhẹ hơn: CSDL không gửi những cột đó về.</p>`,
      loiHayGap: ['delete trên object gốc.', 'Không xử lý quan hệ là mảng.', 'Giữ khoá có giá trị false.'],
      thamKhao: 'https://www.prisma.io/docs/orm/prisma-client/queries/select-fields',
      kiem: [
        { moTa: 'Nested select hides the password hash|||select lồng giấu hash mật khẩu', goi: 'applySelect({ id: 2, name: "Minh", email: "minh@example.com", passwordHash: "$2b$10$x", posts: [{ id: 3, title: "Draft Post", views: 3 }, { id: 4, title: "Node.js Basics", views: 300 }] }, { name: true, posts: { select: { title: true } } })', mongDoi: { name: 'Minh', posts: [{ title: 'Draft Post' }, { title: 'Node.js Basics' }] } },
        { moTa: 'Single relation, null relation, false and unknown keys|||Quan hệ đơn, quan hệ null, khoá false và khoá lạ', goi: '[applySelect({ title: "A", author: { id: 1, name: "Lan" } }, { title: true, author: { select: { name: true } }, views: false, nope: true }), applySelect({ title: "B", author: null }, { author: { select: { name: true } } })]', mongDoi: [{ title: 'A', author: { name: 'Lan' } }, { author: null }] },
        { moTa: 'Input is not changed|||Dữ liệu vào không bị sửa', chuanBi: 'const U = { id: 1, name: "Lan", secret: "x" }; applySelect(U, { name: true });', goi: 'U', mongDoi: { id: 1, name: 'Lan', secret: 'x' } },
      ],
    },
    {
      tieuDe: 'Bộ lọc where như Prisma',
      doKho: 'MEDIUM', phut: 22,
      khaiNiem: ['toán tử lọc', 'AND/OR/NOT'], tienQuyet: ['every', 'some', 'đệ quy'], the: ['javascript', 'prisma'],
      moTa: `${BAI}<p>Viết ${c('matches(row, where)')} trả boolean. Mỗi khoá thường của ${c('where')} là một cột: giá trị trực tiếp (kể cả ${c('null')}) nghĩa là bằng; object nghĩa là toán tử: ${c('equals')}, ${c('not')} (khác), ${c('gt')}, ${c('gte')}, ${c('lt')}, ${c('lte')}, ${c('in')} (mảng), ${c('notIn')}, ${c('contains')}, ${c('startsWith')} — có thể kết hợp nhiều toán tử (tất cả phải đúng); ${c('mode: "insensitive"')} làm ${c('contains')}/${c('startsWith')}/${c('equals')} của chuỗi không phân biệt hoa thường. Khoá đặc biệt: ${c('AND')} (mảng, tất cả), ${c('OR')} (mảng, ít nhất một), ${c('NOT')} (object). Mọi khoá cùng cấp kết hợp bằng AND. Toán tử so sánh với giá trị null của cột ⇒ false.</p>`,
      yeuCau: ['Bằng trực tiếp.', 'Đủ các toán tử.', 'AND/OR/NOT lồng được.', 'mode insensitive.'],
      dauVao: 'row: object; where: object.', dauRa: 'boolean.',
      rangBuoc: ['where rỗng ⇒ true.'],
      viDu: [{ input: 'matches(post, { published: true, views: { gte: 80 } })', output: 'true cho Hello World, Node.js Basics, Old Announcement', explanation: 'Cùng truy vấn với Bước 1 của Bài 8.2.' }],
      goiY: ['if (k === "AND") return v.every((w) => matches(row, w));', 'const ops = { gt: (x, y) => x !== null && x > y, … }'],
      khoiDau: { 'main.js': `// Bài 8.5 — bộ lọc where
function matches(row, where) {
  return Object.entries(where).every(([k, v]) => row[k] === v);
}
` },
      loiGiai: { 'main.js': `// Bài 8.5 — where của Prisma: cột → giá trị hoặc toán tử; AND / OR / NOT lồng được
function matches(row, where) {
  return Object.entries(where).every(([k, v]) => {
    if (k === 'AND') return v.every((w) => matches(row, w));
    if (k === 'OR') return v.some((w) => matches(row, w));
    if (k === 'NOT') return !matches(row, v);
    const x = row[k];
    if (v === null || typeof v !== 'object' || Array.isArray(v)) return x === v;   // giá trị trực tiếp
    const ci = v.mode === 'insensitive';
    const norm = (s) => (ci && typeof s === 'string' ? s.toLowerCase() : s);
    return Object.entries(v).every(([op, arg]) => {
      if (op === 'mode') return true;
      if (op === 'equals') return norm(x) === norm(arg);
      if (op === 'not') return norm(x) !== norm(arg);
      if (op === 'in') return arg.includes(x);
      if (op === 'notIn') return !arg.includes(x);
      if (x === null || x === undefined) return false;       // so sánh với NULL không bao giờ đúng
      if (op === 'gt') return x > arg;
      if (op === 'gte') return x >= arg;
      if (op === 'lt') return x < arg;
      if (op === 'lte') return x <= arg;
      if (op === 'contains') return norm(x).includes(norm(arg));
      if (op === 'startsWith') return norm(x).startsWith(norm(arg));
      throw new TypeError('unknown operator ' + op);
    });
  });
}
` },
      giaiThich: `<p>Mỗi nhánh ở đây là một mảnh WHERE trong SQL mà Prisma sinh ra: ${c('gte')} → ${c('>=')}, ${c('contains')} → ${c("LIKE '%…%'")}, ${c('in')} → ${c('IN (…)')}, OR → ${c('OR')}. Trong CSDL thật, ${c('mode: "insensitive"')} của PostgreSQL thành ${c('ILIKE')}.</p>`,
      loiHayGap: ['Coi object toán tử như giá trị so sánh.', 'Quên NOT.', 'gt với null trả true vì null > -1.'],
      thamKhao: 'https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators',
      kiem: [
        { moTa: 'Direct values and comparisons|||Giá trị trực tiếp và phép so sánh', goi: '(' + POSTS + ').filter((p) => matches(p, { published: true, views: { gte: 80 } })).map((p) => p.id)', mongDoi: [1, 4, 5] },
        { moTa: 'contains, insensitive, in, not, null|||contains, không phân biệt hoa thường, in, not, null', goi: '[(' + POSTS + ').filter((p) => matches(p, { title: { contains: "sql", mode: "insensitive" } })).map((p) => p.id), (' + POSTS + ').filter((p) => matches(p, { authorId: { in: [2] }, title: { not: "Draft Post" } })).map((p) => p.id), (' + POSTS + ').filter((p) => matches(p, { authorId: null })).map((p) => p.id)]', mongDoi: [[2], [4], [6]] },
        { moTa: 'OR, NOT, nested AND; NULL never compares|||OR, NOT, AND lồng; NULL không so được', goi: '[(' + POSTS + ').filter((p) => matches(p, { OR: [{ views: { gt: 200 } }, { AND: [{ published: false }, { NOT: { authorId: null } }] }] })).map((p) => p.id), matches({ v: null }, { v: { gt: -1 } }), matches({ a: 1 }, {})]', mongDoi: [[3, 4], false, true] },
      ],
    },
    {
      tieuDe: 'findMany đầy đủ',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['findMany', 'orderBy', 'skip/take'], tienQuyet: ['filter', 'toSorted', 'slice'], the: ['javascript', 'prisma'],
      moTa: `${BAI}<p>Viết ${c('findMany(rows, args = {})')} theo đúng thứ tự Prisma (và SQL) áp dụng: ${c('where')} (dùng lại logic bài trước — tối thiểu hỗ trợ giá trị trực tiếp và ${c('gt/gte/lt/lte/contains')}; viết lại trong tệp này), rồi ${c('orderBy')} (object ${c('{ cột: "asc"|"desc" }')} hoặc mảng các object như vậy cho nhiều khoá, ổn định), rồi ${c('skip')}, rồi ${c('take')}, rồi ${c('select')} (chỉ cột ${c('true')}, không lồng). Trả bản sao, không sửa ${c('rows')}.</p>`,
      yeuCau: ['Đúng thứ tự where → orderBy → skip → take → select.', 'orderBy object hoặc mảng.', 'Không đột biến.'],
      dauVao: 'rows: object[]; args: { where?, orderBy?, skip?, take?, select? }.', dauRa: 'object[].',
      rangBuoc: ['Một tệp tự đủ.'],
      viDu: [{ input: "findMany(posts, { where: { published: true }, orderBy: { views: 'desc' }, take: 2, select: { title: true, views: true } })", output: '[{ title: "Node.js Basics", views: 300 }, { title: "Hello World", views: 120 }]', explanation: 'Đúng kết quả của lời gọi đầu tiên ở Bước 3 của bài.' }],
      goiY: ['const keys = (Array.isArray(orderBy) ? orderBy : [orderBy]).flatMap((o) => Object.entries(o));', 'out.slice(skip ?? 0, take === undefined ? undefined : (skip ?? 0) + take)'],
      khoiDau: { 'main.js': `// Bài 8.5 — findMany
function findMany(rows, args = {}) {
  return rows.slice(0, args.take);
}
` },
      loiGiai: { 'main.js': `// Bài 8.5 — where → orderBy → skip → take → select, như câu SELECT mà Prisma sinh ra
function matchOne(row, where = {}) {
  return Object.entries(where).every(([k, v]) => {
    const x = row[k];
    if (v === null || typeof v !== 'object') return x === v;
    return Object.entries(v).every(([op, arg]) => {
      if (x === null || x === undefined) return false;
      if (op === 'gt') return x > arg;
      if (op === 'gte') return x >= arg;
      if (op === 'lt') return x < arg;
      if (op === 'lte') return x <= arg;
      if (op === 'contains') return String(x).includes(arg);
      if (op === 'equals') return x === arg;
      throw new TypeError('unsupported operator ' + op);
    });
  });
}

function findMany(rows, args = {}) {
  let out = rows.filter((r) => matchOne(r, args.where));
  if (args.orderBy) {
    const keys = (Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy]).flatMap((o) => Object.entries(o));
    out = out.toSorted((a, b) => {
      for (const [k, dir] of keys) {
        if (a[k] === b[k]) continue;
        const r = a[k] === null ? -1 : b[k] === null ? 1 : a[k] < b[k] ? -1 : 1;
        return dir === 'desc' ? -r : r;
      }
      return 0;
    });
  }
  const skip = args.skip ?? 0;
  out = out.slice(skip, args.take === undefined ? undefined : skip + args.take);
  return out.map((r) => (args.select
    ? Object.fromEntries(Object.entries(args.select).filter(([, on]) => on === true).map(([k]) => [k, r[k]]))
    : { ...r }));
}
` },
      giaiThich: `<p>Câu SQL trong output của bài — ${c('WHERE … ORDER BY … LIMIT ? OFFSET ?')} — chính là năm bước này. ${c('skip')} là OFFSET, ${c('take')} là LIMIT; vì thế phân trang ${c('skip: (page − 1) * size, take: size')} y hệt Bài 8.2.</p>`,
      loiHayGap: ['take trước skip.', 'select trước orderBy (sắp theo cột đã bị bỏ).', 'sort() sửa mảng gốc.'],
      thamKhao: 'https://www.prisma.io/docs/orm/prisma-client/queries/pagination',
      kiem: [
        { moTa: 'The first call of the lesson|||Lời gọi đầu tiên của bài', goi: 'findMany(' + POSTS + ', { where: { published: true }, orderBy: { views: "desc" }, take: 2, select: { title: true, views: true } })', mongDoi: [{ title: 'Node.js Basics', views: 300 }, { title: 'Hello World', views: 120 }] },
        { moTa: 'skip/take paging with two sort keys|||Phân trang skip/take với hai khoá sắp', goi: 'findMany(' + POSTS + ', { orderBy: [{ published: "desc" }, { id: "asc" }], skip: 2, take: 3, select: { id: true } }).map((p) => p.id)', mongDoi: [4, 5, 3] },
        { moTa: 'No args: a copy of everything; operators|||Không tham số: bản sao toàn bộ; toán tử', chuanBi: 'const P = ' + POSTS + '; const all = findMany(P); all[0].title = "X";', goi: '[all.length, P[0].title, findMany(P, { where: { views: { lt: 50 }, title: { contains: "a" } } }).map((p) => p.id)]', mongDoi: [6, 'Hello World', [2, 3, 6]] },
      ],
    },
    {
      tieuDe: 'Dịch where sang SQL có tham số',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['sinh SQL', 'tham số', 'IS NULL'], tienQuyet: ['đệ quy', 'join'], the: ['javascript', 'prisma', 'sql'],
      moTa: `${BAI}<p>Viết ${c('whereToSql(where)')} trả ${c('{ sql, params }')} như Prisma sinh ra: mỗi điều kiện cột thành ${c('"<cột> <op> ?"')} với giá trị trong ${c('params')} theo thứ tự; giá trị trực tiếp ⇒ ${c('=')}, nhưng ${c('null')} ⇒ ${c('"<cột> IS NULL"')} (không tham số); toán tử ${c('gt')} ⇒ ${c('>')}, ${c('gte')} ⇒ ${c('>=')}, ${c('lt')} ⇒ ${c('<')}, ${c('lte')} ⇒ ${c('<=')}, ${c('not')} ⇒ ${c('<>')} (${c('not: null')} ⇒ ${c('IS NOT NULL')}), ${c('in')} ⇒ ${c('IN (?, ?)')}, ${c('contains')} ⇒ ${c('LIKE ?')} với tham số ${c("'%' + giá trị + '%'")}. Các điều kiện nối bằng ${c(' AND ')}; ${c('OR: [...]')} ⇒ ${c('(a OR b)')} với mỗi nhánh là kết quả đệ quy (nhánh nhiều điều kiện được bọc ngoặc). Tên cột phải khớp ${c('/^[A-Za-z_][A-Za-z0-9_]*$/')} (sai ⇒ ${c('TypeError')}). ${c('where')} rỗng ⇒ ${c('{ sql: "1=1", params: [] }')}.</p>`,
      yeuCau: ['Giá trị chỉ ở params.', 'null ⇒ IS NULL.', 'OR có ngoặc.', 'Kiểm tên cột.'],
      dauVao: 'where: object.', dauRa: '{ sql, params }.',
      rangBuoc: ['Không cần AND/NOT lồng ngoài OR.'],
      viDu: [{ input: 'whereToSql({ published: true, views: { gte: 80 } })', output: '{ sql: "published = ? AND views >= ?", params: [true, 80] }', explanation: 'Như "WHERE Post.published = ?" trong log của bài.' }],
      goiY: ['const OPS = { gt: ">", gte: ">=", lt: "<", lte: "<=", not: "<>" };', 'OR: "(" + v.map((w) => { const r = whereToSql(w); … }).join(" OR ") + ")"'],
      khoiDau: { 'main.js': `// Bài 8.5 — where thành SQL
function whereToSql(where) {
  const parts = Object.entries(where).map(([k, v]) => k + " = '" + v + "'");
  return { sql: parts.join(' AND '), params: [] };
}
` },
      loiGiai: { 'main.js': `// Bài 8.5 — điều kiện thành SQL, giá trị thành tham số; NULL dùng IS NULL
const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
const OPS = { gt: '>', gte: '>=', lt: '<', lte: '<=' };

function whereToSql(where) {
  const parts = [];
  const params = [];
  for (const [k, v] of Object.entries(where)) {
    if (k === 'OR') {
      const branches = v.map((w) => {
        const r = whereToSql(w);
        params.push(...r.params);
        return Object.keys(w).length > 1 ? '(' + r.sql + ')' : r.sql;
      });
      parts.push('(' + branches.join(' OR ') + ')');
      continue;
    }
    if (!IDENT.test(k)) throw new TypeError('bad column name: ' + k);
    if (v === null) { parts.push(k + ' IS NULL'); continue; }
    if (typeof v !== 'object' || Array.isArray(v)) { parts.push(k + ' = ?'); params.push(v); continue; }
    for (const [op, arg] of Object.entries(v)) {
      if (op in OPS) { parts.push(´@{k} @{OPS[op]} ?´); params.push(arg); }
      else if (op === 'not') {
        if (arg === null) parts.push(k + ' IS NOT NULL');
        else { parts.push(k + ' <> ?'); params.push(arg); }
      } else if (op === 'in') { parts.push(´@{k} IN (@{arg.map(() => '?').join(', ')})´); params.push(...arg); }
      else if (op === 'contains') { parts.push(k + ' LIKE ?'); params.push('%' + arg + '%'); }
      else throw new TypeError('unsupported operator ' + op);
    }
  }
  return { sql: parts.length ? parts.join(' AND ') : '1=1', params };
}
` },
      giaiThich: `<p>Đây là trái tim của một ORM: đổi một object JavaScript thành SQL mà giá trị KHÔNG BAO GIỜ nằm trong chuỗi. ${c('{ authorId: null }')} phải thành ${c('IS NULL')} — sinh ${c('authorId = ?')} với tham số null sẽ khớp 0 dòng (bẫy NULL của Bài 8.2). Ngoặc quanh OR quan trọng: thiếu nó, ${c('a AND b OR c')} được hiểu là ${c('(a AND b) OR c')}.</p>`,
      loiHayGap: ['Đặt giá trị trong chuỗi SQL.', 'null thành "= ?".', 'Quên ngoặc quanh OR.'],
      thamKhao: 'https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting',
      kiem: [
        { moTa: 'AND of simple conditions|||AND các điều kiện đơn', goi: 'whereToSql({ published: true, views: { gte: 80, lt: 200 } })', mongDoi: { sql: 'published = ? AND views >= ? AND views < ?', params: [true, 80, 200] } },
        { moTa: 'NULL, not, in, contains|||NULL, not, in, contains', goi: 'whereToSql({ authorId: null, title: { not: null, contains: "SQL" }, id: { in: [1, 2, 3] } })', mongDoi: { sql: 'authorId IS NULL AND title IS NOT NULL AND title LIKE ? AND id IN (?, ?, ?)', params: ['%SQL%', 1, 2, 3] } },
        { moTa: 'OR with parentheses; empty where|||OR có ngoặc; where rỗng', goi: '[whereToSql({ published: true, OR: [{ views: { gt: 200 } }, { authorId: 1, views: { lt: 50 } }] }), whereToSql({})]', mongDoi: [{ sql: 'published = ? AND (views > ? OR (authorId = ? AND views < ?))', params: [true, 200, 1, 50] }, { sql: '1=1', params: [] }] },
        { moTa: 'Bad column names throw|||Tên cột sai thì ném lỗi', goi: 'whereToSql({ "1=1; DROP TABLE Post; --": 1 })', mongDoi: { loi: 'TypeError' } },
      ],
    },
    {
      tieuDe: 'Kế hoạch db push',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['so sánh lược đồ', 'thay đổi phá huỷ', 'migration'], tienQuyet: ['Object.keys', 'Set'], the: ['javascript', 'prisma', 'migration'],
      moTa: `${BAI}<p>${c('prisma db push')} so lược đồ mới với CSDL và cảnh báo khi phải xoá dữ liệu. Viết ${c('pushPlan(current, next)')}: mỗi lược đồ là object ${c('{ TênModel: { tênCột: { type, optional? } } }')}. Trả ${c('{ steps, destructive }')}: ${c('steps')} là mảng chuỗi, theo thứ tự: tạo bảng mới (${c('"create table X"')}, theo thứ tự trong next), xoá bảng (${c('"drop table X"')}, theo thứ tự trong current), rồi với mỗi bảng còn ở cả hai (theo thứ tự trong next): thêm cột (${c('"add column X.c"')}), xoá cột (${c('"drop column X.c"')}), đổi kiểu (${c('"change type X.c: A -> B"')}). Thêm cột BẮT BUỘC (không optional) vào bảng đã có ⇒ thêm hậu tố ${c('" (required: existing rows need a default)"')}. ${c('destructive')} là ${c('true')} nếu có drop table, drop column hoặc change type.</p>`,
      yeuCau: ['Đúng thứ tự các bước.', 'Đánh dấu thêm cột bắt buộc.', 'destructive đúng.'],
      dauVao: 'current, next: object.', dauRa: '{ steps: string[], destructive: boolean }.',
      rangBuoc: ['Không cần xét quan hệ hay chỉ mục.'],
      viDu: [{ input: 'đổi tên cột views thành viewCount', output: '["add column Post.viewCount …", "drop column Post.views"], destructive: true', explanation: 'db push hiểu "đổi tên" là xoá + thêm — mất dữ liệu cột cũ. Migration viết tay mới làm được RENAME.' }],
      goiY: ['const tablesNow = Object.keys(current), tablesNext = Object.keys(next);', 'for (const t of tablesNext.filter((t) => t in current)) { const a = current[t], b = next[t]; … }'],
      khoiDau: { 'main.js': `// Bài 8.5 — kế hoạch db push
function pushPlan(current, next) {
  const steps = Object.keys(next).filter((t) => !(t in current)).map((t) => 'create table ' + t);
  return { steps, destructive: false };
}
` },
      loiGiai: { 'main.js': `// Bài 8.5 — so hai lược đồ; mọi bước làm mất dữ liệu đều phải bị gắn cờ
function pushPlan(current, next) {
  const steps = [];
  let destructive = false;
  for (const t of Object.keys(next)) if (!(t in current)) steps.push('create table ' + t);
  for (const t of Object.keys(current)) if (!(t in next)) { steps.push('drop table ' + t); destructive = true; }
  for (const t of Object.keys(next)) {
    if (!(t in current)) continue;
    const a = current[t];
    const b = next[t];
    for (const col of Object.keys(b)) {
      if (!(col in a)) {
        steps.push(´add column @{t}.@{col}´ + (b[col].optional ? '' : ' (required: existing rows need a default)'));
      }
    }
    for (const col of Object.keys(a)) {
      if (!(col in b)) { steps.push(´drop column @{t}.@{col}´); destructive = true; }
    }
    for (const col of Object.keys(b)) {
      if (col in a && a[col].type !== b[col].type) {
        steps.push(´change type @{t}.@{col}: @{a[col].type} -> @{b[col].type}´);
        destructive = true;
      }
    }
  }
  return { steps, destructive };
}
` },
      giaiThich: `<p>Đây là phần cảnh báo "You are about to drop the column…" của ${c('db push')}. Chú ý ví dụ đổi tên: công cụ so lược đồ không thể biết ${c('views')} và ${c('viewCount')} là cùng một cột, nên nó xoá và tạo mới — mất hết dữ liệu. Vì thế dữ liệu thật đi bằng migration viết rõ (${c('ALTER TABLE … RENAME COLUMN')}), được review trước khi chạy.</p>`,
      loiHayGap: ['Không gắn cờ đổi kiểu.', 'Coi đổi tên cột là an toàn.', 'Sai thứ tự các bước.'],
      thamKhao: 'https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema',
      kiem: [
        { moTa: 'A rename is a drop plus an add|||Đổi tên là xoá cộng thêm', goi: 'pushPlan({ Post: { id: { type: "Int" }, title: { type: "String" }, views: { type: "Int" } } }, { Post: { id: { type: "Int" }, title: { type: "String" }, viewCount: { type: "Int" } } })', mongDoi: { steps: ['add column Post.viewCount (required: existing rows need a default)', 'drop column Post.views'], destructive: true } },
        { moTa: 'Safe changes only|||Chỉ thay đổi an toàn', goi: 'pushPlan({ User: { id: { type: "Int" } } }, { User: { id: { type: "Int" }, bio: { type: "String", optional: true } }, Tag: { id: { type: "Int" }, name: { type: "String" } } })', mongDoi: { steps: ['create table Tag', 'add column User.bio'], destructive: false } },
        { moTa: 'Drop table and change type|||Xoá bảng và đổi kiểu', goi: 'pushPlan({ User: { id: { type: "Int" }, age: { type: "String" } }, Legacy: { id: { type: "Int" } } }, { User: { id: { type: "Int" }, age: { type: "Int" } } })', mongDoi: { steps: ['drop table Legacy', 'change type User.age: String -> Int'], destructive: true } },
      ],
    },
  ],
});
