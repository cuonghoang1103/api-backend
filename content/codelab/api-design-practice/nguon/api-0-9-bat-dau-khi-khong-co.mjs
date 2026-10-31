/** API Design · Mục 0 · "Bắt đầu tại đây (2/2)" — năm sự cố API có nguồn ⇒ luật thiết kế; buổi demo hỏng; tự viết classifyStatus. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Sự cố ⇒ luật ⇒ chương ── */
const LUAT = ['Check permission on every object, not just login', 'Keep an endpoint inventory; delete dormant ones; test access rules', 'Return only needed fields, rate-limit, watch volumes', 'Decide explicitly who may call each endpoint; rate-limit enumeration', 'Version, announce deprecation, give a timeline'];
const CH = ['Chapter 2/5/8', 'Chapter 4', 'Chapter 6', 'Chapter 6 + 8'];
const I1 = cs({
  ten: 'Incidents 1 — Which rule would have prevented it?', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Lesson “Start here 2/2” tells five sourced stories. For each one pick the design rule that would have prevented it.',
  vi: 'Bài "Bắt đầu tại đây 2/2" kể năm chuyện có nguồn. Với mỗi chuyện, chọn luật thiết kế lẽ ra đã chặn được nó.',
  bang: [bang1('b1', ['Incident → rule', 'Sự cố → luật'], [{ ma: 'x', ten: 'Incident' }, { ma: 'r', ten: 'Rule', luaChon: LUAT }], [
    { o: { x: 'USPS 2018 — any logged-in user could look up other users’ email, phone and address (~60M accounts)' }, a: { r: LUAT[0] } },
    { o: { x: 'Optus 2022 — an access check fixed on the main site but not on a second, dormant API domain' }, a: { r: LUAT[1] } },
    { o: { x: 'T-Mobile 2023 — one API drained of ~37M customer records for six weeks before anyone noticed' }, a: { r: LUAT[2] } },
    { o: { x: 'Authy 2024 — an unauthenticated endpoint told attackers which phone numbers had accounts' }, a: { r: LUAT[3] } },
    { o: { x: 'Twitter 2023 — third-party clients such as Tweetbot cut off overnight' }, a: { r: LUAT[4] } },
  ], ['Logged in ≠ allowed (USPS). Forgotten endpoints keep old bugs (Optus). Excess data with nobody watching (T-Mobile). No authentication + no rate limit = enumeration (Authy). A contract changed overnight breaks the businesses built on it (Twitter).', 'Đã đăng nhập ≠ được phép (USPS). Endpoint bị quên giữ nguyên lỗi cũ (Optus). Thừa dữ liệu mà không ai theo dõi (T-Mobile). Không xác thực + không rate limit = dò liệt kê (Authy). Hợp đồng đổi qua đêm làm gãy những doanh nghiệp xây trên nó (Twitter).'])],
  goiY: [['Ask what was missing: a permission check, an inventory, a limit, an authentication decision, or a promise kept?', 'Hỏi thứ gì bị thiếu: một chốt quyền, một danh sách endpoint, một giới hạn, một quyết định xác thực, hay một lời hứa được giữ?'], ['Only one story is not a data breach.', 'Chỉ có một chuyện không phải rò rỉ dữ liệu.']],
  loi: [['Mixing up USPS (logged in, wrong object) with Authy (no login at all).', 'Nhầm USPS (đã đăng nhập, sai đối tượng) với Authy (không cần đăng nhập).'], ['Thinking “hackers were geniuses”: every case was an ordinary mistake.', 'Nghĩ "hacker là thiên tài": mọi vụ đều là lỗi bình thường.']],
  tns: [tn('object-level authorisation', 'phân quyền theo đối tượng'), tn('enumeration', 'dò liệt kê'), tn('deprecation', 'thông báo ngừng hỗ trợ')],
  kn: ['API security', 'contracts'],
});

