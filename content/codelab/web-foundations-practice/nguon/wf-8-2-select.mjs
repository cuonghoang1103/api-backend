/** Bộ luyện bài 8.2 — SELECT. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Tự cài đặt ngữ nghĩa SQL bằng JS trên các dòng của blog.sql: LIKE, logic ba giá trị của NULL, ORDER BY nhiều khoá (NULL trước),
 *  LIMIT/OFFSET, GROUP BY với count/sum/avg, và một bộ chạy truy vấn theo đúng thứ tự FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 8.2 — SELECT.</em> Máy chấm không có CSDL, nên bạn tự viết lại bằng JavaScript đúng ngữ nghĩa của từng mệnh đề — cách chắc nhất để hiểu chúng.</p>';
const POSTS = '[{ id: 1, user_id: 1, title: "Hello World", views: 120, published: 1 }, { id: 2, user_id: 1, title: "Learning SQL", views: 45, published: 1 }, { id: 3, user_id: 2, title: "Draft Post", views: 3, published: 0 }, { id: 4, user_id: 2, title: "Node.js Basics", views: 300, published: 1 }, { id: 5, user_id: 1, title: "Old Announcement", views: 80, published: 1 }, { id: 6, user_id: null, title: "Orphan Draft", views: 0, published: 0 }]';

export default doiDau({
  slug: 'wf-8-2-select',
  ten: '8.2 SELECT',
  baiHoc: 'Nền tảng Web — Bài 8.2 SELECT: asking the database questions',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Đổi mẫu LIKE thành RegExp, logic ba giá trị của NULL, ORDER BY nhiều khoá với NULL đứng trước khi tăng dần, phân trang LIMIT/OFFSET, GROUP BY kèm count/sum/avg (count(cột) bỏ NULL), và một bộ chạy truy vấn theo đúng thứ tự thực thi của SQL — 6 bài, dữ liệu là bảng posts của blog.sql.',
  de: [
    {
      tieuDe: 'LIKE thành RegExp',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['LIKE', '% và _', 'thoát ký tự RegExp'], tienQuyet: ['RegExp', 'replace'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('likeToRegExp(pattern)')} trả RegExp khớp ĐÚNG như ${c('LIKE')} của SQLite: ${c('%')} = chuỗi bất kỳ (kể cả rỗng), ${c('_')} = đúng một ký tự, khớp TOÀN BỘ chuỗi (không phải một phần), không phân biệt hoa thường. Mọi ký tự khác là chữ thường của nó — kể cả ${c('.')}, ${c('*')}, ${c('(')} — phải được thoát.</p>`,
      yeuCau: ['% → .*, _ → .', 'Khớp cả chuỗi: ^…$.', 'Cờ i.', 'Thoát ký tự đặc biệt của RegExp.'],
      dauVao: 'pattern: string.', dauRa: 'RegExp.',
      rangBuoc: ['Không cần xử lý ESCAPE.'],
      viDu: [{ input: 'likeToRegExp("%SQL%").test("Learning sql")', output: 'true', explanation: 'LIKE của SQLite không phân biệt hoa thường với chữ ASCII.' }],
      goiY: ['pattern.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&") thoát ký tự đặc biệt — nhưng làm TRƯỚC khi đổi % và _.', 'new RegExp("^" + body + "$", "is")'],
      khoiDau: { 'main.js': `// Bài 8.2 — LIKE thành RegExp
function likeToRegExp(pattern) {
  return new RegExp(pattern.replaceAll('%', '.*'));
}
` },
      loiGiai: { 'main.js': `// Bài 8.2 — LIKE: % = bất kỳ, _ = một ký tự, khớp cả chuỗi, không phân biệt hoa thường
function likeToRegExp(pattern) {
  let body = '';
  for (const ch of pattern) {
    if (ch === '%') body += '.*';
    else if (ch === '_') body += '.';
    else body += ch.replace(/[.*+?^@{}()|[\\]\\\\/]/g, '\\\\$&');   // mọi ký tự khác là chính nó
  }
  return new RegExp('^' + body + '$', 'is');
}
` },
      giaiThich: `<p>Sai lầm hay gặp nhất khi tự làm bộ lọc kiểu LIKE là quên neo ^…$ (khi đó "SQL" khớp mọi chuỗi có chứa SQL dù mẫu không có %) và quên thoát ký tự — mẫu ${c('"v1.0"')} sẽ khớp ${c('"v1x0"')}. Trong SQL thật, nhớ rằng ${c('%')} và ${c('_')} do người dùng gõ cũng là ký tự đại diện (Bài 8.3 xử lý bằng ESCAPE).</p>`,
      loiHayGap: ['Không neo ^ và $.', 'Không thoát "." và "(".', 'Phân biệt hoa thường.'],
      thamKhao: 'https://sqlite.org/lang_expr.html#like',
      kiem: [
        { moTa: '% and case-insensitive|||% và không phân biệt hoa thường', goi: '[likeToRegExp("%SQL%").test("Learning sql"), likeToRegExp("Hello%").test("Hello World"), likeToRegExp("Hello%").test("Say Hello")]', mongDoi: [true, true, false] },
        { moTa: '_ is exactly one character; whole-string match|||_ là đúng một ký tự; khớp cả chuỗi', goi: '[likeToRegExp("P_n").test("Pen"), likeToRegExp("P_n").test("Pn"), likeToRegExp("SQL").test("Learning SQL")]', mongDoi: [true, false, false] },
        { moTa: 'Regex characters are literal|||Ký tự RegExp là chữ thường', goi: '[likeToRegExp("v1.0%").test("v1.0 notes"), likeToRegExp("v1.0%").test("v1x0 notes"), likeToRegExp("(draft)%").test("(DRAFT) plan"), likeToRegExp("a*b").test("aaab")]', mongDoi: [true, false, true, false] },
      ],
    },
    {
      tieuDe: 'NULL: logic ba giá trị',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['NULL', 'unknown', 'IS NULL'], tienQuyet: ['toán tử so sánh'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Trong SQL, so sánh với NULL không ra true hay false mà ra NULL ("chưa biết"). Viết ${c('sqlEq(a, b)')} trả ${c('null')} nếu ${c('a')} hoặc ${c('b')} là null, ngược lại ${c('a === b')}. Viết ${c('whereKeeps(result)')} trả ${c('true')} CHỈ khi ${c('result === true')} (WHERE bỏ cả false lẫn null). Viết ${c('sqlNot(x)')}: ${c('null')} giữ nguyên null, còn lại đảo boolean.</p>`,
      yeuCau: ['Ba hàm.', 'NULL lan truyền qua = và NOT.', 'WHERE chỉ giữ true.'],
      dauVao: 'giá trị bất kỳ.', dauRa: 'true | false | null.',
      rangBuoc: ['Coi undefined như null.'],
      viDu: [{ input: 'whereKeeps(sqlEq(null, null))', output: 'false', explanation: '"WHERE user_id = NULL" khớp 0 dòng — kể cả dòng có user_id là NULL.' }],
      goiY: ['const isNull = (v) => v === null || v === undefined;', 'sqlNot: return x === null ? null : !x;'],
      khoiDau: { 'main.js': `// Bài 8.2 — NULL
function sqlEq(a, b) { return a === b; }
function whereKeeps(result) { return result !== false; }
function sqlNot(x) { return !x; }
` },
      loiGiai: { 'main.js': `// Bài 8.2 — NULL là "chưa biết": so với nó ra chưa biết, và WHERE chỉ giữ dòng ĐÚNG
const isNull = (v) => v === null || v === undefined;
function sqlEq(a, b) {
  if (isNull(a) || isNull(b)) return null;                  // chưa biết, kể cả NULL = NULL
  return a === b;
}
function whereKeeps(result) {
  return result === true;                                    // false và null đều bị bỏ
}
function sqlNot(x) {
  return isNull(x) ? null : !x;                              // NOT chưa biết vẫn là chưa biết
}
` },
      giaiThich: `<p>Đây chính là lý do ${c('WHERE user_id = NULL')} trả 0 dòng và ${c('WHERE status <> "deleted"')} lặng lẽ bỏ các dòng NULL trong bài: ${c('sqlNot(sqlEq(null, "deleted"))')} là ${c('null')}, và WHERE không giữ null. Muốn hỏi "có phải NULL không" thì dùng ${c('IS NULL')}.</p>`,
      loiHayGap: ['null === null là true trong JS — nhưng không trong SQL.', 'WHERE giữ cả null.'],
      thamKhao: 'https://en.wikipedia.org/wiki/Null_(SQL)#Comparisons_with_NULL_and_the_three-valued_logic_(3VL)',
      kiem: [
        { moTa: 'Comparisons with NULL are NULL|||So với NULL ra NULL', goi: '[sqlEq(1, 1), sqlEq(1, 2), sqlEq(null, 1), sqlEq(null, null), sqlEq(undefined, 0)]', mongDoi: [true, false, null, null, null] },
        { moTa: 'WHERE keeps only true|||WHERE chỉ giữ true', goi: '[whereKeeps(true), whereKeeps(false), whereKeeps(null)]', mongDoi: [true, false, false] },
        { moTa: 'The <> trap from the lesson|||Bẫy <> của bài', goi: '[null, "draft", "deleted"].map((status) => whereKeeps(sqlNot(sqlEq(status, "deleted"))))', mongDoi: [false, true, false] },
      ],
    },
    {
      tieuDe: 'ORDER BY nhiều khoá',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['ORDER BY', 'ASC/DESC', 'NULL khi sắp xếp'], tienQuyet: ['toSorted', 'hàm so sánh'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('orderBy(rows, keys)')}: ${c('keys')} là mảng ${c('[cột, "asc" | "desc"]')}, so lần lượt từng khoá cho tới khi khác nhau. Như SQLite: NULL nhỏ hơn mọi giá trị (đứng ĐẦU khi asc, CUỐI khi desc); số so bằng giá trị, chuỗi so bằng ${c('<')}. Trả mảng MỚI, không sửa ${c('rows')}; các dòng bằng nhau trên mọi khoá giữ thứ tự cũ.</p>`,
      yeuCau: ['Nhiều khoá.', 'NULL nhỏ nhất.', 'Ổn định, không đột biến.'],
      dauVao: 'rows: object[]; keys: [string, "asc"|"desc"][].', dauRa: 'object[].',
      rangBuoc: ['Không dùng localeCompare.'],
      viDu: [{ input: 'orderBy(posts, [["published", "desc"], ["views", "desc"]])', output: 'Node.js Basics, Hello World, Old Announcement, Learning SQL, Draft Post, Orphan Draft', explanation: 'Bài đã đăng trước, trong mỗi nhóm xem nhiều trước.' }],
      goiY: ['const cmp = (a, b) => a === b ? 0 : a === null ? -1 : b === null ? 1 : a < b ? -1 : 1;', 'rows.toSorted((x, y) => { for (const [k, dir] of keys) { const r = cmp(x[k], y[k]); if (r) return dir === "desc" ? -r : r; } return 0; })'],
      khoiDau: { 'main.js': `// Bài 8.2 — ORDER BY
function orderBy(rows, keys) {
  const [k] = keys[0];
  return rows.sort((a, b) => a[k] - b[k]);
}
` },
      loiGiai: { 'main.js': `// Bài 8.2 — so từng khoá tới khi khác; NULL nhỏ nhất (đầu khi ASC, cuối khi DESC)
function orderBy(rows, keys) {
  const norm = (v) => (v === undefined ? null : v);
  const cmp = (a, b) => {
    a = norm(a); b = norm(b);
    if (a === b) return 0;
    if (a === null) return -1;
    if (b === null) return 1;
    return a < b ? -1 : 1;
  };
  return rows.toSorted((x, y) => {                          // toSorted: ổn định và không sửa mảng gốc
    for (const [k, dir] of keys) {
      const r = cmp(x[k], y[k]);
      if (r !== 0) return dir === 'desc' ? -r : r;
    }
    return 0;
  });
}
` },
      giaiThich: `<p>Khoá thứ hai chỉ được xét khi khoá đầu bằng nhau — vì vậy bài nói "luôn kết thúc bằng một khoá duy nhất như id" để phân trang ổn định. PostgreSQL thì mặc định NULL đứng CUỐI khi ASC (ngược SQLite) và cho chọn bằng ${c('NULLS FIRST / NULLS LAST')}.</p>`,
      loiHayGap: ['a - b với chuỗi ra NaN.', 'sort() sửa mảng gốc.', 'Bỏ qua khoá thứ hai.'],
      thamKhao: 'https://sqlite.org/lang_select.html#the_order_by_clause',
      kiem: [
        { moTa: 'Two keys|||Hai khoá', goi: 'orderBy(' + POSTS + ', [["published", "desc"], ["views", "desc"]]).map((p) => p.id)', mongDoi: [4, 1, 5, 2, 3, 6] },
        { moTa: 'NULL first when ascending, last when descending|||NULL đầu khi tăng, cuối khi giảm', goi: '[orderBy(' + POSTS + ', [["user_id", "asc"], ["id", "asc"]]).map((p) => p.id), orderBy(' + POSTS + ', [["user_id", "desc"], ["id", "asc"]]).map((p) => p.id)]', mongDoi: [[6, 1, 2, 5, 3, 4], [3, 4, 1, 2, 5, 6]] },
        { moTa: 'Strings, stability, no mutation|||Chuỗi, ổn định, không đột biến', chuanBi: 'const R = [{ n: "b", k: 1 }, { n: "a", k: 2 }, { n: "b", k: 3 }]; const S = orderBy(R, [["n", "asc"]]);', goi: '[S.map((r) => r.k), R.map((r) => r.k)]', mongDoi: [[2, 1, 3], [1, 2, 3]] },
      ],
    },
    {
      tieuDe: 'LIMIT và OFFSET',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['phân trang', 'OFFSET'], tienQuyet: ['slice'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('page(rows, pageNumber, size)')} trả ${c('{ items, page, size, total, pages }')} như API của Bài 6.5 làm bằng ${c('LIMIT size OFFSET (page − 1) × size')}: ${c('total')} là tổng số dòng, ${c('pages')} là số trang (ít nhất 1). ${c('pageNumber')} hoặc ${c('size')} không phải số nguyên ≥ 1 ⇒ ném ${c('RangeError')}. Trang vượt quá ⇒ ${c('items')} rỗng (không lỗi).</p>`,
      yeuCau: ['OFFSET = (page − 1) × size.', 'pages = ceil(total / size), tối thiểu 1.', 'Tham số sai ⇒ RangeError.'],
      dauVao: 'rows: any[]; pageNumber, size: number.', dauRa: 'object.',
      rangBuoc: ['Không sửa rows.'],
      viDu: [{ input: 'page(posts sắp theo id, 2, 2)', output: '{ items: [Draft Post, Node.js Basics], page: 2, size: 2, total: 6, pages: 3 }', explanation: 'LIMIT 2 OFFSET 2 trong bài.' }],
      goiY: ['if (!Number.isInteger(pageNumber) || pageNumber < 1 || …) throw new RangeError(…);', 'const offset = (pageNumber - 1) * size; rows.slice(offset, offset + size)'],
      khoiDau: { 'main.js': `// Bài 8.2 — LIMIT và OFFSET
function page(rows, pageNumber, size) {
  return { items: rows.slice(pageNumber * size, size) };
}
` },
      loiGiai: { 'main.js': `// Bài 8.2 — LIMIT size OFFSET (page − 1) × size, kèm tổng để vẽ thanh phân trang
function page(rows, pageNumber, size) {
  for (const [name, v] of [['page', pageNumber], ['size', size]]) {
    if (!Number.isInteger(v) || v < 1) throw new RangeError(name + ' must be a whole number ≥ 1');
  }
  const offset = (pageNumber - 1) * size;
  return {
    items: rows.slice(offset, offset + size),
    page: pageNumber,
    size,
    total: rows.length,
    pages: Math.max(1, Math.ceil(rows.length / size)),
  };
}
` },
      giaiThich: `<p>Công thức OFFSET là chỗ lệch một quen thuộc: trang 1 phải là OFFSET 0. Với bảng rất lớn, OFFSET 100 000 vẫn phải đi qua 100 000 dòng — các API lớn chuyển sang phân trang theo con trỏ (${c('WHERE id > ? ORDER BY id LIMIT ?')}).</p>`,
      loiHayGap: ['OFFSET = page × size (bỏ mất trang đầu).', 'slice(offset, size) thay vì slice(offset, offset + size).', 'pages = 0 khi rỗng.'],
      thamKhao: 'https://use-the-index-luke.com/no-offset',
      kiem: [
        { moTa: 'Page 2 of size 2|||Trang 2 cỡ 2', goi: 'page(' + POSTS + ', 2, 2)', mongDoi: { items: [{ id: 3, user_id: 2, title: 'Draft Post', views: 3, published: 0 }, { id: 4, user_id: 2, title: 'Node.js Basics', views: 300, published: 1 }], page: 2, size: 2, total: 6, pages: 3 } },
        { moTa: 'Last partial page, past the end, empty table|||Trang cuối thiếu, quá cuối, bảng rỗng', goi: '[page([1, 2, 3, 4, 5], 2, 4).items, page([1, 2, 3], 5, 2).items, page([], 1, 10)]', mongDoi: [[5], [], { items: [], page: 1, size: 10, total: 0, pages: 1 }] },
        { moTa: 'Bad parameters throw|||Tham số sai ném lỗi', goi: 'page([1], 0, 10)', mongDoi: { loi: 'RangeError' } },
        { moTa: 'Fractional size throws|||Cỡ trang lẻ ném lỗi', goi: 'page([1], 1, 2.5)', mongDoi: { loi: 'RangeError', thongDiep: 'size' } },
      ],
    },
    {
      tieuDe: 'GROUP BY với count, sum, avg',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['GROUP BY', 'hàm tổng hợp', 'count(cột)'], tienQuyet: ['Map', 'reduce'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('groupStats(rows, key, col)')} trả mỗi nhóm của ${c('key')} một object ${c('{ key, rows, count, sum, avg }')} theo THỨ TỰ XUẤT HIỆN đầu tiên: ${c('rows')} = ${c('count(*)')} (số dòng); ${c('count')} = ${c('count(col)')} (bỏ null); ${c('sum')} = tổng các giá trị khác null của ${c('col')} (${c('null')} nếu không có giá trị nào — như SQL); ${c('avg')} = trung bình các giá trị khác null làm tròn 1 chữ số (${c('null')} nếu không có). Giá trị ${c('null')} của ${c('key')} tạo nhóm riêng.</p>`,
      yeuCau: ['count(*) khác count(cột).', 'sum/avg của nhóm toàn null là null.', 'NULL là một nhóm.', 'Giữ thứ tự xuất hiện.'],
      dauVao: 'rows: object[]; key: string; col: string.', dauRa: 'object[].',
      rangBuoc: ['Dùng Map (giữ thứ tự, phân biệt null).'],
      viDu: [{ input: 'groupStats(posts, "user_id", "views")', output: '[{ key: 1, rows: 3, count: 3, sum: 245, avg: 81.7 }, { key: 2, …, sum: 303 }, { key: null, …, sum: 0 }]', explanation: 'Như GROUP BY user_id trong bài.' }],
      goiY: ['const groups = new Map(); for (const r of rows) { const k = r[key] ?? null; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }', 'const vals = g.map((r) => r[col]).filter((v) => v !== null && v !== undefined);'],
      khoiDau: { 'main.js': `// Bài 8.2 — GROUP BY
function groupStats(rows, key, col) {
  const out = {};
  for (const r of rows) out[r[key]] = (out[r[key]] ?? 0) + r[col];
  return out;
}
` },
      loiGiai: { 'main.js': `// Bài 8.2 — mỗi nhóm một dòng; hàm tổng hợp bỏ qua NULL, count(*) thì không
function groupStats(rows, key, col) {
  const groups = new Map();
  for (const r of rows) {
    const k = r[key] ?? null;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  return [...groups].map(([k, g]) => {
    const vals = g.map((r) => r[col]).filter((v) => v !== null && v !== undefined);
    const sum = vals.length ? vals.reduce((a, b) => a + b, 0) : null;
    return {
      key: k,
      rows: g.length,                                        // count(*)
      count: vals.length,                                    // count(col)
      sum,
      avg: vals.length ? Math.round((sum / vals.length) * 10) / 10 : null,
    };
  });
}
` },
      giaiThich: `<p>Hai điều làm SQL khác JavaScript ngây thơ: hàm tổng hợp bỏ qua NULL (${c('avg')} của [10, null] là 10, không phải 5), và ${c('sum')} của không giá trị nào là NULL chứ không phải 0. Object thường làm khoá null thành chuỗi "null" — Map thì không.</p>`,
      loiHayGap: ['Dùng object — null thành "null", số thành chuỗi.', 'Tính avg với mẫu số là count(*).', 'sum rỗng = 0.'],
      thamKhao: 'https://sqlite.org/lang_aggfunc.html',
      kiem: [
        { moTa: 'Views per author, like the lesson|||Lượt xem theo tác giả, như bài', goi: 'groupStats(' + POSTS + ', "user_id", "views")', mongDoi: [{ key: 1, rows: 3, count: 3, sum: 245, avg: 81.7 }, { key: 2, rows: 2, count: 2, sum: 303, avg: 151.5 }, { key: null, rows: 1, count: 1, sum: 0, avg: 0 }] },
        { moTa: 'count(*) vs count(col); all-NULL group|||count(*) và count(cột); nhóm toàn NULL', goi: 'groupStats([{ g: "a", v: 10 }, { g: "a", v: null }, { g: "b", v: null }], "g", "v")', mongDoi: [{ key: 'a', rows: 2, count: 1, sum: 10, avg: 10 }, { key: 'b', rows: 1, count: 0, sum: null, avg: null }] },
        { moTa: 'Number keys stay numbers|||Khoá số vẫn là số', goi: 'groupStats([{ k: 1, v: 1 }, { k: "1", v: 2 }], "k", "v").map((g) => typeof g.key)', mongDoi: ['number', 'string'] },
      ],
    },
    {
      tieuDe: 'Chạy truy vấn đúng thứ tự SQL',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['thứ tự thực thi', 'WHERE vs HAVING', 'bí danh'], tienQuyet: ['filter', 'Map', 'toSorted'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('runQuery(rows, q)')} thực thi một truy vấn có gom nhóm theo đúng thứ tự SQL. ${c('q')}: ${c('where(row)')} (tuỳ chọn), ${c('groupBy')} (tên cột), ${c('select')} (object ${c('tên → fn(nhómDòng, khoá)')} — mỗi hàm tính một cột của kết quả), ${c('having(kếtQuả)')} (tuỳ chọn, nhận dòng KẾT QUẢ đã tính), ${c('orderBy')} (mảng ${c('[cột-kết-quả, "asc"|"desc"]')}, tuỳ chọn), ${c('limit')} (tuỳ chọn). Thứ tự: WHERE → GROUP BY (theo thứ tự xuất hiện; null là một nhóm) → SELECT → HAVING → ORDER BY (ổn định) → LIMIT.</p>`,
      yeuCau: ['WHERE trước khi gom.', 'HAVING sau khi tính SELECT.', 'ORDER BY theo cột kết quả, ổn định.', 'LIMIT cuối cùng.'],
      dauVao: 'rows: object[]; q: object.', dauRa: 'object[].',
      rangBuoc: ['Một hàm tự đủ.'],
      viDu: [{ input: 'tác giả có ≥ 2 bài đã đăng, tổng lượt xem giảm dần', output: '[{ author: 1, posts: 3, views: 245 }]', explanation: 'Minh chỉ có 1 bài đã đăng sau WHERE.' }],
      goiY: ['let data = q.where ? rows.filter(q.where) : rows;', 'Tính select cho mỗi nhóm thành một object, rồi mới having/orderBy/limit trên mảng kết quả.'],
      khoiDau: { 'main.js': `// Bài 8.2 — chạy truy vấn đúng thứ tự
function runQuery(rows, q) {
  return rows.slice(0, q.limit).filter(q.where ?? (() => true));
}
` },
      loiGiai: { 'main.js': `// Bài 8.2 — FROM → WHERE → GROUP BY → SELECT → HAVING → ORDER BY → LIMIT
function runQuery(rows, q) {
  const filtered = q.where ? rows.filter(q.where) : rows;                 // WHERE: trên dòng, trước khi gom
  const groups = new Map();
  for (const r of filtered) {                                             // GROUP BY
    const k = r[q.groupBy] ?? null;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  let out = [...groups].map(([k, g]) =>                                   // SELECT: mỗi nhóm một dòng
    Object.fromEntries(Object.entries(q.select).map(([name, fn]) => [name, fn(g, k)])));
  if (q.having) out = out.filter(q.having);                               // HAVING: trên dòng kết quả
  if (q.orderBy) {
    out = out.toSorted((a, b) => {                                        // ORDER BY: ổn định
      for (const [col, dir] of q.orderBy) {
        if (a[col] === b[col]) continue;
        const r = a[col] === null ? -1 : b[col] === null ? 1 : a[col] < b[col] ? -1 : 1;
        return dir === 'desc' ? -r : r;
      }
      return 0;
    });
  }
  return q.limit === undefined ? out : out.slice(0, q.limit);             // LIMIT: sau cùng
}
` },
      giaiThich: `<p>Đặt từng mệnh đề vào đúng chỗ là thấy ngay vì sao WHERE không dùng được ${c('count(*)')} (nhóm chưa tồn tại) mà HAVING thì được, và vì sao "mười cái lớn nhất" cần ORDER BY trước LIMIT. Code khởi đầu cắt LIMIT trước khi lọc — đúng lỗi làm trang đầu thiếu dòng.</p>`,
      loiHayGap: ['Lọc having trên dòng gốc.', 'LIMIT trước ORDER BY.', 'Gom trước khi WHERE.'],
      thamKhao: 'https://sqlite.org/lang_select.html#generation_of_the_set_of_result_rows',
      kiem: [
        { moTa: 'Authors with ≥ 2 published posts|||Tác giả có ≥ 2 bài đã đăng', goi: 'runQuery(' + POSTS + ', { where: (p) => p.published === 1, groupBy: "user_id", select: { author: (g, k) => k, posts: (g) => g.length, views: (g) => g.reduce((s, p) => s + p.views, 0) }, having: (r) => r.posts >= 2, orderBy: [["views", "desc"]] })', mongDoi: [{ author: 1, posts: 3, views: 245 }] },
        { moTa: 'Without WHERE/HAVING; NULL group; LIMIT|||Không WHERE/HAVING; nhóm NULL; LIMIT', goi: 'runQuery(' + POSTS + ', { groupBy: "user_id", select: { author: (g, k) => k, posts: (g) => g.length }, orderBy: [["posts", "asc"], ["author", "asc"]], limit: 2 })', mongDoi: [{ author: null, posts: 1 }, { author: 2, posts: 2 }] },
        { moTa: 'HAVING sees computed columns|||HAVING thấy cột đã tính', goi: 'runQuery(' + POSTS + ', { groupBy: "published", select: { published: (g, k) => k, avg: (g) => Math.round(g.reduce((s, p) => s + p.views, 0) / g.length) }, having: (r) => r.avg > 100 })', mongDoi: [{ published: 1, avg: 136 }] },
      ],
    },
  ],
});
