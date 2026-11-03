/** Authentication · 6.1 — Đăng ký: đọc output thật (202 + verify mail), viết signupResponse đồng nhất; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s06/_ma.mjs';

const RE = OUT['61-register'].split('\n').slice(1);

const S1 = cs({
  ten: '6.1-1 — Registration: read the real run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.6 (real run):${pre(RE)}`,
  vi: `LabFlow ID v0.6 (chạy thật):${pre(RE)}`,
  cau: [
    q('c1', ['Right after sign-up, what is the account’s verification state?', 'Ngay sau đăng ký, trạng thái xác minh của tài khoản là gì?'],
      ['Unverified — email_verified_at is null until the link is clicked', 'Verified — signing up proves the address', 'Verified for login but not for reset', 'Pending for 30 days, then auto-verified'],
      ['A typed email is a claim; the account starts unverified and the inbox proves it (6.1, 6.2).', 'Một email gõ vào là một lời khai; tài khoản bắt đầu chưa xác minh và hộp thư chứng minh nó (6.1, 6.2).']),
    q('c2', ['Sign up again with an email that already exists. What response?', 'Đăng ký lại với một email đã tồn tại. Phản hồi gì?'],
      ['The same 202, and a "you already have an account" email — no "taken" error', '409 "email already taken"', 'A 200 that logs the user in', 'A 500, because the unique index is violated'],
      ['A 409 "taken" is an enumeration oracle; LabFlow ID returns the same 202 and emails the real owner (6.1).', 'Một 409 "đã dùng" là một nhà tiên tri dò tài khoản; LabFlow ID trả cùng một 202 và gửi thư cho chủ thật (6.1).']),
    q('c3', ['Why hash the password even when the email is already taken?', 'Vì sao băm mật khẩu kể cả khi email đã được dùng?'],
      ['So the response time is the same whether or not the email exists', 'Because the duplicate account needs its hash updated', 'To rate-limit the sign-up endpoint', 'Because argon2 is required by the database'],
      ['Hashing only on the new-email branch answers a taken email in ~1 ms and a free one in ~80 ms — a timing oracle. Hash in both branches (6.1, 6.4).', 'Băm chỉ ở nhánh email-mới trả lời một email đã-dùng trong ~1 ms và một cái trống trong ~80 ms — một nhà tiên tri thời gian. Băm ở cả hai nhánh (6.1, 6.4).']),
  ],
  goiY: [['The inbox, not the response, carries the difference.', 'Hộp thư, không phải phản hồi, mang sự khác biệt.'], ['Same work ⇒ same timing.', 'Cùng công việc ⇒ cùng thời gian.']],
  loi: [['Thinking a duplicate email returns 409.', 'Tưởng một email trùng trả 409.'], ['Thinking a new account is verified.', 'Tưởng một tài khoản mới đã xác minh.']],
  tns: [tn('account enumeration', 'dò tài khoản'), tn('unverified account', 'tài khoản chưa xác minh')],
  kn: ['account lifecycle'],
});

function signupResponse(emailTaken) {
  // Enumeration-safe: the SAME response either way.
  return { status: 202, message: 'Check your email to finish signing up.' };
}
const S2 = jsBai({
  ten: '6.1-2 — Write signupResponse(emailTaken): one response either way', kho: 'EASY', phut: 8,
  en: `<p>Return the HTTP response a sign-up sends. It must be <b>identical</b> whether or not the email is taken, so the form cannot be used to enumerate accounts: always <code>{ status: 202, message: 'Check your email to finish signing up.' }</code>.</p>`,
  vi: `<p>Trả về phản hồi HTTP mà một lần đăng ký gửi. Nó phải <b>y hệt</b> dù email có bị dùng hay không, để form không dùng để dò tài khoản được: luôn <code>{ status: 202, message: 'Check your email to finish signing up.' }</code>.</p>`,
  goiY: [['Ignore the argument — the point is that it does not change the response.', 'Lờ tham số — điểm mấu chốt là nó không đổi phản hồi.'], ['The status is 202 (Accepted): "check your email".', 'Mã là 202 (Accepted): "kiểm email của bạn".']],
  loi: [['Returning 409 when the email is taken.', 'Trả 409 khi email bị dùng.'], ['Changing the message for a duplicate.', 'Đổi thông điệp cho một trùng lặp.']],
  gt: ['A response that differs by account existence is an oracle; one fixed 202 closes the wording channel (6.1, 6.4).', 'Một phản hồi khác nhau theo sự tồn tại của tài khoản là một nhà tiên tri; một 202 cố định đóng kênh câu chữ (6.1, 6.4).'],
  kn: ['account enumeration'], tns: [tn('fixed response', 'phản hồi cố định')],
  dau: `/** ⇒ { status, message } — the SAME for taken and free emails */
