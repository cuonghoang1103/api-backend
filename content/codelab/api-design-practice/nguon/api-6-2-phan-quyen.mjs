/** API Design · 6.2 — Phân quyền và BOLA: ba tầng, bảng chính sách, ma trận phân quyền (output thật LabFlow Ch6). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

const LV = ['Function level (API5)', 'Object level (API1)', 'Property level (API3)'];
const E1 = cs({
  ten: 'Authorisation 1 — Which level is missing?', kho: 'EASY', phut: 8, loai: 'table',
  en: 'For each bug, choose the level of authorisation that was not checked.',
  vi: 'Với mỗi lỗi, chọn tầng phân quyền đã không được kiểm.',
  bang: [bang1('b1', ['Bug → missing level', 'Lỗi → tầng bị thiếu'], [{ ma: 'x', ten: 'Bug' }, { ma: 'a', ten: 'Level', luaChon: LV }], [
    { o: { x: 'Bin reads An’s receipt by changing bk_2 to bk_1' }, a: { a: 'Object level (API1)' } },
    { o: { x: 'A student calls PATCH /v2/devices/dev_1 and it works' }, a: { a: 'Function level (API5)' } },
    { o: { x: 'PATCH /v2/me with {"role":"LAB_MANAGER"} makes An a manager' }, a: { a: 'Property level (API3)' } },
    { o: { x: 'A student cancels another student’s booking with DELETE /v2/bookings/bk_7' }, a: { a: 'Object level (API1)' } },
    { o: { x: 'GET /v2/me returns passwordHash' }, a: { a: 'Property level (API3)' } },
    { o: { x: 'A student opens GET /v2/admin/deprecations' }, a: { a: 'Function level (API5)' } },
  ], ['Function: may this role call the operation at all? Object: may this person touch this record? Property: may they read or change this field?', 'Chức năng: vai trò này có được gọi thao tác không? Đối tượng: người này có được đụng bản ghi này không? Thuộc tính: họ có được đọc hay sửa trường này không?'])],
  goiY: [['Is the problem the operation, the record, or one field?', 'Vấn đề nằm ở thao tác, ở bản ghi, hay ở một trường?'], ['Would the bug disappear if only managers could call the route?', 'Lỗi có biến mất nếu chỉ quản lý được gọi route không?']],
  loi: [['Calling every authorisation bug “BOLA”.', 'Gọi mọi lỗi phân quyền là “BOLA”.'], ['Treating reading a hidden field (passwordHash) as an object-level bug.', 'Coi việc đọc được trường ẩn (passwordHash) là lỗi cấp đối tượng.']],
  tns: [tn('BOLA (Broken Object Level Authorization)', 'lỗi phân quyền cấp đối tượng'), tn('mass assignment', 'gán hàng loạt trường từ body')],
  kn: ['authorization', 'OWASP API Top 10'],
});

const E2 = cs({
  ten: 'Authorisation 2 — Policy decisions', kho: 'EASY', phut: 8,
  en: 'Decisions behind LabFlow’s fix in lesson 6.2.',
  vi: 'Những quyết định đằng sau bản vá của LabFlow ở bài 6.2.',
  cau: [
    q('c1', ['Bin asks for An’s receipt after the fix. Why 404 and not 403?', 'Sau khi vá, Bình hỏi biên nhận của An. Vì sao 404 chứ không phải 403?'],
      ['A 403 would confirm that bk_1 exists; 404 reveals nothing', 'Because 403 is reserved for the admin routes only in LabFlow', 'Because Express turns every 403 into 404 when a route throws', 'Because the receipt is deleted for anybody who is not its owner'],
      ['Hidden objects answer like missing ones. The old GET /bookings/:id keeps its 403 — changing a status code is a breaking change (4.1).', 'Đối tượng bị ẩn trả lời như không tồn tại. GET /bookings/:id cũ giữ 403 — đổi mã trạng thái là thay đổi phá vỡ (4.1).']),
    q('c2', ['A POLICIES table has no rule for "booking:export". What does can(user, "booking:export", b) return?', 'Bảng POLICIES không có luật cho "booking:export". can(user, "booking:export", b) trả gì?'],
      ['false — deny by default', 'true — no rule means no restriction', 'It throws, so the route answers 500', 'true for managers and false for students'],
      ['Boolean(POLICIES[action]?.(…)) is false when the rule is missing. Forgetting a rule must close the door, not open it.', 'Boolean(POLICIES[action]?.(…)) ra false khi thiếu luật. Quên một luật phải đóng cửa, không phải mở cửa.']),
    q('c3', ['Would random UUIDs instead of bk_1, bk_2 … have fixed the receipt bug?', 'Dùng UUID ngẫu nhiên thay cho bk_1, bk_2 … có vá được lỗi biên nhận không?'],
      ['No — guessing gets harder, but ids leak through links, logs and screenshots', 'Yes — nobody can guess a UUID, so the check becomes unnecessary', 'Yes, as long as the UUID is version 4 and not version 1', 'No, because UUIDs are always sent to every client in each list'],
      ['Only the object-level check fixes BOLA; random ids are at most an extra layer.', 'Chỉ phép kiểm cấp đối tượng mới vá được BOLA; id ngẫu nhiên nhiều lắm là một lớp phụ.']),
    q('c4', ['The matrix ran AFTER the audit and showed every Bin cell wrong. Why?', 'Ma trận chạy SAU bộ kiểm và mọi ô của Bình đều sai. Vì sao?'],
      ['The audit triggered Bin’s login limit on purpose, so Bin could not log in', 'The audit deleted all of Bin’s bookings before the matrix started', 'The fix only works for the first person who logs in after a restart', 'The matrix uses demo tokens, which the audit had switched off'],
      ['The audit’s API2 check sends six wrong passwords for Bin. A rate limit doing its job — run the matrix first.', 'Phép kiểm API2 của bộ kiểm gửi sáu mật khẩu sai cho Bình. Giới hạn tần suất đang làm đúng việc — chạy ma trận trước.']),
  ],
  goiY: [['What does each answer tell an attacker?', 'Mỗi câu trả lời cho kẻ tấn công biết gì?'], ['What happens when someone forgets to write a rule?', 'Chuyện gì xảy ra khi ai đó quên viết một luật?']],
  loi: [['403 for hidden objects.', '403 cho đối tượng bị ẩn.'], ['Allow by default when a rule is missing.', 'Mặc định cho phép khi thiếu luật.']],
  tns: [tn('deny by default', 'mặc định từ chối'), tn('policy', 'chính sách (luật ai được làm gì)')],
  kn: ['authorization'],
});

function violations(people, owners, observed) {
  const wrong = [];
  for (const p of people) {
    for (const bk of Object.keys(owners)) {
      const expected = p.role === 'LAB_MANAGER' || owners[bk] === p.id ? 200 : 404;
      const got = observed[p.id] && observed[p.id][bk];
      if (got !== expected) wrong.push(p.id + '→' + bk);
    }
  }
  return wrong;
}
const PEOPLE = [{ id: 'usr_1', role: 'STUDENT' }, { id: 'usr_2', role: 'STUDENT' }, { id: 'usr_3', role: 'LAB_MANAGER' }];
const OWN = { bk_1: 'usr_1', bk_2: 'usr_2', bk_3: 'usr_1', bk_4: 'usr_2' };
const all200 = { usr_1: { bk_1: 200, bk_2: 200, bk_3: 200, bk_4: 200 }, usr_2: { bk_1: 200, bk_2: 200, bk_3: 200, bk_4: 200 }, usr_3: { bk_1: 200, bk_2: 200, bk_3: 200, bk_4: 200 } };
const fixed = { usr_1: { bk_1: 200, bk_2: 404, bk_3: 200, bk_4: 404 }, usr_2: { bk_1: 404, bk_2: 200, bk_3: 404, bk_4: 200 }, usr_3: { bk_1: 200, bk_2: 200, bk_3: 200, bk_4: 200 } };
const E3 = jsBai({
  ten: 'Authorisation 3 — Write violations(people, owners, observed): the authorisation matrix', kho: 'MEDIUM', phut: 15,
  en: `<p>The matrix of lesson 6.2 asks every person for every receipt and compares with the policy. Inputs:</p><ul>
<li><code>people</code> — <code>[{ id, role }]</code>, in this order</li>
<li><code>owners</code> — <code>{ bookingId: userId }</code>, in this key order</li>
<li><code>observed</code> — <code>{ userId: { bookingId: status } }</code> (a status may be missing)</li></ul>
<p>Expected: <code>200</code> if the person is a <code>LAB_MANAGER</code> or owns the booking, else <code>404</code>. Return the list of wrong cells as <code>'usr_2→bk_1'</code>, person by person, booking by booking. A missing status is wrong.</p>`,
  vi: `<p>Ma trận của bài 6.2 hỏi mọi biên nhận bằng tài khoản của từng người rồi so với chính sách. Đầu vào:</p><ul>
<li><code>people</code> — <code>[{ id, role }]</code>, theo thứ tự này</li>
<li><code>owners</code> — <code>{ bookingId: userId }</code>, theo thứ tự khoá này</li>
<li><code>observed</code> — <code>{ userId: { bookingId: status } }</code> (có thể thiếu status)</li></ul>
<p>Kỳ vọng: <code>200</code> nếu người đó là <code>LAB_MANAGER</code> hoặc sở hữu booking, ngược lại <code>404</code>. Trả danh sách ô sai dạng <code>'usr_2→bk_1'</code>, lần lượt từng người, từng booking. Thiếu status là sai.</p>`,
  dauVao: ['people, owners, observed', 'people, owners, observed'],
  dauRa: ['array of "user→booking" strings', 'mảng chuỗi "người→booking"'],
  goiY: [['Two nested loops: people outside, bookings inside.', 'Hai vòng lặp lồng: người ở ngoài, booking ở trong.'], ['The owner comes from owners, never from the observed answer.', 'Chủ sở hữu lấy từ owners, không bao giờ từ câu trả lời quan sát được.']],
  loi: [['Counting a manager’s 200 on someone else’s booking as wrong.', 'Tính 200 của quản lý trên booking người khác là sai.'], ['Treating a 403 as acceptable — the policy says 404.', 'Chấp nhận 403 — chính sách nói 404.']],
  gt: ['On the quick build every student cell for someone else’s booking is 200 ⇒ wrong (8 cells with 8 bookings in lesson 6.2); after the fix the list is empty.', 'Trên bản viết vội mọi ô của sinh viên với booking người khác là 200 ⇒ sai (8 ô với 8 booking ở bài 6.2); sau khi vá danh sách rỗng.'],
  kn: ['authorization', 'testing'],
  tns: [tn('authorisation matrix', 'ma trận phân quyền'), tn('expected vs observed', 'kỳ vọng so với quan sát')],
  dau: `/** wrong cells of the receipt authorisation matrix */
