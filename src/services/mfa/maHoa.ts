/**
 * Khoá cho MFA: mã hoá secret TOTP khi lưu + "tiêu" (pepper) để băm mã khôi phục.
 *
 * - Secret TOTP phải ĐẢO NGƯỢC được (máy chủ cần nó để tính mã), nên MÃ HOÁ
 *   chứ không băm: AES-256-GCM, IV 12 byte ngẫu nhiên mỗi lần, AAD gắn với
 *   userId ⇒ chép chuỗi mã hoá sang dòng của người khác thì giải không ra.
 * - Mã khôi phục KHÔNG cần đảo ngược ⇒ BĂM: HMAC-SHA256 với tiêu. Mã có
 *   ~50 bit ngẫu nhiên nên không cần bcrypt chậm; tiêu nằm ngoài CSDL nên
 *   một bản dump CSDL không đủ để dò ngược.
 *
 * Khoá gốc: `MFA_ENCRYPTION_KEY` (32 byte, base64 hoặc hex — sinh bằng
 * `openssl rand -base64 32`). Thiếu thì DẪN XUẤT từ `JWT_SECRET` bằng HKDF và
 * ghi WARN một lần. ⚠️ Đổi khoá gốc (đặt mới `MFA_ENCRYPTION_KEY` sau khi đã
 * bật MFA bằng khoá dẫn xuất, hoặc đổi `JWT_SECRET` khi đang dùng dẫn xuất)
 * làm MỌI secret đã lưu giải không ra ⇒ admin không qua được bước xác minh.
 * Đặt env TRƯỚC khi bật MFA trên production.
 *
 * Đọc env LƯỜI (trong từng lần gọi) để import module này không có tác dụng phụ.
 */
import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes } from 'node:crypto';
import { logger } from '../../utils/logger.js';

const ALGO = 'aes-256-gcm';
const IV_BYTES = 12;
const TAG_BYTES = 16;
const PHIEN_BAN = 'm1';

let daCanhBao = false;

function khoaGoc(): Buffer {
  const raw = process.env.MFA_ENCRYPTION_KEY?.trim();
  if (raw) {
    let k = Buffer.from(raw, 'base64');
    if (k.length !== 32 && /^[0-9a-fA-F]{64}$/.test(raw)) k = Buffer.from(raw, 'hex');
    if (k.length !== 32) {
      throw new Error('MFA_ENCRYPTION_KEY phải giải ra đúng 32 byte (base64 hoặc hex). Sinh bằng: openssl rand -base64 32');
    }
    return k;
  }
  const jwt = process.env.JWT_SECRET;
  if (!jwt) throw new Error('Thiếu cả MFA_ENCRYPTION_KEY lẫn JWT_SECRET — không có khoá cho MFA');
  if (!daCanhBao) {
    daCanhBao = true;
    logger.warn('[mfa] MFA_ENCRYPTION_KEY chưa đặt — đang dẫn xuất khoá từ JWT_SECRET bằng HKDF. Hãy đặt MFA_ENCRYPTION_KEY riêng TRƯỚC khi bật MFA trên production.');
  }
  return Buffer.from(hkdfSync('sha256', jwt, 'cuongthai-mfa-v1', 'mfa-master', 32));
}

function khoaCon(info: string): Buffer {
  return Buffer.from(hkdfSync('sha256', khoaGoc(), 'cuongthai-mfa-v1', info, 32));
}

/** Mã hoá secret (dạng base32) gắn với userId. Kết quả: `m1.<base64url(iv‖tag‖ct)>`. */
export function maHoaSecret(secretB32: string, userId: number): string {
  const iv = randomBytes(IV_BYTES);
  const c = createCipheriv(ALGO, khoaCon('totp-secret'), iv);
  c.setAAD(Buffer.from(`user:${userId}`));
  const ct = Buffer.concat([c.update(secretB32, 'utf8'), c.final()]);
  return `${PHIEN_BAN}.${Buffer.concat([iv, c.getAuthTag(), ct]).toString('base64url')}`;
}

/** Giải mã — ném lỗi nếu sai khoá, sai userId hoặc bị sửa dù một bit. */
export function giaiMaSecret(token: string, userId: number): string {
  const [v, body] = String(token).split('.', 2);
  if (v !== PHIEN_BAN || !body) throw new Error('Định dạng secret MFA không nhận ra');
  const buf = Buffer.from(body, 'base64url');
  if (buf.length < IV_BYTES + TAG_BYTES + 1) throw new Error('Secret MFA bị cụt');
  const iv = buf.subarray(0, IV_BYTES);
  const tag = buf.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const ct = buf.subarray(IV_BYTES + TAG_BYTES);
  const d = createDecipheriv(ALGO, khoaCon('totp-secret'), iv);
  d.setAAD(Buffer.from(`user:${userId}`));
  d.setAuthTag(tag);
  return Buffer.concat([d.update(ct), d.final()]).toString('utf8');
}

// ─── Mã khôi phục ─────────────────────────────────────────────────────────

const B32_THUONG = 'abcdefghijklmnopqrstuvwxyz234567';
export const SO_MA_KHOI_PHUC = 10;

/** Chuẩn hoá thứ người dùng gõ: bỏ cách/gạch, chữ thường. */
export function chuanHoaMaKhoiPhuc(s: string): string {
  return String(s ?? '').toLowerCase().replace(/[\s-]/g, '');
}

/** 10 mã dạng `xxxxx-xxxxx` (10 ký tự base32 ≈ 50 bit mỗi mã). */
export function sinhMaKhoiPhuc(n = SO_MA_KHOI_PHUC): string[] {
  const out: string[] = [];
  while (out.length < n) {
    const b = randomBytes(10);
    let s = '';
    for (const x of b) s += B32_THUONG[x & 31];
    const ma = `${s.slice(0, 5)}-${s.slice(5)}`;
    if (!out.includes(ma)) out.push(ma);
  }
  return out;
}

/** Băm một mã khôi phục (đã hoặc chưa chuẩn hoá) — tất định, để tra bằng `= ANY(...)`. */
export function bamMaKhoiPhuc(ma: string): string {
  return 'h1:' + createHmac('sha256', khoaCon('recovery-pepper')).update(chuanHoaMaKhoiPhuc(ma)).digest('hex');
}
