/** Bộ luyện bài 9.1 — Vì sao TypeScript. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm chạy JavaScript, không chạy tsc ⇒ các bài luyện phần LÕI của bài học bằng JS: gọi đúng tên kiểu của một giá trị,
 *  tự kiểm một món hàng như interface CartItem (thứ TypeScript làm lúc biên dịch), đọc dòng lỗi tsc, tổng hợp output tsc,
 *  chặn dữ liệu sai ở ranh giới, và tự "suy kiểu" một giá trị JSON như tsc --declaration. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 9.1 — Vì sao TypeScript.</em> TypeScript kiểm kiểu lúc biên dịch rồi xoá hết kiểu. Các bài dưới đây làm bằng JavaScript đúng những việc đó — để bạn thấy bộ kiểm "nghĩ" gì, và thấy phần nào vẫn phải kiểm lúc chạy.</p>';

export default doiDau({
  slug: 'wf-9-1-why-typescript',
  ten: '9.1 Vì sao TypeScript',
  baiHoc: 'Nền tảng Web — Bài 9.1 Why TypeScript',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Gọi đúng tên kiểu của giá trị (null, mảng, NaN…), tự kiểm một món hàng theo hình dạng CartItem, tính tổng giỏ hàng mà KHÔNG để "5000" nối chuỗi, đọc một dòng lỗi tsc, tổng hợp cả output tsc thành báo cáo, và tự suy kiểu một giá trị JSON như tsc --declaration — 6 bài.',
  de: [
    {
      tieuDe: 'Tên kiểu thật của một giá trị',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['typeof', 'kiểu lúc chạy'], tienQuyet: ['typeof', 'Array.isArray'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>${c('typeof')} nói dối ba lần: ${c('typeof null')} là ${c('"object"')}, mảng cũng là ${c('"object"')}, và ${c('NaN')} là ${c('"number"')}. Viết ${c('typeName(value)')} trả: ${c('"null"')}, ${c('"array"')}, ${c('"nan"')} cho ba trường hợp đó; còn lại đúng kết quả của ${c('typeof')} (${c('"string"')}, ${c('"number"')}, ${c('"boolean"')}, ${c('"undefined"')}, ${c('"object"')}, ${c('"function"')}…).</p>`,
      yeuCau: ['null ⇒ "null".', 'Mảng ⇒ "array".', 'NaN ⇒ "nan".', 'Còn lại ⇒ typeof.'],
      dauVao: 'value: bất kỳ.', dauRa: 'string.',
      rangBuoc: ['Kiểm null TRƯỚC khi dùng typeof.'],
      viDu: [{ input: 'typeName("5000")', output: '"string"', explanation: 'Giá trị lấy từ ô nhập luôn là chuỗi — gốc của lỗi 250 005 000 VND.' }],
      goiY: ['if (value === null) return "null";', 'Number.isNaN(value) chỉ đúng với NaN thật.'],
      khoiDau: { 'main.js': `// Bài 9.1 — tên kiểu thật
function typeName(value) {
  return typeof value;
}
` },
      loiGiai: { 'main.js': `// Bài 9.1 — typeof đúng cho hầu hết, trừ ba chỗ nói dối
function typeName(value) {
  if (value === null) return 'null';                 // typeof null === 'object' — lỗi lịch sử của JavaScript
  if (Array.isArray(value)) return 'array';          // mảng cũng là 'object'
  if (Number.isNaN(value)) return 'nan';             // NaN là 'number' nhưng không phải con số dùng được
  return typeof value;
}
` },
      giaiThich: `<p>Đây là những gì bạn phải tự kiểm khi không có TypeScript — và cả khi có, với dữ liệu đến lúc chạy (Bài 9.1, Bước 4). TypeScript có kiểu riêng cho ${c('null')} và mảng, nhưng ${c('NaN')} vẫn chỉ là ${c('number')}: kiểu không bắt được ${c('Number("abc")')}.</p>`,
      loiHayGap: ['Kiểm typeof trước null.', 'Dùng isNaN (toàn cục) — nó đổi chuỗi sang số trước.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof',
      kiem: [
        { moTa: 'The three lies of typeof|||Ba chỗ typeof nói sai', goi: '[typeName(null), typeName([1, 2]), typeName(NaN)]', mongDoi: ['null', 'array', 'nan'] },
        { moTa: 'Ordinary values|||Giá trị thường', goi: '[typeName("5000"), typeName(5000), typeName(true), typeName(undefined), typeName({}), typeName(() => 1)]', mongDoi: ['string', 'number', 'boolean', 'undefined', 'object', 'function'] },
        { moTa: 'A string that looks like NaN is still a string|||Chuỗi "NaN" vẫn là chuỗi', goi: '[typeName("NaN"), typeName(Number("abc"))]', mongDoi: ['string', 'nan'] },
      ],
    },
    {
      tieuDe: 'Tự kiểm một CartItem',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['interface', 'kiểm lúc chạy'], tienQuyet: ['typeof', 'object'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Bài học mô tả ${c('interface CartItem { name: string; price: number; qty: number }')}. Viết ${c('cartItemErrors(item)')} trả mảng lỗi theo đúng thứ tự trường ${c('name')}, ${c('price')}, ${c('qty')}: thiếu trường ⇒ ${c('"<trường> is missing"')}; sai kiểu ⇒ ${c('"<trường> must be <kiểu>, got <kiểu thật>"')} (kiểu thật theo ${c('typeof')}, riêng ${c('null')} ghi ${c('"null"')}). Nếu ${c('item')} không phải object (hoặc là ${c('null')}/mảng) ⇒ ${c('["item must be an object"]')}.</p>`,
      yeuCau: ['Thứ tự name, price, qty.', 'Phân biệt thiếu và sai kiểu.', 'Đúng chữ thông báo.'],
      dauVao: 'item: bất kỳ.', dauRa: 'string[] (rỗng = hợp lệ).',
      rangBuoc: ['Trường có mặt nhưng giá trị undefined tính là thiếu.'],
      viDu: [{ input: 'cartItemErrors({ name: "Pen", price: "5000", qty: 3 })', output: '["price must be number, got string"]', explanation: 'Đúng lỗi tsc báo ở cart.ts(16,18) — nhưng lần này lúc chạy.' }],
      goiY: ['const shape = [["name", "string"], ["price", "number"], ["qty", "number"]];', 'const t = v === null ? "null" : typeof v;'],
      khoiDau: { 'main.js': `// Bài 9.1 — kiểm một món hàng theo hình dạng CartItem
function cartItemErrors(item) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 9.1 — chính việc tsc làm lúc biên dịch, làm lại lúc chạy cho dữ liệu đến từ ngoài
const CART_ITEM = [['name', 'string'], ['price', 'number'], ['qty', 'number']];

function cartItemErrors(item) {
  if (typeof item !== 'object' || item === null || Array.isArray(item)) return ['item must be an object'];
  const errors = [];
  for (const [field, want] of CART_ITEM) {
    const v = item[field];
    if (v === undefined) { errors.push(field + ' is missing'); continue; }
    const got = v === null ? 'null' : typeof v;
    if (got !== want) errors.push(field + ' must be ' + want + ', got ' + got);
  }
  return errors;
}
` },
      giaiThich: `<p>Với mã bạn tự viết, tsc kiểm hình dạng này miễn phí, trước khi chạy. Với JSON từ máy chủ hay ${c('input.value')}, kiểu bị xoá rồi — phải kiểm như trên (Bài 9.5 dùng zod để khỏi viết tay).</p>`,
      loiHayGap: ['Coi null là object hợp lệ.', 'Báo "missing" cho giá trị 0 hay chuỗi rỗng.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/objects.html',
      kiem: [
        { moTa: 'A valid item has no errors|||Món hợp lệ không có lỗi', goi: 'cartItemErrors({ name: "Notebook", price: 25000, qty: 2 })', mongDoi: [] },
        { moTa: 'The string price from the lesson|||Giá dạng chuỗi trong bài', goi: 'cartItemErrors({ name: "Pen", price: "5000", qty: 3 })', mongDoi: ['price must be number, got string'] },
        { moTa: 'Missing, null and wrong types in order|||Thiếu, null, sai kiểu đúng thứ tự', goi: 'cartItemErrors({ price: null, qty: "2" })', mongDoi: ['name is missing', 'price must be number, got null', 'qty must be number, got string'] },
        { moTa: 'Not an object|||Không phải object', goi: '[cartItemErrors(null), cartItemErrors([]), cartItemErrors("Pen")]', mongDoi: [['item must be an object'], ['item must be an object'], ['item must be an object']] },
      ],
    },
    {
      tieuDe: 'Tổng giỏ hàng không bị nối chuỗi',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['ép kiểu ngầm', 'TypeError'], tienQuyet: ['reduce', 'throw'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Trong bài, ${c('"Total: " + … + item.price')} ra ${c('250005000')} vì ${c('+')} nối chuỗi. Viết ${c('cartLabel(items)')} trả ${c('"Total: <tổng price × qty> VND"')}. Trước khi cộng, kiểm từng món: ${c('price')} và ${c('qty')} phải là số hữu hạn (${c('Number.isFinite')}), ${c('qty')} là số nguyên ≥ 1. Món sai ⇒ ném ${c('TypeError')} với thông điệp ${c('"item <chỉ số>: price must be a finite number"')} hoặc ${c('"item <chỉ số>: qty must be a positive integer"')}. KHÔNG tự đổi ${c('"5000"')} thành số — dữ liệu sai phải bị chặn, không bị "sửa lặng lẽ".</p>`,
      yeuCau: ['Kiểm trước khi tính.', 'Ném TypeError đúng thông điệp.', 'Giỏ rỗng ⇒ "Total: 0 VND".'],
      dauVao: 'items: mảng { name, price, qty }.', dauRa: 'string.',
      rangBuoc: ['Không dùng Number(), parseInt hay + đơn ngôi để "cứu" giá trị sai.'],
      viDu: [{ input: 'cartLabel([{ name: "Notebook", price: 25000, qty: 2 }, { name: "Pen", price: 5000, qty: 3 }])', output: '"Total: 65000 VND"', explanation: '25 000 × 2 + 5 000 × 3.' }],
      goiY: ['items.forEach((it, i) => { if (!Number.isFinite(it.price)) throw new TypeError(´item @{i}: …´); });', 'Number.isInteger(qty) && qty >= 1'],
      khoiDau: { 'main.js': `// Bài 9.1 — tổng giỏ hàng
function cartLabel(items) {
  return 'Total: ' + items.reduce((sum, item) => sum + item.price * item.qty, 0) + ' VND';
}
` },
      loiGiai: { 'main.js': `// Bài 9.1 — chặn dữ liệu sai rồi mới tính; không "cứu" "5000" thành 5000
function cartLabel(items) {
  items.forEach((item, i) => {
    if (!Number.isFinite(item.price)) throw new TypeError('item ' + i + ': price must be a finite number');
    if (!Number.isInteger(item.qty) || item.qty < 1) throw new TypeError('item ' + i + ': qty must be a positive integer');
  });
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return 'Total: ' + total + ' VND';
}
` },
      giaiThich: `<p>${c('Number.isFinite("5000")')} là ${c('false')} — khác ${c('isFinite("5000")')} (toàn cục, ép kiểu trước). Thông báo lỗi rõ ràng lúc chạy là thứ tốt nhất JavaScript cho bạn; TypeScript cho bạn cùng thông báo đó sớm hơn, lúc viết mã — nhưng chỉ cho mã bạn kiểm soát.</p>`,
      loiHayGap: ['Dùng isFinite toàn cục.', 'Ép Number(price) — "5,000" thành NaN, "" thành 0.', 'Kiểm qty bằng typeof — NaN lọt qua.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite',
      kiem: [
        { moTa: 'Correct total|||Tổng đúng', goi: '[cartLabel([{ name: "Notebook", price: 25000, qty: 2 }, { name: "Pen", price: 5000, qty: 3 }]), cartLabel([])]', mongDoi: ['Total: 65000 VND', 'Total: 0 VND'] },
        { moTa: 'A string price is refused, not concatenated|||Giá chuỗi bị chặn, không nối chuỗi', goi: 'cartLabel([{ name: "Notebook", price: 25000, qty: 2 }, { name: "Pen", price: "5000", qty: 3 }])', mongDoi: { loi: 'TypeError', thongDiep: '^item 1: price must be a finite number$' } },
        { moTa: 'qty must be a positive integer|||qty phải là số nguyên dương', goi: 'cartLabel([{ name: "Mug", price: 75000, qty: 1.5 }])', mongDoi: { loi: 'TypeError', thongDiep: '^item 0: qty must be a positive integer$' } },
        { moTa: 'NaN is not a price|||NaN không phải giá', goi: 'cartLabel([{ name: "Mug", price: NaN, qty: 1 }])', mongDoi: { loi: 'TypeError', thongDiep: 'price must be a finite number' } },
      ],
    },
    {
      tieuDe: 'Đọc một dòng lỗi tsc',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['định dạng lỗi tsc', 'regex'], tienQuyet: ['regex', 'Number'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>tsc in lỗi dạng ${c('cart.ts(16,18): error TS2322: Type \'string\' is not assignable to type \'number\'.')}. Viết ${c('parseTscError(line)')} trả ${c('{ file, line, col, code, message }')} (${c('line')}, ${c('col')}, ${c('code')} là SỐ — ${c('code')} bỏ tiền tố ${c('TS')}). Dòng không đúng định dạng (dòng giải thích thụt lề, ${c('(exit code 2)')}, dòng trống) ⇒ ${c('null')}. Tên tệp có thể chứa thư mục và dấu chấm (${c('src/index.ts')}).</p>`,
      yeuCau: ['Số là number.', 'message giữ nguyên.', 'Không khớp ⇒ null.'],
      dauVao: 'line: string.', dauRa: 'object hoặc null.',
      rangBuoc: ['Một biểu thức chính quy là đủ.'],
      viDu: [{ input: 'parseTscError("shapes.ts(13,7): error TS2741: Property \'price\' is missing in type \'{ id: number; name: string; }\' but required in type \'Product\'.")', output: '{ file: "shapes.ts", line: 13, col: 7, code: 2741, message: "Property \'price\' is missing …" }', explanation: 'Output thật của Bài 9.3.' }],
      goiY: ['/^(.+)\\((\\d+),(\\d+)\\): error TS(\\d+): (.*)$/', 'Number(m[2])'],
      khoiDau: { 'main.js': `// Bài 9.1 — đọc một dòng lỗi tsc
function parseTscError(line) {
  return null;
}
` },
      loiGiai: { 'main.js': `// Bài 9.1 — tệp(dòng,cột): error TSmã: thông điệp
const TSC_LINE = /^(.+)\\((\\d+),(\\d+)\\): error TS(\\d+): (.*)$/;

function parseTscError(line) {
  const m = TSC_LINE.exec(String(line));
  if (!m) return null;
  return { file: m[1], line: Number(m[2]), col: Number(m[3]), code: Number(m[4]), message: m[5] };
}
` },
      giaiThich: `<p>Trình soạn thảo, CI và các công cụ như "problem matcher" của GitHub Actions đọc đúng định dạng này để gạch đỏ đúng dòng. Biết đọc ${c('(dòng,cột)')} và mã ${c('TS2322')} là kỹ năng đầu tiên với TypeScript: mã lỗi tra được trên mạng.</p>`,
      loiHayGap: ['Để line/col là chuỗi.', 'Regex không có ^ … $ — khớp cả dòng giải thích.', 'Tên tệp có ngoặc bị cắt sai (.+ tham lam vẫn đúng vì có \\( ở cuối).'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/compiler-options.html',
      kiem: [
        { moTa: 'The cart.ts error from the lesson|||Lỗi cart.ts trong bài', goi: 'parseTscError("cart.ts(16,18): error TS2322: Type \'string\' is not assignable to type \'number\'.")', mongDoi: { file: 'cart.ts', line: 16, col: 18, code: 2322, message: "Type 'string' is not assignable to type 'number'." } },
        { moTa: 'A path with a folder|||Đường dẫn có thư mục', goi: 'parseTscError("src/index.ts(4,27): error TS2591: Cannot find name \'process\'.")', mongDoi: { file: 'src/index.ts', line: 4, col: 27, code: 2591, message: "Cannot find name 'process'." } },
        { moTa: 'Non-error lines give null|||Dòng không phải lỗi trả null', goi: '[parseTscError("  Property \'email\' is missing in type"), parseTscError("(exit code 2)"), parseTscError("")]', mongDoi: [null, null, null] },
      ],
    },
    {
      tieuDe: 'Tổng hợp output tsc',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['exit code', 'nhóm lỗi'], tienQuyet: ['split', 'object đếm'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết ${c('summarizeTsc(output)')} nhận cả khối output tsc (nhiều dòng). Trả ${c('{ errors, files, codes, exitCode }')}: ${c('errors')} = số dòng lỗi; ${c('files')} = object ${c('{ tệp: số lỗi }')}; ${c('codes')} = mảng mã lỗi KHÁC NHAU dạng ${c('"TS2322"')}, sắp tăng dần theo số; ${c('exitCode')} = ${c('0')} nếu không có lỗi, ngược lại ${c('2')}. Dòng giải thích thụt lề không tính là lỗi riêng.</p>`,
      yeuCau: ['Chỉ đếm dòng lỗi thật.', 'codes không trùng, tăng dần.', 'exitCode 0 hoặc 2.'],
      dauVao: 'output: string.', dauRa: '{ errors, files, codes, exitCode }.',
      rangBuoc: ['Tự viết phần đọc dòng (có thể giống bài trước).'],
      viDu: [{ input: 'summarizeTsc(output của mistakes.ts — 5 lỗi)', output: '{ errors: 5, files: { "mistakes.ts": 5 }, codes: ["TS2339", "TS2345", "TS18047"], exitCode: 2 }', explanation: 'Dòng "Property \'email\' is missing…" thụt lề không tính.' }],
      goiY: ['output.split("\\n").map(parse).filter(Boolean)', '[...new Set(codes)].sort((a, b) => a - b).map((n) => "TS" + n)'],
      khoiDau: { 'main.js': `// Bài 9.1 — tổng hợp output tsc
function summarizeTsc(output) {
  const lines = output.split('\\n');
  return { errors: lines.length, files: {}, codes: [], exitCode: 0 };
}
` },
      loiGiai: { 'main.js': `// Bài 9.1 — đọc từng dòng lỗi, đếm theo tệp, gom mã lỗi, suy ra mã thoát
const TSC_LINE = /^(.+)\\((\\d+),(\\d+)\\): error TS(\\d+): (.*)$/;

function summarizeTsc(output) {
  const files = {};
  const codes = new Set();
  let errors = 0;
  for (const line of String(output).split('\\n')) {
    const m = TSC_LINE.exec(line);
    if (!m) continue;                                   // dòng giải thích, dòng (exit code N), dòng trống
    errors++;
    files[m[1]] = (files[m[1]] ?? 0) + 1;
    codes.add(Number(m[4]));
  }
  return {
    errors,
    files,
    codes: [...codes].sort((a, b) => a - b).map((n) => 'TS' + n),   // so SỐ: 2339 < 18047
    exitCode: errors === 0 ? 0 : 2,
  };
}
` },
      giaiThich: `<p>CI chỉ nhìn mã thoát: ${c('0')} cho gộp, khác ${c('0')} chặn lại. Sắp mã lỗi theo SỐ chứ không theo chuỗi — so chuỗi đặt ${c('"TS18047"')} trước ${c('"TS2339"')}.</p>`,
      loiHayGap: ['Đếm cả dòng thụt lề.', 'Sắp mã lỗi theo chuỗi.', 'Không bỏ trùng mã.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/compiler-options.html',
      kiem: [
        { moTa: 'The mistakes.ts output (5 errors)|||Output mistakes.ts (5 lỗi)', goi: 'summarizeTsc(["$ npx tsc --noEmit --strict mistakes.ts", "mistakes.ts(8,27): error TS2339: Property \'nmae\' does not exist on type \'User\'.", "mistakes.ts(11,10): error TS18047: \'user.email\' is possibly \'null\'.", "mistakes.ts(14,13): error TS18047: \'input\' is possibly \'null\'.", "mistakes.ts(14,19): error TS2339: Property \'value\' does not exist on type \'Element\'.", "mistakes.ts(15,7): error TS2345: Argument of type \'{ id: number; name: string; }\' is not assignable to parameter of type \'User\'.", "  Property \'email\' is missing in type \'{ id: number; name: string; }\' but required in type \'User\'.", "(exit code 2)"].join("\\n"))', mongDoi: { errors: 5, files: { 'mistakes.ts': 5 }, codes: ['TS2339', 'TS2345', 'TS18047'], exitCode: 2 } },
        { moTa: 'A clean run|||Lần chạy sạch', goi: 'summarizeTsc("$ npx tsc -p .\\n(exit code 0)")', mongDoi: { errors: 0, files: {}, codes: [], exitCode: 0 } },
        { moTa: 'Several files|||Nhiều tệp', goi: 'summarizeTsc("a.ts(1,1): error TS2322: x\\nsrc/b.ts(2,2): error TS2322: y\\na.ts(3,3): error TS7006: z")', mongDoi: { errors: 3, files: { 'a.ts': 2, 'src/b.ts': 1 }, codes: ['TS2322', 'TS7006'], exitCode: 2 } },
      ],
    },
    {
      tieuDe: 'Tự suy kiểu như tsc --declaration',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['suy kiểu', 'union', 'đệ quy'], tienQuyet: ['đệ quy', 'Set'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết ${c('inferType(value)')} trả chuỗi kiểu TypeScript cho một giá trị JSON, giống thứ ${c('tsc --declaration')} in ra cho ${c('let')}: ${c('"string"')}, ${c('"number"')}, ${c('"boolean"')}, ${c('"null"')}; object ⇒ ${c('"{ a: number; b: string }"')} (giữ thứ tự khoá, object rỗng ⇒ ${c('"{}"')}); mảng ⇒ ${c('"T[]"')} với T là kiểu phần tử; nếu các phần tử có nhiều kiểu khác nhau ⇒ ${c('"(A | B)[]"')} theo thứ tự xuất hiện lần đầu, không trùng; mảng rỗng ⇒ ${c('"unknown[]"')}. Áp dụng đệ quy.</p>`,
      yeuCau: ['Đúng định dạng "{ a: T; b: U }".', 'Union trong mảng bọc ngoặc.', 'Đệ quy cho object/mảng lồng nhau.'],
      dauVao: 'value: giá trị JSON.', dauRa: 'string.',
      rangBuoc: ['Không dùng thư viện.', 'Mảng một kiểu thì KHÔNG có ngoặc: "string[]".'],
      viDu: [{ input: 'inferType({ id: 1, title: "Hello World", tags: ["sql", "beginner"], published: true })', output: '"{ id: number; title: string; tags: string[]; published: boolean }"', explanation: 'Giống cách tsc mô tả biến post ở Bài 9.2.' }],
      goiY: ['if (Array.isArray(v)) { const kinds = [...new Set(v.map(inferType))]; … }', 'Object.entries(v).map(([k, x]) => k + ": " + inferType(x)).join("; ")'],
      khoiDau: { 'main.js': `// Bài 9.1 — tự suy kiểu cho một giá trị JSON
function inferType(value) {
  return typeof value;
}
` },
      loiGiai: { 'main.js': `// Bài 9.1 — đệ quy: nguyên thuỷ → tên; mảng → kiểu phần tử (union nếu nhiều); object → { khoá: kiểu; khoá: kiểu }
function inferType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const kinds = [...new Set(value.map(inferType))];          // thứ tự xuất hiện lần đầu, không trùng
    return kinds.length === 1 ? kinds[0] + '[]' : '(' + kinds.join(' | ') + ')[]';
  }
  if (typeof value === 'object') {
    const fields = Object.entries(value).map(([k, v]) => k + ': ' + inferType(v));
    return fields.length === 0 ? '{}' : '{ ' + fields.join('; ') + ' }';
  }
  return typeof value;                                          // 'string' | 'number' | 'boolean'
}
` },
      giaiThich: `<p>Đây là phiên bản thu nhỏ của suy kiểu (Bài 9.2): tsc nhìn giá trị khởi tạo và dựng ra kiểu, nên bạn hiếm khi phải viết kiểu cho biến. Cái nó không làm được là đoán giá trị đến lúc chạy — vì vậy kiểu của ${c('JSON.parse')} là ${c('any')}, và bạn nên coi nó là ${c('unknown')}. (tsc thật suy mảng rỗng thành ${c('any[]')} hay ${c('never[]')} tuỳ thiết lập; ở đây ta chọn ${c('unknown[]')} cho an toàn.)</p>`,
      loiHayGap: ['Quên ngoặc quanh union: "string | number[]" nghĩa là KHÁC.', 'Trùng kiểu trong union.', 'null thành "object".'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/type-inference.html',
      kiem: [
        { moTa: 'Primitives and null|||Nguyên thuỷ và null', goi: '[inferType("Hello World"), inferType(25000), inferType(true), inferType(null)]', mongDoi: ['string', 'number', 'boolean', 'null'] },
        { moTa: 'The post object from Lesson 9.2|||Object post của Bài 9.2', goi: 'inferType({ id: 1, title: "Hello World", tags: ["sql", "beginner"], published: true })', mongDoi: '{ id: number; title: string; tags: string[]; published: boolean }' },
        { moTa: 'Mixed arrays become a union in parentheses|||Mảng lẫn kiểu thành union có ngoặc', goi: '[inferType([1, "two", true]), inferType([1, 2, "x", 3]), inferType([])]', mongDoi: ['(number | string | boolean)[]', '(number | string)[]', 'unknown[]'] },
        { moTa: 'Nested objects and arrays|||Object và mảng lồng nhau', goi: 'inferType({ items: [{ id: 1, name: "Pen" }], meta: {}, page: null })', mongDoi: '{ items: { id: number; name: string }[]; meta: {}; page: null }' },
      ],
    },
  ],
});