function violations(people, owners, observed) {
  // Write your solution here
  const wrong = [];
  for (const p of people) for (const bk of Object.keys(owners))
    if (observed[p.id][bk] !== 200) wrong.push(p.id + '→' + bk);
  return wrong;
}
`,
  giai: '// Reference solution\n' + nguon(violations),
  cases: [
    { goi: goi('violations', PEOPLE, OWN, all200), moTa: ['The quick receipt (LABFLOW_VULN=1)', 'Biên nhận viết vội (LABFLOW_VULN=1)'] },
    { goi: goi('violations', PEOPLE, OWN, fixed), moTa: ['After the fix', 'Sau khi vá'] },
    { goi: goi('violations', PEOPLE, OWN, { ...fixed, usr_2: { bk_1: 403, bk_2: 200, bk_3: 404, bk_4: 200 } }), an: true, moTa: ['403 instead of 404', '403 thay vì 404'] },
    { goi: goi('violations', PEOPLE, OWN, { ...fixed, usr_3: { bk_1: 200, bk_2: 404, bk_3: 200, bk_4: 200 } }), an: true, moTa: ['Manager locked out of one booking', 'Quản lý bị chặn một booking'] },
    { goi: goi('violations', PEOPLE, OWN, { usr_1: fixed.usr_1, usr_3: fixed.usr_3 }), an: true, moTa: ['Bin could not log in', 'Bình không đăng nhập được'] },
    { goi: goi('violations', [], OWN, {}), an: true },
  ],
});

export default doiDau({ slug: 'api-6-2-phan-quyen', ten: '6.2 Authorisation and BOLA', khoa: KHOA, baiHoc: 'api-6-2-phan-quyen', de: [E1, E2, E3] });
