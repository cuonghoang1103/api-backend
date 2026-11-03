/** Bộ luyện bài 8.1 — Vì sao cần cơ sở dữ liệu. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm không có CSDL ⇒ các bài mô phỏng bằng JS đúng những gì CSDL làm: kiểu SQLite, đổi kết quả thành object,
 *  mất cập nhật khi đọc-đổi-ghi xen kẽ, ràng buộc NOT NULL/UNIQUE/CHECK, khoá ngoại, và một bảng nhỏ trong bộ nhớ. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 8.1 — Vì sao cần cơ sở dữ liệu.</em> Mỗi bài tự dựng lại bằng JavaScript một việc mà CSDL làm cho bạn — để thấy vì sao không nên tự làm nó trong app.</p>';

export default doiDau({
  slug: 'wf-8-1-databases',
  ten: '8.1 Vì sao cần cơ sở dữ liệu',
  baiHoc: 'Nền tảng Web — Bài 8.1 Why a database',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Kiểu dữ liệu kiểu SQLite, đổi kết quả cột/giá trị thành object, mô phỏng mất cập nhật khi hai request đọc-đổi-ghi xen kẽ, kiểm ràng buộc NOT NULL/UNIQUE/CHECK đúng thông báo của SQLite, tìm dòng vi phạm khoá ngoại, và dựng một bảng nhỏ trong bộ nhớ — 6 bài.',
  de: [
    {
      tieuDe: 'Kiểu dữ liệu kiểu SQLite',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['kiểu lưu trữ', 'NULL'], tienQuyet: ['typeof', 'Number.isInteger'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('sqliteTypeof(value)')} trả đúng như hàm ${c('typeof()')} của SQLite cho một giá trị JavaScript sắp được lưu: ${c('null')}/${c('undefined')} ⇒ ${c('"null"')}; số nguyên ⇒ ${c('"integer"')}; số không nguyên (kể cả NaN, Infinity) ⇒ ${c('"real"')}; chuỗi ⇒ ${c('"text"')}; boolean ⇒ ${c('"integer"')} (SQLite không có kiểu boolean, lưu 0/1); ${c('Uint8Array')} ⇒ ${c('"blob"')}; còn lại (object, mảng) ⇒ ném ${c('TypeError')} — phải tự ${c('JSON.stringify')} trước khi lưu.</p>`,
      yeuCau: ['Sáu nhánh như mô tả.', 'boolean là integer.', 'object/mảng ⇒ TypeError.'],
      dauVao: 'value: any.', dauRa: 'string.',
      rangBuoc: ['Không cần xử lý BigInt.'],
      viDu: [{ input: 'sqliteTypeof(true)', output: '"integer"', explanation: 'published được lưu là 1 — như cột published trong blog.sql.' }],
      goiY: ['if (value === null || value === undefined) return "null";', 'if (typeof value === "number") return Number.isInteger(value) ? "integer" : "real";'],
      khoiDau: { 'main.js': `// Bài 8.1 — kiểu dữ liệu kiểu SQLite
function sqliteTypeof(value) {
  return typeof value;
}
` },
      loiGiai: { 'main.js': `// Bài 8.1 — năm kiểu lưu trữ của SQLite: null, integer, real, text, blob
function sqliteTypeof(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return 'integer';          // SQLite lưu true/false thành 1/0
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'real';
  if (typeof value === 'string') return 'text';
  if (value instanceof Uint8Array) return 'blob';
  throw new TypeError('cannot store a ' + (Array.isArray(value) ? 'array' : typeof value) + ' — JSON.stringify it first');
}
` },
      giaiThich: `<p>Cột trong CSDL có kiểu cố định; object JavaScript thì không. Ranh giới này là nơi lỗi xuất hiện: boolean thành 0/1 (Prisma đổi ngược lại cho bạn ở Bài 8.5), object phải được chuyển thành chuỗi JSON. PostgreSQL có thêm kiểu boolean và JSON thật.</p>`,
      loiHayGap: ['Trả "number" cho mọi số.', 'Cố lưu object trực tiếp — ra "[object Object]".'],
      thamKhao: 'https://sqlite.org/datatype3.html',
      kiem: [
        { moTa: 'Numbers, text and null|||Số, chữ và null', goi: '[sqliteTypeof(42), sqliteTypeof(4.5), sqliteTypeof("Lan"), sqliteTypeof(null), sqliteTypeof(undefined)]', mongDoi: ['integer', 'real', 'text', 'null', 'null'] },
        { moTa: 'Booleans and bytes|||Boolean và byte', goi: '[sqliteTypeof(true), sqliteTypeof(false), sqliteTypeof(new Uint8Array([1, 2])), sqliteTypeof(NaN)]', mongDoi: ['integer', 'integer', 'blob', 'real'] },
        { moTa: 'Objects must be stringified|||Object phải được stringify', goi: 'sqliteTypeof({ a: 1 })', mongDoi: { loi: 'TypeError' } },
      ],
    },
    {
      tieuDe: 'Đổi kết quả thành object',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['kết quả truy vấn', 'cột và giá trị'], tienQuyet: ['map', 'Object.fromEntries'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Nhiều thư viện CSDL trả kết quả dạng ${c('{ columns: ["id", "name"], values: [[1, "Lan"], [2, "Minh"]] }')}. Viết ${c('rowsToObjects(result)')} trả mảng object ${c('[{ id: 1, name: "Lan" }, …]')}. Một dòng có số giá trị khác số cột ⇒ ném ${c('RangeError')}. Không có dòng ⇒ ${c('[]')}.</p>`,
      yeuCau: ['Ghép cột với giá trị theo vị trí.', 'Sai số lượng ⇒ RangeError.'],
      dauVao: '{ columns: string[], values: any[][] }.', dauRa: 'object[].',
      rangBuoc: ['Không sửa result.'],
      viDu: [{ input: 'rowsToObjects({ columns: ["id", "name"], values: [[1, "Lan"]] })', output: '[{ id: 1, name: "Lan" }]', explanation: 'Như một dòng SELECT * FROM users.' }],
      goiY: ['result.values.map((row) => …)', 'Object.fromEntries(result.columns.map((col, i) => [col, row[i]]))'],
      khoiDau: { 'main.js': `// Bài 8.1 — đổi kết quả thành object
function rowsToObjects(result) {
  return result.values;
}
` },
      loiGiai: { 'main.js': `// Bài 8.1 — mỗi dòng: ghép tên cột thứ i với giá trị thứ i
function rowsToObjects(result) {
  return result.values.map((row) => {
    if (row.length !== result.columns.length) {
      throw new RangeError('row has ' + row.length + ' values for ' + result.columns.length + ' columns');
    }
    return Object.fromEntries(result.columns.map((col, i) => [col, row[i]]));
  });
}
` },
      giaiThich: `<p>Đây là việc nhỏ đầu tiên mà mọi lớp truy cập dữ liệu làm — và là chữ "M" (mapping) trong ORM. Ném lỗi khi số lượng lệch giúp lộ ngay lỗi kiểu ${c('SELECT *')} sau khi ai đó thêm cột.</p>`,
      loiHayGap: ['Trả mảng mảng như cũ.', 'Im lặng khi số cột lệch — dữ liệu bị gán nhầm cột.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries',
      kiem: [
        { moTa: 'The users table|||Bảng users', goi: 'rowsToObjects({ columns: ["id", "name", "email"], values: [[1, "Lan", "lan@example.com"], [2, "Minh", "minh@example.com"]] })', mongDoi: [{ id: 1, name: 'Lan', email: 'lan@example.com' }, { id: 2, name: 'Minh', email: 'minh@example.com' }] },
        { moTa: 'No rows; NULL values kept|||Không có dòng; giữ giá trị NULL', goi: '[rowsToObjects({ columns: ["id"], values: [] }), rowsToObjects({ columns: ["id", "user_id"], values: [[6, null]] })]', mongDoi: [[], [{ id: 6, user_id: null }]] },
        { moTa: 'Mismatched row throws|||Dòng lệch số lượng thì ném lỗi', goi: 'rowsToObjects({ columns: ["id", "name"], values: [[1]] })', mongDoi: { loi: 'RangeError' } },
      ],
    },
    {
      tieuDe: 'Mô phỏng mất cập nhật',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['lost update', 'đọc-đổi-ghi'], tienQuyet: ['vòng lặp', 'object'], the: ['javascript', 'đồng thời'],
      moTa: `${BAI}<p>Hai request A và B cùng cộng 1 vào một bộ đếm theo kiểu tệp JSON: mỗi request ${c('read')} (nhớ giá trị hiện tại vào biến riêng), rồi ${c('write')} (ghi giá trị-đã-nhớ + 1). Viết ${c('runSchedule(start, steps)')}: ${c('steps')} là mảng chuỗi như ${c('"A:read"')}, ${c('"B:write"')} theo thứ tự thực thi. Trả ${c('{ final, lost }')}: ${c('final')} là giá trị cuối của bộ đếm, ${c('lost')} là số lần ${c('write')} − (final − start). Một ${c('write')} mà request đó chưa ${c('read')} ⇒ ném ${c('Error')}.</p>`,
      yeuCau: ['Mỗi request có bộ nhớ riêng.', 'write dùng giá trị đã đọc, không đọc lại.', 'Đếm lost đúng.'],
      dauVao: 'start: number; steps: string[].', dauRa: '{ final, lost }.',
      rangBuoc: ['Tên request có thể là bất kỳ chuỗi nào trước dấu ":".'],
      viDu: [{ input: 'runSchedule(57, ["A:read", "B:read", "A:write", "B:write"])', output: '{ final: 58, lost: 1 }', explanation: 'Ví dụ 57 → 58 trong bài: một lượt thích biến mất.' }],
      goiY: ['const seen = {}; let value = start;', 'const [who, op] = step.split(":"); if (op === "read") seen[who] = value; else { … }'],
      khoiDau: { 'main.js': `// Bài 8.1 — mô phỏng mất cập nhật
function runSchedule(start, steps) {
  let value = start;
  for (const step of steps) if (step.endsWith('write')) value++;
  return { final: value, lost: 0 };
}
` },
      loiGiai: { 'main.js': `// Bài 8.1 — đọc vào bộ nhớ riêng, ghi giá trị cũ + 1: hai lần đọc trước hai lần ghi = mất một lần
function runSchedule(start, steps) {
  let value = start;
  const seen = {};                                           // giá trị mỗi request đã đọc
  let writes = 0;
  for (const step of steps) {
    const [who, op] = step.split(':');
    if (op === 'read') seen[who] = value;
    else if (op === 'write') {
      if (!(who in seen)) throw new Error(who + ' writes before reading');
      value = seen[who] + 1;                                 // ghi đè, không đọc lại
      delete seen[who];
      writes++;
    }
  }
  return { final: value, lost: writes - (value - start) };
}
` },
      giaiThich: `<p>Không có lần chạy nào "sai" về logic — mỗi request đều làm đúng. Lỗi nằm ở việc xen kẽ. CSDL giải bằng ${c('UPDATE … SET likes = likes + 1')}: đọc và ghi xảy ra trong một bước mà không gì chen vào được — đúng số 400 trong bài.</p>`,
      loiHayGap: ['Đọc lại giá trị lúc ghi — mất ý nghĩa mô phỏng.', 'Dùng chung một biến "đã đọc" cho mọi request.'],
      thamKhao: 'https://en.wikipedia.org/wiki/Write%E2%80%93write_conflict',
      kiem: [
        { moTa: 'Interleaved: one update lost|||Xen kẽ: mất một cập nhật', goi: 'runSchedule(57, ["A:read", "B:read", "A:write", "B:write"])', mongDoi: { final: 58, lost: 1 } },
        { moTa: 'One after the other: nothing lost|||Lần lượt: không mất gì', goi: 'runSchedule(0, ["A:read", "A:write", "B:read", "B:write", "A:read", "A:write"])', mongDoi: { final: 3, lost: 0 } },
        { moTa: 'Three clients, two lost|||Ba client, mất hai', goi: 'runSchedule(10, ["A:read", "B:read", "C:read", "C:write", "B:write", "A:write"])', mongDoi: { final: 11, lost: 2 } },
        { moTa: 'Writing before reading throws|||Ghi trước khi đọc thì ném lỗi', goi: 'runSchedule(0, ["A:write"])', mongDoi: { loi: 'Error', thongDiep: 'before reading' } },
      ],
    },
    {
      tieuDe: 'Kiểm ràng buộc như SQLite',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['NOT NULL', 'UNIQUE', 'CHECK'], tienQuyet: ['object', 'some'], the: ['javascript', 'sql', 'ràng buộc'],
      moTa: `${BAI}<p>Viết ${c('checkRow(table, row, existing)')} trả ${c('null')} nếu hợp lệ, hoặc ĐÚNG thông báo đầu tiên SQLite sẽ báo. ${c('table')} là ${c('{ name, columns: { tên: { notNull?, unique? } }, checks: [{ text, test }] }')}; ${c('existing')} là các dòng đang có. Thứ tự kiểm: mọi cột ${c('notNull')} (theo thứ tự khai báo; ${c('null')} hoặc ${c('undefined')} là vi phạm) ⇒ ${c('"NOT NULL constraint failed: <bảng>.<cột>"')}; rồi mọi CHECK ⇒ ${c('"CHECK constraint failed: <text>"')}; rồi mọi cột ${c('unique')} (bỏ qua giá trị null) ⇒ ${c('"UNIQUE constraint failed: <bảng>.<cột>"')}.</p>`,
      yeuCau: ['Đúng thứ tự NOT NULL → CHECK → UNIQUE.', 'Đúng chữ thông báo.', 'UNIQUE bỏ qua null.'],
      dauVao: 'table: object; row: object; existing: object[].', dauRa: 'string | null.',
      rangBuoc: ['test(row) trả boolean; cho sẵn trong table.'],
      viDu: [{ input: 'chèn email lan@example.com lần hai', output: '"UNIQUE constraint failed: users.email"', explanation: 'Đúng thông báo sqlite3 ở Bước 4 của bài.' }],
      goiY: ['for (const [col, rule] of Object.entries(table.columns)) if (rule.notNull && row[col] == null) return …', 'existing.some((r) => r[col] === row[col])'],
      khoiDau: { 'main.js': `// Bài 8.1 — kiểm ràng buộc
function checkRow(table, row, existing) {
  if (!row.name) return 'name is required';
  return null;
}
` },
      loiGiai: { 'main.js': `// Bài 8.1 — CSDL từ chối dữ liệu sai cho MỌI đường mã: NOT NULL → CHECK → UNIQUE
function checkRow(table, row, existing) {
  for (const [col, rule] of Object.entries(table.columns)) {
    if (rule.notNull && (row[col] === null || row[col] === undefined)) {
      return ´NOT NULL constraint failed: @{table.name}.@{col}´;
    }
  }
  for (const check of table.checks ?? []) {
    if (!check.test(row)) return ´CHECK constraint failed: @{check.text}´;
  }
  for (const [col, rule] of Object.entries(table.columns)) {
    if (rule.unique && row[col] !== null && row[col] !== undefined && existing.some((r) => r[col] === row[col])) {
      return ´UNIQUE constraint failed: @{table.name}.@{col}´;
    }
  }
  return null;
}
` },
      giaiThich: `<p>Thông báo theo đúng mẫu của SQLite giúp bạn đọc lỗi thật nhanh hơn — và cho thấy vì sao app nên đổi chúng thành câu thân thiện (409 "email đã được đăng ký") thay vì đưa thẳng cho người dùng. ${c('""')} (chuỗi rỗng) không phải NULL: ràng buộc NOT NULL không chặn nó — muốn chặn phải thêm CHECK ${c('length(name) > 0')}.</p>`,
      loiHayGap: ['Coi "" là null.', 'Cho hai null vi phạm UNIQUE (SQL cho phép nhiều NULL).', 'Sai thứ tự kiểm.'],
      thamKhao: 'https://sqlite.org/lang_createtable.html#constraint_enforcement',
      kiem: [
        { moTa: 'The three refusals from the lesson|||Ba lần từ chối trong bài', chuanBi: 'const U = { name: "users", columns: { name: { notNull: true }, email: { notNull: true, unique: true } }, checks: [] }; const P = { name: "posts", columns: { title: { notNull: true } }, checks: [{ text: "views >= 0", test: (r) => r.views >= 0 }] }; const old = [{ name: "Lan", email: "lan@example.com" }];', goi: '[checkRow(U, { name: "Lan 2", email: "lan@example.com" }, old), checkRow(U, { name: null, email: "x@example.com" }, old), checkRow(P, { title: "Bad", views: -5 }, [])]', mongDoi: ['UNIQUE constraint failed: users.email', 'NOT NULL constraint failed: users.name', 'CHECK constraint failed: views >= 0'] },
        { moTa: 'Valid row; empty string is not NULL|||Dòng hợp lệ; chuỗi rỗng không phải NULL', chuanBi: 'const U = { name: "users", columns: { name: { notNull: true }, email: { notNull: true, unique: true } }, checks: [] };', goi: '[checkRow(U, { name: "An", email: "an@example.com" }, [{ name: "Lan", email: "lan@example.com" }]), checkRow(U, { name: "", email: "e@x.vn" }, [])]', mongDoi: [null, null] },
        { moTa: 'Order NOT NULL → CHECK → UNIQUE; NULLs not unique-checked|||Thứ tự NOT NULL → CHECK → UNIQUE; NULL không bị kiểm unique', chuanBi: 'const T = { name: "t", columns: { a: { notNull: true }, b: { unique: true } }, checks: [{ text: "a > 0", test: (r) => r.a > 0 }] };', goi: '[checkRow(T, { b: 1 }, [{ a: 1, b: 1 }]), checkRow(T, { a: -1, b: 1 }, [{ a: 1, b: 1 }]), checkRow(T, { a: 2, b: null }, [{ a: 1, b: null }])]', mongDoi: ['NOT NULL constraint failed: t.a', 'CHECK constraint failed: a > 0', null] },
      ],
    },
    {
      tieuDe: 'Dòng vi phạm khoá ngoại',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['khoá ngoại', 'tính toàn vẹn tham chiếu'], tienQuyet: ['Set', 'filter'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('foreignKeyViolations(children, fkColumn, parents)')}: trả mảng ${c('id')} của các dòng con mà giá trị ${c('fkColumn')} KHÁC null và KHÔNG khớp ${c('id')} của dòng cha nào — những dòng mà SQLite sẽ chấp nhận khi quên ${c('PRAGMA foreign_keys = ON')}. Giữ thứ tự của ${c('children')}.</p>`,
      yeuCau: ['null là hợp lệ (quan hệ tuỳ chọn).', 'So id kiểu số.', 'Giữ thứ tự.'],
      dauVao: 'children: object[]; fkColumn: string; parents: { id }[].', dauRa: 'number[].',
      rangBuoc: ['Hiệu quả: dùng Set, không lồng vòng lặp.'],
      viDu: [{ input: 'bài "Ghost author" có user_id 99', output: '[7]', explanation: 'Không có người dùng 99.' }],
      goiY: ['const ids = new Set(parents.map((p) => p.id));', 'children.filter((ch) => ch[fkColumn] !== null && !ids.has(ch[fkColumn])).map((ch) => ch.id)'],
      khoiDau: { 'main.js': `// Bài 8.1 — dòng vi phạm khoá ngoại
function foreignKeyViolations(children, fkColumn, parents) {
  return children.filter((ch) => !parents.includes(ch[fkColumn])).map((ch) => ch.id);
}
` },
      loiGiai: { 'main.js': `// Bài 8.1 — khoá ngoại: giá trị phải là id của một dòng cha có thật (hoặc NULL)
function foreignKeyViolations(children, fkColumn, parents) {
  const ids = new Set(parents.map((p) => p.id));             // tra O(1) thay vì quét mảng mỗi lần
  return children
    .filter((ch) => ch[fkColumn] !== null && ch[fkColumn] !== undefined && !ids.has(ch[fkColumn]))
    .map((ch) => ch.id);
}
` },
      giaiThich: `<p>Đây là câu hỏi ${c('PRAGMA foreign_key_check')} của SQLite trả lời — hữu ích khi bạn bật khoá ngoại muộn trên một CSDL đã có dữ liệu "mồ côi". Bật khoá ngoại ngay từ đầu thì CSDL không bao giờ để những dòng này lọt vào.</p>`,
      loiHayGap: ['Coi user_id null là vi phạm.', 'So với mảng object (includes) thay vì tập id.'],
      thamKhao: 'https://sqlite.org/pragma.html#pragma_foreign_key_check',
      kiem: [
        { moTa: 'Ghost author found; NULL allowed|||Tìm ra tác giả ma; NULL được phép', goi: 'foreignKeyViolations([{ id: 1, user_id: 1 }, { id: 6, user_id: null }, { id: 7, user_id: 99 }], "user_id", [{ id: 1 }, { id: 2 }, { id: 3 }])', mongDoi: [7] },
        { moTa: 'Order kept, several violations|||Giữ thứ tự, nhiều vi phạm', goi: 'foreignKeyViolations([{ id: 5, post_id: 9 }, { id: 2, post_id: 1 }, { id: 3, post_id: 8 }], "post_id", [{ id: 1 }])', mongDoi: [5, 3] },
        { moTa: 'No parents at all|||Không có dòng cha nào', goi: 'foreignKeyViolations([{ id: 1, a: 1 }, { id: 2, a: null }], "a", [])', mongDoi: [1] },
      ],
    },
    {
      tieuDe: 'Một bảng nhỏ trong bộ nhớ',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['khoá chính tự tăng', 'DEFAULT', 'ràng buộc'], tienQuyet: ['closure', 'object'], the: ['javascript', 'sql'],
      moTa: `${BAI}<p>Viết ${c('createTable(def)')} — ${c('def')} như bài "Kiểm ràng buộc" và thêm ${c('columns[c].default')} (giá trị dùng khi dòng chèn vào thiếu cột hoặc là ${c('undefined')}). Trả ${c('{ insert(row), all() }')}: ${c('insert')} gán ${c('id')} tự tăng từ 1 (bỏ qua ${c('id')} mà row gửi lên), điền default, kiểm ràng buộc (NOT NULL → CHECK → UNIQUE, cùng thông báo), rồi trả ${c('{ ok: true, row }')} (bản SAO) hoặc ${c('{ ok: false, error }')}; lần chèn hỏng KHÔNG tiêu tốn id. ${c('all()')} trả bản sao mọi dòng theo id. Chỉ các cột khai trong ${c('columns')} được lưu (cộng ${c('id')}).</p>`,
      yeuCau: ['id tự tăng, không dùng id của client.', 'DEFAULT trước khi kiểm.', 'Lỗi không tốn id, không lưu gì.', 'Trả bản sao.'],
      dauVao: 'def: { name, columns, checks }.', dauRa: '{ insert, all }.',
      rangBuoc: ['Một hàm tự đủ.'],
      viDu: [{ input: 'insert({ name: "An", email: "an@example.com" }) sau 2 dòng', output: '{ ok: true, row: { id: 3, name: "An", email: "an@example.com", role: "user" } }', explanation: 'role lấy DEFAULT "user".' }],
      goiY: ['let nextId = 1; const rows = [];', 'const row = { id: nextId }; for (const [col, rule] of Object.entries(def.columns)) row[col] = input[col] === undefined ? rule.default ?? null : input[col];'],
      khoiDau: { 'main.js': `// Bài 8.1 — một bảng nhỏ trong bộ nhớ
function createTable(def) {
  const rows = [];
  return {
    insert(row) { rows.push(row); return { ok: true, row }; },
    all() { return rows; },
  };
}
` },
      loiGiai: { 'main.js': `// Bài 8.1 — khoá chính tự tăng, DEFAULT, ràng buộc — thứ CSDL làm ở mỗi INSERT
function createTable(def) {
  const rows = [];
  let nextId = 1;
  const copy = (r) => ({ ...r });

  function violation(row) {
    for (const [col, rule] of Object.entries(def.columns)) {
      if (rule.notNull && row[col] === null) return ´NOT NULL constraint failed: @{def.name}.@{col}´;
    }
    for (const check of def.checks ?? []) if (!check.test(row)) return ´CHECK constraint failed: @{check.text}´;
    for (const [col, rule] of Object.entries(def.columns)) {
      if (rule.unique && row[col] !== null && rows.some((r) => r[col] === row[col])) return ´UNIQUE constraint failed: @{def.name}.@{col}´;
    }
    return null;
  }

  return {
    insert(input) {
      const row = { id: nextId };                            // id của client bị bỏ qua
      for (const [col, rule] of Object.entries(def.columns)) {
        row[col] = input[col] === undefined ? (rule.default ?? null) : input[col];
      }
      const error = violation(row);
      if (error) return { ok: false, error };                // không lưu, không tiêu id
      rows.push(row);
      nextId++;
      return { ok: true, row: copy(row) };
    },
    all() { return rows.map(copy); },
  };
}
` },
      giaiThich: `<p>Chừng ấy dòng mới là một phần rất nhỏ của một INSERT thật — chưa có đĩa, chưa có giao dịch, chưa có chỉ mục, chưa có nhiều kết nối cùng lúc. Đó chính là lý do của Bài 8.1: đừng tự viết CSDL trong app. (CSDL thật đôi khi CÓ tiêu id khi chèn hỏng — id không được coi là liên tục.)</p>`,
      loiHayGap: ['Dùng id client gửi lên.', 'Tăng id trước khi kiểm.', 'Trả tham chiếu tới dòng bên trong.'],
      thamKhao: 'https://sqlite.org/autoinc.html',
      kiem: [
        { moTa: 'Ids, defaults, extra fields dropped|||Id, giá trị mặc định, trường thừa bị bỏ', chuanBi: 'const T = createTable({ name: "users", columns: { name: { notNull: true }, email: { notNull: true, unique: true }, role: { notNull: true, default: "user" } }, checks: [] }); T.insert({ name: "Lan", email: "lan@example.com", role: "admin" }); T.insert({ id: 99, name: "Minh", email: "minh@example.com", isAdmin: true });', goi: 'T.all()', mongDoi: [{ id: 1, name: 'Lan', email: 'lan@example.com', role: 'admin' }, { id: 2, name: 'Minh', email: 'minh@example.com', role: 'user' }] },
        { moTa: 'Failures do not use an id|||Lần hỏng không tiêu id', chuanBi: 'const T = createTable({ name: "users", columns: { name: { notNull: true }, email: { notNull: true, unique: true } }, checks: [] }); T.insert({ name: "Lan", email: "a@x.vn" });', goi: '[T.insert({ name: "B", email: "a@x.vn" }), T.insert({ email: "b@x.vn" }), T.insert({ name: "C", email: "c@x.vn" })]', mongDoi: [{ ok: false, error: 'UNIQUE constraint failed: users.email' }, { ok: false, error: 'NOT NULL constraint failed: users.name' }, { ok: true, row: { id: 2, name: 'C', email: 'c@x.vn' } }] },
        { moTa: 'CHECK and copies|||CHECK và bản sao', chuanBi: 'const T = createTable({ name: "posts", columns: { title: { notNull: true }, views: { notNull: true, default: 0 } }, checks: [{ text: "views >= 0", test: (r) => r.views >= 0 }] }); const r = T.insert({ title: "A" }).row; r.title = "HACKED";', goi: '[T.insert({ title: "B", views: -1 }).error, T.all()[0].title, T.all()[0].views]', mongDoi: ['CHECK constraint failed: views >= 0', 'A', 0] },
      ],
    },
  ],
});
