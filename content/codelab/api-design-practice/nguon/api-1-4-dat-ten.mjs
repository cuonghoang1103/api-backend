/** API Design · 1.4 — Đặt tên & nhất quán: kiểu chữ theo chỗ, tên trường, ngày giờ có độ lệch, tiền là số nguyên, id là chuỗi; tự viết toCamelCase + parseInstant. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_api.mjs';

/* ── 1. Sửa tên trường ── */
const TOT = ['capacity', 'startAt', 'isActive', 'labId', 'devices', 'durationMinutes', 'birthDate', 'IN_USE'];
const N1 = cs({
  ten: 'Naming 1 — Rename the fields the LabFlow way', kho: 'EASY', phut: 8, loai: 'table',
  en: 'A teammate’s first draft of the JSON. Pick the name LabFlow’s naming rules give each field (lesson 1.4: camelCase fields, ids end in Id, moments end in At, booleans ask a yes/no question, lists are plural, units when not obvious, enum values UPPER_SNAKE).',
  vi: 'Bản nháp JSON đầu tiên của một bạn cùng nhóm. Chọn tên mà luật đặt tên của LabFlow cho mỗi trường (bài 1.4: trường camelCase, id kết thúc bằng Id, thời điểm kết thúc bằng At, boolean là câu hỏi có/không, danh sách số nhiều, ghi đơn vị khi không hiển nhiên, giá trị enum UPPER_SNAKE).',
  bang: [bang1('b1', ['Draft → LabFlow name', 'Nháp → tên LabFlow'], [{ ma: 'x', ten: 'Draft' }, { ma: 'n', ten: 'LabFlow name', luaChon: TOT }], [
    { o: { x: '"cap": 30' }, a: { n: 'capacity' } },
    { o: { x: '"start_time": "2026-11-02T01:00:00.000Z"' }, a: { n: 'startAt' } },
    { o: { x: '"active": true' }, a: { n: 'isActive' } },
    { o: { x: '"lab": "lab_1"   (inside a booking)' }, a: { n: 'labId' } },
    { o: { x: '"deviceList": [ … ]' }, a: { n: 'devices' } },
    { o: { x: '"duration": 90' }, a: { n: 'durationMinutes' } },
    { o: { x: '"birthday_at": "2005-03-14"' }, a: { n: 'birthDate' } },
    { o: { x: '"status": "in-use"' }, a: { n: 'IN_USE' } },
  ], ['Every rule removes a question a client would otherwise ask: “cap of what?”, “lab object or id?”, “90 seconds or minutes?”. A date without time is a Date (YYYY-MM-DD), not an At.', 'Mỗi luật xoá một câu hỏi mà client sẽ phải hỏi: "cap là gì?", "lab là object hay id?", "90 giây hay phút?". Ngày không có giờ là Date (YYYY-MM-DD), không phải At.'])],
  goiY: [['If you had to ask the author what it means, the name is wrong.', 'Nếu phải hỏi tác giả nó nghĩa là gì thì tên đó sai.'], ['The last row is a value, not a field name.', 'Dòng cuối là một giá trị, không phải tên trường.']],
  loi: [['Keeping snake_case for one field because the database column is snake_case.', 'Giữ snake_case cho một trường vì cột trong CSDL là snake_case.'], ['Naming a date-only field …At.', 'Đặt tên trường chỉ có ngày là …At.']],
  tns: [tn('camelCase', 'kiểu lạc đà', 'startAt'), tn('UPPER_SNAKE', 'chữ hoa nối gạch dưới', 'IN_USE')],
  kn: ['naming'],
});

