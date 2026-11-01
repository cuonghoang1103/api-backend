/** Authentication · 2.4 — Chính sách NIST: đọc phép đo luật pha trộn + HIBP thật; tự viết classicVsLength (đếm như demo2/composition.mjs), pwnedFromRange (đọc phản hồi range API); bảng luật → NIST. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s02/_ma.mjs';

const COMP = OUT['24-composition'].split('\n').slice(1);
const HIBP = OUT['24-hibp'].split('\n').slice(1);
const UP = OUT['24-signup'].split('\n').slice(1);

/* ── 1. Đọc phép đo thật ── */
const S1 = cs({
  ten: '2.4-1 — Rules, lists and breaches: read the real runs', kho: 'EASY', phut: 8,
  en: `Lesson 2.4, real runs (01/11/2026):${pre(COMP)}${pre(HIBP)}${pre(UP)}`,
  vi: `Bài 2.4, chạy thật (01/11/2026):${pre(COMP)}${pre(HIBP)}${pre(UP)}`,
  cau: [
    q('c1', ['0 of the top 10,001 pass the classic rules, yet NIST forbids those rules. Why?', '0 trong top 10.001 qua được luật cổ điển, vậy mà NIST cấm các luật đó. Vì sao?'],
      ['People adapt: “Capital + 1!” makes 756 of the top 1,000 pass, and Password1! is in 584,516 breaches', 'Because NIST prefers shorter passwords', 'Because symbols cannot be hashed by argon2id', 'Because the rules reject too many strong passwords like 123456'],
      ['Rules change how a common password is written, not whether it is common. Length (only 1 of 10,001 has 15+ characters) and a blocklist do.', 'Luật đổi cách viết một mật khẩu phổ biến, không đổi việc nó phổ biến. Độ dài (chỉ 1/10.001 dài 15+ ký tự) và danh sách chặn thì có.']),
    q('c2', ['What did the HIBP server learn when LabFlow ID checked 123456?', 'Máy chủ HIBP biết được gì khi LabFlow ID kiểm 123456?'],
      ['Only the prefix 7C4A8, shared by ~2,100 hashes in its reply', 'The full SHA-1 of the password', 'The password, protected by TLS', 'Nothing at all — the check runs offline'],
      ['k-anonymity: 5 hex characters of the SHA-1 go out, every suffix with that prefix comes back, the match happens locally.', 'k-ẩn danh: 5 ký tự hex của SHA-1 đi ra, mọi phần đuôi cùng tiền tố quay về, so khớp làm tại chỗ.']),
    q('c3', ['“iloveyouiloveyou” (16 characters) got BREACHED. Which part of the policy caught it?', '"iloveyouiloveyou" (16 ký tự) nhận BREACHED. Phần nào của chính sách bắt được nó?'],
      ['The HIBP range check at sign-up: 4,707 breaches', 'The 15-character minimum length of NIST rev 4', 'The context-word rule on the email’s local part', 'A composition rule on upper-case and symbols'],
      ['Length passes it and the local list does not contain it; only breach data knows it. That is why sign-up asks HIBP — with a timeout and a logged fail-open.', 'Độ dài cho qua và danh sách cục bộ không có nó; chỉ dữ liệu rò rỉ biết. Vì thế đăng ký hỏi HIBP — có timeout và chọn mở kèm log.']),
  ],
  goiY: [['Which column of numbers changed after “Capital + 1!”?', 'Cột số nào thay đổi sau "viết hoa + 1!"?'], ['What leaves the server: count the hex characters.', 'Thứ gì rời máy chủ: đếm số ký tự hex.']],
  loi: [['“Symbols make passwords strong”.', '"Ký hiệu làm mật khẩu mạnh".'], ['“A hash is safe to send”.', '"Giá trị băm thì gửi đi an toàn".']],
  tns: [tn('blocklist', 'danh sách chặn'), tn('k-anonymity', 'k-ẩn danh')],
  kn: ['password policy'],
});