/* ── 2. Buổi demo hỏng ── */
const I2 = cs({
  ten: 'Incidents 2 — The demo-day disaster', kho: 'MEDIUM', phut: 10,
  en: 'The illustrated story: the night before demo four small contract mistakes ruin the project. Choose the cause and the fix for each symptom.',
  vi: 'Tình huống minh hoạ: đêm trước buổi demo, bốn lỗi hợp đồng nhỏ làm hỏng cả đồ án. Chọn nguyên nhân và cách sửa cho từng triệu chứng.',
  cau: [
    q('c1', ['The list screen is suddenly empty. The back end renamed items to data last night. Best fix for next time?', 'Màn danh sách bỗng trống. Back end đổi items thành data tối qua. Cách sửa tốt nhất cho lần sau?'], ['Treat field names as part of the contract: add the new one, keep the old one until clients move', 'Ask the front end to read both names with ?? everywhere forever', 'Rename it back and never rename anything again', 'Return the list as the whole body so there is no field name'], ['Renaming is a breaking change. Additive change first (both fields), then remove the old one with notice — Chapter 4.', 'Đổi tên là thay đổi phá vỡ. Thêm trước (cả hai trường), rồi mới bỏ trường cũ có báo trước — Chương 4.']),
    q('c2', ['The form sends startAt "2026-11-02T08:00" with no offset; the UTC server stores 08:00Z and the screen shows 15:00. The contract rule is …', 'Form gửi startAt "2026-11-02T08:00" không có độ lệch; server UTC lưu 08:00Z và màn hình hiện 15:00. Luật hợp đồng là …'], ['Times must carry an offset or Z; reject anything without one with 400', 'The server must guess the user’s time zone from the IP address', 'Store every time as a string exactly as received', 'Send times as “08:00” and the date in another field'], ['A time without an offset is ambiguous. LabFlow’s ISO check requires Z or ±hh:mm and returns 400 otherwise; storage is always UTC (lesson 1.4).', 'Thời điểm không có độ lệch là mơ hồ. Bộ kiểm ISO của LabFlow bắt buộc Z hoặc ±hh:mm, thiếu thì 400; lưu luôn bằng UTC (bài 1.4).']),
    q('c3', ['Every error returns HTTP 200 with {"ok": false}, so the app shows “Success!”. What breaks besides the screen?', 'Mọi lỗi trả HTTP 200 kèm {"ok": false} nên app hiện "Thành công!". Ngoài màn hình còn gì hỏng?'], ['Every tool that reads the status line: fetch’s res.ok, retries, caches, monitoring', 'Nothing — the body is enough for every client', 'Only the browser console, which turns red', 'Only the database, which stores the wrong value'], ['The status code is the part of the contract that generic tools understand. 200 for a failure lies to caches, retry logic and dashboards (lesson 1.3).', 'Mã trạng thái là phần hợp đồng mà mọi công cụ chung đều hiểu. 200 cho một thất bại là nói dối cache, logic thử lại và dashboard (bài 1.3).']),
    q('c4', ['The edit form sends PUT /labs/lab_1 with only {"name": "…"} and the capacity disappears. Which fix matches HTTP semantics?', 'Form sửa gửi PUT /labs/lab_1 chỉ với {"name": "…"} và sức chứa biến mất. Cách sửa nào đúng ngữ nghĩa HTTP?'], ['PATCH for partial edits; PUT stays a full replacement that rejects missing fields', 'Make PUT quietly keep the old value of every field the form did not send', 'Add a POST /labs/lab_1/update endpoint and use it for every kind of edit', 'Send the edit as a GET with the changed fields in query parameters'], ['PUT means “replace with this representation”, so a missing field is a request error (400). Partial changes are PATCH (JSON Merge Patch) — lesson 1.2.', 'PUT nghĩa là "thay bằng bản này", nên thiếu trường là lỗi request (400). Sửa một phần là PATCH (JSON Merge Patch) — bài 1.2.']),
  ],
  goiY: [['Each symptom is a contract that was never written down.', 'Mỗi triệu chứng là một điều hợp đồng chưa từng được viết ra.'], ['Lessons 1.2, 1.3 and 1.4 each fix one of these.', 'Bài 1.2, 1.3 và 1.4 mỗi bài sửa một cái.']],
  loi: [['Fixing the screen instead of the contract.', 'Sửa màn hình thay vì sửa hợp đồng.'], ['Making PUT “smart” — then it is no longer idempotent replacement.', 'Làm PUT "thông minh" — khi đó nó không còn là phép thay thế lặp lại an toàn.']],
  tns: [tn('offset', 'độ lệch múi giờ', '+07:00 hoặc Z (= +00:00).'), tn('partial update', 'cập nhật một phần')],
  kn: ['contract mistakes'],
});

