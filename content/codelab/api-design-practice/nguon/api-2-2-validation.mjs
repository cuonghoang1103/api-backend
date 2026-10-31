/** API Design · 2.2 — Kiểm dữ liệu ở cửa: tầng kiểm, strict/strip, ép kiểu; tự viết validateDevicePatch + coerceQuery. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tầng nào, mã nào ── */
const TANG = ['door', 'shape (schema)', 'business rule'];
const MA = ['400', '409', '413', '415', '422'];
const V1 = cs({
  ten: 'Validation 1 — Which layer, which code?', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Each row is a request sent to LabFlow after lesson 2.2. Choose the layer that refuses it and the status it gets.',
  vi: 'Mỗi dòng là một request gửi tới LabFlow sau bài 2.2. Chọn tầng chặn nó và mã trạng thái nó nhận.',
  bang: [bang1('b1', ['Request → layer → status', 'Request → tầng → mã'], [{ ma: 'x', ten: 'Request' }, { ma: 't', ten: 'Layer', luaChon: TANG }, { ma: 'c', ten: 'Status', luaChon: MA }], [
    { o: { x: 'POST /bookings with Content-Type: text/plain' }, a: { t: TANG[0], c: '415' } },
    { o: { x: 'POST /bookings with a 200 KB body (limit 10 KB)' }, a: { t: TANG[0], c: '413' } },
    { o: { x: 'PATCH /devices/dev_1 {"name": 123, "isAdmin": true}' }, a: { t: TANG[1], c: '400' } },
    { o: { x: 'POST /bookings with startAt "2026-02-30T08:00:00+07:00"' }, a: { t: TANG[1], c: '400' } },
    { o: { x: 'POST /bookings for lab_4 (retired)' }, a: { t: TANG[2], c: '422' } },
    { o: { x: 'PATCH /devices/dev_1 {"serialNo": "FOC1932X0K7"} (dev_2 has it)' }, a: { t: TANG[2], c: '409' } },
  ], ['The door checks media type and size without reading the body; the schema checks shape without touching data (30 February is a shape error — the date does not exist); rules that need data — a retired lab, a serial already used — come last.', 'Cửa kiểm kiểu nội dung và kích thước mà không đọc body; schema kiểm hình dạng mà không cần dữ liệu (30/2 là lỗi hình dạng — ngày đó không tồn tại); luật cần tra dữ liệu — phòng đã ngừng dùng, serial đã có — đi sau cùng.'])],
  goiY: [['Ask: does the check need the database?', 'Hỏi: phép kiểm có cần tới cơ sở dữ liệu không?'], ['30 February needs no data to be wrong.', '30/2 sai mà không cần dữ liệu nào.']],
  loi: [['Calling an unknown lab a shape error: the id is well-formed, the lab is the problem.', 'Gọi phòng không tồn tại là lỗi hình dạng: id đúng dạng, chính phòng mới là vấn đề.'], ['Answering 400 for a text/plain body — 415 tells the client exactly what to change.', 'Trả 400 cho body text/plain — 415 cho client biết chính xác phải đổi gì.']],
  tns: [tn('media type', 'kiểu nội dung'), tn('business rule', 'luật nghiệp vụ')],
  kn: ['validation layers'],
});

