/** Authentication · 7.3 — Đăng ký + khôi phục: đọc output; viết consumeRecovery; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s07/_ma.mjs';

const EN = OUT['73-totp-enroll'].split('\n').slice(1);

const S1 = cs({
  ten: '7.3-1 — Enroll a factor, read the run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.7 (real run):${pre(EN)}`,
  vi: `LabFlow ID v0.7 (chạy thật):${pre(EN)}`,
  cau: [
    q('c1', ['The secret is stored before a code is verified, but the factor is only enabled after confirm. Why confirm first?', 'Bí mật được lưu trước khi một mã được xác minh, nhưng yếu tố chỉ bật sau confirm. Vì sao confirm trước?'],
      ['To prove the app scanned the right secret and the clocks agree — else the user is locked out next login', 'To deliberately slow enrollment down and discourage casual sign-ups', 'Because the generated secret is cryptographically invalid until it is confirmed', 'To let the server, rather than the app, choose the first valid code'],
      ['Confirm-before-trust catches a mis-scan or a wrong clock while the user can still fix it; skip it and they are locked out with no working factor (7.3).', 'Xác nhận-trước-khi-tin bắt một lần quét nhầm hay đồng hồ sai khi người dùng còn sửa được; bỏ nó và họ bị khoá không còn yếu tố chạy được (7.3).']),
    q('c2', ['Confirm returns ten recovery codes, once. How are they stored, and how many times does each work?', 'Confirm trả mười mã khôi phục, một lần. Chúng lưu thế nào, và mỗi cái chạy mấy lần?'],
      ['As SHA-256 digests, each usable exactly once', 'As plaintext, reusable', 'Encrypted, reusable until expiry', 'Not stored — recomputed each login'],
      ['Recovery codes are credentials: stored as digests, shown once, single-use — the demo shows a reused code returning BAD_CODE (7.3).', 'Mã khôi phục là tín vật: lưu dạng digest, hiện một lần, dùng một lần — demo cho thấy một mã dùng lại trả BAD_CODE (7.3).']),
    q('c3', ['Why is a "reset my 2FA" link sent by email a bad recovery path?', 'Vì sao một link "reset 2FA" gửi qua email là một đường khôi phục tồi?'],
      ['It moves the trust back to the email account — the weak channel the factor was meant to backstop', 'Email delivery is too slow for a user who is locked out and waiting', 'A link in an email cannot safely carry a one-time reset token', 'Opening the link would print the raw TOTP secret into the message body'],
      ['Every recovery path is a front door (Ch 6); an email reset re-weakens everything to the email account. Offline codes the user holds are better (7.3).', 'Mỗi đường khôi phục là một cửa trước (Ch 6); một reset qua email làm yếu lại mọi thứ về tài khoản email. Mã ngoại tuyến người dùng giữ tốt hơn (7.3).']),
  ],
  goiY: [['The confirm step tests the whole loop before trusting it.', 'Bước confirm thử cả vòng trước khi tin.'], ['A recovery path is only as strong as its channel.', 'Một đường khôi phục chỉ mạnh bằng kênh của nó.']],
  loi: [['Enabling the factor before a code verifies.', 'Bật yếu tố trước khi một mã xác minh.'], ['Storing recovery codes in plaintext.', 'Lưu mã khôi phục dạng gốc.']],
  tns: [tn('enrollment', 'đăng ký'), tn('recovery code', 'mã khôi phục')],
  kn: ['authentication'],
});

function consumeRecovery(code, codes) {
  const i = codes.indexOf(code);
  if (i < 0) return { ok: false, remaining: codes };
  return { ok: true, remaining: codes.filter((_, j) => j !== i) };
}
const S2 = jsBai({
  ten: '7.3-2 — Write consumeRecovery(code, codes): single-use', kho: 'EASY', phut: 10,
  en: `<p>A recovery code is single-use. Given a presented <code>code</code> and the list of live <code>codes</code>, return <code>{ ok, remaining }</code>: if the code is present, <code>ok:true</code> and <code>remaining</code> is the list with that code removed; if absent, <code>ok:false</code> and <code>remaining</code> unchanged. (In the real system you compare digests, not plaintext — the logic is the same.)</p>`,
  vi: `<p>Một mã khôi phục dùng một lần. Cho một <code>code</code> nhập và danh sách <code>codes</code> còn sống, trả <code>{ ok, remaining }</code>: nếu mã có mặt, <code>ok:true</code> và <code>remaining</code> là danh sách đã bỏ mã đó; nếu vắng, <code>ok:false</code> và <code>remaining</code> giữ nguyên. (Hệ thật so digest, không so bản gốc — logic như nhau.)</p>`,
  goiY: [['indexOf tells you if it is present and where.', 'indexOf cho biết nó có mặt không và ở đâu.'], ['Remove exactly the one matched index.', 'Bỏ đúng một chỉ số khớp.']],
  loi: [['Removing all copies or none.', 'Bỏ tất cả bản hoặc không bỏ gì.'], ['Returning ok:true for an absent code.', 'Trả ok:true cho một mã vắng.']],
  gt: ['Single-use means a consumed code is dropped, so a copy an attacker saw is already dead; an absent code changes nothing (7.3).', 'Dùng một lần nghĩa là một mã đã tiêu bị bỏ, nên một bản kẻ tấn công thấy đã chết; một mã vắng không đổi gì (7.3).'],
  kn: ['authentication'], tns: [tn('single-use', 'dùng một lần')],
  dau: `/** ⇒ { ok, remaining } */
