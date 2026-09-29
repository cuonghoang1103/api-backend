/**
 * Mã hoá ảnh/chữ của sách riêng TRƯỚC khi lên R2 (AES-256-GCM).
 * ─────────────────────────────────────────────────────────────────────────
 * Vì sao phải mã hoá dù đã có route gác quyền: bucket R2 của web được phục vụ
 * CÔNG KHAI qua tên miền media (mọi khoá trong bucket đều tải được nếu biết
 * tên). Tên khoá ở đây đoán được (`.../trang/p-017.bin`), nên "để ở tiền tố
 * riêng" không phải riêng tư. Mã hoá bằng khoá chỉ nằm trong biến môi trường
 * `SACH_RIENG_KHOA` thì kể cả lộ tên khoá, thứ tải về chỉ là byte rác.
 *
 * Khuôn tệp: "SR1" (3 byte) · iv 12 byte · tag 16 byte · dữ liệu mã hoá.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const DAU = Buffer.from('SR1');

/** Khoá 32 byte từ env (hex 64 ký tự hoặc base64). null = chưa cấu hình. */
export function khoaTuEnv(v = process.env.SACH_RIENG_KHOA): Buffer | null {
  const s = (v ?? '').trim();
  if (!s) return null;
  const b = /^[0-9a-f]{64}$/i.test(s) ? Buffer.from(s, 'hex') : Buffer.from(s, 'base64');
  return b.length === 32 ? b : null;
}

export function maHoa(du: Buffer, khoa: Buffer): Buffer {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', khoa, iv);
  const ct = Buffer.concat([c.update(du), c.final()]);
  return Buffer.concat([DAU, iv, c.getAuthTag(), ct]);
}

export function giaiMa(goi: Buffer, khoa: Buffer): Buffer {
  if (goi.length < 31 || !goi.subarray(0, 3).equals(DAU)) throw new Error('Tệp sách riêng sai khuôn');
  const iv = goi.subarray(3, 15);
  const tag = goi.subarray(15, 31);
  const d = createDecipheriv('aes-256-gcm', khoa, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(goi.subarray(31)), d.final()]);
}