/* ── 2. Tình huống ── */
const V2 = cs({
  ten: 'Validation 2 — Strict objects, coercion and Express 5', kho: 'MEDIUM', phut: 10,
  en: 'Facts measured in lesson 2.2 with Zod 4.6.7 and Express 5.3.0.',
  vi: 'Những điều đã đo trong bài 2.2 với Zod 4.6.7 và Express 5.3.0.',
  cau: [
    q('c1', ['A booking body contains "status": "APPROVED". With z.object() (the default) Zod …', 'Body đặt phòng có "status": "APPROVED". Với z.object() (mặc định) Zod …'], ['silently removes status from the result', 'refuses the body with "unrecognized key"', 'keeps status in the result', 'throws an exception that crashes the server'], ['Default objects strip unknown keys; strictObject refuses them; looseObject keeps them. LabFlow uses strictObject for writes so typos and smuggled fields become visible.', 'object mặc định gỡ khoá lạ; strictObject từ chối; looseObject giữ nguyên. LabFlow dùng strictObject cho thao tác ghi để lỗi gõ và trường lén nhét lộ ra.']),
    q('c2', ['?onlyAvailable=false is validated with z.coerce.boolean(). The handler receives …', '?onlyAvailable=false được kiểm bằng z.coerce.boolean(). Handler nhận …'], ['true', 'false', 'the string "false"', 'a 400 error'], ['Coercion uses Boolean(): every non-empty string is truthy. Use z.stringbool() for query booleans.', 'Ép kiểu dùng Boolean(): chuỗi không rỗng nào cũng truthy. Dùng z.stringbool() cho boolean trong query.']),
    q('c3', ['validate() stores the cleaned query in req.valid.query instead of req.query. Why?', 'validate() cất query đã làm sạch vào req.valid.query thay vì req.query. Vì sao?'], ['In Express 5 req.query is a getter; assigning it throws', 'req.query is shared between all requests', 'Zod cannot return an object for the query', 'Express 5 deletes req.query after the first middleware'], ['Measured: "Cannot set property query of #&lt;IncomingMessage&gt; which has only a getter".', 'Đã đo: "Cannot set property query of #&lt;IncomingMessage&gt; which has only a getter".']),
    q('c4', ['Zod refuses "2026-11-02T10:00+07:00" (no seconds) that Chapter 1 accepted. After release this is …', 'Zod từ chối "2026-11-02T10:00+07:00" (không có giây) mà Chương 1 từng nhận. Sau khi phát hành, đây là …'], ['a breaking change — clients that sent it start failing', 'a bug fix that no client can notice', 'harmless, because times without seconds are invalid ISO 8601', 'only a documentation change'], ['Refusing something you used to accept breaks someone. Before any client exists it is free; LabFlow decides now and writes it down.', 'Từ chối thứ từng nhận sẽ làm vỡ ai đó. Khi chưa có client thì miễn phí; LabFlow quyết ngay và ghi ra.']),
    q('c5', ['req.is(["application/json"]) returns null. That means …', 'req.is(["application/json"]) trả về null. Nghĩa là …'], ['the request has no body at all', 'the body is JSON', 'the body has another type', 'the Content-Type header is malformed'], ['null = no body (e.g. POST …/cancel); false = a body of another type ⇒ 415; the type = a matching body.', 'null = không có body (ví dụ POST …/cancel); false = body kiểu khác ⇒ 415; trả về kiểu = body khớp.']),
  ],
  goiY: [['Each answer was measured in the lesson; re-run it if unsure.', 'Mỗi đáp án đã được đo trong bài; chạy lại nếu chưa chắc.'], ['Strip, strict, loose: removed, refused, kept.', 'Strip, strict, loose: gỡ, từ chối, giữ.']],
  loi: [['Trusting coercion for booleans.', 'Tin ép kiểu cho boolean.'], ['Assuming tightening validation is always safe.', 'Cho rằng siết kiểm dữ liệu lúc nào cũng an toàn.']],
  tns: [tn('coercion', 'ép kiểu'), tn('strict object', 'object nghiêm ngặt')],
  kn: ['Zod', 'Express 5'],
});