/* ── 3. Tự viết: classifyStatus ── */
function classifyStatus(code) {
  if (!Number.isInteger(code) || code < 100 || code > 599) return 'invalid';
  if (code < 200) return 'informational';
  if (code < 300) return 'success';
  if (code < 400) return 'redirect';
  if (code < 500) return 'client error';  // the caller must change something
  return 'server error';                  // the caller may retry later
}
const I3 = jsBai({
  ten: 'Incidents 3 — Write classifyStatus(code): never trust a 200 blindly', kho: 'EASY', phut: 8,
  en: `<p>The demo broke because the app looked at the body and ignored the status line. Write <code>classifyStatus(code)</code> that returns the class of an HTTP status code, the way every client and dashboard reads it:</p><ul>
<li>100–199 ⇒ <code>'informational'</code>, 200–299 ⇒ <code>'success'</code>, 300–399 ⇒ <code>'redirect'</code></li>
<li>400–499 ⇒ <code>'client error'</code> (the caller must change the request), 500–599 ⇒ <code>'server error'</code></li>
<li>anything else — not an integer, below 100, above 599 ⇒ <code>'invalid'</code></li></ul>`,
  vi: `<p>Buổi demo hỏng vì app nhìn body mà bỏ qua dòng trạng thái. Viết <code>classifyStatus(code)</code> trả về lớp của một mã trạng thái HTTP, đúng cách mọi client và dashboard đọc nó:</p><ul>
<li>100–199 ⇒ <code>'informational'</code>, 200–299 ⇒ <code>'success'</code>, 300–399 ⇒ <code>'redirect'</code></li>
<li>400–499 ⇒ <code>'client error'</code> (bên gọi phải sửa request), 500–599 ⇒ <code>'server error'</code></li>
<li>còn lại — không phải số nguyên, dưới 100, trên 599 ⇒ <code>'invalid'</code></li></ul>`,
  dauVao: ['code — any value (normally a number).', 'code — giá trị bất kỳ (thường là số).'],
  dauRa: ['One of the six strings above.', 'Một trong sáu chuỗi ở trên.'],
  goiY: [['Check “is this a valid code” first, then compare ranges from low to high.', 'Kiểm "có phải mã hợp lệ" trước, rồi so các khoảng từ thấp lên cao.'], ['Number.isInteger rejects 200.5 and "200".', 'Number.isInteger loại 200.5 và "200".']],
  loi: [['Math.floor(code / 100) on 600 or 99 gives a class that does not exist.', 'Math.floor(code / 100) với 600 hay 99 cho ra một lớp không tồn tại.'], ['Accepting the string "404": status codes are numbers in every client library.', 'Chấp nhận chuỗi "404": mã trạng thái là số trong mọi thư viện client.']],
  gt: ['RFC 9110 §15 groups codes by their first digit; the class is what generic software reacts to (fetch’s res.ok is exactly 200–299). Validating first keeps nonsense like 600 out of every branch.', 'RFC 9110 §15 chia mã theo chữ số đầu; lớp là thứ phần mềm chung phản ứng theo (res.ok của fetch chính là 200–299). Kiểm hợp lệ trước giữ những thứ vô nghĩa như 600 khỏi mọi nhánh.'],
  kn: ['status classes'],
  tns: [tn('status class', 'lớp mã trạng thái'), tn('client error', 'lỗi phía client')],
  dau: `/** code ⇒ 'informational' | 'success' | 'redirect' | 'client error' | 'server error' | 'invalid' */
function classifyStatus(code) {
  // Write your solution here
  return code < 400 ? 'success' : 'client error';
}
`,
  giai: '// Reference solution\n' + nguon(classifyStatus),
  cases: [
    { goi: goi('classifyStatus', 201) }, { goi: goi('classifyStatus', 404) }, { goi: goi('classifyStatus', 503) },
    { goi: goi('classifyStatus', 304), an: true }, { goi: goi('classifyStatus', 100), an: true }, { goi: goi('classifyStatus', 599), an: true },
    { goi: goi('classifyStatus', 600), an: true }, { goi: goi('classifyStatus', 99), an: true }, { goi: goi('classifyStatus', 200.5), an: true },
    { goi: goi('classifyStatus', '404'), an: true }, { goi: goi('classifyStatus', 422), an: true },
  ],
});

export default doiDau({ slug: 'api-0-9-bat-dau-khi-khong-co', ten: 'Start here 2/2 — When APIs go wrong', khoa: KHOA, baiHoc: 'api-0-9-bat-dau-khi-khong-co', de: [I1, I2, I3] });
