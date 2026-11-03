/** Authentication · Lab 9 — the whole gate: write can(user, action, resource) combining all four models in order. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: 'Lab 9-1 — The order is the lesson', kho: 'MEDIUM', phut: 8,
  en: 'Lab 9: write can() — tenant first, then RBAC, then ABAC ownership, then ReBAC dept head, else deny by default.',
  vi: 'Lab 9: viết can() — tenant trước, rồi RBAC, rồi sở hữu ABAC, rồi trưởng khoa ReBAC, không thì từ chối mặc định.',
  cau: [
    q('c1', ['The "yeu" attempt checks the role first and the tenant never. It passes a one-tenant demo but scores 6.5/10. Why?', 'Lần thử "yếu" kiểm vai trước và tenant thì không bao giờ. Nó qua demo một-tenant nhưng đạt 6,5/10. Vì sao?'],
      ['An FPT-HN admin reaches an FPT-HCM booking (T3), and a dept head cannot cancel in their own dept (no ReBAC, T5)', 'It throws an unhandled exception on every incoming request and crashes the grader before any check can run', 'It is simply too slow to evaluate and times out on the hidden cases that the grader runs only on submit', 'It actually passes every check correctly; the 6.5 is just a rounding error in the way the grader totals points'],
      ['The bug is a check in the wrong ORDER plus a missing model — invisible until a second tenant exists (Lab 9, 9.4).', 'Lỗi là một phép kiểm sai THỨ TỰ cộng một mô hình thiếu — vô hình cho tới khi có một tenant thứ hai (Lab 9, 9.4).']),
    q('c2', ['Why must the tenant check come BEFORE the RBAC check?', 'Vì sao phép kiểm tenant phải tới TRƯỚC phép kiểm RBAC?'],
      ['So a cross-tenant ADMIN is denied before "*" is ever considered — the wall is above every grant', 'Because RBAC is slower and should run last for performance', 'Because tenants are optional and roles are mandatory', 'There is no reason; either order gives the same result'],
      ['If the role ran first, an admin\'s "*" would grant access to another tenant\'s resource before the wall was checked (Lab 9, 9.4).', 'Nếu vai chạy trước, "*" của một admin sẽ cấp truy cập tài nguyên của tenant khác trước khi bức tường được kiểm (Lab 9, 9.4).']),
    q('c3', ['What must a null user or resource produce?', 'Một user hay resource null phải cho ra gì?'],
      ['A safe false — never a crash', 'A thrown error so the caller knows', 'true, to fail open for convenience', 'A 500 status code from the function'],
      ['Guard the inputs first: a missing user or resource is a safe false, so malformed input never 500s (Lab 9).', 'Chặn đầu vào trước: một user hay resource thiếu là một false an toàn, nên đầu vào dị dạng không bao giờ 500 (Lab 9).']),
  ],
  goiY: [['Tenant first means it is checked above even ADMIN.', 'Tenant trước nghĩa là nó được kiểm trên cả ADMIN.'], ['The yeu bug is about order, not a crash.', 'Lỗi yếu là về thứ tự, không phải một cú sập.']],
  loi: [['Checking the role before the tenant.', 'Kiểm vai trước tenant.'], ['Letting a null input throw.', 'Để một đầu vào null ném lỗi.']],
  tns: [tn('deny by default', 'từ chối mặc định'), tn('tenant boundary', 'ranh giới tenant')],
  kn: ['authentication'],
});

const ROLE_GRANTS = {
  STUDENT: ['room:read', 'booking:read', 'booking:create'],
  TEACHER: ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN: ['*'],
};
function can(user, action, resource) {
  // The whole gate, in order. Tenant FIRST — even ADMIN never crosses it.
  if (!user || !resource) return false;
  if (resource.tenantId !== user.tenantId) return false;                                         // tenant boundary
  const grants = ROLE_GRANTS[user.role] || [];
  if (grants.includes('*') || grants.includes(action)) return true;                              // RBAC
  if (action === 'booking:cancel' && resource.ownerId === user.id) return true;                  // ABAC
  if (action === 'booking:cancel' && user.role === 'DEPT_HEAD' && resource.departmentId === user.departmentId) return true;  // ReBAC
  return false;                                                                                  // deny by default
}
const S2 = jsBai({
  ten: 'Lab 9-2 — Write can(user, action, resource): the whole gate', kho: 'HARD', phut: 18,
  en: `<p>Write LabFlow's one gate. In this order: a null <code>user</code> or <code>resource</code> ⇒ <code>false</code>; <b>tenant</b> — <code>resource.tenantId !== user.tenantId</code> ⇒ <code>false</code> (first, even for ADMIN); <b>RBAC</b> — <code>ROLE_GRANTS[user.role]</code> includes <code>'*'</code> or the action ⇒ <code>true</code>; <b>ABAC</b> — <code>'booking:cancel'</code> and <code>resource.ownerId === user.id</code> ⇒ <code>true</code>; <b>ReBAC</b> — <code>'booking:cancel'</code> and <code>DEPT_HEAD</code> and <code>resource.departmentId === user.departmentId</code> ⇒ <code>true</code>; otherwise <code>false</code>.</p>`,
  vi: `<p>Viết cổng duy nhất của LabFlow. Theo thứ tự: một <code>user</code> hay <code>resource</code> null ⇒ <code>false</code>; <b>tenant</b> — <code>resource.tenantId !== user.tenantId</code> ⇒ <code>false</code> (đầu tiên, kể cả với ADMIN); <b>RBAC</b> — <code>ROLE_GRANTS[user.role]</code> chứa <code>'*'</code> hoặc action ⇒ <code>true</code>; <b>ABAC</b> — <code>'booking:cancel'</code> và <code>resource.ownerId === user.id</code> ⇒ <code>true</code>; <b>ReBAC</b> — <code>'booking:cancel'</code> và <code>DEPT_HEAD</code> và <code>resource.departmentId === user.departmentId</code> ⇒ <code>true</code>; còn lại <code>false</code>.</p>`,
  goiY: [['Return false on a null input before touching any property.', 'Trả false với một đầu vào null trước khi chạm thuộc tính nào.'], ['Put the tenant comparison before the role lookup.', 'Đặt phép so tenant trước lần tra vai.']],
  loi: [['Checking the role before the tenant (a cross-tenant admin then slips through).', 'Kiểm vai trước tenant (một admin khác tenant lọt qua).'], ['Letting any DEPT_HEAD cancel any booking, ignoring the department.', 'Cho bất kỳ DEPT_HEAD nào huỷ bất kỳ lượt đặt nào, bỏ qua khoa.']],
  gt: ['can() combines four models behind the tenant boundary; the order makes the wall sit above every grant, and deny-by-default closes the rest (Lab 9, 9.2–9.5).', 'can() gộp bốn mô hình sau ranh giới tenant; thứ tự làm bức tường ở trên mọi quyền, và từ-chối-mặc-định đóng phần còn lại (Lab 9, 9.2–9.5).'],
  kn: ['authentication'], tns: [tn('the gate', 'cổng'), tn('RBAC/ABAC/ReBAC', 'RBAC/ABAC/ReBAC')],
  dau: `const ROLE_GRANTS = {
  STUDENT: ['room:read', 'booking:read', 'booking:create'],
  TEACHER: ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN: ['*'],
};
/** ⇒ true if user may perform action on resource; deny by default, tenant first */
function can(user, action, resource) {
  // Write your solution here
  return true;
}
`,
  giai: `const ROLE_GRANTS = {
  STUDENT: ['room:read', 'booking:read', 'booking:create'],
  TEACHER: ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN: ['*'],
};
` + '// Reference solution\n' + nguon(can),
  cases: [
    { goi: goi('can', { id: 'u1', role: 'STUDENT', tenantId: 'hcm', departmentId: 'se' }, 'booking:create', { tenantId: 'hcm', ownerId: 'u9', departmentId: 'se' }), moTa: ['STUDENT create ⇒ true (RBAC)', 'STUDENT tạo ⇒ true (RBAC)'] },
    { goi: goi('can', { id: 'u1', role: 'STUDENT', tenantId: 'hcm', departmentId: 'se' }, 'booking:cancel', { tenantId: 'hcm', ownerId: 'u1', departmentId: 'se' }), an: true, moTa: ['owner cancel ⇒ true (ABAC)', 'chủ huỷ ⇒ true (ABAC)'] },
    { goi: goi('can', { id: 'u2', role: 'STUDENT', tenantId: 'hcm', departmentId: 'se' }, 'booking:cancel', { tenantId: 'hcm', ownerId: 'u1', departmentId: 'se' }), an: true, moTa: ['peer cancel ⇒ false', 'bạn cùng vai huỷ ⇒ false'] },
    { goi: goi('can', { id: 'u9', role: 'DEPT_HEAD', tenantId: 'hcm', departmentId: 'se' }, 'booking:cancel', { tenantId: 'hcm', ownerId: 'u1', departmentId: 'se' }), an: true, moTa: ['SE head ⇒ true (ReBAC)', 'trưởng SE ⇒ true (ReBAC)'] },
    { goi: goi('can', { id: 'u0', role: 'ADMIN', tenantId: 'hn', departmentId: null }, 'booking:cancel', { tenantId: 'hcm', ownerId: 'u1', departmentId: 'se' }), an: true, moTa: ['cross-tenant ADMIN ⇒ false (tenant first)', 'ADMIN khác tenant ⇒ false (tenant trước)'] },
    { goi: goi('can', null, 'booking:read', { tenantId: 'hcm', ownerId: 'u1', departmentId: 'se' }), an: true, moTa: ['null user ⇒ false', 'user null ⇒ false'] },
  ],
});

const S3 = cs({
  ten: 'Lab 9-3 — Grade each attempt', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order these three can() attempts from the lowest grade to the highest.',
  vi: 'Xếp ba lần thử can() này từ điểm thấp nhất tới cao nhất.',
  cau: [ord('o1', ['Lowest → highest', 'Thấp → cao'], [
    'The empty starter (returns true always) — 1.5/10',
    'The "yeu" attempt (role first, no tenant, no ReBAC) — 6.5/10',
    'The reference (tenant first, all four models) — 10/10',
  ], ['The starter grants everything; the yeu attempt leaks across tenants and misses ReBAC; the reference passes all six checks (Lab 9).', 'Bản khởi đầu cấp mọi thứ; lần thử yếu rò xuyên tenant và thiếu ReBAC; bản tham khảo qua cả sáu phép (Lab 9).'])],
  goiY: [['The starter is the least correct.', 'Bản khởi đầu ít đúng nhất.'], ['The yeu attempt is close but fails the tenant and ReBAC checks.', 'Lần thử yếu gần đạt nhưng trượt tenant và ReBAC.']],
  loi: [['Thinking the yeu attempt passes (it is 6.5, below 7).', 'Tưởng lần thử yếu đạt (nó 6,5, dưới 7).'], ['Thinking the starter scores zero (it scores some partial points).', 'Tưởng bản khởi đầu được 0 (nó được ít điểm lẻ).']],
  tns: [tn('pass = 7/10', 'đạt = 7/10')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-9-7-lab-can', ten: 'Lab 9 — the whole gate', khoa: KHOA, baiHoc: 'auth-9-7-lab-can', de: [S1, S2, S3] });
