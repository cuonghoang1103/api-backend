/** Authentication · 7.2 — TOTP: đọc vector RFC; viết dynamicTruncate + totpCounter (thuần, không HMAC); bảng. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s07/_ma.mjs';

const RFC = OUT['71-totp-rfc'].split('\n').slice(1);
// HMAC-SHA1(secret="12345678901234567890", counter) — the intermediate 20 bytes from RFC 4226 Appendix D.
const HM0 = [0xcc, 0x93, 0xcf, 0x18, 0x50, 0x8d, 0x94, 0x93, 0x4c, 0x64, 0xb6, 0x5d, 0x8b, 0xa7, 0x66, 0x7f, 0xb7, 0xcd, 0xe4, 0xb0];
const HM1 = [0x75, 0xa4, 0x8a, 0x19, 0xd4, 0xcb, 0xe1, 0x00, 0x64, 0x4e, 0x8a, 0xc1, 0x39, 0x7e, 0xea, 0x74, 0x7a, 0x2d, 0x33, 0xab];

const S1 = cs({
  ten: '7.2-1 — TOTP against the RFC, read the run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.7 (real run):${pre(RFC)}`,
  vi: `LabFlow ID v0.7 (chạy thật):${pre(RFC)}`,
  cau: [
    q('c1', ['The hand-written totp() reproduces t=59 → 94287082 and matches otplib. What does that prove?', 'totp() viết tay tái tạo t=59 → 94287082 và khớp otplib. Điều đó chứng minh gì?'],
      ['It conforms to RFC 6238 — the published vectors are the standard’s own conformance test', 'That the otplib package is installed and importable in the project', 'That the system clock on the machine is set to the correct time', 'That HMAC-SHA1 is secure against hash-collision attacks'],
      ['RFC 6238 ships test vectors so any implementation can prove conformance; reproducing them (and matching otplib) is the proof (7.2).', 'RFC 6238 kèm vector thử để mọi cài đặt chứng minh tuân chuẩn; tái tạo chúng (và khớp otplib) là bằng chứng (7.2).']),
    q('c2', ['A code from the previous 30s step is accepted with window=1; one three steps away is rejected. Why a window at all?', 'Một mã từ bước 30s trước được nhận với window=1; một cái cách ba bước bị từ chối. Vì sao cần cửa sổ?'],
      ['Clock drift and typing delay — ±1 step (~±30s) covers them without making the code meaningfully reusable', 'To deliberately let the user guess the code two or three times', 'Because the SHA-1 HMAC is too slow to compute inside one step', 'Because the shared secret is rotated at the start of each step'],
      ['Phone clocks drift and typing takes time; ±1 covers real drift while keeping the code effectively one-time. Widening it lengthens the replay window (7.2).', 'Đồng hồ điện thoại trôi và gõ mất thời gian; ±1 phủ trôi thật mà vẫn giữ mã gần như dùng-một-lần. Nới nó kéo dài cửa sổ phát lại (7.2).']),
  ],
  goiY: [['The RFC publishes inputs and outputs on purpose.', 'RFC công bố đầu vào và đầu ra có chủ đích.'], ['±1 covers drift, not guessing.', '±1 phủ trôi, không phải đoán.']],
  loi: [['Thinking matching otplib is luck.', 'Tưởng khớp otplib là may.'], ['Thinking a bigger window is safer.', 'Tưởng cửa sổ lớn hơn an toàn hơn.']],
  tns: [tn('test vector', 'vector thử'), tn('skew window', 'cửa sổ lệch')],
  kn: ['authentication'],
});

function dynamicTruncate(h, digits = 6) {
  const off = h[h.length - 1] & 0x0f;
  const bin = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 10 ** digits).padStart(digits, '0');
}
const S2 = jsBai({
  ten: '7.2-2 — Write dynamicTruncate(hmacBytes, digits): the HOTP core', kho: 'MEDIUM', phut: 12,
  en: `<p>Given the 20 HMAC bytes and a digit count, return the code. Dynamic truncation (RFC 4226): the low 4 bits of the LAST byte give an offset; read 4 bytes there as a 31-bit number (mask the top bit of the first); take it modulo 10^digits; left-pad with zeros. (This is the whole of HOTP after the HMAC — the HMAC itself needs a library, so it is given to you here.)</p>`,
  vi: `<p>Cho 20 byte HMAC và số chữ số, trả về mã. Cắt động (RFC 4226): 4 bit thấp của byte CUỐI cho một offset; đọc 4 byte ở đó như một số 31 bit (che bit cao của byte đầu); lấy modulo 10^digits; đệm 0 bên trái. (Đây là toàn bộ HOTP sau HMAC — chính HMAC cần một thư viện, nên nó được cho sẵn ở đây.)</p>`,
  goiY: [['offset = last byte & 0x0f.', 'offset = byte cuối & 0x0f.'], ['Mask the first byte with 0x7f to clear the sign bit.', 'Che byte đầu bằng 0x7f để xoá bit dấu.']],
  loi: [['Using a fixed offset instead of the hash-chosen one.', 'Dùng offset cố định thay vì cái do-hash-chọn.'], ['Forgetting to mask the top bit (negative numbers).', 'Quên che bit cao (số âm).']],
  gt: ['The offset is chosen by the hash, so the code does not depend on a fixed slice; masking the sign bit keeps the 31-bit number positive (RFC 4226).', 'Offset do hash chọn, nên mã không phụ thuộc một lát cố định; che bit dấu giữ số 31 bit dương (RFC 4226).'],
  kn: ['authentication'], tns: [tn('dynamic truncation', 'cắt động')],
  dau: `/** ⇒ a zero-padded code of 'digits' digits */