function signupResponse(emailTaken) {
  // Write your solution here
  return { status: 200, message: '' };
}
`,
  giai: '// Reference solution\n' + nguon(signupResponse),
  cases: [
    { goi: goi('signupResponse', false), moTa: ['A free email', 'Một email trống'] },
    { goi: goi('signupResponse', true), an: true, moTa: ['A taken email — same response', 'Một email đã dùng — cùng phản hồi'] },
    { goi: goi('signupResponse', undefined), an: true, moTa: ['Unknown either way — still 202', 'Không rõ — vẫn 202'] },
  ],
});

const S3 = cs({
  ten: '6.1-3 — Order the sign-up steps', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the steps of an enumeration-safe sign-up, from first to last.',
  vi: 'Xếp các bước của một lần đăng ký chống dò tài khoản, từ đầu tới cuối.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    'Check the password policy (length, breach list)',
    'Hash the password with argon2 — before the branch',
    'Look the email up',
    'Taken ⇒ email "you already have an account"; new ⇒ create + email a verify link',
    'Return the same 202 either way',
  ], ['Hash before branching so timing matches; then look up, send the branch-specific email, and return one fixed 202 (6.1).', 'Băm trước khi rẽ nhánh để thời gian khớp; rồi tra, gửi email theo nhánh, và trả một 202 cố định (6.1).'])],
  goiY: [['The hash comes before the lookup.', 'Băm tới trước phép tra.'], ['The response is the last step and is always the same.', 'Phản hồi là bước cuối và luôn như nhau.']],
  loi: [['Hashing only after finding a new email.', 'Chỉ băm sau khi thấy một email mới.'], ['Returning different responses per branch.', 'Trả phản hồi khác nhau theo nhánh.']],
  tns: [tn('constant work', 'công việc hằng định')],
  kn: ['account lifecycle'],
});

const S4 = cs({
  ten: '6.1-4 — Naive sign-up → what it leaks', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each naive sign-up choice with what it leaks to an attacker.',
  vi: 'Ghép mỗi lựa chọn đăng ký ngây thơ với cái nó làm rò cho kẻ tấn công.',
  bang: [bang1('b1', ['Choice → leak', 'Lựa chọn → rò'], [{ ma: 'x', ten: 'Naive choice' }, { ma: 'q', ten: 'Leaks', luaChon: ['which emails have an account', 'timing: taken vs free', 'an unproven address is trusted'] }], [
    { o: { x: '409 "email already taken"' }, a: { q: 'which emails have an account' } },
    { o: { x: 'hash only when the email is new' }, a: { q: 'timing: taken vs free' } },
    { o: { x: 'account usable immediately' }, a: { q: 'an unproven address is trusted' } },
  ], ['A "taken" message and a timing difference both reveal who is registered; an immediately-usable account trusts an unproven address (6.1).', 'Một thông điệp "đã dùng" và một chênh lệch thời gian đều lộ ai đã đăng ký; một tài khoản dùng được ngay tin một địa chỉ chưa chứng minh (6.1).'])],
  goiY: [['Two of these leak existence; one trusts too early.', 'Hai cái rò sự tồn tại; một cái tin quá sớm.'], ['A timing gap is a leak even with the same words.', 'Một khoảng cách thời gian là một cú rò kể cả với cùng câu chữ.']],
  loi: [['Thinking a 409 is harmless.', 'Tưởng một 409 là vô hại.'], ['Thinking a uniform message also hides timing.', 'Tưởng một thông điệp đồng nhất cũng giấu thời gian.']],
  kn: ['account enumeration'],
});

function normalizeEmail(raw) {
  const t = String(raw ?? '').trim();
  const at = t.lastIndexOf('@');          // last @ — the local part may contain others
  if (at <= 0 || at === t.length - 1 || /\s/.test(t)) return null;
  const domain = t.slice(at + 1).toLowerCase();
  return (t.slice(0, at) + '@' + domain).normalize('NFKC').toLowerCase();
}
const S5 = jsBai({
  ten: '6.1-5 — Write normalizeEmail(raw): one stored form for the UNIQUE index', kho: 'MEDIUM', phut: 12,
  en: `<p>Return the normalised form an email is stored and looked up by: trim; take the <b>last</b> <code>@</code> (the local part may contain others); lowercase the domain; then NFKC-normalise and lowercase the whole string. Return <code>null</code> for a syntactically impossible address (no <code>@</code>, nothing before/after it, or any whitespace). NFKC folds harmless duplicates (full-width <code>ＣＵＯＮＧ@…</code> → <code>cuong@…</code>) but will NOT fold a Cyrillic <code>а</code> into a Latin <code>a</code> — that is a confusable, a separate problem.</p>`,
  vi: `<p>Trả về dạng chuẩn hoá mà một email được lưu và tra theo: cắt khoảng trắng; lấy dấu <code>@</code> <b>cuối</b> (phần local có thể chứa dấu khác); hạ chữ tên miền; rồi NFKC-chuẩn-hoá và hạ chữ cả chuỗi. Trả <code>null</code> cho một địa chỉ bất khả về cú pháp (không <code>@</code>, không gì trước/sau nó, hay có khoảng trắng). NFKC gộp bản trùng vô hại (toàn-rộng <code>ＣＵＯＮＧ@…</code> → <code>cuong@…</code>) nhưng sẽ KHÔNG gộp một chữ <code>а</code> Kirin thành <code>a</code> Latin — đó là ký tự nhìn giống, một vấn đề riêng.</p>`,
  goiY: [['Use lastIndexOf for the @, not indexOf.', 'Dùng lastIndexOf cho @, không phải indexOf.'], ['normalize("NFKC") before lowercasing the whole string.', 'normalize("NFKC") trước khi hạ chữ cả chuỗi.']],
  loi: [['Using the first @ instead of the last.', 'Dùng @ đầu thay vì @ cuối.'], ['Forgetting to return null on a missing @.', 'Quên trả null khi thiếu @.']],
  gt: ['One normalised column + a UNIQUE index is the whole uniqueness policy; NFKC folds duplicates but not confusables, which need a mixed-script flag (6.1).', 'Một cột chuẩn hoá + một chỉ mục UNIQUE là toàn bộ chính sách duy nhất; NFKC gộp bản trùng nhưng không gộp ký tự nhìn giống, vốn cần một cờ trộn hệ chữ (6.1).'],
  kn: ['account lifecycle'], tns: [tn('email normalisation', 'chuẩn hoá email'), tn('confusable / homograph', 'ký tự nhìn giống')],
  dau: `/** ⇒ normalised email string, or null if impossible */
function normalizeEmail(raw) {
  // Write your solution here
  return String(raw);
}
`,
  giai: '// Reference solution\n' + nguon(normalizeEmail),
  cases: [
    { goi: goi('normalizeEmail', 'Nguyen.Van.A@Gmail.COM'), moTa: ['Mixed case', 'Hoa thường lẫn'] },
    { goi: goi('normalizeEmail', '  cuong@cuongthai.com  '), an: true, moTa: ['Leading/trailing spaces', 'Khoảng trắng đầu/cuối'] },
    { goi: goi('normalizeEmail', 'ＣＵＯＮＧ@cuongthai.com'), an: true, moTa: ['Full-width ⇒ NFKC folds', 'Toàn-rộng ⇒ NFKC gộp'] },
    { goi: goi('normalizeEmail', 'no-at-sign'), an: true, moTa: ['No @ ⇒ null', 'Không @ ⇒ null'] },
  ],
});

export default doiDau({ slug: 'auth-6-1-dang-ky', ten: '6.1 Registration', khoa: KHOA, baiHoc: 'auth-6-1-dang-ky', de: [S1, S2, S3, S4, S5] });
