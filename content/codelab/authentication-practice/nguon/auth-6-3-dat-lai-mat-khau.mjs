/** Authentication · 6.3 — Đặt lại mật khẩu: đọc output thật (REVOKED/USED); viết resetScope/forgotResponse; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s06/_ma.mjs';

const RS = OUT['63-reset'].split('\n').slice(1);

const S1 = cs({
  ten: '6.3-1 — Password reset: read the real run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.6 (real run):${pre(RS)}`,
  vi: `LabFlow ID v0.6 (chạy thật):${pre(RS)}`,
  cau: [
    q('c1', ['After the reset, An’s old refresh cookie returns REVOKED. Why?', 'Sau khi reset, cookie refresh cũ của An trả REVOKED. Vì sao?'],
      ['Reset calls revokeAll, ending every session and refresh family', 'The cookie simply expired on its own', 'Only the device that reset the password is revoked', 'The access token was revoked, not the refresh token'],
      ['A reset that only changes the hash leaves an attacker’s session alive; revokeAll ends every family so recovery locks them out (6.3).', 'Một lần reset chỉ đổi hash để phiên của kẻ tấn công còn sống; revokeAll kết thúc mọi họ để khôi phục khoá hắn ra ngoài (6.3).']),
    q('c2', ['The reset link used a second time returns USED. What does that prevent?', 'Đường dẫn reset dùng lần hai trả USED. Nó chặn gì?'],
      ['A replay of an intercepted link after the user already used it', 'A brute-force of the token', 'The user resetting twice by accident', 'A scanner from prefetching it'],
      ['The reset token is single-use, so an intercepted link cannot be replayed once the real user has spent it (6.3).', 'Token reset dùng một lần, nên một đường dẫn bị chặn bắt không phát lại được một khi người dùng thật đã tiêu nó (6.3).']),
    q('c3', ['/forgot-password answers the same for a real and a missing account. Why?', '/forgot-password trả lời như nhau cho tài khoản thật và thiếu. Vì sao?'],
      ['So the response does not reveal whether the address is registered', 'Because the server cannot tell them apart', 'To make the email arrive faster', 'Because it is friendlier wording'],
      ['A reply that differs by account existence is an enumeration oracle; one fixed response closes it (6.3, 6.4).', 'Một câu trả lời khác nhau theo sự tồn tại của tài khoản là một nhà tiên tri dò tài khoản; một phản hồi cố định đóng nó (6.3, 6.4).']),
  ],
  goiY: [['Recovery must lock out whoever was already in.', 'Khôi phục phải khoá ra ngoài kẻ đã ở trong.'], ['One link, one use.', 'Một đường dẫn, một lần dùng.']],
  loi: [['Thinking reset only changes the hash.', 'Tưởng reset chỉ đổi hash.'], ['Thinking the reset link is reusable.', 'Tưởng đường dẫn reset dùng lại được.']],
  tns: [tn('session invalidation', 'vô hiệu phiên'), tn('recovery takeover', 'chiếm qua khôi phục')],
  kn: ['account lifecycle'],
});

function endsAllSessions(action) {
  // A credential change must end every session; ordinary actions must not.
  return action === 'password-reset' || action === 'password-change';
}
const S2 = jsBai({
  ten: '6.3-3 — Write endsAllSessions(action): which actions revoke everything', kho: 'MEDIUM', phut: 10,
  en: `<p>Return <code>true</code> if an action must end every session and refresh family, else <code>false</code>. A <b>credential change</b> — <code>'password-reset'</code> or <code>'password-change'</code> — must revoke everything (a leaked password cannot leave old sessions alive). Ordinary actions like <code>'profile-edit'</code> or <code>'login'</code> must not.</p>`,
  vi: `<p>Trả <code>true</code> nếu một hành động phải kết thúc mọi phiên và họ refresh, còn không thì <code>false</code>. Một <b>lần đổi thông tin xác thực</b> — <code>'password-reset'</code> hay <code>'password-change'</code> — phải thu hồi tất cả (một mật khẩu bị lộ không được để các phiên cũ sống). Hành động thường như <code>'profile-edit'</code> hay <code>'login'</code> thì không.</p>`,
  goiY: [['Reset and change are credential changes.', 'Reset và đổi là đổi thông tin xác thực.'], ['Editing a profile is not a credential change.', 'Sửa hồ sơ không phải đổi thông tin xác thực.']],
  loi: [['Revoking on an ordinary profile edit.', 'Thu hồi trên một lần sửa hồ sơ thường.'], ['Not revoking on a password reset.', 'Không thu hồi trên một lần reset mật khẩu.']],
  gt: ['Ending every session on a credential change is the whole point of reset; without it an attacker who was signed in stays in (6.3).', 'Kết thúc mọi phiên khi đổi thông tin xác thực là điểm mấu chốt của reset; không có nó một kẻ tấn công đang đăng nhập vẫn ở trong (6.3).'],
  kn: ['account lifecycle'], tns: [tn('credential change', 'đổi thông tin xác thực')],
  dau: `/** ⇒ true if the action must end every session + refresh family */
