/** Authentication · Lab 11 — the audit log and the runbook; write severityFor() + triage(). */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: 'Lab 11-1 — Keep enough, leak nothing, page rarely', kho: 'MEDIUM', phut: 8,
  en: 'Lab 11: the audit entry keeps enough and leaks nothing; the runbook pages rarely and never ignores the unknown.',
  vi: 'Lab 11: mục audit giữ đủ và không rò gì; runbook page hiếm và không bao giờ bỏ qua cái lạ.',
  cau: [
    q('c1', ['The "yeu" attempt logs the whole event and pages on every signal. Why does it score only 2/10?', 'Bản "yếu" log cả sự kiện và page mọi tín hiệu. Vì sao nó chỉ đạt 2/10?'],
      ['It leaks a token and password into the log forever and causes alert fatigue — it only keeps the safe fields right (T1)', 'It is far too slow to evaluate the whole event object on each and every request the service handles', 'It accidentally challenges far too many perfectly legitimate monitoring signals that should pass through', 'It prevents the audit log from being written to disk at all, so no record of any event survives'],
      ['Logging everything leaks secrets; paging on everything deafens the on-call. It passes only T1 (Lab 11, 11.4/11.5).', 'Log mọi thứ rò bí mật; page mọi thứ làm điếc người trực. Nó chỉ qua T1 (Lab 11, 11.4/11.5).']),
    q('c2', ['Why must a security event like refresh_reuse_detected get a high severity?', 'Vì sao một sự kiện bảo mật như refresh_reuse_detected phải nhận một severity cao?'],
      ['The severity drives the response — alert tells monitoring and the runbook this is a takeover signal worth paging on', 'A higher severity makes the log entry sort to the top of the file', 'It makes the entry take more storage so it is kept longer', 'The severity changes which fields are kept in the entry'],
      ['Severity is what monitoring and the runbook act on; a reuse event is an alert (Lab 11, 11.4).', 'Severity là cái giám sát và runbook hành động theo; một sự kiện tái-dùng là một alert (Lab 11, 11.4).']),
    q('c3', ['What should triage() return for a signal name nobody has classified?', 'triage() nên trả gì cho một tên tín hiệu chưa ai phân loại?'],
      ['investigate — give it a human look, never silently ignore the signal you did not plan for', 'ignore, because there is no runbook entry for it yet', 'page, to be maximally cautious about every unknown', 'auto, and record it without any review'],
      ['Default the unknown to investigate; fail toward attention (Lab 11, 11.5).', 'Mặc định cái lạ là investigate; hỏng về phía chú ý (Lab 11, 11.5).']),
  ],
  goiY: [['Severity drives the response, not the sort order.', 'Severity dẫn phản ứng, không phải thứ tự sắp.'], ['The unknown signal leans toward investigate.', 'Tín hiệu lạ nghiêng về investigate.']],
  loi: [['Thinking "log everything" is thorough and safe.', 'Tưởng "log mọi thứ" là kỹ và an toàn.'], ['Ignoring an unclassified signal.', 'Bỏ qua một tín hiệu chưa phân loại.']],
  tns: [tn('severity', 'severity'), tn('fail toward attention', 'hỏng về phía chú ý')],
  kn: ['authentication'],
});

