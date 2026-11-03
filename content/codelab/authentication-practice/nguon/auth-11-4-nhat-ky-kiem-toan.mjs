/** Authentication · 11.4 — The audit log; write isSensitive() for the redaction. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '11.4-1 — Write enough, leak nothing', kho: 'EASY', phut: 8,
  en: 'An audit log reconstructs an incident (who/what/when/where/outcome) and must never contain a secret.',
  vi: 'Một nhật ký kiểm toán tái dựng một sự cố (ai/gì/khi/đâu/kết quả) và không bao giờ được chứa một bí mật.',
  cau: [
    q('c1', ['Which belongs in an audit entry, and which must never?', 'Cái nào thuộc về một mục audit, và cái nào không bao giờ?'],
      ['Keep actor, action, outcome, time, ip, request id; never a token, password, cookie, OTP or recovery code', 'Keep everything, including the token and password, for completeness', 'Keep only the timestamp; everything else is a privacy risk', 'Keep the password but hash it first so it is safe to store in logs'],
      ['Write what reconstructs the incident; never a secret — a logged secret is a second breach (11.4).', 'Ghi cái tái dựng sự cố; không bao giờ một bí mật — một bí mật bị log là một vụ rò thứ hai (11.4).']),
    q('c2', ['Why an allow-list, not a deny-list, for what an entry may contain?', 'Vì sao một allow-list, không phải deny-list, cho cái một mục được chứa?'],
      ['A deny-list misses any new sensitive field a teammate adds later; an allow-list only passes fields you named safe', 'An allow-list is simply faster for the CPU to evaluate per request', 'A deny-list cannot be written for objects with nested fields', 'An allow-list lets you keep more fields in the log overall'],
      ['A deny-list blocks only what you listed; a new field is logged by default. Allow-list is safe by construction (11.4, 1.5).', 'Một deny-list chỉ chặn cái bạn liệt kê; một trường mới được log mặc định. Allow-list an toàn theo cấu trúc (11.4, 1.5).']),
    q('c3', ['Why ship audit entries off the server to append-only storage?', 'Vì sao chuyển các mục audit ra khỏi máy chủ tới kho chỉ-thêm?'],
      ['So an attacker who compromises the box cannot edit or delete the record of their own actions', 'So the local disk does not fill up with log files', 'So the logs load faster in the dashboard', 'So the timestamps are more accurate across time zones'],
      ['A log the attacker can delete is not an audit log; it must be tamper-evident (11.4).', 'Một log kẻ tấn công xoá được không phải một nhật ký kiểm toán; nó phải chống-sửa (11.4).']),
  ],
  goiY: [['A logged secret is read by everyone with log access.', 'Một bí mật bị log được đọc bởi mọi ai có quyền log.'], ['The attacker will try to erase their tracks.', 'Kẻ tấn công sẽ cố xoá dấu vết.']],
  loi: [['Logging the whole event "for completeness".', 'Log cả sự kiện "cho đầy đủ".'], ['Keeping the audit log only on the compromised box.', 'Giữ nhật ký kiểm toán chỉ trên máy bị xâm nhập.']],
  tns: [tn('audit log', 'nhật ký kiểm toán'), tn('allow-list', 'allow-list')],
  kn: ['authentication'],
});

const SENSITIVE = new Set(['password', 'newpassword', 'token', 'accesstoken', 'refreshtoken', 'cookie', 'authorization', 'secret', 'otp', 'totp', 'recoverycode', 'sessionid', 'apikey']);
function isSensitive(name) {
  // A field value must never be logged if its NAME is sensitive — regardless of case, underscores or dashes.
  const key = String(name).toLowerCase().replace(/[_-]/g, '');
  return SENSITIVE.has(key);
}
const S2 = jsBai({
  ten: '11.4-2 — Write isSensitive(name): must this field be dropped?', kho: 'MEDIUM', phut: 10,
  en: `<p>Return <code>true</code> if a field named <code>name</code> must be dropped from an audit entry because it holds a secret. Normalise the name — lowercase, strip <code>_</code> and <code>-</code> — then check it against the sensitive set (<code>password</code>, <code>newPassword</code>, <code>token</code>, <code>accessToken</code>, <code>refreshToken</code>, <code>cookie</code>, <code>authorization</code>, <code>secret</code>, <code>otp</code>, <code>totp</code>, <code>recoveryCode</code>, <code>sessionId</code>, <code>apiKey</code>). So <code>"recovery_code"</code>, <code>"RECOVERY-CODE"</code> and <code>"recoveryCode"</code> all match.</p>`,
  vi: `<p>Trả <code>true</code> nếu một trường tên <code>name</code> phải bị bỏ khỏi một mục audit vì nó giữ một bí mật. Chuẩn hoá tên — chữ thường, bỏ <code>_</code> và <code>-</code> — rồi so với tập nhạy cảm (<code>password</code>, <code>newPassword</code>, <code>token</code>, <code>accessToken</code>, <code>refreshToken</code>, <code>cookie</code>, <code>authorization</code>, <code>secret</code>, <code>otp</code>, <code>totp</code>, <code>recoveryCode</code>, <code>sessionId</code>, <code>apiKey</code>). Nên <code>"recovery_code"</code>, <code>"RECOVERY-CODE"</code> và <code>"recoveryCode"</code> đều khớp.</p>`,
  goiY: [['Lowercase and remove underscores and dashes before comparing.', 'Chữ thường và bỏ gạch dưới, gạch ngang trước khi so.'], ['A Set makes the membership check simple.', 'Một Set làm phép kiểm thành viên đơn giản.']],
  loi: [['Comparing case-sensitively, so TOKEN slips through.', 'So phân biệt hoa thường, nên TOKEN lọt.'], ['Not stripping underscores, so recovery_code slips through.', 'Không bỏ gạch dưới, nên recovery_code lọt.']],
  gt: ['Stripping by a normalised name catches every spelling of a secret field — the core of safe audit logging (11.4).', 'Strip theo tên đã chuẩn hoá bắt mọi cách viết của một trường bí mật — lõi của log kiểm toán an toàn (11.4).'],
  kn: ['authentication'], tns: [tn('normalise', 'chuẩn hoá')],
  dau: `const SENSITIVE = new Set(['password', 'newpassword', 'token', 'accesstoken', 'refreshtoken', 'cookie', 'authorization', 'secret', 'otp', 'totp', 'recoverycode', 'sessionid', 'apikey']);
/** ⇒ true if a field with this name must be dropped from an audit entry */
function isSensitive(name) {
  // Write your solution here
  return false;
}
`,
  giai: `const SENSITIVE = new Set(['password', 'newpassword', 'token', 'accesstoken', 'refreshtoken', 'cookie', 'authorization', 'secret', 'otp', 'totp', 'recoverycode', 'sessionid', 'apikey']);
