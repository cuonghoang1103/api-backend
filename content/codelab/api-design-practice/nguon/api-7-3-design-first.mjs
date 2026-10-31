/** API Design · 7.4 — Thiết kế trước: mock Prism, luật phong cách, cổng thay đổi phá vỡ (output thật Prism, Spectral, diff.mjs). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Design-first 1 — What the mock and the tools did', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 7.4 (Prism 5.14 mock, Spectral style guide, Zod export, openapi-diff 0.24).',
  vi: 'Những điều từ bài 7.4 (mock Prism 5.14, bộ luật Spectral, Zod xuất schema, openapi-diff 0.24).',
  cau: [
    q('c1', ['A wrong body sent to the Prism mock got 422; the real LabFlow answers 400. Why?', 'Body sai gửi tới mock Prism nhận 422; LabFlow thật trả 400. Vì sao?'],
      ['Prism prefers a documented 422 over 400 for invalid requests', 'LabFlow has a bug: an invalid body should always be 422 by RFC 9110', 'The mock was started with an older document that had no 400 response', 'Prism converts every 4xx it generates into 422 by default'],
      ['Prism’s order for invalid requests: 401, 415, 422, 400, default. The mock follows the document plus its own rules — run the contract check against the real server.', 'Thứ tự của Prism cho request sai: 401, 415, 422, 400, default. Mock theo tài liệu cộng luật riêng — hãy chạy kiểm hợp đồng với server thật.']),
    q('c2', ['What did Zod’s z.toJSONSchema() lose from LabFlow’s BookingCreateV2?', 'z.toJSONSchema() của Zod đánh rơi gì của BookingCreateV2?'],
      ['The .trim() normalisation — JSON Schema has no keyword for it', 'The required list, because Zod fields are optional by default', 'additionalProperties: false, because strictObject is Zod-only', 'The date-time format, replaced by a plain string type'],
      ['Measured: required and additionalProperties were exported; date-time became a 288-character pattern; trim vanished without a warning.', 'Đo được: required và additionalProperties vẫn xuất ra; date-time thành pattern 288 ký tự; trim biến mất không một lời cảnh báo.']),
    q('c3', ['Why did LabFlow write its own diff gate?', 'Vì sao LabFlow tự viết cổng so phiên bản?'],
      ['openapi-diff 0.24 refused OpenAPI 3.1: “Unsupported OpenAPI version: 3.1.0”', 'Because breaking-change detection cannot be automated with existing tools', 'To get colourful output in the terminal during the lessons', 'Because Spectral already detects breaking changes between versions'],
      ['Measure tools on your real document. LabFlow’s 100-line gate applies Chapter 4’s table and exits 1 on breaking changes.', 'Hãy đo công cụ bằng tài liệu thật của bạn. Cổng 100 dòng của LabFlow áp bảng của Chương 4 và thoát mã 1 khi phá vỡ.']),
  ],
  goiY: [['Who decides each answer — the document or the tool’s own rules?', 'Ai quyết định từng câu trả lời — tài liệu hay luật riêng của công cụ?'], ['What does JSON Schema have no keyword for?', 'JSON Schema không có từ khoá cho thứ gì?']],
  loi: [['Treating the mock as the server.', 'Coi mock là server.'], ['Assuming a popular tool supports your OpenAPI version.', 'Tưởng công cụ nổi tiếng thì hỗ trợ phiên bản OpenAPI của bạn.']],
  tns: [tn('mock server', 'API giả sinh từ tài liệu'), tn('diff gate', 'cổng so hai phiên bản tài liệu')],
  kn: ['design-first'],
});

const V = ['breaking', 'warning', 'safe'];
const E2 = cs({
  ten: 'Design-first 2 — Classify the change', kho: 'MEDIUM', phut: 10, loai: 'table',
  en: 'Classify each change to LabFlow’s v2 document as LabFlow’s diff gate does (rules of Chapter 4 and lesson 7.4).',
  vi: 'Phân loại từng thay đổi trên tài liệu v2 của LabFlow như cổng so phiên bản của LabFlow (luật của Chương 4 và bài 7.4).',
  bang: [bang1('b1', ['Change → verdict', 'Thay đổi → phán quyết'], [{ ma: 'x', ten: 'Change' }, { ma: 'a', ten: 'Verdict', luaChon: V }], [
    { o: { x: 'BookingCreate: purpose becomes required' }, a: { a: 'breaking' } },
    { o: { x: 'Booking (response): new field seats' }, a: { a: 'safe' } },
    { o: { x: 'Booking (response): period renamed to slot' }, a: { a: 'breaking' } },
    { o: { x: 'Booking.status (response): new value NO_SHOW' }, a: { a: 'warning' } },
    { o: { x: 'New operation GET /me/waitlist' }, a: { a: 'safe' } },
    { o: { x: 'BookingCreate: new optional field seats' }, a: { a: 'safe' } },
    { o: { x: 'Lab.capacity (response): integer becomes string' }, a: { a: 'breaking' } },
  ], ['Requests: a new required field or a removed accepted field breaks old clients. Responses: a removed field or a type change breaks; a new enum value warns (clients that crash on unknown values, 4.1); additions are safe.', 'Request: trường bắt buộc mới hay bỏ trường đang nhận làm gãy client cũ. Response: bỏ trường hay đổi kiểu là phá vỡ; giá trị enum mới là cảnh báo (client sập khi gặp giá trị lạ, 4.1); thêm là an toàn.'])],
  goiY: [['Is it something old clients SEND or RECEIVE?', 'Đó là thứ client cũ GỬI hay NHẬN?'], ['A rename = remove + add.', 'Đổi tên = bỏ + thêm.']],
  loi: [['Calling a rename “safe because the data is the same”.', 'Gọi đổi tên là “an toàn vì dữ liệu vẫn vậy”.'], ['Blocking every new enum value — it is a warning.', 'Chặn mọi giá trị enum mới — đó là cảnh báo.']],
  tns: [tn('breaking change', 'thay đổi phá vỡ'), tn('additive change', 'thay đổi chỉ thêm')],
  kn: ['versioning', 'design-first'],
});

function propChanges(oldS, newS, dir) {
  const out = [];
  const po = oldS.properties ?? {}, pn = newS.properties ?? {};
  const ro = new Set(oldS.required ?? []), rn = new Set(newS.required ?? []);
  for (const k of Object.keys(po)) {
    if (!(k in pn)) out.push(`${dir === 'res' ? 'break' : 'warn'} ${k} removed`);
    else if (JSON.stringify(po[k].type) !== JSON.stringify(pn[k].type)) out.push(`break ${k} type`);
  }
  for (const k of Object.keys(pn)) {
    if (k in po) continue;
    out.push(dir === 'req' && rn.has(k) ? `break ${k} new required` : `ok ${k} added`);
  }
  for (const k of rn) if (dir === 'req' && k in po && !ro.has(k)) out.push(`break ${k} now required`);
  for (const k of ro) if (dir === 'res' && k in pn && !rn.has(k)) out.push(`break ${k} may be absent`);
  return out;
}
const B = { type: 'object', required: ['labId', 'period'], properties: { labId: { type: 'string' }, period: { type: 'object' }, purpose: { type: 'string' } } };
const R = { type: 'object', required: ['id', 'period', 'purpose'], properties: { id: { type: 'string' }, period: { type: 'object' }, purpose: { type: ['string', 'null'] } } };
const E3 = jsBai({
  ten: 'Design-first 3 — Write propChanges(old, new, dir): the core of the diff gate', kho: 'HARD', phut: 20,
  en: `<p>Compare two object schemas (one level, no <code>$ref</code>). <code>dir</code> is <code>'req'</code> (what clients send) or <code>'res'</code> (what they receive). Return strings, in this order:</p><ol>
<li>for each OLD property: removed ⇒ <code>'break K removed'</code> if <code>res</code>, <code>'warn K removed'</code> if <code>req</code>; still there but <code>type</code> differs (compare as JSON) ⇒ <code>'break K type'</code></li>
<li>for each NEW property not in old: required in a <code>req</code> ⇒ <code>'break K new required'</code>, otherwise <code>'ok K added'</code></li>
<li><code>req</code>: a property in both that becomes required ⇒ <code>'break K now required'</code> (order of the new <code>required</code> list)</li>
<li><code>res</code>: a property in both that is no longer required ⇒ <code>'break K may be absent'</code> (order of the old <code>required</code> list)</li></ol>`,
  vi: `<p>So hai schema object (một tầng, không có <code>$ref</code>). <code>dir</code> là <code>'req'</code> (thứ client gửi) hoặc <code>'res'</code> (thứ client nhận). Trả về các chuỗi, theo thứ tự:</p><ol>
<li>với mỗi thuộc tính CŨ: bị bỏ ⇒ <code>'break K removed'</code> nếu <code>res</code>, <code>'warn K removed'</code> nếu <code>req</code>; còn nhưng <code>type</code> khác (so dạng JSON) ⇒ <code>'break K type'</code></li>
<li>với mỗi thuộc tính MỚI chưa có: bắt buộc trong <code>req</code> ⇒ <code>'break K new required'</code>, còn lại <code>'ok K added'</code></li>
<li><code>req</code>: thuộc tính có ở cả hai mà thành bắt buộc ⇒ <code>'break K now required'</code> (theo thứ tự danh sách <code>required</code> mới)</li>
<li><code>res</code>: thuộc tính có ở cả hai mà không còn bắt buộc ⇒ <code>'break K may be absent'</code> (theo thứ tự <code>required</code> cũ)</li></ol>`,
  dauVao: ['oldS, newS — object schemas; dir — "req" | "res"', 'oldS, newS — schema object; dir — "req" | "res"'],
  dauRa: ['array of strings', 'mảng chuỗi'],
  goiY: [['Build Sets from the two required lists first.', 'Dựng Set từ hai danh sách required trước.'], ['The same change has opposite verdicts for req and res.', 'Cùng một thay đổi có phán quyết ngược nhau cho req và res.']],
  loi: [['Treating a new required RESPONSE field as breaking — clients just get more.', 'Coi trường bắt buộc mới trong RESPONSE là phá vỡ — client chỉ nhận thêm.'], ['Comparing type arrays with === (always false for arrays).', 'So mảng type bằng === (với mảng luôn false).']],
  gt: ['purpose made required in BookingCreate ⇒ ["break purpose now required"]: exactly the gate’s exit-1 case in lesson 7.4.', 'Bắt buộc purpose trong BookingCreate ⇒ ["break purpose now required"]: đúng ca làm cổng thoát mã 1 ở bài 7.4.'],
  kn: ['versioning', 'design-first'],
  tns: [tn('request schema', 'schema của thứ client gửi'), tn('response schema', 'schema của thứ client nhận')],
  dau: `/** breaking-change rules for one object schema */
