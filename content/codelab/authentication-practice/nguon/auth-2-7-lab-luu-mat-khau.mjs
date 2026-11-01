/** Authentication · Lab 2 — Module mật khẩu của LabFlow ID, bản JavaScript thuần chạy trong trình duyệt:
 *  verifyPassword (chọn đường theo tiền tố, { ok, rehash }, NFC, không ném lỗi), signIn (một lần kiểm ở mọi đường, một câu trả lời,
 *  nâng cấp khi thành công), checkNewPassword (NIST 800-63B-4). Cùng hành vi với máy chấm scripts/cham-lab-2.mjs (T3–T8).
 *  Trình duyệt không có argon2/bcrypt ⇒ HÀM ĐỨNG THAY (stand-in) dựng từ SHA-256 thuần JS — đúng định dạng chuỗi, không chậm. */
import { doiDau, KHOA, tn, jsBai, nguon, goi, pre, TRO_GIUP } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s02/_ma.mjs';

const CHAM = OUT['lab-yeu'].split('\n').filter((l) => /^[✓✗] T|TOTAL/.test(l));
const STAND_IN = TRO_GIUP + `// ── provided stand-ins (same string formats as the real libraries, but FAST — never use them for real passwords) ──
function h32(s) { return hex(sha256(utf8(s))); }
function argon2Hash(pw, m, t) { var salt = h32('salt' + pw + m + t).slice(0, 22); return '$argon2id$v=19$m=' + m + ',p=1,t=' + t + '$' + salt + '$' + h32(salt + pw); }
function argon2Verify(stored, pw) { var p = String(stored).split('$'); return p.length === 6 && p[1] === 'argon2id' && h32(p[4] + pw) === p[5]; }
function bcryptHash(pw, cost) { var salt = h32('b' + pw).slice(0, 22); return '$2b$' + cost + '$' + salt + h32(salt + pw).slice(0, 31); }
function bcryptCompare(pw, stored) { var salt = String(stored).slice(7, 29); return '$2b$' + stored.slice(4, 6) + '$' + salt + h32(salt + pw).slice(0, 31) === stored; }
function md5Hex(pw) { return h32('md5:' + pw).slice(0, 32); } // stands in for md5(pw) of the old system
`;
const WANT = { m: 65536, t: 2, p: 1 };

