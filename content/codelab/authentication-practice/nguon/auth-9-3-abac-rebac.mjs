/** Authentication · 9.3 — ABAC & ReBAC: ownership and relationships; write canCancel combining both. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '9.3-1 — The gaps RBAC leaves', kho: 'EASY', phut: 8,
  en: 'A role alone cannot say "cancel your OWN booking" (ownership) or "the head cancels in THEIR department" (a relationship).',
  vi: 'Riêng vai không nói được "huỷ lượt đặt CỦA MÌNH" (sở hữu) hay "trưởng khoa huỷ trong KHOA CỦA HỌ" (một quan hệ).',
  cau: [
    q('c1', ['Why can "cancel your own booking" NOT be a role?', 'Vì sao "huỷ lượt đặt của mình" KHÔNG thể là một vai?'],
      ['"Owner" is not a fixed set of users; ownership is a per-pair fact compared at decision time — ABAC', 'Roles cannot contain the word "cancel" in most frameworks', 'A role would be too slow to check on every request', 'It can be a role; just create one called OWNER for everyone'],
      ['Everyone owns different things, so "owner" is not a stable group; it is an attribute of the (user, booking) pair (9.3).', 'Ai cũng sở hữu thứ khác nhau, nên "chủ" không phải một nhóm ổn định; nó là thuộc tính của cặp (người dùng, lượt đặt) (9.3).']),
    q('c2', ['An ABAC check reads ownerId from req.body. What is the attack?', 'Một phép kiểm ABAC đọc ownerId từ req.body. Cú tấn công là gì?'],
      ['The caller sends ownerId equal to their own id and "owns" any resource — read ownerId from the server record instead', 'Parsing the ownerId out of the request body twice doubles the latency of every single authorization decision', 'A very large ownerId value in the body overflows a 32-bit integer and silently wraps around to another user', 'Nothing is wrong here, because the request body already came from a fully authenticated and logged-in user'],
      ['Any attribute in a decision must come from the server\'s record, never request-controlled input, or the check is trivially bypassed (9.3).', 'Mọi thuộc tính trong một quyết định phải đến từ bản ghi của máy chủ, không bao giờ đầu vào do yêu cầu điều khiển, nếu không phép kiểm bị vượt dễ như bỡn (9.3).']),
    q('c3', ['What is ReBAC (as in Google Zanzibar)?', 'ReBAC là gì (như Google Zanzibar)?'],
      ['Authorization from a relationship in a graph — e.g. head of the room\'s department may cancel its bookings', 'A faster hashing algorithm for access tokens', 'A rule that every admin is a super-admin everywhere', 'A way to store passwords as relationships instead of hashes'],
      ['ReBAC grants by a relationship (you head this room\'s department); Zanzibar is Google\'s relationship-authorization system (9.3).', 'ReBAC cấp theo một quan hệ (bạn đứng đầu khoa của phòng này); Zanzibar là hệ phân quyền theo quan hệ của Google (9.3).']),
  ],
  goiY: [['Ownership is about a pair; a relationship is about the graph.', 'Sở hữu về một cặp; quan hệ về đồ thị.'], ['Attributes must be server-trusted.', 'Thuộc tính phải do máy chủ tin.']],
  loi: [['Trying to model ownership as a role.', 'Thử mô hình quyền sở hữu thành một vai.'], ['Reading ownerId from the request body.', 'Đọc ownerId từ thân yêu cầu.']],
  tns: [tn('ABAC', 'ABAC'), tn('ReBAC', 'ReBAC'), tn('Zanzibar', 'Zanzibar')],
  kn: ['authentication'],
});

function canCancel(user, booking) {
  // ABAC: you own it. ReBAC: you head the room's department. (No RBAC here — that is 9.2.)
  if (!user || !booking) return false;
  if (booking.ownerId === user.id) return true;                                          // ABAC
  if (user.role === 'DEPT_HEAD' && booking.departmentId === user.departmentId) return true;  // ReBAC
  return false;                                                                           // deny by default
}
const S2 = jsBai({
  ten: '9.3-2 — Write canCancel(user, booking): ABAC + ReBAC', kho: 'MEDIUM', phut: 12,
  en: `<p>Return <code>true</code> if the user may cancel the booking by EITHER model: <b>ABAC</b> — <code>booking.ownerId === user.id</code> (you own it); or <b>ReBAC</b> — <code>user.role === 'DEPT_HEAD'</code> and <code>booking.departmentId === user.departmentId</code> (you head the room\'s department). Otherwise <code>false</code>. A missing user or booking is a safe <code>false</code>. (Ignore RBAC and tenant here — that is 9.2 and 9.4.)</p>`,
  vi: `<p>Trả <code>true</code> nếu người dùng được huỷ lượt đặt theo MỘT trong hai mô hình: <b>ABAC</b> — <code>booking.ownerId === user.id</code> (bạn sở hữu); hoặc <b>ReBAC</b> — <code>user.role === 'DEPT_HEAD'</code> và <code>booking.departmentId === user.departmentId</code> (bạn đứng đầu khoa của phòng). Không thì <code>false</code>. Thiếu user hay booking là một <code>false</code> an toàn. (Bỏ qua RBAC và tenant ở đây — đó là 9.2 và 9.4.)</p>`,
  goiY: [['Check ownership first, then the department-head relationship.', 'Kiểm sở hữu trước, rồi quan hệ trưởng khoa.'], ['Both branches only grant booking:cancel — nothing else.', 'Cả hai nhánh chỉ cấp booking:cancel — không gì khác.']],
  loi: [['Letting any DEPT_HEAD cancel any booking, ignoring the department.', 'Cho bất kỳ DEPT_HEAD nào huỷ bất kỳ lượt đặt nào, bỏ qua khoa.'], ['Crashing when user or booking is null.', 'Sập khi user hay booking là null.']],
  gt: ['ABAC grants by ownership; ReBAC grants by the head\'s department relationship; together they cover what a role alone cannot (9.3).', 'ABAC cấp theo sở hữu; ReBAC cấp theo quan hệ khoa của trưởng khoa; gộp lại chúng phủ cái một vai không làm nổi (9.3).'],
  kn: ['authentication'], tns: [tn('ownership', 'sở hữu'), tn('relationship', 'quan hệ')],
  dau: `/** ⇒ true if user may cancel booking (ABAC ownership OR ReBAC dept head) */
