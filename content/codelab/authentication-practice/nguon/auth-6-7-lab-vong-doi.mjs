/** Authentication · Lab 6 — Lớp vòng đời: viết consumeToken (ràng mục đích, dùng một lần, hết hạn) + shouldSendReset. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s06/_ma.mjs';

const TK = OUT['lab-tham-khao'].split('\n').slice(1);

function consumeToken(rec, purpose, now) {
  if (!rec || rec.purpose !== purpose) return { error: 'INVALID' };
  if (rec.usedAt) return { error: 'USED' };
  if (now >= rec.expiresAt) return { error: 'EXPIRED' };
  return { userId: rec.userId };
}
const S1 = jsBai({
  ten: 'Lab 6-1 — Write consumeToken(rec, purpose, now)', kho: 'MEDIUM', phut: 14,
  en: `<p>The heart of the lifecycle layer. Given a fetched token row <code>rec</code> (or <code>null</code>), the requested <code>purpose</code>, and <code>now</code>, return <code>{ userId }</code> or <code>{ error }</code> in this order: missing row OR wrong purpose ⇒ <code>{ error: 'INVALID' }</code>; already used ⇒ <code>{ error: 'USED' }</code>; expired ⇒ <code>{ error: 'EXPIRED' }</code>; otherwise <code>{ userId: rec.userId }</code>. It must be single-use, purpose-bound and time-limited — and never crash on a missing row.</p>`,
  vi: `<p>Trái tim của lớp vòng đời. Cho một dòng token đã tra <code>rec</code> (hoặc <code>null</code>), <code>purpose</code> yêu cầu, và <code>now</code>, trả <code>{ userId }</code> hoặc <code>{ error }</code> theo thứ tự này: thiếu dòng HOẶC sai mục đích ⇒ <code>{ error: 'INVALID' }</code>; đã dùng ⇒ <code>{ error: 'USED' }</code>; hết hạn ⇒ <code>{ error: 'EXPIRED' }</code>; còn lại <code>{ userId: rec.userId }</code>. Nó phải dùng một lần, ràng mục đích và có hạn — và không bao giờ sập trên một dòng thiếu.</p>`,
  goiY: [['Purpose check lives in the INVALID branch, before used/expired.', 'Kiểm mục đích nằm trong nhánh INVALID, trước đã-dùng/hết-hạn.'], ['A reset token used to verify ⇒ INVALID.', 'Một token reset dùng để xác minh ⇒ INVALID.']],
  loi: [['Checking expiry before used.', 'Kiểm hết hạn trước đã-dùng.'], ['Letting a reset token verify an email.', 'Cho một token reset xác minh một email.'], ['Crashing on a null row.', 'Sập trên một dòng null.']],
  gt: ['Single-use (usedAt), purpose-bound (INVALID across purposes) and time-limited (expiresAt), in that order, is the whole safety of email verification and password reset (6.2, 6.3).', 'Dùng một lần (usedAt), ràng mục đích (INVALID giữa các mục đích) và có hạn (expiresAt), theo thứ tự đó, là toàn bộ sự an toàn của xác minh email và đặt lại mật khẩu (6.2, 6.3).'],
  kn: ['account lifecycle'], tns: [tn('purpose-bound token', 'token ràng mục đích'), tn('single-use', 'dùng một lần')],
  dau: `/** ⇒ { userId } or { error: 'INVALID' | 'USED' | 'EXPIRED' } */
