/** Authentication · 10.5 — Pre-hijacking & races; write consumeOnce, the atomic one-time-token consume. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '10.5-1 — Two lifecycle attacks', kho: 'MEDIUM', phut: 8,
  en: 'Pre-hijacking and TOCTOU races hide in the account lifecycle, invisible to a normal test.',
  vi: 'Chiếm-trước và đua TOCTOU nấp trong vòng đời tài khoản, vô hình với một phép kiểm bình thường.',
  cau: [
    q('c1', ['How does account pre-hijacking work?', 'Chiếm-trước tài khoản chạy ra sao?'],
      ['The attacker creates an account with the victim\'s email first; a later federated login merges into it, leaving the attacker access', 'The attacker repeatedly guesses the victim\'s future password before the victim has even chosen and set it', 'The attacker reserves the victim\'s preferred username ahead of time so the victim can never sign up at all', 'The attacker floods the sign-up endpoint until the victim\'s own account creation gets rate-limited and blocked'],
      ['A naive server attaches the victim\'s Google login to the attacker\'s pre-existing unverified account (10.5).', 'Một máy chủ ngây thơ gắn đăng nhập Google của nạn nhân vào tài khoản chưa xác minh sẵn có của kẻ tấn công (10.5).']),
    q('c2', ['What is the fix for pre-hijacking?', 'Cách sửa chiếm-trước là gì?'],
      ['Never merge a federated login into an unverified pre-existing account; link on the provider\'s stable sub, verify first', 'Require a significantly longer and more complex password from every user at the moment of sign-up', 'Send two separate verification emails instead of one so the victim is more likely to notice and act', 'Block all federated "Sign in with" logins entirely and force everyone to use a local password instead'],
      ['An unverified email proves nothing; discard the stale record and link on the sub, not the claimable email (10.5, 8.5).', 'Một email chưa xác minh chẳng chứng minh gì; bỏ bản ghi cũ và nối theo sub, không theo email giành được (10.5, 8.5).']),
    q('c3', ['Why does "if (token.used) return; token.used = true;" fail under concurrency?', 'Vì sao "if (token.used) return; token.used = true;" hỏng dưới đồng thời?'],
      ['Two requests both pass the check before either writes — the token is used twice (TOCTOU)', 'The assignment statement is simply too slow to complete within the available request-handling time window', 'JavaScript is fundamentally unable to set a boolean value atomically without an external locking library', 'The token\'s used flag must be stored as a number rather than a boolean for the comparison to work at all'],
      ['Time-of-check to time-of-use: the gap between the check and the write lets both requests through (10.5).', 'Thời-điểm-kiểm tới thời-điểm-dùng: khoảng trống giữa kiểm và ghi để cả hai yêu cầu lọt (10.5).']),
  ],
  goiY: [['An unverified account has proven nothing.', 'Một tài khoản chưa xác minh chưa chứng minh gì.'], ['The race is the gap between check and write.', 'Cuộc đua là khoảng trống giữa kiểm và ghi.']],
  loi: [['Merging a federated login into an unverified account.', 'Gộp một đăng nhập liên kết vào một tài khoản chưa xác minh.'], ['Fixing a race with a check then a separate write.', 'Sửa một cuộc đua bằng một phép kiểm rồi một lần ghi riêng.']],
  tns: [tn('pre-hijacking', 'chiếm trước'), tn('TOCTOU', 'TOCTOU')],
  kn: ['authentication'],
});

function consumeOnce(token, now) {
  // Atomic consume: check AND mark used in one step, returning whether THIS caller won. Model of the SQL
  // UPDATE ... SET used_at = now() WHERE used_at IS NULL RETURNING id — exactly one of two concurrent calls wins.
  if (!token) return false;
  if (token.usedAt != null) return false;   // already consumed
  token.usedAt = now;                       // mark used in the same step we checked
  return true;                              // this caller won
}
const S2 = jsBai({
  ten: '10.5-2 — Write consumeOnce(token, now): the atomic one-time consume', kho: 'MEDIUM', phut: 12,
  en: `<p>Consume a one-time token atomically. <code>token</code> is an object with <code>usedAt</code> (a timestamp, or <code>null</code>/<code>undefined</code> if unused). If the token is missing or already used (<code>usedAt != null</code>) ⇒ <code>false</code>. Otherwise set <code>token.usedAt = now</code> in the SAME step and return <code>true</code> (this caller won). This models <code>UPDATE ... WHERE used_at IS NULL RETURNING</code>, so two concurrent calls cannot both win.</p>`,
  vi: `<p>Tiêu một token một-lần một cách nguyên tử. <code>token</code> là một object với <code>usedAt</code> (một dấu thời gian, hoặc <code>null</code>/<code>undefined</code> nếu chưa dùng). Nếu token thiếu hoặc đã dùng (<code>usedAt != null</code>) ⇒ <code>false</code>. Không thì đặt <code>token.usedAt = now</code> trong CÙNG bước và trả <code>true</code> (người gọi này thắng). Cái này mô hình <code>UPDATE ... WHERE used_at IS NULL RETURNING</code>, nên hai lần gọi đồng thời không thể cùng thắng.</p>`,
  goiY: [['Check usedAt != null to reject an already-used token.', 'Kiểm usedAt != null để từ chối một token đã dùng.'], ['Set usedAt and return true together, in one step.', 'Đặt usedAt và trả true cùng nhau, trong một bước.']],
  loi: [['Returning true when the token was already used.', 'Trả true khi token đã được dùng.'], ['Crashing on a null/undefined token.', 'Sập với một token null/undefined.']],
  gt: ['The check and the write are one step, so a second caller sees usedAt already set and loses — exactly one wins (10.5).', 'Phép kiểm và lần ghi là một bước, nên người gọi thứ hai thấy usedAt đã đặt và thua — đúng một thắng (10.5).'],
  kn: ['authentication'], tns: [tn('atomic transition', 'chuyển nguyên tử')],
  dau: `/** ⇒ true if THIS call consumed the token; false if missing or already used */