/* ── 3. Tự viết: validateDevicePatch ── */
function validateDevicePatch(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return { ok: false, errors: [{ pointer: '#', detail: 'expected object' }] };
  var errors = [], value = {};
  var TYPES = ['ROUTER', 'SWITCH', 'BOARD', 'PC', 'OTHER'], STATUSES = ['AVAILABLE', 'IN_USE', 'MAINTENANCE'];
  var err = function (k, d) { errors.push({ pointer: '#/' + k, detail: d }); };
  Object.keys(body).forEach(function (k) {
    var v = body[k];
    if (k === 'labId') { if (typeof v === 'string' && /^lab_\d+$/.test(v)) value[k] = v; else err(k, 'must look like lab_1'); }
    else if (k === 'name') {
      if (typeof v !== 'string') err(k, 'expected string');
      else if (v.trim().length < 1 || v.trim().length > 100) err(k, 'length 1-100');
      else value[k] = v.trim();
    }
    else if (k === 'type') { if (TYPES.indexOf(v) >= 0) value[k] = v; else err(k, 'invalid option'); }
    else if (k === 'serialNo') { if (typeof v === 'string' && /^[A-Z0-9-]{6,20}$/.test(v)) value[k] = v; else err(k, 'invalid serial'); }
    else if (k === 'status') { if (STATUSES.indexOf(v) >= 0) value[k] = v; else err(k, 'invalid option'); }
    else if (k === 'note') {
      if (v === null) value[k] = null;
      else if (typeof v !== 'string') err(k, 'expected string or null');
      else if (v.trim().length > 500) err(k, 'length 0-500');
      else value[k] = v.trim();
    }
    else err(k, 'unknown field');
  });
  return errors.length ? { ok: false, errors: errors } : { ok: true, value: value };
}
const V3 = jsBai({
  ten: 'Validation 3 — Write validateDevicePatch(body) without a library', kho: 'HARD', phut: 25,
  en: `<p>To see what Zod does for you, write LabFlow’s <code>DevicePatch</code> schema by hand. Every member is optional; check the members <b>in the order they appear in the body</b> and collect every error as <code>{ pointer: '#/' + key, detail }</code>:</p><ul>
<li><code>labId</code>: string matching <code>^lab_\\d+$</code>, else <code>'must look like lab_1'</code></li>
<li><code>name</code>: not a string ⇒ <code>'expected string'</code>; trimmed length outside 1–100 ⇒ <code>'length 1-100'</code>; the value kept is <b>trimmed</b></li>
<li><code>type</code>: one of ROUTER, SWITCH, BOARD, PC, OTHER; <code>status</code>: one of AVAILABLE, IN_USE, MAINTENANCE — else <code>'invalid option'</code></li>
<li><code>serialNo</code>: string matching <code>^[A-Z0-9-]{6,20}$</code>, else <code>'invalid serial'</code></li>
<li><code>note</code>: <code>null</code> is allowed (remove); otherwise a string, else <code>'expected string or null'</code>; trimmed length &gt; 500 ⇒ <code>'length 0-500'</code>; kept trimmed</li>
<li>any other key ⇒ <code>'unknown field'</code>. A body that is not a plain object ⇒ <code>{ ok: false, errors: [{ pointer: '#', detail: 'expected object' }] }</code>.</li></ul>
<p>Return <code>{ ok: true, value }</code> (only the valid, cleaned members) or <code>{ ok: false, errors }</code>.</p>`,
  vi: `<p>Để thấy Zod làm giúp bạn những gì, hãy tự viết tay schema <code>DevicePatch</code> của LabFlow. Mọi trường đều tuỳ chọn; kiểm các trường <b>theo thứ tự xuất hiện trong body</b> và gom mọi lỗi dạng <code>{ pointer: '#/' + khoá, detail }</code>:</p><ul>
<li><code>labId</code>: chuỗi khớp <code>^lab_\\d+$</code>, ngược lại <code>'must look like lab_1'</code></li>
<li><code>name</code>: không phải chuỗi ⇒ <code>'expected string'</code>; độ dài sau khi trim ngoài 1–100 ⇒ <code>'length 1-100'</code>; giá trị giữ lại là bản <b>đã trim</b></li>
<li><code>type</code>: một trong ROUTER, SWITCH, BOARD, PC, OTHER; <code>status</code>: một trong AVAILABLE, IN_USE, MAINTENANCE — ngược lại <code>'invalid option'</code></li>
<li><code>serialNo</code>: chuỗi khớp <code>^[A-Z0-9-]{6,20}$</code>, ngược lại <code>'invalid serial'</code></li>
<li><code>note</code>: được phép <code>null</code> (xoá); còn lại phải là chuỗi, ngược lại <code>'expected string or null'</code>; độ dài sau trim &gt; 500 ⇒ <code>'length 0-500'</code>; giữ bản đã trim</li>
<li>khoá khác ⇒ <code>'unknown field'</code>. Body không phải object thường ⇒ <code>{ ok: false, errors: [{ pointer: '#', detail: 'expected object' }] }</code>.</li></ul>
<p>Trả <code>{ ok: true, value }</code> (chỉ các trường hợp lệ, đã làm sạch) hoặc <code>{ ok: false, errors }</code>.</p>`,
  dauVao: ['body — any JSON value (the parsed request body).', 'body — giá trị JSON bất kỳ (body đã phân tích).'],
  dauRa: ['{ ok: true, value } or { ok: false, errors: [{ pointer, detail }] }', '{ ok: true, value } hoặc { ok: false, errors: [{ pointer, detail }] }'],
  goiY: [['Object.keys(body).forEach — one branch per known key, a final else for unknown keys.', 'Object.keys(body).forEach — mỗi khoá đã biết một nhánh, nhánh else cuối cho khoá lạ.'], ['Check typeof before calling .trim() — 123.trim() throws.', 'Kiểm typeof trước khi gọi .trim() — 123.trim() ném lỗi.']],
  loi: [['Stopping at the first error.', 'Dừng ở lỗi đầu tiên.'], ['Copying unknown keys into value — that is the mass-assignment hole of Chapter 1.', 'Chép khoá lạ vào value — đó chính là lỗ mass assignment của Chương 1.']],
  gt: ['Forty lines for one small schema, and every resource needs one: this is the wall of ifs a schema library replaces. The behaviour is exactly what LabFlow’s strict partial Zod schema gives — all errors at once, unknown keys refused, values cleaned.', 'Bốn mươi dòng cho một schema nhỏ, và tài nguyên nào cũng cần một cái: đây chính là bức tường if mà thư viện schema thay thế. Hành vi giống hệt schema Zod strict partial của LabFlow — mọi lỗi một lần, khoá lạ bị từ chối, giá trị được làm sạch.'],
  kn: ['validation', 'mass assignment'],
  tns: [tn('partial', 'mọi trường tuỳ chọn'), tn('trim', 'cắt khoảng trắng hai đầu')],
  dau: `/** body ⇒ { ok: true, value } | { ok: false, errors: [{ pointer, detail }] } */
function validateDevicePatch(body) {
  // Write your solution here
  if (body.name !== undefined && typeof body.name !== 'string')
    return { ok: false, errors: [{ pointer: '#/name', detail: 'expected string' }] };
  return { ok: true, value: body };
}
`,
  giai: '// Reference solution\n' + nguon(validateDevicePatch),
  cases: [
    { goi: goi('validateDevicePatch', { name: 123, isAdmin: true }), moTa: ['Hole 1 of lesson 2.2', 'Lỗ hổng 1 của bài 2.2'] },
    { goi: goi('validateDevicePatch', { status: 'MAINTENANCE', note: null }) },
    { goi: goi('validateDevicePatch', { name: '  Cisco Router 2901  ', status: 'BROKEN' }) },
    { goi: goi('validateDevicePatch', { labId: 5 }), an: true },
    { goi: goi('validateDevicePatch', { serialNo: 'foc1932x0k7', type: 'ROUTER' }), an: true },
    { goi: goi('validateDevicePatch', { name: '   ' }), an: true },
    { goi: goi('validateDevicePatch', [{ name: 'x' }]), an: true },
    { goi: goi('validateDevicePatch', null), an: true },
    { goi: goi('validateDevicePatch', { note: 42, id: 'dev_9', labId: 'lab_2' }), an: true },
    { goi: goi('validateDevicePatch', {}), an: true },
    { goi: goi('validateDevicePatch', { note: '  Thiếu thẻ nhớ  ', serialNo: 'RPI5-00421' }), an: true },
  ],
});

