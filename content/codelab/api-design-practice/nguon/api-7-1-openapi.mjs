/** API Design · 7.1 — Viết OpenAPI 3.1: chuyển nullable 3.0 sang 3.1, tham số đường dẫn chưa khai (output thật Redocly trên tài liệu LabFlow). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'OpenAPI 1 — What lint and YAML did to LabFlow’s document', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 7.1 (LabFlow v2 written as openapi.yaml, linted with Redocly CLI 2.72).',
  vi: 'Những điều từ bài 7.1 (LabFlow v2 viết thành openapi.yaml, lint bằng Redocly CLI 2.72).',
  cau: [
    q('c1', ['A first draft had an example with startAt/endAt while the schema required period. What did Redocly report?', 'Bản nháp đầu có ví dụ dùng startAt/endAt trong khi schema bắt buộc period. Redocly báo gì?'],
      ['no-invalid-media-type-examples: the example must conform to the schema', 'Nothing: examples are documentation and are never checked by linters', 'A YAML parse error, because startAt is not a valid key in OpenAPI', 'operation-operationId, because examples need an operation id first'],
      ['The example was copied from v1; Chapter 4 renamed the fields to period. A wrong example misleads every reader and every mock.', 'Ví dụ chép từ v1; Chương 4 đã đổi thành period. Ví dụ sai đánh lừa mọi người đọc và mọi mock.']),
    q('c2', ['Inside { … }, “description: Search in the name, accent-insensitive” produced …', 'Trong { … }, “description: Search in the name, accent-insensitive” tạo ra …'],
      ['a valid file with an extra key accent-insensitive — caught only by the OpenAPI struct rule', 'a YAML parse error that stopped every tool at the first comma it saw', 'the description text exactly as written, since commas are allowed here', 'a runtime 400 from LabFlow for every request to GET /labs'],
      ['The comma split the flow mapping. The bracket case [from, to) was the one that failed to parse.', 'Dấu phẩy tách mapping kiểu flow. Trường hợp ngoặc vuông [from, to) mới là cái không đọc được.']),
    q('c3', ['In OpenAPI 3.1, how do you say “purpose is always present but may be null”?', 'Trong OpenAPI 3.1, nói “purpose luôn có mặt nhưng có thể null” thế nào?'],
      ['required: [purpose] and type: [string, \'null\']', 'nullable: true and leave purpose out of required', 'required: [purpose] and default: null on the field', 'type: string and example: null on the property'],
      ['3.1 schemas are JSON Schema 2020-12: null is a type; nullable belongs to 3.0. Required means present — LabFlow’s rule from 2.3.', 'Schema 3.1 là JSON Schema 2020-12: null là một kiểu; nullable thuộc về 3.0. Required nghĩa là có mặt — luật LabFlow từ 2.3.']),
    q('c4', ['Why does LabFlow raise operation-operationId from warning to error?', 'Vì sao LabFlow nâng operation-operationId từ warning lên error?'],
      ['Generated clients use operationId as function names — without it 7.3 has nothing to call', 'Because Redocly refuses to build docs for operations that have no id at all', 'Because operationId is required by HTTP and RFC 9110 for every request', 'To make the lint output shorter by turning warnings into errors'],
      ['Redocly’s recommended set reports it only as a warning. Teams that generate code make it an error.', 'Bộ recommended của Redocly chỉ báo warning. Đội nào sinh code từ tài liệu thì nâng thành error.']),
  ],
  goiY: [['Which errors parse and which only lint can see?', 'Lỗi nào làm hỏng việc đọc tệp, lỗi nào chỉ lint mới thấy?'], ['3.1 = JSON Schema 2020-12.', '3.1 = JSON Schema 2020-12.']],
  loi: [['Following 3.0 tutorials (nullable).', 'Làm theo hướng dẫn 3.0 (nullable).'], ['Trusting a file because it parses.', 'Tin tệp chỉ vì nó đọc được.']],
  tns: [tn('operationId', 'tên duy nhất của một thao tác'), tn('flow style', 'kiểu YAML viết gọn trong { } và [ ]')],
  kn: ['OpenAPI'],
});

function toOas31(schema) {
  if (Array.isArray(schema)) return schema.map(toOas31);
  if (!schema || typeof schema !== 'object') return schema;
  const out = {};
  for (const [k, v] of Object.entries(schema)) {
    if (k === 'nullable') continue;
    if (k === 'properties') out.properties = Object.fromEntries(Object.entries(v).map(([p, s]) => [p, toOas31(s)]));
    else if (k === 'items') out.items = toOas31(v);
    else out[k] = v;
  }
  if (schema.nullable === true && schema.type) {
    const types = [].concat(schema.type);
    out.type = types.includes('null') ? types : [...types, 'null'];
  }
  return out;
}
const E2 = jsBai({
  ten: 'OpenAPI 2 — Write toOas31(schema): turn 3.0 “nullable” into 3.1 types', kho: 'MEDIUM', phut: 15,
  en: `<p>Old documents (OpenAPI 3.0) say <code>nullable: true</code>; 3.1 writes null as a type. Return a <strong>new</strong> schema where every <code>nullable: true</code> is removed and <code>'null'</code> is added to <code>type</code> (as an array: <code>type: 'string'</code> ⇒ <code>['string', 'null']</code>; an array type keeps its order and gets <code>'null'</code> at the end unless already there). <code>nullable: false</code> is simply removed. Recurse into <code>properties</code> and <code>items</code>; keep every other key as it is. Do not modify the argument.</p>`,
  vi: `<p>Tài liệu cũ (OpenAPI 3.0) ghi <code>nullable: true</code>; 3.1 viết null thành một kiểu. Trả về một schema <strong>mới</strong> trong đó mọi <code>nullable: true</code> bị bỏ và <code>'null'</code> được thêm vào <code>type</code> (dạng mảng: <code>type: 'string'</code> ⇒ <code>['string', 'null']</code>; type đã là mảng thì giữ thứ tự và thêm <code>'null'</code> ở cuối nếu chưa có). <code>nullable: false</code> chỉ cần bỏ. Đệ quy vào <code>properties</code> và <code>items</code>; mọi khoá khác giữ nguyên. Không sửa đối số.</p>`,
  dauVao: ['schema — an OpenAPI 3.0 Schema Object', 'schema — một Schema Object của OpenAPI 3.0'],
  dauRa: ['the 3.1 equivalent (new object)', 'bản tương đương 3.1 (object mới)'],
  goiY: [['Copy keys one by one, skipping nullable.', 'Chép từng khoá, bỏ qua nullable.'], ['[].concat(type) turns a string or an array into an array.', '[].concat(type) biến chuỗi hoặc mảng thành mảng.']],
  loi: [['Changing the argument in place.', 'Sửa thẳng đối số.'], ['Forgetting nested properties and array items.', 'Quên các properties lồng nhau và items của mảng.']],
  gt: ['LabFlow’s Booking.purpose: { type: string, nullable: true } becomes { type: [string, null] } — exactly what lesson 7.1 wrote by hand.', 'Booking.purpose của LabFlow: { type: string, nullable: true } thành { type: [string, null] } — đúng như bài 7.1 viết tay.'],
  kn: ['OpenAPI', 'JSON Schema'],
  tns: [tn('nullable', 'từ khoá của OpenAPI 3.0 (bỏ ở 3.1)'), tn('migration', 'chuyển đổi lên phiên bản mới')],
  dau: `/** OpenAPI 3.0 schema ⇒ 3.1 */
