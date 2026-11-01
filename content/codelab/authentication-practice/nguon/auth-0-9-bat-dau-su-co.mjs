/** Authentication · Bắt đầu tại đây (2/2) — sự cố thật ⇒ nguyên nhân ⇒ chương; phát lại LinkedIn 2012 (output thật); tự viết crackUnsalted. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { createHash } from 'node:crypto';
import { OUT } from '../../../courses/authentication/s00/_ma.mjs';

/* ── 1. Sự cố ⇒ nguyên nhân gốc ── */
const NGUYEN_NHAN = ['passwords stored in plain text', 'fast unsalted hash', 'password written to logs', 'credentials committed to a code repository', 'session tokens shared in a support file', 'a stolen signing key', 'password reuse + no second factor'];
const S1 = cs({
  ten: 'Incidents 1 — What actually went wrong?', kho: 'EASY', phut: 10, loai: 'table',
  en: 'Each row is a widely reported incident (summarised from public reports). Pick the root cause. None of them needed a genius attacker.',
  vi: 'Mỗi dòng là một sự cố được đưa tin rộng rãi (tóm tắt từ báo cáo công khai). Chọn nguyên nhân gốc. Không vụ nào cần kẻ tấn công thiên tài.',
  bang: [bang1('b1', ['Incident → root cause', 'Sự cố → nguyên nhân gốc'], [{ ma: 'x', ten: 'Incident' }, { ma: 'r', ten: 'Root cause', luaChon: NGUYEN_NHAN }], [
    { o: { x: 'RockYou (2009): about 32 million passwords leaked and were readable immediately' }, a: { r: 'passwords stored in plain text' } },
    { o: { x: 'LinkedIn (2012): millions of hashes leaked and most were cracked within days' }, a: { r: 'fast unsalted hash' } },
    { o: { x: 'Facebook (2019): hundreds of millions of passwords found readable in internal systems' }, a: { r: 'password written to logs' } },
    { o: { x: 'Uber (2016): attackers found cloud access keys inside a private GitHub repository' }, a: { r: 'credentials committed to a code repository' } },
    { o: { x: 'Okta (2023): customers uploaded browser HAR files to support; attackers reused what was inside' }, a: { r: 'session tokens shared in a support file' } },
    { o: { x: 'Microsoft Storm-0558 (2023): attackers forged authentication tokens to read email' }, a: { r: 'a stolen signing key' } },
    { o: { x: 'Snowflake customers (2024): logins with credentials stolen elsewhere, on accounts without MFA' }, a: { r: 'password reuse + no second factor' } },
  ], ['Every one is a “boring” mistake this course fixes: plain text and fast hashes (Ch2), secrets in logs and repositories (1.5, Ch11), bearer tokens copied out of a browser (1.1, Ch3–5), signing keys (1.4, Ch4, Ch11), credential stuffing without MFA (Ch7, Ch10).', 'Vụ nào cũng là một lỗi "nhàm chán" mà khoá này sửa: mật khẩu thô và băm nhanh (Ch2), bí mật trong log và kho mã (1.5, Ch11), token kiểu mang theo bị chép ra khỏi trình duyệt (1.1, Ch3–5), khoá ký (1.4, Ch4, Ch11), nhồi mật khẩu khi không có MFA (Ch7, Ch10).'])],
  goiY: [['A HAR file records every request — headers included.', 'Tệp HAR ghi lại mọi request — kể cả header.'], ['“Forged tokens” means someone could sign as the issuer.', '"Token giả mạo" nghĩa là có người ký được như bên phát hành.']],
  loi: [['Blaming “hackers” instead of the design choice that made it cheap.', 'Đổ cho "hacker" thay vì lựa chọn thiết kế khiến nó rẻ.'], ['Mixing up plain text (RockYou) and fast hashing (LinkedIn): both fall, at different speeds.', 'Nhầm mật khẩu thô (RockYou) với băm nhanh (LinkedIn): cả hai đều đổ, chỉ khác tốc độ.']],
  tns: [tn('credential stuffing', 'nhồi thông tin đăng nhập bị lộ từ nơi khác'), tn('HAR file', 'tệp ghi lại lưu lượng trình duyệt')],
  kn: ['incidents'],
});

