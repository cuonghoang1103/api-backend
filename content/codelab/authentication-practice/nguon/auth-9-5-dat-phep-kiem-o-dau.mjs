/** Authentication · 9.5 — Where the check lives: one gate middleware; write the gate's status decision. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '9.5-1 — One gate, not a review note', kho: 'EASY', phut: 8,
  en: 'can() is a clean decision function — but a function nobody calls protects nothing. The check goes in one gate middleware.',
  vi: 'can() là một hàm quyết định sạch — nhưng một hàm không ai gọi chẳng bảo vệ gì. Phép kiểm đi vào một middleware cổng.',
  cau: [
    q('c1', ['Why does the gate middleware load the resource itself, instead of trusting one the handler passes in?', 'Vì sao middleware cổng tự nạp tài nguyên, thay vì tin một cái handler truyền vào?'],
      ['So a handler cannot hand it attacker-controlled ownerId/tenantId and bypass ABAC and the tenant check', 'To save exactly one database query per request', 'Because Express middleware cannot read req.params at all', 'So the handler runs before the authorization check for speed'],
      ['If the handler supplied the resource it could supply forged attributes, defeating the very checks the gate exists for (9.3, 9.5).', 'Nếu handler cung cấp tài nguyên, nó có thể cung cấp thuộc tính giả, đánh bại đúng các phép kiểm cổng tồn tại để làm (9.3, 9.5).']),
    q('c2', ['How do you stop a teammate adding an unguarded route by accident?', 'Bạn chặn một đồng đội vô tình thêm một tuyến không canh phòng thế nào?'],
      ['Register routes through a helper that REQUIRES an action, so a missing check fails at startup — loud, not silent', 'Add a prominent comment at the top of every route file reminding everyone to call can() on each handler', 'Run a careful manual code review before every single deploy and look for any route missing an authorization check', 'Trust that everyone on the team reliably remembers to call can() by hand each time they add a new route'],
      ['Make the unsafe path fail loudly at startup; "remember to check" is a review note, and review notes are forgotten (9.5).', 'Làm con đường không an toàn trượt ồn ào lúc khởi động; "nhớ kiểm" là một lời nhắc review, và lời nhắc review thì bị quên (9.5).']),
    q('c3', ['Do you still need WHERE tenant_id = $me on queries if the gate checks the tenant?', 'Vẫn cần WHERE tenant_id = $me trên truy vấn nếu cổng kiểm tenant không?'],
      ['Yes — defence in depth; a bug in one layer should not open the wall', 'No — the gate makes the query filter completely redundant', 'No — query filters are slower and should be removed', 'Yes — but only on DELETE queries, not SELECT'],
      ['The gate states the policy; the filter protects the data. Keep both, so one bug is not a breach (9.5).', 'Cổng phát biểu chính sách; bộ lọc bảo vệ dữ liệu. Giữ cả hai, để một lỗi không phải một lỗ thủng (9.5).']),
  ],
  goiY: [['The gate fetches the server\'s record itself.', 'Cổng tự lấy bản ghi của máy chủ.'], ['Make the forgetful path fail loudly.', 'Làm con đường đãng trí trượt ồn ào.']],
  loi: [['Trusting a resource the handler hands in.', 'Tin một tài nguyên handler đưa vào.'], ['Relying on "remember to call can()".', 'Dựa vào "nhớ gọi can()".']],
  tns: [tn('gate middleware', 'middleware cổng'), tn('defence in depth', 'phòng thủ nhiều lớp')],
  kn: ['authentication'],
});

function gate(ctx) {
  // The gate's decision for one route. ctx = { hasUser, resource, allowed }.
  // resource is the loaded record (with .tenantId) or null; userTenant is the caller's tenant.
  if (!ctx.hasUser) return 'NO_SESSION';                                   // 401
  if (!ctx.resource || ctx.resource.tenantId !== ctx.userTenant) return 'NOT_FOUND';  // 404 — missing or other tenant
  if (!ctx.allowed) return 'FORBIDDEN';                                    // 403 — same tenant, can() said no
  return 'OK';                                                             // 200 — handler may run
}
const S2 = jsBai({
  ten: '9.5-2 — Write gate(ctx): the one middleware decision', kho: 'MEDIUM', phut: 12,
  en: `<p>Return the gate's outcome from <code>ctx = { hasUser, userTenant, resource, allowed }</code>, where <code>resource</code> is the loaded record (with <code>.tenantId</code>) or <code>null</code>: no user ⇒ <code>'NO_SESSION'</code>; resource missing OR <code>resource.tenantId !== userTenant</code> ⇒ <code>'NOT_FOUND'</code>; <code>allowed</code> is false ⇒ <code>'FORBIDDEN'</code>; otherwise ⇒ <code>'OK'</code>. Cross-tenant and missing must both be <code>'NOT_FOUND'</code>.</p>`,
  vi: `<p>Trả kết cục của cổng từ <code>ctx = { hasUser, userTenant, resource, allowed }</code>, với <code>resource</code> là bản ghi đã nạp (có <code>.tenantId</code>) hoặc <code>null</code>: không user ⇒ <code>'NO_SESSION'</code>; resource thiếu HOẶC <code>resource.tenantId !== userTenant</code> ⇒ <code>'NOT_FOUND'</code>; <code>allowed</code> là false ⇒ <code>'FORBIDDEN'</code>; còn lại ⇒ <code>'OK'</code>. Khác tenant và thiếu đều phải là <code>'NOT_FOUND'</code>.</p>`,
  goiY: [['Guard the order: session, then tenant (as 404), then the grant (as 403).', 'Giữ thứ tự: phiên, rồi tenant (thành 404), rồi quyền (thành 403).'], ['A null resource and a wrong-tenant resource share the NOT_FOUND branch.', 'Một resource null và một resource sai tenant chung nhánh NOT_FOUND.']],
  loi: [['Returning FORBIDDEN for a cross-tenant resource.', 'Trả FORBIDDEN cho một resource khác tenant.'], ['Crashing on a null resource instead of NOT_FOUND.', 'Sập với một resource null thay vì NOT_FOUND.']],
  gt: ['The one gate maps every route to four outcomes; cross-tenant is NOT_FOUND, identical to missing, so the boundary never leaks (9.5).', 'Một cổng ánh xạ mọi tuyến tới bốn kết cục; khác tenant là NOT_FOUND, giống hệt thiếu, nên ranh giới không bao giờ rò (9.5).'],
  kn: ['authentication'], tns: [tn('req.resource', 'req.resource')],
  dau: `/** ctx = { hasUser, userTenant, resource, allowed } ⇒ 'NO_SESSION' | 'NOT_FOUND' | 'FORBIDDEN' | 'OK' */
