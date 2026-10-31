/** API Design · 1.1 — Mô hình hoá tài nguyên: user story ⇒ URL, mùi RPC, lồng hay lọc, hành động; tự viết lintResourcePath. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. User story ⇒ endpoint ── */
const EP = ['GET /labs', 'POST /bookings', 'GET /labs/{labId}/devices', 'PATCH /devices/{deviceId}', 'POST /bookings/{bookingId}/cancel', 'GET /bookings/{bookingId}'];
const R1 = cs({
  ten: 'Resources 1 — From user story to endpoint', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Underline the nouns, circle the verbs. For each LabFlow user story choose the endpoint designed in lesson 1.1.',
  vi: 'Gạch chân danh từ, khoanh động từ. Với mỗi user story của LabFlow, chọn endpoint đã thiết kế trong bài 1.1.',
  bang: [bang1('b1', ['Story → endpoint', 'Story → endpoint'], [{ ma: 'x', ten: 'User story' }, { ma: 'e', ten: 'Endpoint', luaChon: EP }], [
    { o: { x: 'As a student, I see which labs exist and where they are' }, a: { e: EP[0] } },
    { o: { x: 'As a student, I book a lab for Monday 8–10h' }, a: { e: EP[1] } },
    { o: { x: 'As a student, I see the devices in lab_1 on its detail screen' }, a: { e: EP[2] } },
    { o: { x: 'As a lab manager, I mark a device as under repair' }, a: { e: EP[3] } },
    { o: { x: 'As a student, I cancel my booking' }, a: { e: EP[4] } },
    { o: { x: 'As a student, I open the booking I made yesterday' }, a: { e: EP[5] } },
  ], ['“Book” creates a booking (POST to the collection). “Mark under repair” is not a new thing — it changes the device’s status field (PATCH). “Cancel” carries its own rules (only the owner, not twice), so it becomes an explicit action resource.', '"Đặt" tạo ra một booking (POST vào bộ sưu tập). "Đánh dấu đang sửa" không phải thứ mới — nó đổi trường status của thiết bị (PATCH). "Huỷ" có luật riêng (chỉ chủ, không huỷ hai lần) nên thành một tài nguyên hành động rõ ràng.'])],
  goiY: [['Behind most verbs there is a record the business keeps.', 'Sau hầu hết động từ là một bản ghi mà nghiệp vụ muốn lưu.'], ['A “detail screen of one lab” reads naturally as a nested collection.', '"Màn chi tiết của một phòng" đọc tự nhiên thành bộ sưu tập lồng.']],
  loi: [['Inventing POST /devices/{id}/repair for a plain field change.', 'Bịa ra POST /devices/{id}/repair cho một thay đổi trường bình thường.'], ['Using DELETE /bookings/{id} for cancel — the booking must stay in history.', 'Dùng DELETE /bookings/{id} để huỷ — booking phải còn trong lịch sử.']],
  tns: [tn('collection', 'bộ sưu tập'), tn('item', 'phần tử'), tn('action resource', 'tài nguyên hành động')],
  kn: ['resource modelling'],
});

