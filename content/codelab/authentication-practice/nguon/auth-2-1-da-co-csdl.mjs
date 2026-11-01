/** Authentication · 2.1 — Kẻ tấn công đã có CSDL: đọc lần bẻ thật (4 cách lưu), tự viết crackSalted (đếm số lần băm), timeToTry (bảng thời gian), bảng cách lưu → kết luận. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s02/_ma.mjs';

const CR = OUT['21-crack'].split('\n').slice(1);
const TB = OUT['21-table'].split('\n').slice(1, 7);

/* ── 1. Đọc lần bẻ thật ── */
const S1 = cs({
  ten: '2.1-1 — Four storages, one list: read the real run', kho: 'EASY', phut: 8,
  en: `Lesson 2.1 cracked the same 1,003 accounts stored four ways, with the same list of 10,001 common passwords (Node 22.23.3, 10 threads):${pre(CR)}`,
  vi: `Bài 2.1 bẻ cùng 1.003 tài khoản lưu theo bốn cách, với cùng danh sách 10.001 mật khẩu phổ biến (Node 22.23.3, 10 luồng):${pre(CR)}`,
  cau: [
    q('c1', ['What did the 16-byte salt change?', 'Muối 16 byte đã thay đổi gì?'],
      ['The work: the list was hashed per account (4.96 M hashes) — but the same 701 accounts fell', 'Nothing: the same 10,001 hashes cracked the same accounts', 'It protected every password except Bình’s', 'It made each single guess about 1,000× slower'],
      ['Salt kills shared work and precomputed tables; it does not slow one guess. The cracked count depends on the passwords, not on the salt.', 'Muối diệt việc làm chung và bảng tính sẵn; nó không làm chậm một lần đoán. Số tài khoản bị bẻ phụ thuộc mật khẩu, không phụ thuộc muối.']),
    q('c2', ['“271 rows repeat another row’s hash” — what does that tell an attacker before cracking anything?', '"271 dòng lặp lại giá trị băm của dòng khác" — điều đó cho kẻ tấn công biết gì trước cả khi bẻ?'],
      ['Which users share a password with each other', 'Which users are LAB_MANAGER', 'Which rows were created by the same script', 'Nothing — equal hashes are a coincidence'],
      ['Unsalted: equal password ⇒ equal row. Crack one, you have them all; and popular rows are obviously popular passwords.', 'Không muối: cùng mật khẩu ⇒ cùng dòng. Bẻ một là có cả nhóm; và dòng phổ biến hiển nhiên là mật khẩu phổ biến.']),
    q('c3', ['argon2id needs ≈ 54 h for the whole list against everyone. Why was Bình found in 166 ms?', 'argon2id cần ≈ 54 giờ cho cả danh sách với mọi người. Vì sao Bình bị tìm ra trong 166 ms?'],
      ['123456 is the second word of the list: 2 guesses × ~83 ms', 'argon2id has a fast path for short passwords', 'The attacker had her salt in advance', 'Her row used older, cheaper parameters'],
      ['A slow hash multiplies the cost per guess, not the number of guesses. Passwords near the top of every list need a blocklist (lesson 2.4).', 'Băm chậm nhân chi phí mỗi lần đoán, không nhân số lần đoán. Mật khẩu gần đầu mọi danh sách cần danh sách chặn (bài 2.4).']),
  ],
  goiY: [['Compare the “cracked” numbers before comparing the times.', 'So các con số "cracked" trước khi so thời gian.'], ['Ask what one guess costs in each row.', 'Hỏi một lần đoán tốn bao nhiêu ở mỗi dòng.']],
  loi: [['“Salted ⇒ uncrackable”.', '"Có muối ⇒ không bẻ được".'], ['“Slow hash ⇒ even 123456 is safe”.', '"Băm chậm ⇒ đến 123456 cũng an toàn".']],
  tns: [tn('salt', 'muối'), tn('rainbow table', 'bảng cầu vồng')],
  kn: ['password storage'],
});