/* ── 2. Tự viết: classicVsLength ── */
function classicVsLength(words) {
  var classic = function (pw) { return pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw); };
  var forced = words.map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1) + '1!'; });
  return {
    classic: words.filter(classic).length,
    afterCapitalOne: forced.filter(classic).length,
    fifteenPlus: words.filter(function (w) { return Array.from(w).length >= 15; }).length,
  };
}
const TOP = ['password', '123456', '12345678', '1234', 'qwerty', '12345', 'dragon', 'pussy', 'baseball', 'football', 'letmein', 'monkey', '696969', 'abc123', 'mustang', 'michael', 'shadow', 'master', 'jennifer', '111111'];
const S2 = jsBai({
  ten: '2.4-2 — Write classicVsLength(words): measure the rules yourself', kho: 'EASY', phut: 12,
  en: `<p>Recreate <code>demo2/composition.mjs</code>. The classic rule: length ≥ 8, an upper-case letter, a lower-case letter, a digit, and a character that is not a letter or digit. Return <code>{ classic, afterCapitalOne, fifteenPlus }</code>: how many <code>words</code> pass the rule as they are; how many pass after the change people really make (first character upper-cased, <code>"1!"</code> appended); and how many are 15+ code points long. Real run on the SecLists list: 0, 756 of the top 1,000, 1 of 10,001.</p>`,
  vi: `<p>Dựng lại <code>demo2/composition.mjs</code>. Luật cổ điển: dài ≥ 8, có chữ hoa, chữ thường, chữ số, và một ký tự không phải chữ hay số. Trả <code>{ classic, afterCapitalOne, fifteenPlus }</code>: bao nhiêu từ trong <code>words</code> qua luật như nguyên trạng; bao nhiêu qua sau thay đổi người ta thật sự làm (viết hoa ký tự đầu, thêm <code>"1!"</code> ở cuối); và bao nhiêu dài từ 15 code point. Chạy thật trên danh sách SecLists: 0, 756 trong top 1.000, 1 trong 10.001.</p>`,
  goiY: [['Write classic(pw) once and reuse it for both counts.', 'Viết classic(pw) một lần rồi dùng cho cả hai lần đếm.'], ['charAt(0).toUpperCase() + slice(1) + "1!".', 'charAt(0).toUpperCase() + slice(1) + "1!".']],
  loi: [['Testing /[A-Z]/ on the original word only.', 'Chỉ kiểm /[A-Z]/ trên từ gốc.'], ['Counting length with .length — fine for ASCII lists, wrong for Vietnamese or emoji.', 'Đếm độ dài bằng .length — ổn với danh sách ASCII, sai với tiếng Việt hay emoji.']],
  gt: ['Numbers end the argument with a product owner: a rule that every list word passes after two keystrokes does not keep list words out. Length does.', 'Con số kết thúc cuộc tranh luận với chủ sản phẩm: một luật mà từ nào trong danh sách cũng qua sau hai phím bấm thì không giữ được từ trong danh sách ở ngoài. Độ dài thì giữ được.'],
  kn: ['password policy'],
  tns: [tn('composition rules', 'luật pha trộn ký tự')],
  dau: `/** ⇒ { classic, afterCapitalOne, fifteenPlus } */
function classicVsLength(words) {
  // Write your solution here
  var classic = function (pw) { return pw.length >= 8 && /[A-Z]/.test(pw) && /\\d/.test(pw); };
  return { classic: words.filter(classic).length, afterCapitalOne: 0, fifteenPlus: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(classicVsLength),
  cases: [
    { goi: goi('classicVsLength', TOP), moTa: ['The real top 20 of the list', 'Top 20 thật của danh sách'] },
    { goi: goi('classicVsLength', ['Password1!', 'P@ssw0rd!', 'hoa sen nở giữa đầm lầy tháng năm']) },
    { goi: goi('classicVsLength', []), an: true },
    { goi: goi('classicVsLength', ['correcthorsebatterystaple', 'a', 'abcdefg']), an: true },
    { goi: goi('classicVsLength', ['Zz9!zzzz', 'zz9!zzzz']), an: true },
  ],
});

/* ── 3. Tự viết: pwnedFromRange ── */
function pwnedFromRange(sha1Hex, body) {
  var h = String(sha1Hex).toUpperCase();
  if (!/^[0-9A-F]{40}$/.test(h)) return null;
  var suffix = h.slice(5);
  var lines = String(body).split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var parts = lines[i].trim().split(':');
    if (parts.length === 2 && parts[0].toUpperCase() === suffix) return Number(parts[1]);   // padding lines have count 0
  }
  return 0;
}
const SHA = '7C4A8D09CA3762AF61E59520943DC26494F8941B'; // SHA-1 of "123456"
const BODY = ['0018A45C4D1DEF81644B54AB7F969B88D65:10', 'D09CA3762AF61E59520943DC26494F8941B:210461208', '00D4F6E8FA6EECAD2A3AA415EEC418D38EC:0', 'FFFF5BE2E1B3B5ACF3F7C9E29AD87D3E6C3:3'].join('\r\n');
const S3 = jsBai({
  ten: '2.4-3 — Write pwnedFromRange(sha1Hex, body): read the range API', kho: 'MEDIUM', phut: 15,
  en: `<p>You sent the first 5 characters of a password's SHA-1 to <code>https://api.pwnedpasswords.com/range/{prefix}</code>. The body has one line per hash with that prefix: <code>SUFFIX:COUNT</code> (35 hex characters, upper-case), lines end with <code>\\r\\n</code>, padding lines have count 0. Return the count for <code>sha1Hex</code> (either case), <code>0</code> if its suffix is absent, <code>null</code> if <code>sha1Hex</code> is not 40 hex characters. Real run: <code>123456</code> ⇒ 210,461,208. (The cases use a short body: that real line plus three made-up ones; the real reply had about 2,100 lines.)</p>`,
  vi: `<p>Bạn đã gửi 5 ký tự đầu SHA-1 của một mật khẩu tới <code>https://api.pwnedpasswords.com/range/{prefix}</code>. Nội dung trả về có mỗi dòng một giá trị băm cùng tiền tố: <code>PHẦN_ĐUÔI:SỐ_LẦN</code> (35 ký tự hex, viết hoa), dòng kết thúc bằng <code>\\r\\n</code>, dòng đệm có số lần 0. Trả số lần của <code>sha1Hex</code> (hoa hay thường đều được), <code>0</code> nếu không có phần đuôi đó, <code>null</code> nếu <code>sha1Hex</code> không phải 40 ký tự hex. Chạy thật: <code>123456</code> ⇒ 210.461.208. (Các ca dùng một nội dung ngắn: dòng thật đó cộng ba dòng bịa; phản hồi thật có khoảng 2.100 dòng.)</p>`,
  goiY: [['suffix = SHA-1 without its first 5 characters, upper-cased.', 'phần đuôi = SHA-1 bỏ 5 ký tự đầu, viết hoa.'], ['split(/\\r?\\n/) handles both line endings.', 'split(/\\r?\\n/) xử lý cả hai kiểu xuống dòng.']],
  loi: [['Comparing the full 40-character hash with 35-character suffixes.', 'So nguyên 40 ký tự với phần đuôi 35 ký tự.'], ['Keeping "\\r" at the end of the count: Number("3\\r") works, but string compares do not.', 'Để sót "\\r" ở cuối: Number("3\\r") vẫn ra số, nhưng so chuỗi thì hỏng.']],
  gt: ['The server only ever saw the prefix; the decision is made here, on your side. A count of 0 can be a padding line — it still means “not breached”.', 'Máy chủ chỉ thấy tiền tố; quyết định nằm ở phía bạn. Số lần 0 có thể là dòng đệm — vẫn có nghĩa "chưa lộ".'],
  kn: ['k-anonymity'],
  tns: [tn('range query', 'truy vấn theo khoảng'), tn('padding', 'dòng đệm')],
  dau: `/** ⇒ breach count, 0 when absent, null when sha1Hex is malformed */
function pwnedFromRange(sha1Hex, body) {
  // Write your solution here
  var line = body.split('\\n').find(function (l) { return l.indexOf(sha1Hex) === 0; });
  return line ? Number(line.split(':')[1]) : 0;
}
`,
  giai: '// Reference solution\n' + nguon(pwnedFromRange),
  cases: [
    { goi: goi('pwnedFromRange', SHA, BODY), moTa: ['123456 (real count)', '123456 (số lần thật)'] },
    { goi: goi('pwnedFromRange', SHA.toLowerCase(), BODY) },
    { goi: goi('pwnedFromRange', '7C4A800D4F6E8FA6EECAD2A3AA415EEC418D38EC', BODY), an: true, moTa: ['A padding line ⇒ 0', 'Dòng đệm ⇒ 0'] },
    { goi: goi('pwnedFromRange', '7C4A8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', BODY), an: true },
    { goi: goi('pwnedFromRange', '7C4A8D09', BODY), an: true },
    { goi: goi('pwnedFromRange', '7C4A8FFFF5BE2E1B3B5ACF3F7C9E29AD87D3E6C3', BODY.replace(/\r\n/g, '\n')), an: true },
  ],
});