function endsAllSessions(action) {
  // Write your solution here
  return false;
}
`,
  giai: '// Reference solution\n' + nguon(endsAllSessions),
  cases: [
    { goi: goi('endsAllSessions', 'password-reset'), moTa: ['Password reset', 'Đặt lại mật khẩu'] },
    { goi: goi('endsAllSessions', 'password-change'), an: true, moTa: ['Password change', 'Đổi mật khẩu'] },
    { goi: goi('endsAllSessions', 'profile-edit'), an: true, moTa: ['Ordinary edit ⇒ no revoke', 'Sửa thường ⇒ không thu hồi'] },
    { goi: goi('endsAllSessions', 'login'), an: true, moTa: ['A login ⇒ no revoke', 'Một lần đăng nhập ⇒ không thu hồi'] },
  ],
});

const S3 = cs({
  ten: '6.3-4 — Order the reset flow', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order a safe password reset from the user asking to the attacker being locked out.',
  vi: 'Xếp một lần đặt lại mật khẩu an toàn từ lúc người dùng xin tới lúc kẻ tấn công bị khoá ra.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    '/forgot-password: same response, email a one-time link to a real account',
    'User clicks the link; /reset-password consumes the single-use token',
    'Re-check the new password, then update the hash',
    'End every session and revoke every refresh family',
    'The old refresh cookie now returns REVOKED',
  ], ['Request (one response) → consume the link once → re-hash → revoke everything → the old session is dead (6.3).', 'Yêu cầu (một phản hồi) → tiêu link một lần → băm lại → thu hồi tất cả → phiên cũ chết (6.3).'])],
  goiY: [['Consuming the token comes before changing the hash.', 'Tiêu token tới trước đổi hash.'], ['Revocation is the last real step.', 'Thu hồi là bước thật cuối cùng.']],
  loi: [['Changing the hash before consuming the token.', 'Đổi hash trước khi tiêu token.'], ['Forgetting the revoke step.', 'Quên bước thu hồi.']],
  tns: [tn('single-use', 'dùng một lần')],
  kn: ['account lifecycle'],
});

const S4 = cs({
  ten: '6.3-5 — Skip a step → the attack', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each skipped reset step with the attack it allows.',
  vi: 'Ghép mỗi bước reset bị bỏ với cú tấn công nó cho phép.',
  bang: [bang1('b1', ['Skipped → attack', 'Bỏ → tấn công'], [{ ma: 'x', ten: 'Skipped step' }, { ma: 'q', ten: 'Attack', luaChon: ['an intercepted link replays', 'a link in an archive resets months later', 'the attacker’s session survives recovery', 'the form enumerates users'] }], [
    { o: { x: 'single-use token' }, a: { q: 'an intercepted link replays' } },
    { o: { x: 'short (15 min) expiry' }, a: { q: 'a link in an archive resets months later' } },
    { o: { x: 'revoke sessions + families' }, a: { q: 'the attacker’s session survives recovery' } },
    { o: { x: 'one fixed /forgot response' }, a: { q: 'the form enumerates users' } },
  ], ['Each omitted control opens a concrete hole: replay, stale link, surviving session, or enumeration (6.3, 6.4).', 'Mỗi lớp bỏ sót mở một lỗ cụ thể: phát lại, link cũ, phiên sống sót, hay dò tài khoản (6.3, 6.4).'])],
  goiY: [['The revoke step is the one everyone forgets.', 'Bước thu hồi là cái ai cũng quên.'], ['A short expiry kills a stale link; single-use kills a replay.', 'Một hạn ngắn giết một link cũ; dùng một lần giết một lần phát lại.']],
  loi: [['Thinking a changed hash is enough.', 'Tưởng đổi hash là đủ.'], ['Confusing the replay fix with the enumeration fix.', 'Lẫn cách vá phát lại với cách vá dò tài khoản.']],
  kn: ['account lifecycle'],
});

export default doiDau({ slug: 'auth-6-3-dat-lai-mat-khau', ten: '6.3 Password reset', khoa: KHOA, baiHoc: 'auth-6-3-dat-lai-mat-khau', de: [S1, S2, S3, S4] });
