/** Authentication · Lab 7 — TOTP từ gốc: viết base32Encode/Decode (RFC 4648, thuần); đọc điểm máy chấm. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s07/_ma.mjs';

const TK = OUT['lab-tham-khao'].split('\n').slice(1);
const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(bytes) {
  let bits = 0, val = 0, out = '';
  for (const b of bytes) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += ALPH[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += ALPH[(val << (5 - bits)) & 31];
  return out;
}
const S1 = jsBai({
  ten: 'Lab 7-1 — Write base32Encode(bytes): RFC 4648, no padding', kho: 'MEDIUM', phut: 12,
  en: `<p>The TOTP secret travels as base32. Encode an array of byte values (0–255) into a base32 string over the alphabet <code>ABCDEFGHIJKLMNOPQRSTUVWXYZ234567</code>, no padding: accumulate bits, emit one character per 5 bits, and flush the final partial group. (This is the transport layer under the secret — lesson 7.3.)</p>`,
  vi: `<p>Bí mật TOTP đi dạng base32. Mã hoá một mảng giá trị byte (0–255) thành một chuỗi base32 trên bảng chữ <code>ABCDEFGHIJKLMNOPQRSTUVWXYZ234567</code>, không đệm: gom bit, phát một ký tự mỗi 5 bit, và xả nhóm lẻ cuối. (Đây là tầng vận chuyển dưới bí mật — bài 7.3.)</p>`,
  goiY: [['Shift in 8 bits per byte; emit while you have ≥ 5.', 'Dịch vào 8 bit mỗi byte; phát khi có ≥ 5.'], ['Flush the last partial group, left-aligned.', 'Xả nhóm lẻ cuối, canh trái.']],
  loi: [['Adding = padding (RFC 4648 base32 here has none).', 'Thêm đệm = (base32 RFC 4648 ở đây không có).'], ['Dropping the final partial group.', 'Bỏ nhóm lẻ cuối.']],
  gt: ['Five bits map to one of 32 characters; 8-bit bytes do not divide evenly, so you buffer bits and flush the remainder (7.2, 7.3).', 'Năm bit ánh xạ một trong 32 ký tự; byte 8 bit không chia chẵn, nên bạn đệm bit và xả phần dư (7.2, 7.3).'],
  kn: ['authentication'], tns: [tn('base32 secret', 'bí mật base32')],
  dau: `const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
/** ⇒ a base32 string (no padding) */
function base32Encode(bytes) {
  // Write your solution here
  return '';
}
`,
  giai: '// Reference solution\nconst ALPH = ' + JSON.stringify(ALPH) + ';\n' + nguon(base32Encode),
  cases: [
    { goi: goi('base32Encode', [104, 101, 108, 108, 111]), moTa: ['"hello"', '"hello"'] },
    { goi: goi('base32Encode', [102, 111, 111]), an: true, moTa: ['"foo"', '"foo"'] },
    { goi: goi('base32Encode', [0, 255, 16]), an: true, moTa: ['raw bytes', 'byte thô'] },
  ],
});

function base32Decode(str) {
  const s = String(str).toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0, val = 0; const out = [];
  for (const ch of s) { val = (val << 5) | ALPH.indexOf(ch); bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } }
  return out;
}
const S2 = jsBai({
  ten: 'Lab 7-2 — Write base32Decode(str): back to bytes', kho: 'MEDIUM', phut: 12,
  en: `<p>Reverse it: decode a base32 string to an array of byte values. Upper-case the input, ignore characters outside the alphabet, accumulate 5 bits per character, and emit a byte whenever you have ≥ 8 bits. <code>base32Decode(base32Encode(x))</code> must round-trip.</p>`,
  vi: `<p>Đảo lại: giải mã một chuỗi base32 về một mảng giá trị byte. Hoa hoá đầu vào, bỏ ký tự ngoài bảng chữ, gom 5 bit mỗi ký tự, và phát một byte khi có ≥ 8 bit. <code>base32Decode(base32Encode(x))</code> phải khứ hồi.</p>`,
  goiY: [['Shift in 5 bits per character; emit a byte while you have ≥ 8.', 'Dịch vào 5 bit mỗi ký tự; phát một byte khi có ≥ 8.'], ['indexOf gives the 5-bit value of a character.', 'indexOf cho giá trị 5 bit của một ký tự.']],
  loi: [['Emitting the leftover < 8 bits as a byte.', 'Phát phần dư < 8 bit thành một byte.'], ['Not ignoring characters outside the alphabet.', 'Không bỏ ký tự ngoài bảng chữ.']],
  gt: ['Decoding mirrors encoding: 5 bits in per char, 8 bits out per byte; the trailing < 8 bits are padding and dropped (7.3).', 'Giải mã đối xứng mã hoá: 5 bit vào mỗi ký tự, 8 bit ra mỗi byte; phần đuôi < 8 bit là đệm và bị bỏ (7.3).'],
  kn: ['authentication'], tns: [tn('round-trip', 'khứ hồi')],
  dau: `const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
