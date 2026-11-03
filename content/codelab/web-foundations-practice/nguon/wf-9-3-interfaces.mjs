/** Bộ luyện bài 9.3 — interface và type. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm chạy JavaScript ⇒ luyện bằng JS những gì kiểu object làm: Pick/Omit lúc chạy, Record đếm, PATCH theo Partial với
 *  id readonly, union phân biệt bằng kind, kiểm Record<Genre, number> thiếu/thừa khoá, và một bộ kiểm hình dạng theo cấu trúc
 *  (trường tuỳ chọn, readonly, kiểm thuộc tính thừa). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 9.3 — interface và type.</em> Kiểu object mô tả hình dạng; các utility type suy ra hình dạng mới. Mỗi bài dưới đây làm phần tương ứng lúc chạy — thứ bạn cần khi dữ liệu không đi qua tsc.</p>';

export default doiDau({
  slug: 'wf-9-3-interfaces',
  ten: '9.3 interface và type',
  baiHoc: 'Nền tảng Web — Bài 9.3 Interfaces and types',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'pick/omit lúc chạy (Pick/Omit), đếm theo khoá (Record), áp PATCH theo Partial mà giữ id readonly, render union phân biệt bằng kind, kiểm một Record<Genre, number> thiếu hay thừa khoá, và một bộ kiểm hình dạng theo cấu trúc có trường tuỳ chọn và kiểm thuộc tính thừa — 6 bài.',
  de: [
    {
      tieuDe: 'pick và omit',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['Pick', 'Omit'], tienQuyet: ['Object.entries', 'includes'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết ${c('pick(obj, keys)')} trả object MỚI chỉ có các khoá trong ${c('keys')} mà ${c('obj')} thật sự có (theo thứ tự của ${c('keys')}), và ${c('omit(obj, keys)')} trả object mới có mọi khoá trừ ${c('keys')} (giữ thứ tự của ${c('obj')}). Không sửa ${c('obj')}. Dùng ${c('omit(user, ["passwordHash"])')} trước khi gửi JSON — kiểu không bao giờ tự bỏ trường (bẫy ở Bài 9.3).</p>`,
      yeuCau: ['Trả object mới.', 'pick bỏ qua khoá không có.', 'Không sửa object gốc.'],
      dauVao: 'obj: object; keys: string[].', dauRa: 'object.',
      rangBuoc: ['Không dùng delete trên object gốc.'],
      viDu: [{ input: 'omit({ id: 1, email: "lan@x.vn", passwordHash: "$2b$…" }, ["passwordHash"])', output: '{ id: 1, email: "lan@x.vn" }', explanation: 'Tự chọn trường gửi đi.' }],
      goiY: ['Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]))', 'Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))'],
      khoiDau: { 'main.js': `// Bài 9.3 — pick và omit lúc chạy
function pick(obj, keys) {
  return obj;
}
function omit(obj, keys) {
  for (const k of keys) delete obj[k];
  return obj;
}
` },
      loiGiai: { 'main.js': `// Bài 9.3 — Pick<T, K> / Omit<T, K> chỉ là kiểu; đây là phần làm thật lúc chạy
function pick(obj, keys) {
  return Object.fromEntries(keys.filter((k) => Object.hasOwn(obj, k)).map((k) => [k, obj[k]]));
}

function omit(obj, keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
}
` },
      giaiThich: `<p>${c('const safe: Omit<User, "passwordHash"> = user')} vẫn biên dịch — TypeScript theo cấu trúc, trường thừa được phép — và ${c('JSON.stringify(safe)')} vẫn gửi ${c('passwordHash')}. Muốn trường thật sự biến mất thì phải tạo object mới như ${c('omit')}.</p>`,
      loiHayGap: ['delete trên object gốc.', 'pick tạo khoá undefined cho trường không có.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys',
      kiem: [
        { moTa: 'omit removes the secret|||omit bỏ trường bí mật', goi: 'omit({ id: 1, email: "lan@x.vn", passwordHash: "h" }, ["passwordHash"])', mongDoi: { id: 1, email: 'lan@x.vn' } },
        { moTa: 'pick keeps only existing keys, in order|||pick giữ khoá có thật, đúng thứ tự', goi: 'pick({ id: 7, name: "Ruler", price: 8000 }, ["name", "id", "colour"])', mongDoi: { name: 'Ruler', id: 7 } },
        { moTa: 'The original is not changed|||Object gốc không đổi', goi: '(() => { const u = { id: 1, passwordHash: "h" }; omit(u, ["passwordHash"]); pick(u, ["id"]); return u; })()', mongDoi: { id: 1, passwordHash: 'h' } },
      ],
    },
    {
      tieuDe: 'Đếm thành Record',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['Record<string, number>'], tienQuyet: ['reduce', 'object đếm'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>${c('type ViewsByCategory = Record<string, number>')}. Viết ${c('sumBy(items, keyField, valueField)')} trả object ${c('{ <giá trị keyField>: tổng valueField }')}, khoá theo thứ tự xuất hiện lần đầu. Món có ${c('keyField')} không phải chuỗi hoặc rỗng gộp vào khoá ${c('"(none)"')}. Rồi viết ${c('getCount(record, key)')} trả ${c('record[key]')} nếu khoá CÓ THẬT (${c('Object.hasOwn')}), ngược lại ${c('0')} — đúng chỗ bẫy ${c('views["offce"] + 1')} ra ${c('NaN')}.</p>`,
      yeuCau: ['Cộng dồn theo khoá.', '"(none)" cho khoá thiếu.', 'getCount không tin khoá gõ sai.'],
      dauVao: 'items: object[]; tên trường.', dauRa: 'object; number.',
      rangBuoc: ['getCount không được trả undefined.'],
      viDu: [{ input: 'sumBy([{ category: "office", views: 50000 }, { category: "home", views: 380000 }, { category: "office", views: 25000 }], "category", "views")', output: '{ office: 75000, home: 380000 }', explanation: 'Đúng ví dụ Record trong bài.' }],
      goiY: ['const k = typeof it[keyField] === "string" && it[keyField] !== "" ? it[keyField] : "(none)";', 'Object.hasOwn(record, key) ? record[key] : 0'],
      khoiDau: { 'main.js': `// Bài 9.3 — Record<string, number>
function sumBy(items, keyField, valueField) {
  return {};
}
function getCount(record, key) {
  return record[key];
}
` },
      loiGiai: { 'main.js': `// Bài 9.3 — Record là từ điển; tra khoá phải tính tới chuyện khoá KHÔNG có
function sumBy(items, keyField, valueField) {
  const out = {};
  for (const it of items) {
    const raw = it[keyField];
    const k = typeof raw === 'string' && raw !== '' ? raw : '(none)';
    out[k] = (out[k] ?? 0) + it[valueField];
  }
  return out;
}

function getCount(record, key) {
  return Object.hasOwn(record, key) ? record[key] : 0;   // không tin "toString" hay "offce"
}
` },
      giaiThich: `<p>${c('Record<string, number>')} hứa mọi khoá đều có số — TypeScript cho ${c('views["offce"]')} kiểu ${c('number')}. Bật ${c('noUncheckedIndexedAccess')} (Bài 9.5) thì kiểu thành ${c('number | undefined')} và tsc buộc bạn viết đúng như ${c('getCount')}. ${c('Object.hasOwn')} còn chặn khoá thừa kế như ${c('"toString"')}.</p>`,
      loiHayGap: ['record[key] ?? 0 — "toString" trả về một hàm.', 'Không gom khoá thiếu.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type',
      kiem: [
        { moTa: 'Sum by category|||Cộng theo danh mục', goi: 'sumBy([{ category: "office", views: 50000 }, { category: "home", views: 380000 }, { category: "office", views: 25000 }], "category", "views")', mongDoi: { office: 75000, home: 380000 } },
        { moTa: 'Missing keys go to "(none)"|||Khoá thiếu vào "(none)"', goi: 'sumBy([{ c: "a", n: 1 }, { n: 2 }, { c: "", n: 3 }, { c: 5, n: 4 }], "c", "n")', mongDoi: { a: 1, '(none)': 9 } },
        { moTa: 'A typo or inherited key gives 0, not NaN|||Khoá gõ sai hay thừa kế trả 0', goi: '(() => { const v = { office: 75000 }; return [getCount(v, "office"), getCount(v, "offce") + 1, getCount(v, "toString")]; })()', mongDoi: [75000, 1, 0] },
      ],
    },
    {
      tieuDe: 'PATCH theo Partial, id chỉ đọc',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['Partial', 'readonly', 'PATCH'], tienQuyet: ['Object.entries', 'spread'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>${c('UpdateProductInput = Partial<Omit<Product, "id">>')} với Product là ${c('{ readonly id: number; name: string; price: number; category: string }')}. Viết ${c('applyPatch(product, patch)')} trả ${c('{ ok: true, product: <object MỚI> }')} hoặc ${c('{ ok: false, errors }')}. Luật theo thứ tự khoá của ${c('patch')}: ${c('id')} ⇒ lỗi ${c('"id is read-only"')}; khoá lạ ⇒ ${c('"unknown field: <khoá>"')}; ${c('name')}/${c('category')} phải là chuỗi khác rỗng, ${c('price')} số nguyên ≥ 0, sai ⇒ ${c('"<khoá> has the wrong type"')}. Có lỗi thì không đổi gì. Patch rỗng ⇒ ok với bản sao y nguyên.</p>`,
      yeuCau: ['Chỉ đổi trường được gửi.', 'id không bao giờ đổi.', 'Có lỗi ⇒ không áp phần nào.'],
      dauVao: 'product: object; patch: object.', dauRa: '{ ok, product } | { ok, errors }.',
      rangBuoc: ['Không sửa product gốc.'],
      viDu: [{ input: 'applyPatch({ id: 2, name: "Desk lamp", price: 320000, category: "home" }, { price: 299000 })', output: '{ ok: true, product: { id: 2, name: "Desk lamp", price: 299000, category: "home" } }', explanation: 'PATCH giữ mọi trường không gửi (Bài 6.2).'}],
      goiY: ['const RULES = { name: isText, price: isPrice, category: isText };', 'return errors.length ? { ok: false, errors } : { ok: true, product: { ...product, ...patch } };'],
      khoiDau: { 'main.js': `// Bài 9.3 — PATCH theo Partial
function applyPatch(product, patch) {
  return { ok: true, product: Object.assign(product, patch) };
}
` },
      loiGiai: { 'main.js': `// Bài 9.3 — Partial cho phép GỬI ÍT trường; readonly id và kiểu từng trường vẫn phải giữ
const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isPrice = (v) => Number.isInteger(v) && v >= 0;
const RULES = { name: isText, price: isPrice, category: isText };

function applyPatch(product, patch) {
  const errors = [];
  for (const [key, value] of Object.entries(patch)) {
    if (key === 'id') errors.push('id is read-only');
    else if (!Object.hasOwn(RULES, key)) errors.push('unknown field: ' + key);
    else if (!RULES[key](value)) errors.push(key + ' has the wrong type');
  }
  if (errors.length) return { ok: false, errors };
  return { ok: true, product: { ...product, ...patch } };   // object mới; trường không gửi giữ nguyên
}
` },
      giaiThich: `<p>Trong mã của bạn, tsc chặn ${c('patch.id')} (readonly) và ${c('colour')} (thuộc tính thừa) lúc biên dịch. Body PATCH đến từ mạng thì không — phải kiểm lại, và "tất cả hoặc không gì" để không lưu nửa bản cập nhật.</p>`,
      loiHayGap: ['Object.assign sửa object gốc.', 'Áp các trường đúng rồi mới báo lỗi trường sai.', 'Cho đổi id.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype',
      kiem: [
        { moTa: 'Only sent fields change|||Chỉ trường được gửi thay đổi', goi: 'applyPatch({ id: 2, name: "Desk lamp", price: 320000, category: "home" }, { price: 299000 })', mongDoi: { ok: true, product: { id: 2, name: 'Desk lamp', price: 299000, category: 'home' } } },
        { moTa: 'id, unknown and wrong types — all reported|||id, khoá lạ, sai kiểu — báo hết', goi: 'applyPatch({ id: 2, name: "Lamp", price: 1, category: "home" }, { id: 9, colour: "blue", price: "299000", name: "" })', mongDoi: { ok: false, errors: ['id is read-only', 'unknown field: colour', 'price has the wrong type', 'name has the wrong type'] } },
        { moTa: 'The original is untouched|||Object gốc không đổi', goi: '(() => { const p = { id: 1, name: "Pen", price: 5000, category: "office" }; applyPatch(p, { name: "Gel pen" }); return p.name; })()', mongDoi: 'Pen' },
        { moTa: 'An empty patch is a copy|||Patch rỗng là bản sao', goi: 'applyPatch({ id: 1, name: "Pen", price: 5000, category: "office" }, {})', mongDoi: { ok: true, product: { id: 1, name: 'Pen', price: 5000, category: 'office' } } },
      ],
    },
    {
      tieuDe: 'Render union phân biệt bằng kind',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['discriminated union', 'never'], tienQuyet: ['switch'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>${c('type LoadState = { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; items: string[] } | { kind: "empty" }')}. Viết ${c('render(state)')}: loading ⇒ ${c('"Loading..."')}; error ⇒ ${c('"Error: <message>"')}; done ⇒ ${c('"<n> item"')} khi n = 1, ngược lại ${c('"<n> items"')}, rồi nếu n > 0 thêm ${c('": "')} và tối đa 3 tên nối bằng ${c('", "')}, còn hơn 3 thì thêm ${c('" and <phần còn lại> more"')}; empty ⇒ ${c('"Nothing here yet"')}. kind khác ⇒ ném ${c('Error("unhandled kind: <kind>")')}.</p>`,
      yeuCau: ['Một switch theo kind.', 'Số ít/số nhiều.', 'Tối đa 3 tên.', 'default ném lỗi.'],
      dauVao: 'state: LoadState.', dauRa: 'string.',
      rangBuoc: ['Không đọc state.message ngoài nhánh error.'],
      viDu: [{ input: 'render({ kind: "done", items: ["Pen", "Mug", "Lamp", "Ruler", "Desk"] })', output: '"5 items: Pen, Mug, Lamp and 2 more"', explanation: 'Ba tên đầu rồi phần còn lại.' }],
      goiY: ['case "done": { const n = state.items.length; … }', 'state.items.slice(0, 3).join(", ")'],
      khoiDau: { 'main.js': `// Bài 9.3 — render một LoadState
function render(state) {
  if (state.message) return 'Error: ' + state.message;
  return 'Loading...';
}
` },
      loiGiai: { 'main.js': `// Bài 9.3 — kind cho biết hình dạng; trong mỗi case chỉ đọc trường của hình dạng đó
function render(state) {
  switch (state.kind) {
    case 'loading':
      return 'Loading...';
    case 'error':
      return 'Error: ' + state.message;
    case 'done': {
      const n = state.items.length;
      let text = n + (n === 1 ? ' item' : ' items');
      if (n > 0) text += ': ' + state.items.slice(0, 3).join(', ') + (n > 3 ? ' and ' + (n - 3) + ' more' : '');
      return text;
    }
    case 'empty':
      return 'Nothing here yet';
    default:
      throw new Error('unhandled kind: ' + state.kind);   // trong TS: const x: never = state;
  }
}
` },
      giaiThich: `<p>Mã khởi đầu đoán hình dạng bằng "có message không" — đúng kiểu bug mà union phân biệt ngăn được. Trong TypeScript, ${c('state.message')} ở nhánh ${c('done')} là lỗi biên dịch, và quên nhánh ${c('empty')} thì phép gán ${c('never')} báo lỗi (kinds.ts dòng 27).</p>`,
      loiHayGap: ['Đoán hình dạng bằng trường tuỳ chọn.', '"1 items".', 'In cả 5 tên.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions',
      kiem: [
        { moTa: 'loading, error, empty|||loading, error, empty', goi: '[render({ kind: "loading" }), render({ kind: "error", message: "HTTP 404" }), render({ kind: "empty" })]', mongDoi: ['Loading...', 'Error: HTTP 404', 'Nothing here yet'] },
        { moTa: 'done with 0, 1, 2 items|||done với 0, 1, 2 món', goi: '[render({ kind: "done", items: [] }), render({ kind: "done", items: ["Pen"] }), render({ kind: "done", items: ["Pen", "Mug"] })]', mongDoi: ['0 items', '1 item: Pen', '2 items: Pen, Mug'] },
        { moTa: 'More than three names|||Hơn ba tên', goi: 'render({ kind: "done", items: ["Pen", "Mug", "Lamp", "Ruler", "Desk"] })', mongDoi: '5 items: Pen, Mug, Lamp and 2 more' },
        { moTa: 'An unknown kind throws|||kind lạ ném lỗi', goi: 'render({ kind: "stale" })', mongDoi: { loi: 'Error', thongDiep: '^unhandled kind: stale$' } },
      ],
    },
    {
      tieuDe: 'Record<Genre, number> có đủ khoá?',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['Record với khoá literal'], tienQuyet: ['Object.keys', 'filter'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>${c('type Genre = "novel" | "science" | "history"')} và ${c('BooksByGenre = Record<Genre, number>')} đòi ĐỦ ba khoá, không thừa. Viết ${c('checkRecord(record, keys)')} trả ${c('{ missing, extra, badValues }')}: ${c('missing')} = khoá trong ${c('keys')} không có trong record (thứ tự của ${c('keys')}); ${c('extra')} = khoá của record không thuộc ${c('keys')} (thứ tự của record); ${c('badValues')} = khoá hợp lệ có giá trị không phải số nguyên ≥ 0. Rồi viết ${c('isComplete(record, keys)')} ⇒ ${c('true')} khi cả ba mảng đều rỗng.</p>`,
      yeuCau: ['Ba danh sách đúng thứ tự.', 'isComplete dùng lại checkRecord.'],
      dauVao: 'record: object; keys: string[].', dauRa: '{ missing, extra, badValues }; boolean.',
      rangBuoc: ['Không sửa record.'],
      viDu: [{ input: 'checkRecord({ novel: 12, science: 4 }, ["novel", "science", "history"])', output: '{ missing: ["history"], extra: [], badValues: [] }', explanation: 'Lỗi tsc mà bài luyện của Bài 9.3 cho bạn tự thấy.' }],
      goiY: ['keys.filter((k) => !Object.hasOwn(record, k))', 'Object.keys(record).filter((k) => !keys.includes(k))'],
      khoiDau: { 'main.js': `// Bài 9.3 — kiểm một Record có khoá literal
function checkRecord(record, keys) {
  return { missing: [], extra: [], badValues: [] };
}
function isComplete(record, keys) {
  return true;
}
` },
      loiGiai: { 'main.js': `// Bài 9.3 — Record<Genre, number>: đủ khoá, không thừa, đúng kiểu giá trị
function checkRecord(record, keys) {
  return {
    missing: keys.filter((k) => !Object.hasOwn(record, k)),
    extra: Object.keys(record).filter((k) => !keys.includes(k)),
    badValues: keys.filter((k) => Object.hasOwn(record, k) && !(Number.isInteger(record[k]) && record[k] >= 0)),
  };
}

function isComplete(record, keys) {
  const r = checkRecord(record, keys);
  return r.missing.length === 0 && r.extra.length === 0 && r.badValues.length === 0;
}
` },
      giaiThich: `<p>Khác ${c('Record<string, number>')} (khoá nào cũng được), ${c('Record<Genre, number>')} liệt kê chính xác các khoá. Thêm ${c('"poetry"')} vào ${c('Genre')} là tsc chỉ ra mọi object đang thiếu nó — cùng ý tưởng với kiểm đủ nhánh bằng ${c('never')}.</p>`,
      loiHayGap: ['Dùng record[k] === undefined thay vì hasOwn.', 'Coi 2.5 hay -1 là số đếm hợp lệ.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type',
      kiem: [
        { moTa: 'A missing genre|||Thiếu một thể loại', goi: 'checkRecord({ novel: 12, science: 4 }, ["novel", "science", "history"])', mongDoi: { missing: ['history'], extra: [], badValues: [] } },
        { moTa: 'Extra keys and bad values|||Khoá thừa và giá trị sai', goi: 'checkRecord({ poetry: 1, novel: -1, science: 2.5, history: "3" }, ["novel", "science", "history"])', mongDoi: { missing: [], extra: ['poetry'], badValues: ['novel', 'science', 'history'] } },
        { moTa: 'isComplete|||isComplete', goi: '[isComplete({ novel: 12, science: 4, history: 0 }, ["novel", "science", "history"]), isComplete({ novel: 12, science: 4 }, ["novel", "science", "history"])]', mongDoi: [true, false] },
      ],
    },
    {
      tieuDe: 'Bộ kiểm hình dạng theo cấu trúc',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['structural typing', 'trường tuỳ chọn', 'kiểm thuộc tính thừa'], tienQuyet: ['đệ quy', 'Object.entries'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết ${c('checkShape(shape, value, options)')}. ${c('shape')} là object mô tả: khoá có thể kết thúc bằng ${c('"?"')} (tuỳ chọn); giá trị là ${c('"string"')}, ${c('"number"')}, ${c('"boolean"')}, ${c('"string[]"')}, ${c('"number[]"')}, hoặc một shape lồng. Trả mảng lỗi dạng ${c('"<đường dẫn>: <vấn đề>"')} với đường dẫn nối bằng dấu chấm: thiếu trường bắt buộc ⇒ ${c('"missing"')}; sai kiểu ⇒ ${c('"expected <kiểu>"')} (shape lồng ⇒ ${c('"expected object"')}); với ${c('options.exact === true')} (như object literal viết trực tiếp), khoá không có trong shape ⇒ ${c('"unexpected property"')}; không exact thì khoá thừa được phép (theo cấu trúc). Trường tuỳ chọn có giá trị ${c('undefined')} coi như không có. Thứ tự: theo khoá của shape, rồi tới khoá thừa theo thứ tự của value. Mảng: mọi phần tử phải đúng kiểu, lỗi ở phần tử ghi ${c('"<đường dẫn>.<chỉ số>: expected <kiểu phần tử>"')}.</p>`,
      yeuCau: ['Trường tuỳ chọn ?.', 'Đệ quy với đường dẫn.', 'exact ⇒ báo khoá thừa, cả ở mức lồng.', 'Kiểm từng phần tử mảng.'],
      dauVao: 'shape: object; value: bất kỳ; options?: { exact?: boolean }.', dauRa: 'string[].',
      rangBuoc: ['null không phải object.', 'Giá trị gốc không phải object ⇒ [": expected object"] (đường dẫn rỗng).'],
      viDu: [{ input: 'checkShape({ id: "number", name: "string", "category?": "string" }, { id: 1, name: "Pen", colour: "blue" }, { exact: true })', output: '["colour: unexpected property"]', explanation: 'Lỗi TS2353 của shapes.ts dòng 14 — và không exact thì nó lọt qua (bẫy của bài).' }],
      goiY: ['function walk(shape, value, path, out) { … } — gọi lại walk cho shape lồng với path + "." + key', 'const join = (p, k) => (p ? p + "." + k : String(k));'],
      khoiDau: { 'main.js': `// Bài 9.3 — kiểm hình dạng theo cấu trúc
function checkShape(shape, value, options = {}) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 9.3 — một bộ kiểm hình dạng nhỏ: thứ tsc làm cho object, làm lại lúc chạy
const join = (path, key) => (path ? path + '.' + key : String(key));
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

function checkType(type, value, path, out, exact) {
  if (typeof type === 'object') {                                  // shape lồng
    if (!isObject(value)) { out.push(path + ': expected object'); return; }
    walk(type, value, path, out, exact);
    return;
  }
  if (type.endsWith('[]')) {
    const item = type.slice(0, -2);
    if (!Array.isArray(value)) { out.push(path + ': expected ' + type); return; }
    value.forEach((v, i) => { if (typeof v !== item) out.push(join(path, i) + ': expected ' + item); });
    return;
  }
  if (typeof value !== type) out.push(path + ': expected ' + type);
}

function walk(shape, value, path, out, exact) {
  const known = new Set();
  for (const [rawKey, type] of Object.entries(shape)) {
    const optional = rawKey.endsWith('?');
    const key = optional ? rawKey.slice(0, -1) : rawKey;
    known.add(key);
    const v = value[key];
    if (v === undefined) {
      if (!optional) out.push(join(path, key) + ': missing');
      continue;
    }
    checkType(type, v, join(path, key), out, exact);
  }
  if (exact) {
    for (const key of Object.keys(value)) if (!known.has(key)) out.push(join(path, key) + ': unexpected property');
  }
}

function checkShape(shape, value, options = {}) {
  if (!isObject(value)) return [': expected object'];
  const out = [];
  walk(shape, value, '', out, options.exact === true);
  return out;
}
` },
      giaiThich: `<p>Hai chế độ là hai cách TypeScript nhìn một object: viết trực tiếp ở chỗ cần ${c('Product')} thì bị kiểm thuộc tính thừa (exact); đi qua một biến thì chỉ cần ĐỦ trường đúng kiểu (theo cấu trúc). Đó là lý do ${c('colour')} bị bắt ở dòng 14 nhưng lọt qua ${c('const mug: Product = raw')}. Bài 9.5 thay bộ kiểm tự viết này bằng zod.</p>`,
      loiHayGap: ['Coi null là object.', 'Quên đường dẫn ở mức lồng.', 'Báo "missing" cho trường tuỳ chọn.', 'Báo khoá thừa khi không exact.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/type-compatibility.html',
      kiem: [
        { moTa: 'Structural: extra fields allowed|||Theo cấu trúc: được thừa trường', goi: 'checkShape({ id: "number", name: "string", "category?": "string" }, { id: 1, name: "Pen", colour: "blue" })', mongDoi: [] },
        { moTa: 'Exact: the colour typo is caught|||Exact: bắt được colour', goi: 'checkShape({ id: "number", name: "string", "category?": "string" }, { id: 1, name: "Pen", colour: "blue" }, { exact: true })', mongDoi: ['colour: unexpected property'] },
        { moTa: 'Missing, wrong type, optional undefined|||Thiếu, sai kiểu, tuỳ chọn undefined', goi: 'checkShape({ id: "number", name: "string", price: "number", "category?": "string" }, { id: 2, name: "Desk lamp", category: undefined, price: "320000" })', mongDoi: ['price: expected number'] },
        { moTa: 'Nested shapes and arrays with paths|||Shape lồng và mảng có đường dẫn', goi: 'checkShape({ items: "string[]", page: { number: "number", "size?": "number" }, author: { name: "string" } }, { items: ["a", 2], page: { number: "1", extra: true }, author: null }, { exact: true })', mongDoi: ['items.1: expected string', 'page.number: expected number', 'page.extra: unexpected property', 'author: expected object'] },
        { moTa: 'Not an object at all|||Hoàn toàn không phải object', goi: '[checkShape({ id: "number" }, null), checkShape({ id: "number" }, [1])]', mongDoi: [[': expected object'], [': expected object']] },
      ],
    },
  ],
});
