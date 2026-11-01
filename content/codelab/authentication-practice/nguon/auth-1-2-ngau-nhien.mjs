/** Authentication · 1.2 — Ngẫu nhiên, và bao nhiêu bit là đủ: định dạng token thật, Math.random bị đoán trước; tự viết tokenMath, unbiasedDigits. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s01/_ma.mjs';

/* ── 1. Định dạng token thật ── */
const DONG = OUT['12-dinh-dang'].split('\n').slice(1).map((l) => /^(.*?)\s{2,}(\d+) chars ·\s+(\d+) random bits/.exec(l)).filter(Boolean);
const S1 = cs({
  ten: '1.2-1 — Length is not entropy (real output)', kho: 'EASY', phut: 8, loai: 'table',
  en: 'demo1/token-formats.mjs generates one value in each of six ways. Work out how many characters each has and how many of its bits are actually random (unpredictable to an attacker) — the real printed output appears in the explanation after Submit.',
  vi: 'demo1/token-formats.mjs sinh một giá trị theo mỗi cách trong sáu cách. Tính xem mỗi cái dài bao nhiêu ký tự và bao nhiêu bit thật sự ngẫu nhiên (kẻ tấn công không đoán trước được) — output thật được in trong phần giải thích sau khi Nộp.',
  bang: [bang1('b1', ['Format → chars, random bits', 'Định dạng → ký tự, bit ngẫu nhiên'], [{ ma: 'f', ten: 'How it was made' }, { ma: 'c', ten: 'Characters' }, { ma: 'b', ten: 'Random bits' }],
    DONG.map((m) => ({ o: { f: m[1].trim() }, a: { c: m[2], b: m[3] } })),
    [`Real output: ${OUT['12-dinh-dang'].split('\n').slice(1).map((l) => l.replace(/ · [^·]*$/, '')).join(' | ')}. hex = 4 bits per character, base64url = 6 bits per character, a UUIDv4 spends 6 of its 128 bits on version/variant, and Math.random() gives 0 bits of security because its state can be recovered (next question).`, `Output thật: ${OUT['12-dinh-dang'].split('\n').slice(1).map((l) => l.replace(/ · [^·]*$/, '')).join(' | ')}. hex = 4 bit mỗi ký tự, base64url = 6 bit mỗi ký tự, UUIDv4 tốn 6 trong 128 bit cho version/variant, còn Math.random() cho 0 bit an toàn vì trạng thái của nó khôi phục được (câu sau).`])],
  goiY: [['bytes × 2 = hex characters; ceil(bytes × 4 / 3) = base64url characters (no padding).', 'byte × 2 = ký tự hex; ceil(byte × 4 / 3) = ký tự base64url (không đệm).'], ['newToken adds the 9 characters "lfid_ses_".', 'newToken thêm 9 ký tự "lfid_ses_".']],
  loi: [['128 bits for a UUID: 6 bits are fixed.', '128 bit cho UUID: 6 bit là cố định.'], ['Counting the prefix as randomness.', 'Tính cả tiền tố là ngẫu nhiên.']],
  kn: ['entropy'],
});

