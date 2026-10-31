/** API Design · 2.1 — Problem Details (RFC 9457): năm trường + luật, tình huống thật của LabFlow; tự viết toProblem + parsePointer. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_api.mjs';

/* ── 1. Năm trường ── */
const Y = ['what kind of problem — clients branch on it', 'short summary, the same every time', 'the HTTP code repeated (advisory)', 'what went wrong this time', 'this occurrence (LabFlow: the path)', 'an extension member'];
const P409 = `HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset=utf-8

{
  "type": "https://labflow.example/problems/booking-conflict",
  "title": "Trùng lịch phòng",
  "status": 409,
  "detail": "Phòng đã có lượt bk_1 trong khung giờ này",
  "instance": "/bookings",
  "code": "BOOKING_CONFLICT",
  "conflictWith": "bk_1"
}`;
const P1 = cs({
  ten: 'Problems 1 — Read a real problem document', kho: 'EASY', phut: 8, loai: 'table',
  en: `A real LabFlow answer after lesson 2.1 (An holds 8–10h, Bình asks for 9–11h):${pre(P409)}Match each member to its role in RFC 9457.`,
  vi: `Một câu trả lời thật của LabFlow sau bài 2.1 (An giữ 8–10h, Bình xin 9–11h):${pre(P409)}Ghép mỗi trường với vai trò của nó trong RFC 9457.`,
  bang: [bang1('b1', ['Member → role', 'Trường → vai trò'], [{ ma: 'x', ten: 'Member' }, { ma: 'r', ten: 'Role', luaChon: Y }], [
    { o: { x: 'type' }, a: { r: Y[0] } }, { o: { x: 'title' }, a: { r: Y[1] } }, { o: { x: 'status' }, a: { r: Y[2] } },
    { o: { x: 'detail' }, a: { r: Y[3] } }, { o: { x: 'instance' }, a: { r: Y[4] } }, { o: { x: 'conflictWith' }, a: { r: Y[5] } },
  ], ['type is the identifier (default about:blank); title SHOULD NOT change between occurrences except for localisation; status is advisory and must match the status line; detail helps the client correct the problem; instance identifies the occurrence. Anything else — code, conflictWith, errors — is an extension, and clients MUST ignore extensions they do not know.', 'type là định danh (mặc định about:blank); title KHÔNG NÊN đổi giữa các lần trừ khi dịch; status chỉ để tham khảo và phải khớp dòng trạng thái; detail giúp client sửa request; instance định danh lần xảy ra. Mọi thứ khác — code, conflictWith, errors — là trường mở rộng, và client PHẢI bỏ qua trường mở rộng mình không biết.'])],
  goiY: [['Ask which value would be the same for every booking conflict.', 'Hỏi giá trị nào sẽ giống nhau ở mọi lần trùng lịch.'], ['Five members are standard; the rest are extensions.', 'Năm trường là chuẩn; phần còn lại là mở rộng.']],
  loi: [['Thinking detail is fixed and title varies — it is the other way round.', 'Nghĩ detail cố định còn title thay đổi — ngược lại mới đúng.'], ['Treating status in the body as the real status.', 'Coi status trong body là mã trạng thái thật.']],
  tns: [tn('problem details', 'chi tiết vấn đề', 'RFC 9457, media type application/problem+json.'), tn('extension member', 'trường mở rộng')],
  kn: ['RFC 9457'],
});

