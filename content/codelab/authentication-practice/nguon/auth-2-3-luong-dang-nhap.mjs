/** Authentication · 2.3 — Luồng đăng nhập mọi nhánh bằng nhau: đọc phép đo thật (37–39× → 1,0×); tự viết timingVerdict (trung vị + tỉ lệ), checkLength (code point sau NFC); sắp thứ tự luồng đăng nhập. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s02/_ma.mjs';

const NAIVE = OUT['23-naive'].split('\n').slice(1);
const V02 = OUT['23-v02'].split('\n').slice(1);
const UNI = OUT['23-unicode'].split('\n').slice(1);

/* ── 1. Đọc phép đo thật ── */
const S1 = cs({
  ten: '2.3-1 — Same message, different clock: read the real runs', kho: 'EASY', phut: 8,
  en: `The tutorial sign-in (port 4802, early return when the email is unknown):${pre(NAIVE)}LabFlow ID v0.2 (port 4800, dummy hash):${pre(V02)}`,
  vi: `Đăng nhập kiểu bài hướng dẫn (cổng 4802, trả về sớm khi email lạ):${pre(NAIVE)}LabFlow ID v0.2 (cổng 4800, băm giả):${pre(V02)}`,
  cau: [
    q('c1', ['Every response on 4802 is the same 401 body. What still tells an attacker that an@… has an account?', 'Mọi phản hồi ở 4802 đều cùng nội dung 401. Thứ gì vẫn cho kẻ tấn công biết an@… có tài khoản?'],
      ['The time: ~86 ms with a verify, ~2 ms without', 'The Content-Length header of the 401 response', 'The order of the keys inside the JSON body', 'Nothing at all — the two bodies are identical'],
      ['A 37–39× gap is visible in a single request; no statistics needed. The fix makes both paths do one argon2id verify.', 'Chênh 37–39× thấy được ngay trong một request; chẳng cần thống kê. Cách sửa là cho cả hai đường làm một lần kiểm argon2id.']),
    q('c2', ['What makes the 4800 ratio 1.0×?', 'Điều gì làm tỉ lệ ở 4800 thành 1,0×?'],
      ['A dummy hash with today’s PARAMS, verified when no user exists', 'A random sleep of 50–100 ms added to every failure', 'Caching the results of failed logins in memory', 'Returning 404 instead of 401 for unknown emails'],
      ['Same work, not added noise: a random sleep can be averaged away; a real verify cannot.', 'Cùng công sức chứ không phải thêm nhiễu: ngủ ngẫu nhiên có thể bị lấy trung bình mà gỡ đi; một lần kiểm thật thì không.']),
    q('c3', [`The Unicode run printed:<br><code>${UNI.join('<br>')}</code><br>What does NIST SP 800-63B-4 ask for?`, `Lần chạy Unicode in ra:<br><code>${UNI.join('<br>')}</code><br>NIST SP 800-63B-4 yêu cầu gì?`],
      ['NFC normalisation before hashing, on both sign-up and sign-in', 'NFKC normalisation', 'Rejecting every non-ASCII password', 'Lower-casing the password'],
      ['Precomposed (dựng sẵn) and decomposed (tổ hợp) Vietnamese differ in bytes (25 vs 27). NIST says SHOULD apply NFC — not NFKC.', 'Tiếng Việt dựng sẵn và tổ hợp khác nhau về byte (25 vs 27). NIST nói SHOULD áp NFC — không phải NFKC.']),
  ],
  goiY: [['Compare medians, not single requests.', 'So trung vị, không so từng request.'], ['Which path skips argon2?', 'Đường nào bỏ qua argon2?']],
  loi: [['“Same message ⇒ no enumeration”.', '"Cùng thông báo ⇒ không dò được".'], ['Adding a random sleep instead of equal work.', 'Thêm ngủ ngẫu nhiên thay vì công sức bằng nhau.']],
  tns: [tn('account enumeration', 'dò tài khoản'), tn('dummy hash', 'băm giả')],
  kn: ['user enumeration'],
});

