// codes.mjs — bài 11.2: ba cách sinh mã ngắn cho dịch vụ rút gọn link
import { createHash, randomInt } from 'node:crypto';

export const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';   // 62 ký tự an toàn trong URL

// (1) Base62 của một số đếm: không bao giờ trùng, nhưng ĐOÁN ĐƯỢC (mã kế tiếp = số kế tiếp)
export function toBase62(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('n phải là số nguyên ≥ 0');
  let s = '';
  do { s = ALPHABET[n % 62] + s; n = Math.floor(n / 62); } while (n > 0);
  return s;
}
export function fromBase62(s) {
  let n = 0;
  for (const ch of s) {
    const d = ALPHABET.indexOf(ch);
    if (d < 0) throw new RangeError(`ký tự lạ: ${ch}`);
    n = n * 62 + d;
  }
  return n;
}

// (2) Ngẫu nhiên: không đoán được, nhưng CÓ THỂ trùng ⇒ phải kiểm và thử lại
export function randomCode(len) {
  let s = '';
  for (let i = 0; i < len; i++) s += ALPHABET[randomInt(62)];
  return s;
}

// (3) Băm URL rồi cắt: cùng URL ⇒ cùng mã (gộp trùng), khác URL vẫn có thể trùng mã
export function hashCode(url, len) {
  const h = createHash('sha256').update(url).digest();
  let n = 0n;
  for (const b of h.subarray(0, 8)) n = (n << 8n) | BigInt(b);       // 64 bit đầu của băm
  let s = '';
  for (let i = 0; i < len; i++) { s += ALPHABET[Number(n % 62n)]; n /= 62n; }
  return s;
}