/* ── 2. Mùi RPC, lồng hay lọc ── */
const R2 = cs({
  ten: 'Resources 2 — Smells, nesting and filters', kho: 'MEDIUM', phut: 10,
  en: 'Questions from a design review of LabFlow. Real facts from the lesson: GET /labs/lab_9/devices ⇒ 404 LAB_NOT_FOUND, GET /devices?labId=lab_9 ⇒ 200 {"data": []}.',
  vi: 'Các câu hỏi từ một buổi review thiết kế LabFlow. Sự thật từ bài học: GET /labs/lab_9/devices ⇒ 404 LAB_NOT_FOUND, GET /devices?labId=lab_9 ⇒ 200 {"data": []}.',
  cau: [
    q('c1', ['Why is GET /deleteDevice?id=dev_3 the most dangerous row of the RPC table?', 'Vì sao GET /deleteDevice?id=dev_3 là dòng nguy hiểm nhất của bảng RPC?'], ['Prefetchers, crawlers and monitors call GET URLs freely and will delete data', 'GET requests cannot carry a query string, so the id never reaches the server', 'The URL is too long for some proxies and gets cut before the id', 'It returns 200 instead of 204, so clients think nothing was deleted'], ['GET is promised to be safe. Tools that rely on that promise will trigger the deletion without any user deciding to.', 'GET được hứa là an toàn. Công cụ dựa vào lời hứa đó sẽ kích hoạt việc xoá mà không người dùng nào quyết định.']),
    q('c2', ['A wrong lab id gives 404 on the nested URL but 200 [] on the filter. Is that a bug?', 'Id phòng sai cho 404 ở URL lồng nhưng 200 [] ở bộ lọc. Đó có phải bug?'], ['No — nested checks the parent exists; an empty filter result is a success', 'Yes — both endpoints must return 404 LAB_NOT_FOUND for an unknown lab', 'Yes — both endpoints must return 200 with an empty data list', 'No — but only because lab_9 was retired, so the two answers differ'], ['“The devices of lab_9” presumes lab_9 exists. “Devices whose labId is lab_9” is a search, and an empty search is a success.', '"Thiết bị của lab_9" mặc định lab_9 tồn tại. "Thiết bị có labId là lab_9" là một phép tìm, và tìm không ra vẫn là thành công.']),
    q('c3', ['A teammate proposes /buildings/alpha/labs/lab_1/devices/dev_1/issues/iss_3. Main problem?', 'Một bạn đề xuất /buildings/alpha/labs/lab_1/devices/dev_1/issues/iss_3. Vấn đề chính?'], ['Clients need every parent id, and moving a device changes its issues’ URLs', 'URLs longer than 50 characters are invalid according to RFC 9110', 'Express cannot route a path with more than three segments in it', 'Issues are events, so they cannot be modelled as resources at all'], ['Stop at one level of nesting. iss_3 is unique on its own, so /issues/iss_3 is enough; /devices/{id}/issues serves the device screen.', 'Dừng ở một cấp lồng. iss_3 tự nó đã duy nhất nên /issues/iss_3 là đủ; /devices/{id}/issues phục vụ màn thiết bị.']),
    q('c4', ['Which URL follows LabFlow’s URL rules?', 'URL nào theo đúng luật URL của LabFlow?'], ['/lab-rooms?building=Alpha', '/labRooms?building=Alpha', '/lab_rooms.json?building=Alpha', '/LabRooms/?building=Alpha'], ['Plural, lowercase, words joined by hyphens, no extension, no trailing slash, options in the query.', 'Số nhiều, chữ thường, nối từ bằng gạch ngang, không đuôi tệp, không gạch chéo cuối, tuỳ chọn ở query.']),
    q('c5', ['Why is cancel POST /bookings/{id}/cancel and not PATCH {"status": "CANCELLED"}?', 'Vì sao huỷ là POST /bookings/{id}/cancel chứ không phải PATCH {"status": "CANCELLED"}?'], ['It has its own rules (owner only, not twice); an explicit action enforces them', 'PATCH is not allowed to change a field called status on any resource', 'POST is processed faster than PATCH by Node’s HTTP parser', 'Express does not support PATCH on routes that end with an id'], ['A generic PATCH would let clients set any status (even APPROVED). The action has one meaning and its own errors (409 ALREADY_CANCELLED).', 'PATCH chung chung cho client đặt status bất kỳ (kể cả APPROVED). Hành động có một nghĩa duy nhất và lỗi riêng (409 ALREADY_CANCELLED).']),
  ],
  goiY: [['Ask what the client must know before it can call the URL.', 'Hỏi client phải biết gì trước khi gọi được URL.'], ['Safe methods may be called by machines without asking anyone.', 'Phương thức an toàn có thể bị máy gọi mà không hỏi ai.']],
  loi: [['Treating a filter that matches nothing as “not found”.', 'Coi bộ lọc không khớp gì là "không tìm thấy".'], ['Mirroring the whole real-world hierarchy in the URL.', 'Sao chép cả cây phân cấp ngoài đời vào URL.']],
  tns: [tn('RPC style', 'kiểu gọi thủ tục'), tn('nested resource', 'tài nguyên lồng'), tn('filter', 'bộ lọc')],
  kn: ['URL design'],
});

