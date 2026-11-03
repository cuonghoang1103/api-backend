/** Bộ luyện bài 10.4 — Cách tiếp tục học. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Những thứ tìm thấy khi ĐỌC TÀI LIỆU (sort mặc định so chuỗi, hợp đồng hàm so sánh), một bản ms() tự viết sau khi đọc mã nguồn,
 *  soát một câu hỏi trước khi gửi, che bí mật trong log, và tự động thu nhỏ một ca lỗi (delta debugging). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 10.4 — Cách tiếp tục học.</em> Mỗi bài bắt đầu từ một điều bạn chỉ biết được bằng cách đọc tài liệu, đọc mã nguồn, hay rút gọn một lỗi.</p>';

export default doiDau({
  slug: 'wf-10-4-keep-learning',
  ten: '10.4 Cách tiếp tục học',
  baiHoc: 'Nền tảng Web — Bài 10.4 How to keep learning',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Sắp số cho đúng (sort mặc định so chuỗi), sortBy theo khoá với hàm so sánh đúng hợp đồng, tự viết ms() sau khi đọc mã nguồn thư viện, soát một câu hỏi trước khi gửi, che bí mật trước khi chia sẻ log, và tự động thu nhỏ một ca lỗi — 6 bài.',
  de: [
    {
      tieuDe: 'Sắp số cho đúng',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['sort mặc định', 'hợp đồng hàm so sánh'], tienQuyet: ['sort', 'spread'], the: ['javascript', 'tài liệu'],
      moTa: `${BAI}<p>MDN: không có hàm so sánh, ${c('sort')} đổi phần tử thành chuỗi — ${c('[10, 9, 1].sort()')} ra ${c('[1, 10, 9]')}. Viết ${c('sortNumbers(nums, dir = "asc")')} trả MẢNG MỚI sắp theo giá trị số (${c('"asc"')} hoặc ${c('"desc"')}), KHÔNG sửa mảng gốc. ${c('NaN')} luôn ở cuối (cả hai chiều). Hàm so sánh phải trả số âm/0/dương — không trả boolean.</p>`,
      yeuCau: ['Không sửa mảng gốc.', 'Hai chiều.', 'NaN ở cuối.'],
      dauVao: 'nums: number[]; dir?: "asc" | "desc".', dauRa: 'number[].',
      rangBuoc: ['Không dùng (a, b) => a > b.'],
      viDu: [{ input: 'sortNumbers([10, 9, 1])', output: '[1, 9, 10]', explanation: 'Đúng thứ docs.mjs in ra với a - b.' }],
      goiY: ['[...nums].sort(...) hoặc nums.toSorted(...)', 'Đưa NaN ra cuối trước: if (Number.isNaN(a)) return 1;'],
      khoiDau: { 'main.js': `// Bài 10.4 — sắp số
function sortNumbers(nums, dir = 'asc') {
  return nums.sort((a, b) => a > b);
}
` },
      loiGiai: { 'main.js': `// Bài 10.4 — hàm so sánh trả âm / 0 / dương; sao chép trước vì sort sửa tại chỗ
function sortNumbers(nums, dir = 'asc') {
  const sign = dir === 'desc' ? -1 : 1;
  return [...nums].sort((a, b) => {
    const na = Number.isNaN(a), nb = Number.isNaN(b);
    if (na || nb) return na === nb ? 0 : na ? 1 : -1;   // NaN luôn xuống cuối
    return sign * (a - b);
  });
}
` },
      giaiThich: `<p>Mã khởi đầu có hai lỗi đã gặp ở bài học: hàm so sánh trả boolean (nên ${c('false')} = 0 = "bằng nhau") và ${c('sort')} sửa luôn mảng của người gọi. Cả hai đều viết rõ trong trang MDN.</p>`,
      loiHayGap: ['Trả a > b.', 'Sửa mảng gốc.', 'NaN - x = NaN làm thứ tự hỏng.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
      kiem: [
        { moTa: 'Numbers, not strings|||So số, không so chuỗi', goi: '[sortNumbers([10, 9, 1]), sortNumbers([3, 1, 2], "desc"), sortNumbers([5, 1, 4, 2, 3])]', mongDoi: [[1, 9, 10], [3, 2, 1], [1, 2, 3, 4, 5]] },
        { moTa: 'The original array is untouched|||Mảng gốc không đổi', goi: '(() => { const a = [3, 1, 2]; sortNumbers(a); return a; })()', mongDoi: [3, 1, 2] },
        { moTa: 'NaN goes last both ways|||NaN xuống cuối cả hai chiều', goi: '[sortNumbers([2, NaN, 1]), sortNumbers([2, NaN, 1], "desc")]', mongDoi: [[1, 2, { $js: 'NaN' }], [2, 1, { $js: 'NaN' }]] },
      ],
    },
    {
      tieuDe: 'sortBy theo khoá',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['hàm so sánh', 'localeCompare'], tienQuyet: ['sort'], the: ['javascript', 'tài liệu'],
      moTa: `${BAI}<p>Viết ${c('sortBy(list, key, dir = "asc")')} trả mảng mới sắp theo ${c('item[key]')}: số so bằng hiệu; chuỗi bằng ${c('localeCompare')} (không phân biệt hoa thường: ${c('{ sensitivity: "base" }')}); phần tử có ${c('item[key]')} là ${c('undefined')}/${c('null')} luôn ở cuối. Sắp ỔN ĐỊNH: hai phần tử bằng nhau giữ thứ tự cũ (sort của JavaScript đã ổn định từ ES2019). Dùng nó sửa app ghi chú: ${c('sortBy(notes, "date")')}.</p>`,
      yeuCau: ['Số và chuỗi.', 'Thiếu khoá ở cuối.', 'Ổn định.'],
      dauVao: 'list: object[]; key: string; dir?.', dauRa: 'object[].',
      rangBuoc: ['Không sửa list.'],
      viDu: [{ input: 'sortBy([{ date: "2026-03-01" }, { date: "2026-01-15" }], "date")', output: '[{ date: "2026-01-15" }, { date: "2026-03-01" }]', explanation: 'Ngày dạng YYYY-MM-DD sắp được như chuỗi.' }],
      goiY: ['typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), undefined, { sensitivity: "base" })', 'Thiếu khoá: return 1 / -1 không nhân với chiều.'],
      khoiDau: { 'main.js': `// Bài 10.4 — sortBy
function sortBy(list, key, dir = 'asc') {
  return list.sort((a, b) => a[key] > b[key]);
}
` },
      loiGiai: { 'main.js': `// Bài 10.4 — một hàm so sánh đúng hợp đồng cho số, chuỗi và giá trị thiếu
function sortBy(list, key, dir = 'asc') {
  const sign = dir === 'desc' ? -1 : 1;
  return [...list].sort((x, y) => {
    const a = x[key], b = y[key];
    const ma = a === undefined || a === null, mb = b === undefined || b === null;
    if (ma || mb) return ma === mb ? 0 : ma ? 1 : -1;            // thiếu khoá: luôn cuối, bất kể chiều
    const cmp = typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
    return sign * cmp;
  });
}
` },
      giaiThich: `<p>${c('localeCompare')} trả đúng số âm/0/dương mà ${c('sort')} cần, và xếp "Đà Nẵng" theo cách người Việt đọc thay vì theo mã Unicode. Tính ổn định cho phép sắp nhiều tầng: sắp theo tầng phụ trước, rồi tầng chính.</p>`,
      loiHayGap: ['a[key] > b[key].', 'Đặt phần tử thiếu khoá lên đầu khi desc.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare',
      kiem: [
        { moTa: 'The notes app, fixed|||App ghi chú, đã sửa', goi: 'sortBy([{ id: 1, date: "2026-03-01" }, { id: 2, date: "2026-01-15" }, { id: 3, date: "2026-02-10" }, { id: 4, date: "2026-02-28" }, { id: 5, date: "2026-01-02" }], "date").map((n) => n.id)', mongDoi: [5, 2, 3, 4, 1] },
        { moTa: 'Numbers, case-insensitive strings, desc|||Số, chuỗi không phân biệt hoa, giảm dần', goi: '[sortBy([{ p: 10 }, { p: 9 }, { p: 100 }], "p").map((x) => x.p), sortBy([{ n: "b" }, { n: "A" }, { n: "c" }], "n", "desc").map((x) => x.n)]', mongDoi: [[9, 10, 100], ['c', 'b', 'A']] },
        { moTa: 'Missing keys last; stable ties|||Thiếu khoá ở cuối; hoà giữ thứ tự', goi: 'sortBy([{ id: 1 }, { id: 2, p: 5 }, { id: 3, p: 1 }, { id: 4, p: 5 }, { id: 5, p: null }], "p", "desc").map((x) => x.id)', mongDoi: [2, 4, 3, 1, 5] },
      ],
    },
    {
      tieuDe: 'Tự viết ms() sau khi đọc mã nguồn',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['đọc mã nguồn thư viện', 'regex'], tienQuyet: ['regex', 'switch'], the: ['javascript', 'mã nguồn'],
      moTa: `${BAI}<p>Bài học đọc ${c('parse')} của gói ${c('ms')} (dòng 52). Viết ${c('ms(str)')} theo đúng hợp đồng đó: chuỗi ≤ 100 ký tự khớp ${c('/^((?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i')}; không có đơn vị ⇒ mili giây. Hệ số: s 1 000, m 60 000, h 3 600 000, d 86 400 000, w 7 ngày, y 365,25 ngày. Không khớp hoặc quá dài ⇒ ${c('undefined')}. (Phần đổi số ⇒ chuỗi của gói không cần làm.)</p>`,
      yeuCau: ['Đúng regex của thư viện.', 'Đúng hệ số.', 'Không khớp ⇒ undefined.'],
      dauVao: 'str: string.', dauRa: 'number | undefined.',
      rangBuoc: ['Không phân biệt hoa thường đơn vị.'],
      viDu: [{ input: '[ms("2 days"), ms("1.5h"), ms("two days")]', output: '[172800000, 5400000, undefined]', explanation: 'Đúng output thật trong bài.' }],
      goiY: ['const n = parseFloat(m[1]); const unit = (m[2] || "ms").toLowerCase();', 'Nhóm đơn vị theo chữ cái đầu: unit.startsWith("ms") || unit.startsWith("mil") ⇒ 1; "m" (phút)…'],
      khoiDau: { 'main.js': `// Bài 10.4 — ms("2 days") → 172800000
function ms(str) {
  return parseInt(str) * 1000;
}
` },
      loiGiai: { 'main.js': `// Bài 10.4 — viết lại hợp đồng đã đọc trong node_modules/ms/index.js: một regex + một bảng hệ số
const S = 1000, M = S * 60, H = M * 60, D = H * 24, W = D * 7, Y = D * 365.25;
const RE = /^((?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i;

function unitFactor(unit) {
  if (/^(milliseconds?|msecs?|ms)$/.test(unit)) return 1;
  if (/^(seconds?|secs?|s)$/.test(unit)) return S;
  if (/^(minutes?|mins?|m)$/.test(unit)) return M;
  if (/^(hours?|hrs?|h)$/.test(unit)) return H;
  if (/^(days?|d)$/.test(unit)) return D;
  if (/^(weeks?|w)$/.test(unit)) return W;
  return Y;
}

function ms(str) {
  str = String(str);
  if (str.length > 100) return undefined;
  const m = RE.exec(str);
  if (!m) return undefined;
  return parseFloat(m[1]) * unitFactor((m[2] || 'ms').toLowerCase());
}
` },
      giaiThich: `<p>Không cần đoán "nó có nhận '1.5h' không" — regex trả lời. Đọc mã nguồn cho bạn hợp đồng THẬT (kể cả giới hạn 100 ký tự chống chuỗi khổng lồ), thứ README đôi khi không ghi. Kiểm thử của bạn nên so với chính thư viện khi có thể.</p>`,
      loiHayGap: ['"m" là phút, "ms" là mili giây — thứ tự so khớp quan trọng.', 'parseInt bỏ phần thập phân.'],
      thamKhao: 'https://github.com/vercel/ms',
      kiem: [
        { moTa: 'The values from the lesson|||Các giá trị trong bài', goi: '[ms("2 days"), ms("1.5h"), ms("two days")]', mongDoi: [172800000, 5400000, { $js: 'undefined' }] },
        { moTa: 'Units, case and no unit|||Đơn vị, hoa thường, không đơn vị', goi: '[ms("100"), ms("10s"), ms("5 MIN"), ms("1w"), ms(".5ms"), ms("1y")]', mongDoi: [100, 10000, 300000, 604800000, 0.5, 31557600000] },
        { moTa: 'Rejected inputs|||Đầu vào bị từ chối', goi: '[ms("-1s"), ms("1 fortnight"), ms("1".repeat(101)), ms("")]', mongDoi: [{ $js: 'undefined' }, { $js: 'undefined' }, { $js: 'undefined' }, { $js: 'undefined' }] },
      ],
    },
    {
      tieuDe: 'Soát câu hỏi trước khi gửi',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['ví dụ tái hiện tối thiểu', 'câu hỏi tốt'], tienQuyet: ['object', 'regex'], the: ['javascript', 'học tập'],
      moTa: `${BAI}<p>Viết ${c('questionProblems(q)')} với ${c('q = { title, code, expected, actual, tried, versions }')} (chuỗi; có thể thiếu). Trả mảng vấn đề theo thứ tự: tiêu đề rỗng hoặc dưới 15 ký tự ⇒ ${c('"title too short"')}; tiêu đề chứa ${c('help, urgent, pls, please, not working, doesn\'t work')} (không phân biệt hoa thường) ⇒ ${c('"title should name the problem"')}; thiếu ${c('code')} ⇒ ${c('"add the code"')}; ${c('code')} hơn 30 dòng ⇒ ${c('"shrink the code (N lines)"')}; thiếu ${c('expected')} ⇒ ${c('"say what you expected"')}; thiếu ${c('actual')} ⇒ ${c('"say what happened"')}; ${c('expected === actual')} ⇒ ${c('"expected and actual are the same"')}; thiếu ${c('tried')} ⇒ ${c('"say what you tried"')}; thiếu ${c('versions')} ⇒ ${c('"add versions"')}. "Thiếu" = không có hoặc chỉ khoảng trắng.</p>`,
      yeuCau: ['Đúng thứ tự.', 'Đếm dòng code.'],
      dauVao: 'q: object.', dauRa: 'string[].',
      rangBuoc: ['Không có vấn đề ⇒ [].'],
      viDu: [{ input: 'questionProblems({ title: "sort not working pls help" })', output: '["title should name the problem", "add the code", …]', explanation: 'Câu hỏi khó trả lời nhất.' }],
      goiY: ['const blank = (s) => !s || !String(s).trim();', 'code.split("\\n").length'],
      khoiDau: { 'main.js': `// Bài 10.4 — soát câu hỏi
function questionProblems(q) {
  return q.title ? [] : ['title too short'];
}
` },
      loiGiai: { 'main.js': `// Bài 10.4 — năm phần của một câu hỏi tốt, mỗi phần một phép kiểm
const VAGUE = /\\b(help|urgent|pls|please|not working|doesn't work)\\b/i;
const blank = (s) => !s || !String(s).trim();

function questionProblems(q) {
  const p = [];
  const title = String(q.title ?? '').trim();
  if (title.length < 15) p.push('title too short');
  if (VAGUE.test(title)) p.push('title should name the problem');
  if (blank(q.code)) p.push('add the code');
  else {
    const n = String(q.code).split('\\n').length;
    if (n > 30) p.push('shrink the code (' + n + ' lines)');
  }
  if (blank(q.expected)) p.push('say what you expected');
  if (blank(q.actual)) p.push('say what happened');
  if (!blank(q.expected) && !blank(q.actual) && q.expected.trim() === q.actual.trim()) p.push('expected and actual are the same');
  if (blank(q.tried)) p.push('say what you tried');
  if (blank(q.versions)) p.push('add versions');
  return p;
}
` },
      giaiThich: `<p>Danh sách này là khuôn câu hỏi trong bài, viết thành bộ kiểm. Thường thì điền đủ năm phần là tự thấy lời giải — đặc biệt phần "đã thử gì" và mã dưới 30 dòng.</p>`,
      loiHayGap: ['"Thiếu" không tính chuỗi toàn khoảng trắng.', 'Đếm ký tự thay vì dòng.'],
      thamKhao: 'https://stackoverflow.com/help/how-to-ask',
      kiem: [
        { moTa: 'A complete question|||Câu hỏi đầy đủ', goi: 'questionProblems({ title: "Array.sort with (a, b) => a > b leaves [3, 1, 2] unsorted", code: "console.log([3, 1, 2].sort((a, b) => a > b));", expected: "[1, 2, 3]", actual: "[3, 1, 2]", tried: "Same with dates; works with 2 elements", versions: "Node v22.23.3" })', mongDoi: [] },
        { moTa: 'The worst question|||Câu hỏi tệ nhất', goi: 'questionProblems({ title: "sort not working pls help" })', mongDoi: ['title should name the problem', 'add the code', 'say what you expected', 'say what happened', 'say what you tried', 'add versions'] },
        { moTa: 'Long code, short title, same output|||Mã dài, tiêu đề ngắn, kết quả giống nhau', goi: 'questionProblems({ title: "Bug", code: "x\\n".repeat(40), expected: " 1 ", actual: "1", tried: "x", versions: "   " })', mongDoi: ['title too short', 'shrink the code (41 lines)', 'expected and actual are the same', 'add versions'] },
      ],
    },
    {
      tieuDe: 'Che bí mật trước khi chia sẻ',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['dữ liệu nhạy cảm', 'regex thay thế'], tienQuyet: ['replace', 'regex'], the: ['javascript', 'bảo mật'],
      moTa: `${BAI}<p>Viết ${c('redact(text)')} che bí mật trong log/cấu hình trước khi dán vào câu hỏi: (1) cặp ${c('<tên>=<giá trị>')} hoặc ${c('<tên>: <giá trị>')} với tên (không phân biệt hoa thường) chứa ${c('password, passwd, secret, token, apikey, api_key')} ⇒ giá trị thành ${c('***')} (giá trị = mọi ký tự tới khoảng trắng, dấu phẩy, ${c('&')} hoặc hết dòng; giữ dấu nháy nếu có); (2) mật khẩu trong URL ${c('scheme://user:pass@host')} ⇒ ${c('scheme://user:***@host')}; (3) ${c('Bearer <token>')} ⇒ ${c('Bearer ***')}. Trả ${c('{ text, count }')} — count là số chỗ đã che.</p>`,
      yeuCau: ['Ba loại bí mật.', 'Giữ phần còn lại nguyên vẹn.', 'Đếm số chỗ che.'],
      dauVao: 'text: string.', dauRa: '{ text, count }.',
      rangBuoc: ['Không che cả dòng — người đọc vẫn cần thấy cấu trúc.'],
      viDu: [{ input: 'redact("DATABASE_URL=postgres://lan:hunter2@db.local/app")', output: '{ text: "DATABASE_URL=postgres://lan:***@db.local/app", count: 1 }', explanation: 'Tên DATABASE_URL không phải bí mật — mật khẩu bên trong URL mới là.' }],
      goiY: ['/\\b([\\w.-]*(?:password|passwd|secret|token|api_?key)[\\w.-]*)("?\\s*[:=]\\s*)("?)([^\\s,&"]+)\\3/gi', '/(\\w+:\\/\\/[^:\\/\\s@]+:)[^@\\s]+@/g và /\\bBearer\\s+[\\w.~+\\/-]+=*/g'],
      khoiDau: { 'main.js': `// Bài 10.4 — che bí mật
function redact(text) {
  return { text, count: 0 };
}
` },
      loiGiai: { 'main.js': `// Bài 10.4 — ba mẫu bí mật hay lọt vào câu hỏi; đếm mỗi lần thay
function redact(text) {
  let count = 0;
  const hit = (s) => { count++; return s; };
  let out = String(text);
  out = out.replace(/(\\w+:\\/\\/[^:\\/\\s@]+:)[^@\\s]+@/g, (_, head) => hit(head + '***@'));
  out = out.replace(/\\bBearer\\s+[\\w.~+\\/-]+=*/g, () => hit('Bearer ***'));
  out = out.replace(/\\b([\\w.-]*(?:password|passwd|secret|token|api_?key)[\\w.-]*)("?\\s*[:=]\\s*)("?)([^\\s,&"]+)\\3/gi,
    (all, name, sep, q, value) => (value === '***' ? all : hit(name + sep + q + '***' + q)));
  return { text: out, count };
}
` },
      giaiThich: `<p>Bài học nói: log và tệp cấu hình mang theo khoá, token, mật khẩu trong URL; diễn đàn và trợ lý chat giữ mọi thứ bạn dán. Che có cấu trúc (giữ tên, chỉ che giá trị) để câu hỏi vẫn có ích. Đây là phiên bản thu nhỏ của bộ quét bí mật mà kho mã này chạy trước mỗi commit.</p>`,
      loiHayGap: ['Che cả DATABASE_URL — mất thông tin host/db.', 'Che hai lần cùng một chỗ.', 'Bỏ sót dạng "token": "…" có nháy.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude',
      kiem: [
        { moTa: 'Password inside a database URL|||Mật khẩu trong URL CSDL', goi: 'redact("DATABASE_URL=postgres://lan:hunter2@db.local/app")', mongDoi: { text: 'DATABASE_URL=postgres://lan:***@db.local/app', count: 1 } },
        { moTa: 'key=value, quoted JSON and Bearer|||khoá=giá trị, JSON có nháy và Bearer', goi: 'redact("login password=hunter2 user=lan\\n{\\"apiKey\\": \\"abc123\\", \\"page\\": 2}\\nAuthorization: Bearer xyz.789")', mongDoi: { text: 'login password=*** user=lan\n{"apiKey": "***", "page": 2}\nAuthorization: Bearer ***', count: 3 } },
        { moTa: 'Nothing to hide; query strings|||Không có gì để che; chuỗi truy vấn', goi: '[redact("GET /api/notes 200"), redact("/reset?token=t0k3n&lang=vi")]', mongDoi: [{ text: 'GET /api/notes 200', count: 0 }, { text: '/reset?token=***&lang=vi', count: 1 }] },
      ],
    },
    {
      tieuDe: 'Tự động thu nhỏ một ca lỗi',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['delta debugging', 'ví dụ tái hiện tối thiểu'], tienQuyet: ['vòng lặp', 'slice'], the: ['javascript', 'gỡ lỗi'],
      moTa: `${BAI}<p>Bước 3 của bài làm bằng tay; giờ tự động hoá. Viết ${c('shrink(items, stillFails)')}: ${c('items')} là mảng (dòng mã, phần tử dữ liệu…), ${c('stillFails(subset)')} trả ${c('true')} nếu lỗi còn. Lặp: thử bỏ từng KHỐI liên tiếp, bắt đầu với khối bằng nửa mảng rồi giảm một nửa mỗi vòng tới khối 1 phần tử; mỗi lần bỏ mà lỗi vẫn còn thì giữ việc bỏ đó và thử tiếp ở cùng cỡ khối. Kết thúc khi bỏ bất kỳ MỘT phần tử nào cũng làm lỗi biến mất. Trả ${c('{ result, tests }')} — mảng nhỏ nhất (giữ thứ tự gốc) và số lần gọi ${c('stillFails')}. Nếu ${c('stillFails(items)')} ngay từ đầu là false ⇒ ném ${c('Error("the full input does not fail")')}.</p>`,
      yeuCau: ['Bỏ theo khối giảm dần.', 'Kết quả 1-tối thiểu.', 'Giữ thứ tự.', 'Đếm số lần kiểm.'],
      dauVao: 'items: any[]; stillFails: (subset) => boolean.', dauRa: '{ result, tests }.',
      rangBuoc: ['Lần gọi đầu kiểm cả mảng cũng tính vào tests.'],
      viDu: [{ input: 'shrink([5, 1, 4, 2, 3], (a) => a.length > 1 && a.join() === [...a].sort((x, y) => x > y).join() && a.join() !== [...a].sort((x, y) => x - y).join())', output: '{ result: [2, 1] hoặc tương tự, tests: … }', explanation: 'Thu năm số về ca nhỏ nhất vẫn làm lộ hàm so sánh boolean.' }],
      goiY: ['let size = Math.floor(items.length / 2); while (size >= 1) { let i = 0; while (i < cur.length) { const cand = [...cur.slice(0, i), ...cur.slice(i + size)]; … } size = Math.floor(size / 2); }', 'Bỏ thành công thì KHÔNG tăng i (phần tử mới đã trượt vào vị trí i).'],
      khoiDau: { 'main.js': `// Bài 10.4 — tự động thu nhỏ
function shrink(items, stillFails) {
  return { result: items, tests: 0 };
}
` },
      loiGiai: { 'main.js': `// Bài 10.4 — bỏ khối lớn trước (nhanh), khối nhỏ sau (chính xác); giữ mọi lần bỏ mà lỗi vẫn còn
function shrink(items, stillFails) {
  let tests = 0;
  const fails = (a) => { tests++; return stillFails(a); };
  if (!fails(items)) throw new Error('the full input does not fail');
  let cur = [...items];
  for (let size = Math.max(1, Math.floor(cur.length / 2)); size >= 1; size = Math.floor(size / 2)) {
    let i = 0;
    while (i < cur.length) {
      const cand = [...cur.slice(0, i), ...cur.slice(i + size)];
      if (cand.length < cur.length && fails(cand)) cur = cand;     // vẫn lỗi ⇒ giữ bản nhỏ hơn, thử lại tại i
      else i += size;
    }
  }
  return { result: cur, tests };
}
` },
      giaiThich: `<p>Đây là ý tưởng của "delta debugging" và của bộ thu nhỏ trong các thư viện kiểm thử dựa trên thuộc tính: máy làm đúng việc bạn làm ở Bước 3 — bỏ một phần, xem lỗi còn không — chỉ nhanh và kiên nhẫn hơn. Vòng cuối với khối 1 phần tử bảo đảm không bỏ thêm được phần tử nào.</p>`,
      loiHayGap: ['Tăng i sau khi bỏ thành công — bỏ sót phần tử.', 'Không đếm lần kiểm đầu.', 'Dừng sau một vòng.'],
      thamKhao: 'https://www.debuggingbook.org/html/DeltaDebugger.html',
      kiem: [
        { moTa: 'Shrinks to the two culprits|||Thu về đúng hai thủ phạm', goi: 'shrink(["a", "b", "c", "d", "e", "f", "g", "h"], (s) => s.includes("c") && s.includes("f")).result', mongDoi: ['c', 'f'] },
        { moTa: 'One culprit; few tests|||Một thủ phạm; ít lần kiểm', goi: '(() => { const items = Array.from({ length: 64 }, (_, i) => i); const r = shrink(items, (s) => s.includes(37)); return [r.result, r.tests <= 20]; })()', mongDoi: [[37], true] },
        { moTa: 'The boolean comparator bug|||Lỗi hàm so sánh boolean', goi: 'shrink([5, 1, 4, 2, 3], (a) => a.join() !== [...a].sort((x, y) => x - y).join() && a.join() === [...a].sort((x, y) => x > y).join()).result.length', mongDoi: 2 },
        { moTa: 'Input that does not fail|||Đầu vào không lỗi', goi: 'shrink([1, 2], () => false)', mongDoi: { loi: 'Error', thongDiep: 'does not fail' } },
      ],
    },
  ],
});
