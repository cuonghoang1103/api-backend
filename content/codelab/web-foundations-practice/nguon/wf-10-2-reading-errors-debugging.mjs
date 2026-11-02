/** Bộ luyện bài 10.2 — Đọc lỗi & gỡ lỗi. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Đọc dòng stack, tìm khung đầu tiên thuộc mã của bạn, gợi ý theo tên lỗi, chỉ ra CHỖ undefined trên một đường dẫn,
 *  bisect lịch sử commit, và một trình "trace" nhỏ ghi mọi lời gọi (debugger thu nhỏ). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 10.2 — Đọc lỗi &amp; gỡ lỗi.</em> Mỗi bài là một mảnh của công việc gỡ lỗi mà công cụ (Node, DevTools, Git) làm cho bạn — tự viết nó để hiểu thông tin nằm ở đâu.</p>';

export default doiDau({
  slug: 'wf-10-2-reading-errors-debugging',
  ten: '10.2 Đọc lỗi & gỡ lỗi',
  baiHoc: 'Nền tảng Web — Bài 10.2 Reading errors & the debugging loop',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Đọc một dòng stack trace, tìm khung đầu tiên thuộc mã của bạn (bỏ node:internal và node_modules), gợi ý theo tên lỗi, chỉ đúng chỗ undefined trên đường dẫn a.b.c, bisect lịch sử commit đếm số lần chạy kiểm, và tự viết trace() ghi mọi lời gọi có thụt lề — 6 bài.',
  de: [
    {
      tieuDe: 'Đọc một dòng stack',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['stack trace', 'tệp:dòng:cột'], tienQuyet: ['regex'], the: ['javascript', 'gỡ lỗi'],
      moTa: `${BAI}<p>Viết ${c('parseFrame(line)')} cho một dòng stack của V8. Hai dạng: ${c('"    at shippingLabel (shop/format.mjs:3:62)"')} ⇒ ${c('{ fn: "shippingLabel", file: "shop/format.mjs", line: 3, col: 62 }')}; ${c('"    at shop/index.mjs:9:34"')} (không có tên hàm) ⇒ ${c('fn: null')}. Tên hàm có thể có dấu chấm hoặc khoảng trắng (${c('"async Promise.all"')}, ${c('"HTMLButtonElement.<anonymous>"')}). Dòng không khớp ⇒ ${c('null')}. ${c('line')}, ${c('col')} là số.</p>`,
      yeuCau: ['Hai dạng dòng.', 'Số là number.', 'Không khớp ⇒ null.'],
      dauVao: 'line: string.', dauRa: '{ fn, file, line, col } | null.',
      rangBuoc: ['Tên tệp có thể có dấu hai chấm (node:internal/…).'],
      viDu: [{ input: 'parseFrame("    at checkout (shop/checkout.mjs:5:26)")', output: '{ fn: "checkout", file: "shop/checkout.mjs", line: 5, col: 26 }', explanation: 'Dòng thứ hai của stack trong bài.' }],
      goiY: ['/^\\s*at (?:(.+?) \\()?(.+):(\\d+):(\\d+)\\)?$/', 'Nhóm tên hàm vắng ⇒ undefined ⇒ đổi thành null.'],
      khoiDau: { 'main.js': `// Bài 10.2 — đọc một dòng stack
function parseFrame(line) {
  return null;
}
` },
      loiGiai: { 'main.js': `// Bài 10.2 — "at tên (tệp:dòng:cột)" hoặc "at tệp:dòng:cột"; số cuối cùng luôn là dòng và cột
const FRAME = /^\\s*at (?:(.+?) \\()?(.+):(\\d+):(\\d+)\\)?$/;

function parseFrame(line) {
  const m = FRAME.exec(String(line));
  if (!m) return null;
  return { fn: m[1] ?? null, file: m[2], line: Number(m[3]), col: Number(m[4]) };
}
` },
      giaiThich: `<p>Mọi công cụ — DevTools, Sentry, VS Code — đọc đúng định dạng này để biến stack thành liên kết bấm được. ${c('(.+)')} tham lam cho tên tệp vẫn đúng vì hai số cuối được neo ở cuối dòng.</p>`,
      loiHayGap: ['Tách theo ":" — node:internal có thêm dấu hai chấm.', 'Bắt buộc có tên hàm.', 'Để line là chuỗi.'],
      thamKhao: 'https://v8.dev/docs/stack-trace-api',
      kiem: [
        { moTa: 'A named frame|||Khung có tên', goi: 'parseFrame("    at shippingLabel (shop/format.mjs:3:62)")', mongDoi: { fn: 'shippingLabel', file: 'shop/format.mjs', line: 3, col: 62 } },
        { moTa: 'Anonymous and browser frames|||Khung vô danh và của trình duyệt', goi: '[parseFrame("    at shop/index.mjs:9:34"), parseFrame("    at HTMLButtonElement.<anonymous> (cart.js:16:32)")]', mongDoi: [{ fn: null, file: 'shop/index.mjs', line: 9, col: 34 }, { fn: 'HTMLButtonElement.<anonymous>', file: 'cart.js', line: 16, col: 32 }] },
        { moTa: 'Internal frames and non-frames|||Khung nội bộ và dòng thường', goi: '[parseFrame("    at async Promise.all (node:internal/modules/esm/loader:121:5)"), parseFrame("TypeError: boom"), parseFrame("")]', mongDoi: [{ fn: 'async Promise.all', file: 'node:internal/modules/esm/loader', line: 121, col: 5 }, null, null] },
      ],
    },
    {
      tieuDe: 'Gợi ý theo tên lỗi',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['tên lỗi', 'thông điệp'], tienQuyet: ['regex', 'switch'], the: ['javascript', 'gỡ lỗi'],
      moTa: `${BAI}<p>Viết ${c('errorHint(err)')} nhận một Error, trả chuỗi gợi ý: ${c('ReferenceError')} ⇒ ${c('"check the spelling of <tên>"')} (tên lấy từ ${c('"<tên> is not defined"')}); ${c('TypeError')} có ${c('"(reading \'x\')"')} ⇒ ${c('"the value before .x is undefined or null"')}; ${c('TypeError')} có ${c('"is not a function"')} ⇒ ${c('"<biểu thức> is not a function — check its type"')}; ${c('SyntaxError')} ⇒ ${c('"invalid syntax or JSON"')}; ${c('RangeError')} có ${c('"call stack"')} ⇒ ${c('"recursion without a base case"')}, RangeError khác ⇒ ${c('"a number is out of range"')}; còn lại ⇒ ${c('"read the full message: <message>"')}.</p>`,
      yeuCau: ['Dựa vào err.name và err.message.', 'Trích tên/thuộc tính từ thông điệp.'],
      dauVao: 'err: Error.', dauRa: 'string.',
      rangBuoc: ['Không phụ thuộc instanceof (lỗi có thể đến từ realm khác).'],
      viDu: [{ input: 'errorHint(new TypeError("Cannot read properties of undefined (reading \'city\')"))', output: '"the value before .city is undefined or null"', explanation: 'Đúng lỗi của shop/format.mjs.' }],
      goiY: ["/\\(reading '([^']+)'\\)/.exec(err.message)", '/^(.+) is not a function/.exec(err.message)'],
      khoiDau: { 'main.js': `// Bài 10.2 — gợi ý theo tên lỗi
function errorHint(err) {
  return 'something went wrong';
}
` },
      loiGiai: { 'main.js': `// Bài 10.2 — tên lỗi cho biết loại, thông điệp cho biết chỗ
function errorHint(err) {
  const msg = String(err.message);
  switch (err.name) {
    case 'ReferenceError': {
      const m = /^(\\S+) is not defined/.exec(msg);
      return 'check the spelling of ' + (m ? m[1] : 'the name');
    }
    case 'TypeError': {
      const read = /\\(reading '([^']+)'\\)/.exec(msg);
      if (read) return 'the value before .' + read[1] + ' is undefined or null';
      const fn = /^(.+) is not a function/.exec(msg);
      if (fn) return fn[1] + ' is not a function — check its type';
      break;
    }
    case 'SyntaxError':
      return 'invalid syntax or JSON';
    case 'RangeError':
      return /call stack/i.test(msg) ? 'recursion without a base case' : 'a number is out of range';
  }
  return 'read the full message: ' + msg;
}
` },
      giaiThich: `<p>Đây là thói quen "đọc hết thông điệp" viết thành mã: tên lỗi chọn nhánh, phần còn lại của thông điệp cho đúng tên biến hay thuộc tính cần nhìn.</p>`,
      loiHayGap: ['Dùng instanceof.', 'Nói ".city bị thiếu" — thật ra thứ TRƯỚC nó mới thiếu.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors',
      kiem: [
        { moTa: 'Reading through undefined|||Đọc xuyên undefined', goi: 'errorHint(new TypeError("Cannot read properties of undefined (reading \'city\')"))', mongDoi: 'the value before .city is undefined or null' },
        { moTa: 'Reference, not a function, JSON|||Reference, không phải hàm, JSON', goi: '[errorHint(new ReferenceError("totl is not defined")), errorHint(new TypeError("user.getName is not a function")), errorHint(new SyntaxError("Unexpected token"))]', mongDoi: ['check the spelling of totl', 'user.getName is not a function — check its type', 'invalid syntax or JSON'] },
        { moTa: 'RangeError kinds and the fallback|||Các loại RangeError và mặc định', goi: '[errorHint(new RangeError("Maximum call stack size exceeded")), errorHint(new RangeError("toFixed() digits argument must be between 0 and 100")), errorHint(new Error("HTTP 404"))]', mongDoi: ['recursion without a base case', 'a number is out of range', 'read the full message: HTTP 404'] },
      ],
    },
    {
      tieuDe: 'Khung đầu tiên thuộc mã của bạn',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['lọc stack'], tienQuyet: ['split', 'regex'], the: ['javascript', 'gỡ lỗi'],
      moTa: `${BAI}<p>Viết ${c('firstOwnFrame(stack)')} nhận toàn bộ ${c('err.stack')}. Bỏ dòng đầu (tên + thông điệp) và mọi khung có tệp bắt đầu bằng ${c('node:')} hoặc chứa ${c('node_modules/')}. Trả chuỗi ${c('"<tệp>:<dòng>:<cột> in <hàm>"')} của khung đầu tiên còn lại (khung không tên ⇒ ${c('"in <top level>"')}), hoặc ${c('null')} nếu không có. Tự viết phần đọc dòng.</p>`,
      yeuCau: ['Bỏ node: và node_modules/.', 'Đúng định dạng kết quả.', 'Không có ⇒ null.'],
      dauVao: 'stack: string.', dauRa: 'string | null.',
      rangBuoc: ['Thông điệp lỗi có thể nhiều dòng — chỉ dòng bắt đầu bằng "at" là khung.'],
      viDu: [{ input: 'firstOwnFrame(stack có express trong node_modules ở trên cùng)', output: '"src/routes/notes.js:14:9 in createNote"', explanation: 'Lỗi ném từ thư viện nhưng do mã của bạn gọi sai.' }],
      goiY: ['stack.split("\\n").filter((l) => /^\\s*at /.test(l))', 'const own = (f) => !f.file.startsWith("node:") && !f.file.includes("node_modules/");'],
      khoiDau: { 'main.js': `// Bài 10.2 — khung đầu tiên thuộc mã của bạn
function firstOwnFrame(stack) {
  return stack.split('\\n')[1];
}
` },
      loiGiai: { 'main.js': `// Bài 10.2 — lỗi thường "nổ" trong thư viện; chỗ cần sửa là khung đầu tiên của MÃ BẠN
const FRAME = /^\\s*at (?:(.+?) \\()?(.+):(\\d+):(\\d+)\\)?$/;

function firstOwnFrame(stack) {
  for (const line of String(stack).split('\\n')) {
    const m = FRAME.exec(line);
    if (!m) continue;                                         // dòng thông điệp, dòng trống
    const file = m[2];
    if (file.startsWith('node:') || file.includes('node_modules/')) continue;
    return file + ':' + m[3] + ':' + m[4] + ' in ' + (m[1] ?? '<top level>');
  }
  return null;
}
` },
      giaiThich: `<p>Khi lỗi ném ra từ sâu trong Express hay Prisma, dòng đầu của stack nằm trong ${c('node_modules')} — sửa ở đó là sai. Khung đầu tiên của mã bạn là chỗ đã truyền dữ liệu sai vào thư viện.</p>`,
      loiHayGap: ['Coi dòng thông điệp là khung.', 'Không bỏ node:internal.'],
      thamKhao: 'https://nodejs.org/api/errors.html#errorstack',
      kiem: [
        { moTa: 'The shop stack from the lesson|||Stack của shop trong bài', goi: 'firstOwnFrame(["TypeError: Cannot read properties of undefined (reading \'city\')", "    at shippingLabel (shop/format.mjs:3:62)", "    at checkout (shop/checkout.mjs:5:26)"].join("\\n"))', mongDoi: 'shop/format.mjs:3:62 in shippingLabel' },
        { moTa: 'Skips libraries and Node internals|||Bỏ thư viện và nội bộ Node', goi: 'firstOwnFrame(["Error: invalid input", "    at validate (node_modules/zod/lib/types.js:90:11)", "    at Object.parse (node_modules/zod/lib/types.js:12:3)", "    at createNote (src/routes/notes.js:14:9)", "    at node:internal/process/task_queues:105:5"].join("\\n"))', mongDoi: 'src/routes/notes.js:14:9 in createNote' },
        { moTa: 'Top-level frame and nothing of yours|||Khung cấp cao nhất và không có mã của bạn', goi: '[firstOwnFrame("Error: x\\n    at shop/index.mjs:9:34"), firstOwnFrame("Error: x\\n    at ModuleJob.run (node:internal/modules/esm/module_job:271:25)")]', mongDoi: ['shop/index.mjs:9:34 in <top level>', null] },
      ],
    },
    {
      tieuDe: 'Chỉ đúng chỗ undefined',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['đọc theo đường dẫn', 'thông báo lỗi tốt'], tienQuyet: ['split', 'vòng lặp'], the: ['javascript', 'gỡ lỗi'],
      moTa: `${BAI}<p>"Cannot read properties of undefined (reading 'city')" không nói phần NÀO là undefined. Viết ${c('getPath(obj, path)')} với ${c('path')} dạng ${c('"customer.address.city"')}: đi từng bước; nếu tới cuối ⇒ ${c('{ ok: true, value }')} (value có thể là undefined nếu chính trường cuối thiếu — vẫn ok); nếu giữa đường gặp ${c('undefined')} hoặc ${c('null')} trước khi hết đường dẫn ⇒ ${c('{ ok: false, missing: "<đoạn đường đã đi>", was: "undefined" | "null" }')}. Đoạn số trong đường dẫn (${c('"items.0.price"')}) dùng làm chỉ số mảng.</p>`,
      yeuCau: ['Dừng ở chỗ đầu tiên là null/undefined.', 'Báo đoạn đường dẫn bị thiếu.', 'Phân biệt null và undefined.'],
      dauVao: 'obj: any; path: string.', dauRa: '{ ok, value } | { ok, missing, was }.',
      rangBuoc: ['Không dùng optional chaining để che lỗi — phải biết chỗ dừng.'],
      viDu: [{ input: 'getPath({ customer: { name: "Minh" } }, "customer.address.city")', output: '{ ok: false, missing: "customer.address", was: "undefined" }', explanation: 'Đơn tự lấy trong bài — thiếu address, không phải city.' }],
      goiY: ['const parts = path.split("."); let cur = obj;', 'for (let i = 0; i < parts.length; i++) { if (cur == null) return { ok: false, missing: parts.slice(0, i).join("."), … }; cur = cur[parts[i]]; }'],
      khoiDau: { 'main.js': `// Bài 10.2 — chỉ đúng chỗ undefined
function getPath(obj, path) {
  return { ok: true, value: path.split('.').reduce((cur, k) => cur?.[k], obj) };
}
` },
      loiGiai: { 'main.js': `// Bài 10.2 — đi từng bước; trước khi đọc bước kế, kiểm giá trị hiện tại
function getPath(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    if (cur === undefined || cur === null) {
      return { ok: false, missing: parts.slice(0, i).join('.') || '(root)', was: cur === null ? 'null' : 'undefined' };
    }
    cur = cur[parts[i]];
  }
  return { ok: true, value: cur };
}
` },
      giaiThich: `<p>Optional chaining (${c('a?.b?.c')}) trả ${c('undefined')} và giấu luôn câu hỏi "thiếu ở đâu". Khi gỡ lỗi, bạn cần đúng câu trả lời mà V8 không in ra: phần nào của chuỗi là undefined.</p>`,
      loiHayGap: ['Báo "city" thay vì "customer.address".', 'Coi value undefined ở cuối là lỗi.', 'Gộp null với undefined.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining',
      kiem: [
        { moTa: 'The pick-up order|||Đơn tự lấy', goi: 'getPath({ customer: { name: "Minh" } }, "customer.address.city")', mongDoi: { ok: false, missing: 'customer.address', was: 'undefined' } },
        { moTa: 'Found values, including a missing last field|||Tìm thấy, kể cả trường cuối thiếu', goi: '[getPath({ customer: { address: { city: "Da Nang" } } }, "customer.address.city"), getPath({ a: {} }, "a.b")]', mongDoi: [{ ok: true, value: 'Da Nang' }, { ok: true, value: { $js: 'undefined' } }] },
        { moTa: 'null, arrays and the root|||null, mảng và gốc', goi: '[getPath({ user: null }, "user.name"), getPath({ items: [{ price: 5 }] }, "items.0.price"), getPath(undefined, "x")]', mongDoi: [{ ok: false, missing: 'user', was: 'null' }, { ok: true, value: 5 }, { ok: false, missing: '(root)', was: 'undefined' }] },
      ],
    },
    {
      tieuDe: 'Bisect lịch sử',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['tìm kiếm nhị phân', 'git bisect'], tienQuyet: ['vòng lặp', 'Math.floor'], the: ['javascript', 'gỡ lỗi'],
      moTa: `${BAI}<p>Viết ${c('bisect(commits, isGood)')}: ${c('commits')} là mảng mã commit từ CŨ tới MỚI, biết chắc commit đầu tốt và commit cuối xấu; ${c('isGood(id)')} chạy phép kiểm (true = tốt). Trả ${c('{ firstBad, tested }')} — commit xấu đầu tiên và danh sách commit đã kiểm theo thứ tự (không kiểm commit đầu và cuối). Luôn kiểm commit giữa ${c('Math.floor((good + bad) / 2)')} của khoảng hiện tại, như ${c('git bisect')}. Nếu ${c('commits')} có ít hơn 2 phần tử ⇒ ném ${c('RangeError("need a good and a bad commit")')}.</p>`,
      yeuCau: ['Tìm kiếm nhị phân.', 'Ghi lại commit đã kiểm.', 'Không kiểm hai đầu.'],
      dauVao: 'commits: string[]; isGood: (id) => boolean.', dauRa: '{ firstBad, tested }.',
      rangBuoc: ['Số lần gọi isGood ≈ log2(số commit).'],
      viDu: [{ input: 'bisect(["4104f52","5c1b9b7","439929c","ff92967","7b2e2d1","fcde41d","39b186f"], (id) => ["4104f52","5c1b9b7","439929c"].includes(id))', output: '{ firstBad: "ff92967", tested: ["ff92967", "5c1b9b7", "439929c"] }', explanation: 'Cùng commit xấu như git bisect trong bài; git chọn điểm giữa hơi khác nên ở đó chỉ cần 2 lần.' }],
      goiY: ['let good = 0, bad = commits.length - 1; while (bad - good > 1) { … }', 'const mid = Math.floor((good + bad) / 2); isGood(commits[mid]) ? (good = mid) : (bad = mid);'],
      khoiDau: { 'main.js': `// Bài 10.2 — bisect: tìm commit xấu đầu tiên
function bisect(commits, isGood) {
  for (const id of commits) if (!isGood(id)) return { firstBad: id, tested: commits };
}
` },
      loiGiai: { 'main.js': `// Bài 10.2 — khoảng [good, bad]: good tốt, bad xấu; chia đôi tới khi chúng kề nhau
function bisect(commits, isGood) {
  if (commits.length < 2) throw new RangeError('need a good and a bad commit');
  let good = 0;
  let bad = commits.length - 1;
  const tested = [];
  while (bad - good > 1) {
    const mid = Math.floor((good + bad) / 2);
    tested.push(commits[mid]);
    if (isGood(commits[mid])) good = mid;
    else bad = mid;
  }
  return { firstBad: commits[bad], tested };
}
` },
      giaiThich: `<p>Thử tuần tự (mã khởi đầu) cần tới N lần chạy kiểm; chia đôi cần khoảng log₂N — 1 000 commit chỉ ~10 lần. Điều kiện duy nhất: một khi đã xấu thì các commit sau đều xấu. Đó cũng là lý do mỗi commit nên build và chạy được.</p>`,
      loiHayGap: ['Kiểm cả hai đầu.', 'Vòng lặp vô hạn khi good + 1 === bad.', 'Trả commit tốt cuối thay vì xấu đầu.'],
      thamKhao: 'https://git-scm.com/docs/git-bisect',
      kiem: [
        { moTa: 'The price bug from the lesson|||Lỗi giá trong bài', goi: 'bisect(["4104f52","5c1b9b7","439929c","ff92967","7b2e2d1","fcde41d","39b186f"], (id) => ["4104f52","5c1b9b7","439929c"].includes(id))', mongDoi: { firstBad: 'ff92967', tested: ['ff92967', '5c1b9b7', '439929c'] } },
        { moTa: '1000 commits take about 10 runs|||1000 commit mất khoảng 10 lần', goi: '(() => { const ids = Array.from({ length: 1000 }, (_, i) => "c" + i); const r = bisect(ids, (id) => Number(id.slice(1)) < 637); return [r.firstBad, r.tested.length]; })()', mongDoi: ['c637', 10] },
        { moTa: 'Two commits need no test run|||Hai commit thì không cần chạy kiểm', goi: '[bisect(["a", "b"], () => { throw new Error("should not run"); })]', mongDoi: [{ firstBad: 'b', tested: [] }] },
        { moTa: 'Fewer than two commits throws|||Ít hơn hai commit ném lỗi', goi: 'bisect(["a"], () => true)', mongDoi: { loi: 'RangeError', thongDiep: 'need a good and a bad commit' } },
      ],
    },
    {
      tieuDe: 'trace(): một debugger thu nhỏ',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['hàm bậc cao', 'ghi lời gọi', 'đệ quy'], tienQuyet: ['closure', 'try/finally'], the: ['javascript', 'gỡ lỗi'],
      moTa: `${BAI}<p>Viết ${c('trace(fn, name, log)')} trả hàm bọc ${c('fn')}: mỗi lần gọi, đẩy vào mảng ${c('log')} dòng ${c('"<thụt lề>→ name(arg1, arg2)"')} và khi xong ${c('"<thụt lề>← name = <kết quả>"')}; nếu ném lỗi ${c('"<thụt lề>✖ name threw <tên lỗi>: <thông điệp>"')} rồi NÉM LẠI lỗi đó. Thụt lề là 2 dấu cách × độ sâu lời gọi lồng (lời gọi ngoài cùng sâu 0) — dùng chung một bộ đếm độ sâu cho mọi hàm cùng ${c('log')}. Đối số và kết quả in bằng ${c('JSON.stringify')} (undefined in là ${c('undefined')}). Hàm đệ quy gọi lại qua tên đã được thay bằng bản bọc thì mọi tầng đều được ghi.</p>`,
      yeuCau: ['→ khi vào, ← khi ra, ✖ khi lỗi.', 'Thụt lề theo độ sâu.', 'Ném lại lỗi.', 'Độ sâu chung theo log.'],
      dauVao: 'fn; name: string; log: string[].', dauRa: 'hàm bọc.',
      rangBuoc: ['Độ sâu phải trở về đúng cả khi ném lỗi (try/finally).'],
      viDu: [{ input: 'let fact = (n) => n <= 1 ? 1 : n * fact(n - 1); const log = []; fact = trace(fact, "fact", log); fact(3)', output: 'log: ["→ fact(3)", "  → fact(2)", "    → fact(1)", "    ← fact = 1", "  ← fact = 2", "← fact = 6"]', explanation: 'Thấy được cả chuỗi lời gọi — như Call Stack của DevTools, nhưng cho cả lịch sử.' }],
      goiY: ['const depths = new WeakMap(); — lưu độ sâu theo mảng log', 'try { … return result; } catch (e) { log.push(…✖…); throw e; } finally { depth--; }'],
      khoiDau: { 'main.js': `// Bài 10.2 — trace(): ghi mọi lời gọi
function trace(fn, name, log) {
  return fn;
}
` },
      loiGiai: { 'main.js': `// Bài 10.2 — bọc hàm: ghi khi vào, khi ra, khi lỗi; độ sâu chung cho mọi hàm cùng một log
const depthOf = new WeakMap();
const show = (v) => (v === undefined ? 'undefined' : JSON.stringify(v));

function trace(fn, name, log) {
  return function traced(...args) {
    const depth = depthOf.get(log) ?? 0;
    const pad = '  '.repeat(depth);
    log.push(pad + '→ ' + name + '(' + args.map(show).join(', ') + ')');
    depthOf.set(log, depth + 1);
    try {
      const result = fn.apply(this, args);
      log.push(pad + '← ' + name + ' = ' + show(result));
      return result;
    } catch (e) {
      log.push(pad + '✖ ' + name + ' threw ' + e.name + ': ' + e.message);
      throw e;
    } finally {
      depthOf.set(log, depth);                      // trở về đúng độ sâu, kể cả khi lỗi
    }
  };
}
` },
      giaiThich: `<p>Breakpoint cho bạn MỘT khoảnh khắc; trace cho bạn cả lịch sử lời gọi kèm giá trị — rất hợp với lỗi trong đệ quy hay chuỗi hàm. Đây cũng là cách nhiều thư viện ghi log (middleware, spy trong test) hoạt động: bọc hàm, không sửa hàm.</p>`,
      loiHayGap: ['Quên finally — độ sâu lệch sau lỗi.', 'Nuốt lỗi thay vì ném lại.', 'Độ sâu riêng cho từng hàm — mất thụt lề khi hai hàm gọi nhau.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch#the_finally_block',
      kiem: [
        { moTa: 'Recursion is traced at every level|||Đệ quy được ghi ở mọi tầng', goi: '(() => { const log = []; let fact = (n) => (n <= 1 ? 1 : n * fact(n - 1)); fact = trace(fact, "fact", log); fact(3); return log; })()', mongDoi: ['→ fact(3)', '  → fact(2)', '    → fact(1)', '    ← fact = 1', '  ← fact = 2', '← fact = 6'] },
        { moTa: 'Two functions share one depth|||Hai hàm dùng chung độ sâu', goi: '(() => { const log = []; const fmt = trace((n) => n + " VND", "fmt", log); const total = trace((items) => fmt(items.reduce((s, x) => s + x, 0)), "total", log); total([1, 2]); return log; })()', mongDoi: ['→ total([1,2])', '  → fmt(3)', '  ← fmt = "3 VND"', '← total = "3 VND"'] },
        { moTa: 'Errors are logged and rethrown|||Lỗi được ghi và ném lại', goi: '(() => { const log = []; const label = trace((o) => o.customer.address.city, "label", log); let name = null; try { label({ customer: {} }); } catch (e) { name = e.name; } label({ customer: { address: { city: "Hue" } } }); return [name, log]; })()', mongDoi: ['TypeError', ['→ label({"customer":{}})', "✖ label threw TypeError: Cannot read properties of undefined (reading 'city')", '→ label({"customer":{"address":{"city":"Hue"}}})', '← label = "Hue"']] },
      ],
    },
  ],
});
