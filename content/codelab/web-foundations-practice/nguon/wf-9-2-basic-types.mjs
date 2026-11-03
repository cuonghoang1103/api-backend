/** Bộ luyện bài 9.2 — Kiểu cơ bản. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm chạy JavaScript ⇒ luyện phần lõi bằng JS: thu hẹp union string | number, type guard cho union literal,
 *  kiểu literal const vs let, xử lý unknown an toàn, nhánh đủ cho union trạng thái, đổi dữ liệu form (chuỗi) sang đúng kiểu. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 9.2 — Kiểu cơ bản.</em> Union, literal và unknown là ba công cụ bạn dùng hằng ngày. Mỗi bài dưới đây là phần "lúc chạy" của một ý trong bài: thu hẹp, kiểm giá trị cho phép, và kiểm trước khi tin.</p>';

export default doiDau({
  slug: 'wf-9-2-basic-types',
  ten: '9.2 Kiểu cơ bản',
  baiHoc: 'Nền tảng Web — Bài 9.2 Basic types',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Thu hẹp string | number để định dạng giá, type guard cho union literal SortDir, mô phỏng kiểu literal const vs let, đọc unknown an toàn, nhãn trạng thái với nhánh đủ (never), và đổi giá trị form (luôn là chuỗi) sang number/boolean/date kèm lỗi rõ ràng — 6 bài.',
  de: [
    {
      tieuDe: 'Thu hẹp string | number',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['union', 'thu hẹp bằng typeof'], tienQuyet: ['typeof', 'chuỗi'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Kiểu tham số là ${c('price: string | number')}. Viết ${c('formatPrice(price)')}: nếu là số ⇒ làm tròn tới số nguyên và chèn dấu chấm mỗi 3 chữ số, thêm ${c('" VND"')} (${c('25000 → "25.000 VND"')}); nếu là chuỗi ⇒ bỏ khoảng trắng hai đầu, phải toàn chữ số (có thể có dấu chấm ngăn nghìn, vd ${c('"1.250.000"')}) rồi định dạng như số; chuỗi khác ⇒ ném ${c('TypeError("not a price: <chuỗi gốc>")')}. Giá âm (số) ⇒ ${c('TypeError("negative price")')}.</p>`,
      yeuCau: ['Nhánh typeof === "number".', 'Nhánh chuỗi kiểm định dạng.', 'Ném TypeError đúng chữ.'],
      dauVao: 'price: string | number.', dauRa: 'string.',
      rangBuoc: ['Không dùng toLocaleString (khác nhau giữa môi trường).'],
      viDu: [{ input: 'formatPrice(" 1.250.000 ")', output: '"1.250.000 VND"', explanation: 'Chuỗi hợp lệ được chuẩn hoá.' }],
      goiY: ['String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".")', '/^\\d{1,3}(\\.\\d{3})*$|^\\d+$/'],
      khoiDau: { 'main.js': `// Bài 9.2 — định dạng giá: string | number
function formatPrice(price) {
  return price.toFixed(0) + ' VND';
}
` },
      loiGiai: { 'main.js': `// Bài 9.2 — thu hẹp bằng typeof: trong mỗi nhánh, price chỉ còn MỘT kiểu
function group(n) {
  return String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.');
}

function formatPrice(price) {
  if (typeof price === 'number') {
    if (price < 0) throw new TypeError('negative price');
    return group(Math.round(price)) + ' VND';
  }
  const s = String(price).trim();
  if (!/^\\d+$|^\\d{1,3}(\\.\\d{3})+$/.test(s)) throw new TypeError('not a price: ' + price);
  return group(Number(s.replaceAll('.', ''))) + ' VND';
}
` },
      giaiThich: `<p>Gọi ${c('price.toFixed')} trên ${c('string | number')} là lỗi tsc ở Bài 9.2 (basics.ts dòng 13) — vì chuỗi không có ${c('toFixed')}. Sau ${c('typeof price === "number"')}, TypeScript biết chắc là số; ở nhánh còn lại, nó biết là chuỗi.</p>`,
      loiHayGap: ['Gọi toFixed trước khi thu hẹp.', 'Number("1.250.000") là NaN — phải bỏ dấu chấm trước.', 'Nhận cả "12a".'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
      kiem: [
        { moTa: 'Numbers are grouped and rounded|||Số được nhóm và làm tròn', goi: '[formatPrice(25000), formatPrice(27500.4), formatPrice(999), formatPrice(1250000)]', mongDoi: ['25.000 VND', '27.500 VND', '999 VND', '1.250.000 VND'] },
        { moTa: 'Valid strings are normalised|||Chuỗi hợp lệ được chuẩn hoá', goi: '[formatPrice("5000"), formatPrice(" 1.250.000 ")]', mongDoi: ['5.000 VND', '1.250.000 VND'] },
        { moTa: 'Bad strings throw|||Chuỗi sai ném lỗi', goi: 'formatPrice("12a")', mongDoi: { loi: 'TypeError', thongDiep: '^not a price: 12a$' } },
        { moTa: 'Negative numbers throw|||Số âm ném lỗi', goi: 'formatPrice(-1)', mongDoi: { loi: 'TypeError', thongDiep: '^negative price$' } },
      ],
    },
    {
      tieuDe: 'Type guard cho union literal',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['kiểu literal', 'type guard'], tienQuyet: ['includes'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>${c('type SortDir = "asc" | "desc"')}. Giá trị đến từ URL (${c('?dir=…')}) là chuỗi bất kỳ. Viết ${c('isSortDir(v)')} trả ${c('true')} chỉ khi ${c('v')} đúng là ${c('"asc"')} hoặc ${c('"desc"')} (phân biệt hoa thường, không cắt khoảng trắng). Rồi viết ${c('sortParam(query)')} nhận object query: không có ${c('dir')} ⇒ ${c('"asc"')}; hợp lệ ⇒ giá trị đó; sai ⇒ ném ${c('RangeError("dir must be asc or desc")')}.</p>`,
      yeuCau: ['isSortDir chỉ nhận đúng hai chuỗi.', 'Mặc định "asc".', 'Sai ⇒ RangeError.'],
      dauVao: 'v: unknown; query: object.', dauRa: 'boolean; "asc" | "desc".',
      rangBuoc: ['Dùng một mảng hằng ["asc", "desc"] làm nguồn duy nhất.'],
      viDu: [{ input: 'sortParam({ dir: "descending" })', output: 'RangeError', explanation: '"descending" cũng là lỗi tsc ở basics.ts dòng 22 — nhưng chuỗi từ URL thì tsc không thấy.' }],
      goiY: ['const SORT_DIRS = ["asc", "desc"];', 'return SORT_DIRS.includes(v);'],
      khoiDau: { 'main.js': `// Bài 9.2 — type guard cho SortDir
function isSortDir(v) {
  return typeof v === 'string';
}
function sortParam(query) {
  return query.dir || 'asc';
}
` },
      loiGiai: { 'main.js': `// Bài 9.2 — một mảng hằng là nguồn duy nhất của các giá trị được phép
const SORT_DIRS = ['asc', 'desc'];              // trong TS: as const ⇒ type SortDir = typeof SORT_DIRS[number]

function isSortDir(v) {                          // trong TS: function isSortDir(v: unknown): v is SortDir
  return SORT_DIRS.includes(v);
}

function sortParam(query) {
  if (query.dir === undefined) return 'asc';
  if (!isSortDir(query.dir)) throw new RangeError('dir must be asc or desc');
  return query.dir;
}
` },
      giaiThich: `<p>Union literal chặn ${c('"descending"')} trong mã bạn viết; type guard chặn nó trong dữ liệu đến lúc chạy. Viết ${c('SORT_DIRS as const')} trong TypeScript thì kiểu ${c('SortDir')} được suy ra từ chính mảng đó — thêm giá trị mới chỉ sửa một chỗ.</p>`,
      loiHayGap: ['Chấp nhận "ASC" hay " asc".', 'Dùng || — chuỗi rỗng thành "asc" lặng lẽ.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates',
      kiem: [
        { moTa: 'Only the two literals pass|||Chỉ hai giá trị literal được nhận', goi: '[isSortDir("asc"), isSortDir("desc"), isSortDir("ASC"), isSortDir(" asc"), isSortDir(null), isSortDir(1)]', mongDoi: [true, true, false, false, false, false] },
        { moTa: 'Default and valid values|||Mặc định và giá trị hợp lệ', goi: '[sortParam({}), sortParam({ dir: "desc" })]', mongDoi: ['asc', 'desc'] },
        { moTa: '"descending" is refused|||"descending" bị từ chối', goi: 'sortParam({ dir: "descending" })', mongDoi: { loi: 'RangeError', thongDiep: '^dir must be asc or desc$' } },
        { moTa: 'An empty string is not silently "asc"|||Chuỗi rỗng không lặng lẽ thành "asc"', goi: 'sortParam({ dir: "" })', mongDoi: { loi: 'RangeError' } },
      ],
    },
    {
      tieuDe: 'const hay let: kiểu literal được suy ra',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['nới rộng kiểu', 'as const'], tienQuyet: ['JSON.stringify', 'typeof'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Ở Bài 9.2, ${c('const title = "Hello World"')} có kiểu ${c('"Hello World"')} còn ${c('let price = 27500')} có kiểu ${c('number')}. Viết ${c('declaredType(kind, value)')} với ${c('kind')} là ${c('"const"')}, ${c('"let"')} hoặc ${c('"as const"')}, ${c('value')} là chuỗi, số, boolean hay null: ${c('"let"')} ⇒ nới rộng (${c('"string"')}, ${c('"number"')}, ${c('"boolean"')}; riêng ${c('null')} ⇒ ${c('"null"')}); ${c('"const"')} và ${c('"as const"')} ⇒ giữ literal: chuỗi trong nháy kép (${c('JSON.stringify')}), số và boolean viết như giá trị. Riêng object với ${c('"const"')}: các trường vẫn bị nới rộng ⇒ ${c('"{ dir: string; size: number }"')}; với ${c('"as const"')} ⇒ ${c('"{ readonly dir: \\"asc\\"; readonly size: 10 }"')}.</p>`,
      yeuCau: ['let nới rộng.', 'const giữ literal cho giá trị nguyên thuỷ.', 'Object: const nới rộng trường, as const thêm readonly + literal.'],
      dauVao: 'kind: "const" | "let" | "as const"; value.', dauRa: 'string.',
      rangBuoc: ['Object chỉ có một cấp (không lồng).'],
      viDu: [{ input: 'declaredType("as const", { dir: "asc", size: 10 })', output: '"{ readonly dir: \\"asc\\"; readonly size: 10 }"', explanation: 'Đúng dòng fixedSettings trong output infer.ts.' }],
      goiY: ['const wide = (v) => v === null ? "null" : typeof v;', 'const lit = (v) => typeof v === "string" ? JSON.stringify(v) : String(v);'],
      khoiDau: { 'main.js': `// Bài 9.2 — kiểu được suy ra cho const / let / as const
function declaredType(kind, value) {
  return typeof value;
}
` },
      loiGiai: { 'main.js': `// Bài 9.2 — let nới rộng (giá trị còn đổi được), const giữ literal; object const vẫn nới rộng TRƯỜNG
const wide = (v) => (v === null ? 'null' : typeof v);
const lit = (v) => (typeof v === 'string' ? JSON.stringify(v) : String(v));

function declaredType(kind, value) {
  if (value !== null && typeof value === 'object') {
    const fields = Object.entries(value).map(([k, v]) =>
      kind === 'as const' ? 'readonly ' + k + ': ' + lit(v) : k + ': ' + wide(v));
    return '{ ' + fields.join('; ') + ' }';
  }
  return kind === 'let' ? wide(value) : lit(value);
}
` },
      giaiThich: `<p>${c('let')} có thể gán lại nên TypeScript chọn kiểu rộng. ${c('const')} giữ literal — nhưng trường của một object const vẫn gán lại được (${c('settings.dir = "x"')}), nên chúng bị nới rộng. ${c('as const')} khoá cả hai: readonly và literal. Đó là lý do ${c('settings')} không gán được vào ${c('{ dir: SortDir }')} còn ${c('fixedSettings')} thì được.</p>`,
      loiHayGap: ['Quên readonly ở as const.', 'Chuỗi literal không có nháy.', 'null thành "object".'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types',
      kiem: [
        { moTa: 'let widens|||let nới rộng', goi: '[declaredType("let", 5), declaredType("let", "asc"), declaredType("let", true), declaredType("let", null)]', mongDoi: ['number', 'string', 'boolean', 'null'] },
        { moTa: 'const keeps the literal|||const giữ literal', goi: '[declaredType("const", "Hello World"), declaredType("const", 10), declaredType("const", false)]', mongDoi: ['"Hello World"', '10', 'false'] },
        { moTa: 'const object widens its fields|||Object const nới rộng trường', goi: 'declaredType("const", { dir: "asc", size: 10 })', mongDoi: '{ dir: string; size: number }' },
        { moTa: 'as const: readonly literals|||as const: readonly + literal', goi: 'declaredType("as const", { dir: "asc", size: 10 })', mongDoi: '{ readonly dir: "asc"; readonly size: 10 }' },
      ],
    },
    {
      tieuDe: 'Đọc unknown an toàn',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['unknown', 'thu hẹp bằng in'], tienQuyet: ['JSON.parse', 'try/catch'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết ${c('productName(text)')}: ${c('text')} là phần thân response. Parse JSON (lỗi parse ⇒ ${c('{ ok: false, reason: "invalid JSON" }')}). Kết quả là ${c('unknown')}: chỉ khi nó là object (không null, không mảng), có khoá ${c('name')} kiểu chuỗi KHÔNG rỗng sau khi trim ⇒ ${c('{ ok: true, name: <name viết hoa> }')}; không phải object ⇒ ${c('reason: "not an object"')}; thiếu hoặc sai kiểu ⇒ ${c('reason: "name must be a non-empty string"')}.</p>`,
      yeuCau: ['try/catch quanh JSON.parse.', 'Thu hẹp từng bước.', 'Đúng ba lý do.'],
      dauVao: 'text: string.', dauRa: '{ ok, name } hoặc { ok, reason }.',
      rangBuoc: ['Không truy cập .name trước khi kiểm là object.'],
      viDu: [{ input: 'productName(\'{"id": 7, "title": "Ruler"}\')', output: '{ ok: false, reason: "name must be a non-empty string" }', explanation: 'Đúng JSON làm sập runtime.ts ở Bài 9.1 — giờ được báo lỗi tử tế.' }],
      goiY: ['let data; try { data = JSON.parse(text); } catch { … }', 'typeof data === "object" && data !== null && !Array.isArray(data) && "name" in data'],
      khoiDau: { 'main.js': `// Bài 9.2 — đọc unknown an toàn
function productName(text) {
  const data = JSON.parse(text);
  return { ok: true, name: data.name.toUpperCase() };
}
` },
      loiGiai: { 'main.js': `// Bài 9.2 — unknown: kiểm từng bước rồi mới dùng
function productName(text) {
  let data;                                                  // trong TS: let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'invalid JSON' };
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return { ok: false, reason: 'not an object' };
  if (!('name' in data) || typeof data.name !== 'string' || data.name.trim() === '') {
    return { ok: false, reason: 'name must be a non-empty string' };
  }
  return { ok: true, name: data.name.toUpperCase() };
}
` },
      giaiThich: `<p>Với ${c('any')}, mã khởi đầu biên dịch được rồi sập (any-run.ts). Với ${c('unknown')}, tsc buộc bạn đi đúng các bước trong lời giải: là object? có khoá? đúng kiểu? Mỗi bước thu hẹp kiểu thêm một chút, đến cuối thì ${c('data.name')} chắc chắn là chuỗi.</p>`,
      loiHayGap: ['Quên null (typeof null === "object").', 'Không bắt lỗi JSON.parse.', 'Chấp nhận name là "   ".'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing',
      kiem: [
        { moTa: 'A valid product|||Sản phẩm hợp lệ', goi: 'productName(\'{"id": 7, "name": "Ruler", "price": 8000}\')', mongDoi: { ok: true, name: 'RULER' } },
        { moTa: 'The wrong shape from Lesson 9.1|||Hình dạng sai của Bài 9.1', goi: '[productName(\'{"id": 7, "title": "Ruler"}\'), productName(\'{"name": 42}\'), productName(\'{"name": "  "}\')]', mongDoi: [{ ok: false, reason: 'name must be a non-empty string' }, { ok: false, reason: 'name must be a non-empty string' }, { ok: false, reason: 'name must be a non-empty string' }] },
        { moTa: 'Not an object, or not JSON|||Không phải object, hoặc không phải JSON', goi: '[productName("null"), productName("[1]"), productName("\\"Ruler\\""), productName("<html>")]', mongDoi: [{ ok: false, reason: 'not an object' }, { ok: false, reason: 'not an object' }, { ok: false, reason: 'not an object' }, { ok: false, reason: 'invalid JSON' }] },
      ],
    },
    {
      tieuDe: 'Nhãn trạng thái — đủ mọi nhánh',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['union literal', 'never', 'kiểm đủ nhánh'], tienQuyet: ['switch'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>${c('type OrderStatus = "pending" | "paid" | "shipped" | "cancelled"')}. Viết ${c('statusBadge(status)')} trả ${c('{ label, color }')}: pending ⇒ ${c('{ label: "Waiting for payment", color: "amber" }')}, paid ⇒ ${c('{ label: "Paid", color: "blue" }')}, shipped ⇒ ${c('{ label: "On the way", color: "green" }')}, cancelled ⇒ ${c('{ label: "Cancelled", color: "gray" }')}. Mọi giá trị khác ⇒ ném ${c('Error("unhandled status: <giá trị>")')} từ nhánh ${c('default')} (trong TS đây là chỗ gán vào biến ${c('never')}).</p>`,
      yeuCau: ['Một switch.', 'default ném lỗi có giá trị.', 'Không có giá trị mặc định "lặng lẽ".'],
      dauVao: 'status: string.', dauRa: '{ label, color }.',
      rangBuoc: ['Không trả về nhãn chung kiểu "Unknown".'],
      viDu: [{ input: 'statusBadge("refunded")', output: 'Error: unhandled status: refunded', explanation: 'Ai đó thêm trạng thái mới mà quên giao diện ⇒ lỗi to, không phải nhãn sai.' }],
      goiY: ['Một switch với bốn case, mỗi case return một object.', 'default: { const unhandled = status; throw new Error("unhandled status: " + unhandled); }'],
      khoiDau: { 'main.js': `// Bài 9.2 — nhãn trạng thái
function statusBadge(status) {
  if (status === 'paid') return { label: 'Paid', color: 'blue' };
  return { label: 'Unknown', color: 'gray' };
}
` },
      loiGiai: { 'main.js': `// Bài 9.2 — mỗi giá trị của union một nhánh; default là lưới an toàn
function statusBadge(status) {
  switch (status) {
    case 'pending': return { label: 'Waiting for payment', color: 'amber' };
    case 'paid': return { label: 'Paid', color: 'blue' };
    case 'shipped': return { label: 'On the way', color: 'green' };
    case 'cancelled': return { label: 'Cancelled', color: 'gray' };
    default: {
      const unhandled = status;                    // trong TS: const unhandled: never = status; ⇒ lỗi biên dịch nếu thiếu nhánh
      throw new Error('unhandled status: ' + unhandled);
    }
  }
}
` },
      giaiThich: `<p>Trong TypeScript, khi mọi nhánh đã xử lý, ${c('status')} ở ${c('default')} có kiểu ${c('never')}; thêm ${c('"refunded"')} vào union là tsc báo lỗi ngay ở đó (Bài 9.3 cho thấy output thật). Lúc chạy, ném lỗi to hơn trả về một nhãn sai lặng lẽ.</p>`,
      loiHayGap: ['Trả "Unknown" — lỗi bị giấu.', 'Viết if/else không có nhánh cuối.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking',
      kiem: [
        { moTa: 'All four statuses|||Đủ bốn trạng thái', goi: '["pending", "paid", "shipped", "cancelled"].map(statusBadge)', mongDoi: [{ label: 'Waiting for payment', color: 'amber' }, { label: 'Paid', color: 'blue' }, { label: 'On the way', color: 'green' }, { label: 'Cancelled', color: 'gray' }] },
        { moTa: 'A new status is loud, not silent|||Trạng thái mới báo lỗi to', goi: 'statusBadge("refunded")', mongDoi: { loi: 'Error', thongDiep: '^unhandled status: refunded$' } },
        { moTa: 'Case matters|||Phân biệt hoa thường', goi: 'statusBadge("Paid")', mongDoi: { loi: 'Error', thongDiep: 'unhandled status: Paid' } },
      ],
    },
    {
      tieuDe: 'Giá trị form sang đúng kiểu',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['dữ liệu form là chuỗi', 'đổi kiểu có kiểm'], tienQuyet: ['regex', 'Date'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Mọi ${c('input.value')} là chuỗi. Viết ${c('parseForm(raw, schema)')}: ${c('raw')} là object chuỗi (từ ${c('FormData')}), ${c('schema')} là object ${c('{ tên: kiểu }')} với kiểu là ${c('"string"')}, ${c('"int"')}, ${c('"number"')}, ${c('"boolean"')}, ${c('"date"')}; thêm ${c('"?"')} ở cuối (vd ${c('"int?"')}) nghĩa là tuỳ chọn. Luật: chuỗi được trim; rỗng/thiếu ⇒ tuỳ chọn thì ${c('null')}, bắt buộc thì lỗi ${c('"<tên>: required"')}; ${c('int')} chỉ chữ số có thể có dấu trừ; ${c('number')} theo ${c('/^-?\\d+(\\.\\d+)?$/')}; ${c('boolean')} chỉ ${c('"true"/"false"/"on"/"off"')}; ${c('date')} dạng ${c('YYYY-MM-DD')} và là ngày có thật (trả lại chính chuỗi đó). Sai ⇒ lỗi ${c('"<tên>: expected <kiểu>"')}. Trả ${c('{ ok: true, data }')} hoặc ${c('{ ok: false, errors }')} (mọi lỗi, theo thứ tự khoá trong schema). Trường không có trong schema bị bỏ.</p>`,
      yeuCau: ['Trim trước khi kiểm.', 'Tuỳ chọn rỗng ⇒ null.', 'Ngày phải có thật (2026-02-30 sai).', 'Gom mọi lỗi.'],
      dauVao: 'raw: { [k]: string }; schema: { [k]: string }.', dauRa: '{ ok, data } | { ok, errors }.',
      rangBuoc: ['Không dùng Number() một mình — "" thành 0, "1e3" thành 1000.'],
      viDu: [{ input: 'parseForm({ qty: " 3 ", gift: "on" }, { qty: "int", gift: "boolean", note: "string?" })', output: '{ ok: true, data: { qty: 3, gift: true, note: null } }', explanation: 'Checkbox gửi "on"; ô ghi chú bỏ trống.' }],
      goiY: ['const optional = type.endsWith("?"); const base = type.replace("?", "");', 'Ngày có thật: new Date(s + "T00:00:00Z").toISOString().slice(0, 10) === s'],
      khoiDau: { 'main.js': `// Bài 9.2 — giá trị form sang đúng kiểu
function parseForm(raw, schema) {
  return { ok: true, data: raw };
}
` },
      loiGiai: { 'main.js': `// Bài 9.2 — form chỉ gửi chuỗi; đổi sang đúng kiểu ở MỘT chỗ, kèm lỗi rõ ràng
const PARSERS = {
  string: (s) => s,
  int: (s) => (/^-?\\d+$/.test(s) ? Number(s) : undefined),
  number: (s) => (/^-?\\d+(\\.\\d+)?$/.test(s) ? Number(s) : undefined),
  boolean: (s) => (s === 'true' || s === 'on' ? true : s === 'false' || s === 'off' ? false : undefined),
  date: (s) => {
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(s)) return undefined;
    const d = new Date(s + 'T00:00:00Z');
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s ? s : undefined;   // 2026-02-30 bị trượt sang tháng 3
  },
};

function parseForm(raw, schema) {
  const data = {};
  const errors = [];
  for (const [name, type] of Object.entries(schema)) {
    const optional = type.endsWith('?');
    const base = optional ? type.slice(0, -1) : type;
    const s = String(raw[name] ?? '').trim();
    if (s === '') {
      if (optional) data[name] = null;
      else errors.push(name + ': required');
      continue;
    }
    const value = PARSERS[base](s);
    if (value === undefined) errors.push(name + ': expected ' + base);
    else data[name] = value;
  }
  return errors.length ? { ok: false, errors } : { ok: true, data };
}
` },
      giaiThich: `<p>Đây là "ranh giới" mà Bài 9.5 nói tới: bên ngoài là chuỗi không ai bảo đảm; bên trong là ${c('{ qty: number; gift: boolean; note: string | null }')} đáng tin. ${c('Number("")')} là ${c('0')} và ${c('Number("1e3")')} là ${c('1000')} — vì thế kiểm định dạng bằng regex trước khi đổi.</p>`,
      loiHayGap: ['Number("") = 0 lọt qua như số hợp lệ.', 'new Date("2026-02-30") tự trượt sang 2026-03-02.', 'Dừng ở lỗi đầu tiên.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/FormData',
      kiem: [
        { moTa: 'Checkbox, trimmed int and empty optional|||Checkbox, int có khoảng trắng, tuỳ chọn trống', goi: 'parseForm({ qty: " 3 ", gift: "on", extra: "x" }, { qty: "int", gift: "boolean", note: "string?" })', mongDoi: { ok: true, data: { qty: 3, gift: true, note: null } } },
        { moTa: 'Every error, in schema order|||Mọi lỗi, theo thứ tự schema', goi: 'parseForm({ qty: "", price: "1e3", gift: "yes", born: "2026-02-30" }, { qty: "int", price: "number", gift: "boolean", born: "date" })', mongDoi: { ok: false, errors: ['qty: required', 'price: expected number', 'gift: expected boolean', 'born: expected date'] } },
        { moTa: 'Valid numbers and dates|||Số và ngày hợp lệ', goi: 'parseForm({ price: "-12.5", born: "2024-02-29", n: "-7", name: " Lan " }, { price: "number", born: "date", n: "int?", name: "string" })', mongDoi: { ok: true, data: { price: -12.5, born: '2024-02-29', n: -7, name: 'Lan' } } },
        { moTa: 'A decimal is not an int|||Số thập phân không phải int', goi: 'parseForm({ qty: "2.5" }, { qty: "int" })', mongDoi: { ok: false, errors: ['qty: expected int'] } },
      ],
    },
  ],
});
