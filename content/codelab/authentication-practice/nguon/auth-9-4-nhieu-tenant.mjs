/** Authentication · 9.4 — Multi-tenancy: the 404-not-403 rule; write the status mapper that hides existence. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '9.4-1 — The boundary that must not leak', kho: 'EASY', phut: 8,
  en: 'LabFlow ID serves FPT HCM and FPT HN from one database. A tenant is a hard wall — checked first, above every role.',
  vi: 'LabFlow ID phục vụ FPT HCM và FPT HN từ một cơ sở dữ liệu. Một tenant là một bức tường cứng — kiểm trước, trên mọi vai.',
  cau: [
    q('c1', ['Why must a cross-tenant request return 404, not 403?', 'Vì sao một yêu cầu khác tenant phải trả 404, không 403?'],
      ['A 403 confirms the resource EXISTS, enabling enumeration across the wall; 404 (same as "not found") reveals nothing', 'A 404 response is measurably faster for the server to produce than a 403, so it is preferred for performance', 'The 403 status is reserved only for expired or revoked sessions, while 404 is used for every other failure', 'Browsers silently refuse to display the body of a 403 response that comes from a different tenant origin'],
      ['Returning the same 404 as a missing id means a cross-tenant probe cannot tell existing ids from fake ones (9.4, the 6.4 rule).', 'Trả cùng cái 404 như một id thiếu nghĩa là một cú dò khác tenant không phân biệt được id có thật với id giả (9.4, luật 6.4).']),
    q('c2', ['Where in can() is the tenant compared, relative to the role?', 'Trong can(), tenant được so ở đâu, so với vai?'],
      ['First, before any role — even ADMIN\'s "*" is checked after, so an admin never crosses tenants', 'Last, after all role, ownership and relationship checks', 'Only for non-admins; admins skip the tenant check', 'It is not compared in can(); the database handles it'],
      ['The tenant line is first; "*" is checked after it, so the wall sits above every grant, admin included (9.4).', 'Dòng tenant là đầu tiên; "*" kiểm sau nó, nên bức tường ở trên mọi quyền, kể cả admin (9.4).']),
    q('c3', ['When is a 403 (not 404) the honest, correct answer?', 'Khi nào một 403 (không 404) là câu trả lời trung thực, đúng?'],
      ['When the resource IS in the user\'s own tenant but no model grants the action — existence is not a secret there', 'Whenever the user lacks any role at all, regardless of which tenant the requested resource belongs to', 'Only for requests that come from administrators, since an admin is entitled to a more specific error', 'Never under any circumstances — the gate should always answer 404 to be safe against enumeration'],
      ['Within your own tenant, existence is not a secret, so an honest 403 leaks nothing; 404 is reserved for cross-tenant/missing (9.4).', 'Trong tenant của chính bạn, sự tồn tại không phải bí mật, nên một 403 trung thực không lộ gì; 404 dành cho khác-tenant/thiếu (9.4).']),
  ],
  goiY: [['A 403 is an admission that the thing exists.', 'Một 403 là một sự thừa nhận rằng món đồ tồn tại.'], ['The tenant check is above every grant.', 'Phép kiểm tenant ở trên mọi quyền.']],
  loi: [['Returning 403 for another tenant\'s resource.', 'Trả 403 cho tài nguyên của tenant khác.'], ['Letting ADMIN skip the tenant check.', 'Cho ADMIN bỏ qua phép kiểm tenant.']],
  tns: [tn('multi-tenancy', 'nhiều tenant'), tn('enumeration', 'dò')],
  kn: ['authentication'],
});

function statusFor(ctx) {
  // ctx = { hasUser, exists, sameTenant, granted }. Map one request to an HTTP status.
  if (!ctx.hasUser) return 401;                       // no session
  if (!ctx.exists || !ctx.sameTenant) return 404;     // missing OR other tenant — indistinguishable
  if (!ctx.granted) return 403;                        // same tenant, no grant — honest "you cannot"
  return 200;                                          // allowed
}
const S2 = jsBai({
  ten: '9.4-2 — Write statusFor(ctx): 404, not 403, across tenants', kho: 'MEDIUM', phut: 12,
  en: `<p>Map a request to an HTTP status from <code>ctx = { hasUser, exists, sameTenant, granted }</code>: no user ⇒ <code>401</code>; the resource is missing OR in another tenant ⇒ <code>404</code> (the two must be indistinguishable); same tenant but not granted ⇒ <code>403</code>; otherwise ⇒ <code>200</code>. The order matters: a cross-tenant resource must look exactly like a missing one.</p>`,
  vi: `<p>Ánh xạ một yêu cầu tới một mã HTTP từ <code>ctx = { hasUser, exists, sameTenant, granted }</code>: không user ⇒ <code>401</code>; tài nguyên thiếu HOẶC ở tenant khác ⇒ <code>404</code> (hai cái phải không phân biệt được); cùng tenant nhưng không được cấp ⇒ <code>403</code>; còn lại ⇒ <code>200</code>. Thứ tự quan trọng: một tài nguyên khác tenant phải trông giống hệt một cái thiếu.</p>`,
  goiY: [['Combine "missing" and "other tenant" into the SAME 404 branch.', 'Gộp "thiếu" và "khác tenant" vào CÙNG nhánh 404.'], ['Only reach the 403 branch when the resource is in your tenant.', 'Chỉ tới nhánh 403 khi tài nguyên trong tenant của bạn.']],
  loi: [['Returning 403 for a cross-tenant resource (leaking its existence).', 'Trả 403 cho một tài nguyên khác tenant (lộ sự tồn tại).'], ['Checking granted before the tenant, so a probe learns the id exists.', 'Kiểm granted trước tenant, nên một cú dò biết id tồn tại.']],
  gt: ['A cross-tenant resource and a missing one both answer 404, so existence never leaks; 403 is reserved for same-tenant no-grant (9.4).', 'Một tài nguyên khác tenant và một cái thiếu đều trả 404, nên sự tồn tại không bao giờ rò; 403 dành cho cùng-tenant-thiếu-quyền (9.4).'],
  kn: ['authentication'], tns: [tn('tenant boundary', 'ranh giới tenant'), tn('404 not 403', '404 không 403')],
  dau: `/** ctx = { hasUser, exists, sameTenant, granted } ⇒ 401 | 404 | 403 | 200 */
