/** Bộ luyện bài 6.4 — Header, JSON và phần thân. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Đọc header không phân biệt hoa thường, tách Content-Type, parse JSON an toàn, đọc Cache-Control, hồi sinh ngày giờ,
 *  thương lượng nội dung (Accept + q), và GET có điều kiện (ETag → 304). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 6.4 — Header và JSON.</em> Mỗi bài là một việc nhỏ mà máy chủ hoặc trình duyệt làm với header và phần thân của mọi thông điệp.</p>';

export default doiDau({
  slug: 'wf-6-4-headers-json',
  ten: '6.4 Header, JSON và phần thân',
  baiHoc: 'Nền tảng Web — Bài 6.4 Headers, JSON and the message body',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Tra header không phân biệt hoa thường, tách Content-Type và charset, parse JSON không ném lỗi, đọc Cache-Control, hồi sinh chuỗi ngày giờ thành Date, chọn định dạng theo Accept có trọng số q, và trả 304 theo ETag/If-None-Match — 7 bài.',
  de: [
    {
      tieuDe: 'Tra một header',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['header không phân biệt hoa thường'], tienQuyet: ['Object.keys', 'toLowerCase'], the: ['javascript', 'http', 'header'],
      moTa: `${BAI}<p>Viết ${c('getHeader(headers, name)')}: ${c('headers')} là một object mà tên có thể viết hoa thường lộn xộn (${c('{ "Content-Type": … }')} hay ${c('{ "content-type": … }')}). Trả giá trị của header ${c('name')} bất kể hoa thường; không có ⇒ ${c('null')}.</p>`,
      yeuCau: ['So tên không phân biệt hoa thường.', 'Không có ⇒ null (không phải undefined).'],
      dauVao: 'headers: object; name: string.', dauRa: 'string hoặc null.',
      rangBuoc: ['Không sửa object vào.'],
      viDu: [{ input: 'getHeader({ "Content-Type": "text/csv" }, "content-type")', output: '"text/csv"', explanation: 'Content-Type và content-type là một header.' }],
      goiY: ['const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());', 'return key === undefined ? null : headers[key];'],
      khoiDau: { 'main.js': `// Bài 6.4 — tra một header
function getHeader(headers, name) {
  return headers[name];
}
` },
      loiGiai: { 'main.js': `// Bài 6.4 — tên header không phân biệt hoa thường (HTTP/2 còn luôn gửi chữ thường),
// nên tra theo tên đã chuẩn hoá chứ không tra thẳng headers[name].
function getHeader(headers, name) {
  const wanted = name.toLowerCase();
  const key = Object.keys(headers).find((k) => k.toLowerCase() === wanted);
  return key === undefined ? null : headers[key];
}
` },
      giaiThich: `<p>Đó là việc ${c('res.headers.get()')} của fetch và ${c('req.get()')} của Express làm giúp bạn. Khi nhận header dưới dạng object thường (log, mock), tra thẳng ${c('headers["Content-Type"]')} sẽ trượt với ${c('content-type')}.</p>`,
      loiHayGap: ['headers[name] — trượt khi khác hoa thường.', 'Trả undefined thay vì null.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Headers/get',
      kiem: [
        { moTa: 'Any case matches|||Hoa thường nào cũng khớp', goi: '[getHeader({ "Content-Type": "text/csv" }, "content-type"), getHeader({ etag: "\\"abc\\"" }, "ETag")]', mongDoi: ['text/csv', '"abc"'] },
        { moTa: 'Missing header is null|||Header vắng là null', goi: 'getHeader({ Accept: "*/*" }, "Authorization")', mongDoi: null },
        { moTa: 'Empty value is still a value|||Giá trị rỗng vẫn là giá trị', goi: 'getHeader({ "X-Empty": "" }, "x-empty")', mongDoi: '' },
      ],
    },
    {
      tieuDe: 'Tách Content-Type',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['media type', 'tham số charset'], tienQuyet: ['split', 'trim'], the: ['javascript', 'http', 'header'],
      moTa: `${BAI}<p>Viết ${c('parseContentType(value)')} cho giá trị như ${c('"application/json; charset=utf-8"')}. Trả ${c('{ type, charset }')}: ${c('type')} viết thường, đã trim; ${c('charset')} viết thường, bỏ nháy nếu có, ${c('null')} nếu không có. ${c('value')} rỗng hoặc vắng ⇒ ${c('{ type: null, charset: null }')}.</p>`,
      yeuCau: ['type thường, trim.', 'charset thường, bỏ nháy, null nếu vắng.', 'Tên tham số không phân biệt hoa thường (Charset=…).'],
      dauVao: 'value: string | undefined.', dauRa: '{ type, charset }.',
      rangBuoc: ['Bỏ qua các tham số khác (boundary…).'],
      viDu: [{ input: 'parseContentType("Application/JSON; Charset=\\"UTF-8\\"")', output: '{ type: "application/json", charset: "utf-8" }', explanation: 'Mọi thứ về chữ thường, nháy bị bỏ.' }],
      goiY: ['const [type, ...params] = value.split(";");', 'for (const p of params) { const [k, v] = p.split("="); if (k.trim().toLowerCase() === "charset") … }'],
      khoiDau: { 'main.js': `// Bài 6.4 — tách Content-Type
function parseContentType(value) {
  return { type: value, charset: null };
}
` },
      loiGiai: { 'main.js': `// Bài 6.4 — Content-Type = media type + tham số (charset, boundary, ...)
function parseContentType(value) {
  if (!value || !value.trim()) return { type: null, charset: null };
  const [type, ...params] = value.split(';');
  let charset = null;
  for (const p of params) {
    const i = p.indexOf('=');
    if (i < 0) continue;
    if (p.slice(0, i).trim().toLowerCase() === 'charset') {
      charset = p.slice(i + 1).trim().replace(/^"(.*)"$/, '$1').toLowerCase();
    }
  }
  return { type: type.trim().toLowerCase(), charset };
}
` },
      giaiThich: `<p>So ${c('Content-Type === "application/json"')} là lỗi kinh điển: máy chủ thật gửi ${c('application/json; charset=utf-8')}. Tách media type ra rồi mới so; ${c('charset')} cho biết cách đổi byte thành chữ (thiếu nó, tiếng Việt có thể hiện thành ký tự rác).</p>`,
      loiHayGap: ['So cả chuỗi — "; charset=utf-8" làm trượt.', 'Quên bỏ nháy "UTF-8".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type',
      kiem: [
        { moTa: 'JSON with charset|||JSON có charset', goi: 'parseContentType("application/json; charset=utf-8")', mongDoi: { type: 'application/json', charset: 'utf-8' } },
        { moTa: 'Case, quotes and other params|||Hoa thường, nháy và tham số khác', goi: '[parseContentType("Text/HTML; Charset=\\"UTF-8\\""), parseContentType("multipart/form-data; boundary=----x")]', mongDoi: [{ type: 'text/html', charset: 'utf-8' }, { type: 'multipart/form-data', charset: null }] },
        { moTa: 'Empty or missing|||Rỗng hoặc vắng', goi: '[parseContentType(""), parseContentType(undefined), parseContentType("text/csv")]', mongDoi: [{ type: null, charset: null }, { type: null, charset: null }, { type: 'text/csv', charset: null }] },
      ],
    },
    {
      tieuDe: 'Parse JSON không ném lỗi',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['JSON.parse', 'try/catch', 'kết quả có nhãn'], tienQuyet: ['try/catch'], the: ['javascript', 'json'],
      moTa: `${BAI}<p>Viết ${c('safeJsonParse(text)')} trả ${c('{ ok: true, value }')} khi ${c('text')} là JSON hợp lệ, hoặc ${c('{ ok: false, reason }')} khi không: ${c('reason')} là ${c('"html"')} nếu chữ (sau khi bỏ khoảng trắng đầu) bắt đầu bằng ${c('<')} — tức là bạn nhận một trang HTML — và ${c('"syntax"')} cho mọi lỗi cú pháp khác. Chuỗi rỗng là ${c('"syntax"')}.</p>`,
      yeuCau: ['Không bao giờ ném.', 'Phân biệt trang HTML với JSON sai cú pháp.', 'Giá trị JSON nguyên thuỷ (5, "x", null) vẫn hợp lệ.'],
      dauVao: 'text: string.', dauRa: '{ ok, value } | { ok, reason }.',
      rangBuoc: ['Không dùng regex để "đoán" JSON hợp lệ — để JSON.parse quyết định.'],
      viDu: [{ input: 'safeJsonParse("<!doctype html><h1>502</h1>")', output: '{ ok: false, reason: "html" }', explanation: 'Thông điệp "Unexpected token \'<\'" trong bài.' }],
      goiY: ['try { return { ok: true, value: JSON.parse(text) }; } catch { … }', 'text.trimStart().startsWith("<")'],
      khoiDau: { 'main.js': `// Bài 6.4 — parse JSON không ném lỗi
function safeJsonParse(text) {
  return { ok: true, value: JSON.parse(text) };
}
` },
      loiGiai: { 'main.js': `// Bài 6.4 — không ném; nói rõ VÌ SAO hỏng (HTML hay cú pháp)
function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    const html = text.trimStart().startsWith('<');           // proxy/dev server trả trang lỗi HTML
    return { ok: false, reason: html ? 'html' : 'syntax' };
  }
}
` },
      giaiThich: `<p>Khi ${c('reason === "html"')}, vấn đề không nằm ở JSON mà ở chỗ máy chủ đã không trả JSON (sai URL, API sập, bị chuyển tới trang đăng nhập) — đi xem status và Network tab. Kết quả có nhãn ${c('ok')} buộc người gọi xử lý cả hai nhánh.</p>`,
      loiHayGap: ['Trả null khi lỗi — không phân biệt được với JSON "null" hợp lệ.', 'Ném lại lỗi ra ngoài.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/JSON_bad_parse',
      kiem: [
        { moTa: 'Valid JSON, including primitives and null|||JSON hợp lệ, kể cả nguyên thuỷ và null', goi: '[safeJsonParse(\'{"id":1}\'), safeJsonParse("5"), safeJsonParse("null")]', mongDoi: [{ ok: true, value: { id: 1 } }, { ok: true, value: 5 }, { ok: true, value: null }] },
        { moTa: 'HTML page is reported as html|||Trang HTML được báo là html', goi: '[safeJsonParse("<!doctype html><h1>502 Bad Gateway</h1>"), safeJsonParse("\\n  <html>")]', mongDoi: [{ ok: false, reason: 'html' }, { ok: false, reason: 'html' }] },
        { moTa: 'JS-style objects are syntax errors|||Object kiểu JS là lỗi cú pháp', goi: '["{\'name\': \'Pen\'}", "{name: 1}", \'{"a":1,}\', ""].map(safeJsonParse)', mongDoi: [{ ok: false, reason: 'syntax' }, { ok: false, reason: 'syntax' }, { ok: false, reason: 'syntax' }, { ok: false, reason: 'syntax' }] },
      ],
    },
    {
      tieuDe: 'Đọc Cache-Control',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['Cache-Control', 'chỉ thị'], tienQuyet: ['split', 'Number'], the: ['javascript', 'http', 'cache'],
      moTa: `${BAI}<p>Viết ${c('parseCacheControl(value)')} biến ${c('"public, max-age=600, no-cache"')} thành ${c('{ public: true, "max-age": 600, "no-cache": true }')}. Tên chỉ thị viết thường, trim; chỉ thị không có ${c('=')} ⇒ ${c('true')}; giá trị là số nguyên ⇒ number, giá trị trong nháy ⇒ bỏ nháy, còn lại giữ chuỗi. Rỗng/vắng ⇒ ${c('{}')}. Phần tử rỗng (dấu phẩy thừa) bị bỏ.</p>`,
      yeuCau: ['Tách theo dấu phẩy.', 'Cờ ⇒ true; số ⇒ number.', 'Tên thường.'],
      dauVao: 'value: string | undefined.', dauRa: 'object.',
      rangBuoc: ['Không cần xử lý dấu phẩy nằm trong nháy.'],
      viDu: [{ input: 'parseCacheControl("public, max-age=31536000, immutable")', output: '{ public: true, "max-age": 31536000, immutable: true }', explanation: 'Header cho tệp có mã băm trong tên (Bài 14.1).' }],
      goiY: ['for (const part of value.split(",")) { const p = part.trim(); if (!p) continue; … }', '/^\\d+$/.test(v) ? Number(v) : v.replace(/^"(.*)"$/, "$1")'],
      khoiDau: { 'main.js': `// Bài 6.4 — đọc Cache-Control
function parseCacheControl(value) {
  return {};
}
` },
      loiGiai: { 'main.js': `// Bài 6.4 — Cache-Control là danh sách chỉ thị, cách nhau bởi dấu phẩy
function parseCacheControl(value) {
  const out = {};
  for (const part of (value ?? '').split(',')) {
    const p = part.trim();
    if (!p) continue;                                       // dấu phẩy thừa
    const i = p.indexOf('=');
    if (i < 0) { out[p.toLowerCase()] = true; continue; }   // cờ: no-store, immutable
    const name = p.slice(0, i).trim().toLowerCase();
    const v = p.slice(i + 1).trim();
    out[name] = /^\\d+$/.test(v) ? Number(v) : v.replace(/^"(.*)"$/, '$1');
  }
  return out;
}
` },
      giaiThich: `<p>Đọc được header này là đọc được câu trả lời cho "vì sao trang vẫn hiện dữ liệu cũ": ${c('max-age')} cho phép dùng lại không hỏi, ${c('no-cache')} bắt hỏi lại mỗi lần, ${c('no-store')} cấm giữ.</p>`,
      loiHayGap: ['Giữ "600" là chuỗi — so sánh max-age > 60 sai kiểu.', 'Không trim — " max-age" thành tên khác.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control',
      kiem: [
        { moTa: 'Flags and numbers|||Cờ và số', goi: 'parseCacheControl("public, max-age=31536000, immutable")', mongDoi: { public: true, 'max-age': 31536000, immutable: true } },
        { moTa: 'Case, spaces, quotes, extra commas|||Hoa thường, khoảng trắng, nháy, phẩy thừa', goi: 'parseCacheControl(" No-Cache ,, private=\\"set-cookie\\", MAX-AGE = 0 ,")', mongDoi: { 'no-cache': true, private: 'set-cookie', 'max-age': 0 } },
        { moTa: 'Empty or missing|||Rỗng hoặc vắng', goi: '[parseCacheControl(""), parseCacheControl(undefined)]', mongDoi: [{}, {}] },
      ],
    },
    {
      tieuDe: 'Hồi sinh ngày giờ từ JSON',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['JSON.parse reviver', 'ISO 8601'], tienQuyet: ['regex', 'Date'], the: ['javascript', 'json'],
      moTa: `${BAI}<p>JSON biến ${c('Date')} thành chuỗi ISO, và parse xong nó VẪN là chuỗi. Viết ${c('parseWithDates(text)')} dùng tham số thứ hai (reviver) của ${c('JSON.parse')}: mọi giá trị CHUỖI có dạng ISO đầy đủ ${c('YYYY-MM-DDTHH:mm:ss(.sss)Z')} (giờ UTC, có chữ ${c('Z')}) trở thành ${c('Date')}, ở bất kỳ độ sâu nào; chuỗi khác giữ nguyên (kể cả ${c('"2026-11-02"')} chỉ có ngày).</p>`,
      yeuCau: ['Dùng reviver của JSON.parse.', 'Chỉ chuỗi ISO có giờ và Z.', 'Mọi độ sâu, cả trong mảng.'],
      dauVao: 'text: string (JSON hợp lệ).', dauRa: 'giá trị đã parse.',
      rangBuoc: ['Không duyệt object bằng tay — reviver đã duyệt giúp.'],
      viDu: [{ input: 'parseWithDates(\'{"createdAt":"2026-11-02T09:30:00.000Z"}\').createdAt instanceof Date', output: 'true', explanation: 'Ngược với output trong bài: typeof … là "string".' }],
      goiY: ['JSON.parse(text, (key, value) => …)', 'const ISO = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{1,3})?Z$/;'],
      khoiDau: { 'main.js': `// Bài 6.4 — hồi sinh ngày giờ
function parseWithDates(text) {
  return JSON.parse(text);
}
` },
      loiGiai: { 'main.js': `// Bài 6.4 — reviver được gọi cho MỌI giá trị, từ trong ra ngoài
const ISO = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{1,3})?Z$/;
function parseWithDates(text) {
  return JSON.parse(text, (key, value) =>
    typeof value === 'string' && ISO.test(value) ? new Date(value) : value);
}
` },
      giaiThich: `<p>Không hồi sinh thì ${c('order.createdAt.getFullYear()')} ném TypeError vì đó là chuỗi. Nhiều dự án làm việc này một lần ở hàm gọi API thay vì rải ${c('new Date(…)')} khắp component. Giữ nguyên chuỗi chỉ-ngày là cố ý: ${c('new Date("2026-11-02")')} hiểu là nửa đêm UTC, dễ lệch một ngày ở múi giờ Việt Nam.</p>`,
      loiHayGap: ['Biến mọi chuỗi chứa "-" thành Date.', 'Quên rằng mảng cũng được duyệt.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#using_the_reviver_parameter',
      kiem: [
        { moTa: 'ISO strings become Date|||Chuỗi ISO thành Date', goi: 'parseWithDates(\'{"id":7,"createdAt":"2026-11-02T09:30:00.000Z"}\')', mongDoi: { id: 7, createdAt: { $js: 'Date', iso: '2026-11-02T09:30:00.000Z' } } },
        { moTa: 'Nested and inside arrays|||Lồng nhau và trong mảng', goi: 'parseWithDates(\'{"log":[{"at":"2026-01-01T00:00:00Z"},{"at":"oops"}]}\').log.map((x) => x.at instanceof Date)', mongDoi: [true, false] },
        { moTa: 'Other strings stay strings|||Chuỗi khác giữ nguyên', goi: 'parseWithDates(\'["2026-11-02","2026-11-02T09:30:00","hello",5]\')', mongDoi: ['2026-11-02', '2026-11-02T09:30:00', 'hello', 5] },
      ],
    },
    {
      tieuDe: 'Thương lượng nội dung (Accept)',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['Accept', 'trọng số q', 'ký tự đại diện'], tienQuyet: ['split', 'sort', 'parseFloat'], the: ['javascript', 'http', 'header'],
      moTa: `${BAI}<p>Viết ${c('negotiate(accept, available)')}: ${c('available')} là mảng định dạng máy chủ có, theo thứ tự ưu tiên của máy chủ. ${c('accept')} như ${c('"text/csv, application/json;q=0.8, */*;q=0.1"')}. Mỗi mục có trọng số ${c('q')} (mặc định 1; ${c('q=0')} nghĩa là "không nhận"). Mỗi định dạng có sẵn lấy q của mục khớp CỤ THỂ NHẤT: ${c('type/sub')} chính xác > ${c('type/*')} > ${c('*/*')}. Trả định dạng có q lớn nhất (> 0); bằng nhau ⇒ cái đứng trước trong ${c('available')}. Không khớp gì ⇒ ${c('null')} (máy chủ sẽ trả 406). ${c('accept')} rỗng/vắng ⇒ phần tử đầu của ${c('available')}.</p>`,
      yeuCau: ['Đọc q (mặc định 1).', 'Khớp cụ thể nhất thắng, kể cả khi q của nó thấp hơn.', 'q=0 loại bỏ.', 'Hoà ⇒ theo thứ tự available.'],
      dauVao: 'accept: string | undefined; available: string[].', dauRa: 'string hoặc null.',
      rangBuoc: ['Không phân biệt hoa thường khi so định dạng; trả đúng chuỗi trong available.'],
      viDu: [{ input: 'negotiate("text/csv", ["application/json", "text/csv"])', output: '"text/csv"', explanation: 'Như curl -H "Accept: text/csv" trong bài.' }, { input: 'negotiate("image/*", ["application/json"])', output: 'null', explanation: '406 Not Acceptable.' }],
      goiY: ['Mỗi mục: const [range, ...params] = part.split(";"); q = parseFloat(param "q=") hoặc 1.', 'Độ cụ thể: range === type ? 3 : range === major + "/*" ? 2 : range === "*/*" ? 1 : 0.'],
      khoiDau: { 'main.js': `// Bài 6.4 — thương lượng nội dung
function negotiate(accept, available) {
  return available.find((t) => accept.includes(t)) ?? null;
}
` },
      loiGiai: { 'main.js': `// Bài 6.4 — Accept: client nói thích gì (kèm q), máy chủ chọn cái tốt nhất mình có
function negotiate(accept, available) {
  if (!accept || !accept.trim()) return available[0] ?? null;
  const ranges = accept.split(',').map((part) => {
    const [range, ...params] = part.split(';').map((s) => s.trim().toLowerCase());
    const qParam = params.find((p) => p.startsWith('q='));
    return { range, q: qParam ? parseFloat(qParam.slice(2)) : 1 };
  }).filter((r) => r.range);
  let best = null;
  let bestQ = 0;
  for (const type of available) {
    const t = type.toLowerCase();
    const major = t.split('/')[0];
    let spec = 0;
    let q = 0;
    for (const r of ranges) {
      const s = r.range === t ? 3 : r.range === major + '/*' ? 2 : r.range === '*/*' ? 1 : 0;
      if (s > spec) { spec = s; q = r.q; }                  // mục cụ thể nhất quyết định q
    }
    if (q > bestQ) { best = type; bestQ = q; }              // ">" giữ cái đứng trước khi hoà
  }
  return best;
}
` },
      giaiThich: `<p>Trình duyệt gửi Accept kiểu ${c('text/html,application/xhtml+xml,…,*/*;q=0.8')}; fetch gửi ${c('*/*')}. "Cụ thể nhất thắng" nghĩa là ${c('text/csv;q=0, */*')} vẫn từ chối CSV dù ${c('*/*')} có q=1. Express gói việc này trong ${c('res.format()')} và ${c('req.accepts()')}.</p>`,
      loiHayGap: ['Dùng includes trên chuỗi Accept — bỏ qua q và */*.', 'Lấy q lớn nhất trong mọi mục khớp thay vì mục cụ thể nhất.', 'Coi q=0 là "ưu tiên thấp" thay vì "không nhận".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation',
      kiem: [
        { moTa: 'Exact match and default|||Khớp chính xác và mặc định', goi: '[negotiate("text/csv", ["application/json", "text/csv"]), negotiate("", ["application/json", "text/csv"]), negotiate(undefined, ["text/csv"])]', mongDoi: ['text/csv', 'application/json', 'text/csv'] },
        { moTa: 'Weights decide|||Trọng số quyết định', goi: '[negotiate("text/csv;q=0.5, application/json", ["text/csv", "application/json"]), negotiate("text/csv, application/json;q=0.8", ["application/json", "text/csv"])]', mongDoi: ['application/json', 'text/csv'] },
        { moTa: 'Wildcards; ties keep server order|||Ký tự đại diện; hoà thì theo thứ tự máy chủ', goi: '[negotiate("*/*", ["application/json", "text/csv"]), negotiate("text/*", ["application/json", "text/csv", "text/html"])]', mongDoi: ['application/json', 'text/csv'] },
        { moTa: 'Most specific wins, q=0 refuses, nothing gives null|||Cụ thể nhất thắng, q=0 từ chối, không khớp trả null', goi: '[negotiate("text/csv;q=0, */*", ["text/csv", "application/json"]), negotiate("image/*", ["application/json"]), negotiate("Application/JSON", ["application/json"])]', mongDoi: ['application/json', null, 'application/json'] },
      ],
    },
    {
      tieuDe: 'GET có điều kiện: ETag → 304',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['ETag', 'If-None-Match', '304', 'ETag yếu'], tienQuyet: ['split', 'object'], the: ['javascript', 'http', 'cache'],
      moTa: `${BAI}<p>Viết ${c('conditionalGet(reqHeaders, etag, data)')} như máy chủ của bài: ${c('reqHeaders')} là object header của request (tên CÓ THỂ hoa thường lộn xộn), ${c('etag')} là ETag hiện tại (có nháy, vd ${c('"8c508e8ba06f"')}). Nếu ${c('If-None-Match')} khớp ⇒ ${c('{ status: 304, headers: { ETag: etag }, body: null }')}. Ngược lại ⇒ ${c('{ status: 200, headers: { ETag: etag, "Cache-Control": "no-cache" }, body: data }')}. "Khớp" là: giá trị là ${c('*')}, hoặc một trong danh sách cách nhau bởi dấu phẩy bằng ${c('etag')} sau khi bỏ tiền tố yếu ${c('W/')} ở CẢ HAI phía.</p>`,
      yeuCau: ['Tên header không phân biệt hoa thường.', 'Danh sách nhiều ETag.', 'W/ được bỏ khi so (so sánh yếu).', '* luôn khớp.'],
      dauVao: 'reqHeaders: object; etag: string; data: any.', dauRa: '{ status, headers, body }.',
      rangBuoc: ['304 không có phần thân.'],
      viDu: [{ input: 'conditionalGet({ "If-None-Match": "\\"a1\\"" }, "\\"a1\\"", {…})', output: '{ status: 304, headers: { ETag: "\\"a1\\"" }, body: null }', explanation: 'Client đã có đúng phiên bản này.' }],
      goiY: ['const key = Object.keys(reqHeaders).find((k) => k.toLowerCase() === "if-none-match");', 'const strip = (t) => t.trim().replace(/^W\\//, "");'],
      khoiDau: { 'main.js': `// Bài 6.4 — GET có điều kiện
function conditionalGet(reqHeaders, etag, data) {
  if (reqHeaders['If-None-Match'] === etag) return { status: 304 };
  return { status: 200, body: data };
}
` },
      loiGiai: { 'main.js': `// Bài 6.4 — "tôi có phiên bản này rồi" ⇒ 304 không phần thân
function conditionalGet(reqHeaders, etag, data) {
  const key = Object.keys(reqHeaders).find((k) => k.toLowerCase() === 'if-none-match');
  const value = key === undefined ? '' : String(reqHeaders[key]).trim();
  const strip = (t) => t.trim().replace(/^W\\//, '');        // so sánh yếu: bỏ W/
  const matches = value === '*' || (value !== '' && value.split(',').some((t) => strip(t) === strip(etag)));
  if (matches) return { status: 304, headers: { ETag: etag }, body: null };
  return { status: 200, headers: { ETag: etag, 'Cache-Control': 'no-cache' }, body: data };
}
` },
      giaiThich: `<p>Trình duyệt tự gửi ${c('If-None-Match')} (bài đã đo bằng DevTools Protocol). Danh sách xuất hiện khi bộ đệm giữ nhiều phiên bản; ${c('W/')} là ETag "yếu" — nghĩa là tương đương về nội dung, đủ cho 304. Proxy như nginx hay đổi ETag mạnh thành yếu khi nén gzip, nên so sánh yếu là bắt buộc ở đây.</p>`,
      loiHayGap: ['Tra reqHeaders["If-None-Match"] — trượt với chữ thường.', 'So cả chuỗi danh sách với một ETag.', 'Gửi phần thân kèm 304.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-None-Match',
      kiem: [
        { moTa: 'Same ETag gives 304, different gives 200|||Cùng ETag cho 304, khác cho 200', goi: '[conditionalGet({ "If-None-Match": "\\"a1\\"" }, "\\"a1\\"", { id: 1 }), conditionalGet({ "if-none-match": "\\"old\\"" }, "\\"a1\\"", { id: 1 })]', mongDoi: [{ status: 304, headers: { ETag: '"a1"' }, body: null }, { status: 200, headers: { ETag: '"a1"', 'Cache-Control': 'no-cache' }, body: { id: 1 } }] },
        { moTa: 'No header: 200|||Không có header: 200', goi: 'conditionalGet({ Accept: "*/*" }, "\\"a1\\"", "x").status', mongDoi: 200 },
        { moTa: 'Lists, weak tags and *|||Danh sách, ETag yếu và *', goi: '[conditionalGet({ "IF-NONE-MATCH": "\\"x\\", W/\\"a1\\"" }, "\\"a1\\"", 1).status, conditionalGet({ "If-None-Match": "\\"a1\\"" }, "W/\\"a1\\"", 1).status, conditionalGet({ "If-None-Match": "*" }, "\\"zz\\"", 1).status]', mongDoi: [304, 304, 304] },
      ],
    },
  ],
});
