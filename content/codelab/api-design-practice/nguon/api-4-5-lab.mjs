/** API Design · Lab 4 — Thiết bị phiên bản 2: thiết kế header, assertShape của test hợp đồng, body v2 ⇒ dạng nội bộ (output thật Lab 4). */
import { doiDau, KHOA, cs, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Phần A ── */
const E1 = cs({
  ten: 'Lab 4 · 1 — Part A: the answers before the code', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Fill Part A of Lab 4 for /v1/devices (deprecated 15 Nov 2026, sunset 1 Jun 2027).',
  vi: 'Điền Phần A của Lab 4 cho /v1/devices (khai tử 15/11/2026, ngừng 1/6/2027).',
  bang: [bang1('b1', ['Question → answer', 'Câu hỏi → trả lời'], [{ ma: 'x', ten: 'Question' }, { ma: 'a', ten: 'Answer', luaChon: [
    'breaking: silent for readers, loud for writers',
    'serialNo only — two names only at the edge',
    '@1794700800',
    'Tue, 01 Jun 2027 00:00:00 GMT',
    '410 API_SUNSET with successor /v2/devices/dev_1',
    '400 — serialNo is an unknown field in v2',
  ] }], [
    { o: { x: 'Is renaming serialNo to serialNumber breaking?' }, a: { a: 'breaking: silent for readers, loud for writers' } },
    { o: { x: 'Which field does the internal record keep?' }, a: { a: 'serialNo only — two names only at the edge' } },
    { o: { x: 'Deprecation header value' }, a: { a: '@1794700800' } },
    { o: { x: 'Sunset header value' }, a: { a: 'Tue, 01 Jun 2027 00:00:00 GMT' } },
    { o: { x: 'GET /v1/devices/dev_1 on 2 June 2027' }, a: { a: '410 API_SUNSET with successor /v2/devices/dev_1' } },
    { o: { x: 'POST /v2/devices with serialNo' }, a: { a: '400 — serialNo is an unknown field in v2' } },
  ], ['Real values from the reference run: Deprecation @1794700800 (2026-11-15T00:00:00Z), Sunset Tue, 01 Jun 2027 00:00:00 GMT, and the v2 errors list both #/serialNumber and #/serialNo.', 'Giá trị thật từ lần chạy tham khảo: Deprecation @1794700800 (2026-11-15T00:00:00Z), Sunset Tue, 01 Jun 2027 00:00:00 GMT, và lỗi v2 liệt kê cả #/serialNumber lẫn #/serialNo.'])],
  goiY: [['Readers get undefined; writers get a strict-schema error.', 'Bên đọc nhận undefined; bên ghi nhận lỗi của lược đồ strict.'], ['1794700800 = 2026-11-15T00:00:00Z.', '1794700800 = 2026-11-15T00:00:00Z.']],
  loi: [['Storing both serialNo and serialNumber in the record.', 'Lưu cả serialNo lẫn serialNumber trong bản ghi.'], ['A 404 on the day after the sunset.', 'Trả 404 vào ngày sau sunset.']],
  tns: [tn('successor', 'bản thay thế'), tn('internal record', 'bản ghi nội bộ')],
  kn: ['versioning', 'deprecation'],
});

/* ── 2. Tự viết: shapeProblems ── */
function shapeProblems(obj, contract) {
  const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
  const out = [];
  for (const k of Object.keys(contract).sort()) {
    if (!(k in obj)) out.push(`missing:${k}`);
    else if (!contract[k].split('|').includes(typeOf(obj[k]))) out.push(`type:${k}:${typeOf(obj[k])}`);
  }
  for (const k of Object.keys(obj).sort()) if (!(k in contract)) out.push(`extra:${k}`);
  return out;
}
const V1_DEVICE = { id: 'string', labId: 'string', name: 'string', type: 'string', serialNo: 'string', status: 'string', note: 'string|null' };
const DEV1 = { id: 'dev_1', labId: 'lab_1', name: 'Cisco Router 2901', type: 'ROUTER', serialNo: 'FTX1840ALBQ', status: 'AVAILABLE', note: null };
const E2 = jsBai({
  ten: 'Lab 4 · 2 — Write shapeProblems(obj, contract): the heart of the contract test', kho: 'MEDIUM', phut: 15,
  en: `<p>The v1 contract is <code>{ member: "type" }</code>, where a type may list alternatives with <code>|</code> (<code>"string|null"</code>). Types are <code>null</code>, <code>array</code>, or <code>typeof</code>. Return every problem — an empty list means the response honours the frozen contract:</p><ul>
<li><code>"missing:&lt;k&gt;"</code> and <code>"type:&lt;k&gt;:&lt;actual&gt;"</code> for contract members, in alphabetical order</li>
<li>then <code>"extra:&lt;k&gt;"</code> for members not in the contract, alphabetically (v1 is frozen: additions fail too)</li></ul>`,
  vi: `<p>Hợp đồng v1 là <code>{ trường: "kiểu" }</code>, kiểu có thể liệt kê nhiều lựa chọn bằng <code>|</code> (<code>"string|null"</code>). Kiểu là <code>null</code>, <code>array</code>, hoặc <code>typeof</code>. Trả mọi vấn đề — danh sách rỗng nghĩa là response giữ đúng hợp đồng đã đóng băng:</p><ul>
<li><code>"missing:&lt;k&gt;"</code> và <code>"type:&lt;k&gt;:&lt;thực tế&gt;"</code> cho các trường của hợp đồng, theo bảng chữ cái</li>
<li>rồi <code>"extra:&lt;k&gt;"</code> cho trường không có trong hợp đồng, theo bảng chữ cái (v1 đã đóng băng: thêm cũng là lỗi)</li></ul>`,
  dauVao: ['obj — a response body; contract — { member: "type|type" }', 'obj — body của response; contract — { trường: "kiểu|kiểu" }'],
  dauRa: ['string[] of problems', 'mảng chuỗi các vấn đề'],
  goiY: [['typeof null is "object" and typeof [] is "object" — handle both first.', 'typeof null là "object" và typeof [] cũng là "object" — xử lý cả hai trước.'], ['Two loops: contract keys, then object keys.', 'Hai vòng lặp: khoá của hợp đồng, rồi khoá của object.']],
  loi: [['Treating note: null as a type error although the contract allows null.', 'Coi note: null là lỗi kiểu dù hợp đồng cho phép null.'], ['Ignoring extra members — the careless rename then shows only half the problem.', 'Bỏ qua trường thừa — lần đổi tên cẩu thả khi đó chỉ lộ một nửa vấn đề.']],
  gt: ['The careless rename of Lab 4 (serialNo → serialNumber in toDevice) gives ["missing:serialNo", "extra:serialNumber"] — the same diff node:test printed in red.', 'Lần đổi tên cẩu thả của Lab 4 (serialNo → serialNumber trong toDevice) cho ["missing:serialNo", "extra:serialNumber"] — đúng khác biệt mà node:test in màu đỏ.'],
  kn: ['contract testing'],
  tns: [tn('contract test', 'kiểm thử hợp đồng'), tn('frozen', 'đã đóng băng')],
  dau: `/** response + contract ⇒ list of problems */
function shapeProblems(obj, contract) {
  // Write your solution here
  return Object.keys(contract).filter((k) => typeof obj[k] !== contract[k]).map((k) => 'type:' + k);
}
`,
  giai: '// Reference solution\n' + nguon(shapeProblems),
  cases: [
    { goi: goi('shapeProblems', DEV1, V1_DEVICE), moTa: ['GET /v1/devices/dev_1 (real)', 'GET /v1/devices/dev_1 (thật)'] },
    { goi: goi('shapeProblems', { id: 'dev_1', labId: 'lab_1', name: 'Cisco Router 2901', type: 'ROUTER', serialNumber: 'FTX1840ALBQ', status: 'AVAILABLE', note: null }, V1_DEVICE), moTa: ['The careless rename', 'Lần đổi tên cẩu thả'] },
    { goi: goi('shapeProblems', { ...DEV1, note: 'Thiếu thẻ nhớ' }, V1_DEVICE), an: true },
    { goi: goi('shapeProblems', { ...DEV1, status: 2, note: [], floor: 3 }, V1_DEVICE), an: true },
    { goi: goi('shapeProblems', {}, { id: 'string' }), an: true },
  ],
});

/* ── 3. Tự viết: deviceBodyToInternal ── */
function deviceBodyToInternal(body, version) {
  if (version === 1) {
    if ('serialNumber' in body) throw new RangeError('unknown field serialNumber');
    return { ...body };
  }
  if ('serialNo' in body) throw new RangeError('unknown field serialNo');
  if (!('serialNumber' in body)) return { ...body };
  const { serialNumber, ...rest } = body;
  return { ...rest, serialNo: serialNumber };
}
const E3 = jsBai({
  ten: 'Lab 4 · 3 — Write deviceBodyToInternal(body, version)', kho: 'EASY', phut: 10,
  en: `<p>The one place where a request body becomes the internal form (which always uses <code>serialNo</code>):</p><ul>
<li><b>v1</b>: <code>serialNumber</code> is unknown ⇒ throw <code>RangeError</code>; otherwise a copy of the body</li>
<li><b>v2</b>: <code>serialNo</code> is unknown ⇒ throw <code>RangeError</code>; <code>serialNumber</code> is renamed to <code>serialNo</code>; a PATCH body without it is copied unchanged</li></ul>
<p>Never modify the input.</p>`,
  vi: `<p>Chỗ duy nhất nơi body của request biến thành dạng nội bộ (luôn dùng <code>serialNo</code>):</p><ul>
<li><b>v1</b>: <code>serialNumber</code> là trường lạ ⇒ ném <code>RangeError</code>; còn lại trả bản sao body</li>
<li><b>v2</b>: <code>serialNo</code> là trường lạ ⇒ ném <code>RangeError</code>; <code>serialNumber</code> được đổi tên thành <code>serialNo</code>; body PATCH không có nó thì sao chép nguyên</li></ul>
<p>Không bao giờ sửa đầu vào.</p>`,
  dauVao: ['body — validated request body; version — 1 | 2', 'body — body đã kiểm; version — 1 | 2'],
  dauRa: ['the internal form, or a RangeError', 'dạng nội bộ, hoặc RangeError'],
  goiY: [['const { serialNumber, ...rest } = body renames without touching body.', 'const { serialNumber, ...rest } = body đổi tên mà không đụng tới body.'], ['"in" tells whether a member is present, even if its value is null.', '"in" cho biết một trường có mặt hay không, kể cả khi giá trị là null.']],
  loi: [['body.serialNo = body.serialNumber — modifies the caller’s object.', 'body.serialNo = body.serialNumber — sửa object của người gọi.'], ['Accepting both names in v2 — the contract says serialNo is an error there.', 'Nhận cả hai tên ở v2 — hợp đồng nói serialNo là lỗi ở đó.']],
  gt: ['In LabFlow the strict Zod schema already rejects the wrong name with 400; this function is the internal() step that follows, so checkRules and the duplicate-serial 409 are shared by both versions.', 'Ở LabFlow, lược đồ Zod strict đã từ chối tên sai bằng 400; hàm này là bước internal() theo sau, để checkRules và lỗi 409 trùng serial dùng chung cho cả hai phiên bản.'],
  kn: ['versioning'],
  tns: [tn('internal form', 'dạng nội bộ'), tn('edge translation', 'dịch ở mép')],
  dau: `/** request body (v1 or v2) ⇒ internal form */
function deviceBodyToInternal(body, version) {
  // Write your solution here
  body.serialNo = body.serialNumber;
  return body;
}
`,
  giai: '// Reference solution\n' + nguon(deviceBodyToInternal),
  cases: [
    { goi: goi('deviceBodyToInternal', { labId: 'lab_2', name: 'ESP32 DevKit', type: 'BOARD', serialNumber: 'ESP32-7781', status: 'AVAILABLE' }, 2), moTa: ['POST /v2/devices (Lab 4)', 'POST /v2/devices (Lab 4)'] },
    { goi: goi('deviceBodyToInternal', { serialNo: 'ESP32-7782' }, 2), nem: 'RangeError', moTa: ['serialNo in v2', 'serialNo ở v2'] },
    { goi: goi('deviceBodyToInternal', { serialNo: 'FTX1840ALBQ' }, 1), an: true },
    { goi: goi('deviceBodyToInternal', { note: null }, 2), an: true, moTa: ['PATCH without the serial', 'PATCH không có serial'] },
    { goi: goi('deviceBodyToInternal', { serialNumber: 'X-1' }, 1), nem: 'RangeError', an: true },
    { goi: `(function () { var b = { serialNumber: 'ESP32-7781' }; deviceBodyToInternal(b, 2); return b; })()`, an: true, moTa: ['The input is not modified', 'Đầu vào không bị sửa'] },
  ],
});

export default doiDau({ slug: 'api-4-5-lab', ten: 'Lab 4 — Devices, version 2', khoa: KHOA, baiHoc: 'api-4-5-lab', de: [E1, E2, E3] });
