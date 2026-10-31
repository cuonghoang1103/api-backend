/** API Design · 7.3 — Sinh docs/client/validate: lớp nào bắt lỗi nào, tự sinh kiểu TypeScript từ schema (output thật tsc + compare-validators). */
import { doiDau, KHOA, cs, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

const L = ['tsc (typed client)', 'document schema (400)', 'Zod only (400)', 'handler (422/409)'];
const E1 = cs({
  ten: 'Generation 1 — Which layer catches it first?', kho: 'MEDIUM', phut: 10, loai: 'table',
  en: 'For each mistake, choose the FIRST layer that catches it in LabFlow (a client built with the generated types, then the request validated by the document’s schema, then Zod, then the handler).',
  vi: 'Với mỗi lỗi, chọn lớp ĐẦU TIÊN bắt được nó ở LabFlow (client dùng kiểu sinh ra, rồi request được kiểm theo schema của tài liệu, rồi Zod, rồi handler).',
  bang: [bang1('b1', ['Mistake → first layer', 'Lỗi → lớp đầu tiên'], [{ ma: 'x', ten: 'Mistake' }, { ma: 'a', ten: 'Layer', luaChon: L }], [
    { o: { x: 'A typed client writes labID instead of labId' }, a: { a: 'tsc (typed client)' } },
    { o: { x: 'A curl user sends purpose "   " (three spaces)' }, a: { a: 'Zod only (400)' } },
    { o: { x: 'A curl user sends end before start' }, a: { a: 'handler (422/409)' } },
    { o: { x: 'A curl user sends start without a time zone' }, a: { a: 'document schema (400)' } },
    { o: { x: 'A typed client compares status with "CONFIRMED"' }, a: { a: 'tsc (typed client)' } },
    { o: { x: 'A curl user books a slot already taken' }, a: { a: 'handler (422/409)' } },
  ], ['Types catch client code mistakes at compile time; curl users skip them. The document’s schema checks shape and formats; Zod adds trimming; business rules (time range, conflicts) live in the handler — measured in 7.3.', 'Kiểu bắt lỗi trong code client lúc biên dịch; người dùng curl bỏ qua lớp đó. Schema của tài liệu kiểm hình dạng và format; Zod thêm trim; luật nghiệp vụ (khoảng thời gian, trùng lịch) nằm ở handler — đã đo ở 7.3.'])],
  goiY: [['Does the mistake live in client code, in the shape, in normalisation, or in a business rule?', 'Lỗi nằm ở code client, ở hình dạng, ở chuẩn hoá, hay ở luật nghiệp vụ?'], ['curl has no compiler.', 'curl không có trình biên dịch.']],
  loi: [['Expecting JSON Schema to trim strings.', 'Tưởng JSON Schema tự trim chuỗi.'], ['Expecting the schema to know about time ranges.', 'Tưởng schema biết về khoảng thời gian.']],
  tns: [tn('compile time', 'lúc biên dịch, trước khi chạy'), tn('normalisation', 'chuẩn hoá đầu vào')],
  kn: ['OpenAPI', 'validation'],
});

function tsType(schema) {
  if (!schema) return 'unknown';
  if (schema.enum) return schema.enum.map((v) => JSON.stringify(v)).join(' | ');
  const types = [].concat(schema.type ?? 'unknown');
  const one = (t) => {
    if (t === 'integer' || t === 'number') return 'number';
    if (t === 'string' || t === 'boolean' || t === 'null') return t;
    if (t === 'array') return `${tsType(schema.items)}[]`;
    if (t === 'object') {
      const req = new Set(schema.required ?? []);
      const props = Object.entries(schema.properties ?? {}).map(([k, v]) => `${k}${req.has(k) ? '' : '?'}: ${tsType(v)}`);
      return `{ ${props.join('; ')} }`;
    }
    return 'unknown';
  };
  return types.map(one).join(' | ');
}
const E2 = jsBai({
  ten: 'Generation 2 — Write tsType(schema): a tiny openapi-typescript', kho: 'HARD', phut: 25,
  en: `<p>Turn a JSON Schema into a TypeScript type string, the way openapi-typescript does (simplified):</p><ul>
<li><code>enum</code> ⇒ the values as JSON joined by <code> | </code> (<code>"PENDING" | "CANCELLED"</code>)</li>
<li><code>type</code> may be a string or an array; each type maps and they are joined by <code> | </code>: <code>integer</code>/<code>number</code> ⇒ <code>number</code>; <code>string</code>, <code>boolean</code>, <code>null</code> ⇒ themselves; <code>array</code> ⇒ <code>T[]</code> from <code>items</code>; <code>object</code> ⇒ <code>{ a: T; b?: U }</code> in property order, <code>?</code> when not in <code>required</code></li>
<li>anything else (or no schema) ⇒ <code>unknown</code></li></ul>`,
  vi: `<p>Biến một JSON Schema thành chuỗi kiểu TypeScript, như openapi-typescript làm (bản rút gọn):</p><ul>
<li><code>enum</code> ⇒ các giá trị dạng JSON nối bằng <code> | </code> (<code>"PENDING" | "CANCELLED"</code>)</li>
<li><code>type</code> có thể là chuỗi hoặc mảng; mỗi kiểu được đổi rồi nối bằng <code> | </code>: <code>integer</code>/<code>number</code> ⇒ <code>number</code>; <code>string</code>, <code>boolean</code>, <code>null</code> ⇒ giữ nguyên; <code>array</code> ⇒ <code>T[]</code> theo <code>items</code>; <code>object</code> ⇒ <code>{ a: T; b?: U }</code> theo thứ tự thuộc tính, có <code>?</code> khi không nằm trong <code>required</code></li>
<li>còn lại (hoặc không có schema) ⇒ <code>unknown</code></li></ul>`,
  dauVao: ['schema — JSON Schema (no $ref)', 'schema — JSON Schema (không có $ref)'],
  dauRa: ['a TypeScript type as a string', 'một kiểu TypeScript dạng chuỗi'],
  goiY: [['Handle enum before type.', 'Xử lý enum trước type.'], ['Recurse for items and properties.', 'Đệ quy cho items và properties.']],
  loi: [['Mapping integer to "integer" — TypeScript has only number.', 'Đổi integer thành "integer" — TypeScript chỉ có number.'], ['Marking required fields with ? (inverted).', 'Gắn ? cho trường bắt buộc (ngược).']],
  gt: ['Booking.purpose { type: [string, null] } ⇒ "string | null" — why tsc said “possibly null” in lesson 7.3.', 'Booking.purpose { type: [string, null] } ⇒ "string | null" — lý do tsc báo “possibly null” ở bài 7.3.'],
  kn: ['OpenAPI', 'TypeScript'],
  tns: [tn('union type', 'kiểu hợp A | B'), tn('code generation', 'sinh code tự động')],
  dau: `/** JSON Schema ⇒ TypeScript type string */
function tsType(schema) {
  // Write your solution here
  return schema.type;
}
`,
  giai: '// Reference solution\n' + nguon(tsType),
  cases: [
    { goi: goi('tsType', { type: ['string', 'null'] }), moTa: ['Booking.purpose', 'Booking.purpose'] },
    { goi: goi('tsType', { type: 'string', enum: ['PENDING', 'CHECKED_IN', 'CANCELLED'] }), moTa: ['Booking.status', 'Booking.status'] },
    { goi: goi('tsType', { type: 'object', required: ['start', 'end'], properties: { start: { type: 'string' }, end: { type: 'string' } } }), an: true, moTa: ['Period', 'Period'] },
    { goi: goi('tsType', { type: 'object', required: ['data'], properties: { data: { type: 'array', items: { type: 'object', required: ['id'], properties: { id: { type: 'string' }, capacity: { type: 'integer' } } } } } }), an: true, moTa: ['A list of labs', 'Danh sách phòng'] },
    { goi: goi('tsType', { type: ['integer', 'null'], minimum: 1 }), an: true },
    { goi: goi('tsType', {}), an: true },
  ],
});

export default doiDau({ slug: 'api-7-2-sinh-code', ten: '7.3 Generating docs, clients and validators', khoa: KHOA, baiHoc: 'api-7-2-sinh-code', de: [E1, E2] });