/* ── 4. Tự viết: coerceQuery ── */
function coerceQuery(query, spec) {
  var value = {}, errors = [];
  Object.keys(query).forEach(function (k) {
    var v = query[k], t = spec[k];
    if (!t) { errors.push({ parameter: k, detail: 'unknown parameter' }); return; }
    if (typeof v !== 'string') { errors.push({ parameter: k, detail: 'expected a single value' }); return; }
    if (t === 'string') { if (v.trim()) value[k] = v.trim(); else errors.push({ parameter: k, detail: 'must not be empty' }); }
    else if (t === 'int') {
      if (/^\d+$/.test(v) && Number(v) >= 1) value[k] = Number(v);
      else errors.push({ parameter: k, detail: 'expected an integer >= 1' });
    } else if (t === 'bool') {
      if (v === 'true') value[k] = true;
      else if (v === 'false') value[k] = false;
      else errors.push({ parameter: k, detail: 'expected true or false' });
    }
  });
  return errors.length ? { ok: false, errors: errors } : { ok: true, value: value };
}
const V4 = jsBai({
  ten: 'Validation 4 — Write coerceQuery(query, spec): strings in, types out', kho: 'MEDIUM', phut: 15,
  en: `<p>Express hands you <code>req.query</code> with <b>strings</b> (and arrays when a key repeats). Write <code>coerceQuery(query, spec)</code> where <code>spec</code> maps each allowed parameter to <code>'string'</code>, <code>'int'</code> or <code>'bool'</code>. For each key of <code>query</code>, in order:</p><ul>
<li>not in <code>spec</code> ⇒ error <code>'unknown parameter'</code>; not a string (an array) ⇒ <code>'expected a single value'</code></li>
<li><code>string</code>: trimmed, non-empty, else <code>'must not be empty'</code></li>
<li><code>int</code>: only digits and ≥ 1 ⇒ a number, else <code>'expected an integer >= 1'</code> (<code>"2.5"</code>, <code>""</code>, <code>"0"</code>, <code>"25abc"</code> are refused)</li>
<li><code>bool</code>: exactly <code>"true"</code> ⇒ <code>true</code>, <code>"false"</code> ⇒ <code>false</code>, else <code>'expected true or false'</code> — the <code>z.coerce.boolean()</code> trap avoided</li></ul>
<p>Errors are <code>{ parameter, detail }</code>. Return <code>{ ok: true, value }</code> or <code>{ ok: false, errors }</code>.</p>`,
  vi: `<p>Express đưa bạn <code>req.query</code> toàn <b>chuỗi</b> (và mảng khi một khoá lặp lại). Viết <code>coerceQuery(query, spec)</code> với <code>spec</code> ánh xạ mỗi tham số được phép sang <code>'string'</code>, <code>'int'</code> hoặc <code>'bool'</code>. Với mỗi khoá của <code>query</code>, theo thứ tự:</p><ul>
<li>không có trong <code>spec</code> ⇒ lỗi <code>'unknown parameter'</code>; không phải chuỗi (là mảng) ⇒ <code>'expected a single value'</code></li>
<li><code>string</code>: đã trim, không rỗng, ngược lại <code>'must not be empty'</code></li>
<li><code>int</code>: chỉ gồm chữ số và ≥ 1 ⇒ thành số, ngược lại <code>'expected an integer >= 1'</code> (<code>"2.5"</code>, <code>""</code>, <code>"0"</code>, <code>"25abc"</code> đều bị từ chối)</li>
<li><code>bool</code>: đúng <code>"true"</code> ⇒ <code>true</code>, <code>"false"</code> ⇒ <code>false</code>, ngược lại <code>'expected true or false'</code> — tránh cái bẫy <code>z.coerce.boolean()</code></li></ul>
<p>Lỗi có dạng <code>{ parameter, detail }</code>. Trả <code>{ ok: true, value }</code> hoặc <code>{ ok: false, errors }</code>.</p>`,
  dauVao: ['query — { key: string | string[] }; spec — { key: "string" | "int" | "bool" }.', 'query — { khoá: chuỗi | mảng chuỗi }; spec — { khoá: "string" | "int" | "bool" }.'],
  dauRa: ['{ ok: true, value } or { ok: false, errors: [{ parameter, detail }] }', '{ ok: true, value } hoặc { ok: false, errors: [{ parameter, detail }] }'],
  goiY: [['/^\\d+$/ rejects "", "2.5" and "25abc" at once.', '/^\\d+$/ loại cả "", "2.5" và "25abc".'], ['Compare bool strings exactly — do not use Boolean(v).', 'So chuỗi boolean chính xác — đừng dùng Boolean(v).']],
  loi: [['Number("") is 0 and Number("25abc") is NaN — Number() alone is not a validator.', 'Number("") là 0, Number("25abc") là NaN — chỉ Number() không phải là bộ kiểm.'], ['Ignoring unknown keys: a misspelled filter silently returns wrong data (lesson 1.4).', 'Bỏ qua khoá lạ: bộ lọc gõ sai lặng lẽ trả dữ liệu sai (bài 1.4).']],
  gt: ['Query strings have no types; the API decides them. Refusing arrays, empty strings and fuzzy booleans keeps every filter honest — the same contract LabsQuery enforces with Zod in LabFlow.', 'Query string không có kiểu; API quyết kiểu. Từ chối mảng, chuỗi rỗng và boolean mập mờ giữ cho mọi bộ lọc trung thực — đúng hợp đồng mà LabsQuery ép bằng Zod trong LabFlow.'],
  kn: ['query parsing', 'coercion'],
  tns: [tn('query parameter', 'tham số truy vấn'), tn('coercion', 'ép kiểu')],
  dau: `/** query (strings) + spec ⇒ { ok, value | errors } */
function coerceQuery(query, spec) {
  // Write your solution here
  var value = {};
  Object.keys(query).forEach(function (k) {
    value[k] = spec[k] === 'int' ? Number(query[k]) : spec[k] === 'bool' ? Boolean(query[k]) : query[k];
  });
  return { ok: true, value: value };
}
`,
  giai: '// Reference solution\n' + nguon(coerceQuery),
  cases: [
    { goi: goi('coerceQuery', { minCapacity: '25' }, { building: 'string', minCapacity: 'int', onlyAvailable: 'bool' }) },
    { goi: goi('coerceQuery', { minCapacity: 'abc', Building: 'Beta' }, { building: 'string', minCapacity: 'int' }), moTa: ['The real 400 of lesson 2.2', '400 thật của bài 2.2'] },
    { goi: goi('coerceQuery', { onlyAvailable: 'false' }, { onlyAvailable: 'bool' }) },
    { goi: goi('coerceQuery', { minCapacity: ['10', '20'] }, { minCapacity: 'int' }), an: true },
    { goi: goi('coerceQuery', { minCapacity: '2.5' }, { minCapacity: 'int' }), an: true },
    { goi: goi('coerceQuery', { minCapacity: '' }, { minCapacity: 'int' }), an: true },
    { goi: goi('coerceQuery', { building: '  Alpha ', onlyAvailable: 'true' }, { building: 'string', onlyAvailable: 'bool' }), an: true },
    { goi: goi('coerceQuery', { onlyAvailable: 'yes', building: '   ' }, { building: 'string', onlyAvailable: 'bool' }), an: true },
    { goi: goi('coerceQuery', {}, { building: 'string' }), an: true },
  ],
});

export default doiDau({ slug: 'api-2-2-validation', ten: '2.2 Validating input at the edge', khoa: KHOA, baiHoc: 'api-2-2-validation', de: [V1, V2, V3, V4] });