function consumeRecovery(code, codes) {
  // Write your solution here
  return { ok: false, remaining: codes };
}
`,
  giai: '// Reference solution\n' + nguon(consumeRecovery),
  cases: [
    { goi: goi('consumeRecovery', 'b', ['a', 'b', 'c']), moTa: ['present ⇒ removed', 'có mặt ⇒ bỏ'] },
    { goi: goi('consumeRecovery', 'x', ['a', 'b']), an: true, moTa: ['absent ⇒ unchanged', 'vắng ⇒ giữ nguyên'] },
    { goi: goi('consumeRecovery', 'a', ['a']), an: true, moTa: ['last code', 'mã cuối'] },
  ],
});

const S3 = cs({
  ten: '7.3-3 — Order the enrollment', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order enrolling a TOTP factor, from begin to a recovery-ready account.',
  vi: 'Xếp việc đăng ký một yếu tố TOTP, từ begin tới một tài khoản sẵn-khôi-phục.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    'begin: generate a secret, store it UNCONFIRMED, return the otpauth URI',
    'The app scans the QR and shows a code',
    'confirm: verify one code, then mark the factor enabled',
    'Issue ten recovery codes, shown once, stored as digests',
  ], ['Store unconfirmed → the app computes a code → confirm enables it → only then issue recovery codes (7.3).', 'Lưu chưa xác nhận → app tính một mã → confirm bật nó → chỉ khi đó phát mã khôi phục (7.3).'])],
  goiY: [['The factor is enabled only after a code verifies.', 'Yếu tố chỉ bật sau khi một mã xác minh.'], ['Recovery codes come last.', 'Mã khôi phục tới cuối.']],
  loi: [['Enabling before confirm.', 'Bật trước confirm.'], ['Issuing recovery codes at begin.', 'Phát mã khôi phục lúc begin.']],
  tns: [tn('otpauth:// URI', 'URI otpauth://')],
  kn: ['authentication'],
});

const S4 = cs({
  ten: '7.3-4 — Recovery design → why', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each recovery design choice with its reason.',
  vi: 'Ghép mỗi lựa chọn thiết kế khôi phục với lý do.',
  bang: [bang1('b1', ['Choice → reason', 'Lựa chọn → lý do'], [{ ma: 'x', ten: 'Choice' }, { ma: 'q', ten: 'Reason', luaChon: ['a dump is hashes, not working codes', 'a seen copy is already dead', 'humans copy these onto paper', 'the real fix for device loss'] }], [
    { o: { x: 'store as SHA-256 digests' }, a: { q: 'a dump is hashes, not working codes' } },
    { o: { x: 'single-use' }, a: { q: 'a seen copy is already dead' } },
    { o: { x: 'no l/o/0/1, grouped xxxx-xxxx' }, a: { q: 'humans copy these onto paper' } },
    { o: { x: 'encourage a second authenticator' }, a: { q: 'the real fix for device loss' } },
  ], ['Digests protect a dump; single-use kills replay; an unambiguous alphabet survives handwriting; a second factor beats any recovery code (7.3).', 'Digest bảo vệ một bản dump; dùng một lần giết phát lại; một bảng chữ không nhập nhằng sống qua chữ viết tay; một yếu tố thứ hai thắng mọi mã khôi phục (7.3).'])],
  goiY: [['Two choices are about the stored form, two about human use.', 'Hai lựa chọn về dạng lưu, hai về việc con người dùng.'], ['A digest protects a dump; single-use protects against replay.', 'Một digest bảo vệ một bản dump; dùng một lần chống phát lại.']],
  loi: [['Thinking recovery codes replace a second authenticator.', 'Tưởng mã khôi phục thay một bộ xác thực thứ hai.'], ['Confusing the hashed-storage reason with the single-use reason.', 'Lẫn lý do lưu-băm với lý do dùng-một-lần.']],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-7-3-dang-ky-va-khoi-phuc', ten: '7.3 Enroll & recovery', khoa: KHOA, baiHoc: 'auth-7-3-dang-ky-va-khoi-phuc', de: [S1, S2, S3, S4] });