/* ── 2. Tình huống ── */
const P2 = cs({
  ten: 'Problems 2 — Situations from the LabFlow log', kho: 'MEDIUM', phut: 10,
  en: 'Situations met while moving LabFlow to RFC 9457 (lesson 2.1). Choose the answer the RFC and the lesson support.',
  vi: 'Những tình huống gặp khi chuyển LabFlow sang RFC 9457 (bài 2.1). Chọn đáp án được RFC và bài học ủng hộ.',
  cau: [
    q('c1', ['Chapter 1 code: a 200 KB body comes back as 500 INTERNAL. The server log shows type "entity.too.large", limit 102400. The right fix?', 'Code Chương 1: body 200 KB trả về 500 INTERNAL. Log server có type "entity.too.large", limit 102400. Cách sửa đúng?'], ['Map entity.too.large to 413 with the limit in detail — in the one error handler', 'Raise the limit to 1 MB so the error never happens', 'Catch the error inside every route that reads the body', 'Keep 500 — the server could not process the request'], ['Express already decided 413; the hand-made handler threw that away. One handler change fixes every endpoint; raising the limit only moves the problem.', 'Express đã quyết là 413; bộ xử lý tự chế vứt mất điều đó. Sửa một bộ xử lý là sửa mọi endpoint; nâng giới hạn chỉ dời vấn đề đi chỗ khác.']),
    q('c2', ['A 2025 mobile app receives a problem with a member "existing": "iss_1" it has never heard of. Per RFC 9457 it must …', 'Một app mobile năm 2025 nhận problem có trường "existing": "iss_1" chưa từng biết. Theo RFC 9457 nó phải …'], ['ignore the unknown extension and keep working', 'treat the whole response as invalid', 'fetch the type URI to learn what "existing" means', 'show "existing" to the user as an error message'], ['Clients MUST ignore unrecognised extensions — that is what makes adding members safe. Clients SHOULD NOT dereference the type URI automatically.', 'Client PHẢI bỏ qua trường mở rộng không nhận ra — chính điều đó làm việc thêm trường an toàn. Client KHÔNG NÊN tự động mở URI của type.']),
    q('c3', ['A teammate writes "title": "Lab lab_9 not found". What breaks?', 'Một bạn viết "title": "Lab lab_9 not found". Cái gì hỏng?'], ['Dashboards that group by title see one group per id instead of one problem type', 'Nothing — title is free text for humans', 'JSON parsing, because titles may not contain ids', 'The status code, which becomes 400'], ['title SHOULD NOT change between occurrences except for localisation. Ids belong in detail or an extension.', 'title KHÔNG NÊN đổi giữa các lần trừ khi dịch. Id thuộc về detail hoặc trường mở rộng.']),
    q('c4', ['Which detail follows RFC 9457’s guidance?', 'detail nào theo đúng hướng dẫn của RFC 9457?'], ['"Phòng đã có lượt bk_1 trong khung giờ này"', '"TypeError at /srv/labflow/src/app.js:20"', '"SELECT * FROM bookings WHERE lab_id = 1 failed"', '"Error: see server log line 4512 for the stack"'], ['detail should help the client correct the request. Stack traces, paths and SQL leak internals and belong in the server log.', 'detail nên giúp client sửa request. Stack trace, đường dẫn và SQL làm lộ nội bộ và thuộc về log server.']),
    q('c5', ['The RFC’s own validation example answers 422, LabFlow answers 400 for a wrong shape. Which statement is right?', 'Ví dụ kiểm dữ liệu của chính RFC trả 422, LabFlow trả 400 khi sai hình dạng. Câu nào đúng?'], ['The RFC example is an illustration; what matters is one documented, consistent choice', 'LabFlow violates RFC 9457 and must switch to 422', 'RFC 9457 forbids 400 for validation errors', 'Both must be sent: 400 in the status line, 422 in the body'], ['RFC 9457 defines the error body, not which 4xx to pick. status in the body must match the real status line.', 'RFC 9457 định nghĩa body lỗi, không quy định chọn mã 4xx nào. status trong body phải khớp dòng trạng thái thật.']),
  ],
  goiY: [['Separate what is fixed (type, title) from what changes (detail, instance).', 'Tách thứ cố định (type, title) khỏi thứ thay đổi (detail, instance).'], ['The RFC text quoted in the lesson answers each one.', 'Đoạn RFC trích trong bài trả lời từng câu.']],
  loi: [['Putting debugging information into detail.', 'Nhét thông tin gỡ lỗi vào detail.'], ['Believing the RFC dictates 422 for validation.', 'Tin rằng RFC bắt buộc 422 cho lỗi kiểm dữ liệu.']],
  tns: [tn('about:blank', 'loại lỗi trống', 'Không có ý nghĩa gì ngoài mã trạng thái.'), tn('dereference', 'mở / tải một URI')],
  kn: ['RFC 9457 rules'],
});