/* ── 2. Tự viết: crackSalted ── */
function crackSalted(rows, words, hash) {
  var cracked = {}, hashes = 0;
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    for (var j = 0; j < words.length; j++) {
      hashes++;                                        // every guess is one hash, for THIS row's salt
      if (hash(r.salt + words[j]) === r.hash) { cracked[r.id] = words[j]; break; }
    }
  }
  return { cracked: cracked, hashes: hashes };
}
// A stand-in for SHA-256 (fast, deterministic) so the exercise runs in the browser.
const H = 'function (s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }';
const W = ['password', '123456', '12345678', 'qwerty', 'iloveyou', 'abc123', 'dragon', 'letmein'];
const rowsExpr = (people) => `(function () { var h = ${H}; return [${people.map(([id, salt, pw]) => `{ id: '${id}', salt: '${salt}', hash: h('${salt}${pw}') }`).join(', ')}]; })()`;
const call = (people, words) => `(function () { var h = ${H}; return crackSalted(${rowsExpr(people)}, ${JSON.stringify(words)}, h); })()`;
const S2 = jsBai({
  ten: '2.1-2 — Write crackSalted(rows, words, hash): what salt really costs', kho: 'MEDIUM', phut: 15,
  en: `<p>A stolen table: <code>rows = [{ id, salt, hash }]</code>, where <code>hash = hash(salt + password)</code> (a fast hash — think SHA-256). Write <code>crackSalted(rows, words, hash)</code> that tries the attacker's list <code>words</code> in order against every row and returns <code>{ cracked: { id: password, … }, hashes: n }</code>, where <code>n</code> counts every call of <code>hash</code>. Stop trying a row at its first hit. Real run of lesson 2.1: unsalted, 10,001 hashes for everyone; salted, 4,960,404 hashes — and the same 701 cracked.</p>`,
  vi: `<p>Một bảng bị trộm: <code>rows = [{ id, salt, hash }]</code>, với <code>hash = hash(salt + password)</code> (một hàm băm nhanh — hình dung SHA-256). Viết <code>crackSalted(rows, words, hash)</code> thử danh sách <code>words</code> của kẻ tấn công theo thứ tự với từng dòng và trả <code>{ cracked: { id: password, … }, hashes: n }</code>, trong đó <code>n</code> đếm mọi lần gọi <code>hash</code>. Dừng thử một dòng ở lần trúng đầu. Lần chạy thật của bài 2.1: không muối, 10.001 lần băm cho tất cả; có muối, 4.960.404 lần băm — và vẫn 701 tài khoản đó.</p>`,
  goiY: [['Two loops: rows outside, words inside.', 'Hai vòng lặp: dòng ở ngoài, từ ở trong.'], ['The salt goes BEFORE the guess, exactly as stored.', 'Muối đứng TRƯỚC lần đoán, đúng như lúc lưu.']],
  loi: [['Hashing the list once and reusing it: that only works without salt.', 'Băm danh sách một lần rồi dùng lại: chỉ đúng khi không có muối.'], ['Not stopping at the first hit, so the count is too high.', 'Không dừng ở lần trúng đầu, nên đếm dư.']],
  gt: ['With a salt every row needs its own pass over the list: the work grows with the number of accounts, but each guess is still one fast hash — the same passwords fall. That is why the slow hash (2.2) and the blocklist (2.4) are still needed.', 'Có muối thì mỗi dòng cần một lượt riêng qua danh sách: khối lượng tăng theo số tài khoản, nhưng mỗi lần đoán vẫn chỉ là một lần băm nhanh — những mật khẩu đó vẫn sụp. Vì thế vẫn cần băm chậm (2.2) và danh sách chặn (2.4).'],
  kn: ['salting'],
  tns: [tn('dictionary attack', 'tấn công bằng từ điển')],
  dau: `/** ⇒ { cracked: { id: password }, hashes: number of hash() calls } */
function crackSalted(rows, words, hash) {
  // Write your solution here
  var table = {};
  words.forEach(function (w) { table[hash(w)] = w; });    // works without salt…
  var cracked = {};
  rows.forEach(function (r) { if (table[r.hash]) cracked[r.id] = table[r.hash]; });
  return { cracked: cracked, hashes: words.length };
}
`,
  giai: '// Reference solution\n' + nguon(crackSalted),
  cases: [
    { goi: call([['usr_1', 'a1', 'an-lab-2026'], ['usr_2', 'b2', '123456']], W), moTa: ['An survives, Bình falls at guess 2', 'An trụ, Bình rơi ở lần đoán 2'] },
    { goi: call([['usr_4', 'c3', 'dragon'], ['usr_5', 'd4', 'dragon']], W), moTa: ['Same password, two salts: two separate searches', 'Cùng mật khẩu, hai muối: hai lần tìm riêng'] },
    { goi: call([], W), an: true },
    { goi: call([['usr_6', 'e5', 'letmein']], []), an: true },
    { goi: call([['usr_7', 'f6', 'password'], ['usr_8', 'g7', 'zz-not-in-list'], ['usr_9', 'h8', 'abc123']], W), an: true },
  ],
});