function consumeOnce(token, now) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(consumeOnce),
  cases: [
    { goi: goi('consumeOnce', { usedAt: null }, 1000), moTa: ['unused ⇒ true', 'chưa dùng ⇒ true'] },
    { goi: goi('consumeOnce', { usedAt: 999 }, 1000), an: true, moTa: ['already used ⇒ false', 'đã dùng ⇒ false'] },
    { goi: goi('consumeOnce', null, 1000), an: true, moTa: ['missing token ⇒ false', 'token thiếu ⇒ false'] },
    { goi: goi('consumeOnce', {}, 1000), an: true, moTa: ['usedAt undefined ⇒ true', 'usedAt undefined ⇒ true'] },
  ],
});

const S3 = cs({
  ten: '10.5-3 — Order the TOCTOU fix', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the correct safe handling of a one-time reset token under concurrency.',
  vi: 'Xếp cách xử lý an toàn đúng cho một token đặt lại một-lần dưới đồng thời.',
  cau: [ord('o1', ['Correct flow', 'Luồng đúng'], [
    'Run one atomic statement: UPDATE ... SET used_at = now() WHERE id = $1 AND used_at IS NULL RETURNING id',
    'If a row was returned, THIS request won — proceed with the reset',
    'If no row was returned, someone else already consumed it — reject',
  ], ['The atomic UPDATE checks and writes together; the returned row (or not) decides the single winner (10.5).', 'UPDATE nguyên tử kiểm và ghi cùng nhau; dòng trả về (hay không) quyết định người thắng duy nhất (10.5).'])],
  goiY: [['The database does the check and write in one statement.', 'Cơ sở dữ liệu làm kiểm và ghi trong một câu lệnh.'], ['The returned row is the proof you won.', 'Dòng trả về là bằng chứng bạn thắng.']],
  loi: [['Checking first, then writing in a separate step.', 'Kiểm trước, rồi ghi trong một bước riêng.'], ['Proceeding even when no row was returned.', 'Tiếp tục kể cả khi không dòng nào trả về.']],
  tns: [tn('RETURNING', 'RETURNING')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-10-5-chiem-truoc-va-dua', ten: '10.5 Pre-hijacking & races', khoa: KHOA, baiHoc: 'auth-10-5-chiem-truoc-va-dua', de: [S1, S2, S3] });