/* ── L1. verifyPassword ── */
function verifyPassword(stored, password, want) {
  if (typeof stored !== 'string' || typeof password !== 'string') return { ok: false, rehash: false };
  var pw = password.normalize('NFC');
  var ok = false, current = false;
  var m = /^\$(argon2id|md5-argon2id)\$v=19\$([^$]+)\$/.exec(stored);
  if (m) {
    var p = {};
    m[2].split(',').forEach(function (kv) { var i = kv.indexOf('='); p[kv.slice(0, i)] = Number(kv.slice(i + 1)); });
    if (m[1] === 'argon2id') {
      ok = argon2Verify(stored, pw);
      current = p.m >= want.m && p.t >= want.t && p.p >= want.p;
    } else {
      ok = argon2Verify(stored.replace('$md5-argon2id$', '$argon2id$'), md5Hex(password)); // the old system hashed raw input
    }
  } else if (/^\$2[aby]\$\d\d\$/.test(stored)) {
    ok = bcryptCompare(pw, stored);
  }
  return { ok: ok, rehash: ok && !current };
}
const rows = {
  cur: `argon2Hash('an-lab-2026'.normalize('NFC'), 65536, 2)`,
  old: `argon2Hash('lan-lab-2026', 19456, 2)`,
  bc: `bcryptHash('lan-lab-2026', 10)`,
  wr: `argon2Hash(md5Hex('lan-lab-2026'), 65536, 2).replace('$argon2id$', '$md5-argon2id$')`,
  vi: `argon2Hash('Bình-thích-hoa-sen-2026'.normalize('NFC'), 65536, 2)`,
};
const v = (row, pw) => `verifyPassword(${row}, ${pw === undefined ? 'undefined' : JSON.stringify(pw)}, ${JSON.stringify(WANT)})`;
const L1 = jsBai({
  ten: 'Lab 2.1 — verifyPassword(stored, password, want): every shape, one answer', kho: 'HARD', phut: 30, dangBai: 'lab',
  en: `<p>LabFlow ID's table holds four shapes. Return <code>{ ok, rehash }</code>:</p><ul>
<li><code>$argon2id$v=19$m=…,p=…,t=…$salt$hash</code> — check with <code>argon2Verify(stored, pw)</code>; <code>rehash</code> when any parameter (read <b>by name</b>) is below <code>want</code>;</li>
<li><code>$2b$10$…</code> (also <code>$2a$</code>, <code>$2y$</code>) — <code>bcryptCompare(pw, stored)</code>; always <code>rehash</code> when ok;</li>
<li><code>$md5-argon2id$…</code> — the old MD5 wrapped in argon2id (lesson 2.5): check <code>md5Hex(password)</code> against the string with its prefix put back to <code>$argon2id$</code>; always <code>rehash</code> when ok;</li>
<li>anything else, or a non-string argument ⇒ <code>{ ok: false, rehash: false }</code>. Never throw.</li></ul>
<p>Normalise the password to <b>NFC</b> before argon2/bcrypt (lesson 2.3), and <code>rehash</code> is only ever true when <code>ok</code>. The stand-in functions are provided (same formats, fast). The project's grader (T3, T4) failed the first attempt here:${pre(CHAM.filter((l) => /T3|T4/.test(l)))}</p>`,
  vi: `<p>Bảng của LabFlow ID chứa bốn dạng. Trả <code>{ ok, rehash }</code>:</p><ul>
<li><code>$argon2id$v=19$m=…,p=…,t=…$salt$hash</code> — kiểm bằng <code>argon2Verify(stored, pw)</code>; <code>rehash</code> khi có tham số (đọc <b>theo tên</b>) thấp hơn <code>want</code>;</li>
<li><code>$2b$10$…</code> (cả <code>$2a$</code>, <code>$2y$</code>) — <code>bcryptCompare(pw, stored)</code>; khớp thì luôn <code>rehash</code>;</li>
<li><code>$md5-argon2id$…</code> — MD5 cũ bọc trong argon2id (bài 2.5): kiểm <code>md5Hex(password)</code> với chuỗi đã đổi tiền tố về <code>$argon2id$</code>; khớp thì luôn <code>rehash</code>;</li>
<li>còn lại, hoặc đối số không phải chuỗi ⇒ <code>{ ok: false, rehash: false }</code>. Không bao giờ ném lỗi.</li></ul>
<p>Chuẩn hoá mật khẩu về <b>NFC</b> trước argon2/bcrypt (bài 2.3), và <code>rehash</code> chỉ có thể true khi <code>ok</code>. Các hàm đứng thay đã có sẵn (cùng định dạng, chạy nhanh). Máy chấm của dự án (T3, T4) đánh trượt lần thử đầu ở đây:${pre(CHAM.filter((l) => /T3|T4/.test(l)))}</p>`,
  goiY: [['typeof guard first; then a regex on the prefix.', 'Chặn typeof trước; rồi một regex theo tiền tố.'], ['rehash = ok && !current — only argon2id at or above want is current.', 'rehash = ok && !current — chỉ argon2id bằng hoặc cao hơn want mới là hiện hành.']],
  loi: [['rehash: true for a WRONG password: the grader’s T5 catches the row being rewritten.', 'rehash: true với mật khẩu SAI: phép T5 của máy chấm bắt được dòng bị ghi đè.'], ['Normalising the input of the md5 branch: the old system hashed the raw bytes.', 'Chuẩn hoá đầu vào nhánh md5: hệ cũ băm byte gốc.']],
  gt: ['The prefix is the dispatcher: one function understands every row in the table, so sign-in never needs to know which system created an account. rehash is the only signal the rest of the code needs to upgrade a row — and it can only be true after a correct password.', 'Tiền tố là bộ chọn đường: một hàm hiểu mọi dòng trong bảng, nên luồng đăng nhập chẳng cần biết hệ nào đã tạo tài khoản. rehash là tín hiệu duy nhất phần còn lại của mã cần để nâng cấp một dòng — và nó chỉ có thể true sau một mật khẩu đúng.'],
  kn: ['hash migration'],
  tns: [tn('prefix dispatch', 'chọn đường theo tiền tố')],
  dau: STAND_IN + `
/** want = { m, t, p } ⇒ { ok, rehash } — never throws */
function verifyPassword(stored, password, want) {
  // Write your solution here
  return { ok: argon2Verify(stored, password), rehash: false };
}
`,
  giai: STAND_IN + '\n// Reference solution\n' + nguon(verifyPassword),
  cases: [
    { goi: v(rows.cur, 'an-lab-2026'), moTa: ['Today’s argon2id, right password', 'argon2id hiện hành, đúng mật khẩu'] },
    { goi: v(rows.cur, 'an-lab-2027'), moTa: ['Wrong password', 'Sai mật khẩu'] },
    { goi: v(rows.old, 'lan-lab-2026'), an: true },
    { goi: v(rows.bc, 'lan-lab-2026'), an: true },
    { goi: v(rows.bc, 'wrong-password-1'), an: true },
    { goi: v(rows.wr, 'lan-lab-2026'), an: true },
    { goi: v(rows.wr, 'wrong-password-1'), an: true },
    { goi: v(rows.vi, 'Bình-thích-hoa-sen-2026'.normalize('NFD')), an: true, moTa: ['Typed as “Unicode tổ hợp”', 'Gõ kiểu "Unicode tổ hợp"'] },
    { goi: v(rows.cur, undefined), an: true },
    { goi: v('"not-a-hash"', 'x'), an: true },
  ],
});