/* ── 2. Phát lại LinkedIn — output thật ── */
const S2 = cs({
  ten: 'Incidents 2 — Replay of 2012, on your machine', kho: 'EASY', phut: 8,
  en: `Lesson “Start here (2/2)” replays the LinkedIn mistake with three LabFlow users and the 10k most common passwords:${pre(OUT['09-linkedin'])}then adds a per-user salt:${pre(OUT['09-thuc-hanh'])}`,
  vi: `Bài "Bắt đầu tại đây (2/2)" phát lại lỗi của LinkedIn với ba người dùng LabFlow và 10 nghìn mật khẩu phổ biến nhất:${pre(OUT['09-linkedin'])}rồi thêm muối riêng cho từng người:${pre(OUT['09-thuc-hanh'])}`,
  cau: [
    q('c1', ['Why was the lookup table enough to crack Binh?', 'Vì sao bảng tra là đủ để bẻ Bình?'],
      ['Without a salt, the same password always gives the same hash', 'SHA-1 can be decrypted once you find the right key', 'Binh’s hash was shorter, so it was faster to search', 'The table contains every password that can exist'],
      ['A hash is not encryption: there is no key. Without a salt, equal passwords have equal hashes, so the table is computed once and reused forever.', 'Băm không phải mã hoá: chẳng có khoá nào. Không có muối thì mật khẩu giống nhau có bản băm giống nhau, nên bảng chỉ cần tính một lần và dùng mãi.']),
    q('c2', ['After adding a salt, what is still true?', 'Sau khi thêm muối, điều gì vẫn đúng?'],
      ['A weak password still falls fast when guessed with her salt', 'The password can no longer be guessed in any way at all', 'Adding a salt makes SHA-1 as slow as argon2id', 'The salt now has to be kept secret, like a key'],
      ['The salt kills shared tables, not guessing: 123456 is the 2nd guess. Only a deliberately slow hash (argon2id, Chapter 2) makes each guess expensive. The salt is stored next to the hash; it is not a secret.', 'Muối giết bảng tra dùng chung, không giết việc đoán: 123456 là lượt đoán thứ 2. Chỉ hàm băm cố ý chậm (argon2id, Chương 2) mới làm mỗi lượt đoán đắt. Muối lưu ngay cạnh bản băm; nó không phải bí mật.']),
    q('c3', ['An and Co Lan were “not in the table (this time)”. Why “this time”?', 'An và Cô Lan "not in the table (this time)". Sao lại "lần này"?'],
      ['A bigger list could still find them: the hash is fast', 'Their passwords are long, so they can never be broken', 'SHA-1 refuses to hash passwords with a dash inside', 'They signed in with a passkey, not a password'],
      ['Fast hashes let attackers try billions of guesses; “not in my small list” is not “safe”.', 'Hàm băm nhanh cho kẻ tấn công thử hàng tỉ lần; "không có trong danh sách nhỏ" không có nghĩa là "an toàn".']),
  ],
  goiY: [['A hash has no key.', 'Băm không có khoá.'], ['Salt ≠ slowness.', 'Muối ≠ chậm.']],
  loi: [['Calling a salted fast hash “secure”.', 'Gọi băm nhanh có muối là "an toàn".'], ['Hiding the salt as if it were a key.', 'Giấu muối như thể nó là khoá.']],
  tns: [tn('salt', 'muối — chuỗi ngẫu nhiên riêng cho từng mật khẩu'), tn('lookup table', 'bảng tra băm → mật khẩu')],
  kn: ['password hashing'],
});