function dynamicTruncate(h, digits = 6) {
  // Write your solution here
  return '000000';
}
`,
  giai: '// Reference solution\n' + nguon(dynamicTruncate),
  cases: [
    { goi: goi('dynamicTruncate', HM0, 6), moTa: ['RFC counter 0, 6 digits', 'RFC counter 0, 6 chữ số'] },
    { goi: goi('dynamicTruncate', HM0, 8), an: true, moTa: ['same bytes, 8 digits', 'cùng byte, 8 chữ số'] },
    { goi: goi('dynamicTruncate', HM1, 6), an: true, moTa: ['RFC counter 1', 'RFC counter 1'] },
  ],
});

function totpCounter(time, step = 30, t0 = 0) {
  return Math.floor((time - t0) / step);
}
const S3 = jsBai({
  ten: '7.2-3 — Write totpCounter(time, step, t0): the clock as the counter', kho: 'EASY', phut: 8,
  en: `<p>TOTP is HOTP whose counter is the number of <code>step</code>-second windows since <code>t0</code>: <code>floor((time − t0) / step)</code>. Default <code>step = 30</code>, <code>t0 = 0</code>. This is the only thing TOTP adds over HOTP.</p>`,
  vi: `<p>TOTP là HOTP với counter là số cửa sổ <code>step</code> giây kể từ <code>t0</code>: <code>floor((time − t0) / step)</code>. Mặc định <code>step = 30</code>, <code>t0 = 0</code>. Đây là thứ duy nhất TOTP thêm so với HOTP.</p>`,
  goiY: [['Use Math.floor, not rounding.', 'Dùng Math.floor, không làm tròn.'], ['Subtract t0 before dividing.', 'Trừ t0 trước khi chia.']],
  loi: [['Rounding instead of flooring.', 'Làm tròn thay vì floor.'], ['Forgetting t0.', 'Quên t0.']],
  gt: ['Every step seconds the counter ticks and the code changes; flooring makes a whole window share one counter (7.2).', 'Mỗi step giây counter nhích và mã đổi; floor khiến cả một cửa sổ chung một counter (7.2).'],
  kn: ['authentication'], tns: [tn('TOTP', 'TOTP')],
  dau: `/** ⇒ the integer counter for a given unix time */
function totpCounter(time, step = 30, t0 = 0) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution\n' + nguon(totpCounter),
  cases: [
    { goi: goi('totpCounter', 59), moTa: ['t=59 ⇒ 1', 't=59 ⇒ 1'] },
    { goi: goi('totpCounter', 1234567890), an: true, moTa: ['a later time', 'một thời điểm sau'] },
    { goi: goi('totpCounter', 100, 30, 60), an: true, moTa: ['with t0=60', 'với t0=60'] },
    { goi: goi('totpCounter', 0), an: true, moTa: ['t=0 ⇒ 0', 't=0 ⇒ 0'] },
  ],
});

const S4 = cs({
  ten: '7.2-4 — HOTP vs TOTP', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each statement with HOTP or TOTP.',
  vi: 'Ghép mỗi phát biểu với HOTP hay TOTP.',
  bang: [bang1('b1', ['Statement → which', 'Phát biểu → cái nào'], [{ ma: 'x', ten: 'Statement' }, { ma: 'q', ten: 'Which', luaChon: ['HOTP', 'TOTP', 'both'] }], [
    { o: { x: 'HMAC + dynamic truncation' }, a: { q: 'both' } },
    { o: { x: 'the counter is floor(time / 30)' }, a: { q: 'TOTP' } },
    { o: { x: 'the counter is an incrementing integer' }, a: { q: 'HOTP' } },
    { o: { x: 'the code changes every 30 seconds' }, a: { q: 'TOTP' } },
  ], ['Both share the HMAC + truncation core; TOTP differs only by making the counter the clock (7.2).', 'Cả hai chung lõi HMAC + cắt; TOTP khác chỉ ở chỗ lấy đồng hồ làm counter (7.2).'])],
  goiY: [['The truncation is shared.', 'Phần cắt là chung.'], ['Only TOTP involves time.', 'Chỉ TOTP dính thời gian.']],
  loi: [['Thinking truncation is TOTP-only.', 'Tưởng cắt chỉ của TOTP.'], ['Thinking HOTP uses the clock.', 'Tưởng HOTP dùng đồng hồ.']],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-7-2-totp', ten: '7.2 TOTP', khoa: KHOA, baiHoc: 'auth-7-2-totp', de: [S1, S2, S3, S4] });