/* ── L2. signIn ── */
function signIn(store, email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') return { error: 'INVALID_CREDENTIALS' };
  var user = store.findByEmail(email.trim().toLowerCase());
  var r = store.verify(user ? user.passwordHash : store.DUMMY, password);   // one verify on every path
  if (!user || !r.ok) return { error: 'INVALID_CREDENTIALS' };
  if (r.rehash) store.updateHash(user.id, store.hash(password));
  return { user: { id: user.id } };
}
// The store records every verify and every update, so a test can see the work done on each path.
const STORE = `function makeStore(rows) {
  var log = { verifies: 0, updates: [] };
  return { log: log, DUMMY: 'dummy-hash',
    findByEmail: function (e) { return rows.filter(function (r) { return r.email === e; })[0] || null; },
    verify: function (stored, pw) { log.verifies++; return stored === 'dummy-hash' ? { ok: false, rehash: false } : { ok: stored === 'H(' + pw + ')' || stored === 'OLD(' + pw + ')', rehash: stored === 'OLD(' + pw + ')' }; },
    hash: function (pw) { return 'H(' + pw + ')'; },
    updateHash: function (id, h) { log.updates.push([id, h]); } };
}
`;
const si = (email, pw) => `(function () { var s = makeStore([{ id: 'usr_1', email: 'an@student.labflow.example', passwordHash: 'H(an-lab-2026)' }, { id: 'usr_3', email: 'lan@labflow.example', passwordHash: 'OLD(lan-lab-2026)' }]); var r = signIn(s, ${email === undefined ? 'undefined' : JSON.stringify(email)}, ${JSON.stringify(pw)}); return { result: r, verifies: s.log.verifies, updates: s.log.updates }; })()`;
const L2 = jsBai({
  ten: 'Lab 2.2 — signIn(store, email, password): one verify, one answer', kho: 'MEDIUM', phut: 20, dangBai: 'lab',
  en: `<p>The store gives you <code>findByEmail(email)</code> (exact match), <code>verify(stored, password)</code> → <code>{ ok, rehash }</code>, <code>hash(password)</code>, <code>updateHash(id, hash)</code> and <code>DUMMY</code> (a hash made at startup). Write <code>signIn</code> → <code>{ user: { id } }</code> or <code>{ error: 'INVALID_CREDENTIALS' }</code>:</p><ul>
<li>trim and lower-case the email before looking it up;</li>
<li>call <code>verify</code> <b>exactly once</b> on every path — against <code>DUMMY</code> when there is no user (lesson 2.3);</li>
<li>one answer for “no such email” and “wrong password”;</li>
<li>on success with <code>rehash</code>, <code>updateHash(id, hash(password))</code> — never on failure;</li>
<li>a non-string email or password ⇒ the error, without throwing.</li></ul><p>The first attempt in Lab 2 failed T5–T7:${pre(CHAM.filter((l) => /T5|T6|T7/.test(l)))}</p>`,
  vi: `<p>Kho cho bạn <code>findByEmail(email)</code> (khớp chính xác), <code>verify(stored, password)</code> → <code>{ ok, rehash }</code>, <code>hash(password)</code>, <code>updateHash(id, hash)</code> và <code>DUMMY</code> (giá trị băm làm lúc khởi động). Viết <code>signIn</code> → <code>{ user: { id } }</code> hoặc <code>{ error: 'INVALID_CREDENTIALS' }</code>:</p><ul>
<li>cắt khoảng trắng và viết thường email trước khi tra;</li>
<li>gọi <code>verify</code> <b>đúng một lần</b> ở mọi đường — với <code>DUMMY</code> khi không có người dùng (bài 2.3);</li>
<li>một câu trả lời cho "email không tồn tại" và "sai mật khẩu";</li>
<li>thành công mà có <code>rehash</code> thì <code>updateHash(id, hash(password))</code> — không bao giờ khi thất bại;</li>
<li>email hay mật khẩu không phải chuỗi ⇒ trả lỗi, không ném lỗi.</li></ul><p>Lần thử đầu của Lab 2 trượt T5–T7:${pre(CHAM.filter((l) => /T5|T6|T7/.test(l)))}</p>`,
  goiY: [['user ? user.passwordHash : store.DUMMY', 'user ? user.passwordHash : store.DUMMY'], ['Decide everything after the single verify.', 'Mọi quyết định đặt sau lần kiểm duy nhất.']],
  loi: [['if (!user) return … before verify: 0 verifies on that path — the timing leak of lesson 2.3.', 'if (!user) return … trước verify: đường đó 0 lần kiểm — chính chỗ rò thời gian của bài 2.3.'], ['Updating the hash before checking ok.', 'Cập nhật giá trị băm trước khi kiểm ok.']],
  gt: ['Counting verifies is the in-browser version of the stopwatch: if every path does exactly one, every path costs the same with the real argon2id. The answer is identical, and the account-specific work (the upgrade) happens only after a correct password.', 'Đếm số lần kiểm là phiên bản trong trình duyệt của đồng hồ bấm giờ: nếu mọi đường đều làm đúng một lần, mọi đường tốn như nhau với argon2id thật. Câu trả lời giống hệt nhau, và việc riêng của tài khoản (nâng cấp) chỉ xảy ra sau mật khẩu đúng.'],
  kn: ['user enumeration'],
  tns: [tn('dummy hash', 'băm giả')],
  dau: STORE + `
/** ⇒ { user: { id } } | { error: 'INVALID_CREDENTIALS' } */
function signIn(store, email, password) {
  // Write your solution here
  var user = store.findByEmail(email);
  if (!user) return { error: 'NO_SUCH_ACCOUNT' };
  var r = store.verify(user.passwordHash, password);
  if (!r.ok) return { error: 'WRONG_PASSWORD' };
  return { user: { id: user.id } };
}
`,
  giai: STORE + '\n// Reference solution\n' + nguon(signIn),
  cases: [
    { goi: si('an@student.labflow.example', 'an-lab-2026'), moTa: ['An, right password', 'An, đúng mật khẩu'] },
    { goi: si('nobody@student.labflow.example', 'wrong-password-1'), moTa: ['No such email: still one verify', 'Email không tồn tại: vẫn một lần kiểm'] },
    { goi: si('an@student.labflow.example', 'wrong-password-1'), an: true },
    { goi: si(' An@Student.LabFlow.example ', 'an-lab-2026'), an: true },
    { goi: si('lan@labflow.example', 'lan-lab-2026'), an: true, moTa: ['Old hash ⇒ upgraded', 'Giá trị cũ ⇒ được nâng cấp'] },
    { goi: si('lan@labflow.example', 'wrong-password-1'), an: true, moTa: ['Old hash, wrong password ⇒ no update', 'Giá trị cũ, sai mật khẩu ⇒ không cập nhật'] },
    { goi: si(undefined, 'x'), an: true },
  ],
});