/** ⇒ an array of byte values (0–255) */
function base32Decode(str) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution\nconst ALPH = ' + JSON.stringify(ALPH) + ';\n' + nguon(base32Decode),
  cases: [
    { goi: goi('base32Decode', 'NBSWY3DP'), moTa: ['⇒ "hello" bytes', '⇒ byte "hello"'] },
    { goi: goi('base32Decode', 'MZXW6'), an: true, moTa: ['⇒ "foo" bytes', '⇒ byte "foo"'] },
    { goi: goi('base32Decode', 'nbswy3dp'), an: true, moTa: ['lower-case accepted', 'nhận chữ thường'] },
  ],
});

const S3 = cs({
  ten: 'Lab 7-3 — Read the reference grade', kho: 'EASY', phut: 5,
  en: `The reference TOTP, graded and tested:${pre(TK.slice(-4))}`,
  vi: `TOTP tham khảo, chấm và test:${pre(TK.slice(-4))}`,
  cau: [
    q('c1', ['The first attempt generates correct 6-digit codes but scores only 5.5/10. Which two checks does it fail, and why?', 'Lần thử đầu sinh mã 6 chữ số đúng nhưng chỉ 5,5/10. Nó trượt hai phép nào, và vì sao?'],
      ['T3 (hardcodes 6 digits, so the 8-digit RFC vectors fail) and T5 (no skew window, so a drifting clock is locked out)', 'T1 and T2, because its base32 and its HOTP core are both broken', 'Only T6, because it throws an exception on empty or missing input', 'None of them — a score of 5.5 out of 10 already counts as a pass'],
      ['It runs and matches at 6 digits, but ignoring the digits option fails the 8-digit vectors (T3) and verifying only the exact step locks out a drifting clock (T5) — 5.5/10 (7.2).', 'Nó chạy và khớp ở 6 chữ số, nhưng lờ tuỳ chọn digits làm trượt vector 8 chữ số (T3) và chỉ xác minh đúng bước khoá một đồng hồ trôi (T5) — 5,5/10 (7.2).']),
  ],
  goiY: [['"Runs" is not "right" — the vectors are 8-digit.', '"Chạy" không phải "đúng" — vector là 8 chữ số.'], ['A drifting clock needs the skew window.', 'Một đồng hồ trôi cần cửa sổ lệch.']],
  loi: [['Thinking correct 6-digit codes means full marks.', 'Tưởng mã 6 chữ số đúng là điểm tối đa.'], ['Thinking 5.5 passes (the bar is 7).', 'Tưởng 5,5 là đạt (ngưỡng là 7).']],
  tns: [tn('machine-graded lab', 'lab chấm bằng máy')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-7-7-lab-totp', ten: 'Lab 7 TOTP from scratch', khoa: KHOA, baiHoc: 'auth-7-7-lab-totp', de: [S1, S2, S3] });