/* ── 4. Bảng: luật → NIST ── */
const V = ['SHALL (required)', 'SHOULD (recommended)', 'SHALL NOT (forbidden)'];
const S4 = cs({
  ten: '2.4-4 — What NIST SP 800-63B-4 says about each rule', kho: 'EASY', phut: 6, loai: 'table',
  en: 'For each rule someone may ask you to add, pick what §3.1.1.2 of NIST SP 800-63B-4 says.',
  vi: 'Với mỗi luật ai đó có thể đòi thêm, chọn điều §3.1.1.2 của NIST SP 800-63B-4 nói.',
  bang: [bang1('b1', ['Rule → NIST', 'Luật → NIST'], [{ ma: 'x', ten: 'Rule' }, { ma: 'n', ten: 'NIST', luaChon: V }], [
    { o: { x: 'At least 15 characters when the password is the only factor' }, a: { n: 'SHALL (required)' } },
    { o: { x: 'One upper-case letter, one digit, one symbol' }, a: { n: 'SHALL NOT (forbidden)' } },
    { o: { x: 'Change the password every 90 days' }, a: { n: 'SHALL NOT (forbidden)' } },
    { o: { x: 'Compare the whole password with a blocklist and say why it was rejected' }, a: { n: 'SHALL (required)' } },
    { o: { x: 'Normalise Unicode to NFC before hashing' }, a: { n: 'SHOULD (recommended)' } },
    { o: { x: 'Allow at least 64 characters' }, a: { n: 'SHOULD (recommended)' } },
    { o: { x: 'A password hint shown on the sign-in page' }, a: { n: 'SHALL NOT (forbidden)' } },
  ], ['Length and the blocklist are required; NFC and a 64+ maximum are recommended; composition rules, scheduled changes and readable hints are forbidden (a change is forced only on evidence of compromise).', 'Độ dài và danh sách chặn là bắt buộc; NFC và độ dài tối đa 64+ là khuyến nghị; luật pha trộn, đổi theo lịch và gợi ý đọc được là bị cấm (chỉ buộc đổi khi có bằng chứng bị lộ).'])],
  goiY: [['The four “SHALL NOT” items of the lesson.', 'Bốn mục "SHALL NOT" của bài.'], ['NFC and the 64-character maximum are SHOULD.', 'NFC và độ dài tối đa 64 là SHOULD.']],
  loi: [['Treating SHALL NOT as “optional”.', 'Coi SHALL NOT là "tuỳ chọn".'], ['Remembering the old 8-character minimum.', 'Nhớ mức tối thiểu 8 ký tự cũ.']],
  kn: ['NIST 800-63B'],
});

export default doiDau({ slug: 'auth-2-4-chinh-sach', ten: '2.4 A password policy from NIST, not from habit', khoa: KHOA, baiHoc: 'auth-2-4-chinh-sach', de: [S1, S2, S3, S4] });