/* ── 2. Math.random bị đoán ── */
const S2 = cs({
  ten: '1.2-2 — Math.random is a formula', kho: 'MEDIUM', phut: 10,
  en: `Real runs of lesson 1.2:${pre(OUT['12-hat-giong'])}${pre(OUT['12-doan-3'].split('\n').slice(0, 2).concat(['…']))}${pre(OUT['12-doan-4'].split('\n').slice(0, 2).concat(['…'], OUT['12-doan-4'].split('\n').slice(-2)))}`,
  vi: `Các lần chạy thật của bài 1.2:${pre(OUT['12-hat-giong'])}${pre(OUT['12-doan-3'].split('\n').slice(0, 2).concat(['…']))}${pre(OUT['12-doan-4'].split('\n').slice(0, 2).concat(['…'], OUT['12-doan-4'].split('\n').slice(-2)))}`,
  cau: [
    q('c1', ['Two processes with --random-seed=42 printed the same Math.random() but different randomBytes(). What does that show?', 'Hai tiến trình với --random-seed=42 in ra cùng Math.random() nhưng randomBytes() khác nhau. Điều đó cho thấy gì?'],
      ['Math.random is a seeded formula; randomBytes asks the OS', 'Both are equally random; the flag is simply broken', 'randomBytes is slower, and slower means more random', 'Math.random is deterministic only in debug builds'],
      ['Same seed ⇒ same sequence: Math.random is a formula. crypto.randomBytes reads OS entropy every time.', 'Cùng hạt giống ⇒ cùng dãy: Math.random là một công thức. crypto.randomBytes đọc entropy của hệ điều hành mỗi lần.']),
    q('c2', ['With 3 observed outputs the solver found 116 of 128 state bits; with 4 it found 128 and predicted the next 5 exactly. Why does 4 work?', 'Với 3 số quan sát, bộ giải tìm được 116/128 bit trạng thái; với 4 số thì đủ 128 và đoán đúng 5 số tiếp theo. Vì sao 4 thì được?'],
      ['Each output gives 52 linear equations; 4 give all 128 bits', 'The fourth number happens to contain the original seed', 'Four numbers are enough to brute-force all 128 bits', 'V8 resets the generator after every fourth call'],
      ['The update is XOR and shifts — linear over bits — so outputs become equations; Gaussian elimination solves them. No brute force at all.', 'Phép cập nhật chỉ là XOR và dịch bit — tuyến tính trên bit — nên output thành phương trình; khử Gauss giải chúng. Không dò vét gì cả.']),
    q('c3', ['What should generate LabFlow ID session ids, reset tokens and API keys?', 'Cái gì nên sinh id phiên, token đặt lại mật khẩu và API key của LabFlow ID?'],
      ['crypto.randomBytes / crypto.randomUUID / crypto.randomInt — the OS CSPRNG', 'Math.random() with Date.now() mixed in', 'A UUIDv1', 'An incrementing counter, hashed with SHA-256'],
      ['Mixing a clock into Math.random adds a guessable value to a predictable one. A hashed counter is just as predictable as the counter.', 'Trộn đồng hồ vào Math.random là cộng một giá trị đoán được vào một giá trị dự đoán được. Băm một bộ đếm thì vẫn dự đoán được như bộ đếm.']),
  ],
  goiY: [['Deterministic = same input, same output.', 'Tất định = cùng đầu vào, cùng đầu ra.'], ['Count equations against unknowns.', 'Đếm số phương trình so với số ẩn.']],
  loi: [['Believing more digits of Math.random() means more security.', 'Tin rằng Math.random() nhiều chữ số hơn là an toàn hơn.'], ['Hashing a predictable value and calling it random.', 'Băm một giá trị dự đoán được rồi gọi là ngẫu nhiên.']],
  tns: [tn('CSPRNG', 'bộ sinh số ngẫu nhiên an toàn mật mã'), tn('seed', 'hạt giống của bộ sinh')],
  kn: ['CSPRNG'],
});