function consumeToken(rec, purpose, now) {
  // Write your solution here
  return { userId: rec && rec.userId };
}
`,
  giai: '// Reference solution\n' + nguon(consumeToken),
  cases: [
    { goi: goi('consumeToken', { userId: 'u1', purpose: 'reset_password', usedAt: null, expiresAt: 100 }, 'reset_password', 50), moTa: ['Fresh reset token', 'Token reset mới'] },
    { goi: goi('consumeToken', null, 'verify_email', 50), an: true, moTa: ['No such token ⇒ INVALID', 'Không có token ⇒ INVALID'] },
    { goi: goi('consumeToken', { userId: 'u1', purpose: 'reset_password', usedAt: null, expiresAt: 100 }, 'verify_email', 50), an: true, moTa: ['Wrong purpose ⇒ INVALID', 'Sai mục đích ⇒ INVALID'] },
    { goi: goi('consumeToken', { userId: 'u1', purpose: 'verify_email', usedAt: 30, expiresAt: 100 }, 'verify_email', 50), an: true, moTa: ['Already used ⇒ USED', 'Đã dùng ⇒ USED'] },
    { goi: goi('consumeToken', { userId: 'u1', purpose: 'verify_email', usedAt: null, expiresAt: 40 }, 'verify_email', 50), an: true, moTa: ['Expired ⇒ EXPIRED', 'Hết hạn ⇒ EXPIRED'] },
  ],
});

function shouldSendReset(user) {
  // Only a real, active account is emailed; a stranger or a deleted account gets nothing (anti-enumeration).
  return !!(user && user.status === 'active');
}
const S2 = jsBai({
  ten: 'Lab 6-2 — Write shouldSendReset(user): the anti-enumeration gate', kho: 'EASY', phut: 8,
  en: `<p>Return <code>true</code> only when a password-reset email should be sent: the account exists AND its <code>status</code> is <code>'active'</code>. For <code>null</code> (no account) or a deleted/suspended account, return <code>false</code> — and crucially, send <b>nothing</b>, not even a "no account" notice, or the form enumerates your users.</p>`,
  vi: `<p>Trả <code>true</code> chỉ khi một thư đặt lại mật khẩu nên được gửi: tài khoản tồn tại VÀ <code>status</code> của nó là <code>'active'</code>. Với <code>null</code> (không tài khoản) hay một tài khoản đã xoá/đình chỉ, trả <code>false</code> — và quan trọng, gửi <b>không gì cả</b>, kể cả một ghi chú "không có tài khoản", không thì form dò ra người dùng của bạn.</p>`,
  goiY: [['A missing user and a non-active status both ⇒ false.', 'Một user thiếu và một status không-active đều ⇒ false.'], ['The no-account branch sends nothing at all.', 'Nhánh không-tài-khoản không gửi gì cả.']],
  loi: [['Returning true for a deleted account.', 'Trả true cho một tài khoản đã xoá.'], ['Emailing a stranger "no account found".', 'Gửi cho người lạ "không tìm thấy tài khoản".']],
  gt: ['A "no account" email to a stranger is exactly how an attacker enumerates who is registered; silence for every non-active case is the defence (6.4).', 'Một thư "không có tài khoản" cho người lạ đúng là cách kẻ tấn công dò ai đã đăng ký; im lặng cho mọi trường hợp không-active là lớp phòng (6.4).'],
  kn: ['account enumeration'], tns: [tn('fixed response', 'phản hồi cố định')],
  dau: `/** ⇒ true only for a real, active account */
function shouldSendReset(user) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(shouldSendReset),
  cases: [
    { goi: goi('shouldSendReset', { id: 'u1', status: 'active' }), moTa: ['A real, active account', 'Một tài khoản thật, active'] },
    { goi: goi('shouldSendReset', null), an: true, moTa: ['No account ⇒ no mail', 'Không tài khoản ⇒ không thư'] },
    { goi: goi('shouldSendReset', { id: 'u9', status: 'deleted' }), an: true, moTa: ['Deleted ⇒ no mail', 'Đã xoá ⇒ không thư'] },
  ],
});

const S3 = cs({
  ten: 'Lab 6-3 — Read the reference grade', kho: 'EASY', phut: 5,
  en: `The reference layer, graded and tested:${pre(TK.slice(-4))}`,
  vi: `Lớp tham khảo, chấm và test:${pre(TK.slice(-4))}`,
  cau: [
    q('c1', ['The first attempt emails "no account found" to a stranger and never checks usedAt. Which checks does it fail?', 'Lần thử đầu gửi "không tìm thấy tài khoản" cho người lạ và không bao giờ kiểm usedAt. Nó trượt phép nào?'],
      ['Single-use, purpose, and both enumeration checks', 'Only the token-expiry check, nothing else at all', 'Only the issue-and-consume round-trip check', 'None of them — the first attempt passes everything'],
      ['No usedAt ⇒ T2 replay; no purpose ⇒ T3; a "no account" email ⇒ T5/T6 enumeration. It passes only issue + round trip and expiry (6.2–6.4).', 'Không usedAt ⇒ T2 phát lại; không mục đích ⇒ T3; một thư "không có tài khoản" ⇒ T5/T6 dò tài khoản. Nó chỉ qua phát + vòng khứ hồi và hết hạn (6.2–6.4).']),
  ],
  goiY: [['Each failed check is a concrete attack.', 'Mỗi phép trượt là một cú tấn công cụ thể.'], ['usedAt ⇒ single-use; purpose ⇒ no cross-use; silence ⇒ no enumeration.', 'usedAt ⇒ dùng một lần; mục đích ⇒ không dùng chéo; im lặng ⇒ không dò tài khoản.']],
  loi: [['Thinking "it runs" means "it is safe".', 'Tưởng "chạy được" nghĩa là "an toàn".'], ['Reading a green happy-path as a pass.', 'Đọc một đường-thuận xanh là đạt.']],
  tns: [tn('machine-graded lab', 'lab chấm bằng máy')],
  kn: ['account lifecycle'],
});

export default doiDau({ slug: 'auth-6-7-lab-vong-doi', ten: 'Lab 6 Account lifecycle', khoa: KHOA, baiHoc: 'auth-6-7-lab-vong-doi', de: [S1, S2, S3] });
