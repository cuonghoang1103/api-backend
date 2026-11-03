/** Authentication · 9.1 — Authorization begins: authn vs authz, IDOR, deny-by-default; write a deny-by-default check. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '9.1-1 — Where authentication ends', kho: 'EASY', phut: 8,
  en: 'LabFlow ID v0.9 guards rooms and bookings across two tenants. This is authorization — a different job from the login.',
  vi: 'LabFlow ID v0.9 canh phòng và lượt đặt qua hai tenant. Đây là phân quyền — một việc khác với đăng nhập.',
  cau: [
    q('c1', ['A route verifies the session, loads a booking by its id, and returns it — nothing else. What is the flaw?', 'Một tuyến xác minh phiên, nạp một lượt đặt theo id, trả về — không gì khác. Lỗ hổng là gì?'],
      ['An IDOR: authentication is fine but authorization is missing — change the id, read anyone\'s booking', 'Nothing is wrong once the session cookie is valid and signed', 'The id in the URL should be encrypted so attackers cannot read it', 'The response is simply missing a caching header for performance'],
      ['Knowing WHO is calling is not knowing they MAY see this object; the missing ownership check is an IDOR — OWASP #1 (9.1).', 'Biết AI đang gọi không phải biết họ ĐƯỢC xem đối tượng này; thiếu phép kiểm sở hữu là một IDOR — OWASP #1 (9.1).']),
    q('c2', ['Why is "deny by default" the safe way to build the gate?', 'Vì sao "từ chối mặc định" là cách an toàn để dựng cổng?'],
      ['A forgotten grant then fails CLOSED — an action nobody granted is denied to everyone', 'It computes the decision measurably faster than the alternatives', 'It lets administrators perform every action without any checks', 'It writes a log line for every request, which deters attackers'],
      ['The decision starts at "no"; only a rule flips it to yes, so a new or forgotten action is forbidden, not silently allowed (9.1).', 'Quyết định bắt đầu ở "không"; chỉ một luật lật thành có, nên một hành động mới hay bị quên thì bị cấm, không âm thầm cho phép (9.1).']),
    q('c3', ['Hiding the "cancel" button from students — is that authorization?', 'Ẩn nút "huỷ" với sinh viên — đó có phải phân quyền không?'],
      ['No — it is UI decoration; the API still answers curl, so the real check must be server-side', 'Yes — if the button is gone the action is impossible to perform', 'Yes — browsers enforce hidden controls for every connected client', 'No — but only because students can still see the button in the HTML'],
      ['The API route answers curl, mobile apps and scripts that render no buttons; every rule in this chapter lives on the server (9.1).', 'Tuyến API trả lời curl, app di động và script không vẽ nút; mọi luật chương này sống ở máy chủ (9.1).']),
  ],
  goiY: [['Authentication answers "who?"; authorization answers "what may you do?".', 'Xác thực trả lời "ai?"; phân quyền trả lời "được làm gì?".'], ['A missing check is the common face of Broken Access Control.', 'Một phép kiểm thiếu là khuôn mặt phổ biến của Kiểm soát truy cập hỏng.']],
  loi: [['Thinking a valid session is enough to return any object.', 'Tưởng một phiên hợp lệ là đủ để trả bất kỳ đối tượng nào.'], ['Treating a hidden button as a security control.', 'Coi một nút bị ẩn là một control bảo mật.']],
  tns: [tn('IDOR', 'IDOR'), tn('Broken Access Control', 'Kiểm soát truy cập hỏng')],
  kn: ['authentication'],
});

function allows(grants, action) {
  // Deny by default: only a '*' blanket or an exact action in the list grants it.
  if (!Array.isArray(grants)) return false;
  return grants.includes('*') || grants.includes(action);
}
const S2 = jsBai({
  ten: '9.1-2 — Write allows(grants, action): deny by default', kho: 'EASY', phut: 8,
  en: `<p>Return <code>true</code> only if <code>grants</code> (an array of action strings) grants <code>action</code>: a <code>'*'</code> blanket grants everything, or the exact <code>action</code> appears in the list. Everything else — including an empty list or a non-array — is <code>false</code> (deny by default).</p>`,
  vi: `<p>Trả <code>true</code> chỉ khi <code>grants</code> (một mảng chuỗi hành động) cấp <code>action</code>: một tấm bao trọn <code>'*'</code> cấp mọi thứ, hoặc đúng <code>action</code> có trong danh sách. Còn lại — kể cả danh sách rỗng hay không phải mảng — là <code>false</code> (từ chối mặc định).</p>`,
  goiY: [['Array.prototype.includes answers both the "*" and the exact-match cases.', 'Array.prototype.includes trả lời cả trường hợp "*" lẫn khớp chính xác.'], ['Default the answer to false; only a rule makes it true.', 'Để mặc định là false; chỉ một luật làm nó true.']],
  loi: [['Returning true for an unknown action (forgetting deny by default).', 'Trả true cho một hành động lạ (quên từ chối mặc định).'], ['Crashing when grants is not an array.', 'Sập khi grants không phải mảng.']],
  gt: ['Deny by default means the function returns true only on an explicit match; a forgotten or unknown action falls through to false (9.1, 9.2).', 'Từ chối mặc định nghĩa là hàm chỉ trả true khi khớp rõ ràng; một hành động bị quên hay lạ rơi xuống false (9.1, 9.2).'],
  kn: ['authentication'], tns: [tn('deny by default', 'từ chối mặc định')],
  dau: `/** ⇒ true if grants (array) grants action; deny by default */
function allows(grants, action) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(allows),
  cases: [
    { goi: goi('allows', ['room:read', 'booking:create'], 'booking:create'), moTa: ['exact match ⇒ true', 'khớp chính xác ⇒ true'] },
    { goi: goi('allows', ['room:read'], 'booking:cancel'), an: true, moTa: ['not granted ⇒ false', 'chưa cấp ⇒ false'] },
    { goi: goi('allows', ['*'], 'anything:at:all'), an: true, moTa: ['blanket ⇒ true', 'bao trọn ⇒ true'] },
    { goi: goi('allows', [], 'booking:read'), an: true, moTa: ['empty ⇒ false', 'rỗng ⇒ false'] },
  ],
});

const S3 = cs({
  ten: '9.1-3 — Order the three structural rules', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the three rules as the lesson introduces them, from the base policy outward.',
  vi: 'Xếp ba luật theo thứ tự bài giới thiệu, từ chính sách gốc ra ngoài.',
  cau: [ord('o1', ['Base → structure', 'Gốc → cấu trúc'], [
    'Deny by default — the answer starts at NO; a rule must flip it',
    'One gate — every decision goes through a single can(user, action, resource)',
    'Decide on the resource — may THIS user act on THIS booking in THIS tenant',
  ], ['Start from "no", funnel every decision through one gate, and decide on the resource, not just the role (9.1).', 'Bắt đầu từ "không", dồn mọi quyết định qua một cổng, và quyết định trên tài nguyên, không chỉ vai (9.1).'])],
  goiY: [['The safe baseline comes first.', 'Mốc an toàn đến trước.'], ['The resource rule needs the gate to exist.', 'Luật tài nguyên cần cổng tồn tại trước.']],
  loi: [['Putting "one gate" before "deny by default".', 'Đặt "một cổng" trước "từ chối mặc định".'], ['Deciding on the role alone.', 'Quyết định chỉ trên vai.']],
  tns: [tn('the gate', 'cổng')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-9-1-phan-quyen-la-gi', ten: '9.1 Authorization begins', khoa: KHOA, baiHoc: 'auth-9-1-phan-quyen-la-gi', de: [S1, S2, S3] });