function statusFor(ctx) {
  // Write your solution here
  return 200;
}
`,
  giai: '// Reference solution\n' + nguon(statusFor),
  cases: [
    { goi: goi('statusFor', { hasUser: true, exists: true, sameTenant: true, granted: true }), moTa: ['allowed ⇒ 200', 'được phép ⇒ 200'] },
    { goi: goi('statusFor', { hasUser: true, exists: true, sameTenant: true, granted: false }), an: true, moTa: ['same tenant, no grant ⇒ 403', 'cùng tenant, không quyền ⇒ 403'] },
    { goi: goi('statusFor', { hasUser: true, exists: true, sameTenant: false, granted: true }), an: true, moTa: ['other tenant ⇒ 404', 'tenant khác ⇒ 404'] },
    { goi: goi('statusFor', { hasUser: true, exists: false, sameTenant: true, granted: true }), an: true, moTa: ['missing ⇒ 404 (same as other tenant)', 'thiếu ⇒ 404 (giống tenant khác)'] },
    { goi: goi('statusFor', { hasUser: false, exists: true, sameTenant: true, granted: true }), an: true, moTa: ['no user ⇒ 401', 'không user ⇒ 401'] },
  ],
});

const S3 = cs({
  ten: '9.4-3 — Request → status', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each request against An\'s FPT-HCM booking to the status the gate returns.',
  vi: 'Ghép mỗi yêu cầu lên lượt đặt FPT-HCM của An với mã cổng trả.',
  bang: [bang1('b1', ['Request → status', 'Yêu cầu → mã'], [{ ma: 'x', ten: 'Caller' }, { ma: 'q', ten: 'Status', luaChon: ['200', '403', '404'] }], [
    { o: { x: 'An, the owner' }, a: { q: '200' } },
    { o: { x: 'Binh, same tenant, not owner' }, a: { q: '403' } },
    { o: { x: 'a student from FPT HN' }, a: { q: '404' } },
  ], ['Owner 200; same-tenant-no-grant 403 (honest); other-tenant 404, identical to a missing id (9.4).', 'Chủ 200; cùng-tenant-thiếu-quyền 403 (trung thực); khác-tenant 404, giống hệt một id thiếu (9.4).'])],
  goiY: [['Only one caller is in another tenant.', 'Chỉ một người gọi ở tenant khác.'], ['The other-tenant status matches a missing id.', 'Mã khác-tenant khớp một id thiếu.']],
  loi: [['Giving the HN student a 403.', 'Cho sinh viên HN một 403.'], ['Giving Binh a 404.', 'Cho Bình một 404.']],
  tns: [tn('403 vs 404', '403 với 404')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-9-4-nhieu-tenant', ten: '9.4 Multi-tenancy', khoa: KHOA, baiHoc: 'auth-9-4-nhieu-tenant', de: [S1, S2, S3] });