/* ── L3. checkNewPassword ── */
function checkNewPassword(password, ctx) {
  if (typeof password !== 'string') return ['NOT_A_STRING'];
  var email = (ctx && ctx.email) || '';
  var blocklist = (ctx && ctx.blocklist) || [];
  var pw = password.normalize('NFC');
  var n = Array.from(pw).length;
  var problems = [];
  if (n < 15) problems.push('TOO_SHORT');
  if (n > 128) problems.push('TOO_LONG');
  var lower = pw.toLowerCase();
  if (blocklist.some(function (w) { return String(w).toLowerCase() === lower; })) problems.push('COMMON');
  var letters = function (s) { return s.toLowerCase().replace(/[^\p{L}]/gu, ''); };
  var context = ['labflow', 'labflowid', letters(email.split('@')[0])].filter(function (w) { return w.length >= 3; });
  if (context.indexOf(letters(pw)) >= 0) problems.push('CONTEXT_WORD');
  return problems;
}
const BL = ['password', '123456', 'iloveyou', 'qwerty', 'passwordpassword'];
const c3 = (pw, email = 'an@student.labflow.example') => `checkNewPassword(${JSON.stringify(pw)}, { email: ${JSON.stringify(email)}, blocklist: ${JSON.stringify(BL)} })`;
const L3 = jsBai({
  ten: 'Lab 2.3 — checkNewPassword(password, { email, blocklist }): NIST, not habit', kho: 'MEDIUM', phut: 20, dangBai: 'lab',
  en: `<p>Return the problems of a NEW password, in this order, or <code>[]</code>:</p><ul>
<li><code>TOO_SHORT</code> — fewer than 15 code points after NFC; <code>TOO_LONG</code> — more than 128;</li>
<li><code>COMMON</code> — the <b>whole</b> password equals a blocklist entry, ignoring case (not substrings);</li>
<li><code>CONTEXT_WORD</code> — its letters only (lower-case, Unicode letters) equal <code>labflow</code>, <code>labflowid</code> or the letters of the email's local part (if 3+ letters).</li></ul><p>No composition rules. A non-string ⇒ <code>['NOT_A_STRING']</code>. The first attempt used the classic rules and failed T8:${pre(CHAM.filter((l) => /T8/.test(l)))}</p>`,
  vi: `<p>Trả các vấn đề của một mật khẩu MỚI, theo thứ tự này, hoặc <code>[]</code>:</p><ul>
<li><code>TOO_SHORT</code> — ít hơn 15 code point sau NFC; <code>TOO_LONG</code> — nhiều hơn 128;</li>
<li><code>COMMON</code> — <b>nguyên</b> mật khẩu trùng một mục trong danh sách chặn, không phân biệt hoa thường (không so chuỗi con);</li>
<li><code>CONTEXT_WORD</code> — chỉ phần chữ cái (viết thường, chữ Unicode) trùng <code>labflow</code>, <code>labflowid</code> hoặc phần chữ cái trước @ của email (nếu có 3+ chữ).</li></ul><p>Không luật pha trộn. Không phải chuỗi ⇒ <code>['NOT_A_STRING']</code>. Lần thử đầu dùng luật cổ điển và trượt T8:${pre(CHAM.filter((l) => /T8/.test(l)))}</p>`,
  goiY: [['Array.from(pw.normalize("NFC")).length counts code points.', 'Array.from(pw.normalize("NFC")).length đếm code point.'], ['Letters only: s.toLowerCase().replace(/[^\\p{L}]/gu, "").', 'Chỉ chữ cái: s.toLowerCase().replace(/[^\\p{L}]/gu, "").']],
  loi: [['Substring blocklist: “tram nam trong coi nguoi ta” would be refused for containing “ta”.', 'Danh sách chặn theo chuỗi con: "tram nam trong coi nguoi ta" bị từ chối vì chứa "ta".'], ['Adding “needs a symbol”: NIST SHALL NOT.', 'Thêm "cần ký hiệu": NIST SHALL NOT.']],
  gt: ['Length removes almost the whole list, the blocklist removes the rest, context words remove the obvious personal guesses — and nothing forces people into “Password1!”. Every rejection carries its reason, as NIST requires.', 'Độ dài loại gần hết danh sách, danh sách chặn loại phần còn lại, từ ngữ ngữ cảnh loại những đoán cá nhân hiển nhiên — và không gì ép người dùng vào "Password1!". Mỗi lần từ chối đều kèm lý do, đúng như NIST yêu cầu.'],
  kn: ['password policy'],
  tns: [tn('context word', 'từ ngữ ngữ cảnh')],
  dau: `/** ⇒ [] or ['TOO_SHORT' | 'TOO_LONG' | 'COMMON' | 'CONTEXT_WORD', …] */
function checkNewPassword(password, ctx) {
  // Write your solution here
  var problems = [];
  if (password.length < 8) problems.push('TOO_SHORT');
  if (!/[A-Z]/.test(password)) problems.push('NEEDS_UPPER');
  if (!/[^A-Za-z0-9]/.test(password)) problems.push('NEEDS_SYMBOL');
  return problems;
}
`,
  giai: '// Reference solution\n' + nguon(checkNewPassword),
  cases: [
    { goi: c3('123456'), moTa: ['Bình’s password', 'Mật khẩu của Bình'] },
    { goi: c3('hoa sen nở giữa đầm lầy tháng năm') },
    { goi: c3('LabFlow2026!!!!!'), an: true },
    { goi: c3('PasswordPassword'), an: true },
    { goi: c3('an-an-an-an-an-an', 'an@student.labflow.example'), an: true, moTa: ['Letters "anananananan" are not "an"', 'Chữ cái "anananananan" không phải "an"'] },
    { goi: c3('binh-2026-binh!!', 'binh@student.labflow.example'), an: true },
    { goi: c3('Binh2026!!!!!!!!', 'binh@student.labflow.example'), an: true },
    { goi: c3('tram nam trong coi nguoi ta'), an: true },
    { goi: c3('x'.repeat(129)), an: true },
    { goi: c3('ờ'.repeat(15).normalize('NFD')), an: true },
    { goi: 'checkNewPassword(42, {})', an: true },
  ],
});

export default doiDau({ slug: 'auth-2-7-lab-luu-mat-khau', ten: 'Lab 2 — LabFlow ID’s password module', khoa: KHOA, baiHoc: 'auth-2-7-lab-luu-mat-khau', de: [L1, L2, L3] });