/* ── 3. Tự viết: lintResourcePath ── */
function lintResourcePath(path) {
  var found = {};
  if (path.length > 1 && path.endsWith('/')) found.TRAILING_SLASH = true;
  var segs = path.split('/').filter(function (s) { return s !== ''; });
  var isParam = function (s) { return /^\{[A-Za-z]+\}$/.test(s); };
  var params = 0;
  segs.forEach(function (s, i) {
    if (isParam(s)) { params++; return; }
    var word = s;
    if (/\.[A-Za-z]+$/.test(word)) { found.FILE_EXTENSION = true; word = word.replace(/\.[A-Za-z]+$/, ''); }
    if (/^(get|create|update|delete|add|remove|fetch|list)([A-Z_-]|$)/i.test(word)) found.VERB = true;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(word)) found.NOT_LOWER_KEBAB = true;
    var next = segs[i + 1];
    if (next && isParam(next) && !/s$/.test(word)) found.SINGULAR_COLLECTION = true;
  });
  if (params > 1) found.TOO_DEEP = true;
  return ['TRAILING_SLASH', 'FILE_EXTENSION', 'VERB', 'NOT_LOWER_KEBAB', 'SINGULAR_COLLECTION', 'TOO_DEEP'].filter(function (c) { return found[c]; });
}
const R3 = jsBai({
  ten: 'Resources 3 — Write lintResourcePath(path): review URLs automatically', kho: 'HARD', phut: 25,
  en: `<p>Teams enforce URL rules with a linter in CI instead of arguing in every review. Write <code>lintResourcePath(path)</code> for a documented path template like <code>/labs/{labId}/devices</code>. Placeholders are <code>{name}</code> (letters only); every other non-empty segment is a <b>literal</b>. Return the codes that apply, <b>in this order</b>, each at most once (<code>[]</code> = clean):</p><ol>
<li><code>TRAILING_SLASH</code> — the path is longer than <code>/</code> and ends with <code>/</code>.</li>
<li><code>FILE_EXTENSION</code> — a literal ends with <code>.letters</code> (<code>labs.json</code>). Strip the extension before the next checks.</li>
<li><code>VERB</code> — a literal starts with get, create, update, delete, add, remove, fetch or list (any case) followed by an upper-case letter, <code>-</code>, <code>_</code> or the end: <code>getLabs</code>, <code>delete-device</code>, <code>list</code>. (<code>cancel</code> after an id is an allowed action; <code>listings</code> is a noun.)</li>
<li><code>NOT_LOWER_KEBAB</code> — a literal is not lowercase letters/digits joined by single hyphens.</li>
<li><code>SINGULAR_COLLECTION</code> — a literal directly followed by a placeholder does not end with <code>s</code> (<code>/lab/{labId}</code>).</li>
<li><code>TOO_DEEP</code> — more than one placeholder (stop at one level of nesting).</li></ol>`,
  vi: `<p>Các nhóm ép luật URL bằng một linter trong CI thay vì cãi nhau ở mỗi buổi review. Viết <code>lintResourcePath(path)</code> cho một mẫu path trong tài liệu như <code>/labs/{labId}/devices</code>. Chỗ giữ là <code>{tên}</code> (chỉ chữ cái); mọi đoạn khác không rỗng là <b>chữ cố định</b>. Trả về các mã vi phạm, <b>theo đúng thứ tự này</b>, mỗi mã tối đa một lần (<code>[]</code> = sạch):</p><ol>
<li><code>TRAILING_SLASH</code> — path dài hơn <code>/</code> và kết thúc bằng <code>/</code>.</li>
<li><code>FILE_EXTENSION</code> — một chữ cố định kết thúc bằng <code>.chữ</code> (<code>labs.json</code>). Bỏ đuôi đó trước khi kiểm tiếp.</li>
<li><code>VERB</code> — chữ cố định bắt đầu bằng get, create, update, delete, add, remove, fetch hoặc list (hoa thường bất kỳ) theo sau là chữ HOA, <code>-</code>, <code>_</code> hoặc hết chuỗi: <code>getLabs</code>, <code>delete-device</code>, <code>list</code>. (<code>cancel</code> sau một id là hành động được phép; <code>listings</code> là danh từ.)</li>
<li><code>NOT_LOWER_KEBAB</code> — chữ cố định không phải chữ thường/số nối bằng một gạch ngang.</li>
<li><code>SINGULAR_COLLECTION</code> — chữ cố định đứng ngay trước một chỗ giữ mà không tận cùng bằng <code>s</code> (<code>/lab/{labId}</code>).</li>
<li><code>TOO_DEEP</code> — nhiều hơn một chỗ giữ (dừng ở một cấp lồng).</li></ol>`,
  dauVao: ['path — a path template starting with /.', 'path — một mẫu path bắt đầu bằng /.'],
  dauRa: ['An array of codes in the fixed order.', 'Mảng mã theo thứ tự cố định.'],
  goiY: [['Collect findings in an object, then filter a fixed list of codes — order and uniqueness come for free.', 'Gom vi phạm vào một object rồi lọc một danh sách mã cố định — thứ tự và tính duy nhất tự có.'], ['split("/") then filter out empty strings; look at segs[i + 1] for the singular check.', 'split("/") rồi bỏ chuỗi rỗng; nhìn segs[i + 1] để kiểm số ít.']],
  loi: [['Checking the case of placeholders: {labId} is camelCase on purpose.', 'Kiểm hoa thường của chỗ giữ: {labId} cố ý là camelCase.'], ['Matching “list” anywhere: listings is a noun, not a verb.', 'Khớp "list" ở bất kỳ đâu: listings là danh từ, không phải động từ.']],
  gt: ['Each code is one rule from lesson 1.1, made mechanical. Real linters (Spectral with an OpenAPI ruleset, Zalando’s Zally) do exactly this on the API description file, so URL style is decided once and checked forever.', 'Mỗi mã là một luật của bài 1.1 được máy hoá. Linter thật (Spectral với bộ luật OpenAPI, Zally của Zalando) làm đúng việc này trên tệp mô tả API, nên phong cách URL được quyết một lần và kiểm mãi mãi.'],
  kn: ['URL rules', 'API linting'],
  tns: [tn('linter', 'công cụ soát luật'), tn('placeholder', 'chỗ giữ chỗ'), tn('kebab-case', 'chữ thường nối gạch ngang')],
  dau: `/** "/labs/{labId}/devices" ⇒ [] ; "/getLabs/" ⇒ ['TRAILING_SLASH', 'VERB', 'NOT_LOWER_KEBAB'] */
function lintResourcePath(path) {
  // Write your solution here
  var out = [];
  if (path.endsWith('/')) out.push('TRAILING_SLASH');
  if (path.indexOf('get') >= 0) out.push('VERB');
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(lintResourcePath),
  cases: [
    { goi: goi('lintResourcePath', '/labs/{labId}/devices') },
    { goi: goi('lintResourcePath', '/getLabs/') },
    { goi: goi('lintResourcePath', '/lab/{labId}') },
    { goi: goi('lintResourcePath', '/bookings/{bookingId}/cancel'), an: true },
    { goi: goi('lintResourcePath', '/labs.json'), an: true },
    { goi: goi('lintResourcePath', '/buildings/{buildingId}/labs/{labId}/devices'), an: true },
    { goi: goi('lintResourcePath', '/lab_rooms/{roomId}'), an: true },
    { goi: goi('lintResourcePath', '/delete-device'), an: true },
    { goi: goi('lintResourcePath', '/listings'), an: true },
    { goi: goi('lintResourcePath', '/'), an: true },
    { goi: goi('lintResourcePath', '/Device/{deviceId}/updateStatus.php'), an: true },
  ],
});

export default doiDau({ slug: 'api-1-1-tai-nguyen', ten: '1.1 Modelling resources, not actions', khoa: KHOA, baiHoc: 'api-1-1-tai-nguyen', de: [R1, R2, R3] });