/* ── 3. Tự viết: toProblem ── */
function toProblem(err, instance, titles) {
  var PHRASES = { 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed',
    409: 'Conflict', 410: 'Gone', 413: 'Content Too Large', 415: 'Unsupported Media Type', 422: 'Unprocessable Content', 500: 'Internal Server Error' };
  var p = {};
  p.type = err.code ? 'https://labflow.example/problems/' + err.code.toLowerCase().split('_').join('-') : 'about:blank';
  p.title = (err.code && titles[err.code]) || PHRASES[err.status];
  p.status = err.status;
  if (err.message !== undefined) p.detail = err.message;
  p.instance = instance;
  if (err.code) p.code = err.code;
  if (Array.isArray(err.details)) {
    p.errors = err.details.map(function (d) { return { pointer: '#/' + d.field, detail: d.issue }; });
  } else if (err.details) {
    Object.keys(err.details).forEach(function (k) { p[k] = err.details[k]; });
  }
  return p;
}
const TITLES = { BOOKING_CONFLICT: 'Trùng lịch phòng', LAB_NOT_FOUND: 'Không tìm thấy phòng lab', VALIDATION_FAILED: 'Dữ liệu gửi lên không hợp lệ', PAYLOAD_TOO_LARGE: 'Body quá lớn' };
const P3 = jsBai({
  ten: 'Problems 3 — Write toProblem(err, instance, titles)', kho: 'HARD', phut: 20,
  en: `<p>Re-create LabFlow’s <code>sendProblem</code> body as a pure function. <code>err = { status, code?, message?, details? }</code> (an <code>HttpError</code>), <code>instance</code> = the request path, <code>titles</code> = the TITLES table. Build the object in this member order:</p><ol>
<li><code>type</code>: <code>'https://labflow.example/problems/' + code</code> in lower case with <code>_</code> → <code>-</code>; no code ⇒ <code>'about:blank'</code>.</li>
<li><code>title</code>: <code>titles[code]</code>; if there is no code or no title, the standard phrase of the status: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 409 Conflict, 410 Gone, 413 Content Too Large, 415 Unsupported Media Type, 422 Unprocessable Content, 500 Internal Server Error.</li>
<li><code>status</code>; <code>detail</code> = <code>message</code> only if it is defined; <code>instance</code>; <code>code</code> only if defined.</li>
<li><code>details</code> an <b>array</b> of <code>{ field, issue }</code> ⇒ <code>errors: [{ pointer: '#/' + field, detail: issue }]</code>; <code>details</code> an <b>object</b> ⇒ copy its members onto the problem (extensions such as <code>conflictWith</code>).</li></ol>`,
  vi: `<p>Dựng lại body của <code>sendProblem</code> trong LabFlow thành hàm thuần. <code>err = { status, code?, message?, details? }</code> (một <code>HttpError</code>), <code>instance</code> = đường dẫn request, <code>titles</code> = bảng TITLES. Dựng object theo thứ tự trường:</p><ol>
<li><code>type</code>: <code>'https://labflow.example/problems/' + code</code> viết thường, <code>_</code> → <code>-</code>; không có code ⇒ <code>'about:blank'</code>.</li>
<li><code>title</code>: <code>titles[code]</code>; không có code hoặc không có title thì dùng cụm chuẩn của mã: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 409 Conflict, 410 Gone, 413 Content Too Large, 415 Unsupported Media Type, 422 Unprocessable Content, 500 Internal Server Error.</li>
<li><code>status</code>; <code>detail</code> = <code>message</code> chỉ khi có; <code>instance</code>; <code>code</code> chỉ khi có.</li>
<li><code>details</code> là <b>mảng</b> <code>{ field, issue }</code> ⇒ <code>errors: [{ pointer: '#/' + field, detail: issue }]</code>; <code>details</code> là <b>object</b> ⇒ chép các trường của nó vào problem (trường mở rộng như <code>conflictWith</code>).</li></ol>`,
  dauVao: ['err, instance (string), titles ({ CODE: title }).', 'err, instance (chuỗi), titles ({ MÃ: tiêu đề }).'],
  dauRa: ['A problem object.', 'Một object problem.'],
  goiY: [['code.toLowerCase().split("_").join("-") turns BOOKING_CONFLICT into booking-conflict.', 'code.toLowerCase().split("_").join("-") biến BOOKING_CONFLICT thành booking-conflict.'], ['Array.isArray before checking for an object — arrays are objects too.', 'Kiểm Array.isArray trước khi kiểm object — mảng cũng là object.']],
  loi: [['Setting detail: undefined — the checker compares objects, an undefined member is not the same as no member after JSON.', 'Đặt detail: undefined — sau JSON, trường undefined khác với không có trường.'], ['Using about:blank together with a custom title: about:blank means the standard phrase.', 'Dùng about:blank kèm title tự chế: about:blank nghĩa là cụm chuẩn.']],
  gt: ['This is the whole of LabFlow’s error format in one function: type and code derive from the same value, titles live in one table, and both shapes of details are handled once — which is why changing the format in lesson 2.1 needed no route changes.', 'Đây là toàn bộ định dạng lỗi của LabFlow trong một hàm: type và code sinh từ cùng một giá trị, title nằm trong một bảng, và cả hai dạng details được xử lý một lần — vì thế đổi định dạng ở bài 2.1 không phải sửa route nào.'],
  kn: ['RFC 9457', 'single error handler'],
  tns: [tn('reason phrase', 'cụm lý do chuẩn'), tn('extension member', 'trường mở rộng')],
  dau: `/** err = { status, code?, message?, details? } ⇒ RFC 9457 problem object */
function toProblem(err, instance, titles) {
  // Write your solution here
  return { type: err.code, title: titles[err.code], status: err.status, detail: err.message, instance: instance };
}
`,
  giai: '// Reference solution\n' + nguon(toProblem),
  cases: [
    { goi: goi('toProblem', { status: 409, code: 'BOOKING_CONFLICT', message: 'Phòng đã có lượt bk_1 trong khung giờ này', details: { conflictWith: 'bk_1' } }, '/bookings', TITLES), moTa: ['The real 409 of lesson 2.1', '409 thật của bài 2.1'] },
    { goi: goi('toProblem', { status: 400, code: 'VALIDATION_FAILED', message: 'Dữ liệu gửi lên chưa đúng định dạng', details: [{ field: 'startAt', issue: 'must be ISO 8601 with timezone' }, { field: 'endAt', issue: 'must be ISO 8601 with timezone' }] }, '/bookings', TITLES) },
    { goi: goi('toProblem', { status: 413, code: 'PAYLOAD_TOO_LARGE', message: 'Body tối đa 102400 byte, nhận 200104 byte' }, '/bookings', TITLES), an: true },
    { goi: goi('toProblem', { status: 404 }, '/rooms', TITLES), an: true, moTa: ['No code ⇒ about:blank', 'Không có code ⇒ about:blank'] },
    { goi: goi('toProblem', { status: 410, code: 'LAB_RETIRED', message: 'Phòng lab lab_4 đã ngừng sử dụng' }, '/labs/lab_4', TITLES), an: true, moTa: ['Code without a title', 'Có code mà không có title'] },
    { goi: goi('toProblem', { status: 500, code: 'INTERNAL' }, '/report', TITLES), an: true },
    { goi: goi('toProblem', { status: 422, code: 'UNKNOWN_LAB', message: 'labId lab_4 không tồn tại', details: [] }, '/bookings', TITLES), an: true },
  ],
});