/* ── 3. Tự viết: crackUnsalted ── */
function crackUnsalted(leaked, table) {
  var out = {};
  Object.keys(leaked).forEach(function (user) {
    var h = String(leaked[user]).toLowerCase();       // hex digests may be printed in upper case
    out[user] = Object.prototype.hasOwnProperty.call(table, h) ? table[h] : null;
  });
  return out;
}
// sha1(word) ⇒ word, three entries of a precomputed table (digests are public SHA-1 values of common words)
const WORDS = ['123456', 'pass' + 'word', 'qwerty'];
const SHA1 = Object.fromEntries(WORDS.map((w) => [createHash('sha1').update(w).digest('hex'), w]));
const S3 = jsBai({
  ten: 'Incidents 3 — Write crackUnsalted(leaked, table)', kho: 'EASY', phut: 10,
  en: '<p>You are the attacker of 2012, for teaching purposes. <code>leaked</code> maps user ⇒ unsalted SHA-1 hex digest from a dump; <code>table</code> maps digest ⇒ password (precomputed once). Return an object user ⇒ password, or <code>null</code> when the digest is not in the table. Digests in a dump may be upper case; the table uses lower case. Keys like <code>"toString"</code> must not be found on the object prototype.</p>',
  vi: '<p>Bạn là kẻ tấn công năm 2012, vì mục đích học. <code>leaked</code> ánh xạ người dùng ⇒ digest SHA-1 hex không muối lấy từ bản dump; <code>table</code> ánh xạ digest ⇒ mật khẩu (tính sẵn một lần). Trả về object người dùng ⇒ mật khẩu, hoặc <code>null</code> khi digest không có trong bảng. Digest trong dump có thể viết hoa; bảng dùng chữ thường. Khoá kiểu <code>"toString"</code> không được tìm thấy trên prototype của object.</p>',
  goiY: [['One loop over the leaked users; one lookup each.', 'Một vòng lặp qua người dùng bị lộ; mỗi người tra một lần.'], ['Use hasOwnProperty, not table[h] !== undefined.', 'Dùng hasOwnProperty, không dùng table[h] !== undefined.']],
  loi: [['Forgetting toLowerCase — the same digest is missed.', 'Quên toLowerCase — cùng digest mà tra trượt.'], ['table["toString"] returns a function, not undefined.', 'table["toString"] trả về một hàm, không phải undefined.']],
  gt: ['This is the whole attack: no decryption, just a dictionary from hash to password. It runs in milliseconds for millions of users — exactly why salts (and slow hashes) exist.', 'Đây là toàn bộ đòn tấn công: không giải mã gì cả, chỉ là từ điển băm ⇒ mật khẩu. Nó chạy trong vài mili giây cho hàng triệu người dùng — chính vì vậy mới có muối (và hàm băm chậm).'],
  kn: ['lookup table attack'],
  tns: [tn('dump', 'bản sao dữ liệu bị lộ')],
  dau: `/** leaked: { user: sha1Hex }, table: { sha1Hex: password } ⇒ { user: password | null } */
function crackUnsalted(leaked, table) {
  // Write your solution here
  var out = {};
  for (var user in leaked) out[user] = table[leaked[user]] || null;
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(crackUnsalted),
  cases: [
    { goi: goi('crackUnsalted', { binh: '7c4a8d09ca3762af61e59520943dc26494f8941b', an: '2677ae8a88965e7c06b060c96529f17ef8b86f18' }, SHA1) },
    { goi: goi('crackUnsalted', { lan: '5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8' }, SHA1), an: true, moTa: ['Upper-case digest', 'Digest viết hoa'] },
    { goi: goi('crackUnsalted', { mallory: 'toString' }, SHA1), an: true, moTa: ['Prototype key', 'Khoá trên prototype'] },
    { goi: goi('crackUnsalted', {}, SHA1), an: true },
    { goi: goi('crackUnsalted', { a: 'b1b3773a05c0ed0176787a4f1574ff0075f7521e', b: 'b1b3773a05c0ed0176787a4f1574ff0075f7521e' }, SHA1), an: true, moTa: ['Two users, same password, same hash', 'Hai người, cùng mật khẩu, cùng bản băm'] },
  ],
});

/* ── 4. Học không nản ── */
const S4 = cs({
  ten: 'Incidents 4 — A study loop that sticks', kho: 'EASY', phut: 5, loai: 'order',
  en: 'The course suggests one rhythm for every lesson. Put the steps in order.',
  vi: 'Khoá gợi ý một nhịp học cho mọi bài. Sắp các bước theo thứ tự.',
  cau: [ord('o1', ['First to last', 'Trước tới sau'], [
    'Watch the slides with the narration (20 minutes)',
    'Run every command of the lesson in LabFlow ID and compare with the real output',
    'Do the 🧪 Practice without looking at the solution',
    'Do the Code Lab set of the lesson',
    'Write three lines in your own notes: what broke, why, and the fix',
  ], ['See it, run it, try it alone, practise it, then write it down: each step makes the next one easier, and the last one is what you will remember in an interview.', 'Xem, chạy, tự thử, luyện, rồi ghi lại: mỗi bước làm bước sau dễ hơn, và bước cuối là thứ bạn nhớ được khi phỏng vấn.'])],
  goiY: [['You cannot compare outputs before running the commands.', 'Không thể so output trước khi chạy lệnh.'], ['Notes come last, in your own words.', 'Ghi chép đi sau cùng, bằng lời của bạn.']],
  loi: [['Reading the solution before trying.', 'Đọc lời giải trước khi thử.'], ['Skipping the real run because “the output is in the lesson”.', 'Bỏ chạy thật vì "output có trong bài rồi".']],
  kn: ['study method'],
});

export default doiDau({ slug: 'auth-0-9-bat-dau-su-co', ten: 'Start here 2/2 — When authentication goes wrong', khoa: KHOA, baiHoc: 'auth-0-9-bat-dau-su-co', de: [S1, S2, S3, S4] });
