/** Authentication · 9.2 — RBAC: roles grant actions, in one table; write a role lookup over a grant table. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '9.2-1 — Roles grant actions', kho: 'EASY', phut: 8,
  en: 'RBAC: a user has a role, a role grants a fixed set of actions, kept in one ROLE_GRANTS table.',
  vi: 'RBAC: một người dùng có một vai, một vai cấp một tập hành động cố định, giữ trong một bảng ROLE_GRANTS.',
  cau: [
    q('c1', ['Why name actions "booking:create", not "the bookings page"?', 'Vì sao đặt tên hành động "booking:create", không phải "trang lượt đặt"?'],
      ['A page ties authorization to the UI; an action (verb on a resource) protects web, mobile and scripts alike', 'Action names like booking:create are shorter strings, so the gate compares them measurably faster at runtime', 'A page name simply cannot be stored as a key in the ROLE_GRANTS object, whereas an action verb can be stored there', 'The Express framework forbids the word "page" from appearing anywhere inside a registered route definition'],
      ['The API has no pages; naming the action protects every client, not just the web UI (9.2).', 'API không có trang; đặt tên hành động bảo vệ mọi client, không chỉ giao diện web (9.2).']),
    q('c2', ['A teammate writes if (user.role === \'Admin\') in one controller. Name the two separate problems.', 'Một đồng đội viết if (user.role === \'Admin\') trong một controller. Gọi tên hai vấn đề riêng.'],
      ['It scatters the policy outside the one gate, and \'Admin\' never matches the stored \'ADMIN\' (case drift)', 'It is too slow, and it should be wrapped in a try/catch for safety', 'It needs a database index, and the role should be a number not a string', 'It is perfectly fine; role checks belong in each controller'],
      ['One is structural (policy belongs in one table/gate); one is a concrete case-mismatch bug — scattered role strings rot this way (9.2).', 'Một cái là cấu trúc (chính sách thuộc một bảng/cổng); một cái là lỗi lệch chữ hoa/thường — chuỗi vai rải rác mục ruỗng kiểu này (9.2).']),
    q('c3', ['A brand-new action nobody added to any role — who may do it?', 'Một hành động mới chưa ai thêm vào vai nào — ai được làm?'],
      ['Nobody — the lookup finds no match and deny-by-default forbids it for everyone', 'Everybody, until an admin explicitly forbids it', 'Only ADMIN, because ADMIN can always do new things', 'Only the user who wrote the code that added the action'],
      ['can() returns true only on a match; an ungranted action falls through to false — a forgotten grant fails closed (9.2).', 'can() chỉ trả true khi khớp; một hành động chưa cấp rơi xuống false — một quyền bị quên hỏng đóng (9.2).']),
  ],
  goiY: [['The grant table is the single source of truth.', 'Bảng quyền là nguồn sự thật duy nhất.'], ['Deny by default makes forgotten grants safe.', 'Từ chối mặc định làm các quyền bị quên an toàn.']],
  loi: [['Naming permissions after UI pages.', 'Đặt tên quyền theo trang giao diện.'], ['Scattering role-string checks through controllers.', 'Rải phép kiểm chuỗi vai khắp controller.']],
  tns: [tn('RBAC', 'RBAC'), tn('grant table', 'bảng quyền')],
  kn: ['authentication'],
});

const ROLE_GRANTS = {
  STUDENT: ['room:read', 'booking:read', 'booking:create'],
  TEACHER: ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN: ['*'],
};
function roleCan(role, action) {
  // RBAC lookup: the role's grant list, with '*' as a blanket. Unknown role ⇒ no grants ⇒ false.
  const grants = ROLE_GRANTS[role] || [];
  return grants.includes('*') || grants.includes(action);
}
const S2 = jsBai({
  ten: '9.2-2 — Write roleCan(role, action): the RBAC lookup', kho: 'EASY', phut: 10,
  en: `<p>Using the <code>ROLE_GRANTS</code> table below, return <code>true</code> if <code>role</code> grants <code>action</code>. <code>ADMIN</code> holds <code>'*'</code> (a blanket). An unknown role has no grants. This is pure RBAC — no tenant or ownership here.</p>`,
  vi: `<p>Dùng bảng <code>ROLE_GRANTS</code> dưới đây, trả <code>true</code> nếu <code>role</code> cấp <code>action</code>. <code>ADMIN</code> giữ <code>'*'</code> (bao trọn). Một vai lạ không có quyền. Đây là RBAC thuần — chưa có tenant hay sở hữu.</p>`,
  goiY: [['Look the role up in the table, default to an empty list.', 'Tra vai trong bảng, mặc định một danh sách rỗng.'], ['"*" is a blanket; check it before the exact action.', '"*" là bao trọn; kiểm nó trước hành động chính xác.']],
  loi: [['Crashing on an unknown role instead of returning false.', 'Sập với một vai lạ thay vì trả false.'], ['Forgetting that ADMIN\'s "*" grants everything.', 'Quên rằng "*" của ADMIN cấp mọi thứ.']],
  gt: ['RBAC is a lookup of the role\'s grant list; the one table is the single source of truth, and "*" is the ADMIN blanket (9.2).', 'RBAC là một lần tra danh sách quyền của vai; một bảng là nguồn sự thật duy nhất, và "*" là tấm bao trọn của ADMIN (9.2).'],
  kn: ['authentication'], tns: [tn('role', 'vai'), tn('action', 'hành động')],
  dau: `const ROLE_GRANTS = {
  STUDENT: ['room:read', 'booking:read', 'booking:create'],
  TEACHER: ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN: ['*'],
};
/** ⇒ true if role grants action (RBAC) */
function roleCan(role, action) {
  // Write your solution here
  return false;
}
`,
  giai: `const ROLE_GRANTS = {
  STUDENT: ['room:read', 'booking:read', 'booking:create'],
  TEACHER: ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN: ['*'],
};
` + '// Reference solution\n' + nguon(roleCan),
  cases: [
    { goi: goi('roleCan', 'STUDENT', 'booking:create'), moTa: ['STUDENT may create ⇒ true', 'STUDENT được tạo ⇒ true'] },
    { goi: goi('roleCan', 'STUDENT', 'room:manage'), an: true, moTa: ['STUDENT no room:manage ⇒ false', 'STUDENT không room:manage ⇒ false'] },
    { goi: goi('roleCan', 'DEPT_HEAD', 'room:manage'), moTa: ['DEPT_HEAD may manage ⇒ true', 'DEPT_HEAD được quản lý ⇒ true'] },
    { goi: goi('roleCan', 'ADMIN', 'booking:cancel'), an: true, moTa: ['ADMIN blanket ⇒ true', 'ADMIN bao trọn ⇒ true'] },
    { goi: goi('roleCan', 'GHOST', 'room:read'), an: true, moTa: ['unknown role ⇒ false', 'vai lạ ⇒ false'] },
  ],
});

const S3 = cs({
  ten: '9.2-3 — Role → what it adds', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each role to the capability it adds over a STUDENT.',
  vi: 'Ghép mỗi vai với khả năng nó thêm so với một STUDENT.',
  bang: [bang1('b1', ['Role → adds', 'Vai → thêm'], [{ ma: 'x', ten: 'Role' }, { ma: 'q', ten: 'Adds', luaChon: ['nothing beyond STUDENT', 'room:manage', 'a blanket (* within its tenant)'] }], [
    { o: { x: 'TEACHER' }, a: { q: 'nothing beyond STUDENT' } },
    { o: { x: 'DEPT_HEAD' }, a: { q: 'room:manage' } },
    { o: { x: 'ADMIN' }, a: { q: 'a blanket (* within its tenant)' } },
  ], ['TEACHER and STUDENT share the same grants here; DEPT_HEAD adds room:manage; ADMIN is "*", still tenant-scoped (9.2).', 'TEACHER và STUDENT cùng quyền ở đây; DEPT_HEAD thêm room:manage; ADMIN là "*", vẫn trong phạm vi tenant (9.2).'])],
  goiY: [['Two roles share the same grants in this table.', 'Hai vai cùng quyền trong bảng này.'], ['ADMIN\'s blanket is still scoped to its tenant.', 'Tấm bao trọn của ADMIN vẫn trong phạm vi tenant.']],
  loi: [['Thinking a TEACHER can manage rooms.', 'Tưởng một TEACHER quản lý được phòng.'], ['Thinking ADMIN crosses tenants.', 'Tưởng ADMIN vượt tenant.']],
  tns: [tn('blanket grant', 'quyền bao trọn')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-9-2-rbac', ten: '9.2 RBAC', khoa: KHOA, baiHoc: 'auth-9-2-rbac', de: [S1, S2, S3] });