const SEVERITY = { refresh_reuse_detected: 'alert', mfa_disabled: 'alert', password_reset: 'warn', email_changed: 'warn', admin_action: 'warn', login_failed: 'info', login_ok: 'info', logout: 'info' };
function severityFor(action) {
  // The severity an audit entry carries for a given action. Anything unlisted is 'info' (never dropped, just quiet).
  return SEVERITY[action] || 'info';
}
const S2 = jsBai({
  ten: 'Lab 11-2 — Write severityFor(action): the audit severity', kho: 'MEDIUM', phut: 10,
  en: `<p>Return the severity an audit entry carries for an <code>action</code>: <code>refresh_reuse_detected</code> / <code>mfa_disabled</code> ⇒ <code>'alert'</code>; <code>password_reset</code> / <code>email_changed</code> / <code>admin_action</code> ⇒ <code>'warn'</code>; anything else (including <code>login_ok</code>, <code>logout</code>, or an unknown action) ⇒ <code>'info'</code>. The severity is what the runbook acts on.</p>`,
  vi: `<p>Trả severity một mục audit mang cho một <code>action</code>: <code>refresh_reuse_detected</code> / <code>mfa_disabled</code> ⇒ <code>'alert'</code>; <code>password_reset</code> / <code>email_changed</code> / <code>admin_action</code> ⇒ <code>'warn'</code>; còn lại (gồm <code>login_ok</code>, <code>logout</code>, hay một action lạ) ⇒ <code>'info'</code>. Severity là cái runbook hành động theo.</p>`,
  goiY: [['A lookup table maps the alert/warn actions; default to info.', 'Một bảng tra ánh xạ các action alert/warn; mặc định info.'], ['An unknown action is info, never dropped.', 'Một action lạ là info, không bao giờ bỏ.']],
  loi: [['Returning undefined for an unknown action instead of info.', 'Trả undefined cho một action lạ thay vì info.'], ['Marking a routine login as alert.', 'Đánh dấu một đăng nhập thường lệ là alert.']],
  gt: ['refresh_reuse and mfa_disabled are takeover signals (alert); routine logins are info — the severity drives the runbook (Lab 11, 11.4).', 'refresh_reuse và mfa_disabled là tín hiệu chiếm tài khoản (alert); đăng nhập thường lệ là info — severity dẫn runbook (Lab 11, 11.4).'],
  kn: ['authentication'], tns: [tn('alert/warn/info', 'alert/warn/info')],
  dau: `const SEVERITY = { refresh_reuse_detected: 'alert', mfa_disabled: 'alert', password_reset: 'warn', email_changed: 'warn', admin_action: 'warn', login_failed: 'info', login_ok: 'info', logout: 'info' };
/** ⇒ 'alert' | 'warn' | 'info' */
function severityFor(action) {
  // Write your solution here
  return 'info';
}
`,
  giai: `const SEVERITY = { refresh_reuse_detected: 'alert', mfa_disabled: 'alert', password_reset: 'warn', email_changed: 'warn', admin_action: 'warn', login_failed: 'info', login_ok: 'info', logout: 'info' };
` + '// Reference solution\n' + nguon(severityFor),
  cases: [
    { goi: goi('severityFor', 'refresh_reuse_detected'), moTa: ['takeover signal ⇒ alert', 'tín hiệu chiếm ⇒ alert'] },
    { goi: goi('severityFor', 'password_reset'), an: true, moTa: ['sensitive change ⇒ warn', 'thay đổi nhạy cảm ⇒ warn'] },
    { goi: goi('severityFor', 'login_ok'), an: true, moTa: ['routine ⇒ info', 'thường lệ ⇒ info'] },
    { goi: goi('severityFor', 'some_new_action'), an: true, moTa: ['unknown ⇒ info', 'lạ ⇒ info'] },
  ],
});

const S3 = cs({
  ten: 'Lab 11-3 — Grade each attempt', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order these three Lab 11 attempts from the lowest grade to the highest.',
  vi: 'Xếp ba lần thử Lab 11 này từ điểm thấp nhất tới cao nhất.',
  cau: [ord('o1', ['Lowest → highest', 'Thấp → cao'], [
    'The empty starter (returns the event unchanged, triage always ignore) — 2/10',
    'The "yeu" attempt (logs the whole event, pages on everything) — 2/10',
    'The reference (allow-list audit + severity, runbook that pages rarely) — 10/10',
  ], ['Starter and yeu both score 2 (different failures); the reference keeps enough, leaks nothing, pages rarely (Lab 11).', 'Khởi đầu và yếu đều 2 (lỗi khác nhau); bản tham khảo giữ đủ, không rò gì, page hiếm (Lab 11).'])],
  goiY: [['Both weak attempts score the same here.', 'Cả hai lần thử yếu cùng điểm ở đây.'], ['Only the reference leaks nothing and pages rarely.', 'Chỉ bản tham khảo không rò gì và page hiếm.']],
  loi: [['Thinking the yeu attempt passes.', 'Tưởng lần thử yếu đạt.'], ['Thinking the starter leaks secrets like the yeu one.', 'Tưởng bản khởi đầu rò bí mật như bản yếu.']],
  tns: [tn('pass = 7/10', 'đạt = 7/10')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-11-7-lab-audit-runbook', ten: 'Lab 11 — audit & runbook', khoa: KHOA, baiHoc: 'auth-11-7-lab-audit-runbook', de: [S1, S2, S3] });