/* ── 2. Đo trong Node ── */
const DO = `JSON.parse('{"id": 9007199254740993}').id   9007199254740992
Number.MAX_SAFE_INTEGER                    9007199254740991
0.1 + 0.2                                  0.30000000000000004
4.35 * 100                                 434.99999999999994
435 * 3 (whole cents, integers)            1305
# TZ=Asia/Ho_Chi_Minh
new Date('2026-11-02T08:00:00')            2026-11-02T01:00:00.000Z
# TZ=UTC
new Date('2026-11-02T08:00:00')            2026-11-02T08:00:00.000Z
new Date('2026-11-02T08:00:00+07:00')      2026-11-02T01:00:00.000Z
new Date('2026-11-02')                     2026-11-02T00:00:00.000Z`;
const N2 = cs({
  ten: 'Naming 2 — Numbers, money, ids and dates, measured', kho: 'MEDIUM', phut: 12,
  en: `Real output of naming.mjs from lesson 1.4 (Node 22), run in two time zones:${pre(DO)}`,
  vi: `Output thật của naming.mjs trong bài 1.4 (Node 22), chạy ở hai múi giờ:${pre(DO)}`,
  cau: [
    q('c1', ['Why does LabFlow send ids as strings ("lab_1", "bk_7") rather than numbers?', 'Vì sao LabFlow gửi id dạng chuỗi ("lab_1", "bk_7") thay vì số?'], ['JavaScript numbers lose precision above 2^53 − 1, so big numeric ids silently change; the prefix also says what kind of id it is', 'Strings are smaller than numbers in JSON', 'JSON cannot contain numbers larger than 1000', 'Express route parameters only work with strings that contain an underscore'], ['9007199254740993 came back as …992 with no error. A string id survives every language, and the prefix catches “a device id passed as a lab id”.', '9007199254740993 quay về thành …992 mà không báo lỗi. Id dạng chuỗi sống sót qua mọi ngôn ngữ, và tiền tố bắt được lỗi "truyền id thiết bị vào chỗ id phòng".']),
    q('c2', ['A device rental fee of 4.35 USD should travel as …', 'Phí thuê thiết bị 4,35 USD nên được gửi đi dạng …'], ['{"amountMinor": 435, "currency": "USD"} — integer minor units plus an ISO 4217 code', '{"amount": 4.35} — the client knows the currency', '{"amount": "4.35 USD"} as one string', '{"amount": 4.35, "currency": "$"}'], ['4.35 * 100 is 434.99999999999994. Integers in the smallest unit (cents; for VND the đồng itself) make arithmetic exact; the currency code removes the guess.', '4.35 * 100 ra 434.99999999999994. Số nguyên theo đơn vị nhỏ nhất (cent; với VND là chính đồng) làm phép tính chính xác; mã tiền tệ xoá việc đoán.']),
    q('c3', ['The same line new Date(\'2026-11-02T08:00:00\') gave 01:00Z on a laptop in Hanoi and 08:00Z in UTC. Contract rule?', 'Cùng dòng new Date(\'2026-11-02T08:00:00\') cho 01:00Z trên laptop ở Hà Nội và 08:00Z ở UTC. Luật hợp đồng?'], ['Require Z or ±hh:mm, store and return UTC with Z; clients convert for display', 'Always set TZ=Asia/Ho_Chi_Minh on every server and container', 'Send local times and let the server guess the zone from the IP address', 'Store the time exactly as the client sent it, without any conversion'], ['Without an offset the result depends on the machine running the code — seven hours apart from identical code. With +07:00 both runs agree.', 'Không có độ lệch thì kết quả phụ thuộc máy chạy code — lệch bảy tiếng với cùng một đoạn code. Có +07:00 thì hai lần chạy khớp nhau.']),
    q('c4', ['new Date(\'2026-11-02\') gives midnight UTC, not local midnight. So a birthday should be …', 'new Date(\'2026-11-02\') cho nửa đêm UTC, không phải nửa đêm địa phương. Vậy ngày sinh nên là …'], ['a plain "YYYY-MM-DD" string, never converted to a date-time', 'a UTC date-time at midnight, such as 2005-03-14T00:00Z', 'a local date-time at midnight with the +07:00 offset', 'a Unix timestamp in seconds counted from 1 January 1970'], ['A birthday is a calendar date, not an instant. Converting it to a time zone can move it to the previous day for users west of UTC.', 'Ngày sinh là một ngày lịch, không phải một thời điểm. Đổi nó sang múi giờ có thể lùi về hôm trước với người dùng ở phía tây UTC.']),
    q('c5', ['GET /labs?Building=Beta returned all three labs before the fix. LabFlow now answers …', 'GET /labs?Building=Beta trả cả ba phòng trước khi sửa. Giờ LabFlow trả …'], ['400 UNKNOWN_QUERY_PARAM — a misspelled filter must not silently return wrong data', '200 with the Beta labs — query keys are case-insensitive', '404, because the filter matched nothing', '422, because Beta is not a building'], ['Query keys are just object keys: Building ≠ building. Silently ignoring it showed Alpha rooms under a Beta filter; refusing makes the typo visible.', 'Khoá query chỉ là khoá object: Building ≠ building. Lặng lẽ bỏ qua làm hiện phòng Alpha dưới bộ lọc Beta; từ chối làm lỗi gõ hiện ra.']),
  ],
  goiY: [['Every answer is in the measured output above.', 'Mọi đáp án đều nằm trong output đo được ở trên.'], ['Ask: will this value be the same in every language and every time zone?', 'Hỏi: giá trị này có giữ nguyên ở mọi ngôn ngữ và mọi múi giờ không?']],
  loi: [['Using floating-point numbers for money.', 'Dùng số thực dấu phẩy động cho tiền.'], ['Treating a date-only value as a moment in time.', 'Coi giá trị chỉ có ngày là một thời điểm.']],
  tns: [tn('minor units', 'đơn vị nhỏ nhất của tiền tệ'), tn('offset', 'độ lệch múi giờ'), tn('RFC 3339', 'chuẩn ngày giờ cho internet')],
  kn: ['data formats'],
});