function toOas31(schema) {
  // Write your solution here
  if (schema.nullable) { delete schema.nullable; schema.type = [schema.type, 'null']; }
  return schema;
}
`,
  giai: '// Reference solution\n' + nguon(toOas31),
  cases: [
    { goi: goi('toOas31', { type: 'string', nullable: true }), moTa: ['Booking.purpose', 'Booking.purpose'] },
    { goi: goi('toOas31', { type: 'object', properties: { purpose: { type: 'string', nullable: true }, id: { type: 'string' } } }), moTa: ['Nested property', 'Thuộc tính lồng'] },
    { goi: goi('toOas31', { type: 'array', items: { type: 'integer', nullable: true, minimum: 1 } }), an: true, moTa: ['Array items', 'Phần tử mảng'] },
    { goi: goi('toOas31', { type: ['string', 'integer'], nullable: true }), an: true },
    { goi: goi('toOas31', { type: 'string', nullable: false, format: 'date-time' }), an: true },
    { goi: `(function () { var s = { type: 'string', nullable: true }; toOas31(s); return s; })()`, an: true, moTa: ['The argument is not modified', 'Đối số không bị sửa'] },
  ],
});

function undeclaredParams(path, parameters) {
  const inPath = [...path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  const declared = new Set(parameters.filter((p) => p.in === 'path').map((p) => p.name));
  return inPath.filter((n) => !declared.has(n));
}
const E3 = jsBai({
  ten: 'OpenAPI 3 — Write undeclaredParams(path, parameters): the path-parameters-defined rule', kho: 'EASY', phut: 10,
  en: `<p>Return the names of the <code>{placeholders}</code> in <code>path</code> that have no parameter with <code>in: 'path'</code> and the same <code>name</code>, in the order they appear in the path. A query parameter with the same name does not count.</p>`,
  vi: `<p>Trả về tên các <code>{chỗ trống}</code> trong <code>path</code> chưa có tham số nào <code>in: 'path'</code> cùng <code>name</code>, theo thứ tự xuất hiện trong path. Tham số query trùng tên không được tính.</p>`,
  dauVao: ['path — e.g. "/labs/{labId}/devices/{id}"; parameters — [{ name, in }]', 'path — vd. "/labs/{labId}/devices/{id}"; parameters — [{ name, in }]'],
  dauRa: ['array of names', 'mảng tên'],
  goiY: [['A regular expression finds every {name}.', 'Một biểu thức chính quy tìm mọi {tên}.'], ['Filter parameters by in === "path" first.', 'Lọc tham số theo in === "path" trước.']],
  loi: [['Counting query parameters with the same name.', 'Tính cả tham số query trùng tên.'], ['Returning names with the braces.', 'Trả tên kèm dấu ngoặc.']],
  gt: ['The first draft’s GET /bookings/{id} had no parameters ⇒ ["id"] — Redocly’s path-parameters-defined error in lesson 7.1.', 'GET /bookings/{id} của bản nháp đầu không có tham số ⇒ ["id"] — lỗi path-parameters-defined của Redocly ở bài 7.1.'],
  kn: ['OpenAPI'],
  tns: [tn('path parameter', 'tham số nằm trong đường dẫn'), tn('lint rule', 'luật kiểm tự động')],
  dau: `/** placeholders in the path that no path parameter declares */
function undeclaredParams(path, parameters) {
  // Write your solution here
  return parameters.length ? [] : ['id'];
}
`,
  giai: '// Reference solution\n' + nguon(undeclaredParams),
  cases: [
    { goi: goi('undeclaredParams', '/bookings/{id}', []), moTa: ['The first draft (lesson 7.1)', 'Bản nháp đầu (bài 7.1)'] },
    { goi: goi('undeclaredParams', '/labs/{labId}/waitlist', [{ name: 'labId', in: 'path' }]), moTa: ['Declared', 'Đã khai'] },
    { goi: goi('undeclaredParams', '/labs/{labId}/devices/{id}', [{ name: 'id', in: 'query' }]), an: true },
    { goi: goi('undeclaredParams', '/labs', [{ name: 'q', in: 'query' }]), an: true },
    { goi: goi('undeclaredParams', '/a/{x}/b/{y}/c/{z}', [{ name: 'y', in: 'path' }]), an: true },
  ],
});

export default doiDau({ slug: 'api-7-1-openapi', ten: '7.1 Writing OpenAPI 3.1', khoa: KHOA, baiHoc: 'api-7-1-openapi', de: [E1, E2, E3] });