/* ── 3. Tự viết: tokenMath ── */
function tokenMath(bits, encoding) {
  var bytes = Math.ceil(bits / 8);
  var chars;
  if (encoding === 'hex') chars = bytes * 2;
  else if (encoding === 'base64url') chars = Math.ceil(bytes * 4 / 3);
  else if (encoding === 'base64') chars = Math.ceil(bytes / 3) * 4;            // padded with "="
  else return null;
  var guesses = Math.pow(2, bits - 1);                                       // on average, half of the space
  var years = guesses / 1e12 / (365.25 * 24 * 3600);
  return { bytes: bytes, chars: chars, averageYearsAt1e12: Number(years.toExponential(1)) };
}
const S3 = jsBai({
  ten: '1.2-3 — Write tokenMath(bits, encoding)', kho: 'MEDIUM', phut: 12,
  en: `<p>Turn a security target into a token size. <code>tokenMath(bits, encoding)</code> returns <code>{ bytes, chars, averageYearsAt1e12 }</code>: <code>bytes = ceil(bits / 8)</code>; characters for <code>hex</code> (2 per byte), <code>base64url</code> (no padding: ceil(bytes × 4 / 3)) or <code>base64</code> (padded: ceil(bytes / 3) × 4); and the average time to guess at 10<sup>12</sup> guesses/s — half the space, 2<sup>bits−1</sup> / 10<sup>12</sup> seconds, in years of 365.25 days — rounded with <code>Number(x.toExponential(1))</code>. Unknown encoding ⇒ <code>null</code>. (demo1/bits.mjs printed 64 bits ⇒ 106.8 days, 128 bits ⇒ 5.4e+18 years.)</p>`,
  vi: `<p>Biến một mục tiêu an toàn thành kích thước token. <code>tokenMath(bits, encoding)</code> trả <code>{ bytes, chars, averageYearsAt1e12 }</code>: <code>bytes = ceil(bits / 8)</code>; số ký tự với <code>hex</code> (2 mỗi byte), <code>base64url</code> (không đệm: ceil(bytes × 4 / 3)) hoặc <code>base64</code> (có đệm: ceil(bytes / 3) × 4); và thời gian đoán trung bình ở tốc độ 10<sup>12</sup> lần/giây — một nửa không gian, 2<sup>bits−1</sup> / 10<sup>12</sup> giây, đổi ra năm 365,25 ngày — làm tròn bằng <code>Number(x.toExponential(1))</code>. Encoding lạ ⇒ <code>null</code>. (demo1/bits.mjs in ra 64 bit ⇒ 106,8 ngày, 128 bit ⇒ 5,4e+18 năm.)</p>`,
  goiY: [['Math.pow(2, 255) is fine in a double (≈ 5.8e76).', 'Math.pow(2, 255) vẫn nằm vừa một số double (≈ 5,8e76).'], ['base64url drops the "=" padding; base64 keeps it.', 'base64url bỏ dấu đệm "="; base64 giữ nó.']],
  loi: [['bytes × 4 / 3 without ceil gives 21.33 characters.', 'bytes × 4 / 3 mà không ceil ra 21,33 ký tự.'], ['Using the whole space instead of half for the average.', 'Dùng cả không gian thay vì một nửa khi tính trung bình.']],
  gt: ['16 bytes = 128 bits = 22 base64url characters is the default answer; 32 bytes = 43 characters costs nothing more. The time column is why: even at an absurd 10^12 guesses per second, 128 bits outlives the universe.', '16 byte = 128 bit = 22 ký tự base64url là câu trả lời mặc định; 32 byte = 43 ký tự cũng chẳng tốn thêm gì. Cột thời gian là lý do: kể cả 10^12 lần đoán mỗi giây phi lý, 128 bit vẫn sống lâu hơn vũ trụ.'],
  kn: ['entropy'],
  dau: `/** ⇒ { bytes, chars, averageYearsAt1e12 } or null */
function tokenMath(bits, encoding) {
  // Write your solution here
  var bytes = bits / 8;
  return { bytes: bytes, chars: encoding === 'hex' ? bytes * 2 : bytes * 4 / 3, averageYearsAt1e12: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(tokenMath),
  cases: [
    { goi: goi('tokenMath', 128, 'base64url') },
    { goi: goi('tokenMath', 128, 'hex') },
    { goi: goi('tokenMath', 256, 'base64url'), an: true },
    { goi: goi('tokenMath', 64, 'base64'), an: true },
    { goi: goi('tokenMath', 40, 'hex'), an: true, moTa: ['A recovery code (40 bits)', 'Mã khôi phục (40 bit)'] },
    { goi: goi('tokenMath', 122, 'base64url'), an: true },
    { goi: goi('tokenMath', 128, 'base36'), an: true },
  ],
});

/* ── 4. Tự viết: unbiasedDigits ── */
function unbiasedDigits(bytes, count) {
  var out = '';
  for (var i = 0; i < bytes.length && out.length < count; i++) {
    if (bytes[i] >= 250) continue;            // 250 = 25 × 10: reject 250…255 so every digit has exactly 25 bytes
    out += String(bytes[i] % 10);
  }
  return out.length === count ? out : null;
}
const S4 = jsBai({
  ten: '1.2-4 — Write unbiasedDigits(bytes, count): a fair 6-digit code', kho: 'HARD', phut: 15,
  en: `<p>Lesson 1.2 measured the bias of <code>byte % 10</code> over 1,000,000 bytes:</p>${pre(OUT['12-modulo'].split('\n').slice(1, 4).concat(['…'], OUT['12-modulo'].split('\n').slice(-1)))}<p>Write <code>unbiasedDigits(bytes, count)</code> using <b>rejection sampling</b>: walk the random bytes (0–255) in order, <b>skip</b> any byte ≥ 250, turn the others into <code>byte % 10</code>, stop when you have <code>count</code> digits. Return the digit string, or <code>null</code> if the bytes ran out first. (This is what <code>crypto.randomInt</code> does for you.)</p>`,
  vi: `<p>Bài 1.2 đo độ lệch của <code>byte % 10</code> trên 1.000.000 byte:</p>${pre(OUT['12-modulo'].split('\n').slice(1, 4).concat(['…'], OUT['12-modulo'].split('\n').slice(-1)))}<p>Viết <code>unbiasedDigits(bytes, count)</code> bằng <b>lấy mẫu loại bỏ</b> (rejection sampling): đi qua các byte ngẫu nhiên (0–255) theo thứ tự, <b>bỏ qua</b> byte ≥ 250, đổi các byte còn lại thành <code>byte % 10</code>, dừng khi đủ <code>count</code> chữ số. Trả chuỗi chữ số, hoặc <code>null</code> nếu hết byte trước. (Đây là việc <code>crypto.randomInt</code> làm giùm bạn.)</p>`,
  goiY: [['250 is the largest multiple of 10 that is ≤ 256.', '250 là bội lớn nhất của 10 mà ≤ 256.'], ['Skipping a byte does not count toward the digits.', 'Byte bị bỏ qua không tính vào số chữ số.']],
  loi: [['Rejecting ≥ 255 or > 250 — off by one, digits 0–5 still win.', 'Loại ≥ 255 hay > 250 — lệch một, chữ số 0–5 vẫn thắng.'], ['Returning a shorter code when bytes run out instead of null.', 'Trả mã ngắn hơn khi hết byte thay vì null.']],
  gt: ['Bytes 0–249 map to each digit exactly 25 times, so every digit is equally likely; the 6 rejected values cost about 2.3% of the bytes. A 6-digit login code with digits 0–5 more likely is easier to guess than it should be.', 'Byte 0–249 ứng với mỗi chữ số đúng 25 lần nên mọi chữ số đều đồng khả năng; 6 giá trị bị loại tốn khoảng 2,3% số byte. Mã đăng nhập 6 chữ số mà 0–5 dễ ra hơn thì dễ đoán hơn mức đáng lẽ.'],
  kn: ['modulo bias', 'rejection sampling'],
  tns: [tn('modulo bias', 'độ lệch do phép chia lấy dư'), tn('rejection sampling', 'lấy mẫu loại bỏ')],
  dau: `/** bytes: array of 0..255, count: digits wanted ⇒ "123456" or null */
function unbiasedDigits(bytes, count) {
  // Write your solution here
  return bytes.slice(0, count).map(function (b) { return b % 10; }).join('');
}
`,
  giai: '// Reference solution\n' + nguon(unbiasedDigits),
  cases: [
    { goi: goi('unbiasedDigits', [12, 255, 47, 250, 3, 199, 88, 61, 7], 6) },
    { goi: goi('unbiasedDigits', [249, 250, 251, 0], 2) },
    { goi: goi('unbiasedDigits', [255, 254, 253, 252, 251, 250], 1), an: true },
    { goi: goi('unbiasedDigits', [], 0), an: true },
    { goi: goi('unbiasedDigits', [10, 20, 30], 6), an: true },
    { goi: goi('unbiasedDigits', [5, 15, 25, 35, 45, 55, 65, 75], 6), an: true },
  ],
});

export default doiDau({ slug: 'auth-1-2-ngau-nhien', ten: '1.2 Randomness, and how many bits is enough', khoa: KHOA, baiHoc: 'auth-1-2-ngau-nhien', de: [S1, S2, S3, S4] });