function canCancel(user, booking) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(canCancel),
  cases: [
    { goi: goi('canCancel', { id: 'u1', role: 'STUDENT', departmentId: 'se' }, { ownerId: 'u1', departmentId: 'se' }), moTa: ['owner ⇒ true', 'chủ ⇒ true'] },
    { goi: goi('canCancel', { id: 'u2', role: 'STUDENT', departmentId: 'se' }, { ownerId: 'u1', departmentId: 'se' }), an: true, moTa: ['peer, not owner ⇒ false', 'bạn cùng vai, không chủ ⇒ false'] },
    { goi: goi('canCancel', { id: 'u9', role: 'DEPT_HEAD', departmentId: 'se' }, { ownerId: 'u1', departmentId: 'se' }), moTa: ['SE head, SE room ⇒ true', 'trưởng SE, phòng SE ⇒ true'] },
    { goi: goi('canCancel', { id: 'u8', role: 'DEPT_HEAD', departmentId: 'ba' }, { ownerId: 'u1', departmentId: 'se' }), an: true, moTa: ['BA head, SE room ⇒ false', 'trưởng BA, phòng SE ⇒ false'] },
    { goi: goi('canCancel', null, { ownerId: 'u1', departmentId: 'se' }), an: true, moTa: ['null user ⇒ false', 'user null ⇒ false'] },
  ],
});

const S3 = cs({
  ten: '9.3-3 — Model → example', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each authorization model to the LabFlow example it fits.',
  vi: 'Ghép mỗi mô hình phân quyền với ví dụ LabFlow nó hợp.',
  bang: [bang1('b1', ['Model → example', 'Mô hình → ví dụ'], [{ ma: 'x', ten: 'Model' }, { ma: 'q', ten: 'Example', luaChon: ['a TEACHER may create bookings', 'you may cancel your own booking', 'the SE head cancels an SE-room booking'] }], [
    { o: { x: 'RBAC' }, a: { q: 'a TEACHER may create bookings' } },
    { o: { x: 'ABAC' }, a: { q: 'you may cancel your own booking' } },
    { o: { x: 'ReBAC' }, a: { q: 'the SE head cancels an SE-room booking' } },
  ], ['RBAC = role grants an action; ABAC = an attribute (ownership); ReBAC = a relationship (head of the department) (9.3).', 'RBAC = vai cấp một hành động; ABAC = một thuộc tính (sở hữu); ReBAC = một quan hệ (trưởng khoa) (9.3).'])],
  goiY: [['Ownership is an attribute of the pair.', 'Sở hữu là thuộc tính của cặp.'], ['The head case is about a relationship.', 'Trường hợp trưởng khoa là về một quan hệ.']],
  loi: [['Confusing ownership (ABAC) with the role (RBAC).', 'Lẫn sở hữu (ABAC) với vai (RBAC).'], ['Thinking the head case is just a role grant.', 'Tưởng trường hợp trưởng khoa chỉ là một quyền vai.']],
  tns: [tn('attribute', 'thuộc tính')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-9-3-abac-rebac', ten: '9.3 ABAC & ReBAC', khoa: KHOA, baiHoc: 'auth-9-3-abac-rebac', de: [S1, S2, S3] });