/* ── 3. Tự viết: timeToTry ── */
function timeToTry(guesses, perSecond) {
  var s = guesses / perSecond, YEAR = 365.25 * 24 * 3600;
  if (s < 1e-3) return (s * 1e6).toFixed(1) + ' µs';
  if (s < 1) return (s * 1e3).toFixed(1) + ' ms';
  if (s < 60) return s.toFixed(1) + ' s';
  if (s < 3600) return (s / 60).toFixed(1) + ' minutes';
  if (s < 86400) return (s / 3600).toFixed(1) + ' hours';
  if (s < YEAR) return (s / 86400).toFixed(1) + ' days';
  if (s < 1000 * YEAR) return (s / YEAR).toFixed(0) + ' years';
  return (s / YEAR).toExponential(1) + ' years';
}
const S3 = jsBai({
  ten: '2.1-3 — Write timeToTry(guesses, perSecond): the time-to-crack table', kho: 'EASY', phut: 10,
  en: `<p>Lesson 2.1's table (real run, rates measured on an M1 Max or from hashcat on one RTX 4090):${pre(TB)}Write <code>timeToTry(guesses, perSecond)</code> that formats <code>s = guesses / perSecond</code> the same way: &lt; 1 ms ⇒ <code>"0.5 µs"</code>; &lt; 1 s ⇒ <code>"5.0 ms"</code>; &lt; 60 s ⇒ <code>"9.5 s"</code>; &lt; 1 h ⇒ <code>"3.3 minutes"</code>; &lt; 1 day ⇒ <code>"… hours"</code>; &lt; 1 year (365.25 days) ⇒ <code>"1.2 days"</code>; &lt; 1,000 years ⇒ <code>"131 years"</code> (no decimals); otherwise <code>"4.7e+3 years"</code> (<code>toExponential(1)</code>).</p>`,
  vi: `<p>Bảng của bài 2.1 (chạy thật, tốc độ đo trên M1 Max hoặc từ hashcat trên một RTX 4090):${pre(TB)}Viết <code>timeToTry(guesses, perSecond)</code> định dạng <code>s = guesses / perSecond</code> theo đúng cách đó: &lt; 1 ms ⇒ <code>"0.5 µs"</code>; &lt; 1 s ⇒ <code>"5.0 ms"</code>; &lt; 60 s ⇒ <code>"9.5 s"</code>; &lt; 1 giờ ⇒ <code>"3.3 minutes"</code>; &lt; 1 ngày ⇒ <code>"… hours"</code>; &lt; 1 năm (365,25 ngày) ⇒ <code>"1.2 days"</code>; &lt; 1.000 năm ⇒ <code>"131 years"</code> (không số lẻ); còn lại <code>"4.7e+3 years"</code> (<code>toExponential(1)</code>).</p>`,
  goiY: [['Compute seconds once, then a ladder of if/return.', 'Tính số giây một lần, rồi một bậc thang if/return.'], ['26 ** 8 / 21975.5e6 should print "9.5 s".', '26 ** 8 / 21975.5e6 phải in "9.5 s".']],
  loi: [['Using 365 instead of 365.25 days — the year boundary shifts.', 'Dùng 365 thay vì 365,25 ngày — mốc năm bị lệch.'], ['Printing "131.0 years": the table has no decimals below 1,000 years.', 'In "131.0 years": bảng không có số lẻ dưới 1.000 năm.']],
  gt: ['The same space reads “9.5 s” on a GPU with a fast hash and “131 years” with argon2id on a laptop — the whole argument of the lesson in one function. The first column (top-10k) stays in minutes whatever you choose.', 'Cùng một không gian đọc là "9,5 s" trên GPU với băm nhanh và "131 năm" với argon2id trên laptop — cả lập luận của bài trong một hàm. Cột đầu (top-10k) vẫn chỉ vài phút dù chọn gì.'],
  kn: ['brute force'],
  tns: [tn('search space', 'không gian tìm kiếm')],
  dau: `/** guesses ÷ perSecond, formatted like lesson 2.1's table */
function timeToTry(guesses, perSecond) {
  // Write your solution here
  return (guesses / perSecond).toFixed(1) + ' s';
}
`,
  giai: '// Reference solution\n' + nguon(timeToTry),
  cases: [
    { goi: 'timeToTry(Math.pow(26, 8), 21975.5e6)', moTa: ['8 a-z, sha256 on an RTX 4090', '8 chữ thường, sha256 trên RTX 4090'] },
    { goi: 'timeToTry(10001, 21975.5e6)' },
    { goi: 'timeToTry(10001, 50.7)', an: true },
    { goi: 'timeToTry(Math.pow(26, 8), 50.7)', an: true },
    { goi: 'timeToTry(Math.pow(7776, 4), 21975.5e6)', an: true },
    { goi: 'timeToTry(Math.pow(62, 12), 21975.5e6)', an: true },
    { goi: 'timeToTry(10001, 2.00e6)', an: true },
    { goi: 'timeToTry(36000, 1)', an: true },
  ],
});