/* ── 3. Tự viết: toCamelCase ── */
function toCamelCase(value) {
  if (Array.isArray(value)) return value.map(toCamelCase);
  if (value === null || typeof value !== 'object') return value;          // strings, numbers… untouched
  var out = {};
  Object.keys(value).forEach(function (k) {
    var nk = k.replace(/_([a-z0-9])/g, function (m, ch) { return ch.toUpperCase(); });
    out[nk] = toCamelCase(value[k]);
  });
  return out;
}
const ROW = { id: 'bk_1', lab_id: 'lab_1', user_id: 'usr_1', start_at: '2026-11-02T01:00:00.000Z', end_at: '2026-11-02T03:00:00.000Z', purpose: 'SWT301 Lab 3', status: 'PENDING', created_at: '2026-10-31T15:43:26.161Z' };
const N3 = jsBai({
  ten: 'Naming 3 — Write toCamelCase(value): database rows to API JSON', kho: 'MEDIUM', phut: 15,
  en: `<p>PostgreSQL columns are usually snake_case (<code>start_at</code>); LabFlow’s JSON is camelCase (<code>startAt</code>). Chapter 12 will read rows from the database, so write the converter now: <code>toCamelCase(value)</code> returns a NEW value where every object key has each <code>_x</code> (underscore + lowercase letter or digit) replaced by <code>X</code> — at every depth, inside arrays too. Values are never changed: the string <code>'IN_USE'</code> stays <code>'IN_USE'</code>; keys already in camelCase stay as they are.</p>`,
  vi: `<p>Cột PostgreSQL thường là snake_case (<code>start_at</code>); JSON của LabFlow là camelCase (<code>startAt</code>). Chương 12 sẽ đọc dòng từ cơ sở dữ liệu, nên viết bộ chuyển ngay bây giờ: <code>toCamelCase(value)</code> trả về giá trị MỚI trong đó mọi khoá object có từng <code>_x</code> (gạch dưới + chữ thường hoặc số) đổi thành <code>X</code> — ở mọi tầng, kể cả trong mảng. Giá trị không bao giờ bị đổi: chuỗi <code>'IN_USE'</code> giữ nguyên <code>'IN_USE'</code>; khoá đã là camelCase giữ nguyên.</p>`,
  dauVao: ['value — any JSON value.', 'value — giá trị JSON bất kỳ.'],
  dauRa: ['The same structure with camelCase keys.', 'Cùng cấu trúc với khoá camelCase.'],
  goiY: [['Three cases: array ⇒ map, plain object ⇒ rebuild with new keys, anything else ⇒ return as is.', 'Ba trường hợp: mảng ⇒ map, object ⇒ dựng lại với khoá mới, còn lại ⇒ trả nguyên.'], ['k.replace(/_([a-z0-9])/g, (m, c) => c.toUpperCase())', 'k.replace(/_([a-z0-9])/g, (m, c) => c.toUpperCase())']],
  loi: [['Converting string values too — enum values and messages change meaning.', 'Đổi cả giá trị chuỗi — giá trị enum và câu chữ đổi nghĩa.'], ['typeof null === "object": forgetting this crashes on null fields.', 'typeof null === "object": quên điều này là crash với trường null.']],
  gt: ['Doing the conversion in one place (the data layer) keeps “one thing, one name” true for the whole API: the database may say lab_id, but no client ever sees it. Libraries such as pg-promise or Prisma’s @map do the same.', 'Chuyển ở một chỗ (tầng dữ liệu) giữ luật "một thứ, một tên" đúng cho cả API: CSDL có thể ghi lab_id, nhưng không client nào thấy nó. Thư viện như pg-promise hay @map của Prisma làm đúng việc này.'],
  kn: ['casing', 'recursion'],
  tns: [tn('snake_case', 'chữ thường nối gạch dưới'), tn('data layer', 'tầng dữ liệu')],
  dau: `/** { lab_id: 'lab_1', start_at: … } ⇒ { labId: 'lab_1', startAt: … } (deep) */
function toCamelCase(value) {
  // Write your solution here
  var out = {};
  for (var k in value) out[k.replace('_', '')] = value[k];
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(toCamelCase),
  cases: [
    { goi: goi('toCamelCase', ROW), moTa: ['A booking row as PostgreSQL would return it', 'Một dòng booking như PostgreSQL trả về'] },
    { goi: goi('toCamelCase', { serial_no: 'FTX1840ALBQ', status: 'IN_USE', note: null }) },
    { goi: goi('toCamelCase', [ROW, { id: 'bk_2', cancelled_at: null }]), an: true },
    { goi: goi('toCamelCase', { data: [{ lab_id: 'lab_1', devices: [{ device_id: 'dev_1', last_seen_at: '2026-10-31T00:00:00Z' }] }], next_page_token: 'abc_def' }), an: true },
    { goi: goi('toCamelCase', { labId: 'lab_1', size_in_bytes_v2: 10, is_active: true }), an: true },
    { goi: goi('toCamelCase', 'start_at'), an: true },
    { goi: goi('toCamelCase', [1, 'a_b', null, [{ x_y: [] }]]), an: true },
  ],
});

/* ── 4. Tự viết: parseInstant ── */
function parseInstant(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|([+-])(\d{2}):(\d{2}))$/.exec(typeof s === 'string' ? s : '');
  if (!m) throw new RangeError('must be ISO 8601 with timezone: ' + s);
  var ms = Date.parse(s);
  if (Number.isNaN(ms)) throw new RangeError('invalid date-time: ' + s);
  // JS Date rolls 2026-02-30 over to 2 March — check the calendar date in the sender's own offset
  var off = m[6] === 'Z' ? 0 : (m[7] === '-' ? -1 : 1) * (Number(m[8]) * 60 + Number(m[9]));
  var local = new Date(ms + off * 60000).toISOString().slice(0, 10);
  if (local !== m[1] + '-' + m[2] + '-' + m[3]) throw new RangeError('no such calendar date: ' + s);
  return new Date(ms).toISOString();
}
const N4 = jsBai({
  ten: 'Naming 4 — Write parseInstant(s): accept only times with an offset', kho: 'HARD', phut: 20,
  en: `<p>Write the date rule of LabFlow as one function <code>parseInstant(s)</code>:</p><ul>
<li>Accept only RFC 3339 date-times with an offset: <code>YYYY-MM-DDThh:mm</code>, optional <code>:ss</code> and <code>.1–3 digits</code>, then <code>Z</code> or <code>±hh:mm</code>. Return the instant in UTC exactly like <code>toISOString()</code>: <code>'2026-11-02T01:00:00.000Z'</code>.</li>
<li>Anything else — no offset, date only, not a string, <code>"02/11/2026 8:00"</code> — ⇒ <code>throw new RangeError(…)</code>.</li>
<li>Impossible values (month 13) ⇒ <code>RangeError</code>. Trap: <code>new Date('2026-02-30T08:00:00Z')</code> does NOT fail in JavaScript — it silently becomes 2 March. Reject a calendar date that does not exist. Hint: the date written in the string must equal the date of the instant <i>in the sender’s own offset</i>.</li></ul>`,
  vi: `<p>Viết luật ngày giờ của LabFlow thành một hàm <code>parseInstant(s)</code>:</p><ul>
<li>Chỉ nhận date-time RFC 3339 có độ lệch: <code>YYYY-MM-DDThh:mm</code>, tuỳ chọn <code>:ss</code> và <code>.1–3 chữ số</code>, rồi <code>Z</code> hoặc <code>±hh:mm</code>. Trả về thời điểm theo UTC đúng như <code>toISOString()</code>: <code>'2026-11-02T01:00:00.000Z'</code>.</li>
<li>Còn lại — không có độ lệch, chỉ có ngày, không phải chuỗi, <code>"02/11/2026 8:00"</code> — ⇒ <code>throw new RangeError(…)</code>.</li>
<li>Giá trị không thể có (tháng 13) ⇒ <code>RangeError</code>. Bẫy: <code>new Date('2026-02-30T08:00:00Z')</code> KHÔNG báo lỗi trong JavaScript — nó lặng lẽ thành ngày 2 tháng 3. Hãy từ chối ngày lịch không tồn tại. Gợi ý: ngày viết trong chuỗi phải bằng ngày của thời điểm đó <i>tính theo độ lệch của chính người gửi</i>.</li></ul>`,
  dauVao: ['s — any value.', 's — giá trị bất kỳ.'],
  dauRa: ['An ISO string in UTC ending in .sssZ, or a thrown RangeError.', 'Chuỗi ISO theo UTC kết thúc bằng .sssZ, hoặc ném RangeError.'],
  goiY: [['Validate the shape with a regular expression first, then Date.parse.', 'Kiểm hình dạng bằng biểu thức chính quy trước, rồi mới Date.parse.'], ['For the calendar check: shift the instant by the offset in minutes, then compare toISOString().slice(0, 10) with the date in the string.', 'Để kiểm ngày lịch: dịch thời điểm theo độ lệch (phút), rồi so toISOString().slice(0, 10) với ngày trong chuỗi.']],
  loi: [['Trusting new Date(s) alone: it accepts "2026-11-02T08:00:00" (local time) and 30 February.', 'Chỉ tin new Date(s): nó nhận "2026-11-02T08:00:00" (giờ máy) và ngày 30 tháng 2.'], ['Comparing the UTC date with the string: "2026-11-02T01:00:00+07:00" is 1 November in UTC, and that is fine.', 'So ngày UTC với chuỗi: "2026-11-02T01:00:00+07:00" là ngày 1/11 theo UTC, và điều đó đúng.']],
  gt: ['The regular expression enforces the contract (an offset is mandatory); Date.parse turns a valid string into one instant; the calendar check closes JavaScript’s silent roll-over. Returning UTC with Z is the single storage format, so comparisons and sorting are plain string or number comparisons.', 'Biểu thức chính quy ép hợp đồng (bắt buộc có độ lệch); Date.parse biến chuỗi hợp lệ thành một thời điểm; phép kiểm ngày lịch chặn việc JavaScript lặng lẽ cuộn ngày. Trả UTC có Z là định dạng lưu duy nhất, nên so sánh và sắp xếp chỉ là so chuỗi hay so số.'],
  kn: ['dates and time zones'],
  tns: [tn('instant', 'thời điểm', 'Một điểm duy nhất trên trục thời gian, không phụ thuộc múi giờ.'), tn('roll-over', 'cuộn ngày', 'Ngày 30/2 bị tự đổi thành 2/3.')],
  dau: `/** "2026-11-02T08:00:00+07:00" ⇒ "2026-11-02T01:00:00.000Z"; no offset ⇒ throw RangeError */
function parseInstant(s) {
  // Write your solution here
  return new Date(s).toISOString();
}
`,
  giai: '// Reference solution\n' + nguon(parseInstant),
  cases: [
    { goi: goi('parseInstant', '2026-11-02T08:00:00+07:00') },
    { goi: goi('parseInstant', '2026-11-02T01:00:00Z') },
    { goi: goi('parseInstant', '2026-11-02T08:00:00'), nem: 'RangeError', moTa: ['No offset ⇒ RangeError', 'Không độ lệch ⇒ RangeError'] },
    { goi: goi('parseInstant', '2026-11-02'), nem: 'RangeError', an: true },
    { goi: goi('parseInstant', '02/11/2026 8:00'), nem: 'RangeError', an: true },
    { goi: goi('parseInstant', '2026-11-02T08:00+07:00'), an: true },
    { goi: goi('parseInstant', '2026-11-01T22:30:15.5-05:00'), an: true },
    { goi: goi('parseInstant', '2026-11-02T01:00:00+07:00'), an: true },
    { goi: goi('parseInstant', '2026-13-01T00:00:00Z'), nem: 'RangeError', an: true },
    { goi: goi('parseInstant', '2026-02-30T08:00:00Z'), nem: 'RangeError', an: true },
    { goi: goi('parseInstant', '2028-02-29T23:00:00-03:00'), an: true },
    { goi: goi('parseInstant', 1762045200000), nem: 'RangeError', an: true },
  ],
});

export default doiDau({ slug: 'api-1-4-dat-ten', ten: '1.4 Naming, casing and consistency', khoa: KHOA, baiHoc: 'api-1-4-dat-ten', de: [N1, N2, N3, N4] });