` + '// Reference solution\n' + nguon(isSensitive),
  cases: [
    { goi: goi('isSensitive', 'token'), moTa: ['token ⇒ true', 'token ⇒ true'] },
    { goi: goi('isSensitive', 'RECOVERY-CODE'), an: true, moTa: ['any case/dash ⇒ true', 'mọi hoa thường/gạch ⇒ true'] },
    { goi: goi('isSensitive', 'new_password'), an: true, moTa: ['underscore ⇒ true', 'gạch dưới ⇒ true'] },
    { goi: goi('isSensitive', 'ip'), an: true, moTa: ['ip is safe ⇒ false', 'ip an toàn ⇒ false'] },
    { goi: goi('isSensitive', 'actor'), an: true, moTa: ['actor is safe ⇒ false', 'actor an toàn ⇒ false'] },
  ],
});

const S3 = cs({
  ten: '11.4-3 — Field → audit', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each field to whether an audit entry keeps or drops it.',
  vi: 'Ghép mỗi trường với việc một mục audit giữ hay bỏ nó.',
  bang: [bang1('b1', ['Field → audit', 'Trường → audit'], [{ ma: 'x', ten: 'Field' }, { ma: 'q', ten: 'Audit', luaChon: ['keep', 'drop'] }], [
    { o: { x: 'actor (user id)' }, a: { q: 'keep' } },
    { o: { x: 'ip' }, a: { q: 'keep' } },
    { o: { x: 'token' }, a: { q: 'drop' } },
    { o: { x: 'newPassword' }, a: { q: 'drop' } },
  ], ['Keep actor and ip (reconstruct the incident); drop token and newPassword (secrets) (11.4).', 'Giữ actor và ip (tái dựng sự cố); bỏ token và newPassword (bí mật) (11.4).'])],
  goiY: [['Keep what reconstructs the incident.', 'Giữ cái tái dựng sự cố.'], ['Drop anything that is a secret.', 'Bỏ bất cứ gì là một bí mật.']],
  loi: [['Keeping the token "to debug later".', 'Giữ token "để debug sau".'], ['Dropping the ip and losing the investigative trail.', 'Bỏ ip và mất vết điều tra.']],
  tns: [tn('PII', 'PII')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-11-4-nhat-ky-kiem-toan', ten: '11.4 Audit log', khoa: KHOA, baiHoc: 'auth-11-4-nhat-ky-kiem-toan', de: [S1, S2, S3] });