function propChanges(oldS, newS, dir) {
  // Write your solution here
  return Object.keys(newS.properties).filter((k) => !(k in oldS.properties)).map((k) => 'ok ' + k + ' added');
}
`,
  giai: '// Reference solution\n' + nguon(propChanges),
  cases: [
    { goi: goi('propChanges', B, { ...B, required: ['labId', 'period', 'purpose'] }, 'req'), moTa: ['purpose becomes required (lesson 7.4)', 'purpose thành bắt buộc (bài 7.4)'] },
    { goi: goi('propChanges', R, { ...R, required: ['id', 'slot', 'purpose'], properties: { id: { type: 'string' }, slot: { type: 'object' }, purpose: { type: ['string', 'null'] } } }, 'res'), moTa: ['period renamed to slot', 'đổi period thành slot'] },
    { goi: goi('propChanges', B, { ...B, properties: { ...B.properties, seats: { type: 'integer' } } }, 'req'), an: true, moTa: ['New optional seats', 'Thêm seats tuỳ chọn'] },
    { goi: goi('propChanges', R, { ...R, required: ['id', 'period'] }, 'res'), an: true, moTa: ['purpose may now be absent', 'purpose giờ có thể vắng'] },
    { goi: goi('propChanges', R, { ...R, properties: { ...R.properties, purpose: { type: 'string' } } }, 'res'), an: true, moTa: ['Type change', 'Đổi kiểu'] },
    { goi: goi('propChanges', B, { type: 'object', required: ['labId', 'period'], properties: { labId: { type: 'string' }, period: { type: 'object' } } }, 'req'), an: true },
  ],
});

export default doiDau({ slug: 'api-7-3-design-first', ten: '7.4 Design-first vs code-first', khoa: KHOA, baiHoc: 'api-7-3-design-first', de: [E1, E2, E3] });
