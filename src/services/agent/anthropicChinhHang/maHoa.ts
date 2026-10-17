/**
 * Mã hoá key Anthropic lúc nằm trong CSDL.
 *
 * Ưu tiên tiện ích sẵn có `utils/crypto.ts` (AES-256-GCM, khoá
 * `APP_ENCRYPTION_KEY`, token `v1.…`). Máy chủ chưa đặt biến đó ⇒ AES-256-GCM
 * với khoá dẫn xuất HKDF từ `JWT_SECRET` (token `j1.…`) — cùng cách
 * `mfa/maHoa.ts` làm khi thiếu khoá riêng.
 *
 * ⚠️ Đổi `APP_ENCRYPTION_KEY`/`JWT_SECRET` ⇒ key cũ không giải được ⇒ cổng coi
 * key đó `loi` và admin phải dán lại. Không bao giờ ghi khoá thô ra log.
 */
import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes } from 'node:crypto';

import { decrypt as giaiMaApp, encrypt as maHoaApp } from '../../../utils/crypto.js';

const AAD = 'anthropic-chinh-hang-key';

function coKhoaApp(): boolean {
  return Boolean(process.env.APP_ENCRYPTION_KEY?.trim());
}

function khoaJwt(): Buffer {
  const jwt = process.env.JWT_SECRET;
  if (!jwt) throw new Error('Thiếu cả APP_ENCRYPTION_KEY lẫn JWT_SECRET — không mã hoá được key Anthropic');
  return Buffer.from(hkdfSync('sha256', jwt, 'cuongthai-anthropic-v1', 'key-store', 32));
}

export function maHoaKhoa(khoa: string): string {
  if (coKhoaApp()) return maHoaApp(khoa, AAD);
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', khoaJwt(), iv);
  c.setAAD(Buffer.from(AAD));
  const ct = Buffer.concat([c.update(khoa, 'utf8'), c.final()]);
  return `j1.${Buffer.concat([iv, c.getAuthTag(), ct]).toString('base64url')}`;
}

export function giaiMaKhoa(token: string): string {
  if (token.startsWith('v1.')) return giaiMaApp(token, AAD);
  if (!token.startsWith('j1.')) throw new Error('Định dạng key mã hoá lạ');
  const goi = Buffer.from(token.slice(3), 'base64url');
  const d = createDecipheriv('aes-256-gcm', khoaJwt(), goi.subarray(0, 12));
  d.setAAD(Buffer.from(AAD));
  d.setAuthTag(goi.subarray(12, 28));
  return Buffer.concat([d.update(goi.subarray(28)), d.final()]).toString('utf8');
}

/** Vân tay để chặn nhập trùng — sha256 của khoá (khoá đủ dài, băm không lộ gì). */
export function vanTayKhoa(khoa: string): string {
  return createHash('sha256').update(khoa).digest('hex');
}

export function duoiKhoa(khoa: string): string {
  return khoa.slice(-4);
}