/* ── 4. Bảng: cách lưu → kết luận ── */
const KL = ['never', 'never — hashed, not encrypted', 'right for random tokens, never for passwords', 'yes, plus a blocklist'];
const S4 = cs({
  ten: '2.1-4 — Stored as… verdict', kho: 'EASY', phut: 6, loai: 'table',
  en: 'For each way of storing LabFlow ID passwords, pick the verdict from lesson 2.1.',
  vi: 'Với mỗi cách lưu mật khẩu LabFlow ID, chọn kết luận theo bài 2.1.',
  bang: [bang1('b1', ['Storage → verdict', 'Cách lưu → kết luận'], [{ ma: 'x', ten: 'Stored as' }, { ma: 'v', ten: 'Verdict', luaChon: KL }], [
    { o: { x: 'plain text in naive_users.password' }, a: { v: 'never' } },
    { o: { x: 'AES-encrypted with a key in .env (the Adobe way)' }, a: { v: 'never — hashed, not encrypted' } },
    { o: { x: 'sha256(salt + password), 16-byte salt' }, a: { v: 'right for random tokens, never for passwords' } },
    { o: { x: 'md5(password)' }, a: { v: 'never' } },
    { o: { x: '$argon2id$v=19$m=65536,p=1,t=2$…' }, a: { v: 'yes, plus a blocklist' } },
  ], ['Plain and MD5 give passwords away; encryption is reversible and equal passwords look equal; salted SHA-256 is the token recipe, still 2 M guesses/s per core; argon2id with measured parameters, and 2.4’s blocklist for the passwords no hash can save.', 'Chữ thường và MD5 cho không mật khẩu; mã hoá thì đảo ngược được và mật khẩu giống nhau trông giống nhau; SHA-256 có muối là công thức cho token, vẫn 2 triệu lần đoán/giây mỗi nhân; argon2id với tham số tự đo, cộng danh sách chặn của 2.4 cho những mật khẩu không hàm băm nào cứu được.'])],
  goiY: [['Can it be reversed? How much does one guess cost?', 'Có đảo ngược được không? Một lần đoán tốn bao nhiêu?'], ['The token recipe (lesson 1.3) is not the password recipe.', 'Công thức cho token (bài 1.3) không phải công thức cho mật khẩu.']],
  loi: [['Encryption = protection.', 'Mã hoá = bảo vệ.'], ['Salt = slow.', 'Muối = chậm.']],
  kn: ['password storage'],
});

export default doiDau({ slug: 'auth-2-1-da-co-csdl', ten: '2.1 The attacker already has your database', khoa: KHOA, baiHoc: 'auth-2-1-da-co-csdl', de: [S1, S2, S3, S4] });
