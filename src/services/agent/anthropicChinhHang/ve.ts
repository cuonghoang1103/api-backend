/**
 * MẬT KHẨU + VÉ của cổng Claude chính hãng — cùng cơ chế với cổng dự phòng
 * modelapi (`congDuPhong.ts`) nhưng MẬT KHẨU RIÊNG và vé RIÊNG:
 *
 *   vé = `ca.<userId>.<phiên bản mật khẩu>.<hạn ms>.<HMAC>` — 30 ngày.
 *
 * Tiền tố `ca.` + chữ ký trên `ca:<nội dung>` ⇒ vé dự phòng không bao giờ dùng
 * được ở đây và ngược lại. Admin đổi/tắt mật khẩu ⇒ mọi vé cũ chết ngay.
 * Bộ đếm thử sai DÙNG CHUNG với cổng dự phòng (5 lần sai / 15 phút).
 *
 * Vé chỉ mở MODEL CAO. CuongMini Free không cần vé.
 */
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../config/database.js';
import { MoKhoaLoi, dangKhoaThuSai, ghiThuSai, ky, phienBan, xoaThuSai } from '../congDuPhong.js';

const KHOA_MAT_KHAU = 'anthropic_chinh_hang_mat_khau';
const HAN_VE_MS = 30 * 24 * 60 * 60 * 1000;

async function docBam(): Promise<string | null> {
  const row = await prisma.appSetting.findUnique({ where: { key: KHOA_MAT_KHAU } });
  return row?.value || null;
}

export async function daBatMatKhauAnthropic(): Promise<boolean> {
  return Boolean(await docBam().catch(() => null));
}

/** Đặt mật khẩu mới (vé cũ chết theo), hoặc `null` để TẮT phần model cao cho người thường. */
export async function datMatKhauAnthropic(matKhau: string | null): Promise<void> {
  const value = matKhau ? await bcrypt.hash(matKhau, 10) : null;
  await prisma.appSetting.upsert({
    where: { key: KHOA_MAT_KHAU },
    update: { value },
    create: { key: KHOA_MAT_KHAU, value },
  });
}

export async function moKhoaAnthropic(userId: number, matKhau: string): Promise<{ ve: string; hetHan: string }> {
  const bam = await docBam();
  if (!bam) throw new MoKhoaLoi('Quản trị chưa bật mật khẩu cổng Claude chính hãng.', 'CHUA_BAT');
  const now = Date.now();
  if (dangKhoaThuSai(userId, now)) throw new MoKhoaLoi('Nhập sai quá nhiều lần. Thử lại sau 15 phút.', 'THU_QUA_NHIEU');
  if (!matKhau || !(await bcrypt.compare(matKhau, bam))) {
    ghiThuSai(userId, now);
    throw new MoKhoaLoi('Sai mật khẩu cổng Claude chính hãng.', 'SAI_MAT_KHAU');
  }
  xoaThuSai(userId);
  const het = now + HAN_VE_MS;
  const noiDung = `${userId}.${phienBan(bam)}.${het}`;
  return { ve: `ca.${noiDung}.${ky(`ca:${noiDung}`)}`, hetHan: new Date(het).toISOString() };
}

export async function veAnthropicHopLe(userId: number, ve: unknown): Promise<boolean> {
  if (typeof ve !== 'string' || ve.length > 200) return false;
  const phan = ve.split('.');
  if (phan.length !== 5 || phan[0] !== 'ca') return false;
  const [, uid, pb, het, chuKy] = phan as [string, string, string, string, string];
  if (Number(uid) !== userId || !(Number(het) > Date.now())) return false;
  const a = Buffer.from(chuKy);
  const b = Buffer.from(ky(`ca:${uid}.${pb}.${het}`));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const bam = await docBam().catch(() => null);
  return Boolean(bam) && phienBan(bam!) === pb;
}