/* ── 2. Tự viết: timingVerdict ── */
function timingVerdict(a, b) {
  var med = function (xs) {
    var s = xs.slice().sort(function (x, y) { return x - y; });
    var n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  };
  var ma = med(a), mb = med(b);
  var ratio = Math.max(ma, mb) / Math.max(Math.min(ma, mb), 0.001);
  return { medianA: ma, medianB: mb, ratio: Math.round(ratio * 10) / 10, verdict: ratio < 1.5 ? 'SAME' : 'LEAKS' };
}
const S2 = jsBai({
  ten: '2.3-2 — Write timingVerdict(a, b): what the grader’s T6 does', kho: 'MEDIUM', phut: 15,
  en: `<p><code>a</code> and <code>b</code> are response times in ms for “no such email” and “wrong password”. Return <code>{ medianA, medianB, ratio, verdict }</code>: the medians (even count ⇒ mean of the two middle values; do not modify the arrays), <code>ratio = max / min</code> rounded to 1 decimal (a minimum of 0 counts as 0.001), and <code>verdict</code> = <code>'SAME'</code> when the unrounded ratio is &lt; 1.5, else <code>'LEAKS'</code>. Lab 2's grader uses exactly this rule.</p>`,
  vi: `<p><code>a</code> và <code>b</code> là thời gian phản hồi (ms) cho "email không tồn tại" và "sai mật khẩu". Trả <code>{ medianA, medianB, ratio, verdict }</code>: các trung vị (số phần tử chẵn ⇒ trung bình hai giá trị giữa; không sửa mảng), <code>ratio = lớn / nhỏ</code> làm tròn 1 chữ số (giá trị nhỏ bằng 0 thì tính là 0,001), và <code>verdict</code> = <code>'SAME'</code> khi tỉ lệ chưa làm tròn &lt; 1,5, ngược lại <code>'LEAKS'</code>. Máy chấm Lab 2 dùng đúng luật này.</p>`,
  goiY: [['Sort a COPY: xs.slice().sort((x, y) => x - y).', 'Sắp một BẢN SAO: xs.slice().sort((x, y) => x - y).'], ['Decide on the unrounded ratio, report the rounded one.', 'Quyết định theo tỉ lệ chưa làm tròn, báo cáo tỉ lệ đã làm tròn.']],
  loi: [['sort() without a comparator sorts numbers as text: [10, 9, 100] ⇒ [10, 100, 9].', 'sort() không có hàm so sánh sắp số như chữ: [10, 9, 100] ⇒ [10, 100, 9].'], ['Comparing means: one slow outlier decides the verdict.', 'So trung bình cộng: một giá trị chậm bất thường quyết định kết luận.']],
  gt: ['Medians resist the occasional slow request (garbage collection, a busy core); the ratio is symmetric, so it does not matter which case is slower. 1.5× is generous on purpose: a real leak here is 37× or more.', 'Trung vị chịu được request chậm thỉnh thoảng (dọn rác, một nhân bận); tỉ lệ đối xứng nên không quan trọng trường hợp nào chậm hơn. 1,5× là rộng rãi có chủ đích: chỗ rò thật ở đây là 37× trở lên.'],
  kn: ['timing side channel'],
  tns: [tn('median', 'trung vị')],
  dau: `/** a, b = response times (ms) ⇒ { medianA, medianB, ratio, verdict } */
function timingVerdict(a, b) {
  // Write your solution here
  var avg = function (xs) { return xs.reduce(function (s, x) { return s + x; }, 0) / xs.length; };
  var r = avg(b) / avg(a);
  return { medianA: avg(a), medianB: avg(b), ratio: Math.round(r * 10) / 10, verdict: r < 1.5 ? 'SAME' : 'LEAKS' };
}
`,
  giai: '// Reference solution\n' + nguon(timingVerdict),
  cases: [
    { goi: goi('timingVerdict', [2.3, 2.1, 2.6, 2.2, 9.8], [86.5, 85.9, 87.0, 86.1, 85.7]), moTa: ['Like port 4802', 'Như cổng 4802'] },
    { goi: goi('timingVerdict', [86.3, 85.8, 87.2, 86.0], [86.8, 87.1, 85.9, 86.4]), moTa: ['Like port 4800', 'Như cổng 4800'] },
    { goi: goi('timingVerdict', [10, 9, 100], [10, 11, 9]), an: true, moTa: ['Numbers sorted as numbers', 'Số phải sắp như số'] },
    { goi: goi('timingVerdict', [0, 0, 0], [35.2, 34.9, 36.0]), an: true },
    { goi: goi('timingVerdict', [70.8, 71.2, 69.9, 70.1], [83.4, 84.0, 82.9, 83.8]), an: true, moTa: ['A bcrypt-10 dummy: 1.2× — under the 1.5× line, still a small signal', 'Băm giả bcrypt-10: 1,2× — dưới ngưỡng 1,5×, vẫn là tín hiệu nhỏ'] },
    { goi: goi('timingVerdict', [100, 140], [100, 160]), an: true },
  ],
});