function gate(ctx) {
  // Write your solution here
  return 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(gate),
  cases: [
    { goi: goi('gate', { hasUser: true, userTenant: 'hcm', resource: { tenantId: 'hcm' }, allowed: true }), moTa: ['allowed ⇒ OK', 'được phép ⇒ OK'] },
    { goi: goi('gate', { hasUser: true, userTenant: 'hcm', resource: { tenantId: 'hcm' }, allowed: false }), an: true, moTa: ['no grant ⇒ FORBIDDEN', 'không quyền ⇒ FORBIDDEN'] },
    { goi: goi('gate', { hasUser: true, userTenant: 'hcm', resource: { tenantId: 'hn' }, allowed: true }), an: true, moTa: ['other tenant ⇒ NOT_FOUND', 'tenant khác ⇒ NOT_FOUND'] },
    { goi: goi('gate', { hasUser: true, userTenant: 'hcm', resource: null, allowed: true }), an: true, moTa: ['missing ⇒ NOT_FOUND', 'thiếu ⇒ NOT_FOUND'] },
    { goi: goi('gate', { hasUser: false, userTenant: 'hcm', resource: { tenantId: 'hcm' }, allowed: true }), an: true, moTa: ['no user ⇒ NO_SESSION', 'không user ⇒ NO_SESSION'] },
  ],
});

const S3 = cs({
  ten: '9.5-3 — Order a request through the gate', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order what the gate middleware does for one write request, from arrival to the handler.',
  vi: 'Xếp những gì middleware cổng làm cho một yêu cầu ghi, từ lúc đến tới handler.',
  cau: [ord('o1', ['Arrival → handler', 'Đến → handler'], [
    'Check there is a user (else 401)',
    'Load the resource server-side by its id',
    'Enforce the tenant boundary — missing or other tenant ⇒ 404',
    'Call can(); no grant ⇒ 403',
    'Set req.resource and call next() — the handler runs',
  ], ['Session, then load, then tenant (404), then can() (403), then hand the loaded resource to the handler (9.5).', 'Phiên, rồi nạp, rồi tenant (404), rồi can() (403), rồi đưa tài nguyên đã nạp cho handler (9.5).'])],
  goiY: [['You cannot check the tenant before loading the resource.', 'Không kiểm tenant được trước khi nạp tài nguyên.'], ['The handler runs last, only after a yes.', 'Handler chạy cuối, chỉ sau một "có".']],
  loi: [['Calling the handler before the gate decides.', 'Gọi handler trước khi cổng quyết định.'], ['Checking the grant before the tenant.', 'Kiểm quyền trước tenant.']],
  tns: [tn('next()', 'next()')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-9-5-dat-phep-kiem-o-dau', ten: '9.5 Where the check lives', khoa: KHOA, baiHoc: 'auth-9-5-dat-phep-kiem-o-dau', de: [S1, S2, S3] });