/* ── 4. Tự viết: parsePointer ── */
function parsePointer(ptr) {
  if (ptr === '#' || ptr === '') return [];
  if (ptr.charAt(0) === '#') ptr = ptr.slice(1);
  if (ptr.charAt(0) !== '/') return null;
  return ptr.slice(1).split('/').map(function (t) {
    return decodeURIComponent(t).split('~1').join('/').split('~0').join('~');   // ~1 first, then ~0
  });
}
const P4 = jsBai({
  ten: 'Problems 4 — Write parsePointer(ptr): from "#/a/b" to a path', kho: 'MEDIUM', phut: 15,
  en: `<p>A front-end receives <code>errors[].pointer</code> and must find the form field. Write <code>parsePointer(ptr)</code> that turns a JSON Pointer (RFC 6901), in plain form <code>/startAt</code> or URI-fragment form <code>#/startAt</code>, into an array of member names:</p><ul>
<li><code>'#'</code> or <code>''</code> (the whole document) ⇒ <code>[]</code>. Anything not starting with <code>/</code> (after an optional <code>#</code>) ⇒ <code>null</code>.</li>
<li>Split on <code>/</code>. In the fragment form, first undo percent-encoding (<code>decodeURIComponent</code>; do it for both forms, it is harmless).</li>
<li>Unescape each token: <code>~1</code> ⇒ <code>/</code> <b>first</b>, then <code>~0</code> ⇒ <code>~</code>. (The order matters: <code>~01</code> must become <code>~1</code>, not <code>/</code>.)</li></ul>`,
  vi: `<p>Front-end nhận <code>errors[].pointer</code> và phải tìm ra ô nhập. Viết <code>parsePointer(ptr)</code> đổi một JSON Pointer (RFC 6901), dạng thường <code>/startAt</code> hoặc dạng đuôi URI <code>#/startAt</code>, thành mảng tên trường:</p><ul>
<li><code>'#'</code> hoặc <code>''</code> (cả tài liệu) ⇒ <code>[]</code>. Không bắt đầu bằng <code>/</code> (sau dấu <code>#</code> tuỳ chọn) ⇒ <code>null</code>.</li>
<li>Tách theo <code>/</code>. Dạng đuôi URI thì gỡ mã hoá phần trăm trước (<code>decodeURIComponent</code>; làm cho cả hai dạng cũng vô hại).</li>
<li>Gỡ thoát từng đoạn: <code>~1</code> ⇒ <code>/</code> <b>trước</b>, rồi <code>~0</code> ⇒ <code>~</code>. (Thứ tự quan trọng: <code>~01</code> phải thành <code>~1</code>, không phải <code>/</code>.)</li></ul>`,
  dauVao: ['ptr — a string.', 'ptr — một chuỗi.'],
  dauRa: ['An array of strings, or null.', 'Mảng chuỗi, hoặc null.'],
  goiY: [['Strip one leading "#", then require a leading "/".', 'Bỏ một dấu "#" ở đầu, rồi bắt buộc có "/" ở đầu.'], ['split("~1").join("/") then split("~0").join("~").', 'split("~1").join("/") rồi split("~0").join("~").']],
  loi: [['Replacing ~0 before ~1: "~01" becomes "/" instead of "~1".', 'Thay ~0 trước ~1: "~01" thành "/" thay vì "~1".'], ['Returning [] or null for "#/": it points to a member with an empty name, so RFC 6901 gives [""].', 'Trả [] hoặc null cho "#/": nó trỏ tới một trường tên rỗng, nên theo RFC 6901 kết quả là [""].']],
  gt: ['RFC 6901 escapes "~" as "~0" and "/" as "~1" so a member name can contain them. Decoding in the opposite order of encoding (~1 first) is what makes "~01" round-trip correctly. LabFlow’s toPointer in validate.js is the encoder; this is the decoder a client needs.', 'RFC 6901 thoát "~" thành "~0" và "/" thành "~1" để tên trường chứa được chúng. Giải mã theo thứ tự ngược với lúc mã hoá (~1 trước) giúp "~01" quay về đúng. toPointer trong validate.js của LabFlow là bộ mã hoá; đây là bộ giải mã client cần.'],
  kn: ['JSON Pointer'],
  tns: [tn('JSON Pointer', 'con trỏ JSON', 'RFC 6901: đường dẫn vào tài liệu JSON.'), tn('escape', 'thoát ký tự')],
  dau: `/** "#/profile/color" ⇒ ['profile', 'color'] (RFC 6901) */
function parsePointer(ptr) {
  // Write your solution here
  return ptr.replace('#/', '').split('/');
}
`,
  giai: '// Reference solution\n' + nguon(parsePointer),
  cases: [
    { goi: goi('parsePointer', '#/startAt') }, { goi: goi('parsePointer', '#/profile/color') }, { goi: goi('parsePointer', '#'), moTa: ['The whole document', 'Cả tài liệu'] },
    { goi: goi('parsePointer', '/a~1b/c~0d'), an: true }, { goi: goi('parsePointer', '#/~01'), an: true }, { goi: goi('parsePointer', 'startAt'), an: true },
    { goi: goi('parsePointer', '#/devices/0/serialNo'), an: true }, { goi: goi('parsePointer', '#/Ph%C3%B2ng'), an: true }, { goi: goi('parsePointer', '#/'), an: true },
  ],
});

export default doiDau({ slug: 'api-2-1-problem-details', ten: '2.1 Problem Details (RFC 9457)', khoa: KHOA, baiHoc: 'api-2-1-problem-details', de: [P1, P2, P3, P4] });