/* ── 3. Tự viết: checkLength ── */
function checkLength(password, min, max) {
  if (typeof password !== 'string') return 'NOT_A_STRING';
  var n = Array.from(password.normalize('NFC')).length;   // code points after NFC, as NIST counts
  return n < min ? 'TOO_SHORT' : n > max ? 'TOO_LONG' : 'OK';
}
const NFD15 = 'ờ'.repeat(15).normalize('NFD');
const S3 = jsBai({
  ten: '2.3-3 — Write checkLength(password, min, max): count like NIST', kho: 'EASY', phut: 10,
  en: `<p>NIST SP 800-63B-4: normalise to <b>NFC</b>, then each Unicode <b>code point</b> counts as one character. Return <code>'TOO_SHORT'</code>, <code>'TOO_LONG'</code> or <code>'OK'</code>; a non-string ⇒ <code>'NOT_A_STRING'</code>. A Vietnamese letter typed as “Unicode tổ hợp” is 2 code points before NFC and 1 after; an emoji is 1 code point but 2 UTF-16 units (<code>.length</code> = 2).</p>`,
  vi: `<p>NIST SP 800-63B-4: chuẩn hoá về <b>NFC</b>, rồi mỗi <b>code point</b> Unicode tính là một ký tự. Trả <code>'TOO_SHORT'</code>, <code>'TOO_LONG'</code> hoặc <code>'OK'</code>; không phải chuỗi ⇒ <code>'NOT_A_STRING'</code>. Một chữ tiếng Việt gõ kiểu "Unicode tổ hợp" là 2 code point trước NFC và 1 sau NFC; một emoji là 1 code point nhưng 2 đơn vị UTF-16 (<code>.length</code> = 2).</p>`,
  goiY: [["password.normalize('NFC') first.", "password.normalize('NFC') trước."], ['Array.from(str).length or [...str].length counts code points.', 'Array.from(str).length hoặc [...str].length đếm code point.']],
  loi: [['password.length counts UTF-16 units: emoji count twice, tổ hợp letters count twice.', 'password.length đếm đơn vị UTF-16: emoji tính hai lần, chữ tổ hợp tính hai lần.'], ['Counting before NFC: “ờ” typed decomposed counts as 2.', 'Đếm trước NFC: "ờ" gõ tổ hợp bị tính 2.']],
  gt: ['The same visible password must give the same length and the same bytes whatever keyboard typed it — that is why NFC comes before both counting and hashing.', 'Cùng một mật khẩu nhìn thấy phải cho cùng độ dài và cùng chuỗi byte bất kể bộ gõ nào — vì thế NFC đứng trước cả việc đếm lẫn việc băm.'],
  kn: ['Unicode normalization'],
  tns: [tn('code point', 'điểm mã Unicode'), tn('NFC', 'dạng chuẩn ghép')],
  dau: `/** ⇒ 'TOO_SHORT' | 'TOO_LONG' | 'OK' | 'NOT_A_STRING' */
function checkLength(password, min, max) {
  // Write your solution here
  return password.length < min ? 'TOO_SHORT' : password.length > max ? 'TOO_LONG' : 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(checkLength),
  cases: [
    { goi: goi('checkLength', 'an-lab-2026', 15, 128) },
    { goi: goi('checkLength', 'hoa sen nở giữa đầm lầy tháng năm', 15, 128) },
    { goi: goi('checkLength', NFD15, 15, 15), an: true, moTa: ['15 letters typed “tổ hợp”', '15 chữ gõ kiểu "tổ hợp"'] },
    { goi: goi('checkLength', '🔒🔒🔒🔒🔒🔒🔒🔒', 8, 8), an: true, moTa: ['8 emoji = 8 characters', '8 emoji = 8 ký tự'] },
    { goi: goi('checkLength', 'x'.repeat(129), 15, 128), an: true },
    { goi: 'checkLength(undefined, 15, 128)', an: true },
    { goi: goi('checkLength', '', 15, 128), an: true },
  ],
});

/* ── 4. Sắp thứ tự luồng đăng nhập ── */
const S4 = cs({
  ten: '2.3-4 — Put LabFlow ID v0.2’s sign-in in order', kho: 'EASY', phut: 6, loai: 'order',
  en: 'The steps of v0.2’s POST /sign-in, scrambled. Put them in the order the server must run them.',
  vi: 'Các bước của POST /sign-in trong v0.2, đã bị xáo. Sắp theo đúng thứ tự máy chủ phải chạy.',
  cau: [ord('o1', ['First to last', 'Trước tới sau'], [
    'Reject a body over 8 kB (413) before parsing JSON',
    'Check types and the 128-character cap',
    'Trim and lower-case the email, look the user up',
    'Verify the NFC password against the user’s hash — or against DUMMY when there is no user',
    'No user or wrong password ⇒ the one generic 401',
    'Correct and outdated ⇒ store a new hash with today’s PARAMS',
    'Flag must_change_password if the password is on the blocklist, then create the session',
  ], ['Cheap rejections that depend only on the caller’s own input come first; the single real verify happens on every path; everything account-specific (rehash, flags, session) comes only after the password verified.', 'Các lần từ chối rẻ chỉ phụ thuộc đầu vào của chính người gọi đứng trước; lần kiểm thật duy nhất xảy ra ở mọi đường; mọi thứ riêng của tài khoản (băm lại, cờ, phiên) chỉ đến sau khi mật khẩu khớp.'])],
  goiY: [['What may depend on the account, and when?', 'Điều gì được phụ thuộc vào tài khoản, và khi nào?'], ['The verify runs on every path.', 'Lần kiểm chạy ở mọi đường.']],
  loi: [['Rehashing before checking the password.', 'Băm lại trước khi kiểm mật khẩu.'], ['Returning early when the user is missing.', 'Trả về sớm khi không có người dùng.']],
  kn: ['user enumeration'],
});

export default doiDau({ slug: 'auth-2-3-luong-dang-nhap', ten: '2.3 The login flow, with every branch equal', khoa: KHOA, baiHoc: 'auth-2-3-luong-dang-nhap', de: [S1, S2, S3, S4] });
